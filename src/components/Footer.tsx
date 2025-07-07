import React from 'react';
import { Phone, Mail, MapPin, Instagram, Facebook, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <div>
                <h3 id="contato" className="text-xl font-bold">Aninha Festas</h3>
                <p className="text-gray-400 text-sm">Festas & Eventos</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              Transformamos seus sonhos em realidade há mais de 10 anos, criando momentos únicos e inesquecíveis.
            </p>
            <div className="flex space-x-4">
              <button className="bg-gradient-to-r from-pink-500 to-purple-600 p-2 rounded-full hover:from-pink-600 hover:to-purple-700 transition-all">
                <Instagram className="w-5 h-5" />
              </button>
              <button className="bg-gradient-to-r from-pink-500 to-purple-600 p-2 rounded-full hover:from-pink-600 hover:to-purple-700 transition-all">
                <Facebook className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Serviços</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Aniversários Infantis</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Casamentos</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Batizados</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Eventos Corporativos</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Formaturas</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Chá de Bebê</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Empresa</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Sobre Nós</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Nossa Equipe</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Galeria</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Depoimentos</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contato</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-pink-500" />
                <span className="text-gray-400">(11) 9999-9999</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-pink-500" />
                <span className="text-gray-400">anacrisfesta@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-pink-500" />
                <span className="text-gray-400">Recife, PE</span>
              </div>
            </div>
            
            <div className="mt-6">
              <h5 className="font-semibold mb-2">Horário de Atendimento</h5>
              <p className="text-gray-400 text-sm">Segunda a Sexta: 9h às 18h</p>
              <p className="text-gray-400 text-sm">Sábado: 9h às 14h</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400 flex items-center justify-center space-x-2">
            <span>© 2024 Aninha Festas</span>
            <Heart className="w-4 h-4 text-pink-500" />
            <span>Criado e mantido por - Henrique Fernandes</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;