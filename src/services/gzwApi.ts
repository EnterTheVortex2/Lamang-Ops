import { GzwDataClient } from "@zoniboy/gzw-data-client";
import {
  isValidTacticalImage,
  resolveTacticalImageUrl,
} from "../utils/imageUtils";

export const API_ROOT = "https://gzw-data.dev/api/v1";

const CACHE_KEY = "lamang_ops_gzw_api_cache_v10";
const SPAWN_LOOKUP_CACHE_KEY = "lamang_ops_spawn_lookup_v4";

const PRIORITY_DATASETS = [
  "hideout_modules",
  "disassembly_recipes",
  "disassembly_material",
  "crafting_material",
  "production_material",
  "military_material",
  "building_material",
  "workshop_supplies",
  "laboratory_supplies",
  "electronics",
  "tools",
  "keys",
  "keycards",
  "loot_container",
  "regions",
  "vendors",
  "vendor_stock",
  "tasks",
  "main_task",
  "side_task",
  "hidden_task",
  "contract",
  "contracts",
  "task_items",
  "task_guides",
  "intels",
];

const MAX_PAGES_BY_DATASET: Record<string, number> = {
  vendor_stock: 25,
  tasks: 12,
  side_task: 6,
  keys: 5,
  task_items: 5,
  task_guides: 5,
  intels: 10,
  contract: 4,
  contracts: 4,
  loot_container: 4,
};

// Direct SDK fallback client (used when backend /api/gzw/* proxy is unavailable, e.g. GitHub Pages)
export const gzwClient = new GzwDataClient({
  baseUrl: API_ROOT,
  cache: { ttlMs: 5 * 60 * 1000, maxEntries: 200 },
  retries: 1,
  timeoutMs: 8000,
});

export function isStaticHostingEnvironment(): boolean {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname.toLowerCase();
  return (
    host.endsWith(".github.io") ||
    host === "github.io" ||
    window.location.protocol === "file:"
  );
}

export interface NormalizedApiRecord {
  uid: string;
  id: string;
  dataset: string;
  name: string;
  description: string;
  category: string;
  image: string | null;
  weight?: string;
  gridSize?: string;
  sellPrice?: string;
  manufacturer?: string;
  room?: string;
  module?: string;
  level?: number;
  requirements?: { name: string; quantity: number }[];
  benefit?: string;
  spawnNotes: string[];
  coords: { x: number; y: number } | null;
  raw: Record<string, unknown>;
}

export interface ApiCachePayload {
  timestamp: string;
  discoveredDatasets: string[];
  totalAvailableDatasets: number;
  datasets: Record<string, NormalizedApiRecord[]>;
  proxySource?: string;
}

export interface LootSpawnSource {
  table: string;
  source: string;
  chancePerRoll?: number;
}

export interface ItemSpawnLookupResult {
  query: string;
  foundIn: LootSpawnSource[];
  matchedModules: { name: string; room?: string; quantity?: number }[];
  fetchedAt: string;
}

/* Safe localStorage helpers with in-memory fallback */
const memoryStorage = new Map<string, string>();

export function safeStorageGet<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    const mem = memoryStorage.get(key);
    if (mem !== undefined) {
      try {
        return JSON.parse(mem) as T;
      } catch {
        return fallback;
      }
    }
    return fallback;
  }
}

export function safeStorageSet(key: string, value: unknown): void {
  const serialized = JSON.stringify(value);
  memoryStorage.set(key, serialized);
  try {
    window.localStorage.setItem(key, serialized);
  } catch {
    // Kept in memoryStorage
  }
}

export function loadCachedApiData(): ApiCachePayload | null {
  const cached = safeStorageGet<ApiCachePayload | null>(CACHE_KEY, null);
  if (cached && cached.datasets && Object.keys(cached.datasets).length > 0) {
    return cached;
  }
  return null;
}

function extractSpawnNotesClient(raw: Record<string, unknown>): string[] {
  const notes: string[] = [];
  const candidateKeys = [
    "spawn",
    "spawns",
    "spawn_location",
    "spawn_locations",
    "location",
    "locations",
    "found_in",
    "region",
    "regions",
    "lz_callsign",
    "locals_type",
  ];
  for (const key of candidateKeys) {
    const val = raw[key];
    if (!val) continue;
    if (typeof val === "string" && val.trim()) {
      notes.push(val.trim());
    } else if (Array.isArray(val)) {
      for (const item of val) {
        if (typeof item === "string" && item.trim()) {
          notes.push(item.trim());
        } else if (item && typeof item === "object") {
          const obj = item as Record<string, unknown>;
          const label = [obj.source, obj.table].filter(Boolean).join(" · ");
          if (label) notes.push(label);
        }
      }
    }
  }
  return Array.from(new Set(notes));
}

function extractCoordsClient(
  raw: Record<string, unknown>
): { x: number; y: number } | null {
  if (typeof raw.x === "number" && typeof raw.y === "number") {
    return { x: raw.x, y: raw.y };
  }
  const coordinates = raw.coordinates as Record<string, unknown> | undefined;
  if (
    coordinates &&
    typeof coordinates.x === "number" &&
    typeof coordinates.y === "number"
  ) {
    return { x: coordinates.x, y: coordinates.y };
  }
  if (Array.isArray(raw.coords) && raw.coords.length >= 2) {
    const x = Number(raw.coords[0]);
    const y = Number(raw.coords[1]);
    if (!Number.isNaN(x) && !Number.isNaN(y)) return { x, y };
  }
  return null;
}

function extractRequirementsClient(
  raw: Record<string, unknown>
): { name: string; quantity: number }[] | undefined {
  const list = (raw.requirements || raw.build_materials) as unknown;
  if (!Array.isArray(list)) return undefined;
  const parsed: { name: string; quantity: number }[] = [];
  for (const entry of list) {
    if (entry && typeof entry === "object") {
      const obj = entry as Record<string, unknown>;
      const name = String(obj.name || obj.id || "").trim();
      const qty = Number(obj.quantity ?? obj.amount ?? 1);
      if (name) {
        parsed.push({ name, quantity: Number.isNaN(qty) ? 1 : qty });
      }
    }
  }
  return parsed.length > 0 ? parsed : undefined;
}

function normalizeRecordClient(
  dataset: string,
  raw: Record<string, unknown>,
  index: number
): NormalizedApiRecord {
  const id = String(raw.id || `${dataset}_${index}`);
  const name = String(
    raw.name ||
      raw.title ||
      raw.item_name ||
      raw.module_name ||
      raw.id ||
      `${dataset} #${index + 1}`
  );
  const description = String(
    raw.description || raw.desc || raw.summary || raw.requirements_text || ""
  );
  const category = String(
    raw.type || raw.category || raw.room || raw.slot || dataset
  );
  const rawImg =
    typeof raw.image === "string" && raw.image.trim() ? raw.image.trim() : null;
  const image = resolveTacticalImageUrl(rawImg, name);

  let sellPrice: string | undefined;
  if (typeof raw.sell_price === "string") {
    sellPrice = raw.sell_price;
  } else if (Array.isArray(raw.sell_prices) && raw.sell_prices.length > 0) {
    const first = raw.sell_prices[0] as Record<string, unknown>;
    if (first && first.price !== undefined) {
      const vendors = Array.isArray(first.vendors)
        ? first.vendors.join(", ")
        : "";
      sellPrice = `$${first.price}${vendors ? ` (${vendors})` : ""}`;
    }
  }

  return {
    uid: `${dataset}::${id}`,
    id,
    dataset,
    name,
    description,
    category,
    image,
    weight: typeof raw.weight === "string" ? raw.weight : undefined,
    gridSize: typeof raw.grid_size === "string" ? raw.grid_size : undefined,
    sellPrice,
    manufacturer:
      typeof raw.manufacturer === "string" ? raw.manufacturer : undefined,
    room: typeof raw.room === "string" ? raw.room : undefined,
    module: typeof raw.module === "string" ? raw.module : undefined,
    level: typeof raw.level === "number" ? raw.level : undefined,
    requirements: extractRequirementsClient(raw),
    benefit: typeof raw.function === "string" ? raw.function : undefined,
    spawnNotes: extractSpawnNotesClient(raw),
    coords: extractCoordsClient(raw),
    raw,
  };
}

async function fetchDirectFromGzw(): Promise<ApiCachePayload> {
  const datasets: Record<string, NormalizedApiRecord[]> = {};
  const discoveredDatasets: string[] = [];

  const imageMap = new Map<string, string>();
  try {
    const imgRes = await fetch(`${API_ROOT}/images`, {
      signal: AbortSignal.timeout(9000),
    });
    if (imgRes.ok) {
      const imgJson = (await imgRes.json()) as {
        images?: Record<string, string>;
      };
      if (imgJson?.images && typeof imgJson.images === "object") {
        for (const [k, url] of Object.entries(imgJson.images)) {
          if (isValidTacticalImage(url)) {
            imageMap.set(k.trim().toLowerCase(), url.trim());
          }
        }
      }
    }
  } catch {
    // optional /images enrichment
  }

  const batchSize = 4;
  for (let i = 0; i < PRIORITY_DATASETS.length; i += batchSize) {
    const slice = PRIORITY_DATASETS.slice(i, i + batchSize);
    const settled = await Promise.allSettled(
      slice.map(async (dataset) => {
        const maxPages = MAX_PAGES_BY_DATASET[dataset] ?? 5;
        const rows: NormalizedApiRecord[] = [];
        let page = 1;

        while (page <= maxPages) {
          const upstreamRes = await fetch(
            `${API_ROOT}/${encodeURIComponent(dataset)}?page=${page}`,
            { signal: AbortSignal.timeout(10000) }
          );
          if (!upstreamRes.ok) break;
          const resp = (await upstreamRes.json()) as {
            data?: Record<string, unknown>[];
            totalPages?: number;
            perPage?: number;
          };
          const batch = Array.isArray(resp.data) ? resp.data : [];
          if (batch.length === 0) break;

          const pageSize = resp.perPage || batch.length || 50;
          rows.push(
            ...batch.map((item, idx) =>
              normalizeRecordClient(dataset, item, (page - 1) * pageSize + idx)
            )
          );

          if (resp.totalPages && page >= resp.totalPages) break;
          page += 1;
        }

        const cleanRows = rows
          .filter((r) => !r.name.startsWith("<DEV>"))
          .map((r) => {
            if (r.image) return r;
            const byName =
              imageMap.get(r.name.trim().toLowerCase()) ||
              imageMap.get(r.id.trim().toLowerCase()) ||
              null;
            return byName
              ? { ...r, image: resolveTacticalImageUrl(byName, r.name) }
              : r;
          });
        return { dataset, rows: cleanRows };
      })
    );

    for (const res of settled) {
      if (res.status === "fulfilled" && res.value.rows.length > 0) {
        datasets[res.value.dataset] = res.value.rows;
        discoveredDatasets.push(res.value.dataset);
      }
    }
  }

  if (discoveredDatasets.length === 0) {
    throw new Error("Could not fetch datasets directly from gzw-data.dev");
  }

  return {
    timestamp: new Date().toISOString(),
    discoveredDatasets,
    totalAvailableDatasets: discoveredDatasets.length,
    datasets,
    proxySource: "direct-browser",
  };
}

export async function discoverAndFetchAllDatasets(
  forceRefresh = false
): Promise<ApiCachePayload> {
  // On static hosts like GitHub Pages, fetch directly from gzw-data.dev (CORS enabled)
  if (!isStaticHostingEnvironment()) {
    try {
      const res = await fetch(
        `/api/gzw/bootstrap${forceRefresh ? "?force=1" : ""}`,
        { headers: { Accept: "application/json" } }
      );
      const ct = res.headers.get("content-type") || "";
      if (res.ok && ct.includes("application/json")) {
        const payload = (await res.json()) as ApiCachePayload;
        if (
          payload &&
          payload.datasets &&
          Object.keys(payload.datasets).length > 0
        ) {
          safeStorageSet(CACHE_KEY, payload);
          return payload;
        }
      }
    } catch {
      // Fall through to direct browser fetch
    }
  }

  const directPayload = await fetchDirectFromGzw();
  safeStorageSet(CACHE_KEY, directPayload);
  return directPayload;
}

/**
 * Live per-material spawn & loot-table lookup via /api/gzw/search (with direct gzw-data.dev fallback).
 */
export async function lookupMaterialSpawnIntel(
  itemName: string
): Promise<ItemSpawnLookupResult> {
  const cache = safeStorageGet<Record<string, ItemSpawnLookupResult>>(
    SPAWN_LOOKUP_CACHE_KEY,
    {}
  );
  const cacheKey = itemName.trim().toLowerCase();
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  const foundIn: LootSpawnSource[] = [];
  const matchedModules: { name: string; room?: string; quantity?: number }[] =
    [];

  try {
    let results: Record<string, Record<string, unknown>[]> = {};
    let loadedViaProxy = false;

    if (!isStaticHostingEnvironment()) {
      try {
        const res = await fetch(
          `/api/gzw/search?q=${encodeURIComponent(itemName)}`
        );
        const ct = res.headers.get("content-type") || "";
        if (res.ok && ct.includes("application/json")) {
          const json = (await res.json()) as {
            results?: Record<string, Record<string, unknown>[]>;
          };
          results = json.results || {};
          loadedViaProxy = true;
        }
      } catch {
        loadedViaProxy = false;
      }
    }

    if (!loadedViaProxy) {
      const resp = await gzwClient.search(itemName, { limit: 15 });
      results = (resp?.results || {}) as Record<
        string,
        Record<string, unknown>[]
      >;
    }

    const lootItems = results.gamedata_loot_by_item || [];
    for (const entry of lootItems) {
      const entryName = String(entry.name || "").toLowerCase();
      if (
        entryName === cacheKey ||
        entryName.includes(cacheKey) ||
        cacheKey.includes(entryName)
      ) {
        const list = Array.isArray(entry.found_in) ? entry.found_in : [];
        for (const f of list) {
          if (f && typeof f === "object") {
            const obj = f as Record<string, unknown>;
            foundIn.push({
              table: String(obj.table || "Loot Table"),
              source: String(obj.source || "World Container"),
              chancePerRoll:
                typeof obj.chance_per_roll === "number"
                  ? obj.chance_per_roll
                  : undefined,
            });
          }
        }
      }
    }

    const modules = results.hideout_modules || [];
    for (const mod of modules) {
      const reqs = Array.isArray(mod.requirements) ? mod.requirements : [];
      const matchingReq = reqs.find(
        (r: Record<string, unknown>) =>
          String(r.name || "").toLowerCase() === cacheKey
      ) as Record<string, unknown> | undefined;
      matchedModules.push({
        name: String(mod.name || "Hideout Module"),
        room: typeof mod.room === "string" ? mod.room : undefined,
        quantity: matchingReq ? Number(matchingReq.quantity || 1) : undefined,
      });
    }
  } catch {
    // Graceful empty result if upstream unavailable
  }

  const result: ItemSpawnLookupResult = {
    query: itemName,
    foundIn: foundIn.slice(0, 12),
    matchedModules,
    fetchedAt: new Date().toISOString(),
  };

  cache[cacheKey] = result;
  safeStorageSet(SPAWN_LOOKUP_CACHE_KEY, cache);
  return result;
}

export async function searchLiveApi(
  query: string
): Promise<Record<string, Record<string, unknown>[]>> {
  const q = query.trim();
  if (!q) return {};

  if (!isStaticHostingEnvironment()) {
    try {
      const res = await fetch(`/api/gzw/search?q=${encodeURIComponent(q)}`);
      const ct = res.headers.get("content-type") || "";
      if (res.ok && ct.includes("application/json")) {
        const json = (await res.json()) as {
          results?: Record<string, Record<string, unknown>[]>;
        };
        return json.results || {};
      }
    } catch {
      // Fall through to direct browser SDK search
    }
  }

  try {
    const resp = await gzwClient.search(q, { limit: 20 });
    return (resp?.results || {}) as Record<
      string,
      Record<string, unknown>[]
    >;
  } catch {
    return {};
  }
}

const categoryDatasetCache = new Map<string, NormalizedApiRecord[]>();
const inflightCategoryLoads = new Map<
  string,
  Promise<NormalizedApiRecord[]>
>();

/**
 * Lazy-load full records (thumbnails, prices, weights, combat/medical specs)
 * for any item category (e.g. weapons, ammo, medical, plate_carriers).
 */
export async function fetchCategoryDataset(
  datasetName: string
): Promise<NormalizedApiRecord[]> {
  const dataset = datasetName.trim().toLowerCase();
  if (!/^[a-z0-9_]+$/.test(dataset)) return [];

  const cached = categoryDatasetCache.get(dataset);
  if (cached) return cached;

  const inflight = inflightCategoryLoads.get(dataset);
  if (inflight) return inflight;

  const task = (async (): Promise<NormalizedApiRecord[]> => {
    if (!isStaticHostingEnvironment()) {
      try {
        const res = await fetch(
          `/api/gzw/dataset/${encodeURIComponent(dataset)}`,
          { headers: { Accept: "application/json" } }
        );
        const ct = res.headers.get("content-type") || "";
        if (res.ok && ct.includes("application/json")) {
          const json = (await res.json()) as {
            records?: NormalizedApiRecord[];
          };
          const recs = Array.isArray(json.records) ? json.records : [];
          if (recs.length > 0) {
            categoryDatasetCache.set(dataset, recs);
            return recs;
          }
        }
      } catch {
        // Fall through to direct browser fetch
      }
    }

    const rows: NormalizedApiRecord[] = [];
    let page = 1;
    const maxPages = 12;
    while (page <= maxPages) {
      try {
        const upstreamRes = await fetch(
          `${API_ROOT}/${encodeURIComponent(dataset)}?page=${page}`,
          { signal: AbortSignal.timeout(10000) }
        );
        if (!upstreamRes.ok) break;
        const resp = (await upstreamRes.json()) as {
          data?: Record<string, unknown>[];
          totalPages?: number;
          perPage?: number;
        };
        const batch = Array.isArray(resp.data) ? resp.data : [];
        if (batch.length === 0) break;

        const pageSize = resp.perPage || batch.length || 50;
        rows.push(
          ...batch.map((item, idx) =>
            normalizeRecordClient(dataset, item, (page - 1) * pageSize + idx)
          )
        );
        if (resp.totalPages && page >= resp.totalPages) break;
        page += 1;
      } catch {
        break;
      }
    }

    const clean = rows.filter((r) => !r.name.startsWith("<DEV>"));
    categoryDatasetCache.set(dataset, clean);
    return clean;
  })();

  inflightCategoryLoads.set(dataset, task);
  try {
    return await task;
  } finally {
    inflightCategoryLoads.delete(dataset);
  }
}

export interface TaskWikiImage {
  url: string;
  fullUrl: string;
  caption: string;
}

export interface TaskWikiIntel {
  title: string;
  wikiUrl: string;
  walkthroughSteps: string[];
  tips: string[];
  images: TaskWikiImage[];
  fetchedAt: string;
}

const TASK_WIKI_CACHE_KEY = "lamang_ops_task_wiki_v1";
const taskWikiMemCache = new Map<string, TaskWikiIntel>();
const inflightTaskWiki = new Map<string, Promise<TaskWikiIntel>>();

function decodeEntitiesClient(str: string): string {
  return str
    .replace(/&#(\d+);/g, (_m, dec) => String.fromCharCode(Number(dec)))
    .replace(/&#x([0-9a-f]+);/gi, (_m, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    )
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

function stripHtmlClient(html: string): string {
  return decodeEntitiesClient(
    html
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/\[edit\]/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function parseWikiHtmlClient(
  taskName: string,
  pageTitle: string,
  html: string
): TaskWikiIntel {
  const images: TaskWikiImage[] = [];
  const seenUrls = new Set<string>();

  const cleanImageUrl = (rawUrl: string): string =>
    rawUrl
      .replace(/\/revision\/latest\/scale-to-width-down\/\d+/i, "/revision/latest")
      .replace(/\/revision\/latest\/window-crop\/[^?]+/i, "/revision/latest");

  const isUseful = (url: string, imgName: string): boolean => {
    const lower = `${url} ${imgName}`.toLowerCase();
    if (!url.startsWith("https://static.wikia.nocookie.net/")) return false;
    if (
      lower.includes("_banner") ||
      lower.includes("red_cross") ||
      lower.includes("missing_icon") ||
      lower.includes("check_mark") ||
      lower.includes("_icon.") ||
      lower.includes("site-logo")
    ) {
      return false;
    }
    if (/scale-to-width-down\/(?:1[0-9]|[1-5][0-9])\b/.test(url)) return false;
    return true;
  };

  for (const chunk of html.split('<div class="wikia-gallery-item"').slice(1)) {
    const block = chunk.slice(0, 2600);
    const srcMatch = block.match(
      /(?:data-src|src)="(https:\/\/static\.wikia\.nocookie\.net\/[^"]+)"/i
    );
    if (!srcMatch) continue;
    const rawThumb = srcMatch[1];
    const nameMatch = block.match(/data-image-name="([^"]+)"/i);
    const imgName = nameMatch ? decodeEntitiesClient(nameMatch[1]) : "";
    if (!isUseful(rawThumb, imgName)) continue;

    const fullUrl = cleanImageUrl(rawThumb);
    const dedup = fullUrl.split("?")[0];
    if (seenUrls.has(dedup)) continue;
    seenUrls.add(dedup);

    const capMatch = block.match(/class="lightbox-caption"[^>]*>([\s\S]*?)<\/div>/i);
    const dataCapMatch = block.match(/data-caption="([^"]+)"/i);
    const altMatch = block.match(/alt="([^"]+)"/i);
    let caption = stripHtmlClient(
      capMatch?.[1] || dataCapMatch?.[1] || altMatch?.[1] || ""
    );
    if (!caption && imgName) {
      caption = imgName
        .replace(/\.(png|jpg|jpeg|webp)$/i, "")
        .replace(/[_-]+/g, " ")
        .trim();
    }
    images.push({
      url: rawThumb,
      fullUrl,
      caption: caption || `${taskName} location reference`,
    });
  }

  for (const fm of html.matchAll(/<figure\b[\s\S]*?<\/figure>/gi)) {
    const block = fm[0];
    const srcMatch = block.match(
      /(?:data-src|src)="(https:\/\/static\.wikia\.nocookie\.net\/[^"]+)"/i
    );
    if (!srcMatch) continue;
    const rawThumb = srcMatch[1];
    const nameMatch = block.match(/data-image-name="([^"]+)"/i);
    const imgName = nameMatch ? decodeEntitiesClient(nameMatch[1]) : "";
    if (!isUseful(rawThumb, imgName)) continue;

    const fullUrl = cleanImageUrl(rawThumb);
    const dedup = fullUrl.split("?")[0];
    if (seenUrls.has(dedup)) continue;
    seenUrls.add(dedup);

    const figCap = block.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i);
    const altMatch = block.match(/alt="([^"]+)"/i);
    let caption = stripHtmlClient(figCap?.[1] || altMatch?.[1] || "");
    if (!caption && imgName) {
      caption = imgName
        .replace(/\.(png|jpg|jpeg|webp)$/i, "")
        .replace(/[_-]+/g, " ")
        .trim();
    }
    images.push({
      url: rawThumb,
      fullUrl,
      caption: caption || `${taskName} location reference`,
    });
  }

  const walkthroughSteps: string[] = [];
  const tips: string[] = [];
  const extractSec = (names: string[]) => {
    for (const n of names) {
      const re = new RegExp(
        `<h[23][^>]*>[\\s\\S]*?${n}[\\s\\S]*?<\\/h[23]>([\\s\\S]*?)(?=<h[23]\\b|$)`,
        "i"
      );
      const m = html.match(re);
      if (m && m[1]) return m[1];
    }
    return "";
  };

  const wtHtml = extractSec(["Walkthrough", "Guide", "Strategy", "Mission Guide"]);
  if (wtHtml) {
    const cleaned = wtHtml
      .replace(/<div class="wikia-gallery[\s\S]*?<\/div>\s*<\/div>/gi, " ")
      .replace(/<figure[\s\S]*?<\/figure>/gi, " ");
    for (const b of cleaned.matchAll(/<(?:li|p)[^>]*>([\s\S]*?)<\/(?:li|p)>/gi)) {
      const txt = stripHtmlClient(b[1]);
      if (
        txt.length >= 16 &&
        !/^(?:see also|notes?|gallery|video|rewards?)$/i.test(txt) &&
        !walkthroughSteps.some((s) => s.toLowerCase() === txt.toLowerCase())
      ) {
        walkthroughSteps.push(txt);
      }
    }
  }

  const tipsHtml = extractSec(["Tips", "Notes", "Trivia"]);
  if (tipsHtml) {
    for (const b of tipsHtml.matchAll(/<(?:li|p)[^>]*>([\s\S]*?)<\/(?:li|p)>/gi)) {
      const txt = stripHtmlClient(b[1]);
      if (txt.length >= 16 && tips.length < 4) tips.push(txt);
    }
  }

  const slug = encodeURIComponent(pageTitle.replace(/\s+/g, "_"));
  return {
    title: pageTitle || taskName,
    wikiUrl: `https://gray-zone-warfare.fandom.com/wiki/${slug}`,
    walkthroughSteps: walkthroughSteps.slice(0, 14),
    tips,
    images: images.slice(0, 14),
    fetchedAt: new Date().toISOString(),
  };
}

/**
 * Fetches live building/room location screenshots & community walkthrough steps
 * from Gray Zone Warfare Wiki (via Express proxy on server or CORS-enabled MediaWiki API on static hosts).
 */
export async function fetchTaskWalkthroughIntel(
  taskName: string,
  force = false
): Promise<TaskWikiIntel> {
  const key = taskName.trim().toLowerCase();
  if (!force) {
    const mem = taskWikiMemCache.get(key);
    if (mem) return mem;

    const stored = safeStorageGet<Record<string, TaskWikiIntel>>(
      TASK_WIKI_CACHE_KEY,
      {}
    );
    const entry = stored[key];
    if (entry) {
      const ageMs = Date.now() - new Date(entry.fetchedAt).getTime();
      if (ageMs < 24 * 60 * 60 * 1000) {
        taskWikiMemCache.set(key, entry);
        return entry;
      }
    }
  }

  const inflight = inflightTaskWiki.get(key);
  if (inflight && !force) return inflight;

  const task = (async (): Promise<TaskWikiIntel> => {
    if (!isStaticHostingEnvironment()) {
      try {
        const res = await fetch(
          `/api/gzw/task-wiki?name=${encodeURIComponent(taskName)}${
            force ? "&force=1" : ""
          }`,
          { headers: { Accept: "application/json" } }
        );
        const ct = res.headers.get("content-type") || "";
        if (res.ok && ct.includes("application/json")) {
          const data = (await res.json()) as TaskWikiIntel;
          taskWikiMemCache.set(key, data);
          const stored = safeStorageGet<Record<string, TaskWikiIntel>>(
            TASK_WIKI_CACHE_KEY,
            {}
          );
          stored[key] = data;
          safeStorageSet(TASK_WIKI_CACHE_KEY, stored);
          return data;
        }
      } catch {
        // Fall through to direct CORS wiki API
      }
    }

    try {
      const wikiUrl = `https://gray-zone-warfare.fandom.com/api.php?action=parse&page=${encodeURIComponent(
        taskName.replace(/\s+/g, "_")
      )}&prop=text|displaytitle&redirects=1&format=json&origin=*`;
      const res = await fetch(wikiUrl, { signal: AbortSignal.timeout(9000) });
      if (res.ok) {
        const json = (await res.json()) as {
          parse?: { title?: string; text?: { "*"?: string } };
        };
        const html = json.parse?.text?.["*"];
        if (html) {
          const parsed = parseWikiHtmlClient(
            taskName,
            json.parse?.title || taskName,
            html
          );
          taskWikiMemCache.set(key, parsed);
          const stored = safeStorageGet<Record<string, TaskWikiIntel>>(
            TASK_WIKI_CACHE_KEY,
            {}
          );
          stored[key] = parsed;
          safeStorageSet(TASK_WIKI_CACHE_KEY, stored);
          return parsed;
        }
      }
    } catch {
      // Fallback empty
    }

    return {
      title: taskName,
      wikiUrl: `https://gray-zone-warfare.fandom.com/wiki/${encodeURIComponent(
        taskName.replace(/\s+/g, "_")
      )}`,
      walkthroughSteps: [],
      tips: [],
      images: [],
      fetchedAt: new Date().toISOString(),
    };
  })();

  inflightTaskWiki.set(key, task);
  try {
    return await task;
  } finally {
    inflightTaskWiki.delete(key);
  }
}

