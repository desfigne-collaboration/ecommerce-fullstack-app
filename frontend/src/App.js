// src/App.js
import React from "react";
import { Route, Switch } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext.js";
import PrivateRoute from "./routes/PrivateRoute.jsx";

import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";

import Home from "./pages/home/Home.jsx";
import Menu from "./pages/menu/Menu.jsx";

import Login from "./pages/auth/Login.jsx";
import Signup from "./pages/auth/Signup.jsx";
import AccountRecovery from "./pages/auth/AccountRecovery.jsx";
import NaverCallback from "./pages/auth/NaverCallback.jsx";
import KakaoCallback from "./pages/auth/KakaoCallback.jsx";
import OrderSuccess from "./pages/order/OrderSuccess.jsx";

// 관리자
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminOrders from "./pages/admin/AdminOrders.jsx";

// 상품
import ProductDetail from "./pages/ProductDetail.jsx";
import ProductList from "./pages/ProductList.jsx";
import Search from "./pages/Search.jsx";

// ✅ 결제 라우트(이 두 개만 사용!)
import PaySelect from "./pages/order/PaySelect.jsx";
import PayConfirm from "./pages/order/PayConfirm.jsx";

// 주문/장바구니
import Checkout from "./pages/order/Checkout.jsx";
import MyOrders from "./pages/order/MyOrders.jsx";
import CartPage from "./pages/cart/CartPage.jsx";

// 카테고리
import CategoryPage from "./pages/CategoryPage.jsx";

// 골프
import GolfMain from "./pages/golf/GolfMain.jsx";
import GolfNew from "./pages/golf/GolfNew.jsx";
import GolfWomen from "./pages/golf/GolfWomen.jsx";
import GolfMen from "./pages/golf/GolfMen.jsx";

// 럭셔리
import LuxuryMain from "./pages/luxury/LuxuryMain.jsx";
import LuxuryNew from "./pages/luxury/LuxuryNew.jsx";
import LuxuryWomen from "./pages/luxury/LuxuryWomen.jsx";
import LuxuryMen from "./pages/luxury/LuxuryMen.jsx";

// 신발
import ShoesMain from "./pages/shoes/ShoesMain.jsx";
import ShoesNew from "./pages/shoes/ShoesNew.jsx";
import ShoesWomen from "./pages/shoes/ShoesWomen.jsx";
import ShoesMen from "./pages/shoes/ShoesMen.jsx";

// 라이프
import LifeMain from "./pages/life/LifeMain.jsx";
import LifeNew from "./pages/life/LifeNew.jsx";
import LifeFurniture from "./pages/life/LifeFurniture.jsx";
import LifePet from "./pages/life/LifePet.jsx";
import LifeCar from "./pages/life/LifeCar.jsx";

// 아울렛
import OutletMain from "./pages/outlet/OutletMain.jsx";
import OutletWomen from "./pages/outlet/OutletWomen.jsx";
import OutletMen from "./pages/outlet/OutletMen.jsx";
import OutletKids from "./pages/outlet/OutletKids.jsx";
import OutletLuxury from "./pages/outlet/OutletLuxury.jsx";
import OutletShoes from "./pages/outlet/OutletShoes.jsx";
import OutletSports from "./pages/outlet/OutletSports.jsx";
import OutletGolf from "./pages/outlet/OutletGolf.jsx";
import OutletLife from "./pages/outlet/OutletLife.jsx";

// 마이페이지
import MyPage from "./pages/mypage/MyPage.jsx";
import MyCoupons from "./pages/mypage/MyCoupons.jsx";

// 고객센터/회사/정책
import HelpPage from "./pages/help/HelpPage.jsx";
import CompanyPage from "./pages/company/CompanyPage.jsx";
import Terms from "./pages/policy/Terms.jsx";
import Privacy from "./pages/policy/Privacy.jsx";
import Membership from "./pages/membership/Membership.jsx";
import StoreFinder from "./pages/store/StoreFinder.jsx";
import NoticeEvents from "./pages/board/NoticeEvents.jsx";
import BulkOrder from "./pages/help/BulkOrder.jsx";

// 위시리스트
import Wishlist from "./pages/wish/Wishlist.jsx";

function App() {
  return (
    <AuthProvider>
      <Header />
      <Switch>
          {/* 홈/메뉴 */}
          <Route exact path="/" component={Home} />
          <Route path="/menu" component={Menu} />

          {/* 로그인/회원가입 */}
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/account/recovery" component={AccountRecovery} />
          <Route path="/naver-callback" component={NaverCallback} />
          <Route path="/kakao-callback" component={KakaoCallback} />

          {/* 마이페이지 */}
          <PrivateRoute exact path="/mypage"><MyPage /></PrivateRoute>
          <PrivateRoute exact path="/mypage/coupons"><MyCoupons /></PrivateRoute>

          {/* 주문/장바구니/결제 */}
          <PrivateRoute exact path="/orders"><MyOrders /></PrivateRoute>
          <PrivateRoute exact path="/cart"><CartPage /></PrivateRoute>
          <PrivateRoute exact path="/checkout"><Checkout /></PrivateRoute>
          <Route exact path="/order/success" component={OrderSuccess} />
          <PrivateRoute exact path="/mypage/orders"><MyOrders /></PrivateRoute>

          {/* ✅ 결제: 'pay/confirm'이 'pay'보다 먼저! */}
          <PrivateRoute exact path="/pay/confirm"><PayConfirm /></PrivateRoute>
          <PrivateRoute exact path="/pay"><PaySelect /></PrivateRoute>

          {/* 고객센터/회사/정책 */}
          <Route path="/help" component={HelpPage} />
          <Route path="/company" component={CompanyPage} />
          <Route path="/terms" component={Terms} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/membership" component={Membership} />
          <Route path="/stores" component={StoreFinder} />
          <Route path="/notice" component={NoticeEvents} />
          <Route path="/bulk-order" component={BulkOrder} />

          {/* 위시리스트 */}
          <Route path="/wishlist" component={Wishlist} />

          {/* 검색/리스트 */}
          <Route path="/search/:keyword" component={Search} />
          <Route path="/list" component={ProductList} />

          {/* 상품 */}
          <Route path="/product/:id" component={ProductDetail} />
          <Route path="/product" component={ProductDetail} />

          {/* 카테고리 */}
          <Route path="/women/:subcategory?" component={CategoryPage} />
          <Route path="/men/:subcategory?" component={CategoryPage} />
          <Route path="/kids/:subcategory?" component={CategoryPage} />
          <Route path="/sports/:subcategory?" component={CategoryPage} />
          <Route path="/beauty/:subcategory?" component={CategoryPage} />

          {/* 골프 */}
          <Route path="/golf" component={GolfMain} />
          <Route path="/golf/new" component={GolfNew} />
          <Route path="/golf/women" component={GolfWomen} />
          <Route path="/golf/men" component={GolfMen} />

          {/* 신발 */}
          <Route path="/shoes" component={ShoesMain} />
          <Route path="/shoes/new" component={ShoesNew} />
          <Route path="/shoes/women" component={ShoesWomen} />
          <Route path="/shoes/men" component={ShoesMen} />

          {/* 라이프 */}
          <Route path="/life" component={LifeMain} />
          <Route path="/life/new" component={LifeNew} />
          <Route path="/life/furniture" component={LifeFurniture} />
          <Route path="/life/pet" component={LifePet} />
          <Route path="/life/car" component={LifeCar} />

          {/* 럭셔리 */}
          <Route path="/luxury" component={LuxuryMain} />
          <Route path="/luxury/new" component={LuxuryNew} />
          <Route path="/luxury/women" component={LuxuryWomen} />
          <Route path="/luxury/men" component={LuxuryMen} />

          {/* 아울렛 */}
          <Route path="/outlet" component={OutletMain} />
          <Route path="/outlet/women" component={OutletWomen} />
          <Route path="/outlet/men" component={OutletMen} />
          <Route path="/outlet/kids" component={OutletKids} />
          <Route path="/outlet/luxury" component={OutletLuxury} />
          <Route path="/outlet/shoes" component={OutletShoes} />
          <Route path="/outlet/sports" component={OutletSports} />
          <Route path="/outlet/golf" component={OutletGolf} />
          <Route path="/outlet/life" component={OutletLife} />

          {/* 관리자 */}
          <PrivateRoute exact path="/admin/orders"><AdminOrders /></PrivateRoute>
          <PrivateRoute exact path="/admin"><AdminDashboard /></PrivateRoute>
      </Switch>
      <Footer />
    </AuthProvider>
  );
}

export default App;
