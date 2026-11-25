import { useMemo, useState } from "react";
import {
  BookOpen,
  Camera,
  Check,
  ChevronDown,
  ChevronUp,
  Compass,
  Crosshair,
  ExternalLink,
  GitBranch,
  KeyRound,
  Loader2,
  MapPin,
  RefreshCw,
  Search,
  User,
  X,
} from "lucide-react";
import {
  doesTaskBelongToFaction,
  FACTIONS,
  type FactionId,
} from "../config/mapConfig";
import {
  fetchTaskWalkthroughIntel,
  type TaskWikiIntel,
} from "../services/gzwApi";
import type {
  GzwTaskDef,
  TaskCategory,
  VendorProfile,
} from "../utils/taskBuilder";
import { ItemThumbnail } from "./ItemThumbnail";

interface TasksTrackerPanelProps {
  vendors: VendorProfile[];
  tasks: GzwTaskDef[];
  selectedFaction: FactionId;
  completedTasks: Record<string, boolean>;
  onToggleTaskComplete: (taskId: string) => void;
  selectedTaskId: string | null;
  onLocateTaskOnMap: (task: GzwTaskDef) => void;
  onLocateRelatedItem?: (itemName: string) => void;
  isExpanded: boolean;
  isLoadingApi: boolean;
}

const CATEGORY_OPTIONS: { id: "ALL" | TaskCategory; label: string }[] = [
  { id: "ALL", label: "All" },
  { id: "Main Task", label: "Main" },
  { id: "Side Task", label: "Side" },
  { id: "Contract", label: "Contract" },
  { id: "Hidden Task", label: "Hidden" },
];

export function TasksTrackerPanel({
  vendors,
  tasks,
  selectedFaction,
  completedTasks,
  onToggleTaskComplete,
  selectedTaskId,
  onLocateTaskOnMap,
  onLocateRelatedItem,
  isExpanded,
  isLoadingApi,
}: TasksTrackerPanelProps) {
  const [selectedVendor, setSelectedVendor] = useState<string>("ALL");
  const [selectedArea, setSelectedArea] = useState<string>("ALL");
  const [showAllFactionsOverride, setShowAllFactionsOverride] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<"ALL" | TaskCategory>(
    "ALL"
  );
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "done">(
    "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedTaskIds, setExpandedTaskIds] = useState<
    Record<string, boolean>
  >({});
  const [wikiIntelByTaskId, setWikiIntelByTaskId] = useState<
    Record<string, TaskWikiIntel>
  >({});
  const [loadingWikiIds, setLoadingWikiIds] = useState<Record<string, boolean>>(
    {}
  );
  const [lightboxImage, setLightboxImage] = useState<{
    src: string;
    title: string;
    caption?: string;
  } | null>(null);
  const [failedImgUrls, setFailedImgUrls] = useState<Record<string, boolean>>({});
  const markImgFailed = (url: string) =>
    setFailedImgUrls((prev) => (prev[url] ? prev : { ...prev, [url]: true }));

  const effectiveFaction =
    showAllFactionsOverride ? "ALL" : selectedFaction;

  const factionTasks = useMemo(() => {
    if (effectiveFaction === "ALL") return tasks;
    return tasks.filter((t) =>
      doesTaskBelongToFaction(t.faction, t.areas, effectiveFaction)
    );
  }, [tasks, effectiveFaction]);

  const vendorStats = useMemo(() => {
    const map = new Map<string, { total: number; done: number }>();
    for (const v of vendors) {
      map.set(v.name.toLowerCase(), { total: 0, done: 0 });
    }
    for (const t of factionTasks) {
      const k = t.vendor.toLowerCase();
      const entry = map.get(k) || { total: 0, done: 0 };
      entry.total += 1;
      if (completedTasks[t.id]) entry.done += 1;
      map.set(k, entry);
    }
    return map;
  }, [vendors, factionTasks, completedTasks]);

  const activeVendorProfile = useMemo(
    () =>
      selectedVendor === "ALL"
        ? null
        : vendors.find(
            (v) => v.name.toLowerCase() === selectedVendor.toLowerCase()
          ) || null,
    [selectedVendor, vendors]
  );

  const vendorScopedTasks = useMemo(() => {
    if (selectedVendor === "ALL") return factionTasks;
    return factionTasks.filter(
      (t) => t.vendor.toLowerCase() === selectedVendor.toLowerCase()
    );
  }, [factionTasks, selectedVendor]);

  const areaOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const t of vendorScopedTasks) {
      for (const area of t.areas) {
        counts.set(area, (counts.get(area) || 0) + 1);
      }
    }
    const starterTown =
      selectedFaction !== "ALL" ? FACTIONS[selectedFaction].starterTown : null;
    return Array.from(counts.entries())
      .map(([area, count]) => ({ area, count }))
      .sort((a, b) => {
        if (starterTown) {
          if (a.area === starterTown && b.area !== starterTown) return -1;
          if (b.area === starterTown && a.area !== starterTown) return 1;
        }
        return a.area.localeCompare(b.area);
      });
  }, [vendorScopedTasks, selectedFaction]);

  const effectiveArea =
    selectedArea === "ALL" || areaOptions.some((o) => o.area === selectedArea)
      ? selectedArea
      : "ALL";

  const filteredTasks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return vendorScopedTasks.filter((t) => {
      if (effectiveArea !== "ALL" && !t.areas.includes(effectiveArea)) {
        return false;
      }
      if (categoryFilter !== "ALL" && t.category !== categoryFilter) {
        return false;
      }
      const isDone = !!completedTasks[t.id];
      if (statusFilter === "active" && isDone) return false;
      if (statusFilter === "done" && !isDone) return false;

      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        t.vendor.toLowerCase().includes(q) ||
        t.locationRaw.toLowerCase().includes(q) ||
        t.briefing.toLowerCase().includes(q) ||
        t.objectivesText.toLowerCase().includes(q) ||
        t.walkthroughSteps.some((s) => s.toLowerCase().includes(q)) ||
        t.relatedItems.some((r) => r.name.toLowerCase().includes(q))
      );
    });
  }, [
    vendorScopedTasks,
    effectiveArea,
    categoryFilter,
    statusFilter,
    completedTasks,
    searchQuery,
  ]);

  const totalDone = useMemo(
    () => factionTasks.filter((t) => completedTasks[t.id]).length,
    [factionTasks, completedTasks]
  );

  const loadLiveTaskGuide = async (task: GzwTaskDef, force = false) => {
    if (!force && wikiIntelByTaskId[task.id]) return;
    setLoadingWikiIds((prev) => ({ ...prev, [task.id]: true }));
    try {
      const intel = await fetchTaskWalkthroughIntel(task.name, force);
      setWikiIntelByTaskId((prev) => ({ ...prev, [task.id]: intel }));
    } finally {
      setLoadingWikiIds((prev) => ({ ...prev, [task.id]: false }));
    }
  };

  const toggleTaskExpanded = (task: GzwTaskDef) => {
    const willOpen = !expandedTaskIds[task.id];
    setExpandedTaskIds((prev) => ({ ...prev, [task.id]: willOpen }));
    if (willOpen) {
      void loadLiveTaskGuide(task);
    }
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#0e131b]">
      {/* Vendor & Region Filter Controls */}
      <div className="px-4 py-3 border-b border-white/[0.075] bg-[#0e131b] space-y-2.5 shrink-0">
        {/* Horizontal scrollable Vendor Roster Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => {
              setSelectedVendor("ALL");
              setSelectedArea("ALL");
            }}
            className={`min-h-[48px] px-3 py-1.5 rounded-xl border text-left transition-colors shrink-0 flex items-center gap-2.5 ${
              selectedVendor === "ALL"
                ? "bg-[#141b26] border-[#e5a93c]/65 text-[#f8fafc]"
                : "bg-[#0a0e14] border-white/[0.07] text-[#9fb0c4] hover:text-white hover:border-white/[0.16]"
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-[#0e131b] border border-white/[0.08] flex items-center justify-center text-xs font-semibold text-[#e5a93c]">
              All
            </div>
            <div>
              <div className="text-xs font-semibold leading-tight">
                All Vendors
              </div>
              <div className="font-mono-tabular text-[11px] text-[#8899ae]">
                {totalDone}/{factionTasks.length}
              </div>
            </div>
          </button>

          {vendors.map((vendor) => {
            const active =
              selectedVendor.toLowerCase() === vendor.name.toLowerCase();
            const stats = vendorStats.get(vendor.name.toLowerCase()) || {
              total: 0,
              done: 0,
            };
            return (
              <button
                key={vendor.id}
                type="button"
                onClick={() => {
                  setSelectedVendor(vendor.name);
                  setSelectedArea("ALL");
                }}
                className={`min-h-[48px] px-3 py-1.5 rounded-xl border text-left transition-colors shrink-0 flex items-center gap-2.5 ${
                  active
                    ? "bg-[#141b26] border-[#e5a93c]/65 text-[#f8fafc]"
                    : "bg-[#0a0e14] border-white/[0.07] text-[#9fb0c4] hover:text-white hover:border-white/[0.16]"
                }`}
              >
                {vendor.image && !failedImgUrls[vendor.image] ? (
                  <img
                    src={vendor.image}
                    alt={vendor.name}
                    referrerPolicy="no-referrer"
                    onError={() => markImgFailed(vendor.image!)}
                    className="w-8 h-8 rounded-lg object-cover object-top border border-white/[0.1] bg-[#080b10] shrink-0"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-[#0e131b] border border-white/[0.08] flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-[#8899ae]" />
                  </div>
                )}
                <div>
                  <div className="text-xs font-semibold leading-tight whitespace-nowrap">
                    {vendor.name}
                  </div>
                  <div className="font-mono-tabular text-[11px] text-[#8899ae]">
                    {stats.done}/{stats.total}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Unified Search + Region Filter Row */}
        <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_200px] gap-2">
          <div className="relative min-w-0">
            <Search className="w-4 h-4 text-[#7b8ca1] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeVendorProfile
                  ? `Search ${activeVendorProfile.name} tasks, walkthroughs, or keys...`
                  : "Search task, region, walkthrough, or required key..."
              }
              className="w-full min-h-[42px] lg:min-h-[36px] bg-[#0a0e14] border border-white/[0.08] rounded-xl pl-9 pr-3 py-1.5 text-sm lg:text-[13px] text-[#f1f5f9] placeholder:text-[#66778b] focus:outline-none focus:border-[#e5a93c] transition-colors"
            />
          </div>

          <select
            aria-label="Filter tasks by area"
            value={
              selectedArea === "ALL" ||
              areaOptions.some((o) => o.area === selectedArea)
                ? selectedArea
                : "ALL"
            }
            onChange={(e) => setSelectedArea(e.target.value)}
            className="w-full min-h-[42px] lg:min-h-[36px] bg-[#0a0e14] border border-white/[0.08] rounded-xl px-3 py-1.5 text-sm lg:text-[13px] text-[#f1f5f9] focus:outline-none focus:border-[#e5a93c]"
          >
            <option value="ALL">
              All Regions ({vendorScopedTasks.length})
            </option>
            {areaOptions.map((opt) => {
              const isStarter =
                selectedFaction !== "ALL" &&
                opt.area === FACTIONS[selectedFaction].starterTown;
              return (
                <option key={opt.area} value={opt.area}>
                  {opt.area}
                  {isStarter ? ` (${selectedFaction} Starter)` : ""} ({opt.count})
                </option>
              );
            })}
          </select>
        </div>

        {/* Category + Status + Faction Override Row */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center rounded-xl bg-[#0a0e14] border border-white/[0.07] p-1 overflow-x-auto max-w-full">
            {CATEGORY_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setCategoryFilter(opt.id)}
                className={`min-h-[36px] lg:min-h-[30px] px-2.5 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  categoryFilter === opt.id
                    ? "bg-[#141b26] text-[#e5a93c] ring-1 ring-white/[0.08]"
                    : "text-[#94a3b8] hover:text-[#f1f5f9]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {selectedFaction !== "ALL" && (
              <button
                type="button"
                onClick={() => setShowAllFactionsOverride((v) => !v)}
                className="text-xs font-medium text-[#38bdf8] hover:underline whitespace-nowrap px-1"
              >
                {showAllFactionsOverride
                  ? `Only ${selectedFaction}`
                  : "All Factions"}
              </button>
            )}
            <div className="flex items-center rounded-xl bg-[#0a0e14] border border-white/[0.07] p-1">
              {(
                [
                  { id: "all", label: "All" },
                  { id: "active", label: "Active" },
                  { id: "done", label: "Done" },
                ] as const
              ).map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setStatusFilter(st.id)}
                  className={`min-h-[36px] lg:min-h-[30px] px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    statusFilter === st.id
                      ? "bg-[#141b26] text-[#38bdf8] ring-1 ring-white/[0.08]"
                      : "text-[#94a3b8] hover:text-[#f1f5f9]"
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Tasks Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5">
        <div className={`space-y-4 ${isExpanded ? "max-w-4xl mx-auto" : ""}`}>
        {activeVendorProfile && (
          <div className="rounded-2xl bg-[#141b26] border border-white/[0.08] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-4 min-w-0">
              {activeVendorProfile.image &&
              !failedImgUrls[activeVendorProfile.image] ? (
                <img
                  src={activeVendorProfile.image}
                  alt={activeVendorProfile.name}
                  referrerPolicy="no-referrer"
                  onError={() => markImgFailed(activeVendorProfile.image!)}
                  className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl object-cover object-top border border-white/[0.14] bg-[#0a0e14] shrink-0 shadow-lg"
                />
              ) : (
                <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl bg-[#0a0e14] border border-white/[0.08] flex items-center justify-center shrink-0">
                  <User className="w-8 h-8 text-[#e5a93c]" />
                </div>
              )}
              <div className="min-w-0 space-y-1">
                <div className="font-display text-lg sm:text-xl font-semibold text-[#f8fafc] leading-tight">
                  {activeVendorProfile.name}{" "}
                  {activeVendorProfile.fullName !== "Unknown" && (
                    <span className="text-[#9fb0c4] font-normal text-xs sm:text-sm">
                      · {activeVendorProfile.fullName}
                    </span>
                  )}
                </div>
                <div className="text-xs sm:text-[13px] text-[#cbd5e1] leading-relaxed">
                  {activeVendorProfile.specialty}
                </div>
                {activeVendorProfile.sells && (
                  <div className="text-xs text-[#8899ae] line-clamp-2">
                    Supplies: {activeVendorProfile.sells}
                  </div>
                )}
              </div>
            </div>
            <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-2.5 sm:pt-0 border-white/[0.07] shrink-0">
              <div className="text-xs text-[#8899ae]">Completed Tasks</div>
              <div className="font-mono-tabular text-lg font-semibold text-[#e5a93c]">
                {vendorStats.get(activeVendorProfile.name.toLowerCase())?.done ??
                  0}{" "}
                /{" "}
                {vendorStats.get(activeVendorProfile.name.toLowerCase())
                  ?.total ?? 0}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-[#9fb0c4] px-0.5">
          <span>
            Showing {filteredTasks.length} of {vendorScopedTasks.length} tasks · Click a card for building photos &amp; guide
          </span>
          {selectedArea !== "ALL" && (
            <button
              type="button"
              onClick={() => setSelectedArea("ALL")}
              className="text-[#38bdf8] hover:underline shrink-0"
            >
              Show all regions
            </button>
          )}
        </div>

        {tasks.length === 0 ? (
          <div className="rounded-xl border border-white/[0.075] bg-[#141b26] p-8 text-center text-sm text-[#9fb0c4]">
            {isLoadingApi
              ? "Loading vendor tasks & walkthroughs..."
              : "No vendor tasks cached yet. Click Sync Data in the top bar."}
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="rounded-xl border border-white/[0.075] bg-[#141b26] p-8 text-center text-sm text-[#9fb0c4]">
            No tasks match{" "}
            {selectedVendor !== "ALL" ? selectedVendor : "your filters"}
            {selectedArea !== "ALL" ? ` in ${selectedArea}` : ""}.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3.5">
            {filteredTasks.map((task) => {
              const isDone = !!completedTasks[task.id];
              const isSelected = selectedTaskId === task.id;
              const isOpen = !!expandedTaskIds[task.id];
              const hasMapCoords =
                task.exactCoords.length > 0 || task.matchedPois.length > 0;
              const wikiIntel = wikiIntelByTaskId[task.id];
              const isLoadingGuide = !!loadingWikiIds[task.id];

              // Combine live Wiki building/room screenshots + any API field guide screenshot (never vendor banners)
              const locationPhotos = [
                ...(wikiIntel?.images || []),
                ...(task.guideImage &&
                !(wikiIntel?.images || []).some((im) =>
                  im.url.includes(task.guideImage!.split("/")[6] || "__none__")
                )
                  ? [
                      {
                        url: task.guideImage,
                        fullUrl: task.guideImage,
                        caption: `${task.name} objective reference`,
                      },
                    ]
                  : []),
              ].filter((im) => !failedImgUrls[im.url]);

              // Prefer richer live Wiki steps when available, else curated/API steps
              const displaySteps =
                wikiIntel && wikiIntel.walkthroughSteps.length > 0
                  ? wikiIntel.walkthroughSteps
                  : task.walkthroughSteps;
              const stepSourceLabel =
                wikiIntel && wikiIntel.walkthroughSteps.length > 0
                  ? "Live Wiki Guide"
                  : task.walkthroughSource === "api-guide"
                    ? "Field Guide"
                    : task.walkthroughSource === "curated"
                      ? "0.5 Tactical Guide"
                      : "Mission Intel";

              return (
                <article
                  key={task.id}
                  onClick={() => toggleTaskExpanded(task)}
                  className={`rounded-xl border p-4 transition-colors flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? "bg-[#15202e] border-[#38bdf8]/75 shadow-lg"
                      : isOpen
                        ? "bg-[#161f2c] border-white/[0.16]"
                        : isDone
                          ? "bg-[#0f1a18] border-[#22473b]"
                          : "bg-[#141b26] border-white/[0.075] hover:border-white/[0.18]"
                  }`}
                >
                  <div>
                    {/* Clean Metadata Header */}
                    <div className="flex items-center justify-between gap-2 text-xs text-[#9fb0c4]">
                      <span className="truncate">
                        <span className="text-[#e5a93c] font-semibold">
                          {task.vendor}
                        </span>
                        <span className="mx-1.5 text-white/[0.22]">·</span>
                        <span className="text-[#dce5f0]">
                          {task.areas.join(", ")}
                        </span>
                      </span>
                      <span
                        className={`text-xs font-medium shrink-0 ${
                          task.category === "Main Task"
                            ? "text-[#38bdf8]"
                            : task.category === "Hidden Task"
                              ? "text-[#f59e0b]"
                              : task.category === "Contract"
                                ? "text-[#e5a93c]"
                                : "text-[#9fb0c4]"
                        }`}
                      >
                        {task.category}
                      </span>
                    </div>

                    {/* Task Title */}
                    <div className="mt-1.5 flex items-start justify-between gap-2">
                      <h3
                        className={`font-display text-[15.5px] font-semibold leading-snug ${
                          isDone ? "text-[#94a3b8] line-through" : "text-[#f8fafc]"
                        }`}
                      >
                        {task.name}
                      </h3>
                      <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                        {task.vendorRankRequired && (
                          <span className="font-mono-tabular text-xs text-[#e5a93c]">
                            Rank {task.vendorRankRequired}
                          </span>
                        )}
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-[#38bdf8]" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-[#8899ae]" />
                        )}
                      </div>
                    </div>

                    {/* Clean Objectives Summary */}
                    {task.objectivesText && (
                      <div className="mt-2.5 text-[13px] text-[#cbd5e1] leading-relaxed">
                        <div className="flex items-start gap-2">
                          <Crosshair className="w-4 h-4 text-[#e5a93c] shrink-0 mt-0.5" />
                          <span>{task.objectivesText}</span>
                        </div>
                        {task.objectivesList.length > 0 && (
                          <ul className="mt-1.5 pl-6 space-y-1 text-[12.5px] text-[#a9b8ca] list-disc">
                            {task.objectivesList.map((step, idx) => (
                              <li key={idx}>{step}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}

                    {/* Collapsed Hints */}
                    {!isOpen &&
                      (task.exactCoords.length > 0 ||
                        task.relatedItems.length > 0 ||
                        task.nearestLzs.length > 0) && (
                        <div className="mt-2.5 flex flex-wrap items-center gap-x-3.5 gap-y-1 text-xs text-[#8899ae]">
                          {task.exactCoords.length > 0 && (
                            <span className="font-mono-tabular text-[#38bdf8]">
                              Grid{" "}
                              {task.exactCoords.map((c) => c.grid).join(" / ")}
                            </span>
                          )}
                          {task.nearestLzs.length > 0 && (
                            <span>LZ: {task.nearestLzs.slice(0, 2).join(", ")}</span>
                          )}
                          {task.relatedItems.length > 0 && (
                            <span className="text-[#e5a93c]">
                              {task.relatedItems.length} item/key note
                              {task.relatedItems.length > 1 ? "s" : ""}
                            </span>
                          )}
                        </div>
                      )}

                    {task.alternate && (
                      <div className="mt-2 flex items-center gap-1.5 text-xs text-[#f59e0b]">
                        <GitBranch className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">
                          Alternate choice: {task.alternate}
                        </span>
                      </div>
                    )}

                    {task.hiddenNote && (
                      <div className="mt-1.5 text-xs text-[#fde68a]">
                        Unlock: {task.hiddenNote}
                      </div>
                    )}

                    {/* ======================================================
                        EXPANDED WALKTHROUGH: BUILDING & OBJECTIVE PHOTOS + GUIDE
                       ====================================================== */}
                    {isOpen && (
                      <div
                        className="mt-3.5 pt-3.5 border-t border-white/[0.075] space-y-3.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Live Community Location & Building Photos */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#38bdf8]">
                              <Camera className="w-3.5 h-3.5" />
                              Building &amp; Objective Photos
                              {locationPhotos.length > 0 && (
                                <span className="text-[#9fb0c4] font-normal">
                                  ({locationPhotos.length})
                                </span>
                              )}
                            </span>

                            <div className="flex items-center gap-2.5">
                              <button
                                type="button"
                                onClick={() => void loadLiveTaskGuide(task, true)}
                                disabled={isLoadingGuide}
                                title="Pull latest community updates from GZW Wiki"
                                className="inline-flex items-center gap-1 text-xs text-[#9fb0c4] hover:text-white disabled:opacity-50"
                              >
                                <RefreshCw
                                  className={`w-3 h-3 ${
                                    isLoadingGuide ? "animate-spin" : ""
                                  }`}
                                />
                                <span>Refresh</span>
                              </button>
                              <a
                                href={
                                  wikiIntel?.wikiUrl ||
                                  `https://gray-zone-warfare.fandom.com/wiki/${encodeURIComponent(
                                    task.name.replace(/\s+/g, "_")
                                  )}`
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-[#e5a93c] hover:underline"
                              >
                                <span>Wiki</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>

                          {isLoadingGuide && locationPhotos.length === 0 ? (
                            <div className="rounded-lg bg-[#0a0e14] border border-white/[0.06] p-3.5 flex items-center gap-2.5 text-xs text-[#9fb0c4]">
                              <Loader2 className="w-4 h-4 animate-spin text-[#38bdf8]" />
                              <span>
                                Fetching building &amp; interior location screenshots...
                              </span>
                            </div>
                          ) : locationPhotos.length > 0 ? (
                            <div
                              className={`grid gap-2 ${
                                isExpanded
                                  ? "grid-cols-2 sm:grid-cols-3"
                                  : "grid-cols-1 sm:grid-cols-2"
                              }`}
                            >
                              {locationPhotos.map((photo, idx) => (
                                <button
                                  key={`${photo.url}-${idx}`}
                                  type="button"
                                  onClick={() =>
                                    setLightboxImage({
                                      src: photo.fullUrl || photo.url,
                                      title: task.name,
                                      caption: photo.caption,
                                    })
                                  }
                                  className="group rounded-lg bg-[#0a0e14] border border-white/[0.07] hover:border-[#38bdf8]/70 overflow-hidden text-left transition-colors flex flex-col"
                                >
                                  <div className="relative w-full h-36 bg-[#06090d] overflow-hidden">
                                    <img
                                      src={photo.url}
                                      alt={photo.caption}
                                      referrerPolicy="no-referrer"
                                      onError={() => markImgFailed(photo.url)}
                                      loading="lazy"
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                    />
                                  </div>
                                  <div className="px-2.5 py-2 text-xs text-[#cbd5e1] leading-snug line-clamp-2">
                                    {photo.caption}
                                  </div>
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="rounded-lg bg-[#0a0e14] border border-white/[0.06] px-3 py-2.5 flex items-center justify-between gap-2 text-xs text-[#9fb0c4]">
                              <span>
                                No screenshots hosted on this wiki page yet. Check GZW Tac Map for visual markers.
                              </span>
                              <a
                                href={`https://gzwtacmap.com/`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[#38bdf8] hover:underline shrink-0"
                              >
                                <span>GZW Tac Map</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          )}
                        </div>

                        {/* Step-by-Step Walkthrough */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#38bdf8]">
                              <BookOpen className="w-3.5 h-3.5" />
                              Walkthrough Steps
                            </span>
                            <span className="text-xs text-[#8899ae]">
                              {stepSourceLabel}
                            </span>
                          </div>
                          <ol className="space-y-1.5">
                            {displaySteps.map((step, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2.5 text-[13px] text-[#dce5f0] leading-relaxed bg-[#0a0e14] border border-white/[0.055] rounded-lg px-3 py-2"
                              >
                                <span className="font-mono-tabular text-xs font-bold text-[#e5a93c] shrink-0 mt-0.5">
                                  {i + 1}.
                                </span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>

                        {/* Exact Coords & Nearest LZs */}
                        {(task.exactCoords.length > 0 ||
                          task.nearestLzs.length > 0) && (
                          <div className="rounded-lg bg-[#0a0e14] border border-white/[0.06] px-3 py-2.5 space-y-1.5 text-[13px]">
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#e5a93c]">
                              <Compass className="w-3.5 h-3.5" />
                              Infil &amp; Target Grids
                            </div>
                            {task.exactCoords.map((coord) => (
                              <div
                                key={coord.grid}
                                className="flex items-center justify-between gap-2 text-xs"
                              >
                                <span className="text-[#dce5f0] truncate">
                                  {coord.label}
                                </span>
                                <span className="font-mono-tabular text-[#38bdf8] shrink-0 font-medium">
                                  Grid {coord.grid}
                                </span>
                              </div>
                            ))}
                            {task.nearestLzs.length > 0 && (
                              <div className="text-xs text-[#a9b8ca]">
                                Nearest LZs:{" "}
                                <span className="text-[#fde047] font-mono-tabular">
                                  {task.nearestLzs.join(" · ")}
                                </span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Required Gear, Keys & Task Items (Clickable to locate on map) */}
                        {task.relatedItems.length > 0 && (
                          <div className="space-y-1.5">
                            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#e5a93c]">
                              <KeyRound className="w-3.5 h-3.5" />
                              Required Gear, Keys &amp; Items
                            </div>
                            <div className="space-y-1.5">
                              {task.relatedItems.map((item, idx) => (
                                <button
                                  key={`${item.name}-${idx}`}
                                  type="button"
                                  onClick={() =>
                                    onLocateRelatedItem
                                      ? onLocateRelatedItem(item.name)
                                      : onLocateTaskOnMap(task)
                                  }
                                  title={`Locate ${item.name} on map`}
                                  className="w-full text-left flex items-center gap-3 rounded-lg bg-[#0a0e14] border border-white/[0.06] hover:border-[#38bdf8]/60 px-3 py-2 transition-colors group"
                                >
                                  <ItemThumbnail
                                    src={item.image}
                                    alt={item.name}
                                    sizeClass="w-8 h-8"
                                  />
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-2">
                                      <span className="text-[13px] font-medium text-[#f1f5f9] group-hover:text-[#7dd3fc] truncate transition-colors">
                                        {item.name}
                                      </span>
                                      <span className="inline-flex items-center gap-1 text-xs text-[#38bdf8] shrink-0">
                                        {item.kind}
                                        <MapPin className="w-3 h-3 opacity-80" />
                                      </span>
                                    </div>
                                    {item.note && (
                                      <div className="text-xs text-[#9fb0c4] truncate mt-0.5">
                                        {item.note}
                                      </div>
                                    )}
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Tactical Tip */}
                        {(wikiIntel?.tips?.[0] || task.guideTip) && (
                          <div className="rounded-lg bg-[#e5a93c]/[0.06] border border-[#e5a93c]/30 px-3 py-2 text-[13px] text-[#e2e8f0] leading-relaxed">
                            <span className="font-semibold text-[#e5a93c]">
                              Tip:{" "}
                            </span>
                            {wikiIntel?.tips?.[0] || task.guideTip}
                          </div>
                        )}

                        {/* Full Vendor Briefing */}
                        {task.briefing && (
                          <div className="rounded-lg bg-[#0a0e14] border border-white/[0.06] px-3 py-2.5 text-[13px] text-[#b4c2d4] leading-relaxed">
                            <div className="text-xs font-medium text-[#8899ae] mb-1">
                              {task.vendor} Briefing
                            </div>
                            {task.briefing}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div
                    className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => onLocateTaskOnMap(task)}
                      className={`min-h-[44px] lg:min-h-[36px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-medium transition-colors ${
                        isSelected
                          ? "bg-[#15283b] border-[#38bdf8] text-[#7dd3fc]"
                          : "bg-white/[0.035] border-white/[0.09] text-[#38bdf8] hover:border-[#38bdf8]"
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>
                        {hasMapCoords ? "Locate on Map" : "View Walkthrough"}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onToggleTaskComplete(task.id)}
                      className={`min-h-[44px] lg:min-h-[36px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-medium transition-colors whitespace-nowrap ${
                        isDone
                          ? "bg-[#112922] border-[#2e7359] text-[#34d399] hover:border-[#34d399]"
                          : "bg-white/[0.035] border-white/[0.09] text-[#e2e8f0] hover:border-[#e5a93c] hover:text-[#e5a93c]"
                      }`}
                    >
                      {isDone && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                      {isDone ? "Completed" : "Mark Complete"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
        </div>
      </div>

      {/* Full-Resolution Building & Objective Photo Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[2100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="gzw-drawer-enter max-w-4xl w-full rounded-xl bg-[#0e131b] border border-white/[0.12] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-3 border-b border-white/[0.075] flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-semibold text-[#f8fafc] truncate">
                  {lightboxImage.title}
                </div>
                {lightboxImage.caption && (
                  <div className="text-xs text-[#a9b8ca] truncate">
                    {lightboxImage.caption}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setLightboxImage(null)}
                aria-label="Close photo preview"
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-[#94a3b8] hover:text-white hover:bg-white/[0.06]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3 bg-[#080b10] flex justify-center">
              <img
                src={lightboxImage.src}
                alt={lightboxImage.caption || lightboxImage.title}
                referrerPolicy="no-referrer"
                className="max-h-[78vh] w-auto object-contain rounded"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
