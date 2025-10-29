import React, { useMemo } from "react";
import "./brand10corso.css";

/* ---------- Utils ---------- */
const toNum = (v) =>
  typeof v === "number" ? v : Number(String(v ?? "").replace(/[^\d]/g, "")) || 0;
const fmt = (n) => `₩${Number(n || 0).toLocaleString()}`;
const PLACEHOLDER = `${process.env.PUBLIC_URL || ""}/images/placeholder.webp`;
const srcOf = (raw) => (raw ? raw : PLACEHOLDER);

/* ---------- Demo data (external images) ---------- */
const hotItems = [
  {
    id: "10cc-knit",
    name: "10 Corso Como 시그니처 니트",
    price: 359000,
    img: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    badges: ["BEST"],
  },
  {
    id: "10cc-shirt",
    name: "10 Corso Como 오버셔츠",
    price: 289000,
    img: "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1200&q=80",
    badges: ["NEW"],
  },
  {
    id: "10cc-bag",
    name: "10 Corso Como 그래픽 토트",
    price: 169000,
    img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80",
    badges: ["HOT"],
  },
  {
    id: "10cc-cap",
    name: "10 Corso Como 캡",
    price: 69000,
    img: "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=1200&q=80",
  },
];

const lookbook = [
  "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1517414204284-6dfa3ec6f6f9?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=900&q=80",
];

export default function Brand10CorsoComoDetail() {
  const itemCards = useMemo(
    () =>
      hotItems.map((p) => (
        <div className="cc-card" key={p.id}>
          <div className="cc-thumb">
            {p.badges?.length ? (
              <div className="cc-badges">
                {p.badges.map((b) => (
                  <span key={b} className={`bdg ${b.toLowerCase()}`}>{b}</span>
                ))}
              </div>
            ) : null}
            <img
              src={srcOf(p.img)}
              onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
              alt={p.name}
            />
          </div>
          <div className="cc-meta">
            <div className="cc-name">{p.name}</div>
            <div className="cc-price">{fmt(toNum(p.price))}</div>
            <div className="cc-actions">
              <button className="btn ghost">자세히</button>
              <button className="btn primary">바로구매</button>
            </div>
          </div>
        </div>
      )),
    []
  );

  return (
    <div className="brand-cc">
      {/* HERO */}
      <section className="cc-hero with-image">
        <div
          className="cc-hero-bg"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1517414204284-6dfa3ec6f6f9?auto=format&fit=crop&w=1920&q=80")',
          }}
        />
        <div className="cc-hero-overlay" />
        {/* 도트 패턴 */}
        <div className="cc-hero-dots" aria-hidden="true" />
        <div className="cc-hero-inner">
          <div className="cc-hero-badge">10 CORSO COMO</div>
          <h1 className="cc-hero-title">모노톤 아트워크, 10 CORSO COMO</h1>
          <p className="cc-hero-desc">
            블랙&화이트 그래픽 감성으로 완성하는 컨템포러리 셀렉션.
          </p>
          <div className="cc-hero-cta">
            <button className="btn primary">전체 상품 보기</button>
            <button className="btn ghost">혜택 먼저 보기</button>
          </div>
          <ul className="cc-hero-stats">
            <li><strong>4</strong><span>추천 아이템</span></li>
            <li><strong>1.9K</strong><span>찜/누적거래</span></li>
            <li><strong>F/W</strong><span>이벤트 시즌</span></li>
          </ul>
        </div>
      </section>

      {/* 지금 핫한 아이템 */}
      <section className="cc-section">
        <div className="cc-head">
          <h2>지금 핫한 아이템</h2>
          <a href="#more" className="link-more">더보기</a>
        </div>
        <div className="cc-grid">{itemCards}</div>
      </section>

      {/* 신규 회원 혜택 */}
      <section className="cc-benefit">
        <div className="inner">
          <div className="signup-card">
            <div className="left">
              <div className="eyebrow">신규 회원 혜택</div>
              <h3>첫 구매 10,000원 쿠폰</h3>
              <p>회원가입만 해도 바로 적용 가능한 웰컴 쿠폰을 드립니다.</p>
            </div>
            <div className="right">
              <button className="btn lime">회원가입</button>
              <button className="btn outline">쿠폰함</button>
            </div>
          </div>

          <div className="benefit-grid mini">
            <div className="benefit-card">
              <div className="tit">멤버십등급 추가적립</div>
              <p>구매 금액대별 최대 5% 포인트 적립</p>
            </div>
            <div className="benefit-card">
              <div className="tit">오늘 출발</div>
              <p>오후 2시 이전 결제 시 당일 출고(일부 품목)</p>
            </div>
            <div className="benefit-card">
              <div className="tit">무료 반품</div>
              <p>사이즈/컬러 교환 1회 무료 (정책 준수)</p>
            </div>
          </div>
        </div>
      </section>

      {/* LOOKBOOK */}
      <section className="cc-section">
        <div className="cc-head"><h2>LOOKBOOK</h2></div>
        <div className="cc-lookbook">
          {lookbook.map((src, i) => (
            <div className="lb-card" key={i}>
              <img
                src={srcOf(src)}
                onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
                alt={`look-${i}`}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
