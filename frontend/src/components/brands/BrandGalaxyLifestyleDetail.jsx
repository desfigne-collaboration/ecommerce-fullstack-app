import React from "react";
import "./brandgalaxylifestyle.css";

export default function BrandGalaxyLifestyleDetail() {
  const items = [
    {
      id: "gx_01",
      name: "Galaxy Buds2 Pro",
      price: "₩239,800",
      img: "https://images.unsplash.com/photo-1518665750801-883c2f7630f2?auto=format&fit=crop&w=1200&q=70",
      badges: ["NEW", "BEST"],
    },
    {
      id: "gx_02",
      name: "Galaxy Watch6 Classic",
      price: "₩469,000",
      img: "https://images.unsplash.com/photo-1518442074739-7db45a7f1bbf?auto=format&fit=crop&w=1200&q=70",
      badges: ["HOT"],
    },
    {
      id: "gx_03",
      name: "Wireless Charger 15W",
      price: "₩59,000",
      img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=70",
      badges: [],
    },
    {
      id: "gx_04",
      name: "Galaxy SmartTag2",
      price: "₩39,600",
      img: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=70",
      badges: ["NEW"],
    },
  ];

  const lookbook = [
    "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=1200&q=70",
    "https://images.unsplash.com/photo-1510552776732-01acc9a4c437?auto=format&fit=crop&w=1200&q=70",
    "https://images.unsplash.com/photo-1512499617640-c2f999098c01?auto=format&fit=crop&w=1200&q=70",
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=70",
  ];

  return (
    <div className="brand-gx">
      {/* HERO */}
      <section className="gx-hero with-image">
        <div
          className="gx-hero-bg"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2000&q=70")',
          }}
        />
        <div className="gx-hero-overlay" />
        <div className="gx-hero-lines" />
        <div className="gx-hero-inner">
          <span className="gx-hero-badge">GALAXY LIFESTYLE</span>
          <h1 className="gx-hero-title">스마트한 일상을 위한 갤럭시 액세서리</h1>
          <p className="gx-hero-desc">
            오디오·워치·태그까지 갤럭시 생태계를 완성하는 필수 아이템. 지금 혜택과 함께 만나보세요.
          </p>
          <div className="gx-hero-cta">
            <button className="btn primary">전체 상품 보기</button>
            <button className="btn ghost">혜택 먼저 보기</button>
          </div>
          <ul className="gx-hero-stats">
            <li>
              <strong>4</strong>
              추천 아이템
            </li>
            <li>
              <strong>2.4K</strong>
              찜/누적거래(예시)
            </li>
            <li>
              <strong>ALL</strong>
              상시 프로모션
            </li>
          </ul>
        </div>
      </section>

      {/* 지금 핫한 아이템 */}
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
                      <span key={i} className={`bdg ${b.toLowerCase()}`}>
                        {b}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="gx-meta">
                <div className="gx-name">{it.name}</div>
                <div className="gx-price">{it.price}</div>
                <div className="gx-actions">
                  <button className="btn outline">자세히</button>
                  <button className="btn blue">바로구매</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 신규 회원 혜택 */}
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
          <div className="benefit-grid mini">
            <div className="glass benefit-card">
              <div className="tit">삼성페이 추가적립</div>
              <p>결제 수단에 따라 최대 3% 추가 적립</p>
            </div>
            <div className="glass benefit-card">
              <div className="tit">오늘 출발</div>
              <p>오후 2시 이전 결제 시 당일 출고(일부 품목)</p>
            </div>
            <div className="glass benefit-card">
              <div className="tit">무상 교환 1회</div>
              <p>초기 불량/사이즈 이슈 1회 무상 교환</p>
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
