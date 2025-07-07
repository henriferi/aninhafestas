import React, { useState } from 'react';
import { Calculator, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import BudgetModal from './BudgetModal';

const CustomBudgetSection: React.FC = () => {
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  const features = [
    'Escolha o tipo de evento ideal',
    'Selecione equipamentos personalizados',
    'Defina duração e número de convidados',
    'Adicione serviços extras',
    'Receba orçamento detalhado'
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className="mb-12">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Novo</span>
            </div>
            
            <h2 id="orcamento-personalizado" className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Orçamento Personalizado
            </h2>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Crie sua festa dos sonhos com nosso sistema inteligente. 
              Escolha cada detalhe e receba um orçamento sob medida em minutos!
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-700 font-medium">{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA Card */}
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-600/5"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-200 to-green-200 rounded-full translate-y-12 -translate-x-12 opacity-50"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Calculator className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                Pronto para começar?
              </h3>
              
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Nosso sistema guiará você passo a passo para criar o orçamento perfeito para sua festa.
              </p>
              
              <button
                onClick={() => setIsBudgetModalOpen(true)}
                className="inline-flex items-center space-x-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Calculator className="w-5 h-5" />
                <span>Criar Orçamento Personalizado</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <p className="text-sm text-gray-500 mt-4">
                ✨ Gratuito • ⚡ Rápido • 📱 Fácil de usar
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-1">
                500+
              </div>
              <div className="text-gray-600 text-sm">Festas Realizadas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-500 to-blue-600 bg-clip-text text-transparent mb-1">
                98%
              </div>
              <div className="text-gray-600 text-sm">Satisfação</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-500 to-green-600 bg-clip-text text-transparent mb-1">
                24h
              </div>
              <div className="text-gray-600 text-sm">Resposta</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-500 to-pink-600 bg-clip-text text-transparent mb-1">
                10+
              </div>
              <div className="text-gray-600 text-sm">Anos de Experiência</div>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Modal */}
      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
      />
    </section>
  );
};

export default CustomBudgetSection;