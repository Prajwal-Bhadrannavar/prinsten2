import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../services/api';

interface User {
  id: string;
  username: string;
  email: string;
  role?: string;
  isAdmin?: boolean;
  isVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  register: (username: string, email: string, password: string, adminSecretKey?: string) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (token: string, user: User) => {
    // Normalize user data to handle both role and isAdmin fields
    const normalizedUser: User = {
      ...user,
      role: user.role || (user.isAdmin ? 'admin' : 'user'),
    };
    
    setToken(token);
    setUser(normalizedUser);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(normalizedUser));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const register = async (username: string, email: string, password: string, adminSecretKey?: string) => {
    try {
      const response = await authAPI.register({
        username,
        email,
        password,
        confirmPassword: password
      });
      
      if (response.success && response.token) {
        const normalizedUser: User = {
          ...response.user,
          role: response.user.role || 'user',
        };
        
        setToken(response.token);
        setUser(normalizedUser);
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(normalizedUser));
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const value = {
    user,
    token,
    login,
    logout,
    register,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
