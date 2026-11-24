import {
  SLOT_LABELS,
  WEAPON_PARTS_BY_ID,
  WEAPONS_CATALOG,
  type ModSlotType,
  type WeaponClass,
  type WeaponDef,
  type WeaponPartDef,
} from "../data/weaponLoadoutData";

export const WEAPON_CLASSES: WeaponClass[] = [
  "Assault Rifle",
  "SMG",
  "Rifle",
  "Shotgun",
  "Pistol",
];

/**
 * Node-path key inside a weapon's attachment tree.
 * Root weapon slot: "upper_receiver"
 * Nested child slot: "upper_receiver>handguard>mount>tactical_device"
 */
export type SlotPathKey = string;

export interface SavedWeaponLoadout {
  id: string;
  name: string;
  weaponId: string;
  equippedByPath: Record<SlotPathKey, string>;
  updatedAt: number;
}

export interface ActiveSlotNode {
  pathKey: SlotPathKey;
  slotType: ModSlotType;
  label: string;
  depth: number;
  parentName: string;
  candidatePartIds: string[];
  equippedPart: WeaponPartDef | null;
}

export interface AccessoryMountPath {
  part: WeaponPartDef;
  direct: boolean;
  /** Ordered assignments required from root -> target slot path */
  steps: { pathKey: SlotPathKey; slotType: ModSlotType; partId: string; partName: string }[];
  missingSteps: { pathKey: SlotPathKey; slotType: ModSlotType; partId: string; partName: string }[];
}

export interface AggregatedLoadoutStats {
  totalCost: number;
  missingPriceCount: number;
  totalWeightKg: number;
  ergonomics: number;
  recoilControlDelta: number;
  weaponHandlingDelta: number;
  accuracyDelta: number;
  loudnessReduction: number;
  muzzleEfficiency: number;
  reloadSpeedDelta: number;
  hasLightOrLaser: boolean;
  hasOptic: boolean;
  hasSuppressor: boolean;
  partCount: number;
  vendorBreakdown: { vendor: string; rank: number; count: number; cost: number }[];
}

const SLOT_ORDER: ModSlotType[] = [
  "upper_receiver",
  "slide",
  "barrel",
  "gas_block",
  "handguard",
  "mount",
  "tactical_device",
  "sight",
  "rear_sight",
  "front_sight",
  "foregrip",
  "muzzle_device",
  "suppressor",
  "stock_adapter",
  "buffer_tube",
  "stock",
  "pistol_grip",
  "charging_handle",
  "magazine",
];

export function sortSlotEntries(
  slots: Partial<Record<ModSlotType, string[]>>
): [ModSlotType, string[]][] {
  return (Object.entries(slots) as [ModSlotType, string[]][])
    .filter(([, ids]) => Array.isArray(ids) && ids.length > 0)
    .sort(([a], [b]) => {
      const ia = SLOT_ORDER.indexOf(a);
      const ib = SLOT_ORDER.indexOf(b);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    });
}

/**
 * Flattens all currently reachable attachment slots in breadth/parent-first order
 * based on what parts are currently equipped in `equippedByPath`.
 */
export function buildActiveSlotTree(
  weapon: WeaponDef,
  equippedByPath: Record<SlotPathKey, string>
): ActiveSlotNode[] {
  const nodes: ActiveSlotNode[] = [];

  const visit = (
    slots: Partial<Record<ModSlotType, string[]>>,
    prefix: string,
    depth: number,
    parentName: string,
    visitedIds: Set<string>
  ) => {
    for (const [slotType, candidateIds] of sortSlotEntries(slots)) {
      const pathKey = prefix ? `${prefix}>${slotType}` : slotType;
      const equippedId = equippedByPath[pathKey];
      const equippedPart =
        equippedId && candidateIds.includes(equippedId)
          ? WEAPON_PARTS_BY_ID[equippedId] || null
          : null;

      nodes.push({
        pathKey,
        slotType,
        label: SLOT_LABELS[slotType] || slotType.replace(/_/g, " "),
        depth,
        parentName,
        candidatePartIds: candidateIds,
        equippedPart,
      });

      if (equippedPart && !visitedIds.has(equippedPart.id)) {
        const nextVisited = new Set(visitedIds);
        nextVisited.add(equippedPart.id);
        visit(equippedPart.slots, pathKey, depth + 1, equippedPart.name, nextVisited);
      }
    }
  };

  visit(weapon.slots, "", 0, weapon.name, new Set([weapon.id]));
  return nodes;
}

/**
 * Strips any orphaned child path entries whenever a parent slot is replaced or cleared.
 */
export function pruneInvalidEquippedPaths(
  weapon: WeaponDef,
  draft: Record<SlotPathKey, string>
): Record<SlotPathKey, string> {
  const clean: Record<SlotPathKey, string> = {};

  const walk = (
    slots: Partial<Record<ModSlotType, string[]>>,
    prefix: string,
    visitedIds: Set<string>
  ) => {
    for (const [slotType, candidateIds] of sortSlotEntries(slots)) {
      const pathKey = prefix ? `${prefix}>${slotType}` : slotType;
      const chosenId = draft[pathKey];
      if (!chosenId || !candidateIds.includes(chosenId)) continue;
      const part = WEAPON_PARTS_BY_ID[chosenId];
      if (!part || visitedIds.has(part.id)) continue;

      clean[pathKey] = chosenId;
      const nextVisited = new Set(visitedIds);
      nextVisited.add(part.id);
      walk(part.slots, pathKey, nextVisited);
    }
  };

  walk(weapon.slots, "", new Set([weapon.id]));
  return clean;
}

/**
 * Builds a clean functional starting configuration for a weapon by auto-selecting
 * essential structural parts (Upper Receiver / Slide / Barrel / Gas Block / Handguard / Stock / Pistol Grip / Mag)
 * when a slot is required to make the weapon complete.
 */
export function buildRecommendedBaseLoadout(
  weapon: WeaponDef
): Record<SlotPathKey, string> {
  const equipped: Record<SlotPathKey, string> = {};
  const coreOrder: ModSlotType[] = [
    "upper_receiver",
    "slide",
    "barrel",
    "gas_block",
    "handguard",
    "stock_adapter",
    "buffer_tube",
    "stock",
    "pistol_grip",
    "charging_handle",
    "magazine",
    "muzzle_device",
  ];

  const pickBest = (ids: string[]): WeaponPartDef | null => {
    const candidates = ids
      .map((id) => WEAPON_PARTS_BY_ID[id])
      .filter((p): p is WeaponPartDef => !!p);
    if (candidates.length === 0) return null;
    // Prefer vendor-purchasable standard parts with more downstream mod slots
    return [...candidates].sort((a, b) => {
      const slotGainA = Object.keys(a.slots).length;
      const slotGainB = Object.keys(b.slots).length;
      const buyA = a.soldBy ? 1 : 0;
      const buyB = b.soldBy ? 1 : 0;
      return slotGainB - slotGainA || buyB - buyA || (a.buyPrice ?? 9999) - (b.buyPrice ?? 9999);
    })[0];
  };

  const populate = (
    slots: Partial<Record<ModSlotType, string[]>>,
    prefix: string,
    depth: number,
    visitedIds: Set<string>
  ) => {
    if (depth > 3) return;
    for (const slotType of coreOrder) {
      const candidateIds = slots[slotType];
      if (!candidateIds || candidateIds.length === 0) continue;
      const best = pickBest(candidateIds);
      if (!best || visitedIds.has(best.id)) continue;
      const pathKey = prefix ? `${prefix}>${slotType}` : slotType;
      equipped[pathKey] = best.id;
      const nextVisited = new Set(visitedIds);
      nextVisited.add(best.id);
      populate(best.slots, pathKey, depth + 1, nextVisited);
    }
  };

  populate(weapon.slots, "", 0, new Set([weapon.id]));
  return equipped;
}

/**
 * Discovers ALL accessories of a target slot type (e.g. "tactical_device" for Lights/Lasers,
 * "sight" for Optics/Scopes, "suppressor", "foregrip", "stock") reachable on `weapon`
 * within <= 4 attachment hops, prioritizing paths that reuse already-equipped parts!
 */
export function findAccessoryMountPaths(
  weapon: WeaponDef,
  targetSlot: ModSlotType,
  equippedByPath: Record<SlotPathKey, string>
): AccessoryMountPath[] {
  interface QueueNode {
    slots: Partial<Record<ModSlotType, string[]>>;
    prefix: string;
    steps: { pathKey: SlotPathKey; slotType: ModSlotType; partId: string; partName: string }[];
    missingCost: number;
    visitedIds: Set<string>;
  }

  const bestPathByTargetId = new Map<string, AccessoryMountPath>();
  const queue: QueueNode[] = [
    {
      slots: weapon.slots,
      prefix: "",
      steps: [],
      missingCost: 0,
      visitedIds: new Set([weapon.id]),
    },
  ];

  // Limit BFS work cleanly for instant UI response
  let expandedNodes = 0;
  while (queue.length > 0 && expandedNodes < 450) {
    // Always explore currently-equipped paths first so direct matches win
    queue.sort((a, b) => a.missingCost - b.missingCost || a.steps.length - b.steps.length);
    const cur = queue.shift()!;
    expandedNodes += 1;

    for (const [slotType, candidateIds] of sortSlotEntries(cur.slots)) {
      const pathKey = cur.prefix ? `${cur.prefix}>${slotType}` : slotType;
      const alreadyEquippedId = equippedByPath[pathKey];

      if (slotType === targetSlot) {
        for (const candId of candidateIds) {
          const targetPart = WEAPON_PARTS_BY_ID[candId];
          if (!targetPart) continue;
          const finalStep = {
            pathKey,
            slotType,
            partId: candId,
            partName: targetPart.name,
          };
          const fullSteps = [...cur.steps, finalStep];
          const missingSteps = fullSteps.filter(
            (st, idx) => idx < fullSteps.length - 1 && equippedByPath[st.pathKey] !== st.partId
          );

          const existing = bestPathByTargetId.get(candId);
          const candidateEntry: AccessoryMountPath = {
            part: targetPart,
            direct: missingSteps.length === 0,
            steps: fullSteps,
            missingSteps,
          };

          if (
            !existing ||
            missingSteps.length < existing.missingSteps.length ||
            (missingSteps.length === existing.missingSteps.length &&
              fullSteps.length < existing.steps.length)
          ) {
            bestPathByTargetId.set(candId, candidateEntry);
          }
        }
      }

      if (cur.steps.length >= 3) continue;

      // Explore the currently equipped part on this path first + up to 8 compatible intermediate adapters
      const prioritizedIds = [
        ...(alreadyEquippedId && candidateIds.includes(alreadyEquippedId)
          ? [alreadyEquippedId]
          : []),
        ...candidateIds
          .filter((id) => id !== alreadyEquippedId)
          .sort((a, b) => {
            const pa = WEAPON_PARTS_BY_ID[a];
            const pb = WEAPON_PARTS_BY_ID[b];
            const countA = pa ? Object.keys(pa.slots).length : 0;
            const countB = pb ? Object.keys(pb.slots).length : 0;
            return countB - countA;
          })
          .slice(0, 10),
      ];

      for (const nextId of prioritizedIds) {
        if (cur.visitedIds.has(nextId)) continue;
        const part = WEAPON_PARTS_BY_ID[nextId];
        if (!part || Object.keys(part.slots).length === 0) continue;

        const isMissing = alreadyEquippedId !== nextId;
        const nextVisited = new Set(cur.visitedIds);
        nextVisited.add(nextId);

        queue.push({
          slots: part.slots,
          prefix: pathKey,
          steps: [
            ...cur.steps,
            {
              pathKey,
              slotType,
              partId: nextId,
              partName: part.name,
            },
          ],
          missingCost: cur.missingCost + (isMissing ? 1 : 0),
          visitedIds: nextVisited,
        });
      }
    }
  }

  return Array.from(bestPathByTargetId.values()).sort(
    (a, b) =>
      (a.direct ? 0 : 1) - (b.direct ? 0 : 1) ||
      a.missingSteps.length - b.missingSteps.length ||
      a.part.name.localeCompare(b.part.name)
  );
}

export function computeLoadoutStats(
  weapon: WeaponDef,
  equippedByPath: Record<SlotPathKey, string>
): AggregatedLoadoutStats {
  const activeNodes = buildActiveSlotTree(weapon, equippedByPath);
  const equippedParts = activeNodes
    .map((n) => n.equippedPart)
    .filter((p): p is WeaponPartDef => !!p);

  let totalCost = weapon.buyPrice ?? 0;
  let missingPriceCount = weapon.buyPrice ? 0 : 1;
  let totalWeightKg = weapon.weightKg || 0;
  let ergonomics = weapon.ergonomics || 0;
  let recoilControlDelta = 0;
  let weaponHandlingDelta = 0;
  let accuracyDelta = 0;
  let loudnessReduction = 0;
  let muzzleEfficiency = 0;
  let reloadSpeedDelta = 0;

  let hasLightOrLaser = false;
  let hasOptic = false;
  let hasSuppressor = false;

  const vendorMap = new Map<string, { vendor: string; rank: number; count: number; cost: number }>();
  const recordVendor = (soldBy: string | null, price: number | null) => {
    if (!soldBy) return;
    const m = soldBy.match(/^([A-Za-z\s]+?)\s*R\.?\s*(\d+)/i);
    const vendor = m ? m[1].trim() : soldBy.trim();
    const rank = m ? Number(m[2]) : 1;
    const prev = vendorMap.get(vendor);
    vendorMap.set(vendor, {
      vendor,
      rank: prev ? Math.max(prev.rank, rank) : rank,
      count: (prev?.count || 0) + 1,
      cost: (prev?.cost || 0) + (price || 0),
    });
  };

  recordVendor(weapon.soldBy, weapon.buyPrice);

  for (const part of equippedParts) {
    if (part.buyPrice) totalCost += part.buyPrice;
    else missingPriceCount += 1;

    totalWeightKg += part.weightKg || 0;
    ergonomics += part.ergonomics || 0;
    recoilControlDelta += part.recoilControl || 0;
    weaponHandlingDelta += part.weaponHandling || 0;
    accuracyDelta += part.accuracyMod || 0;
    loudnessReduction += part.loudnessReduction || 0;
    muzzleEfficiency += part.muzzleEfficiency || 0;
    reloadSpeedDelta += part.reloadSpeed || 0;

    if (part.slotType === "tactical_device") hasLightOrLaser = true;
    if (part.slotType === "sight") hasOptic = true;
    if (part.slotType === "suppressor") hasSuppressor = true;

    recordVendor(part.soldBy, part.buyPrice);
  }

  return {
    totalCost,
    missingPriceCount,
    totalWeightKg: Math.round(totalWeightKg * 1000) / 1000,
    ergonomics: Math.round(ergonomics),
    recoilControlDelta: Math.round(recoilControlDelta),
    weaponHandlingDelta: Math.round(weaponHandlingDelta),
    accuracyDelta: Math.round(accuracyDelta * 10) / 10,
    loudnessReduction: Math.round(loudnessReduction),
    muzzleEfficiency: Math.round(muzzleEfficiency),
    reloadSpeedDelta: Math.round(reloadSpeedDelta),
    hasLightOrLaser,
    hasOptic,
    hasSuppressor,
    partCount: equippedParts.length,
    vendorBreakdown: Array.from(vendorMap.values()).sort((a, b) =>
      a.vendor.localeCompare(b.vendor)
    ),
  };
}

export function getWeaponById(weaponId: string): WeaponDef | undefined {
  return WEAPONS_CATALOG.find((w) => w.id === weaponId);
}
