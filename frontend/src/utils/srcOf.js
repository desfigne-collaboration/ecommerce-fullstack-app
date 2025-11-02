/**
 * ============================================================================
 * srcOf.js - 이미지 URL 정규화 유틸리티 (간소화 버전)
 * ============================================================================
 *
 * 【목적】
 * - 이미지 경로를 절대 URL로 변환
 * - 외부 URL, 로컬 경로 지원
 * - 이미지 누락 시 플레이스홀더 반환
 *
 * 【지원 형태】
 * 1. 외부 URL: "https://example.com/image.jpg" → 그대로 반환
 * 2. 절대 경로: "/images/product.jpg" → PUBLIC_URL 기준 변환
 * 3. 상대 경로: "images/product.jpg" → "/" 추가 후 변환
 * 4. 누락: null/undefined → placeholder.png 반환
 *
 * 【참고】
 * - imageUtils.js에 더 기능이 많은 버전이 있음
 * - 이 파일은 간소화 버전 (한글 인코딩 없음)
 *
 * @module srcOf
 * @author Claude Code
 * @since 2025-11-02
 */

/**
 * srcOf - 이미지 경로를 절대 URL로 변환 (간소화 버전)
 *
 * @description
 * 이미지 경로 문자열을 받아 브라우저가 로드할 수 있는 절대 URL을 반환합니다.
 *
 * @param {string} raw - 이미지 경로
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
 * // 이미지 없음
 * srcOf(null)
 * // → "http://localhost:3000/images/placeholder.png"
 */
export function srcOf(raw) {
  if (!raw) return `${process.env.PUBLIC_URL}/images/placeholder.png`;
  if (/^https?:\/\//i.test(raw)) return raw;
  return `${process.env.PUBLIC_URL}${raw.startsWith('/') ? raw : `/${raw}`}`;
}
