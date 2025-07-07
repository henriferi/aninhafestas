import React from 'react';
import { Calculator, MapPin, Clock, Users, Calendar, Package } from 'lucide-react';
import { BudgetFormData } from '../../types/budget';
import { eventTypes, additionalServices } from '../../data/budget';
import { equipments } from '../../data/facilities';

interface BudgetSummaryProps {
  formData: BudgetFormData;
}

const BudgetSummary: React.FC<BudgetSummaryProps> = ({ formData }) => {
  const selectedEventType = eventTypes.find(type => type.id === formData.eventType);
  const selectedEquipments = equipments.filter(eq => formData.selectedEquipments.includes(eq.id));
  const selectedServices = additionalServices.filter(service => formData.additionalServices.includes(service.id));

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Calculator className="w-4 h-4 text-pink-500" />
        <h3 className="text-base font-semibold text-gray-800">Resumo da Solicitação</h3>
      </div>

      <div className="space-y-3">
        {/* Event Type */}
        {selectedEventType && (
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <h4 className="font-medium text-gray-800 mb-2 text-sm">Tipo de Evento</h4>
            <div className="flex items-center space-x-2">
              <span className="text-lg">{selectedEventType.icon}</span>
              <span className="text-xs text-gray-600">{selectedEventType.name}</span>
            </div>
          </div>
        )}

        {/* Location */}
        {formData.location && (
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <h4 className="font-medium text-gray-800 mb-2 text-sm">Local</h4>
            <div className="flex items-center space-x-2">
              <MapPin className="w-3 h-3 text-pink-500" />
              <span className="text-xs text-gray-600">
                {formData.location === 'our-space' ? 'Nosso Espaço' : 'Seu Espaço'}
              </span>
            </div>
          </div>
        )}

        {/* Duration & Guests */}
        <div className="bg-white p-3 rounded-lg shadow-sm">
          <h4 className="font-medium text-gray-800 mb-2 text-sm">Detalhes</h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3 text-pink-500" />
                <span>Duração</span>
              </div>
              <span>{formData.duration}h</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <Users className="w-3 h-3 text-pink-500" />
                <span>Convidados</span>
              </div>
              <span>{formData.guestCount}</span>
            </div>
            {formData.date && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3 text-pink-500" />
                  <span>Data</span>
                </div>
                <span className="text-xs">{new Date(formData.date).toLocaleDateString('pt-BR')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Equipment */}
        {selectedEquipments.length > 0 && (
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <h4 className="font-medium text-gray-800 mb-2 text-sm">
              <div className="flex items-center space-x-1">
                <Package className="w-3 h-3 text-pink-500" />
                <span>Equipamentos ({selectedEquipments.length})</span>
              </div>
            </h4>
            <div className="space-y-1 text-xs text-gray-600">
              {selectedEquipments.slice(0, 3).map(equipment => (
                <div key={equipment.id} className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                  <span className="truncate">{equipment.name}</span>
                </div>
              ))}
              {selectedEquipments.length > 3 && (
                <div className="text-pink-600 text-xs">+ {selectedEquipments.length - 3} mais</div>
              )}
            </div>
          </div>
        )}

        {/* Additional Services */}
        {selectedServices.length > 0 && (
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <h4 className="font-medium text-gray-800 mb-2 text-sm">
              Serviços Adicionais ({selectedServices.length})
            </h4>
            <div className="space-y-1 text-xs text-gray-600">
              {selectedServices.slice(0, 3).map(service => (
                <div key={service.id} className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <span className="truncate">{service.name}</span>
                </div>
              ))}
              {selectedServices.length > 3 && (
                <div className="text-pink-600 text-xs">+ {selectedServices.length - 3} mais</div>
              )}
            </div>
          </div>
        )}

        {/* Info Card */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-3 rounded-lg">
          <h4 className="font-medium mb-1 text-sm">📱 Próximo Passo</h4>
          <p className="text-xs text-pink-100">
            Após enviar, entraremos em contato via WhatsApp para finalizar os detalhes.
          </p>
        </div>

        {/* Contact Info */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-1 text-sm">💬 Contato Direto</h4>
          <p className="text-xs text-blue-700 mb-1">
            Prefere falar conosco diretamente?
          </p>
          <div className="space-y-0.5 text-xs text-blue-600">
            <div>📞 (11) 9999-9999</div>
            <div>✉️ contato@festamagica.com</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetSummary;