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

// Golf
import GolfMain from "features/category/pages/golf/GolfMain.jsx";
import GolfNew from "features/category/pages/golf/GolfNew.jsx";
import GolfWomen from "features/category/pages/golf/GolfWomen.jsx";
import GolfMen from "features/category/pages/golf/GolfMen.jsx";

// Luxury
import LuxuryMain from "features/category/pages/luxury/LuxuryMain.jsx";
import LuxuryNew from "features/category/pages/luxury/LuxuryNew.jsx";
import LuxuryWomen from "features/category/pages/luxury/LuxuryWomen.jsx";
import LuxuryMen from "features/category/pages/luxury/LuxuryMen.jsx";

// Shoes
import ShoesMain from "features/category/pages/shoes/ShoesMain.jsx";
import ShoesNew from "features/category/pages/shoes/ShoesNew.jsx";
import ShoesWomen from "features/category/pages/shoes/ShoesWomen.jsx";
import ShoesMen from "features/category/pages/shoes/ShoesMen.jsx";

// Life
import LifeMain from "features/category/pages/life/LifeMain.jsx";
import LifeNew from "features/category/pages/life/LifeNew.jsx";
import LifeFurniture from "features/category/pages/life/LifeFurniture.jsx";
import LifePet from "features/category/pages/life/LifePet.jsx";
import LifeCar from "features/category/pages/life/LifeCar.jsx";

// Outlet
import OutletMain from "features/category/pages/outlet/OutletMain.jsx";
import OutletWomen from "features/category/pages/outlet/OutletWomen.jsx";
import OutletMen from "features/category/pages/outlet/OutletMen.jsx";
import OutletKids from "features/category/pages/outlet/OutletKids.jsx";
import OutletLuxury from "features/category/pages/outlet/OutletLuxury.jsx";
import OutletShoes from "features/category/pages/outlet/OutletShoes.jsx";
import OutletSports from "features/category/pages/outlet/OutletSports.jsx";
import OutletGolf from "features/category/pages/outlet/OutletGolf.jsx";
import OutletLife from "features/category/pages/outlet/OutletLife.jsx";

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

    {/* 골프 */}
    <Route path="/golf" element={<GolfMain />} />
    <Route path="/golf/new" element={<GolfNew />} />
    <Route path="/golf/women" element={<GolfWomen />} />
    <Route path="/golf/men" element={<GolfMen />} />

    {/* 신발 */}
    <Route path="/shoes" element={<ShoesMain />} />
    <Route path="/shoes/new" element={<ShoesNew />} />
    <Route path="/shoes/women" element={<ShoesWomen />} />
    <Route path="/shoes/men" element={<ShoesMen />} />

    {/* 라이프 */}
    <Route path="/life" element={<LifeMain />} />
    <Route path="/life/new" element={<LifeNew />} />
    <Route path="/life/furniture" element={<LifeFurniture />} />
    <Route path="/life/pet" element={<LifePet />} />
    <Route path="/life/car" element={<LifeCar />} />

    {/* 럭셔리 */}
    <Route path="/luxury" element={<LuxuryMain />} />
    <Route path="/luxury/new" element={<LuxuryNew />} />
    <Route path="/luxury/women" element={<LuxuryWomen />} />
    <Route path="/luxury/men" element={<LuxuryMen />} />

    {/* 아울렛 */}
    <Route path="/outlet" element={<OutletMain />} />
    <Route path="/outlet/women" element={<OutletWomen />} />
    <Route path="/outlet/men" element={<OutletMen />} />
    <Route path="/outlet/kids" element={<OutletKids />} />
    <Route path="/outlet/luxury" element={<OutletLuxury />} />
    <Route path="/outlet/shoes" element={<OutletShoes />} />
    <Route path="/outlet/sports" element={<OutletSports />} />
    <Route path="/outlet/golf" element={<OutletGolf />} />
    <Route path="/outlet/life" element={<OutletLife />} />

    {/* 브랜드 (동적 라우팅) */}
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
