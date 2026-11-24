import { useEffect, useMemo, useState } from "react";
import {
  Bookmark,
  Check,
  Crosshair,
  FolderOpen,
  Layers,
  Plus,
  RotateCcw,
  Save,
  Search,
  ShoppingBag,
  Sparkles,
  Trash2,
  Wrench,
} from "lucide-react";
import {
  SLOT_LABELS,
  WEAPON_PARTS_BY_ID,
  WEAPONS_CATALOG,
  type ModSlotType,
  type WeaponClass,
  type WeaponDef,
} from "../data/weaponLoadoutData";
import { resolveTacticalImageUrl } from "../utils/imageUtils";
import {
  buildActiveSlotTree,
  buildRecommendedBaseLoadout,
  computeLoadoutStats,
  findAccessoryMountPaths,
  getWeaponById,
  pruneInvalidEquippedPaths,
  WEAPON_CLASSES,
  type SavedWeaponLoadout,
  type SlotPathKey,
} from "../utils/weaponBuilder";
import { ItemThumbnail } from "./ItemThumbnail";

interface WeaponLoadoutPanelProps {
  savedLoadouts: SavedWeaponLoadout[];
  onSaveLoadout: (loadout: SavedWeaponLoadout) => void;
  onDeleteLoadout: (id: string) => void;
  onNotify: (msg: string) => void;
  activeOperatorName: string;
}

const QUICK_ACCESSORY_SLOTS: { id: ModSlotType; label: string }[] = [
  { id: "tactical_device", label: "Light / Laser" },
  { id: "sight", label: "Optic / Scope" },
  { id: "suppressor", label: "Suppressor" },
  { id: "foregrip", label: "Foregrip" },
  { id: "stock", label: "Stock" },
  { id: "magazine", label: "Magazine" },
  { id: "muzzle_device", label: "Muzzle Device" },
];

export function WeaponLoadoutPanel({
  savedLoadouts,
  onSaveLoadout,
  onDeleteLoadout,
  onNotify,
  activeOperatorName,
}: WeaponLoadoutPanelProps) {
  const [selectedClass, setSelectedClass] = useState<"ALL" | WeaponClass>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const defaultWeapon = useMemo(
    () =>
      WEAPONS_CATALOG.find((w) => w.name === "M4A1") || WEAPONS_CATALOG[0],
    []
  );

  const [selectedWeaponId, setSelectedWeaponId] = useState<string>(
    defaultWeapon.id
  );
  const [equippedByPath, setEquippedByPath] = useState<Record<SlotPathKey, string>>(
    () => buildRecommendedBaseLoadout(defaultWeapon)
  );
  const [accessoryTab, setAccessoryTab] = useState<ModSlotType>("tactical_device");
  const [accessorySearch, setAccessorySearch] = useState("");
  const [presetName, setPresetName] = useState("");
  const [failedImgUrls, setFailedImgUrls] = useState<Record<string, boolean>>({});
  const [mobileSection, setMobileSection] = useState<"weapons" | "bench" | "presets">(
    "bench"
  );

  const markImgFailed = (url: string) =>
    setFailedImgUrls((prev) => (prev[url] ? prev : { ...prev, [url]: true }));

  const activeWeapon: WeaponDef = useMemo(
    () => getWeaponById(selectedWeaponId) || defaultWeapon,
    [selectedWeaponId, defaultWeapon]
  );

  const classCounts = useMemo(() => {
    const map: Record<string, number> = { ALL: WEAPONS_CATALOG.length };
    for (const cls of WEAPON_CLASSES) map[cls] = 0;
    for (const w of WEAPONS_CATALOG) {
      map[w.weaponClass] = (map[w.weaponClass] || 0) + 1;
    }
    return map;
  }, []);

  const filteredWeapons = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return WEAPONS_CATALOG.filter((w) => {
      if (selectedClass !== "ALL" && w.weaponClass !== selectedClass) return false;
      if (!q) return true;
      return (
        w.name.toLowerCase().includes(q) ||
        w.caliber.toLowerCase().includes(q) ||
        w.weaponClass.toLowerCase().includes(q) ||
        (w.manufacturer || "").toLowerCase().includes(q) ||
        (w.soldBy || "").toLowerCase().includes(q)
      );
    });
  }, [selectedClass, searchQuery]);

  // Keep valid slot tree if weapon changes outside click handler
  useEffect(() => {
    setEquippedByPath((prev) => pruneInvalidEquippedPaths(activeWeapon, prev));
  }, [activeWeapon]);

  const handleSelectWeapon = (weapon: WeaponDef) => {
    setSelectedWeaponId(weapon.id);
    setEquippedByPath(buildRecommendedBaseLoadout(weapon));
    setAccessorySearch("");
    setPresetName("");
    setMobileSection("bench");
  };

  const handleSetSlotPart = (pathKey: SlotPathKey, partId: string) => {
    setEquippedByPath((prev) => {
      const draft = { ...prev };
      if (!partId) {
        delete draft[pathKey];
      } else {
        draft[pathKey] = partId;
      }
      return pruneInvalidEquippedPaths(activeWeapon, draft);
    });
  };

  const handleInstallMountChain = (
    steps: { pathKey: SlotPathKey; partId: string; partName: string }[]
  ) => {
    setEquippedByPath((prev) => {
      const draft = { ...prev };
      for (const st of steps) {
        draft[st.pathKey] = st.partId;
      }
      return pruneInvalidEquippedPaths(activeWeapon, draft);
    });
    const last = steps[steps.length - 1];
    if (last) {
      onNotify(
        steps.length > 1
          ? `Installed ${last.partName} with ${steps.length - 1} prerequisite part${
              steps.length - 1 > 1 ? "s" : ""
            }`
          : `Installed ${last.partName}`
      );
    }
  };

  const activeSlots = useMemo(
    () => buildActiveSlotTree(activeWeapon, equippedByPath),
    [activeWeapon, equippedByPath]
  );

  const stats = useMemo(
    () => computeLoadoutStats(activeWeapon, equippedByPath),
    [activeWeapon, equippedByPath]
  );

  const accessoryOptions = useMemo(() => {
    const q = accessorySearch.trim().toLowerCase();
    const all = findAccessoryMountPaths(
      activeWeapon,
      accessoryTab,
      equippedByPath
    );
    if (!q) return all;
    return all.filter(
      (entry) =>
        entry.part.name.toLowerCase().includes(q) ||
        (entry.part.manufacturer || "").toLowerCase().includes(q) ||
        (entry.part.soldBy || "").toLowerCase().includes(q) ||
        entry.steps.some((s) => s.partName.toLowerCase().includes(q))
    );
  }, [activeWeapon, accessoryTab, equippedByPath, accessorySearch]);

  const handleSavePreset = () => {
    const cleanName =
      presetName.trim() || `${activeWeapon.name} Build (${stats.partCount} mods)`;
    const id = `bld-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    onSaveLoadout({
      id,
      name: cleanName,
      weaponId: activeWeapon.id,
      equippedByPath,
      updatedAt: Date.now(),
    });
    setPresetName("");
  };

  const handleLoadPreset = (preset: SavedWeaponLoadout) => {
    const w = getWeaponById(preset.weaponId);
    if (!w) {
      onNotify("Weapon from saved preset is unavailable");
      return;
    }
    setSelectedWeaponId(w.id);
    setEquippedByPath(pruneInvalidEquippedPaths(w, preset.equippedByPath));
    setMobileSection("bench");
    onNotify(`Loaded preset: ${preset.name}`);
  };

  const heroImageUrl = resolveTacticalImageUrl(
    activeWeapon.image,
    activeWeapon.name
  );
  const heroImageBroken = !heroImageUrl || !!failedImgUrls[heroImageUrl];

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#0e131b]">
      {/* Gunsmith Header & Class Filter Tabs */}
      <div className="border-b border-white/[0.075] bg-[#0e131b] shrink-0">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3.5 space-y-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
              <button
                type="button"
                onClick={() => setSelectedClass("ALL")}
                className={`min-h-[42px] lg:min-h-[34px] px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 ${
                  selectedClass === "ALL"
                    ? "bg-[#141b26] border-[#e5a93c]/70 text-[#fde68a]"
                    : "bg-[#0a0e14] border-white/[0.07] text-[#9fb0c4] hover:text-white"
                }`}
              >
                All Firearms ({classCounts.ALL})
              </button>
              {WEAPON_CLASSES.map((cls) => (
                <button
                  key={cls}
                  type="button"
                  onClick={() => setSelectedClass(cls)}
                  className={`min-h-[42px] lg:min-h-[34px] px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 ${
                    selectedClass === cls
                      ? "bg-[#141b26] border-[#e5a93c]/70 text-[#fde68a]"
                      : "bg-[#0a0e14] border-white/[0.07] text-[#9fb0c4] hover:text-white"
                  }`}
                >
                  {cls} ({classCounts[cls] || 0})
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1 lg:w-72">
                <Search className="w-4 h-4 text-[#7b8ca1] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search weapon, caliber, vendor..."
                  className="w-full min-h-[44px] lg:min-h-[36px] bg-[#0a0e14] border border-white/[0.08] rounded-xl pl-9 pr-3 py-2 text-sm lg:text-[13px] text-[#f1f5f9] placeholder:text-[#66778b] focus:outline-none focus:border-[#e5a93c] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Mobile Section Switcher (< lg) so phone users switch cleanly between Catalog / Workbench / Saved Builds */}
          <div className="grid grid-cols-3 gap-1 rounded-xl bg-[#0a0e14] border border-white/[0.07] p-1 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileSection("weapons")}
              className={`min-h-[42px] px-2 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                mobileSection === "weapons"
                  ? "bg-[#141b26] text-[#e5a93c] ring-1 ring-white/[0.08]"
                  : "text-[#94a3b8]"
              }`}
            >
              Weapons ({filteredWeapons.length})
            </button>
            <button
              type="button"
              onClick={() => setMobileSection("bench")}
              className={`min-h-[42px] px-2 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                mobileSection === "bench"
                  ? "bg-[#141b26] text-[#38bdf8] ring-1 ring-white/[0.08]"
                  : "text-[#94a3b8]"
              }`}
            >
              Workbench
            </button>
            <button
              type="button"
              onClick={() => setMobileSection("presets")}
              className={`min-h-[42px] px-2 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                mobileSection === "presets"
                  ? "bg-[#141b26] text-[#34d399] ring-1 ring-white/[0.08]"
                  : "text-[#94a3b8]"
              }`}
            >
              Saved ({savedLoadouts.length})
            </button>
          </div>
        </div>
      </div>

      {/* Main Responsive Gunsmith Layout */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row bg-[#080b10] overflow-hidden">
        {/* Left Firearm Catalog Rail */}
        <section
          className={`${
            mobileSection === "weapons" ? "flex" : "hidden lg:flex"
          } flex-col lg:w-[340px] xl:w-[380px] lg:shrink-0 lg:border-r border-white/[0.075] min-h-0 bg-[#0b0f16]`}
        >
          <div className="px-4 py-2.5 border-b border-white/[0.06] flex items-center justify-between text-xs text-[#9fb0c4] shrink-0">
            <span>All Variants ({filteredWeapons.length})</span>
            <span className="font-mono-tabular text-[#e5a93c]">
              {activeOperatorName}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filteredWeapons.length === 0 ? (
              <div className="rounded-xl border border-white/[0.075] bg-[#141b26] p-6 text-center text-xs text-[#9fb0c4]">
                No firearms matched your search filter.
              </div>
            ) : (
              filteredWeapons.map((weapon) => {
                const isSelected = weapon.id === activeWeapon.id;
                const thumbUrl = resolveTacticalImageUrl(weapon.image, weapon.name);
                return (
                  <button
                    key={weapon.id}
                    type="button"
                    onClick={() => handleSelectWeapon(weapon)}
                    className={`w-full text-left rounded-xl border p-3 transition-colors flex items-center gap-3 min-h-[68px] ${
                      isSelected
                        ? "bg-[#15202e] border-[#38bdf8]/75 shadow-lg"
                        : "bg-[#141b26] border-white/[0.075] hover:border-white/[0.2]"
                    }`}
                  >
                    <ItemThumbnail
                      src={thumbUrl}
                      alt={weapon.name}
                      kindHint={weapon.weaponClass}
                      sizeClass="w-16 h-12"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs text-[#9fb0c4] truncate">
                        <span className="text-[#e5a93c] font-medium">
                          {weapon.weaponClass}
                        </span>
                        <span className="mx-1.5 text-white/[0.2]">·</span>
                        <span>{weapon.caliber}</span>
                      </div>
                      <div className="font-display text-sm font-semibold text-[#f8fafc] truncate mt-0.5">
                        {weapon.name}
                      </div>
                      <div className="font-mono-tabular text-[11px] text-[#8899ae] mt-0.5 flex items-center gap-2 truncate">
                        {weapon.fireRate && <span>{weapon.fireRate} RPM</span>}
                        {weapon.buyPrice && (
                          <span className="text-[#34d399]">
                            ${weapon.buyPrice.toLocaleString()}
                          </span>
                        )}
                        {weapon.soldBy && (
                          <span className="truncate">{weapon.soldBy}</span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </section>

        {/* Center/Right Gunsmith Workbench + Saved Presets */}
        <section
          className={`${
            mobileSection === "weapons" ? "hidden lg:block" : "block"
          } flex-1 min-h-0 overflow-y-auto p-4 sm:p-6`}
        >
          <div className="max-w-5xl mx-auto space-y-5">
            {/* Hero Weapon Card & Aggregated Live Stats */}
            <div
              className={`${
                mobileSection === "presets" ? "hidden lg:block" : "block"
              } rounded-2xl bg-[#141b26] border border-white/[0.08] p-4 sm:p-5 space-y-4`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 min-w-0">
                  <div className="h-32 sm:h-36 sm:w-56 rounded-xl bg-[#0a0e14] border border-white/[0.07] flex items-center justify-center p-3 shrink-0">
                    {!heroImageBroken ? (
                      <img
                        src={heroImageUrl!}
                        alt={activeWeapon.name}
                        referrerPolicy="no-referrer"
                        onError={() => markImgFailed(heroImageUrl!)}
                        className="max-h-28 w-auto object-contain drop-shadow-[0_10px_24px_rgba(0,0,0,0.85)]"
                      />
                    ) : (
                      <ItemThumbnail
                        src={null}
                        alt={activeWeapon.name}
                        kindHint={activeWeapon.weaponClass}
                        sizeClass="w-16 h-16"
                      />
                    )}
                  </div>

                  <div className="min-w-0 space-y-1.5">
                    <div className="text-xs text-[#9fb0c4] flex flex-wrap items-center gap-1.5">
                      <span className="text-[#e5a93c] font-semibold">
                        {activeWeapon.weaponClass}
                      </span>
                      <span>·</span>
                      <span>{activeWeapon.caliber}</span>
                      {activeWeapon.manufacturer && (
                        <>
                          <span>·</span>
                          <span>{activeWeapon.manufacturer}</span>
                        </>
                      )}
                    </div>
                    <h2 className="font-display text-xl sm:text-2xl font-semibold text-[#f8fafc] leading-tight">
                      {activeWeapon.name}
                    </h2>
                    <div className="text-xs text-[#cbd5e1] space-y-0.5">
                      <div>
                        Mode: <span className="text-white">{activeWeapon.fireMode || "Single"}</span>
                        {activeWeapon.fireRate ? ` · ${activeWeapon.fireRate} RPM` : ""}
                        {activeWeapon.soldBy ? ` · ${activeWeapon.soldBy}` : ""}
                      </div>
                      {activeWeapon.acceptedAmmo && (
                        <div className="text-[#8899ae] truncate max-w-xl">
                          Ammo: {activeWeapon.acceptedAmmo}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setEquippedByPath(buildRecommendedBaseLoadout(activeWeapon));
                      onNotify(`Applied Factory Build for ${activeWeapon.name}`);
                    }}
                    className="min-h-[44px] lg:min-h-[36px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0a0e14] border border-white/[0.1] hover:border-[#38bdf8] text-xs font-medium text-[#7dd3fc] transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Factory Build</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEquippedByPath({});
                      onNotify(`Stripped all attachments from ${activeWeapon.name}`);
                    }}
                    className="min-h-[44px] lg:min-h-[36px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0a0e14] border border-white/[0.1] hover:border-white/[0.25] text-xs font-medium text-[#cbd5e1] hover:text-white transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Strip Mods</span>
                  </button>
                </div>
              </div>

              {/* Aggregated Build Telemetry */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                <div className="rounded-xl bg-[#0a0e14] border border-white/[0.06] p-3">
                  <div className="text-xs text-[#8899ae]">Build Cost</div>
                  <div className="font-mono-tabular text-base font-bold text-[#34d399] mt-0.5">
                    ${stats.totalCost.toLocaleString()}
                  </div>
                </div>
                <div className="rounded-xl bg-[#0a0e14] border border-white/[0.06] p-3">
                  <div className="text-xs text-[#8899ae]">Total Weight</div>
                  <div className="font-mono-tabular text-base font-semibold text-[#f8fafc] mt-0.5">
                    {stats.totalWeightKg.toFixed(2)} kg
                  </div>
                </div>
                <div className="rounded-xl bg-[#0a0e14] border border-white/[0.06] p-3">
                  <div className="text-xs text-[#8899ae]">Ergonomics</div>
                  <div className="font-mono-tabular text-base font-semibold text-[#38bdf8] mt-0.5">
                    {stats.ergonomics}
                  </div>
                </div>
                <div className="rounded-xl bg-[#0a0e14] border border-white/[0.06] p-3">
                  <div className="text-xs text-[#8899ae]">Recoil Ctrl</div>
                  <div className="font-mono-tabular text-base font-semibold text-[#e5a93c] mt-0.5">
                    {stats.recoilControlDelta >= 0 ? "+" : ""}
                    {stats.recoilControlDelta}%
                  </div>
                </div>
                <div className="rounded-xl bg-[#0a0e14] border border-white/[0.06] p-3">
                  <div className="text-xs text-[#8899ae]">Handling</div>
                  <div className="font-mono-tabular text-base font-semibold text-[#f8fafc] mt-0.5">
                    {stats.weaponHandlingDelta >= 0 ? "+" : ""}
                    {stats.weaponHandlingDelta}%
                  </div>
                </div>
                <div className="rounded-xl bg-[#0a0e14] border border-white/[0.06] p-3">
                  <div className="text-xs text-[#8899ae]">Installed Mods</div>
                  <div className="font-mono-tabular text-base font-semibold text-[#f8fafc] mt-0.5">
                    {stats.partCount}
                  </div>
                </div>
              </div>

              {/* Save Preset & Vendor Shopping Breakdown */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2 border-t border-white/[0.06]">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#9fb0c4]">
                  <span className="inline-flex items-center gap-1.5 text-[#e5a93c] font-medium">
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Traders Needed:
                  </span>
                  {stats.vendorBreakdown.length === 0 ? (
                    <span>Loot / Quest parts only</span>
                  ) : (
                    stats.vendorBreakdown.map((vb) => (
                      <span key={vb.vendor} className="font-mono-tabular text-[#cbd5e1]">
                        {vb.vendor} R.{vb.rank} ({vb.count} · ${vb.cost.toLocaleString()})
                      </span>
                    ))
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={presetName}
                    onChange={(e) => setPresetName(e.target.value)}
                    placeholder={`Save build for ${activeOperatorName}...`}
                    className="flex-1 md:w-56 min-h-[44px] lg:min-h-[36px] bg-[#0a0e14] border border-white/[0.08] rounded-xl px-3 py-1.5 text-xs text-[#f1f5f9] placeholder:text-[#66778b] focus:outline-none focus:border-[#e5a93c]"
                  />
                  <button
                    type="button"
                    onClick={handleSavePreset}
                    className="min-h-[44px] lg:min-h-[36px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#e5a93c] hover:bg-[#f0b94d] text-[#080b10] text-xs font-semibold whitespace-nowrap shrink-0 transition-colors"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Build</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Accessory & Prerequisite Chain Finder (Lights/Lasers, Optics, Suppressors, etc.) */}
            <div
              className={`${
                mobileSection === "presets" ? "hidden lg:block" : "block"
              } rounded-2xl bg-[#141b26] border border-white/[0.08] p-4 sm:p-5 space-y-3.5`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-display text-base font-semibold text-[#f8fafc] flex items-center gap-2">
                    <Crosshair className="w-4 h-4 text-[#38bdf8]" />
                    <span>Quick Accessory &amp; Rail Dependency Finder</span>
                  </h3>
                  <p className="text-xs text-[#9fb0c4] mt-0.5">
                    Shows every Light, Laser, Optic, or Suppressor compatible with {activeWeapon.name} — including required handguards, rails, or mounts.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {QUICK_ACCESSORY_SLOTS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setAccessoryTab(tab.id)}
                    className={`min-h-[42px] lg:min-h-[34px] px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 ${
                      accessoryTab === tab.id
                        ? "bg-[#15202e] border-[#38bdf8]/70 text-[#7dd3fc]"
                        : "bg-[#0a0e14] border-white/[0.07] text-[#9fb0c4] hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-[#7b8ca1] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={accessorySearch}
                  onChange={(e) => setAccessorySearch(e.target.value)}
                  placeholder={`Filter compatible ${SLOT_LABELS[accessoryTab] || accessoryTab} parts...`}
                  className="w-full min-h-[44px] lg:min-h-[36px] bg-[#0a0e14] border border-white/[0.08] rounded-xl pl-9 pr-3 py-2 text-xs text-[#f1f5f9] placeholder:text-[#66778b] focus:outline-none focus:border-[#38bdf8]"
                />
              </div>

              {accessoryOptions.length === 0 ? (
                <div className="rounded-xl bg-[#0a0e14] border border-white/[0.06] p-4 text-xs text-[#9fb0c4]">
                  No {SLOT_LABELS[accessoryTab]} attachments are compatible with {activeWeapon.name}.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
                  {accessoryOptions.slice(0, 36).map((opt) => {
                    const targetStep = opt.steps[opt.steps.length - 1];
                    const isEquipped =
                      targetStep &&
                      equippedByPath[targetStep.pathKey] === opt.part.id;
                    const partThumb = resolveTacticalImageUrl(
                      opt.part.image,
                      opt.part.name
                    );
                    return (
                      <div
                        key={opt.part.id}
                        className={`rounded-xl border p-3 flex items-center justify-between gap-3 ${
                          isEquipped
                            ? "bg-[#0f1a18] border-[#2e7359]"
                            : "bg-[#0a0e14] border-white/[0.065]"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <ItemThumbnail
                            src={partThumb}
                            alt={opt.part.name}
                            kindHint={opt.part.typeLabel}
                            sizeClass="w-10 h-10"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-semibold text-[#f8fafc] truncate">
                              {opt.part.name}
                            </div>
                            <div className="font-mono-tabular text-[11px] text-[#8899ae] mt-0.5 truncate">
                              {opt.part.buyPrice
                                ? `$${opt.part.buyPrice.toLocaleString()}`
                                : "Loot only"}
                              {opt.part.soldBy ? ` · ${opt.part.soldBy}` : ""}
                            </div>
                            {!opt.direct && opt.missingSteps.length > 0 ? (
                              <div className="text-[11px] text-[#e5a93c] mt-0.5 line-clamp-2">
                                Requires:{" "}
                                {opt.missingSteps
                                  .map((m) => m.partName)
                                  .join(" → ")}
                              </div>
                            ) : (
                              <div className="text-[11px] text-[#34d399] mt-0.5">
                                {isEquipped ? "Currently Equipped" : "Fits current build"}
                              </div>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleInstallMountChain(opt.steps)}
                          className={`min-h-[44px] lg:min-h-[34px] px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors flex items-center gap-1 ${
                            isEquipped
                              ? "bg-[#112922] border border-[#2e7359] text-[#34d399]"
                              : opt.direct
                                ? "bg-[#38bdf8] hover:bg-[#5cc9fa] text-[#080b10]"
                                : "bg-[#e5a93c] hover:bg-[#f0b94d] text-[#080b10]"
                          }`}
                        >
                          {isEquipped ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Equipped</span>
                            </>
                          ) : opt.direct ? (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>Attach</span>
                            </>
                          ) : (
                            <>
                              <Wrench className="w-3.5 h-3.5" />
                              <span>Install Chain</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Full Interactive Attachment Slot Tree */}
            <div
              className={`${
                mobileSection === "presets" ? "hidden lg:block" : "block"
              } rounded-2xl bg-[#141b26] border border-white/[0.08] p-4 sm:p-5 space-y-3`}
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-display text-base font-semibold text-[#f8fafc] flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#e5a93c]" />
                  <span>Full Attachment Tree ({activeSlots.length} active slots)</span>
                </h3>
                <span className="text-xs text-[#8899ae]">
                  Sub-slots unlock as parts attach
                </span>
              </div>

              <div className="space-y-2.5">
                {activeSlots.map((node) => {
                  const indentPx = Math.min(node.depth * 18, 54);
                  const equippedPart = node.equippedPart;
                  const partImg = equippedPart
                    ? resolveTacticalImageUrl(equippedPart.image, equippedPart.name)
                    : null;

                  return (
                    <div
                      key={node.pathKey}
                      style={{ marginLeft: `${indentPx}px` }}
                      className="rounded-xl bg-[#0a0e14] border border-white/[0.07] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <ItemThumbnail
                          src={partImg}
                          alt={equippedPart?.name || node.label}
                          kindHint={node.slotType}
                          sizeClass="w-10 h-10"
                        />
                        <div className="min-w-0">
                          <div className="text-xs text-[#9fb0c4] flex items-center gap-1.5 flex-wrap">
                            <span className="font-semibold text-[#e5a93c]">
                              {node.label}
                            </span>
                            {node.depth > 0 && (
                              <>
                                <span className="text-white/[0.2]">·</span>
                                <span className="truncate">
                                  on {node.parentName}
                                </span>
                              </>
                            )}
                          </div>
                          {equippedPart ? (
                            <div className="text-xs font-mono-tabular text-[#8899ae] mt-0.5 truncate">
                              {equippedPart.buyPrice
                                ? `$${equippedPart.buyPrice.toLocaleString()}`
                                : "Loot"}
                              {equippedPart.weightKg
                                ? ` · ${equippedPart.weightKg}kg`
                                : ""}
                              {equippedPart.ergonomics
                                ? ` · Ergo ${equippedPart.ergonomics > 0 ? "+" : ""}${equippedPart.ergonomics}`
                                : ""}
                              {equippedPart.recoilControl
                                ? ` · Recoil ${equippedPart.recoilControl > 0 ? "+" : ""}${equippedPart.recoilControl}%`
                                : ""}
                            </div>
                          ) : (
                            <div className="text-xs text-[#64748b] mt-0.5">
                              {node.candidatePartIds.length} compatible option
                              {node.candidatePartIds.length === 1 ? "" : "s"}
                            </div>
                          )}
                        </div>
                      </div>

                      <select
                        aria-label={`Select ${node.label} on ${node.parentName}`}
                        value={equippedPart?.id || ""}
                        onChange={(e) =>
                          handleSetSlotPart(node.pathKey, e.target.value)
                        }
                        className="w-full sm:w-72 min-h-[44px] lg:min-h-[38px] bg-[#141b26] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-[#f1f5f9] focus:outline-none focus:border-[#38bdf8]"
                      >
                        <option value="">Empty — None equipped</option>
                        {node.candidatePartIds.map((pid) => {
                          const part = WEAPON_PARTS_BY_ID[pid];
                          if (!part) return null;
                          const priceLabel = part.buyPrice
                            ? ` ($${part.buyPrice.toLocaleString()})`
                            : "";
                          return (
                            <option key={pid} value={pid}>
                              {part.name}
                              {priceLabel}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Saved Presets Section (Per Active Operator Slot) */}
            <div
              className={`${
                mobileSection === "bench" ? "hidden lg:block" : "block"
              } rounded-2xl bg-[#141b26] border border-white/[0.08] p-4 sm:p-5 space-y-3`}
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-display text-base font-semibold text-[#f8fafc] flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-[#34d399]" />
                  <span>
                    Saved Loadouts for {activeOperatorName} ({savedLoadouts.length})
                  </span>
                </h3>
              </div>

              {savedLoadouts.length === 0 ? (
                <div className="rounded-xl bg-[#0a0e14] border border-white/[0.06] p-4 text-xs text-[#9fb0c4]">
                  No saved builds for {activeOperatorName} yet. Configure any weapon above and tap Save Build.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {savedLoadouts.map((preset) => {
                    const w = getWeaponById(preset.weaponId);
                    const presetStats = w
                      ? computeLoadoutStats(w, preset.equippedByPath)
                      : null;
                    return (
                      <div
                        key={preset.id}
                        className="rounded-xl bg-[#0a0e14] border border-white/[0.07] p-3.5 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <ItemThumbnail
                            src={
                              w
                                ? resolveTacticalImageUrl(w.image, w.name)
                                : null
                            }
                            alt={preset.name}
                            kindHint={w?.weaponClass || "rifle"}
                            sizeClass="w-12 h-10"
                          />
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-[#f8fafc] truncate">
                              {preset.name}
                            </div>
                            <div className="font-mono-tabular text-xs text-[#8899ae] truncate mt-0.5">
                              {w?.name || preset.weaponId}
                              {presetStats
                                ? ` · $${presetStats.totalCost.toLocaleString()} · ${presetStats.partCount} mods`
                                : ""}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleLoadPreset(preset)}
                            className="min-h-[44px] lg:min-h-[34px] inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#141b26] border border-white/[0.1] hover:border-[#38bdf8] text-xs font-medium text-[#7dd3fc] transition-colors"
                          >
                            <FolderOpen className="w-3.5 h-3.5" />
                            <span>Load</span>
                          </button>
                          <button
                            type="button"
                            aria-label={`Delete ${preset.name}`}
                            onClick={() => onDeleteLoadout(preset.id)}
                            className="min-h-[44px] min-w-[44px] lg:min-h-[34px] lg:min-w-[34px] flex items-center justify-center rounded-lg bg-[#141b26] border border-white/[0.1] text-[#94a3b8] hover:text-red-400 hover:border-red-500/50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
