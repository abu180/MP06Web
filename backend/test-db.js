const mysql = require('mysql2/promise');

async function testConnection() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'EwnizEv5',
            database: 'Shopy',
            port: 3306,
        });
        console.log('✅ Conexión exitosa a MySQL');
        await connection.end();
    } catch (error) {
        console.error('❌ Error de conexión:', error);
    }
}

testConnection();
