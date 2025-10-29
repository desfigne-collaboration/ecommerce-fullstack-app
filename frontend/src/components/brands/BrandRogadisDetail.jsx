import React, { useMemo } from "react";
import "./brandrogadis.css";

/* ---------- 유틸 ---------- */
const toNum = (v) =>
  typeof v === "number" ? v : Number(String(v ?? "").replace(/[^\d]/g, "")) || 0;
const fmt = (n) => `₩${Number(n || 0).toLocaleString()}`;
const PLACEHOLDER = `${process.env.PUBLIC_URL || ""}/images/placeholder.webp`;
const srcOf = (raw) => (raw ? raw : PLACEHOLDER);

/* ---------- 데모 데이터 (외부 이미지) ---------- */
const hotItems = [
  {
    id: "rogadis-suit",
    name: "ROGATIS 클래식 수트 세트",
    price: 489000,
    img: "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1200&q=80",
    badges: ["BEST"],
  },
  {
    id: "rogadis-coat",
    name: "ROGATIS 캐시미어 코트",
    price: 589000,
    img: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1200&q=80",
    badges: ["NEW"],
  },
  {
    id: "rogadis-shirt",
    name: "ROGATIS 이탈리안 셔츠",
    price: 119000,
    img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80",
    badges: ["HOT"],
  },
  {
    id: "rogadis-tie",
    name: "ROGATIS 실크 타이",
    price: 69000,
    img: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
  },
];

const lookbook = [
  "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1517414204284-6dfa3ec6f6f9?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=900&q=80",
];

export default function BrandRogadisDetail() {
  const itemCards = useMemo(
    () =>
      hotItems.map((p) => (
        <div className="rog-card" key={p.id}>
          <div className="rog-thumb">
            {p.badges?.length ? (
              <div className="rog-badges">
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
          <div className="rog-meta">
            <div className="rog-name">{p.name}</div>
            <div className="rog-price">{fmt(toNum(p.price))}</div>
            <div className="rog-actions">
              <button className="btn ghost">자세히</button>
              <button className="btn primary">바로구매</button>
            </div>
          </div>
        </div>
      )),
    []
  );

  return (
    <div className="brand-rog">
      {/* ---------- HERO ---------- */}
      <section className="rog-hero with-image">
        <div
          className="rog-hero-bg"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1920&q=80")',
          }}
        />
        <div className="rog-hero-overlay" />
        <div className="rog-hero-inner">
          <div className="rog-hero-badge">ROGATIS</div>
          <h1 className="rog-hero-title">모던 클래식, ROGATIS</h1>
          <p className="rog-hero-desc">
            도시적 감성과 절제된 실루엣으로 완성하는 모던 수트 브랜드.
          </p>
          <div className="rog-hero-cta">
            <button className="btn primary">전체 상품 보기</button>
            <button className="btn ghost">혜택 먼저 보기</button>
          </div>
          <ul className="rog-hero-stats">
            <li><strong>4</strong><span>추천 아이템</span></li>
            <li><strong>1.4K</strong><span>찜/누적거래</span></li>
            <li><strong>F/W</strong><span>이벤트 시즌</span></li>
          </ul>
        </div>
      </section>

      {/* ---------- 지금 핫한 아이템 ---------- */}
      <section className="rog-section">
        <div className="rog-head">
          <h2>지금 핫한 아이템</h2>
          <a href="#more" className="link-more">더보기</a>
        </div>
        <div className="rog-grid">{itemCards}</div>
      </section>

      {/* ---------- 신규 회원 혜택 (톤 살린 그라데이션 + 미니 카드) ---------- */}
      <section className="rog-benefit">
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

      {/* ---------- LOOKBOOK ---------- */}
      <section className="rog-section">
        <div className="rog-head"><h2>LOOKBOOK</h2></div>
        <div className="rog-lookbook">
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
