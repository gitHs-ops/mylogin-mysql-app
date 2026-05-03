# Railway MySQL 배포 가이드

이 가이드는 프로젝트를 Railway에 MySQL 데이터베이스와 함께 배포하는 방법을 단계별로 설명합니다.

## 사전 준비사항

1. **Railway 계정**: https://railway.app 에서 무료 계정 생성
2. **GitHub 계정**: 코드를 GitHub에 푸시해야 합니다
3. **Git 설치**: 로컬에 Git이 설치되어 있어야 합니다

## 1단계: Git 저장소 초기화 및 GitHub에 푸시

### 1.1 Git 저장소 초기화

프로젝트 폴더에서 다음 명령어를 실행하세요:

```bash
git init
git add .
git commit -m "Initial commit for Railway deployment with MySQL"
```

### 1.2 GitHub 저장소 생성

1. https://github.com 에 로그인
2. 우측 상단의 "+" 버튼 클릭 → "New repository" 선택
3. 저장소 이름 입력 (예: `mylogin-mysql-app`)
4. Public 또는 Private 선택
5. "Create repository" 클릭

### 1.3 GitHub에 코드 푸시

GitHub에서 제공하는 명령어를 실행하세요:

```bash
git remote add origin https://github.com/your-username/your-repo-name.git
git branch -M main
git push -u origin main
```

## 2단계: Railway 프로젝트 생성

### 2.1 Railway 로그인

1. https://railway.app 접속
2. "Login" 클릭
3. GitHub 계정으로 로그인

### 2.2 새 프로젝트 생성

1. Dashboard에서 "New Project" 클릭
2. "Deploy from GitHub repo" 선택
3. GitHub 저장소 연결 (처음이라면 권한 승인 필요)
4. 배포할 저장소 선택

## 3단계: MySQL 데이터베이스 추가

### 3.1 데이터베이스 서비스 추가

1. 프로젝트 대시보드에서 "New" 클릭
2. "Database" → "Add MySQL" 선택
3. Railway가 자동으로 MySQL 인스턴스를 생성합니다

### 3.2 데이터베이스 연결 정보 확인

1. MySQL 서비스 클릭
2. "Variables" 탭에서 다음 정보 확인:
   - `MYSQLHOST`
   - `MYSQLPORT`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`
   - `MYSQLDATABASE`

## 4단계: 환경 변수 설정

### 4.1 애플리케이션 서비스 선택

프로젝트 대시보드에서 애플리케이션 서비스를 클릭합니다.

### 4.2 환경 변수 추가

"Variables" 탭에서 다음 환경 변수를 추가하세요:

#### 필수 환경 변수:

```
MYSQL_HOST=${{MySQL.MYSQLHOST}}
MYSQL_PORT=${{MySQL.MYSQLPORT}}
MYSQL_USER=${{MySQL.MYSQLUSER}}
MYSQL_PASSWORD=${{MySQL.MYSQLPASSWORD}}
MYSQL_DATABASE=${{MySQL.MYSQLDATABASE}}
NODE_ENV=production
ADMIN_PASSWORD=your_secure_admin_password_here
SESSION_SECRET=your_secure_session_secret_here
```

**중요**: 
- `${{MySQL.MYSQLHOST}}` 형식은 Railway의 변수 참조 문법입니다
- MySQL 서비스 이름이 다르면 `MySQL` 부분을 실제 서비스 이름으로 변경하세요
- `ADMIN_PASSWORD`와 `SESSION_SECRET`는 강력한 비밀번호로 변경하세요

#### 환경 변수 설정 예시:

| 변수 이름 | 값 |
|----------|---|
| MYSQL_HOST | `${{MySQL.MYSQLHOST}}` |
| MYSQL_PORT | `${{MySQL.MYSQLPORT}}` |
| MYSQL_USER | `${{MySQL.MYSQLUSER}}` |
| MYSQL_PASSWORD | `${{MySQL.MYSQLPASSWORD}}` |
| MYSQL_DATABASE | `${{MySQL.MYSQLDATABASE}}` |
| NODE_ENV | `production` |
| ADMIN_PASSWORD | `MySecureAdminPass123!` |
| SESSION_SECRET | `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6` |

### 4.3 변수 저장

각 변수를 추가한 후 "Add" 버튼을 클릭하여 저장합니다.

## 5단계: 배포 확인

### 5.1 자동 배포

환경 변수를 설정하면 Railway가 자동으로 애플리케이션을 재배포합니다.

### 5.2 배포 로그 확인

1. "Deployments" 탭 클릭
2. 최신 배포 선택
3. 로그에서 다음 메시지 확인:
   - "Database connected successfully"
   - "Database initialized successfully"
   - "Server is running on..."

### 5.3 도메인 확인

1. "Settings" 탭 클릭
2. "Domains" 섹션에서 Railway가 제공하는 URL 확인
3. "Generate Domain" 클릭 (도메인이 없는 경우)

## 6단계: 애플리케이션 테스트

### 6.1 웹사이트 접속

Railway가 제공한 URL로 접속합니다 (예: `https://your-app.up.railway.app`)

### 6.2 기능 테스트

1. **회원가입 테스트**
   - 회원가입 페이지에서 새 계정 생성
   - 아이디 중복 체크 기능 확인

2. **로그인 테스트**
   - 생성한 계정으로 로그인
   - 로그인 후 사용자 목록 페이지 확인

3. **관리자 로그인 테스트**
   - 아이디: `admin`
   - 비밀번호: 설정한 `ADMIN_PASSWORD`
   - 관리자 기능 (회원 추가/수정/삭제) 확인

## 7단계: 커스텀 도메인 설정 (선택사항)

### 7.1 도메인 추가

1. "Settings" → "Domains" 섹션
2. "Custom Domain" 클릭
3. 소유한 도메인 입력
4. DNS 설정 지침 따르기

## 문제 해결

### 데이터베이스 연결 오류

**증상**: "Database connection error" 또는 "ECONNREFUSED"

**해결방법**:
1. 환경 변수가 올바르게 설정되었는지 확인
2. MySQL 서비스가 실행 중인지 확인
3. 변수 참조 문법이 올바른지 확인 (`${{MySQL.MYSQLHOST}}`)
4. MySQL 서비스 이름이 정확한지 확인 (대소문자 구분)

### 애플리케이션이 시작되지 않음

**증상**: 배포는 성공했지만 애플리케이션이 응답하지 않음

**해결방법**:
1. 로그에서 오류 메시지 확인
2. `package.json`의 `start` 스크립트 확인
3. PORT 환경 변수가 올바르게 설정되었는지 확인
4. MySQL 연결이 성공했는지 로그 확인

### 세션이 유지되지 않음

**증상**: 로그인 후 페이지를 새로고침하면 로그아웃됨

**해결방법**:
1. `SESSION_SECRET` 환경 변수가 설정되었는지 확인
2. `NODE_ENV=production`이 설정되었는지 확인
3. 프로덕션 환경에서는 Redis 등의 세션 스토어 사용 고려

### MySQL 특정 오류

**증상**: "ER_ACCESS_DENIED_ERROR" 또는 "ER_BAD_DB_ERROR"

**해결방법**:
1. MySQL 사용자 이름과 비밀번호 확인
2. 데이터베이스 이름이 올바른지 확인
3. MySQL 서비스의 Variables 탭에서 연결 정보 재확인

## 유용한 Railway 명령어

### Railway CLI 설치 (선택사항)

```bash
npm install -g @railway/cli
```

### CLI로 로그 확인

```bash
railway login
railway link
railway logs
```

### CLI로 환경 변수 설정

```bash
railway variables set ADMIN_PASSWORD=your_password
railway variables set SESSION_SECRET=your_secret
```

### CLI로 MySQL 접속

```bash
railway connect MySQL
```

## 비용 관리

Railway는 무료 티어를 제공하지만 제한이 있습니다:

- **무료 티어**: 월 $5 크레딧 (약 500시간 실행 시간)
- **사용량 모니터링**: Dashboard에서 "Usage" 탭 확인
- **비용 절감 팁**: 
  - 사용하지 않는 서비스는 일시 중지
  - 개발 환경은 로컬에서 실행
  - MySQL 데이터베이스 크기 모니터링

## 업데이트 배포

코드를 수정한 후 배포하는 방법:

```bash
git add .
git commit -m "Update description"
git push origin main
```

Railway가 자동으로 새 버전을 감지하고 배포합니다.

## 데이터베이스 백업

### Railway 대시보드에서 백업

1. MySQL 서비스 클릭
2. "Data" 탭에서 데이터 확인
3. 정기적으로 데이터 내보내기 권장

### CLI로 백업

```bash
railway connect MySQL
mysqldump -u [username] -p [database_name] > backup.sql
```

## 추가 리소스

- Railway 공식 문서: https://docs.railway.app
- Railway Discord 커뮤니티: https://discord.gg/railway
- MySQL 문서: https://dev.mysql.com/doc/

## 보안 권장사항

1. **환경 변수**: 절대 코드에 하드코딩하지 마세요
2. **ADMIN_PASSWORD**: 강력한 비밀번호 사용 (최소 12자, 특수문자 포함)
3. **SESSION_SECRET**: 무작위 문자열 생성 (32자 이상 권장)
4. **HTTPS**: Railway는 자동으로 HTTPS를 제공합니다
5. **정기 업데이트**: 의존성 패키지를 정기적으로 업데이트하세요
6. **SQL Injection 방지**: 파라미터화된 쿼리 사용 (이미 적용됨)
7. **비밀번호 해싱**: bcrypt 사용 (이미 적용됨)

## 성공적인 배포 체크리스트

- [ ] Git 저장소 초기화 완료
- [ ] GitHub에 코드 푸시 완료
- [ ] Railway 프로젝트 생성 완료
- [ ] MySQL 데이터베이스 추가 완료
- [ ] 모든 환경 변수 설정 완료
- [ ] 배포 성공 및 로그 확인 완료
- [ ] 도메인 생성 완료
- [ ] 회원가입/로그인 테스트 완료
- [ ] 관리자 로그인 테스트 완료
- [ ] 데이터베이스 연결 확인 완료

## MySQL vs PostgreSQL 차이점

이 프로젝트는 MySQL을 사용하도록 변경되었습니다. 주요 차이점:

1. **패키지**: `pg` → `mysql2`
2. **파라미터 문법**: `$1, $2` → `?`
3. **에러 코드**: `23505` → `ER_DUP_ENTRY`
4. **결과 구조**: `result.rows` → `[rows]` (구조 분해)
5. **AUTO_INCREMENT**: `SERIAL` → `INT AUTO_INCREMENT`

---

배포에 성공하셨다면 축하합니다! 🎉

문제가 발생하면 Railway 로그를 확인하거나 커뮤니티에 도움을 요청하세요.