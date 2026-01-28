// context/AppContextProvider.tsx
import React, { createContext, ReactNode, useState } from 'react';

// Definimos qué datos va a tener nuestro contexto
type AppContextType = {
  usuario: string;
  setusuario: (nombre: string) => void;
};

// Creamos el contexto con un valor inicial indefinido o por defecto
export const AppContext = createContext<AppContextType>({
  usuario: '',
  setusuario: () => {},
});

// Creamos el Proveedor (el envoltorio)
export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setusuario] = useState<string>('');

  return (
    <AppContext.Provider value={{ usuario, setusuario }}>
      {children}
    </AppContext.Provider>
  );
};