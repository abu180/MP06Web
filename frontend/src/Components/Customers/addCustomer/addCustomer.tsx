import React, { useState } from 'react';
import { Link } from 'react-router-dom';


const AddCustomer: React.FC = () => {
  const [Name, setName] = useState<string>('');
  const [Surname, setSurname] = useState<string>('');
  const [Phone, setPhone] = useState<string>('');
  const [Adress, setAdress] = useState<string>('');
  const [Country, setCountry] = useState<string>('');
  const [PostalCode, setPostalCode] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('http://localhost:8000/Customers/addCustomer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Name, Surname, Phone, Adress, Country, PostalCode }),
      });

      if (!response.ok) {
        throw new Error('Error al agregar el cliente');
      }

      setSuccess(true);
      setName('');
      setSurname('');
      setPhone('');
      setAdress('');
      setCountry('');
      setPostalCode('');
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
      <h2>Agregar Cliente</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            value={Name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Surname:</label>
          <input
            type="text"
            value={Surname}
            onChange={(e) => setSurname(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Phone:</label>
          <input
            type="text"
            value={Phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Adress:</label>
          <input
            type="text"
            value={Adress}
            onChange={(e) => setAdress(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Country:</label>
          <input
            type="text"
            value={Country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Postal Code:</label>
          <input
            type="text"
            value={PostalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            required
          />
        </div>

        <button type="submit">ADD</button>
        <Link to="/Customers">
          <button>BACK</button>
        </Link>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>Cliente agregado con éxito</p>}
    </div>
  );
};

export default AddCustomer;