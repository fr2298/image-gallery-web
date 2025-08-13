# 🚀 이미지 갤러리 웹 - Development Roadmap

## 📋 작업 정의 형식
```
[상태] [ID] 작업명 >> 산출물 ~ 의존성 @ 담당 # 예상시간
```

### 상태 표시
- `[ ]` 대기 (Pending)
- `[-]` 진행중 (In Progress)
- `[x]` 완료 (Completed)
- `[!]` 블로킹 (Blocked)
- `[~]` 보류 (On Hold)

### ID 도메인
- **SETUP**: 프로젝트 설정
- **UI**: 프론트엔드 컴포넌트
- **API**: API 연동
- **SEARCH**: 검색/필터 기능
- **MANAGE**: 이미지 관리 기능
- **UPLOAD**: 업로드 기능
- **DETAIL**: 상세 정보 기능
- **POLISH**: UX 개선
- **TEST**: 테스트
- **OPT**: 최적화
- **DEPLOY**: 배포
- **DOC**: 문서화

---

## Group Setup: 프로젝트 초기화 @ Main_Session

[x] [SETUP001] 프로젝트 생성 및 기본 구조 >> package.json, 폴더 구조 ~ 없음 @ Main_Session # 30m
[ ] [SETUP002] shadcn/ui 초기화 >> components.json, ui 폴더 ~ [SETUP001] @ Main_Session # 30m
[ ] [SETUP003] 필수 패키지 설치 >> node_modules, package-lock.json ~ [SETUP002] @ Main_Session # 20m
[ ] [SETUP004] TypeScript 설정 >> tsconfig.json, 타입 정의 ~ [SETUP001] @ Main_Session # 30m
[ ] [SETUP005] API 서비스 레이어 >> src/services/imageApi.ts ~ [SETUP003,SETUP004] @ Main_Session # 1h
[ ] [SETUP006] Zustand 스토어 설정 >> src/stores/imageStore.ts ~ [SETUP003] @ Main_Session # 45m
[ ] [SETUP007] React Query 설정 >> src/hooks/useImageQueries.ts ~ [SETUP003] @ Main_Session # 45m

---

## Group Core: 핵심 기능 개발

### Phase 1: 이미지 조회 기능 @ Session_1

[ ] [UI001] 이미지 카드 컴포넌트 >> src/components/ImageCard.tsx ~ [SETUP002] @ Session_1 # 1.5h
[ ] [UI002] 이미지 그리드 컴포넌트 >> src/components/ImageGrid.tsx ~ [UI001,SETUP005] @ Session_1 # 2h
[ ] [UI003] 이미지 테이블 컴포넌트 >> src/components/ImageTable.tsx ~ [SETUP002,SETUP005] @ Session_1 # 2h
[ ] [UI004] 뷰 모드 전환 >> src/components/ViewToggle.tsx ~ [UI002,UI003] @ Session_1 # 1h
[ ] [UI005] 레이지 로딩 구현 >> Intersection Observer 훅 ~ [UI002] @ Session_1 # 1.5h
[ ] [UI006] 무한 스크롤 >> src/hooks/useInfiniteScroll.ts ~ [UI005,SETUP007] @ Session_1 # 1.5h

### Phase 2: 검색 및 필터 @ Session_2

[ ] [SEARCH001] 태그 검색 컴포넌트 >> src/components/search/TagSearch.tsx ~ [SETUP002,SETUP005] @ Session_2 # 1.5h
[ ] [SEARCH002] 태그 자동완성 >> Command 컴포넌트 활용 ~ [SEARCH001] @ Session_2 # 1h
[ ] [SEARCH003] 날짜 필터 >> src/components/search/DateFilter.tsx ~ [SETUP002] @ Session_2 # 1h
[ ] [SEARCH004] 크기 필터 >> src/components/search/SizeFilter.tsx ~ [SETUP002] @ Session_2 # 1h
[ ] [SEARCH005] 통합 필터 바 >> src/components/search/FilterBar.tsx ~ [SEARCH001,SEARCH003,SEARCH004] @ Session_2 # 1.5h
[ ] [SEARCH006] 필터 상태 관리 >> Zustand 필터 스토어 ~ [SETUP006,SEARCH005] @ Session_2 # 1h

### Phase 3: 이미지 관리 @ Session_3

[ ] [MANAGE001] 선택 시스템 >> src/stores/selectionStore.ts ~ [SETUP006,UI002] @ Session_3 # 1.5h
[ ] [MANAGE002] 체크박스 컴포넌트 >> 선택 UI 통합 ~ [MANAGE001,UI001] @ Session_3 # 1h
[ ] [MANAGE003] 일괄 작업 툴바 >> src/components/BulkActions.tsx ~ [MANAGE001] @ Session_3 # 1h
[ ] [MANAGE004] 삭제 확인 모달 >> AlertDialog 컴포넌트 ~ [SETUP002] @ Session_3 # 1h
[ ] [MANAGE005] 관리자 키 입력 >> 인증 필드 ~ [MANAGE004] @ Session_3 # 30m
[ ] [MANAGE006] 삭제 API 연동 >> 일괄 삭제 로직 ~ [MANAGE005,SETUP005] @ Session_3 # 1h
[ ] [MANAGE007] 다운로드 기능 >> 단일/다중 다운로드 ~ [MANAGE001] @ Session_3 # 1.5h

### Phase 4: 업로드 기능 @ Session_4

[ ] [UPLOAD001] 업로드 모달 >> Dialog 컴포넌트 ~ [SETUP002] @ Session_4 # 1h
[ ] [UPLOAD002] 드롭존 컴포넌트 >> react-dropzone 통합 ~ [SETUP003,UPLOAD001] @ Session_4 # 1.5h
[ ] [UPLOAD003] 파일 미리보기 >> 썸네일 생성 ~ [UPLOAD002] @ Session_4 # 1h
[ ] [UPLOAD004] URL 업로드 탭 >> URL 입력 폼 ~ [UPLOAD001] @ Session_4 # 1h
[ ] [UPLOAD005] 업로드 진행률 >> Progress 컴포넌트 ~ [SETUP002,UPLOAD002] @ Session_4 # 1h
[ ] [UPLOAD006] 배치 업로드 로직 >> 다중 파일 처리 ~ [UPLOAD002,SETUP005] @ Session_4 # 1.5h
[ ] [UPLOAD007] 태그 입력 >> 업로드 시 태그 추가 ~ [UPLOAD001] @ Session_4 # 45m

### Phase 5: 상세 정보 @ Session_5

[ ] [DETAIL001] 이미지 상세 모달 >> Dialog 컴포넌트 ~ [SETUP002] @ Session_5 # 1.5h
[ ] [DETAIL002] 라이트박스 뷰어 >> 전체화면 이미지 ~ [DETAIL001] @ Session_5 # 1.5h
[ ] [DETAIL003] 메타데이터 카드 >> 파일 정보 표시 ~ [DETAIL001,SETUP005] @ Session_5 # 1h
[ ] [DETAIL004] EXIF 정보 표시 >> EXIF 파서 통합 ~ [DETAIL001,SETUP005] @ Session_5 # 1h
[ ] [DETAIL005] 태그 편집 >> 인라인 편집 UI ~ [DETAIL001] @ Session_5 # 1h
[ ] [DETAIL006] 공유 기능 >> URL 복사, QR 코드 ~ [DETAIL001] @ Session_5 # 45m

---

## Group Polish: UX 개선 @ Session_6

[ ] [POLISH001] 로딩 스켈레톤 >> Skeleton 컴포넌트 ~ [UI002,UI003] @ Session_6 # 1h
[ ] [POLISH002] 토스트 알림 >> react-hot-toast 통합 ~ [SETUP003] @ Session_6 # 30m
[ ] [POLISH003] 에러 바운더리 >> 에러 처리 컴포넌트 ~ 없음 @ Session_6 # 1h
[ ] [POLISH004] 키보드 단축키 >> 단축키 핸들러 ~ 없음 @ Session_6 # 1h
[ ] [POLISH005] 다크모드 최적화 >> 테마 전환 버튼 ~ 없음 @ Session_6 # 30m
[ ] [POLISH006] 모바일 반응형 >> 미디어 쿼리, 터치 제스처 ~ 없음 @ Session_6 # 1.5h
[ ] [POLISH007] 애니메이션 >> Framer Motion 통합 ~ [SETUP003] @ Session_6 # 1h

---

## Group Test: 테스트 및 최적화 @ Session_7

[ ] [TEST001] 컴포넌트 단위 테스트 >> *.test.tsx 파일 ~ 모든 UI 컴포넌트 @ Session_7 # 3h
[ ] [TEST002] 스토어 테스트 >> Zustand 스토어 테스트 ~ [SETUP006] @ Session_7 # 1h
[ ] [TEST003] API 통합 테스트 >> MSW 목업 ~ [SETUP005] @ Session_7 # 2h
[ ] [TEST004] E2E 테스트 설정 >> Playwright 설정 ~ 없음 @ Session_7 # 1h
[ ] [TEST005] E2E 시나리오 작성 >> 주요 워크플로우 테스트 ~ [TEST004] @ Session_7 # 2h
[ ] [OPT001] 번들 최적화 >> 코드 스플리팅, Tree Shaking ~ 없음 @ Session_7 # 1h
[ ] [OPT002] 이미지 최적화 >> WebP 변환, 썸네일 캐싱 ~ 없음 @ Session_7 # 1.5h
[ ] [OPT003] 성능 프로파일링 >> React DevTools, Lighthouse ~ 없음 @ Session_7 # 1h

---

## Group Deploy: 배포 준비 @ Session_8

[ ] [DEPLOY001] 환경 변수 설정 >> .env.production ~ 없음 @ Session_8 # 30m
[ ] [DEPLOY002] 빌드 스크립트 >> package.json scripts ~ 없음 @ Session_8 # 30m
[ ] [DEPLOY003] Docker 설정 >> Dockerfile, docker-compose.yml ~ 없음 @ Session_8 # 1h
[ ] [DEPLOY004] Nginx 설정 >> nginx.conf ~ [DEPLOY003] @ Session_8 # 45m
[ ] [DEPLOY005] CI/CD 파이프라인 >> GitHub Actions ~ 없음 @ Session_8 # 1.5h
[ ] [DEPLOY006] Vercel 배포 설정 >> vercel.json ~ 없음 @ Session_8 # 45m
[ ] [DOC001] README 업데이트 >> 설치 및 사용 가이드 ~ 없음 @ Session_8 # 1h
[ ] [DOC002] API 문서 >> Swagger/OpenAPI ~ [SETUP005] @ Session_8 # 1h
[ ] [DOC003] 컴포넌트 문서 >> Storybook 설정 ~ 없음 @ Session_8 # 1.5h

---

## 📊 진행 상황 요약

### 전체 진행률
- **총 작업**: 72개
- **완료**: 1개 (1.4%)
- **진행중**: 0개 (0%)
- **대기**: 71개 (98.6%)

### 그룹별 상태
| 그룹 | 전체 | 완료 | 진행중 | 대기 | 진행률 |
|------|------|------|--------|------|--------|
| Setup | 7 | 1 | 0 | 6 | 14.3% |
| Core | 33 | 0 | 0 | 33 | 0% |
| Polish | 7 | 0 | 0 | 7 | 0% |
| Test | 8 | 0 | 0 | 8 | 0% |
| Deploy | 9 | 0 | 0 | 9 | 0% |

### Phase별 예상 소요 시간
- **Phase 1 (Setup)**: 4.5시간
- **Phase 2 (Core)**: 
  - 이미지 조회: 9시간
  - 검색/필터: 6.5시간
  - 이미지 관리: 7시간
  - 업로드: 7.25시간
  - 상세 정보: 6.75시간
- **Phase 3 (Polish)**: 6시간
- **Phase 4 (Test/Opt)**: 11.5시간
- **Phase 5 (Deploy/Doc)**: 8시간

**총 예상 시간**: 약 66시간

---

## 🔄 작업 우선순위

### 즉시 시작 가능 (의존성 없음)
1. [SETUP002] shadcn/ui 초기화
2. [SETUP004] TypeScript 설정

### 핵심 경로 (Critical Path)
```
SETUP002 → UI001 → UI002 → MANAGE001 → MANAGE003
         ↘ UI003 ↗
```

### 병렬 작업 가능
- Session_1: UI 컴포넌트 개발
- Session_2: 검색/필터 개발
- Session_3: 관리 기능 개발
- Session_4: 업로드 기능 개발

---

## 📝 개발 원칙

### 코드 품질
- TypeScript strict mode 사용
- ESLint + Prettier 설정
- 컴포넌트당 테스트 작성
- 코드 리뷰 필수

### 커밋 규칙
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 코드 리팩토링
test: 테스트 추가
chore: 빌드 업무 수정
```

### 브랜치 전략
- `main`: 프로덕션 배포
- `develop`: 개발 통합
- `feature/*`: 기능 개발
- `hotfix/*`: 긴급 수정

---

## 🚨 리스크 관리

### 기술적 리스크
| 리스크 | 확률 | 영향 | 대응 방안 |
|--------|------|------|-----------|
| API 응답 지연 | 중 | 높음 | 캐싱 전략, 로딩 UI |
| 대량 이미지 렌더링 | 높음 | 높음 | 가상 스크롤, 레이지 로딩 |
| 브라우저 호환성 | 낮음 | 중간 | Polyfill 사용 |
| 번들 크기 초과 | 중 | 중간 | 코드 스플리팅 |

### 일정 리스크
- 6주 개발 기간 초과 가능성
- 핵심 기능 우선 개발
- MVP 먼저 출시 후 점진적 개선

---

## 📅 마일스톤

### Week 1-2: Foundation
- 프로젝트 설정 완료
- 기본 UI 컴포넌트 개발
- API 연동 테스트

### Week 3-4: Core Features
- 이미지 조회/검색 완료
- 업로드 기능 완료
- 관리 기능 구현

### Week 5: Polish & Test
- UX 개선
- 테스트 작성
- 성능 최적화

### Week 6: Deployment
- 배포 준비
- 문서화
- 최종 테스트

---

## 🔗 참조 링크

### 프로젝트 문서
- [PRD 문서](./01_image-gallery-web_PRD.md)
- [API 문서](/Users/sunghwankim/projects/image-hosting-api/docs/API_DOCUMENTATION.md)

### 기술 문서
- [React 공식 문서](https://react.dev)
- [shadcn/ui 컴포넌트](https://ui.shadcn.com)
- [TanStack Query](https://tanstack.com/query)
- [Zustand](https://zustand-demo.pmnd.rs)

---

## 📞 연락처

프로젝트 관련 문의사항은 아래로 연락 주세요:
- 프로젝트 매니저: [PM 이름]
- 기술 리드: [Tech Lead 이름]
- 디자인: [Designer 이름]

---

*마지막 업데이트: 2025-08-10*