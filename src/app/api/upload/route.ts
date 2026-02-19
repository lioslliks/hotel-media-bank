// src/app/api/upload/route.ts

import { NextRequest, NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"
import { createClient } from "@supabase/supabase-js"
import { Buffer } from "buffer"
import crypto from "crypto"
import sharp from "sharp"

import { analyzeImage } from "@/lib/ai"
import { normalizeTags } from "@/lib/normalizeTags"
import { detectCategoryVision } from "@/lib/detectCategoryVision"
import { extractAmenities } from "@/lib/extractAmenities"

// ==================== VALIDACIÓN ENV ====================
if (!process.env.CLOUDINARY_CLOUD_NAME) throw new Error("❌ CLOUDINARY_CLOUD_NAME no está definido")
if (!process.env.CLOUDINARY_API_KEY) throw new Error("❌ CLOUDINARY_API_KEY no está definido")
if (!process.env.CLOUDINARY_API_SECRET) throw new Error("❌ CLOUDINARY_API_SECRET no está definido")

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// ==================== SUPABASE ====================
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// ==================== CONFIGURACIÓN ====================
const IMAGE_SIZES = {
  thumbnail: { width: 256, height: 144 },
  small: { width: 800, height: 450 },
  medium: { width: 1920, height: 1080 },
  large: { width: 2880, height: 1620 },
}

// ==================== ENDPOINT POST ====================
export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID().slice(0, 8)
  console.log(`🚀 [${requestId}] POST /api/upload iniciado`)

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const hotelId = formData.get("hotel_id") as string | null

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Archivo inválido" }, { status: 400 })
    }

    if (!hotelId) {
      return NextResponse.json({ error: "Falta hotel_id" }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Archivo demasiado grande (máx. 5MB)" }, { status: 400 })
    }

    // ==================== BUFFER ====================
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // ==================== HASH ====================
    const hash = crypto.createHash("sha256").update(buffer).digest("hex")

    // ==================== CHECK DUPLICADO ====================
    const { data: existing } = await supabase
      .from("image_hashes")
      .select("url")
      .eq("hash", hash)
      .single()

    if (existing) {
      console.log(`✅ [${requestId}] Imagen duplicada detectada`)
      return NextResponse.json({
        url: existing.url,
        is_duplicate: true,
        message: "Esta imagen ya existe en tu galería",
      })
    }

    // ==================== UPLOAD CLOUDINARY ====================
    console.log(`☁️ [${requestId}] Subiendo a Cloudinary...`)
    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "hotel-media",
            resource_type: "image",
            quality_analysis: true,
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          }
        )
        .end(buffer)
    })
    console.log(`✅ [${requestId}] Cloudinary OK: ${uploadResult.secure_url.substring(0, 60)}...`)

    // ==================== 🤖 PASO 1: IA ANALYSIS (BACKEND ENSEMBLE) ====================
    console.log(`🤖 [${requestId}] Paso 1: Analizando con backend ensemble...`)
    
    let backendResult: Awaited<ReturnType<typeof analyzeImage>>
    
    try {
      backendResult = await analyzeImage(uploadResult.secure_url, 0.20)
      
      console.log(`✅ [${requestId}] Backend result:`, {
        categoria: backendResult.categoria,
        ubicacion: backendResult.ubicacion,
        tags: backendResult.tags,
        titulo: backendResult.titulo_sugerido?.substring(0, 60),
        confidence: backendResult.confidence,
        tagsCount: backendResult.tags?.length || 0
      })
      
    } catch (error: any) {
      console.error(`❌ [${requestId}] Error en analyzeImage: ${error.message}`)
      
      // Fallback mínimo
      backendResult = {
        tags: ["hotel"],
        objects: [],
        caption: "",
        categoria: "otros",
        ubicacion: "interior",
        titulo_sugerido: "",
        tags_confidence: {},
        confidence: 0.3,
        processing_time_ms: -1,
        model_version: "fallback"
      }
    }

    // ==================== 🧼 PASO 2: NORMALIZAR TAGS ====================
    console.log(`🧼 [${requestId}] Paso 2: Normalizando tags...`)
    
    const tagsWithScores = backendResult.tags.map(tag => ({
      label: tag,
      score: backendResult.tags_confidence?.[tag] || 0.5
    }))
    
    const normalizedTags = normalizeTags(tagsWithScores, {
      tags_confidence: backendResult.tags_confidence,
      categoria_context: backendResult.categoria,
      ubicacion_context: backendResult.ubicacion,
      min_confidence: 0.2,
      prefer_backend_scores: true
    })
    
    console.log(`✅ [${requestId}] Tags normalizados: ${JSON.stringify(normalizedTags)}`)

    // ==================== 🏷️ PASO 3: DETECTAR CATEGORÍA ====================
    console.log(`🏷️ [${requestId}] Paso 3: Detectando categoría...`)
    
    const categoryDetection = detectCategoryVision(normalizedTags, {
      backendCategoria: backendResult.categoria,
      backendUbicacion: backendResult.ubicacion,
      tagsConfidence: backendResult.tags_confidence,
      minBackendConfidence: 0.4
    })
    
    const category = categoryDetection.primary
    console.log(`✅ [${requestId}] Categoría: ${category} (source: ${categoryDetection.source})`)

    // ==================== 🏨 PASO 4: EXTRAER AMENITIES ====================
    console.log(`🏨 [${requestId}] Paso 4: Extrayendo amenities...`)
    const amenitiesResult = extractAmenities(normalizedTags)
    
    // ✅ CORREGIDO: extractAmenities devuelve un OBJETO, extraer array correctamente
    const amenitiesArray = extractAmenityTags(amenitiesResult)
    console.log(`✅ [${requestId}] Amenities extraídos: ${JSON.stringify(amenitiesArray)}`)

    // ==================== 🌍 PASO 5: ANALIZAR ESCENA ====================
    console.log(`🌍 [${requestId}] Paso 5: Analizando escena...`)
    const sceneAnalysis = {
      scene: categoryDetection.secondary?.[0] || "ambiguous",
      confidence: categoryDetection.confidence
    }
    console.log(`✅ [${requestId}] Escena: ${sceneAnalysis.scene}`)

    // ==================== ✨ PASO 6: FILTRAR TAGS POR CATEGORÍA ====================
    console.log(`✨ [${requestId}] Paso 6: Filtrando tags por categoría...`)
    const filteredTags = normalizedTags.filter(tag => {
      const categoryTags: Record<string, string[]> = {
        piscina: ["pool", "piscina", "water", "sunbed", "umbrella", "exterior"],
        habitacion: ["room", "bed", "suite", "balcony", "interior"],
        restaurante: ["restaurant", "dining", "table", "buffet"],
        exterior: ["exterior", "facade", "building", "sky", "garden"],
      }
      const validTags = categoryTags[category] || []
      return validTags.length === 0 || validTags.some(t => tag.includes(t))
    })
    console.log(`✅ [${requestId}] Tags filtrados: ${JSON.stringify(filteredTags)}`)

    // ==================== 🖼️ PASO 7: EVALUAR CALIDAD ====================
    console.log(`🖼️ [${requestId}] Paso 7: Evaluando calidad...`)
    const qualityScore = uploadResult.quality_analysis?.overall_score || 70
    console.log(`✅ [${requestId}] Calidad: ${qualityScore}`)

    // ==================== ✍️ PASO 8: GENERAR TÍTULO ====================
    console.log(`✍️ [${requestId}] Paso 8: Generando título...`)
    
    let finalTitle: string
    
    if (backendResult.titulo_sugerido && backendResult.titulo_sugerido.length > 15) {
      finalTitle = backendResult.titulo_sugerido
      console.log(`✅ [${requestId}] Usando título del backend: "${finalTitle}"`)
    } else {
      console.log(`🔧 [${requestId}] Backend no dio título válido, generando fallback...`)
      
      const titleParts: string[] = []
      
      const categoryLabels: Record<string, string> = {
        piscina: "Piscina",
        habitacion: "Habitación",
        restaurante: "Restaurante",
        bar: "Bar",
        spa: "Spa",
        lobby: "Lobby",
        exterior: "Vista exterior",
        playa: "Playa",
        gimnasio: "Gimnasio"
      }
      if (categoryLabels[category]) {
        titleParts.push(categoryLabels[category])
      }
      
      if (normalizedTags.some(t => /vista|view|mar|sea/.test(t))) {
        titleParts.push("con vistas")
      }
      if (normalizedTags.some(t => /lujo|luxury|premium/.test(t))) {
        titleParts.push("de lujo")
      }
      
      finalTitle = titleParts.length > 0 
        ? titleParts.join(" ") 
        : "Espacio del hotel"
      
      console.log(`✅ [${requestId}] Título fallback: "${finalTitle}"`)
    }

    // ==================== 🔍 PASO 9: FUSIONAR TAGS FINALES ====================
    console.log(`🔍 [${requestId}] Paso 9: Fusionando tags...`)
    
    const finalTags = [...new Set([...filteredTags, ...amenitiesArray])]
      .filter(t => t && typeof t === 'string' && t.length >= 2)
      .slice(0, 15)
    
    console.log(`✅ [${requestId}] Tags finales: ${JSON.stringify(finalTags)}`)

    // ==================== 💾 GUARDAR EN SUPABASE ====================
    console.log(`💾 [${requestId}] Guardando en Supabase...`)
    
    // ==================== UPLOAD VERSIONES ====================
    const versions: Record<string, any> = {}
    
    for (const [sizeName, sizeConfig] of Object.entries(IMAGE_SIZES)) {
      const processedBuffer = await sharp(buffer)
        .resize(sizeConfig.width, sizeConfig.height, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .jpeg({ quality: sizeName === "thumbnail" ? 70 : 85 })
        .toBuffer()

      const versionUpload = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "hotel-media/versions",
              resource_type: "image",
              public_id: `${sizeName}-${hash.substring(0, 16)}`,
            },
            (error, result) => {
              if (error) reject(error)
              else resolve(result)
            }
          )
          .end(processedBuffer)
      })

      versions[sizeName] = {
        url: versionUpload.secure_url,
      }
    }

    // ==================== INSERTAR MEDIA - ✅ SIN ai_metadata ====================
    const { data: photoData, error: insertError } = await supabase
      .from("media")
      .insert([
        {
          hotel_id: hotelId,
          url: uploadResult.secure_url,
          tags: finalTags,
          confidence_scores: backendResult.tags_confidence || {},
          category: category,
          amenities: amenitiesResult,
          versions: versions,
          hash: hash,
          ai_title: finalTitle,
          // ✅ ELIMINADO: ai_metadata (no existe en tu schema)
        },
      ])
      .select()

    if (insertError) {
      console.error(`❌ [${requestId}] Error insertando en media:`, insertError)
      return NextResponse.json({ error: "Error guardando media" }, { status: 500 })
    }

    if (!photoData || photoData.length === 0) {
      console.error(`❌ [${requestId}] Supabase no devolvió filas después del insert`)
      return NextResponse.json(
        { error: "No se pudo obtener la imagen insertada" },
        { status: 500 }
      )
    }

    console.log(`✅ [${requestId}] Guardado | Título: "${finalTitle}"`)

    // ==================== RESPUESTA FINAL ====================
    console.log(`✅ [${requestId}] Completado exitosamente`)
    
    return NextResponse.json({
      url: uploadResult.secure_url,
      tags: finalTags,
      category: category,
      amenities: amenitiesArray,
      photo_id: photoData[0].id,
      versions: versions,
      ai_title: finalTitle,
      ai_metadata: {
        categoria: backendResult.categoria,
        ubicacion: backendResult.ubicacion,
        confidence: backendResult.confidence
      }
    })

  } catch (error: any) {
    console.error(`❌ [${requestId}] Error fatal en upload:`, {
      message: error.message,
      stack: error.stack?.split("\n").slice(0, 3).join("\n")
    })
    
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

// ============================================================
// 🔧 FUNCIÓN AUXILIAR: Extraer tags de amenities
// ============================================================

function extractAmenityTags(amenities: any): string[] {
  if (!amenities) return []
  
  if (Array.isArray(amenities) && amenities.every((a: any) => typeof a === 'string')) {
    return amenities
  }
  
  if (Array.isArray(amenities) && amenities[0] && typeof amenities[0] === 'object') {
    return amenities
      .map((a: any) => a.id || a.name)
      .filter((t: any) => t && typeof t === 'string')
  }
  
  if (typeof amenities === 'object' && Array.isArray(amenities.flat)) {
    return amenities.flat
  }
  
  if (typeof amenities === 'object' && Array.isArray(amenities.amenities)) {
    return amenities.amenities
      .map((a: any) => a.id || a.name)
      .filter((t: any) => t && typeof t === 'string')
  }
  
  if (typeof amenities === 'object' && amenities.byCategory) {
    const allAmenities: string[] = []
    for (const category of Object.values(amenities.byCategory)) {
      if (Array.isArray(category)) {
        allAmenities.push(...category.map((a: any) => a.id || a.name).filter((t: any) => t))
      }
    }
    return allAmenities
  }
  
  return []
}