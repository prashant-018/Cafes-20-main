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
            localStorage.clear();
            console.log('⚠️ Cleared invalid auth state');
          }
        }
      } catch (error) {
        console.error('❌ Error loading auth state:', error);
        localStorage.clear();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string, isAdmin = false) => {
    try {
      const endpoint = isAdmin ? '/auth/admin/login' : '/auth/login';
      const response = await apiService.post(endpoint, { email, password });

      const { token: newToken, user: newUser } = response.data;

      setUser(newUser);
      setToken(newToken);

      // Store in localStorage
      if (isAdmin) {
        localStorage.setItem('adminToken', newToken);
        localStorage.setItem('admin', JSON.stringify(newUser));
      } else {
        localStorage.setItem('userToken', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
      }

      console.log('✅ Login successful:', newUser.email);
    } catch (error: any) {
      console.error('❌ Login failed:', error);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const logout = (isAdmin = false) => {
    setUser(null);
    setToken(null);

    if (isAdmin) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('admin');
    } else {
      localStorage.removeItem('userToken');
      localStorage.removeItem('user');
    }

    console.log('✅ Logout successful');
  };

  const checkAuth = (): boolean => {
    return !!user && !!token;
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
