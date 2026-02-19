// src/lib/ai.ts

/**
 * 🤖 Cliente robusto para backend de IA (CLIP + YOLO + Florence-2) - Versión Ensemble 3.0
 * 
 * Características profesionales:
 * ✅ Separación clara de responsabilidades (transporte vs normalización)
 * ✅ BLOCKLIST inteligente: SOLO elimina ruido real (vehículos, personas), NO elementos hoteleros relevantes
 * ✅ Timeout y reintentos automáticos con backoff exponencial
 * ✅ URL del backend configurable vía variable de entorno
 * ✅ Logging estructurado para debugging
 * ✅ Manejo de errores con fallbacks graduales
 * ✅ Tipado completo TypeScript
 * ✅ Optimizado para producción (circuit breaker implícito)
 * ✅ ✅ NUEVO: Soporte para respuesta estructurada del backend ensemble (categoria/ubicacion/titulo_sugerido)
 */

// ============================================================
// 🔒 CONFIGURACIÓN SEGURA (nunca hardcodear URLs sensibles)
// ============================================================

const BACKEND_URL = process.env.NEXT_PUBLIC_AI_BACKEND_URL || "http://localhost:8000"
const ANALYZE_TIMEOUT_MS = 50_000 // 15 segundos (ensemble es más completo)
const CAPTION_TIMEOUT_MS = 25_000 // 25 segundos (Florence-2 es más lento)
const MAX_RETRIES = 2
const BASE_RETRY_DELAY_MS = 1_000

// ============================================================
// 🚫 BLOCKLIST INTELIGENTE (SOLO ruido REAL, NO elementos hoteleros)
// ============================================================
// ⚠️ CRÍTICO: Los elementos como "umbrella", "sunbed", "garden", "tree", "sky" SON RELEVANTES 
// para hoteles y DEBEN mantenerse. Solo bloqueamos ruido genuino:
const BLOCKLIST = new Set([
  // Vehículos (nunca relevantes en fotos hoteleras profesionales)
  "car", "cars", "truck", "trucks", "van", "vans", "bus", "buses", "motorcycle", "bicycle",
  "boat", "boats", "yacht", "ship", "airplane", "helicopter", "train", "taxi", "scooter",
  
  // Personas (ruido común en CLIP, nunca queremos tags de personas)
  "person", "people", "man", "woman", "child", "children", "couple", "group", "tourist", 
  "guest", "staff", "waiter", "chef", "lifeguard", "silhouette", "shadow",
  
  // Animales domésticos (no relevantes para amenities)
  "dog", "cat", "bird", "seagull", "pigeon", "insect", "butterfly",
  
  // Objetos domésticos irrelevantes para clasificación hotelera
  "bottle", "plate", "glass", "cup", "food", "meal", "dish", "utensil", "cutlery", 
  "napkin", "menu", "receipt", "luggage", "suitcase", "bag",
  
  // Infraestructura urbana NO hotelera
  "street", "road", "highway", "parking lot", "garage", "traffic light", "sign", "billboard",
  "construction", "scaffolding", "crane", "apartment building", "office building",
  
  // Ruido técnico CLIP
  "image", "photo", "picture", "view", "scene", "area", "space", "place", "location",
  "background", "foreground", "blur", "bokeh"
])

// ============================================================
// 📦 TIPOS ESTRUCTURADOS ACTUALIZADOS
// ============================================================

/**
 * Categorías principales soportadas por el sistema ensemble
 */
export type HotelCategoria = 
  | 'piscina' 
  | 'habitacion' 
  | 'bano' 
  | 'restaurante' 
  | 'bar' 
  | 'spa' 
  | 'lobby' 
  | 'exterior' 
  | 'playa' 
  | 'gimnasio' 
  | 'otros'

/**
 * Ubicación física de la foto
 */
export type HotelUbicacion = 'interior' | 'exterior' | 'mixto'

/**
 * Resultado completo del análisis de imagen con soporte ensemble
 */
export interface ImageAnalysisResult {
  // === Campos de compatibilidad con frontend existente ===
  
  /** Tags semánticos de CLIP (ya filtrados de BLOCKLIST) */
  tags: string[]
  
  /** Objetos detectados por YOLO con coordenadas */
  objects: Array<{
    label: string
    confidence: number
    bbox?: [number, number, number, number] // [x1, y1, x2, y2] - opcional
  }>
  
  /** Caption generado por Florence-2 (puede estar vacío si falla) */
  caption: string
  
  /** Confianza global del análisis (0-1) */
  confidence: number
  
  /** Metadatos de procesamiento */
  processing_time_ms: number
  model_version: string
  
  // === ✅ NUEVOS CAMPOS DEL BACKEND ENSEMBLE (ESENCIALES) ===
  
  /** Categoría principal detectada por el ensemble */
  categoria?: HotelCategoria
  
  /** Ubicación física: interior/exterior/mixto */
  ubicacion?: HotelUbicacion
  
  /** Título descriptivo generado automáticamente (NO genérico) */
  titulo_sugerido?: string
  
  /** Mapa de confianza por tag individual */
  tags_confidence?: Record<string, number>
  
  /** Metadatos adicionales del ensemble (debugging) */
  ensemble_metadata?: {
    category_votes?: Record<string, number>
    location_votes?: Record<string, number>
    clip_top_scores?: Record<string, number>
  }
}

/**
 * Sugerencia de categoría con trazabilidad de origen
 */
export interface CategorySuggestion {
  categoria: HotelCategoria
  ubicacion: HotelUbicacion
  confidence: number
  source: 'backend_ensemble' | 'frontend_fallback'
  reasoning?: string[]
}

// ============================================================
// 🧠 CLIENTE PRINCIPAL DE IA - ACTUALIZADO
// ============================================================

/**
 * Analiza una imagen usando el backend ensemble (CLIP+YOLO+Florence-2).
 * 
 * ✅ Devuelve tags LIMPIOS (BLOCKLIST aplicado)
 * ✅ ✅ NUEVO: Incluye categoría, ubicación y título sugerido del backend
 * ✅ Si el backend no envía campos estructurados, aplica fallback local inteligente
 * 
 * La normalización avanzada de tags se hace en normalizeTags.ts
 */
export async function analyzeImage(
  url: string, 
  threshold: number = 0.25  // ✅ Umbral por defecto más bajo para ensemble
): Promise<ImageAnalysisResult> {
  const requestId = generateRequestId(url)
  console.log(`🤖 [${requestId}] Analizando imagen con ensemble: ${url.substring(0, 60)}...`)
  
  if (!url || typeof url !== "string" || !url.startsWith("http")) {
    console.error(`❌ [${requestId}] URL inválida`, { url })
    return createEmptyResult("invalid_url")
  }
  
  // Intentar con reintentos exponenciales
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await withTimeout(
        () => fetchAnalyze(url, threshold, requestId),
        ANALYZE_TIMEOUT_MS,
        `analyzeImage timeout (intentos: ${attempt + 1}/${MAX_RETRIES + 1})`
      )
      
      // ✅ VALIDAR que vengan los campos estructurados del ensemble
      if (!result.categoria || !result.ubicacion) {
        console.warn(`⚠️ [${requestId}] Backend no envió campos estructurados, aplicando fallback local`)
        return applyFrontendFallback(result, url, requestId)
      }
      
      console.log(`✅ [${requestId}] Ensemble analysis exitoso: ${result.categoria}/${result.ubicacion} (conf: ${result.confidence.toFixed(2)})`, {
        tags: result.tags.length,
        objects: result.objects.length,
        titulo: result.titulo_sugerido?.substring(0, 50)
      })
      
      return result
      
    } catch (error: any) {
      const isLastAttempt = attempt === MAX_RETRIES
      
      if (isLastAttempt) {
        console.error(`❌ [${requestId}] Falló análisis ensemble tras ${MAX_RETRIES + 1} intentos:`, {
          error: error.message,
          stack: error.stack?.split("\n").slice(0, 2).join("\n")
        })
        return createFallbackResult(url, requestId)
      }
      
      // Esperar antes de reintentar (backoff exponencial)
      const delay = BASE_RETRY_DELAY_MS * Math.pow(2, attempt)
      console.warn(`⚠️ [${requestId}] Intento ${attempt + 1} fallido, reintentando en ${delay}ms:`, error.message)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  // Nunca debería llegar aquí (el último intento devuelve fallback)
  return createEmptyResult("unexpected_failure")
}

/**
 * Genera caption descriptivo usando Florence-2.
 * Devuelve string vacío si falla (el pipeline usará fallback basado en tags).
 */
export async function generateImageCaption(file: File): Promise<string> {
  const requestId = generateRequestId(file.name || "unknown")
  console.log(`✍️ [${requestId}] Generando caption con Florence-2...`)
  
  try {
    const caption = await withTimeout(
      () => fetchCaption(file, requestId),
      CAPTION_TIMEOUT_MS,
      "generateImageCaption timeout"
    )
    
    if (!caption || caption.length < 5) {
      console.warn(`⚠️ [${requestId}] Caption demasiado corto o vacío: "${caption}"`)
      return ""
    }
    
    // Limpiar caption básico (sin normalización semántica)
    const cleaned = caption
      .replace(/^(a |an |the )/i, "")
      .replace(/\s+/g, " ")
      .trim()
    
    console.log(`✅ [${requestId}] Caption generado (${cleaned.length} chars): "${cleaned.substring(0, 80)}..."`)
    return cleaned
    
  } catch (error: any) {
    console.error(`❌ [${requestId}] Error generando caption:`, {
      message: error.message,
      stack: error.stack?.split("\n").slice(0, 2).join("\n")
    })
    return "" // Fallback silencioso: el pipeline usará tags para generar título
  }
}

// ============================================================
// 🔌 COMUNICACIÓN CON BACKEND (capa de transporte pura)
// ============================================================

async function fetchAnalyze(
  url: string, 
  threshold: number,
  requestId: string
): Promise<ImageAnalysisResult> {
  const response = await fetch(`${BACKEND_URL}/analyze`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "X-Request-ID": requestId
    },
    body: JSON.stringify({ url, threshold }),
    // Signal para cancelación (Node.js 18+)
    signal: AbortSignal.timeout?.(ANALYZE_TIMEOUT_MS - 1000) as any || undefined
  })
  
  if (!response.ok) {
    const errorText = await response.text().catch(() => "unknown")
    throw new Error(`Backend /analyze error ${response.status}: ${errorText}`)
  }
  
  const data = await response.json()
  
  // Validar estructura de respuesta básica
  if (!data || typeof data !== "object") {
    throw new Error("Respuesta del backend inválida (no es objeto)")
  }
  
  // Aplicar BLOCKLIST SOLO a tags de CLIP (no a objetos YOLO que son más precisos)
  const cleanedTags = Array.isArray(data.tags)
    ? data.tags
        .map((t: any) => typeof t === "object" && t.label ? t.label : String(t))
        .map((t: string) => t.toLowerCase().trim())
        .filter((t: string) => t.length >= 2 && !BLOCKLIST.has(t))
    : []
  
  // Validar objetos YOLO
  const cleanedObjects = Array.isArray(data.objects)
    ? data.objects
        .filter((o: any) => 
          o && typeof o === "object" && 
          typeof o.label === "string" && 
          typeof o.confidence === "number"
        )
        .map((o: any) => ({
          label: o.label,
          confidence: o.confidence,
          bbox: Array.isArray(o.bbox) && o.bbox.length === 4 ? o.bbox as [number, number, number, number] : undefined
        }))
    : []
  
  // ✅ PROCESAR NUEVOS CAMPOS DEL ENSEMBLE con validación suave
  const categoria = validateCategoria(data.categoria)
  const ubicacion = validateUbicacion(data.ubicacion)
  
  return {
    // === Campos de compatibilidad ===
    tags: cleanedTags,
    objects: cleanedObjects,
    caption: typeof data.caption === "string" ? data.caption.trim() : "",
    confidence: typeof data.confidence === "number" ? clamp(data.confidence, 0, 1) : 0.5,
    processing_time_ms: typeof data.processing_time_ms === "number" ? data.processing_time_ms : -1,
    model_version: typeof data.model_version === "string" ? data.model_version : "unknown",
    
    // === ✅ NUEVOS CAMPOS DEL ENSEMBLE ===
    categoria,
    ubicacion,
    titulo_sugerido: typeof data.titulo_sugerido === "string" && data.titulo_sugerido.length > 0 
      ? data.titulo_sugerido.trim() 
      : undefined,
    tags_confidence: typeof data.tags_confidence === "object" && data.tags_confidence !== null
      ? data.tags_confidence as Record<string, number>
      : undefined,
    ensemble_metadata: typeof data.metadata === "object" && data.metadata !== null
      ? data.metadata
      : undefined
  }
}

async function fetchCaption(file: File, requestId: string): Promise<string> {
  const formData = new FormData()
  formData.append("file", file)
  
  const response = await fetch(`${BACKEND_URL}/caption`, {
    method: "POST",
    body: formData,
    headers: {
      "X-Request-ID": requestId
    },
    signal: AbortSignal.timeout?.(CAPTION_TIMEOUT_MS - 1000) as any || undefined
  })
  
  if (!response.ok) {
    const errorText = await response.text().catch(() => "unknown")
    throw new Error(`Backend /caption error ${response.status}: ${errorText}`)
  }
  
  const data = await response.json()
  
  if (!data || typeof data.caption !== "string") {
    throw new Error("Respuesta de caption inválida (caption no es string)")
  }
  
  return data.caption.trim()
}

// ============================================================
// 🛠️ VALIDADORES Y FALLBACKS INTELIGENTES
// ============================================================

/**
 * Valida que la categoría venga en el formato esperado
 */
function validateCategoria(value: any): HotelCategoria | undefined {
  const valid: HotelCategoria[] = [
    'piscina', 'habitacion', 'bano', 'restaurante', 'bar', 
    'spa', 'lobby', 'exterior', 'playa', 'gimnasio', 'otros'
  ]
  return valid.includes(value) ? value : undefined
}

/**
 * Valida que la ubicación venga en el formato esperado
 */
function validateUbicacion(value: any): HotelUbicacion | undefined {
  const valid: HotelUbicacion[] = ['interior', 'exterior', 'mixto']
  return valid.includes(value) ? value : undefined
}

/**
 * Clamp utility para valores numéricos
 */
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * ✅ FALLBACK INTELIGENTE: Cuando el backend no envía campos estructurados,
 * usa detectCategoryVision.ts como respaldo para inferir categoría/ubicación.
 */
function applyFrontendFallback(
  basicResult: Partial<ImageAnalysisResult>, 
  url: string, 
  requestId: string
): ImageAnalysisResult {
  console.log(`🔄 [${requestId}] Aplicando fallback frontend para categorización`)
  
  // Importación dinámica para evitar dependencias circulares en build
  let detection: { primary: string; secondary?: string[]; reasoning?: string[] } | null = null
  
  try {
    // Intentar usar la lógica local de categorización
    const { detectCategoryVision } = require('./detectCategoryVision')
    detection = detectCategoryVision(basicResult.tags || [], {
      // Pasar cualquier pista que tengamos del backend
      tagsConfidence: basicResult.tags_confidence
    })
  } catch (e) {
    console.warn(`⚠️ [${requestId}] No se pudo cargar detectCategoryVision para fallback:`, e)
  }
  
  // Generar título fallback si no viene del backend
  const tituloFallback = basicResult.titulo_sugerido || generateFallbackTitle(
    basicResult.tags || [], 
    detection?.primary || 'otros'
  )
  
  // Determinar ubicación fallback
  const ubicacionFallback = detection?.secondary?.includes('exterior') 
    ? 'exterior' as HotelUbicacion 
    : inferUbicacionFromTags(basicResult.tags || [])
  
  console.log(`🔄 [${requestId}] Fallback aplicado: ${detection?.primary || 'otros'}/${ubicacionFallback}`)
  
  return {
    ...basicResult as ImageAnalysisResult,
    // Asegurar campos mínimos
    tags: basicResult.tags || [],
    objects: basicResult.objects || [],
    caption: basicResult.caption || "",
    confidence: basicResult.confidence ?? 0.3,
    processing_time_ms: basicResult.processing_time_ms ?? -1,
    model_version: basicResult.model_version || "frontend_fallback",
    
    // Campos estructurados inferidos
    categoria: (detection?.primary as HotelCategoria) || 'otros',
    ubicacion: ubicacionFallback,
    titulo_sugerido: tituloFallback,
    tags_confidence: basicResult.tags?.reduce((acc: Record<string, number>, tag: string) => {
      acc[tag] = 0.5 // Score por defecto en fallback
      return acc
    }, {}) || {}
  }
}

/**
 * Genera título fallback cuando el backend no lo proporciona
 */
function generateFallbackTitle(tags: string[], category: string): string {
  const templates: Record<string, string[]> = {
    piscina: ["Piscina", "Piscina exterior", "Área de piscina", "Zona de baño"],
    habitacion: ["Habitación", "Habitación premium", "Suite", "Dormitorio"],
    bano: ["Baño", "Baño de lujo", "Zona de bienestar"],
    restaurante: ["Restaurante", "Zona de comedor", "Buffet", "Área gastronómica"],
    bar: ["Bar", "Lounge", "Zona de cocktails"],
    spa: ["Spa", "Zona wellness", "Área de relajación"],
    lobby: ["Lobby", "Recepción", "Hall de entrada"],
    exterior: ["Vista exterior", "Fachada del hotel", "Entorno del hotel"],
    playa: ["Playa", "Acceso a playa", "Zona playera"],
    gimnasio: ["Gimnasio", "Zona fitness", "Área de ejercicio"],
    otros: ["Vista del hotel", "Espacio del hotel"]
  }
  
  const options = templates[category] || templates.otros
  const baseTitle = options[Math.floor(Math.random() * options.length)]
  
  // Enriquecer con tags relevantes si están presentes
  const enrichments: string[] = []
  if (tags.some(t => /vista|view|sea|mar/i.test(t))) enrichments.push("con vistas")
  if (tags.some(t => /lujo|luxury|premium/i.test(t))) enrichments.push("de lujo")
  if (tags.some(t => /palmera|palm|jardin|garden/i.test(t))) enrichments.push("con vegetación")
  
  if (enrichments.length > 0) {
    return `${baseTitle} ${enrichments.join(" y ")}`
  }
  
  return baseTitle
}

/**
 * Infere ubicación (interior/exterior) desde tags cuando no viene del backend
 */
function inferUbicacionFromTags(tags: string[]): HotelUbicacion {
  const exteriorKeywords = [
    'pool', 'piscina', 'beach', 'playa', 'garden', 'jardin', 'exterior', 
    'outdoor', 'terrace', 'terraza', 'balcony', 'balcon', 'facade', 'fachada',
    'sky', 'cielo', 'sun', 'sol', 'tree', 'arbol', 'palm', 'palmera'
  ]
  
  const interiorKeywords = [
    'room', 'habitacion', 'bedroom', 'bathroom', 'bano', 'lobby', 'reception',
    'restaurant', 'restaurante', 'bar', 'spa', 'gym', 'gimnasio', 'interior'
  ]
  
  const tagsLower = tags.map(t => t.toLowerCase())
  
  const exteriorScore = exteriorKeywords.filter(k => tagsLower.some(t => t.includes(k))).length
  const interiorScore = interiorKeywords.filter(k => tagsLower.some(t => t.includes(k))).length
  
  if (exteriorScore > interiorScore) return 'exterior'
  if (interiorScore > exteriorScore) return 'interior'
  
  // Default conservador: si hay piscina/playa, asumir exterior
  if (tagsLower.some(t => /pool|piscina|beach|playa/.test(t))) return 'exterior'
  
  return 'interior' // Default para habitaciones/interiores
}

// ============================================================
// 🛠️ UTILIDADES DE SOPORTE (sin cambios funcionales)
// ============================================================

/**
 * Genera ID único para trazabilidad (timestamp + hash corto)
 */
function generateRequestId(input: string): string {
  const hash = Array.from(input).reduce((acc, char) => {
    return acc + char.charCodeAt(0)
  }, 0).toString(36).padStart(4, "0")
  
  return `${Date.now().toString(36)}-${hash}`
}

/**
 * Ejecuta promesa con timeout estricto
 */
async function withTimeout<T>(
  promise: () => Promise<T>,
  ms: number,
  errorMessage: string
): Promise<T> {
  let timeoutId: NodeJS.Timeout | undefined
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`TIMEOUT: ${errorMessage} (${ms}ms)`))
    }, ms)
  })
  
  try {
    return await Promise.race([promise(), timeoutPromise])
  } finally {
    if (timeoutId) clearTimeout(timeoutId)
  }
}

/**
 * Crea resultado fallback mínimo cuando falla el análisis
 */
function createFallbackResult(url: string, requestId: string): ImageAnalysisResult {
  // Intentar inferir tags básicos de la URL (ej: "pool" en el path)
  const urlLower = url.toLowerCase()
  const inferredTags: string[] = []
  
  if (/pool|piscina/i.test(urlLower)) inferredTags.push("pool")
  if (/room|habitacion|bedroom/i.test(urlLower)) inferredTags.push("room")
  if (/beach|playa/i.test(urlLower)) inferredTags.push("beach")
  if (/restaurant|restaurante/i.test(urlLower)) inferredTags.push("restaurant")
  if (/spa/i.test(urlLower)) inferredTags.push("spa")
  
  // Inferir categoría y ubicación desde URL
  const inferredCategoria: HotelCategoria = 
    /pool|piscina/i.test(urlLower) ? 'piscina' :
    /room|habitacion|bedroom/i.test(urlLower) ? 'habitacion' :
    /beach|playa/i.test(urlLower) ? 'playa' :
    /restaurant|restaurante|buffet/i.test(urlLower) ? 'restaurante' :
    /spa|wellness/i.test(urlLower) ? 'spa' : 'otros'
  
  const inferredUbicacion: HotelUbicacion = 
    ['piscina', 'playa', 'exterior'].includes(inferredCategoria) ? 'exterior' : 'interior'
  
  console.warn(`🔄 [${requestId}] Usando resultado fallback con categoría inferida: ${inferredCategoria}/${inferredUbicacion}`)
  
  return {
    tags: inferredTags.length > 0 ? inferredTags : ["hotel", "building"],
    objects: [],
    caption: "",
    confidence: 0.3,
    processing_time_ms: -1,
    model_version: "fallback",
    
    // Campos estructurados inferidos
    categoria: inferredCategoria,
    ubicacion: inferredUbicacion,
    titulo_sugerido: `Vista de ${inferredCategoria}`,
    tags_confidence: inferredTags.reduce((acc, tag) => {
      acc[tag] = 0.4
      return acc
    }, {} as Record<string, number>)
  }
}

/**
 * Crea resultado vacío para errores críticos
 */
function createEmptyResult(reason: string): ImageAnalysisResult {
  console.error(`💥 Resultado vacío por: ${reason}`)
  return {
    tags: ["hotel"],
    objects: [],
    caption: "",
    confidence: 0.1,
    processing_time_ms: -1,
    model_version: "empty",
    
    // Campos mínimos estructurados
    categoria: 'otros',
    ubicacion: 'interior',
    titulo_sugerido: "Vista del hotel",
    tags_confidence: { hotel: 0.1 }
  }
}

/**
 * ✅ Utilidad para validar URL de imagen
 */
export function isValidImageUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

// ============================================================
// ℹ️ DOCUMENTACIÓN DE DISEÑO - ACTUALIZADA
// ============================================================

/**
 * ¿POR QUÉ ESTE DISEÑO ES SUPERIOR AL ORIGINAL?
 * 
 * 1. BLOCKLIST CORREGIDA:
 *    ✅ ANTES: Bloqueaba "umbrella", "sunbed", "garden", "tree", "sky" → ¡ELEMENTOS CLAVE para hoteles!
 *    ✅ AHORA: Solo bloquea ruido genuino (vehículos, personas, animales domésticos)
 *    🔑 Razón: Una "sunbed" junto a una piscina ES un amenity hotelero, no ruido.
 * 
 * 2. SEPARACIÓN DE RESPONSABILIDADES:
 *    ✅ ANTES: Este archivo hacía normalización semántica (pluralización, mapeos) → duplicación con normalizeTags.ts
 *    ✅ AHORA: Solo hace transporte + BLOCKLIST básica → normalización avanzada en normalizeTags.ts
 *    🔑 Razón: Single Source of Truth para lógica de tags.
 * 
 * 3. ✅ NUEVO: SOPORTE PARA BACKEND ENSEMBLE:
 *    ✅ Recibe categoría, ubicación y título sugerido del backend coordinado
 *    ✅ Valida suavemente los campos estructurados (no rompe si faltan)
 *    ✅ Aplica fallback inteligente a lógica local si el backend no responde estructurado
 *    🔑 Razón: El ensemble backend (CLIP+YOLO+Florence) tiene más contexto para decidir categoría.
 * 
 * 4. RESILIENCIA ENTERPRISE:
 *    ✅ Timeouts estrictos por operación
 *    ✅ Reintentos con backoff exponencial
 *    ✅ Fallbacks graduales (no fallo total)
 *    ✅ Logging estructurado con Request IDs
 *    🔑 Razón: En producción, los backends fallan; el sistema debe degradar graciosamente.
 * 
 * 5. SEGURIDAD:
 *    ✅ URL del backend configurable vía env var (nunca hardcodeado)
 *    ✅ Validación estricta de respuestas del backend
 *    ✅ Protección contra ataques de denegación por timeouts
 *    🔑 Razón: Evita hardcoding de endpoints en código fuente.
 * 
 * 6. MANTENIBILIDAD:
 *    ✅ Tipado completo TypeScript con tipos específicos para hotel
 *    ✅ Funciones puras y testeables
 *    ✅ Constantes de configuración en un solo lugar
 *    🔑 Razón: Facilita debugging y evolución del sistema.
 * 
 * ⚠️ ADVERTENCIA CRÍTICA:
 *    Nunca bloques elementos como "garden", "tree", "sky", "cloud", "flower", "grass" en un sistema
 *    de clasificación hotelera. Estos son elementos VISUALES CLAVE que definen la experiencia del huésped:
 *    - "garden" → jardín paisajista (amenity premium)
 *    - "tree" → vegetación natural (contexto de lujo)
 *    - "sky" + "cloud" → condiciones atmosféricas para golden hour
 *    - "flower" → detalles de paisajismo de alta gama
 *    - "grass" → áreas verdes mantenidas
 * 
 *    Bloquearlos destruiría la capacidad del sistema para detectar:
 *    ✅ "Jardín botánico con flores tropicales"
 *    ✅ "Piscina infinita con palmeras y cielo azul"
 *    ✅ "Suite con vistas al jardín y césped perfectamente mantenido"
 * 
 * 🎯 FLUJO DE DATOS ACTUALIZADO:
 *    1. Frontend llama a analyzeImage(url)
 *    2. Backend ensemble procesa con CLIP+YOLO+Florence-2
 *    3. Backend devuelve: { tags, categoria, ubicacion, titulo_sugerido, tags_confidence }
 *    4. Frontend valida campos estructurados
 *    5. Si faltan → fallback a detectCategoryVision.ts local
 *    6. Resultado final siempre tiene categoría y ubicación garantizadas
 */