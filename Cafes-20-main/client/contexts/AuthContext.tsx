import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '@/services/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, isAdmin?: boolean) => Promise<void>;
  logout: (isAdmin?: boolean) => void;
  checkAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
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

  // Load auth state from localStorage on mount
  useEffect(() => {
    const initAuth = () => {
      try {
        // Check for admin token first, then user token
        const adminToken = localStorage.getItem('adminToken');
        const adminToken = localStorage.getItem('adminToken');
        const userToken = localStorage.getItem('userToken');
        const storedToken = adminToken || userToken;

        if (storedToken) {
          // Get stored user data
          const adminData = localStorage.getItem('admin');
          const userData = localStorage.getItem('user');
          const storedUser = adminData || userData;

          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setToken(storedToken);
            console.log('✅ Auth restored from localStorage:', parsedUser.email);
          } else {
            // Token exists but no user data - clear everything
