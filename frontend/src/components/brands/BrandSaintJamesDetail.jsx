import React, { useMemo } from "react";
import "./brandsaintjames.css";

/* ---------- Utils ---------- */
const toNum = (v) =>
  typeof v === "number" ? v : Number(String(v ?? "").replace(/[^\d]/g, "")) || 0;
const fmt = (n) => `₩${Number(n || 0).toLocaleString()}`;
const PLACEHOLDER = `${process.env.PUBLIC_URL || ""}/images/placeholder.webp`;
const srcOf = (raw) => (raw ? raw : PLACEHOLDER);

/* ---------- Demo data (외부 이미지) ---------- */
const hotItems = [
  {
    id: "sj-breton-navy",
    name: "세인트 제임스 브르통 스트라이프 (네이비)",
    price: 149000,
    img: "https://images.unsplash.com/photo-1542219550-35653e1b47a3?auto=format&fit=crop&w=1200&q=80",
    badges: ["BEST"],
  },
  {
    id: "sj-breton-red",
    name: "세인트 제임스 브르통 스트라이프 (레드)",
    price: 149000,
    img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80",
    badges: ["NEW"],
  },
  {
    id: "sj-sailor-jacket",
    name: "세일러 자켓",
    price: 289000,
    img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80",
    badges: ["HOT"],
  },
  {
    id: "sj-cotton-bag",
    name: "마린 코튼 토트",
    price: 89000,
    img: "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=1200&q=80",
  },
];

const lookbook = [
  "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1500375592092-04170dc5a9f7?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1500375592092-34df04e3d6d5?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80",
];

export default function BrandSaintJamesDetail() {
  const itemCards = useMemo(
    () =>
      hotItems.map((p) => (
        <div className="sj-card" key={p.id}>
          <div className="sj-thumb">
            {p.badges?.length ? (
              <div className="sj-badges">
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
          <div className="sj-meta">
            <div className="sj-name">{p.name}</div>
            <div className="sj-price">{fmt(toNum(p.price))}</div>
            <div className="sj-actions">
              <button className="btn ghost">자세히</button>
              <button className="btn primary">바로구매</button>
            </div>
          </div>
        </div>
      )),
    []
  );

  return (
    <div className="brand-sj">
      {/* HERO — 바다/선착장 사진 */}
      <section className="sj-hero with-image">
        <div
          className="sj-hero-bg"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1500375592092-04170dc5a9f7?auto=format&fit=crop&w=1920&q=90")',
          }}
        />
        <div className="sj-hero-overlay" />
        <div className="sj-hero-lines" aria-hidden="true" />
        <div className="sj-hero-inner">
          <div className="sj-hero-badge">SAINT JAMES</div>
          <h1 className="sj-hero-title">마린 헤리티지의 아이콘, 세인트 제임스</h1>
          <p className="sj-hero-desc">
            브르통 스트라이프와 네이비 팔레트로 완성하는 정통 프렌치 마린 룩.
          </p>
          <div className="sj-hero-cta">
            <button className="btn primary">전체 상품 보기</button>
            <button className="btn ghost">혜택 먼저 보기</button>
          </div>
          <ul className="sj-hero-stats">
            <li><strong>4</strong><span>추천 아이템</span></li>
            <li><strong>986</strong><span>찜/누적거래</span></li>
            <li><strong>S/S</strong><span>이벤트 시즌</span></li>
          </ul>
        </div>
      </section>

      {/* 지금 핫한 아이템 — 캔버스 텍스처 사진 */}
      <section className="sj-section canvas-bg">
        <div className="sj-head">
          <h2>지금 핫한 아이템</h2>
          <a href="#more" className="link-more">더보기</a>
        </div>
        <div className="sj-grid">{itemCards}</div>
      </section>

      {/* 혜택 밴드 — 데크/로프 사진 */}
      <section className="sj-benefit with-photo">
        <div
          className="benefit-photo"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1520991041300-815f69a0f3f4?auto=format&fit=crop&w=1920&q=90")',
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
              <button className="btn navy">회원가입</button>
              <button className="btn outline">쿠폰함</button>
            </div>
          </div>

          <div className="benefit-grid mini">
            <div className="glass benefit-card">
              <div className="tit">멤버십등급 추가적립</div>
              <p>구매 금액대별 최대 5% 포인트 적립</p>
            </div>
            <div className="glass benefit-card">
              <div className="tit">오늘 출발</div>
              <p>오후 2시 이전 결제 시 당일 출고(일부 품목)</p>
            </div>
            <div className="glass benefit-card">
              <div className="tit">무료 반품</div>
              <p>사이즈/컬러 교환 1회 무료 (정책 준수)</p>
            </div>
          </div>
        </div>
      </section>

      {/* LOOKBOOK — 요트/포트 사진 타일 */}
      <section className="sj-section rope-bg">
        <div className="sj-head"><h2>LOOKBOOK</h2></div>
        <div className="sj-lookbook">
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
