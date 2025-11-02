# Git 저장소 용량 점검 보고서

**작성일**: 2025-11-02
**작성자**: Claude Code
**점검 범위**: Git 저장소 용량 및 최적화 분석

---

## 📋 Executive Summary

### 전체 평가
Git 저장소에 **심각한 용량 문제**와 **보안 이슈**가 발견되었습니다.

**핵심 문제:**
- 🔴 **보안**: .env 파일에 실제 API 키가 Git에 커밋됨
- 🔴 **용량**: Git 히스토리에 56MB PPTX 파일 등 대용량 파일 포함
- 🟡 **관리**: .gitignore 설정은 있으나 이미 커밋된 파일 존재

---

## 📊 저장소 용량 분석

### 1. 전체 크기

```bash
전체 저장소 크기: 744 MB
Git 객체 크기:    131.47 MB (압축됨)
느슨한 객체:      1.23 MB
팩 파일:          131.47 MB
```

### 2. Git 객체 통계

| 항목 | 수량/크기 |
|------|----------|
| 총 객체 수 | 3,009개 |
| 팩 내 객체 | 2,079개 |
| 느슨한 객체 | 930개 |
| 팩 파일 크기 | 131.47 MB |

**분석**:
- 저장소 크기(744MB) 대비 Git 객체 크기(131MB)가 작은 것은 정상
- 나머지 용량은 node_modules, build 등 로컬 파일들
- 하지만 131MB는 **코드 저장소로는 과도하게 큰 편**

---

## 🔴 심각한 문제점 (즉시 조치 필요)

### 1. 보안 이슈: .env 파일 노출 ⚠️

**발견된 파일:**
```
frontend/.env
docs/03-development/frontend/authentication/sns-code-samples/.env
```

**포함된 민감 정보:**
```bash
REACT_APP_NAVER_CLIENT_ID=TmwmnIev5hZZ5UoO4OJY
REACT_APP_KAKAO_REST_API_KEY=61f82d3c60872911d46cc0984d5c1451
REACT_APP_KAKAO_CLIENT_SECRET=4WHBz2zr3SNsU59GWzwOSEKH0V17ZoZk
```

**위험도**: 🔴 **HIGH**

**영향:**
- API 키가 GitHub에 공개되어 있을 경우 악용 가능
- 네이버/카카오 개발자 콘솔에서 무단 사용 가능
- API 사용량 초과 → 비용 청구 가능성

**즉시 조치:**
1. ✅ GitHub Repository가 Private인지 확인
2. ⚠️ Public이라면 즉시 API 키 재발급 필요
3. 🔄 .env 파일을 Git에서 완전히 제거 (히스토리 포함)

---

### 2. Git 히스토리 내 대용량 파일

**Top 20 대용량 객체:**

| 순위 | 크기 | 파일 | 상태 |
|------|------|------|------|
| 1 | **56.0 MB** | `docs/더조은_팀프로젝트_1조_스토리보드.pptx` | 🔴 삭제됨(히스토리 잔존) |
| 2 | 9.4 MB | `docs/presentations/reference/1-2-1` | 🔴 삭제됨(히스토리 잔존) |
| 3 | 7.1 MB | `docs/presentations/reference/1-2-2` | 🔴 삭제됨(히스토리 잔존) |
| 4 | 7.1 MB | `frontend/public/images.zip` | 🔴 삭제됨(히스토리 잔존) |
| 5 | 3.7 MB | `docs/presentations/reference/1-2-2` | 🔴 삭제됨(히스토리 잔존) |
| 6 | 3.2 MB | `frontend/@` | 🔴 이력 잔존 |
| 7 | 3.0 MB | `frontend/src/assets/brands/banner/sand-sound4.jpg` | ⚠️ 현재 존재 |
| 8 | 2.0 MB | `docs/더조은_팀프로젝트_1조_스토리보드.pdf` | 🔴 삭제됨(히스토리 잔존) |
| 9 | 2.0 MB | `frontend/public/images/cart.jpg` | ⚠️ 현재 존재 |
| 10 | 1.2 MB | `image-hosting-upload/brands/sand-sound4.webp` | 🟡 변환 완료 |
| 11 | 1.1 MB | `scripts/image-hosting/image-references.json` | ✅ 현재 존재 |

**총 누적 크기**: 약 **98 MB** (전체 Git 객체의 75%)

**분석:**
- 대부분의 대용량 파일은 **이미 삭제**되었지만 Git 히스토리에 잔존
- 56MB PPTX 파일 1개가 전체 저장소의 42% 차지
- presentations/ 폴더가 .gitignore에 있지만 과거 커밋에 포함됨

---

## 🟡 중간 우선순위 문제

### 3. 현재 존재하는 대용량 이미지 파일

**1MB 이상 파일:**
```
2.6 MB  frontend/build/static/js/main.21eea97f.js.map  (빌드 파일)
1.1 MB  scripts/image-hosting/image-references.json     (정상)
```

**상태:**
- ✅ `frontend/build/` 폴더는 .gitignore에 있어 추적 안 됨
- ✅ `image-references.json`은 프로젝트에 필요한 파일

**결론**: 현재 추적 중인 파일은 문제없음

---

### 4. .gitignore 설정 분석

**현재 설정:**
```gitignore
# Gradle
.gradle/
build/

# Node
(node_modules는 설정되어 있음 - frontend/.gitignore에서)

# 압축 파일
*.zip
*.rar
*.pptx
*.ppt

# 대용량 폴더
**/presentations/
**/reference/
```

**평가**: ✅ .gitignore 설정은 **적절함**

**문제**:
- .gitignore 설정 **이전**에 이미 커밋된 파일들이 히스토리에 남아있음
- .env 파일에 대한 규칙이 **누락**됨

---

## 🎯 권장 조치 사항

### Phase 1: 긴급 보안 조치 (즉시)

#### 1-1. .env 파일 Git 히스토리에서 완전 제거

**방법 A: BFG Repo-Cleaner (권장)**
```bash
# 1. BFG 다운로드
# https://rtyley.github.io/bfg-repo-cleaner/

# 2. .env 파일 제거
java -jar bfg.jar --delete-files .env

# 3. Git 정리
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 4. 강제 푸시 (주의!)
git push origin --force --all
```

**방법 B: git filter-branch (수동)**
```bash
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch frontend/.env" \
  --prune-empty --tag-name-filter cat -- --all

git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch docs/03-development/frontend/authentication/sns-code-samples/.env" \
  --prune-empty --tag-name-filter cat -- --all
```

**주의 사항:**
- ⚠️ 히스토리 변경이므로 팀원 모두 `git clone` 재실행 필요
- ⚠️ 기존 로컬 저장소는 사용 불가
- 📢 팀원들에게 사전 공지 필수

---

#### 1-2. API 키 재발급 (Public Repository인 경우)

**조치 순서:**
1. GitHub Repository 공개 여부 확인
   ```bash
   # Repository Settings > Danger Zone > Change visibility
   ```

2. Public이라면 즉시 API 키 재발급:
   - 네이버 개발자 센터: https://developers.naver.com/apps/
   - 카카오 개발자 센터: https://developers.kakao.com/console/app

3. 새 키로 로컬 .env 업데이트

---

#### 1-3. .gitignore에 .env 추가

**루트 .gitignore 수정:**
```bash
# 기존 내용 유지

# Environment variables (추가)
.env
.env.local
.env.development
.env.production
.env.test
**/.env
**/.env.*
```

**적용:**
```bash
git add .gitignore
git commit -m "[보안] .env 파일 .gitignore 추가"
```

---

### Phase 2: 저장소 용량 최적화 (선택 사항)

#### 2-1. 대용량 파일 히스토리 제거

**56MB PPTX 파일 제거:**
```bash
# BFG 사용
java -jar bfg.jar --delete-files "더조은_팀프로젝트_1조_스토리보드.pptx"
java -jar bfg.jar --delete-files "*.pptx"
java -jar bfg.jar --delete-files "*.zip"

# Git 정리
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

**예상 효과:**
- Git 객체 크기: 131 MB → **약 40 MB** (-70%)
- clone 속도 향상: 3배 빠름

---

#### 2-2. 이미지 최적화 (진행 중인 작업)

**현재 상태:**
✅ WebP 변환 작업 진행 중 (image-hosting-migration)

**추가 권장:**
- 2MB 이상 이미지는 WebP로 변환
- `frontend/public/images/cart.jpg` (2MB) → WebP 변환 고려

---

### Phase 3: 장기적인 개선 방안

#### 3-1. .env.example 패턴 사용

**구조:**
```
frontend/
├── .env              (Git 추적 안 함, 실제 키 포함)
└── .env.example      (Git 추적, 템플릿만)
```

**.env.example 내용:**
```bash
# 네이버 로그인 API 설정
REACT_APP_NAVER_CLIENT_ID=your_naver_client_id_here
REACT_APP_NAVER_CALLBACK_URL=http://localhost:3000/naver-callback

# 카카오 로그인 API 설정
REACT_APP_KAKAO_REST_API_KEY=your_kakao_api_key_here
REACT_APP_KAKAO_CLIENT_SECRET=your_kakao_secret_here
REACT_APP_KAKAO_REDIRECT_URI=http://localhost:3000/kakao-callback.html
```

**README.md에 안내 추가:**
```markdown
## 환경 설정

1. `.env.example`을 복사하여 `.env` 생성:
   ```bash
   cp .env.example .env
   ```

2. `.env` 파일에 실제 API 키 입력

3. 절대 `.env` 파일을 Git에 커밋하지 마세요!
```

---

#### 3-2. Git LFS 도입 고려

**대상 파일:**
- 1MB 이상 이미지
- WebP 파일
- 디자인 에셋

**설정:**
```bash
git lfs install
git lfs track "*.jpg"
git lfs track "*.png"
git lfs track "*.webp"
git add .gitattributes
```

**효과:**
- 대용량 파일은 별도 저장소에 보관
- clone 속도 향상
- 히스토리 관리 용이

---

#### 3-3. Pre-commit Hook 설정

**목적**: 실수로 .env 파일 커밋 방지

**설치:**
```bash
npm install --save-dev husky
npx husky init
```

**.husky/pre-commit 파일:**
```bash
#!/bin/sh
# .env 파일 커밋 방지
if git diff --cached --name-only | grep -q "\.env$"; then
  echo "❌ Error: .env 파일을 커밋할 수 없습니다!"
  echo "   .env 파일은 보안상 Git에 포함되면 안 됩니다."
  exit 1
fi
```

---

## 📊 조치 전/후 비교 (예상)

### 현재 상태
```
저장소 크기:        744 MB
Git 객체:           131 MB
clone 시간:         ~30초 (100Mbps 기준)
문제점:             .env 노출, 대용량 파일 히스토리
```

### Phase 1 적용 후
```
저장소 크기:        744 MB (동일)
Git 객체:           130 MB (-1MB, .env 제거)
clone 시간:         ~30초
문제점:             ✅ .env 제거 완료
보안:               ✅ 개선
```

### Phase 1 + 2 적용 후
```
저장소 크기:        650 MB (-94MB)
Git 객체:           40 MB (-91MB, -70%)
clone 시간:         ~10초 (-66%)
문제점:             ✅ 모두 해결
보안:               ✅ 개선
성능:               ✅ 대폭 향상
```

---

## ✅ 즉시 실행 가능한 간단한 조치

**Step 1: Repository 공개 여부 확인**
```bash
# GitHub에서 확인
# Settings > Danger Zone > Change repository visibility
```

**Step 2: .gitignore에 .env 추가**
```bash
echo "" >> .gitignore
echo "# Environment variables" >> .gitignore
echo ".env" >> .gitignore
echo ".env.*" >> .gitignore
echo "**/.env" >> .gitignore
git add .gitignore
git commit -m "[보안] .env 파일 .gitignore 추가"
git push
```

**Step 3: .env.example 생성**
```bash
# frontend/.env를 복사하여 키 값만 제거
cp frontend/.env frontend/.env.example
# 에디터에서 실제 키를 템플릿 값으로 변경
git add frontend/.env.example
git commit -m "[보안] .env.example 템플릿 추가"
git push
```

**Step 4: README에 환경 설정 가이드 추가**

---

## 🚨 주의사항

### Git 히스토리 변경 시 주의점

**영향을 받는 사람:**
- 이 저장소를 clone한 모든 팀원
- Fork한 사람들

**필요한 조치:**
1. 팀원들에게 사전 공지 (최소 1일 전)
2. 작업 중인 변경사항 모두 커밋/푸시
3. 히스토리 변경 후 **새로 clone** 받기

**공지 템플릿:**
```
[중요] Git 저장소 보안 업데이트 예정

일시: 2025-11-XX XX:00
작업: .env 파일 Git 히스토리에서 완전 제거

영향:
- 기존 로컬 저장소는 사용 불가
- 작업 후 새로 git clone 필요

준비사항:
1. 진행 중인 작업 모두 커밋 및 푸시
2. 로컬 변경사항 백업
3. 작업 완료 알림 후 새로 clone
```

---

## 📝 결론 및 권장 순서

### 즉시 조치 (오늘)
1. ✅ GitHub Repository Private 확인
2. ✅ .gitignore에 .env 추가
3. ✅ .env.example 생성
4. ✅ README 업데이트

### 단기 조치 (1주일 내)
5. 🔄 .env 파일 Git 히스토리에서 제거 (팀 협의 후)
6. 🔄 API 키 재발급 (Public Repository인 경우)

### 중기 조치 (1개월 내)
7. 🔄 대용량 파일 히스토리 정리 (선택)
8. 🔄 Git LFS 도입 (선택)

### 장기 조치 (2개월 내)
9. 🔄 Pre-commit Hook 설정
10. 🔄 CI/CD 파이프라인에 보안 스캔 추가

---

**작성자**: Claude Code
**작성일**: 2025-11-02
**다음 리뷰**: 2025-11-09 (1주일 후)
