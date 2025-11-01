# 이미지 호스팅 업로드 패키지

**최종 정리 완료**: 2025-11-01

---

## 📁 폴더 구조

```
image-hosting-upload/
├── products/       # 333개 - 모든 제품 이미지 (평평하게 정리)
├── brands/         # 109개 - 브랜드 로고 및 배너
└── icons/          # 40개 - UI 아이콘 (브랜드 아이콘 포함)
```

**총 파일 수**: 482개
**중복 제거**: _2 파일, 한글 파일명 제거 완료
**파일명 통일**: 모두 소문자

---

## 📦 products 폴더

모든 제품 이미지가 한 폴더에 평평하게 정리됨 (333개)

**파일명 규칙**: `{category}_{subcategory}{number}.webp`

예시:
- `women_new1.webp`, `women_jacket3.webp`
- `men_shirt2.webp`, `kids_baby1.webp`
- `3207359177.webp` (숫자 ID 이미지 - Home.jsx에서 사용)

---

## 🎨 brands 폴더

브랜드 관련 이미지 (109개)

- 브랜드 로고: `brand_beanpole.webp`, `brand_ami.webp`
- 배너 이미지: `beanpole.webp`, `8seconds.webp`

---

## 🔖 icons 폴더

UI 아이콘 및 작은 브랜드 아이콘 (40개)

- 브랜드 아이콘: `brand_beaker.webp` (Home.jsx에서 사용)
- UI 아이콘: `kakao.webp`, `naver.svg`, `main1.webp`
- 결제 아이콘: `kakaopay.webp`, `naverpay.webp`

---

## 🚀 서버 업로드 경로

```
https://desfigne.synology.me/data/image/thejoeun/
├── products/
├── brands/
└── icons/
```

---

## ✅ 완료된 작업

1. ✅ products 폴더에 모든 제품 이미지 평평하게 정리
2. ✅ 중복 파일 제거 (_2 파일, 한글 파일명)
3. ✅ 모든 파일명 소문자 통일
4. ✅ 코드 경로 수정 (13개 파일)
5. ✅ 간단하고 명확한 3-폴더 구조

---

## 📝 다음 단계

1. 서버에 업로드
2. 이미지 URL 접근 테스트
3. CORS 설정 확인
4. 애플리케이션 테스트

---

**작성**: Claude Code
**날짜**: 2025-11-01
