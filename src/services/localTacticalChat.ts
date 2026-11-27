import {
  BLUE_CRATES_05,
  CHEMICAL_AREAS_05,
  DISASSEMBLY_SPAWNS_05,
  ELECTRONIC_AREAS_05,
  formatGridSquare,
  LAMANG_POIS,
  MEDICAL_AREAS_05,
  parseGridInputToMeters,
} from "../config/mapConfig";
import {
  ARCHIVE_AMMO,
  ARCHIVE_ARMOR,
  ARCHIVE_BOSSES,
  ARCHIVE_FACTIONS,
  ARCHIVE_FIELD_GUIDES,
  ARCHIVE_INTEL_INDEX,
  ARCHIVE_LOOT_CONTAINERS,
  ARCHIVE_LOOT_ITEMS,
  ARCHIVE_MEDICAL,
  ARCHIVE_NVG,
  ARCHIVE_OPTICS_DEVICES,
  ARCHIVE_PATCH_NOTES,
  ARCHIVE_PROVISIONS,
  ARCHIVE_REGIONS,
  ARCHIVE_SQUAD_ITEMS,
  ARCHIVE_SQUAD_STRIKE,
  ARCHIVE_STORAGE,
  ARCHIVE_UTILITY,
  ARCHIVE_VENDORS,
  ARCHIVE_XP_ACTIONS,
  ARCHIVE_XP_LEVELS,
} from "../data/fieldArchiveData";
import {
  HIDEOUT_ROOMS,
  type DisassemblyRecipeDef,
  type HideoutUpgradeDef,
} from "../data/hideoutData";
import {
  getResolvedPuzzleDoors,
  HACKING_PROGRESSION_PHASES,
  HACKING_TOOL_TIERS,
} from "../data/puzzleDoorsData";
import {
  SLOT_LABELS,
  WEAPON_PARTS_BY_ID,
  WEAPONS_CATALOG,
  type ModSlotType,
} from "../data/weaponLoadoutData";
import {
  getDisassemblySpawnSummary,
  resolveSpawnPointsForMaterial,
  type CatalogMaterial,
} from "../utils/catalogBuilder";
import type { GzwKeyDoorDef } from "../utils/keyBuilder";
import type { GzwTaskDef } from "../utils/taskBuilder";
import type { VendorShopItem } from "../utils/vendorBuilder";
import type { OperatorChatContextPayload } from "../components/TacticalChatDrawer";

export interface LocalChatKnowledge {
  allUpgrades: HideoutUpgradeDef[];
  catalog: CatalogMaterial[];
  disassemblyRecipes: DisassemblyRecipeDef[];
  allTasks: GzwTaskDef[];
  keysCatalog: GzwKeyDoorDef[];
  vendorShopItems: VendorShopItem[];
  operatorContext: OperatorChatContextPayload;
}

export interface LocalChatHistoryTurn {
  role: "user" | "model";
  text: string;
}

export interface LocalChatAnswer {
  reply: string;
  sourcesUsed: string[];
}

interface RankedSection {
  score: number;
  source: string;
  markdown: string;
}

const STOPWORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "what",
  "where",
  "which",
  "when",
  "how",
  "does",
  "can",
  "you",
  "are",
  "from",
  "into",
  "about",
  "need",
  "still",
  "find",
  "get",
  "have",
  "use",
  "best",
  "all",
  "tell",
  "show",
  "give",
  "some",
  "there",
  "this",
  "that",
  "they",
  "them",
  "those",
  "these",
  "its",
  "your",
  "any",
  "put",
  "make",
  "build",
  "unlock",
  "open",
  "attach",
  "required",
  "require",
  "treat",
  "penetrates",
  "penetrate",
  "who",
  "drops",
  "drop",
]);

function normalizeQuerySynonyms(raw: string): string {
  const lower = raw.toLowerCase();
  const additions: string[] = [];

  if (/\b(latest|recent|newest|current)\b/.test(lower) && /\b(update|patch|version|notes|release)\b/.test(lower)) {
    additions.push("0.5.1.1 0.5.1.0 0.5.0.0 changelog");
  }
  if (/\b(red dot|holo|sight|optics|magnifier)\b/.test(lower)) {
    additions.push("collimator scope");
  }
  if (/\b(flashlight|light|torch|ir laser|laser)\b/.test(lower)) {
    additions.push("tactical device");
  }
  if (/\b(ears|earpro|ear pro|headphones|comtac)\b/.test(lower)) {
    additions.push("headset");
  }
  if (/\b(grenade|frag|flashbang|flash|smoke)\b/.test(lower)) {
    additions.push("throwable grenade");
  }
  if (/\b(fix|broken|durability|clean|wear)\b/.test(lower)) {
    additions.push("repair kit");
  }
  if (/\b(hungry|thirsty|eat|drink|food|water|stamina)\b/.test(lower)) {
    additions.push("food drink provision energy hydration");
  }
  if (/\b(pvp|pve|teamkill|friendly fire|circle|red zone)\b/.test(lower)) {
    additions.push("warfare joint operations conflict zones aggressor");
  }
  if (/\b(level up|leveling|xp|exp|rank)\b/.test(lower)) {
    additions.push("experience level threshold");
  }
  if (/\b(valuable|valuables|sell|money|cash|jewel|jewelry)\b/.test(lower)) {
    additions.push("jewellery loot sell price");
  }

  return additions.length > 0 ? `${raw} ${additions.join(" ")}` : raw;
}

function extractTokens(raw: string): string[] {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9.\-+\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length >= 2 && !STOPWORDS.has(t));
}

function scoreEntity(
  primaryName: string,
  secondaryBlob: string,
  queryLower: string,
  tokens: string[]
): number {
  const nameLower = primaryName.trim().toLowerCase();
  const secLower = secondaryBlob.toLowerCase();
  let score = 0;

  if (nameLower.length >= 2 && queryLower.includes(nameLower)) {
    score += 130 + Math.min(40, nameLower.length * 2);
  } else if (queryLower.length >= 3 && nameLower.includes(queryLower)) {
    score += 95;
  }

  let nameHits = 0;
  let totalHits = 0;
  for (const tok of tokens) {
    const stem = tok.endsWith("s") && tok.length >= 4 ? tok.slice(0, -1) : tok;
    const inName = nameLower.includes(tok) || (stem !== tok && nameLower.includes(stem));
    const inSec = secLower.includes(tok) || (stem !== tok && secLower.includes(stem));
    if (inName) {
      nameHits += 1;
      totalHits += 1;
      score += tok.length >= 4 ? 36 : 22;
    } else if (inSec) {
      totalHits += 1;
      score += tok.length >= 4 ? 12 : 7;
    }
  }

  if (tokens.length > 1 && nameHits === tokens.length) {
    score += 45;
  } else if (tokens.length > 1 && totalHits === tokens.length) {
    score += 20;
  }

  return score;
}

function isFollowUpQuery(query: string): boolean {
  const q = query.trim().toLowerCase();
  const wordCount = q.split(/\s+/).filter(Boolean).length;
  return (
    wordCount <= 4 &&
    /\b(it|them|those|these|that|its|next|more|where|how|price|vendor|steps?|spawns?)\b/.test(
      q
    )
  );
}

export function answerFromWebsiteKnowledge(
  rawQuery: string,
  history: LocalChatHistoryTurn[],
  kb: LocalChatKnowledge
): LocalChatAnswer {
  const trimmedQuery = rawQuery.trim();
  const prevUser = [...history]
    .reverse()
    .find((m) => m.role === "user" && m.text.trim() !== trimmedQuery);

  const combinedQuery =
    prevUser && isFollowUpQuery(trimmedQuery)
      ? `${trimmedQuery} ${prevUser.text}`
      : trimmedQuery;

  const effectiveQuery = normalizeQuerySynonyms(combinedQuery);
  const qLower = effectiveQuery.toLowerCase();
  const rawLower = combinedQuery.toLowerCase();
  const tokens = extractTokens(effectiveQuery);
  const ranked: RankedSection[] = [];

  // 0. Direct Grid Coordinate Lookup (e.g., "171 152")
  const gridMatch = trimmedQuery.match(/\b(1[0-9]{2}|2[0-3][0-9])\s*[,\s/]+\s*(1[0-7][0-9])\b/);
  const parsedGrid = gridMatch ? parseGridInputToMeters(gridMatch[0]) : null;
  if (parsedGrid) {
    const dist = (x: number, y: number) => Math.hypot(x - parsedGrid.x, y - parsedGrid.y);
    const nearbyPois = LAMANG_POIS.map((p) => ({
      name:
        p.kind === "sublocation" && p.parentRegion
          ? `${p.parentRegion} · ${p.name}`
          : p.name,
      grid: formatGridSquare(p.x, p.y),
      tier: p.tier,
      lz: p.lz,
      d: Math.round(dist(p.x, p.y)),
    }))
      .sort((a, b) => a.d - b.d)
      .slice(0, 6);

    const nearbyCrates = BLUE_CRATES_05.map((c) => ({
      name: `${c.poi} · ${c.name} (Lv.${c.tier ?? 2})`,
      grid: formatGridSquare(c.x, c.y),
      d: Math.round(dist(c.x, c.y)),
    }))
      .filter((c) => c.d <= 950)
      .sort((a, b) => a.d - b.d)
      .slice(0, 4);

    ranked.push({
      score: 220,
      source: "Tactical Map",
      markdown: [
        `### Grid ${parsedGrid.grid} Area Intel`,
        ...nearbyPois.map(
          (p) =>
            `- **${p.name}** (\`Grid ${p.grid}\` · ${p.d}m away${p.tier ? ` · ${p.tier}` : ""}${
              p.lz ? ` · LZ: ${p.lz}` : ""
            })`
        ),
        ...(nearbyCrates.length > 0
          ? [
              "**Nearby Blue Material Crates:**",
              ...nearbyCrates.map((c) => `- ${c.name} (\`Grid ${c.grid}\`, ${c.d}m)`),
            ]
          : []),
      ].join("\n"),
    });
  }

  // 1. Personal Operator Progress / Missing Materials Intent
  const asksPersonalProgress =
    /\b(my|i need|still need|missing|remaining|stash|progress|left to build|what should i)\b/i.test(
      rawLower
    );
  if (asksPersonalProgress) {
    const ctx = kb.operatorContext;
    const filteredMissing =
      tokens.length > 0
        ? ctx.missingMaterials.filter((m) =>
            tokens.some((t) => m.name.toLowerCase().includes(t))
          )
        : [];
    const listToShow =
      filteredMissing.length > 0 ? filteredMissing : ctx.missingMaterials.slice(0, 10);

    const lines: string[] = [
      `### ${ctx.operatorName} (${ctx.faction}) — Progress Summary`,
      `- **Hideout:** **${ctx.builtCount}/${ctx.totalUpgrades}** upgrades built`,
      `- **Tasks:** **${ctx.completedTasksCount}/${ctx.totalTasksCount}** completed · **Keys Owned:** **${ctx.ownedKeysCount}/${ctx.totalKeysCount}**`,
    ];

    if (ctx.plannedUpgradeNames.length > 0) {
      lines.push(
        `- **Planned Queue:** ${ctx.plannedUpgradeNames.slice(0, 6).join(", ")}`
      );
    }

    if (listToShow.length > 0) {
      lines.push("**Remaining Materials Needed:**");
      for (const m of listToShow) {
        const catalogMatch = kb.catalog.find(
          (c) => c.name.toLowerCase() === m.name.toLowerCase()
        );
        const topSpawn = catalogMatch
          ? resolveSpawnPointsForMaterial(catalogMatch, [])[0]
          : null;
        const spawnHint = topSpawn
          ? ` — *Spawn:* ${topSpawn.title} (\`Grid ${formatGridSquare(
              topSpawn.x,
              topSpawn.y
            )}\`)`
          : "";
        lines.push(
          `- **${m.name}:** need **${m.remaining} more** (${m.have}/${m.need} in stash)${spawnHint}`
        );
      }
    } else {
      lines.push("- **Materials:** All tracked Hideout upgrade materials are stocked!");
    }

    ranked.push({
      score: 185,
      source: "Hideout & Stash",
      markdown: lines.join("\n"),
    });
  }

  // 2. Patch Notes & Changelogs (0.5.0.0 through 0.5.1.1 + 0.5.2.0 Preview)
  const asksPatchNotes =
    /\b(0\.5|0\.5\.0|0\.5\.0\.1|0\.5\.0\.2|0\.5\.1|0\.5\.1\.0|0\.5\.1\.1|0\.5\.2|patch|patches|changelog|update|hotfix|rogue ops|breakthrough|rebalance|what changed)\b/i.test(
      qLower
    );
  if (asksPatchNotes) {
    const scoredPatches = ARCHIVE_PATCH_NOTES.map((p) => ({
      p,
      score:
        scoreEntity(
          `${p.version} ${p.title}`,
          `${p.date} ${p.highlights.join(" ")} ${p.sections
            .map((s) => `${s.heading} ${s.items.join(" ")}`)
            .join(" ")}`,
          qLower,
          tokens
        ) + (rawLower.includes(p.version.toLowerCase()) ? 120 : 25),
    }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 2);

    ranked.push({
      score: Math.max(150, scoredPatches[0]?.score || 150),
      source: "Field Archive · Patches",
      markdown: scoredPatches
        .map(({ p }) =>
          [
            `### ${p.title} (${p.date})`,
            ...p.highlights.map((h) => `- ${h}`),
          ].join("\n")
        )
        .join("\n\n"),
    });
  }

  // 3. Bosses & Unique Boss Drops
  const asksBoss = /\b(boss|bosses|like a boss)\b/i.test(rawLower);
  const scoredBosses = ARCHIVE_BOSSES.map((b) => ({
    b,
    score:
      scoreEntity(
        b.name,
        `${b.fullName} ${b.region} ${b.faction} ${b.notableGear.join(" ")} ${b.spawnLocations.join(
          " "
        )} ${b.linkedTasks.join(" ")}`,
        qLower,
        tokens
      ) + (asksBoss ? 30 : 0),
  }))
    .filter((x) => x.score >= 38)
    .sort((a, b) => b.score - a.score)
    .slice(0, asksBoss ? 5 : 2);

  if (scoredBosses.length > 0 || asksBoss) {
    const list = scoredBosses.length > 0 ? scoredBosses : ARCHIVE_BOSSES.slice(0, 6).map((b) => ({ b, score: 110 }));
    ranked.push({
      score: list[0].score + 15,
      source: "Field Archive · Bosses",
      markdown: [
        "### Lamang Bosses & Unique Drops",
        ...list.map(
          ({ b }) =>
            `- **${b.name}** (${b.region} · ${b.faction}) — *Spawns:* ${b.spawnLocations.join(
              ", "
            )}. *Drops:* **${b.notableGear.join(", ")}**${
              b.linkedTasks.length > 0 ? ` · *Tasks:* ${b.linkedTasks.join(", ")}` : ""
            }`
        ),
      ].join("\n"),
    });
  }

  // 4. Puzzle Doors & Hacking Tools
  const puzzleDoors = getResolvedPuzzleDoors();
  const scoredPuzzles = puzzleDoors
    .map((p) => {
      const sec = `${p.region} ${p.breachBadge} ${p.linkedTasks.join(" ")} ${p.requiredGear.join(
        " "
      )} ${p.requiredKeys.join(" ")}`;
      const bestScore = Math.max(
        scoreEntity(p.name, sec, qLower, tokens),
        scoreEntity(p.sublocation, sec, qLower, tokens),
        scoreEntity(`${p.region} ${p.sublocation}`, sec, qLower, tokens)
      );
      return {
        p,
        score: bestScore + 25,
      };
    })
    .filter((x) => x.score >= 60)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);

  if (scoredPuzzles.length > 0) {
    const topScore = scoredPuzzles[0].score;
    const blocks = scoredPuzzles.map(({ p }) =>
      [
        `### ${p.name}`,
        `- **Location:** ${p.region} · ${p.sublocation} (\`Grid ${p.grid}\` · LZ: **${p.lz}**)`,
        `- **Requirement:** **${p.breachBadge}** (Hacking Tier: **${p.requiredHackingTier}**)`,
        `- **Power vs. Hack:** ${p.powerVsHackVerdict}`,
        p.requiredKeys.length > 0 ? `- **Keys:** ${p.requiredKeys.join(", ")}` : "",
        "**Breach Steps:**",
        ...p.steps.map(
          (s) =>
            `${s.order}. **${s.title}**${
              s.coords ? ` (\`Grid ${s.coords.grid}\`)` : ""
            }: ${s.detail}`
        ),
      ]
        .filter(Boolean)
        .join("\n")
    );
    ranked.push({
      score: topScore,
      source: "Keys & Puzzle Doors",
      markdown: blocks.join("\n\n"),
    });
  }

  const wantsHackingGuide =
    /\b(hacking tool|hack door|hacking|basic hacking|advanced hacking|superior hacking|open channels|wider reach|unrestricted access)\b/i.test(
      qLower
    );
  if (wantsHackingGuide) {
    const matchedTiers = HACKING_TOOL_TIERS.filter(
      (t) =>
        scoreEntity(
          t.name,
          `${t.unlockTaskName} ${t.opensLocks} ${t.components
            .map((c) => `${c.materialName} ${c.disassembleFrom}`)
            .join(" ")}`,
          qLower,
          tokens
        ) >= 35
    );
    const tiersToShow = matchedTiers.length > 0 ? matchedTiers : HACKING_TOOL_TIERS;

    ranked.push({
      score: 165,
      source: "Keys & Hacking Tools",
      markdown: [
        "### Hacking Tool Progression & Crafting",
        ...HACKING_PROGRESSION_PHASES.slice(0, 3).map(
          (ph) => `- **${ph.title}** — ${ph.subtitle}: ${ph.detail}`
        ),
        ...tiersToShow.map((t) => {
          const comps = t.components
            .map(
              (c) =>
                `${c.quantity}x **${c.materialName}** *(disassemble ${c.disassembleFrom} in ${c.bestZones.join(
                  "/"
                )})*`
            )
            .join("; ");
          return `- **${t.name} (${t.shortTag}):** Unlock via **${t.unlockTaskName}** (${t.unlockVendor} ${t.unlockVendorRank}) — ${t.unlockRequirements.join(
            ", "
          )}. **Craft Components:** ${comps}. *Opens:* ${t.opensLocks}`;
        }),
      ].join("\n"),
    });
  }

  // 5. Keys & Keycards
  const scoredKeys = kb.keysCatalog
    .map((k) => ({
      k,
      score: scoreEntity(
        k.name,
        `${k.kind} ${k.region} ${k.sublocation || ""} ${k.doorTarget} ${k.grid} ${k.linkedTasks
          .map((t) => t.name)
          .join(" ")}`,
        qLower,
        tokens
      ),
    }))
    .filter((x) => x.score >= 42)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  if (scoredKeys.length > 0) {
    ranked.push({
      score: scoredKeys[0].score,
      source: "Keys & Locked Doors",
      markdown: [
        "### Matching Keys & Locked Doors",
        ...scoredKeys.map(
          ({ k }) =>
            `- **${k.name}** (${k.kind}) — ${k.region}${
              k.sublocation ? ` · ${k.sublocation}` : ""
            } (\`Grid ${k.grid}\` · LZ: **${k.lz}**). Unlocks: **${k.doorTarget}**${
              k.linkedTasks.length > 0
                ? ` · Tasks: ${k.linkedTasks.map((t) => t.name).join(", ")}`
                : ""
            }`
        ),
      ].join("\n"),
    });
  }

  // 6. Disassembly Recipes & Yields
  const scoredDisassembly = kb.disassemblyRecipes
    .map((d) => {
      const spawnSummary = getDisassemblySpawnSummary(d.name);
      return {
        d,
        spawnSummary,
        score: scoreEntity(
          d.name,
          `${d.category} ${d.station} ${d.outcomes.join(" ")} ${spawnSummary}`,
          qLower,
          tokens
        ),
      };
    })
    .filter((x) => x.score >= 38)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  if (scoredDisassembly.length > 0) {
    ranked.push({
      score: scoredDisassembly[0].score,
      source: "Disassembly",
      markdown: [
        "### Disassembly Recipes & Spawns",
        ...scoredDisassembly.map(({ d, spawnSummary }) => {
          const spawns = DISASSEMBLY_SPAWNS_05.filter(
            (sp) => sp.name.toLowerCase() === d.name.toLowerCase()
          )
            .slice(0, 3)
            .map((sp) => `${sp.poi} (\`Grid ${formatGridSquare(sp.x, sp.y)}\`)`)
            .join(", ");
          return `- **${d.name}** (${d.duration} @ **${d.station}**) → Yields: **${d.outcomes.join(
            ", "
          )}**. *Spawns:* ${spawns || spawnSummary}`;
        }),
      ].join("\n"),
    });
  }

  // 7. Hideout Materials & Upgrades
  const scoredMaterials = kb.catalog
    .map((m) => ({
      m,
      score: scoreEntity(
        m.name,
        `${m.description} ${m.spawnNotes.join(" ")} ${m.usedInUpgrades
          .map((u) => u.name)
          .join(" ")}`,
        qLower,
        tokens
      ),
    }))
    .filter((x) => x.score >= 38)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  if (scoredMaterials.length > 0) {
    ranked.push({
      score: scoredMaterials[0].score,
      source: "Hideout Materials",
      markdown: [
        "### Hideout Materials & Spawn Coordinates",
        ...scoredMaterials.map(({ m }) => {
          const pts = resolveSpawnPointsForMaterial(m, []).slice(0, 4);
          const ptsText =
            pts.length > 0
              ? pts
                  .map(
                    (p) =>
                      `${p.title} (\`Grid ${formatGridSquare(p.x, p.y)}\`${
                        p.lz ? `, LZ ${p.lz}` : ""
                      })`
                  )
                  .join("; ")
              : m.spawnNotes.join("; ");
          const used = m.usedInUpgrades
            .map((u) => `${u.name} (${u.quantity}x)`)
            .join(", ");
          return `- **${m.name}** (Total needed: **${m.required}x**) — *Used in:* ${used}. *Best Spawns:* ${ptsText}`;
        }),
      ].join("\n"),
    });
  }

  const scoredUpgrades = kb.allUpgrades
    .map((u) => {
      const roomName = HIDEOUT_ROOMS[u.room]?.name || u.room;
      return {
        u,
        roomName,
        score: scoreEntity(
          u.name,
          `${u.module} ${roomName} level ${u.level} ${u.benefit} ${u.requirements
            .map((r) => r.name)
            .join(" ")}`,
          qLower,
          tokens
        ),
      };
    })
    .filter((x) => x.score >= 40)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  if (scoredUpgrades.length > 0) {
    ranked.push({
      score: scoredUpgrades[0].score,
      source: "Hideout Upgrades",
      markdown: [
        "### Hideout Upgrades",
        ...scoredUpgrades.map(({ u, roomName }) => {
          const reqs = u.requirements
            .map((r) => `${r.quantity}x ${r.name}`)
            .join(", ");
          return `- **${u.name}** (${roomName}) — *Benefit:* ${u.benefit}. *Requires:* ${reqs}`;
        }),
      ].join("\n"),
    });
  }

  // 8. Tasks & Squad Strike Missions
  const scoredTasks = kb.allTasks
    .map((t) => ({
      t,
      score: scoreEntity(
        t.name,
        `${t.vendor} ${t.category} ${t.areas.join(" ")} ${
          t.objectivesText
        } ${t.relatedItems.map((r) => r.name).join(" ")}`,
        qLower,
        tokens
      ),
    }))
    .filter((x) => x.score >= 42)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (scoredTasks.length > 0) {
    ranked.push({
      score: scoredTasks[0].score,
      source: "Tasks & Walkthroughs",
      markdown: scoredTasks
        .map(({ t }) => {
          const coordsStr =
            t.exactCoords.length > 0
              ? t.exactCoords.map((c) => `${c.label} (\`Grid ${c.grid}\`)`).join(", ")
              : t.areas.join(", ");
          return [
            `### Task: ${t.name} (${t.vendor} · ${t.category})`,
            `- **Location:** ${coordsStr}${
              t.nearestLzs.length > 0 ? ` · Nearest LZs: **${t.nearestLzs.join(", ")}**` : ""
            }`,
            `- **Objectives:** ${
              t.objectivesList.length > 0 ? t.objectivesList.join(" | ") : t.objectivesText
            }`,
            t.walkthroughSteps.length > 0
              ? `- **Walkthrough:** ${t.walkthroughSteps.slice(0, 4).join(" → ")}`
              : "",
            t.relatedItems.length > 0
              ? `- **Items / Keys:** ${t.relatedItems
                  .map((r) => `${r.name} (${r.kind})`)
                  .join(", ")}`
              : "",
          ]
            .filter(Boolean)
            .join("\n");
        })
        .join("\n\n"),
    });
  }

  const scoredSquad = ARCHIVE_SQUAD_STRIKE.map((s) => ({
    s,
    score: scoreEntity(
      s.name,
      `squad strike ${s.vendor} ${s.location}`,
      qLower,
      tokens
    ),
  }))
    .filter((x) => x.score >= 38)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  if (scoredSquad.length > 0) {
    ranked.push({
      score: scoredSquad[0].score,
      source: "Field Archive · Squad Strike",
      markdown: [
        "### Squad Strike Missions",
        ...scoredSquad.map(
          ({ s }) => `- **${s.name}** — **${s.vendor}** · Location: **${s.location}**`
        ),
      ].join("\n"),
    });
  }

  const scoredSquadItems = ARCHIVE_SQUAD_ITEMS.map((i) => ({
    i,
    score: scoreEntity(i.name, "squad strike item", qLower, tokens),
  }))
    .filter((x) => x.score >= 46)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  if (scoredSquadItems.length > 0) {
    ranked.push({
      score: scoredSquadItems[0].score,
      source: "Field Archive · Squad Strike",
      markdown: [
        "### Squad Strike Mission Items",
        ...scoredSquadItems.map(
          ({ i }) =>
            `- **${i.name}** (${i.gridSize || "1x1"}${i.weight ? ` · ${i.weight}` : ""})`
        ),
      ].join("\n"),
    });
  }

  // 9. Weapons & Attachment Compatibility Chains
  const scoredWeapons = WEAPONS_CATALOG.map((w) => ({
    w,
    score: scoreEntity(
      w.name,
      `${w.weaponClass} ${w.caliber} ${w.soldBy || ""} ${w.acceptedAmmo} attachments mounts`,
      qLower,
      tokens
    ),
  }))
    .filter((x) => x.score >= 38)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (scoredWeapons.length > 0) {
    ranked.push({
      score: scoredWeapons[0].score,
      source: "Weapon Loadout",
      markdown: scoredWeapons
        .map(({ w }) => {
          const chains: string[] = [];
          const slotLines: string[] = [];
          for (const [slotKey, ids] of Object.entries(w.slots)) {
            if (!Array.isArray(ids) || ids.length === 0) continue;
            const label = SLOT_LABELS[slotKey as ModSlotType] || slotKey;
            const names = ids
              .slice(0, 4)
              .map((id) => WEAPON_PARTS_BY_ID[id]?.name || id)
              .join(", ");
            slotLines.push(
              `**${label}:** ${names}${ids.length > 4 ? ` (+${ids.length - 4} more)` : ""}`
            );

            for (const pid of ids.slice(0, 3)) {
              const part = WEAPON_PARTS_BY_ID[pid];
              if (!part?.slots) continue;
              const child = Object.entries(part.slots)
                .filter(([, cids]) => Array.isArray(cids) && cids.length > 0)
                .map(([ck, cids]) => {
                  const cLabel = SLOT_LABELS[ck as ModSlotType] || ck;
                  const sample = (cids || [])
                    .slice(0, 2)
                    .map((cid) => WEAPON_PARTS_BY_ID[cid]?.name || cid)
                    .join(", ");
                  return `${cLabel} (${sample})`;
                });
              if (child.length > 0) {
                chains.push(`**${part.name}** unlocks → ${child.join(", ")}`);
              }
            }
          }

          return [
            `### Weapon: ${w.name} (${w.weaponClass} · ${w.caliber})`,
            `- **Stats:** ${w.fireMode} · ${w.fireRate ?? "—"} RPM · ${
              w.accuracyMoa ?? "—"
            } MOA · Ergo ${w.ergonomics} · Sold by **${w.soldBy || "Loot / Tasks"}**${
              w.buyPrice ? ` ($${w.buyPrice.toLocaleString()})` : ""
            }`,
            `- **Compatible Slots:** ${slotLines.slice(0, 5).join(" | ")}`,
            chains.length > 0
              ? `- **Extra Rails / Mounts Required:** ${chains.slice(0, 4).join("; ")}`
              : "",
          ]
            .filter(Boolean)
            .join("\n");
        })
        .join("\n\n"),
    });
  }

  // 10. Optics, Scopes, Collimators, Binoculars, Tactical Lasers & Lights
  const asksOpticsCat = /\b(scopes?|collimators?|optics?|red dots?|magnifiers?|lasers?|flashlights?|binoculars?|rangefinders?)\b/i.test(
    rawLower
  );
  const scoredOptics = ARCHIVE_OPTICS_DEVICES.map((o) => ({
    o,
    score:
      scoreEntity(
        o.name,
        `${o.category} ${o.magnification || ""} ${o.sightingRange || ""} ${o.modes || ""} ${
          o.manufacturer || ""
        } ${o.soldBy} scope optic collimator red dot laser flashlight rangefinder binocular`,
        qLower,
        tokens
      ) + (asksOpticsCat && o.category.toLowerCase().includes("scope") && /\bscopes?\b/i.test(rawLower) ? 25 : asksOpticsCat ? 15 : 0),
  }))
    .filter((x) => x.score >= 34)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);

  if (scoredOptics.length > 0) {
    ranked.push({
      score: scoredOptics[0].score + 10,
      source: "Field Archive · Optics",
      markdown: [
        "### Archive · Optics, Rangefinders & Tactical Devices",
        ...scoredOptics.map(
          ({ o }) =>
            `- **${o.name}** (${o.category}) — ${
              o.magnification ? `**${o.magnification}** · ` : ""
            }${o.sightingRange ? `Range ${o.sightingRange} · ` : ""}${
              o.modes ? `Modes: ${o.modes} · ` : ""
            }**${o.soldBy}**${o.buyPrice ? ` (${o.buyPrice})` : ""}`
        ),
      ].join("\n"),
    });
  }

  // 11. Headsets, Throwables, Repair Kits, Mortar Rounds & Lockboxes
  const asksHeadsetCat = /\b(headsets?|earpro|ear pro|headphones?|sound amplification|comtac|gssh)\b/i.test(
    rawLower
  );
  const asksGrenadeCat = /\b(grenades?|throwables?|frags?|flashbangs?|stuns?|smokes?|m67|f-1|m84|m18)\b/i.test(
    rawLower
  );
  const asksRepairCat = /\b(repair|durability|cleaning set|tool set)\b/i.test(rawLower);
  const asksMortarCat = /\b(mortar|120mm|m933)\b/i.test(rawLower);
  const asksLockboxCat = /\b(lockbox|secure case|safelock|snuck)\b/i.test(rawLower);

  const scoredUtility = ARCHIVE_UTILITY.map((u) => {
    const catLower = u.category.toLowerCase();
    let catBoost = 0;
    if (asksHeadsetCat && catLower.includes("headset")) catBoost += 85;
    if (asksGrenadeCat && catLower.includes("grenade")) catBoost += 85;
    if (asksRepairCat && catLower.includes("repair")) catBoost += 75;
    if (asksMortarCat && catLower.includes("mortar")) catBoost += 85;
    if (asksLockboxCat && catLower.includes("lockbox")) catBoost += 85;
    return {
      u,
      score:
        scoreEntity(
          u.name,
          `${u.category} ${u.statSummary} ${u.soldBy} headset repair kit grenade throwable smoke stun mortar lockbox`,
          qLower,
          tokens
        ) + catBoost,
    };
  })
    .filter((x) => x.score >= 34)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  if (scoredUtility.length > 0) {
    ranked.push({
      score: scoredUtility[0].score + 10,
      source: "Field Archive · Gear & Repair",
      markdown: [
        "### Archive · Headsets, Throwables, Repair Kits & Utility",
        ...scoredUtility.map(
          ({ u }) =>
            `- **${u.name}** (${u.category}) — ${u.statSummary} · **${u.soldBy}**${
              u.buyPrice ? ` (Buy ${u.buyPrice})` : ""
            }${u.sellPrice ? ` · Sell ${u.sellPrice}` : ""}`
        ),
      ].join("\n"),
    });
  }

  // 12. Ammo, Armor, Medical, Provisions, NVGs, Storage
  const scoredAmmo = ARCHIVE_AMMO.map((a) => ({
    a,
    score: scoreEntity(
      a.name,
      `${a.caliber} ammo penetration ap ${a.penetrationNote} ${a.soldBy}`,
      qLower,
      tokens
    ),
  }))
    .filter((x) => x.score >= 34)
    .sort((a, b) => b.score - a.score || b.a.penetrationTier - a.a.penetrationTier)
    .slice(0, 6);

  if (scoredAmmo.length > 0) {
    ranked.push({
      score: scoredAmmo[0].score + 10,
      source: "Field Archive · Ammo",
      markdown: [
        "### Archive · Ammo & Penetration",
        ...scoredAmmo.map(
          ({ a }) =>
            `- **${a.name}** — ${a.penetrationNote}${
              a.muzzleVelocity ? ` · ${a.muzzleVelocity}` : ""
            }${a.accuracyMod ? ` · Acc ${a.accuracyMod}` : ""} · **${a.soldBy}**${
              a.buyPrice ? ` (${a.buyPrice})` : ""
            }`
        ),
      ].join("\n"),
    });
  }

  const scoredArmor = ARCHIVE_ARMOR.map((a) => ({
    a,
    score: scoreEntity(
      a.name,
      `${a.category} ${a.nijClass} ${a.material} ${a.coverage} ${a.soldBy}`,
      qLower,
      tokens
    ),
  }))
    .filter((x) => x.score >= 34)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  if (scoredArmor.length > 0) {
    ranked.push({
      score: scoredArmor[0].score,
      source: "Field Archive · Armor",
      markdown: [
        "### Archive · Armor & Helmets",
        ...scoredArmor.map(
          ({ a }) =>
            `- **${a.name}** (${a.category}) — **${a.nijClass}** · ${a.material} · Coverage: ${a.coverage} · **${a.soldBy}**${
              a.buyPrice ? ` (${a.buyPrice})` : ""
            }`
        ),
      ].join("\n"),
    });
  }

  const scoredMed = ARCHIVE_MEDICAL.map((m) => ({
    m,
    score: scoreEntity(
      m.name,
      `${m.category} ${m.effect} medical bleeding wound splint pain ${m.soldBy}`,
      qLower,
      tokens
    ),
  }))
    .filter((x) => x.score >= 34)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  if (scoredMed.length > 0) {
    ranked.push({
      score: scoredMed[0].score,
      source: "Field Archive · Medical",
      markdown: [
        "### Archive · Medical & Triage",
        ...scoredMed.map(
          ({ m }) =>
            `- **${m.name}** (${m.category}) — ${m.effect} · **${m.soldBy}**${
              m.buyPrice ? ` (${m.buyPrice})` : ""
            }`
        ),
      ].join("\n"),
    });
  }

  const scoredProvisions = ARCHIVE_PROVISIONS.map((p) => ({
    p,
    score: scoreEntity(
      p.name,
      `${p.category} ${p.energy || ""} ${p.hydration || ""} ${
        p.effect || ""
      } ${p.soldBy} food drink provision energy hydration`,
      qLower,
      tokens
    ),
  }))
    .filter((x) => x.score >= 34)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  if (scoredProvisions.length > 0) {
    ranked.push({
      score: scoredProvisions[0].score,
      source: "Field Archive · Provisions",
      markdown: [
        "### Archive · Food, Drinks & Energy",
        ...scoredProvisions.map(
          ({ p }) =>
            `- **${p.name}** (${p.category}) — ${[
              p.energy ? `Energy ${p.energy}` : null,
              p.hydration ? `Hydration ${p.hydration}` : null,
              p.effect,
            ]
              .filter(Boolean)
              .join(" · ")} · **${p.soldBy}**${p.buyPrice ? ` (${p.buyPrice})` : ""}`
        ),
      ].join("\n"),
    });
  }

  const scoredNvg = ARCHIVE_NVG.map((n) => ({
    n,
    score: scoreEntity(
      n.name,
      `${n.phosphor} nvg night vision fov fom ${n.soldBy}`,
      qLower,
      tokens
    ),
  }))
    .filter((x) => x.score >= 34)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  if (scoredNvg.length > 0) {
    ranked.push({
      score: scoredNvg[0].score,
      source: "Field Archive · NVGs",
      markdown: [
        "### Archive · Night Vision (NVGs)",
        ...scoredNvg.map(
          ({ n }) =>
            `- **${n.name}** — **${n.phosphor} Phosphor** · FOV ${n.fov} · FOM **${n.fom}** · **${n.soldBy}**${
              n.buyPrice ? ` (${n.buyPrice})` : ""
            }`
        ),
      ].join("\n"),
    });
  }

  const scoredStorage = ARCHIVE_STORAGE.map((s) => ({
    s,
    score: scoreEntity(s.name, `${s.category} ${s.soldBy}`, qLower, tokens),
  }))
    .filter((x) => x.score >= 36)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  if (scoredStorage.length > 0) {
    ranked.push({
      score: scoredStorage[0].score,
      source: "Field Archive · Storage",
      markdown: [
        "### Archive · Backpacks, Rigs & Cases",
        ...scoredStorage.map(
          ({ s }) =>
            `- **${s.name}** (${s.category}) — ${
              s.capacity ? `**${s.capacity} slots**` : ""
            }${s.gridSize ? ` (${s.gridSize})` : ""} · **${s.soldBy}**${
              s.buyPrice ? ` (${s.buyPrice})` : ""
            }`
        ),
      ].join("\n"),
    });
  }

  // 13. High-Value Loot, Loot Containers, XP/Levels, Factions, Vendors, Intels
  const scoredLoot = ARCHIVE_LOOT_ITEMS.map((i) => ({
    i,
    score: scoreEntity(
      i.name,
      `${i.category} ${i.sellPrice || ""} jewellery loot sell price`,
      qLower,
      tokens
    ),
  }))
    .filter((x) => x.score >= 42)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  if (scoredLoot.length > 0) {
    ranked.push({
      score: scoredLoot[0].score,
      source: "Field Archive · Loot & Valuables",
      markdown: [
        "### Archive · Loot & Jewellery Values",
        ...scoredLoot.map(
          ({ i }) =>
            `- **${i.name}** (${i.category}) — Sell: **${i.sellPrice || "—"}**${
              i.pricePerCell ? ` (${i.pricePerCell}/cell)` : ""
            }${i.gridSize ? ` · Size ${i.gridSize}` : ""}`
        ),
      ].join("\n"),
    });
  }

  const scoredContainers = ARCHIVE_LOOT_CONTAINERS.map((c) => ({
    c,
    score: scoreEntity(c.name, `loot container ${c.layout}`, qLower, tokens),
  }))
    .filter((x) => x.score >= 44)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  if (scoredContainers.length > 0) {
    ranked.push({
      score: scoredContainers[0].score,
      source: "Field Archive · Loot Containers",
      markdown: [
        "### Archive · World Loot Containers",
        ...scoredContainers.map(
          ({ c }) => `- **${c.name}** — Layout: **${c.layout}**`
        ),
      ].join("\n"),
    });
  }

  if (/\b(xp|exp|experience|level|rank|threshold)\b/i.test(qLower)) {
    const matchedLvl = rawLower.match(/\blevel\s*(\d{1,2})\b/);
    const specificLevel = matchedLvl
      ? ARCHIVE_XP_LEVELS.find((l) => l.level === Number(matchedLvl[1]))
      : null;

    ranked.push({
      score: 135,
      source: "Field Archive · XP & Ranks",
      markdown: [
        "### Experience (XP) & Rank Progression",
        ...ARCHIVE_XP_ACTIONS.map(
          (a) => `- **${a.action}** (${a.category}): **+${a.xp} XP**`
        ),
        ...(specificLevel
          ? [
              `- **Level ${specificLevel.level} Requirement:** **${specificLevel.threshold.toLocaleString()} XP**${
                specificLevel.rewards.length > 0
                  ? ` · Unlocks: ${specificLevel.rewards.join(", ")}`
                  : ""
              }`,
            ]
          : [
              `- **Milestone Ranks:** Level 10 (${ARCHIVE_XP_LEVELS[9]?.threshold.toLocaleString()} XP), Level 25 (${ARCHIVE_XP_LEVELS[24]?.threshold.toLocaleString()} XP), Level 40 (${ARCHIVE_XP_LEVELS[39]?.threshold.toLocaleString()} XP), Level 50 (${ARCHIVE_XP_LEVELS[49]?.threshold.toLocaleString()} XP).`,
            ]),
      ].join("\n"),
    });
  }

  const scoredFactions = ARCHIVE_FACTIONS.map((f) => ({
    f,
    score: scoreEntity(f.name, `faction pmc ${f.description}`, qLower, tokens),
  }))
    .filter((x) => x.score >= 45)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (scoredFactions.length > 0) {
    ranked.push({
      score: scoredFactions[0].score,
      source: "Field Archive · Factions",
      markdown: [
        "### Lamang Factions",
        ...scoredFactions.map(({ f }) => `- **${f.name}:** ${f.description}`),
      ].join("\n"),
    });
  }

  const scoredVendorProfiles = ARCHIVE_VENDORS.map((v) => ({
    v,
    score: scoreEntity(v.name, `vendor trader ${v.fullName} ${v.sells} ${v.buys}`, qLower, tokens),
  }))
    .filter((x) => x.score >= 45)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  if (scoredVendorProfiles.length > 0) {
    ranked.push({
      score: scoredVendorProfiles[0].score - 5,
      source: "Field Archive · Vendors",
      markdown: [
        "### Vendor Profiles",
        ...scoredVendorProfiles.map(
          ({ v }) =>
            `- **${v.name}** (${v.fullName}) — *Sells:* ${v.sells} · *Buys:* ${v.buys}`
        ),
      ].join("\n"),
    });
  }

  const scoredIntels = ARCHIVE_INTEL_INDEX.map((it) => ({
    it,
    score: scoreEntity(it.name, `${it.kind}`, qLower, tokens),
  }))
    .filter((x) => x.score >= 52)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  if (scoredIntels.length > 0) {
    ranked.push({
      score: scoredIntels[0].score - 5,
      source: "Field Archive · Intel",
      markdown: [
        "### Matching Intels, Evidence & Military Gear",
        ...scoredIntels.map(({ it }) => `- **${it.name}** (${it.kind})`),
      ].join("\n"),
    });
  }

  // 14. Field Manuals & Guides
  const scoredGuides = ARCHIVE_FIELD_GUIDES.map((g) => ({
    g,
    score: scoreEntity(
      g.title,
      `${g.topic} ${g.summary} ${g.keywords.join(" ")} ${g.bullets.join(" ")}`,
      qLower,
      tokens
    ),
  }))
    .filter((x) => x.score >= 34)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);

  if (scoredGuides.length > 0) {
    for (const { g, score } of scoredGuides) {
      ranked.push({
        score: score + 10,
        source: "Field Archive · Manuals",
        markdown: [`### Guide: ${g.title}`, ...g.bullets.map((b) => `- ${b}`)].join("\n"),
      });
    }
  }

  // 15. Vendor Stock & Map POIs & Regions
  const scoredVendor = kb.vendorShopItems
    .map((v) => ({
      v,
      score: scoreEntity(v.itemName, `${v.vendor} ${v.shopGroup} ${v.type}`, qLower, tokens),
    }))
    .filter((x) => x.score >= 46)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  if (scoredVendor.length > 0) {
    ranked.push({
      score: scoredVendor[0].score - 10,
      source: "Vendors",
      markdown: [
        "### Vendor Stock",
        ...scoredVendor.map(
          ({ v }) =>
            `- **${v.itemName}** (${v.shopGroup}) — **${v.vendor}${
              v.rank ? ` R.${v.rank}` : ""
            }**${v.buyPrice ? ` · ${v.buyPrice}` : ""}`
        ),
      ].join("\n"),
    });
  }

  const matchedRegions = ARCHIVE_REGIONS.map((r) => ({
    r,
    score: scoreEntity(r.name, `${r.enemies} ${r.lzCallsign} tier ${r.tier}`, qLower, tokens),
  }))
    .filter((x) => x.score >= 52)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);

  const matchedPois = LAMANG_POIS.map((p) => ({
    p,
    score: scoreEntity(
      p.name,
      `${p.parentRegion || ""} ${p.tier || ""} ${p.lz || ""} ${p.tags.join(" ")}`,
      qLower,
      tokens
    ),
  }))
    .filter((x) => x.score >= 42)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const matchedSpecialAreas = [
    ...CHEMICAL_AREAS_05.map((c) => ({ ...c, kindLabel: "Chemicals" })),
    ...ELECTRONIC_AREAS_05.map((e) => ({ ...e, kindLabel: "Electronics" })),
    ...MEDICAL_AREAS_05.map((m) => ({ ...m, kindLabel: "Medical" })),
  ]
    .map((a) => ({
      a,
      score: scoreEntity(`${a.poi} ${a.name}`, a.kindLabel, qLower, tokens),
    }))
    .filter((x) => x.score >= 42)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  if (matchedPois.length > 0 || matchedSpecialAreas.length > 0 || matchedRegions.length > 0) {
    const topPoiScore = Math.max(
      matchedPois[0]?.score || 0,
      matchedSpecialAreas[0]?.score || 0,
      matchedRegions[0]?.score || 0
    );
    ranked.push({
      score: topPoiScore - 10,
      source: "Tactical Map",
      markdown: [
        "### Lamang Map & Region Intel",
        ...matchedRegions.map(({ r }) => `- **${r.name}:** ${r.description}`),
        ...matchedPois.map(
          ({ p }) =>
            `- **${
              p.kind === "sublocation" && p.parentRegion
                ? `${p.parentRegion} · ${p.name}`
                : p.name
            }** (\`Grid ${formatGridSquare(p.x, p.y)}\`${
              p.tier ? ` · ${p.tier}` : ""
            }${p.lz ? ` · LZ: ${p.lz}` : ""})`
        ),
        ...matchedSpecialAreas.map(
          ({ a }) =>
            `- **${a.poi} · ${a.name}** (${a.kindLabel} · \`Grid ${formatGridSquare(
              a.x,
              a.y
            )}\`)`
        ),
      ].join("\n"),
    });
  }

  ranked.sort((a, b) => b.score - a.score);
  const bestScore = ranked[0]?.score || 0;
  const topSections = ranked
    .filter((s, idx) => idx === 0 || s.score >= Math.max(42, bestScore * 0.42))
    .slice(0, 3);

  if (topSections.length === 0) {
    return {
      reply: [
        `No exact match found for **"${trimmedQuery}"** in the built-in Lamang Operations database.`,
        "",
        "**Try asking about:**",
        "- **Updates (0.5–0.5.1.1):** `What changed in 0.5.1.0?`, `0.5.1.1 hotfix`, `0.5.2.0 Breakthrough`",
        "- **Bosses & Drops:** `Where does Yen spawn?`, `Viper loadout`, `All bosses`",
        "- **Hideout & Materials:** `Server CPU`, `what materials do I still need?`, `Manpack Tactical Radio`",
        "- **Doors & Hacking:** `RLSL-1 Telescope`, `Superior Hacking Tool`, `A208`",
        "- **Gear, Optics & Survival:** `Vudu 1-6x24`, `Gunsmith Tool Set`, `3M Comtac II`, `F-1 grenade`, `how to treat heavy bleeding`",
        "- **Modes, Loot & XP:** `Conflict Zones`, `Aggressor status`, `Squad Strike`, `Diamond Ring`, `XP actions`",
      ].join("\n"),
      sourcesUsed: ["Website Intel"],
    };
  }

  return {
    reply: topSections.map((s) => s.markdown).join("\n\n"),
    sourcesUsed: Array.from(new Set(topSections.map((s) => s.source))),
  };
}
