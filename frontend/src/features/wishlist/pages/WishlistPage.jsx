// src/pages/wish/Wishlist.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import storage from "../../../utils/storage.js";
import "../../../styles/Wishlist.css";

const KEY = "wishlist";

const readWishlist = () => {
  try {
    return storage.get(KEY, []);
  } catch {
    return [];
  }
};

export default function Wishlist() {
  const navigate = useNavigate();
  const [items, setItems] = useState(() => readWishlist());
  const count = items.length;

  // 같은 탭 즉시 반영: storage 이벤트만 구독
  useEffect(() => {
    const onStorage = (e) => {
      if (!e || !e.key || e.key === "wishlist") {
        setItems(readWishlist());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const goDetail = (p) => {
    storage.set("lastProduct", p);
    navigate(`/product/${p.id}`, { product: p });
  };

  // ✅ 단건 삭제: 로컬스토리지 저장 + StorageEvent 발행
  const removeOne = (id) => {
    const next = items.filter((it) => it.id !== id);
    storage.set(KEY, next);
    window.dispatchEvent(new StorageEvent("storage", { key: "wishlist", newValue: JSON.stringify(next) }));
    setItems(next);
  };

  // ✅ 전체 삭제: 로컬스토리지 저장 + StorageEvent 발행
  const clearAll = () => {
    storage.set(KEY, []);
    window.dispatchEvent(new StorageEvent("storage", { key: "wishlist", newValue: "[]" }));
    setItems([]);
  };

  const fmt = (v) =>
    (typeof v === "number" ? v : Number(String(v).replace(/[^\d]/g, "")) || 0).toLocaleString() + "원";

  return (
    <div className="wishlist-page">
      <div className="container">
        <div className="wl-header">
          <h1 className="wl-title">
            나의 위시리스트 <span className="heart">❤</span>
            <span className="count">{count}</span>
          </h1>

          <div className="wl-actions">
            <Link to="/" className="btn ghost lg">계속 쇼핑하기</Link>
            {count > 0 && (
              <button className="btn danger lg" onClick={clearAll}>전체 삭제</button>
            )}
          </div>
        </div>

        {count === 0 ? (
          <div className="wl-empty">
            <p>위시에 담긴 상품이 없습니다.</p>
            <Link to="/" className="btn primary lg">홈으로</Link>
          </div>
        ) : (
          <div className="wishlist-grid">
            {items.map((p) => (
              <div
                className="wish-card"
                key={p.id}
                role="link"
                onClick={() => goDetail(p)}
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter") goDetail(p); }}
              >
                <div className="thumb">
                  <img
                    src={
                      /^https?:\/\//i.test(p.image)
                        ? p.image
                        : `${process.env.PUBLIC_URL}/${String(p.image || "")
                            .replace(/^\.?\/*/, "")}`
                    }
                    alt={p.name || "product"}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = `${process.env.PUBLIC_URL}/images/placeholder.png`;
                    }}
                  />
                  <button
                    className="remove"
                    onClick={(e) => { e.stopPropagation(); removeOne(p.id); }}
                  >
                    삭제
                  </button>
                </div>

                <div className="info">
                  {p.brand && <div className="brand">{p.brand}</div>}
                  <div className="name" title={p.name}>{p.name}</div>
                  <div className="price">
                    {p.originalPrice && <span className="original">{fmt(p.originalPrice)}</span>}
                    <span className="current">{fmt(p.price)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
