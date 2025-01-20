import './listCustomers.css';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

//INTERFAZ PARA DATOS DE LOS CLIENTES
interface Customer {
  Customer_id: number;
  Name: string;
  Surname: string,
  Phone: string,
  Adress: string,
  Country: string,
  PostalCode: string
}

const ListCustomers: React.FC = () => {
  
  // Tipamos el estado de los clientes como un array de Customer
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  //DATOS DESDE BACKEND
  const fetchCustomers = async () => {
    try {
        //URL DATOS
        const response = await fetch('http://localhost:8000/Customers');

        if (!response.ok) {
            throw new Error('Error al obtener los clientes');
        }

        //DATOS EN FORMATO JSON
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

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este cliente?");
    if(!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/Customers/deleteCustomer/${id}`, {
        method: 'DELETE',
      });  

      if (!response.ok) {
        throw new Error('Error al eliminar el cliente');
      }

      setSuccess(true);
      fetchCustomers(); 
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
      {error && <div>Error: {error}</div>}
      {success && <div>Cliente eliminado con éxito</div>}
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
                |
                <button onClick={() => handleDelete(customer.Customer_id)}>DELETE</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to={'/Customers/addCustomer'}>
        <button>ADD CUSTOMER</button>
      </Link>
    </div>
  );
};

export default ListCustomers;
