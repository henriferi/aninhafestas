import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { BudgetFormData } from '../types/budget';
import { budgetSteps } from '../data/budget';
import EventTypeStep from './budget-steps/EventTypeStep';
import LocationStep from './budget-steps/LocationStep';
import EquipmentStep from './budget-steps/EquipmentStep';
import DurationStep from './budget-steps/DurationStep';
import ServicesStep from './budget-steps/ServicesStep';
import SummaryStep from './budget-steps/SummaryStep';
import PersonalInfoStep from './budget-steps/PersonalInfoStep';
import { getAuthHeaders } from '../lib/apiHelpers';
import { formatWhatsappMessage } from '../utils/buildWhatsappMessage';
import { useToast } from '../hooks/useToast';
import LoadingSpinner from './ui/LoadingSpinner';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WHATSAPP_NUMBER = '5581986223012'; // seu número WhatsApp

const BudgetModal: React.FC<BudgetModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const { success, error, info } = useToast();
  
  const [formData, setFormData] = useState<BudgetFormData>({
    eventType: '',
    location: '',
    selectedEquipments: [],
    duration: 4,
    guestCount: 50,
    date: '',
    additionalServices: [],
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      message: '',
    },
  });

  const [whatsappMessage, setWhatsappMessage] = useState('');
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
        console.error('Erro ao carregar dados:', err);
        error('Erro ao carregar dados', 'Não foi possível carregar as opções do formulário.');
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        const modal = document.querySelector('[data-modal="budget"]');
        if (modal) {
          modal.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, [isOpen]);

  const updateFormData = (field: keyof BudgetFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updatePersonalInfo = (field: keyof BudgetFormData['personalInfo'], value: string) => {
    setFormData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  };

  const nextStep = () => {
    if (currentStep < budgetSteps.length) setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const goToStep = (stepNumber: number) => {
    if (stepNumber >= 1 && stepNumber <= budgetSteps.length) setCurrentStep(stepNumber);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.eventType !== '';
      case 2:
        return formData.location !== '';
      case 3:
        return true;
      case 4:
        return formData.duration > 0 && formData.guestCount > 0 && formData.date !== '';
      case 5:
        return true;
      case 6:
        return true;
      case 7:
        return formData.personalInfo.name !== '' && formData.personalInfo.phone !== '';
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    
    try {
      const plainMessage = formatWhatsappMessage(formData, eventTypes, equipments, additionalServices);
      const encoded = encodeURIComponent(plainMessage);
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
      
      // Simula um pequeno delay para mostrar o loading
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      window.open(url, '_blank');
      
      success('Solicitação enviada!', 'Entraremos em contato em breve via WhatsApp.');
      onClose();

      setCurrentStep(1);
      setFormData({
        eventType: '',
        location: '',
        selectedEquipments: [],
        duration: 4,
        guestCount: 50,
        date: '',
        additionalServices: [],
        personalInfo: {
          name: '',
          email: '',
          phone: '',
          message: '',
        },
      });
    } catch (err) {
      error('Erro ao enviar', 'Não foi possível enviar a solicitação. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <EventTypeStep
            selectedType={formData.eventType}
            onSelect={(type) => updateFormData('eventType', type)}
          />
        );
      case 2:
        return (
          <LocationStep
            selectedLocation={formData.location}
            onSelect={(location) => updateFormData('location', location)}
          />
        );
      case 3:
        return (
          <EquipmentStep
            selectedEquipments={formData.selectedEquipments}
            onToggle={(equipmentId) => {
              const current = formData.selectedEquipments;
              const updated = current.includes(equipmentId)
                ? current.filter((id) => id !== equipmentId)
                : [...current, equipmentId];
              updateFormData('selectedEquipments', updated);
            }}
          />
        );
      case 4:
        return (
          <DurationStep
            duration={formData.duration}
            guestCount={formData.guestCount}
            date={formData.date}
            onDurationChange={(duration) => updateFormData('duration', duration)}
            onGuestCountChange={(count) => updateFormData('guestCount', count)}
            onDateChange={(date) => updateFormData('date', date)}
          />
        );
      case 5:
        return (
          <ServicesStep
            selectedServices={formData.additionalServices}
            onToggle={(serviceId) => {
              const current = formData.additionalServices;
              const updated = current.includes(serviceId)
                ? current.filter((id) => id !== serviceId)
                : [...current, serviceId];
              updateFormData('additionalServices', updated);
            }}
          />
        );
      case 6:
        return (
          <SummaryStep
            formData={formData}
            onEdit={goToStep}
            onGenerateMessage={(message) => setWhatsappMessage(message)}
          />
        );
      case 7:
        return (
          <PersonalInfoStep
            personalInfo={formData.personalInfo}
            onUpdate={updatePersonalInfo}
            onSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div
        data-modal="budget"
        className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-7xl h-[95vh] sm:h-[95vh] lg:h-[90vh] overflow-hidden shadow-2xl relative flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-5 sm:p-6 flex-shrink-0">
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <div>
              <h2 className="text-lg sm:text-2xl font-bold">Orçamento Personalizado</h2>
              <p className="text-pink-100 text-xs sm:text-sm mt-1 hidden sm:block">
                Pressione as opções abaixo para navegar entre as etapas
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={submitting}
              className="p-1 sm:p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-2 sm:mb-4">
            {/* Mobile */}
            <div className="flex items-center overflow-x-auto pb-2 sm:hidden">
              {budgetSteps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-shrink-0">
                  <button
                    onClick={() => goToStep(step.id)}
                    disabled={submitting}
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all hover:scale-110 disabled:opacity-50 ${currentStep > step.id
                      ? 'bg-green-500 hover:bg-green-600'
                      : currentStep === step.id
                        ? 'bg-white text-pink-500 hover:bg-gray-100'
                        : 'bg-white bg-opacity-30 hover:bg-opacity-50'
                      }`}
                  >
                    {currentStep > step.id ? <Check className="w-3 h-3" /> : step.id}
                  </button>
                  {index < budgetSteps.length - 1 && (
                    <div
                      className={`w-4 h-0.5 mx-1 ${currentStep > step.id ? 'bg-green-500' : 'bg-white bg-opacity-30'
                        }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Desktop */}
            <div className="hidden sm:flex items-center justify-between">
              {budgetSteps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-1">
                  <button
                    onClick={() => goToStep(step.id)}
                    disabled={submitting}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all hover:scale-110 disabled:opacity-50 ${currentStep > step.id
                      ? 'bg-green-500 hover:bg-green-600'
                      : currentStep === step.id
                        ? 'bg-white text-pink-500 hover:bg-gray-100'
                        : 'bg-white bg-opacity-30 hover:bg-opacity-50'
                      }`}
                  >
                    {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
                  </button>
                  {index < budgetSteps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-3 ${currentStep > step.id ? 'bg-green-500' : 'bg-white bg-opacity-30'
                        }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-2 sm:mt-4">
            <h3 className="text-sm sm:text-lg font-semibold">{budgetSteps[currentStep - 1].title}</h3>
            <p className="text-pink-100 text-xs sm:text-base hidden sm:block">
              {budgetSteps[currentStep - 1].description}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-3 sm:p-6 overflow-y-auto min-h-0">{renderStep()}</div>

        {/* Footer */}
        {currentStep !== 7 && (
          <div className="border-t border-gray-200 p-4 sm:p-6 bg-gray-50 flex-shrink-0">
            <div className="flex items-center justify-between">
              <button
                onClick={prevStep}
                disabled={currentStep === 1 || submitting}
                className={`flex items-center space-x-1 sm:space-x-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all text-sm sm:text-base ${currentStep === 1 || submitting
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Anterior</span>
              </button>

              <div className="text-center px-4">
                <span className="text-xs sm:text-sm text-gray-500">
                  Passo {currentStep} de {budgetSteps.length}
                </span>
                <p className="text-xs text-gray-400 mt-1 hidden sm:block">Clique nos números acima para navegar</p>
              </div>

              <button
                onClick={nextStep}
                disabled={!canProceed() || submitting}
                className={`flex items-center space-x-1 sm:space-x-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all text-sm sm:text-base ${canProceed() && !submitting
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
              >
                {submitting && currentStep === 6 ? (
                  <LoadingSpinner size="sm" color="gray" />
                ) : null}
                <span>{currentStep === 6 ? 'Finalizar' : 'Próximo'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetModal;