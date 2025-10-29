import React from "react";
import "./brandtoryburch.css";

export default function BrandToryBurchDetail() {
  const items = [
    {
      id: "tb_01",
      name: "T Monogram Jacquard Tote",
      price: "₩689,000",
      img: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=1200&q=70",
      badges: ["BEST"],
    },
    {
      id: "tb_02",
      name: "Fleming Soft Wallet on Chain",
      price: "₩598,000",
      img: "https://images.unsplash.com/photo-1520975693416-35a2e50a3cde?auto=format&fit=crop&w=1200&q=70",
      badges: ["NEW"],
    },
    {
      id: "tb_03",
      name: "Miller Sandals",
      price: "₩328,000",
      img: "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=1200&q=70",
      badges: [],
    },
    {
      id: "tb_04",
      name: "Kira Chevron Mini Bag",
      price: "₩658,000",
      img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=70",
      badges: ["HOT"],
    },
  ];

  const lookbook = [
    "https://images.unsplash.com/photo-1520975693416-35a2e50a3cde?auto=format&fit=crop&w=1200&q=70",
    "https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=1200&q=70",
    "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=70",
    "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=1200&q=70",
  ];

  return (
    <div className="brand-tb">
      {/* HERO */}
      <section className="tb-hero with-image">
        <div
          className="tb-hero-bg"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1555529669-e69e7aa0ba9b?auto=format&fit=crop&w=2000&q=70")',
          }}
        />
        <div className="tb-hero-overlay" />
        <div className="tb-hero-inner">
          <span className="tb-hero-badge">TORY BURCH</span>
          <h1 className="tb-hero-title">모던 클래식, 네이비 & 오렌지 포인트</h1>
          <p className="tb-hero-desc">
            토리버치의 시그니처 감성을 담은 백 & 슈즈. 세련된 디테일로 일상을 완성하세요.
          </p>
          <div className="tb-hero-cta">
            <button className="btn primary">전체 상품 보기</button>
            <button className="btn ghost">혜택 먼저 보기</button>
          </div>
          <ul className="tb-hero-stats">
            <li><strong>4</strong>추천 아이템</li>
            <li><strong>3.1K</strong>찜/누적거래(예시)</li>
            <li><strong>S/S</strong>시즌 셀렉션</li>
          </ul>
        </div>
      </section>

      {/* ITEMS */}
      <section className="tb-section">
        <div className="tb-head">
          <h2>지금 핫한 아이템</h2>
          <a href="#more" className="link-more">더보기</a>
        </div>
        <div className="tb-grid">
          {items.map((it) => (
            <article className="tb-card" key={it.id}>
              <div className="tb-thumb">
                <img src={it.img} alt={it.name} />
                {!!it.badges?.length && (
                  <div className="tb-badges">
                    {it.badges.map((b, i) => (
                      <span key={i} className={`bdg ${b.toLowerCase()}`}>{b}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="tb-meta">
                <div className="tb-name">{it.name}</div>
                <div className="tb-price">{it.price}</div>
                <div className="tb-actions">
                  <button className="btn outline">자세히</button>
                  <button className="btn orange">바로구매</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* BENEFIT */}
      <section className="tb-benefit">
        <div className="tb-benefit-inner">
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
      <section className="tb-section">
        <div className="tb-head">
          <h2>LOOKBOOK</h2>
        </div>
        <div className="tb-lookbook">
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
