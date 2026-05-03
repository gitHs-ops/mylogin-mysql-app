# Railway 환경 변수 설정 방법

## SESSION_SECRET가 안 보이는 이유

`SESSION_SECRET`는 **자동으로 생성되지 않습니다**. 사용자가 직접 추가해야 합니다.

---

## 단계별 설정 방법

### 1단계: Railway 대시보드 접속
1. https://railway.app 접속
2. 로그인
3. `myLogin4bob2railway` 프로젝트 클릭

### 2단계: 애플리케이션 서비스 선택
- 프로젝트 화면에서 **애플리케이션 서비스** 클릭 (PostgreSQL이 아님!)
- 보통 저장소 이름으로 표시됨 (예: `myLogin4bob2railway`)

### 3단계: Variables 탭 열기
- 상단 메뉴에서 **"Variables"** 탭 클릭

### 4단계: 환경 변수 추가
**"New Variable" 또는 "Add Variable" 버튼 클릭**

다음 변수들을 **하나씩** 추가하세요:

#### 필수 변수 목록:

**1. 데이터베이스 연결 변수 (PostgreSQL 참조)**
```
변수명: DB_USER
값: ${{Postgres.PGUSER}}
```

```
변수명: DB_HOST
값: ${{Postgres.PGHOST}}
```

```
변수명: DB_NAME
값: ${{Postgres.PGDATABASE}}
```

```
변수명: DB_PASSWORD
값: ${{Postgres.PGPASSWORD}}
```

```
변수명: DB_PORT
값: ${{Postgres.PGPORT}}
```

**2. 애플리케이션 설정 변수**
```
변수명: NODE_ENV
값: production
```

```
변수명: SESSION_SECRET
값: my-super-secret-session-key-change-this-to-random-string-32-chars
```
⚠️ **중요**: 위 값을 무작위 문자열로 변경하세요!

```
변수명: ADMIN_PASSWORD
값: admin1234
```
⚠️ **중요**: 강력한 비밀번호로 변경하세요!

### 5단계: 변수 저장
- 각 변수를 추가한 후 **"Add"** 또는 **"Save"** 클릭
- 모든 변수를 추가하면 Railway가 자동으로 재배포합니다

---

## 변수 참조 문법 설명

### `${{Postgres.PGUSER}}` 형식이란?

이것은 **Railway의 변수 참조 문법**입니다.

- `Postgres` = PostgreSQL 서비스 이름
- `PGUSER` = PostgreSQL의 사용자명 변수
- `${{...}}` = Railway가 자동으로 값을 채워줌

**예시:**
```
DB_USER=${{Postgres.PGUSER}}
```
↓ Railway가 자동으로 변환
```
DB_USER=postgres_actual_username
```

---

## SESSION_SECRET 생성 방법

### 방법 1: 온라인 생성기 사용
https://randomkeygen.com/ 접속 → "Fort Knox Passwords" 복사

### 방법 2: PowerShell에서 생성
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

### 방법 3: 간단한 예시 (개발용)
```
my-secret-key-for-railway-deployment-2024
```

⚠️ **프로덕션에서는 반드시 무작위 문자열 사용!**

---

## 설정 확인 방법

### 1. Variables 탭에서 확인
모든 변수가 표시되어야 합니다:
- ✅ DB_USER
- ✅ DB_HOST
- ✅ DB_NAME
- ✅ DB_PASSWORD
- ✅ DB_PORT
- ✅ NODE_ENV
- ✅ SESSION_SECRET ← **이것이 있어야 함!**
- ✅ ADMIN_PASSWORD

### 2. 배포 로그 확인
1. "Deployments" 탭 클릭
2. 최신 배포 선택
3. 로그에서 확인:
   - "Database connected successfully" ✅
   - "Server is running on..." ✅

### 3. 애플리케이션 테스트
생성된 URL로 접속하여:
1. 회원가입 테스트
2. 로그인 테스트
3. 페이지 새로고침 후 로그인 유지 확인

---

## 자주 발생하는 오류

### 오류 1: "Application failed to respond"
**원인**: 환경 변수 누락
**해결**: 모든 변수가 설정되었는지 확인

### 오류 2: "Database connection error"
**원인**: PostgreSQL 변수 참조 오류
**해결**: `${{Postgres.PGUSER}}` 형식 확인 (중괄호 2개!)

### 오류 3: 로그인 후 새로고침하면 로그아웃됨
**원인**: SESSION_SECRET 미설정
**해결**: SESSION_SECRET 환경 변수 추가

---

## 빠른 설정 체크리스트

Railway 대시보드에서:
- [ ] 프로젝트 선택
- [ ] 애플리케이션 서비스 클릭 (PostgreSQL 아님!)
- [ ] "Variables" 탭 클릭
- [ ] "New Variable" 클릭
- [ ] DB_USER 추가: `${{Postgres.PGUSER}}`
- [ ] DB_HOST 추가: `${{Postgres.PGHOST}}`
- [ ] DB_NAME 추가: `${{Postgres.PGDATABASE}}`
- [ ] DB_PASSWORD 추가: `${{Postgres.PGPASSWORD}}`
- [ ] DB_PORT 추가: `${{Postgres.PGPORT}}`
- [ ] NODE_ENV 추가: `production`
- [ ] SESSION_SECRET 추가: `무작위문자열32자이상`
- [ ] ADMIN_PASSWORD 추가: `강력한비밀번호`
- [ ] 저장 후 재배포 대기 (1-2분)
- [ ] 생성된 URL로 접속 테스트

---

## 추가 도움말

Railway 공식 문서:
- 환경 변수: https://docs.railway.app/develop/variables
- 변수 참조: https://docs.railway.app/develop/variables#reference-variables

문제가 계속되면:
1. Railway Discord: https://discord.gg/railway
2. Help Station: https://help.railway.app