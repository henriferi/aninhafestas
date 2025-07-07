export interface Event {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  price: string;
  mainImage: string;
  gallery: string[];
  features: string[];
  category: 'infantil' | 'adulto' | 'corporativo';
  popular?: boolean;
}