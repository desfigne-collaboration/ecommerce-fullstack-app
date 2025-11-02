# 장바구니 카운트 실시간 업데이트 버그 수정

**날짜**: 2025-11-02
**작성자**: Claude Code
**유형**: 버그 수정 (Bug Fix)
**심각도**: Medium
**영향 범위**: 장바구니, 헤더 UI

---

## 문제 설명

### 증상
- 상품 상세 페이지에서 "장바구니 담기" 버튼 클릭 시 헤더의 장바구니 카운트 뱃지가 업데이트되지 않음
- 페이지 새로고침 후에야 카운트가 반영됨
- 사용자 경험 저하 및 장바구니에 상품이 담겼는지 확인하기 어려움

### 원인 분석
```
ProductDetail.jsx (장바구니 담기)
  └─> localStorage 직접 저장
      └─> Redux store 업데이트 없음 ❌

Header.jsx (카운트 표시)
  └─> Redux의 selectCartCount 사용
      └─> Redux store가 업데이트되지 않아 카운트 반영 안됨
```

**핵심 문제점**:
- ProductDetail.jsx와 CartPage.jsx가 localStorage를 직접 조작
- Redux store는 업데이트되지 않음
- Header는 Redux state를 참조하므로 변경 사항을 감지하지 못함

---

## 해결 방법

### 아키텍처 변경
**Before (문제):**
```
Component → localStorage (직접 저장)
Header → Redux (동기화 안됨)
```

**After (해결):**
```
Component → Redux Dispatch → Redux Store
                              ↓
                      Middleware (자동)
                              ↓
                        localStorage
                              ↓
                           Header
```

### 수정된 파일

#### 1. ProductDetail.jsx
**변경 전:**
```javascript
const addToCart = () => {
  const cart = storage.get("cart", []);
  cart.push({ id: itemId, product, size, qty });
  storage.set("cart", cart);
  window.dispatchEvent(new StorageEvent(...));
};
```

**변경 후:**
```javascript
import { useDispatch } from "react-redux";
import { addToCart as addToCartAction } from "../../cart/slice/cartSlice.js";

const dispatch = useDispatch();

const addToCart = () => {
  // Redux 액션으로 장바구니에 추가
  dispatch(addToCartAction({
    id: product.id,
    name: product.name,
    image: product.image,
    price: normalizedPrice,
    selectedSize: size,
    quantity: Number(qty) || 1,
  }));

  alert("장바구니에 담았습니다.");
};
```

#### 2. CartPage.jsx
**전면 Redux 마이그레이션:**
```javascript
// Redux에서 장바구니 데이터 가져오기
const cart = useSelector(selectCartItems);
const dispatch = useDispatch();

// 수량 변경 - Redux 액션 사용
const inc = (item) => {
  const newQty = Math.min(99, (Number(item.quantity) || 1) + 1);
  dispatch(updateCartQuantity({ item, quantity: newQty }));
};

// 삭제 - Redux 액션 사용
const removeOne = (item) => {
  dispatch(removeFromCart(item));
};

// 전체 삭제 - Redux 액션 사용
const clearAllCart = () => {
  dispatch(clearCart());
};
```

**데이터 형식 통일:**
```javascript
// 기존: { id: "product123-L", product: {...}, size: "L", qty: 2 }
// 새로운: { id: "product123", selectedSize: "L", quantity: 2, name: "...", price: ... }
```

#### 3. cartSlice.js - 하위 호환성 보장
```javascript
const loadCartFromStorage = () => {
  try {
    const saved = localStorage.getItem('cart');
    if (saved) {
      const parsed = JSON.parse(saved);
      let items = Array.isArray(parsed) ? parsed : parsed.items || [];

      // 기존 형식을 새로운 형식으로 자동 변환
      return items.map(item => {
        // 새로운 형식인 경우 그대로 반환
        if (item.quantity !== undefined && item.selectedSize !== undefined) {
          return item;
        }

        // 기존 형식을 변환
        if (item.product) {
          return {
            id: item.product.id || item.id?.split('-')[0] || item.id,
            name: item.product.name || "",
            price: item.product.price || 0,
            image: item.product.image || item.product.img || "",
            selectedSize: item.size || "",
            selectedColor: item.color || "",
            quantity: item.qty || 1,
          };
        }

        return item;
      });
    }
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error);
  }
  return [];
};
```

#### 4. store.js - Middleware 동작
```javascript
const myCartSaveMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  // cart/ 액션 발생 시 localStorage 자동 저장
  if (typeof action.type === "string" && action.type.startsWith("cart/")) {
    const cart = store.getState().cart;
    localStorage.setItem("cart", JSON.stringify(cart.items));
  }

  return result;
}
```

---

## 작동 원리

### 전체 흐름도
```
1. 사용자 액션
   ↓
2. 컴포넌트에서 Redux 액션 dispatch
   dispatch(addToCart({ id, name, price, ... }))
   ↓
3. Redux Reducer 실행
   state.cart.items 업데이트
   ↓
4. Middleware 자동 실행
   myCartSaveMiddleware가 localStorage 저장
   ↓
5. Selector 재계산
   selectCartCount가 새로운 총 수량 계산
   ↓
6. Header 컴포넌트 리렌더링
   useSelector가 변경 감지 → 카운트 업데이트 ✅
```

### Selector 구현
```javascript
// cartSlice.js
export const selectCartCount = (state) =>
  state.cart.items.reduce((total, item) =>
    total + (item.quantity || 0), 0
  );
```

---

## 테스트 결과

### 빌드 결과
```bash
✅ Compiled successfully.

File sizes after gzip:
  169.32 kB  build\static\js\main.ba9c2af3.js
  21.5 kB    build\static\css\main.c87275ca.css
```

### 기능 테스트 시나리오
1. ✅ 상품 상세 페이지에서 장바구니 담기
   - 헤더 카운트 즉시 업데이트 확인
2. ✅ 장바구니 페이지에서 수량 변경
   - 헤더 카운트 실시간 반영 확인
3. ✅ 장바구니에서 상품 삭제
   - 헤더 카운트 감소 확인
4. ✅ 기존 localStorage 데이터 호환성
   - 기존 형식 데이터 자동 변환 확인
5. ✅ 페이지 새로고침 후 데이터 유지
   - localStorage와 Redux 동기화 확인

---

## 기술적 개선 사항

### 1. 단일 진실 원천 (Single Source of Truth)
- Redux를 장바구니 데이터의 유일한 원천으로 설정
- localStorage는 영속성을 위한 백업 용도로만 사용

### 2. 자동 동기화
- Redux middleware를 통한 자동 localStorage 저장
- 수동 이벤트 발생 코드 제거

### 3. 타입 안정성
- 데이터 형식 표준화
- 속성명 통일 (qty → quantity, size → selectedSize)

### 4. 코드 품질
- 중복 코드 제거
- 관심사의 분리 (Separation of Concerns)
- Redux 모범 사례 적용

---

## 마이그레이션 가이드

### 기존 코드 패턴 (사용 금지)
```javascript
// ❌ 사용하지 마세요
const cart = storage.get("cart", []);
cart.push(newItem);
storage.set("cart", cart);
window.dispatchEvent(new StorageEvent(...));
```

### 새로운 코드 패턴 (권장)
```javascript
// ✅ 이렇게 사용하세요
import { useDispatch } from "react-redux";
import { addToCart } from "features/cart/slice/cartSlice";

const dispatch = useDispatch();

dispatch(addToCart({
  id: product.id,
  name: product.name,
  price: product.price,
  image: product.image,
  selectedSize: size,
  quantity: qty,
}));
```

---

## 영향받는 컴포넌트

- ✅ [ProductDetail.jsx](frontend/src/features/product/pages/ProductDetail.jsx) - Redux 액션 사용으로 변경
- ✅ [CartPage.jsx](frontend/src/features/cart/pages/CartPage.jsx) - 전면 Redux 마이그레이션
- ✅ [cartSlice.js](frontend/src/features/cart/slice/cartSlice.js) - 하위 호환성 로직 추가
- ℹ️ [Header.jsx](frontend/src/components/layout/Header.jsx) - 변경 없음 (이미 Redux 사용 중)
- ℹ️ [store.js](frontend/src/store/store.js) - 변경 없음 (middleware 이미 구현됨)

---

## 후속 작업

### 완료
- [x] ProductDetail 장바구니 담기 Redux 마이그레이션
- [x] CartPage 전면 Redux 마이그레이션
- [x] 기존 데이터 호환성 보장
- [x] 빌드 테스트 성공

### 권장 사항
- [ ] E2E 테스트 작성 (장바구니 흐름)
- [ ] 성능 모니터링 (Redux DevTools)
- [ ] 다른 페이지에서 localStorage 직접 사용 검토
- [ ] Redux persist 라이브러리 고려 (선택 사항)

---

## 참고 자료

- Redux Toolkit 공식 문서: https://redux-toolkit.js.org/
- Redux Middleware 가이드: https://redux.js.org/tutorials/fundamentals/part-4-store#middleware
- React-Redux Hooks: https://react-redux.js.org/api/hooks

---

## 커밋 정보
- **커밋 해시**: (자동 생성)
- **브랜치**: main
- **관련 이슈**: 장바구니 카운트 업데이트 버그

---

**요약**: localStorage 직접 조작에서 Redux 중심 아키텍처로 전환하여 장바구니 상태 관리의 일관성을 확보하고, 헤더 카운트 실시간 업데이트 문제를 해결했습니다.
