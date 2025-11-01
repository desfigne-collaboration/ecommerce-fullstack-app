import React from "react";
import "../Page.css";
import { useNavigate } from "react-router-dom";
import ProductThumb from "../../components/ProductThumb";

function KidsBoy() {
  const products = [
    { id: 2, name: "", desc: "", price: "", img: "https://desfigne.synology.me/data/image/thejoeun/products/kids_boy2.webp" },
    { id: 3, name: "", desc: "", price: "", img: "https://desfigne.synology.me/data/image/thejoeun/products/kids_boy3.webp" },
    { id: 4, name: "", desc: "", price: "", img: "https://desfigne.synology.me/data/image/thejoeun/products/kids_boy4.webp" },
    { id: 5, name: "", desc: "", price: "", img: "https://desfigne.synology.me/data/image/thejoeun/products/kids_boy5.webp" },
    { id: 6, name: "", desc: "", price: "", img: "https://desfigne.synology.me/data/image/thejoeun/products/kids_boy6.webp" },
    { id: 1, name: "", desc: "", price: "", img: "https://desfigne.synology.me/data/image/thejoeun/products/kids_boy1.webp" },
  ];

  return (
    <div className="page">
      <h1>남자 아이 페이지</h1>
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

export default KidsBoy;
