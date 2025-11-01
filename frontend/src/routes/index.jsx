// src/routes/index.jsx
import React from "react";
import { Route } from "react-router-dom";

// Auth
import Login from "features/auth/pages/Login.jsx";
import Signup from "features/auth/pages/Signup.jsx";
import AccountRecovery from "features/auth/pages/AccountRecovery.jsx";
import NaverCallback from "features/auth/pages/NaverCallback.jsx";
import KakaoCallback from "features/auth/pages/KakaoCallback.jsx";

// Home & Menu
import HomePage from "features/home/pages/HomePage.jsx";
import Menu from "features/menu/pages/Menu.jsx";

// Product
import ProductDetail from "features/product/pages/ProductDetail.jsx";
import ProductList from "features/product/pages/ProductList.jsx";
import Search from "features/product/pages/Search.jsx";

// Category
import CategoryPage from "features/category/pages/CategoryPage.jsx";

// Order & Cart
import Checkout from "features/order/pages/Checkout.jsx";
import MyOrders from "features/order/pages/MyOrders.jsx";
import OrderSuccess from "features/order/pages/OrderSuccess.jsx";
import CartPage from "features/cart/pages/CartPage.jsx";
import PaySelect from "features/order/pages/PaySelect.jsx";
import PayConfirm from "features/order/pages/PayConfirm.jsx";

// MyPage
import MyPage from "features/mypage/pages/MyPage.jsx";
import MyCoupons from "features/mypage/pages/MyCoupons.jsx";

// Brand
import BrandDetail from "features/brand/pages/BrandDetail.jsx";

// Admin
import AdminDashboard from "features/admin/pages/AdminDashboard.jsx";
import AdminOrders from "features/admin/pages/AdminOrders.jsx";

// Help & Company
import HelpPage from "features/help/pages/HelpPage.jsx";
import CompanyPage from "features/company/pages/CompanyPage.jsx";
import Terms from "features/policy/pages/Terms.jsx";
import Privacy from "features/policy/pages/Privacy.jsx";
import Membership from "features/membership/pages/Membership.jsx";
import StoreFinder from "features/store/pages/StoreFinder.jsx";
import NoticeEvents from "features/board/pages/NoticeEvents.jsx";
import BulkOrder from "features/help/pages/BulkOrder.jsx";

// Wishlist
import WishlistPage from "features/wishlist/pages/WishlistPage.jsx";

// PrivateRoute
import PrivateRoute from "routes/PrivateRoute.jsx";

/**
 * 라우트 설정을 그룹별로 정리
 */

// 공개 라우트 (인증 불필요)
export const publicRoutes = (
  <>
    {/* 홈/메뉴 */}
    <Route path="/" element={<HomePage />} />
    <Route path="/menu" element={<Menu />} />

    {/* 로그인/회원가입 */}
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/account/recovery" element={<AccountRecovery />} />
    <Route path="/naver-callback" element={<NaverCallback />} />
    <Route path="/kakao-callback" element={<KakaoCallback />} />

    {/* 검색/리스트 */}
    <Route path="/search/:keyword" element={<Search />} />
    <Route path="/list" element={<ProductList />} />

    {/* 상품 */}
    <Route path="/product/:id" element={<ProductDetail />} />
    <Route path="/product" element={<ProductDetail />} />

    {/* 카테고리 */}
    <Route path="/women/:subcategory?" element={<CategoryPage />} />
    <Route path="/men/:subcategory?" element={<CategoryPage />} />
    <Route path="/kids/:subcategory?" element={<CategoryPage />} />
    <Route path="/sports/:subcategory?" element={<CategoryPage />} />
    <Route path="/beauty/:subcategory?" element={<CategoryPage />} />
    <Route path="/golf/:subcategory?" element={<CategoryPage />} />
    <Route path="/shoes/:subcategory?" element={<CategoryPage />} />
    <Route path="/life/:subcategory?" element={<CategoryPage />} />
    <Route path="/luxury/:subcategory?" element={<CategoryPage />} />
    <Route path="/outlet/:subcategory?" element={<CategoryPage />} />
    <Route path="/brand/:brandId" element={<BrandDetail />} />

    {/* 고객센터/회사/정책 */}
    <Route path="/help" element={<HelpPage />} />
    <Route path="/company" element={<CompanyPage />} />
    <Route path="/terms" element={<Terms />} />
    <Route path="/privacy" element={<Privacy />} />
    <Route path="/membership" element={<Membership />} />
    <Route path="/stores" element={<StoreFinder />} />
    <Route path="/notice" element={<NoticeEvents />} />
    <Route path="/bulk-order" element={<BulkOrder />} />

    {/* 위시리스트 */}
    <Route path="/wishlist" element={<WishlistPage />} />

    {/* 주문 성공 페이지 */}
    <Route path="/order/success" element={<OrderSuccess />} />
  </>
);

// 인증 필요 라우트
export const privateRoutes = (
  <>
    {/* 마이페이지 */}
    <Route path="/mypage" element={<PrivateRoute><MyPage /></PrivateRoute>} />
    <Route path="/mypage/coupons" element={<PrivateRoute><MyCoupons /></PrivateRoute>} />
    <Route path="/mypage/orders" element={<PrivateRoute><MyOrders /></PrivateRoute>} />

    {/* 주문/장바구니/결제 */}
    <Route path="/orders" element={<PrivateRoute><MyOrders /></PrivateRoute>} />
    <Route path="/cart" element={<PrivateRoute><CartPage /></PrivateRoute>} />
    <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
    <Route path="/pay/confirm" element={<PrivateRoute><PayConfirm /></PrivateRoute>} />
    <Route path="/pay" element={<PrivateRoute><PaySelect /></PrivateRoute>} />

    {/* 관리자 */}
    <Route path="/admin/orders" element={<PrivateRoute><AdminOrders /></PrivateRoute>} />
    <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
  </>
);
