/**
 * ============================================================================
 * coupon.js - 쿠폰 할인 계산 유틸리티
 * ============================================================================
 *
 * 【목적】
 * - 주문 결제 시 쿠폰 할인 금액을 계산
 * - 쿠폰 유효성 검증 (사용 여부, 만료일)
 * - 최대 할인 금액 제한 적용
 *
 * 【쿠폰 데이터 구조】
 * {
 *   id: "COUPON001",
 *   name: "신규가입 쿠폰",
 *   amount: 10000,           // 할인 금액
 *   used: false,             // 사용 여부
 *   expiresAt: "2025-12-31"  // 만료일
 * }
 *
 * 【할인 계산 로직】
 * - 쿠폰 금액 vs 주문 금액 중 작은 값 적용
 * - 예: 5,000원 주문에 10,000원 쿠폰 → 5,000원 할인
 * - 예: 20,000원 주문에 10,000원 쿠폰 → 10,000원 할인
 *
 * @module coupon
 * @author Claude Code
 * @since 2025-11-02
 */

/**
 * getDiscountByCoupon - 쿠폰 할인 금액 계산
 *
 * @description
 * 쿠폰 유효성을 검증하고 적용 가능한 할인 금액을 계산합니다.
 *
 * 검증 항목:
 * 1. 쿠폰 존재 여부
 * 2. 이미 사용된 쿠폰인지 (used)
 * 3. 만료일 체크 (expiresAt)
 *
 * @param {number} subtotal - 주문 소계 금액
 * @param {Object} coupon - 쿠폰 객체
 * @param {number} coupon.amount - 쿠폰 할인 금액
 * @param {boolean} [coupon.used] - 사용 여부
 * @param {string} [coupon.expiresAt] - 만료일 (ISO 8601 형식)
 * @returns {number} 적용할 할인 금액 (0 이상)
 *
 * @example
 * const discount = getDiscountByCoupon(50000, {
 *   amount: 10000,
 *   used: false,
 *   expiresAt: "2025-12-31"
 * });
 * console.log(discount); // → 10000
 *
 * @example
 * // 주문 금액보다 쿠폰이 큰 경우
 * const discount = getDiscountByCoupon(5000, { amount: 10000 });
 * console.log(discount); // → 5000 (주문 금액까지만 할인)
 *
 * @example
 * // 이미 사용된 쿠폰
 * const discount = getDiscountByCoupon(50000, { amount: 10000, used: true });
 * console.log(discount); // → 0
 */
export function getDiscountByCoupon(subtotal, coupon) {
  if (!coupon || coupon.used) return 0;
  const now = Date.now();
  if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < now) return 0;
  return Math.min(coupon.amount || 0, subtotal || 0);
}
