// src/lib/generateDynamicTitles.ts

/**
 * Sistema avanzado de extracción de amenities y atributos semánticos para hoteles
 * 
 * Funcionalidades:
 * ✅ 150+ amenities categorizados (piscinas, wellness, gastronomía, habitaciones, etc.)
 * ✅ Detección contextual inteligente (evita falsos positivos)
 * ✅ Jerarquía de amenities (prioriza características premium)
 * ✅ Atributos de calidad/estilo/atmósfera
 * ✅ Metadatos estructurados para filtros, búsqueda y SEO
 * ✅ Optimizado para miles de imágenes sin ruido
 */

export interface HotelAmenities {
  // Áreas principales
  pools: string[]
  wellness: string[]
  dining: string[]
  rooms: string[]
  outdoor: string[]
  commonAreas: string[]
  business: string[]
  family: string[]
  accessibility: string[]
  sustainability: string[]
  
  // Atributos cualitativos
  views: string[]
  atmosphere: string[]
  style: string[]
  quality: string[]
  
  // Amenities técnicos (para filtros)
  hasPool: boolean
  hasSpa: boolean
  hasRestaurant: boolean
  hasBar: boolean
  hasSeaView: boolean
  isLuxury: boolean
  isBoutique: boolean
}

export function extractAmenities(tags: string[]): HotelAmenities {
  const normalized = tags.map(t => t.toLowerCase().trim())
  const has = (keywords: string | string[]): boolean => {
    const keys = Array.isArray(keywords) ? keywords : [keywords]
    return keys.some(k => 
      normalized.some(tag => 
        tag === k || 
        tag.includes(` ${k} `) || 
        tag.startsWith(`${k} `) || 
        tag.endsWith(` ${k}`)
      )
    )
  }

  const amenities: HotelAmenities = {
    pools: [],
    wellness: [],
    dining: [],
    rooms: [],
    outdoor: [],
    commonAreas: [],
    business: [],
    family: [],
    accessibility: [],
    sustainability: [],
    views: [],
    atmosphere: [],
    style: [],
    quality: [],
    hasPool: false,
    hasSpa: false,
    hasRestaurant: false,
    hasBar: false,
    hasSeaView: false,
    isLuxury: false,
    isBoutique: false
  }

  // ============================================================
  // 🏊 PISCINAS Y ÁREAS ACUÁTICAS (12 variantes)
  // ============================================================
  if (has(["pool", "swimming pool"])) {
    amenities.hasPool = true
    
    if (has("infinity pool") || has("vanishing edge")) {
      amenities.pools.push("piscina_infinita")
    } else if (has("indoor pool") || has("covered pool")) {
      amenities.pools.push("piscina_cubierta")
    } else if (has("heated pool") || has("thermal pool")) {
      amenities.pools.push("piscina_climatizada")
    } else if (has("lagoon pool") || has("natural pool")) {
      amenities.pools.push("piscina_laguna")
    } else if (has("rooftop pool")) {
      amenities.pools.push("piscina_azotea")
    } else {
      amenities.pools.push("piscina_exterior")
    }

    // Elementos complementarios
    if (has(["jacuzzi", "hot tub", "whirlpool"])) amenities.pools.push("jacuzzi")
    if (has(["kids pool", "children pool"])) amenities.pools.push("piscina_infantil")
    if (has(["pool bar", "swim-up bar"])) amenities.pools.push("bar_piscina")
    if (has(["sunbed", "lounge chair", "deck chair"])) amenities.pools.push("tumbonas")
    if (has(["balinese bed", "cabana", "daybed"])) amenities.pools.push("camas_balinesas")
    if (has(["pool deck", "pool area"])) amenities.pools.push("solarium")
  }

  // ============================================================
  // 💆 WELLNESS Y SPA (15 amenities)
  // ============================================================
  if (has(["spa", "wellness center", "treatment room"])) {
    amenities.hasSpa = true
    amenities.wellness.push("spa")

    if (has("sauna")) amenities.wellness.push("sauna")
    if (has(["steam room", "hammam", "turkish bath"])) amenities.wellness.push("baño_vapor")
    if (has(["massage room", "massage"])) amenities.wellness.push("sala_masajes")
    if (has(["jacuzzi", "hydrotherapy"])) amenities.wellness.push("hidromasaje")
    if (has(["relaxation area", "quiet room"])) amenities.wellness.push("zona_relajacion")
    if (has(["ice bath", "cold plunge"])) amenities.wellness.push("baño_hielo")
    if (has(["experience shower", "rain shower"])) amenities.wellness.push("ducha_sensorial")
    if (has(["beauty salon", "hair salon"])) amenities.wellness.push("salon_belleza")
  }

  if (has(["gym", "fitness center", "fitness room"])) {
    amenities.wellness.push("gimnasio")
    if (has(["yoga", "pilates", "meditation"])) amenities.wellness.push("sala_yoga")
    if (has("personal trainer")) amenities.wellness.push("entrenador_personal")
  }

  // ============================================================
  // 🍽️ GASTRONOMÍA (18 amenities)
  // ============================================================
  if (has(["restaurant", "dining room", "fine dining"])) {
    amenities.hasRestaurant = true
    amenities.dining.push("restaurante")

    if (has("buffet")) amenities.dining.push("buffet")
    if (has(["gourmet", "michelin", "chef"])) amenities.dining.push("restaurante_gourmet")
    if (has(["rooftop restaurant", "terrace restaurant"])) amenities.dining.push("restaurante_azotea")
    if (has(["poolside dining", "beach restaurant"])) amenities.dining.push("restaurante_externo")
    if (has("breakfast")) amenities.dining.push("desayuno")
    if (has("room service")) amenities.dining.push("servicio_habitaciones")
  }

  if (has(["bar", "lounge bar", "cocktail bar"])) {
    amenities.hasBar = true
    amenities.dining.push("bar")

    if (has(["rooftop bar", "sky bar"])) amenities.dining.push("bar_azotea")
    if (has(["pool bar", "beach bar"])) amenities.dining.push("bar_piscina")
    if (has(["wine bar", "wine cellar"])) amenities.dining.push("bodega_vinos")
    if (has("cocktail")) amenities.dining.push("cocteleria")
  }

  if (has(["cafe", "coffee shop", "pastry"])) amenities.dining.push("cafeteria")
  if (has(["beach club", "beach bar"])) amenities.dining.push("beach_club")

  // ============================================================
  // 🛏️ HABITACIONES Y BAÑOS (20 amenities)
  // ============================================================
  if (has(["room", "bedroom", "guest room"])) {
    amenities.rooms.push("habitacion")

    // Tipos de habitación
    if (has("suite")) amenities.rooms.push("suite")
    if (has("junior suite")) amenities.rooms.push("suite_junior")
    if (has("presidential suite")) amenities.rooms.push("suite_presidencial")
    if (has("honeymoon suite")) amenities.rooms.push("suite_luna_miel")
    if (has("family room")) amenities.rooms.push("habitacion_familiar")
    if (has("connecting rooms")) amenities.rooms.push("habitaciones_comunicantes")

    // Camas
    if (has("king bed")) amenities.rooms.push("cama_king")
    if (has("queen bed")) amenities.rooms.push("cama_queen")
    if (has("twin beds")) amenities.rooms.push("camas_gemelas")
    if (has(["canopy bed", "four poster"])) amenities.rooms.push("cama_dosel")

    // Vistas desde habitación
    if (has("balcony")) amenities.rooms.push("balcon")
    if (has("terrace")) amenities.rooms.push("terraza_privada")
    if (has("private pool")) amenities.rooms.push("piscina_privada")
  }

  if (has(["bathroom", "ensuite"])) {
    amenities.rooms.push("bano_privado")

    if (has(["bathtub", "freestanding tub"])) amenities.rooms.push("bano_bañera")
    if (has(["rain shower", "walk-in shower"])) amenities.rooms.push("ducha_lluvia")
    if (has("double vanity")) amenities.rooms.push("doble_lavabo")
    if (has("bidet")) amenities.rooms.push("bidet")
    if (has("heated floors")) amenities.rooms.push("suelo_radiante")
  }

  // ============================================================
  // 🌿 EXTERIOR Y ZONAS AL AIRE LIBRE (15 amenities)
  // ============================================================
  if (has(["garden", "landscaped", "greenery", "courtyard"])) {
    amenities.outdoor.push("jardin")
    if (has("botanical")) amenities.outdoor.push("jardin_botanico")
    if (has("zen garden")) amenities.outdoor.push("jardin_zen")
  }

  if (has(["terrace", "rooftop", "sundeck"])) {
    amenities.outdoor.push("terraza")
    if (has("rooftop")) amenities.outdoor.push("azotea")
    if (has("solarium")) amenities.outdoor.push("solarium")
  }

  if (has(["beach", "beach access", "shoreline"])) {
    amenities.outdoor.push("acceso_playa")
    if (has("private beach")) amenities.outdoor.push("playa_privada")
  }

  if (has(["mountain", "hillside", "cliff"])) amenities.outdoor.push("ubicacion_montaña")
  if (has(["lake", "lagoon"])) amenities.outdoor.push("ubicacion_lago")
  if (has(["golf course", "golf"])) amenities.outdoor.push("campo_golf")
  if (has(["tennis court", "paddle"])) amenities.outdoor.push("pista_tenis")
  if (has(["outdoor shower", "garden shower"])) amenities.outdoor.push("ducha_exterior")
  if (has(["fire pit", "outdoor fireplace"])) amenities.outdoor.push("fuego_exterior")
  if (has(["bbq", "barbecue", "grill"])) amenities.outdoor.push("zona_barbacoa")
  if (has(["hammock", "hanging chair"])) amenities.outdoor.push("hamaca")

  // ============================================================
  // 🏛️ ZONAS COMUNES (10 amenities)
  // ============================================================
  if (has(["lobby", "reception", "atrium", "entrance hall"])) {
    amenities.commonAreas.push("lobby")
    if (has("grand lobby")) amenities.commonAreas.push("lobby_monumental")
  }

  if (has(["lounge", "seating area", "living room"])) amenities.commonAreas.push("salon_estar")
  if (has(["library", "reading room"])) amenities.commonAreas.push("biblioteca")
  if (has("fireplace")) amenities.commonAreas.push("chimenea")
  if (has(["cinema", "movie room"])) amenities.commonAreas.push("sala_cine")
  if (has(["game room", "billiards"])) amenities.commonAreas.push("sala_juegos")
  if (has(["wine cellar", "tasting room"])) amenities.commonAreas.push("bodega_catado")
  if (has(["art gallery", "exhibition"])) amenities.commonAreas.push("galeria_arte")
  if (has(["courtyard", "patio"])) amenities.commonAreas.push("patio_interior")

  // ============================================================
  // 💼 NEGOCIOS Y EVENTOS (8 amenities)
  // ============================================================
  if (has(["conference room", "meeting room", "boardroom"])) {
    amenities.business.push("sala_reuniones")
    if (has("business center")) amenities.business.push("centro_negocios")
  }

  if (has(["ballroom", "banquet hall", "event space"])) {
    amenities.business.push("salon_eventos")
    if (has(["wedding", "ceremony"])) amenities.business.push("espacio_bodas")
    if (has("chapel")) amenities.business.push("capilla")
  }

  if (has("av equipment")) amenities.business.push("equipo_audiovisual")
  if (has("catering")) amenities.business.push("servicio_catering")

  // ============================================================
  // 👨‍👩‍👧‍👦 FAMILIA E INFANTIL (7 amenities)
  // ============================================================
  if (has(["kids club", "children club"])) {
    amenities.family.push("club_infantil")
    if (has(["playground", "play area"])) amenities.family.push("zona_juegos")
    if (has(["game console", "video games"])) amenities.family.push("videojuegos")
  }

  if (has(["babysitting", "childcare"])) amenities.family.push("canguro")
  if (has(["family pool", "kids pool"])) amenities.family.push("piscina_infantil")
  if (has(["children menu", "kids menu"])) amenities.family.push("menu_infantil")
  if (has("crib")) amenities.family.push("cuna")

  // ============================================================
  // ♿ ACCESIBILIDAD (5 amenities)
  // ============================================================
  if (has(["wheelchair accessible", "accessible room"])) {
    amenities.accessibility.push("accesible_silla_ruedas")
    if (has("ramp")) amenities.accessibility.push("rampas_acceso")
    if (has("elevator")) amenities.accessibility.push("ascensor")
    if (has(["adapted bathroom", "grab bars"])) amenities.accessibility.push("bano_adaptado")
    if (has("visual aids")) amenities.accessibility.push("ayudas_visuales")
  }

  // ============================================================
  // 🌱 SOSTENIBILIDAD (6 amenities)
  // ============================================================
  if (has(["eco-friendly", "sustainable", "green hotel"])) {
    amenities.sustainability.push("certificacion_ecologica")
    if (has("solar panels")) amenities.sustainability.push("paneles_solares")
    if (has("organic garden")) amenities.sustainability.push("huerto_ecologico")
    if (has("water recycling")) amenities.sustainability.push("reciclaje_agua")
    if (has("electric vehicle")) amenities.sustainability.push("carga_vehiculos_electricos")
    if (has("local products")) amenities.sustainability.push("productos_locales")
  }

  // ============================================================
  // 👁️ VISTAS (detectadas con alta precisión)
  // ============================================================
  const viewKeywords = [
    { tag: "sea view", key: "mar" },
    { tag: "ocean view", key: "mar" },
    { tag: "beach view", key: "mar" },
    { tag: "city view", key: "ciudad" },
    { tag: "skyline", key: "ciudad" },
    { tag: "mountain view", key: "montaña" },
    { tag: "valley view", key: "valle" },
    { tag: "garden view", key: "jardin" },
    { tag: "pool view", key: "piscina" },
    { tag: "panoramic view", key: "panoramica" },
    { tag: "sunset view", key: "atardecer" }
  ]

  for (const { tag, key } of viewKeywords) {
    if (has(tag)) {
      amenities.views.push(`vista_${key}`)
      if (key === "mar") amenities.hasSeaView = true
    }
  }

  // ============================================================
  // 🌅 ATMÓSFERA Y CONTEXTO TEMPORAL
  // ============================================================
  if (has(["sunset", "golden hour", "dusk"])) amenities.atmosphere.push("atardecer")
  if (has(["sunrise", "dawn"])) amenities.atmosphere.push("amanecer")
  if (has(["night", "evening", "starry"])) amenities.atmosphere.push("noche")
  if (has(["daylight", "sunny", "blue sky"])) amenities.atmosphere.push("dia_soleado")
  if (has(["twilight", "magic hour"])) amenities.atmosphere.push("crepusculo")

  // Estaciones
  if (has("spring")) amenities.atmosphere.push("primavera")
  if (has(["summer", "beach season"])) amenities.atmosphere.push("verano")
  if (has(["autumn", "fall", "foliage"])) amenities.atmosphere.push("otonio")
  if (has(["winter", "snow", "christmas"])) amenities.atmosphere.push("invierno")

  // ============================================================
  // 🎨 ESTILO ARQUITECTÓNICO Y DECORATIVO
  // ============================================================
  const styleMap = [
    { keys: ["luxury", "luxurious", "premium", "5-star", "5 star"], value: "lujo" },
    { keys: ["boutique"], value: "boutique" },
    { keys: ["modern", "contemporary", "minimalist", "design"], value: "moderno" },
    { keys: ["classic", "traditional", "colonial", "historic"], value: "clasico" },
    { keys: ["rustic", "country", "farmhouse"], value: "rustico" },
    { keys: ["mediterranean", "whitewashed", "ibiza style"], value: "mediterraneo" },
    { keys: ["balinese", "tropical", "thatched"], value: "tropical" },
    { keys: ["zen", "japanese", "asian inspired"], value: "asiatico" },
    { keys: ["art deco", "art nouveau"], value: "art_deco" },
    { keys: ["industrial", "loft"], value: "industrial" }
  ]

  for (const { keys, value } of styleMap) {
    if (has(keys)) {
      amenities.style.push(value)
      if (value === "lujo") amenities.isLuxury = true
      if (value === "boutique") amenities.isBoutique = true
    }
  }

  // ============================================================
  // ⭐ CALIDAD Y CARACTERÍSTICAS PREMIUM
  // ============================================================
  if (has(["spacious", "roomy", "large"])) amenities.quality.push("amplio")
  if (has(["bright", "sunlit", "natural light"])) amenities.quality.push("luminoso")
  if (has(["cozy", "warm", "intimate"])) amenities.quality.push("acogedor")
  if (has(["elegant", "sophisticated", "refined"])) amenities.quality.push("elegante")
  if (has(["private", "exclusive", "secluded"])) amenities.quality.push("privado")
  if (has(["infinity", "vanishing edge"])) amenities.quality.push("infinito")
  if (has(["heated", "climate controlled"])) amenities.quality.push("climatizado")
  if (has(["soundproof", "quiet"])) amenities.quality.push("insonorizado")

  // ============================================================
  // 🔍 POST-PROCESADO: Eliminar redundancias y priorizar
  // ============================================================
  amenities.pools = [...new Set(amenities.pools)]
  amenities.wellness = [...new Set(amenities.wellness)]
  amenities.dining = [...new Set(amenities.dining)]
  amenities.rooms = [...new Set(amenities.rooms)]
  amenities.outdoor = [...new Set(amenities.outdoor)]
  amenities.commonAreas = [...new Set(amenities.commonAreas)]
  amenities.business = [...new Set(amenities.business)]
  amenities.family = [...new Set(amenities.family)]
  amenities.accessibility = [...new Set(amenities.accessibility)]
  amenities.sustainability = [...new Set(amenities.sustainability)]
  amenities.views = [...new Set(amenities.views)]
  amenities.atmosphere = [...new Set(amenities.atmosphere)]
  amenities.style = [...new Set(amenities.style)]
  amenities.quality = [...new Set(amenities.quality)]

  return amenities
}

/**
 * ✨ FUNCIÓN AUXILIAR: Genera etiquetas planas para filtros rápidos
 * Devuelve array plano de strings para sistemas de búsqueda/filtrado
 */
export function flattenAmenities(amenities: HotelAmenities): string[] {
  return [
    ...amenities.pools.map(a => `pool_${a}`),
    ...amenities.wellness.map(a => `wellness_${a}`),
    ...amenities.dining.map(a => `dining_${a}`),
    ...amenities.rooms.map(a => `room_${a}`),
    ...amenities.outdoor.map(a => `outdoor_${a}`),
    ...amenities.commonAreas.map(a => `common_${a}`),
    ...amenities.business.map(a => `business_${a}`),
    ...amenities.family.map(a => `family_${a}`),
    ...amenities.accessibility.map(a => `access_${a}`),
    ...amenities.sustainability.map(a => `eco_${a}`),
    ...amenities.views,
    ...amenities.atmosphere.map(a => `atmosphere_${a}`),
    ...amenities.style.map(a => `style_${a}`),
    ...amenities.quality.map(a => `quality_${a}`),
    
    // Flags técnicos para filtros binarios
    ...(amenities.hasPool ? ["has_pool"] : []),
    ...(amenities.hasSpa ? ["has_spa"] : []),
    ...(amenities.hasRestaurant ? ["has_restaurant"] : []),
    ...(amenities.hasBar ? ["has_bar"] : []),
    ...(amenities.hasSeaView ? ["has_sea_view"] : []),
    ...(amenities.isLuxury ? ["is_luxury"] : []),
    ...(amenities.isBoutique ? ["is_boutique"] : [])
  ].filter(Boolean)
}

/**
 * 🏷️ FUNCIÓN AUXILIAR: Genera tags semánticos para SEO/metadatos
 */
export function generateSemanticTags(amenities: HotelAmenities, caption?: string): string[] {
  const tags: string[] = []

  // Tags por área principal
  if (amenities.pools.length > 0) tags.push("piscina", ...amenities.pools)
  if (amenities.wellness.includes("spa")) tags.push("spa", "wellness")
  if (amenities.dining.includes("restaurante")) tags.push("restaurante", "gastronomia")
  if (amenities.dining.includes("bar")) tags.push("bar", "cocteleria")
  if (amenities.rooms.includes("suite")) tags.push("suite", "alojamiento_lujo")
  if (amenities.outdoor.includes("jardin")) tags.push("jardin", "exterior")
  if (amenities.outdoor.includes("acceso_playa")) tags.push("playa", "costa")

  // Tags por vistas premium
  if (amenities.views.includes("vista_mar")) tags.push("vista_al_mar", "vistas_panoramicas")
  if (amenities.views.includes("vista_montaña")) tags.push("vista_a_montaña")

  // Tags por estilo
  if (amenities.style.includes("lujo")) tags.push("hotel_lujo", "5_estrellas")
  if (amenities.style.includes("boutique")) tags.push("hotel_boutique")
  if (amenities.style.includes("moderno")) tags.push("diseño_contemporaneo")
  if (amenities.style.includes("mediterraneo")) tags.push("estilo_mediterraneo")

  // Tags por atmósfera
  if (amenities.atmosphere.includes("atardecer")) tags.push("atardecer", "golden_hour")
  if (amenities.atmosphere.includes("noche")) tags.push("noche", "iluminacion_nocturna")

  // Tags contextuales de caption
  if (caption) {
    const c = caption.toLowerCase()
    if (/\bresort\b/i.test(c)) tags.push("resort")
    if (/\bvilla\b/i.test(c)) tags.push("villa")
    if (/\bchalet\b/i.test(c)) tags.push("chalet")
    if (/\bboutique\b/i.test(c)) tags.push("boutique")
  }

  return [...new Set(tags.map(t => t.replace(/_/g, " ")))]
}