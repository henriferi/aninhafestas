import React, { useState, useRef, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Upload } from 'lucide-react';
import axios from 'axios';
import { uploadImageToCloudinary } from '../../lib/uploadImageToCloudinary';
import { getAuthHeaders } from '../../lib/apiHelpers';

interface HeroSlide {
  id: string;
  titulo: string;
  subtitulo: string;
  imagem_url: string;
}

const API_BASE_URL = import.meta.env.VITE_SUPABASE_URL;

const HeroSlidesManager: React.FC = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    titulo: '',
    subtitulo: '',
    imagem_url: '',
  });

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/slides_principais?select=*`,
          { headers: getAuthHeaders(true) }
        );
        setSlides(response.data);
      } catch (error) {
        alert('Erro ao carregar slides');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const imageUrl = await uploadImageToCloudinary(file, 'slides_p');
      setFormData((prev) => ({ ...prev, imagem_url: imageUrl }));
    } catch (error) {
      alert('Erro ao fazer upload da imagem.');
    } finally {
      setUploading(false);
    }
  };

  const formRef = useRef<HTMLDivElement>(null);
  const scrollToForm = () => {
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleCreate = () => {
    setIsCreating(true);
    setFormData({ titulo: '', subtitulo: '', imagem_url: '' });
    scrollToForm();
  };

  const handleEdit = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setFormData({
      titulo: slide.titulo,
      subtitulo: slide.subtitulo,
      imagem_url: slide.imagem_url
    });
    scrollToForm();
  };

  const handleSave = async () => {
    const headers = getAuthHeaders(true);

    try {
      if (isCreating) {
        const response = await axios.post(
          `${API_BASE_URL}/slides_principais?select=*`,
          formData,
          { headers }
        );

        const createdSlide = Array.isArray(response.data) ? response.data[0] : null;

        if (createdSlide && createdSlide.imagem_url) {
          setSlides([...slides, createdSlide]);
        } else {
          console.warn('Slide criado, mas resposta não tem imagem_url. Refazendo fetch...');
          const refetch = await axios.get(
            `${API_BASE_URL}/slides_principais?select=*`,
            { headers }
          );
          setSlides(refetch.data);
        }
      } else if (editingSlide) {
        const response = await axios.patch(
          `${API_BASE_URL}/slides_principais?id=eq.${editingSlide.id}&select=*`,
          formData,
          { headers }
        );

        const updatedSlide = Array.isArray(response.data) ? response.data[0] : null;

        if (updatedSlide) {
          setSlides(slides.map(slide =>
            slide.id === updatedSlide.id ? updatedSlide : slide
          ));
        } else {
          console.warn('Slide não retornado após update. Refazendo fetch...');
          const refetch = await axios.get(
            `${API_BASE_URL}/slides_principais?select=*`,
            { headers }
          );
          setSlides(refetch.data);
        }
      }

      setIsCreating(false);
      setEditingSlide(null);
      setFormData({ titulo: '', subtitulo: '', imagem_url: '' });
    } catch (err) {
      alert('Erro ao salvar slide.');
      console.error(err);
    }
  };


  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este slide?')) return;

    try {
      await axios.delete(
        `${API_BASE_URL}/slides_principais?id=eq.${id}`,
        { headers: getAuthHeaders(true) }
      );
      setSlides(slides.filter(slide => slide.id !== id));
    } catch (error) {
      alert('Erro ao excluir slide');
      console.error(error);
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingSlide(null);
    setFormData({ titulo: '', subtitulo: '', imagem_url: '' });
  };

  if (loading) return <p className="text-gray-500">Carregando slides...</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Gerenciar Slides Principais</h2>
        <button
          onClick={handleCreate}
          className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Slide</span>
        </button>
      </div>

      {(isCreating || editingSlide) && (
        <div ref={formRef} className="bg-white rounded-2xl p-6 shadow-lg border border-pink-200">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Título"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl"
              />
              <textarea
                placeholder="Subtítulo"
                value={formData.subtitulo}
                onChange={(e) => setFormData({ ...formData, subtitulo: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl resize-none"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="file:px-4 file:py-2 file:bg-pink-500 file:text-white rounded-xl"
              />
              {uploading && <p className="text-sm text-gray-500">Enviando imagem...</p>}
            </div>
            <div>
              <div className="relative h-48 bg-gray-100 rounded-xl overflow-hidden">
                {formData.imagem_url ? (
                  <img src={formData.imagem_url} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <Upload className="w-8 h-8" />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex space-x-4 mt-6">
            <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded-xl">
              <Save className="w-4 h-4" /> Salvar
            </button>
            <button onClick={handleCancel} className="bg-gray-500 text-white px-4 py-2 rounded-xl">
              <X className="w-4 h-4" /> Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {slides.map((slide) => (
          <div key={slide.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="relative h-48">
              <img src={slide.imagem_url} alt={slide.titulo} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <div className="text-center text-white p-4">
                  <h4 className="text-lg font-bold mb-1">{slide.titulo}</h4>
                  <p className="text-sm">{slide.subtitulo}</p>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex space-x-2">
                <button onClick={() => handleEdit(slide)} className="flex-1 bg-blue-500 text-white py-2 rounded-xl">
                  <Edit className="w-4 h-4" /> Editar
                </button>
                <button onClick={() => handleDelete(slide.id)} className="flex-1 bg-red-500 text-white py-2 rounded-xl">
                  <Trash2 className="w-4 h-4" /> Excluir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroSlidesManager;
