// backend/Users/UsersController.js
const bcrypt = require('bcrypt');
const db = require('../db'); // Para transacciones y consultas directas

// Importamos las funciones del modelo
const {
  getAllUsers,
  addUserValues,
  updateUserValues,
  getUserByIdValues,
  getUserByEmail,
  getDeletedUsersValues,
  deactivateUser: deactivateUserModel,
  activateUser: activateUserModel,
  getMaxCustomerId,
} = require('./UsersModel');

// ----------------------------------------------------------------------------------
// 1. Obtener todos los usuarios activos
// ----------------------------------------------------------------------------------
async function getUsers(req, res) {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    res.status(500).json({ message: "Error al obtener los usuarios" });
  }
}

// ----------------------------------------------------------------------------------
// 2. Añadir un nuevo usuario (lógica antigua, crea un customer_id incremental)
// ----------------------------------------------------------------------------------
async function addUser(req, res) {
  const { UserName, Email, Password } = req.body;
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(Password, saltRounds);

    // Generar customer_id automáticamente consultando el máximo actual
    const maxCustomerId = await getMaxCustomerId();
    const newCustomerId = maxCustomerId ? maxCustomerId + 1 : 1;

    const newUserId = await addUserValues({
      UserName,
      Email,
      Password: hashedPassword,
      customer_id: newCustomerId
    });

    res.status(201).json({ id: newUserId });
  } catch (error) {
    console.error("Error al añadir el usuario:", error);
    res.status(500).json({ error: 'Error al añadir el usuario' });
  }
}

// ----------------------------------------------------------------------------------
// 3. "Eliminar" un usuario (soft delete => is_active = 0, Deletion_time = curdate())
// ----------------------------------------------------------------------------------
async function deleteUser(req, res) {
  const { id } = req.params;
  try {
    const result = await deactivateUserModel(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(204).end();
  } catch (error) {
    console.error("Error al dar de baja el usuario:", error);
    res.status(500).json({ error: 'Error al dar de baja el usuario' });
  }
}

// ----------------------------------------------------------------------------------
// 4. Actualizar un usuario (re-hasheando la contraseña siempre)
// ----------------------------------------------------------------------------------
async function updateUser(req, res) {
  const { id } = req.params;
  const { UserName, Email, Password, customer_id } = req.body;

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(Password, saltRounds);

    const result = await updateUserValues(id, {
      UserName,
      Email,
      Password: hashedPassword,
      customer_id
    });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Usuario no encontrado para actualizar" });
    }
    res.status(200).json({ message: "Usuario actualizado correctamente" });
  } catch (error) {
    console.error("Error al editar el usuario:", error);
    res.status(500).json({ error: 'Error al editar el usuario' });
  }
}

// ----------------------------------------------------------------------------------
// 5. Obtener un usuario por ID (solo si is_active = 1)
// ----------------------------------------------------------------------------------
async function getUserById(req, res) {
  const { id } = req.params;
  try {
    const user = await getUserByIdValues(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
}

// ----------------------------------------------------------------------------------
// 6. Login de usuario (valida email + password con bcrypt)
// ----------------------------------------------------------------------------------
async function loginUser(req, res) {
  const { email, password } = req.body;
  try {
    // Buscar usuario por email
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    // Comparar la contraseña ingresada con la almacenada (bcrypt)
    const valid = await bcrypt.compare(password, user.Password);
    if (!valid) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    // Aquí podrías generar y enviar un token JWT
    res.status(200).json({ message: 'Login exitoso', user });
  } catch (error) {
    console.error("Error durante el login:", error);
    res.status(500).json({ message: "Error en el servidor durante el login" });
  }
}

// ----------------------------------------------------------------------------------
// 7. Activar (dar de alta) un usuario (is_active = 1)
// ----------------------------------------------------------------------------------
async function activateUser(req, res) {
  const { id } = req.params;
  try {
    const result = await activateUserModel(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json({ message: "Usuario activado correctamente" });
  } catch (error) {
    console.error("Error al activar el usuario:", error);
    res.status(500).json({ message: "Error al activar el usuario" });
  }
}

// ----------------------------------------------------------------------------------
// 8. Desactivar (dar de baja) un usuario (is_active = 0)
// ----------------------------------------------------------------------------------
async function deactivateUser(req, res) {
  const { id } = req.params;
  try {
    const result = await deactivateUserModel(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json({ message: "Usuario dado de baja correctamente" });
  } catch (error) {
    console.error("Error al dar de baja el usuario:", error);
    res.status(500).json({ message: "Error al dar de baja el usuario" });
  }
}

// ----------------------------------------------------------------------------------
// 9. Obtener usuarios eliminados (is_active = 0)
// ----------------------------------------------------------------------------------
async function getDeletedUsers(req, res) {
  try {
    const users = await getDeletedUsersValues();
    res.json(users);
  } catch (error) {
    console.error("Error al obtener usuarios eliminados:", error);
    res.status(500).json({ message: "Error al obtener usuarios eliminados" });
  }
}

// ----------------------------------------------------------------------------------
// 10. Agregar múltiples usuarios a un mismo customer (transacción)
// ----------------------------------------------------------------------------------
async function addUsersToCustomer(req, res) {
  try {
    const { customer_id, users } = req.body;

    // Validaciones
    if (!customer_id || !Array.isArray(users) || users.length === 0) {
      return res.status(400).json({
        message: "Faltan 'customer_id' o la lista de 'users' está vacía."
      });
    }

    const connection = await db.getConnection();
    await connection.beginTransaction();

    const insertedUserIds = [];

    for (const singleUser of users) {
      const { UserName, Email, Password } = singleUser;

      if (!UserName || !Email || !Password) {
        await connection.rollback();
        connection.release();
        return res.status(400).json({
          message: "Uno de los usuarios no tiene (UserName, Email, Password)."
        });
      }

      // Hashear la contraseña
      const hashedPassword = await bcrypt.hash(Password, 10);

      // Insertar usuario asociado al customer_id
      const newUserId = await addUserValues({
        UserName,
        Email,
        Password: hashedPassword,
        customer_id
      }, connection);

      insertedUserIds.push(newUserId);
    }

    await connection.commit();
    connection.release();

    return res.status(201).json({
      message: "Usuarios agregados con éxito",
      insertedUserIds
    });
  } catch (error) {
    console.error("Error en addUsersToCustomer:", error);
    return res.status(500).json({ message: "Error al agregar usuarios al cliente" });
  }
}

// 11. Obtener el perfil del usuario (para Perfil.tsx)
async function getUserProfile(req, res) {
  const { userId } = req.params;
  try {
    // 1. Obtener el usuario activo por su ID, usando COALESCE para que avatar sea una cadena vacía en caso de null
    const [rowsUser] = await db.query(
      "SELECT User_id, Email, customer_id, COALESCE(avatar, '') AS avatar FROM Users WHERE User_id = ? AND is_active = 1",
      [userId]
    );
    if (!rowsUser.length) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    const user = rowsUser[0];

    // 2. Obtener datos del cliente asociado al usuario
    const [rowsCustomer] = await db.query(
      "SELECT Name, Surname, Phone, Adress, Country FROM Customers WHERE Customer_id = ? AND is_active = 1",
      [user.customer_id]
    );
    const customer = rowsCustomer.length ? rowsCustomer[0] : null;

    // 3. Obtener otros usuarios asociados al mismo customer, excluyendo al actual
    const [rowsOtherUsers] = await db.query(
      "SELECT UserName, Email FROM Users WHERE customer_id = ? AND User_id != ? AND is_active = 1",
      [user.customer_id, userId]
    );

    // 4. Retornar la información combinada, incluyendo avatar (que será cadena vacía si es null)
    return res.json({
      user: {
        User_id: user.User_id,
        Email: user.Email,
        customer_id: user.customer_id,
        avatar: user.avatar
      },
      customer: customer ? {
        Name: customer.Name,
        Surname: customer.Surname,
        Phone: customer.Phone,
        Adress: customer.Adress,
        Country: customer.Country
      } : {},
      otherUsers: rowsOtherUsers
    });
  } catch (error) {
    console.error("Error en getUserProfile:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}


// ----------------------------------------------------------------------------------
// Exportamos todas las funciones
// ----------------------------------------------------------------------------------
module.exports = {
  getUsers,
  addUser,
  deleteUser,
  updateUser,
  getUserById,
  loginUser,
  activateUser,
  deactivateUser,
  getDeletedUsers,
  addUsersToCustomer,
  getUserProfile
};
