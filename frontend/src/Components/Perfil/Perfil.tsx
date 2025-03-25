// src/Components/Perfil/Perfil.tsx
import React from 'react';
import ProfileCard from './ProfileCard';
import { useAuth } from '../Login/Auth/useAuth';
import './Perfil.css';

const Perfil: React.FC = () => {
  const { user } = useAuth();

  // Si no hay usuario, puedes redirigir o mostrar nada.
  if (!user) return null;

  return (
    <div className="perfil-container">
      <ProfileCard />
    </div>
  );
};

export default Perfil;
