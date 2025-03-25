// frontend/src/Components/Login/SyncUp/SyncUp.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/useAuth';

interface LoginResponse {
  user: {
    User_id: number;
    Email: string;
    UserName: string;
    customer_id: number;
    avatar?: string | null;
    // token: string; // Si el backend lo envía, inclúyelo
  };
  message: string;
}

const SyncUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/Users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data: LoginResponse & { message?: string } = await response.json();

      // Log para ver la respuesta
      console.log("Respuesta del backend:", data);

      if (!response.ok) {
        setError(data.message || 'Error en la autenticación.');
        return;
      }

      // Mapear la respuesta del backend al objeto que espera el Auth
      // Aquí asumimos que el backend devuelve "user" con las propiedades:
      // User_id, Email, UserName, customer_id, y avatar.
      login({
        userId: data.user.User_id,
        email: data.user.Email,
        token: "", // Si el backend no envía token, lo dejamos vacío o lo ajustamos
        name: data.user.UserName,
        lastname: "", // Si no se envía, lo dejamos vacío
        avatar: data.user.avatar || ""
      });
      navigate('/');
    } catch (err) {
      setError('Error en la conexión con el servidor.');
      console.error('Error en el login:', err);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Iniciar Sesión</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium">Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Iniciar Sesión
          </button>
          <Link to="/register">
            <button type="button">REGISTRATE</button>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default SyncUp;
