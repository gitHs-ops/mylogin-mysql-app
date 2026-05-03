# 프로덕션 환경 배포 가이드

이 문서는 myLogin02 로그인 시스템을 실제 운영 환경(프로덕션)에 배포하기 위한 가이드입니다.

## 📋 목차
1. [필수 보안 조치](#1-필수-보안-조치)
2. [환경 변수 설정](#2-환경-변수-설정)
3. [데이터베이스 보안](#3-데이터베이스-보안)
4. [HTTPS 설정](#4-https-설정)
5. [프로세스 관리](#5-프로세스-관리)
6. [로깅 및 모니터링](#6-로깅-및-모니터링)
7. [백업 전략](#7-백업-전략)
8. [성능 최적화](#8-성능-최적화)

---

## 1. 필수 보안 조치

### 1.1 환경 변수 사용 (.env)

**현재 문제점:**
- 데이터베이스 비밀번호가 코드에 하드코딩됨
- 세션 시크릿이 노출됨

**해결 방법:**

```bash
# .env 파일 생성
npm install dotenv
```

`.env` 파일 생성:
```env
# 데이터베이스 설정
DB_USER=postgres
DB_HOST=localhost
DB_NAME=logindb
DB_PASSWORD=your_secure_password_here
DB_PORT=5432

# 서버 설정
PORT=3000
NODE_ENV=production

# 세션 설정
SESSION_SECRET=your_very_long_random_secret_key_here_at_least_32_characters

# 보안 설정
BCRYPT_ROUNDS=12
SESSION_MAX_AGE=3600000
```

**db.js 수정:**
```javascript
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
```

**server.js 수정:**
```javascript
require('dotenv').config();
const PORT = process.env.PORT || 3000;

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: parseInt(process.env.SESSION_MAX_AGE),
    secure: process.env.NODE_ENV === 'production', // HTTPS에서만 쿠키 전송
    httpOnly: true,
    sameSite: 'strict'
  }
}));
```

### 1.2 .gitignore 업데이트

```gitignore
# 환경 변수
.env
.env.local
.env.production

# 로그 파일
logs/
*.log

# 운영 설정
config/production.json
```

---

## 2. 환경 변수 설정

### 2.1 강력한 비밀번호 생성

```javascript
// 세션 시크릿 생성 (Node.js)
const crypto = require('crypto');
console.log(crypto.randomBytes(32).toString('hex'));
```

### 2.2 환경별 설정

**개발 환경 (.env.development):**
```env
NODE_ENV=development
DB_HOST=localhost
SESSION_SECRET=dev_secret_key
```

**프로덕션 환경 (.env.production):**
```env
NODE_ENV=production
DB_HOST=your_production_db_host
SESSION_SECRET=your_production_secret_key
```

---

## 3. 데이터베이스 보안

### 3.1 전용 데이터베이스 사용자 생성

```sql
-- PostgreSQL에서 실행
CREATE USER loginapp WITH PASSWORD 'strong_password_here';
GRANT CONNECT ON DATABASE logindb TO loginapp;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE users TO loginapp;
GRANT USAGE, SELECT ON SEQUENCE users_id_seq TO loginapp;
```

### 3.2 데이터베이스 연결 풀 설정

**db.js 개선:**
```javascript
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  max: 20, // 최대 연결 수
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false
});
```

### 3.3 데이터베이스 백업 자동화

```bash
# Windows에서 백업 스크립트 (backup.bat)
@echo off
set PGPASSWORD=your_password
set BACKUP_DIR=C:\backups\logindb
set TIMESTAMP=%date:~0,4%%date:~5,2%%date:~8,2%_%time:~0,2%%time:~3,2%%time:~6,2%
"C:\Program Files\PostgreSQL\18\bin\pg_dump.exe" -U postgres -d logindb > %BACKUP_DIR%\backup_%TIMESTAMP%.sql
```

---

## 4. HTTPS 설정

### 4.1 SSL 인증서 획득

**무료 옵션:**
- Let's Encrypt (권장)
- Cloudflare SSL

**유료 옵션:**
- Comodo
- DigiCert

### 4.2 Express에 HTTPS 적용

```javascript
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('./ssl/private-key.pem'),
  cert: fs.readFileSync('./ssl/certificate.pem')
};

https.createServer(options, app).listen(443, () => {
  console.log('HTTPS Server running on port 443');
});

// HTTP를 HTTPS로 리다이렉트
const http = require('http');
http.createServer((req, res) => {
  res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
  res.end();
}).listen(80);
```

### 4.3 리버스 프록시 사용 (권장)

**Nginx 설정 예시:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/certificate.pem;
    ssl_certificate_key /path/to/private-key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 5. 프로세스 관리

### 5.1 PM2 사용 (권장)

```bash
# PM2 설치
npm install -g pm2

# 애플리케이션 시작
pm2 start server.js --name "loginapp"

# 자동 재시작 설정
pm2 startup
pm2 save

# 모니터링
pm2 monit

# 로그 확인
pm2 logs loginapp
```

**ecosystem.config.js 생성:**
```javascript
module.exports = {
  apps: [{
    name: 'loginapp',
    script: './server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    max_memory_restart: '1G'
  }]
};
```

### 5.2 Windows 서비스로 등록

```bash
# node-windows 설치
npm install -g node-windows

# 서비스 생성 스크립트 (install-service.js)
```

```javascript
const Service = require('node-windows').Service;

const svc = new Service({
  name: 'LoginApp',
  description: 'Login System Service',
  script: 'C:\\myPrjt01\\myLogin02\\server.js',
  nodeOptions: [
    '--harmony',
    '--max_old_space_size=4096'
  ]
});

svc.on('install', () => {
  svc.start();
});

svc.install();
```

---

## 6. 로깅 및 모니터링

### 6.1 Winston 로거 설정

```bash
npm install winston winston-daily-rotate-file
```

**logger.js 생성:**
```javascript
const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new DailyRotateFile({
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d'
    }),
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '20m',
      maxFiles: '30d'
    })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
```

### 6.2 에러 처리 미들웨어

```javascript
// server.js에 추가
const logger = require('./logger');

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip
  });
  
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? '서버 오류가 발생했습니다.' 
      : err.message
  });
});
```

---

## 7. 백업 전략

### 7.1 자동 백업 스케줄

**Windows 작업 스케줄러 사용:**
1. 작업 스케줄러 열기
2. 기본 작업 만들기
3. backup.bat 스크립트 실행 설정
4. 매일 새벽 2시 실행 설정

### 7.2 백업 검증

```bash
# 백업 복원 테스트
psql -U postgres -d logindb_test < backup_file.sql
```

### 7.3 원격 백업

```bash
# AWS S3로 백업 업로드 (예시)
aws s3 cp backup_file.sql s3://your-bucket/backups/
```

---

## 8. 성능 최적화

### 8.1 데이터베이스 인덱스

```sql
-- 자주 조회되는 컬럼에 인덱스 생성
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_created_at ON users(created_at);
```

### 8.2 연결 풀 최적화

```javascript
// db.js
const pool = new Pool({
  // ... 기존 설정
  max: 20, // 동시 연결 수
  min: 5,  // 최소 유지 연결 수
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

### 8.3 Rate Limiting

```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 5, // 최대 5회 시도
  message: '너무 많은 로그인 시도가 있었습니다. 15분 후 다시 시도해주세요.'
});

app.post('/api/login', loginLimiter, async (req, res) => {
  // 로그인 로직
});
```

### 8.4 Helmet 보안 헤더

```bash
npm install helmet
```

```javascript
const helmet = require('helmet');
app.use(helmet());
```

### 8.5 CORS 설정

```bash
npm install cors
```

```javascript
const cors = require('cors');

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000',
  credentials: true
}));
```

---

## 9. 배포 체크리스트

### 배포 전 확인사항

- [ ] .env 파일 생성 및 모든 환경 변수 설정
- [ ] .env 파일이 .gitignore에 포함되어 있는지 확인
- [ ] 데이터베이스 전용 사용자 생성
- [ ] 강력한 비밀번호 설정 (DB, 세션)
- [ ] HTTPS 인증서 설치
- [ ] 방화벽 설정 (필요한 포트만 개방)
- [ ] PM2 또는 프로세스 관리자 설정
- [ ] 로깅 시스템 구축
- [ ] 백업 자동화 설정
- [ ] Rate Limiting 적용
- [ ] Helmet 보안 헤더 적용
- [ ] 에러 처리 미들웨어 구현
- [ ] 데이터베이스 인덱스 생성
- [ ] 성능 테스트 수행
- [ ] 보안 취약점 스캔

### 배포 후 모니터링

- [ ] 서버 상태 모니터링
- [ ] 로그 정기 확인
- [ ] 데이터베이스 성능 모니터링
- [ ] 백업 정상 작동 확인
- [ ] SSL 인증서 만료일 확인
- [ ] 디스크 공간 모니터링

---

## 10. 추가 보안 권장사항

### 10.1 비밀번호 정책 강화

```javascript
// 비밀번호 강도 검증
function validatePassword(password) {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return password.length >= minLength && 
         hasUpperCase && 
         hasLowerCase && 
         hasNumbers && 
         hasSpecialChar;
}
```

### 10.2 계정 잠금 기능

```javascript
// 로그인 실패 횟수 추적
const loginAttempts = new Map();

app.post('/api/login', async (req, res) => {
  const { username } = req.body;
  const attempts = loginAttempts.get(username) || 0;
  
  if (attempts >= 5) {
    return res.status(429).json({
      success: false,
      message: '계정이 잠겼습니다. 30분 후 다시 시도해주세요.'
    });
  }
  
  // 로그인 로직...
  
  // 실패 시
  loginAttempts.set(username, attempts + 1);
  setTimeout(() => loginAttempts.delete(username), 30 * 60 * 1000);
});
```

### 10.3 2단계 인증 (선택사항)

```bash
npm install speakeasy qrcode
```

---

## 11. 문제 해결

### 일반적인 프로덕션 문제

**문제: 메모리 누수**
```bash
# 메모리 사용량 모니터링
pm2 monit

# 메모리 제한 설정
pm2 start server.js --max-memory-restart 1G
```

**문제: 데이터베이스 연결 끊김**
```javascript
// 연결 재시도 로직
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});
```

**문제: 세션 손실**
```bash
# Redis를 세션 스토어로 사용
npm install connect-redis redis
```

---

## 12. 참고 자료

- [Node.js 프로덕션 베스트 프랙티스](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
- [Express 보안 베스트 프랙티스](https://expressjs.com/en/advanced/best-practice-security.html)
- [PostgreSQL 보안 가이드](https://www.postgresql.org/docs/current/security.html)
- [OWASP 보안 가이드](https://owasp.org/)

---

**작성일:** 2026-05-02  
**작성자:** Bob (AI Assistant)  
**버전:** 1.0