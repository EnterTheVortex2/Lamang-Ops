import {
  Activity,
  BookOpen,
  Crosshair,
  Eye,
  HeartPulse,
  Package,
  Search,
  Shield,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  ARCHIVE_AMMO,
  ARCHIVE_ARMOR,
  ARCHIVE_FIELD_GUIDES,
  ARCHIVE_MEDICAL,
  ARCHIVE_NVG,
  ARCHIVE_STORAGE,
} from "../data/fieldArchiveData";

type ArchiveTabId = "guides" | "ammo" | "armor" | "medical" | "gear";

interface FieldArchivePanelProps {
  onAskAi?: (prompt: string) => void;
}

const PEN_TIER_BADGE: Record<number, { label: string; cls: string }> = {
  4: {
    label: "Tier 4 · Top AP",
    cls: "bg-red-500/15 border-red-500/40 text-red-300",
  },
  3: {
    label: "Tier 3 · Mid-High AP",
    cls: "bg-[#e5a93c]/15 border-[#e5a93c]/40 text-[#fde68a]",
  },
  2: {
    label: "Tier 2 · Standard",
    cls: "bg-[#38bdf8]/15 border-[#38bdf8]/40 text-[#7dd3fc]",
  },
  1: {
    label: "Tier 1 · Flesh / Soft",
    cls: "bg-white/[0.06] border-white/[0.12] text-[#cbd5e1]",
  },
};

export function FieldArchivePanel({ onAskAi }: FieldArchivePanelProps) {
  const [activeTab, setActiveTab] = useState<ArchiveTabId>("guides");
  const [search, setSearch] = useState("");
  const [caliberFilter, setCaliberFilter] = useState("ALL");
  const [armorTypeFilter, setArmorTypeFilter] = useState("ALL");
  const [medicalTypeFilter, setMedicalTypeFilter] = useState("ALL");
  const [storageTypeFilter, setStorageTypeFilter] = useState("ALL");

  const q = search.trim().toLowerCase();

  const calibers = useMemo(
    () => ["ALL", ...Array.from(new Set(ARCHIVE_AMMO.map((a) => a.caliber))).sort()],
    []
  );

  const armorTypes = useMemo(
    () => ["ALL", ...Array.from(new Set(ARCHIVE_ARMOR.map((a) => a.category))).sort()],
    []
  );

  const medicalTypes = useMemo(
    () => ["ALL", ...Array.from(new Set(ARCHIVE_MEDICAL.map((m) => m.category))).sort()],
    []
  );

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
    }).sort((a, b) => b.penetrationTier - a.penetrationTier || a.name.localeCompare(b.name));
  }, [caliberFilter, q]);

  const filteredArmor = useMemo(() => {
    return ARCHIVE_ARMOR.filter((a) => {
      if (armorTypeFilter !== "ALL" && a.category !== armorTypeFilter) return false;
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

  const filteredMedical = useMemo(() => {
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

  const filteredNvg = useMemo(() => {
    if (!q) return ARCHIVE_NVG;
    return ARCHIVE_NVG.filter(
      (n) =>
        n.name.toLowerCase().includes(q) ||
        n.phosphor.toLowerCase().includes(q) ||
        n.soldBy.toLowerCase().includes(q)
    );
  }, [q]);

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

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#0e131b]">
      {/* Header + Category Switcher */}
      <div className="px-4 sm:px-6 py-4 border-b border-white/[0.075] bg-[#0a0e14]/70 space-y-3 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4.5 h-4.5 text-[#e5a93c]" />
              <h1 className="font-display text-base sm:text-lg font-semibold text-[#f8fafc]">
                Field Archive &amp; Ballistics Library
              </h1>
              <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/35 text-[10px] font-semibold text-emerald-300">
                Built-In Offline 0.5 Data
              </span>
            </div>
            <p className="text-xs text-[#8899ae] mt-0.5">
              Complete Update 0.5 reference library for ammo penetration, armor classes, trauma care, NVGs, storage cases, and field manuals — searchable offline and by AI Intel.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#7f8ea1] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ammo, NIJ armor, stims, NVGs…"
              className="w-full min-h-[40px] pl-9 pr-3 py-1.5 rounded-xl bg-[#0e131b] border border-white/[0.1] focus:border-[#38bdf8] text-xs text-[#f8fafc] placeholder-[#64748b] focus:outline-none"
            />
          </div>
        </div>

        {/* Sub-Navigation Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
          {(
            [
              { id: "guides", label: `Field Manuals (${ARCHIVE_FIELD_GUIDES.length})`, icon: BookOpen },
              { id: "ammo", label: `Ammo & Ballistics (${ARCHIVE_AMMO.length})`, icon: Crosshair },
              { id: "armor", label: `Armor & Helmets (${ARCHIVE_ARMOR.length})`, icon: Shield },
              { id: "medical", label: `Medical & Stims (${ARCHIVE_MEDICAL.length})`, icon: HeartPulse },
              { id: "gear", label: `NVGs & Storage (${ARCHIVE_NVG.length + ARCHIVE_STORAGE.length})`, icon: Package },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
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
              </button>
            );
          })}
        </div>
      </div>

      {/* Scrollable Content Body */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6">
        <div className="max-w-7xl mx-auto space-y-5">
          {activeTab === "guides" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredGuides.map((guide) => (
                <article
                  key={guide.id}
                  className="rounded-2xl bg-[#111722] border border-white/[0.08] p-5 flex flex-col justify-between gap-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-[#38bdf8]">
                          {guide.topic}
                        </span>
                        <h2 className="font-display text-base font-semibold text-[#f8fafc] mt-0.5">
                          {guide.title}
                        </h2>
                      </div>
                    </div>
                    <p className="text-xs text-[#9fb0c4] leading-relaxed">{guide.summary}</p>
                    <ul className="space-y-2 text-xs text-[#dbe4ef] leading-relaxed">
                      {guide.bullets.map((b, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#e5a93c] mt-1.5 shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {onAskAi && (
                    <div className="pt-2 border-t border-white/[0.06] flex justify-end">
                      <button
                        type="button"
                        onClick={() => onAskAi(`Explain ${guide.title} in detail`)}
                        className="text-[11px] font-semibold text-[#7dd3fc] hover:text-white transition-colors"
                      >
                        Ask AI Intel about this →
                      </button>
                    </div>
                  )}
                </article>
              ))}
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
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
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
                  const badge = PEN_TIER_BADGE[round.penetrationTier] || PEN_TIER_BADGE[1];
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

                      <div className="text-[11px] text-[#9fb0c4]">{round.penetrationNote}</div>

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

          {activeTab === "armor" && (
            <div className="space-y-4">
              <div className="flex items-center gap-1.5 flex-wrap">
                {armorTypes.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setArmorTypeFilter(t)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      armorTypeFilter === t
                        ? "bg-[#e5a93c]/15 border-[#e5a93c]/55 text-[#fde68a]"
                        : "bg-[#0a0e14] border-white/[0.08] text-[#8b98a9] hover:text-white"
                    }`}
                  >
                    {t === "ALL" ? "All Protection Gear" : t}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {filteredArmor.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl bg-[#111722] border border-white/[0.08] p-3.5 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs font-semibold text-[#f8fafc]">{item.name}</div>
                        <div className="text-[11px] text-[#7f8ea1]">
                          {item.category} · {item.material}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-[#38bdf8]/15 border border-[#38bdf8]/40 text-[10px] font-semibold text-[#7dd3fc] shrink-0">
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

          {activeTab === "medical" && (
            <div className="space-y-4">
              <div className="flex items-center gap-1.5 flex-wrap">
                {medicalTypes.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setMedicalTypeFilter(t)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      medicalTypeFilter === t
                        ? "bg-[#e5a93c]/15 border-[#e5a93c]/55 text-[#fde68a]"
                        : "bg-[#0a0e14] border-white/[0.08] text-[#8b98a9] hover:text-white"
                    }`}
                  >
                    {t === "ALL" ? "All Medical Items" : t}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {filteredMedical.map((med) => (
                  <div
                    key={med.id}
                    className="rounded-xl bg-[#111722] border border-white/[0.08] p-3.5 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs font-semibold text-[#f8fafc]">{med.name}</div>
                        <div className="text-[11px] text-[#34d399] font-medium">
                          {med.category}
                        </div>
                      </div>
                      {med.charges && (
                        <span className="px-2 py-0.5 rounded bg-white/[0.06] text-[10px] font-mono-tabular text-[#cbd5e1]">
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
            </div>
          )}

          {activeTab === "gear" && (
            <div className="space-y-6">
              {/* NVGs Section */}
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
                        <div className="text-xs font-semibold text-[#f8fafc]">{nvg.name}</div>
                        <span
                          className={`px-2 py-0.5 rounded border text-[10px] font-semibold shrink-0 ${
                            nvg.phosphor.toLowerCase().includes("white")
                              ? "bg-slate-100/15 border-slate-300/40 text-slate-100"
                              : "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                          }`}
                        >
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

              {/* Backpacks, Rigs & Stash Containers */}
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#e5a93c]" />
                    <h2 className="font-display text-sm font-semibold text-[#f8fafc]">
                      Backpacks, Chest Rigs &amp; Stash Cases
                    </h2>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {["ALL", "Backpack", "Chest Rig", "Stash Container"].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setStorageTypeFilter(cat)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                          storageTypeFilter === cat
                            ? "bg-[#e5a93c]/15 border-[#e5a93c]/55 text-[#fde68a]"
                            : "bg-[#0a0e14] border-white/[0.08] text-[#8b98a9] hover:text-white"
                        }`}
                      >
                        {cat === "ALL" ? "All Storage" : `${cat}s`}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {filteredStorage.map((st) => (
                    <div
                      key={st.id}
                      className="rounded-xl bg-[#111722] border border-white/[0.08] p-3.5 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-xs font-semibold text-[#f8fafc]">{st.name}</div>
                          <div className="text-[11px] text-[#7f8ea1]">{st.category}</div>
                        </div>
                        {st.capacity !== null && (
                          <span className="px-2 py-0.5 rounded bg-[#38bdf8]/15 border border-[#38bdf8]/35 text-[10px] font-mono-tabular font-semibold text-[#7dd3fc] shrink-0">
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
