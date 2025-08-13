# CLAUDE.md - Image Gallery Web

## 언어 설정
- **대화 언어**: 한글 (Korean)
- 모든 대화와 설명은 한글로 진행합니다

## 중요 지침
⚠️ **서버 관리 규칙**
- 서버 시작/재시작/종료는 사용자가 직접 수행합니다
- Claude는 서버를 실행하거나 재시작하지 않습니다
- 설정 변경 후 "서버를 재시작해주세요"라고 안내만 합니다
- 포트 충돌 문제는 사용자가 직접 해결합니다

## 프로젝트 개요
이미지 호스팅 API와 연동되는 독립적인 웹 갤러리 애플리케이션. 
사용자가 업로드한 이미지를 시각적으로 탐색하고 관리할 수 있는 웹 인터페이스를 제공합니다.

## 포트 할당 (중요)
- **갤러리 웹 서버**: 5101 (고정)
- **포트 범위**: 5101~5200 (image-gallery-web 전용)
- **API 서버**: 5787 (image-hosting-api)
- ⚠️ **주의**: 반드시 5101 포트를 사용할 것

## 기술 스택
- **프레임워크**: React 19 + TypeScript 5
- **빌드 도구**: Vite 5 (HMR, 빠른 빌드)
- **UI 컴포넌트**: shadcn/ui (Tailwind CSS + Radix UI)
- **상태 관리**: 
  - 클라이언트: Zustand
  - 서버: @tanstack/react-query v5
- **스타일링**: Tailwind CSS 3.4 (다크모드 지원)
- **아이콘**: lucide-react
- **파일 업로드**: react-dropzone
- **날짜 처리**: date-fns
- **알림**: react-hot-toast

## 핵심 기능
1. **이미지 갤러리**
   - 그리드 레이아웃 (반응형)
   - 썸네일 자동 생성
   - 무한 스크롤 (예정)

2. **이미지 뷰어**
   - 라이트박스 모드
   - 전체 화면 보기
   - 키보드 네비게이션 (ESC 키)

3. **검색 기능**
   - ID 기반 검색
   - 태그 기반 검색 (예정)
   - 실시간 필터링

4. **메타데이터 표시**
   - 업로드 날짜
   - 파일 크기
   - 이미지 해상도
   - EXIF 정보 (카메라, 설정 등)

## 프로젝트 구조
```
image-gallery-web/
├── index.html      # 메인 HTML (갤러리 레이아웃)
├── styles.css      # 스타일시트 (반응형 디자인)
├── app.js          # JavaScript 로직 (API 통신, UI)
├── package.json    # 프로젝트 설정 (포트 5101)
├── README.md       # 사용자 문서
└── CLAUDE.md       # 프로젝트 지침 (이 파일)
```

## API 연동
- **API Base URL**: `http://localhost:5787`
- **CORS**: 개발 서버에서 자동 활성화
- **엔드포인트**:
  - `GET /images` - 이미지 목록
  - `GET /image/:id` - 개별 이미지
  - `GET /image/:id/metadata` - 메타데이터
  - `POST /upload` - 이미지 업로드

## 개발 규칙
1. **포트 관리**
   - 항상 5101 포트 사용
   - package.json의 스크립트에서 포트 변경 금지

2. **코드 스타일**
   - ES6+ 문법 사용
   - async/await 패턴 권장
   - 에러 처리 필수

3. **반응형 디자인**
   - 모바일 우선 접근
   - 3개 브레이크포인트: 640px, 768px, 1024px

4. **성능 최적화**
   - 이미지 레이지 로딩
   - 썸네일 우선 로드
   - 캐싱 활용

## 빠른 시작
```bash
# 개발 서버 시작 (포트 5101)
npm run dev

# 프로덕션 서버 시작 (포트 5101)
npm start

# Python 대체 서버 (포트 5101)
npm run serve
```

## 테스트 방법
1. API 서버 실행 확인 (포트 5787)
2. 갤러리 서버 시작 (포트 5101)
3. 브라우저에서 http://localhost:5101 접속
4. 이미지 업로드 및 조회 테스트

## 향후 계획
- [ ] 드래그 앤 드롭 업로드
- [ ] 배치 업로드 UI
- [ ] 이미지 편집 기능
- [ ] 앨범/카테고리 관리
- [ ] 사용자 인증
- [ ] 무한 스크롤
- [ ] 이미지 다운로드
- [ ] 소셜 공유

## 트러블슈팅
### CORS 오류
- API 서버 CORS 설정 확인
- 개발 서버 `--cors` 플래그 확인

### 포트 충돌
- 5101 포트 사용 중인 프로세스 확인
- `lsof -i :5101` (Mac/Linux)
- `netstat -ano | findstr :5101` (Windows)

### 이미지 로딩 실패
- API 서버 상태 확인 (포트 5787)
- 네트워크 탭에서 요청 확인
- app.js의 API_BASE_URL 확인

## 관련 프로젝트
- **image-hosting-api**: 백엔드 API 서버 (포트 5787)
- **연동 문서**: ../image-hosting-api/docs/05_MODULE_INTEGRATION_GUIDE.md