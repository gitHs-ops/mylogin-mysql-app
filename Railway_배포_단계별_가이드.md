# 🚀 Railway MySQL 배포 - 단계별 실행 가이드

## ✅ 완료된 작업

다음 작업들이 이미 완료되었습니다:

1. ✅ PostgreSQL → MySQL 코드 변경 완료
2. ✅ package.json 업데이트 (mysql2 패키지)
3. ✅ db.js MySQL 연결 설정
4. ✅ server.js SQL 쿼리 MySQL 문법으로 변경
5. ✅ npm install 실행 완료
6. ✅ Git 저장소 초기화 및 첫 커밋 완료

---

## 📝 다음 단계 (사용자가 직접 실행)

### 1단계: GitHub 저장소 생성 및 푸시

#### 1-1. GitHub에서 새 저장소 생성

1. https://github.com 접속 및 로그인
2. 우측 상단 "+" 버튼 → "New repository" 클릭
3. 저장소 정보 입력:
   - Repository name: `mylogin-mysql-app` (원하는 이름)
   - Public 또는 Private 선택
   - **중요**: "Add a README file" 체크 해제
4. "Create repository" 클릭

#### 1-2. 로컬 저장소를 GitHub에 연결

GitHub에서 제공하는 명령어를 복사하여 실행하세요:

```bash
git remote add origin https://github.com/사용자명/저장소명.git
git branch -M main
git push -u origin main
```

**예시:**
```bash
git remote add origin https://github.com/johndoe/mylogin-mysql-app.git
git branch -M main
git push -u origin main
```

---

### 2단계: Railway 프로젝트 생성

#### 2-1. Railway 로그인

1. https://railway.app 접속
2. "Login" 또는 "Start a New Project" 클릭
3. GitHub 계정으로 로그인

#### 2-2. 새 프로젝트 생성

1. Dashboard에서 **"New Project"** 클릭
2. **"Deploy from GitHub repo"** 선택
3. GitHub 저장소 연결 승인 (처음이라면)
4. 방금 만든 저장소 선택 (예: `mylogin-mysql-app`)
5. Railway가 자동으로 배포 시작

---

### 3단계: MySQL 데이터베이스 추가

#### 3-1. MySQL 서비스 추가

1. 프로젝트 대시보드에서 **"New"** 버튼 클릭
2. **"Database"** 선택
3. **"Add MySQL"** 클릭
4. MySQL 서비스가 자동으로 생성됨

#### 3-2. MySQL 서비스 이름 확인

1. 생성된 MySQL 서비스 클릭
2. 상단의 서비스 이름 확인 (보통 "MySQL"이지만 다를 수 있음)
3. 이 이름을 다음 단계에서 사용합니다

---

### 4단계: 환경 변수 설정

#### 4-1. 애플리케이션 서비스 선택

1. 프로젝트 대시보드로 돌아가기
2. 애플리케이션 서비스 클릭 (저장소 이름으로 표시됨)
3. **"Variables"** 탭 클릭

#### 4-2. 환경 변수 추가

**"New Variable"** 버튼을 클릭하여 다음 변수들을 하나씩 추가:

| 변수 이름 | 값 | 설명 |
|----------|---|------|
| `MYSQL_HOST` | `${{MySQL.MYSQLHOST}}` | MySQL 호스트 주소 |
| `MYSQL_PORT` | `${{MySQL.MYSQLPORT}}` | MySQL 포트 |
| `MYSQL_USER` | `${{MySQL.MYSQLUSER}}` | MySQL 사용자명 |
| `MYSQL_PASSWORD` | `${{MySQL.MYSQLPASSWORD}}` | MySQL 비밀번호 |
| `MYSQL_DATABASE` | `${{MySQL.MYSQLDATABASE}}` | MySQL 데이터베이스명 |
| `NODE_ENV` | `production` | 프로덕션 환경 |
| `ADMIN_PASSWORD` | `YourSecurePass123!` | 관리자 비밀번호 (변경 필수!) |
| `SESSION_SECRET` | `random32charactersormore12345` | 세션 비밀키 (변경 필수!) |

**중요 사항:**
- `${{MySQL.MYSQLHOST}}` 형식의 값은 그대로 입력하세요 (Railway가 자동으로 치환)
- MySQL 서비스 이름이 "MySQL"이 아니면 해당 이름으로 변경하세요
- `ADMIN_PASSWORD`는 강력한 비밀번호로 변경하세요
- `SESSION_SECRET`는 32자 이상의 무작위 문자열로 변경하세요

#### 4-3. 변수 저장 및 재배포

1. 모든 변수 추가 후 자동으로 저장됨
2. Railway가 자동으로 애플리케이션을 재배포합니다

---

### 5단계: 배포 확인

#### 5-1. 배포 로그 확인

1. **"Deployments"** 탭 클릭
2. 최신 배포 선택
3. 로그에서 다음 메시지 확인:
   ```
   Database connected successfully
   Database initialized successfully
   Server is running on http://localhost:XXXX
   ```

#### 5-2. 도메인 확인

1. **"Settings"** 탭 클릭
2. **"Domains"** 섹션 찾기
3. **"Generate Domain"** 클릭 (도메인이 없는 경우)
4. 생성된 URL 복사 (예: `https://myapp-production.up.railway.app`)

---

### 6단계: 애플리케이션 테스트

#### 6-1. 웹사이트 접속

Railway가 제공한 URL로 접속합니다.

#### 6-2. 기능 테스트

**테스트 1: 회원가입**
1. 회원가입 페이지로 이동
2. 아이디와 비밀번호 입력
3. 회원가입 성공 확인

**테스트 2: 로그인**
1. 로그인 페이지로 이동
2. 생성한 계정으로 로그인
3. 사용자 목록 페이지 확인

**테스트 3: 관리자 로그인**
1. 로그아웃
2. 아이디: `admin`
3. 비밀번호: 설정한 `ADMIN_PASSWORD`
4. 관리자 기능 확인 (회원 추가/수정/삭제)

---

## 🎯 체크리스트

배포 완료 확인:

- [ ] GitHub 저장소 생성 및 코드 푸시 완료
- [ ] Railway 프로젝트 생성 완료
- [ ] MySQL 데이터베이스 추가 완료
- [ ] 8개 환경 변수 모두 설정 완료
- [ ] 배포 로그에서 "Database connected successfully" 확인
- [ ] Railway 도메인 생성 완료
- [ ] 웹사이트 접속 성공
- [ ] 회원가입 테스트 성공
- [ ] 로그인 테스트 성공
- [ ] 관리자 로그인 테스트 성공

---

## 🔧 문제 해결

### 문제 1: 데이터베이스 연결 오류

**증상:**
```
Error: connect ECONNREFUSED
Database connection error
```

**해결방법:**
1. Variables 탭에서 모든 MYSQL_* 변수가 설정되었는지 확인
2. 변수 값이 `${{MySQL.MYSQLHOST}}` 형식인지 확인
3. MySQL 서비스 이름이 정확한지 확인
4. MySQL 서비스가 실행 중인지 확인

### 문제 2: 환경 변수 참조 오류

**증상:**
```
MYSQLHOST is undefined
```

**해결방법:**
1. MySQL 서비스의 실제 이름 확인
2. 변수 참조 시 정확한 서비스 이름 사용
3. 예: 서비스 이름이 "MySQL-prod"라면 `${{MySQL-prod.MYSQLHOST}}`

### 문제 3: 관리자 로그인 실패

**증상:** 관리자 로그인이 안 됨

**해결방법:**
1. `ADMIN_PASSWORD` 환경 변수가 설정되었는지 확인
2. 입력한 비밀번호가 정확한지 확인
3. 대소문자 구분 확인

---

## 📱 코드 업데이트 방법

코드를 수정한 후 배포하는 방법:

```bash
# 1. 변경사항 확인
git status

# 2. 변경된 파일 추가
git add .

# 3. 커밋
git commit -m "수정 내용 설명"

# 4. GitHub에 푸시
git push origin main
```

Railway가 자동으로 새 버전을 감지하고 재배포합니다.

---

## 💰 비용 관리

- **무료 티어**: 월 $5 크레딧 (약 500시간)
- **사용량 확인**: Dashboard → "Usage" 탭
- **절약 팁**: 
  - 개발은 로컬에서 진행
  - 사용하지 않는 서비스는 일시 중지

---

## 📚 추가 자료

- 상세 가이드: `RAILWAY_DEPLOYMENT_GUIDE.md` 참조
- 한국어 간단 가이드: `RAILWAY_MYSQL_배포가이드.md` 참조
- Railway 공식 문서: https://docs.railway.app

---

## 🎉 배포 성공!

모든 단계를 완료하셨다면 축하합니다!

이제 다음을 할 수 있습니다:
- ✅ 인터넷에서 접속 가능한 웹 애플리케이션
- ✅ MySQL 데이터베이스로 사용자 관리
- ✅ 관리자 기능으로 회원 관리
- ✅ 자동 배포 (코드 푸시 시)

문제가 있으면 Railway 로그를 확인하거나 문서를 참조하세요!