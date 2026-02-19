/**
 * 🔬 Sistema avanzado de normalización de tags para hoteles - Versión Ensemble 3.1 (CORREGIDA)
 * 
 * ✅ FIXES CRÍTICOS APLICADOS:
 *   - BLOCKLIST corregida: SOLO bloquea ruido REAL, NO elementos hoteleros clave
 *   - HOTEL_ESSENTIAL_TAGS: Whitelist explícita para proteger tags relevantes
 *   - Mapeo contextual inteligente según categoría
 *   - Eliminación de falsos positivos (pool en habitaciones sin evidencia)
 *   - Soporte para scores de confianza del backend ensemble
 *   - Tipado TypeScript limpio sin errores de 'source'
 */

// ============================================================
// 📦 INTERFACES Y TIPOS
// ============================================================

export interface NormalizeTagsOptions {
  /** Mapa de confianza por tag (del backend ensemble) */
  tags_confidence?: Record<string, number>
  
  /** Categoría sugerida por el backend para contexto de mapeo */
  categoria_context?: string
  
  /** Ubicación sugerida por el backend (interior/exterior) */
  ubicacion_context?: 'interior' | 'exterior' | 'mixto'
  
  /** Umbral mínimo de confianza para incluir tags (default: 0.25) */
  min_confidence?: number
  
  /** Caption de Florence-2 para enriquecimiento contextual */
  caption_context?: string
  
  /** Si true, prioriza tags del backend sobre inferencia local */
  prefer_backend_scores?: boolean
}

// Tipo interno para procesamiento (no exportado, solo uso interno)
type TagWithScore = {
  label: string
  score: number
}

// ============================================================
// 🚫 BLOCKLIST CORREGIDA - SOLO RUIDO REAL
// ============================================================
// ✅ CRÍTICO: Esta lista SOLO debe contener elementos que NUNCA son relevantes
// para clasificación hotelera. Elementos como "bottle", "glass", "cutlery" 
// SON ESENCIALES para detectar restaurantes/bares y NO deben bloquearse.

const BLOCKLIST = new Set([
  // === VEHÍCULOS (nunca relevantes en fotos hoteleras profesionales) ===
  "car", "cars", "truck", "trucks", "van", "vans", "bus", "buses", 
  "motorcycle", "bicycle", "boat", "boats", "yacht", "ship", 
  "airplane", "helicopter", "train", "taxi", "scooter", "moped",
  
  // === INFRAESTRUCTURA URBANA NO HOTELERA ===
  "street", "streets", "road", "roads", "highway", "parking lot", "garage", 
  "traffic light", "sign", "billboard", "construction", "scaffolding", "crane",
  "power line", "telephone pole", "fire hydrant", "mailbox",
  
  // === PERSONAS (ruido común en CLIP, nunca queremos tags de personas) ===
  "person", "people", "man", "woman", "child", "children", "couple", "group", "tourist", 
  "guest", "staff", "waiter", "chef", "lifeguard", "silhouette", "shadow",
  "face", "hand", "arm", "leg", "head", "body",
  
  // === ANIMALES (no relevantes para amenities hoteleros) ===
  "dog", "cat", "bird", "seagull", "pigeon", "insect", "butterfly",
  "fish", "horse", "cow", "sheep", "rabbit",
  
  // === RUIDO TÉCNICO CLIP / META-TAGS ===
  "image", "photo", "picture", "scene", "area", "space", "place", "location",
  "background", "foreground", "blur", "bokeh", "focus", "lens", "filter",
  "hd", "4k", "high resolution", "professional", "stock photo",
  
  // === EDIFICIOS NO HOTELEROS ===
  "church", "cathedral", "mosque", "temple", "monument", "statue", 
  "apartment", "house", "home", "residence", "office", "store", "shop", "mall", 
  "supermarket", "hospital", "school", "university", "factory", "warehouse",
  
  // === OBJETOS DOMÉSTICOS IRRELEVANTES PARA CLASIFICACIÓN ===
  // ✅ NOTA: "bottle", "glass", "plate", "cutlery" se mueven a HOTEL_ESSENTIAL_TAGS
  "receipt", "newspaper", "magazine", "book", "pen", "pencil",
  "clock", "calendar", "remote control", "charger", "cable",
  
  // === PALABRAS GENÉRICAS SIN VALOR SEMÁNTICO ===
  "thing", "object", "item", "stuff", "something", "anything",
  "view", "sight", "scenery", "landscape" // Solo si vienen solos sin contexto
])

// ✅ WHITELIST: Elementos hoteleros que NUNCA deben bloquearse
// Estos son críticos para detectar amenities y experiencias hoteleras
const HOTEL_ESSENTIAL_TAGS = new Set([
  // === GASTRONOMÍA (esenciales para restaurante/bar) ===
  "wine glass", "wineglass", "bottle", "plate", "cutlery", "fork", "knife", "spoon",
  "cup", "glass", "bowl", "dish", "utensil", "napkin", "menu", "tray",
  "coffee cup", "teacup", "champagne", "cocktail", "drink", "beverage",
  
  // === EXTERIOR/PISCINA (esenciales para piscina/playa/jardín) ===
  "umbrella", "sunbed", "lounger", "deck chair", "palm tree", "potted plant", 
  "garden", "tree", "sky", "cloud", "grass", "flower", "foliage",
  "water", "pool", "fountain", "pathway", "stone", "wood",
  
  // === HABITACIONES (esenciales para room/suite) ===
  "bed", "pillow", "blanket", "sheet", "towel", "robe", "slipper",
  "tv", "lamp", "mirror", "curtain", "blind", "carpet", "rug",
  "luggage", "suitcase", "bag", "hanger", "safe", "minibar",
  
  // === BAÑOS (esenciales para bathroom/spa) ===
  "bathtub", "shower", "sink", "toilet", "bidet", "soap", "shampoo",
  "toothbrush", "razor", "hairdryer", "scale", "bathrobe",
  
  // === ARQUITECTURA/DECORACIÓN ===
  "building", "window", "door", "balcony", "terrace", "facade",
  "chandelier", "painting", "sculpture", "vase", "candle", "art",
  
  // === VISTAS/ENTORNO ===
  "sea", "ocean", "beach", "mountain", "valley", "forest", "lake",
  "sunset", "sunrise", "horizon", "skyline", "panorama"
])

// ============================================================
// 🎯 FUNCIÓN PRINCIPAL ACTUALIZADA
// ============================================================

export function normalizeTags(rawTags: any[], options?: NormalizeTagsOptions): string[] {
  if (!Array.isArray(rawTags) || rawTags.length === 0) return []

  // ============================================================
  // 1️⃣ EXTRACCIÓN Y LIMPIEZA INICIAL (con soporte de scores)
  // ============================================================
  
  let tags: TagWithScore[] = []
  const backendScores = options?.tags_confidence || {}
  
  for (const raw of rawTags) {
    const label = extractTagValue(raw)?.toLowerCase().trim()
    if (!label || label.length < 2) continue
    
    // Obtener score: prioridad backend > objeto > default
    let score: number
    if (backendScores[label] !== undefined) {
      score = backendScores[label]
    } else if (typeof raw === 'object' && raw.score !== undefined && typeof raw.score === 'number') {
      score = raw.score
    } else {
      score = 0.5 // Score por defecto
    }
    
    tags.push({ label, score })
  }

  if (tags.length === 0) return []

  // ============================================================
  // 2️⃣ FILTRADO POR CONFIDENCE (si backend proporciona scores)
  // ============================================================
  
  const minConfidence = options?.min_confidence ?? 0.25
  const preferBackend = options?.prefer_backend_scores ?? true
  
  if (Object.keys(backendScores).length > 0 && preferBackend) {
    tags = tags.filter(t => t.score >= minConfidence)
  }

  // ============================================================
  // 3️⃣ BLOCKLIST INTELIGENTE CON WHITELIST HOTELERA
  // ============================================================
  tags = tags.filter(tag => {
    const label = tag.label
    
    // ✅ PRIORIDAD 1: Si está en whitelist hotelera, NUNCA bloquear
    if (HOTEL_ESSENTIAL_TAGS.has(label)) {
      return true
    }
    
    // ✅ PRIORIDAD 2: Si está en blocklist, bloquear
    if (BLOCKLIST.has(label)) {
      return false
    }
    
    // ✅ PRIORIDAD 3: Filtro adicional para palabras genéricas solas
    // Solo bloquear "view", "landscape", etc. si vienen SIN contexto hotelero
    const genericWithoutContext = ['view', 'sight', 'scenery', 'landscape']
    if (genericWithoutContext.includes(label)) {
      // Permitir si hay otros tags que dan contexto
      const hasContext = tags.some(t => 
        t.label !== label && 
        (HOTEL_ESSENTIAL_TAGS.has(t.label) || t.label.length > 6)
      )
      return hasContext
    }
    
    // ✅ Por defecto: permitir
    return true
  })

  // ============================================================
  // 4️⃣ DETECCIÓN DE CONTEXTO PRIMARIO
  // ============================================================
  
  const tagLabels = tags.map(t => t.label)
  
  const hasPool = tagLabels.some(t => /pool|swimming|jacuzzi|lagoon|water.*surface/.test(t))
  const hasBeach = tagLabels.some(t => /beach|shoreline|coast|sand|seaside/.test(t))
  const hasRoom = tagLabels.some(t => 
    /room|suite|bedroom|king\s+bed|queen\s+bed|twin\s+beds|double\s+bed|bed\s+side|nightstand/.test(t)
  )
  const hasRestaurant = tagLabels.some(t => 
    /restaurant|buffet|fine\s+dining|gourmet|dining.*hall/i.test(t) && !hasRoom
  )
  const hasSpa = tagLabels.some(t => /spa|sauna|steam|massage|hammam|wellness/.test(t))
  const hasGarden = tagLabels.some(t => /garden|landscaped|botanical|zen|courtyard|patio|lawn/.test(t))
  
  const hasBreakfastEvidence = tagLabels.some(t => 
    /breakfast|morning|food|plate|cup|cereal|croissant|small\s+table|dining\s+table|breakfast\s+table|coffee|tea/.test(t)
  )
  const hasPoolEvidence = tagLabels.some(t => 
    /water|swim|sunbed|umbrella|lounge.*chair|deck|poolside|ripples|splash/.test(t)
  )
  
  // Contexto desde backend (si está disponible)
  const backendCategoria = options?.categoria_context
  const backendUbicacion = options?.ubicacion_context

  // ============================================================
  // 5️⃣ MAPEO DE SINÓNIMOS CONTEXTO-AWARE
  // ============================================================
  const REPLACE_MAP: Record<string, string> = {}

  // PISCINAS
  REPLACE_MAP["swimming pool"] = "pool"
  REPLACE_MAP["outdoor pool"] = "pool"
  REPLACE_MAP["indoor pool"] = "indoor_pool"
  REPLACE_MAP["covered pool"] = "indoor_pool"
  REPLACE_MAP["heated pool"] = "heated_pool"
  REPLACE_MAP["thermal pool"] = "heated_pool"
  REPLACE_MAP["infinity pool"] = "infinity_pool"
  REPLACE_MAP["vanishing edge pool"] = "infinity_pool"
  REPLACE_MAP["lagoon pool"] = "lagoon_pool"
  REPLACE_MAP["natural pool"] = "lagoon_pool"
  REPLACE_MAP["resort pool"] = "pool"
  REPLACE_MAP["hotel pool"] = "pool"
  REPLACE_MAP["pool area"] = "pool"
  REPLACE_MAP["pool deck"] = "pool_deck"
  REPLACE_MAP["poolside"] = "pool"
  REPLACE_MAP["swim up bar"] = "pool_bar"
  REPLACE_MAP["jacuzzi"] = "jacuzzi"
  REPLACE_MAP["hot tub"] = "jacuzzi"
  REPLACE_MAP["whirlpool"] = "jacuzzi"
  REPLACE_MAP["kids pool"] = "kids_pool"
  REPLACE_MAP["children pool"] = "kids_pool"
  REPLACE_MAP["splash pad"] = "kids_pool"
  REPLACE_MAP["water play"] = "kids_pool"

  // CAMAS (contexto-aware)
  const effectiveHasRoom = hasRoom || backendCategoria === 'habitacion'
  if (effectiveHasRoom) {
    REPLACE_MAP["bed"] = "bed"
    REPLACE_MAP["twin beds"] = "twin_beds"
    REPLACE_MAP["king bed"] = "king_bed"
    REPLACE_MAP["queen bed"] = "queen_bed"
    REPLACE_MAP["double bed"] = "double_bed"
    REPLACE_MAP["single bed"] = "single_bed"
  } else {
    REPLACE_MAP["bed"] = ""
    REPLACE_MAP["twin beds"] = ""
    REPLACE_MAP["king bed"] = ""
    REPLACE_MAP["queen bed"] = ""
  }

  // SILLAS (contexto-aware)
  const effectiveHasPool = hasPool || backendCategoria === 'piscina'
  const effectiveHasBeach = hasBeach || backendCategoria === 'playa'
  const effectiveHasRestaurant = hasRestaurant || backendCategoria === 'restaurante'
  
  if (effectiveHasPool || effectiveHasBeach) {
    REPLACE_MAP["sun lounger"] = "sunbed"
    REPLACE_MAP["sun loungers"] = "sunbed"
    REPLACE_MAP["lounge chair"] = "sunbed"
    REPLACE_MAP["deck chair"] = "sunbed"
    REPLACE_MAP["chair"] = "sunbed"
    REPLACE_MAP["chairs"] = "sunbed"
  } else if (effectiveHasRestaurant) {
    REPLACE_MAP["chair"] = "chair"
    REPLACE_MAP["chairs"] = "chair"
    REPLACE_MAP["lounge chair"] = "chair"
    REPLACE_MAP["deck chair"] = "chair"
  } else if (effectiveHasRoom) {
    REPLACE_MAP["chair"] = "chair"
    REPLACE_MAP["chairs"] = "chair"
    REPLACE_MAP["lounge chair"] = "chair"
    REPLACE_MAP["deck chair"] = "chair"
  } else {
    REPLACE_MAP["chair"] = ""
    REPLACE_MAP["chairs"] = ""
  }

  // GASTRONOMÍA (contexto-aware)
  if (effectiveHasRoom && hasBreakfastEvidence) {
    REPLACE_MAP["dining area"] = "dining_area"
    REPLACE_MAP["dining room"] = "dining_area"
    REPLACE_MAP["dining space"] = "dining_area"
    REPLACE_MAP["breakfast area"] = "breakfast_area"
    REPLACE_MAP["breakfast room"] = "breakfast_area"
  } else if (effectiveHasRoom && !hasBreakfastEvidence && backendCategoria !== 'restaurante') {
    REPLACE_MAP["dining room"] = "room"
    REPLACE_MAP["dining area"] = "room"
    REPLACE_MAP["dining space"] = "room"
    REPLACE_MAP["breakfast area"] = "room"
    REPLACE_MAP["breakfast room"] = "room"
  } else {
    REPLACE_MAP["dining area"] = "restaurant"
    REPLACE_MAP["dining room"] = "restaurant"
    REPLACE_MAP["dining space"] = "restaurant"
    REPLACE_MAP["fine dining"] = "restaurant"
    REPLACE_MAP["gourmet restaurant"] = "restaurant"
    REPLACE_MAP["main restaurant"] = "restaurant"
    REPLACE_MAP["breakfast area"] = "restaurant"
    REPLACE_MAP["breakfast room"] = "restaurant"
    REPLACE_MAP["buffet area"] = "buffet"
    REPLACE_MAP["buffet station"] = "buffet"
    REPLACE_MAP["international buffet"] = "buffet"
  }
  
  // Bares
  REPLACE_MAP["lobby bar"] = "bar"
  REPLACE_MAP["lounge bar"] = "bar"
  REPLACE_MAP["cocktail bar"] = "bar"
  REPLACE_MAP["wine bar"] = "wine_bar"
  REPLACE_MAP["wine cellar"] = "wine_cellar"
  REPLACE_MAP["rooftop bar"] = "rooftop_bar"
  REPLACE_MAP["sky bar"] = "rooftop_bar"
  REPLACE_MAP["sunset bar"] = "rooftop_bar"
  REPLACE_MAP["pool bar"] = "pool_bar"
  REPLACE_MAP["swim up bar"] = "pool_bar"
  REPLACE_MAP["beach bar"] = "beach_bar"
  REPLACE_MAP["cafe"] = "cafe"
  REPLACE_MAP["coffee shop"] = "cafe"
  REPLACE_MAP["pastry shop"] = "cafe"

  // HABITACIONES
  REPLACE_MAP["hotel room"] = "room"
  REPLACE_MAP["guest room"] = "room"
  REPLACE_MAP["bedroom"] = "room"
  REPLACE_MAP["double room"] = "room"
  REPLACE_MAP["twin room"] = "twin_beds"
  REPLACE_MAP["single room"] = "room"
  REPLACE_MAP["standard room"] = "room"
  REPLACE_MAP["superior room"] = "superior_room"
  REPLACE_MAP["deluxe room"] = "superior_room"
  REPLACE_MAP["premium room"] = "superior_room"
  REPLACE_MAP["suite"] = "suite"
  REPLACE_MAP["junior suite"] = "junior_suite"
  REPLACE_MAP["executive suite"] = "suite"
  REPLACE_MAP["presidential suite"] = "presidential_suite"
  REPLACE_MAP["honeymoon suite"] = "honeymoon_suite"
  REPLACE_MAP["family suite"] = "family_suite"
  REPLACE_MAP["king size bed"] = "king_bed"
  REPLACE_MAP["king bed"] = "king_bed"
  REPLACE_MAP["queen size bed"] = "queen_bed"
  REPLACE_MAP["queen bed"] = "queen_bed"
  REPLACE_MAP["twin beds"] = "twin_beds"
  REPLACE_MAP["double bed"] = "double_bed"
  REPLACE_MAP["canopy bed"] = "canopy_bed"
  REPLACE_MAP["four poster bed"] = "canopy_bed"
  REPLACE_MAP["balcony"] = "balcony"
  REPLACE_MAP["private balcony"] = "balcony"
  REPLACE_MAP["terrace"] = "terrace"
  REPLACE_MAP["private terrace"] = "private_terrace"
  REPLACE_MAP["rooftop terrace"] = "rooftop_terrace"
  REPLACE_MAP["veranda"] = "terrace"

  // BAÑOS
  REPLACE_MAP["bathroom"] = "bathroom"
  REPLACE_MAP["ensuite bathroom"] = "bathroom"
  REPLACE_MAP["private bathroom"] = "bathroom"
  REPLACE_MAP["shower"] = "shower"
  REPLACE_MAP["walk in shower"] = "rain_shower"
  REPLACE_MAP["bathtub"] = "bathtub"
  REPLACE_MAP["freestanding tub"] = "freestanding_tub"
  REPLACE_MAP["clawfoot tub"] = "freestanding_tub"
  REPLACE_MAP["double vanity"] = "double_vanity"
  REPLACE_MAP["his and hers sinks"] = "double_vanity"
  REPLACE_MAP["bidet"] = "bidet"
  REPLACE_MAP["heated floors"] = "heated_floors"
  REPLACE_MAP["underfloor heating"] = "heated_floors"
  REPLACE_MAP["spa bathroom"] = "luxury_bathroom"
  REPLACE_MAP["marble bathroom"] = "luxury_bathroom"
  
  // EXTERIOR
  REPLACE_MAP["facade"] = "facade"
  REPLACE_MAP["front facade"] = "facade"
  REPLACE_MAP["building front"] = "facade"
  REPLACE_MAP["entrance"] = "entrance"
  REPLACE_MAP["main entrance"] = "entrance"
  REPLACE_MAP["porte cochere"] = "entrance"
  REPLACE_MAP["valet"] = "entrance"
  REPLACE_MAP["garden"] = "garden"
  REPLACE_MAP["landscaped garden"] = "garden"
  REPLACE_MAP["botanical garden"] = "botanical_garden"
  REPLACE_MAP["zen garden"] = "zen_garden"
  REPLACE_MAP["courtyard"] = "courtyard"
  REPLACE_MAP["patio"] = "courtyard"
  REPLACE_MAP["lawn"] = "garden"
  REPLACE_MAP["flower bed"] = "garden"
  REPLACE_MAP["greenery"] = "garden"
  REPLACE_MAP["palm tree"] = "palm_tree"
  REPLACE_MAP["palm trees"] = "palm_tree"
  REPLACE_MAP["beach"] = "beach"
  REPLACE_MAP["beach access"] = "beach_access"
  REPLACE_MAP["private beach"] = "private_beach"
  REPLACE_MAP["shoreline"] = "beach"
  REPLACE_MAP["coast"] = "beach"
  REPLACE_MAP["mountain"] = "mountain"
  REPLACE_MAP["hillside"] = "mountain"
  
  // VISTAS
  REPLACE_MAP["view"] = "view"
  REPLACE_MAP["sea view"] = "sea_view"
  REPLACE_MAP["ocean view"] = "sea_view"
  REPLACE_MAP["beach view"] = "sea_view"
  REPLACE_MAP["city view"] = "city_view"
  REPLACE_MAP["urban view"] = "city_view"
  REPLACE_MAP["skyline"] = "city_view"
  REPLACE_MAP["cityscape"] = "city_view"
  REPLACE_MAP["mountain view"] = "mountain_view"
  REPLACE_MAP["valley view"] = "valley_view"
  REPLACE_MAP["garden view"] = "garden_view"
  REPLACE_MAP["pool view"] = "pool_view"
  REPLACE_MAP["panoramic view"] = "panoramic_view"
  REPLACE_MAP["sunset view"] = "sunset_view"
  REPLACE_MAP["horizon"] = "panoramic_view"
  
  // ZONAS COMUNES
  REPLACE_MAP["lobby"] = "lobby"
  REPLACE_MAP["reception area"] = "lobby"
  REPLACE_MAP["entrance hall"] = "lobby"
  REPLACE_MAP["grand lobby"] = "grand_lobby"
  REPLACE_MAP["atrium"] = "grand_lobby"
  REPLACE_MAP["lounge"] = "lounge"
  REPLACE_MAP["seating area"] = "lounge"
  REPLACE_MAP["common area"] = "lounge"
  REPLACE_MAP["living room"] = "lounge"
  REPLACE_MAP["library"] = "library"
  REPLACE_MAP["reading room"] = "library"
  REPLACE_MAP["fireplace"] = "fireplace"
  REPLACE_MAP["chimney"] = "fireplace"
  REPLACE_MAP["game room"] = "game_room"
  REPLACE_MAP["billiards"] = "game_room"
  
  // EVENTOS
  REPLACE_MAP["conference room"] = "conference_room"
  REPLACE_MAP["meeting room"] = "conference_room"
  REPLACE_MAP["boardroom"] = "conference_room"
  REPLACE_MAP["ballroom"] = "ballroom"
  REPLACE_MAP["banquet hall"] = "ballroom"
  REPLACE_MAP["event space"] = "ballroom"
  REPLACE_MAP["function room"] = "ballroom"
  REPLACE_MAP["wedding"] = "wedding_venue"
  REPLACE_MAP["ceremony space"] = "wedding_venue"
  REPLACE_MAP["chapel"] = "chapel"
  
  // ESTILO
  REPLACE_MAP["luxury"] = "luxury"
  REPLACE_MAP["luxurious"] = "luxury"
  REPLACE_MAP["premium"] = "luxury"
  REPLACE_MAP["high end"] = "luxury"
  REPLACE_MAP["exclusive"] = "luxury"
  REPLACE_MAP["boutique"] = "boutique"
  REPLACE_MAP["modern"] = "modern"
  REPLACE_MAP["contemporary"] = "modern"
  REPLACE_MAP["minimalist"] = "minimalist"
  REPLACE_MAP["elegant"] = "elegant"
  REPLACE_MAP["sophisticated"] = "elegant"
  REPLACE_MAP["classic"] = "classic"
  REPLACE_MAP["traditional"] = "classic"
  REPLACE_MAP["rustic"] = "rustic"
  REPLACE_MAP["mediterranean"] = "mediterranean"

  // Aplicar mapeos (filtrar strings vacíos)
  tags = tags
    .map(t => ({ ...t, label: REPLACE_MAP[t.label] || t.label }))
    .filter(t => t.label && t.label.length >= 2)

  // ============================================================
  // 6️⃣ MAPEO YOLO → ESCENAS SEMÁNTICAS (simplificado)
  // ============================================================
  
  const expandedTags: TagWithScore[] = []
  
  for (const tag of tags) {
    const expansions = getYOLOExpansions(tag.label, {
      hasPool: effectiveHasPool,
      hasBeach: effectiveHasBeach,
      hasRoom: effectiveHasRoom,
      hasRestaurant: effectiveHasRestaurant,
      hasBreakfastEvidence
    })
    
    if (expansions.length > 0) {
      expansions.forEach((exp, idx) => {
        expandedTags.push({
          label: exp,
          score: tag.score * (idx === 0 ? 1 : 0.8)
        })
      })
    } else {
      expandedTags.push(tag)
    }
  }
  tags = expandedTags.filter(t => t.label && t.label.length >= 2)

  // ============================================================
  // 7️⃣ CORRECCIONES CONTEXTUALES INTELIGENTES
  // ============================================================

  let currentLabels = tags.map(t => t.label)

  // Regla 1: Piscina infinita
  if (currentLabels.includes("pool") && currentLabels.some(l => ["vanishing", "edge", "horizon"].includes(l))) {
    tags = tags.filter(t => t.label !== "pool")
    tags.push({ label: "infinity_pool", score: 0.9 })
  }

  // Regla 2: Piscina + sillas → sunbeds
  if ((effectiveHasPool || effectiveHasBeach) && currentLabels.some(l => ["chair", "chairs", "lounge chair"].includes(l))) {
    tags = tags.filter(t => !["chair", "chairs", "lounge chair"].includes(t.label))
    tags.push({ label: "sunbed", score: 0.85 })
  }

  // Regla 3: Eliminar "indoor" si es piscina exterior
  if (currentLabels.includes("pool") && !currentLabels.includes("indoor_pool") && currentLabels.includes("indoor")) {
    tags = tags.filter(t => t.label !== "indoor")
  }

  // Regla 4: Habitación con balcón → vista
  if (currentLabels.includes("room") && currentLabels.some(l => ["balcony", "terrace"].includes(l)) && currentLabels.includes("view")) {
    if (!currentLabels.includes("room_with_view")) {
      tags.push({ label: "room_with_view", score: 0.7 })
    }
  }

  // Regla 5: Spa complejo
  if (currentLabels.includes("spa") && currentLabels.some(l => ["sauna", "steam_room"].includes(l))) {
    if (!currentLabels.includes("wellness_complex")) {
      tags.push({ label: "wellness_complex", score: 0.8 })
    }
  }

  // Regla 6: Restaurante exterior
  if (currentLabels.includes("restaurant") && currentLabels.some(l => ["terrace", "rooftop"].includes(l))) {
    tags = tags.filter(t => t.label !== "restaurant")
    tags.push({ label: "outdoor_dining", score: 0.85 })
  }

  // Regla 7: Acceso a playa
  if (currentLabels.includes("exterior") && currentLabels.some(l => ["sea", "ocean"].includes(l))) {
    if (!currentLabels.includes("beach_access")) {
      tags.push({ label: "beach_access", score: 0.75 })
    }
  }

  // Regla 8: Baño de lujo
  if (currentLabels.includes("bathroom") && currentLabels.includes("freestanding_tub")) {
    if (!currentLabels.includes("luxury_bathroom")) {
      tags.push({ label: "luxury_bathroom", score: 0.9 })
    }
  }

  // Regla 9: Suite premium
  if (currentLabels.includes("suite") && currentLabels.includes("king_bed") && currentLabels.includes("balcony")) {
    if (!currentLabels.includes("premium_suite")) {
      tags.push({ label: "premium_suite", score: 0.95 })
    }
  }

  // Regla 10: Atmósfera premium
  const hasTimeContext = currentLabels.some(l => ["sunset", "sunrise", "dawn", "dusk", "golden hour"].includes(l))
  const hasPremiumArea = currentLabels.some(l => ["pool", "infinity_pool", "sea_view", "panoramic_view"].includes(l))
  if (hasTimeContext && hasPremiumArea && !currentLabels.includes("premium_atmosphere")) {
    tags.push({ label: "premium_atmosphere", score: 0.8 })
  }

  // Regla 11: Eliminar room si hay piscina sin cama
  if (currentLabels.includes("pool") && !currentLabels.some(l => ["bed", "king_bed", "queen_bed", "twin_beds"].includes(l))) {
    tags = tags.filter(t => t.label !== "room")
  }

  // Regla 12: Jardín tropical
  if (currentLabels.includes("garden") && currentLabels.includes("palm_tree") && !currentLabels.includes("tropical_garden")) {
    tags.push({ label: "tropical_garden", score: 0.85 })
  }

  // Regla 13: Lobby acogedor
  if (currentLabels.includes("lobby") && currentLabels.includes("fireplace") && !currentLabels.includes("cozy_lobby")) {
    tags.push({ label: "cozy_lobby", score: 0.8 })
  }

  // Regla 14: Desayuno buffet
  if (currentLabels.includes("buffet") && currentLabels.some(l => ["breakfast", "morning"].includes(l)) && !currentLabels.includes("breakfast_buffet")) {
    tags.push({ label: "breakfast_buffet", score: 0.9 })
  }

  // Regla 15: Eliminar contradicciones
  if (currentLabels.includes("indoor_pool") && currentLabels.includes("outdoor")) {
    tags = tags.filter(t => t.label !== "outdoor")
  }

  // Regla 16: Eliminar pool falso en habitaciones
  const backendSaysPool = backendCategoria === 'piscina'
  if (currentLabels.includes("room") && currentLabels.includes("pool") && !hasPoolEvidence && !backendSaysPool) {
    tags = tags.filter(t => t.label !== "pool")
  }

  // Regla 17: Eliminar dining_area falso en habitaciones
  const backendSaysRestaurant = backendCategoria === 'restaurante'
  if (currentLabels.includes("room") && currentLabels.includes("dining_area") && !hasBreakfastEvidence && !backendSaysRestaurant) {
    tags = tags.filter(t => t.label !== "dining_area")
  }

  // Regla 18: Reforzar twin_beds
  if (currentLabels.includes("twin_beds") && currentLabels.includes("room") && !hasBreakfastEvidence && !backendSaysRestaurant) {
    tags = tags.filter(t => t.label !== "dining_area")
  }

  // Regla 19: Reforzar tags según categoría backend
  if (backendCategoria && backendCategoria !== 'otros') {
    const categoryBoostTags: Record<string, string[]> = {
      piscina: ["pool", "water", "sunbed", "umbrella", "deck"],
      habitacion: ["room", "bed", "pillow", "nightstand", "balcony"],
      restaurante: ["restaurant", "table", "chair", "plate", "buffet"],
      spa: ["spa", "massage", "towel", "relax", "wellness"],
      playa: ["beach", "sand", "sea", "ocean", "shoreline"]
    }
    
    const boostList = categoryBoostTags[backendCategoria] || []
    tags = tags.map(t => {
      if (boostList.includes(t.label) && t.score < 0.7) {
        return { ...t, score: Math.min(t.score + 0.15, 0.95) }
      }
      return t
    })
  }

  // ============================================================
  // 8️⃣ SINGULARIZACIÓN ROBUSTA
  // ============================================================
  const IRREGULAR_PLURALS: Record<string, string> = {
    "people": "person", "children": "child", "men": "man", "women": "woman",
    "feet": "foot", "teeth": "tooth", "geese": "goose", "mice": "mouse", "lice": "louse",
  }

  tags = tags.map(tag => {
    if (IRREGULAR_PLURALS[tag.label]) {
      return { ...tag, label: IRREGULAR_PLURALS[tag.label] }
    }
    if (tag.label.endsWith("s") && tag.label.length > 3 && !tag.label.endsWith("ss")) {
      return { ...tag, label: tag.label.replace(/s$/, "") }
    }
    return tag
  })

  // ============================================================
  // 9️⃣ DEDUPLICACIÓN Y ORDENAMIENTO FINAL
  // ============================================================
  const PRIORITY_ORDER = [
    "infinity_pool", "presidential_suite", "private_beach", "panoramic_view", "sea_view",
    "luxury_bathroom", "freestanding_tub", "rain_shower", "premium_suite", "honeymoon_suite",
    "rooftop_bar", "rooftop_terrace", "botanical_garden", "zen_garden", "wellness_complex",
    "pool", "indoor_pool", "heated_pool", "lagoon_pool", "jacuzzi", "kids_pool",
    "suite", "junior_suite", "superior_room", "king_bed", "queen_bed", "twin_beds", "double_bed", "balcony", "private_terrace",
    "spa", "sauna", "steam_room", "relaxation_area", "gym", "yoga_room",
    "restaurant", "buffet", "bar", "wine_bar", "pool_bar", "cafe", "dining_area", "breakfast_area",
    "garden", "courtyard", "beach_access", "mountain_view", "city_view",
    "lobby", "grand_lobby", "lounge", "library", "fireplace",
    "conference_room", "ballroom", "wedding_venue",
    "room", "bathroom", "shower", "bathtub", "terrace", "exterior", "view", "modern", "luxury"
  ]

  // Eliminar redundancias
  const hasPremiumPool = tags.some(t => ["infinity_pool", "lagoon_pool", "heated_pool"].includes(t.label))
  if (hasPremiumPool) tags = tags.filter(t => t.label !== "pool")

  const hasSuite = tags.some(t => ["suite", "junior_suite", "presidential_suite"].includes(t.label))
  if (hasSuite) tags = tags.filter(t => t.label !== "room")

  const hasSpaComplex = tags.some(t => ["spa", "sauna", "steam_room"].includes(t.label))
  if (hasSpaComplex) tags = tags.filter(t => t.label !== "wellness")

  // Deduplicar manteniendo score más alto
  const deduped = new Map<string, TagWithScore>()
  for (const tag of tags) {
    const existing = deduped.get(tag.label)
    if (!existing || tag.score > existing.score) {
      deduped.set(tag.label, tag)
    }
  }

  // Filtrar, limpiar y ordenar
  const finalTags = Array.from(deduped.values())
    .map(t => t.label.replace(/[^a-z0-9_]/g, "_"))
    .filter(tag => tag.length >= 2 && !/^\d+$/.test(tag) && !tag.startsWith("http"))
    .filter((tag, idx, arr) => arr.indexOf(tag) === idx)
    .sort((a, b) => {
      const aIdx = PRIORITY_ORDER.indexOf(a)
      const bIdx = PRIORITY_ORDER.indexOf(b)
      if (aIdx === -1 && bIdx === -1) return 0
      if (aIdx === -1) return 1
      if (bIdx === -1) return -1
      return aIdx - bIdx
    })

  return finalTags
}

// ============================================================
// 🔧 FUNCIONES AUXILIARES
// ============================================================

function extractTagValue(tag: any): string | null {
  if (!tag) return null
  if (typeof tag === "object") {
    if (tag.label) return String(tag.label)
    if (tag.text) return String(tag.text)
    if (tag.name) return String(tag.name)
    if (tag.className) return String(tag.className)
  }
  if (typeof tag === "string") return tag
  if (Array.isArray(tag)) return tag.map(extractTagValue).filter(Boolean).join(" ")
  if (typeof tag === "number" || typeof tag === "boolean") return String(tag)
  return null
}

/**
 * Obtiene expansiones YOLO según contexto (función helper interna)
 */
function getYOLOExpansions(tag: string, context: {
  hasPool: boolean
  hasBeach: boolean
  hasRoom: boolean
  hasRestaurant: boolean
  hasBreakfastEvidence: boolean
}): string[] {
  const { hasPool, hasBeach, hasRoom, hasRestaurant, hasBreakfastEvidence } = context
  
  const expansions: Record<string, string[]> = {
    "sunbed": (hasPool || hasBeach) ? ["pool", "sunbed"] : [],
    "lounge chair": (hasPool || hasBeach) ? ["pool", "sunbed"] : [],
    "deck chair": (hasPool || hasBeach) ? ["pool", "sunbed"] : [],
    "umbrella": (hasPool || hasBeach) ? ["pool", "umbrella"] : [],
    "parasol": (hasPool || hasBeach) ? ["pool", "umbrella"] : [],
    "balinese bed": (hasPool || hasBeach) ? ["pool", "balinese_bed"] : [],
    "cabana": (hasPool || hasBeach) ? ["pool", "cabana"] : [],
    "daybed": (hasPool || hasBeach) ? ["pool", "balinese_bed"] : [],
    "bed": hasRoom ? ["room", "bed"] : [],
    "king bed": hasRoom ? ["room", "king_bed"] : [],
    "queen bed": hasRoom ? ["room", "queen_bed"] : [],
    "twin beds": hasRoom ? ["room", "twin_beds"] : [],
    "sofa": ["lounge"],
    "armchair": ["lounge"],
    "desk": ["room", "workspace"],
    "dining table": hasRestaurant ? ["restaurant"] : (hasRoom && hasBreakfastEvidence ? ["dining_area"] : ["table"]),
    "palm tree": ["exterior", "garden"],
    "tree": ["garden"],
    "plant": ["garden"],
    "fountain": ["garden"],
    "fire pit": ["exterior", "fire_pit"],
    "bbq": ["exterior", "bbq_area"],
    "hammock": ["exterior", "hammock"],
    "bathtub": ["bathroom", "bathtub"],
    "shower": ["bathroom", "shower"],
    "towel": ["bathroom", "spa"],
    "bar counter": ["bar"],
    "wine glass": ["bar", "wine_bar"],
    "cocktail": ["bar"],
  }
  
  return expansions[tag] || []
}

export function areTagsHotelRelevant(tags: string[]): boolean {
  const HOTEL_KEYWORDS = [
    "pool", "room", "suite", "spa", "restaurant", "bar", "lobby", "garden", "beach", 
    "terrace", "balcony", "bathroom", "view", "luxury", "hotel", "resort", "twin_beds"
  ]
  return tags.some(tag => HOTEL_KEYWORDS.includes(tag))
}

export function extractHighConfidenceTags(rawTags: any[], minScore = 0.7): string[] {
  return rawTags
    .filter(t => typeof t === "object" && typeof t.score === "number" && t.score >= minScore)
    .map(t => t.label || t.text || "")
    .filter(Boolean)
}

/**
 * Versión ligera sin logging para producción
 */
export function normalizeTagsSilent(rawTags: any[], options?: NormalizeTagsOptions): string[] {
  const originalLog = console.log
  console.log = () => {}
  try {
    return normalizeTags(rawTags, options)
  } finally {
    console.log = originalLog
  }
}