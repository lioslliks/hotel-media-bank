// src/lib/ai.ts

/**
 * Llama al backend CLIP para analizar una imagen y devolver tags limpios.
 * Esta función NO normaliza: solo limpia y prepara los tags.
 * La normalización completa la hace normalizeTags() después.
 */

export async function analyzeImage(url: string, threshold: number = 0.20) {
  try {
    if (!url || typeof url !== "string") {
      console.error("❌ URL inválida en analyzeImage:", url);
      return { tags: [], confidence: null };
    }

    const response = await fetch("http://localhost:8000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, threshold }),
    });

    if (!response.ok) {
      console.error("❌ Error en backend /analyze:", response.status);
      return { tags: [], confidence: null };
    }

    const data = await response.json();

    if (!data || !Array.isArray(data.tags)) {
      console.warn("⚠️ Backend devolvió formato inesperado:", data);
      return { tags: [], confidence: null };
    }

    // ------------------------------------------------------------
    // ⭐ Limpieza segura de tags (NO normalización completa)
    // ------------------------------------------------------------
    const tags = data.tags
      .map((t: any) => {
        if (typeof t === "object" && t.label) return String(t.label).trim();
        if (typeof t === "string") return t.trim();
        return null;
      })
      .filter(Boolean);

    return {
      tags,
      confidence: data.confidence ?? null,
    };

  } catch (error) {
    console.error("❌ Error al analizar imagen:", error);
    return { tags: [], confidence: null };
  }
}
