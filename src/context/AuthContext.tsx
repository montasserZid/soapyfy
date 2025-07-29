import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AdminUser } from '../types';
import { createUser, getUserByEmail, getAdminByCredentials } from '../services/firebaseService';

interface AuthContextType {
  user: User | null;
  admin: AdminUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  adminLogin: (username: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  adminLogout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
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
  const [admin, setAdmin] = useState<AdminUser | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('soapyfy_user');
    const savedAdmin = localStorage.getItem('soapyfy_admin');
    
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
      }
    }
    
    if (savedAdmin) {
      try {
        setAdmin(JSON.parse(savedAdmin));
      } catch (error) {
        console.error('Error loading admin from localStorage:', error);
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const foundUser = await getUserByEmail(email);
      if (foundUser && foundUser.password === password) {
        setUser(foundUser);
        localStorage.setItem('soapyfy_user', JSON.stringify(foundUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const adminLogin = async (username: string, password: string): Promise<boolean> => {
    try {
      const foundAdmin = await getAdminByCredentials(username, password);
      if (foundAdmin) {
        setAdmin(foundAdmin);
        localStorage.setItem('soapyfy_admin', JSON.stringify(foundAdmin));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Admin login error:', error);
      return false;
    }
  };

  const register = async (email: string, password: string): Promise<boolean> => {
    try {
      // Check if user already exists
      const existingUser = await getUserByEmail(email);
      if (existingUser) {
        return false;
      }

      // Create new user
      const userData = {
        email,
        password,
        createdAt: new Date().toISOString()
      };
      
      const newUser = await createUser(userData);

      // Log in the new user
      setUser(newUser);
      localStorage.setItem('soapyfy_user', JSON.stringify(newUser));
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('soapyfy_user');
  };

  const adminLogout = () => {
    setAdmin(null);
    localStorage.removeItem('soapyfy_admin');
  };

  return (
    <AuthContext.Provider value={{
      user,
      admin,
      login,
      adminLogin,
      register,
      logout,
      adminLogout,
      isAuthenticated: !!user,
      isAdmin: !!admin
    }}>
      {children}
    </AuthContext.Provider>
  );
};