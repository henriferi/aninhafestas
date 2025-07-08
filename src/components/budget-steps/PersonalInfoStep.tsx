import React from 'react';
import { User, Phone, MessageSquare, Send, Shield } from 'lucide-react';
import { BudgetFormData } from '../../types/budget';
import { formatPhoneNumber, validatePhoneNumber } from '../../utils/phoneMask';

interface PersonalInfoStepProps {
  personalInfo: BudgetFormData['personalInfo'];
  onUpdate: (field: keyof BudgetFormData['personalInfo'], value: string) => void;
  onSubmit?: () => void;
}

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({ personalInfo, onUpdate, onSubmit }) => {
  const isPhoneValid = validatePhoneNumber(personalInfo.phone);
  const canSubmit = personalInfo.name.trim() !== '' && personalInfo.phone.trim() !== '' && isPhoneValid;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    onUpdate('phone', formattedPhone);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-6 sm:mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
          Últimos Detalhes!
        </h3>
        <p className="text-sm sm:text-base text-gray-600">
          Preencha suas informações para que possamos entrar em contato e finalizar seu orçamento personalizado via WhatsApp.
        </p>
      </div>

      <div className="space-y-6">
        {/* Nome */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
            <User className="w-4 h-4 text-pink-500" />
            <span>Nome Completo *</span>
          </label>
          <input
            type="text"
            value={personalInfo.name}
            onChange={(e) => onUpdate('name', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-base"
            placeholder="Digite seu nome completo"
            required
          />
        </div>

        {/* Telefone */}
        <div>
          <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-3">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-pink-500" />
              <span>Telefone/WhatsApp *</span>
            </div>
            {personalInfo.phone && !isPhoneValid && (
              <span className="text-xs text-red-500">Formato inválido</span>
            )}
          </label>
          <input
            type="tel"
            value={personalInfo.phone}
            onChange={handlePhoneChange}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent text-base transition-colors ${
              personalInfo.phone && !isPhoneValid
                ? 'border-red-300 focus:ring-red-500'
                : 'border-gray-300 focus:ring-pink-500'
            }`}
            placeholder="81 99999-9999"
            maxLength={13} // Máximo de caracteres com formatação
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Formato: DDD + número (ex: 81 99999-9999)
          </p>
        </div>

        {/* Email */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
            <MessageSquare className="w-4 h-4 text-pink-500" />
            <span>E-mail (Opcional)</span>
          </label>
          <input
            type="email"
            value={personalInfo.email}
            onChange={(e) => onUpdate('email', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-base"
            placeholder="seu@email.com"
          />
        </div>

        {/* Mensagem */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
            <MessageSquare className="w-4 h-4 text-pink-500" />
            <span>Mensagem Adicional (Opcional)</span>
          </label>
          <textarea
            value={personalInfo.message}
            onChange={(e) => onUpdate('message', e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none text-base"
            placeholder="Conte-nos mais detalhes sobre sua festa, preferências especiais, ou qualquer dúvida que tenha..."
          />
        </div>

        {/* Privacy Notice */}
        <div className="bg-blue-50 p-4 rounded-xl">
          <div className="flex items-start space-x-2">
            <Shield className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-800 text-sm">Seus dados estão seguros</h4>
              <p className="text-xs text-blue-700 mt-1">
                Utilizamos suas informações apenas para entrar em contato sobre seu orçamento. 
                Não compartilhamos seus dados com terceiros.
              </p>
            </div>
          </div>
        </div>

        {/* Botão Enviar Solicitação */}
        <div className="pt-4">
          <button
            onClick={onSubmit}
            disabled={!canSubmit}
            className={`w-full flex items-center justify-center space-x-3 py-4 rounded-xl font-semibold text-lg transition-all ${
              canSubmit
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transform hover:scale-105 shadow-lg hover:shadow-xl'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-5 h-5" />
            <span>Enviar Solicitação de Orçamento</span>
          </button>

          {!canSubmit && (
            <p className="text-sm text-gray-500 mt-3 text-center">
              {!personalInfo.name.trim() || !personalInfo.phone.trim() 
                ? 'Preencha nome e telefone para enviar sua solicitação'
                : !isPhoneValid 
                ? 'Digite um telefone válido para continuar'
                : 'Preencha os campos obrigatórios'
              }
            </p>
          )}

          {canSubmit && (
            <p className="text-sm text-green-600 mt-3 text-center">
              ✅ Pronto para enviar! Telefone válido: {personalInfo.phone}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoStep;
