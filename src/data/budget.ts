import { EventTypeOption, AdditionalService, BudgetStep } from '../types/budget';

export const budgetSteps: BudgetStep[] = [
  {
    id: 1,
    title: 'Tipo de Evento',
    description: 'Escolha o tipo de festa que deseja realizar'
  },
  {
    id: 2,
    title: 'Local do Evento',
    description: 'Onde será realizada a festa?'
  },
  {
    id: 3,
    title: 'Equipamentos',
    description: 'Selecione os brinquedos e equipamentos'
  },
  {
    id: 4,
    title: 'Duração e Convidados',
    description: 'Defina a duração e número de convidados'
  },
  {
    id: 5,
    title: 'Serviços Adicionais',
    description: 'Escolha serviços extras para sua festa'
  },
  {
    id: 6,
    title: 'Resumo da Solicitação',
    description: 'Revise todos os detalhes da sua festa'
  },
  {
    id: 7,
    title: 'Seus Dados',
    description: 'Finalize com suas informações de contato'
  }
];

export const eventTypes: EventTypeOption[] = [
  {
    id: 'aniversario-infantil',
    name: 'Aniversário Infantil',
    description: 'Festa temática para crianças com decoração personalizada',
    icon: '🎂',
    basePrice: 0
  },
  {
    id: 'batizado',
    name: 'Batizado',
    description: 'Celebração religiosa especial e delicada',
    icon: '👼',
    basePrice: 0
  },
  {
    id: 'casamento',
    name: 'Casamento',
    description: 'Cerimônia e recepção dos seus sonhos',
    icon: '💒',
    basePrice: 0
  },
  {
    id: 'formatura',
    name: 'Formatura',
    description: 'Celebração de conquista acadêmica',
    icon: '🎓',
    basePrice: 0
  },
  {
    id: 'corporativo',
    name: 'Evento Corporativo',
    description: 'Confraternização e eventos empresariais',
    icon: '🏢',
    basePrice: 0
  },
  {
    id: 'cha-bebe',
    name: 'Chá de Bebê',
    description: 'Celebração da chegada do bebê',
    icon: '🍼',
    basePrice: 0
  }
];

export const additionalServices: AdditionalService[] = [
  {
    id: 'decoracao-premium',
    name: 'Decoração Premium',
    description: 'Decoração temática completa com flores naturais e elementos personalizados',
    price: 0
  },
  {
    id: 'fotografia',
    name: 'Fotografia Profissional',
    description: 'Cobertura fotográfica completa do evento com álbum digital',
    price: 0
  },
  {
    id: 'filmagem',
    name: 'Filmagem HD',
    description: 'Vídeo profissional com edição e entrega em alta qualidade',
    price: 0
  },
  {
    id: 'animacao',
    name: 'Animação Profissional',
    description: 'Animadores especializados para entreter os convidados',
    price: 0
  },
  {
    id: 'buffet-premium',
    name: 'Buffet Premium',
    description: 'Menu gourmet com opções especiais e serviço de garçons',
    price: 0
  },
  {
    id: 'som-iluminacao',
    name: 'Som e Iluminação Especial',
    description: 'Sistema profissional de som e efeitos de luz personalizados',
    price: 0
  },
  {
    id: 'seguranca',
    name: 'Segurança Especializada',
    description: 'Equipe de segurança treinada para eventos grandes',
    price: 0
  },
  {
    id: 'limpeza-pos',
    name: 'Limpeza Pós-Evento',
    description: 'Serviço completo de limpeza e organização após a festa',
    price: 0
  }
];