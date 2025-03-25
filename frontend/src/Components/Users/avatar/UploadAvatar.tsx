// frontend/src/Components/Users/UploadAvatar.tsx
import React, { useState } from 'react';

const UploadAvatar: React.FC<{ onUpload: (avatarUrl: string) => void }> = ({ onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Selecciona un archivo');
      return;
    }
    const formData = new FormData();
    formData.append('avatar', file);
    try {
      const response = await fetch('http://localhost:8000/Users/uploadAvatar', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Error al subir el avatar');
      } else {
        onUpload(data.avatar);
      }
    } catch (err) {
      setError('Error en la conexión con el servidor');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleUpload}>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button type="submit">Subir Avatar</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default UploadAvatar;
