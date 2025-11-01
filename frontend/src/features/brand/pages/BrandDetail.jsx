import React, { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import brandsData from "../data/brands.json";
import { buyNow } from "../../../utils/buynow";
import "./BrandDetail.css";

/** 외부/내부 이미지 경로 안전 보정 */
const srcOf = (raw) => {
  const s = String(raw || "").trim();
  if (!s)
    return "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&q=80&auto=format&fit=crop";
  if (/^https?:\/\//i.test(s)) return s;
  return `${process.env.PUBLIC_URL || ""}/${s.replace(/^\/+/, "")}`;
};

// 간단 사이즈
const SIZES = ["XS", "S", "M", "L", "XL"];

export default function BrandDetail() {
  const navigate = useNavigate();
  const { brandId } = useParams();

  // brandId로 brands.json에서 데이터 찾기
  const brand = useMemo(() => {
    return brandsData.find((b) => b.id === brandId);
  }, [brandId]);

  const total = useMemo(() => {
    if (!brand || !brand.products) return 0;
    return brand.products.reduce((a, c) => a + (c.price || 0), 0);
  }, [brand]);

  // 카드별 사이즈 선택 UI 오픈/선택 상태
  const [openSku, setOpenSku] = useState(null); // 열려있는 상품 id
  const [pickedSize, setPickedSize] = useState({}); // { [sku]: "M" }

  const openPicker = (sku) => {
    setOpenSku((prev) => (prev === sku ? null : sku));
  };

  const onPickSize = (sku, size) => {
    setPickedSize((prev) => ({ ...prev, [sku]: size }));
  };

  const onBuy = (p) => {
    const size = pickedSize[p.id];
    if (!size) return; // 방어

    // buyNow(상품, 수량, navigate, 옵션)
    buyNow(
      {
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.image,
      },
      1,
      navigate,
      { size }
    );
  };

  // 브랜드를 찾지 못한 경우
  if (!brand) {
    return (
      <div className="brand-not-found">
        <h1>브랜드를 찾을 수 없습니다</h1>
        <p>요청하신 브랜드 "{brandId}"가 존재하지 않습니다.</p>
        <Link to="/" className="btn-back">
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="brand-detail">
      {/* HERO */}
      <section className="brand-hero">
        <div className="brand-hero-inner">
          <div className="brand-badge">{brand.badge || brand.name}</div>
          <h1 className="brand-title">{brand.title}</h1>
          <p className="brand-sub">{brand.description}</p>

          <div className="brand-cta">
            <Link
              to={`/category?brand=${brand.id}`}
              className="brand-btn brand-btn-primary"
            >
              전체 상품 보기
            </Link>
            <a href="#benefits" className="brand-btn brand-btn-ghost">
              혜택 먼저 보기
            </a>
          </div>

          <ul className="brand-stats">
            <li>
              <strong>{brand.products?.length || 0}</strong>
              <span>추천 아이템</span>
            </li>
            <li>
              <strong>{(total / 1000).toLocaleString()}K</strong>
              <span>합계 가격(참고)</span>
            </li>
            <li>
              <strong>{brand.season || "ALL"}</strong>
              <span>이번 시즌</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 추천 상품 */}
      {brand.products && brand.products.length > 0 && (
        <section className="brand-section">
          <div className="brand-section-head">
            <h2>지금 핫한 아이템</h2>
            <Link to={`/category?brand=${brand.id}`} className="brand-more">
              더 보기
            </Link>
          </div>

          <div className="brand-grid">
            {brand.products.map((p) => {
              const opened = openSku === p.id;
              const curSize = pickedSize[p.id] || "";

              return (
                <article key={p.id} className="brand-card">
                  <div className="brand-card-thumb">
                    <img src={srcOf(p.image)} alt={p.name} />
                    {p.tag && <span className="brand-tag">{p.tag}</span>}
                  </div>

                  <div className="brand-card-body">
                    <h3 className="brand-name">{p.name}</h3>
                    <div className="brand-price">
                      ₩{Number(p.price || 0).toLocaleString()}
                    </div>

                    {/* 기본 액션 */}
                    <div className="brand-actions">
                      <Link to={`/product/${p.id}`} className="brand-small-btn">
                        자세히
                      </Link>

                      {/* 바로구매 → 사이즈 선택 열기 */}
                      <button
                        type="button"
                        className="brand-small-btn brand-small-primary"
                        onClick={() => openPicker(p.id)}
                      >
                        바로구매
                      </button>
                    </div>

                    {/* 사이즈 선택 박스 (열렸을 때만) */}
                    {opened && (
                      <div className="brand-sizebox">
                        <div className="sizebox-title">사이즈 선택</div>
                        <div className="sizebox-chips">
                          {SIZES.map((s) => (
                            <button
                              key={s}
                              type="button"
                              className={`sizebox-chip ${
                                curSize === s ? "active" : ""
                              }`}
                              onClick={() => onPickSize(p.id, s)}
                            >
                              {s}
                            </button>
                          ))}
                        </div>

                        <div className="sizebox-actions">
                          <button
                            type="button"
                            className="brand-small-btn"
                            onClick={() => setOpenSku(null)}
                          >
                            닫기
                          </button>
                          <button
                            type="button"
                            className={`brand-small-btn brand-small-primary ${
                              !curSize ? "disabled" : ""
                            }`}
                            onClick={() => onBuy(p)}
                            disabled={!curSize}
                          >
                            구매 진행
                          </button>
                        </div>

                        {!curSize && (
                          <div className="sizebox-warn">사이즈를 선택해주세요</div>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* 혜택/쿠폰 */}
      <section id="benefits" className="brand-benefits">
        <div className="brand-benefit-card">
          <div className="benefit-left">
            <div className="benefit-eyebrow">신규 회원 혜택</div>
            <h3>첫 구매 10,000원 쿠폰</h3>
            <p>회원가입만 해도 바로 적용 가능한 웰컴 쿠폰을 드립니다.</p>
          </div>
          <div className="benefit-right">
            <Link to="/signup" className="brand-btn brand-btn-primary">
              회원가입
            </Link>
            <Link to="/coupon" className="brand-btn brand-btn-ghost">
              쿠폰함
            </Link>
          </div>
        </div>

        <div className="brand-benefit-sub">
          <div>
            <strong>멤버십등급 추가적립</strong>
            <span>구매 금액대별 최대 5% 포인트 적립</span>
          </div>
          <div>
            <strong>오늘 출발</strong>
            <span>오후 2시 이전 결제 시 당일 출고(일부 품목)</span>
          </div>
          <div>
            <strong>무료 반품</strong>
            <span>사이즈/컬러 교환 1회 무료(자세한 기준은 정책 참고)</span>
          </div>
        </div>
      </section>

      {/* LOOKBOOK */}
      {brand.lookbook && brand.lookbook.length > 0 && (
        <section className="brand-section">
          <div className="brand-section-head">
            <h2>LOOKBOOK</h2>
            <span className="brand-more">{brand.season} STYLING</span>
          </div>

          <div className="brand-lookbook">
            {brand.lookbook.map((url, i) => (
              <div key={i} className="lookbook-item">
                <img src={srcOf(url)} alt={`look-${i}`} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 오프라인 매장 (선택) */}
      <section className="brand-section">
        <div className="brand-section-head">
          <h2>{brand.name} 오프라인</h2>
        </div>
        <div className="brand-store">
          <div className="store-text">
            <h3>{brand.name} 플래그십 스토어</h3>
            <p>새로운 컬렉션을 직접 체험하세요.</p>
            <a
              className="brand-btn brand-btn-ghost"
              href="https://map.naver.com/"
              target="_blank"
              rel="noreferrer"
            >
              길찾기
            </a>
          </div>
          <div className="store-map">
            <img
              src={srcOf(brand.heroImage)}
              alt="store"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
