// src/routes/index.jsx
import React from "react";
import { Route } from "react-router-dom";

// Auth
import Login from "../pages/auth/Login.jsx";
import Signup from "../pages/auth/Signup.jsx";
import AccountRecovery from "../pages/auth/AccountRecovery.jsx";
import NaverCallback from "../pages/auth/NaverCallback.jsx";
import KakaoCallback from "../pages/auth/KakaoCallback.jsx";

// Home & Menu
import Home from "../pages/home/Home.jsx";
import Menu from "../pages/menu/Menu.jsx";

// Product
import ProductDetail from "../pages/ProductDetail.jsx";
import ProductList from "../pages/ProductList.jsx";
import Search from "../pages/Search.jsx";

// Category
import CategoryPage from "../pages/CategoryPage.jsx";

// Order & Cart
import Checkout from "../pages/order/Checkout.jsx";
import MyOrders from "../pages/order/MyOrders.jsx";
import OrderSuccess from "../pages/order/OrderSuccess.jsx";
import CartPage from "../pages/cart/CartPage.jsx";
import PaySelect from "../pages/order/PaySelect.jsx";
import PayConfirm from "../pages/order/PayConfirm.jsx";

// MyPage
import MyPage from "../pages/mypage/MyPage.jsx";
import MyCoupons from "../pages/mypage/MyCoupons.jsx";

// Golf
import GolfMain from "../pages/golf/GolfMain.jsx";
import GolfNew from "../pages/golf/GolfNew.jsx";
import GolfWomen from "../pages/golf/GolfWomen.jsx";
import GolfMen from "../pages/golf/GolfMen.jsx";

// Luxury
import LuxuryMain from "../pages/luxury/LuxuryMain.jsx";
import LuxuryNew from "../pages/luxury/LuxuryNew.jsx";
import LuxuryWomen from "../pages/luxury/LuxuryWomen.jsx";
import LuxuryMen from "../pages/luxury/LuxuryMen.jsx";

// Shoes
import ShoesMain from "../pages/shoes/ShoesMain.jsx";
import ShoesNew from "../pages/shoes/ShoesNew.jsx";
import ShoesWomen from "../pages/shoes/ShoesWomen.jsx";
import ShoesMen from "../pages/shoes/ShoesMen.jsx";

// Life
import LifeMain from "../pages/life/LifeMain.jsx";
import LifeNew from "../pages/life/LifeNew.jsx";
import LifeFurniture from "../pages/life/LifeFurniture.jsx";
import LifePet from "../pages/life/LifePet.jsx";
import LifeCar from "../pages/life/LifeCar.jsx";

// Outlet
import OutletMain from "../pages/outlet/OutletMain.jsx";
import OutletWomen from "../pages/outlet/OutletWomen.jsx";
import OutletMen from "../pages/outlet/OutletMen.jsx";
import OutletKids from "../pages/outlet/OutletKids.jsx";
import OutletLuxury from "../pages/outlet/OutletLuxury.jsx";
import OutletShoes from "../pages/outlet/OutletShoes.jsx";
import OutletSports from "../pages/outlet/OutletSports.jsx";
import OutletGolf from "../pages/outlet/OutletGolf.jsx";
import OutletLife from "../pages/outlet/OutletLife.jsx";

// Brand
import BrandDetail from "../pages/brand/BrandDetail.jsx";

// Admin
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import AdminOrders from "../pages/admin/AdminOrders.jsx";

// Help & Company
import HelpPage from "../pages/help/HelpPage.jsx";
import CompanyPage from "../pages/company/CompanyPage.jsx";
import Terms from "../pages/policy/Terms.jsx";
import Privacy from "../pages/policy/Privacy.jsx";
import Membership from "../pages/membership/Membership.jsx";
import StoreFinder from "../pages/store/StoreFinder.jsx";
import NoticeEvents from "../pages/board/NoticeEvents.jsx";
import BulkOrder from "../pages/help/BulkOrder.jsx";

// Wishlist
import Wishlist from "../pages/wish/Wishlist.jsx";

// PrivateRoute
import PrivateRoute from "./PrivateRoute.jsx";

/**
 * 라우트 설정을 그룹별로 정리
 */

// 공개 라우트 (인증 불필요)
export const publicRoutes = (
  <>
    {/* 홈/메뉴 */}
    <Route path="/" element={<Home />} />
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
    <Route path="/wishlist" element={<Wishlist />} />

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
