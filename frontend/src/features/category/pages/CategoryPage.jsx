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

// 이미지 경로 보정(그대로)
const srcOf = (p) => {
  const url = p?.image || p?.img || "";
  if (!url) return `${process.env.PUBLIC_URL}/images/placeholder.png`;
  if (/^https?:\/\//i.test(url)) return url;
  const cleaned = url.replace(/^\.?\/*/, "");
  return cleaned.startsWith("images/")
    ? `${process.env.PUBLIC_URL}/${cleaned}`
    : `${process.env.PUBLIC_URL}/images/${cleaned}`;
};

// 가격 포맷(그대로)
const formatPrice = (v) => {
  const n = typeof v === "number" ? v : Number(String(v).replace(/[^\d]/g, "")) || 0;
  return n.toLocaleString() + "원";
};

// id 없을 수 있으니 보정
const pidOf = (p, idx) => p?.id ?? p?.code ?? p?.pid ?? productKey(p) ?? `cat-${idx}`;

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
