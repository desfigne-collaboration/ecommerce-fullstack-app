import React from "react";
import "./brandrebaige.css";

export default function BrandRebaigeDetail() {
  const items = [
    {
      id: "rb_01",
      name: "울 블렌드 핸드메이드 코트",
      price: "₩890,000",
      img: "https://images.unsplash.com/photo-1618354691438-25bc9e1df0b8?auto=format&fit=crop&w=1200&q=70",
      badges: ["BEST"],
    },
    {
      id: "rb_02",
      name: "캐시미어 니트 풀오버",
      price: "₩620,000",
      img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3c06?auto=format&fit=crop&w=1200&q=70",
      badges: ["NEW"],
    },
    {
      id: "rb_03",
      name: "베이지 와이드 팬츠",
      price: "₩450,000",
      img: "https://images.unsplash.com/photo-1603808033192-082d6910d1e9?auto=format&fit=crop&w=1200&q=70",
      badges: [],
    },
    {
      id: "rb_04",
      name: "울 블렌드 롱 자켓",
      price: "₩790,000",
      img: "https://images.unsplash.com/photo-1618354691192-5a85d2d45e67?auto=format&fit=crop&w=1200&q=70",
      badges: ["HOT"],
    },
  ];

  const lookbook = [
    "https://images.unsplash.com/photo-1606813902791-4ab67818cc7e?auto=format&fit=crop&w=1200&q=70",
    "https://images.unsplash.com/photo-1618354691438-25bc9e1df0b8?auto=format&fit=crop&w=1200&q=70",
    "https://images.unsplash.com/photo-1602810318383-e386cc2a3c06?auto=format&fit=crop&w=1200&q=70",
    "https://images.unsplash.com/photo-1603808033192-082d6910d1e9?auto=format&fit=crop&w=1200&q=70",
  ];

  return (
    <div className="brand-rb">
      {/* HERO */}
      <section className="rb-hero with-image">
        <div
          className="rb-hero-bg"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1618354691438-25bc9e1df0b8?auto=format&fit=crop&w=2000&q=70")',
          }}
        />
        <div className="rb-hero-overlay" />
        <div className="rb-hero-inner">
          <span className="rb-hero-badge">RE;BAIGE</span>
          <h1 className="rb-hero-title">따뜻한 감성, 현대적인 베이지 무드</h1>
          <p className="rb-hero-desc">
            차분하고 세련된 톤온톤 컬렉션으로 완성하는 여유 있는 스타일.
          </p>
          <div className="rb-hero-cta">
            <button className="btn primary">전체 상품 보기</button>
            <button className="btn ghost">혜택 보기</button>
          </div>
        </div>
      </section>

      {/* ITEMS */}
      <section className="rb-section">
        <div className="rb-head">
          <h2>추천 아이템</h2>
          <a href="#more" className="link-more">더보기</a>
        </div>
        <div className="rb-grid">
          {items.map((it) => (
            <article className="rb-card" key={it.id}>
              <div className="rb-thumb">
                <img src={it.img} alt={it.name} />
                {!!it.badges?.length && (
                  <div className="rb-badges">
                    {it.badges.map((b, i) => (
                      <span key={i} className={`bdg ${b.toLowerCase()}`}>
                        {b}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="rb-meta">
                <div className="rb-name">{it.name}</div>
                <div className="rb-price">{it.price}</div>
                <div className="rb-actions">
                  <button className="btn outline">자세히</button>
                  <button className="btn beige">바로구매</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* BENEFIT */}
      <section className="rb-benefit">
        <div className="rb-benefit-inner">
          <div className="glass signup-card">
            <div className="left">
              <div className="eyebrow">신규 회원 혜택</div>
              <h3>첫 구매 10,000원 쿠폰</h3>
              <p>회원가입만 해도 바로 적용 가능한 웰컴 쿠폰을 드립니다.</p>
            </div>
            <div className="right">
              <button className="btn primary">회원가입</button>
              <button className="btn outline">쿠폰함</button>
            </div>
          </div>
        </div>
      </section>

      {/* LOOKBOOK */}
      <section className="rb-section">
        <div className="rb-head">
          <h2>LOOKBOOK</h2>
        </div>
        <div className="rb-lookbook">
          {lookbook.map((src, idx) => (
            <div className="lb-card" key={idx}>
              <img src={src} alt={`look-${idx}`} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
