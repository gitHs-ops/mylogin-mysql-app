# 설치 및 실행 가이드

## 1단계: PostgreSQL 설치 및 설정

### PostgreSQL 설치
1. PostgreSQL 공식 웹사이트에서 다운로드: https://www.postgresql.org/download/windows/
2. 설치 프로그램 실행
3. 설치 중 비밀번호 설정 (이 비밀번호를 기억하세요!)
4. 포트는 기본값 5432 사용

### 데이터베이스 생성
1. pgAdmin 또는 psql을 실행
2. 다음 명령어로 데이터베이스 생성:
```sql
CREATE DATABASE logindb;
```

## 2단계: 프로젝트 설정

### db.js 파일 수정
`db.js` 파일을 열고 PostgreSQL 비밀번호를 수정하세요:

```javascript
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'logindb',
  password: '여기에_실제_비밀번호_입력', // ← 이 부분을 수정하세요!
  port: 5432,
});
```

## 3단계: 의존성 설치

PowerShell 또는 명령 프롬프트에서 프로젝트 폴더로 이동 후:

```bash
npm install
```

이 명령어는 다음 패키지들을 설치합니다:
- express (웹 서버)
- pg (PostgreSQL 연결)
- bcrypt (비밀번호 암호화)
- express-session (세션 관리)
- body-parser (요청 데이터 파싱)

## 4단계: 서버 실행

```bash
npm start
```

서버가 성공적으로 시작되면 다음 메시지가 표시됩니다:
```
Server is running on http://localhost:3000
Database initialized successfully
```

## 5단계: 웹 브라우저에서 접속

브라우저를 열고 다음 주소로 접속:
```
http://localhost:3000
```

## 사용 방법

### 회원가입
1. "회원가입" 링크 클릭
2. 아이디 입력 후 "중복확인" 버튼 클릭
3. 사용 가능한 아이디인지 확인
4. 비밀번호 입력 (최소 4자)
5. 비밀번호 확인 입력
6. 모든 조건이 충족되면 "회원가입" 버튼이 활성화됨
7. "회원가입" 버튼 클릭

### 로그인
1. 회원가입한 아이디와 비밀번호 입력
2. "로그인" 버튼 클릭
3. 성공 시 환영 페이지로 이동

## 문제 해결

### PostgreSQL 연결 오류
- PostgreSQL 서비스가 실행 중인지 확인
- db.js의 비밀번호가 올바른지 확인
- 데이터베이스 'logindb'가 생성되었는지 확인

### 포트 3000이 이미 사용 중
server.js 파일에서 포트 번호를 변경:
```javascript
const PORT = 3001; // 다른 포트 번호로 변경
```

### npm install 오류
- Node.js가 설치되어 있는지 확인
- 관리자 권한으로 실행 시도

## 테스트 계정 생성 예시

1. 아이디: testuser
2. 비밀번호: test1234
3. 회원가입 완료 후 로그인 테스트

## 주요 파일 설명

- `server.js` - Express 서버 및 API 엔드포인트
- `db.js` - PostgreSQL 데이터베이스 연결 설정
- `public/login.html` - 로그인 페이지
- `public/register.html` - 회원가입 페이지
- `public/success.html` - 로그인 성공 페이지
- `public/styles.css` - 모든 페이지의 스타일

## 보안 참고사항

이 프로젝트는 학습 목적의 간단한 예제입니다. 실제 운영 환경에서는:
- 환경 변수(.env)를 사용하여 데이터베이스 정보 관리
- HTTPS 사용
- 더 강력한 비밀번호 정책 적용
- CSRF 보호 추가
- Rate limiting 구현