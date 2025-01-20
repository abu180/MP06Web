require('dotenv').config({ path: './dbVariables.env' });

console.log('Conectando con la base de datos...');
console.log(`Usuario: ${process.env.DB_USER}`);
console.log(`Base de datos: ${process.env.DB_NAME}`);

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 3306,
});


module.exports = pool;