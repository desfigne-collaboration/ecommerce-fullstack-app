# 즉시 제거 가능한 파일 정리 (2025-10-30)

## 📋 작업 개요
- **작업 일자**: 2025년 10월 30일
- **작업자**: Claude Code
- **작업 유형**: 미사용 파일 백업 및 제거
- **백업 위치**: `unused-files/immediate-removal/`

---

## 🗑️ 제거된 파일 목록 (총 18개)

### 1. 중복 파일 (7개)

#### 1.1 LoginPage.jsx (중복)
- **원본 경로**: `src/pages/login/LoginPage.jsx`
- **백업 경로**: `unused-files/immediate-removal/src/pages/LoginPage.jsx`
- **제거 이유**: `src/pages/auth/Login.jsx`로 대체됨
- **파일 크기**: 1.5KB
- **관련 파일**: `LoginPage.css` 함께 백업

#### 1.2 Cart.jsx (중복)
- **원본 경로**: `src/pages/Cart.jsx`
- **백업 경로**: `unused-files/immediate-removal/src/pages/Cart.jsx`
- **제거 이유**: `src/pages/cart/CartPage.jsx`로 대체됨

#### 1.3 CategoryPage.jsx (중복)
- **원본 경로**: `src/pages/category/CategoryPage.jsx`
- **백업 경로**: `unused-files/immediate-removal/src/pages/CategoryPage.jsx`
- **제거 이유**: 루트의 `src/pages/CategoryPage.jsx` 사용 중
- **관련 파일**: `CategoryPage.css` 함께 백업

#### 1.4 MyPageCoupons.jsx (중복)
- **원본 경로**: `src/pages/MyPageCoupons.jsx`
- **백업 경로**: `unused-files/immediate-removal/src/pages/MyPageCoupons.jsx`
- **제거 이유**: `src/pages/mypage/MyCoupons.jsx`로 대체됨

#### 1.5 WishlistPage.jsx (중복)
- **원본 경로**: `src/pages/WishlistPage.jsx`
- **백업 경로**: `unused-files/immediate-removal/src/pages/WishlistPage.jsx`
- **제거 이유**: `src/pages/wish/Wishlist.jsx`로 대체됨

#### 1.6 AdminDashboard.jsx (중복)
- **원본 경로**: `src/pages/auth/AdminDashboard.jsx`
- **백업 경로**: `unused-files/immediate-removal/src/pages/AdminDashboard.jsx`
- **제거 이유**: `src/pages/admin/AdminDashboard.jsx`로 대체됨
- **파일 크기**: 726B

#### 1.7 imageUtils.js (중복)
- **원본 경로**: `src/utils/imageUtils.js`
- **백업 경로**: `unused-files/immediate-removal/src/utils/imageUtils.js`
- **제거 이유**: `src/utils/srcOf.js`와 동일한 기능

---

### 2. 미사용 컴포넌트 (6개)

#### 2.1 Hero.jsx
- **원본 경로**: `src/components/Hero.jsx`
- **백업 경로**: `unused-files/immediate-removal/src/components/Hero.jsx`
- **제거 이유**: 어떤 페이지에서도 import되지 않음

#### 2.2 NavBar.jsx
- **원본 경로**: `src/components/NavBar.jsx`
- **백업 경로**: `unused-files/immediate-removal/src/components/NavBar.jsx`
- **제거 이유**: Header.jsx로 대체되어 미사용

#### 2.3 ProductCard.jsx
- **원본 경로**: `src/components/ProductCard.jsx`
- **백업 경로**: `unused-files/immediate-removal/src/components/ProductCard.jsx`
- **제거 이유**: ProductThumb.jsx로 대체되어 미사용

#### 2.4 ProductGrid.jsx
- **원본 경로**: `src/components/ProductGrid.jsx`
- **백업 경로**: `unused-files/immediate-removal/src/components/ProductGrid.jsx`
- **제거 이유**: 어떤 페이지에서도 import되지 않음

#### 2.5 SectionHeader.jsx
- **원본 경로**: `src/components/SectionHeader.jsx`
- **백업 경로**: `unused-files/immediate-removal/src/components/SectionHeader.jsx`
- **제거 이유**: 어떤 페이지에서도 import되지 않음

#### 2.6 WishButton.jsx
- **원본 경로**: `src/components/WishButton.jsx`
- **백업 경로**: `unused-files/immediate-removal/src/components/WishButton.jsx`
- **제거 이유**: 어떤 컴포넌트에서도 import되지 않음

---

### 3. 미사용 페이지 (5개)

#### 3.1 Logout.jsx
- **원본 경로**: `src/pages/auth/Logout.jsx`
- **백업 경로**: `unused-files/immediate-removal/src/pages/Logout.jsx`
- **제거 이유**: Header.jsx에서 로그아웃 기능 직접 처리
- **파일 크기**: 300B

#### 3.2 PaymentMethod.jsx
- **원본 경로**: `src/pages/order/PaymentMethod.jsx`
- **백업 경로**: `unused-files/immediate-removal/src/pages/PaymentMethod.jsx`
- **제거 이유**: App.js 라우트에 미등록, 사용되지 않음

#### 3.3 PaymentGateway.jsx
- **원본 경로**: `src/pages/order/PaymentGateway.jsx`
- **백업 경로**: `unused-files/immediate-removal/src/pages/PaymentGateway.jsx`
- **제거 이유**: App.js 라우트에 미등록, 사용되지 않음

#### 3.4 PayGatewayMock.jsx
- **원본 경로**: `src/pages/payment/PayGatewayMock.jsx`
- **백업 경로**: `unused-files/immediate-removal/src/pages/PayGatewayMock.jsx`
- **제거 이유**: 결제 흐름이 PaySelect → PayConfirm으로 단순화됨

#### 3.5 HomePopularBrands.jsx
- **원본 경로**: `src/pages/home/HomePopularBrands.jsx`
- **백업 경로**: `unused-files/immediate-removal/src/pages/HomePopularBrands.jsx`
- **제거 이유**: Home.jsx에서 사용되지 않음

---

## 🔄 복원 방법

백업된 파일이 필요한 경우, 다음과 같이 복원할 수 있습니다:

```bash
# 개별 파일 복원 예시
cp unused-files/immediate-removal/src/pages/Cart.jsx src/pages/

# 또는 전체 폴더 복원
cp -r unused-files/immediate-removal/src/* src/
```

---

## ⚠️ 주의사항

1. **Git 추적**: 모든 변경사항은 Git으로 추적되므로 언제든 복원 가능합니다.
2. **백업 유지**: `unused-files/` 폴더는 당분간 유지하며, 문제 발생 시 즉시 복원 가능합니다.
3. **의존성 확인**: 제거된 파일들은 전수 점검을 통해 확인된 미사용 파일이지만, 동적 import가 있는 경우 추가 확인이 필요할 수 있습니다.

---

## 📊 정리 효과

- **제거된 파일**: 18개
- **절약된 코드**: 약 10KB+
- **유지보수 향상**: 중복 파일 제거로 코드베이스 명확성 증가
- **혼란 감소**: 사용되지 않는 컴포넌트 제거로 개발 효율성 향상

---

## ✅ 다음 단계

이 문서는 **1단계: 즉시 제거 가능한 파일 처리**의 결과입니다.

다음 단계:
- **2단계**: 서브카테고리 페이지 검토 (Women, Men, Sports - 26개)
- **3단계**: 현재 사용 중인 파일 로직 점검 및 오류 복구

---

**문서 작성일**: 2025-10-30
**문서 버전**: 1.0
**작성자**: Claude Code
