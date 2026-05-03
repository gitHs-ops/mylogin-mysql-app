# MySQL 데이터베이스 생성 방법

`CREATE DATABASE logindb;` 명령어를 실행하는 방법을 단계별로 설명합니다.

---

## 🎯 중요: 두 가지 선택지

### 선택 1: Railway에 바로 배포 (권장) ⭐
- **MySQL 설치 불필요**
- Railway가 자동으로 데이터베이스 생성
- 가장 간단한 방법
- 👉 `Railway_배포_단계별_가이드.md` 참조

### 선택 2: 로컬에서 테스트
- MySQL을 로컬에 설치해야 함
- 아래 방법 중 하나 선택

---

## 방법 1: MySQL Workbench 사용 (가장 쉬움)

### 1단계: MySQL 설치 확인

MySQL이 설치되어 있지 않다면:
1. https://dev.mysql.com/downloads/installer/ 접속
2. "MySQL Installer for Windows" 다운로드
3. 설치 시 root 비밀번호 설정 (예: `1234`)

### 2단계: MySQL Workbench 실행

1. **시작 메뉴**에서 "MySQL Workbench" 검색 및 실행
2. **"Local instance MySQL80"** (또는 유사한 이름) 더블클릭
3. **root 비밀번호** 입력

### 3단계: 데이터베이스 생성

1. 상단의 **SQL 편집기** 영역에 다음 입력:
   ```sql
   CREATE DATABASE logindb;
   ```

2. **번개 아이콘** (⚡) 클릭 또는 **Ctrl+Enter** 눌러 실행

3. 성공 메시지 확인:
   ```
   1 row(s) affected
   ```

4. 왼쪽 **SCHEMAS** 패널에서 새로고침 (🔄) 클릭
5. **logindb** 데이터베이스가 생성된 것을 확인

### 4단계: 애플리케이션 실행

터미널에서:
```bash
npm start
```

브라우저에서 http://localhost:3000 접속

---

## 방법 2: 명령 프롬프트 사용

### 1단계: MySQL 명령줄 접속

**방법 A: 시작 메뉴에서**
1. 시작 메뉴에서 "MySQL Command Line Client" 검색
2. 실행
3. root 비밀번호 입력

**방법 B: 일반 명령 프롬프트에서**
1. **Win + R** 눌러 실행 창 열기
2. `cmd` 입력 후 Enter
3. 다음 명령어 입력:
   ```bash
   mysql -u root -p
   ```
4. 비밀번호 입력 (예: `1234`)

### 2단계: 데이터베이스 생성

MySQL 프롬프트 (`mysql>`)에서:

```sql
CREATE DATABASE logindb;
```

Enter 누르면:
```
Query OK, 1 row affected (0.01 sec)
```

### 3단계: 확인

```sql
SHOW DATABASES;
```

결과에서 `logindb`가 보이면 성공!

### 4단계: 종료

```sql
EXIT;
```

### 5단계: 애플리케이션 실행

```bash
npm start
```

---

## 방법 3: XAMPP 사용 (가장 간단)

### 1단계: XAMPP 설치

1. https://www.apachefriends.org/ 접속
2. Windows용 XAMPP 다운로드 및 설치

### 2단계: MySQL 시작

1. **XAMPP Control Panel** 실행
2. **MySQL** 옆의 **"Start"** 버튼 클릭
3. 초록색으로 변하면 실행 중

### 3단계: phpMyAdmin 열기

1. XAMPP Control Panel에서 MySQL 옆의 **"Admin"** 버튼 클릭
2. 브라우저에서 phpMyAdmin이 열림

### 4단계: 데이터베이스 생성

1. 상단의 **"데이터베이스"** 또는 **"Databases"** 탭 클릭
2. **"데이터베이스 만들기"** 입력란에 `logindb` 입력
3. **"만들기"** 또는 **"Create"** 버튼 클릭
4. 왼쪽 목록에 `logindb`가 나타나면 성공!

### 5단계: .env 파일 수정

XAMPP는 기본적으로 비밀번호가 없으므로:

```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=logindb
```

### 6단계: 애플리케이션 실행

```bash
npm start
```

---

## 방법 4: PowerShell 사용

### 1단계: PowerShell 열기

1. **Win + X** 누르기
2. **"Windows PowerShell"** 선택

### 2단계: MySQL 접속

```powershell
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p
```

비밀번호 입력

### 3단계: 데이터베이스 생성

```sql
CREATE DATABASE logindb;
EXIT;
```

---

## 🔍 문제 해결

### 문제 1: "mysql: command not found" 또는 "mysql을 찾을 수 없습니다"

**원인:** MySQL이 설치되지 않았거나 PATH에 없음

**해결:**
- MySQL Workbench 사용 (방법 1)
- XAMPP 사용 (방법 3)
- 또는 Railway에 바로 배포 (권장)

### 문제 2: "Access denied for user 'root'"

**원인:** 비밀번호가 틀림

**해결:**
1. MySQL 설치 시 설정한 비밀번호 확인
2. `.env` 파일의 `MYSQL_PASSWORD` 수정

### 문제 3: "Can't connect to MySQL server"

**원인:** MySQL 서비스가 실행되지 않음

**해결:**
- **Windows Services**: `services.msc` 실행 → MySQL80 서비스 시작
- **XAMPP**: Control Panel에서 MySQL Start
- **명령줄**: `net start MySQL80` (관리자 권한 필요)

### 문제 4: MySQL이 설치되어 있는지 모르겠음

**확인 방법:**
1. 시작 메뉴에서 "MySQL" 검색
2. "MySQL Workbench" 또는 "MySQL Command Line Client"가 보이면 설치됨
3. 없으면 설치 필요

---

## 💡 추천 방법

### 초보자
1. **XAMPP 사용** (방법 3) - 가장 쉬움
2. 또는 **Railway 바로 배포** - MySQL 설치 불필요

### 경험자
1. **MySQL Workbench** (방법 1) - 시각적 관리
2. **명령줄** (방법 2) - 빠른 실행

### 시간이 없는 경우
**Railway 바로 배포** - 로컬 설정 건너뛰기

---

## ✅ 성공 확인

데이터베이스가 제대로 생성되었는지 확인:

```bash
npm start
```

터미널에서 다음 메시지가 보이면 성공:
```
Database connected successfully
Database initialized successfully
Server is running on http://localhost:3000
```

브라우저에서 http://localhost:3000 접속하여 테스트!

---

## 🚀 다음 단계

로컬 테스트가 완료되면:
👉 **`Railway_배포_단계별_가이드.md`**를 참조하여 Railway에 배포하세요!