// utils/categoryMap.ts

export type RawTag = string | { label: string; score?: number };

/**
 * Mapa de categorías optimizado para hoteles reales.
 * Compatible con CLIP + YOLO + normalizeTags PRO.
 */
export const CATEGORY_MAP: Record<string, string[]> = {
  // ============================
  // 🏊 PISCINA
  // ============================
  piscina: [
    "pool",
    "swimming pool",
    "outdoor pool",
    "indoor pool",
    "infinity pool",
    "hotel pool",
    "pool area",
    "poolside",
    "tropical pool",
    "sunbed",
    "umbrella"
  ],

  // ============================
  // 🛏️ HABITACIÓN
  // ============================
  habitacion: [
    "hotel room",
    "room",
    "suite",
    "bedroom",
    "double room",
    "single room",
    "king bed",
    "queen bed",
    "room interior",
    "room view"
  ],

  // ============================
  // 🌄 VISTAS
  // ============================
  vistas: [
    "view",
    "city view",
    "skyline",
    "urban view",
    "cityscape",
    "sea",
    "ocean",
    "sea view",
    "ocean view",
    "mountain",
    "mountain view",
    "panoramic view"
  ],

  // ============================
  // 🌅 TERRAZA / ROOFTOP
  // ============================
  terraza: [
    "terrace",
    "balcony",
    "rooftop",
    "roof terrace",
    "sky bar",
    "umbrella"
  ],

  // ============================
  // 🏢 FACHADA / EXTERIOR DEL HOTEL
  // ============================
  fachada: [
    "facade",
    "building",
    "entrance",
    "hotel exterior",
    "exterior view"
  ],

  // ============================
  // 🍽️ RESTAURANTE
  // ============================
  restaurante: [
    "restaurant",
    "buffet",
    "breakfast area",
    "dining area",
    "dining room"
  ],

  // ============================
  // 💆 SPA / WELLNESS
  // ============================
  spa: [
    "spa",
    "massage",
    "massage room",
    "wellness",
    "wellness area",
    "sauna",
    "steam room",
    "hammam",
    "treatment",
    "jacuzzi",
    "gym",
    "fitness"
  ],

  // ============================
  // 🛋️ SALAS COMUNES
  // ============================
  salas_comunes: [
    "lobby",
    "reception",
    "common area",
    "hall",
    "lounge",
    "waiting area",
    "coworking",
    "meeting",
    "conference"
  ],

  // ============================
  // 🛁 INTERIOR
  // ============================
  interior: [
    "interior",
    "corridor",
    "hallway",
    "bathroom",
    "indoor"
  ],

  // ============================
  // 🌴 EXTERIOR
  // ============================
  exterior: [
    "exterior",
    "garden",
    "outdoor",
    "parking",
    "patio",
    "palm trees"
  ]
};

/**
 * Normaliza tags a string[] en lowercase
 */
function normalizeRawTags(tags: RawTag[]): string[] {
  return tags
    .flatMap(tag => {
      if (typeof tag === "string") return tag.trim();
      if (typeof tag === "object" && tag?.label) return tag.label.trim();
      return [];
    })
    .filter(Boolean)
    .map(t => t.toLowerCase());
}

/**
 * Detecta categoría con prioridades reales de hotel
 * PRIORIDADES:
 * 1. piscina
 * 2. spa
 * 3. habitacion
 * 4. restaurante
 * 5. salas_comunes
 * 6. vistas
 * 7. terraza
 * 8. fachada
 * 9. interior
 * 10. exterior
 */
export function detectCategory(tags: RawTag[]): string {
  const normalized = normalizeRawTags(tags);

  if (!normalized.length) return "otros";

  // Coincidencias inteligentes (exactas, parciales y compuestas)
  const has = (keyword: string) =>
    normalized.some(t =>
      t === keyword ||
      t.includes(keyword) ||
      keyword.includes(t)
    );

  // 1. Piscina
  if (has("pool") || has("sunbed") || has("umbrella") || has("infinity")) {
    return "piscina";
  }

  // 2. Spa
  if (
    has("spa") ||
    has("sauna") ||
    has("steam") ||
    has("massage") ||
    has("wellness") ||
    has("treatment") ||
    has("hammam") ||
    has("jacuzzi")
  ) {
    return "spa";
  }

  // 3. Habitación
  if (
    has("room") ||
    has("suite") ||
    has("bedroom") ||
    has("king") ||
    has("queen")
  ) {
    return "habitacion";
  }

  // 4. Restaurante
  if (has("restaurant") || has("buffet") || has("dining")) {
    return "restaurante";
  }

  // 5. Salas comunes
  if (
    has("lobby") ||
    has("reception") ||
    has("common area") ||
    has("lounge") ||
    has("coworking") ||
    has("meeting")
  ) {
    return "salas_comunes";
  }

  // 6. Vistas
  if (has("view") || has("sea") || has("ocean") || has("mountain") || has("city")) {
    return "vistas";
  }

  // 7. Terraza
  if (has("terrace") || has("balcony") || has("rooftop") || has("umbrella")) {
    return "terraza";
  }

  // 8. Fachada
  if (has("facade") || has("building") || has("entrance")) {
    return "fachada";
  }

  // 9. Interior
  if (has("interior") || has("bathroom") || has("corridor") || has("hallway")) {
    return "interior";
  }

  // 10. Exterior
  if (has("exterior") || has("garden") || has("outdoor") || has("parking") || has("palm trees")) {
    return "exterior";
  }

  return "otros";
}
