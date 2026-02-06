module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/src/lib/supabaseClient.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-ssr] (ecmascript) <locals>");
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://konsrtuynhzqssakgdlw.supabase.co");
const supabaseAnonKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvbnNydHV5bmh6cXNzYWtnZGx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NjAyNjQsImV4cCI6MjA4NTEzNjI2NH0.jQryirwSpavWFeVMTBim19mQEccAArqBtwi_4-r4KsY");
// ✅ Añade esta verificación
console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Key:", supabaseAnonKey);
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseAnonKey);
}),
"[project]/src/hooks/useLocations.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CITIES_BY_PROVINCE",
    ()=>CITIES_BY_PROVINCE,
    "COUNTRIES",
    ()=>COUNTRIES,
    "PROVINCES_BY_COUNTRY",
    ()=>PROVINCES_BY_COUNTRY,
    "useLocations",
    ()=>useLocations
]);
// src/hooks/useLocations.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
const COUNTRIES = [
    {
        value: "es",
        label: "España"
    },
    {
        value: "pt",
        label: "Portugal"
    }
];
// Provincias de España
const SPAIN_PROVINCES = [
    {
        value: "a_coruna",
        label: "A Coruña"
    },
    {
        value: "alava",
        label: "Álava"
    },
    {
        value: "albacete",
        label: "Albacete"
    },
    {
        value: "alicante",
        label: "Alicante"
    },
    {
        value: "almeria",
        label: "Almería"
    },
    {
        value: "asturias",
        label: "Asturias"
    },
    {
        value: "avila",
        label: "Ávila"
    },
    {
        value: "badajoz",
        label: "Badajoz"
    },
    {
        value: "barcelona",
        label: "Barcelona"
    },
    {
        value: "bizkaia",
        label: "Bizkaia"
    },
    {
        value: "burgos",
        label: "Burgos"
    },
    {
        value: "caceres",
        label: "Cáceres"
    },
    {
        value: "cadiz",
        label: "Cádiz"
    },
    {
        value: "cantabria",
        label: "Cantabria"
    },
    {
        value: "castellon",
        label: "Castellón"
    },
    {
        value: "ceuta",
        label: "Ceuta"
    },
    {
        value: "ciudad_real",
        label: "Ciudad Real"
    },
    {
        value: "cordoba",
        label: "Córdoba"
    },
    {
        value: "cuenca",
        label: "Cuenca"
    },
    {
        value: "girona",
        label: "Girona"
    },
    {
        value: "granada",
        label: "Granada"
    },
    {
        value: "guadalajara",
        label: "Guadalajara"
    },
    {
        value: "gipuzkoa",
        label: "Gipuzkoa"
    },
    {
        value: "huelva",
        label: "Huelva"
    },
    {
        value: "huesca",
        label: "Huesca"
    },
    {
        value: "illes_balears",
        label: "Illes Balears"
    },
    {
        value: "jaen",
        label: "Jaén"
    },
    {
        value: "la_rioja",
        label: "La Rioja"
    },
    {
        value: "las_palmas",
        label: "Las Palmas"
    },
    {
        value: "leon",
        label: "León"
    },
    {
        value: "lleida",
        label: "Lleida"
    },
    {
        value: "lugo",
        label: "Lugo"
    },
    {
        value: "madrid",
        label: "Madrid"
    },
    {
        value: "malaga",
        label: "Málaga"
    },
    {
        value: "melilla",
        label: "Melilla"
    },
    {
        value: "murcia",
        label: "Murcia"
    },
    {
        value: "navarra",
        label: "Navarra"
    },
    {
        value: "ourense",
        label: "Ourense"
    },
    {
        value: "palencia",
        label: "Palencia"
    },
    {
        value: "pontevedra",
        label: "Pontevedra"
    },
    {
        value: "salamanca",
        label: "Salamanca"
    },
    {
        value: "segovia",
        label: "Segovia"
    },
    {
        value: "sevilla",
        label: "Sevilla"
    },
    {
        value: "soria",
        label: "Soria"
    },
    {
        value: "tarragona",
        label: "Tarragona"
    },
    {
        value: "teruel",
        label: "Teruel"
    },
    {
        value: "toledo",
        label: "Toledo"
    },
    {
        value: "valencia",
        label: "Valencia"
    },
    {
        value: "valladolid",
        label: "Valladolid"
    },
    {
        value: "zamora",
        label: "Zamora"
    },
    {
        value: "zaragoza",
        label: "Zaragoza"
    }
];
// Distritos de Portugal (equivalentes a provincias)
const PORTUGAL_DISTRICTS = [
    {
        value: "aveiro",
        label: "Aveiro"
    },
    {
        value: "beja",
        label: "Beja"
    },
    {
        value: "braga",
        label: "Braga"
    },
    {
        value: "braganca",
        label: "Bragança"
    },
    {
        value: "castelo_branco",
        label: "Castelo Branco"
    },
    {
        value: "coimbra",
        label: "Coimbra"
    },
    {
        value: "evora",
        label: "Évora"
    },
    {
        value: "faro",
        label: "Faro"
    },
    {
        value: "guarda",
        label: "Guarda"
    },
    {
        value: "leiria",
        label: "Leiria"
    },
    {
        value: "lisboa",
        label: "Lisboa"
    },
    {
        value: "portalegre",
        label: "Portalegre"
    },
    {
        value: "porto",
        label: "Porto"
    },
    {
        value: "santarem",
        label: "Santarém"
    },
    {
        value: "setubal",
        label: "Setúbal"
    },
    {
        value: "viana_do_castelo",
        label: "Viana do Castelo"
    },
    {
        value: "vila_real",
        label: "Vila Real"
    },
    {
        value: "viseu",
        label: "Viseu"
    },
    {
        value: "acores",
        label: "Açores (Región Autónoma)"
    },
    {
        value: "madeira",
        label: "Madeira (Región Autónoma)"
    }
];
const PROVINCES_BY_COUNTRY = {
    es: SPAIN_PROVINCES,
    pt: PORTUGAL_DISTRICTS
};
const CITIES_BY_PROVINCE = {
    // ========================================
    // ESPAÑA
    // ========================================
    // A Coruña
    a_coruna: [
        {
            value: "a_coruna",
            label: "A Coruña"
        },
        {
            value: "santiago_de_compostela",
            label: "Santiago de Compostela"
        },
        {
            value: "ferrol",
            label: "Ferrol"
        },
        {
            value: "ourense",
            label: "Ourense"
        },
        {
            value: "vigo",
            label: "Vigo"
        },
        {
            value: "pontevedra",
            label: "Pontevedra"
        },
        {
            value: "lugo",
            label: "Lugo"
        },
        {
            value: "betanzos",
            label: "Betanzos"
        },
        {
            value: "naron",
            label: "Narón"
        },
        {
            value: "carballo",
            label: "Carballo"
        }
    ],
    // Álava
    alava: [
        {
            value: "vitoria_gasteiz",
            label: "Vitoria-Gasteiz"
        },
        {
            value: "lantarón",
            label: "Lantarón"
        },
        {
            value: "amurrio",
            label: "Amurrio"
        },
        {
            value: "laguardia",
            label: "Laguardia"
        },
        {
            value: "agurain",
            label: "Agurain/Salvatierra"
        }
    ],
    // Albacete
    albacete: [
        {
            value: "albacete",
            label: "Albacete"
        },
        {
            value: "hellin",
            label: "Hellín"
        },
        {
            value: "almansa",
            label: "Almansa"
        },
        {
            value: "la_roda",
            label: "La Roda"
        },
        {
            value: "villarrobledo",
            label: "Villarrobledo"
        }
    ],
    // Alicante
    alicante: [
        {
            value: "alicante",
            label: "Alicante"
        },
        {
            value: "elche",
            label: "Elche"
        },
        {
            value: "torrevieja",
            label: "Torrevieja"
        },
        {
            value: "benidorm",
            label: "Benidorm"
        },
        {
            value: "alcoy",
            label: "Alcoy"
        },
        {
            value: "eldense",
            label: "Elda"
        },
        {
            value: "san_vicente",
            label: "San Vicente del Raspeig"
        },
        {
            value: "orihuela",
            label: "Orihuela"
        },
        {
            value: "villena",
            label: "Villena"
        },
        {
            value: "dénia",
            label: "Dénia"
        }
    ],
    // Almería
    almeria: [
        {
            value: "almeria",
            label: "Almería"
        },
        {
            value: "roquetas_de_mar",
            label: "Roquetas de Mar"
        },
        {
            value: "el_ejido",
            label: "El Ejido"
        },
        {
            value: "nijar",
            label: "Níjar"
        },
        {
            value: "huercal_overa",
            label: "Huércal-Overa"
        }
    ],
    // Asturias
    asturias: [
        {
            value: "oviedo",
            label: "Oviedo"
        },
        {
            value: "gijon",
            label: "Gijón"
        },
        {
            value: "aviles",
            label: "Avilés"
        },
        {
            value: "langreo",
            label: "Langreo"
        },
        {
            value: "mieres",
            label: "Mieres"
        }
    ],
    // Ávila
    avila: [
        {
            value: "avila",
            label: "Ávila"
        },
        {
            value: "arenas_de_san_pedro",
            label: "Arenas de San Pedro"
        },
        {
            value: "arévalo",
            label: "Arévalo"
        }
    ],
    // Badajoz
    badajoz: [
        {
            value: "badajoz",
            label: "Badajoz"
        },
        {
            value: "merida",
            label: "Mérida"
        },
        {
            value: "don_benito",
            label: "Don Benito"
        },
        {
            value: "alburquerque",
            label: "Alburquerque"
        },
        {
            value: "villanueva_de_la_serena",
            label: "Villanueva de la Serena"
        }
    ],
    // Barcelona
    barcelona: [
        {
            value: "barcelona",
            label: "Barcelona"
        },
        {
            value: "badalona",
            label: "Badalona"
        },
        {
            value: "terrassa",
            label: "Terrassa"
        },
        {
            value: "sabadell",
            label: "Sabadell"
        },
        {
            value: "mataro",
            label: "Mataró"
        },
        {
            value: "granollers",
            label: "Granollers"
        },
        {
            value: "hospitalet",
            label: "L'Hospitalet de Llobregat"
        },
        {
            value: "sitges",
            label: "Sitges"
        },
        {
            value: "castelldefels",
            label: "Castelldefels"
        },
        {
            value: "vilanova_i_la_geltru",
            label: "Vilanova i la Geltrú"
        }
    ],
    // Bizkaia
    bizkaia: [
        {
            value: "bilbao",
            label: "Bilbao"
        },
        {
            value: "barakaldo",
            label: "Barakaldo"
        },
        {
            value: "getxo",
            label: "Getxo"
        },
        {
            value: "portugalete",
            label: "Portugalete"
        },
        {
            value: "santurtzi",
            label: "Santurtzi"
        }
    ],
    // Burgos
    burgos: [
        {
            value: "burgos",
            label: "Burgos"
        },
        {
            value: "aranda_de_duero",
            label: "Aranda de Duero"
        },
        {
            value: "miranda_de_ebro",
            label: "Miranda de Ebro"
        },
        {
            value: "briviesca",
            label: "Briviesca"
        }
    ],
    // Cáceres
    caceres: [
        {
            value: "caceres",
            label: "Cáceres"
        },
        {
            value: "plasencia",
            label: "Plasencia"
        },
        {
            value: "navalmoral_de_la_mata",
            label: "Navalmoral de la Mata"
        },
        {
            value: "trujillo",
            label: "Trujillo"
        },
        {
            value: "coria",
            label: "Coria"
        }
    ],
    // Cádiz
    cadiz: [
        {
            value: "cadiz",
            label: "Cádiz"
        },
        {
            value: "jerez_de_la_frontera",
            label: "Jerez de la Frontera"
        },
        {
            value: "algeciras",
            label: "Algeciras"
        },
        {
            value: "chiclana_de_la_frontera",
            label: "Chiclana de la Frontera"
        },
        {
            value: "san_fernando",
            label: "San Fernando"
        },
        {
            value: "el_puerto_de_santa_maria",
            label: "El Puerto de Santa María"
        },
        {
            value: "rota",
            label: "Rota"
        },
        {
            value: "puerto_real",
            label: "Puerto Real"
        }
    ],
    // Cantabria
    cantabria: [
        {
            value: "santander",
            label: "Santander"
        },
        {
            value: "torrelavega",
            label: "Torrelavega"
        },
        {
            value: "camargo",
            label: "Camargo"
        },
        {
            value: "castro_urdiales",
            label: "Castro Urdiales"
        },
        {
            value: "llanescas",
            label: "Laredo"
        }
    ],
    // Castellón
    castellon: [
        {
            value: "castellon_de_la_plana",
            label: "Castellón de la Plana"
        },
        {
            value: "vila_real",
            label: "Vila-real"
        },
        {
            value: "burriana",
            label: "Burriana"
        },
        {
            value: "la_vilavella",
            label: "La Vilavella"
        },
        {
            value: "oropesa_del_mar",
            label: "Oropesa del Mar"
        }
    ],
    // Ceuta
    ceuta: [
        {
            value: "ceuta",
            label: "Ceuta"
        }
    ],
    // Ciudad Real
    ciudad_real: [
        {
            value: "ciudad_real",
            label: "Ciudad Real"
        },
        {
            value: "puertollano",
            label: "Puertollano"
        },
        {
            value: "tomelloso",
            label: "Tomelloso"
        },
        {
            value: "valdepenas",
            label: "Valdepeñas"
        },
        {
            value: "manzanares",
            label: "Manzanares"
        }
    ],
    // Córdoba
    cordoba: [
        {
            value: "cordoba",
            label: "Córdoba"
        },
        {
            value: "lucena",
            label: "Lucena"
        },
        {
            value: "puente_genil",
            label: "Puente Genil"
        },
        {
            value: "cabra",
            label: "Cabra"
        },
        {
            value: "montilla",
            label: "Montilla"
        }
    ],
    // Cuenca
    cuenca: [
        {
            value: "cuenca",
            label: "Cuenca"
        },
        {
            value: "tarancón",
            label: "Tarancón"
        },
        {
            value: "motilla_del_palancar",
            label: "Motilla del Palancar"
        }
    ],
    // Girona
    girona: [
        {
            value: "girona",
            label: "Girona"
        },
        {
            value: "blanes",
            label: "Blanes"
        },
        {
            value: "figueres",
            label: "Figueres"
        },
        {
            value: "salt",
            label: "Salt"
        },
        {
            value: "palamos",
            label: "Palamós"
        }
    ],
    // Granada
    granada: [
        {
            value: "granada",
            label: "Granada"
        },
        {
            value: "motril",
            label: "Motril"
        },
        {
            value: "almeria",
            label: "Almuñécar"
        },
        {
            value: "armilla",
            label: "Armilla"
        },
        {
            value: "loja",
            label: "Loja"
        }
    ],
    // Guadalajara
    guadalajara: [
        {
            value: "guadalajara",
            label: "Guadalajara"
        },
        {
            value: "azuqueca_de_henares",
            label: "Azuqueca de Henares"
        },
        {
            value: "siguenza",
            label: "Sigüenza"
        },
        {
            value: "molina_de_aragon",
            label: "Molina de Aragón"
        }
    ],
    // Gipuzkoa
    gipuzkoa: [
        {
            value: "san_sebastian",
            label: "San Sebastián"
        },
        {
            value: "irun",
            label: "Irun"
        },
        {
            value: "errenteria",
            label: "Errenteria"
        },
        {
            value: "zarautz",
            label: "Zarautz"
        },
        {
            value: "egoa",
            label: "Eibar"
        }
    ],
    // Huelva
    huelva: [
        {
            value: "huelva",
            label: "Huelva"
        },
        {
            value: "almonte",
            label: "Almonte"
        },
        {
            value: "lepe",
            label: "Lepe"
        },
        {
            value: "cartaya",
            label: "Cartaya"
        },
        {
            value: "ayamonte",
            label: "Ayamonte"
        }
    ],
    // Huesca
    huesca: [
        {
            value: "huesca",
            label: "Huesca"
        },
        {
            value: "barbastro",
            label: "Barbastro"
        },
        {
            value: "monzon",
            label: "Monzón"
        },
        {
            value: "fraga",
            label: "Fraga"
        },
        {
            value: "jaca",
            label: "Jaca"
        }
    ],
    // Illes Balears
    illes_balears: [
        {
            value: "palma",
            label: "Palma de Mallorca"
        },
        {
            value: "calvia",
            label: "Calviá"
        },
        {
            value: "manacor",
            label: "Manacor"
        },
        {
            value: "inca",
            label: "Inca"
        },
        {
            value: "eivissa",
            label: "Eivissa"
        },
        {
            value: "mao",
            label: "Maó"
        },
        {
            value: "alaior",
            label: "Alaior"
        }
    ],
    // Jaén
    jaen: [
        {
            value: "jaen",
            label: "Jaén"
        },
        {
            value: "linares",
            label: "Linares"
        },
        {
            value: "ujijar",
            label: "Úbeda"
        },
        {
            value: "bailén",
            label: "Bailén"
        },
        {
            value: "andujar",
            label: "Andújar"
        }
    ],
    // La Rioja
    la_rioja: [
        {
            value: "logrono",
            label: "Logroño"
        },
        {
            value: "calahorra",
            label: "Calahorra"
        },
        {
            value: "aranda_de_duero",
            label: "Arnedo"
        },
        {
            value: "haro",
            label: "Haro"
        },
        {
            value: "alfaro",
            label: "Alfaro"
        }
    ],
    // Las Palmas
    las_palmas: [
        {
            value: "las_palmas",
            label: "Las Palmas de Gran Canaria"
        },
        {
            value: "telde",
            label: "Telde"
        },
        {
            value: "arucas",
            label: "Arucas"
        },
        {
            value: "galdar",
            label: "Gáldar"
        },
        {
            value: "santa_maria_de_guia",
            label: "Santa María de Guía"
        }
    ],
    // León
    leon: [
        {
            value: "leon",
            label: "León"
        },
        {
            value: "ponferrada",
            label: "Ponferrada"
        },
        {
            value: "sahagún",
            label: "Sahagún"
        },
        {
            value: "astorga",
            label: "Astorga"
        },
        {
            value: "la_baneza",
            label: "La Bañeza"
        }
    ],
    // Lleida
    lleida: [
        {
            value: "lleida",
            label: "Lleida"
        },
        {
            value: "balaguer",
            label: "Balaguer"
        },
        {
            value: "tárrega",
            label: "Tàrrega"
        },
        {
            value: "mollerussa",
            label: "Mollerussa"
        },
        {
            value: "vielha",
            label: "Vielha"
        }
    ],
    // Lugo
    lugo: [
        {
            value: "lugo",
            label: "Lugo"
        },
        {
            value: "monforte_de_lemos",
            label: "Monforte de Lemos"
        },
        {
            value: "vilalba",
            label: "Vilalba"
        },
        {
            value: "ribadeo",
            label: "Ribadeo"
        },
        {
            value: "fonsagrada",
            label: "A Fonsagrada"
        }
    ],
    // Madrid
    madrid: [
        {
            value: "madrid",
            label: "Madrid"
        },
        {
            value: "alcala_de_henares",
            label: "Alcalá de Henares"
        },
        {
            value: "getafe",
            label: "Getafe"
        },
        {
            value: "leganes",
            label: "Leganés"
        },
        {
            value: "alcorcon",
            label: "Alcorcón"
        },
        {
            value: "fuenlabrada",
            label: "Fuenlabrada"
        },
        {
            value: "mostoles",
            label: "Móstoles"
        },
        {
            value: "parla",
            label: "Parla"
        },
        {
            value: "coslada",
            label: "Coslada"
        },
        {
            value: "torrejon_de_ardoz",
            label: "Torrejón de Ardoz"
        },
        {
            value: "alcobendas",
            label: "Alcobendas"
        },
        {
            value: "las_rozas",
            label: "Las Rozas de Madrid"
        },
        {
            value: "san_sebastian_de_los_reyes",
            label: "San Sebastián de los Reyes"
        },
        {
            value: "pozuelo_de_alarcon",
            label: "Pozuelo de Alarcón"
        },
        {
            value: "aranjuez",
            label: "Aranjuez"
        }
    ],
    // Málaga
    malaga: [
        {
            value: "malaga",
            label: "Málaga"
        },
        {
            value: "marbella",
            label: "Marbella"
        },
        {
            value: "fuengirola",
            label: "Fuengirola"
        },
        {
            value: "torremolinos",
            label: "Torremolinos"
        },
        {
            value: "villanueva_de_la_concepcion",
            label: "Vélez-Málaga"
        },
        {
            value: "rincon_de_la_victoria",
            label: "Rincón de la Victoria"
        },
        {
            value: "estepona",
            label: "Estepona"
        },
        {
            value: "antequera",
            label: "Antequera"
        },
        {
            value: "benalmadena",
            label: "Benalmádena"
        },
        {
            value: "nerja",
            label: "Nerja"
        }
    ],
    // Melilla
    melilla: [
        {
            value: "melilla",
            label: "Melilla"
        }
    ],
    // Murcia
    murcia: [
        {
            value: "murcia",
            label: "Murcia"
        },
        {
            value: "cartagena",
            label: "Cartagena"
        },
        {
            value: "lorca",
            label: "Lorca"
        },
        {
            value: "molina_de_segura",
            label: "Molina de Segura"
        },
        {
            value: "caravaca_de_la_cruz",
            label: "Caravaca de la Cruz"
        },
        {
            value: "cehegin",
            label: "Cehegín"
        },
        {
            value: "yecla",
            label: "Yecla"
        },
        {
            value: "jumilla",
            label: "Jumilla"
        },
        {
            value: "san_javier",
            label: "San Javier"
        },
        {
            value: "totana",
            label: "Totana"
        }
    ],
    // Navarra
    navarra: [
        {
            value: "pamplona",
            label: "Pamplona"
        },
        {
            value: "tudela",
            label: "Tudela"
        },
        {
            value: "estella",
            label: "Estella"
        },
        {
            value: "barañain",
            label: "Barañáin"
        },
        {
            value: "tafalia",
            label: "Tafalla"
        }
    ],
    // Ourense
    ourense: [
        {
            value: "ourense",
            label: "Ourense"
        },
        {
            value: "verin",
            label: "Verín"
        },
        {
            value: "ribeiro",
            label: "Ribadavia"
        },
        {
            value: "celanova",
            label: "Celanova"
        },
        {
            value: "ourense",
            label: "O Carballiño"
        }
    ],
    // Palencia
    palencia: [
        {
            value: "palencia",
            label: "Palencia"
        },
        {
            value: "villamuriel_de_cerrato",
            label: "Villamuriel de Cerrato"
        },
        {
            value: "frechilla",
            label: "Frechilla"
        },
        {
            value: "guardo",
            label: "Guardo"
        },
        {
            value: "cervera_de_pisuerga",
            label: "Cervera de Pisuerga"
        }
    ],
    // Pontevedra
    pontevedra: [
        {
            value: "pontevedra",
            label: "Pontevedra"
        },
        {
            value: "vigo",
            label: "Vigo"
        },
        {
            value: "marin",
            label: "Marín"
        },
        {
            value: "redondela",
            label: "Redondela"
        },
        {
            value: "villagarcia_de_aramonte",
            label: "Vilagarcía de Arousa"
        }
    ],
    // Salamanca
    salamanca: [
        {
            value: "salamanca",
            label: "Salamanca"
        },
        {
            value: "bejar",
            label: "Béjar"
        },
        {
            value: "ciudad_rodrigo",
            label: "Ciudad Rodrigo"
        },
        {
            value: "peñaranda_de_bracamonte",
            label: "Peñaranda de Bracamonte"
        },
        {
            value: "santa_marta_de_tormes",
            label: "Santa Marta de Tormes"
        }
    ],
    // Segovia
    segovia: [
        {
            value: "segovia",
            label: "Segovia"
        },
        {
            value: "el_espinar",
            label: "El Espinar"
        },
        {
            value: "sepulveda",
            label: "Sepúlveda"
        },
        {
            value: "la_granja",
            label: "La Granja de San Ildefonso"
        },
        {
            value: "cuellar",
            label: "Cuéllar"
        }
    ],
    // Sevilla
    sevilla: [
        {
            value: "sevilla",
            label: "Sevilla"
        },
        {
            value: "dos_hermanas",
            label: "Dos Hermanas"
        },
        {
            value: "alcala_de_guadaira",
            label: "Alcalá de Guadaíra"
        },
        {
            value: "utria",
            label: "Utrera"
        },
        {
            value: "mairena_del_aljarafe",
            label: "Mairena del Aljarafe"
        },
        {
            value: "carmona",
            label: "Carmona"
        },
        {
            value: "marchena",
            label: "Marchena"
        },
        {
            value: "osuna",
            label: "Osuna"
        },
        {
            value: "lebrija",
            label: "Lebrija"
        },
        {
            value: "ecija",
            label: "Écija"
        }
    ],
    // Soria
    soria: [
        {
            value: "soria",
            label: "Soria"
        },
        {
            value: "almazan",
            label: "Almazán"
        },
        {
            value: "el_burgo_de_osma",
            label: "El Burgo de Osma"
        },
        {
            value: "medinaceli",
            label: "Medinaceli"
        }
    ],
    // Tarragona
    tarragona: [
        {
            value: "tarragona",
            label: "Tarragona"
        },
        {
            value: "reus",
            label: "Reus"
        },
        {
            value: "valls",
            label: "Valls"
        },
        {
            value: "amposta",
            label: "Amposta"
        },
        {
            value: "la_roda_de_barcelona",
            label: "La Roda de Berà"
        },
        {
            value: "salou",
            label: "Salou"
        },
        {
            value: "cambrils",
            label: "Cambrils"
        },
        {
            value: "torredembarra",
            label: "Torredembarra"
        },
        {
            value: "el_vendrell",
            label: "El Vendrell"
        },
        {
            value: "montblanc",
            label: "Montblanc"
        }
    ],
    // Teruel
    teruel: [
        {
            value: "teruel",
            label: "Teruel"
        },
        {
            value: "alcañiz",
            label: "Alcañiz"
        },
        {
            value: "calamocha",
            label: "Calamocha"
        },
        {
            value: "valderrobres",
            label: "Valderrobres"
        },
        {
            value: "albarracin",
            label: "Albarracín"
        }
    ],
    // Toledo
    toledo: [
        {
            value: "toledo",
            label: "Toledo"
        },
        {
            value: "talavera_de_la_reina",
            label: "Talavera de la Reina"
        },
        {
            value: "illescas",
            label: "Illescas"
        },
        {
            value: "seseña",
            label: "Seseña"
        },
        {
            value: "torrijos",
            label: "Torrijos"
        }
    ],
    // Valencia
    valencia: [
        {
            value: "valencia",
            label: "Valencia"
        },
        {
            value: "torrent",
            label: "Torrent"
        },
        {
            value: "paterna",
            label: "Paterna"
        },
        {
            value: "gandia",
            label: "Gandía"
        },
        {
            value: "xativa",
            label: "Xàtiva"
        },
        {
            value: "sagunto",
            label: "Sagunto"
        },
        {
            value: "oliva",
            label: "Oliva"
        },
        {
            value: "bocairent",
            label: "Bocairent"
        },
        {
            value: "requena",
            label: "Requena"
        },
        {
            value: "cullera",
            label: "Cullera"
        }
    ],
    // Valladolid
    valladolid: [
        {
            value: "valladolid",
            label: "Valladolid"
        },
        {
            value: "medina_del_campo",
            label: "Medina del Campo"
        },
        {
            value: "laguna_de_duero",
            label: "Laguna de Duero"
        },
        {
            value: "tres_castillos",
            label: "Tordesillas"
        },
        {
            value: "penafiel",
            label: "Peñafiel"
        }
    ],
    // Zamora
    zamora: [
        {
            value: "zamora",
            label: "Zamora"
        },
        {
            value: "benavente",
            label: "Benavente"
        },
        {
            value: "toro",
            label: "Toro"
        },
        {
            value: "almendra",
            label: "Almendra"
        },
        {
            value: "puebla_de_sanmar",
            label: "Puebla de Sanabria"
        }
    ],
    // Zaragoza
    zaragoza: [
        {
            value: "zaragoza",
            label: "Zaragoza"
        },
        {
            value: "calatayud",
            label: "Calatayud"
        },
        {
            value: "ejea_de_los_caballeros",
            label: "Ejea de los Caballeros"
        },
        {
            value: "la_muela",
            label: "La Muela"
        },
        {
            value: "caspe",
            label: "Caspe"
        },
        {
            value: "uncastillo",
            label: "Uncastillo"
        },
        {
            value: "tauste",
            label: "Tauste"
        },
        {
            value: "alagon",
            label: "Alagón"
        },
        {
            value: "cuarte_de_huerva",
            label: "Cuarte de Huerva"
        },
        {
            value: "pedrola",
            label: "Pedrola"
        }
    ],
    // ========================================
    // PORTUGAL
    // ========================================
    // Aveiro
    aveiro: [
        {
            value: "aveiro",
            label: "Aveiro"
        },
        {
            value: "ilhavo",
            label: "Ílhavo"
        },
        {
            value: "ovar",
            label: "Ovar"
        },
        {
            value: "espinho",
            label: "Espinho"
        },
        {
            value: "figueira_da_foz",
            label: "Figueira da Foz"
        }
    ],
    // Beja
    beja: [
        {
            value: "beja",
            label: "Beja"
        },
        {
            value: "moura",
            label: "Moura"
        },
        {
            value: "serpa",
            label: "Serpa"
        },
        {
            value: "castro_verde",
            label: "Castro Verde"
        }
    ],
    // Braga
    braga: [
        {
            value: "braga",
            label: "Braga"
        },
        {
            value: "guimaraes",
            label: "Guimarães"
        },
        {
            value: "barcelos",
            label: "Barcelos"
        },
        {
            value: "vila_nova_de_famalicao",
            label: "Vila Nova de Famalicão"
        },
        {
            value: "fafe",
            label: "Fafe"
        }
    ],
    // Bragança
    braganca: [
        {
            value: "braganca",
            label: "Bragança"
        },
        {
            value: "mirandela",
            label: "Mirandela"
        },
        {
            value: "vimioso",
            label: "Vimioso"
        },
        {
            value: "mogadouro",
            label: "Mogadouro"
        }
    ],
    // Castelo Branco
    castelo_branco: [
        {
            value: "castelo_branco",
            label: "Castelo Branco"
        },
        {
            value: "covilha",
            label: "Covilhã"
        },
        {
            value: "fundao",
            label: "Fundão"
        },
        {
            value: "idaniha_a_nova",
            label: "Idanha-a-Nova"
        }
    ],
    // Coimbra
    coimbra: [
        {
            value: "coimbra",
            label: "Coimbra"
        },
        {
            value: "figueira_da_foz",
            label: "Figueira da Foz"
        },
        {
            value: "condeixa_a_nova",
            label: "Condeixa-a-Nova"
        },
        {
            value: "lousa",
            label: "Lousã"
        },
        {
            value: "mira",
            label: "Mira"
        }
    ],
    // Évora
    evora: [
        {
            value: "evora",
            label: "Évora"
        },
        {
            value: "estremoz",
            label: "Estremoz"
        },
        {
            value: "montemor_o_novo",
            label: "Montemor-o-Novo"
        },
        {
            value: "borba",
            label: "Borba"
        }
    ],
    // Faro (Algarve)
    faro: [
        {
            value: "faro",
            label: "Faro"
        },
        {
            value: "portimao",
            label: "Portimão"
        },
        {
            value: "albufeira",
            label: "Albufeira"
        },
        {
            value: "loulé",
            label: "Loulé"
        },
        {
            value: "lagos",
            label: "Lagos"
        },
        {
            value: "tavira",
            label: "Tavira"
        },
        {
            value: "olhao",
            label: "Olhão"
        },
        {
            value: "quarteira",
            label: "Quarteira"
        },
        {
            value: "vilamoura",
            label: "Vilamoura"
        },
        {
            value: "sagres",
            label: "Sagres"
        }
    ],
    // Guarda
    guarda: [
        {
            value: "guarda",
            label: "Guarda"
        },
        {
            value: "sabugal",
            label: "Sabugal"
        },
        {
            value: "pinhel",
            label: "Pinhel"
        },
        {
            value: "gouveia",
            label: "Gouveia"
        }
    ],
    // Leiria
    leiria: [
        {
            value: "leiria",
            label: "Leiria"
        },
        {
            value: "marinha_grande",
            label: "Marinha Grande"
        },
        {
            value: "pombal",
            label: "Pombal"
        },
        {
            value: "peniche",
            label: "Peniche"
        },
        {
            value: "nazaré",
            label: "Nazaré"
        },
        {
            value: "obidos",
            label: "Óbidos"
        }
    ],
    // Lisboa
    lisboa: [
        {
            value: "lisboa",
            label: "Lisboa"
        },
        {
            value: "sintra",
            label: "Sintra"
        },
        {
            value: "cascais",
            label: "Cascais"
        },
        {
            value: "oeiras",
            label: "Oeiras"
        },
        {
            value: "amadora",
            label: "Amadora"
        },
        {
            value: "odivelas",
            label: "Odivelas"
        },
        {
            value: "loures",
            label: "Loures"
        },
        {
            value: "almada",
            label: "Almada"
        },
        {
            value: "seixal",
            label: "Seixal"
        },
        {
            value: "barreiro",
            label: "Barreiro"
        },
        {
            value: "costa_caparica",
            label: "Costa da Caparica"
        },
        {
            value: "ericeira",
            label: "Ericeira"
        },
        {
            value: "quinta_do_lago",
            label: "Quinta do Lago"
        },
        {
            value: "estoril",
            label: "Estoril"
        },
        {
            value: "belém",
            label: "Belém"
        }
    ],
    // Portalegre
    portalegre: [
        {
            value: "portalegre",
            label: "Portalegre"
        },
        {
            value: "elvas",
            label: "Elvas"
        },
        {
            value: "estremoz",
            label: "Estremoz"
        },
        {
            value: "ponte_de_sor",
            label: "Ponte de Sor"
        }
    ],
    // Porto
    porto: [
        {
            value: "porto",
            label: "Porto"
        },
        {
            value: "vila_nova_de_gaia",
            label: "Vila Nova de Gaia"
        },
        {
            value: "matosinhos",
            label: "Matosinhos"
        },
        {
            value: "maia",
            label: "Maia"
        },
        {
            value: "povoa_de_varzim",
            label: "Póvoa de Varzim"
        },
        {
            value: "valongo",
            label: "Valongo"
        },
        {
            value: "trofa",
            label: "Trofa"
        },
        {
            value: "santa_maria_feira",
            label: "Santa Maria da Feira"
        },
        {
            value: "vila_do_conde",
            label: "Vila do Conde"
        },
        {
            value: "esposende",
            label: "Esposende"
        },
        {
            value: "braga",
            label: "Braga"
        },
        {
            value: "guimaraes",
            label: "Guimarães"
        },
        {
            value: "porto_covo",
            label: "Porto Covo"
        }
    ],
    // Santarém
    santarem: [
        {
            value: "santarem",
            label: "Santarém"
        },
        {
            value: "tomar",
            label: "Tomar"
        },
        {
            value: "riachos",
            label: "Rio Maior"
        },
        {
            value: "cartaxo",
            label: "Cartaxo"
        },
        {
            value: "alcanena",
            label: "Alcanena"
        }
    ],
    // Setúbal
    setubal: [
        {
            value: "setubal",
            label: "Setúbal"
        },
        {
            value: "sesimbra",
            label: "Sesimbra"
        },
        {
            value: "almada",
            label: "Almada"
        },
        {
            value: "montijo",
            label: "Montijo"
        },
        {
            value: "palmela",
            label: "Palmela"
        },
        {
            value: "costa_caparica",
            label: "Costa da Caparica"
        },
        {
            value: "sesimbra",
            label: "Sesimbra"
        },
        {
            value: "troia",
            label: "Tróia"
        }
    ],
    // Viana do Castelo
    viana_do_castelo: [
        {
            value: "viana_do_castelo",
            label: "Viana do Castelo"
        },
        {
            value: "braga",
            label: "Braga"
        },
        {
            value: "barcelos",
            label: "Barcelos"
        },
        {
            value: "camina",
            label: "Caminha"
        },
        {
            value: "vila_praia_ancora",
            label: "Vila Praia de Âncora"
        }
    ],
    // Vila Real
    vila_real: [
        {
            value: "vila_real",
            label: "Vila Real"
        },
        {
            value: "chaves",
            label: "Chaves"
        },
        {
            value: "peso_da_regua",
            label: "Peso da Régua"
        },
        {
            value: "santa_marta_penaguiao",
            label: "Santa Marta de Penaguião"
        },
        {
            value: "mesao_frio",
            label: "Mesão Frio"
        }
    ],
    // Viseu
    viseu: [
        {
            value: "viseu",
            label: "Viseu"
        },
        {
            value: "lamego",
            label: "Lamego"
        },
        {
            value: "mangualde",
            label: "Mangualde"
        },
        {
            value: "penalva_castelo",
            label: "Penalva do Castelo"
        },
        {
            value: "santa_comba_dao",
            label: "Santa Comba Dão"
        }
    ],
    // Açores
    acores: [
        {
            value: "ponta_delgada",
            label: "Ponta Delgada"
        },
        {
            value: "horta",
            label: "Horta"
        },
        {
            value: "angra_heroismo",
            label: "Angra do Heroísmo"
        },
        {
            value: "vila_franca_campo",
            label: "Vila Franca do Campo"
        },
        {
            value: "ribeira_grande",
            label: "Ribeira Grande"
        }
    ],
    // Madeira
    madeira: [
        {
            value: "funchal",
            label: "Funchal"
        },
        {
            value: "machico",
            label: "Machico"
        },
        {
            value: "calheta",
            label: "Calheta"
        },
        {
            value: "portimao_madeira",
            label: "Porto Moniz"
        },
        {
            value: "camara_lobos",
            label: "Câmara de Lobos"
        },
        {
            value: "santa_cruz_madeira",
            label: "Santa Cruz"
        },
        {
            value: "port_santo",
            label: "Porto Santo"
        }
    ]
};
function useLocations() {
    const [selectedCountry, setSelectedCountry] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("es");
    const [selectedProvince, setSelectedProvince] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [availableProvinces, setAvailableProvinces] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(SPAIN_PROVINCES);
    const [availableCities, setAvailableCities] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    // Actualizar provincias cuando cambia el país
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const provinces = PROVINCES_BY_COUNTRY[selectedCountry] || [];
        setAvailableProvinces(provinces);
        setSelectedProvince("");
        setAvailableCities([]);
    }, [
        selectedCountry
    ]);
    // Actualizar ciudades cuando cambia la provincia
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (selectedProvince) {
            const cities = CITIES_BY_PROVINCE[selectedProvince] || [];
            setAvailableCities(cities);
        } else {
            setAvailableCities([]);
        }
    }, [
        selectedProvince
    ]);
    // Manejar cambio de país
    const handleCountryChange = (country)=>{
        setSelectedCountry(country);
        return country;
    };
    // Manejar cambio de provincia
    const handleProvinceChange = (province)=>{
        setSelectedProvince(province);
        return province;
    };
    // Resetear ubicaciones
    const resetLocations = ()=>{
        setSelectedProvince("");
        setAvailableCities([]);
    };
    // Obtener país actual
    const getCurrentCountry = ()=>{
        return COUNTRIES.find((c)=>c.value === selectedCountry)?.label || "";
    };
    // Obtener provincia actual
    const getCurrentProvince = ()=>{
        const provinces = PROVINCES_BY_COUNTRY[selectedCountry] || [];
        return provinces.find((p)=>p.value === selectedProvince)?.label || "";
    };
    // Obtener ciudad actual
    const getCurrentCity = (cityValue)=>{
        if (!selectedProvince) return "";
        const cities = CITIES_BY_PROVINCE[selectedProvince] || [];
        return cities.find((c)=>c.value === cityValue)?.label || "";
    };
    return {
        // Datos
        COUNTRIES,
        availableProvinces,
        availableCities,
        // Estados
        selectedCountry,
        selectedProvince,
        // Funciones
        handleCountryChange,
        handleProvinceChange,
        resetLocations,
        getCurrentCountry,
        getCurrentProvince,
        getCurrentCity
    };
}
}),
"[project]/src/hooks/useNotifications.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useNotifications",
    ()=>useNotifications
]);
// src/hooks/useNotifications.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabaseClient.ts [app-ssr] (ecmascript)");
;
;
function useNotifications(userId) {
    const [notifications, setNotifications] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [unreadCount, setUnreadCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const loadNotifications = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (!userId) {
            setNotifications([]);
            setUnreadCount(0);
            setLoading(false);
            return;
        }
        try {
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('notifications').select('*').eq('user_id', userId).order('created_at', {
                ascending: false
            }).limit(20);
            if (error) throw error;
            // ✅ Mapear para añadir la propiedad `date` basada en `created_at`
            const notificationsWithDate = (data || []).map((n)=>({
                    ...n,
                    date: n.created_at // Convertir created_at → date
                }));
            setNotifications(notificationsWithDate);
            setUnreadCount(notificationsWithDate.filter((n)=>!n.is_read).length);
        } catch (error) {
            console.error('Error loading notifications:', error);
        } finally{
            setLoading(false);
        }
    }, [
        userId
    ]);
    const markAsRead = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (notificationId)=>{
        try {
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('notifications').update({
                is_read: true
            }).eq('id', notificationId);
            if (error) throw error;
            setNotifications((prev)=>prev.map((n)=>n.id === notificationId ? {
                        ...n,
                        is_read: true
                    } : n));
            setUnreadCount((prev)=>Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    }, []);
    const markAllAsRead = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (!userId) return;
        try {
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('notifications').update({
                is_read: true
            }).eq('user_id', userId).eq('is_read', false);
            if (error) throw error;
            setNotifications((prev)=>prev.map((n)=>({
                        ...n,
                        is_read: true
                    })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    }, [
        userId
    ]);
    const deleteNotification = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (notificationId)=>{
        try {
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('notifications').delete().eq('id', notificationId);
            if (error) throw error;
            setNotifications((prev)=>prev.filter((n)=>n.id !== notificationId));
            // Actualizar contador si la notificación eliminada estaba sin leer
            setUnreadCount((prev)=>Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        loadNotifications();
        if (!userId) return;
        const channel = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].channel(`notifications:${userId}`).on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${userId}`
        }, (payload)=>{
            console.log('Realtime event:', payload.eventType, payload);
            if (payload.eventType === 'INSERT') {
                // Nueva notificación
                const newNotification = {
                    ...payload.new,
                    date: payload.new.created_at // ✅ Añadir date
                };
                setNotifications((prev)=>[
                        newNotification,
                        ...prev
                    ]);
                if (!payload.new.is_read) {
                    setUnreadCount((prev)=>prev + 1);
                }
            } else if (payload.eventType === 'UPDATE') {
                // Notificación actualizada (marcada como leída/no leída)
                const oldNotification = notifications.find((n)=>n.id === payload.old.id);
                const newNotification = {
                    ...payload.new,
                    date: payload.new.created_at // ✅ Añadir date
                };
                setNotifications((prev)=>prev.map((n)=>n.id === newNotification.id ? {
                            ...n,
                            ...newNotification
                        } : n));
                // Actualizar contador si cambió el estado de lectura
                if (oldNotification && oldNotification.is_read !== newNotification.is_read) {
                    if (newNotification.is_read) {
                        setUnreadCount((prev)=>Math.max(0, prev - 1));
                    } else {
                        setUnreadCount((prev)=>prev + 1);
                    }
                }
            } else if (payload.eventType === 'DELETE') {
                // Notificación eliminada
                const deletedNotification = payload.old;
                setNotifications((prev)=>prev.filter((n)=>n.id !== deletedNotification.id));
                // Actualizar contador si la notificación eliminada estaba sin leer
                if (!deletedNotification.is_read) {
                    setUnreadCount((prev)=>Math.max(0, prev - 1));
                }
            }
        }).subscribe();
        return ()=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].removeChannel(channel);
        };
    }, [
        userId,
        loadNotifications,
        notifications
    ]);
    return {
        notifications,
        unreadCount,
        loading: loading,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        reload: loadNotifications
    };
}
}),
"[project]/src/app/profile/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Profile
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabaseClient.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useLocations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useLocations.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useNotifications$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useNotifications.ts [app-ssr] (ecmascript)");
// src/app/profile/page.tsx
"use client";
;
;
;
;
;
;
const HOTEL_TYPES = [
    {
        value: "adults_only",
        label: "Solo adultos"
    },
    {
        value: "family",
        label: "Familiar"
    },
    {
        value: "boutique",
        label: "Boutique"
    },
    {
        value: "luxury",
        label: "Lujo"
    },
    {
        value: "golf",
        label: "Golf"
    },
    {
        value: "sun_and_beach",
        label: "Sol y playa"
    },
    {
        value: "wellness",
        label: "Wellness/Spa"
    },
    {
        value: "urban",
        label: "Urbano"
    },
    {
        value: "budget",
        label: "Económico"
    },
    {
        value: "aparthotel",
        label: "Apartahotel"
    }
];
// Categorías hoteleras profesionales B2B
const STAR_CATEGORIES = [
    {
        value: 1,
        label: "1★ Económico"
    },
    {
        value: 2,
        label: "2★ Estándar"
    },
    {
        value: 3,
        label: "3★ Confort"
    },
    {
        value: 4,
        label: "4★ Superior"
    },
    {
        value: 5,
        label: "5★ Lujo"
    }
];
const NotificationsDropdown = ({ notifications, unreadCount, loading, markAsRead, markAllAsRead, deleteNotification })=>{
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleClickOutside = (event)=>{
            const target = event.target;
            if (!target.closest('.notifications-dropdown')) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return ()=>document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "notifications-dropdown relative",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>setIsOpen(!isOpen),
                className: "relative p-2 text-gray-600 hover:text-blue-600 transition-all hover:-translate-y-0.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        className: "w-6 h-6",
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "1.8",
                        viewBox: "0 0 24 24",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            d: "M14.857 17.657A2 2 0 0113 19H11a2 2 0 01-1.857-1.343M6 8a6 6 0 1112 0c0 3.5 1.5 5 2 5.5H4c.5-.5 2-2 2-5.5z"
                        }, void 0, false, {
                            fileName: "[project]/src/app/profile/page.tsx",
                            lineNumber: 101,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/app/profile/page.tsx",
                        lineNumber: 94,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    unreadCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-semibold w-5 h-5 rounded-full flex items-center justify-center shadow",
                        children: unreadCount
                    }, void 0, false, {
                        fileName: "[project]/src/app/profile/page.tsx",
                        lineNumber: 109,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/profile/page.tsx",
                lineNumber: 89,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute right-0 mt-3 w-96 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50 animate-fade-in-down",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "font-semibold text-gray-900",
                                children: "Notificaciones"
                            }, void 0, false, {
                                fileName: "[project]/src/app/profile/page.tsx",
                                lineNumber: 119,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            unreadCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: markAllAsRead,
                                className: "text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline",
                                children: "Marcar todo como leído"
                            }, void 0, false, {
                                fileName: "[project]/src/app/profile/page.tsx",
                                lineNumber: 122,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/profile/page.tsx",
                        lineNumber: 118,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-6 text-center text-gray-500 text-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-6 h-6 mx-auto mb-2 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"
                            }, void 0, false, {
                                fileName: "[project]/src/app/profile/page.tsx",
                                lineNumber: 134,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            "Cargando notificaciones..."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/profile/page.tsx",
                        lineNumber: 133,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    !loading && notifications.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-6 text-center text-gray-500 text-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-5xl mb-3 opacity-30",
                                children: "🔔"
                            }, void 0, false, {
                                fileName: "[project]/src/app/profile/page.tsx",
                                lineNumber: 142,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            "No hay notificaciones"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/profile/page.tsx",
                        lineNumber: 141,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    !loading && notifications.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "max-h-96 overflow-y-auto divide-y divide-gray-100",
                        children: notifications.map((n)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `flex items-start gap-3 px-4 py-4 transition-all cursor-pointer ${!n.read ? "bg-blue-50" : "hover:bg-gray-50"}`,
                                onClick: ()=>!n.read && markAsRead(n.id),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "pt-1",
                                        children: !n.read && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "block w-2 h-2 bg-blue-600 rounded-full animate-pulse"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/profile/page.tsx",
                                            lineNumber: 161,
                                            columnNumber: 23
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/profile/page.tsx",
                                        lineNumber: 159,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm font-semibold text-gray-900",
                                                children: n.title
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/profile/page.tsx",
                                                lineNumber: 167,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-gray-600 mt-1",
                                                children: n.message
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/profile/page.tsx",
                                                lineNumber: 170,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[11px] text-gray-400 mt-1",
                                                children: n.date
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/profile/page.tsx",
                                                lineNumber: 171,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/profile/page.tsx",
                                        lineNumber: 166,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-start",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: (e)=>{
                                                e.stopPropagation();
                                                deleteNotification(n.id);
                                            },
                                            className: "text-gray-400 hover:text-red-600 hover:scale-110 transition-transform",
                                            title: "Eliminar",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                className: "w-4 h-4",
                                                fill: "none",
                                                stroke: "currentColor",
                                                strokeWidth: "2",
                                                viewBox: "0 0 24 24",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    d: "M6 18L18 6M6 6l12 12"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/profile/page.tsx",
                                                    lineNumber: 192,
                                                    columnNumber: 25
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/profile/page.tsx",
                                                lineNumber: 185,
                                                columnNumber: 23
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/profile/page.tsx",
                                            lineNumber: 176,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/profile/page.tsx",
                                        lineNumber: 175,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, n.id, true, {
                                fileName: "[project]/src/app/profile/page.tsx",
                                lineNumber: 151,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)))
                    }, void 0, false, {
                        fileName: "[project]/src/app/profile/page.tsx",
                        lineNumber: 149,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/profile/page.tsx",
                lineNumber: 116,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/profile/page.tsx",
        lineNumber: 87,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
function Profile() {
    const [org, setOrg] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isEditing, setIsEditing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [success, setSuccess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [userId, setUserId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // Hook de notificaciones
    const { notifications, unreadCount, loading: notificationsLoading, markAsRead, markAllAsRead, deleteNotification } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useNotifications$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useNotifications"])(userId);
    // Hook personalizado para ubicaciones
    const { selectedCountry, selectedProvince, availableProvinces, availableCities, handleCountryChange, handleProvinceChange, getCurrentCountry, getCurrentProvince, getCurrentCity } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useLocations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLocations"])();
    // Estados para foto de perfil
    const [profileImageFile, setProfileImageFile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [profileImagePreview, setProfileImagePreview] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // Estados para tipos de hotel (ahora solo un valor único)
    const [selectedHotelType, setSelectedHotelType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const loadProfile = async ()=>{
            try {
                const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
                if (!data?.session) {
                    window.location.href = "/login";
                    return;
                }
                const userId = data.session.user.id;
                setUserId(userId);
                const { data: orgData } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("organizations").select("*").eq("created_by", userId).maybeSingle();
                if (!orgData) {
                    window.location.href = "/setup-organization";
                    return;
                }
                setOrg(orgData);
                setFormData(orgData);
                // Inicializar ubicaciones con los datos del perfil
                if (orgData.country) {
                    handleCountryChange(orgData.country);
                }
                if (orgData.province) {
                    handleProvinceChange(orgData.province);
                }
                // ✅ CORRECCIÓN: Solo un valor único para hotel_type
                if (orgData.hotel_type) {
                    setSelectedHotelType(orgData.hotel_type);
                }
                setLoading(false);
            } catch (err) {
                console.error("Error loading profile:", err);
                window.location.href = "/login";
            }
        };
        loadProfile();
    }, []);
    // Función para subir imagen de perfil
    const uploadProfileImage = async ()=>{
        if (!profileImageFile || !org) return;
        try {
            const fileName = `${org.id}_profile_${Date.now()}`;
            const { error: uploadError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].storage.from('profile-images').upload(fileName, profileImageFile);
            if (uploadError) throw uploadError;
            const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].storage.from('profile-images').getPublicUrl(fileName);
            // Actualizar en la base de datos
            const { error: updateError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('organizations').update({
                profile_image: data.publicUrl
            }).eq('id', org.id);
            if (updateError) throw updateError;
            // Actualizar estado local
            setOrg((prev)=>prev ? {
                    ...prev,
                    profile_image: data.publicUrl
                } : null);
            setProfileImagePreview(null);
            setProfileImageFile(null);
            return data.publicUrl;
        } catch (error) {
            console.error('Error uploading profile image:', error);
            setError('Error al subir la imagen de perfil');
            return null;
        }
    };
    const handleInputChange = (e)=>{
        const { name, value } = e.target;
        setFormData((prev)=>({
                ...prev,
                [name]: value === "" ? null : value
            }));
    };
    const handleHotelTypeChange = (value)=>{
        setSelectedHotelType((prev)=>prev === value ? null : value);
    };
    const handleSave = async ()=>{
        if (!org) return;
        setSaving(true);
        setError("");
        setSuccess("");
        try {
            // Subir imagen primero si hay
            let newProfileImage = org.profile_image;
            if (profileImageFile) {
                newProfileImage = await uploadProfileImage() || org.profile_image;
            }
            // Construir objeto de actualización
            const updateData = {
                name: formData.name,
                address: formData.address,
                phone: formData.phone,
                country: formData.country,
                province: formData.province,
                city: formData.city,
                website: formData.website,
                profile_image: newProfileImage
            };
            // ✅ CORRECCIÓN: Solo guardar un valor único para hotel_type
            if (org.role === "hotel") {
                updateData.stars = formData.stars ? parseInt(formData.stars) : null;
                updateData.hotel_type = selectedHotelType; // Solo un valor
            }
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("organizations").update(updateData).eq("id", org.id);
            if (error) throw error;
            setOrg((prev)=>prev ? {
                    ...prev,
                    ...formData,
                    profile_image: newProfileImage
                } : null);
            setIsEditing(false);
            setSuccess("Perfil actualizado correctamente");
            setTimeout(()=>setSuccess(""), 3000);
        } catch (err) {
            // ✅ MANEJO ROBUSTO DE ERRORES
            let errorMessage = "Error desconocido";
            if (err instanceof Error) {
                errorMessage = err.message;
            } else if (typeof err === 'object' && err !== null) {
                errorMessage = err.message || err.error_description || err.details || JSON.stringify(err);
            } else if (typeof err === 'string') {
                errorMessage = err;
            }
            console.error("Error saving profile:", err);
            setError(`Error al guardar los cambios: ${errorMessage}`);
        } finally{
            setSaving(false);
        }
    };
    const handleCancel = ()=>{
        if (org) {
            setFormData(org);
            setIsEditing(false);
            setProfileImageFile(null);
            setProfileImagePreview(null);
            // Restaurar ubicaciones originales
            if (org.country) {
                handleCountryChange(org.country);
            }
            if (org.province) {
                handleProvinceChange(org.province);
            }
            // ✅ CORRECCIÓN: Restaurar un solo valor
            if (org.hotel_type) {
                setSelectedHotelType(org.hotel_type);
            } else {
                setSelectedHotelType(null);
            }
        }
    };
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex justify-center items-center bg-gray-50",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-8 bg-white rounded-xl shadow-sm text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-8 h-8 mx-auto mb-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"
                    }, void 0, false, {
                        fileName: "[project]/src/app/profile/page.tsx",
                        lineNumber: 441,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-600 text-base",
                        children: "Cargando perfil..."
                    }, void 0, false, {
                        fileName: "[project]/src/app/profile/page.tsx",
                        lineNumber: 442,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/profile/page.tsx",
                lineNumber: 440,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/profile/page.tsx",
            lineNumber: 439,
            columnNumber: 7
        }, this);
    }
    if (!org) return null;
    // ✅ CORRECCIÓN: Eliminar espacios extra en URLs de avatar
    const profileImage = profileImagePreview ? profileImagePreview : org.profile_image ? org.profile_image : org.role === "hotel" ? `https://ui-avatars.com/api/?name=${encodeURIComponent(org.name)}&background=3b82f6&color=white` : `https://ui-avatars.com/api/?name=${encodeURIComponent(org.name)}&background=10b981&color=white`;
    // Obtener etiqueta de categoría profesional
    const getStarCategoryLabel = (stars)=>{
        if (!stars) return "No especificado";
        const category = STAR_CATEGORIES.find((c)=>c.value === stars);
        return category ? category.label : `${stars}★`;
    };
    // ✅ CORRECCIÓN: Procesar un solo valor
    const getHotelTypeLabel = (hotelType)=>{
        if (!hotelType) return "No especificado";
        return HOTEL_TYPES.find((t)=>t.value === hotelType)?.label || hotelType;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "jsx-bc8c81cc93ef4b4a" + " " + "min-h-screen bg-gray-50 font-sans",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                className: "jsx-bc8c81cc93ef4b4a" + " " + "w-72 bg-gradient-to-b from-blue-800 to-blue-900 text-white p-6 fixed left-0 top-0 h-screen flex flex-col",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-bc8c81cc93ef4b4a" + " " + "flex items-center mb-8 pb-3 border-b border-white/10",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "jsx-bc8c81cc93ef4b4a" + " " + "text-xl font-bold tracking-tight",
                            children: "Hotel Media Bank"
                        }, void 0, false, {
                            fileName: "[project]/src/app/profile/page.tsx",
                            lineNumber: 478,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/profile/page.tsx",
                        lineNumber: 477,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        className: "jsx-bc8c81cc93ef4b4a" + " " + "flex-1 flex flex-col gap-2 mb-8",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            onClick: ()=>window.location.href = "/dashboard",
                            className: "jsx-bc8c81cc93ef4b4a" + " " + "px-4 py-3.5 rounded-lg cursor-pointer font-medium text-sm transition-all text-white/80 hover:bg-white/10",
                            children: "← Volver al Dashboard"
                        }, void 0, false, {
                            fileName: "[project]/src/app/profile/page.tsx",
                            lineNumber: 483,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/profile/page.tsx",
                        lineNumber: 482,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/profile/page.tsx",
                lineNumber: 475,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "jsx-bc8c81cc93ef4b4a" + " " + "ml-72 p-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-bc8c81cc93ef4b4a" + " " + "fixed top-0 left-72 right-0 h-16 bg-white shadow-sm flex items-center justify-between px-6 z-40",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-bc8c81cc93ef4b4a" + " " + "flex items-center gap-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "jsx-bc8c81cc93ef4b4a" + " " + "text-sm text-gray-500 uppercase font-semibold",
                                    children: "Mi Perfil"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/profile/page.tsx",
                                    lineNumber: 497,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/profile/page.tsx",
                                lineNumber: 496,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-bc8c81cc93ef4b4a" + " " + "flex items-center gap-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(NotificationsDropdown, {
                                    notifications: notifications,
                                    unreadCount: unreadCount,
                                    loading: notificationsLoading,
                                    markAsRead: markAsRead,
                                    markAllAsRead: markAllAsRead,
                                    deleteNotification: deleteNotification
                                }, void 0, false, {
                                    fileName: "[project]/src/app/profile/page.tsx",
                                    lineNumber: 504,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/profile/page.tsx",
                                lineNumber: 502,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/profile/page.tsx",
                        lineNumber: 495,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-bc8c81cc93ef4b4a" + " " + "pt-24 max-w-3xl mx-auto",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-bc8c81cc93ef4b4a" + " " + "mb-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "jsx-bc8c81cc93ef4b4a" + " " + "text-2xl font-bold text-gray-900 mb-1",
                                        children: "Mi Perfil"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/profile/page.tsx",
                                        lineNumber: 519,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "jsx-bc8c81cc93ef4b4a" + " " + "text-gray-600 text-sm",
                                        children: "Gestiona la información de tu organización"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/profile/page.tsx",
                                        lineNumber: 522,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/profile/page.tsx",
                                lineNumber: 518,
                                columnNumber: 11
                            }, this),
                            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-bc8c81cc93ef4b4a" + " " + "mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-bc8c81cc93ef4b4a" + " " + "flex items-start",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-bc8c81cc93ef4b4a" + " " + "flex-shrink-0",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                fill: "currentColor",
                                                viewBox: "0 0 20 20",
                                                className: "jsx-bc8c81cc93ef4b4a" + " " + "h-5 w-5 text-red-500",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    fillRule: "evenodd",
                                                    d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z",
                                                    clipRule: "evenodd",
                                                    className: "jsx-bc8c81cc93ef4b4a"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/profile/page.tsx",
                                                    lineNumber: 533,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/profile/page.tsx",
                                                lineNumber: 532,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/profile/page.tsx",
                                            lineNumber: 531,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-bc8c81cc93ef4b4a" + " " + "ml-3",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "jsx-bc8c81cc93ef4b4a" + " " + "text-sm font-medium text-red-800",
                                                children: error
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/profile/page.tsx",
                                                lineNumber: 537,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/profile/page.tsx",
                                            lineNumber: 536,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/profile/page.tsx",
                                    lineNumber: 530,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/profile/page.tsx",
                                lineNumber: 529,
                                columnNumber: 13
                            }, this),
                            success && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-bc8c81cc93ef4b4a" + " " + "mb-4 bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg animate-fade-in",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-bc8c81cc93ef4b4a" + " " + "flex items-start",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-bc8c81cc93ef4b4a" + " " + "flex-shrink-0",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                fill: "currentColor",
                                                viewBox: "0 0 20 20",
                                                className: "jsx-bc8c81cc93ef4b4a" + " " + "h-5 w-5 text-green-500",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    fillRule: "evenodd",
                                                    d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
                                                    clipRule: "evenodd",
                                                    className: "jsx-bc8c81cc93ef4b4a"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/profile/page.tsx",
                                                    lineNumber: 548,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/profile/page.tsx",
                                                lineNumber: 547,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/profile/page.tsx",
                                            lineNumber: 546,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-bc8c81cc93ef4b4a" + " " + "ml-3",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "jsx-bc8c81cc93ef4b4a" + " " + "text-sm font-medium text-green-800",
                                                children: success
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/profile/page.tsx",
                                                lineNumber: 552,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/profile/page.tsx",
                                            lineNumber: 551,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/profile/page.tsx",
                                    lineNumber: 545,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/profile/page.tsx",
                                lineNumber: 544,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-bc8c81cc93ef4b4a" + " " + "bg-white rounded-xl shadow-sm overflow-hidden",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-bc8c81cc93ef4b4a" + " " + "p-6 border-b border-gray-200",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-bc8c81cc93ef4b4a" + " " + "flex items-center justify-between mb-6",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-bc8c81cc93ef4b4a" + " " + "flex items-center gap-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-bc8c81cc93ef4b4a" + " " + "relative",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-bc8c81cc93ef4b4a" + " " + "w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                        src: profileImage,
                                                                        alt: org.name,
                                                                        className: "jsx-bc8c81cc93ef4b4a" + " " + "w-full h-full object-cover"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/profile/page.tsx",
                                                                        lineNumber: 565,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/profile/page.tsx",
                                                                    lineNumber: 564,
                                                                    columnNumber: 21
                                                                }, this),
                                                                isEditing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "jsx-bc8c81cc93ef4b4a" + " " + "absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 cursor-pointer hover:bg-blue-600 transition-colors shadow-md",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                            fill: "none",
                                                                            stroke: "currentColor",
                                                                            viewBox: "0 0 24 24",
                                                                            className: "jsx-bc8c81cc93ef4b4a" + " " + "w-5 h-5",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                strokeLinecap: "round",
                                                                                strokeLinejoin: "round",
                                                                                strokeWidth: 2,
                                                                                d: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z",
                                                                                className: "jsx-bc8c81cc93ef4b4a"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/profile/page.tsx",
                                                                                lineNumber: 574,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                                            lineNumber: 573,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "file",
                                                                            accept: "image/*",
                                                                            onChange: (e)=>{
                                                                                const file = e.target.files?.[0];
                                                                                if (file) {
                                                                                    setProfileImageFile(file);
                                                                                    setProfileImagePreview(URL.createObjectURL(file));
                                                                                }
                                                                            },
                                                                            className: "jsx-bc8c81cc93ef4b4a" + " " + "hidden"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                                            lineNumber: 576,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/profile/page.tsx",
                                                                    lineNumber: 572,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 563,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-bc8c81cc93ef4b4a",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                                    className: "jsx-bc8c81cc93ef4b4a" + " " + "text-2xl font-bold text-gray-900",
                                                                    children: org.name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/profile/page.tsx",
                                                                    lineNumber: 592,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "jsx-bc8c81cc93ef4b4a" + " " + "text-gray-600 mt-1 flex items-center gap-2",
                                                                    children: org.role === "hotel" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "jsx-bc8c81cc93ef4b4a",
                                                                            children: "Hotel"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                                            lineNumber: 598,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    }, void 0, false) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "jsx-bc8c81cc93ef4b4a" + " " + "text-green-500",
                                                                                children: "💼"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/profile/page.tsx",
                                                                                lineNumber: 602,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "jsx-bc8c81cc93ef4b4a",
                                                                                children: "Agencia de viajes"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/profile/page.tsx",
                                                                                lineNumber: 603,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/profile/page.tsx",
                                                                    lineNumber: 595,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 591,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/profile/page.tsx",
                                                    lineNumber: 562,
                                                    columnNumber: 17
                                                }, this),
                                                !isEditing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setIsEditing(true),
                                                    title: "Editar perfil",
                                                    className: "jsx-bc8c81cc93ef4b4a" + " " + "p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        fill: "none",
                                                        stroke: "currentColor",
                                                        viewBox: "0 0 24 24",
                                                        className: "jsx-bc8c81cc93ef4b4a" + " " + "w-5 h-5",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            strokeLinecap: "round",
                                                            strokeLinejoin: "round",
                                                            strokeWidth: 2,
                                                            d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
                                                            className: "jsx-bc8c81cc93ef4b4a"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 616,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/profile/page.tsx",
                                                        lineNumber: 615,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/profile/page.tsx",
                                                    lineNumber: 610,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/profile/page.tsx",
                                            lineNumber: 561,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-bc8c81cc93ef4b4a" + " " + "space-y-6",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-bc8c81cc93ef4b4a",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "jsx-bc8c81cc93ef4b4a" + " " + "block text-sm font-semibold text-gray-700 mb-2",
                                                            children: "Nombre de la organización"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 625,
                                                            columnNumber: 19
                                                        }, this),
                                                        isEditing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            name: "name",
                                                            value: formData.name || "",
                                                            onChange: handleInputChange,
                                                            placeholder: "Nombre de tu organización",
                                                            className: "jsx-bc8c81cc93ef4b4a" + " " + "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 629,
                                                            columnNumber: 21
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "jsx-bc8c81cc93ef4b4a" + " " + "text-lg text-gray-900 font-medium",
                                                            children: org.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 638,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/profile/page.tsx",
                                                    lineNumber: 624,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-bc8c81cc93ef4b4a",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "jsx-bc8c81cc93ef4b4a" + " " + "block text-sm font-semibold text-gray-700 mb-2",
                                                            children: "Dirección"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 644,
                                                            columnNumber: 19
                                                        }, this),
                                                        isEditing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            name: "address",
                                                            value: formData.address || "",
                                                            onChange: handleInputChange,
                                                            placeholder: "Dirección completa",
                                                            className: "jsx-bc8c81cc93ef4b4a" + " " + "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 648,
                                                            columnNumber: 21
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "jsx-bc8c81cc93ef4b4a" + " " + "text-gray-900",
                                                            children: org.address
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 657,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/profile/page.tsx",
                                                    lineNumber: 643,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-bc8c81cc93ef4b4a" + " " + "grid grid-cols-1 md:grid-cols-3 gap-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-bc8c81cc93ef4b4a",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "jsx-bc8c81cc93ef4b4a" + " " + "block text-sm font-semibold text-gray-700 mb-2",
                                                                    children: "País"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/profile/page.tsx",
                                                                    lineNumber: 664,
                                                                    columnNumber: 21
                                                                }, this),
                                                                isEditing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                    name: "country",
                                                                    value: selectedCountry,
                                                                    onChange: (e)=>{
                                                                        const country = handleCountryChange(e.target.value);
                                                                        setFormData((prev)=>({
                                                                                ...prev,
                                                                                country,
                                                                                province: "",
                                                                                city: ""
                                                                            }));
                                                                    },
                                                                    className: "jsx-bc8c81cc93ef4b4a" + " " + "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: "",
                                                                            className: "jsx-bc8c81cc93ef4b4a",
                                                                            children: "Seleccionar país..."
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                                            lineNumber: 677,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useLocations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COUNTRIES"].map((country)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                value: country.value,
                                                                                className: "jsx-bc8c81cc93ef4b4a",
                                                                                children: country.label
                                                                            }, country.value, false, {
                                                                                fileName: "[project]/src/app/profile/page.tsx",
                                                                                lineNumber: 679,
                                                                                columnNumber: 27
                                                                            }, this))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/profile/page.tsx",
                                                                    lineNumber: 668,
                                                                    columnNumber: 23
                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "jsx-bc8c81cc93ef4b4a" + " " + "text-gray-900",
                                                                    children: getCurrentCountry()
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/profile/page.tsx",
                                                                    lineNumber: 685,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 663,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-bc8c81cc93ef4b4a",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "jsx-bc8c81cc93ef4b4a" + " " + "block text-sm font-semibold text-gray-700 mb-2",
                                                                    children: "Provincia/Distrito"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/profile/page.tsx",
                                                                    lineNumber: 690,
                                                                    columnNumber: 21
                                                                }, this),
                                                                isEditing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                    name: "province",
                                                                    value: selectedProvince,
                                                                    onChange: (e)=>{
                                                                        const province = handleProvinceChange(e.target.value);
                                                                        setFormData((prev)=>({
                                                                                ...prev,
                                                                                province,
                                                                                city: ""
                                                                            }));
                                                                    },
                                                                    disabled: !selectedCountry,
                                                                    className: "jsx-bc8c81cc93ef4b4a" + " " + `w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 ${!selectedCountry ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`,
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: "",
                                                                            className: "jsx-bc8c81cc93ef4b4a",
                                                                            children: "Seleccionar provincia..."
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                                            lineNumber: 706,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        availableProvinces.map((province)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                value: province.value,
                                                                                className: "jsx-bc8c81cc93ef4b4a",
                                                                                children: province.label
                                                                            }, province.value, false, {
                                                                                fileName: "[project]/src/app/profile/page.tsx",
                                                                                lineNumber: 708,
                                                                                columnNumber: 27
                                                                            }, this))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/profile/page.tsx",
                                                                    lineNumber: 694,
                                                                    columnNumber: 23
                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "jsx-bc8c81cc93ef4b4a" + " " + "text-gray-900",
                                                                    children: getCurrentProvince()
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/profile/page.tsx",
                                                                    lineNumber: 714,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 689,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-bc8c81cc93ef4b4a",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "jsx-bc8c81cc93ef4b4a" + " " + "block text-sm font-semibold text-gray-700 mb-2",
                                                                    children: "Ciudad"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/profile/page.tsx",
                                                                    lineNumber: 719,
                                                                    columnNumber: 21
                                                                }, this),
                                                                isEditing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                    name: "city",
                                                                    value: formData.city || "",
                                                                    onChange: handleInputChange,
                                                                    disabled: !selectedProvince,
                                                                    className: "jsx-bc8c81cc93ef4b4a" + " " + `w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 ${!selectedProvince ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`,
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: "",
                                                                            className: "jsx-bc8c81cc93ef4b4a",
                                                                            children: "Seleccionar ciudad..."
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                                            lineNumber: 732,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        availableCities.map((city)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                value: city.value,
                                                                                className: "jsx-bc8c81cc93ef4b4a",
                                                                                children: city.label
                                                                            }, city.value, false, {
                                                                                fileName: "[project]/src/app/profile/page.tsx",
                                                                                lineNumber: 734,
                                                                                columnNumber: 27
                                                                            }, this))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/profile/page.tsx",
                                                                    lineNumber: 723,
                                                                    columnNumber: 23
                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "jsx-bc8c81cc93ef4b4a" + " " + "text-gray-900",
                                                                    children: getCurrentCity(org.city)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/profile/page.tsx",
                                                                    lineNumber: 740,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 718,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/profile/page.tsx",
                                                    lineNumber: 662,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-bc8c81cc93ef4b4a",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "jsx-bc8c81cc93ef4b4a" + " " + "block text-sm font-semibold text-gray-700 mb-2",
                                                            children: "Teléfono de contacto"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 747,
                                                            columnNumber: 19
                                                        }, this),
                                                        isEditing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "tel",
                                                            name: "phone",
                                                            value: formData.phone || "",
                                                            onChange: handleInputChange,
                                                            placeholder: "+34 123 456 789",
                                                            className: "jsx-bc8c81cc93ef4b4a" + " " + "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 751,
                                                            columnNumber: 21
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "jsx-bc8c81cc93ef4b4a" + " " + "text-gray-900",
                                                            children: org.phone
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 760,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/profile/page.tsx",
                                                    lineNumber: 746,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-bc8c81cc93ef4b4a",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "jsx-bc8c81cc93ef4b4a" + " " + "block text-sm font-semibold text-gray-700 mb-2",
                                                            children: "Sitio web"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 766,
                                                            columnNumber: 19
                                                        }, this),
                                                        isEditing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "url",
                                                            name: "website",
                                                            value: formData.website || "",
                                                            onChange: handleInputChange,
                                                            placeholder: "https://tuweb.com  ",
                                                            className: "jsx-bc8c81cc93ef4b4a" + " " + "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 770,
                                                            columnNumber: 21
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "jsx-bc8c81cc93ef4b4a" + " " + "text-gray-900",
                                                            children: org.website ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                href: org.website.startsWith('http') ? org.website : `https://${org.website}`,
                                                                target: "_blank",
                                                                rel: "noopener noreferrer",
                                                                className: "jsx-bc8c81cc93ef4b4a" + " " + "text-blue-600 hover:text-blue-700 underline",
                                                                children: org.website
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/profile/page.tsx",
                                                                lineNumber: 781,
                                                                columnNumber: 25
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-bc8c81cc93ef4b4a" + " " + "text-gray-400",
                                                                children: "No especificado"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/profile/page.tsx",
                                                                lineNumber: 790,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 779,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/profile/page.tsx",
                                                    lineNumber: 765,
                                                    columnNumber: 17
                                                }, this),
                                                org.role === "hotel" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-bc8c81cc93ef4b4a" + " " + "border-t border-gray-200 pt-6",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: "jsx-bc8c81cc93ef4b4a" + " " + "text-lg font-bold text-gray-900 mb-4",
                                                                children: "Información del Hotel"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/profile/page.tsx",
                                                                lineNumber: 800,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-bc8c81cc93ef4b4a" + " " + "grid grid-cols-1 md:grid-cols-2 gap-4",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-bc8c81cc93ef4b4a",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                            className: "jsx-bc8c81cc93ef4b4a" + " " + "block text-sm font-semibold text-gray-700 mb-2",
                                                                            children: "Categoría hotelera"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                                            lineNumber: 806,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        isEditing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                            name: "stars",
                                                                            value: formData.stars || "",
                                                                            onChange: handleInputChange,
                                                                            className: "jsx-bc8c81cc93ef4b4a" + " " + "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 bg-white",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                    value: "",
                                                                                    className: "jsx-bc8c81cc93ef4b4a",
                                                                                    children: "Seleccionar categoría..."
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/profile/page.tsx",
                                                                                    lineNumber: 816,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                STAR_CATEGORIES.map((category)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                        value: category.value,
                                                                                        className: "jsx-bc8c81cc93ef4b4a",
                                                                                        children: category.label
                                                                                    }, category.value, false, {
                                                                                        fileName: "[project]/src/app/profile/page.tsx",
                                                                                        lineNumber: 818,
                                                                                        columnNumber: 33
                                                                                    }, this))
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                                            lineNumber: 810,
                                                                            columnNumber: 29
                                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "jsx-bc8c81cc93ef4b4a" + " " + "text-gray-900",
                                                                            children: getStarCategoryLabel(org.stars)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                                            lineNumber: 824,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/profile/page.tsx",
                                                                    lineNumber: 805,
                                                                    columnNumber: 25
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/profile/page.tsx",
                                                                lineNumber: 804,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-bc8c81cc93ef4b4a" + " " + "mt-4",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "jsx-bc8c81cc93ef4b4a" + " " + "block text-sm font-semibold text-gray-700 mb-2",
                                                                        children: "Tipo de establecimiento"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/profile/page.tsx",
                                                                        lineNumber: 833,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    isEditing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-bc8c81cc93ef4b4a" + " " + "flex flex-wrap gap-2",
                                                                        children: HOTEL_TYPES.map((type)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                type: "button",
                                                                                onClick: ()=>handleHotelTypeChange(type.value),
                                                                                className: "jsx-bc8c81cc93ef4b4a" + " " + `px-2.5 py-1 rounded border-2 text-xs font-medium transition-all ${selectedHotelType === type.value ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"}`,
                                                                                children: type.label
                                                                            }, type.value, false, {
                                                                                fileName: "[project]/src/app/profile/page.tsx",
                                                                                lineNumber: 839,
                                                                                columnNumber: 31
                                                                            }, this))
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/profile/page.tsx",
                                                                        lineNumber: 837,
                                                                        columnNumber: 27
                                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "jsx-bc8c81cc93ef4b4a" + " " + "text-gray-900",
                                                                        children: getHotelTypeLabel(org.hotel_type)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/profile/page.tsx",
                                                                        lineNumber: 854,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/profile/page.tsx",
                                                                lineNumber: 832,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/profile/page.tsx",
                                                        lineNumber: 799,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false),
                                                isEditing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-bc8c81cc93ef4b4a" + " " + "pt-6 border-t border-gray-200 flex gap-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: handleSave,
                                                            disabled: saving,
                                                            className: "jsx-bc8c81cc93ef4b4a" + " " + `px-6 py-3 rounded-lg font-semibold text-sm transition-all flex items-center justify-center ${saving ? "bg-gray-400 text-gray-600 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600 hover:shadow-md"}`,
                                                            children: saving ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                        xmlns: "http://www.w3.org/2000/svg",
                                                                        fill: "none",
                                                                        viewBox: "0 0 24 24",
                                                                        className: "jsx-bc8c81cc93ef4b4a" + " " + "animate-spin -ml-1 mr-2 h-4 w-4 text-white",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                                                cx: "12",
                                                                                cy: "12",
                                                                                r: "10",
                                                                                stroke: "currentColor",
                                                                                strokeWidth: "4",
                                                                                className: "jsx-bc8c81cc93ef4b4a" + " " + "opacity-25"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/profile/page.tsx",
                                                                                lineNumber: 878,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                fill: "currentColor",
                                                                                d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z",
                                                                                className: "jsx-bc8c81cc93ef4b4a" + " " + "opacity-75"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/profile/page.tsx",
                                                                                lineNumber: 879,
                                                                                columnNumber: 29
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/profile/page.tsx",
                                                                        lineNumber: 877,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    "Guardando..."
                                                                ]
                                                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                        fill: "none",
                                                                        stroke: "currentColor",
                                                                        viewBox: "0 0 24 24",
                                                                        className: "jsx-bc8c81cc93ef4b4a" + " " + "w-4 h-4 mr-2",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                            strokeLinecap: "round",
                                                                            strokeLinejoin: "round",
                                                                            strokeWidth: 2,
                                                                            d: "M5 13l4 4L19 7",
                                                                            className: "jsx-bc8c81cc93ef4b4a"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                                            lineNumber: 886,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/profile/page.tsx",
                                                                        lineNumber: 885,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    "Guardar cambios"
                                                                ]
                                                            }, void 0, true)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 866,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: handleCancel,
                                                            className: "jsx-bc8c81cc93ef4b4a" + " " + "px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-300 transition-colors",
                                                            children: "Cancelar"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/page.tsx",
                                                            lineNumber: 892,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/profile/page.tsx",
                                                    lineNumber: 865,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/profile/page.tsx",
                                            lineNumber: 622,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/profile/page.tsx",
                                    lineNumber: 560,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/profile/page.tsx",
                                lineNumber: 559,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/profile/page.tsx",
                        lineNumber: 516,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/profile/page.tsx",
                lineNumber: 493,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                id: "bc8c81cc93ef4b4a",
                children: "@keyframes fade-in-down{0%{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}.animate-fade-in-down{animation:.2s ease-out fade-in-down}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/profile/page.tsx",
        lineNumber: 473,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0019d379._.js.map