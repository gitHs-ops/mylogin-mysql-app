# GitHub 배포 가이드 (myLogin03)

GitHub에 코드를 업로드하고 클라우드 플랫폼에 배포하는 완벽한 가이드입니다.

**리포지토리 이름: myLogin03**

## 📋 목차
1. [GitHub 업로드 단계](#github-업로드-단계)
2. [배포 전 준비](#배포-전-준비)
3. [Render 배포](#render-배포)
4. [소스 수정 후 재배포](#소스-수정-후-재배포)
5. [Personal Access Token 생성](#personal-access-token-생성)
6. [문제 해결](#문제-해결)

---

## GitHub 업로드 단계

### 사전 준비

#### 1. Git 설치 확인

```powershell
# Git 버전 확인
git --version

# 설치 안 되어 있으면
# https://git-scm.com/download/win 에서 다운로드
```

#### 2. Git 초기 설정

```powershell
# 사용자 이름 설정
git config --global user.name "Your Name"

# 이메일 설정 (GitHub 이메일과 동일하게)
git config --global user.email "your.email@example.com"

# 설정 확인
git config --list
```

#### 3. GitHub 계정 준비

1. https://github.com 접속
2. 계정 생성 (무료)
3. 이메일 인증 완료

### Step 1: .gitignore 파일 확인

**현재 .gitignore 내용 확인:**

```bash
# 프로젝트 폴더에서
type .gitignore
```

**필수 내용 (없으면 추가):**

```gitignore
# 의존성
node_modules/
package-lock.json

# 환경 변수
.env
.env.local
.env.production

# 로그
logs/
*.log
npm-debug.log*

# 운영 체제
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# 빌드 결과
dist/
build/

# 데이터베이스
*.sqlite
*.db

# 백업 파일
*.bak
*.backup
```

### Step 2: 로컬 Git 저장소 초기화

```powershell
# 프로젝트 폴더로 이동
cd C:\myPrjt01\myLogin02

# Git 저장소 초기화
git init

# 현재 상태 확인
git status
```

### Step 3: 파일 추가 및 커밋

```powershell
# 모든 파일 스테이징
git add .

# 커밋 (첫 커밋)
git commit -m "Initial commit: Node.js login system with PostgreSQL"

# 또는 더 상세한 커밋 메시지
git commit -m "feat: Initial implementation of login system

- User registration with bcrypt password hashing
- Session-based authentication
- PostgreSQL database integration
- User list view with authentication
- Responsive UI design"
```

### Step 4: GitHub 리포지토리 생성

#### 웹 브라우저에서:

1. **GitHub 로그인**
2. **우측 상단 '+' 클릭 → New repository**
3. **리포지토리 설정:**
   ```
   Repository name: myLogin03
   Description: Simple login system built with Node.js, Express, and PostgreSQL
   Public (공개) 또는 Private (비공개) 선택
   
   ☐ Add a README file (체크 해제 - 이미 있음)
   ☐ Add .gitignore (체크 해제 - 이미 있음)
   Choose a license: MIT License (선택사항)
   ```
4. **Create repository 클릭**

**중요:** README와 .gitignore는 이미 로컬에 있으므로 체크 해제!

### Step 5: 원격 저장소 연결

**GitHub에서 제공하는 명령어 복사:**

```powershell
# 원격 저장소 추가
git remote add origin https://github.com/your-username/myLogin03.git

# 기본 브랜치 이름 확인/변경
git branch -M main

# 원격 저장소에 푸시
git push -u origin main
```

### Step 6: 업로드 확인

```powershell
# 원격 저장소 확인
git remote -v

# 브라우저에서 확인
# https://github.com/your-username/myLogin03
```

---

## 배포 전 준비

### 1. README.md 업데이트

**프로젝트 소개 추가:**

```markdown
# myLogin03

Simple and secure login system built with Node.js, Express, and PostgreSQL.

## Features

- ✅ User registration with password hashing (bcrypt)
- ✅ Session-based authentication
- ✅ User list view (authenticated users only)
- ✅ Responsive UI design
- ✅ PostgreSQL database
- ✅ Input validation
- ✅ Race condition handling

## Tech Stack

- **Backend:** Node.js, Express
- **Database:** PostgreSQL
- **Security:** bcrypt, express-session
- **Frontend:** HTML, CSS, Vanilla JavaScript

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 18+

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/myLogin03.git
cd myLogin03
```

2. Install dependencies
```bash
npm install
```

3. Create PostgreSQL database
```sql
CREATE DATABASE logindb;
```

4. Update database credentials in `db.js`

5. Start the server
```bash
npm start
```

6. Open browser
```
http://localhost:3000
```

## Environment Variables

For production deployment, create a `.env` file:

```env
NODE_ENV=production
PORT=3000
DB_USER=your_db_user
DB_HOST=localhost
DB_NAME=logindb
DB_PASSWORD=your_db_password
DB_PORT=5432
SESSION_SECRET=your_random_secret_key
```

## Deployment

See [FREE_HOSTING_GUIDE.md](FREE_HOSTING_GUIDE.md) for deployment instructions.

## License

MIT License

## Author

Your Name
```

### 2. package.json 확인

**필수 필드 추가:**

```json
{
  "name": "mylogin03",
  "version": "1.1.0",
  "description": "Simple login system with Node.js and PostgreSQL",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "keywords": [
    "login",
    "authentication",
    "nodejs",
    "express",
    "postgresql",
    "session"
  ],
  "author": "Your Name",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/your-username/myLogin03.git"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  },
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.3",
    "body-parser": "^1.20.2",
    "bcrypt": "^5.1.1",
    "express-session": "^1.17.3"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

### 3. 민감한 정보 제거 확인

**절대 업로드하면 안 되는 것:**

```bash
# .env 파일이 .gitignore에 있는지 확인
cat .gitignore | findstr .env

# db.js에 실제 비밀번호가 하드코딩되어 있는지 확인
type db.js
```

**db.js를 환경 변수로 변경 (권장):**

```javascript
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'logindb',
  password: process.env.DB_PASSWORD || 'your_password',
  port: process.env.DB_PORT || 5432,
});

module.exports = { pool, initDB };
```

**dotenv 설치:**

```bash
npm install dotenv
```

**.env.example 파일 생성 (업로드용):**

```env
# Database Configuration
DB_USER=postgres
DB_HOST=localhost
DB_NAME=logindb
DB_PASSWORD=your_password_here
DB_PORT=5432

# Server Configuration
PORT=3000
NODE_ENV=development

# Session Configuration
SESSION_SECRET=your_random_secret_key_here
```

---

## Render 배포

### Step 1: GitHub 연동

1. https://render.com 접속
2. GitHub 계정으로 가입
3. Dashboard → Account Settings → Connected Accounts
4. GitHub 연결 및 저장소 접근 허용

### Step 2: PostgreSQL 생성

1. Dashboard → New → PostgreSQL
2. 설정:
   ```
   Name: logindb
   Database: logindb
   User: logindb_user
   Region: Singapore
   Plan: Free
   ```
3. Create Database
4. **Internal Database URL 복사**

### Step 3: Web Service 생성

1. Dashboard → New → Web Service
2. Connect Repository 선택
3. 저장소 선택: `myLogin03`
4. 설정:
   ```
   Name: mylogin03
   Region: Singapore
   Branch: main
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Plan: Free
   ```

### Step 4: 환경 변수 설정

Environment 탭에서 추가:

```env
NODE_ENV=production
PORT=3000
DB_USER=logindb_user
DB_HOST=dpg-xxxxx-a.singapore-postgres.render.com
DB_NAME=logindb
DB_PASSWORD=xxxxxxxxxxxxx
DB_PORT=5432
SESSION_SECRET=your_random_secret_key_here_min_32_chars
```

**SESSION_SECRET 생성:**

```powershell
# PowerShell에서 실행
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

### Step 5: 배포

1. Save Changes 클릭
2. 자동 빌드 시작
3. 5-10분 후 완료
4. 제공된 URL로 접속: `https://mylogin03.onrender.com`

---

## 소스 수정 후 재배포

### 🔄 자동 배포 (Render 기본 설정)

Render는 GitHub와 연동되어 있어서 **자동 배포**가 됩니다.

**작업 흐름:**

```
1. 로컬에서 코드 수정
   ↓
2. Git commit & push
   ↓
3. GitHub에 자동 업로드
   ↓
4. Render가 자동 감지
   ↓
5. 자동으로 재배포 시작
   ↓
6. 5-10분 후 배포 완료
```

### 단계별 상세 가이드

#### 1. 로컬에서 코드 수정

```javascript
// 예: server.js 수정
app.get('/api/test', (req, res) => {
  res.json({ message: 'New feature added!' });
});
```

#### 2. Git으로 변경사항 커밋

```powershell
# 변경된 파일 확인
git status

# 변경사항 스테이징
git add .

# 또는 특정 파일만
git add server.js

# 커밋 (의미있는 메시지 작성)
git commit -m "feat: Add test API endpoint"

# GitHub에 푸시
git push
```

#### 3. Render 자동 배포 확인

**Render Dashboard에서:**

1. **자동으로 배포 시작**
   - "Deploy triggered by push to main"
   - 실시간 로그 확인 가능

2. **배포 진행 상황**
   ```
   Building...
   Installing dependencies...
   Starting server...
   Deploy live
   ```

3. **완료 알림**
   - 이메일 알림 (설정 시)
   - Dashboard에 "Live" 표시

#### 4. 배포 확인

```
https://mylogin03.onrender.com
```

브라우저에서 접속하여 변경사항 확인

### 📝 커밋 메시지 예시

**좋은 커밋 메시지:**

```powershell
# 새 기능 추가
git commit -m "feat: Add password reset functionality"

# 버그 수정
git commit -m "fix: Resolve session timeout issue"

# UI 개선
git commit -m "style: Update login page design"

# 문서 수정
git commit -m "docs: Update README with new features"

# 성능 개선
git commit -m "perf: Optimize database queries"

# 리팩토링
git commit -m "refactor: Simplify authentication logic"
```

### 🚀 배포 전략

#### 전략 1: 직접 main 브랜치에 푸시 (간단)

```powershell
# 수정
git add .
git commit -m "feat: Add new feature"
git push

# Render 자동 배포
```

**장점:** 빠르고 간단  
**단점:** 테스트 없이 바로 프로덕션 반영

#### 전략 2: 브랜치 사용 (권장)

```powershell
# 새 브랜치 생성
git checkout -b feature/new-feature

# 수정 및 커밋
git add .
git commit -m "feat: Add new feature"
git push origin feature/new-feature

# GitHub에서 Pull Request 생성
# 코드 리뷰 후 main에 병합

# main 브랜치로 전환
git checkout main
git pull

# Render 자동 배포
```

**장점:** 안전하고 체계적  
**단점:** 단계가 많음

### 🔍 배포 모니터링

#### Render Dashboard에서 확인

**Deploy 탭:**
- 배포 히스토리
- 각 배포의 상태
- 로그 확인
- 롤백 가능

**Logs 탭:**
- 실시간 서버 로그
- 에러 확인
- 디버깅

**Metrics 탭:**
- CPU 사용량
- 메모리 사용량
- 응답 시간

### ⚠️ 배포 실패 시

#### 일반적인 원인

1. **빌드 에러**
   ```
   npm install 실패
   → package.json 확인
   ```

2. **시작 에러**
   ```
   서버 시작 실패
   → 환경 변수 확인
   → 포트 설정 확인
   ```

3. **데이터베이스 연결 실패**
   ```
   DB 연결 에러
   → 환경 변수 확인
   → SSL 설정 확인
   ```

#### 해결 방법

**1. 로그 확인:**
```
Render Dashboard → Logs
에러 메시지 확인
```

**2. 이전 버전으로 롤백:**
```
Render Dashboard → Deploys
→ 이전 성공한 배포 선택
→ Redeploy
```

**3. 로컬에서 테스트:**
```powershell
# 프로덕션 모드로 로컬 테스트
set NODE_ENV=production
npm start
```

### 🎯 실전 예시

**시나리오: 로그인 페이지 디자인 변경**

```powershell
# 1. 파일 수정
# public/styles.css 수정

# 2. 로컬 테스트
npm start
# http://localhost:3000 확인

# 3. Git 커밋
git add public/styles.css
git commit -m "style: Update login page button color"

# 4. GitHub 푸시
git push

# 5. Render 확인
# Dashboard에서 "Deploying..." 확인
# 5분 후 "Live" 확인

# 6. 배포된 사이트 확인
# https://mylogin03.onrender.com
```

### 💡 팁

**빠른 배포를 위한 팁:**

1. **작은 단위로 자주 커밋**
   ```powershell
   # 나쁜 예
   git commit -m "Various updates"
   
   # 좋은 예
   git commit -m "fix: Resolve login button alignment"
   git commit -m "feat: Add password strength indicator"
   ```

2. **배포 전 로컬 테스트**
   ```powershell
   npm start
   # 모든 기능 테스트 후 push
   ```

3. **환경 변수 변경 시**
   ```
   Render Dashboard → Environment
   → 변경 후 Manual Deploy 클릭
   ```

4. **긴급 롤백**
   ```
   Render Dashboard → Deploys
   → 이전 버전 선택 → Redeploy
   ```

### 요약

**소스 수정 후 배포는 매우 간단합니다:**

```powershell
git add .
git commit -m "feat: Your changes"
git push
```

**그러면 Render가 자동으로:**
1. 변경사항 감지
2. 빌드 시작
3. 배포 완료
4. 5-10분 후 반영

**완전 자동화! 🎉**

---

## Personal Access Token 생성

### 방법 1: 직접 URL 접속 (가장 빠름) ⭐

```
https://github.com/settings/tokens
```

브라우저에서 위 URL을 직접 입력하면 바로 토큰 페이지로 이동합니다!

### 방법 2: GitHub Desktop 사용 (가장 쉬움) 🎯

**Personal Access Token 없이 인증:**

1. **GitHub Desktop 다운로드**
   ```
   https://desktop.github.com
   ```

2. **설치 및 실행**

3. **File → Options → Accounts → Sign in**

4. **브라우저에서 자동 인증**

5. **GUI로 간편하게 Push/Pull**

**장점:**
- 토큰 생성 불필요
- 클릭 몇 번으로 업로드
- 초보자 친화적
- 비주얼하게 변경사항 확인

### 방법 3: Git Credential Manager (자동 인증)

**Windows에서 Git 설치 시 자동 포함:**

```powershell
# Git push 시도
git push -u origin main

# 자동으로 브라우저 열림
# GitHub 로그인 → 인증 완료
# 이후 자동으로 저장됨
```

### Personal Access Token 생성 상세

**만약 토큰이 필요하다면:**

#### 1. 토큰 페이지 접속
```
https://github.com/settings/tokens
```

#### 2. Generate new token 클릭
- "Generate new token (classic)" 선택

#### 3. 토큰 설정
```
Note: Git Push Token for myLogin03
Expiration: 90 days (또는 No expiration)

Select scopes:
☑ repo (전체 선택)
```

#### 4. Generate token 클릭

#### 5. 토큰 복사
```
ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
⚠️ **중요:** 이 페이지를 벗어나면 다시 볼 수 없습니다!

#### 6. 토큰 사용
```powershell
git push -u origin main

Username: your-github-username
Password: ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 문제 해결

#### "Developer settings가 안 보여요"

**해결책:**
1. 직접 URL 접속: `https://github.com/settings/tokens`
2. 또는 GitHub Desktop 사용 (추천)

#### "매번 토큰 입력이 귀찮아요"

**해결책:**
```powershell
# Windows Credential Manager에 저장
git config --global credential.helper wincred

# 한 번만 입력하면 자동 저장됨
```

### 최종 추천: GitHub Desktop

**5분 만에 완료:**

1. https://desktop.github.com 다운로드
2. 설치 및 GitHub 로그인
3. File → Add Local Repository
4. `C:\myPrjt01\myLogin02` 선택
5. Publish repository 클릭
6. Repository name: `myLogin03`
7. Publish 클릭
8. 완료! 🎉

**토큰 생성 불필요, 클릭 몇 번으로 끝!**

---

## 문제 해결

### 문제 1: Git push 실패

**증상:**
```
fatal: Authentication failed
```

**해결:**
- GitHub Desktop 사용 (권장)
- 또는 Personal Access Token 사용

### 문제 2: 파일이 너무 많이 추가됨

**증상:**
```
node_modules 폴더가 추가됨
```

**해결:**
```powershell
# 캐시 제거
git rm -r --cached node_modules
git commit -m "Remove node_modules"
git push
```

### 문제 3: 배포 후 데이터베이스 연결 실패

**증상:**
```
Error: connect ECONNREFUSED
```

**해결:**
- 환경 변수 확인
- Internal Database URL 사용 확인
- SSL 설정 추가:
  ```javascript
  ssl: { rejectUnauthorized: false }
  ```

### 문제 4: 세션이 작동하지 않음

**증상:**
```
로그인 후 바로 로그아웃됨
```

**해결:**
```javascript
// server.js
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

---

## 체크리스트

### GitHub 업로드 전

- [ ] .gitignore 파일 확인
- [ ] 민감한 정보 제거 (비밀번호, API 키)
- [ ] README.md 작성
- [ ] package.json 업데이트

### 배포 전

- [ ] 환경 변수 설정
- [ ] 데이터베이스 연결 테스트
- [ ] 로컬에서 프로덕션 모드 테스트

### 배포 후

- [ ] 배포된 사이트 접속 테스트
- [ ] 회원가입 테스트
- [ ] 로그인 테스트
- [ ] 모든 기능 테스트
- [ ] 로그 확인

---

## 배포 소요 시간

- GitHub 업로드: **10분**
- Render 배포: **15분**
- 테스트: **5분**
- **총 30분**

---

**작성일:** 2026-05-02  
**작성자:** Bob (AI Assistant)  
**프로젝트:** myLogin03  
**버전:** 2.0