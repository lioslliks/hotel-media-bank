export function QualityBadge({ quality }: { quality?: string }) {
  if (!quality) quality = "baja"

  const q = quality.toLowerCase()

  const map: Record<string, string> = {
    alta: "bg-emerald-500",
    media: "bg-amber-500",
    baja: "bg-red-500",
    borrosa: "bg-orange-500",
    oscura: "bg-gray-500",
    sobreexpuesta: "bg-blue-500",
  }

  const color = map[q] || "bg-gray-500"

  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full ${color}`}></span>
      <span className="text-sm font-normal text-gray-600">
        {quality.charAt(0).toUpperCase() + quality.slice(1)}
      </span>
    </div>
  )
}
