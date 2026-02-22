"use client";

import { useMemo } from "react";

interface MediaItem {
  id: string;
  url: string;
  created_at: string;
  ai_title?: string;
}

interface Props {
  media: MediaItem[];
}

/**
 * Posiciones cuidadosamente diseñadas para:
 * - evitar solapamientos
 * - mantener densidad visual
 * - romper patrones verticales
 */
const POSITIONS = [
  { x: 42, y: 34 },
  { x: 58, y: 28 },
  { x: 26, y: 32 },
  { x: 72, y: 36 },
  { x: 34, y: 52 },
  { x: 52, y: 50 },
  { x: 68, y: 54 },
  { x: 30, y: 72 },
  { x: 48, y: 74 },
  { x: 66, y: 70 },
];

/**
 * Tamaños mezclados para evitar lectura jerárquica evidente
 */
const SIZES = [
  165,
  140,
  190,
  115,
  140,
  190,
  115,
  165,
  140,
  115,
];

export default function VisualImpactGallery({ media }: Props) {
  const bubbles = useMemo(() => {
    return [...media]
      .filter(m => m.url)
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
      )
      .slice(0, 10)
      .map((item, index) => ({
        ...item,
        size: SIZES[index],
        position: POSITIONS[index],
        animation:
          SIZES[index] >= 180
            ? "bubbleFloatLarge 26s ease-in-out infinite"
            : SIZES[index] >= 150
            ? "bubbleFloatMedium 30s ease-in-out infinite"
            : "bubbleFloatSlow 34s ease-in-out infinite",
      }));
  }, [media]);

  return (
    <div className="relative w-full h-[600px] overflow-hidden">
      <p className="absolute top-0 left-0 text-sm font-medium text-gray-600">
        Último contenido añadido
      </p>

      {bubbles.map(item => (
        <div
          key={item.id}
          className="absolute rounded-full overflow-hidden shadow-lg transition-transform hover:scale-105"
          style={{
            width: item.size,
            height: item.size,
            left: `${item.position.x}%`,
            top: `${item.position.y}%`,
            transform: "translate(-50%, -50%)",
            animation: item.animation,
          }}
          title={item.ai_title ?? "Imagen del hotel"}
        >
          <img
            src={item.url}
            alt={item.ai_title ?? "Imagen del hotel"}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}
