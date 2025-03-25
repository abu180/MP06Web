// src/Components/Login/Auth/Auth.tsx
import { createContext, useState, ReactNode, useEffect } from "react";

// Estructura que guardaremos en el "user" de Auth
interface User {
  userId?: number;   // Opcional: userId
  User_id?: number;  // Opcional: User_id (para compatibilidad con diferentes respuestas)
  avatar?: string;   // Opcional: URL del avatar
  email: string;     // Obligatorio: email
  token: string;     // Obligatorio: token (si lo manejas para autenticación)
  name: string;      // Obligatorio: nombre
  lastname: string;  // Obligatorio: apellido
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const Auth = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Inicializamos el estado con lo que haya en localStorage (si existe)
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Efecto para recargar el user desde localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Función de login: recibe un objeto "User" y lo guarda en el estado y en localStorage
  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Función de logout: borra el user del estado y de localStorage
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <Auth.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </Auth.Provider>
  );
};

export default Auth;
