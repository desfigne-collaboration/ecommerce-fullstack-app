/**
 * ============================================================================
 * HomePage.jsx - 홈 페이지 메인
 * ============================================================================
 *
 * 【목적】
 * - e커머스 사이트 메인 랜딩 페이지
 * - 프로모션 슬라이드, 브랜드 그리드, 상품 목록, 랭킹, 이벤트 섹션 통합
 *
 * 【주요 기능】
 * 1. **3장 슬라이드 캐러셀**: 9개 슬라이드를 3장씩 묶어 표시, 5초 자동 회전
 * 2. **인기 브랜드 그리드**: 35개 브랜드를 12개씩 3페이지로 분할 표시
 * 3. **이벤트 배너**: 첫 구매 할인, 쿠폰 등 프로모션 카드
 * 4. **상품 그리드**: 위시리스트 토글 기능 포함 (Set 기반 성능 최적화)
 * 5. **랭킹 섹션**: 카테고리별 인기 상품 4개 표시
 * 6. **주목할 브랜드**: 기획전 소개 카드
 * 7. **브랜드 이슈**: 이 주의 브랜드 스토리 4개
 *
 * 【데이터 구조】
 * ```javascript
 * // 슬라이드 데이터
 * slides = [
 *   { title: "8SECONDS", subtitle: "...", desc: "...", image: "https://..." },
 *   ...
 * ]
 *
 * // 브랜드 데이터
 * brandData = [
 *   { logo: "https://...", name: "에잇세컨즈", link: "/brand/8seconds", isImage: true },
 *   ...
 * ]
 *
 * // 상품 데이터
 * homeProducts = [
 *   { id: "P-ANGGAE-1", brand: "anggae", name: "...", image: "...", price: 159000 },
 *   ...
 * ]
 * ```
 *
 * 【상태 관리】
 * - page: 슬라이드 현재 페이지 (0~2)
 * - activeProductTab: 상품 카테고리 탭 (0~5)
 * - activeRankingTab: 랭킹 카테고리 탭 (0~8)
 * - brandPage: 브랜드 페이지 (0~2)
 * - wishIds: 위시리스트 상품 ID Set (성능 최적화)
 *
 * 【위시리스트 처리】
 * - Set을 사용하여 O(1) 검색 성능
 * - toggleWishlist() 시 localStorage 업데이트 및 StorageEvent 발행
 * - Header 위시리스트 카운트 자동 업데이트
 *
 * @component
 * @author Claude Code
 * @since 2025-11-02
 */

import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import storage from "../../../utils/storage.js";
import "./Home.css";

// 브랜드 로고 이미지 (외부 URL)
const brand8Seconds = "https://desfigne.synology.me/data/image/thejoeun/brands/brand_eight-seconds.webp";
const brandBeanpole = "https://desfigne.synology.me/data/image/thejoeun/brands/brand_beanpole.webp";
const brandBeaker = "https://desfigne.synology.me/data/image/thejoeun/brands/brand_beaker.webp";
const brandKuho = "https://desfigne.synology.me/data/image/thejoeun/brands/brand_kuho.webp";
const brandIsseyMiyake = "https://desfigne.synology.me/data/image/thejoeun/brands/brand_issey-miyake.webp";
const brandMaisonKitsune = "https://desfigne.synology.me/data/image/thejoeun/brands/brand_maison-kitsune.webp";
const brandTheory = "https://desfigne.synology.me/data/image/thejoeun/brands/brand_theory.webp";
const brandKuhoPlus = "https://desfigne.synology.me/data/image/thejoeun/brands/brand_kuho-plus.webp";
const brandCommeDesGarcons = "https://desfigne.synology.me/data/image/thejoeun/brands/brand_comme-des-garcons.webp";
const brandPatagonia = "https://desfigne.synology.me/data/image/thejoeun/brands/brand_patagonia.webp";
const brandSportyRich = "https://desfigne.synology.me/data/image/thejoeun/brands/brand_sporty-and-rich.webp";
const brandSie = "https://desfigne.synology.me/data/image/thejoeun/brands/brand_cie.webp";
const brandInuGolf = "https://desfigne.synology.me/data/image/thejoeun/brands/brand_inew-golf.webp";
const brandGeneralIdea = "https://desfigne.synology.me/data/image/thejoeun/brands/brand_general-idea.webp";
const brandLeMouton = "https://desfigne.synology.me/data/image/thejoeun/brands/brand_le-mouton.webp";
const brandAmi = "https://desfigne.synology.me/data/image/thejoeun/brands/brand_ami.webp";
const brandJuunJ = "https://desfigne.synology.me/data/image/thejoeun/brands/brand_juunj.webp";
const brandRokadis = "https://desfigne.synology.me/data/image/thejoeun/brands/brand_rogatis.webp";
const brandDanton = "https://desfigne.synology.me/data/image/thejoeun/brands/brand_danton.webp";
const brand10CorsoComo = "https://desfigne.synology.me/data/image/thejoeun/brands/brand_ten-corso-como.webp";
const brandDiapter = "https://desfigne.synology.me/data/image/thejoeun/brands/brand_departure.webp";
const brandCos = "https://desfigne.synology.me/data/image/thejoeun/brands/brand_cos.webp";
const brandSaintJames = "https://desfigne.synology.me/data/image/thejoeun/brands/brand_saint-james.webp";
const brandTommyHilfiger = "https://desfigne.synology.me/data/image/thejoeun/brands/brand_tommy-hilfiger.webp";
const brandCanadaGoose = "https://desfigne.synology.me/data/image/thejoeun/brands/brand_canada-goose.webp";
const brandHera = "https://desfigne.synology.me/data/image/thejoeun/brands/brand_hera.webp";
const brandGalaxyLifestyle = "https://desfigne.synology.me/data/image/thejoeun/brands/brand_galaxy-lifestyle.webp";
const brandRebaige = "https://desfigne.synology.me/data/image/thejoeun/brands/brand_rebaige.webp";
const brandToryBurch = "https://desfigne.synology.me/data/image/thejoeun/brands/brand_tory-burch.webp";
const brandGalaxy = "https://desfigne.synology.me/data/image/thejoeun/brands/brand_galaxy.webp";
const brandLemaire = "https://desfigne.synology.me/data/image/thejoeun/brands/brand_lemaire.webp";
const brandFitflop = "https://desfigne.synology.me/data/image/thejoeun/brands/brand_fitflop.webp";
const brandGanni = "https://desfigne.synology.me/data/image/thejoeun/brands/brand_ganni.webp";
const brandRagBone = "https://desfigne.synology.me/data/image/thejoeun/brands/brand_rag-and-bone.webp";
const brandSandsound = "https://desfigne.synology.me/data/image/thejoeun/brands/brand_sand-sound.webp";

/**
 * Home 함수형 컴포넌트
 *
 * @description
 * e커머스 사이트 메인 홈 페이지. 7개 주요 섹션으로 구성됩니다.
 *
 * 【처리 흐름】
 * 1. **초기 로드**: localStorage에서 wishlist 읽기 → Set 변환
 * 2. **자동 회전**: 5초마다 슬라이드 페이지 증가 (useEffect)
 * 3. **위시리스트 토글**:
 *    - isWishlisted(id) → Set.has() O(1) 검색
 *    - toggleWishlist(product) → localStorage 업데이트 + StorageEvent 발행
 * 4. **브랜드 페이지네이션**: 12개씩 3페이지로 분할 표시
 *
 * 【섹션 구조】
 * 1. tri-hero: 3장씩 보이는 슬라이드 캐러셀
 * 2. popular-brands: 인기 브랜드 12개 (페이지네이션)
 * 3. event-banner: 이벤트 카드 3개
 * 4. product-section: 상품 그리드 (위시리스트 토글)
 * 5. ranking-section: 랭킹 상품 4개
 * 6. featured-brands: 주목할 브랜드 기획전
 * 7. brand-story: 이 주의 브랜드 이슈 4개
 *
 * @returns {JSX.Element} 홈 페이지 전체 UI
 */
export default function Home() {
  const [page, setPage] = useState(0);
  const [activeProductTab, setActiveProductTab] = useState(0);
  const [activeRankingTab, setActiveRankingTab] = useState(0);
  const [brandPage, setBrandPage] = useState(0);

  // ---- 위시리스트 상태 (id 셋만 캐시해서 빠르게 렌더) ----
  const [wishIds, setWishIds] = useState(() => {
    try {
      const w = storage.get("wishlist", []);
      return new Set(w.map((it) => it.id));
    } catch {
      return new Set();
    }
  });

  const totalPages = 3; // 9장 / 3장씩

  /**
   * slides - 슬라이드 데이터 (9개)
   *
   * @description
   * 9개 프로모션 슬라이드를 3페이지로 구성. 각 페이지는 3장씩 표시됩니다.
   *
   * 【슬라이드 구조】
   * - title: 브랜드명
   * - subtitle: 프로모션 제목
   * - desc: 프로모션 설명
   * - image: 이미지 URL
   */
  const slides = useMemo(
    () => [
      { title: "8SECONDS", subtitle: "리즈와 함께면 지금이 리즈", desc: "BEYOND THE REBELS · 2nd Drop", image: "https://desfigne.synology.me/data/image/thejoeun/icons/main1.webp" },
      { title: "KUHO PLUS", subtitle: "25 Winter Collection", desc: "혜택이 넘치는 세싸패 LIVE", image: "https://desfigne.synology.me/data/image/thejoeun/icons/main2.webp" },
      { title: "J RIUM", subtitle: "나를 안는 부드러움", desc: "~38% + 7% + 5만포인트 + 사은품", image: "https://desfigne.synology.me/data/image/thejoeun/icons/main3.webp" },

      { title: "COS", subtitle: "다가온 가을의 순간", desc: "변화하는 계절의 감각적인 스타일링", image: "https://desfigne.synology.me/data/image/thejoeun/icons/main4.webp" },
      { title: "UGG & REQINS", subtitle: "어쩔 수 없이 걷고 싶은 계절", desc: "어그, 호갱 등 인기 슈즈 특가", image: "https://desfigne.synology.me/data/image/thejoeun/icons/main5.webp" },
      { title: "ROUGE & LOUNGE", subtitle: "인플루언서가 탐낸 실루엣", desc: "F/W 레더 백 단독 할인", image: "https://desfigne.synology.me/data/image/thejoeun/icons/main6.webp" },

      { title: "LEMAIRE", subtitle: "코지 니트 컬렉션", desc: "FW 신상품 얼리버드 20%", image: "https://desfigne.synology.me/data/image/thejoeun/icons/main7.webp" },
      { title: "BEANPOLE", subtitle: "따뜻한 데일리 아우터", desc: "시즌오프 최대 60% + 쿠폰", image: "https://desfigne.synology.me/data/image/thejoeun/icons/main8.webp" },
      { title: "Theory", subtitle: "소프트 캐시미어", desc: "한정 수량 특별가", image: "https://desfigne.synology.me/data/image/thejoeun/icons/main9.webp" },
    ],
    []
  );

  /**
   * 슬라이드 자동 회전 (5초마다)
   */
  useEffect(() => {
    const t = setInterval(() => setPage((p) => (p + 1) % totalPages), 5000);
    return () => clearInterval(t);
  }, []);

  /**
   * prev - 이전 슬라이드로 이동
   */
  const prev = () => setPage((p) => (p - 1 + totalPages) % totalPages);

  /**
   * next - 다음 슬라이드로 이동
   */
  const next = () => setPage((p) => (p + 1) % totalPages);

  const productCategories = ["니트 카디건", "백 & 슈즈", "쥬얼리 & 액세서리", "뷰티 & 향수", "코스메틱", "키즈 & 베이비"];
  const rankingCategories = ["여성", "남성", "키즈", "럭셔리", "백&슈즈", "스포츠", "골프", "뷰티", "라이프"];

  /**
   * homeProducts - 홈 상품 데이터 (5개)
   *
   * @description
   * 홈 페이지 상품 그리드에 표시할 상품 목록.
   * 위시리스트 토글 기능을 위해 id, brand, name, image, price 포함.
   */
  const homeProducts = useMemo(
    () => [
      {
        id: "P-ANGGAE-1",
        brand: "anggae",
        name: "Smocked Knit Cardigan - Grey",
        image: "https://desfigne.synology.me/data/image/thejoeun/products/3207359177.webp",
        price: 159000,
      },
      {
        id: "P-8SEC-1",
        brand: "8 seconds",
        name: "울100 카디건 - 카키",
        image: "https://desfigne.synology.me/data/image/thejoeun/products/1010207927.webp",
        price: 59900,
        originalPrice: 69900,
        discountLabel: "10%",
      },
      {
        id: "P-MAIA-1",
        brand: "Maia",
        name: "Two-Way Cardigan - French Roast",
        image: "https://desfigne.synology.me/data/image/thejoeun/products/3793950654.webp",
        priceLabel: "품절",
      },
      {
        id: "P-320S-1",
        brand: "320Showroom",
        name: "V-Neck Button-Up Wool Alpaca Knit Cardigan",
        image: "https://desfigne.synology.me/data/image/thejoeun/products/3826030000.webp",
        price: 64800,
        originalPrice: 79000,
        discountLabel: "10%",
      },
      {
        id: "P-HANE-1",
        brand: "HANE",
        name: "플라테카드 자켓 울 니트 가디건_Charcoal",
        image: "https://desfigne.synology.me/data/image/thejoeun/products/635366670.webp",
        price: 118800,
        originalPrice: 156000,
        discountLabel: "26%",
      },
    ],
    []
  );

  /**
   * isWishlisted - 위시리스트 포함 여부 확인
   *
   * @param {string} id - 상품 ID
   * @returns {boolean} 위시리스트에 포함되어 있으면 true
   */
  const isWishlisted = (id) => wishIds.has(id);

  /**
   * toggleWishlist - 위시리스트 토글
   *
   * @description
   * 상품을 위시리스트에 추가하거나 제거합니다.
   * localStorage 업데이트 후 StorageEvent를 발행하여 Header 카운트를 업데이트합니다.
   *
   * 【처리 흐름】
   * 1. localStorage에서 wishlist 읽기
   * 2. 존재 여부 확인 (some)
   * 3. 존재하면 제거, 없으면 추가
   * 4. localStorage 저장
   * 5. wishIds Set 업데이트
   * 6. StorageEvent 발행
   *
   * @param {Object} product - 상품 객체 { id, name, brand, image, price, ... }
   */
  const toggleWishlist = (product) => {
    try {
      let list = storage.get("wishlist", []);
      const exists = list.some((it) => it.id === product.id);

      if (exists) {
        list = list.filter((it) => it.id !== product.id);
      } else {
        const payload = {
          id: product.id,
          name: product.name,
          brand: product.brand,
          image: product.image,
          price: product.price ?? null,
          originalPrice: product.originalPrice ?? null,
          priceLabel: product.priceLabel ?? null,
          discountLabel: product.discountLabel ?? null,
        };
        list.push(payload);
      }

      storage.set("wishlist", list);
      // 로컬 상태도 즉시 반영
      setWishIds(new Set(list.map((it) => it.id)));
      // 헤더 카운트 갱신용 StorageEvent 발송
      try { window.dispatchEvent(new StorageEvent("storage", { key: "wishlist", newValue: JSON.stringify(list) })); } catch {}
    } catch (e) {
      console.error("Failed to update wishlist", e);
    }
  };

  /**
   * brandData - 브랜드 목록 (35개)
   *
   * @description
   * 인기 브랜드 섹션에 표시할 브랜드 목록.
   * 12개씩 3페이지로 분할하여 페이지네이션 처리합니다.
   */
  const brandData = [
    // Page 1 (1-12)
    { logo: brand8Seconds, name: "에잇세컨즈", link: "/brand/8seconds", isImage: true },
    { logo: brandBeanpole, name: "빈폴", link: "/brand/beanpole", isImage: true },
    { logo: brandBeaker, name: "비이커", link: "/brand/beaker", isImage: true },
    { logo: brandKuho, name: "구호", link: "/brand/kuho", isImage: true },
    { logo: brandIsseyMiyake, name: "이세이미야케", link: "/brand/issey-miyake", isImage: true },
    { logo: brandMaisonKitsune, name: "메종키츠네", link: "/brand/maison-kitsune", isImage: true },
    { logo: brandTheory, name: "띠어리", link: "/brand/theory", isImage: true },
    { logo: brandKuhoPlus, name: "구호플러스", link: "/brand/kuho-plus", isImage: true },
    { logo: brandCommeDesGarcons, name: "꼼데가르송", link: "/brand/comme-des-garcons", isImage: true },
    { logo: brandPatagonia, name: "파타고니아", link: "/brand/patagonia", isImage: true },
    { logo: brandSportyRich, name: "스포티앤리치", link: "/brand/sporty-rich", isImage: true },
    { logo: brandSie, name: "시에", link: "/brand/sie", isImage: true },

    // Page 2 (13-24)
    { logo: brandInuGolf, name: "이뉴골프", link: "/brand/inu-golf", isImage: true },
    { logo: brandGeneralIdea, name: "제너럴 아이디어", link: "/brand/general-idea", isImage: true },
    { logo: brandLeMouton, name: "르무통", link: "/brand/le-mouton", isImage: true },
    { logo: brandAmi, name: "아미", link: "/brand/ami", isImage: true },
    { logo: brandJuunJ, name: "준지", link: "/brand/juun-j", isImage: true },
    { logo: brandRokadis, name: "로가디스", link: "/brand/rokadis", isImage: true },
    { logo: brandDanton, name: "단톤", link: "/brand/danton", isImage: true },
    { logo: brand10CorsoComo, name: "텐꼬르소꼬모", link: "/brand/10-corso-como", isImage: true },
    { logo: brandDiapter, name: "디애퍼처", link: "/brand/diapter", isImage: true },
    { logo: brandCos, name: "코스", link: "/brand/cos", isImage: true },
    { logo: brandSaintJames, name: "세인트제임스", link: "/brand/saint-james", isImage: true },
    { logo: brandTommyHilfiger, name: "타미힐피거", link: "/brand/tommy-hilfiger", isImage: true },

    // Page 3 (25-35)
    { logo: brandCanadaGoose, name: "캐나다구스", link: "/brand/canada-goose", isImage: true },
    { logo: brandHera, name: "헤라", link: "/brand/hera", isImage: true },
    { logo: brandGalaxyLifestyle, name: "갤럭시라이프스타일", link: "/brand/galaxy-lifestyle", isImage: true },
    { logo: brandRebaige, name: "르베이지", link: "/brand/rebaige", isImage: true },
    { logo: brandToryBurch, name: "토리버치", link: "/brand/tory-burch", isImage: true },
    { logo: brandGalaxy, name: "갤럭시", link: "/brand/galaxy", isImage: true },
    { logo: brandLemaire, name: "르메르", link: "/brand/lemaire", isImage: true },
    { logo: brandFitflop, name: "핏플랍", link: "/brand/fitflop", isImage: true },
    { logo: brandGanni, name: "가니", link: "/brand/ganni", isImage: true },
    { logo: brandRagBone, name: "랙앤본", link: "/brand/rag-bone", isImage: true },
    { logo: brandSandsound, name: "샌드사운드", link: "/brand/sandsound", isImage: true }
  ];

  const brandsPerPage = 12;
  const totalBrandPages = Math.ceil(brandData.length / brandsPerPage);
  const currentBrands = brandData.slice(brandPage * brandsPerPage, (brandPage + 1) * brandsPerPage);

  /**
   * handleBrandPrev - 브랜드 페이지 이전으로
   */
  const handleBrandPrev = () => {
    setBrandPage((prev) => (prev - 1 + totalBrandPages) % totalBrandPages);
  };

  /**
   * handleBrandNext - 브랜드 페이지 다음으로
   */
  const handleBrandNext = () => {
    setBrandPage((prev) => (prev + 1) % totalBrandPages);
  };

  /**
   * formatPrice - 가격 포맷팅
   *
   * @param {number|string} n - 가격
   * @returns {string} 천 단위 구분자 적용
   */
  const formatPrice = (n) => (typeof n === "number" ? n.toLocaleString() : n);

  return (
    <>
      <main className="main-content">
        {/* === 3장씩 보이는 슬라이드 === */}
        <section className="tri-hero">
          <div className="tri-hero__container">
            <div className="tri-hero__wrap" style={{ transform: `translateX(-${page * 100}%)` }}>
              {slides.map((s, i) => (
                <Link key={i} to="/menu" className="tri-card">
                  <img src={s.image} alt={s.title} className="tri-card__img" />
                  <div className="tri-card__overlay">
                    <div className="tri-card__brand">{s.title}</div>
                    <h2 className="tri-card__title">{s.subtitle}</h2>
                    <p className="tri-card__desc">{s.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
            <button className="tri-hero__nav tri-hero__prev" onClick={prev} aria-label="이전">
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <button className="tri-hero__nav tri-hero__next" onClick={next} aria-label="다음">
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path d="M9 18l6-6-6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <div className="tri-hero__dots">
              {[0, 1, 2].map((n) => (
                <span key={n} className={`tri-dot ${page === n ? "active" : ""}`} onClick={() => setPage(n)} />
              ))}
            </div>
          </div>
        </section>

        {/* === 인기 브랜드 === */}
        <section className="popular-brands">
          <div className="container">
            <h2 className="section-title">인기 브랜드</h2>

            <div className="brands-slider-wrapper">
              <div className="brands-grid">
                {currentBrands.map((brand, index) => (
                  <Link key={index} to={brand.link} className="brand-card">
                    <div className="brand-logo-box">
                      {brand.isImage ? (
                        <img src={brand.logo} alt={brand.name} className="brand-logo-img" />
                      ) : (
                        <span className="brand-logo-text">{brand.logo}</span>
                      )}
                    </div>
                    <span className="brand-name">{brand.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="brands-pagination">
              <button
                className="pagination-arrow"
                onClick={handleBrandPrev}
                aria-label="이전 페이지"
              >
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
              <span className="pagination-text">{brandPage + 1} / {totalBrandPages}</span>
              <button
                className="pagination-arrow"
                onClick={handleBrandNext}
                aria-label="다음 페이지"
              >
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path d="M9 18l6-6-6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* === 이벤트 배너 === */}
        <section className="event-banner">
          <div className="container">
            <h2 className="section-title">이벤트</h2>
            <div className="event-grid">
              <div className="event-card">
                <img src="https://desfigne.synology.me/data/image/thejoeun/products/216419883.webp" alt="첫 구매 한정 -50% 특가" />
                <div className="event-content">
                  <h3>첫 구매 한정 -50% 특가</h3>
                  <p>10주년 기념 최대 혜택 받아가세요</p>
                </div>
              </div>
              <div className="event-card">
                <img src="https://desfigne.synology.me/data/image/thejoeun/products/521681749.webp" alt="10주년 한정 첫 구매 지원금" />
                <div className="event-content">
                  <h3>10주년 한정 첫 구매 지원금</h3>
                  <p>매월 100명에게 선물로 1만 포인트 드립니다</p>
                </div>
              </div>
              <div className="event-card">
                <img src="https://desfigne.synology.me/data/image/thejoeun/products/1642450336.webp" alt="앱에서 첫 로그인하고 쿠폰 받기" />
                <div className="event-content">
                  <h3>앱에서 첫 로그인하고 쿠폰 받기</h3>
                  <p>1만원 쿠폰 즉시 지급</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Grid Section */}
        <section className="product-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">고마움과 안부, 마음껏 전할 시간</h2>

              {/* ---- 위시리스트 페이지로 가는 링크 ---- */}
              <div className="category-tabs">
                {productCategories.map((category, index) => (
                  <button
                    key={index}
                    className={`tab-btn ${index === activeProductTab ? 'active' : ''}`}
                    onClick={() => setActiveProductTab(index)}
                  >
                    {category}
                  </button>
                ))}
                <Link to="/wishlist" className="tab-btn" style={{ textDecoration: "none" }}>
                  위시리스트 보러가기 →
                </Link>
              </div>
            </div>

            <div className="product-grid">
              {homeProducts.map((p) => {
                const wished = isWishlisted(p.id);
                return (
                  <div className="product-card" key={p.id}>
                    <div className="product-image">
                      <img src={p.image} alt={p.name} />
                      {/* ---- 하트 버튼 (토글) ---- */}
                      <button
                        className={`wishlist-btn ${wished ? "active" : ""}`}
                        aria-pressed={wished}
                        aria-label={wished ? "위시에서 제거" : "위시에 추가"}
                        onClick={() => toggleWishlist(p)}
                        title={wished ? "위시에 담김" : "위시에 담기"}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                            stroke="currentColor"
                            strokeWidth="2"
                            // 활성화 시 하트 채우기
                            fill={wished ? "currentColor" : "none"}
                          />
                        </svg>
                      </button>
                      {p.discountLabel && <span className="discount-badge">{p.discountLabel}</span>}
                    </div>
                    <div className="product-info">
                      <span className="brand">{p.brand}</span>
                      <h3 className="product-name">{p.name}</h3>
                      <div className="price">
                        {p.originalPrice && <span className="original-price">{formatPrice(p.originalPrice)}</span>}
                        <span className="current-price">
                          {p.priceLabel ? p.priceLabel : formatPrice(p.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Ranking Section */}
        <section className="ranking-section">
          <div className="container">
            <h2 className="section-title">랭킹</h2>
            <div className="ranking-tabs">
              {rankingCategories.map((category, index) => (
                <button
                  key={index}
                  className={`tab-btn ${index === activeRankingTab ? 'active' : ''}`}
                  onClick={() => setActiveRankingTab(index)}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="ranking-grid">
              <div className="ranking-item">
                <span className="rank">1</span>
                <img src="https://desfigne.synology.me/data/image/thejoeun/products/3206396286.webp" alt="SAMSONITE" />
                <div className="item-info">
                  <h4>SAMSONITE</h4>
                  <p>[캠소나이트] OCLITE 캐리어 55/68(2024년형) 2종세트 4종택1</p>
                  <div className="price">
                    <span className="discount">59%</span>
                    <strong>197,100</strong>
                  </div>
                </div>
              </div>

              <div className="ranking-item">
                <span className="rank">2</span>
                <img src="https://desfigne.synology.me/data/image/thejoeun/products/357450008.webp" alt="FITFLOP" />
                <div className="item-info">
                  <h4>FITFLOP</h4>
                  <p>[핏플랍] 여성 벨트 메리제인 탈레미나 블랙루소스 - 톰 플랙</p>
                  <div className="price">
                    <span className="discount">5%</span>
                    <strong>246,050</strong>
                  </div>
                </div>
              </div>

              <div className="ranking-item">
                <span className="rank">3</span>
                <img src="https://desfigne.synology.me/data/image/thejoeun/products/1491953271.webp" alt="KUHO" />
                <div className="item-info">
                  <h4>KUHO</h4>
                  <p>[BINA] Nylon Buckle Point Shoulder Bag - Black</p>
                  <div className="price">
                    <span className="discount">20%</span>
                    <strong>238,400</strong>
                  </div>
                </div>
              </div>

              <div className="ranking-item">
                <span className="rank">4</span>
                <img src="https://desfigne.synology.me/data/image/thejoeun/products/573690851.webp" alt="LEMAIRE" />
                <div className="item-info">
                  <h4>LEMAIRE</h4>
                  <p>[UNISEX] Croissant Coin Purse - Dark Chocolate</p>
                  <div className="price">
                    <strong>1,980,000</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Brands Section */}
        <section className="featured-brands">
          <div className="container">
            <h2 className="section-title">주목할 브랜드</h2>
            <div className="featured-grid">
              <div className="featured-card">
                <img src="https://desfigne.synology.me/data/image/thejoeun/products/1119019333.webp" alt="anggae" />
                <div className="featured-content">
                  <h3>anggae</h3>
                  <p>25F/W 3rd Drop</p>
                  <p className="subtitle">일상에 스며들 가을의 설레임</p>
                  <Link to="/brand/anggae" className="featured-link">기획전 바로가기 →</Link>
                </div>
              </div>

              <div className="featured-card">
                <img src="https://desfigne.synology.me/data/image/thejoeun/products/578281922.webp" alt="anggae" />
                <div className="featured-products">
                  <div className="mini-product">
                    <img src="https://desfigne.synology.me/data/image/thejoeun/products/1202455836.webp" alt="anggae Ribbed Snake Cardigan" />
                    <span className="brand">anggae</span>
                    <span className="name">Ribbed Snake Cardigan - Black</span>
                    <strong>189,000</strong>
                  </div>
                  <div className="mini-product">
                    <img src="https://desfigne.synology.me/data/image/thejoeun/products/3859394708.webp" alt="anggae Off Shoulder Pullover" />
                    <span className="brand">anggae</span>
                    <span className="name">Off Shoulder Pullover - Black</span>
                    <strong>159,000</strong>
                  </div>
                </div>
              </div>

              <div className="featured-card">
                <img src="https://desfigne.synology.me/data/image/thejoeun/products/3086143679.webp" alt="VOLVIK" />
                <div className="featured-content">
                  <h3>VOLVIK</h3>
                  <p>혜택이 불어오는</p>
                  <p className="subtitle">필드를 즐길 시간</p>
                  <Link to="/brand/volvik" className="featured-link">기획전 바로가기 →</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Brand Story Section */}
        <section className="brand-story">
          <div className="container">
            <h2 className="section-title">이 주의 브랜드 이슈</h2>
            <div className="story-grid">
              <div className="story-card">
                <img src="https://desfigne.synology.me/data/image/thejoeun/products/133835897.webp" alt="타이 스타일링의 정석" />
                <h3>타이 스타일링의 정석</h3>
                <p>SUITSUPPLY</p>
              </div>
              <div className="story-card">
                <img src="https://desfigne.synology.me/data/image/thejoeun/products/3635466172.webp" alt="빛나는 도화적 무드" />
                <h3>빛나는 도화적 무드</h3>
                <p>길이를 담은 25F/W</p>
                <p>COMOLI</p>
              </div>
              <div className="story-card">
                <img src="https://desfigne.synology.me/data/image/thejoeun/products/1176900044.webp" alt="가을을 담침 시간" />
                <h3>가을을 담침 시간</h3>
                <p>지금 추천해이볍 2S FALL 신상품</p>
                <p>ANOTHER#</p>
              </div>
              <div className="story-card">
                <img src="https://desfigne.synology.me/data/image/thejoeun/products/3362617750.webp" alt="아식스 x 세실리에 반센" />
                <h3>아식스 x 세실리에 반센</h3>
                <p>볼 캐치타 톡톡</p>
                <p>ASICS KIDS</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
