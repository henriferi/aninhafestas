export const getAuthHeaders = (authRequired = true) => {
  const apiKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const token = localStorage.getItem('token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'apikey': apiKey,
  };

  if (authRequired) {
    if (!token) {
      console.warn('⚠ Tentando fazer uma requisição privada sem token');
      throw new Error('Token de autenticação não encontrado');
    }

    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};


export const getUserId = (): string | null => {
  return localStorage.getItem('user_id');
};


