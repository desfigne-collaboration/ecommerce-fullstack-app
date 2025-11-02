# 코드베이스 리팩토링 작업 테스크 리스트

**작성일**: 2025-11-02
**작성자**: Claude Code
**기준 문서**: [code-consistency-analysis-2025-11-02.md](./code-consistency-analysis-2025-11-02.md)

---

## 작업 배경

강사님 원본 프로젝트와 비교 분석한 결과, 다음과 같은 구조적 문제가 발견되었습니다:
- State 관리 이중화 (Redux + Context)
- 폴더 구조 중복 (auth/ + login/)
- 브랜드 페이지 하드코딩 (35개 파일)
- 라우트 폭증 (264개)
- localStorage 직접 접근 남발 (60개 파일)

**현재 상황**: 프론트엔드, 백엔드 개발자들이 각자 로컬 환경에서 개발 작업 중
**작업 범위**: 공통 코드베이스의 구조적 문제만 수정 (로컬 테스트용 설정은 유지)

---

## 제외 항목 (로컬 개발/테스트용 유지)

다음 항목들은 **의도적으로 로컬 테스트용**으로 설정된 것이므로 수정하지 않음:
- ✅ `admin/1234` 관리자 계정
- ✅ Mock API 설정
- ✅ 더미 토큰 `"123455dkfdf"`
- ✅ .env 환경 변수 (각자 로컬 설정)

---

## 📋 작업 테스크 리스트

### Task 1: 폴더 중복 제거 (30분) 🔴

**문제**: `pages/auth/`와 `pages/login/` 폴더에 동일 기능 분산

**작업 내용**:
- [ ] `src/pages/login/` 폴더 삭제
- [ ] `src/pages/auth/Login.jsx`로 통합
- [ ] import 경로 수정 (예상 5개 파일)
  ```javascript
  // Before
  import Login from '../pages/login/LoginPage';

  // After
  import Login from '../pages/auth/Login';
  ```
- [ ] 라우팅 경로 통일
  ```javascript
  // App.js 수정
  <Route path="/login" element={<Login />} />
  ```

**예상 효과**: 중복 폴더 제거, 구조 명확화

---

### Task 2: CSS 파일 중복 제거 (20분) 🔴

**문제**: `styles/Header.css`와 `components/Header.css` 동시 존재

**작업 내용**:
- [ ] `src/styles/Header.css` 삭제
- [ ] `src/components/Header.css` 유지 (컴포넌트 기준 배치)
- [ ] import 경로 수정 (예상 3개 파일)
  ```javascript
  // Before
  import './styles/Header.css';

  // After
  import './components/Header.css';
  ```

**예상 효과**: CSS 파일 중복 제거, 관리 포인트 단일화

---

### Task 3: 브랜드 페이지 동적화 (3시간) 🔴

**문제**: 동일 구조 컴포넌트 35개 하드코딩

**작업 내용**:
- [ ] `src/data/brands.json` 생성
  ```json
  [
    {
      "id": "8seconds",
      "name": "8 Seconds",
      "logo": "/assets/brands/8seconds-logo.png",
      "description": "8 Seconds 브랜드 소개",
      "products": []
    },
    {
      "id": "ami",
      "name": "AMI",
      "logo": "/assets/brands/ami-logo.png",
      "description": "AMI 브랜드 소개",
      "products": []
    }
    // ... 35개 브랜드 데이터
  ]
  ```

- [ ] `src/pages/brand/BrandDetail.jsx` 동적 컴포넌트 생성
  ```javascript
  import { useParams } from 'react-router-dom';
  import brandsData from '../../data/brands.json';

  function BrandDetail() {
    const { brandId } = useParams();
    const brand = brandsData.find(b => b.id === brandId);

    if (!brand) return <div>브랜드를 찾을 수 없습니다</div>;

    return (
      <div>
        <h1>{brand.name}</h1>
        <img src={brand.logo} alt={brand.name} />
        <p>{brand.description}</p>
        {/* 기존 Brand*Detail.jsx의 공통 구조 적용 */}
      </div>
    );
  }
  ```

- [ ] `src/components/brands/` 폴더 전체 삭제 (35개 파일)
  - Brand8SecondsDetail.jsx
  - BrandAmiDetail.jsx
  - ... (33개 더)

- [ ] App.js 라우팅 수정
  ```javascript
  // Before (35개 라우트)
  <Route path="/brand/8seconds" element={<Brand8SecondsDetail />} />
  <Route path="/brand/ami" element={<BrandAmiDetail />} />
  // ... 33개 더

  // After (1개 라우트)
  <Route path="/brand/:brandId" element={<BrandDetail />} />
  ```

**예상 효과**: 35개 파일 → 1개 컴포넌트 + 1개 JSON (-97% 코드 감소)

---

### Task 4: 라우팅 최적화 (4시간) 🟡

**문제**: 264개 라우트로 App.js 800줄 비대화

**작업 내용**:
- [ ] 카테고리 동적 라우팅 구현
  ```javascript
  // Before (100개 라우트)
  <Route path="/women/jacket" element={<WomenJacket />} />
  <Route path="/women/shirt" element={<WomenShirt />} />
  <Route path="/women/pants" element={<WomenPants />} />
  // ... 100개

  // After (1개 라우트)
  <Route path="/category/:category/:subcategory" element={<ProductList />} />
  ```

- [ ] Nested Routes 적용
  ```javascript
  <Route path="/" element={<Layout />}>
    <Route index element={<Home />} />
    <Route path="mypage" element={<MyPageLayout />}>
      <Route path="orders" element={<MyOrders />} />
      <Route path="coupons" element={<MyCoupons />} />
      <Route path="wishlist" element={<MyWishlist />} />
    </Route>
  </Route>
  ```

- [ ] `src/routes/index.js` 생성 (라우트 설정 분리)
  ```javascript
  // src/routes/index.js
  import { Route } from 'react-router-dom';
  import Layout from '../components/Layout';
  import Home from '../pages/home/Home';
  // ...

  export const routes = (
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      {/* ... */}
    </Route>
  );
  ```

- [ ] App.js 라인 수 감소
  ```javascript
  // App.js (수정 후)
  import { routes } from './routes';

  function App() {
    return (
      <BrowserRouter>
        <Routes>
          {routes}
        </Routes>
      </BrowserRouter>
    );
  }
  ```

**예상 효과**: 264개 → 50개 이하 라우트 (-80%), App.js 800줄 → 200줄

---

### Task 5: localStorage 유틸리티 생성 (3시간) 🟡

**문제**: 60개 파일에서 localStorage 직접 접근

**작업 내용**:
- [ ] `src/utils/storage.js` 생성
  ```javascript
  /**
   * localStorage 유틸리티
   * 전체 앱에서 일관된 storage 접근 방식 제공
   */
  export const storage = {
    /**
     * localStorage에서 값 가져오기
     * @param {string} key - 저장소 키
     * @param {*} fallback - 값이 없을 때 반환할 기본값
     * @returns {*} 파싱된 값 또는 fallback
     */
    get: (key, fallback = null) => {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
      } catch (error) {
        console.error(`Storage get error for key "${key}":`, error);
        return fallback;
      }
    },

    /**
     * localStorage에 값 저장
     * @param {string} key - 저장소 키
     * @param {*} value - 저장할 값 (자동으로 JSON.stringify)
     */
    set: (key, value) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(`Storage set error for key "${key}":`, error);
      }
    },

    /**
     * localStorage에서 값 삭제
     * @param {string} key - 삭제할 키
     */
    remove: (key) => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error(`Storage remove error for key "${key}":`, error);
      }
    },

    /**
     * localStorage 전체 초기화
     */
    clear: () => {
      try {
        localStorage.clear();
      } catch (error) {
        console.error('Storage clear error:', error);
      }
    }
  };
  ```

- [ ] 60개 파일의 localStorage 직접 접근 수정
  ```javascript
  // Before
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  localStorage.setItem("cart", JSON.stringify(updatedCart));

  // After
  import { storage } from '@/utils/storage';
  const cart = storage.get("cart", []);
  storage.set("cart", updatedCart);
  ```

- [ ] 주요 수정 대상 파일
  - Header.jsx
  - CartPage.jsx
  - ProductDetail.jsx
  - WishlistPage.jsx
  - (기타 57개 파일)

**예상 효과**:
- 일관된 에러 핸들링
- JSON parse/stringify 중복 코드 제거
- 향후 storage 변경 시 한 곳만 수정

---

### Task 6: 커스텀 이벤트 제거 (2시간) 🟡

**문제**: `window.dispatchEvent`로 상태 동기화 (비표준 패턴)

**작업 내용**:
- [ ] 커스텀 이벤트 사용 위치 검색
  ```javascript
  // 검색 패턴
  window.dispatchEvent(new Event("cartUpdated"))
  window.addEventListener("cartUpdated", ...)
  ```

- [ ] Context API로 전환
  ```javascript
  // Before
  localStorage.setItem("cart", JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated")); // ❌ 비표준

  // After
  import { useCart } from '../context/CartContext';
  const { updateCart } = useCart();
  updateCart(cart); // ✅ Context가 자동 리렌더링
  ```

- [ ] CartContext 또는 기존 Context 확장
  ```javascript
  // src/context/CartContext.jsx
  const CartContext = createContext();

  export function CartProvider({ children }) {
    const [cart, setCart] = useState(storage.get("cart", []));

    const updateCart = (newCart) => {
      setCart(newCart);
      storage.set("cart", newCart);
      // 자동으로 구독 컴포넌트 리렌더링
    };

    return (
      <CartContext.Provider value={{ cart, updateCart }}>
        {children}
      </CartContext.Provider>
    );
  }
  ```

**예상 효과**: 표준 React 패턴 적용, 동기화 버그 방지

---

### Task 7: 에러 핸들링 추가 (2시간) 🟢

**문제**: API 호출에 try-catch 없음 → 네트워크 에러 시 앱 크래시

**작업 내용**:
- [ ] `src/utils/errorHandler.js` 생성
  ```javascript
  /**
   * API 에러 핸들러
   * @param {Error} error - 에러 객체
   * @returns {Object} { success: boolean, message: string }
   */
  export const handleApiError = (error) => {
    if (error.response) {
      // 서버가 응답했지만 에러 상태 코드
      return {
        success: false,
        message: error.response.data.message || "서버 오류가 발생했습니다",
        statusCode: error.response.status
      };
    } else if (error.request) {
      // 요청은 보냈지만 응답 없음 (네트워크 에러)
      return {
        success: false,
        message: "네트워크 연결을 확인해주세요"
      };
    } else {
      // 요청 설정 중 에러
      return {
        success: false,
        message: "알 수 없는 오류가 발생했습니다"
      };
    }
  };
  ```

- [ ] API 호출에 try-catch 추가 (약 20곳)
  ```javascript
  // Before
  const result = await axiosPost(url, formData);
  if(result) {
    dispatch(login({userId: formData.id}));
  }

  // After
  import { handleApiError } from '@/utils/errorHandler';

  try {
    const result = await axiosPost(url, formData);
    if(result) {
      dispatch(login({userId: formData.id}));
    }
  } catch(error) {
    const errorInfo = handleApiError(error);
    console.error("로그인 실패:", errorInfo.message);
    alert(errorInfo.message); // 또는 Toast 알림
  }
  ```

**예상 효과**: 앱 안정성 향상, 사용자 친화적 에러 메시지

---

### Task 8: 미사용 코드 정리 (1시간) 🟢

**문제**: 주석 처리된 코드, 미사용 파일 산재

**작업 내용**:
- [ ] 주석 처리된 코드 검색 및 삭제
  ```javascript
  // 검색 패턴
  // const { productList } = useContext(ProductContext);
  // import { useState } from 'react';
  ```

- [ ] 미사용 import 제거
  ```javascript
  // Before
  import { useState, useEffect, useContext } from 'react'; // useContext 사용 안 함

  // After
  import { useState, useEffect } from 'react';
  ```

- [ ] `src/data/` 폴더 미사용 파일 정리
  - 실제 사용되는 JSON 파일만 유지
  - 미사용 Mock 데이터 삭제

**예상 효과**: 코드 가독성 향상, 번들 크기 감소

---

### Task 9: State 관리 정리 (TBD) ⚠️

**문제**: Redux authSlice + AuthContext 동시 사용 → 동기화 버그

**작업 내용** (팀 결정 후 진행):
- [ ] **옵션 A**: AuthContext만 사용 (Redux auth 삭제)
  - Redux authSlice.js 삭제
  - store.js에서 auth reducer 제거
  - `useSelector(state => state.auth)` → `useAuth()` 전환 (15개 파일)

- [ ] **옵션 B**: Redux만 사용 (AuthContext 삭제)
  - AuthContext.jsx 삭제
  - `useAuth()` → `useSelector(state => state.auth)` 전환

**결정 필요 사항**:
- 프로젝트의 State 관리 방향성 (Redux 중심 vs Context 중심)
- 백엔드 개발자와 협의 필요 (API 연동 방식)

---

## 📊 작업 예상 시간

| Task | 예상 시간 | 우선순위 | 상태 |
|------|----------|---------|------|
| Task 1: 폴더 중복 제거 | 30분 | 🔴 High | ⏳ 대기 중 |
| Task 2: CSS 중복 제거 | 20분 | 🔴 High | ⏳ 대기 중 |
| Task 3: 브랜드 페이지 동적화 | 3시간 | 🔴 High | ⏳ 대기 중 |
| Task 4: 라우팅 최적화 | 4시간 | 🟡 Medium | ⏳ 대기 중 |
| Task 5: localStorage 유틸리티 | 3시간 | 🟡 Medium | ⏳ 대기 중 |
| Task 6: 커스텀 이벤트 제거 | 2시간 | 🟡 Medium | ⏳ 대기 중 |
| Task 7: 에러 핸들링 추가 | 2시간 | 🟢 Low | ⏳ 대기 중 |
| Task 8: 미사용 코드 정리 | 1시간 | 🟢 Low | ⏳ 대기 중 |
| Task 9: State 관리 정리 | TBD | ⚠️ 결정 필요 | ⏸️ 보류 |
| **총 예상 시간** | **약 16시간** | - | - |

---

## 🚀 권장 작업 순서

### Phase 1: Quick Wins (4시간)
1. Task 1: 폴더 중복 제거 (30분)
2. Task 2: CSS 중복 제거 (20분)
3. Task 3: 브랜드 페이지 동적화 (3시간)

**효과**: 코드 라인 수 -2,000줄, 중복 제거

### Phase 2: 구조 개선 (9시간)
4. Task 4: 라우팅 최적화 (4시간)
5. Task 5: localStorage 유틸리티 (3시간)
6. Task 6: 커스텀 이벤트 제거 (2시간)

**효과**: 유지보수성 +200%, 표준 패턴 적용

### Phase 3: 품질 향상 (3시간)
7. Task 7: 에러 핸들링 추가 (2시간)
8. Task 8: 미사용 코드 정리 (1시간)

**효과**: 안정성 향상, 번들 크기 감소

### Phase 4: 팀 결정 후 진행
9. Task 9: State 관리 정리 (TBD)

---

## 📝 작업 진행 상황

- [ ] 문서 작성 완료
- [ ] Git 커밋 및 푸시
- [ ] Task 1 시작
- [ ] Task 2 시작
- [ ] Task 3 시작
- [ ] ...

---

## 📌 주의사항

### 협업 중이므로 주의할 점
- 작업 전 git pull 필수
- 각 Task 완료 후 커밋 (단위별 커밋)
- Breaking Change 최소화
- 로컬 테스트용 설정 절대 수정 금지

### Git 커밋 메시지 규칙
```
[리팩토링] Task N: 작업 제목

- 상세 작업 내용 1
- 상세 작업 내용 2

관련 문서: docs/refactoring-task-list-2025-11-02.md
```

---

**문서 작성**: Claude Code
**작성일**: 2025-11-02
**버전**: 1.0
**다음 단계**: Git 커밋 후 Task 1부터 순차 진행
