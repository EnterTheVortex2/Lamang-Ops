import { useMemo, useState } from "react";
import { Check, KeyRound, MapPin, Search } from "lucide-react";
import { FACTIONS, type FactionId } from "../config/mapConfig";
import type { GzwKeyDoorDef } from "../utils/keyBuilder";
import { ItemThumbnail } from "./ItemThumbnail";

interface KeysDoorsPanelProps {
  keysList: GzwKeyDoorDef[];
  selectedFaction: FactionId;
  ownedKeys: Record<string, boolean>;
  onToggleOwnedKey: (keyId: string) => void;
  selectedKeyId: string | null;
  onLocateKeyOnMap: (keyDef: GzwKeyDoorDef) => void;
  onSelectLinkedTask?: (taskId: string) => void;
  isExpanded: boolean;
  isLoadingApi: boolean;
}

type KeyFilterMode = "all" | "owned" | "missing" | "task" | "keycards";

export function KeysDoorsPanel({
  keysList,
  selectedFaction,
  ownedKeys,
  onToggleOwnedKey,
  selectedKeyId,
  onLocateKeyOnMap,
  isExpanded,
  isLoadingApi,
}: KeysDoorsPanelProps) {
  const [selectedRegion, setSelectedRegion] = useState<string>("ALL");
  const [filterMode, setFilterMode] = useState<KeyFilterMode>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const starterTown =
    selectedFaction !== "ALL" ? FACTIONS[selectedFaction].starterTown : null;

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

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#0e131b]">
      {/* Keyholder & Door Filters */}
      <div className="px-4 py-3.5 border-b border-white/[0.075] bg-[#0e131b] space-y-3 shrink-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-[#7b8ca1] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search key, door, region, task..."
              className="w-full min-h-[44px] lg:min-h-[38px] bg-[#0a0e14] border border-white/[0.08] rounded-xl pl-9 pr-3 py-2 text-sm lg:text-[13px] text-[#f1f5f9] placeholder:text-[#66778b] focus:outline-none focus:border-[#e5a93c] transition-colors"
            />
          </div>

          <select
            aria-label="Filter keys by region"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="w-full min-h-[44px] lg:min-h-[38px] bg-[#0a0e14] border border-white/[0.08] rounded-xl px-3 py-2 text-sm lg:text-[13px] text-[#f1f5f9] focus:outline-none focus:border-[#e5a93c]"
          >
            <option value="ALL">All Regions ({keysList.length})</option>
            {regions.map((r) => (
              <option key={r.region} value={r.region}>
                {r.region}
                {starterTown === r.region ? ` (${selectedFaction} Starter)` : ""} ({r.count})
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
                className={`min-h-[38px] lg:min-h-[32px] px-3 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
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

      {/* Keys List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="text-xs text-[#9fb0c4] px-0.5">
          Showing {filteredKeys.length} of {keysList.length} keys &amp; keycards
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
                          <span className="mx-1.5 text-white/[0.22]">·</span>
                          <span>{keyDef.region}</span>
                          {keyDef.sublocation && (
                            <>
                              <span className="mx-1.5 text-white/[0.22]">·</span>
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
                    </div>

                    {keyDef.linkedTasks.length > 0 && (
                      <div className="mt-2.5 pt-2.5 border-t border-white/[0.06] text-xs text-[#e5a93c]">
                        <span className="inline-flex items-center gap-1.5 font-medium">
                          <KeyRound className="w-3.5 h-3.5 shrink-0" />
                          Used in{" "}
                          {keyDef.linkedTasks
                            .map((t) => `${t.name} (${t.vendor})`)
                            .join(", ")}
                        </span>
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
                      {isOwned && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                      {isOwned ? "In Keyholder" : "Mark Owned"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
