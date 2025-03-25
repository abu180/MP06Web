// src/Components/Register/MultiStepRegister.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PasswordStrengthBar from 'react-password-strength-bar';

// Debido a problemas de tipado en la librería, hacemos un cast para usarlo como componente JSX
const PasswordStrengthBarAny = PasswordStrengthBar as unknown as React.FC<{ password: string }>;

enum Step {
  CUSTOMER = 1,
  USERS = 2,
}

// Interfaz para datos de cliente (tabla Customers)
interface CustomerData {
  Name: string;
  Surname: string;
  Phone: string;
  Adress: string;
  Country: string;
  PostalCode: string;
}

// Interfaz para cada usuario (tabla Users)
// Se agrega la propiedad opcional avatar para la URL (preview o final)
// y avatarFile para almacenar el objeto File (para subirlo al final)
interface UserData {
  UserName: string;
  Email: string;
  Password: string;
  confirmPassword: string;
  avatar?: string;
  avatarFile?: File;
}

// Estructura global de registro
interface RegistrationData {
  customer: CustomerData;
  users: UserData[];
}

// Función helper para omitir una propiedad de un objeto
function omit<T extends object, K extends keyof T>(obj: T, key: K): Omit<T, K> {
  const newObj = { ...obj };
  delete newObj[key];
  return newObj;
}


const MultiStepRegister: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(Step.CUSTOMER);

  // Estado global de registro
  const [regData, setRegData] = useState<RegistrationData>({
    customer: {
      Name: '',
      Surname: '',
      Phone: '',
      Adress: '',
      Country: '',
      PostalCode: '',
    },
    users: [
      {
        UserName: '',
        Email: '',
        Password: '',
        confirmPassword: '',
        avatar: '',
      },
    ],
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // PASO 1: Datos del Cliente
  const handleCustomerSubmit = (customerData: CustomerData) => {
    if (
      !customerData.Name ||
      !customerData.Surname ||
      !customerData.Phone ||
      !customerData.Adress ||
      !customerData.Country ||
      !customerData.PostalCode
    ) {
      setError('Todos los campos del cliente son obligatorios.');
      return;
    }
    setRegData((prev) => ({ ...prev, customer: customerData }));
    setError(null);
    setStep(Step.USERS);
  };

  // PASO 2: Datos de Usuarios
  const handleUsersSubmit = (usersData: UserData[]) => {
    for (let i = 0; i < usersData.length; i++) {
      const { UserName, Email, Password, confirmPassword } = usersData[i];
      if (!UserName || !Email || !Password || !confirmPassword) {
        setError(`Todos los campos de usuario son obligatorios (usuario #${i + 1}).`);
        return;
      }
      if (Password !== confirmPassword) {
        setError(`Las contraseñas no coinciden en el usuario #${i + 1}.`);
        return;
      }
    }
    setError(null);
    setRegData((prev) => ({ ...prev, users: usersData }));
    handleFinalSubmit({ ...regData, users: usersData });
  };

  // Función para subir el avatar (se invoca en el envío final)
  const uploadAvatarFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await fetch('http://localhost:8000/Users/UploadAvatar', {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Error al subir el avatar');
    }
    const data = await response.json();
    return data.avatar;
  };

  // PASO 3: Envío final al backend
  const handleFinalSubmit = async (finalData: RegistrationData) => {
    try {
      // Para cada usuario, si existe un avatarFile, lo subimos y actualizamos la URL
      const usersWithAvatar = await Promise.all(
        finalData.users.map(async (user) => {
          if (user.avatarFile) {
            const avatarUrl = await uploadAvatarFile(user.avatarFile);
            return { ...user, avatar: avatarUrl, avatarFile: undefined };
          }
          return user;
        })
      );

      // Armamos el payload (omitiendo confirmPassword y avatarFile)
      const payload = {
        Name: finalData.customer.Name,
        Surname: finalData.customer.Surname,
        Phone: finalData.customer.Phone,
        Adress: finalData.customer.Adress,
        Country: finalData.customer.Country,
        PostalCode: finalData.customer.PostalCode,
        users: usersWithAvatar.map((user) => omit(user, 'confirmPassword')),
      };

      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Error en el registro.');
      } else {
        setSuccess('Registro exitoso.');
        navigate('/login');
      }
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message || 'Error en la conexión con el servidor.');
      } else {
        setError('Error en la conexión con el servidor.');
      }
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  const handleBack = () => {
    setStep(Step.CUSTOMER);
  };

  return (
    <div>
      <h2>Registro Multi-Paso</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      {step === Step.CUSTOMER && (
        <CustomerForm
          initialData={regData.customer}
          onSubmit={handleCustomerSubmit}
          onCancel={handleCancel}
        />
      )}

      {step === Step.USERS && (
        <UsersForm
          initialData={regData.users}
          onSubmit={handleUsersSubmit}
          onCancel={handleCancel}
          onBack={handleBack}
        />
      )}
    </div>
  );
};

const CustomerForm: React.FC<{
  initialData: CustomerData;
  onSubmit: (customerData: CustomerData) => void;
  onCancel: () => void;
}> = ({ initialData, onSubmit, onCancel }) => {
  const [Name, setName] = useState(initialData.Name);
  const [Surname, setSurname] = useState(initialData.Surname);
  const [Phone, setPhone] = useState(initialData.Phone);
  const [Adress, setAdress] = useState(initialData.Adress);
  const [Country, setCountry] = useState(initialData.Country);
  const [PostalCode, setPostalCode] = useState(initialData.PostalCode);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ Name, Surname, Phone, Adress, Country, PostalCode });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Datos del Cliente</h3>
      <div>
        <label>Nombre:</label>
        <input type="text" value={Name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label>Apellidos:</label>
        <input type="text" value={Surname} onChange={(e) => setSurname(e.target.value)} required />
      </div>
      <div>
        <label>Teléfono:</label>
        <input type="text" value={Phone} onChange={(e) => setPhone(e.target.value)} required />
      </div>
      <div>
        <label>Dirección:</label>
        <input type="text" value={Adress} onChange={(e) => setAdress(e.target.value)} required />
      </div>
      <div>
        <label>País:</label>
        <input type="text" value={Country} onChange={(e) => setCountry(e.target.value)} required />
      </div>
      <div>
        <label>Código Postal:</label>
        <input type="text" value={PostalCode} onChange={(e) => setPostalCode(e.target.value)} required />
      </div>
      <button type="button" onClick={onCancel}>Cancelar</button>
      <button type="submit">Siguiente</button>
    </form>
  );
};

const UsersForm: React.FC<{
  initialData: UserData[];
  onSubmit: (usersData: UserData[]) => void;
  onCancel: () => void;
  onBack: () => void;
}> = ({ initialData, onSubmit, onCancel, onBack }) => {
  const [users, setUsers] = useState<UserData[]>(initialData);

  const handleUserChange = (index: number, field: keyof UserData, value: string) => {
    setUsers(prev =>
      prev.map((user, i) => (i === index ? { ...user, [field]: value } : user))
    );
  };

  const handleAddUser = () => {
    setUsers(prev => [
      ...prev,
      { UserName: '', Email: '', Password: '', confirmPassword: '', avatar: '' }
    ]);
  };

  const handleRemoveUser = (index: number) => {
    setUsers(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      setUsers(prev =>
        prev.map((user, i) =>
          i === index ? { ...user, avatar: previewUrl, avatarFile: file } : user
        )
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(users);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Usuarios Asociados al Cliente</h3>
      {users.map((user, index) => (
        <div key={index} style={{ border: '1px solid #ccc', marginBottom: '1rem', padding: '1rem' }}>
          <h4>Usuario #{index + 1}</h4>
          <button type="button" onClick={() => handleRemoveUser(index)}>X</button>
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
            <PasswordStrengthBarAny password={user.Password} />
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
          <div>
            <label>Avatar:</label>
            <input type="file" accept="image/*" onChange={(e) => handleFileChange(index, e)} />
            {user.avatar && (
              <div>
                <img src={user.avatar} alt={`Avatar usuario ${index + 1}`} width={100} />
              </div>
            )}
          </div>
        </div>
      ))}
      <button type="button" onClick={handleAddUser}>+ Usuario</button>
      <div style={{ marginTop: '1rem' }}>
        <button type="button" onClick={onCancel}>Cancelar</button>
        <button type="button" onClick={onBack}>Atrás</button>
        <button type="submit">Guardar</button>
      </div>
    </form>
  );
};

export default MultiStepRegister;
