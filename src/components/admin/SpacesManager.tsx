import React, { useState, useRef, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Upload } from 'lucide-react';
import axios from 'axios';
import { getAuthHeaders, getUserId } from '../../lib/apiHelpers';
import { uploadImageToCloudinary } from '../../lib/uploadImageToCloudinary';

interface Space {
  id: string;
  user_id: string;
  titulo: string;
  descricao: string;
  imagem: string;
  caracteristicas: string[];
}

const API_BASE_URL = import.meta.env.VITE_SUPABASE_URL;
const userId = getUserId();

const SpacesManager: React.FC = () => {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [editingSpace, setEditingSpace] = useState<Space | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    imagem: '',
    caracteristicas: [''],
  });

  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const fetchSpaces = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/nosso_espaco?select=*`, {
        headers: getAuthHeaders(true),
      });
      const sanitized = res.data.map((item: any) => ({
        ...item,
        caracteristicas: Array.isArray(item.caracteristicas) ? item.caracteristicas : [],
      }));
      setSpaces(sanitized);

    } catch (err) {
      alert('Erro ao carregar espaços');
      console.error(err);
    }
  };
  useEffect(() => {
    fetchSpaces();
  }, []);

  const handleCreate = () => {
    setIsCreating(true);
    setFormData({ titulo: '', descricao: '', imagem: '', caracteristicas: [''] });
    scrollToForm();
  };

  const handleEdit = (space: Space) => {
    setEditingSpace(space);
    setFormData({
      titulo: space.titulo,
      descricao: space.descricao,
      imagem: space.imagem,
      caracteristicas: space.caracteristicas,
    });
    scrollToForm();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImageToCloudinary(file, 'nosso_espaco');
      setFormData(prev => ({ ...prev, imagem: url }));
    } catch (err) {
      alert('Erro ao enviar imagem');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const addFeature = () => {
    setFormData(prev => ({ ...prev, caracteristicas: [...prev.caracteristicas, ''] }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      caracteristicas: prev.caracteristicas.filter((_, i) => i !== index),
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      caracteristicas: prev.caracteristicas.map((f, i) => (i === index ? value : f)),
    }));
  };

  const handleSave = async () => {
    const headers = getAuthHeaders(true);
    const payload = {
      user_id: userId,
      titulo: formData.titulo,
      descricao: formData.descricao,
      imagem: formData.imagem,
      caracteristicas: formData.caracteristicas.filter(f => f.trim() !== ''),
    };

    try {
      if (isCreating) {
        const res = await axios.post(
          `${API_BASE_URL}/nosso_espaco?select=*`,
          payload,
          { headers }
        );
        // Supabase retorna array
        const created = Array.isArray(res.data) ? res.data[0] : res.data;
        const safeCreated = {
          ...created,
          caracteristicas: Array.isArray(created.caracteristicas) ? created.caracteristicas : [],
        };
        setSpaces(prev => [...prev, safeCreated]);
        setSpaces(prev => [...prev, created]);
      } else if (editingSpace) {
        const res = await axios.patch(
          `${API_BASE_URL}/nosso_espaco?id=eq.${editingSpace.id}&select=*`,
          payload,
          { headers }
        );
        const updated = Array.isArray(res.data) ? res.data[0] : res.data;
        setSpaces(prev =>
          prev.map(s => (s.id === updated.id ? updated : s))
        );
      }
      await fetchSpaces();

      setIsCreating(false);
      setEditingSpace(null);
      setFormData({ titulo: '', descricao: '', imagem: '', caracteristicas: [''] });
    } catch (err) {
      alert('Erro ao salvar espaço');
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este espaço?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/nosso_espaco?id=eq.${id}`, {
        headers: getAuthHeaders(true),
      });
      setSpaces(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      alert('Erro ao excluir espaço');
      console.error(err);
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingSpace(null);
    setFormData({ titulo: '', descricao: '', imagem: '', caracteristicas: [''] });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Gerenciar Nossos Espaços</h2>
        <button
          onClick={handleCreate}
          className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Espaço</span>
        </button>
      </div>

      {/* Form */}
      {(isCreating || editingSpace) && (
        <div ref={formRef} className="bg-white rounded-2xl p-6 shadow-lg border border-pink-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {isCreating ? 'Criar Novo Espaço' : 'Editar Espaço'}
            </h3>
            <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={e => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Nome do espaço"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                <textarea
                  value={formData.descricao}
                  onChange={e => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                  placeholder="Descrição detalhada do espaço"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Imagem</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                />
                {uploading && <p className="text-sm text-gray-500 mt-2">Enviando imagem…</p>}
                {formData.imagem && (
                  <img src={formData.imagem} alt="Preview" className="mt-2 w-full h-48 object-cover rounded-xl" />
                )}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Características</label>
              {formData.caracteristicas.map((feature, i) => (
                <div key={i} className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={e => updateFeature(i, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Característica do espaço"
                  />
                  <button
                    onClick={() => removeFeature(i)}
                    className="px-3 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
                    type="button"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <button
                onClick={addFeature}
                className="text-pink-600 hover:text-pink-700 text-sm font-medium"
                type="button"
              >
                + Adicionar Característica
              </button>
            </div>
          </div>

          <div className="flex space-x-4 mt-6">
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition-all"
              type="button"
            >
              <Save className="w-4 h-4" />
              <span>Salvar</span>
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-xl hover:bg-gray-600 transition-all"
              type="button"
            >
              <X className="w-4 h-4" />
              <span>Cancelar</span>
            </button>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {spaces.map(space => {
          return (
            <div key={space.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="relative h-48">
                <img src={space.imagem} alt={space.titulo} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{space.titulo}</h3>
                <p className="text-gray-600 text-sm mb-4">{space.descricao}</p>
                <div className="space-y-1 mb-4">
                  {(Array.isArray(space.caracteristicas) ? space.caracteristicas : []).slice(0, 3).map((f, index) => (
                    <div key={`${space.id}-feature-${index}`} className="flex items-center space-x-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      <span>{f}</span>
                    </div>
                  ))}

                  {Array.isArray(space.caracteristicas) && space.caracteristicas.length > 3 && (
                    <div className="text-pink-600 text-xs">
                      + {space.caracteristicas.length - 3} mais
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(space)}
                    className="flex-1 flex items-center justify-center space-x-2 bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition-all"
                  >
                    <Edit className="w-4 h-4" /> <span>Editar</span>
                  </button>
                  <button
                    onClick={() => handleDelete(space.id)}
                    className="flex-1 flex items-center justify-center space-x-2 bg-red-500 text-white py-2 rounded-xl hover:bg-red-600 transition-all"
                  >
                    <Trash2 className="w-4 h-4" /> <span>Excluir</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SpacesManager;