import { LAMANG_POIS, type LamangPoi } from "../config/mapConfig";
import { CURATED_TASK_WALKTHROUGHS } from "../data/taskWalkthroughs";
import type { ApiCachePayload, NormalizedApiRecord } from "../services/gzwApi";
import { getVendorPortraitUrl, resolveTacticalImageUrl } from "./imageUtils";

export type TaskCategory =
  | "Main Task"
  | "Side Task"
  | "Contract"
  | "Hidden Task";

export interface VendorProfile {
  id: string;
  name: string;
  fullName: string;
  specialty: string;
  sells?: string;
  buys?: string;
  image: string | null;
}

export interface TaskCoordTarget {
  grid: string;
  x: number;
  y: number;
  label: string;
}

export interface TaskRelatedItem {
  name: string;
  kind: "Key" | "Keycard" | "Task Item" | "Intel" | "Gear";
  image: string | null;
  note?: string;
  gridSize?: string;
}

export interface GzwTaskDef {
  id: string;
  name: string;
  vendor: string;
  category: TaskCategory;
  locationRaw: string;
  areas: string[];
  briefing: string;
  objectivesText: string;
  objectivesList: string[];
  walkthroughSteps: string[];
  walkthroughSource: "api-guide" | "curated" | "tactical-intel";
  guideImage: string | null;
  guideTip?: string;
  exactCoords: TaskCoordTarget[];
  relatedItems: TaskRelatedItem[];
  nearestLzs: string[];
  alternate?: string;
  hiddenNote?: string;
  vendorRankRequired?: string;
  faction?: string;
  image: string | null;
  matchedPois: LamangPoi[];
}

export const CANONICAL_VENDORS: VendorProfile[] = [
  {
    id: "handshake",
    name: "Handshake",
    fullName: "Lewis Pell",
    specialty: "Recon & Faction Operations",
    image: null,
  },
  {
    id: "gunny",
    name: "Gunny",
    fullName: "Anton Jackson",
    specialty: "Weapons & Tactical Gear",
    image: null,
  },
  {
    id: "lab-rat",
    name: "Lab Rat",
    fullName: "Jie Xianlong",
    specialty: "Medical & Biohazard Intel",
    image: null,
  },
  {
    id: "artisan",
    name: "Artisan",
    fullName: "Laya Hoang",
    specialty: "Mechanics & Field Hardware",
    image: null,
  },
  {
    id: "turncoat",
    name: "Turncoat",
    fullName: "Unknown",
    specialty: "Covert & Black Market",
    image: null,
  },
  {
    id: "banshee",
    name: "Banshee",
    fullName: "James Miller",
    specialty: "High-Tier Precision Arms",
    image: null,
  },
  {
    id: "vulture",
    name: "Vulture",
    fullName: "Unknown",
    specialty: "Rogue Ops & COP Trade",
    image: null,
  },
];

const AREA_ALIASES: { match: RegExp; area: string; poiName: string }[] = [
  { match: /\bkiu\s*vongsa\b/i, area: "Kiu Vongsa", poiName: "Kiu Vongsa" },
  { match: /\bnam\s*thaven\b/i, area: "Nam Thaven", poiName: "Nam Thaven" },
  {
    match: /\bpha\s*lang\s*airfield\b|\bairfield\b/i,
    area: "Pha Lang Airfield",
    poiName: "Pha Lang Airfield",
  },
  { match: /\bpha\s*lang\b/i, area: "Pha Lang", poiName: "Pha Lang" },
  {
    match: /\bhunter'?s\s*paradise\b/i,
    area: "Hunter's Paradise",
    poiName: "Hunter's Paradise",
  },
  { match: /\bsawmill\b/i, area: "Sawmill", poiName: "Sawmill" },
  { match: /\bblue\s*lagoon\b/i, area: "Blue Lagoon", poiName: "Blue Lagoon" },
  { match: /\bban\s*pa\b/i, area: "Ban Pa", poiName: "Ban Pa" },
  { match: /\bybl[-\s]*1\b/i, area: "YBL-1 Bunker", poiName: "YBL-1 Bunker" },
  { match: /\bfort\s*narith\b/i, area: "Fort Narith", poiName: "Fort Narith" },
  {
    match: /\bmidnight\s*sapphire\b/i,
    area: "Midnight Sapphire",
    poiName: "Midnight Sapphire",
  },
  { match: /\btiger\s*bay\b/i, area: "Tiger Bay", poiName: "Tiger Bay" },
  {
    match: /\brlsl[-\s]*1\b|observatory/i,
    area: "RLSL-1 Radio Observatory",
    poiName: "RLSL-1 Radio Observatory",
  },
  {
    match: /\bnorthern\s*reach\b/i,
    area: "Northern Reach",
    poiName: "Northern Reach",
  },
  {
    match: /\blakevale\b|sanctuary/i,
    area: "Lakevale Sanctuary",
    poiName: "Lakevale Sanctuary",
  },
  { match: /\bground\s*zero\b/i, area: "Ground Zero", poiName: "Ground Zero" },
  { match: /\bkhonwan\b/i, area: "Nam Thaven", poiName: "Nam Thaven" },
  {
    match: /\bfuel\s*depot|gas\s*station|checkpoint\b/i,
    area: "Lamang Island",
    poiName: "",
  },
];

export function buildVendorProfiles(
  apiCache: ApiCachePayload | null
): VendorProfile[] {
  const byName = new Map<string, VendorProfile>();
  for (const v of CANONICAL_VENDORS) {
    byName.set(v.name.toLowerCase(), {
      ...v,
      image: getVendorPortraitUrl(v.name, v.image),
    });
  }

  const apiVendors = apiCache?.datasets?.vendors || [];
  for (const rec of apiVendors) {
    const raw = rec.raw || {};
    const name = String(raw.name || rec.name || "").trim();
    if (!name) continue;
    const key = name.toLowerCase();
    const existing = byName.get(key);
    const fullName =
      typeof raw.full_name === "string" && raw.full_name.trim()
        ? raw.full_name.trim()
        : existing?.fullName || "Unknown";

    byName.set(key, {
      id: existing?.id || rec.id || key.replace(/\s+/g, "-"),
      name,
      fullName,
      specialty: existing?.specialty || "Lamang Contractor",
      sells:
        typeof raw.sells === "string" && raw.sells.trim()
          ? raw.sells.trim()
          : undefined,
      buys:
        typeof raw.buys === "string" && raw.buys.trim()
          ? raw.buys.trim()
          : undefined,
      image: getVendorPortraitUrl(name, rec.image || existing?.image || null),
    });
  }

  return Array.from(byName.values());
}

function normalizeVendorName(rawVendor: unknown): string {
  const s = String(rawVendor || "").trim();
  if (!s) return "Unknown";
  const found = CANONICAL_VENDORS.find(
    (v) => v.name.toLowerCase() === s.toLowerCase()
  );
  return found ? found.name : s;
}

function gridToMapMeters(gx: number, gy: number): { x: number; y: number } {
  return {
    x: (gx - 100) * 100 + 50,
    y: (gy - 100) * 100 + 50,
  };
}

function extractGridTargetsFromText(
  text: string,
  defaultLabel: string
): TaskCoordTarget[] {
  if (!text) return [];
  const targets: TaskCoordTarget[] = [];
  const seen = new Set<string>();
  const regex = /\b(1[0-9]{2}|2[0-3][0-9])\s*[,/]\s*(1[0-7][0-9])\b/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    const gx = Number(match[1]);
    const gy = Number(match[2]);
    if (gx < 115 || gx > 225 || gy < 105 || gy > 175) continue;
    const grid = `${gx} ${gy}`;
    if (seen.has(grid)) continue;
    seen.add(grid);
    const { x, y } = gridToMapMeters(gx, gy);
    targets.push({
      grid,
      x,
      y,
      label: `${defaultLabel} (${gx}, ${gy})`,
    });
  }
  return targets;
}

/**
 * Strips nested MediaWiki [[File:...]] tags cleanly and splits [1] [2] sections.
 */
function parseWikiGuideContent(rawContent: string): {
  steps: string[];
  coords: TaskCoordTarget[];
} {
  if (!rawContent || typeof rawContent !== "string") {
    return { steps: [], coords: [] };
  }

  const coords = extractGridTargetsFromText(rawContent, "Guide Waypoint");

  // Iteratively strip [[File:...]] / [[...]] nested brackets
  let stripped = rawContent;
  for (let pass = 0; pass < 4; pass++) {
    stripped = stripped.replace(/\[\[(?:File|Image):[^[\]]*\]\]/gi, " ");
    stripped = stripped.replace(/\[\[[^[\]]*\]\]/g, " ");
  }
  // Remove any leftover orphan [[File:... prefixes
  stripped = stripped
    .replace(/\[\[(?:File|Image):[^\]]*/gi, " ")
    .replace(/\]\]/g, " ")
    .replace(/\b(?:left|thumb|\d+x\d+px)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Split by [1], [2], [3] markers or sentence breaks
  const parts = stripped
    .split(/(?=\[\d+\])/)
    .map((s) => s.replace(/^\[\d+\]\s*(?:Part:\s*)?/i, "").trim())
    .filter((s) => s.length >= 8);

  const steps: string[] = [];
  for (const part of parts) {
    // Trim leading "Guide for XYZ."
    const clean = part.replace(/^Guide for [^.]+\.\s*/i, "").trim();
    if (clean && !steps.some((existing) => existing.toLowerCase() === clean.toLowerCase())) {
      steps.push(clean);
    }
  }

  return { steps, coords };
}

function cleanObjectivesString(rawObj: unknown): {
  summary: string;
  steps: string[];
} {
  if (typeof rawObj !== "string") return { summary: "", steps: [] };
  let text = rawObj.replace(/\s+/g, " ").trim();
  if (!text) return { summary: "", steps: [] };

  // Remove contiguous repeated word blocks (>= 2 words) scraped twice from wiki
  let changed = true;
  let guard = 0;
  while (changed && guard < 6) {
    changed = false;
    guard += 1;
    const words = text.split(" ");
    if (words.length < 4) break;
    outer: for (let len = Math.floor(words.length / 2); len >= 2; len--) {
      for (let start = 0; start <= words.length - len * 2; start++) {
        const a = words.slice(start, start + len).join(" ");
        const b = words.slice(start + len, start + len * 2).join(" ");
        if (a.toLowerCase() === b.toLowerCase()) {
          text = [
            ...words.slice(0, start + len),
            ...words.slice(start + len * 2),
          ]
            .join(" ")
            .trim();
          changed = true;
          break outer;
        }
      }
    }
  }

  // Split explicit sentences or concatenated action-verb clauses
  const rawClauses = text
    .split(/(?<=[.!?])\s+|\s+(?=(?:Locate|Check|Mark|Place|Plant|Find|Retrieve|Deliver|Eliminate|Neutralize|Kill|Inspect|Interact|Pick up|Grab|Search|Secure|Upload|Hack|Scout|Recon|Investigate|Report back)\b)/)
    .map((s) => s.trim())
    .filter(Boolean);

  const deduped: string[] = [];
  for (const clause of rawClauses) {
    if (
      !deduped.some(
        (existing) => existing.toLowerCase() === clause.toLowerCase()
      )
    ) {
      deduped.push(clause);
    }
  }

  const summary = deduped[0] || text;
  const steps = deduped.slice(1);
  return { summary, steps };
}

function extractTaskAreasAndPois(
  locationRaw: string,
  briefing: string,
  objectives: string
): { areas: string[]; matchedPois: LamangPoi[] } {
  const areas: string[] = [];
  const pois: LamangPoi[] = [];
  const seenAreas = new Set<string>();
  const seenPoiIds = new Set<string>();

  const locLower = locationRaw.toLowerCase();
  const fullBlob = `${locationRaw} ${briefing} ${objectives}`.toLowerCase();

  for (const alias of AREA_ALIASES) {
    if (alias.match.test(locLower)) {
      if (!seenAreas.has(alias.area)) {
        seenAreas.add(alias.area);
        areas.push(alias.area);
      }
      if (alias.poiName) {
        const poi = LAMANG_POIS.find(
          (p) =>
            (p.kind === "major" || p.kind === "tier4") &&
            p.name.toLowerCase() === alias.poiName.toLowerCase()
        );
        if (poi && !seenPoiIds.has(poi.id)) {
          seenPoiIds.add(poi.id);
          pois.push(poi);
        }
      }
    }
  }

  if (areas.length === 0) {
    for (const alias of AREA_ALIASES) {
      if (alias.area !== "Lamang Island" && alias.match.test(fullBlob)) {
        if (!seenAreas.has(alias.area)) {
          seenAreas.add(alias.area);
          areas.push(alias.area);
        }
        if (alias.poiName) {
          const poi = LAMANG_POIS.find(
            (p) =>
              (p.kind === "major" || p.kind === "tier4") &&
              p.name.toLowerCase() === alias.poiName.toLowerCase()
          );
          if (poi && !seenPoiIds.has(poi.id)) {
            seenPoiIds.add(poi.id);
            pois.push(poi);
          }
        }
      }
    }
  }

  for (const poi of LAMANG_POIS) {
    if (poi.kind !== "sublocation") continue;
    if (
      seenAreas.size > 0 &&
      poi.parentRegion &&
      !seenAreas.has(poi.parentRegion)
    ) {
      continue;
    }
    const pName = poi.name.toLowerCase();
    if (pName.length >= 5 && fullBlob.includes(pName)) {
      if (!seenPoiIds.has(poi.id)) {
        seenPoiIds.add(poi.id);
        pois.push(poi);
      }
      if (seenAreas.size === 0 && poi.parentRegion) {
        seenAreas.add(poi.parentRegion);
        areas.push(poi.parentRegion);
      }
    }
  }

  if (areas.length === 0) {
    areas.push(locationRaw.trim() || "Lamang Island");
  }

  return { areas, matchedPois: pois.slice(0, 6) };
}

function collectNearestLzs(pois: LamangPoi[]): string[] {
  const lzs = new Set<string>();
  for (const poi of pois) {
    if (poi.lz) {
      poi.lz
        .split("/")
        .map((s) => s.trim())
        .filter((s) => s && !/all\s*fob|helicopter|n\/a/i.test(s))
        .forEach((s) => lzs.add(s));
    }
  }
  return Array.from(lzs).slice(0, 4);
}

function detectEquipmentHints(textBlob: string): TaskRelatedItem[] {
  const items: TaskRelatedItem[] = [];
  const rules: { regex: RegExp; name: string; note: string }[] = [
    {
      regex: /\bgps\s*tracker|\btracking\s*device|\btracker\b/i,
      name: "GPS Tracker",
      note: "Supplied in briefing or buy from Handshake Lv.1",
    },
    {
      regex: /\bwiretap|\bwiretapping|\bbug\b|\brecorder\b/i,
      name: "Wiretapping Device",
      note: "Required quest device — store in SafeLock",
    },
    {
      regex: /\bcamera\b|\bphoto(?:graph)?\b/i,
      name: "Recon Camera",
      note: "Provided via briefing message",
    },
    {
      regex: /\bmarker\b|\bms2000\b|\bbeacon\b/i,
      name: "Signal Marker / Beacon",
      note: "Plant at marked objective site",
    },
    {
      regex: /\bmre\b|\bsupply\s*package|\bfood\b|\bwater\b/i,
      name: "Field Supply Package",
      note: "Bring required drop-off rations from stash",
    },
    {
      regex: /\bnvg\b|\bnight\b|\bbunker\b|\bdark\b/i,
      name: "Flashlight / NVGs",
      note: "Low-visibility interior or night deployment recommended",
    },
  ];

  for (const r of rules) {
    if (r.regex.test(textBlob)) {
      items.push({
        name: r.name,
        kind: "Gear",
        image: null,
        note: r.note,
      });
    }
  }
  return items;
}

function mapCategory(
  rawType: unknown,
  id: string,
  categorySets: {
    main: Set<string>;
    side: Set<string>;
    hidden: Set<string>;
    contract: Set<string>;
  },
  isHiddenFlag: boolean
): TaskCategory {
  if (categorySets.hidden.has(id) || isHiddenFlag) return "Hidden Task";
  if (categorySets.contract.has(id)) return "Contract";
  if (categorySets.main.has(id)) return "Main Task";
  if (categorySets.side.has(id)) return "Side Task";

  const s = String(rawType || "").toLowerCase();
  if (s.includes("main")) return "Main Task";
  if (s.includes("contract")) return "Contract";
  if (s.includes("hidden")) return "Hidden Task";
  return "Side Task";
}

export function buildAllTasks(apiCache: ApiCachePayload | null): GzwTaskDef[] {
  if (!apiCache?.datasets) return [];

  const ds = apiCache.datasets;
  const categorySets = {
    main: new Set((ds.main_task || []).map((r) => r.id)),
    side: new Set((ds.side_task || []).map((r) => r.id)),
    hidden: new Set((ds.hidden_task || []).map((r) => r.id)),
    contract: new Set([
      ...(ds.contract || []).map((r) => r.id),
      ...(ds.contracts || []).map((r) => r.id),
    ]),
  };

  // Index live API task_guides by lowercase id & name
  const guideByKey = new Map<string, NormalizedApiRecord>();
  for (const g of ds.task_guides || []) {
    if (g.id) guideByKey.set(g.id.toLowerCase(), g);
    if (g.name) guideByKey.set(g.name.toLowerCase(), g);
  }

  // Index keys, keycards, task_items, intels for cross-referencing
  const keyRecords = [...(ds.keys || []), ...(ds.keycards || [])].map((rec) => ({
    rec,
    isKeycard: rec.dataset === "keycards",
    nameLower: rec.name.toLowerCase(),
    usage: String(rec.raw?.usage || rec.description || "").trim(),
    usageLower: String(rec.raw?.usage || rec.description || "").toLowerCase(),
  }));

  const itemRecords = [
    ...(ds.task_items || []),
    ...(ds.intels || []),
  ].map((rec) => ({
    rec,
    kind: (rec.dataset === "intels" ? "Intel" : "Task Item") as
      | "Intel"
      | "Task Item",
    nameLower: rec.name.toLowerCase(),
  }));

  const mergedById = new Map<string, NormalizedApiRecord>();
  const sources = [
    ds.tasks || [],
    ds.main_task || [],
    ds.side_task || [],
    ds.contract || [],
    ds.contracts || [],
    ds.hidden_task || [],
  ];

  for (const list of sources) {
    for (const rec of list) {
      if (
        String(rec.raw?.task_type || "")
          .toLowerCase()
          .includes("strike")
      ) {
        continue;
      }
      if (!mergedById.has(rec.id)) {
        mergedById.set(rec.id, rec);
      }
    }
  }

  const result: GzwTaskDef[] = [];
  for (const rec of mergedById.values()) {
    const raw = rec.raw || {};
    const name = String(raw.name || rec.name || "").trim();
    if (!name) continue;

    const vendor = normalizeVendorName(raw.vendor);
    const locationRaw =
      typeof raw.location === "string" && raw.location.trim()
        ? raw.location.trim()
        : "Lamang Island";
    const briefing =
      typeof raw.briefing === "string" ? raw.briefing.trim() : "";
    const parsedObj = cleanObjectivesString(raw.objectives);
    const isHiddenFlag = Boolean(raw.hidden_task);
    const category = mapCategory(raw.task_type, rec.id, categorySets, isHiddenFlag);
    const { areas, matchedPois } = extractTaskAreasAndPois(
      locationRaw,
      briefing,
      `${parsedObj.summary} ${parsedObj.steps.join(" ")}`
    );

    const nearestLzs = collectNearestLzs(matchedPois);
    const fullTextBlob = `${name} ${locationRaw} ${briefing} ${parsedObj.summary} ${parsedObj.steps.join(" ")}`;
    const fullTextLower = fullTextBlob.toLowerCase();

    // 1. Live API task_guide lookup
    const apiGuide =
      guideByKey.get(rec.id.toLowerCase()) ||
      guideByKey.get(name.toLowerCase());
    const parsedApiGuide = apiGuide
      ? parseWikiGuideContent(String(apiGuide.raw?.content || ""))
      : { steps: [], coords: [] };

    // 2. Curated Update 0.5 walkthrough lookup
    const curated =
      CURATED_TASK_WALKTHROUGHS[name.toLowerCase()] ||
      CURATED_TASK_WALKTHROUGHS[rec.id.toLowerCase()];

    const curatedCoords: TaskCoordTarget[] =
      curated?.coords?.map((c) => {
        const m = gridToMapMeters(c.gridX, c.gridY);
        return {
          grid: `${c.gridX} ${c.gridY}`,
          x: m.x,
          y: m.y,
          label: c.label,
        };
      }) || [];

    const textCoords = extractGridTargetsFromText(fullTextBlob, name);
    const exactCoordsMap = new Map<string, TaskCoordTarget>();
    for (const c of [
      ...parsedApiGuide.coords,
      ...curatedCoords,
      ...textCoords,
    ]) {
      if (!exactCoordsMap.has(c.grid)) exactCoordsMap.set(c.grid, c);
    }
    const exactCoords = Array.from(exactCoordsMap.values());

    // 3. Cross-reference Keys, Keycards, Task Items, Intels & Gear
    const relatedMap = new Map<string, TaskRelatedItem>();

    // Curated equipment first
    curated?.equipment?.forEach((eq) => {
      relatedMap.set(eq.toLowerCase(), {
        name: eq,
        kind: eq.toLowerCase().includes("key") ? "Key" : "Gear",
        image: null,
        note: "Recommended mission gear",
      });
    });

    // Live keys & keycards: match if key name appears in text OR usage specifically references a matched sublocation/keyword
    const subPoiNames = matchedPois
      .filter((p) => p.kind === "sublocation")
      .map((p) => p.name.toLowerCase());
    for (const k of keyRecords) {
      const bareKey = k.nameLower.replace(/\s+key(?:card)?$/, "");
      const directMatch =
        fullTextLower.includes(k.nameLower) ||
        (bareKey.length >= 4 &&
          new RegExp(`\\b${bareKey.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(
            fullTextLower
          ));
      const buildingMatch = subPoiNames.some(
        (sub) => sub.length >= 5 && k.usageLower.includes(sub)
      );
      if (directMatch || buildingMatch) {
        relatedMap.set(k.nameLower, {
          name: k.rec.name,
          kind: k.isKeycard ? "Keycard" : "Key",
          image: resolveTacticalImageUrl(k.rec.image, k.rec.name),
          note: k.usage || "Unlocks locked quest door",
          gridSize: k.rec.gridSize,
        });
      }
      if (relatedMap.size >= 6) break;
    }

    // Live task_items & intels matched by full item name
    for (const it of itemRecords) {
      if (it.nameLower.length < 5) continue;
      if (
        it.nameLower === name.toLowerCase() ||
        fullTextLower.includes(it.nameLower)
      ) {
        if (!relatedMap.has(it.nameLower)) {
          relatedMap.set(it.nameLower, {
            name: it.rec.name,
            kind: it.kind,
            image: resolveTacticalImageUrl(it.rec.image, it.rec.name),
            note: it.rec.weight ? `Weight ${it.rec.weight}` : "Mission item",
            gridSize: it.rec.gridSize,
          });
        }
      }
      if (relatedMap.size >= 8) break;
    }

    // Detected field gear hints
    for (const hint of detectEquipmentHints(fullTextBlob)) {
      const k = hint.name.toLowerCase();
      if (!relatedMap.has(k)) {
        relatedMap.set(k, hint);
      }
    }

    // 4. Assemble numbered Walkthrough Steps for every task
    let walkthroughSteps: string[] = [];
    let walkthroughSource: GzwTaskDef["walkthroughSource"] = "tactical-intel";

    if (parsedApiGuide.steps.length > 0) {
      walkthroughSteps = parsedApiGuide.steps;
      walkthroughSource = "api-guide";
    } else if (curated && curated.steps.length > 0) {
      walkthroughSteps = curated.steps;
      walkthroughSource = "curated";
    } else {
      const synth: string[] = [];
      if (nearestLzs.length > 0) {
        synth.push(
          `Infil to ${areas.join(" / ")} via LZ ${nearestLzs.slice(0, 3).join(" or ")} (${matchedPois[0]?.tier || "Field AO"}).`
        );
      } else {
        synth.push(`Deploy to ${locationRaw} and clear perimeter patrols.`);
      }

      if (parsedObj.summary) {
        synth.push(parsedObj.summary);
      }
      for (const s of parsedObj.steps) {
        if (s.toLowerCase() !== parsedObj.summary.toLowerCase()) {
          synth.push(s);
        }
      }

      if (relatedMap.size > 0) {
        const gearList = Array.from(relatedMap.values())
          .slice(0, 3)
          .map((g) => g.name)
          .join(", ");
        synth.push(
          `Carry / verify mission essentials before moving on target: ${gearList}.`
        );
      }

      if (briefing) {
        // Extract first concise actionable sentence if helpful
        const firstBrief = briefing.split(/(?<=[.!?])\s+/)[0];
        if (
          firstBrief &&
          firstBrief.length > 20 &&
          !synth.some((x) => x.toLowerCase() === firstBrief.toLowerCase())
        ) {
          synth.push(`Intel note: ${firstBrief}`);
        }
      }

      synth.push(
        `Report back to ${vendor} via FOB or any friendly Combat Outpost (COP) once objectives register complete.`
      );
      walkthroughSteps = synth;
    }

    result.push({
      id: rec.id,
      name,
      vendor,
      category,
      locationRaw,
      areas,
      briefing,
      objectivesText: parsedObj.summary,
      objectivesList: parsedObj.steps,
      walkthroughSteps,
      walkthroughSource,
      guideImage: resolveTacticalImageUrl(apiGuide?.image || null, name),
      guideTip: curated?.tip,
      exactCoords,
      relatedItems: Array.from(relatedMap.values()),
      nearestLzs,
      alternate:
        typeof raw.alternate === "string" && raw.alternate.trim()
          ? raw.alternate.trim()
          : undefined,
      hiddenNote:
        typeof raw.hidden_task === "string" && raw.hidden_task.trim()
          ? raw.hidden_task.trim()
          : undefined,
      vendorRankRequired:
        typeof raw.vendor_rank_required === "string" ||
        typeof raw.vendor_rank_required === "number"
          ? String(raw.vendor_rank_required)
          : undefined,
      faction:
        typeof raw.faction === "string" && raw.faction.trim()
          ? raw.faction.trim()
          : undefined,
      image: resolveTacticalImageUrl(rec.image, name),
      matchedPois,
    });
  }

  // Ensure any standalone task_guides (e.g. Update 0.5 field guides not yet indexed in /tasks)
  // are also surfaced as full interactive tasks with walkthroughs, coords, and screenshots.
  const includedTaskKeys = new Set<string>();
  for (const t of result) {
    includedTaskKeys.add(t.id.toLowerCase());
    includedTaskKeys.add(t.name.toLowerCase());
  }

  for (const g of ds.task_guides || []) {
    const gId = (g.id || "").toLowerCase();
    const gName = (g.name || "").trim();
    if (!gName) continue;
    if (includedTaskKeys.has(gId) || includedTaskKeys.has(gName.toLowerCase())) {
      continue;
    }

    const content = String(g.raw?.content || "");
    const parsed = parseWikiGuideContent(content);
    const curated =
      CURATED_TASK_WALKTHROUGHS[gName.toLowerCase()] ||
      CURATED_TASK_WALKTHROUGHS[gId];

    const inferredVendor = /\bartisan\b/i.test(content)
      ? "Artisan"
      : /\bturncoat\b/i.test(content)
        ? "Turncoat"
        : /\bgunny\b/i.test(content)
          ? "Gunny"
          : /\blab\s*rat\b/i.test(content)
            ? "Lab Rat"
            : /\bbanshee\b/i.test(content)
              ? "Banshee"
              : "Handshake";

    const inferredLocation =
      /house of prayers|kapu|ban pa/i.test(content)
        ? "Ban Pa"
        : /189\s*[,/]\s*16[03]/i.test(content)
          ? "Pha Lang"
          : /158\s*[,/]\s*15[36]/i.test(content)
            ? "RLSL-1 Radio Observatory"
            : "Lamang Island";

    const { areas, matchedPois } = extractTaskAreasAndPois(
      inferredLocation,
      content,
      gName
    );
    const curatedCoords: TaskCoordTarget[] =
      curated?.coords?.map((c) => {
        const m = gridToMapMeters(c.gridX, c.gridY);
        return {
          grid: `${c.gridX} ${c.gridY}`,
          x: m.x,
          y: m.y,
          label: c.label,
        };
      }) || [];
    const exactCoordsMap = new Map<string, TaskCoordTarget>();
    for (const c of [...parsed.coords, ...curatedCoords]) {
      if (!exactCoordsMap.has(c.grid)) exactCoordsMap.set(c.grid, c);
    }

    result.push({
      id: g.id || gName.toLowerCase().replace(/\s+/g, "-"),
      name: gName,
      vendor: inferredVendor,
      category: "Side Task",
      locationRaw: inferredLocation,
      areas,
      briefing: parsed.steps[0] || `Field guide walkthrough for ${gName}.`,
      objectivesText: parsed.steps[0] || gName,
      objectivesList: parsed.steps.slice(1, 4),
      walkthroughSteps:
        parsed.steps.length > 0 ? parsed.steps : curated?.steps || [],
      walkthroughSource: "api-guide",
      guideImage: resolveTacticalImageUrl(g.image || null, gName),
      guideTip: curated?.tip,
      exactCoords: Array.from(exactCoordsMap.values()),
      relatedItems:
        curated?.equipment?.map((eq) => ({
          name: eq,
          kind: "Gear",
          image: null,
          note: "Recommended mission gear",
        })) || [],
      nearestLzs: collectNearestLzs(matchedPois),
      image: resolveTacticalImageUrl(g.image || null, gName),
      matchedPois,
    });
  }

  return result.sort((a, b) => a.name.localeCompare(b.name));
}
