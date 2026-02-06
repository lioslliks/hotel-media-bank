// src/hooks/useLocations.ts
import { useState, useEffect } from "react";

// ========================================
// DATOS: España y Portugal
// ========================================

export const COUNTRIES = [
  { value: "es", label: "España" },
  { value: "pt", label: "Portugal" }
];

// Provincias de España
const SPAIN_PROVINCES = [
  { value: "a_coruna", label: "A Coruña" },
  { value: "alava", label: "Álava" },
  { value: "albacete", label: "Albacete" },
  { value: "alicante", label: "Alicante" },
  { value: "almeria", label: "Almería" },
  { value: "asturias", label: "Asturias" },
  { value: "avila", label: "Ávila" },
  { value: "badajoz", label: "Badajoz" },
  { value: "barcelona", label: "Barcelona" },
  { value: "bizkaia", label: "Bizkaia" },
  { value: "burgos", label: "Burgos" },
  { value: "caceres", label: "Cáceres" },
  { value: "cadiz", label: "Cádiz" },
  { value: "cantabria", label: "Cantabria" },
  { value: "castellon", label: "Castellón" },
  { value: "ceuta", label: "Ceuta" },
  { value: "ciudad_real", label: "Ciudad Real" },
  { value: "cordoba", label: "Córdoba" },
  { value: "cuenca", label: "Cuenca" },
  { value: "girona", label: "Girona" },
  { value: "granada", label: "Granada" },
  { value: "guadalajara", label: "Guadalajara" },
  { value: "gipuzkoa", label: "Gipuzkoa" },
  { value: "huelva", label: "Huelva" },
  { value: "huesca", label: "Huesca" },
  { value: "illes_balears", label: "Illes Balears" },
  { value: "jaen", label: "Jaén" },
  { value: "la_rioja", label: "La Rioja" },
  { value: "las_palmas", label: "Las Palmas" },
  { value: "leon", label: "León" },
  { value: "lleida", label: "Lleida" },
  { value: "lugo", label: "Lugo" },
  { value: "madrid", label: "Madrid" },
  { value: "malaga", label: "Málaga" },
  { value: "melilla", label: "Melilla" },
  { value: "murcia", label: "Murcia" },
  { value: "navarra", label: "Navarra" },
  { value: "ourense", label: "Ourense" },
  { value: "palencia", label: "Palencia" },
  { value: "pontevedra", label: "Pontevedra" },
  { value: "salamanca", label: "Salamanca" },
  { value: "segovia", label: "Segovia" },
  { value: "sevilla", label: "Sevilla" },
  { value: "soria", label: "Soria" },
  { value: "tarragona", label: "Tarragona" },
  { value: "teruel", label: "Teruel" },
  { value: "toledo", label: "Toledo" },
  { value: "valencia", label: "Valencia" },
  { value: "valladolid", label: "Valladolid" },
  { value: "zamora", label: "Zamora" },
  { value: "zaragoza", label: "Zaragoza" }
];

// Distritos de Portugal (equivalentes a provincias)
const PORTUGAL_DISTRICTS = [
  { value: "aveiro", label: "Aveiro" },
  { value: "beja", label: "Beja" },
  { value: "braga", label: "Braga" },
  { value: "braganca", label: "Bragança" },
  { value: "castelo_branco", label: "Castelo Branco" },
  { value: "coimbra", label: "Coimbra" },
  { value: "evora", label: "Évora" },
  { value: "faro", label: "Faro" },
  { value: "guarda", label: "Guarda" },
  { value: "leiria", label: "Leiria" },
  { value: "lisboa", label: "Lisboa" },
  { value: "portalegre", label: "Portalegre" },
  { value: "porto", label: "Porto" },
  { value: "santarem", label: "Santarém" },
  { value: "setubal", label: "Setúbal" },
  { value: "viana_do_castelo", label: "Viana do Castelo" },
  { value: "vila_real", label: "Vila Real" },
  { value: "viseu", label: "Viseu" },
  { value: "acores", label: "Açores (Región Autónoma)" },
  { value: "madeira", label: "Madeira (Región Autónoma)" }
];

// Exportar todas las provincias/distritos combinadas
export const PROVINCES_BY_COUNTRY = {
  es: SPAIN_PROVINCES,
  pt: PORTUGAL_DISTRICTS
};

export const CITIES_BY_PROVINCE = {
  // ========================================
  // ESPAÑA
  // ========================================
  
  // A Coruña
  a_coruna: [
    { value: "a_coruna", label: "A Coruña" },
    { value: "santiago_de_compostela", label: "Santiago de Compostela" },
    { value: "ferrol", label: "Ferrol" },
    { value: "ourense", label: "Ourense" },
    { value: "vigo", label: "Vigo" },
    { value: "pontevedra", label: "Pontevedra" },
    { value: "lugo", label: "Lugo" },
    { value: "betanzos", label: "Betanzos" },
    { value: "naron", label: "Narón" },
    { value: "carballo", label: "Carballo" }
  ],
  
  // Álava
  alava: [
    { value: "vitoria_gasteiz", label: "Vitoria-Gasteiz" },
    { value: "lantarón", label: "Lantarón" },
    { value: "amurrio", label: "Amurrio" },
    { value: "laguardia", label: "Laguardia" },
    { value: "agurain", label: "Agurain/Salvatierra" }
  ],
  
  // Albacete
  albacete: [
    { value: "albacete", label: "Albacete" },
    { value: "hellin", label: "Hellín" },
    { value: "almansa", label: "Almansa" },
    { value: "la_roda", label: "La Roda" },
    { value: "villarrobledo", label: "Villarrobledo" }
  ],
  
  // Alicante
  alicante: [
    { value: "alicante", label: "Alicante" },
    { value: "elche", label: "Elche" },
    { value: "torrevieja", label: "Torrevieja" },
    { value: "benidorm", label: "Benidorm" },
    { value: "alcoy", label: "Alcoy" },
    { value: "eldense", label: "Elda" },
    { value: "san_vicente", label: "San Vicente del Raspeig" },
    { value: "orihuela", label: "Orihuela" },
    { value: "villena", label: "Villena" },
    { value: "dénia", label: "Dénia" }
  ],
  
  // Almería
  almeria: [
    { value: "almeria", label: "Almería" },
    { value: "roquetas_de_mar", label: "Roquetas de Mar" },
    { value: "el_ejido", label: "El Ejido" },
    { value: "nijar", label: "Níjar" },
    { value: "huercal_overa", label: "Huércal-Overa" }
  ],
  
  // Asturias
  asturias: [
    { value: "oviedo", label: "Oviedo" },
    { value: "gijon", label: "Gijón" },
    { value: "aviles", label: "Avilés" },
    { value: "langreo", label: "Langreo" },
    { value: "mieres", label: "Mieres" }
  ],
  
  // Ávila
  avila: [
    { value: "avila", label: "Ávila" },
    { value: "arenas_de_san_pedro", label: "Arenas de San Pedro" },
    { value: "arévalo", label: "Arévalo" }
  ],
  
  // Badajoz
  badajoz: [
    { value: "badajoz", label: "Badajoz" },
    { value: "merida", label: "Mérida" },
    { value: "don_benito", label: "Don Benito" },
    { value: "alburquerque", label: "Alburquerque" },
    { value: "villanueva_de_la_serena", label: "Villanueva de la Serena" }
  ],
  
  // Barcelona
  barcelona: [
    { value: "barcelona", label: "Barcelona" },
    { value: "badalona", label: "Badalona" },
    { value: "terrassa", label: "Terrassa" },
    { value: "sabadell", label: "Sabadell" },
    { value: "mataro", label: "Mataró" },
    { value: "granollers", label: "Granollers" },
    { value: "hospitalet", label: "L'Hospitalet de Llobregat" },
    { value: "sitges", label: "Sitges" },
    { value: "castelldefels", label: "Castelldefels" },
    { value: "vilanova_i_la_geltru", label: "Vilanova i la Geltrú" }
  ],
  
  // Bizkaia
  bizkaia: [
    { value: "bilbao", label: "Bilbao" },
    { value: "barakaldo", label: "Barakaldo" },
    { value: "getxo", label: "Getxo" },
    { value: "portugalete", label: "Portugalete" },
    { value: "santurtzi", label: "Santurtzi" }
  ],
  
  // Burgos
  burgos: [
    { value: "burgos", label: "Burgos" },
    { value: "aranda_de_duero", label: "Aranda de Duero" },
    { value: "miranda_de_ebro", label: "Miranda de Ebro" },
    { value: "briviesca", label: "Briviesca" }
  ],
  
  // Cáceres
  caceres: [
    { value: "caceres", label: "Cáceres" },
    { value: "plasencia", label: "Plasencia" },
    { value: "navalmoral_de_la_mata", label: "Navalmoral de la Mata" },
    { value: "trujillo", label: "Trujillo" },
    { value: "coria", label: "Coria" }
  ],
  
  // Cádiz
  cadiz: [
    { value: "cadiz", label: "Cádiz" },
    { value: "jerez_de_la_frontera", label: "Jerez de la Frontera" },
    { value: "algeciras", label: "Algeciras" },
    { value: "chiclana_de_la_frontera", label: "Chiclana de la Frontera" },
    { value: "san_fernando", label: "San Fernando" },
    { value: "el_puerto_de_santa_maria", label: "El Puerto de Santa María" },
    { value: "rota", label: "Rota" },
    { value: "puerto_real", label: "Puerto Real" }
  ],
  
  // Cantabria
  cantabria: [
    { value: "santander", label: "Santander" },
    { value: "torrelavega", label: "Torrelavega" },
    { value: "camargo", label: "Camargo" },
    { value: "castro_urdiales", label: "Castro Urdiales" },
    { value: "llanescas", label: "Laredo" }
  ],
  
  // Castellón
  castellon: [
    { value: "castellon_de_la_plana", label: "Castellón de la Plana" },
    { value: "vila_real", label: "Vila-real" },
    { value: "burriana", label: "Burriana" },
    { value: "la_vilavella", label: "La Vilavella" },
    { value: "oropesa_del_mar", label: "Oropesa del Mar" }
  ],
  
  // Ceuta
  ceuta: [
    { value: "ceuta", label: "Ceuta" }
  ],
  
  // Ciudad Real
  ciudad_real: [
    { value: "ciudad_real", label: "Ciudad Real" },
    { value: "puertollano", label: "Puertollano" },
    { value: "tomelloso", label: "Tomelloso" },
    { value: "valdepenas", label: "Valdepeñas" },
    { value: "manzanares", label: "Manzanares" }
  ],
  
  // Córdoba
  cordoba: [
    { value: "cordoba", label: "Córdoba" },
    { value: "lucena", label: "Lucena" },
    { value: "puente_genil", label: "Puente Genil" },
    { value: "cabra", label: "Cabra" },
    { value: "montilla", label: "Montilla" }
  ],
  
  // Cuenca
  cuenca: [
    { value: "cuenca", label: "Cuenca" },
    { value: "tarancón", label: "Tarancón" },
    { value: "motilla_del_palancar", label: "Motilla del Palancar" }
  ],
  
  // Girona
  girona: [
    { value: "girona", label: "Girona" },
    { value: "blanes", label: "Blanes" },
    { value: "figueres", label: "Figueres" },
    { value: "salt", label: "Salt" },
    { value: "palamos", label: "Palamós" }
  ],
  
  // Granada
  granada: [
    { value: "granada", label: "Granada" },
    { value: "motril", label: "Motril" },
    { value: "almeria", label: "Almuñécar" },
    { value: "armilla", label: "Armilla" },
    { value: "loja", label: "Loja" }
  ],
  
  // Guadalajara
  guadalajara: [
    { value: "guadalajara", label: "Guadalajara" },
    { value: "azuqueca_de_henares", label: "Azuqueca de Henares" },
    { value: "siguenza", label: "Sigüenza" },
    { value: "molina_de_aragon", label: "Molina de Aragón" }
  ],
  
  // Gipuzkoa
  gipuzkoa: [
    { value: "san_sebastian", label: "San Sebastián" },
    { value: "irun", label: "Irun" },
    { value: "errenteria", label: "Errenteria" },
    { value: "zarautz", label: "Zarautz" },
    { value: "egoa", label: "Eibar" }
  ],
  
  // Huelva
  huelva: [
    { value: "huelva", label: "Huelva" },
    { value: "almonte", label: "Almonte" },
    { value: "lepe", label: "Lepe" },
    { value: "cartaya", label: "Cartaya" },
    { value: "ayamonte", label: "Ayamonte" }
  ],
  
  // Huesca
  huesca: [
    { value: "huesca", label: "Huesca" },
    { value: "barbastro", label: "Barbastro" },
    { value: "monzon", label: "Monzón" },
    { value: "fraga", label: "Fraga" },
    { value: "jaca", label: "Jaca" }
  ],
  
  // Illes Balears
  illes_balears: [
    { value: "palma", label: "Palma de Mallorca" },
    { value: "calvia", label: "Calviá" },
    { value: "manacor", label: "Manacor" },
    { value: "inca", label: "Inca" },
    { value: "eivissa", label: "Eivissa" },
    { value: "mao", label: "Maó" },
    { value: "alaior", label: "Alaior" }
  ],
  
  // Jaén
  jaen: [
    { value: "jaen", label: "Jaén" },
    { value: "linares", label: "Linares" },
    { value: "ujijar", label: "Úbeda" },
    { value: "bailén", label: "Bailén" },
    { value: "andujar", label: "Andújar" }
  ],
  
  // La Rioja
  la_rioja: [
    { value: "logrono", label: "Logroño" },
    { value: "calahorra", label: "Calahorra" },
    { value: "aranda_de_duero", label: "Arnedo" },
    { value: "haro", label: "Haro" },
    { value: "alfaro", label: "Alfaro" }
  ],
  
  // Las Palmas
  las_palmas: [
    { value: "las_palmas", label: "Las Palmas de Gran Canaria" },
    { value: "telde", label: "Telde" },
    { value: "arucas", label: "Arucas" },
    { value: "galdar", label: "Gáldar" },
    { value: "santa_maria_de_guia", label: "Santa María de Guía" }
  ],
  
  // León
  leon: [
    { value: "leon", label: "León" },
    { value: "ponferrada", label: "Ponferrada" },
    { value: "sahagún", label: "Sahagún" },
    { value: "astorga", label: "Astorga" },
    { value: "la_baneza", label: "La Bañeza" }
  ],
  
  // Lleida
  lleida: [
    { value: "lleida", label: "Lleida" },
    { value: "balaguer", label: "Balaguer" },
    { value: "tárrega", label: "Tàrrega" },
    { value: "mollerussa", label: "Mollerussa" },
    { value: "vielha", label: "Vielha" }
  ],
  
  // Lugo
  lugo: [
    { value: "lugo", label: "Lugo" },
    { value: "monforte_de_lemos", label: "Monforte de Lemos" },
    { value: "vilalba", label: "Vilalba" },
    { value: "ribadeo", label: "Ribadeo" },
    { value: "fonsagrada", label: "A Fonsagrada" }
  ],
  
  // Madrid
  madrid: [
    { value: "madrid", label: "Madrid" },
    { value: "alcala_de_henares", label: "Alcalá de Henares" },
    { value: "getafe", label: "Getafe" },
    { value: "leganes", label: "Leganés" },
    { value: "alcorcon", label: "Alcorcón" },
    { value: "fuenlabrada", label: "Fuenlabrada" },
    { value: "mostoles", label: "Móstoles" },
    { value: "parla", label: "Parla" },
    { value: "coslada", label: "Coslada" },
    { value: "torrejon_de_ardoz", label: "Torrejón de Ardoz" },
    { value: "alcobendas", label: "Alcobendas" },
    { value: "las_rozas", label: "Las Rozas de Madrid" },
    { value: "san_sebastian_de_los_reyes", label: "San Sebastián de los Reyes" },
    { value: "pozuelo_de_alarcon", label: "Pozuelo de Alarcón" },
    { value: "aranjuez", label: "Aranjuez" }
  ],
  
  // Málaga
  malaga: [
    { value: "malaga", label: "Málaga" },
    { value: "marbella", label: "Marbella" },
    { value: "fuengirola", label: "Fuengirola" },
    { value: "torremolinos", label: "Torremolinos" },
    { value: "villanueva_de_la_concepcion", label: "Vélez-Málaga" },
    { value: "rincon_de_la_victoria", label: "Rincón de la Victoria" },
    { value: "estepona", label: "Estepona" },
    { value: "antequera", label: "Antequera" },
    { value: "benalmadena", label: "Benalmádena" },
    { value: "nerja", label: "Nerja" }
  ],
  
  // Melilla
  melilla: [
    { value: "melilla", label: "Melilla" }
  ],
  
  // Murcia
  murcia: [
    { value: "murcia", label: "Murcia" },
    { value: "cartagena", label: "Cartagena" },
    { value: "lorca", label: "Lorca" },
    { value: "molina_de_segura", label: "Molina de Segura" },
    { value: "caravaca_de_la_cruz", label: "Caravaca de la Cruz" },
    { value: "cehegin", label: "Cehegín" },
    { value: "yecla", label: "Yecla" },
    { value: "jumilla", label: "Jumilla" },
    { value: "san_javier", label: "San Javier" },
    { value: "totana", label: "Totana" }
  ],
  
  // Navarra
  navarra: [
    { value: "pamplona", label: "Pamplona" },
    { value: "tudela", label: "Tudela" },
    { value: "estella", label: "Estella" },
    { value: "barañain", label: "Barañáin" },
    { value: "tafalia", label: "Tafalla" }
  ],
  
  // Ourense
  ourense: [
    { value: "ourense", label: "Ourense" },
    { value: "verin", label: "Verín" },
    { value: "ribeiro", label: "Ribadavia" },
    { value: "celanova", label: "Celanova" },
    { value: "ourense", label: "O Carballiño" }
  ],
  
  // Palencia
  palencia: [
    { value: "palencia", label: "Palencia" },
    { value: "villamuriel_de_cerrato", label: "Villamuriel de Cerrato" },
    { value: "frechilla", label: "Frechilla" },
    { value: "guardo", label: "Guardo" },
    { value: "cervera_de_pisuerga", label: "Cervera de Pisuerga" }
  ],
  
  // Pontevedra
  pontevedra: [
    { value: "pontevedra", label: "Pontevedra" },
    { value: "vigo", label: "Vigo" },
    { value: "marin", label: "Marín" },
    { value: "redondela", label: "Redondela" },
    { value: "villagarcia_de_aramonte", label: "Vilagarcía de Arousa" }
  ],
  
  // Salamanca
  salamanca: [
    { value: "salamanca", label: "Salamanca" },
    { value: "bejar", label: "Béjar" },
    { value: "ciudad_rodrigo", label: "Ciudad Rodrigo" },
    { value: "peñaranda_de_bracamonte", label: "Peñaranda de Bracamonte" },
    { value: "santa_marta_de_tormes", label: "Santa Marta de Tormes" }
  ],
  
  // Segovia
  segovia: [
    { value: "segovia", label: "Segovia" },
    { value: "el_espinar", label: "El Espinar" },
    { value: "sepulveda", label: "Sepúlveda" },
    { value: "la_granja", label: "La Granja de San Ildefonso" },
    { value: "cuellar", label: "Cuéllar" }
  ],
  
  // Sevilla
  sevilla: [
    { value: "sevilla", label: "Sevilla" },
    { value: "dos_hermanas", label: "Dos Hermanas" },
    { value: "alcala_de_guadaira", label: "Alcalá de Guadaíra" },
    { value: "utria", label: "Utrera" },
    { value: "mairena_del_aljarafe", label: "Mairena del Aljarafe" },
    { value: "carmona", label: "Carmona" },
    { value: "marchena", label: "Marchena" },
    { value: "osuna", label: "Osuna" },
    { value: "lebrija", label: "Lebrija" },
    { value: "ecija", label: "Écija" }
  ],
  
  // Soria
  soria: [
    { value: "soria", label: "Soria" },
    { value: "almazan", label: "Almazán" },
    { value: "el_burgo_de_osma", label: "El Burgo de Osma" },
    { value: "medinaceli", label: "Medinaceli" }
  ],
  
  // Tarragona
  tarragona: [
    { value: "tarragona", label: "Tarragona" },
    { value: "reus", label: "Reus" },
    { value: "valls", label: "Valls" },
    { value: "amposta", label: "Amposta" },
    { value: "la_roda_de_barcelona", label: "La Roda de Berà" },
    { value: "salou", label: "Salou" },
    { value: "cambrils", label: "Cambrils" },
    { value: "torredembarra", label: "Torredembarra" },
    { value: "el_vendrell", label: "El Vendrell" },
    { value: "montblanc", label: "Montblanc" }
  ],
  
  // Teruel
  teruel: [
    { value: "teruel", label: "Teruel" },
    { value: "alcañiz", label: "Alcañiz" },
    { value: "calamocha", label: "Calamocha" },
    { value: "valderrobres", label: "Valderrobres" },
    { value: "albarracin", label: "Albarracín" }
  ],
  
  // Toledo
  toledo: [
    { value: "toledo", label: "Toledo" },
    { value: "talavera_de_la_reina", label: "Talavera de la Reina" },
    { value: "illescas", label: "Illescas" },
    { value: "seseña", label: "Seseña" },
    { value: "torrijos", label: "Torrijos" }
  ],
  
  // Valencia
  valencia: [
    { value: "valencia", label: "Valencia" },
    { value: "torrent", label: "Torrent" },
    { value: "paterna", label: "Paterna" },
    { value: "gandia", label: "Gandía" },
    { value: "xativa", label: "Xàtiva" },
    { value: "sagunto", label: "Sagunto" },
    { value: "oliva", label: "Oliva" },
    { value: "bocairent", label: "Bocairent" },
    { value: "requena", label: "Requena" },
    { value: "cullera", label: "Cullera" }
  ],
  
  // Valladolid
  valladolid: [
    { value: "valladolid", label: "Valladolid" },
    { value: "medina_del_campo", label: "Medina del Campo" },
    { value: "laguna_de_duero", label: "Laguna de Duero" },
    { value: "tres_castillos", label: "Tordesillas" },
    { value: "penafiel", label: "Peñafiel" }
  ],
  
  // Zamora
  zamora: [
    { value: "zamora", label: "Zamora" },
    { value: "benavente", label: "Benavente" },
    { value: "toro", label: "Toro" },
    { value: "almendra", label: "Almendra" },
    { value: "puebla_de_sanmar", label: "Puebla de Sanabria" }
  ],
  
  // Zaragoza
  zaragoza: [
    { value: "zaragoza", label: "Zaragoza" },
    { value: "calatayud", label: "Calatayud" },
    { value: "ejea_de_los_caballeros", label: "Ejea de los Caballeros" },
    { value: "la_muela", label: "La Muela" },
    { value: "caspe", label: "Caspe" },
    { value: "uncastillo", label: "Uncastillo" },
    { value: "tauste", label: "Tauste" },
    { value: "alagon", label: "Alagón" },
    { value: "cuarte_de_huerva", label: "Cuarte de Huerva" },
    { value: "pedrola", label: "Pedrola" }
  ],
  
  // ========================================
  // PORTUGAL
  // ========================================
  
  // Aveiro
  aveiro: [
    { value: "aveiro", label: "Aveiro" },
    { value: "ilhavo", label: "Ílhavo" },
    { value: "ovar", label: "Ovar" },
    { value: "espinho", label: "Espinho" },
    { value: "figueira_da_foz", label: "Figueira da Foz" }
  ],
  
  // Beja
  beja: [
    { value: "beja", label: "Beja" },
    { value: "moura", label: "Moura" },
    { value: "serpa", label: "Serpa" },
    { value: "castro_verde", label: "Castro Verde" }
  ],
  
  // Braga
  braga: [
    { value: "braga", label: "Braga" },
    { value: "guimaraes", label: "Guimarães" },
    { value: "barcelos", label: "Barcelos" },
    { value: "vila_nova_de_famalicao", label: "Vila Nova de Famalicão" },
    { value: "fafe", label: "Fafe" }
  ],
  
  // Bragança
  braganca: [
    { value: "braganca", label: "Bragança" },
    { value: "mirandela", label: "Mirandela" },
    { value: "vimioso", label: "Vimioso" },
    { value: "mogadouro", label: "Mogadouro" }
  ],
  
  // Castelo Branco
  castelo_branco: [
    { value: "castelo_branco", label: "Castelo Branco" },
    { value: "covilha", label: "Covilhã" },
    { value: "fundao", label: "Fundão" },
    { value: "idaniha_a_nova", label: "Idanha-a-Nova" }
  ],
  
  // Coimbra
  coimbra: [
    { value: "coimbra", label: "Coimbra" },
    { value: "figueira_da_foz", label: "Figueira da Foz" },
    { value: "condeixa_a_nova", label: "Condeixa-a-Nova" },
    { value: "lousa", label: "Lousã" },
    { value: "mira", label: "Mira" }
  ],
  
  // Évora
  evora: [
    { value: "evora", label: "Évora" },
    { value: "estremoz", label: "Estremoz" },
    { value: "montemor_o_novo", label: "Montemor-o-Novo" },
    { value: "borba", label: "Borba" }
  ],
  
  // Faro (Algarve)
  faro: [
    { value: "faro", label: "Faro" },
    { value: "portimao", label: "Portimão" },
    { value: "albufeira", label: "Albufeira" },
    { value: "loulé", label: "Loulé" },
    { value: "lagos", label: "Lagos" },
    { value: "tavira", label: "Tavira" },
    { value: "olhao", label: "Olhão" },
    { value: "quarteira", label: "Quarteira" },
    { value: "vilamoura", label: "Vilamoura" },
    { value: "sagres", label: "Sagres" }
  ],
  
  // Guarda
  guarda: [
    { value: "guarda", label: "Guarda" },
    { value: "sabugal", label: "Sabugal" },
    { value: "pinhel", label: "Pinhel" },
    { value: "gouveia", label: "Gouveia" }
  ],
  
  // Leiria
  leiria: [
    { value: "leiria", label: "Leiria" },
    { value: "marinha_grande", label: "Marinha Grande" },
    { value: "pombal", label: "Pombal" },
    { value: "peniche", label: "Peniche" },
    { value: "nazaré", label: "Nazaré" },
    { value: "obidos", label: "Óbidos" }
  ],
  
  // Lisboa
  lisboa: [
    { value: "lisboa", label: "Lisboa" },
    { value: "sintra", label: "Sintra" },
    { value: "cascais", label: "Cascais" },
    { value: "oeiras", label: "Oeiras" },
    { value: "amadora", label: "Amadora" },
    { value: "odivelas", label: "Odivelas" },
    { value: "loures", label: "Loures" },
    { value: "almada", label: "Almada" },
    { value: "seixal", label: "Seixal" },
    { value: "barreiro", label: "Barreiro" },
    { value: "costa_caparica", label: "Costa da Caparica" },
    { value: "ericeira", label: "Ericeira" },
    { value: "quinta_do_lago", label: "Quinta do Lago" },
    { value: "estoril", label: "Estoril" },
    { value: "belém", label: "Belém" }
  ],
  
  // Portalegre
  portalegre: [
    { value: "portalegre", label: "Portalegre" },
    { value: "elvas", label: "Elvas" },
    { value: "estremoz", label: "Estremoz" },
    { value: "ponte_de_sor", label: "Ponte de Sor" }
  ],
  
  // Porto
  porto: [
    { value: "porto", label: "Porto" },
    { value: "vila_nova_de_gaia", label: "Vila Nova de Gaia" },
    { value: "matosinhos", label: "Matosinhos" },
    { value: "maia", label: "Maia" },
    { value: "povoa_de_varzim", label: "Póvoa de Varzim" },
    { value: "valongo", label: "Valongo" },
    { value: "trofa", label: "Trofa" },
    { value: "santa_maria_feira", label: "Santa Maria da Feira" },
    { value: "vila_do_conde", label: "Vila do Conde" },
    { value: "esposende", label: "Esposende" },
    { value: "braga", label: "Braga" },
    { value: "guimaraes", label: "Guimarães" },
    { value: "porto_covo", label: "Porto Covo" }
  ],
  
  // Santarém
  santarem: [
    { value: "santarem", label: "Santarém" },
    { value: "tomar", label: "Tomar" },
    { value: "riachos", label: "Rio Maior" },
    { value: "cartaxo", label: "Cartaxo" },
    { value: "alcanena", label: "Alcanena" }
  ],
  
  // Setúbal
  setubal: [
    { value: "setubal", label: "Setúbal" },
    { value: "sesimbra", label: "Sesimbra" },
    { value: "almada", label: "Almada" },
    { value: "montijo", label: "Montijo" },
    { value: "palmela", label: "Palmela" },
    { value: "costa_caparica", label: "Costa da Caparica" },
    { value: "sesimbra", label: "Sesimbra" },
    { value: "troia", label: "Tróia" }
  ],
  
  // Viana do Castelo
  viana_do_castelo: [
    { value: "viana_do_castelo", label: "Viana do Castelo" },
    { value: "braga", label: "Braga" },
    { value: "barcelos", label: "Barcelos" },
    { value: "camina", label: "Caminha" },
    { value: "vila_praia_ancora", label: "Vila Praia de Âncora" }
  ],
  
  // Vila Real
  vila_real: [
    { value: "vila_real", label: "Vila Real" },
    { value: "chaves", label: "Chaves" },
    { value: "peso_da_regua", label: "Peso da Régua" },
    { value: "santa_marta_penaguiao", label: "Santa Marta de Penaguião" },
    { value: "mesao_frio", label: "Mesão Frio" }
  ],
  
  // Viseu
  viseu: [
    { value: "viseu", label: "Viseu" },
    { value: "lamego", label: "Lamego" },
    { value: "mangualde", label: "Mangualde" },
    { value: "penalva_castelo", label: "Penalva do Castelo" },
    { value: "santa_comba_dao", label: "Santa Comba Dão" }
  ],
  
  // Açores
  acores: [
    { value: "ponta_delgada", label: "Ponta Delgada" },
    { value: "horta", label: "Horta" },
    { value: "angra_heroismo", label: "Angra do Heroísmo" },
    { value: "vila_franca_campo", label: "Vila Franca do Campo" },
    { value: "ribeira_grande", label: "Ribeira Grande" }
  ],
  
  // Madeira
  madeira: [
    { value: "funchal", label: "Funchal" },
    { value: "machico", label: "Machico" },
    { value: "calheta", label: "Calheta" },
    { value: "portimao_madeira", label: "Porto Moniz" },
    { value: "camara_lobos", label: "Câmara de Lobos" },
    { value: "santa_cruz_madeira", label: "Santa Cruz" },
    { value: "port_santo", label: "Porto Santo" }
  ]
};

// ========================================
// HOOK PERSONALIZADO
// ========================================

export function useLocations() {
  const [selectedCountry, setSelectedCountry] = useState("es");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [availableProvinces, setAvailableProvinces] = useState<typeof SPAIN_PROVINCES>(SPAIN_PROVINCES);
  const [availableCities, setAvailableCities] = useState<typeof CITIES_BY_PROVINCE.madrid>([]);
  
  // Actualizar provincias cuando cambia el país
  useEffect(() => {
    const provinces = PROVINCES_BY_COUNTRY[selectedCountry as keyof typeof PROVINCES_BY_COUNTRY] || [];
    setAvailableProvinces(provinces);
    setSelectedProvince("");
    setAvailableCities([]);
  }, [selectedCountry]);
  
  // Actualizar ciudades cuando cambia la provincia
  useEffect(() => {
    if (selectedProvince) {
      const cities = CITIES_BY_PROVINCE[selectedProvince as keyof typeof CITIES_BY_PROVINCE] || [];
      setAvailableCities(cities);
    } else {
      setAvailableCities([]);
    }
  }, [selectedProvince]);
  
  // Manejar cambio de país
  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    return country;
  };
  
  // Manejar cambio de provincia
  const handleProvinceChange = (province: string) => {
    setSelectedProvince(province);
    return province;
  };
  
  // Resetear ubicaciones
  const resetLocations = () => {
    setSelectedProvince("");
    setAvailableCities([]);
  };
  
  // Obtener país actual
  const getCurrentCountry = () => {
    return COUNTRIES.find(c => c.value === selectedCountry)?.label || "";
  };
  
  // Obtener provincia actual
  const getCurrentProvince = () => {
    const provinces = PROVINCES_BY_COUNTRY[selectedCountry as keyof typeof PROVINCES_BY_COUNTRY] || [];
    return provinces.find(p => p.value === selectedProvince)?.label || "";
  };
  
  // Obtener ciudad actual
  const getCurrentCity = (cityValue: string) => {
    if (!selectedProvince) return "";
    const cities = CITIES_BY_PROVINCE[selectedProvince as keyof typeof CITIES_BY_PROVINCE] || [];
    return cities.find(c => c.value === cityValue)?.label || "";
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