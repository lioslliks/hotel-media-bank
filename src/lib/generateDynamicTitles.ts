// src/lib/generateDynamicTitles.ts

/**
 * Genera títulos dinámicos basados en tags ya normalizados.
 * Compatible con normalizeTags(), categoryMap y sceneWeights.
 */

export function generateDynamicTitles(tags: string[]) {
  const normalized = tags.map(t => t.toLowerCase());
  const has = (key: string) => normalized.includes(key);

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

  const titles: string[] = [];

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
