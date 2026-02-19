// src/lib/extractAmenities.ts

/**
 * 🔍 Sistema avanzado de extracción de amenities hoteleros (versión corregida)
 * 
 * ✅ FIX: Añadida propiedad 'amenities' a la interfaz AmenitiesExtraction
 */

export interface Amenity {
  id: string
  name: string
  category: AmenityCategory
  confidence: "high" | "medium" | "low"
  indicators: string[]
  isPremium: boolean
}

export type AmenityCategory =
  | "pool" | "wellness" | "dining" | "room" | "bathroom"
  | "outdoor" | "common_areas" | "business" | "family"
  | "accessibility" | "sustainability" | "views" | "atmosphere" | "premium"

export interface AmenitiesExtraction {
  // ✅ NUEVO: Array completo de amenities detectados (para searchAmenities)
  amenities: Amenity[]
  
  // Amenities estructurados por categoría
  byCategory: Record<AmenityCategory, Amenity[]>
  
  // Amenities premium destacados
  premium: Amenity[]
  
  // Array plano para compatibilidad
  flat: string[]
  
  // Flags técnicos
  hasPool: boolean
  hasSpa: boolean
  hasRestaurant: boolean
  hasBar: boolean
  hasSeaView: boolean
  isLuxury: boolean
  isBoutique: boolean
  isFamilyFriendly: boolean
  isBusinessReady: boolean
  isWellnessOriented: boolean
  
  // Metadatos
  confidenceOverall: number
  tagsAnalyzed: number
  processingTimeMs: number
}

export function extractAmenities(tags: string[]): AmenitiesExtraction {
  const start = Date.now()
  const normalized = tags
    .map(t => t.toLowerCase().trim())
    .filter(t => t.length >= 2 && !/^\d+$/.test(t))
  
  const extractor = new AmenityExtractor(normalized)
  const result = extractor.extract()
  
  result.processingTimeMs = Date.now() - start
  return result
}

// ============================================================
// 🔬 CLASE EXTRACTOR
// ============================================================

class AmenityExtractor {
  private tags: string[]
  private amenities: Amenity[] = []
  private confidenceScores: Map<string, number> = new Map()
  private indicatorsUsed: Map<string, Set<string>> = new Map()
  
  private readonly SYNONYMS: Record<string, string[]> = {
    // Piscinas
    "pool": ["pool", "piscina", "swimming pool", "piscina exterior", "alberca"],
    "infinity_pool": ["infinity pool", "piscina infinita", "vanishing edge", "borde infinito"],
    "indoor_pool": ["indoor pool", "piscina cubierta", "covered pool", "piscina interior"],
    "heated_pool": ["heated pool", "piscina climatizada", "thermal pool"],
    "kids_pool": ["kids pool", "piscina infantil", "children pool", "piscinita"],
    "jacuzzi": ["jacuzzi", "hidromasaje", "hot tub", "whirlpool", "spa pool"],
    
    // Wellness
    "spa": ["spa", "centro de spa", "spa center", "wellness center", "área de bienestar"],
    "sauna": ["sauna", "sauna finlandesa", "sauna room", "sauna seca"],
    "steam_room": ["steam room", "baño de vapor", "hammam", "turkish bath", "vapor"],
    "massage": ["massage", "masaje", "massage room", "sala de masajes", "treatment room"],
    "gym": ["gym", "gimnasio", "fitness center", "fitness room", "sala de fitness"],
    "yoga": ["yoga", "yoga room", "sala de yoga", "meditation", "meditación"],
    
    // Dining
    "restaurant": ["restaurant", "restaurante", "dining room", "comedor", "fine dining"],
    "buffet": ["buffet", "bufé", "buffet area", "zona de buffet", "desayuno buffet"],
    "bar": ["bar", "barra", "lounge bar", "lobby bar", "bar interior"],
    "rooftop_bar": ["rooftop bar", "bar en azotea", "sky bar", "bar terraza"],
    "pool_bar": ["pool bar", "bar de piscina", "swim-up bar", "chiringuito"],
    "beach_bar": ["beach bar", "chiringuito", "beach club", "bar playero"],
    "cafe": ["cafe", "cafetería", "coffee shop", "pastelería", "zona café"],
    "dining_area": ["dining area", "dining room", "breakfast area", "zona de desayuno"],
    
    // Rooms
    "room": ["room", "habitación", "bedroom", "dormitorio", "guest room"],
    "suite": ["suite", "suites", "junior suite", "suite junior", "executive suite"],
    "presidential_suite": ["presidential suite", "suite presidencial", "royal suite", "suite real"],
    "king_bed": ["king bed", "cama king", "king size", "cama grande"],
    "queen_bed": ["queen bed", "cama queen", "queen size", "cama mediana"],
    "twin_beds": ["twin beds", "camas gemelas", "twin_beds", "camas dobles"],
    "balcony": ["balcony", "balcón", "balcones", "private balcony", "balcón privado"],
    "terrace": ["terrace", "terraza", "private terrace", "terraza privada", "solarium"],
    
    // Bathrooms
    "bathroom": ["bathroom", "baño", "cuarto de baño", "ensuite", "baño privado"],
    "bathtub": ["bathtub", "bañera", "freestanding tub", "bañera independiente", "clawfoot"],
    "rain_shower": ["rain shower", "ducha de lluvia", "rainfall shower", "ducha efecto lluvia"],
    "double_vanity": ["double vanity", "doble lavabo", "his and hers", "dos lavabos"],
    
    // Outdoor
    "garden": ["garden", "jardín", "jardines", "landscaped garden", "jardín paisajista"],
    "botanical_garden": ["botanical garden", "jardín botánico", "huerto", "jardín temático"],
    "beach_access": ["beach access", "acceso a playa", "playa privada", "first line beach"],
    "mountain_view": ["mountain view", "vista a montaña", "vistas montañosas", "sierra"],
    "courtyard": ["courtyard", "patio interior", "patio", "claustro"],
    
    // Common areas
    "lobby": ["lobby", "recepción", "reception", "hall de entrada", "área de check-in"],
    "lounge": ["lounge", "salón", "sala de estar", "common area", "zona común"],
    "library": ["library", "biblioteca", "reading room", "sala de lectura"],
    "fireplace": ["fireplace", "chimenea", "fuego", "hogar", "lounge fireplace"],
    
    // Business
    "conference_room": ["conference room", "sala de conferencias", "meeting room", "sala de juntas"],
    "business_center": ["business center", "centro de negocios", "business area", "oficina"],
    "av_equipment": ["av equipment", "equipo audiovisual", "proyector", "pantalla"],
    
    // Family
    "kids_club": ["kids club", "club infantil", "children club", "miniclub"],
    "playground": ["playground", "zona de juegos", "parque infantil", "área kids"],
    "babysitting": ["babysitting", "canguro", "niñera", "childcare", "guardería"],
    
    // Accessibility
    "wheelchair_accessible": ["wheelchair accessible", "accesible silla ruedas", "accesibilidad", "rampas"],
    "adapted_bathroom": ["adapted bathroom", "baño adaptado", "baño accesible", "handrails"],
    
    // Sustainability
    "eco_certified": ["eco certified", "certificación ecológica", "green key", "sostenible"],
    "solar_panels": ["solar panels", "paneles solares", "energía solar", "fotovoltaica"],
    
    // Views
    "sea_view": ["sea view", "vista al mar", "ocean view", "vistas marinas", "costa"],
    "city_view": ["city view", "vista a ciudad", "skyline", "vistas urbanas"],
    "panoramic_view": ["panoramic view", "vista panorámica", "360 view", "vistas completas"],
    
    // Atmosphere/Style
    "luxury": ["luxury", "lujo", "luxurious", "premium", "high-end", "5 estrellas"],
    "boutique": ["boutique", "boutique hotel", "diseño exclusivo", "hotel con encanto"],
    "modern": ["modern", "moderno", "contemporary", "diseño actual", "minimalista"],
    "rustic": ["rustic", "rústico", "campo", "natural", "madera", "piedra"],
    "mediterranean": ["mediterranean", "mediterráneo", "blanco", "azul", "ibicenco"],
    
    // Premium indicators
    "butler_service": ["butler", "mayordomo", "butler service", "servicio personal"],
    "private_pool": ["private pool", "piscina privada", "piscina exclusiva", "solo para huéspedes"],
    "vip_access": ["vip access", "acceso vip", "zona exclusiva", "membresía"]
  }

  constructor(tags: string[]) {
    this.tags = tags
    this.initializeConfidenceScores()
  }
  
  private initializeConfidenceScores() {
    Object.keys(this.SYNONYMS).forEach(amenityId => {
      this.confidenceScores.set(amenityId, 0)
      this.indicatorsUsed.set(amenityId, new Set())
    })
  }
  
  // ============================================================
  // 🔎 EXTRACCIÓN POR CATEGORÍAS
  // ============================================================
  
  private extractPoolAmenities() {
    if (this.hasAny(["infinity", "vanishing", "edge", "horizon"]) && 
        this.hasTag("pool") && 
        this.hasAny(["water", "sunbed", "umbrella"])) {
      this.addConfidence("infinity_pool", 95, "piscina infinita con evidencia visual")
      this.addConfidence("pool", -30, "reemplazado por infinity_pool")
    } else if (this.hasTag("pool") && this.hasAny(["water", "swimming", "sunbed"])) {
      this.addConfidence("pool", 85, "piscina con evidencia visual")
      if (this.hasTag("sunbed")) {
        this.addConfidence("sunbed", 10, "tumbonas en piscina")
      }
    }
    
    if (this.hasAny(["indoor", "covered", "cubierta", "interior"]) && !this.hasTag("infinity")) {
      this.addConfidence("indoor_pool", 90, "piscina cubierta detectada")
      this.addConfidence("pool", -25, "reemplazado por indoor_pool")
    }
    
    if (this.hasAny(["heated", "thermal", "climatizada", "temperada"])) {
      this.addConfidence("heated_pool", 88, "piscina climatizada detectada")
    }
    
    if (this.hasAny(["kids", "children", "infantil", "niños"]) && this.hasTag("pool")) {
      this.addConfidence("kids_pool", 82, "piscina infantil detectada")
    }
    
    if (this.hasAny(["jacuzzi", "hot tub", "hidromasaje"])) {
      this.addConfidence("jacuzzi", 80, "jacuzzi detectado")
    }
    
    if (this.hasAny(["pool bar", "bar de piscina", "swim-up"])) {
      this.addConfidence("pool_bar", 87, "bar integrado en piscina detectado")
    }
  }
  
  private extractWellnessAmenities() {
    if (this.hasAny(["spa", "wellness", "centro de spa"])) {
      this.addConfidence("spa", 92, "spa detectado")
      if (this.hasAny(["sauna", "sauna finlandesa"])) this.addConfidence("sauna", 88, "sauna detectada")
      if (this.hasAny(["steam", "vapor", "hammam", "turkish bath"])) this.addConfidence("steam_room", 86, "baño de vapor detectado")
      if (this.hasAny(["massage", "masaje", "treatment"])) this.addConfidence("spa", 15, "servicios de masaje detectados")
      if (this.hasAny(["relaxation", "quiet room", "zona relax"])) this.addConfidence("spa", 10, "área de relajación detectada")
    }
    
    if (this.hasAny(["gym", "fitness", "gimnasio"])) {
      this.addConfidence("gym", 85, "gimnasio detectado")
      if (this.hasAny(["yoga", "meditation", "pilates"])) this.addConfidence("yoga", 83, "sala de yoga/meditación detectada")
      if (this.hasAny(["personal trainer", "entrenador"])) this.addConfidence("gym", 15, "servicio de entrenador personal")
    }
  }
  
  private extractDiningAmenities() {
    const isRoomContext = this.hasAny(["room", "suite", "bedroom", "king bed", "queen bed", "twin_beds"])
    const isPureRestaurant = this.hasAny(["restaurant", "restaurante"]) && !isRoomContext
    
    if (isPureRestaurant) {
      this.addConfidence("restaurant", 88, "restaurante detectado")
      if (this.hasAny(["buffet", "bufé", "desayuno"])) this.addConfidence("buffet", 84, "zona de buffet detectada")
      if (this.hasAny(["fine dining", "gourmet", "chef"])) this.addConfidence("restaurant", 15, "restaurante gourmet detectado")
      if (this.hasAny(["rooftop", "azotea"]) && this.hasTag("restaurant")) {
        this.addConfidence("restaurant", -20, "reemplazado por rooftop_bar si aplica")
      }
    }
    
    if (this.hasAny(["dining area", "dining room", "breakfast area"]) && isRoomContext) {
      if (this.hasAny(["breakfast", "morning", "food", "plate", "cup"])) {
        this.addConfidence("dining_area", 85, "zona de desayuno en habitación detectada")
      }
    }
    
    if (this.hasAny(["bar", "cocktail", "barra"])) {
      this.addConfidence("bar", 86, "bar detectado")
      if (this.hasAny(["rooftop", "sky bar", "azotea"]) && this.hasTag("bar")) {
        this.addConfidence("rooftop_bar", 93, "bar en azotea detectado")
        this.addConfidence("bar", -40, "reemplazado por rooftop_bar")
      }
      if (this.hasTag("pool") && this.hasTag("bar")) {
        this.addConfidence("pool_bar", 91, "bar de piscina detectado")
        this.addConfidence("bar", -35, "reemplazado por pool_bar")
      }
      if (this.hasAny(["beach", "playa"]) && this.hasTag("bar")) {
        this.addConfidence("beach_bar", 89, "chiringuito/bar playero detectado")
        this.addConfidence("bar", -30, "reemplazado por beach_bar")
      }
      if (this.hasAny(["wine", "bodega", "vinos"])) this.addConfidence("bar", 10, "especialidad en vinos detectada")
    }
    
    if (this.hasAny(["cafe", "cafetería", "coffee", "pastelería"])) {
      this.addConfidence("cafe", 80, "cafetería detectada")
    }
    
    // ✅ ELIMINAR "sunbed" en contexto de restaurante
    if (isPureRestaurant && this.hasTag("sunbed")) {
      this.removeConfidence("sunbed", 100, "sunbed no es relevante en restaurante")
    }
  }
  
  private extractRoomAmenities() {
    if (this.hasAny(["room", "habitación", "bedroom"])) {
      this.addConfidence("room", 82, "habitación detectada")
      if (this.hasAny(["twin beds", "camas gemelas", "twin_beds", "camas dobles"])) {
        this.addConfidence("twin_beds", 90, "camas gemelas detectadas")
      }
      if (this.hasAny(["king bed", "cama king", "king size"])) {
        this.addConfidence("king_bed", 85, "cama king size detectada")
      }
      if (this.hasAny(["queen bed", "cama queen", "queen size"])) {
        this.addConfidence("queen_bed", 83, "cama queen size detectada")
      }
      if (this.hasAny(["suite", "suites"])) {
        this.addConfidence("suite", 90, "suite detectada")
        this.addConfidence("room", -35, "reemplazado por suite")
        if (this.hasAny(["presidential", "royal", "real", "presidencial"])) {
          this.addConfidence("presidential_suite", 96, "suite presidencial detectada")
          this.addConfidence("suite", -25, "reemplazado por presidential_suite")
        }
      }
      if (this.hasAny(["balcony", "balcón", "terraza privada"])) {
        this.addConfidence("balcony", 87, "balcón/terraza privada detectada")
      }
      if (this.hasAny(["sea view", "vista al mar", "ocean view"]) && this.hasTag("room")) {
        this.addConfidence("room", 20, "habitación con vistas premium")
      }
    }
  }
  
  private extractBathroomAmenities() {
    if (this.hasAny(["bathroom", "baño", "cuarto de baño"])) {
      this.addConfidence("bathroom", 80, "baño detectado")
      if (this.hasAny(["bathtub", "bañera", "freestanding", "clawfoot"])) {
        this.addConfidence("bathtub", 88, "bañera freestanding detectada")
      }
      if (this.hasAny(["rain shower", "ducha lluvia", "rainfall"])) {
        this.addConfidence("rain_shower", 86, "ducha de lluvia detectada")
      }
      if (this.hasAny(["double vanity", "doble lavabo", "his and hers"])) {
        this.addConfidence("double_vanity", 84, "doble lavabo detectado")
      }
      if (this.hasAny(["heated floors", "suelo radiante"])) {
        this.addConfidence("bathroom", 15, "suelo radiante detectado")
      }
    }
  }
  
  private extractOutdoorAmenities() {
    if (this.hasAny(["garden", "jardín", "landscaped", "verde"])) {
      this.addConfidence("garden", 83, "jardín detectado")
      if (this.hasAny(["botanical", "botánico", "huerto"])) {
        this.addConfidence("botanical_garden", 89, "jardín botánico detectado")
        this.addConfidence("garden", -20, "especializado como botanical_garden")
      }
      if (this.hasAny(["zen", "japonés", "meditación"])) {
        this.addConfidence("garden", 15, "jardín zen detectado")
      }
    }
    
    if (this.hasAny(["beach", "playa", "shoreline", "costa"])) {
      this.addConfidence("beach_access", 94, "acceso a playa detectado")
      if (this.hasAny(["private beach", "playa privada", "first line"])) {
        this.addConfidence("beach_access", 15, "playa privada/exclusiva")
      }
    }
    
    if (this.hasAny(["mountain", "montaña", "hill", "valley"])) {
      this.addConfidence("mountain_view", 85, "vistas a montaña detectadas")
    }
    
    if (this.hasAny(["courtyard", "patio", "claustro", "patio interior"])) {
      this.addConfidence("courtyard", 82, "patio interior detectado")
    }
    
    if (this.hasAny(["terrace", "terraza", "solarium", "rooftop"])) {
      if (!this.hasTag("restaurant") && !this.hasTag("room")) {
        this.addConfidence("terrace", 80, "terraza general detectada")
      }
    }
  }
  
  private extractCommonAreasAmenities() {
    if (this.hasAny(["lobby", "recepción", "reception", "check-in"])) {
      this.addConfidence("lobby", 87, "lobby/recepción detectado")
      if (this.hasAny(["grand", "monumental", "impresionante"])) {
        this.addConfidence("lobby", 15, "lobby de diseño monumental")
      }
    }
    
    if (this.hasAny(["lounge", "salón", "sala de estar", "common area"])) {
      this.addConfidence("lounge", 84, "salón de estar detectado")
      if (this.hasAny(["fireplace", "chimenea", "hogar"])) {
        this.addConfidence("fireplace", 86, "chimenea en salón detectada")
      }
    }
    
    if (this.hasAny(["library", "biblioteca", "reading room", "lectura"])) {
      this.addConfidence("library", 81, "biblioteca/sala de lectura detectada")
    }
  }
  
  private extractBusinessAmenities() {
    if (this.hasAny(["conference", "reunión", "meeting", "juntas"])) {
      this.addConfidence("conference_room", 88, "sala de conferencias detectada")
    }
    if (this.hasAny(["business center", "centro negocios", "oficina"])) {
      this.addConfidence("business_center", 85, "centro de negocios detectado")
    }
    if (this.hasAny(["av equipment", "audiovisual", "proyector", "pantalla"])) {
      this.addConfidence("av_equipment", 82, "equipo audiovisual detectado")
    }
    if (this.hasAny(["coworking", "espacio coworking", "trabajo compartido"])) {
      this.addConfidence("business_center", 15, "zona de coworking detectada")
    }
  }
  
  private extractFamilyAmenities() {
    if (this.hasAny(["kids club", "club infantil", "miniclub", "children"])) {
      this.addConfidence("kids_club", 90, "club infantil detectado")
    }
    if (this.hasAny(["playground", "zona juegos", "parque infantil"])) {
      this.addConfidence("playground", 86, "zona de juegos detectada")
    }
    if (this.hasAny(["babysitting", "canguro", "niñera", "childcare"])) {
      this.addConfidence("babysitting", 84, "servicio de canguro detectado")
    }
    if (this.hasAny(["family room", "habitación familiar", "conecting rooms"])) {
      this.addConfidence("room", 15, "habitación familiar detectada")
    }
  }
  
  private extractAccessibilityAmenities() {
    if (this.hasAny(["wheelchair", "silla ruedas", "accesible", "rampas"])) {
      this.addConfidence("wheelchair_accessible", 92, "accesibilidad para silla de ruedas detectada")
    }
    if (this.hasAny(["adapted bathroom", "baño adaptado", "handrails", "barras"])) {
      this.addConfidence("adapted_bathroom", 88, "baño adaptado detectado")
    }
    if (this.hasAny(["elevator", "ascensor", "lift"])) {
      this.addConfidence("wheelchair_accessible", 10, "ascensor disponible")
    }
  }
  
  private extractSustainabilityAmenities() {
    if (this.hasAny(["eco", "sostenible", "green", "ecológico"])) {
      this.addConfidence("eco_certified", 85, "certificación ecológica detectada")
    }
    if (this.hasAny(["solar panels", "paneles solares", "energía solar"])) {
      this.addConfidence("solar_panels", 88, "paneles solares detectados")
    }
    if (this.hasAny(["organic garden", "huerto ecológico", "farm to table"])) {
      this.addConfidence("eco_certified", 15, "huerto orgánico detectado")
    }
    if (this.hasAny(["water saving", "ahorro agua", "rainwater"])) {
      this.addConfidence("eco_certified", 10, "sistemas de ahorro de agua")
    }
  }
  
  private extractViewAmenities() {
    if (this.hasAny(["sea view", "vista al mar", "ocean view", "mar"])) {
      this.addConfidence("sea_view", 93, "vistas al mar detectadas")
    }
    if (this.hasAny(["city view", "vista ciudad", "skyline", "urbano"])) {
      this.addConfidence("city_view", 87, "vistas a ciudad detectadas")
    }
    if (this.hasAny(["mountain view", "vista montaña", "sierra", "valle"])) {
      this.addConfidence("mountain_view", 86, "vistas a montaña detectadas")
    }
    if (this.hasAny(["panoramic", "360", "completa", "amplia vista"])) {
      this.addConfidence("panoramic_view", 91, "vista panorámica detectada")
    }
    if (this.hasAny(["garden view", "vista jardín", "patio vista"])) {
      this.addConfidence("garden_view", 82, "vistas a jardín detectadas")
    }
  }
  
  private extractAtmosphereAmenities() {
    if (this.hasAny(["luxury", "lujo", "premium", "high-end", "5 estrellas"])) {
      this.addConfidence("luxury", 95, "lujo detectado")
    }
    if (this.hasAny(["boutique", "diseño exclusivo", "encanto", "personalizado"])) {
      this.addConfidence("boutique", 90, "estilo boutique detectado")
    }
    if (this.hasAny(["modern", "moderno", "contemporary", "minimalista"])) {
      this.addConfidence("modern", 85, "diseño moderno detectado")
    }
    if (this.hasAny(["rustic", "rústico", "campo", "madera", "piedra"])) {
      this.addConfidence("rustic", 83, "estilo rústico detectado")
    }
    if (this.hasAny(["mediterranean", "mediterráneo", "blanco", "azul", "ibiza"])) {
      this.addConfidence("mediterranean", 87, "estilo mediterráneo detectado")
    }
    if (this.hasAny(["cozy", "acogedor", "cálido", "intimate"])) {
      this.addConfidence("cozy", 84, "ambiente acogedor detectado")
    }
    if (this.hasAny(["romantic", "romántico", "parejas", "luna miel"])) {
      this.addConfidence("romantic", 89, "ambiente romántico detectado")
    }
  }
  
  private extractPremiumAmenities() {
    if (this.hasAny(["butler", "mayordomo", "servicio personal"])) {
      this.addConfidence("butler_service", 94, "servicio de mayordomo detectado")
    }
    if (this.hasAny(["private pool", "piscina privada", "exclusiva"]) && this.hasTag("suite")) {
      this.addConfidence("private_pool", 92, "piscina privada para suite detectada")
    }
    if (this.hasAny(["vip access", "acceso vip", "exclusivo", "membresía"])) {
      this.addConfidence("vip_access", 88, "acceso VIP detectado")
    }
    if (this.hasAny(["concierge", "conserje", "servicio 24h"])) {
      this.addConfidence("premium", 85, "servicio de conserjería detectado")
    }
  }
  
  // ============================================================
  // 🧠 MÉTODOS AUXILIARES
  // ============================================================
  
  private hasTag(tag: string): boolean {
    return this.tags.some(t => 
      t === tag || 
      t.includes(` ${tag} `) || 
      t.startsWith(`${tag} `) || 
      t.endsWith(` ${tag}`)
    )
  }
  
  private hasAny(tags: string[]): boolean {
    return tags.some(tag => this.hasTag(tag))
  }
  
  private addConfidence(amenityId: string, points: number, reason: string) {
    const current = this.confidenceScores.get(amenityId) || 0
    const newScore = Math.max(0, current + points)
    this.confidenceScores.set(amenityId, newScore)
    
    if (points > 0) {
      const synonyms = this.SYNONYMS[amenityId] || []
      const matchingSynonyms = synonyms.filter(s => 
        this.tags.includes(s.toLowerCase().trim())
      )
      
      if (matchingSynonyms.length > 0) {
        const set = this.indicatorsUsed.get(amenityId) || new Set()
        matchingSynonyms.forEach(syn => set.add(syn))
        this.indicatorsUsed.set(amenityId, set)
      }
    }
  }
  
  private removeConfidence(amenityId: string, points: number, reason: string) {
    const current = this.confidenceScores.get(amenityId) || 0
    const newScore = Math.max(0, current - points)
    this.confidenceScores.set(amenityId, newScore)
  }
  
  // ============================================================
  // 🚀 EJECUCIÓN PRINCIPAL
  // ============================================================
  
  public extract(): AmenitiesExtraction {
    this.extractPoolAmenities()
    this.extractWellnessAmenities()
    this.extractDiningAmenities()
    this.extractRoomAmenities()
    this.extractBathroomAmenities()
    this.extractOutdoorAmenities()
    this.extractCommonAreasAmenities()
    this.extractBusinessAmenities()
    this.extractFamilyAmenities()
    this.extractAccessibilityAmenities()
    this.extractSustainabilityAmenities()
    this.extractViewAmenities()
    this.extractAtmosphereAmenities()
    this.extractPremiumAmenities()
    
    this.buildAmenitiesList()
    
    const byCategory: Record<AmenityCategory, Amenity[]> = {
      pool: [], wellness: [], dining: [], room: [], bathroom: [], outdoor: [],
      common_areas: [], business: [], family: [], accessibility: [], sustainability: [],
      views: [], atmosphere: [], premium: []
    }
    
    this.amenities.forEach(amenity => {
      const cat = this.getCategoryForAmenity(amenity.id)
      if (byCategory[cat]) {
        byCategory[cat].push(amenity)
      }
    })
    
    const premium = this.amenities
      .filter(a => a.isPremium || a.confidence === "high")
      .sort((a, b) => 
        (b.confidence === "high" ? 1 : 0) - (a.confidence === "high" ? 1 : 0) ||
        b.id.localeCompare(a.id)
      )
      .slice(0, 8)
    
    const flat = this.amenities
      .map(a => a.id)
      .filter((value, index, self) => self.indexOf(value) === index)
    
    const hasPool = this.amenities.some(a => a.category === "pool")
    const hasSpa = this.amenities.some(a => a.category === "wellness" && a.id === "spa")
    const hasRestaurant = this.amenities.some(a => a.category === "dining" && a.id === "restaurant")
    const hasBar = this.amenities.some(a => a.category === "dining" && a.id.includes("bar"))
    const hasSeaView = this.amenities.some(a => a.category === "views" && a.id === "sea_view")
    const isLuxury = this.amenities.some(a => a.category === "atmosphere" && a.id === "luxury")
    const isBoutique = this.amenities.some(a => a.category === "atmosphere" && a.id === "boutique")
    const isFamilyFriendly = this.amenities.some(a => a.category === "family")
    const isBusinessReady = this.amenities.some(a => a.category === "business")
    const isWellnessOriented = hasSpa || this.amenities.some(a => 
      a.category === "wellness" && ["sauna", "steam_room", "gym"].includes(a.id)
    )
    
    const avgConfidence = this.amenities.length > 0
      ? Math.round(this.amenities.reduce((sum, a) => 
          sum + (a.confidence === "high" ? 90 : a.confidence === "medium" ? 70 : 50)
        , 0) / this.amenities.length)
      : 40
    
    // ✅ CORRECCIÓN: Incluir 'amenities' en el objeto retornado
    return {
      amenities: this.amenities,  // ✅ AÑADIDO: para que searchAmenities funcione
      byCategory,
      premium,
      flat,
      hasPool,
      hasSpa,
      hasRestaurant,
      hasBar,
      hasSeaView,
      isLuxury,
      isBoutique,
      isFamilyFriendly,
      isBusinessReady,
      isWellnessOriented,
      confidenceOverall: avgConfidence,
      tagsAnalyzed: this.tags.length,
      processingTimeMs: 0
    }
  }
  
  private buildAmenitiesList() {
    this.amenities = []
    
    for (const [amenityId, score] of this.confidenceScores.entries()) {
      if (score >= 60) {
        const confidence = score >= 85 ? "high" : score >= 70 ? "medium" : "low"
        const indicators = Array.from(this.indicatorsUsed.get(amenityId) || [])
        
        const isPremium = [
          "infinity_pool", "presidential_suite", "private_pool", "butler_service",
          "beach_access", "panoramic_view", "rooftop_bar", "botanical_garden",
          "luxury", "boutique"
        ].includes(amenityId) || score >= 90
        
        this.amenities.push({
          id: amenityId,
          name: this.getHumanName(amenityId),
          category: this.getCategoryForAmenity(amenityId),
          confidence,
          indicators,
          isPremium
        })
      }
    }
    
    this.removeRedundancies()
  }
  
  private removeRedundancies() {
    const toRemove: Set<string> = new Set()
    
    if (this.amenities.some(a => a.id === "infinity_pool")) toRemove.add("pool")
    if (this.amenities.some(a => a.id === "presidential_suite")) toRemove.add("suite")
    if (this.amenities.some(a => a.id === "indoor_pool") && !this.amenities.some(a => a.id === "infinity_pool")) {
      toRemove.add("pool")
    }
    if (this.amenities.some(a => a.id === "rooftop_bar")) toRemove.add("bar")
    if (this.amenities.some(a => a.id === "pool_bar") && !this.amenities.some(a => a.id === "rooftop_bar")) {
      toRemove.add("bar")
    }
    
    this.amenities = this.amenities.filter(a => !toRemove.has(a.id))
  }
  
  private getCategoryForAmenity(amenityId: string): AmenityCategory {
    const mapping: Record<string, AmenityCategory> = {
      "pool": "pool", "infinity_pool": "pool", "indoor_pool": "pool", "heated_pool": "pool",
      "kids_pool": "pool", "jacuzzi": "pool", "pool_bar": "pool",
      "spa": "wellness", "sauna": "wellness", "steam_room": "wellness", "massage": "wellness",
      "gym": "wellness", "yoga": "wellness",
      "restaurant": "dining", "buffet": "dining", "bar": "dining", "rooftop_bar": "dining",
      "beach_bar": "dining", "cafe": "dining", "dining_area": "dining",
      "room": "room", "suite": "room", "presidential_suite": "room", "king_bed": "room",
      "queen_bed": "room", "twin_beds": "room", "balcony": "room", "terrace": "room",
      "bathroom": "bathroom", "bathtub": "bathroom", "rain_shower": "bathroom", "double_vanity": "bathroom",
      "garden": "outdoor", "botanical_garden": "outdoor", "beach_access": "outdoor",
      "mountain_view": "outdoor", "courtyard": "outdoor",
      "lobby": "common_areas", "lounge": "common_areas", "library": "common_areas", "fireplace": "common_areas",
      "conference_room": "business", "business_center": "business", "av_equipment": "business",
      "kids_club": "family", "playground": "family", "babysitting": "family",
      "wheelchair_accessible": "accessibility", "adapted_bathroom": "accessibility",
      "eco_certified": "sustainability", "solar_panels": "sustainability",
      "sea_view": "views", "city_view": "views", "panoramic_view": "views", "garden_view": "views",
      "luxury": "atmosphere", "boutique": "atmosphere", "modern": "atmosphere", "rustic": "atmosphere",
      "mediterranean": "atmosphere", "cozy": "atmosphere", "romantic": "atmosphere",
      "butler_service": "premium", "private_pool": "premium", "vip_access": "premium"
    }
    return mapping[amenityId] || "atmosphere"
  }
  
  private getHumanName(amenityId: string): string {
    const names: Record<string, string> = {
      "pool": "Piscina", "infinity_pool": "Piscina infinita", "indoor_pool": "Piscina cubierta",
      "heated_pool": "Piscina climatizada", "kids_pool": "Piscina infantil", "jacuzzi": "Jacuzzi",
      "pool_bar": "Bar de piscina", "spa": "Spa", "sauna": "Sauna", "steam_room": "Baño de vapor",
      "massage": "Masajes", "gym": "Gimnasio", "yoga": "Sala de yoga", "restaurant": "Restaurante",
      "buffet": "Zona de buffet", "bar": "Bar", "rooftop_bar": "Bar en azotea", "beach_bar": "Chiringuito",
      "cafe": "Cafetería", "dining_area": "Zona de desayuno", "room": "Habitación", "suite": "Suite",
      "presidential_suite": "Suite presidencial", "king_bed": "Cama king size", "queen_bed": "Cama queen size",
      "twin_beds": "Dos camas", "balcony": "Balcón privado", "terrace": "Terraza", "bathroom": "Baño privado",
      "bathtub": "Bañera", "rain_shower": "Ducha de lluvia", "double_vanity": "Doble lavabo",
      "garden": "Jardín", "botanical_garden": "Jardín botánico", "beach_access": "Acceso a playa",
      "mountain_view": "Vistas a montaña", "courtyard": "Patio interior", "lobby": "Lobby",
      "lounge": "Salón de estar", "library": "Biblioteca", "fireplace": "Chimenea",
      "conference_room": "Sala de conferencias", "business_center": "Centro de negocios",
      "av_equipment": "Equipo audiovisual", "kids_club": "Club infantil", "playground": "Zona de juegos",
      "babysitting": "Servicio de canguro", "wheelchair_accessible": "Accesible para silla de ruedas",
      "adapted_bathroom": "Baño adaptado", "eco_certified": "Certificación ecológica",
      "solar_panels": "Paneles solares", "sea_view": "Vistas al mar", "city_view": "Vistas a la ciudad",
      "panoramic_view": "Vistas panorámicas", "garden_view": "Vistas al jardín", "luxury": "Lujo",
      "boutique": "Estilo boutique", "modern": "Diseño moderno", "rustic": "Estilo rústico",
      "mediterranean": "Estilo mediterráneo", "cozy": "Ambiente acogedor", "romantic": "Ambiente romántico",
      "butler_service": "Servicio de mayordomo", "private_pool": "Piscina privada", "vip_access": "Acceso VIP"
    }
    return names[amenityId] || amenityId.replace(/_/g, " ")
  }
}

// ============================================================
// 🧪 UTILIDADES DE SOPORTE
// ============================================================

export function extractAmenitiesSimple(tags: string[]): string[] {
  const extraction = extractAmenities(tags)
  return extraction.flat
}

export function generateAmenityBadges(extraction: AmenitiesExtraction): {
  id: string
  label: string
  color: "blue" | "green" | "amber" | "rose" | "indigo" | "emerald"
  priority: number
}[] {
  const BADGE_CONFIG: Record<string, { color: string; priority: number }> = {
    "infinity_pool": { color: "amber", priority: 100 },
    "presidential_suite": { color: "rose", priority: 95 },
    "private_pool": { color: "amber", priority: 90 },
    "beach_access": { color: "emerald", priority: 88 },
    "panoramic_view": { color: "indigo", priority: 87 },
    "rooftop_bar": { color: "violet", priority: 85 },
    "butler_service": { color: "rose", priority: 84 },
    "spa": { color: "indigo", priority: 80 },
    "sauna": { color: "amber", priority: 78 },
    "steam_room": { color: "amber", priority: 77 },
    "gym": { color: "blue", priority: 75 },
    "restaurant": { color: "emerald", priority: 73 },
    "pool_bar": { color: "sky", priority: 70 },
    "sea_view": { color: "sky", priority: 68 },
    "mountain_view": { color: "green", priority: 66 },
    "luxury": { color: "gold", priority: 65 },
    "boutique": { color: "purple", priority: 64 },
    "kids_club": { color: "pink", priority: 60 },
    "pool": { color: "sky", priority: 55 },
    "suite": { color: "purple", priority: 54 },
    "bar": { color: "amber", priority: 52 },
    "garden": { color: "green", priority: 50 },
    "lobby": { color: "gray", priority: 45 }
  }
  
  return extraction.premium.map(amenity => {
    const config = BADGE_CONFIG[amenity.id] || { color: "gray", priority: 30 }
    return {
      id: amenity.id,
      label: amenity.name,
      color: config.color as any,
      priority: config.priority
    }
  }).sort((a, b) => b.priority - a.priority).slice(0, 6)
}

export function searchAmenities(extraction: AmenitiesExtraction, query: string): Amenity[] {
  const q = query.toLowerCase().trim()
  // ✅ Ahora funciona porque 'amenities' está en la interfaz
  return extraction.amenities?.filter(amenity => 
    amenity.id.includes(q) || 
    amenity.name.toLowerCase().includes(q) ||
    amenity.category.includes(q)
  ) || []
}