import React, { useMemo } from "react";
import "./brandcos.css";

/* ---------- Utils ---------- */
const toNum = (v) =>
  typeof v === "number" ? v : Number(String(v ?? "").replace(/[^\d]/g, "")) || 0;
const fmt = (n) => `₩${Number(n || 0).toLocaleString()}`;
const PLACEHOLDER = `${process.env.PUBLIC_URL || ""}/images/placeholder.webp`;
const srcOf = (raw) => (raw ? raw : PLACEHOLDER);

/* ---------- Demo data (외부 이미지) ---------- */
const hotItems = [
  {
    id: "cos-coat",
    name: "COS 테일러드 코트",
    price: 429000,
    img: "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1200&q=80",
    badges: ["BEST"],
  },
  {
    id: "cos-knit",
    name: "COS 메리노 니트",
    price: 159000,
    img: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    badges: ["NEW"],
  },
  {
    id: "cos-trouser",
    name: "COS 와이드 트라우저",
    price: 189000,
    img: "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=1200&q=80",
    badges: ["HOT"],
  },
  {
    id: "cos-bag",
    name: "COS 레더 토트",
    price: 259000,
    img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80",
  },
];

const lookbook = [
  "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1517414204284-6dfa3ec6f6f9?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=900&q=80",
];

export default function BrandCOSDetail() {
  const itemCards = useMemo(
    () =>
      hotItems.map((p) => (
        <div className="cos-card" key={p.id}>
          <div className="cos-thumb">
            {p.badges?.length ? (
              <div className="cos-badges">
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
          <div className="cos-meta">
            <div className="cos-name">{p.name}</div>
            <div className="cos-price">{fmt(toNum(p.price))}</div>
            <div className="cos-actions">
              <button className="btn ghost">자세히</button>
              <button className="btn primary">바로구매</button>
            </div>
          </div>
        </div>
      )),
    []
  );

  return (
    <div className="brand-cos">
      {/* HERO — 사진 배경 */}
      <section className="cos-hero with-image">
        <div
          className="cos-hero-bg"
          style={{
            backgroundImage:
              // 미니멀 스튜디오 사진
              'url("https://images.unsplash.com/photo-1517414204284-6dfa3ec6f6f9?auto=format&fit=crop&w=1920&q=90")',
          }}
        />
        <div className="cos-hero-overlay" />
        <div className="cos-hero-lines" aria-hidden="true" />
        <div className="cos-hero-inner">
          <div className="cos-hero-badge">COS</div>
          <h1 className="cos-hero-title">타임리스 미니멀리즘, COS</h1>
          <p className="cos-hero-desc">
            정제된 실루엣과 균형 잡힌 비율로 완성하는 현대적 워드로브.
          </p>
          <div className="cos-hero-cta">
            <button className="btn primary">전체 상품 보기</button>
            <button className="btn ghost">혜택 먼저 보기</button>
          </div>
          <ul className="cos-hero-stats">
            <li><strong>4</strong><span>추천 아이템</span></li>
            <li><strong>1.7K</strong><span>찜/누적거래</span></li>
            <li><strong>F/W</strong><span>이벤트 시즌</span></li>
          </ul>
        </div>
      </section>

      {/* 지금 핫한 아이템 — 종이 질감 배경 */}
      <section className="cos-section paper-bg">
        <div className="cos-head">
          <h2>지금 핫한 아이템</h2>
          <a href="#more" className="link-more">더보기</a>
        </div>
        <div className="cos-grid">{itemCards}</div>
      </section>

      {/* 혜택 밴드 — 사진 배경 */}
      <section className="cos-benefit with-photo">
        <div
          className="benefit-photo"
          style={{
            backgroundImage:
              // 패브릭/텍스타일 느낌의 사진
              'url("https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&fit=crop&w=1920&q=90")',
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
              <button className="btn sage">회원가입</button>
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

      {/* LOOKBOOK — 사진 타일 */}
      <section className="cos-section texture-bg">
        <div className="cos-head"><h2>LOOKBOOK</h2></div>
        <div className="cos-lookbook">
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
