import React from 'react';
import { Phone, Mail, MapPin, Instagram, Facebook, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 lg:flex lg:justify-between">
          <div className="lg:w-1/3">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <div>
                <h3 id="contato" className="text-xl font-bold">Aninha Festas</h3>
                <p className="text-gray-400 text-sm">Festas & Eventos</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              Transformamos seus sonhos em realidade há mais de 15 anos, criando momentos únicos e inesquecíveis.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/aninhafestas_decoracaoolinda?igsh=ZXd5YjlvZ20xaTdr"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-pink-500 to-purple-600 p-2 rounded-full hover:from-pink-600 hover:to-purple-700 transition-all"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          <div className="lg:w-1/3">
            <h4 className="text-lg font-semibold mb-4">Serviços</h4>
            <ul className="space-y-2">
              <li className="text-gray-400 hover:text-white transition-colors">Festas Infantis</li>
              <li className="text-gray-400 hover:text-white transition-colors">Aniversários</li>
              <li className="text-gray-400 hover:text-white transition-colors">Eventos Corporativos</li>
              <li className="text-gray-400 hover:text-white transition-colors">Formaturas</li>
            </ul>
          </div>

          <div className="lg:w-1/3">
            <h4 className="text-lg font-semibold mb-4">Contato</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-pink-500" />
                <span className="text-gray-400">(81) 98831-6145</span>
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
            <span>© 2025 Aninha Festas</span>
            <Heart className="w-4 h-4 text-pink-500" />
            <span>Criado e mantido por - 
              <a 
                className="ml-1 text-transparent bg-gradient-to-r from-blue-500 via-blue-700 to-blue-500 bg-clip-text font-bold hover:from-green-500 hover:via-green-600 hover:to-green-600 hover:scale-110 transform transition-all duration-300 hover:drop-shadow-lg relative group" 
                target="_blank" 
                href="https://hfernandes.dev.br"
              >
                Fernandes Dev
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
              </a>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;