// src/lib/sceneWeights.ts

export interface WeightedElement {
  key: string;
  weight: number;
}

export interface SceneWeights {
  scene: string;
  elements: WeightedElement[];
}

export function computeSceneWeights(tags: string[]): SceneWeights {
  // Normalizamos tags
  const normalized = tags.map(t => t.toLowerCase()).filter(Boolean);

  const has = (key: string) => normalized.includes(key);

  const weights: WeightedElement[] = [];

  // ------------------------------------------------------------
  // 🧠 DETECCIÓN DE EXTERIOR (menos agresiva que antes)
  // ------------------------------------------------------------
  const isExterior =
    has("exterior") ||
    has("facade") ||
    has("building") ||
    has("entrance") ||
    has("outdoor") ||
    has("garden");

  // ------------------------------------------------------------
  // 🏊 Piscina
  // ------------------------------------------------------------
  if (has("pool")) weights.push({ key: "pool", weight: 1.0 });

  // ------------------------------------------------------------
  // 💆 Spa / Wellness
  // ------------------------------------------------------------
  if (has("spa")) weights.push({ key: "spa", weight: 1.0 });
  if (has("sauna")) weights.push({ key: "sauna", weight: 0.9 });
  if (has("hammam")) weights.push({ key: "hammam", weight: 0.9 });
  if (has("steam")) weights.push({ key: "steam", weight: 0.8 });
  if (has("massage")) weights.push({ key: "massage", weight: 1.0 });
  if (has("wellness")) weights.push({ key: "wellness", weight: 0.9 });

  // ------------------------------------------------------------
  // 🌊 Vistas
  // ------------------------------------------------------------
  if (has("view")) weights.push({ key: "view", weight: 0.9 });

  // ------------------------------------------------------------
  // 🌅 Ambiente
  // ------------------------------------------------------------
  if (has("sunset")) weights.push({ key: "sunset", weight: 0.8 });
  if (has("night")) weights.push({ key: "night", weight: 0.7 });

  // ------------------------------------------------------------
  // 🍽️ Restaurante
  // ------------------------------------------------------------
  if (has("restaurant")) weights.push({ key: "restaurant", weight: 0.9 });
  if (has("buffet")) weights.push({ key: "buffet", weight: 0.8 });

  // ------------------------------------------------------------
  // 🍸 Bar
  // ------------------------------------------------------------
  if (has("bar")) weights.push({ key: "bar", weight: 0.8 });
  if (has("rooftop")) weights.push({ key: "rooftop", weight: 0.9 });

  // ------------------------------------------------------------
  // 🛏️ Habitaciones (ya no bloqueadas por "view")
  // ------------------------------------------------------------
  if (has("room") || has("suite")) {
    weights.push({ key: "room", weight: 1.0 });
  }

  // ------------------------------------------------------------
  // 🛋️ Zonas comunes
  // ------------------------------------------------------------
  if (has("lobby")) weights.push({ key: "lobby", weight: 0.9 });
  if (has("meeting")) weights.push({ key: "meeting_room", weight: 0.8 });

  // ------------------------------------------------------------
  // 🌴 Exterior
  // ------------------------------------------------------------
  if (has("facade")) weights.push({ key: "facade", weight: 0.95 });
  if (has("terrace")) weights.push({ key: "terrace", weight: 0.8 });
  if (has("balcony")) weights.push({ key: "balcony", weight: 0.7 });

  // ------------------------------------------------------------
  // Ordenar por peso
  // ------------------------------------------------------------
  weights.sort((a, b) => b.weight - a.weight);

  // ------------------------------------------------------------
  // ⭐ CORRECCIÓN INTELIGENTE
  // Si hay exterior + habitación → gana habitación (no exterior)
  // ------------------------------------------------------------
  const hasRoom = normalized.includes("room") || normalized.includes("suite");

  if (isExterior && hasRoom) {
    return {
      scene: "habitaciones",
      elements: weights
    };
  }

  // ------------------------------------------------------------
  // Escena dominante normal
  // ------------------------------------------------------------
  const scene =
    weights.length > 0 ? detectSceneFromWeights(weights[0].key) : "otros";

  return { scene, elements: weights };
}

function detectSceneFromWeights(key: string): string {
  if (key.includes("pool")) return "piscina";
  if (key.includes("spa") || key.includes("massage") || key.includes("hammam")) return "spa";
  if (key.includes("restaurant") || key.includes("buffet")) return "restaurante";
  if (key.includes("bar") || key.includes("rooftop")) return "bar";
  if (key.includes("room") || key.includes("suite")) return "habitaciones";
  if (key.includes("lobby") || key.includes("meeting")) return "salas_comunes";
  if (key.includes("facade")) return "exterior";
  if (key.includes("view")) return "vistas";
  if (key.includes("terrace") || key.includes("balcony")) return "terraza";
  return "otros";
}
