export interface BudgetFormData {
  eventType: string;
  location: 'our-space' | 'client-space' | '';
  selectedEquipments: string[];
  duration: number;
  guestCount: number;
  date: string;
  additionalServices: string[];
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    message: string;
  };
}

export interface BudgetStep {
  id: number;
  title: string;
  description: string;
}

export interface EventTypeOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  basePrice: number;
}

export interface AdditionalService {
  id: string;
  name: string;
  description: string;
  price: number;
}