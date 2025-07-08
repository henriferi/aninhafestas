import React from 'react';
import { MapPin, Home } from 'lucide-react';

interface LocationStepProps {
  selectedLocation: 'our-space' | 'client-space' | '';
  onSelect: (location: 'our-space' | 'client-space') => void;
}

const LocationStep: React.FC<LocationStepProps> = ({ selectedLocation, onSelect }) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <button
          onClick={() => onSelect('our-space')}
          className={`p-4 sm:p-8 rounded-xl sm:rounded-2xl border-2 transition-all text-left hover:scale-105 ${
            selectedLocation === 'our-space'
              ? 'border-pink-500 bg-pink-50 shadow-lg'
              : 'border-gray-200 hover:border-pink-300'
          }`}
        >
          <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <MapPin className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800">Nosso Espaço</h3>
          </div>
          <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
            Realize sua festa em nosso espaço completo e equipado, com toda a infraestrutura necessária.
          </p>
          <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-700">
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full"></div>
              <span>Equipamentos inclusos</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full"></div>
              <span>Estacionamento gratuito</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full"></div>
              <span>Limpeza inclusa</span>
            </div>
          </div>
        </button>

        <button
          onClick={() => onSelect('client-space')}
          className={`p-4 sm:p-8 rounded-xl sm:rounded-2xl border-2 transition-all text-left hover:scale-105 ${
            selectedLocation === 'client-space'
              ? 'border-pink-500 bg-pink-50 shadow-lg'
              : 'border-gray-200 hover:border-pink-300'
          }`}
        >
          <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-green-600 rounded-full flex items-center justify-center">
              <Home className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800">Seu Espaço</h3>
          </div>
          <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
            Levamos toda a festa até você! Montamos tudo no local de sua preferência.
          </p>
          <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-700">
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full"></div>
              <span>Montagem no local</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full"></div>
              <span>Transporte incluso</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full"></div>
              <span>Equipe especializada</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full"></div>
              <span>Desmontagem inclusa</span>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default LocationStep;