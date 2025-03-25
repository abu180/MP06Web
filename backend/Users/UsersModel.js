// backend/Users/UsersModel.js
const db = require('../db');  // Conexión e interacción con la base de datos

// 1. Obtener todos los usuarios activos
async function getAllUsers() {
  const [rows] = await db.query('SELECT * FROM Users WHERE is_active = 1');
  return rows;
}

// 2. Añadir un usuario (is_active se establece en 1 por defecto), incluyendo avatar
async function addUserValues(User, connection = db) {
  const { UserName, Email, Password, customer_id, avatar } = User;
  const [sql] = await connection.query(
    `INSERT INTO Users (UserName, Email, Password, avatar, customer_id, is_active)
     VALUES (?, ?, ?, ?, ?, 1)`,
    [
      UserName,
      Email,
      Password,
      avatar || null,      // Si no se envía avatar, guardamos null
      customer_id
    ]
  );
  return sql.insertId;
}

// 3. Dar de baja un usuario (is_active = 0 y asigna Deletion_time = curdate())
async function deactivateUser(id) {
  const [sql] = await db.query(
    "UPDATE Users SET is_active = 0, Deletion_time = curdate() WHERE User_id = ?",
    [id]
  );
  return sql;
}

// 4. Dar de alta un usuario (is_active = 1)
async function activateUser(id) {
  const [sql] = await db.query(
    "UPDATE Users SET is_active = 1 WHERE User_id = ?",
    [id]
  );
  return sql;
}

// 5. Actualizar datos de un usuario, incluyendo avatar
async function updateUserValues(id, User) {
  const { UserName, Email, Password, customer_id, avatar } = User;
  const [sql] = await db.query(
    `UPDATE Users
     SET UserName = ?,
         Email = ?,
         Password = ?,
         avatar = ?,
         customer_id = ?
     WHERE User_id = ?`,
    [
      UserName,
      Email,
      Password,
      avatar || null,      // Si no se envía avatar, guardamos null
      customer_id,
      id
    ]
  );
  return sql;
}

// 6. Obtener un usuario por ID (solo si is_active = 1)
async function getUserByIdValues(id) {
  const [rows] = await db.query(
    'SELECT * FROM Users WHERE User_id = ? AND is_active = 1',
    [id]
  );
  return rows[0];
}

// 7. Obtener un usuario por sus credenciales (para otros procesos)
async function getUserByCredentials(email, password) {
  const [rows] = await db.query(
    'SELECT * FROM Users WHERE Email = ? AND Password = ? AND is_active = 1',
    [email, password]
  );
  return rows[0];
}

// 8. Obtener un usuario por email (para login)
async function getUserByEmail(email) {
  const [rows] = await db.query(
    'SELECT * FROM Users WHERE Email = ? AND is_active = 1',
    [email]
  );
  return rows[0];
}

// 9. Obtener el máximo customer_id actual (para la lógica antigua de addUser)
async function getMaxCustomerId() {
  const [rows] = await db.query("SELECT MAX(customer_id) AS maxCustomerId FROM Users");
  return rows[0].maxCustomerId;
}

// 10. Obtener usuarios eliminados (is_active = 0)
async function getDeletedUsersValues() {
  const [rows] = await db.query("SELECT * FROM Users WHERE is_active = 0");
  return rows;
}

// 11. Obtener el perfil del usuario (para Perfil.tsx)
async function getUserProfile(req, res) {
  const { userId } = req.params;
  try {
    // 1. Obtener el usuario activo por su ID
    const [rowsUser] = await db.query(
      "SELECT * FROM Users WHERE User_id = ? AND is_active = 1",
      [userId]
    );
    if (!rowsUser.length) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    const user = rowsUser[0];

    // 2. Obtener datos del cliente asociado al usuario
    const [rowsCustomer] = await db.query(
      "SELECT * FROM Customers WHERE Customer_id = ? AND is_active = 1",
      [user.customer_id]
    );
    const customer = rowsCustomer.length ? rowsCustomer[0] : null;

    // 3. Obtener otros usuarios asociados al mismo customer, excluyendo al actual
    const [rowsOtherUsers] = await db.query(
      "SELECT UserName, Email FROM Users WHERE customer_id = ? AND User_id != ? AND is_active = 1",
      [user.customer_id, userId]
    );

    // 4. Retornar la información combinada, INCLUYENDO el avatar:
    return res.json({
      user: {
        User_id: user.User_id,
        Email: user.Email,
        customer_id: user.customer_id,
        avatar: user.avatar // <-- Agregar la propiedad avatar
      },
      customer: customer
        ? {
            Name: customer.Name,
            Surname: customer.Surname,
            Phone: customer.Phone,
            Adress: customer.Adress,
            Country: customer.Country
          }
        : {},
      otherUsers: rowsOtherUsers
    });
  } catch (error) {
    console.error("Error en getUserProfile:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}


module.exports = {
  getAllUsers,
  addUserValues,
  deactivateUser,
  activateUser,
  updateUserValues,
  getUserByIdValues,
  getUserByCredentials,
  getUserByEmail,
  getMaxCustomerId,
  getDeletedUsersValues
};
