# 관리자 계정 쿠폰 중복 발급 문제

## 발생 일시
2025-10-29

## 증상
- 관리자 계정에 "신규가입 1만원 할인 쿠폰"이 2개 발급됨
- 일반 사용자도 회원가입 시 동일한 쿠폰이 중복 발급될 가능성 존재

## 원인 분석

### 1. 중복된 Signup 컴포넌트 존재
프로젝트에 2개의 Signup.jsx 파일이 존재:

```
frontend/src/pages/Signup.jsx          (간단 버전)
frontend/src/pages/auth/Signup.jsx     (정식 버전)
```

### 2. App.js 라우팅 설정
```javascript
// src/App.js (Line 14-15)
import Signup from "./pages/auth/Signup.jsx";

// Line 142
<Route path="/signup" element={<Signup />} />
```

**실제 사용되는 컴포넌트**: `auth/Signup.jsx`

### 3. 쿠폰 발급 로직 충돌

#### A. pages/Signup.jsx (미사용)
```javascript
const { login, issueWelcomeCouponIfNeeded } = useAuth();

const onSubmit = (e) => {
  e.preventDefault();
  login({ id: `u_${Date.now()}`, name: form.name, email: form.email });

  // 웰컴쿠폰 발급
  setTimeout(() => {
    issueWelcomeCouponIfNeeded();  // ❌ 함수가 AuthContext에 없음
  }, 0);

  navigate("/mypage/coupons");
};
```

#### B. pages/auth/Signup.jsx (실제 사용)
```javascript
// 신규 회원 쿠폰 지급 (Line 297-314)
const savedCoupons = JSON.parse(localStorage.getItem("coupons") || "[]");
const hasWelcomeCoupon = savedCoupons.some((c) => c.id === "welcome-10000");

if (!hasWelcomeCoupon) {
  const newCoupon = {
    id: "welcome-10000",
    name: "신규가입 1만원 할인 쿠폰",
    amount: 10000,
    type: "fixed",
    discount: "₩10,000",
    used: false,
    createdAt: new Date().toISOString(),
  };

  const updatedCoupons = [...savedCoupons, newCoupon];
  localStorage.setItem("coupons", JSON.stringify(updatedCoupons));
}
```

#### C. AuthContext.js
```javascript
// ❌ issueWelcomeCouponIfNeeded 함수가 정의되지 않음
export const AuthProvider = ({ children }) => {
  // ...
  return (
    <AuthContext.Provider value={{ user, ready, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### 4. 중복 발급 시나리오

1. **첫 번째 쿠폰 발급**:
   - `auth/Signup.jsx`의 회원가입 로직에서 localStorage에 직접 쿠폰 추가
   - 중복 체크: `hasWelcomeCoupon` 확인

2. **두 번째 쿠폰 발급 (추정)**:
   - 다른 경로(브랜드 상세 페이지, 프로모션 등)에서 쿠폰 발급 로직 중복 실행
   - 또는 개발/테스트 중 수동으로 localStorage 조작

### 5. 추가 발견 사항

여러 브랜드 상세 페이지에서도 쿠폰 발급 기능 존재:
- `BrandBeanpoleDetail.jsx`
- `Brand8SecondsDetail.jsx`
- `BrandTheoryDetail.jsx`
- `BrandCommeDetail.jsx`
- 등등...

이들 컴포넌트에서도 각자 쿠폰을 발급하고 있어, 전체적인 쿠폰 관리 시스템이 분산되어 있음.

## 해결 방법

### 1. 중복 파일 제거
```bash
rm frontend/src/pages/Signup.jsx
```

**이유**: `auth/Signup.jsx`만 사용되므로 혼란 방지

### 2. AuthContext에 쿠폰 발급 함수 추가

```javascript
// src/context/AuthContext.js
export const AuthProvider = ({ children }) => {
  // ... 기존 코드 ...

  // ✅ 신규 회원 웰컴 쿠폰 발급 (중복 방지)
  const issueWelcomeCouponIfNeeded = () => {
    const savedCoupons = JSON.parse(localStorage.getItem("coupons") || "[]");
    const hasWelcomeCoupon = savedCoupons.some((c) => c.id === "welcome-10000");

    if (!hasWelcomeCoupon) {
      const newCoupon = {
        id: "welcome-10000",
        name: "신규가입 1만원 할인 쿠폰",
        amount: 10000,
        type: "fixed",
        discount: "₩10,000",
        used: false,
        createdAt: new Date().toISOString(),
      };

      const updatedCoupons = [...savedCoupons, newCoupon];
      localStorage.setItem("coupons", JSON.stringify(updatedCoupons));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      ready,
      login,
      logout,
      issueWelcomeCouponIfNeeded  // ✅ 추가
    }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### 3. auth/Signup.jsx 리팩토링

```javascript
// src/pages/auth/Signup.jsx
import { useAuth } from "../../context/AuthContext";

export default function Signup() {
  const { issueWelcomeCouponIfNeeded } = useAuth();  // ✅ AuthContext에서 가져오기

  const handleSignup = (e) => {
    // ... 회원가입 로직 ...

    if (!result.ok) {
      alert(result.message);
      return;
    }

    // ✅ 신규 회원 웰컴 쿠폰 발급 (AuthContext의 중복 방지 함수 사용)
    issueWelcomeCouponIfNeeded();

    alert("회원가입이 완료되었습니다! 🎉");
    navigate("/login");
  };
}
```

**변경 사항**:
- 기존: Signup.jsx 내부에서 localStorage 직접 조작 (297-314행)
- 개선: AuthContext의 `issueWelcomeCouponIfNeeded()` 함수 사용

## 중복 방지 메커니즘

### 쿠폰 ID 기반 중복 체크
```javascript
const hasWelcomeCoupon = savedCoupons.some((c) => c.id === "welcome-10000");

if (!hasWelcomeCoupon) {
  // 쿠폰 발급
}
```

**작동 원리**:
1. localStorage의 `coupons` 배열 로드
2. `id === "welcome-10000"` 쿠폰이 이미 존재하는지 확인
3. 존재하지 않을 때만 새 쿠폰 추가

## 기대 효과

### 1. 중복 발급 방지
- 동일한 쿠폰 ID로 중복 체크
- 한 번만 발급되도록 보장

### 2. 코드 일관성 개선
- 쿠폰 발급 로직이 AuthContext에 중앙화
- 여러 곳에서 동일한 함수 재사용 가능

### 3. 유지보수성 향상
- 쿠폰 발급 로직 수정 시 한 곳만 수정
- 중복 코드 제거

## 추가 권장 사항

### 1. 쿠폰 관리 시스템 통합
현재 각 브랜드 상세 페이지에서 개별적으로 쿠폰을 발급하고 있음.
전체 쿠폰 관리를 위해 별도의 쿠폰 서비스 모듈 생성 권장:

```javascript
// src/services/couponService.js
export const CouponService = {
  issueCoupon: (couponData) => { /* ... */ },
  getUserCoupons: () => { /* ... */ },
  useCoupon: (couponId) => { /* ... */ },
  checkDuplicate: (couponId) => { /* ... */ }
};
```

### 2. 쿠폰 데이터 구조 표준화
모든 쿠폰이 동일한 데이터 구조를 따르도록 인터페이스 정의:

```typescript
interface Coupon {
  id: string;           // 고유 ID
  name: string;         // 쿠폰 이름
  amount: number;       // 할인 금액
  type: 'fixed' | 'percent';  // 할인 타입
  discount: string;     // 표시용 할인 정보
  used: boolean;        // 사용 여부
  createdAt: string;    // 발급 일시
  expiresAt?: string;   // 만료 일시 (선택)
}
```

### 3. localStorage 대신 서버 관리 고려
현재는 localStorage에 쿠폰 정보를 저장하고 있으나, 다음 이유로 서버 관리 권장:
- 브라우저 간 동기화 불가
- 사용자가 localStorage 삭제 시 쿠폰 복구 불가
- 쿠폰 부정 사용 방지 어려움

## 테스트 시나리오

### 1. 정상 케이스
1. 신규 회원가입
2. 쿠폰 1개만 발급 확인
3. localStorage 확인: `welcome-10000` 쿠폰 1개 존재

### 2. 중복 방지 확인
1. localStorage에 쿠폰 수동 추가
2. 회원가입 재시도
3. 쿠폰이 추가로 발급되지 않음 확인

### 3. 쿠폰 사용 후
1. 쿠폰 사용: `used: true`로 변경
2. 신규 쿠폰 발급 불가 확인

## 관련 파일

- [frontend/src/context/AuthContext.js](../../frontend/src/context/AuthContext.js)
- [frontend/src/pages/auth/Signup.jsx](../../frontend/src/pages/auth/Signup.jsx)
- ~~[frontend/src/pages/Signup.jsx](../../frontend/src/pages/Signup.jsx)~~ (삭제됨)

## 참고 자료

- [React Context API](https://react.dev/reference/react/useContext)
- [localStorage Best Practices](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
