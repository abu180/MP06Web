// src/Components/Perfil/ProfileCard.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../Login/Auth/useAuth';
import { useNavigate } from 'react-router-dom';
import './Perfil.css';

interface ProfileData {
  user: {
    User_id: number;
    Email: string;
    customer_id: number;
    avatar?: string;
  };
  customer: {
    Name: string;
    Surname: string;
  };
  otherUsers: Array<{
    UserName: string;
    Email: string;
  }>;
}

const ProfileCard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [mostrarMenu, setMostrarMenu] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    const userId = user.userId ?? user.User_id;
    if (!userId) return;
    fetch(`http://localhost:8000/Users/profile/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar el perfil");
        return res.json();
      })
      .then((data: ProfileData) => {
        setProfile(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [user]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setMostrarMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (loading) return <div>Cargando perfil...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!profile) return <div>No se encontró información del perfil.</div>;

  let avatarUrl = profile.user.avatar || "";
  if (avatarUrl && avatarUrl.startsWith("/") && avatarUrl.includes(".")) {
    avatarUrl = `http://localhost:8000${avatarUrl}`;
  } else {
    avatarUrl = "";
  }

  const initial = profile.user.Email.charAt(0).toUpperCase();

  // Función para cerrar el menú y navegar a addUserPerfil con el customer_id
  const handleAddUserClick = () => {
    setMostrarMenu(false);
    navigate(`/Users/addUserPerfil?customer_id=${profile.user.customer_id}`);
  };

  return (
    <div className="perfil-container" ref={containerRef}>
      <div className="perfil-avatar" onClick={() => setMostrarMenu(!mostrarMenu)}>
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="perfil-img" />
        ) : (
          <div className="perfil-inicial">{initial}</div>
        )}
      </div>

      {mostrarMenu && (
        <div className="perfil-menu perfil-menu-centrado">
          <div className="perfil-info">
            <p><strong>{profile.customer.Name} {profile.customer.Surname}</strong></p>
            <p>{profile.user.Email}</p>
          </div>

          {profile.otherUsers && profile.otherUsers.length > 0 && (
            <div className="perfil-otros-usuarios">
              <h5>Otros perfiles:</h5>
              <ul className="otros-usuarios-lista">
                {profile.otherUsers.map((u, idx) => (
                  <li key={idx}>{u.Email}</li>
                ))}
              </ul>
            </div>
          )}

          <button className="perfil-adduser-btn" onClick={handleAddUserClick}>
            Añadir más usuarios
          </button>

          <button className="perfil-logout" onClick={logout}>
            Cerrar Sesión
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
