// src/lib/scenePriority.ts

import { RawTag } from "@/utils/categoryMap";

export type SceneType =
  | "piscina"
  | "spa"
  | "restaurante"
  | "bar"
  | "habitaciones"
  | "zonas_comunes"
  | "vistas"
  | "terraza"
  | "fachada"
  | "exterior"
  | "otros";

export function detectScenePriority(tags: RawTag[]): SceneType {
  // Normalización básica
  const normalized = tags
    .map((t: any) =>
      typeof t === "string"
        ? t.toLowerCase()
        : typeof t.label === "string"
        ? t.label.toLowerCase()
        : ""
    )
    .filter(Boolean);

  const has = (key: string) => normalized.includes(key);

  // ------------------------------------------------------------
  // 🧠 DETECCIÓN DE EXTERIOR (menos agresiva)
  // ------------------------------------------------------------
  const isExterior =
    has("exterior") ||
    has("facade") ||
    has("building") ||
    has("entrance") ||
    has("outdoor") ||
    has("garden");

  // ------------------------------------------------------------
  // 🏊 Piscina (máxima prioridad)
  // ------------------------------------------------------------
  if (has("pool")) {
    return "piscina";
  }

  // ------------------------------------------------------------
  // 💆 Spa / Wellness
  // ------------------------------------------------------------
  if (
    has("spa") ||
    has("hammam") ||
    has("sauna") ||
    has("steam") ||
    has("massage") ||
    has("wellness") ||
    has("treatment")
  ) {
    return "spa";
  }

  // ------------------------------------------------------------
  // 🍽️ Restaurante
  // ------------------------------------------------------------
  if (has("restaurant") || has("buffet") || has("dining")) {
    return "restaurante";
  }

  // ------------------------------------------------------------
  // 🍸 Bar
  // ------------------------------------------------------------
  if (has("bar") || has("rooftop") || has("cocktail")) {
    return "bar";
  }

  // ------------------------------------------------------------
  // 🛏️ Habitaciones (ya NO bloqueadas por "view")
  // ------------------------------------------------------------
  if (has("room") || has("suite")) {
    return "habitaciones";
  }

  // ------------------------------------------------------------
  // 🛋️ Zonas comunes
  // ------------------------------------------------------------
  if (
    has("lobby") ||
    has("reception") ||
    has("common area") ||
    has("lounge") ||
    has("coworking") ||
    has("meeting")
  ) {
    return "zonas_comunes";
  }

  // ------------------------------------------------------------
  // 🌊 Vistas
  // ------------------------------------------------------------
  if (has("view")) {
    return "vistas";
  }

  // ------------------------------------------------------------
  // 🌅 Terraza
  // ------------------------------------------------------------
  if (has("terrace") || has("balcony") || has("rooftop")) {
    return "terraza";
  }

  // ------------------------------------------------------------
  // 🏢 Fachada
  // ------------------------------------------------------------
  if (has("facade") || has("building") || has("entrance")) {
    return "fachada";
  }

  // ------------------------------------------------------------
  // 🌴 Exterior
  // ------------------------------------------------------------
  if (isExterior) {
    return "exterior";
  }

  return "otros";
}
