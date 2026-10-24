import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, DemoPersona } from '@/types';
import { api } from '@/services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; full_name: string; workspace_name?: string }) => Promise<void>;
  loginWithPersona: (persona: DemoPersona) => Promise<void>;
  logout: () => void;
  isCreator: boolean;
  isReviewer: boolean;
  isLegal: boolean;
  isAdmin: boolean;
  canApprove: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('brandpilot_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('brandpilot_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function verifySession() {
      if (token) {
        try {
          const freshUser = await api.getMe();
          setUser(freshUser);
          localStorage.setItem('brandpilot_user', JSON.stringify(freshUser));
        } catch {
          logout();
        }
      }
      setIsLoading(false);
    }
    verifySession();
  }, [token]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await api.login(email, password);
      setToken(data.access_token);
      setUser(data.user);
      localStorage.setItem('brandpilot_token', data.access_token);
      localStorage.setItem('brandpilot_user', JSON.stringify(data.user));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: { email: string; password: string; full_name: string; workspace_name?: string }) => {
    setIsLoading(true);
    try {
      const res = await api.register(data);
      setToken(res.access_token);
      setUser(res.user);
      localStorage.setItem('brandpilot_token', res.access_token);
      localStorage.setItem('brandpilot_user', JSON.stringify(res.user));
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithPersona = async (persona: DemoPersona) => {
    await login(persona.email, persona.password);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('brandpilot_token');
    localStorage.removeItem('brandpilot_user');
  };

  const role = user?.role;
  const isCreator = role === 'CREATOR';
  const isReviewer = role === 'REVIEWER';
  const isLegal = role === 'LEGAL';
  const isAdmin = role === 'ADMIN';
  const canApprove = isReviewer || isLegal || isAdmin;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        loginWithPersona,
        logout,
        isCreator,
        isReviewer,
        isLegal,
        isAdmin,
        canApprove,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
