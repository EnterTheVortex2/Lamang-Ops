import {
  BASES_05,
  BLUE_CRATES_05,
  CHEMICAL_AREAS_05,
  COPS_05,
  DISASSEMBLY_SPAWNS_05,
  ELECTRONIC_AREAS_05,
  LZS_05,
  MAJOR_POIS_05,
  MEDICAL_AREAS_05,
  SUB_POIS_05,
  type RawPoi05,
} from "./mapData05";

/**
 * ============================================================================
 * OFFICIAL GRAY ZONE WARFARE (UPDATE 0.5: ROGUE OPS) LAMANG ISLAND TILE LAYER
 * Served via local Express tile proxy (/api/map/tiles/{z}/{x}/{y}.png ->
 * https://cdn.gzwtacmap.com/0.5/lamang/{z}/{x}/{y}.png) in EPSG:3857 meters.
 * Coordinate extent: [0, 0] to [14000, 8000] (100m = 1 in-game Grid Square).
 * ============================================================================
 */
export const LAMANG_TILE_URL = "/api/map/tiles/{z}/{x}/{y}.png";
export const LAMANG_DIRECT_TILE_URL = "https://cdn.gzwtacmap.com/0.5/lamang/{z}/{x}/{y}.png";

export const MAP_EXTENT = {
  minX: 0,
  minY: 0,
  maxX: 14000,
  maxY: 8000,
};

export function formatGridSquare(x: number, y: number): string {
  const gx = Math.max(100, Math.min(240, Math.floor(x / 100) + 100));
  const gy = Math.max(100, Math.min(180, Math.floor(y / 100) + 100));
  return `${gx} ${gy}`;
}

export function parseGridInputToMeters(
  raw: string
): { grid: string; x: number; y: number } | null {
  const m = raw
    .trim()
    .match(/^(1[0-9]{2}|2[0-3][0-9])\s*[,\s/]+\s*(1[0-7][0-9])$/);
  if (!m) return null;
  const gx = Number(m[1]);
  const gy = Number(m[2]);
  if (gx < 100 || gx > 240 || gy < 100 || gy > 180) return null;
  return {
    grid: `${gx} ${gy}`,
    x: (gx - 100) * 100 + 50,
    y: (gy - 100) * 100 + 50,
  };
}

export type PoiKind = RawPoi05["kind"];

export interface LamangPoi extends RawPoi05 {
  tags: string[];
}

export type MapLayerKey =
  | "gridOverlay"
  | "blueCrates"
  | "pcSpawns"
  | "chemicalAreas"
  | "disassemblySpawns"
  | "lockedDoors"
  | "tickedSpawns"
  | "apiLoot"
  | "customPins"
  | "poiLabels"
  | "subLocations"
  | "copsAndLzs";

export interface CustomMapPin {
  id: string;
  x: number;
  y: number;
  layer: "blueCrates" | "pcSpawns" | "customPins";
  label: string;
  materialId: string;
  createdAt?: number;
}

export type FactionId = "ALL" | "LRI" | "MSS" | "CSI";

export interface FactionInfo {
  id: Exclude<FactionId, "ALL">;
  short: "LRI" | "MSS" | "CSI";
  name: string;
  baseId: string;
  baseName: string;
  starterTown: "Pha Lang" | "Nam Thaven" | "Kiu Vongsa";
  color: string;
  x: number;
  y: number;
}

export const FACTIONS: Record<Exclude<FactionId, "ALL">, FactionInfo> = {
  LRI: {
    id: "LRI",
    short: "LRI",
    name: "Lamang Recovery Initiative",
    baseId: "base-lri",
    baseName: "LRI Main Base",
    starterTown: "Pha Lang",
    color: "#38bdf8",
    x: 10772,
    y: 7162,
  },
  MSS: {
    id: "MSS",
    short: "MSS",
    name: "Mithras Security Systems",
    baseId: "base-mss",
    baseName: "MSS Main Base",
    starterTown: "Nam Thaven",
    color: "#e5a93c",
    x: 7268,
    y: 813,
  },
  CSI: {
    id: "CSI",
    short: "CSI",
    name: "Crimson Shield International",
    baseId: "base-csi",
    baseName: "CSI Main Base",
    starterTown: "Kiu Vongsa",
    color: "#f87171",
    x: 3393,
    y: 7006,
  },
};

export const STARTER_TOWNS = ["Pha Lang", "Nam Thaven", "Kiu Vongsa"] as const;

export function doesTaskBelongToFaction(
  taskFaction: string | undefined,
  taskAreas: string[],
  selectedFaction: FactionId
): boolean {
  if (selectedFaction === "ALL") return true;
  const active = FACTIONS[selectedFaction];

  if (taskFaction && taskFaction.trim()) {
    const fLower = taskFaction.toLowerCase();
    const mentionsLri = /\blri\b|lamang\s*recovery/i.test(fLower);
    const mentionsMss = /\bmss\b|mithras/i.test(fLower);
    const mentionsCsi = /\bcsi\b|crimson\s*shield/i.test(fLower);
    if (mentionsLri || mentionsMss || mentionsCsi) {
      if (selectedFaction === "LRI" && !mentionsLri) return false;
      if (selectedFaction === "MSS" && !mentionsMss) return false;
      if (selectedFaction === "CSI" && !mentionsCsi) return false;
    }
  }

  // If task areas exclusively point to rival starter town(s) (excluding Pha Lang Airfield), hide from active faction list
  const starterMatches = taskAreas.filter((a) =>
    (STARTER_TOWNS as readonly string[]).includes(a)
  );
  if (
    starterMatches.length > 0 &&
    !starterMatches.includes(active.starterTown) &&
    starterMatches.length === taskAreas.length
  ) {
    return false;
  }

  return true;
}

const TIER_1_REGIONS = new Set(["Kiu Vongsa", "Nam Thaven", "Pha Lang"]);
const TIER_3_REGIONS = new Set(["Fort Narith", "Tiger Bay", "Midnight Sapphire"]);
const TIER_4_REGIONS = new Set([
  "Northern Reach",
  "Lakevale Sanctuary",
  "RLSL-1 Radio Observatory",
  "Ground Zero",
]);

function getRegionTierNum(region?: string): 1 | 2 | 3 | 4 {
  if (!region) return 2;
  if (TIER_4_REGIONS.has(region)) return 4;
  if (TIER_3_REGIONS.has(region)) return 3;
  if (TIER_1_REGIONS.has(region)) return 1;
  return 2;
}

/**
 * Tier-verified Update 0.5 canonical material tags per region.
 * Uses exact canonical Hideout material names (lowercase) so substring collisions
 * (e.g. "cpu" vs "server cpu", "steel" vs "stainless steel sheet") cannot occur.
 */
const REGION_LOOT_TAGS: Record<string, string[]> = {
  "Northern Reach": [
    "server cpu",
    "military software",
    "civilian software",
    "signal generator",
    "oscilloscope",
    "laser tube",
    "cpu",
    "motherboard",
    "graphics card",
    "ram",
    "power supply",
    "pc fan",
    "circuit board",
    "electrical parts",
    "stainless steel sheet",
    "tooling coolant",
    "cnc drill bits",
    "hepa filter",
    "microscope",
    "laboratory flask",
    "mechanical pipette",
    "complex glass electrode",
    "vapor lamp",
    "crystal prism",
    "chemicals",
    "zinc electrode",
    "blue_crate",
  ],
  "Lakevale Sanctuary": [
    "laboratory flask",
    "mechanical pipette",
    "microscope",
    "complex glass electrode",
    "vapor lamp",
    "crystal prism",
    "laser tube",
    "chemicals",
    "hepa filter",
    "refrigerant",
    "zinc electrode",
    "electrical parts",
    "circuit board",
    "stainless steel sheet",
    "blue_crate",
  ],
  "RLSL-1 Radio Observatory": [
    "server cpu",
    "military software",
    "civilian software",
    "signal generator",
    "oscilloscope",
    "laser tube",
    "crystal prism",
    "circuit board",
    "electrical parts",
    "motherboard",
    "graphics card",
    "cpu",
    "ram",
    "power supply",
    "pc fan",
    "zinc electrode",
    "tooling coolant",
    "stainless steel sheet",
    "blue_crate",
  ],
  "Ground Zero": [
    "blue_crate",
    "stainless steel sheet",
    "hepa filter",
    "chemicals",
    "electrical parts",
    "circuit board",
    "cpu",
  ],
  "Kiu Vongsa": [
    "wood",
    "plastics",
    "fabrics",
    "glass",
    "silicone sealant",
    "toolset",
    "soldering iron",
    "multimeter",
    "motor oil",
  ],
  "Nam Thaven": [
    "wood",
    "plastics",
    "fabrics",
    "glass",
    "silicone sealant",
    "toolset",
    "soldering iron",
    "multimeter",
    "motor oil",
  ],
  "Pha Lang": [
    "wood",
    "plastics",
    "fabrics",
    "glass",
    "silicone sealant",
    "toolset",
    "soldering iron",
    "multimeter",
    "motor oil",
  ],
  "Hunter's Paradise": [
    "blue_crate",
    "steel",
    "plastics",
    "mechanical parts",
    "plumbing parts",
    "construction material",
    "toolset",
    "tooling coolant",
    "cnc drill bits",
    "copper",
    "analog indicator",
    "motor oil",
    "dynamo",
    "refrigerant",
    "chemicals",
    "soldering iron",
  ],
  "Midnight Sapphire": [
    "blue_crate",
    "motherboard",
    "graphics card",
    "cpu",
    "ram",
    "power supply",
    "pc fan",
    "civilian software",
    "electrical parts",
    "circuit board",
    "refrigerant",
    "burner head",
    "glass",
    "fabrics",
    "stainless steel sheet",
    "chemicals",
  ],
  "Pha Lang Airfield": [
    "blue_crate",
    "steel",
    "plastics",
    "wood",
    "plumbing parts",
    "mechanical parts",
    "construction material",
    "copper",
    "dynamo",
    "motor oil",
    "water pump",
    "analog indicator",
    "fine metal mesh",
    "toolset",
    "tooling coolant",
    "soldering iron",
    "multimeter",
    "silicone sealant",
    "chemicals",
  ],
  Sawmill: [
    "blue_crate",
    "wood",
    "steel",
    "plastics",
    "construction material",
    "mechanical parts",
    "plumbing parts",
    "toolset",
    "cnc drill bits",
    "copper",
    "fine metal mesh",
    "analog indicator",
    "motor oil",
    "silicone sealant",
    "chemicals",
  ],
  "Fort Narith": [
    "blue_crate",
    "military software",
    "civilian software",
    "server cpu",
    "signal generator",
    "oscilloscope",
    "laser tube",
    "cpu",
    "motherboard",
    "graphics card",
    "ram",
    "power supply",
    "electrical parts",
    "circuit board",
    "steel",
    "stainless steel sheet",
    "construction material",
    "mechanical parts",
    "fine metal mesh",
    "dynamo",
    "motor oil",
    "hepa filter",
    "laboratory flask",
    "mechanical pipette",
    "microscope",
    "complex glass electrode",
    "analog indicator",
    "burner head",
    "refrigerant",
    "water pump",
    "cnc drill bits",
    "chemicals",
    "fabrics",
  ],
  "YBL-1 Bunker": [
    "blue_crate",
    "server cpu",
    "cpu",
    "motherboard",
    "power supply",
    "pc fan",
    "ram",
    "electrical parts",
    "circuit board",
    "signal generator",
    "oscilloscope",
    "dynamo",
    "soldering iron",
    "multimeter",
    "analog indicator",
    "zinc electrode",
    "tooling coolant",
    "water pump",
    "burner head",
    "copper",
  ],
  "Ban Pa": [
    "blue_crate",
    "wood",
    "plastics",
    "fabrics",
    "glass",
    "plumbing parts",
    "water pump",
    "chemicals",
    "laboratory flask",
    "copper",
    "silicone sealant",
  ],
  "Tiger Bay": [
    "blue_crate",
    "motherboard",
    "graphics card",
    "cpu",
    "server cpu",
    "ram",
    "power supply",
    "pc fan",
    "civilian software",
    "military software",
    "electrical parts",
    "circuit board",
    "oscilloscope",
    "multimeter",
    "toolset",
    "tooling coolant",
    "cnc drill bits",
    "copper",
    "steel",
    "stainless steel sheet",
    "construction material",
    "fine metal mesh",
    "water pump",
    "silicone sealant",
    "glass",
    "laboratory flask",
    "mechanical pipette",
    "microscope",
    "complex glass electrode",
    "vapor lamp",
    "crystal prism",
    "hepa filter",
    "zinc electrode",
    "refrigerant",
    "burner head",
    "chemicals",
    "fabrics",
  ],
  "Blue Lagoon": [
    "blue_crate",
    "plastics",
    "plumbing parts",
    "water pump",
    "refrigerant",
    "copper",
    "burner head",
    "silicone sealant",
    "multimeter",
    "soldering iron",
    "glass",
    "electrical parts",
    "chemicals",
    "fabrics",
  ],
};

function buildTagsForSub(poi: RawPoi05): string[] {
  const n = poi.name.toLowerCase();
  const region = poi.parentRegion || "";
  const tierNum = getRegionTierNum(region);
  const tags = new Set<string>();

  // Medical / Bio-Lab / Quarantine facilities — strictly gated by Region Tier
  if (/hospital|decontamination|quarantine|medical|research facility|laboratory/.test(n)) {
    if (tierNum >= 3) {
      tags.add("hepa filter");
      tags.add("microscope");
      tags.add("laboratory flask");
      tags.add("mechanical pipette");
      tags.add("complex glass electrode");
      tags.add("chemicals");
      if (region === "Lakevale Sanctuary" || region === "Tiger Bay") {
        tags.add("vapor lamp");
      }
      if (region === "Lakevale Sanctuary") {
        tags.add("crystal prism");
        tags.add("zinc electrode");
      }
    } else if (tierNum === 2 && /clinic|medical/.test(n)) {
      tags.add("laboratory flask");
      tags.add("glass");
    }
  } else if (/clinic|infirmary/.test(n)) {
    if (tierNum >= 3) {
      tags.add("hepa filter");
      tags.add("microscope");
      tags.add("laboratory flask");
      tags.add("mechanical pipette");
      tags.add("complex glass electrode");
    } else if (tierNum === 2) {
      tags.add("laboratory flask");
      tags.add("glass");
    }
  }

  if (/drug lab/.test(n)) {
    tags.add("chemicals");
    tags.add("glass");
  }

  // Dedicated Server Rooms & High-Tier Comms / HQ Hubs (Server CPU vs regular CPU)
  if (/headquarters|\bhq\b|server/.test(n) && tierNum >= 2) {
    tags.add("cpu");
    tags.add("motherboard");
    tags.add("ram");
    tags.add("power supply");
    tags.add("electrical parts");
    tags.add("circuit board");
    if (tierNum >= 3 || region === "YBL-1") {
      tags.add("server cpu");
    }
    if (tierNum >= 3) {
      tags.add("military software");
      tags.add("civilian software");
      tags.add("signal generator");
      tags.add("oscilloscope");
    }
    if (region === "RLSL-1 Radio Observatory" || region === "Northern Reach" || region === "Fort Narith") {
      tags.add("laser tube");
    }
  }

  // Radio / Observatory / Radar / Tech Offices / Mall (NO blanket Server CPU on generic villas/motels)
  if (/radio|telescope|radar/.test(n) && tierNum >= 2) {
    tags.add("signal generator");
    tags.add("oscilloscope");
    tags.add("circuit board");
    tags.add("electrical parts");
    tags.add("cpu");
    if (tierNum >= 4) {
      tags.add("laser tube");
      tags.add("server cpu");
      tags.add("crystal prism");
    }
  }

  if (/\bmall\b|\boffice|\bhotel\b/.test(n) && tierNum >= 2) {
    tags.add("cpu");
    tags.add("motherboard");
    tags.add("graphics card");
    tags.add("ram");
    tags.add("power supply");
    tags.add("pc fan");
    tags.add("civilian software");
    tags.add("electrical parts");
    tags.add("circuit board");
    if (region === "Tiger Bay" && /\bmall\b/.test(n)) {
      tags.add("server cpu");
      tags.add("oscilloscope");
      tags.add("multimeter");
      tags.add("toolset");
      tags.add("tooling coolant");
      tags.add("cnc drill bits");
    }
  }

  // Trashed Campsites & Field Camps outside starter towns (Electronical spawn hotspots for CPU/PC parts, NOT Server CPU)
  if (/trashed campsite/.test(n) && tierNum >= 2) {
    tags.add("cpu");
    tags.add("pc fan");
    tags.add("ram");
    tags.add("power supply");
    tags.add("motherboard");
    tags.add("circuit board");
    tags.add("electrical parts");
  }

  // Kitchens / Canteens / Restaurants -> Burner Head & Refrigerant (NOT garages/sawmills)
  if (/kitchen|canteen|mess hall|restaurant/.test(n) && tierNum >= 2) {
    tags.add("burner head");
    tags.add("refrigerant");
  }

  // Residential / Barracks / Villas / Camps / Shelters -> Fabrics & Household Materials
  if (/villa|house|motel|hotel|barracks|dorm|shelter|camp|village|hut/.test(n)) {
    tags.add("fabrics");
    tags.add("glass");
  }

  // Industrial Warehouses, Hangars, Motor Pools, Supply Yards (NO starter town blue crates)
  if (/warehouse|hangar|motor pool|supply depot|supply yard|cement factory|trade depot|workshop|repair/.test(n)) {
    if (tierNum >= 2) {
      tags.add("blue_crate");
      tags.add("steel");
      tags.add("construction material");
      tags.add("plumbing parts");
      tags.add("mechanical parts");
      tags.add("copper");
      tags.add("fine metal mesh");
      tags.add("toolset");
      tags.add("tooling coolant");
      tags.add("cnc drill bits");
      tags.add("motor oil");
      tags.add("dynamo");
      tags.add("analog indicator");
      tags.add("water pump");
    } else {
      tags.add("toolset");
      tags.add("motor oil");
      tags.add("soldering iron");
    }
    if (tierNum >= 3) {
      tags.add("stainless steel sheet");
    }
  }

  if (/lumberyard|logging area/.test(n)) {
    tags.add("wood");
    if (tierNum >= 2) {
      tags.add("blue_crate");
      tags.add("construction material");
    }
  }

  if (/gas station|garage/.test(n)) {
    tags.add("motor oil");
    tags.add("toolset");
    if (tierNum >= 2) {
      tags.add("mechanical parts");
      tags.add("analog indicator");
      tags.add("dynamo");
    }
  }

  return Array.from(tags);
}

export const LAMANG_POIS: LamangPoi[] = [
  ...BASES_05.map((p) => ({ ...p, tags: ["base"] })),
  ...MAJOR_POIS_05.map((p) => ({
    ...p,
    tags: REGION_LOOT_TAGS[p.name] || [],
  })),
  ...SUB_POIS_05.map((p) => ({
    ...p,
    tags: buildTagsForSub(p),
  })),
  ...COPS_05.map((p) => ({ ...p, tags: ["cop"] })),
  ...LZS_05.map((p) => ({ ...p, tags: ["lz"] })),
];

export {
  BLUE_CRATES_05,
  DISASSEMBLY_SPAWNS_05,
  CHEMICAL_AREAS_05,
  ELECTRONIC_AREAS_05,
  MEDICAL_AREAS_05,
};

/**
 * Exact Update 0.5 PC Part & Tech Spawn anchors (verified EPSG:3857 coordinates)
 * supplemented with custom user-dropped pins.
 */
export const DEFAULT_SEED_PINS: CustomMapPin[] = [
  {
    id: "seed-pc-tigerbay",
    x: 9866,
    y: 2987,
    layer: "pcSpawns",
    label: "Tiger Bay Mall & Tech Offices",
    materialId: "motherboard",
  },
  {
    id: "seed-pc-midnight-hotel",
    x: 7144,
    y: 6669,
    layer: "pcSpawns",
    label: "Midnight Sapphire Hotel & Admin",
    materialId: "graphics_card",
  },
  {
    id: "seed-pc-ybl1",
    x: 4319,
    y: 2254,
    layer: "pcSpawns",
    label: "YBL-1 Underground Bunker Server Room",
    materialId: "power_supply",
  },
  {
    id: "seed-pc-narith",
    x: 4315,
    y: 2971,
    layer: "pcSpawns",
    label: "Fort Narith HQ & Comms Room",
    materialId: "military_software",
  },
  {
    id: "seed-pc-rlsl1-hq",
    x: 5073,
    y: 4049,
    layer: "pcSpawns",
    label: "RLSL-1 Observatory Headquarters",
    materialId: "signal_generator",
  },
  {
    id: "seed-pc-rlsl1-dish",
    x: 5154,
    y: 4080,
    layer: "pcSpawns",
    label: "RLSL-1 Telescope Building",
    materialId: "oscilloscope",
  },
  {
    id: "seed-pc-nr-offices",
    x: 7045,
    y: 5285,
    layer: "pcSpawns",
    label: "Northern Reach Offices & Tech",
    materialId: "server_cpu",
  },
  {
    id: "seed-pc-nr-hq",
    x: 6922,
    y: 5252,
    layer: "pcSpawns",
    label: "Northern Reach Headquarters",
    materialId: "military_software",
  },
  {
    id: "seed-pc-siang-radio",
    x: 9301,
    y: 4696,
    layer: "pcSpawns",
    label: "Siang Radio Station",
    materialId: "signal_generator",
  },
  {
    id: "seed-pc-amateur-radio",
    x: 8840,
    y: 2753,
    layer: "pcSpawns",
    label: "Amateur Radio Station",
    materialId: "circuit_board",
  },
  {
    id: "seed-pc-lakevale-sub",
    x: 8283,
    y: 4160,
    layer: "pcSpawns",
    label: "Lakevale Electrical Substation",
    materialId: "electrical_parts",
  },
  {
    id: "seed-pc-lakevale-main",
    x: 8386,
    y: 4249,
    layer: "pcSpawns",
    label: "Lakevale Sanctuary Main Building",
    materialId: "complex_glass_electrode",
  },
];
