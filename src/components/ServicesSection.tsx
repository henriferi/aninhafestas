import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventCard, { Event } from './EventCard';
import EventModal from './EventModal';
import { getAuthHeaders } from '../lib/apiHelpers';

const API_BASE_URL = import.meta.env.VITE_SUPABASE_URL;

const ServicesSection: React.FC = () => {
  const [services, setServices] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchServices = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/servicos?select=*`, {
        headers: getAuthHeaders(false), 
      });

      const sanitized: Event[] = (res.data || []).map((item: any) => ({
        id: item.id,
        title: item.titulo,
        subtitle: item.subtitulo,
        description: item.descricao,
        price: typeof item.preco === 'number' ? item.preco.toFixed(2) : item.preco,
        category: item.categoria,
        mainImage: item.imagem_principal,
        gallery: Array.isArray(item.galeria) ? item.galeria : [],
        features: Array.isArray(item.caracteristicas) ? item.caracteristicas : [],
        popular: !!item.popular,
        user_id: item.user_id,
      }));

      setServices(sanitized);
    } catch (err) {
      console.error('Erro ao carregar serviços:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);

    setTimeout(() => {
      const servicesSection = document.getElementById('servicos');
      if (servicesSection) {
        const sectionRect = servicesSection.getBoundingClientRect();
        const sectionTop = window.pageYOffset + sectionRect.top;
        const sectionHeight = sectionRect.height;
        const windowHeight = window.innerHeight;

        const targetPosition = sectionTop + sectionHeight / 2 - windowHeight / 2;

        window.scrollTo({
          top: Math.max(0, targetPosition),
          behavior: 'smooth',
        });
      }
    }, 100);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  if (loading) {
    return (
      <section id="servicos" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center text-gray-500">
          Carregando serviços...
        </div>
      </section>
    );
  }

  if (services.length === 0) {
    return (
      <section id="servicos" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center text-gray-500">
          Nenhum serviço disponível.
        </div>
      </section>
    );
  }

  return (
    <section id="servicos" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Nossos Serviços
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transformamos seus momentos especiais em memórias inesquecíveis
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onClick={() => handleEventClick(event)}
            />
          ))}
        </div>
      </div>

      {selectedEvent && (
        <EventModal event={selectedEvent} isOpen={isModalOpen} onClose={closeModal} />
      )}
    </section>
  );
};

export default ServicesSection;
