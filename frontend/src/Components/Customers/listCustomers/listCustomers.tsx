// src/Components/Customers/listCustomers/listCustomers.tsx
import './listCustomers.css';
import React, { useEffect, useState } from 'react';
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

const ListCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [inactiveCount, setInactiveCount] = useState<number>(0);

  // Función para obtener clientes activos desde el backend
  const fetchCustomers = async () => {
    try {
      const response = await fetch('http://localhost:8000/Customers');
      if (!response.ok) {
        throw new Error('Error al obtener los clientes');
      }
      const data: Customer[] = await response.json();
      setCustomers(data);
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

  // Función para obtener clientes eliminados (inactivos)
  const fetchRemovedCustomers = async () => {
    try {
      const response = await fetch('http://localhost:8000/Customers/removed');
      if (!response.ok) {
        throw new Error('Error al obtener los clientes eliminados');
      }
      const data: Customer[] = await response.json();
      setInactiveCount(data.length);
    } catch (err: unknown) {
      console.error(err);
    }
  };

  // Función para eliminar un cliente: actualiza is_active a 0
  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este cliente?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:8000/Customers/deleteCustomer/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Error al eliminar el cliente');
      }
      setSuccess(true);
      // Actualiza las listas
      fetchCustomers();
      fetchRemovedCustomers();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error desconocido');
      }
    }
  };

  useEffect(() => {
    fetchCustomers();
    fetchRemovedCustomers();
  }, []);

  if (loading) {
    return <div>Loading Customers...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>CUSTOMERS</h1>
      <div style={{ marginBottom: '1rem' }}>
        {/* Botón que redirige a la lista de clientes eliminados con la cantidad */}
        <Link to="/Customers/removed">
          <button>Clientes de baja ({inactiveCount})</button>
        </Link>
        {" "}
        {/* Botón que muestra la cantidad de clientes activos */}
        <button>Clientes activos ({customers.length})</button>
      </div>

      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      {success && <div style={{ color: 'green' }}>Cliente eliminado con éxito</div>}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Surname</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Country</th>
            <th>Postal Code</th>
            <th>ACTIONS</th>
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
                <Link to={`/Customers/editCustomer/${customer.Customer_id}`}>
                  <button>EDIT</button>
                </Link>
                {" | "}
                <button onClick={() => handleDelete(customer.Customer_id)}>DELETE</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: '1rem' }}>
        <Link to="/Customers/addCustomer">
          <button>ADD CUSTOMER</button>
        </Link>
      </div>
    </div>
  );
};

export default ListCustomers;
