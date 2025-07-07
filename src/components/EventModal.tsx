import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Check, Phone, Mail } from 'lucide-react';
import { Event } from '../types/event';

interface EventModalProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
}

const EventModal: React.FC<EventModalProps> = ({ event, isOpen, onClose }) => {
  const [currentImage, setCurrentImage] = useState(0);

  // Fechar modal com ESC
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  // Fechar modal ao clicar no backdrop
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % event.gallery.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + event.gallery.length) % event.gallery.length);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-modal-in shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header fixo */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between rounded-t-3xl z-10">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 truncate pr-4">{event.title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Conteúdo com scroll */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="p-4 md:p-6">
            <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
              {/* Galeria de imagens */}
              <div>
                <div className="relative mb-4">
                  <img
                    src={event.gallery[currentImage]}
                    alt={event.title}
                    className="w-full h-64 md:h-80 object-cover rounded-2xl"
                  />
                  
                  {event.gallery.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full transition-all"
                      >
                        <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                      
                      <button
                        onClick={nextImage}
                        className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full transition-all"
                      >
                        <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                    </>
                  )}
                </div>
                
                {/* Thumbnails */}
                {event.gallery.length > 1 && (
                  <div className="flex space-x-2 overflow-x-auto pb-2">
                    {event.gallery.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImage(index)}
                        className={`flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          index === currentImage ? 'border-pink-500' : 'border-gray-200'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${event.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Informações do evento */}
              <div>
                <div className="mb-6">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4 ${
                    event.category === 'infantil' ? 'bg-pink-100 text-pink-800' :
                    event.category === 'adulto' ? 'bg-purple-100 text-purple-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {event.category === 'infantil' ? 'Infantil' : 
                     event.category === 'adulto' ? 'Adulto' : 'Corporativo'}
                  </span>
                  
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">{event.subtitle}</h3>
                  <p className="text-gray-700 leading-relaxed">{event.description}</p>
                </div>
                
                {/* Features */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">O que está incluído:</h4>
                  <ul className="space-y-2">
                    {event.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Check className="w-4 h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm md:text-base">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Pricing and actions */}
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 md:p-6 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl md:text-3xl font-bold text-gray-800">R${event.price}</span>
                    {event.popular && (
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-2 rounded-full text-sm font-semibold">
                        Popular
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105">
                      Solicitar Orçamento
                    </button>
                    
                    <div className="flex space-x-3">
                      <button className="flex-1 flex items-center justify-center space-x-2 bg-white border-2 border-pink-200 text-pink-600 py-3 rounded-xl font-semibold hover:bg-pink-50 transition-colors">
                        <Phone className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="text-sm md:text-base">Ligar</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;