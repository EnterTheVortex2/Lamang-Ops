// Auto-compiled GZW Update 0.5.0.0–0.5.1.1 + 0.5.2.0 Preview static Field Archive & Ballistics Library
// Sources: GZW Data API (https://gzw-data.dev/api/v1) & Gray Zone Warfare Fandom Wiki (0.5.1.1)
// Fully offline & GitHub Pages ready — zero external API calls required.

export interface ArchiveAmmoEntry {
  id: string;
  name: string;
  caliber: string;
  soldBy: string;
  buyPrice: string | null;
  sellPrice: string | null;
  muzzleVelocity: string | null;
  accuracyMod: string | null;
  durabilityMod: string | null;
  weight: string | null;
  penetrationTier: number;
  penetrationNote: string;
}

export interface ArchiveArmorEntry {
  id: string;
  name: string;
  category: string;
  nijClass: string;
  material: string;
  coverage: string;
  weight: string | null;
  gridSize: string | null;
  soldBy: string;
  buyPrice: string | null;
  sellPrice: string | null;
  slots: string | null;
}

export interface ArchiveMedicalEntry {
  id: string;
  name: string;
  category: string;
  effect: string;
  charges: number | string | null;
  useTime: string | null;
  duration: string | null;
  intoxication: string | null;
  weight: string | null;
  gridSize: string | null;
  soldBy: string;
  buyPrice: string | null;
  sellPrice: string | null;
}

export interface ArchiveNvgEntry {
  id: string;
  name: string;
  phosphor: string;
  fov: string;
  fom: string;
  weight: string | null;
  soldBy: string;
  buyPrice: string | null;
}

export interface ArchiveStorageEntry {
  id: string;
  name: string;
  category: "Backpack" | "Chest Rig" | "Stash Container";
  gridSize: string | null;
  capacity: number | string | null;
  soldBy: string;
  buyPrice: string | null;
  sellPrice: string | null;
}

export interface ArchiveFieldGuide {
  id: string;
  title: string;
  topic: "Ballistics & Armor" | "Medical & Trauma" | "COPs & Map Ops" | "Hideout & Hacking" | "Weapons & Gear";
  summary: string;
  bullets: string[];
  keywords: string[];
}

export interface ArchivePatchEntry {
  version: string;
  date: string;
  title: string;
  highlights: string[];
  sections: { heading: string; items: string[] }[];
}

export interface ArchiveBossEntry {
  id: string;
  name: string;
  fullName: string;
  faction: string;
  region: string;
  spawnLocations: string[];
  notableGear: string[];
  linkedTasks: string[];
}

export interface ArchiveOpticDeviceEntry {
  id: string;
  name: string;
  category: string;
  magnification: string | null;
  sightingRange: string | null;
  handlingMod: string | null;
  modes: string | null;
  manufacturer: string | null;
  weight: string | null;
  soldBy: string;
  buyPrice: string | null;
}

export interface ArchiveUtilityEntry {
  id: string;
  name: string;
  category: "Headset" | "Repair Kit" | "Mortar Round" | "Secure Lockbox" | string;
  statSummary: string;
  chargesOrRadius: string | null;
  soldBy: string;
  buyPrice: string | null;
  sellPrice: string | null;
  weight: string | null;
  gridSize: string | null;
}

export interface ArchiveProvisionEntry {
  id: string;
  name: string;
  category: "Food" | "Drink" | "Provision";
  energy: string | null;
  hydration: string | null;
  effect: string | null;
  charges: number | string | null;
  useTime: string | null;
  weight: string | null;
  gridSize: string | null;
  soldBy: string;
  buyPrice: string | null;
  sellPrice: string | null;
}

export interface ArchiveLootContainerEntry {
  id: string;
  name: string;
  layout: string;
}

export interface ArchiveLootItemEntry {
  id: string;
  name: string;
  category: string;
  gridSize: string | null;
  weight: string | null;
  sellPrice: string | null;
  pricePerCell: string | null;
}

export interface ArchiveSquadStrikeEntry {
  id: string;
  name: string;
  vendor: string;
  location: string;
}

export interface ArchiveSquadItemEntry {
  id: string;
  name: string;
  gridSize: string | null;
  weight: string | null;
}

export interface ArchiveXpActionEntry {
  id: string;
  category: string;
  action: string;
  xp: number;
}

export interface ArchiveXpLevelEntry {
  level: number;
  threshold: number;
  rewards: string[];
}

export interface ArchiveFactionEntry {
  id: string;
  name: string;
  description: string;
}

export interface ArchiveVendorProfile {
  id: string;
  name: string;
  fullName: string;
  sells: string;
  buys: string;
}

export interface ArchiveRegionEntry {
  id: string;
  name: string;
  tier: string;
  enemies: string;
  lzCallsign: string;
  description: string;
}

export interface ArchiveIntelIndexEntry {
  id: string;
  name: string;
  kind: "Intel" | "Newspaper" | "Evidence" | "Military Equipment";
}

export const ARCHIVE_AMMO: ArchiveAmmoEntry[] = [
  {
    "id": ".222-remington-fmj",
    "name": ".222 Remington FMJ",
    "caliber": ".222",
    "soldBy": "Artisan R.1",
    "buyPrice": null,
    "sellPrice": "$0.2",
    "muzzleVelocity": "970 m/s",
    "accuracyMod": "+0 %",
    "durabilityMod": null,
    "weight": "0.0111kg",
    "penetrationTier": 2,
    "penetrationNote": "Standard / Light Armor (NIJ II / IIIA)"
  },
  {
    "id": ".222-remington-hp",
    "name": ".222 Remington HP",
    "caliber": ".222",
    "soldBy": "Artisan R.2",
    "buyPrice": null,
    "sellPrice": "$0.4",
    "muzzleVelocity": "966 m/s",
    "accuracyMod": "+2 %",
    "durabilityMod": "-15 %",
    "weight": "0.0111kg",
    "penetrationTier": 1,
    "penetrationNote": "Soft-Target / Flesh Damage (Unarmored / NIJ I)"
  },
  {
    "id": ".222-remington-sp",
    "name": ".222 Remington SP",
    "caliber": ".222",
    "soldBy": "Artisan R.1",
    "buyPrice": null,
    "sellPrice": "$0.1",
    "muzzleVelocity": "970 m/s",
    "accuracyMod": "+5 %",
    "durabilityMod": null,
    "weight": "0.0111kg",
    "penetrationTier": 1,
    "penetrationNote": "Soft-Target / Flesh Damage (Unarmored / NIJ I)"
  },
  {
    "id": ".222-remington-vmax",
    "name": ".222 Remington VMax",
    "caliber": ".222",
    "soldBy": "Artisan R.2",
    "buyPrice": null,
    "sellPrice": "$0.5",
    "muzzleVelocity": "1020 m/s",
    "accuracyMod": "+7 %",
    "durabilityMod": "-15 %",
    "weight": "0.0111kg",
    "penetrationTier": 1,
    "penetrationNote": "Soft-Target / Flesh Damage (Unarmored / NIJ I)"
  },
  {
    "id": ".300-aac-blackout-ap",
    "name": ".300 AAC Blackout AP",
    "caliber": ".300",
    "soldBy": "Banshee R.4",
    "buyPrice": null,
    "sellPrice": "$2.4",
    "muzzleVelocity": "725 m/s",
    "accuracyMod": "+4 %",
    "durabilityMod": "-100 %",
    "weight": "0.015kg",
    "penetrationTier": 4,
    "penetrationNote": "Top Armor-Piercing (NIJ III+ / III++)"
  },
  {
    "id": ".300-aac-blackout-fmj",
    "name": ".300 AAC Blackout FMJ",
    "caliber": ".300",
    "soldBy": "Banshee R.1",
    "buyPrice": null,
    "sellPrice": "$0.4",
    "muzzleVelocity": "633 m/s",
    "accuracyMod": "+0 %",
    "durabilityMod": null,
    "weight": "0.017kg",
    "penetrationTier": 2,
    "penetrationNote": "Standard / Light Armor (NIJ II / IIIA)"
  },
  {
    "id": ".300-aac-blackout-cq",
    "name": ".300 AAC Blackout CQ",
    "caliber": ".300",
    "soldBy": "Banshee R.2",
    "buyPrice": null,
    "sellPrice": "$1.1",
    "muzzleVelocity": "853 m/s",
    "accuracyMod": "+1 %",
    "durabilityMod": "-15 %",
    "weight": "0.012kg",
    "penetrationTier": 1,
    "penetrationNote": "Soft-Target / Flesh Damage (Unarmored / NIJ I)"
  },
  {
    "id": ".300-aac-blackout-subsonic",
    "name": ".300 AAC Blackout Subsonic",
    "caliber": ".300",
    "soldBy": "Banshee R.1",
    "buyPrice": null,
    "sellPrice": "$0.3",
    "muzzleVelocity": "310 m/s",
    "accuracyMod": "+6 %",
    "durabilityMod": null,
    "weight": "0.02kg",
    "penetrationTier": 1,
    "penetrationNote": "Soft-Target / Flesh Damage (Unarmored / NIJ I)"
  },
  {
    "id": ".300-aac-blackout-v-max",
    "name": ".300 AAC Blackout V-MAX",
    "caliber": ".300",
    "soldBy": "Banshee R.2",
    "buyPrice": null,
    "sellPrice": "$0.8",
    "muzzleVelocity": "724 m/s",
    "accuracyMod": "+2 %",
    "durabilityMod": "-15 %",
    "weight": "0.015kg",
    "penetrationTier": 1,
    "penetrationNote": "Soft-Target / Flesh Damage (Unarmored / NIJ I)"
  },
  {
    "id": ".45-acp-ap",
    "name": ".45 ACP AP",
    "caliber": ".45",
    "soldBy": "Artisan R.3",
    "buyPrice": null,
    "sellPrice": "$1",
    "muzzleVelocity": "450 m/s",
    "accuracyMod": "+0 %",
    "durabilityMod": "-40 %",
    "weight": "0.021kg",
    "penetrationTier": 3,
    "penetrationNote": "Mid-High AP (NIJ III / IIIA+)"
  },
  {
    "id": ".45-acp-fmj",
    "name": ".45 ACP FMJ",
    "caliber": ".45",
    "soldBy": "Artisan R.1",
    "buyPrice": null,
    "sellPrice": "$0.2",
    "muzzleVelocity": "260 m/s",
    "accuracyMod": "+0 %",
    "durabilityMod": null,
    "weight": "0.021kg",
    "penetrationTier": 2,
    "penetrationNote": "Standard / Light Armor (NIJ II / IIIA)"
  },
  {
    "id": ".45-acp-hydra-shok",
    "name": ".45 ACP Hydra-Shok",
    "caliber": ".45",
    "soldBy": "Artisan R.2",
    "buyPrice": null,
    "sellPrice": "$0.5",
    "muzzleVelocity": "274 m/s",
    "accuracyMod": "+0 %",
    "durabilityMod": "-15 %",
    "weight": "0.021kg",
    "penetrationTier": 1,
    "penetrationNote": "Soft-Target / Flesh Damage (Unarmored / NIJ I)"
  },
  {
    "id": ".45-acp-jhp-+p",
    "name": ".45 ACP JHP +P",
    "caliber": ".45",
    "soldBy": "Artisan R.1",
    "buyPrice": null,
    "sellPrice": "$0.3",
    "muzzleVelocity": "290 m/s",
    "accuracyMod": "+2 %",
    "durabilityMod": null,
    "weight": "0.021kg",
    "penetrationTier": 1,
    "penetrationNote": "Soft-Target / Flesh Damage (Unarmored / NIJ I)"
  },
  {
    "id": "12ga-sst-sabot-slug",
    "name": "12ga SST Sabot Slug",
    "caliber": "12ga",
    "soldBy": "Gunny R.3",
    "buyPrice": null,
    "sellPrice": "$1.2",
    "muzzleVelocity": "609 m/s",
    "accuracyMod": "+50 %",
    "durabilityMod": "-40 %",
    "weight": "0.05kg",
    "penetrationTier": 4,
    "penetrationNote": "Top Armor-Piercing (NIJ III+ / III++)"
  },
  {
    "id": "12ga-00-buckshot",
    "name": "12ga 00 Buckshot",
    "caliber": "12ga",
    "soldBy": "Gunny R.1",
    "buyPrice": null,
    "sellPrice": "$0.3",
    "muzzleVelocity": "370 m/s",
    "accuracyMod": "+37.8 %",
    "durabilityMod": null,
    "weight": "0.05kg",
    "penetrationTier": 2,
    "penetrationNote": "Standard / Light Armor (NIJ II / IIIA)"
  },
  {
    "id": "12ga-fc-00-buckshot",
    "name": "12ga FC 00 Buckshot",
    "caliber": "12ga",
    "soldBy": "Gunny R.2",
    "buyPrice": null,
    "sellPrice": "$0.6",
    "muzzleVelocity": "349 m/s",
    "accuracyMod": "+27 %",
    "durabilityMod": "-15 %",
    "weight": "0.05kg",
    "penetrationTier": 2,
    "penetrationNote": "Standard / Light Armor (NIJ II / IIIA)"
  },
  {
    "id": "12ga-slug",
    "name": "12ga Slug",
    "caliber": "12ga",
    "soldBy": "Gunny R.2",
    "buyPrice": null,
    "sellPrice": "$0.5",
    "muzzleVelocity": "420 m/s",
    "accuracyMod": "+42 %",
    "durabilityMod": "-15 %",
    "weight": "0.05kg",
    "penetrationTier": 2,
    "penetrationNote": "Standard / Light Armor (NIJ II / IIIA)"
  },
  {
    "id": "4.6x30mm-ap-sx",
    "name": "4.6x30mm AP SX",
    "caliber": "4.6x30mm",
    "soldBy": "Banshee R.3",
    "buyPrice": null,
    "sellPrice": "$1",
    "muzzleVelocity": "680 m/s",
    "accuracyMod": "+0 %",
    "durabilityMod": "-40 %",
    "weight": "0.007kg",
    "penetrationTier": 4,
    "penetrationNote": "Top Armor-Piercing (NIJ III+ / III++)"
  },
  {
    "id": "4.6x30mm-fmj-sx",
    "name": "4.6x30mm FMJ SX",
    "caliber": "4.6x30mm",
    "soldBy": "Banshee R.1",
    "buyPrice": null,
    "sellPrice": "$0.3",
    "muzzleVelocity": "620 m/s",
    "accuracyMod": "+0 %",
    "durabilityMod": null,
    "weight": "0.007kg",
    "penetrationTier": 2,
    "penetrationNote": "Standard / Light Armor (NIJ II / IIIA)"
  },
  {
    "id": "4.6x30mm-action-sx",
    "name": "4.6x30mm Action SX",
    "caliber": "4.6x30mm",
    "soldBy": "Banshee R.1",
    "buyPrice": null,
    "sellPrice": "$0.3",
    "muzzleVelocity": "690 m/s",
    "accuracyMod": "+0 %",
    "durabilityMod": null,
    "weight": "0.007kg",
    "penetrationTier": 1,
    "penetrationNote": "Soft-Target / Flesh Damage (Unarmored / NIJ I)"
  },
  {
    "id": "4.6x30mm-subsonic-sx",
    "name": "4.6x30mm Subsonic SX",
    "caliber": "4.6x30mm",
    "soldBy": "Banshee R.1",
    "buyPrice": null,
    "sellPrice": "$0.2",
    "muzzleVelocity": "290 m/s",
    "accuracyMod": "+0 %",
    "durabilityMod": null,
    "weight": "0.01kg",
    "penetrationTier": 1,
    "penetrationNote": "Soft-Target / Flesh Damage (Unarmored / NIJ I)"
  },
  {
    "id": "4.6x30mm-v-max",
    "name": "4.6x30mm V-max",
    "caliber": "4.6x30mm",
    "soldBy": "Banshee R.2",
    "buyPrice": null,
    "sellPrice": "$0.5",
    "muzzleVelocity": "640 m/s",
    "accuracyMod": null,
    "durabilityMod": "-15 %",
    "weight": "0.007kg",
    "penetrationTier": 1,
    "penetrationNote": "Soft-Target / Flesh Damage (Unarmored / NIJ I)"
  },
  {
    "id": "5.45x39mm-bs-7n24",
    "name": "5.45x39mm BS (7N24)",
    "caliber": "5.45x39mm",
    "soldBy": "Turncoat R.4",
    "buyPrice": null,
    "sellPrice": "$2.1",
    "muzzleVelocity": "840 m/s",
    "accuracyMod": "+6 %",
    "durabilityMod": "-100 %",
    "weight": "0.011kg",
    "penetrationTier": 4,
    "penetrationNote": "Top Armor-Piercing (NIJ III+ / III++)"
  },
  {
    "id": "5.45x39mm-bt-7bt4",
    "name": "5.45x39mm BT (7BT4)",
    "caliber": "5.45x39mm",
    "soldBy": "Turncoat R.3",
    "buyPrice": null,
    "sellPrice": "$1.1",
    "muzzleVelocity": "915 m/s",
    "accuracyMod": "+2 %",
    "durabilityMod": "-40 %",
    "weight": "0.0105kg",
    "penetrationTier": 4,
    "penetrationNote": "Top Armor-Piercing (NIJ III+ / III++)"
  },
  {
    "id": "5.45x39mm-pp-7n10",
    "name": "5.45x39mm PP (7N10)",
    "caliber": "5.45x39mm",
    "soldBy": "Turncoat R.3",
    "buyPrice": null,
    "sellPrice": "$1.1",
    "muzzleVelocity": "870 m/s",
    "accuracyMod": "+2 %",
    "durabilityMod": "-40 %",
    "weight": "0.0105kg",
    "penetrationTier": 4,
    "penetrationNote": "Top Armor-Piercing (NIJ III+ / III++)"
  },
  {
    "id": "5.45x39mm-bp-7n22",
    "name": "5.45x39mm BP (7N22)",
    "caliber": "5.45x39mm",
    "soldBy": "Turncoat R.4",
    "buyPrice": null,
    "sellPrice": "$2.1",
    "muzzleVelocity": "860 m/s",
    "accuracyMod": "+1 %",
    "durabilityMod": "-100 %",
    "weight": "0.0105kg",
    "penetrationTier": 3,
    "penetrationNote": "Mid-High AP (NIJ III / IIIA+)"
  },
  {
    "id": "5.45x39mm-fmj",
    "name": "5.45x39mm FMJ",
    "caliber": "5.45x39mm",
    "soldBy": "Turncoat R.2",
    "buyPrice": null,
    "sellPrice": "$0.3",
    "muzzleVelocity": "855 m/s",
    "accuracyMod": "+0 %",
    "durabilityMod": "-15 %",
    "weight": "0.0105kg",
    "penetrationTier": 2,
    "penetrationNote": "Standard / Light Armor (NIJ II / IIIA)"
  },
  {
    "id": "5.45x39mm-ps-7n6",
    "name": "5.45x39mm PS (7N6)",
    "caliber": "5.45x39mm",
    "soldBy": "Turncoat R.2",
    "buyPrice": null,
    "sellPrice": "$0.7",
    "muzzleVelocity": "900 m/s",
    "accuracyMod": "+2 %",
    "durabilityMod": "-15 %",
    "weight": "0.0105kg",
    "penetrationTier": 2,
    "penetrationNote": "Standard / Light Armor (NIJ II / IIIA)"
  },
  {
    "id": "5.45x39mm-hp",
    "name": "5.45x39mm HP",
    "caliber": "5.45x39mm",
    "soldBy": "Turncoat R.2",
    "buyPrice": null,
    "sellPrice": "$0.4",
    "muzzleVelocity": "880 m/s",
    "accuracyMod": "+6 %",
    "durabilityMod": "-15 %",
    "weight": "0.0105kg",
    "penetrationTier": 1,
    "penetrationNote": "Soft-Target / Flesh Damage (Unarmored / NIJ I)"
  },
  {
    "id": "5.45x39mm-us-7u1",
    "name": "5.45x39mm US (7U1)",
    "caliber": "5.45x39mm",
    "soldBy": "Turncoat R.1",
    "buyPrice": null,
    "sellPrice": "$0.2",
    "muzzleVelocity": "303 m/s",
    "accuracyMod": "+6 %",
    "durabilityMod": null,
    "weight": "0.0125kg",
    "penetrationTier": 1,
    "penetrationNote": "Soft-Target / Flesh Damage (Unarmored / NIJ I)"
  },
  {
    "id": "5.45x39mm-wolf",
    "name": "5.45x39mm Wolf",
    "caliber": "5.45x39mm",
    "soldBy": "Turncoat R.1",
    "buyPrice": null,
    "sellPrice": "$0.2",
    "muzzleVelocity": "840 m/s",
    "accuracyMod": "+2 %",
    "durabilityMod": null,
    "weight": "0.0108kg",
    "penetrationTier": 1,
    "penetrationNote": "Soft-Target / Flesh Damage (Unarmored / NIJ I)"
  },
  {
    "id": "5.56x45mm-ap-m855a1",
    "name": "5.56x45mm AP (M855A1)",
    "caliber": "5.56x45mm",
    "soldBy": "Gunny R.3",
    "buyPrice": null,
    "sellPrice": "$1.2",
    "muzzleVelocity": "970 m/s",
    "accuracyMod": "+7 %",
    "durabilityMod": "-40 %",
    "weight": "0.0116kg",
    "penetrationTier": 4,
    "penetrationNote": "Top Armor-Piercing (NIJ III+ / III++)"
  },
  {
    "id": "5.56x45mm-ap-m995",
    "name": "5.56x45mm AP (M995)",
    "caliber": "5.56x45mm",
    "soldBy": "Gunny R.4",
    "buyPrice": null,
    "sellPrice": "$2.2",
    "muzzleVelocity": "1030 m/s",
    "accuracyMod": "+5 %",
    "durabilityMod": "-100 %",
    "weight": "0.0123kg",
    "penetrationTier": 4,
    "penetrationNote": "Top Armor-Piercing (NIJ III+ / III++)"
  },
  {
    "id": "5.56x45mm-ap-m855",
    "name": "5.56x45mm AP (M855)",
    "caliber": "5.56x45mm",
    "soldBy": "Gunny R.2",
    "buyPrice": null,
    "sellPrice": "$0.8",
    "muzzleVelocity": "920 m/s",
    "accuracyMod": "+2 %",
    "durabilityMod": "-15 %",
    "weight": "0.0123kg",
    "penetrationTier": 3,
    "penetrationNote": "Mid-High AP (NIJ III / IIIA+)"
  },
  {
    "id": "5.56x45mm-fmj",
    "name": "5.56x45mm FMJ",
    "caliber": "5.56x45mm",
    "soldBy": "Gunny R.1",
    "buyPrice": null,
    "sellPrice": "$0.3",
    "muzzleVelocity": "880 m/s",
    "accuracyMod": "+0 %",
    "durabilityMod": null,
    "weight": "0.013kg",
    "penetrationTier": 2,
    "penetrationNote": "Standard / Light Armor (NIJ II / IIIA)"
  },
  {
    "id": "5.56x45mm-m193",
    "name": "5.56x45mm FMJ (M193)",
    "caliber": "5.56x45mm",
    "soldBy": "Gunny R.2",
    "buyPrice": null,
    "sellPrice": "$0.4",
    "muzzleVelocity": "1006 m/s",
    "accuracyMod": "-2 %",
    "durabilityMod": "+15 %",
    "weight": "0.012kg",
    "penetrationTier": 2,
    "penetrationNote": "Standard / Light Armor (NIJ II / IIIA)"
  },
  {
    "id": "5.56x45mm-tracer-m856",
    "name": "5.56x45mm Tracer (M856)",
    "caliber": "5.56x45mm",
    "soldBy": "Gunny R.2",
    "buyPrice": null,
    "sellPrice": "$0.8",
    "muzzleVelocity": "917 m/s",
    "accuracyMod": "+3 %",
    "durabilityMod": "-15 %",
    "weight": "0.0135kg",
    "penetrationTier": 2,
    "penetrationNote": "Standard / Light Armor (NIJ II / IIIA)"
  },
  {
    "id": "5.56x45mm-tracer-m856a1",
    "name": "5.56x45mm Tracer (M856A1)",
    "caliber": "5.56x45mm",
    "soldBy": "Gunny R.3",
    "buyPrice": null,
    "sellPrice": "$1.2",
    "muzzleVelocity": "945 m/s",
    "accuracyMod": "+4 %",
    "durabilityMod": "-40 %",
    "weight": "0.0125kg",
    "penetrationTier": 2,
    "penetrationNote": "Standard / Light Armor (NIJ II / IIIA)"
  },
  {
    "id": "5.56x45mm-hpbt",
    "name": "5.56x45mm HPBT",
    "caliber": "5.56x45mm",
    "soldBy": "Gunny R.2",
    "buyPrice": null,
    "sellPrice": "$0.4",
    "muzzleVelocity": "861 m/s",
    "accuracyMod": "+3 %",
    "durabilityMod": "-15 %",
    "weight": "0.013kg",
    "penetrationTier": 1,
    "penetrationNote": "Soft-Target / Flesh Damage (Unarmored / NIJ I)"
  },
  {
    "id": "5.56x45mm-sp",
    "name": "5.56x45mm SP",
    "caliber": "5.56x45mm",
    "soldBy": "Gunny R.1",
    "buyPrice": null,
    "sellPrice": "$0.2",
    "muzzleVelocity": "930 m/s",
    "accuracyMod": "+3 %",
    "durabilityMod": null,
    "weight": "0.01kg",
    "penetrationTier": 1,
    "penetrationNote": "Soft-Target / Flesh Damage (Unarmored / NIJ I)"
  },
  {
    "id": "7.62x25mm-fmj",
    "name": "7.62x25mm FMJ",
    "caliber": "7.62x25mm",
    "soldBy": "Artisan R.1",
    "buyPrice": null,
    "sellPrice": "$0.1",
    "muzzleVelocity": "430 m/s",
    "accuracyMod": "+0 %",
    "durabilityMod": null,
    "weight": "0.011kg",
    "penetrationTier": 2,
    "penetrationNote": "Standard / Light Armor (NIJ II / IIIA)"
  },
  {
    "id": "7.62x25mm-pst",
    "name": "7.62x25mm Pst",
    "caliber": "7.62x25mm",
    "soldBy": "Artisan R.2",
    "buyPrice": null,
    "sellPrice": "$0.3",
    "muzzleVelocity": "430 m/s",
    "accuracyMod": "+2 %",
    "durabilityMod": "-15 %",
    "weight": "0.011kg",
    "penetrationTier": 2,
    "penetrationNote": "Standard / Light Armor (NIJ II / IIIA)"
  },
  {
    "id": "7.62x25mm-pt",
    "name": "7.62x25mm PT",
    "caliber": "7.62x25mm",
    "soldBy": "Artisan R.1",
    "buyPrice": null,
    "sellPrice": "$0.1",
    "muzzleVelocity": "415 m/s",
    "accuracyMod": "+2 %",
    "durabilityMod": null,
    "weight": "0.011kg",
    "penetrationTier": 1,
    "penetrationNote": "Soft-Target / Flesh Damage (Unarmored / NIJ I)"
  },
  {
    "id": "7.62x39mm-bp-7n23",
    "name": "7.62x39mm BP (7N23)",
    "caliber": "7.62x39mm",
    "soldBy": "Turncoat R.4",
    "buyPrice": null,
    "sellPrice": "$2.3",
    "muzzleVelocity": "740 m/s",
    "accuracyMod": "+2 %",
    "durabilityMod": "-100 %",
    "weight": "0.0163kg",
    "penetrationTier": 4,
    "penetrationNote": "Top Armor-Piercing (NIJ III+ / III++)"
  },
  {
    "id": "7.62x39mm-pp-7n27",
    "name": "7.62x39mm PP (7N27)",
    "caliber": "7.62x39mm",
    "soldBy": "Turncoat R.3",
    "buyPrice": null,
    "sellPrice": "$1.3",
    "muzzleVelocity": "740 m/s",
    "accuracyMod": "+1 %",
    "durabilityMod": "-40 %",
    "weight": "0.0165kg",
    "penetrationTier": 3,
    "penetrationNote": "Mid-High AP (NIJ III / IIIA+)"
  },
  {
    "id": "7.62x39mm-fmj",
    "name": "7.62x39mm FMJ",
    "caliber": "7.62x39mm",
    "soldBy": "Turncoat R.1",
    "buyPrice": null,
    "sellPrice": "$0.4",
    "muzzleVelocity": "738 m/s",
    "accuracyMod": "+6 %",
    "durabilityMod": null,
    "weight": "0.0163kg",
    "penetrationTier": 2,
    "penetrationNote": "Standard / Light Armor (NIJ II / IIIA)"
  },
  {
    "id": "7.62x39mm-ps-57-n-231c",
    "name": "7.62x39mm PS (57-N-231C)",
    "caliber": "7.62x39mm",
    "soldBy": "Turncoat R.2",
    "buyPrice": null,
    "sellPrice": "$0.9",
    "muzzleVelocity": "725 m/s",
    "accuracyMod": "+1 %",
    "durabilityMod": "-15 %",
    "weight": "0.0163kg",
    "penetrationTier": 2,
    "penetrationNote": "Standard / Light Armor (NIJ II / IIIA)"
  },
  {
    "id": "7.62x39mm-tracer-57-n-231p",
    "name": "7.62x39mm Tracer (57-N-231P)",
    "caliber": "7.62x39mm",
    "soldBy": "Turncoat R.1",
    "buyPrice": null,
    "sellPrice": "$0.4",
    "muzzleVelocity": "725 m/s",
    "accuracyMod": "+3 %",
    "durabilityMod": null,
    "weight": "0.0163kg",
    "penetrationTier": 2,
    "penetrationNote": "Standard / Light Armor (NIJ II / IIIA)"
  },
  {
    "id": "7.62x39mm-sp",
    "name": "7.62x39mm SP",
    "caliber": "7.62x39mm",
    "soldBy": "Artisan R.1",
    "buyPrice": null,
    "sellPrice": "$0.2",
    "muzzleVelocity": "743 m/s",
    "accuracyMod": "+2 %",
    "durabilityMod": null,
    "weight": "0.0175kg",
    "penetrationTier": 1,
    "penetrationNote": "Soft-Target / Flesh Damage (Unarmored / NIJ I)"
  },
  {
    "id": "7.62x39mm-us",
    "name": "7.62x39mm US",
    "caliber": "7.62x39mm",
    "soldBy": "Artisan R.1",
    "buyPrice": null,
    "sellPrice": "$0.2",
    "muzzleVelocity": "310 m/s",
    "accuracyMod": "+6 %",
    "durabilityMod": null,
    "weight": "0.0163kg",
    "penetrationTier": 1,
    "penetrationNote": "Soft-Target / Flesh Damage (Unarmored / NIJ I)"
  },
  {
    "id": "7.62x51mm-ap-m61",
    "name": "7.62x51mm AP (M61)",
    "caliber": "7.62x51mm",
    "soldBy": "Gunny R.4",
    "buyPrice": null,
    "sellPrice": "$2.8",
    "muzzleVelocity": "838 m/s",
    "accuracyMod": "+4 %",
    "durabilityMod": "-100 %",
    "weight": "0.0245kg",
    "penetrationTier": 4,
    "penetrationNote": "Top Armor-Piercing (NIJ III+ / III++)"
  },
  {
    "id": "7.62x51mm-fmj-m80",
    "name": "7.62x51mm FMJ (M80)",
    "caliber": "7.62x51mm",
    "soldBy": "Gunny R.1",
    "buyPrice": null,
    "sellPrice": "$0.5",
    "muzzleVelocity": "817 m/s",
    "accuracyMod": "+0 %",
    "durabilityMod": null,
    "weight": "0.024kg",
    "penetrationTier": 4,
    "penetrationNote": "Top Armor-Piercing (NIJ III+ / III++)"
  },
  {
    "id": "7.62x51mm-fmj-m80a1",
    "name": "7.62x51mm FMJ (M80A1)",
    "caliber": "7.62x51mm",
    "soldBy": "Gunny R.3",
    "buyPrice": null,
    "sellPrice": "$1.5",
    "muzzleVelocity": "835 m/s",
    "accuracyMod": "+3 %",
    "durabilityMod": "-40 %",
    "weight": "0.024kg",
    "penetrationTier": 4,
    "penetrationNote": "Top Armor-Piercing (NIJ III+ / III++)"
  },
  {
    "id": "7.62x51mm-tracer-m62",
    "name": "7.62x51mm Tracer (M62)",
    "caliber": "7.62x51mm",
    "soldBy": "Gunny R.1",
    "buyPrice": null,
    "sellPrice": "$0.5",
    "muzzleVelocity": "820 m/s",
    "accuracyMod": "+4 %",
    "durabilityMod": null,
    "weight": "0.024kg",
    "penetrationTier": 2,
    "penetrationNote": "Standard / Light Armor (NIJ II / IIIA)"
  },
  {
    "id": "7.62x51mm-hpbt",
    "name": "7.62x51mm HPBT",
    "caliber": "7.62x51mm",
    "soldBy": "Gunny R.3",
    "buyPrice": null,
    "sellPrice": "$1.2",
    "muzzleVelocity": "800 m/s",
    "accuracyMod": "+4 %",
    "durabilityMod": "-40 %",
    "weight": "0.0275kg",
    "penetrationTier": 1,
    "penetrationNote": "Soft-Target / Flesh Damage (Unarmored / NIJ I)"
  },
  {
    "id": "7.62x54r-ap-7n13",
    "name": "7.62x54R AP (7N13)",
    "caliber": "7.62x54R",
    "soldBy": "Artisan R.4",
    "buyPrice": null,
    "sellPrice": "$2.7",
    "muzzleVelocity": "828 m/s",
    "accuracyMod": "+2 %",
    "durabilityMod": "-100 %",
    "weight": "0.022kg",
    "penetrationTier": 4,
    "penetrationNote": "Top Armor-Piercing (NIJ III+ / III++)"
  },
  {
    "id": "7.62x54r-lps-57-n-323s",
    "name": "7.62x54R LPS (57-N-323S)",
    "caliber": "7.62x54R",
    "soldBy": "Artisan R.2",
    "buyPrice": null,
    "sellPrice": "$1.1",
    "muzzleVelocity": "828 m/s",
    "accuracyMod": "+1 %",
    "durabilityMod": "-15 %",
    "weight": "0.021kg",
    "penetrationTier": 4,
    "penetrationNote": "Top Armor-Piercing (NIJ III+ / III++)"
  },
  {
    "id": "7.62x54r-sniper-round-7n1",
    "name": "7.62x54R Sniper Round (7N1)",
    "caliber": "7.62x54R",
    "soldBy": "Artisan R.4",
    "buyPrice": null,
    "sellPrice": "$2.5",
    "muzzleVelocity": "830 m/s",
    "accuracyMod": "+5 %",
    "durabilityMod": "-100 %",
    "weight": "0.021kg",
    "penetrationTier": 4,
    "penetrationNote": "Top Armor-Piercing (NIJ III+ / III++)"
  },
  {
    "id": "7.62x54r-tracer-t-46m",
    "name": "7.62x54R Tracer (T-46M)",
    "caliber": "7.62x54R",
    "soldBy": "Artisan R.3",
    "buyPrice": null,
    "sellPrice": "$1.4",
    "muzzleVelocity": "830 m/s",
    "accuracyMod": "+3 %",
    "durabilityMod": "-40 %",
    "weight": "0.022kg",
    "penetrationTier": 2,
    "penetrationNote": "Standard / Light Armor (NIJ II / IIIA)"
  },
  {
    "id": "7.65-browning-fmj",
    "name": "7.65 Browning FMJ",
    "caliber": "7.65",
    "soldBy": "Artisan R.1",
    "buyPrice": null,
    "sellPrice": "$0.1",
    "muzzleVelocity": "318 m/s",
    "accuracyMod": "+0 %",
    "durabilityMod": null,
    "weight": "0.008kg",
    "penetrationTier": 2,
    "penetrationNote": "Standard / Light Armor (NIJ II / IIIA)"
  },
  {
    "id": "7.65-browning-jhp",
    "name": "7.65 Browning JHP",
    "caliber": "7.65",
    "soldBy": "Artisan R.1",
    "buyPrice": null,
    "sellPrice": "$0.2",
    "muzzleVelocity": "276 m/s",
    "accuracyMod": "+4 %",
    "durabilityMod": null,
    "weight": "0.008kg",
    "penetrationTier": 1,
    "penetrationNote": "Soft-Target / Flesh Damage (Unarmored / NIJ I)"
  },
  {
    "id": "7.65-browning-xtreme-defender",
    "name": "7.65 Browning Xtreme Defender",
    "caliber": "7.65",
    "soldBy": "Artisan R.2",
    "buyPrice": null,
    "sellPrice": "$0.4",
    "muzzleVelocity": "290 m/s",
    "accuracyMod": "+2 %",
    "durabilityMod": "-15 %",
    "weight": "0.007kg",
    "penetrationTier": 1,
    "penetrationNote": "Soft-Target / Flesh Damage (Unarmored / NIJ I)"
  },
  {
    "id": "9x19mm-fmj",
    "name": "9x19mm FMJ",
    "caliber": "9x19mm",
    "soldBy": "Gunny R.1",
    "buyPrice": null,
    "sellPrice": "$0.1",
    "muzzleVelocity": "390 m/s",
    "accuracyMod": "+0 %",
    "durabilityMod": null,
    "weight": "0.012kg",
    "penetrationTier": 2,
    "penetrationNote": "Standard / Light Armor (NIJ II / IIIA)"
  },
  {
    "id": "9x19mm-tracer",
    "name": "9x19mm Tracer",
    "caliber": "9x19mm",
    "soldBy": "Gunny R.1",
    "buyPrice": null,
    "sellPrice": "$0.1",
    "muzzleVelocity": "342 m/s",
    "accuracyMod": "+4 %",
    "durabilityMod": null,
    "weight": "0.013kg",
    "penetrationTier": 2,
    "penetrationNote": "Standard / Light Armor (NIJ II / IIIA)"
  },
  {
    "id": "9x19mm-hp",
    "name": "9x19mm HP",
    "caliber": "9x19mm",
    "soldBy": "Gunny R.1",
    "buyPrice": null,
    "sellPrice": "$0.2",
    "muzzleVelocity": "377 m/s",
    "accuracyMod": "+3 %",
    "durabilityMod": null,
    "weight": "0.012kg",
    "penetrationTier": 1,
    "penetrationNote": "Soft-Target / Flesh Damage (Unarmored / NIJ I)"
  },
  {
    "id": "9x19mm-libra-snail",
    "name": "9x19mm Libra Snail",
    "caliber": "9x19mm",
    "soldBy": "Gunny R.3",
    "buyPrice": null,
    "sellPrice": "$1",
    "muzzleVelocity": "700 m/s",
    "accuracyMod": "+0 %",
    "durabilityMod": "-40 %",
    "weight": "0.007kg",
    "penetrationTier": 1,
    "penetrationNote": "Soft-Target / Flesh Damage (Unarmored / NIJ I)"
  },
  {
    "id": "9x19mm-xtreme-penetrator-p+",
    "name": "9x19mm Xtreme Penetrator +P",
    "caliber": "9x19mm",
    "soldBy": "Gunny R.2",
    "buyPrice": null,
    "sellPrice": "$0.4",
    "muzzleVelocity": "381 m/s",
    "accuracyMod": "+2 %",
    "durabilityMod": "-15 %",
    "weight": "0.012kg",
    "penetrationTier": 1,
    "penetrationNote": "Soft-Target / Flesh Damage (Unarmored / NIJ I)"
  }
];

export const ARCHIVE_ARMOR: ArchiveArmorEntry[] = [
  {
    "id": "b-krogan",
    "name": "B Krogan",
    "category": "Armor vest",
    "nijClass": "NIJ III+",
    "material": "Composite",
    "coverage": "Torso",
    "weight": null,
    "gridSize": "3x3",
    "soldBy": "Loot / Boss / Tasks",
    "buyPrice": null,
    "sellPrice": null,
    "slots": null
  },
  {
    "id": "6b23-1digital",
    "name": "6B23-1 (Digital)",
    "category": "Armor Vest",
    "nijClass": "NIJ III+",
    "material": "Steel",
    "coverage": "Front",
    "weight": "7.4kg",
    "gridSize": "3x4",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$690",
    "slots": null
  },
  {
    "id": "6b23-1flora",
    "name": "6B23-1 (Flora)",
    "category": "Armor Vest",
    "nijClass": "NIJ III+",
    "material": "Steel",
    "coverage": "Front",
    "weight": "7.4kg",
    "gridSize": "3x4",
    "soldBy": "Turncoat R.3",
    "buyPrice": "$2,300",
    "sellPrice": "$690",
    "slots": null
  },
  {
    "id": "atbv-vest",
    "name": "ATBV Vest",
    "category": "Armor Vest",
    "nijClass": "NIJ III",
    "material": "UHMWPE",
    "coverage": "Front, Back",
    "weight": "3.8kg",
    "gridSize": "3x3",
    "soldBy": "Turncoat R.2",
    "buyPrice": "$1,700",
    "sellPrice": "$510",
    "slots": null
  },
  {
    "id": "atbv-vest-olive",
    "name": "ATBV Vest (Olive)",
    "category": "Armor Vest",
    "nijClass": "NIJ III+",
    "material": "Ceramic",
    "coverage": "Front, Back",
    "weight": "6.6kg",
    "gridSize": "3x3",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$720",
    "slots": null
  },
  {
    "id": "brokers-cz-vip",
    "name": "Broker's CZ VIP",
    "category": "Armor Vest",
    "nijClass": "NIJ III",
    "material": "UHMWPE",
    "coverage": "Front",
    "weight": "2.4kg",
    "gridSize": "3x3",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$420",
    "slots": null
  },
  {
    "id": "colonels-6b23-1",
    "name": "Colonel's 6B23-1",
    "category": "Armor Vest",
    "nijClass": "NIJ III++",
    "material": "Ceramic",
    "coverage": "Front",
    "weight": "5.5kg",
    "gridSize": "3x4",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$1,080",
    "slots": null
  },
  {
    "id": "commander-black",
    "name": "Commander (Black)",
    "category": "Armor Vest",
    "nijClass": "NIJ IIIA",
    "material": "Aramid",
    "coverage": "Front, Back",
    "weight": "2.45kg",
    "gridSize": "3x3",
    "soldBy": "Handshake R.1",
    "buyPrice": "$400",
    "sellPrice": "$120",
    "slots": null
  },
  {
    "id": "commander-navy",
    "name": "Commander (Navy)",
    "category": "Armor Vest",
    "nijClass": "NIJ IIIA",
    "material": "Aramid",
    "coverage": "Front, Back",
    "weight": "2.45kg",
    "gridSize": "3x3",
    "soldBy": "Handshake R.1",
    "buyPrice": "$400",
    "sellPrice": "$120",
    "slots": null
  },
  {
    "id": "commander-olive",
    "name": "Commander (Olive)",
    "category": "Armor Vest",
    "nijClass": "NIJ IIIA",
    "material": "Aramid",
    "coverage": "Front, Back",
    "weight": "2.45kg",
    "gridSize": "3x3",
    "soldBy": "Handshake R.1",
    "buyPrice": "$400",
    "sellPrice": "$120",
    "slots": null
  },
  {
    "id": "coolmax-covert-vest",
    "name": "Coolmax Covert Vest",
    "category": "Armor Vest",
    "nijClass": "NIJ IIIA",
    "material": "Aramid",
    "coverage": "Front, Back",
    "weight": "3.1kg",
    "gridSize": "3x3",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$165",
    "slots": null
  },
  {
    "id": "covert-tactical-body-armour-black",
    "name": "Covert Tactical Body Armour (Black)",
    "category": "Armor Vest",
    "nijClass": "NIJ IIIA+",
    "material": "UHMWPE",
    "coverage": "Front, Back",
    "weight": "2.35kg",
    "gridSize": "3x3",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$255",
    "slots": null
  },
  {
    "id": "covert-tactical-body-armour-police",
    "name": "Covert Tactical Body Armour (Police)",
    "category": "Armor Vest",
    "nijClass": "NIJ III+",
    "material": "UHMWPE",
    "coverage": "Front, Back",
    "weight": "4.25kg",
    "gridSize": "3x3",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$840",
    "slots": null
  },
  {
    "id": "covert-tactical-body-armour-press",
    "name": "Covert Tactical Body Armour (Press)",
    "category": "Armor Vest",
    "nijClass": "NIJ III",
    "material": "Steel",
    "coverage": "Front, Back",
    "weight": "8.8kg",
    "gridSize": "3x3",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$450",
    "slots": null
  },
  {
    "id": "covert-tactical-body-armour-unlra",
    "name": "Covert Tactical Body Armour (UNLRA)",
    "category": "Armor Vest",
    "nijClass": "NIJ IIIA",
    "material": "Aramid",
    "coverage": "Front, Back",
    "weight": "2.1kg",
    "gridSize": "3x3",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$120",
    "slots": null
  },
  {
    "id": "covert-tactical-body-armour-woodland",
    "name": "Covert Tactical Body Armour (Woodland)",
    "category": "Armor Vest",
    "nijClass": "NIJ III",
    "material": "Steel",
    "coverage": "Front, Back",
    "weight": "8.8kg",
    "gridSize": "3x3",
    "soldBy": "Handshake R.2",
    "buyPrice": "$1,500",
    "sellPrice": "$450",
    "slots": null
  },
  {
    "id": "cz-4m-hornet",
    "name": "CZ 4M HORNET",
    "category": "Armor Vest",
    "nijClass": "NIJ III",
    "material": "UHMWPE",
    "coverage": "Front, Back",
    "weight": "4.4kg",
    "gridSize": "3x3",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$480",
    "slots": null
  },
  {
    "id": "cz-4m-hornet-unlra",
    "name": "CZ 4M HORNET (UNLRA)",
    "category": "Armor Vest",
    "nijClass": "NIJ III",
    "material": "UHMWPE",
    "coverage": "Front, Back",
    "weight": "4.4kg",
    "gridSize": "3x3",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$480",
    "slots": null
  },
  {
    "id": "cz-4m-hornet-green",
    "name": "CZ 4M HORNET Green",
    "category": "Armor Vest",
    "nijClass": "NIJ III+",
    "material": "Ceramic",
    "coverage": "Front, Back",
    "weight": "6.9kg",
    "gridSize": "3x3",
    "soldBy": "Handshake R.3",
    "buyPrice": "$2,400",
    "sellPrice": "$720",
    "slots": null
  },
  {
    "id": "cz-vip-black",
    "name": "CZ VIP (Black)",
    "category": "Armor Vest",
    "nijClass": "NIJ III",
    "material": "Steel",
    "coverage": "Front",
    "weight": "4.8kg",
    "gridSize": "3x3",
    "soldBy": "Handshake R.2",
    "buyPrice": "$1,100",
    "sellPrice": "$330",
    "slots": null
  },
  {
    "id": "firebrands-6b23-1",
    "name": "Firebrand's 6B23-1",
    "category": "Armor Vest",
    "nijClass": "NIJ III",
    "material": "Steel",
    "coverage": "Front",
    "weight": "7kg",
    "gridSize": "3x4",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$420",
    "slots": null
  },
  {
    "id": "grins-commander",
    "name": "Grin's Commander",
    "category": "Armor Vest",
    "nijClass": "NIJ IIIA",
    "material": "Aramid",
    "coverage": "Front, Back",
    "weight": "2.45kg",
    "gridSize": "3x3",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$120",
    "slots": null
  },
  {
    "id": "kapteis-krogan",
    "name": "Kaptei's Krogan",
    "category": "Armor Vest",
    "nijClass": "NIJ III+",
    "material": "Ceramic",
    "coverage": "Front, Back",
    "weight": "6.4kg",
    "gridSize": "3x3",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$720",
    "slots": null
  },
  {
    "id": "lvs-overt-ranger-green",
    "name": "LVS Overt (Ranger Green)",
    "category": "Armor Vest",
    "nijClass": "NIJ IIIA+",
    "material": "Steel",
    "coverage": "Front, Back",
    "weight": "7.5kg",
    "gridSize": "3x3",
    "soldBy": "Handshake R.1",
    "buyPrice": "$700",
    "sellPrice": "$210",
    "slots": null
  },
  {
    "id": "lvs-tactical-multicam",
    "name": "LVS Tactical (Multicam)",
    "category": "Armor Vest",
    "nijClass": "NIJ III++",
    "material": "Ceramic",
    "coverage": "Front, Back, Side",
    "weight": "8.2kg",
    "gridSize": "3x3",
    "soldBy": "Handshake R.4",
    "buyPrice": "$4,000",
    "sellPrice": "$1,200",
    "slots": null
  },
  {
    "id": "lvs-tactical-ranger-green",
    "name": "LVS Tactical (Ranger Green)",
    "category": "Armor Vest",
    "nijClass": "NIJ III",
    "material": "Steel",
    "coverage": "Front, Back, Side",
    "weight": "10.8kg",
    "gridSize": "3x3",
    "soldBy": "Handshake R.2",
    "buyPrice": "$1,900",
    "sellPrice": "$570",
    "slots": null
  },
  {
    "id": "molle-vest",
    "name": "Molle Vest",
    "category": "Armor Vest",
    "nijClass": "NIJ IIIA",
    "material": "Steel",
    "coverage": "Front",
    "weight": "2.6kg",
    "gridSize": "3x3",
    "soldBy": "Artisan R.1",
    "buyPrice": "$300",
    "sellPrice": "$90",
    "slots": null
  },
  {
    "id": "nagas-covert-tactical-body-armour",
    "name": "Naga's Covert Tactical Body Armour",
    "category": "Armor Vest",
    "nijClass": "NIJ III",
    "material": "Steel",
    "coverage": "Front, Back",
    "weight": "8.8kg",
    "gridSize": "3x3",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$450",
    "slots": null
  },
  {
    "id": "sk-s-ballistic-vest",
    "name": "SK-S Vest",
    "category": "Armor Vest",
    "nijClass": "NIJ II",
    "material": "Aramid",
    "coverage": "Front, Back",
    "weight": "1.85kg",
    "gridSize": "3x3",
    "soldBy": "Turncoat R.1",
    "buyPrice": "$200",
    "sellPrice": "$60",
    "slots": null
  },
  {
    "id": "6b47-ratnik",
    "name": "6B47 Ratnik",
    "category": "Helmet",
    "nijClass": "NIJ II",
    "material": "Aramid",
    "coverage": "Head",
    "weight": "1.1kg",
    "gridSize": "2x2",
    "soldBy": "Turncoat R.1",
    "buyPrice": "$400",
    "sellPrice": "$120",
    "slots": null
  },
  {
    "id": "amp-1-tp-lc-ranger-green",
    "name": "AMP-1 TP LC (Ranger Green)",
    "category": "Helmet",
    "nijClass": "NIJ IIIA+",
    "material": "UHMWPE",
    "coverage": "Head",
    "weight": "1.4kg",
    "gridSize": "2x2",
    "soldBy": "Handshake R.4",
    "buyPrice": "$3,250",
    "sellPrice": "$975",
    "slots": null
  },
  {
    "id": "amp-1-tp-lc-unlra",
    "name": "AMP-1 TP LC (UNLRA)",
    "category": "Helmet",
    "nijClass": "NIJ IIIA+",
    "material": "UHMWPE",
    "coverage": "Head",
    "weight": "1.4kg",
    "gridSize": "2x2",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$975",
    "slots": null
  },
  {
    "id": "amp-1-tp-mc-ranger-green",
    "name": "AMP-1 TP MC (Ranger Green)",
    "category": "Helmet",
    "nijClass": "NIJ IIIA+",
    "material": "UHMWPE",
    "coverage": "Head",
    "weight": "1.25kg",
    "gridSize": "2x2",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$975",
    "slots": null
  },
  {
    "id": "bk-ach",
    "name": "BK-ACH",
    "category": "Helmet",
    "nijClass": "NIJ IIIA",
    "material": "Aramid",
    "coverage": "Head",
    "weight": "1.4kg",
    "gridSize": "2x2",
    "soldBy": "Handshake R.3",
    "buyPrice": "$1,150",
    "sellPrice": "$345",
    "slots": null
  },
  {
    "id": "bk-ach-hc",
    "name": "BK-ACH-HC",
    "category": "Helmet",
    "nijClass": "NIJ IIIA",
    "material": "Aramid",
    "coverage": "Head",
    "weight": "1.3kg",
    "gridSize": "2x2",
    "soldBy": "Handshake R.3",
    "buyPrice": "$1,050",
    "sellPrice": "$315",
    "slots": null
  },
  {
    "id": "exfil-coyote-brown",
    "name": "EXFIL (Coyote Brown)",
    "category": "Helmet",
    "nijClass": "NIJ IIIA",
    "material": "UHMWPE",
    "coverage": "Head",
    "weight": "1.18kg",
    "gridSize": "2x2",
    "soldBy": "Handshake R.4",
    "buyPrice": "$2,100",
    "sellPrice": "$630",
    "slots": null
  },
  {
    "id": "exfil-multicam",
    "name": "EXFIL (Multicam)",
    "category": "Helmet",
    "nijClass": "NIJ IIIA",
    "material": "UHMWPE",
    "coverage": "Head",
    "weight": "1.18kg",
    "gridSize": "2x2",
    "soldBy": "Handshake R.4",
    "buyPrice": "$2,270",
    "sellPrice": "$681",
    "slots": null
  },
  {
    "id": "fast-mt-multicam",
    "name": "FAST MT (Multicam)",
    "category": "Helmet",
    "nijClass": "NIJ IIIA",
    "material": "UHMWPE",
    "coverage": "Head",
    "weight": "1.1kg",
    "gridSize": "2x2",
    "soldBy": "Handshake R.4",
    "buyPrice": "$2,350",
    "sellPrice": "$705",
    "slots": null
  },
  {
    "id": "fast-mt-tan",
    "name": "FAST MT (Tan)",
    "category": "Helmet",
    "nijClass": "NIJ IIIA",
    "material": "UHMWPE",
    "coverage": "Head",
    "weight": "1.05kg",
    "gridSize": "2x2",
    "soldBy": "Handshake R.4",
    "buyPrice": "$2,300",
    "sellPrice": "$690",
    "slots": null
  },
  {
    "id": "fast-xp-hc-multicam",
    "name": "FAST XP HC (Multicam)",
    "category": "Helmet",
    "nijClass": "NIJ IIIA",
    "material": "UHMWPE",
    "coverage": "Head",
    "weight": "1.25kg",
    "gridSize": "2x2",
    "soldBy": "Handshake R.4",
    "buyPrice": "$2,080",
    "sellPrice": "$624",
    "slots": null
  },
  {
    "id": "fast-xp-hc-olive",
    "name": "FAST XP HC (Olive)",
    "category": "Helmet",
    "nijClass": "NIJ IIIA",
    "material": "UHMWPE",
    "coverage": "Head",
    "weight": "1.25kg",
    "gridSize": "2x2",
    "soldBy": "Handshake R.4",
    "buyPrice": "$2,050",
    "sellPrice": "$615",
    "slots": null
  },
  {
    "id": "lshz-1+-black",
    "name": "LShZ 1+",
    "category": "Helmet",
    "nijClass": "NIJ IIIA",
    "material": "Aramid",
    "coverage": "Head",
    "weight": "1.3kg",
    "gridSize": "2x2",
    "soldBy": "Turncoat R.3",
    "buyPrice": "$1,650",
    "sellPrice": "$495",
    "slots": null
  },
  {
    "id": "lshz-1+-multicam",
    "name": "LShZ 1+ (Multicam)",
    "category": "Helmet",
    "nijClass": "NIJ IIIA",
    "material": "Aramid",
    "coverage": "Head",
    "weight": "1.3kg",
    "gridSize": "2x2",
    "soldBy": "Turncoat R.3",
    "buyPrice": "$1,700",
    "sellPrice": "$510",
    "slots": null
  },
  {
    "id": "m1-ace-of-hearts",
    "name": "M1 (Ace Of Hearts)",
    "category": "Helmet",
    "nijClass": "NIJ I",
    "material": "Steel",
    "coverage": "Head",
    "weight": "1.43kg",
    "gridSize": "2x2",
    "soldBy": "Twitch drop",
    "buyPrice": null,
    "sellPrice": "$75",
    "slots": null
  },
  {
    "id": "m1-ace-of-spades",
    "name": "M1 (Ace Of Spades)",
    "category": "Helmet",
    "nijClass": "NIJ I",
    "material": "Steel",
    "coverage": "Head",
    "weight": "1.43kg",
    "gridSize": "2x2",
    "soldBy": "Twitch drop",
    "buyPrice": null,
    "sellPrice": "$75",
    "slots": null
  },
  {
    "id": "mich-lc",
    "name": "MICH LC",
    "category": "Helmet",
    "nijClass": "NIJ IIIA",
    "material": "Aramid",
    "coverage": "Head",
    "weight": "1.6kg",
    "gridSize": "2x2",
    "soldBy": "Handshake R.2",
    "buyPrice": "$620",
    "sellPrice": "$186",
    "slots": null
  },
  {
    "id": "mich-tc-2000-black",
    "name": "MICH TC-2000 (Black)",
    "category": "Helmet",
    "nijClass": "NIJ IIIA",
    "material": "Aramid",
    "coverage": "Head",
    "weight": "1.5kg",
    "gridSize": "2x2",
    "soldBy": "Handshake R.2",
    "buyPrice": "$820",
    "sellPrice": "$246",
    "slots": null
  },
  {
    "id": "mich-tc-2000-ranger-green",
    "name": "MICH TC-2000 (Green)",
    "category": "Helmet",
    "nijClass": "NIJ IIIA",
    "material": "Aramid",
    "coverage": "Head",
    "weight": "1.5kg",
    "gridSize": "2x2",
    "soldBy": "Handshake R.2",
    "buyPrice": "$650",
    "sellPrice": "$195",
    "slots": null
  },
  {
    "id": "mich-tc-2000-unlra",
    "name": "MICH TC-2000 (UNLRA)",
    "category": "Helmet",
    "nijClass": "NIJ IIIA",
    "material": "Aramid",
    "coverage": "Head",
    "weight": "1.5kg",
    "gridSize": "2x2",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$240",
    "slots": null
  },
  {
    "id": "mich-tc-2002-black",
    "name": "MICH TC-2002 (Black)",
    "category": "Helmet",
    "nijClass": "NIJ IIIA",
    "material": "Aramid",
    "coverage": "Head",
    "weight": "1.230kg",
    "gridSize": "2x2",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": null,
    "slots": null
  },
  {
    "id": "mich-tc-2002-green",
    "name": "MICH TC-2002 (Green)",
    "category": "Helmet",
    "nijClass": "NIJ IIIA",
    "material": "Aramid",
    "coverage": "Head",
    "weight": "1.5kg",
    "gridSize": "2x2",
    "soldBy": "Handshake R.3",
    "buyPrice": "$1,550",
    "sellPrice": "$465",
    "slots": null
  },
  {
    "id": "mich-tc-2002-tan",
    "name": "MICH TC-2002 (Tan)",
    "category": "Helmet",
    "nijClass": "NIJ IIIA",
    "material": "Aramid",
    "coverage": "Head",
    "weight": "1.5kg",
    "gridSize": "2x2",
    "soldBy": "Handshake R.3",
    "buyPrice": "$1,450",
    "sellPrice": "$435",
    "slots": null
  },
  {
    "id": "pasgt",
    "name": "PASGT",
    "category": "Helmet",
    "nijClass": "NIJ II+",
    "material": "Aramid",
    "coverage": "Head",
    "weight": "1.6kg",
    "gridSize": "2x2",
    "soldBy": "Handshake R.2",
    "buyPrice": "$500",
    "sellPrice": "$150",
    "slots": null
  },
  {
    "id": "qgf-03-ghillie",
    "name": "QGF-03 (Ghillie)",
    "category": "Helmet",
    "nijClass": "NIJ IIIA",
    "material": "Aramid",
    "coverage": "Head",
    "weight": "1.25kg",
    "gridSize": "2x2",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$228",
    "slots": null
  },
  {
    "id": "qgf-03-laf-cover",
    "name": "QGF-03 (LAF Cover)",
    "category": "Helmet",
    "nijClass": "NIJ IIIA",
    "material": "Aramid",
    "coverage": "Head",
    "weight": "1.25kg",
    "gridSize": "2x2",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$216",
    "slots": null
  },
  {
    "id": "qgf-03-woodland",
    "name": "QGF-03 (Woodland)",
    "category": "Helmet",
    "nijClass": "NIJ IIIA",
    "material": "Aramid",
    "coverage": "Head",
    "weight": "1.25kg",
    "gridSize": "2x2",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$216",
    "slots": null
  },
  {
    "id": "skull-crusher",
    "name": "Skull Crusher",
    "category": "Helmet",
    "nijClass": "Unrated",
    "material": "Composite",
    "coverage": "Head",
    "weight": "0.28kg",
    "gridSize": "2x2",
    "soldBy": "Banshee R.1 Handshake R.1",
    "buyPrice": "$105",
    "sellPrice": "$31",
    "slots": null
  },
  {
    "id": "ssh-60",
    "name": "SSh-60",
    "category": "Helmet",
    "nijClass": "NIJ I",
    "material": "Steel",
    "coverage": "Head",
    "weight": "1.3kg",
    "gridSize": "2x2",
    "soldBy": "Artisan R.1",
    "buyPrice": "$150",
    "sellPrice": "$45",
    "slots": null
  },
  {
    "id": "ssh-68n",
    "name": "SSh-68N",
    "category": "Helmet",
    "nijClass": "NIJ I",
    "material": "Steel",
    "coverage": "Head",
    "weight": "2kg",
    "gridSize": "2x2",
    "soldBy": "Artisan R.1",
    "buyPrice": "$200",
    "sellPrice": "$60",
    "slots": null
  },
  {
    "id": "stack-up-cap",
    "name": "Stack Up Cap",
    "category": "Helmet",
    "nijClass": "Unrated",
    "material": "Composite",
    "coverage": "Head",
    "weight": "0.110kg",
    "gridSize": "1x1",
    "soldBy": "N/A",
    "buyPrice": null,
    "sellPrice": null,
    "slots": null
  },
  {
    "id": "tor-l",
    "name": "Tor-L",
    "category": "Helmet",
    "nijClass": "NIJ IIIA",
    "material": "Aramid",
    "coverage": "Head",
    "weight": "1.2kg",
    "gridSize": "2x2",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$525",
    "slots": null
  },
  {
    "id": "type-66",
    "name": "Type 66",
    "category": "Helmet",
    "nijClass": "NIJ I",
    "material": "Steel",
    "coverage": "Head",
    "weight": "1.4kg",
    "gridSize": "2x2",
    "soldBy": "Artisan R.1",
    "buyPrice": "$250",
    "sellPrice": "$75",
    "slots": null
  },
  {
    "id": "type-88",
    "name": "Type 88",
    "category": "Helmet",
    "nijClass": "NIJ IIIA",
    "material": "Aramid",
    "coverage": "Head",
    "weight": "1.3kg",
    "gridSize": "2x2",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$180",
    "slots": null
  },
  {
    "id": "type-88-type-2",
    "name": "Type 88 (Type 2)",
    "category": "Helmet",
    "nijClass": "NIJ IIIA",
    "material": "Aramid",
    "coverage": "Head",
    "weight": "1.3kg",
    "gridSize": "2x2",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$210",
    "slots": null
  },
  {
    "id": "6b45-ratnik",
    "name": "6B45 Ratnik",
    "category": "Plate Carrier",
    "nijClass": "NIJ III+",
    "material": "Steel",
    "coverage": "Front, Back, Side",
    "weight": "13.2kg",
    "gridSize": "3x4",
    "soldBy": "Turncoat R.3",
    "buyPrice": "$2,900",
    "sellPrice": "$870",
    "slots": "12"
  },
  {
    "id": "6b45-ratnik-black",
    "name": "6B45 Ratnik (Black)",
    "category": "Plate Carrier",
    "nijClass": "NIJ III++",
    "material": "Ceramic",
    "coverage": "Front, Back",
    "weight": "12.1kg",
    "gridSize": "3x4",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$1,305",
    "slots": "12"
  },
  {
    "id": "burans-pantsir-2.0",
    "name": "Buran's Pantsir 2.0",
    "category": "Plate Carrier",
    "nijClass": "NIJ III++",
    "material": "Ceramic",
    "coverage": "Front, Back, Side",
    "weight": "9.6kg",
    "gridSize": "3x4",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$1,395",
    "slots": "9"
  },
  {
    "id": "cgpc3-tqs",
    "name": "CGPC3 TQS",
    "category": "Plate Carrier",
    "nijClass": "NIJ IIIA",
    "material": "UHMWPE",
    "coverage": "Front, Back",
    "weight": "3.7kg",
    "gridSize": "3x3",
    "soldBy": "Handshake R.1",
    "buyPrice": "$880",
    "sellPrice": "$264",
    "slots": "9"
  },
  {
    "id": "cgpc3-tqs-vts",
    "name": "CGPC3 TQS (VTS)",
    "category": "Plate Carrier",
    "nijClass": "NIJ III+",
    "material": "Ceramic",
    "coverage": "Front, Back",
    "weight": "6.2kg",
    "gridSize": "3x3",
    "soldBy": "Loot only",
    "buyPrice": "$3,100",
    "sellPrice": "$930",
    "slots": "9"
  },
  {
    "id": "chest-rig-901-elite-4",
    "name": "Chest Rig 901 Elite 4",
    "category": "Plate Carrier",
    "nijClass": "NIJ III",
    "material": "Steel",
    "coverage": "Front",
    "weight": "5.7kg",
    "gridSize": "4x3",
    "soldBy": "Handshake R.2",
    "buyPrice": "$1,500",
    "sellPrice": "$450",
    "slots": "10"
  },
  {
    "id": "chest-rig-901-elite-4-(vts)",
    "name": "Chest Rig 901 Elite 4 (VTS)",
    "category": "Plate Carrier",
    "nijClass": "III+",
    "material": "Steel",
    "coverage": "Front",
    "weight": "4.8",
    "gridSize": "4x3",
    "soldBy": "Loot / Boss / Tasks",
    "buyPrice": null,
    "sellPrice": null,
    "slots": null
  },
  {
    "id": "cz-4m-lancer",
    "name": "CZ 4M Lancer",
    "category": "Plate Carrier",
    "nijClass": "NIJ III",
    "material": "UHMWPE",
    "coverage": "Front, Back",
    "weight": "5kg",
    "gridSize": "3x3",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$525",
    "slots": "9"
  },
  {
    "id": "cz-4m-lancer-black",
    "name": "CZ 4M Lancer (Black)",
    "category": "Plate Carrier",
    "nijClass": "NIJ III+",
    "material": "Ceramic",
    "coverage": "Front, Back",
    "weight": "5.6kg",
    "gridSize": "3x3",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$855",
    "slots": "9"
  },
  {
    "id": "cz-4m-lancer-unlra",
    "name": "CZ 4M Lancer (UNLRA)",
    "category": "Plate Carrier",
    "nijClass": "NIJ III",
    "material": "UHMWPE",
    "coverage": "Front, Back",
    "weight": "5.8kg",
    "gridSize": "3x3",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$570",
    "slots": "9"
  },
  {
    "id": "lbt-6094-g3v2",
    "name": "LBT-6094 G3v2",
    "category": "Plate Carrier",
    "nijClass": "NIJ III++",
    "material": "Ceramic",
    "coverage": "Front, Back",
    "weight": "7.1kg",
    "gridSize": "3x3",
    "soldBy": "Handshake R.4",
    "buyPrice": "$5,230",
    "sellPrice": "$1,569",
    "slots": "9"
  },
  {
    "id": "lcs-sentry",
    "name": "LCS Sentry",
    "category": "Plate Carrier",
    "nijClass": "NIJ III",
    "material": "UHMWPE",
    "coverage": "Front, Back",
    "weight": "3.9kg",
    "gridSize": "3x3",
    "soldBy": "Handshake R.2",
    "buyPrice": "$1,650",
    "sellPrice": "$495",
    "slots": "8"
  },
  {
    "id": "lcs-sentry-unlra",
    "name": "LCS Sentry (UNLRA)",
    "category": "Plate Carrier",
    "nijClass": "NIJ III",
    "material": "UHMWPE",
    "coverage": "Front, Back",
    "weight": "4.7kg",
    "gridSize": "3x3",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$510",
    "slots": "8"
  },
  {
    "id": "m2-plate-carrier-emr",
    "name": "M2 Plate Carrier (EMR)",
    "category": "Plate Carrier",
    "nijClass": "NIJ III+",
    "material": "Ceramic",
    "coverage": "Front, Back",
    "weight": "7.7kg",
    "gridSize": "3x4",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$975",
    "slots": "12"
  },
  {
    "id": "m2-plate-carrier-olive-green",
    "name": "M2 Plate Carrier (Olive Green)",
    "category": "Plate Carrier",
    "nijClass": "NIJ III++",
    "material": "Ceramic",
    "coverage": "Front, Back",
    "weight": "8.9kg",
    "gridSize": "3x4",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$1,500",
    "slots": "12"
  },
  {
    "id": "modular-operator-carrier-gen-ii",
    "name": "Modular Operator Carrier Gen II",
    "category": "Plate Carrier",
    "nijClass": "NIJ IIIA",
    "material": "UHMWPE",
    "coverage": "Front, Back, Side",
    "weight": "4.2kg",
    "gridSize": "3x3",
    "soldBy": "Handshake R.1",
    "buyPrice": "$650",
    "sellPrice": "$195",
    "slots": "8"
  },
  {
    "id": "pantsir-2.0",
    "name": "Pantsir 2.0",
    "category": "Plate Carrier",
    "nijClass": "NIJ III",
    "material": "Steel",
    "coverage": "Front, Back, Side",
    "weight": "12.1kg",
    "gridSize": "3x4",
    "soldBy": "Turncoat R.2",
    "buyPrice": "$1,850",
    "sellPrice": "$555",
    "slots": "12"
  },
  {
    "id": "pantsir-2.0-laf",
    "name": "Pantsir 2.0 (LAF)",
    "category": "Plate Carrier",
    "nijClass": "NIJ III+",
    "material": "Ceramic",
    "coverage": "Front, Back, Side",
    "weight": "8.9kg",
    "gridSize": "3x4",
    "soldBy": "Loot / Boss / Tasks",
    "buyPrice": "$3,000",
    "sellPrice": "$900",
    "slots": "12"
  },
  {
    "id": "pantsir-2.0-rsb",
    "name": "Pantsir 2.0 (RSB)",
    "category": "Plate Carrier",
    "nijClass": "NIJ III",
    "material": "Steel",
    "coverage": "Front, Back, Side",
    "weight": "10.5kg",
    "gridSize": "3x4",
    "soldBy": "Loot only",
    "buyPrice": "$1,700",
    "sellPrice": "$510",
    "slots": "9"
  },
  {
    "id": "phantom-type-2",
    "name": "Phantom Type 2",
    "category": "Plate Carrier",
    "nijClass": "NIJ III++",
    "material": "Ceramic",
    "coverage": "Front, Back, Side",
    "weight": "13.2kg",
    "gridSize": "3x4",
    "soldBy": "Turncoat R.4",
    "buyPrice": "$4,600",
    "sellPrice": "$1,380",
    "slots": "12"
  },
  {
    "id": "plate6-plate-carrier",
    "name": "Plate6 Plate Carrier",
    "category": "Plate Carrier",
    "nijClass": "NIJ III++",
    "material": "Ceramic",
    "coverage": "Front, Back",
    "weight": "9.6kg",
    "gridSize": "3x4",
    "soldBy": "Handshake R.4",
    "buyPrice": "$4,450",
    "sellPrice": "$1,335",
    "slots": "16"
  },
  {
    "id": "recon-plate-carrier",
    "name": "Recon Plate Carrier",
    "category": "Plate Carrier",
    "nijClass": "NIJ III+",
    "material": "Ceramic",
    "coverage": "Front, Back",
    "weight": "4.3kg",
    "gridSize": "3x3",
    "soldBy": "Handshake R.3",
    "buyPrice": "$3,150",
    "sellPrice": "$945",
    "slots": "9"
  },
  {
    "id": "recon-plate-carrier-agent",
    "name": "Recon Plate Carrier (Agent)",
    "category": "Plate Carrier",
    "nijClass": "NIJ III+",
    "material": "Ceramic",
    "coverage": "Front, Back",
    "weight": "4.3kg",
    "gridSize": "3x3",
    "soldBy": "Twitch drops",
    "buyPrice": null,
    "sellPrice": "$945",
    "slots": "9"
  },
  {
    "id": "specter",
    "name": "Specter",
    "category": "Plate Carrier",
    "nijClass": "NIJ IIIA",
    "material": "Aramid",
    "coverage": "Front, Back",
    "weight": "2.8kg",
    "gridSize": "2x3",
    "soldBy": "Handshake R.1",
    "buyPrice": "$300",
    "sellPrice": "$90",
    "slots": "6"
  },
  {
    "id": "spitfire-plate-carrier",
    "name": "Spitfire Plate Carrier",
    "category": "Plate Carrier",
    "nijClass": "NIJ III+",
    "material": "Steel",
    "coverage": "Front, Back, Side",
    "weight": "6.5kg",
    "gridSize": "3x4",
    "soldBy": "Handshake R.3",
    "buyPrice": "$3,450",
    "sellPrice": "$1,035",
    "slots": "12"
  },
  {
    "id": "vipers-modular-operator-carrier-gen-ii",
    "name": "Viper's Modular Operator Carrier Gen II",
    "category": "Plate Carrier",
    "nijClass": "NIJ III+",
    "material": "Ceramic",
    "coverage": "Front, Back, Side",
    "weight": "6.6kg",
    "gridSize": "3x3",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$810",
    "slots": "8"
  },
  {
    "id": "yens-pantsir-2.0",
    "name": "Yen's Pantsir 2.0",
    "category": "Plate Carrier",
    "nijClass": "NIJ III++",
    "material": "Ceramic",
    "coverage": "Front, Back, Side",
    "weight": "9.6kg",
    "gridSize": "3x4",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$1,410",
    "slots": "9"
  }
];

export const ARCHIVE_MEDICAL: ArchiveMedicalEntry[] = [
  {
    "id": "arf-trauma-bandage-4",
    "name": "ARF Trauma Bandage 4",
    "category": "Bandage",
    "effect": "effects: Treats Light Injury in Multiple Body Parts",
    "charges": "3",
    "useTime": "8s",
    "duration": null,
    "intoxication": null,
    "weight": "0.07kg",
    "gridSize": "1x1",
    "soldBy": "Lab Rat R.2",
    "buyPrice": "$31",
    "sellPrice": "$9.3"
  },
  {
    "id": "civilian-gauze",
    "name": "Civilian Gauze",
    "category": "Bandage",
    "effect": "effects: Treats Light Injury in Multiple Body Parts",
    "charges": "2",
    "useTime": "10s",
    "duration": null,
    "intoxication": null,
    "weight": "0.03kg",
    "gridSize": "1x1",
    "soldBy": "Lab Rat R.1",
    "buyPrice": "$9",
    "sellPrice": "$2.7"
  },
  {
    "id": "seal-modular-bandage",
    "name": "SEAL Modular Bandage",
    "category": "Bandage",
    "effect": "effects: Treats Light Injury in Multiple Body Parts",
    "charges": "4",
    "useTime": "6s",
    "duration": null,
    "intoxication": null,
    "weight": "0.09kg",
    "gridSize": "1x1",
    "soldBy": "Lab Rat R.4",
    "buyPrice": "$55",
    "sellPrice": "$16.5"
  },
  {
    "id": "large-blood-bag",
    "name": "Large Blood Bag",
    "category": "IV",
    "effect": "blood: 2,500",
    "charges": "3",
    "useTime": "5s",
    "duration": null,
    "intoxication": null,
    "weight": "2.1kg",
    "gridSize": "2x1",
    "soldBy": "Lab Rat R.4",
    "buyPrice": "$980",
    "sellPrice": "$294"
  },
  {
    "id": "medium-blood-bag",
    "name": "Medium Blood Bag",
    "category": "IV",
    "effect": "blood: 1,500",
    "charges": "2",
    "useTime": "5s",
    "duration": null,
    "intoxication": null,
    "weight": "1.6kg",
    "gridSize": "2x1",
    "soldBy": "Lab Rat R.3",
    "buyPrice": "$750",
    "sellPrice": "$225"
  },
  {
    "id": "small-blood-bag",
    "name": "Small Blood Bag",
    "category": "IV",
    "effect": "blood: 500",
    "charges": "1",
    "useTime": "5s",
    "duration": null,
    "intoxication": null,
    "weight": "0.6kg",
    "gridSize": "1x1",
    "soldBy": "Lab Rat R.2",
    "buyPrice": "$280",
    "sellPrice": "$84"
  },
  {
    "id": "medical",
    "name": "Medical",
    "category": "Medical",
    "effect": "Treats trauma or restores status",
    "charges": null,
    "useTime": null,
    "duration": null,
    "intoxication": null,
    "weight": null,
    "gridSize": null,
    "soldBy": "Loot / Tasks",
    "buyPrice": null,
    "sellPrice": null
  },
  {
    "id": "activated-charcoal",
    "name": "Activated Charcoal",
    "category": "Pill",
    "effect": "intoxication: -10; duration: 10s",
    "charges": "5",
    "useTime": "5s",
    "duration": null,
    "intoxication": "-10",
    "weight": "0.15kg",
    "gridSize": "1x1",
    "soldBy": "Lab Rat R.1",
    "buyPrice": "$18",
    "sellPrice": "$5.4"
  },
  {
    "id": "ibalin",
    "name": "Ibalin",
    "category": "Pill",
    "effect": "pain: -50; duration: 300s",
    "charges": "2",
    "useTime": "6s",
    "duration": null,
    "intoxication": null,
    "weight": "0.05kg",
    "gridSize": "1x1",
    "soldBy": "Lab Rat R.2",
    "buyPrice": "$8",
    "sellPrice": "$2.4"
  },
  {
    "id": "ibalin-bottle",
    "name": "Ibalin Bottle",
    "category": "Pill",
    "effect": "pain: -50; duration: 300s",
    "charges": "5",
    "useTime": "5s",
    "duration": null,
    "intoxication": null,
    "weight": "0.15kg",
    "gridSize": "1x1",
    "soldBy": "Lab Rat R.2",
    "buyPrice": "$24",
    "sellPrice": "$7.2"
  },
  {
    "id": "meloxicam",
    "name": "Meloxicam",
    "category": "Pill",
    "effect": "pain: -66; duration: 300s",
    "charges": "2",
    "useTime": "6s",
    "duration": null,
    "intoxication": null,
    "weight": "0.05kg",
    "gridSize": "1x1",
    "soldBy": "Lab Rat R.3",
    "buyPrice": "$16",
    "sellPrice": "$4.8"
  },
  {
    "id": "meloxicam-bottle",
    "name": "Meloxicam Bottle",
    "category": "Pill",
    "effect": "pain: -66; duration: 300s",
    "charges": "5",
    "useTime": "5s",
    "duration": null,
    "intoxication": null,
    "weight": "0.15kg",
    "gridSize": "1x1",
    "soldBy": "Lab Rat R.3",
    "buyPrice": "$48",
    "sellPrice": "$14.4"
  },
  {
    "id": "moxifloxacin",
    "name": "Moxifloxacin",
    "category": "Pill",
    "effect": "intoxication: -25; duration: 25s",
    "charges": "4",
    "useTime": "6s",
    "duration": null,
    "intoxication": "-25",
    "weight": "0.05kg",
    "gridSize": "1x1",
    "soldBy": "Lab Rat R.3",
    "buyPrice": "$125",
    "sellPrice": "$37.5"
  },
  {
    "id": "paracetamol",
    "name": "Paracetamol",
    "category": "Pill",
    "effect": "pain: -33; duration: 150s",
    "charges": "2",
    "useTime": "6s",
    "duration": null,
    "intoxication": null,
    "weight": "0.05kg",
    "gridSize": "1x1",
    "soldBy": "Lab Rat R.1",
    "buyPrice": "$5",
    "sellPrice": "$1.5"
  },
  {
    "id": "paracetamol-bottle",
    "name": "Paracetamol Bottle",
    "category": "Pill",
    "effect": "pain: -33; duration: 150s",
    "charges": "5",
    "useTime": "5s",
    "duration": null,
    "intoxication": null,
    "weight": "0.15kg",
    "gridSize": "1x1",
    "soldBy": "Lab Rat R.1",
    "buyPrice": "$15",
    "sellPrice": "$4.5"
  },
  {
    "id": "potassium-iodide",
    "name": "Potassium Iodide",
    "category": "Pill",
    "effect": "radiations: -4; duration: 60s",
    "charges": "2",
    "useTime": "6s",
    "duration": null,
    "intoxication": null,
    "weight": "0.05kg",
    "gridSize": "1x1",
    "soldBy": "Lab Rat R.2",
    "buyPrice": "$120",
    "sellPrice": "$36"
  },
  {
    "id": "advanced-flexible-splint",
    "name": "Advanced Flexible Splint",
    "category": "Splint",
    "effect": "effects: Treats All Bones in One Body Part",
    "charges": "6",
    "useTime": "10s",
    "duration": null,
    "intoxication": null,
    "weight": "0.13kg",
    "gridSize": "1x1",
    "soldBy": "Lab Rat R.4",
    "buyPrice": "$58",
    "sellPrice": "$17.4"
  },
  {
    "id": "civilian-flexible-splint",
    "name": "Civilian Flexible Splint",
    "category": "Splint",
    "effect": "effects: Treats All Bones in One Body Part",
    "charges": "2",
    "useTime": "13s",
    "duration": null,
    "intoxication": null,
    "weight": "0.15kg",
    "gridSize": "1x1",
    "soldBy": "Lab Rat R.1",
    "buyPrice": "$16",
    "sellPrice": "$4.8"
  },
  {
    "id": "flexible-splint",
    "name": "Flexible Splint",
    "category": "Splint",
    "effect": "effects: Treats All Bones in One Body Part",
    "charges": "4",
    "useTime": "10s",
    "duration": null,
    "intoxication": null,
    "weight": "0.13kg",
    "gridSize": "1x1",
    "soldBy": "Lab Rat R.3",
    "buyPrice": "$36",
    "sellPrice": "$10.8"
  },
  {
    "id": "dt-0x",
    "name": "DT-0X",
    "category": "Stimulator",
    "effect": "effects: Increased Hydration Drain; intoxication: -100; livers: -15 %; hydratation_per_charge: -25; duration: 90s",
    "charges": "1",
    "useTime": "3s",
    "duration": null,
    "intoxication": "-100",
    "weight": "0.1kg",
    "gridSize": "1x1",
    "soldBy": "Loot only Crafting",
    "buyPrice": null,
    "sellPrice": "$180"
  },
  {
    "id": "epo",
    "name": "EPO",
    "category": "Stimulator",
    "effect": "effects: Blood Regeneration Increased Hydration Drain; intoxication: +15; livers: -4 %; hydratation_per_charge: -50; duration: 180s",
    "charges": "1",
    "useTime": "3s",
    "duration": null,
    "intoxication": "+15",
    "weight": "0.1kg",
    "gridSize": "1x1",
    "soldBy": "Loot only Crafting",
    "buyPrice": null,
    "sellPrice": "$219"
  },
  {
    "id": "fenethylline",
    "name": "Fenethylline",
    "category": "Stimulator",
    "effect": "effects: Stamina Regeneration Increased Hydration Drain; intoxication: +3; hydratation_per_charge: -10; duration: 180s",
    "charges": "4",
    "useTime": "5s",
    "duration": null,
    "intoxication": "+3",
    "weight": "0.15kg",
    "gridSize": "1x1",
    "soldBy": "Loot only Crafting",
    "buyPrice": null,
    "sellPrice": "$29.1"
  },
  {
    "id": "hpr-3-s",
    "name": "HpR 3-S",
    "category": "Stimulator",
    "effect": "effects: Organ Regeneration; intoxication: +20; pain: +20; organs: +50 %; duration: 240s",
    "charges": "1",
    "useTime": "3s",
    "duration": null,
    "intoxication": "+20",
    "weight": "0.1kg",
    "gridSize": "1x1",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$285"
  },
  {
    "id": "methylphenidate",
    "name": "Methylphenidate",
    "category": "Stimulator",
    "effect": "effects: Suppression Resistance Depleted Body Stamina; intoxication: +15; livers: -5 %; duration: 300s",
    "charges": "2",
    "useTime": "6s",
    "duration": null,
    "intoxication": "+15",
    "weight": "0.05kg",
    "gridSize": "1x1",
    "soldBy": "Loot only Crafting",
    "buyPrice": null,
    "sellPrice": "$63"
  },
  {
    "id": "morphine",
    "name": "Morphine",
    "category": "Stimulator",
    "effect": "effects: Limping Tremors; intoxication: +15; pain: -100; livers: -5 %; duration: 240s",
    "charges": "1",
    "useTime": "3s",
    "duration": null,
    "intoxication": "+15",
    "weight": "0.1kg",
    "gridSize": "1x1",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$135"
  },
  {
    "id": "ori-12",
    "name": "ORI-12",
    "category": "Stimulator",
    "effect": "effects: Bone Regeneration; intoxication: +12; pain: +20; duration: 240s",
    "charges": "1",
    "useTime": "3s",
    "duration": null,
    "intoxication": "+12",
    "weight": "0.1kg",
    "gridSize": "1x1",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$255"
  },
  {
    "id": "strychnine",
    "name": "Strychnine",
    "category": "Stimulator",
    "effect": "effects: Stamina Drain Prevention; intoxication: +20; pain: +20; heart: -5 %; duration: 60s",
    "charges": "1",
    "useTime": "3s",
    "duration": null,
    "intoxication": "+20",
    "weight": "0.1kg",
    "gridSize": "1x1",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$180"
  },
  {
    "id": "basic-surgical-&-suture-kit",
    "name": "Basic Surgical & Suture Kit",
    "category": "Surgery Kit",
    "effect": "effects: Treats All Injuries in One Body Part",
    "charges": "5",
    "useTime": "16s",
    "duration": null,
    "intoxication": null,
    "weight": "0.6kg",
    "gridSize": "2x1",
    "soldBy": "Lab Rat R.4",
    "buyPrice": "$650",
    "sellPrice": "$195"
  },
  {
    "id": "emergency-suture-kit",
    "name": "Emergency Suture Kit",
    "category": "Surgery Kit",
    "effect": "effects: Treats All Injuries in One Body Part",
    "charges": "2",
    "useTime": "18s",
    "duration": null,
    "intoxication": null,
    "weight": "0.2kg",
    "gridSize": "2x1",
    "soldBy": "Lab Rat R.2",
    "buyPrice": "$180",
    "sellPrice": "$54"
  },
  {
    "id": "small-suture-kit",
    "name": "Small Suture Kit",
    "category": "Surgery Kit",
    "effect": "effects: Treats All Injuries in One Body Part",
    "charges": "3",
    "useTime": "18s",
    "duration": null,
    "intoxication": null,
    "weight": "0.35kg",
    "gridSize": "2x1",
    "soldBy": "Lab Rat R.3",
    "buyPrice": "$270",
    "sellPrice": "$81"
  },
  {
    "id": "large-hemostatic-syringe",
    "name": "Large Hemostatic Syringe",
    "category": "Syringe",
    "effect": "effects: Stops All Bleeding",
    "charges": "4",
    "useTime": "2s",
    "duration": null,
    "intoxication": null,
    "weight": "0.15kg",
    "gridSize": "1x1",
    "soldBy": "Lab Rat R.4",
    "buyPrice": "$210",
    "sellPrice": "$63"
  },
  {
    "id": "small-hemostatic-syringe",
    "name": "Small Hemostatic Syringe",
    "category": "Syringe",
    "effect": "effects: Stops All Bleeding",
    "charges": "2",
    "useTime": "3s",
    "duration": null,
    "intoxication": null,
    "weight": "0.06kg",
    "gridSize": "1x1",
    "soldBy": "Lab Rat R.3",
    "buyPrice": "$130",
    "sellPrice": "$39"
  },
  {
    "id": "combat-tourniquet",
    "name": "Combat Tourniquet",
    "category": "Tourniquet",
    "effect": "effects: Stops All Bleeding",
    "charges": "3",
    "useTime": "4s",
    "duration": null,
    "intoxication": null,
    "weight": "0.09kg",
    "gridSize": "1x1",
    "soldBy": "Lab Rat R.3",
    "buyPrice": "$82",
    "sellPrice": "$24.6"
  },
  {
    "id": "m.f.a.t.-tourniquet",
    "name": "M.F.A.T. Tourniquet",
    "category": "Tourniquet",
    "effect": "effects: Stops All Bleeding",
    "charges": "3",
    "useTime": "4s",
    "duration": null,
    "intoxication": null,
    "weight": "0.08kg",
    "gridSize": "1x1",
    "soldBy": "Lab Rat R.2",
    "buyPrice": "$65",
    "sellPrice": "$19.5"
  },
  {
    "id": "retractable-tourniquet",
    "name": "Retractable Tourniquet",
    "category": "Tourniquet",
    "effect": "effects: Stops All Bleeding",
    "charges": "1",
    "useTime": "5s",
    "duration": null,
    "intoxication": null,
    "weight": "0.08kg",
    "gridSize": "1x1",
    "soldBy": "Lab Rat R.1",
    "buyPrice": "$25",
    "sellPrice": "$7.5"
  }
];

export const ARCHIVE_NVG: ArchiveNvgEntry[] = [
  {
    "id": "an/pvs-14-night-vision-device",
    "name": "AN/PVS-14 Night Vision Device",
    "phosphor": "Green",
    "fov": "40°",
    "fom": "2000+",
    "weight": "0.338kg",
    "soldBy": "Banshee R.2",
    "buyPrice": null
  },
  {
    "id": "an/pvs-31a-night-vision-device",
    "name": "AN/PVS-31A Night Vision Device",
    "phosphor": "Green",
    "fov": "40°",
    "fom": "2000+",
    "weight": "0.450kg",
    "soldBy": "Banshee R.3",
    "buyPrice": null
  },
  {
    "id": "an/pvs-7-night-vision-device",
    "name": "AN/PVS-7 Night Vision Device",
    "phosphor": "Green",
    "fov": "40°",
    "fom": "2000+",
    "weight": "0.680kg",
    "soldBy": "Banshee R.2",
    "buyPrice": null
  },
  {
    "id": "dt-2-ngs-edition-night-vision-device-multicam-black",
    "name": "DT-2 NGS Edition night vision device (Multicam black)",
    "phosphor": "Green",
    "fov": "40°",
    "fom": "2000+",
    "weight": "0.560kg",
    "soldBy": "Loot only",
    "buyPrice": null
  },
  {
    "id": "dt-2-ngs-edition-night-vision-device-multicam",
    "name": "DT-2 NGS Edition night vision device (Multicam)",
    "phosphor": "Green",
    "fov": "40°",
    "fom": "2000+",
    "weight": "0.560kg",
    "soldBy": "Banshee R.4",
    "buyPrice": "$23,500"
  }
];

export const ARCHIVE_STORAGE: ArchiveStorageEntry[] = [
  {
    "id": "6sh118-ratnik-v2",
    "name": "6Sh118 Ratnik V2",
    "category": "Backpack",
    "gridSize": "5x6",
    "capacity": "30",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$435"
  },
  {
    "id": "amp12",
    "name": "AMP12",
    "category": "Backpack",
    "gridSize": "4x5",
    "capacity": "20",
    "soldBy": "Handshake R.3",
    "buyPrice": "$810",
    "sellPrice": "$243"
  },
  {
    "id": "assault-backpack",
    "name": "Assault Backpack",
    "category": "Backpack",
    "gridSize": "3x3",
    "capacity": "6",
    "soldBy": "Turncoat R.1",
    "buyPrice": "$150",
    "sellPrice": "$45"
  },
  {
    "id": "bloodhounds-sport-backpack",
    "name": "Bloodhound's Sport Backpack",
    "category": "Backpack",
    "gridSize": "3x3",
    "capacity": "9",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$24"
  },
  {
    "id": "c2-bag-combat-compact-backpack",
    "name": "C2 BAG Combat Compact Backpack",
    "category": "Backpack",
    "gridSize": "3x4",
    "capacity": "12",
    "soldBy": "Handshake R.2",
    "buyPrice": "$432",
    "sellPrice": "$129"
  },
  {
    "id": "civilian-trekstars-70l-backpack",
    "name": "Civilian Trekstars 70L",
    "category": "Backpack",
    "gridSize": "6x7",
    "capacity": "42",
    "soldBy": "Artisan R.4",
    "buyPrice": "$1,200",
    "sellPrice": "$360"
  },
  {
    "id": "delta-backpack",
    "name": "Delta Backpack",
    "category": "Backpack",
    "gridSize": "6x6",
    "capacity": "36",
    "soldBy": "Turncoat R.4",
    "buyPrice": "$1,650",
    "sellPrice": "$495"
  },
  {
    "id": "drawstring-backpack",
    "name": "Drawstring Backpack",
    "category": "Backpack",
    "gridSize": "2x2",
    "capacity": "4",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$15"
  },
  {
    "id": "drug-shipment-backpack-drug-run",
    "name": "Drug Shipment Backpack (Drug Run)",
    "category": "Backpack",
    "gridSize": "5x5",
    "capacity": "0",
    "soldBy": "Loot / Tasks",
    "buyPrice": null,
    "sellPrice": "$21,000"
  },
  {
    "id": "drug-shipment-backpack-drug-run:-high-risk",
    "name": "Drug Shipment Backpack (Drug Run: High Risk)",
    "category": "Backpack",
    "gridSize": "5x5",
    "capacity": null,
    "soldBy": "Loot / Tasks",
    "buyPrice": null,
    "sellPrice": "$29,250"
  },
  {
    "id": "falang-28",
    "name": "Falang 28",
    "category": "Backpack",
    "gridSize": "4x5",
    "capacity": "20",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$87"
  },
  {
    "id": "golden-boys-leather-backpack",
    "name": "Golden Boy's Leather Backpack",
    "category": "Backpack",
    "gridSize": "2x3",
    "capacity": "6",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$16"
  },
  {
    "id": "gunfighter-14",
    "name": "Gunfighter 14",
    "category": "Backpack",
    "gridSize": "3x3",
    "capacity": "9",
    "soldBy": "Handshake R.1",
    "buyPrice": "$250",
    "sellPrice": "$75"
  },
  {
    "id": "jden-jam-ball",
    "name": "JDEN Jam Ball",
    "category": "Backpack",
    "gridSize": "3x4",
    "capacity": "12",
    "soldBy": "Artisan R.2",
    "buyPrice": "$150",
    "sellPrice": "$45"
  },
  {
    "id": "military-contraband-backpack-special-delivery",
    "name": "Military Contraband Backpack (Special Delivery)",
    "category": "Backpack",
    "gridSize": "5x5",
    "capacity": null,
    "soldBy": "Loot / Tasks",
    "buyPrice": null,
    "sellPrice": "$20,250"
  },
  {
    "id": "military-contraband-backpack-special-delivery:-high-risk",
    "name": "Military Contraband Backpack (Special Delivery: High Risk)",
    "category": "Backpack",
    "gridSize": "5x5",
    "capacity": null,
    "soldBy": "Loot / Tasks",
    "buyPrice": null,
    "sellPrice": "$36,000"
  },
  {
    "id": "patrol-backpack",
    "name": "Patrol Backpack",
    "category": "Backpack",
    "gridSize": "4x5",
    "capacity": "20",
    "soldBy": "Turncoat R.3",
    "buyPrice": "$750",
    "sellPrice": "$225"
  },
  {
    "id": "patrol-backpack-coyote",
    "name": "Patrol Backpack (Coyote)",
    "category": "Backpack",
    "gridSize": "4x5",
    "capacity": "20",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$225"
  },
  {
    "id": "rush-72-2.0",
    "name": "Rush 72 2.0",
    "category": "Backpack",
    "gridSize": "5x6",
    "capacity": "25",
    "soldBy": "Handshake R.4",
    "buyPrice": "$1,250",
    "sellPrice": "$375"
  },
  {
    "id": "scorpion-ocp-convoy-pack",
    "name": "Scorpion OCP Convoy Pack (Coyote)",
    "category": "Backpack",
    "gridSize": "4x4",
    "capacity": "16",
    "soldBy": "Handshake R.3",
    "buyPrice": "$650",
    "sellPrice": "$195"
  },
  {
    "id": "scorpion-ocp-convoy-pack-multicam",
    "name": "Scorpion OCP Convoy Pack (Multicam)",
    "category": "Backpack",
    "gridSize": "4x4",
    "capacity": "16",
    "soldBy": "Handshake R.3",
    "buyPrice": "$650",
    "sellPrice": "$195"
  },
  {
    "id": "small-tourist-backpack",
    "name": "Small Tourist Backpack",
    "category": "Backpack",
    "gridSize": "2x3",
    "capacity": "6",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$19"
  },
  {
    "id": "sport-backpack",
    "name": "Sport Backpack",
    "category": "Backpack",
    "gridSize": "3x3",
    "capacity": "9",
    "soldBy": "Artisan R.1",
    "buyPrice": "$82",
    "sellPrice": "$24"
  },
  {
    "id": "6sh104",
    "name": "6Sh104",
    "category": "Chest Rig",
    "gridSize": "4x4",
    "capacity": "16",
    "soldBy": "Turncoat R.4",
    "buyPrice": "$700",
    "sellPrice": "$210"
  },
  {
    "id": "6sh104-coyote",
    "name": "6Sh104 (Coyote)",
    "category": "Chest Rig",
    "gridSize": "4x4",
    "capacity": "16",
    "soldBy": "Turncoat R.4",
    "buyPrice": "$680",
    "sellPrice": "$204"
  },
  {
    "id": "6sh104-olive",
    "name": "6Sh104 (Olive)",
    "category": "Chest Rig",
    "gridSize": "4x4",
    "capacity": "16",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$204"
  },
  {
    "id": "alice",
    "name": "ALICE",
    "category": "Chest Rig",
    "gridSize": "2x4",
    "capacity": "8",
    "soldBy": "Handshake R.2",
    "buyPrice": "$130",
    "sellPrice": "$39"
  },
  {
    "id": "biker-chest-rig",
    "name": "Biker Chest Rig",
    "category": "Chest Rig",
    "gridSize": "2x3",
    "capacity": "4",
    "soldBy": "Artisan R.1",
    "buyPrice": "$60",
    "sellPrice": "$18"
  },
  {
    "id": "brokers-training-mini-rig",
    "name": "Broker's Training Mini Rig",
    "category": "Chest Rig",
    "gridSize": "3x3",
    "capacity": "9",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$63"
  },
  {
    "id": "chaonais-biker-chest-rig",
    "name": "Chaonai's Biker Chest Rig",
    "category": "Chest Rig",
    "gridSize": "2x3",
    "capacity": "4",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$18"
  },
  {
    "id": "colonels-6sh104",
    "name": "Colonel's 6Sh104",
    "category": "Chest Rig",
    "gridSize": "4x4",
    "capacity": "16",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$210"
  },
  {
    "id": "firebrands-alice",
    "name": "Firebrand's ALICE",
    "category": "Chest Rig",
    "gridSize": "2x4",
    "capacity": "8",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$39"
  },
  {
    "id": "grins-training-mini-rig",
    "name": "Grin's Training Mini Rig",
    "category": "Chest Rig",
    "gridSize": "3x3",
    "capacity": "9",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$63"
  },
  {
    "id": "improvized-rig",
    "name": "Improvized Rig",
    "category": "Chest Rig",
    "gridSize": "2x2",
    "capacity": "2",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$9"
  },
  {
    "id": "kangaroo-tactical-rig-big",
    "name": "Kangaroo Tactical Rig (Big)",
    "category": "Chest Rig",
    "gridSize": "3x4",
    "capacity": "12",
    "soldBy": "Turncoat R.3",
    "buyPrice": "$380",
    "sellPrice": "$114"
  },
  {
    "id": "kangaroo-tactical-rig-small",
    "name": "Kangaroo Tactical Rig (Small)",
    "category": "Chest Rig",
    "gridSize": "3x3",
    "capacity": "9",
    "soldBy": "Turncoat R.2",
    "buyPrice": "$260",
    "sellPrice": "$78"
  },
  {
    "id": "kapteis-tactec-chest-rig",
    "name": "Kaptei's TacTec Chest Rig",
    "category": "Chest Rig",
    "gridSize": "3x4",
    "capacity": "10",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$96"
  },
  {
    "id": "mayflower-uw-chest-rig-gen-iv",
    "name": "Mayflower UW Chest Rig Gen IV",
    "category": "Chest Rig",
    "gridSize": "3x5",
    "capacity": "15",
    "soldBy": "Handshake R.4",
    "buyPrice": "$640",
    "sellPrice": "$192"
  },
  {
    "id": "nagas-type-56-ak",
    "name": "Naga's Type 56 AK",
    "category": "Chest Rig",
    "gridSize": "3x3",
    "capacity": "6",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$27"
  },
  {
    "id": "recon-chest-rig",
    "name": "Recon Chest Rig",
    "category": "Chest Rig",
    "gridSize": "4x3",
    "capacity": "12",
    "soldBy": "Handshake R.3",
    "buyPrice": "$440",
    "sellPrice": "$132"
  },
  {
    "id": "small-rig",
    "name": "Small Rig",
    "category": "Chest Rig",
    "gridSize": "2x3",
    "capacity": "4",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$16"
  },
  {
    "id": "tactec-chest-rig",
    "name": "TacTec Chest Rig",
    "category": "Chest Rig",
    "gridSize": "3x4",
    "capacity": "10",
    "soldBy": "Handshake R.2",
    "buyPrice": "$320",
    "sellPrice": "$96"
  },
  {
    "id": "training-mini-rig-big",
    "name": "Training Mini Rig (Big)",
    "category": "Chest Rig",
    "gridSize": "3x3",
    "capacity": "9",
    "soldBy": "Handshake R.2",
    "buyPrice": "$210",
    "sellPrice": "$63"
  },
  {
    "id": "training-mini-rig-small",
    "name": "Training Mini Rig (Small)",
    "category": "Chest Rig",
    "gridSize": "2x3",
    "capacity": "6",
    "soldBy": "Handshake R.1",
    "buyPrice": "$100",
    "sellPrice": "$30"
  },
  {
    "id": "type-56-ak",
    "name": "Type 56 AK",
    "category": "Chest Rig",
    "gridSize": "3x3",
    "capacity": "6",
    "soldBy": "Turncoat R.1",
    "buyPrice": "$90",
    "sellPrice": "$27"
  },
  {
    "id": "type-56-sks",
    "name": "Type 56 SKS",
    "category": "Chest Rig",
    "gridSize": "3x3",
    "capacity": "6",
    "soldBy": "Turncoat R.1",
    "buyPrice": "$70",
    "sellPrice": "$21"
  },
  {
    "id": "universal-chest-bag",
    "name": "Universal Chest Bag",
    "category": "Chest Rig",
    "gridSize": "2x3",
    "capacity": "4",
    "soldBy": "Artisan R.1",
    "buyPrice": "$40",
    "sellPrice": "$12"
  },
  {
    "id": "admin-desk",
    "name": "Admin Desk",
    "category": "Stash Container",
    "gridSize": "4x4",
    "capacity": "15x14",
    "soldBy": "Artisan R.3",
    "buyPrice": "$89,481",
    "sellPrice": "$26,844.3"
  },
  {
    "id": "admin-pouch",
    "name": "Admin Pouch",
    "category": "Stash Container",
    "gridSize": "2x1",
    "capacity": "2x3",
    "soldBy": "Artisan R.2",
    "buyPrice": "$75,881",
    "sellPrice": "$22,764.3"
  },
  {
    "id": "first-aid-case",
    "name": "First Aid Case",
    "category": "Stash Container",
    "gridSize": "3x2",
    "capacity": "6x5",
    "soldBy": "Lab Rat R.2",
    "buyPrice": "$63,380",
    "sellPrice": "$19,014"
  },
  {
    "id": "hand-grenade-storage-box",
    "name": "Hand Grenade Storage Box",
    "category": "Stash Container",
    "gridSize": "3x2",
    "capacity": "5x4",
    "soldBy": "Turncoat R.3",
    "buyPrice": "$75,452",
    "sellPrice": "$22,635.6"
  },
  {
    "id": "hard-case-first-aid-kit",
    "name": "Hard Case First Aid Kit",
    "category": "Stash Container",
    "gridSize": "1x1",
    "capacity": "1x2",
    "soldBy": "Lab Rat R.1",
    "buyPrice": "$90",
    "sellPrice": "$27"
  },
  {
    "id": "harde-case",
    "name": "HARDE Case",
    "category": "Stash Container",
    "gridSize": "7x3",
    "capacity": "10x6",
    "soldBy": "Gunny R.3",
    "buyPrice": "$76,788",
    "sellPrice": "$23,036.4"
  },
  {
    "id": "injector-case",
    "name": "Injector Case",
    "category": "Stash Container",
    "gridSize": "2x1",
    "capacity": "3x3",
    "soldBy": "Lab Rat R.4",
    "buyPrice": "$5,000",
    "sellPrice": "$1,500"
  },
  {
    "id": "iv-truncase",
    "name": "IV Truncase",
    "category": "Stash Container",
    "gridSize": "6x4",
    "capacity": "9x7",
    "soldBy": "Artisan R.2",
    "buyPrice": "$61,665",
    "sellPrice": "$18,499.5"
  },
  {
    "id": "key-case",
    "name": "Key Case",
    "category": "Stash Container",
    "gridSize": "2x1",
    "capacity": "5x3",
    "soldBy": "Artisan R.3",
    "buyPrice": "$6,015",
    "sellPrice": "$1,804.5"
  },
  {
    "id": "kombat-folder",
    "name": "Kombat Folder",
    "category": "Stash Container",
    "gridSize": "2x2",
    "capacity": "4x4",
    "soldBy": "Artisan R.3",
    "buyPrice": "$75,423",
    "sellPrice": "$22,626.9"
  },
  {
    "id": "large-key-case",
    "name": "Large Key Case",
    "category": "Stash Container",
    "gridSize": "3x1",
    "capacity": "6x5",
    "soldBy": "Artisan R.4",
    "buyPrice": "$9,022",
    "sellPrice": "$2,706.6"
  },
  {
    "id": "large-safe",
    "name": "Large Safe",
    "category": "Stash Container",
    "gridSize": "3x4",
    "capacity": "9x12",
    "soldBy": "Vulture R.4",
    "buyPrice": "$105,560",
    "sellPrice": "$31,668"
  },
  {
    "id": "leather-key-holder",
    "name": "Leather Key Holder",
    "category": "Stash Container",
    "gridSize": "1x1",
    "capacity": "3x2",
    "soldBy": "Artisan R.2",
    "buyPrice": "$4,511",
    "sellPrice": "$1,353.3"
  },
  {
    "id": "wallet",
    "name": "Leather Wallet",
    "category": "Stash Container",
    "gridSize": "1x1",
    "capacity": "4",
    "soldBy": "Artisan R.2",
    "buyPrice": "$4,576",
    "sellPrice": "$1,372.8"
  },
  {
    "id": "magazine-case",
    "name": "Magazine Case",
    "category": "Stash Container",
    "gridSize": "3x2",
    "capacity": "6x6",
    "soldBy": "Gunny R.2",
    "buyPrice": "$69,054",
    "sellPrice": "$20,716.2"
  },
  {
    "id": "medical-box",
    "name": "Medical Box",
    "category": "Stash Container",
    "gridSize": "4x3",
    "capacity": "10x8",
    "soldBy": "Lab Rat R.4",
    "buyPrice": "$92,940",
    "sellPrice": "$27,882"
  },
  {
    "id": "metal-ammo-box",
    "name": "Metal Ammo Box",
    "category": "Stash Container",
    "gridSize": "2x2",
    "capacity": "5x4",
    "soldBy": "Turncoat R.2",
    "buyPrice": "$60,278",
    "sellPrice": "$18,083.4"
  },
  {
    "id": "mini-first-aid-kit",
    "name": "Mini First Aid Kit",
    "category": "Stash Container",
    "gridSize": "1x1",
    "capacity": "3x1",
    "soldBy": "Lab Rat R.2",
    "buyPrice": "$200",
    "sellPrice": "$60"
  },
  {
    "id": "mm-ammo-box",
    "name": "MM Ammo Box",
    "category": "Stash Container",
    "gridSize": "3x2",
    "capacity": "7x6",
    "soldBy": "Turncoat R.4",
    "buyPrice": "$90,316",
    "sellPrice": "$27,094.8"
  },
  {
    "id": "mm24-case",
    "name": "MM24 Case",
    "category": "Stash Container",
    "gridSize": "7x5",
    "capacity": "12x10",
    "soldBy": "Artisan R.4",
    "buyPrice": "$104,520",
    "sellPrice": "$31,356"
  },
  {
    "id": "mortar-round-crate",
    "name": "Mortar Round Crate",
    "category": "Stash Container",
    "gridSize": "5x2",
    "capacity": "5x3",
    "soldBy": "Gunny R.3",
    "buyPrice": "$75,547",
    "sellPrice": "$22,664.1"
  },
  {
    "id": "muxxum-rifle-case",
    "name": "Muxxum Rifle Case",
    "category": "Stash Container",
    "gridSize": "8x3",
    "capacity": "12x8",
    "soldBy": "Gunny R.4",
    "buyPrice": "$105,435",
    "sellPrice": "$31,630.5"
  },
  {
    "id": "personal-cooler",
    "name": "Personal Cooler",
    "category": "Stash Container",
    "gridSize": "4x3",
    "capacity": "6x6",
    "soldBy": "Artisan R.2",
    "buyPrice": "$60,237",
    "sellPrice": "$18,071.1"
  },
  {
    "id": "quick-release-first-aid-kit",
    "name": "Quick Release First Aid Kit",
    "category": "Stash Container",
    "gridSize": "1x2",
    "capacity": "2x3",
    "soldBy": "Lab Rat R.3",
    "buyPrice": "$320",
    "sellPrice": "$96"
  },
  {
    "id": "rip-away-emt-pouch",
    "name": "Rip-Away EMT Pouch",
    "category": "Stash Container",
    "gridSize": "1x2",
    "capacity": "9",
    "soldBy": "Lab Rat R.4",
    "buyPrice": "$440",
    "sellPrice": "$132"
  },
  {
    "id": "small-safe",
    "name": "Small Safe",
    "category": "Stash Container",
    "gridSize": "3x2",
    "capacity": "6x4",
    "soldBy": "Vulture R.3",
    "buyPrice": "$75,509",
    "sellPrice": "$22,652.7"
  },
  {
    "id": "tactical-wallet",
    "name": "Tactical Wallet",
    "category": "Stash Container",
    "gridSize": "1x2",
    "capacity": "4x3",
    "soldBy": "Artisan R.4",
    "buyPrice": "$7,532",
    "sellPrice": "$2,259.6"
  },
  {
    "id": "weapon-parts-case",
    "name": "Weapon Parts Case",
    "category": "Stash Container",
    "gridSize": "4x3",
    "capacity": "7x6",
    "soldBy": "Gunny R.2",
    "buyPrice": "$74,442",
    "sellPrice": "$22,332.6"
  }
];

export const ARCHIVE_FIELD_GUIDES: ArchiveFieldGuide[] = [
  {
    "id": "guide-ballistics-penetration",
    "title": "Ballistics, Armor Penetration & Damage Zones",
    "topic": "Ballistics & Armor",
    "summary": "Gray Zone Warfare simulates realistic ballistic trajectories, armor plate coverage (not full-body HP), and internal organ trauma.",
    "bullets": [
      "Plate Carriers only protect the area physically covered by inserted front/back/side ballistic plates (Chest/Heart/Lungs) — shots to the neck, pelvis, face, or exposed flanks bypass NIJ III+/III++ plates completely.",
      "Penetration Check: Match ammo penetration tier against target NIJ rating. M855A1 / M995 (5.56), 7N22 / 7N24 (5.45), M80A1 / M61 (7.62x51), and .300 Blackout AP defeat NIJ III+ and III++ LAF/boss armor.",
      "Hollow-Point (HP / V-Max / Hydra-Shok) & SP rounds cause severe bleeding and wound cavities on unarmored Tier 1 bandits, but stop cleanly against NIJ III+ ceramic/UHMWPE plates.",
      "Suppressors reduce muzzle flash and audible detection radius (crucial after Patch 0.5.1.0 AI sound localization changes). Keep an eye on barrel wear — AP rounds incur higher durability loss per shot."
    ],
    "keywords": [
      "ballistics",
      "ammo",
      "penetration",
      "nij",
      "armor",
      "plate",
      "m855a1",
      "m995",
      "m61",
      "7n24",
      "organ",
      "bullet"
    ]
  },
  {
    "id": "guide-game-modes-conflict-aggressor",
    "title": "Game Modes: Warfare (PvPvE), Joint Ops (PvE), Conflict Zones & Aggressor",
    "topic": "COPs & Map Ops",
    "summary": "Progression is shared across Warfare and Joint Operations, while PvPvE Warfare adds COP capture battles, Conflict Zone circles, and Aggressor penalties.",
    "bullets": [
      "Warfare (PvPvE): Players from rival PMCs can engage anywhere on Lamang (only 3–5 seconds of spawn protection after stepping off a helicopter at an LZ). Both Major & Minor COPs remain defended by AI even when captured.",
      "Joint Operations (PvE) & Custom Servers: Pure co-op PvE against Lamang AI/bosses/smugglers with zero friendly-fire PvP; Custom Servers run via GM invite codes for community events and time out after ~1 hour empty.",
      "Conflict Zones (Red Circles): Appear centered between fighting rival factions or when attacking another faction’s COP (triggered by suppression, damage, or kills) and remain on the map for 5 minutes after the last shot.",
      "Aggressor Status (Friendly Fire Penalty): Suppressing (+5 min), wounding (+10 min), looting (+30 min), or killing (+1 hour max IRL timer, ticks down offline/in Joint Ops) a friendly faction member flags you as Aggressor — you cannot loot your own corpse, allies can freely loot you without penalty, and reporting is disabled."
    ],
    "keywords": [
      "warfare",
      "joint operations",
      "pvp",
      "pve",
      "custom server",
      "conflict zone",
      "red circle",
      "aggressor",
      "friendly fire",
      "teamkill",
      "cop"
    ]
  },
  {
    "id": "guide-ai-stealth-0510",
    "title": "Patch 0.5.1.0 AI Combat Perception, Stealth & Door Rules",
    "topic": "COPs & Map Ops",
    "summary": "Patch 0.5.1.0 overhauled AI detection and combat tactics across Lamang so stealth, suppressors, and flanking reliably pay off.",
    "bullets": [
      "Approximate Noise Detection: AI no longer instantly lock onto your exact coordinates when hearing distant gunshots; sound gives only an approximate bearing until an AI gets direct line of sight.",
      "Crouch/Slow Walk Stealth: Moving slowly drastically reduces the chance enemies hear your footsteps, even inside buildings at close range.",
      "Vocal Callouts & Door Kicking: Spotted enemies shout approximate player positions to nearby allies, lean from cover, fire suppressing bursts when relocating, and kick closed doors open instead of pinning them shut."
    ],
    "keywords": [
      "0.5.1.0",
      "ai",
      "stealth",
      "noise",
      "footsteps",
      "bots",
      "enemy",
      "awareness",
      "door",
      "lean",
      "cover"
    ]
  },
  {
    "id": "guide-medical-triage",
    "title": "Medical Triage: Bleeds, Organ Trauma, Coma & Antidotes",
    "topic": "Medical & Trauma",
    "summary": "Always carry a prioritized 4-step trauma kit in your Secure Lockbox or Belt so bleeds and comas never end a deployment.",
    "bullets": [
      "Priority 1 — Stop Bleeding First: Light bleeds drain blood slowly (Bandages/Hemostatic), Heavy/Arterial bleeds cause rapid coma & death (use CAT Tourniquet first, then bandage or Surgical Kit).",
      "Priority 2 — Fix Pain & Tremors: Painkillers (Ibuprofen, Meloxicam, Morphine) clear blurry vision and ADS sway from limb fractures until you splint.",
      "Priority 3 — Repair Destroyed Organs & Bones: Splints fix fractured limbs; Surgical Kits (SurKit / Suture Kit) repair damaged organs and restore max blood capacity.",
      "Priority 4 — Blood & Radiation/Poison: Blood Bags restore lost blood volume (never transfuse while still bleeding); Antidotes & Charcoal clear poisoning/intoxication, and Ground Zero requires radiation awareness."
    ],
    "keywords": [
      "medical",
      "heal",
      "bleed",
      "bleeding",
      "tourniquet",
      "cat",
      "bandage",
      "surkit",
      "surgery",
      "coma",
      "painkiller",
      "splint",
      "blood",
      "radiation"
    ]
  },
  {
    "id": "guide-repair-durability",
    "title": "Equipment Durability & Repair Kits (Weapons vs Armor)",
    "topic": "Weapons & Gear",
    "summary": "Weapons, plate carriers, vests, helmets, and NVGs degrade with shots fired and hits absorbed; repairs restore usable condition but permanently reduce max durability.",
    "bullets": [
      "Weapon Repair Kits (Sold by Gunny): Firearm Cleaning Set (Gunny R.2 · +85% efficiency · 100 charges), Firearm Tool Set (Gunny R.3 · +85% · 500 charges), Gunsmith Tool Set (Gunny R.3 · +90% · 2,000 charges — priced above Firearm Tool Set since 0.5.1.0).",
      "Equipment Repair Kits (Sold by Handshake): Equipment Repair Essentials Kit (Handshake R.2 · +85–90% · 150 charges), Tactical Equipment Repair Kit (Handshake R.4 · +85% · 400 charges), Specialized Equipment Repair Kit (Handshake R.3 · +90% · 3,000 charges).",
      "Max Durability Wear: Every field or stash repair slightly lowers the item’s maximum durability ceiling — swap worn-out ceramic plates or barrels once max durability drops critically."
    ],
    "keywords": [
      "repair",
      "durability",
      "kit",
      "fix",
      "gunsmith",
      "cleaning",
      "tool set",
      "wear",
      "broken"
    ]
  },
  {
    "id": "guide-hideout-economy-0510",
    "title": "Hideout Pipeline, Disassembly & 0.5.1.0 Economy Rules",
    "topic": "Hideout & Hacking",
    "summary": "Update 0.5 introduced the Hideout (Utility Room, Electronics Workshop, Laboratory), tightened in 0.5.1.0 with faster timers and smaller material footprints.",
    "bullets": [
      "3 Core Hideout Rooms: Utility Room supplies power & heat; Electronics Workshop disassembles electronics into Server CPUs, GPUs, Transceivers & crafts Basic/Advanced/Superior Hacking Tools; Laboratory synthesizes medical/chemical compounds.",
      "Patch 0.5.1.0 Economy Buffs: Reduced crafting and disassembly wait times across all complexity tiers, reduced inventory grid size and weight on many building/disassembly materials, increased world spawns for Plastics & Chemicals, and raised sell prices for hideout products & smuggling backpacks.",
      "High-Value Smuggler & Disassembly Targets: Hunt Manpack Tactical Radios (Transceiver/Electronic Components), Portable SATCOM Terminals, Satellite Phones (3+ yields), Encrypted Hard Drives, Last Line Defense Containers (RLSL-1), and Chemical Containment Containers (Lakevale Sanctuary)."
    ],
    "keywords": [
      "hideout",
      "disassembly",
      "craft",
      "utility",
      "workshop",
      "laboratory",
      "electronics",
      "plastics",
      "chemicals",
      "smuggler",
      "0.5.1.0",
      "economy"
    ]
  },
  {
    "id": "guide-hacking-puzzle-doors",
    "title": "Hacking Tools & Generator / Puzzle Doors (0.5+)",
    "topic": "Hideout & Hacking",
    "summary": "Many high-tier Update 0.5 rooms (RLSL-1 Telescope Building, Lakevale Sanctuary, Northern Reach, Midnight Sapphire) require BOTH power restoration and a tiered Hacking Tool.",
    "bullets": [
      "3 Hacking Tool Tiers: Basic Hacking Tool (unlock via \"Open Channels\" · Handshake R.2), Advanced Hacking Tool (\"Wider Reach\" · Handshake R.3), and Superior Hacking Tool (\"Unrestricted Access\" · Handshake R.4). Each weighs 1 kg (1x2 slots) and is crafted in the Electronics Workshop.",
      "Power Before Hack: Unpowered biometric/card-reader doors (such as RLSL-1 Telescope Building, Villa Marta at Midnight Sapphire, and Lakevale Sanctuary labs) require refueling/starting the site generator or flipping electrical breakers BEFORE your Hacking Tool or Keycard works.",
      "RLSL-1 Sewer Door Note: Patch 0.5.1.0 fixed the previously stuck sewer door beneath the RLSL-1 Telescope Building so breach routes work cleanly."
    ],
    "keywords": [
      "hacking",
      "hack",
      "puzzle door",
      "generator",
      "telescope",
      "rlsl-1",
      "sewer door",
      "open channels",
      "wider reach",
      "unrestricted access",
      "villa marta"
    ]
  },
  {
    "id": "guide-xp-vendors-trading",
    "title": "Experience (XP), Level Unlocks & Vendor Reputation",
    "topic": "Weapons & Gear",
    "summary": "Tasks are the fastest source of XP and Vendor Rep; exploration, COP captures, and high-tier kills supplement progression up to Level 50.",
    "bullets": [
      "Combat & Map XP Actions: Killing Other PMCs (+200 XP), Capturing Major COPs (+150 XP) or Discovering LZs (+150 XP), Capturing Minor COPs (+50 XP), Discovering POIs (+30 XP), LAF Commanders (+30 XP), LAF Soldiers (+15 XP), Tier 2–3 Rebels (+10 XP), Tier 1 Insurgents (+5 XP).",
      "7 Specialized Vendors: Handshake (armor, helmets, rigs, backpacks, headsets, repair kits), Gunny (NATO weapons, 5.56, optics, mortar rounds, weapon repair kits), Lab Rat (meds, provisions), Artisan (AK/Eastern weapons, 7.62), Turncoat (AK-12/15/19, armor, grenades), Banshee (.300 BLK, headsets, binoculars/LRF, containers), Vulture (buys valuables, hidden black-market vendor).",
      "Level Rewards: Character ranks (Level 1 to 50) unlock cosmetic apparel, gloves, boots, helmets, and tactical clothing."
    ],
    "keywords": [
      "xp",
      "experience",
      "level",
      "rank",
      "vendor",
      "reputation",
      "trading",
      "handshake",
      "gunny",
      "turncoat",
      "banshee",
      "artisan",
      "lab rat",
      "vulture"
    ]
  }
];

export const ARCHIVE_PATCH_NOTES: ArchivePatchEntry[] = [
  {
    "version": "0.5.1.1",
    "date": "10 November 2026",
    "title": "Hotfix 0.5.1.1 (Current Live Build)",
    "highlights": [
      "Fixed a game crash that could occur when a player with a flipped magnifier left the game.",
      "Improved game server stability to prevent a rare server crash."
    ],
    "sections": [
      {
        "heading": "Stability & Crash Fixes",
        "items": [
          "Fixed a client crash when disconnecting or leaving a server while using a flipped optic magnifier.",
          "Server stability improvements preventing rare instance crashes."
        ]
      }
    ]
  },
  {
    "version": "0.5.1.0",
    "date": "05 November 2026",
    "title": "Patch 0.5.1.0 — AI Combat Overhaul & Hideout Economy Rebalance",
    "highlights": [
      "40+ AI combat behavior improvements: AI no longer pinpoint your exact coordinates from distant gunfire and must visually spot you first.",
      "Slow movement significantly reduces enemy footstep detection even at close range; AI callouts share approximate positions audibly.",
      "AI combat movement reworked: better leaning from cover, return fire when repositioning, and kicking doors open instead of blocking doorways.",
      "Hideout Economy Rebalance: faster crafting and disassembly times, smaller/lighter building & disassembly materials, better hideout handover rewards, higher smuggling task & backpack sell prices, and boosted Plastics/Chemicals spawns.",
      "World fixes across 11 regions including the RLSL-1 Telescope sewer door fix, Lakevale Sanctuary SATCOM & mutated tissue fixes, Midnight Sapphire Villa Marta power reader message, and Fort Narith underground hangar invisible wall fix."
    ],
    "sections": [
      {
        "heading": "Key Changes to AI Combat Behavior",
        "items": [
          "AI NPCs are less accurate when assessing player positions from distant noise; exact coordinates are only learned when the player is visually spotted.",
          "Updated AI reaction times to footsteps and gunshots to feel more human-like and vary across enemy tiers.",
          "Moving slowly reduces the chance enemies hear player footsteps even at close range.",
          "AI NPCs share approximate player positions by shouting callouts to nearby squadmates.",
          "Improved cover usage: AI lean when shooting, use return fire while shifting cover, and kick doors open realistically instead of holding doors shut."
        ]
      },
      {
        "heading": "Hideout Economy Rebalance",
        "items": [
          "Improved rewards from Hideout handover tasks and increased sell prices of Hideout-produced items.",
          "Increased rewards from smuggling tasks and increased sell prices of smuggling backpacks.",
          "Reduced production and disassembly durations across all complexity tiers.",
          "Shrunk grid size and reduced weight of selected building materials and disassembly items.",
          "Boosted world spawn rates of Plastics and Chemical components and added additional spawn locations."
        ]
      },
      {
        "heading": "Gameplay, Medical, Tasks & Squad Fixes",
        "items": [
          "Gunsmith Tool Set price adjusted to sit above Firearm Tool Set; fixed repair timer infinite loop and exact-cash repair block.",
          "Fixed Ground Zero radiation stopping server-wide after a player death.",
          "Fixed blood bag/bandage use counts when healing squadmates, missing trap wound descriptions, and false 100% organ damage UI.",
          "Fixed Chameleon & blocked task chains, missing KIA notification, smuggling bag removal bug, Turncoat briefcase text, and Hazardous Treasures now clearly states a Hacking Tool is required.",
          "Fixed squad invite \"different game version\" bug, Conflict Zones visibility after joining mid-match, and map zoom/pan lag with many POIs unlocked."
        ]
      },
      {
        "heading": "World & Map Fixes (11 Regions)",
        "items": [
          "RLSL-1: Fixed the sewer door under the Telescope Building that could not be opened; fixed living quarters railing blocking bullets and stuck spots.",
          "Lakevale Sanctuary: Fixed SATCOM Terminal not spawning at its location, missing mutated tissue in the morgue lab, barbed-wire mesh fences, and missing window collision.",
          "Midnight Sapphire & Villas: Villa Marta card reader now displays a message when power is off; fixed Villa Erica stuck spot and floating loot.",
          "Fort Narith, Tiger Bay, YBL-1, Hunter's Paradise, Pha Lang Airfield, Sawmill & Starter Towns: Fixed stuck spots, floating loot, underground hangar bullet-blocking wall, and Tiger Bay makeshift lab fridge spawns."
        ]
      }
    ]
  },
  {
    "version": "0.5.0.2",
    "date": "29 October 2026",
    "title": "Hotfix 0.5.0.2",
    "highlights": [
      "Fixed faction sign-up bonus exploit allowing ineligible or repeated claims.",
      "Fixed cloud shadow ground flickering on High and Medium graphics presets.",
      "Added warning for AMD Radeon RX 9000 series users on driver 26.10.1+ recommending 26.8.1.",
      "Improved server stability and fixed \"No valid operator\" join errors for returning characters."
    ],
    "sections": [
      {
        "heading": "Fixes & Stability",
        "items": [
          "Blocked repeated/ineligible faction sign-up bonus claims.",
          "Fixed High/Medium preset cloud shadow ground flicker.",
          "Added AMD Radeon RX 9000 driver 26.10.1+ crash warning (recommending 26.8.1).",
          "Resolved \"No valid operator\" server join failure from previous-season characters."
        ]
      }
    ]
  },
  {
    "version": "0.5.0.1",
    "date": "23 October 2026",
    "title": "Hotfix 0.5.0.1",
    "highlights": [
      "Fixed season transition resetting non-DLC players' rank-unlocked stash space back to base size.",
      "Fixed queue-to-server connection failures."
    ],
    "sections": [
      {
        "heading": "Hotfix Notes",
        "items": [
          "Restored extra stash space earned via rank progression for non-DLC accounts after the 0.5 season transition.",
          "Fixed failures when connecting to a server after waiting in queue."
        ]
      }
    ]
  },
  {
    "version": "0.5.0.0",
    "date": "22 October 2026",
    "title": "Update 0.5.0.0 — Rogue Ops (Major Alpha Release)",
    "highlights": [
      "Transitioned Gray Zone Warfare from Pre-Alpha to Alpha with the Hideout system (Utility Room, Electronics Workshop, Laboratory), crafting, and disassembly.",
      "Opened Tier 4 Ground Zero perimeter POIs: RLSL-1 Radio Observatory, Lakevale Sanctuary (Asylum), and Northern Reach, plus drug shacks and Vulture hideouts.",
      "Added 7 weapon families (Steyr AUG / AUG A3, Benelli M4, G3, G36, FAMAS, UMP45, Glock 18C), 370+ weapon parts, 6 camo skins, 22 collimators, and 4x/6x magnifiers.",
      "Introduced Hacking Tools (Basic, Advanced, Superior) and multi-step Generator + Sewer/Card Reader puzzle doors.",
      "Added Rogue PMC smuggling operations, up to 4 playable characters per account, reworked ballistic suppression, and HDR support."
    ],
    "sections": [
      {
        "heading": "Hideout, Hacking & Rogue Operations",
        "items": [
          "Personal Hideout featuring Utility Room (power), Electronics Workshop (disassembly & hacking tools), and Laboratory (medical/chemical synthesis).",
          "3-tier Hacking Tools (Basic, Advanced, Superior) unlocked via tasks and crafted from disassembled electronics.",
          "Multi-step Generator + Power + Hacking puzzle doors at RLSL-1, Lakevale Sanctuary, Northern Reach, and Midnight Sapphire.",
          "Smuggling contracts, Squad Strike missions, and high-value smuggling backpacks."
        ]
      },
      {
        "heading": "New Tier 4 Map Zones & Arsenal",
        "items": [
          "Tier 4 POIs: RLSL-1 (Radio Observatory), Lakevale Sanctuary (Asylum), and Northern Reach (Military Research Site).",
          "7 New Weapons: Steyr AUG / A3, Benelli M4, G3 (and Zero Hour), G36, FAMAS, UMP45, Glock 18C — plus 370+ weapon parts, 22 new collimators, 4x/6x magnifiers, and 6 camo finishes.",
          "Multi-character slots (up to 4 operators per account) and soft wipe retaining rank, apparel unlocks, and progression."
        ]
      }
    ]
  },
  {
    "version": "0.5.2.0 (Preview)",
    "date": "Announced 25 November 2026 · Upcoming",
    "title": "Upcoming Patch 0.5.2.0 — \"Breakthrough\" (In Development)",
    "highlights": [
      "Officially teased by MADFINGER Games on November 25, 2026 (no live release date yet).",
      "Focuses on Authentic Combat Rework: faster tactical leaning, refined movement, more authentic weapon handling, and dynamic suppression.",
      "Also previews an enhanced health system, smarter AI behaviors, redesigned Quick Action Menu, and looting improvements."
    ],
    "sections": [
      {
        "heading": "Official Preview Roadmap (Not Yet Live)",
        "items": [
          "Faster tactical leaning for quicker corner peeking and refined tactical movement.",
          "More authentic weapon handling and dynamic suppression effects.",
          "Upcoming enhancements to the health system, AI combat behavior, Quick Action Menu, and looting."
        ]
      }
    ]
  }
];

export const ARCHIVE_BOSSES: ArchiveBossEntry[] = [
  {
    "id": "naga",
    "name": "Naga",
    "fullName": "Leader of Naga Pirates",
    "faction": "Naga Pirates",
    "region": "Ban Pa",
    "spawnLocations": [
      "Ban Pa village & coastal compound"
    ],
    "notableGear": [
      "Naga's Type 51"
    ],
    "linkedTasks": [
      "Ban Pa elimination tasks"
    ]
  },
  {
    "id": "grin",
    "name": "Grin",
    "fullName": "Malo \"Grin\" Luangrath",
    "faction": "Sifa Syndicate",
    "region": "Blue Lagoon",
    "spawnLocations": [
      "Blue Lagoon resort compound",
      "Kahok Car Repair (Grid 182:126)",
      "Kapu Boat Rental (Grid 209:122)"
    ],
    "notableGear": [
      "Grin's Colt 1911 Commander (.45 ACP)"
    ],
    "linkedTasks": [
      "Deep Waters",
      "Like a Boss - Grin's 1911 C"
    ]
  },
  {
    "id": "buran",
    "name": "Buran",
    "fullName": "LAF Commander Buran",
    "faction": "Lamang Armed Forces (LAF)",
    "region": "Fort Narith",
    "spawnLocations": [
      "Fort Narith HQ & military compound"
    ],
    "notableGear": [
      "Buran's AK-74N (5.45x39mm)"
    ],
    "linkedTasks": [
      "Fort Narith commander / boss tasks"
    ]
  },
  {
    "id": "viper",
    "name": "Viper",
    "fullName": "Phasuk Aawut",
    "faction": "Viper Tactical Services",
    "region": "Pha Lang Airfield",
    "spawnLocations": [
      "Pha Lang Airfield main compound",
      "Small Marketplace west of COP Falcon",
      "Na Xieng Farms north of Airfield / west of Papa-2 LZ"
    ],
    "notableGear": [
      "Viper's Colt 1911 Commander",
      "Viper's Razor Slim Electronic Muff",
      "M4A1 (ACOG TA01NSN 4x32)"
    ],
    "linkedTasks": [
      "Pha Lang Airfield boss tasks"
    ]
  },
  {
    "id": "broker",
    "name": "Broker",
    "fullName": "Hoang Lam Nam",
    "faction": "Lotus Circle",
    "region": "Hunter's Paradise",
    "spawnLocations": [
      "Hunter's Paradise shooting range & main clubhouse"
    ],
    "notableGear": [
      "Broker's M9A1 (9x19mm)"
    ],
    "linkedTasks": [
      "One Shot, One Kill"
    ]
  },
  {
    "id": "bloodhound",
    "name": "Bloodhound",
    "fullName": "Unknown",
    "faction": "Local Thugs / Rebels",
    "region": "Kiu Vongsa",
    "spawnLocations": [
      "Kiu Vongsa Marketplace"
    ],
    "notableGear": [
      "Bloodhound's M-201C"
    ],
    "linkedTasks": [
      "Final Liberation"
    ]
  },
  {
    "id": "yen",
    "name": "Yen",
    "fullName": "Unknown",
    "faction": "Lamang Armed Forces (LAF)",
    "region": "Midnight Sapphire",
    "spawnLocations": [
      "Midnight Sapphire Hotel rooftop",
      "Golf Club (Grid 169:167, west of Hotel)",
      "Whitewater Villas (Grid 173:165, east of Hotel)"
    ],
    "notableGear": [
      "Yen's M700 (7.62x51mm)",
      "Yen's Active headset GSSh-01"
    ],
    "linkedTasks": [
      "Final Liberation",
      "Like a Boss - Yen's M700"
    ]
  },
  {
    "id": "chaonai",
    "name": "Chaonai",
    "fullName": "Unknown",
    "faction": "Local Thugs / Rebels",
    "region": "Nam Thaven",
    "spawnLocations": [
      "Nam Thaven Marketplace"
    ],
    "notableGear": [
      "Chaonai's Type 51 (7.62x25mm)"
    ],
    "linkedTasks": [
      "Nam Thaven boss tasks"
    ]
  },
  {
    "id": "golden-boy",
    "name": "Golden Boy",
    "fullName": "Unknown",
    "faction": "Local Thugs / Rebels",
    "region": "Pha Lang",
    "spawnLocations": [
      "Pha Lang town marketplace"
    ],
    "notableGear": [
      "Golden Boy's Colt 1911 (.45 ACP)"
    ],
    "linkedTasks": [
      "Pha Lang boss tasks"
    ]
  },
  {
    "id": "kaptei",
    "name": "Kaptei",
    "fullName": "Unknown",
    "faction": "Rebels / Insurgents",
    "region": "Sawmill",
    "spawnLocations": [
      "Sawmill main compound",
      "LAF Radio Tower (Grid 140:139, south of Sawmill)",
      "Hidden Outpost (Grid 140:149, NW of Echo-3 LZ)"
    ],
    "notableGear": [
      "Kaptei's Glock 17 (9x19mm)"
    ],
    "linkedTasks": [
      "Timber",
      "Like a Boss - Kaptei's Glock 17"
    ]
  },
  {
    "id": "colonel",
    "name": "Colonel",
    "fullName": "LAF Colonel",
    "faction": "Lamang Armed Forces (LAF)",
    "region": "Tiger Bay",
    "spawnLocations": [
      "Tiger Bay Central Mall / LAF HQ sector"
    ],
    "notableGear": [
      "Colonel's Type 51",
      "Colonel's Active headset GSSh-01"
    ],
    "linkedTasks": [
      "Tiger Bay boss tasks"
    ]
  },
  {
    "id": "firebrand",
    "name": "Firebrand",
    "fullName": "LLA Insurgent Commander",
    "faction": "Lamang Liberation Army",
    "region": "YBL-1",
    "spawnLocations": [
      "YBL-1 Underground Bunker",
      "FN-3 Auxiliary Base (Grid 150:134, north of YBL-1)",
      "YBL-West (Grid 138:120)"
    ],
    "notableGear": [
      "Firebrand's AKS-74U (5.45x39mm)"
    ],
    "linkedTasks": [
      "Final Liberation",
      "Like a Boss - Firebrand's AKS-74u"
    ]
  }
];

export const ARCHIVE_OPTICS_DEVICES: ArchiveOpticDeviceEntry[] = [
  {
    "id": "acog-ta01nsn-4x32-assault-scope",
    "name": "ACOG TA01NSN 4x32 Assault Scope",
    "category": "Scope",
    "magnification": "4x",
    "sightingRange": "600m",
    "handlingMod": "-8 %",
    "modes": null,
    "manufacturer": "Trijicon",
    "weight": "0.424 kg",
    "soldBy": "Gunny R.2",
    "buyPrice": null
  },
  {
    "id": "kaps-classic-4x36-oc",
    "name": "Kaps Classic 4x36 OC",
    "category": "Scope",
    "magnification": "4x",
    "sightingRange": "250m",
    "handlingMod": null,
    "modes": null,
    "manufacturer": "Kaps Optics",
    "weight": "0.410 kg",
    "soldBy": "Banshee R.1",
    "buyPrice": null
  },
  {
    "id": "mosin-nagant-pu-3.5x22-scope",
    "name": "Mosin-Nagant PU 3.5x22 Scope",
    "category": "Scope",
    "magnification": "3.5x",
    "sightingRange": "1,300m",
    "handlingMod": "-8 %",
    "modes": null,
    "manufacturer": "Kalashnikov Concern",
    "weight": "0.600 kg",
    "soldBy": "Artisan R.2",
    "buyPrice": null
  },
  {
    "id": "npz-pso-3-9x24",
    "name": "NPZ PSO 3-9x24",
    "category": "Scope",
    "magnification": "3-9x",
    "sightingRange": "900m",
    "handlingMod": null,
    "modes": null,
    "manufacturer": "General East",
    "weight": "0.997 kg",
    "soldBy": "Loot only",
    "buyPrice": null
  },
  {
    "id": "pso-1-4x24",
    "name": "PSO-1 4x24",
    "category": "Scope",
    "magnification": "4x",
    "sightingRange": "500m",
    "handlingMod": null,
    "modes": null,
    "manufacturer": "General East",
    "weight": "0.616 kg",
    "soldBy": "Artisan R.4",
    "buyPrice": "$1,990"
  },
  {
    "id": "razor-1-10x-rifle-scope",
    "name": "RAZOR 1-10x Rifle Scope",
    "category": "Scope",
    "magnification": "1x-10xx",
    "sightingRange": "1,000m",
    "handlingMod": null,
    "modes": null,
    "manufacturer": "Vortex Optics",
    "weight": "0.609 kg",
    "soldBy": "Loot / Tasks",
    "buyPrice": "$???"
  },
  {
    "id": "razor-1-6x-rifle-scope",
    "name": "RAZOR 1-6x Rifle Scope",
    "category": "Scope",
    "magnification": "1x-6xx",
    "sightingRange": "1,000m",
    "handlingMod": "-8 %",
    "modes": null,
    "manufacturer": "Vortex Optics",
    "weight": "0.610 kg",
    "soldBy": "Banshee R.4",
    "buyPrice": "$3,250"
  },
  {
    "id": "specterdr-1-4x-assault-scope",
    "name": "SpecterDR 1-4x Assault Scope",
    "category": "Scope",
    "magnification": "1x-4xx",
    "sightingRange": "600m",
    "handlingMod": null,
    "modes": null,
    "manufacturer": "ELCAN",
    "weight": "0.450 kg",
    "soldBy": "Gunny R.3",
    "buyPrice": null
  },
  {
    "id": "viper-pst-gen-ii-5-25x50-rifle-scope",
    "name": "Viper PST Gen II 5-25x50 Rifle Scope",
    "category": "Scope",
    "magnification": "5x-25xx",
    "sightingRange": "1,000m",
    "handlingMod": "-12 %",
    "modes": null,
    "manufacturer": "Vortex optics",
    "weight": "0.885 kg",
    "soldBy": "Banshee R.4",
    "buyPrice": "$2,468"
  },
  {
    "id": "vortex-spitfire-hd-gen-ii-5x",
    "name": "Vortex Spitfire HD Gen II 5x",
    "category": "Scope",
    "magnification": "5x",
    "sightingRange": "600m",
    "handlingMod": null,
    "modes": null,
    "manufacturer": "Vortex Optics",
    "weight": "0.292 kg",
    "soldBy": "Gunny R.4",
    "buyPrice": null
  },
  {
    "id": "vudu-1-6x24-ffp-rifle-scope",
    "name": "Vudu 1-6x24 FFP Rifle Scope",
    "category": "Scope",
    "magnification": "1-6x",
    "sightingRange": "1000m",
    "handlingMod": "-8.0 %",
    "modes": null,
    "manufacturer": "Eotech",
    "weight": "0.570 kg",
    "soldBy": "Loot Only",
    "buyPrice": null
  },
  {
    "id": "vudu-3.5-18x50-ffp-rifle-scope",
    "name": "Vudu 3.5-18x50 FFP Rifle Scope",
    "category": "Scope",
    "magnification": "3.5x-18xx",
    "sightingRange": "1,000m",
    "handlingMod": "-12 %",
    "modes": null,
    "manufacturer": "Eotech",
    "weight": "0.952 kg",
    "soldBy": "Banshee R.3",
    "buyPrice": "$2,420"
  },
  {
    "id": "503cu-micro-sight",
    "name": "503CU Micro Sight",
    "category": "Collimator / Red Dot",
    "magnification": "1x",
    "sightingRange": "300m",
    "handlingMod": null,
    "modes": null,
    "manufacturer": "Holosun",
    "weight": "0.085 kg",
    "soldBy": "Gunny R.3",
    "buyPrice": null
  },
  {
    "id": "510c-reflex-sight",
    "name": "510C Reflex Sight",
    "category": "Collimator / Red Dot",
    "magnification": "1x",
    "sightingRange": "300m",
    "handlingMod": null,
    "modes": null,
    "manufacturer": "Holosun",
    "weight": "0.140 kg",
    "soldBy": "Gunny R.4",
    "buyPrice": null
  },
  {
    "id": "aimpoint-acro-p-2",
    "name": "Aimpoint ACRO P-2",
    "category": "Collimator / Red Dot",
    "magnification": "1x",
    "sightingRange": "300m",
    "handlingMod": null,
    "modes": null,
    "manufacturer": "Aimpoint",
    "weight": "0.060 kg",
    "soldBy": "Banshee R.3",
    "buyPrice": "$1,015"
  },
  {
    "id": "aimpoint-micro-h-2",
    "name": "Aimpoint Micro H-2",
    "category": "Collimator / Red Dot",
    "magnification": "1x",
    "sightingRange": "300m",
    "handlingMod": null,
    "modes": null,
    "manufacturer": "Aimpoint",
    "weight": "0.093 kg",
    "soldBy": "Gunny R3",
    "buyPrice": null
  },
  {
    "id": "aimpoint-micro-t-2",
    "name": "Aimpoint Micro T-2",
    "category": "Collimator / Red Dot",
    "magnification": "1x",
    "sightingRange": "300m",
    "handlingMod": null,
    "modes": null,
    "manufacturer": "Aimpoint",
    "weight": "0.084 kg",
    "soldBy": "Banshee R2",
    "buyPrice": null
  },
  {
    "id": "hs507c-x2-reflex-sight",
    "name": "HS507C X2 Reflex Sight",
    "category": "Collimator / Red Dot",
    "magnification": "1x",
    "sightingRange": "100m",
    "handlingMod": null,
    "modes": null,
    "manufacturer": "Holosun",
    "weight": "0.045 kg",
    "soldBy": "Banshee R.3",
    "buyPrice": "$989"
  },
  {
    "id": "hws-exps2-holographic-sight-1-dot",
    "name": "HWS EXPS2 Holographic Sight (1-Dot)",
    "category": "Collimator / Red Dot",
    "magnification": "1x",
    "sightingRange": "300m",
    "handlingMod": null,
    "modes": null,
    "manufacturer": "Eotech",
    "weight": "0.318 kg",
    "soldBy": "Gunny R.2",
    "buyPrice": null
  },
  {
    "id": "hws-exps2-holographic-sight-circle-1-dot",
    "name": "HWS EXPS2 Holographic Sight (Circle 1-Dot)",
    "category": "Collimator / Red Dot",
    "magnification": "1x",
    "sightingRange": "300m",
    "handlingMod": null,
    "modes": null,
    "manufacturer": "Eotech",
    "weight": "0.318 kg",
    "soldBy": "Loot / Tasks",
    "buyPrice": null
  },
  {
    "id": "hws-exps2-holographic-sight-circle-2-dot-fde",
    "name": "HWS EXPS2 Holographic Sight (Circle 2-Dot) (FDE)",
    "category": "Collimator / Red Dot",
    "magnification": "1x",
    "sightingRange": "???m",
    "handlingMod": "??? %",
    "modes": null,
    "manufacturer": "EOTECH",
    "weight": "??? kg",
    "soldBy": "Loot / Tasks",
    "buyPrice": null
  },
  {
    "id": "hws-exps3-holographic-sight-circle-1-dot",
    "name": "HWS EXPS3 Holographic Sight (Circle 1-Dot)",
    "category": "Collimator / Red Dot",
    "magnification": "1x",
    "sightingRange": "300m",
    "handlingMod": null,
    "modes": null,
    "manufacturer": "EOTECH",
    "weight": ".318 kg",
    "soldBy": "Banshee R.3",
    "buyPrice": "$1,043"
  },
  {
    "id": "hws-exps3-holographic-sight-circle-2-dot",
    "name": "HWS EXPS3 Holographic Sight (Circle 2-Dot)",
    "category": "Collimator / Red Dot",
    "magnification": "1x",
    "sightingRange": "300m",
    "handlingMod": null,
    "modes": null,
    "manufacturer": "Eotech",
    "weight": "0.318 kg",
    "soldBy": "Loot only",
    "buyPrice": null
  },
  {
    "id": "kobra-ekp-1s-03-red-dot-sight",
    "name": "Kobra EKP-1S-03 Red Dot Sight",
    "category": "Collimator / Red Dot",
    "magnification": "1x",
    "sightingRange": "300m",
    "handlingMod": null,
    "modes": null,
    "manufacturer": "Kobra Axion",
    "weight": "0.410 kg",
    "soldBy": "Turncoat R.2",
    "buyPrice": "$678"
  },
  {
    "id": "kobra-ekp-8-18-red-dot-sight",
    "name": "Kobra EKP-8-18 Red Dot Sight",
    "category": "Collimator / Red Dot",
    "magnification": "1x",
    "sightingRange": "300m",
    "handlingMod": null,
    "modes": null,
    "manufacturer": "Kobra Axion",
    "weight": "0.410 kg",
    "soldBy": "Loot only",
    "buyPrice": null
  },
  {
    "id": "micro-t-1-red-dot-sight",
    "name": "Micro T-1 Red Dot Sight",
    "category": "Collimator / Red Dot",
    "magnification": "1x",
    "sightingRange": "300m",
    "handlingMod": null,
    "modes": null,
    "manufacturer": "Aimpoint",
    "weight": "0.086 kg",
    "soldBy": "Gunny R.2",
    "buyPrice": null
  },
  {
    "id": "micro-t-2-red-dot-sight",
    "name": "Micro T-2 Red Dot Sight",
    "category": "Collimator / Red Dot",
    "magnification": "1x",
    "sightingRange": "300m",
    "handlingMod": null,
    "modes": null,
    "manufacturer": "Aimpoint",
    "weight": "0.084 kg",
    "soldBy": "Loot only",
    "buyPrice": null
  },
  {
    "id": "okp7-red-dot-sight",
    "name": "OKP7 Red Dot Sight",
    "category": "Collimator / Red Dot",
    "magnification": "1x",
    "sightingRange": "300m",
    "handlingMod": null,
    "modes": null,
    "manufacturer": "General East",
    "weight": "0.340 kg",
    "soldBy": "Artisan R.2",
    "buyPrice": null
  },
  {
    "id": "pilad-p1x42-red-dot-sight",
    "name": "Pilad P1x42 Red Dot Sight",
    "category": "Collimator / Red Dot",
    "magnification": "1x",
    "sightingRange": "300m",
    "handlingMod": "??? %",
    "modes": null,
    "manufacturer": "VOMZ",
    "weight": "0.160 kg",
    "soldBy": "Loot / Tasks",
    "buyPrice": null
  },
  {
    "id": "pilad-р2.5х24l-brevis-assault-scope",
    "name": "Pilad Р2.5х24L Brevis Assault Scope",
    "category": "Collimator / Red Dot",
    "magnification": "1x",
    "sightingRange": "600m",
    "handlingMod": null,
    "modes": null,
    "manufacturer": "VOMZ",
    "weight": "0.290 kg",
    "soldBy": "Turncoat R.2",
    "buyPrice": "$468"
  },
  {
    "id": "pk-01-vs-red-dot-sight",
    "name": "PK-01 VS Red Dot Sight",
    "category": "Collimator / Red Dot",
    "magnification": "1x",
    "sightingRange": "300m",
    "handlingMod": null,
    "modes": null,
    "manufacturer": "Belomo",
    "weight": "0.900 kg",
    "soldBy": "Artisan R.2",
    "buyPrice": "$386"
  },
  {
    "id": "viper-red-dot-sight",
    "name": "Viper Red Dot Sight",
    "category": "Collimator / Red Dot",
    "magnification": "1x",
    "sightingRange": "100m",
    "handlingMod": null,
    "modes": null,
    "manufacturer": "Vortex optics",
    "weight": "0.031 kg",
    "soldBy": "Banshee R.2",
    "buyPrice": "$578"
  },
  {
    "id": "m1050-lrf-rangefinder",
    "name": "M1050 LRF Rangefinder",
    "category": "Rangefinder",
    "magnification": null,
    "sightingRange": null,
    "handlingMod": null,
    "modes": "Slots 1x2",
    "manufacturer": "Safran Group",
    "weight": "1.270kg",
    "soldBy": "Banshee (lvl 4)",
    "buyPrice": null
  },
  {
    "id": "m1050r-binocular",
    "name": "M1050R Binocular",
    "category": "Binoculars",
    "magnification": null,
    "sightingRange": null,
    "handlingMod": null,
    "modes": null,
    "manufacturer": "Steiner",
    "weight": "1.000kg",
    "soldBy": "Banshee R.3",
    "buyPrice": null
  },
  {
    "id": "m830r-binocular",
    "name": "M830R Binocular",
    "category": "Binoculars",
    "magnification": null,
    "sightingRange": null,
    "handlingMod": null,
    "modes": null,
    "manufacturer": "Steiner",
    "weight": "0.530kg",
    "soldBy": "Banshee R.1",
    "buyPrice": null
  },
  {
    "id": "triumph-hd-binocular",
    "name": "Triumph HD binocular",
    "category": "Binoculars",
    "magnification": null,
    "sightingRange": null,
    "handlingMod": null,
    "modes": null,
    "manufacturer": "Vortex optics",
    "weight": "0.650kg",
    "soldBy": "Banshee R.2",
    "buyPrice": null
  },
  {
    "id": "ade-advanced-red-laser",
    "name": "ADE Advanced Red Laser",
    "category": "Tactical Device",
    "magnification": null,
    "sightingRange": null,
    "handlingMod": "-1 %",
    "modes": "Red laser",
    "manufacturer": "ADE Advanced Optics",
    "weight": "0.032 kg",
    "soldBy": "Gunny R.2",
    "buyPrice": null
  },
  {
    "id": "dbal-i2",
    "name": "DBAL-I2",
    "category": "Tactical Device",
    "magnification": null,
    "sightingRange": null,
    "handlingMod": null,
    "modes": "Red Laser IR Laser",
    "manufacturer": "Steiner",
    "weight": "0.227 kg",
    "soldBy": "Banshee R.2",
    "buyPrice": "$900"
  },
  {
    "id": "ncstar-compact-green-laser",
    "name": "NcStar Compact Green Laser",
    "category": "Tactical Device",
    "magnification": null,
    "sightingRange": null,
    "handlingMod": "-1 %",
    "modes": "Green laser",
    "manufacturer": "NcStar",
    "weight": "0.093 kg",
    "soldBy": "Gunny R.2",
    "buyPrice": "$350"
  },
  {
    "id": "ncstar-led-flashlight",
    "name": "NcStar LED FlashLight",
    "category": "Tactical Device",
    "magnification": null,
    "sightingRange": null,
    "handlingMod": null,
    "modes": "Flashlight",
    "manufacturer": "NcStar",
    "weight": "0.085 kg",
    "soldBy": "Gunny R.1",
    "buyPrice": "$200"
  },
  {
    "id": "steiner-an/peq-15a-dbal-a2",
    "name": "Steiner AN/PEQ-15A DBAL-A2",
    "category": "Tactical Device",
    "magnification": null,
    "sightingRange": null,
    "handlingMod": null,
    "modes": "Red Laser IR Laser IR Illuminator",
    "manufacturer": "Steiner",
    "weight": "0.227 kg",
    "soldBy": "Loot / Tasks",
    "buyPrice": null
  },
  {
    "id": "steiner-cqbl-1",
    "name": "Steiner CQBL-1",
    "category": "Tactical Device",
    "magnification": null,
    "sightingRange": null,
    "handlingMod": null,
    "modes": "Infrared laser Red Laser",
    "manufacturer": "Steiner",
    "weight": "0.159 kg",
    "soldBy": "Gunny R.2 and Banshee R.3",
    "buyPrice": "$964"
  },
  {
    "id": "surefire-m600-scout-light",
    "name": "Surefire M600 Scout light",
    "category": "Tactical Device",
    "magnification": null,
    "sightingRange": null,
    "handlingMod": "+??? %",
    "modes": "Flashlight",
    "manufacturer": "Surefire",
    "weight": "0.147 kg",
    "soldBy": "Gunny R.3",
    "buyPrice": null
  },
  {
    "id": "surefire-p1r-peacekeeper",
    "name": "Surefire P1R Peacekeeper",
    "category": "Tactical Device",
    "magnification": null,
    "sightingRange": null,
    "handlingMod": "-3.0 %",
    "modes": "Flashlight",
    "manufacturer": "Surefire",
    "weight": "0.176 kg",
    "soldBy": "Banshee R.1",
    "buyPrice": null
  },
  {
    "id": "surefire-x400v-b-irc",
    "name": "Surefire X400V-B-IRC",
    "category": "Tactical Device",
    "magnification": null,
    "sightingRange": null,
    "handlingMod": null,
    "modes": "Flashlight Green laser",
    "manufacturer": "Surefire",
    "weight": "0.136 kg",
    "soldBy": "Loot / Tasks",
    "buyPrice": null
  },
  {
    "id": "zenitco-klesch-1",
    "name": "Zenitco Klesch-1",
    "category": "Tactical Device",
    "magnification": null,
    "sightingRange": null,
    "handlingMod": "+??? %",
    "modes": "Flashlight",
    "manufacturer": "Zenitco",
    "weight": "0.082 kg",
    "soldBy": "Loot / Tasks",
    "buyPrice": null
  },
  {
    "id": "zenitco-klesch-2",
    "name": "Zenitco Klesch-2",
    "category": "Tactical Device",
    "magnification": null,
    "sightingRange": null,
    "handlingMod": null,
    "modes": "Flashlight",
    "manufacturer": "Zenitco",
    "weight": "0.300 kg",
    "soldBy": "Turncoat R.2",
    "buyPrice": "$260"
  },
  {
    "id": "zenitco-perst-4",
    "name": "Zenitco PERST-4",
    "category": "Tactical Device",
    "magnification": null,
    "sightingRange": null,
    "handlingMod": null,
    "modes": "IR laser Green laser",
    "manufacturer": "Zenitco",
    "weight": "0.210 kg",
    "soldBy": "Loot / Tasks",
    "buyPrice": null
  }
];

export const ARCHIVE_UTILITY: ArchiveUtilityEntry[] = [
  {
    "id": "3m-comtac-ii",
    "name": "3M Comtac II",
    "category": "Headset",
    "statSummary": "Active: Yes · Amp 6.1 · Detection 50%",
    "chargesOrRadius": null,
    "soldBy": "Banshee R.4",
    "buyPrice": "$825",
    "sellPrice": "$247",
    "weight": "0.68kg",
    "gridSize": "2x2"
  },
  {
    "id": "gssh-01",
    "name": "Active headset GSSh-01",
    "category": "Headset",
    "statSummary": "Active: Yes · Amp 4.9 · Detection 40%",
    "chargesOrRadius": null,
    "soldBy": "Turncoat R.1",
    "buyPrice": "$170",
    "sellPrice": "$51",
    "weight": "0.33kg",
    "gridSize": "2x2"
  },
  {
    "id": "colonels-active-headset-gssh-01",
    "name": "Colonel's Active headset GSSh-01",
    "category": "Headset",
    "statSummary": "Active: Yes · Amp 4.9 · Detection 40%",
    "chargesOrRadius": null,
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$51",
    "weight": "0.33kg",
    "gridSize": "2x2"
  },
  {
    "id": "construction-earmuffs",
    "name": "Construction Earmuffs",
    "category": "Headset",
    "statSummary": "Active: No · Amp 0 · Detection —",
    "chargesOrRadius": null,
    "soldBy": "Artisan R.1",
    "buyPrice": "$40",
    "sellPrice": "$12",
    "weight": "0.44kg",
    "gridSize": "2x2"
  },
  {
    "id": "impact-sport",
    "name": "Impact Sport",
    "category": "Headset",
    "statSummary": "Active: Yes · Amp 5.4 · Detection 25%",
    "chargesOrRadius": null,
    "soldBy": "Banshee R.2",
    "buyPrice": "$340",
    "sellPrice": "$102",
    "weight": "0.279kg",
    "gridSize": "2x2"
  },
  {
    "id": "razor-slim-electronic-muff",
    "name": "Razor Slim Electronic Muff",
    "category": "Headset",
    "statSummary": "Active: Yes · Amp 1.4 · Detection 30%",
    "chargesOrRadius": null,
    "soldBy": "Banshee R.1",
    "buyPrice": "$235",
    "sellPrice": "$70",
    "weight": "0.4kg",
    "gridSize": "2x2"
  },
  {
    "id": "tasc-1",
    "name": "TASC 1",
    "category": "Headset",
    "statSummary": "Active: No · Amp 0 · Detection —",
    "chargesOrRadius": null,
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$22",
    "weight": "0.16kg",
    "gridSize": "2x2"
  },
  {
    "id": "ultimate-power-muff-quads",
    "name": "Ultimate Power Muff Quads",
    "category": "Headset",
    "statSummary": "Active: Yes · Amp 3.9 · Detection 35%",
    "chargesOrRadius": null,
    "soldBy": "Banshee R.3",
    "buyPrice": "$490",
    "sellPrice": "$147",
    "weight": "0.34kg",
    "gridSize": "2x2"
  },
  {
    "id": "vipers-razor-slim-electronic-muff",
    "name": "Viper's Razor Slim Electronic Muff",
    "category": "Headset",
    "statSummary": "Active: Yes · Amp 1.4 · Detection 30%",
    "chargesOrRadius": null,
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$70",
    "weight": "0.4kg",
    "gridSize": "2x2"
  },
  {
    "id": "yens-active-headset-gssh-01",
    "name": "Yen's Active headset GSSh-01",
    "category": "Headset",
    "statSummary": "Active: Yes · Amp 4.9 · Detection 40%",
    "chargesOrRadius": null,
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$51",
    "weight": "0.33kg",
    "gridSize": "2x2"
  },
  {
    "id": "f-1",
    "name": "F-1",
    "category": "Explosive Grenade",
    "statSummary": "Radius 6m · Fuse 3.5-4s · 250 fragments",
    "chargesOrRadius": "6m",
    "soldBy": "Turncoat R.4",
    "buyPrice": "$75",
    "sellPrice": "$22",
    "weight": "0.600kg",
    "gridSize": "1x1"
  },
  {
    "id": "m18-smoke-grenade-green",
    "name": "M18 Smoke Grenade (Green)",
    "category": "Smoke Grenade",
    "statSummary": "Fuse 1.2-2s",
    "chargesOrRadius": null,
    "soldBy": "Gunny R.2",
    "buyPrice": "$40",
    "sellPrice": "$11",
    "weight": "0.539kg",
    "gridSize": "1x1"
  },
  {
    "id": "m18-smoke-grenade-red",
    "name": "M18 Smoke Grenade (Red)",
    "category": "Smoke Grenade",
    "statSummary": "Fuse 1.2-2s",
    "chargesOrRadius": null,
    "soldBy": "Gunny R.2",
    "buyPrice": "$40",
    "sellPrice": "$11",
    "weight": "0.539kg",
    "gridSize": "1x1"
  },
  {
    "id": "m18-smoke-grenade-yellow",
    "name": "M18 Smoke Grenade (Yellow)",
    "category": "Smoke Grenade",
    "statSummary": "Fuse 1.2-2s",
    "chargesOrRadius": null,
    "soldBy": "Gunny R.2",
    "buyPrice": "$40",
    "sellPrice": "$11",
    "weight": "0.539kg",
    "gridSize": "1x1"
  },
  {
    "id": "m26",
    "name": "M26",
    "category": "Explosive Grenade",
    "statSummary": "Radius 5m · Fuse 4-5s · 250 fragments",
    "chargesOrRadius": "5m",
    "soldBy": "Gunny R.2",
    "buyPrice": "$55",
    "sellPrice": "$18",
    "weight": "0.453kg",
    "gridSize": "1x1"
  },
  {
    "id": "m67",
    "name": "M67",
    "category": "Explosive Grenade",
    "statSummary": "Radius 15m · Fuse 4-5s · 300 fragments",
    "chargesOrRadius": "15m",
    "soldBy": "Gunny R.3",
    "buyPrice": "$69",
    "sellPrice": "$18",
    "weight": "0.400kg",
    "gridSize": "1x1"
  },
  {
    "id": "m84-stun-grenade",
    "name": "M84 Stun Grenade",
    "category": "Stun Grenade",
    "statSummary": "Radius 3-6 m · Fuse 1-2.3s",
    "chargesOrRadius": "3-6 m",
    "soldBy": "Gunny R.1",
    "buyPrice": "$45",
    "sellPrice": "$12",
    "weight": "0.370kg",
    "gridSize": "1x1"
  },
  {
    "id": "rgd-5",
    "name": "RGD-5",
    "category": "Explosive Grenade",
    "statSummary": "Radius 3m · Fuse 3.2-4.2s · 350 fragments",
    "chargesOrRadius": "3m",
    "soldBy": "Loot / Tasks",
    "buyPrice": null,
    "sellPrice": "$14",
    "weight": "0.310kg",
    "gridSize": "1x1"
  },
  {
    "id": "equipment-repair-essentials-kit",
    "name": "Equipment Repair Essentials Kit",
    "category": "Repair Kit",
    "statSummary": "Efficiency 90 % · 150 charges",
    "chargesOrRadius": "150 charges",
    "soldBy": "Handshake R.2",
    "buyPrice": "$500",
    "sellPrice": "$150",
    "weight": "1.500kg",
    "gridSize": "2x1"
  },
  {
    "id": "firearm-cleaning-set",
    "name": "Firearm Cleaning Set",
    "category": "Repair Kit",
    "statSummary": "Efficiency +85 % · 100 charges",
    "chargesOrRadius": "100 charges",
    "soldBy": "Gunny R.2",
    "buyPrice": "$450",
    "sellPrice": "$135",
    "weight": "1.500kg",
    "gridSize": null
  },
  {
    "id": "firearm-tool-set",
    "name": "Firearm Tool Set",
    "category": "Repair Kit",
    "statSummary": "Efficiency +85 % · 300 charges",
    "chargesOrRadius": "300 charges",
    "soldBy": "Gunny R.4",
    "buyPrice": "$950",
    "sellPrice": "$285",
    "weight": "3.000kg",
    "gridSize": null
  },
  {
    "id": "gunsmith-tool-set",
    "name": "Gunsmith Tool Set",
    "category": "Repair Kit",
    "statSummary": "Efficiency 90 % · 2,000 charges",
    "chargesOrRadius": "2,000 charges",
    "soldBy": "Gunny R.3",
    "buyPrice": "$600",
    "sellPrice": "$1,110",
    "weight": "6.500kg",
    "gridSize": null
  },
  {
    "id": "specialized-equipment-repair-kit",
    "name": "Specialized Equipment Repair Kit",
    "category": "Repair Kit",
    "statSummary": "Efficiency 90 % · 3,000 charges",
    "chargesOrRadius": "3,000 charges",
    "soldBy": "Handshake R.3",
    "buyPrice": "$4,250",
    "sellPrice": "$1,275",
    "weight": "9.000kg",
    "gridSize": null
  },
  {
    "id": "tactical-equipment-repair-kit",
    "name": "Tactical Equipment Repair Kit",
    "category": "Repair Kit",
    "statSummary": "Efficiency 90 % · 400 charges",
    "chargesOrRadius": "400 charges",
    "soldBy": "Handshake R.4",
    "buyPrice": "$1,050",
    "sellPrice": "$315",
    "weight": "2.000kg",
    "gridSize": null
  },
  {
    "id": "m933-120mm-he-cartridge-high-range",
    "name": "M933 120mm HE Cartridge (High Range)",
    "category": "Mortar Round",
    "statSummary": "120mm HE Artillery · JPEO",
    "chargesOrRadius": null,
    "soldBy": "Gunny level 4",
    "buyPrice": null,
    "sellPrice": "$1,250",
    "weight": "13.650kg",
    "gridSize": "1x3"
  },
  {
    "id": "m933-120mm-he-cartridge-low-range",
    "name": "M933 120mm HE Cartridge (Low Range)",
    "category": "Mortar Round",
    "statSummary": "120mm HE Artillery · JPEO",
    "chargesOrRadius": null,
    "soldBy": "Gunny R.2",
    "buyPrice": "$500",
    "sellPrice": "$6,500",
    "weight": "13.650kg",
    "gridSize": "3x1"
  },
  {
    "id": "m933-120mm-he-cartridge-medium-range",
    "name": "M933 120mm HE Cartridge (Medium Range)",
    "category": "Mortar Round",
    "statSummary": "120mm HE Artillery · JPEO",
    "chargesOrRadius": null,
    "soldBy": "Gunny R.3",
    "buyPrice": "$1,000",
    "sellPrice": "$13,000",
    "weight": "13.650kgkg",
    "gridSize": "3x1"
  },
  {
    "id": "safelock-protected-ruck-case",
    "name": "SafeLock Protected Ruck Case",
    "category": "Secure Lockbox",
    "statSummary": "Protected container · 2x2 grid (4 slots)",
    "chargesOrRadius": "2x2 grid (4 slots)",
    "soldBy": "Edition / Tasks",
    "buyPrice": null,
    "sellPrice": "$3,000",
    "weight": "0.800kg",
    "gridSize": "2x2"
  },
  {
    "id": "snuck-908-portable-lockbox",
    "name": "Snuck 908 Portable Lockbox",
    "category": "Secure Lockbox",
    "statSummary": "Protected container · 2x3 grid (6 slots)",
    "chargesOrRadius": "2x3 grid (6 slots)",
    "soldBy": "Edition / Tasks",
    "buyPrice": null,
    "sellPrice": "$15,000",
    "weight": "1.400kg",
    "gridSize": "3x2"
  },
  {
    "id": "tas-secure-case",
    "name": "TAS Secure Case",
    "category": "Secure Lockbox",
    "statSummary": "Protected container · 3x3",
    "chargesOrRadius": "3x3",
    "soldBy": "Edition / Tasks",
    "buyPrice": null,
    "sellPrice": "$45,000",
    "weight": "1.6 kg",
    "gridSize": "3x3"
  }
];

export const ARCHIVE_PROVISIONS: ArchiveProvisionEntry[] = [
  {
    "id": "aques-water-1-l",
    "name": "Aques Water 1 l",
    "category": "Drink",
    "energy": null,
    "hydration": "+33",
    "effect": "Hydration: +33",
    "charges": "2",
    "useTime": null,
    "weight": "1.000kg",
    "gridSize": "1x2",
    "soldBy": "Lab Rat R.2",
    "buyPrice": null,
    "sellPrice": "$16"
  },
  {
    "id": "aques-water-1.5-l",
    "name": "Aques Water 1.5 l",
    "category": "Drink",
    "energy": null,
    "hydration": "+33",
    "effect": "Hydration: +33",
    "charges": "3",
    "useTime": null,
    "weight": "1.500kg",
    "gridSize": "1x2",
    "soldBy": "Lab Rat R.3",
    "buyPrice": null,
    "sellPrice": "$16"
  },
  {
    "id": "coco-jumbo-coconut-juice-drink",
    "name": "Coco Jumbo Coconut Juice Drink",
    "category": "Drink",
    "energy": null,
    "hydration": "+24",
    "effect": "Hydration: +24",
    "charges": "1",
    "useTime": "5s",
    "weight": "0.240kg",
    "gridSize": "1x1",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$2"
  },
  {
    "id": "dark-star-iced-coffee",
    "name": "Dark Star Iced Coffee",
    "category": "Drink",
    "energy": "+5",
    "hydration": "Energy: +5 +20 Arm Stamina Boost: +15% Arm Stamina Boost Cap: +15% Arm Stamina Boost Duration: 90s Body Stamina Boost: +15% Body Stamina Boost Cap: +15% Body Stamina Boost Duration: 90s",
    "effect": "Energy: +5 Hydration: +20 Arm Stamina Boost: +15% Arm Stamina Boost Cap: +15% Arm Stamina Boost Duration: 90s Body Stamina Boost: +15% Body Stamina Boost Cap: +15% Body Stamina Boost Duration: 90s",
    "charges": "1",
    "useTime": "5s",
    "weight": "0.200kg",
    "gridSize": "1x1",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$6"
  },
  {
    "id": "gray-focused-energy",
    "name": "Gray Focused Energy",
    "category": "Drink",
    "energy": "+5",
    "hydration": "Energy: +5 +35 Arm Stamina Boost: +30% Arm Stamina Boost Cap: +30% Arm Stamina Boost Duration: 300s Body Stamina Boost: +30% Body Stamina Boost Cap: +30% Body Stamina Boost Duration: 300s",
    "effect": "Energy: +5 Hydration: +35 Arm Stamina Boost: +30% Arm Stamina Boost Cap: +30% Arm Stamina Boost Duration: 300s Body Stamina Boost: +30% Body Stamina Boost Cap: +30% Body Stamina Boost Duration: 300s",
    "charges": "1",
    "useTime": "5s",
    "weight": "0.400kg",
    "gridSize": "1x1",
    "soldBy": "Lab Rat R.3",
    "buyPrice": null,
    "sellPrice": "$21"
  },
  {
    "id": "infinity-isotonic-drink",
    "name": "Infinity Isotonic Drink",
    "category": "Drink",
    "energy": "+5",
    "hydration": "Energy: +5 +27",
    "effect": "Energy: +5 Hydration: +27",
    "charges": "1",
    "useTime": null,
    "weight": "0.330kg",
    "gridSize": "1x1",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$4"
  },
  {
    "id": "kaipo-lychee-nectar",
    "name": "Kaipo Lychee Nectar",
    "category": "Drink",
    "energy": "+10",
    "hydration": "+35 Energy: +10",
    "effect": "Hydration: +35 Energy: +10",
    "charges": "1",
    "useTime": "5s",
    "weight": "0.400kg",
    "gridSize": "1x1",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$3"
  },
  {
    "id": "maknav-iced-tea",
    "name": "Maknav Iced Tea",
    "category": "Drink",
    "energy": "+10",
    "hydration": "+45 Energy: +10",
    "effect": "Hydration: +45 Energy: +10",
    "charges": "2",
    "useTime": "6s",
    "weight": "0.950kg",
    "gridSize": "1x2",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$11"
  },
  {
    "id": "noakon-water-0.6-l",
    "name": "Noakon Water 0.6 l",
    "category": "Drink",
    "energy": null,
    "hydration": "+60",
    "effect": "Hydration: +60",
    "charges": "2",
    "useTime": "6s",
    "weight": "0.600kg",
    "gridSize": "1x1",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$6"
  },
  {
    "id": "noakon-water-1-l",
    "name": "Noakon Water 1 l",
    "category": "Drink",
    "energy": null,
    "hydration": "+33",
    "effect": "Hydration: +33",
    "charges": "2",
    "useTime": null,
    "weight": "1.000kg",
    "gridSize": "1x2",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": null
  },
  {
    "id": "noakon-water-1.5-l",
    "name": "Noakon Water 1.5 l",
    "category": "Drink",
    "energy": null,
    "hydration": "+50",
    "effect": "Hydration: +50",
    "charges": "3",
    "useTime": "6 seconds",
    "weight": "1.500kg",
    "gridSize": "1x2",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$16"
  },
  {
    "id": "nuklear-energy:-meltdown-mango",
    "name": "NuKlear Energy: Meltdown Mango",
    "category": "Drink",
    "energy": null,
    "hydration": "Energy: +4 +55 Arm Stamina Boost: +40% Arm Stamina Boost Cap: +40% Arm Stamina Boost Duration: 20s Body Stamina Boost: +40% Body Stamina Boost Cap: +40% Body Stamina Boost Duration: 20s",
    "effect": "Energy: +4 Hydration: +55 Arm Stamina Boost: +40% Arm Stamina Boost Cap: +40% Arm Stamina Boost Duration: 20s Body Stamina Boost: +40% Body Stamina Boost Cap: +40% Body Stamina Boost Duration: 20s",
    "charges": "1",
    "useTime": "6s",
    "weight": "0.340kg",
    "gridSize": "1x1",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$10"
  },
  {
    "id": "power-energy-drink",
    "name": "Power Energy Drink",
    "category": "Drink",
    "energy": null,
    "hydration": "Energy: +20 +40 Arm Stamina Boost: +70% Arm Stamina Boost Cap: +70% Arm Stamina Boost Duration: 20s Body Stamina Boost: +70% Body Stamina Boost Cap: +70% Body Stamina Boost Duration: 20s",
    "effect": "Energy: +20 Hydration: +40 Arm Stamina Boost: +70% Arm Stamina Boost Cap: +70% Arm Stamina Boost Duration: 20s Body Stamina Boost: +70% Body Stamina Boost Cap: +70% Body Stamina Boost Duration: 20s",
    "charges": "1",
    "useTime": "5s",
    "weight": "0.470kg",
    "gridSize": "1x1",
    "soldBy": "Lab Rat R.2",
    "buyPrice": null,
    "sellPrice": null
  },
  {
    "id": "riminda-green-bubbly-bliss",
    "name": "Riminda Green Bubbly Bliss",
    "category": "Drink",
    "energy": null,
    "hydration": "+50 Energy: +15",
    "effect": "Hydration: +50 Energy: +15",
    "charges": "4",
    "useTime": "6",
    "weight": "2.080kg",
    "gridSize": "1x2",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$28"
  },
  {
    "id": "sunrise-cola",
    "name": "Sunrise Cola",
    "category": "Drink",
    "energy": "+15",
    "hydration": "+33 Energy: +15",
    "effect": "Hydration: +33 Energy: +15",
    "charges": "1",
    "useTime": "5s",
    "weight": "0.300kg",
    "gridSize": "1x1",
    "soldBy": "Lab Rat R.1",
    "buyPrice": null,
    "sellPrice": "$3"
  },
  {
    "id": "sunrise-cola-2-l",
    "name": "Sunrise Cola (2 L)",
    "category": "Drink",
    "energy": null,
    "hydration": "+38",
    "effect": "Hydration: +38",
    "charges": "3",
    "useTime": null,
    "weight": "2.000kg",
    "gridSize": "1x2",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$3"
  },
  {
    "id": "touchdown-lemon-soda",
    "name": "Touchdown Lemon Soda",
    "category": "Drink",
    "energy": "+5",
    "hydration": "+33 Energy: +5",
    "effect": "Hydration: +33 Energy: +5",
    "charges": "1",
    "useTime": "5s",
    "weight": "0.380kg",
    "gridSize": "1x1",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$3"
  },
  {
    "id": "white-orchid-crystal-water-2-l",
    "name": "White Orchid Crystal Water 2 l",
    "category": "Drink",
    "energy": null,
    "hydration": "+33",
    "effect": "Hydration: +33",
    "charges": "4",
    "useTime": null,
    "weight": "2.000kg",
    "gridSize": "1x2",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$24"
  },
  {
    "id": "1-shot-energy-chews",
    "name": "1 Shot Energy Chews",
    "category": "Food",
    "energy": "+5",
    "hydration": null,
    "effect": "Stamina Regen +100 % (+10 s) · Energy/Grid: +15",
    "charges": "3",
    "useTime": "4s",
    "weight": "0.04kg",
    "gridSize": "1x1",
    "soldBy": "Lab Rat R.4",
    "buyPrice": "$80",
    "sellPrice": "$24"
  },
  {
    "id": "bamboo-shoots",
    "name": "Bamboo Shoots",
    "category": "Food",
    "energy": "+15",
    "hydration": "+5",
    "effect": "Energy: +15 Hydration: +5 · Energy/Grid: +7.5",
    "charges": "1",
    "useTime": "11s",
    "weight": "0.6kg",
    "gridSize": "1x2",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$3.9"
  },
  {
    "id": "berg-bar-cookie-chocolate",
    "name": "Berg Bar Cookie Chocolate",
    "category": "Food",
    "energy": "+25",
    "hydration": null,
    "effect": "Stamina Regen +25 % (+90 s) · Energy: +25 Arm Stamina Boost: +25% Arm Stamina Boost Cap: +25% Arm Stamina Boost Duration: 90s Body Stamina Boost: +25% Body Stamina Boost Cap: +25% Body Stamina Boost Duration: 90s · Energy/Grid: +25",
    "charges": "1",
    "useTime": "5s",
    "weight": "0.07kg",
    "gridSize": "1x1",
    "soldBy": "Lab Rat R.3",
    "buyPrice": "$75",
    "sellPrice": "$22.5"
  },
  {
    "id": "canned-tuna-chunks",
    "name": "Canned Tuna Chunks",
    "category": "Food",
    "energy": "+40",
    "hydration": "-10",
    "effect": "Energy: +40 Hydration: -10 · Energy/Grid: +40",
    "charges": "1",
    "useTime": "11s",
    "weight": "0.17kg",
    "gridSize": "1x1",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$7.5"
  },
  {
    "id": "combat-ration-pack",
    "name": "Combat Ration Pack",
    "category": "Food",
    "energy": "+75",
    "hydration": null,
    "effect": "Energy: +75 /charge · Energy/Grid: +37.5",
    "charges": "1",
    "useTime": "15s",
    "weight": "0.6kg",
    "gridSize": "1x2",
    "soldBy": "Lab Rat R.4",
    "buyPrice": "$70",
    "sellPrice": "$21"
  },
  {
    "id": "cowboy-baked-beans",
    "name": "Cowboy Baked Beans",
    "category": "Food",
    "energy": "+35",
    "hydration": "+5",
    "effect": "Energy: +35 Hydration: +5 · Energy/Grid: +17.5",
    "charges": "1",
    "useTime": "11s",
    "weight": "0.425kg",
    "gridSize": "1x2",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$11.1"
  },
  {
    "id": "energy-bar-nuts-and-fruits",
    "name": "Energy Bar Nuts and Fruits",
    "category": "Food",
    "energy": "+14",
    "hydration": null,
    "effect": "Stamina Regen +30 % (+20 s) · Energy: +14 Arm Stamina Boost: +30% Arm Stamina Boost Cap: +30% Arm Stamina Boost Duration: 20s Body Stamina Boost: +30% Body Stamina Boost Cap: +30% Body Stamina Boost Duration: +20s · Energy/Grid: +14",
    "charges": "1",
    "useTime": "5s",
    "weight": "0.04kg",
    "gridSize": "1x1",
    "soldBy": "Lab Rat R.1",
    "buyPrice": "$21",
    "sellPrice": "$6.3"
  },
  {
    "id": "hdr-meal",
    "name": "HDR Meal",
    "category": "Food",
    "energy": "+80",
    "hydration": null,
    "effect": "Energy: +75 · Energy/Grid: +40",
    "charges": "1",
    "useTime": "15s",
    "weight": "0.85kg",
    "gridSize": "1x2",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$22.5"
  },
  {
    "id": "kasem-chocolate-wafers",
    "name": "Kasem Chocolate Wafers",
    "category": "Food",
    "energy": "+13",
    "hydration": "-5",
    "effect": "Energy: +13 · Energy/Grid: +13",
    "charges": "1",
    "useTime": "5s",
    "weight": "0.01kg",
    "gridSize": "1x1",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$2.7"
  },
  {
    "id": "lucky-pork-liver-pâté",
    "name": "Lucky Pork Liver Pâté",
    "category": "Food",
    "energy": "+35",
    "hydration": "-5",
    "effect": "Energy: +35 Hydration: -5 · Energy/Grid: +35",
    "charges": "1",
    "useTime": "11s",
    "weight": "0.13kg",
    "gridSize": "1x1",
    "soldBy": "Lab Rat R.2",
    "buyPrice": "$29",
    "sellPrice": "$8.7"
  },
  {
    "id": "lychee-in-syrup",
    "name": "Lychee in Syrup",
    "category": "Food",
    "energy": "+26",
    "hydration": "+10",
    "effect": "Energy: +26 Hydration: +10 · Energy/Grid: +13",
    "charges": "1",
    "useTime": "11s",
    "weight": "0.565kg",
    "gridSize": "1x2",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$9"
  },
  {
    "id": "mackerel-in-teriyaki-sauce",
    "name": "Mackerel in Teriyaki Sauce",
    "category": "Food",
    "energy": "+60",
    "hydration": "-10",
    "effect": "Energy: +60 Hydration: -10 · Energy/Grid: +60",
    "charges": "1",
    "useTime": "11s",
    "weight": "0.2kg",
    "gridSize": "1x1",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$14.4"
  },
  {
    "id": "organic-tofu",
    "name": "Organic Tofu",
    "category": "Food",
    "energy": "+25",
    "hydration": "-10",
    "effect": "Energy: +25 · Energy/Grid: +25",
    "charges": "1",
    "useTime": "11s",
    "weight": "0.2kg",
    "gridSize": "1x1",
    "soldBy": "Lab Rat R.1",
    "buyPrice": "$17",
    "sellPrice": "$5.1"
  },
  {
    "id": "premium-pork-luncheon-meat",
    "name": "Premium Pork Luncheon Meat",
    "category": "Food",
    "energy": "+70",
    "hydration": null,
    "effect": "Energy: +70 Hydration: -10 · Energy/Grid: +35",
    "charges": "1",
    "useTime": "11s",
    "weight": "0.4kg",
    "gridSize": "1x2",
    "soldBy": "Lab Rat R.4",
    "buyPrice": "$64",
    "sellPrice": "$19.2"
  },
  {
    "id": "sinngua-lunch-meat",
    "name": "Sinngua Lunch Meat",
    "category": "Food",
    "energy": "+55",
    "hydration": "-10",
    "effect": "Energy: +60 Hydration: -10 · Energy/Grid: +27.5",
    "charges": "1",
    "useTime": "11s",
    "weight": "0.34kg",
    "gridSize": "1x2",
    "soldBy": "Lab Rat R.3",
    "buyPrice": "$52",
    "sellPrice": "$15.6"
  },
  {
    "id": "snipsnap-crunchy",
    "name": "SnipSnap Crunchy",
    "category": "Food",
    "energy": "+10",
    "hydration": null,
    "effect": "Energy: +10 /charge · Energy/Grid: +10",
    "charges": "1",
    "useTime": "5s",
    "weight": "0.038kg",
    "gridSize": "1x1",
    "soldBy": "Lab Rat R.1",
    "buyPrice": "$7",
    "sellPrice": "$2.1"
  },
  {
    "id": "spicy-thai-combat-meal",
    "name": "Spicy Thai Combat Meal",
    "category": "Food",
    "energy": "+80",
    "hydration": "-15",
    "effect": "Energy: +80 Hydration: -15 · Energy/Grid: +40",
    "charges": "1",
    "useTime": "15s",
    "weight": "0.8kg",
    "gridSize": "1x2",
    "soldBy": "Loot only",
    "buyPrice": null,
    "sellPrice": "$17.7"
  },
  {
    "id": "tamtam-doublechoc",
    "name": "TamTam DoubleChoc",
    "category": "Food",
    "energy": "+20",
    "hydration": null,
    "effect": "Stamina Regen +10 % (+90 s) · Energy: +20 Arm Stamina Boost: +10% Arm Stamina Boost Cap: +10% Arm Stamina Boost Duration: 90s Body Stamina Boost: +10% Body Stamina Boost Cap: +10% Body Stamina Boost Duration: 90s · Energy/Grid: +20",
    "charges": "1",
    "useTime": "5s",
    "weight": "0.2kg",
    "gridSize": "1x1",
    "soldBy": "Lab Rat R.2",
    "buyPrice": "$35",
    "sellPrice": "$10.5"
  },
  {
    "id": "windmill-almond-chocolate-bar",
    "name": "Windmill Almond Chocolate Bar",
    "category": "Food",
    "energy": "+16",
    "hydration": null,
    "effect": "Stamina Regen +60 % (+20 s) · Energy: +16 Arm Stamina Boost: +60% Arm Stamina Boost Cap: +60% Arm Stamina Boost Duration: 20s Body Stamina Boost: +60% Body Stamina Boost Cap: +60% Body Stamina Boost Duration: 20s · Energy/Grid: +16",
    "charges": "1",
    "useTime": "5s",
    "weight": "0.04kg",
    "gridSize": "1x1",
    "soldBy": "Lab Rat R.2",
    "buyPrice": "$38",
    "sellPrice": "$11.4"
  },
  {
    "id": "power-energy-fuel",
    "name": "Power Energy Fuel",
    "category": "Provision",
    "energy": "+20",
    "hydration": "+40",
    "effect": "Energy/Grid: +20",
    "charges": null,
    "useTime": null,
    "weight": "0.47 kg",
    "gridSize": null,
    "soldBy": "Loot / Tasks",
    "buyPrice": null,
    "sellPrice": "$13.5"
  }
];

export const ARCHIVE_LOOT_CONTAINERS: ArchiveLootContainerEntry[] = [
  {
    "id": "ammo-box-container",
    "name": "Ammo Box (Container)",
    "layout": "Variable"
  },
  {
    "id": "briefcase-container",
    "name": "Briefcase (Container)",
    "layout": "3x3"
  },
  {
    "id": "buried-cache",
    "name": "Buried Cache",
    "layout": "2x6 / 3x6"
  },
  {
    "id": "cash-register",
    "name": "Cash Register",
    "layout": "2x2"
  },
  {
    "id": "civilian-chest",
    "name": "Civilian Chest",
    "layout": "3x3"
  },
  {
    "id": "cooler",
    "name": "Cooler",
    "layout": "3x3"
  },
  {
    "id": "csi-firearms-box",
    "name": "CSI Firearms Box",
    "layout": "8x6"
  },
  {
    "id": "csi-gear-box",
    "name": "CSI Gear Box",
    "layout": "8x6"
  },
  {
    "id": "dead-body",
    "name": "Dead Body",
    "layout": "2x2"
  },
  {
    "id": "donation-box",
    "name": "Donation Box",
    "layout": "8x10"
  },
  {
    "id": "duffle-bag",
    "name": "Duffle Bag",
    "layout": "5x3"
  },
  {
    "id": "equipment-box",
    "name": "Equipment Box",
    "layout": "7x4"
  },
  {
    "id": "firearms-box",
    "name": "Firearms Box",
    "layout": "8x3"
  },
  {
    "id": "first-aid-cabinet",
    "name": "First Aid Cabinet",
    "layout": "3x4"
  },
  {
    "id": "food-storage",
    "name": "Food Storage",
    "layout": "3x3"
  },
  {
    "id": "jewelry-box",
    "name": "Jewelry Box",
    "layout": "3x3 / 2x2"
  },
  {
    "id": "lri-firearms-box",
    "name": "LRI Firearms Box",
    "layout": "8x6"
  },
  {
    "id": "lri-gear-box",
    "name": "LRI Gear Box",
    "layout": "8x6"
  },
  {
    "id": "medical-bag",
    "name": "Medical Bag",
    "layout": "4x4"
  },
  {
    "id": "metal-box",
    "name": "Metal Box",
    "layout": "2x2"
  },
  {
    "id": "military-food-transport-crate",
    "name": "Military Food Transport Crate",
    "layout": "3x3"
  },
  {
    "id": "military-medical-crate",
    "name": "Military Medical Crate",
    "layout": "3x3"
  },
  {
    "id": "mss-firearms-box",
    "name": "MSS Firearms Box",
    "layout": "8x6"
  },
  {
    "id": "mss-gear-box",
    "name": "MSS Gear Box",
    "layout": "8x6"
  },
  {
    "id": "plastic-container",
    "name": "Plastic Container",
    "layout": "3x3"
  },
  {
    "id": "pmc-firearms-box",
    "name": "PMC Firearms Box",
    "layout": "8x6"
  },
  {
    "id": "pmc-gear-box",
    "name": "PMC Gear Box",
    "layout": "8x6"
  },
  {
    "id": "purse",
    "name": "Purse",
    "layout": "3x3"
  },
  {
    "id": "safe",
    "name": "Safe",
    "layout": "4x4"
  },
  {
    "id": "supply-crate",
    "name": "Supply Crate",
    "layout": "6x4"
  },
  {
    "id": "un-cooler",
    "name": "UN Cooler",
    "layout": "4x4"
  },
  {
    "id": "un-equipment-box",
    "name": "UN Equipment Box",
    "layout": "4x4"
  },
  {
    "id": "un-firearms-box",
    "name": "UN Firearms Box",
    "layout": "7x4"
  },
  {
    "id": "un-firearms-crate",
    "name": "UN Firearms Crate",
    "layout": "7x4"
  },
  {
    "id": "un-food-transport-crate",
    "name": "UN Food Transport Crate",
    "layout": "4x4"
  },
  {
    "id": "un-gear-crate",
    "name": "UN Gear Crate",
    "layout": "8x6"
  },
  {
    "id": "wooden-equipment-box",
    "name": "Wooden Equipment Box",
    "layout": "6x5"
  },
  {
    "id": "wooden-firearms-box",
    "name": "Wooden Firearms Box",
    "layout": "8x3"
  }
];

export const ARCHIVE_LOOT_ITEMS: ArchiveLootItemEntry[] = [
  {
    "id": "ltsd-4-3-laser-designator",
    "name": "LTSD-4-3 Laser Designator",
    "category": "Loot / Trade",
    "gridSize": "3x3",
    "weight": "14",
    "sellPrice": "$64,000",
    "pricePerCell": "$7,111"
  },
  {
    "id": "r-438-barrier-t",
    "name": "R-438 Barrier-T",
    "category": "Loot / Trade",
    "gridSize": "3x3",
    "weight": "16",
    "sellPrice": "$48,000",
    "pricePerCell": "$5,333"
  },
  {
    "id": "biohazard-canister",
    "name": "Biohazard Canister",
    "category": "Loot / Trade",
    "gridSize": "1x2",
    "weight": "2 kg",
    "sellPrice": "$40,000",
    "pricePerCell": "$20,000"
  },
  {
    "id": "nerve-gas-canister",
    "name": "Nerve Gas Canister",
    "category": "Loot / Trade",
    "gridSize": "1x2",
    "weight": "2 kg",
    "sellPrice": "$40,000",
    "pricePerCell": "$20,000"
  },
  {
    "id": "plutonium-canister",
    "name": "Plutonium Canister",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "1 kg",
    "sellPrice": "$40,000",
    "pricePerCell": "$40,000"
  },
  {
    "id": "ai-targeting-module",
    "name": "AI Targeting Module",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.05",
    "sellPrice": "$22,500",
    "pricePerCell": "$22,500"
  },
  {
    "id": "sarin-canister",
    "name": "Sarin Canister",
    "category": "Loot / Trade",
    "gridSize": "1x2",
    "weight": "2 kg",
    "sellPrice": "$22,500",
    "pricePerCell": "$11,250"
  },
  {
    "id": "pure-white-heroin",
    "name": "Pure White Heroin",
    "category": "Loot / Trade",
    "gridSize": "2x2",
    "weight": "1 kg",
    "sellPrice": "$19,500",
    "pricePerCell": "$4,875"
  },
  {
    "id": "deep-space-observation-data-drive",
    "name": "Deep-Space Observation Data Drive",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.08",
    "sellPrice": "$18,000",
    "pricePerCell": "$18,000"
  },
  {
    "id": "electronic-warfare-configuration-drive",
    "name": "Electronic Warfare Configuration Drive",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.08",
    "sellPrice": "$18,000",
    "pricePerCell": "$18,000"
  },
  {
    "id": "uplink-credentials-drive",
    "name": "Uplink Credentials Drive",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.08",
    "sellPrice": "$18,000",
    "pricePerCell": "$18,000"
  },
  {
    "id": "usp-morphine-sulfate",
    "name": "USP Morphine Sulfate",
    "category": "Loot / Trade",
    "gridSize": "2x2",
    "weight": "5 kg",
    "sellPrice": "$17,000",
    "pricePerCell": "$4,250"
  },
  {
    "id": "missile-guidance-circuit",
    "name": "Missile Guidance Circuit",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "2",
    "sellPrice": "$16,875",
    "pricePerCell": "$16,875"
  },
  {
    "id": "black-credit-card",
    "name": "Black Credit Card",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.005 kg",
    "sellPrice": "$15,000",
    "pricePerCell": "$15,000"
  },
  {
    "id": "moutai---50y",
    "name": "Moutai - 50y",
    "category": "Loot / Trade",
    "gridSize": "1x2",
    "weight": "1.5 kg",
    "sellPrice": "$15,000",
    "pricePerCell": "$7,500"
  },
  {
    "id": "gray-heroin",
    "name": "Gray Heroin",
    "category": "Loot / Trade",
    "gridSize": "2x2",
    "weight": "1 kg",
    "sellPrice": "$14,000",
    "pricePerCell": "$3,500"
  },
  {
    "id": "encryption-key-drive",
    "name": "Encryption Key Drive",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.11",
    "sellPrice": "$12,000",
    "pricePerCell": "$12,000"
  },
  {
    "id": "flight-data-drive",
    "name": "Flight Data Drive",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.11",
    "sellPrice": "$12,000",
    "pricePerCell": "$12,000"
  },
  {
    "id": "incriminating-data-drive",
    "name": "Incriminating Data Drive",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.11",
    "sellPrice": "$12,000",
    "pricePerCell": "$12,000"
  },
  {
    "id": "stabilized-morphine-sulfate-liquid",
    "name": "Stabilized Morphine Sulfate Liquid",
    "category": "Loot / Trade",
    "gridSize": "2x2",
    "weight": "5 kg",
    "sellPrice": "$12,000",
    "pricePerCell": "$3,000"
  },
  {
    "id": "platinum-ring",
    "name": "Platinum Ring",
    "category": "Jewellery / Valuable",
    "gridSize": "1x1",
    "weight": "0.01 kg",
    "sellPrice": "$10,000",
    "pricePerCell": "$10,000"
  },
  {
    "id": "digital-synthesis-engine",
    "name": "Digital Synthesis Engine",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.1 kg",
    "sellPrice": "$9,000",
    "pricePerCell": "9,000"
  },
  {
    "id": "high-speed-digital-processor-board",
    "name": "High-Speed Digital Processor Board",
    "category": "Loot / Trade",
    "gridSize": "2x1",
    "weight": "0.1 kg",
    "sellPrice": "$9,000",
    "pricePerCell": "4,500"
  },
  {
    "id": "oven-controlled-crystal-oscillator",
    "name": "Oven-Controlled Crystal Oscillator",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.01 kg",
    "sellPrice": "$9,000",
    "pricePerCell": "9,000"
  },
  {
    "id": "vip-passport",
    "name": "VIP Passport",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.05 kg",
    "sellPrice": "$9,000",
    "pricePerCell": "$9,000"
  },
  {
    "id": "10%-morphine-solution",
    "name": "10% Morphine Solution",
    "category": "Loot / Trade",
    "gridSize": "2x2",
    "weight": "5 kg",
    "sellPrice": "$8,000",
    "pricePerCell": "$2,000"
  },
  {
    "id": "incriminating-phone-logs",
    "name": "Incriminating Phone Logs",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.24",
    "sellPrice": "$8,000",
    "pricePerCell": "$8,000"
  },
  {
    "id": "laf-artillery-data-logs",
    "name": "LAF Artillery Data Logs",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.24",
    "sellPrice": "$8,000",
    "pricePerCell": "$8,000"
  },
  {
    "id": "majestic-titanium-watch",
    "name": "Majestic Titanium Watch",
    "category": "Jewellery / Valuable",
    "gridSize": "1x1",
    "weight": "0.1 kg",
    "sellPrice": "$8,000",
    "pricePerCell": "$8,000"
  },
  {
    "id": "unlra-relief-manifest",
    "name": "UNLRA Relief Manifest",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.24",
    "sellPrice": "$8,000",
    "pricePerCell": "$8,000"
  },
  {
    "id": "diamond-ring",
    "name": "Diamond Ring",
    "category": "Jewellery / Valuable",
    "gridSize": "1x1",
    "weight": "0.01 kg",
    "sellPrice": "$7,700",
    "pricePerCell": "$7,700"
  },
  {
    "id": "pbg-01+-uav-control-station",
    "name": "PBG-01+ UAV Control Station",
    "category": "Loot / Trade",
    "gridSize": "2x2",
    "weight": "14.2",
    "sellPrice": "$6,800",
    "pricePerCell": "$1,700"
  },
  {
    "id": "avionics-processor-board",
    "name": "Avionics Processor Board",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.5 kg",
    "sellPrice": "$6,000",
    "pricePerCell": "6,000"
  },
  {
    "id": "fpga-module",
    "name": "FPGA Module",
    "category": "Loot / Trade",
    "gridSize": "2x1",
    "weight": "0.2 kg",
    "sellPrice": "$6,000",
    "pricePerCell": "3,000"
  },
  {
    "id": "platinum-credit-card",
    "name": "Platinum Credit Card",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.005 kg",
    "sellPrice": "$6,000",
    "pricePerCell": "$6,000"
  },
  {
    "id": "server-ram-module",
    "name": "Server RAM Module",
    "category": "Loot / Trade",
    "gridSize": "2x1",
    "weight": "0.05 kg",
    "sellPrice": "$6,000",
    "pricePerCell": "3,000"
  },
  {
    "id": "diamond-earrings",
    "name": "Diamond Earrings",
    "category": "Jewellery / Valuable",
    "gridSize": "1x1",
    "weight": "0.02 kg",
    "sellPrice": "$5,700",
    "pricePerCell": "$5,700"
  },
  {
    "id": "allanach-single-malt-scotch---40y",
    "name": "Allanach Single Malt Scotch - 40y",
    "category": "Loot / Trade",
    "gridSize": "1x2",
    "weight": "2.1 kg",
    "sellPrice": "$5,451",
    "pricePerCell": "$2,726"
  },
  {
    "id": "emerald-necklace",
    "name": "Emerald Necklace",
    "category": "Jewellery / Valuable",
    "gridSize": "1x1",
    "weight": "0.05 kg",
    "sellPrice": "$5,300",
    "pricePerCell": "$5,300"
  },
  {
    "id": "diamond-coral-ring",
    "name": "Diamond-Coral Ring",
    "category": "Jewellery / Valuable",
    "gridSize": "1x1",
    "weight": "0.02 kg",
    "sellPrice": "$5,250",
    "pricePerCell": "$5,250"
  },
  {
    "id": "c2-military-laptop",
    "name": "C2 Military Laptop",
    "category": "Loot / Trade",
    "gridSize": "2x2",
    "weight": "5.5",
    "sellPrice": "$5,200",
    "pricePerCell": "$1,300"
  },
  {
    "id": "operation-data-encrypted-hard-disk",
    "name": "Operation Data Encrypted Hard Disk",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.18",
    "sellPrice": "$5,200",
    "pricePerCell": "$5,200"
  },
  {
    "id": "perfect-pearl-earrings",
    "name": "Perfect Pearl Earrings",
    "category": "Jewellery / Valuable",
    "gridSize": "1x1",
    "weight": "0.01 kg",
    "sellPrice": "$5,000",
    "pricePerCell": "$5,000"
  },
  {
    "id": "strelets-m-tablet",
    "name": "STRELETS-M Tablet",
    "category": "Loot / Trade",
    "gridSize": "2x1",
    "weight": "1.4",
    "sellPrice": "$4,960",
    "pricePerCell": "$2,480"
  },
  {
    "id": "encrypted-hard-disk-drive",
    "name": "Encrypted Hard Disk Drive",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.18 kg",
    "sellPrice": "$4,600",
    "pricePerCell": "$4,600"
  },
  {
    "id": "high-quality-morphine-base",
    "name": "High-Quality Morphine Base",
    "category": "Loot / Trade",
    "gridSize": "2x2",
    "weight": "1",
    "sellPrice": "$4,500",
    "pricePerCell": "1,125"
  },
  {
    "id": "elaborate-ring",
    "name": "Elaborate Ring",
    "category": "Jewellery / Valuable",
    "gridSize": "1x1",
    "weight": "0.02 kg",
    "sellPrice": "$4,400",
    "pricePerCell": "$4,400"
  },
  {
    "id": "cpu-card",
    "name": "CPU Card",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.3 kg",
    "sellPrice": "$4,000",
    "pricePerCell": "4,000"
  },
  {
    "id": "multi-bus-converter",
    "name": "Multi-Bus Converter",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.25 kg",
    "sellPrice": "$4,000",
    "pricePerCell": "4,000"
  },
  {
    "id": "spoofing-asic-module",
    "name": "Spoofing ASIC Module",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.32 kg",
    "sellPrice": "$4,000",
    "pricePerCell": "4,000"
  },
  {
    "id": "breda-rum---30y",
    "name": "Breda Rum - 30y",
    "category": "Loot / Trade",
    "gridSize": "1x2",
    "weight": "1.7 kg",
    "sellPrice": "$3,802",
    "pricePerCell": "$1,901"
  },
  {
    "id": "sapphire-pendant",
    "name": "Sapphire Pendant",
    "category": "Jewellery / Valuable",
    "gridSize": "1x1",
    "weight": "0.01 kg",
    "sellPrice": "$3,600",
    "pricePerCell": "$3,600"
  },
  {
    "id": "tourist-passport",
    "name": "Tourist Passport",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.05 kg",
    "sellPrice": "$3,500",
    "pricePerCell": "$3,500"
  },
  {
    "id": "an/pyq-10",
    "name": "AN/PYQ-10",
    "category": "Loot / Trade",
    "gridSize": "1x2",
    "weight": "0.97",
    "sellPrice": "$3,360",
    "pricePerCell": "$1,680"
  },
  {
    "id": "medium-quality-morphine-base",
    "name": "Medium-Quality Morphine Base",
    "category": "Loot / Trade",
    "gridSize": "2x2",
    "weight": "1",
    "sellPrice": "$3,200",
    "pricePerCell": "800"
  },
  {
    "id": "kik-11-tactical-key-loader",
    "name": "KIK-11 Tactical Key Loader",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.45",
    "sellPrice": "$3,120",
    "pricePerCell": "$3,120"
  },
  {
    "id": "reinforced-military-laptop",
    "name": "Reinforced Military Laptop",
    "category": "Loot / Trade",
    "gridSize": "2x2",
    "weight": "2.5 kg",
    "sellPrice": "$3,072",
    "pricePerCell": "$768"
  },
  {
    "id": "one-time-pad-key-sheets",
    "name": "One-Time Pad Key Sheets",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.1",
    "sellPrice": "$2,560",
    "pricePerCell": "$2,560"
  },
  {
    "id": "gold-credit-card",
    "name": "Gold Credit Card",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.005 kg",
    "sellPrice": "$2,200",
    "pricePerCell": "$2,200"
  },
  {
    "id": "biometric-access-card",
    "name": "Biometric Access Card",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.008",
    "sellPrice": "$2,080",
    "pricePerCell": "$2,080"
  },
  {
    "id": "hgcs-30-uav-control-station",
    "name": "HGCS-30 UAV Control Station",
    "category": "Loot / Trade",
    "gridSize": "2x2",
    "weight": "3",
    "sellPrice": "$2,080",
    "pricePerCell": "$520"
  },
  {
    "id": "tzintzimitl-tequila---25y",
    "name": "Tzintzimitl Tequila - 25y",
    "category": "Loot / Trade",
    "gridSize": "1x2",
    "weight": "1.8 kg",
    "sellPrice": "$2,020",
    "pricePerCell": "$1,010"
  },
  {
    "id": "biometric-thumb-drive",
    "name": "Biometric Thumb Drive",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.004",
    "sellPrice": "$2,000",
    "pricePerCell": "$2,000"
  },
  {
    "id": "low-quality-morphine-base",
    "name": "Low-Quality Morphine Base",
    "category": "Loot / Trade",
    "gridSize": "2x2",
    "weight": "1",
    "sellPrice": "$2,000",
    "pricePerCell": "500"
  },
  {
    "id": "sleek-luxury-watch",
    "name": "Sleek Luxury Watch",
    "category": "Jewellery / Valuable",
    "gridSize": "1x1",
    "weight": "0.13 kg",
    "sellPrice": "$1,700",
    "pricePerCell": "$1,700"
  },
  {
    "id": "black-luxury-phone",
    "name": "Black Luxury Phone",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.22",
    "sellPrice": "$1,500",
    "pricePerCell": "$1,500"
  },
  {
    "id": "master-carbon-seal-automatic-watch",
    "name": "Master Carbon SEAL Automatic Watch",
    "category": "Jewellery / Valuable",
    "gridSize": "1x1",
    "weight": "0.17 kg",
    "sellPrice": "$1,450",
    "pricePerCell": "$1,450"
  },
  {
    "id": "dark-pearl-necklace",
    "name": "Dark Pearl Necklace",
    "category": "Jewellery / Valuable",
    "gridSize": "1x1",
    "weight": "0.05 kg",
    "sellPrice": "$1,350",
    "pricePerCell": "$1,350"
  },
  {
    "id": "reflex-camera",
    "name": "Reflex Camera",
    "category": "Loot / Trade",
    "gridSize": "2x1",
    "weight": "0.95 kg",
    "sellPrice": "$1,280",
    "pricePerCell": "$640"
  },
  {
    "id": "businessman-id-card",
    "name": "Businessman ID Card",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.05 kg",
    "sellPrice": "$1,250",
    "pricePerCell": "$1,250"
  },
  {
    "id": "rugged-military-tablet",
    "name": "Rugged Military Tablet",
    "category": "Loot / Trade",
    "gridSize": "2x2",
    "weight": "2",
    "sellPrice": "$1,240",
    "pricePerCell": "$310"
  },
  {
    "id": "npi-2-navigation-receiver",
    "name": "NPI-2 Navigation Receiver",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.3",
    "sellPrice": "$1,136",
    "pricePerCell": "$1,136"
  },
  {
    "id": "vial-of-antigens",
    "name": "Vial of Antigens",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.03 kg",
    "sellPrice": "$1,010.4",
    "pricePerCell": "$1,010"
  },
  {
    "id": "atm-hacking-tool",
    "name": "ATM Hacking Tool",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.15",
    "sellPrice": "$1,000",
    "pricePerCell": "$1,000"
  },
  {
    "id": "glonass-grot-m-navigation-receiver",
    "name": "GLONASS Grot-M Navigation Receiver",
    "category": "Loot / Trade",
    "gridSize": "1x2",
    "weight": "0.8",
    "sellPrice": "$1,000",
    "pricePerCell": "$500"
  },
  {
    "id": "laptop",
    "name": "Laptop",
    "category": "Loot / Trade",
    "gridSize": "2x2",
    "weight": "1.5 kg",
    "sellPrice": "$1,000",
    "pricePerCell": "$250"
  },
  {
    "id": "luxury-smartphone",
    "name": "Luxury Smartphone",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.22",
    "sellPrice": "$1,000",
    "pricePerCell": "$1,000"
  },
  {
    "id": "azart-p1-radio",
    "name": "AZART P1 Radio",
    "category": "Loot / Trade",
    "gridSize": "1x2",
    "weight": "0.72",
    "sellPrice": "$880",
    "pricePerCell": "$440"
  },
  {
    "id": "gemstone-ring",
    "name": "Gemstone Ring",
    "category": "Jewellery / Valuable",
    "gridSize": "1x1",
    "weight": "0.01 kg",
    "sellPrice": "$820",
    "pricePerCell": "$820"
  },
  {
    "id": "handheld-ecm-jammer",
    "name": "Handheld ECM Jammer",
    "category": "Loot / Trade",
    "gridSize": "1x2",
    "weight": "2",
    "sellPrice": "$760",
    "pricePerCell": "$380"
  },
  {
    "id": "signal-repeater-rt97s",
    "name": "Signal Repeater RT97S",
    "category": "Loot / Trade",
    "gridSize": "3x2",
    "weight": "1.66",
    "sellPrice": "$720",
    "pricePerCell": "$120"
  },
  {
    "id": "common-credit-card",
    "name": "Common Credit Card",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.005 kg",
    "sellPrice": "$600",
    "pricePerCell": "$600"
  },
  {
    "id": "luxury-smartwatch",
    "name": "Luxury Smartwatch",
    "category": "Jewellery / Valuable",
    "gridSize": "1x1",
    "weight": "0.15 kg",
    "sellPrice": "$600",
    "pricePerCell": "$600"
  },
  {
    "id": "goodlad-whiskey---20y",
    "name": "Goodlad Whiskey - 20y",
    "category": "Loot / Trade",
    "gridSize": "1x2",
    "weight": "1.6 kg",
    "sellPrice": "$450",
    "pricePerCell": "$225"
  },
  {
    "id": "water-pump",
    "name": "Water Pump",
    "category": "Loot / Trade",
    "gridSize": "3x2",
    "weight": "10 kg",
    "sellPrice": "$450",
    "pricePerCell": "75"
  },
  {
    "id": "snake-wine",
    "name": "Snake Wine",
    "category": "Loot / Trade",
    "gridSize": "1x2",
    "weight": "1.4 kg",
    "sellPrice": "$399",
    "pricePerCell": "$200"
  },
  {
    "id": "drivers-licence",
    "name": "Driver's Licence",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.05 kg",
    "sellPrice": "$350",
    "pricePerCell": "$350"
  },
  {
    "id": "expensive-smartphone",
    "name": "Expensive Smartphone",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.25",
    "sellPrice": "$350",
    "pricePerCell": "$350"
  },
  {
    "id": "heavenly-perfume-bottle",
    "name": "Heavenly Perfume Bottle",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.3 kg",
    "sellPrice": "$335",
    "pricePerCell": "$335"
  },
  {
    "id": "microscope",
    "name": "Microscope",
    "category": "Loot / Trade",
    "gridSize": "2x3",
    "weight": "1.6 kg",
    "sellPrice": "$300",
    "pricePerCell": "50"
  },
  {
    "id": "lambert-cigars",
    "name": "Lambert Cigars",
    "category": "Loot / Trade",
    "gridSize": "2x1",
    "weight": "0.6 kg",
    "sellPrice": "$282",
    "pricePerCell": "$141"
  },
  {
    "id": "acumulator-drill",
    "name": "Acumulator Drill",
    "category": "Loot / Trade",
    "gridSize": "2x2",
    "weight": "1.18 kg",
    "sellPrice": "$266.4",
    "pricePerCell": "$67"
  },
  {
    "id": "local-id-card",
    "name": "Local ID Card",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.05 kg",
    "sellPrice": "$250",
    "pricePerCell": "$250"
  },
  {
    "id": "smartphone",
    "name": "Smartphone",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.22",
    "sellPrice": "$250",
    "pricePerCell": "$250"
  },
  {
    "id": "disinfectant",
    "name": "Disinfectant",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "1 kg",
    "sellPrice": "$212.8",
    "pricePerCell": "$213"
  },
  {
    "id": "gold-necklace",
    "name": "Gold Necklace",
    "category": "Jewellery / Valuable",
    "gridSize": "1x1",
    "weight": "0.05 kg",
    "sellPrice": "$180",
    "pricePerCell": "$180"
  },
  {
    "id": "server-cpu",
    "name": "Server CPU",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.08 kg",
    "sellPrice": "$180",
    "pricePerCell": "180"
  },
  {
    "id": "white-lithium-grease",
    "name": "White Lithium Grease",
    "category": "Loot / Trade",
    "gridSize": "2x2",
    "weight": "5.22 kg",
    "sellPrice": "$160",
    "pricePerCell": "$40"
  },
  {
    "id": "crystal-prism",
    "name": "Crystal Prism",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.035 kg",
    "sellPrice": "$150",
    "pricePerCell": "150"
  },
  {
    "id": "delicate-perfume-bottle",
    "name": "Delicate Perfume Bottle",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.3 kg",
    "sellPrice": "$150",
    "pricePerCell": "$150"
  },
  {
    "id": "digital-camera",
    "name": "Digital Camera",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.35 kg",
    "sellPrice": "$150",
    "pricePerCell": "$150"
  },
  {
    "id": "dynamo",
    "name": "Dynamo",
    "category": "Loot / Trade",
    "gridSize": "2x2",
    "weight": "3 kg",
    "sellPrice": "$150",
    "pricePerCell": "$38"
  },
  {
    "id": "gold-ring",
    "name": "Gold Ring",
    "category": "Jewellery / Valuable",
    "gridSize": "1x1",
    "weight": "0.01 kg",
    "sellPrice": "$150",
    "pricePerCell": "$150"
  },
  {
    "id": "graphics-card",
    "name": "Graphics Card",
    "category": "Loot / Trade",
    "gridSize": "2x1",
    "weight": "0.5 kg",
    "sellPrice": "$150",
    "pricePerCell": "75"
  },
  {
    "id": "hepa-filter",
    "name": "HEPA Filter",
    "category": "Loot / Trade",
    "gridSize": "3x3",
    "weight": "2 kg",
    "sellPrice": "$150",
    "pricePerCell": "$17"
  },
  {
    "id": "hydrochloric-acid",
    "name": "Hydrochloric Acid",
    "category": "Loot / Trade",
    "gridSize": "2x2",
    "weight": "2.7",
    "sellPrice": "$150",
    "pricePerCell": "$38"
  },
  {
    "id": "laser-tube",
    "name": "Laser Tube",
    "category": "Loot / Trade",
    "gridSize": "3x1",
    "weight": "0.21 kg",
    "sellPrice": "$150",
    "pricePerCell": "50"
  },
  {
    "id": "mechanical-pipette",
    "name": "Mechanical Pipette",
    "category": "Loot / Trade",
    "gridSize": "1x2",
    "weight": "0.13 kg",
    "sellPrice": "$150",
    "pricePerCell": "75"
  },
  {
    "id": "modern-watch",
    "name": "Modern Watch",
    "category": "Jewellery / Valuable",
    "gridSize": "1x1",
    "weight": "0.12 kg",
    "sellPrice": "$150",
    "pricePerCell": "$150"
  },
  {
    "id": "opium-gum",
    "name": "Opium Gum",
    "category": "Loot / Trade",
    "gridSize": "2x2",
    "weight": "2",
    "sellPrice": "$150",
    "pricePerCell": "$38"
  },
  {
    "id": "oscilloscope",
    "name": "Oscilloscope",
    "category": "Loot / Trade",
    "gridSize": "3x2",
    "weight": "3 kg",
    "sellPrice": "$150",
    "pricePerCell": "25"
  },
  {
    "id": "signal-generator",
    "name": "Signal Generator",
    "category": "Loot / Trade",
    "gridSize": "2x2",
    "weight": "1.2 kg",
    "sellPrice": "$150",
    "pricePerCell": "$38"
  },
  {
    "id": "tourist-id-card",
    "name": "Tourist ID Card",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.05 kg",
    "sellPrice": "$150",
    "pricePerCell": "$150"
  },
  {
    "id": "vapor-lamp",
    "name": "Vapor Lamp",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.05 kg",
    "sellPrice": "$150",
    "pricePerCell": "150"
  },
  {
    "id": "hyperborea-cigarettes",
    "name": "Noir Mist Cigarettes",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.02 kg",
    "sellPrice": "$139",
    "pricePerCell": "$139"
  },
  {
    "id": "zinc-electrode",
    "name": "Zinc Electrode",
    "category": "Loot / Trade",
    "gridSize": "1x2",
    "weight": "0.5 kg",
    "sellPrice": "$120",
    "pricePerCell": "60"
  },
  {
    "id": "chemicals",
    "name": "Chemicals",
    "category": "Loot / Trade",
    "gridSize": "2x2",
    "weight": "1 kg",
    "sellPrice": "$90",
    "pricePerCell": "$23"
  },
  {
    "id": "cpu",
    "name": "CPU",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.07 kg",
    "sellPrice": "$90",
    "pricePerCell": "90"
  },
  {
    "id": "ether",
    "name": "Ether",
    "category": "Loot / Trade",
    "gridSize": "1x2",
    "weight": "1.2",
    "sellPrice": "$90",
    "pricePerCell": "45"
  },
  {
    "id": "ethyl-alcohol",
    "name": "Ethyl Alcohol",
    "category": "Loot / Trade",
    "gridSize": "2x2",
    "weight": "2.8",
    "sellPrice": "$90",
    "pricePerCell": "$23"
  },
  {
    "id": "methylparaben",
    "name": "Methylparaben",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.15",
    "sellPrice": "$90",
    "pricePerCell": "90"
  },
  {
    "id": "motherboard",
    "name": "Motherboard",
    "category": "Loot / Trade",
    "gridSize": "2x2",
    "weight": "0.8 kg",
    "sellPrice": "$90",
    "pricePerCell": "$23"
  },
  {
    "id": "ram",
    "name": "RAM",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.3 kg",
    "sellPrice": "$90",
    "pricePerCell": "90"
  },
  {
    "id": "broken-nailgun",
    "name": "Broken Nailgun",
    "category": "Loot / Trade",
    "gridSize": "2x2",
    "weight": "2.5 kg",
    "sellPrice": "$80",
    "pricePerCell": "$20"
  },
  {
    "id": "acetic-anhydride",
    "name": "Acetic Anhydride",
    "category": "Loot / Trade",
    "gridSize": "1x2",
    "weight": "1",
    "sellPrice": "$75",
    "pricePerCell": "$38"
  },
  {
    "id": "edetate-disodium",
    "name": "Edetate Disodium",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.05",
    "sellPrice": "$75",
    "pricePerCell": "75"
  },
  {
    "id": "fine-metal-mesh",
    "name": "Fine Metal Mesh",
    "category": "Loot / Trade",
    "gridSize": "2x1",
    "weight": "0.5 kg",
    "sellPrice": "$75",
    "pricePerCell": "$38"
  },
  {
    "id": "fragrant-perfume-bottle",
    "name": "Fragrant Perfume Bottle",
    "category": "Loot / Trade",
    "gridSize": "1x2",
    "weight": "0.25 kg",
    "sellPrice": "$75",
    "pricePerCell": "$38"
  },
  {
    "id": "military-software",
    "name": "Military Software",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.03 kg",
    "sellPrice": "$75",
    "pricePerCell": "75"
  },
  {
    "id": "power-supply",
    "name": "Power Supply",
    "category": "Loot / Trade",
    "gridSize": "2x2",
    "weight": "1 kg",
    "sellPrice": "$75",
    "pricePerCell": "$19"
  },
  {
    "id": "tooling-coolant",
    "name": "Tooling Coolant",
    "category": "Loot / Trade",
    "gridSize": "2x2",
    "weight": "5 kg",
    "sellPrice": "$75",
    "pricePerCell": "$19"
  },
  {
    "id": "acetylene-cylinder",
    "name": "Acetylene Cylinder",
    "category": "Loot / Trade",
    "gridSize": "2x4",
    "weight": "11.5 kg",
    "sellPrice": "$60",
    "pricePerCell": "$8"
  },
  {
    "id": "broken-angle-grinder",
    "name": "Broken Angle Grinder",
    "category": "Loot / Trade",
    "gridSize": "2x2",
    "weight": "2.499 kg",
    "sellPrice": "$60",
    "pricePerCell": "$15"
  },
  {
    "id": "car-battery",
    "name": "Car Battery",
    "category": "Loot / Trade",
    "gridSize": "2x2",
    "weight": "12.66",
    "sellPrice": "$60",
    "pricePerCell": "$15"
  },
  {
    "id": "electrical-parts",
    "name": "Electrical Parts",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.5 kg",
    "sellPrice": "$60",
    "pricePerCell": "60"
  },
  {
    "id": "mechanical-parts",
    "name": "Mechanical Parts",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.5 kg",
    "sellPrice": "$60",
    "pricePerCell": "60"
  },
  {
    "id": "multimeter",
    "name": "Multimeter",
    "category": "Loot / Trade",
    "gridSize": "1x2",
    "weight": "0.5 kg",
    "sellPrice": "$60",
    "pricePerCell": "30"
  },
  {
    "id": "plumbing-parts",
    "name": "Plumbing Parts",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.5 kg",
    "sellPrice": "$60",
    "pricePerCell": "60"
  },
  {
    "id": "toolset",
    "name": "Toolset",
    "category": "Loot / Trade",
    "gridSize": "2x2",
    "weight": "1.6 kg",
    "sellPrice": "$60",
    "pricePerCell": "15"
  },
  {
    "id": "broken-jigsaw",
    "name": "Broken Jigsaw",
    "category": "Loot / Trade",
    "gridSize": "2x2",
    "weight": "2 kg",
    "sellPrice": "$59.2",
    "pricePerCell": "$15"
  },
  {
    "id": "multitool",
    "name": "Multitool",
    "category": "Loot / Trade",
    "gridSize": "1x2",
    "weight": "0.27 kg",
    "sellPrice": "$57.6",
    "pricePerCell": "$29"
  },
  {
    "id": "rubber-renue",
    "name": "Rubber Renue",
    "category": "Loot / Trade",
    "gridSize": "1x2",
    "weight": "1 kg",
    "sellPrice": "$54.4",
    "pricePerCell": "$27"
  },
  {
    "id": "aramid-cloth",
    "name": "Aramid Cloth",
    "category": "Loot / Trade",
    "gridSize": "2x1",
    "weight": "0.061 kg",
    "sellPrice": "$45.6",
    "pricePerCell": "$23"
  },
  {
    "id": "ammonium-chloride",
    "name": "Ammonium Chloride",
    "category": "Loot / Trade",
    "gridSize": "1x2",
    "weight": "0.5",
    "sellPrice": "$45",
    "pricePerCell": "$23"
  },
  {
    "id": "chloroform",
    "name": "Chloroform",
    "category": "Loot / Trade",
    "gridSize": "1x2",
    "weight": "1",
    "sellPrice": "$45",
    "pricePerCell": "$23"
  },
  {
    "id": "circuit-board",
    "name": "Circuit Board",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.3 kg",
    "sellPrice": "$45",
    "pricePerCell": "45"
  },
  {
    "id": "glass",
    "name": "Glass",
    "category": "Loot / Trade",
    "gridSize": "2x2",
    "weight": "1 kg",
    "sellPrice": "$45",
    "pricePerCell": "11"
  },
  {
    "id": "refrigerant",
    "name": "Refrigerant",
    "category": "Loot / Trade",
    "gridSize": "1x2",
    "weight": "1.5 kg",
    "sellPrice": "$45",
    "pricePerCell": "$23"
  },
  {
    "id": "sodium-citrate",
    "name": "Sodium Citrate",
    "category": "Loot / Trade",
    "gridSize": "1x2",
    "weight": "0.55",
    "sellPrice": "$45",
    "pricePerCell": "$23"
  },
  {
    "id": "stainless-steel-sheet",
    "name": "Stainless Steel Sheet",
    "category": "Loot / Trade",
    "gridSize": "2x1",
    "weight": "1 kg",
    "sellPrice": "$45",
    "pricePerCell": "$23"
  },
  {
    "id": "sulfuric-acid",
    "name": "Sulfuric Acid",
    "category": "Loot / Trade",
    "gridSize": "2x2",
    "weight": "5.03",
    "sellPrice": "$39.6",
    "pricePerCell": "$10"
  },
  {
    "id": "motorbike-battery",
    "name": "Motorbike Battery",
    "category": "Loot / Trade",
    "gridSize": "2x1",
    "weight": "2 kg",
    "sellPrice": "$39.2",
    "pricePerCell": "$20"
  },
  {
    "id": "sodium-carbonate",
    "name": "Sodium Carbonate",
    "category": "Loot / Trade",
    "gridSize": "1x2",
    "weight": "0.55",
    "sellPrice": "$36",
    "pricePerCell": "18"
  },
  {
    "id": "propane-bottle",
    "name": "Propane Bottle",
    "category": "Loot / Trade",
    "gridSize": "1x2",
    "weight": "0.453 kg",
    "sellPrice": "$33.6",
    "pricePerCell": "$17"
  },
  {
    "id": "jumper-cables",
    "name": "Jumper Cables",
    "category": "Loot / Trade",
    "gridSize": "2x2",
    "weight": "2.34 kg",
    "sellPrice": "$32.8",
    "pricePerCell": "$8"
  },
  {
    "id": "industrial-solvent",
    "name": "Industrial Solvent",
    "category": "Loot / Trade",
    "gridSize": "2x2",
    "weight": "3.8 kg",
    "sellPrice": "$31.2",
    "pricePerCell": "$8"
  },
  {
    "id": "aniline",
    "name": "Aniline",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.05 kg",
    "sellPrice": "$30",
    "pricePerCell": "30"
  },
  {
    "id": "bone-density-stimulant",
    "name": "Bone Density Stimulant",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.05 kg",
    "sellPrice": "$30",
    "pricePerCell": "30"
  },
  {
    "id": "bromopyridine",
    "name": "Bromopyridine",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.5 kg",
    "sellPrice": "$30",
    "pricePerCell": "30"
  },
  {
    "id": "human-growth-hormone",
    "name": "Human Growth Hormone",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.05 kg",
    "sellPrice": "$30",
    "pricePerCell": "30"
  },
  {
    "id": "iron-sucrose",
    "name": "Iron Sucrose",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.05 kg",
    "sellPrice": "$30",
    "pricePerCell": "30"
  },
  {
    "id": "laboratory-flask",
    "name": "Laboratory Flask",
    "category": "Loot / Trade",
    "gridSize": "1x2",
    "weight": "0.1 kg",
    "sellPrice": "$30",
    "pricePerCell": "15"
  },
  {
    "id": "methanol",
    "name": "Methanol",
    "category": "Loot / Trade",
    "gridSize": "1x2",
    "weight": "0.5 kg",
    "sellPrice": "$30",
    "pricePerCell": "15"
  },
  {
    "id": "methylene-blue",
    "name": "Methylene Blue",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.05 kg",
    "sellPrice": "$30",
    "pricePerCell": "30"
  },
  {
    "id": "purified-water",
    "name": "Purified Water",
    "category": "Loot / Trade",
    "gridSize": "2x2",
    "weight": "5",
    "sellPrice": "$30",
    "pricePerCell": "$8"
  },
  {
    "id": "soldering-iron",
    "name": "Soldering Iron",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.3 kg",
    "sellPrice": "$30",
    "pricePerCell": "30"
  },
  {
    "id": "steel",
    "name": "Steel",
    "category": "Loot / Trade",
    "gridSize": "2x1",
    "weight": "1 kg",
    "sellPrice": "$30",
    "pricePerCell": "15"
  },
  {
    "id": "theophylline",
    "name": "Theophylline",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.1 kg",
    "sellPrice": "$30",
    "pricePerCell": "30"
  },
  {
    "id": "vitamin-b12",
    "name": "Vitamin B12",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.25 kg",
    "sellPrice": "$30",
    "pricePerCell": "30"
  },
  {
    "id": "carton-of-tahirs-cigarettes",
    "name": "Carton of Tahirs Cigarettes",
    "category": "Loot / Trade",
    "gridSize": "3x1",
    "weight": "0.25 kg",
    "sellPrice": "$29.6",
    "pricePerCell": "$10"
  },
  {
    "id": "pack-of-premium-coffee",
    "name": "Pack of Premium Coffee",
    "category": "Loot / Trade",
    "gridSize": "1x2",
    "weight": "0.6 kg",
    "sellPrice": "$29.6",
    "pricePerCell": "$15"
  },
  {
    "id": "water-purification-tablets",
    "name": "Water Purification Tablets",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.125 kg",
    "sellPrice": "$29.6",
    "pricePerCell": "$30"
  },
  {
    "id": "refillable-lighter",
    "name": "Refillable Lighter",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.08 kg",
    "sellPrice": "$28.8",
    "pricePerCell": "$29"
  },
  {
    "id": "broken-handsaw",
    "name": "Broken Handsaw",
    "category": "Loot / Trade",
    "gridSize": "2x2",
    "weight": "0.68 kg",
    "sellPrice": "$26.4",
    "pricePerCell": "$7"
  },
  {
    "id": "low-grade-gunpowder",
    "name": "Low-Grade Gunpowder",
    "category": "Loot / Trade",
    "gridSize": "1x2",
    "weight": "0.45 kg",
    "sellPrice": "$24.8",
    "pricePerCell": "$12"
  },
  {
    "id": "fuel-canister",
    "name": "Fuel Canister",
    "category": "Loot / Trade",
    "gridSize": "2x2",
    "weight": "5 kg",
    "sellPrice": "$23.2",
    "pricePerCell": "$6"
  },
  {
    "id": "brake-fluid",
    "name": "Brake Fluid",
    "category": "Loot / Trade",
    "gridSize": "2x2",
    "weight": "3.8 kg",
    "sellPrice": "$22.4",
    "pricePerCell": "$6"
  },
  {
    "id": "bleach",
    "name": "Bleach",
    "category": "Loot / Trade",
    "gridSize": "1x2",
    "weight": "3.57 kg",
    "sellPrice": "$20.8",
    "pricePerCell": "$10"
  },
  {
    "id": "naosaoad-100%-clean",
    "name": "Naosaoad 100% Clean",
    "category": "Loot / Trade",
    "gridSize": "1x2",
    "weight": "0.5 kg",
    "sellPrice": "$19.2",
    "pricePerCell": "$10"
  },
  {
    "id": "drain-cleaner",
    "name": "Drain Cleaner",
    "category": "Loot / Trade",
    "gridSize": "2x2",
    "weight": "5 kg",
    "sellPrice": "$16",
    "pricePerCell": "$4"
  },
  {
    "id": "un-medical-tools",
    "name": "UN Medical Tools",
    "category": "Loot / Trade",
    "gridSize": "2x1",
    "weight": "0.5 kg",
    "sellPrice": "$16",
    "pricePerCell": "$8"
  },
  {
    "id": "analog-indicator",
    "name": "Analog Indicator",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.25 kg",
    "sellPrice": "$15",
    "pricePerCell": "15"
  },
  {
    "id": "burner-head",
    "name": "Burner Head",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.25 kg",
    "sellPrice": "$15",
    "pricePerCell": "15"
  },
  {
    "id": "citric-acid",
    "name": "Citric Acid",
    "category": "Loot / Trade",
    "gridSize": "1x2",
    "weight": "1",
    "sellPrice": "$15",
    "pricePerCell": "$8"
  },
  {
    "id": "empty-autoinjector",
    "name": "Empty Autoinjector",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.09 kg",
    "sellPrice": "$15",
    "pricePerCell": "15"
  },
  {
    "id": "fabrics",
    "name": "Fabrics",
    "category": "Loot / Trade",
    "gridSize": "3x1",
    "weight": "1 kg",
    "sellPrice": "$15",
    "pricePerCell": "5"
  },
  {
    "id": "garden-lime",
    "name": "Garden Lime",
    "category": "Loot / Trade",
    "gridSize": "2x2",
    "weight": "3",
    "sellPrice": "$15",
    "pricePerCell": "$4"
  },
  {
    "id": "glucose",
    "name": "Glucose",
    "category": "Loot / Trade",
    "gridSize": "1x2",
    "weight": "1 kg",
    "sellPrice": "$15",
    "pricePerCell": "$8"
  },
  {
    "id": "motor-oil",
    "name": "Motor Oil",
    "category": "Loot / Trade",
    "gridSize": "2x2",
    "weight": "4.3 kg",
    "sellPrice": "$15",
    "pricePerCell": "$4"
  },
  {
    "id": "pc-fan",
    "name": "PC Fan",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.12 kg",
    "sellPrice": "$15",
    "pricePerCell": "15"
  },
  {
    "id": "plastics",
    "name": "Plastics",
    "category": "Loot / Trade",
    "gridSize": "1x2",
    "weight": "1 kg",
    "sellPrice": "$15",
    "pricePerCell": "$8"
  },
  {
    "id": "saline",
    "name": "Saline",
    "category": "Loot / Trade",
    "gridSize": "1x2",
    "weight": "1",
    "sellPrice": "$15",
    "pricePerCell": "$8"
  },
  {
    "id": "silicone-sealant",
    "name": "Silicone Sealant",
    "category": "Loot / Trade",
    "gridSize": "1x2",
    "weight": "0.75 kg",
    "sellPrice": "$15",
    "pricePerCell": "$8"
  },
  {
    "id": "wood",
    "name": "Wood",
    "category": "Loot / Trade",
    "gridSize": "3x1",
    "weight": "0.5 kg",
    "sellPrice": "$15",
    "pricePerCell": "5"
  },
  {
    "id": "camouflage-fabric",
    "name": "Camouflage Fabric",
    "category": "Loot / Trade",
    "gridSize": "2x1",
    "weight": "0.48 kg",
    "sellPrice": "$11.2",
    "pricePerCell": "$6"
  },
  {
    "id": "hand-mirror",
    "name": "Hand Mirror",
    "category": "Loot / Trade",
    "gridSize": "1x2",
    "weight": "0.4 kg",
    "sellPrice": "$10.4",
    "pricePerCell": "$5"
  },
  {
    "id": "phone-charger",
    "name": "Phone Charger",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.075 kg",
    "sellPrice": "$10.4",
    "pricePerCell": "$10"
  },
  {
    "id": "paracord",
    "name": "Paracord",
    "category": "Loot / Trade",
    "gridSize": "2x1",
    "weight": "0.1 kg",
    "sellPrice": "$9.6",
    "pricePerCell": "$5"
  },
  {
    "id": "weapon-oil",
    "name": "Weapon Oil",
    "category": "Loot / Trade",
    "gridSize": "1x2",
    "weight": "0.272 kg",
    "sellPrice": "$9.6",
    "pricePerCell": "$5"
  },
  {
    "id": "petrolatum",
    "name": "White Petrolatum",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.37 kg",
    "sellPrice": "$9.6",
    "pricePerCell": "$10"
  },
  {
    "id": "broken-wrench",
    "name": "Broken Wrench",
    "category": "Loot / Trade",
    "gridSize": "1x2",
    "weight": "0.122 kg",
    "sellPrice": "$8",
    "pricePerCell": "$4"
  },
  {
    "id": "pack-of-aa-batteries",
    "name": "Pack of AA Batteries",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.024 kg",
    "sellPrice": "$8",
    "pricePerCell": "$8"
  },
  {
    "id": "broken-carpentry-hammer",
    "name": "Broken Carpentry Hammer",
    "category": "Loot / Trade",
    "gridSize": "1x2",
    "weight": "0.312 kg",
    "sellPrice": "$7.2",
    "pricePerCell": "$4"
  },
  {
    "id": "broken-screwdriver",
    "name": "Broken Screwdriver",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.12 kg",
    "sellPrice": "$7.2",
    "pricePerCell": "$7"
  },
  {
    "id": "insect-repellant-spray",
    "name": "Insect Repellant Spray",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.258 kg",
    "sellPrice": "$7.2",
    "pricePerCell": "$7"
  },
  {
    "id": "tahirs-cigarettes",
    "name": "Tahirs Cigarettes",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.013 kg",
    "sellPrice": "$5.6",
    "pricePerCell": "$6"
  },
  {
    "id": "deck-of-cards",
    "name": "Deck of Cards",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.088 kg",
    "sellPrice": "$3.2",
    "pricePerCell": "$3"
  },
  {
    "id": "fishing-line",
    "name": "Fishing Line",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.13 kg",
    "sellPrice": "$3.2",
    "pricePerCell": "$3"
  },
  {
    "id": "lamp-oil",
    "name": "Lamp Oil",
    "category": "Loot / Trade",
    "gridSize": "1x2",
    "weight": "1 kg",
    "sellPrice": "$3.2",
    "pricePerCell": "$2"
  },
  {
    "id": "lighter",
    "name": "Lighter",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.04 kg",
    "sellPrice": "$1.6",
    "pricePerCell": "$2"
  },
  {
    "id": "sewing-set",
    "name": "Sewing Kit",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.146 kg",
    "sellPrice": "$1.6",
    "pricePerCell": "$2"
  },
  {
    "id": "thermal-blanket",
    "name": "Thermal Blanket",
    "category": "Loot / Trade",
    "gridSize": "1x1",
    "weight": "0.057 kg",
    "sellPrice": "$1.6",
    "pricePerCell": "$2"
  }
];

export const ARCHIVE_SQUAD_STRIKE: ArchiveSquadStrikeEntry[] = [
  {
    "id": "binary-choir",
    "name": "Binary Choir",
    "vendor": "Handshake",
    "location": "Fort Narith"
  },
  {
    "id": "blacktop-wasteland",
    "name": "Blacktop Wasteland",
    "vendor": "Lab Rat",
    "location": "Pha Lang Airfield"
  },
  {
    "id": "coastal-signals",
    "name": "Coastal Signals",
    "vendor": "Lab Rat",
    "location": "Tiger Bay"
  },
  {
    "id": "concrete-whisperers",
    "name": "Concrete Whisperers",
    "vendor": "Lab Rat",
    "location": "Fort Narith"
  },
  {
    "id": "cutthroat-island",
    "name": "Cutthroat Island",
    "vendor": "Gunny",
    "location": "Ban Pa"
  },
  {
    "id": "data-in-the-sawdust",
    "name": "Data in the Sawdust",
    "vendor": "Lab Rat",
    "location": "Sawmill"
  },
  {
    "id": "dirge-of-the-fallen",
    "name": "Dirge of the Fallen",
    "vendor": "Gunny",
    "location": "YBL-1"
  },
  {
    "id": "enigmatic-unlra",
    "name": "Enigmatic UNLRA",
    "vendor": "Lab Rat",
    "location": "Fort Narith"
  },
  {
    "id": "ethical-issues",
    "name": "Ethical Issues",
    "vendor": "Lab Rat",
    "location": "Fort Narith"
  },
  {
    "id": "ethnographer",
    "name": "Ethnographer",
    "vendor": "Handshake",
    "location": "Ban Pa"
  },
  {
    "id": "fragile-goods",
    "name": "Fragile Goods",
    "vendor": "Handshake",
    "location": "Midnight Sapphire"
  },
  {
    "id": "groundbreaking-prototype",
    "name": "Groundbreaking Prototype",
    "vendor": "Gunny",
    "location": "Fort Narith"
  },
  {
    "id": "hacking-to-the-limit",
    "name": "Hacking to the Limit",
    "vendor": "Handshake",
    "location": "Pha Lang Airfield"
  },
  {
    "id": "his-majestys-secrets",
    "name": "His Majesty's Secrets",
    "vendor": "Handshake",
    "location": "Blue Lagoon"
  },
  {
    "id": "its-like-cutting",
    "name": "It's Like Cutting",
    "vendor": "Handshake",
    "location": "Fort Narith"
  },
  {
    "id": "lagoon-shipment",
    "name": "Lagoon Shipment",
    "vendor": "Gunny",
    "location": "Blue Lagoon"
  },
  {
    "id": "mall-quickie",
    "name": "Mall Quickie",
    "vendor": "Handshake",
    "location": "Tiger Bay"
  },
  {
    "id": "mob-job",
    "name": "Mob Job",
    "vendor": "Handshake",
    "location": "Pha Lang Airfield"
  },
  {
    "id": "on-the-green",
    "name": "On the Green",
    "vendor": "Handshake",
    "location": "Midnight Sapphire"
  },
  {
    "id": "paperwork",
    "name": "Paperwork",
    "vendor": "Handshake",
    "location": "YBL-1"
  },
  {
    "id": "resorting-to-help",
    "name": "Resorting to Help",
    "vendor": "Handshake",
    "location": "Midnight Sapphire"
  },
  {
    "id": "scandal-snatcher",
    "name": "Scandal Snatcher",
    "vendor": "Handshake",
    "location": "Midnight Sapphire"
  },
  {
    "id": "shimmer-on-the-surface",
    "name": "Shimmer on the Surface",
    "vendor": "Lab Rat",
    "location": "Blue Lagoon"
  },
  {
    "id": "shoot-your-shot",
    "name": "Shoot Your Shot",
    "vendor": "Handshake",
    "location": "Hunter's Paradise"
  },
  {
    "id": "shopping-spree",
    "name": "Shopping Spree",
    "vendor": "Handshake",
    "location": "Tiger Bay"
  },
  {
    "id": "specter-in-the-computer",
    "name": "Specter in the Computer",
    "vendor": "Handshake",
    "location": "Tiger Bay"
  },
  {
    "id": "static-echoes",
    "name": "Static Echoes",
    "vendor": "Handshake",
    "location": "Fort Narith"
  },
  {
    "id": "stationary-targets",
    "name": "Stationary Targets",
    "vendor": "Lab Rat",
    "location": "Hunter's Paradise"
  },
  {
    "id": "technoarcheologist",
    "name": "Technoarcheologist",
    "vendor": "Handshake",
    "location": "YBL-1"
  },
  {
    "id": "the-scent-of-salt-and-horror",
    "name": "The Scent of Salt and Horror",
    "vendor": "Lab Rat",
    "location": "Ban Pa"
  },
  {
    "id": "victor-charlie-heritage",
    "name": "Victor Charlie Heritage",
    "vendor": "Gunny",
    "location": "Hunter's Paradise"
  },
  {
    "id": "weapon-redistribution",
    "name": "Weapon Redistribution",
    "vendor": "Gunny",
    "location": "Sawmill"
  }
];

export const ARCHIVE_SQUAD_ITEMS: ArchiveSquadItemEntry[] = [
  {
    "id": "box-of-ids",
    "name": "Box of IDs",
    "gridSize": "2x2",
    "weight": "1.4 kg"
  },
  {
    "id": "compromising-folder",
    "name": "Compromising Folder",
    "gridSize": "1x1",
    "weight": "0.08 kg"
  },
  {
    "id": "eugene-l.-fleming-file",
    "name": "Eugene L. Fleming File",
    "gridSize": "1x1",
    "weight": "0.03 kg"
  },
  {
    "id": "first-drug-note",
    "name": "First Drug Note",
    "gridSize": "1x1",
    "weight": "0.03 kg"
  },
  {
    "id": "first-medical-samples",
    "name": "First Medical Samples",
    "gridSize": "3x2",
    "weight": "22 kg"
  },
  {
    "id": "first-military-box",
    "name": "First Military Box",
    "gridSize": "3x2",
    "weight": "21.5 kg"
  },
  {
    "id": "first-prototype-part-crate",
    "name": "First Prototype Part Crate",
    "gridSize": "3x2",
    "weight": "20 kg"
  },
  {
    "id": "first-stolen-box",
    "name": "First Stolen Box",
    "gridSize": "3x2",
    "weight": "19 kg"
  },
  {
    "id": "first-supply-box",
    "name": "First Supply Box",
    "gridSize": "3x2",
    "weight": "21 kg"
  },
  {
    "id": "first-supply-box-victor-charlie-heritage",
    "name": "First Supply Box (Victor Charlie Heritage)",
    "gridSize": null,
    "weight": "???kg"
  },
  {
    "id": "first-suspicious-package",
    "name": "First Suspicious Package",
    "gridSize": "2x2",
    "weight": "10.2 kg"
  },
  {
    "id": "first-weapon-cargo-crate",
    "name": "First Weapon Cargo Crate",
    "gridSize": "3x2",
    "weight": "21.5 kg"
  },
  {
    "id": "floppy-disks",
    "name": "Floppy Disks",
    "gridSize": "1x1",
    "weight": "0.15 kg"
  },
  {
    "id": "fourth-military-box",
    "name": "Fourth Military Box",
    "gridSize": "3x2",
    "weight": "21.5 kg"
  },
  {
    "id": "fourth-suspicious-package",
    "name": "Fourth Suspicious Package",
    "gridSize": "2x2",
    "weight": "8 kg"
  },
  {
    "id": "gang-folder",
    "name": "Gang Folder",
    "gridSize": "1x1",
    "weight": "0.25 kg"
  },
  {
    "id": "gang-note",
    "name": "Gang Note",
    "gridSize": "1x1",
    "weight": "0.03 kg"
  },
  {
    "id": "hacking-tool",
    "name": "Hacking Tool",
    "gridSize": "1x1",
    "weight": "0.04 kg"
  },
  {
    "id": "intel-folder",
    "name": "Intel Folder",
    "gridSize": "1x1",
    "weight": "0.1 kg"
  },
  {
    "id": "interrogation-transcript-its-like-cutting",
    "name": "Interrogation Transcript (It's Like Cutting)",
    "gridSize": null,
    "weight": "???kg"
  },
  {
    "id": "laf-documents",
    "name": "LAF Documents",
    "gridSize": "1x1",
    "weight": "0.01 kg"
  },
  {
    "id": "laf-hardware-key-technoarcheologist",
    "name": "LAF Hardware Key (Technoarcheologist)",
    "gridSize": null,
    "weight": "???kg"
  },
  {
    "id": "laf-suitcase",
    "name": "LAF Suitcase",
    "gridSize": "2x2",
    "weight": "3 kg"
  },
  {
    "id": "list-of-names-his-majestys-secrets",
    "name": "List of Names (His Majesty's Secrets)",
    "gridSize": null,
    "weight": "???kg"
  },
  {
    "id": "list-of-names-mob-job",
    "name": "List of Names (Mob Job)",
    "gridSize": null,
    "weight": "???kg"
  },
  {
    "id": "medallion",
    "name": "Medallion",
    "gridSize": "1x1",
    "weight": "0.2 kg"
  },
  {
    "id": "metal-suitcase",
    "name": "Metal Suitcase",
    "gridSize": null,
    "weight": "???kg"
  },
  {
    "id": "micro-sd-autocracker",
    "name": "Micro SD Autocracker",
    "gridSize": "1x1",
    "weight": "0.01 kg"
  },
  {
    "id": "micro-sd-autocracker-003",
    "name": "Micro SD Autocracker 003",
    "gridSize": "1x1",
    "weight": "0.02 kg"
  },
  {
    "id": "military-suitcase",
    "name": "Military Suitcase",
    "gridSize": "2x2",
    "weight": "9 kg"
  },
  {
    "id": "mysterious-cargo-crate",
    "name": "Mysterious Cargo Crate",
    "gridSize": "3x2",
    "weight": "6 kg"
  },
  {
    "id": "old-diary",
    "name": "Old Diary",
    "gridSize": "1x1",
    "weight": "0.105 kg"
  },
  {
    "id": "old-hard-disk-drive",
    "name": "Old Hard Disk Drive",
    "gridSize": "1x1",
    "weight": "0.5 kg"
  },
  {
    "id": "prisoner-info-folder-193",
    "name": "Prisoner Info Folder 193",
    "gridSize": "1x1",
    "weight": "0.01 kg"
  },
  {
    "id": "prisoner-info-folder-251",
    "name": "Prisoner Info Folder 251",
    "gridSize": "1x1",
    "weight": "0.01 kg"
  },
  {
    "id": "prisoner-info-folder-712",
    "name": "Prisoner Info Folder 712",
    "gridSize": "1x1",
    "weight": "0.01 kg"
  },
  {
    "id": "second-drug-note",
    "name": "Second Drug Note",
    "gridSize": "1x1",
    "weight": "0.03 kg"
  },
  {
    "id": "second-medical-samples",
    "name": "Second Medical Samples",
    "gridSize": "3x2",
    "weight": "18 kg"
  },
  {
    "id": "second-military-box",
    "name": "Second Military Box",
    "gridSize": "3x2",
    "weight": "21.5 kg"
  },
  {
    "id": "second-prototype-part-crate",
    "name": "Second Prototype Part Crate",
    "gridSize": "3x3",
    "weight": "???kg"
  },
  {
    "id": "second-stolen-box",
    "name": "Second Stolen Box",
    "gridSize": "3x2",
    "weight": "20.4 kg"
  },
  {
    "id": "second-supply-box",
    "name": "Second Supply Box",
    "gridSize": "3x2",
    "weight": "20 kg"
  },
  {
    "id": "second-supply-box-victor-charlie-heritage",
    "name": "Second Supply Box (Victor Charlie Heritage)",
    "gridSize": null,
    "weight": "???kg"
  },
  {
    "id": "second-suspicious-package",
    "name": "Second Suspicious Package",
    "gridSize": "2x2",
    "weight": "9.5 kg"
  },
  {
    "id": "second-weapon-cargo-crate",
    "name": "Second Weapon Cargo Crate",
    "gridSize": "3x2",
    "weight": "19 kg"
  },
  {
    "id": "third-military-box",
    "name": "Third Military Box",
    "gridSize": "3x2",
    "weight": "21.5 kg"
  },
  {
    "id": "third-stolen-box",
    "name": "Third Stolen Box",
    "gridSize": "3x2",
    "weight": "21.5 kg"
  },
  {
    "id": "third-supply-box",
    "name": "Third Supply Box",
    "gridSize": "3x2",
    "weight": "18 kg"
  },
  {
    "id": "third-supply-box-victor-charlie-heritage",
    "name": "Third Supply Box (Victor Charlie Heritage)",
    "gridSize": null,
    "weight": "???kg"
  },
  {
    "id": "third-suspicious-package",
    "name": "Third Suspicious Package",
    "gridSize": "2x2",
    "weight": "9 kg"
  },
  {
    "id": "third-weapon-cargo-crate",
    "name": "Third Weapon Cargo Crate",
    "gridSize": "3x2",
    "weight": "22 kg"
  },
  {
    "id": "transcript-of-conversations",
    "name": "Transcript of Conversations",
    "gridSize": "1x1",
    "weight": "0.03 kg"
  },
  {
    "id": "usb-drive-autocracker",
    "name": "USB Drive Autocracker",
    "gridSize": "1x1",
    "weight": "0.04 kg"
  },
  {
    "id": "usb-drive-autocracker-001",
    "name": "USB Drive Autocracker 001",
    "gridSize": "1x1",
    "weight": "0.04 kg"
  },
  {
    "id": "usb-drive-autocracker-002",
    "name": "USB Drive Autocracker 002",
    "gridSize": "1x1",
    "weight": "0.04 kg"
  }
];

export const ARCHIVE_XP_ACTIONS: ArchiveXpActionEntry[] = [
  {
    "id": "laf-commanders",
    "category": "Lamang enemies kill EXP",
    "action": "LAF Commanders",
    "xp": 30
  },
  {
    "id": "laf-soldiers",
    "category": "Lamang enemies kill EXP",
    "action": "LAF Soldiers",
    "xp": 15
  },
  {
    "id": "rebels-bandits-tier-1-areas",
    "category": "Lamang enemies kill EXP",
    "action": "Lamang Liberation Army / Bandits (Tier 1 areas)",
    "xp": 5
  },
  {
    "id": "landing-zones",
    "category": "Discovering POIs",
    "action": "Landing Zones",
    "xp": 150
  },
  {
    "id": "major-combat-outposts",
    "category": "Capturing Combat Outposts",
    "action": "Major Combat Outposts",
    "xp": 150
  },
  {
    "id": "minor-combat-outposts",
    "category": "Capturing Combat Outposts",
    "action": "Minor Combat Outposts",
    "xp": 50
  },
  {
    "id": "other-pmcs-players",
    "category": "Lamang enemies kill EXP",
    "action": "Other PMCs (Players)",
    "xp": 200
  },
  {
    "id": "points-of-interest",
    "category": "Discovering POIs",
    "action": "Points of Interest",
    "xp": 30
  },
  {
    "id": "rebels-bandits-tier-2-and-3-areas",
    "category": "Lamang enemies kill EXP",
    "action": "Rebels/Bandits (Tier 2 and 3 areas)",
    "xp": 10
  }
];

export const ARCHIVE_XP_LEVELS: ArchiveXpLevelEntry[] = [
  {
    "level": 1,
    "threshold": 0,
    "rewards": [
      "5.11 - Competition Shooting",
      "Tactical Gloves (Blue)",
      "Tactical Gloves (Orange)",
      "AKU - Conero GTX",
      "Lowa - Zephyr GTX Mid TF",
      "US BDU (Woodland)",
      "Clawgear - Raider Mk IV (Olive)",
      "Clawgear - Raider Mk IV (Coyote)",
      "Long Sleeves Tactical",
      "Clawgear - Combat Operator (Ranger Green)",
      "Clawgear - Combat Operator (Coyote)"
    ]
  },
  {
    "level": 2,
    "threshold": 600,
    "rewards": []
  },
  {
    "level": 3,
    "threshold": 1500,
    "rewards": [
      "Tactical T-shirt (Green)"
    ]
  },
  {
    "level": 4,
    "threshold": 2700,
    "rewards": []
  },
  {
    "level": 5,
    "threshold": 4200,
    "rewards": [
      "Crye Precision - G3 (Multicam)",
      "Mechanix Wear - Original"
    ]
  },
  {
    "level": 6,
    "threshold": 6000,
    "rewards": []
  },
  {
    "level": 7,
    "threshold": 8100,
    "rewards": []
  },
  {
    "level": 8,
    "threshold": 10500,
    "rewards": [
      "Clawgear - Combat Operator (Black)"
    ]
  },
  {
    "level": 9,
    "threshold": 13200,
    "rewards": []
  },
  {
    "level": 10,
    "threshold": 16200,
    "rewards": [
      "Crye Precision - G3 (Ranger Green)",
      "Crye Precision - G4 (Ranger Green)"
    ]
  },
  {
    "level": 11,
    "threshold": 19500,
    "rewards": []
  },
  {
    "level": 12,
    "threshold": 23100,
    "rewards": []
  },
  {
    "level": 13,
    "threshold": 27000,
    "rewards": [
      "Clawgear - Raider Mk IV (Flecktarn)"
    ]
  },
  {
    "level": 14,
    "threshold": 31200,
    "rewards": []
  },
  {
    "level": 15,
    "threshold": 35700,
    "rewards": [
      "Tactical T-shirt",
      "Jeans (Gray)",
      "Pentagon - Hybrid (Black)"
    ]
  },
  {
    "level": 16,
    "threshold": 40500,
    "rewards": []
  },
  {
    "level": 17,
    "threshold": 45600,
    "rewards": []
  },
  {
    "level": 18,
    "threshold": 51000,
    "rewards": [
      "Crye Precision - G3 (Multicam)"
    ]
  },
  {
    "level": 19,
    "threshold": 56700,
    "rewards": []
  },
  {
    "level": 20,
    "threshold": 62700,
    "rewards": [
      "Long Sleeves",
      "Mechanix Wear - Fast Fit",
      "Clawgear - Raider Mk IV (Woodland)",
      "Pentagon - Hybrid"
    ]
  },
  {
    "level": 21,
    "threshold": 69000,
    "rewards": []
  },
  {
    "level": 22,
    "threshold": 75600,
    "rewards": []
  },
  {
    "level": 23,
    "threshold": 82500,
    "rewards": [
      "Crye Precision - G4 (Multicam)"
    ]
  },
  {
    "level": 24,
    "threshold": 89700,
    "rewards": []
  },
  {
    "level": 25,
    "threshold": 97200,
    "rewards": [
      "US Army - Blouse (M64 Vietnam)",
      "US BDU (Olive)"
    ]
  },
  {
    "level": 26,
    "threshold": 105000,
    "rewards": []
  },
  {
    "level": 27,
    "threshold": 113100,
    "rewards": []
  },
  {
    "level": 28,
    "threshold": 121500,
    "rewards": [
      "Clawgear - Raider Mk IV (Multicam Black)"
    ]
  },
  {
    "level": 29,
    "threshold": 130200,
    "rewards": []
  },
  {
    "level": 30,
    "threshold": 139200,
    "rewards": [
      "Long Sleeves Tactical (Blue)",
      "Jeans (Blue)",
      "Tactical Gloves (Green)"
    ]
  },
  {
    "level": 31,
    "threshold": 148500,
    "rewards": []
  },
  {
    "level": 32,
    "threshold": 158100,
    "rewards": []
  },
  {
    "level": 33,
    "threshold": 168000,
    "rewards": [
      "US BDU (Desert)"
    ]
  },
  {
    "level": 34,
    "threshold": 178200,
    "rewards": []
  },
  {
    "level": 35,
    "threshold": 188700,
    "rewards": [
      "Crye Precision - G4 (Multicam Black)"
    ]
  },
  {
    "level": 36,
    "threshold": 199500,
    "rewards": []
  },
  {
    "level": 37,
    "threshold": 210600,
    "rewards": []
  },
  {
    "level": 38,
    "threshold": 222000,
    "rewards": [
      "Clawgear - Combat Operator"
    ]
  },
  {
    "level": 39,
    "threshold": 233700,
    "rewards": []
  },
  {
    "level": 40,
    "threshold": 245700,
    "rewards": [
      "Functional Shirt",
      "Arcteryx Leaf - Assault Pant AR gen 2 (Multicam)",
      "Mechanix Wear - M-Pact Covert"
    ]
  },
  {
    "level": 41,
    "threshold": 258000,
    "rewards": []
  },
  {
    "level": 42,
    "threshold": 270600,
    "rewards": []
  },
  {
    "level": 43,
    "threshold": 283500,
    "rewards": [
      "Tactical Jeans - Rappel Seat"
    ]
  },
  {
    "level": 44,
    "threshold": 296700,
    "rewards": []
  },
  {
    "level": 45,
    "threshold": 310200,
    "rewards": [
      "Crye Precision - G4 (Multicam Black)",
      "Magnum - Wild-Fire Tactical"
    ]
  },
  {
    "level": 46,
    "threshold": 324000,
    "rewards": []
  },
  {
    "level": 47,
    "threshold": 338100,
    "rewards": []
  },
  {
    "level": 48,
    "threshold": 352500,
    "rewards": []
  },
  {
    "level": 49,
    "threshold": 367200,
    "rewards": []
  },
  {
    "level": 50,
    "threshold": 382200,
    "rewards": [
      "Long Sleeves (Black)",
      "Tactical Jeans - Rappel Seat (Black)",
      "Mechanix Wear - Original (Black)"
    ]
  }
];

export const ARCHIVE_FACTIONS: ArchiveFactionEntry[] = [
  {
    "id": "bandits",
    "name": "Bandits",
    "description": "The bandits have multiple different organized crime groups across the island. They all different names, backgrounds, histories, equipment, weapons, and combat styles."
  },
  {
    "id": "crimson-shield-international",
    "name": "Crimson Shield International",
    "description": "This Private Military Company rose to infamy during the early stages of the Syrian Civil War. While they boast an impressive 95% success rate, some of their methods can be seen as somewhat questionable, often resulting in collateral damage. That said, no one can deny their effectiveness and cold-blooded approach to any job that needs to be done. this gung-ho nature attracts not just ex-military personnel but basically anyone with a lust for adventure and action."
  },
  {
    "id": "lamang-army-forces",
    "name": "Lamang Armed Forces",
    "description": "The Lamang Armed Forces (LAF) is the country's national military force and under command by its president. Since the Event, the LAF were ordered to stay behind and guard high-value targets while also engaging in skirmishes with different armed organizations both foreign and domestic such as Lamang Liberation Army insurgents , Bandits and private military companies . Most LAF personnel are mostly soldier grunts to officer rank commanders from its Army branch."
  },
  {
    "id": "lamang-liberation-army",
    "name": "Lamang Liberation Army",
    "description": "Local anti-government armed insurgency group AKA rebel militia group."
  },
  {
    "id": "lamang-recovery-initiative",
    "name": "Lamang Recovery Initiative",
    "description": "Found and funded by a tech billionaire, LRI publicizes itself as a strictly philanthropic exercise to search for pockets of survivors in and around Ground Zero after even the UN abandoned the island. The armed section of the organization is composed of small, highly professional security details that accompany rescue and clean-up teams to protect them from some of the other, far less altruistic, faction operating in the area."
  },
  {
    "id": "mithras-security-systems",
    "name": "Mithras Security Systems",
    "description": "Mithras bills itself as a PMC run by soldiers for soldiers, and it doesn't ask too many questions about an operator's motivations or past history. The only real bar to Mithras Membership is a lack of field experience or military competence. It prides itself on only accept the best and pays accordingly. The organization itself is inspired by the Roman Legion System, where the spoils of war were shared among the troops."
  }
];

export const ARCHIVE_VENDORS: ArchiveVendorProfile[] = [
  {
    "id": "artisan",
    "name": "Artisan",
    "fullName": "Laya Hoang",
    "sells": "Primary Weapons, Secondary Weapons, Ammunition, Magazines, Weapon parts, Attachments, Throwables and Tools. Specifically specializing in AK and Eastern weapon variants. Also sells 7.62 ammo types.",
    "buys": "Primary Weapons, Secondary Weapons, Ammunition, Magazines, Weapon parts, Attachments, Throwables and Tools."
  },
  {
    "id": "banshee",
    "name": "Banshee",
    "fullName": "James Miller",
    "sells": "Weapons, Ammunition, Weapon Parts, Containers",
    "buys": "Weapons, Ammunition, Weapon Parts, Containers"
  },
  {
    "id": "gunny",
    "name": "Gunny",
    "fullName": "Anton Jackson",
    "sells": "Primary Weapons, Secondary Weapons, Ammunition, Magazines, Weapon parts, Attachments, Throwables and Tools. Specifically specializing in NATO variant weapons. Also sells 5.56 ammo and M933 high-explosive mortar round types.",
    "buys": "Primary Weapons, Secondary Weapons, Ammunition, Magazines, Weapon parts, Attachments, Throwables and Tools."
  },
  {
    "id": "handshake",
    "name": "Handshake",
    "fullName": "Lewis Pell",
    "sells": "Helmets, Glasses, Hats, Headphones, Plate Carriers, Vests, Backpacks, Belts, Tactical Rigs and Tools.",
    "buys": "Helmets, Glasses, Hats, Headphones, Plate Carriers, Vests, Backpacks, Belts, Tactical Rigs, Tools and Secure Lockboxes."
  },
  {
    "id": "lab-rat",
    "name": "Lab Rat",
    "fullName": "Jie Xianlong",
    "sells": "Medkits, Medication, Drinks, Food and Tools.",
    "buys": "Medkits, Medication, Drinks, Food and Tools."
  },
  {
    "id": "turncoat",
    "name": "Turncoat",
    "fullName": "Unknown",
    "sells": "Weapons, Ammunition, Weapon Parts, Headwear, Plate Carriers, Armor Vests",
    "buys": "Weapons, Ammunition, Weapon Parts, Containers, Headwear"
  },
  {
    "id": "vulture",
    "name": "Vulture",
    "fullName": "Unknown",
    "sells": "Any.",
    "buys": "Valuables"
  }
];

export const ARCHIVE_REGIONS: ArchiveRegionEntry[] = [
  {
    "id": "ban-pa",
    "name": "Ban Pa",
    "tier": "2",
    "enemies": "Rebels",
    "lzCallsign": "INDIA,OSCAR",
    "description": "Ban Pa is a region located in the east of Lamang island . Its main point of interest is the Ban Pa village, situated along the coast in the south-eastern part of the region. Ban Pa territory is controlled by the Naga Pirates , a pirate group from Malaysia who take their name from their leader: Naga ."
  },
  {
    "id": "blue-lagoon",
    "name": "Blue Lagoon",
    "tier": "2",
    "enemies": "Rebels",
    "lzCallsign": "JULIETT,KILO,NOVEMBER",
    "description": "Blue Lagoon region is located in the southeast of Lamang island . Its main point of interest is the Blue Lagoon tourism center, combining a water park and a campground. Blue Lagoon territory is controlled by the Sifa Syndicate , a human trafficking group led by Grin ."
  },
  {
    "id": "fort-narith",
    "name": "Fort Narith",
    "tier": "3",
    "enemies": "LAF Soldiers",
    "lzCallsign": "DELTA",
    "description": "Fort Narith (Tier 3) — LAF Soldiers. LZ Callsign: DELTA."
  },
  {
    "id": "hunters-paradise",
    "name": "Hunter's Paradise",
    "tier": "2",
    "enemies": "Rebels",
    "lzCallsign": "FOXTROT",
    "description": "Hunter's Paradise (Tier 2) — Rebels. LZ Callsign: FOXTROT."
  },
  {
    "id": "kiu-vongsa",
    "name": "Kiu Vongsa",
    "tier": "1",
    "enemies": "Rebels",
    "lzCallsign": "CHARLIE",
    "description": "Kiu Vongsa is the starting region for players from the Crimson Shield International faction, located in the northwest of Lamang island . Its main point of interest is the Kiu Vongsa town. Kiu Vongsa territory is controlled by local thugs, led by Bloodhound ."
  },
  {
    "id": "midnight-sapphire",
    "name": "Midnight Sapphire",
    "tier": "3",
    "enemies": "LAF Soldiers",
    "lzCallsign": "HOTEL",
    "description": "Midnight Sapphire (Tier 3) — LAF Soldiers. LZ Callsign: HOTEL."
  },
  {
    "id": "nam-thaven",
    "name": "Nam Thaven",
    "tier": "1",
    "enemies": "Rebels",
    "lzCallsign": "BRAVO",
    "description": "Nam Thaven is the starting region for players from the Mithras Security Systems faction, located in the south of Lamang island . Its main point of interest is the Nam Thaven town. Nam Thaven territory is controlled by local thugs, led by Chaonai ."
  },
  {
    "id": "pha-lang",
    "name": "Pha Lang",
    "tier": "1",
    "enemies": "Rebels",
    "lzCallsign": "ALPHA",
    "description": "Pha Lang is the starting region for players from the Lamang Recovery Initiative faction, located in the northeast of Lamang island . Its main point of interest is the Pha Lang town. Pha Lang territory is controlled by local thugs, led by Golden Boy ."
  },
  {
    "id": "pha-lang-airfield",
    "name": "Pha Lang Airfield",
    "tier": "2",
    "enemies": "Rebels",
    "lzCallsign": "GOLF",
    "description": "Pha Lang Airfield (Tier 2) — Rebels. LZ Callsign: GOLF."
  },
  {
    "id": "sawmill",
    "name": "Sawmill",
    "tier": "2",
    "enemies": "Rebels",
    "lzCallsign": "ECHO",
    "description": "Sawmill (Tier 2) — Rebels. LZ Callsign: ECHO."
  },
  {
    "id": "tiger-bay",
    "name": "Tiger Bay",
    "tier": "3",
    "enemies": "Rebels & LAF Soldiers",
    "lzCallsign": "JULIET",
    "description": "Tiger Bay (Tier 3) — Rebels & LAF Soldiers. LZ Callsign: JULIET."
  },
  {
    "id": "ybl-1",
    "name": "YBL-1",
    "tier": "2",
    "enemies": "Rebels",
    "lzCallsign": "LIMA,MIKE",
    "description": "YBL-1 is a region located in the southwest of Lamang island . Its main point of interest is the YBL-1 military base, situated on a mountainside in the western part of the region. The base consists of a two-story underground bunker and other above-ground buildings. YBL-1 territory is controlled by Lamang Liberation Army , a local anti-government armed insurgency group, led by Firebrand ."
  }
];

export const ARCHIVE_INTEL_INDEX: ArchiveIntelIndexEntry[] = [
  {
    "id": "a-symbol-of-courage",
    "name": "A Symbol of Courage",
    "kind": "Intel"
  },
  {
    "id": "ammo-statrep-04c",
    "name": "AMMO-STATREP-04C",
    "kind": "Intel"
  },
  {
    "id": "angered-pmc-s-diary",
    "name": "Angered PMC’s Diary",
    "kind": "Intel"
  },
  {
    "id": "angry-message",
    "name": "Angry Message",
    "kind": "Intel"
  },
  {
    "id": "application-result",
    "name": "Application Result",
    "kind": "Intel"
  },
  {
    "id": "appointment-notice",
    "name": "Appointment Notice",
    "kind": "Intel"
  },
  {
    "id": "arrest-warrant-sh",
    "name": "Arrest Warrant SH",
    "kind": "Intel"
  },
  {
    "id": "atc-sec-7b-2026",
    "name": "ATC-SEC-7B/2026",
    "kind": "Intel"
  },
  {
    "id": "aulii-s-letter",
    "name": "Aulii's Letter",
    "kind": "Intel"
  },
  {
    "id": "ban-pa-note",
    "name": "Ban Pa Note",
    "kind": "Intel"
  },
  {
    "id": "ban-suk-code-book",
    "name": "Ban Suk Code Book",
    "kind": "Intel"
  },
  {
    "id": "baron-s-order",
    "name": "Baron's Order",
    "kind": "Intel"
  },
  {
    "id": "believers-list",
    "name": "Believers List",
    "kind": "Intel"
  },
  {
    "id": "black-box-note",
    "name": "Black Box Note",
    "kind": "Intel"
  },
  {
    "id": "bloody-list-of-people",
    "name": "Bloody List of People",
    "kind": "Intel"
  },
  {
    "id": "blue-lagoon-note",
    "name": "Blue Lagoon Note",
    "kind": "Intel"
  },
  {
    "id": "br-417-start-up-procedure",
    "name": "BR-417 Start-up Procedure",
    "kind": "Intel"
  },
  {
    "id": "bragging-thug-s-diary",
    "name": "Bragging Thug’s Diary",
    "kind": "Intel"
  },
  {
    "id": "british-list-of-people",
    "name": "British List of People",
    "kind": "Intel"
  },
  {
    "id": "bunker-code",
    "name": "Bunker Code",
    "kind": "Intel"
  },
  {
    "id": "butcher-s-job-note",
    "name": "Butcher's Job Note",
    "kind": "Intel"
  },
  {
    "id": "call-up-order",
    "name": "Call-Up Order",
    "kind": "Intel"
  },
  {
    "id": "car-repair-office-code",
    "name": "Car Repair Office Code",
    "kind": "Intel"
  },
  {
    "id": "civilian-exposure-analysis",
    "name": "Civilian Exposure Analysis",
    "kind": "Intel"
  },
  {
    "id": "classified-pharmaceutical-contract",
    "name": "Classified Pharmaceutical Contract",
    "kind": "Intel"
  },
  {
    "id": "classified-pharmaceutical-contract-counterpart",
    "name": "Classified Pharmaceutical Contract Counterpart",
    "kind": "Intel"
  },
  {
    "id": "code-instructions",
    "name": "Code Instructions",
    "kind": "Intel"
  },
  {
    "id": "commander-s-journal",
    "name": "Commander's Journal",
    "kind": "Intel"
  },
  {
    "id": "crook-s-diary",
    "name": "Crook's Diary",
    "kind": "Intel"
  },
  {
    "id": "current-orders",
    "name": "Current Orders",
    "kind": "Intel"
  },
  {
    "id": "death-sentence",
    "name": "Death Sentence",
    "kind": "Intel"
  },
  {
    "id": "developer-s-folder",
    "name": "Developer's Folder",
    "kind": "Intel"
  },
  {
    "id": "diary-of-habits",
    "name": "Diary of Habits",
    "kind": "Intel"
  },
  {
    "id": "disillusioned-peacekeeper-s-diary",
    "name": "Disillusioned Peacekeeper's Diary",
    "kind": "Intel"
  },
  {
    "id": "dissident-s-treasure-note",
    "name": "Dissident’s Treasure Note",
    "kind": "Intel"
  },
  {
    "id": "doctor-s-notes",
    "name": "Doctor's Notes",
    "kind": "Intel"
  },
  {
    "id": "door-console-repair-report",
    "name": "Door Console Repair Report",
    "kind": "Intel"
  },
  {
    "id": "dortmunder-s-debt",
    "name": "Dortmunder's Debt",
    "kind": "Intel"
  },
  {
    "id": "dr-khae-s-notes",
    "name": "Dr. Khae's Notes",
    "kind": "Intel"
  },
  {
    "id": "dr-khae-s-journal",
    "name": "Dr. Khae’s Journal",
    "kind": "Intel"
  },
  {
    "id": "drug-op-message",
    "name": "Drug Op Message",
    "kind": "Intel"
  },
  {
    "id": "duration-bet",
    "name": "Duration Bet",
    "kind": "Intel"
  },
  {
    "id": "embassy-message",
    "name": "Embassy Message",
    "kind": "Intel"
  },
  {
    "id": "encrypted-logbook",
    "name": "Encrypted Logbook",
    "kind": "Intel"
  },
  {
    "id": "encrypted-notebook",
    "name": "Encrypted Notebook",
    "kind": "Intel"
  },
  {
    "id": "enlightened-writer-s-journal",
    "name": "Enlightened Writer's Journal",
    "kind": "Intel"
  },
  {
    "id": "event-affected-population",
    "name": "Event - Affected Population",
    "kind": "Intel"
  },
  {
    "id": "experiment-17-b",
    "name": "Experiment 17-B",
    "kind": "Intel"
  },
  {
    "id": "fah-s-diary",
    "name": "Fah's Diary",
    "kind": "Intel"
  },
  {
    "id": "farmer-s-diary",
    "name": "Farmer's Diary",
    "kind": "Intel"
  },
  {
    "id": "fleming-s-file",
    "name": "Fleming's File",
    "kind": "Intel"
  },
  {
    "id": "fn-commander-investigation",
    "name": "FN Commander Investigation",
    "kind": "Intel"
  },
  {
    "id": "folder-00616",
    "name": "Folder 00616",
    "kind": "Intel"
  },
  {
    "id": "folder-193",
    "name": "Folder 193",
    "kind": "Intel"
  },
  {
    "id": "folder-251",
    "name": "Folder 251",
    "kind": "Intel"
  },
  {
    "id": "folder-712",
    "name": "Folder 712",
    "kind": "Intel"
  },
  {
    "id": "forgetful-soldier-s-diary",
    "name": "Forgetful Soldier's Diary",
    "kind": "Intel"
  },
  {
    "id": "fort-narith-note",
    "name": "Fort Narith Note",
    "kind": "Intel"
  },
  {
    "id": "fresh-meat-delivery",
    "name": "Fresh Meat Delivery",
    "kind": "Intel"
  },
  {
    "id": "friend-s-letter",
    "name": "Friend's Letter",
    "kind": "Intel"
  },
  {
    "id": "fundee-s-diary",
    "name": "Fundee's Diary",
    "kind": "Intel"
  },
  {
    "id": "gangmembers-s-notes",
    "name": "Gangmembers's Notes",
    "kind": "Intel"
  },
  {
    "id": "garage-evac-list",
    "name": "Garage Evac List",
    "kind": "Intel"
  },
  {
    "id": "generator-startup-instructions",
    "name": "Generator Startup Instructions",
    "kind": "Intel"
  },
  {
    "id": "gentleman-s-wager",
    "name": "Gentleman's Wager",
    "kind": "Intel"
  },
  {
    "id": "georges-love-letter",
    "name": "George's love letter",
    "kind": "Intel"
  },
  {
    "id": "golf-club-office-safe-procedures",
    "name": "Golf Club - Office Safe Procedures",
    "kind": "Intel"
  },
  {
    "id": "good-decision",
    "name": "Good Decision",
    "kind": "Intel"
  },
  {
    "id": "ground-zero-note",
    "name": "Ground Zero Note",
    "kind": "Intel"
  },
  {
    "id": "grumbling-note",
    "name": "Grumbling Note",
    "kind": "Intel"
  },
  {
    "id": "harvest-discipline-notice",
    "name": "Harvest Discipline Notice",
    "kind": "Intel"
  },
  {
    "id": "holding-cells-security-protocols",
    "name": "Holding Cells Security Protocols",
    "kind": "Intel"
  },
  {
    "id": "hunter-s-paradise-note",
    "name": "Hunter's Paradise Note",
    "kind": "Intel"
  },
  {
    "id": "important-notice",
    "name": "Important Notice!",
    "kind": "Intel"
  },
  {
    "id": "incident-and-evacuation-report",
    "name": "Incident and Evacuation Report",
    "kind": "Intel"
  },
  {
    "id": "incident-report-11475",
    "name": "Incident Report 11475",
    "kind": "Intel"
  },
  {
    "id": "interrogation-notes",
    "name": "Interrogation Notes",
    "kind": "Intel"
  },
  {
    "id": "interrogation-pr-23",
    "name": "Interrogation Pr 23",
    "kind": "Intel"
  },
  {
    "id": "interrogation-report",
    "name": "Interrogation Report",
    "kind": "Intel"
  },
  {
    "id": "interrogation-sh",
    "name": "Interrogation SH",
    "kind": "Intel"
  },
  {
    "id": "interrogation-transcript-3",
    "name": "Interrogation transcript",
    "kind": "Intel"
  },
  {
    "id": "interrogation-uc",
    "name": "Interrogation UC",
    "kind": "Intel"
  },
  {
    "id": "jai-tan-s-sentence",
    "name": "Jai Tan's Sentence",
    "kind": "Intel"
  },
  {
    "id": "jungle-bases-note",
    "name": "Jungle Bases Note",
    "kind": "Intel"
  },
  {
    "id": "kill-list",
    "name": "Kill List",
    "kind": "Intel"
  },
  {
    "id": "king-s-diary",
    "name": "King's Diary",
    "kind": "Intel"
  },
  {
    "id": "king-s-henchman-note",
    "name": "King's Henchman Note",
    "kind": "Intel"
  },
  {
    "id": "kob-s-file",
    "name": "Kob's File",
    "kind": "Intel"
  },
  {
    "id": "labor-allocation-request",
    "name": "Labor Allocation Request",
    "kind": "Intel"
  },
  {
    "id": "lae-s-love-letter",
    "name": "Lae's Love Letter",
    "kind": "Intel"
  },
  {
    "id": "laf-cbrn-report",
    "name": "LAF CBRN Report",
    "kind": "Intel"
  },
  {
    "id": "laf-codebook",
    "name": "LAF Codebook",
    "kind": "Intel"
  },
  {
    "id": "laf-document",
    "name": "LAF Document",
    "kind": "Intel"
  },
  {
    "id": "laf-op-docs",
    "name": "LAF OP Docs",
    "kind": "Intel"
  },
  {
    "id": "laf-supply-status",
    "name": "LAF Supply Status",
    "kind": "Intel"
  },
  {
    "id": "laf-unlra-deal",
    "name": "LAF UNLRA Deal",
    "kind": "Intel"
  },
  {
    "id": "letter-of-regret",
    "name": "Letter of Regret",
    "kind": "Intel"
  },
  {
    "id": "liebert-s-diary",
    "name": "Liebert's Diary",
    "kind": "Intel"
  },
  {
    "id": "list-of-child-evacuees-1",
    "name": "List of Child Evacuees 1",
    "kind": "Intel"
  },
  {
    "id": "list-of-child-evacuees-2",
    "name": "List of Child Evacuees 2",
    "kind": "Intel"
  },
  {
    "id": "lla-chosen-propaganda",
    "name": "LLA Chosen Propaganda",
    "kind": "Intel"
  },
  {
    "id": "lla-hostage-note",
    "name": "LLA Hostage Note",
    "kind": "Intel"
  },
  {
    "id": "lla-internal-comms",
    "name": "LLA Internal Comms",
    "kind": "Intel"
  },
  {
    "id": "lla-it-report",
    "name": "LLA IT Report",
    "kind": "Intel"
  },
  {
    "id": "lla-operational-note",
    "name": "LLA Operational Note",
    "kind": "Intel"
  },
  {
    "id": "lla-propaganda-foreign-invasion",
    "name": "LLA Propaganda - Foreign Invasion",
    "kind": "Intel"
  },
  {
    "id": "lla-propaganda-new-era",
    "name": "LLA Propaganda - New Era",
    "kind": "Intel"
  },
  {
    "id": "lla-propaganda-recruitment-of-criminals",
    "name": "LLA Propaganda - Recruitment of Criminals",
    "kind": "Intel"
  },
  {
    "id": "lla-radio-takeover",
    "name": "LLA Radio Takeover",
    "kind": "Intel"
  },
  {
    "id": "lla-recruitment-directive",
    "name": "LLA Recruitment Directive",
    "kind": "Intel"
  },
  {
    "id": "lla-situation-update",
    "name": "LLA Situation Update",
    "kind": "Intel"
  },
  {
    "id": "lla-strategic-directive",
    "name": "LLA Strategic Directive",
    "kind": "Intel"
  },
  {
    "id": "local-s-diary-frogs",
    "name": "Local's Diary - Frogs",
    "kind": "Intel"
  },
  {
    "id": "lockdown-release-procedure",
    "name": "Lockdown Release Procedure",
    "kind": "Intel"
  },
  {
    "id": "locked-tools-code",
    "name": "Locked Tools Code",
    "kind": "Intel"
  },
  {
    "id": "logbook",
    "name": "Logbook",
    "kind": "Intel"
  },
  {
    "id": "lost-tourist-s-diary",
    "name": "Lost Tourist's Diary",
    "kind": "Intel"
  },
  {
    "id": "lumberyard-office-code",
    "name": "Lumberyard Office Code",
    "kind": "Intel"
  },
  {
    "id": "lunatic-s-diary",
    "name": "Lunatic's Diary",
    "kind": "Intel"
  },
  {
    "id": "madman-s-note",
    "name": "Madman's Note",
    "kind": "Intel"
  },
  {
    "id": "malevolent-message",
    "name": "Malevolent Message",
    "kind": "Intel"
  },
  {
    "id": "mandatory-infirmary",
    "name": "Mandatory Infirmary",
    "kind": "Intel"
  },
  {
    "id": "medic-s-diary",
    "name": "Medic's Diary",
    "kind": "Intel"
  },
  {
    "id": "medical-analysis",
    "name": "Medical Analysis",
    "kind": "Intel"
  },
  {
    "id": "medical-records",
    "name": "Medical Records",
    "kind": "Intel"
  },
  {
    "id": "medical-waste-disposal-protocol",
    "name": "Medical Waste Disposal Protocol",
    "kind": "Intel"
  },
  {
    "id": "message-for-nithan",
    "name": "Message for Nithan",
    "kind": "Intel"
  },
  {
    "id": "message-for-repairers",
    "name": "Message for Repairers",
    "kind": "Intel"
  },
  {
    "id": "message-of-despair",
    "name": "Message of Despair",
    "kind": "Intel"
  },
  {
    "id": "midnight-sapphire-note",
    "name": "Midnight Sapphire Note",
    "kind": "Intel"
  },
  {
    "id": "mob-list-of-people",
    "name": "Mob List of People",
    "kind": "Intel"
  },
  {
    "id": "motel-owner-s-diary",
    "name": "Motel Owner’s Diary",
    "kind": "Intel"
  },
  {
    "id": "ms-vip-wellness-program-form",
    "name": "MS VIP Wellness Program Form",
    "kind": "Intel"
  },
  {
    "id": "ms-vip-wellness-program-menu",
    "name": "MS VIP Wellness Program Menu",
    "kind": "Intel"
  },
  {
    "id": "ms-worker-s-diary",
    "name": "MS Worker's Diary",
    "kind": "Intel"
  },
  {
    "id": "mysterious-codebook",
    "name": "Mysterious codebook",
    "kind": "Intel"
  },
  {
    "id": "nam-s-folder",
    "name": "Nam's Folder",
    "kind": "Intel"
  },
  {
    "id": "new-fn-commander-s-report",
    "name": "New FN Commander's Report",
    "kind": "Intel"
  },
  {
    "id": "newspaper---50-years-since-liberation-from-japan",
    "name": "Newspaper - 50 Years since liberation from Japan",
    "kind": "Intel"
  },
  {
    "id": "newspaper---rebel-forces-seize-control-in-lamang",
    "name": "Newspaper - Rebel Forces Seize Control in Lamang",
    "kind": "Intel"
  },
  {
    "id": "newspaper---safety-secured",
    "name": "Newspaper - Safety Secured",
    "kind": "Intel"
  },
  {
    "id": "non-evacuable-households-summary",
    "name": "Non-Evacuable Households Summary",
    "kind": "Intel"
  },
  {
    "id": "nr-admin-214-4-2026",
    "name": "NR ADMIN 214-4/2026",
    "kind": "Intel"
  },
  {
    "id": "nr-ex-487-78b",
    "name": "NR EX-487/78B",
    "kind": "Intel"
  },
  {
    "id": "nr-sitrep-623-5-2026",
    "name": "NR SITREP 623-5/2026",
    "kind": "Intel"
  },
  {
    "id": "nurse-s-journal",
    "name": "Nurse’s Journal",
    "kind": "Intel"
  },
  {
    "id": "official-complaint",
    "name": "Official Complaint",
    "kind": "Intel"
  },
  {
    "id": "official-laf-document",
    "name": "Official LAF Document",
    "kind": "Intel"
  },
  {
    "id": "parker-file",
    "name": "Parker File",
    "kind": "Intel"
  },
  {
    "id": "parting-note",
    "name": "Parting Note",
    "kind": "Intel"
  },
  {
    "id": "patient-details",
    "name": "Patient Details",
    "kind": "Intel"
  },
  {
    "id": "patient-interview",
    "name": "Patient Interview",
    "kind": "Intel"
  },
  {
    "id": "patrol-schedule",
    "name": "Patrol Schedule",
    "kind": "Intel"
  },
  {
    "id": "penthouse-access-authorization",
    "name": "Penthouse Access Authorization",
    "kind": "Intel"
  },
  {
    "id": "pha-lang-airfield-note",
    "name": "Pha Lang Airfield Note",
    "kind": "Intel"
  },
  {
    "id": "photo",
    "name": "Photo",
    "kind": "Intel"
  },
  {
    "id": "photography-career-change",
    "name": "Photography - Career Change",
    "kind": "Intel"
  },
  {
    "id": "photography-ghost-lady",
    "name": "Photography - Ghost Lady",
    "kind": "Intel"
  },
  {
    "id": "photography-juliette-marchand",
    "name": "Photography - Juliette Marchand",
    "kind": "Intel"
  },
  {
    "id": "photography-me-and-my-friend",
    "name": "Photography - Me and My Friend",
    "kind": "Intel"
  },
  {
    "id": "pirate-boss-s-diary",
    "name": "Pirate Boss's Diary",
    "kind": "Intel"
  },
  {
    "id": "planner",
    "name": "Planner",
    "kind": "Intel"
  },
  {
    "id": "postcard-shithole",
    "name": "Postcard - Shithole",
    "kind": "Intel"
  },
  {
    "id": "poster",
    "name": "Poster",
    "kind": "Intel"
  },
  {
    "id": "prayer-notebook",
    "name": "Prayer Notebook",
    "kind": "Intel"
  },
  {
    "id": "prayer-schedule",
    "name": "Prayer Schedule",
    "kind": "Intel"
  },
  {
    "id": "procurement-memo",
    "name": "Procurement Memo",
    "kind": "Intel"
  },
  {
    "id": "production-status-report",
    "name": "Production Status Report",
    "kind": "Intel"
  },
  {
    "id": "prohibited-evacuation",
    "name": "Prohibited Evacuation",
    "kind": "Intel"
  },
  {
    "id": "project-distant-voice-report",
    "name": "Project Distant Voice Report",
    "kind": "Intel"
  },
  {
    "id": "protective-oversight-agreement",
    "name": "Protective Oversight Agreement",
    "kind": "Intel"
  },
  {
    "id": "psychotic-note",
    "name": "Psychotic Note",
    "kind": "Intel"
  },
  {
    "id": "puzzled-girl-s-diary",
    "name": "Puzzled Girl's Diary",
    "kind": "Intel"
  },
  {
    "id": "rebel-chat",
    "name": "Rebel Chat",
    "kind": "Intel"
  },
  {
    "id": "rebel-notebook",
    "name": "Rebel Notebook",
    "kind": "Intel"
  },
  {
    "id": "regretful-peacekeeper-s-diary",
    "name": "Regretful Peacekeeper's Diary",
    "kind": "Intel"
  },
  {
    "id": "reorganization-of-lakevale-sanctuary",
    "name": "Reorganization of Lakevale Sanctuary",
    "kind": "Intel"
  },
  {
    "id": "report-suspicious-behavior",
    "name": "Report Suspicious Behavior",
    "kind": "Intel"
  },
  {
    "id": "research-notes",
    "name": "Research Notes",
    "kind": "Intel"
  },
  {
    "id": "resident-s-diary-alien",
    "name": "Resident's Diary - Alien",
    "kind": "Intel"
  },
  {
    "id": "rlsl-1-garrison-order",
    "name": "RLSL-1 Garrison Order",
    "kind": "Intel"
  },
  {
    "id": "rlsl-1-medical-report",
    "name": "RLSL-1 Medical Report",
    "kind": "Intel"
  },
  {
    "id": "rlsl-1-operational-directive",
    "name": "RLSL-1 Operational Directive",
    "kind": "Intel"
  },
  {
    "id": "rlsl-1-supply-request",
    "name": "RLSL-1 Supply Request",
    "kind": "Intel"
  },
  {
    "id": "roof-hatch-notice",
    "name": "Roof Hatch Notice",
    "kind": "Intel"
  },
  {
    "id": "safeguarding-storehouse-order",
    "name": "Safeguarding Storehouse Order",
    "kind": "Intel"
  },
  {
    "id": "sawmill-note",
    "name": "Sawmill Note",
    "kind": "Intel"
  },
  {
    "id": "sawmill-supply-folder",
    "name": "Sawmill Supply Folder",
    "kind": "Intel"
  },
  {
    "id": "sawmill-worker-s-diary",
    "name": "Sawmill Worker's Diary",
    "kind": "Intel"
  },
  {
    "id": "sayavong-s-escape-plan",
    "name": "Sayavong's Escape Plan",
    "kind": "Intel"
  },
  {
    "id": "scandalous-transcript",
    "name": "Scandalous Transcript",
    "kind": "Intel"
  },
  {
    "id": "scared-pirate-s-diary",
    "name": "Scared Pirate's Diary",
    "kind": "Intel"
  },
  {
    "id": "scavenger-s-notes",
    "name": "Scavenger's Notes",
    "kind": "Intel"
  },
  {
    "id": "security-notice",
    "name": "Security Notice",
    "kind": "Intel"
  },
  {
    "id": "security-orders",
    "name": "Security Orders",
    "kind": "Intel"
  },
  {
    "id": "shaman-s-diary",
    "name": "Shaman's Diary",
    "kind": "Intel"
  },
  {
    "id": "slaver-s-diary",
    "name": "Slaver's Diary",
    "kind": "Intel"
  },
  {
    "id": "stash-code",
    "name": "Stash Code",
    "kind": "Intel"
  },
  {
    "id": "sticky-note",
    "name": "Sticky Note",
    "kind": "Intel"
  },
  {
    "id": "suicide-note",
    "name": "Suicide Note",
    "kind": "Intel"
  },
  {
    "id": "supply-relocation",
    "name": "Supply Relocation",
    "kind": "Intel"
  },
  {
    "id": "swf-sec8-mun-access-01",
    "name": "SWF-SEC8-MUN-ACCESS-01",
    "kind": "Intel"
  },
  {
    "id": "takeshi-s-letter",
    "name": "Takeshi's Letter",
    "kind": "Intel"
  },
  {
    "id": "thug-orders",
    "name": "Thug Orders",
    "kind": "Intel"
  },
  {
    "id": "thug-s-diary",
    "name": "Thug's Diary",
    "kind": "Intel"
  },
  {
    "id": "thug-s-diary-vietnamese-goons",
    "name": "Thug's Diary - Vietnamese Goons",
    "kind": "Intel"
  },
  {
    "id": "tiger-bay-note",
    "name": "Tiger Bay Note",
    "kind": "Intel"
  },
  {
    "id": "torturer-s-notebook",
    "name": "Torturer's Notebook",
    "kind": "Intel"
  },
  {
    "id": "tourist-photography-big-haul",
    "name": "Tourist Photography - Big Haul",
    "kind": "Intel"
  },
  {
    "id": "tourist-photography-endangered-trophy",
    "name": "Tourist Photography - Endangered Trophy",
    "kind": "Intel"
  },
  {
    "id": "tourist-photography-family-arrive",
    "name": "Tourist Photography - Family Arrive",
    "kind": "Intel"
  },
  {
    "id": "tourist-photography-fond-memories",
    "name": "Tourist Photography - Fond Memories",
    "kind": "Intel"
  },
  {
    "id": "tourist-photography-never-leave",
    "name": "Tourist Photography - Never Leave",
    "kind": "Intel"
  },
  {
    "id": "tourist-s-diary-bad-experience",
    "name": "Tourist's Diary - Bad Experience",
    "kind": "Intel"
  },
  {
    "id": "transaction-memo",
    "name": "Transaction Memo",
    "kind": "Intel"
  },
  {
    "id": "transformer-worker-s-diary",
    "name": "Transformer Worker’s Diary",
    "kind": "Intel"
  },
  {
    "id": "turncoat-order",
    "name": "Turncoat Order",
    "kind": "Intel"
  },
  {
    "id": "un-pre-crisis-analysis",
    "name": "UN Pre-Crisis Analysis",
    "kind": "Intel"
  },
  {
    "id": "unknown-combatant",
    "name": "Unknown Combatant",
    "kind": "Intel"
  },
  {
    "id": "unknown-combatant-s-diary",
    "name": "Unknown Combatant's Diary",
    "kind": "Intel"
  },
  {
    "id": "unknown-soldier-s-notes",
    "name": "Unknown Soldier's Notes",
    "kind": "Intel"
  },
  {
    "id": "unlra-mclu-7",
    "name": "UNLRA - MCLU-7",
    "kind": "Intel"
  },
  {
    "id": "unlra-laf-deal",
    "name": "UNLRA LAF Deal",
    "kind": "Intel"
  },
  {
    "id": "unlra-selective-evac",
    "name": "UNLRA Selective Evac",
    "kind": "Intel"
  },
  {
    "id": "unnerving-note",
    "name": "Unnerving Note",
    "kind": "Intel"
  },
  {
    "id": "unsent-letter",
    "name": "Unsent Letter",
    "kind": "Intel"
  },
  {
    "id": "urgent-letter",
    "name": "Urgent Letter",
    "kind": "Intel"
  },
  {
    "id": "vagrants-message",
    "name": "Vagrants Message",
    "kind": "Intel"
  },
  {
    "id": "vietnamese-report",
    "name": "Vietnamese Report",
    "kind": "Intel"
  },
  {
    "id": "villa-civilian-s-diary",
    "name": "Villa Civilian’s Diary",
    "kind": "Intel"
  },
  {
    "id": "villa-pmc-s-diary",
    "name": "Villa PMC’s Diary",
    "kind": "Intel"
  },
  {
    "id": "villa-suzan-eve-cleaning",
    "name": "Villa Suzan Eve Cleaning",
    "kind": "Intel"
  },
  {
    "id": "villager-s-diary",
    "name": "Villager's Diary",
    "kind": "Intel"
  },
  {
    "id": "vip-guest-s-notebook",
    "name": "VIP Guest's Notebook",
    "kind": "Intel"
  },
  {
    "id": "vip-program",
    "name": "VIP Program",
    "kind": "Intel"
  },
  {
    "id": "wary-note",
    "name": "Wary Note",
    "kind": "Intel"
  },
  {
    "id": "wealthy-man-s-diary",
    "name": "Wealthy Man’s Diary",
    "kind": "Intel"
  },
  {
    "id": "wealthy-woman-s-diary",
    "name": "Wealthy Woman’s Diary",
    "kind": "Intel"
  },
  {
    "id": "weapons-stockpile-code",
    "name": "Weapons Stockpile Code",
    "kind": "Intel"
  },
  {
    "id": "weekend-safe-procedures",
    "name": "Weekend Safe Procedures",
    "kind": "Intel"
  },
  {
    "id": "weekly-shipment-notes",
    "name": "Weekly Shipment Notes",
    "kind": "Intel"
  },
  {
    "id": "ybl-1-note",
    "name": "YBL-1 Note",
    "kind": "Intel"
  },
  {
    "id": "newspaper---10-years-of-independent-lamang",
    "name": "Newspaper - 10 Years of Independent Lamang",
    "kind": "Newspaper"
  },
  {
    "id": "newspaper---50-years-since-liberation-from-japan",
    "name": "Newspaper - 50 Years Since Liberation from Japan",
    "kind": "Newspaper"
  },
  {
    "id": "newspaper---another-monarch-bites-the-dust",
    "name": "Newspaper - Another Monarch Bites the Dust",
    "kind": "Newspaper"
  },
  {
    "id": "newspaper---capture-of-a-traitor",
    "name": "Newspaper - Capture of a Traitor",
    "kind": "Newspaper"
  },
  {
    "id": "newspaper---civil-war-erupts-in-lamang",
    "name": "Newspaper - Civil War Erupts in Lamang",
    "kind": "Newspaper"
  },
  {
    "id": "newspaper---covid-hits-lamang-hard",
    "name": "Newspaper - Covid Hits Lamang Hard",
    "kind": "Newspaper"
  },
  {
    "id": "newspaper---disappearance-of-stuart-kupferhower",
    "name": "Newspaper - Disappearance of Stuart Kupferhower",
    "kind": "Newspaper"
  },
  {
    "id": "newspaper---dissolution-of-the-soviet-union",
    "name": "Newspaper - Dissolution of the Soviet Union",
    "kind": "Newspaper"
  },
  {
    "id": "newspaper---election-results",
    "name": "Newspaper - Election Results",
    "kind": "Newspaper"
  },
  {
    "id": "newspaper---friendship-among-nations",
    "name": "Newspaper - Friendship Among Nations",
    "kind": "Newspaper"
  },
  {
    "id": "newspaper---friendship-with-the-ussr-in-perpetuity",
    "name": "Newspaper - Friendship with the USSR in Perpetuity",
    "kind": "Newspaper"
  },
  {
    "id": "newspaper---glorious-leader-narith-sayavong-celebrates-50th-birthday",
    "name": "Newspaper - Glorious Leader Narith Sayavong Celebrates 50th Birthday",
    "kind": "Newspaper"
  },
  {
    "id": "newspaper---honoring-the-best-workers",
    "name": "Newspaper - Honoring the Best Workers",
    "kind": "Newspaper"
  },
  {
    "id": "newspaper---horrors-of-the-survivors",
    "name": "Newspaper - Horrors of the Survivors",
    "kind": "Newspaper"
  },
  {
    "id": "newspaper---insurrection-averted!",
    "name": "Newspaper - Insurrection Averted!",
    "kind": "Newspaper"
  },
  {
    "id": "newspaper---lamang-awakens",
    "name": "Newspaper - Lamang Awakens",
    "kind": "Newspaper"
  },
  {
    "id": "newspaper---lamang-escapees-speak-out",
    "name": "Newspaper - Lamang Escapees Speak Out",
    "kind": "Newspaper"
  },
  {
    "id": "newspaper---lamang-secures-independence-from-british-rule",
    "name": "Newspaper - Lamang Secures Independence from British Rule",
    "kind": "Newspaper"
  },
  {
    "id": "newspaper---lamang’s-underworld-rising",
    "name": "Newspaper - Lamang’s Underworld Rising",
    "kind": "Newspaper"
  },
  {
    "id": "newspaper---mysteries-regarding-the-event",
    "name": "Newspaper - Mysteries Regarding The Event",
    "kind": "Newspaper"
  },
  {
    "id": "newspaper---mysterious-explosion",
    "name": "Newspaper - Mysterious Explosion",
    "kind": "Newspaper"
  },
  {
    "id": "newspaper---mysterious-lights",
    "name": "Newspaper - Mysterious Lights",
    "kind": "Newspaper"
  },
  {
    "id": "newspaper---national-cuisine-in-tiger-bay-central",
    "name": "Newspaper - National Cuisine in Tiger Bay Central",
    "kind": "Newspaper"
  },
  {
    "id": "newspaper---never-again!",
    "name": "Newspaper - Never Again!",
    "kind": "Newspaper"
  },
  {
    "id": "newspaper---new-playground-for-the-elite",
    "name": "Newspaper - New Playground for the Elite",
    "kind": "Newspaper"
  },
  {
    "id": "newspaper---opening-of-fort-raksmei",
    "name": "Newspaper - Opening of Fort Raksmei",
    "kind": "Newspaper"
  },
  {
    "id": "newspaper---paradise-found",
    "name": "Newspaper - Paradise Found",
    "kind": "Newspaper"
  },
  {
    "id": "newspaper---plans-for-the-future",
    "name": "Newspaper - Plans For The Future",
    "kind": "Newspaper"
  },
  {
    "id": "newspaper---president-discovers-ancient-vase",
    "name": "Newspaper - President Discovers Ancient Vase",
    "kind": "Newspaper"
  },
  {
    "id": "newspaper---raksmei-sayavong-1924-1996",
    "name": "Newspaper - Raksmei Sayavong (1924-1996)",
    "kind": "Newspaper"
  },
  {
    "id": "newspaper---reds-seize-another-country!",
    "name": "Newspaper - Reds Seize Another Country!",
    "kind": "Newspaper"
  },
  {
    "id": "newspaper---slavers-shut-down",
    "name": "Newspaper - Slavers Shut Down",
    "kind": "Newspaper"
  },
  {
    "id": "newspaper---suburbs-controversy",
    "name": "Newspaper - Suburbs Controversy",
    "kind": "Newspaper"
  },
  {
    "id": "newspaper---terrorist-attack-near-fort-narith",
    "name": "Newspaper - Terrorist Attack Near Fort Narith",
    "kind": "Newspaper"
  },
  {
    "id": "newspaper---the-midnight-sapphire-miracle",
    "name": "Newspaper - The Midnight Sapphire Miracle",
    "kind": "Newspaper"
  },
  {
    "id": "newspaper---the-three-hundredth-anniversary",
    "name": "Newspaper - The Three Hundredth Anniversary",
    "kind": "Newspaper"
  },
  {
    "id": "newspaper---the-un-is-allowing-lies-to-spread",
    "name": "Newspaper - The UN Is Allowing Lies to Spread",
    "kind": "Newspaper"
  },
  {
    "id": "newspaper---the-world-is-watching",
    "name": "Newspaper - The World is Watching",
    "kind": "Newspaper"
  },
  {
    "id": "newspaper---theres-no-reason-to-panic",
    "name": "Newspaper - There's no Reason to Panic",
    "kind": "Newspaper"
  },
  {
    "id": "newspaper---trial-of-the-nations-traitors",
    "name": "Newspaper - Trial of the Nation's Traitors",
    "kind": "Newspaper"
  },
  {
    "id": "newspaper---un-concludes-lamang-evacuation",
    "name": "Newspaper - UN Concludes Lamang Evacuation",
    "kind": "Newspaper"
  },
  {
    "id": "newspaper---united-nations-mission",
    "name": "Newspaper - United Nations Mission",
    "kind": "Newspaper"
  },
  {
    "id": "newspaper---we-don’t-forget-the-elderly-in-lamang",
    "name": "Newspaper - We Don’t Forget the Elderly in Lamang",
    "kind": "Newspaper"
  },
  {
    "id": "army-intel",
    "name": "Army Intel",
    "kind": "Evidence"
  },
  {
    "id": "businessman-id-card",
    "name": "Businessman ID Card",
    "kind": "Evidence"
  },
  {
    "id": "crime-related-intel",
    "name": "Crime-related Intel",
    "kind": "Evidence"
  },
  {
    "id": "digital-camera",
    "name": "Digital Camera",
    "kind": "Evidence"
  },
  {
    "id": "drivers-licence",
    "name": "Driver's Licence",
    "kind": "Evidence"
  },
  {
    "id": "encrypted-hard-disk-drive",
    "name": "Encrypted Hard Disk Drive",
    "kind": "Evidence"
  },
  {
    "id": "laptop",
    "name": "Laptop",
    "kind": "Evidence"
  },
  {
    "id": "local-id-card",
    "name": "Local ID Card",
    "kind": "Evidence"
  },
  {
    "id": "reflex-camera",
    "name": "Reflex Camera",
    "kind": "Evidence"
  },
  {
    "id": "reinforced-military-laptop",
    "name": "Reinforced Military Laptop",
    "kind": "Evidence"
  },
  {
    "id": "tourist-id-card",
    "name": "Tourist ID Card",
    "kind": "Evidence"
  },
  {
    "id": "tourist-passport",
    "name": "Tourist Passport",
    "kind": "Evidence"
  },
  {
    "id": "vip-passport",
    "name": "VIP Passport",
    "kind": "Evidence"
  },
  {
    "id": "an/pyq-10",
    "name": "AN/PYQ-10",
    "kind": "Military Equipment"
  },
  {
    "id": "azart-p1-radio",
    "name": "AZART P1 Radio",
    "kind": "Military Equipment"
  },
  {
    "id": "biometric-access-card",
    "name": "Biometric Access Card",
    "kind": "Military Equipment"
  },
  {
    "id": "biometric-thumb-drive",
    "name": "Biometric Thumb Drive",
    "kind": "Military Equipment"
  },
  {
    "id": "c2-military-laptop",
    "name": "C2 Military Laptop",
    "kind": "Military Equipment"
  },
  {
    "id": "glonass-grot-m-navigation-receiver",
    "name": "GLONASS Grot-M Navigation Receiver",
    "kind": "Military Equipment"
  },
  {
    "id": "handheld-ecm-jammer",
    "name": "Handheld ECM Jammer",
    "kind": "Military Equipment"
  },
  {
    "id": "hgcs-30-uav-control-station",
    "name": "HGCS-30 UAV Control Station",
    "kind": "Military Equipment"
  },
  {
    "id": "kik-11-tactical-key-loader",
    "name": "KIK-11 Tactical Key Loader",
    "kind": "Military Equipment"
  },
  {
    "id": "ltsd-4-3-laser-designator",
    "name": "LTSD-4-3 Laser Designator",
    "kind": "Military Equipment"
  },
  {
    "id": "npi-2-navigation-receiver",
    "name": "NPI-2 Navigation Receiver",
    "kind": "Military Equipment"
  },
  {
    "id": "one-time-pad-key-sheets",
    "name": "One-Time Pad Key Sheets",
    "kind": "Military Equipment"
  },
  {
    "id": "operation-data-encrypted-hard-disk",
    "name": "Operation Data Encrypted Hard Disk",
    "kind": "Military Equipment"
  },
  {
    "id": "pbg-01+-uav-control-station",
    "name": "PBG-01+ UAV Control Station",
    "kind": "Military Equipment"
  },
  {
    "id": "r-438-barrier-t",
    "name": "R-438 Barrier-T",
    "kind": "Military Equipment"
  },
  {
    "id": "rugged-military-tablet",
    "name": "Rugged Military Tablet",
    "kind": "Military Equipment"
  },
  {
    "id": "signal-repeater-rt97s",
    "name": "Signal Repeater RT97S",
    "kind": "Military Equipment"
  },
  {
    "id": "strelets-m-tablet",
    "name": "STRELETS-M Tablet",
    "kind": "Military Equipment"
  }
];
