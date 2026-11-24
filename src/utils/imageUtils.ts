/**
 * Local bundled studio icons generated for GZW 0.5 items that lack valid upstream PNGs
 * (or return Missing_icon.png from gzw-data.dev).
 * Stored in public/assets/items/ and prefixed with import.meta.env.BASE_URL for GitHub Pages.
 */
export const LOCAL_ITEM_IMAGE_PATHS: Record<string, string> = {
  fabrics: "assets/items/fabrics.jpg",
  microscope: "assets/items/microscope.jpg",
  refrigerant: "assets/items/refrigerant.jpg",
  "stainless steel sheet": "assets/items/stainless_steel_sheet.jpg",
  "tooling coolant": "assets/items/tooling_coolant.jpg",
  "water pump": "assets/items/water_pump.jpg",
  "biohazard canister": "assets/items/biohazard_canister.jpg",
  "plutonium canister": "assets/items/plutonium_canister.jpg",
  "pure white heroin": "assets/items/pure_white_heroin.jpg",
  "usp morphine sulfate": "assets/items/morphine_sulfate.jpg",
  "chemical containment container": "assets/items/chemical_containment.jpg",
  "radioisotope fuel cell": "assets/items/radioisotope_cell.jpg",
  famas: "assets/items/weapon_famas.jpg",
  g3: "assets/items/weapon_g3.jpg",
  "g3 (zero hour)": "assets/items/weapon_g3.jpg",
  m14: "assets/items/weapon_m14.jpg",
  "m14 (black hawk)": "assets/items/weapon_m14.jpg",
  "remington 788": "assets/items/weapon_remington_788.jpg",
  "vz. 61 skorpion": "assets/items/weapon_vz61_skorpion.jpg",
  "m-201c": "assets/items/weapon_m201c.jpg",
  "bloodhound's m-201c": "assets/items/weapon_m201c.jpg",
};

export const VENDOR_PORTRAIT_URLS: Record<string, string> = {
  handshake:
    "https://static.wikia.nocookie.net/gray-zone-warfare/images/9/9c/Handshake_square.png/revision/latest/scale-to-width-down/268?cb=20240502171644",
  gunny:
    "https://static.wikia.nocookie.net/gray-zone-warfare/images/0/09/Gunny_square.png/revision/latest/scale-to-width-down/268?cb=20240502171554",
  "lab rat":
    "https://static.wikia.nocookie.net/gray-zone-warfare/images/0/09/Labrat_square.png/revision/latest/scale-to-width-down/268?cb=20240502171433",
  artisan:
    "https://static.wikia.nocookie.net/gray-zone-warfare/images/4/49/Artisan_square.png/revision/latest/scale-to-width-down/268?cb=20260411114656",
  turncoat:
    "https://static.wikia.nocookie.net/gray-zone-warfare/images/a/a0/Turncoat_square.png/revision/latest/scale-to-width-down/268?cb=20240502171507",
  banshee:
    "https://static.wikia.nocookie.net/gray-zone-warfare/images/5/55/Vendor-Banshee.png/revision/latest/scale-to-width-down/268?cb=20240505160347",
  vulture:
    "https://static.wikia.nocookie.net/gray-zone-warfare/images/8/80/Vendor-Vulture.png/revision/latest/scale-to-width-down/268?cb=20260328020207",
};

function isStaticHost(): boolean {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname.toLowerCase();
  return (
    host.endsWith(".github.io") ||
    host === "github.io" ||
    window.location.protocol === "file:"
  );
}

function prefixBaseUrl(relPath: string): string {
  const base =
    typeof import.meta !== "undefined" && import.meta.env?.BASE_URL
      ? import.meta.env.BASE_URL
      : "./";
  const cleanBase = base.endsWith("/") ? base : `${base}/`;
  return `${cleanBase}${relPath.replace(/^\.?\//, "")}`;
}

export function isValidTacticalImage(rawUrl: string | null | undefined): boolean {
  if (!rawUrl || typeof rawUrl !== "string") return false;
  const trimmed = rawUrl.trim();
  if (!trimmed) return false;
  if (trimmed.toLowerCase().includes("missing_icon")) return false;
  return true;
}

export function resolveTacticalImageUrl(
  rawUrl: string | null | undefined,
  itemName?: string | null
): string | null {
  if (itemName) {
    const localRel = LOCAL_ITEM_IMAGE_PATHS[itemName.trim().toLowerCase()];
    if (localRel) return prefixBaseUrl(localRel);
  }

  if (!isValidTacticalImage(rawUrl)) return null;
  const trimmed = rawUrl!.trim();

  if (trimmed.startsWith("assets/") || trimmed.startsWith("./assets/")) {
    return prefixBaseUrl(trimmed);
  }

  if (trimmed.startsWith("/api/gzw/image")) {
    if (isStaticHost()) {
      try {
        const parsed = new URL(trimmed, "https://localhost");
        const orig = parsed.searchParams.get("url");
        return orig || null;
      } catch {
        return null;
      }
    }
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    if (
      parsed.protocol === "https:" &&
      (parsed.hostname.endsWith(".wikia.nocookie.net") ||
        parsed.hostname === "static.wikia.nocookie.net") &&
      !isStaticHost()
    ) {
      return `/api/gzw/image?url=${encodeURIComponent(trimmed)}`;
    }
  } catch {
    // Keep as-is if not an absolute URL
  }

  return trimmed;
}

export function getLocalFallbackImageForItem(
  itemName: string | null | undefined
): string | null {
  if (!itemName) return null;
  const rel = LOCAL_ITEM_IMAGE_PATHS[itemName.trim().toLowerCase()];
  return rel ? prefixBaseUrl(rel) : null;
}

export function getVendorPortraitUrl(
  vendorName: string,
  apiImage?: string | null
): string | null {
  const key = vendorName.trim().toLowerCase();
  const canonical = VENDOR_PORTRAIT_URLS[key] || null;
  return resolveTacticalImageUrl(apiImage || canonical, vendorName);
}
