import React, { useEffect, useState } from 'react';
import { CheckCircle, MapPin, Clock, Users, Calendar, Package, Star, Edit } from 'lucide-react';
import { BudgetFormData } from '../../types/budget';
import { getAuthHeaders } from '../../lib/apiHelpers';

interface SummaryStepProps {
  formData: BudgetFormData;
  onEdit: (step: number) => void;
  onGenerateMessage: (message: string) => void; // <- callback para enviar mensagem pronta
}

const SummaryStep: React.FC<SummaryStepProps> = ({ formData, onEdit, onGenerateMessage }) => {
  const [eventTypes, setEventTypes] = useState<any[]>([]);
  const [equipments, setEquipments] = useState<any[]>([]);
  const [additionalServices, setAdditionalServices] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseUrl = import.meta.env.VITE_SUPABASE_URL;
        const headers = getAuthHeaders(false);

        const [eventRes, eqRes, servRes] = await Promise.all([
          fetch(`${baseUrl}/tipo_evento?select=id,nome,descricao,icone`, { headers }),
          fetch(`${baseUrl}/equipamentos?select=id,nome,faixa_etaria,capacidade`, { headers }),
          fetch(`${baseUrl}/servicos_adicionais?select=id,nome,descricao`, { headers }),
        ]);

        const [eventData, eqData, servData] = await Promise.all([
          eventRes.json(),
          eqRes.json(),
          servRes.json(),
        ]);

        setEventTypes(eventData);
        setEquipments(eqData);
        setAdditionalServices(servData);
      } catch (err) {
        console.error('Erro ao carregar dados do resumo:', err);
      }
    };

    fetchData();
  }, []);

  // Mapear itens selecionados
  const selectedEventType = eventTypes.find(type => type.id === formData.eventType);
  const selectedEquipments = equipments.filter(eq => formData.selectedEquipments.includes(eq.id));
  const selectedServices = additionalServices.filter(service => formData.additionalServices.includes(service.id));

  // Montar mensagem do WhatsApp com base no resumo
  useEffect(() => {
    let message = 'Olá! Gostaria de solicitar um orçamento:\n\n';

    message += `• Tipo de Evento: ${selectedEventType ? selectedEventType.nome : 'Não selecionado'}\n`;
    message += `• Local do Evento: ${formData.location === 'our-space' ? 'Nosso Espaço' : formData.location === 'client-space' ? 'Seu Espaço' : 'Não definido'}\n`;
    message += `• Duração: ${formData.duration} horas\n`;
    message += `• Convidados: ${formData.guestCount}\n`;
    message += `• Data: ${formData.date ? new Date(formData.date).toLocaleDateString('pt-BR') : 'Não definida'}\n\n`;

    if (selectedEquipments.length > 0) {
      message += '• Equipamentos:\n';
      selectedEquipments.forEach(eq => {
        message += `  - ${eq.nome} (${eq.faixa_etaria}, capacidade: ${eq.capacidade})\n`;
      });
      message += '\n';
    } else {
      message += '• Equipamentos: Nenhum selecionado\n\n';
    }

    if (selectedServices.length > 0) {
      message += '• Serviços Adicionais:\n';
      selectedServices.forEach(serv => {
        message += `  - ${serv.nome}: ${serv.descricao}\n`;
      });
      message += '\n';
    } else {
      message += '• Serviços Adicionais: Nenhum selecionado\n\n';
    }

    onGenerateMessage(message);
  }, [formData, selectedEventType, selectedEquipments, selectedServices, onGenerateMessage]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-6 sm:mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
          Resumo da Sua Solicitação
        </h3>
        <p className="text-sm sm:text-base text-gray-600">
          Revise todos os detalhes antes de finalizar. Você pode editar qualquer seção clicando no botão "Editar".
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6">
        {/* Tipo de Evento */}
        {selectedEventType && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                <span className="text-2xl">{selectedEventType.icone}</span>
                <span>Tipo de Evento</span>
              </h4>
              <button onClick={() => onEdit(1)} className="flex items-center space-x-1 text-pink-600 text-sm font-medium">
                <Edit className="w-4 h-4" />
                <span>Editar</span>
              </button>
            </div>
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-lg">
              <h5 className="font-semibold text-gray-800">{selectedEventType.nome}</h5>
              <p className="text-sm text-gray-600 mt-1">{selectedEventType.descricao}</p>
            </div>
          </div>
        )}

        {/* Local */}
        {formData.location && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-pink-500" />
                <span>Local do Evento</span>
              </h4>
              <button onClick={() => onEdit(2)} className="flex items-center space-x-1 text-pink-600 text-sm font-medium">
                <Edit className="w-4 h-4" />
                <span>Editar</span>
              </button>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg">
              <h5 className="font-semibold text-gray-800">
                {formData.location === 'our-space' ? 'Nosso Espaço' : 'Seu Espaço'}
              </h5>
              <p className="text-sm text-gray-600 mt-1">
                {formData.location === 'our-space'
                  ? 'Festa realizada em nosso espaço completo e equipado'
                  : 'Montagem completa no local de sua preferência'}
              </p>
            </div>
          </div>
        )}

        {/* Duração, Convidados, Data */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-800">Detalhes do Evento</h4>
            <button onClick={() => onEdit(4)} className="flex items-center space-x-1 text-pink-600 text-sm font-medium">
              <Edit className="w-4 h-4" />
              <span>Editar</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg text-center">
              <Clock className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <div className="font-semibold text-gray-800">{formData.duration} horas</div>
              <div className="text-sm text-gray-600">Duração</div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg text-center">
              <Users className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <div className="font-semibold text-gray-800">{formData.guestCount} pessoas</div>
              <div className="text-sm text-gray-600">Convidados</div>
            </div>
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg text-center">
              <Calendar className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <div className="font-semibold text-gray-800">
                {formData.date ? new Date(formData.date).toLocaleDateString('pt-BR') : 'Não definida'}
              </div>
              <div className="text-sm text-gray-600">Data</div>
            </div>
          </div>
        </div>

        {/* Equipamentos */}
        {selectedEquipments.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                <Package className="w-5 h-5 text-pink-500" />
                <span>Equipamentos Selecionados ({selectedEquipments.length})</span>
              </h4>
              <button onClick={() => onEdit(3)} className="flex items-center space-x-1 text-pink-600 text-sm font-medium">
                <Edit className="w-4 h-4" />
                <span>Editar</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {selectedEquipments.map(equipment => (
                <div key={equipment.id} className="bg-green-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-gray-800 text-sm">{equipment.nome}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{equipment.faixa_etaria} • {equipment.capacidade}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Serviços Adicionais */}
        {selectedServices.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                <Star className="w-5 h-5 text-pink-500" />
                <span>Serviços Adicionais ({selectedServices.length})</span>
              </h4>
              <button onClick={() => onEdit(5)} className="flex items-center space-x-1 text-pink-600 text-sm font-medium">
                <Edit className="w-4 h-4" />
                <span>Editar</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedServices.map(service => (
                <div key={service.id} className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="font-medium text-gray-800 text-sm">{service.nome}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{service.descricao}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Próximos passos */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6 rounded-xl">
          <h4 className="text-lg font-semibold mb-3">🎉 Próximos Passos</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Confirme seus dados pessoais na próxima etapa</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Receba seu orçamento personalizado via WhatsApp</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryStep;
