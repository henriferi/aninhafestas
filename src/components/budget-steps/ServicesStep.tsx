import React, { useEffect, useState } from 'react';
import { Check, Plus } from 'lucide-react';
import { getAuthHeaders } from '../../lib/apiHelpers';

interface ServicesStepProps {
  selectedServices: string[];
  onToggle: (serviceId: string) => void;
}

interface AdditionalService {
  id: string;
  nome: string;
  descricao: string;
}

const ServicesStep: React.FC<ServicesStepProps> = ({ selectedServices, onToggle }) => {
  const [services, setServices] = useState<AdditionalService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/servicos_adicionais?select=id,nome,descricao`, {
          headers: getAuthHeaders(false), // sem autenticação obrigatória
        });

        if (!res.ok) throw new Error('Erro ao buscar serviços adicionais');
        const data = await res.json();
        setServices(data);
      } catch (err: any) {
        setError(err.message || 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) return <p>Carregando serviços adicionais...</p>;
  if (error) return <p className="text-red-500">Erro: {error}</p>;

  return (
    <div>
      <div className="mb-4 sm:mb-6">
        <p className="text-sm sm:text-base text-gray-600">
          Adicione serviços extras para tornar sua festa ainda mais especial.
          Todos os serviços são opcionais e serão incluídos no orçamento personalizado.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {services.map((service) => {
          const isSelected = selectedServices.includes(service.id);

          return (
            <button
              key={service.id}
              onClick={() => onToggle(service.id)}
              className={`relative p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all text-left hover:scale-105 ${
                isSelected
                  ? 'border-pink-500 bg-pink-50 shadow-lg'
                  : 'border-gray-200 hover:border-pink-300'
              }`}
            >
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <h3 className="font-bold text-gray-800 pr-4 text-sm sm:text-base">{service.nome}</h3>
                <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  isSelected
                    ? 'bg-pink-500 border-pink-500'
                    : 'border-gray-300'
                }`}>
                  {isSelected ? (
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  ) : (
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                  )}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-gray-600">{service.descricao}</p>

              {isSelected && (
                <div className="mt-2 sm:mt-3">
                  <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">
                    Selecionado
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {selectedServices.length > 0 && (
        <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl sm:rounded-2xl">
          <h4 className="font-semibold text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base">
            Serviços Adicionais Selecionados ({selectedServices.length})
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-1 sm:gap-2">
            {selectedServices.map((id) => {
              const service = services.find((s) => s.id === id);
              return service ? (
                <div key={id} className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <span className="text-xs sm:text-sm text-gray-700">{service.nome}</span>
                </div>
              ) : null;
            })}
          </div>

          <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-white rounded-lg">
            <p className="text-xs sm:text-sm text-gray-600">
              💡 <strong>Dica:</strong> Estes serviços serão incluídos no seu orçamento personalizado.
              Nossa equipe entrará em contato para detalhar cada serviço e apresentar as melhores opções.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesStep;
