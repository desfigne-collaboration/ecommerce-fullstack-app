import React, { useMemo } from "react";
import "./brandaperture.css";

/* ---------- Utils ---------- */
const toNum = (v) =>
  typeof v === "number" ? v : Number(String(v ?? "").replace(/[^\d]/g, "")) || 0;
const fmt = (n) => `₩${Number(n || 0).toLocaleString()}`;
const PLACEHOLDER = `${process.env.PUBLIC_URL || ""}/images/placeholder.webp`;
const srcOf = (raw) => (raw ? raw : PLACEHOLDER);

/* ---------- Demo data (외부 이미지) ---------- */
const hotItems = [
  {
    id: "aperture-hoodie",
    name: "APERTURE 그래픽 후디",
    price: 129000,
    img: "https://images.unsplash.com/photo-1517420704952-d9f39e95b43f?auto=format&fit=crop&w=1200&q=80",
    badges: ["BEST"],
  },
  {
    id: "aperture-tee",
    name: "APERTURE 로고 티셔츠",
    price: 49000,
    img: "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1200&q=80",
    badges: ["NEW"],
  },
  {
    id: "aperture-bag",
    name: "APERTURE 크로스 바디백",
    price: 89000,
    img: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    badges: ["HOT"],
  },
  {
    id: "aperture-cap",
    name: "APERTURE 캡",
    price: 39000,
    img: "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=1200&q=80",
  },
];

const lookbook = [
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1511765224389-37f0e77cf0eb?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
];

export default function BrandApertureDetail() {
  const itemCards = useMemo(
    () =>
      hotItems.map((p) => (
        <div className="ap-card" key={p.id}>
          <div className="ap-thumb">
            {p.badges?.length ? (
              <div className="ap-badges">
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
          <div className="ap-meta">
            <div className="ap-name">{p.name}</div>
            <div className="ap-price">{fmt(toNum(p.price))}</div>
            <div className="ap-actions">
              <button className="btn ghost">자세히</button>
              <button className="btn primary">바로구매</button>
            </div>
          </div>
        </div>
      )),
    []
  );

  return (
    <div className="brand-ap">
      {/* HERO */}
      <section className="ap-hero with-image">
        <div
          className="ap-hero-bg"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1499083097717-a156f48e72bc?auto=format&fit=crop&w=1920&q=80")',
          }}
        />
        {/* 다중 그라데이션 + 그리드/셔터 패턴 */}
        <div className="ap-hero-overlay" />
        <div className="ap-hero-grid" aria-hidden="true" />
        <div className="ap-hero-inner">
          <div className="ap-hero-badge">APERTURE</div>
          <h1 className="ap-hero-title">광학적 감성, APERTURE</h1>
          <p className="ap-hero-desc">
            사진에서 영감 받은 그래픽과 미니멀 실루엣으로 완성하는 컨템포러리 룩.
          </p>
          <div className="ap-hero-cta">
            <button className="btn primary">전체 상품 보기</button>
            <button className="btn ghost">혜택 먼저 보기</button>
          </div>
          <ul className="ap-hero-stats">
            <li><strong>4</strong><span>추천 아이템</span></li>
            <li><strong>1.3K</strong><span>찜/누적거래</span></li>
            <li><strong>S/S</strong><span>이벤트 시즌</span></li>
          </ul>
        </div>
      </section>

      {/* 지금 핫한 아이템 */}
      <section className="ap-section">
        <div className="ap-head">
          <h2>지금 핫한 아이템</h2>
          <a href="#more" className="link-more">더보기</a>
        </div>
        <div className="ap-grid">{itemCards}</div>
      </section>

      {/* 신규 회원 혜택 */}
      <section className="ap-benefit">
        <div className="inner">
          <div className="signup-card">
            <div className="left">
              <div className="eyebrow">신규 회원 혜택</div>
              <h3>첫 구매 10,000원 쿠폰</h3>
              <p>회원가입만 해도 바로 적용 가능한 웰컴 쿠폰을 드립니다.</p>
            </div>
            <div className="right">
              <button className="btn teal">회원가입</button>
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
      <section className="ap-section">
        <div className="ap-head"><h2>LOOKBOOK</h2></div>
        <div className="ap-lookbook">
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
