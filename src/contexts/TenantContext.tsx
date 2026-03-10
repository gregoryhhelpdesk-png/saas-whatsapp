import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TenantContextType {
  activeTenantId: string | null;
  activeTenantName: string | null;
  setActiveTenant: (id: string | null, name: string | null) => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTenantId, setActiveTenantId] = useState<string | null>(null);
  const [activeTenantName, setActiveTenantName] = useState<string | null>(null);

  const setActiveTenant = (id: string | null, name: string | null) => {
    setActiveTenantId(id);
    setActiveTenantName(name);
  };

  return (
    <TenantContext.Provider value={{ activeTenantId, activeTenantName, setActiveTenant }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};
