// src/app/api/upload/route.ts

import { NextRequest, NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"
import { createClient } from "@supabase/supabase-js"
import { Buffer } from "buffer"
import crypto from "crypto"
import sharp from "sharp"

// ==================== ENV ====================
if (!process.env.CLOUDINARY_CLOUD_NAME) throw new Error("CLOUDINARY_CLOUD_NAME missing")
if (!process.env.CLOUDINARY_API_KEY) throw new Error("CLOUDINARY_API_KEY missing")
if (!process.env.CLOUDINARY_API_SECRET) throw new Error("CLOUDINARY_API_SECRET missing")
if (!process.env.AI_BACKEND_URL) throw new Error("AI_BACKEND_URL missing")

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// ==================== SUPABASE ====================
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// ==================== IMAGE SIZES ====================
const IMAGE_SIZES = {
  thumbnail: { width: 256, height: 144 },
  small: { width: 800, height: 450 },
  medium: { width: 1920, height: 1080 },
  large: { width: 2880, height: 1620 },
}

// ==================== POST ====================
export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID().slice(0, 8)
  console.log(`🚀 [${requestId}] Upload iniciado`)

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const hotelId = formData.get("hotel_id") as string | null

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Archivo inválido" }, { status: 400 })
    }

    if (!hotelId) {
      return NextResponse.json({ error: "Falta hotel_id" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const hash = crypto.createHash("sha256").update(buffer).digest("hex")

    // ==================== DUPLICADOS ====================
    const { data: existing } = await supabase
      .from("media")
      .select("id, url")
      .eq("hash", hash)
      .single()

    if (existing) {
      console.log(`♻️ [${requestId}] Imagen duplicada`)
      return NextResponse.json({
        is_duplicate: true,
        url: existing.url,
        photo_id: existing.id,
      })
    }

    // ==================== CLOUDINARY ====================
    console.log(`☁️ [${requestId}] Subiendo a Cloudinary`)
    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: "hotel-media", resource_type: "image" },
          (error, result) => (error ? reject(error) : resolve(result))
        )
        .end(buffer)
    })

    // ==================== BACKEND IA ====================
    console.log(`🤖 [${requestId}] Llamando backend IA`)
    const aiResponse = await fetch(`${process.env.AI_BACKEND_URL}/analyze`, {
      method: "POST",
      body: (() => {
        const fd = new FormData()
        fd.append("url", uploadResult.secure_url)
        return fd
      })(),
    })

    if (!aiResponse.ok) {
      throw new Error("Error en backend IA")
    }

    const ai = await aiResponse.json()

    // ==================== VERSIONES ====================
    const versions: Record<string, any> = {}

    for (const [size, cfg] of Object.entries(IMAGE_SIZES)) {
      const resized = await sharp(buffer)
        .resize(cfg.width, cfg.height, { fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: size === "thumbnail" ? 70 : 85 })
        .toBuffer()

      const v = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "hotel-media/versions",
              public_id: `${size}-${hash.slice(0, 16)}`,
            },
            (err, res) => (err ? reject(err) : resolve(res))
          )
          .end(resized)
      })

      versions[size] = { url: v.secure_url }
    }

    // ==================== SUPABASE ====================
    const { data, error } = await supabase
      .from("media")
      .insert([
        {
          hotel_id: hotelId,
          url: uploadResult.secure_url,
          hash,
          category: ai.category,
          ai_category: ai.category,
          ai_title: ai.title,
          tags: ai.tags || [],
          versions,
        },
      ])
      .select()

    if (error) throw error

    console.log(`✅ [${requestId}] Upload completo`)

    return NextResponse.json({
      photo_id: data[0].id,
      url: uploadResult.secure_url,
      category: ai.category,
      tags: ai.tags,
      ai_title: ai.title,
      versions,
    })

  } catch (err: any) {
    console.error(`❌ [${requestId}] Error`, err.message)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
