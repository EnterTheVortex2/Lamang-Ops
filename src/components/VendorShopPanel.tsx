import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpDown,
  Loader2,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  User,
  X,
} from "lucide-react";
import { fetchCategoryDataset } from "../services/gzwApi";
import type { VendorProfile } from "../utils/taskBuilder";
import { resolveTacticalImageUrl } from "../utils/imageUtils";
import {
  extractEnrichmentFromRecords,
  getStaticWeaponAndPartEnrichmentMap,
  parseUsdPrice,
  VENDOR_SHOP_GROUPS,
  type VendorItemEnrichment,
  type VendorShopGroup,
  type VendorShopItem,
} from "../utils/vendorBuilder";
import { ItemThumbnail } from "./ItemThumbnail";

interface VendorShopPanelProps {
  vendors: VendorProfile[];
  shopItems: VendorShopItem[];
  isExpanded: boolean;
  isLoadingApi: boolean;
}

type RankFilter = "ALL" | 1 | 2 | 3 | 4;
type SortMode = "default" | "price-asc" | "price-desc" | "name-asc";

const CATEGORY_ALIASES: Record<string, string> = {
  drink: "drinks",
  drinks: "drink",
  food: "foods",
  foods: "food",
};

export function VendorShopPanel({
  vendors,
  shopItems,
  isLoadingApi,
}: VendorShopPanelProps) {
  const [selectedVendor, setSelectedVendor] = useState<string>("Gunny");
  const [selectedRank, setSelectedRank] = useState<RankFilter>("ALL");
  const [selectedGroup, setSelectedGroup] = useState<VendorShopGroup>("ALL");
  const [sortMode, setSortMode] = useState<SortMode>("default");
  const [searchQuery, setSearchQuery] = useState("");
  const [inspectedItem, setInspectedItem] = useState<VendorShopItem | null>(null);
  const [failedImgUrls, setFailedImgUrls] = useState<Record<string, boolean>>({});
  const [enrichmentByCategory, setEnrichmentByCategory] = useState<
    Record<string, Map<string, VendorItemEnrichment>>
  >({});
  const [loadingCount, setLoadingCount] = useState(0);

  const staticWeaponEnrichment = useMemo(
    () => getStaticWeaponAndPartEnrichmentMap(),
    []
  );

  const markImgFailed = (url: string) =>
    setFailedImgUrls((prev) => (prev[url] ? prev : { ...prev, [url]: true }));

  const activeVendorProfile = useMemo(
    () =>
      vendors.find(
        (v) => v.name.toLowerCase() === selectedVendor.toLowerCase()
      ) ||
      vendors[0] ||
      null,
    [vendors, selectedVendor]
  );

  const vendorCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of shopItems) {
      const k = item.vendor.toLowerCase();
      map.set(k, (map.get(k) || 0) + 1);
    }
    return map;
  }, [shopItems]);

  const vendorItems = useMemo(
    () =>
      shopItems.filter(
        (item) => item.vendor.toLowerCase() === selectedVendor.toLowerCase()
      ),
    [shopItems, selectedVendor]
  );

  const rankCounts = useMemo(() => {
    const counts: Record<1 | 2 | 3 | 4, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
    for (const item of vendorItems) {
      if (item.rank && item.rank >= 1 && item.rank <= 4) {
        counts[item.rank] += 1;
      }
    }
    return counts;
  }, [vendorItems]);

  const availableGroups = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of vendorItems) {
      if (selectedRank === "ALL" || item.rank === selectedRank) {
        counts.set(item.shopGroup, (counts.get(item.shopGroup) || 0) + 1);
      }
    }
    return VENDOR_SHOP_GROUPS.filter(
      (g) => g.id === "ALL" || (counts.get(g.id) || 0) > 0
    ).map((g) => ({
      ...g,
      count:
        g.id === "ALL"
          ? vendorItems.filter(
              (i) => selectedRank === "ALL" || i.rank === selectedRank
            ).length
          : counts.get(g.id) || 0,
    }));
  }, [vendorItems, selectedRank]);

  useEffect(() => {
    if (
      selectedGroup !== "ALL" &&
      !availableGroups.some((g) => g.id === selectedGroup)
    ) {
      setSelectedGroup("ALL");
    }
  }, [availableGroups, selectedGroup]);

  // Hydrate ALL distinct datasets stocked by the currently selected vendor in clean batches
  useEffect(() => {
    let cancelled = false;
    const distinctCats = Array.from(
      new Set(vendorItems.map((i) => i.rawCategory).filter(Boolean))
    );
    const missing = distinctCats.filter((cat) => !enrichmentByCategory[cat]);
    if (missing.length === 0) return;

    const loadAllVendorCats = async () => {
      setLoadingCount((c) => c + 1);
      try {
        const batchSize = 4;
        for (let i = 0; i < missing.length; i += batchSize) {
          if (cancelled) return;
          const slice = missing.slice(i, i + batchSize);
          const settled = await Promise.allSettled(
            slice.map(async (cat) => {
              let records = await fetchCategoryDataset(cat);
              if (records.length === 0 && CATEGORY_ALIASES[cat]) {
                records = await fetchCategoryDataset(CATEGORY_ALIASES[cat]);
              }
              return { cat, parsed: extractEnrichmentFromRecords(records) };
            })
          );
          if (cancelled) return;
          setEnrichmentByCategory((prev) => {
            const next = { ...prev };
            for (const res of settled) {
              if (res.status === "fulfilled") {
                next[res.value.cat] = res.value.parsed;
              }
            }
            return next;
          });
        }
      } finally {
        if (!cancelled) {
          setLoadingCount((c) => Math.max(0, c - 1));
        }
      }
    };

    void loadAllVendorCats();
    return () => {
      cancelled = true;
    };
  }, [vendorItems]);

  const getEnrichment = (item: VendorShopItem): VendorItemEnrichment | null => {
    const key = item.itemName.trim().toLowerCase();
    const directMap = enrichmentByCategory[item.rawCategory];
    const directMatch = directMap?.get(key);
    if (directMatch) return directMatch;

    // Cross-category fallback (handles API items indexed under adjacent weapon_parts / gear categories)
    for (const catMap of Object.values(enrichmentByCategory)) {
      const hit = catMap.get(key);
      if (hit) return hit;
    }

    // Bundled 0.5 Gunsmith fallback for instant weapon & attachment images/specs
    const staticHit = staticWeaponEnrichment.get(key);
    if (staticHit) return staticHit;

    // Guaranteed local item image resolution if available
    const fallbackImg = resolveTacticalImageUrl(null, item.itemName);
    if (fallbackImg) {
      return {
        image: fallbackImg,
        buyPrice: item.buyPrice,
        sellPrice: null,
        weight: null,
        gridSize: null,
        manufacturer: null,
        description: null,
        specs: [],
      };
    }

    return null;
  };

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = vendorItems.filter((item) => {
      if (selectedRank !== "ALL" && item.rank !== selectedRank) return false;
      if (selectedGroup !== "ALL" && item.shopGroup !== selectedGroup) {
        return false;
      }
      if (!q) return true;
      const enriched = getEnrichment(item);
      return (
        item.itemName.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q) ||
        item.shopGroup.toLowerCase().includes(q) ||
        (enriched?.manufacturer || "").toLowerCase().includes(q) ||
        (enriched?.description || "").toLowerCase().includes(q)
      );
    });

    if (sortMode === "default") return list;
    return [...list].sort((a, b) => {
      if (sortMode === "name-asc") {
        return a.itemName.localeCompare(b.itemName);
      }
      const priceA =
        parseUsdPrice(a.buyPrice || getEnrichment(a)?.buyPrice) ??
        (sortMode === "price-asc" ? Number.MAX_SAFE_INTEGER : -1);
      const priceB =
        parseUsdPrice(b.buyPrice || getEnrichment(b)?.buyPrice) ??
        (sortMode === "price-asc" ? Number.MAX_SAFE_INTEGER : -1);
      return sortMode === "price-asc"
        ? priceA - priceB || a.itemName.localeCompare(b.itemName)
        : priceB - priceA || a.itemName.localeCompare(b.itemName);
    });
  }, [
    vendorItems,
    selectedRank,
    selectedGroup,
    searchQuery,
    sortMode,
    enrichmentByCategory,
    staticWeaponEnrichment,
  ]);

  const rankSections = useMemo(() => {
    if (sortMode !== "default") {
      return [
        {
          rank: selectedRank === "ALL" ? 0 : selectedRank,
          title:
            selectedRank === "ALL"
              ? "All Ranks (Sorted)"
              : `Rank ${selectedRank}`,
          items: filteredItems,
        },
      ];
    }
    if (selectedRank !== "ALL") {
      return [
        {
          rank: selectedRank,
          title: `Loyalty Rank ${selectedRank}`,
          items: filteredItems,
        },
      ];
    }
    const groups: { rank: number; title: string; items: VendorShopItem[] }[] =
      [];
    ([1, 2, 3, 4] as const).forEach((rk) => {
      const list = filteredItems.filter((i) => i.rank === rk);
      if (list.length > 0) {
        groups.push({
          rank: rk,
          title: `Loyalty Rank ${rk}`,
          items: list,
        });
      }
    });
    const unlisted = filteredItems.filter((i) => i.rank === null);
    if (unlisted.length > 0) {
      groups.push({ rank: 9, title: "Special Stock", items: unlisted });
    }
    return groups;
  }, [filteredItems, selectedRank, sortMode]);

  const inspectedEnrichment = inspectedItem ? getEnrichment(inspectedItem) : null;
  const inspectedBuyPrice = inspectedItem
    ? inspectedItem.buyPrice || inspectedEnrichment?.buyPrice || null
    : null;

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#0e131b]">
      {/* Storefront Controls */}
      <div className="border-b border-white/[0.075] bg-[#0e131b] shrink-0">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-4 space-y-3.5">
          {/* Vendor Roster Strip */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {vendors.map((vendor) => {
              const active =
                selectedVendor.toLowerCase() === vendor.name.toLowerCase();
              const count = vendorCounts.get(vendor.name.toLowerCase()) || 0;
              return (
                <button
                  key={vendor.id}
                  type="button"
                  onClick={() => {
                    setSelectedVendor(vendor.name);
                    setSearchQuery("");
                    setInspectedItem(null);
                  }}
                  className={`min-h-[52px] px-3 py-2 rounded-xl border text-left transition-all shrink-0 flex items-center gap-3 ${
                    active
                      ? "bg-[#141b26] border-[#e5a93c]/70 text-[#f8fafc] shadow-[0_6px_20px_rgba(0,0,0,0.4)]"
                      : "bg-[#0a0e14] border-white/[0.07] text-[#9fb0c4] hover:text-white hover:border-white/[0.18]"
                  }`}
                >
                  {vendor.image && !failedImgUrls[vendor.image] ? (
                    <img
                      src={vendor.image}
                      alt={vendor.name}
                      referrerPolicy="no-referrer"
                      onError={() => markImgFailed(vendor.image!)}
                      className="w-10 h-10 rounded-lg object-cover object-top border border-white/[0.12] bg-[#080b10] shrink-0"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-[#0e131b] border border-white/[0.08] flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-[#8899ae]" />
                    </div>
                  )}
                  <div>
                    <div className="font-display text-sm font-semibold leading-tight whitespace-nowrap">
                      {vendor.name}
                    </div>
                    <div className="font-mono-tabular text-xs text-[#8899ae] mt-0.5">
                      {count} items
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Search, Sort & Rank Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
            <div className="flex items-center rounded-xl bg-[#0a0e14] border border-white/[0.075] p-1 overflow-x-auto max-w-full">
              {(
                [
                  { id: "ALL" as const, label: `All (${vendorItems.length})` },
                  { id: 1 as const, label: `Rank 1 (${rankCounts[1]})` },
                  { id: 2 as const, label: `Rank 2 (${rankCounts[2]})` },
                  { id: 3 as const, label: `Rank 3 (${rankCounts[3]})` },
                  { id: 4 as const, label: `Rank 4 (${rankCounts[4]})` },
                ]
              ).map((rk) => (
                <button
                  key={String(rk.id)}
                  type="button"
                  onClick={() => setSelectedRank(rk.id)}
                  className={`min-h-[38px] lg:min-h-[32px] px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    selectedRank === rk.id
                      ? "bg-[#141b26] text-[#e5a93c] ring-1 ring-white/[0.08]"
                      : "text-[#94a3b8] hover:text-white"
                  }`}
                >
                  {rk.label}
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-[#7b8ca1] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${selectedVendor} stock...`}
                  className="w-full min-h-[44px] lg:min-h-[38px] bg-[#0a0e14] border border-white/[0.08] rounded-xl pl-9 pr-3 py-2 text-sm lg:text-[13px] text-[#f1f5f9] placeholder:text-[#66778b] focus:outline-none focus:border-[#e5a93c] transition-colors"
                />
              </div>

              <div className="relative flex items-center">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#8899ae] absolute left-3 pointer-events-none" />
                <select
                  aria-label="Sort vendor inventory"
                  value={sortMode}
                  onChange={(e) => setSortMode(e.target.value as SortMode)}
                  className="w-full sm:w-auto min-h-[44px] lg:min-h-[38px] bg-[#0a0e14] border border-white/[0.08] rounded-xl pl-8 pr-3 py-2 text-xs text-[#f1f5f9] focus:outline-none focus:border-[#e5a93c]"
                >
                  <option value="default">Sort: Loyalty Rank</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
            {availableGroups.map((grp) => {
              const active = selectedGroup === grp.id;
              return (
                <button
                  key={grp.id}
                  type="button"
                  onClick={() => setSelectedGroup(grp.id)}
                  className={`min-h-[40px] lg:min-h-[32px] px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? "bg-[#15202e] border-[#38bdf8]/65 text-[#7dd3fc]"
                      : "bg-[#0a0e14] border-white/[0.07] text-[#9fb0c4] hover:text-white hover:border-white/[0.16]"
                  }`}
                >
                  {grp.label}{" "}
                  <span className="font-mono-tabular text-[11px] opacity-75 ml-0.5">
                    {grp.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scrollable Vendor Showcase + Product Grid */}
      <div className="flex-1 overflow-y-auto bg-[#080b10]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-5 space-y-6">
          {/* Large Vendor Dossier Showcase Card (Always Visible on Mobile & Desktop) */}
          {activeVendorProfile && (
            <section className="rounded-2xl bg-[#141b26] border border-white/[0.08] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
                    <ShoppingBag className="w-8 h-8 text-[#e5a93c]" />
                  </div>
                )}

                <div className="min-w-0 space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-display text-lg sm:text-2xl font-semibold text-[#f8fafc] leading-tight">
                      {activeVendorProfile.name} Armory &amp; Supply
                    </h2>
                    {activeVendorProfile.fullName !== "Unknown" && (
                      <span className="text-xs sm:text-sm text-[#9fb0c4]">
                        · {activeVendorProfile.fullName}
                      </span>
                    )}
                  </div>
                  <p className="text-[13px] sm:text-sm text-[#cbd5e1] leading-relaxed">
                    {activeVendorProfile.sells || activeVendorProfile.specialty}
                  </p>
                  {loadingCount > 0 && (
                    <div className="inline-flex items-center gap-1.5 text-xs text-[#38bdf8]">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Syncing prices &amp; technical specs...</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 sm:text-right shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-white/[0.07]">
                <div>
                  <div className="text-xs text-[#8899ae]">Stocked Items</div>
                  <div className="font-mono-tabular text-lg font-semibold text-[#e5a93c]">
                    {vendorItems.length}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[#8899ae]">Visible Now</div>
                  <div className="font-mono-tabular text-sm font-medium text-[#f1f5f9]">
                    {filteredItems.length}
                  </div>
                </div>
              </div>
            </section>
          )}

          {shopItems.length === 0 ? (
            <div className="rounded-xl border border-white/[0.075] bg-[#141b26] p-10 text-center text-sm text-[#a9b8ca]">
              {isLoadingApi
                ? "Loading vendor catalog..."
                : "Vendor inventory is not loaded yet. Click Sync Data."}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="rounded-xl border border-white/[0.075] bg-[#141b26] p-10 text-center text-sm text-[#a9b8ca]">
              No {selectedVendor} items match the selected rank, category, or search term.
            </div>
          ) : (
            rankSections.map((section) => (
              <section key={section.rank} className="space-y-3">
                <div className="flex items-center justify-between border-b border-white/[0.07] pb-2">
                  <h3 className="font-display text-base font-semibold text-[#e5a93c]">
                    {activeVendorProfile?.name} · {section.title}
                  </h3>
                  <span className="font-mono-tabular text-xs text-[#8899ae]">
                    {section.items.length} products
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
                  {section.items.map((item) => {
                    const enriched = getEnrichment(item);
                    const buyPrice = item.buyPrice || enriched?.buyPrice || null;
                    const imgSrc = enriched?.image || null;
                    const imgBroken = !imgSrc || !!failedImgUrls[imgSrc];
                    const highlightSpec = enriched?.specs[0] || null;

                    return (
                      <article
                        key={item.id}
                        onClick={() => setInspectedItem(item)}
                        className="group rounded-xl border border-white/[0.075] bg-[#141b26] hover:border-[#e5a93c]/55 hover:-translate-y-0.5 transition-all duration-150 overflow-hidden flex flex-col cursor-pointer shadow-sm hover:shadow-[0_12px_28px_rgba(0,0,0,0.45)]"
                      >
                        {/* Product Showcase Image Stage */}
                        <div className="relative h-36 bg-gradient-to-b from-[#0c1118] to-[#080b10] border-b border-white/[0.06] flex items-center justify-center p-4 overflow-hidden">
                          <span className="absolute top-2.5 left-2.5 text-xs font-medium text-[#cbd5e1]">
                            {item.rank ? `Rank ${item.rank}` : "Special"}
                          </span>

                          {enriched?.gridSize && (
                            <span className="absolute top-2.5 right-2.5 font-mono-tabular text-xs text-[#94a3b8]">
                              {enriched.gridSize}
                            </span>
                          )}

                          {!imgBroken ? (
                            <img
                              src={imgSrc}
                              alt={item.itemName}
                              referrerPolicy="no-referrer"
                              onError={() => markImgFailed(imgSrc)}
                              loading="lazy"
                              className="max-h-24 w-auto object-contain group-hover:scale-105 transition-transform duration-200 drop-shadow-[0_8px_18px_rgba(0,0,0,0.75)]"
                            />
                          ) : (
                            <ItemThumbnail
                              src={null}
                              alt={item.itemName}
                              kindHint={`${item.type} ${item.shopGroup}`}
                              sizeClass="w-14 h-14"
                            />
                          )}
                        </div>

                        {/* Product Info & Pricing */}
                        <div className="p-4 flex-1 flex flex-col justify-between gap-2.5">
                          <div>
                            <h4 className="font-display text-[15px] font-semibold text-[#f8fafc] leading-snug line-clamp-2 group-hover:text-[#e5a93c] transition-colors">
                              {item.itemName}
                            </h4>
                            <div className="text-xs text-[#9fb0c4] mt-1 truncate">
                              <span>{item.type}</span>
                              {enriched?.manufacturer && (
                                <>
                                  <span className="mx-1.5 text-white/[0.2]">·</span>
                                  <span>{enriched.manufacturer}</span>
                                </>
                              )}
                            </div>
                            {highlightSpec && (
                              <div className="text-xs text-[#7dd3fc] mt-1.5 truncate">
                                {highlightSpec.label}: {highlightSpec.value}
                              </div>
                            )}
                          </div>

                          <div className="pt-2.5 border-t border-white/[0.06] flex items-center justify-between gap-2">
                            {buyPrice ? (
                              <div>
                                <div className="text-xs text-[#8899ae]">
                                  Buy Price
                                </div>
                                <div className="font-mono-tabular text-[15px] font-bold text-[#34d399]">
                                  {buyPrice}
                                </div>
                              </div>
                            ) : enriched?.sellPrice ? (
                              <div>
                                <div className="text-xs text-[#8899ae]">
                                  Sell Value
                                </div>
                                <div className="font-mono-tabular text-sm font-semibold text-[#e5a93c]">
                                  {enriched.sellPrice}
                                </div>
                              </div>
                            ) : (
                              <div>
                                <div className="text-xs text-[#8899ae]">
                                  Availability
                                </div>
                                <div className="text-xs font-medium text-[#cbd5e1]">
                                  {item.rank ? `Rank ${item.rank} Stock` : "Vendor Stock"}
                                </div>
                              </div>
                            )}

                            <span className="text-xs font-medium text-[#38bdf8] group-hover:translate-x-0.5 transition-transform">
                              Inspect
                            </span>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            ))
          )}
        </div>
      </div>

      {/* Product Detail Inspection Modal */}
      {inspectedItem && (
        <div
          className="fixed inset-0 z-[2100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setInspectedItem(null)}
        >
          <div
            className="gzw-drawer-enter max-w-xl w-full rounded-2xl bg-[#0e131b] border border-white/[0.12] shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-white/[0.075] flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-medium text-[#e5a93c]">
                  {inspectedItem.vendor} ·{" "}
                  {inspectedItem.rank
                    ? `Loyalty Rank ${inspectedItem.rank}`
                    : "Special Stock"}{" "}
                  · {inspectedItem.type}
                </div>
                <h3 className="font-display text-lg font-semibold text-[#f8fafc] mt-0.5">
                  {inspectedItem.itemName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectedItem(null)}
                aria-label="Close item details"
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-[#94a3b8] hover:text-white hover:bg-white/[0.06]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Studio Product Showcase */}
              <div className="h-48 rounded-xl bg-[#0a0e14] border border-white/[0.07] flex items-center justify-center p-4">
                {inspectedEnrichment?.image &&
                !failedImgUrls[inspectedEnrichment.image] ? (
                  <img
                    src={inspectedEnrichment.image}
                    alt={inspectedItem.itemName}
                    referrerPolicy="no-referrer"
                    onError={() => markImgFailed(inspectedEnrichment.image!)}
                    className="max-h-40 w-auto object-contain drop-shadow-[0_10px_24px_rgba(0,0,0,0.85)]"
                  />
                ) : (
                  <ItemThumbnail
                    src={null}
                    alt={inspectedItem.itemName}
                    kindHint={`${inspectedItem.type} ${inspectedItem.shopGroup}`}
                    sizeClass="w-16 h-16"
                  />
                )}
              </div>

              {/* Price & Core Metadata Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="rounded-lg bg-[#0a0e14] border border-white/[0.06] p-3">
                  <div className="text-xs text-[#8899ae]">Buy Price</div>
                  <div className="font-mono-tabular text-base font-bold text-[#34d399] mt-0.5">
                    {inspectedBuyPrice || "Unlisted"}
                  </div>
                </div>
                <div className="rounded-lg bg-[#0a0e14] border border-white/[0.06] p-3">
                  <div className="text-xs text-[#8899ae]">Sell Value</div>
                  <div className="font-mono-tabular text-sm font-semibold text-[#e5a93c] mt-0.5">
                    {inspectedEnrichment?.sellPrice || "—"}
                  </div>
                </div>
                <div className="rounded-lg bg-[#0a0e14] border border-white/[0.06] p-3">
                  <div className="text-xs text-[#8899ae]">Grid Size</div>
                  <div className="font-mono-tabular text-sm font-semibold text-[#f1f5f9] mt-0.5">
                    {inspectedEnrichment?.gridSize || "—"}
                  </div>
                </div>
                <div className="rounded-lg bg-[#0a0e14] border border-white/[0.06] p-3">
                  <div className="text-xs text-[#8899ae]">Weight</div>
                  <div className="font-mono-tabular text-sm font-semibold text-[#f1f5f9] mt-0.5">
                    {inspectedEnrichment?.weight || "—"}
                  </div>
                </div>
              </div>

              {/* Technical Specifications */}
              {inspectedEnrichment &&
                (inspectedEnrichment.specs.length > 0 ||
                  inspectedEnrichment.manufacturer) && (
                  <div className="rounded-lg bg-[#0a0e14] border border-white/[0.06] p-3.5 space-y-2.5">
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#38bdf8]">
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      Specifications
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-[13px]">
                      {inspectedEnrichment.manufacturer && (
                        <div className="flex justify-between gap-2">
                          <span className="text-[#8899ae]">Manufacturer</span>
                          <span className="text-[#f1f5f9] font-medium text-right">
                            {inspectedEnrichment.manufacturer}
                          </span>
                        </div>
                      )}
                      {inspectedEnrichment.specs.map((sp) => (
                        <div
                          key={sp.label}
                          className="flex justify-between gap-2"
                        >
                          <span className="text-[#8899ae]">{sp.label}</span>
                          <span className="font-mono-tabular text-[#f1f5f9] font-medium text-right">
                            {sp.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {inspectedEnrichment?.description && (
                <p className="text-[13px] text-[#c4d0df] leading-relaxed rounded-lg bg-[#0a0e14] border border-white/[0.06] p-3.5">
                  {inspectedEnrichment.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
