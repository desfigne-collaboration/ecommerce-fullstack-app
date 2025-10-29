import React from "react";
import "./brandgalaxy.css";

export default function BrandGalaxyDetail() {
  const items = [
    {
      id: "gx_01",
      name: "Super 110s 클래식 싱글 수트",
      price: "₩890,000",
      img: "https://images.unsplash.com/photo-1520975682031-b49b7fe0e0f5?auto=format&fit=crop&w=1200&q=70",
      badges: ["BEST"],
    },
    {
      id: "gx_02",
      name: "울캐시미어 블렌드 코트",
      price: "₩1,090,000",
      img: "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=1200&q=70",
      badges: ["NEW"],
    },
    {
      id: "gx_03",
      name: "프리미엄 옥스포드 셔츠",
      price: "₩189,000",
      img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=70",
      badges: [],
    },
    {
      id: "gx_04",
      name: "이탈리안 레더 더비 슈즈",
      price: "₩520,000",
      img: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=70",
      badges: ["HOT"],
    },
  ];

  const lookbook = [
    "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=1200&q=70",
    "https://images.unsplash.com/photo-1520975682031-b49b7fe0e0f5?auto=format&fit=crop&w=1200&q=70",
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=70",
    "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=70",
  ];

  return (
    <div className="brand-gx">
      {/* HERO */}
      <section className="gx-hero with-image">
        <div
          className="gx-hero-bg"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1472417583565-62e7bdeda490?auto=format&fit=crop&w=2000&q=70")',
          }}
        />
        <div className="gx-hero-overlay" />
        <div className="gx-hero-inner">
          <span className="gx-hero-badge">GALAXY</span>
          <h1 className="gx-hero-title">정교한 테일러링, 모던 수트 컬렉션</h1>
          <p className="gx-hero-desc">
            차콜·네이비 톤에 골드 디테일을 더한 갤럭시의 프리미엄 라인업.
          </p>
          <div className="gx-hero-cta">
            <button className="btn primary">전체 상품 보기</button>
            <button className="btn ghost">혜택 먼저 보기</button>
          </div>
          <ul className="gx-hero-stats">
            <li><strong>4</strong>추천 아이템</li>
            <li><strong>2.8K</strong>찜/누적거래(예시)</li>
            <li><strong>F/W</strong>시즌</li>
          </ul>
        </div>
      </section>

      {/* ITEMS */}
      <section className="gx-section">
        <div className="gx-head">
          <h2>지금 핫한 아이템</h2>
          <a href="#more" className="link-more">더보기</a>
        </div>
        <div className="gx-grid">
          {items.map((it) => (
            <article className="gx-card" key={it.id}>
              <div className="gx-thumb">
                <img src={it.img} alt={it.name} />
                {!!it.badges?.length && (
                  <div className="gx-badges">
                    {it.badges.map((b, i) => (
                      <span key={i} className={`bdg ${b.toLowerCase()}`}>{b}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="gx-meta">
                <div className="gx-name">{it.name}</div>
                <div className="gx-price">{it.price}</div>
                <div className="gx-actions">
                  <button className="btn outline">자세히</button>
                  <button className="btn gold">바로구매</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* BENEFIT */}
      <section className="gx-benefit">
        <div className="gx-benefit-inner">
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
      <section className="gx-section">
        <div className="gx-head">
          <h2>LOOKBOOK</h2>
        </div>
        <div className="gx-lookbook">
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
