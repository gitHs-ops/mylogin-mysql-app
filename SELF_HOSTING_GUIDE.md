# 자가 호스팅 가이드 (개인 PC 서버 운용)

개인 PC를 24시간 서버로 운용하여 로그인 시스템을 호스팅하는 방법입니다.

## 📋 목차
1. [장단점 분석](#장단점-분석)
2. [필수 준비사항](#필수-준비사항)
3. [네트워크 설정](#네트워크-설정)
4. [보안 설정](#보안-설정)
5. [도메인 연결](#도메인-연결)
6. [자동 시작 설정](#자동-시작-설정)
7. [모니터링 및 유지보수](#모니터링-및-유지보수)
8. [비용 분석](#비용-분석)

---

## 장단점 분석

### ✅ 장점

1. **완전한 제어권**
   - 모든 설정을 직접 관리
   - 리소스 제한 없음
   - 원하는 대로 커스터마이징

2. **비용 절감**
   - 호스팅 비용 없음
   - 기존 PC 활용
   - 무제한 트래픽

3. **학습 기회**
   - 서버 관리 경험
   - 네트워크 지식 습득
   - DevOps 실습

4. **데이터 소유권**
   - 모든 데이터가 내 PC에
   - 프라이버시 보장
   - 백업 완전 제어

### ❌ 단점

1. **전기료**
   - 24시간 가동 시 월 2~5만원
   - PC 사양에 따라 다름

2. **안정성 문제**
   - 정전 시 서비스 중단
   - 인터넷 끊김 시 접속 불가
   - 하드웨어 고장 위험

3. **보안 위험**
   - 해킹 공격 대상
   - DDoS 공격 가능
   - 개인 정보 노출 위험

4. **관리 부담**
   - 24시간 모니터링 필요
   - 업데이트 관리
   - 문제 발생 시 직접 해결

5. **속도 제한**
   - 가정용 인터넷 업로드 속도 제한
   - 동시 접속자 수 제한
   - ISP 정책에 따른 제약

---

## 필수 준비사항

### 1. 하드웨어 요구사항

**최소 사양:**
- CPU: 듀얼코어 이상
- RAM: 4GB 이상
- 저장공간: 50GB 이상
- 네트워크: 100Mbps 이상

**권장 사양:**
- CPU: 쿼드코어 이상
- RAM: 8GB 이상
- SSD: 100GB 이상
- 네트워크: 기가비트 이더넷

### 2. 소프트웨어 요구사항

- ✅ Windows 10/11 Pro (원격 데스크톱 지원)
- ✅ Node.js 18 이상
- ✅ PostgreSQL 18
- ✅ 고정 IP 또는 DDNS 서비스

### 3. 인터넷 요구사항

**필수:**
- 안정적인 인터넷 연결
- 공유기 관리자 권한
- 포트 포워딩 가능 여부 확인

**권장:**
- 업로드 속도 10Mbps 이상
- 무제한 데이터 요금제
- 고정 IP (선택사항)

---

## 네트워크 설정

### 1. 고정 IP 설정 (PC)

**Windows 설정:**

1. **네트워크 어댑터 설정 열기**
   ```
   제어판 → 네트워크 및 인터넷 → 네트워크 연결
   ```

2. **이더넷 속성 → IPv4 속성**
   ```
   IP 주소: 192.168.0.100 (예시)
   서브넷 마스크: 255.255.255.0
   기본 게이트웨이: 192.168.0.1 (공유기 IP)
   DNS: 8.8.8.8, 8.8.4.4 (Google DNS)
   ```

3. **확인 및 적용**

### 2. 포트 포워딩 설정 (공유기)

**공유기 관리 페이지 접속:**
```
브라우저에서: http://192.168.0.1
또는: http://192.168.1.1
```

**포트 포워딩 규칙 추가:**

| 서비스 이름 | 외부 포트 | 내부 IP | 내부 포트 | 프로토콜 |
|------------|----------|---------|----------|---------|
| HTTP | 80 | 192.168.0.100 | 3000 | TCP |
| HTTPS | 443 | 192.168.0.100 | 3000 | TCP |

**주요 공유기별 설정 위치:**

- **ipTIME:** 고급 설정 → NAT/라우터 관리 → 포트포워드 설정
- **TP-Link:** Forwarding → Virtual Servers
- **ASUS:** WAN → Virtual Server/Port Forwarding
- **공유기 모델 확인:** 공유기 뒷면 스티커

### 3. 방화벽 설정 (Windows)

**Windows Defender 방화벽:**

```powershell
# PowerShell 관리자 권한으로 실행

# 포트 3000 허용
New-NetFirewallRule -DisplayName "Node.js Server" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow

# 포트 80 허용 (HTTP)
New-NetFirewallRule -DisplayName "HTTP" -Direction Inbound -LocalPort 80 -Protocol TCP -Action Allow

# 포트 443 허용 (HTTPS)
New-NetFirewallRule -DisplayName "HTTPS" -Direction Inbound -LocalPort 443 -Protocol TCP -Action Allow
```

**또는 GUI로 설정:**
```
제어판 → Windows Defender 방화벽 → 고급 설정
→ 인바운드 규칙 → 새 규칙 → 포트 → TCP → 3000
```

### 4. 외부 IP 확인

**현재 공인 IP 확인:**
```
브라우저에서: https://www.whatismyip.com
또는 PowerShell: (Invoke-WebRequest -Uri "https://api.ipify.org").Content
```

**접속 테스트:**
```
http://your-public-ip:3000
```

---

## 보안 설정

### 1. 리버스 프록시 설정 (Nginx)

**Nginx 설치 (Windows):**

1. https://nginx.org/en/download.html 에서 다운로드
2. `C:\nginx` 에 압축 해제

**nginx.conf 설정:**

```nginx
# C:\nginx\conf\nginx.conf

worker_processes 1;

events {
    worker_connections 1024;
}

http {
    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;
    
    # 업로드 크기 제한
    client_max_body_size 1M;
    
    # 타임아웃 설정
    client_body_timeout 10s;
    client_header_timeout 10s;
    
    server {
        listen 80;
        server_name your-domain.com;
        
        # HTTP를 HTTPS로 리다이렉트
        return 301 https://$server_name$request_uri;
    }
    
    server {
        listen 443 ssl http2;
        server_name your-domain.com;
        
        # SSL 인증서 (Let's Encrypt)
        ssl_certificate C:/nginx/ssl/certificate.crt;
        ssl_certificate_key C:/nginx/ssl/private.key;
        
        # SSL 설정
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers on;
        
        # 보안 헤더
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Strict-Transport-Security "max-age=31536000" always;
        
        location / {
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
        
        # 로그인 API Rate Limiting
        location /api/login {
            limit_req zone=login burst=3 nodelay;
            proxy_pass http://localhost:3000;
        }
        
        # 정적 파일 캐싱
        location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
            proxy_pass http://localhost:3000;
        }
    }
}
```

**Nginx 서비스 등록:**

```powershell
# nssm 다운로드: https://nssm.cc/download
nssm install nginx "C:\nginx\nginx.exe"
nssm start nginx
```

### 2. Fail2Ban 대안 (Windows)

**EvtxToElk 또는 수동 스크립트:**

```powershell
# ban-ip.ps1
$logFile = "C:\myPrjt01\myLogin02\logs\failed-logins.log"
$threshold = 5
$banDuration = 3600 # 1시간

# 실패한 로그인 모니터링
Get-Content $logFile -Tail 100 | ForEach-Object {
    if ($_ -match "Failed login from (\d+\.\d+\.\d+\.\d+)") {
        $ip = $matches[1]
        # IP 차단 로직
        New-NetFirewallRule -DisplayName "Block $ip" -Direction Inbound -RemoteAddress $ip -Action Block
    }
}
```

### 3. 정기 백업 스크립트

**backup-daily.bat:**

```batch
@echo off
set BACKUP_DIR=D:\backups\logindb
set TIMESTAMP=%date:~0,4%%date:~5,2%%date:~8,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set PGPASSWORD=sj1234

REM 데이터베이스 백업
"C:\Program Files\PostgreSQL\18\bin\pg_dump.exe" -U postgres -d logindb > %BACKUP_DIR%\backup_%TIMESTAMP%.sql

REM 7일 이상 된 백업 삭제
forfiles /p %BACKUP_DIR% /m *.sql /d -7 /c "cmd /c del @path"

echo Backup completed: %TIMESTAMP%
```

**작업 스케줄러 등록:**
```
작업 스케줄러 → 기본 작업 만들기
→ 매일 새벽 2시 실행
→ backup-daily.bat 실행
```

---

## 도메인 연결

### 1. 무료 DDNS 서비스

**No-IP (권장):**

1. https://www.noip.com 가입
2. 무료 호스트네임 생성: `mylogin.ddns.net`
3. DUC (Dynamic Update Client) 다운로드
4. 설치 및 로그인
5. 자동으로 IP 업데이트

**Duck DNS:**

1. https://www.duckdns.org 접속
2. GitHub 로그인
3. 도메인 생성: `mylogin.duckdns.org`
4. Windows 스케줄러로 IP 업데이트:

```powershell
# update-duckdns.ps1
$domain = "mylogin"
$token = "your-token-here"
Invoke-WebRequest "https://www.duckdns.org/update?domains=$domain&token=$token"
```

### 2. 유료 도메인 (선택사항)

**도메인 구매:**
- Namecheap: $8.88/년
- GoDaddy: $11.99/년
- Gabia (한국): 15,000원/년

**DNS 설정:**
```
A 레코드: @ → your-public-ip
A 레코드: www → your-public-ip
```

### 3. Cloudflare (무료 CDN + DDoS 방어)

1. https://www.cloudflare.com 가입
2. 도메인 추가
3. 네임서버 변경
4. DNS 레코드 추가:
   ```
   A @ your-public-ip (프록시 활성화)
   ```
5. SSL/TLS 설정: Full

**장점:**
- 무료 DDoS 방어
- 무료 SSL 인증서
- CDN으로 속도 향상
- 실제 IP 숨김

---

## 자동 시작 설정

### 1. Windows 서비스로 등록

**node-windows 사용:**

```bash
npm install -g node-windows
```

**install-service.js 생성:**

```javascript
const Service = require('node-windows').Service;

// Node.js 앱을 서비스로 등록
const svc = new Service({
  name: 'LoginApp',
  description: 'Login System Service',
  script: 'C:\\myPrjt01\\myLogin02\\server.js',
  nodeOptions: [
    '--harmony',
    '--max_old_space_size=4096'
  ],
  env: [
    {
      name: "NODE_ENV",
      value: "production"
    },
    {
      name: "PORT",
      value: "3000"
    }
  ]
});

// 서비스 설치
svc.on('install', () => {
  console.log('Service installed successfully!');
  svc.start();
});

svc.on('alreadyinstalled', () => {
  console.log('Service is already installed.');
});

svc.install();
```

**서비스 설치:**

```powershell
# 관리자 권한으로 실행
node install-service.js
```

**서비스 관리:**

```powershell
# 서비스 시작
net start LoginApp

# 서비스 중지
net stop LoginApp

# 서비스 제거
node uninstall-service.js
```

### 2. PM2 사용 (권장)

```bash
# PM2 설치
npm install -g pm2
npm install -g pm2-windows-startup

# Windows 시작 시 자동 실행 설정
pm2-startup install

# 앱 시작
pm2 start server.js --name loginapp

# 현재 상태 저장
pm2 save

# 모니터링
pm2 monit
```

### 3. PostgreSQL 자동 시작

**서비스 설정:**
```
services.msc 실행
→ postgresql-x64-18 찾기
→ 속성 → 시작 유형: 자동
→ 확인
```

---

## 모니터링 및 유지보수

### 1. 로그 모니터링

**Winston 로거 설정 (이미 PRODUCTION_GUIDE.md에 있음):**

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    })
  ]
});
```

### 2. 시스템 모니터링

**무료 도구:**

1. **Task Manager**
   - CPU, 메모리, 네트워크 사용량 확인

2. **Resource Monitor**
   - 상세한 리소스 사용 현황

3. **Performance Monitor**
   - 장기 성능 추적

4. **Grafana + Prometheus (고급)**
   ```bash
   # Prometheus 설치
   # Grafana 설치
   # Node.js 메트릭 수집
   ```

### 3. 알림 설정

**이메일 알림 (Nodemailer):**

```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password'
  }
});

// 에러 발생 시 이메일 전송
function sendAlert(error) {
  transporter.sendMail({
    from: 'your-email@gmail.com',
    to: 'admin@example.com',
    subject: 'Server Error Alert',
    text: `Error occurred: ${error.message}`
  });
}
```

### 4. 정기 점검 체크리스트

**매일:**
- [ ] 서버 상태 확인
- [ ] 로그 확인
- [ ] 디스크 공간 확인

**매주:**
- [ ] 백업 확인
- [ ] 보안 업데이트 확인
- [ ] 성능 메트릭 검토

**매월:**
- [ ] 전체 시스템 점검
- [ ] 백업 복원 테스트
- [ ] 보안 스캔

---

## 비용 분석

### 전기료 계산

**PC 사양별 전력 소비:**

| PC 사양 | 소비 전력 | 월 전기료 (24시간) |
|---------|----------|-------------------|
| 저전력 (노트북) | 30W | 약 5,000원 |
| 일반 데스크톱 | 100W | 약 17,000원 |
| 고성능 데스크톱 | 200W | 약 34,000원 |
| 게이밍 PC | 400W | 약 68,000원 |

**계산 공식:**
```
월 전기료 = (소비전력 W × 24시간 × 30일 ÷ 1000) × 전기요금(약 140원/kWh)
```

### 총 비용 비교 (월간)

| 항목 | 자가 호스팅 | Render | Railway |
|------|------------|--------|---------|
| 호스팅 | 0원 | 0원 | 0원 |
| 전기료 | 5,000~68,000원 | 0원 | 0원 |
| 도메인 | 1,250원 (연 15,000원) | 0원 | 0원 |
| 인터넷 | 기존 요금 | 0원 | 0원 |
| **총계** | **6,250~69,250원** | **0원** | **0원** |

### 손익분기점

**저전력 PC 사용 시:**
- 월 6,250원
- 연 75,000원
- 학습 가치: 무한대 ✨

**고성능 PC 사용 시:**
- 월 69,250원
- 연 831,000원
- 클라우드 호스팅이 더 저렴

---

## 권장 사항

### 자가 호스팅 추천 상황

✅ **추천:**
- 학습 목적
- 개인 프로젝트
- 완전한 제어가 필요한 경우
- 저전력 PC 보유
- 안정적인 인터넷 환경

❌ **비추천:**
- 상용 서비스
- 높은 가용성 필요
- 고성능 PC 사용
- 불안정한 인터넷
- 보안 지식 부족

### 하이브리드 접근

**개발/테스트:** 자가 호스팅  
**프로덕션:** 클라우드 호스팅

이렇게 하면 학습 효과와 안정성을 모두 얻을 수 있습니다!

---

## 빠른 시작 가이드

### 1단계: 네트워크 설정 (30분)
```
1. PC 고정 IP 설정
2. 공유기 포트 포워딩
3. 방화벽 규칙 추가
4. 외부 접속 테스트
```

### 2단계: 보안 설정 (1시간)
```
1. Nginx 설치 및 설정
2. SSL 인증서 설치
3. 백업 스크립트 작성
4. 모니터링 설정
```

### 3단계: 자동화 (30분)
```
1. Windows 서비스 등록
2. 자동 백업 설정
3. DDNS 설정
4. 알림 설정
```

### 4단계: 테스트 (30분)
```
1. 외부에서 접속 테스트
2. 부하 테스트
3. 재부팅 테스트
4. 백업 복원 테스트
```

**총 소요 시간:** 약 3시간

---

## 결론

### 자가 호스팅 vs 클라우드

**자가 호스팅이 좋은 경우:**
- 💡 학습이 주 목적
- 💰 저전력 PC 보유
- 🏠 안정적인 가정 환경
- 🎓 서버 관리 경험 쌓기

**클라우드가 좋은 경우:**
- 🚀 실제 서비스 운영
- ⚡ 높은 가용성 필요
- 🔒 전문적인 보안 필요
- 💼 비즈니스 용도

### 최종 추천

**학습 단계:**
1. 로컬 개발 (현재)
2. 자가 호스팅 (학습)
3. 클라우드 배포 (실전)

이 순서로 진행하면 완벽한 학습 경험을 얻을 수 있습니다! 🎉

---

**작성일:** 2026-05-02  
**작성자:** Bob (AI Assistant)  
**버전:** 1.0