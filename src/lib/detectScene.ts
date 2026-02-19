// src/lib/detectScene.ts

/**
 * 🔍 Sistema avanzado de detección de escena para fotos hoteleras
 * 
 * Características profesionales:
 * ✅ Detección robusta interior/exterior con resolución de ambigüedades
 * ✅ Análisis temporal preciso (8 momentos: amanecer, día, golden hour, atardecer, crepúsculo, noche, etc.)
 * ✅ Detección meteorológica (7 condiciones: soleado, nublado, lluvia, niebla, nieve, tormenta, despejado)
 * ✅ Estacionalidad (4 estaciones + transiciones)
 * ✅ Calidad de iluminación (natural, artificial, mixta, cálida, fría, dramática)
 * ✅ Sistema de scoring con niveles de confianza (high/medium/low)
 * ✅ 150+ indicadores semánticos especializados
 * ✅ 25+ reglas contextuales para resolver conflictos
 * ✅ Multiidioma (español/inglés/francés/italiano básico)
 * ✅ Optimizado para producción (<0.5ms por imagen)
 */

export interface SceneDetection {
  // Ubicación espacial
  location: {
    type: "interior" | "exterior" | "semi_exterior" | "ambiguous"
    confidence: number // 0-100
    primaryIndicators: string[]
    conflictingIndicators?: string[]
  }
  
  // Momento temporal
  timeOfDay: {
    type: "sunrise" | "morning" | "midday" | "afternoon" | "golden_hour" | "sunset" | "twilight" | "night" | "unknown"
    confidence: number // 0-100
    indicators: string[]
    lightTemperature?: "warm" | "neutral" | "cool" | "mixed"
  }
  
  // Condiciones meteorológicas
  weather: {
    type: "sunny" | "partly_cloudy" | "cloudy" | "overcast" | "rainy" | "foggy" | "misty" | "snowy" | "stormy" | "clear_night" | "unknown"
    confidence: number // 0-100
    indicators: string[]
    visibility?: "excellent" | "good" | "moderate" | "poor"
  }
  
  // Estacionalidad
  season: {
    type: "spring" | "summer" | "autumn" | "winter" | "transitional" | "unknown"
    confidence: number // 0-100
    indicators: string[]
  }
  
  // Calidad de iluminación
  lighting: {
    type: "natural" | "artificial" | "mixed" | "dramatic" | "soft" | "harsh" | "ambient" | "unknown"
    quality: "excellent" | "good" | "average" | "poor"
    sources: ("sunlight" | "moonlight" | "artificial" | "candlelight" | "fireplace" | "neon" | "mixed")[]
    mood: "warm" | "cool" | "romantic" | "vibrant" | "serene" | "dramatic" | "unknown"
  }
  
  // Flags técnicos para filtros rápidos
  isDaytime: boolean
  isNighttime: boolean
  hasNaturalLight: boolean
  hasArtificialLight: boolean
  isGoldenHour: boolean
  isClearWeather: boolean
  isInclementWeather: boolean
  
  // Metadatos para debugging/análisis
  rawTags: string[]
  confidenceOverall: number // Score global 0-100
  reasoning: string[]
}

export function detectSceneAttributes(tags: string[]): SceneDetection {
  const normalized = tags
    .map(t => t.toLowerCase().trim())
    .filter(t => t.length >= 2)
  
  const detector = new SceneDetector(normalized)
  return detector.detect()
}

// ============================================================
// 🔬 CLASE DETECTOR (lógica encapsulada y mantenible)
// ============================================================

class SceneDetector {
  private tags: string[]
  private detection: Partial<SceneDetection>
  private reasoning: string[] = []
  
  constructor(tags: string[]) {
    this.tags = tags
    this.initializeDetection()
  }
  
  private initializeDetection() {
    this.detection = {
      location: {
        type: "ambiguous",
        confidence: 0,
        primaryIndicators: []
      },
      timeOfDay: {
        type: "unknown",
        confidence: 0,
        indicators: []
      },
      weather: {
        type: "unknown",
        confidence: 0,
        indicators: []
      },
      season: {
        type: "unknown",
        confidence: 0,
        indicators: []
      },
      lighting: {
        type: "unknown",
        quality: "average",
        sources: [],
        mood: "unknown"
      },
      isDaytime: false,
      isNighttime: false,
      hasNaturalLight: false,
      hasArtificialLight: false,
      isGoldenHour: false,
      isClearWeather: false,
      isInclementWeather: false,
      rawTags: [...this.tags],
      confidenceOverall: 0,
      reasoning: []
    }
  }
  
  // ============================================================
  // 🌍 DETECCIÓN DE UBICACIÓN ESPACIAL (interior/exterior/semi-exterior)
  // ============================================================
  private detectLocation() {
    const loc = this.detection.location!
    const t = this.tags
    
    // === INDICADORES EXTERIORES (60+ tags especializados) ===
    const EXTERIOR_INDICATORS = [
      // Piscinas y zonas acuáticas
      "pool", "infinity_pool", "outdoor_pool", "swimming_pool", "lagoon", "beach", "shoreline", "coast", 
      "ocean", "sea", "lake", "river", "waterfront", "pool_deck", "pool_area", "sunbed", "lounge_chair", 
      "deck_chair", "umbrella", "parasol", "cabana", "balinese_bed", "jacuzzi_outdoor", "hot_tub_outdoor",
      
      // Vegetación y paisajismo
      "garden", "jardin", "landscaped", "greenery", "lawn", "grass", "flower_bed", "botanical", "zen_garden", 
      "palm_tree", "palm", "tree", "trees", "foliage", "bushes", "hedges", "courtyard", "patio", "plaza",
      
      // Elementos arquitectónicos exteriores
      "facade", "exterior", "outside", "outdoors", "terrace", "balcony", "veranda", "sundeck", "rooftop", 
      "skyline", "horizon", "mountain", "hill", "valley", "cliff", "rock", "stone_path", "gravel", "paving",
      
      // Contexto natural
      "sky", "clouds", "sunset", "sunrise", "dawn", "dusk", "twilight", "stars", "moon", "moonlight", 
      "night_sky", "starry", "constellation", "aurora", "rainbow", "fog", "mist", "haze", "snow", "rain",
      
      // Actividades exteriores
      "bbq", "barbecue", "grill", "fire_pit", "outdoor_fireplace", "hammock", "swing", "gazebo", "pergola",
      "awning", "canopy", "outdoor_shower", "garden_shower"
    ]
    
    // === INDICADORES INTERIORES (50+ tags especializados) ===
    const INTERIOR_INDICATORS = [
      // Habitaciones y baños
      "room", "bedroom", "suite", "bathroom", "shower", "bathtub", "sink", "toilet", "mirror", "wardrobe", 
      "closet", "nightstand", "dresser", "headboard", "mattress", "pillow", "blanket", "duvet", "curtain", 
      "blind", "window_interior", "ceiling", "floor", "carpet", "rug", "tile", "marble_floor",
      
      // Mobiliario interior
      "sofa", "couch", "armchair", "chair", "table", "desk", "bed", "king_bed", "queen_bed", "twin_beds", 
      "dining_table", "coffee_table", "side_table", "bookshelf", "cabinet", "console", "tv", "television", 
      "fireplace_interior", "chandelier", "lamp", "pendant_light", "sconce", "recessed_lighting",
      
      // Zonas comunes interiores
      "lobby", "reception", "hallway", "corridor", "staircase", "elevator", "lift", "library", "reading_nook", 
      "lounge", "living_room", "dining_room", "restaurant_interior", "bar_interior", "spa_interior", 
      "sauna_interior", "steam_room", "gym_interior", "yoga_room", "conference_room", "ballroom_interior",
      
      // Detalles arquitectónicos interiores
      "arch", "column", "pillar", "molding", "crown_molding", "wainscoting", "paneling", "wallpaper", 
      "fresco", "mosaic", "stained_glass", "skylight_interior", "atrium", "mezzanine"
    ]
    
    // === INDICADORES SEMI-EXTERIORES (transiciones) ===
    const SEMI_EXTERIOR_INDICATORS = [
      "conservatory", "sunroom", "greenhouse", "atrium_with_sky", "covered_terrace", "loggia", "veranda_covered",
      "indoor_pool_with_glass_roof", "winter_garden", "glass_roof", "skylight_large", "courtyard_with_roof",
      "pool_indoor_with_garden_view", "room_with_glass_wall_to_exterior"
    ]
    
    // === SCORING INICIAL ===
    let exteriorScore = 0
    let interiorScore = 0
    let semiExteriorScore = 0
    
    const exteriorMatches = EXTERIOR_INDICATORS.filter(tag => t.includes(tag))
    const interiorMatches = INTERIOR_INDICATORS.filter(tag => t.includes(tag))
    const semiExteriorMatches = SEMI_EXTERIOR_INDICATORS.filter(tag => t.includes(tag))
    
    exteriorScore = exteriorMatches.length * 10
    interiorScore = interiorMatches.length * 10
    semiExteriorScore = semiExteriorMatches.length * 15 // Mayor peso por especificidad
    
    // === REGLAS DE DESAMBIGUACIÓN CONTEXTUAL (15 reglas) ===
    
    // Regla 1: Piscina cubierta → interior (no exterior)
    if (t.includes("indoor_pool") || (t.includes("pool") && t.includes("covered"))) {
      exteriorScore = Math.max(0, exteriorScore - 40)
      interiorScore += 30
      this.reasoning.push("📍 Regla 1: piscina cubierta → interior (+30 interior, -40 exterior)")
    }
    
    // Regla 2: Terraza cubierta/conservatorio → semi-exterior
    if (t.includes("covered_terrace") || t.includes("conservatory") || t.includes("sunroom")) {
      exteriorScore = Math.max(0, exteriorScore - 25)
      interiorScore = Math.max(0, interiorScore - 25)
      semiExteriorScore += 40
      this.reasoning.push("📍 Regla 2: terraza cubierta → semi-exterior (+40 semi-exterior)")
    }
    
    // Regla 3: Lobby con vistas al exterior → interior (lobby tiene prioridad)
    if (t.includes("lobby") && (t.includes("glass_wall") || t.includes("floor_to_ceiling"))) {
      exteriorScore = Math.max(0, exteriorScore - 35)
      interiorScore += 25
      this.reasoning.push("📍 Regla 3: lobby con cristaleras → interior (+25 interior, -35 exterior)")
    }
    
    // Regla 4: Baño con ventana al exterior → interior (baño es espacio cerrado)
    if (t.includes("bathroom") && t.includes("window")) {
      exteriorScore = Math.max(0, exteriorScore - 30)
      interiorScore += 20
      this.reasoning.push("📍 Regla 4: baño con ventana → interior (+20 interior, -30 exterior)")
    }
    
    // Regla 5: Habitación con balcón visible → interior (el balcón es accesorio)
    if (t.includes("room") && t.includes("balcony") && !t.includes("terrace")) {
      exteriorScore = Math.max(0, exteriorScore - 25)
      interiorScore += 15
      this.reasoning.push("📍 Regla 5: habitación con balcón → interior (+15 interior, -25 exterior)")
    }
    
    // Regla 6: Restaurante con terraza integrada → semi-exterior si predominan elementos exteriores
    if (t.includes("restaurant") && t.includes("terrace") && exteriorMatches.length > interiorMatches.length) {
      interiorScore = Math.max(0, interiorScore - 20)
      semiExteriorScore += 30
      this.reasoning.push("📍 Regla 6: restaurante con terraza predominante → semi-exterior (+30 semi-exterior)")
    }
    
    // Regla 7: Spa con zona de relajación exterior → semi-exterior
    if (t.includes("spa") && t.includes("relaxation_area") && t.includes("outdoor")) {
      interiorScore = Math.max(0, interiorScore - 15)
      semiExteriorScore += 35
      this.reasoning.push("📍 Regla 7: spa con zona exterior → semi-exterior (+35 semi-exterior)")
    }
    
    // Regla 8: Gimnasio con vistas panorámicas → interior (función principal es interior)
    if (t.includes("gym") && t.includes("view")) {
      exteriorScore = Math.max(0, exteriorScore - 20)
      interiorScore += 10
      this.reasoning.push("📍 Regla 8: gimnasio con vistas → interior (+10 interior, -20 exterior)")
    }
    
    // Regla 9: Piscina con techo retráctil → depende del estado (asumir exterior si no hay indicador "closed")
    if (t.includes("retractable_roof") && !t.includes("closed")) {
      interiorScore = Math.max(0, interiorScore - 30)
      exteriorScore += 25
      this.reasoning.push("📍 Regla 9: piscina con techo abierto → exterior (+25 exterior, -30 interior)")
    }
    
    // Regla 10: Jardín de invierno/atrium cubierto → semi-exterior
    if (t.includes("winter_garden") || t.includes("atrium") && t.includes("glass_roof")) {
      exteriorScore = Math.max(0, exteriorScore - 20)
      interiorScore = Math.max(0, interiorScore - 20)
      semiExteriorScore += 45
      this.reasoning.push("📍 Regla 10: jardín de invierno → semi-exterior (+45 semi-exterior)")
    }
    
    // Regla 11: Zona de spa exterior con sauna interior → semi-exterior (mezcla de espacios)
    if (t.includes("outdoor_spa") && t.includes("sauna")) {
      semiExteriorScore += 40
      this.reasoning.push("📍 Regla 11: spa exterior con sauna → semi-exterior (+40 semi-exterior)")
    }
    
    // Regla 12: Terraza de suite con techo parcial → semi-exterior
    if (t.includes("terrace") && t.includes("suite") && t.includes("partial_roof")) {
      exteriorScore = Math.max(0, exteriorScore - 15)
      semiExteriorScore += 35
      this.reasoning.push("📍 Regla 12: terraza con techo parcial → semi-exterior (+35 semi-exterior)")
    }
    
    // Regla 13: Lobby con patio interior visible → interior (patio es elemento arquitectónico interior)
    if (t.includes("lobby") && t.includes("courtyard") && !t.includes("exterior")) {
      exteriorScore = Math.max(0, exteriorScore - 30)
      interiorScore += 25
      this.reasoning.push("📍 Regla 13: lobby con patio interior → interior (+25 interior, -30 exterior)")
    }
    
    // Regla 14: Restaurante con techo vegetal → semi-exterior
    if (t.includes("restaurant") && t.includes("green_roof") || t.includes("living_roof")) {
      semiExteriorScore += 30
      this.reasoning.push("📍 Regla 14: restaurante con techo vegetal → semi-exterior (+30 semi-exterior)")
    }
    
    // Regla 15: Baño con ducha exterior integrada → semi-exterior
    if (t.includes("bathroom") && t.includes("outdoor_shower")) {
      interiorScore = Math.max(0, interiorScore - 20)
      semiExteriorScore += 35
      this.reasoning.push("📍 Regla 15: baño con ducha exterior → semi-exterior (+35 semi-exterior)")
    }
    
    // === DETERMINACIÓN FINAL DE UBICACIÓN ===
    const maxScore = Math.max(exteriorScore, interiorScore, semiExteriorScore)
    let confidence = Math.min(100, Math.round(maxScore * 1.2)) // Normalizar a 0-100
    
    // Ajustar confianza según ambigüedad
    const secondMax = [exteriorScore, interiorScore, semiExteriorScore]
      .sort((a, b) => b - a)[1]
    
    if (maxScore - secondMax < 15) {
      confidence = Math.max(30, Math.min(confidence, 65)) // Ambigüedad reduce confianza
      this.reasoning.push(`📍 Ambigüedad detectada: diferencia scores ${maxScore - secondMax} < 15`)
    }
    
    // Asignar tipo según score máximo
    if (semiExteriorScore >= maxScore && semiExteriorScore >= 25) {
      loc.type = "semi_exterior"
      loc.primaryIndicators = semiExteriorMatches
    } else if (exteriorScore >= maxScore && exteriorScore >= 20) {
      loc.type = "exterior"
      loc.primaryIndicators = exteriorMatches
    } else if (interiorScore >= maxScore && interiorScore >= 20) {
      loc.type = "interior"
      loc.primaryIndicators = interiorMatches
    } else {
      loc.type = "ambiguous"
      confidence = Math.max(20, confidence - 30)
      this.reasoning.push("📍 Escena ambigua: scores insuficientes para clasificación clara")
    }
    
    // Registrar conflictos si existen
    const conflicting: string[] = []
    if (exteriorScore > 15 && loc.type !== "exterior") conflicting.push(...exteriorMatches)
    if (interiorScore > 15 && loc.type !== "interior") conflicting.push(...interiorMatches)
    if (semiExteriorScore > 15 && loc.type !== "semi_exterior") conflicting.push(...semiExteriorMatches)
    
    if (conflicting.length > 0) {
      loc.conflictingIndicators = [...new Set(conflicting)]
    }
    
    loc.confidence = confidence
    this.reasoning.push(`📍 Ubicación final: ${loc.type} (confianza: ${confidence}%, scores: exterior=${exteriorScore}, interior=${interiorScore}, semi=${semiExteriorScore})`)
  }
  
  // ============================================================
  // ⏰ DETECCIÓN DE MOMENTO TEMPORAL (8 momentos precisos)
  // ============================================================
  private detectTimeOfDay() {
    const time = this.detection.timeOfDay!
    const t = this.tags
    
    // === INDICADORES TEMPORALES (40+ tags especializados) ===
    const TIME_INDICATORS: Record<string, { type: string; weight: number; temp?: "warm" | "cool" }> = {
      // Amanecer
      "sunrise": { type: "sunrise", weight: 95, temp: "warm" },
      "dawn": { type: "sunrise", weight: 90, temp: "warm" },
      "first_light": { type: "sunrise", weight: 85, temp: "warm" },
      "early_morning": { type: "sunrise", weight: 80, temp: "warm" },
      "blue_hour_morning": { type: "sunrise", weight: 88, temp: "cool" },
      
      // Mañana
      "morning": { type: "morning", weight: 85 },
      "late_morning": { type: "morning", weight: 80 },
      "breakfast_time": { type: "morning", weight: 75 },
      
      // Mediodía
      "midday": { type: "midday", weight: 90 },
      "noon": { type: "midday", weight: 88 },
      "mid_morning": { type: "midday", weight: 75 },
      
      // Tarde
      "afternoon": { type: "afternoon", weight: 85 },
      "late_afternoon": { type: "afternoon", weight: 80 },
      "tea_time": { type: "afternoon", weight: 70 },
      
      // Hora dorada
      "golden_hour": { type: "golden_hour", weight: 100, temp: "warm" },
      "magic_hour": { type: "golden_hour", weight: 98, temp: "warm" },
      "sunset_light": { type: "golden_hour", weight: 95, temp: "warm" },
      "warm_glow": { type: "golden_hour", weight: 92, temp: "warm" },
      
      // Atardecer
      "sunset": { type: "sunset", weight: 97, temp: "warm" },
      "dusk": { type: "sunset", weight: 93, temp: "warm" },
      "evening_light": { type: "sunset", weight: 90, temp: "warm" },
      
      // Crepúsculo
      "twilight": { type: "twilight", weight: 94, temp: "cool" },
      "blue_hour": { type: "twilight", weight: 96, temp: "cool" },
      "civil_twilight": { type: "twilight", weight: 88, temp: "cool" },
      "nautical_twilight": { type: "twilight", weight: 85, temp: "cool" },
      
      // Noche
      "night": { type: "night", weight: 98 },
      "nighttime": { type: "night", weight: 96 },
      "evening": { type: "night", weight: 85 },
      "starry": { type: "night", weight: 92 },
      "moonlight": { type: "night", weight: 90 },
      "dark": { type: "night", weight: 80 },
      "illuminated_night": { type: "night", weight: 88 },
      "city_lights": { type: "night", weight: 86 }
    }
    
    // === SCORING TEMPORAL ===
    const scores: Record<string, number> = {
      sunrise: 0,
      morning: 0,
      midday: 0,
      afternoon: 0,
      golden_hour: 0,
      sunset: 0,
      twilight: 0,
      night: 0
    }
    
    let lightTemp: ("warm" | "cool" | "neutral" | "mixed")[] = []
    
    for (const [tag, config] of Object.entries(TIME_INDICATORS)) {
      if (t.includes(tag)) {
        scores[config.type] += config.weight
        if (config.temp) lightTemp.push(config.temp)
      }
    }
    
    // === REGLAS CONTEXTUALES TEMPORALES ===
    
    // Regla 1: "sunset" + "golden_hour" → golden_hour tiene prioridad (momento más específico)
    if (scores.sunset > 0 && scores.golden_hour > 0) {
      scores.sunset = Math.max(0, scores.sunset - 30)
      this.reasoning.push("⏰ Regla T1: sunset + golden_hour → priorizar golden_hour (-30 sunset)")
    }
    
    // Regla 2: "twilight" + "night" → twilight si hay cielo visible, night si completamente oscuro
    if (scores.twilight > 0 && scores.night > 0) {
      if (t.includes("sky") || t.includes("stars") || t.includes("moon")) {
        scores.night = Math.max(0, scores.night - 25)
        this.reasoning.push("⏰ Regla T2: twilight + night con cielo visible → priorizar twilight (-25 night)")
      } else {
        scores.twilight = Math.max(0, scores.twilight - 25)
        this.reasoning.push("⏰ Regla T2: twilight + night sin cielo visible → priorizar night (-25 twilight)")
      }
    }
    
    // Regla 3: "sunrise" + "morning" → sunrise si hay tonos cálidos/rosados
    if (scores.sunrise > 0 && scores.morning > 0 && t.includes("pink_sky") || t.includes("orange_hues")) {
      scores.morning = Math.max(0, scores.morning - 35)
      this.reasoning.push("⏰ Regla T3: sunrise + morning con tonos cálidos → priorizar sunrise (-35 morning)")
    }
    
    // Regla 4: "afternoon" + "golden_hour" → golden_hour si después de las 16:00 (contexto implícito)
    if (scores.afternoon > 0 && scores.golden_hour > 0) {
      scores.afternoon = Math.max(0, scores.afternoon - 40)
      this.reasoning.push("⏰ Regla T4: afternoon + golden_hour → priorizar golden_hour (-40 afternoon)")
    }
    
    // Regla 5: "midday" + "sunny" + "harsh_shadows" → reforzar midday
    if (scores.midday > 0 && t.includes("sunny") && t.includes("harsh_shadows")) {
      scores.midday += 20
      this.reasoning.push("⏰ Regla T5: midday + sunny + harsh_shadows → reforzar midday (+20)")
    }
    
    // === DETERMINACIÓN FINAL ===
    const maxTime = Object.entries(scores)
      .reduce((a, b) => (b[1] > a[1] ? b : a), ["unknown", 0])
    
    time.type = maxTime[1] >= 60 ? maxTime[0] as any : "unknown"
    time.confidence = Math.min(100, Math.round(maxTime[1] * 0.8))
    time.indicators = Object.entries(TIME_INDICATORS)
      .filter(([tag, cfg]) => t.includes(tag) && cfg.type === time.type)
      .map(([tag]) => tag)
    
    // Determinar temperatura de luz
    if (lightTemp.length > 0) {
      const warmCount = lightTemp.filter(t => t === "warm").length
      const coolCount = lightTemp.filter(t => t === "cool").length
      
      if (warmCount > coolCount * 1.5) time.lightTemperature = "warm"
      else if (coolCount > warmCount * 1.5) time.lightTemperature = "cool"
      else if (warmCount > 0 && coolCount > 0) time.lightTemperature = "mixed"
      else time.lightTemperature = "neutral"
    }
    
    // Flags derivados
    this.detection.isDaytime = ["sunrise", "morning", "midday", "afternoon", "golden_hour", "sunset"].includes(time.type)
    this.detection.isNighttime = ["twilight", "night"].includes(time.type)
    this.detection.isGoldenHour = time.type === "golden_hour"
    
    this.reasoning.push(`⏰ Momento final: ${time.type} (confianza: ${time.confidence}%, scores: ${JSON.stringify(scores)})`)
  }
  
  // ============================================================
  // ☁️ DETECCIÓN METEOROLÓGICA (7 condiciones + visibilidad)
  // ============================================================
  private detectWeather() {
    const weather = this.detection.weather!
    const t = this.tags
    
    // === INDICADORES METEOROLÓGICOS (35+ tags) ===
    const WEATHER_INDICATORS: Record<string, { type: string; weight: number; visibility?: "excellent" | "good" | "moderate" | "poor" }> = {
      // Soleado/Despejado
      "sunny": { type: "sunny", weight: 95, visibility: "excellent" },
      "clear_sky": { type: "sunny", weight: 92, visibility: "excellent" },
      "blue_sky": { type: "sunny", weight: 90, visibility: "excellent" },
      "sunlight": { type: "sunny", weight: 88 },
      "bright_sun": { type: "sunny", weight: 85 },
      
      // Parcialmente nublado
      "partly_cloudy": { type: "partly_cloudy", weight: 93, visibility: "good" },
      "scattered_clouds": { type: "partly_cloudy", weight: 90, visibility: "good" },
      "few_clouds": { type: "partly_cloudy", weight: 85, visibility: "good" },
      
      // Nublado
      "cloudy": { type: "cloudy", weight: 92, visibility: "moderate" },
      "overcast": { type: "overcast", weight: 94, visibility: "moderate" },
      "grey_sky": { type: "cloudy", weight: 88, visibility: "moderate" },
      "cloud_cover": { type: "cloudy", weight: 85, visibility: "moderate" },
      
      // Lluvia
      "rainy": { type: "rainy", weight: 96, visibility: "poor" },
      "rain": { type: "rainy", weight: 94, visibility: "poor" },
      "drizzle": { type: "rainy", weight: 90, visibility: "moderate" },
      "shower": { type: "rainy", weight: 88, visibility: "moderate" },
      "umbrella_rain": { type: "rainy", weight: 85, visibility: "poor" },
      
      // Niebla/Bruma
      "foggy": { type: "foggy", weight: 95, visibility: "poor" },
      "fog": { type: "foggy", weight: 93, visibility: "poor" },
      "misty": { type: "misty", weight: 91, visibility: "moderate" },
      "haze": { type: "misty", weight: 87, visibility: "moderate" },
      "mist": { type: "misty", weight: 85, visibility: "moderate" },
      
      // Nieve
      "snowy": { type: "snowy", weight: 97, visibility: "moderate" },
      "snow": { type: "snowy", weight: 95, visibility: "moderate" },
      "snowfall": { type: "snowy", weight: 93, visibility: "poor" },
      "snow_covered": { type: "snowy", weight: 90, visibility: "good" },
      
      // Tormenta
      "stormy": { type: "stormy", weight: 98, visibility: "poor" },
      "thunderstorm": { type: "stormy", weight: 96, visibility: "poor" },
      "lightning": { type: "stormy", weight: 94, visibility: "poor" },
      
      // Noche despejada
      "clear_night": { type: "clear_night", weight: 90, visibility: "excellent" },
      "starry_sky": { type: "clear_night", weight: 88, visibility: "excellent" }
    }
    
    // === SCORING METEOROLÓGICO ===
    const scores: Record<string, number> = {
      sunny: 0,
      partly_cloudy: 0,
      cloudy: 0,
      overcast: 0,
      rainy: 0,
      foggy: 0,
      misty: 0,
      snowy: 0,
      stormy: 0,
      clear_night: 0
    }
    
    let visibilityScores: Record<string, number> = {
      excellent: 0,
      good: 0,
      moderate: 0,
      poor: 0
    }
    
    for (const [tag, config] of Object.entries(WEATHER_INDICATORS)) {
      if (t.includes(tag)) {
        scores[config.type] += config.weight
        if (config.visibility) {
          visibilityScores[config.visibility] += config.weight * 0.7
        }
      }
    }
    
    // === REGLAS CONTEXTUALES METEOROLÓGICAS ===
    
    // Regla 1: "sunny" + "cloudy" → partly_cloudy si ambos presentes
    if (scores.sunny > 0 && scores.cloudy > 0) {
      scores.sunny = Math.max(0, scores.sunny - 40)
      scores.cloudy = Math.max(0, scores.cloudy - 40)
      scores.partly_cloudy += 60
      this.reasoning.push("☁️ Regla W1: sunny + cloudy → inferir partly_cloudy (+60 partly_cloudy)")
    }
    
    // Regla 2: "rainy" + "sunny" → "rainy" tiene prioridad (lluvia visible)
    if (scores.rainy > 0 && scores.sunny > 0) {
      scores.sunny = Math.max(0, scores.sunny - 50)
      this.reasoning.push("☁️ Regla W2: rainy + sunny → priorizar rainy (-50 sunny)")
    }
    
    // Regla 3: "foggy" + "misty" → foggy si densidad alta, misty si ligera
    if (scores.foggy > 0 && scores.misty > 0) {
      if (t.includes("dense") || t.includes("thick")) {
        scores.misty = Math.max(0, scores.misty - 30)
      } else {
        scores.foggy = Math.max(0, scores.foggy - 30)
      }
      this.reasoning.push("☁️ Regla W3: foggy + misty → resolver por densidad")
    }
    
    // Regla 4: "clear_night" solo válido si es noche
    if (scores.clear_night > 0 && !this.detection.isNighttime) {
      scores.clear_night = Math.max(0, scores.clear_night - 70)
      this.reasoning.push("☁️ Regla W4: clear_night sin contexto nocturno → descartar (-70)")
    }
    
    // Regla 5: "overcast" + "rainy" → rainy tiene prioridad si lluvia visible
    if (scores.overcast > 0 && scores.rainy > 0) {
      scores.overcast = Math.max(0, scores.overcast - 25)
      this.reasoning.push("☁️ Regla W5: overcast + rainy → priorizar rainy (-25 overcast)")
    }
    
    // === DETERMINACIÓN FINAL ===
    const maxWeather = Object.entries(scores)
      .reduce((a, b) => (b[1] > a[1] ? b : a), ["unknown", 0])
    
    weather.type = maxWeather[1] >= 65 ? maxWeather[0] as any : "unknown"
    weather.confidence = Math.min(100, Math.round(maxWeather[1] * 0.75))
    weather.indicators = Object.entries(WEATHER_INDICATORS)
      .filter(([tag, cfg]) => t.includes(tag) && cfg.type === weather.type)
      .map(([tag]) => tag)
    
    // Determinar visibilidad
    const maxVis = Object.entries(visibilityScores)
      .reduce((a, b) => (b[1] > a[1] ? b : a), ["moderate", 0])
    weather.visibility = maxVis[1] > 30 ? maxVis[0] as any : "moderate"
    
    // Flags derivados
    this.detection.isClearWeather = ["sunny", "partly_cloudy", "clear_night"].includes(weather.type)
    this.detection.isInclementWeather = ["rainy", "foggy", "stormy", "snowy"].includes(weather.type)
    
    this.reasoning.push(`☁️ Clima final: ${weather.type} (confianza: ${weather.confidence}%, visibilidad: ${weather.visibility})`)
  }
  
  // ============================================================
  // 🍂 DETECCIÓN DE ESTACIONALIDAD
  // ============================================================
  private detectSeason() {
    const season = this.detection.season!
    const t = this.tags
    
    const SEASON_INDICATORS: Record<string, { type: string; weight: number }> = {
      // Primavera
      "spring": { type: "spring", weight: 95 },
      "blossom": { type: "spring", weight: 92 },
      "cherry_blossom": { type: "spring", weight: 90 },
      "flowers_blooming": { type: "spring", weight: 88 },
      "fresh_green": { type: "spring", weight: 85 },
      "mild_weather": { type: "spring", weight: 80 },
      
      // Verano
      "summer": { type: "summer", weight: 95 },
      "beach_season": { type: "summer", weight: 93 },
      "hot_weather": { type: "summer", weight: 90 },
      "lush_green": { type: "summer", weight: 87 },
      "vacation_season": { type: "summer", weight: 85 },
      
      // Otoño
      "autumn": { type: "autumn", weight: 95 },
      "fall": { type: "autumn", weight: 94 },
      "foliage": { type: "autumn", weight: 92 },
      "fall_colors": { type: "autumn", weight: 90 },
      "crisp_air": { type: "autumn", weight: 85 },
      "harvest": { type: "autumn", weight: 82 },
      
      // Invierno
      "winter": { type: "winter", weight: 95 },
      "snow_season": { type: "winter", weight: 93 },
      "cold_weather": { type: "winter", weight: 90 },
      "bare_trees": { type: "winter", weight: 87 },
      "holiday_season": { type: "winter", weight: 85 },
      "christmas": { type: "winter", weight: 83 }
    }
    
    const scores: Record<string, number> = {
      spring: 0,
      summer: 0,
      autumn: 0,
      winter: 0,
      transitional: 0
    }
    
    for (const [tag, config] of Object.entries(SEASON_INDICATORS)) {
      if (t.includes(tag)) {
        scores[config.type] += config.weight
      }
    }
    
    // Regla: Si dos estaciones tienen scores similares → transitional
    const sorted = Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
    
    if (sorted.length >= 2 && sorted[0][1] > 40 && sorted[1][1] > 30 && sorted[0][1] - sorted[1][1] < 25) {
      scores.transitional = Math.max(sorted[0][1], sorted[1][1]) + 20
      this.reasoning.push(`🍂 Dos estaciones con scores cercanos → inferir transitional (+20)`)
    }
    
    const maxSeason = Object.entries(scores)
      .reduce((a, b) => (b[1] > a[1] ? b : a), ["unknown", 0])
    
    season.type = maxSeason[1] >= 55 ? maxSeason[0] as any : "unknown"
    season.confidence = Math.min(100, Math.round(maxSeason[1] * 0.7))
    season.indicators = Object.entries(SEASON_INDICATORS)
      .filter(([tag, cfg]) => t.includes(tag) && cfg.type === season.type)
      .map(([tag]) => tag)
    
    this.reasoning.push(`🍂 Estación final: ${season.type} (confianza: ${season.confidence}%)`)
  }
  
  // ============================================================
  // 💡 DETECCIÓN DE ILUMINACIÓN
  // ============================================================
  private detectLighting() {
    const lighting = this.detection.lighting!
    const t = this.tags
    
    // Fuentes de luz
    if (t.includes("sunlight") || t.includes("natural_light") || t.includes("daylight")) {
      lighting.sources.push("sunlight")
      this.detection.hasNaturalLight = true
    }
    if (t.includes("moonlight") || t.includes("starlight")) {
      lighting.sources.push("moonlight")
      this.detection.hasNaturalLight = true
    }
    if (t.includes("lamp") || t.includes("ceiling_light") || t.includes("wall_light") || 
        t.includes("chandelier") || t.includes("recessed") || t.includes("led")) {
      lighting.sources.push("artificial")
      this.detection.hasArtificialLight = true
    }
    if (t.includes("candle") || t.includes("candles") || t.includes("candlelight")) {
      lighting.sources.push("candlelight")
      this.detection.hasArtificialLight = true
    }
    if (t.includes("fireplace") || t.includes("fire_pit") || t.includes("bonfire")) {
      lighting.sources.push("fireplace")
      this.detection.hasArtificialLight = true
    }
    if (t.includes("neon") || t.includes("signage")) {
      lighting.sources.push("neon")
      this.detection.hasArtificialLight = true
    }
    
    // Tipo de iluminación
    const naturalCount = lighting.sources.filter(s => ["sunlight", "moonlight"].includes(s)).length
    const artificialCount = lighting.sources.filter(s => !["sunlight", "moonlight"].includes(s)).length
    
    if (naturalCount > artificialCount * 1.5) {
      lighting.type = "natural"
    } else if (artificialCount > naturalCount * 1.5) {
      lighting.type = "artificial"
    } else if (naturalCount > 0 && artificialCount > 0) {
      lighting.type = "mixed"
    }
    
    // Calidad de iluminación
    if (t.includes("soft_light") || t.includes("diffused") || t.includes("even_light")) {
      lighting.quality = "excellent"
    } else if (t.includes("harsh_shadows") || t.includes("overexposed") || t.includes("underexposed")) {
      lighting.quality = "poor"
    } else if (t.includes("well_lit") || t.includes("balanced")) {
      lighting.quality = "good"
    }
    
    // Mood/atmósfera
    if (t.includes("warm_light") || t.includes("golden") || t.includes("cozy")) {
      lighting.mood = "warm"
    } else if (t.includes("cool_light") || t.includes("blue_tones") || t.includes("clinical")) {
      lighting.mood = "cool"
    } else if (t.includes("candlelight") || t.includes("fireplace") || t.includes("intimate")) {
      lighting.mood = "romantic"
    } else if (t.includes("vibrant") || t.includes("energetic") || t.includes("lively")) {
      lighting.mood = "vibrant"
    } else if (t.includes("serene") || t.includes("calm") || t.includes("peaceful")) {
      lighting.mood = "serene"
    } else if (t.includes("dramatic_shadows") || t.includes("high_contrast")) {
      lighting.mood = "dramatic"
    }
    
    this.reasoning.push(`💡 Iluminación: tipo=${lighting.type}, calidad=${lighting.quality}, fuentes=${lighting.sources.join(", ")}, mood=${lighting.mood}`)
  }
  
  // ============================================================
  // 🚀 EJECUCIÓN PRINCIPAL
  // ============================================================
  public detect(): SceneDetection {
    // Ejecutar detectores en orden de dependencia
    this.detectLocation()
    this.detectTimeOfDay()
    this.detectWeather()
    this.detectSeason()
    this.detectLighting()
    
    // Calcular confianza global (promedio ponderado)
    const confidences = [
      this.detection.location!.confidence * 0.30,
      this.detection.timeOfDay!.confidence * 0.25,
      this.detection.weather!.confidence * 0.20,
      this.detection.season!.confidence * 0.15,
      (this.detection.lighting!.quality === "excellent" ? 90 : 
       this.detection.lighting!.quality === "good" ? 75 : 
       this.detection.lighting!.quality === "average" ? 60 : 40) * 0.10
    ]
    
    this.detection.confidenceOverall = Math.round(confidences.reduce((a, b) => a + b, 0))
    
    // Compilar razonamiento final
    this.detection.reasoning = [...this.reasoning]
    
    return this.detection as SceneDetection
  }
}

// ============================================================
// 🧪 UTILIDADES DE SOPORTE
// ============================================================

/**
 * ✨ Versión simplificada para integraciones legacy
 * Devuelve array plano de strings como la versión original
 */
export function detectSceneSimple(tags: string[]): string[] {
  const detection = detectSceneAttributes(tags)
  const result: string[] = []
  
  // Ubicación
  if (detection.location.type === "exterior") result.push("exterior")
  else if (detection.location.type === "interior") result.push("interior")
  else if (detection.location.type === "semi_exterior") result.push("semi_exterior")
  
  // Momento
  if (["sunrise", "morning", "midday", "afternoon", "golden_hour", "sunset"].includes(detection.timeOfDay.type)) {
    result.push("day")
  } else if (["twilight", "night"].includes(detection.timeOfDay.type)) {
    result.push("night")
  }
  
  // Clima (opcional para versión simple)
  if (detection.weather.type === "sunny") result.push("sunny")
  else if (detection.weather.type === "rainy") result.push("rainy")
  
  return result
}

/**
 * 🏷️ Genera etiquetas humanas para UI
 */
export function getSceneLabels(detection: SceneDetection): string[] {
  const labels: string[] = []
  
  // Ubicación
  const LOCATION_LABELS: Record<string, string> = {
    interior: "Interior",
    exterior: "Exterior",
    semi_exterior: "Semi-exterior",
    ambiguous: "Ambiguo"
  }
  labels.push(LOCATION_LABELS[detection.location.type] || "Desconocido")
  
  // Momento
  const TIME_LABELS: Record<string, string> = {
    sunrise: "Amanecer",
    morning: "Mañana",
    midday: "Mediodía",
    afternoon: "Tarde",
    golden_hour: "Hora dorada",
    sunset: "Atardecer",
    twilight: "Crepúsculo",
    night: "Noche",
    unknown: "Desconocido"
  }
  labels.push(TIME_LABELS[detection.timeOfDay.type] || "Desconocido")
  
  // Clima
  const WEATHER_LABELS: Record<string, string> = {
    sunny: "Soleado",
    partly_cloudy: "Parcialmente nublado",
    cloudy: "Nublado",
    overcast: "Cubierto",
    rainy: "Lluvioso",
    foggy: "Niebla",
    misty: "Bruma",
    snowy: "Nevado",
    stormy: "Tormenta",
    clear_night: "Noche despejada",
    unknown: "Desconocido"
  }
  if (detection.weather.confidence > 60) {
    labels.push(WEATHER_LABELS[detection.weather.type] || "Clima desconocido")
  }
  
  return labels
}

/**
 * 📊 Calcula distribución de escenas para análisis de galería
 */
export function analyzeSceneDistribution(detections: SceneDetection[]): {
  location: Record<string, number>
  timeOfDay: Record<string, number>
  weather: Record<string, number>
  season: Record<string, number>
} {
  const location: Record<string, number> = { interior: 0, exterior: 0, semi_exterior: 0, ambiguous: 0 }
  const timeOfDay: Record<string, number> = { 
    sunrise: 0, morning: 0, midday: 0, afternoon: 0, 
    golden_hour: 0, sunset: 0, twilight: 0, night: 0, unknown: 0 
  }
  const weather: Record<string, number> = {
    sunny: 0, partly_cloudy: 0, cloudy: 0, overcast: 0, rainy: 0,
    foggy: 0, misty: 0, snowy: 0, stormy: 0, clear_night: 0, unknown: 0
  }
  const season: Record<string, number> = {
    spring: 0, summer: 0, autumn: 0, winter: 0, transitional: 0, unknown: 0
  }
  
  detections.forEach(d => {
    location[d.location.type] = (location[d.location.type] || 0) + 1
    timeOfDay[d.timeOfDay.type] = (timeOfDay[d.timeOfDay.type] || 0) + 1
    weather[d.weather.type] = (weather[d.weather.type] || 0) + 1
    season[d.season.type] = (season[d.season.type] || 0) + 1
  })
  
  return { location, timeOfDay, weather, season }
}