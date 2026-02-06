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
async function analyzeImage(url, threshold = 0.25) {
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

__turbopack_context__.s([
    "CATEGORY_MAP",
    ()=>CATEGORY_MAP,
    "detectCategory",
    ()=>detectCategory
]);
const CATEGORY_MAP = {
    exterior: [
        "exterior",
        "garden",
        "parking",
        "view",
        "balcony",
        "terrace",
        "facade"
    ],
    habitaciones: [
        "hotel room",
        "suite",
        "family room",
        "double room",
        "single room",
        "king bed",
        "queen bed",
        "bedroom"
    ],
    interior: [
        "corridor",
        "hallway",
        "interior"
    ],
    salas_comunes: [
        "lobby",
        "reception",
        "hall",
        "common area"
    ],
    restaurante: [
        "restaurant",
        "breakfast area",
        "bar"
    ],
    piscina: [
        "swimming pool",
        "pool"
    ],
    spa: [
        "spa",
        "gym"
    ]
};
function detectCategory(tags) {
    const lower = tags.map((t)=>t.toLowerCase());
    for (const [category, keywords] of Object.entries(CATEGORY_MAP)){
        if (keywords.some((k)=>lower.includes(k))) {
            return category;
        }
    }
    return "otros";
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/ai.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$categoryMap$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/categoryMap.ts [app-route] (ecmascript)");
;
;
;
;
;
;
;
// Validación de variables
if (!process.env.CLOUDINARY_CLOUD_NAME) throw new Error('❌ CLOUDINARY_CLOUD_NAME no está definido');
if (!process.env.CLOUDINARY_API_KEY) throw new Error('❌ CLOUDINARY_API_KEY no está definido');
if (!process.env.CLOUDINARY_API_SECRET) throw new Error('❌ CLOUDINARY_API_SECRET no está definido');
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cloudinary$2f$cloudinary$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["v2"].config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
// Cliente Supabase
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(("TURBOPACK compile-time value", "https://konsrtuynhzqssakgdlw.supabase.co"), ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvbnNydHV5bmh6cXNzYWtnZGx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NjAyNjQsImV4cCI6MjA4NTEzNjI2NH0.jQryirwSpavWFeVMTBim19mQEccAArqBtwi_4-r4KsY"));
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
        // Convertir a buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = __TURBOPACK__imported__module__$5b$externals$5d2f$buffer__$5b$external$5d$__$28$buffer$2c$__cjs$29$__["Buffer"].from(arrayBuffer);
        // Hash único
        const hash = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].createHash('sha256').update(buffer).digest('hex');
        console.log('🔑 Hash generado:', hash.substring(0, 16));
        // Buscar duplicado
        const { data: existing, error: checkError } = await supabase.from('image_hashes').select('url, type, quality_score').eq('hash', hash).single();
        if (checkError && checkError.code !== 'PGRST116') {
            console.error('❌ Error verificando hash:', checkError);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Error verificando duplicados'
            }, {
                status: 500
            });
        }
        // Si es duplicado → analizar igualmente para obtener tags y categoría
        if (existing) {
            console.log('⚠️ Imagen duplicada detectada');
            const analysis = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["analyzeImage"])(existing.url);
            const tagsArray = analysis.tags.map((t)=>t.tag);
            const category = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$categoryMap$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["detectCategory"])(tagsArray);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                url: existing.url,
                type: existing.type,
                quality_score: existing.quality_score || 0.8,
                is_duplicate: true,
                tags: analysis.tags,
                category,
                message: 'Esta imagen ya existe en tu galería'
            });
        }
        console.log('📤 Subiendo a Cloudinary...');
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
        console.log('🧠 Analizando imagen con ExSabri IA...');
        const analysis = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["analyzeImage"])(uploadResult.secure_url);
        const tagsArray = analysis.tags.map((t)=>t.tag);
        const category = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$categoryMap$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["detectCategory"])(tagsArray);
        console.log('🏷️ Tags:', tagsArray);
        console.log('📂 Categoría detectada:', category);
        const qualityScore = uploadResult.quality_analysis?.focus || 0.8;
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
        console.log('💾 Guardando imagen en tabla media...');
        const { data: photoData, error: photoError } = await supabase.from('media').insert([
            {
                hotel_id: hotelId,
                url: uploadResult.secure_url,
                tags: tagsArray,
                confidence_scores: analysis.tags,
                quality_score: qualityScore,
                hash,
                category
            }
        ]).select();
        if (photoError) {
            console.error('❌ Error guardando foto:', photoError);
            throw new Error('Error al guardar foto en base de datos');
        }
        console.log('✅ Foto guardada con ID:', photoData[0].id);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            url: uploadResult.secure_url,
            type: uploadResult.resource_type,
            quality_score: qualityScore,
            is_duplicate: false,
            tags: analysis.tags,
            category,
            photo_id: photoData[0].id
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

//# sourceMappingURL=%5Broot-of-the-server%5D__ccf7391c._.js.map