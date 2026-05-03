require('dotenv').config();
const mysql = require('mysql2/promise');

// MySQL 연결 풀 생성
// Railway는 MYSQL_URL을 자동으로 제공합니다
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || process.env.DB_HOST || 'localhost',
  port: process.env.MYSQL_PORT || process.env.DB_PORT || 3306,
  user: process.env.MYSQL_USER || process.env.DB_USER || 'root',
  password: process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || process.env.DB_NAME || 'logindb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// 연결 확인
pool.getConnection()
  .then(connection => {
    console.log('Database connected successfully');
    connection.release();
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });

// 데이터베이스 테이블 초기화
const initDB = async () => {
  try {
    const connection = await pool.getConnection();
    try {
      await connection.query(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(50) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('Database initialized successfully');
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error('Error initializing database:', err);
    throw err;
  }
};

module.exports = { pool, initDB };

// Made with Bob
