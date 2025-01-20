const db = require('../db');

async function getProductById(id) {
    const [sql] = await db.query("SELECT * FROM Products WHERE Product_id = ?", [id]);
    return sql[0];
}

module.exports = {
    getProductById,
}