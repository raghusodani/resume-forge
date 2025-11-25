'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';

interface AuthContextType {
  token: string | null;
  username: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for existing token on mount
    const storedToken = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    
    if (storedToken && storedUsername) {
      setToken(storedToken);
      setUsername(storedUsername);
    }
    
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const data = await apiClient.login(username, password);
      
      // JWT response: { access_token, token_type, username }
      setToken(data.access_token);
      setUsername(data.username);
      
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('username', data.username);
      
      router.push('/dashboard');
    } catch (error) {
      throw error;
    }
  };

  const signup = async (username: string, password: string) => {
    try {
      const data = await apiClient.signup(username, password);
      
      setToken(data.access_token);
      setUsername(data.username);
      
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('username', data.username);
      
      router.push('/dashboard');
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUsername(null);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        username,
        isAuthenticated: !!token,
        login,
        signup,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
