/**
 * ============================================================================
 * money.js - 금액 포맷팅 유틸리티
 * ============================================================================
 *
 * 【목적】
 * - 가격 문자열/숫자 변환
 * - 한국 원화(KRW) 포맷팅
 * - 천 단위 콤마 자동 추가
 *
 * 【사용 사례】
 * - 상품 가격 표시
 * - 장바구니 총액 계산
 * - 주문 금액 표시
 *
 * @module money
 * @author Claude Code
 * @since 2025-11-02
 */

/**
 * toNumber - 가격 문자열을 숫자로 변환
 *
 * @description
 * "₩50,000", "50000원" 같은 문자열에서 숫자만 추출합니다.
 * 이미 숫자인 경우 그대로 반환합니다.
 *
 * @param {string|number} v - 변환할 값
 * @returns {number} 순수 숫자
 *
 * @example
 * toNumber("₩50,000") // → 50000
 * toNumber("50000원") // → 50000
 * toNumber(50000) // → 50000
 * toNumber("abc") // → 0
 */
export const toNumber = (v) =>
  typeof v === "string" ? Number(v.replace(/[^\d]/g, "")) || 0 : Number(v || 0);

/**
 * formatKRW - 숫자를 한국 원화 형식으로 포맷팅
 *
 * @description
 * 숫자에 천 단위 콤마를 추가하고 "₩" 기호를 붙입니다.
 *
 * @param {number} n - 금액 (숫자)
 * @returns {string} "₩50,000" 형태의 문자열
 *
 * @example
 * formatKRW(50000) // → "₩50,000"
 * formatKRW(1234567) // → "₩1,234,567"
 * formatKRW(0) // → "₩0"
 */
export const formatKRW = (n) => `₩${Number(n || 0).toLocaleString()}`;
