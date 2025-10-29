import React from "react";
import "./brandcanadagoose.css";

export default function BrandCanadaGooseDetail() {
  const items = [
    {
      id: "cg_01",
      name: "EXPEDITION 파카",
      price: "₩1,690,000",
      img: "https://images.unsplash.com/photo-1545194825-6f6f0f6a3b8a?auto=format&fit=crop&w=1200&q=70",
      badges: ["NEW", "BEST"],
    },
    {
      id: "cg_02",
      name: "LANGFORD 다운 자켓",
      price: "₩1,550,000",
      img: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=1200&q=70",
      badges: ["HOT"],
    },
    {
      id: "cg_03",
      name: "LODGE 경량 패커블",
      price: "₩990,000",
      img: "https://images.unsplash.com/photo-1548883354-94bc1c1f5fa1?auto=format&fit=crop&w=1200&q=70",
      badges: [],
    },
    {
      id: "cg_04",
      name: "FREESTYLE 베스트",
      price: "₩790,000",
      img: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=1200&q=70",
      badges: ["NEW"],
    },
  ];

  const lookbook = [
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=70",
    "https://images.unsplash.com/photo-1471478331149-c72f17e33c73?auto=format&fit=crop&w=1200&q=70",
    "https://images.unsplash.com/photo-1520986606214-8b456906c813?auto=format&fit=crop&w=1200&q=70",
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=70",
  ];

  return (
    <div className="brand-cg">
      {/* HERO */}
      <section className="cg-hero with-image">
        <div
          className="cg-hero-bg"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=2000&q=70")',
          }}
        />
        <div className="cg-hero-overlay" />
        <div className="cg-hero-lines" />
        <div className="cg-hero-inner">
          <span className="cg-hero-badge">CANADA GOOSE</span>
          <h1 className="cg-hero-title">극한의 추위도 막는 헤리티지 다운</h1>
          <p className="cg-hero-desc">
            북극의 필드에서 검증된 보온력과 현대적인 실루엣. 시즌 한정 컬렉션을 만나보세요.
          </p>
          <div className="cg-hero-cta">
            <button className="btn primary">전체 상품 보기</button>
            <button className="btn ghost">혜택 먼저 보기</button>
          </div>
          <ul className="cg-hero-stats">
            <li>
              <strong>4</strong>
              추천 아이템
            </li>
            <li>
              <strong>2.1K</strong>
              찜/누적거래(예시)
            </li>
            <li>
              <strong>F/W</strong>
              이벤트 시즌
            </li>
          </ul>
        </div>
      </section>

      {/* 지금 핫한 아이템 */}
      <section className="cg-section">
        <div className="cg-head">
          <h2>지금 핫한 아이템</h2>
          <a href="#more" className="link-more">
            더보기
          </a>
        </div>
        <div className="cg-grid">
          {items.map((it) => (
            <article className="cg-card" key={it.id}>
              <div className="cg-thumb">
                <img src={it.img} alt={it.name} />
                {!!it.badges?.length && (
                  <div className="cg-badges">
                    {it.badges.map((b, i) => (
                      <span key={i} className={`bdg ${b.toLowerCase()}`}>
                        {b}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="cg-meta">
                <div className="cg-name">{it.name}</div>
                <div className="cg-price">{it.price}</div>
                <div className="cg-actions">
                  <button className="btn outline">자세히</button>
                  <button className="btn navy">바로구매</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 신규 회원 혜택 (사진 오버레이) */}
      <section className="cg-benefit with-photo">
        <div
          className="benefit-photo"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=2000&q=70")',
          }}
        />
        <div className="benefit-overlay" />
        <div className="inner">
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

          <div className="benefit-grid mini">
            <div className="glass benefit-card">
              <div className="tit">멤버십 등급 추가적립</div>
              <p>구매 금액대별 최대 5% 포인트 적립</p>
            </div>
            <div className="glass benefit-card">
              <div className="tit">오늘 출발</div>
              <p>오후 2시 이전 결제 시 당일 출고(일부 품목)</p>
            </div>
            <div className="glass benefit-card">
              <div className="tit">무료 반품</div>
              <p>사이즈/컬러 교환 1회 무료(정책 준수)</p>
            </div>
          </div>
        </div>
      </section>

      {/* LOOKBOOK */}
      <section className="cg-section">
        <div className="cg-head">
          <h2>LOOKBOOK</h2>
        </div>
        <div className="cg-lookbook">
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
