module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/querystring [external] (querystring, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("querystring", () => require("querystring"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[project]/src/lib/detectCategoryVision.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/lib/detectCategoryVision.ts - Versión 4.0.2 ROBUSTA (CORREGIDA)
__turbopack_context__.s([
    "analyzeGalleryCategories",
    ()=>analyzeGalleryCategories,
    "detectCategoryVision",
    ()=>detectCategoryVision,
    "detectCategoryWithTrace",
    ()=>detectCategoryWithTrace,
    "detectSimpleCategory",
    ()=>detectSimpleCategory,
    "getCategoryLabel",
    ()=>getCategoryLabel,
    "inferLocationFromTags",
    ()=>inferLocationFromTags
]);
function detectCategoryVision(tags, options) {
    const normalized = tags.map((t)=>t.toLowerCase().trim());
    const has = (keywords)=>{
        const keys = Array.isArray(keywords) ? keywords : [
            keywords
        ];
        return keys.some((k)=>normalized.includes(k.toLowerCase().trim()));
    };
    // ✅ PRIORIDAD 1: BACKEND con validación ESTRICTA
    const minConfidence = options?.minBackendConfidence ?? 0.75;
    if (options?.backendCategoria && options?.backendUbicacion) {
        const validation = validateBackendDecision({
            backendCategoria: options.backendCategoria,
            backendUbicacion: options.backendUbicacion,
            tags: normalized,
            tagsConfidence: options.tagsConfidence,
            captionContext: options.captionContext
        });
        // ✅ FORZAR INTERIOR para categorías que siempre son interiores
        const alwaysInterior = [
            'restaurante',
            'bar',
            'lobby',
            'gimnasio',
            'bano',
            'habitacion',
            'spa'
        ];
        const forcedUbicacion = alwaysInterior.includes(options.backendCategoria) && options.backendUbicacion === 'exterior' ? 'interior' : options.backendUbicacion;
        if (validation.isValid && validation.confidence >= minConfidence) {
            return {
                primary: mapBackendCategoria(options.backendCategoria),
                // ✅ CORREGIDO: Secondary solo con categorías relacionadas válidas
                secondary: buildSecondaryCategories(options.backendCategoria, normalized),
                confidence: validation.confidence >= 0.8 ? "high" : validation.confidence >= 0.75 ? "medium" : "low",
                reasoning: [
                    `backend ensemble: ${validation.reason}`
                ],
                tagsUsed: tags.slice(0, 5),
                source: 'backend_ensemble',
                metadata: {
                    backendConfidence: validation.confidence,
                    validationScore: validation.score,
                    locationType: forcedUbicacion // ✅ Ubicación separada
                }
            };
        }
    }
    // ✅ PRIORIDAD 2: LÓGICA LOCAL con reglas MEJORADAS
    // REGLA 1: Restaurante/buffet → INTERIOR (máxima prioridad)
    if (has([
        "restaurant",
        "buffet",
        "bufet",
        "dining_room"
    ]) || has("dining_table") && has("chair")) {
        return {
            primary: "restaurant",
            // ✅ CORREGIDO: Secondary con categorías relacionadas, no ubicación
            secondary: buildSecondaryCategoriesLocal("restaurante", normalized),
            confidence: "high",
            reasoning: [
                "restaurante detectado → interior"
            ],
            tagsUsed: tags.slice(0, 5),
            source: 'frontend_inference',
            metadata: {
                locationType: 'interior'
            } // ✅ Ubicación en metadata
        };
    }
    // REGLA 2: Bar con mobiliario → INTERIOR
    if (has("bar") && (has("chair") || has("table") || has("counter"))) {
        return {
            primary: "bar",
            secondary: buildSecondaryCategoriesLocal("bar", normalized),
            confidence: "high",
            reasoning: [
                "bar con mobiliario → interior"
            ],
            tagsUsed: tags.slice(0, 5),
            source: 'frontend_inference',
            metadata: {
                locationType: 'interior'
            }
        };
    }
    // REGLA 3: Lobby/recepción → INTERIOR
    if (has([
        "lobby",
        "reception",
        "check-in",
        "atrium"
    ])) {
        return {
            primary: "lobby",
            secondary: buildSecondaryCategoriesLocal("lobby", normalized),
            confidence: "high",
            reasoning: [
                "lobby detectado → interior"
            ],
            tagsUsed: tags.slice(0, 5),
            source: 'frontend_inference',
            metadata: {
                locationType: 'interior'
            }
        };
    }
    // REGLA 4: Habitación → INTERIOR
    if (has([
        "room",
        "bedroom",
        "suite",
        "bed"
    ]) || has([
        "king_bed",
        "queen_bed",
        "twin_beds"
    ])) {
        return {
            primary: has([
                "suite",
                "presidential"
            ]) ? "suite" : "room",
            secondary: buildSecondaryCategoriesLocal("habitacion", normalized),
            confidence: "high",
            reasoning: [
                "habitación detectada → interior"
            ],
            tagsUsed: tags.slice(0, 5),
            source: 'frontend_inference',
            metadata: {
                locationType: 'interior'
            }
        };
    }
    // REGLA 5: Baño → INTERIOR
    if (has([
        "bathroom",
        "baño",
        "shower",
        "bathtub"
    ])) {
        return {
            primary: "bathroom",
            secondary: buildSecondaryCategoriesLocal("bano", normalized),
            confidence: "high",
            reasoning: [
                "baño detectado → interior"
            ],
            tagsUsed: tags.slice(0, 5),
            source: 'frontend_inference',
            metadata: {
                locationType: 'interior'
            }
        };
    }
    // REGLA 6: Spa/gimnasio → INTERIOR
    if (has([
        "spa",
        "sauna",
        "massage",
        "gym",
        "fitness"
    ])) {
        return {
            primary: has([
                "gym",
                "fitness"
            ]) ? "gym" : "spa",
            secondary: buildSecondaryCategoriesLocal("spa", normalized),
            confidence: "high",
            reasoning: [
                "spa/gimnasio detectado → interior"
            ],
            tagsUsed: tags.slice(0, 5),
            source: 'frontend_inference',
            metadata: {
                locationType: 'interior'
            }
        };
    }
    // REGLA 7: Piscina infinita → EXTERIOR
    if (has("infinity_pool") || has("pool") && has([
        "vanishing",
        "edge",
        "horizon",
        "sea_view"
    ])) {
        return {
            primary: "infinity_pool",
            secondary: buildSecondaryCategoriesLocal("piscina", normalized),
            confidence: "high",
            reasoning: [
                "piscina infinita → exterior"
            ],
            tagsUsed: tags.slice(0, 5),
            source: 'frontend_inference',
            metadata: {
                locationType: 'exterior'
            }
        };
    }
    // REGLA 8: Piscina exterior (solo si hay indicadores claros de exterior)
    if (has("pool") && !has([
        "ceiling",
        "techo",
        "indoor",
        "chandelier"
    ]) && has([
        "exterior",
        "outdoor",
        "sky",
        "sun",
        "palm"
    ])) {
        return {
            primary: "pool",
            secondary: buildSecondaryCategoriesLocal("piscina", normalized),
            confidence: "high",
            reasoning: [
                "piscina con indicadores exteriores"
            ],
            tagsUsed: tags.slice(0, 5),
            source: 'frontend_inference',
            metadata: {
                locationType: 'exterior'
            }
        };
    }
    // REGLA 9: Playa → EXTERIOR
    if (has([
        "beach",
        "playa",
        "shoreline",
        "sand"
    ])) {
        return {
            primary: "beach",
            secondary: buildSecondaryCategoriesLocal("playa", normalized),
            confidence: "high",
            reasoning: [
                "playa detectada → exterior"
            ],
            tagsUsed: tags.slice(0, 5),
            source: 'frontend_inference',
            metadata: {
                locationType: 'exterior'
            }
        };
    }
    // REGLA 10: Fachada/exterior → EXTERIOR
    if (has([
        "facade",
        "fachada",
        "building exterior",
        "vista exterior"
    ])) {
        return {
            primary: "exterior",
            secondary: buildSecondaryCategoriesLocal("exterior", normalized),
            confidence: "high",
            reasoning: [
                "fachada detectada → exterior"
            ],
            tagsUsed: tags.slice(0, 5),
            source: 'frontend_inference',
            metadata: {
                locationType: 'exterior'
            }
        };
    }
    // REGLA 11: Jardín → EXTERIOR
    if (has([
        "garden",
        "jardin",
        "landscaped",
        "palm_tree"
    ])) {
        return {
            primary: "garden",
            secondary: buildSecondaryCategoriesLocal("exterior", normalized),
            confidence: "medium",
            reasoning: [
                "jardín detectado → exterior"
            ],
            tagsUsed: tags.slice(0, 5),
            source: 'frontend_inference',
            metadata: {
                locationType: 'exterior'
            }
        };
    }
    // FALLBACK: Sin categoría clara → asumir interior (más seguro)
    return {
        primary: "other",
        // ✅ CORREGIDO: Secondary vacío o con categorías inferidas, nunca ubicación
        secondary: [],
        confidence: "low",
        reasoning: [
            "fallback: sin categoría clara"
        ],
        tagsUsed: normalized.slice(0, 3),
        source: 'frontend_inference',
        metadata: {
            fallbackReason: "sin_categoria_clara",
            locationType: 'interior' // Default seguro
        }
    };
}
function validateBackendDecision(params) {
    const { backendCategoria, backendUbicacion, tags, tagsConfidence, captionContext } = params;
    const categoryKeywords = {
        piscina: [
            "pool",
            "piscina",
            "swimming",
            "jacuzzi"
        ],
        habitacion: [
            "room",
            "habitacion",
            "bedroom",
            "suite",
            "bed"
        ],
        bano: [
            "bathroom",
            "baño",
            "shower",
            "bathtub"
        ],
        restaurante: [
            "restaurant",
            "restaurante",
            "dining",
            "buffet",
            "bufet"
        ],
        bar: [
            "bar",
            "barra",
            "lounge",
            "cocktail"
        ],
        spa: [
            "spa",
            "wellness",
            "massage",
            "sauna"
        ],
        lobby: [
            "lobby",
            "reception",
            "hall",
            "atrium"
        ],
        exterior: [
            "exterior",
            "facade",
            "fachada",
            "building"
        ],
        playa: [
            "beach",
            "playa",
            "shoreline",
            "sand"
        ],
        gimnasio: [
            "gym",
            "gimnasio",
            "fitness"
        ]
    };
    const keywords = categoryKeywords[backendCategoria] || [];
    if (keywords.length === 0) return {
        isValid: false,
        confidence: 0,
        score: 0,
        reason: "categoria_desconocida",
        matchingTags: []
    };
    let maxScore = 0;
    const matchingTags = [];
    for (const keyword of keywords){
        const tagMatch = tags.find((t)=>t.includes(keyword) || keyword.includes(t));
        if (tagMatch) {
            const score = tagsConfidence?.[tagMatch] ?? 0.5;
            if (score > maxScore) {
                maxScore = score;
                matchingTags.push(tagMatch);
            }
        }
    }
    if (maxScore < 0.1) return {
        isValid: false,
        confidence: 0,
        score: 0,
        reason: "sin_tags_coincidentes",
        matchingTags: []
    };
    // ✅ VALIDACIÓN DE UBICACIÓN: Categorías que SIEMPRE son interior
    const alwaysInterior = [
        'restaurante',
        'bar',
        'lobby',
        'gimnasio',
        'bano',
        'habitacion',
        'spa'
    ];
    if (alwaysInterior.includes(backendCategoria) && backendUbicacion === 'exterior') {
        return {
            isValid: false,
            confidence: maxScore,
            score: maxScore,
            reason: `categoria ${backendCategoria} siempre es interior`,
            matchingTags
        };
    }
    const isValid = maxScore >= 0.4;
    return {
        isValid,
        confidence: maxScore,
        score: maxScore,
        reason: isValid ? `validación_ok (${maxScore.toFixed(2)})` : `score_insuficiente`,
        matchingTags
    };
}
function mapBackendCategoria(backend) {
    const mapping = {
        piscina: "pool",
        habitacion: "room",
        bano: "bathroom",
        restaurante: "restaurant",
        bar: "bar",
        spa: "spa",
        lobby: "lobby",
        exterior: "exterior",
        playa: "beach",
        gimnasio: "gym",
        infinity_pool: "infinity_pool",
        indoor_pool: "indoor_pool",
        kids_pool: "kids_pool",
        suite: "suite",
        presidential_suite: "presidential_suite",
        buffet: "buffet",
        rooftop_bar: "rooftop_bar",
        pool_bar: "pool_bar",
        beach_bar: "beach_bar",
        sauna: "sauna",
        steam_room: "steam_room",
        yoga_room: "yoga_room",
        terrace: "terrace",
        rooftop_terrace: "rooftop_terrace",
        garden: "garden",
        courtyard: "courtyard",
        lounge: "lounge",
        library: "library",
        conference_room: "conference_room",
        ballroom: "ballroom",
        wedding_venue: "wedding_venue",
        kids_area: "kids_area",
        playground: "playground",
        view: "view",
        architectural_detail: "architectural_detail",
        otros: "other"
    };
    return mapping[backend] || "other";
}
// ✅ CORREGIDO: Build secondary categories - SOLO categorías relacionadas válidas
function buildSecondaryCategories(categoria, tags) {
    const secondary = [];
    // === VISTAS (si hay evidencia) ===
    if (tags.some((t)=>/sea.*view|vista.*mar|ocean.*view|horizon|panoramic/.test(t))) {
        secondary.push('view');
    } else if (tags.some((t)=>/city.*view|skyline|urbano/.test(t))) {
        secondary.push('view');
    } else if (tags.some((t)=>/mountain.*view|sierra|valle/.test(t))) {
        secondary.push('view');
    }
    // === SUBCATEGORÍAS ESPECÍFICAS ===
    if (categoria === 'piscina') {
        if (tags.some((t)=>/infinity|vanishing|borde.*infinito/.test(t))) {
            secondary.push('infinity_pool');
        } else if (tags.some((t)=>/indoor|cubierta|covered/.test(t))) {
            secondary.push('indoor_pool');
        } else if (tags.some((t)=>/kids|children|infantil/.test(t))) {
            secondary.push('kids_pool');
        }
    }
    if (categoria === 'habitacion') {
        if (tags.some((t)=>/presidential/.test(t))) {
            secondary.push('presidential_suite');
        } else if (tags.some((t)=>/suite|junior/.test(t))) {
            secondary.push('suite');
        }
        if (tags.some((t)=>/balcony|balcon|terrace/.test(t))) {
            secondary.push('terrace');
        }
    }
    if (categoria === 'restaurante') {
        if (tags.some((t)=>/buffet/.test(t))) {
            secondary.push('buffet');
        }
        if (tags.some((t)=>/terrace|terraza|outdoor.*dining/.test(t))) {
            secondary.push('terrace');
        }
    }
    if (categoria === 'bar') {
        if (tags.some((t)=>/rooftop|azotea/.test(t))) {
            secondary.push('rooftop_bar');
        } else if (tags.some((t)=>/pool|piscina/.test(t))) {
            secondary.push('pool_bar');
        } else if (tags.some((t)=>/beach|playa/.test(t))) {
            secondary.push('beach_bar');
        }
    }
    if (categoria === 'spa') {
        if (tags.some((t)=>/sauna/.test(t))) {
            secondary.push('sauna');
        } else if (tags.some((t)=>/steam|vapor/.test(t))) {
            secondary.push('steam_room');
        }
    }
    if (categoria === 'exterior') {
        if (tags.some((t)=>/garden|jardin|landscaped/.test(t))) {
            secondary.push('garden');
        }
        if (tags.some((t)=>/terrace|terraza/.test(t))) {
            secondary.push('terrace');
        }
        if (tags.some((t)=>/courtyard|patio/.test(t))) {
            secondary.push('courtyard');
        }
    }
    // === ELEMENTOS ARQUITECTÓNICOS ===
    if (tags.some((t)=>/chandelier|araña|luxury.*lighting/.test(t))) {
        secondary.push('architectural_detail');
    }
    // ✅ Eliminar duplicados y filtrar undefined
    return [
        ...new Set(secondary)
    ].filter(Boolean);
}
// ✅ NUEVA: Build secondary para lógica local (mismo patrón)
function buildSecondaryCategoriesLocal(categoriaBackend, tags) {
    // Mapear categoría backend a lógica de frontend
    const categoriaMap = {
        'restaurante': 'restaurante',
        'bar': 'bar',
        'lobby': 'lobby',
        'habitacion': 'habitacion',
        'bano': 'bano',
        'spa': 'spa',
        'piscina': 'piscina',
        'playa': 'playa',
        'exterior': 'exterior'
    };
    const categoria = categoriaMap[categoriaBackend] || categoriaBackend;
    return buildSecondaryCategories(categoria, tags);
}
function detectSimpleCategory(tags) {
    return detectCategoryVision(tags).primary;
}
function getCategoryLabel(category) {
    const LABELS = {
        pool: "Piscina",
        infinity_pool: "Piscina Infinita",
        indoor_pool: "Piscina Cubierta",
        beach: "Playa",
        kids_pool: "Piscina Infantil",
        room: "Habitación",
        suite: "Suite",
        presidential_suite: "Suite Presidencial",
        bathroom: "Baño",
        restaurant: "Restaurante",
        buffet: "Buffet",
        bar: "Bar",
        rooftop_bar: "Bar en Azotea",
        pool_bar: "Bar de Piscina",
        beach_bar: "Chiringuito",
        spa: "Spa",
        sauna: "Sauna",
        steam_room: "Baño de Vapor",
        gym: "Gimnasio",
        yoga_room: "Sala de Yoga",
        terrace: "Terraza",
        rooftop_terrace: "Terraza en Azotea",
        garden: "Jardín",
        courtyard: "Patio Interior",
        exterior: "Fachada",
        lobby: "Lobby",
        lounge: "Salón",
        library: "Biblioteca",
        conference_room: "Sala de Reuniones",
        ballroom: "Salón de Eventos",
        wedding_venue: "Espacio para Bodas",
        kids_area: "Zona Infantil",
        playground: "Parque Infantil",
        view: "Vistas",
        architectural_detail: "Detalle Arquitectónico",
        other: "Otro espacio"
    };
    return LABELS[category] || "Otro espacio";
}
function analyzeGalleryCategories(detections) {
    const distribution = {
        pool: 0,
        infinity_pool: 0,
        indoor_pool: 0,
        beach: 0,
        kids_pool: 0,
        room: 0,
        suite: 0,
        presidential_suite: 0,
        bathroom: 0,
        restaurant: 0,
        buffet: 0,
        bar: 0,
        rooftop_bar: 0,
        pool_bar: 0,
        beach_bar: 0,
        spa: 0,
        sauna: 0,
        steam_room: 0,
        gym: 0,
        yoga_room: 0,
        terrace: 0,
        rooftop_terrace: 0,
        garden: 0,
        courtyard: 0,
        exterior: 0,
        lobby: 0,
        lounge: 0,
        library: 0,
        conference_room: 0,
        ballroom: 0,
        wedding_venue: 0,
        kids_area: 0,
        playground: 0,
        view: 0,
        architectural_detail: 0,
        other: 0
    };
    detections.forEach((d)=>{
        distribution[d.primary] = (distribution[d.primary] || 0) + 1;
        // ✅ CORREGIDO: Solo sumar secondary si son categorías válidas (no ubicación)
        d.secondary?.forEach((sec)=>{
            if (distribution[sec] !== undefined && sec !== 'interior' && sec !== 'exterior' && sec !== 'mixto') {
                distribution[sec] = (distribution[sec] || 0) + 0.3;
            }
        });
    });
    return distribution;
}
function detectCategoryWithTrace(tags, options) {
    const result = detectCategoryVision(tags, options);
    return {
        ...result,
        trace: {
            timestamp: Date.now(),
            source: result.source || 'unknown'
        }
    };
}
function inferLocationFromTags(tags) {
    const normalized = tags.map((t)=>t.toLowerCase().trim());
    const has = (keywords)=>keywords.some((k)=>normalized.includes(k));
    const exteriorKeywords = [
        'sky',
        'cielo',
        'cloud',
        'sun',
        'sunny',
        'palm',
        'palmera',
        'garden',
        'jardin',
        'facade',
        'fachada',
        'exterior',
        'outdoor',
        'beach',
        'playa',
        'sea',
        'mar',
        'pool',
        'piscina',
        'terrace',
        'terraza',
        'balcony',
        'balcon',
        'landscape'
    ];
    const interiorKeywords = [
        'ceiling',
        'techo',
        'bed',
        'cama',
        'bathroom',
        'baño',
        'shower',
        'bathtub',
        'curtain',
        'cortina',
        'carpet',
        'chandelier',
        'reception',
        'lobby',
        'restaurant',
        'dining',
        'bar',
        'spa',
        'gym',
        'indoor',
        'interior'
    ];
    const extCount = exteriorKeywords.filter((k)=>has([
            k
        ])).length;
    const intCount = interiorKeywords.filter((k)=>has([
            k
        ])).length;
    if (extCount > intCount + 2) return 'exterior';
    if (intCount > extCount + 2) return 'interior';
    if (extCount > 0 && intCount > 0) return 'mixto';
    return 'interior' // Default conservador
    ;
}
}),
"[project]/src/lib/ai.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "analyzeImage",
    ()=>analyzeImage,
    "generateImageCaption",
    ()=>generateImageCaption,
    "isValidImageUrl",
    ()=>isValidImageUrl
]);
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
 */ // ============================================================
// 🔒 CONFIGURACIÓN SEGURA (nunca hardcodear URLs sensibles)
// ============================================================
const BACKEND_URL = process.env.NEXT_PUBLIC_AI_BACKEND_URL || "http://localhost:8000";
const ANALYZE_TIMEOUT_MS = 50_000 // 15 segundos (ensemble es más completo)
;
const CAPTION_TIMEOUT_MS = 25_000 // 25 segundos (Florence-2 es más lento)
;
const MAX_RETRIES = 2;
const BASE_RETRY_DELAY_MS = 1_000;
// ============================================================
// 🚫 BLOCKLIST INTELIGENTE (SOLO ruido REAL, NO elementos hoteleros)
// ============================================================
// ⚠️ CRÍTICO: Los elementos como "umbrella", "sunbed", "garden", "tree", "sky" SON RELEVANTES 
// para hoteles y DEBEN mantenerse. Solo bloqueamos ruido genuino:
const BLOCKLIST = new Set([
    // Vehículos (nunca relevantes en fotos hoteleras profesionales)
    "car",
    "cars",
    "truck",
    "trucks",
    "van",
    "vans",
    "bus",
    "buses",
    "motorcycle",
    "bicycle",
    "boat",
    "boats",
    "yacht",
    "ship",
    "airplane",
    "helicopter",
    "train",
    "taxi",
    "scooter",
    // Personas (ruido común en CLIP, nunca queremos tags de personas)
    "person",
    "people",
    "man",
    "woman",
    "child",
    "children",
    "couple",
    "group",
    "tourist",
    "guest",
    "staff",
    "waiter",
    "chef",
    "lifeguard",
    "silhouette",
    "shadow",
    // Animales domésticos (no relevantes para amenities)
    "dog",
    "cat",
    "bird",
    "seagull",
    "pigeon",
    "insect",
    "butterfly",
    // Objetos domésticos irrelevantes para clasificación hotelera
    "bottle",
    "plate",
    "glass",
    "cup",
    "food",
    "meal",
    "dish",
    "utensil",
    "cutlery",
    "napkin",
    "menu",
    "receipt",
    "luggage",
    "suitcase",
    "bag",
    // Infraestructura urbana NO hotelera
    "street",
    "road",
    "highway",
    "parking lot",
    "garage",
    "traffic light",
    "sign",
    "billboard",
    "construction",
    "scaffolding",
    "crane",
    "apartment building",
    "office building",
    // Ruido técnico CLIP
    "image",
    "photo",
    "picture",
    "view",
    "scene",
    "area",
    "space",
    "place",
    "location",
    "background",
    "foreground",
    "blur",
    "bokeh"
]);
async function analyzeImage(url, threshold = 0.25 // ✅ Umbral por defecto más bajo para ensemble
) {
    const requestId = generateRequestId(url);
    console.log(`🤖 [${requestId}] Analizando imagen con ensemble: ${url.substring(0, 60)}...`);
    if (!url || typeof url !== "string" || !url.startsWith("http")) {
        console.error(`❌ [${requestId}] URL inválida`, {
            url
        });
        return createEmptyResult("invalid_url");
    }
    // Intentar con reintentos exponenciales
    for(let attempt = 0; attempt <= MAX_RETRIES; attempt++){
        try {
            const result = await withTimeout(()=>fetchAnalyze(url, threshold, requestId), ANALYZE_TIMEOUT_MS, `analyzeImage timeout (intentos: ${attempt + 1}/${MAX_RETRIES + 1})`);
            // ✅ VALIDAR que vengan los campos estructurados del ensemble
            if (!result.categoria || !result.ubicacion) {
                console.warn(`⚠️ [${requestId}] Backend no envió campos estructurados, aplicando fallback local`);
                return applyFrontendFallback(result, url, requestId);
            }
            console.log(`✅ [${requestId}] Ensemble analysis exitoso: ${result.categoria}/${result.ubicacion} (conf: ${result.confidence.toFixed(2)})`, {
                tags: result.tags.length,
                objects: result.objects.length,
                titulo: result.titulo_sugerido?.substring(0, 50)
            });
            return result;
        } catch (error) {
            const isLastAttempt = attempt === MAX_RETRIES;
            if (isLastAttempt) {
                console.error(`❌ [${requestId}] Falló análisis ensemble tras ${MAX_RETRIES + 1} intentos:`, {
                    error: error.message,
                    stack: error.stack?.split("\n").slice(0, 2).join("\n")
                });
                return createFallbackResult(url, requestId);
            }
            // Esperar antes de reintentar (backoff exponencial)
            const delay = BASE_RETRY_DELAY_MS * Math.pow(2, attempt);
            console.warn(`⚠️ [${requestId}] Intento ${attempt + 1} fallido, reintentando en ${delay}ms:`, error.message);
            await new Promise((resolve)=>setTimeout(resolve, delay));
        }
    }
    // Nunca debería llegar aquí (el último intento devuelve fallback)
    return createEmptyResult("unexpected_failure");
}
async function generateImageCaption(file) {
    const requestId = generateRequestId(file.name || "unknown");
    console.log(`✍️ [${requestId}] Generando caption con Florence-2...`);
    try {
        const caption = await withTimeout(()=>fetchCaption(file, requestId), CAPTION_TIMEOUT_MS, "generateImageCaption timeout");
        if (!caption || caption.length < 5) {
            console.warn(`⚠️ [${requestId}] Caption demasiado corto o vacío: "${caption}"`);
            return "";
        }
        // Limpiar caption básico (sin normalización semántica)
        const cleaned = caption.replace(/^(a |an |the )/i, "").replace(/\s+/g, " ").trim();
        console.log(`✅ [${requestId}] Caption generado (${cleaned.length} chars): "${cleaned.substring(0, 80)}..."`);
        return cleaned;
    } catch (error) {
        console.error(`❌ [${requestId}] Error generando caption:`, {
            message: error.message,
            stack: error.stack?.split("\n").slice(0, 2).join("\n")
        });
        return "" // Fallback silencioso: el pipeline usará tags para generar título
        ;
    }
}
// ============================================================
// 🔌 COMUNICACIÓN CON BACKEND (capa de transporte pura)
// ============================================================
async function fetchAnalyze(url, threshold, requestId) {
    const response = await fetch(`${BACKEND_URL}/analyze`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Request-ID": requestId
        },
        body: JSON.stringify({
            url,
            threshold
        }),
        // Signal para cancelación (Node.js 18+)
        signal: AbortSignal.timeout?.(ANALYZE_TIMEOUT_MS - 1000) || undefined
    });
    if (!response.ok) {
        const errorText = await response.text().catch(()=>"unknown");
        throw new Error(`Backend /analyze error ${response.status}: ${errorText}`);
    }
    const data = await response.json();
    // Validar estructura de respuesta básica
    if (!data || typeof data !== "object") {
        throw new Error("Respuesta del backend inválida (no es objeto)");
    }
    // Aplicar BLOCKLIST SOLO a tags de CLIP (no a objetos YOLO que son más precisos)
    const cleanedTags = Array.isArray(data.tags) ? data.tags.map((t)=>typeof t === "object" && t.label ? t.label : String(t)).map((t)=>t.toLowerCase().trim()).filter((t)=>t.length >= 2 && !BLOCKLIST.has(t)) : [];
    // Validar objetos YOLO
    const cleanedObjects = Array.isArray(data.objects) ? data.objects.filter((o)=>o && typeof o === "object" && typeof o.label === "string" && typeof o.confidence === "number").map((o)=>({
            label: o.label,
            confidence: o.confidence,
            bbox: Array.isArray(o.bbox) && o.bbox.length === 4 ? o.bbox : undefined
        })) : [];
    // ✅ PROCESAR NUEVOS CAMPOS DEL ENSEMBLE con validación suave
    const categoria = validateCategoria(data.categoria);
    const ubicacion = validateUbicacion(data.ubicacion);
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
        titulo_sugerido: typeof data.titulo_sugerido === "string" && data.titulo_sugerido.length > 0 ? data.titulo_sugerido.trim() : undefined,
        tags_confidence: typeof data.tags_confidence === "object" && data.tags_confidence !== null ? data.tags_confidence : undefined,
        ensemble_metadata: typeof data.metadata === "object" && data.metadata !== null ? data.metadata : undefined
    };
}
async function fetchCaption(file, requestId) {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(`${BACKEND_URL}/caption`, {
        method: "POST",
        body: formData,
        headers: {
            "X-Request-ID": requestId
        },
        signal: AbortSignal.timeout?.(CAPTION_TIMEOUT_MS - 1000) || undefined
    });
    if (!response.ok) {
        const errorText = await response.text().catch(()=>"unknown");
        throw new Error(`Backend /caption error ${response.status}: ${errorText}`);
    }
    const data = await response.json();
    if (!data || typeof data.caption !== "string") {
        throw new Error("Respuesta de caption inválida (caption no es string)");
    }
    return data.caption.trim();
}
// ============================================================
// 🛠️ VALIDADORES Y FALLBACKS INTELIGENTES
// ============================================================
/**
 * Valida que la categoría venga en el formato esperado
 */ function validateCategoria(value) {
    const valid = [
        'piscina',
        'habitacion',
        'bano',
        'restaurante',
        'bar',
        'spa',
        'lobby',
        'exterior',
        'playa',
        'gimnasio',
        'otros'
    ];
    return valid.includes(value) ? value : undefined;
}
/**
 * Valida que la ubicación venga en el formato esperado
 */ function validateUbicacion(value) {
    const valid = [
        'interior',
        'exterior',
        'mixto'
    ];
    return valid.includes(value) ? value : undefined;
}
/**
 * Clamp utility para valores numéricos
 */ function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
/**
 * ✅ FALLBACK INTELIGENTE: Cuando el backend no envía campos estructurados,
 * usa detectCategoryVision.ts como respaldo para inferir categoría/ubicación.
 */ function applyFrontendFallback(basicResult, url, requestId) {
    console.log(`🔄 [${requestId}] Aplicando fallback frontend para categorización`);
    // Importación dinámica para evitar dependencias circulares en build
    let detection = null;
    try {
        // Intentar usar la lógica local de categorización
        const { detectCategoryVision } = __turbopack_context__.r("[project]/src/lib/detectCategoryVision.ts [app-route] (ecmascript)");
        detection = detectCategoryVision(basicResult.tags || [], {
            // Pasar cualquier pista que tengamos del backend
            tagsConfidence: basicResult.tags_confidence
        });
    } catch (e) {
        console.warn(`⚠️ [${requestId}] No se pudo cargar detectCategoryVision para fallback:`, e);
    }
    // Generar título fallback si no viene del backend
    const tituloFallback = basicResult.titulo_sugerido || generateFallbackTitle(basicResult.tags || [], detection?.primary || 'otros');
    // Determinar ubicación fallback
    const ubicacionFallback = detection?.secondary?.includes('exterior') ? 'exterior' : inferUbicacionFromTags(basicResult.tags || []);
    console.log(`🔄 [${requestId}] Fallback aplicado: ${detection?.primary || 'otros'}/${ubicacionFallback}`);
    return {
        ...basicResult,
        // Asegurar campos mínimos
        tags: basicResult.tags || [],
        objects: basicResult.objects || [],
        caption: basicResult.caption || "",
        confidence: basicResult.confidence ?? 0.3,
        processing_time_ms: basicResult.processing_time_ms ?? -1,
        model_version: basicResult.model_version || "frontend_fallback",
        // Campos estructurados inferidos
        categoria: detection?.primary || 'otros',
        ubicacion: ubicacionFallback,
        titulo_sugerido: tituloFallback,
        tags_confidence: basicResult.tags?.reduce((acc, tag)=>{
            acc[tag] = 0.5; // Score por defecto en fallback
            return acc;
        }, {}) || {}
    };
}
/**
 * Genera título fallback cuando el backend no lo proporciona
 */ function generateFallbackTitle(tags, category) {
    const templates = {
        piscina: [
            "Piscina",
            "Piscina exterior",
            "Área de piscina",
            "Zona de baño"
        ],
        habitacion: [
            "Habitación",
            "Habitación premium",
            "Suite",
            "Dormitorio"
        ],
        bano: [
            "Baño",
            "Baño de lujo",
            "Zona de bienestar"
        ],
        restaurante: [
            "Restaurante",
            "Zona de comedor",
            "Buffet",
            "Área gastronómica"
        ],
        bar: [
            "Bar",
            "Lounge",
            "Zona de cocktails"
        ],
        spa: [
            "Spa",
            "Zona wellness",
            "Área de relajación"
        ],
        lobby: [
            "Lobby",
            "Recepción",
            "Hall de entrada"
        ],
        exterior: [
            "Vista exterior",
            "Fachada del hotel",
            "Entorno del hotel"
        ],
        playa: [
            "Playa",
            "Acceso a playa",
            "Zona playera"
        ],
        gimnasio: [
            "Gimnasio",
            "Zona fitness",
            "Área de ejercicio"
        ],
        otros: [
            "Vista del hotel",
            "Espacio del hotel"
        ]
    };
    const options = templates[category] || templates.otros;
    const baseTitle = options[Math.floor(Math.random() * options.length)];
    // Enriquecer con tags relevantes si están presentes
    const enrichments = [];
    if (tags.some((t)=>/vista|view|sea|mar/i.test(t))) enrichments.push("con vistas");
    if (tags.some((t)=>/lujo|luxury|premium/i.test(t))) enrichments.push("de lujo");
    if (tags.some((t)=>/palmera|palm|jardin|garden/i.test(t))) enrichments.push("con vegetación");
    if (enrichments.length > 0) {
        return `${baseTitle} ${enrichments.join(" y ")}`;
    }
    return baseTitle;
}
/**
 * Infere ubicación (interior/exterior) desde tags cuando no viene del backend
 */ function inferUbicacionFromTags(tags) {
    const exteriorKeywords = [
        'pool',
        'piscina',
        'beach',
        'playa',
        'garden',
        'jardin',
        'exterior',
        'outdoor',
        'terrace',
        'terraza',
        'balcony',
        'balcon',
        'facade',
        'fachada',
        'sky',
        'cielo',
        'sun',
        'sol',
        'tree',
        'arbol',
        'palm',
        'palmera'
    ];
    const interiorKeywords = [
        'room',
        'habitacion',
        'bedroom',
        'bathroom',
        'bano',
        'lobby',
        'reception',
        'restaurant',
        'restaurante',
        'bar',
        'spa',
        'gym',
        'gimnasio',
        'interior'
    ];
    const tagsLower = tags.map((t)=>t.toLowerCase());
    const exteriorScore = exteriorKeywords.filter((k)=>tagsLower.some((t)=>t.includes(k))).length;
    const interiorScore = interiorKeywords.filter((k)=>tagsLower.some((t)=>t.includes(k))).length;
    if (exteriorScore > interiorScore) return 'exterior';
    if (interiorScore > exteriorScore) return 'interior';
    // Default conservador: si hay piscina/playa, asumir exterior
    if (tagsLower.some((t)=>/pool|piscina|beach|playa/.test(t))) return 'exterior';
    return 'interior' // Default para habitaciones/interiores
    ;
}
// ============================================================
// 🛠️ UTILIDADES DE SOPORTE (sin cambios funcionales)
// ============================================================
/**
 * Genera ID único para trazabilidad (timestamp + hash corto)
 */ function generateRequestId(input) {
    const hash = Array.from(input).reduce((acc, char)=>{
        return acc + char.charCodeAt(0);
    }, 0).toString(36).padStart(4, "0");
    return `${Date.now().toString(36)}-${hash}`;
}
/**
 * Ejecuta promesa con timeout estricto
 */ async function withTimeout(promise, ms, errorMessage) {
    let timeoutId;
    const timeoutPromise = new Promise((_, reject)=>{
        timeoutId = setTimeout(()=>{
            reject(new Error(`TIMEOUT: ${errorMessage} (${ms}ms)`));
        }, ms);
    });
    try {
        return await Promise.race([
            promise(),
            timeoutPromise
        ]);
    } finally{
        if (timeoutId) clearTimeout(timeoutId);
    }
}
/**
 * Crea resultado fallback mínimo cuando falla el análisis
 */ function createFallbackResult(url, requestId) {
    // Intentar inferir tags básicos de la URL (ej: "pool" en el path)
    const urlLower = url.toLowerCase();
    const inferredTags = [];
    if (/pool|piscina/i.test(urlLower)) inferredTags.push("pool");
    if (/room|habitacion|bedroom/i.test(urlLower)) inferredTags.push("room");
    if (/beach|playa/i.test(urlLower)) inferredTags.push("beach");
    if (/restaurant|restaurante/i.test(urlLower)) inferredTags.push("restaurant");
    if (/spa/i.test(urlLower)) inferredTags.push("spa");
    // Inferir categoría y ubicación desde URL
    const inferredCategoria = /pool|piscina/i.test(urlLower) ? 'piscina' : /room|habitacion|bedroom/i.test(urlLower) ? 'habitacion' : /beach|playa/i.test(urlLower) ? 'playa' : /restaurant|restaurante|buffet/i.test(urlLower) ? 'restaurante' : /spa|wellness/i.test(urlLower) ? 'spa' : 'otros';
    const inferredUbicacion = [
        'piscina',
        'playa',
        'exterior'
    ].includes(inferredCategoria) ? 'exterior' : 'interior';
    console.warn(`🔄 [${requestId}] Usando resultado fallback con categoría inferida: ${inferredCategoria}/${inferredUbicacion}`);
    return {
        tags: inferredTags.length > 0 ? inferredTags : [
            "hotel",
            "building"
        ],
        objects: [],
        caption: "",
        confidence: 0.3,
        processing_time_ms: -1,
        model_version: "fallback",
        // Campos estructurados inferidos
        categoria: inferredCategoria,
        ubicacion: inferredUbicacion,
        titulo_sugerido: `Vista de ${inferredCategoria}`,
        tags_confidence: inferredTags.reduce((acc, tag)=>{
            acc[tag] = 0.4;
            return acc;
        }, {})
    };
}
/**
 * Crea resultado vacío para errores críticos
 */ function createEmptyResult(reason) {
    console.error(`💥 Resultado vacío por: ${reason}`);
    return {
        tags: [
            "hotel"
        ],
        objects: [],
        caption: "",
        confidence: 0.1,
        processing_time_ms: -1,
        model_version: "empty",
        // Campos mínimos estructurados
        categoria: 'otros',
        ubicacion: 'interior',
        titulo_sugerido: "Vista del hotel",
        tags_confidence: {
            hotel: 0.1
        }
    };
}
function isValidImageUrl(url) {
    try {
        const parsed = new URL(url);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch  {
        return false;
    }
} // ============================================================
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
}),
"[project]/src/lib/normalizeTags.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

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
 */ // ============================================================
// 📦 INTERFACES Y TIPOS
// ============================================================
__turbopack_context__.s([
    "areTagsHotelRelevant",
    ()=>areTagsHotelRelevant,
    "extractHighConfidenceTags",
    ()=>extractHighConfidenceTags,
    "normalizeTags",
    ()=>normalizeTags,
    "normalizeTagsSilent",
    ()=>normalizeTagsSilent
]);
// ============================================================
// 🚫 BLOCKLIST CORREGIDA - SOLO RUIDO REAL
// ============================================================
// ✅ CRÍTICO: Esta lista SOLO debe contener elementos que NUNCA son relevantes
// para clasificación hotelera. Elementos como "bottle", "glass", "cutlery" 
// SON ESENCIALES para detectar restaurantes/bares y NO deben bloquearse.
const BLOCKLIST = new Set([
    // === VEHÍCULOS (nunca relevantes en fotos hoteleras profesionales) ===
    "car",
    "cars",
    "truck",
    "trucks",
    "van",
    "vans",
    "bus",
    "buses",
    "motorcycle",
    "bicycle",
    "boat",
    "boats",
    "yacht",
    "ship",
    "airplane",
    "helicopter",
    "train",
    "taxi",
    "scooter",
    "moped",
    // === INFRAESTRUCTURA URBANA NO HOTELERA ===
    "street",
    "streets",
    "road",
    "roads",
    "highway",
    "parking lot",
    "garage",
    "traffic light",
    "sign",
    "billboard",
    "construction",
    "scaffolding",
    "crane",
    "power line",
    "telephone pole",
    "fire hydrant",
    "mailbox",
    // === PERSONAS (ruido común en CLIP, nunca queremos tags de personas) ===
    "person",
    "people",
    "man",
    "woman",
    "child",
    "children",
    "couple",
    "group",
    "tourist",
    "guest",
    "staff",
    "waiter",
    "chef",
    "lifeguard",
    "silhouette",
    "shadow",
    "face",
    "hand",
    "arm",
    "leg",
    "head",
    "body",
    // === ANIMALES (no relevantes para amenities hoteleros) ===
    "dog",
    "cat",
    "bird",
    "seagull",
    "pigeon",
    "insect",
    "butterfly",
    "fish",
    "horse",
    "cow",
    "sheep",
    "rabbit",
    // === RUIDO TÉCNICO CLIP / META-TAGS ===
    "image",
    "photo",
    "picture",
    "scene",
    "area",
    "space",
    "place",
    "location",
    "background",
    "foreground",
    "blur",
    "bokeh",
    "focus",
    "lens",
    "filter",
    "hd",
    "4k",
    "high resolution",
    "professional",
    "stock photo",
    // === EDIFICIOS NO HOTELEROS ===
    "church",
    "cathedral",
    "mosque",
    "temple",
    "monument",
    "statue",
    "apartment",
    "house",
    "home",
    "residence",
    "office",
    "store",
    "shop",
    "mall",
    "supermarket",
    "hospital",
    "school",
    "university",
    "factory",
    "warehouse",
    // === OBJETOS DOMÉSTICOS IRRELEVANTES PARA CLASIFICACIÓN ===
    // ✅ NOTA: "bottle", "glass", "plate", "cutlery" se mueven a HOTEL_ESSENTIAL_TAGS
    "receipt",
    "newspaper",
    "magazine",
    "book",
    "pen",
    "pencil",
    "clock",
    "calendar",
    "remote control",
    "charger",
    "cable",
    // === PALABRAS GENÉRICAS SIN VALOR SEMÁNTICO ===
    "thing",
    "object",
    "item",
    "stuff",
    "something",
    "anything",
    "view",
    "sight",
    "scenery",
    "landscape" // Solo si vienen solos sin contexto
]);
// ✅ WHITELIST: Elementos hoteleros que NUNCA deben bloquearse
// Estos son críticos para detectar amenities y experiencias hoteleras
const HOTEL_ESSENTIAL_TAGS = new Set([
    // === GASTRONOMÍA (esenciales para restaurante/bar) ===
    "wine glass",
    "wineglass",
    "bottle",
    "plate",
    "cutlery",
    "fork",
    "knife",
    "spoon",
    "cup",
    "glass",
    "bowl",
    "dish",
    "utensil",
    "napkin",
    "menu",
    "tray",
    "coffee cup",
    "teacup",
    "champagne",
    "cocktail",
    "drink",
    "beverage",
    // === EXTERIOR/PISCINA (esenciales para piscina/playa/jardín) ===
    "umbrella",
    "sunbed",
    "lounger",
    "deck chair",
    "palm tree",
    "potted plant",
    "garden",
    "tree",
    "sky",
    "cloud",
    "grass",
    "flower",
    "foliage",
    "water",
    "pool",
    "fountain",
    "pathway",
    "stone",
    "wood",
    // === HABITACIONES (esenciales para room/suite) ===
    "bed",
    "pillow",
    "blanket",
    "sheet",
    "towel",
    "robe",
    "slipper",
    "tv",
    "lamp",
    "mirror",
    "curtain",
    "blind",
    "carpet",
    "rug",
    "luggage",
    "suitcase",
    "bag",
    "hanger",
    "safe",
    "minibar",
    // === BAÑOS (esenciales para bathroom/spa) ===
    "bathtub",
    "shower",
    "sink",
    "toilet",
    "bidet",
    "soap",
    "shampoo",
    "toothbrush",
    "razor",
    "hairdryer",
    "scale",
    "bathrobe",
    // === ARQUITECTURA/DECORACIÓN ===
    "building",
    "window",
    "door",
    "balcony",
    "terrace",
    "facade",
    "chandelier",
    "painting",
    "sculpture",
    "vase",
    "candle",
    "art",
    // === VISTAS/ENTORNO ===
    "sea",
    "ocean",
    "beach",
    "mountain",
    "valley",
    "forest",
    "lake",
    "sunset",
    "sunrise",
    "horizon",
    "skyline",
    "panorama"
]);
function normalizeTags(rawTags, options) {
    if (!Array.isArray(rawTags) || rawTags.length === 0) return [];
    // ============================================================
    // 1️⃣ EXTRACCIÓN Y LIMPIEZA INICIAL (con soporte de scores)
    // ============================================================
    let tags = [];
    const backendScores = options?.tags_confidence || {};
    for (const raw of rawTags){
        const label = extractTagValue(raw)?.toLowerCase().trim();
        if (!label || label.length < 2) continue;
        // Obtener score: prioridad backend > objeto > default
        let score;
        if (backendScores[label] !== undefined) {
            score = backendScores[label];
        } else if (typeof raw === 'object' && raw.score !== undefined && typeof raw.score === 'number') {
            score = raw.score;
        } else {
            score = 0.5; // Score por defecto
        }
        tags.push({
            label,
            score
        });
    }
    if (tags.length === 0) return [];
    // ============================================================
    // 2️⃣ FILTRADO POR CONFIDENCE (si backend proporciona scores)
    // ============================================================
    const minConfidence = options?.min_confidence ?? 0.25;
    const preferBackend = options?.prefer_backend_scores ?? true;
    if (Object.keys(backendScores).length > 0 && preferBackend) {
        tags = tags.filter((t)=>t.score >= minConfidence);
    }
    // ============================================================
    // 3️⃣ BLOCKLIST INTELIGENTE CON WHITELIST HOTELERA
    // ============================================================
    tags = tags.filter((tag)=>{
        const label = tag.label;
        // ✅ PRIORIDAD 1: Si está en whitelist hotelera, NUNCA bloquear
        if (HOTEL_ESSENTIAL_TAGS.has(label)) {
            return true;
        }
        // ✅ PRIORIDAD 2: Si está en blocklist, bloquear
        if (BLOCKLIST.has(label)) {
            return false;
        }
        // ✅ PRIORIDAD 3: Filtro adicional para palabras genéricas solas
        // Solo bloquear "view", "landscape", etc. si vienen SIN contexto hotelero
        const genericWithoutContext = [
            'view',
            'sight',
            'scenery',
            'landscape'
        ];
        if (genericWithoutContext.includes(label)) {
            // Permitir si hay otros tags que dan contexto
            const hasContext = tags.some((t)=>t.label !== label && (HOTEL_ESSENTIAL_TAGS.has(t.label) || t.label.length > 6));
            return hasContext;
        }
        // ✅ Por defecto: permitir
        return true;
    });
    // ============================================================
    // 4️⃣ DETECCIÓN DE CONTEXTO PRIMARIO
    // ============================================================
    const tagLabels = tags.map((t)=>t.label);
    const hasPool = tagLabels.some((t)=>/pool|swimming|jacuzzi|lagoon|water.*surface/.test(t));
    const hasBeach = tagLabels.some((t)=>/beach|shoreline|coast|sand|seaside/.test(t));
    const hasRoom = tagLabels.some((t)=>/room|suite|bedroom|king\s+bed|queen\s+bed|twin\s+beds|double\s+bed|bed\s+side|nightstand/.test(t));
    const hasRestaurant = tagLabels.some((t)=>/restaurant|buffet|fine\s+dining|gourmet|dining.*hall/i.test(t) && !hasRoom);
    const hasSpa = tagLabels.some((t)=>/spa|sauna|steam|massage|hammam|wellness/.test(t));
    const hasGarden = tagLabels.some((t)=>/garden|landscaped|botanical|zen|courtyard|patio|lawn/.test(t));
    const hasBreakfastEvidence = tagLabels.some((t)=>/breakfast|morning|food|plate|cup|cereal|croissant|small\s+table|dining\s+table|breakfast\s+table|coffee|tea/.test(t));
    const hasPoolEvidence = tagLabels.some((t)=>/water|swim|sunbed|umbrella|lounge.*chair|deck|poolside|ripples|splash/.test(t));
    // Contexto desde backend (si está disponible)
    const backendCategoria = options?.categoria_context;
    const backendUbicacion = options?.ubicacion_context;
    // ============================================================
    // 5️⃣ MAPEO DE SINÓNIMOS CONTEXTO-AWARE
    // ============================================================
    const REPLACE_MAP = {};
    // PISCINAS
    REPLACE_MAP["swimming pool"] = "pool";
    REPLACE_MAP["outdoor pool"] = "pool";
    REPLACE_MAP["indoor pool"] = "indoor_pool";
    REPLACE_MAP["covered pool"] = "indoor_pool";
    REPLACE_MAP["heated pool"] = "heated_pool";
    REPLACE_MAP["thermal pool"] = "heated_pool";
    REPLACE_MAP["infinity pool"] = "infinity_pool";
    REPLACE_MAP["vanishing edge pool"] = "infinity_pool";
    REPLACE_MAP["lagoon pool"] = "lagoon_pool";
    REPLACE_MAP["natural pool"] = "lagoon_pool";
    REPLACE_MAP["resort pool"] = "pool";
    REPLACE_MAP["hotel pool"] = "pool";
    REPLACE_MAP["pool area"] = "pool";
    REPLACE_MAP["pool deck"] = "pool_deck";
    REPLACE_MAP["poolside"] = "pool";
    REPLACE_MAP["swim up bar"] = "pool_bar";
    REPLACE_MAP["jacuzzi"] = "jacuzzi";
    REPLACE_MAP["hot tub"] = "jacuzzi";
    REPLACE_MAP["whirlpool"] = "jacuzzi";
    REPLACE_MAP["kids pool"] = "kids_pool";
    REPLACE_MAP["children pool"] = "kids_pool";
    REPLACE_MAP["splash pad"] = "kids_pool";
    REPLACE_MAP["water play"] = "kids_pool";
    // CAMAS (contexto-aware)
    const effectiveHasRoom = hasRoom || backendCategoria === 'habitacion';
    if (effectiveHasRoom) {
        REPLACE_MAP["bed"] = "bed";
        REPLACE_MAP["twin beds"] = "twin_beds";
        REPLACE_MAP["king bed"] = "king_bed";
        REPLACE_MAP["queen bed"] = "queen_bed";
        REPLACE_MAP["double bed"] = "double_bed";
        REPLACE_MAP["single bed"] = "single_bed";
    } else {
        REPLACE_MAP["bed"] = "";
        REPLACE_MAP["twin beds"] = "";
        REPLACE_MAP["king bed"] = "";
        REPLACE_MAP["queen bed"] = "";
    }
    // SILLAS (contexto-aware)
    const effectiveHasPool = hasPool || backendCategoria === 'piscina';
    const effectiveHasBeach = hasBeach || backendCategoria === 'playa';
    const effectiveHasRestaurant = hasRestaurant || backendCategoria === 'restaurante';
    if (effectiveHasPool || effectiveHasBeach) {
        REPLACE_MAP["sun lounger"] = "sunbed";
        REPLACE_MAP["sun loungers"] = "sunbed";
        REPLACE_MAP["lounge chair"] = "sunbed";
        REPLACE_MAP["deck chair"] = "sunbed";
        REPLACE_MAP["chair"] = "sunbed";
        REPLACE_MAP["chairs"] = "sunbed";
    } else if (effectiveHasRestaurant) {
        REPLACE_MAP["chair"] = "chair";
        REPLACE_MAP["chairs"] = "chair";
        REPLACE_MAP["lounge chair"] = "chair";
        REPLACE_MAP["deck chair"] = "chair";
    } else if (effectiveHasRoom) {
        REPLACE_MAP["chair"] = "chair";
        REPLACE_MAP["chairs"] = "chair";
        REPLACE_MAP["lounge chair"] = "chair";
        REPLACE_MAP["deck chair"] = "chair";
    } else {
        REPLACE_MAP["chair"] = "";
        REPLACE_MAP["chairs"] = "";
    }
    // GASTRONOMÍA (contexto-aware)
    if (effectiveHasRoom && hasBreakfastEvidence) {
        REPLACE_MAP["dining area"] = "dining_area";
        REPLACE_MAP["dining room"] = "dining_area";
        REPLACE_MAP["dining space"] = "dining_area";
        REPLACE_MAP["breakfast area"] = "breakfast_area";
        REPLACE_MAP["breakfast room"] = "breakfast_area";
    } else if (effectiveHasRoom && !hasBreakfastEvidence && backendCategoria !== 'restaurante') {
        REPLACE_MAP["dining room"] = "room";
        REPLACE_MAP["dining area"] = "room";
        REPLACE_MAP["dining space"] = "room";
        REPLACE_MAP["breakfast area"] = "room";
        REPLACE_MAP["breakfast room"] = "room";
    } else {
        REPLACE_MAP["dining area"] = "restaurant";
        REPLACE_MAP["dining room"] = "restaurant";
        REPLACE_MAP["dining space"] = "restaurant";
        REPLACE_MAP["fine dining"] = "restaurant";
        REPLACE_MAP["gourmet restaurant"] = "restaurant";
        REPLACE_MAP["main restaurant"] = "restaurant";
        REPLACE_MAP["breakfast area"] = "restaurant";
        REPLACE_MAP["breakfast room"] = "restaurant";
        REPLACE_MAP["buffet area"] = "buffet";
        REPLACE_MAP["buffet station"] = "buffet";
        REPLACE_MAP["international buffet"] = "buffet";
    }
    // Bares
    REPLACE_MAP["lobby bar"] = "bar";
    REPLACE_MAP["lounge bar"] = "bar";
    REPLACE_MAP["cocktail bar"] = "bar";
    REPLACE_MAP["wine bar"] = "wine_bar";
    REPLACE_MAP["wine cellar"] = "wine_cellar";
    REPLACE_MAP["rooftop bar"] = "rooftop_bar";
    REPLACE_MAP["sky bar"] = "rooftop_bar";
    REPLACE_MAP["sunset bar"] = "rooftop_bar";
    REPLACE_MAP["pool bar"] = "pool_bar";
    REPLACE_MAP["swim up bar"] = "pool_bar";
    REPLACE_MAP["beach bar"] = "beach_bar";
    REPLACE_MAP["cafe"] = "cafe";
    REPLACE_MAP["coffee shop"] = "cafe";
    REPLACE_MAP["pastry shop"] = "cafe";
    // HABITACIONES
    REPLACE_MAP["hotel room"] = "room";
    REPLACE_MAP["guest room"] = "room";
    REPLACE_MAP["bedroom"] = "room";
    REPLACE_MAP["double room"] = "room";
    REPLACE_MAP["twin room"] = "twin_beds";
    REPLACE_MAP["single room"] = "room";
    REPLACE_MAP["standard room"] = "room";
    REPLACE_MAP["superior room"] = "superior_room";
    REPLACE_MAP["deluxe room"] = "superior_room";
    REPLACE_MAP["premium room"] = "superior_room";
    REPLACE_MAP["suite"] = "suite";
    REPLACE_MAP["junior suite"] = "junior_suite";
    REPLACE_MAP["executive suite"] = "suite";
    REPLACE_MAP["presidential suite"] = "presidential_suite";
    REPLACE_MAP["honeymoon suite"] = "honeymoon_suite";
    REPLACE_MAP["family suite"] = "family_suite";
    REPLACE_MAP["king size bed"] = "king_bed";
    REPLACE_MAP["king bed"] = "king_bed";
    REPLACE_MAP["queen size bed"] = "queen_bed";
    REPLACE_MAP["queen bed"] = "queen_bed";
    REPLACE_MAP["twin beds"] = "twin_beds";
    REPLACE_MAP["double bed"] = "double_bed";
    REPLACE_MAP["canopy bed"] = "canopy_bed";
    REPLACE_MAP["four poster bed"] = "canopy_bed";
    REPLACE_MAP["balcony"] = "balcony";
    REPLACE_MAP["private balcony"] = "balcony";
    REPLACE_MAP["terrace"] = "terrace";
    REPLACE_MAP["private terrace"] = "private_terrace";
    REPLACE_MAP["rooftop terrace"] = "rooftop_terrace";
    REPLACE_MAP["veranda"] = "terrace";
    // BAÑOS
    REPLACE_MAP["bathroom"] = "bathroom";
    REPLACE_MAP["ensuite bathroom"] = "bathroom";
    REPLACE_MAP["private bathroom"] = "bathroom";
    REPLACE_MAP["shower"] = "shower";
    REPLACE_MAP["walk in shower"] = "rain_shower";
    REPLACE_MAP["bathtub"] = "bathtub";
    REPLACE_MAP["freestanding tub"] = "freestanding_tub";
    REPLACE_MAP["clawfoot tub"] = "freestanding_tub";
    REPLACE_MAP["double vanity"] = "double_vanity";
    REPLACE_MAP["his and hers sinks"] = "double_vanity";
    REPLACE_MAP["bidet"] = "bidet";
    REPLACE_MAP["heated floors"] = "heated_floors";
    REPLACE_MAP["underfloor heating"] = "heated_floors";
    REPLACE_MAP["spa bathroom"] = "luxury_bathroom";
    REPLACE_MAP["marble bathroom"] = "luxury_bathroom";
    // EXTERIOR
    REPLACE_MAP["facade"] = "facade";
    REPLACE_MAP["front facade"] = "facade";
    REPLACE_MAP["building front"] = "facade";
    REPLACE_MAP["entrance"] = "entrance";
    REPLACE_MAP["main entrance"] = "entrance";
    REPLACE_MAP["porte cochere"] = "entrance";
    REPLACE_MAP["valet"] = "entrance";
    REPLACE_MAP["garden"] = "garden";
    REPLACE_MAP["landscaped garden"] = "garden";
    REPLACE_MAP["botanical garden"] = "botanical_garden";
    REPLACE_MAP["zen garden"] = "zen_garden";
    REPLACE_MAP["courtyard"] = "courtyard";
    REPLACE_MAP["patio"] = "courtyard";
    REPLACE_MAP["lawn"] = "garden";
    REPLACE_MAP["flower bed"] = "garden";
    REPLACE_MAP["greenery"] = "garden";
    REPLACE_MAP["palm tree"] = "palm_tree";
    REPLACE_MAP["palm trees"] = "palm_tree";
    REPLACE_MAP["beach"] = "beach";
    REPLACE_MAP["beach access"] = "beach_access";
    REPLACE_MAP["private beach"] = "private_beach";
    REPLACE_MAP["shoreline"] = "beach";
    REPLACE_MAP["coast"] = "beach";
    REPLACE_MAP["mountain"] = "mountain";
    REPLACE_MAP["hillside"] = "mountain";
    // VISTAS
    REPLACE_MAP["view"] = "view";
    REPLACE_MAP["sea view"] = "sea_view";
    REPLACE_MAP["ocean view"] = "sea_view";
    REPLACE_MAP["beach view"] = "sea_view";
    REPLACE_MAP["city view"] = "city_view";
    REPLACE_MAP["urban view"] = "city_view";
    REPLACE_MAP["skyline"] = "city_view";
    REPLACE_MAP["cityscape"] = "city_view";
    REPLACE_MAP["mountain view"] = "mountain_view";
    REPLACE_MAP["valley view"] = "valley_view";
    REPLACE_MAP["garden view"] = "garden_view";
    REPLACE_MAP["pool view"] = "pool_view";
    REPLACE_MAP["panoramic view"] = "panoramic_view";
    REPLACE_MAP["sunset view"] = "sunset_view";
    REPLACE_MAP["horizon"] = "panoramic_view";
    // ZONAS COMUNES
    REPLACE_MAP["lobby"] = "lobby";
    REPLACE_MAP["reception area"] = "lobby";
    REPLACE_MAP["entrance hall"] = "lobby";
    REPLACE_MAP["grand lobby"] = "grand_lobby";
    REPLACE_MAP["atrium"] = "grand_lobby";
    REPLACE_MAP["lounge"] = "lounge";
    REPLACE_MAP["seating area"] = "lounge";
    REPLACE_MAP["common area"] = "lounge";
    REPLACE_MAP["living room"] = "lounge";
    REPLACE_MAP["library"] = "library";
    REPLACE_MAP["reading room"] = "library";
    REPLACE_MAP["fireplace"] = "fireplace";
    REPLACE_MAP["chimney"] = "fireplace";
    REPLACE_MAP["game room"] = "game_room";
    REPLACE_MAP["billiards"] = "game_room";
    // EVENTOS
    REPLACE_MAP["conference room"] = "conference_room";
    REPLACE_MAP["meeting room"] = "conference_room";
    REPLACE_MAP["boardroom"] = "conference_room";
    REPLACE_MAP["ballroom"] = "ballroom";
    REPLACE_MAP["banquet hall"] = "ballroom";
    REPLACE_MAP["event space"] = "ballroom";
    REPLACE_MAP["function room"] = "ballroom";
    REPLACE_MAP["wedding"] = "wedding_venue";
    REPLACE_MAP["ceremony space"] = "wedding_venue";
    REPLACE_MAP["chapel"] = "chapel";
    // ESTILO
    REPLACE_MAP["luxury"] = "luxury";
    REPLACE_MAP["luxurious"] = "luxury";
    REPLACE_MAP["premium"] = "luxury";
    REPLACE_MAP["high end"] = "luxury";
    REPLACE_MAP["exclusive"] = "luxury";
    REPLACE_MAP["boutique"] = "boutique";
    REPLACE_MAP["modern"] = "modern";
    REPLACE_MAP["contemporary"] = "modern";
    REPLACE_MAP["minimalist"] = "minimalist";
    REPLACE_MAP["elegant"] = "elegant";
    REPLACE_MAP["sophisticated"] = "elegant";
    REPLACE_MAP["classic"] = "classic";
    REPLACE_MAP["traditional"] = "classic";
    REPLACE_MAP["rustic"] = "rustic";
    REPLACE_MAP["mediterranean"] = "mediterranean";
    // Aplicar mapeos (filtrar strings vacíos)
    tags = tags.map((t)=>({
            ...t,
            label: REPLACE_MAP[t.label] || t.label
        })).filter((t)=>t.label && t.label.length >= 2);
    // ============================================================
    // 6️⃣ MAPEO YOLO → ESCENAS SEMÁNTICAS (simplificado)
    // ============================================================
    const expandedTags = [];
    for (const tag of tags){
        const expansions = getYOLOExpansions(tag.label, {
            hasPool: effectiveHasPool,
            hasBeach: effectiveHasBeach,
            hasRoom: effectiveHasRoom,
            hasRestaurant: effectiveHasRestaurant,
            hasBreakfastEvidence
        });
        if (expansions.length > 0) {
            expansions.forEach((exp, idx)=>{
                expandedTags.push({
                    label: exp,
                    score: tag.score * (idx === 0 ? 1 : 0.8)
                });
            });
        } else {
            expandedTags.push(tag);
        }
    }
    tags = expandedTags.filter((t)=>t.label && t.label.length >= 2);
    // ============================================================
    // 7️⃣ CORRECCIONES CONTEXTUALES INTELIGENTES
    // ============================================================
    let currentLabels = tags.map((t)=>t.label);
    // Regla 1: Piscina infinita
    if (currentLabels.includes("pool") && currentLabels.some((l)=>[
            "vanishing",
            "edge",
            "horizon"
        ].includes(l))) {
        tags = tags.filter((t)=>t.label !== "pool");
        tags.push({
            label: "infinity_pool",
            score: 0.9
        });
    }
    // Regla 2: Piscina + sillas → sunbeds
    if ((effectiveHasPool || effectiveHasBeach) && currentLabels.some((l)=>[
            "chair",
            "chairs",
            "lounge chair"
        ].includes(l))) {
        tags = tags.filter((t)=>![
                "chair",
                "chairs",
                "lounge chair"
            ].includes(t.label));
        tags.push({
            label: "sunbed",
            score: 0.85
        });
    }
    // Regla 3: Eliminar "indoor" si es piscina exterior
    if (currentLabels.includes("pool") && !currentLabels.includes("indoor_pool") && currentLabels.includes("indoor")) {
        tags = tags.filter((t)=>t.label !== "indoor");
    }
    // Regla 4: Habitación con balcón → vista
    if (currentLabels.includes("room") && currentLabels.some((l)=>[
            "balcony",
            "terrace"
        ].includes(l)) && currentLabels.includes("view")) {
        if (!currentLabels.includes("room_with_view")) {
            tags.push({
                label: "room_with_view",
                score: 0.7
            });
        }
    }
    // Regla 5: Spa complejo
    if (currentLabels.includes("spa") && currentLabels.some((l)=>[
            "sauna",
            "steam_room"
        ].includes(l))) {
        if (!currentLabels.includes("wellness_complex")) {
            tags.push({
                label: "wellness_complex",
                score: 0.8
            });
        }
    }
    // Regla 6: Restaurante exterior
    if (currentLabels.includes("restaurant") && currentLabels.some((l)=>[
            "terrace",
            "rooftop"
        ].includes(l))) {
        tags = tags.filter((t)=>t.label !== "restaurant");
        tags.push({
            label: "outdoor_dining",
            score: 0.85
        });
    }
    // Regla 7: Acceso a playa
    if (currentLabels.includes("exterior") && currentLabels.some((l)=>[
            "sea",
            "ocean"
        ].includes(l))) {
        if (!currentLabels.includes("beach_access")) {
            tags.push({
                label: "beach_access",
                score: 0.75
            });
        }
    }
    // Regla 8: Baño de lujo
    if (currentLabels.includes("bathroom") && currentLabels.includes("freestanding_tub")) {
        if (!currentLabels.includes("luxury_bathroom")) {
            tags.push({
                label: "luxury_bathroom",
                score: 0.9
            });
        }
    }
    // Regla 9: Suite premium
    if (currentLabels.includes("suite") && currentLabels.includes("king_bed") && currentLabels.includes("balcony")) {
        if (!currentLabels.includes("premium_suite")) {
            tags.push({
                label: "premium_suite",
                score: 0.95
            });
        }
    }
    // Regla 10: Atmósfera premium
    const hasTimeContext = currentLabels.some((l)=>[
            "sunset",
            "sunrise",
            "dawn",
            "dusk",
            "golden hour"
        ].includes(l));
    const hasPremiumArea = currentLabels.some((l)=>[
            "pool",
            "infinity_pool",
            "sea_view",
            "panoramic_view"
        ].includes(l));
    if (hasTimeContext && hasPremiumArea && !currentLabels.includes("premium_atmosphere")) {
        tags.push({
            label: "premium_atmosphere",
            score: 0.8
        });
    }
    // Regla 11: Eliminar room si hay piscina sin cama
    if (currentLabels.includes("pool") && !currentLabels.some((l)=>[
            "bed",
            "king_bed",
            "queen_bed",
            "twin_beds"
        ].includes(l))) {
        tags = tags.filter((t)=>t.label !== "room");
    }
    // Regla 12: Jardín tropical
    if (currentLabels.includes("garden") && currentLabels.includes("palm_tree") && !currentLabels.includes("tropical_garden")) {
        tags.push({
            label: "tropical_garden",
            score: 0.85
        });
    }
    // Regla 13: Lobby acogedor
    if (currentLabels.includes("lobby") && currentLabels.includes("fireplace") && !currentLabels.includes("cozy_lobby")) {
        tags.push({
            label: "cozy_lobby",
            score: 0.8
        });
    }
    // Regla 14: Desayuno buffet
    if (currentLabels.includes("buffet") && currentLabels.some((l)=>[
            "breakfast",
            "morning"
        ].includes(l)) && !currentLabels.includes("breakfast_buffet")) {
        tags.push({
            label: "breakfast_buffet",
            score: 0.9
        });
    }
    // Regla 15: Eliminar contradicciones
    if (currentLabels.includes("indoor_pool") && currentLabels.includes("outdoor")) {
        tags = tags.filter((t)=>t.label !== "outdoor");
    }
    // Regla 16: Eliminar pool falso en habitaciones
    const backendSaysPool = backendCategoria === 'piscina';
    if (currentLabels.includes("room") && currentLabels.includes("pool") && !hasPoolEvidence && !backendSaysPool) {
        tags = tags.filter((t)=>t.label !== "pool");
    }
    // Regla 17: Eliminar dining_area falso en habitaciones
    const backendSaysRestaurant = backendCategoria === 'restaurante';
    if (currentLabels.includes("room") && currentLabels.includes("dining_area") && !hasBreakfastEvidence && !backendSaysRestaurant) {
        tags = tags.filter((t)=>t.label !== "dining_area");
    }
    // Regla 18: Reforzar twin_beds
    if (currentLabels.includes("twin_beds") && currentLabels.includes("room") && !hasBreakfastEvidence && !backendSaysRestaurant) {
        tags = tags.filter((t)=>t.label !== "dining_area");
    }
    // Regla 19: Reforzar tags según categoría backend
    if (backendCategoria && backendCategoria !== 'otros') {
        const categoryBoostTags = {
            piscina: [
                "pool",
                "water",
                "sunbed",
                "umbrella",
                "deck"
            ],
            habitacion: [
                "room",
                "bed",
                "pillow",
                "nightstand",
                "balcony"
            ],
            restaurante: [
                "restaurant",
                "table",
                "chair",
                "plate",
                "buffet"
            ],
            spa: [
                "spa",
                "massage",
                "towel",
                "relax",
                "wellness"
            ],
            playa: [
                "beach",
                "sand",
                "sea",
                "ocean",
                "shoreline"
            ]
        };
        const boostList = categoryBoostTags[backendCategoria] || [];
        tags = tags.map((t)=>{
            if (boostList.includes(t.label) && t.score < 0.7) {
                return {
                    ...t,
                    score: Math.min(t.score + 0.15, 0.95)
                };
            }
            return t;
        });
    }
    // ============================================================
    // 8️⃣ SINGULARIZACIÓN ROBUSTA
    // ============================================================
    const IRREGULAR_PLURALS = {
        "people": "person",
        "children": "child",
        "men": "man",
        "women": "woman",
        "feet": "foot",
        "teeth": "tooth",
        "geese": "goose",
        "mice": "mouse",
        "lice": "louse"
    };
    tags = tags.map((tag)=>{
        if (IRREGULAR_PLURALS[tag.label]) {
            return {
                ...tag,
                label: IRREGULAR_PLURALS[tag.label]
            };
        }
        if (tag.label.endsWith("s") && tag.label.length > 3 && !tag.label.endsWith("ss")) {
            return {
                ...tag,
                label: tag.label.replace(/s$/, "")
            };
        }
        return tag;
    });
    // ============================================================
    // 9️⃣ DEDUPLICACIÓN Y ORDENAMIENTO FINAL
    // ============================================================
    const PRIORITY_ORDER = [
        "infinity_pool",
        "presidential_suite",
        "private_beach",
        "panoramic_view",
        "sea_view",
        "luxury_bathroom",
        "freestanding_tub",
        "rain_shower",
        "premium_suite",
        "honeymoon_suite",
        "rooftop_bar",
        "rooftop_terrace",
        "botanical_garden",
        "zen_garden",
        "wellness_complex",
        "pool",
        "indoor_pool",
        "heated_pool",
        "lagoon_pool",
        "jacuzzi",
        "kids_pool",
        "suite",
        "junior_suite",
        "superior_room",
        "king_bed",
        "queen_bed",
        "twin_beds",
        "double_bed",
        "balcony",
        "private_terrace",
        "spa",
        "sauna",
        "steam_room",
        "relaxation_area",
        "gym",
        "yoga_room",
        "restaurant",
        "buffet",
        "bar",
        "wine_bar",
        "pool_bar",
        "cafe",
        "dining_area",
        "breakfast_area",
        "garden",
        "courtyard",
        "beach_access",
        "mountain_view",
        "city_view",
        "lobby",
        "grand_lobby",
        "lounge",
        "library",
        "fireplace",
        "conference_room",
        "ballroom",
        "wedding_venue",
        "room",
        "bathroom",
        "shower",
        "bathtub",
        "terrace",
        "exterior",
        "view",
        "modern",
        "luxury"
    ];
    // Eliminar redundancias
    const hasPremiumPool = tags.some((t)=>[
            "infinity_pool",
            "lagoon_pool",
            "heated_pool"
        ].includes(t.label));
    if (hasPremiumPool) tags = tags.filter((t)=>t.label !== "pool");
    const hasSuite = tags.some((t)=>[
            "suite",
            "junior_suite",
            "presidential_suite"
        ].includes(t.label));
    if (hasSuite) tags = tags.filter((t)=>t.label !== "room");
    const hasSpaComplex = tags.some((t)=>[
            "spa",
            "sauna",
            "steam_room"
        ].includes(t.label));
    if (hasSpaComplex) tags = tags.filter((t)=>t.label !== "wellness");
    // Deduplicar manteniendo score más alto
    const deduped = new Map();
    for (const tag of tags){
        const existing = deduped.get(tag.label);
        if (!existing || tag.score > existing.score) {
            deduped.set(tag.label, tag);
        }
    }
    // Filtrar, limpiar y ordenar
    const finalTags = Array.from(deduped.values()).map((t)=>t.label.replace(/[^a-z0-9_]/g, "_")).filter((tag)=>tag.length >= 2 && !/^\d+$/.test(tag) && !tag.startsWith("http")).filter((tag, idx, arr)=>arr.indexOf(tag) === idx).sort((a, b)=>{
        const aIdx = PRIORITY_ORDER.indexOf(a);
        const bIdx = PRIORITY_ORDER.indexOf(b);
        if (aIdx === -1 && bIdx === -1) return 0;
        if (aIdx === -1) return 1;
        if (bIdx === -1) return -1;
        return aIdx - bIdx;
    });
    return finalTags;
}
// ============================================================
// 🔧 FUNCIONES AUXILIARES
// ============================================================
function extractTagValue(tag) {
    if (!tag) return null;
    if (typeof tag === "object") {
        if (tag.label) return String(tag.label);
        if (tag.text) return String(tag.text);
        if (tag.name) return String(tag.name);
        if (tag.className) return String(tag.className);
    }
    if (typeof tag === "string") return tag;
    if (Array.isArray(tag)) return tag.map(extractTagValue).filter(Boolean).join(" ");
    if (typeof tag === "number" || typeof tag === "boolean") return String(tag);
    return null;
}
/**
 * Obtiene expansiones YOLO según contexto (función helper interna)
 */ function getYOLOExpansions(tag, context) {
    const { hasPool, hasBeach, hasRoom, hasRestaurant, hasBreakfastEvidence } = context;
    const expansions = {
        "sunbed": hasPool || hasBeach ? [
            "pool",
            "sunbed"
        ] : [],
        "lounge chair": hasPool || hasBeach ? [
            "pool",
            "sunbed"
        ] : [],
        "deck chair": hasPool || hasBeach ? [
            "pool",
            "sunbed"
        ] : [],
        "umbrella": hasPool || hasBeach ? [
            "pool",
            "umbrella"
        ] : [],
        "parasol": hasPool || hasBeach ? [
            "pool",
            "umbrella"
        ] : [],
        "balinese bed": hasPool || hasBeach ? [
            "pool",
            "balinese_bed"
        ] : [],
        "cabana": hasPool || hasBeach ? [
            "pool",
            "cabana"
        ] : [],
        "daybed": hasPool || hasBeach ? [
            "pool",
            "balinese_bed"
        ] : [],
        "bed": hasRoom ? [
            "room",
            "bed"
        ] : [],
        "king bed": hasRoom ? [
            "room",
            "king_bed"
        ] : [],
        "queen bed": hasRoom ? [
            "room",
            "queen_bed"
        ] : [],
        "twin beds": hasRoom ? [
            "room",
            "twin_beds"
        ] : [],
        "sofa": [
            "lounge"
        ],
        "armchair": [
            "lounge"
        ],
        "desk": [
            "room",
            "workspace"
        ],
        "dining table": hasRestaurant ? [
            "restaurant"
        ] : hasRoom && hasBreakfastEvidence ? [
            "dining_area"
        ] : [
            "table"
        ],
        "palm tree": [
            "exterior",
            "garden"
        ],
        "tree": [
            "garden"
        ],
        "plant": [
            "garden"
        ],
        "fountain": [
            "garden"
        ],
        "fire pit": [
            "exterior",
            "fire_pit"
        ],
        "bbq": [
            "exterior",
            "bbq_area"
        ],
        "hammock": [
            "exterior",
            "hammock"
        ],
        "bathtub": [
            "bathroom",
            "bathtub"
        ],
        "shower": [
            "bathroom",
            "shower"
        ],
        "towel": [
            "bathroom",
            "spa"
        ],
        "bar counter": [
            "bar"
        ],
        "wine glass": [
            "bar",
            "wine_bar"
        ],
        "cocktail": [
            "bar"
        ]
    };
    return expansions[tag] || [];
}
function areTagsHotelRelevant(tags) {
    const HOTEL_KEYWORDS = [
        "pool",
        "room",
        "suite",
        "spa",
        "restaurant",
        "bar",
        "lobby",
        "garden",
        "beach",
        "terrace",
        "balcony",
        "bathroom",
        "view",
        "luxury",
        "hotel",
        "resort",
        "twin_beds"
    ];
    return tags.some((tag)=>HOTEL_KEYWORDS.includes(tag));
}
function extractHighConfidenceTags(rawTags, minScore = 0.7) {
    return rawTags.filter((t)=>typeof t === "object" && typeof t.score === "number" && t.score >= minScore).map((t)=>t.label || t.text || "").filter(Boolean);
}
function normalizeTagsSilent(rawTags, options) {
    const originalLog = console.log;
    console.log = ()=>{};
    try {
        return normalizeTags(rawTags, options);
    } finally{
        console.log = originalLog;
    }
}
}),
"[project]/src/lib/extractAmenities.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/lib/extractAmenities.ts
/**
 * 🔍 Sistema avanzado de extracción de amenities hoteleros (versión corregida)
 * 
 * ✅ FIX: Añadida propiedad 'amenities' a la interfaz AmenitiesExtraction
 */ __turbopack_context__.s([
    "extractAmenities",
    ()=>extractAmenities,
    "extractAmenitiesSimple",
    ()=>extractAmenitiesSimple,
    "generateAmenityBadges",
    ()=>generateAmenityBadges,
    "searchAmenities",
    ()=>searchAmenities
]);
function extractAmenities(tags) {
    const start = Date.now();
    const normalized = tags.map((t)=>t.toLowerCase().trim()).filter((t)=>t.length >= 2 && !/^\d+$/.test(t));
    const extractor = new AmenityExtractor(normalized);
    const result = extractor.extract();
    result.processingTimeMs = Date.now() - start;
    return result;
}
// ============================================================
// 🔬 CLASE EXTRACTOR
// ============================================================
class AmenityExtractor {
    tags;
    amenities = [];
    confidenceScores = new Map();
    indicatorsUsed = new Map();
    SYNONYMS = {
        // Piscinas
        "pool": [
            "pool",
            "piscina",
            "swimming pool",
            "piscina exterior",
            "alberca"
        ],
        "infinity_pool": [
            "infinity pool",
            "piscina infinita",
            "vanishing edge",
            "borde infinito"
        ],
        "indoor_pool": [
            "indoor pool",
            "piscina cubierta",
            "covered pool",
            "piscina interior"
        ],
        "heated_pool": [
            "heated pool",
            "piscina climatizada",
            "thermal pool"
        ],
        "kids_pool": [
            "kids pool",
            "piscina infantil",
            "children pool",
            "piscinita"
        ],
        "jacuzzi": [
            "jacuzzi",
            "hidromasaje",
            "hot tub",
            "whirlpool",
            "spa pool"
        ],
        // Wellness
        "spa": [
            "spa",
            "centro de spa",
            "spa center",
            "wellness center",
            "área de bienestar"
        ],
        "sauna": [
            "sauna",
            "sauna finlandesa",
            "sauna room",
            "sauna seca"
        ],
        "steam_room": [
            "steam room",
            "baño de vapor",
            "hammam",
            "turkish bath",
            "vapor"
        ],
        "massage": [
            "massage",
            "masaje",
            "massage room",
            "sala de masajes",
            "treatment room"
        ],
        "gym": [
            "gym",
            "gimnasio",
            "fitness center",
            "fitness room",
            "sala de fitness"
        ],
        "yoga": [
            "yoga",
            "yoga room",
            "sala de yoga",
            "meditation",
            "meditación"
        ],
        // Dining
        "restaurant": [
            "restaurant",
            "restaurante",
            "dining room",
            "comedor",
            "fine dining"
        ],
        "buffet": [
            "buffet",
            "bufé",
            "buffet area",
            "zona de buffet",
            "desayuno buffet"
        ],
        "bar": [
            "bar",
            "barra",
            "lounge bar",
            "lobby bar",
            "bar interior"
        ],
        "rooftop_bar": [
            "rooftop bar",
            "bar en azotea",
            "sky bar",
            "bar terraza"
        ],
        "pool_bar": [
            "pool bar",
            "bar de piscina",
            "swim-up bar",
            "chiringuito"
        ],
        "beach_bar": [
            "beach bar",
            "chiringuito",
            "beach club",
            "bar playero"
        ],
        "cafe": [
            "cafe",
            "cafetería",
            "coffee shop",
            "pastelería",
            "zona café"
        ],
        "dining_area": [
            "dining area",
            "dining room",
            "breakfast area",
            "zona de desayuno"
        ],
        // Rooms
        "room": [
            "room",
            "habitación",
            "bedroom",
            "dormitorio",
            "guest room"
        ],
        "suite": [
            "suite",
            "suites",
            "junior suite",
            "suite junior",
            "executive suite"
        ],
        "presidential_suite": [
            "presidential suite",
            "suite presidencial",
            "royal suite",
            "suite real"
        ],
        "king_bed": [
            "king bed",
            "cama king",
            "king size",
            "cama grande"
        ],
        "queen_bed": [
            "queen bed",
            "cama queen",
            "queen size",
            "cama mediana"
        ],
        "twin_beds": [
            "twin beds",
            "camas gemelas",
            "twin_beds",
            "camas dobles"
        ],
        "balcony": [
            "balcony",
            "balcón",
            "balcones",
            "private balcony",
            "balcón privado"
        ],
        "terrace": [
            "terrace",
            "terraza",
            "private terrace",
            "terraza privada",
            "solarium"
        ],
        // Bathrooms
        "bathroom": [
            "bathroom",
            "baño",
            "cuarto de baño",
            "ensuite",
            "baño privado"
        ],
        "bathtub": [
            "bathtub",
            "bañera",
            "freestanding tub",
            "bañera independiente",
            "clawfoot"
        ],
        "rain_shower": [
            "rain shower",
            "ducha de lluvia",
            "rainfall shower",
            "ducha efecto lluvia"
        ],
        "double_vanity": [
            "double vanity",
            "doble lavabo",
            "his and hers",
            "dos lavabos"
        ],
        // Outdoor
        "garden": [
            "garden",
            "jardín",
            "jardines",
            "landscaped garden",
            "jardín paisajista"
        ],
        "botanical_garden": [
            "botanical garden",
            "jardín botánico",
            "huerto",
            "jardín temático"
        ],
        "beach_access": [
            "beach access",
            "acceso a playa",
            "playa privada",
            "first line beach"
        ],
        "mountain_view": [
            "mountain view",
            "vista a montaña",
            "vistas montañosas",
            "sierra"
        ],
        "courtyard": [
            "courtyard",
            "patio interior",
            "patio",
            "claustro"
        ],
        // Common areas
        "lobby": [
            "lobby",
            "recepción",
            "reception",
            "hall de entrada",
            "área de check-in"
        ],
        "lounge": [
            "lounge",
            "salón",
            "sala de estar",
            "common area",
            "zona común"
        ],
        "library": [
            "library",
            "biblioteca",
            "reading room",
            "sala de lectura"
        ],
        "fireplace": [
            "fireplace",
            "chimenea",
            "fuego",
            "hogar",
            "lounge fireplace"
        ],
        // Business
        "conference_room": [
            "conference room",
            "sala de conferencias",
            "meeting room",
            "sala de juntas"
        ],
        "business_center": [
            "business center",
            "centro de negocios",
            "business area",
            "oficina"
        ],
        "av_equipment": [
            "av equipment",
            "equipo audiovisual",
            "proyector",
            "pantalla"
        ],
        // Family
        "kids_club": [
            "kids club",
            "club infantil",
            "children club",
            "miniclub"
        ],
        "playground": [
            "playground",
            "zona de juegos",
            "parque infantil",
            "área kids"
        ],
        "babysitting": [
            "babysitting",
            "canguro",
            "niñera",
            "childcare",
            "guardería"
        ],
        // Accessibility
        "wheelchair_accessible": [
            "wheelchair accessible",
            "accesible silla ruedas",
            "accesibilidad",
            "rampas"
        ],
        "adapted_bathroom": [
            "adapted bathroom",
            "baño adaptado",
            "baño accesible",
            "handrails"
        ],
        // Sustainability
        "eco_certified": [
            "eco certified",
            "certificación ecológica",
            "green key",
            "sostenible"
        ],
        "solar_panels": [
            "solar panels",
            "paneles solares",
            "energía solar",
            "fotovoltaica"
        ],
        // Views
        "sea_view": [
            "sea view",
            "vista al mar",
            "ocean view",
            "vistas marinas",
            "costa"
        ],
        "city_view": [
            "city view",
            "vista a ciudad",
            "skyline",
            "vistas urbanas"
        ],
        "panoramic_view": [
            "panoramic view",
            "vista panorámica",
            "360 view",
            "vistas completas"
        ],
        // Atmosphere/Style
        "luxury": [
            "luxury",
            "lujo",
            "luxurious",
            "premium",
            "high-end",
            "5 estrellas"
        ],
        "boutique": [
            "boutique",
            "boutique hotel",
            "diseño exclusivo",
            "hotel con encanto"
        ],
        "modern": [
            "modern",
            "moderno",
            "contemporary",
            "diseño actual",
            "minimalista"
        ],
        "rustic": [
            "rustic",
            "rústico",
            "campo",
            "natural",
            "madera",
            "piedra"
        ],
        "mediterranean": [
            "mediterranean",
            "mediterráneo",
            "blanco",
            "azul",
            "ibicenco"
        ],
        // Premium indicators
        "butler_service": [
            "butler",
            "mayordomo",
            "butler service",
            "servicio personal"
        ],
        "private_pool": [
            "private pool",
            "piscina privada",
            "piscina exclusiva",
            "solo para huéspedes"
        ],
        "vip_access": [
            "vip access",
            "acceso vip",
            "zona exclusiva",
            "membresía"
        ]
    };
    constructor(tags){
        this.tags = tags;
        this.initializeConfidenceScores();
    }
    initializeConfidenceScores() {
        Object.keys(this.SYNONYMS).forEach((amenityId)=>{
            this.confidenceScores.set(amenityId, 0);
            this.indicatorsUsed.set(amenityId, new Set());
        });
    }
    // ============================================================
    // 🔎 EXTRACCIÓN POR CATEGORÍAS
    // ============================================================
    extractPoolAmenities() {
        if (this.hasAny([
            "infinity",
            "vanishing",
            "edge",
            "horizon"
        ]) && this.hasTag("pool") && this.hasAny([
            "water",
            "sunbed",
            "umbrella"
        ])) {
            this.addConfidence("infinity_pool", 95, "piscina infinita con evidencia visual");
            this.addConfidence("pool", -30, "reemplazado por infinity_pool");
        } else if (this.hasTag("pool") && this.hasAny([
            "water",
            "swimming",
            "sunbed"
        ])) {
            this.addConfidence("pool", 85, "piscina con evidencia visual");
            if (this.hasTag("sunbed")) {
                this.addConfidence("sunbed", 10, "tumbonas en piscina");
            }
        }
        if (this.hasAny([
            "indoor",
            "covered",
            "cubierta",
            "interior"
        ]) && !this.hasTag("infinity")) {
            this.addConfidence("indoor_pool", 90, "piscina cubierta detectada");
            this.addConfidence("pool", -25, "reemplazado por indoor_pool");
        }
        if (this.hasAny([
            "heated",
            "thermal",
            "climatizada",
            "temperada"
        ])) {
            this.addConfidence("heated_pool", 88, "piscina climatizada detectada");
        }
        if (this.hasAny([
            "kids",
            "children",
            "infantil",
            "niños"
        ]) && this.hasTag("pool")) {
            this.addConfidence("kids_pool", 82, "piscina infantil detectada");
        }
        if (this.hasAny([
            "jacuzzi",
            "hot tub",
            "hidromasaje"
        ])) {
            this.addConfidence("jacuzzi", 80, "jacuzzi detectado");
        }
        if (this.hasAny([
            "pool bar",
            "bar de piscina",
            "swim-up"
        ])) {
            this.addConfidence("pool_bar", 87, "bar integrado en piscina detectado");
        }
    }
    extractWellnessAmenities() {
        if (this.hasAny([
            "spa",
            "wellness",
            "centro de spa"
        ])) {
            this.addConfidence("spa", 92, "spa detectado");
            if (this.hasAny([
                "sauna",
                "sauna finlandesa"
            ])) this.addConfidence("sauna", 88, "sauna detectada");
            if (this.hasAny([
                "steam",
                "vapor",
                "hammam",
                "turkish bath"
            ])) this.addConfidence("steam_room", 86, "baño de vapor detectado");
            if (this.hasAny([
                "massage",
                "masaje",
                "treatment"
            ])) this.addConfidence("spa", 15, "servicios de masaje detectados");
            if (this.hasAny([
                "relaxation",
                "quiet room",
                "zona relax"
            ])) this.addConfidence("spa", 10, "área de relajación detectada");
        }
        if (this.hasAny([
            "gym",
            "fitness",
            "gimnasio"
        ])) {
            this.addConfidence("gym", 85, "gimnasio detectado");
            if (this.hasAny([
                "yoga",
                "meditation",
                "pilates"
            ])) this.addConfidence("yoga", 83, "sala de yoga/meditación detectada");
            if (this.hasAny([
                "personal trainer",
                "entrenador"
            ])) this.addConfidence("gym", 15, "servicio de entrenador personal");
        }
    }
    extractDiningAmenities() {
        const isRoomContext = this.hasAny([
            "room",
            "suite",
            "bedroom",
            "king bed",
            "queen bed",
            "twin_beds"
        ]);
        const isPureRestaurant = this.hasAny([
            "restaurant",
            "restaurante"
        ]) && !isRoomContext;
        if (isPureRestaurant) {
            this.addConfidence("restaurant", 88, "restaurante detectado");
            if (this.hasAny([
                "buffet",
                "bufé",
                "desayuno"
            ])) this.addConfidence("buffet", 84, "zona de buffet detectada");
            if (this.hasAny([
                "fine dining",
                "gourmet",
                "chef"
            ])) this.addConfidence("restaurant", 15, "restaurante gourmet detectado");
            if (this.hasAny([
                "rooftop",
                "azotea"
            ]) && this.hasTag("restaurant")) {
                this.addConfidence("restaurant", -20, "reemplazado por rooftop_bar si aplica");
            }
        }
        if (this.hasAny([
            "dining area",
            "dining room",
            "breakfast area"
        ]) && isRoomContext) {
            if (this.hasAny([
                "breakfast",
                "morning",
                "food",
                "plate",
                "cup"
            ])) {
                this.addConfidence("dining_area", 85, "zona de desayuno en habitación detectada");
            }
        }
        if (this.hasAny([
            "bar",
            "cocktail",
            "barra"
        ])) {
            this.addConfidence("bar", 86, "bar detectado");
            if (this.hasAny([
                "rooftop",
                "sky bar",
                "azotea"
            ]) && this.hasTag("bar")) {
                this.addConfidence("rooftop_bar", 93, "bar en azotea detectado");
                this.addConfidence("bar", -40, "reemplazado por rooftop_bar");
            }
            if (this.hasTag("pool") && this.hasTag("bar")) {
                this.addConfidence("pool_bar", 91, "bar de piscina detectado");
                this.addConfidence("bar", -35, "reemplazado por pool_bar");
            }
            if (this.hasAny([
                "beach",
                "playa"
            ]) && this.hasTag("bar")) {
                this.addConfidence("beach_bar", 89, "chiringuito/bar playero detectado");
                this.addConfidence("bar", -30, "reemplazado por beach_bar");
            }
            if (this.hasAny([
                "wine",
                "bodega",
                "vinos"
            ])) this.addConfidence("bar", 10, "especialidad en vinos detectada");
        }
        if (this.hasAny([
            "cafe",
            "cafetería",
            "coffee",
            "pastelería"
        ])) {
            this.addConfidence("cafe", 80, "cafetería detectada");
        }
        // ✅ ELIMINAR "sunbed" en contexto de restaurante
        if (isPureRestaurant && this.hasTag("sunbed")) {
            this.removeConfidence("sunbed", 100, "sunbed no es relevante en restaurante");
        }
    }
    extractRoomAmenities() {
        if (this.hasAny([
            "room",
            "habitación",
            "bedroom"
        ])) {
            this.addConfidence("room", 82, "habitación detectada");
            if (this.hasAny([
                "twin beds",
                "camas gemelas",
                "twin_beds",
                "camas dobles"
            ])) {
                this.addConfidence("twin_beds", 90, "camas gemelas detectadas");
            }
            if (this.hasAny([
                "king bed",
                "cama king",
                "king size"
            ])) {
                this.addConfidence("king_bed", 85, "cama king size detectada");
            }
            if (this.hasAny([
                "queen bed",
                "cama queen",
                "queen size"
            ])) {
                this.addConfidence("queen_bed", 83, "cama queen size detectada");
            }
            if (this.hasAny([
                "suite",
                "suites"
            ])) {
                this.addConfidence("suite", 90, "suite detectada");
                this.addConfidence("room", -35, "reemplazado por suite");
                if (this.hasAny([
                    "presidential",
                    "royal",
                    "real",
                    "presidencial"
                ])) {
                    this.addConfidence("presidential_suite", 96, "suite presidencial detectada");
                    this.addConfidence("suite", -25, "reemplazado por presidential_suite");
                }
            }
            if (this.hasAny([
                "balcony",
                "balcón",
                "terraza privada"
            ])) {
                this.addConfidence("balcony", 87, "balcón/terraza privada detectada");
            }
            if (this.hasAny([
                "sea view",
                "vista al mar",
                "ocean view"
            ]) && this.hasTag("room")) {
                this.addConfidence("room", 20, "habitación con vistas premium");
            }
        }
    }
    extractBathroomAmenities() {
        if (this.hasAny([
            "bathroom",
            "baño",
            "cuarto de baño"
        ])) {
            this.addConfidence("bathroom", 80, "baño detectado");
            if (this.hasAny([
                "bathtub",
                "bañera",
                "freestanding",
                "clawfoot"
            ])) {
                this.addConfidence("bathtub", 88, "bañera freestanding detectada");
            }
            if (this.hasAny([
                "rain shower",
                "ducha lluvia",
                "rainfall"
            ])) {
                this.addConfidence("rain_shower", 86, "ducha de lluvia detectada");
            }
            if (this.hasAny([
                "double vanity",
                "doble lavabo",
                "his and hers"
            ])) {
                this.addConfidence("double_vanity", 84, "doble lavabo detectado");
            }
            if (this.hasAny([
                "heated floors",
                "suelo radiante"
            ])) {
                this.addConfidence("bathroom", 15, "suelo radiante detectado");
            }
        }
    }
    extractOutdoorAmenities() {
        if (this.hasAny([
            "garden",
            "jardín",
            "landscaped",
            "verde"
        ])) {
            this.addConfidence("garden", 83, "jardín detectado");
            if (this.hasAny([
                "botanical",
                "botánico",
                "huerto"
            ])) {
                this.addConfidence("botanical_garden", 89, "jardín botánico detectado");
                this.addConfidence("garden", -20, "especializado como botanical_garden");
            }
            if (this.hasAny([
                "zen",
                "japonés",
                "meditación"
            ])) {
                this.addConfidence("garden", 15, "jardín zen detectado");
            }
        }
        if (this.hasAny([
            "beach",
            "playa",
            "shoreline",
            "costa"
        ])) {
            this.addConfidence("beach_access", 94, "acceso a playa detectado");
            if (this.hasAny([
                "private beach",
                "playa privada",
                "first line"
            ])) {
                this.addConfidence("beach_access", 15, "playa privada/exclusiva");
            }
        }
        if (this.hasAny([
            "mountain",
            "montaña",
            "hill",
            "valley"
        ])) {
            this.addConfidence("mountain_view", 85, "vistas a montaña detectadas");
        }
        if (this.hasAny([
            "courtyard",
            "patio",
            "claustro",
            "patio interior"
        ])) {
            this.addConfidence("courtyard", 82, "patio interior detectado");
        }
        if (this.hasAny([
            "terrace",
            "terraza",
            "solarium",
            "rooftop"
        ])) {
            if (!this.hasTag("restaurant") && !this.hasTag("room")) {
                this.addConfidence("terrace", 80, "terraza general detectada");
            }
        }
    }
    extractCommonAreasAmenities() {
        if (this.hasAny([
            "lobby",
            "recepción",
            "reception",
            "check-in"
        ])) {
            this.addConfidence("lobby", 87, "lobby/recepción detectado");
            if (this.hasAny([
                "grand",
                "monumental",
                "impresionante"
            ])) {
                this.addConfidence("lobby", 15, "lobby de diseño monumental");
            }
        }
        if (this.hasAny([
            "lounge",
            "salón",
            "sala de estar",
            "common area"
        ])) {
            this.addConfidence("lounge", 84, "salón de estar detectado");
            if (this.hasAny([
                "fireplace",
                "chimenea",
                "hogar"
            ])) {
                this.addConfidence("fireplace", 86, "chimenea en salón detectada");
            }
        }
        if (this.hasAny([
            "library",
            "biblioteca",
            "reading room",
            "lectura"
        ])) {
            this.addConfidence("library", 81, "biblioteca/sala de lectura detectada");
        }
    }
    extractBusinessAmenities() {
        if (this.hasAny([
            "conference",
            "reunión",
            "meeting",
            "juntas"
        ])) {
            this.addConfidence("conference_room", 88, "sala de conferencias detectada");
        }
        if (this.hasAny([
            "business center",
            "centro negocios",
            "oficina"
        ])) {
            this.addConfidence("business_center", 85, "centro de negocios detectado");
        }
        if (this.hasAny([
            "av equipment",
            "audiovisual",
            "proyector",
            "pantalla"
        ])) {
            this.addConfidence("av_equipment", 82, "equipo audiovisual detectado");
        }
        if (this.hasAny([
            "coworking",
            "espacio coworking",
            "trabajo compartido"
        ])) {
            this.addConfidence("business_center", 15, "zona de coworking detectada");
        }
    }
    extractFamilyAmenities() {
        if (this.hasAny([
            "kids club",
            "club infantil",
            "miniclub",
            "children"
        ])) {
            this.addConfidence("kids_club", 90, "club infantil detectado");
        }
        if (this.hasAny([
            "playground",
            "zona juegos",
            "parque infantil"
        ])) {
            this.addConfidence("playground", 86, "zona de juegos detectada");
        }
        if (this.hasAny([
            "babysitting",
            "canguro",
            "niñera",
            "childcare"
        ])) {
            this.addConfidence("babysitting", 84, "servicio de canguro detectado");
        }
        if (this.hasAny([
            "family room",
            "habitación familiar",
            "conecting rooms"
        ])) {
            this.addConfidence("room", 15, "habitación familiar detectada");
        }
    }
    extractAccessibilityAmenities() {
        if (this.hasAny([
            "wheelchair",
            "silla ruedas",
            "accesible",
            "rampas"
        ])) {
            this.addConfidence("wheelchair_accessible", 92, "accesibilidad para silla de ruedas detectada");
        }
        if (this.hasAny([
            "adapted bathroom",
            "baño adaptado",
            "handrails",
            "barras"
        ])) {
            this.addConfidence("adapted_bathroom", 88, "baño adaptado detectado");
        }
        if (this.hasAny([
            "elevator",
            "ascensor",
            "lift"
        ])) {
            this.addConfidence("wheelchair_accessible", 10, "ascensor disponible");
        }
    }
    extractSustainabilityAmenities() {
        if (this.hasAny([
            "eco",
            "sostenible",
            "green",
            "ecológico"
        ])) {
            this.addConfidence("eco_certified", 85, "certificación ecológica detectada");
        }
        if (this.hasAny([
            "solar panels",
            "paneles solares",
            "energía solar"
        ])) {
            this.addConfidence("solar_panels", 88, "paneles solares detectados");
        }
        if (this.hasAny([
            "organic garden",
            "huerto ecológico",
            "farm to table"
        ])) {
            this.addConfidence("eco_certified", 15, "huerto orgánico detectado");
        }
        if (this.hasAny([
            "water saving",
            "ahorro agua",
            "rainwater"
        ])) {
            this.addConfidence("eco_certified", 10, "sistemas de ahorro de agua");
        }
    }
    extractViewAmenities() {
        if (this.hasAny([
            "sea view",
            "vista al mar",
            "ocean view",
            "mar"
        ])) {
            this.addConfidence("sea_view", 93, "vistas al mar detectadas");
        }
        if (this.hasAny([
            "city view",
            "vista ciudad",
            "skyline",
            "urbano"
        ])) {
            this.addConfidence("city_view", 87, "vistas a ciudad detectadas");
        }
        if (this.hasAny([
            "mountain view",
            "vista montaña",
            "sierra",
            "valle"
        ])) {
            this.addConfidence("mountain_view", 86, "vistas a montaña detectadas");
        }
        if (this.hasAny([
            "panoramic",
            "360",
            "completa",
            "amplia vista"
        ])) {
            this.addConfidence("panoramic_view", 91, "vista panorámica detectada");
        }
        if (this.hasAny([
            "garden view",
            "vista jardín",
            "patio vista"
        ])) {
            this.addConfidence("garden_view", 82, "vistas a jardín detectadas");
        }
    }
    extractAtmosphereAmenities() {
        if (this.hasAny([
            "luxury",
            "lujo",
            "premium",
            "high-end",
            "5 estrellas"
        ])) {
            this.addConfidence("luxury", 95, "lujo detectado");
        }
        if (this.hasAny([
            "boutique",
            "diseño exclusivo",
            "encanto",
            "personalizado"
        ])) {
            this.addConfidence("boutique", 90, "estilo boutique detectado");
        }
        if (this.hasAny([
            "modern",
            "moderno",
            "contemporary",
            "minimalista"
        ])) {
            this.addConfidence("modern", 85, "diseño moderno detectado");
        }
        if (this.hasAny([
            "rustic",
            "rústico",
            "campo",
            "madera",
            "piedra"
        ])) {
            this.addConfidence("rustic", 83, "estilo rústico detectado");
        }
        if (this.hasAny([
            "mediterranean",
            "mediterráneo",
            "blanco",
            "azul",
            "ibiza"
        ])) {
            this.addConfidence("mediterranean", 87, "estilo mediterráneo detectado");
        }
        if (this.hasAny([
            "cozy",
            "acogedor",
            "cálido",
            "intimate"
        ])) {
            this.addConfidence("cozy", 84, "ambiente acogedor detectado");
        }
        if (this.hasAny([
            "romantic",
            "romántico",
            "parejas",
            "luna miel"
        ])) {
            this.addConfidence("romantic", 89, "ambiente romántico detectado");
        }
    }
    extractPremiumAmenities() {
        if (this.hasAny([
            "butler",
            "mayordomo",
            "servicio personal"
        ])) {
            this.addConfidence("butler_service", 94, "servicio de mayordomo detectado");
        }
        if (this.hasAny([
            "private pool",
            "piscina privada",
            "exclusiva"
        ]) && this.hasTag("suite")) {
            this.addConfidence("private_pool", 92, "piscina privada para suite detectada");
        }
        if (this.hasAny([
            "vip access",
            "acceso vip",
            "exclusivo",
            "membresía"
        ])) {
            this.addConfidence("vip_access", 88, "acceso VIP detectado");
        }
        if (this.hasAny([
            "concierge",
            "conserje",
            "servicio 24h"
        ])) {
            this.addConfidence("premium", 85, "servicio de conserjería detectado");
        }
    }
    // ============================================================
    // 🧠 MÉTODOS AUXILIARES
    // ============================================================
    hasTag(tag) {
        return this.tags.some((t)=>t === tag || t.includes(` ${tag} `) || t.startsWith(`${tag} `) || t.endsWith(` ${tag}`));
    }
    hasAny(tags) {
        return tags.some((tag)=>this.hasTag(tag));
    }
    addConfidence(amenityId, points, reason) {
        const current = this.confidenceScores.get(amenityId) || 0;
        const newScore = Math.max(0, current + points);
        this.confidenceScores.set(amenityId, newScore);
        if (points > 0) {
            const synonyms = this.SYNONYMS[amenityId] || [];
            const matchingSynonyms = synonyms.filter((s)=>this.tags.includes(s.toLowerCase().trim()));
            if (matchingSynonyms.length > 0) {
                const set = this.indicatorsUsed.get(amenityId) || new Set();
                matchingSynonyms.forEach((syn)=>set.add(syn));
                this.indicatorsUsed.set(amenityId, set);
            }
        }
    }
    removeConfidence(amenityId, points, reason) {
        const current = this.confidenceScores.get(amenityId) || 0;
        const newScore = Math.max(0, current - points);
        this.confidenceScores.set(amenityId, newScore);
    }
    // ============================================================
    // 🚀 EJECUCIÓN PRINCIPAL
    // ============================================================
    extract() {
        this.extractPoolAmenities();
        this.extractWellnessAmenities();
        this.extractDiningAmenities();
        this.extractRoomAmenities();
        this.extractBathroomAmenities();
        this.extractOutdoorAmenities();
        this.extractCommonAreasAmenities();
        this.extractBusinessAmenities();
        this.extractFamilyAmenities();
        this.extractAccessibilityAmenities();
        this.extractSustainabilityAmenities();
        this.extractViewAmenities();
        this.extractAtmosphereAmenities();
        this.extractPremiumAmenities();
        this.buildAmenitiesList();
        const byCategory = {
            pool: [],
            wellness: [],
            dining: [],
            room: [],
            bathroom: [],
            outdoor: [],
            common_areas: [],
            business: [],
            family: [],
            accessibility: [],
            sustainability: [],
            views: [],
            atmosphere: [],
            premium: []
        };
        this.amenities.forEach((amenity)=>{
            const cat = this.getCategoryForAmenity(amenity.id);
            if (byCategory[cat]) {
                byCategory[cat].push(amenity);
            }
        });
        const premium = this.amenities.filter((a)=>a.isPremium || a.confidence === "high").sort((a, b)=>(b.confidence === "high" ? 1 : 0) - (a.confidence === "high" ? 1 : 0) || b.id.localeCompare(a.id)).slice(0, 8);
        const flat = this.amenities.map((a)=>a.id).filter((value, index, self)=>self.indexOf(value) === index);
        const hasPool = this.amenities.some((a)=>a.category === "pool");
        const hasSpa = this.amenities.some((a)=>a.category === "wellness" && a.id === "spa");
        const hasRestaurant = this.amenities.some((a)=>a.category === "dining" && a.id === "restaurant");
        const hasBar = this.amenities.some((a)=>a.category === "dining" && a.id.includes("bar"));
        const hasSeaView = this.amenities.some((a)=>a.category === "views" && a.id === "sea_view");
        const isLuxury = this.amenities.some((a)=>a.category === "atmosphere" && a.id === "luxury");
        const isBoutique = this.amenities.some((a)=>a.category === "atmosphere" && a.id === "boutique");
        const isFamilyFriendly = this.amenities.some((a)=>a.category === "family");
        const isBusinessReady = this.amenities.some((a)=>a.category === "business");
        const isWellnessOriented = hasSpa || this.amenities.some((a)=>a.category === "wellness" && [
                "sauna",
                "steam_room",
                "gym"
            ].includes(a.id));
        const avgConfidence = this.amenities.length > 0 ? Math.round(this.amenities.reduce((sum, a)=>sum + (a.confidence === "high" ? 90 : a.confidence === "medium" ? 70 : 50), 0) / this.amenities.length) : 40;
        // ✅ CORRECCIÓN: Incluir 'amenities' en el objeto retornado
        return {
            amenities: this.amenities,
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
        };
    }
    buildAmenitiesList() {
        this.amenities = [];
        for (const [amenityId, score] of this.confidenceScores.entries()){
            if (score >= 60) {
                const confidence = score >= 85 ? "high" : score >= 70 ? "medium" : "low";
                const indicators = Array.from(this.indicatorsUsed.get(amenityId) || []);
                const isPremium = [
                    "infinity_pool",
                    "presidential_suite",
                    "private_pool",
                    "butler_service",
                    "beach_access",
                    "panoramic_view",
                    "rooftop_bar",
                    "botanical_garden",
                    "luxury",
                    "boutique"
                ].includes(amenityId) || score >= 90;
                this.amenities.push({
                    id: amenityId,
                    name: this.getHumanName(amenityId),
                    category: this.getCategoryForAmenity(amenityId),
                    confidence,
                    indicators,
                    isPremium
                });
            }
        }
        this.removeRedundancies();
    }
    removeRedundancies() {
        const toRemove = new Set();
        if (this.amenities.some((a)=>a.id === "infinity_pool")) toRemove.add("pool");
        if (this.amenities.some((a)=>a.id === "presidential_suite")) toRemove.add("suite");
        if (this.amenities.some((a)=>a.id === "indoor_pool") && !this.amenities.some((a)=>a.id === "infinity_pool")) {
            toRemove.add("pool");
        }
        if (this.amenities.some((a)=>a.id === "rooftop_bar")) toRemove.add("bar");
        if (this.amenities.some((a)=>a.id === "pool_bar") && !this.amenities.some((a)=>a.id === "rooftop_bar")) {
            toRemove.add("bar");
        }
        this.amenities = this.amenities.filter((a)=>!toRemove.has(a.id));
    }
    getCategoryForAmenity(amenityId) {
        const mapping = {
            "pool": "pool",
            "infinity_pool": "pool",
            "indoor_pool": "pool",
            "heated_pool": "pool",
            "kids_pool": "pool",
            "jacuzzi": "pool",
            "pool_bar": "pool",
            "spa": "wellness",
            "sauna": "wellness",
            "steam_room": "wellness",
            "massage": "wellness",
            "gym": "wellness",
            "yoga": "wellness",
            "restaurant": "dining",
            "buffet": "dining",
            "bar": "dining",
            "rooftop_bar": "dining",
            "beach_bar": "dining",
            "cafe": "dining",
            "dining_area": "dining",
            "room": "room",
            "suite": "room",
            "presidential_suite": "room",
            "king_bed": "room",
            "queen_bed": "room",
            "twin_beds": "room",
            "balcony": "room",
            "terrace": "room",
            "bathroom": "bathroom",
            "bathtub": "bathroom",
            "rain_shower": "bathroom",
            "double_vanity": "bathroom",
            "garden": "outdoor",
            "botanical_garden": "outdoor",
            "beach_access": "outdoor",
            "mountain_view": "outdoor",
            "courtyard": "outdoor",
            "lobby": "common_areas",
            "lounge": "common_areas",
            "library": "common_areas",
            "fireplace": "common_areas",
            "conference_room": "business",
            "business_center": "business",
            "av_equipment": "business",
            "kids_club": "family",
            "playground": "family",
            "babysitting": "family",
            "wheelchair_accessible": "accessibility",
            "adapted_bathroom": "accessibility",
            "eco_certified": "sustainability",
            "solar_panels": "sustainability",
            "sea_view": "views",
            "city_view": "views",
            "panoramic_view": "views",
            "garden_view": "views",
            "luxury": "atmosphere",
            "boutique": "atmosphere",
            "modern": "atmosphere",
            "rustic": "atmosphere",
            "mediterranean": "atmosphere",
            "cozy": "atmosphere",
            "romantic": "atmosphere",
            "butler_service": "premium",
            "private_pool": "premium",
            "vip_access": "premium"
        };
        return mapping[amenityId] || "atmosphere";
    }
    getHumanName(amenityId) {
        const names = {
            "pool": "Piscina",
            "infinity_pool": "Piscina infinita",
            "indoor_pool": "Piscina cubierta",
            "heated_pool": "Piscina climatizada",
            "kids_pool": "Piscina infantil",
            "jacuzzi": "Jacuzzi",
            "pool_bar": "Bar de piscina",
            "spa": "Spa",
            "sauna": "Sauna",
            "steam_room": "Baño de vapor",
            "massage": "Masajes",
            "gym": "Gimnasio",
            "yoga": "Sala de yoga",
            "restaurant": "Restaurante",
            "buffet": "Zona de buffet",
            "bar": "Bar",
            "rooftop_bar": "Bar en azotea",
            "beach_bar": "Chiringuito",
            "cafe": "Cafetería",
            "dining_area": "Zona de desayuno",
            "room": "Habitación",
            "suite": "Suite",
            "presidential_suite": "Suite presidencial",
            "king_bed": "Cama king size",
            "queen_bed": "Cama queen size",
            "twin_beds": "Dos camas",
            "balcony": "Balcón privado",
            "terrace": "Terraza",
            "bathroom": "Baño privado",
            "bathtub": "Bañera",
            "rain_shower": "Ducha de lluvia",
            "double_vanity": "Doble lavabo",
            "garden": "Jardín",
            "botanical_garden": "Jardín botánico",
            "beach_access": "Acceso a playa",
            "mountain_view": "Vistas a montaña",
            "courtyard": "Patio interior",
            "lobby": "Lobby",
            "lounge": "Salón de estar",
            "library": "Biblioteca",
            "fireplace": "Chimenea",
            "conference_room": "Sala de conferencias",
            "business_center": "Centro de negocios",
            "av_equipment": "Equipo audiovisual",
            "kids_club": "Club infantil",
            "playground": "Zona de juegos",
            "babysitting": "Servicio de canguro",
            "wheelchair_accessible": "Accesible para silla de ruedas",
            "adapted_bathroom": "Baño adaptado",
            "eco_certified": "Certificación ecológica",
            "solar_panels": "Paneles solares",
            "sea_view": "Vistas al mar",
            "city_view": "Vistas a la ciudad",
            "panoramic_view": "Vistas panorámicas",
            "garden_view": "Vistas al jardín",
            "luxury": "Lujo",
            "boutique": "Estilo boutique",
            "modern": "Diseño moderno",
            "rustic": "Estilo rústico",
            "mediterranean": "Estilo mediterráneo",
            "cozy": "Ambiente acogedor",
            "romantic": "Ambiente romántico",
            "butler_service": "Servicio de mayordomo",
            "private_pool": "Piscina privada",
            "vip_access": "Acceso VIP"
        };
        return names[amenityId] || amenityId.replace(/_/g, " ");
    }
}
function extractAmenitiesSimple(tags) {
    const extraction = extractAmenities(tags);
    return extraction.flat;
}
function generateAmenityBadges(extraction) {
    const BADGE_CONFIG = {
        "infinity_pool": {
            color: "amber",
            priority: 100
        },
        "presidential_suite": {
            color: "rose",
            priority: 95
        },
        "private_pool": {
            color: "amber",
            priority: 90
        },
        "beach_access": {
            color: "emerald",
            priority: 88
        },
        "panoramic_view": {
            color: "indigo",
            priority: 87
        },
        "rooftop_bar": {
            color: "violet",
            priority: 85
        },
        "butler_service": {
            color: "rose",
            priority: 84
        },
        "spa": {
            color: "indigo",
            priority: 80
        },
        "sauna": {
            color: "amber",
            priority: 78
        },
        "steam_room": {
            color: "amber",
            priority: 77
        },
        "gym": {
            color: "blue",
            priority: 75
        },
        "restaurant": {
            color: "emerald",
            priority: 73
        },
        "pool_bar": {
            color: "sky",
            priority: 70
        },
        "sea_view": {
            color: "sky",
            priority: 68
        },
        "mountain_view": {
            color: "green",
            priority: 66
        },
        "luxury": {
            color: "gold",
            priority: 65
        },
        "boutique": {
            color: "purple",
            priority: 64
        },
        "kids_club": {
            color: "pink",
            priority: 60
        },
        "pool": {
            color: "sky",
            priority: 55
        },
        "suite": {
            color: "purple",
            priority: 54
        },
        "bar": {
            color: "amber",
            priority: 52
        },
        "garden": {
            color: "green",
            priority: 50
        },
        "lobby": {
            color: "gray",
            priority: 45
        }
    };
    return extraction.premium.map((amenity)=>{
        const config = BADGE_CONFIG[amenity.id] || {
            color: "gray",
            priority: 30
        };
        return {
            id: amenity.id,
            label: amenity.name,
            color: config.color,
            priority: config.priority
        };
    }).sort((a, b)=>b.priority - a.priority).slice(0, 6);
}
function searchAmenities(extraction, query) {
    const q = query.toLowerCase().trim();
    // ✅ Ahora funciona porque 'amenities' está en la interfaz
    return extraction.amenities?.filter((amenity)=>amenity.id.includes(q) || amenity.name.toLowerCase().includes(q) || amenity.category.includes(q)) || [];
}
}),
"[project]/src/app/api/upload/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
// src/app/api/upload/route.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cloudinary$2f$cloudinary$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/cloudinary/cloudinary.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$externals$5d2f$buffer__$5b$external$5d$__$28$buffer$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/buffer [external] (buffer, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$sharp__$5b$external$5d$__$28$sharp$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$sharp$29$__ = __turbopack_context__.i("[externals]/sharp [external] (sharp, cjs, [project]/node_modules/sharp)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/ai.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$normalizeTags$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/normalizeTags.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$detectCategoryVision$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/detectCategoryVision.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$extractAmenities$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/extractAmenities.ts [app-route] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
// ==================== VALIDACIÓN ENV ====================
if (!process.env.CLOUDINARY_CLOUD_NAME) throw new Error("❌ CLOUDINARY_CLOUD_NAME no está definido");
if (!process.env.CLOUDINARY_API_KEY) throw new Error("❌ CLOUDINARY_API_KEY no está definido");
if (!process.env.CLOUDINARY_API_SECRET) throw new Error("❌ CLOUDINARY_API_SECRET no está definido");
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cloudinary$2f$cloudinary$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["v2"].config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
// ==================== SUPABASE ====================
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(("TURBOPACK compile-time value", "https://konsrtuynhzqssakgdlw.supabase.co"), ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvbnNydHV5bmh6cXNzYWtnZGx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NjAyNjQsImV4cCI6MjA4NTEzNjI2NH0.jQryirwSpavWFeVMTBim19mQEccAArqBtwi_4-r4KsY"));
// ==================== CONFIGURACIÓN ====================
const IMAGE_SIZES = {
    thumbnail: {
        width: 256,
        height: 144
    },
    small: {
        width: 800,
        height: 450
    },
    medium: {
        width: 1920,
        height: 1080
    },
    large: {
        width: 2880,
        height: 1620
    }
};
async function POST(request) {
    const requestId = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].randomUUID().slice(0, 8);
    console.log(`🚀 [${requestId}] POST /api/upload iniciado`);
    try {
        const formData = await request.formData();
        const file = formData.get("file");
        const hotelId = formData.get("hotel_id");
        if (!file || !(file instanceof File)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Archivo inválido"
            }, {
                status: 400
            });
        }
        if (!hotelId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Falta hotel_id"
            }, {
                status: 400
            });
        }
        if (file.size > 5 * 1024 * 1024) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Archivo demasiado grande (máx. 5MB)"
            }, {
                status: 400
            });
        }
        // ==================== BUFFER ====================
        const arrayBuffer = await file.arrayBuffer();
        const buffer = __TURBOPACK__imported__module__$5b$externals$5d2f$buffer__$5b$external$5d$__$28$buffer$2c$__cjs$29$__["Buffer"].from(arrayBuffer);
        // ==================== HASH ====================
        const hash = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].createHash("sha256").update(buffer).digest("hex");
        // ==================== CHECK DUPLICADO ====================
        const { data: existing } = await supabase.from("image_hashes").select("url").eq("hash", hash).single();
        if (existing) {
            console.log(`✅ [${requestId}] Imagen duplicada detectada`);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                url: existing.url,
                is_duplicate: true,
                message: "Esta imagen ya existe en tu galería"
            });
        }
        // ==================== UPLOAD CLOUDINARY ====================
        console.log(`☁️ [${requestId}] Subiendo a Cloudinary...`);
        const uploadResult = await new Promise((resolve, reject)=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cloudinary$2f$cloudinary$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["v2"].uploader.upload_stream({
                folder: "hotel-media",
                resource_type: "image",
                quality_analysis: true
            }, (error, result)=>{
                if (error) reject(error);
                else resolve(result);
            }).end(buffer);
        });
        console.log(`✅ [${requestId}] Cloudinary OK: ${uploadResult.secure_url.substring(0, 60)}...`);
        // ==================== 🤖 PASO 1: IA ANALYSIS (BACKEND ENSEMBLE) ====================
        console.log(`🤖 [${requestId}] Paso 1: Analizando con backend ensemble...`);
        let backendResult;
        try {
            backendResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["analyzeImage"])(uploadResult.secure_url, 0.20);
            console.log(`✅ [${requestId}] Backend result:`, {
                categoria: backendResult.categoria,
                ubicacion: backendResult.ubicacion,
                tags: backendResult.tags,
                titulo: backendResult.titulo_sugerido?.substring(0, 60),
                confidence: backendResult.confidence,
                tagsCount: backendResult.tags?.length || 0
            });
        } catch (error) {
            console.error(`❌ [${requestId}] Error en analyzeImage: ${error.message}`);
            // Fallback mínimo
            backendResult = {
                tags: [
                    "hotel"
                ],
                objects: [],
                caption: "",
                categoria: "otros",
                ubicacion: "interior",
                titulo_sugerido: "",
                tags_confidence: {},
                confidence: 0.3,
                processing_time_ms: -1,
                model_version: "fallback"
            };
        }
        // ==================== 🧼 PASO 2: NORMALIZAR TAGS ====================
        console.log(`🧼 [${requestId}] Paso 2: Normalizando tags...`);
        const tagsWithScores = backendResult.tags.map((tag)=>({
                label: tag,
                score: backendResult.tags_confidence?.[tag] || 0.5
            }));
        const normalizedTags = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$normalizeTags$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeTags"])(tagsWithScores, {
            tags_confidence: backendResult.tags_confidence,
            categoria_context: backendResult.categoria,
            ubicacion_context: backendResult.ubicacion,
            min_confidence: 0.2,
            prefer_backend_scores: true
        });
        console.log(`✅ [${requestId}] Tags normalizados: ${JSON.stringify(normalizedTags)}`);
        // ==================== 🏷️ PASO 3: DETECTAR CATEGORÍA ====================
        console.log(`🏷️ [${requestId}] Paso 3: Detectando categoría...`);
        const categoryDetection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$detectCategoryVision$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["detectCategoryVision"])(normalizedTags, {
            backendCategoria: backendResult.categoria,
            backendUbicacion: backendResult.ubicacion,
            tagsConfidence: backendResult.tags_confidence,
            minBackendConfidence: 0.4
        });
        const category = categoryDetection.primary;
        console.log(`✅ [${requestId}] Categoría: ${category} (source: ${categoryDetection.source})`);
        // ==================== 🏨 PASO 4: EXTRAER AMENITIES ====================
        console.log(`🏨 [${requestId}] Paso 4: Extrayendo amenities...`);
        const amenitiesResult = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$extractAmenities$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractAmenities"])(normalizedTags);
        // ✅ CORREGIDO: extractAmenities devuelve un OBJETO, extraer array correctamente
        const amenitiesArray = extractAmenityTags(amenitiesResult);
        console.log(`✅ [${requestId}] Amenities extraídos: ${JSON.stringify(amenitiesArray)}`);
        // ==================== 🌍 PASO 5: ANALIZAR ESCENA ====================
        console.log(`🌍 [${requestId}] Paso 5: Analizando escena...`);
        const sceneAnalysis = {
            scene: categoryDetection.secondary?.[0] || "ambiguous",
            confidence: categoryDetection.confidence
        };
        console.log(`✅ [${requestId}] Escena: ${sceneAnalysis.scene}`);
        // ==================== ✨ PASO 6: FILTRAR TAGS POR CATEGORÍA ====================
        console.log(`✨ [${requestId}] Paso 6: Filtrando tags por categoría...`);
        const filteredTags = normalizedTags.filter((tag)=>{
            const categoryTags = {
                piscina: [
                    "pool",
                    "piscina",
                    "water",
                    "sunbed",
                    "umbrella",
                    "exterior"
                ],
                habitacion: [
                    "room",
                    "bed",
                    "suite",
                    "balcony",
                    "interior"
                ],
                restaurante: [
                    "restaurant",
                    "dining",
                    "table",
                    "buffet"
                ],
                exterior: [
                    "exterior",
                    "facade",
                    "building",
                    "sky",
                    "garden"
                ]
            };
            const validTags = categoryTags[category] || [];
            return validTags.length === 0 || validTags.some((t)=>tag.includes(t));
        });
        console.log(`✅ [${requestId}] Tags filtrados: ${JSON.stringify(filteredTags)}`);
        // ==================== 🖼️ PASO 7: EVALUAR CALIDAD ====================
        console.log(`🖼️ [${requestId}] Paso 7: Evaluando calidad...`);
        const qualityScore = uploadResult.quality_analysis?.overall_score || 70;
        console.log(`✅ [${requestId}] Calidad: ${qualityScore}`);
        // ==================== ✍️ PASO 8: GENERAR TÍTULO ====================
        console.log(`✍️ [${requestId}] Paso 8: Generando título...`);
        let finalTitle;
        if (backendResult.titulo_sugerido && backendResult.titulo_sugerido.length > 15) {
            finalTitle = backendResult.titulo_sugerido;
            console.log(`✅ [${requestId}] Usando título del backend: "${finalTitle}"`);
        } else {
            console.log(`🔧 [${requestId}] Backend no dio título válido, generando fallback...`);
            const titleParts = [];
            const categoryLabels = {
                piscina: "Piscina",
                habitacion: "Habitación",
                restaurante: "Restaurante",
                bar: "Bar",
                spa: "Spa",
                lobby: "Lobby",
                exterior: "Vista exterior",
                playa: "Playa",
                gimnasio: "Gimnasio"
            };
            if (categoryLabels[category]) {
                titleParts.push(categoryLabels[category]);
            }
            if (normalizedTags.some((t)=>/vista|view|mar|sea/.test(t))) {
                titleParts.push("con vistas");
            }
            if (normalizedTags.some((t)=>/lujo|luxury|premium/.test(t))) {
                titleParts.push("de lujo");
            }
            finalTitle = titleParts.length > 0 ? titleParts.join(" ") : "Espacio del hotel";
            console.log(`✅ [${requestId}] Título fallback: "${finalTitle}"`);
        }
        // ==================== 🔍 PASO 9: FUSIONAR TAGS FINALES ====================
        console.log(`🔍 [${requestId}] Paso 9: Fusionando tags...`);
        const finalTags = [
            ...new Set([
                ...filteredTags,
                ...amenitiesArray
            ])
        ].filter((t)=>t && typeof t === 'string' && t.length >= 2).slice(0, 15);
        console.log(`✅ [${requestId}] Tags finales: ${JSON.stringify(finalTags)}`);
        // ==================== 💾 GUARDAR EN SUPABASE ====================
        console.log(`💾 [${requestId}] Guardando en Supabase...`);
        // ==================== UPLOAD VERSIONES ====================
        const versions = {};
        for (const [sizeName, sizeConfig] of Object.entries(IMAGE_SIZES)){
            const processedBuffer = await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$sharp__$5b$external$5d$__$28$sharp$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$sharp$29$__["default"])(buffer).resize(sizeConfig.width, sizeConfig.height, {
                fit: "inside",
                withoutEnlargement: true
            }).jpeg({
                quality: sizeName === "thumbnail" ? 70 : 85
            }).toBuffer();
            const versionUpload = await new Promise((resolve, reject)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cloudinary$2f$cloudinary$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["v2"].uploader.upload_stream({
                    folder: "hotel-media/versions",
                    resource_type: "image",
                    public_id: `${sizeName}-${hash.substring(0, 16)}`
                }, (error, result)=>{
                    if (error) reject(error);
                    else resolve(result);
                }).end(processedBuffer);
            });
            versions[sizeName] = {
                url: versionUpload.secure_url
            };
        }
        // ==================== INSERTAR MEDIA - ✅ SIN ai_metadata ====================
        const { data: photoData, error: insertError } = await supabase.from("media").insert([
            {
                hotel_id: hotelId,
                url: uploadResult.secure_url,
                tags: finalTags,
                confidence_scores: backendResult.tags_confidence || {},
                category: category,
                amenities: amenitiesResult,
                versions: versions,
                hash: hash,
                ai_title: finalTitle
            }
        ]).select();
        if (insertError) {
            console.error(`❌ [${requestId}] Error insertando en media:`, insertError);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Error guardando media"
            }, {
                status: 500
            });
        }
        if (!photoData || photoData.length === 0) {
            console.error(`❌ [${requestId}] Supabase no devolvió filas después del insert`);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "No se pudo obtener la imagen insertada"
            }, {
                status: 500
            });
        }
        console.log(`✅ [${requestId}] Guardado | Título: "${finalTitle}"`);
        // ==================== RESPUESTA FINAL ====================
        console.log(`✅ [${requestId}] Completado exitosamente`);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
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
        });
    } catch (error) {
        console.error(`❌ [${requestId}] Error fatal en upload:`, {
            message: error.message,
            stack: error.stack?.split("\n").slice(0, 3).join("\n")
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Error interno del servidor"
        }, {
            status: 500
        });
    }
}
// ============================================================
// 🔧 FUNCIÓN AUXILIAR: Extraer tags de amenities
// ============================================================
function extractAmenityTags(amenities) {
    if (!amenities) return [];
    if (Array.isArray(amenities) && amenities.every((a)=>typeof a === 'string')) {
        return amenities;
    }
    if (Array.isArray(amenities) && amenities[0] && typeof amenities[0] === 'object') {
        return amenities.map((a)=>a.id || a.name).filter((t)=>t && typeof t === 'string');
    }
    if (typeof amenities === 'object' && Array.isArray(amenities.flat)) {
        return amenities.flat;
    }
    if (typeof amenities === 'object' && Array.isArray(amenities.amenities)) {
        return amenities.amenities.map((a)=>a.id || a.name).filter((t)=>t && typeof t === 'string');
    }
    if (typeof amenities === 'object' && amenities.byCategory) {
        const allAmenities = [];
        for (const category of Object.values(amenities.byCategory)){
            if (Array.isArray(category)) {
                allAmenities.push(...category.map((a)=>a.id || a.name).filter((t)=>t));
            }
        }
        return allAmenities;
    }
    return [];
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__06249d70._.js.map