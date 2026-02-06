export const CATEGORY_MAP: Record<string, string[]> = {
  exterior: ["exterior", "garden", "parking", "view", "balcony", "terrace", "facade"],
  habitaciones: ["hotel room", "suite", "family room", "double room", "single room", "king bed", "queen bed", "bedroom"],
  interior: ["corridor", "hallway", "interior"],
  salas_comunes: ["lobby", "reception", "hall", "common area"],
  restaurante: ["restaurant", "breakfast area", "bar"],
  piscina: ["swimming pool", "pool"],
  spa: ["spa", "gym"],
};

export function detectCategory(tags: string[]): string {
  const lower = tags.map(t => t.toLowerCase());

  for (const [category, keywords] of Object.entries(CATEGORY_MAP)) {
    if (keywords.some(k => lower.includes(k))) {
      return category;
    }
  }

  return "otros";
}
