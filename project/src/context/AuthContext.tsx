import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, User } from '../types';
import { authAPI } from '../api';

interface AuthContextType {
  authState: AuthState;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (user: User) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: User) => Promise<boolean>;
}

const defaultAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  token: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      return {
        user: JSON.parse(storedUser),
        isAuthenticated: true,
        token: storedToken,
      };
    }
    
    return defaultAuthState;
  });

  useEffect(() => {
    if (authState.user && authState.token) {
      localStorage.setItem('user', JSON.stringify(authState.user));
      localStorage.setItem('token', authState.token);
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }, [authState]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authAPI.login(email, password);

      if (response.status === 200) {
        const data = response.data;
        
        setAuthState({
          user: data.user,
          isAuthenticated: true,
          token: data.token,
        });
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (user: User): Promise<boolean> => {
    try {
      const response = await authAPI.signup(user);

      if (response.status === 201) {
        const data = response.data;
        
        setAuthState({
          user: data.user,
          isAuthenticated: true,
          token: data.token,
        });
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = () => {
    setAuthState(defaultAuthState);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const updateUser = async (user: User): Promise<boolean> => {
    try {
      const response = await authAPI.updateProfile(user);

      if (response.status === 200) {
        const updatedUser = response.data;
        
        setAuthState({
          ...authState,
          user: updatedUser,
        });
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Update error:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ authState, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};