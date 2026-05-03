const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const path = require('path');
const { pool, initDB } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Railway 프록시 신뢰 설정
app.set('trust proxy', 1);

// 미들웨어 설정
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 3600000, // 1시간
    secure: process.env.NODE_ENV === 'production', // HTTPS에서만 쿠키 전송
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
}));

// 데이터베이스 초기화
initDB();

// 아이디 중복 체크 API
app.post('/api/check-username', async (req, res) => {
  const { username } = req.body;
  
  try {
    const [rows] = await pool.query(
      'SELECT username FROM users WHERE username = ?',
      [username]
    );
    
    if (rows.length > 0) {
      res.json({ available: false, message: '이미 사용 중인 아이디입니다.' });
    } else {
      res.json({ available: true, message: '사용 가능한 아이디입니다.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 회원가입 API (개선: UNIQUE 제약조건 활용 + 에러 처리 + admin 차단)
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    // 입력 검증
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: '아이디와 비밀번호를 입력해주세요.'
      });
    }
    
    // admin 아이디 차단
    if (username.toLowerCase() === 'admin') {
      return res.status(400).json({
        success: false,
        message: '예약된 아이디입니다. 다른 아이디를 사용해주세요.'
      });
    }
    
    if (username.length < 3 || username.length > 50) {
      return res.status(400).json({
        success: false,
        message: '아이디는 3자 이상 50자 이하로 입력해주세요.'
      });
    }
    
    if (password.length < 4) {
      return res.status(400).json({
        success: false,
        message: '비밀번호는 4자 이상 입력해주세요.'
      });
    }
    
    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 사용자 등록 (UNIQUE 제약조건이 중복 방지)
    await pool.query(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashedPassword]
    );
    
    res.json({ success: true, message: '회원가입이 완료되었습니다.' });
  } catch (err) {
    console.error('Register error:', err);
    
    // MySQL UNIQUE 제약조건 위반 에러 (에러 코드: ER_DUP_ENTRY)
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: '이미 존재하는 아이디입니다. 다른 아이디를 사용해주세요.'
      });
    }
    
    // 기타 데이터베이스 에러
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
    });
  }
});

// 로그인 API (admin 특별 처리 추가)
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    // admin 로그인 특별 처리
    if (username === 'admin') {
      const adminPassword = process.env.ADMIN_PASSWORD || 'admin1234'; // 기본값은 로컬 개발용
      
      if (password === adminPassword) {
        // admin 세션 생성
        req.session.user = {
          id: 0,
          username: 'admin',
          isAdmin: true
        };
        return res.json({ success: true, message: '관리자 로그인 성공!' });
      } else {
        return res.status(401).json({ success: false, message: '아이디 또는 비밀번호가 올바르지 않습니다.' });
      }
    }
    
    // 일반 사용자 로그인
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: '아이디 또는 비밀번호가 올바르지 않습니다.' });
    }
    
    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: '아이디 또는 비밀번호가 올바르지 않습니다.' });
    }
    
    // 세션에 사용자 정보 저장
    req.session.user = {
      id: user.id,
      username: user.username,
      isAdmin: false
    };
    
    res.json({ success: true, message: '로그인 성공!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
});

// 로그아웃 API
app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true, message: '로그아웃되었습니다.' });
});

app.get('/api/user', (req, res) => {
  if (req.session.user) {
    res.json({ 
      success: true, 
      user: {
        id: req.session.user.id,
        username: req.session.user.username,
        isAdmin: req.session.user.isAdmin || false
      }
    });
  } else {
    res.status(401).json({ success: false, message: '로그인이 필요합니다.' });
  }
});

// 현재 사용자 정보 API

// 회원 추가 API (관리자 전용)
app.post('/api/users', async (req, res) => {
  // 관리자 권한 체크
  if (!req.session.user || !req.session.user.isAdmin) {
    return res.status(403).json({ success: false, message: '관리자 권한이 필요합니다.' });
  }
  
  const { username, password } = req.body;
  
  try {
    // 입력 검증
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: '아이디와 비밀번호를 입력해주세요.'
      });
    }
    
    if (username.length < 3 || username.length > 50) {
      return res.status(400).json({
        success: false,
        message: '아이디는 3자 이상 50자 이하로 입력해주세요.'
      });
    }
    
    if (password.length < 4) {
      return res.status(400).json({
        success: false,
        message: '비밀번호는 4자 이상 입력해주세요.'
      });
    }
    
    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 사용자 등록
    await pool.query(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashedPassword]
    );
    
    res.json({ success: true, message: '회원이 추가되었습니다.' });
  } catch (err) {
    console.error('Add user error:', err);
    
    // MySQL UNIQUE 제약조건 위반 에러
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: '이미 존재하는 아이디입니다.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다.'
    });
  }
});

// 회원 수정 API (관리자 전용)
app.put('/api/users/:id', async (req, res) => {
  // 관리자 권한 체크
  if (!req.session.user || !req.session.user.isAdmin) {
    return res.status(403).json({ success: false, message: '관리자 권한이 필요합니다.' });
  }
  
  const { id } = req.params;
  const { username, password } = req.body;
  
  try {
    // 입력 검증
    if (!username) {
      return res.status(400).json({
        success: false,
        message: '아이디를 입력해주세요.'
      });
    }
    
    if (username.length < 3 || username.length > 50) {
      return res.status(400).json({
        success: false,
        message: '아이디는 3자 이상 50자 이하로 입력해주세요.'
      });
    }
    
    // 비밀번호가 제공된 경우에만 업데이트
    if (password) {
      if (password.length < 4) {
        return res.status(400).json({
          success: false,
          message: '비밀번호는 4자 이상 입력해주세요.'
        });
      }
      
      const hashedPassword = await bcrypt.hash(password, 10);
      await pool.query(
        'UPDATE users SET username = ?, password = ? WHERE id = ?',
        [username, hashedPassword, id]
      );
    } else {
      // 비밀번호 없이 아이디만 업데이트
      await pool.query(
        'UPDATE users SET username = ? WHERE id = ?',
        [username, id]
      );
    }
    
    res.json({ success: true, message: '회원 정보가 수정되었습니다.' });
  } catch (err) {
    console.error('Update user error:', err);
    
    // MySQL UNIQUE 제약조건 위반 에러
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: '이미 존재하는 아이디입니다.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다.'
    });
  }
});

// 회원 삭제 API (관리자 전용)
app.delete('/api/users/:id', async (req, res) => {
  // 관리자 권한 체크
  if (!req.session.user || !req.session.user.isAdmin) {
    return res.status(403).json({ success: false, message: '관리자 권한이 필요합니다.' });
  }
  
  const { id } = req.params;
  
  try {
    
    const [result] = await pool.query(
      'DELETE FROM users WHERE id = ?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: '해당 회원을 찾을 수 없습니다.'
      });
    }
    
    res.json({ success: true, message: '회원이 삭제되었습니다.' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다.'
    });
  }
});
app.get('/api/current-user', (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, username: req.session.user.username });
  } else {
    res.json({ loggedIn: false });
  }
});

// 회원 목록 조회 API
app.get('/api/users', async (req, res) => {
  // 로그인 체크
  if (!req.session.user) {
    return res.status(401).json({ success: false, message: '로그인이 필요합니다.' });
  }
  
  try {
    const [rows] = await pool.query(
      'SELECT id, username, created_at FROM users ORDER BY created_at DESC'
    );
    
    res.json({ success: true, users: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Made with Bob
