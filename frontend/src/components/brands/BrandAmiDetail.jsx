import React, { useMemo } from "react";
import "./brandami.css";

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

/* 외부 이미지(Unsplash) 데모 데이터 */
const hotItems = [
  {
    id: "ami-cardigan",
    name: "AMI 하트 로고 가디건",
    price: 359000,
    img: "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=1200&q=80",
    badges: ["BEST"],
  },
  {
    id: "ami-trench",
    name: "AMI 클래식 트렌치 코트",
    price: 529000,
    img: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1200&q=80",
    badges: ["NEW"],
  },
  {
    id: "ami-jeans",
    name: "AMI 스트레이트 데님",
    price: 239000,
    img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80",
    badges: ["HOT"],
  },
  {
    id: "ami-sneaker",
    name: "AMI 미니멀 스니커즈",
    price: 199000,
    img: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
  },
];

const lookbook = [
  "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1517414204284-6dfa3ec6f6f9?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80",
];

export default function BrandAmiDetail() {
  const itemCards = useMemo(
    () =>
      hotItems.map((p) => (
        <div className="ami-card" key={p.id}>
          <div className="ami-thumb">
            {p.badges?.length ? (
              <div className="ami-badges">
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
          <div className="ami-meta">
            <div className="ami-name">{p.name}</div>
            <div className="ami-price">{fmt(toNum(p.price))}</div>
            <div className="ami-actions">
              <button className="btn ghost">자세히</button>
              <button className="btn primary">바로구매</button>
            </div>
          </div>
        </div>
      )),
    []
  );

  return (
    <div className="brand-ami">
      {/* HERO (외부 이미지 + 오버레이) */}
      <section className="ami-hero with-image">
        <div
          className="ami-hero-bg"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1920&q=80")',
          }}
        />
        <div className="ami-hero-overlay" />
        <div className="ami-hero-inner">
          <div className="ami-hero-badge">AMI PARIS</div>
          <h1 className="ami-hero-title">파리지앵 미니멀, AMI</h1>
          <p className="ami-hero-desc">
            심플한 라인과 절제된 실루엣, 아이코닉 하트 로고로 완성하는 컨템포러리 룩.
          </p>
          <div className="ami-hero-cta">
            <button className="btn primary">전체 상품 보기</button>
            <button className="btn ghost">혜택 먼저 보기</button>
          </div>
          <ul className="ami-hero-stats">
            <li><strong>4</strong><span>추천 아이템</span></li>
            <li><strong>1,2K</strong><span>찜/누적거래(예시)</span></li>
            <li><strong>F/W</strong><span>이벤트 시즌</span></li>
          </ul>
        </div>
      </section>

      {/* 지금 핫한 아이템 */}
      <section className="ami-section">
        <div className="ami-head">
          <h2>지금 핫한 아이템</h2>
          <a href="#more" className="link-more">더보기</a>
        </div>
        <div className="ami-grid">{itemCards}</div>
      </section>

      {/* 신규 회원 혜택 */}
      <section className="ami-benefit">
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
      <section className="ami-section">
        <div className="ami-head"><h2>LOOKBOOK</h2></div>
        <div className="ami-lookbook">
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
      <section className="ami-section">
        <div className="ami-head"><h2>AMI 오프라인</h2></div>
        <div className="ami-store">
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
