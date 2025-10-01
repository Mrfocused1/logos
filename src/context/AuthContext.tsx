import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  role: 'admin';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on app load
  useEffect(() => {
    const checkSession = () => {
      try {
        const token = localStorage.getItem('admin_token');
        const userData = localStorage.getItem('admin_user');

        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          const tokenData = JSON.parse(atob(token.split('.')[1])); // Decode JWT-like token

          // Check if token is expired (24 hours)
          if (tokenData.exp > Date.now()) {
            setUser(parsedUser);
          } else {
            // Token expired, clear storage
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_user');
          }
        }
      } catch (error) {
        console.error('Session check failed:', error);
        // Clear corrupted data
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Hardcoded credentials from environment variables
      const validUsername = import.meta.env.VITE_ADMIN_USERNAME || 'admin';
      const validPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

      if (username === validUsername && password === validPassword) {
        const userData: User = {
          id: 'admin_1',
          username: validUsername,
          role: 'admin',
        };

        // Create a simple JWT-like token
        const tokenData = {
          userId: userData.id,
          username: userData.username,
          role: userData.role,
          iat: Date.now(),
          exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        };

        const token = btoa(JSON.stringify({ header: 'fake' })) + '.' +
                     btoa(JSON.stringify(tokenData)) + '.' +
                     btoa(JSON.stringify({ signature: 'fake' }));

        // Store in localStorage
        localStorage.setItem('admin_token', token);
        localStorage.setItem('admin_user', JSON.stringify(userData));

        setUser(userData);
        setLoading(false);

        return { success: true };
      } else {
        setLoading(false);
        return { success: false, error: 'Invalid username or password' };
      }
    } catch (error) {
      setLoading(false);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};