# 로컬 MySQL 설정 가이드

## 옵션 1: Railway에 바로 배포 (권장)

로컬에 MySQL을 설치하지 않고 바로 Railway에 배포할 수 있습니다.

**장점:**
- 로컬 MySQL 설치 불필요
- Railway가 자동으로 MySQL 설정
- 바로 프로덕션 환경 테스트 가능

**방법:**
`Railway_배포_단계별_가이드.md` 파일을 따라 진행하세요.

---

## 옵션 2: 로컬에서 테스트 후 배포

로컬에서 먼저 테스트하고 싶다면 MySQL을 설치해야 합니다.

### Windows에서 MySQL 설치

#### 방법 1: MySQL Installer 사용 (권장)

1. **MySQL 다운로드**
   - https://dev.mysql.com/downloads/installer/ 접속
   - "MySQL Installer for Windows" 다운로드
   - `mysql-installer-community-8.x.x.msi` 실행

2. **설치 옵션 선택**
   - "Developer Default" 선택
   - "Next" 클릭

3. **MySQL Server 설정**
   - Port: `3306` (기본값)
   - Root Password: `1234` (또는 원하는 비밀번호)
   - 비밀번호를 기억하세요!

4. **설치 완료**
   - "Execute" 클릭하여 설치
   - "Finish" 클릭

#### 방법 2: XAMPP 사용 (간단)

1. **XAMPP 다운로드**
   - https://www.apachefriends.org/ 접속
   - Windows용 XAMPP 다운로드 및 설치

2. **MySQL 시작**
   - XAMPP Control Panel 실행
   - "MySQL" 옆의 "Start" 버튼 클릭

3. **기본 설정**
   - Port: `3306`
   - User: `root`
   - Password: (없음 또는 설정)

### 데이터베이스 생성

#### MySQL Workbench 사용

1. MySQL Workbench 실행
2. Local instance 연결
3. 다음 SQL 실행:

```sql
CREATE DATABASE logindb;
```

#### 명령줄 사용

```bash
mysql -u root -p
```

비밀번호 입력 후:

```sql
CREATE DATABASE logindb;
EXIT;
```

### .env 파일 수정

로컬 MySQL 설정에 맞게 `.env` 파일을 수정하세요:

```env
# MySQL이 설치된 경우
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=1234  # 설정한 비밀번호
MYSQL_DATABASE=logindb

# 나머지는 그대로
ADMIN_PASSWORD=admin123
SESSION_SECRET=your-secret-key-here-change-in-production
NODE_ENV=development
```

### 로컬에서 실행

```bash
npm start
```

브라우저에서 http://localhost:3000 접속

---

## 옵션 3: Docker로 MySQL 실행 (개발자용)

Docker가 설치되어 있다면:

```bash
docker run --name mysql-login -e MYSQL_ROOT_PASSWORD=1234 -e MYSQL_DATABASE=logindb -p 3306:3306 -d mysql:8
```

`.env` 파일은 위와 동일하게 설정하세요.

---

## 문제 해결

### 에러: ENOTFOUND localhost

**원인:** MySQL이 설치되지 않았거나 실행되지 않음

**해결:**
1. MySQL이 설치되었는지 확인
2. MySQL 서비스가 실행 중인지 확인
3. 또는 Railway에 바로 배포 (옵션 1)

### 에러: Access denied for user 'root'

**원인:** 비밀번호가 틀림

**해결:**
1. `.env` 파일의 `MYSQL_PASSWORD` 확인
2. MySQL 설치 시 설정한 비밀번호와 일치하는지 확인

### 에러: Can't connect to MySQL server

**원인:** MySQL 서비스가 실행되지 않음

**해결:**
- **Windows Services**: `services.msc` 실행 → MySQL 서비스 시작
- **XAMPP**: Control Panel에서 MySQL Start
- **명령줄**: `net start MySQL80` (관리자 권한)

---

## 권장 사항

**처음 사용하시는 경우:**
- 로컬 MySQL 설치 없이 바로 Railway에 배포하는 것을 권장합니다
- Railway가 모든 MySQL 설정을 자동으로 처리합니다
- 설치와 설정이 훨씬 간단합니다

**개발 경험이 있는 경우:**
- 로컬에 MySQL을 설치하여 개발 환경 구축
- 로컬에서 테스트 후 Railway에 배포

---

## 다음 단계

로컬 테스트를 건너뛰고 바로 배포하려면:
👉 `Railway_배포_단계별_가이드.md` 파일을 열어서 진행하세요!