# Railway MySQL 배포 가이드 (한국어)

## 📋 준비사항

1. Railway 계정 (https://railway.app)
2. GitHub 계정
3. Git 설치

---

## 🚀 배포 단계

### 1단계: 의존성 패키지 설치

먼저 프로젝트 폴더에서 MySQL 패키지를 설치합니다:

```bash
npm install
```

### 2단계: Git 저장소 초기화

```bash
git init
git add .
git commit -m "MySQL 버전으로 Railway 배포 준비"
```

### 3단계: GitHub에 푸시

1. GitHub에서 새 저장소 생성
2. 다음 명령어 실행:

```bash
git remote add origin https://github.com/사용자명/저장소명.git
git branch -M main
git push -u origin main
```

### 4단계: Railway 프로젝트 생성

1. https://railway.app 접속 및 로그인
2. "New Project" 클릭
3. "Deploy from GitHub repo" 선택
4. 방금 만든 저장소 선택

### 5단계: MySQL 데이터베이스 추가

1. 프로젝트 대시보드에서 "New" 클릭
2. "Database" → "Add MySQL" 선택
3. MySQL 서비스가 자동으로 생성됩니다

### 6단계: 환경 변수 설정

애플리케이션 서비스를 클릭하고 "Variables" 탭에서 다음 변수들을 추가:

```
MYSQL_HOST=${{MySQL.MYSQLHOST}}
MYSQL_PORT=${{MySQL.MYSQLPORT}}
MYSQL_USER=${{MySQL.MYSQLUSER}}
MYSQL_PASSWORD=${{MySQL.MYSQLPASSWORD}}
MYSQL_DATABASE=${{MySQL.MYSQLDATABASE}}
NODE_ENV=production
ADMIN_PASSWORD=강력한비밀번호123!
SESSION_SECRET=무작위문자열32자이상권장
```

**중요**: 
- `ADMIN_PASSWORD`는 관리자 로그인용 비밀번호입니다
- `SESSION_SECRET`는 세션 보안을 위한 비밀 키입니다
- 두 값 모두 강력한 비밀번호로 변경하세요!

### 7단계: 배포 확인

1. "Deployments" 탭에서 배포 로그 확인
2. "Database connected successfully" 메시지 확인
3. "Settings" → "Domains"에서 URL 확인

### 8단계: 테스트

1. Railway가 제공한 URL로 접속
2. 회원가입 테스트
3. 로그인 테스트
4. 관리자 로그인 테스트 (아이디: admin, 비밀번호: 설정한 ADMIN_PASSWORD)

---

## 🔧 문제 해결

### 데이터베이스 연결 오류

- 환경 변수가 올바르게 설정되었는지 확인
- MySQL 서비스가 실행 중인지 확인
- 변수 참조 문법 확인: `${{MySQL.MYSQLHOST}}`

### 애플리케이션이 시작되지 않음

- Deployments 탭에서 로그 확인
- 오류 메시지 확인 후 해결

---

## 📝 코드 업데이트 방법

코드를 수정한 후:

```bash
git add .
git commit -m "수정 내용"
git push origin main
```

Railway가 자동으로 재배포합니다.

---

## 💡 주요 변경사항

이 프로젝트는 PostgreSQL에서 MySQL로 변경되었습니다:

- ✅ `pg` → `mysql2` 패키지 사용
- ✅ SQL 쿼리 파라미터 문법 변경 (`$1` → `?`)
- ✅ 에러 코드 변경 (`23505` → `ER_DUP_ENTRY`)
- ✅ MySQL 연결 풀 사용

---

## 🎯 체크리스트

- [ ] npm install 실행
- [ ] Git 저장소 초기화
- [ ] GitHub에 푸시
- [ ] Railway 프로젝트 생성
- [ ] MySQL 데이터베이스 추가
- [ ] 환경 변수 설정
- [ ] 배포 성공 확인
- [ ] 웹사이트 접속 테스트
- [ ] 회원가입/로그인 테스트
- [ ] 관리자 기능 테스트

---

## 📞 도움이 필요하신가요?

- Railway 문서: https://docs.railway.app
- Railway Discord: https://discord.gg/railway

배포 성공을 기원합니다! 🎉