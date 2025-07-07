import React, { useEffect, useState } from 'react';
import AdminLogin from '../admin/AdminLogin';
import AdminDashboard from '../admin/AdminDashboard';
import { supabase } from '../../lib/superbaseClient';

const AdminApp: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); 

  // Verifica se o usuário está autenticado ao abrir o app
  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data.session) {
        setIsAuthenticated(true);
        localStorage.setItem('token', data.session.access_token);
        localStorage.setItem('user_id', data.session.user.id);
      } else {
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        localStorage.removeItem('user_id'); 
      }
      setLoading(false);
    };

    checkSession();

    // Escuta mudanças na sessão (ex: login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (session) {
        localStorage.setItem('token', session.access_token);
        localStorage.setItem('user_id', session.user.id);
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    localStorage.clear();
  };

  if (loading) {
    return <div className="p-10 text-center text-gray-500">Carregando...</div>;
  }

  return (
    <>
      {isAuthenticated ? (
        <AdminDashboard onLogout={handleLogout} />
      ) : (
        <AdminLogin />
      )}
    </>
  );
};

export default AdminApp;
