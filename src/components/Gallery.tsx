'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Gallery() {
  const router = useRouter();

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [hotelId, setHotelId] = useState<string | null>(null);

  // Modal de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<{ id: string; url: string } | null>(null);

  // Obtener hotel_id
  useEffect(() => {
    const getHotelId = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session.session) return router.push('/login');

        const userId = session.session.user.id;

        const { data: org } = await supabase
          .from('organizations')
          .select('id, role')
          .eq('created_by', userId)
          .eq('role', 'hotel')
          .single();

        if (!org) {
          alert('No tienes un hotel asociado');
          return router.push('/dashboard');
        }

        setHotelId(org.id);
      } catch (err) {
        console.error('Error al obtener hotel_id:', err);
        router.push('/login');
      }
    };

    getHotelId();
  }, [router]);

  // Cargar tags
  useEffect(() => {
    const loadTags = async () => {
      try {
        const { data } = await supabase
          .from('media')
          .select('tags')
          .neq('tags', null);

        const setTags = new Set<string>();
        data?.forEach(item => item.tags?.forEach((t: string) => setTags.add(t)));

        setAllTags([...setTags]);
      } catch (err) {
        console.error('Error al cargar tags:', err);
      }
    };

    loadTags();
  }, []);

  // Cargar imágenes
  const loadImages = async () => {
    setLoading(true);

    try {
      let query = supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });

      if (selectedTags.length > 0) {
        query = query.contains('tags', selectedTags);
      }

      const { data, error } = await query;
      if (error) throw error;

      setImages(data || []);
    } catch (err) {
      console.error('Error al cargar imágenes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, [selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

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

    if (!selectedFile || !hotelId) {
      setUploadError('Selecciona una imagen y asegúrate de tener un hotel');
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('hotel_id', hotelId);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al subir imagen');
      }

      setUploadSuccess(true);
      setSelectedFile(null);
      await loadImages();

      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err: any) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  };

  // Abrir modal
  const requestDelete = (id: string, url: string) => {
    setImageToDelete({ id, url });
    setShowDeleteModal(true);
  };

  // Confirmar eliminación
  const confirmDelete = async () => {
    if (!imageToDelete) return;

    try {
      const fileName = imageToDelete.url.split('/').pop();

      await supabase.storage.from('media').remove([fileName!]);
      await supabase.from('media').delete().eq('id', imageToDelete.id);

      await loadImages();
    } catch (err) {
      console.error('Error al eliminar imagen:', err);
    } finally {
      setShowDeleteModal(false);
      setImageToDelete(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* SUBIDA */}
      <div className="mb-8 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Subir Nueva Imagen</h3>
        </div>

        <input
          type="file"
          id="image-upload"
          className="hidden"
          accept="image/jpeg, image/png, image/webp"
          onChange={handleFileChange}
        />

        <label
          htmlFor="image-upload"
          className="w-full cursor-pointer flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:border-blue-400 hover:bg-blue-50 transition-all"
        >
          <span className="text-gray-700 text-sm font-medium">Seleccionar archivo</span>
        </label>

        {selectedFile && (
          <div className="mt-3 flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
            <div>
              <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
              <p className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
            </div>
            <button onClick={() => setSelectedFile(null)} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploading || !hotelId}
          className={`w-full mt-4 py-3.5 rounded-xl text-white font-medium transition-all ${
            !selectedFile || uploading || !hotelId
              ? 'bg-blue-500 opacity-50 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 hover:shadow-md'
          }`}
        >
          {uploading ? 'Procesando...' : 'Subir y Analizar con IA'}
        </button>
      </div>

      {/* FILTROS */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Filtrar por:</h3>
        <div className="flex flex-wrap gap-2">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedTags.includes(tag)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
        {selectedTags.length > 0 && (
          <button onClick={() => setSelectedTags([])} className="mt-2 text-sm text-blue-600 hover:underline">
            Limpiar filtros
          </button>
        )}
      </div>

      {/* GALERÍA */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {selectedTags.length > 0
            ? 'No se encontraron imágenes con estos tags'
            : 'No hay imágenes disponibles. ¡Sube tu primera imagen!'}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map(img => (
            <div
              key={img.id}
              className="border rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition group"
            >
              <div className="relative pt-[66.67%]">
                <img
                  src={img.url}
                  alt={img.tags?.join(',') || 'Imagen del hotel'}
                  className="absolute top-0 left-0 w-full h-full object-cover"
                />
                {/* X solo al pasar el cursor */}
                <button
                  onClick={() => requestDelete(img.id, img.url)}
                  className="absolute top-2 right-2 bg-white/90 text-red-600 rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 hover:text-white shadow"
                >
                  ✕
                </button>
              </div>
              <div className="p-3 bg-gray-50">
                <div className="flex flex-wrap gap-1 mb-2">
                  {img.tags?.map((tag: string) => (
                    <span key={tag} className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                {img.quality_score && (
                  <div className="text-xs text-gray-500">
                    Calidad: {(img.quality_score * 100).toFixed(0)}%
                  </div>
                )}
              </div>
            </div>
          ))}
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

      <div
        onClick={() => (window.location.href = '/dashboard')}
        className="px-4 py-3.5 rounded-lg cursor-pointer font-medium text-sm transition-all text-white/80 hover:bg-white/10 flex items-center gap-2 mt-8"
      >
        <span className="text-lg">←</span>
        <span>Volver al Dashboard</span>
      </div>
    </div>
  );
}