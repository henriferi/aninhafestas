import React from 'react';
import { Clock, Users, Calendar } from 'lucide-react';

interface DurationStepProps {
  duration: number;
  guestCount: number;
  date: string;
  onDurationChange: (duration: number) => void;
  onGuestCountChange: (count: number) => void;
  onDateChange: (date: string) => void;
}

const DurationStep: React.FC<DurationStepProps> = ({
  duration,
  guestCount,
  date,
  onDurationChange,
  onGuestCountChange,
  onDateChange
}) => {
  const durationOptions = [2, 3, 4, 5, 6, 8];
  const guestOptions = [20, 30, 50, 80, 100, 150, 200];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Duration Selection */}
      <div>
        <div className="flex items-center space-x-2 mb-3 sm:mb-4">
          <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-800">Duração da Festa</h3>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
          {durationOptions.map((hours) => (
            <button
              key={hours}
              onClick={() => onDurationChange(hours)}
              className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all text-center hover:scale-105 ${
                duration === hours
                  ? 'border-pink-500 bg-pink-50 text-pink-700'
                  : 'border-gray-200 hover:border-pink-300'
              }`}
            >
              <div className="font-bold text-sm sm:text-lg">{hours}h</div>
              <div className="text-xs text-gray-500">
                {hours === 2 ? 'Básico' : 
                 hours === 4 ? 'Popular' : 
                 hours === 6 ? 'Completo' : 
                 hours === 8 ? 'Premium' : ''}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Guest Count Selection */}
      <div>
        <div className="flex items-center space-x-2 mb-3 sm:mb-4">
          <Users className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-800">Número de Convidados</h3>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3">
          {guestOptions.map((count) => (
            <button
              key={count}
              onClick={() => onGuestCountChange(count)}
              className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all text-center hover:scale-105 ${
                guestCount === count
                  ? 'border-pink-500 bg-pink-50 text-pink-700'
                  : 'border-gray-200 hover:border-pink-300'
              }`}
            >
              <div className="font-bold text-sm sm:text-lg">{count}</div>
              <div className="text-xs text-gray-500">pessoas</div>
            </button>
          ))}
        </div>
        
        {/* Custom guest count */}
        <div className="mt-3 sm:mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ou informe um número personalizado:
          </label>
          <input
            type="number"
            min="1"
            max="500"
            value={guestCount}
            onChange={(e) => onGuestCountChange(parseInt(e.target.value) || 0)}
            className="w-full sm:w-48 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base"
            placeholder="Ex: 75"
          />
        </div>
      </div>

      {/* Date Selection */}
      <div>
        <div className="flex items-center space-x-2 mb-3 sm:mb-4">
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-800">Data Preferencial</h3>
        </div>
        <div className="max-w-md">
          <input
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base"
          />
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            Selecione a data em que gostaria de realizar o evento
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 sm:p-6 rounded-xl sm:rounded-2xl">
        <h4 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">Resumo da Configuração</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
          <div className="flex items-center space-x-2">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-pink-500" />
            <span><strong>{duration} horas</strong> de festa</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-3 h-3 sm:w-4 sm:h-4 text-pink-500" />
            <span><strong>{guestCount} convidados</strong></span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-pink-500" />
            <span>
              {date ? (
                <strong>{new Date(date).toLocaleDateString('pt-BR')}</strong>
              ) : (
                'Data não selecionada'
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DurationStep;