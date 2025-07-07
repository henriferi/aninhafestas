import { SpaceSlide, Equipment } from '../types/facility';

export const spaceSlides: SpaceSlide[] = [
  {
    id: 'salao-principal',
    title: 'Salão Principal',
    description: 'Amplo salão climatizado com capacidade para até 150 pessoas, equipado com som ambiente, iluminação LED e palco para apresentações. O espaço perfeito para festas de grande porte.',
    image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=1600',
    features: ['Capacidade: 150 pessoas', 'Ar condicionado central', 'Sistema de som profissional', 'Iluminação LED colorida', 'Palco para apresentações', 'Pista de dança']
  },
  {
    id: 'area-kids',
    title: 'Área Kids Especializada',
    description: 'Espaço especialmente projetado para crianças, com piso emborrachado antiderrapante, decoração lúdica e área de segurança. Um ambiente mágico onde os pequenos podem brincar com total segurança.',
    image: 'https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=1600',
    features: ['Capacidade: 80 crianças', 'Piso emborrachado antiderrapante', 'Decoração temática colorida', 'Área totalmente segura', 'Brinquedos fixos inclusos', 'Monitoramento constante']
  },
  {
    id: 'jardim-externo',
    title: 'Jardim Externo',
    description: 'Área externa com jardim paisagístico e gramado natural, ideal para eventos ao ar livre. Inclui churrasqueira gourmet, mesas rústicas e iluminação especial para eventos noturnos.',
    image: 'https://images.pexels.com/photos/1729931/pexels-photo-1729931.jpeg?auto=compress&cs=tinysrgb&w=1600',
    features: ['Capacidade: 100 pessoas', 'Jardim paisagístico', 'Churrasqueira gourmet', 'Mesas rústicas ao ar livre', 'Iluminação noturna especial', 'Área verde natural']
  },
  {
    id: 'salao-vip',
    title: 'Salão VIP Premium',
    description: 'Ambiente sofisticado e reservado, perfeito para eventos corporativos e celebrações íntimas. Decoração elegante, sistema audiovisual completo e bar integrado.',
    image: 'https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=1600',
    features: ['Capacidade: 60 pessoas', 'Ambiente climatizado premium', 'Decoração sofisticada', 'Sistema audiovisual completo', 'Bar integrado', 'Serviço personalizado']
  }
];

export const equipments: Equipment[] = [
  {
    id: 'cama-elastica',
    name: 'Cama Elástica Gigante',
    description: 'Cama elástica profissional com rede de proteção de alta qualidade e estrutura reforçada.',
    image: 'https://images.pexels.com/photos/8613264/pexels-photo-8613264.jpeg?auto=compress&cs=tinysrgb&w=800',
    ageRange: '3-12 anos',
    capacity: '6 crianças',
    features: ['Rede de proteção resistente', 'Estrutura galvanizada', 'Lona importada', 'Certificação de segurança']
  },
  {
    id: 'piscina-bolinha',
    name: 'Piscina de Bolinha Colorida',
    description: 'Grande piscina com milhares de bolinhas coloridas, bordas acolchoadas e fácil acesso.',
    image: 'https://images.pexels.com/photos/8613090/pexels-photo-8613090.jpeg?auto=compress&cs=tinysrgb&w=800',
    ageRange: '1-8 anos',
    capacity: '10 crianças',
    features: ['Bolinhas atóxicas coloridas', 'Bordas acolchoadas', 'Fácil higienização', 'Acesso facilitado']
  },
  {
    id: 'toboga-inflavel',
    name: 'Tobogã Inflável Gigante',
    description: 'Tobogã inflável com escorregador duplo, área de escalada e piscina de espuma.',
    image: 'https://images.pexels.com/photos/8613265/pexels-photo-8613265.jpeg?auto=compress&cs=tinysrgb&w=800',
    ageRange: '4-14 anos',
    capacity: '8 crianças',
    features: ['Escorregador duplo', 'Área de escalada', 'Material PVC reforçado', 'Ventilador potente incluso']
  },
  {
    id: 'castelo-pula-pula',
    name: 'Castelo Pula-Pula Temático',
    description: 'Castelo inflável com tema de princesas e super-heróis, área ampla para pular e brincar.',
    image: 'https://images.pexels.com/photos/8613091/pexels-photo-8613091.jpeg?auto=compress&cs=tinysrgb&w=800',
    ageRange: '3-10 anos',
    capacity: '12 crianças',
    features: ['Design temático exclusivo', 'Área ampla de diversão', 'Material resistente', 'Fácil montagem']
  },
  {
    id: 'mesa-pebolim',
    name: 'Mesa de Pebolim Profissional',
    description: 'Mesa de pebolim oficial com estrutura robusta, ideal para torneios e competições.',
    image: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=800',
    ageRange: '6+ anos',
    capacity: '4 jogadores',
    features: ['Mesa oficial regulamentada', 'Estrutura em madeira maciça', 'Bonecos balanceados', 'Placar integrado']
  },
  {
    id: 'fliperama',
    name: 'Fliperama Retrô Arcade',
    description: 'Máquina de fliperama com mais de 100 jogos clássicos dos anos 80 e 90.',
    image: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800',
    ageRange: '8+ anos',
    capacity: '2 jogadores',
    features: ['Mais de 100 jogos', 'Tela LCD 32 polegadas', 'Controles originais', 'Som estéreo']
  }
];