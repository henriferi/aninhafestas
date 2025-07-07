import React, { useState, useRef, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Upload } from 'lucide-react';
import axios from 'axios';
import { uploadImageToCloudinary } from '../../lib/uploadImageToCloudinary';
import { getAuthHeaders } from '../../lib/apiHelpers';
import { useToast } from '../../hooks/useToast';
import Loading from '../ui/Loading';
import LoadingSpinner from '../ui/LoadingSpinner';
import PageLoading from '../ui/PageLoading';

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
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const { success, error, warning } = useToast();

  const [formData, setFormData] = useState({
    titulo: '',
    subtitulo: '',
    imagem_url: '',
  });

  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/slides_principais?select=*`,
          { headers: getAuthHeaders(true) }
        );
        setSlides(response.data);
        success('Slides carregados', 'Dados carregados com sucesso!');
      } catch (err) {
        error('Erro ao carregar slides', 'Não foi possível carregar os slides principais.');
        console.error(err);
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
      success('Upload concluído', 'Imagem enviada com sucesso!');
    } catch (err) {
      error('Erro no upload', 'Não foi possível enviar a imagem.');
    } finally {
      setUploading(false);
    }
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
    if (!formData.titulo.trim() || !formData.subtitulo.trim() || !formData.imagem_url.trim()) {
      warning('Campos obrigatórios', 'Preencha todos os campos antes de salvar.');
      return;
    }

    setSaving(true);
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
          success('Slide criado', 'Novo slide adicionado com sucesso!');
        } else {
          console.warn('Slide criado, mas resposta não tem imagem_url. Refazendo fetch...');
          const refetch = await axios.get(
            `${API_BASE_URL}/slides_principais?select=*`,
            { headers }
          );
          setSlides(refetch.data);
          success('Slide criado', 'Novo slide adicionado com sucesso!');
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
          success('Slide atualizado', 'Alterações salvas com sucesso!');
        } else {
          console.warn('Slide não retornado após update. Refazendo fetch...');
          const refetch = await axios.get(
            `${API_BASE_URL}/slides_principais?select=*`,
            { headers }
          );
          setSlides(refetch.data);
          success('Slide atualizado', 'Alterações salvas com sucesso!');
        }
      }

      setIsCreating(false);
      setEditingSlide(null);
      setFormData({ titulo: '', subtitulo: '', imagem_url: '' });
    } catch (err) {
      error('Erro ao salvar', 'Não foi possível salvar o slide.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);

    try {
      await axios.delete(
        `${API_BASE_URL}/slides_principais?id=eq.${id}`,
        { headers: getAuthHeaders(true) }
      );
      setSlides(slides.filter(slide => slide.id !== id));
      success('Slide excluído', 'Slide removido com sucesso!');
    } catch (err) {
      error('Erro ao excluir', 'Não foi possível excluir o slide.');
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingSlide(null);
    setFormData({ titulo: '', subtitulo: '', imagem_url: '' });
  };

  if (loading) return <PageLoading text="Carregando slides..." />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Gerenciar Slides Principais</h2>
        <button
          onClick={handleCreate}
          disabled={saving}
          className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Slide</span>
        </button>
      </div>

      {(isCreating || editingSlide) && (
        <div ref={formRef} className="bg-white rounded-2xl p-6 shadow-lg border border-pink-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {isCreating ? 'Criar Novo Slide' : 'Editar Slide'}
            </h3>
            <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                <input
                  type="text"
                  placeholder="Título do slide"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subtítulo</label>
                <textarea
                  placeholder="Subtítulo do slide"
                  value={formData.subtitulo}
                  onChange={(e) => setFormData({ ...formData, subtitulo: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Imagem</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100 disabled:opacity-50"
                />
                {uploading && (
                  <div className="flex items-center space-x-2 mt-2">
                    <LoadingSpinner size="sm" />
                    <span className="text-sm text-gray-500">Enviando imagem...</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
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
            <button
              onClick={handleSave}
              disabled={saving || uploading}
              className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition-all disabled:opacity-50"
            >
              {saving ? <LoadingSpinner size="sm" color="gray" /> : <Save className="w-4 h-4" />}
              <span>{saving ? 'Salvando...' : 'Salvar'}</span>
            </button>
            <button
              onClick={handleCancel}
              disabled={saving}
              className="flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-xl hover:bg-gray-600 transition-all disabled:opacity-50"
            >
              <X className="w-4 h-4" />
              <span>Cancelar</span>
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
                <button
                  onClick={() => handleEdit(slide)}
                  disabled={saving || deleting === slide.id}
                  className="flex-1 flex items-center justify-center space-x-2 bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition-all disabled:opacity-50"
                >
                  <Edit className="w-4 h-4" />
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => handleDelete(slide.id)}
                  disabled={saving || deleting === slide.id}
                  className="flex-1 flex items-center justify-center space-x-2 bg-red-500 text-white py-2 rounded-xl hover:bg-red-600 transition-all disabled:opacity-50"
                >
                  {deleting === slide.id ? (
                    <LoadingSpinner size="sm" color="gray" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  <span>{deleting === slide.id ? 'Excluindo...' : 'Excluir'}</span>
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