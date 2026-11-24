import {
  formatGridSquare,
  LAMANG_POIS,
  type LamangPoi,
} from "../config/mapConfig";
import type { ApiCachePayload } from "../services/gzwApi";
import { resolveTacticalImageUrl } from "./imageUtils";
import type { GzwTaskDef } from "./taskBuilder";

export interface GzwKeyDoorDef {
  id: string;
  name: string;
  kind: "Key" | "Keycard";
  usage: string;
  doorTarget: string;
  region: string;
  sublocation: string | null;
  x: number;
  y: number;
  grid: string;
  lz: string;
  image: string | null;
  weight?: string;
  sellPrice?: string;
  linkedTasks: { id: string; name: string; vendor: string }[];
}

const REGION_RULES: { match: RegExp; region: string }[] = [
  { match: /fort narith|\bfn[\s_-]|airfield.*barrack/i, region: "Fort Narith" },
  { match: /midnight sapphire|sapphire|\bms[\s_-]|hotel\b/i, region: "Midnight Sapphire" },
  { match: /tiger bay|unlra|\btb[\s_-]/i, region: "Tiger Bay" },
  { match: /pha lang airfield|\bpla\b|airport/i, region: "Pha Lang Airfield" },
  { match: /pha lang|\bpl[\s_-]/i, region: "Pha Lang" },
  { match: /kiu vongsa|\bkv[\s_-]/i, region: "Kiu Vongsa" },
  { match: /nam thaven|\bnt[\s_-]|khonwan/i, region: "Nam Thaven" },
  { match: /hunter'?s paradise|\bhp[\s_-]/i, region: "Hunter's Paradise" },
  { match: /sawmill|\bsm[\s_-]/i, region: "Sawmill" },
  { match: /blue lagoon|\bbl[\s_-]/i, region: "Blue Lagoon" },
  { match: /ban pa|\bbp[\s_-]/i, region: "Ban Pa" },
  { match: /ybl[-\s]*1|\bybl\b/i, region: "YBL-1 Bunker" },
  { match: /northern reach|\bnr[\s_-]/i, region: "Northern Reach" },
  { match: /lakevale|sanctuary|\bls[\s_-]/i, region: "Lakevale Sanctuary" },
  { match: /rlsl[-\s]*1|observatory/i, region: "RLSL-1 Radio Observatory" },
];

const SPECIFIC_POI_HINTS: { match: RegExp; poiName: string }[] = [
  { match: /fort narith.*headquarters|fn hq|operations room|reception/i, poiName: "Fort Narith Headquarters" },
  { match: /fort narith.*barracks|a102|a103|a208|b\d{3}|c\d{3}/i, poiName: "Fort Narith Barracks" },
  { match: /fort narith.*airfield|hangar/i, poiName: "Fort Narith Airfield" },
  { match: /midnight sapphire.*hotel|hotel supply/i, poiName: "Midnight Sapphire Hotel" },
  { match: /midnight sapphire.*villa/i, poiName: "Midnight Sapphire Villa" },
  { match: /unlra hq/i, poiName: "UNLRA HQ" },
  { match: /tiger bay.*mall/i, poiName: "Tiger Bay Mall" },
  { match: /ban pa.*elder/i, poiName: "Ban Pa Elder's House" },
  { match: /ban pa.*fishing|hut/i, poiName: "Ban Pa Fishing Huts" },
  { match: /ban pa.*warehouse/i, poiName: "Ban Pa Warehouse" },
  { match: /kiu vongsa.*town hall|finance/i, poiName: "Kiu Vongsa Town Hall" },
  { match: /nam thaven.*town hall|finance/i, poiName: "Nam Thaven Town Hall" },
  { match: /pha lang.*town hall|finance/i, poiName: "Pha Lang Town Hall" },
  { match: /pha lang.*airfield|airport|storage shed/i, poiName: "Pha Lang Airfield" },
  { match: /sawmill.*office/i, poiName: "Sawmill Offices" },
];

function extractDoorTarget(name: string, usage: string): string {
  const m = usage.match(/unlocks\s+(?:a\s+)?door\s+(.+?)\s+in\s+/i);
  if (m && m[1] && m[1].toUpperCase() !== "XXX") {
    return m[1].trim();
  }
  const cleanName = name.replace(/\s*(key card|keycard|key)$/i, "").trim();
  return cleanName || name;
}

function resolvePoiForKey(
  name: string,
  usage: string,
  region: string,
  linkedTasks: { id: string; name: string; vendor: string; areas: string[] }[]
): LamangPoi {
  const combined = `${name} ${usage}`.toLowerCase();

  // 1. Specific building/compound match
  for (const hint of SPECIFIC_POI_HINTS) {
    if (hint.match.test(combined)) {
      const exactSub = LAMANG_POIS.find(
        (p) =>
          p.name.toLowerCase() === hint.poiName.toLowerCase() ||
          p.name.toLowerCase().includes(hint.poiName.toLowerCase())
      );
      if (exactSub) return exactSub;
    }
  }

  // 2. Match any sublocation inside this region whose words appear in key name/usage
  const effectiveRegion =
    region !== "Lamang Island"
      ? region
      : linkedTasks.find((t) => t.areas.length > 0)?.areas[0] || region;

  const regionSubPois = LAMANG_POIS.filter(
    (p) =>
      p.kind === "sublocation" &&
      (p.parentRegion || "").toLowerCase() === effectiveRegion.toLowerCase()
  );
  for (const sub of regionSubPois) {
    const tokens = sub.name
      .toLowerCase()
      .split(/\s+/)
      .filter((t) => t.length >= 4 && t !== effectiveRegion.toLowerCase());
    if (tokens.some((tok) => combined.includes(tok))) {
      return sub;
    }
  }

  // 3. Fallback to Major Region POI
  const major = LAMANG_POIS.find(
    (p) =>
      (p.kind === "major" || p.kind === "tier4") &&
      p.name.toLowerCase() === effectiveRegion.toLowerCase()
  );
  if (major) return major;

  // 4. Island Ground Zero / Central fallback
  return (
    LAMANG_POIS.find((p) => p.name === "Ground Zero") || LAMANG_POIS[0]
  );
}

export function buildKeysAndDoorsCatalog(
  apiCache: ApiCachePayload | null,
  allTasks: GzwTaskDef[]
): GzwKeyDoorDef[] {
  if (!apiCache?.datasets) return [];

  const rawRecords = [
    ...(apiCache.datasets.keycards || []).map((r) => ({
      rec: r,
      kind: "Keycard" as const,
    })),
    ...(apiCache.datasets.keys || []).map((r) => ({
      rec: r,
      kind: "Key" as const,
    })),
  ];

  const items: GzwKeyDoorDef[] = [];
  const seen = new Set<string>();

  for (const { rec, kind } of rawRecords) {
    const name = (rec.name || "").trim();
    if (!name || name.toLowerCase() === "keys") continue;
    if (seen.has(name.toLowerCase())) continue;
    seen.add(name.toLowerCase());

    const usage = String(rec.raw?.usage || rec.description || "").trim();
    const combined = `${name} ${usage}`;

    let region = "Lamang Island";
    for (const r of REGION_RULES) {
      if (r.match.test(combined)) {
        region = r.region;
        break;
      }
    }

    // Cross-reference tasks needing this key/keycard first so we can infer region if needed
    const nameLower = name.toLowerCase();
    const linkedTasksFull = allTasks.filter((t) =>
      t.relatedItems.some((ri) => ri.name.toLowerCase() === nameLower)
    );
    const linkedTasks = linkedTasksFull.map((t) => ({
      id: t.id,
      name: t.name,
      vendor: t.vendor,
      areas: t.areas,
    }));

    if (region === "Lamang Island") {
      const taskArea = linkedTasksFull.find(
        (t) => t.areas[0] && t.areas[0] !== "Lamang Island"
      )?.areas[0];
      if (taskArea) region = taskArea;
    }

    const poi = resolvePoiForKey(name, usage, region, linkedTasks);
    if (region === "Lamang Island" && poi.parentRegion) {
      region = poi.parentRegion;
    } else if (region === "Lamang Island" && (poi.kind === "major" || poi.kind === "tier4")) {
      region = poi.name;
    }

    const doorTarget = extractDoorTarget(name, usage);

    items.push({
      id: rec.id,
      name,
      kind,
      usage: usage || `Unlocks ${doorTarget} in ${region}`,
      doorTarget,
      region,
      sublocation:
        poi.kind === "sublocation"
          ? poi.name.replace(new RegExp(`^${region}\\s*`, "i"), "").trim() || poi.name
          : null,
      x: poi.x,
      y: poi.y,
      grid: formatGridSquare(poi.x, poi.y),
      lz: poi.lz,
      image: resolveTacticalImageUrl(rec.image, name),
      weight: rec.weight,
      sellPrice: rec.sellPrice,
      linkedTasks: linkedTasks.map(({ id, name: tName, vendor }) => ({
        id,
        name: tName,
        vendor,
      })),
    });
  }

  return items.sort(
    (a, b) =>
      (b.linkedTasks.length > 0 ? 1 : 0) - (a.linkedTasks.length > 0 ? 1 : 0) ||
      (a.kind === "Keycard" ? 0 : 1) - (b.kind === "Keycard" ? 0 : 1) ||
      a.region.localeCompare(b.region) ||
      a.name.localeCompare(b.name)
  );
}
