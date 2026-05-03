require('dotenv').config();
const mysql = require('mysql2/promise');

async function checkUsersTable() {
  let connection;
  try {
    // 연결 설정
    connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      port: process.env.MYSQL_PORT || 3306,
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'logindb'
    });

    console.log('✅ MySQL 연결 성공!\n');

    // 테이블 구조 확인
    console.log('📋 Users 테이블 구조:');
    console.log('='.repeat(80));
    const [columns] = await connection.query('DESCRIBE users');
    console.table(columns);

    // 테이블 데이터 확인
    console.log('\n👥 Users 테이블 데이터:');
    console.log('='.repeat(80));
    const [rows] = await connection.query('SELECT id, username, created_at FROM users');
    
    if (rows.length === 0) {
      console.log('테이블이 비어있습니다.');
    } else {
      console.table(rows);
      console.log(`\n총 ${rows.length}명의 사용자가 등록되어 있습니다.`);
    }

    // 테이블 생성 쿼리 확인
    console.log('\n🔧 테이블 생성 쿼리:');
    console.log('='.repeat(80));
    const [createTable] = await connection.query('SHOW CREATE TABLE users');
    console.log(createTable[0]['Create Table']);

  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
    console.error('\n연결 정보:');
    console.log('Host:', process.env.MYSQL_HOST || 'localhost');
    console.log('Port:', process.env.MYSQL_PORT || 3306);
    console.log('User:', process.env.MYSQL_USER || 'root');
    console.log('Database:', process.env.MYSQL_DATABASE || 'logindb');
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n✅ MySQL 연결 종료');
    }
  }
}

checkUsersTable();

// Made with Bob
