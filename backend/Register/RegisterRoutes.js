const express = require('express');
const router = express.Router();
const { registerUser } = require('./RegisterController');

// Ruta para registrar un usuario y su cliente asociado
router.post('/register', registerUser);

module.exports = router;
