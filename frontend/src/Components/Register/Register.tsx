// src/Components/Register/Register.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface RegisterFormData {
  Name: string;
  Surname: string;
  Phone: string;
  Adress: string;
  Country: string;
  PostalCode: string;
  UserName: string;
  Email: string;
  Password: string;
  ConfirmPassword: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    Name: '',
    Surname: '',
    Phone: '',
    Adress: '',
    Country: '',
    PostalCode: '',
    UserName: '',
    Email: '',
    Password: '',
    ConfirmPassword: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validar que la contraseña y la confirmación sean iguales
    if (formData.Password !== formData.ConfirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Name: formData.Name,
          Surname: formData.Surname,
          Phone: formData.Phone,
          Adress: formData.Adress,
          Country: formData.Country,
          PostalCode: formData.PostalCode,
          UserName: formData.UserName,
          Email: formData.Email,
          Password: formData.Password,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Error en el registro.');
      } else {
        setSuccess(data.message);
        // Después del registro, redirige al login (o loguea automáticamente si decides emitir un token JWT)
        navigate('/login');
      }
    } catch (err) {
      console.error(err);
      setError('Error en la conexión con el servidor.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1rem' }}>
      <h2>Registro de Usuario y Cliente</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <h3>Datos del Cliente</h3>
        <input type="text" name="Name" placeholder="Nombre" value={formData.Name} onChange={handleChange} required />
        <input type="text" name="Surname" placeholder="Apellidos" value={formData.Surname} onChange={handleChange} required />
        <input type="text" name="Phone" placeholder="Teléfono" value={formData.Phone} onChange={handleChange} required />
        <input type="text" name="Adress" placeholder="Dirección" value={formData.Adress} onChange={handleChange} required />
        <input type="text" name="Country" placeholder="País" value={formData.Country} onChange={handleChange} required />
        <input type="text" name="PostalCode" placeholder="Código Postal" value={formData.PostalCode} onChange={handleChange} required />

        <h3>Datos del Usuario</h3>
        <input type="text" name="UserName" placeholder="Nombre de Usuario" value={formData.UserName} onChange={handleChange} required />
        <input type="email" name="Email" placeholder="Email" value={formData.Email} onChange={handleChange} required />
        <input type="password" name="Password" placeholder="Contraseña" value={formData.Password} onChange={handleChange} required />
        <input type="password" name="ConfirmPassword" placeholder="Confirmar Contraseña" value={formData.ConfirmPassword} onChange={handleChange} required />

        <button type="submit">Registrarse</button>
      </form>
      <p>
        ¿Ya tienes cuenta? <a href="/login">Inicia Sesión</a>
      </p>
    </div>
  );
};

export default Register;
