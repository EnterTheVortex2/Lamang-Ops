import { formatGridSquare, LAMANG_POIS, type LamangPoi } from "../config/mapConfig";
import { resolveTacticalImageUrl } from "../utils/imageUtils";

export type PuzzleBreachType =
  | "power-hack"
  | "hack-door"
  | "power-sequence"
  | "code-or-hack"
  | "keycard-or-hack";

export interface PuzzleStepDef {
  id: string;
  order: number;
  title: string;
  detail: string;
  poiMatch?: string;
  regionHint?: string;
  fallbackCoords?: { x: number; y: number };
  locationLabel?: string;
  itemRef?: string;
  optional?: boolean;
}

export interface PuzzleDoorDef {
  id: string;
  name: string;
  region: string;
  sublocation: string;
  breachType: PuzzleBreachType;
  breachBadge: string;
  requiredHackingTier: "None" | "Tier 1 (Basic)" | "Tier 2 (Advanced)" | "Tier 3 (Superior)";
  canBypassWithHack: boolean;
  powerVsHackVerdict: string;
  summary: string;
  requiredGear: string[];
  requiredKeys: string[];
  linkedTasks: string[];
  poiMatch: string;
  fallbackCoords: { x: number; y: number };
  steps: PuzzleStepDef[];
  proTip?: string;
}

export interface ResolvedPuzzleStep extends PuzzleStepDef {
  coords: { x: number; y: number; grid: string } | null;
}

export interface ResolvedPuzzleDoor extends Omit<PuzzleDoorDef, "steps"> {
  x: number;
  y: number;
  grid: string;
  lz: string;
  steps: ResolvedPuzzleStep[];
}

export interface HackingToolComponentDef {
  materialName: string;
  quantity: number;
  disassembleFrom: string;
  disassembleDuration: string;
  disassembleStation: string;
  bestZones: string[];
}

export interface HackingToolTierDef {
  id: string;
  tier: 1 | 2 | 3;
  name: string;
  shortTag: string;
  image: string | null;
  craftTime: string;
  gridSize: string;
  weight: string;
  unlockTaskName: string;
  unlockVendor: string;
  unlockVendorRank: string;
  unlockRequirements: string[];
  opensLocks: string;
  components: HackingToolComponentDef[];
  skipNote: string;
}

export interface HackingPhaseStep {
  id: string;
  phase: 1 | 2 | 3;
  title: string;
  subtitle: string;
  detail: string;
  upgradeIds?: string[];
  taskNames?: string[];
  itemRefs?: string[];
}

function findPoiCoords(
  poiName: string,
  region?: string
): LamangPoi | null {
  const target = poiName.trim().toLowerCase();
  const reg = region?.trim().toLowerCase();

  const exactInRegion = LAMANG_POIS.find(
    (p) =>
      p.name.toLowerCase() === target &&
      (!reg ||
        (p.parentRegion || "").toLowerCase() === reg ||
        p.name.toLowerCase() === reg)
  );
  if (exactInRegion) return exactInRegion;

  const partialInRegion = LAMANG_POIS.find(
    (p) =>
      p.name.toLowerCase().includes(target) &&
      (!reg ||
        (p.parentRegion || "").toLowerCase() === reg ||
        p.name.toLowerCase() === reg)
  );
  if (partialInRegion) return partialInRegion;

  const exactAny = LAMANG_POIS.find((p) => p.name.toLowerCase() === target);
  if (exactAny) return exactAny;

  if (reg) {
    const regionPoi = LAMANG_POIS.find(
      (p) =>
        (p.kind === "major" || p.kind === "tier4") &&
        p.name.toLowerCase() === reg
    );
    if (regionPoi) return regionPoi;
  }

  return null;
}

export const RAW_PUZZLE_DOORS: PuzzleDoorDef[] = [
  {
    id: "rlsl-1-telescope-building",
    name: "RLSL-1 Telescope Building & Underground Tunnel",
    region: "RLSL-1 Radio Observatory",
    sublocation: "Telescope Building",
    breachType: "power-hack",
    breachBadge: "Power + Tier 3 Hack",
    requiredHackingTier: "Tier 3 (Superior)",
    canBypassWithHack: false,
    powerVsHackVerdict:
      "You CANNOT skip the Superior Hacking Tool: the underground Telescope tunnel keypad is strictly 'Hack Only' (no manual PIN exists). Turning ON the Backup Generator and lifting Lockdown at the Power-Routing Station are still needed to power the Telescope terminal and deep-security rooms/containers inside (auto-completes if another squad on your server already flipped them).",
    summary:
      "Flagship Update 0.5 multi-step facility breach. Restore backup power near Supply Depot, clear facility lockdown at the power-routing station, then enter the underground tunnel to hack the 'Hack Only' radar door with a Tier 3 Superior Hacking Tool.",
    requiredGear: ["Superior Hacking Tool"],
    requiredKeys: [
      "RLSL-1 Generator Building Key",
      "RLSL-1 Radio Telescope Storage Key",
    ],
    linkedTasks: ["Distant Voice", "Silent Night"],
    poiMatch: "Telescope Building",
    fallbackCoords: { x: 5154, y: 4080 },
    steps: [
      {
        id: "rlsl-step-hq-servers",
        order: 1,
        title: "Access HQ Servers & Archive (Optional Prep)",
        detail:
          "Clear RLSL-1 HQ 1st floor (IT Offices + Comms Room servers) and 2nd floor Archive drawer if running Lab Rat's Distant Voice before heading underground.",
        poiMatch: "Headquarters",
        regionHint: "RLSL-1 Radio Observatory",
        fallbackCoords: { x: 5073, y: 4049 },
        locationLabel: "RLSL-1 Headquarters (1F & 2F)",
      },
      {
        id: "rlsl-step-generator",
        order: 2,
        title: "Power ON Backup Generator Building",
        detail:
          "Head to the Generator Building between Supply Depot and Wreck Yard. Unlock with RLSL-1 Generator Building Key (RLSL Gen) if locked and flip the main power switch located between the two large generators to ON.",
        poiMatch: "Supply Depot",
        regionHint: "RLSL-1 Radio Observatory",
        fallbackCoords: { x: 4944, y: 4041 },
        locationLabel: "Between Supply Depot & Wreck Yard",
        itemRef: "RLSL-1 Generator Building Key",
        optional: true,
      },
      {
        id: "rlsl-step-lockdown",
        order: 3,
        title: "Lift Lockdown at Power-Routing Station",
        detail:
          "Check the power-routing / utility station near the compound tunnels and ensure the facility lockdown is lifted so inner telemetry terminals and high-security rooms energize.",
        poiMatch: "Telescope Building",
        regionHint: "RLSL-1 Radio Observatory",
        fallbackCoords: { x: 5130, y: 4065 },
        locationLabel: "RLSL-1 Power-Routing Station",
        optional: true,
      },
      {
        id: "rlsl-step-tunnel-hack",
        order: 4,
        title: "Enter Underground Tunnel & Hack Telescope Door",
        detail:
          "Descend into the RLSL-1 underground tunnel system toward the Telescope Building base. Use your Superior Hacking Tool (Tier 3) on the 'Hack Only' electronic door leading up into the radar facility, then climb the stairs to the control desk, Archives (2F), IT Offices (3F), and Operations Room (3F).",
        poiMatch: "Telescope Building",
        regionHint: "RLSL-1 Radio Observatory",
        fallbackCoords: { x: 5154, y: 4080 },
        locationLabel: "Telescope Underground Tunnel Door",
        itemRef: "Superior Hacking Tool",
      },
      {
        id: "rlsl-step-storage-hatch",
        order: 5,
        title: "Telescope Storage Room (Key or Roof Hatch Bypass)",
        detail:
          "To loot the Telescope Storage room (Last Line Defense Container / high-tier tech), use RLSL-1 Radio Telescope Storage Key (RLSL Strg) — or drop down through the open roof hatch/vent if you don't have the key.",
        poiMatch: "Telescope Building",
        regionHint: "RLSL-1 Radio Observatory",
        fallbackCoords: { x: 5162, y: 4090 },
        locationLabel: "Telescope Storage / Roof Hatch",
        itemRef: "RLSL-1 Radio Telescope Storage Key",
      },
    ],
    proTip:
      "You can loot Radar Signal Processors right inside RLSL-1 HQ & the electronics workshop to disassemble into High-Speed Digital Processor Boards for crafting the Superior Hacking Tool.",
  },
  {
    id: "ybl-1-west-electric-door",
    name: "YBL-1 West Flooded Bunker & Breaker Door",
    region: "YBL-1 Bunker",
    sublocation: "YBL-1 West",
    breachType: "power-sequence",
    breachBadge: "Generator + Breakers",
    requiredHackingTier: "None",
    canBypassWithHack: false,
    powerVsHackVerdict:
      "Requires physical generator startup + breaker sequence + water pump cycle. Leaving the Water Pump running keeps the final Electric Door switch locked — you MUST switch the pump OFF after draining before opening the door.",
    summary:
      "Multi-stage power and drainage puzzle at YBL-1 West & underground bunker wings. Follow the Generator Startup Instructions sequence to drain flooded corridors and energize the electric bunker door.",
    requiredGear: ["Generator Startup Instructions (Intel)"],
    requiredKeys: [
      "YBL-1 Generator Room Key",
      "YBL-1 Maintenance Door Key",
    ],
    linkedTasks: ["Living In Burrows", "Mystery Machines", "The Negotiator"],
    poiMatch: "YBL-1 West",
    fallbackCoords: { x: 3842, y: 2083 },
    steps: [
      {
        id: "ybl-step-instructions",
        order: 1,
        title: "Check Generator Startup Instructions Note",
        detail:
          "Inspect the small control shack at the highest point of YBL-1 West for the Generator Startup Instructions intel confirming the breaker sequence.",
        poiMatch: "YBL-1 West",
        regionHint: "YBL-1",
        fallbackCoords: { x: 3842, y: 2083 },
        locationLabel: "YBL-1 West High Control Shack",
      },
      {
        id: "ybl-step-main-gen",
        order: 2,
        title: "Start Main Generator (Back Generator Room)",
        detail:
          "Enter the generator building back room (unlock with YBL-1 Generator Room Key in main bunker or access YBL-1 West back room) and switch the Main Generator ON.",
        poiMatch: "YBL-1 West",
        regionHint: "YBL-1",
        fallbackCoords: { x: 3854, y: 2092 },
        locationLabel: "Generator Back Room",
        itemRef: "YBL-1 Generator Room Key",
      },
      {
        id: "ybl-step-breakers",
        order: 3,
        title: "Flip Exterior Breakers in Order: 2 -> 3 -> 1 -> 4",
        detail:
          "Go to the exterior wall breaker bank and toggle switches in the exact sequence 2 -> 3 -> 1 -> 4. Wait 1–2 seconds between toggles if another player recently tripped them.",
        poiMatch: "YBL-1 West",
        regionHint: "YBL-1",
        fallbackCoords: { x: 3846, y: 2086 },
        locationLabel: "Exterior Breaker Panel",
      },
      {
        id: "ybl-step-pump-cycle",
        order: 4,
        title: "Drain Water: Pump ON, then Pump OFF",
        detail:
          "Turn the Water Pump ON to drain the flooded section. Once drained, turn the Water Pump OFF — the electric door switch will NOT unlock while the pump stays running.",
        poiMatch: "YBL-1 West",
        regionHint: "YBL-1",
        fallbackCoords: { x: 3848, y: 2080 },
        locationLabel: "Bunker Pump Controls",
      },
      {
        id: "ybl-step-door-switch",
        order: 5,
        title: "Trigger Electric Door Switch",
        detail:
          "Interact with the switch beside the heavy electric door (wait a couple seconds after shutting off the pump if unresponsive) to open the bunker wing.",
        poiMatch: "YBL-1 Bunker",
        regionHint: "YBL-1",
        fallbackCoords: { x: 4319, y: 2254 },
        locationLabel: "YBL-1 Electric Security Door",
      },
    ],
    proTip:
      "If any YBL-1 keypad still says 'No Power' while lights are on, inspect the air-filtration and utility rooms — other squads sometimes trip individual sub-breakers.",
  },
  {
    id: "northern-reach-research-catwalk",
    name: "Northern Reach Research 2F Catwalk & Terminals",
    region: "Northern Reach",
    sublocation: "Research Facility",
    breachType: "power-hack",
    breachBadge: "Tier 3 Hack + Terminal Boot",
    requiredHackingTier: "Tier 3 (Superior)",
    canBypassWithHack: false,
    powerVsHackVerdict:
      "No physical key exists for the 2F Research Catwalk door — a Tier 3 Superior Hacking Tool is strictly required to breach into the experimental machine wing, plus a Hardware Key from the Field Hospital to run the 4-terminal boot sequence.",
    summary:
      "Multi-building Tier 4 sequence for Lab Rat's Fragile Equilibrium: recover the buried Metal Container northeast of base, hack the 2F Research catwalk door, fetch the Hardware Key from Field Hospital, then boot Terminals 1–4 in order.",
    requiredGear: ["Superior Hacking Tool"],
    requiredKeys: [],
    linkedTasks: ["Fragile Equilibrium"],
    poiMatch: "Research Facility",
    fallbackCoords: { x: 6938, y: 5114 },
    steps: [
      {
        id: "nr-res-cache",
        order: 1,
        title: "Retrieve Buried Metal Container (NE Shelter)",
        detail:
          "Head to the remote shelter northeast of Northern Reach (Grid 173 155) and collect the 3x3 Metal Container from the buried cache behind the structure.",
        poiMatch: "Northern Reach",
        regionHint: "Northern Reach",
        fallbackCoords: { x: 7350, y: 5550 },
        locationLabel: "Remote Shelter NE (Grid ~173 155)",
      },
      {
        id: "nr-res-catwalk-hack",
        order: 2,
        title: "Hack 2F Research Catwalk Door (Superior Tool)",
        detail:
          "Climb to the 2nd floor of Northern Reach Research Facility and locate the locked door on the enclosed catwalk bridging the two wings. Breach it with a Superior Hacking Tool and insert the Metal Container into the machine.",
        poiMatch: "Research Facility",
        regionHint: "Northern Reach",
        fallbackCoords: { x: 6938, y: 5114 },
        locationLabel: "Research Facility 2F Catwalk",
        itemRef: "Superior Hacking Tool",
      },
      {
        id: "nr-res-hospital-key",
        order: 3,
        title: "Retrieve Hardware Key from Field Hospital",
        detail:
          "Locate the lead scientist's whereabouts at Northern Reach Field Hospital to obtain the Hardware Key needed to unlock the experimental control terminal.",
        poiMatch: "Field Hospital",
        regionHint: "Northern Reach",
        fallbackCoords: { x: 7143, y: 5096 },
        locationLabel: "Northern Reach Field Hospital",
      },
      {
        id: "nr-res-terminals",
        order: 4,
        title: "Execute Terminal Boot Sequence 1 -> 2 -> 3 -> 4",
        detail:
          "Return to the Research Facility control room, insert the Hardware Key, initiate the boot-up sequence across Terminals 1 through 4, activate the machine, and extract the BR-417 Analysis Data Drive.",
        poiMatch: "Research Facility",
        regionHint: "Northern Reach",
        fallbackCoords: { x: 6938, y: 5114 },
        locationLabel: "Research Control Room",
      },
    ],
  },
  {
    id: "northern-reach-hq-armory",
    name: "Northern Reach HQ Server Room, Armory & Radio Tower",
    region: "Northern Reach",
    sublocation: "Headquarters",
    breachType: "code-or-hack",
    breachBadge: "Intel Codes or Hack",
    requiredHackingTier: "Tier 2 (Advanced)",
    canBypassWithHack: true,
    powerVsHackVerdict:
      "You CAN enter HQ Offices & Server Room without a Hacking Tool by reading the written PIN notes inside HQ (3545 downstairs / 8907 repair report upstairs for Server Room; 9091 for Armory storage). Bringing an Advanced or Superior Hacking Tool lets you crack the keypads directly, and the Radio Tower terminal includes an interactive hack step.",
    summary:
      "Northern Reach HQ and Armory compound locks tied to Gunny's At Doom's Gate. Combine downstairs/upstairs code clues or electronic hacking to clear the HQ Server Room, Commander's Office, Armory, and Radio Tower.",
    requiredGear: ["Advanced Hacking Tool", "Superior Hacking Tool"],
    requiredKeys: [],
    linkedTasks: ["At Doom's Gate"],
    poiMatch: "Headquarters",
    fallbackCoords: { x: 6922, y: 5252 },
    steps: [
      {
        id: "nr-hq-lower-code",
        order: 1,
        title: "Check 1F HQ Office & Upstairs Repair Report",
        detail:
          "Inside Northern Reach HQ bottom office check the note (3545) to access upstairs, then inspect the repair report upstairs for the Server Room keypad code (8907) — or crack the pad with a Hacking Tool.",
        poiMatch: "Headquarters",
        regionHint: "Northern Reach",
        fallbackCoords: { x: 6922, y: 5252 },
        locationLabel: "Northern Reach HQ (1F & 2F)",
      },
      {
        id: "nr-hq-armory",
        order: 2,
        title: "Breach Armory Storage Keypad",
        detail:
          "The Northern Reach Armory keypad accepts the local storage code (9091) or direct decryption with a Hacking Tool.",
        poiMatch: "Armory",
        regionHint: "Northern Reach",
        fallbackCoords: { x: 7050, y: 5230 },
        locationLabel: "Northern Reach Armory",
      },
      {
        id: "nr-hq-radio",
        order: 3,
        title: "Hack Northern Reach Radio Tower",
        detail:
          "Clear rooftop/tower guards and interact with the Radio Tower terminal during At Doom's Gate after gathering Supply Yard & Accommodations intel.",
        poiMatch: "Headquarters",
        regionHint: "Northern Reach",
        fallbackCoords: { x: 6961, y: 5337 },
        locationLabel: "Northern Reach Radio Tower / Helipad",
      },
    ],
    proTip:
      "Watch the unmarked building between Research Facility and HQ (around Grid 169 151–152): Counter IED/Jammer Units spawn on the central table there — essential for Tier 3 Superior Hacking Tool disassembly.",
  },
  {
    id: "lakevale-sanctuary-2f-lab",
    name: "Lakevale Sanctuary 2F North Wing & Basement Lab",
    region: "Lakevale Sanctuary",
    sublocation: "Main Building",
    breachType: "hack-door",
    breachBadge: "Tier 3 Hack + Shortcut",
    requiredHackingTier: "Tier 3 (Superior)",
    canBypassWithHack: false,
    powerVsHackVerdict:
      "Several inner Asylum lab and basement doors cannot be opened from the main ground-floor corridor. You must use a Tier 3 Superior Hacking Tool on the 2F North Wing restricted keypad, loop through upper roof/stair paths down into the basement labs, and unbar/kick the interior shortcut doors from inside.",
    summary:
      "Multi-level psychiatric asylum infiltration route in Tier 4 Lakevale Sanctuary. Combines a Tier 3 Superior Hacking Tool breach on 2F North Wing, rooftop/interior drops into the morgue/labs, and Commander's Office access.",
    requiredGear: ["Superior Hacking Tool"],
    requiredKeys: ["Lakevale Sanctuary Commander's Office Key"],
    linkedTasks: [],
    poiMatch: "Main Building",
    fallbackCoords: { x: 8386, y: 4249 },
    steps: [
      {
        id: "ls-step-substation",
        order: 1,
        title: "Scout Electrical Substation & Conference Room",
        detail:
          "Check the Electrical Substation west of the Asylum for electrical spawns and check the 2F Conference Room central table inside the Main Building (prime spawn for Portable SATCOM Terminal -> OCXO).",
        poiMatch: "Electrical Substation",
        regionHint: "Lakevale Sanctuary",
        fallbackCoords: { x: 8283, y: 4160 },
        locationLabel: "Lakevale Electrical Substation",
        itemRef: "Portable SATCOM Terminal",
      },
      {
        id: "ls-step-2f-hack",
        order: 2,
        title: "Hack 2F North Wing Restricted Keypad",
        detail:
          "Move to the 2nd floor North Wing inside Lakevale Sanctuary Main Building and use a Tier 3 Superior Hacking Tool on the restricted electronic keypad.",
        poiMatch: "Main Building",
        regionHint: "Lakevale Sanctuary",
        fallbackCoords: { x: 8386, y: 4249 },
        locationLabel: "Main Building 2F North Wing",
        itemRef: "Superior Hacking Tool",
      },
      {
        id: "ls-step-basement-shortcut",
        order: 3,
        title: "Loop Down to Basement Labs & Unlock Shortcut",
        detail:
          "Traverse the upper wing / roof passage down into the basement laboratory & examination network. Unlock or kick open the stuck corridor doors from the inside to create a clean exfil shortcut.",
        poiMatch: "Main Building",
        regionHint: "Lakevale Sanctuary",
        fallbackCoords: { x: 8392, y: 4242 },
        locationLabel: "Asylum Basement Labs & Morgue",
      },
    ],
    proTip:
      "Both Main Building 2F Conference Room and the LAF-Occupied Villa nearby are top spawns for Portable SATCOM Terminals needed for the Superior Hacking Tool.",
  },
  {
    id: "fort-narith-hq-armory-atc",
    name: "Fort Narith HQ Server Room, Underground Armory & ATC",
    region: "Fort Narith",
    sublocation: "Headquarters [HQ]",
    breachType: "keycard-or-hack",
    breachBadge: "Code / Keycard / Hack",
    requiredHackingTier: "Tier 2 (Advanced)",
    canBypassWithHack: true,
    powerVsHackVerdict:
      "All Fort Narith keypad & keycard doors have two paths: either locate the matching physical Keycards / written LAF Codebook notes inside HQ offices & guardhouses, OR bypass them directly with an Advanced (Tier 2) or Superior (Tier 3) Hacking Tool.",
    summary:
      "Fort Narith's military inner perimeter uses digital keypads and keycard readers across HQ Server Room, Operations Room, Underground Armory, and the Air Traffic Control Tower.",
    requiredGear: ["Advanced Hacking Tool", "Superior Hacking Tool"],
    requiredKeys: [
      "Fort Narith Operations Room Key Card",
      "Fort Narith HQ Reception Storage Key Card",
    ],
    linkedTasks: ["Unarmed and Dangerous", "Weapon of Choice"],
    poiMatch: "Headquarters [HQ]",
    fallbackCoords: { x: 4304, y: 2939 },
    steps: [
      {
        id: "fn-step-hq-desk",
        order: 1,
        title: "Check HQ Command Desks & Server Rooms",
        detail:
          "Search Fort Narith HQ command desks for code intel / LAF Codebook notes, or bring Fort Narith Operations Room & Reception Storage Key Cards — otherwise hack the keypads directly with Tier 2/3 Hacking Tool.",
        poiMatch: "Headquarters [HQ]",
        regionHint: "Fort Narith",
        fallbackCoords: { x: 4304, y: 2939 },
        locationLabel: "Fort Narith HQ",
        itemRef: "Fort Narith Operations Room Key Card",
      },
      {
        id: "fn-step-armory",
        order: 2,
        title: "Check Underground Armory Utility & Keypad",
        detail:
          "Head to the Underground Armory; verify nearby utility/maintenance breakers if a panel reads unpowered, then enter the intel code or decrypt with your Hacking Tool.",
        poiMatch: "Underground Armory",
        regionHint: "Fort Narith",
        fallbackCoords: { x: 4141, y: 3038 },
        locationLabel: "Underground Armory",
      },
      {
        id: "fn-step-atc",
        order: 3,
        title: "Breach Air Control Tower (ATC) Upper Doors",
        detail:
          "Clear the airfield tower stairs and use your code/key or Hacking Tool on upper ATC security rooms (also a prime Baget-53-31 Onboard Computer spawn).",
        poiMatch: "Air Control Tower",
        regionHint: "Fort Narith",
        fallbackCoords: { x: 4217, y: 2888 },
        locationLabel: "Fort Narith Air Control Tower",
        itemRef: "Baget-53-31 Onboard Computer",
      },
    ],
  },
  {
    id: "tiger-bay-mall-unlra",
    name: "Tiger Bay Central Armory, Mall & UNLRA HQ",
    region: "Tiger Bay",
    sublocation: "Tiger Bay Mall",
    breachType: "keycard-or-hack",
    breachBadge: "Keycard or Tier 2–3 Hack",
    requiredHackingTier: "Tier 2 (Advanced)",
    canBypassWithHack: true,
    powerVsHackVerdict:
      "You do NOT have to grind RNG boss/soldier drops for Tiger Bay Central Armory or UNLRA HQ Office Key Card: an Advanced (T2) or Superior (T3) Hacking Tool decrypts their Level 2/3 electronic readers directly.",
    summary:
      "High-value Tiger Bay security doors guarding Mall Armory rooms, quarantine shipping containers, and UNLRA HQ upper offices.",
    requiredGear: ["Advanced Hacking Tool", "Superior Hacking Tool"],
    requiredKeys: [
      "Tiger Bay Central Armory Card",
      "UNLRA HQ Office Key Card",
      "UNLRA Quarantine Key",
    ],
    linkedTasks: ["What Remains", "UNLRA II", "Big Entrance"],
    poiMatch: "Tiger Bay Central",
    fallbackCoords: { x: 9866, y: 2987 },
    steps: [
      {
        id: "tb-step-mall",
        order: 1,
        title: "Mall Security & Central Armory Reader",
        detail:
          "Approach the Central Armory / Mall electronic reader; swipe Tiger Bay Central Armory Card or bypass with Advanced/Superior Hacking Tool.",
        poiMatch: "Tiger Bay",
        regionHint: "Tiger Bay",
        fallbackCoords: { x: 9866, y: 2987 },
        locationLabel: "Tiger Bay Central / Mall",
        itemRef: "Tiger Bay Central Armory Card",
      },
      {
        id: "tb-step-unlra",
        order: 2,
        title: "UNLRA HQ Office Electronic Lock",
        detail:
          "Use UNLRA HQ Office Key Card or a Tier 2/3 Hacking Tool to access the UNLRA HQ office for samples and task intel.",
        poiMatch: "UNLRA Container Dorms",
        regionHint: "Tiger Bay",
        fallbackCoords: { x: 10087, y: 3319 },
        locationLabel: "Tiger Bay UNLRA Compound",
        itemRef: "UNLRA HQ Office Key Card",
      },
    ],
  },
  {
    id: "midnight-sapphire-hotel-villas",
    name: "Midnight Sapphire Hotel Supply & Villa Keypads",
    region: "Midnight Sapphire",
    sublocation: "Midnight Sapphire Hotel",
    breachType: "keycard-or-hack",
    breachBadge: "Keycard or Tier 1–2 Hack",
    requiredHackingTier: "Tier 2 (Advanced)",
    canBypassWithHack: true,
    powerVsHackVerdict:
      "Hotel Supply Closet Key Card and villa keypad doors can all be bypassed cleanly with an Advanced Hacking Tool (Tier 2) — or Basic Hacking Tool (Tier 1) on lower-level Type 1 readers — saving keyholder slots.",
    summary:
      "Updated 0.5 electronic card readers and keypad locks inside Midnight Sapphire Hotel and luxury lakeside villas.",
    requiredGear: ["Basic Hacking Tool", "Advanced Hacking Tool"],
    requiredKeys: [
      "Hotel Supply Closet Key Card",
      "Midnight Sapphire Hotel Office Key",
      "Midnight Sapphire Hotel \"Party Room\" Key",
    ],
    linkedTasks: ["Business or Pleasure", "line in the sand"],
    poiMatch: "Midnight Sapphire",
    fallbackCoords: { x: 7068, y: 6720 },
    steps: [
      {
        id: "ms-step-hotel",
        order: 1,
        title: "Hotel Supply Closet & Offices (Type 2 Reader)",
        detail:
          "Swipe Hotel Supply Closet Key Card or bypass with an Advanced Hacking Tool (Tier 2) at the resort hotel wing.",
        poiMatch: "Midnight Sapphire",
        regionHint: "Midnight Sapphire",
        fallbackCoords: { x: 7068, y: 6720 },
        locationLabel: "Midnight Sapphire Hotel",
        itemRef: "Hotel Supply Closet Key Card",
      },
      {
        id: "ms-step-villas",
        order: 2,
        title: "Lakeside Villas & Garages (Tech Loot Route)",
        detail:
          "Check Villa Anna Jana, Villa Katherine, and garages for ST1122 Storage Computers (disassemble for Server RAM Module -> Tier 2 Hacking Tool).",
        poiMatch: "Villa Anna Jana",
        regionHint: "Midnight Sapphire",
        fallbackCoords: { x: 7242, y: 6507 },
        locationLabel: "Midnight Sapphire Villas",
        itemRef: "ST1122 Storage Computer",
      },
    ],
  },
  {
    id: "tier2-code-locked-offices",
    name: "Tier 2 Code-Locked Offices & Stash Doors (Sawmill / Airfield / Ban Pa)",
    region: "Sawmill",
    sublocation: "Offices",
    breachType: "code-or-hack",
    breachBadge: "Sticky Note or Tier 1 Hack",
    requiredHackingTier: "Tier 1 (Basic)",
    canBypassWithHack: true,
    powerVsHackVerdict:
      "Every Tier 1/2 keypad door (Sawmill Lumberyard Office, Car Repair Office, Ban Suk Stash, Locked Tools rooms) spawns a nearby paper code note in-world — OR can be cracked immediately with any Basic Hacking Tool (Tier 1) or higher.",
    summary:
      "Update 0.5 converted several Tier 2 storage sheds and offices to electronic numpads tied to world code notes (Lumberyard Office Code, Car Repair Office Code, Ban Suk Code Book, Stash Code, Locked Tools Code).",
    requiredGear: ["Basic Hacking Tool"],
    requiredKeys: ["Sawmill Office Key", "Pha Lang Airfield Storage Office Key"],
    linkedTasks: ["Hazardous Treasures", "Business or Pleasure"],
    poiMatch: "Offices",
    fallbackCoords: { x: 3953, y: 4398 },
    steps: [
      {
        id: "t2-step-notes",
        order: 1,
        title: "Check Adjacent Desks for Paper Code Notes",
        detail:
          "Inspect clipboards, desks, and side shacks near the locked door for intel notes (Lumberyard Office Code, Car Repair Office Code, Ban Suk Code Book, Locked Tools Code, Stash Code).",
        poiMatch: "Offices",
        regionHint: "Sawmill",
        fallbackCoords: { x: 3953, y: 4398 },
        locationLabel: "Sawmill Offices & Nearby Desks",
      },
      {
        id: "t2-step-hack",
        order: 2,
        title: "Instant Electronic Bypass (Tier 1+ Hacking Tool)",
        detail:
          "Carry a Basic, Advanced, or Superior Hacking Tool to automatically pull PIN codes from Level 1 electronic code-locks without hunting down paper notes.",
        poiMatch: "Sawmill",
        regionHint: "Sawmill",
        fallbackCoords: { x: 3951, y: 4432 },
        locationLabel: "Any Tier 2 Electronic Keypad",
        itemRef: "Basic Hacking Tool",
      },
    ],
  },
];

export function getResolvedPuzzleDoors(): ResolvedPuzzleDoor[] {
  return RAW_PUZZLE_DOORS.map((door) => {
    const poi = findPoiCoords(door.poiMatch, door.region);
    const x = poi ? poi.x : door.fallbackCoords.x;
    const y = poi ? poi.y : door.fallbackCoords.y;

    const resolvedSteps: ResolvedPuzzleStep[] = door.steps.map((step) => {
      const stepPoi = step.poiMatch
        ? findPoiCoords(step.poiMatch, step.regionHint || door.region)
        : null;
      const sx = step.fallbackCoords?.x ?? stepPoi?.x ?? null;
      const sy = step.fallbackCoords?.y ?? stepPoi?.y ?? null;
      const finalX = stepPoi ? stepPoi.x : sx;
      const finalY = stepPoi ? stepPoi.y : sy;

      return {
        ...step,
        coords:
          finalX !== null && finalY !== null
            ? {
                x: finalX,
                y: finalY,
                grid: formatGridSquare(finalX, finalY),
              }
            : null,
      };
    });

    return {
      ...door,
      x,
      y,
      grid: formatGridSquare(x, y),
      lz: poi?.lz || "Check Map",
      steps: resolvedSteps,
    };
  });
}

export const HACKING_PROGRESSION_PHASES: HackingPhaseStep[] = [
  {
    id: "phase-power",
    phase: 1,
    title: "1. Build Utility Room Power (Generator L1–L2)",
    subtitle: "+9 to +18 Available Power for Workshop Stations",
    detail:
      "Every Electronics Workshop upgrade draws power. Build Generator Level 1 early (Steel, Mechanical Parts, Motor Oil, Dynamo) and Generator Level 2 before pushing Compute Capacity to +9.",
    upgradeIds: [
      "utility-room-generator-level-1",
      "utility-room-generator-level-2",
    ],
    itemRefs: ["Dynamo", "Motor Oil", "Mechanical Parts"],
  },
  {
    id: "phase-workshop-core",
    phase: 1,
    title: "2. Core Electronics Workshop Foundations",
    subtitle: "RF Sensors L1 · Micro Electronics L1 · Storage L1",
    detail:
      "Required for Artisan Rank 2 tasks ('Technical Foundation' & 'Open Channels'). Unlocks Basic Hacking Tool crafting.",
    upgradeIds: [
      "electronics-workshop-rf-sensors-level-1",
      "electronics-workshop-micro-electronics-level-1",
      "electronics-workshop-storage-equipment-level-1",
    ],
    itemRefs: ["Signal Generator", "Soldering Iron", "Multimeter"],
  },
  {
    id: "phase-compute-stack",
    phase: 1,
    title: "3. Compute & Engineering Stack for Tier 2 & Tier 3",
    subtitle: "Hardware L1–L3 (+6) + Software L1–L2 (+4) = +10 Compute Capacity",
    detail:
      "Artisan's 'Wider Reach' needs +3 Compute (Tier 2 Advanced), and 'Unrestricted Access' needs +9 Compute (Tier 3 Superior) plus Micro Electronics L3 & Machine Tools L2 for Artisan's prerequisite quests.",
    upgradeIds: [
      "electronics-workshop-hardware-level-1",
      "electronics-workshop-hardware-level-2",
      "electronics-workshop-hardware-level-3",
      "electronics-workshop-software-level-1",
      "electronics-workshop-software-level-2",
      "electronics-workshop-micro-electronics-level-2",
      "electronics-workshop-micro-electronics-level-3",
      "electronics-workshop-machine-tools-level-1",
      "electronics-workshop-machine-tools-level-2",
      "electronics-workshop-rf-sensors-level-2",
    ],
    itemRefs: ["Server CPU", "Military Software", "Oscilloscope", "Laser Tube"],
  },
  {
    id: "phase-artisan-t1",
    phase: 2,
    title: "4. Artisan Rank 2 Quests -> Basic Hacking Tool",
    subtitle: "Technical Foundation -> Open Channels",
    detail:
      "Complete 'Technical Foundation' (RF +1, Electronics +1, Storage +1) to unlock Basic Tracking Tag, then complete 'Open Channels' to unlock the Basic Hacking Tool recipe.",
    taskNames: ["Technical Foundation", "Open Channels"],
  },
  {
    id: "phase-artisan-t2",
    phase: 2,
    title: "5. Artisan Rank 3 Quests -> Advanced Hacking Tool",
    subtitle: "Applied Engineering -> Wider Reach (+3 Compute & $150,000)",
    detail:
      "Reach Artisan Rank 3, complete 'Applied Engineering' (RF +3, Electronics +3), then finish 'Wider Reach' (+3 Compute Capacity & $150,000 USD) to unlock Advanced Hacking Tool.",
    taskNames: ["Applied Engineering", "Wider Reach"],
  },
  {
    id: "phase-artisan-t3",
    phase: 2,
    title: "6. Artisan Rank 4 Quests -> Superior Hacking Tool",
    subtitle: "Precision Work -> Unrestricted Access (+9 Compute & $500,000)",
    detail:
      "Complete 'Precision Work' (Mechanical +3, Electronics +6), hit Artisan Rank 4, and complete 'Unrestricted Access' (+9 Compute Capacity & $500,000 USD) to unlock the endgame Superior Hacking Tool.",
    taskNames: ["Precision Work", "Unrestricted Access"],
  },
];

export const HACKING_TOOL_TIERS: HackingToolTierDef[] = [
  {
    id: "basic-hacking-tool",
    tier: 1,
    name: "Basic Hacking Tool",
    shortTag: "Tier 1 · B Hack",
    image: resolveTacticalImageUrl(
      "https://static.wikia.nocookie.net/gray-zone-warfare/images/0/03/Basic_Hacking_Tool_inspect.png/revision/latest/scale-to-width-down/268?cb=20261110194456",
      "Basic Hacking Tool"
    ),
    craftTime: "1 second",
    gridSize: "1x2",
    weight: "1kg",
    unlockTaskName: "Open Channels",
    unlockVendor: "Artisan",
    unlockVendorRank: "Rank 2",
    unlockRequirements: [
      "Sensor and RF Processing +1",
      "Electronics Capability +1",
      "Storage Capacity +1",
    ],
    opensLocks:
      "Pulls PINs from Level 1 electronic code-locks and bypasses Level 1 keycard doors (reusable, never consumed).",
    skipNote:
      "Optional if rushing Tier 2/3: you can skip crafting Basic and craft Advanced or Superior directly once unlocked.",
    components: [
      {
        materialName: "Multi-Bus Converter",
        quantity: 1,
        disassembleFrom: "UNLRA Field Terminal",
        disassembleDuration: "4 hours",
        disassembleStation: "Electronics Workshop",
        bestZones: ["Blue Lagoon", "Ban Pa"],
      },
      {
        materialName: "CPU Card",
        quantity: 1,
        disassembleFrom: "Artillery Ballistic Calculator",
        disassembleDuration: "4 hours",
        disassembleStation: "Electronics Workshop",
        bestZones: ["YBL-1 Bunker", "Sawmill"],
      },
      {
        materialName: "Spoofing ASIC Module",
        quantity: 1,
        disassembleFrom: "IMSI Catcher",
        disassembleDuration: "4 hours",
        disassembleStation: "Electronics Workshop",
        bestZones: ["Pha Lang Airfield", "Hunter's Paradise"],
      },
    ],
  },
  {
    id: "advanced-hacking-tool",
    tier: 2,
    name: "Advanced Hacking Tool",
    shortTag: "Tier 2 · A Hack",
    image: resolveTacticalImageUrl(
      "https://static.wikia.nocookie.net/gray-zone-warfare/images/a/a9/Advanced_Hacking_Tool_inspect.png/revision/latest?cb=20261026020132",
      "Advanced Hacking Tool"
    ),
    craftTime: "1 second",
    gridSize: "1x2",
    weight: "1kg",
    unlockTaskName: "Wider Reach",
    unlockVendor: "Artisan",
    unlockVendorRank: "Rank 3",
    unlockRequirements: [
      "Complete Applied Engineering",
      "Compute Capacity +3",
      "$150,000 USD to Artisan",
    ],
    opensLocks:
      "Pulls PINs from electronic code-locks and bypasses Level 2 AND Level 1 keycard doors (reusable).",
    skipNote:
      "Best mid-game workhorse: unlocks Fort Narith, Tiger Bay, and Midnight Sapphire Type 2 card doors without boss key farming.",
    components: [
      {
        materialName: "FPGA Module",
        quantity: 1,
        disassembleFrom: "Manpack Tactical Radio",
        disassembleDuration: "6 hours",
        disassembleStation: "Electronics Workshop",
        bestZones: ["Tiger Bay", "Fort Narith"],
      },
      {
        materialName: "Avionics Processor Board",
        quantity: 1,
        disassembleFrom: "Baget-53-31 Onboard Computer",
        disassembleDuration: "6 hours",
        disassembleStation: "Electronics Workshop",
        bestZones: ["Fort Narith", "Pha Lang Airfield"],
      },
      {
        materialName: "Server RAM Module",
        quantity: 1,
        disassembleFrom: "ST1122 Storage Computer",
        disassembleDuration: "6 hours",
        disassembleStation: "Electronics Workshop",
        bestZones: ["Midnight Sapphire", "Tiger Bay"],
      },
    ],
  },
  {
    id: "superior-hacking-tool",
    tier: 3,
    name: "Superior Hacking Tool",
    shortTag: "Tier 3 · S Hack",
    image: resolveTacticalImageUrl(
      "https://static.wikia.nocookie.net/gray-zone-warfare/images/5/5b/Superior_Hacking_Tool_inspect.png/revision/latest?cb=20261028195047",
      "Superior Hacking Tool"
    ),
    craftTime: "1 second",
    gridSize: "1x2",
    weight: "1kg",
    unlockTaskName: "Unrestricted Access",
    unlockVendor: "Artisan",
    unlockVendorRank: "Rank 4",
    unlockRequirements: [
      "Complete Precision Work (Mech +3, Elec +6)",
      "Compute Capacity +9",
      "$500,000 USD to Artisan",
    ],
    opensLocks:
      "Bypasses ALL Level 3, Level 2, and Level 1 electronic doors & keycards PLUS required for 'Hack Only' Tier 4 doors (RLSL-1 Telescope Building, Lakevale Sanctuary 2F, Northern Reach 2F Research Catwalk).",
    skipNote:
      "Final permanent key-bypass tool — fits in your 1x2 secure container slot and handles every hackable door on Lamang.",
    components: [
      {
        materialName: "Oven-Controlled Crystal Oscillator",
        quantity: 1,
        disassembleFrom: "Portable SATCOM Terminal",
        disassembleDuration: "8 hours",
        disassembleStation: "Electronics Workshop",
        bestZones: ["Lakevale Sanctuary", "RLSL-1 Radio Observatory"],
      },
      {
        materialName: "High-Speed Digital Processor Board",
        quantity: 1,
        disassembleFrom: "Radar Signal Processor",
        disassembleDuration: "8 hours",
        disassembleStation: "Electronics Workshop",
        bestZones: ["RLSL-1 Radio Observatory", "Northern Reach"],
      },
      {
        materialName: "Digital Synthesis Engine",
        quantity: 1,
        disassembleFrom: "Counter IED/Jammer Unit",
        disassembleDuration: "8 hours",
        disassembleStation: "Electronics Workshop",
        bestZones: ["Northern Reach", "Lakevale Sanctuary"],
      },
    ],
  },
];
