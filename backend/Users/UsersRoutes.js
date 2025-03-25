// backend/Users/UsersRoutes.js
const express = require('express');
const router = express.Router();

// Importar el controlador para el avatar
const { UploadAvatar } = require('./AvatarController');

// Importamos las funciones del controlador de usuarios
const {
  getUsers,
  addUser,
  deleteUser,
  updateUser,
  getUserById,
  loginUser,
  deactivateUser,
  activateUser,
  getDeletedUsers,
  addUsersToCustomer,
  getUserProfile
} = require('./UsersController');

// Rutas de usuarios
router.get('/', getUsers);                          // Lista de usuarios activos
router.get('/deleted', getDeletedUsers);            // Lista de usuarios eliminados (is_active = 0)
router.get('/profile/:userId', getUserProfile);       // Obtener el perfil completo de un usuario
router.get('/:id', getUserById);                      // Obtener un usuario por ID
router.post('/addUser', addUser);                     // Crear un usuario (lógica antigua)
router.delete('/deleteUser/:id', deleteUser);         // Soft delete (is_active = 0)
router.put('/updateUser/:id', updateUser);            // Actualizar usuario (re-hasheando la contraseña)
router.post('/login', loginUser);                     // Login (valida con bcrypt)
router.put('/deactivateUser/:id', deactivateUser);    // Desactivar usuario
router.put('/activateUser/:id', activateUser);        // Activar usuario
router.post('/addUsersToCustomer', addUsersToCustomer); // Agregar múltiples usuarios a un customer

// Nueva ruta para subir avatar
router.post('/UploadAvatar', UploadAvatar);

module.exports = router;
