# Vercel 배포 가이드

## 📋 배포 전 체크리스트

### 1. API 서버 준비
- [ ] image-hosting-api가 Cloudflare Workers에 배포됨
- [ ] API URL 확보 (예: `https://your-api.workers.dev`)
- [ ] CORS 설정 완료

### 2. 환경변수 준비
- [ ] Cloudflare API URL
- [ ] 기타 필요한 API 키

## 🚀 배포 방법

### 방법 1: Vercel CLI 사용

```bash
# 1. Vercel CLI 설치
npm i -g vercel

# 2. 프로젝트 루트에서 배포
vercel

# 3. 프롬프트 따라 설정
# - Setup and deploy? Y
# - Which scope? (your-account)
# - Link to existing project? N
# - Project name? image-gallery-web
# - In which directory is your code? ./
# - Override settings? N
```

### 방법 2: GitHub 연동

1. GitHub에 코드 푸시
2. [Vercel 대시보드](https://vercel.com/dashboard)에서 "New Project"
3. GitHub 레포지토리 연결
4. 환경변수 설정 (아래 참조)
5. Deploy 클릭

## ⚙️ 환경변수 설정

Vercel 대시보드 > Settings > Environment Variables에서 설정:

| 변수명 | 값 | 설명 |
|--------|-----|------|
| `VITE_API_URL` | `https://your-api.workers.dev` | Cloudflare Workers API URL |
| `VITE_IMAGE_CDN_URL` | `https://your-cdn.cloudflare.com` | 이미지 CDN URL (선택) |
| `VITE_ENV` | `production` | 환경 설정 |

## 🔧 주요 설정 파일

### vercel.json
```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://your-api.workers.dev/:path*"
    }
  ]
}
```

### 프록시 설정
- 개발: `vite.config.js`의 proxy 설정 사용
- 프로덕션: `vercel.json`의 rewrites 사용

## 🎯 배포 후 확인

1. **기본 접속 테스트**
   - `https://your-app.vercel.app` 접속
   - 갤러리 UI 로드 확인

2. **API 연동 테스트**
   - 이미지 업로드 시도
   - 이미지 조회 확인
   - 검색 기능 테스트

3. **성능 확인**
   - Lighthouse 점수 확인
   - CDN 캐싱 동작 확인

## ⚠️ 주의사항

### CORS 설정
API 서버(Cloudflare Workers)에서 Vercel 도메인 허용 필요:
```javascript
// workers API의 CORS 설정
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://your-app.vercel.app',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}
```

### 이미지 저장소
- Cloudflare R2 또는 다른 오브젝트 스토리지 필요
- 로컬 파일 시스템 사용 불가

### API 엔드포인트 수정
`src/App.jsx`에서 API URL 환경변수 사용:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'
```

## 🔄 업데이트 방법

### 자동 배포 (GitHub 연동시)
```bash
git add .
git commit -m "Update gallery"
git push origin main
# Vercel이 자동으로 재배포
```

### 수동 배포
```bash
vercel --prod
```

## 📊 모니터링

- Vercel 대시보드에서 실시간 로그 확인
- Analytics 탭에서 성능 메트릭 확인
- Functions 탭에서 API 프록시 상태 확인

## 🆘 트러블슈팅

### 빌드 실패
- `node_modules` 삭제 후 재설치
- `package-lock.json` 업데이트
- Node.js 버전 확인 (18.x 이상)

### API 연결 실패
- 환경변수 설정 확인
- CORS 헤더 확인
- API 서버 상태 확인

### 이미지 로드 실패
- CDN URL 확인
- 이미지 경로 확인
- 브라우저 콘솔 에러 확인