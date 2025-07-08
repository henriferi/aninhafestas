import { BudgetFormData } from '../types/budget';
import { getPhoneNumbers } from './phoneMask';

export function formatWhatsappMessage(
  formData: BudgetFormData,
  eventTypes: any[],
  equipments: any[],
  additionalServices: any[]
): string {
  let message = `Olá! Gostaria de solicitar um orçamento:\n\n`;

  message += `• Nome: ${formData.personalInfo.name}\n`;
  message += `• Telefone: ${formData.personalInfo.phone} (${getPhoneNumbers(formData.personalInfo.phone)})\n`;
  if (formData.personalInfo.email) message += `• Email: ${formData.personalInfo.email}\n`;
  if (formData.personalInfo.message) message += `• Mensagem adicional: ${formData.personalInfo.message}\n`;

  const selectedEventType = eventTypes.find(e => e.id === formData.eventType);
  if (selectedEventType) {
    message += `\n• Tipo de evento: ${selectedEventType.nome}\n`;
  }

  message += `• Local do Evento: ${
    formData.location === 'our-space'
      ? 'Nosso Espaço'
      : formData.location === 'client-space'
      ? 'Seu Espaço'
      : 'Não definido'
  }\n`;

  message += `• Duração: ${formData.duration} horas\n`;
  message += `• Convidados: ${formData.guestCount}\n`;
  message += `• Data: ${
    formData.date ? new Date(formData.date).toLocaleDateString('pt-BR') : 'Não definida'
  }\n`;

  if (formData.selectedEquipments.length > 0) {
    message += `\n• Equipamentos:\n`;
    formData.selectedEquipments.forEach((eqId) => {
      const eq = equipments.find((e) => e.id === eqId);
      if (eq) message += `- ${eq.nome}\n`;
    });
  }

  if (formData.additionalServices.length > 0) {
    message += `\n• Serviços adicionais:\n`;
    formData.additionalServices.forEach((serviceId) => {
      const service = additionalServices.find((s) => s.id === serviceId);
      if (service) message += `- ${service.nome}\n`;
    });
  }

  return message.trim(); // ← Retorna texto simples com emojis
}