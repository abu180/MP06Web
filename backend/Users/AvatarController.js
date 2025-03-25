// backend/Users/AvatarController.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../db');

// Definir la carpeta de subida (asegúrate de que la ruta sea la correcta)
const uploadDir = path.join(__dirname, '../../Uploads/Avatares');

// Crear la carpeta si no existe
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("Carpeta de avatares creada:", uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes.'), false);
  }
};

const upload = multer({ storage, fileFilter });

const UploadAvatar = (req, res) => {
  upload.single('avatar')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No se ha subido ningún archivo' });
    }
    
    // Construir la URL para acceder al archivo (asegúrate de que la ruta coincida con la ruta estática)
    const avatarUrl = `/Uploads/Avatares/${req.file.filename}`;

    // Si se envía un userId en el cuerpo, actualizamos la base de datos
    const { userId } = req.body;
    if (userId) {
      try {
        const [result] = await db.query(
          "UPDATE Users SET avatar = ? WHERE User_id = ?",
          [avatarUrl, userId]
        );
        // Puedes verificar result.affectedRows si lo deseas
      } catch (dbError) {
        console.error("Error al actualizar avatar en DB:", dbError);
        return res.status(500).json({ message: "Error al actualizar avatar en la base de datos" });
      }
    }

    return res.status(200).json({ avatar: avatarUrl });
  });
};

module.exports = {
  UploadAvatar,
};
