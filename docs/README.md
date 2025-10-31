# E-commerce Fullstack App - 프로젝트 문서

엔터프라이즈급 쇼핑몰 프로젝트의 전체 문서를 체계적으로 관리하는 문서 저장소입니다.

---

## 📑 문서 구조

### [01-project](./01-project/) - 프로젝트 정의

프로젝트의 요구사항과 설계 명세를 정의합니다.

- [requirements-specification.md](./01-project/requirements-specification.md) - 기능 명세서
- [database-design.md](./01-project/database-design.md) - 데이터베이스 설계서
- [ui-design-reference.md](./01-project/ui-design-reference.md) - UI/UX 설계 참조 (SSF Shop 벤치마킹)

### [02-architecture](./02-architecture/) - 아키텍처 & 설계

시스템 전체 아키텍처와 설계 문서를 포함합니다.

- [database-schema.md](./02-architecture/database-schema.md) - 데이터베이스 스키마 상세

**예정**:
- system-architecture.md - 시스템 아키텍처 개요
- backend-architecture.md - 백엔드 아키텍처 (Spring Boot)
- frontend-architecture.md - 프론트엔드 아키텍처 (React + Redux)

### [03-development](./03-development/) - 개발 가이드

실제 개발 과정에서 필요한 가이드와 설정을 제공합니다.

#### Setup - 환경 설정
- [git-strategy.md](./03-development/setup/git-strategy.md) - Git 브랜치 전략
- [initial-setup.md](./03-development/setup/initial-setup.md) - 초기 프로젝트 구조 설정

**예정**:
- development-environment.md - 개발 환경 설정 가이드

#### Backend - 백엔드 개발
- [rest-api.md](./03-development/backend/rest-api.md) - REST API 개발 가이드

**예정**:
- database-operations.md - 데이터베이스 작업 가이드

#### Frontend - 프론트엔드 개발
- [component-development.md](./03-development/frontend/component-development.md) - React 컴포넌트 개발 가이드
- [state-management.md](./03-development/frontend/state-management.md) - Redux Toolkit 상태 관리
- [api-integration.md](./03-development/frontend/api-integration.md) - API 연동 가이드

##### Authentication - 인증
- [sns-login-guide.md](./03-development/frontend/authentication/sns-login-guide.md) - SNS 소셜 로그인 가이드
- [sns-code-samples/](./03-development/frontend/authentication/sns-code-samples/) - SNS 로그인 코드 샘플

#### Testing - 테스트
- [e2e-testing.md](./03-development/testing/e2e-testing.md) - E2E 테스트 가이드
- [ui-ux-improvements.md](./03-development/testing/ui-ux-improvements.md) - UI/UX 개선 가이드

### [04-operations](./04-operations/) - 운영 & 배포

운영 환경 배포와 유지보수 관련 문서입니다.

- [git-repository-optimization.md](./04-operations/git-repository-optimization.md) - Git 저장소 최적화 작업
- [github-performance-analysis.md](./04-operations/github-performance-analysis.md) - GitHub 업로드 성능 분석

**예정**:
- deployment-guide.md - 배포 가이드 (프로덕션)
- maintenance.md - 유지보수 가이드

### [05-guides](./05-guides/) - 사용자 가이드

개발자와 고객을 위한 사용 가이드를 제공합니다.

- [developer-guide.md](./05-guides/developer-guide.md) - 개발자 가이드
- [customer-guide.md](./05-guides/customer-guide.md) - 고객 가이드
- [customer-manual.md](./05-guides/customer-manual.md) - 고객 사용 매뉴얼
- [webp-conversion-guide.md](./05-guides/webp-conversion-guide.md) - WebP 이미지 변환 가이드

### [06-changelog](./06-changelog/) - 변경 이력

프로젝트의 모든 변경 사항을 추적합니다.

#### Updates - 업데이트 기록
- [2025-10-28-update.md](./06-changelog/updates/2025-10-28-update.md) - 2025-10-28 업데이트
- [2025-10-30-session-management.md](./06-changelog/updates/2025-10-30-session-management.md) - 세션 관리 업데이트

#### Migrations - 마이그레이션 기록
- [2025-10-27-react-router-v7.md](./06-changelog/migrations/2025-10-27-react-router-v7.md) - React Router v7 마이그레이션
- [2025-10-27-duplicate-fix.md](./06-changelog/migrations/2025-10-27-duplicate-fix.md) - 중복 라우터 수정
- [2025-10-27-brand-logo.md](./06-changelog/migrations/2025-10-27-brand-logo.md) - 브랜드 로고 마이그레이션
- [2025-10-28-router-downgrade.md](./06-changelog/migrations/2025-10-28-router-downgrade.md) - React Router 다운그레이드
- [2025-10-29-router-v7-error.md](./06-changelog/migrations/2025-10-29-router-v7-error.md) - Router v7 에러 분석
- [2025-10-29-router-v7-success.md](./06-changelog/migrations/2025-10-29-router-v7-success.md) - Router v7 마이그레이션 성공
- [2025-10-29-git-nul-error.md](./06-changelog/migrations/2025-10-29-git-nul-error.md) - Git NUL 파일 에러 해결
- [2025-10-29-router-v7-cleanup.md](./06-changelog/migrations/2025-10-29-router-v7-cleanup.md) - Router v7 최종 정리

#### Refactoring - 리팩토링 기록
- [2025-10-30-file-cleanup.md](./06-changelog/refactoring/2025-10-30-file-cleanup.md) - 불필요한 파일 정리 (Phase 1)
- [2025-10-30-subcategory-backup.md](./06-changelog/refactoring/2025-10-30-subcategory-backup.md) - 서브카테고리 페이지 백업 (Phase 2)
- [2025-10-30-logic-fixes.md](./06-changelog/refactoring/2025-10-30-logic-fixes.md) - 로직 오류 수정 (Phase 3)

#### Standardization - 표준화 기록
- [image-file-standardization.md](./06-changelog/image-file-standardization.md) - 이미지 파일 명명 규칙 표준화 (2025-10-31)
- [2025-10-31-documentation-compliance-audit.md](./06-changelog/2025-10-31-documentation-compliance-audit.md) - 프로젝트 문서 준수 검사 및 개선

### [07-issues](./07-issues/) - 이슈 트래킹

발견된 버그와 이슈를 추적합니다.

#### Bugs - 버그 기록
- [2025-10-29-coupon-duplication.md](./07-issues/bugs/2025-10-29-coupon-duplication.md) - 쿠폰 중복 발급 이슈

### [assets](./assets/) - 문서 자산

문서에 사용되는 이미지와 첨부 파일을 보관합니다.

- [images/setup/](./assets/images/setup/) - 환경 설정 관련 이미지
- [sns-login-archive.zip](./assets/sns-login-archive.zip) - SNS 로그인 코드 아카이브

---

## 📝 문서 작성 규칙

### 파일명 규칙

1. **kebab-case 사용**: 소문자와 하이픈만 사용
   - 좋은 예: `requirements-specification.md`
   - 나쁜 예: `Requirements_Specification.md`, `requirementsSpecification.md`

2. **날짜 형식**: 변경 이력 문서는 `YYYY-MM-DD-description.md` 형식 사용
   - 예: `2025-10-30-logic-fixes.md`

3. **명확하고 간결한 이름**: 파일 이름만으로 내용을 파악할 수 있어야 함
   - 좋은 예: `sns-login-guide.md`
   - 나쁜 예: `guide.md`, `document1.md`

### 폴더 번호 규칙

1. **두 자리 숫자**: `01-`, `02-`, `03-` 형식으로 순서 명시
2. **논리적 순서**: 프로젝트 → 아키텍처 → 개발 → 운영 → 가이드 → 변경이력 → 이슈

### 문서 작성 가이드

1. **제목**: 문서 최상단에 `#` 제목 필수
2. **날짜**: 작성/수정 날짜 명시
3. **목차**: 복잡한 문서는 목차 포함
4. **코드 블록**: 코드는 언어 지정하여 작성 (````javascript`, ```java` 등)
5. **상호 참조**: 관련 문서는 상대 경로로 링크

---

## 🔍 빠른 찾기

### 신규 개발자 온보딩

1. [requirements-specification.md](./01-project/requirements-specification.md) - 프로젝트 기능 명세 확인
2. [git-strategy.md](./03-development/setup/git-strategy.md) - Git 브랜치 전략 숙지
3. [initial-setup.md](./03-development/setup/initial-setup.md) - 개발 환경 설정
4. [developer-guide.md](./05-guides/developer-guide.md) - 개발자 가이드 참고

### 프론트엔드 개발

- [component-development.md](./03-development/frontend/component-development.md) - 컴포넌트 개발
- [state-management.md](./03-development/frontend/state-management.md) - Redux 상태 관리
- [api-integration.md](./03-development/frontend/api-integration.md) - API 연동

### 백엔드 개발

- [rest-api.md](./03-development/backend/rest-api.md) - REST API 개발
- [database-schema.md](./02-architecture/database-schema.md) - DB 스키마 참조

### 최근 변경 사항

- [06-changelog/refactoring/](./06-changelog/refactoring/) - 최근 리팩토링 이력
- [06-changelog/migrations/](./06-changelog/migrations/) - 최근 마이그레이션 이력

---

## 📞 문의 및 기여

문서 개선 제안이나 오류 발견 시 GitHub Issues를 활용해주세요.

**최종 업데이트**: 2025-10-31
**문서 구조 버전**: 1.1.0 (Enterprise Edition)
