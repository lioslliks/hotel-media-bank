// src/lib/generateAiTitleV2.ts

import { TITLE_TEMPLATES } from "./aiTitleTemplates";
import { generateDynamicTitles } from "./generateDynamicTitles";
import { computeSceneWeights } from "./sceneWeights";
import { normalizeTags } from "./normalizeTags";

const CLIP_API_URL =
  process.env.NEXT_PUBLIC_CLIP_URL || "http://localhost:8000/rank";

/**
 * Motor principal de generación de títulos:
 * 1. Normaliza tags
 * 2. Detecta escena (sceneWeights)
 * 3. Genera títulos dinámicos
 * 4. Mezcla plantillas fijas + dinámicos
 * 5. Envía candidatos a CLIP /rank con similitud imagen–texto
 * 6. Devuelve el mejor título en español
 */
export async function generateAiTitleFromClip(
  imageUrl: string,
  category?: string | null,
  tags?: any[]
) {
  // ------------------------------------------------------------
  // ⭐ 1. Normalizar tags
  // ------------------------------------------------------------
  const normalizedTags = normalizeTags(tags || []);
  console.log("🔧 Normalized tags:", normalizedTags);

  // ------------------------------------------------------------
  // ⭐ 2. Scene Weighting
  // ------------------------------------------------------------
  const { scene, elements } = computeSceneWeights(normalizedTags);
  const normalizedCategory = (category || "").toLowerCase();

  console.log("🎯 Scene detected:", scene);
  console.log("📊 Scene weights:", elements);

  // ------------------------------------------------------------
  // ⭐ 3. Títulos dinámicos
  // ------------------------------------------------------------
  const dynamicTitles = generateDynamicTitles(normalizedTags);
  console.log("🧠 Dynamic titles:", dynamicTitles);

  // ------------------------------------------------------------
  // ⭐ 4. Plantillas según escena/categoría
  // ------------------------------------------------------------
  let templates;

  // Piscina tiene prioridad absoluta
  if (normalizedCategory === "piscina" || scene === "piscina") {
    templates = [
      ...TITLE_TEMPLATES.piscina,
      ...TITLE_TEMPLATES.exterior // fallback natural
    ];
  }
  // Si existe plantilla para la escena detectada
  else if (TITLE_TEMPLATES[scene]) {
    templates = TITLE_TEMPLATES[scene];
  }
  // Si existe plantilla para la categoría detectada
  else if (TITLE_TEMPLATES[normalizedCategory]) {
    templates = TITLE_TEMPLATES[normalizedCategory];
  }
  // Fallback
  else {
    templates = TITLE_TEMPLATES["otros"];
  }

  const templateSpanish = templates.map(t => t.es);
  const templateEnglish = templates.map(t => t.en);

  console.log("📚 Template Spanish:", templateSpanish);
  console.log("📚 Template English:", templateEnglish);

  // ------------------------------------------------------------
  // ⭐ 5. Fusionar dinámicos + plantillas
  // ------------------------------------------------------------
  const spanishCandidates = [...dynamicTitles, ...templateSpanish];

  const englishCandidates = [
    ...dynamicTitles.map(t => translateToEnglish(t)),
    ...templateEnglish
  ];

  console.log("🇪🇸 Final Spanish candidates:", spanishCandidates);
  console.log("🇬🇧 Final English candidates:", englishCandidates);

  // ------------------------------------------------------------
  // ⭐ 6. Llamar a CLIP /rank con similitud imagen–texto
  // ------------------------------------------------------------
  const res = await fetch(CLIP_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      titles: englishCandidates,
      tags: normalizedTags,
      scene,
      category: normalizedCategory,
      image_url: imageUrl, // 👈 NUEVO: similitud real imagen–texto
    }),
  });

  if (!res.ok) {
    console.error("❌ Error llamando a CLIP /rank:", await res.text());
    return spanishCandidates[0];
  }

  const ranked = await res.json();
  console.log("🏆 CLIP ranking:", ranked);

  const bestEnglish = ranked?.ranked?.[0];
  if (!bestEnglish) return spanishCandidates[0];

  // ------------------------------------------------------------
  // ⭐ 7. Buscar equivalente en español
  // ------------------------------------------------------------
  const templateMatch = templates.find(t => t.en === bestEnglish);
  if (templateMatch) {
    console.log("✨ Best match (template):", templateMatch.es);
    return templateMatch.es;
  }

  const index = englishCandidates.indexOf(bestEnglish);
  console.log("✨ Best match (dynamic):", spanishCandidates[index]);

  return spanishCandidates[index] || spanishCandidates[0];
}

// ------------------------------------------------------------
// ⭐ Traducción ES → EN (simple pero suficiente para CLIP ranking)
// ------------------------------------------------------------
function translateToEnglish(spanish: string): string {
  let en = spanish.toLowerCase();
  en = en.replace(/\s+/g, " ").trim();
  return en.charAt(0).toUpperCase() + en.slice(1);
}
