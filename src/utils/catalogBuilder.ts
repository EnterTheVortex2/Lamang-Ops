import {
  BLUE_CRATES_05,
  CHEMICAL_AREAS_05,
  DISASSEMBLY_SPAWNS_05,
  ELECTRONIC_AREAS_05,
  LAMANG_POIS,
  MEDICAL_AREAS_05,
  type CustomMapPin,
  type MapLayerKey,
} from "../config/mapConfig";
import {
  CANONICAL_HIDEOUT_UPGRADES,
  FALLBACK_DISASSEMBLY_RECIPES,
  MATERIAL_INTEL_HINTS,
  type DisassemblyCategory,
  type DisassemblyOutcomeDetail,
  type DisassemblyRecipeDef,
  type HideoutUpgradeDef,
  type RoomId,
} from "../data/hideoutData";
import type { ApiCachePayload, NormalizedApiRecord } from "../services/gzwApi";
import { resolveTacticalImageUrl } from "./imageUtils";

export interface CatalogMaterial {
  key: string;
  id: string;
  name: string;
  room: RoomId | "all";
  dataset: string;
  required: number;
  tiersUsed: number[];
  layerHint: Exclude<MapLayerKey, "tickedSpawns" | "poiLabels" | "subLocations" | "copsAndLzs">;
  image: string | null;
  description: string;
  weight?: string;
  gridSize?: string;
  sellPrice?: string;
  spawnNotes: string[];
  usedInUpgrades: {
    id: string;
    name: string;
    module: string;
    room: RoomId;
    level: number;
    quantity: number;
  }[];
  apiCoords: { x: number; y: number; label: string }[];
}

export interface SpawnPoint {
  x: number;
  y: number;
  title: string;
  source: string;
  tier?: string;
  lz?: string;
  kind?: string;
}

function mapApiRoomToRoomId(roomStr?: string, slotOrName?: string): RoomId {
  const combined = `${roomStr || ""} ${slotOrName || ""}`.toLowerCase();
  if (combined.includes("utility") || combined.includes("generator")) {
    return "utility";
  }
  if (
    combined.includes("electron") ||
    combined.includes("hardware") ||
    combined.includes("machine tools") ||
    combined.includes("rf") ||
    combined.includes("software")
  ) {
    return "electronics";
  }
  if (
    combined.includes("lab") ||
    combined.includes("analysis") ||
    combined.includes("extraction") ||
    combined.includes("filtration") ||
    combined.includes("glass") ||
    combined.includes("heat source") ||
    combined.includes("reaction") ||
    combined.includes("safety")
  ) {
    return "laboratory";
  }
  return "utility";
}

function guessLayerHint(
  name: string,
  desc: string
): Exclude<MapLayerKey, "tickedSpawns" | "poiLabels" | "subLocations" | "copsAndLzs"> {
  const hint = MATERIAL_INTEL_HINTS[name.toLowerCase()];
  if (hint) return hint.layerHint;

  const text = `${name} ${desc}`.toLowerCase();
  if (
    text.includes("pc ") ||
    text.includes("circuit") ||
    text.includes("cpu") ||
    text.includes("ram") ||
    text.includes("power supply") ||
    text.includes("oscilloscope") ||
    text.includes("multimeter") ||
    text.includes("soldering") ||
    text.includes("electrical") ||
    text.includes("sensor") ||
    text.includes("signal") ||
    text.includes("motherboard") ||
    text.includes("graphics") ||
    text.includes("software") ||
    text.includes("laser")
  ) {
    return "pcSpawns";
  }
  if (
    text.includes("plastic") ||
    text.includes("steel") ||
    text.includes("wood") ||
    text.includes("plumbing") ||
    text.includes("construction") ||
    text.includes("mechanical") ||
    text.includes("copper") ||
    text.includes("burner") ||
    text.includes("pump") ||
    text.includes("mesh") ||
    text.includes("sealant") ||
    text.includes("indicator") ||
    text.includes("sheet") ||
    text.includes("dynamo") ||
    text.includes("motor oil") ||
    text.includes("tool")
  ) {
    return "blueCrates";
  }
  return "apiLoot";
}

/**
 * Builds the complete 36 Hideout Upgrades list across Utility Room, Electronics Workshop,
 * and Laboratory (Levels 1, 2, 3), preferring live API `hideout_modules` when loaded
 * and merging with canonical 0.5 module definitions so all 36 are always present.
 */
export function buildAllHideoutUpgrades(
  apiCache: ApiCachePayload | null
): HideoutUpgradeDef[] {
  const byKey = new Map<string, HideoutUpgradeDef>();

  // 1. Seed canonical 36 modules first
  for (const upg of CANONICAL_HIDEOUT_UPGRADES) {
    const key = `${upg.room}::${upg.module.toLowerCase()}::${upg.level}`;
    byKey.set(key, upg);
  }

  // 2. Overlay/enrich from live `hideout_modules` API dataset
  const apiModules = apiCache?.datasets?.hideout_modules || [];
  for (const mod of apiModules) {
    const roomId = mapApiRoomToRoomId(mod.room, mod.name);
    const modName = mod.module || mod.category || "Module";
    const level = mod.level || 1;
    const key = `${roomId}::${modName.toLowerCase()}::${level}`;
    const existing = byKey.get(key);

    const apiBenefit = mod.benefit && !mod.benefit.includes("+ x ")
      ? mod.benefit
      : existing?.benefit || mod.benefit || mod.description || "Hideout upgrade";

    byKey.set(key, {
      id: existing?.id || mod.id,
      room: roomId,
      module: modName,
      level,
      name: mod.name || existing?.name || `${modName} Level ${level}`,
      benefit: apiBenefit,
      requirements:
        mod.requirements && mod.requirements.length > 0
          ? mod.requirements
          : existing?.requirements || [],
    });
  }

  return Array.from(byKey.values()).sort(
    (a, b) =>
      a.module.localeCompare(b.module) ||
      a.level - b.level ||
      a.room.localeCompare(b.room)
  );
}

/**
 * Strictly returns ONLY materials required for the 36 Hideout Upgrades (Tier 1, 2, and 3)
 * — never unrelated loot — enriched with metadata & icons from gzw-data.dev.
 */
export function buildMaterialsCatalog(
  apiCache: ApiCachePayload | null,
  allUpgrades: HideoutUpgradeDef[]
): CatalogMaterial[] {
  const byNormName = new Map<string, CatalogMaterial>();

  for (const upg of allUpgrades) {
    for (const req of upg.requirements) {
      if (req.name.toLowerCase() === "dollars") continue;
      const norm = req.name.trim().toLowerCase();
      const slug = norm.replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
      const hint = MATERIAL_INTEL_HINTS[norm];

      let entry = byNormName.get(norm);
      if (!entry) {
        entry = {
          key: slug,
          id: slug,
          name: req.name,
          room: upg.room,
          dataset: "Hideout Upgrade Material",
          required: 0,
          tiersUsed: [],
          layerHint: hint?.layerHint || guessLayerHint(req.name, ""),
          image: resolveTacticalImageUrl(null, req.name),
          description: hint?.description || `Required for ${upg.module} upgrades.`,
          spawnNotes: hint ? [...hint.spawnNotes] : ["Lamang Loot Containers & Crates"],
          usedInUpgrades: [],
          apiCoords: [],
        };
        byNormName.set(norm, entry);
      }

      entry.required += req.quantity;
      if (!entry.tiersUsed.includes(upg.level)) {
        entry.tiersUsed.push(upg.level);
        entry.tiersUsed.sort((a, b) => a - b);
      }

      entry.usedInUpgrades.push({
        id: upg.id,
        name: upg.name,
        module: upg.module,
        room: upg.room,
        level: upg.level,
        quantity: req.quantity,
      });
    }
  }

  // Enrich ONLY those Hideout Upgrade Materials with images, weight, price, and spawn metadata from API
  const enrichmentDatasets = [
    "gamedata_hideout_materials",
    "building_material",
    "workshop_supplies",
    "laboratory_supplies",
    "electronics",
    "tools",
    "crafting_material",
    "production_material",
    "military_material",
  ];

  for (const ds of enrichmentDatasets) {
    const rows: NormalizedApiRecord[] = apiCache?.datasets?.[ds] || [];
    for (const rec of rows) {
      const norm = rec.name.trim().toLowerCase();
      const existing = byNormName.get(norm);
      if (!existing) continue;

      const resolvedImg = resolveTacticalImageUrl(rec.image, existing.name);
      if (resolvedImg && (!existing.image || existing.image.includes("assets/items/"))) {
        // Prefer local studio asset if it exists, otherwise take valid API image
        if (!existing.image) existing.image = resolvedImg;
      }
      if (rec.description && rec.description.length > existing.description.length) {
        existing.description = rec.description;
      }
      if (rec.weight && !existing.weight) existing.weight = rec.weight;
      if (rec.gridSize && !existing.gridSize) existing.gridSize = rec.gridSize;
      if (rec.sellPrice && !existing.sellPrice) existing.sellPrice = rec.sellPrice;
      if (ds !== "gamedata_hideout_materials") {
        existing.dataset = ds.replace(/_/g, " ");
      }
      for (const sn of rec.spawnNotes) {
        if (!existing.spawnNotes.includes(sn)) existing.spawnNotes.push(sn);
      }
      if (rec.coords) {
        existing.apiCoords.push({ ...rec.coords, label: rec.name });
      }
    }
  }

  return Array.from(byNormName.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}

function classifyDisassemblyCategory(
  name: string,
  outcomes: string[]
): DisassemblyCategory {
  const txt = `${name} ${outcomes.join(" ")}`.toLowerCase();
  if (
    txt.includes("container") ||
    txt.includes("fuel cell") ||
    txt.includes("canister")
  ) {
    return "Containers & Chem";
  }
  if (
    txt.includes("ballistic") ||
    txt.includes("avionics") ||
    txt.includes("onboard") ||
    txt.includes("drone") ||
    txt.includes("missile")
  ) {
    return "Avionics & Weapons";
  }
  return "Electronics & Comms";
}

function classifyOutcomeKind(
  name: string,
  isCraftingMaterial: boolean
): DisassemblyOutcomeDetail["kind"] {
  if (isCraftingMaterial) return "Crafting Material";
  const lower = name.toLowerCase();
  if (lower.includes("canister")) return "Canister / Biohazard";
  if (
    lower.includes("drive") ||
    lower.includes("logs") ||
    lower.includes("manifest")
  ) {
    return "Intel / Data Drive";
  }
  return "Module";
}

export function buildDisassemblyRecipes(
  apiCache: ApiCachePayload | null
): DisassemblyRecipeDef[] {
  const byNorm = new Map<string, DisassemblyRecipeDef>();
  for (const fallback of FALLBACK_DISASSEMBLY_RECIPES) {
    byNorm.set(fallback.name.trim().toLowerCase(), {
      ...fallback,
      image: resolveTacticalImageUrl(fallback.image, fallback.name),
      outcomeDetails: fallback.outcomeDetails.map((d) => ({
        ...d,
        image: resolveTacticalImageUrl(d.image, d.name),
      })),
    });
  }

  const disMatMap = new Map<string, NormalizedApiRecord>();
  for (const rec of apiCache?.datasets?.disassembly_material || []) {
    disMatMap.set(rec.name.trim().toLowerCase(), rec);
  }

  const craftMatMap = new Map<string, NormalizedApiRecord>();
  for (const rec of [
    ...(apiCache?.datasets?.crafting_material || []),
    ...(apiCache?.datasets?.production_material || []),
    ...(apiCache?.datasets?.military_material || []),
  ]) {
    craftMatMap.set(rec.name.trim().toLowerCase(), rec);
  }

  const uncatMap = new Map<string, NormalizedApiRecord>();
  for (const rec of apiCache?.datasets?.uncategorized || []) {
    uncatMap.set(rec.name.trim().toLowerCase(), rec);
  }

  const apiRows = apiCache?.datasets?.disassembly_recipes || [];
  for (const rec of apiRows) {
    const norm = rec.name.trim().toLowerCase();
    const existing = byNorm.get(norm);
    const raw = rec.raw || {};
    const outcomes = Array.isArray(raw.outcome)
      ? raw.outcome.map((o) => String(o))
      : typeof raw.outcome_text === "string"
        ? raw.outcome_text
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : existing?.outcomes || [];

    const outcomeDetails: DisassemblyOutcomeDetail[] = outcomes.map((outName) => {
      const oNorm = outName.trim().toLowerCase();
      const craft = craftMatMap.get(oNorm);
      const uncat = uncatMap.get(oNorm);
      const prev = existing?.outcomeDetails.find(
        (d) => d.name.trim().toLowerCase() === oNorm
      );
      return {
        name: outName,
        kind: classifyOutcomeKind(outName, !!craft || prev?.kind === "Crafting Material"),
        sellPrice: craft?.sellPrice || uncat?.sellPrice || prev?.sellPrice,
        gridSize: craft?.gridSize || uncat?.gridSize || prev?.gridSize,
        weight: craft?.weight || uncat?.weight || prev?.weight,
        image: resolveTacticalImageUrl(craft?.image || prev?.image, outName),
      };
    });

    const matMeta = disMatMap.get(norm);
    const category =
      existing?.category || classifyDisassemblyCategory(rec.name, outcomes);

    byNorm.set(norm, {
      id: existing?.id || rec.id,
      name: rec.name,
      duration:
        typeof raw.duration === "string"
          ? raw.duration
          : existing?.duration || "4–8 hours",
      outcomes,
      outcomeDetails,
      sellPrice:
        (typeof raw.sell_price === "string" && raw.sell_price) ||
        rec.sellPrice ||
        matMeta?.sellPrice ||
        existing?.sellPrice,
      gridSize: matMeta?.gridSize || existing?.gridSize,
      weight: matMeta?.weight || existing?.weight,
      manufacturer: matMeta?.manufacturer || existing?.manufacturer,
      category,
      image: resolveTacticalImageUrl(matMeta?.image || existing?.image, rec.name),
      station:
        category === "Containers & Chem"
          ? "Electronics Workshop / Lab"
          : "Electronics Workshop",
    });
  }

  return Array.from(byNorm.values());
}

export function getDisassemblySpawnSummary(itemName: string): {
  count: number;
  pois: string[];
} {
  const norm = itemName.trim().toLowerCase();
  const pois: string[] = [];
  let count = 0;
  for (const sp of DISASSEMBLY_SPAWNS_05) {
    if (sp.name.trim().toLowerCase() === norm) {
      count += 1;
      if (!pois.includes(sp.poi)) pois.push(sp.poi);
    }
  }
  return { count, pois };
}

export function buildDisassemblyCatalogMaterial(
  rec: DisassemblyRecipeDef
): CatalogMaterial {
  const spawnSummary = getDisassemblySpawnSummary(rec.name);
  const outcomesLabel = rec.outcomes.join(" + ");
  const spawnNotes: string[] = [];
  if (spawnSummary.pois.length > 0) {
    spawnNotes.push(
      `${spawnSummary.count} confirmed spawn${spawnSummary.count === 1 ? "" : "s"} in ${spawnSummary.pois.join(", ")}`
    );
  }
  spawnNotes.push(`Disassembly time: ${rec.duration} (${rec.station})`);
  spawnNotes.push(`Yields: ${outcomesLabel}`);

  return {
    key: `disassembly_${rec.id}`,
    id: rec.id,
    name: rec.name,
    room: rec.category === "Containers & Chem" ? "laboratory" : "electronics",
    dataset: "Disassembly Item",
    required: 1,
    tiersUsed: [],
    layerHint: "disassemblySpawns",
    image: resolveTacticalImageUrl(rec.image, rec.name),
    description: `${rec.category} · ${rec.duration} disassembly${
      rec.gridSize ? ` · ${rec.gridSize}` : ""
    }${rec.weight ? ` · ${rec.weight}` : ""}${
      rec.sellPrice ? ` · Raw value ${rec.sellPrice}` : ""
    }. Breaks down into ${outcomesLabel}.`,
    weight: rec.weight,
    gridSize: rec.gridSize,
    sellPrice: rec.sellPrice,
    spawnNotes,
    usedInUpgrades: [],
    apiCoords: [],
  };
}

const ELECTRONIC_AREA_MATERIALS = new Set([
  "cpu",
  "motherboard",
  "ram",
  "power supply",
  "pc fan",
  "circuit board",
  "electrical parts",
  "graphics card",
]);

const MEDICAL_AREA_MATERIALS = new Set([
  "microscope",
  "laboratory flask",
  "mechanical pipette",
  "complex glass electrode",
  "vapor lamp",
  "crystal prism",
  "hepa filter",
]);

const CRATE_LOOT_MATERIALS = new Set([
  "plastics",
  "steel",
  "wood",
  "plumbing parts",
  "mechanical parts",
  "construction material",
  "stainless steel sheet",
  "glass",
  "fine metal mesh",
  "copper",
  "water pump",
  "silicone sealant",
]);

export function findDisassemblyRecipeForItemOrYield(
  itemName: string
): { recipe: DisassemblyRecipeDef; matchedAs: "source" | "yield" } | null {
  const norm = itemName.trim().toLowerCase();
  if (!norm) return null;
  for (const rec of FALLBACK_DISASSEMBLY_RECIPES) {
    if (rec.name.trim().toLowerCase() === norm) {
      return { recipe: rec, matchedAs: "source" };
    }
  }
  for (const rec of FALLBACK_DISASSEMBLY_RECIPES) {
    if (
      rec.outcomes.some((o) => o.trim().toLowerCase() === norm) ||
      rec.outcomeDetails.some((d) => d.name.trim().toLowerCase() === norm)
    ) {
      return { recipe: rec, matchedAs: "yield" };
    }
  }
  return null;
}

export function buildYieldCatalogMaterial(
  yieldName: string,
  recipe: DisassemblyRecipeDef
): CatalogMaterial {
  const detail = recipe.outcomeDetails.find(
    (d) => d.name.trim().toLowerCase() === yieldName.trim().toLowerCase()
  );
  const spawnSummary = getDisassemblySpawnSummary(recipe.name);
  const slug = yieldName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_");
  const spawnNotes: string[] = [
    `Obtained by disassembling ${recipe.name} (${recipe.duration}) at ${recipe.station}`,
  ];
  if (spawnSummary.pois.length > 0) {
    spawnNotes.push(
      `${recipe.name} spawns (${spawnSummary.count}) in ${spawnSummary.pois.join(", ")}`
    );
  }

  return {
    key: `yield_${slug}`,
    id: `yield_${slug}`,
    name: yieldName,
    room: recipe.category === "Containers & Chem" ? "laboratory" : "electronics",
    dataset: "Disassembly Yield",
    required: 1,
    tiersUsed: [],
    layerHint: "disassemblySpawns",
    image: resolveTacticalImageUrl(detail?.image || recipe.image, yieldName),
    description: `${detail?.kind || "Salvaged Output"} obtained from disassembling ${recipe.name} (${recipe.duration}).${
      detail?.sellPrice ? ` Sell value: ${detail.sellPrice}.` : ""
    }`,
    weight: detail?.weight,
    gridSize: detail?.gridSize,
    sellPrice: detail?.sellPrice,
    spawnNotes,
    usedInUpgrades: [],
    apiCoords: [],
  };
}

export function resolveSpawnPointsForMaterial(
  mat: CatalogMaterial,
  customPins: CustomMapPin[],
  extraLootNotes: string[] = []
): SpawnPoint[] {
  const points: SpawnPoint[] = [];
  const canonicalName = mat.name.trim().toLowerCase();

  for (const pin of customPins) {
    if (pin.materialId === mat.id || pin.materialId === mat.key) {
      points.push({
        x: pin.x,
        y: pin.y,
        title: pin.label,
        source: "Pinned Spawn",
        kind: "pin",
      });
    }
  }

  for (const c of mat.apiCoords) {
    points.push({
      x: c.x,
      y: c.y,
      title: c.label,
      source: "API Coordinates",
      kind: "api",
    });
  }

  const textBlob = [
    mat.name,
    mat.description,
    ...mat.spawnNotes,
    ...extraLootNotes,
  ]
    .join(" ")
    .toLowerCase();

  // Direct Disassembly Item matches (source item OR yielded material/drive/canister)
  const disassemblyMatch = findDisassemblyRecipeForItemOrYield(mat.name);
  for (const dis of DISASSEMBLY_SPAWNS_05) {
    const disLower = dis.name.toLowerCase();
    if (
      textBlob.includes(disLower) ||
      (disassemblyMatch && disassemblyMatch.recipe.name.toLowerCase() === disLower)
    ) {
      points.push({
        x: dis.x,
        y: dis.y,
        title:
          disassemblyMatch?.matchedAs === "yield"
            ? `${dis.poi} · Disassemble ${dis.name}`
            : `${dis.poi} · ${dis.name}`,
        source:
          disassemblyMatch?.matchedAs === "yield"
            ? `Disassembles into ${mat.name}`
            : "Disassembly Spawn",
        kind: "disassembly",
      });
    }
  }

  // Direct Chemicals Supplies Areas when inspecting Chemicals
  if (canonicalName === "chemicals") {
    for (const chem of CHEMICAL_AREAS_05) {
      points.push({
        x: chem.x,
        y: chem.y,
        title: `${chem.poi} · ${chem.name}`,
        source: "Chemicals Supplies Area",
        kind: "chemicals",
      });
    }
  }

  // Direct Electronic Supplies Areas (26 spots, including Trashed Campsites) for standard PC/electronics parts (NOT Server CPU)
  if (ELECTRONIC_AREA_MATERIALS.has(canonicalName)) {
    for (const elec of ELECTRONIC_AREAS_05.slice(0, 14)) {
      points.push({
        x: elec.x,
        y: elec.y,
        title: `${elec.poi} · ${elec.name}`,
        source: "Electronic Supplies Area",
        kind: "electronics",
      });
    }
  }

  // Direct Medical Supplies Areas (6 Tier 3-4 spots) for lab/medical items
  if (MEDICAL_AREA_MATERIALS.has(canonicalName)) {
    for (const med of MEDICAL_AREAS_05) {
      points.push({
        x: med.x,
        y: med.y,
        title: `${med.poi} · ${med.name}`,
        source: "Medical Supplies Area",
        tier: med.poi === "Fort Narith" || med.poi === "Tiger Bay" ? "Tier 3" : "Tier 4",
        kind: "medical",
      });
    }
  }

  // Exact Update 0.5 POIs & Sub-Locations matching canonical material tag (prevents "cpu" matching "server cpu")
  const matchedPois: SpawnPoint[] = [];
  for (const poi of LAMANG_POIS) {
    if (poi.kind === "base" || poi.kind === "cop" || poi.kind === "lz") continue;
    const exactTagMatch = poi.tags.includes(canonicalName);
    if (exactTagMatch) {
      matchedPois.push({
        x: poi.x,
        y: poi.y,
        title:
          poi.kind === "sublocation" && poi.parentRegion
            ? `${poi.parentRegion} · ${poi.name}`
            : poi.name,
        tier: poi.tier,
        lz: poi.lz,
        kind: poi.kind,
        source:
          poi.kind === "sublocation"
            ? `${poi.parentRegion || "Compound"} Spawn`
            : "Verified Loot Region",
      });
    }
  }

  matchedPois.sort((a, b) => {
    const score = (k?: string) => (k === "tier4" ? 0 : k === "major" ? 1 : 2);
    return score(a.kind) - score(b.kind);
  });
  points.push(...matchedPois.slice(0, 16));

  // Include Tier-appropriate Building Material Crates ONLY for actual crate materials
  if (CRATE_LOOT_MATERIALS.has(canonicalName)) {
    const minCrateTier = canonicalName === "stainless steel sheet" ? 3 : 2;
    const seenRegions = new Set<string>();
    for (const crate of BLUE_CRATES_05) {
      if ((crate.tier ?? 2) < minCrateTier) continue;
      if (seenRegions.has(crate.poi)) continue;
      seenRegions.add(crate.poi);
      points.push({
        x: crate.x,
        y: crate.y,
        title: `${crate.poi} · ${crate.name} (Lv.${crate.tier ?? 2})`,
        tier: crate.tier ? `Crate Lv.${crate.tier}` : undefined,
        source: "Blue-Planked Material Crate",
        kind: "crate",
      });
      if (seenRegions.size >= 10) break;
    }
  }

  // Smart Category / Dataset Fallback for general API Item Index records so no item ever has 0 map targets
  if (points.length === 0) {
    const hintText = `${mat.dataset} ${mat.name} ${mat.description} ${extraLootNotes.join(" ")}`.toLowerCase();

    if (
      /medical|medkit|surgical|suture|splint|bandage|tourniquet|injector|stim|blood|painkiller|antidote|provisions|ration/.test(
        hintText
      )
    ) {
      for (const med of MEDICAL_AREAS_05) {
        points.push({
          x: med.x,
          y: med.y,
          title: `${med.poi} · ${med.name}`,
          source: "Medical Supplies Area",
          tier: med.poi === "Fort Narith" || med.poi === "Tiger Bay" ? "Tier 3" : "Tier 4",
          kind: "medical",
        });
      }
    } else if (/chemical|biohazard|canister|reagent|acid|toxic|lab/.test(hintText)) {
      for (const chem of CHEMICAL_AREAS_05.slice(0, 10)) {
        points.push({
          x: chem.x,
          y: chem.y,
          title: `${chem.poi} · ${chem.name}`,
          source: "Chemicals Supplies Area",
          kind: "chemicals",
        });
      }
    } else if (
      /electronic|radio|circuit|computer|server|processor|asic|fpga|oscillator|sensor|nvg|night vision|laser|optic|scope|holosight|drive|intel/.test(
        hintText
      )
    ) {
      for (const elec of ELECTRONIC_AREAS_05.slice(0, 12)) {
        points.push({
          x: elec.x,
          y: elec.y,
          title: `${elec.poi} · ${elec.name}`,
          source: "Electronic Supplies Area",
          kind: "electronics",
        });
      }
    } else if (
      /tool|building|workshop|construction|industrial|hardware|craft|production|supply|material|crate/.test(
        hintText
      )
    ) {
      const seenRegions = new Set<string>();
      for (const crate of BLUE_CRATES_05) {
        if (seenRegions.has(crate.poi)) continue;
        seenRegions.add(crate.poi);
        points.push({
          x: crate.x,
          y: crate.y,
          title: `${crate.poi} · ${crate.name}`,
          tier: crate.tier ? `Crate Lv.${crate.tier}` : undefined,
          source: "Supply Crate Region",
          kind: "crate",
        });
        if (seenRegions.size >= 8) break;
      }
    } else {
      // Tactical gear / firearms / ammo / valuables -> Primary Tier 3-4 Military & High-Loot POIs
      const militaryHighTier = LAMANG_POIS.filter(
        (p) =>
          (p.kind === "tier4" || p.kind === "major") &&
          (p.tier === "Tier 4" || p.tier === "Tier 3") &&
          p.id !== "poi-ground-zero"
      ).slice(0, 8);
      for (const poi of militaryHighTier) {
        points.push({
          x: poi.x,
          y: poi.y,
          title: poi.name,
          tier: poi.tier,
          lz: poi.lz,
          source: "Military & High-Tier Loot Zone",
          kind: poi.kind,
        });
      }
    }
  }

  const unique: SpawnPoint[] = [];
  const seen = new Set<string>();
  for (const pt of points) {
    const k = `${pt.x},${pt.y}`;
    if (!seen.has(k)) {
      seen.add(k);
      unique.push(pt);
    }
  }
  return unique;
}
