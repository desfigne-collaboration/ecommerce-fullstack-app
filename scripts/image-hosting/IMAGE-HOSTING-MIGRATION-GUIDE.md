# 이미지 호스팅 서버 전환 가이드

**작업 일시**: 2025-11-01
**담당자**: Claude Code
**프로젝트**: ecommerce-fullstack-app

---

## 📋 목차

1. [개요](#개요)
2. [현재 상태](#현재-상태)
3. [작업 단계](#작업-단계)
4. [업로드 가이드](#업로드-가이드)
5. [경로 변경 방법](#경로-변경-방법)
6. [검증 및 테스트](#검증-및-테스트)
7. [롤백 방법](#롤백-방법)
8. [참고 자료](#참고-자료)

---

## 개요

프로젝트의 모든 이미지 파일을 외부 호스팅 서버로 전환하기 위한 작업입니다.

### 작업 목적

- Git 저장소 용량 감소 (현재 19.3 MB)
- 이미지 로딩 성능 개선
- CDN 활용 가능

### 작업 범위

- **총 이미지 수**: 555개
- **총 용량**: 19.3 MB
- **수정 대상 파일**: 115개
- **총 참조 수**: 4,286개

---

## 현재 상태

### ✅ 완료된 작업

#### 1단계: 이미지 파일 전수조사 ✅
- 총 555개 이미지 파일 식별
- 파일 정보 수집 (경로, 크기, 해시)
- 산출물:
  - `image-inventory.csv`
  - `image-inventory.json`

#### 2단계: 이미지 분류 ✅
- 용도별 분류 완료
- 중복 파일 96개 식별
- 산출물:
  - `image-classification.json`
  - `image-classification-report.md`

**분류 결과**:
- 제품 이미지 (products): 333개
- 브랜드 관련 (brands): 147개
- 아이콘 (icons): 63개
- 문서 이미지 (docs): 11개
- 미분류 (uncategorized): 1개

#### 3단계: 통합 이미지 폴더 생성 ✅
- `images-for-hosting/` 폴더 생성
- 모든 이미지 복사 완료 (555개)
- 파일명 충돌 24개 자동 해결
- 산출물:
  - `images-for-hosting/` 폴더
  - `file-mapping.json`
  - `images-for-hosting/README.md`

#### 4단계: 이미지 참조 위치 전수조사 ✅
- 361개 파일 스캔
- 115개 파일에서 4,286개 참조 발견
- 산출물:
  - `image-references.json`
  - `image-references.csv`

#### 5단계: 경로 교체 스크립트 준비 ✅
- 자동 경로 교체 스크립트 작성
- 롤백 가이드 작성
- 산출물:
  - `replace-image-paths.js`
  - `ROLLBACK-GUIDE.md`

### 🔄 대기 중인 작업

#### 6단계: 이미지 업로드 (사용자 작업 필요)
- **작업 위치**: `images-for-hosting/` 폴더
- **업로드 대상**: 호스팅 서버 또는 CDN

#### 7단계: 경로 일괄 변경 (업로드 완료 후)
- 호스팅 서버 URL 확인 필요
- 스크립트 실행 대기 중

---

## 작업 단계

### 폴더 구조

```
images-for-hosting/
├── products/          # 333개 - 제품 이미지
├── brands/            # 147개 - 브랜드 로고/배너
├── icons/             # 63개 - 브랜드 아이콘
├── docs/              # 11개 - 문서용 이미지
├── uncategorized/     # 1개 - 기타
└── README.md          # 폴더 설명서
```

---

## 업로드 가이드

### 📤 업로드 방법

#### 옵션 1: AWS S3

1. **S3 버킷 생성**
   ```bash
   aws s3 mb s3://my-ecommerce-images
   ```

2. **폴더 업로드**
   ```bash
   aws s3 sync images-for-hosting/ s3://my-ecommerce-images/ --acl public-read
   ```

3. **CloudFront CDN 설정** (선택사항)

#### 옵션 2: 다른 CDN 서비스

- Cloudinary
- Imgix
- Vercel Blob
- Supabase Storage

#### 옵션 3: 자체 서버

1. 서버에 폴더 구조 그대로 업로드
2. CORS 설정 확인
3. 캐시 헤더 설정 권장

### 🌐 URL 구조 확인

업로드 후 다음 URL 구조를 확인하세요:

```
https://your-cdn.com/products/[파일명].webp
https://your-cdn.com/brands/[파일명].webp
https://your-cdn.com/icons/[파일명].webp
https://your-cdn.com/docs/[파일명].png
```

**예시**:
```
https://cdn.example.com/products/1010207927.webp
https://cdn.example.com/icons/brand_beaker.webp
```

---

## 경로 변경 방법

### 1. 호스팅 서버 URL 준비

업로드 후 기본 URL을 확인하세요.

**예시**:
- `https://cdn.example.com`
- `https://s3.amazonaws.com/my-bucket`
- `https://your-domain.com/static/images`

### 2. 경로 교체 스크립트 실행

```bash
node replace-image-paths.js https://your-cdn.com
```

**주의**:
- URL에 마지막 슬래시(/) 없이 입력
- 카테고리 폴더명은 자동으로 추가됨

### 3. 자동 처리 내용

스크립트가 자동으로:
- ✅ 모든 파일 백업 생성 (`backup-before-url-replacement/`)
- ✅ 115개 파일에서 4,286개 경로 교체
- ✅ 다양한 경로 형식 자동 인식
- ✅ 교체 로그 생성 (`replacement-log.json`)

### 4. 경로 교체 예시

**변경 전**:
```javascript
import logo from './frontend/public/images/brands/logo.webp';
<img src="/images/products/item.webp" />
background: url('./icons/brand_beaker.webp')
```

**변경 후**:
```javascript
import logo from 'https://cdn.example.com/brands/logo.webp';
<img src="https://cdn.example.com/products/item.webp" />
background: url('https://cdn.example.com/icons/brand_beaker.webp')
```

---

## 검증 및 테스트

### 1. 로컬 테스트

```bash
cd frontend
npm start
```

### 2. 이미지 로드 확인

브라우저 개발자 도구 (F12):
1. **Network 탭** 확인
2. 이미지 요청 상태 확인
3. 로딩 시간 확인

### 3. 체크리스트

- [ ] 제품 이미지 정상 로드
- [ ] 브랜드 로고 정상 로드
- [ ] 아이콘 정상 로드
- [ ] 문서 이미지 정상 로드
- [ ] 404 오류 없음
- [ ] CORS 오류 없음

### 4. 성능 확인

- 이미지 로딩 속도 측정
- 캐시 동작 확인
- 네트워크 트래픽 확인

---

## 롤백 방법

문제가 발생하면 즉시 롤백 가능합니다.

### 빠른 롤백

```cmd
xcopy /E /I /Y backup-before-url-replacement\* .
```

### Git 롤백

커밋 전:
```bash
git restore .
```

커밋 후:
```bash
git revert HEAD
```

**상세 가이드**: `ROLLBACK-GUIDE.md` 참조

---

## Git 커밋 가이드

### 정상 작동 확인 후

```bash
# 변경사항 확인
git status

# 모든 변경 스테이징
git add .

# 커밋
git commit -m "feat: 이미지를 외부 호스팅 서버로 전환

- 총 555개 이미지 파일을 CDN으로 이전
- 115개 파일에서 4,286개 참조 경로 업데이트
- 호스팅 URL: https://your-cdn.com

🤖 Generated with Claude Code
"

# 푸시
git push origin main
```

---

## 참고 자료

### 생성된 파일

| 파일 | 설명 |
|------|------|
| `images-for-hosting/` | 업로드할 통합 이미지 폴더 |
| `image-inventory.json` | 전체 이미지 목록 |
| `image-classification-report.md` | 분류 보고서 |
| `file-mapping.json` | 파일 매핑 정보 |
| `image-references.json` | 이미지 참조 목록 |
| `replace-image-paths.js` | 경로 교체 스크립트 |
| `ROLLBACK-GUIDE.md` | 롤백 가이드 |

### 스크립트 파일

| 스크립트 | 용도 |
|---------|------|
| `collect-images.js` | 이미지 수집 |
| `classify-images.js` | 이미지 분류 |
| `copy-images-for-hosting.js` | 통합 폴더 생성 |
| `find-image-references.js` | 참조 검색 |
| `replace-image-paths.js` | 경로 교체 |

### 통계 요약

```
📊 프로젝트 이미지 통계
├─ 총 파일: 555개
├─ 총 용량: 19.3 MB
├─ 확장자:
│  ├─ .webp: 547개
│  ├─ .png: 5개
│  └─ .svg: 3개
├─ 참조:
│  ├─ 파일: 115개
│  └─ 참조 수: 4,286개
└─ 분류:
   ├─ products: 333개
   ├─ brands: 147개
   ├─ icons: 63개
   ├─ docs: 11개
   └─ uncategorized: 1개
```

---

## 🎯 다음 단계

### 즉시 수행

1. **`images-for-hosting/` 폴더를 호스팅 서버에 업로드**
2. **호스팅 서버의 기본 URL 확인**
3. **URL을 제공하여 경로 교체 진행**

### 경로 교체 후

1. 로컬에서 테스트
2. 정상 작동 확인
3. Git 커밋 및 푸시
4. 원본 이미지 폴더 정리 (선택)

---

## 💡 팁

### 성능 최적화

- CDN 캐시 설정 활용
- 이미지 압축 고려
- WebP 포맷 활용 (이미 98% WebP)

### 비용 최적화

- 무료 티어 활용 (Cloudinary, Vercel 등)
- 압축으로 전송 비용 절감
- 캐시로 요청 수 감소

### 보안

- HTTPS 필수
- CORS 올바르게 설정
- 불필요한 공개 권한 제한

---

**문서 끝**

업로드 준비 완료! `images-for-hosting/` 폴더를 호스팅 서버에 업로드하고 URL을 알려주세요.
