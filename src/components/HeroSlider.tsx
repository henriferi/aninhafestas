import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { getAuthHeaders } from '../lib/apiHelpers';
import PageLoading from './ui/PageLoading';

interface Slide {
  id: string;
  titulo: string;
  subtitulo: string;
  imagem_url: string;
  user_id: string;
}

const API_BASE_URL = import.meta.env.VITE_SUPABASE_URL;

const HeroSlider: React.FC = () => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchSlides = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/slides_principais?select=*`, {
        headers: getAuthHeaders(false),
      });
      setSlides(res.data || []);
    } catch (err) {
      console.error('Erro ao buscar slides principais:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (loading) {
    return (
      <section id="inicio" className="relative h-screen overflow-hidden bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="flex items-center justify-center h-full">
          <PageLoading text="Carregando slides..." />
        </div>
      </section>
    );
  }

  if (slides.length === 0) {
    return (
      <section id="inicio" className="relative h-screen overflow-hidden bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-gray-600">
            <h2 className="text-3xl font-bold mb-4">Bem-vindos à Aninha Festas</h2>
            <p className="text-xl">Em breve teremos novos slides para você!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="inicio" className="relative h-screen overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${slide.imagem_url})` }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-40" />
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="text-center text-white max-w-4xl mx-auto px-4">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up">
                {slide.titulo}
              </h1>
              <p className="text-xl md:text-2xl mb-8 animate-slide-up animation-delay-300">
                {slide.subtitulo}
              </p>
              <a href='#servicos' className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105 animate-slide-up animation-delay-600">
                Conheça Nossos Serviços
              </a>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all z-20"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all z-20"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;