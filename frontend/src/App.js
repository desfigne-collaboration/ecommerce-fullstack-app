// src/App.js
import React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/home/Home";
import Menu from "./pages/menu/Menu";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import AccountRecovery from "./pages/auth/AccountRecovery";
import NaverCallback from "./pages/auth/NaverCallback";
import KakaoCallback from "./pages/auth/KakaoCallback";
import OrderSuccess from "./pages/order/OrderSuccess";

// 관리자
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";

// 상품
import ProductDetail from "./pages/ProductDetail";
import ProductList from "./pages/ProductList";
import Search from "./pages/Search";

// ✅ 결제 라우트(이 두 개만 사용!)
import PaySelect from "./pages/order/PaySelect";
import PayConfirm from "./pages/order/PayConfirm";

// 주문/장바구니
import Checkout from "./pages/order/Checkout";
import MyOrders from "./pages/order/MyOrders";
import CartPage from "./pages/cart/CartPage";

// 카테고리
import CategoryPage from "./pages/CategoryPage";

// 골프
import GolfMain from "./pages/golf/GolfMain";
import GolfNew from "./pages/golf/GolfNew";
import GolfWomen from "./pages/golf/GolfWomen";
import GolfMen from "./pages/golf/GolfMen";

// 럭셔리
import LuxuryMain from "./pages/luxury/LuxuryMain";
import LuxuryNew from "./pages/luxury/LuxuryNew";
import LuxuryWomen from "./pages/luxury/LuxuryWomen";
import LuxuryMen from "./pages/luxury/LuxuryMen";

// 신발
import ShoesMain from "./pages/shoes/ShoesMain";
import ShoesNew from "./pages/shoes/ShoesNew";
import ShoesWomen from "./pages/shoes/ShoesWomen";
import ShoesMen from "./pages/shoes/ShoesMen";

// 라이프
import LifeMain from "./pages/life/LifeMain";
import LifeNew from "./pages/life/LifeNew";
import LifeFurniture from "./pages/life/LifeFurniture";
import LifePet from "./pages/life/LifePet";
import LifeCar from "./pages/life/LifeCar";

// 아울렛
import OutletMain from "./pages/outlet/OutletMain";
import OutletWomen from "./pages/outlet/OutletWomen";
import OutletMen from "./pages/outlet/OutletMen";
import OutletKids from "./pages/outlet/OutletKids";
import OutletLuxury from "./pages/outlet/OutletLuxury";
import OutletShoes from "./pages/outlet/OutletShoes";
import OutletSports from "./pages/outlet/OutletSports";
import OutletGolf from "./pages/outlet/OutletGolf";
import OutletLife from "./pages/outlet/OutletLife";

// 마이페이지
import MyPage from "./pages/mypage/MyPage";
import MyCoupons from "./pages/mypage/MyCoupons";

// 고객센터/회사/정책
import HelpPage from "./pages/help/HelpPage";
import CompanyPage from "./pages/company/CompanyPage";
import Terms from "./pages/policy/Terms";
import Privacy from "./pages/policy/Privacy";
import Membership from "./pages/membership/Membership";
import StoreFinder from "./pages/store/StoreFinder";
import NoticeEvents from "./pages/board/NoticeEvents";
import BulkOrder from "./pages/help/BulkOrder";

// 위시리스트
import Wishlist from "./pages/wish/Wishlist";

function App() {
  return (
    <AuthProvider>
      <Router>
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
          <PrivateRoute exact path="/mypage" component={MyPage} />
          <PrivateRoute path="/mypage/coupons" component={MyCoupons} />

          {/* 주문/장바구니/결제 */}
          <PrivateRoute path="/orders" component={MyOrders} />
          <PrivateRoute path="/cart" component={CartPage} />
          <PrivateRoute path="/checkout" component={Checkout} />
          <Route path="/order/success" component={OrderSuccess} />
          <PrivateRoute path="/mypage/orders" component={MyOrders} />

          {/* ✅ 결제: 'pay/confirm'이 'pay'보다 먼저! */}
          <PrivateRoute exact path="/pay/confirm" component={PayConfirm} />
          <PrivateRoute exact path="/pay" component={PaySelect} />

          {/* 고객센터/회사/정책 */}
          <Route path="/help" component={HelpPage} />
          <Route path="/company" component={CompanyPage} />
          <Route exact path="/terms" component={Terms} />
          <Route exact path="/privacy" component={Privacy} />
          <Route path="/membership" component={Membership} />
          <Route exact path="/stores" component={StoreFinder} />
          <Route exact path="/notice" component={NoticeEvents} />
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
          <Route exact path="/golf" component={GolfMain} />
          <Route path="/golf/new" component={GolfNew} />
          <Route path="/golf/women" component={GolfWomen} />
          <Route path="/golf/men" component={GolfMen} />

          {/* 신발 */}
          <Route exact path="/shoes" component={ShoesMain} />
          <Route path="/shoes/new" component={ShoesNew} />
          <Route path="/shoes/women" component={ShoesWomen} />
          <Route path="/shoes/men" component={ShoesMen} />

          {/* 라이프 */}
          <Route exact path="/life" component={LifeMain} />
          <Route path="/life/new" component={LifeNew} />
          <Route path="/life/furniture" component={LifeFurniture} />
          <Route path="/life/pet" component={LifePet} />
          <Route path="/life/car" component={LifeCar} />

          {/* 럭셔리 */}
          <Route exact path="/luxury" component={LuxuryMain} />
          <Route path="/luxury/new" component={LuxuryNew} />
          <Route path="/luxury/women" component={LuxuryWomen} />
          <Route path="/luxury/men" component={LuxuryMen} />

          {/* 아울렛 */}
          <Route exact path="/outlet" component={OutletMain} />
          <Route path="/outlet/women" component={OutletWomen} />
          <Route path="/outlet/men" component={OutletMen} />
          <Route path="/outlet/kids" component={OutletKids} />
          <Route path="/outlet/luxury" component={OutletLuxury} />
          <Route path="/outlet/shoes" component={OutletShoes} />
          <Route path="/outlet/sports" component={OutletSports} />
          <Route path="/outlet/golf" component={OutletGolf} />
          <Route path="/outlet/life" component={OutletLife} />

          {/* 관리자 */}
          <PrivateRoute path="/admin/orders" component={AdminOrders} />
          <PrivateRoute path="/admin" component={AdminDashboard} />
        </Switch>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
