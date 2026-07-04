import { useState, useEffect } from 'react';
import { authService } from '../services/api';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar usuário do localStorage ao montar
  useEffect(() => {
    const loadUser = async () => {
      try {
        if (authService.isAuthenticated()) {
          const currentUser = authService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
          } else {
            // Se não há usuário no localStorage, buscar do backend
            const userData = await authService.me();
            setUser(userData);
          }
        }
      } catch (err) {
        setError(err.message);
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email, senha) => {
    try {
      setLoading(true);
      setError(null);
      await authService.login(email, senha);
      const userData = await authService.me();
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
  };
};

export default useAuth;
