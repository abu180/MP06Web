const db = require('../db');


async function getAllProducts() {
    const [sql] = await db.query('SELECT * FROM Products');
    return sql;
}



async function getProductById(id) {
    const [sql] = await db.query('SELECT * FROM Products WHERE Product_id = ?', [id]);
    return sql;
};


async function addProductValues(Product) {
    const { ProductName, UnitPrice, Quantity, UnitsOnOrder } = Product;
    const [sql] = await db.query(
        'INSERT INTO Products (ProductName, UnitPrice, Quantity, UnitsOnOrder) VALUES (?, ?, ?, ?)',
        [ProductName, UnitPrice, Quantity, UnitsOnOrder]
    );
    return sql.insertId;
}

module.exports = {
    getAllProducts,
    getProductById,
    addProductValues,
}