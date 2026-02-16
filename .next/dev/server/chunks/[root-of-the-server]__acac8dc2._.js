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

// lib/ai.ts
__turbopack_context__.s([
    "analyzeImage",
    ()=>analyzeImage
]);
async function analyzeImage(url, threshold = 0.05) {
    try {
        const response = await fetch('http://localhost:8000/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url,
                threshold
            })
        });
        if (!response.ok) {
            throw new Error(`Error en análisis: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('❌ Error al analizar imagen:', error);
        throw error;
    }
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
    exterior: [
        'exterior',
        'garden',
        'parking',
        'view',
        'balcony',
        'terrace',
        'facade'
    ],
    habitaciones: [
        'hotel room',
        'suite',
        'family room',
        'double room',
        'single room',
        'king bed',
        'queen bed',
        'bedroom'
    ],
    interior: [
        'corridor',
        'hallway',
        'interior',
        'bathroom'
    ],
    salas_comunes: [
        'lobby',
        'reception',
        'hall',
        'common area',
        'breakfast area'
    ],
    restaurante: [
        'restaurant',
        'bar'
    ],
    piscina: [
        'swimming pool',
        'pool'
    ],
    spa: [
        'spa',
        'gym'
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
    // 1. Prioridad máxima
    if (normalized.includes('swimming pool') || normalized.includes('pool')) {
        return 'piscina';
    }
    if (normalized.includes('hotel room') || normalized.includes('suite') || normalized.includes('bedroom') || normalized.includes('double room') || normalized.includes('single room')) {
        return 'habitaciones';
    }
    if (normalized.includes('spa') || normalized.includes('gym')) {
        return 'spa';
    }
    if (normalized.includes('restaurant') || normalized.includes('bar')) {
        return 'restaurante';
    }
    // 2. Prioridad media
    if (normalized.includes('lobby') || normalized.includes('reception') || normalized.includes('common area') || normalized.includes('breakfast area')) {
        return 'salas_comunes';
    }
    if (normalized.includes('bathroom') || normalized.includes('corridor') || normalized.includes('interior') || normalized.includes('hallway')) {
        return 'interior';
    }
    // 3. Exterior (última opción)
    if (normalized.includes('exterior') || normalized.includes('view') || normalized.includes('balcony') || normalized.includes('terrace') || normalized.includes('garden') || normalized.includes('facade')) {
        return 'exterior';
    }
    return 'otros';
}
}),
"[project]/src/lib/supabaseClient.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-route] (ecmascript) <locals>");
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://konsrtuynhzqssakgdlw.supabase.co");
const supabaseAnonKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvbnNydHV5bmh6cXNzYWtnZGx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NjAyNjQsImV4cCI6MjA4NTEzNjI2NH0.jQryirwSpavWFeVMTBim19mQEccAArqBtwi_4-r4KsY");
// ✅ Añade esta verificación
console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Key:", supabaseAnonKey);
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseAnonKey);
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
    // 🟩 EXTERIOR
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
__turbopack_context__.s([
    "generateDynamicTitles",
    ()=>generateDynamicTitles
]);
function generateDynamicTitles(tags) {
    // Aquí los tags ya vienen como string[], pero aseguramos minúsculas
    const normalized = tags.map((t)=>t.toLowerCase());
    const has = (key)=>normalized.includes(key);
    // Piscinas
    const hasPool = has("pool") || has("swimming pool") || has("outdoor pool") || has("indoor pool");
    const hasInfinityPool = has("infinity pool");
    const hasIndoorPool = has("indoor pool");
    const hasOutdoorPool = has("outdoor pool");
    // Vistas
    const hasSea = has("sea") || has("ocean") || has("beach") || has("sea view");
    const hasCityView = has("city view");
    const hasMountainView = has("mountains");
    // Ambiente
    const hasSunset = has("sunset");
    const hasNight = has("night") || has("illuminated");
    // Spa
    const hasSpa = has("spa") || has("spa bed") || has("massage table") || has("massage room") || has("treatment room") || has("wellness area") || has("relaxation area");
    const hasSauna = has("sauna") || has("steam room") || has("hammam");
    const hasJacuzzi = has("jacuzzi") || has("hot tub");
    // Restaurantes y bares
    const hasRestaurant = has("restaurant") || has("buffet") || has("dining room");
    const hasBuffet = has("buffet");
    const hasRooftopBar = has("rooftop bar");
    const hasBar = has("bar") || has("cocktail bar") || has("lounge bar");
    // Habitaciones
    const hasRoom = has("hotel room") || has("bedroom") || has("suite") || has("family room");
    const hasBalcony = has("balcony") || has("terrace");
    // Zonas comunes
    const hasLobby = has("lobby") || has("reception");
    const hasLounge = has("lounge") || has("common area");
    const hasCoworking = has("coworking area");
    const hasMeetingRoom = has("meeting room") || has("conference room");
    const hasKidsClub = has("kids club");
    const titles = [];
    // 🏊 Piscinas (versión mejorada)
    if (hasPool || hasInfinityPool || hasOutdoorPool || hasIndoorPool) {
        if (hasInfinityPool && hasSea && hasSunset) {
            titles.push("Piscina infinita con vistas al mar al atardecer");
            titles.push("Infinity pool con vistas al océano al atardecer");
        }
        if (hasInfinityPool && hasSea) {
            titles.push("Piscina infinita con vistas al mar");
            titles.push("Infinity pool frente al océano");
        }
        if (hasInfinityPool) {
            titles.push("Piscina infinita del hotel");
        }
        if (hasOutdoorPool && hasSea) {
            titles.push("Piscina exterior con vistas al mar");
            titles.push("Piscina al aire libre frente al océano");
        }
        if (hasOutdoorPool && hasSunset) {
            titles.push("Piscina exterior iluminada al atardecer");
        }
        if (hasOutdoorPool) {
            titles.push("Piscina exterior del hotel");
        }
        if (hasIndoorPool) {
            titles.push("Piscina interior climatizada");
        }
        titles.push("Piscina del hotel");
    }
    // 💆 Spa (versión mejorada)
    if (hasSpa) {
        titles.push("Sala de masajes con camillas preparadas");
        titles.push("Camillas de masaje en un spa acogedor");
        titles.push("Sala de tratamientos con iluminación cálida");
        titles.push("Zona de spa con camillas y toallas preparadas");
        titles.push("Espacio de bienestar con camillas de masaje");
        titles.push("Sala de spa lista para tratamientos relajantes");
        if (hasSauna) titles.push("Spa con sauna y zona de relajación");
        if (hasJacuzzi) titles.push("Spa con jacuzzi y camillas de masaje");
    }
    // 🍽️ Restaurantes
    if (hasRestaurant) {
        if (hasSea) titles.push("Restaurante con vistas al mar");
        if (hasBuffet) titles.push("Buffet del hotel");
        if (hasBalcony) titles.push("Restaurante con terraza exterior");
        titles.push("Restaurante elegante del hotel");
    }
    // 🍸 Bares
    if (hasRooftopBar) {
        if (hasCityView) titles.push("Rooftop bar con vistas a la ciudad");
        else titles.push("Rooftop bar del hotel");
    }
    if (hasBar) {
        if (hasNight) titles.push("Bar iluminado por la noche");
        titles.push("Bar del hotel con ambiente moderno");
    }
    // 🛏️ Habitaciones
    if (hasRoom) {
        if (hasSea) titles.push("Habitación con vistas al mar");
        if (hasBalcony) titles.push("Habitación con balcón privado");
        titles.push("Habitación moderna y luminosa");
    }
    // 🛋️ Zonas comunes
    if (hasLobby) titles.push("Lobby moderno del hotel");
    if (hasLounge) titles.push("Zona común con ambiente acogedor");
    if (hasCoworking) titles.push("Zona coworking del hotel");
    if (hasMeetingRoom) titles.push("Sala de reuniones moderna");
    if (hasKidsClub) titles.push("Kids club del hotel");
    // 🌅 Exterior
    if (has("exterior") || has("facade")) {
        if (hasSea) titles.push("Fachada del hotel con vistas al mar");
        titles.push("Fachada exterior del hotel");
    }
    if (titles.length === 0) {
        titles.push("Zona del hotel");
    }
    return titles;
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
    // Piscina
    if (has("infinity pool")) weights.push({
        key: "infinity_pool",
        weight: 1.0
    });
    if (has("outdoor pool")) weights.push({
        key: "outdoor_pool",
        weight: 0.9
    });
    if (has("indoor pool")) weights.push({
        key: "indoor_pool",
        weight: 0.8
    });
    if (has("pool")) weights.push({
        key: "pool",
        weight: 0.7
    });
    // Vistas
    if (has("sea") || has("ocean") || has("sea view")) weights.push({
        key: "sea_view",
        weight: 0.9
    });
    if (has("city view")) weights.push({
        key: "city_view",
        weight: 0.7
    });
    if (has("mountains")) weights.push({
        key: "mountain_view",
        weight: 0.6
    });
    // Ambiente
    if (has("sunset")) weights.push({
        key: "sunset",
        weight: 0.8
    });
    if (has("night") || has("illuminated")) weights.push({
        key: "night",
        weight: 0.7
    });
    // Spa
    if (has("massage table")) weights.push({
        key: "massage_table",
        weight: 1.0
    });
    if (has("spa bed")) weights.push({
        key: "spa_bed",
        weight: 0.9
    });
    if (has("sauna")) weights.push({
        key: "sauna",
        weight: 0.7
    });
    if (has("jacuzzi")) weights.push({
        key: "jacuzzi",
        weight: 0.8
    });
    // Restaurante
    if (has("buffet")) weights.push({
        key: "buffet",
        weight: 0.9
    });
    if (has("terrace restaurant")) weights.push({
        key: "terrace_restaurant",
        weight: 0.8
    });
    if (has("restaurant")) weights.push({
        key: "restaurant",
        weight: 0.7
    });
    // Bar
    if (has("rooftop bar")) weights.push({
        key: "rooftop_bar",
        weight: 1.0
    });
    if (has("cocktail bar")) weights.push({
        key: "cocktail_bar",
        weight: 0.8
    });
    if (has("bar")) weights.push({
        key: "bar",
        weight: 0.7
    });
    // Habitaciones
    if (has("suite")) weights.push({
        key: "suite",
        weight: 1.0
    });
    if (has("balcony")) weights.push({
        key: "balcony",
        weight: 0.8
    });
    if (has("hotel room") || has("bedroom") || has("family room")) weights.push({
        key: "room",
        weight: 0.9
    });
    // Zonas comunes
    if (has("lobby")) weights.push({
        key: "lobby",
        weight: 0.9
    });
    if (has("coworking area")) weights.push({
        key: "coworking",
        weight: 0.7
    });
    if (has("meeting room") || has("conference room")) weights.push({
        key: "meeting_room",
        weight: 0.8
    });
    // Exterior
    if (has("facade") || has("exterior")) weights.push({
        key: "facade",
        weight: 0.6
    });
    // Ordenar por peso
    weights.sort((a, b)=>b.weight - a.weight);
    // ⭐ CORRECCIÓN INTELIGENTE
    // Si hay fachada/exterior/balcón y también suite/hotel room,
    // priorizamos EXTERIOR porque CLIP suele confundir balcones con habitaciones.
    const hasExterior = normalized.includes("facade") || normalized.includes("exterior") || normalized.includes("balcony") || normalized.includes("terrace");
    const hasRoom = normalized.includes("suite") || normalized.includes("hotel room") || normalized.includes("bedroom") || normalized.includes("family room");
    if (hasExterior && hasRoom) {
        return {
            scene: "exterior",
            elements: weights
        };
    }
    // Escena dominante normal
    const scene = weights.length > 0 ? detectSceneFromWeights(weights[0].key) : "otros";
    return {
        scene,
        elements: weights
    };
}
function detectSceneFromWeights(key) {
    if (key.includes("pool")) return "piscina";
    if (key.includes("spa") || key.includes("massage")) return "spa";
    if (key.includes("buffet") || key.includes("restaurant")) return "restaurante";
    if (key.includes("bar")) return "bar";
    if (key.includes("suite") || key.includes("room")) return "habitacion";
    if (key.includes("lobby") || key.includes("meeting")) return "zonas_comunes";
    if (key.includes("facade")) return "exterior";
    return "otros";
}
}),
"[project]/src/lib/normalizeTags.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/lib/normalizeTags.ts
__turbopack_context__.s([
    "normalizeTags",
    ()=>normalizeTags
]);
function normalizeTags(rawTags) {
    const normalized = [];
    for (const t of rawTags){
        const label = (t.label || "").toLowerCase();
        // ------------------------------------------------------------
        // 🏊 Piscinas
        // ------------------------------------------------------------
        if (label.includes("infinity pool")) normalized.push("infinity pool");
        if (label.includes("outdoor pool")) normalized.push("outdoor pool");
        if (label.includes("indoor pool")) normalized.push("indoor pool");
        if (label.includes("pool")) normalized.push("pool");
        // ------------------------------------------------------------
        // 🌊 Vistas
        // ------------------------------------------------------------
        if (label.includes("sea") || label.includes("ocean")) normalized.push("sea view");
        // ------------------------------------------------------------
        // 💆 Spa (todas las variantes reales del backend)
        // ------------------------------------------------------------
        if (label.includes("spa")) normalized.push("spa");
        if (label.includes("massage table")) normalized.push("massage table");
        if (label.includes("massage room")) normalized.push("massage room");
        if (label.includes("massage")) normalized.push("massage table");
        if (label.includes("treatment room")) normalized.push("treatment room");
        if (label.includes("treatment")) normalized.push("treatment room");
        if (label.includes("relaxation")) normalized.push("relaxation area");
        if (label.includes("wellness")) normalized.push("wellness area");
        if (label.includes("sauna")) normalized.push("sauna");
        if (label.includes("steam room")) normalized.push("steam room");
        if (label.includes("hammam")) normalized.push("hammam");
        if (label.includes("jacuzzi")) normalized.push("jacuzzi");
        // ------------------------------------------------------------
        // 🛏️ Habitaciones
        // ------------------------------------------------------------
        if (label.includes("suite")) normalized.push("suite");
        if (label.includes("room")) normalized.push("hotel room");
        if (label.includes("bedroom")) normalized.push("hotel room");
        // ------------------------------------------------------------
        // 🍽️ Restaurantes
        // ------------------------------------------------------------
        if (label.includes("restaurant")) normalized.push("restaurant");
        if (label.includes("buffet")) normalized.push("buffet");
        if (label.includes("dining room")) normalized.push("dining room");
        // ------------------------------------------------------------
        // 🍸 Bares
        // ------------------------------------------------------------
        if (label.includes("rooftop bar")) normalized.push("rooftop bar");
        if (label.includes("cocktail bar")) normalized.push("cocktail bar");
        if (label.includes("bar")) normalized.push("bar");
        // ------------------------------------------------------------
        // 🛋️ Zonas comunes
        // ------------------------------------------------------------
        if (label.includes("lobby")) normalized.push("lobby");
        if (label.includes("reception")) normalized.push("lobby");
        if (label.includes("common area")) normalized.push("common area");
        if (label.includes("coworking")) normalized.push("coworking area");
        if (label.includes("meeting room")) normalized.push("meeting room");
        if (label.includes("conference room")) normalized.push("meeting room");
        if (label.includes("kids club")) normalized.push("kids club");
        // ------------------------------------------------------------
        // 🌴 Exterior
        // ------------------------------------------------------------
        if (label.includes("exterior")) normalized.push("exterior");
        if (label.includes("facade")) normalized.push("exterior");
        if (label.includes("building")) normalized.push("exterior");
        if (label.includes("terrace")) normalized.push("terrace");
        if (label.includes("balcony")) normalized.push("balcony");
        // ------------------------------------------------------------
        // Fallback
        // ------------------------------------------------------------
        normalized.push(label);
    }
    return normalized;
}
}),
"[project]/src/lib/generateAiTitleV2.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generateAiTitleFromClip",
    ()=>generateAiTitleFromClip
]);
// src/lib/generateAiTitle.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$aiTitleTemplates$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/aiTitleTemplates.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$generateDynamicTitles$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/generateDynamicTitles.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sceneWeights$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/sceneWeights.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$normalizeTags$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/normalizeTags.ts [app-route] (ecmascript)"); // ⭐ IMPORTANTE
;
;
;
;
const CLIP_API_URL = process.env.NEXT_PUBLIC_CLIP_URL || "http://localhost:8000/rank";
async function generateAiTitleFromClip(imageUrl, category, tags) {
    // ------------------------------------------------------------
    // ⭐ Normalizar tags antes de todo
    // ------------------------------------------------------------
    const normalizedTags = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$normalizeTags$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeTags"])(tags || []);
    console.log("🔧 Normalized tags:", normalizedTags);
    // ------------------------------------------------------------
    // 1. Scene Weighting: detectar escena dominante + pesos
    // ------------------------------------------------------------
    const { scene, elements } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sceneWeights$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["computeSceneWeights"])(normalizedTags);
    const normalizedCategory = (category || "").toLowerCase();
    console.log("🎯 Scene detected:", scene);
    console.log("📊 Scene weights:", elements);
    // ------------------------------------------------------------
    // 2. Títulos dinámicos basados en tags normalizados
    // ------------------------------------------------------------
    const dynamicTitles = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$generateDynamicTitles$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateDynamicTitles"])(normalizedTags);
    console.log("🧠 Dynamic titles:", dynamicTitles);
    // ------------------------------------------------------------
    // 3. Plantillas fijas según categoría o escena
    // ------------------------------------------------------------
    let templates;
    if (normalizedCategory === "piscina" || scene === "piscina") {
        templates = [
            ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$aiTitleTemplates$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TITLE_TEMPLATES"].piscina,
            ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$aiTitleTemplates$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TITLE_TEMPLATES"].exterior
        ];
    } else if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$aiTitleTemplates$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TITLE_TEMPLATES"][scene]) {
        templates = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$aiTitleTemplates$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TITLE_TEMPLATES"][scene];
    } else {
        templates = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$aiTitleTemplates$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TITLE_TEMPLATES"][normalizedCategory] || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$aiTitleTemplates$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TITLE_TEMPLATES"]["otros"];
    }
    const templateSpanish = templates.map((t)=>t.es);
    const templateEnglish = templates.map((t)=>t.en);
    console.log("📚 Template Spanish:", templateSpanish);
    console.log("📚 Template English:", templateEnglish);
    // ------------------------------------------------------------
    // 4. Fusionar dinámicos + plantillas
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
    // 5. Llamar a CLIP
    // ------------------------------------------------------------
    const res = await fetch(CLIP_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            url: imageUrl,
            texts: englishCandidates
        })
    });
    if (!res.ok) {
        console.error("❌ Error llamando a CLIP /rank:", await res.text());
        return spanishCandidates[0];
    }
    const ranked = await res.json();
    console.log("🏆 CLIP ranking:", ranked);
    const bestEnglish = ranked[0]?.label;
    if (!bestEnglish) return spanishCandidates[0];
    // ------------------------------------------------------------
    // 6. Buscar equivalente en español
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
// ⭐ Traducción avanzada ES → EN para CLIP
// ------------------------------------------------------------
function translateToEnglish(spanish) {
    let en = spanish.toLowerCase();
    // Piscina avanzada
    en = en.replace("piscina infinita con vistas al mar al atardecer", "infinity pool with ocean view at sunset");
    en = en.replace("infinity pool con vistas al océano al atardecer", "infinity pool with ocean view at sunset");
    en = en.replace("piscina infinita con vistas al mar", "infinity pool with sea view");
    en = en.replace("infinity pool frente al océano", "infinity pool facing the ocean");
    en = en.replace("piscina exterior con vistas al mar", "outdoor pool with sea view");
    en = en.replace("piscina al aire libre frente al océano", "outdoor pool facing the ocean");
    en = en.replace("piscina exterior iluminada al atardecer", "outdoor pool illuminated at sunset");
    en = en.replace("piscina exterior del hotel", "outdoor hotel pool");
    en = en.replace("piscina interior climatizada", "heated indoor pool");
    en = en.replace("piscina del hotel", "hotel swimming pool");
    // Spa avanzado
    en = en.replace("sala de masajes con camillas preparadas", "massage room with prepared tables");
    en = en.replace("camillas de masaje en un spa acogedor", "massage tables in a cozy spa");
    en = en.replace("sala de tratamientos con iluminación cálida", "treatment room with warm lighting");
    en = en.replace("zona de spa con camillas y toallas preparadas", "spa area with massage tables and prepared towels");
    en = en.replace("espacio de bienestar con camillas de masaje", "wellness area with massage tables");
    en = en.replace("sala de spa lista para tratamientos relajantes", "spa room ready for relaxing treatments");
    en = en.replace("spa con sauna y zona de relajación", "spa with sauna and relaxation area");
    en = en.replace("spa con jacuzzi y camillas de masaje", "spa with jacuzzi and massage tables");
    // Restaurante
    en = en.replace("restaurante con vistas al mar", "restaurant with sea view");
    en = en.replace("buffet del hotel", "hotel buffet");
    en = en.replace("restaurante con terraza exterior", "restaurant with outdoor terrace");
    en = en.replace("restaurante elegante del hotel", "elegant hotel restaurant");
    // Bar
    en = en.replace("rooftop bar con vistas a la ciudad", "rooftop bar with city view");
    en = en.replace("rooftop bar del hotel", "hotel rooftop bar");
    en = en.replace("bar iluminado por la noche", "bar illuminated at night");
    en = en.replace("bar del hotel con ambiente moderno", "hotel bar with modern atmosphere");
    // Habitaciones
    en = en.replace("habitación con vistas al mar", "room with sea view");
    en = en.replace("habitación con balcón privado", "room with private balcony");
    en = en.replace("habitación moderna y luminosa", "modern and bright room");
    // Zonas comunes
    en = en.replace("lobby moderno del hotel", "modern hotel lobby");
    en = en.replace("zona común con ambiente acogedor", "common area with cozy atmosphere");
    en = en.replace("zona coworking del hotel", "hotel coworking area");
    en = en.replace("sala de reuniones moderna", "modern meeting room");
    en = en.replace("kids club del hotel", "hotel kids club");
    // Exterior
    en = en.replace("fachada del hotel con vistas al mar", "hotel facade with sea view");
    en = en.replace("fachada exterior del hotel", "exterior facade of the hotel");
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
async function updateMediaAiTitle(mediaId, imageUrl, category, tags// ← AÑADIDO
) {
    try {
        console.log("🧠 Generando título con CLIP para:", imageUrl);
        console.log("🏷️ Tags recibidos:", tags);
        // ← AÑADIDO: pasar tags al generador
        const ai_title = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$generateAiTitleV2$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateAiTitleFromClip"])(imageUrl, category, tags);
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$categoryMap$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/categoryMap.ts [app-route] (ecmascript)");
// ⭐ IMPORTANTE: importar el generador de títulos
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
            console.error('❌ Error verificando hash:', checkError);
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
            const tags = analysis.tags;
            const category = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$categoryMap$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["detectCategory"])(tags);
            console.log('🏷️ Tags (premium):', tags);
            console.log('📂 Categoría detectada:', category);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                url: existing.url,
                type: existing.type,
                quality_score: existing.quality_score || 0.8,
                is_duplicate: true,
                tags,
                category,
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
        const tags = analysis.tags;
        const category = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$categoryMap$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["detectCategory"])(tags);
        console.log('🏷️ Tags (premium):', tags);
        console.log('📂 Categoría detectada:', category);
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
                tags,
                confidence_scores: tags,
                quality_score: qualityScore,
                hash,
                category,
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
            // SOLO UNA LLAMADA — CON TAGS
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

//# sourceMappingURL=%5Broot-of-the-server%5D__acac8dc2._.js.map