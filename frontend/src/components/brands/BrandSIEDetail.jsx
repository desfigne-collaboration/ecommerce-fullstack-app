import React, { useMemo } from "react";
import "./brandsie.css";

const toNum = (v) =>
  typeof v === "number" ? v : Number(String(v ?? "").replace(/[^\d]/g, "")) || 0;
const fmt = (n) => `₩${Number(n || 0).toLocaleString()}`;
const PLACEHOLDER = `${process.env.PUBLIC_URL || ""}/images/placeholder.webp`;
const srcOf = (raw) => {
  const s = String(raw || "").trim();
  if (!s) return PLACEHOLDER;
  if (/^https?:\/\//i.test(s)) return s;
  return `${process.env.PUBLIC_URL || ""}/${s.replace(/^\/+/, "")}`;
};

const hotItems = [
  { id: "sie-jacket", name: "SIE 테일러드 자켓", price: 299000, img: "images/brands/sie/hot_jacket.webp", badges: ["BEST"] },
  { id: "sie-trousers", name: "SIE 슬림 트라우저", price: 219000, img: "images/brands/sie/hot_trousers.webp", badges: ["NEW"] },
  { id: "sie-shirt", name: "SIE 옥스포드 셔츠", price: 119000, img: "images/brands/sie/hot_shirt.webp" },
  { id: "sie-shoes", name: "SIE 클래식 로퍼", price: 259000, img: "images/brands/sie/hot_shoes.webp", badges: ["HOT"] },
];

const lookbook = [
  "images/brands/sie/look1.webp",
  "images/brands/sie/look2.webp",
  "images/brands/sie/look3.webp",
  "images/brands/sie/look4.webp",
];

export default function BrandSIEDetail() {
  const itemCards = useMemo(
    () =>
      hotItems.map((p) => (
        <div className="sie-card" key={p.id}>
          <div className="sie-thumb">
            {p.badges?.length ? (
              <div className="sie-badges">
                {p.badges.map((b) => (
                  <span key={b} className={`bdg ${b.toLowerCase()}`}>{b}</span>
                ))}
              </div>
            ) : null}
            <img
              src={srcOf(p.img)}
              onError={(e) => { e.currentTarget.src = PLACEHOLDER; }}
              alt={p.name}
            />
          </div>
          <div className="sie-meta">
            <div className="sie-name">{p.name}</div>
            <div className="sie-price">{fmt(toNum(p.price))}</div>
            <div className="sie-actions">
              <button className="btn ghost">자세히</button>
              <button className="btn primary">바로구매</button>
            </div>
          </div>
        </div>
      )),
    []
  );

  return (
    <div className="brand-sie">
      {/* HERO (배경 이미지 + 오버레이) */}
      <section className="sie-hero with-image">
        <div
          className="sie-hero-bg"
          style={{
            backgroundImage: `url("${srcOf("images/brands/sie/hero_main.webp")}")`,
          }}
        />
        <div className="sie-hero-overlay" />
        <div className="sie-hero-inner">
          <div className="sie-hero-badge">S I E</div>
          <h1 className="sie-hero-title">모던 테일러링, SIE</h1>
          <p className="sie-hero-desc">
            정제된 실루엣과 섬세한 감성으로 완성된 테일러링의 미학을 경험하세요.
          </p>
          <div className="sie-hero-cta">
            <button className="btn primary">전체 상품 보기</button>
            <button className="btn ghost">혜택 먼저 보기</button>
          </div>
          <ul className="sie-hero-stats">
            <li><strong>4</strong><span>추천 아이템</span></li>
            <li><strong>1,1K</strong><span>찜/누적거래(예시)</span></li>
            <li><strong>S/S</strong><span>이벤트 시즌</span></li>
          </ul>
        </div>
      </section>

      {/* 지금 핫한 아이템 */}
      <section className="sie-section">
        <div className="sie-head">
          <h2>지금 핫한 아이템</h2>
          <a href="#more" className="link-more">더보기</a>
        </div>
        <div className="sie-grid">{itemCards}</div>
      </section>

      {/* 회원 혜택 */}
      <section className="sie-benefit">
        <div className="inner">
          <div className="signup-card">
            <div className="left">
              <div className="eyebrow">신규 회원 혜택</div>
              <h3>첫 구매 10,000원 쿠폰</h3>
              <p>회원가입만 해도 바로 적용 가능한 웰컴 쿠폰을 드립니다.</p>
            </div>
            <div className="right">
              <button className="btn green">회원가입</button>
              <button className="btn ghost">쿠폰함</button>
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
      <section className="sie-section">
        <div className="sie-head"><h2>LOOKBOOK</h2></div>
        <div className="sie-lookbook">
          {lookbook.map((src, i) => (
            <div className="lb-card" key={i}>
              <img
                src={srcOf(src)}
                onError={(e) => { e.currentTarget.src = PLACEHOLDER; }}
                alt={`look ${i + 1}`}
              />
            </div>
          ))}
        </div>
      </section>

      {/* 매장 안내 */}
      <section className="sie-section">
        <div className="sie-head"><h2>SIE 오프라인</h2></div>
        <div className="sie-store">
          <div className="store-card">
            <div className="tit">단독 팝업/편집숍</div>
            <p>브랜드 무드를 더 가까이, 전개 매장을 확인하세요.</p>
            <button className="btn ghost">매장 찾기</button>
          </div>
          <div className="store-card">
            <div className="tit">A/S &amp; 케어</div>
            <p>케어 가이드와 세탁 팁을 확인해 제품을 오래 입어보세요.</p>
            <button className="btn ghost">가이드 보기</button>
          </div>
        </div>
      </section>
    </div>
  );
}
