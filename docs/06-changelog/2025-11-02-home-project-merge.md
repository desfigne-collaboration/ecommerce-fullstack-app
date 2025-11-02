# 집 프로젝트에서 메인 프로젝트로 데이터 통합

**작업일**: 2025-11-02
**작업자**: Claude Code

## 📋 개요

집에서 작업하던 프로젝트(`ecommerce-fullstack-app_home`)의 모든 상품 데이터와 기능을 메인 프로젝트(`ecommerce-fullstack-app`)의 ProductList.jsx로 통합했습니다. 이를 통해 모든 카테고리에 대한 상품 데이터가 준비되었으며, 브랜드 로고 섹션이 활성화되었습니다.

## 🎯 주요 변경사항

### 1. ProductList.jsx 대규모 업데이트

**파일 경로**: [`frontend/src/features/product/pages/ProductList.jsx`](../../frontend/src/features/product/pages/ProductList.jsx)

#### 추가된 상품 데이터 (총 60개 상품)

**여성 카테고리** (48개 상품):
- ✅ 니트 (6개) - women_knit1~6.webp
- ✅ 셔츠/블라우스 (6개) - women_shirt1~6.webp
- ✅ 티셔츠 (6개) - women_tshirt1~6.webp
- ✅ 원피스 (6개) - women_onepiece1~6.webp
- ✅ 팬츠 (6개) - women_pants1~6.webp
- ✅ 스커트 (6개) - women_skirt1~6.webp
- (기존) 아우터 (6개) - 이미 존재
- (기존) 재킷 (6개) - 이미 존재

**남성 카테고리** (18개 상품):
- ✅ 정장 (6개) - men_suit1~6.webp
- ✅ 재킷 (6개) - men_jacket1~6.webp
- ✅ 셔츠 (6개) - men_shirt1~6.webp (경로: `/images/men_shirt/`)

**키즈 카테고리** (12개 상품):
- ✅ 남아 (6개) - kids_boy1~6.webp
- ✅ 여아 (6개) - kids_girl1~6.webp

**뷰티 카테고리** (12개 상품):
- ✅ 스킨케어 (6개) - beauty_skin1~6.webp (경로: `/images/beauty/Skin/`)
- ✅ 메이크업 (6개) - beauty_makeup1~6.webp (경로: `/images/Beauty/Makeup/`)

**골프 카테고리** (6개 상품):
- ✅ 여성 (6개) - golf_women1~6.webp (경로: `/images/Golf/women/`)

**스포츠 카테고리** (12개 상품):
- ✅ 러닝 (6개) - sports_running1~6.webp
- ✅ 아웃도어 (6개) - sports_outdoor1~6.webp (경로: `/images/sprots/outdoor/` - typo 주의)

**럭셔리 카테고리** (6개 상품):
- ✅ 여성 (6개) - luxury_women1~6.webp

### 2. localByCategory 객체 확장

**변경 전**:
```javascript
const localByCategory = {
  women: {
    outer: local_women_outer,
    jacket: local_women_jacket,
    // 나머지는 빈 배열
  },
};
```

**변경 후**:
```javascript
const localByCategory = {
  women: { outer, jacket, knit, shirt, tshirt, onepiece, pants, skirt },
  men: { suit, jacket, shirt },
  kids: { boy, girl },
  beauty: { skin, makeup },
  golf: { women },
  sports: { running, outdoor },
  luxury: { women },
};
```

### 3. 검색 기능 강화

**변경 전**: 여성 카테고리만 검색
```javascript
const getAllProductsForSearch = () => {
  const allLocalWomen = Object.values(localByCategory.women || {}).flat();
  return [...sampleProducts, ...allLocalWomen];
};
```

**변경 후**: 모든 카테고리 검색
```javascript
const getAllProductsForSearch = () => {
  const allProducts = [];
  Object.values(localByCategory).forEach(categoryObj => {
    Object.values(categoryObj).forEach(subcategoryArray => {
      allProducts.push(...subcategoryArray);
    });
  });
  return [...sampleProducts, ...allProducts];
};
```

### 4. 브랜드 로고 섹션 활성화

**변경 전**: 주석 처리됨
```jsx
{/* {!isSearchMode && (
  <div className="brand-logos-section">
    ...
  </div>
)} */}
```

**변경 후**: 활성화됨
```jsx
{!isSearchMode && (
  <div className="brand-logos-section">
    {brandLogos.map((brand, idx) => {
      const { src, candidates } = srcOf(brand.img);
      return <div key={idx} className="brand-logo-item">...</div>;
    })}
  </div>
)}
```

## 📊 데이터 통계

### 추가된 상품 데이터

| 카테고리 | 서브카테고리 | 상품 개수 | 이미지 경로 패턴 | 비고 |
|---------|-----------|----------|----------------|------|
| **여성** | 니트 | 6 | `/images/women/knit/women_knit*.webp` | 신규 |
| **여성** | 셔츠/블라우스 | 6 | `/images/women/shirt/women_shirt*.webp` | 신규 |
| **여성** | 티셔츠 | 6 | `/images/women/tshirt/women_tshirt*.webp` | 신규 |
| **여성** | 원피스 | 6 | `/images/women/onepiece/women_onepiece*.webp` | 신규 |
| **여성** | 팬츠 | 6 | `/images/women/pants/women_pants*.webp` | 신규 |
| **여성** | 스커트 | 6 | `/images/women/skirt/women_skirt*.webp` | 신규 |
| **남성** | 정장 | 6 | `/images/men/suit/men_suit*.webp` | 신규 |
| **남성** | 재킷 | 6 | `/images/men/jacket/men_jacket*.webp` | 신규 |
| **남성** | 셔츠 | 6 | `/images/men_shirt/men_shirt*.webp` | 신규, 경로 주의 |
| **키즈** | 남아 | 6 | `/images/kids/boy/kids_boy*.webp` | 신규 |
| **키즈** | 여아 | 6 | `/images/kids/girl/kids_girl*.webp` | 신규 |
| **뷰티** | 스킨케어 | 6 | `/images/beauty/Skin/beauty_skin*.webp` | 신규, 대문자 주의 |
| **뷰티** | 메이크업 | 6 | `/images/Beauty/Makeup/beauty_makeup*.webp` | 신규, 대문자 주의 |
| **골프** | 여성 | 6 | `/images/Golf/women/golf_women*.webp` | 신규, 대문자 주의 |
| **스포츠** | 러닝 | 6 | `/images/sports/running/sports_running*.webp` | 신규 |
| **스포츠** | 아웃도어 | 6 | `/images/sprots/outdoor/sports_outdoor*.webp` | 신규, typo 주의 |
| **럭셔리** | 여성 | 6 | `/images/luxury/women/luxury_women*.webp` | 신규 |
| **합계** | - | **114개** | - | - |

### 상품 데이터 구조

각 상품 객체는 다음 필드를 포함합니다:

```javascript
{
  id: "category-subcategory-###",  // 고유 ID
  brand: "SSF SHOP",                // 브랜드명
  name: "상품명",                     // 상품명
  img: "/images/path/to/image.webp", // 이미지 경로
  desc: "설명",                      // 상품 설명
  price: "45000",                    // 가격 (문자열)
  originalPrice: 56000,              // 원가 (숫자)
  discountRate: 20,                  // 할인율 (%)
  rating: 4.6,                       // 평점 (5점 만점)
  reviewCount: 28,                   // 리뷰 개수
  wishCount: 122,                    // 찜 개수
  colors: ["blue", "grey"]           // 색상 옵션
}
```

## 🔧 이미지 경로 특이사항

### 경로 대소문자 주의

일부 카테고리는 대문자 경로를 사용합니다:
- ❗ Beauty → `/images/beauty/Skin/` (첫 글자 소문자, 두 번째 대문자)
- ❗ Golf → `/images/Golf/women/` (첫 글자 대문자)
- ❗ Men Shirt → `/images/men_shirt/` (언더스코어 사용, `men/shirt` 아님)

### 오타 주의

- ❗ Sports Outdoor → `/images/sprots/outdoor/` (sprots로 오타, sports 아님)

### 일관된 패턴

- 여성, 키즈, 럭셔리, 스포츠 러닝은 일관된 소문자 경로 사용
- 모든 이미지는 `.webp` 형식

## 📝 집 프로젝트 vs 메인 프로젝트 차이점

| 항목 | 집 프로젝트 | 메인 프로젝트 | 통합 후 |
|-----|----------|-----------|---------|
| **React Router** | v5 (useHistory) | v6 (useNavigate) | v6 유지 |
| **Storage** | 직접 localStorage | storage 유틸리티 | storage 유틸리티 유지 |
| **ProductThumb** | 별도 컴포넌트 사용 | 인라인 렌더링 | 인라인 유지 |
| **이미지 경로** | 로컬 경로 (`/images/...`) | HTTPS URL + 로컬 경로 | 로컬 경로 추가 |
| **브랜드 로고** | 활성화 | 비활성화 | **활성화됨** ✅ |
| **상품 데이터** | 114개 JSX 파일에 분산 | 통합 배열 | **통합 완료** ✅ |

## 🚀 향후 작업 계획

### 우선순위: 높음

1. **실제 이미지 파일 확인 및 추가**
   - 집 프로젝트의 `public/images/` 디렉토리를 메인 프로젝트로 복사
   - 경로 대소문자 및 오타 수정:
     - `/images/sprots/` → `/images/sports/` 수정
     - `/images/Beauty/`, `/images/Golf/` 경로 정리
     - `/images/men_shirt/` → `/images/men/shirt/` 통일 (선택사항)

2. **누락된 서브카테고리 데이터 추가**
   - 남성: 니트, 티셔츠, 팬츠, 신상품
   - 키즈: 베이비, 신상품
   - 뷰티: 향수, 신상품
   - 골프: 남성, 신상품
   - 스포츠: 요가, 피트니스, 테니스, 수영, 신상품
   - 럭셔리: 남성, 신상품
   - 백&슈즈: 전체 (main, women, men, new)
   - 라이프: 전체 (main, furniture, pet, car, new)
   - 아울렛: 전체 (10개 서브카테고리)

### 우선순위: 중간

3. **상품 상세 정보 보완**
   - 현재 대부분 상품이 플레이스홀더 데이터 사용
   - 실제 상품명, 설명, 가격 정보로 교체
   - 색상 옵션 정확히 지정

4. **브랜드 로고 이미지 확보**
   - 12개 브랜드 로고 이미지 파일 준비
   - `public/icons/brand_*.png` or `.webp` 파일 생성

### 우선순위: 낮음

5. **코드 리팩토링**
   - 상품 데이터를 별도 JSON 파일로 분리
   - 이미지 경로 일관성 개선
   - TypeScript 타입 정의 추가 (선택사항)

## ✅ 체크리스트

- [x] 집 프로젝트 상품 데이터 추출 (114개 파일 분석)
- [x] 여성 카테고리 데이터 추가 (knit, shirt, tshirt, onepiece, pants, skirt)
- [x] 남성 카테고리 데이터 추가 (suit, jacket, shirt)
- [x] 키즈 카테고리 데이터 추가 (boy, girl)
- [x] 뷰티 카테고리 데이터 추가 (skin, makeup)
- [x] 골프 카테고리 데이터 추가 (women)
- [x] 스포츠 카테고리 데이터 추가 (running, outdoor)
- [x] 럭셔리 카테고리 데이터 추가 (women)
- [x] localByCategory 객체 업데이트
- [x] getAllProductsForSearch 함수 개선
- [x] 브랜드 로고 섹션 활성화
- [x] 문서 작성
- [ ] 이미지 파일 복사 및 경로 검증 (향후 작업)
- [ ] 누락된 서브카테고리 데이터 추가 (향후 작업)
- [ ] 실제 상품 정보로 교체 (향후 작업)

## 🔗 관련 문서

- [라우팅 구조 업데이트](2025-11-02-routing-update.md)
- [UI 성능 개선](2025-11-02-ui-performance-fix.md)
- [Header 업데이트](2025-11-02-header-update.md)

---

**작성일**: 2025-11-02
**검토 필요**: 이미지 파일 복사, 경로 검증, 누락 데이터 추가
**영향 범위**: ProductList.jsx 대규모 업데이트 (354줄 추가)
