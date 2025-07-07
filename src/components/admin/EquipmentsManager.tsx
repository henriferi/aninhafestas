import React, { useState, useRef, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Upload } from 'lucide-react';
import axios from 'axios';
import { getAuthHeaders, getUserId } from '../../lib/apiHelpers';
import { uploadImageToCloudinary } from '../../lib/uploadImageToCloudinary';

interface Equipment {
  id: string;
  user_id: string;
  nome: string;
  descricao: string;
  faixa_etaria: string;
  capacidade: string;
  imagem: string;
  caracteristicas: string[];
}

const API_BASE_URL = import.meta.env.VITE_SUPABASE_URL;
const userId = getUserId();

const EquipmentsManager: React.FC = () => {
  const [equipmentsList, setEquipmentsList] = useState<Equipment[]>([]);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    faixa_etaria: '',
    capacidade: '',
    imagem: '',
    caracteristicas: [''],
  });

  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Buscar equipamentos do backend
  const fetchEquipments = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/equipamentos?select=*`, {
        headers: getAuthHeaders(true),
      });

      const sanitized = res.data.map((item: any) => ({  
        ...item,
        caracteristicas: Array.isArray(item.caracteristicas) ? item.caracteristicas : [],
      }));

      setEquipmentsList(sanitized);
    } catch (err) {
      alert('Erro ao carregar equipamentos');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEquipments();
  }, []);

  const handleCreate = () => {
    setIsCreating(true);
    setFormData({
      nome: '',
      descricao: '',
      faixa_etaria: '',
      capacidade: '',
      imagem: '',
      caracteristicas: [''],
    });
    scrollToForm();
  };

  const handleEdit = (equipment: Equipment) => {
    setEditingEquipment(equipment);
    setFormData({
      nome: equipment.nome,
      descricao: equipment.descricao,
      faixa_etaria: equipment.faixa_etaria,
      capacidade: equipment.capacidade,
      imagem: equipment.imagem,
      caracteristicas: equipment.caracteristicas,
    });
    scrollToForm();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImageToCloudinary(file, 'equipamentos');
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
    // Adiciona o header Prefer para receber o registro atualizado no response
    const headers = {
      ...getAuthHeaders(true),
      Prefer: 'return=representation',
    };

    // Monta o payload com os dados do formulário, filtrando caracteristicas vazias
    const payload = {
      user_id: userId,
      nome: formData.nome,
      descricao: formData.descricao,
      faixa_etaria: formData.faixa_etaria,
      capacidade: formData.capacidade,
      imagem: formData.imagem,
      caracteristicas: formData.caracteristicas.filter(f => f.trim() !== ''),
    };

    try {
      if (isCreating) {
        // POST para criar equipamento e pegar o objeto criado
        const res = await axios.post(`${API_BASE_URL}/equipamentos?select=*`, payload, { headers });
        const created = Array.isArray(res.data) ? res.data[0] : res.data;

        // Garante que caracteristicas seja sempre array
        const safeCreated = {
          ...created,
          caracteristicas: Array.isArray(created.caracteristicas) ? created.caracteristicas : [],
        };

        // Atualiza o estado adicionando o equipamento criado
        setEquipmentsList(prev => [...prev, safeCreated]);
      } else if (editingEquipment) {
        // PATCH para atualizar equipamento e pegar o objeto atualizado
        const res = await axios.patch(
          `${API_BASE_URL}/equipamentos?id=eq.${editingEquipment.id}&select=*`,
          payload,
          { headers }
        );
        const updated = Array.isArray(res.data) ? res.data[0] : res.data;

        // Atualiza o equipamento no estado
        setEquipmentsList(prev =>
          prev.map(e => (e.id === updated.id ? updated : e))
        );
      }

      // Reseta flags e formulário
      setIsCreating(false);
      setEditingEquipment(null);
      setFormData({
        nome: '',
        descricao: '',
        faixa_etaria: '',
        capacidade: '',
        imagem: '',
        caracteristicas: [''],
      });
    } catch (err) {
      alert('Erro ao salvar equipamento');
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este equipamento?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/equipamentos?id=eq.${id}`, {
        headers: getAuthHeaders(true),
      });
      setEquipmentsList(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      alert('Erro ao excluir equipamento');
      console.error(err);
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingEquipment(null);
    setFormData({
      nome: '',
      descricao: '',
      faixa_etaria: '',
      capacidade: '',
      imagem: '',
      caracteristicas: [''],
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Gerenciar Equipamentos</h2>
        <button
          onClick={handleCreate}
          className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Equipamento</span>
        </button>
      </div>

      {(isCreating || editingEquipment) && (
        <div ref={formRef} className="bg-white rounded-2xl p-6 shadow-lg border border-pink-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {isCreating ? 'Criar Novo Equipamento' : 'Editar Equipamento'}
            </h3>
            <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={e => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Nome do equipamento"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                <textarea
                  value={formData.descricao}
                  onChange={e => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                  placeholder="Descrição detalhada do equipamento"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Faixa Etária</label>
                  <input
                    type="text"
                    value={formData.faixa_etaria}
                    onChange={e => setFormData(prev => ({ ...prev, faixa_etaria: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Ex: 3-12 anos"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Capacidade</label>
                  <input
                    type="text"
                    value={formData.capacidade}
                    onChange={e => setFormData(prev => ({ ...prev, capacidade: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Ex: 6 pessoas"
                  />
                </div>
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
                  <img
                    src={formData.imagem}
                    alt="Preview"
                    className="mt-2 w-full h-48 object-cover rounded-xl"
                  />
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
                    placeholder="Característica do equipamento"
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

      {/* Lista de equipamentos */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {equipmentsList.map(equipment => (
          <div key={equipment.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="relative h-48">
              <img
                src={equipment.imagem}
                alt={equipment.nome}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-gradient-to-r from-green-400 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {equipment.faixa_etaria}
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{equipment.nome}</h3>
              <p className="text-gray-600 text-sm mb-4">{equipment.descricao}</p>

              <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                <span>{equipment.capacidade}</span>
                <span>{equipment.faixa_etaria}</span>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 text-sm mb-2">Características:</h4>
                <div className="space-y-1">
                  {equipment.caracteristicas.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      <span>{feature}</span>
                    </div>
                  ))}
                  {equipment.caracteristicas.length > 3 && (
                    <div className="text-pink-600 text-xs">
                      + {equipment.caracteristicas.length - 3} mais
                    </div>
                  )}
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(equipment)}
                  className="flex-1 flex items-center justify-center space-x-2 bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition-all"
                >
                  <Edit className="w-4 h-4" />
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => handleDelete(equipment.id)}
                  className="flex-1 flex items-center justify-center space-x-2 bg-red-500 text-white py-2 rounded-xl hover:bg-red-600 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Excluir</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EquipmentsManager;