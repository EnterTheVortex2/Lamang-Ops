import { useMemo, useState } from "react";
import {
  Check,
  ClipboardList,
  Clock,
  Cpu,
  Crosshair,
  FlaskConical,
  HardDrive,
  MapPin,
  Minus,
  Plus,
  Search,
  Wrench,
} from "lucide-react";
import {
  HIDEOUT_ROOMS,
  type DisassemblyCategory,
  type DisassemblyOutcomeDetail,
  type DisassemblyOutcomeKind,
  type DisassemblyRecipeDef,
  type HideoutUpgradeDef,
  type RoomId,
} from "../data/hideoutData";
import {
  searchLiveApi,
  type ApiCachePayload,
  type NormalizedApiRecord,
} from "../services/gzwApi";
import {
  getDisassemblySpawnSummary,
  type CatalogMaterial,
} from "../utils/catalogBuilder";
import { ItemThumbnail } from "./ItemThumbnail";

export type PlannerViewId = "planner" | "manifest" | "disassembly" | "api-search";

interface HideoutTrackerPanelProps {
  activeView: PlannerViewId;
  onViewChange: (view: PlannerViewId) => void;
  allUpgrades: HideoutUpgradeDef[];
  selectedUpgradeId: string | null;
  onSelectUpgrade: (upg: HideoutUpgradeDef | null) => void;
  builtUpgrades: Record<string, boolean>;
  onToggleBuilt: (upgradeId: string) => void;
  plannedUpgrades: Record<string, boolean>;
  onTogglePlanned: (upgradeId: string) => void;
  stashCounts: Record<string, number>;
  onSetStashCount: (key: string, value: number) => void;
  tickedMapMaterials: Record<string, boolean>;
  onToggleMapMaterial: (matKey: string, visible: boolean) => void;
  selectedMaterialKey: string | null;
  onInspectMaterial: (mat: CatalogMaterial) => void;
  onInspectDisassemblyItem: (recipe: DisassemblyRecipeDef) => void;
  onInspectApiRecord: (rec: NormalizedApiRecord) => void;
  onArmPinDrop: (matId: string) => void;
  catalog: CatalogMaterial[];
  disassemblyRecipes: DisassemblyRecipeDef[];
  apiCache: ApiCachePayload | null;
  isExpanded: boolean;
}

function normMatKey(name: string): string {
  return name.trim().toLowerCase();
}

export function HideoutTrackerPanel({
  activeView,
  onViewChange,
  allUpgrades,
  selectedUpgradeId,
  onSelectUpgrade,
  builtUpgrades,
  onToggleBuilt,
  plannedUpgrades,
  onTogglePlanned,
  stashCounts,
  onSetStashCount,
  tickedMapMaterials,
  onToggleMapMaterial,
  selectedMaterialKey,
  onInspectMaterial,
  onInspectDisassemblyItem,
  onInspectApiRecord,
  onArmPinDrop,
  catalog,
  disassemblyRecipes,
  apiCache,
  isExpanded,
}: HideoutTrackerPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [roomFilter, setRoomFilter] = useState<"all" | RoomId>("all");
  const [tierFilter, setTierFilter] = useState<0 | 1 | 2 | 3>(0);
  const [statusFilter, setStatusFilter] = useState<"all" | "planned" | "unbuilt" | "built">("all");
  const [manifestScope, setManifestScope] = useState<"planned" | "unbuilt">("planned");
  const [disassemblyDurationFilter, setDisassemblyDurationFilter] = useState<
    "all" | "4 hours" | "6 hours" | "8 hours"
  >("all");
  const [disassemblyCategoryFilter, setDisassemblyCategoryFilter] = useState<
    "all" | DisassemblyCategory
  >("all");

  const [apiQuery, setApiQuery] = useState("");
  const [apiDatasetFilter, setApiDatasetFilter] = useState("ALL");
  const [liveSearchResults, setLiveSearchResults] = useState<
    Record<string, Record<string, unknown>[]> | null
  >(null);
  const [isLiveSearching, setIsLiveSearching] = useState(false);

  const catalogByNorm = useMemo(() => {
    const map = new Map<string, CatalogMaterial>();
    for (const mat of catalog) {
      map.set(normMatKey(mat.name), mat);
    }
    return map;
  }, [catalog]);

  const builtCount = useMemo(
    () => allUpgrades.filter((u) => builtUpgrades[u.id]).length,
    [allUpgrades, builtUpgrades]
  );

  const plannedCount = useMemo(
    () => allUpgrades.filter((u) => plannedUpgrades[u.id] && !builtUpgrades[u.id]).length,
    [allUpgrades, plannedUpgrades, builtUpgrades]
  );

  // Filtered upgrade cards
  const filteredUpgrades = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allUpgrades.filter((u) => {
      if (roomFilter !== "all" && u.room !== roomFilter) return false;
      if (tierFilter !== 0 && u.level !== tierFilter) return false;
      const isBuilt = !!builtUpgrades[u.id];
      const isPlanned = !!plannedUpgrades[u.id];
      if (statusFilter === "built" && !isBuilt) return false;
      if (statusFilter === "unbuilt" && isBuilt) return false;
      if (statusFilter === "planned" && (!isPlanned || isBuilt)) return false;

      if (!q) return true;
      return (
        u.module.toLowerCase().includes(q) ||
        u.name.toLowerCase().includes(q) ||
        u.benefit.toLowerCase().includes(q) ||
        HIDEOUT_ROOMS[u.room].name.toLowerCase().includes(q) ||
        u.requirements.some((r) => r.name.toLowerCase().includes(q))
      );
    });
  }, [allUpgrades, roomFilter, tierFilter, statusFilter, builtUpgrades, plannedUpgrades, searchQuery]);

  const selectedUpgrade = useMemo(
    () => allUpgrades.find((u) => u.id === selectedUpgradeId) || null,
    [allUpgrades, selectedUpgradeId]
  );

  // Supply Manifest aggregation across Planned (or All Unbuilt) upgrades
  const supplyManifest = useMemo(() => {
    const targetUpgrades = allUpgrades.filter((u) => {
      if (builtUpgrades[u.id]) return false;
      return manifestScope === "planned" ? !!plannedUpgrades[u.id] : true;
    });

    const totals = new Map<string, { name: string; total: number; mat: CatalogMaterial | null }>();
    for (const upg of targetUpgrades) {
      for (const req of upg.requirements) {
        const key = normMatKey(req.name);
        const existing = totals.get(key);
        if (existing) {
          existing.total += req.quantity;
        } else {
          totals.set(key, {
            name: req.name,
            total: req.quantity,
            mat: catalogByNorm.get(key) || null,
          });
        }
      }
    }

    const rows = Array.from(totals.entries()).map(([key, item]) => {
      const stash = Math.max(0, stashCounts[key] || 0);
      const toFind = Math.max(0, item.total - stash);
      return {
        key,
        name: item.name,
        total: item.total,
        stash,
        toFind,
        mat: item.mat,
      };
    });

    // Dollars first if present, then by shortfall descending, then name
    rows.sort((a, b) => {
      if (a.key === "dollars") return -1;
      if (b.key === "dollars") return 1;
      if (b.toFind !== a.toFind) return b.toFind - a.toFind;
      return a.name.localeCompare(b.name);
    });

    return { targetUpgrades, rows };
  }, [allUpgrades, builtUpgrades, plannedUpgrades, manifestScope, stashCounts, catalogByNorm]);

  // All API Records for API Search tab
  const allApiRecords = useMemo(() => {
    const list: NormalizedApiRecord[] = [];
    if (!apiCache?.datasets) return list;
    Object.values(apiCache.datasets).forEach((arr) => {
      if (Array.isArray(arr)) list.push(...arr);
    });
    return list;
  }, [apiCache]);

  const apiDatasets = useMemo(
    () => Object.keys(apiCache?.datasets || {}),
    [apiCache]
  );

  const filteredApiRecords = useMemo(() => {
    const q = apiQuery.trim().toLowerCase();
    return allApiRecords.filter((rec) => {
      if (apiDatasetFilter !== "ALL" && rec.dataset !== apiDatasetFilter) {
        return false;
      }
      if (!q) return true;
      return (
        rec.name.toLowerCase().includes(q) ||
        rec.description.toLowerCase().includes(q) ||
        rec.category.toLowerCase().includes(q) ||
        rec.dataset.toLowerCase().includes(q)
      );
    });
  }, [allApiRecords, apiDatasetFilter, apiQuery]);

  const handleRunLiveApiSearch = async () => {
    if (!apiQuery.trim()) return;
    setIsLiveSearching(true);
    try {
      const res = await searchLiveApi(apiQuery.trim());
      setLiveSearchResults(res);
    } finally {
      setIsLiveSearching(false);
    }
  };

  const handleMaterialClick = (name: string) => {
    const mat = catalogByNorm.get(normMatKey(name));
    if (mat) {
      onInspectMaterial(mat);
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-[#0e131b]">
      {/* Hideout Controls & Navigation */}
      <div className="px-4 py-3.5 border-b border-white/[0.075] bg-[#0e131b] space-y-3 shrink-0">
        {/* Search Input + Quick Supply List Action */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative flex-1 min-w-0">
            <Search className="w-4 h-4 text-[#7b8ca1] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeView === "disassembly"
                  ? "Search disassembly item or yielded material..."
                  : "Search upgrade or material..."
              }
              className="w-full min-h-[44px] lg:min-h-[38px] bg-[#0a0e14] border border-white/[0.08] rounded-xl pl-9 pr-3 py-2 text-sm lg:text-[13px] text-[#f1f5f9] placeholder:text-[#66778b] focus:outline-none focus:border-[#e5a93c] transition-colors"
            />
          </div>

          <button
            type="button"
            onClick={() => onViewChange("manifest")}
            className={`min-h-[44px] lg:min-h-[38px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
              activeView === "manifest"
                ? "bg-[#f0b94d] text-[#080b10]"
                : "bg-[#e5a93c] hover:bg-[#f0b94d] text-[#080b10]"
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>Supply List ({supplyManifest.rows.filter((r) => r.toFind > 0).length})</span>
          </button>
        </div>

        {/* Sub-view Switcher Tabs (2x2 on narrow mobile, 4-col on sm+) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 rounded-xl bg-[#0a0e14] border border-white/[0.07] p-1">
          {(
            [
              { id: "planner", label: "Upgrades" },
              { id: "manifest", label: `Needed (${plannedCount})` },
              { id: "disassembly", label: "Disassembly" },
              { id: "api-search", label: "Item Index" },
            ] as { id: PlannerViewId; label: string }[]
          ).map((tab) => {
            const active = activeView === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onViewChange(tab.id)}
                className={`min-h-[42px] lg:min-h-[34px] px-2 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap text-center ${
                  active
                    ? "bg-[#141b26] text-[#f8fafc] shadow-sm ring-1 ring-white/[0.08]"
                    : "text-[#94a3b8] hover:text-[#e2e8f0]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Filters for Upgrade Planner */}
        {activeView === "planner" && (
          <div className="flex items-center gap-2 flex-wrap">
            <select
              aria-label="Filter hideout by room"
              value={roomFilter}
              onChange={(e) => setRoomFilter(e.target.value as "all" | RoomId)}
              className="w-full sm:w-auto min-h-[44px] lg:min-h-[36px] bg-[#0a0e14] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-[#f1f5f9] focus:outline-none focus:border-[#e5a93c]"
            >
              <option value="all">All Rooms ({allUpgrades.length})</option>
              <option value="utility">
                Utility ({allUpgrades.filter((u) => u.room === "utility").length})
              </option>
              <option value="electronics">
                Electronics ({allUpgrades.filter((u) => u.room === "electronics").length})
              </option>
              <option value="laboratory">
                Laboratory ({allUpgrades.filter((u) => u.room === "laboratory").length})
              </option>
            </select>

            <div className="flex items-center rounded-xl bg-[#0a0e14] border border-white/[0.07] p-1">
              {([0, 1, 2, 3] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setTierFilter(lvl)}
                  className={`min-h-[38px] lg:min-h-[30px] px-2.5 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                    tierFilter === lvl
                      ? "bg-[#141b26] text-[#e5a93c] ring-1 ring-white/[0.08]"
                      : "text-[#94a3b8] hover:text-[#e2e8f0]"
                  }`}
                >
                  {lvl === 0 ? "All" : `Lv ${lvl}`}
                </button>
              ))}
            </div>

            <div className="flex items-center rounded-xl bg-[#0a0e14] border border-white/[0.07] p-1 overflow-x-auto max-w-full">
              {(
                [
                  { id: "all", label: "All" },
                  { id: "planned", label: "Planned" },
                  { id: "unbuilt", label: "Remaining" },
                  { id: "built", label: "Built" },
                ] as const
              ).map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setStatusFilter(st.id)}
                  className={`min-h-[38px] lg:min-h-[30px] px-2.5 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                    statusFilter === st.id
                      ? "bg-[#141b26] text-[#38bdf8] ring-1 ring-white/[0.08]"
                      : "text-[#94a3b8] hover:text-[#e2e8f0]"
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {/* ================================================================
            VIEW 1: UPGRADE PLANNER (ALL 36 UPGRADES, TIERS 1-3)
           ================================================================ */}
        {activeView === "planner" && (
          <>
            {/* Selected Upgrade Material Spotlight */}
            {selectedUpgrade && (
              <div className="gzw-drawer-enter rounded-xl bg-[#141b26] border border-[#38bdf8]/45 p-4 space-y-3 shadow-lg">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-medium text-[#38bdf8]">
                      {HIDEOUT_ROOMS[selectedUpgrade.room].name} · Level {selectedUpgrade.level}
                    </div>
                    <h2 className="font-display text-base font-semibold text-[#f8fafc] mt-0.5">
                      {selectedUpgrade.module}
                    </h2>
                    <p className="text-[13px] text-[#b4c2d4] mt-1 leading-relaxed">
                      {selectedUpgrade.benefit} · Select any material to locate spawns.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectUpgrade(null)}
                    className="text-xs font-medium text-[#cbd5e1] hover:text-white px-2.5 py-1 rounded-lg border border-white/[0.1] hover:border-white/[0.22] transition-colors shrink-0"
                  >
                    Close
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedUpgrade.requirements.map((req) => {
                    const key = normMatKey(req.name);
                    const mat = catalogByNorm.get(key) || null;
                    const stash = stashCounts[key] || 0;
                    const short = Math.max(0, req.quantity - stash);
                    const isPinned = mat ? !!tickedMapMaterials[mat.key] : false;

                    return (
                      <div
                        key={`${selectedUpgrade.id}-${req.name}`}
                        className="flex items-center justify-between gap-2 rounded-lg bg-[#0a0e14] border border-white/[0.06] px-3 py-2"
                      >
                        <button
                          type="button"
                          disabled={!mat}
                          onClick={() => handleMaterialClick(req.name)}
                          className={`flex items-center gap-2.5 min-w-0 text-left ${
                            mat ? "cursor-pointer hover:text-[#38bdf8]" : "cursor-default"
                          }`}
                        >
                          {mat && (
                            <ItemThumbnail
                              src={mat.image}
                              alt={mat.name}
                              sizeClass="w-8 h-8"
                            />
                          )}
                          <div className="min-w-0">
                            <div className="text-[13px] font-medium text-[#f8fafc] truncate">
                              {req.name}
                            </div>
                            <div className="text-xs text-[#9fb0c4]">
                              <span className="font-mono-tabular">
                                {stash.toLocaleString()} / {req.quantity.toLocaleString()}
                              </span>
                              {short > 0 ? (
                                <span className="text-[#e5a93c] ml-1.5">
                                  · Missing {short.toLocaleString()}
                                </span>
                              ) : (
                                <span className="text-[#34d399] ml-1.5">· Ready</span>
                              )}
                            </div>
                          </div>
                        </button>

                        {mat && (
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleMaterialClick(req.name)}
                              title="Locate spawns on map"
                              className="p-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-[#38bdf8] hover:border-[#38bdf8] transition-colors"
                            >
                              <MapPin className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onToggleMapMaterial(mat.key, !isPinned)}
                              title="Pin spawns on map"
                              className={`px-2 py-1 rounded-lg text-xs font-medium border transition-colors ${
                                isPinned
                                  ? "bg-[#e5a93c]/18 border-[#e5a93c]/55 text-[#fde68a]"
                                  : "bg-white/[0.03] border-white/[0.08] text-[#cbd5e1] hover:text-white"
                              }`}
                            >
                              {isPinned ? "Pinned" : "Pin"}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 36 Upgrade Cards Grid */}
            <div
              className={`grid gap-3 ${
                isExpanded ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
              }`}
            >
              {filteredUpgrades.map((upg) => {
                const isBuilt = !!builtUpgrades[upg.id];
                const isPlanned = !!plannedUpgrades[upg.id];
                const isSelected = selectedUpgradeId === upg.id;

                return (
                  <div
                    key={upg.id}
                    onClick={() => onSelectUpgrade(isSelected ? null : upg)}
                    className={`rounded-xl border p-4 flex flex-col justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-[#15202e] border-[#38bdf8]/75 shadow-lg"
                        : isBuilt
                          ? "bg-[#0f1a18] border-[#22473b] hover:border-[#2f6452]"
                          : isPlanned
                            ? "bg-[#161b25] border-[#e5a93c]/40 hover:border-[#e5a93c]/65"
                            : "bg-[#141b26] border-white/[0.075] hover:border-white/[0.18]"
                    }`}
                  >
                    <div>
                      {/* Card Header: Clean Natural Metadata */}
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="font-medium text-[#a9b8ca]">
                          {HIDEOUT_ROOMS[upg.room].name}
                        </span>
                        <span className="font-mono-tabular font-medium text-[#9fb0c4]">
                          Level {upg.level}
                        </span>
                      </div>

                      {/* Module Title & Benefit */}
                      <div className="mt-1.5 flex items-baseline justify-between gap-2">
                        <h3 className="font-display text-[15.5px] font-semibold text-[#f8fafc] leading-snug">
                          {upg.module}
                        </h3>
                        {isBuilt && (
                          <span className="text-xs font-medium text-[#34d399]">
                            Built
                          </span>
                        )}
                      </div>
                      <p className="text-[13px] text-[#b4c2d4] mt-1 leading-relaxed">
                        {upg.benefit}
                      </p>

                      {/* Clean Material Requirements */}
                      <div
                        className="mt-3 flex flex-wrap gap-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {upg.requirements.map((req) => {
                          const key = normMatKey(req.name);
                          const mat = catalogByNorm.get(key) || null;
                          const isDollars = key === "dollars";
                          const stash = stashCounts[key] || 0;
                          const short = Math.max(0, req.quantity - stash);
                          const isMatSelected =
                            mat && selectedMaterialKey === mat.key;

                          return (
                            <button
                              key={`${upg.id}-${req.name}`}
                              type="button"
                              disabled={isDollars || !mat}
                              onClick={() => !isDollars && handleMaterialClick(req.name)}
                              title={
                                isDollars
                                  ? `${req.quantity.toLocaleString()} Dollars`
                                  : "Click to show spawn locations on map"
                              }
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[12.5px] transition-colors ${
                                isMatSelected
                                  ? "bg-[#15283b] border-[#38bdf8] text-[#e0f2fe]"
                                  : isDollars
                                    ? "bg-white/[0.025] border-white/[0.05] text-[#a9b8ca] cursor-default"
                                    : "bg-[#0a0e14]/90 border-white/[0.065] text-[#e2e8f0] hover:border-[#38bdf8] hover:text-[#7dd3fc] cursor-pointer"
                              }`}
                            >
                              <span className="font-medium">{req.name}</span>
                              <span className="font-mono-tabular text-[#9fb0c4]">
                                ×{req.quantity.toLocaleString()}
                              </span>
                              {!isBuilt && !isDollars && (
                                <span
                                  className={`font-mono-tabular text-[11.5px] ${
                                    short > 0 ? "text-[#e5a93c]" : "text-[#34d399]"
                                  }`}
                                >
                                  {short > 0 ? `(${short} needed)` : "✓"}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div
                      className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <label className="min-h-[44px] lg:min-h-[32px] inline-flex items-center gap-2 text-xs text-[#cbd5e1] hover:text-white cursor-pointer select-none pr-2">
                        <input
                          type="checkbox"
                          checked={isPlanned}
                          onChange={() => onTogglePlanned(upg.id)}
                          className="accent-[#e5a93c] w-4 h-4 rounded cursor-pointer"
                        />
                        <span>Add to plan</span>
                      </label>

                      <button
                        type="button"
                        onClick={() => onToggleBuilt(upg.id)}
                        className={`min-h-[44px] lg:min-h-[34px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-medium transition-colors whitespace-nowrap ${
                          isBuilt
                            ? "bg-[#112922] border-[#2e7359] text-[#34d399] hover:border-[#34d399]"
                            : "bg-white/[0.035] border-white/[0.1] text-[#e2e8f0] hover:border-[#e5a93c] hover:text-[#e5a93c]"
                        }`}
                      >
                        {isBuilt && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                        {isBuilt ? "Built" : "Mark Built"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredUpgrades.length === 0 && (
              <div className="rounded-xl border border-white/[0.075] bg-[#141b26] p-8 text-center text-[13px] text-[#9fb0c4]">
                No Hideout upgrades matched your current filter.
              </div>
            )}
          </>
        )}

        {/* ================================================================
            VIEW 2: SUPPLY MANIFEST (YOUR NEXT SUPPLY RUN)
           ================================================================ */}
        {activeView === "manifest" && (
          <div className="space-y-3.5">
            <div className="rounded-xl bg-[#141b26] border border-white/[0.075] p-4 space-y-2.5">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="text-xs font-medium text-[#e5a93c]">
                    Supply List
                  </div>
                  <h2 className="font-display text-base font-semibold text-[#f8fafc] mt-0.5">
                    Materials needed for your Hideout
                  </h2>
                  <p className="text-[13px] text-[#a9b8ca] mt-1">
                    Totals across{" "}
                    {manifestScope === "planned"
                      ? `${supplyManifest.targetUpgrades.length} planned upgrades`
                      : `${supplyManifest.targetUpgrades.length} remaining upgrades`}
                    . Select any material to locate spawns.
                  </p>
                </div>

                <div className="flex items-center rounded-lg bg-[#0a0e14] border border-white/[0.07] p-0.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setManifestScope("planned")}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                      manifestScope === "planned"
                        ? "bg-[#e5a93c] text-[#080b10]"
                        : "text-[#9fb0c4] hover:text-white"
                    }`}
                  >
                    Planned ({plannedCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setManifestScope("unbuilt")}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                      manifestScope === "unbuilt"
                        ? "bg-[#e5a93c] text-[#080b10]"
                        : "text-[#9fb0c4] hover:text-white"
                    }`}
                  >
                    All Remaining ({allUpgrades.length - builtCount})
                  </button>
                </div>
              </div>
            </div>

            {supplyManifest.rows.length === 0 ? (
              <div className="rounded-xl border border-white/[0.075] bg-[#141b26] p-8 text-center text-[13px] text-[#9fb0c4]">
                {manifestScope === "planned"
                  ? "No planned upgrades selected yet. Tick 'Add to plan' on any station card, or switch to 'All Remaining'."
                  : "All 36 Hideout upgrades are built."}
              </div>
            ) : (
              <div className="space-y-3">
                {supplyManifest.rows.map((row) => {
                  const isDollars = row.key === "dollars";
                  const isMapTicked = row.mat ? !!tickedMapMaterials[row.mat.key] : false;
                  const isSelected = row.mat && selectedMaterialKey === row.mat.key;
                  const done = row.toFind === 0;

                  return (
                    <div
                      key={row.key}
                      onClick={() => row.mat && onInspectMaterial(row.mat)}
                      className={`rounded-xl border p-4 transition-colors ${
                        row.mat ? "cursor-pointer" : ""
                      } ${
                        isSelected
                          ? "bg-[#15202e] border-[#38bdf8]"
                          : done
                            ? "bg-[#0f1a18] border-[#22473b]"
                            : "bg-[#141b26] border-white/[0.075] hover:border-white/[0.18]"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          {row.mat ? (
                            <ItemThumbnail src={row.mat.image} alt={row.name} />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-[#080c12] border border-white/[0.08] flex items-center justify-center font-mono-tabular text-xs font-bold text-[#e5a93c] shrink-0">
                              $
                            </div>
                          )}

                          <div className="min-w-0">
                            <div className="text-[14.5px] font-medium text-[#f8fafc] truncate">
                              {row.name}
                            </div>
                            <div className="text-xs text-[#9fb0c4] truncate mt-0.5">
                              {row.mat
                                ? row.mat.spawnNotes[0] || "Lamang Loot Container"
                                : "Vendor / Raid Currency"}
                            </div>
                          </div>
                        </div>

                        {/* Stash Input + To Find */}
                        <div
                          className="flex items-center justify-between sm:justify-end gap-3 shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center gap-1 bg-[#0a0e14] border border-white/[0.08] rounded-xl px-2.5 py-1">
                            <span className="text-xs text-[#9fb0c4] mr-1">Stash</span>
                            {!isDollars && (
                              <button
                                type="button"
                                aria-label={`Decrease ${row.name} stash count`}
                                onClick={() =>
                                  onSetStashCount(row.key, Math.max(0, row.stash - 1))
                                }
                                className="w-9 h-9 lg:w-7 lg:h-7 flex items-center justify-center rounded-lg text-[#9fb0c4] hover:text-[#e5a93c] hover:bg-white/[0.05]"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                            )}
                            <input
                              type="number"
                              aria-label={`${row.name} stash count`}
                              min={0}
                              step={isDollars ? 1000 : 1}
                              value={row.stash}
                              onChange={(e) =>
                                onSetStashCount(
                                  row.key,
                                  Math.max(0, Number(e.target.value) || 0)
                                )
                              }
                              className={`${
                                isDollars ? "w-24" : "w-12"
                              } min-h-[36px] bg-transparent text-center font-mono-tabular text-sm text-[#f8fafc] focus:outline-none`}
                            />
                            {!isDollars && (
                              <button
                                type="button"
                                aria-label={`Increase ${row.name} stash count`}
                                onClick={() => onSetStashCount(row.key, row.stash + 1)}
                                className="w-9 h-9 lg:w-7 lg:h-7 flex items-center justify-center rounded-lg text-[#9fb0c4] hover:text-[#e5a93c] hover:bg-white/[0.05]"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            )}
                          </div>

                          <div className="text-right min-w-[82px]">
                            <div
                              className={`font-mono-tabular text-[15px] font-semibold ${
                                done ? "text-[#34d399]" : "text-[#f8fafc]"
                              }`}
                            >
                              {row.toFind.toLocaleString()}
                            </div>
                            <div className="font-mono-tabular text-[11px] text-[#8fa1b6]">
                              needed / {row.total.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>

                      {row.mat && (
                        <div
                          className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between gap-2 text-xs"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <label className="inline-flex items-center gap-2 cursor-pointer text-[#cbd5e1] hover:text-[#38bdf8]">
                            <input
                              type="checkbox"
                              checked={isMapTicked}
                              onChange={(e) =>
                                onToggleMapMaterial(row.mat!.key, e.target.checked)
                              }
                              className="accent-[#38bdf8] w-4 h-4 cursor-pointer"
                            />
                            <span>Show on Map</span>
                          </label>

                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => onInspectMaterial(row.mat!)}
                              className="inline-flex items-center gap-1.5 text-[#38bdf8] hover:text-[#7dd3fc] font-medium"
                            >
                              <MapPin className="w-3.5 h-3.5" />
                              Locate Spawns
                            </button>
                            <button
                              type="button"
                              onClick={() => onArmPinDrop(row.mat!.id)}
                              className="inline-flex items-center gap-1.5 text-[#a9b8ca] hover:text-[#e5a93c]"
                            >
                              <Crosshair className="w-3.5 h-3.5" />
                              Pin
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ================================================================
            VIEW 3: DISASSEMBLY ITEMS & YIELDED MATERIALS
           ================================================================ */}
        {activeView === "disassembly" && (() => {
          const filteredDisassembly = disassemblyRecipes.filter((r) => {
            if (
              disassemblyDurationFilter !== "all" &&
              r.duration !== disassemblyDurationFilter
            ) {
              return false;
            }
            if (
              disassemblyCategoryFilter !== "all" &&
              r.category !== disassemblyCategoryFilter
            ) {
              return false;
            }
            const q = searchQuery.trim().toLowerCase();
            if (!q) return true;
            const spawnSummary = getDisassemblySpawnSummary(r.name);
            return (
              r.name.toLowerCase().includes(q) ||
              r.category.toLowerCase().includes(q) ||
              r.outcomes.some((o) => o.toLowerCase().includes(q)) ||
              spawnSummary.pois.some((p) => p.toLowerCase().includes(q))
            );
          });

          const renderOutcomeIcon = (kind: DisassemblyOutcomeKind) => {
            if (kind === "Crafting Material") {
              return <Cpu className="w-3.5 h-3.5 text-[#34d399]" />;
            }
            if (kind === "Intel / Data Drive") {
              return <HardDrive className="w-3.5 h-3.5 text-[#38bdf8]" />;
            }
            if (kind === "Canister / Biohazard") {
              return <FlaskConical className="w-3.5 h-3.5 text-[#e5a93c]" />;
            }
            return <Wrench className="w-3.5 h-3.5 text-[#cbd5e1]" />;
          };

          return (
            <div className="space-y-3.5">
              {/* Overview & Filter Controls */}
              <div className="rounded-xl bg-[#141b26] border border-white/[0.075] p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <Wrench className="w-4 h-4 text-[#e5a93c] shrink-0" />
                      <h2 className="font-display text-base font-semibold text-[#f8fafc]">
                        Hideout Disassembly Catalog
                      </h2>
                    </div>
                    <p className="text-[12.5px] text-[#a9b8ca] mt-1 leading-relaxed">
                      Place salvaged tech or containment units into your{" "}
                      <span className="text-[#e2e8f0] font-medium">Electronics Workshop</span>{" "}
                      disassembly storage to extract crafting parts, data drives, and canisters.
                      Items break down sequentially (top-left slot first) and timers continue
                      while offline; moving an active item resets its progress.
                    </p>
                  </div>
                  <span className="font-mono-tabular text-xs font-semibold text-[#e5a93c] whitespace-nowrap shrink-0">
                    {filteredDisassembly.length} / {disassemblyRecipes.length}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap pt-1">
                  <select
                    aria-label="Filter disassembly items by category"
                    value={disassemblyCategoryFilter}
                    onChange={(e) =>
                      setDisassemblyCategoryFilter(
                        e.target.value as "all" | DisassemblyCategory
                      )
                    }
                    className="w-full sm:w-auto min-h-[44px] lg:min-h-[34px] bg-[#0a0e14] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-[#f1f5f9] focus:outline-none focus:border-[#e5a93c]"
                  >
                    <option value="all">
                      All Categories ({disassemblyRecipes.length})
                    </option>
                    <option value="Electronics & Comms">Electronics &amp; Comms</option>
                    <option value="Containers & Chem">Containers &amp; Chem</option>
                    <option value="Avionics & Weapons">Avionics &amp; Weapons</option>
                  </select>

                  <div className="flex items-center rounded-xl bg-[#0a0e14] border border-white/[0.07] p-1">
                    {(
                      [
                        { id: "all", label: "All Times" },
                        { id: "4 hours", label: "4h" },
                        { id: "6 hours", label: "6h" },
                        { id: "8 hours", label: "8h" },
                      ] as const
                    ).map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setDisassemblyDurationFilter(d.id)}
                        className={`min-h-[38px] lg:min-h-[30px] px-2.5 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                          disassemblyDurationFilter === d.id
                            ? "bg-[#141b26] text-[#e5a93c] ring-1 ring-white/[0.08]"
                            : "text-[#94a3b8] hover:text-[#e2e8f0]"
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 15 Disassembly Cards */}
              {filteredDisassembly.length === 0 ? (
                <div className="rounded-xl border border-white/[0.075] bg-[#141b26] p-8 text-center text-[13px] text-[#9fb0c4]">
                  No disassembly items matched your current search or filter.
                </div>
              ) : (
                <div
                  className={`grid gap-3 ${
                    isExpanded ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
                  }`}
                >
                  {filteredDisassembly.map((rec) => {
                    const spawnInfo = getDisassemblySpawnSummary(rec.name);
                    const isInspected = selectedMaterialKey === `disassembly_${rec.id}`;
                    const outcomeDetails: DisassemblyOutcomeDetail[] =
                      rec.outcomeDetails && rec.outcomeDetails.length > 0
                        ? rec.outcomeDetails
                        : rec.outcomes.map((o) => ({
                            name: o,
                            kind: "Module" as const,
                          }));

                    return (
                      <div
                        key={rec.id}
                        className={`rounded-xl border p-4 flex flex-col justify-between transition-colors ${
                          isInspected
                            ? "bg-[#15202e] border-[#38bdf8]/75 shadow-lg"
                            : "bg-[#141b26] border-white/[0.075] hover:border-white/[0.16]"
                        }`}
                      >
                        <div className="space-y-3">
                          {/* Item Header */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3 min-w-0">
                              <ItemThumbnail
                                src={rec.image}
                                alt={rec.name}
                                sizeClass="w-11 h-11"
                              />
                              <div className="min-w-0">
                                <div className="text-[11px] font-medium text-[#9fb0c4] truncate">
                                  {rec.category}
                                </div>
                                <h3 className="font-display text-[15px] font-semibold text-[#f8fafc] leading-snug">
                                  {rec.name}
                                </h3>
                                <div className="font-mono-tabular text-[11px] text-[#8fa1b6] mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                                  <span className="inline-flex items-center gap-1 text-[#cbd5e1]">
                                    <Clock className="w-3 h-3 text-[#38bdf8]" />
                                    {rec.duration}
                                  </span>
                                  {rec.gridSize && <span>· {rec.gridSize}</span>}
                                  {rec.weight && <span>· {rec.weight}</span>}
                                </div>
                              </div>
                            </div>

                            {rec.sellPrice && (
                              <div className="text-right shrink-0">
                                <div className="text-[10px] text-[#7f8ea1]">
                                  Raw Sell
                                </div>
                                <div className="font-mono-tabular text-xs font-semibold text-[#e5a93c]">
                                  {rec.sellPrice}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Yielded Materials List */}
                          <div className="space-y-1.5">
                            <div className="text-[11px] font-medium text-[#8fa1b6]">
                              Breaks down into ({outcomeDetails.length})
                            </div>
                            {outcomeDetails.map((out, idx) => (
                              <div
                                key={`${rec.id}-${idx}`}
                                className="flex items-center justify-between gap-2.5 rounded-lg bg-[#0a0e14] border border-white/[0.065] px-2.5 py-2"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  {out.image ? (
                                    <ItemThumbnail
                                      src={out.image}
                                      alt={out.name}
                                      sizeClass="w-7 h-7"
                                    />
                                  ) : (
                                    <div className="w-7 h-7 rounded-md bg-[#111722] border border-white/[0.07] flex items-center justify-center shrink-0">
                                      {renderOutcomeIcon(out.kind)}
                                    </div>
                                  )}
                                  <div className="min-w-0">
                                    <div className="text-xs font-medium text-[#e6edf5] truncate">
                                      {out.name}
                                    </div>
                                    <div className="text-[10.5px] text-[#7f8ea1] truncate">
                                      {out.kind}
                                      {out.gridSize ? ` · ${out.gridSize}` : ""}
                                      {out.weight ? ` · ${out.weight}` : ""}
                                    </div>
                                  </div>
                                </div>

                                {out.sellPrice && (
                                  <span className="font-mono-tabular text-[11px] font-semibold text-[#34d399] shrink-0">
                                    {out.sellPrice}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Spawn Footer */}
                        <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                          <div className="min-w-0 text-xs text-[#9fb0c4] truncate">
                            {spawnInfo.pois.length > 0
                              ? `Spawns: ${spawnInfo.pois.join(", ")}`
                              : rec.station}
                          </div>
                          {spawnInfo.count > 0 && (
                            <button
                              type="button"
                              onClick={() => onInspectDisassemblyItem(rec)}
                              className="min-h-[44px] lg:min-h-[34px] inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0a0e14] hover:bg-[#101824] border border-white/[0.1] hover:border-[#38bdf8] text-[#38bdf8] hover:text-[#7dd3fc] text-xs font-medium whitespace-nowrap transition-colors shrink-0"
                            >
                              <MapPin className="w-3.5 h-3.5" />
                              <span>Locate Spawns ({spawnInfo.count})</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })()}

        {/* ================================================================
            VIEW 4: LIVE API SEARCH (TOOLS, KEYS, CONTAINERS, TASKS)
           ================================================================ */}
        {activeView === "api-search" && (
          <div className="space-y-3">
            <div className="rounded-xl bg-[#141b26] border border-white/[0.075] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-base font-semibold text-[#f8fafc]">
                  Item &amp; Intel Index
                </h2>
                <span className="font-mono-tabular text-xs font-medium text-[#34d399]">
                  {allApiRecords.length} indexed
                </span>
              </div>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#7b8ca1] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={apiQuery}
                    onChange={(e) => setApiQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleRunLiveApiSearch()}
                    placeholder="Search tools, keys, loot containers, tasks, modules..."
                    className="w-full min-h-[36px] bg-[#0a0e14] border border-white/[0.08] rounded-lg pl-9 pr-3 py-1.5 text-[13px] text-[#f1f5f9] placeholder:text-[#66778b] focus:outline-none focus:border-[#38bdf8]"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleRunLiveApiSearch}
                  disabled={isLiveSearching || !apiQuery.trim()}
                  className="px-3.5 py-1.5 rounded-lg bg-[#38bdf8] hover:bg-[#5cc9fa] disabled:opacity-50 text-[#080b10] text-xs font-semibold whitespace-nowrap transition-colors"
                >
                  {isLiveSearching ? "Searching..." : "Search Index"}
                </button>
              </div>
            </div>

            {liveSearchResults && Object.keys(liveSearchResults).length > 0 && (
              <div className="gzw-drawer-enter rounded-xl bg-[#141b26] border border-[#38bdf8]/45 p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#38bdf8]">
                    Live Search Results
                  </span>
                  <button
                    type="button"
                    onClick={() => setLiveSearchResults(null)}
                    className="text-xs text-[#9fb0c4] hover:text-white"
                  >
                    Dismiss
                  </button>
                </div>
                {Object.entries(liveSearchResults).map(([ds, list]) =>
                  Array.isArray(list) && list.length > 0 ? (
                    <div key={ds} className="text-xs">
                      <div className="text-xs font-medium text-[#e5a93c] mb-1.5 capitalize">
                        {ds.replace(/_/g, " ")} ({list.length})
                      </div>
                      <div className="space-y-1.5">
                        {list.slice(0, 6).map((item, idx) => (
                          <div
                            key={idx}
                            className="px-3 py-2 rounded-lg bg-[#0a0e14] border border-white/[0.065] text-[#e2e8f0] truncate"
                          >
                            {String(item.name || item.title || item.id || "Record")}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setApiDatasetFilter("ALL")}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  apiDatasetFilter === "ALL"
                    ? "bg-[#15202e] border-[#38bdf8] text-[#7dd3fc]"
                    : "bg-[#141b26] border-white/[0.075] text-[#9fb0c4] hover:text-white"
                }`}
              >
                All ({allApiRecords.length})
              </button>
              {apiDatasets.map((ds) => (
                <button
                  key={ds}
                  type="button"
                  onClick={() => setApiDatasetFilter(ds)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border capitalize transition-colors ${
                    apiDatasetFilter === ds
                      ? "bg-[#15202e] border-[#38bdf8] text-[#7dd3fc]"
                      : "bg-[#141b26] border-white/[0.075] text-[#9fb0c4] hover:text-white"
                  }`}
                >
                  {ds.replace(/_/g, " ")} ({apiCache?.datasets[ds]?.length || 0})
                </button>
              ))}
            </div>

            <div className="space-y-2.5">
              {filteredApiRecords.slice(0, 80).map((rec) => (
                <div
                  key={rec.uid}
                  onClick={() => onInspectApiRecord(rec)}
                  className="rounded-xl bg-[#141b26] border border-white/[0.075] hover:border-[#38bdf8]/60 p-4 cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <ItemThumbnail src={rec.image} alt={rec.name} />
                      <div className="min-w-0">
                        <div className="text-[14.5px] font-medium text-[#f8fafc] truncate">
                          {rec.name}
                        </div>
                        <div className="text-xs text-[#9fb0c4] mt-0.5 truncate">
                          <span className="capitalize">{rec.dataset.replace(/_/g, " ")}</span>
                          {rec.category && rec.category !== rec.dataset && (
                            <>
                              <span className="mx-1.5 text-[#5a6a7e]">·</span>
                              <span>{rec.category}</span>
                            </>
                          )}
                          {rec.sellPrice && (
                            <>
                              <span className="mx-1.5 text-[#5a6a7e]">·</span>
                              <span className="font-mono-tabular text-[#e5a93c]">
                                {rec.sellPrice}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <MapPin className="w-4 h-4 text-[#7b8ca1] shrink-0 mt-1" />
                  </div>
                  {rec.description && (
                    <p className="text-[13px] text-[#b4c2d4] mt-2.5 line-clamp-2 leading-relaxed">
                      {rec.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
