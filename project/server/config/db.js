const mysql = require('mysql2');
require('dotenv').config();

// Create a connection pool to the MySQL database
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'TargetGPA@9.',
  database: process.env.DB_NAME || 'ecomplatform',
  port: process.env.DB_PORT || 3306,
});

// Export the promise-based version of the pool
module.exports = pool.promise();