# Image Gallery Web

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/image-gallery-web&env=VITE_API_URL&envDescription=API%20endpoint%20for%20image%20hosting&envLink=https://github.com/yourusername/image-gallery-web%23environment-variables)

이미지 호스팅 API와 연동되는 독립적인 웹 갤러리 애플리케이션입니다.

## 주요 기능

- ✅ 이미지 그리드 뷰 (반응형 레이아웃)
- ✅ 이미지 검색 기능 (ID 또는 태그 기반)
- ✅ 이미지 상세 정보 표시 (메타데이터 포함)
- ✅ 라이트박스 모드 (전체 화면 보기)
- ✅ 실시간 업로드 상태 표시
- ✅ 로딩 애니메이션

## 시작하기

### 사전 요구사항

- Node.js 14+ 또는 Python 3+
- 실행중인 이미지 호스팅 API 서버

### 설치

```bash
# 저장소 클론
git clone <repository-url>
cd image-gallery-web

# 의존성 설치 (선택사항)
npm install
```

### 실행

#### Node.js 사용 (권장)

```bash
# 개발 서버 시작 (자동 새로고침 지원)
npm run dev

# 또는 일반 서버 시작
npm start
```

#### Python 사용

```bash
# Python 내장 서버 사용
npm run serve
# 또는 직접 실행
python3 -m http.server 5101
```

서버가 시작되면 브라우저에서 http://localhost:5101 으로 접속하세요.

## API 연동 설정

`app.js` 파일의 상단에서 API 엔드포인트를 설정할 수 있습니다:

```javascript
const API_BASE_URL = 'http://localhost:5787'; // API 서버 주소
```

### API 엔드포인트

갤러리가 사용하는 API 엔드포인트:

- `GET /images` - 이미지 목록 조회
- `GET /image/:id` - 특정 이미지 조회
- `GET /image/:id/metadata` - 이미지 메타데이터 조회
- `POST /upload` - 이미지 업로드

## 프로젝트 구조

```
image-gallery-web/
├── index.html      # 메인 HTML 페이지
├── styles.css      # 스타일시트 (반응형 디자인)
├── app.js          # JavaScript 로직 (API 통신, UI 제어)
├── package.json    # 프로젝트 설정 및 스크립트
└── README.md       # 프로젝트 문서
```

## 사용 방법

### 이미지 검색

- 검색창에 이미지 ID 또는 태그를 입력
- Enter 키를 누르거나 검색 버튼 클릭
- 전체 목록으로 돌아가려면 검색창을 비우고 검색

### 이미지 보기

- 썸네일 클릭: 라이트박스 모드로 전체 화면 보기
- 라이트박스에서 ESC 키 또는 X 버튼: 닫기
- 메타데이터 보기: 이미지 하단 정보 확인

### 이미지 업로드

현재 버전에서는 API를 통한 직접 업로드를 지원합니다.
향후 드래그 앤 드롭 기능이 추가될 예정입니다.

## 커스터마이징

### 스타일 변경

`styles.css` 파일을 수정하여 디자인을 커스터마이징할 수 있습니다:

- 색상 테마: CSS 변수 활용
- 그리드 레이아웃: `.image-grid` 클래스 수정
- 반응형 브레이크포인트: 미디어 쿼리 조정

### 기능 확장

`app.js` 파일에서 추가 기능을 구현할 수 있습니다:

- 페이지네이션 추가
- 필터링 옵션 확장
- 이미지 다운로드 기능
- 소셜 공유 기능

## 브라우저 호환성

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 문제 해결

### CORS 오류

API 서버와 다른 도메인에서 실행 중인 경우:

1. API 서버에서 CORS 헤더 설정 확인
2. 개발 중에는 `--cors` 플래그와 함께 서버 실행

### 이미지 로딩 실패

1. API 서버가 실행 중인지 확인
2. `app.js`의 `API_BASE_URL` 설정 확인
3. 브라우저 개발자 도구에서 네트워크 탭 확인

## 향후 계획

- [ ] 드래그 앤 드롭 업로드
- [ ] 이미지 편집 기능
- [ ] 앨범/카테고리 관리
- [ ] 사용자 인증
- [ ] 무한 스크롤
- [ ] 이미지 압축 옵션

## 라이선스

MIT License

## 기여하기

Pull Request는 언제나 환영합니다!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 문의

문제가 발생하거나 제안사항이 있으면 Issues 탭에서 알려주세요.