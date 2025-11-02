/**
 * ============================================================================
 * productData.js - 상품 데이터 저장소 (Mock Data)
 * ============================================================================
 *
 * 【목적】
 * - 백엔드 API 없이 프론트엔드 개발/테스트를 위한 Mock 상품 데이터 제공
 * - 카테고리별, 서브카테고리별로 구조화된 상품 정보
 * - 상품 목록 페이지, 상세 페이지, 검색 기능 등에서 사용
 *
 * 【데이터 구조】
 * PRODUCT_DATA = {
 *   카테고리: {
 *     서브카테고리: [
 *       { id, name, desc, price, image },
 *       ...
 *     ]
 *   }
 * }
 *
 * 【카테고리 구조】
 * 1. women (여성) : main, new, outer, jacket, knit, shirt, tshirt, onepiece, pants, skirt
 * 2. men (남성) : main, new, suit, pants, jacket, shirt, knit, tshirt
 * 3. kids (키즈) : main, new, boy, girl, baby
 * 4. sports (스포츠) : main, new, outdoor, running, yoga, fitness, tennis, swim
 * 5. beauty (뷰티) : main, new, skincare, makeup, fragrance, haircare
 * 6. golf (골프) : main, new, women, men, clubs, bags, acc
 * 7. luxury (럭셔리) : main, new, women, men, bags, jewelry
 * 8. shoes (백&슈즈) : main, new, womenBag, menBag, womenShoes, menShoes
 * 9. life (라이프) : main, new, furniture, deco, pet, food
 * 10. outlet (아울렛) : main, all, women, men, kids
 *
 * 【상품 객체 필드】
 * - id: 고유 ID (예: "women_new_1", "men_suit_3")
 * - name: 상품명
 * - desc: 상품 설명
 * - price: 가격 (문자열, 예: "89000")
 * - image: 이미지 URL (Synology NAS 서버 경로)
 *
 * 【이미지 서버】
 * - 기본 경로: https://desfigne.synology.me/data/image/thejoeun/products/
 * - 파일명 규칙: {category}_{subcategory}{number}.webp
 * - 예: women_new1.webp, beauty_main2.webp
 *
 * 【사용 예시】
 * import { PRODUCT_DATA } from 'features/product/data/productData';
 *
 * // 여성 신상품 목록 가져오기
 * const womenNewProducts = PRODUCT_DATA.women.new;
 *
 * // 특정 상품 찾기
 * const product = womenNewProducts.find(p => p.id === "women_new_1");
 *
 * @module productData
 * @author Claude Code
 * @since 2025-11-02
 */

// ============================================================================
// 카테고리별 상품 데이터
// ============================================================================
export const PRODUCT_DATA = {
  women: {
    main: [], // 메인은 샘플 이미지 사용
    new: [
      { id: "women_new_1", name: "심플 블랙 티셔츠", desc: "데일리로 활용하기 좋은 베이직 아이템", price: "89000", image: "https://desfigne.synology.me/data/image/thejoeun/products/women_new1.webp" },
      { id: "women_new_2", name: "슬림 슬랙스", desc: "세련된 핏으로 오피스룩에도 잘 어울림", price: "99000", image: "https://desfigne.synology.me/data/image/thejoeun/products/women_new2.webp" },
      { id: "women_new_3", name: "니트 가디건", desc: "여성스러운 무드로 다양한 계절에 활용 가능", price: "59000", image: "https://desfigne.synology.me/data/image/thejoeun/products/women_new3.webp" },
      { id: "women_new_4", name: "그레이 톤 팬츠", desc: "캐주얼과 포멀룩 모두 소화", price: "79000", image: "https://desfigne.synology.me/data/image/thejoeun/products/women_new4.webp" },
      { id: "women_new_5", name: "화이트 베이직 티셔츠", desc: "깔끔한 스타일의 필수 아이템", price: "99000", image: "https://desfigne.synology.me/data/image/thejoeun/products/women_new5.webp" },
      { id: "women_new_6", name: "롱 원피스", desc: "심플하면서 우아한 라인", price: "109000", image: "https://desfigne.synology.me/data/image/thejoeun/products/women_new6.webp" },
    ],
    outer: [
      { id: "women_outer_1", name: "베이지 캐주얼 자켓", desc: "데일리로 활용하기 좋은 기본 아우터", price: "129000", image: "https://desfigne.synology.me/data/image/thejoeun/products/women_outer1.webp" },
      { id: "women_outer_2", name: "패턴 자켓", desc: "유니크한 감각으로 스트릿 패션에 적합", price: "159000", image: "https://desfigne.synology.me/data/image/thejoeun/products/women_outer2.webp" },
      { id: "women_outer_3", name: "블랙 라이더 자켓", desc: "시크한 무드의 포인트 아이템", price: "189000", image: "https://desfigne.synology.me/data/image/thejoeun/products/women_outer3.webp" },
      { id: "women_outer_4", name: "경량 패딩 자켓", desc: "가볍지만 따뜻한 간절기 필수템", price: "99000", image: "https://desfigne.synology.me/data/image/thejoeun/products/women_outer4.webp" },
      { id: "women_outer_5", name: "카키 오버핏 자켓", desc: "편안한 핏으로 스타일리시하게 연출 가능", price: "149000", image: "https://desfigne.synology.me/data/image/thejoeun/products/women_outer5.webp" },
      { id: "women_outer_6", name: "블랙 포켓 자켓", desc: "실용성과 멋을 동시에 갖춘 아이템", price: "139000", image: "https://desfigne.synology.me/data/image/thejoeun/products/women_outer6.webp" },
    ],
    jacket: [],
    knit: [],
    shirt: [],
    tshirt: [],
    onepiece: [],
    pants: [],
    skirt: [],
  },
  men: {
    main: [], // 샘플 이미지
    new: [],
    suit: [],
    pants: [],
    jacket: [],
    shirt: [],
    knit: [],
    tshirt: [],
  },
  kids: {
    main: [], // 샘플 이미지
    new: [],
    boy: [],
    girl: [],
    baby: [],
  },
  sports: {
    main: [], // 샘플 이미지
    new: [],
    outdoor: [],
    running: [],
    yoga: [],
    fitness: [],
    tennis: [],
    swim: [],
  },
  beauty: {
    main: [
      { id: "beauty_main_1", name: "", desc: "", price: "", image: "https://desfigne.synology.me/data/image/thejoeun/products/beauty_new1.webp" },
      { id: "beauty_main_2", name: "", desc: "", price: "", image: "https://desfigne.synology.me/data/image/thejoeun/products/beauty_new2.webp" },
      { id: "beauty_main_3", name: "", desc: "", price: "", image: "https://desfigne.synology.me/data/image/thejoeun/products/beauty_new3.webp" },
      { id: "beauty_main_4", name: "", desc: "", price: "", image: "https://desfigne.synology.me/data/image/thejoeun/products/beauty_new4.webp" },
      { id: "beauty_main_5", name: "", desc: "", price: "", image: "https://desfigne.synology.me/data/image/thejoeun/products/beauty_new5.webp" },
      { id: "beauty_main_6", name: "", desc: "", price: "", image: "https://desfigne.synology.me/data/image/thejoeun/products/beauty_new6.webp" },
    ],
    new: [],
    skin: [],
    makeup: [],
    perfume: [],
  },
};

// 카테고리와 서브카테고리에 맞는 상품 데이터 가져오기
export const getProductsByCategory = (category, subcategory = "main") => {
  if (!PRODUCT_DATA[category]) {
    return [];
  }
  return PRODUCT_DATA[category][subcategory] || [];
};
