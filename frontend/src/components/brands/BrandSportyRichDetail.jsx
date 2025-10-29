import React, { useMemo } from "react";
import "./brandsportyrich.css";

/* 유틸 */
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

/* 데모 데이터 (경로만 맞춰두면 바로 보임) */
const hotItems = [
  { id: "sr-tee",   name: "SPORTY & RICH 클래식 로고 티셔츠", price: 99000,  img: "images/brands/sportyrich/hot_tee.webp",   badges: ["NEW"] },
  { id: "sr-sweat", name: "SPORTY & RICH 스웻셔츠",           price: 179000, img: "images/brands/sportyrich/hot_sweat.webp", badges: ["BEST"] },
  { id: "sr-jeans", name: "SPORTY & RICH 데님 팬츠",          price: 219000, img: "images/brands/sportyrich/hot_jeans.webp", badges: ["HOT"] },
  { id: "sr-cap",   name: "SPORTY & RICH 볼캡",               price: 69000,  img: "images/brands/sportyrich/hot_cap.webp" },
];

const lookbook = [
  "images/brands/sportyrich/look1.webp",
  "images/brands/sportyrich/look2.webp",
  "images/brands/sportyrich/look3.webp",
  "images/brands/sportyrich/look4.webp",
];

export default function BrandSportyRichDetail() {
  const itemCards = useMemo(
    () =>
      hotItems.map((p) => (
        <div className="sr-card" key={p.id}>
          <div className="sr-thumb">
            {p.badges?.length ? (
              <div className="sr-badges">
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
          <div className="sr-meta">
            <div className="sr-name">{p.name}</div>
            <div className="sr-price">{fmt(toNum(p.price))}</div>
            <div className="sr-actions">
              <button className="btn ghost">자세히</button>
              <button className="btn primary">바로구매</button>
            </div>
          </div>
        </div>
      )),
    []
  );

  return (
    <div className="brand-sr">
      {/* HERO (배경 이미지 + 오버레이) */}
      <section className="sr-hero with-image">
        <div
          className="sr-hero-bg"
          style={{
            backgroundImage: `url("${srcOf("images/brands/sportyrich/hero_main.webp")}")`,
          }}
        />
        <div className="sr-hero-overlay" />
        <div className="sr-hero-inner">
          <div className="sr-hero-badge">SPORTY &amp; RICH</div>
          <h1 className="sr-hero-title">편안함 속의 미니멀, SPORTY &amp; RICH</h1>
          <p className="sr-hero-desc">
            건강한 라이프스타일과 심플한 실루엣으로 완성된 캡슐 컬렉션을 만나보세요.
          </p>
          <div className="sr-hero-cta">
            <button className="btn primary">전체 상품 보기</button>
            <button className="btn ghost">혜택 먼저 보기</button>
          </div>
          <ul className="sr-hero-stats">
            <li><strong>4</strong><span>추천 아이템</span></li>
            <li><strong>1,2K</strong><span>찜/누적거래(예시)</span></li>
            <li><strong>F/W</strong><span>이벤트 시즌</span></li>
          </ul>
        </div>
      </section>

      {/* 지금 핫한 아이템 */}
      <section className="sr-section">
        <div className="sr-head">
          <h2>지금 핫한 아이템</h2>
          <a href="#more" className="link-more">더보기</a>
        </div>
        <div className="sr-grid">{itemCards}</div>
      </section>

      {/* 신규 회원 혜택 (쿠폰등록 제거, 가입/쿠폰함 버튼) */}
      <section className="sr-benefit">
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
      <section className="sr-section">
        <div className="sr-head"><h2>LOOKBOOK</h2></div>
        <div className="sr-lookbook">
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

      {/* 매장/안내 */}
      <section className="sr-section">
        <div className="sr-head"><h2>SPORTY &amp; RICH 오프라인</h2></div>
        <div className="sr-store">
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
