import React from 'react';
import { Sparkles } from 'lucide-react';

interface PageLoadingProps {
  text?: string;
}

const PageLoading: React.FC<PageLoadingProps> = ({ text = 'Carregando...' }) => {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center space-y-6">
      <div className="relative">
        {/* Círculo externo */}
        <div className="w-16 h-16 border-4 border-pink-200 rounded-full animate-spin">
          <div className="w-full h-full border-4 border-transparent border-t-pink-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }} />
        </div>
        
        {/* Ícone central */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-pink-500 animate-pulse" />
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-700 animate-pulse">{text}</p>
        <div className="flex space-x-1 mt-2 justify-center">
          <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
};

export default PageLoading;