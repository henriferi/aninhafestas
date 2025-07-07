import React from 'react';
import { Star, ArrowRight } from 'lucide-react';

export interface Event {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  price: string;
  category: 'infantil' | 'adulto' | 'corporativo';
  mainImage: string;
  gallery: string[];
  features: string[];
  popular: boolean;
  user_id: string;
}

export interface EventCardProps {
  event: Event;
  onClick: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 cursor-pointer group" onClick={onClick}>
      <div className="relative">
        <img
          src={event.mainImage}
          alt={event.title}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {event.popular && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
            <Star className="w-4 h-4" />
            <span>Popular</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${event.category === 'infantil' ? 'bg-pink-100 text-pink-800' :
              event.category === 'adulto' ? 'bg-purple-100 text-purple-800' :
                'bg-blue-100 text-blue-800'
            }`}>
            {event.category === 'infantil' ? 'Infantil' :
              event.category === 'adulto' ? 'Adulto' : 'Corporativo'}
          </span>
          <span className="text-2xl font-bold text-gray-800">R${event.price}</span>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
        <p className="text-gray-600 mb-4">{event.subtitle}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2 text-pink-500 font-semibold group-hover:text-pink-600 transition-colors">
            <span>Ver mais</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;