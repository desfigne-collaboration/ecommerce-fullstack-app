import React, { useState, useMemo } from "react";
import "./WomenMain.css";
import { useNavigate } from 'react-router-dom';
import ProductThumb from "../../components/ProductThumb";
import { PRODUCT_DATA } from "../../data/productData";

function WomenMain() {
  const navigate = useNavigate();

  // State for filters
  const [selectedBrand, setSelectedBrand] = useState("전체");
  const [selectedPrice, setSelectedPrice] = useState("전체");
  const [selectedSize, setSelectedSize] = useState("전체");
  const [selectedColor, setSelectedColor] = useState("전체");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [sortBy, setSortBy] = useState("인기상품순");

  // Category tabs
  const categories = [
    "전체", "아우터", "재킷/베스트", "니트", "티셔츠", "원피스", "셔츠/블라우스", "팬츠", "스커트"
  ];

  // Filter options
  const brands = ["전체", "구호", "띠어리", "꼼데가르송", "비이커", "에잇세컨드", "이세이미야케", "빈폴", "코스", "파타고니아"];
  const prices = ["전체", "0-50,000", "50,000-100,000", "100,000-150,000", "150,000+"];
  const sizes = ["전체", "XS", "S", "M", "L", "XL"];
  const colors = ["전체", "블랙", "화이트", "그레이", "베이지", "네이비", "브라운"];

  // Get all women products
  const allProducts = useMemo(() => {
    const products = [];
    Object.keys(PRODUCT_DATA.women).forEach(category => {
      if (PRODUCT_DATA.women[category] && Array.isArray(PRODUCT_DATA.women[category])) {
        PRODUCT_DATA.women[category].forEach(product => {
          products.push({
            ...product,
            category: category,
            // Add default values for filtering
            brand: product.brand || brands[Math.floor(Math.random() * (brands.length - 1)) + 1],
            size: product.size || sizes[Math.floor(Math.random() * (sizes.length - 1)) + 1],
            color: product.color || colors[Math.floor(Math.random() * (colors.length - 1)) + 1],
          });
        });
      }
    });
    return products;
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];

    // Category filter
    if (selectedCategory !== "전체") {
      const categoryMap = {
        "아우터": "outer",
        "재킷/베스트": "jacket",
        "니트": "knit",
        "티셔츠": "tshirt",
        "원피스": "onepiece",
        "셔츠/블라우스": "shirt",
        "팬츠": "pants",
        "스커트": "skirt"
      };
      const categoryKey = categoryMap[selectedCategory];
      if (categoryKey) {
        filtered = filtered.filter(p => p.category === categoryKey);
      }
    }

    // Brand filter
    if (selectedBrand !== "전체") {
      filtered = filtered.filter(p => p.brand === selectedBrand);
    }

    // Price filter
    if (selectedPrice !== "전체") {
      filtered = filtered.filter(p => {
        const price = typeof p.price === 'string' ? parseInt(p.price.replace(/[^\d]/g, '')) : p.price;
        if (selectedPrice === "0-50,000") return price < 50000;
        if (selectedPrice === "50,000-100,000") return price >= 50000 && price < 100000;
        if (selectedPrice === "100,000-150,000") return price >= 100000 && price < 150000;
        if (selectedPrice === "150,000+") return price >= 150000;
        return true;
      });
    }

    // Size filter
    if (selectedSize !== "전체") {
      filtered = filtered.filter(p => p.size === selectedSize);
    }

    // Color filter
    if (selectedColor !== "전체") {
      filtered = filtered.filter(p => p.color === selectedColor);
    }

    // Sorting
    if (sortBy === "인기상품순") {
      // Keep original order (can implement popularity logic later)
    } else if (sortBy === "낮은가격순") {
      filtered.sort((a, b) => {
        const priceA = typeof a.price === 'string' ? parseInt(a.price.replace(/[^\d]/g, '')) : a.price;
        const priceB = typeof b.price === 'string' ? parseInt(b.price.replace(/[^\d]/g, '')) : b.price;
        return priceA - priceB;
      });
    } else if (sortBy === "높은가격순") {
      filtered.sort((a, b) => {
        const priceA = typeof a.price === 'string' ? parseInt(a.price.replace(/[^\d]/g, '')) : a.price;
        const priceB = typeof b.price === 'string' ? parseInt(b.price.replace(/[^\d]/g, '')) : b.price;
        return priceB - priceA;
      });
    } else if (sortBy === "신상품순") {
      filtered = filtered.filter(p => p.category === 'new').concat(filtered.filter(p => p.category !== 'new'));
    }

    return filtered;
  }, [allProducts, selectedBrand, selectedPrice, selectedSize, selectedColor, selectedCategory, sortBy]);

  return (
    <div className="women-main">
      <div className="page-header">
        <h1>여성</h1>
        <p className="product-count">{filteredProducts.length.toLocaleString()}개의 상품</p>
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <div className="filter-row">
          <div className="filter-item">
            <label>브랜드</label>
            <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
              {brands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <label>가격</label>
            <select value={selectedPrice} onChange={(e) => setSelectedPrice(e.target.value)}>
              {prices.map(price => (
                <option key={price} value={price}>{price}</option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <label>사이즈</label>
            <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
              {sizes.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <label>색상</label>
            <select value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)}>
              {colors.map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <label>해택/배송</label>
            <select>
              <option>전체</option>
              <option>무료배송</option>
              <option>당일배송</option>
              <option>할인상품</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="category-tabs">
        {categories.map(category => (
          <button
            key={category}
            className={selectedCategory === category ? "active" : ""}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Sorting */}
      <div className="sorting-section">
        <div className="sort-buttons">
          {["인기상품순", "신상품순", "낮은가격순", "높은가격순"].map(sort => (
            <button
              key={sort}
              className={sortBy === sort ? "active" : ""}
              onClick={() => setSortBy(sort)}
            >
              {sort}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div key={product.id} className="product-item">
              <ProductThumb product={product} />
              <div className="product-info">
                <p className="product-brand">{product.brand}</p>
                <p className="product-name">{product.name}</p>
                <p className="product-price">
                  {typeof product.price === 'string'
                    ? parseInt(product.price.replace(/[^\d]/g, '')).toLocaleString()
                    : product.price.toLocaleString()}원
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="no-products">
            <p>조건에 맞는 상품이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default WomenMain;
