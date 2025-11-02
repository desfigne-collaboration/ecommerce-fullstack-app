/**
 * ============================================================================
 * CategoryPage.jsx - 카테고리별 상품 목록 페이지
 * ============================================================================
 *
 * 【목적】
 * - 카테고리(women, men, kids 등) 및 서브카테고리(outer, jacket 등)별 상품 목록 표시
 * - Redux 기반 위시리스트 통합 (실시간 토글)
 * - Breadcrumb 네비게이션 제공
 * - 상품 클릭 시 상세 페이지 이동
 *
 * 【주요 기능】
 * 1. **경로 기반 카테고리 감지**: URL pathname에서 카테고리/서브카테고리 추출
 * 2. **CATEGORY_DATA 기반 메타 정보**: 탭, 제목, 상품 개수 등
 * 3. **Redux Wishlist 연동**: selectWishlistItems로 찜 목록 조회, toggleWishlistAction으로 토글
 * 4. **상품 데이터 로드**: getProductsByCategory()로 카테고리별 상품 배열 가져오기
 * 5. **Breadcrumb**: Home > 카테고리 > 서브카테고리
 * 6. **이미지 폴백**: onError 핸들러로 placeholder 표시
 *
 * 【경로 예시】
 * - /women → women 전체 (main)
 * - /women/outer → women 아우터
 * - /men/jacket → men 재킷
 *
 * 【Redux State】
 * - wishlistItems: Redux에서 관리하는 위시리스트 배열
 * - toggleWishlistAction: 위시리스트 추가/제거 액션
 *
 * 【주요 함수】
 * - toggleWishlist: 위시리스트 토글 (Redux 액션 디스패치)
 * - goToProductDetail: 상품 상세 페이지 이동 (localStorage 저장 + navigate)
 *
 * @component
 * @author Claude Code
 * @since 2025-11-02
 */

// src/pages/CategoryPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { CATEGORY_DATA } from "../data/categoryData";
import { getProductsByCategory } from "../../product/data/productData";
import { productKey, selectWishlistItems, toggleWishlist as toggleWishlistAction } from "../../wishlist/slice/wishlistSlice";
import storage from "../../../utils/storage.js";
import "../../../styles/Page.css";
import "../../../styles/CategoryPage.css";

/**
 * srcOf - 이미지 경로 보정 (간소화 버전)
 *
 * @description
 * 상품 객체에서 이미지 경로를 추출하고 절대 URL로 변환합니다.
 * 외부 URL은 그대로 반환하고, 로컬 경로는 PUBLIC_URL 기준으로 변환합니다.
 *
 * @param {Object} p - 상품 객체 (image 또는 img 속성 포함)
 * @returns {string} 절대 이미지 URL
 */
const srcOf = (p) => {
  const url = p?.image || p?.img || "";
  if (!url) return `${process.env.PUBLIC_URL}/images/placeholder.png`;
  if (/^https?:\/\//i.test(url)) return url;
  const cleaned = url.replace(/^\.?\/*/, "");
  return cleaned.startsWith("images/")
    ? `${process.env.PUBLIC_URL}/${cleaned}`
    : `${process.env.PUBLIC_URL}/images/${cleaned}`;
};

/**
 * formatPrice - 가격 포맷팅
 *
 * @description
 * 숫자 또는 문자열 가격을 한국 원화 형식으로 변환합니다.
 * 천 단위 콤마를 추가하고 "원" 단위를 붙입니다.
 *
 * @param {string|number} v - 가격 값
 * @returns {string} "50,000원" 형태의 포맷된 가격
 */
const formatPrice = (v) => {
  const n = typeof v === "number" ? v : Number(String(v).replace(/[^\d]/g, "")) || 0;
  return n.toLocaleString() + "원";
};

/**
 * pidOf - 상품 ID 추출/생성
 *
 * @description
 * 상품 객체에서 ID를 추출합니다. 여러 속성을 우선순위에 따라 시도하고,
 * 모두 없으면 productKey 헬퍼 또는 인덱스 기반 ID를 생성합니다.
 *
 * @param {Object} p - 상품 객체
 * @param {number} idx - 배열 인덱스 (폴백용)
 * @returns {string} 상품 ID
 */
const pidOf = (p, idx) => p?.id ?? p?.code ?? p?.pid ?? productKey(p) ?? `cat-${idx}`;

/**
 * CategoryPage 함수형 컴포넌트
 *
 * @description
 * 카테고리별 상품 목록을 표시하는 메인 페이지 컴포넌트.
 * Redux 위시리스트 통합, 경로 기반 카테고리 감지, Breadcrumb 네비게이션 제공.
 *
 * 【처리 흐름】
 * 1. **경로 파싱**: pathname에서 categoryKey, subcategoryKey 추출
 * 2. **데이터 로드**: CATEGORY_DATA에서 메타 정보 가져오기
 * 3. **상품 로드**: getProductsByCategory()로 상품 배열 가져오기
 * 4. **위시리스트 연동**: Redux에서 위시리스트 상태 조회
 * 5. **렌더링**: Breadcrumb + 탭 + 상품 그리드
 *
 * 【State】
 * - activeTab: 현재 활성 탭 ("전체", "아우터" 등)
 * - products: 현재 카테고리의 상품 배열
 *
 * @returns {JSX.Element} 카테고리 페이지 UI
 */
export default function CategoryPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const pathname = location.pathname;
  const pathParts = pathname.split("/").filter(Boolean);
  const categoryKey = pathParts[0];
  const subcategoryKey = pathParts[1] || "main";

  const categoryData = CATEGORY_DATA[categoryKey];

  const [activeTab, setActiveTab] = useState("");
  const [products, setProducts] = useState([]);

  // ✅ Redux wishlist 사용
  const wishlistItems = useSelector(selectWishlistItems);
  const wishSet = useMemo(() => new Set(wishlistItems.map((it) => it.id)), [wishlistItems]);

  useEffect(() => {
    if (!categoryData) return;
    const match = categoryData.subcategories.find((s) => s.path === pathname);
    setActiveTab(match ? match.name : categoryData.subcategories[0].name);
    setProducts(getProductsByCategory(categoryKey, subcategoryKey) || []);
  }, [pathname, categoryKey, subcategoryKey, categoryData]);

  // ✅ Redux 토글 함수
  const toggleWishlist = (p, idx) => {
    const id = pidOf(p, idx);
    const normalized = {
      id,
      name: p.name || "상품명",
      image: p.image || p.img || "",
      price: typeof p.price === "number" ? p.price : Number(String(p.price).replace(/[^\d]/g, "")) || 0,
      desc: p.desc || "",
      brand: p.brand || p.brandName || "",
    };
    dispatch(toggleWishlistAction(normalized));
  };

  const goToProductDetail = (p, idx) => {
    const normalized = {
      id: pidOf(p, idx),
      name: p.name || "상품명 없음",
      image: p.image || p.img || "",
      price: typeof p.price === "string" ? Number(p.price.replace(/[^\d]/g, "")) || 0 : Number(p.price || 0),
      desc: p.desc || "",
      brand: p.brand || p.brandName || "",
    };
    storage.set("lastProduct", normalized);
    navigate(`/product/${normalized.id}`, { product: normalized });
  };

  if (!categoryData) {
    return (
      <div className="category-page">
        <div className="container">
          <h1>카테고리를 찾을 수 없습니다</h1>
          <Link to="/">홈으로 돌아가기</Link>
        </div>
      </div>
    );
  }

  const pageData = categoryData.pages[subcategoryKey] || categoryData.pages.main;
  const isMainCategory = subcategoryKey === "main";

  const breadcrumbItems = [{ name: "Home", path: "/" }];
  breadcrumbItems.push({ name: categoryData.name, path: `/${categoryKey}` });
  if (!isMainCategory && pageData) breadcrumbItems.push({ name: pageData.title, path: pathname });

  return (
    <div className="category-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="container">
          {breadcrumbItems.map((item, idx) => (
            <React.Fragment key={idx}>
              {idx === breadcrumbItems.length - 1 ? (
                <span className="current">{item.name}</span>
              ) : (
                <>
                  <Link to={item.path}>{item.name}</Link>
                  <span className="separator">&gt;</span>
                </>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="container">
        {/* Title */}
        <div className="page-header">
          <h1 className="page-title">
            {pageData.title} <span className="count">{pageData.count}개 상품</span>
          </h1>
        </div>

        {/* Tabs */}
        <div className="category-tabs">
          {categoryData.subcategories.map((subcat) => (
            <Link
              key={subcat.name}
              to={subcat.path}
              className={`tab ${activeTab === subcat.name ? "active" : ""}`}
              onClick={() => setActiveTab(subcat.name)}
            >
              {subcat.name}
            </Link>
          ))}
        </div>

        {/* Grid */}
        {products.length > 0 ? (
          <div className="product-grid">
            {products.map((p, idx) => {
              const id = pidOf(p, idx);
              const wished = wishSet.has(id);
              return (
                <div
                  className="product-card"
                  key={id}
                  onClick={() => goToProductDetail(p, idx)}
                >
                  <div className="thumb">
                    <img
                      src={srcOf(p)}
                      alt={p.name}
                      className="thumb-img"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = `${process.env.PUBLIC_URL}/images/placeholder.png`;
                      }}
                    />

                    {/* ✅ 홈과 완전히 같은 버튼 마크업/동작 */}
                    <button
                      className={`wishlist-btn ${wished ? "active" : ""}`}
                      aria-pressed={wished}
                      aria-label={wished ? "위시에서 제거" : "위시에 추가"}
                      onClick={(e) => { e.stopPropagation(); toggleWishlist(p, idx); }}
                      title={wished ? "위시에 담김" : "위시에 담기"}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill={wished ? "currentColor" : "none"}
                        />
                      </svg>
                    </button>

                    {p.discountLabel && <span className="discount-badge">{p.discountLabel}</span>}
                  </div>

                  <div className="product-info">
                    <span className="brand">{p.brand || p.brandName}</span>
                    <h3 className="product-name">{p.name}</h3>
                    <div className="price">
                      {p.originalPrice && <span className="original-price">{formatPrice(p.originalPrice)}</span>}
                      <span className="current-price">
                        {p.priceLabel ? p.priceLabel : formatPrice(p.price)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p>상품이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
