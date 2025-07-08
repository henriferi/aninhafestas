import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { getAuthHeaders, getUserId } from '../../lib/apiHelpers';
import { EventTypeOption, AdditionalService } from '../../types/budget';
import { useToast } from '../../hooks/useToast';
import { useConfirm } from '../../hooks/useConfirm';
import ConfirmDialog from '../ui/ConfirmDialog';

const API_BASE_URL = import.meta.env.VITE_SUPABASE_URL;
const userId = getUserId();

const BudgetManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'event-types' | 'services'>('event-types');
  const [eventTypesList, setEventTypesList] = useState<EventTypeOption[]>([]);
  const [servicesList, setServicesList] = useState<AdditionalService[]>([]);
  const { success, error, warning } = useToast();
  const { confirm, confirmState } = useConfirm();

  const [editingEventType, setEditingEventType] = useState<EventTypeOption | null>(null);
  const [editingService, setEditingService] = useState<AdditionalService | null>(null);
  const [isCreatingEventType, setIsCreatingEventType] = useState(false);
  const [isCreatingService, setIsCreatingService] = useState(false);

  // Forms state
  const [eventTypeForm, setEventTypeForm] = useState({
    name: '',
    description: '',
    icon: '',
    basePrice: '', // string for controlled input, will convert before sending
  });

  const [serviceForm, setServiceForm] = useState({
    name: '',
    description: '',
    price: '', // string for controlled input, convert to number before sending
  });

  const eventTypeFormRef = useRef<HTMLDivElement>(null);
  const serviceFormRef = useRef<HTMLDivElement>(null);

  const scrollToForm = (formType: 'event-type' | 'service') => {
    setTimeout(() => {
      const ref = formType === 'event-type' ? eventTypeFormRef.current : serviceFormRef.current;
      if (ref) {
        ref.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };

  // Fetch event types on mount
  useEffect(() => {
    const fetchEventTypes = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/tipo_evento?select=*`, {
          headers: getAuthHeaders(true)
        });
        const list: EventTypeOption[] = res.data
          .filter((item: any) => item.id)
          .map((item: any) => ({
            id: item.id,
            name: item.nome,
            description: item.descricao,
            icon: item.icone,
            basePrice: item.preco_base ?? 0
          }));
        setEventTypesList(list);
      } catch (error) {
        alert('Erro ao carregar tipos de evento');
        console.error(error);
      }
    };

    fetchEventTypes();
  }, []);

  // Fetch services adicionais on mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/servicos_adicionais?select=*`, {
          headers: getAuthHeaders(true)
        });
        const list: AdditionalService[] = res.data
          .filter((item: any) => item.id)
          .map((item: any) => ({
            id: item.id,
            name: item.nome,
            description: item.descricao,
            price: item.preco ?? 0,
          }));
        setServicesList(list);
      } catch (error) {
        alert('Erro ao carregar serviços adicionais');
        console.error(error);
      }
    };

    fetchServices();
  }, []);

  // --- Event Types Management ---

  const handleCreateEventType = () => {
    setIsCreatingEventType(true);
    setEventTypeForm({ name: '', description: '', icon: '', basePrice: '' });
    scrollToForm('event-type');
  };

  const handleEditEventType = (eventType: EventTypeOption) => {
    setEditingEventType(eventType);
    setEventTypeForm({
      name: eventType.name,
      description: eventType.description,
      icon: eventType.icon,
      basePrice: String(eventType.basePrice),
    });
    scrollToForm('event-type');
  };

  const handleSaveEventType = async () => {
    // Validação de campos obrigatórios
    if (!eventTypeForm.name.trim()) {
      warning('Campo obrigatório', 'O nome do tipo de evento é obrigatório.');
      return;
    }
    if (!eventTypeForm.description.trim()) {
      warning('Campo obrigatório', 'A descrição do tipo de evento é obrigatória.');
      return;
    }
    if (!eventTypeForm.icon.trim()) {
      warning('Campo obrigatório', 'O ícone do tipo de evento é obrigatório.');
      return;
    }
    if (!eventTypeForm.basePrice || Number(eventTypeForm.basePrice) < 0) {
      warning('Campo obrigatório', 'O preço base deve ser um valor válido.');
      return;
    }

    const payload = {
      user_id: userId,
      nome: eventTypeForm.name,
      descricao: eventTypeForm.description,
      icone: eventTypeForm.icon,
      preco_base: Number(eventTypeForm.basePrice),
    };

    try {
      if (isCreatingEventType) {
        const res = await axios.post(
          `${API_BASE_URL}/tipo_evento?select=*`,
          payload,
          {
            headers: {
              ...getAuthHeaders(true),
              'Prefer': 'return=representation',
            }
          }
        );

        if (!Array.isArray(res.data) || res.data.length === 0) {
          alert('Erro: resposta inválida da API ao criar tipo de evento.');
          return;
        }
        const created = res.data[0];

        setEventTypesList(prev => [
          ...prev,
          {
            id: created.id,
            name: created.nome,
            description: created.descricao,
            icon: created.icone,
            basePrice: created.preco_base,
          }
        ]);

      } else if (editingEventType) {
        const res = await axios.patch(
          `${API_BASE_URL}/tipo_evento?id=eq.${editingEventType.id}&select=*`,
          payload,
          {
            headers: {
              ...getAuthHeaders(true),
              'Prefer': 'return=representation',
            }
          }
        );

        if (!Array.isArray(res.data) || res.data.length === 0) {
          alert('Erro: resposta inválida da API ao atualizar tipo de evento.');
          return;
        }
        const updated = res.data[0];

        setEventTypesList(prev =>
          prev.map(et =>
            et.id === updated.id
              ? {
                id: updated.id,
                name: updated.nome,
                description: updated.descricao,
                icon: updated.icone,
                basePrice: updated.preco_base,
              }
              : et
          )
        );
      }

      setIsCreatingEventType(false);
      setEditingEventType(null);
      success('Sucesso!', isCreatingEventType ? 'Tipo de evento criado com sucesso!' : 'Tipo de evento atualizado com sucesso!');

    } catch (err) {
      error('Erro ao salvar', 'Não foi possível salvar o tipo de evento.');
      console.error(err);
    }
  };


  const handleDeleteEventType = async (id: string) => {
    const confirmed = await confirm({
      title: 'Excluir Tipo de Evento',
      message: 'Tem certeza que deseja excluir este tipo de evento? Esta ação não pode ser desfeita.',
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      type: 'danger'
    });

    if (!confirmed) return;

    try {
      await axios.delete(`${API_BASE_URL}/tipo_evento?id=eq.${id}`, {
        headers: getAuthHeaders(true)
      });

      setEventTypesList(prev => prev.filter(et => et.id !== id));
      success('Excluído!', 'Tipo de evento excluído com sucesso!');
    } catch (err) {
      error('Erro ao excluir', 'Não foi possível excluir o tipo de evento.');
      console.error(err);
    }
  };

  // --- Services Management ---

  const handleCreateService = () => {
    setIsCreatingService(true);
    setServiceForm({ name: '', description: '', price: '' });
    scrollToForm('service');
  };

  const handleEditService = (service: AdditionalService) => {
    setEditingService(service);
    setServiceForm({
      name: service.name,
      description: service.description,
      price: String(service.price),
    });
    scrollToForm('service');
  };
  const handleSaveService = async () => {
    // Validação de campos obrigatórios
    if (!serviceForm.name.trim()) {
      warning('Campo obrigatório', 'O nome do serviço é obrigatório.');
      return;
    }
    if (!serviceForm.description.trim()) {
      warning('Campo obrigatório', 'A descrição do serviço é obrigatória.');
      return;
    }
    if (!serviceForm.price || Number(serviceForm.price) < 0) {
      warning('Campo obrigatório', 'O preço deve ser um valor válido.');
      return;
    }

    const payload = {
      user_id: userId,
      nome: serviceForm.name,
      descricao: serviceForm.description,
      preco: Number(serviceForm.price), // garanto number
    };

    try {
      if (isCreatingService) {
        const res = await axios.post(
          `${API_BASE_URL}/servicos_adicionais?select=*`,
          payload,
          {
            headers: {
              ...getAuthHeaders(true),
              'Prefer': 'return=representation',
            }
          }
        );

        // validação da resposta
        if (!Array.isArray(res.data) || res.data.length === 0) {
          alert('Erro: resposta inválida da API ao criar serviço.');
          return;
        }
        const created = res.data[0];

        setServicesList(prev => [
          ...prev,
          {
            id: created.id,
            name: created.nome,
            description: created.descricao,
            price: created.preco,
          },
        ]);

      } else if (editingService) {
        const res = await axios.patch(
          `${API_BASE_URL}/servicos_adicionais?id=eq.${editingService.id}&select=*`,
          payload,
          {
            headers: {
              ...getAuthHeaders(true),
              'Prefer': 'return=representation',
            }
          }
        );

        if (!Array.isArray(res.data) || res.data.length === 0) {
          alert('Erro: resposta inválida da API ao atualizar serviço.');
          return;
        }
        const updated = res.data[0];

        setServicesList(prev =>
          prev.map(s =>
            s.id === updated.id
              ? {
                id: updated.id,
                name: updated.nome,
                description: updated.descricao,
                price: updated.preco,
              }
              : s
          )
        );
      }

      setIsCreatingService(false);
      setEditingService(null);
      success('Sucesso!', isCreatingService ? 'Serviço criado com sucesso!' : 'Serviço atualizado com sucesso!');

    } catch (err) {
      error('Erro ao salvar', 'Não foi possível salvar o serviço.');
      console.error(err);
    }
  };


  const handleDeleteService = async (id: string) => {
    const confirmed = await confirm({
      title: 'Excluir Serviço',
      message: 'Tem certeza que deseja excluir este serviço adicional? Esta ação não pode ser desfeita.',
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      type: 'danger'
    });

    if (!confirmed) return;

    try {
      await axios.delete(`${API_BASE_URL}/servicos_adicionais?id=eq.${id}`, {
        headers: getAuthHeaders(true),
      });

      setServicesList(prev => prev.filter(service => service.id !== id));
      success('Excluído!', 'Serviço excluído com sucesso!');
    } catch (err) {
      error('Erro ao excluir', 'Não foi possível excluir o serviço.');
      console.error(err);
    }
  };

  const handleCancel = () => {
    setIsCreatingEventType(false);
    setIsCreatingService(false);
    setEditingEventType(null);
    setEditingService(null);
    setEventTypeForm({ name: '', description: '', icon: '', basePrice: '' });
    setServiceForm({ name: '', description: '', price: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Gerenciar Orçamento Personalizado</h2>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('event-types')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${activeTab === 'event-types'
            ? 'bg-white text-pink-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-800'
            }`}
        >
          Tipos de Evento
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${activeTab === 'services'
            ? 'bg-white text-pink-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-800'
            }`}
        >
          Serviços Adicionais
        </button>
      </div>

      {/* Event Types Tab */}
      {activeTab === 'event-types' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Tipos de Evento</h3>
            <button
              onClick={handleCreateEventType}
              className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Tipo</span>
            </button>
          </div>

          {(isCreatingEventType || editingEventType) && (
            <div ref={eventTypeFormRef} className="bg-white rounded-2xl p-6 shadow-lg border border-pink-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-800">
                  {isCreatingEventType ? 'Criar Novo Tipo de Evento' : 'Editar Tipo de Evento'}
                </h4>
                <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse"></div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                    <input
                      type="text"
                      value={eventTypeForm.name}
                      onChange={(e) => setEventTypeForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                    <textarea
                      value={eventTypeForm.description}
                      onChange={(e) => setEventTypeForm(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ícone (Emoji)</label>
                    <input
                      type="text"
                      value={eventTypeForm.icon}
                      onChange={(e) => setEventTypeForm(prev => ({ ...prev, icon: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="🎂"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preço Base</label>
                    <input
                      type="number"
                      value={eventTypeForm.basePrice}
                      onChange={(e) => setEventTypeForm(prev => ({ ...prev, basePrice: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  onClick={handleSaveEventType}
                  className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-xl hover:bg-gray-600 transition-all"
                >
                  <X className="w-4 h-4" />
                  <span>Cancelar</span>
                </button>
              </div>
            </div>
          )}

          {/* Event Types List */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventTypesList.map((eventType) => (
              <div key={eventType.id} className="bg-white rounded-2xl p-6 shadow-lg border">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">{eventType.icon}</div>
                  <h4 className="text-lg font-bold text-gray-800">{eventType.name}</h4>
                  <p className="text-gray-600 text-sm mb-2">{eventType.description}</p>
                  <p className="mt-2 font-semibold text-pink-600">
                    R$ {(eventType.basePrice ?? 0).toFixed(2)}
                  </p>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditEventType(eventType)}
                    className="flex-1 flex items-center justify-center space-x-2 bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition-all"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Editar</span>
                  </button>
                  <button
                    onClick={() => handleDeleteEventType(eventType.id)}
                    className="flex-1 flex items-center justify-center space-x-2 bg-red-500 text-white py-2 rounded-xl hover:bg-red-600 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Excluir</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Services Tab */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Serviços Adicionais</h3>
            <button
              onClick={handleCreateService}
              className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Serviço</span>
            </button>
          </div>

          {(isCreatingService || editingService) && (
            <div ref={serviceFormRef} className="bg-white rounded-2xl p-6 shadow-lg border border-pink-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-800">
                  {isCreatingService ? 'Criar Novo Serviço' : 'Editar Serviço'}
                </h4>
                <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse"></div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                  <input
                    type="text"
                    value={serviceForm.name}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                  <textarea
                    value={serviceForm.description}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preço</label>
                  <input
                    type="number"
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  onClick={handleSaveService}
                  className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-xl hover:bg-gray-600 transition-all"
                >
                  <X className="w-4 h-4" />
                  <span>Cancelar</span>
                </button>
              </div>
            </div>
          )}

          {/* Services List */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesList.map((service) => (
              <div key={service.id} className="bg-white rounded-2xl p-6 shadow-lg border">
                <h4 className="text-lg font-bold text-gray-800">{service.name}</h4>
                <p className="text-gray-600 text-sm mb-2">{service.description}</p>
                <p className="mt-2 font-semibold text-pink-600">
                  R$ {(typeof service.price === 'number' ? service.price : 0).toFixed(2)}
                </p>

                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() => handleEditService(service)}
                    className="flex-1 flex items-center justify-center space-x-2 bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition-all"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Editar</span>
                  </button>
                  <button
                    onClick={() => handleDeleteService(service.id)}
                    className="flex-1 flex items-center justify-center space-x-2 bg-red-500 text-white py-2 rounded-xl hover:bg-red-600 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Excluir</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmState.isOpen}
        title={confirmState.options.title}
        message={confirmState.options.message}
        confirmText={confirmState.options.confirmText}
        cancelText={confirmState.options.cancelText}
        type={confirmState.options.type}
        onConfirm={confirmState.onConfirm}
        onCancel={confirmState.onCancel}
      />
    </div>
  );
};

export default BudgetManager;
