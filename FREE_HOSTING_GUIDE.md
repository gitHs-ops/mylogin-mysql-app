# 무료 호스팅 가이드

Node.js + PostgreSQL 로그인 시스템을 무료로 배포할 수 있는 플랫폼 가이드입니다.

## 📋 목차
1. [추천 플랫폼 비교](#추천-플랫폼-비교)
2. [Render (최고 추천)](#1-render-최고-추천)
3. [Railway](#2-railway)
4. [Fly.io](#3-flyio)
5. [Heroku (유료 전환)](#4-heroku-유료-전환)
6. [기타 옵션](#5-기타-옵션)

---

## 추천 플랫폼 비교

| 플랫폼 | Node.js | PostgreSQL | 무료 한도 | 추천도 | 난이도 |
|--------|---------|------------|-----------|--------|--------|
| **Render** | ✅ | ✅ | 750시간/월 | ⭐⭐⭐⭐⭐ | 쉬움 |
| **Railway** | ✅ | ✅ | $5 크레딧/월 | ⭐⭐⭐⭐ | 쉬움 |
| **Fly.io** | ✅ | ✅ | 3개 VM 무료 | ⭐⭐⭐⭐ | 중간 |
| **Vercel** | ✅ | ❌ | 무제한 | ⭐⭐⭐ | 쉬움 |
| **Netlify** | ✅ | ❌ | 무제한 | ⭐⭐⭐ | 쉬움 |

---

## 1. Render (최고 추천) ⭐⭐⭐⭐⭐

### 장점
- ✅ Node.js + PostgreSQL 모두 무료
- ✅ 설정이 매우 간단
- ✅ 자동 배포 (GitHub 연동)
- ✅ 무료 SSL 인증서
- ✅ 한국어 지원 양호

### 무료 플랜 제한
- 750시간/월 (약 31일)
- 15분 비활성 시 슬립 모드
- 512MB RAM
- PostgreSQL 90일 후 삭제 (백업 필요)

### 배포 단계

#### Step 1: GitHub에 코드 업로드

```bash
# Git 초기화
git init
git add .
git commit -m "Initial commit"

# GitHub 저장소 생성 후
git remote add origin https://github.com/your-username/myLogin02.git
git push -u origin main
```

#### Step 2: Render 계정 생성
1. https://render.com 접속
2. GitHub 계정으로 가입
3. 저장소 연결 허용

#### Step 3: PostgreSQL 데이터베이스 생성
1. Dashboard → New → PostgreSQL
2. 이름: `logindb`
3. Database: `logindb`
4. User: `logindb_user`
5. Region: Singapore (한국과 가장 가까움)
6. Plan: Free
7. Create Database 클릭
8. **Internal Database URL 복사** (나중에 사용)

#### Step 4: Web Service 생성
1. Dashboard → New → Web Service
2. GitHub 저장소 선택
3. 설정:
   - Name: `mylogin-app`
   - Region: Singapore
   - Branch: `main`
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: Free

#### Step 5: 환경 변수 설정
Environment 탭에서 추가:

```env
NODE_ENV=production
PORT=3000
DB_USER=logindb_user
DB_HOST=dpg-xxxxx-a.singapore-postgres.render.com
DB_NAME=logindb
DB_PASSWORD=xxxxxxxxxxxxx
DB_PORT=5432
SESSION_SECRET=your_random_secret_key_here
```

**중요:** Render의 Internal Database URL에서 정보 추출:
```
postgresql://logindb_user:password@host:5432/logindb
```

#### Step 6: 배포
- Save Changes 클릭
- 자동으로 빌드 및 배포 시작
- 5-10분 후 완료

#### Step 7: 접속
- `https://mylogin-app.onrender.com` 형식의 URL 제공
- 무료 SSL 자동 적용

### 필수 코드 수정

**package.json에 engines 추가:**
```json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

**server.js 포트 설정:**
```javascript
const PORT = process.env.PORT || 3000;
```

### 슬립 모드 해결 방법

**무료 플랜의 15분 슬립 모드 방지:**

1. **UptimeRobot 사용 (권장)**
   - https://uptimerobot.com 가입
   - 5분마다 사이트 핑
   - 무료로 50개 모니터 가능

2. **Cron-job.org 사용**
   - https://cron-job.org 가입
   - 5분마다 HTTP 요청

---

## 2. Railway ⭐⭐⭐⭐

### 장점
- ✅ 매우 간단한 배포
- ✅ PostgreSQL 포함
- ✅ 자동 HTTPS
- ✅ 실시간 로그

### 무료 플랜
- $5 크레딧/월
- 약 500시간 실행 가능
- 슬립 모드 없음

### 배포 단계

#### Step 1: Railway 가입
1. https://railway.app 접속
2. GitHub 계정으로 가입

#### Step 2: 새 프로젝트 생성
1. New Project 클릭
2. Deploy from GitHub repo 선택
3. 저장소 선택

#### Step 3: PostgreSQL 추가
1. New → Database → PostgreSQL
2. 자동으로 환경 변수 설정됨

#### Step 4: 환경 변수 확인
Variables 탭에서 자동 생성된 변수 확인:
- `DATABASE_URL`
- `PGHOST`
- `PGPORT`
- `PGUSER`
- `PGPASSWORD`
- `PGDATABASE`

추가 변수 설정:
```env
NODE_ENV=production
SESSION_SECRET=your_random_secret_key
```

#### Step 5: 배포
- 자동으로 배포 시작
- 도메인 자동 생성: `https://mylogin02-production.up.railway.app`

### 코드 수정

**db.js를 Railway 환경 변수에 맞게 수정:**
```javascript
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false
});
```

---

## 3. Fly.io ⭐⭐⭐⭐

### 장점
- ✅ 전 세계 엣지 배포
- ✅ 빠른 속도
- ✅ 3개 VM 무료

### 무료 플랜
- 3개 공유 CPU VM
- 256MB RAM per VM
- 3GB 스토리지

### 배포 단계

#### Step 1: Fly CLI 설치

**Windows:**
```powershell
iwr https://fly.io/install.ps1 -useb | iex
```

**Mac/Linux:**
```bash
curl -L https://fly.io/install.sh | sh
```

#### Step 2: 로그인
```bash
fly auth login
```

#### Step 3: 앱 초기화
```bash
cd C:\myPrjt01\myLogin02
fly launch
```

질문에 답변:
- App name: `mylogin02`
- Region: Tokyo (한국과 가까움)
- PostgreSQL: Yes
- Redis: No

#### Step 4: 환경 변수 설정
```bash
fly secrets set SESSION_SECRET=your_random_secret_key
fly secrets set NODE_ENV=production
```

#### Step 5: 배포
```bash
fly deploy
```

#### Step 6: 접속
```bash
fly open
```

### fly.toml 설정

자동 생성된 `fly.toml` 파일 확인:
```toml
app = "mylogin02"

[build]
  builder = "heroku/buildpacks:20"

[env]
  PORT = "8080"

[[services]]
  internal_port = 8080
  protocol = "tcp"

  [[services.ports]]
    handlers = ["http"]
    port = 80

  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443
```

---

## 4. Heroku (유료 전환) ⚠️

**2022년 11월부터 무료 플랜 종료**

최소 비용: $7/월 (Eco Dyno)

---

## 5. 기타 옵션

### Vercel + Supabase (PostgreSQL)

**Vercel (프론트엔드 + API):**
- 무료 무제한
- Serverless Functions
- 자동 HTTPS

**Supabase (PostgreSQL):**
- 500MB 데이터베이스 무료
- 실시간 기능
- 자동 백업

#### 배포 방법

1. **Supabase 설정**
   ```bash
   # Supabase 가입 후 프로젝트 생성
   # Connection String 복사
   ```

2. **Vercel 배포**
   ```bash
   npm install -g vercel
   vercel login
   vercel
   ```

3. **환경 변수 설정**
   - Vercel Dashboard → Settings → Environment Variables
   - DATABASE_URL 추가

**주의:** Vercel은 Serverless이므로 세션 관리가 복잡함

### Netlify + Neon (PostgreSQL)

**Netlify (프론트엔드 + Functions):**
- 무료 무제한
- 125,000 함수 호출/월

**Neon (PostgreSQL):**
- 무료 PostgreSQL
- 3GB 스토리지
- Serverless

---

## 6. 최종 추천

### 🥇 1위: Render
**이유:**
- 가장 간단한 설정
- Node.js + PostgreSQL 모두 무료
- 초보자 친화적
- 한국어 커뮤니티 활발

**단점:**
- 15분 슬립 모드 (UptimeRobot으로 해결)
- 90일 후 DB 삭제 (백업 필요)

### 🥈 2위: Railway
**이유:**
- 매우 빠른 배포
- 슬립 모드 없음
- 실시간 로그

**단점:**
- $5 크레딧 소진 시 중단
- 약 500시간만 무료

### 🥉 3위: Fly.io
**이유:**
- 전 세계 배포
- 빠른 속도
- 3개 VM 무료

**단점:**
- CLI 사용 필요
- 설정이 복잡

---

## 7. 배포 전 체크리스트

### 필수 작업

- [ ] `.env` 파일 생성 (로컬 개발용)
- [ ] `.gitignore`에 `.env` 추가
- [ ] `package.json`에 engines 추가
- [ ] 환경 변수로 모든 설정 변경
- [ ] 데이터베이스 연결 문자열 환경 변수화
- [ ] 포트를 `process.env.PORT`로 설정
- [ ] 프로덕션 에러 처리 추가

### 보안 체크

- [ ] 강력한 SESSION_SECRET 생성
- [ ] 데이터베이스 비밀번호 변경
- [ ] HTTPS 강제 설정
- [ ] CORS 설정
- [ ] Rate Limiting 추가

### 테스트

- [ ] 로컬에서 프로덕션 모드 테스트
- [ ] 모든 API 엔드포인트 테스트
- [ ] 회원가입/로그인 테스트
- [ ] 에러 처리 테스트

---

## 8. 배포 후 모니터링

### 무료 모니터링 도구

1. **UptimeRobot**
   - https://uptimerobot.com
   - 5분마다 상태 체크
   - 다운타임 알림

2. **Better Uptime**
   - https://betteruptime.com
   - 무료 플랜: 10개 모니터
   - 상태 페이지 제공

3. **Render 내장 모니터링**
   - 로그 확인
   - 메트릭 확인
   - 알림 설정

---

## 9. 비용 비교 (월간)

| 플랫폼 | 무료 | 유료 시작 | 추천 용도 |
|--------|------|-----------|-----------|
| Render | ✅ 750시간 | $7/월 | 개인 프로젝트 |
| Railway | ✅ $5 크레딧 | $5/월 | 소규모 앱 |
| Fly.io | ✅ 3 VM | $1.94/월 | 글로벌 서비스 |
| Vercel | ✅ 무제한 | $20/월 | 프론트엔드 중심 |

---

## 10. 문제 해결

### 일반적인 문제

**문제: 데이터베이스 연결 실패**
```javascript
// SSL 설정 추가
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
```

**문제: 세션이 유지되지 않음**
```javascript
// 프로덕션 환경에서 secure 쿠키 설정
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 3600000
  }
}));
```

**문제: 포트 에러**
```javascript
// 환경 변수 포트 사용
const PORT = process.env.PORT || 3000;
```

---

## 결론

### 초보자 추천 순서

1. **Render** - 가장 쉽고 안정적
2. **Railway** - 빠르고 간단
3. **Fly.io** - 고급 기능 필요 시

### 시작하기

```bash
# 1. GitHub에 코드 업로드
git init
git add .
git commit -m "Initial commit"
git push

# 2. Render.com 접속
# 3. GitHub 연동
# 4. PostgreSQL 생성
# 5. Web Service 생성
# 6. 환경 변수 설정
# 7. 배포 완료!
```

**예상 소요 시간:** 30분

---

**작성일:** 2026-05-02  
**작성자:** Bob (AI Assistant)  
**버전:** 1.0