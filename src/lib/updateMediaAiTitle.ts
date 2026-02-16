// src/lib/updateMediaAiTitle.ts

import { supabase } from "@/lib/supabaseClient";
import { generateAiTitleFromClip } from "./generateAiTitleV2";

/**
 * Actualiza el campo ai_title de una imagen en la tabla media
 */
export async function updateMediaAiTitle(
  mediaId: string,
  imageUrl: string,
  category?: string | null,
  tags?: any[]
) {
  try {
    console.log("🧠 Generando título con CLIP para:", imageUrl);
    console.log("🏷️ Tags recibidos (raw):", tags);

    // ⭐ NORMALIZACIÓN SEGURA Y CORRECTA
    const safeTags =
      Array.isArray(tags) && tags.length > 0
        ? tags
            .map(t => {
              if (typeof t === "string") return t.trim();
              if (typeof t === "object" && t?.label) return t.label.trim();
              return null;
            })
            .filter(Boolean)
        : [];

    console.log("🏷️ Tags usados para CLIP:", safeTags);

    // ⭐ Pasamos tags limpios al generador
    const ai_title = await generateAiTitleFromClip(
      imageUrl,
      category,
      safeTags
    );

    console.log("🏷️ Título generado:", ai_title);

    const { error } = await supabase
      .from("media")
      .update({ ai_title })
      .eq("id", mediaId);

    if (error) {
      console.error("❌ Error actualizando ai_title:", error);
      return null;
    }

    console.log(`✅ ai_title actualizado para media ${mediaId}`);
    return ai_title;
  } catch (err) {
    console.error("❌ Error en updateMediaAiTitle:", err);
    return null;
  }
}
