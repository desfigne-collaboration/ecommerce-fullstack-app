/**
 * ============================================================================
 * routes/index.jsx - 애플리케이션 라우팅 설정
 * ============================================================================
 *
 * 【목적】
 * - React Router v6를 사용한 클라이언트 사이드 라우팅 설정
 * - URL 경로별 페이지 컴포넌트 매핑
 * - 공개/인증 필요 라우트 분리 관리
 *
 * 【라우팅 구조】
 * publicRoutes  (누구나 접근 가능)
 * ├── 홈/메뉴 (/, /menu)
 * ├── 로그인/회원가입 (/login, /signup)
 * ├── 상품 목록/상세 (/product, /search)
 * ├── 카테고리 (/women, /men, /kids 등)
 * ├── 브랜드 (/brand/:brandId)
 * └── 고객센터/정책 (/help, /terms, /privacy)
 *
 * privateRoutes (로그인 필요)
 * ├── 마이페이지 (/mypage)
 * ├── 장바구니 (/cart)
 * ├── 주문/결제 (/checkout, /pay)
 * └── 관리자 (/admin)
 *
 * 【동적 라우팅】
 * - :keyword - 검색 키워드 (예: /search/나이키)
 * - :id - 상품 ID (예: /product/12345)
 * - :subcategory? - 선택적 서브카테고리 (예: /women/outer)
 * - :brandId - 브랜드 ID (예: /brand/nike)
 *
 * 【PrivateRoute 동작 원리】
 * 1. Redux 상태에서 로그인 여부 확인
 * 2. 로그인 안 됨 → /login?redirect={원래경로}로 리다이렉트
 * 3. 로그인 됨 → 자식 컴포넌트 렌더링
 *
 * @author Claude Code
 * @since 2025-11-02
 */

import React from "react";
import { Route } from "react-router-dom";

// ============================================================================
// 페이지 컴포넌트 Import - 인증 (Auth)
// ============================================================================
import Login from "features/auth/pages/Login.jsx";              // 로그인
import Signup from "features/auth/pages/Signup.jsx";            // 회원가입
import AccountRecovery from "features/auth/pages/AccountRecovery.jsx"; // 계정 복구
import NaverCallback from "features/auth/pages/NaverCallback.jsx";     // 네이버 로그인 콜백
import KakaoCallback from "features/auth/pages/KakaoCallback.jsx";     // 카카오 로그인 콜백

// ============================================================================
// 페이지 컴포넌트 Import - 홈 & 메뉴
// ============================================================================
import HomePage from "features/home/pages/HomePage.jsx";        // 메인 홈페이지
import Menu from "features/menu/pages/Menu.jsx";                // 전체 메뉴

// ============================================================================
// 페이지 컴포넌트 Import - 상품 (Product)
// ============================================================================
import ProductDetail from "features/product/pages/ProductDetail.jsx"; // 상품 상세
import ProductList from "features/product/pages/ProductList.jsx";     // 상품 목록 + 카테고리 페이지 통합
import Search from "features/product/pages/Search.jsx";                // 검색 결과

// ============================================================================
// 페이지 컴포넌트 Import - 주문 & 장바구니
// ============================================================================
import Checkout from "features/order/pages/Checkout.jsx";       // 주문/결제
import MyOrders from "features/order/pages/MyOrders.jsx";       // 주문 내역
import OrderSuccess from "features/order/pages/OrderSuccess.jsx"; // 주문 완료
import CartPage from "features/cart/pages/CartPage.jsx";        // 장바구니
import PaySelect from "features/order/pages/PaySelect.jsx";     // 결제 수단 선택
import PayConfirm from "features/order/pages/PayConfirm.jsx";   // 결제 확인

// ============================================================================
// 페이지 컴포넌트 Import - 마이페이지
// ============================================================================
import MyPage from "features/mypage/pages/MyPage.jsx";          // 마이페이지 홈
import MyCoupons from "features/mypage/pages/MyCoupons.jsx";    // 쿠폰함

// ============================================================================
// 페이지 컴포넌트 Import - 브랜드
// ============================================================================
import BrandDetail from "features/brand/pages/BrandDetail.jsx"; // 브랜드 상세

// ============================================================================
// 페이지 컴포넌트 Import - 관리자
// ============================================================================
import AdminDashboard from "features/admin/pages/AdminDashboard.jsx"; // 관리자 대시보드
import AdminOrders from "features/admin/pages/AdminOrders.jsx";       // 관리자 주문 관리

// ============================================================================
// 페이지 컴포넌트 Import - 고객센터 & 회사
// ============================================================================
import HelpPage from "features/help/pages/HelpPage.jsx";        // 고객센터
import CompanyPage from "features/company/pages/CompanyPage.jsx"; // 회사 소개
import Terms from "features/policy/pages/Terms.jsx";            // 이용약관
import Privacy from "features/policy/pages/Privacy.jsx";        // 개인정보처리방침
import Membership from "features/membership/pages/Membership.jsx"; // 멤버십 안내
import StoreFinder from "features/store/pages/StoreFinder.jsx";  // 매장 찾기
import NoticeEvents from "features/board/pages/NoticeEvents.jsx"; // 공지사항/이벤트
import BulkOrder from "features/help/pages/BulkOrder.jsx";       // 대량 주문 문의

// ============================================================================
// 페이지 컴포넌트 Import - 위시리스트
// ============================================================================
import WishlistPage from "features/wishlist/pages/WishlistPage.jsx"; // 찜 목록

// ============================================================================
// 라우트 보호 컴포넌트
// ============================================================================
import PrivateRoute from "routes/PrivateRoute.jsx";             // 로그인 체크 래퍼

// ============================================================================
// Public Routes - 인증 불필요한 페이지들
// ============================================================================
/**
 * publicRoutes
 *
 * @description
 * 로그인 없이 누구나 접근 가능한 공개 페이지들입니다.
 * App.js의 <Routes> 컴포넌트 안에서 렌더링됩니다.
 *
 * @example
 * // App.js에서 사용
 * <Routes>
 *   {publicRoutes}
 *   {privateRoutes}
 * </Routes>
 */
export const publicRoutes = (
  <>
    {/* ============================================================
        홈/메뉴
        ============================================================ */}
    <Route path="/" element={<HomePage />} />          {/* 메인 홈페이지 */}
    <Route path="/menu" element={<Menu />} />          {/* 전체 메뉴 */}

    {/* ============================================================
        로그인/회원가입
        ============================================================ */}
    <Route path="/login" element={<Login />} />                     {/* 로그인 */}
    <Route path="/signup" element={<Signup />} />                   {/* 회원가입 */}
    <Route path="/account/recovery" element={<AccountRecovery />} /> {/* 아이디/비밀번호 찾기 */}
    <Route path="/naver-callback" element={<NaverCallback />} />    {/* 네이버 로그인 리다이렉트 */}
    <Route path="/kakao-callback" element={<KakaoCallback />} />    {/* 카카오 로그인 리다이렉트 */}

    {/* ============================================================
        검색/리스트
        ============================================================ */}
    <Route path="/search/:keyword" element={<Search />} />   {/* 검색 결과 (예: /search/나이키) */}
    <Route path="/list" element={<ProductList />} />         {/* 상품 전체 목록 */}

    {/* ============================================================
        상품 상세
        ============================================================ */}
    <Route path="/product/:id" element={<ProductDetail />} /> {/* 상품 상세 (예: /product/12345) */}
    <Route path="/product" element={<ProductDetail />} />     {/* ID 없는 경우 (state로 전달) */}

    {/* ============================================================
        카테고리 - 모두 ProductList 컴포넌트 사용 (동적 라우팅)
        ProductList는 URL path를 분석하여 카테고리별 상품 표시
        :subcategory?는 선택적 파라미터 (예: /women 또는 /women/outer)
        ============================================================ */}
    <Route path="/women/:subcategory?" element={<ProductList />} />   {/* 여성 (예: /women/outer) */}
    <Route path="/men/:subcategory?" element={<ProductList />} />     {/* 남성 (예: /men/suit) */}
    <Route path="/kids/:subcategory?" element={<ProductList />} />    {/* 키즈 (예: /kids/boy) */}
    <Route path="/sports/:subcategory?" element={<ProductList />} />  {/* 스포츠 (예: /sports/running) */}
    <Route path="/beauty/:subcategory?" element={<ProductList />} />  {/* 뷰티 (예: /beauty/skin) */}
    <Route path="/golf/:subcategory?" element={<ProductList />} />    {/* 골프 (예: /golf/women) */}
    <Route path="/bags-shoes/:subcategory?" element={<ProductList />} />   {/* 백&슈즈 (예: /bags-shoes/women) */}
    <Route path="/life/:subcategory?" element={<ProductList />} />    {/* 라이프 (예: /life/pet) */}
    <Route path="/luxury/:subcategory?" element={<ProductList />} />  {/* 럭셔리 (예: /luxury/women) */}
    <Route path="/outlet/:subcategory?" element={<ProductList />} />  {/* 아울렛 (예: /outlet/women) */}
    <Route path="/brand/:brandId" element={<BrandDetail />} />         {/* 브랜드 (예: /brand/nike) */}

    {/* ============================================================
        고객센터/회사/정책
        ============================================================ */}
    <Route path="/help" element={<HelpPage />} />           {/* 고객센터 */}
    <Route path="/company" element={<CompanyPage />} />     {/* 회사 소개 */}
    <Route path="/terms" element={<Terms />} />             {/* 이용약관 */}
    <Route path="/privacy" element={<Privacy />} />         {/* 개인정보처리방침 */}
    <Route path="/membership" element={<Membership />} />   {/* 멤버십 안내 */}
    <Route path="/stores" element={<StoreFinder />} />      {/* 오프라인 매장 찾기 */}
    <Route path="/notice" element={<NoticeEvents />} />     {/* 공지사항/이벤트 */}
    <Route path="/bulk-order" element={<BulkOrder />} />    {/* 대량 주문 문의 */}

    {/* ============================================================
        위시리스트 (로그인 없이도 접근 가능하지만 기능은 제한적)
        ============================================================ */}
    <Route path="/wishlist" element={<WishlistPage />} />   {/* 찜 목록 */}

    {/* ============================================================
        주문 성공 페이지 (결제 완료 후 리다이렉트)
        ============================================================ */}
    <Route path="/order/success" element={<OrderSuccess />} /> {/* 주문 완료 */}
  </>
);

// ============================================================================
// Private Routes - 로그인 필요한 페이지들
// ============================================================================
/**
 * privateRoutes
 *
 * @description
 * 로그인이 필요한 보호된 페이지들입니다.
 * PrivateRoute 컴포넌트로 감싸져 있어, 로그인하지 않은 사용자는
 * 자동으로 /login 페이지로 리다이렉트됩니다.
 *
 * @example
 * // 로그인 안 된 상태에서 /mypage 접근 시
 * → 자동으로 /login?redirect=/mypage로 이동
 * → 로그인 성공 후 원래 페이지(/mypage)로 복귀
 *
 * @see PrivateRoute.jsx - 로그인 체크 로직 구현
 */
export const privateRoutes = (
  <>
    {/* ============================================================
        마이페이지
        ============================================================ */}
    <Route path="/mypage" element={<PrivateRoute><MyPage /></PrivateRoute>} />                 {/* 마이페이지 홈 */}
    <Route path="/mypage/coupons" element={<PrivateRoute><MyCoupons /></PrivateRoute>} />      {/* 쿠폰함 */}
    <Route path="/mypage/orders" element={<PrivateRoute><MyOrders /></PrivateRoute>} />        {/* 주문 내역 */}

    {/* ============================================================
        주문/장바구니/결제
        ============================================================ */}
    <Route path="/orders" element={<PrivateRoute><MyOrders /></PrivateRoute>} />               {/* 주문 내역 (단축 경로) */}
    <Route path="/cart" element={<PrivateRoute><CartPage /></PrivateRoute>} />                 {/* 장바구니 */}
    <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />             {/* 주문/결제 페이지 */}
    <Route path="/pay/confirm" element={<PrivateRoute><PayConfirm /></PrivateRoute>} />        {/* 결제 확인 (QR 코드 등) */}
    <Route path="/pay" element={<PrivateRoute><PaySelect /></PrivateRoute>} />                 {/* 결제 수단 선택 */}

    {/* ============================================================
        관리자 페이지 (추가 권한 체크 필요 - 현재는 로그인만 체크)
        ============================================================ */}
    <Route path="/admin/orders" element={<PrivateRoute><AdminOrders /></PrivateRoute>} />      {/* 관리자: 주문 관리 */}
    <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />          {/* 관리자: 대시보드 */}
  </>
);
