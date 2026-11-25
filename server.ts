import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GzwDataClient } from "@zoniboy/gzw-data-client";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT || 3000);

const API_ROOT = "https://gzw-data.dev/api/v1";
const DATASET_MATCH_PATTERN =
  /^(hideout|hideout_modules|gamedata_hideout_rooms|gamedata_hideout_devices|gamedata_hideout_materials|gamedata_hideout_recipes|disassembly_recipes|building_material|workshop_supplies|laboratory_supplies|electronics|crafting_material|disassembly_material|production_material|military_material|tools|keys|keycards|loot_container|loot_containers|regions|vendors|vendor_stock|tasks|main_task|side_task|hidden_task|contract|contracts|task_items|task_guides|intels)$/i;

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

const gzwClient = new GzwDataClient({
  baseUrl: API_ROOT,
  cache: { ttlMs: 10 * 60 * 1000, maxEntries: 300 },
  retries: 2,
  timeoutMs: 10000,
});

interface NormalizedApiRecord {
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

interface BootstrapCachePayload {
  timestamp: string;
  discoveredDatasets: string[];
  totalAvailableDatasets: number;
  datasets: Record<string, NormalizedApiRecord[]>;
}

let cachedBootstrap: { data: BootstrapCachePayload; fetchedAtMs: number } | null = null;
let inflightBootstrap: Promise<BootstrapCachePayload> | null = null;
const BOOTSTRAP_TTL_MS = 10 * 60 * 1000;
const FORCE_REFRESH_COOLDOWN_MS = 15 * 1000;

const searchCache = new Map<string, { data: unknown; fetchedAtMs: number }>();
const datasetCache = new Map<
  string,
  { records: NormalizedApiRecord[]; fetchedAtMs: number }
>();
const SEARCH_TTL_MS = 10 * 60 * 1000;

function extractSpawnNotes(raw: Record<string, unknown>): string[] {
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

function extractCoords(raw: Record<string, unknown>): { x: number; y: number } | null {
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

function extractRequirements(
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

function toProxiedImageUrl(rawUrl: string): string {
  try {
    const parsed = new URL(rawUrl);
    if (
      parsed.protocol === "https:" &&
      (parsed.hostname.endsWith(".wikia.nocookie.net") ||
        parsed.hostname === "static.wikia.nocookie.net")
    ) {
      return `/api/gzw/image?url=${encodeURIComponent(rawUrl)}`;
    }
  } catch {
    // keep original
  }
  return rawUrl;
}

function normalizeRecord(
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
  const category = String(raw.type || raw.category || raw.room || raw.slot || dataset);
  const rawImage =
    typeof raw.image === "string" && raw.image.trim() ? raw.image.trim() : null;
  const image =
    rawImage && !rawImage.toLowerCase().includes("missing_icon")
      ? toProxiedImageUrl(rawImage)
      : null;

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
    requirements: extractRequirements(raw),
    benefit: typeof raw.function === "string" ? raw.function : undefined,
    spawnNotes: extractSpawnNotes(raw),
    coords: extractCoords(raw),
    raw,
  };
}

async function fetchBootstrapFromGzw(force = false): Promise<BootstrapCachePayload> {
  const now = Date.now();
  if (cachedBootstrap) {
    const age = now - cachedBootstrap.fetchedAtMs;
    if (!force && age < BOOTSTRAP_TTL_MS) {
      return cachedBootstrap.data;
    }
    if (force && age < FORCE_REFRESH_COOLDOWN_MS) {
      return cachedBootstrap.data;
    }
  }

  if (inflightBootstrap) {
    return inflightBootstrap;
  }

  inflightBootstrap = (async () => {
    if (force) {
      gzwClient.clearCache();
    }

    const discoveredSet = new Set<string>(PRIORITY_DATASETS);
    let totalAvailableDatasets = 0;

    try {
      const meta = await gzwClient.metadata();
      totalAvailableDatasets = meta.datasetCount || meta.datasets?.length || 0;
      for (const ds of meta.datasets || []) {
        if (DATASET_MATCH_PATTERN.test(ds.name)) {
          discoveredSet.add(ds.name);
        }
      }
    } catch {
      try {
        const stats = await gzwClient.stats();
        const keys = Object.keys(stats || {});
        totalAvailableDatasets = keys.length;
        keys.forEach((k) => {
          if (DATASET_MATCH_PATTERN.test(k)) discoveredSet.add(k);
        });
      } catch {
        // Use PRIORITY_DATASETS
      }
    }

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
            if (
              typeof url === "string" &&
              url.trim() &&
              !url.toLowerCase().includes("missing_icon")
            ) {
              imageMap.set(k.trim().toLowerCase(), url.trim());
            }
          }
        }
      }
    } catch {
      // Optional /images lookup
    }

    const targetDatasets = Array.from(discoveredSet);
    const datasets: Record<string, NormalizedApiRecord[]> = {};
    const activeEndpoints: string[] = [];

    const batchSize = 4;
    for (let i = 0; i < targetDatasets.length; i += batchSize) {
      const slice = targetDatasets.slice(i, i + batchSize);
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
                normalizeRecord(dataset, item, (page - 1) * pageSize + idx)
              )
            );

            if (resp.totalPages && page >= resp.totalPages) break;
            page += 1;
          }

          const cleanRows = rows
            .filter((r) => !r.name.startsWith("<DEV>"))
            .map((r) => {
              if (r.image) return r;
              const matched =
                imageMap.get(r.name.trim().toLowerCase()) ||
                imageMap.get(r.id.trim().toLowerCase()) ||
                null;
              return matched ? { ...r, image: toProxiedImageUrl(matched) } : r;
            });
          return { dataset, rows: cleanRows };
        })
      );

      for (const result of settled) {
        if (result.status === "fulfilled" && result.value.rows.length > 0) {
          datasets[result.value.dataset] = result.value.rows;
          activeEndpoints.push(result.value.dataset);
        }
      }
    }

    if (activeEndpoints.length === 0) {
      throw new Error("Could not fetch datasets from gzw-data.dev");
    }

    const payload: BootstrapCachePayload = {
      timestamp: new Date().toISOString(),
      discoveredDatasets: activeEndpoints,
      totalAvailableDatasets: totalAvailableDatasets || activeEndpoints.length,
      datasets,
    };

    cachedBootstrap = { data: payload, fetchedAtMs: Date.now() };
    return payload;
  })();

  try {
    return await inflightBootstrap;
  } finally {
    inflightBootstrap = null;
  }
}

const TILE_CDN_BASE = "https://cdn.gzwtacmap.com/0.5/lamang";
const TRANSPARENT_TILE_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
  "base64"
);
const tileCache = new Map<string, { buf: Buffer; isEmpty: boolean }>();
const MAX_TILE_CACHE = 800;

async function startServer() {
  const app = express();
  app.use(express.json());

  app.get("/api/map/tiles/:z/:x/:y.png", async (req, res) => {
    const z = Number(req.params.z);
    const x = Number(req.params.x);
    const y = Number(req.params.y);

    if (
      !Number.isInteger(z) ||
      !Number.isInteger(x) ||
      !Number.isInteger(y) ||
      z < 14 ||
      z > 19
    ) {
      res.setHeader("Content-Type", "image/png");
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.send(TRANSPARENT_TILE_PNG);
      return;
    }

    const key = `${z}/${x}/${y}`;
    const cached = tileCache.get(key);
    if (cached) {
      res.setHeader("Content-Type", "image/png");
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.send(cached.buf);
      return;
    }

    try {
      const upstream = await fetch(`${TILE_CDN_BASE}/${z}/${x}/${y}.png`, {
        signal: AbortSignal.timeout(8000),
      });

      if (!upstream.ok) {
        if (tileCache.size >= MAX_TILE_CACHE) {
          const firstKey = tileCache.keys().next().value;
          if (firstKey) tileCache.delete(firstKey);
        }
        tileCache.set(key, { buf: TRANSPARENT_TILE_PNG, isEmpty: true });
        res.setHeader("Content-Type", "image/png");
        res.setHeader("Cache-Control", "public, max-age=86400");
        res.send(TRANSPARENT_TILE_PNG);
        return;
      }

      const buf = Buffer.from(await upstream.arrayBuffer());
      if (tileCache.size >= MAX_TILE_CACHE) {
        const firstKey = tileCache.keys().next().value;
        if (firstKey) tileCache.delete(firstKey);
      }
      tileCache.set(key, { buf, isEmpty: false });

      res.setHeader("Content-Type", "image/png");
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.send(buf);
    } catch {
      res.setHeader("Content-Type", "image/png");
      res.send(TRANSPARENT_TILE_PNG);
    }
  });

  const imageCache = new Map<string, { buf: Buffer; contentType: string }>();
  const MAX_IMAGE_CACHE = 400;

  app.get("/api/gzw/image", async (req, res) => {
    const rawUrl = typeof req.query.url === "string" ? req.query.url.trim() : "";
    if (!rawUrl) {
      res.status(400).end();
      return;
    }

    let parsed: URL;
    try {
      parsed = new URL(rawUrl);
    } catch {
      res.status(400).end();
      return;
    }

    if (
      parsed.protocol !== "https:" ||
      (!parsed.hostname.endsWith(".wikia.nocookie.net") &&
        parsed.hostname !== "static.wikia.nocookie.net")
    ) {
      res.status(403).end();
      return;
    }

    const cached = imageCache.get(rawUrl);
    if (cached) {
      res.setHeader("Content-Type", cached.contentType);
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.send(cached.buf);
      return;
    }

    try {
      let upstream = await fetch(rawUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
          Referer: "https://gray-zone-warfare.fandom.com/",
          Accept: "image/avif,image/webp,image/png,image/*,*/*;q=0.8",
        },
        signal: AbortSignal.timeout(8000),
      });

      // Fallback: if Wikia renamed/moved the image (404), resolve live File: via Fandom API
      if (!upstream.ok && upstream.status === 404) {
        try {
          const pathMatch = parsed.pathname.match(/\/images\/[^/]+\/[^/]+\/([^/]+)/i);
          const rawFileName = pathMatch ? decodeURIComponent(pathMatch[1]) : "";
          if (rawFileName) {
            const expandedQuery = rawFileName
              .replace(/\.(png|jpg|jpeg|webp)$/i, "")
              .replace(/%28/gi, "(")
              .replace(/%29/gi, ")")
              .replace(/5\.56-\.?300/gi, "5.56x45mm .300")
              .replace(/Mag\((\d+)_rnds\)/gi, "$1-Round Magazine")
              .replace(/M-Lok_3/gi, "M-LOK Rail - 3 slot")
              .replace(/\bG17\b/gi, "Glock 17")
              .replace(/[_-]+/g, " ")
              .trim();
            const searchApi = `https://gray-zone-warfare.fandom.com/api.php?action=query&list=search&srnamespace=6&srsearch=${encodeURIComponent(expandedQuery)}&srlimit=3&format=json`;
            const sRes = await fetch(searchApi, { signal: AbortSignal.timeout(6000) });
            if (sRes.ok) {
              const sJson = (await sRes.json()) as {
                query?: { search?: { title: string }[] };
              };
              const hitTitle = sJson.query?.search?.[0]?.title;
              if (hitTitle) {
                const infoApi = `https://gray-zone-warfare.fandom.com/api.php?action=query&titles=${encodeURIComponent(hitTitle)}&prop=imageinfo&iiprop=url&format=json`;
                const iRes = await fetch(infoApi, { signal: AbortSignal.timeout(6000) });
                if (iRes.ok) {
                  const iJson = (await iRes.json()) as {
                    query?: { pages?: Record<string, { imageinfo?: { url?: string }[] }> };
                  };
                  const liveUrl = Object.values(iJson.query?.pages || {})[0]?.imageinfo?.[0]?.url;
                  if (liveUrl && liveUrl.startsWith("https://static.wikia.nocookie.net/")) {
                    upstream = await fetch(liveUrl, {
                      headers: {
                        "User-Agent":
                          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
                        Referer: "https://gray-zone-warfare.fandom.com/",
                        Accept: "image/avif,image/webp,image/png,image/*,*/*;q=0.8",
                      },
                      signal: AbortSignal.timeout(8000),
                    });
                  }
                }
              }
            }
          }
        } catch {
          // ignore fallback error
        }
      }

      if (!upstream.ok) {
        res.status(upstream.status).end();
        return;
      }
      const contentType = upstream.headers.get("content-type") || "image/png";
      if (!contentType.startsWith("image/")) {
        res.status(415).end();
        return;
      }
      const buf = Buffer.from(await upstream.arrayBuffer());
      if (imageCache.size >= MAX_IMAGE_CACHE) {
        const firstKey = imageCache.keys().next().value;
        if (firstKey) imageCache.delete(firstKey);
      }
      imageCache.set(rawUrl, { buf, contentType });
      res.setHeader("Content-Type", contentType);
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.send(buf);
    } catch {
      res.status(502).end();
    }
  });

  app.get("/api/gzw/health", (_req, res) => {
    const recordCount = cachedBootstrap
      ? Object.values(cachedBootstrap.data.datasets).reduce(
          (acc, list) => acc + list.length,
          0
        )
      : 0;
    res.json({
      ok: true,
      cached: !!cachedBootstrap,
      cachedAt: cachedBootstrap?.data.timestamp || null,
      datasetCount: cachedBootstrap?.data.discoveredDatasets.length || 0,
      recordCount,
    });
  });

  app.get("/api/gzw/bootstrap", async (req, res) => {
    const force = req.query.force === "1" || req.query.force === "true";
    const wasCached =
      !!cachedBootstrap &&
      !force &&
      Date.now() - cachedBootstrap.fetchedAtMs < BOOTSTRAP_TTL_MS;

    try {
      const payload = await fetchBootstrapFromGzw(force);
      res.json({
        ...payload,
        proxySource: wasCached ? "server-cache" : "live-upstream",
      });
    } catch (err) {
      if (cachedBootstrap) {
        res.json({
          ...cachedBootstrap.data,
          proxySource: "stale-cache",
        });
        return;
      }
      res.status(502).json({
        error: err instanceof Error ? err.message : "Failed to reach gzw-data.dev",
      });
    }
  });

  app.get("/api/gzw/search", async (req, res) => {
    const q = String(req.query.q || "").trim();
    if (!q) {
      res.json({ query: "", results: {} });
      return;
    }

    const cacheKey = q.toLowerCase();
    const cached = searchCache.get(cacheKey);
    if (cached && Date.now() - cached.fetchedAtMs < SEARCH_TTL_MS) {
      res.json(cached.data);
      return;
    }

    try {
      const resp = await gzwClient.search(q, { limit: 20 });
      const data = { query: q, results: resp?.results || {} };
      searchCache.set(cacheKey, { data, fetchedAtMs: Date.now() });
      res.json(data);
    } catch (err) {
      if (cached) {
        res.json(cached.data);
        return;
      }
      res.status(502).json({
        query: q,
        results: {},
        error: err instanceof Error ? err.message : "Search failed",
      });
    }
  });

  app.get("/api/gzw/dataset/:name", async (req, res) => {
    const dataset = String(req.params.name || "").trim();
    if (!/^[a-z0-9_]+$/i.test(dataset)) {
      res.status(400).json({ error: "Invalid dataset name" });
      return;
    }

    const cached = datasetCache.get(dataset);
    if (cached && Date.now() - cached.fetchedAtMs < SEARCH_TTL_MS) {
      res.json({ dataset, records: cached.records });
      return;
    }

    try {
      const records: NormalizedApiRecord[] = [];
      let page = 1;
      const maxPages = 12;
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
        records.push(
          ...batch.map((item, idx) =>
            normalizeRecord(dataset, item, (page - 1) * pageSize + idx)
          )
        );
        if (resp.totalPages && page >= resp.totalPages) break;
        page += 1;
      }

      const clean = records.filter((r) => !r.name.startsWith("<DEV>"));
      datasetCache.set(dataset, { records: clean, fetchedAtMs: Date.now() });
      res.json({ dataset, records: clean });
    } catch (err) {
      if (cached) {
        res.json({ dataset, records: cached.records });
        return;
      }
      res.status(502).json({
        dataset,
        records: [],
        error: err instanceof Error ? err.message : "Failed to load dataset",
      });
    }
  });

  const taskWikiCache = new Map<
    string,
    {
      data: {
        title: string;
        wikiUrl: string;
        walkthroughSteps: string[];
        tips: string[];
        images: { url: string; fullUrl: string; caption: string }[];
        fetchedAt: string;
      };
      fetchedAtMs: number;
    }
  >();
  const TASK_WIKI_TTL_MS = 30 * 60 * 1000;

  function decodeHtmlEntities(str: string): string {
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

  function stripHtml(html: string): string {
    return decodeHtmlEntities(
      html
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<[^>]+>/g, " ")
    )
      .replace(/\[edit\]/gi, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function parseWikiTaskHtml(taskName: string, pageTitle: string, html: string) {
    const images: { url: string; fullUrl: string; caption: string }[] = [];
    const seenUrls = new Set<string>();

    const cleanImageUrl = (rawUrl: string): string => {
      // Strip scale-to-width-down/NNN so we get full crisp resolution
      return rawUrl
        .replace(/\/revision\/latest\/scale-to-width-down\/\d+/i, "/revision/latest")
        .replace(/\/revision\/latest\/window-crop\/[^?]+/i, "/revision/latest");
    };

    const isUsefulLocationImage = (url: string, imgName: string): boolean => {
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

    // 1. Parse .wikia-gallery-item blocks (primary container for building + interior photos)
    const galleryChunks = html.split('<div class="wikia-gallery-item"').slice(1);
    for (const chunk of galleryChunks) {
      const block = chunk.slice(0, 2600);
      const srcMatch =
        block.match(/(?:data-src|src)="(https:\/\/static\.wikia\.nocookie\.net\/[^"]+)"/i);
      if (!srcMatch) continue;
      const rawThumbUrl = srcMatch[1];
      const nameMatch = block.match(/data-image-name="([^"]+)"/i);
      const imgName = nameMatch ? decodeHtmlEntities(nameMatch[1]) : "";
      if (!isUsefulLocationImage(rawThumbUrl, imgName)) continue;

      const fullRawUrl = cleanImageUrl(rawThumbUrl);
      const dedupKey = fullRawUrl.split("?")[0];
      if (seenUrls.has(dedupKey)) continue;
      seenUrls.add(dedupKey);

      const capMatch = block.match(/class="lightbox-caption"[^>]*>([\s\S]*?)<\/div>/i);
      const dataCapMatch = block.match(/data-caption="([^"]+)"/i);
      const altMatch = block.match(/alt="([^"]+)"/i);
      let caption = stripHtml(
        capMatch?.[1] || dataCapMatch?.[1] || altMatch?.[1] || ""
      );
      if (!caption && imgName) {
        caption = imgName
          .replace(/\.(png|jpg|jpeg|webp)$/i, "")
          .replace(/[_-]+/g, " ")
          .trim();
      }

      images.push({
        url: toProxiedImageUrl(rawThumbUrl),
        fullUrl: toProxiedImageUrl(fullRawUrl),
        caption: caption || `${taskName} location reference`,
      });
    }

    // 2. Also parse <figure> blocks outside galleries
    const figMatches = html.matchAll(/<figure\b[\s\S]*?<\/figure>/gi);
    for (const fm of figMatches) {
      const block = fm[0];
      const srcMatch =
        block.match(/(?:data-src|src)="(https:\/\/static\.wikia\.nocookie\.net\/[^"]+)"/i);
      if (!srcMatch) continue;
      const rawThumbUrl = srcMatch[1];
      const nameMatch = block.match(/data-image-name="([^"]+)"/i);
      const imgName = nameMatch ? decodeHtmlEntities(nameMatch[1]) : "";
      if (!isUsefulLocationImage(rawThumbUrl, imgName)) continue;

      const fullRawUrl = cleanImageUrl(rawThumbUrl);
      const dedupKey = fullRawUrl.split("?")[0];
      if (seenUrls.has(dedupKey)) continue;
      seenUrls.add(dedupKey);

      const figCapMatch = block.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i);
      const altMatch = block.match(/alt="([^"]+)"/i);
      let caption = stripHtml(figCapMatch?.[1] || altMatch?.[1] || "");
      if (!caption && imgName) {
        caption = imgName
          .replace(/\.(png|jpg|jpeg|webp)$/i, "")
          .replace(/[_-]+/g, " ")
          .trim();
      }

      images.push({
        url: toProxiedImageUrl(rawThumbUrl),
        fullUrl: toProxiedImageUrl(fullRawUrl),
        caption: caption || `${taskName} location reference`,
      });
    }

    // 3. Parse Walkthrough / Guide / Tips paragraphs and list items
    const walkthroughSteps: string[] = [];
    const tips: string[] = [];

    const extractSectionHtml = (sectionNames: string[]): string => {
      for (const sName of sectionNames) {
        const re = new RegExp(
          `<h[23][^>]*>[\\s\\S]*?${sName}[\\s\\S]*?<\\/h[23]>([\\s\\S]*?)(?=<h[23]\\b|$)`,
          "i"
        );
        const m = html.match(re);
        if (m && m[1]) return m[1];
      }
      return "";
    };

    const walkthroughHtml = extractSectionHtml([
      "Walkthrough",
      "Guide",
      "Strategy",
      "Mission Guide",
    ]);
    if (walkthroughHtml) {
      const noGalleries = walkthroughHtml
        .replace(/<div class="wikia-gallery[\s\S]*?<\/div>\s*<\/div>/gi, " ")
        .replace(/<figure[\s\S]*?<\/figure>/gi, " ");
      const blocks = noGalleries.matchAll(/<(?:li|p)[^>]*>([\s\S]*?)<\/(?:li|p)>/gi);
      for (const b of blocks) {
        const txt = stripHtml(b[1]);
        if (
          txt.length >= 16 &&
          !/^(?:see also|notes?|gallery|video|rewards?)$/i.test(txt) &&
          !walkthroughSteps.some((s) => s.toLowerCase() === txt.toLowerCase())
        ) {
          walkthroughSteps.push(txt);
        }
      }
    }

    const tipsHtml = extractSectionHtml(["Tips", "Notes", "Trivia"]);
    if (tipsHtml) {
      const blocks = tipsHtml.matchAll(/<(?:li|p)[^>]*>([\s\S]*?)<\/(?:li|p)>/gi);
      for (const b of blocks) {
        const txt = stripHtml(b[1]);
        if (txt.length >= 16 && tips.length < 4) {
          tips.push(txt);
        }
      }
    }

    const wikiSlug = encodeURIComponent(pageTitle.replace(/\s+/g, "_"));
    return {
      title: pageTitle || taskName,
      wikiUrl: `https://gray-zone-warfare.fandom.com/wiki/${wikiSlug}`,
      walkthroughSteps: walkthroughSteps.slice(0, 14),
      tips,
      images: images.slice(0, 14),
      fetchedAt: new Date().toISOString(),
    };
  }

  app.get("/api/gzw/task-wiki", async (req, res) => {
    const rawName = String(req.query.name || "").trim();
    const force = req.query.force === "1" || req.query.force === "true";
    if (!rawName) {
      res.status(400).json({ error: "Missing task name" });
      return;
    }

    const cacheKey = rawName.toLowerCase();
    const cached = taskWikiCache.get(cacheKey);
    if (
      cached &&
      !force &&
      Date.now() - cached.fetchedAtMs < TASK_WIKI_TTL_MS
    ) {
      res.json(cached.data);
      return;
    }

    const pageCandidates = [
      rawName.replace(/\s+/g, "_"),
      rawName.replace(/['’]/g, "'").replace(/\s+/g, "_"),
    ];

    for (const candidate of pageCandidates) {
      try {
        const wikiApiUrl = `https://gray-zone-warfare.fandom.com/api.php?action=parse&page=${encodeURIComponent(
          candidate
        )}&prop=text|displaytitle&redirects=1&format=json`;
        const upstream = await fetch(wikiApiUrl, {
          headers: {
            "User-Agent":
              "LamangOperations/1.0 (+https://gray-zone-warfare.fandom.com/)",
            Accept: "application/json",
          },
          signal: AbortSignal.timeout(9000),
        });
        if (!upstream.ok) continue;
        const json = (await upstream.json()) as {
          parse?: { title?: string; text?: { "*"?: string } };
        };
        const html = json.parse?.text?.["*"];
        if (!html) continue;

        const parsed = parseWikiTaskHtml(
          rawName,
          json.parse?.title || rawName,
          html
        );
        taskWikiCache.set(cacheKey, {
          data: parsed,
          fetchedAtMs: Date.now(),
        });
        res.json(parsed);
        return;
      } catch {
        // try next candidate
      }
    }

    res.json({
      title: rawName,
      wikiUrl: `https://gray-zone-warfare.fandom.com/wiki/${encodeURIComponent(
        rawName.replace(/\s+/g, "_")
      )}`,
      walkthroughSteps: [],
      tips: [],
      images: [],
      fetchedAt: new Date().toISOString(),
    });
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.join(__dirname, "dist");
    app.use(express.static(distDir));
    app.get("/{*path}", (_req, res) => {
      res.sendFile(path.join(distDir, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Lamang Operations server listening on http://0.0.0.0:${PORT}`);
    // Pre-warm cache silently in background
    fetchBootstrapFromGzw(false).catch(() => {});
  });
}

startServer();
