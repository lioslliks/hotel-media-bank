// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { createClient } from '@supabase/supabase-js';
import { Buffer } from 'buffer';
import crypto from 'crypto';
import { analyzeImage } from '@/lib/ai';
import { detectCategory } from '@/utils/categoryMap';

// Validación de variables
if (!process.env.CLOUDINARY_CLOUD_NAME) throw new Error('❌ CLOUDINARY_CLOUD_NAME no está definido');
if (!process.env.CLOUDINARY_API_KEY) throw new Error('❌ CLOUDINARY_API_KEY no está definido');
if (!process.env.CLOUDINARY_API_SECRET) throw new Error('❌ CLOUDINARY_API_SECRET no está definido');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cliente Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
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
      fileSize: file?.size
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

    // Convertir a buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    // Hash único
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');
    console.log('🔑 Hash generado:', hash.substring(0, 16));

    // Buscar duplicado
    const { data: existing, error: checkError } = await supabase
      .from('image_hashes')
      .select('url, type, quality_score')
      .eq('hash', hash)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('❌ Error verificando hash:', checkError);
      return NextResponse.json({ error: 'Error verificando duplicados' }, { status: 500 });
    }

    // Si es duplicado → analizar igualmente para obtener tags y categoría
    if (existing) {
      console.log('⚠️ Imagen duplicada detectada');

      const analysis = await analyzeImage(existing.url);
      const tagsArray = analysis.tags.map((t: any) => t.tag);
      const category = detectCategory(tagsArray);

      return NextResponse.json({
        url: existing.url,
        type: existing.type,
        quality_score: existing.quality_score || 0.8,
        is_duplicate: true,
        tags: analysis.tags,
        category,
        message: 'Esta imagen ya existe en tu galería'
      });
    }
    console.log('📤 Subiendo a Cloudinary...');

    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
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
      ).end(buffer);
    });

    console.log('✅ Subida exitosa:', uploadResult.secure_url);
    console.log('🧠 Analizando imagen con ExSabri IA...');
    const analysis = await analyzeImage(uploadResult.secure_url);

    const tagsArray = analysis.tags.map((t: any) => t.tag);
    const category = detectCategory(tagsArray);

    console.log('🏷️ Tags:', tagsArray);
    console.log('📂 Categoría detectada:', category);
    const qualityScore = uploadResult.quality_analysis?.focus || 0.8;

    const { error: insertHashError } = await supabase
      .from('image_hashes')
      .insert({
        hash,
        url: uploadResult.secure_url,
        type: uploadResult.resource_type,
        quality_score: qualityScore
      });

    if (insertHashError) {
      console.error('❌ Error guardando hash:', insertHashError);
    } else {
      console.log('✅ Hash guardado');
    }
    console.log('💾 Guardando imagen en tabla media...');

    const { data: photoData, error: photoError } = await supabase
      .from('media')
      .insert([
        {
          hotel_id: hotelId,
          url: uploadResult.secure_url,
          tags: tagsArray,
          confidence_scores: analysis.tags,
          quality_score: qualityScore,
          hash,
          category
        }
      ])
      .select();

    if (photoError) {
      console.error('❌ Error guardando foto:', photoError);
      throw new Error('Error al guardar foto en base de datos');
    }

    console.log('✅ Foto guardada con ID:', photoData[0].id);
    return NextResponse.json({
      url: uploadResult.secure_url,
      type: uploadResult.resource_type,
      quality_score: qualityScore,
      is_duplicate: false,
      tags: analysis.tags,
      category,
      photo_id: photoData[0].id
    });

  } catch (error) {
    console.error('❌ Error fatal en API:', error);
    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
