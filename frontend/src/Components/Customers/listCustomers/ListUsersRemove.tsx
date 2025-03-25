// src/Components/Customers/listCustomersRemove.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Customer {
  Customer_id: number;
  Name: string;
  Surname: string;
  Phone: string;
  Adress: string;
  Country: string;
  PostalCode: string;
}

const ListCustomersRemove: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]); // Aquí guardamos los clientes INACTIVOS
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Contador de clientes inactivos (el length de "customers")
  const [inactiveCount, setInactiveCount] = useState<number>(0);

  // Contador de clientes activos (se guarda en un estado aparte)
  const [activeCount, setActiveCount] = useState<number>(0);

  // 1. Obtener clientes eliminados (inactivos)
  const fetchRemovedCustomers = async () => {
    try {
      const response = await fetch('http://localhost:8000/Customers/removed');
      if (!response.ok) {
        throw new Error('Error al obtener los clientes eliminados');
      }
      const data: Customer[] = await response.json();
      setCustomers(data);           // Guardamos en "customers" la lista de inactivos
      setInactiveCount(data.length);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // 2. Obtener la cantidad de clientes activos (sin sobrescribir "customers")
  const fetchActiveCustomersCount = async () => {
    try {
      const response = await fetch('http://localhost:8000/Customers');
      if (!response.ok) {
        throw new Error('Error al obtener los clientes activos');
      }
      const data: Customer[] = await response.json();
      setActiveCount(data.length);
    } catch (err: any) {
      console.error('Error al obtener la lista de activos:', err);
    }
  };

  useEffect(() => {
    // Al montar el componente, cargamos ambas listas
    fetchRemovedCustomers();
    fetchActiveCustomersCount();
  }, []);

  // Función para "revivir" un cliente (actualiza is_active a 1)
  const handleRevive = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/Customers/activateCustomer/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) {
        throw new Error('Error al activar el cliente');
      }
      setSuccess('Cliente activado con éxito');

      // Vuelve a cargar los inactivos
      fetchRemovedCustomers();
      // Y actualiza el contador de activos (subirá en 1)
      fetchActiveCustomersCount();
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    }
  };

  if (loading) {
    return <div>Cargando clientes eliminados...</div>;
  }

  return (
    <div>
      <h2>Clientes Eliminados</h2>
      
      <div style={{ marginBottom: '1rem' }}>
        {/* Botón que redirige a la lista de clientes eliminados con la cantidad */}
         <Link to="/Customers/removed">
          <button>Clientes de baja ({inactiveCount})</button>
        </Link>
        {/* Botón que muestra la cantidad de clientes activos */}
        <Link to="/Customers">
        <button>Clientes activos ({activeCount})</button>
        </Link>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {customers.length === 0 ? (
        <p>No hay clientes eliminados.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Teléfono</th>
              <th>Dirección</th>
              <th>País</th>
              <th>Código Postal</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.Customer_id}>
                <td>{customer.Customer_id}</td>
                <td>{customer.Name}</td>
                <td>{customer.Surname}</td>
                <td>{customer.Phone}</td>
                <td>{customer.Adress}</td>
                <td>{customer.Country}</td>
                <td>{customer.PostalCode}</td>
                <td>
                  <button onClick={() => handleRevive(customer.Customer_id)}>
                    Dar de alta
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={{ marginTop: '1rem' }}>
        <Link to="/Customers">
          <button>Volver a Clientes Activos</button>
        </Link>
      </div>
    </div>
  );
};

export default ListCustomersRemove;
