// src/lib/detectCategoryVision.ts - Versión 4.0.2 ROBUSTA (CORREGIDA)

export type HotelCategory =
  | "pool" | "infinity_pool" | "indoor_pool" | "beach" | "kids_pool"
  | "room" | "suite" | "presidential_suite" | "bathroom"
  | "restaurant" | "buffet" | "bar" | "rooftop_bar" | "pool_bar" | "beach_bar"
  | "spa" | "sauna" | "steam_room" | "gym" | "yoga_room"
  | "terrace" | "rooftop_terrace" | "garden" | "courtyard" | "exterior"
  | "lobby" | "lounge" | "library"
  | "conference_room" | "ballroom" | "wedding_venue"
  | "kids_area" | "playground"
  | "view" | "architectural_detail" | "other"

export interface CategoryDetection {
  primary: HotelCategory
  secondary?: HotelCategory[]
  confidence: "high" | "medium" | "low"
  reasoning: string[]
  tagsUsed: string[]
  source?: 'backend_ensemble' | 'frontend_inference'
  metadata?: { 
    backendConfidence?: number
    validationScore?: number
    fallbackReason?: string
    locationType?: 'interior' | 'exterior' | 'mixto' // ✅ NUEVO: Ubicación separada de categoría
  }
}

export interface CategoryDetectionOptions {
  backendCategoria?: string
  backendUbicacion?: 'interior' | 'exterior' | 'mixto'
  tagsConfidence?: Record<string, number>
  minBackendConfidence?: number
  captionContext?: string
}

export function detectCategoryVision(tags: string[], options?: CategoryDetectionOptions): CategoryDetection {
  const normalized = tags.map(t => t.toLowerCase().trim())
  const has = (keywords: string | string[]): boolean => {
    const keys = Array.isArray(keywords) ? keywords : [keywords]
    return keys.some(k => normalized.includes(k.toLowerCase().trim()))
  }

  // ✅ PRIORIDAD 1: BACKEND con validación ESTRICTA
  const minConfidence = options?.minBackendConfidence ?? 0.75
  
  if (options?.backendCategoria && options?.backendUbicacion) {
    const validation = validateBackendDecision({
      backendCategoria: options.backendCategoria,
      backendUbicacion: options.backendUbicacion,
      tags: normalized,
      tagsConfidence: options.tagsConfidence,
      captionContext: options.captionContext
    })
    
    // ✅ FORZAR INTERIOR para categorías que siempre son interiores
    const alwaysInterior = ['restaurante', 'bar', 'lobby', 'gimnasio', 'bano', 'habitacion', 'spa']
    const forcedUbicacion = alwaysInterior.includes(options.backendCategoria) && options.backendUbicacion === 'exterior'
      ? 'interior' 
      : options.backendUbicacion
    
    if (validation.isValid && validation.confidence >= minConfidence) {
      return {
        primary: mapBackendCategoria(options.backendCategoria),
        // ✅ CORREGIDO: Secondary solo con categorías relacionadas válidas
        secondary: buildSecondaryCategories(options.backendCategoria, normalized),
        confidence: validation.confidence >= 0.8 ? "high" : validation.confidence >= 0.75 ? "medium" : "low",
        reasoning: [`backend ensemble: ${validation.reason}`],
        tagsUsed: tags.slice(0, 5),
        source: 'backend_ensemble',
        metadata: { 
          backendConfidence: validation.confidence, 
          validationScore: validation.score,
          locationType: forcedUbicacion // ✅ Ubicación separada
        }
      }
    }
  }

  // ✅ PRIORIDAD 2: LÓGICA LOCAL con reglas MEJORADAS
  
  // REGLA 1: Restaurante/buffet → INTERIOR (máxima prioridad)
  if (has(["restaurant", "buffet", "bufet", "dining_room"]) || (has("dining_table") && has("chair"))) {
    return { 
      primary: "restaurant", 
      // ✅ CORREGIDO: Secondary con categorías relacionadas, no ubicación
      secondary: buildSecondaryCategoriesLocal("restaurante", normalized),
      confidence: "high",
      reasoning: ["restaurante detectado → interior"], 
      tagsUsed: tags.slice(0, 5), 
      source: 'frontend_inference',
      metadata: { locationType: 'interior' } // ✅ Ubicación en metadata
    }
  }
  
  // REGLA 2: Bar con mobiliario → INTERIOR
  if (has("bar") && (has("chair") || has("table") || has("counter"))) {
    return { 
      primary: "bar", 
      secondary: buildSecondaryCategoriesLocal("bar", normalized),
      confidence: "high",
      reasoning: ["bar con mobiliario → interior"], 
      tagsUsed: tags.slice(0, 5), 
      source: 'frontend_inference',
      metadata: { locationType: 'interior' }
    }
  }
  
  // REGLA 3: Lobby/recepción → INTERIOR
  if (has(["lobby", "reception", "check-in", "atrium"])) {
    return { 
      primary: "lobby", 
      secondary: buildSecondaryCategoriesLocal("lobby", normalized),
      confidence: "high",
      reasoning: ["lobby detectado → interior"], 
      tagsUsed: tags.slice(0, 5), 
      source: 'frontend_inference',
      metadata: { locationType: 'interior' }
    }
  }
  
  // REGLA 4: Habitación → INTERIOR
  if (has(["room", "bedroom", "suite", "bed"]) || has(["king_bed", "queen_bed", "twin_beds"])) {
    return { 
      primary: has(["suite", "presidential"]) ? "suite" : "room", 
      secondary: buildSecondaryCategoriesLocal("habitacion", normalized),
      confidence: "high",
      reasoning: ["habitación detectada → interior"], 
      tagsUsed: tags.slice(0, 5), 
      source: 'frontend_inference',
      metadata: { locationType: 'interior' }
    }
  }
  
  // REGLA 5: Baño → INTERIOR
  if (has(["bathroom", "baño", "shower", "bathtub"])) {
    return { 
      primary: "bathroom", 
      secondary: buildSecondaryCategoriesLocal("bano", normalized),
      confidence: "high",
      reasoning: ["baño detectado → interior"], 
      tagsUsed: tags.slice(0, 5), 
      source: 'frontend_inference',
      metadata: { locationType: 'interior' }
    }
  }
  
  // REGLA 6: Spa/gimnasio → INTERIOR
  if (has(["spa", "sauna", "massage", "gym", "fitness"])) {
    return { 
      primary: has(["gym", "fitness"]) ? "gym" : "spa", 
      secondary: buildSecondaryCategoriesLocal("spa", normalized),
      confidence: "high",
      reasoning: ["spa/gimnasio detectado → interior"], 
      tagsUsed: tags.slice(0, 5), 
      source: 'frontend_inference',
      metadata: { locationType: 'interior' }
    }
  }
  
  // REGLA 7: Piscina infinita → EXTERIOR
  if (has("infinity_pool") || (has("pool") && has(["vanishing", "edge", "horizon", "sea_view"]))) {
    return { 
      primary: "infinity_pool", 
      secondary: buildSecondaryCategoriesLocal("piscina", normalized),
      confidence: "high",
      reasoning: ["piscina infinita → exterior"], 
      tagsUsed: tags.slice(0, 5), 
      source: 'frontend_inference',
      metadata: { locationType: 'exterior' }
    }
  }
  
  // REGLA 8: Piscina exterior (solo si hay indicadores claros de exterior)
  if (has("pool") && !has(["ceiling", "techo", "indoor", "chandelier"]) && has(["exterior", "outdoor", "sky", "sun", "palm"])) {
    return { 
      primary: "pool", 
      secondary: buildSecondaryCategoriesLocal("piscina", normalized),
      confidence: "high",
      reasoning: ["piscina con indicadores exteriores"], 
      tagsUsed: tags.slice(0, 5), 
      source: 'frontend_inference',
      metadata: { locationType: 'exterior' }
    }
  }
  
  // REGLA 9: Playa → EXTERIOR
  if (has(["beach", "playa", "shoreline", "sand"])) {
    return { 
      primary: "beach", 
      secondary: buildSecondaryCategoriesLocal("playa", normalized),
      confidence: "high",
      reasoning: ["playa detectada → exterior"], 
      tagsUsed: tags.slice(0, 5), 
      source: 'frontend_inference',
      metadata: { locationType: 'exterior' }
    }
  }
  
  // REGLA 10: Fachada/exterior → EXTERIOR
  if (has(["facade", "fachada", "building exterior", "vista exterior"])) {
    return { 
      primary: "exterior", 
      secondary: buildSecondaryCategoriesLocal("exterior", normalized),
      confidence: "high",
      reasoning: ["fachada detectada → exterior"], 
      tagsUsed: tags.slice(0, 5), 
      source: 'frontend_inference',
      metadata: { locationType: 'exterior' }
    }
  }
  
  // REGLA 11: Jardín → EXTERIOR
  if (has(["garden", "jardin", "landscaped", "palm_tree"])) {
    return { 
      primary: "garden", 
      secondary: buildSecondaryCategoriesLocal("exterior", normalized),
      confidence: "medium",
      reasoning: ["jardín detectado → exterior"], 
      tagsUsed: tags.slice(0, 5), 
      source: 'frontend_inference',
      metadata: { locationType: 'exterior' }
    }
  }

  // FALLBACK: Sin categoría clara → asumir interior (más seguro)
  return {
    primary: "other",
    // ✅ CORREGIDO: Secondary vacío o con categorías inferidas, nunca ubicación
    secondary: [],
    confidence: "low",
    reasoning: ["fallback: sin categoría clara"],
    tagsUsed: normalized.slice(0, 3),
    source: 'frontend_inference',
    metadata: { 
      fallbackReason: "sin_categoria_clara",
      locationType: 'interior' // Default seguro
    }
  }
}

// ✅ VALIDACIÓN DE BACKEND MEJORADA
interface BackendValidationResult {
  isValid: boolean; confidence: number; score: number; reason: string; matchingTags: string[]
}

function validateBackendDecision(params: {
  backendCategoria: string; backendUbicacion: string; tags: string[];
  tagsConfidence?: Record<string, number>; captionContext?: string
}): BackendValidationResult {
  const { backendCategoria, backendUbicacion, tags, tagsConfidence, captionContext } = params
  
  const categoryKeywords: Record<string, string[]> = {
    piscina: ["pool", "piscina", "swimming", "jacuzzi"],
    habitacion: ["room", "habitacion", "bedroom", "suite", "bed"],
    bano: ["bathroom", "baño", "shower", "bathtub"],
    restaurante: ["restaurant", "restaurante", "dining", "buffet", "bufet"],
    bar: ["bar", "barra", "lounge", "cocktail"],
    spa: ["spa", "wellness", "massage", "sauna"],
    lobby: ["lobby", "reception", "hall", "atrium"],
    exterior: ["exterior", "facade", "fachada", "building"],
    playa: ["beach", "playa", "shoreline", "sand"],
    gimnasio: ["gym", "gimnasio", "fitness"]
  }
  
  const keywords = categoryKeywords[backendCategoria] || []
  if (keywords.length === 0) return { isValid: false, confidence: 0, score: 0, reason: "categoria_desconocida", matchingTags: [] }
  
  let maxScore = 0; const matchingTags: string[] = []
  for (const keyword of keywords) {
    const tagMatch = tags.find(t => t.includes(keyword) || keyword.includes(t))
    if (tagMatch) {
      const score = tagsConfidence?.[tagMatch] ?? 0.5
      if (score > maxScore) { maxScore = score; matchingTags.push(tagMatch) }
    }
  }
  
  if (maxScore < 0.1) return { isValid: false, confidence: 0, score: 0, reason: "sin_tags_coincidentes", matchingTags: [] }
  
  // ✅ VALIDACIÓN DE UBICACIÓN: Categorías que SIEMPRE son interior
  const alwaysInterior = ['restaurante', 'bar', 'lobby', 'gimnasio', 'bano', 'habitacion', 'spa']
  if (alwaysInterior.includes(backendCategoria) && backendUbicacion === 'exterior') {
    return { isValid: false, confidence: maxScore, score: maxScore, 
      reason: `categoria ${backendCategoria} siempre es interior`, matchingTags }
  }
  
  const isValid = maxScore >= 0.4
  return { isValid, confidence: maxScore, score: maxScore, 
    reason: isValid ? `validación_ok (${maxScore.toFixed(2)})` : `score_insuficiente`, matchingTags }
}

function mapBackendCategoria(backend: string): HotelCategory {
  const mapping: Record<string, HotelCategory> = {
    piscina: "pool", habitacion: "room", bano: "bathroom", restaurante: "restaurant",
    bar: "bar", spa: "spa", lobby: "lobby", exterior: "exterior", playa: "beach", gimnasio: "gym",
    infinity_pool: "infinity_pool", indoor_pool: "indoor_pool", kids_pool: "kids_pool",
    suite: "suite", presidential_suite: "presidential_suite", buffet: "buffet",
    rooftop_bar: "rooftop_bar", pool_bar: "pool_bar", beach_bar: "beach_bar",
    sauna: "sauna", steam_room: "steam_room", yoga_room: "yoga_room",
    terrace: "terrace", rooftop_terrace: "rooftop_terrace", garden: "garden",
    courtyard: "courtyard", lounge: "lounge", library: "library",
    conference_room: "conference_room", ballroom: "ballroom", wedding_venue: "wedding_venue",
    kids_area: "kids_area", playground: "playground", view: "view",
    architectural_detail: "architectural_detail", otros: "other"
  }
  return mapping[backend] || "other"
}

// ✅ CORREGIDO: Build secondary categories - SOLO categorías relacionadas válidas
function buildSecondaryCategories(categoria: string, tags: string[]): HotelCategory[] {
  const secondary: HotelCategory[] = []
  
  // === VISTAS (si hay evidencia) ===
  if (tags.some(t => /sea.*view|vista.*mar|ocean.*view|horizon|panoramic/.test(t))) {
    secondary.push('view')
  } else if (tags.some(t => /city.*view|skyline|urbano/.test(t))) {
    secondary.push('view')
  } else if (tags.some(t => /mountain.*view|sierra|valle/.test(t))) {
    secondary.push('view')
  }
  
  // === SUBCATEGORÍAS ESPECÍFICAS ===
  if (categoria === 'piscina') {
    if (tags.some(t => /infinity|vanishing|borde.*infinito/.test(t))) {
      secondary.push('infinity_pool')
    } else if (tags.some(t => /indoor|cubierta|covered/.test(t))) {
      secondary.push('indoor_pool')
    } else if (tags.some(t => /kids|children|infantil/.test(t))) {
      secondary.push('kids_pool')
    }
  }
  
  if (categoria === 'habitacion') {
    if (tags.some(t => /presidential/.test(t))) {
      secondary.push('presidential_suite')
    } else if (tags.some(t => /suite|junior/.test(t))) {
      secondary.push('suite')
    }
    if (tags.some(t => /balcony|balcon|terrace/.test(t))) {
      secondary.push('terrace')
    }
  }
  
  if (categoria === 'restaurante') {
    if (tags.some(t => /buffet/.test(t))) {
      secondary.push('buffet')
    }
    if (tags.some(t => /terrace|terraza|outdoor.*dining/.test(t))) {
      secondary.push('terrace')
    }
  }
  
  if (categoria === 'bar') {
    if (tags.some(t => /rooftop|azotea/.test(t))) {
      secondary.push('rooftop_bar')
    } else if (tags.some(t => /pool|piscina/.test(t))) {
      secondary.push('pool_bar')
    } else if (tags.some(t => /beach|playa/.test(t))) {
      secondary.push('beach_bar')
    }
  }
  
  if (categoria === 'spa') {
    if (tags.some(t => /sauna/.test(t))) {
      secondary.push('sauna')
    } else if (tags.some(t => /steam|vapor/.test(t))) {
      secondary.push('steam_room')
    }
  }
  
  if (categoria === 'exterior') {
    if (tags.some(t => /garden|jardin|landscaped/.test(t))) {
      secondary.push('garden')
    }
    if (tags.some(t => /terrace|terraza/.test(t))) {
      secondary.push('terrace')
    }
    if (tags.some(t => /courtyard|patio/.test(t))) {
      secondary.push('courtyard')
    }
  }
  
  // === ELEMENTOS ARQUITECTÓNICOS ===
  if (tags.some(t => /chandelier|araña|luxury.*lighting/.test(t))) {
    secondary.push('architectural_detail')
  }
  
  // ✅ Eliminar duplicados y filtrar undefined
  return [...new Set(secondary)].filter(Boolean) as HotelCategory[]
}

// ✅ NUEVA: Build secondary para lógica local (mismo patrón)
function buildSecondaryCategoriesLocal(categoriaBackend: string, tags: string[]): HotelCategory[] {
  // Mapear categoría backend a lógica de frontend
  const categoriaMap: Record<string, string> = {
    'restaurante': 'restaurante',
    'bar': 'bar',
    'lobby': 'lobby',
    'habitacion': 'habitacion',
    'bano': 'bano',
    'spa': 'spa',
    'piscina': 'piscina',
    'playa': 'playa',
    'exterior': 'exterior'
  }
  const categoria = categoriaMap[categoriaBackend] || categoriaBackend
  return buildSecondaryCategories(categoria, tags)
}

export function detectSimpleCategory(tags: string[]): HotelCategory {
  return detectCategoryVision(tags).primary
}

export function getCategoryLabel(category: HotelCategory): string {
  const LABELS: Record<HotelCategory, string> = {
    pool: "Piscina", infinity_pool: "Piscina Infinita", indoor_pool: "Piscina Cubierta",
    beach: "Playa", kids_pool: "Piscina Infantil", room: "Habitación", suite: "Suite",
    presidential_suite: "Suite Presidencial", bathroom: "Baño", restaurant: "Restaurante",
    buffet: "Buffet", bar: "Bar", rooftop_bar: "Bar en Azotea", pool_bar: "Bar de Piscina",
    beach_bar: "Chiringuito", spa: "Spa", sauna: "Sauna", steam_room: "Baño de Vapor",
    gym: "Gimnasio", yoga_room: "Sala de Yoga", terrace: "Terraza", rooftop_terrace: "Terraza en Azotea",
    garden: "Jardín", courtyard: "Patio Interior", exterior: "Fachada", lobby: "Lobby",
    lounge: "Salón", library: "Biblioteca", conference_room: "Sala de Reuniones",
    ballroom: "Salón de Eventos", wedding_venue: "Espacio para Bodas", kids_area: "Zona Infantil",
    playground: "Parque Infantil", view: "Vistas", architectural_detail: "Detalle Arquitectónico",
    other: "Otro espacio"
  }
  return LABELS[category] || "Otro espacio"
}

export function analyzeGalleryCategories(detections: CategoryDetection[]): Record<HotelCategory, number> {
  const distribution: Record<HotelCategory, number> = {
    pool: 0, infinity_pool: 0, indoor_pool: 0, beach: 0, kids_pool: 0,
    room: 0, suite: 0, presidential_suite: 0, bathroom: 0,
    restaurant: 0, buffet: 0, bar: 0, rooftop_bar: 0, pool_bar: 0, beach_bar: 0,
    spa: 0, sauna: 0, steam_room: 0, gym: 0, yoga_room: 0,
    terrace: 0, rooftop_terrace: 0, garden: 0, courtyard: 0, exterior: 0,
    lobby: 0, lounge: 0, library: 0, conference_room: 0, ballroom: 0, wedding_venue: 0,
    kids_area: 0, playground: 0, view: 0, architectural_detail: 0, other: 0
  }
  detections.forEach(d => {
    distribution[d.primary] = (distribution[d.primary] || 0) + 1
    // ✅ CORREGIDO: Solo sumar secondary si son categorías válidas (no ubicación)
    d.secondary?.forEach(sec => { 
      if (distribution[sec] !== undefined && sec !== 'interior' && sec !== 'exterior' && sec !== 'mixto') {
        distribution[sec] = (distribution[sec] || 0) + 0.3 
      }
    })
  })
  return distribution
}

export function detectCategoryWithTrace(tags: string[], options?: CategoryDetectionOptions): CategoryDetection & { trace: { timestamp: number, source: string } } {
  const result = detectCategoryVision(tags, options)
  return { ...result, trace: { timestamp: Date.now(), source: result.source || 'unknown' } }
}

// ✅ NUEVA: Utilidad para obtener ubicación inferida (separada de categoría)
export function inferLocationFromTags(tags: string[]): 'interior' | 'exterior' | 'mixto' {
  const normalized = tags.map(t => t.toLowerCase().trim())
  const has = (keywords: string[]): boolean => keywords.some(k => normalized.includes(k))
  
  const exteriorKeywords = [
    'sky', 'cielo', 'cloud', 'sun', 'sunny', 'palm', 'palmera', 'garden', 'jardin',
    'facade', 'fachada', 'exterior', 'outdoor', 'beach', 'playa', 'sea', 'mar',
    'pool', 'piscina', 'terrace', 'terraza', 'balcony', 'balcon', 'landscape'
  ]
  
  const interiorKeywords = [
    'ceiling', 'techo', 'bed', 'cama', 'bathroom', 'baño', 'shower', 'bathtub',
    'curtain', 'cortina', 'carpet', 'chandelier', 'reception', 'lobby', 'restaurant',
    'dining', 'bar', 'spa', 'gym', 'indoor', 'interior'
  ]
  
  const extCount = exteriorKeywords.filter(k => has([k])).length
  const intCount = interiorKeywords.filter(k => has([k])).length
  
  if (extCount > intCount + 2) return 'exterior'
  if (intCount > extCount + 2) return 'interior'
  if (extCount > 0 && intCount > 0) return 'mixto'
  
  return 'interior' // Default conservador
}