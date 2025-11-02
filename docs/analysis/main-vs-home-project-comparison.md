# 메인 프로젝트 vs 집 프로젝트 상세 비교 분석

**작성일**: 2025-11-02
**목적**: 집 프로젝트의 모든 기능을 메인 프로젝트에 완전 통합

## 📊 주요 차이점 요약

| 항목 | 메인 프로젝트 | 집 프로젝트 | 통합 방향 |
|-----|-----------|----------|----------|
| **ProductCard.css** | ❌ 없음 | ✅ 있음 (252줄) | 집 → 메인 복사 |
| **CategoryPage.css** | 397줄 (간단) | 841줄 (상세) | 집 → 메인 교체 |
| **브랜드 로고 섹션** | ✅ 활성화됨 | ✅ 활성화됨 | 제거 필요 |
| **React Router** | v6 (useNavigate) | v5 (useHistory) | v6 유지 |
| **Storage** | storage 유틸리티 | 직접 localStorage | storage 유틸 유지 |
| **wishlist Event** | StorageEvent | new Event | StorageEvent 유지 |
| **상품 데이터** | 114개 (통합 완료) | 12개 (outer, jacket만) | 메인 유지 |

## 🎨 CSS 파일 비교

### 1. ProductCard.css

**메인 프로젝트**: 없음
**집 프로젝트**: 252줄의 상세한 스타일

#### 집 프로젝트 ProductCard.css 주요 특징:

```css
/* 기본 카드 스타일 */
.product-card {
  background: var(--bg-primary, white);
  border-radius: var(--radius-md, 8px);
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
}

.product-card:hover {
  transform: translateY(-4px);  /* ⬅️ 호버 시 위로 이동 */
}

/* 이미지 비율 고정 */
.product-card .product-image,
.product-card .thumb {
  position: relative;
  width: 100%;
  overflow: hidden;
  background: var(--bg-secondary, #f8f8f8);
}

/* 위시버튼 스타일 */
.product-card .wishlist-btn {
  position: absolute;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
```

### 2. CategoryPage.css

#### 메인 프로젝트 (397줄):
- 기본 스타일만 포함
- 간단한 필터 버튼
- 제한적인 반응형

#### 집 프로젝트 (841줄):
- 상세한 필터 시스템
- 브랜드 필터 (탭, 검색, 그리드, 페이지네이션)
- 가격 필터 (라디오 버튼, 커스텀 입력)
- 사이즈, 색상, 혜택/배송 필터
- 활성 필터 태그 시스템
- 완벽한 반응형 디자인

#### 주요 추가 기능:

**브랜드 필터**:
```css
.category-page .brand-filter-header {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  background: #fafafa;
}

.category-page .brand-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px 12px;
  padding: 24px 20px;
}
```

**가격 필터**:
```css
.category-page .price-ranges-horizontal {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.category-page .radio-label {
  padding: 10px 16px;
  border: 1px solid #d5d5d5;
  border-radius: 20px;
}
```

**활성 필터 태그**:
```css
.category-page .active-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.category-page .filter-tag {
  padding: 8px 16px;
  background: #fff;
  border: 1px solid #d5d5d5;
  border-radius: 20px;
}
```

## 🧩 HTML 구조 비교

### ProductList.jsx 구조

**메인 프로젝트**:
```jsx
<div className="category-page">
  <div className="breadcrumb">...</div>
  <div className="container">
    <div className="page-header">
      <h1 className="page-title">...</h1>
    </div>

    {/* ❌ 브랜드 로고 - 제거 필요 */}
    {!isSearchMode && (
      <div className="brand-logos-section">...</div>
    )}

    {/* 카테고리 탭 */}
    <div className="category-tabs">...</div>

    {/* 필터 & 정렬 */}
    <div className="filter-section">
      <div className="filter-buttons">...</div>
      <div className="sort-section">...</div>
    </div>

    {/* 상품 그리드 */}
    <div className="product-grid">...</div>

    {/* 페이지네이션 */}
    <div className="pagination">...</div>
  </div>
</div>
```

**집 프로젝트**: 동일 구조 (브랜드 로고 포함)

## 🔑 로직 차이점

### 1. React Router

**메인 프로젝트** (React Router v6):
```javascript
import { useNavigate } from "react-router-dom";
const navigate = useNavigate();
navigate(`/product/${id}`, { product: data });
```

**집 프로젝트** (React Router v5):
```javascript
import { useHistory } from "react-router-dom";
const history = useHistory();
history.push(`/product/${id}`, { product: data });
```

### 2. Storage 처리

**메인 프로젝트**:
```javascript
import storage from "../../../utils/storage.js";
storage.set("lastProduct", normalized);
storage.get("wishlist", []);
```

**집 프로젝트**:
```javascript
localStorage.setItem("lastProduct", JSON.stringify(normalized));
JSON.parse(localStorage.getItem("wishlist") || "[]");
```

### 3. Wishlist 이벤트

**메인 프로젝트**:
```javascript
window.dispatchEvent(new StorageEvent("storage", {
  key: "wishlist",
  newValue: JSON.stringify(list)
}));
```

**집 프로젝트**:
```javascript
window.dispatchEvent(new Event("wishlistUpdated"));
```

## 📝 통합 단계별 작업 계획

### 단계 1: 브랜드 로고 섹션 제거 ✅
**작업**: ProductList.jsx에서 브랜드 로고 섹션 주석 처리 또는 삭제
**파일**: `frontend/src/features/product/pages/ProductList.jsx`

### 단계 2: ProductCard.css 추가 ✅
**작업**: 집 프로젝트의 ProductCard.css를 메인 프로젝트로 복사
**소스**: `ecommerce-fullstack-app_home/frontend/src/components/ProductCard.css`
**대상**: `ecommerce-fullstack-app/frontend/src/features/product/components/ProductCard.css`

### 단계 3: CategoryPage.css 교체 ✅
**작업**: 집 프로젝트의 CategoryPage.css로 메인 프로젝트 파일 교체
**소스**: `ecommerce-fullstack-app_home/frontend/src/styles/CategoryPage.css`
**대상**: `ecommerce-fullstack-app/frontend/src/styles/CategoryPage.css`

### 단계 4: ProductList.jsx CSS import 추가 ✅
**작업**: ProductCard.css import 추가
```javascript
import "../../../features/product/components/ProductCard.css";
```

### 단계 5: 페이지 헤더 구조 개선
**작업**: page-header를 category-header로 변경 (집 프로젝트 스타일 활용)

### 단계 6: 필터 섹션 구조 개선
**작업**: filter-section을 filter-sort-bar로 변경

### 단계 7: 테스트 및 검증
**작업**:
- 모든 카테고리 페이지 테스트
- 반응형 테스트
- 위시리스트 기능 테스트

### 단계 8: 문서화 및 커밋
**작업**: 변경사항 문서화 및 git 커밋

## 🚨 주의사항

1. **브랜드 로고 섹션 제거**: 사용자 요청에 따라 완전 제거
2. **React Router v6 유지**: 메인 프로젝트의 v6 구조 유지
3. **storage 유틸리티 유지**: 메인 프로젝트의 storage.js 유지
4. **상품 데이터 유지**: 메인 프로젝트에 이미 통합된 114개 상품 유지
5. **CSS 변수 호환성**: ProductCard.css의 CSS 변수가 정의되지 않을 수 있음

## 📌 예상 결과

통합 완료 후:
- ✅ 브랜드 로고 섹션 제거됨
- ✅ 상품 카드 호버 효과 개선 (`translateY(-4px)`)
- ✅ 더 상세한 필터 UI (브랜드, 가격, 사이즈, 색상, 혜택)
- ✅ 활성 필터 태그 시스템
- ✅ 향상된 반응형 디자인
- ✅ 더 나은 그리드 레이아웃 (`gap: 46px 16px`)
- ✅ 통일된 디자인 시스템

---

**다음 작업**: 단계별 통합 시작
