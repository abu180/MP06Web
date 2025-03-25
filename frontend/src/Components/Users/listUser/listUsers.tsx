// src/Components/Users/listUser/listUsers.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// INTERFAZ PARA LOS DATOS DE USUARIOS
interface User {
  User_id: number;
  UserName: string;
  Email: string;
  Password: string;
  customer_id: number;
  Deletion_time: string | null;
}

const ListUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Estado para guardar la cantidad de usuarios inactivos (de baja)
  const [inactiveCount, setInactiveCount] = useState<number>(0);

  // Función para obtener usuarios activos
  const fetchActiveUsers = async () => {
    try {
      const response = await fetch('http://localhost:8000/Users');
      if (!response.ok) {
        throw new Error('Error al obtener los usuarios activos');
      }
      const data: User[] = await response.json();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError((err as Error).message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener la cantidad de usuarios eliminados (inactivos)
  const fetchInactiveUsersCount = async () => {
    try {
      const response = await fetch('http://localhost:8000/Users/deleted');
      if (!response.ok) {
        throw new Error('Error al obtener los usuarios inactivos');
      }
      const data: User[] = await response.json();
      setInactiveCount(data.length);
    } catch (err) {
      console.error('Error al obtener la lista de inactivos:', err);
    }
  };

  // Función para eliminar un usuario (actualizar is_active a 0)
  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este usuario?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:8000/Users/deleteUser/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Error al eliminar el usuario');
      }
      // Vuelve a cargar la lista de activos
      fetchActiveUsers();
      // Vuelve a cargar la cantidad de inactivos
      fetchInactiveUsersCount();
    } catch (err) {
      console.error('Error al eliminar el usuario:', err);}
  };

  useEffect(() => {
    // Al montar el componente, cargamos la lista de usuarios activos
    // y la cantidad de usuarios inactivos
    fetchActiveUsers();
    fetchInactiveUsersCount();
  }, []);

  if (loading) {
    return <div>Cargando usuarios...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Usuarios Activos</h1>

      {/* Sección de botones/enlaces */}
      <div style={{ marginBottom: '1rem' }}>
        {/* Enlace a la lista de usuarios inactivos con su cantidad */}
        <Link to="/Users/deleted">
          <button>Usuarios de baja ({inactiveCount})</button>
        </Link>
        {" "}
        {/* Botón informativo con la cantidad de usuarios activos */}
        <button>Usuarios activos ({users.length})</button>
      </div>

      {/* Tabla de usuarios activos */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre de Usuario</th>
            <th>Email</th>
            <th>Contraseña</th>
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
              <td>
                <Link to={`/Users/editUser/${user.User_id}`}>
                  <button>Editar</button>
                </Link>
                {" | "}
                <button onClick={() => handleDelete(user.User_id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListUsers;
