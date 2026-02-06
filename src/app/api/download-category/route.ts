export const runtime = "nodejs";       // 👈 OBLIGA a usar Node.js (JSZip funciona)
export const dynamic = "force-dynamic"; // 👈 Evita Edge y caching

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import JSZip from "jszip";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const hotelId = req.nextUrl.searchParams.get("hotel");
    const category = req.nextUrl.searchParams.get("category");

    if (!hotelId || !category) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    // 1) Obtener nombre del hotel
    const { data: hotelData, error: hotelError } = await supabase
      .from("organizations")
      .select("name")
      .eq("id", hotelId)
      .single();

    if (hotelError || !hotelData) {
      return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
    }

    const hotelName = hotelData.name.toLowerCase().replace(/\s+/g, "-");
    const categoryName = category.toLowerCase().replace(/\s+/g, "-");

    // 2) Obtener todas las imágenes de esa categoría
    const { data: mediaData, error: mediaError } = await supabase
      .from("media")
      .select("id, url, created_at")
      .eq("hotel_id", hotelId)
      .eq("category", category)
      .order("created_at", { ascending: false });

    if (mediaError || !mediaData || mediaData.length === 0) {
      return NextResponse.json({ error: "No media found" }, { status: 404 });
    }

    // Limitar a 100 imágenes para evitar timeouts
    const MAX_IMAGES = 100;
    const filteredMedia = mediaData.slice(0, MAX_IMAGES);

    // 3) Crear ZIP
    const zip = new JSZip();

    for (const item of filteredMedia) {
      try {
        const date = new Date(item.created_at).toISOString().split("T")[0];
        const extension = item.url.split('.').pop() || 'jpg';
        const fileName = `${hotelName}-${categoryName}-${date}-${item.id}.${extension}`;

        const response = await fetch(item.url);
        
        if (!response.ok) {
          console.warn(`Failed to fetch ${item.url}`);
          continue;
        }

        const arrayBuffer = await response.arrayBuffer();
        zip.file(fileName, arrayBuffer);
      } catch (err) {
        console.warn(`Error processing ${item.url}:`, err);
        continue;
      }
    }

    // Verificar que el ZIP no esté vacío
    const zipFiles = Object.keys(zip.files);
    if (zipFiles.length === 0) {
      return NextResponse.json({ error: "No valid images to download" }, { status: 404 });
    }

    // 4) Generar ZIP como Buffer (CORRECCIÓN CLAVE)
    const zipContent = await zip.generateAsync({ 
      type: "uint8array",
      compression: "DEFLATE",
      compressionOptions: { level: 6 }
    });
    const zipBuffer = Buffer.from(zipContent); // ✅ Conversión a Buffer

    // 5) Devolver ZIP
    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${hotelName}-${categoryName}-gallery.zip"`,
        "Content-Length": zipBuffer.length.toString(),
      },
    });
  } catch (err) {
    console.error("ZIP ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}