
import { useState, useEffect } from 'react';
import { User } from '@/utils/seedTypes';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const userString = localStorage.getItem('isra_user');
        const token = localStorage.getItem('isra_auth_token');
        
        if (userString && token) {
          const user = JSON.parse(userString) as User;
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false
          });
        } else {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false
          });
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
        // Clear invalid data
        localStorage.removeItem('isra_user');
        localStorage.removeItem('isra_auth_token');
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
      }
    };

    checkAuthStatus();
  }, []);

  const logout = () => {
    localStorage.removeItem('isra_user');
    localStorage.removeItem('isra_auth_token');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
  };

  return {
    ...authState,
    logout
  };
};
