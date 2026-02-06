"use client";

import { useState } from "react";

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  required?: boolean;
}

export default function StarRating({ value, onChange, label, required }: StarRatingProps) {
  const [hover, setHover] = useState(0);

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="flex gap-1 items-center">
        {[1, 2, 3, 4, 5].map((star) => {
          const active = hover >= star || (!hover && value >= star);

          return (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className={`text-3xl transition-all duration-200 ${
                active ? "text-yellow-400 scale-110" : "text-gray-300"
              } hover:text-yellow-300`}
            >
              ★
            </button>
          );
        })}
      </div>

      {required && value === 0 && (
        <p className="text-red-500 text-sm mt-1">Selecciona una categoría</p>
      )}
    </div>
  );
}
