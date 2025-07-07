import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/superbaseClient';

interface EventType {
  id: string;
  user_id: string;
  nome: string;
  descricao: string;
  icone: string;
}

interface EventTypeStepProps {
  selectedType: string;
  onSelect: (type: string) => void;
}

const EventTypeStep: React.FC<EventTypeStepProps> = ({ selectedType, onSelect }) => {
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEventTypes = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('tipo_evento')
        .select('id,user_id,nome,descricao,icone');

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      setEventTypes(data as EventType[]);
      setLoading(false);
    };

    fetchEventTypes();
  }, []);

  if (loading) return <p>Carregando tipos de evento...</p>;
  if (error) return <p className="text-red-500">Erro: {error}</p>;

  return (
    <div>
      <div className="mb-4 sm:mb-6">
        <p className="text-sm sm:text-base text-gray-600">
          Escolha o tipo de evento que você gostaria de realizar. Cada tipo tem características específicas que nos ajudam a personalizar sua festa.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {eventTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => onSelect(type.id)}
            className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all text-left hover:scale-105 ${
              selectedType === type.id
                ? 'border-pink-500 bg-pink-50 shadow-lg'
                : 'border-gray-200 hover:border-pink-300 hover:bg-pink-25'
            }`}
          >
            <div className="text-2xl sm:text-4xl mb-2 sm:mb-3">{type.icone}</div>
            <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-1 sm:mb-2">{type.nome}</h3>
            <p className="text-gray-600 text-xs sm:text-sm">{type.descricao}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EventTypeStep;
