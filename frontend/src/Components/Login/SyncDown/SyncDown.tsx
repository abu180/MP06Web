// frontend/src/Components/Login/SyncDown/SyncDown.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/useAuth';

const SyncDown = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout();               // Cierra la sesión
    navigate('/login');     // Redirige al login después de cerrar sesión
  }, [logout, navigate]);

  return (
    <div>
      <h2>Cerrando sesión...</h2>
    </div>
  );
};

export default SyncDown;
