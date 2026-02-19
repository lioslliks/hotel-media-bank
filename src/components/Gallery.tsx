'use client';

import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { QualityBadge } from "@/components/ui/QualityBadge"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/* ============================
   CONFIG
============================ */
type TagObj = { label: string; score: number };

const MIN_SCORE = 0.6;

const CATEGORY_TAG_MAP: Record<string, string[]> = {
  exterior: ['exterior', 'garden', 'parking', 'terrace', 'balcony', 'view', 'facade'],
  habitaciones: [
    'hotel room',
    'family room',
    'suite',
    'double room',
    'single room',
    'king bed',
    'queen bed',
    'bedroom'
  ],
  interior: ['bathroom', 'corridor', 'hallway', 'interior'],
  salas_comunes: ['lobby', 'reception', 'hall', 'common area', 'breakfast area'],
  restaurante: ['restaurant', 'bar'],
  piscina: ['swimming pool', 'pool'],
  spa: ['spa', 'gym'],
  otros: []
};

const CATEGORY_LABELS: Record<string, string> = {
  exterior: 'Exterior',
  habitaciones: 'Habitaciones',
  interior: 'Interior',
  salas_comunes: 'Salas comunes',
  restaurante: 'Restaurante',
  piscina: 'Piscina',
  spa: 'Spa',
  otros: 'Otros'
};

const CATEGORY_BUTTONS: Array<{ label: string; value: string | null }> = [
  { label: 'Todas', value: null },
  { label: 'Exterior', value: 'exterior' },
  { label: 'Habitaciones', value: 'habitaciones' },
  { label: 'Interior', value: 'interior' },
  { label: 'Salas comunes', value: 'salas_comunes' },
  { label: 'Restaurante', value: 'restaurante' },
  { label: 'Piscina', value: 'piscina' },
  { label: 'Spa', value: 'spa' },
  { label: 'Otros', value: 'otros' }
];

const qualityLabel = (score?: number) => {
  if (typeof score !== 'number') return 'Media';
  if (score >= 0.85) return 'Alta';
  if (score >= 0.65) return 'Media';
  return 'Baja';
};

const norm = (s: string) => (s ?? '').toString().trim().toLowerCase();

const looksLikeJson = (s: string) => {
  const t = s.trim();
  return (t.startsWith('{') && t.endsWith('}')) || (t.startsWith('[') && t.endsWith(']'));
};

export default function Gallery({
  media = [],
  hotelId: propHotelId,
  onMediaChange = () => {}
}: {
  media?: any[];
  hotelId?: string;
  onMediaChange?: () => void;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<{ id: string; url: string } | null>(null);

  const [localHotelId, setLocalHotelId] = useState<string | null>(null);

  useEffect(() => {
    if (propHotelId) setLocalHotelId(propHotelId);
  }, [propHotelId]);

  const normalizeTags = (raw: any): TagObj[] => {
    if (!raw) return [];
    if (typeof raw === 'string') {
      try {
        return normalizeTags(JSON.parse(raw));
      } catch {
        return [];
      }
    }
    if (Array.isArray(raw)) {
      if (raw.length > 0 && typeof raw[0] === 'string') {
        const out: TagObj[] = [];
        for (const s of raw as string[]) {
          const str = (s ?? '').toString().trim();
          if (!str) continue;
          if (looksLikeJson(str)) {
            try {
              const parsed = JSON.parse(str);
              if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                const label = norm(parsed.label ?? parsed.tag ?? '');
                if (!label) continue;
                const score = typeof parsed.score === 'number' ? parsed.score : typeof parsed.confidence === 'number' ? parsed.confidence : 1;
                out.push({ label, score });
                continue;
              }
              if (Array.isArray(parsed)) {
                out.push(...normalizeTags(parsed));
                continue;
              }
            } catch {
              // fallthrough
            }
          }
          out.push({ label: norm(str), score: 1 });
        }
        return out.filter(t => t.label);
      }
      if (raw.length > 0 && typeof raw[0] === 'object') {
        return (raw as any[])
          .map(t => {
            const label = norm(typeof t?.label === 'string' ? t.label : typeof t?.tag === 'string' ? t.tag : '');
            if (!label) return null;
            const score = typeof t?.score === 'number' ? t.score : typeof t?.confidence === 'number' ? t.confidence : 1;
            return { label, score };
          })
          .filter(Boolean) as TagObj[];
      }
    }
    return [];
  };

  const getDisplayCategory = (img: any) => {
    const backendCategory = norm(img?.category);
    if (backendCategory && backendCategory !== 'otros') return backendCategory;
    const tags: TagObj[] = img?.tagsNormalized || [];
    if (!tags.length) return 'otros';
    let bestCategory: string | null = null;
    let bestScore = -1;
    for (const [category, labels] of Object.entries(CATEGORY_TAG_MAP)) {
      if (category === 'otros') continue;
      const allowed = labels.map(norm);
      const score = Math.max(...tags.filter(t => allowed.includes(norm(t.label))).map(t => t.score), -1);
      if (score > bestScore) {
        bestScore = score;
        bestCategory = category;
      }
    }
    return bestCategory || 'otros';
  };

  const parsedMedia = useMemo(() => {
    return (media || []).map(item => {
      let versions = item?.versions;
      if (versions && typeof versions === 'string') {
        try {
          versions = JSON.parse(versions);
        } catch {
          // keep as-is
        }
      }
      const rawTags = item?.tags ?? item?.confidence_scores ?? item?.confidenceScores;
      return {
        ...item,
        versions,
        tagsNormalized: normalizeTags(rawTags),
        ai_title: item?.ai_title || item?.title
      };
    });
  }, [media]);

  const sortedMedia = useMemo(() => {
    return [...parsedMedia].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return dateB - dateA;
    });
  }, [parsedMedia]);

  const filteredImages = useMemo(() => {
    if (!selectedCategory) return sortedMedia;
    return sortedMedia.filter(img => {
      const category = getDisplayCategory(img);
      return category === selectedCategory;
    });
  }, [sortedMedia, selectedCategory]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Solo se permiten imágenes');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('La imagen es demasiado grande (max. 5MB)');
      return;
    }
    setSelectedFile(file);
    setUploadError(null);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !localHotelId) {
      setUploadError('Selecciona una imagen y asegúrate de tener un hotel');
      return;
    }
    setUploading(true);
    setUploadError(null);
    setUploadSuccess(false);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('hotel_id', localHotelId);
      const response = await fetch('/api/upload', { method: 'POST', body: formData });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Error al subir imagen');
      setUploadSuccess(true);
      setSelectedFile(null);
      setTimeout(() => setUploadSuccess(false), 1500);
      onMediaChange();
    } catch (err: any) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const requestDelete = (id: string, url: string) => {
    setImageToDelete({ id, url });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!imageToDelete) return;
    try {
      const fileName = imageToDelete.url.split('/').pop();
      await supabase.storage.from('media').remove([fileName!]);
      await supabase.from('media').delete().eq('id', imageToDelete.id);
      onMediaChange();
    } catch (err) {
      console.error('Error al eliminar imagen:', err);
      alert('Error al eliminar la imagen. Inténtalo de nuevo.');
    } finally {
      setShowDeleteModal(false);
      setImageToDelete(null);
    }
  };

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error al descargar la imagen:', error);
      alert('Error al descargar la imagen. Inténtalo de nuevo.');
    }
  };

  const renderDownloadTable = (versions: any) => {
    if (!versions) return null;
    const originalDimensions = versions.original?.dimensions;
    let originalWidth = 0;
    let originalHeight = 0;
    if (originalDimensions) {
      const [w, h] = originalDimensions.split('x').map(Number);
      originalWidth = w;
      originalHeight = h;
    }
    const validVersions = Object.entries(versions)
      .filter(([size, details]: [string, any]) => {
        if (size === 'original') return true;
        if (!details?.dimensions) return false;
        const [w, h] = details.dimensions.split('x').map(Number);
        return w <= originalWidth && h <= originalHeight;
      })
      .sort((a, b) => {
        const order = ['thumbnail', 'small', 'medium', 'large', 'original'];
        return order.indexOf(a[0]) - order.indexOf(b[0]);
      });
    return (
      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Opciones de descarga</h4>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                    Descripción
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                    Dimensiones
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                    Relación
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {validVersions.map(([size, details]: [string, any]) => (
                  <tr key={size} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 truncate">
                      {size === 'thumbnail' ? 'Miniatura' : 
                       size === 'small' ? 'Pequeño' : 
                       size === 'medium' ? 'Mediano' : 
                       size === 'large' ? 'Grande' : 'Original'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 truncate">
                      {details.dimensions}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 truncate">
                      {details.aspect_ratio}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        {/* ✅ BOTÓN DE DESCARGA CON ICONO ELEGANTE */}
                        <button
                          onClick={() => handleDownload(details.url, `${size}-${Date.now()}.jpg`)}
                          className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors shadow-sm hover:shadow-md"
                          title="Descargar"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </button>
                        
                        {/* ✅ BOTÓN DE VER CON ICONO ELEGANTE */}
                        <a
                          href={details.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors shadow-sm hover:shadow"
                          title="Ver imagen"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* SECCIÓN DE SUBIDA */}
      <div className="mb-8 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Subir Nueva Imagen</h3>
        </div>
        <input type="file" id="image-upload" className="hidden" accept="image/jpeg, image/png, image/webp" onChange={handleFileChange} />
        <label htmlFor="image-upload" className="w-full cursor-pointer flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:border-gray-400 transition">
          <span className="text-gray-700 text-sm font-medium">Seleccionar archivo</span>
        </label>
        {selectedFile && (
          <div className="mt-3 flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
            <div>
              <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
              <p className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
            </div>
            <button onClick={() => setSelectedFile(null)} className="text-gray-400 hover:text-gray-600">×</button>
          </div>
        )}
        {uploadError && <div className="mt-3 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{uploadError}</div>}
        {uploadSuccess && <div className="mt-3 p-3 bg-green-50 text-green-600 text-sm rounded-lg">¡Imagen subida y analizada con éxito!</div>}
        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploading || !localHotelId}
          className={`w-full mt-4 py-3.5 rounded-xl text-white font-medium transition-all ${
            !selectedFile || uploading || !localHotelId ? 'bg-blue-500 opacity-50 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 hover:shadow-md'
          }`}
        >
          {uploading ? 'Procesando...' : 'Subir y Analizar con IA'}
        </button>
      </div>

      {/* CATEGORÍAS */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {CATEGORY_BUTTONS.map(cat => {
            const isActive = selectedCategory === cat.value || (cat.value === null && selectedCategory === null);
            return (
              <button
                key={cat.label}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition border ${
                  isActive ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* GALERÍA */}
      {filteredImages.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {selectedCategory ? 'No hay imágenes para esta categoría' : 'No hay imágenes disponibles. ¡Sube tu primera imagen!'}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredImages.map(img => {
            const displayCategory = getDisplayCategory(img);
            return (
              <div
                key={img.id}
                className="relative rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition group cursor-pointer"
                onClick={() => setSelectedImage(img)}
              >
                <div className="relative">
                  {img.type === "video" ? (
                    <div className="w-full h-64 bg-gray-900 flex items-center justify-center text-white text-3xl">▶</div>
                  ) : (
                    <img
                      src={img.url}
                      alt="Imagen del hotel"
                      className="w-full h-64 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/400x300?text=Imagen+no+disponible";
                      }}
                    />
                  )}
                  {/* ✅ BOTÓN DE ELIMINAR RESTAURADO - EN LA ESQUINA SUPERIOR DERECHA */}
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      requestDelete(img.id, img.url);
                    }}
                    className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-500 hover:bg-opacity-90 hover:scale-105"
                    title="Eliminar imagen"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <div 
                  className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-white/95 to-white/80 p-4"
                  style={{
                    transition: 'all 1200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                    height: hoveredCard === img.id ? '160px' : '56px',
                    overflow: 'hidden',
                  }}
                  onMouseEnter={() => setHoveredCard(img.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <h3 className="text-sm font-semibold text-gray-900 leading-snug">
                    {img.ai_title?.trim() ? img.ai_title : "Imagen del hotel"}
                  </h3>
                  {hoveredCard === img.id && (
                    <div 
                      className="mt-3 text-xs text-gray-700 space-y-1.5"
                      style={{
                        transition: 'opacity 800ms ease-out, transform 800ms ease-out',
                        transform: hoveredCard === img.id ? 'translateY(0)' : 'translateY(10px)',
                        opacity: hoveredCard === img.id ? 1 : 0,
                      }}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-blue-600">🏷️</span>
                        <span>{CATEGORY_LABELS[displayCategory] || "N/A"}</span>
                      </div>
                      {img.tagsNormalized && img.tagsNormalized.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {img.tagsNormalized.slice(0, 3).map((tag: TagObj, i: number) => (
                            <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-[11px] font-medium">
                              {tag.label}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-blue-600">📅</span>
                        <span>{img.created_at ? new Date(img.created_at).toLocaleDateString() : "Fecha no disponible"}</span>
                      </div>
                      {img.ai_quality && ( <QualityBadge quality={img.ai_quality} /> )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL DE ELIMINACIÓN */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Eliminar imagen</h3>
            <p className="text-sm text-gray-600 mb-4">
              ¿Estás seguro de que quieres eliminar esta imagen?
              <br />
              <span className="text-red-600 font-semibold">Esta acción no se puede deshacer.</span>
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setImageToDelete(null);
                }}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 shadow-sm hover:shadow-md"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE DESCARGAS */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">Detalles de la imagen</h3>
                <button onClick={() => setSelectedImage(null)} className="text-gray-500 hover:text-gray-700">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/2">
                  <div className="aspect-w-16 aspect-h-9 mb-4">
                    <img src={selectedImage.url} alt="Selected" className="w-full h-full object-contain rounded-lg" />
                  </div>
                </div>
                <div className="md:w-1/2">{renderDownloadTable(selectedImage.versions)}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}