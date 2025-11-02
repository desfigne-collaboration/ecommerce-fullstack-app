# 라우팅 구조 업데이트 - ProductList 동적 라우팅 통합

**작업일**: 2025-11-02
**작업자**: Claude Code

## 📋 개요

카테고리 페이지 라우팅을 CategoryPage에서 ProductList 컴포넌트로 통합하여 동적 라우팅 구조를 단순화했습니다. 또한 백&슈즈 카테고리의 경로 불일치 문제를 해결했습니다.

## 🎯 주요 변경사항

### 1. 라우팅 컴포넌트 변경

**이전**: `CategoryPage.jsx` 사용
**이후**: `ProductList.jsx` 사용 (동적 라우팅 통합)

#### 변경된 파일: `routes/index.jsx`

- 모든 카테고리 라우트가 `ProductList` 컴포넌트 사용
- 10개 카테고리 경로 모두 업데이트됨

```jsx
// 이전
<Route path="/women/:subcategory?" element={<CategoryPage />} />

// 이후
<Route path="/women/:subcategory?" element={<ProductList />} />
```

### 2. 백&슈즈 경로 불일치 해결

**문제**: Header.jsx는 `/bags-shoes` 사용, routes/index.jsx는 `/shoes` 사용
**해결**: 모든 파일을 `/bags-shoes`로 통일

#### 변경된 파일:

1. **`routes/index.jsx`**
   ```jsx
   // 이전
   <Route path="/shoes/:subcategory?" element={<CategoryPage />} />

   // 이후
   <Route path="/bags-shoes/:subcategory?" element={<ProductList />} />
   ```

2. **`categoryData.js`**
   ```javascript
   // 이전
   shoes: {
     name: "백&슈즈",
     nameEn: "SHOES",
     subcategories: [
       { name: "전체", path: "/shoes", count: "78,920" },
       ...
     ]
   }

   // 이후
   "bags-shoes": {
     name: "백&슈즈",
     nameEn: "BAGS & SHOES",
     subcategories: [
       { name: "전체", path: "/bags-shoes", count: "78,920" },
       ...
     ]
   }
   ```

3. **`ProductList.jsx`**
   - `categoryInfo` 객체에 `golf` 카테고리 추가
   - `"bags-shoes"` 키로 백&슈즈 카테고리 정의

### 3. ProductList.jsx 동적 라우팅 개선

#### 추가된 카테고리 지원:
- ✅ 여성 (women)
- ✅ 남성 (men)
- ✅ 키즈 (kids)
- ✅ 뷰티 (beauty)
- ✅ 스포츠 (sports)
- ✅ 골프 (golf) ⬅️ 새로 추가
- ✅ 라이프 (life)
- ✅ 럭셔리 (luxury)
- ✅ 백&슈즈 (bags-shoes) ⬅️ 경로 수정
- ✅ 아울렛 (outlet)

## 📊 영향 받는 경로

### 수정된 카테고리 경로 (10개)

| 카테고리 | 경로 예시 | 컴포넌트 변경 |
|---------|----------|------------|
| 여성 | `/women`, `/women/outer` | CategoryPage → ProductList |
| 남성 | `/men`, `/men/suit` | CategoryPage → ProductList |
| 키즈 | `/kids`, `/kids/boy` | CategoryPage → ProductList |
| 스포츠 | `/sports`, `/sports/running` | CategoryPage → ProductList |
| 뷰티 | `/beauty`, `/beauty/skin` | CategoryPage → ProductList |
| 골프 | `/golf`, `/golf/women` | CategoryPage → ProductList |
| 백&슈즈 | `/bags-shoes`, `/bags-shoes/women` | `/shoes` → `/bags-shoes` + ProductList |
| 라이프 | `/life`, `/life/pet` | CategoryPage → ProductList |
| 럭셔리 | `/luxury`, `/luxury/women` | CategoryPage → ProductList |
| 아울렛 | `/outlet`, `/outlet/women` | CategoryPage → ProductList |

### 브랜드 경로 (변경 없음)

| 경로 패턴 | 컴포넌트 | 예시 |
|---------|---------|------|
| `/brand/:brandId` | BrandDetail | `/brand/8seconds`, `/brand/ami` |

## 🔧 기술적 세부사항

### ProductList.jsx의 경로 파싱 로직

```javascript
// URL에서 카테고리 추출
const pathParts = location.pathname.split("/").filter(Boolean);
const first = pathParts[0] || "women";
const isSearchMode = first === "search";
const category = isSearchMode ? "" : first;
const subcategory = isSearchMode ? "" : pathParts[1] || "outer";
```

**지원 경로 패턴**:
- `/women` → category: "women", subcategory: "outer" (기본값)
- `/women/jacket` → category: "women", subcategory: "jacket"
- `/bags-shoes/women` → category: "bags-shoes", subcategory: "women"
- `/search/키워드` → isSearchMode: true

### CategoryPage vs ProductList 차이점

| 기능 | CategoryPage | ProductList |
|-----|-------------|------------|
| 데이터 소스 | `getProductsByCategory()` + CATEGORY_DATA | 하드코딩 로컬 데이터 + 샘플 |
| 위시리스트 | Redux 기반 | localStorage 기반 |
| 검색 모드 | ❌ 지원 안 함 | ✅ `/search/:keyword` 지원 |
| 이미지 폴백 | 기본 onError | 다중 후보 경로 시도 |
| 정렬/필터 | 기본 UI | 가격순, 할인율순, 리뷰순 등 |
| 브랜드 로고 | ❌ 없음 | ✅ 12개 브랜드 로고 표시 |

## 📝 브랜드 데이터 현황

### brands.json 분석

**총 브랜드 수**: 28개 (Header에 표시된 291개 중)
**완전한 데이터**: 2개 (8seconds, ami)
**기본 정보만**: 26개

#### 완전한 데이터를 가진 브랜드:
1. **8SECONDS** (id: `8seconds`)
   - 상품: 4개
   - LOOKBOOK: 4개 이미지

2. **AMI PARIS** (id: `ami`)
   - 상품: 4개
   - LOOKBOOK: 4개 이미지

#### 기본 정보만 있는 브랜드 (26개):
- 10 Corso Como, The Aperture, Beaker, Beanpole, Canada Goose, Comme des Garçons, COS, Danton, Galaxy, Galaxy Lifestyle, General Idea, Hera, iNew Golf, Issey Miyake, Juun.J, Kuho, Kuho Plus, Le Mouton, Maison Kitsuné, Patagonia, Rebaige, Rogatis, Saint James, SIE, Sporty & Rich, Theory, Tommy Hilfiger, Tory Burch

**누락된 브랜드**: 263개 (291 - 28 = 263)

### BrandDetail.jsx 브랜드 없음 처리

브랜드를 찾지 못한 경우 안전하게 처리됨:

```jsx
if (!brand) {
  return (
    <div className="brand-not-found">
      <h1>브랜드를 찾을 수 없습니다</h1>
      <p>요청하신 브랜드 "{brandId}"가 존재하지 않습니다.</p>
      <Link to="/" className="btn-back">홈으로 돌아가기</Link>
    </div>
  );
}
```

## ✅ 체크리스트

- [x] routes/index.jsx 업데이트 (CategoryPage → ProductList)
- [x] `/shoes` 경로를 `/bags-shoes`로 수정
- [x] categoryData.js의 `shoes` 키를 `"bags-shoes"`로 변경
- [x] ProductList.jsx에 `golf` 카테고리 추가
- [x] ProductList.jsx `categoryInfo`에 모든 카테고리 추가
- [x] brands.json 현황 분석 및 문서화
- [x] 변경사항 문서 작성
- [ ] 누락된 263개 브랜드 데이터 추가 (향후 작업)
- [ ] 모든 카테고리별 실제 상품 데이터 추가 (향후 작업)

## 🔄 마이그레이션 가이드

### CategoryPage 사용 중인 기존 코드가 있다면:

**이전 방식**:
```jsx
import CategoryPage from "features/category/pages/CategoryPage.jsx";
<Route path="/women/:subcategory?" element={<CategoryPage />} />
```

**새로운 방식**:
```jsx
import ProductList from "features/product/pages/ProductList.jsx";
<Route path="/women/:subcategory?" element={<ProductList />} />
```

### 경로 변경사항:

- ❌ `/shoes` ⬅️ 더 이상 작동 안 함
- ✅ `/bags-shoes` ⬅️ 새 경로 사용

## 🎨 UI/UX 개선사항

1. **일관된 라우팅 구조**: 모든 카테고리가 동일한 컴포넌트 사용
2. **검색 통합**: ProductList가 카테고리 + 검색을 모두 처리
3. **경로 명확성**: `/bags-shoes`로 명확한 의미 전달
4. **브랜드 로고**: 카테고리 페이지에 브랜드 로고 12개 표시
5. **향상된 정렬**: 가격순, 할인율순, 리뷰순 정렬 지원

## 🐛 알려진 이슈

### 1. 제한된 상품 데이터
- ProductList.jsx가 하드코딩된 데이터 사용 (women/outer, women/jacket만 실제 데이터)
- 다른 카테고리는 빈 배열 (`local_women_knit = []` 등)
- **해결 방안**: productData.js에서 실제 상품 데이터 로드하도록 개선 필요

### 2. 브랜드 데이터 부족
- brands.json에 28개 브랜드만 존재 (291개 중)
- 대부분 브랜드가 기본 정보만 보유
- **해결 방안**: 브랜드별 상품 데이터 수집 및 추가 필요

### 3. 위시리스트 방식 차이
- CategoryPage: Redux 사용
- ProductList: localStorage 사용
- **해결 방안**: Redux로 통일 권장

## 📈 다음 단계

1. **상품 데이터 확충**:
   - 모든 카테고리/서브카테고리별 실제 상품 데이터 추가
   - productData.js에서 API 또는 JSON 파일로 데이터 관리

2. **브랜드 데이터 추가**:
   - 263개 누락 브랜드 기본 정보 추가
   - 주요 브랜드별 상품 4-6개씩 추가
   - LOOKBOOK 이미지 추가

3. **위시리스트 통합**:
   - ProductList를 Redux 기반 위시리스트로 마이그레이션
   - 전역 상태 관리 일관성 확보

4. **검색 기능 개선**:
   - 검색 결과 정확도 향상
   - 필터링 기능 강화 (브랜드, 가격, 사이즈, 색상)

---

**변경 완료일**: 2025-11-02
**검토 필요**: ProductList 상품 데이터 확충, brands.json 브랜드 추가
**관련 이슈**: Header 업데이트 ([2025-11-02-header-update.md](2025-11-02-header-update.md))
