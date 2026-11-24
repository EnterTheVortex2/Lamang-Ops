import { WEAPON_PARTS_BY_ID, WEAPONS_CATALOG } from "../data/weaponLoadoutData";
import type { ApiCachePayload, NormalizedApiRecord } from "../services/gzwApi";
import { resolveTacticalImageUrl } from "./imageUtils";

export type VendorShopGroup =
  | "ALL"
  | "Weapons"
  | "Ammo"
  | "Armor & Helmets"
  | "Attachments"
  | "Optics & NVG"
  | "Medical"
  | "Containers & Packs"
  | "Tactical & Provisions";

export const VENDOR_SHOP_GROUPS: { id: VendorShopGroup; label: string }[] = [
  { id: "ALL", label: "All Categories" },
  { id: "Weapons", label: "Weapons" },
  { id: "Ammo", label: "Ammo" },
  { id: "Armor & Helmets", label: "Armor & Helmets" },
  { id: "Attachments", label: "Attachments" },
  { id: "Optics & NVG", label: "Optics & NVG" },
  { id: "Medical", label: "Medical" },
  { id: "Containers & Packs", label: "Containers & Packs" },
  { id: "Tactical & Provisions", label: "Gear & Provisions" },
];

export interface VendorShopItem {
  id: string;
  itemName: string;
  vendor: string;
  rank: 1 | 2 | 3 | 4 | null;
  rawCategory: string;
  shopGroup: Exclude<VendorShopGroup, "ALL">;
  type: string;
  buyPrice: string | null;
}

export interface VendorItemEnrichment {
  image: string | null;
  buyPrice: string | null;
  sellPrice: string | null;
  weight: string | null;
  gridSize: string | null;
  manufacturer: string | null;
  description: string | null;
  specs: { label: string; value: string }[];
}

export function parseUsdPrice(priceStr: string | null | undefined): number | null {
  if (!priceStr) return null;
  const cleaned = priceStr.replace(/[^0-9.]/g, "");
  if (!cleaned) return null;
  const num = Number(cleaned);
  return Number.isFinite(num) ? num : null;
}

function classifyShopGroup(
  rawCategory: string
): Exclude<VendorShopGroup, "ALL"> {
  const cat = rawCategory.toLowerCase();
  if (cat === "weapons") return "Weapons";
  if (cat === "ammo") return "Ammo";
  if (
    cat === "armor" ||
    cat === "plate_carriers" ||
    cat === "helmets" ||
    cat === "rigs" ||
    cat === "vests" ||
    cat === "belts" ||
    cat === "face_mask" ||
    cat === "glasses"
  ) {
    return "Armor & Helmets";
  }
  if (
    cat === "collimators" ||
    cat === "scopes" ||
    cat === "night_vision" ||
    cat === "binoculars" ||
    cat === "helmet_mounts" ||
    cat === "front_iron_sights" ||
    cat === "rear_iron_sights"
  ) {
    return "Optics & NVG";
  }
  if (cat === "medical") return "Medical";
  if (cat === "containers" || cat === "backpacks") {
    return "Containers & Packs";
  }
  if (
    cat === "mounts" ||
    cat === "muzzle_devices" ||
    cat === "suppressors" ||
    cat === "foregrips" ||
    cat === "tactical_devices" ||
    cat === "magazines" ||
    cat === "handguards" ||
    cat === "stock_adapters" ||
    cat === "stocks" ||
    cat === "pistol_grips" ||
    cat === "charging_handle" ||
    cat === "gas_blocks" ||
    cat === "upper_receivers" ||
    cat === "barrels" ||
    cat === "buffer_tubes" ||
    cat === "slides" ||
    cat === "weapon_parts"
  ) {
    return "Attachments";
  }
  return "Tactical & Provisions";
}

export function buildVendorShopCatalog(
  apiCache: ApiCachePayload | null
): VendorShopItem[] {
  const rows = apiCache?.datasets?.vendor_stock || [];
  const items: VendorShopItem[] = [];

  for (const rec of rows) {
    const raw = rec.raw || {};
    const vendor = String(raw.vendor || "").trim();
    const itemName = String(raw.item || rec.name || "").trim();
    if (!vendor || !itemName) continue;

    const rankNum =
      typeof raw.rank === "number" && raw.rank >= 1 && raw.rank <= 4
        ? (raw.rank as 1 | 2 | 3 | 4)
        : null;

    const rawCategory = String(raw.category || "items")
      .trim()
      .toLowerCase();

    const buyPrice =
      typeof raw.buy_price === "string" && raw.buy_price.trim()
        ? raw.buy_price.trim()
        : null;

    items.push({
      id: rec.id,
      itemName,
      vendor,
      rank: rankNum,
      rawCategory,
      shopGroup: classifyShopGroup(rawCategory),
      type: String(raw.type || rawCategory.replace(/_/g, " ")).trim(),
      buyPrice,
    });
  }

  return items.sort(
    (a, b) =>
      (a.rank ?? 9) - (b.rank ?? 9) ||
      a.shopGroup.localeCompare(b.shopGroup) ||
      a.itemName.localeCompare(b.itemName)
  );
}

let cachedStaticEnrichment: Map<string, VendorItemEnrichment> | null = null;

/**
 * Instant baseline enrichment for weapons & all 843 attachments from bundled 0.5 Gunsmith catalog,
 * guaranteeing immediate crisp thumbnails and specs before lazy category API calls finish.
 */
export function getStaticWeaponAndPartEnrichmentMap(): Map<string, VendorItemEnrichment> {
  if (cachedStaticEnrichment) return cachedStaticEnrichment;
  const map = new Map<string, VendorItemEnrichment>();

  for (const w of WEAPONS_CATALOG) {
    const specs: { label: string; value: string }[] = [
      { label: "Class", value: w.weaponClass },
      { label: "Caliber", value: w.caliber },
    ];
    if (w.fireRate) specs.push({ label: "Fire Rate", value: `${w.fireRate} RPM` });
    if (w.fireMode) specs.push({ label: "Fire Mode", value: w.fireMode });
    if (w.ergonomics) specs.push({ label: "Ergonomics", value: String(w.ergonomics) });
    if (w.accuracyMoa !== null && w.accuracyMoa !== undefined && w.accuracyMoa > 0) {
      specs.push({ label: "Accuracy", value: `${w.accuracyMoa} MOA` });
    }

    map.set(w.name.trim().toLowerCase(), {
      image: resolveTacticalImageUrl(w.image, w.name),
      buyPrice: w.buyPrice ? `$${w.buyPrice.toLocaleString()}` : null,
      sellPrice: null,
      weight: w.weightKg ? `${w.weightKg}kg` : null,
      gridSize: null,
      manufacturer: w.manufacturer || null,
      description: w.acceptedAmmo
        ? `${w.weaponClass} chambered in ${w.caliber}. Accepted ammo: ${w.acceptedAmmo}.`
        : `${w.weaponClass} chambered in ${w.caliber}.`,
      specs,
    });
  }

  for (const p of Object.values(WEAPON_PARTS_BY_ID)) {
    const specs: { label: string; value: string }[] = [];
    if (p.caliber) specs.push({ label: "Caliber", value: p.caliber });
    if (p.magnification) specs.push({ label: "Magnification", value: p.magnification });
    if (p.sightingRange) specs.push({ label: "Sighting Range", value: p.sightingRange });
    if (p.modes) specs.push({ label: "Modes", value: p.modes });
    if (p.ergonomics) specs.push({ label: "Ergonomics", value: `${p.ergonomics > 0 ? "+" : ""}${p.ergonomics}` });
    if (p.recoilControl) specs.push({ label: "Recoil Ctrl", value: `${p.recoilControl > 0 ? "+" : ""}${p.recoilControl}%` });
    if (p.weaponHandling) specs.push({ label: "Handling", value: `${p.weaponHandling > 0 ? "+" : ""}${p.weaponHandling}%` });
    if (p.loudnessReduction) specs.push({ label: "Loudness", value: `${p.loudnessReduction} dB` });
    if (p.capacity) specs.push({ label: "Capacity", value: `${p.capacity}` });

    const summaryParts = [
      p.typeLabel || p.slotType.replace(/_/g, " "),
      p.caliber ? `Caliber: ${p.caliber}` : null,
      p.modes ? `Modes: ${p.modes}` : null,
      p.magnification ? `Zoom: ${p.magnification}` : null,
    ].filter(Boolean);

    const key = p.name.trim().toLowerCase();
    if (!map.has(key)) {
      map.set(key, {
        image: resolveTacticalImageUrl(p.image, p.name),
        buyPrice: p.buyPrice ? `$${p.buyPrice.toLocaleString()}` : null,
        sellPrice: null,
        weight: p.weightKg ? `${p.weightKg}kg` : null,
        gridSize: null,
        manufacturer: p.manufacturer || null,
        description: summaryParts.join(" · "),
        specs: specs.slice(0, 8),
      });
    }
  }

  cachedStaticEnrichment = map;
  return map;
}

export function extractEnrichmentFromRecords(
  records: NormalizedApiRecord[]
): Map<string, VendorItemEnrichment> {
  const map = new Map<string, VendorItemEnrichment>();

  for (const rec of records) {
    const raw = rec.raw || {};
    const specs: { label: string; value: string }[] = [];

    const addSpec = (label: string, val: unknown) => {
      if (val === null || val === undefined || val === "") return;
      const str = String(val).trim();
      if (str) specs.push({ label, value: str });
    };

    addSpec("Caliber", raw.caliber);
    addSpec("NIJ Class", raw.nij_class);
    addSpec("Protection", raw.armor_locations);
    addSpec("Slots", raw.slots);
    addSpec("Material", raw.material);
    addSpec("Capacity", raw.capacity);
    addSpec("Magnification", raw.magnification);
    addSpec("Sighting Range", raw.sighting_range);
    addSpec("Effect", raw.effect);
    addSpec("Charges", raw.charges);
    addSpec("Duration", raw.duration);
    addSpec("Use Time", raw.use_time);
    addSpec("Fire Rate", raw.fire_rate);
    addSpec("Fire Mode", raw.fire_mode);
    addSpec("Accuracy", raw.accuracy);
    addSpec("Ergonomics", raw.ergonomics);
    addSpec("Phosphor", raw.phosphor_color);
    addSpec("FOV", raw.field_of_view);
    addSpec("Penetration", raw.penetration);
    addSpec("Damage", raw.damage);

    const buyPrice =
      typeof raw.buy_price === "string" && raw.buy_price.trim()
        ? raw.buy_price.trim()
        : typeof raw.buy_price === "number"
          ? `$${raw.buy_price.toLocaleString()}`
          : null;

    const enrichment: VendorItemEnrichment = {
      image: resolveTacticalImageUrl(rec.image, rec.name),
      buyPrice,
      sellPrice: rec.sellPrice || null,
      weight: rec.weight || null,
      gridSize: rec.gridSize || null,
      manufacturer: rec.manufacturer || null,
      description:
        rec.description && rec.description.trim()
          ? rec.description.trim()
          : typeof raw.accepted_ammunition === "string" && raw.accepted_ammunition.trim()
            ? `Accepted ammo: ${raw.accepted_ammunition.trim()}`
            : null,
      specs: specs.slice(0, 8),
    };

    map.set(rec.name.trim().toLowerCase(), enrichment);
  }

  return map;
}
