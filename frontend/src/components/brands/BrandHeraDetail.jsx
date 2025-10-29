import React from "react";
import "./brandhera.css";

export default function BrandHeraDetail() {
  const items = [
    {
      id: "hr_01",
      name: "센슈얼 파우더 매트 립",
      price: "₩39,000",
      img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=70",
      badges: ["NEW", "BEST"],
    },
    {
      id: "hr_02",
      name: "블랙쿠션 SPF50+ PA+++",
      price: "₩66,000",
      img: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=70",
      badges: ["HOT"],
    },
    {
      id: "hr_03",
      name: "UV 프로텍터 톤업",
      price: "₩45,000",
      img: "https://images.unsplash.com/photo-1522335789203-9e73f1a99b6a?auto=format&fit=crop&w=1200&q=70",
      badges: [],
    },
    {
      id: "hr_04",
      name: "아이섀도우 팔레트",
      price: "₩58,000",
      img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1200&q=70",
      badges: ["NEW"],
    },
  ];

  const lookbook = [
    "https://images.unsplash.com/photo-1522335789203-9e73f1a99b6a?auto=format&fit=crop&w=1200&q=70",
    "https://images.unsplash.com/photo-1519415550310-90ce7f7c9d5f?auto=format&fit=crop&w=1200&q=70",
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=70",
    "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1200&q=70",
  ];

  return (
    <div className="brand-hera">
      {/* HERO (상단 배경 강조) */}
      <section className="hr-hero with-image">
        <div
          className="hr-hero-bg"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1512207846876-c6b2a4a0b6a1?auto=format&fit=crop&w=2000&q=70")',
          }}
        />
        <div className="hr-hero-overlay" />
        <div className="hr-hero-lines" />
        <div className="hr-hero-inner">
          <span className="hr-hero-badge">HERA</span>
          <h1 className="hr-hero-title">도시적 감성의 럭셔리 메이크업</h1>
          <p className="hr-hero-desc">
            세련된 컬러와 광채 텍스처로 완성하는 모던 글램 룩. 시즌 신제품을 지금 만나보세요.
          </p>
          <div className="hr-hero-cta">
            <button className="btn primary">전체 상품 보기</button>
            <button className="btn ghost">혜택 먼저 보기</button>
          </div>
          <ul className="hr-hero-stats">
            <li>
              <strong>4</strong>
              추천 아이템
            </li>
            <li>
              <strong>1.3K</strong>
              찜/누적거래(예시)
            </li>
            <li>
              <strong>S/S</strong>
              이벤트 시즌
            </li>
          </ul>
        </div>
      </section>

      {/* 지금 핫한 아이템 */}
      <section className="hr-section">
        <div className="hr-head">
          <h2>지금 핫한 아이템</h2>
          <a href="#more" className="link-more">더보기</a>
        </div>
        <div className="hr-grid">
          {items.map((it) => (
            <article className="hr-card" key={it.id}>
              <div className="hr-thumb">
                <img src={it.img} alt={it.name} />
                {!!it.badges?.length && (
                  <div className="hr-badges">
                    {it.badges.map((b, i) => (
                      <span key={i} className={`bdg ${b.toLowerCase()}`}>
                        {b}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="hr-meta">
                <div className="hr-name">{it.name}</div>
                <div className="hr-price">{it.price}</div>
                <div className="hr-actions">
                  <button className="btn outline">자세히</button>
                  <button className="btn plum">바로구매</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 혜택 (심플/상단 강조 흐름 유지) */}
      <section className="hr-benefit">
        <div className="hr-benefit-inner">
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
      <section className="hr-section">
        <div className="hr-head">
          <h2>LOOKBOOK</h2>
        </div>
        <div className="hr-lookbook">
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
