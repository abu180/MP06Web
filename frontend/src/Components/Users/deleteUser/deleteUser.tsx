import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const DeleteUser: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Obtenemos el ID del usuario desde los parámetros de la URL
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleDelete = async () => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este usuario?");
    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/Users/deleteUser/${id}`, {  // Asegúrate de que esta ruta esté configurada en tu backend
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el usuario');
      }

      setSuccess(true);
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
      <h2>Eliminar Usuario</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success ? (
        <div>
          <p style={{ color: 'green' }}>Usuario eliminado con éxito</p>
          <p>El usuario ha sido eliminado correctamente.</p>
        </div>
      ) : (
        <div>
          <p>¿Estás seguro de que deseas eliminar este usuario?</p>
          <button onClick={handleDelete}>Eliminar Usuario</button>
          <br />
          <button onClick={() => window.history.back()}>Cancelar</button>
        </div>
      )}
    </div>
  );
};

export default DeleteUser;
