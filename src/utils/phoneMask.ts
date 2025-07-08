export const formatPhoneNumber = (value: string): string => {
  // Remove todos os caracteres não numéricos
  const numbers = value.replace(/\D/g, '');
  
  // Limita a 11 dígitos (DDD + 9 dígitos)
  const limitedNumbers = numbers.slice(0, 11);
  
  // Aplica a máscara baseada no número de dígitos
  if (limitedNumbers.length <= 2) {
    return limitedNumbers;
  } else if (limitedNumbers.length <= 7) {
    return `${limitedNumbers.slice(0, 2)} ${limitedNumbers.slice(2)}`;
  } else {
    return `${limitedNumbers.slice(0, 2)} ${limitedNumbers.slice(2, 7)}-${limitedNumbers.slice(7)}`;
  }
};

export const validatePhoneNumber = (phone: string): boolean => {
  // Remove formatação para validar apenas os números
  const numbers = phone.replace(/\D/g, '');
  
  // Verifica se tem exatamente 11 dígitos (DDD + 9 dígitos do celular)
  // ou 10 dígitos (DDD + 8 dígitos do telefone fixo)
  return numbers.length === 10 || numbers.length === 11;
};

export const getPhoneNumbers = (phone: string): string => {
  return phone.replace(/\D/g, '');
};