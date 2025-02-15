const mysql = require('mysql2/promise'); // /promise let use to use aysnc on mysql
const dotenv = require('dotenv');

// Run the enviroment variables
dotenv.config();

let pool;

async function initDatabase() {
  try {
    pool = await mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
    });
    console.log('✅ Right conection to MariaDB');
  } catch (error) {
    console.error('❌ Error to connect MariaDB:', error.message);
    process.exit(1);
  }
}

initDatabase();

module.exports = pool;
