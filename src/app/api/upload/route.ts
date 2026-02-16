import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { createClient } from '@supabase/supabase-js';
import { Buffer } from 'buffer';
import crypto from 'crypto';
import sharp from 'sharp';

import { analyzeImage } from '@/lib/ai';
import { normalizeTags } from '@/lib/normalizeTags';
import { detectCategory } from '@/utils/categoryMap';
import { detectScenePriority } from '@/lib/scenePriority';
import { computeSceneWeights } from '@/lib/sceneWeights';

// ⭐ IMPORTANTE: generador de títulos
import { updateMediaAiTitle } from '@/lib/updateMediaAiTitle';

// ==================== VALIDACIÓN ENV ====================
if (!process.env.CLOUDINARY_CLOUD_NAME) throw new Error('❌ CLOUDINARY_CLOUD_NAME no está definido');
if (!process.env.CLOUDINARY_API_KEY) throw new Error('❌ CLOUDINARY_API_KEY no está definido');
if (!process.env.CLOUDINARY_API_SECRET) throw new Error('❌ CLOUDINARY_API_SECRET no está definido');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ==================== SUPABASE ====================
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ==================== VERSIONES ====================
const IMAGE_SIZES = {
  thumbnail: { width: 256, height: 144 },
  small: { width: 800, height: 450 },
  medium: { width: 1920, height: 1080 },
  large: { width: 2880, height: 1620 },
};

export async function POST(request: NextRequest) {
  console.log('🚀 POST /api/upload iniciado');

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const hotelId = formData.get('hotel_id') as string | null;

    console.log('📥 Datos recibidos:', {
      hasFile: !!file,
      hasHotelId: !!hotelId,
      fileType: file?.type,
      fileSize: file?.size,
    });

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'Archivo inválido' }, { status: 400 });
    }

    if (!hotelId) {
      return NextResponse.json({ error: 'Falta hotel_id' }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Archivo demasiado grande (máx. 5MB)' }, { status: 400 });
    }

    // ==================== BUFFER + METADATA ====================
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const metadata = await sharp(buffer).metadata();

    // ==================== HASH ====================
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');
    console.log('🔑 Hash generado:', hash.substring(0, 16));

    // ==================== CHECK DUPLICADO ====================
    const { data: existing, error: checkError } = await supabase
      .from('image_hashes')
      .select('url, type, quality_score')
      .eq('hash', hash)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('❌ Error verificando duplicados:', checkError);
      return NextResponse.json({ error: 'Error verificando duplicados' }, { status: 500 });
    }

    // ==================== DUPLICADO ====================
    if (existing) {
      console.log('⚠️ Imagen duplicada detectada');

      const analysis = await analyzeImage(existing.url);

      const rawTags = analysis.tags;
      const tags = normalizeTags(rawTags);
      const category = detectCategory(tags);
      const scene = detectScenePriority(tags);
      const sceneWeights = computeSceneWeights(tags);

      console.log('🏷️ Tags (premium):', tags);
      console.log('📂 Categoría detectada:', category);
      console.log('🎬 Escena detectada:', scene);
      console.log('⚖️ Pesos de escena:', sceneWeights);

      return NextResponse.json({
        url: existing.url,
        type: existing.type,
        quality_score: existing.quality_score || 0.8,
        is_duplicate: true,
        tags,
        category,
        scene,
        sceneWeights,
        message: 'Esta imagen ya existe en tu galería',
      });
    }

    // ==================== UPLOAD CLOUDINARY ====================
    console.log('☁️ Subiendo a Cloudinary...');

    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: 'hotel-media',
            resource_type: 'auto',
            invalidate: true,
            quality_analysis: true,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    console.log('✅ Subida exitosa:', uploadResult.secure_url);

    // ==================== IA ====================
    console.log('🔍 Analizando imagen con ExSabri IA...');
    const analysis = await analyzeImage(uploadResult.secure_url);

    console.log("🔥 RAW TAGS FROM BACKEND:", analysis.tags);

    const rawTags = analysis.tags;

    // ⭐ NORMALIZACIÓN PREMIUM
    const tags = normalizeTags(rawTags);

    // ⭐ CATEGORÍA FINAL
    const category = detectCategory(tags);

    // ⭐ ESCENA DOMINANTE
    const scene = detectScenePriority(tags);

    // ⭐ PESOS DE ESCENA
    const sceneWeights = computeSceneWeights(tags);

    console.log('🏷️ Tags (premium):', tags);
    console.log('📂 Categoría detectada:', category);
    console.log('🎬 Escena detectada:', scene);
    console.log('⚖️ Pesos de escena:', sceneWeights);

    const qualityScore = uploadResult.quality_analysis?.focus || 0.8;

    // ==================== GENERAR VERSIONES ====================
    console.log('🔄 Generando versiones de imagen...');

    const versions: Record<string, any> = {};

    versions.original = {
      url: uploadResult.secure_url,
      dimensions: `${metadata.width}x${metadata.height}`,
      aspect_ratio:
        metadata.width && metadata.height ? `${metadata.width}:${metadata.height}` : 'N/A',
      file_size: `${(buffer.length / 1024).toFixed(1)}KB`,
    };

    for (const [sizeName, sizeConfig] of Object.entries(IMAGE_SIZES)) {
      try {
        console.log(`  📸 Procesando versión ${sizeName}...`);

        const processedBuffer = await sharp(buffer)
          .resize(sizeConfig.width, sizeConfig.height, {
            fit: 'inside',
            withoutEnlargement: true,
          })
          .jpeg({ quality: sizeName === 'thumbnail' ? 70 : 85 })
          .toBuffer();

        const versionUploadResult = await new Promise<any>((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                folder: 'hotel-media/versions',
                resource_type: 'image',
                invalidate: true,
                public_id: `${sizeName}-${hash.substring(0, 16)}`,
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            )
            .end(processedBuffer);
        });

        const versionMetadata = await sharp(processedBuffer).metadata();

        versions[sizeName] = {
          url: versionUploadResult.secure_url,
          dimensions: `${versionMetadata.width}x${versionMetadata.height}`,
          aspect_ratio:
            versionMetadata.width && versionMetadata.height
              ? `${versionMetadata.width}:${versionMetadata.height}`
              : 'N/A',
          file_size: `${(processedBuffer.length / 1024).toFixed(1)}KB`,
        };

        console.log(`  ✅ Versión ${sizeName} generada: ${versionUploadResult.secure_url}`);
      } catch (error) {
        console.error(`  ❌ Error procesando ${sizeName}:`, error);
        versions[sizeName] = versions.original;
      }
    }

    console.log('✅ Todas las versiones generadas');

    // ==================== GUARDAR HASH ====================
    const { error: insertHashError } = await supabase.from('image_hashes').insert({
      hash,
      url: uploadResult.secure_url,
      type: uploadResult.resource_type,
      quality_score: qualityScore,
    });

    if (insertHashError) {
      console.error('❌ Error guardando hash:', insertHashError);
    } else {
      console.log('✅ Hash guardado');
    }

    // ==================== GUARDAR MEDIA ====================
    console.log('💾 Guardando imagen en tabla media...');

    const { data: photoData, error: photoError } = await supabase
      .from('media')
      .insert([
        {
          hotel_id: hotelId,
          url: uploadResult.secure_url,

          // ⭐ TAGS NORMALIZADOS
          tags,

          // ⭐ GUARDAMOS RAW TAGS COMO CONFIDENCE SCORES
          confidence_scores: rawTags,

          quality_score: qualityScore,
          hash,
          category,
          scene,

          // ⭐ GUARDAMOS PESOS COMO JSON SEGURO
          scene_weights: sceneWeights,

          versions: JSON.stringify(versions),
        },
      ])
      .select();

    if (photoError) {
      console.error('❌ Error guardando foto:', photoError);
      throw new Error('Error al guardar foto en base de datos');
    }

    console.log('✅ Foto guardada con ID:', photoData?.[0]?.id);

    // ⭐ GENERAR TÍTULO AUTOMÁTICO CON CLIP
    try {
      console.log("🧠 Generando título automático con CLIP...");

      await updateMediaAiTitle(
        photoData[0].id,
        uploadResult.secure_url,
        category,
        tags
      );

      console.log("✅ Título generado y guardado");
    } catch (err) {
      console.error("❌ Error generando título automático:", err);
    }

    return NextResponse.json({
      url: uploadResult.secure_url,
      type: uploadResult.resource_type,
      quality_score: qualityScore,
      is_duplicate: false,
      tags,
      category,
      scene,
      sceneWeights,
      photo_id: photoData?.[0]?.id,
      versions,
    });
  } catch (error) {
    console.error('❌ Error fatal en API:', error);
    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
