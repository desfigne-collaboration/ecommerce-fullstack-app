import React from "react";
import "../Page.css";
import { useNavigate } from 'react-router-dom';
import ProductThumb from "../../components/ProductThumb";

function WomenJacket() {
  const products = [
    { id: 1, name: "베이지 캐주얼 자켓", desc: "데일리로 활용하기 좋은 기본 아우터", price: "₩129,000", img: "https://desfigne.synology.me/data/image/thejoeun/products/women_jacket1.webp" },
    { id: 2, name: "", desc: "", price: "", img: "https://desfigne.synology.me/data/image/thejoeun/products/women_jacket2.webp" },
    { id: 3, name: "", desc: "", price: "", img: "https://desfigne.synology.me/data/image/thejoeun/products/women_jacket3.webp" },
    { id: 4, name: "", desc: "", price: "", img: "https://desfigne.synology.me/data/image/thejoeun/products/women_jacket4.webp" },
    { id: 5, name: "", desc: "", price: "", img: "https://desfigne.synology.me/data/image/thejoeun/products/women_jacket5.webp" },
    { id: 6, name: "", desc: "", price: "", img: "https://desfigne.synology.me/data/image/thejoeun/products/women_jacket6.webp" },
  ];

  return (
    <div className="page">
      <h1>여성 재킷 페이지</h1>
      <div className="product-grid">
        {products.map((p) => (
          <div className="product-card" key={p.id}>
            <ProductThumb product={p} />
            <h4>{p.name}</h4>
            <p className="desc">{p.desc}</p>
            <p className="price">{p.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WomenJacket;
