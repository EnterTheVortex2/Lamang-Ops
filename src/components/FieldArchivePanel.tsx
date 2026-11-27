import {
  Activity,
  Award,
  BookOpen,
  Crosshair,
  Eye,
  HeartPulse,
  Package,
  Search,
  Shield,
  Skull,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  ARCHIVE_AMMO,
  ARCHIVE_ARMOR,
  ARCHIVE_BOSSES,
  ARCHIVE_FACTIONS,
  ARCHIVE_FIELD_GUIDES,
  ARCHIVE_INTEL_INDEX,
  ARCHIVE_LOOT_CONTAINERS,
  ARCHIVE_LOOT_ITEMS,
  ARCHIVE_MEDICAL,
  ARCHIVE_NVG,
  ARCHIVE_OPTICS_DEVICES,
  ARCHIVE_PATCH_NOTES,
  ARCHIVE_PROVISIONS,
  ARCHIVE_REGIONS,
  ARCHIVE_SQUAD_ITEMS,
  ARCHIVE_SQUAD_STRIKE,
  ARCHIVE_STORAGE,
  ARCHIVE_UTILITY,
  ARCHIVE_VENDORS,
  ARCHIVE_XP_ACTIONS,
  ARCHIVE_XP_LEVELS,
} from "../data/fieldArchiveData";

type ArchiveTabId =
  | "patches"
  | "bosses"
  | "ammo"
  | "optics"
  | "armor"
  | "medical"
  | "storage";

interface FieldArchivePanelProps {
  onAskAi?: (prompt: string) => void;
}

const PEN_TIER_LABEL: Record<number, { label: string; cls: string }> = {
  4: {
    label: "Tier 4 · Top AP",
    cls: "border-red-500/40 text-red-300",
  },
  3: {
    label: "Tier 3 · Mid-High AP",
    cls: "border-[#e5a93c]/40 text-[#fde68a]",
  },
  2: {
    label: "Tier 2 · Standard",
    cls: "border-[#38bdf8]/40 text-[#7dd3fc]",
  },
  1: {
    label: "Tier 1 · Flesh / Soft",
    cls: "border-white/[0.15] text-[#cbd5e1]",
  },
};

export function FieldArchivePanel({ onAskAi }: FieldArchivePanelProps) {
  const [activeTab, setActiveTab] = useState<ArchiveTabId>("patches");
  const [search, setSearch] = useState("");
  const [caliberFilter, setCaliberFilter] = useState("ALL");
  const [opticFilter, setOpticFilter] = useState("ALL");
  const [armorTypeFilter, setArmorTypeFilter] = useState("ALL");
  const [medicalTypeFilter, setMedicalTypeFilter] = useState("ALL");
  const [storageSubView, setStorageSubView] = useState<
    "storage" | "loot" | "squad" | "xp" | "intel"
  >("storage");
  const [storageTypeFilter, setStorageTypeFilter] = useState("ALL");

  const q = search.trim().toLowerCase();

  const calibers = useMemo(
    () => ["ALL", ...Array.from(new Set(ARCHIVE_AMMO.map((a) => a.caliber))).sort()],
    []
  );

  const opticCategories = useMemo(
    () => [
      "ALL",
      ...Array.from(new Set(ARCHIVE_OPTICS_DEVICES.map((o) => o.category))).sort(),
      "Night Vision (NVG)",
    ],
    []
  );

  const armorAndGearCategories = useMemo(
    () => [
      "ALL",
      ...Array.from(new Set(ARCHIVE_ARMOR.map((a) => a.category))).sort(),
      "Headset",
      "Explosive Grenade",
      "Smoke Grenade",
      "Stun Grenade",
      "Repair Kit",
      "Mortar Round",
      "Secure Lockbox",
    ],
    []
  );

  const medicalCategories = useMemo(
    () => [
      "ALL",
      ...Array.from(new Set(ARCHIVE_MEDICAL.map((m) => m.category))).sort(),
      "Food",
      "Drink",
    ],
    []
  );

  const filteredPatches = useMemo(() => {
    if (!q) return ARCHIVE_PATCH_NOTES;
    return ARCHIVE_PATCH_NOTES.filter(
      (p) =>
        p.version.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q) ||
        p.date.toLowerCase().includes(q) ||
        p.highlights.some((h) => h.toLowerCase().includes(q)) ||
        p.sections.some(
          (s) =>
            s.heading.toLowerCase().includes(q) ||
            s.items.some((it) => it.toLowerCase().includes(q))
        )
    );
  }, [q]);

  const filteredGuides = useMemo(() => {
    if (!q) return ARCHIVE_FIELD_GUIDES;
    return ARCHIVE_FIELD_GUIDES.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.topic.toLowerCase().includes(q) ||
        g.summary.toLowerCase().includes(q) ||
        g.bullets.some((b) => b.toLowerCase().includes(q)) ||
        g.keywords.some((k) => k.includes(q))
    );
  }, [q]);

  const filteredBosses = useMemo(() => {
    if (!q) return ARCHIVE_BOSSES;
    return ARCHIVE_BOSSES.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.fullName.toLowerCase().includes(q) ||
        b.region.toLowerCase().includes(q) ||
        b.faction.toLowerCase().includes(q) ||
        b.notableGear.some((g) => g.toLowerCase().includes(q)) ||
        b.spawnLocations.some((s) => s.toLowerCase().includes(q)) ||
        b.linkedTasks.some((t) => t.toLowerCase().includes(q))
    );
  }, [q]);

  const filteredFactions = useMemo(() => {
    if (!q) return ARCHIVE_FACTIONS;
    return ARCHIVE_FACTIONS.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q)
    );
  }, [q]);

  const filteredVendors = useMemo(() => {
    if (!q) return ARCHIVE_VENDORS;
    return ARCHIVE_VENDORS.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.fullName.toLowerCase().includes(q) ||
        v.sells.toLowerCase().includes(q) ||
        v.buys.toLowerCase().includes(q)
    );
  }, [q]);

  const filteredRegions = useMemo(() => {
    if (!q) return ARCHIVE_REGIONS;
    return ARCHIVE_REGIONS.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.enemies.toLowerCase().includes(q) ||
        r.lzCallsign.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
    );
  }, [q]);

  const filteredAmmo = useMemo(() => {
    return ARCHIVE_AMMO.filter((a) => {
      if (caliberFilter !== "ALL" && a.caliber !== caliberFilter) return false;
      if (!q) return true;
      return (
        a.name.toLowerCase().includes(q) ||
        a.caliber.toLowerCase().includes(q) ||
        a.soldBy.toLowerCase().includes(q) ||
        a.penetrationNote.toLowerCase().includes(q)
      );
    }).sort(
      (a, b) => b.penetrationTier - a.penetrationTier || a.name.localeCompare(b.name)
    );
  }, [caliberFilter, q]);

  const filteredOptics = useMemo(() => {
    if (opticFilter === "Night Vision (NVG)") return [];
    return ARCHIVE_OPTICS_DEVICES.filter((o) => {
      if (opticFilter !== "ALL" && o.category !== opticFilter) return false;
      if (!q) return true;
      return (
        o.name.toLowerCase().includes(q) ||
        o.category.toLowerCase().includes(q) ||
        (o.magnification || "").toLowerCase().includes(q) ||
        (o.modes || "").toLowerCase().includes(q) ||
        (o.manufacturer || "").toLowerCase().includes(q) ||
        o.soldBy.toLowerCase().includes(q)
      );
    });
  }, [opticFilter, q]);

  const filteredNvg = useMemo(() => {
    if (opticFilter !== "ALL" && opticFilter !== "Night Vision (NVG)") return [];
    if (!q) return ARCHIVE_NVG;
    return ARCHIVE_NVG.filter(
      (n) =>
        n.name.toLowerCase().includes(q) ||
        n.phosphor.toLowerCase().includes(q) ||
        n.soldBy.toLowerCase().includes(q)
    );
  }, [opticFilter, q]);

  const filteredArmor = useMemo(() => {
    return ARCHIVE_ARMOR.filter((a) => {
      if (
        armorTypeFilter !== "ALL" &&
        a.category !== armorTypeFilter
      ) {
        return false;
      }
      if (!q) return true;
      return (
        a.name.toLowerCase().includes(q) ||
        a.nijClass.toLowerCase().includes(q) ||
        a.material.toLowerCase().includes(q) ||
        a.coverage.toLowerCase().includes(q) ||
        a.soldBy.toLowerCase().includes(q)
      );
    });
  }, [armorTypeFilter, q]);

  const filteredUtility = useMemo(() => {
    return ARCHIVE_UTILITY.filter((u) => {
      if (armorTypeFilter !== "ALL" && u.category !== armorTypeFilter) {
        return false;
      }
      if (!q) return true;
      return (
        u.name.toLowerCase().includes(q) ||
        u.category.toLowerCase().includes(q) ||
        u.statSummary.toLowerCase().includes(q) ||
        u.soldBy.toLowerCase().includes(q)
      );
    });
  }, [armorTypeFilter, q]);

  const filteredMedical = useMemo(() => {
    if (medicalTypeFilter === "Food" || medicalTypeFilter === "Drink") return [];
    return ARCHIVE_MEDICAL.filter((m) => {
      if (medicalTypeFilter !== "ALL" && m.category !== medicalTypeFilter) return false;
      if (!q) return true;
      return (
        m.name.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.effect.toLowerCase().includes(q) ||
        m.soldBy.toLowerCase().includes(q)
      );
    });
  }, [medicalTypeFilter, q]);

  const filteredProvisions = useMemo(() => {
    return ARCHIVE_PROVISIONS.filter((p) => {
      if (
        medicalTypeFilter !== "ALL" &&
        medicalTypeFilter !== "Food" &&
        medicalTypeFilter !== "Drink"
      ) {
        return false;
      }
      if (
        (medicalTypeFilter === "Food" || medicalTypeFilter === "Drink") &&
        p.category !== medicalTypeFilter
      ) {
        return false;
      }
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.effect || "").toLowerCase().includes(q) ||
        p.soldBy.toLowerCase().includes(q)
      );
    });
  }, [medicalTypeFilter, q]);

  const filteredStorage = useMemo(() => {
    return ARCHIVE_STORAGE.filter((s) => {
      if (storageTypeFilter !== "ALL" && s.category !== storageTypeFilter) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.soldBy.toLowerCase().includes(q)
      );
    });
  }, [storageTypeFilter, q]);

  const filteredLootItems = useMemo(() => {
    if (!q) return ARCHIVE_LOOT_ITEMS;
    return ARCHIVE_LOOT_ITEMS.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q) ||
        (i.sellPrice || "").toLowerCase().includes(q)
    );
  }, [q]);

  const filteredLootContainers = useMemo(() => {
    if (!q) return ARCHIVE_LOOT_CONTAINERS;
    return ARCHIVE_LOOT_CONTAINERS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.layout.toLowerCase().includes(q)
    );
  }, [q]);

  const filteredSquadMissions = useMemo(() => {
    if (!q) return ARCHIVE_SQUAD_STRIKE;
    return ARCHIVE_SQUAD_STRIKE.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.vendor.toLowerCase().includes(q) ||
        m.location.toLowerCase().includes(q)
    );
  }, [q]);

  const filteredSquadItems = useMemo(() => {
    if (!q) return ARCHIVE_SQUAD_ITEMS;
    return ARCHIVE_SQUAD_ITEMS.filter((i) => i.name.toLowerCase().includes(q));
  }, [q]);

  const filteredXpLevels = useMemo(() => {
    if (!q) return ARCHIVE_XP_LEVELS;
    return ARCHIVE_XP_LEVELS.filter(
      (l) =>
        `level ${l.level}`.includes(q) ||
        l.rewards.some((r) => r.toLowerCase().includes(q))
    );
  }, [q]);

  const filteredIntelIndex = useMemo(() => {
    if (!q) return ARCHIVE_INTEL_INDEX;
    return ARCHIVE_INTEL_INDEX.filter(
      (x) =>
        x.name.toLowerCase().includes(q) || x.kind.toLowerCase().includes(q)
    );
  }, [q]);

  const tabHitCounts: Record<ArchiveTabId, number> = useMemo(
    () => ({
      patches: filteredPatches.length + filteredGuides.length,
      bosses:
        filteredBosses.length +
        filteredFactions.length +
        filteredVendors.length +
        filteredRegions.length,
      ammo: filteredAmmo.length,
      optics: filteredOptics.length + filteredNvg.length,
      armor: filteredArmor.length + filteredUtility.length,
      medical: filteredMedical.length + filteredProvisions.length,
      storage:
        filteredStorage.length +
        filteredLootItems.length +
        filteredLootContainers.length +
        filteredSquadMissions.length +
        filteredIntelIndex.length,
    }),
    [
      filteredPatches.length,
      filteredGuides.length,
      filteredBosses.length,
      filteredFactions.length,
      filteredVendors.length,
      filteredRegions.length,
      filteredAmmo.length,
      filteredOptics.length,
      filteredNvg.length,
      filteredArmor.length,
      filteredUtility.length,
      filteredMedical.length,
      filteredProvisions.length,
      filteredStorage.length,
      filteredLootItems.length,
      filteredLootContainers.length,
      filteredSquadMissions.length,
      filteredIntelIndex.length,
    ]
  );

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#0e131b]">
      {/* Header + Category Switcher */}
      <div className="px-4 sm:px-6 py-4 border-b border-white/[0.075] bg-[#0a0e14]/70 space-y-3 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <BookOpen className="w-4.5 h-4.5 text-[#e5a93c]" />
              <h1 className="font-display text-base sm:text-lg font-semibold text-[#f8fafc]">
                Field Archive &amp; Ballistics Library
              </h1>
              <span className="text-xs text-[#7dd3fc] font-medium">
                Live Patch 0.5.1.1 · Offline Archive
              </span>
            </div>
            <p className="text-xs text-[#8899ae] mt-0.5">
              Complete built-in reference covering Update 0.5.0.0–0.5.1.1 changelogs, bosses, ballistics, optics, repair kits, game modes, loot, Squad Strike, and XP — searchable offline and by Tactical Intel Bot.
            </p>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#7f8ea1] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search 0.5.1.1 patches, bosses, optics, ammo…"
              aria-label="Search Field Archive"
              className="w-full min-h-[44px] sm:min-h-[40px] pl-9 pr-3 py-1.5 rounded-xl bg-[#0e131b] border border-white/[0.1] focus:border-[#38bdf8] text-[16px] sm:text-xs text-[#f8fafc] placeholder-[#64748b] focus:outline-none"
            />
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
          {(
            [
              {
                id: "patches",
                label: "Patches & Manuals",
                total: ARCHIVE_PATCH_NOTES.length + ARCHIVE_FIELD_GUIDES.length,
                icon: Sparkles,
              },
              {
                id: "bosses",
                label: "Bosses & Factions",
                total: ARCHIVE_BOSSES.length,
                icon: Skull,
              },
              {
                id: "ammo",
                label: "Ammo & Ballistics",
                total: ARCHIVE_AMMO.length,
                icon: Crosshair,
              },
              {
                id: "optics",
                label: "Optics & NVGs",
                total: ARCHIVE_OPTICS_DEVICES.length + ARCHIVE_NVG.length,
                icon: Eye,
              },
              {
                id: "armor",
                label: "Armor, Gear & Repair",
                total: ARCHIVE_ARMOR.length + ARCHIVE_UTILITY.length,
                icon: Shield,
              },
              {
                id: "medical",
                label: "Medical & Provisions",
                total: ARCHIVE_MEDICAL.length + ARCHIVE_PROVISIONS.length,
                icon: HeartPulse,
              },
              {
                id: "storage",
                label: "Loot, Squad & XP",
                total:
                  ARCHIVE_STORAGE.length +
                  ARCHIVE_LOOT_ITEMS.length +
                  ARCHIVE_SQUAD_STRIKE.length,
                icon: Package,
              },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            const shownCount = q ? tabHitCounts[tab.id] : tab.total;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`min-h-[38px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? "bg-[#141b26] border-[#e5a93c]/60 text-[#f8fafc]"
                    : "bg-[#0e131b] border-white/[0.08] text-[#8b98a9] hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-[#e5a93c]" />
                <span>{tab.label}</span>
                <span className="font-mono-tabular text-[11px] text-[#7f8ea1]">
                  ({shownCount})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Scrollable Content Body */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {activeTab === "patches" && (
            <div className="space-y-6">
              {/* Patch Notes Timeline */}
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h2 className="font-display text-sm font-semibold text-[#f8fafc]">
                    Update 0.5 (Rogue Ops) through 0.5.1.1 &amp; Upcoming 0.5.2.0
                  </h2>
                  {onAskAi && (
                    <button
                      type="button"
                      onClick={() => onAskAi("What changed in patch 0.5.1.0 and 0.5.1.1?")}
                      className="text-xs font-medium text-[#7dd3fc] hover:text-white transition-colors"
                    >
                      Ask AI Intel about 0.5.1.0–0.5.1.1 →
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {filteredPatches.map((patch) => (
                    <article
                      key={patch.version}
                      className="rounded-2xl bg-[#111722] border border-white/[0.08] p-5 flex flex-col justify-between gap-4"
                    >
                      <div className="space-y-3">
                        <div>
                          <div className="text-[11px] font-mono-tabular text-[#e5a93c]">
                            Patch {patch.version} · {patch.date}
                          </div>
                          <h3 className="font-display text-base font-semibold text-[#f8fafc] mt-0.5">
                            {patch.title}
                          </h3>
                        </div>

                        <ul className="space-y-2 text-xs text-[#dbe4ef] leading-relaxed">
                          {patch.highlights.map((h, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-[#e5a93c] font-bold shrink-0">•</span>
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>

                        {patch.sections.length > 0 && (
                          <div className="pt-2 border-t border-white/[0.06] space-y-2">
                            {patch.sections.map((sec) => (
                              <div key={sec.heading} className="space-y-1">
                                <div className="text-[11px] font-semibold text-[#7dd3fc]">
                                  {sec.heading}
                                </div>
                                <ul className="space-y-1 text-[11px] text-[#9fb0c4] leading-relaxed">
                                  {sec.items.map((it, idx) => (
                                    <li key={idx}>– {it}</li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {onAskAi && (
                        <div className="pt-2 border-t border-white/[0.06] flex justify-end">
                          <button
                            type="button"
                            onClick={() => onAskAi(`Summarize Patch ${patch.version}`)}
                            className="text-[11px] font-semibold text-[#7dd3fc] hover:text-white transition-colors"
                          >
                            Ask AI Intel about {patch.version} →
                          </button>
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </div>

              {/* Tactical Field Manuals */}
              <div className="space-y-3">
                <h2 className="font-display text-sm font-semibold text-[#f8fafc]">
                  Tactical Field Manuals &amp; Game Systems
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {filteredGuides.map((guide) => (
                    <article
                      key={guide.id}
                      className="rounded-2xl bg-[#111722] border border-white/[0.08] p-5 flex flex-col justify-between gap-4"
                    >
                      <div className="space-y-3">
                        <div>
                          <div className="text-[11px] font-medium text-[#38bdf8]">
                            {guide.topic}
                          </div>
                          <h3 className="font-display text-base font-semibold text-[#f8fafc] mt-0.5">
                            {guide.title}
                          </h3>
                        </div>
                        <p className="text-xs text-[#9fb0c4] leading-relaxed">
                          {guide.summary}
                        </p>
                        <ul className="space-y-2 text-xs text-[#dbe4ef] leading-relaxed">
                          {guide.bullets.map((b, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-[#e5a93c] font-bold shrink-0">•</span>
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {onAskAi && (
                        <div className="pt-2 border-t border-white/[0.06] flex justify-end">
                          <button
                            type="button"
                            onClick={() => onAskAi(`Explain ${guide.title}`)}
                            className="text-[11px] font-semibold text-[#7dd3fc] hover:text-white transition-colors"
                          >
                            Ask AI Intel about this →
                          </button>
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "bosses" && (
            <div className="space-y-6">
              {/* Bosses */}
              <div className="space-y-3">
                <h2 className="font-display text-sm font-semibold text-[#f8fafc]">
                  Lamang Bosses, Spawns &amp; Unique Gear ({filteredBosses.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {filteredBosses.map((boss) => (
                    <div
                      key={boss.id}
                      className="rounded-xl bg-[#111722] border border-white/[0.08] p-4 space-y-2.5 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-sm font-semibold text-[#f8fafc]">
                              {boss.name}
                            </div>
                            <div className="text-[11px] text-[#8899ae]">
                              {boss.region} · {boss.faction}
                            </div>
                          </div>
                          {boss.fullName !== "Unknown" && (
                            <span className="text-[11px] text-[#7dd3fc] text-right">
                              {boss.fullName}
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-[#dbe4ef] space-y-1">
                          <div>
                            <span className="text-[#8899ae]">Spawns: </span>
                            {boss.spawnLocations.join(" · ")}
                          </div>
                          <div>
                            <span className="text-[#8899ae]">Unique Gear: </span>
                            <span className="text-[#fde68a]">
                              {boss.notableGear.join(", ")}
                            </span>
                          </div>
                          <div>
                            <span className="text-[#8899ae]">Tasks: </span>
                            {boss.linkedTasks.join(", ")}
                          </div>
                        </div>
                      </div>

                      {onAskAi && (
                        <div className="pt-2 border-t border-white/[0.06] flex justify-end">
                          <button
                            type="button"
                            onClick={() => onAskAi(`Where does ${boss.name} spawn and what gear do they drop?`)}
                            className="text-[11px] font-semibold text-[#7dd3fc] hover:text-white transition-colors"
                          >
                            Ask AI Intel →
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Vendors & Factions & Regions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h2 className="font-display text-sm font-semibold text-[#f8fafc]">
                    Vendors &amp; Trading Specializations ({filteredVendors.length})
                  </h2>
                  <div className="space-y-2">
                    {filteredVendors.map((v) => (
                      <div
                        key={v.id}
                        className="rounded-xl bg-[#111722] border border-white/[0.08] p-3.5 space-y-1"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-[#f8fafc]">
                            {v.name}
                          </span>
                          <span className="text-[11px] text-[#e5a93c]">
                            {v.fullName}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#cbd5e1]">
                          <span className="text-[#8899ae]">Sells: </span>
                          {v.sells}
                        </div>
                        <div className="text-[11px] text-[#9fb0c4]">
                          <span className="text-[#8899ae]">Buys: </span>
                          {v.buys}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h2 className="font-display text-sm font-semibold text-[#f8fafc]">
                    Factions &amp; Organizations ({filteredFactions.length})
                  </h2>
                  <div className="space-y-2">
                    {filteredFactions.map((f) => (
                      <div
                        key={f.id}
                        className="rounded-xl bg-[#111722] border border-white/[0.08] p-3.5 space-y-1"
                      >
                        <div className="text-xs font-semibold text-[#f8fafc]">
                          {f.name}
                        </div>
                        <p className="text-[11px] text-[#9fb0c4] leading-relaxed">
                          {f.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Regions */}
              <div className="space-y-3">
                <h2 className="font-display text-sm font-semibold text-[#f8fafc]">
                  Lamang Regions &amp; LZs ({filteredRegions.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {filteredRegions.map((r) => (
                    <div
                      key={r.id}
                      className="rounded-xl bg-[#111722] border border-white/[0.08] p-3.5 space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-[#f8fafc]">
                          {r.name}
                        </span>
                        <span className="font-mono-tabular text-[11px] text-[#e5a93c]">
                          Tier {r.tier} · {r.enemies}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#7dd3fc] font-mono-tabular">
                        LZs: {r.lzCallsign || "—"}
                      </div>
                      <p className="text-[11px] text-[#9fb0c4] leading-relaxed">
                        {r.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "ammo" && (
            <div className="space-y-4">
              <div className="flex items-center gap-1.5 flex-wrap">
                {calibers.map((cal) => (
                  <button
                    key={cal}
                    type="button"
                    onClick={() => setCaliberFilter(cal)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 ${
                      caliberFilter === cal
                        ? "bg-[#e5a93c]/15 border-[#e5a93c]/55 text-[#fde68a]"
                        : "bg-[#0a0e14] border-white/[0.08] text-[#8b98a9] hover:text-white"
                    }`}
                  >
                    {cal === "ALL" ? "All Calibers" : cal}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {filteredAmmo.map((round) => {
                  const badge = PEN_TIER_LABEL[round.penetrationTier] || PEN_TIER_LABEL[1];
                  return (
                    <div
                      key={round.id}
                      className="rounded-xl bg-[#111722] border border-white/[0.08] p-3.5 space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-xs font-semibold text-[#f8fafc]">
                            {round.name}
                          </div>
                          <div className="text-[11px] text-[#7f8ea1]">{round.caliber}</div>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded border text-[10px] font-semibold shrink-0 ${badge.cls}`}
                        >
                          {badge.label}
                        </span>
                      </div>

                      <div className="text-[11px] text-[#9fb0c4]">
                        {round.penetrationNote}
                      </div>

                      <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-white/[0.06] text-[11px] font-mono-tabular">
                        <div className="text-[#8899ae]">
                          Velocity:{" "}
                          <span className="text-[#e2e8f0]">
                            {round.muzzleVelocity || "—"}
                          </span>
                        </div>
                        <div className="text-[#8899ae]">
                          Acc Mod:{" "}
                          <span className="text-[#e2e8f0]">
                            {round.accuracyMod || "0%"}
                          </span>
                        </div>
                        <div className="text-[#8899ae] col-span-2 truncate">
                          Vendor:{" "}
                          <span className="text-[#fde68a]">
                            {round.soldBy}
                            {round.buyPrice ? ` · ${round.buyPrice}` : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "optics" && (
            <div className="space-y-6">
              <div className="flex items-center gap-1.5 flex-wrap">
                {opticCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setOpticFilter(cat)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 ${
                      opticFilter === cat
                        ? "bg-[#e5a93c]/15 border-[#e5a93c]/55 text-[#fde68a]"
                        : "bg-[#0a0e14] border-white/[0.08] text-[#8b98a9] hover:text-white"
                    }`}
                  >
                    {cat === "ALL" ? "All Optics & Devices" : cat}
                  </button>
                ))}
              </div>

              {filteredOptics.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {filteredOptics.map((opt) => (
                    <div
                      key={opt.id}
                      className="rounded-xl bg-[#111722] border border-white/[0.08] p-3.5 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-xs font-semibold text-[#f8fafc]">
                            {opt.name}
                          </div>
                          <div className="text-[11px] text-[#7f8ea1]">
                            {opt.category}
                            {opt.manufacturer ? ` · ${opt.manufacturer}` : ""}
                          </div>
                        </div>
                        {opt.magnification && (
                          <span className="text-[11px] font-mono-tabular font-semibold text-[#7dd3fc] shrink-0">
                            {opt.magnification}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-white/[0.06] text-[11px] font-mono-tabular">
                        <div className="text-[#8899ae]">
                          Range:{" "}
                          <span className="text-[#e2e8f0]">
                            {opt.sightingRange || opt.modes || "—"}
                          </span>
                        </div>
                        <div className="text-[#8899ae]">
                          Handling:{" "}
                          <span className="text-[#e2e8f0]">
                            {opt.handlingMod || "0%"}
                          </span>
                        </div>
                        <div className="text-[#8899ae] col-span-2 truncate">
                          Vendor:{" "}
                          <span className="text-[#fde68a]">
                            {opt.soldBy}
                            {opt.buyPrice ? ` · ${opt.buyPrice}` : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {filteredNvg.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-[#34d399]" />
                    <h2 className="font-display text-sm font-semibold text-[#f8fafc]">
                      Night Vision Devices (NVGs)
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {filteredNvg.map((nvg) => (
                      <div
                        key={nvg.id}
                        className="rounded-xl bg-[#111722] border border-white/[0.08] p-3.5 space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="text-xs font-semibold text-[#f8fafc]">
                            {nvg.name}
                          </div>
                          <span className="text-[11px] font-semibold text-[#34d399] shrink-0">
                            {nvg.phosphor}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono-tabular">
                          <div className="text-[#8899ae]">
                            FOM: <span className="text-[#e2e8f0]">{nvg.fom}</span>
                          </div>
                          <div className="text-[#8899ae]">
                            FOV: <span className="text-[#e2e8f0]">{nvg.fov}</span>
                          </div>
                          <div className="text-[#8899ae] col-span-2">
                            Vendor:{" "}
                            <span className="text-[#fde68a]">
                              {nvg.soldBy}
                              {nvg.buyPrice ? ` · ${nvg.buyPrice}` : ""}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "armor" && (
            <div className="space-y-5">
              <div className="flex items-center gap-1.5 flex-wrap">
                {armorAndGearCategories.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setArmorTypeFilter(t)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 ${
                      armorTypeFilter === t
                        ? "bg-[#e5a93c]/15 border-[#e5a93c]/55 text-[#fde68a]"
                        : "bg-[#0a0e14] border-white/[0.08] text-[#8b98a9] hover:text-white"
                    }`}
                  >
                    {t === "ALL" ? "All Protection & Utility" : t}
                  </button>
                ))}
              </div>

              {filteredUtility.length > 0 && (
                <div className="space-y-2.5">
                  <h2 className="font-display text-sm font-semibold text-[#f8fafc]">
                    Headsets, Throwables, Repair Kits, Mortars &amp; Lockboxes ({filteredUtility.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {filteredUtility.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-xl bg-[#111722] border border-white/[0.08] p-3.5 space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-xs font-semibold text-[#f8fafc]">
                              {item.name}
                            </div>
                            <div className="text-[11px] text-[#7dd3fc]">{item.category}</div>
                          </div>
                          {item.weight && (
                            <span className="font-mono-tabular text-[11px] text-[#8899ae] shrink-0">
                              {item.weight}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#dbe4ef]">{item.statSummary}</div>
                        <div className="pt-1 border-t border-white/[0.06] text-[11px] text-[#fde68a] truncate">
                          {item.soldBy}
                          {item.buyPrice ? ` · Buy ${item.buyPrice}` : ""}
                          {item.sellPrice ? ` · Sell ${item.sellPrice}` : ""}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredArmor.length > 0 && (
                <div className="space-y-2.5">
                  <h2 className="font-display text-sm font-semibold text-[#f8fafc]">
                    Plate Carriers, Armor Vests &amp; Helmets ({filteredArmor.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {filteredArmor.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-xl bg-[#111722] border border-white/[0.08] p-3.5 space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-xs font-semibold text-[#f8fafc]">
                              {item.name}
                            </div>
                            <div className="text-[11px] text-[#7f8ea1]">
                              {item.category} · {item.material}
                            </div>
                          </div>
                          <span className="font-mono-tabular text-[11px] font-semibold text-[#7dd3fc] shrink-0">
                            {item.nijClass}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-1.5 pt-1.5 border-t border-white/[0.06] text-[11px]">
                          <div className="text-[#8899ae]">
                            Coverage: <span className="text-[#e2e8f0]">{item.coverage}</span>
                          </div>
                          <div className="text-[#8899ae] font-mono-tabular">
                            Weight: <span className="text-[#e2e8f0]">{item.weight || "—"}</span>
                          </div>
                          <div className="text-[#8899ae] col-span-2 truncate">
                            Source:{" "}
                            <span className="text-[#fde68a]">
                              {item.soldBy}
                              {item.buyPrice ? ` · ${item.buyPrice}` : ""}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "medical" && (
            <div className="space-y-5">
              <div className="flex items-center gap-1.5 flex-wrap">
                {medicalCategories.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setMedicalTypeFilter(t)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 ${
                      medicalTypeFilter === t
                        ? "bg-[#e5a93c]/15 border-[#e5a93c]/55 text-[#fde68a]"
                        : "bg-[#0a0e14] border-white/[0.08] text-[#8b98a9] hover:text-white"
                    }`}
                  >
                    {t === "ALL" ? "All Medical & Provisions" : t}
                  </button>
                ))}
              </div>

              {filteredMedical.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {filteredMedical.map((med) => (
                    <div
                      key={med.id}
                      className="rounded-xl bg-[#111722] border border-white/[0.08] p-3.5 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-xs font-semibold text-[#f8fafc]">
                            {med.name}
                          </div>
                          <div className="text-[11px] text-[#34d399] font-medium">
                            {med.category}
                          </div>
                        </div>
                        {med.charges && (
                          <span className="text-[11px] font-mono-tabular text-[#cbd5e1]">
                            {med.charges} uses
                          </span>
                        )}
                      </div>

                      <div className="flex items-start gap-1.5 text-[11px] text-[#dbe4ef] leading-relaxed">
                        <Activity className="w-3.5 h-3.5 text-[#e5a93c] shrink-0 mt-0.5" />
                        <span>{med.effect}</span>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-white/[0.06] text-[11px]">
                        <span className="text-[#fde68a] truncate">
                          {med.soldBy}
                          {med.buyPrice ? ` · ${med.buyPrice}` : ""}
                        </span>
                        {med.duration && (
                          <span className="font-mono-tabular text-[#8899ae] shrink-0">
                            {med.duration}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {filteredProvisions.length > 0 && (
                <div className="space-y-2.5">
                  <h2 className="font-display text-sm font-semibold text-[#f8fafc]">
                    Food, Drinks &amp; Energy Provisions ({filteredProvisions.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {filteredProvisions.map((p) => (
                      <div
                        key={p.id}
                        className="rounded-xl bg-[#111722] border border-white/[0.08] p-3.5 space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-xs font-semibold text-[#f8fafc]">
                              {p.name}
                            </div>
                            <div className="text-[11px] text-[#7dd3fc]">{p.category}</div>
                          </div>
                          {p.charges && (
                            <span className="font-mono-tabular text-[11px] text-[#cbd5e1]">
                              {p.charges} uses
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#dbe4ef] font-mono-tabular">
                          {[
                            p.energy ? `Energy ${p.energy}` : null,
                            p.hydration ? `Hydration ${p.hydration}` : null,
                            p.effect,
                          ]
                            .filter(Boolean)
                            .join(" · ") || "Field ration"}
                        </div>
                        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/[0.06]">
                          <span className="text-[#fde68a] truncate">
                            {p.soldBy}
                            {p.buyPrice ? ` · ${p.buyPrice}` : ""}
                          </span>
                          {p.gridSize && (
                            <span className="font-mono-tabular text-[#8899ae]">
                              {p.gridSize}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "storage" && (
            <div className="space-y-5">
              {/* Sub-view selector */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {(
                  [
                    { id: "storage", label: `Backpacks, Rigs & Cases (${filteredStorage.length})` },
                    { id: "loot", label: `Valuables, Loot & Containers (${filteredLootItems.length})` },
                    { id: "squad", label: `Squad Strike (${filteredSquadMissions.length})` },
                    { id: "xp", label: `XP & Ranks (Lv.1–50)` },
                    { id: "intel", label: `Intels & Evidence (${filteredIntelIndex.length})` },
                  ] as const
                ).map((sv) => (
                  <button
                    key={sv.id}
                    type="button"
                    onClick={() => setStorageSubView(sv.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 ${
                      storageSubView === sv.id
                        ? "bg-[#e5a93c]/15 border-[#e5a93c]/55 text-[#fde68a]"
                        : "bg-[#0a0e14] border-white/[0.08] text-[#8b98a9] hover:text-white"
                    }`}
                  >
                    {sv.label}
                  </button>
                ))}
              </div>

              {storageSubView === "storage" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {["ALL", "Backpack", "Chest Rig", "Stash Container"].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setStorageTypeFilter(cat)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                          storageTypeFilter === cat
                            ? "bg-[#38bdf8]/15 border-[#38bdf8]/55 text-[#7dd3fc]"
                            : "bg-[#0a0e14] border-white/[0.08] text-[#8b98a9] hover:text-white"
                        }`}
                      >
                        {cat === "ALL" ? "All Storage" : `${cat}s`}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {filteredStorage.map((st) => (
                      <div
                        key={st.id}
                        className="rounded-xl bg-[#111722] border border-white/[0.08] p-3.5 space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-xs font-semibold text-[#f8fafc]">
                              {st.name}
                            </div>
                            <div className="text-[11px] text-[#7f8ea1]">{st.category}</div>
                          </div>
                          {st.capacity !== null && (
                            <span className="font-mono-tabular text-[11px] font-semibold text-[#7dd3fc] shrink-0">
                              {st.capacity} slots
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/[0.06]">
                          <span className="text-[#fde68a] truncate">
                            {st.soldBy}
                            {st.buyPrice ? ` · ${st.buyPrice}` : ""}
                          </span>
                          {st.gridSize && (
                            <span className="font-mono-tabular text-[#8899ae] shrink-0">
                              Size {st.gridSize}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {storageSubView === "loot" && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h2 className="font-display text-sm font-semibold text-[#f8fafc]">
                      High-Value Loot, Jewellery &amp; Trade Items (Sorted by Sell Value)
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                      {filteredLootItems.slice(0, 90).map((item) => (
                        <div
                          key={item.id}
                          className="rounded-xl bg-[#111722] border border-white/[0.08] p-3.5 space-y-1.5"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="text-xs font-semibold text-[#f8fafc]">
                                {item.name}
                              </div>
                              <div className="text-[11px] text-[#7f8ea1]">{item.category}</div>
                            </div>
                            {item.sellPrice && (
                              <span className="font-mono-tabular text-xs font-semibold text-[#34d399] shrink-0">
                                {item.sellPrice}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between text-[11px] font-mono-tabular text-[#8899ae] pt-1 border-t border-white/[0.06]">
                            <span>
                              {item.gridSize || "—"}
                              {item.weight ? ` · ${item.weight}` : ""}
                            </span>
                            {item.pricePerCell && (
                              <span className="text-[#fde68a]">
                                {item.pricePerCell}/cell
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h2 className="font-display text-sm font-semibold text-[#f8fafc]">
                      World Loot Containers &amp; Safes ({filteredLootContainers.length})
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5">
                      {filteredLootContainers.map((c) => (
                        <div
                          key={c.id}
                          className="rounded-xl bg-[#111722] border border-white/[0.08] px-3.5 py-2.5 flex items-center justify-between gap-2"
                        >
                          <span className="text-xs font-medium text-[#f8fafc] truncate">
                            {c.name}
                          </span>
                          <span className="font-mono-tabular text-[11px] text-[#7dd3fc] shrink-0">
                            {c.layout}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {storageSubView === "squad" && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h2 className="font-display text-sm font-semibold text-[#f8fafc]">
                      Squad Strike Missions ({filteredSquadMissions.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                      {filteredSquadMissions.map((m) => (
                        <div
                          key={m.id}
                          className="rounded-xl bg-[#111722] border border-white/[0.08] p-3.5 flex items-center justify-between gap-2"
                        >
                          <div>
                            <div className="text-xs font-semibold text-[#f8fafc]">
                              {m.name}
                            </div>
                            <div className="text-[11px] text-[#8899ae]">{m.location}</div>
                          </div>
                          <span className="text-[11px] font-semibold text-[#e5a93c] shrink-0">
                            {m.vendor}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h2 className="font-display text-sm font-semibold text-[#f8fafc]">
                      Squad Strike Mission Items ({filteredSquadItems.length})
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                      {filteredSquadItems.map((it) => (
                        <div
                          key={it.id}
                          className="rounded-xl bg-[#111722] border border-white/[0.08] px-3.5 py-2.5 flex items-center justify-between gap-2"
                        >
                          <span className="text-xs text-[#f8fafc] truncate">{it.name}</span>
                          <span className="font-mono-tabular text-[11px] text-[#8899ae] shrink-0">
                            {it.gridSize || "—"}
                            {it.weight ? ` · ${it.weight}` : ""}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {storageSubView === "xp" && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-[#e5a93c]" />
                      <h2 className="font-display text-sm font-semibold text-[#f8fafc]">
                        XP Granting Combat, Exploration &amp; COP Actions
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {ARCHIVE_XP_ACTIONS.map((a) => (
                        <div
                          key={a.id}
                          className="rounded-xl bg-[#111722] border border-white/[0.08] p-3.5 flex items-center justify-between gap-2"
                        >
                          <div>
                            <div className="text-xs font-semibold text-[#f8fafc]">
                              {a.action}
                            </div>
                            <div className="text-[11px] text-[#7f8ea1]">{a.category}</div>
                          </div>
                          <span className="font-mono-tabular text-xs font-semibold text-[#34d399] shrink-0">
                            +{a.xp} XP
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h2 className="font-display text-sm font-semibold text-[#f8fafc]">
                      Character Rank Thresholds &amp; Apparel Unlocks (Level 1–50)
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2.5">
                      {filteredXpLevels.map((l) => (
                        <div
                          key={l.level}
                          className="rounded-xl bg-[#111722] border border-white/[0.08] p-3 space-y-1"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-[#f8fafc]">
                              Level {l.level}
                            </span>
                            <span className="font-mono-tabular text-[#e5a93c]">
                              {l.threshold.toLocaleString()} XP
                            </span>
                          </div>
                          <div className="text-[11px] text-[#9fb0c4]">
                            {l.rewards.length > 0
                              ? l.rewards.join(", ")
                              : "No apparel unlock at this level"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {storageSubView === "intel" && (
                <div className="space-y-3">
                  <h2 className="font-display text-sm font-semibold text-[#f8fafc]">
                    Intels, Newspapers, Evidence &amp; Military Equipment ({filteredIntelIndex.length})
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {filteredIntelIndex.slice(0, 120).map((it) => (
                      <div
                        key={`${it.kind}-${it.id}`}
                        className="rounded-xl bg-[#111722] border border-white/[0.08] px-3.5 py-2.5 flex items-center justify-between gap-2"
                      >
                        <span className="text-xs text-[#f8fafc] truncate">{it.name}</span>
                        <span className="text-[11px] text-[#7dd3fc] shrink-0">{it.kind}</span>
                      </div>
                    ))}
                  </div>
                  {filteredIntelIndex.length > 120 && (
                    <p className="text-xs text-[#8899ae]">
                      Showing first 120 of {filteredIntelIndex.length} entries — narrow with the search box above.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
