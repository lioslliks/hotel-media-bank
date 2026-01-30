// src/app/api/upload/route.ts
import { NextRequest } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configuración segura: verifica que las variables existan
if (!process.env.CLOUDINARY_CLOUD_NAME) {
  throw new Error('❌ CLOUDINARY_CLOUD_NAME no está definido en .env.local');
}
if (!process.env.CLOUDINARY_API_KEY) {
  throw new Error('❌ CLOUDINARY_API_KEY no está definido en .env.local');
}
if (!process.env.CLOUDINARY_API_SECRET) {
  throw new Error('❌ CLOUDINARY_API_SECRET no está definido en .env.local');
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    // Parsear formulario
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    // Validar archivo
    if (!file || !(file instanceof File)) {
      return new Response(JSON.stringify({ error: 'No se proporcionó un archivo válido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Convertir a Buffer (compatible con Edge Runtime)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Subir a Cloudinary (SIN categorización de pago)
    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'hotel-media',
          resource_type: 'auto', // Detecta imagen/video automáticamente
          invalidate: true,      // Actualiza CDN inmediatamente
          // 👇 REMOVIDO: categorization y auto_tagging (requieren plan pago)
          quality_analysis: true, // ✅ Esto SÍ funciona en plan gratuito
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(buffer);
    });

    // Respuesta exitosa (sin tags, ya que no están disponibles)
    return new Response(JSON.stringify({
      url: result.secure_url,
      type: result.resource_type,
      public_id: result.public_id,
      // tags: result.tags || [],              // ❌ Eliminado (no disponible)
      quality_score: result.quality_analysis?.focus || 0, // ✅ Solo calidad
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error en la API de subida:', error);
    
    // Manejar diferentes tipos de errores
    let errorMessage = 'Error desconocido al subir el archivo';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    return new Response(JSON.stringify({
      error: 'Fallo en la subida',
      details: errorMessage,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}