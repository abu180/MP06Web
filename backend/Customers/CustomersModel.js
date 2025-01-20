/*
    AQUI TENDREMOS TODAS LAS CONSULTAS SQL
*/


const db = require('../db');

//FUNCION PARA OBTENER TODOS LOS CLIENTES
async function getAllCustomers() {
    const [rows] = await db.query('SELECT * FROM Customers');
    return rows;
}


//FUNCION PARA ANADIR UN CLIENTE
async function addCustomerValues(Customer) {
    const { Name, Surname, Phone, Adress, Country, PostalCode } = Customer;
    const [sql] = await db.query(
        "INSERT INTO Customers (Name, Surname, Phone, Adress, Country, PostalCode) VALUES (?, ?, ?, ?, ?, ?)",
        [Name, Surname, Phone, Adress, Country, PostalCode]
    );
    return sql.insertId;
}


async function deleteCustomerValues(id) {
    const [sql] = await db.query(
        "DELETE FROM Customers WHERE Customer_id = ?",
        [id]
    )
    return sql;
}


async function updateCustomerValues(id, Customer) {
    const { Name, Surname, Phone, Adress, Country, PostalCode } = Customer;
    const [sql] = await db.query(
        "UPDATE Customers SET Name = ?, Surname = ?, Phone = ?, Adress = ?, Country = ?, PostalCode = ? WHERE Customer_id = ?",
        [Name, Surname, Phone, Adress, Country, PostalCode, id]
    );
    return sql;
}

async function getCustomerByIdValues(id) {
    const [rows] = await db.query('SELECT * FROM Customers WHERE Customer_id = ?', [id]);
    return rows[0];
}

module.exports = {
    getAllCustomers,
    addCustomerValues,
    deleteCustomerValues,
    updateCustomerValues,
    getCustomerByIdValues
}