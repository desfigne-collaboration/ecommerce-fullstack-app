import React, { useMemo } from "react";
import "./brandtommy.css";

/* ---------- Utils ---------- */
const toNum = (v) =>
  typeof v === "number" ? v : Number(String(v ?? "").replace(/[^\d]/g, "")) || 0;
const fmt = (n) => `₩${Number(n || 0).toLocaleString()}`;
const PLACEHOLDER = `${process.env.PUBLIC_URL || ""}/images/placeholder.webp`;
const srcOf = (raw) => (raw ? raw : PLACEHOLDER);

/* ---------- Demo data (외부 이미지) ---------- */
const hotItems = [
  {
    id: "th-flag-sweater",
    name: "타미 힐피거 플래그 크루넥 니트",
    price: 229000,
    img: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    badges: ["BEST"],
  },
  {
    id: "th-oxford-shirt",
    name: "옥스퍼드 버튼다운 셔츠",
    price: 149000,
    img: "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1200&q=80",
    badges: ["NEW"],
  },
  {
    id: "th-denim",
    name: "스트레이트 핏 데님",
    price: 159000,
    img: "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=1200&q=80",
    badges: ["HOT"],
  },
  {
    id: "th-polo",
    name: "클래식 폴로 셔츠",
    price: 119000,
    img: "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1200&q=80",
  },
];

const lookbook = [
  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=900&q=80",
];

export default function BrandTommyHilfigerDetail() {
  const itemCards = useMemo(
    () =>
      hotItems.map((p) => (
        <div className="th-card" key={p.id}>
          <div className="th-thumb">
            {p.badges?.length ? (
              <div className="th-badges">
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
          <div className="th-meta">
            <div className="th-name">{p.name}</div>
            <div className="th-price">{fmt(toNum(p.price))}</div>
            <div className="th-actions">
              <button className="btn ghost">자세히</button>
              <button className="btn primary">바로구매</button>
            </div>
          </div>
        </div>
      )),
    []
  );

  return (
    <div className="brand-th">
      {/* HERO — 프레피/캠퍼스 사진 */}
      <section className="th-hero with-image">
        <div
          className="th-hero-bg"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1920&q=90")',
          }}
        />
        <div className="th-hero-overlay" />
        <div className="th-hero-lines" aria-hidden="true" />
        <div className="th-hero-inner">
          <div className="th-hero-badge">TOMMY HILFIGER</div>
          <h1 className="th-hero-title">아메리칸 프레피의 정석, 타미 힐피거</h1>
          <p className="th-hero-desc">
            레드·화이트·네이비 팔레트로 완성하는 아이코닉 데일리룩.
          </p>
          <div className="th-hero-cta">
            <button className="btn primary">전체 상품 보기</button>
            <button className="btn ghost">혜택 먼저 보기</button>
          </div>
          <ul className="th-hero-stats">
            <li><strong>4</strong><span>추천 아이템</span></li>
            <li><strong>1.1K</strong><span>찜/누적거래</span></li>
            <li><strong>S/S</strong><span>이벤트 시즌</span></li>
          </ul>
        </div>
      </section>

      {/* 지금 핫한 아이템 — 캔버스/데님 텍스처 */}
      <section className="th-section canvas-bg">
        <div className="th-head">
          <h2>지금 핫한 아이템</h2>
          <a href="#more" className="link-more">더보기</a>
        </div>
        <div className="th-grid">{itemCards}</div>
      </section>

      {/* 혜택 밴드 — 데님/깃발 사진 */}
      <section className="th-benefit with-photo">
        <div
          className="benefit-photo"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=1920&q=90")',
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
              <button className="btn flag">회원가입</button>
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

      {/* LOOKBOOK — 도심/거리 프레피 타일 */}
      <section className="th-section street-bg">
        <div className="th-head"><h2>LOOKBOOK</h2></div>
        <div className="th-lookbook">
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
