import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Phone, MapPin, Users, Clock, Star } from 'lucide-react';
import { getAuthHeaders } from '../lib/apiHelpers';

const FacilitiesSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [spaceSlides, setSpaceSlides] = useState<any[]>([]);

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const baseUrl = import.meta.env.VITE_SUPABASE_URL;
        const headers = getAuthHeaders(false);
        const response = await fetch(`${baseUrl}/nosso_espaco?select=id,titulo,descricao,imagem,caracteristicas`, { headers });
        const data = await response.json();

        setSpaceSlides(data);
      } catch (error) {
        console.error('Erro ao buscar espaços:', error);
      }
    };

    fetchSpaces();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % spaceSlides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [spaceSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % spaceSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + spaceSlides.length) % spaceSlides.length);
  };

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.equipment-card').forEach(card => {
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  if (!spaceSlides.length) {
    return <div className="text-center py-10 text-gray-500">Carregando espaços...</div>;
  }

  return (
    <section id="espacos" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Nosso Espaço e Equipamentos
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Conheça nosso espaço completo e todos os equipamentos disponíveis para tornar sua festa ainda mais especial
          </p>
        </div>

        <div className="mb-20">
          <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">Nossos Espaços</h3>
          <div className="relative h-[500px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
            {spaceSlides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${slide.imagem})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40 md:from-black/70 md:via-black/50 md:to-transparent" />
                <div className="relative z-10 h-full flex items-center">
                  <div className="w-full max-w-4xl mx-auto px-4 md:px-8 text-white">
                    <div className="max-w-2xl">
                      <h4 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 leading-tight">
                        {slide.titulo}
                      </h4>
                      <p className="text-base md:text-xl mb-6 md:mb-8 leading-relaxed">
                        {slide.descricao}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 mb-6 md:mb-8">
                        {slide.caracteristicas.map((feature: string, idx: number) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-current flex-shrink-0" />
                            <span className="text-sm md:text-lg">{feature}</span>
                          </div>
                        ))}
                      </div>
                      <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center space-x-2">
                        <Phone className="w-4 h-4 md:w-5 md:h-5" />
                        <span>Entrar em Contato</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={prevSlide}
              className="absolute left-2 md:left-6 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 md:p-4 rounded-full transition-all z-20 backdrop-blur-sm"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 md:right-6 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 md:p-4 rounded-full transition-all z-20 backdrop-blur-sm"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <div className="absolute bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 md:space-x-3 z-20">
              {spaceSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-all ${index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Resto da seção de equipamentos permanece igual */}
      </div>
    </section>
  );
};

export default FacilitiesSection;
