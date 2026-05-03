# 아이디 중복 체크 Race Condition 분석

## 현재 시스템의 문제점

### ❌ 배타 처리가 구현되어 있지 않습니다!

현재 코드에는 **Race Condition(경쟁 상태)** 취약점이 존재합니다.

## 문제 시나리오

```
시간 순서:
T1: 사용자 A가 "testuser" 중복 체크 → 사용 가능 ✓
T2: 사용자 B가 "testuser" 중복 체크 → 사용 가능 ✓
T3: 사용자 A가 "testuser"로 회원가입 → 성공 ✓
T4: 사용자 B가 "testuser"로 회원가입 → 성공? (문제!)
```

### 현재 코드의 문제

```javascript
// 1. 중복 체크 (배타 처리 없음)
app.post('/api/check-username', async (req, res) => {
  const result = await pool.query(
    'SELECT username FROM users WHERE username = $1',
    [username]
  );
  // 여기서 "사용 가능"이라고 응답하지만...
});

// 2. 회원가입 (중복 체크와 INSERT 사이에 시간 간격)
app.post('/api/register', async (req, res) => {
  // 다시 중복 체크 (하지만 여전히 Race Condition 가능)
  const checkUser = await pool.query(
    'SELECT username FROM users WHERE username = $1',
    [username]
  );
  
  if (checkUser.rows.length > 0) {
    return res.status(400).json({ message: '이미 존재하는 아이디입니다.' });
  }
  
  // INSERT 전에 다른 요청이 끼어들 수 있음!
  await pool.query(
    'INSERT INTO users (username, password) VALUES ($1, $2)',
    [username, hashedPassword]
  );
});
```

## 해결 방법

### 방법 1: 데이터베이스 UNIQUE 제약조건 활용 (현재 적용됨)

**장점:**
- 데이터베이스 레벨에서 보장
- 가장 안전한 방법
- 추가 코드 최소화

**현재 상태:**
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,  -- ✓ UNIQUE 제약조건 있음
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

**개선된 에러 처리:**

```javascript
// 회원가입 API 개선
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 직접 INSERT 시도 (UNIQUE 제약조건이 중복 방지)
    await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2)',
      [username, hashedPassword]
    );
    
    res.json({ success: true, message: '회원가입이 완료되었습니다.' });
  } catch (err) {
    // PostgreSQL 중복 키 에러 코드: 23505
    if (err.code === '23505') {
      return res.status(400).json({ 
        success: false, 
        message: '이미 존재하는 아이디입니다.' 
      });
    }
    
    console.error(err);
    res.status(500).json({ 
      success: false, 
      message: '서버 오류가 발생했습니다.' 
    });
  }
});
```

### 방법 2: 트랜잭션과 SELECT FOR UPDATE 사용

**완벽한 배타 처리:**

```javascript
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // SELECT FOR UPDATE로 행 잠금
    const checkUser = await client.query(
      'SELECT username FROM users WHERE username = $1 FOR UPDATE',
      [username]
    );
    
    if (checkUser.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ 
        success: false, 
        message: '이미 존재하는 아이디입니다.' 
      });
    }
    
    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 사용자 등록
    await client.query(
      'INSERT INTO users (username, password) VALUES ($1, $2)',
      [username, hashedPassword]
    );
    
    await client.query('COMMIT');
    res.json({ success: true, message: '회원가입이 완료되었습니다.' });
    
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ 
      success: false, 
      message: '서버 오류가 발생했습니다.' 
    });
  } finally {
    client.release();
  }
});
```

### 방법 3: Redis를 이용한 분산 락

**대규모 시스템용:**

```javascript
const Redis = require('ioredis');
const redis = new Redis();

app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  const lockKey = `lock:username:${username}`;
  const lockValue = Date.now().toString();
  
  try {
    // 락 획득 시도 (5초 타임아웃)
    const acquired = await redis.set(
      lockKey, 
      lockValue, 
      'EX', 5, 
      'NX'
    );
    
    if (!acquired) {
      return res.status(429).json({ 
        success: false, 
        message: '잠시 후 다시 시도해주세요.' 
      });
    }
    
    // 중복 체크
    const checkUser = await pool.query(
      'SELECT username FROM users WHERE username = $1',
      [username]
    );
    
    if (checkUser.rows.length > 0) {
      await redis.del(lockKey);
      return res.status(400).json({ 
        success: false, 
        message: '이미 존재하는 아이디입니다.' 
      });
    }
    
    // 비밀번호 해시화 및 등록
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2)',
      [username, hashedPassword]
    );
    
    await redis.del(lockKey);
    res.json({ success: true, message: '회원가입이 완료되었습니다.' });
    
  } catch (err) {
    await redis.del(lockKey);
    console.error(err);
    res.status(500).json({ 
      success: false, 
      message: '서버 오류가 발생했습니다.' 
    });
  }
});
```

## 권장 해결 방안

### 단계별 개선 전략

#### 1단계: 즉시 적용 (현재 시스템)
✅ **UNIQUE 제약조건 + 에러 처리 개선**
- 이미 UNIQUE 제약조건이 있으므로 기본 보호는 됨
- 에러 처리만 개선하면 충분

#### 2단계: 중간 규모 (동시 사용자 100명 이상)
⭐ **트랜잭션 + SELECT FOR UPDATE**
- 완벽한 배타 처리
- 추가 인프라 불필요
- 성능 영향 최소

#### 3단계: 대규모 (동시 사용자 1000명 이상)
🚀 **Redis 분산 락**
- 여러 서버 환경에서도 동작
- 확장성 우수
- 추가 인프라 필요 (Redis)

## 테스트 방법

### Race Condition 재현 테스트

```javascript
// test-race-condition.js
const axios = require('axios');

async function testRaceCondition() {
  const username = 'testuser_' + Date.now();
  const password = 'test1234';
  
  // 동시에 10개의 회원가입 요청
  const promises = Array(10).fill(null).map(() => 
    axios.post('http://localhost:3000/api/register', {
      username,
      password
    }).catch(err => err.response)
  );
  
  const results = await Promise.all(promises);
  
  const successes = results.filter(r => r.data?.success === true);
  console.log(`성공한 요청: ${successes.length}개`);
  console.log(`실패한 요청: ${results.length - successes.length}개`);
  
  if (successes.length > 1) {
    console.error('❌ Race Condition 발생! 중복 가입됨');
  } else {
    console.log('✅ 정상 동작');
  }
}

testRaceCondition();
```

## 결론

### 현재 시스템 상태
- ❌ **명시적인 배타 처리 없음**
- ✅ **UNIQUE 제약조건으로 최종 방어**
- ⚠️ **Race Condition 가능성 있음**

### 즉시 개선 필요
1. 에러 처리 개선 (PostgreSQL 에러 코드 23505 처리)
2. 불필요한 중복 체크 제거
3. 트랜잭션 적용 고려

### 프로덕션 환경 권장
- **소규모:** UNIQUE 제약조건 + 에러 처리
- **중규모:** 트랜잭션 + SELECT FOR UPDATE
- **대규모:** Redis 분산 락

---

**작성일:** 2026-05-02  
**작성자:** Bob (AI Assistant)