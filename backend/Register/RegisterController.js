// backend/Register/RegisterController.js
const bcrypt = require('bcrypt');
const owasp = require('owasp-password-strength-test');
const db = require('../db'); // Pool de conexiones a la BD

async function registerUser(req, res) {
  console.log("Datos recibidos:", req.body);
  const { Name, Surname, Phone, Adress, Country, PostalCode, users } = req.body;
  
  // Validación básica para el cliente y la lista de usuarios
  if (!Name || !Surname || !Phone || !Adress || !Country || !PostalCode || !users) {
    return res.status(400).json({ message: "Faltan datos de cliente o lista de usuarios." });
  }
  if (!Array.isArray(users) || users.length === 0) {
    return res.status(400).json({ message: "La lista de usuarios está vacía o no es un array." });
  }
  
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 0. Verificar si ya existe un cliente con el mismo Name y Surname
    const [existingCustomers] = await connection.query(
      "SELECT * FROM Customers WHERE Name = ? AND Surname = ?",
      [Name, Surname]
    );
    if (existingCustomers.length > 0) {
      await connection.rollback();
      connection.release();
      return res.status(400).json({ message: "Ya existe un cliente con ese nombre y apellido." });
    }

    // 1. Insertar el cliente en la tabla "Customers"
    const [customerResult] = await connection.query(
      "INSERT INTO Customers (Name, Surname, Phone, Adress, Country, PostalCode, is_active) VALUES (?, ?, ?, ?, ?, ?, 1)",
      [Name, Surname, Phone, Adress, Country, PostalCode]
    );
    const newCustomerId = customerResult.insertId;

    // 2. Para cada usuario, verificar que se envíen los campos obligatorios,
    // comprobar la fortaleza de la contraseña y que no se repita el Email
    for (const singleUser of users) {
      const { UserName, Email, Password, avatar } = singleUser;
      console.log("Verificando usuario:", singleUser);
      if (!UserName || !Email || !Password) {
        await connection.rollback();
        connection.release();
        return res.status(400).json({ message: "Uno de los usuarios no tiene todos los campos obligatorios." });
      }
      
      // Verificar la fortaleza de la contraseña usando owasp
      const passwordTestResult = owasp.test(Password);
      if (passwordTestResult.errors.length > 0) {
        await connection.rollback();
        connection.release();
        return res.status(400).json({ 
          message: `La contraseña para el usuario ${Email} no es suficientemente segura: ${passwordTestResult.errors.join(', ')}` 
        });
      }
      
      // Verificar duplicidad por Email en Users
      const [existingUsers] = await connection.query(
        "SELECT * FROM Users WHERE Email = ?",
        [Email]
      );
      if (existingUsers.length > 0) {
        await connection.rollback();
        connection.release();
        return res.status(400).json({ message: `Ya existe un usuario con el correo ${Email}.` });
      }
    }

    // 3. Insertar cada usuario asociado al nuevo cliente
    const insertedUserIds = [];
    for (const singleUser of users) {
      const { UserName, Email, Password, avatar } = singleUser;
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(Password, saltRounds);
      const [userResult] = await connection.query(
        "INSERT INTO Users (UserName, Email, Password, avatar, customer_id, is_active) VALUES (?, ?, ?, ?, ?, 1)",
        [UserName, Email, hashedPassword, avatar || null, newCustomerId]
      );
      insertedUserIds.push(userResult.insertId);
    }

    await connection.commit();
    connection.release();

    return res.status(201).json({
      message: "Registro exitoso",
      customer_id: newCustomerId,
      user_ids: insertedUserIds
    });
  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error("Error en el registro:", error, "Código:", error.code);
    if (error && error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: "Ya existe un registro con esos datos." });
    }
    return res.status(500).json({ message: "Error al registrar el cliente y usuarios" });
  }
}

module.exports = { registerUser };
