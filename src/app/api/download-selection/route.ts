export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import JSZip from "jszip";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const idsParam = req.nextUrl.searchParams.get("ids");

    if (!idsParam) {
      return NextResponse.json({ error: "Missing IDs" }, { status: 400 });
    }

    const ids = idsParam.split(",");

    const { data: mediaData, error } = await supabase
      .from("media")
      .select("id, url, category, created_at, hotel_id")
      .in("id", ids);

    if (error || !mediaData || mediaData.length === 0) {
      return NextResponse.json({ error: "No media found" }, { status: 404 });
    }

    const hotelId = mediaData[0].hotel_id;
    const { data: hotelData } = await supabase
      .from("organizations")
      .select("name")
      .eq("id", hotelId)
      .single();

    const hotelName = hotelData?.name?.toLowerCase().replace(/\s+/g, "-") || "hotel";

    const zip = new JSZip();

    for (const item of mediaData) {
      try {
        const date = new Date(item.created_at).toISOString().split("T")[0];
        const categoryName = item.category?.toLowerCase().replace(/\s+/g, "-") || "media";
        const extension = item.url.split(".").pop()?.split("?")[0] || "jpg";

        const fileName = `${hotelName}-${categoryName}-${date}-${item.id}.${extension}`;

        const response = await fetch(item.url);
        if (!response.ok) continue;

        const arrayBuffer = await response.arrayBuffer();
        zip.file(fileName, arrayBuffer);
      } catch {
        continue;
      }
    }

    const zipContent = await zip.generateAsync({
      type: "uint8array",
      compression: "DEFLATE",
      compressionOptions: { level: 6 },
    });

    const zipBuffer = Buffer.from(zipContent);

    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${hotelName}-seleccion.zip"`,
        "Content-Length": zipBuffer.length.toString(),
      },
    });
  } catch (err) {
    console.error("ZIP ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
