// src/Components/Users/listUser/listUsersRemove.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// INTERFAZ PARA LOS DATOS DE USUARIOS (incluye Deletion_time)
interface User {
  User_id: number;
  UserName: string;
  Email: string;
  Password: string;
  customer_id: number;
  Deletion_time: string | null;
}

const ListUsersRemove: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);       // Lista de usuarios inactivos
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // Contador de usuarios activos
  const [activeCount, setActiveCount] = useState<number>(0);

  // 1. Obtener usuarios inactivos (is_active = 0)
  const fetchRemovedUsers = async () => {
    try {
      const response = await fetch('http://localhost:8000/Users/deleted');
      if (!response.ok) {
        throw new Error('Error al obtener los usuarios eliminados');
      }
      const data: User[] = await response.json();
      setUsers(data);
      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error desconocido');
      }
    } finally {
      setLoading(false);
    }
  };

  // 2. Obtener la cantidad de usuarios activos
  const fetchActiveUsersCount = async () => {
    try {
      const response = await fetch('http://localhost:8000/Users');
      if (!response.ok) {
        throw new Error('Error al obtener los usuarios activos');
      }
      const data: User[] = await response.json();
      setActiveCount(data.length);
    } catch (err) {
      console.error('Error al obtener la lista de activos:', err);
    }
  };

  // 3. Al montar el componente, cargar usuarios inactivos y el conteo de activos
  useEffect(() => {
    fetchRemovedUsers();
    fetchActiveUsersCount();
  }, []);

  // Función para "revivir" (activar) un usuario
  const handleActivate = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/Users/activateUser/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Error al revivir el usuario');
      }
      // Recargar la lista de usuarios eliminados
      fetchRemovedUsers();
      // Actualizar el contador de activos
      fetchActiveUsersCount();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error desconocido');
      }
    }
  };

  if (loading) {
    return <div>Cargando usuarios eliminados...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Usuarios Eliminados</h1>
      <div style={{ marginBottom: '1rem' }}>

        {/* Enlace a la vista de usuarios activos, mostrando su cantidad */}
        <Link to="/Users">
          <button>Usuarios activos ({activeCount})</button>
        </Link>
        {" "}
        {/* Botón informativo de usuarios de baja */}
        <button>Usuarios de baja ({users.length})</button>
      </div>

      {users.length === 0 ? (
        <p>No hay usuarios eliminados.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre de Usuario</th>
              <th>Email</th>
              <th>Contraseña</th>
              <th>Deletion_time</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.User_id}>
                <td>{user.User_id}</td>
                <td>{user.UserName}</td>
                <td>{user.Email}</td>
                <td>{user.Password}</td>
                <td>{user.Deletion_time || 'N/A'}</td>
                <td>
                  <button onClick={() => handleActivate(user.User_id)}>
                    Revivir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListUsersRemove;
