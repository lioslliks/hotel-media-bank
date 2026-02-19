// src/lib/updateMediaAiTitle.ts

/**
 * 🚀 Pipeline IA para fotos hoteleras - Versión Final Estable
 */

import { createHash } from "node:crypto"
import { supabase } from "@/lib/supabaseClient"
import { generateAiTitleFromClip, tagsFromCaption } from "./generateAiTitleV2"
import { normalizeTags } from "./normalizeTags"
import { detectCategoryVision, type HotelCategory } from "./detectCategoryVision"
import { extractAmenitiesSimple } from "./extractAmenities"
import { analyzeImage, type ImageAnalysisResult } from "./ai"
import { detectSceneAttributes } from "./detectScene"
import { detectAdvancedAttributes } from "./detectAdvancedAttributes"
import { detectImageQuality, type ImageQualityResult } from "./detectImageQuality"

const PROCESSING_TIMEOUT_MS = 30_000
const CAPTION_TIMEOUT_MS = 15_000
const ANALYSIS_TIMEOUT_MS = 10_000
const QUALITY_TIMEOUT_MS = 5_000

// ============================================================
// 🔧 FILTRADO CONTEXTUAL
// ============================================================

function filterAmenitiesByCategory(amenities: string[], category: HotelCategory): string[] {
  const categoryAmenities: Record<string, string[]> = {
    pool: ['sunbed', 'pool_float', 'umbrella', 'poolside_bar', 'infinity_edge'],
    beach: ['sunbed', 'beach_umbrella', 'beach_towel', 'water_sports'],
    infinity_pool: ['sunbed', 'infinity_edge', 'ocean_view', 'poolside_bar'],
    restaurant: ['buffet', 'wine_cellar', 'tasting_menu', 'chef_table', 'terrace_dining'],
    rooftop_bar: ['cocktails', 'panoramic_view', 'dj_booth', 'lounge_seating'],
    pool_bar: ['cocktails', 'swim_up_bar', 'poolside_service'],
    room: ['minibar', 'safe', 'room_service', 'turndown_service', 'balcony'],
    suite: ['jacuzzi', 'butler_service', 'living_room', 'premium_amenities'],
    spa: ['massage_room', 'sauna', 'steam_room', 'relaxation_area', 'treatment_room'],
    common: ['wifi', 'air_conditioning', 'parking', 'elevator']
  }
  const allowedAmenities = categoryAmenities[category] || categoryAmenities.common
  if (allowedAmenities) {
    return amenities.filter(amenity => 
      allowedAmenities.some(allowed => amenity.toLowerCase().includes(allowed))
    )
  }
  return amenities
}

function filterTagsByCategory(tags: string[], category: HotelCategory): string[] {
  const incompatibleTags: Record<string, string[]> = {
    restaurant: ['sunbed', 'pool', 'swimming', 'beach', 'ocean_view', 'room', 'bed'],
    room: ['buffet', 'restaurant', 'chef', 'dining', 'pool', 'sunbed'],
    pool: ['buffet', 'restaurant', 'bed', 'room_service', 'tv'],
    beach: ['buffet', 'indoor', 'ceiling', 'chandelier'],
    spa: ['pool', 'sunbed', 'buffet', 'restaurant', 'outdoor']
  }
  const forbidden = incompatibleTags[category] || []
  return tags.filter(tag => !forbidden.some(forbiddenTag => tag.toLowerCase().includes(forbiddenTag)))
}

function generateDescriptiveTitle(tags: string[], category: HotelCategory, scene: any): string {
  const hasInfinityPool = tags.some(t => t.includes('infinity') || t.includes('infinita'))
  const hasSeaView = tags.some(t => t.includes('sea') || t.includes('ocean') || t.includes('mar'))
  const hasMountainView = tags.some(t => t.includes('mountain') || t.includes('montaña'))
  const hasCityView = tags.some(t => t.includes('city') || t.includes('ciudad'))
  const hasSunbeds = tags.some(t => t.includes('sunbed') || t.includes('tumbona'))
  const hasBuffet = tags.some(t => t.includes('buffet') || t.includes('bufet'))
  const hasTerrace = tags.some(t => t.includes('terrace') || t.includes('terraza'))
  const hasBar = tags.some(t => t.includes('bar') || t.includes('cocktail'))
  const hasChandelier = tags.some(t => t.includes('chandelier') || t.includes('lámpara'))
  const hasJacuzzi = tags.some(t => t.includes('jacuzzi') || t.includes('hidromasaje'))
  
  const timeOfDay = scene?.timeOfDay?.type || 'unknown'
  const isGoldenHour = timeOfDay === 'golden_hour' || timeOfDay === 'sunset'
  const isNight = timeOfDay === 'night' || timeOfDay === 'evening'
  const isMorning = timeOfDay === 'morning'
  
  const titles: Record<string, string[]> = {
    restaurant: [
      hasBuffet && hasTerrace ? "Restaurante con bufet libre y terraza" :
      hasBar && hasChandelier ? "Restaurante elegante con bar y lámparas de diseño" :
      hasChandelier ? "Restaurante con lámparas de cristal" :
      hasTerrace ? "Restaurante con terraza exterior" :
      hasBar ? "Restaurante con bar de cócteles" : "Restaurante con ambiente acogedor",
      hasSeaView ? "con vistas al mar" : hasMountainView ? "con vistas a la montaña" : hasCityView ? "con vistas a la ciudad" : "",
      isGoldenHour ? "al atardecer" : isNight ? "con iluminación cálida" : isMorning ? "con luz natural" : ""
    ],
    pool: [
      hasInfinityPool && hasSeaView ? "Piscina infinita con vistas panorámicas al mar" :
      hasInfinityPool ? "Piscina de borde infinito con diseño moderno" :
      hasBar && hasSunbeds ? "Piscina exterior con bar y zona de tumbonas" :
      hasSunbeds ? "Piscina con zona de relax y sombrillas" :
      hasBar ? "Piscina con bar junto al agua" : "Piscina exterior con áreas de descanso",
      "",
      isGoldenHour ? "bañada por la luz del atardecer" : isMorning ? "con luz matinal" : isNight ? "iluminada por la noche" : ""
    ],
    infinity_pool: [
      hasSeaView ? "Piscina infinita con vistas al mar" :
      hasMountainView ? "Piscina infinita con vistas a la montaña" :
      hasCityView ? "Piscina infinita con vistas urbanas" :
      "Piscina de borde infinito con diseño contemporáneo",
      hasSunbeds ? "y zona de tumbonas" : "",
      isGoldenHour ? "al atardecer" : isNight ? "con iluminación nocturna" : ""
    ],
    room: [
      hasSeaView && hasTerrace ? "Habitación con terraza privada y vistas al mar" :
      hasSeaView ? "Habitación con vistas panorámicas al mar" :
      hasMountainView ? "Habitación con vistas a la montaña" :
      hasCityView ? "Habitación con vistas a la ciudad" :
      hasJacuzzi ? "Habitación con hidromasaje y diseño moderno" :
      "Habitación confortable con mobiliario de calidad",
      hasBar ? "y minibar" : "", ""
    ],
    suite: [
      hasSeaView && hasTerrace ? "Suite premium con terraza y vistas al mar" :
      hasSeaView ? "Suite de lujo con vistas al mar" :
      hasJacuzzi ? "Suite con hidromasaje y área de relax" :
      hasChandelier ? "Suite presidencial con lámparas de diseño" :
      "Suite espaciosa con áreas diferenciadas",
      hasBar ? "y bar privado" : "", ""
    ],
    rooftop_bar: [
      hasSeaView ? "Bar en azotea con vistas panorámicas al mar" :
      hasCityView ? "Rooftop bar con vistas a la ciudad" :
      hasChandelier ? "Bar en azotea con diseño elegante" :
      "Bar en azotea con ambiente sofisticado",
      "",
      isNight ? "iluminado por la noche" : isGoldenHour ? "al atardecer" : ""
    ],
    lobby: [
      hasChandelier ? "Elegante lobby con lámparas de cristal y diseño contemporáneo" :
      hasSeaView ? "Recepción con vistas al mar" :
      "Amplio lobby de recepción con diseño moderno"
    ],
    spa: [
      hasJacuzzi ? "Spa con hidromasaje y área de relax" :
      hasChandelier ? "Spa con diseño elegante y ambiente relajante" :
      "Área de spa y bienestar con tratamientos exclusivos"
    ],
    beach: [
      hasSunbeds ? "Zona de playa con tumbonas y sombrillas" :
      hasBar ? "Playa con bar y servicio de cócteles" :
      "Acceso directo a la playa con áreas de descanso"
    ],
    bathroom: [
      hasJacuzzi ? "Baño premium con hidromasaje y acabados de lujo" :
      "Baño moderno con amenities de alta gama"
    ],
    gym: ["Gimnasio equipado con tecnología moderna"],
    terrace: [
      hasSeaView ? "Terraza privada con vistas al mar" :
      hasMountainView ? "Terraza con vistas a la montaña" :
      "Terraza exterior con mobiliario de diseño"
    ],
    garden: ["Jardín paisajista con vegetación exuberante"],
    exterior: [
      hasSeaView ? "Fachada del hotel con vistas al mar" :
      "Fachada del hotel con diseño arquitectónico"
    ],
    lounge: [
      hasChandelier ? "Salón de estar con lámparas de diseño" :
      "Salón de estar con ambiente acogedor"
    ],
    sauna: ["Sauna con ambiente relajante"],
    steam_room: ["Baño de vapor con diseño moderno"],
    courtyard: ["Patio interior con diseño tradicional"],
    other: ["Espacio del hotel con ambiente acogedor"]
  }
  
  const categoryTitle = titles[category] || titles.other
  const baseTitle = categoryTitle[0] || "Espacio del hotel"
  const viewContext = categoryTitle[1] || ""
  const timeContext = categoryTitle[2] || ""
  const parts = [baseTitle, viewContext, timeContext].filter(p => p && p.trim())
  const finalTitle = parts.join(" ").trim()
  return finalTitle.charAt(0).toUpperCase() + finalTitle.slice(1)
}

// ============================================================
// 🧠 FUNCIÓN PRINCIPAL
// ============================================================

export async function updateMediaAiTitle(
  mediaId: string,
  imageUrl: string,
  imageBuffer?: any  // ✅ USAR 'any' PARA EVITAR ERRORES DE TYPESCRIPT
): Promise<boolean> {
  const startTime = Date.now()
  const processingId = generateProcessingId(mediaId, imageUrl)
  
  console.log(`🧠 [${processingId}] Iniciando procesamiento IA`)
  
  try {
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`TIMEOUT: >${PROCESSING_TIMEOUT_MS/1000}s`)), PROCESSING_TIMEOUT_MS)
    )
    const processingPromise = executePipeline(mediaId, imageUrl, imageBuffer, processingId)
    await Promise.race([processingPromise, timeoutPromise])
    console.log(`✅ [${processingId}] Completado en ${Date.now() - startTime}ms`)
    return true
  } catch (err: any) {
    console.error(`❌ [${processingId}] Error:`, err.message)
    await saveFallback(mediaId, "Imagen del hotel", "other", [], [], "baja")
    return true
  }
}

// ============================================================
// 🔬 PIPELINE
// ============================================================

async function executePipeline(
  mediaId: string,
  imageUrl: string,
  imageBuffer: any | undefined,  // ✅ USAR 'any'
  processingId: string
): Promise<void> {
  
  console.log(`🔍 [${processingId}] Paso 1: Analizando con CLIP/YOLO...`)
  let rawTags: string[] = []
  try {
    const analysis: ImageAnalysisResult = await withTimeout(
      () => analyzeImage(imageUrl),
      ANALYSIS_TIMEOUT_MS,
      "CLIP/YOLO"
    )
    rawTags = analysis.tags || []
    console.log(`📊 [${processingId}] Tags crudos: ${rawTags.length}`)
  } catch (e: any) {
    console.warn(`⚠️ [${processingId}] CLIP falló: ${e.message}`)
  }
  
  console.log(`🧼 [${processingId}] Paso 2: Normalizando tags...`)
  const normalizedTags = normalizeTags(rawTags)
  if (normalizedTags.length === 0) normalizedTags.push("hotel")
  console.log(`✅ [${processingId}] Tags: [${normalizedTags.join(", ")}]`)
  
  console.log(`🏷️ [${processingId}] Paso 3: Detectando categoría...`)
  const category = detectCategoryVision(normalizedTags).primary
  console.log(`✅ [${processingId}] Categoría: ${category}`)
  
  console.log(`🏨 [${processingId}] Paso 4: Extrayendo amenities...`)
  const allAmenities = extractAmenitiesSimple(normalizedTags)
  const filteredAmenities = filterAmenitiesByCategory(allAmenities, category)
  console.log(`✅ [${processingId}] Amenities filtrados: ${filteredAmenities.length}`)
  
  console.log(`🌍 [${processingId}] Paso 5: Analizando escena...`)
  const scene = detectSceneAttributes(normalizedTags)
  console.log(`✅ [${processingId}] Escena: ${scene?.location?.type ?? 'unknown'}`)
  
  console.log(`✨ [${processingId}] Paso 6: Filtrando tags por categoría...`)
  const filteredTags = filterTagsByCategory(normalizedTags, category)
  console.log(`✅ [${processingId}] Tags filtrados: ${filteredTags.length}`)
  
  console.log(`🖼️ [${processingId}] Paso 7: Evaluando calidad...`)
  let qualityResult: ImageQualityResult = { quality: "baja", score: 40, issues: [] }
  if (imageBuffer) {
    try {
      qualityResult = await withTimeout(
        () => detectImageQuality(imageBuffer),
        QUALITY_TIMEOUT_MS,
        "Calidad"
      )
      console.log(`✅ [${processingId}] Calidad: ${qualityResult.quality} (${qualityResult.score})`)
    } catch (e: any) {
      console.warn(`⚠️ [${processingId}] Calidad falló: ${e.message}`)
    }
  }
  
  console.log(`✍️ [${processingId}] Paso 8: Generando título...`)
  let aiTitle = "Imagen del hotel"
  
  if (imageBuffer && qualityResult.score >= 40) {
    try {
      const file = await bufferToFileReal(imageBuffer, imageUrl)
      if (file) {
        aiTitle = await withTimeout(
          () => generateAiTitleFromClip(imageUrl, category, filteredTags, file),
          CAPTION_TIMEOUT_MS,
          "Florence-2"
        )
        if (aiTitle && aiTitle.length > 10) {
          console.log(`✅ [${processingId}] Título IA: "${aiTitle}"`)
        }
      }
    } catch (e: any) {
      console.warn(`⚠️ [${processingId}] Florence falló: ${e.message}`)
    }
  }
  
  if (!aiTitle || aiTitle.length < 15 || aiTitle === "Imagen del hotel") {
    aiTitle = generateDescriptiveTitle(filteredTags, category, scene)
    console.log(`🔄 [${processingId}] Título descriptivo: "${aiTitle}"`)
  }
  
  console.log(`🔍 [${processingId}] Paso 9: Fusionando tags...`)
  const captionTags = tagsFromCaption(aiTitle)
  const allTags = [...filteredTags, ...captionTags, ...filteredAmenities]
  const uniqueTags = Array.from(new Set(allTags.filter(t => t && t.length >= 3))).slice(0, 30)
  console.log(`✅ [${processingId}] Tags finales: ${uniqueTags.length}`)
  
  console.log(`💾 [${processingId}] Guardando en Supabase...`)
  await saveToSupabase(mediaId, {
    ai_title: aiTitle,
    ai_category: category,
    ai_amenities: filteredAmenities,
    ai_tags: uniqueTags,
    ai_quality: qualityResult.quality
  })
  console.log(`✅ [${processingId}] Guardado | Título: "${aiTitle}"`)
}

// ============================================================
// 🛠️ UTILIDADES
// ============================================================

function generateProcessingId(mediaId: string, imageUrl: string): string {
  const hash = createHash("md5").update(imageUrl).digest("hex").substring(0, 6)
  return `${mediaId.substring(0, 8)}-${hash}`
}

async function bufferToFileReal(buffer: any, imageUrl: string): Promise<File | null> {  // ✅ USAR 'any'
  try {
    const mimeType = getMimeType(imageUrl)
    const blob = new Blob([buffer], { type: mimeType })
    const file = new File([blob], `image-${Date.now()}.jpg`, { type: mimeType, lastModified: Date.now() })
    return file.size > 0 ? file : null
  } catch (e) {
    console.error("❌ Error creando File:", e)
    return null
  }
}

function getMimeType(url: string): string {
  const lower = url.toLowerCase()
  if (lower.endsWith(".png")) return "image/png"
  if (lower.endsWith(".webp")) return "image/webp"
  return "image/jpeg"
}

async function withTimeout<T>(promise: () => Promise<T>, ms: number, label: string): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`TIMEOUT: ${label}`)), ms)
  )
  return Promise.race([promise(), timeout])
}

async function saveToSupabase(
  mediaId: string, 
  metadata: {
    ai_title: string
    ai_category: string
    ai_amenities: string[]
    ai_tags: string[]
    ai_quality: string
  }
): Promise<void> {
  const { error } = await supabase
    .from("media")
    .update({
      ai_title: metadata.ai_title,
      ai_category: metadata.ai_category,
      ai_amenities: metadata.ai_amenities,
      ai_tags: metadata.ai_tags,
      ai_quality: metadata.ai_quality
    })
    .eq("id", mediaId)
  if (error) throw new Error(`Supabase: ${error.message}`)
}

async function saveFallback(
  mediaId: string, title: string, category: string,
  amenities: string[], tags: string[], quality: string
): Promise<void> {
  await supabase.from("media").update({
    ai_title: title, ai_category: category, ai_amenities: amenities,
    ai_tags: tags, ai_quality: quality
  }).eq("id", mediaId)
}