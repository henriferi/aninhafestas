import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                Aninha Festas
              </h1>
              <p className="text-xs text-gray-600">Festas & Eventos</p>
            </div>
          </div>

          <nav className="hidden md:flex space-x-8">
            <a href="#inicio" className="text-gray-700 hover:text-pink-500 transition-colors">Início</a>
            <a href="#servicos" className="text-gray-700 hover:text-pink-500 transition-colors">Serviços</a>
            <a href="#orcamento-personalizado" className="text-gray-700 hover:text-pink-500 transition-colors">Orçamento Personalizado</a>
            <a href="#espacos" className="text-gray-700 hover:text-pink-500 transition-colors">Espaços</a>
            <a href="#contato" className="text-gray-700 hover:text-pink-500 transition-colors">Contato</a>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1 text-gray-600">
                <Phone className="w-4 h-4" />
                <span>(81) 98831-6145</span>
              </div>
            </div>
            <a
              href="https://wa.me/5581988316145?text=Ol%C3%A1%2C%20gostaria%20de%20saber%20mais%20sobre%20os%20servi%C3%A7os%20da%20Aninha%20Festas!"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;