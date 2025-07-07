import React, { useState } from 'react';
import {
  LayoutDashboard,
  Images,
  Settings,
  Users,
  Package,
  MapPin,
  LogOut,
  Home,
  Calendar,
  Star,
  Menu,
  X
} from 'lucide-react';
import HeroSlidesManager from '../../components/admin/HeroSlidesManager';
import ServicesManager from '../../components/admin/ServicesManager';
import BudgetManager from '../../components/admin/BudgetManager';
import SpacesManager from '../../components/admin/SpacesManager';
import EquipmentsManager from '../../components/admin/EquipmentsManager';
import ToastContainer from '../../components/ui/ToastContainer';
import { useToast } from '../../hooks/useToast';

interface AdminDashboardProps {
  onLogout: () => void;
}

type AdminSection = 'dashboard' | 'hero-slides' | 'services' | 'budget' | 'spaces' | 'equipments';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { toasts, removeToast, success } = useToast();

  const menuItems = [
    { id: 'dashboard' as AdminSection, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'hero-slides' as AdminSection, label: 'Slides Principais', icon: Images },
    { id: 'services' as AdminSection, label: 'Nossos Serviços', icon: Star },
    { id: 'budget' as AdminSection, label: 'Orçamento Personalizado', icon: Calendar },
    { id: 'spaces' as AdminSection, label: 'Nossos Espaços', icon: MapPin },
    { id: 'equipments' as AdminSection, label: 'Equipamentos', icon: Package },
  ];

  const handleMenuClick = (sectionId: AdminSection) => {
    setActiveSection(sectionId);
    setIsSidebarOpen(false);
    
    if (sectionId !== 'dashboard') {
      success('Seção carregada', `${menuItems.find(item => item.id === sectionId)?.label} carregado com sucesso!`);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'hero-slides':
        return <HeroSlidesManager />;
      case 'services':
        return <ServicesManager />;
      case 'budget':
        return <BudgetManager />;
      case 'spaces':
        return <SpacesManager />;
      case 'equipments':
        return <EquipmentsManager />;
      default:
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Bem-vindo ao Painel Administrativo</h2>
              <p className="text-gray-600 mb-6">
                Gerencie todo o conteúdo do site de forma fácil e intuitiva.
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {menuItems.slice(1).map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleMenuClick(item.id)}
                      className="p-4 border border-gray-200 rounded-xl hover:border-pink-300 hover:bg-pink-50 transition-all text-left"
                    >
                      <Icon className="w-6 h-6 text-pink-500 mb-2" />
                      <h3 className="font-semibold text-gray-800">{item.label}</h3>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">A</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-800">Painel ADM</h1>
                  <p className="text-xs text-gray-600">Aninha Festas</p>
                </div>
              </div>

              {/* Close button - apenas no mobile */}
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleMenuClick(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-left ${activeSection === item.id
                          ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium truncate">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={onLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">Sair</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>

              <div>
                <h1 className="text-xl lg:text-3xl font-bold text-gray-800">
                  {menuItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
                </h1>
                <p className="text-gray-600 text-sm lg:text-base hidden sm:block">
                  Gerencie o conteúdo do seu site
                </p>
              </div>
            </div>

            <button
              onClick={() => window.open('/', '_blank')}
              className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-2 lg:px-4 lg:py-2 rounded-xl hover:from-green-600 hover:to-green-700 transition-all text-sm lg:text-base"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Ver Site</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 lg:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default AdminDashboard;