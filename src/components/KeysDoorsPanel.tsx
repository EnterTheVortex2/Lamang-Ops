import { useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  Cpu,
  KeyRound,
  Layers,
  MapPin,
  RotateCcw,
  Search,
  ShieldAlert,
  Wrench,
  Zap,
} from "lucide-react";
import { FACTIONS, type FactionId } from "../config/mapConfig";
import {
  getResolvedPuzzleDoors,
  HACKING_PROGRESSION_PHASES,
  HACKING_TOOL_TIERS,
  type PuzzleBreachType,
  type ResolvedPuzzleDoor,
} from "../data/puzzleDoorsData";
import type { GzwKeyDoorDef } from "../utils/keyBuilder";
import { ItemThumbnail } from "./ItemThumbnail";

export type KeysWorkspaceTab = "keys" | "puzzles" | "hacking";

interface KeysDoorsPanelProps {
  keysList: GzwKeyDoorDef[];
  selectedFaction: FactionId;
  ownedKeys: Record<string, boolean>;
  onToggleOwnedKey: (keyId: string) => void;
  selectedKeyId: string | null;
  onLocateKeyOnMap: (keyDef: GzwKeyDoorDef) => void;
  onSelectLinkedTask?: (taskId: string) => void;
  selectedPuzzleDoorId?: string | null;
  onLocatePuzzleDoorOnMap?: (
    door: ResolvedPuzzleDoor,
    focusStepId?: string
  ) => void;
  puzzleStepsDone?: Record<string, boolean>;
  onTogglePuzzleStep?: (stepId: string) => void;
  onResetPuzzleDoorSteps?: (stepIds: string[]) => void;
  onLocateItem?: (itemName: string) => void;
  builtUpgrades?: Record<string, boolean>;
  completedTasks?: Record<string, boolean>;
  isExpanded: boolean;
  isLoadingApi: boolean;
}

type KeyFilterMode = "all" | "owned" | "missing" | "task" | "keycards";
type PuzzleFilterMode = "all" | PuzzleBreachType;

export function KeysDoorsPanel({
  keysList,
  selectedFaction,
  ownedKeys,
  onToggleOwnedKey,
  selectedKeyId,
  onLocateKeyOnMap,
  onSelectLinkedTask,
  selectedPuzzleDoorId = null,
  onLocatePuzzleDoorOnMap,
  puzzleStepsDone = {},
  onTogglePuzzleStep,
  onResetPuzzleDoorSteps,
  onLocateItem,
  builtUpgrades = {},
  completedTasks = {},
  isExpanded,
  isLoadingApi,
}: KeysDoorsPanelProps) {
  const [activeSubTab, setActiveSubTab] = useState<KeysWorkspaceTab>("keys");
  const [selectedRegion, setSelectedRegion] = useState<string>("ALL");
  const [filterMode, setFilterMode] = useState<KeyFilterMode>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [puzzleRegion, setPuzzleRegion] = useState<string>("ALL");
  const [puzzleFilter, setPuzzleFilter] = useState<PuzzleFilterMode>("all");
  const [puzzleSearch, setPuzzleSearch] = useState("");

  const starterTown =
    selectedFaction !== "ALL" ? FACTIONS[selectedFaction].starterTown : null;

  const resolvedPuzzleDoors = useMemo(() => getResolvedPuzzleDoors(), []);

  // Map physical keys to any multi-step puzzle door that references them
  const puzzleDoorByKeyName = useMemo(() => {
    const map = new Map<string, ResolvedPuzzleDoor>();
    for (const door of resolvedPuzzleDoors) {
      for (const reqKey of door.requiredKeys) {
        map.set(reqKey.trim().toLowerCase(), door);
      }
    }
    return map;
  }, [resolvedPuzzleDoors]);

  const ownedByName = useMemo(() => {
    const map = new Map<string, boolean>();
    for (const k of keysList) {
      if (ownedKeys[k.id]) {
        map.set(k.name.trim().toLowerCase(), true);
      }
    }
    return map;
  }, [keysList, ownedKeys]);

  const regions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const k of keysList) {
      counts.set(k.region, (counts.get(k.region) || 0) + 1);
    }
    return Array.from(counts.entries())
      .map(([region, count]) => ({ region, count }))
      .sort((a, b) => {
        if (starterTown) {
          if (a.region === starterTown && b.region !== starterTown) return -1;
          if (b.region === starterTown && a.region !== starterTown) return 1;
        }
        return a.region.localeCompare(b.region);
      });
  }, [keysList, starterTown]);

  const ownedCount = useMemo(
    () => keysList.filter((k) => ownedKeys[k.id]).length,
    [keysList, ownedKeys]
  );

  const filteredKeys = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return keysList.filter((k) => {
      if (selectedRegion !== "ALL" && k.region !== selectedRegion) return false;
      const isOwned = !!ownedKeys[k.id];
      if (filterMode === "owned" && !isOwned) return false;
      if (filterMode === "missing" && isOwned) return false;
      if (filterMode === "task" && k.linkedTasks.length === 0) return false;
      if (filterMode === "keycards" && k.kind !== "Keycard") return false;

      if (!q) return true;
      return (
        k.name.toLowerCase().includes(q) ||
        k.doorTarget.toLowerCase().includes(q) ||
        k.region.toLowerCase().includes(q) ||
        (k.sublocation || "").toLowerCase().includes(q) ||
        k.usage.toLowerCase().includes(q) ||
        k.linkedTasks.some((t) => t.name.toLowerCase().includes(q))
      );
    });
  }, [keysList, selectedRegion, filterMode, ownedKeys, searchQuery]);

  const puzzleRegions = useMemo(() => {
    const set = new Set<string>();
    for (const d of resolvedPuzzleDoors) set.add(d.region);
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [resolvedPuzzleDoors]);

  const filteredPuzzles = useMemo(() => {
    const q = puzzleSearch.trim().toLowerCase();
    return resolvedPuzzleDoors.filter((d) => {
      if (puzzleRegion !== "ALL" && d.region !== puzzleRegion) return false;
      if (puzzleFilter !== "all" && d.breachType !== puzzleFilter) return false;
      if (!q) return true;
      return (
        d.name.toLowerCase().includes(q) ||
        d.region.toLowerCase().includes(q) ||
        d.sublocation.toLowerCase().includes(q) ||
        d.summary.toLowerCase().includes(q) ||
        d.powerVsHackVerdict.toLowerCase().includes(q) ||
        d.requiredGear.some((g) => g.toLowerCase().includes(q)) ||
        d.requiredKeys.some((rk) => rk.toLowerCase().includes(q)) ||
        d.linkedTasks.some((t) => t.toLowerCase().includes(q)) ||
        d.steps.some(
          (s) =>
            s.title.toLowerCase().includes(q) ||
            s.detail.toLowerCase().includes(q)
        )
      );
    });
  }, [resolvedPuzzleDoors, puzzleRegion, puzzleFilter, puzzleSearch]);

  // Live Hideout compute / power / workshop stats for Hacking Tools progression
  const workshopStats = useMemo(() => {
    const b = builtUpgrades;
    const power =
      (b["utility-room-generator-level-1"] ? 9 : 0) +
      (b["utility-room-generator-level-2"] ? 9 : 0);
    const compute =
      (b["electronics-workshop-hardware-level-1"] ? 2 : 0) +
      (b["electronics-workshop-hardware-level-2"] ? 2 : 0) +
      (b["electronics-workshop-hardware-level-3"] ? 2 : 0) +
      (b["electronics-workshop-software-level-1"] ? 2 : 0) +
      (b["electronics-workshop-software-level-2"] ? 2 : 0);
    const electronics =
      (b["electronics-workshop-micro-electronics-level-1"] ? 1 : 0) +
      (b["electronics-workshop-micro-electronics-level-2"] ? 2 : 0) +
      (b["electronics-workshop-micro-electronics-level-3"] ? 3 : 0);
    const rf =
      (b["electronics-workshop-rf-sensors-level-1"] ? 1 : 0) +
      (b["electronics-workshop-rf-sensors-level-2"] ? 2 : 0);
    const mech =
      (b["electronics-workshop-machine-tools-level-1"] ? 1 : 0) +
      (b["electronics-workshop-machine-tools-level-2"] ? 2 : 0);
    const storage =
      (b["electronics-workshop-storage-equipment-level-1"] ? 2 : 0) +
      (b["electronics-workshop-storage-equipment-level-2"] ? 2 : 0) +
      (b["electronics-workshop-storage-equipment-level-3"] ? 2 : 0);
    return { power, compute, electronics, rf, mech, storage };
  }, [builtUpgrades]);

  const completedTasksLowerSet = useMemo(() => {
    const s = new Set<string>();
    for (const [k, v] of Object.entries(completedTasks)) {
      if (v) s.add(k.trim().toLowerCase());
    }
    return s;
  }, [completedTasks]);

  const isTaskMarkedDone = (taskName: string) => {
    const norm = taskName.trim().toLowerCase();
    const slug = norm.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return (
      completedTasksLowerSet.has(norm) ||
      completedTasksLowerSet.has(slug) ||
      Array.from(completedTasksLowerSet).some((x) => x.includes(slug))
    );
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#0e131b]">
      {/* Primary Sub-Section Switcher: Keys & Keycards | Puzzle Doors | Hacking Tools Guide */}
      <div className="px-4 pt-3 pb-2.5 border-b border-white/[0.075] bg-[#0e131b] shrink-0">
        <div
          role="tablist"
          aria-label="Keys, puzzle doors, and hacking tools sections"
          className="grid grid-cols-3 gap-1 rounded-xl bg-[#0a0e14] border border-white/[0.08] p-1"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeSubTab === "keys"}
            onClick={() => setActiveSubTab("keys")}
            className={`min-h-[40px] lg:min-h-[34px] px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-medium inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap ${
              activeSubTab === "keys"
                ? "bg-[#141b26] text-[#e5a93c] ring-1 ring-white/[0.08]"
                : "text-[#94a3b8] hover:text-[#f1f5f9]"
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 shrink-0" />
            <span>Keys &amp; Cards</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeSubTab === "puzzles"}
            onClick={() => setActiveSubTab("puzzles")}
            className={`min-h-[40px] lg:min-h-[34px] px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-medium inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap ${
              activeSubTab === "puzzles"
                ? "bg-[#141b26] text-[#38bdf8] ring-1 ring-white/[0.08]"
                : "text-[#94a3b8] hover:text-[#f1f5f9]"
            }`}
          >
            <Zap className="w-3.5 h-3.5 shrink-0" />
            <span className="sm:hidden">Puzzles</span>
            <span className="hidden sm:inline">Puzzle Doors</span>
            <span className="font-mono-tabular text-[10px] text-[#7dd3fc]/80">
              {resolvedPuzzleDoors.length}
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeSubTab === "hacking"}
            onClick={() => setActiveSubTab("hacking")}
            className={`min-h-[40px] lg:min-h-[34px] px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-medium inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap ${
              activeSubTab === "hacking"
                ? "bg-[#141b26] text-[#34d399] ring-1 ring-white/[0.08]"
                : "text-[#94a3b8] hover:text-[#f1f5f9]"
            }`}
          >
            <Cpu className="w-3.5 h-3.5 shrink-0" />
            <span className="sm:hidden">Hacking</span>
            <span className="hidden sm:inline">Hacking Tools</span>
          </button>
        </div>
      </div>

      {/* TAB 1: KEYS & KEYCARDS */}
      {activeSubTab === "keys" && (
        <>
          <div className="px-4 py-3 border-b border-white/[0.075] bg-[#0e131b] space-y-2.5 shrink-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-[#7b8ca1] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search key, door, region, task..."
                  className="w-full min-h-[42px] lg:min-h-[36px] bg-[#0a0e14] border border-white/[0.08] rounded-xl pl-9 pr-3 py-1.5 text-sm lg:text-[13px] text-[#f1f5f9] placeholder:text-[#66778b] focus:outline-none focus:border-[#e5a93c] transition-colors"
                />
              </div>

              <select
                aria-label="Filter keys by region"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full min-h-[42px] lg:min-h-[36px] bg-[#0a0e14] border border-white/[0.08] rounded-xl px-3 py-1.5 text-sm lg:text-[13px] text-[#f1f5f9] focus:outline-none focus:border-[#e5a93c]"
              >
                <option value="ALL">All Regions ({keysList.length})</option>
                {regions.map((r) => (
                  <option key={r.region} value={r.region}>
                    {r.region}
                    {starterTown === r.region
                      ? ` (${selectedFaction} Starter)`
                      : ""}{" "}
                    ({r.count})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center rounded-xl bg-[#0a0e14] border border-white/[0.07] p-1 overflow-x-auto max-w-full">
                {(
                  [
                    { id: "all", label: "All" },
                    { id: "task", label: "Task Keys" },
                    { id: "keycards", label: "Keycards" },
                    { id: "owned", label: "Owned" },
                    { id: "missing", label: "Missing" },
                  ] as { id: KeyFilterMode; label: string }[]
                ).map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setFilterMode(mode.id)}
                    className={`min-h-[36px] lg:min-h-[30px] px-3 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                      filterMode === mode.id
                        ? "bg-[#141b26] text-[#e5a93c] ring-1 ring-white/[0.08]"
                        : "text-[#94a3b8] hover:text-[#f1f5f9]"
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>

              <span className="font-mono-tabular text-xs font-semibold text-[#e5a93c] shrink-0">
                {ownedCount} / {keysList.length} owned
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="text-xs text-[#9fb0c4] px-0.5">
              Showing {filteredKeys.length} of {keysList.length} keys &amp;
              keycards
            </div>

            {keysList.length === 0 ? (
              <div className="rounded-xl border border-white/[0.075] bg-[#141b26] p-8 text-center text-sm text-[#9fb0c4]">
                {isLoadingApi
                  ? "Loading keys & keycards..."
                  : "No key data cached yet. Click Sync Data in the top bar."}
              </div>
            ) : filteredKeys.length === 0 ? (
              <div className="rounded-xl border border-white/[0.075] bg-[#141b26] p-8 text-center text-sm text-[#9fb0c4]">
                No keys match your current filter.
              </div>
            ) : (
              <div
                className={`grid gap-3 ${
                  isExpanded ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
                }`}
              >
                {filteredKeys.map((keyDef) => {
                  const isOwned = !!ownedKeys[keyDef.id];
                  const isSelected = selectedKeyId === keyDef.id;
                  const linkedPuzzle = puzzleDoorByKeyName.get(
                    keyDef.name.trim().toLowerCase()
                  );

                  return (
                    <article
                      key={keyDef.id}
                      className={`rounded-xl border p-4 flex flex-col justify-between transition-colors ${
                        isSelected
                          ? "bg-[#15202e] border-[#38bdf8]/75 shadow-lg"
                          : isOwned
                            ? "bg-[#0f1a18] border-[#22473b]"
                            : "bg-[#141b26] border-white/[0.075] hover:border-white/[0.18]"
                      }`}
                    >
                      <div>
                        <div className="flex items-start gap-3">
                          <ItemThumbnail
                            src={keyDef.image}
                            alt={keyDef.name}
                            sizeClass="w-10 h-10"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="text-xs text-[#9fb0c4] truncate">
                              <span
                                className={
                                  keyDef.kind === "Keycard"
                                    ? "text-[#38bdf8] font-semibold"
                                    : "text-[#e5a93c] font-semibold"
                                }
                              >
                                {keyDef.kind}
                              </span>
                              <span className="mx-1.5 text-white/[0.22]">
                                ·
                              </span>
                              <span>{keyDef.region}</span>
                              {keyDef.sublocation && (
                                <>
                                  <span className="mx-1.5 text-white/[0.22]">
                                    ·
                                  </span>
                                  <span className="text-[#dce5f0]">
                                    {keyDef.sublocation}
                                  </span>
                                </>
                              )}
                            </div>
                            <h3 className="font-display text-[15.5px] font-semibold text-[#f8fafc] leading-snug mt-0.5">
                              {keyDef.name}
                            </h3>
                          </div>
                        </div>

                        <p className="mt-2.5 text-[13px] text-[#cbd5e1] leading-relaxed">
                          {keyDef.usage}
                        </p>

                        <div className="mt-2.5 flex flex-wrap items-center gap-x-3.5 gap-y-1 text-xs text-[#9fb0c4]">
                          <span className="font-mono-tabular text-[#38bdf8]">
                            Grid {keyDef.grid}
                          </span>
                          <span>LZ: {keyDef.lz}</span>
                          {keyDef.sellPrice && (
                            <span className="font-mono-tabular text-[#e5a93c]">
                              Sell {keyDef.sellPrice}
                            </span>
                          )}
                          {keyDef.kind === "Keycard" && (
                            <span className="text-[#34d399]">
                              Bypassable via Hacking Tool
                            </span>
                          )}
                        </div>

                        {linkedPuzzle && (
                          <div className="mt-2.5 pt-2.5 border-t border-white/[0.06] flex items-center justify-between gap-2 text-xs">
                            <span className="text-[#7dd3fc] truncate">
                              Multi-step breach: {linkedPuzzle.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setPuzzleRegion(linkedPuzzle.region);
                                setActiveSubTab("puzzles");
                              }}
                              className="inline-flex items-center gap-1 text-[#38bdf8] hover:text-white font-medium shrink-0"
                            >
                              <span>Steps</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        )}

                        {keyDef.linkedTasks.length > 0 && (
                          <div className="mt-2.5 pt-2.5 border-t border-white/[0.06] flex flex-wrap items-center gap-1.5 text-xs">
                            <span className="inline-flex items-center gap-1 text-[#9fb0c4] font-medium">
                              <KeyRound className="w-3.5 h-3.5 text-[#e5a93c] shrink-0" />
                              Tasks:
                            </span>
                            {keyDef.linkedTasks.map((t) => (
                              <button
                                key={t.id}
                                type="button"
                                onClick={() => onSelectLinkedTask?.(t.id)}
                                title={`Locate ${t.name} (${t.vendor}) on map`}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#0a0e14] border border-white/[0.08] hover:border-[#38bdf8]/60 text-[#fde68a] hover:text-[#7dd3fc] transition-colors text-left"
                              >
                                <span>{t.name}</span>
                                <span className="text-[#7f8ea1]">
                                  ({t.vendor})
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => onLocateKeyOnMap(keyDef)}
                          className={`min-h-[44px] lg:min-h-[36px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-medium transition-colors ${
                            isSelected
                              ? "bg-[#15283b] border-[#38bdf8] text-[#7dd3fc]"
                              : "bg-white/[0.035] border-white/[0.09] text-[#38bdf8] hover:border-[#38bdf8]"
                          }`}
                        >
                          <MapPin className="w-3.5 h-3.5" />
                          <span>Locate Door</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onToggleOwnedKey(keyDef.id)}
                          className={`min-h-[44px] lg:min-h-[36px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-medium transition-colors whitespace-nowrap ${
                            isOwned
                              ? "bg-[#112922] border-[#2e7359] text-[#34d399] hover:border-[#34d399]"
                              : "bg-white/[0.035] border-white/[0.09] text-[#e2e8f0] hover:border-[#e5a93c] hover:text-[#e5a93c]"
                          }`}
                        >
                          {isOwned && (
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          )}
                          {isOwned ? "In Keyholder" : "Mark Owned"}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* TAB 2: PUZZLE & MULTI-STEP DOORS */}
      {activeSubTab === "puzzles" && (
        <>
          <div className="px-4 py-3 border-b border-white/[0.075] bg-[#0e131b] space-y-2.5 shrink-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-[#7b8ca1] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={puzzleSearch}
                  onChange={(e) => setPuzzleSearch(e.target.value)}
                  placeholder="Search RLSL-1, generator, breaker, Lakevale..."
                  className="w-full min-h-[42px] lg:min-h-[36px] bg-[#0a0e14] border border-white/[0.08] rounded-xl pl-9 pr-3 py-1.5 text-sm lg:text-[13px] text-[#f1f5f9] placeholder:text-[#66778b] focus:outline-none focus:border-[#38bdf8] transition-colors"
                />
              </div>

              <select
                aria-label="Filter puzzle doors by region"
                value={puzzleRegion}
                onChange={(e) => setPuzzleRegion(e.target.value)}
                className="w-full min-h-[42px] lg:min-h-[36px] bg-[#0a0e14] border border-white/[0.08] rounded-xl px-3 py-1.5 text-sm lg:text-[13px] text-[#f1f5f9] focus:outline-none focus:border-[#38bdf8]"
              >
                <option value="ALL">
                  All Regions ({resolvedPuzzleDoors.length} Breaches)
                </option>
                {puzzleRegions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center rounded-xl bg-[#0a0e14] border border-white/[0.07] p-1 overflow-x-auto max-w-full">
                {(
                  [
                    { id: "all", label: "All" },
                    { id: "power-hack", label: "Power + Hack" },
                    { id: "hack-door", label: "Hack Doors" },
                    { id: "power-sequence", label: "Generators" },
                    { id: "keycard-or-hack", label: "Card / Hack" },
                    { id: "code-or-hack", label: "Code / Hack" },
                  ] as { id: PuzzleFilterMode; label: string }[]
                ).map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setPuzzleFilter(mode.id)}
                    className={`min-h-[36px] lg:min-h-[30px] px-2.5 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                      puzzleFilter === mode.id
                        ? "bg-[#141b26] text-[#38bdf8] ring-1 ring-white/[0.08]"
                        : "text-[#94a3b8] hover:text-[#f1f5f9]"
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setActiveSubTab("hacking")}
                className="text-xs font-medium text-[#34d399] hover:text-white inline-flex items-center gap-1 shrink-0"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>How to Craft Hacking Tools</span>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="rounded-xl border border-[#38bdf8]/25 bg-[#0f1823] px-3.5 py-3 text-xs text-[#cbd5e1] leading-relaxed">
              <span className="font-semibold text-[#7dd3fc]">
                Update 0.5 Rule of Thumb:
              </span>{" "}
              Standard Keycards &amp; written code-locks can be bypassed with a
              matching tier Hacking Tool, whereas{" "}
              <span className="text-[#fde68a] font-medium">
                &ldquo;Hack Only&rdquo; doors (RLSL-1 Telescope tunnel, Lakevale
                2F, Northern Reach 2F)
              </span>{" "}
              strictly require a{" "}
              <span className="text-[#f8fafc] font-semibold">
                Superior Hacking Tool (Tier 3)
              </span>
              . Tick steps below during a raid and click any waypoint to plot
              the route on the map.
            </div>

            {filteredPuzzles.length === 0 ? (
              <div className="rounded-xl border border-white/[0.075] bg-[#141b26] p-8 text-center text-sm text-[#9fb0c4]">
                No puzzle or multi-step doors match your filter.
              </div>
            ) : (
              <div
                className={`grid gap-3.5 ${
                  isExpanded ? "grid-cols-1 xl:grid-cols-2" : "grid-cols-1"
                }`}
              >
                {filteredPuzzles.map((door) => {
                  const isSelected = selectedPuzzleDoorId === door.id;
                  const doneCount = door.steps.filter(
                    (s) => puzzleStepsDone[s.id]
                  ).length;

                  return (
                    <article
                      key={door.id}
                      className={`rounded-xl border p-4 flex flex-col justify-between transition-colors ${
                        isSelected
                          ? "bg-[#15202e] border-[#38bdf8]/75 shadow-lg"
                          : "bg-[#141b26] border-white/[0.075] hover:border-white/[0.16]"
                      }`}
                    >
                      <div className="space-y-3">
                        {/* Top Metadata + Title */}
                        <div>
                          <div className="flex items-start justify-between gap-2 text-xs">
                            <div className="text-[#9fb0c4] flex flex-wrap items-center gap-x-1.5 gap-y-0.5 min-w-0">
                              <span
                                className={
                                  door.breachType === "power-hack" ||
                                  door.breachType === "hack-door"
                                    ? "text-[#38bdf8] font-semibold"
                                    : door.breachType === "power-sequence"
                                      ? "text-[#e5a93c] font-semibold"
                                      : "text-[#34d399] font-semibold"
                                }
                              >
                                {door.breachBadge}
                              </span>
                              <span className="text-white/[0.22]">·</span>
                              <span>{door.region}</span>
                              <span className="text-white/[0.22]">·</span>
                              <span className="font-mono-tabular text-[#7dd3fc]">
                                Grid {door.grid}
                              </span>
                            </div>

                            <span className="font-mono-tabular text-[11px] font-semibold text-[#e5a93c] shrink-0">
                              {doneCount}/{door.steps.length} steps
                            </span>
                          </div>

                          <h3 className="font-display text-[16px] font-semibold text-[#f8fafc] leading-snug mt-1">
                            {door.name}
                          </h3>
                          <p className="mt-1.5 text-[13px] text-[#cbd5e1] leading-relaxed">
                            {door.summary}
                          </p>
                        </div>

                        {/* Power vs Hack / Bypass Answer Box */}
                        <div className="rounded-xl bg-[#0a0e14] border border-white/[0.07] p-3 text-xs space-y-1">
                          <div className="flex items-center gap-1.5 font-semibold text-[#fde68a]">
                            <ShieldAlert className="w-3.5 h-3.5 text-[#e5a93c] shrink-0" />
                            <span>
                              {door.canBypassWithHack
                                ? "Power / Code Bypass: Optional with Hacking Tool"
                                : "Mandatory Requirement Verdict"}
                            </span>
                          </div>
                          <p className="text-[#cbd5e1] leading-relaxed">
                            {door.powerVsHackVerdict}
                          </p>
                        </div>

                        {/* Required Gear & Keys */}
                        {(door.requiredGear.length > 0 ||
                          door.requiredKeys.length > 0) && (
                          <div className="flex flex-wrap items-center gap-1.5 text-xs">
                            {door.requiredGear.map((gear) => (
                              <button
                                key={gear}
                                type="button"
                                onClick={() => {
                                  if (
                                    /hacking tool/i.test(gear) &&
                                    !onLocateItem
                                  ) {
                                    setActiveSubTab("hacking");
                                  } else if (/hacking tool/i.test(gear)) {
                                    setActiveSubTab("hacking");
                                  } else {
                                    onLocateItem?.(gear);
                                  }
                                }}
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#0a0e14] border border-[#38bdf8]/35 hover:border-[#38bdf8] text-[#7dd3fc] transition-colors"
                              >
                                <Cpu className="w-3 h-3 shrink-0" />
                                <span>{gear}</span>
                              </button>
                            ))}

                            {door.requiredKeys.map((rk) => {
                              const hasKey = ownedByName.has(
                                rk.trim().toLowerCase()
                              );
                              return (
                                <button
                                  key={rk}
                                  type="button"
                                  onClick={() => onLocateItem?.(rk)}
                                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#0a0e14] border transition-colors ${
                                    hasKey
                                      ? "border-[#2e7359] text-[#34d399]"
                                      : "border-white/[0.1] hover:border-[#e5a93c] text-[#fde68a]"
                                  }`}
                                >
                                  {hasKey ? (
                                    <Check className="w-3 h-3 shrink-0" />
                                  ) : (
                                    <KeyRound className="w-3 h-3 shrink-0" />
                                  )}
                                  <span>{rk}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {/* Ordered Multi-Step Checklist */}
                        <div className="space-y-2">
                          <div className="text-[11px] font-semibold uppercase tracking-wide text-[#8b98a9]">
                            Breach Sequence
                          </div>
                          {door.steps.map((step) => {
                            const isDone = !!puzzleStepsDone[step.id];
                            return (
                              <div
                                key={step.id}
                                className={`rounded-xl border p-2.5 transition-colors ${
                                  isDone
                                    ? "bg-[#0f1a18] border-[#22473b]"
                                    : "bg-[#0a0e14] border-white/[0.07]"
                                }`}
                              >
                                <div className="flex items-start gap-2.5">
                                  <button
                                    type="button"
                                    aria-label={`Toggle step ${step.order}: ${step.title}`}
                                    onClick={() =>
                                      onTogglePuzzleStep?.(step.id)
                                    }
                                    className={`mt-0.5 w-6 h-6 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                                      isDone
                                        ? "bg-[#34d399] border-[#34d399] text-[#080b10]"
                                        : "bg-[#141b26] border-white/[0.18] text-[#9fb0c4] hover:border-[#38bdf8]"
                                    }`}
                                  >
                                    {isDone ? (
                                      <Check className="w-3.5 h-3.5 stroke-[2.75]" />
                                    ) : (
                                      <span className="font-mono-tabular text-[11px] font-bold">
                                        {step.order}
                                      </span>
                                    )}
                                  </button>

                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-2 flex-wrap">
                                      <div
                                        className={`text-[13px] font-semibold leading-snug ${
                                          isDone
                                            ? "line-through text-[#8aa59a]"
                                            : "text-[#f1f5f9]"
                                        }`}
                                      >
                                        {step.title}
                                        {step.optional && (
                                          <span className="ml-1.5 text-[11px] font-normal text-[#94a3b8]">
                                            (Auto-completes if already flipped)
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    <p className="mt-1 text-xs text-[#9fb0c4] leading-relaxed">
                                      {step.detail}
                                    </p>

                                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
                                      {step.locationLabel && (
                                        <span className="text-[#dce5f0]">
                                          {step.locationLabel}
                                        </span>
                                      )}
                                      {step.coords && (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            onLocatePuzzleDoorOnMap?.(
                                              door,
                                              step.id
                                            )
                                          }
                                          className="inline-flex items-center gap-1 font-mono-tabular text-[#38bdf8] hover:text-white transition-colors"
                                        >
                                          <MapPin className="w-3 h-3 shrink-0" />
                                          <span>
                                            Pin Step (Grid {step.coords.grid})
                                          </span>
                                        </button>
                                      )}
                                      {step.itemRef && (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            /hacking tool/i.test(step.itemRef!)
                                              ? setActiveSubTab("hacking")
                                              : onLocateItem?.(step.itemRef!)
                                          }
                                          className="text-[#e5a93c] hover:text-[#fde68a] font-medium"
                                        >
                                          Inspect {step.itemRef}
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {door.proTip && (
                          <p className="text-xs text-[#9fb0c4] italic">
                            Tip: {door.proTip}
                          </p>
                        )}

                        {door.linkedTasks.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 text-xs">
                            <span className="text-[#9fb0c4] font-medium">
                              Tasks:
                            </span>
                            {door.linkedTasks.map((tName) => (
                              <button
                                key={tName}
                                type="button"
                                onClick={() => onSelectLinkedTask?.(tName)}
                                className="px-2 py-0.5 rounded-md bg-[#0a0e14] border border-white/[0.08] hover:border-[#38bdf8]/60 text-[#fde68a] hover:text-[#7dd3fc] transition-colors"
                              >
                                {tName}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => onLocatePuzzleDoorOnMap?.(door)}
                          className={`min-h-[44px] lg:min-h-[36px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-medium transition-colors ${
                            isSelected
                              ? "bg-[#15283b] border-[#38bdf8] text-[#7dd3fc]"
                              : "bg-white/[0.035] border-white/[0.09] text-[#38bdf8] hover:border-[#38bdf8]"
                          }`}
                        >
                          <MapPin className="w-3.5 h-3.5" />
                          <span>Plot Route on Map</span>
                        </button>

                        {doneCount > 0 && (
                          <button
                            type="button"
                            onClick={() =>
                              onResetPuzzleDoorSteps?.(
                                door.steps.map((s) => s.id)
                              )
                            }
                            className="min-h-[44px] lg:min-h-[36px] inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/[0.09] bg-white/[0.025] text-xs font-medium text-[#94a3b8] hover:text-white transition-colors"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Reset Steps</span>
                          </button>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* TAB 3: HACKING TOOLS PROGRESSION & CRAFTING GUIDE */}
      {activeSubTab === "hacking" && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Live Hideout Readiness Summary */}
          <div className="rounded-xl border border-white/[0.08] bg-[#141b26] p-4 space-y-3">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div>
                <div className="text-xs font-semibold text-[#34d399]">
                  Hideout Workshop Readiness (Synced to Active Operator)
                </div>
                <h3 className="font-display text-base font-semibold text-[#f8fafc] mt-0.5">
                  How to Unlock &amp; Construct Hacking Tools
                </h3>
              </div>
              <span className="font-mono-tabular text-xs text-[#9fb0c4]">
                Artisan Ranks 2–4 + Electronics Workshop
              </span>
            </div>

            <div
              className={`grid gap-2 ${
                isExpanded ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2"
              }`}
            >
              <div className="rounded-lg bg-[#0a0e14] border border-white/[0.06] px-3 py-2">
                <div className="text-[11px] text-[#8b98a9]">Utility Power</div>
                <div className="font-mono-tabular text-sm font-semibold text-[#e5a93c] mt-0.5">
                  +{workshopStats.power} / 18
                </div>
              </div>
              <div className="rounded-lg bg-[#0a0e14] border border-white/[0.06] px-3 py-2">
                <div className="text-[11px] text-[#8b98a9]">
                  Compute Capacity
                </div>
                <div className="font-mono-tabular text-sm font-semibold text-[#38bdf8] mt-0.5">
                  +{workshopStats.compute} / 9 req
                </div>
              </div>
              <div className="rounded-lg bg-[#0a0e14] border border-white/[0.06] px-3 py-2">
                <div className="text-[11px] text-[#8b98a9]">Electronics Cap</div>
                <div className="font-mono-tabular text-sm font-semibold text-[#34d399] mt-0.5">
                  +{workshopStats.electronics} / 6 req
                </div>
              </div>
              <div className="rounded-lg bg-[#0a0e14] border border-white/[0.06] px-3 py-2">
                <div className="text-[11px] text-[#8b98a9]">
                  RF &amp; Storage
                </div>
                <div className="font-mono-tabular text-sm font-semibold text-[#f1f5f9] mt-0.5">
                  RF +{workshopStats.rf} · Sto +{workshopStats.storage}
                </div>
              </div>
            </div>

            <p className="text-xs text-[#cbd5e1] leading-relaxed">
              Hacking tools are <strong className="text-white">permanent, reusable 1×2 devices</strong> crafted in{" "}
              <span className="text-[#7dd3fc]">1 second</span> inside your Hideout Electronics Workshop once unlocked through Artisan&apos;s upgrade quest chain. You do{" "}
              <strong className="text-[#34d399]">not</strong> need a Basic Hacking Tool to craft Advanced or Superior — each higher tier automatically unlocks all lower security levels.
            </p>
          </div>

          {/* Step-by-Step Roadmap (Hideout Build + Artisan Quest Chain) */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#9fb0c4] px-0.5">
              <Layers className="w-3.5 h-3.5 text-[#e5a93c]" />
              <span>Step-by-Step Progression Path (Hideout &amp; Artisan)</span>
            </div>

            <div
              className={`grid gap-2.5 ${
                isExpanded ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
              }`}
            >
              {HACKING_PROGRESSION_PHASES.map((step) => {
                const upgradesTotal = step.upgradeIds?.length || 0;
                const upgradesDone = step.upgradeIds
                  ? step.upgradeIds.filter((id) => builtUpgrades[id]).length
                  : 0;
                const tasksTotal = step.taskNames?.length || 0;
                const tasksDone = step.taskNames
                  ? step.taskNames.filter((t) => isTaskMarkedDone(t)).length
                  : 0;
                const allComplete =
                  (upgradesTotal > 0 && upgradesDone === upgradesTotal) ||
                  (tasksTotal > 0 && tasksDone === tasksTotal);

                return (
                  <div
                    key={step.id}
                    className={`rounded-xl border p-3.5 space-y-2 ${
                      allComplete
                        ? "bg-[#0f1a18] border-[#22473b]"
                        : "bg-[#141b26] border-white/[0.075]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-[11px] font-medium text-[#38bdf8]">
                          {step.phase === 1
                            ? "Hideout Construction"
                            : "Artisan Unlock Quests"}
                          <span className="mx-1.5 text-white/[0.22]">·</span>
                          <span className="text-[#9fb0c4]">
                            {step.subtitle}
                          </span>
                        </div>
                        <h4 className="font-display text-sm font-semibold text-[#f8fafc] mt-0.5">
                          {step.title}
                        </h4>
                      </div>

                      {upgradesTotal > 0 && (
                        <span
                          className={`font-mono-tabular text-[11px] font-semibold shrink-0 ${
                            allComplete ? "text-[#34d399]" : "text-[#e5a93c]"
                          }`}
                        >
                          {upgradesDone}/{upgradesTotal} built
                        </span>
                      )}
                      {tasksTotal > 0 && (
                        <span
                          className={`font-mono-tabular text-[11px] font-semibold shrink-0 ${
                            allComplete ? "text-[#34d399]" : "text-[#e5a93c]"
                          }`}
                        >
                          {tasksDone}/{tasksTotal} done
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#cbd5e1] leading-relaxed">
                      {step.detail}
                    </p>

                    {step.itemRefs && step.itemRefs.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[11px] text-[#8b98a9]">
                          Key parts:
                        </span>
                        {step.itemRefs.map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => onLocateItem?.(item)}
                            className="px-2 py-0.5 rounded-md bg-[#0a0e14] border border-white/[0.08] hover:border-[#38bdf8] text-[11px] text-[#7dd3fc] transition-colors"
                          >
                            Locate {item}
                          </button>
                        ))}
                      </div>
                    )}

                    {step.taskNames && step.taskNames.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {step.taskNames.map((tName) => {
                          const done = isTaskMarkedDone(tName);
                          return (
                            <button
                              key={tName}
                              type="button"
                              onClick={() => onSelectLinkedTask?.(tName)}
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#0a0e14] border text-[11px] transition-colors ${
                                done
                                  ? "border-[#2e7359] text-[#34d399]"
                                  : "border-white/[0.08] hover:border-[#e5a93c] text-[#fde68a]"
                              }`}
                            >
                              {done && <Check className="w-3 h-3 shrink-0" />}
                              <span>{tName}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* All 3 Hacking Tool Tiers & Disassembly Feedstock */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#9fb0c4] px-0.5">
              <Cpu className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>All 3 Hacking Tool Tiers &amp; Crafting Recipes</span>
            </div>

            {HACKING_TOOL_TIERS.map((tool) => {
              const unlockDone = isTaskMarkedDone(tool.unlockTaskName);
              return (
                <article
                  key={tool.id}
                  className="rounded-xl border border-white/[0.085] bg-[#141b26] p-4 space-y-3.5"
                >
                  <div className="flex items-start gap-3">
                    <ItemThumbnail
                      src={tool.image}
                      alt={tool.name}
                      sizeClass="w-12 h-12"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="text-xs text-[#9fb0c4]">
                          <span
                            className={
                              tool.tier === 3
                                ? "text-[#34d399] font-semibold"
                                : tool.tier === 2
                                  ? "text-[#38bdf8] font-semibold"
                                  : "text-[#e5a93c] font-semibold"
                            }
                          >
                            {tool.shortTag}
                          </span>
                          <span className="mx-1.5 text-white/[0.22]">·</span>
                          <span className="font-mono-tabular">
                            Craft {tool.craftTime}
                          </span>
                          <span className="mx-1.5 text-white/[0.22]">·</span>
                          <span className="font-mono-tabular">
                            {tool.gridSize} · {tool.weight}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            onSelectLinkedTask?.(tool.unlockTaskName)
                          }
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#0a0e14] border text-[11px] font-medium transition-colors ${
                            unlockDone
                              ? "border-[#2e7359] text-[#34d399]"
                              : "border-white/[0.09] hover:border-[#e5a93c] text-[#fde68a]"
                          }`}
                        >
                          {unlockDone && <Check className="w-3 h-3 shrink-0" />}
                          <span>
                            {tool.unlockVendor} {tool.unlockVendorRank}:{" "}
                            {tool.unlockTaskName}
                          </span>
                        </button>
                      </div>

                      <h4 className="font-display text-[16px] font-semibold text-[#f8fafc] mt-0.5">
                        {tool.name}
                      </h4>
                      <p className="mt-1 text-xs text-[#cbd5e1] leading-relaxed">
                        {tool.opensLocks}
                      </p>
                    </div>
                  </div>

                  {/* Quest & Workshop Prerequisites */}
                  <div className="text-xs text-[#9fb0c4] flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-[#dce5f0] font-medium">
                      Unlock Reqs:
                    </span>
                    {tool.unlockRequirements.map((req, idx) => (
                      <span key={req} className="inline-flex items-center">
                        {idx > 0 && (
                          <span className="mx-1.5 text-white/[0.22]">·</span>
                        )}
                        <span>{req}</span>
                      </span>
                    ))}
                  </div>

                  {/* 3 Required Crafting Components + Disassembly Source Items */}
                  <div className="grid grid-cols-1 gap-2">
                    {tool.components.map((comp) => (
                      <div
                        key={comp.materialName}
                        className="rounded-lg bg-[#0a0e14] border border-white/[0.07] px-3 py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <div className="text-[13px] font-semibold text-[#f1f5f9]">
                            <span className="font-mono-tabular text-[#e5a93c] mr-1.5">
                              {comp.quantity}×
                            </span>
                            {comp.materialName}
                          </div>
                          <div className="text-xs text-[#9fb0c4] mt-0.5">
                            Disassemble{" "}
                            <span className="text-[#7dd3fc] font-medium">
                              {comp.disassembleFrom}
                            </span>
                            <span className="mx-1.5 text-white/[0.22]">·</span>
                            <span className="font-mono-tabular">
                              {comp.disassembleDuration}
                            </span>
                            <span className="mx-1.5 text-white/[0.22]">·</span>
                            <span>{comp.bestZones.join(" / ")}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => onLocateItem?.(comp.disassembleFrom)}
                            className="min-h-[36px] lg:min-h-[30px] inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#141b26] border border-white/[0.09] hover:border-[#38bdf8] text-xs font-medium text-[#38bdf8] transition-colors whitespace-nowrap"
                          >
                            <MapPin className="w-3 h-3 shrink-0" />
                            <span>Locate {comp.disassembleFrom}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="text-[11.5px] text-[#8b98a9]">
                    {tool.skipNote}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
