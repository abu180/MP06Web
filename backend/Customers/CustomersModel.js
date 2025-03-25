// backend/Customers/CustomersModel.js
const db = require('../db');  // Aquí interactuamos con la base de datos

// FUNCION PARA OBTENER TODOS LOS CLIENTES ACTIVOS
async function getAllCustomers() {
  const [rows] = await db.query('SELECT * FROM Customers WHERE is_active = 1');
  return rows;
}

// FUNCION PARA AÑADIR UN CLIENTE
async function addCustomerValues(Customer) {
  const { Name, Surname, Phone, Adress, Country, PostalCode } = Customer;
  const [sql] = await db.query(
    "INSERT INTO Customers (Name, Surname, Phone, Adress, Country, PostalCode, is_active) VALUES (?, ?, ?, ?, ?, ?, 1)",
    [Name, Surname, Phone, Adress, Country, PostalCode]
  );
  return sql.insertId;
}

// FUNCION PARA DAR DE BAJA UN CLIENTE (actualiza is_active a 0 y asigna Deletion_time a NOW())
async function deactivateCustomer(id) {
  const [sql] = await db.query(
    "UPDATE Customers SET is_active = 0, Deletion_time = NOW() WHERE Customer_id = ?",
    [id]
  );
  return sql;
}

// FUNCION PARA DAR DE ALTA UN CLIENTE (actualiza is_active a 1)
async function activateCustomer(id) {
  const [sql] = await db.query(
    "UPDATE Customers SET is_active = 1 WHERE Customer_id = ?",
    [id]
  );
  return sql;
}

// FUNCION PARA ACTUALIZAR UN CLIENTE
async function updateCustomerValues(id, Customer) {
  const { Name, Surname, Phone, Adress, Country, PostalCode } = Customer;
  const [sql] = await db.query(
    "UPDATE Customers SET Name = ?, Surname = ?, Phone = ?, Adress = ?, Country = ?, PostalCode = ? WHERE Customer_id = ?",
    [Name, Surname, Phone, Adress, Country, PostalCode, id]
  );
  return sql;
}

// FUNCION PARA OBTENER UN CLIENTE POR ID (solo si está activo)
async function getCustomerByIdValues(id) {
  const [rows] = await db.query(
    'SELECT * FROM Customers WHERE Customer_id = ? AND is_active = 1', 
    [id]
  );
  return rows[0];  // Devuelve el primer (y único) registro encontrado si está activo
}

// NUEVA FUNCION PARA OBTENER CLIENTES ELIMINADOS (is_active = 0)
async function getRemovedCustomersValues() {
  const [rows] = await db.query("SELECT * FROM Customers WHERE is_active = 0");
  return rows;
}

module.exports = {
  getAllCustomers,
  addCustomerValues,
  deactivateCustomer,
  activateCustomer,
  updateCustomerValues,
  getCustomerByIdValues,
  getRemovedCustomersValues,
};
