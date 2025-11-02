/**
 * ============================================================================
 * Header.jsx - 상단 헤더 컴포넌트
 * ============================================================================
 *
 * 【목적】
 * - 모든 페이지 상단에 공통으로 표시되는 헤더 영역
 * - 네비게이션, 검색, 장바구니, 로그인 등 핵심 기능 제공
 * - 메가메뉴를 통한 카테고리별 상품 탐색
 *
 * 【구조】
 * ┌────────────────────────────────────────────┐
 * │ 🎉 신규 회원 가입 시 10,000원 쿠폰      [×] │  ← Top Banner
 * ├────────────────────────────────────────────┤
 * │ 마이페이지 | 로그인                         │  ← User Menu
 * ├────────────────────────────────────────────┤
 * │ [로고] [검색] [찜] [장바구니] [브랜드로고]  │  ← Logo Section
 * ├────────────────────────────────────────────┤
 * │ 여성 남성 키즈 럭셔리 백&슈즈 스포츠 골프... │  ← Navigation
 * │          ┌─────────────────┐                 │
 * │          │   Mega Menu     │                 │  ← 마우스 호버 시 표시
 * │          │   (드롭다운)    │                 │
 * │          └─────────────────┘                 │
 * └────────────────────────────────────────────┘
 *
 * 【주요 기능】
 * 1. 인증 관리
 *    - Redux 상태를 통한 로그인 여부 확인
 *    - 로그인/로그아웃 처리
 *    - 사용자 정보 표시
 *
 * 2. 검색 기능
 *    - 검색 모달 오픈/닫기
 *    - 키워드 자동완성
 *    - 브랜드 검색
 *    - 최근 검색어 관리 (localStorage)
 *    - 인기 검색어 표시
 *
 * 3. 장바구니 & 찜 관리
 *    - localStorage에서 실시간 카운트 동기화
 *    - 장바구니/찜 페이지로 이동
 *    - 로그인 체크
 *
 * 4. 메가메뉴 시스템
 *    - 카테고리별 드롭다운 메뉴
 *    - 마우스 hover로 메뉴 표시/숨김
 *    - 서브카테고리 및 추천 브랜드 표시
 *
 * 5. 모바일 메뉴
 *    - 햄버거 메뉴 버튼
 *    - 사이드 드로어 메뉴
 *
 * 【Redux 상태 연동】
 * - auth.user: 로그인한 사용자 정보
 * - auth.isLogin: 로그인 여부
 *
 * 【localStorage 데이터】
 * - cart: 장바구니 아이템
 * - wishlist: 찜한 상품
 * - recentSearches: 최근 검색어 (최대 10개)
 *
 * @component
 * @author Claude Code
 * @since 2025-11-02
 */

import "./Header.css";
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, selectIsLogin, logout } from "../../features/auth/slice/authSlice";
import { selectCartCount } from "../../features/cart/slice/cartSlice";
import { getLogout } from "../../features/auth/api/authAPI.js";
import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState, useRef, useMemo } from "react";
import storage from "../../utils/storage.js";

// ============================================================================
// 상수 데이터
// ============================================================================
/**
 * AUTOCOMPLETE_KEYWORDS - 검색 자동완성 키워드
 *
 * @description
 * 사용자가 검색어를 입력할 때 제안되는 키워드 목록입니다.
 * 실제 서비스에서는 서버에서 가져와야 하지만, 현재는 상수로 관리합니다.
 *
 * @constant
 * @type {string[]}
 */
const AUTOCOMPLETE_KEYWORDS = [
  "카디건","가방","가니","남자 가죽 자켓","여성 카디건","메종키츠네 카디건","남자 카디건",
  "발렌시아가","로메르 가방","에잇세컨즈 가방","구호","구호플러스","나이키","니트","니트웨어",
  "단톤","데님","데님팬츠","드레스","띠어리","로고","로퍼","맨투맨","면바지","목도리","무스탕",
  "반팔티","발렌시아가 가방","백팩","뱀부백","부츠","블라우스","빈폴","빈폴레이디스","빈폴키즈",
  "사파리재킷","셔츠","스니커즈","슬랙스","아우터","앵클부츠","야상","에코백","원피스","울코트",
  "자켓","재킷","정장","조끼","청바지","체크셔츠","카라티","코트","크로스백","티셔츠","트렌치코트",
  "트레이닝복","파카","패딩","폴로셔츠","플리츠스커트","후드티","후드집업"
];

/**
 * BRAND_DATA - 브랜드 검색 데이터
 *
 * @description
 * 검색 모달에서 브랜드 검색 시 사용되는 브랜드 정보입니다.
 * 한글명, 영문명, 링크 정보를 포함합니다.
 *
 * @constant
 * @type {Array<{name: string, nameKr?: string, nameEn?: string, link: string}>}
 */
const BRAND_DATA = [
  { name: "GANNI", nameKr: "가니", link: "/brand/ganni" },
  { name: "GANISONG", nameKr: "가니송", link: "/brand/ganisong" },
  { name: "Wilhelmina Garcia", nameKr: "빌헬미나 가르시아", link: "/brand/wilhelmina-garcia" },
  { name: "에잇세컨즈", nameEn: "8SECONDS", link: "/brand/8seconds" },
  { name: "빈폴", nameEn: "BEANPOLE", link: "/brand/beanpole" },
  { name: "빈폴레이디스", nameEn: "BEANPOLE LADIES", link: "/brand/beanpole-ladies" },
  { name: "빈폴키즈", nameEn: "BEANPOLE KIDS", link: "/brand/beanpole-kids" },
  { name: "구호", nameEn: "KUHO", link: "/brand/kuho" },
  { name: "구호플러스", nameEn: "KUHO PLUS", link: "/brand/kuho-plus" },
  { name: "메종키츠네", nameEn: "MAISON KITSUNE", link: "/brand/maison-kitsune" },
  { name: "아미", nameEn: "AMI", link: "/brand/ami" },
  { name: "단톤", nameEn: "DANTON", link: "/brand/danton" },
  { name: "띠어리", nameEn: "THEORY", link: "/brand/theory" },
  { name: "로메르", nameEn: "LEMAIRE", link: "/brand/lemaire" },
  { name: "발렌시아가", nameEn: "BALENCIAGA", link: "/brand/balenciaga" },
  { name: "토리버치", nameEn: "TORY BURCH", link: "/brand/tory-burch" },
  { name: "꽁데가르송", nameEn: "COMME DES GARCONS", link: "/brand/comme-des-garcons" },
  { name: "준지", nameEn: "JUUN.J", link: "/brand/junji" },
];

// ============================================================================
// Header 컴포넌트
// ============================================================================
/**
 * Header 함수형 컴포넌트
 *
 * @description
 * 애플리케이션의 메인 헤더로, 모든 페이지 상단에 공통으로 표시됩니다.
 * 복잡한 상태 관리와 UI 인터랙션을 포함합니다.
 *
 * @returns {JSX.Element} Header UI
 */
export default function Header() {
  // ============================================================
  // Redux 상태 및 기본 hooks
  // ============================================================
  const dispatch = useDispatch();
  const user = useSelector(selectUser);          // 로그인한 사용자 정보
  const isLogin = useSelector(selectIsLogin);    // 로그인 여부
  const cartCount = useSelector(selectCartCount); // 장바구니 아이템 개수 (Redux에서 가져옴)

  const location = useLocation();  // 현재 URL 정보
  const navigate = useNavigate();  // 페이지 이동 함수
  const headerRef = useRef(null);  // 헤더 DOM 요소 참조 (메가메뉴 위치 계산용)

  // ============================================================
  // 로컬 상태 관리
  // ============================================================
  // 찜 카운트
  const [wishCount, setWishCount] = useState(0);

  // UI 상태
  const [searchModalOpen, setSearchModalOpen] = useState(false);   // 검색 모달 표시 여부
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);     // 모바일 메뉴 표시 여부
  const [bannerVisible, setBannerVisible] = useState(true);        // 상단 배너 표시 여부

  // 메가메뉴 상태
  const [activeMenu, setActiveMenu] = useState(null);       // 현재 활성화된 메뉴 ('women', 'men', 등)
  const [menuTopPosition, setMenuTopPosition] = useState(0); // 메가메뉴 top 위치 (헤더 하단)

  // 검색 관련 상태
  const [searchQuery, setSearchQuery] = useState("");           // 현재 입력된 검색어
  const [recentSearches, setRecentSearches] = useState([]);     // 최근 검색어 목록

  // ============================================================
  // 내부 컴포넌트: MegaMenu 래퍼
  // ============================================================
  /**
   * MegaMenu - 메가메뉴 래퍼 컴포넌트
   *
   * @description
   * 각 카테고리의 드롭다운 메뉴를 감싸는 공용 컴포넌트입니다.
   * active 상태에 따라 표시/숨김을 처리합니다.
   *
   * @param {Object} props
   * @param {string} props.id - 메뉴 ID (예: "women", "men")
   * @param {string|null} props.active - 현재 활성화된 메뉴 ID
   * @param {number} props.top - 메뉴의 top 위치 (px)
   * @param {string} [props.cols="2"] - 컬럼 수 ("2" 또는 "3")
   * @param {React.ReactNode} props.children - 메뉴 내용
   */
  const MegaMenu = ({ id, active, top, cols = "2", children }) => (
    <div className={`mega-menu ${active === id ? "active" : ""}`} style={{ top: `${top}px` }}>
      <div className="container">
        <div className={`mega-menu-inner ${cols === "3" ? "cols-3" : ""}`}>{children}</div>
      </div>
    </div>
  );

  // ============================================================
  // 인기 검색어 데이터
  // ============================================================
  /**
   * popularSearches - 인기 검색어 목록
   *
   * @description
   * 검색 모달에 표시되는 인기 검색어 순위입니다.
   * 실제 서비스에서는 서버에서 실시간으로 가져와야 합니다.
   *
   * @type {Array<{rank: number, keyword: string, trend: 'up'|'down'|null}>}
   */
  const popularSearches = [
    { rank: 1, keyword: "에잇세컨즈", trend: null },
    { rank: 2, keyword: "빈폴레이디스", trend: null },
    { rank: 3, keyword: "단톤", trend: null },
    { rank: 4, keyword: "메종키츠네", trend: null },
    { rank: 5, keyword: "로메르", trend: null },
    { rank: 6, keyword: "빈폴키즈", trend: null },
    { rank: 7, keyword: "카디건", trend: null },
    { rank: 8, keyword: "꽁데가르송", trend: "up" },      // 순위 상승
    { rank: 9, keyword: "준지", trend: "down" },          // 순위 하락
    { rank: 10, keyword: "폴리즈클로젯", trend: "down" },
  ];

  // ============================================================
  // Effect: 찜/최근검색어 동기화
  // ============================================================
  /**
   * @description
   * localStorage의 wishlist, recentSearches 데이터를 읽어와
   * 상태에 반영합니다. storage 이벤트를 통해 다른 탭과 동기화됩니다.
   * (장바구니는 Redux store에서 자동 관리)
   */
  useEffect(() => {
    const updateWishCount = () => {
      try { setWishCount((storage.get("wishlist", [])).length); } catch { setWishCount(0); }
    };
    const loadRecentSearches = () => {
      try { setRecentSearches(storage.get("recentSearches", [])); } catch { setRecentSearches([]); }
    };
    const sync = (e) => {
      // StorageEvent를 통한 동기화
      if (e && e.key) {
        if (e.key === "wishlist") updateWishCount();
        // cart는 Redux가 자동으로 처리하므로 제거
        // auth 관련은 Redux가 자동으로 처리하므로 제거
      } else {
        // 초기 로드 시 위시만 동기화
        updateWishCount();
      }
    };
    // 초기 로드
    sync();
    loadRecentSearches();
    // storage 이벤트만 구독 (커스텀 이벤트 제거)
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("storage", sync);
    };
  }, []);

  // ============================================================
  // Effect: 메가메뉴 위치 계산
  // ============================================================
  /**
   * @description
   * 헤더의 하단 좌표를 계산하여 메가메뉴의 top 위치를 설정합니다.
   * 배너 표시 여부, 스크롤, 리사이즈에 따라 재계산됩니다.
   */
  useEffect(() => {
    const computeMenuTop = () => {
      if (!headerRef.current) return;
      const { bottom } = headerRef.current.getBoundingClientRect();
      setMenuTopPosition(bottom);
    };
    computeMenuTop();
    window.addEventListener("resize", computeMenuTop);
    window.addEventListener("scroll", computeMenuTop);
    return () => { window.removeEventListener("resize", computeMenuTop); window.removeEventListener("scroll", computeMenuTop); };
  }, [bannerVisible, location.pathname]);

  // ============================================================
  // 이벤트 핸들러: 인증 & 네비게이션
  // ============================================================
  /**
   * handleLogout - 로그아웃 처리
   *
   * @description
   * 1. 서버에 로그아웃 API 호출
   * 2. 성공 시 Redux 상태 초기화 (localStorage도 함께 정리됨)
   * 3. 홈으로 이동
   */
  const handleLogout = async() => {
    // 로그아웃 API 호출
    const succ = await dispatch(getLogout());

    if(succ) {
      // Redux 상태 업데이트 (localStorage도 함께 정리됨)
      dispatch(logout());
      alert("로그아웃 되었습니다.");
      navigate("/");
    }
  };

  /**
   * handleCartClick - 장바구니 클릭 핸들러
   *
   * @description
   * 로그인하지 않은 경우 로그인 페이지로 이동합니다.
   */
  const handleCartClick = (e) => {
    if (!isLogin) { e.preventDefault(); alert("로그인이 필요합니다."); navigate("/login"); }
  };

  /**
   * handleMyPageClick - 마이페이지 클릭 핸들러
   *
   * @description
   * 로그인하지 않은 경우 로그인 페이지로 이동합니다.
   */
  const handleMyPageClick = (e) => {
    if (!isLogin) { e.preventDefault(); alert("로그인이 필요합니다."); navigate("/login"); }
  };

  // ============================================================
  // 검색 기능: 자동완성 필터링 (useMemo)
  // ============================================================
  /**
   * filteredKeywords - 검색어 자동완성 필터링
   *
   * @description
   * 사용자 입력에 따라 AUTOCOMPLETE_KEYWORDS에서 일치하는 키워드를 필터링합니다.
   * useMemo로 최적화하여 searchQuery가 변경될 때만 재계산합니다.
   */
  const filteredKeywords = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return AUTOCOMPLETE_KEYWORDS.filter((k) => k.toLowerCase().includes(q)).slice(0, 10);
  }, [searchQuery]);

  /**
   * filteredBrands - 브랜드 검색 필터링
   *
   * @description
   * 사용자 입력에 따라 BRAND_DATA에서 일치하는 브랜드를 필터링합니다.
   * 한글명, 영문명 모두 검색 대상입니다.
   */
  const filteredBrands = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return BRAND_DATA.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        (b.nameKr && b.nameKr.toLowerCase().includes(q)) ||
        (b.nameEn && b.nameEn.toLowerCase().includes(q))
    ).slice(0, 10);
  }, [searchQuery]);

  /**
   * handleSearch - 검색 실행 핸들러
   *
   * @description
   * 1. 검색어를 최근 검색어에 추가 (localStorage)
   * 2. /search/:keyword 경로로 이동
   * 3. 검색 모달 닫기
   *
   * @param {string} keyword - 검색할 키워드
   */
  const handleSearch = (keyword) => {
    const raw = (keyword || "").trim();
    if (!raw) return;
    try {
      let recent = storage.get("recentSearches", []);
      recent = recent.filter((item) => item !== raw);
      recent.unshift(raw);
      storage.set("recentSearches", recent.slice(0, 10));
      setRecentSearches(recent.slice(0, 10));
    } catch {}
    navigate(`/search/${encodeURIComponent(raw)}`);
    setSearchModalOpen(false);
  };

  return (
    <>
      {/* Mega overlay */}
      {activeMenu && (
        <div
          className="mega-menu-overlay"
          style={{ top: `${menuTopPosition}px` }}
          onClick={() => setActiveMenu(null)}
        />
      )}

      {/* Top banner */}
      {bannerVisible && (
        <div className="top-banner">
          <div className="container">
            <span>🎉 신규 회원 가입시 10,000원 쿠폰 즉시 지급! </span>
            <Link to="/signup">회원가입 하러 가기 →</Link>
            <button className="banner-close" onClick={() => setBannerVisible(false)} aria-label="배너 닫기">×</button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="header" ref={headerRef}>
        {/* user strip */}
        <div className="user-menu-wrapper">
          <div className="container">
            <div className="user-menu">
              <Link to="/mypage" onClick={handleMyPageClick}>
                마이페이지{isLogin && user?.id === "admin" ? " (관리자님)" : isLogin && user?.name ? ` (${user.name}님)` : ""}
              </Link>
              {/* 관리자 대시보드 메뉴 */}
              {isLogin && user?.id === "admin" && (
                <Link to="/admin" style={{ marginLeft: '0' }}>
                  대시보드 (관리자)
                </Link>
              )}
              {isLogin ? (
                <button onClick={handleLogout} className="logout-btn">로그아웃</button>
              ) : (
                <Link to="/login">로그인</Link>
              )}
            </div>
          </div>
        </div>

        {/* logo & actions */}
        <div className="logo-section">
          <div className="container">
            <div className="logo-section-inner">
              <Link to="/" className="logo">
                <img src="https://ext.same-assets.com/947818454/418726284.svg" alt="SSF SHOP" />
              </Link>

              {/* 관리자가 아닐 때만 검색/찜/장바구니/브랜드 로고 표시 */}
              {user?.id !== "admin" && (
                <div className="header-right">
                  <div className="header-actions">
                    <button className="search-btn" aria-label="검색" onClick={() => setSearchModalOpen(true)}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                        <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </button>

                    {/* Wish → /wishlist */}
                    <Link to="/wishlist" className="wishlist-btn" aria-label="위시리스트">
                      {wishCount > 0 && <span className="cart-count">{wishCount}</span>}
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>

                    {/* Cart → /cart */}
                    <Link to="/cart" className="cart-btn" aria-label="장바구니" onClick={handleCartClick}>
                      <span className="cart-count">{cartCount}</span>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M9 22c.553 0 1-.448 1-1s-.447-1-1-1-1 .448-1 1 .447 1 1 1Z" fill="currentColor" />
                        <path d="M20 22c.553 0 1-.448 1-1s-.447-1-1-1-1 .448-1 1 .447 1 1 1Z" fill="currentColor" />
                        <path d="M1 1h4l2.68 13.39c.09.46.34.874.71 1.168.37.294.83.45 1.3.442h9.72c.47.009.928-.147 1.294-.442.366-.294.616-.708.708-1.168L23 6H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  </div>

                  <div className="nav-divider"></div>

                  <div className="brand-logos">
                    <Link to="/brand/10-corso-como">
                      <img src="https://ext.same-assets.com/947818454/451353350.svg" alt="10 CORSO COMO" />
                    </Link>
                    <Link to="/brand/beaker">
                      <img src="https://ext.same-assets.com/947818454/863943049.svg" alt="BEAKER" />
                    </Link>
                    <Link to="/brand/another">
                      <img src="https://ext.same-assets.com/947818454/2516667277.svg" alt="ANOTHER#" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ===================== NAVIGATION ===================== */}
        {/* 관리자가 아닐 때만 네비게이션 표시 */}
        {user?.id !== "admin" && (
          <div className="nav-section">
            <div className="container">
              <div className="nav-wrapper">
                <nav className="product-nav" onMouseLeave={() => setActiveMenu(null)}>
                <ul>
                  {/* 여성 */}
                  <li className={`nav-item ${activeMenu === "women" ? "open" : ""}`} onMouseEnter={() => setActiveMenu("women")}>
                    <Link to="/women">여성</Link>
                    <MegaMenu id="women" active={activeMenu} top={menuTopPosition} cols="3">
                      <div className="mega-menu-column">
                        <ul>
                          <li><Link to="/women">메인</Link></li>
                          <li><Link to="/women/new">신상품</Link></li>
                          <li><Link to="/women/all">전체 상품</Link></li>
                          <li><Link to="/women/outer">아우터</Link></li>
                          <li><Link to="/women/jacket">재킷/베스트</Link></li>
                          <li><Link to="/women/knit">니트</Link></li>
                          <li><Link to="/women/shirt">셔츠/블라우스</Link></li>
                          <li><Link to="/women/tshirt">티셔츠</Link></li>
                          <li><Link to="/women/onepiece">원피스</Link></li>
                          <li><Link to="/women/pants">팬츠</Link></li>
                        </ul>
                      </div>
                      <div className="mega-menu-column">
                        <ul>
                          <li><Link to="/women/skirt">스커트</Link></li>
                          <li><Link to="/women/loungewear">라운지/언더웨어</Link></li>
                          <li><Link to="/women/beachwear">비치웨어</Link></li>
                          <li><Link to="/women/accessory">패션잡화</Link></li>
                          <li><Link to="/women/jewelry">쥬얼리/시계</Link></li>
                        </ul>
                      </div>
                      <div className="mega-menu-brands">
                        <h4>Top Brand</h4>
                        <div className="brand-list">
                          <Link to="/brand/8seconds">에잇세컨즈</Link>
                          <Link to="/brand/sisley">시에</Link>
                          <Link to="/brand/tory-burch">토리버치</Link>
                          <Link to="/brand/beanpole">빈폴</Link>
                          <Link to="/brand/pleats-please">플리츠 플리츠 이세이 미야케</Link>
                          <Link to="/brand/lemaire">르메르</Link>
                          <Link to="/brand/kuho-plus">구호플러스</Link>
                          <Link to="/brand/rebaige">르베이지</Link>
                          <Link to="/brand/sandsound">센드사운드</Link>
                          <Link to="/brand/ami">아미</Link>
                          <Link to="/brand/junji">준지</Link>
                          <Link to="/brand/general-idea">제너럴아이디어</Link>
                          <Link to="/brand/kuho">구호</Link>
                          <Link to="/brand/danton">단톤</Link>
                          <Link to="/brand/rag-bone">랙앤본</Link>
                          <Link to="/brand/theory">띠어리</Link>
                          <Link to="/brand/lamb">랩</Link>
                          <Link to="/brand/verdemarre">베르데마르</Link>
                          <Link to="/brand/maison-kitsune">메종키츠네</Link>
                          <Link to="/brand/ganni">가니</Link>
                          <Link to="/brand/alice-olivia">엘리스 앤 올리비아</Link>
                          <Link to="/brand/beaker-original">비이커 오리지널</Link>
                          <Link to="/brand/cos">코스</Link>
                          <Link to="/brand/ulala">울랄라</Link>
                          <Link to="/brand/the-frankie">디에퍼처</Link>
                          <Link to="/brand/saint-james">세인트제임스</Link>
                          <Link to="/brand/northface">노스페이스</Link>
                          <Link to="/brand/play-cdg">플레이 꼼데가르송</Link>
                          <Link to="/brand/lacoste">라코스테</Link>
                          <Link to="/brand/r2w">알투더블유</Link>
                        </div>
                      </div>
                    </MegaMenu>
                  </li>

                  {/* 남성 */}
                  <li className={`nav-item ${activeMenu === "men" ? "open" : ""}`} onMouseEnter={() => setActiveMenu("men")}>
                    <Link to="/men">남성</Link>
                    <MegaMenu id="men" active={activeMenu} top={menuTopPosition} cols="3">
                      <div className="mega-menu-column">
                        <ul>
                          <li><Link to="/men">메인</Link></li>
                          <li><Link to="/men/new">신상품</Link></li>
                          <li><Link to="/men/all">전체 상품</Link></li>
                          <li><Link to="/men/outer">아우터</Link></li>
                          <li><Link to="/men/suit">정장</Link></li>
                          <li><Link to="/men/pants">팬츠</Link></li>
                          <li><Link to="/men/jacket">재킷/베스트</Link></li>
                          <li><Link to="/men/shirt">셔츠</Link></li>
                          <li><Link to="/men/knit">니트</Link></li>
                          <li><Link to="/men/tshirt">티셔츠</Link></li>
                        </ul>
                      </div>
                      <div className="mega-menu-column">
                        <ul>
                          <li><Link to="/men/accessory">패션잡화</Link></li>
                          <li><Link to="/men/underwear">언더웨어</Link></li>
                          <li><Link to="/men/beachwear">비치웨어</Link></li>
                          <li><Link to="/men/jewelry">쥬얼리/시계</Link></li>
                        </ul>
                      </div>
                      <div className="mega-menu-brands">
                        <h4>Top Brand</h4>
                        <div className="brand-list">
                          <Link to="/brand/8seconds">에잇세컨즈</Link>
                          <Link to="/brand/homme-plisse">옴므 플리세 이세이 미야케</Link>
                          <Link to="/brand/sandsound">센드사운드</Link>
                          <Link to="/brand/beanpole">빈폴</Link>
                          <Link to="/brand/lacoste">라코스테</Link>
                          <Link to="/brand/captain-sunshine">캡틴 선샤인</Link>
                          <Link to="/brand/ami">아미</Link>
                          <Link to="/brand/danton">단톤</Link>
                          <Link to="/brand/songzio">송지오</Link>
                          <Link to="/brand/junji">준지</Link>
                          <Link to="/brand/beaker-original">비이커 오리지널</Link>
                          <Link to="/brand/shift-edge">시프트지</Link>
                          <Link to="/brand/play-cdg">플레이 꼼데가르송</Link>
                          <Link to="/brand/galaxy-lifestyle">갤럭시라이프스타일</Link>
                          <Link to="/brand/suedspry">수트서플라이</Link>
                          <Link to="/brand/maison-kitsune">메종키츠네</Link>
                          <Link to="/brand/guernsey-woollens">건지울른스</Link>
                          <Link to="/brand/studio-nicholson">스튜디오니콜슨</Link>
                          <Link to="/brand/rokadis">로가디스</Link>
                          <Link to="/brand/lemaire">르메르</Link>
                          <Link to="/brand/fig-and-hell">피그앤헨</Link>
                          <Link to="/brand/theory">띠어리</Link>
                          <Link to="/brand/elvine-clo">앨빈클로</Link>
                          <Link to="/brand/kodak">코닥</Link>
                          <Link to="/brand/lamb">랩</Link>
                          <Link to="/brand/levis">리바이스</Link>
                          <Link to="/brand/lansmere">란스미어</Link>
                          <Link to="/brand/galaxy">갤럭시</Link>
                          <Link to="/brand/daniel-cremieux">다니엘크레뮤</Link>
                          <Link to="/brand/brooks-brothers">브룩스 브라더스</Link>
                        </div>
                      </div>
                    </MegaMenu>
                  </li>

                  {/* 키즈 */}
                  <li className={`nav-item ${activeMenu === "kids" ? "open" : ""}`} onMouseEnter={() => setActiveMenu("kids")}>
                    <Link to="/kids">키즈</Link>
                    <MegaMenu id="kids" active={activeMenu} top={menuTopPosition} cols="3">
                      <div className="mega-menu-column">
                        <ul>
                          <li><Link to="/kids">메인</Link></li>
                          <li><Link to="/kids/new">신상품</Link></li>
                          <li><Link to="/kids/all">전체 상품</Link></li>
                          <li><Link to="/kids/boy">남아</Link></li>
                          <li><Link to="/kids/girl">여아</Link></li>
                          <li><Link to="/kids/baby">베이비</Link></li>
                          <li><Link to="/kids/toy">완구/교구</Link></li>
                          <li><Link to="/kids/gear">용품</Link></li>
                          <li><Link to="/kids/swim">래시가드/수영복</Link></li>
                        </ul>
                      </div>
                      <div className="mega-menu-column">
                        <ul></ul>
                      </div>
                      <div className="mega-menu-brands">
                        <h4>Top Brand</h4>
                        <div className="brand-list">
                          <Link to="/brand/beanpole-kids">빈폴키즈</Link>
                          <Link to="/brand/cocoand">코코얀</Link>
                          <Link to="/brand/hazzys-kids">헤지스키즈</Link>
                          <Link to="/brand/lacoste-kids">라코스테 키즈</Link>
                          <Link to="/brand/pianero-kids">피아네르 키즈</Link>
                          <Link to="/brand/petit-bateau">쁘띠바또</Link>
                          <Link to="/brand/national-geographic-kids">내셔널지오그래픽 키즈</Link>
                          <Link to="/brand/yale-kids">예일 키즈</Link>
                          <Link to="/brand/starter-kids">스터터 키즈</Link>
                          <Link to="/brand/adidas-kids">아디다스 키즈</Link>
                          <Link to="/brand/bonton-toys">본톤 토이즈</Link>
                          <Link to="/brand/matilda-and-why">마틸다앤와이</Link>
                          <Link to="/brand/discovery-kids">디스커버리 키즈</Link>
                          <Link to="/brand/harvard-kids">하버드키즈</Link>
                          <Link to="/brand/miffy-kids">미피키즈</Link>
                          <Link to="/brand/outdoor-products-kids">아웃도어 프로덕츠 키즈</Link>
                          <Link to="/brand/tartine-chocolat">타티네쇼콜라</Link>
                          <Link to="/brand/fila-kids">휠라 키즈</Link>
                          <Link to="/brand/essian">에시앙</Link>
                          <Link to="/brand/mnb-kids">엠엘비 키즈</Link>
                          <Link to="/brand/crocs-kids">크록스키즈</Link>
                          <Link to="/brand/little-m">리틀뎁</Link>
                          <Link to="/brand/millibam">밀리밤</Link>
                          <Link to="/brand/daks-little">닥스리틀</Link>
                          <Link to="/brand/codakids">코닥키즈</Link>
                        </div>
                      </div>
                    </MegaMenu>
                  </li>

                  {/* 럭셔리 */}
                  <li className={`nav-item ${activeMenu === "luxury" ? "open" : ""}`} onMouseEnter={() => setActiveMenu("luxury")}>
                    <Link to="/luxury">럭셔리</Link>
                    <MegaMenu id="luxury" active={activeMenu} top={menuTopPosition} cols="3">
                      <div className="mega-menu-column">
                        <ul>
                          <li><Link to="/luxury">메인</Link></li>
                          <li><Link to="/luxury/new">신상품</Link></li>
                          <li><Link to="/luxury/all">전체 상품</Link></li>
                          <li><Link to="/luxury/women-apparel">여성의류</Link></li>
                          <li><Link to="/luxury/women-bag-wallet">여성가방/지갑</Link></li>
                          <li><Link to="/luxury/women-acc">여성 패션잡화</Link></li>
                          <li><Link to="/luxury/women-shoes">여성슈즈</Link></li>
                          <li><Link to="/luxury/women-jewelry">여성 쥬얼리/시계</Link></li>
                          <li><Link to="/luxury/men-apparel">남성의류</Link></li>
                          <li><Link to="/luxury/men-bag-wallet">남성가방/지갑</Link></li>
                        </ul>
                      </div>
                      <div className="mega-menu-column">
                        <ul>
                          <li><Link to="/luxury/men-acc">남성 패션잡화</Link></li>
                          <li><Link to="/luxury/men-shoes">남성슈즈</Link></li>
                          <li><Link to="/luxury/men-jewelry">남성 쥬얼리/시계</Link></li>
                          <li><Link to="/luxury/eyewear">선글라스/안경테</Link></li>
                        </ul>
                      </div>
                      <div className="mega-menu-brands">
                        <h4>Top Brand</h4>
                        <div className="brand-list">
                          <Link to="/brand/maison-kitsune">메종키츠네</Link>
                          <Link to="/brand/rebaige">르베이지</Link>
                          <Link to="/brand/boss">보스</Link>
                          <Link to="/brand/theory">띠어리</Link>
                          <Link to="/brand/bao-bao">바오 바오 이세이 미야케</Link>
                          <Link to="/brand/moncler">몽클레어</Link>
                          <Link to="/brand/ami">아미</Link>
                          <Link to="/brand/ganni">가니</Link>
                          <Link to="/brand/mytheresa-the-row">[마이테레사] 더 로우</Link>
                          <Link to="/brand/beaker">비이커</Link>
                          <Link to="/brand/me-issey-miyake">미 이세이 미야케</Link>
                          <Link to="/brand/gucci">구찌</Link>
                          <Link to="/brand/pleats-please">플리츠 플리즈 이세이 미야케</Link>
                          <Link to="/brand/issey-miyake">이세이 미야케</Link>
                          <Link to="/brand/diesel">디젤</Link>
                          <Link to="/brand/junji-men">준지 맨</Link>
                          <Link to="/brand/studio-nicholson">스튜디오 니콜슨</Link>
                          <Link to="/brand/maxmara">막스마라</Link>
                          <Link to="/brand/tory-burch">토리버치</Link>
                          <Link to="/brand/cdg-cdg-cdg">CDGCDGCDG</Link>
                          <Link to="/brand/bill-viola">빔바이롤라</Link>
                          <Link to="/brand/lemaire">르메르</Link>
                          <Link to="/brand/burberry">버버리</Link>
                          <Link to="/brand/golden-goose">골든구스 코리아</Link>
                          <Link to="/brand/play-cdg">플레이 꼼데가르송</Link>
                          <Link to="/brand/jacquemus">자크뮈스</Link>
                          <Link to="/brand/suedspry">수트서플라이</Link>
                          <Link to="/brand/homme-plisse">옴므 플리세 이세이 미야케</Link>
                          <Link to="/brand/10-corso-como">10꼬르소꼬모</Link>
                          <Link to="/brand/slowear">슬로웨어</Link>
                        </div>
                      </div>
                    </MegaMenu>
                  </li>

                  {/* 백&슈즈 */}
                  <li className={`nav-item ${activeMenu === "bags-shoes" ? "open" : ""}`} onMouseEnter={() => setActiveMenu("bags-shoes")}>
                    <Link to="/bags-shoes">백&슈즈</Link>
                    <MegaMenu id="bags-shoes" active={activeMenu} top={menuTopPosition} cols="3">
                      <div className="mega-menu-column">
                        <ul>
                          <li><Link to="/bags-shoes">메인</Link></li>
                          <li><Link to="/bags-shoes/new">신상품</Link></li>
                          <li><Link to="/bags-shoes/all">전체 상품</Link></li>
                          <li><Link to="/bags-shoes/women-bag">여성 가방</Link></li>
                          <li><Link to="/bags-shoes/women-wallet">여성 지갑</Link></li>
                          <li><Link to="/bags-shoes/women-shoes">여성 슈즈</Link></li>
                          <li><Link to="/bags-shoes/men-bag">남성 가방</Link></li>
                          <li><Link to="/bags-shoes/men-wallet">남성 지갑</Link></li>
                          <li><Link to="/bags-shoes/men-shoes">남성 슈즈</Link></li>
                          <li><Link to="/bags-shoes/travel">여행 용품</Link></li>
                        </ul>
                      </div>
                      <div className="mega-menu-column">
                        <ul></ul>
                      </div>
                      <div className="mega-menu-brands">
                        <h4>Top Brand</h4>
                        <div className="brand-list">
                          <Link to="/brand/tory-burch">토리버치</Link>
                          <Link to="/brand/adidas">아디다스 코리아</Link>
                          <Link to="/brand/maison-kitsune">메종키츠네</Link>
                          <Link to="/brand/kuho">구호</Link>
                          <Link to="/brand/new-balance">뉴발란스</Link>
                          <Link to="/brand/timberland">팀버랜드</Link>
                          <Link to="/brand/beanpole-accessory">빈폴 액세서리</Link>
                          <Link to="/brand/8seconds">에잇세컨즈</Link>
                          <Link to="/brand/camper">캠퍼</Link>
                          <Link to="/brand/lemaire">르메르</Link>
                          <Link to="/brand/ami-alexandre-mattiussi">아미아칼바</Link>
                          <Link to="/brand/vonk">분크</Link>
                          <Link to="/brand/bao-bao">바오 바오 이세이 미야케</Link>
                          <Link to="/brand/asics">아식스 코리아</Link>
                          <Link to="/brand/ugg">여그</Link>
                          <Link to="/brand/perfume">핏플랍</Link>
                          <Link to="/brand/comme-des-garcons">꼼데가르송</Link>
                          <Link to="/brand/birkenstock-1707">버윅 1707</Link>
                          <Link to="/brand/beaker">비이커</Link>
                          <Link to="/brand/kuho-plus">구호플러스</Link>
                          <Link to="/brand/rebaige">르베이지</Link>
                          <Link to="/brand/le-mouton">르무통</Link>
                          <Link to="/brand/descente">데상트</Link>
                          <Link to="/brand/nike">나이키</Link>
                          <Link to="/brand/10-corso-como">10 꼬르소 꼬모</Link>
                          <Link to="/brand/junji">준지</Link>
                          <Link to="/brand/hoka">호카</Link>
                          <Link to="/brand/onitsuka-tiger">오니츠카 타이거</Link>
                          <Link to="/brand/the-frankie">디에퍼처</Link>
                          <Link to="/brand/vonk2">분크</Link>
                        </div>
                      </div>
                    </MegaMenu>
                  </li>

                  {/* 스포츠 */}
                  <li className={`nav-item ${activeMenu === "sports" ? "open" : ""}`} onMouseEnter={() => setActiveMenu("sports")}>
                    <Link to="/sports">스포츠</Link>
                    <MegaMenu id="sports" active={activeMenu} top={menuTopPosition} cols="3">
                      <div className="mega-menu-column">
                        <ul>
                          <li><Link to="/sports">메인</Link></li>
                          <li><Link to="/sports/new">신상품</Link></li>
                          <li><Link to="/sports/all">전체 상품</Link></li>
                          <li><Link to="/sports/men-apparel">남성의류</Link></li>
                          <li><Link to="/sports/women-apparel">여성의류</Link></li>
                          <li><Link to="/sports/shoes">슈즈</Link></li>
                          <li><Link to="/sports/bag">가방</Link></li>
                          <li><Link to="/sports/gear">스포츠용품</Link></li>
                          <li><Link to="/sports/camping">캠핑용품</Link></li>
                          <li><Link to="/sports/swim">스윔/비치웨어</Link></li>
                        </ul>
                      </div>
                      <div className="mega-menu-column">
                        <ul></ul>
                      </div>
                      <div className="mega-menu-brands">
                        <h4>Top Brand</h4>
                        <div className="brand-list">
                          <Link to="/brand/adidas">아디다스</Link>
                          <Link to="/brand/under-armour">언더아머</Link>
                          <Link to="/brand/dod">디오디</Link>
                          <Link to="/brand/asics">아식스</Link>
                          <Link to="/brand/k2">K2</Link>
                          <Link to="/brand/dynafit">다이나핏</Link>
                          <Link to="/brand/arcteryx">아크테릭스</Link>
                          <Link to="/brand/lamb">랩</Link>
                          <Link to="/brand/puma">푸마</Link>
                          <Link to="/brand/northface">노스페이스</Link>
                          <Link to="/brand/arena">아레나</Link>
                          <Link to="/brand/montbell">몸벨</Link>
                          <Link to="/brand/snow-peak">스노우피크 어패럴</Link>
                          <Link to="/brand/macpac">맥포스</Link>
                          <Link to="/brand/asics2">아치스</Link>
                          <Link to="/brand/descente">데상트</Link>
                          <Link to="/brand/national-geographic">내셔널 지오그래픽 키즈</Link>
                          <Link to="/brand/fjallraven">피엘라벤</Link>
                          <Link to="/brand/le-coq">르꼬끄</Link>
                          <Link to="/brand/sergio-tacchini">세르지오 타키니</Link>
                          <Link to="/brand/diadora">디아도라</Link>
                          <Link to="/brand/patagonia">파타고니아</Link>
                          <Link to="/brand/skechers">스케쳐스</Link>
                          <Link to="/brand/k-swiss">케이스위스</Link>
                          <Link to="/brand/umbro">엄브로</Link>
                          <Link to="/brand/sierra-designs">시에라디자인</Link>
                          <Link to="/brand/fila">휠라</Link>
                          <Link to="/brand/discovery-expedition">디스커버리 익스페디션</Link>
                          <Link to="/brand/pronto-uomo">프론투라인</Link>
                        </div>
                      </div>
                    </MegaMenu>
                  </li>

                  {/* 골프 */}
                  <li className={`nav-item ${activeMenu === "golf" ? "open" : ""}`} onMouseEnter={() => setActiveMenu("golf")}>
                    <Link to="/golf">골프</Link>
                    <MegaMenu id="golf" active={activeMenu} top={menuTopPosition} cols="3">
                      <div className="mega-menu-column">
                        <ul>
                          <li><Link to="/golf">메인</Link></li>
                          <li><Link to="/golf/new">신상품</Link></li>
                          <li><Link to="/golf/all">전체 상품</Link></li>
                          <li><Link to="/golf/women-apparel">여성 골프의류</Link></li>
                          <li><Link to="/golf/women-shoes">여성 골프슈즈</Link></li>
                          <li><Link to="/golf/men-apparel">남성 골프의류</Link></li>
                          <li><Link to="/golf/men-shoes">남성 골프슈즈</Link></li>
                          <li><Link to="/golf/club">골프클럽</Link></li>
                          <li><Link to="/golf/bag">골프백</Link></li>
                          <li><Link to="/golf/acc">골프ACC</Link></li>
                        </ul>
                      </div>
                      <div className="mega-menu-column">
                        <ul>
                          <li><Link to="/golf/balls">골프공</Link></li>
                          </ul>
                      </div>
                      <div className="mega-menu-brands">
                        <h4>Top Brand</h4>
                        <div className="brand-list">
                          <Link to="/brand/beanpole-golf">빈폴골프</Link>
                          <Link to="/brand/duvetica">듀베티카</Link>
                          <Link to="/brand/wide-angle">와이드앵글</Link>
                          <Link to="/brand/lansmere-golf">란스미어 골프</Link>
                          <Link to="/brand/le-coq-golf">르꼬끄골프</Link>
                          <Link to="/brand/ecco-apparel">에코 어패럴</Link>
                          <Link to="/brand/kuho-golf">구호 골프</Link>
                          <Link to="/brand/golden-bear">골든베어</Link>
                          <Link to="/brand/munsingwear">먼싱웨어</Link>
                          <Link to="/brand/tory-sport">토리 스포츠</Link>
                          <Link to="/brand/challenger">챌린저</Link>
                          <Link to="/brand/links-golf">링스골프</Link>
                          <Link to="/brand/malbon">말본 골프</Link>
                          <Link to="/brand/waac">왁</Link>
                          <Link to="/brand/blik">볼빅</Link>
                          <Link to="/brand/pxg">PXG</Link>
                          <Link to="/brand/descente-golf">데상트골프</Link>
                          <Link to="/brand/sunlive">썬러브</Link>
                          <Link to="/brand/anu-golf">어뉴 골프</Link>
                          <Link to="/brand/taylormade">테일러메이드</Link>
                          <Link to="/brand/philipp-plein-golf">필립플레인골프</Link>
                          <Link to="/brand/adidas-golf">아디다스골프</Link>
                          <Link to="/brand/mark-lona">마크앤로나</Link>
                          <Link to="/brand/st-andrews">세인트앤드류스</Link>
                          <Link to="/brand/footjoy">풋조이</Link>
                          <Link to="/brand/martin-golf">마틴골프</Link>
                          <Link to="/brand/pearly-gates">파리게이츠</Link>
                          <Link to="/brand/j-lindeberg">제이린드버그</Link>
                          <Link to="/brand/renoma-golf">레노마골프</Link>
                          <Link to="/brand/hong-garment">혼가먼트</Link>
                        </div>
                      </div>
                    </MegaMenu>
                  </li>

                  {/* 뷰티 */}
                  <li className={`nav-item ${activeMenu === "beauty" ? "open" : ""}`} onMouseEnter={() => setActiveMenu("beauty")}>
                    <Link to="/beauty">뷰티</Link>
                    <MegaMenu id="beauty" active={activeMenu} top={menuTopPosition} cols="3">
                      <div className="mega-menu-column">
                        <ul>
                          <li><Link to="/beauty">메인</Link></li>
                          <li><Link to="/beauty/new">신상품</Link></li>
                          <li><Link to="/beauty/all">전체 상품</Link></li>
                          <li><Link to="/beauty/skincare">스킨케어</Link></li>
                          <li><Link to="/beauty/makeup">메이크업</Link></li>
                          <li><Link to="/beauty/body">핸드 &amp; 바디케어</Link></li>
                          <li><Link to="/beauty/hair">헤어케어</Link></li>
                        </ul>
                      </div>
                      <div className="mega-menu-column">
                        <ul>
                          <li><Link to="/beauty/mens">맨즈케어</Link></li>
                          <li><Link to="/beauty/perfume">향수</Link></li>
                          <li><Link to="/beauty/tools">뷰티소품 &amp; 도구</Link></li>
                          <li><Link to="/beauty/inner">이너뷰티</Link></li>
                          <li><Link to="/beauty/vegan-clean">비건/클린뷰티</Link></li>
                          <li><Link to="/beauty/gift">기프트</Link></li>
                        </ul>
                      </div>
                      <div className="mega-menu-brands">
                        <h4>Top Brand</h4>
                        <div className="brand-list">
                          <Link to="/brand/hera">헤라</Link>
                          <Link to="/brand/ownist">오니스트</Link>
                          <Link to="/brand/orlane">올랑</Link>
                          <Link to="/brand/aromatica">아로마티카</Link>
                          <Link to="/brand/drjart">닥터지</Link>
                          <Link to="/brand/dalba">피에몬테</Link>
                          <Link to="/brand/sulwhasoo">설화수</Link>
                          <Link to="/brand/huxley">헉슬리</Link>
                          <Link to="/brand/vidivici">비디비치</Link>
                          <Link to="/brand/koi">코이</Link>
                          <Link to="/brand/primera">프리메라</Link>
                          <Link to="/brand/canleaf">켄리프</Link>
                          <Link to="/brand/dualsonic">듀얼소닉</Link>
                          <Link to="/brand/evlom">이브롬</Link>
                          <Link to="/brand/aestura">에스트라</Link>
                          <Link to="/brand/sw19">SW19</Link>
                          <Link to="/brand/iope">아이오페</Link>
                          <Link to="/brand/olaplex">올라플렉스</Link>
                          <Link to="/brand/skinfood">스킨푸드</Link>
                          <Link to="/brand/centellian24">센텔리안24</Link>
                          <Link to="/brand/laneige">라네즈</Link>
                          <Link to="/brand/yeonjak">연작</Link>
                          <Link to="/brand/loivie">로이비</Link>
                          <Link to="/brand/kundal">쿤달</Link>
                          <Link to="/brand/glow">글로우</Link>
                          <Link to="/brand/pressshot">프레스샷</Link>
                          <Link to="/brand/risky">리스키</Link>
                          <Link to="/brand/tesoridoriente">테소리도리엔테</Link>
                          <Link to="/brand/gyerimdang">계림당</Link>
                          <Link to="/brand/bibiang">비비앙</Link>
                        </div>
                      </div>
                    </MegaMenu>
                  </li>

                  {/* 라이프 */}
                  <li className={`nav-item ${activeMenu === "life" ? "open" : ""}`} onMouseEnter={() => setActiveMenu("life")}>
                    <Link to="/life">라이프</Link>
                    <MegaMenu id="life" active={activeMenu} top={menuTopPosition} cols="3">
                      <div className="mega-menu-column">
                        <ul>
                          <li><Link to="/life">메인</Link></li>
                          <li><Link to="/life/new">신상품</Link></li>
                          <li><Link to="/life/all">전체 상품</Link></li>
                          <li><Link to="/life/gift">기프트</Link></li>
                          <li><Link to="/life/kitchen-dining">키친/다이닝</Link></li>
                          <li><Link to="/life/bedding-home-fabric">침구/홈패브릭</Link></li>
                          <li><Link to="/life/bath-laundry">욕실/런드리</Link></li>
                          <li><Link to="/life/appliance">가전</Link></li>
                          <li><Link to="/life/digital">디지털</Link></li>
                          <li><Link to="/life/organize">수납/정리</Link></li>
                        </ul>
                      </div>
                      <div className="mega-menu-column">
                        <ul>
                          <li><Link to="/life/furniture">가구</Link></li>
                          <li><Link to="/life/lighting">조명</Link></li>
                          <li><Link to="/life/home-deco">홈데코</Link></li>
                          <li><Link to="/life/home-fragrance">홈 프레그런스</Link></li>
                          <li><Link to="/life/pet">반려동물</Link></li>
                          <li><Link to="/life/food">식품</Link></li>
                          <li><Link to="/life/desk-design">데스크/디자인문구</Link></li>
                          <li><Link to="/life/car">자동차용품</Link></li>
                          <li><Link to="/life/art">아트/컬쳐</Link></li>
                          <li><Link to="/life/giftcard">상품권</Link></li>
                        </ul>
                      </div>
                      <div className="mega-menu-brands">
                        <h4>Top Brand</h4>
                        <div className="brand-list">
                          <Link to="/brand/barensteiger">바겐슈타이거</Link>
                          <Link to="/brand/simmons">시몬스</Link>
                          <Link to="/brand/nespresso">네스프레소</Link>
                          <Link to="/brand/vicfirth">빌레로이앤보흐</Link>
                          <Link to="/brand/maison-kitsune">메종키츠네</Link>
                          <Link to="/brand/garmin">가민</Link>
                          <Link to="/brand/sony">소니</Link>
                          <Link to="/brand/ansdujour">앤스티치</Link>
                          <Link to="/brand/braun">브라운</Link>
                          <Link to="/brand/terryforma">테리파머</Link>
                          <Link to="/brand/rebaige">르베이지</Link>
                          <Link to="/brand/ruena">루메나</Link>
                          <Link to="/brand/jaju">자주</Link>
                          <Link to="/brand/artisan">아티잔</Link>
                          <Link to="/brand/cuckoo">쿠쿠</Link>
                          <Link to="/brand/isendorf">이첸도르프</Link>
                          <Link to="/brand/artemide">아르테미데</Link>
                          <Link to="/brand/logitech">로지텍</Link>
                          <Link to="/brand/staub">스타우브</Link>
                          <Link to="/brand/chosun-hotel">조선호텔</Link>
                          <Link to="/brand/nintendo">닌텐도</Link>
                          <Link to="/brand/miss-match">믹스앤매치</Link>
                          <Link to="/brand/usm">USM</Link>
                          <Link to="/brand/soopra">소프라움앤</Link>
                          <Link to="/brand/denby">덴비</Link>
                          <Link to="/brand/dji">DJI</Link>
                          <Link to="/brand/origo">오리고</Link>
                          <Link to="/brand/nicott">니코트</Link>
                          <Link to="/brand/essa">에싸</Link>
                          <Link to="/brand/tekla">태클라</Link>
                        </div>
                      </div>
                    </MegaMenu>
                  </li>

                  {/* 아울렛 */}
                  <li className={`nav-item ${activeMenu === "outlet" ? "open" : ""}`} onMouseEnter={() => setActiveMenu("outlet")}>
                    <Link to="/outlet">아울렛</Link>
                    <MegaMenu id="outlet" active={activeMenu} top={menuTopPosition} cols="3">
                      <div className="mega-menu-column">
                        <ul>
                          <li><Link to="/outlet">메인</Link></li>
                          <li><Link to="/outlet/all">전체 상품</Link></li>
                          <li><Link to="/outlet/women">여성</Link></li>
                          <li><Link to="/outlet/men">남성</Link></li>
                          <li><Link to="/outlet/kids">키즈</Link></li>
                          <li><Link to="/outlet/luxury">럭셔리</Link></li>
                          <li><Link to="/outlet/bags-shoes">백&슈즈</Link></li>
                        </ul>
                      </div>
                      <div className="mega-menu-column">
                        <ul>
                          <li><Link to="/outlet/sports">스포츠</Link></li>
                          <li><Link to="/outlet/golf">골프</Link></li>
                          <li><Link to="/outlet/beauty">뷰티</Link></li>
                          <li><Link to="/outlet/life">라이프</Link></li>
                        </ul>
                      </div>
                      <div className="mega-menu-brands">
                        <h4>Top Brand</h4>
                        <div className="brand-list">
                          <Link to="/brand/maison-kitsune">메종 키츠네</Link>
                          <Link to="/brand/canucks-lifestyle">갤럭스라이프스타일</Link>
                          <Link to="/brand/petit-bateau">쁘띠바또</Link>
                          <Link to="/brand/beanpole-men">빈폴멘</Link>
                          <Link to="/brand/beanpole-kids">빈폴키즈</Link>
                          <Link to="/brand/lacoste">라코스테</Link>
                          <Link to="/brand/beanpole-ladies">빈폴레이디스</Link>
                          <Link to="/brand/junji">준지</Link>
                          <Link to="/brand/swiss-miss">쉬즈미스</Link>
                          <Link to="/brand/kuho">구호</Link>
                          <Link to="/brand/ami">아미</Link>
                          <Link to="/brand/cleveland-golf">클리브랜드 골프</Link>
                          <Link to="/brand/beaker">비이커</Link>
                          <Link to="/brand/beanpole-accessory">빈폴액세서리</Link>
                          <Link to="/brand/marie-galere">마리끌레르</Link>
                          <Link to="/brand/8seconds">에잇세컨즈</Link>
                          <Link to="/brand/alice-olivia">엘리스 앤 올리비아</Link>
                          <Link to="/brand/renoma-golf">레노마 골프</Link>
                          <Link to="/brand/rokadis">로가디스</Link>
                          <Link to="/brand/rag-bone">랙앤본</Link>
                          <Link to="/brand/gio-songzio">지오송지오</Link>
                          <Link to="/brand/galaxy">갤럭시</Link>
                          <Link to="/brand/mulisha">멜리사</Link>
                          <Link to="/brand/theory">띠어리</Link>
                          <Link to="/brand/le-coq-golf">르꼬끄 골프</Link>
                          <Link to="/brand/beanpole-golf">빈폴골프</Link>
                          <Link to="/brand/snow-peak-apparel">스노우피크 어페럴</Link>
                        </div>
                      </div>
                    </MegaMenu>
                  </li>
                </ul>
              </nav>

              <div className="nav-divider"></div>

              <nav className="sub-nav" onMouseEnter={() => setActiveMenu(null)}>
                <ul>
                  <li><Link to="/ranking">랭킹</Link></li>
                  <li><Link to="/brands">브랜드</Link></li>
                  <li><Link to="/magazine">매거진</Link></li>
                  <li><Link to="/special">기획전</Link></li>
                  <li><Link to="/event">이벤트</Link></li>
                </ul>
              </nav>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu Button */}
      <button className="mobile-menu-btn" aria-label="메뉴" onClick={() => setMobileMenuOpen(true)}>
        <span></span><span></span><span></span>
      </button>

      {/* Search Modal */}
      {searchModalOpen && (
        <div
          className="search-overlay"
          style={{ top: `${menuTopPosition}px` }}
          onClick={(e) => {
            if (e.target.className === "search-overlay") {
              setSearchModalOpen(false);
              setSearchQuery("");
            }
          }}
        >
          <div className="search-content">
            <div className="container">
              <div className="search-header">
                <form className="search-form" onSubmit={(e)=>{e.preventDefault(); handleSearch(searchQuery);}}>
                  <input
                    type="text"
                    placeholder="검색어를 입력하세요"
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  {searchQuery && (
                    <button type="button" className="clear-input-btn" onClick={() => setSearchQuery("")} aria-label="검색어 지우기">×</button>
                  )}
                  <button type="submit" className="search-submit" aria-label="검색">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                      <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                </form>
                <button className="search-close" onClick={() => { setSearchModalOpen(false); setSearchQuery(""); }} aria-label="닫기">×</button>
              </div>

              <div className="search-body">
                {searchQuery.trim() ? (
                  <>
                    <div className="search-section autocomplete-keywords">
                      {filteredKeywords.length > 0 ? (
                        <ul className="autocomplete-list">
                          {filteredKeywords.map((keyword, index) => (
                            <li key={index}>
                              <button className={`autocomplete-keyword ${index === 0 ? "first" : ""}`} onClick={() => handleSearch(keyword)}>{keyword}</button>
                            </li>
                          ))}
                        </ul>
                      ) : <p className="empty-message">검색 결과가 없습니다.</p>}
                    </div>

                    <div className="search-section autocomplete-brands">
                      <h3>브랜드</h3>
                      {filteredBrands.length > 0 ? (
                        <ul className="brand-list-autocomplete">
                          {filteredBrands.map((brand, index) => (
                            <li key={index}>
                              <Link to={brand.link} className="brand-item" onClick={() => setSearchModalOpen(false)}>{brand.name}</Link>
                            </li>
                          ))}
                        </ul>
                      ) : <p className="empty-message">검색 결과가 없습니다.</p>}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="search-section recent-searches">
                      <h3>최근검색어</h3>
                      {recentSearches.length === 0 ? (
                        <p className="empty-message">최근 검색어가 없습니다.</p>
                      ) : (
                        <>
                          <ul className="search-list">
                            {recentSearches.map((keyword, index) => (
                              <li key={index}>
                                <button className="search-keyword" onClick={() => handleSearch(keyword)}>{keyword}</button>
                                <button className="remove-btn" onClick={() => {
                                  try {
                                    let recent = storage.get("recentSearches", []);
                                    recent = recent.filter((i) => i !== keyword);
                                    storage.set("recentSearches", recent);
                                    setRecentSearches(recent);
                                  } catch {}
                                }} aria-label="삭제">×</button>
                              </li>
                            ))}
                          </ul>
                          <button className="clear-all-btn" onClick={() => { try { storage.remove("recentSearches"); setRecentSearches([]); } catch {} }}>전체 삭제</button>
                        </>
                      )}
                    </div>

                    <div className="search-section popular-searches">
                      <div className="section-header">
                        <h3>인기검색어</h3>
                        <div className="header-actions">
                          <span className="update-time">19:00 업데이트</span>
                          <Link to="/ranking" className="view-all">전체보기 &gt;</Link>
                        </div>
                      </div>
                      <ul className="popular-list">
                        {popularSearches.map((item) => (
                          <li key={item.rank}>
                            <span className="rank">{item.rank}</span>
                            <button className="search-keyword" onClick={() => handleSearch(item.keyword)}>{item.keyword}</button>
                            {item.trend === "up" && <span className="trend trend-up">▲</span>}
                            {item.trend === "down" && <span className="trend trend-down">▼</span>}
                            {!item.trend && <span className="trend trend-none">―</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={`mobile-menu ${mobileMenuOpen ? "active" : ""}`}>
          <div className="mobile-menu-header">
            <Link to="/" className="mobile-logo">
              <img src="https://ext.same-assets.com/947818454/418726284.svg" alt="SSF SHOP" />
            </Link>
            <button className="mobile-menu-close" onClick={() => setMobileMenuOpen(false)}>&times;</button>
          </div>
          <nav className="mobile-nav">
            <ul>
              <li><Link to="/women">여성</Link></li>
              <li><Link to="/men">남성</Link></li>
              <li><Link to="/kids">키즈</Link></li>
              <li><Link to="/luxury">럭셔리</Link></li>
              <li><Link to="/shoes">백&슈즈</Link></li>
              <li><Link to="/sports">스포츠</Link></li>
              <li><Link to="/golf">골프</Link></li>
              <li><Link to="/beauty">뷰티</Link></li>
              <li><Link to="/life">라이프</Link></li>
              <li><Link to="/issue">이슈</Link></li>
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}
