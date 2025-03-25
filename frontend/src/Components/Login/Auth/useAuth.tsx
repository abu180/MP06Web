// frontend/src/Components/Login/Auth/useAuth.tsx
import { useContext } from "react";
import Auth from "./Auth";

export const useAuth = () => {
  const context = useContext(Auth);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};
