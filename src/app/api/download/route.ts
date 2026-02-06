export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl.searchParams.get("url");
    const mediaId = req.nextUrl.searchParams.get("id");

    if (!url || !mediaId) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    // Obtener datos de la imagen
    const { data: mediaData } = await supabase
      .from("media")
      .select("category, hotel_id, created_at")
      .eq("id", mediaId)
      .single();

    if (!mediaData) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    // Obtener nombre del hotel
    const { data: hotelData } = await supabase
      .from("organizations")
      .select("name")
      .eq("id", mediaData.hotel_id)
      .single();

    const hotelName = hotelData?.name?.toLowerCase().replace(/\s+/g, "-") || "hotel";
    const category = mediaData.category?.toLowerCase().replace(/\s+/g, "-") || "media";
    const date = new Date(mediaData.created_at).toISOString().split("T")[0];

    // Detectar extensión real
    const extension = url.split(".").pop()?.split("?")[0] || "jpg";

    // Nombre final
    const fileName = `${hotelName}-${category}-${date}.${extension}`;

    // Descargar imagen original
    const response = await fetch(url);

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch image" }, { status: 500 });
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (err) {
    console.error("DOWNLOAD ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
