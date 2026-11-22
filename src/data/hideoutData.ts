import type { MapLayerKey } from "../config/mapConfig";

export type RoomId = "utility" | "electronics" | "laboratory";

export interface HideoutMaterialDef {
  id: string;
  name: string;
  required: number;
  room: RoomId;
  layerHint: Exclude<MapLayerKey, "tickedSpawns" | "poiLabels" | "subLocations" | "copsAndLzs">;
  spawnNotes: string[];
  description: string;
}

export interface HideoutUpgradeDef {
  id: string;
  room: RoomId;
  module: string;
  level: number;
  name: string;
  benefit: string;
  requirements: { name: string; quantity: number }[];
}

export type DisassemblyCategory =
  | "Electronics & Comms"
  | "Containers & Chem"
  | "Avionics & Weapons";

export type DisassemblyOutcomeKind =
  | "Crafting Material"
  | "Intel / Data Drive"
  | "Canister / Biohazard"
  | "Module";

export interface DisassemblyOutcomeDetail {
  name: string;
  kind: DisassemblyOutcomeKind;
  sellPrice?: string;
  gridSize?: string;
  weight?: string;
  image?: string | null;
}

export interface DisassemblyRecipeDef {
  id: string;
  name: string;
  duration: string;
  outcomes: string[];
  outcomeDetails: DisassemblyOutcomeDetail[];
  sellPrice?: string;
  gridSize?: string;
  weight?: string;
  manufacturer?: string;
  category: DisassemblyCategory;
  image?: string | null;
  station: string;
}

export interface HideoutRoomMeta {
  id: RoomId;
  name: string;
  subtitle: string;
  description: string;
}

export const HIDEOUT_ROOMS: Record<RoomId, HideoutRoomMeta> = {
  utility: {
    id: "utility",
    name: "Utility Room",
    subtitle: "Power & Infrastructure",
    description:
      "Core power generation and infrastructure routing supporting Electronics Workshop and Laboratory operations.",
  },
  electronics: {
    id: "electronics",
    name: "Electronics Workshop",
    subtitle: "Signal Intel, Compute & Fabrication",
    description:
      "Compute hardware, mechanical CNC tooling, micro-electronics assembly, RF sensors, and specialized storage.",
  },
  laboratory: {
    id: "laboratory",
    name: "Laboratory",
    subtitle: "Analysis, Extraction & Bio-Containment",
    description:
      "Analytical instrumentation, extraction & reaction vessels, filtration, heat control, glassware, and lab safety.",
  },
};

/**
 * Complete canonical 36 Hideout Modules from Gray Zone Warfare 0.5 (Utility Room, Electronics Workshop, Laboratory).
 * Enriched automatically by live gzw-data.dev API sync.
 */
export const CANONICAL_HIDEOUT_UPGRADES: HideoutUpgradeDef[] = [
  // === UTILITY ROOM (2) ===
  {
    id: "utility-room-generator-level-1",
    room: "utility",
    module: "Generator",
    level: 1,
    name: "Generator Level 1 (Utility Room)",
    benefit: "+ 9 Available Power",
    requirements: [
      { name: "Steel", quantity: 1 },
      { name: "Mechanical Parts", quantity: 1 },
      { name: "Motor Oil", quantity: 1 },
      { name: "Dynamo", quantity: 1 },
    ],
  },
  {
    id: "utility-room-generator-level-2",
    room: "utility",
    module: "Generator",
    level: 2,
    name: "Generator Level 2 (Utility Room)",
    benefit: "+ 9 Available Power",
    requirements: [
      { name: "Steel", quantity: 2 },
      { name: "Mechanical Parts", quantity: 2 },
      { name: "Motor Oil", quantity: 1 },
      { name: "Dynamo", quantity: 1 },
      { name: "Plumbing Parts", quantity: 1 },
      { name: "Electrical Parts", quantity: 1 },
    ],
  },

  // === ELECTRONICS WORKSHOP (15) ===
  {
    id: "electronics-workshop-hardware-level-1",
    room: "electronics",
    module: "Hardware",
    level: 1,
    name: "Hardware Level 1 (Electronics Workshop)",
    benefit: "+ 2 Compute Capacity",
    requirements: [
      { name: "Motherboard", quantity: 1 },
      { name: "Graphics Card", quantity: 1 },
      { name: "CPU", quantity: 1 },
      { name: "PC Fan", quantity: 1 },
      { name: "RAM", quantity: 1 },
      { name: "Power Supply", quantity: 1 },
    ],
  },
  {
    id: "electronics-workshop-hardware-level-2",
    room: "electronics",
    module: "Hardware",
    level: 2,
    name: "Hardware Level 2 (Electronics Workshop)",
    benefit: "+ 2 Compute Capacity",
    requirements: [
      { name: "Motherboard", quantity: 1 },
      { name: "Graphics Card", quantity: 1 },
      { name: "CPU", quantity: 1 },
      { name: "Plumbing Parts", quantity: 2 },
      { name: "RAM", quantity: 3 },
      { name: "Power Supply", quantity: 1 },
    ],
  },
  {
    id: "electronics-workshop-hardware-level-3",
    room: "electronics",
    module: "Hardware",
    level: 3,
    name: "Hardware Level 3 (Electronics Workshop)",
    benefit: "+ 2 Compute Capacity",
    requirements: [
      { name: "Motherboard", quantity: 1 },
      { name: "Server CPU", quantity: 1 },
      { name: "Electrical Parts", quantity: 5 },
      { name: "RAM", quantity: 4 },
      { name: "Power Supply", quantity: 1 },
      { name: "Dollars", quantity: 45000 },
    ],
  },
  {
    id: "electronics-workshop-machine-tools-level-1",
    room: "electronics",
    module: "Machine Tools",
    level: 1,
    name: "Machine Tools Level 1 (Electronics Workshop)",
    benefit: "+ 1 Mechanical Engineering",
    requirements: [
      { name: "Wood", quantity: 1 },
      { name: "Steel", quantity: 1 },
      { name: "Toolset", quantity: 1 },
    ],
  },
  {
    id: "electronics-workshop-machine-tools-level-2",
    room: "electronics",
    module: "Machine Tools",
    level: 2,
    name: "Machine Tools Level 2 (Electronics Workshop)",
    benefit: "+ 2 Mechanical Engineering",
    requirements: [
      { name: "Steel", quantity: 3 },
      { name: "Mechanical Parts", quantity: 2 },
      { name: "Electrical Parts", quantity: 1 },
      { name: "Tooling Coolant", quantity: 1 },
      { name: "CNC Drill Bits", quantity: 1 },
    ],
  },
  {
    id: "electronics-workshop-micro-electronics-level-1",
    room: "electronics",
    module: "Micro Electronics",
    level: 1,
    name: "Micro Electronics Level 1 (Electronics Workshop)",
    benefit: "+ 1 Electronics Capability",
    requirements: [
      { name: "Soldering Iron", quantity: 1 },
      { name: "Multimeter", quantity: 1 },
      { name: "Toolset", quantity: 1 },
      { name: "Power Supply", quantity: 1 },
      { name: "Wood", quantity: 1 },
    ],
  },
  {
    id: "electronics-workshop-micro-electronics-level-2",
    room: "electronics",
    module: "Micro Electronics",
    level: 2,
    name: "Micro Electronics Level 2 (Electronics Workshop)",
    benefit: "+ 2 Electronics Capability",
    requirements: [
      { name: "Soldering Iron", quantity: 2 },
      { name: "Multimeter", quantity: 1 },
      { name: "Power Supply", quantity: 1 },
      { name: "Oscilloscope", quantity: 1 },
      { name: "Electrical Parts", quantity: 4 },
    ],
  },
  {
    id: "electronics-workshop-micro-electronics-level-3",
    room: "electronics",
    module: "Micro Electronics",
    level: 3,
    name: "Micro Electronics Level 3 (Electronics Workshop)",
    benefit: "+ 3 Electronics Capability",
    requirements: [
      { name: "Microscope", quantity: 1 },
      { name: "Multimeter", quantity: 1 },
      { name: "Circuit Board", quantity: 2 },
      { name: "Power Supply", quantity: 1 },
      { name: "Oscilloscope", quantity: 1 },
      { name: "Electrical Parts", quantity: 5 },
      { name: "Dollars", quantity: 35000 },
    ],
  },
  {
    id: "electronics-workshop-rf-sensors-level-1",
    room: "electronics",
    module: "RF Sensors",
    level: 1,
    name: "RF Sensors Level 1 (Electronics Workshop)",
    benefit: "+ 1 Sensor and RF Processing",
    requirements: [
      { name: "Wood", quantity: 1 },
      { name: "Steel", quantity: 1 },
      { name: "Electrical Parts", quantity: 1 },
      { name: "Signal Generator", quantity: 1 },
      { name: "Soldering Iron", quantity: 1 },
    ],
  },
  {
    id: "electronics-workshop-rf-sensors-level-2",
    room: "electronics",
    module: "RF Sensors",
    level: 2,
    name: "RF Sensors Level 2 (Electronics Workshop)",
    benefit: "+ 2 Sensor and RF Processing",
    requirements: [
      { name: "Steel", quantity: 6 },
      { name: "Mechanical Parts", quantity: 2 },
      { name: "Electrical Parts", quantity: 4 },
      { name: "Signal Generator", quantity: 1 },
      { name: "Oscilloscope", quantity: 1 },
      { name: "Laser Tube", quantity: 1 },
      { name: "Dollars", quantity: 30000 },
    ],
  },
  {
    id: "electronics-workshop-software-level-1",
    room: "electronics",
    module: "Software",
    level: 1,
    name: "Software Level 1 (Electronics Workshop)",
    benefit: "+ 2 Compute Capacity",
    requirements: [
      { name: "Civilian Software", quantity: 3 },
      { name: "Military Software", quantity: 1 },
    ],
  },
  {
    id: "electronics-workshop-software-level-2",
    room: "electronics",
    module: "Software",
    level: 2,
    name: "Software Level 2 (Electronics Workshop)",
    benefit: "+ 2 Compute Capacity",
    requirements: [
      { name: "Civilian Software", quantity: 6 },
      { name: "Military Software", quantity: 2 },
      { name: "Graphics Card", quantity: 1 },
    ],
  },
  {
    id: "electronics-workshop-storage-equipment-level-1",
    room: "electronics",
    module: "Storage Equipment",
    level: 1,
    name: "Storage Equipment Level 1 (Electronics Workshop)",
    benefit: "+ 2 Storage Capacity",
    requirements: [
      { name: "Wood", quantity: 1 },
      { name: "Mechanical Parts", quantity: 1 },
    ],
  },
  {
    id: "electronics-workshop-storage-equipment-level-2",
    room: "electronics",
    module: "Storage Equipment",
    level: 2,
    name: "Storage Equipment Level 2 (Electronics Workshop)",
    benefit: "+ 2 Storage Capacity",
    requirements: [
      { name: "Steel", quantity: 9 },
      { name: "Mechanical Parts", quantity: 3 },
    ],
  },
  {
    id: "electronics-workshop-storage-equipment-level-3",
    room: "electronics",
    module: "Storage Equipment",
    level: 3,
    name: "Storage Equipment Level 3 (Electronics Workshop)",
    benefit: "+ 2 Storage Capacity",
    requirements: [
      { name: "Steel", quantity: 12 },
      { name: "Mechanical Parts", quantity: 6 },
      { name: "Stainless Steel Sheet", quantity: 4 },
      { name: "Dollars", quantity: 30000 },
    ],
  },

  // === LABORATORY (19) ===
  {
    id: "laboratory-analysis-level-1",
    room: "laboratory",
    module: "Analysis",
    level: 1,
    name: "Analysis Level 1 (Laboratory)",
    benefit: "+ 3 Analysis & Precision",
    requirements: [
      { name: "Plastics", quantity: 2 },
      { name: "Electrical Parts", quantity: 1 },
      { name: "Circuit Board", quantity: 1 },
      { name: "Complex Glass Electrode", quantity: 1 },
    ],
  },
  {
    id: "laboratory-analysis-level-2",
    room: "laboratory",
    module: "Analysis",
    level: 2,
    name: "Analysis Level 2 (Laboratory)",
    benefit: "+ 3 Analysis & Precision",
    requirements: [
      { name: "Plastics", quantity: 2 },
      { name: "Electrical Parts", quantity: 4 },
      { name: "Circuit Board", quantity: 3 },
      { name: "Mechanical Parts", quantity: 2 },
      { name: "Vapor Lamp", quantity: 1 },
      { name: "Crystal Prism", quantity: 1 },
      { name: "Dollars", quantity: 35000 },
    ],
  },
  {
    id: "laboratory-extraction-vessel-level-1",
    room: "laboratory",
    module: "Extraction Vessel",
    level: 1,
    name: "Extraction Vessel Level 1 (Laboratory)",
    benefit: "Adds Extraction & Reaction",
    requirements: [
      { name: "Steel", quantity: 1 },
      { name: "Copper", quantity: 1 },
      { name: "Plumbing Parts", quantity: 1 },
      { name: "Analog Indicator", quantity: 1 },
    ],
  },
  {
    id: "laboratory-extraction-vessel-level-2",
    room: "laboratory",
    module: "Extraction Vessel",
    level: 2,
    name: "Extraction Vessel Level 2 (Laboratory)",
    benefit: "Adds Extraction & Reaction",
    requirements: [
      { name: "Copper", quantity: 5 },
      { name: "Plumbing Parts", quantity: 1 },
      { name: "Analog Indicator", quantity: 1 },
      { name: "Water Pump", quantity: 1 },
    ],
  },
  {
    id: "laboratory-filtration-level-1",
    room: "laboratory",
    module: "Filtration",
    level: 1,
    name: "Filtration Level 1 (Laboratory)",
    benefit: "+ 1 Filtration & Processing",
    requirements: [
      { name: "Wood", quantity: 2 },
      { name: "Fabrics", quantity: 4 },
    ],
  },
  {
    id: "laboratory-filtration-level-2",
    room: "laboratory",
    module: "Filtration",
    level: 2,
    name: "Filtration Level 2 (Laboratory)",
    benefit: "+ 1 Filtration & Processing",
    requirements: [
      { name: "Steel", quantity: 3 },
      { name: "Fine Metal Mesh", quantity: 3 },
    ],
  },
  {
    id: "laboratory-glassware-level-1",
    room: "laboratory",
    module: "Glassware",
    level: 1,
    name: "Glassware Level 1 (Laboratory)",
    benefit: "Adds Analysis & Precision",
    requirements: [
      { name: "Glass", quantity: 1 },
      { name: "Plastics", quantity: 1 },
      { name: "Laboratory Flask", quantity: 1 },
    ],
  },
  {
    id: "laboratory-glassware-level-2",
    room: "laboratory",
    module: "Glassware",
    level: 2,
    name: "Glassware Level 2 (Laboratory)",
    benefit: "Adds Analysis & Precision",
    requirements: [
      { name: "Glass", quantity: 2 },
      { name: "Plastics", quantity: 1 },
      { name: "Laboratory Flask", quantity: 1 },
      { name: "Mechanical Pipette", quantity: 1 },
    ],
  },
  {
    id: "laboratory-heat-source-level-1",
    room: "laboratory",
    module: "Heat Source",
    level: 1,
    name: "Heat Source Level 1 (Laboratory)",
    benefit: "Adds Heat control",
    requirements: [
      { name: "Steel", quantity: 3 },
      { name: "Construction Material", quantity: 2 },
      { name: "Wood", quantity: 1 },
    ],
  },
  {
    id: "laboratory-heat-source-level-2",
    room: "laboratory",
    module: "Heat Source",
    level: 2,
    name: "Heat Source Level 2 (Laboratory)",
    benefit: "Adds Heat control",
    requirements: [
      { name: "Steel", quantity: 4 },
      { name: "Plumbing Parts", quantity: 2 },
      { name: "Construction Material", quantity: 3 },
      { name: "Burner Head", quantity: 1 },
    ],
  },
  {
    id: "laboratory-heat-source-level-3",
    room: "laboratory",
    module: "Heat Source",
    level: 3,
    name: "Heat Source Level 3 (Laboratory)",
    benefit: "+ 2 Heat control",
    requirements: [
      { name: "Steel", quantity: 10 },
      { name: "Plumbing Parts", quantity: 5 },
      { name: "Construction Material", quantity: 5 },
      { name: "Burner Head", quantity: 2 },
      { name: "Mechanical Parts", quantity: 2 },
      { name: "Dollars", quantity: 40000 },
    ],
  },
  {
    id: "laboratory-reaction-vessel-level-1",
    room: "laboratory",
    module: "Reaction Vessel",
    level: 1,
    name: "Reaction Vessel Level 1 (Laboratory)",
    benefit: "Adds Extraction & Reaction",
    requirements: [
      { name: "Plastics", quantity: 2 },
      { name: "Construction Material", quantity: 1 },
      { name: "Silicone Sealant", quantity: 1 },
    ],
  },
  {
    id: "laboratory-reaction-vessel-level-2",
    room: "laboratory",
    module: "Reaction Vessel",
    level: 2,
    name: "Reaction Vessel Level 2 (Laboratory)",
    benefit: "Adds Extraction & Reaction",
    requirements: [
      { name: "Steel", quantity: 4 },
      { name: "Chemicals", quantity: 2 },
      { name: "Zinc Electrode", quantity: 1 },
    ],
  },
  {
    id: "laboratory-reaction-vessel-level-3",
    room: "laboratory",
    module: "Reaction Vessel",
    level: 3,
    name: "Reaction Vessel Level 3 (Laboratory)",
    benefit: "+ 2 Extraction & Reaction",
    requirements: [
      { name: "Steel", quantity: 12 },
      { name: "Stainless Steel Sheet", quantity: 3 },
      { name: "Mechanical Parts", quantity: 6 },
      { name: "Dollars", quantity: 45000 },
    ],
  },
  {
    id: "laboratory-safety-level-1",
    room: "laboratory",
    module: "Safety",
    level: 1,
    name: "Safety Level 1 (Laboratory)",
    benefit: "+ 1 Safety & Containment",
    requirements: [
      { name: "Electrical Parts", quantity: 2 },
      { name: "Plastics", quantity: 2 },
      { name: "PC Fan", quantity: 2 },
    ],
  },
  {
    id: "laboratory-safety-level-2",
    room: "laboratory",
    module: "Safety",
    level: 2,
    name: "Safety Level 2 (Laboratory)",
    benefit: "+ 2 Safety & Containment",
    requirements: [
      { name: "Steel", quantity: 10 },
      { name: "Electrical Parts", quantity: 5 },
      { name: "Plumbing Parts", quantity: 5 },
      { name: "PC Fan", quantity: 3 },
      { name: "HEPA Filter", quantity: 1 },
      { name: "Dollars", quantity: 35000 },
    ],
  },
  {
    id: "laboratory-storage-equipment-level-1",
    room: "laboratory",
    module: "Storage Equipment",
    level: 1,
    name: "Storage Equipment Level 1 (Laboratory)",
    benefit: "+ 2 Storage Capacity",
    requirements: [
      { name: "Steel", quantity: 1 },
      { name: "Electrical Parts", quantity: 1 },
      { name: "Refrigerant", quantity: 1 },
      { name: "Plumbing Parts", quantity: 1 },
    ],
  },
  {
    id: "laboratory-storage-equipment-level-2",
    room: "laboratory",
    module: "Storage Equipment",
    level: 2,
    name: "Storage Equipment Level 2 (Laboratory)",
    benefit: "+ 2 Storage Capacity",
    requirements: [
      { name: "Steel", quantity: 3 },
      { name: "Glass", quantity: 3 },
      { name: "Plumbing Parts", quantity: 2 },
      { name: "Electrical Parts", quantity: 1 },
      { name: "Refrigerant", quantity: 1 },
    ],
  },
  {
    id: "laboratory-storage-equipment-level-3",
    room: "laboratory",
    module: "Storage Equipment",
    level: 3,
    name: "Storage Equipment Level 3 (Laboratory)",
    benefit: "+ 2 Storage Capacity",
    requirements: [
      { name: "Steel", quantity: 6 },
      { name: "Glass", quantity: 5 },
      { name: "Plumbing Parts", quantity: 2 },
      { name: "Refrigerant", quantity: 2 },
      { name: "Electrical Parts", quantity: 2 },
      { name: "Circuit Board", quantity: 2 },
      { name: "Dollars", quantity: 45000 },
    ],
  },
];

/**
 * Spawn & container intel hints strictly for the materials required across the 36 Hideout upgrades.
 */
export const MATERIAL_INTEL_HINTS: Record<
  string,
  {
    layerHint: Exclude<MapLayerKey, "tickedSpawns" | "poiLabels" | "subLocations" | "copsAndLzs">;
    spawnNotes: string[];
    description: string;
  }
> = {
  plastics: {
    layerHint: "blueCrates",
    spawnNotes: [
      "Tier 2–3 Building Material Crates (96 across Lamang, none in starter towns)",
      "Tool Boxes across Starter Towns & Industrial Yards",
      "Blue Lagoon Warehouses & Maintenance",
      "Ban Pa Village Sheds & Pha Lang Airfield",
    ],
    description: "Molded polymer stock used across Analysis, Glassware, Reaction Vessel, and Safety upgrades.",
  },
  steel: {
    layerHint: "blueCrates",
    spawnNotes: [
      "Tier 2–3 Building Material Crates",
      "Sawmill Yard & Warehouse",
      "Pha Lang Airfield Hangars",
      "Fort Narith Motor Pool & Tiger Bay Trade Depot",
    ],
    description: "Structural steel plates and bars required across Generator, Storage, Heat Source, and RF Sensors.",
  },
  wood: {
    layerHint: "blueCrates",
    spawnNotes: [
      "Sawmill Lumberyard Stacks & Warehouse",
      "Tier 2–3 Building Material Crates",
      "Pha Lang Airfield & Ban Pa Logging Areas",
      "Nam Thaven Lumberyard (loose world spawns)",
    ],
    description: "Treated timber planks for Level 1 workbenches, filtration frames, and starter storage racks.",
  },
  "plumbing parts": {
    layerHint: "blueCrates",
    spawnNotes: [
      "Tier 2–3 Building Material Crates",
      "Blue Lagoon Maintenance Sheds",
      "Ban Pa Dockyard & Utility Sheds",
      "Pha Lang Airfield Hangars & Fort Narith Utility",
    ],
    description: "Valves, brass couplings, and pipes for Extraction Vessels, Heat Sources, and Cold Storage.",
  },
  "mechanical parts": {
    layerHint: "blueCrates",
    spawnNotes: [
      "Tier 2–3 Building Material Crates & Tool Boxes",
      "Hunter's Paradise Garages & Firing Lanes",
      "Pha Lang Airfield Hangars",
      "Fort Narith Motor Pool",
    ],
    description: "Precision gears, actuators, and bearings used in Generator, Machine Tools, and Storage.",
  },
  "construction material": {
    layerHint: "blueCrates",
    spawnNotes: [
      "Tier 2–3 Building Material Crates",
      "Tiger Bay Cement Factory & Trade Depot",
      "Sawmill Warehouse & Pha Lang Airfield",
      "Fort Narith Construction Yards",
    ],
    description: "Heavy masonry anchors, fasteners, and composite sheeting for Heat Sources and Reaction Vessels.",
  },
  "stainless steel sheet": {
    layerHint: "blueCrates",
    spawnNotes: [
      "Tier 3 Building Material Crates ONLY (Ground Zero, Tiger Bay, Fort Narith, Midnight Sapphire)",
      "Northern Reach Supply Yard (Tier 4)",
      "Tiger Bay Cement Factory & Trade Depot (Tier 3)",
      "Fort Narith Hangars & Motor Pool (Tier 3)",
    ],
    description: "Corrosion-resistant sheet metal required for Level 3 Storage Equipment and Reaction Vessel L3.",
  },
  "electrical parts": {
    layerHint: "pcSpawns",
    spawnNotes: [
      "26 Electronic Supplies Areas (Trashed Campsites, Headquarter Desks, Radio Stations)",
      "YBL-1 Bunker Control Rooms",
      "Tiger Bay Mall Tech Shops & Lamtel",
      "Midnight Sapphire Admin, RLSL-1 & Northern Reach",
    ],
    description: "Capacitors, relays, and wiring harnesses for Micro Electronics, Analysis, Safety, and Generator L2.",
  },
  "circuit board": {
    layerHint: "pcSpawns",
    spawnNotes: [
      "26 Electronic Supplies Areas (including Trashed Campsites)",
      "Tiger Bay Mall Tech Shops",
      "RLSL-1 Radio Observatory & Northern Reach",
      "YBL-1 Bunker Server Room & Fort Narith Comms",
    ],
    description: "Printed circuit boards salvaged from high-tier electronics spawns.",
  },
  motherboard: {
    layerHint: "pcSpawns",
    spawnNotes: [
      "26 Electronic Supplies Areas & PC Towers",
      "Tiger Bay Mall Tech Shops (PC World)",
      "YBL-1 Server Room & Midnight Sapphire Admin",
      "RLSL-1 Radio Observatory & Northern Reach Offices",
    ],
    description: "Desktop & workstation motherboard required for Hardware Levels 1, 2, and 3.",
  },
  "graphics card": {
    layerHint: "pcSpawns",
    spawnNotes: [
      "Tier 2–4 PC Towers & High-Tier Electronics",
      "Tiger Bay Mall Tech Shops (PC World)",
      "Midnight Sapphire Hotel & Admin Wing",
      "RLSL-1 Radio Observatory & Northern Reach Offices",
    ],
    description: "High-demand GPU component needed for Hardware L1/L2 and Software L2.",
  },
  cpu: {
    layerHint: "pcSpawns",
    spawnNotes: [
      "26 Electronic Supplies Areas (Trashed Campsites, Field Camps, Tech Desks)",
      "Tiger Bay Mall (PC World & Lamtel) & Midnight Sapphire Admin",
      "YBL-1 Bunker Comms & Siang Radio Station",
      "Note: Standard CPU only — Server CPU spawns exclusively in Server/HQ Hubs",
    ],
    description: "Standard desktop processor harvested from PCs & Electronic Supplies Areas for Hardware L1–L2.",
  },
  "server cpu": {
    layerHint: "pcSpawns",
    spawnNotes: [
      "Tier 3–4 Dedicated Server Rooms & Bunker Hubs ONLY (Never at Trashed Campsites or Starter Towns)",
      "Northern Reach Headquarters & Offices (Tier 4)",
      "RLSL-1 Radio Observatory Headquarters (Tier 4)",
      "Fort Narith HQ Comms, Tiger Bay Mall Server & YBL-1 Bunker Server Room",
    ],
    description: "Enterprise multi-core server processor required strictly for Hardware Level 3.",
  },
  ram: {
    layerHint: "pcSpawns",
    spawnNotes: [
      "26 Electronic Supplies Areas & Desktop PCs",
      "Tiger Bay Mall Tech Shops (PC World)",
      "Midnight Sapphire Admin Wing",
      "YBL-1 Bunker Comms & RLSL-1 Observatory",
    ],
    description: "Memory DIMM modules needed across Hardware Levels 1, 2, and 3.",
  },
  "power supply": {
    layerHint: "pcSpawns",
    spawnNotes: [
      "26 Electronic Supplies Areas & PC Cases",
      "YBL-1 Bunker Server Room",
      "Tiger Bay Mall Tech Shops",
      "Midnight Sapphire Admin & Fort Narith Tech",
    ],
    description: "ATX power supply unit required across Hardware and Micro Electronics benches.",
  },
  "pc fan": {
    layerHint: "pcSpawns",
    spawnNotes: [
      "26 Electronic Supplies Areas (Trashed Campsites & PC Cases)",
      "Tiger Bay Mall Tech Shops",
      "Midnight Sapphire Hotel & Villas",
      "YBL-1 Bunker & Northern Reach Offices",
    ],
    description: "Cooling fan salvaged from PC cases; used in Hardware L1 and Laboratory Safety L1–L2.",
  },
  "civilian software": {
    layerHint: "pcSpawns",
    spawnNotes: [
      "Tier 2–4 Office Desks & Tech Hubs (None in Tier 1 Starter Towns)",
      "Tiger Bay Mall Tech Shops & Lamtel Offices (Tier 3)",
      "Midnight Sapphire Hotel Admin (Tier 3)",
      "Northern Reach Offices & RLSL-1 Observatory (Tier 4)",
    ],
    description: "Commercial software media required for Electronics Workshop Software Levels 1 and 2.",
  },
  "military software": {
    layerHint: "pcSpawns",
    spawnNotes: [
      "Tier 3–4 Military & Ground Zero HQ ONLY",
      "Fort Narith HQ & Comms Room (Tier 3)",
      "Northern Reach Headquarters & Armory (Tier 4)",
      "RLSL-1 Radio Observatory HQ & Tiger Bay UNLRA HQ",
    ],
    description: "Encrypted tactical firmware required for Electronics Workshop Software Levels 1 and 2.",
  },
  "signal generator": {
    layerHint: "pcSpawns",
    spawnNotes: [
      "Tier 2–4 Comms & Radio Facilities",
      "RLSL-1 Radio Observatory (Tier 4) & Northern Reach HQ (Tier 4)",
      "Fort Narith HQ Comms Room (Tier 3)",
      "Siang Radio Station, Amateur Radio Station & YBL-1 Comms",
    ],
    description: "Precision RF waveform generator for RF Sensors Levels 1 and 2.",
  },
  oscilloscope: {
    layerHint: "pcSpawns",
    spawnNotes: [
      "Tier 2–4 Radio Labs & Tech Rooms",
      "RLSL-1 Radio Observatory (Tier 4) & Northern Reach (Tier 4)",
      "Fort Narith HQ Comms & Tiger Bay Mall Tech Shops (Tier 3)",
      "Siang Radio Station & YBL-1 Bunker Control",
    ],
    description: "Benchtop diagnostic oscilloscope for Micro Electronics L2/L3 and RF Sensors L2.",
  },
  "laser tube": {
    layerHint: "pcSpawns",
    spawnNotes: [
      "Tier 3–4 High-Tech & Research ONLY",
      "RLSL-1 Radio Observatory (Tier 4)",
      "Northern Reach Headquarters & Research (Tier 4)",
      "Fort Narith HQ & Lakevale Sanctuary Labs",
    ],
    description: "Optical coherent emitter required for RF Sensors Level 2.",
  },
  "soldering iron": {
    layerHint: "pcSpawns",
    spawnNotes: [
      "Tool Boxes across Lamang (including Starter Towns)",
      "Pha Lang Airfield Hangars & Blue Lagoon Maintenance",
      "YBL-1 Maintenance Corridors",
    ],
    description: "Precision soldering station for Micro Electronics L1/L2 and RF Sensors L1.",
  },
  multimeter: {
    layerHint: "pcSpawns",
    spawnNotes: [
      "Tool Boxes & Electronics Workbenches",
      "Tiger Bay Mall (TOTO's Hardware) & Trade Depot",
      "Blue Lagoon Maintenance & YBL-1 Bunker Control",
    ],
    description: "Digital multimeter used across all Micro Electronics tiers.",
  },
  microscope: {
    layerHint: "apiLoot",
    spawnNotes: [
      "Tier 3–4 Medical Supplies Areas & Bio-Labs ONLY (Not Ban Pa or Starter Clinics)",
      "Lakevale Sanctuary Labs (Tier 4)",
      "Northern Reach Field Hospital & Research (Tier 4)",
      "Tiger Bay UNLRA HQ / Med Tent & Fort Narith Infirmary (Tier 3)",
    ],
    description: "Optical inspection microscope required for Micro Electronics Level 3.",
  },
  "laboratory flask": {
    layerHint: "apiLoot",
    spawnNotes: [
      "Medical Supplies Areas (Tier 3–4) & Ban Pa Clinic (Tier 2)",
      "Lakevale Sanctuary Labs (Tier 4) & Northern Reach Field Hospital (Tier 4)",
      "Tiger Bay UNLRA Medical Tent (Tier 3)",
      "Fort Narith Infirmary (Tier 3)",
    ],
    description: "Borosilicate glassware required for Laboratory Glassware Levels 1 and 2.",
  },
  "mechanical pipette": {
    layerHint: "apiLoot",
    spawnNotes: [
      "Tier 3–4 Medical Supplies Areas & Labs ONLY (Not Ban Pa Clinic)",
      "Lakevale Sanctuary Labs (Tier 4)",
      "Northern Reach Field Hospital (Tier 4)",
      "Tiger Bay UNLRA Med Tent & Fort Narith Infirmary (Tier 3)",
    ],
    description: "Micropipette instrument required for Laboratory Glassware Level 2.",
  },
  "complex glass electrode": {
    layerHint: "apiLoot",
    spawnNotes: [
      "Tier 3–4 Bio-Labs & Quarantine ONLY (Not Ban Pa Clinic)",
      "Lakevale Sanctuary Labs (Tier 4)",
      "Northern Reach Field Hospital & Decon (Tier 4)",
      "Tiger Bay UNLRA Quarantine & Fort Narith Infirmary (Tier 3)",
    ],
    description: "pH / ion-selective glass electrode required for Analysis Level 1.",
  },
  "vapor lamp": {
    layerHint: "apiLoot",
    spawnNotes: [
      "Tier 3–4 Quarantine & Ground Zero Labs ONLY",
      "Lakevale Sanctuary Asylum & Labs (Tier 4)",
      "Northern Reach Decon & Research (Tier 4)",
      "Tiger Bay UNLRA Quarantine & Mall Medical (Tier 3)",
    ],
    description: "Spectral discharge lamp required for Analysis Level 2.",
  },
  "crystal prism": {
    layerHint: "apiLoot",
    spawnNotes: [
      "Tier 3–4 Optical & Ground Zero Research ONLY (Not Midnight Sapphire Safes)",
      "Lakevale Sanctuary Asylum & Labs (Tier 4)",
      "RLSL-1 Observatory Optical Lab & Northern Reach (Tier 4)",
      "Tiger Bay UNLRA Lab (Tier 3)",
    ],
    description: "Optical dispersion prism required for Analysis Level 2.",
  },
  "hepa filter": {
    layerHint: "apiLoot",
    spawnNotes: [
      "Tier 3–4 Quarantine, Field Hospitals & Trade Depot ONLY (Not Starter Clinics)",
      "Northern Reach Field Hospital & Decontamination (Tier 4)",
      "Lakevale Sanctuary Bio-Labs (Tier 4)",
      "Tiger Bay UNLRA Quarantine / Trade Depot & Fort Narith Infirmary (Tier 3)",
    ],
    description: "High-efficiency particulate air filter required for Laboratory Safety Level 2.",
  },
  chemicals: {
    layerHint: "apiLoot",
    spawnNotes: [
      "20 Chemicals Supplies Areas (Drug Labs & Chemical Stashes across Lamang)",
      "Lakevale Sanctuary Labs & Northern Reach Decon (Tier 4)",
      "Hunter's Paradise Drug Lab, Sawmill & Ban Pa Stashes (Tier 2)",
      "Tiger Bay & Fort Narith Chemical Areas (Tier 3)",
    ],
    description: "Industrial laboratory reagents required for Reaction Vessel Level 2.",
  },
  "zinc electrode": {
    layerHint: "apiLoot",
    spawnNotes: [
      "Tier 2–4 Bio-Labs & Bunker Tech Rooms",
      "Lakevale Sanctuary Labs & RLSL-1 Underground (Tier 4)",
      "Northern Reach Decon (Tier 4) & Tiger Bay UNLRA Lab (Tier 3)",
      "YBL-1 Bunker Maintenance (Tier 2)",
    ],
    description: "Sacrificial zinc anode/electrode required for Reaction Vessel Level 2.",
  },
  refrigerant: {
    layerHint: "blueCrates",
    spawnNotes: [
      "Commercial Kitchens, Medical Labs & Tier 2–4 Fridges",
      "Tiger Bay UNLRA HQ & Mall Kitchens",
      "Midnight Sapphire Hotel Kitchens & Blue Lagoon Resort Kitchens",
      "Fort Narith HQ Kitchen/Infirmary & Hunter's Paradise Restaurant",
    ],
    description: "Cooling gas canister required for Laboratory Storage Equipment Levels 1–3.",
  },
  glass: {
    layerHint: "blueCrates",
    spawnNotes: [
      "Tier 2–3 Building Material Crates & Hardware Shelves",
      "Ban Pa Clinic/Village & Blue Lagoon Resort",
      "Midnight Sapphire Villas & Tiger Bay Mall (TOTO's Hardware)",
      "Starter Town Shops (world shelves, no blue crates)",
    ],
    description: "Tempered glass panes used in Laboratory Glassware and Cold Storage.",
  },
  fabrics: {
    layerHint: "blueCrates",
    spawnNotes: [
      "Residential Homes, Campsites & Shelters",
      "Starter Town Homes (Kiu Vongsa, Pha Lang, Nam Thaven)",
      "Midnight Sapphire Villas & Ban Pa Village",
    ],
    description: "Filter cloth and woven fabric stock used in Laboratory Filtration Level 1.",
  },
  "fine metal mesh": {
    layerHint: "blueCrates",
    spawnNotes: [
      "Tier 2–3 Building Material Crates & Industrial Sheds",
      "Sawmill Warehouse & Pha Lang Airfield Hangars",
      "Fort Narith Motor Pool & Tiger Bay Cement Factory / Trade Depot",
    ],
    description: "Woven stainless mesh screens required for Laboratory Filtration Level 2.",
  },
  copper: {
    layerHint: "blueCrates",
    spawnNotes: [
      "Tier 2–3 Building Material Crates & Industrial Maintenance",
      "Sawmill Warehouse & Pha Lang Airfield",
      "Blue Lagoon Maintenance & Hunter's Paradise",
      "Tiger Bay Trade Depot & TOTO's Hardware",
    ],
    description: "Conductive copper tubing and coils for Extraction Vessel Levels 1 and 2.",
  },
  "analog indicator": {
    layerHint: "blueCrates",
    spawnNotes: [
      "Tool Boxes & Generator/Maintenance Rooms",
      "Pha Lang Airfield Hangars & YBL-1 Bunker Generator Room",
      "Fort Narith Hangars & Hunter's Paradise Garages",
    ],
    description: "Dial pressure gauge required for Extraction Vessel Levels 1 and 2.",
  },
  "water pump": {
    layerHint: "blueCrates",
    spawnNotes: [
      "Tier 2–3 Building Material Crates & Utility / Industrial",
      "Tiger Bay Cement Factory & Trade Depot",
      "Blue Lagoon Maintenance, Pha Lang Airfield & Ban Pa Dockyard",
      "YBL-1 Bunker Utility & Fort Narith",
    ],
    description: "Circulation pump required for Extraction Vessel Level 2.",
  },
  "burner head": {
    layerHint: "blueCrates",
    spawnNotes: [
      "Commercial Kitchens & Mess Halls ONLY (Not Garages or Sawmill Workshops)",
      "Fort Narith HQ Kitchen/Mess & YBL-1 Bunker Mess Hall",
      "Tiger Bay UNLRA / Mall Kitchens",
      "Blue Lagoon Resort Kitchens & Midnight Sapphire Hotel Kitchens",
    ],
    description: "High-output gas burner assembly for Heat Source Levels 2 and 3.",
  },
  "silicone sealant": {
    layerHint: "blueCrates",
    spawnNotes: [
      "Tool Boxes across Starter Towns, Sawmill & Pha Lang Airfield",
      "Tier 2–3 Building Material Crates",
      "Blue Lagoon Maintenance & Tiger Bay Cement Factory / TOTO's Hardware",
    ],
    description: "Chemical-resistant sealant cartridge for Reaction Vessel Level 1.",
  },
  dynamo: {
    layerHint: "blueCrates",
    spawnNotes: [
      "Utility / Generator Rooms & Industrial Yards",
      "Pha Lang Airfield Hangars & Fort Narith Motor Pool",
      "YBL-1 Generator Room",
      "Hunter's Paradise Firing Lanes (pickup beds / drums) & Garages",
    ],
    description: "Alternator/dynamo unit required for Utility Room Generator Levels 1 and 2.",
  },
  "motor oil": {
    layerHint: "blueCrates",
    spawnNotes: [
      "Garages, Gas Stations, Hangars & Tool Boxes",
      "Pha Lang Airfield Hangars & Fort Narith Motor Pool",
      "Hunter's Paradise Garages & Sawmill Yard",
      "Starter Town Gas Stations & Garages",
    ],
    description: "Engine lubricant required for Utility Room Generator Levels 1 and 2.",
  },
  toolset: {
    layerHint: "blueCrates",
    spawnNotes: [
      "Tool Boxes & Industrial Workshops",
      "Tiger Bay Mall (TOTO's Hardware) & Sawmill Sheds",
      "Hunter's Paradise Garages & Pha Lang Airfield Hangars",
      "Starter Town Workshops & Tool Boxes",
    ],
    description: "Mechanics toolset required for Machine Tools L1 and Micro Electronics L1.",
  },
  "tooling coolant": {
    layerHint: "blueCrates",
    spawnNotes: [
      "Tier 2–4 Industrial Workshops & Tool Boxes",
      "Northern Reach Supply Depot (Tier 4) & RLSL-1 Tech Rooms (Tier 4)",
      "Tiger Bay Trade Depot & TOTO's Hardware (Tier 3)",
      "YBL-1 Bunker Workshops, Hunter's Paradise & Pha Lang Airfield (Tier 2)",
    ],
    description: "CNC cutting fluid required for Machine Tools Level 2.",
  },
  "cnc drill bits": {
    layerHint: "blueCrates",
    spawnNotes: [
      "Tier 2–4 Industrial Workshops & Tool Boxes",
      "Sawmill Maintenance & Hunter's Paradise Workshops",
      "Tiger Bay Trade Depot & TOTO's Hardware (Tier 3)",
      "Fort Narith Machine Shop & Northern Reach Supply Depot",
    ],
    description: "Carbide milling & drill bit set required for Machine Tools Level 2.",
  },
};

export const FALLBACK_DISASSEMBLY_RECIPES: DisassemblyRecipeDef[] = [
  {
    id: "artillery-ballistic-calculator",
    name: "Artillery Ballistic Calculator",
    duration: "4 hours",
    outcomes: ["LAF Artillery Data Logs", "CPU Card"],
    outcomeDetails: [
      {
        name: "LAF Artillery Data Logs",
        kind: "Intel / Data Drive",
      },
      {
        name: "CPU Card",
        kind: "Crafting Material",
        sellPrice: "$4,000",
        gridSize: "1x1",
        weight: "0.3kg",
        image:
          "https://static.wikia.nocookie.net/gray-zone-warfare/images/7/79/CPU_Card_inspect.png/revision/latest/scale-to-width-down/268?cb=20261108044752",
      },
    ],
    sellPrice: "$8,000",
    gridSize: "1x2",
    weight: "1.7kg",
    manufacturer: "General Local",
    category: "Avionics & Weapons",
    image:
      "https://static.wikia.nocookie.net/gray-zone-warfare/images/8/87/Artillery_Ballistic_Calculator_inspect.png/revision/latest/scale-to-width-down/268?cb=20261107024456",
    station: "Electronics Workshop",
  },
  {
    id: "imsi-catcher",
    name: "IMSI Catcher",
    duration: "4 hours",
    outcomes: ["Incriminating Phone Logs", "Spoofing ASIC Module"],
    outcomeDetails: [
      {
        name: "Incriminating Phone Logs",
        kind: "Intel / Data Drive",
        sellPrice: "$6,400",
      },
      {
        name: "Spoofing ASIC Module",
        kind: "Crafting Material",
        sellPrice: "$4,000",
        gridSize: "1x1",
        weight: "0.32kg",
        image:
          "https://static.wikia.nocookie.net/gray-zone-warfare/images/2/2c/Spoofing_ASIC_Module_inspect.png/revision/latest/scale-to-width-down/268?cb=20261107050846",
      },
    ],
    sellPrice: "$8,000",
    gridSize: "2x2",
    weight: "8kg",
    manufacturer: "General Local",
    category: "Electronics & Comms",
    image:
      "https://static.wikia.nocookie.net/gray-zone-warfare/images/e/e6/IMSI_Catcher_inspect.png/revision/latest/scale-to-width-down/268?cb=20261106162532",
    station: "Electronics Workshop",
  },
  {
    id: "unlra-field-terminal",
    name: "UNLRA Field Terminal",
    duration: "4 hours",
    outcomes: ["UNLRA Relief Manifest", "Multi-Bus Converter"],
    outcomeDetails: [
      {
        name: "UNLRA Relief Manifest",
        kind: "Intel / Data Drive",
      },
      {
        name: "Multi-Bus Converter",
        kind: "Crafting Material",
        sellPrice: "$4,000",
        gridSize: "1x1",
        weight: "0.25kg",
        image:
          "https://static.wikia.nocookie.net/gray-zone-warfare/images/e/e8/Multi-Bus_Converter_inspect.png/revision/latest?cb=20261102054420",
      },
    ],
    sellPrice: "$8,000",
    gridSize: "2x1",
    weight: "0.72kg",
    manufacturer: "General Local",
    category: "Electronics & Comms",
    image:
      "https://static.wikia.nocookie.net/gray-zone-warfare/images/2/26/UNLRA_Field_Terminal_inspect.png/revision/latest?cb=20261028195902",
    station: "Electronics Workshop",
  },
  {
    id: "baget-53-31-onboard-computer",
    name: "Baget-53-31 Onboard Computer",
    duration: "6 hours",
    outcomes: ["Flight Data Drive", "Avionics Processor Board"],
    outcomeDetails: [
      {
        name: "Flight Data Drive",
        kind: "Intel / Data Drive",
        sellPrice: "$9,600",
      },
      {
        name: "Avionics Processor Board",
        kind: "Crafting Material",
        sellPrice: "$6,000",
        gridSize: "1x1",
        weight: "0.5kg",
        image:
          "https://static.wikia.nocookie.net/gray-zone-warfare/images/6/61/Avionics_Processor_Board_inspect.png/revision/latest/scale-to-width-down/268?cb=20261109182711",
      },
    ],
    sellPrice: "$12,000",
    gridSize: "2x1",
    weight: "2.25kg",
    manufacturer: "General East",
    category: "Avionics & Weapons",
    image:
      "https://static.wikia.nocookie.net/gray-zone-warfare/images/b/bc/Baget-53-31_Onboard_Computer_inspect.png/revision/latest/scale-to-width-down/268?cb=20261024200431",
    station: "Electronics Workshop",
  },
  {
    id: "drone-interceptor",
    name: "Drone Interceptor",
    duration: "6 hours",
    outcomes: ["AI Targeting Module"],
    outcomeDetails: [
      {
        name: "AI Targeting Module",
        kind: "Module",
      },
    ],
    sellPrice: "$12,000",
    gridSize: "2x2",
    weight: "1.3kg",
    manufacturer: "Russian Army",
    category: "Avionics & Weapons",
    image:
      "https://static.wikia.nocookie.net/gray-zone-warfare/images/e/ec/Drone_Interceptor_inspect.png/revision/latest/scale-to-width-down/268?cb=20261107045535",
    station: "Electronics Workshop",
  },
  {
    id: "manpack-tactical-radio",
    name: "Manpack Tactical Radio",
    duration: "6 hours",
    outcomes: ["Encryption Key Drive", "FPGA Module"],
    outcomeDetails: [
      {
        name: "Encryption Key Drive",
        kind: "Intel / Data Drive",
      },
      {
        name: "FPGA Module",
        kind: "Crafting Material",
        sellPrice: "$6,000",
        gridSize: "2x1",
        weight: "0.2kg",
        image:
          "https://static.wikia.nocookie.net/gray-zone-warfare/images/7/7e/FPGA_Module_inspect.png/revision/latest/scale-to-width-down/268?cb=20261024200429",
      },
    ],
    sellPrice: "$12,000",
    gridSize: "2x1",
    weight: "2.5kg",
    manufacturer: "General Local",
    category: "Electronics & Comms",
    image:
      "https://static.wikia.nocookie.net/gray-zone-warfare/images/1/19/Manpack_Tactical_Radio_inspect.png/revision/latest/scale-to-width-down/268?cb=20261028195627",
    station: "Electronics Workshop",
  },
  {
    id: "missile-seeker-head",
    name: "Missile Seeker Head",
    duration: "6 hours",
    outcomes: ["Missile Guidance Circuit"],
    outcomeDetails: [
      {
        name: "Missile Guidance Circuit",
        kind: "Module",
      },
    ],
    sellPrice: "$12,000",
    gridSize: "2x2",
    weight: "3kg",
    manufacturer: "Russian Army",
    category: "Avionics & Weapons",
    image:
      "https://static.wikia.nocookie.net/gray-zone-warfare/images/a/a8/Missile_Seeker_Head_inspect.png/revision/latest?cb=20261024200424",
    station: "Electronics Workshop",
  },
  {
    id: "st1122-storage-computer",
    name: "ST1122 Storage Computer",
    duration: "6 hours",
    outcomes: ["Incriminating Data Drive", "Server RAM Module"],
    outcomeDetails: [
      {
        name: "Incriminating Data Drive",
        kind: "Intel / Data Drive",
        sellPrice: "$9,600",
      },
      {
        name: "Server RAM Module",
        kind: "Crafting Material",
        sellPrice: "$6,000",
        gridSize: "2x1",
        weight: "0.05kg",
        image:
          "https://static.wikia.nocookie.net/gray-zone-warfare/images/7/73/Server_RAM_Module_inspect.png/revision/latest/scale-to-width-down/268?cb=20261024200428",
      },
    ],
    sellPrice: "$12,000",
    gridSize: "2x1",
    weight: "4kg",
    manufacturer: "General Local",
    category: "Electronics & Comms",
    image:
      "https://static.wikia.nocookie.net/gray-zone-warfare/images/d/d3/ST1122_Storage_Computer_inspect.png/revision/latest/scale-to-width-down/268?cb=20261107045525",
    station: "Electronics Workshop",
  },
  {
    id: "chemical-containment-container",
    name: "Chemical Containment Container",
    duration: "8 hours",
    outcomes: ["Biohazard Canister"],
    outcomeDetails: [
      {
        name: "Biohazard Canister",
        kind: "Canister / Biohazard",
      },
    ],
    sellPrice: "$18,000",
    gridSize: "2x2",
    weight: "5kg",
    manufacturer: "General Local",
    category: "Containers & Chem",
    image: null,
    station: "Electronics Workshop / Lab",
  },
  {
    id: "chemical-munitions-container",
    name: "Chemical Munitions Container",
    duration: "8 hours",
    outcomes: ["Sarin Canister"],
    outcomeDetails: [
      {
        name: "Sarin Canister",
        kind: "Canister / Biohazard",
        sellPrice: "$12,000",
      },
    ],
    sellPrice: "$12,000",
    gridSize: "2x2",
    weight: "5kg",
    manufacturer: "General Local",
    category: "Containers & Chem",
    image:
      "https://static.wikia.nocookie.net/gray-zone-warfare/images/5/50/Chemical_Munitions_Container_icon.png/revision/latest/scale-to-width-down/110?cb=20261104174035",
    station: "Electronics Workshop / Lab",
  },
  {
    id: "counter-ied-jammer-unit",
    name: "Counter IED/Jammer Unit",
    duration: "8 hours",
    outcomes: [
      "Electronic Warfare Configuration Drive",
      "Digital Synthesis Engine",
    ],
    outcomeDetails: [
      {
        name: "Electronic Warfare Configuration Drive",
        kind: "Intel / Data Drive",
      },
      {
        name: "Digital Synthesis Engine",
        kind: "Crafting Material",
        sellPrice: "$9,000",
        gridSize: "1x1",
        weight: "0.1kg",
        image:
          "https://static.wikia.nocookie.net/gray-zone-warfare/images/8/8e/Digital_Synthesis_Engine_inspect.png/revision/latest?cb=20261026212133",
      },
    ],
    sellPrice: "$18,000",
    gridSize: "2x2",
    weight: "9kg",
    manufacturer: "General Local",
    category: "Electronics & Comms",
    image:
      "https://static.wikia.nocookie.net/gray-zone-warfare/images/9/9f/Counter_IED-Jammer_Unit_inspect.png/revision/latest/scale-to-width-down/268?cb=20261024231625",
    station: "Electronics Workshop",
  },
  {
    id: "last-line-defense-container",
    name: "Last Line Defense Container",
    duration: "8 hours",
    outcomes: ["Nerve Gas Canister"],
    outcomeDetails: [
      {
        name: "Nerve Gas Canister",
        kind: "Canister / Biohazard",
      },
    ],
    sellPrice: "$18,000",
    gridSize: "2x2",
    weight: "4kg",
    manufacturer: "General Local",
    category: "Containers & Chem",
    image:
      "https://static.wikia.nocookie.net/gray-zone-warfare/images/3/35/Last_Line_Defense_Container_inspect.png/revision/latest/scale-to-width-down/268?cb=20261028195624",
    station: "Electronics Workshop / Lab",
  },
  {
    id: "portable-satcom-terminal",
    name: "Portable SATCOM Terminal",
    duration: "8 hours",
    outcomes: [
      "Uplink Credentials Drive",
      "Oven-Controlled Crystal Oscillator",
    ],
    outcomeDetails: [
      {
        name: "Uplink Credentials Drive",
        kind: "Intel / Data Drive",
      },
      {
        name: "Oven-Controlled Crystal Oscillator",
        kind: "Crafting Material",
        sellPrice: "$9,000",
        gridSize: "1x1",
        weight: "0.01kg",
        image:
          "https://static.wikia.nocookie.net/gray-zone-warfare/images/c/c2/Oven-Controlled_Crystal_Oscillator_inspect.png/revision/latest?cb=20261026212131",
      },
    ],
    sellPrice: "$18,000",
    gridSize: "2x2",
    weight: "6.1kg",
    manufacturer: "General Local",
    category: "Electronics & Comms",
    image:
      "https://static.wikia.nocookie.net/gray-zone-warfare/images/3/37/Portable_SATCOM_Terminal_inspect.png/revision/latest?cb=20261026020134",
    station: "Electronics Workshop",
  },
  {
    id: "radar-signal-processor",
    name: "Radar Signal Processor",
    duration: "8 hours",
    outcomes: [
      "Deep-Space Observation Data Drive",
      "High-Speed Digital Processor Board",
    ],
    outcomeDetails: [
      {
        name: "Deep-Space Observation Data Drive",
        kind: "Intel / Data Drive",
        sellPrice: "$12,000",
      },
      {
        name: "High-Speed Digital Processor Board",
        kind: "Crafting Material",
        sellPrice: "$9,000",
        gridSize: "2x1",
        weight: "0.1kg",
        image:
          "https://static.wikia.nocookie.net/gray-zone-warfare/images/6/63/High-Speed_Digital_Processor_Board_inspect.png/revision/latest/scale-to-width-down/268?cb=20261026212129",
      },
    ],
    sellPrice: "$18,000",
    gridSize: "2x2",
    weight: "5kg",
    manufacturer: "General Local",
    category: "Electronics & Comms",
    image:
      "https://static.wikia.nocookie.net/gray-zone-warfare/images/7/71/Radar_Signal_Processor_inspect.png/revision/latest/scale-to-width-down/268?cb=20261024231628",
    station: "Electronics Workshop",
  },
  {
    id: "radioisotope-fuel-cell",
    name: "Radioisotope Fuel Cell",
    duration: "8 hours",
    outcomes: ["Plutonium Canister"],
    outcomeDetails: [
      {
        name: "Plutonium Canister",
        kind: "Canister / Biohazard",
      },
    ],
    sellPrice: "$18,000",
    gridSize: "1x2",
    weight: "4kg",
    manufacturer: "General Local",
    category: "Containers & Chem",
    image: null,
    station: "Electronics Workshop / Lab",
  },
];
