import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole, Tenant } from '../types';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  scope: 'platform' | 'tenant' | null;
  login: (email: string) => void;
  logout: () => void;
  setScope: (scope: 'platform' | 'tenant') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string) => {
    // Mock login logic
    const isSuperAdmin = email.includes('admin') || email === 'gregoryh.helpdesk@gmail.com';
    
    const mockUser: User = {
      id: '1',
      name: isSuperAdmin ? 'Super Admin' : 'Tenant Owner',
      email: email,
      role: isSuperAdmin ? 'super_admin' : 'tenant_owner',
      tenantId: isSuperAdmin ? undefined : '1',
      status: 'active',
      avatar: 'https://github.com/shadcn.png',
      scope: isSuperAdmin ? 'platform' : 'tenant'
    };
    
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
  };

  const setScope = (scope: 'platform' | 'tenant') => {
    if (user) {
      setUser({ ...user, scope });
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        role: user?.role || null, 
        scope: user?.scope || null,
        login, 
        logout, 
        setScope
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
