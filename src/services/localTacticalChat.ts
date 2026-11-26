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
  ARCHIVE_FIELD_GUIDES,
  ARCHIVE_MEDICAL,
  ARCHIVE_NVG,
  ARCHIVE_STORAGE,
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
]);

function extractTokens(raw: string): string[] {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9.\-+\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length >= 2 && !STOPWORDS.has(t));
}

/**
 * Scores an entity by heavily weighting direct title/name matches inside the user query,
 * plus token matches against name and secondary metadata.
 */
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
    const inName = nameLower.includes(tok);
    const inSec = secLower.includes(tok);
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

  const effectiveQuery =
    prevUser && isFollowUpQuery(trimmedQuery)
      ? `${trimmedQuery} ${prevUser.text}`
      : trimmedQuery;

  const qLower = effectiveQuery.toLowerCase();
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
      qLower
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

  // 2. Puzzle Doors (score primarily against name/sublocation/region/linkedTasks)
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
        p.requiredKeys.length > 0
          ? `- **Keys:** ${p.requiredKeys.join(", ")}`
          : "",
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

  // 3. Hacking Tool Progression
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

  // 4. Keys & Keycards
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
            } (\`Grid ${k.grid}\` · LZ: **${k.lz}**). Unlocks: **${
              k.doorTarget
            }**${
              k.linkedTasks.length > 0
                ? ` · Tasks: ${k.linkedTasks.map((t) => t.name).join(", ")}`
                : ""
            }`
        ),
      ].join("\n"),
    });
  }

  // 5. Disassembly Recipes & Yields
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

  // 6. Hideout Materials & Upgrades
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

  // 7. Tasks & Walkthroughs
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

  // 8. Weapons & Attachment Compatibility Chains
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

  // 9. Field Archive: Ammo, Armor, Medical, NVGs, Storage & Guides
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
      source: "Field Archive",
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
      source: "Field Archive",
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
      source: "Field Archive",
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
      source: "Field Archive",
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
    .slice(0, 4);

  if (scoredStorage.length > 0) {
    ranked.push({
      score: scoredStorage[0].score,
      source: "Field Archive",
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

  const scoredGuides = ARCHIVE_FIELD_GUIDES.map((g) => ({
    g,
    score: scoreEntity(
      g.title,
      `${g.topic} ${g.summary} ${g.keywords.join(" ")} ${g.bullets.join(" ")}`,
      qLower,
      tokens
    ),
  }))
    .filter((x) => x.score >= 36)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);

  if (scoredGuides.length > 0) {
    for (const { g, score } of scoredGuides) {
      ranked.push({
        score: score + 8,
        source: "Field Archive",
        markdown: [`### Guide: ${g.title}`, ...g.bullets.map((b) => `- ${b}`)].join("\n"),
      });
    }
  }

  // 10. Vendor Stock & Map POIs
  const scoredVendor = kb.vendorShopItems
    .map((v) => ({
      v,
      score: scoreEntity(v.itemName, `${v.vendor} ${v.shopGroup} ${v.type}`, qLower, tokens),
    }))
    .filter((x) => x.score >= 45)
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

  if (matchedPois.length > 0 || matchedSpecialAreas.length > 0) {
    const topPoiScore = Math.max(
      matchedPois[0]?.score || 0,
      matchedSpecialAreas[0]?.score || 0
    );
    ranked.push({
      score: topPoiScore - 10,
      source: "Tactical Map",
      markdown: [
        "### Lamang Map Locations",
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
  const topSections = ranked.slice(0, 3);

  if (topSections.length === 0) {
    return {
      reply: [
        `No exact match found for **"${trimmedQuery}"** in the built-in Lamang Operations database.`,
        "",
        "**Try asking with specific keywords like:**",
        "- **Hideout & Materials:** `Server CPU`, `Generator Level 2`, `what materials do I still need?`",
        "- **Disassembly:** `Manpack Tactical Radio`, `Portable SATCOM Terminal`",
        "- **Doors & Hacking:** `RLSL-1 Telescope`, `Superior Hacking Tool`, `A208`",
        "- **Field Archive:** `5.56 M855A1`, `NIJ III++`, `how to treat bleeding`, `AN/PVS-31A`, `Key Case`",
        "- **Weapons & Map:** `AK-74M attachments`, `FAMAS`, `Grid 151 140`, `Fort Narith`",
      ].join("\n"),
      sourcesUsed: ["Website Intel"],
    };
  }

  return {
    reply: topSections.map((s) => s.markdown).join("\n\n"),
    sourcesUsed: Array.from(new Set(topSections.map((s) => s.source))),
  };
}
