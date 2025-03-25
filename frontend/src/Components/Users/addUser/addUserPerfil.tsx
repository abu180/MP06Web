// src/Components/Users/addUserPerfil/AddUserPerfil.tsx
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

interface NewUser {
  UserName: string;
  Email: string;
  Password: string;
  confirmPassword: string;
}

const AddUserPerfil: React.FC = () => {
  const [searchParams] = useSearchParams();
  const customerIdParam = searchParams.get('customer_id');
  const customer_id = customerIdParam ? Number(customerIdParam) : null;

  const [users, setUsers] = useState<NewUser[]>([
    { UserName: '', Email: '', Password: '', confirmPassword: '' }
  ]);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    console.log("customer_id obtenido:", customer_id);
    if (!customer_id) {
      setError("No se especificó un customer_id válido.");
    }
  }, [customer_id]);

  const handleAddUserForm = () => {
    setUsers(prev => [
      ...prev,
      { UserName: '', Email: '', Password: '', confirmPassword: '' }
    ]);
  };

  const handleRemoveUserForm = (index: number) => {
    setUsers(prev => prev.filter((_, i) => i !== index));
  };

  const handleUserChange = (index: number, field: keyof NewUser, value: string) => {
    setUsers(prev =>
      prev.map((user, i) => (i === index ? { ...user, [field]: value } : user))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!customer_id) {
      setError("No se especificó un customer_id válido.");
      return;
    }

    // Validar que cada usuario tenga todos los campos y que las contraseñas coincidan
    for (let i = 0; i < users.length; i++) {
      const { UserName, Email, Password, confirmPassword } = users[i];
      if (!UserName || !Email || !Password || !confirmPassword) {
        setError(`Todos los campos son obligatorios (usuario #${i + 1}).`);
        return;
      }
      if (Password !== confirmPassword) {
        setError(`Las contraseñas no coinciden en el usuario #${i + 1}.`);
        return;
      }
    }

    // Construir el payload de forma manual
    const payload = {
      customer_id,
      users: users.map(u => ({
        UserName: u.UserName,
        Email: u.Email,
        Password: u.Password
      }))
    };

    console.log("Payload a enviar:", payload);

    try {
      const response = await fetch('http://localhost:8000/Users/addUsersToCustomer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al agregar los usuarios');
      }

      setSuccess(true);
      setUsers([{ UserName: '', Email: '', Password: '', confirmPassword: '' }]);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error desconocido');
      }
    }
  };

  return (
    <div>
      <h2>Añadir Usuarios a tu Cuenta (Customer ID: {customer_id})</h2>
      <form onSubmit={handleSubmit}>
        {users.map((user, index) => (
          <div
            key={index}
            style={{ border: '1px solid #ccc', margin: '1rem 0', padding: '1rem' }}
          >
            <h4>Usuario #{index + 1}</h4>
            <button type="button" onClick={() => handleRemoveUserForm(index)}>
              X
            </button>
            <div>
              <label>Nombre de Usuario:</label>
              <input
                type="text"
                value={user.UserName}
                onChange={(e) => handleUserChange(index, 'UserName', e.target.value)}
                required
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                type="email"
                value={user.Email}
                onChange={(e) => handleUserChange(index, 'Email', e.target.value)}
                required
              />
            </div>
            <div>
              <label>Contraseña:</label>
              <input
                type="password"
                value={user.Password}
                onChange={(e) => handleUserChange(index, 'Password', e.target.value)}
                required
              />
            </div>
            <div>
              <label>Confirmar Contraseña:</label>
              <input
                type="password"
                value={user.confirmPassword}
                onChange={(e) => handleUserChange(index, 'confirmPassword', e.target.value)}
                required
              />
              {user.confirmPassword && user.Password !== user.confirmPassword && (
                <p style={{ color: 'red' }}>Las contraseñas no coinciden</p>
              )}
            </div>
          </div>
        ))}

        <button type="button" onClick={handleAddUserForm}>
          + Agregar otro usuario
        </button>

        <div style={{ marginTop: '1rem' }}>
          <button type="submit">Guardar Usuarios</button>
          <Link to="/Users">
            <button type="button">Regresar</button>
          </Link>
        </div>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>Usuarios agregados con éxito</p>}
    </div>
  );
};

export default AddUserPerfil;
