// src/lib/detectImageQuality.ts

/**
 * Analiza la calidad de una imagen basándose en:
 * - Resolución (megapíxeles)
 * - Nitidez (varianza del laplaciano)
 * - Iluminación promedio
 * - Contraste (desviación estándar)
 * - Ruido estimado
 *
 * @returns Objeto ImageQualityResult con calidad, score numérico y lista de issues
 */

export interface ImageQualityResult {
  quality: "alta" | "media" | "baja" | "borrosa" | "oscura" | "sobreexpuesta"
  score: number
  issues: string[]
}

export async function detectImageQuality(imageBuffer: Buffer): Promise<ImageQualityResult> {
  const sharp = (await import("sharp")).default

  // ✅ Resultado por defecto seguro (nunca undefined)
  const defaultResult: ImageQualityResult = {
    quality: "baja",
    score: 40,
    issues: ["analisis_no_disponible"]
  }

  try {
    const img = sharp(imageBuffer)
    const metadata = await img.metadata()
    const { width = 0, height = 0 } = metadata

    // ------------------------------------------------------------
    // 1. RESOLUCIÓN
    // ------------------------------------------------------------
    const megapixels = (width * height) / 1_000_000
    const resolutionScore = megapixels >= 2 ? 3 : megapixels >= 1 ? 2 : 1

    // ------------------------------------------------------------
    // 2. NITIDEZ (Laplaciano)
    // ------------------------------------------------------------
    let sharpnessScore = 1
    let variance = 0
    
    try {
      const laplacian = await sharp(imageBuffer)
        .greyscale()
        .raw()
        .toBuffer({ resolveWithObject: true })
      
      for (let i = 0; i < laplacian.data.length; i++) {
        variance += Math.pow(laplacian.data[i] - 128, 2)
      }
      variance /= laplacian.data.length
      
      if (variance > 1500) sharpnessScore = 3
      else if (variance > 800) sharpnessScore = 2
    } catch (e) {
      console.warn('⚠️ Error calculando nitidez:', e)
      sharpnessScore = 1
      variance = 500
    }

    // ------------------------------------------------------------
    // 3. ILUMINACIÓN (Brightness)
    // ------------------------------------------------------------
    let lightScore = 1
    let brightness = 128
    
    try {
      const stats = await sharp(imageBuffer).stats()
      brightness = stats.channels[0].mean
      
      if (brightness < 40) lightScore = -2      // Muy oscura
      else if (brightness < 70) lightScore = 1  // Poco iluminada
      else if (brightness < 200) lightScore = 2 // Bien iluminada
      else lightScore = -1                       // Sobreexpuesta
    } catch (e) {
      console.warn('⚠️ Error calculando iluminación:', e)
      lightScore = 1
      brightness = 128
    }

    // ------------------------------------------------------------
    // 4. CONTRASTE
    // ------------------------------------------------------------
    let contrastScore = 0
    let contrast = 30
    
    try {
      const stats = await sharp(imageBuffer).stats()
      contrast = stats.channels[0].stdev
      
      if (contrast > 60) contrastScore = 2
      else if (contrast > 30) contrastScore = 1
      else contrastScore = -1
    } catch (e) {
      console.warn('⚠️ Error calculando contraste:', e)
      contrastScore = 0
      contrast = 30
    }

    // ------------------------------------------------------------
    // 5. RUIDO ESTIMADO
    // ------------------------------------------------------------
    const noiseScore = (variance < 500 && contrast < 20) ? -1 : 0

    // ------------------------------------------------------------
    // 6. CLASIFICACIÓN FINAL
    // ------------------------------------------------------------
    const total = resolutionScore + sharpnessScore + lightScore + contrastScore + noiseScore
    const score = Math.max(0, Math.min(100, Math.round((total / 10) * 100)))
    
    const issues: string[] = []
    
    // Casos especiales prioritarios
    if (lightScore === -2) {
      return { quality: "oscura", score, issues: ["muy_oscura"] }
    }
    if (lightScore === -1) {
      return { quality: "sobreexpuesta", score, issues: ["sobreexpuesta"] }
    }
    if (sharpnessScore === 1 && variance < 800) {
      return { quality: "borrosa", score, issues: ["borrosa"] }
    }

    // Clasificación por puntuación total
    let quality: ImageQualityResult["quality"] = "baja"
    if (total >= 6) {
      quality = "alta"
    } else if (total >= 3) {
      quality = "media"
    } else {
      quality = "baja"
      issues.push("baja_calidad_general")
    }

    return { quality, score, issues }

  } catch (error) {
    console.error("❌ Error crítico en detectImageQuality:", error)
    // ✅ SIEMPRE devolver resultado válido, nunca undefined ni lanzar error
    return defaultResult
  }
}