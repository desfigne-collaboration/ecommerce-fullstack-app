/**
 * ============================================================================
 * imageUtils.js - 이미지 URL 정규화 유틸리티
 * ============================================================================
 *
 * 【목적】
 * - 다양한 형태의 이미지 경로를 통일된 절대 URL로 변환
 * - 외부 URL, 로컬 경로, 상대 경로 모두 지원
 * - 한글 파일명 자동 인코딩
 * - 이미지 누락 시 플레이스홀더 반환
 *
 * 【지원 형태】
 * 1. 외부 URL: "https://example.com/image.jpg" → 그대로 반환
 * 2. 절대 경로: "/images/product.jpg" → PUBLIC_URL 기준 변환
 * 3. 상대 경로: "images/product.jpg" → "/" 추가 후 변환
 * 4. 한글 파일명: "images/상품1.jpg" → 자동 인코딩
 * 5. 누락: "" → placeholder.png 반환
 *
 * 【사용 사례】
 * - ProductCard, ProductDetail에서 상품 이미지 표시
 * - 외부 서버 이미지 + 로컬 public 폴더 이미지 혼용
 *
 * 【참고】
 * - srcOf.js와 동일한 함수 (중복 파일)
 * - 어느 파일을 import해도 동일하게 동작
 *
 * @module imageUtils
 * @author Claude Code
 * @since 2025-11-02
 */

/**
 * srcOf - 이미지 경로를 절대 URL로 변환
 *
 * @description
 * 상품 객체 또는 이미지 경로 문자열을 받아
 * 브라우저가 로드할 수 있는 절대 URL을 반환합니다.
 *
 * @param {string|Object} item - 이미지 경로 또는 상품 객체
 * @param {string} [item.img] - 이미지 경로 (객체인 경우)
 * @param {string} [item.image] - 이미지 경로 (객체인 경우)
 * @returns {string} 절대 URL
 *
 * @example
 * // 외부 URL
 * srcOf("https://cdn.example.com/product.jpg")
 * // → "https://cdn.example.com/product.jpg"
 *
 * @example
 * // 로컬 절대 경로
 * srcOf("/images/product1.jpg")
 * // → "http://localhost:3000/images/product1.jpg"
 *
 * @example
 * // 로컬 상대 경로
 * srcOf("images/product2.jpg")
 * // → "http://localhost:3000/images/product2.jpg"
 *
 * @example
 * // 한글 파일명
 * srcOf("/images/상품1.jpg")
 * // → "http://localhost:3000/images/%EC%83%81%ED%92%881.jpg"
 *
 * @example
 * // 상품 객체
 * srcOf({ img: "/images/tshirt.jpg" })
 * // → "http://localhost:3000/images/tshirt.jpg"
 *
 * @example
 * // 이미지 없음
 * srcOf(null)
 * // → "http://localhost:3000/images/placeholder.png"
 */
export const srcOf = (item) => {
  const raw =
    typeof item === "string" ? item : item?.img || item?.image || "";

  // 누락 시 플레이스홀더
  if (!raw) return `${process.env.PUBLIC_URL}/images/placeholder.png`;

  // 외부 URL이면 그대로
  if (/^https?:\/\//i.test(raw)) return raw;

  // /images/... 형식이든 상대경로든 PUBLIC_URL 기준 절대경로 + 한글 인코딩
  const cleaned = raw.startsWith("/") ? raw : `/${raw}`;
  return `${process.env.PUBLIC_URL}${encodeURI(cleaned)}`;
};
