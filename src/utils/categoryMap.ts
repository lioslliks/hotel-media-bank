// utils/categoryMap.ts

export type RawTag = string | { label: string; score?: number };

/**
 * Mapa de categorías ampliado y optimizado para hoteles reales.
 * Incluye coincidencias parciales y variaciones reales de CLIP.
 */
export const CATEGORY_MAP: Record<string, string[]> = {
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
 */
function normalizeTags(tags: RawTag[]): string[] {
  return tags
    .flatMap(tag => {
      if (typeof tag === 'string') {
        const t = tag.trim();

        if (t.startsWith('{') && t.endsWith('}')) {
          try {
            const parsed = JSON.parse(t);
            if (parsed?.label) return parsed.label;
          } catch {}
        }

        return t;
      }

      if (typeof tag === 'object' && typeof tag.label === 'string') {
        return tag.label;
      }

      return [];
    })
    .filter(Boolean)
    .map(t => t.toLowerCase());
}

/**
 * Detecta categoría con prioridades reales de hotel
 * PRIORIDADES:
 * 1. piscina
 * 2. spa
 * 3. habitaciones
 * 4. restaurante
 * 5. salas comunes
 * 6. vistas
 * 7. terraza
 * 8. fachada
 * 9. interior
 * 10. exterior
 */
export function detectCategory(tags: RawTag[]): string {
  const normalized = normalizeTags(tags);

  if (!normalized.length) return 'otros';

  const has = (keyword: string) =>
    normalized.some(t => t.includes(keyword));

  // ------------------------------------------------------------
  // 1. Piscina
  // ------------------------------------------------------------
  if (
    has('pool') ||
    has('poolside') ||
    has('infinity')
  ) {
    return 'piscina';
  }

  // ------------------------------------------------------------
  // 2. Spa / Wellness
  // ------------------------------------------------------------
  if (
    has('spa') ||
    has('hammam') ||
    has('sauna') ||
    has('steam') ||
    has('massage') ||
    has('wellness') ||
    has('treatment') ||
    has('gym') ||
    has('fitness')
  ) {
    return 'spa';
  }

  // ------------------------------------------------------------
  // 3. Habitaciones (aunque tenga "view")
  // ------------------------------------------------------------
  if (
    has('room') ||
    has('suite') ||
    has('bedroom') ||
    has('double room') ||
    has('single room') ||
    has('king') ||
    has('queen')
  ) {
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
  if (
    has('lobby') ||
    has('reception') ||
    has('common area') ||
    has('hall') ||
    has('lounge')
  ) {
    return 'salas_comunes';
  }

  // ------------------------------------------------------------
  // 6. Vistas
  // ------------------------------------------------------------
  if (
    has('city view') ||
    has('skyline') ||
    has('urban') ||
    has('sea view') ||
    has('ocean view') ||
    has('panoramic')
  ) {
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
  if (
    has('bathroom') ||
    has('corridor') ||
    has('interior') ||
    has('hallway')
  ) {
    return 'interior';
  }

  // ------------------------------------------------------------
  // 10. Exterior
  // ------------------------------------------------------------
  if (
    has('exterior') ||
    has('garden') ||
    has('outdoor') ||
    has('parking') ||
    has('patio')
  ) {
    return 'exterior';
  }

  return 'otros';
}
