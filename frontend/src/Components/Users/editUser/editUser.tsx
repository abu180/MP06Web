import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface UserData {
  UserName: string;
  Email: string;
  Password: string;
  customer_id: number; // Relacionado con el cliente
}

const EditUser: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [user, setUser] = useState<UserData>({
    UserName: '',
    Email: '',
    Password: '',
    customer_id: 0,
  });

  // Fetch user data by ID to populate the form
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:8000/Users/${id}`);
        if (!response.ok) {
          throw new Error('Error al obtener los datos del usuario');
        }
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    const confirmEdit = window.confirm("¿Estás seguro de que deseas actualizar este usuario?");
    if (!confirmEdit) {
      return;
    }

    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`http://localhost:8000/Users/updateUser/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el usuario');
      }

      setSuccess(true);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Error desconocido');
      }
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Editar Usuario</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre de Usuario:</label>
          <input
            type="text"
            name="UserName"
            value={user.UserName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="Email"
            value={user.Email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            name="Password"
            value={user.Password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Actualizar Usuario</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>Usuario actualizado correctamente</p>}
    </div>
  );
};

export default EditUser;
