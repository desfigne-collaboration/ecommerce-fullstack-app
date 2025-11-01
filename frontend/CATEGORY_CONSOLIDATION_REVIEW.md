# 카테고리 페이지 통합 검토 보고서

## 현황 분석

### 1. 현재 구조

#### A. 데이터 기반 동적 카테고리 (CategoryPage.jsx 사용)
**파일**: `src/features/category/pages/CategoryPage.jsx`
**사용 카테고리**: women, men, kids, sports, beauty

**특징**:
- 라우팅 파라미터로 카테고리 동적 결정 (`/women`, `/men/shirt` 등)
- `CATEGORY_DATA`에서 데이터 로드
- 탭, 필터링, 정렬 기능
- 위시리스트 통합
- 브레드크럼 네비게이션
- 상품 그리드 표시

**장점**:
- ✅ 단일 컴포넌트로 여러 카테고리 관리
- ✅ 유지보수 용이 (로직 한 곳에서 수정)
- ✅ 일관된 UX
- ✅ 코드 중복 최소화

#### B. 개별 하드코딩 카테고리 (38개 파일)
**위치**: `src/features/category/pages/`
- `golf/` (4개): GolfMain, GolfNew, GolfWomen, GolfMen
- `luxury/` (4개): LuxuryMain, LuxuryNew, LuxuryWomen, LuxuryMen
- `shoes/` (4개): ShoesMain, ShoesNew, ShoesWomen, ShoesMen
- `life/` (5개): LifeMain, LifeNew, LifeFurniture, LifePet, LifeCar
- `outlet/` (9개): OutletMain, OutletWomen, OutletMen, OutletKids, OutletLuxury, OutletShoes, OutletSports, OutletGolf, OutletLife

**특징**:
- 각 파일이 독립적으로 구현됨
- 대부분 매우 단순 (제목 + 샘플 이미지 그리드)
- 일부는 하드코딩된 상품 배열 사용
- 로직 중복 발생
- 일관성 없는 구현

**단점**:
- ❌ 38개 파일 관리 부담
- ❌ 로직 중복 (위시리스트, 네비게이션 등)
- ❌ 일관성 부족
- ❌ 새 기능 추가 시 38곳 수정 필요
- ❌ 버그 발생 시 여러 곳 수정 필요

### 2. 코드 예시 비교

#### 현재 - GolfMain.jsx (9줄)
```jsx
function GolfMain() {
  return (
    <div className="page">
      <h1>골프 메인 페이지</h1>
      <div className="grid">
        {/* 6개 샘플 이미지 */}
      </div>
    </div>
  );
}
```

#### 현재 - CategoryPage.jsx (233줄)
- 라우팅, 상태관리, 데이터 로딩, 탭, 필터, 위시리스트, 브레드크럼 등 모든 기능 포함

## 통합 권장사항

### 1. 우선순위: 높음 ⭐⭐⭐

**이유**:
- 38개 중복 파일 → 1개 컴포넌트로 통합 가능
- 유지보수성 대폭 향상
- 일관된 사용자 경험 제공
- 향후 기능 추가 시 한 곳만 수정

### 2. 통합 방안

#### A. CATEGORY_DATA 확장
`src/features/category/data/categoryData.js`에 추가:

```javascript
export const CATEGORY_DATA = {
  // 기존: women, men, kids, sports, beauty

  // 추가 카테고리
  golf: {
    name: "골프",
    nameEn: "GOLF",
    totalCount: "45,000",
    subcategories: [
      { name: "전체", path: "/golf", count: "45,000" },
      { name: "신상품", path: "/golf/new", count: "5,000" },
      { name: "여성", path: "/golf/women", count: "20,000" },
      { name: "남성", path: "/golf/men", count: "20,000" },
    ],
    pages: {
      main: { title: "골프", count: "45,000" },
      new: { title: "신상품", count: "5,000" },
      women: { title: "여성", count: "20,000" },
      men: { title: "남성", count: "20,000" },
    }
  },

  luxury: { /* 동일 구조 */ },
  shoes: { /* 동일 구조 */ },
  life: { /* 동일 구조 */ },
  outlet: { /* 동일 구조 */ },
};
```

#### B. 라우팅 통합
`src/routes/index.jsx` 수정:

```javascript
// 기존: 38개 개별 라우트
<Route path="/golf" element={<GolfMain />} />
<Route path="/golf/new" element={<GolfNew />} />
<Route path="/golf/women" element={<GolfWomen />} />
<Route path="/golf/men" element={<GolfMen />} />
// ... 34개 더

// 통합: 5개 라우트
<Route path="/golf/:subcategory?" element={<CategoryPage />} />
<Route path="/luxury/:subcategory?" element={<CategoryPage />} />
<Route path="/shoes/:subcategory?" element={<CategoryPage />} />
<Route path="/life/:subcategory?" element={<CategoryPage />} />
<Route path="/outlet/:subcategory?" element={<CategoryPage />} />
```

#### C. 제거 가능한 파일
- `src/features/category/pages/golf/*.jsx` (4개)
- `src/features/category/pages/luxury/*.jsx` (4개)
- `src/features/category/pages/shoes/*.jsx` (4개)
- `src/features/category/pages/life/*.jsx` (5개)
- `src/features/category/pages/outlet/*.jsx` (9개)
- **총 26개 파일 삭제**

### 3. 구현 단계

#### 1단계: 카테고리 데이터 확장
- [ ] `categoryData.js`에 golf, luxury, shoes, life, outlet 추가
- [ ] 각 카테고리의 서브카테고리 정의
- [ ] 상품 수 데이터 추가

#### 2단계: 상품 데이터 정리
- [ ] `productData.js`에서 해당 카테고리별 상품 데이터 확인
- [ ] 현재 하드코딩된 상품 배열을 데이터 파일로 이동

#### 3단계: 라우팅 수정
- [ ] `routes/index.jsx`에서 개별 라우트 제거
- [ ] 동적 라우트 5개로 통합

#### 4단계: 기존 파일 제거
- [ ] 26개 개별 카테고리 컴포넌트 삭제
- [ ] import 문 정리

#### 5단계: 테스트
- [ ] 각 카테고리 페이지 접근 테스트
- [ ] 탭 전환 테스트
- [ ] 위시리스트 기능 테스트
- [ ] 브레드크럼 테스트

## 예상 효과

### 정량적 효과
- **파일 수**: 38개 → 1개 (97% 감소)
- **라우트 수**: 38개 → 5개 (87% 감소)
- **코드 라인**: ~500줄 → CategoryPage.jsx 233줄만 유지
- **유지보수 포인트**: 38곳 → 1곳

### 정성적 효과
- ✅ 일관된 사용자 경험
- ✅ 버그 발생률 감소
- ✅ 새 기능 추가 용이
- ✅ 코드 가독성 향상
- ✅ 팀 협업 효율 증가

## 고려사항

### 1. 기존 URL 유지
- 모든 기존 URL 경로 유지 (하위 호환성)
- SEO에 영향 없음

### 2. 점진적 마이그레이션
- 한 카테고리씩 테스트 후 확대
- 예: golf → luxury → shoes → life → outlet

### 3. 특수 케이스 처리
- Outlet 카테고리는 다른 카테고리의 상품을 모음
- 데이터 구조 설계 시 교차 참조 고려

## 결론

**권장**: 즉시 통합 작업 진행

**우선순위 제안**:
1. Golf 카테고리 (가장 단순, 테스트용)
2. Luxury, Shoes (유사 구조)
3. Life (중간 복잡도)
4. Outlet (가장 복잡, 교차 참조)

**예상 작업 시간**: 4-6시간
**리스크**: 낮음 (기존 패턴 재사용)
**ROI**: 매우 높음 (장기적 유지보수 비용 대폭 절감)
