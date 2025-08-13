# 🌐 Claude Code 프로젝트 관리 시스템

## 🎯 핵심 대화 규칙
- **반드시 한글로 대화 진행** (코드, 기술 용어, 파일명 제외)
  - ❌ "Let me check the file" → ⭕ "파일을 확인해보겠습니다"
  - ❌ "I'll create a new component" → ⭕ "새로운 컴포넌트를 생성하겠습니다"
- **간결하고 명확한 응답**
- **TodoWrite 도구로 작업 진행상황 추적**
- **대화 시작 시 프로젝트 선택 프롬프트 표시** (project-registry.json 참조)

## 📁 프로젝트 위치 체계
```bash
/Users/sunghwankim/projects/             # 메인 프로젝트 (Git 관리)
/Users/sunghwankim/test-projects/        # 테스트/실험 프로젝트
/Users/sunghwankim/tmp/claude-test/       # 임시 프로젝트
```

## 🔖 프로젝트 관리 시스템

### 프로젝트 레지스트리
`~/.claude/project-registry.json` 파일에서 모든 프로젝트 중앙 관리:
```json
{
  "projects": [
    {
      "id": 1,
      "name": "store-manager",
      "alias": "sm",
      "path": "/Users/sunghwankim/projects/store-manager",
      "techStack": "react-fastapi",
      "status": "active",
      "lastModified": "2025-01-25"
    },
    {
      "id": 2,
      "name": "localboard",
      "alias": "lb",
      "path": "/Users/sunghwankim/projects/localboard",
      "techStack": "nextjs-supabase",
      "status": "active",
      "lastModified": "2025-01-24"
    }
  ]
}
```

### Claude 시작 시 프로젝트 선택
```
어떤 프로젝트에서 작업하시겠습니까?
(프로젝트를 선택하지 않고 자유롭게 질문하셔도 됩니다)

0. 🆕 새 프로젝트 생성
1. 🛍️ store-manager (sm) - 재고 관리 시스템
2. 📍 localboard (lb) - 지역 커뮤니티 플랫폼
3. 🧪 test-project - 실험용 프로젝트

선택: _
```

### 프로젝트 자동 등록
- `/start-project` 실행 시 자동으로 레지스트리에 추가 (type: "main")
- `/start-module` 실행 시 자동으로 레지스트리에 추가 (type: "module")
- 프로젝트 삭제 시 레지스트리에서 제거
- 별칭은 프로젝트명 기반 자동 생성 (수정 가능)

### 프로젝트 타입별 구분
```json
{
  "id": 3,
  "name": "auth-api",
  "alias": "auth",
  "path": "/Users/sunghwankim/projects/auth-api",
  "techStack": "nodejs-express",
  "type": "module",  // "main" 또는 "module"
  "status": "active",
  "lastModified": "2025-01-25"
}
```

## 🚀 프로젝트 시작 방법

### 1️⃣ 슬래시 명령어 (비개발자 친화적) ⭐
```
/start-project
```

#### 상세 실행 단계:

**1단계: 대화형 요구사항 수집**
- 프로젝트명 입력 요청
- 프로젝트 목적/설명 수집
- 주요 기능 리스트 수집

**2단계: 자동 기술스택 추천**
- 프로젝트별 기술스택 사용현황 파일 참조
- 사용자가 선택하거나 요구사항 기반으로 추천

**3단계: 프로젝트 구조 생성**
```
/Users/sunghwankim/projects/{프로젝트명}/
├── src/                    # 소스 코드
├── tests/                  # 테스트 코드
├── docs/                   # 프로젝트 문서
├── config/                 # 설정 파일
├── trouble-shooting/       # 문제 해결 가이드
├── scripts/                # 자동화 스크립트
├── .github/                # GitHub 설정
└── 기본 설정 파일들

선택적 폴더:
├── .claude/                # Claude 세션 관리 (필요시 생성)
    ├── session.json        # 세션 상태
    ├── context.md          # 작업 컨텍스트
    └── history/            # 세션 히스토리
```
*각 폴더별 정의는 프로젝트별 Rules 파일에 작성*

**4단계: 개발 포트 자동 할당**
- `~/.claude/port-registry.json` 확인 후 비어있는 포트 할당
- 프론트엔드: 3000-3099 범위
- 백엔드: 3100-3199 범위
- Mock 서버: 3200-3299 범위

**5단계: PROJECT_BLUEPRINT.yaml 작성 및 레지스트리 업데이트**
```yaml
projectName: {프로젝트명}
techStack: {선택된 스택}
development:
  ports:
    frontend: {할당된 포트}
    backend: {할당된 포트}
```
업데이트 파일들:
- `~/.claude/port-registry.json` - 포트 할당 정보
- `~/.claude/project-registry.json` - 프로젝트 정보 추가
  ```json
  {
    "id": {자동 증가},
    "name": "{프로젝트명}",
    "alias": "{자동 생성 별칭}",
    "path": "/Users/sunghwankim/projects/{프로젝트명}",
    "techStack": "{선택된 스택}",
    "status": "active",
    "lastModified": "{현재 날짜}"
  }
  ```

**6단계: 필수 문서 자동 생성**
프로젝트 루트:
- `{프로젝트명}_DEVELOPMENT_RULES.md` - 프로젝트별 개발 규칙
- `README.md` - 프로젝트 개요 및 시작 가이드

docs/ 폴더 (번호 체계):
- `docs/01_{프로젝트명}_REQUIREMENTS.md` - 요구기능 정의서
- `docs/02_{프로젝트명}_DEV_ROADMAP.md` - 개발 로드맵
- `docs/03_{프로젝트명}_ARCHITECTURE.md` - 아키텍처 설계서
- `docs/04_{프로젝트명}_API_SPEC.md` - API 명세서
- `docs/05_{프로젝트명}_DATABASE_SCHEMA.md` - DB 스키마 설계서
- `docs/06_{프로젝트명}_DEPLOYMENT_GUIDE.md` - 배포 가이드

📝 **문서 작성 가이드**: `~/.claude/templates/docs/` 폴더의 템플릿 참조
- `01_REQUIREMENTS_TEMPLATE.md`
- `02_DEV_ROADMAP_TEMPLATE.md`
- `03_ARCHITECTURE_TEMPLATE.md`
- `04_API_SPEC_TEMPLATE.md`
- `05_DATABASE_SCHEMA_TEMPLATE.md`
- `06_DEPLOYMENT_GUIDE_TEMPLATE.md`
- `DEVELOPMENT_RULES_TEMPLATE.md`

**7단계: 서비스 연동 작업 자동 추가**
DEV_ROADMAP에 자동 추가:
```markdown
## Group Setup: 서비스 연동 @ Main_Session

[ ] [SETUP001] GitHub 저장소 생성 및 연결 >> .git, remote origin ~ 없음 @ Main_Session # 30m
[ ] [SETUP002] Vercel 배포 연결 >> vercel.json, 환경 변수 ~ [SETUP001] @ Main_Session # 45m
[ ] [SETUP003] Supabase 프로젝트 생성 >> .env.local, 데이터베이스 URL ~ 없음 @ Main_Session # 1h
```

**8단계: 세션 상태 저장**
`.claude/session.json` 파일에 저장:
```json
{
  "projectName": "{프로젝트명}",
  "currentPhase": "Phase 1",
  "completedTasks": [],
  "nextSteps": ["SETUP001", "SETUP002"],
  "techStack": "{선택된 스택}",
  "lastModified": "{현재 시간}"
}
```

**9단계: TDD(Test-Driven Development) 전략 분석 및 추천**

프로젝트 특성 분석 후 적합한 테스트 전략 추천:

```
프로젝트 분석 결과:
- 프로젝트 타입: {웹앱/API/라이브러리/프로토타입}
- 예상 규모: {소규모/중규모/대규모}
- 복잡도: {단순/보통/복잡}
- 팀 규모: {개인/소규모/대규모}

추천 테스트 전략: {분석 기반 추천}

테스트 전략을 선택하세요:

1. 전면 TDD 적용
   - 모든 기능을 테스트 우선으로 개발
   - 엔터프라이즈/금융/의료 프로젝트 적합

2. 핵심 기능만 TDD (추천) ⭐
   - 비즈니스 로직, API, 중요 계산 등
   - 대부분의 프로젝트에 적합

3. TDD 미적용
   - MVP, 프로토타입, PoC
   - 빠른 검증이 목적인 경우
```

**추천 기준:**
- 프로토타입/MVP → TDD 미적용 추천
- 일반 웹앱 → 핵심 기능만 TDD 추천  
- API 서버 → 전면 TDD 추천
- 라이브러리 → 전면 TDD 추천
- 엔터프라이즈 → 전면 TDD 추천

선택에 따른 자동 설정:
- **전면 TDD**: tests/ 폴더 구조 완성, 모든 작업에 테스트 우선
- **부분 TDD**: REQUIREMENTS.md에 [TDD] 마커, 해당 기능 테스트 우선
- **TDD 미적용**: DEVELOPMENT_RULES.md에 추후 전환 가이드 포함

**10단계: 환경 격리 설정**
- Node.js 프로젝트: `.nvmrc` 파일 생성
- Python 프로젝트: `venv` 생성 및 `requirements.txt` 준비

**11단계: 완료 메시지 및 다음 단계 안내**
```
✅ 프로젝트 생성 완료: {프로젝트명}

생성된 위치: /Users/sunghwankim/projects/{프로젝트명}
기술스택: {선택된 스택}
할당된 포트: Frontend {포트}, Backend {포트}

🚀 다음 단계:
1. cd /Users/sunghwankim/projects/{프로젝트명}
2. npm install (또는 pip install -r requirements.txt)
3. 개발 시작: npm run dev

💡 작업 이어하기: /continue-session
```

### 2️⃣ CLI 명령어 (개발자용)
```bash
claude-create [프로젝트명] --stack [기술스택]
claude-create my-app --stack nextjs-supabase
```

## 📋 주요 슬래시 명령어

### 프로젝트 관리
- `/start-project` - 프로젝트 시작 마법사 (메인 프로젝트)
- `/start-module` - 모듈/API 프로젝트 생성 (모듈 프로젝트)
- `/continue-session` - 이전 작업 이어하기
- `/add-feature` - 기능 추가 워크플로우
- `/deploy-guide` - 배포 가이드 실행

### 작업 관리 (task-)
- `/task-complete` - 현재 작업 완료 처리 (테스트 → DEV_ROADMAP 업데이트 → 선택지 제공)
- `/task-test` - 현재 작업의 테스트 실행
- `/task-push` - Git 푸시 및 다음 작업 추천
- `/task-status` - DEV_ROADMAP 작업 현황 표시
- `/task-hold` - 작업 중단 및 컨텍스트 저장
  - `.claude/context.md`에 현재 상태 기록
  - DEV_ROADMAP에 `[~]` hold 상태 표시
  - 다음 재개를 위한 정보 저장
- `/task-continue` - 중단된 작업 재개
  - context.md와 DEV_ROADMAP 확인
  - `[~]` 상태의 작업 찾아서 이어가기

### 환경/문서
- `/update-docs` - 변경사항에 따른 문서 일괄 업데이트
- `/check-ports` - 프로젝트 할당 포트 정보 확인
- `/check-env` - 환경변수 설정 상태 확인 (민감정보는 마스킹)

## 🏗️ 표준 프로젝트 구조
```
project/
├── src/                         # 소스 코드
│   ├── components/              # UI 컴포넌트
│   ├── services/                # 비즈니스 로직
│   ├── utils/                   # 유틸리티
│   └── types/                   # 타입 정의
├── tests/                       # 테스트 코드
│   ├── unit/                    # 단위 테스트
│   ├── integration/             # 통합 테스트
│   └── e2e/                     # E2E 테스트
├── docs/                        # 프로젝트 문서 (필수 문서 구조)
│   ├── 01_{프로젝트명}_REQUIREMENTS.md       # 요구기능 정의서
│   ├── 02_{프로젝트명}_DEV_ROADMAP.md        # 개발 로드맵 (진행 상황 추적)
│   ├── 03_{프로젝트명}_ARCHITECTURE.md       # 아키텍처 설계서
│   ├── 04_{프로젝트명}_API_SPEC.md           # API 명세서
│   ├── 05_{프로젝트명}_DATABASE_SCHEMA.md    # DB 스키마 설계서
│   ├── 06_{프로젝트명}_DEPLOYMENT_GUIDE.md   # 배포 가이드
│   ├── 99_{프로젝트명}_CHANGELOG.md          # 변경 이력
│   └── daily/                                 # 일일 리포트 (자동 생성)
├── config/                      # 설정 파일
│   ├── eslint/                  # ESLint 설정
│   ├── prettier/                # Prettier 설정
│   └── jest/                    # Jest 설정
├── scripts/                     # 자동화 스크립트
│   ├── setup.sh                 # 환경 설정
│   ├── test.sh                  # 테스트 실행
│   └── deploy.sh                # 배포 스크립트
├── .github/                     # GitHub 설정
│   └── workflows/               # CI/CD 워크플로우
├── PROJECT_BLUEPRINT.yaml       # 프로젝트 설계서
├── package.json                 # 의존성 관리
├── tsconfig.json                # TypeScript 설정
├── .env.example                 # 환경 변수 예시
└── README.md                    # 프로젝트 설명
```

## 🛠️ 기술스택 템플릿

### 프로젝트별 기술스택 사용 현황
`~/.claude/tech-stack-registry.json` 파일에서 관리되며, 현재 진행 중인 프로젝트들의 기술스택을 참조하여 추천합니다.

### 자주 사용되는 조합
1. **nextjs-supabase** - 풀스택 웹 애플리케이션
2. **react-fastapi** - 프론트엔드/백엔드 분리
3. **nextjs-notion** - CMS 기반 웹사이트
4. **vue-django** - 엔터프라이즈 애플리케이션

### 커스텀 스택
`/start-project` 실행 시 새로운 조합 생성 가능

## 📊 세션 관리 체계

### 세션 상태 저장
```json
{
  "projectName": "프로젝트명",
  "currentPhase": "Phase 2",
  "completedTasks": [...],
  "nextSteps": [...],
  "techStack": "nextjs-supabase",
  "lastModified": "2025-01-22T10:00:00Z"
}
```

### 세션 복원
```bash
# 마지막 세션 복원
claude restore-session

# 특정 날짜 세션 복원
claude restore-session --date 2025-01-20
```

## 📖 프로젝트별 자동 참고 문서

프로젝트 작업 시작 시 Claude가 자동으로 참고하는 문서:
1. **`PROJECT_BLUEPRINT.yaml`** - 프로젝트 전체 설계 (있는 경우)
2. **`{프로젝트명}_DEVELOPMENT_RULES.md`** - 프로젝트별 개발 규칙
3. **`.claude/context.md`** - 현재 작업 컨텍스트 (있는 경우)

작업 유형별 추가 참고:
- 기능 개발 시: `docs/01_*_REQUIREMENTS.md`
- 작업 진행 시: `docs/02_*_DEV_ROADMAP.md`
- API 작업 시: `docs/04_*_API_SPEC.md`
- DB 작업 시: `docs/05_*_DATABASE_SCHEMA.md`

## 🤝 협업 기능

### 1. 컨텍스트 공유
- `.claude/context.md` 파일로 프로젝트 상태 공유
- 팀원 간 작업 인계 시 활용

### 2. 명확한 의도 전달
- 작업 시작 시 목표 명시
- 진행 상황 TodoWrite로 추적
- 완료 시 다음 단계 명시

### 3. 코드 리뷰 지원
- PR 생성 시 자동 요약
- 변경사항 영향도 분석
- 테스트 커버리지 확인

## ✅ 코딩 컨벤션

### 자동화 도구
```bash
# ESLint + Prettier 설정
npm run setup:lint

# Pre-commit hooks 설정
npm run setup:hooks
```

### 기본 규칙
- TypeScript strict mode 사용
- 함수형 프로그래밍 우선
- 명확한 타입 정의
- 의미있는 변수명 사용

### Git 푸시 전 필수 체크리스트
- **Python 프로젝트**: `pip freeze > requirements.txt` 실행하여 의존성 최신화
- **Node.js 프로젝트**: package-lock.json 커밋 확인
- **환경 변수**: .env 파일이 .gitignore에 포함되었는지 확인
- **테스트 실행**: 기본 테스트가 통과하는지 확인

## 🧪 테스트 전략

### 테스트 레벨
1. **단위 테스트**: 개별 함수/컴포넌트
2. **통합 테스트**: 모듈 간 상호작용
3. **E2E 테스트**: 사용자 시나리오

### 커버리지 목표
- 핵심 비즈니스 로직: 90% 이상
- UI 컴포넌트: 70% 이상
- 유틸리티 함수: 100%

## 🚀 배포 프로세스

### 환경별 배포
```bash
# 개발 환경
npm run deploy:dev

# 스테이징 환경
npm run deploy:staging

# 프로덕션 환경
npm run deploy:prod
```

### CI/CD 파이프라인
- GitHub Actions 기본 설정
- 자동 테스트 실행
- 환경별 자동 배포

## 🔗 서비스 연동 자동화

### 프로젝트 생성 시 자동 감지 및 작업 추가
프로젝트의 기술스택과 설정에 따라 다음 서비스 연동 작업이 자동으로 DEV_ROADMAP에 추가됩니다:

#### 1. **필수 연동 서비스** (자동 감지)
```yaml
GitHub:
  조건: 모든 프로젝트
  작업: [SETUP001] GitHub 저장소 생성 및 연결
  
Vercel/Netlify:
  조건: 웹 프로젝트 (Next.js, React, Vue 등)
  작업: [SETUP002] 배포 플랫폼 연결 및 환경 변수 설정

Supabase:
  조건: nextjs-supabase 스택
  작업: [SETUP003] Supabase 프로젝트 생성 및 키 설정

Firebase:
  조건: firebase 포함 스택
  작업: [SETUP004] Firebase 프로젝트 생성 및 SDK 설정

AWS:
  조건: aws 관련 서비스 사용
  작업: [SETUP005] AWS 계정 연동 및 IAM 설정
```

#### 2. **선택적 연동 서비스** (필요시 추가)
```yaml
Google APIs:
  조건: Google Maps, OAuth 등 사용
  작업: [SETUP006] Google Cloud Console 프로젝트 설정

Stripe/PayPal:
  조건: 결제 기능 포함
  작업: [SETUP007] 결제 서비스 연동 및 웹훅 설정

SendGrid/Mailgun:
  조건: 이메일 발송 기능
  작업: [SETUP008] 이메일 서비스 API 설정

Cloudflare:
  조건: CDN, 이미지 최적화 사용
  작업: [SETUP009] Cloudflare 계정 연동 및 도메인 설정

Analytics:
  조건: 분석 도구 사용
  작업: [SETUP010] Google Analytics/Mixpanel 설정
```

#### 3. **DEV_ROADMAP 자동 추가 형식**
```markdown
## Group Setup: 서비스 연동 @ Main_Session

[x] [SETUP001] GitHub 저장소 생성 및 연결 >> .git, remote origin ~ 없음 @ Main_Session # 30m
[ ] [SETUP002] Vercel 배포 연결 >> vercel.json, 환경 변수 ~ [SETUP001] @ Main_Session # 45m
[ ] [SETUP003] Supabase 프로젝트 생성 >> .env.local, 데이터베이스 URL ~ 없음 @ Main_Session # 1h
```

### 연동 작업 자동화 규칙
1. **우선순위**: Setup 그룹은 항상 최상위 우선순위
2. **의존성**: GitHub 연동이 완료되어야 배포 플랫폼 연동 가능
3. **병렬 작업**: 독립적인 서비스는 동시 진행 가능
4. **검증**: 각 연동 완료 시 자동 테스트 포함

## 💡 토큰 효율성 전략

### 1. 컨텍스트 최적화
- 큰 파일은 요약본 사용
- 반복 내용은 참조로 대체
- 세션 상태로 히스토리 관리

### 2. 템플릿 활용
- 공통 코드는 템플릿화
- 설정 파일 재사용
- 표준 구조 준수

### 3. 점진적 로딩
- 필요한 부분만 읽기
- 큰 변경은 단계별 진행
- 효율적인 검색 활용

## 🔧 주요 가이드 링크
- [프로젝트 관리 가이드](~/.claude/guides/project-management.md)
- [세션 관리 가이드](~/.claude/guides/session-management.md)
- [협업 가이드](~/.claude/guides/collaboration.md)
- [테스트 전략](~/.claude/guides/testing-strategy.md)
- [배포 가이드](~/.claude/guides/deployment.md)

## 📄 필수 프로젝트 문서 표준

### ⚠️ 중요: 문서 생성 시 프로젝트명을 포함한 파일명 사용!

프로젝트 생성 시 다음 문서들을 **반드시** 생성하며, **프로젝트명을 포함한 파일명**을 사용해야 합니다:

1. **`01_{프로젝트명}_REQUIREMENTS.md`** - 요구기능 정의서
   - 모든 개발 요구사항의 단일 진실 공급원
   - 기능별 ID 체계 사용 (예: USER_MGMT_01)
   - 개발 단계별 분류

2. **`02_{프로젝트명}_DEV_ROADMAP.md`** - 개발 로드맵
   - 구조화된 작업 정의 형식 사용
   - 실시간 진행 상황 추적
   - 멀티 세션 작업 할당 관리
   - 의존성 기반 작업 순서 자동화

3. **`03_{프로젝트명}_ARCHITECTURE.md`** - 아키텍처 설계서
   - 시스템 구조 다이어그램
   - 기술스택 상세 설명
   - 모듈 간 의존성

4. **`04_{프로젝트명}_API_SPEC.md`** - API 명세서
   - RESTful API 엔드포인트
   - 요청/응답 형식
   - 에러 코드 정의

5. **`05_{프로젝트명}_DATABASE_SCHEMA.md`** - DB 스키마 설계서
   - 테이블 구조
   - 관계 정의
   - 인덱스 전략

### 예시 (프로젝트명: my-shopping-mall)
```
my-shopping-mall/
├── my-shopping-mall_DEVELOPMENT_RULES.md
├── README.md
└── docs/
    ├── 01_my-shopping-mall_REQUIREMENTS.md
    ├── 02_my-shopping-mall_DEV_ROADMAP.md
    ├── 03_my-shopping-mall_ARCHITECTURE.md
    ├── 04_my-shopping-mall_API_SPEC.md
    ├── 05_my-shopping-mall_DATABASE_SCHEMA.md
    └── 06_my-shopping-mall_DEPLOYMENT_GUIDE.md
```

### 📝 문서 생성 규칙
- **숫자 prefix 필수**: 01_, 02_ 형식 사용
- **대문자와 언더스코어**: 단어 구분은 언더스코어 사용
- **확장자**: 모든 문서는 `.md` 확장자
- **위치**: 모든 문서는 `docs/` 폴더에 저장
- **인코딩**: UTF-8 사용

### 🚨 주의사항
- 위 파일명을 **변경하지 마세요**
- 다른 이름으로 생성하면 자동화 도구가 인식하지 못합니다
- 여러 프로젝트 간 일관성을 위해 반드시 준수해주세요

## 📋 구조화된 작업 정의 방식

### 작업 정의 형식
```
[상태] [ID] 작업명 >> 산출물 ~ 의존성 @ 담당 # 예상시간
```

### 형식 설명
- **상태**: `[ ]` 대기 | `[-]` 진행중 | `[x]` 완료 | `[!]` 블로킹 | `[~]` 보류(hold)
- **ID**: `[도메인-번호]` 형식 (예: API001, DB001, UI001)
- **작업명**: 수행할 작업의 명확한 설명
- **산출물**: `>> 구체적인 파일/엔드포인트/기능`
- **의존성**: `~ [의존ID,의존ID2]` 또는 `~ 없음`
- **담당**: `@ Session_X` 또는 `@ 미할당`
- **예상시간**: `# 30m`, `# 1h`, `# 2h` 등

### 작업 ID 도메인
- **DB**: 데이터베이스 관련 작업
- **API**: API 엔드포인트 개발
- **UI**: 프론트엔드 컴포넌트
- **AUTH**: 인증/권한 관련
- **TEST**: 테스트 작성
- **DOC**: 문서화 작업
- **DEPLOY**: 배포 관련
- **FIX**: 버그 수정

### 예시
```
[ ] [API001] 업체 CRUD 구현 >> /api/businesses 엔드포인트 ~ [DB002] @ 미할당 # 2h
[-] [UI001] Button 컴포넌트 >> src/components/Button.tsx ~ 없음 @ Session_1 # 1h
[x] [DB001] 사용자 테이블 설계 >> users 테이블 스키마 ~ 없음 @ Session_2 # 30m
[!] [API003] 리뷰 API >> /api/reviews 엔드포인트 ~ [DB003] @ Session_3 # 2h
```

### 멀티 세션 작업 할당 전략
1. **독립 작업 우선**: 의존성이 없는 작업을 우선 배치
2. **도메인별 그룹화**: 같은 도메인 작업은 같은 세션에 할당
3. **충돌 방지**: 같은 파일/폴더 작업은 다른 세션에 분산
4. **의존성 체인**: 순차적 작업은 완료 시점을 고려하여 할당

## 🎯 개발 작업 프로세스

### 1️⃣ 작업 시작 원칙
- **태스크 할당 필수**: DEV_ROADMAP에서 태스크를 선택하여 할당받고 시작
- **태스크 없을 시**: 기능 추가 형태로 진행
  - 관련 문서(REQUIREMENTS, API_SPEC 등) 업데이트
  - 변경사항과 영향도 명시

### 2️⃣ 작업 완료 프로세스
1. **내부 테스트 실행**
   - 단위 테스트
   - 통합 테스트 (해당 시)
   - 수동 테스트

2. **DEV_ROADMAP 업데이트**
   - 작업 상태를 `[x]` 완료로 변경
   - 실제 소요 시간 기록

3. **선택지 제공**
   ```
   ✅ 작업 완료: [API001] 사용자 인증 API
   
   다음 단계를 선택하세요:
   1. GitHub에 푸시 (git push)
   2. 다음 작업 진행
   ```

### 3️⃣ 다음 작업 추천 기준
작업 추천 시 다음 형식으로 제공:
```
📋 가능한 작업:

1. [UI001] 로그인 폼 구현
   - 📝 설명: 사용자 로그인을 위한 폼 컴포넌트 개발, 유효성 검사 포함
   - 📂 작업 위치: /src/components/auth/LoginForm.tsx, 스타일 파일 포함
   - ⏱️ 예상 시간: 2h
   - 🔗 의존성: [API001] 사용자 인증 API (✅ 완료됨)
   - 💡 추천 이유: API가 완료되어 바로 진행 가능, 다른 인증 UI의 기반이 됨

2. [TEST001] 인증 API 테스트 작성
   - 📝 설명: 로그인, 로그아웃, 토큰 갱신 등 인증 API 전체 테스트
   - 📂 작업 위치: /tests/api/auth.test.ts, 목업 데이터 포함
   - ⏱️ 예상 시간: 1h
   - 🔗 의존성: [API001] 사용자 인증 API (✅ 완료됨)
   - 💡 추천 이유: 방금 완료한 API의 안정성 보장, TDD 적용 프로젝트

3. [DB003] 사용자 프로필 테이블 설계
   - 📝 설명: 프로필 정보, 설정, 선호도 등을 저장할 테이블 스키마 설계
   - 📂 작업 위치: /prisma/schema.prisma, 마이그레이션 파일
   - ⏱️ 예상 시간: 1.5h
   - 🔗 의존성: [DB001] 사용자 기본 테이블 (✅ 완료됨)
   - 💡 추천 이유: 독립적 작업, 다음 API 개발의 선행 작업
```

**추천 우선순위**:
1. 방금 완료한 작업과 연관된 작업
2. 의존성이 해결되어 바로 시작 가능한 작업
3. 다른 작업의 블로커가 되는 작업
4. 예상 시간이 짧은 작업 (빠른 성과)

## 🔴 작업 완료 및 세션 종료 규칙

### ⚠️ 중요: 하나의 작업 완료 시 세션 종료
멀티 세션 환경에서 충돌을 방지하고 효율적인 작업 관리를 위해:

1. **단일 작업 원칙**: 한 세션은 하나의 작업(Task ID)만 수행
2. **작업 완료 시**:
   - DEV_ROADMAP.md에서 해당 작업을 `[x]` 완료 상태로 변경
   - 완료 시간과 실제 소요 시간 기록
   - 다음 가능한 작업 제안
   - **세션 종료 메시지 표시**

### 세션 종료 메시지 예시
```
✅ 작업 완료: [UI001] Button 컴포넌트

완료 내역:
- 생성 파일: src/components/Button.tsx
- 테스트 파일: tests/components/Button.test.tsx
- 소요 시간: 45분 (예상: 1시간)

🏁 현재 세션을 종료합니다.

💡 다음 작업을 시작하려면:
새로운 대화에서 `/continue-session` 명령어를 사용하세요.

가능한 다음 작업:
- [UI002] Input 컴포넌트 (독립 작업)
- [TEST001] Button 테스트 작성 (UI001 의존)
```

### 세션 종료가 필요한 이유
1. **명확한 작업 구분**: 각 세션의 작업 범위가 명확
2. **충돌 방지**: 다른 세션이 관련 파일 작업 가능
3. **진행 상황 추적**: 작업별 소요 시간 정확히 측정
4. **컨텍스트 관리**: 불필요한 컨텍스트 누적 방지

## 🧊 프로젝트 환경 격리

### Node.js 프로젝트
- **nvm 사용**: 각 프로젝트별 Node.js 버전 관리
- **.nvmrc 파일**: 프로젝트 루트에 Node 버전 명시
- **독립된 node_modules**: 프로젝트별 의존성 격리

### Python 프로젝트
- **venv 자동 생성**: `python -m venv venv`
- **requirements.txt**: 의존성 목록 관리
- **활성화 명령**: `source venv/bin/activate` (macOS/Linux)

### 환경 격리 이점
1. **버전 충돌 방지**: 프로젝트별 다른 런타임 버전 사용 가능
2. **의존성 격리**: 프로젝트 간 패키지 버전 충돌 없음
3. **재현 가능한 환경**: 팀원 간 동일한 개발 환경 보장

## 🔌 포트 할당 시스템

### 자동 포트 할당
프로젝트 생성 시 자동으로 사용 가능한 포트를 할당합니다:
- **프론트엔드**: 3000-3099 범위
- **백엔드 API**: 3100-3199 범위
- **Mock 서버**: 3200-3299 범위
- **WebSocket**: 3300-3399 범위

### 포트 레지스트리
`~/.claude/port-registry.json`에서 전체 포트 할당 현황을 관리합니다.

### PROJECT_BLUEPRINT.yaml의 포트 정보
```yaml
development:
  ports:
    frontend: 3001  # 자동 할당됨
    backend: 3101   # 자동 할당됨
    mockServer: 3201 # 자동 할당됨
```

### 포트 충돌 방지
- 프로젝트 생성 시 사용 중인 포트 자동 스킵
- 각 프로젝트별 고유 포트 보장
- 프로젝트 삭제 시 포트 자동 해제

## 📞 도움말 및 지원
- 프로젝트 시작: `/start-project`
- 세션 복원: `/continue-session`
- 문제 해결: `~/.claude/guides/troubleshooting.md`


## 에러율을 낮추고 작업의 일관성을 유지하기 위한 작업
  1. ✅ Frontend ESLint/Prettier - 코드 스타일 자동 검사 및 포맷팅
  2. ✅ Backend Black/Flake8 - Python 코드 포맷팅 및 린트
  3. ✅ Pre-commit hooks - 커밋 전 자동 코드 검사
  4. ✅ VS Code 설정 - 저장 시 자동 포맷팅
  5. ✅ Makefile - 명령어 자동화
