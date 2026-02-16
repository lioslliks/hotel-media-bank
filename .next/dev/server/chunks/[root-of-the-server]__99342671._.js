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
"[project]/src/lib/ai.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/lib/ai.ts
/**
 * Llama al backend CLIP para analizar una imagen y devolver tags limpios.
 * Esta función NO normaliza: solo limpia y prepara los tags.
 * La normalización completa la hace normalizeTags() después.
 */ __turbopack_context__.s([
    "analyzeImage",
    ()=>analyzeImage
]);
async function analyzeImage(url, threshold = 0.20) {
    try {
        if (!url || typeof url !== "string") {
            console.error("❌ URL inválida en analyzeImage:", url);
            return {
                tags: [],
                confidence: null
            };
        }
        const response = await fetch("http://localhost:8000/analyze", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                url,
                threshold
            })
        });
        if (!response.ok) {
            console.error("❌ Error en backend /analyze:", response.status);
            return {
                tags: [],
                confidence: null
            };
        }
        const data = await response.json();
        if (!data || !Array.isArray(data.tags)) {
            console.warn("⚠️ Backend devolvió formato inesperado:", data);
            return {
                tags: [],
                confidence: null
            };
        }
        // ------------------------------------------------------------
        // ⭐ Limpieza segura de tags (NO normalización completa)
        // ------------------------------------------------------------
        const tags = data.tags.map((t)=>{
            if (typeof t === "object" && t.label) return String(t.label).trim();
            if (typeof t === "string") return t.trim();
            return null;
        }).filter(Boolean);
        return {
            tags,
            confidence: data.confidence ?? null
        };
    } catch (error) {
        console.error("❌ Error al analizar imagen:", error);
        return {
            tags: [],
            confidence: null
        };
    }
}
}),
"[project]/src/lib/normalizeTags.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/lib/normalizeTags.ts
/**
 * Normaliza y limpia tags provenientes del backend (CLIP).
 * - Convierte objetos {label, score} → string
 * - Lowercase
 * - Trim
 * - Elimina duplicados
 * - Unifica sinónimos
 * - Corrige tags ambiguos
 * - Evita que "view" bloquee habitaciones
 * - Evita que "outdoor" bloquee piscina
 */ __turbopack_context__.s([
    "normalizeTags",
    ()=>normalizeTags
]);
function normalizeTags(rawTags) {
    console.log("🔥 normalizeTags() recibió:", rawTags);
    if (!Array.isArray(rawTags)) {
        console.log("🔥 normalizeTags() devolvió: [] (rawTags no es array)");
        return [];
    }
    // ------------------------------------------------------------
    // 1. Convertir objetos {label, score} → strings
    // ------------------------------------------------------------
    let cleaned = rawTags.map((t)=>typeof t === "object" ? t.label : t).map((t)=>String(t || "").toLowerCase().trim()).filter(Boolean);
    console.log("🔥 normalizeTags() cleaned:", cleaned);
    // ------------------------------------------------------------
    // 2. Unificar sinónimos y variaciones comunes
    // ------------------------------------------------------------
    const replacements = {
        "outdoor pool": "pool",
        "infinity pool": "pool",
        "hotel pool": "pool",
        "pool area": "pool",
        "poolside": "pool",
        "tropical pool": "pool",
        "massage room": "spa",
        "wellness area": "spa",
        "steam room": "spa",
        "sauna room": "spa",
        "hammam": "spa",
        "treatment room": "spa",
        "city view": "view",
        "urban view": "view",
        "skyline": "view",
        "cityscape": "view",
        "sea view": "view",
        "ocean view": "view",
        "panoramic view": "view",
        "roof terrace": "terrace",
        "sky bar": "terrace",
        "hotel room": "room",
        "double room": "room",
        "single room": "room",
        "bedroom": "room",
        "room interior": "room",
        "room view": "room"
    };
    cleaned = cleaned.map((tag)=>replacements[tag] || tag);
    // ------------------------------------------------------------
    // 3. Detectar habitación ANTES de limpiar exterior
    // ------------------------------------------------------------
    const hasRoom = cleaned.includes("room");
    // ------------------------------------------------------------
    // 4. Detectar spa
    // ------------------------------------------------------------
    const hasSpa = cleaned.includes("spa");
    // ------------------------------------------------------------
    // 5. Detectar piscina
    // ------------------------------------------------------------
    const hasPool = cleaned.includes("pool");
    // ------------------------------------------------------------
    // 6. Detectar exterior
    // ------------------------------------------------------------
    const hasExterior = cleaned.some((t)=>[
            "exterior",
            "facade",
            "building",
            "outdoor",
            "garden"
        ].includes(t));
    // ------------------------------------------------------------
    // ⭐ REGLA 1: Si es habitación → NO limpiar nada
    // ------------------------------------------------------------
    if (hasRoom) {
        const result = Array.from(new Set(cleaned));
        console.log("🔥 normalizeTags() devolvió (habitación detectada):", result);
        return result;
    }
    // ------------------------------------------------------------
    // ⭐ REGLA 2: Si es spa → NO limpiar nada
    // ------------------------------------------------------------
    if (hasSpa) {
        const result = Array.from(new Set(cleaned));
        console.log("🔥 normalizeTags() devolvió (spa detectado):", result);
        return result;
    }
    // ------------------------------------------------------------
    // ⭐ REGLA 3: Si es piscina → NO limpiar nada
    // ------------------------------------------------------------
    if (hasPool) {
        const result = Array.from(new Set(cleaned));
        console.log("🔥 normalizeTags() devolvió (piscina detectada):", result);
        return result;
    }
    // ------------------------------------------------------------
    // ⭐ REGLA 4: Si es exterior → eliminar interior
    // ------------------------------------------------------------
    if (hasExterior) {
        const interior = [
            "room",
            "dining room",
            "meeting room",
            "common area",
            "coworking area",
            "kids club",
            "lobby",
            "interior"
        ];
        const result = Array.from(new Set(cleaned.filter((t)=>!interior.includes(t))));
        console.log("🔥 normalizeTags() devolvió (exterior sin interior):", result);
        return result;
    }
    // ------------------------------------------------------------
    // ⭐ REGLA 5: Default → devolver sin duplicados
    // ------------------------------------------------------------
    const result = Array.from(new Set(cleaned));
    console.log("🔥 normalizeTags() devolvió (default):", result);
    return result;
}
}),
"[project]/src/utils/categoryMap.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// utils/categoryMap.ts
__turbopack_context__.s([
    "CATEGORY_MAP",
    ()=>CATEGORY_MAP,
    "detectCategory",
    ()=>detectCategory
]);
const CATEGORY_MAP = {
    piscina: [
        'pool',
        'swimming pool',
        'outdoor pool',
        'infinity pool',
        'hotel pool',
        'pool area',
        'poolside',
        'tropical pool'
    ],
    habitaciones: [
        'hotel room',
        'suite',
        'bedroom',
        'double room',
        'single room',
        'king bed',
        'queen bed',
        'room interior',
        'room view'
    ],
    vistas: [
        'city view',
        'skyline',
        'urban view',
        'cityscape',
        'sea view',
        'ocean view',
        'mountain view',
        'panoramic view'
    ],
    terraza: [
        'terrace',
        'balcony',
        'rooftop',
        'roof terrace',
        'sky bar'
    ],
    fachada: [
        'facade',
        'building',
        'entrance',
        'hotel exterior',
        'exterior view'
    ],
    restaurante: [
        'restaurant',
        'bar',
        'buffet',
        'breakfast area',
        'dining area'
    ],
    spa: [
        'spa',
        'massage room',
        'wellness',
        'wellness area',
        'sauna',
        'steam room',
        'hammam',
        'gym',
        'fitness',
        'treatment'
    ],
    salas_comunes: [
        'lobby',
        'reception',
        'common area',
        'hall',
        'lounge',
        'waiting area'
    ],
    interior: [
        'corridor',
        'hallway',
        'interior',
        'bathroom',
        'indoor'
    ],
    exterior: [
        'exterior',
        'garden',
        'outdoor',
        'parking',
        'patio'
    ]
};
/**
 * Normaliza tags a string[] en lowercase
 */ function normalizeTags(tags) {
    return tags.flatMap((tag)=>{
        if (typeof tag === 'string') {
            const t = tag.trim();
            if (t.startsWith('{') && t.endsWith('}')) {
                try {
                    const parsed = JSON.parse(t);
                    if (parsed?.label) return parsed.label;
                } catch  {}
            }
            return t;
        }
        if (typeof tag === 'object' && typeof tag.label === 'string') {
            return tag.label;
        }
        return [];
    }).filter(Boolean).map((t)=>t.toLowerCase());
}
function detectCategory(tags) {
    const normalized = normalizeTags(tags);
    if (!normalized.length) return 'otros';
    const has = (keyword)=>normalized.some((t)=>t.includes(keyword));
    // ------------------------------------------------------------
    // 1. Piscina
    // ------------------------------------------------------------
    if (has('pool') || has('poolside') || has('infinity')) {
        return 'piscina';
    }
    // ------------------------------------------------------------
    // 2. Spa / Wellness
    // ------------------------------------------------------------
    if (has('spa') || has('hammam') || has('sauna') || has('steam') || has('massage') || has('wellness') || has('treatment') || has('gym') || has('fitness')) {
        return 'spa';
    }
    // ------------------------------------------------------------
    // 3. Habitaciones (aunque tenga "view")
    // ------------------------------------------------------------
    if (has('room') || has('suite') || has('bedroom') || has('double room') || has('single room') || has('king') || has('queen')) {
        return 'habitaciones';
    }
    // ------------------------------------------------------------
    // 4. Restaurante
    // ------------------------------------------------------------
    if (has('restaurant') || has('bar') || has('buffet') || has('dining')) {
        return 'restaurante';
    }
    // ------------------------------------------------------------
    // 5. Salas comunes
    // ------------------------------------------------------------
    if (has('lobby') || has('reception') || has('common area') || has('hall') || has('lounge')) {
        return 'salas_comunes';
    }
    // ------------------------------------------------------------
    // 6. Vistas
    // ------------------------------------------------------------
    if (has('city view') || has('skyline') || has('urban') || has('sea view') || has('ocean view') || has('panoramic')) {
        return 'vistas';
    }
    // ------------------------------------------------------------
    // 7. Terraza
    // ------------------------------------------------------------
    if (has('terrace') || has('balcony') || has('rooftop') || has('sky bar')) {
        return 'terraza';
    }
    // ------------------------------------------------------------
    // 8. Fachada
    // ------------------------------------------------------------
    if (has('facade') || has('building') || has('entrance')) {
        return 'fachada';
    }
    // ------------------------------------------------------------
    // 9. Interior
    // ------------------------------------------------------------
    if (has('bathroom') || has('corridor') || has('interior') || has('hallway')) {
        return 'interior';
    }
    // ------------------------------------------------------------
    // 10. Exterior
    // ------------------------------------------------------------
    if (has('exterior') || has('garden') || has('outdoor') || has('parking') || has('patio')) {
        return 'exterior';
    }
    return 'otros';
}
}),
"[project]/src/lib/scenePriority.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/lib/scenePriority.ts
__turbopack_context__.s([
    "detectScenePriority",
    ()=>detectScenePriority
]);
function detectScenePriority(tags) {
    // Normalización básica
    const normalized = tags.map((t)=>typeof t === "string" ? t.toLowerCase() : typeof t.label === "string" ? t.label.toLowerCase() : "").filter(Boolean);
    const has = (key)=>normalized.includes(key);
    // ------------------------------------------------------------
    // 🧠 DETECCIÓN DE EXTERIOR (menos agresiva)
    // ------------------------------------------------------------
    const isExterior = has("exterior") || has("facade") || has("building") || has("entrance") || has("outdoor") || has("garden");
    // ------------------------------------------------------------
    // 🏊 Piscina (máxima prioridad)
    // ------------------------------------------------------------
    if (has("pool")) {
        return "piscina";
    }
    // ------------------------------------------------------------
    // 💆 Spa / Wellness
    // ------------------------------------------------------------
    if (has("spa") || has("hammam") || has("sauna") || has("steam") || has("massage") || has("wellness") || has("treatment")) {
        return "spa";
    }
    // ------------------------------------------------------------
    // 🍽️ Restaurante
    // ------------------------------------------------------------
    if (has("restaurant") || has("buffet") || has("dining")) {
        return "restaurante";
    }
    // ------------------------------------------------------------
    // 🍸 Bar
    // ------------------------------------------------------------
    if (has("bar") || has("rooftop") || has("cocktail")) {
        return "bar";
    }
    // ------------------------------------------------------------
    // 🛏️ Habitaciones (ya NO bloqueadas por "view")
    // ------------------------------------------------------------
    if (has("room") || has("suite")) {
        return "habitaciones";
    }
    // ------------------------------------------------------------
    // 🛋️ Zonas comunes
    // ------------------------------------------------------------
    if (has("lobby") || has("reception") || has("common area") || has("lounge") || has("coworking") || has("meeting")) {
        return "zonas_comunes";
    }
    // ------------------------------------------------------------
    // 🌊 Vistas
    // ------------------------------------------------------------
    if (has("view")) {
        return "vistas";
    }
    // ------------------------------------------------------------
    // 🌅 Terraza
    // ------------------------------------------------------------
    if (has("terrace") || has("balcony") || has("rooftop")) {
        return "terraza";
    }
    // ------------------------------------------------------------
    // 🏢 Fachada
    // ------------------------------------------------------------
    if (has("facade") || has("building") || has("entrance")) {
        return "fachada";
    }
    // ------------------------------------------------------------
    // 🌴 Exterior
    // ------------------------------------------------------------
    if (isExterior) {
        return "exterior";
    }
    return "otros";
}
}),
"[project]/src/lib/sceneWeights.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/lib/sceneWeights.ts
__turbopack_context__.s([
    "computeSceneWeights",
    ()=>computeSceneWeights
]);
function computeSceneWeights(tags) {
    // Normalizamos tags
    const normalized = tags.map((t)=>t.toLowerCase()).filter(Boolean);
    const has = (key)=>normalized.includes(key);
    const weights = [];
    // ------------------------------------------------------------
    // 🧠 DETECCIÓN DE EXTERIOR (menos agresiva que antes)
    // ------------------------------------------------------------
    const isExterior = has("exterior") || has("facade") || has("building") || has("entrance") || has("outdoor") || has("garden");
    // ------------------------------------------------------------
    // 🏊 Piscina
    // ------------------------------------------------------------
    if (has("pool")) weights.push({
        key: "pool",
        weight: 1.0
    });
    // ------------------------------------------------------------
    // 💆 Spa / Wellness
    // ------------------------------------------------------------
    if (has("spa")) weights.push({
        key: "spa",
        weight: 1.0
    });
    if (has("sauna")) weights.push({
        key: "sauna",
        weight: 0.9
    });
    if (has("hammam")) weights.push({
        key: "hammam",
        weight: 0.9
    });
    if (has("steam")) weights.push({
        key: "steam",
        weight: 0.8
    });
    if (has("massage")) weights.push({
        key: "massage",
        weight: 1.0
    });
    if (has("wellness")) weights.push({
        key: "wellness",
        weight: 0.9
    });
    // ------------------------------------------------------------
    // 🌊 Vistas
    // ------------------------------------------------------------
    if (has("view")) weights.push({
        key: "view",
        weight: 0.9
    });
    // ------------------------------------------------------------
    // 🌅 Ambiente
    // ------------------------------------------------------------
    if (has("sunset")) weights.push({
        key: "sunset",
        weight: 0.8
    });
    if (has("night")) weights.push({
        key: "night",
        weight: 0.7
    });
    // ------------------------------------------------------------
    // 🍽️ Restaurante
    // ------------------------------------------------------------
    if (has("restaurant")) weights.push({
        key: "restaurant",
        weight: 0.9
    });
    if (has("buffet")) weights.push({
        key: "buffet",
        weight: 0.8
    });
    // ------------------------------------------------------------
    // 🍸 Bar
    // ------------------------------------------------------------
    if (has("bar")) weights.push({
        key: "bar",
        weight: 0.8
    });
    if (has("rooftop")) weights.push({
        key: "rooftop",
        weight: 0.9
    });
    // ------------------------------------------------------------
    // 🛏️ Habitaciones (ya no bloqueadas por "view")
    // ------------------------------------------------------------
    if (has("room") || has("suite")) {
        weights.push({
            key: "room",
            weight: 1.0
        });
    }
    // ------------------------------------------------------------
    // 🛋️ Zonas comunes
    // ------------------------------------------------------------
    if (has("lobby")) weights.push({
        key: "lobby",
        weight: 0.9
    });
    if (has("meeting")) weights.push({
        key: "meeting_room",
        weight: 0.8
    });
    // ------------------------------------------------------------
    // 🌴 Exterior
    // ------------------------------------------------------------
    if (has("facade")) weights.push({
        key: "facade",
        weight: 0.95
    });
    if (has("terrace")) weights.push({
        key: "terrace",
        weight: 0.8
    });
    if (has("balcony")) weights.push({
        key: "balcony",
        weight: 0.7
    });
    // ------------------------------------------------------------
    // Ordenar por peso
    // ------------------------------------------------------------
    weights.sort((a, b)=>b.weight - a.weight);
    // ------------------------------------------------------------
    // ⭐ CORRECCIÓN INTELIGENTE
    // Si hay exterior + habitación → gana habitación (no exterior)
    // ------------------------------------------------------------
    const hasRoom = normalized.includes("room") || normalized.includes("suite");
    if (isExterior && hasRoom) {
        return {
            scene: "habitaciones",
            elements: weights
        };
    }
    // ------------------------------------------------------------
    // Escena dominante normal
    // ------------------------------------------------------------
    const scene = weights.length > 0 ? detectSceneFromWeights(weights[0].key) : "otros";
    return {
        scene,
        elements: weights
    };
}
function detectSceneFromWeights(key) {
    if (key.includes("pool")) return "piscina";
    if (key.includes("spa") || key.includes("massage") || key.includes("hammam")) return "spa";
    if (key.includes("restaurant") || key.includes("buffet")) return "restaurante";
    if (key.includes("bar") || key.includes("rooftop")) return "bar";
    if (key.includes("room") || key.includes("suite")) return "habitaciones";
    if (key.includes("lobby") || key.includes("meeting")) return "salas_comunes";
    if (key.includes("facade")) return "exterior";
    if (key.includes("view")) return "vistas";
    if (key.includes("terrace") || key.includes("balcony")) return "terraza";
    return "otros";
}
}),
"[project]/src/lib/supabaseClient.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabase",
    ()=>supabase
]);
// src/lib/supabaseClient.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-route] (ecmascript) <locals>");
;
// ------------------------------------------------------------
// ⭐ Validación estricta de variables de entorno
// ------------------------------------------------------------
const supabaseUrl = ("TURBOPACK compile-time value", "https://konsrtuynhzqssakgdlw.supabase.co");
const supabaseAnonKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvbnNydHV5bmh6cXNzYWtnZGx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NjAyNjQsImV4cCI6MjA4NTEzNjI2NH0.jQryirwSpavWFeVMTBim19mQEccAArqBtwi_4-r4KsY");
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
    }
});
// ------------------------------------------------------------
// (Opcional) Log controlado solo en desarrollo
// ------------------------------------------------------------
if ("TURBOPACK compile-time truthy", 1) {
    console.log("🔌 Supabase client initialized");
}
}),
"[project]/src/lib/aiTitleTemplates.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/lib/aiTitleTemplates.ts
__turbopack_context__.s([
    "TITLE_TEMPLATES",
    ()=>TITLE_TEMPLATES
]);
const TITLE_TEMPLATES = {
    // ============================
    // 🟦 PISCINA
    // ============================
    piscina: [
        {
            es: "Piscina exterior al atardecer",
            en: "Outdoor pool at sunset"
        },
        {
            es: "Piscina con vistas al mar",
            en: "Pool with sea view"
        },
        {
            es: "Piscina interior climatizada",
            en: "Indoor heated pool"
        },
        {
            es: "Piscina rodeada de jardines",
            en: "Pool surrounded by gardens"
        },
        {
            es: "Piscina con tumbonas modernas",
            en: "Pool with modern loungers"
        },
        {
            es: "Piscina iluminada por la noche",
            en: "Pool illuminated at night"
        },
        {
            es: "Piscina infinita con vistas",
            en: "Infinity pool with views"
        },
        {
            es: "Piscina exterior con palmeras",
            en: "Outdoor pool with palm trees"
        },
        {
            es: "Piscina junto a zona lounge",
            en: "Pool next to lounge area"
        },
        {
            es: "Piscina con agua cristalina",
            en: "Pool with crystal clear water"
        },
        // ⭐ COMBINADOS PISCINA + EXTERIOR
        {
            es: "Piscina frente a la fachada del hotel",
            en: "Pool in front of the hotel facade"
        },
        {
            es: "Piscina con vistas al mar y al hotel",
            en: "Pool with sea view and hotel building"
        },
        {
            es: "Piscina junto a la fachada iluminada",
            en: "Pool next to illuminated hotel facade"
        },
        {
            es: "Piscina exterior con palmeras y hotel",
            en: "Outdoor pool with palm trees and hotel"
        },
        {
            es: "Piscina con vistas al mar y palmeras",
            en: "Pool with sea view and palm trees"
        },
        {
            es: "Piscina frente al hotel con vistas al mar",
            en: "Pool in front of hotel with sea view"
        },
        {
            es: "Piscina exterior con vistas al océano",
            en: "Outdoor pool with ocean view"
        },
        {
            es: "Piscina junto a terraza con vistas",
            en: "Pool next to terrace with views"
        },
        {
            es: "Piscina exterior con ambiente tropical",
            en: "Outdoor pool with tropical ambience"
        },
        {
            es: "Piscina con vistas al mar y zona exterior",
            en: "Pool with sea view and outdoor area"
        }
    ],
    // ============================
    // 🟩 EXTERIOR / FACHADA
    // ============================
    exterior: [
        {
            es: "Fachada del hotel iluminada",
            en: "Illuminated hotel facade"
        },
        {
            es: "Entrada exterior moderna",
            en: "Modern exterior entrance"
        },
        {
            es: "Zona exterior ajardinada",
            en: "Garden outdoor area"
        },
        {
            es: "Terraza con vistas panorámicas",
            en: "Terrace with panoramic views"
        },
        {
            es: "Exterior del hotel al atardecer",
            en: "Hotel exterior at sunset"
        },
        {
            es: "Entrada principal elegante",
            en: "Elegant main entrance"
        },
        {
            es: "Jardines exteriores cuidados",
            en: "Well-kept outdoor gardens"
        },
        {
            es: "Zona exterior con palmeras",
            en: "Outdoor area with palm trees"
        },
        {
            es: "Fachada contemporánea del hotel",
            en: "Contemporary hotel facade"
        },
        {
            es: "Acceso exterior con iluminación cálida",
            en: "Exterior access with warm lighting"
        },
        // ⭐ COMBINADOS EXTERIOR + PISCINA
        {
            es: "Fachada del hotel con piscina exterior",
            en: "Hotel facade with outdoor pool"
        },
        {
            es: "Hotel con piscina y vistas al mar",
            en: "Hotel with pool and sea view"
        },
        {
            es: "Fachada del hotel frente a la piscina",
            en: "Hotel facade facing the pool"
        },
        {
            es: "Zona exterior con piscina y palmeras",
            en: "Outdoor area with pool and palm trees"
        },
        {
            es: "Hotel con piscina iluminada al atardecer",
            en: "Hotel with illuminated pool at sunset"
        },
        {
            es: "Hotel con piscina y ambiente tropical",
            en: "Hotel with pool and tropical ambience"
        },
        {
            es: "Fachada del hotel con piscina y terraza",
            en: "Hotel facade with pool and terrace"
        },
        {
            es: "Hotel con piscina y vistas al océano",
            en: "Hotel with pool and ocean view"
        },
        {
            es: "Zona exterior del hotel con piscina",
            en: "Hotel outdoor area with pool"
        },
        {
            es: "Hotel con piscina y jardines exteriores",
            en: "Hotel with pool and outdoor gardens"
        }
    ],
    // ============================
    // 🟧 HABITACIONES
    // ============================
    habitaciones: [
        {
            es: "Habitación doble luminosa",
            en: "Bright double room"
        },
        {
            es: "Habitación con vistas al mar",
            en: "Room with sea view"
        },
        {
            es: "Habitación moderna y acogedora",
            en: "Modern and cozy room"
        },
        {
            es: "Suite amplia con decoración elegante",
            en: "Spacious suite with elegant decor"
        },
        {
            es: "Habitación con balcón privado",
            en: "Room with private balcony"
        },
        {
            es: "Dormitorio con luz natural",
            en: "Bedroom with natural light"
        },
        {
            es: "Habitación minimalista y moderna",
            en: "Minimalist modern room"
        },
        {
            es: "Suite con zona de estar",
            en: "Suite with living area"
        },
        {
            es: "Habitación con cama king-size",
            en: "Room with king-size bed"
        },
        {
            es: "Habitación decorada con tonos cálidos",
            en: "Room decorated with warm tones"
        }
    ],
    // ============================
    // 🟪 SPA
    // ============================
    spa: [
        {
            es: "Spa con iluminación relajante",
            en: "Spa with relaxing lighting"
        },
        {
            es: "Spa moderno con ambiente cálido",
            en: "Modern spa with warm ambience"
        },
        {
            es: "Zona de spa con luz tenue",
            en: "Spa area with soft lighting"
        },
        {
            es: "Spa elegante con decoración natural",
            en: "Elegant spa with natural decor"
        },
        {
            es: "Spa con jacuzzi iluminado",
            en: "Spa with illuminated jacuzzi"
        },
        {
            es: "Zona de masajes con luz suave",
            en: "Massage area with soft light"
        },
        {
            es: "Spa con ambiente zen",
            en: "Spa with zen ambience"
        },
        {
            es: "Spa con piscina climatizada",
            en: "Spa with heated pool"
        },
        {
            es: "Spa con decoración en madera",
            en: "Spa with wooden decor"
        },
        {
            es: "Spa con velas y ambiente íntimo",
            en: "Spa with candles and intimate ambience"
        }
    ],
    // ============================
    // 🟨 RESTAURANTE
    // ============================
    restaurante: [
        {
            es: "Restaurante elegante y moderno",
            en: "Elegant modern restaurant"
        },
        {
            es: "Restaurante con decoración clásica",
            en: "Restaurant with classic decor"
        },
        {
            es: "Restaurante luminoso y acogedor",
            en: "Bright and cozy restaurant"
        },
        {
            es: "Restaurante con mesas bien dispuestas",
            en: "Restaurant with well-arranged tables"
        },
        {
            es: "Restaurante con iluminación cálida",
            en: "Restaurant with warm lighting"
        },
        {
            es: "Restaurante con ambiente sofisticado",
            en: "Restaurant with sophisticated ambience"
        },
        {
            es: "Restaurante con decoración contemporánea",
            en: "Restaurant with contemporary decor"
        },
        {
            es: "Restaurante con vistas exteriores",
            en: "Restaurant with outdoor views"
        },
        {
            es: "Restaurante con mesas de madera",
            en: "Restaurant with wooden tables"
        },
        {
            es: "Restaurante con estilo minimalista",
            en: "Minimalist style restaurant"
        }
    ],
    // ============================
    // 🟫 INTERIOR
    // ============================
    interior: [
        {
            es: "Interior moderno y luminoso",
            en: "Modern bright interior"
        },
        {
            es: "Zona interior con decoración elegante",
            en: "Interior area with elegant decor"
        },
        {
            es: "Espacio interior acogedor",
            en: "Cozy interior space"
        },
        {
            es: "Pasillo interior iluminado",
            en: "Illuminated interior hallway"
        },
        {
            es: "Zona interior con mobiliario moderno",
            en: "Interior with modern furniture"
        },
        {
            es: "Interior con detalles en madera",
            en: "Interior with wooden details"
        },
        {
            es: "Espacio interior minimalista",
            en: "Minimalist interior space"
        },
        {
            es: "Zona interior amplia y diáfana",
            en: "Wide open interior area"
        },
        {
            es: "Interior con iluminación cálida",
            en: "Interior with warm lighting"
        },
        {
            es: "Vestíbulo interior elegante",
            en: "Elegant interior lobby"
        }
    ],
    // ============================
    // 🟦 SALAS COMUNES
    // ============================
    salas_comunes: [
        {
            es: "Sala común moderna y acogedora",
            en: "Modern cozy common room"
        },
        {
            es: "Zona común con sofás cómodos",
            en: "Common area with comfortable sofas"
        },
        {
            es: "Sala de estar amplia y luminosa",
            en: "Bright spacious living room"
        },
        {
            es: "Espacio común con decoración elegante",
            en: "Common space with elegant decor"
        },
        {
            es: "Sala común con luz natural",
            en: "Common room with natural light"
        },
        {
            es: "Zona lounge moderna",
            en: "Modern lounge area"
        },
        {
            es: "Sala común con mobiliario contemporáneo",
            en: "Common room with contemporary furniture"
        },
        {
            es: "Espacio compartido con ambiente relajado",
            en: "Shared space with relaxed ambience"
        },
        {
            es: "Sala común con vistas exteriores",
            en: "Common room with outdoor views"
        },
        {
            es: "Zona común con decoración minimalista",
            en: "Minimalist common area"
        }
    ],
    // ============================
    // 🟫 OTROS
    // ============================
    otros: [
        {
            es: "Espacio del hotel",
            en: "Hotel space"
        },
        {
            es: "Zona del hotel",
            en: "Hotel area"
        },
        {
            es: "Área del hotel bien iluminada",
            en: "Well-lit hotel area"
        },
        {
            es: "Zona del hotel con decoración moderna",
            en: "Hotel area with modern decor"
        },
        {
            es: "Espacio funcional del hotel",
            en: "Functional hotel space"
        },
        {
            es: "Área del hotel con luz natural",
            en: "Hotel area with natural light"
        }
    ]
};
}),
"[project]/src/lib/generateDynamicTitles.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/lib/generateDynamicTitles.ts
/**
 * Genera títulos dinámicos basados en tags ya normalizados.
 * Compatible con normalizeTags(), categoryMap y sceneWeights.
 */ __turbopack_context__.s([
    "generateDynamicTitles",
    ()=>generateDynamicTitles
]);
function generateDynamicTitles(tags) {
    const normalized = tags.map((t)=>t.toLowerCase());
    const has = (key)=>normalized.includes(key);
    // -----------------------------
    // TAGS PRINCIPALES (ya normalizados)
    // -----------------------------
    const hasPool = has("pool");
    const hasSpa = has("spa");
    const hasSauna = has("sauna") || has("steam") || has("hammam");
    const hasMassage = has("massage") || has("wellness") || has("treatment");
    const hasView = has("view");
    const hasSea = has("sea") || has("ocean");
    const hasCity = has("city") || has("skyline");
    const hasMountain = has("mountain");
    const hasTerrace = has("terrace") || has("balcony") || has("rooftop");
    const hasRestaurant = has("restaurant") || has("buffet") || has("dining");
    const hasBar = has("bar") || has("cocktail") || has("rooftop");
    const hasRoom = has("room") || has("suite");
    const hasLobby = has("lobby") || has("reception");
    const hasLounge = has("lounge") || has("common area");
    const hasMeeting = has("meeting") || has("conference");
    const hasCoworking = has("coworking");
    const hasKidsClub = has("kids club");
    const hasFacade = has("facade") || has("building") || has("entrance");
    const hasExterior = has("exterior") || has("outdoor") || has("garden");
    const titles = [];
    // ------------------------------------------------------------
    // 🏊 PISCINA
    // ------------------------------------------------------------
    if (hasPool) {
        if (hasView && hasSea) {
            titles.push("Piscina exterior con vistas al mar");
            titles.push("Piscina del hotel frente al océano");
        }
        if (hasTerrace) {
            titles.push("Piscina junto a terraza con vistas");
        }
        titles.push("Piscina exterior del hotel");
        titles.push("Piscina del hotel");
    }
    // ------------------------------------------------------------
    // 💆 SPA / WELLNESS
    // ------------------------------------------------------------
    if (hasSpa || hasMassage) {
        titles.push("Sala de masajes con camillas preparadas");
        titles.push("Zona de spa con ambiente relajante");
        titles.push("Espacio de bienestar con camillas de masaje");
        if (hasSauna) titles.push("Spa con sauna y zona de relajación");
    }
    // ------------------------------------------------------------
    // 🍽️ RESTAURANTE
    // ------------------------------------------------------------
    if (hasRestaurant) {
        if (hasSea) titles.push("Restaurante con vistas al mar");
        if (hasTerrace) titles.push("Restaurante con terraza exterior");
        if (hasView) titles.push("Restaurante con vistas panorámicas");
        titles.push("Restaurante elegante del hotel");
        titles.push("Buffet del hotel");
    }
    // ------------------------------------------------------------
    // 🍸 BAR
    // ------------------------------------------------------------
    if (hasBar) {
        if (hasCity) titles.push("Rooftop bar con vistas a la ciudad");
        if (hasView) titles.push("Bar con vistas panorámicas");
        titles.push("Bar del hotel con ambiente moderno");
    }
    // ------------------------------------------------------------
    // 🛏️ HABITACIONES
    // ------------------------------------------------------------
    if (hasRoom) {
        if (hasView && hasSea) titles.push("Habitación con vistas al mar");
        if (hasView && hasCity) titles.push("Habitación con vistas a la ciudad");
        if (hasTerrace) titles.push("Habitación con balcón privado");
        titles.push("Habitación moderna y luminosa");
        titles.push("Suite elegante del hotel");
    }
    // ------------------------------------------------------------
    // 🛋️ ZONAS COMUNES
    // ------------------------------------------------------------
    if (hasLobby) titles.push("Lobby moderno del hotel");
    if (hasLounge) titles.push("Zona común con ambiente acogedor");
    if (hasCoworking) titles.push("Zona coworking del hotel");
    if (hasMeeting) titles.push("Sala de reuniones moderna");
    if (hasKidsClub) titles.push("Kids club del hotel");
    // ------------------------------------------------------------
    // 🏢 FACHADA / EXTERIOR
    // ------------------------------------------------------------
    if (hasFacade) {
        if (hasSea) titles.push("Fachada del hotel con vistas al mar");
        titles.push("Fachada exterior del hotel");
    }
    if (hasExterior) {
        titles.push("Zona exterior del hotel");
    }
    // ------------------------------------------------------------
    // FALLBACK
    // ------------------------------------------------------------
    if (titles.length === 0) {
        titles.push("Zona del hotel");
    }
    return titles;
}
}),
"[project]/src/lib/generateAiTitleV2.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generateAiTitleFromClip",
    ()=>generateAiTitleFromClip
]);
// src/lib/generateAiTitleV2.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$aiTitleTemplates$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/aiTitleTemplates.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$generateDynamicTitles$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/generateDynamicTitles.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sceneWeights$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/sceneWeights.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$normalizeTags$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/normalizeTags.ts [app-route] (ecmascript)");
;
;
;
;
const CLIP_API_URL = process.env.NEXT_PUBLIC_CLIP_URL || "http://localhost:8000/rank";
async function generateAiTitleFromClip(imageUrl, category, tags) {
    // ------------------------------------------------------------
    // ⭐ 1. Normalizar tags
    // ------------------------------------------------------------
    const normalizedTags = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$normalizeTags$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeTags"])(tags || []);
    console.log("🔧 Normalized tags:", normalizedTags);
    // ------------------------------------------------------------
    // ⭐ 2. Scene Weighting
    // ------------------------------------------------------------
    const { scene, elements } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sceneWeights$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["computeSceneWeights"])(normalizedTags);
    const normalizedCategory = (category || "").toLowerCase();
    console.log("🎯 Scene detected:", scene);
    console.log("📊 Scene weights:", elements);
    // ------------------------------------------------------------
    // ⭐ 3. Títulos dinámicos
    // ------------------------------------------------------------
    const dynamicTitles = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$generateDynamicTitles$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateDynamicTitles"])(normalizedTags);
    console.log("🧠 Dynamic titles:", dynamicTitles);
    // ------------------------------------------------------------
    // ⭐ 4. Plantillas según escena/categoría
    // ------------------------------------------------------------
    let templates;
    // Piscina tiene prioridad absoluta
    if (normalizedCategory === "piscina" || scene === "piscina") {
        templates = [
            ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$aiTitleTemplates$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TITLE_TEMPLATES"].piscina,
            ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$aiTitleTemplates$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TITLE_TEMPLATES"].exterior // fallback natural
        ];
    } else if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$aiTitleTemplates$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TITLE_TEMPLATES"][scene]) {
        templates = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$aiTitleTemplates$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TITLE_TEMPLATES"][scene];
    } else if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$aiTitleTemplates$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TITLE_TEMPLATES"][normalizedCategory]) {
        templates = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$aiTitleTemplates$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TITLE_TEMPLATES"][normalizedCategory];
    } else {
        templates = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$aiTitleTemplates$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TITLE_TEMPLATES"]["otros"];
    }
    const templateSpanish = templates.map((t)=>t.es);
    const templateEnglish = templates.map((t)=>t.en);
    console.log("📚 Template Spanish:", templateSpanish);
    console.log("📚 Template English:", templateEnglish);
    // ------------------------------------------------------------
    // ⭐ 5. Fusionar dinámicos + plantillas
    // ------------------------------------------------------------
    const spanishCandidates = [
        ...dynamicTitles,
        ...templateSpanish
    ];
    const englishCandidates = [
        ...dynamicTitles.map((t)=>translateToEnglish(t)),
        ...templateEnglish
    ];
    console.log("🇪🇸 Final Spanish candidates:", spanishCandidates);
    console.log("🇬🇧 Final English candidates:", englishCandidates);
    // ------------------------------------------------------------
    // ⭐ 6. Llamar a CLIP /rank con similitud imagen–texto
    // ------------------------------------------------------------
    const res = await fetch(CLIP_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            titles: englishCandidates,
            tags: normalizedTags,
            scene,
            category: normalizedCategory,
            image_url: imageUrl
        })
    });
    if (!res.ok) {
        console.error("❌ Error llamando a CLIP /rank:", await res.text());
        return spanishCandidates[0];
    }
    const ranked = await res.json();
    console.log("🏆 CLIP ranking:", ranked);
    const bestEnglish = ranked?.ranked?.[0];
    if (!bestEnglish) return spanishCandidates[0];
    // ------------------------------------------------------------
    // ⭐ 7. Buscar equivalente en español
    // ------------------------------------------------------------
    const templateMatch = templates.find((t)=>t.en === bestEnglish);
    if (templateMatch) {
        console.log("✨ Best match (template):", templateMatch.es);
        return templateMatch.es;
    }
    const index = englishCandidates.indexOf(bestEnglish);
    console.log("✨ Best match (dynamic):", spanishCandidates[index]);
    return spanishCandidates[index] || spanishCandidates[0];
}
// ------------------------------------------------------------
// ⭐ Traducción ES → EN (simple pero suficiente para CLIP ranking)
// ------------------------------------------------------------
function translateToEnglish(spanish) {
    let en = spanish.toLowerCase();
    en = en.replace(/\s+/g, " ").trim();
    return en.charAt(0).toUpperCase() + en.slice(1);
}
}),
"[project]/src/lib/updateMediaAiTitle.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "updateMediaAiTitle",
    ()=>updateMediaAiTitle
]);
// src/lib/updateMediaAiTitle.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabaseClient.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$generateAiTitleV2$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/generateAiTitleV2.ts [app-route] (ecmascript)");
;
;
async function updateMediaAiTitle(mediaId, imageUrl, category, tags) {
    try {
        console.log("🧠 Generando título con CLIP para:", imageUrl);
        console.log("🏷️ Tags recibidos (raw):", tags);
        // ⭐ NORMALIZACIÓN SEGURA Y CORRECTA
        const safeTags = Array.isArray(tags) && tags.length > 0 ? tags.map((t)=>{
            if (typeof t === "string") return t.trim();
            if (typeof t === "object" && t?.label) return t.label.trim();
            return null;
        }).filter(Boolean) : [];
        console.log("🏷️ Tags usados para CLIP:", safeTags);
        // ⭐ Pasamos tags limpios al generador
        const ai_title = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$generateAiTitleV2$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateAiTitleFromClip"])(imageUrl, category, safeTags);
        console.log("🏷️ Título generado:", ai_title);
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from("media").update({
            ai_title
        }).eq("id", mediaId);
        if (error) {
            console.error("❌ Error actualizando ai_title:", error);
            return null;
        }
        console.log(`✅ ai_title actualizado para media ${mediaId}`);
        return ai_title;
    } catch (err) {
        console.error("❌ Error en updateMediaAiTitle:", err);
        return null;
    }
}
}),
"[project]/src/app/api/upload/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cloudinary$2f$cloudinary$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/cloudinary/cloudinary.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$externals$5d2f$buffer__$5b$external$5d$__$28$buffer$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/buffer [external] (buffer, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$sharp__$5b$external$5d$__$28$sharp$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$sharp$29$__ = __turbopack_context__.i("[externals]/sharp [external] (sharp, cjs, [project]/node_modules/sharp)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/ai.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$normalizeTags$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/normalizeTags.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$categoryMap$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/categoryMap.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$scenePriority$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/scenePriority.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sceneWeights$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/sceneWeights.ts [app-route] (ecmascript)");
// ⭐ IMPORTANTE: generador de títulos
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$updateMediaAiTitle$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/updateMediaAiTitle.ts [app-route] (ecmascript)");
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
;
;
// ==================== VALIDACIÓN ENV ====================
if (!process.env.CLOUDINARY_CLOUD_NAME) throw new Error('❌ CLOUDINARY_CLOUD_NAME no está definido');
if (!process.env.CLOUDINARY_API_KEY) throw new Error('❌ CLOUDINARY_API_KEY no está definido');
if (!process.env.CLOUDINARY_API_SECRET) throw new Error('❌ CLOUDINARY_API_SECRET no está definido');
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cloudinary$2f$cloudinary$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["v2"].config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
// ==================== SUPABASE ====================
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(("TURBOPACK compile-time value", "https://konsrtuynhzqssakgdlw.supabase.co"), ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvbnNydHV5bmh6cXNzYWtnZGx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NjAyNjQsImV4cCI6MjA4NTEzNjI2NH0.jQryirwSpavWFeVMTBim19mQEccAArqBtwi_4-r4KsY"));
// ==================== VERSIONES ====================
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
    console.log('🚀 POST /api/upload iniciado');
    try {
        const formData = await request.formData();
        const file = formData.get('file');
        const hotelId = formData.get('hotel_id');
        console.log('📥 Datos recibidos:', {
            hasFile: !!file,
            hasHotelId: !!hotelId,
            fileType: file?.type,
            fileSize: file?.size
        });
        if (!file || !(file instanceof File)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Archivo inválido'
            }, {
                status: 400
            });
        }
        if (!hotelId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Falta hotel_id'
            }, {
                status: 400
            });
        }
        if (file.size > 5 * 1024 * 1024) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Archivo demasiado grande (máx. 5MB)'
            }, {
                status: 400
            });
        }
        // ==================== BUFFER + METADATA ====================
        const arrayBuffer = await file.arrayBuffer();
        const buffer = __TURBOPACK__imported__module__$5b$externals$5d2f$buffer__$5b$external$5d$__$28$buffer$2c$__cjs$29$__["Buffer"].from(arrayBuffer);
        const metadata = await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$sharp__$5b$external$5d$__$28$sharp$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$sharp$29$__["default"])(buffer).metadata();
        // ==================== HASH ====================
        const hash = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].createHash('sha256').update(buffer).digest('hex');
        console.log('🔑 Hash generado:', hash.substring(0, 16));
        // ==================== CHECK DUPLICADO ====================
        const { data: existing, error: checkError } = await supabase.from('image_hashes').select('url, type, quality_score').eq('hash', hash).single();
        if (checkError && checkError.code !== 'PGRST116') {
            console.error('❌ Error verificando duplicados:', checkError);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Error verificando duplicados'
            }, {
                status: 500
            });
        }
        // ==================== DUPLICADO ====================
        if (existing) {
            console.log('⚠️ Imagen duplicada detectada');
            const analysis = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["analyzeImage"])(existing.url);
            const rawTags = analysis.tags;
            const tags = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$normalizeTags$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeTags"])(rawTags);
            const category = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$categoryMap$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["detectCategory"])(tags);
            const scene = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$scenePriority$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["detectScenePriority"])(tags);
            const sceneWeights = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sceneWeights$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["computeSceneWeights"])(tags);
            console.log('🏷️ Tags (premium):', tags);
            console.log('📂 Categoría detectada:', category);
            console.log('🎬 Escena detectada:', scene);
            console.log('⚖️ Pesos de escena:', sceneWeights);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                url: existing.url,
                type: existing.type,
                quality_score: existing.quality_score || 0.8,
                is_duplicate: true,
                tags,
                category,
                scene,
                sceneWeights,
                message: 'Esta imagen ya existe en tu galería'
            });
        }
        // ==================== UPLOAD CLOUDINARY ====================
        console.log('☁️ Subiendo a Cloudinary...');
        const uploadResult = await new Promise((resolve, reject)=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cloudinary$2f$cloudinary$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["v2"].uploader.upload_stream({
                folder: 'hotel-media',
                resource_type: 'auto',
                invalidate: true,
                quality_analysis: true
            }, (error, result)=>{
                if (error) reject(error);
                else resolve(result);
            }).end(buffer);
        });
        console.log('✅ Subida exitosa:', uploadResult.secure_url);
        // ==================== IA ====================
        console.log('🔍 Analizando imagen con ExSabri IA...');
        const analysis = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["analyzeImage"])(uploadResult.secure_url);
        console.log("🔥 RAW TAGS FROM BACKEND:", analysis.tags);
        const rawTags = analysis.tags;
        // ⭐ NORMALIZACIÓN PREMIUM
        const tags = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$normalizeTags$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeTags"])(rawTags);
        // ⭐ CATEGORÍA FINAL
        const category = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$categoryMap$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["detectCategory"])(tags);
        // ⭐ ESCENA DOMINANTE
        const scene = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$scenePriority$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["detectScenePriority"])(tags);
        // ⭐ PESOS DE ESCENA
        const sceneWeights = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sceneWeights$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["computeSceneWeights"])(tags);
        console.log('🏷️ Tags (premium):', tags);
        console.log('📂 Categoría detectada:', category);
        console.log('🎬 Escena detectada:', scene);
        console.log('⚖️ Pesos de escena:', sceneWeights);
        const qualityScore = uploadResult.quality_analysis?.focus || 0.8;
        // ==================== GENERAR VERSIONES ====================
        console.log('🔄 Generando versiones de imagen...');
        const versions = {};
        versions.original = {
            url: uploadResult.secure_url,
            dimensions: `${metadata.width}x${metadata.height}`,
            aspect_ratio: metadata.width && metadata.height ? `${metadata.width}:${metadata.height}` : 'N/A',
            file_size: `${(buffer.length / 1024).toFixed(1)}KB`
        };
        for (const [sizeName, sizeConfig] of Object.entries(IMAGE_SIZES)){
            try {
                console.log(`  📸 Procesando versión ${sizeName}...`);
                const processedBuffer = await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$sharp__$5b$external$5d$__$28$sharp$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$sharp$29$__["default"])(buffer).resize(sizeConfig.width, sizeConfig.height, {
                    fit: 'inside',
                    withoutEnlargement: true
                }).jpeg({
                    quality: sizeName === 'thumbnail' ? 70 : 85
                }).toBuffer();
                const versionUploadResult = await new Promise((resolve, reject)=>{
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cloudinary$2f$cloudinary$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["v2"].uploader.upload_stream({
                        folder: 'hotel-media/versions',
                        resource_type: 'image',
                        invalidate: true,
                        public_id: `${sizeName}-${hash.substring(0, 16)}`
                    }, (error, result)=>{
                        if (error) reject(error);
                        else resolve(result);
                    }).end(processedBuffer);
                });
                const versionMetadata = await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$sharp__$5b$external$5d$__$28$sharp$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$sharp$29$__["default"])(processedBuffer).metadata();
                versions[sizeName] = {
                    url: versionUploadResult.secure_url,
                    dimensions: `${versionMetadata.width}x${versionMetadata.height}`,
                    aspect_ratio: versionMetadata.width && versionMetadata.height ? `${versionMetadata.width}:${versionMetadata.height}` : 'N/A',
                    file_size: `${(processedBuffer.length / 1024).toFixed(1)}KB`
                };
                console.log(`  ✅ Versión ${sizeName} generada: ${versionUploadResult.secure_url}`);
            } catch (error) {
                console.error(`  ❌ Error procesando ${sizeName}:`, error);
                versions[sizeName] = versions.original;
            }
        }
        console.log('✅ Todas las versiones generadas');
        // ==================== GUARDAR HASH ====================
        const { error: insertHashError } = await supabase.from('image_hashes').insert({
            hash,
            url: uploadResult.secure_url,
            type: uploadResult.resource_type,
            quality_score: qualityScore
        });
        if (insertHashError) {
            console.error('❌ Error guardando hash:', insertHashError);
        } else {
            console.log('✅ Hash guardado');
        }
        // ==================== GUARDAR MEDIA ====================
        console.log('💾 Guardando imagen en tabla media...');
        const { data: photoData, error: photoError } = await supabase.from('media').insert([
            {
                hotel_id: hotelId,
                url: uploadResult.secure_url,
                // ⭐ TAGS NORMALIZADOS
                tags,
                // ⭐ GUARDAMOS RAW TAGS COMO CONFIDENCE SCORES
                confidence_scores: rawTags,
                quality_score: qualityScore,
                hash,
                category,
                scene,
                // ⭐ GUARDAMOS PESOS COMO JSON SEGURO
                scene_weights: sceneWeights,
                versions: JSON.stringify(versions)
            }
        ]).select();
        if (photoError) {
            console.error('❌ Error guardando foto:', photoError);
            throw new Error('Error al guardar foto en base de datos');
        }
        console.log('✅ Foto guardada con ID:', photoData?.[0]?.id);
        // ⭐ GENERAR TÍTULO AUTOMÁTICO CON CLIP
        try {
            console.log("🧠 Generando título automático con CLIP...");
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$updateMediaAiTitle$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["updateMediaAiTitle"])(photoData[0].id, uploadResult.secure_url, category, tags);
            console.log("✅ Título generado y guardado");
        } catch (err) {
            console.error("❌ Error generando título automático:", err);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            url: uploadResult.secure_url,
            type: uploadResult.resource_type,
            quality_score: qualityScore,
            is_duplicate: false,
            tags,
            category,
            scene,
            sceneWeights,
            photo_id: photoData?.[0]?.id,
            versions
        });
    } catch (error) {
        console.error('❌ Error fatal en API:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Error interno del servidor',
            details: error instanceof Error ? error.message : String(error)
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__99342671._.js.map