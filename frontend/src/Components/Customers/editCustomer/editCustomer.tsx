import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';


const EditCustomer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [customer, setCustomer] = useState({
    Name: '',
    Surname: '',
    Phone: '',
    Adress: '',
    Country: '',
    PostalCode: '',
  });

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await fetch(`http://localhost:8000/Customers/${id}`);
        if (!response.ok) {
          throw new Error('Error al obtener los datos del cliente');
        }
        const data = await response.json();
        setCustomer(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCustomer();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomer((prevCustomer) => ({
      ...prevCustomer,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    const confirmEdit = window.confirm("¿Estás seguro de que deseas actualizar este cliente?");
    if(!confirmEdit) {
      return;
    }
    
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`http://localhost:8000/Customers/updateCustomer/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customer),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el cliente');
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
      <h1>Editar Cliente</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="Name"
          value={customer.Name}
          onChange={handleChange}
          placeholder="Nombre"
        />
        <input
          type="text"
          name="Surname"
          value={customer.Surname}
          onChange={handleChange}
          placeholder="Apellido"
        />
        <input
          type="text"
          name="Phone"
          value={customer.Phone}
          onChange={handleChange}
          placeholder="Teléfono"
        />
        <input
          type="text"
          name="Adress"
          value={customer.Adress}
          onChange={handleChange}
          placeholder="Dirección"
        />
        <input
          type="text"
          name="Country"
          value={customer.Country}
          onChange={handleChange}
          placeholder="País"
        />
        <input
          type="text"
          name="PostalCode"
          value={customer.PostalCode}
          onChange={handleChange}
          placeholder="Código Postal"
        />
        <button type="submit">Actualizar Cliente</button>
        <Link to="/Customers">
          <button>BACK</button>
        </Link>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>Cliente actualizado correctamente</p>}
    </div>
  );
};

export default EditCustomer;
