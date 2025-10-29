import React, { useMemo } from "react";
import "./branddanton.css";

/* 유틸 */
const toNum = (v) =>
  typeof v === "number" ? v : Number(String(v ?? "").replace(/[^\d]/g, "")) || 0;
const fmt = (n) => `₩${Number(n || 0).toLocaleString()}`;
const PLACEHOLDER = `${process.env.PUBLIC_URL || ""}/images/placeholder.webp`;
const srcOf = (raw) => (raw ? raw : PLACEHOLDER);

/* 외부 이미지 (Unsplash) 데모 데이터 */
const hotItems = [
  {
    id: "danton-chore-coat",
    name: "DANTON 코튼 트윌 쇼어 코트",
    price: 219000,
    img: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1200&q=80",
    badges: ["BEST"],
  },
  {
    id: "danton-down-vest",
    name: "DANTON 라이트 다운 베스트",
    price: 179000,
    img: "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=1200&q=80",
    badges: ["NEW"],
  },
  {
    id: "danton-fleece",
    name: "DANTON 플리스 집업",
    price: 149000,
    img: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    badges: ["HOT"],
  },
  {
    id: "danton-tote",
    name: "DANTON 캔버스 토트백",
    price: 69000,
    img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80",
  },
];

const lookbook = [
  "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1517414204284-6dfa3ec6f6f9?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80",
];

export default function BrandDantonDetail() {
  const itemCards = useMemo(
    () =>
      hotItems.map((p) => (
        <div className="dan-card" key={p.id}>
          <div className="dan-thumb">
            {p.badges?.length ? (
              <div className="dan-badges">
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
          <div className="dan-meta">
            <div className="dan-name">{p.name}</div>
            <div className="dan-price">{fmt(toNum(p.price))}</div>
            <div className="dan-actions">
              <button className="btn ghost">자세히</button>
              <button className="btn primary">바로구매</button>
            </div>
          </div>
        </div>
      )),
    []
  );

  return (
    <div className="brand-dan">
      {/* HERO */}
      <section className="dan-hero with-image">
        <div
          className="dan-hero-bg"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1517414204284-6dfa3ec6f6f9?auto=format&fit=crop&w=1920&q=80")',
          }}
        />
        <div className="dan-hero-overlay" />
        <div className="dan-hero-inner">
          <div className="dan-hero-badge">DANTON</div>
          <h1 className="dan-hero-title">프렌치 워크웨어, DANTON</h1>
          <p className="dan-hero-desc">
            아이코닉 다이아 로고와 실용적인 디테일로 완성하는 데일리 유틸리티 룩.
          </p>
          <div className="dan-hero-cta">
            <button className="btn primary">전체 상품 보기</button>
            <button className="btn ghost">혜택 먼저 보기</button>
          </div>
          <ul className="dan-hero-stats">
            <li><strong>4</strong><span>추천 아이템</span></li>
            <li><strong>1.1K</strong><span>찜/누적거래</span></li>
            <li><strong>F/W</strong><span>이벤트 시즌</span></li>
          </ul>
        </div>
      </section>

      {/* 지금 핫한 아이템 */}
      <section className="dan-section">
        <div className="dan-head">
          <h2>지금 핫한 아이템</h2>
          <a href="#more" className="link-more">더보기</a>
        </div>
        <div className="dan-grid">{itemCards}</div>
      </section>

      {/* 신규 회원 혜택 */}
      <section className="dan-benefit">
        <div className="inner">
          <div className="signup-card">
            <div className="left">
              <div className="eyebrow">신규 회원 혜택</div>
              <h3>첫 구매 10,000원 쿠폰</h3>
              <p>회원가입만 해도 바로 적용 가능한 웰컴 쿠폰을 드립니다.</p>
            </div>
            <div className="right">
              <button className="btn green">회원가입</button>
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
      <section className="dan-section">
        <div className="dan-head"><h2>LOOKBOOK</h2></div>
        <div className="dan-lookbook">
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
