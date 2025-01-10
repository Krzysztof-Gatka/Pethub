const mysql = require('mysql2/promise')
const dotenv = require('dotenv').config()

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

const connectDB = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('MySQL connected')
        connection.release();
    } catch (error) {
        console.error('Error Connection to MySQL', error.message);
        process.exit(1)
    }
}



module.exports = {pool, connectDB};