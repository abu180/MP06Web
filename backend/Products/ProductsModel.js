const db = require('../db');


async function getAllProducts() {
    const [sql] = await db.query('SELECT * FROM Products');
    return sql;
}



async function getProductById(id) {
    const [sql] = await db.query('SELECT * FROM Products WHERE Product_id = ?', [id]);
    return sql;
}   

module.exports = {
    getAllProducts,
    getProductById,
}