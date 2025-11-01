import React from "react";
import "../../../../styles/Page.css";
import ProductThumb from "../../../product/components/ProductThumb";

function OutletWomen() {
  const products = [
    { id: 1, name: "", desc: "", price: "", img: "https://desfigne.synology.me/data/image/thejoeun/products/outlet_women1.webp" },
    { id: 2, name: "", desc: "", price: "", img: "https://desfigne.synology.me/data/image/thejoeun/products/outlet_women2.webp" },
    { id: 3, name: "", desc: "", price: "", img: "https://desfigne.synology.me/data/image/thejoeun/products/outlet_women3.webp" },
    { id: 4, name: "", desc: "", price: "", img: "https://desfigne.synology.me/data/image/thejoeun/products/outlet_women4.webp" },
    { id: 5, name: "", desc: "", price: "", img: "https://desfigne.synology.me/data/image/thejoeun/products/outlet_women5.webp" },
    { id: 6, name: "", desc: "", price: "", img: "https://desfigne.synology.me/data/image/thejoeun/products/outlet_women6.webp" },
  ];

  return (
    <div className="page">
      <h1>아울렛 여성 페이지</h1>
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

export default OutletWomen;
