import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import axios from 'axios';
import { getAuthHeaders } from '../../lib/apiHelpers';

interface Equipment {
  id: string;
  name: string;
  description: string;
  image: string;
  ageRange: string;
  capacity: string;
}

interface EquipmentStepProps {
  selectedEquipments: string[];
  onToggle: (equipmentId: string) => void;
}

const API_BASE_URL = import.meta.env.VITE_SUPABASE_URL;

const EquipmentStep: React.FC<EquipmentStepProps> = ({ selectedEquipments, onToggle }) => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEquipments = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/equipamentos?select=id,nome,descricao,imagem,faixa_etaria,capacidade`, {
        headers: getAuthHeaders(false),
      });

      const transformed: Equipment[] = res.data.map((item: any) => ({
        id: item.id,
        name: item.nome,
        description: item.descricao,
        image: item.imagem,
        ageRange: item.faixa_etaria,
        capacity: item.capacidade,
      }));

      setEquipments(transformed);
    } catch (err: any) {
      console.error('Erro ao buscar equipamentos:', err);
      setError('Erro ao carregar os equipamentos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipments();
  }, []);

  if (loading) return <p>Carregando equipamentos...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <div className="mb-4 sm:mb-6">
        <p className="text-sm sm:text-base text-gray-600">
          Selecione os equipamentos e brinquedos que deseja incluir na sua festa. 
          Você pode escolher quantos quiser!
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {equipments.map((equipment) => {
          const isSelected = selectedEquipments.includes(equipment.id);

          return (
            <button
              key={equipment.id}
              onClick={() => onToggle(equipment.id)}
              className={`relative p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all text-left hover:scale-105 ${
                isSelected
                  ? 'border-pink-500 bg-pink-50 shadow-lg'
                  : 'border-gray-200 hover:border-pink-300'
              }`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3 w-5 h-5 sm:w-6 sm:h-6 bg-pink-500 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
              )}

              <img
                src={equipment.image}
                alt={equipment.name}
                className="w-full h-24 sm:h-32 object-cover rounded-lg mb-2 sm:mb-3"
              />

              <h3 className="font-bold text-gray-800 mb-1 text-sm sm:text-base">{equipment.name}</h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-2">{equipment.description}</p>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{equipment.ageRange}</span>
                <span>{equipment.capacity}</span>
              </div>
            </button>
          );
        })}
      </div>

      {selectedEquipments.length > 0 && (
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-green-50 rounded-xl">
          <h4 className="font-semibold text-green-800 mb-2 text-sm sm:text-base">
            Equipamentos Selecionados ({selectedEquipments.length})
          </h4>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {selectedEquipments.map((equipmentId) => {
              const equipment = equipments.find(e => e.id === equipmentId);
              return equipment ? (
                <span
                  key={equipmentId}
                  className="px-2 sm:px-3 py-1 bg-green-200 text-green-800 rounded-full text-xs sm:text-sm"
                >
                  {equipment.name}
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentStep;
