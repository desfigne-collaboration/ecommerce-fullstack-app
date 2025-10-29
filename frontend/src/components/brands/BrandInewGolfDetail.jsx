import React, { useMemo } from "react";
import "./brandinewgolf.css";

/* 유틸 */
const toNum = (v) =>
  typeof v === "number" ? v : Number(String(v ?? "").replace(/[^\d]/g, "")) || 0;
const fmt = (n) => `₩${Number(n || 0).toLocaleString()}`;
const PLACEHOLDER = `${process.env.PUBLIC_URL || ""}/images/placeholder.webp`;
const srcOf = (raw) => {
  const s = String(raw || "").trim();
  if (!s) return PLACEHOLDER;
  return s; // 외부 URL 그대로 사용
};

/* 외부 이미지 사용한 데모 데이터 */
const hotItems = [
  {
    id: "ig-polo",
    name: "INYOU GOLF 테크 폴로",
    price: 129000,
    img:
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80",
    badges: ["NEW"],
  },
  {
    id: "ig-wind",
    name: "INYOU GOLF 윈드브레이커",
    price: 219000,
    img:
      "https://images.unsplash.com/photo-1519683222233-3b1817f69a2a?auto=format&fit=crop&w=1200&q=80",
    badges: ["BEST"],
  },
  {
    id: "ig-shoes",
    name: "INYOU GOLF 스파이크리스",
    price: 179000,
    img:
      "https://images.unsplash.com/photo-1554344728-77cf90d9ed26?auto=format&fit=crop&w=1200&q=80",
    badges: ["HOT"],
  },
  {
    id: "ig-cap",
    name: "INYOU GOLF 로고 캡",
    price: 49000,
    img:
      "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1200&q=80",
  },
];

const lookbook = [
  "https://images.unsplash.com/photo-1560439513-74b1e5650b37?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1519996529931-28324d5a6301?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1520880867055-1e30d1cb001c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1517414204284-6dfa3ec6f6f9?auto=format&fit=crop&w=900&q=80",
];

export default function BrandInewGolfDetail() {
  const itemCards = useMemo(
    () =>
      hotItems.map((p) => (
        <div className="ig-card" key={p.id}>
          <div className="ig-thumb">
            {p.badges?.length ? (
              <div className="ig-badges">
                {p.badges.map((b) => (
                  <span key={b} className={`bdg ${b.toLowerCase()}`}>
                    {b}
                  </span>
                ))}
              </div>
            ) : null}
            <img
              src={srcOf(p.img)}
              onError={(e) => {
                e.currentTarget.src = PLACEHOLDER;
              }}
              alt={p.name}
            />
          </div>
          <div className="ig-meta">
            <div className="ig-name">{p.name}</div>
            <div className="ig-price">{fmt(toNum(p.price))}</div>
            <div className="ig-actions">
              <button className="btn ghost">자세히</button>
              <button className="btn primary">바로구매</button>
            </div>
          </div>
        </div>
      )),
    []
  );

  return (
    <div className="brand-ig">
      {/* HERO (외부 이미지 + 오버레이) */}
      <section className="ig-hero with-image">
        <div
          className="ig-hero-bg"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1920&q=80")',
          }}
        />
        <div className="ig-hero-overlay" />
        <div className="ig-hero-inner">
          <div className="ig-hero-badge">INYOU GOLF</div>
          <h1 className="ig-hero-title">그린 위의 퍼포먼스, INYOU GOLF</h1>
          <p className="ig-hero-desc">
            라운딩의 움직임에 최적화된 테크니컬 패브릭과 미니멀 핏으로
            시즌 룩을 완성하세요.
          </p>
          <div className="ig-hero-cta">
            <button className="btn primary">전체 상품 보기</button>
            <button className="btn ghost">혜택 먼저 보기</button>
          </div>
          <ul className="ig-hero-stats">
            <li>
              <strong>4</strong>
              <span>추천 아이템</span>
            </li>
            <li>
              <strong>980</strong>
              <span>찜/누적거래(예시)</span>
            </li>
            <li>
              <strong>S/S</strong>
              <span>이벤트 시즌</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 지금 핫한 아이템 */}
      <section className="ig-section">
        <div className="ig-head">
          <h2>지금 핫한 아이템</h2>
          <a href="#more" className="link-more">
            더보기
          </a>
        </div>
        <div className="ig-grid">{itemCards}</div>
      </section>

      {/* 신규 회원 혜택 */}
      <section className="ig-benefit">
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
      <section className="ig-section">
        <div className="ig-head">
          <h2>LOOKBOOK</h2>
        </div>
        <div className="ig-lookbook">
          {lookbook.map((src, i) => (
            <div className="lb-card" key={i}>
              <img
                src={srcOf(src)}
                onError={(e) => {
                  e.currentTarget.src = PLACEHOLDER;
                }}
                alt={`look ${i + 1}`}
              />
            </div>
          ))}
        </div>
      </section>

      {/* 매장/안내 */}
      <section className="ig-section">
        <div className="ig-head">
          <h2>INYOU GOLF 오프라인</h2>
        </div>
        <div className="ig-store">
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
