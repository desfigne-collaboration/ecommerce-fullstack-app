/**
 * ============================================================================
 * ProductGrid.jsx - 상품 그리드 레이아웃 컴포넌트
 * ============================================================================
 *
 * 【목적】
 * - 여러 상품을 그리드 형태로 표시
 * - 타이틀 + 상품 목록을 한 번에 렌더링
 * - 반응형 그리드 레이아웃 제공
 *
 * 【구조】
 * - 페이지 타이틀 (h2)
 * - 상품 그리드 (CSS Grid 또는 Flexbox)
 * - 각 상품: 이미지 + 이름 + 가격
 *
 * 【사용 사례】
 * - 카테고리별 상품 목록
 * - "신상품", "베스트" 등 섹션별 상품 모음
 * - 브랜드 페이지의 상품 전시
 *
 * 【CSS 클래스】
 * - .product-page: 전체 컨테이너
 * - .product-grid: 그리드 레이아웃
 * - .product-card: 개별 상품 카드
 *
 * @component
 * @author Claude Code
 * @since 2025-11-02
 */

import React from "react";
import "./ProductGrid.css";

/**
 * ProductGrid 함수형 컴포넌트
 *
 * @param {Object} props - 컴포넌트 props
 * @param {string} props.title - 섹션 제목
 * @param {Array<Object>} props.products - 상품 배열
 * @param {string|number} props.products[].id - 상품 ID
 * @param {string} props.products[].img - 이미지 URL
 * @param {string} props.products[].name - 상품명
 * @param {string|number} props.products[].price - 가격
 * @returns {JSX.Element} 상품 그리드 UI
 *
 * @example
 * <ProductGrid
 *   title="신상품"
 *   products={[
 *     { id: 1, img: "/img1.jpg", name: "상품1", price: "29000" },
 *     { id: 2, img: "/img2.jpg", name: "상품2", price: "39000" }
 *   ]}
 * />
 */
function ProductGrid({ title, products }) {
  return (
    <div className="product-page">
      <h2>{title}</h2>
      <div className="product-grid">
        {products.map((item) => (
          <div key={item.id} className="product-card">
            <img src={item.img} alt={item.name} />
            <h3>{item.name}</h3>
            <p>{item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductGrid;
