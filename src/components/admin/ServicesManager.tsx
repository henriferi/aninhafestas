import React, { useState, useRef, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Star, Upload } from 'lucide-react';
import axios from 'axios';
import { getAuthHeaders } from '../../lib/apiHelpers';
import { uploadImageToCloudinary } from '../../lib/uploadImageToCloudinary';
import { getUserId } from '../../lib/apiHelpers';


const API_BASE_URL = import.meta.env.VITE_SUPABASE_URL;
const user_id = getUserId();


interface Service {
  id: string;
  user_id?: string;
  titulo: string;
  subtitulo: string;
  descricao: string;
  preco: string;
  categoria: 'infantil' | 'adulto' | 'corporativo';
  imagem_principal: string;
  galeria: string[];
  caracteristicas: string[];
  popular: boolean;
}

const ServicesManager: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    titulo: '',
    subtitulo: '',
    descricao: '',
    preco: '',
    categoria: 'infantil' as 'infantil' | 'adulto' | 'corporativo',
    imagem_principal: '',
    galeria: [''],
    caracteristicas: [''],
    popular: false,
  });

  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const fetchServices = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/servicos?select=*`, {
        headers: getAuthHeaders(true),
      });
      setServices(res.data);
    } catch (err) {
      alert('Erro ao carregar serviços');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleCreate = () => {
    setIsCreating(true);
    setFormData({
      titulo: '',
      subtitulo: '',
      descricao: '',
      preco: '',
      categoria: 'infantil',
      imagem_principal: '',
      galeria: [''],
      caracteristicas: [''],
      popular: false,
    });
    scrollToForm();
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      titulo: service.titulo,
      subtitulo: service.subtitulo,
      descricao: service.descricao,
      preco: service.preco,
      categoria: service.categoria,
      imagem_principal: service.imagem_principal,
      galeria: service.galeria,
      caracteristicas: service.caracteristicas,
      popular: service.popular || false,
    });
    scrollToForm();
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImageToCloudinary(file, 'servicos_principal');
      setFormData((prev) => ({ ...prev, imagem_principal: url }));
    } catch (error) {
      alert('Erro ao enviar imagem principal');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleGalleryImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImageToCloudinary(file, 'servicos_galeria');
      setFormData((prev) => ({
        ...prev,
        galeria: prev.galeria.map((img, i) => (i === index ? url : img)),
      }));
    } catch (error) {
      alert('Erro ao enviar imagem da galeria');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    const headers = getAuthHeaders(true);
    const user_id = getUserId();

    const payload = {
      ...formData,
      galeria: formData.galeria.filter((g) => g.trim() !== ''),
      caracteristicas: formData.caracteristicas.filter((c) => c.trim() !== ''),
      user_id,
    };

    try {
      if (isCreating) {
        const res = await axios.post(`${API_BASE_URL}/servicos?select=*`, payload, { headers });

        const created = Array.isArray(res.data) ? res.data[0] : res.data;

        if (created) setServices(prev => [...prev, created]);
      } else if (editingService) {
        const res = await axios.patch(
          `${API_BASE_URL}/servicos?id=eq.${editingService.id}&select=*`,
          payload,
          { headers }
        );

        const updated = Array.isArray(res.data) ? res.data[0] : res.data;

        if (updated) {
          setServices((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
        }
      }

      await fetchServices();

      setIsCreating(false);
      setEditingService(null);
      setFormData({
        titulo: '',
        subtitulo: '',
        descricao: '',
        preco: '',
        categoria: 'infantil',
        imagem_principal: '',
        galeria: [''],
        caracteristicas: [''],
        popular: false,
      });
    } catch (err) {
      alert('Erro ao salvar serviço');
      console.error(err);
    }
  };


  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este serviço?')) return;

    try {
      await axios.delete(`${API_BASE_URL}/servicos?id=eq.${id}`, {
        headers: getAuthHeaders(true),
      });
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert('Erro ao excluir serviço');
      console.error(err);
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingService(null);
  };

  const addGalleryImage = () => {
    setFormData((prev) => ({ ...prev, galeria: [...prev.galeria, ''] }));
  };

  const removeGalleryImage = (index: number) => {
    setFormData((prev) => ({ ...prev, galeria: prev.galeria.filter((_, i) => i !== index) }));
  };

  const updateGalleryImage = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      galeria: prev.galeria.map((img, i) => (i === index ? value : img)),
    }));
  };

  const addFeature = () => {
    setFormData((prev) => ({ ...prev, caracteristicas: [...prev.caracteristicas, ''] }));
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      caracteristicas: prev.caracteristicas.filter((_, i) => i !== index),
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      caracteristicas: prev.caracteristicas.map((f, i) => (i === index ? value : f)),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Gerenciar Serviços</h2>
        <button
          onClick={handleCreate}
          className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Serviço</span>
        </button>
      </div>

      {(isCreating || editingService) && (
        <div
          ref={formRef}
          className="bg-white rounded-2xl p-6 shadow-lg border border-pink-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {isCreating ? 'Criar Novo Serviço' : 'Editar Serviço'}
            </h3>
            <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título
                </label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, titulo: e.target.value }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtítulo
                </label>
                <input
                  type="text"
                  value={formData.subtitulo}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, subtitulo: e.target.value }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, descricao: e.target.value }))
                  }
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preço
                  </label>
                  <input
                    type="text"
                    value={formData.preco}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, preco: e.target.value }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Ex: A partir de R$ 1.200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria
                  </label>
                  <select
                    value={formData.categoria}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        categoria: e.target.value as
                          | 'infantil'
                          | 'adulto'
                          | 'corporativo',
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="infantil">Infantil</option>
                    <option value="adulto">Adulto</option>
                    <option value="corporativo">Corporativo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imagem Principal
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleMainImageUpload}
                  className="file:px-4 file:py-2 file:bg-pink-500 file:text-white rounded-xl"
                />
                {uploading && <p className="text-sm text-gray-500">Enviando imagem...</p>}
                {formData.imagem_principal && (
                  <img
                    src={formData.imagem_principal}
                    alt="Imagem Principal"
                    className="mt-2 w-full h-48 object-cover rounded-xl"
                  />
                )}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="popular"
                  checked={formData.popular}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, popular: e.target.checked }))
                  }
                  className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                />
                <label htmlFor="popular" className="text-sm font-medium text-gray-700">
                  Marcar como Popular
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Galeria de Imagens
                </label>
                {formData.galeria.map((image, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="url"
                      value={image}
                      onChange={(e) => updateGalleryImage(index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="URL da imagem"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleGalleryImageUpload(e, index)}
                      className="file:px-2 file:py-1 file:bg-pink-500 file:text-white rounded-xl"
                    />
                    <button
                      onClick={() => removeGalleryImage(index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
                      type="button"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addGalleryImage}
                  className="text-pink-600 hover:text-pink-700 text-sm font-medium"
                  type="button"
                >
                  + Adicionar Imagem
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Características
                </label>
                {formData.caracteristicas.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="Característica do serviço"
                    />
                    <button
                      onClick={() => removeFeature(index)}
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

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="relative h-48">
              <img
                src={service.imagem_principal}
                alt={service.titulo}
                className="w-full h-full object-cover"
              />
              {service.popular && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                  <Star className="w-4 h-4" />
                  <span>Popular</span>
                </div>
              )}
              <div
                className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${service.categoria === 'infantil'
                  ? 'bg-pink-100 text-pink-800'
                  : service.categoria === 'adulto'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-blue-100 text-blue-800'
                  }`}
              >
                {service.categoria === 'infantil'
                  ? 'Infantil'
                  : service.categoria === 'adulto'
                    ? 'Adulto'
                    : 'Corporativo'}
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-800 mb-1">{service.titulo}</h3>
              <p className="text-gray-600 text-sm mb-2">{service.subtitulo}</p>
              <p className="text-lg font-bold text-gray-800 mb-4">{service.preco}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {service.caracteristicas.map((feature, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full bg-pink-100 text-pink-800 text-xs font-semibold"
                  >
                    {feature}
                  </span>
                ))}
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => handleEdit(service)}
                  className="p-2 rounded-xl bg-yellow-300 hover:bg-yellow-400 transition-all"
                  title="Editar"
                >
                  <Edit className="w-5 h-5 text-yellow-800" />
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="p-2 rounded-xl bg-red-500 hover:bg-red-600 transition-all"
                  title="Excluir"
                >
                  <Trash2 className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesManager;
