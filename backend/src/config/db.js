const mysql = require('mysql2/promise');
const dotenv = require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    charset: 'utf8mb4', 
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

pool.on('connection', (connection) => {
    connection.query("SET NAMES 'utf8mb4' COLLATE 'utf8mb4_unicode_ci'");
    connection.query("SET character_set_client = 'utf8mb4'");
    connection.query("SET character_set_results = 'utf8mb4'");
    connection.query("SET character_set_connection = 'utf8mb4'");
});

const connectDB = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('MySQL connected');
        connection.release();
    } catch (error) {
        console.error('Error Connection to MySQL', error.message);
        process.exit(1);
    }
};

module.exports = { pool, connectDB };
