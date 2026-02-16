// src/lib/normalizeTags.ts

/**
 * Normaliza y limpia tags provenientes del backend (CLIP).
 * - Convierte objetos {label, score} → string
 * - Lowercase
 * - Trim
 * - Elimina duplicados
 * - Unifica sinónimos
 * - Corrige tags ambiguos
 * - Evita que "view" bloquee habitaciones
 * - Evita que "outdoor" bloquee piscina
 */

export function normalizeTags(rawTags: any[]) {
  console.log("🔥 normalizeTags() recibió:", rawTags);

  if (!Array.isArray(rawTags)) {
    console.log("🔥 normalizeTags() devolvió: [] (rawTags no es array)");
    return [];
  }

  // ------------------------------------------------------------
  // 1. Convertir objetos {label, score} → strings
  // ------------------------------------------------------------
  let cleaned = rawTags
    .map(t => (typeof t === "object" ? t.label : t))
    .map(t => String(t || "").toLowerCase().trim())
    .filter(Boolean);

  console.log("🔥 normalizeTags() cleaned:", cleaned);

  // ------------------------------------------------------------
  // 2. Unificar sinónimos y variaciones comunes
  // ------------------------------------------------------------
  const replacements: Record<string, string> = {
    "outdoor pool": "pool",
    "infinity pool": "pool",
    "hotel pool": "pool",
    "pool area": "pool",
    "poolside": "pool",
    "tropical pool": "pool",

    "massage room": "spa",
    "wellness area": "spa",
    "steam room": "spa",
    "sauna room": "spa",
    "hammam": "spa",
    "treatment room": "spa",

    "city view": "view",
    "urban view": "view",
    "skyline": "view",
    "cityscape": "view",
    "sea view": "view",
    "ocean view": "view",
    "panoramic view": "view",

    "roof terrace": "terrace",
    "sky bar": "terrace",

    "hotel room": "room",
    "double room": "room",
    "single room": "room",
    "bedroom": "room",
    "room interior": "room",
    "room view": "room"
  };

  cleaned = cleaned.map(tag => replacements[tag] || tag);

  // ------------------------------------------------------------
  // 3. Detectar habitación ANTES de limpiar exterior
  // ------------------------------------------------------------
  const hasRoom = cleaned.includes("room");

  // ------------------------------------------------------------
  // 4. Detectar spa
  // ------------------------------------------------------------
  const hasSpa = cleaned.includes("spa");

  // ------------------------------------------------------------
  // 5. Detectar piscina
  // ------------------------------------------------------------
  const hasPool = cleaned.includes("pool");

  // ------------------------------------------------------------
  // 6. Detectar exterior
  // ------------------------------------------------------------
  const hasExterior = cleaned.some(t =>
    ["exterior", "facade", "building", "outdoor", "garden"].includes(t)
  );

  // ------------------------------------------------------------
  // ⭐ REGLA 1: Si es habitación → NO limpiar nada
  // ------------------------------------------------------------
  if (hasRoom) {
    const result = Array.from(new Set(cleaned));
    console.log("🔥 normalizeTags() devolvió (habitación detectada):", result);
    return result;
  }

  // ------------------------------------------------------------
  // ⭐ REGLA 2: Si es spa → NO limpiar nada
  // ------------------------------------------------------------
  if (hasSpa) {
    const result = Array.from(new Set(cleaned));
    console.log("🔥 normalizeTags() devolvió (spa detectado):", result);
    return result;
  }

  // ------------------------------------------------------------
  // ⭐ REGLA 3: Si es piscina → NO limpiar nada
  // ------------------------------------------------------------
  if (hasPool) {
    const result = Array.from(new Set(cleaned));
    console.log("🔥 normalizeTags() devolvió (piscina detectada):", result);
    return result;
  }

  // ------------------------------------------------------------
  // ⭐ REGLA 4: Si es exterior → eliminar interior
  // ------------------------------------------------------------
  if (hasExterior) {
    const interior = [
      "room",
      "dining room",
      "meeting room",
      "common area",
      "coworking area",
      "kids club",
      "lobby",
      "interior"
    ];

    const result = Array.from(
      new Set(cleaned.filter(t => !interior.includes(t)))
    );

    console.log("🔥 normalizeTags() devolvió (exterior sin interior):", result);
    return result;
  }

  // ------------------------------------------------------------
  // ⭐ REGLA 5: Default → devolver sin duplicados
  // ------------------------------------------------------------
  const result = Array.from(new Set(cleaned));
  console.log("🔥 normalizeTags() devolvió (default):", result);
  return result;
}
