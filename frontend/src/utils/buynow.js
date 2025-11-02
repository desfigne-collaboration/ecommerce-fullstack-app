/**
 * ============================================================================
 * buynow.js - 즉시 구매 유틸리티
 * ============================================================================
 *
 * 【목적】
 * - 상품 상세 페이지에서 "바로 구매" 버튼 클릭 시 처리
 * - 장바구니를 거치지 않고 즉시 결제 페이지로 이동
 * - 단일 상품 + 옵션(사이즈 등)을 결제 정보로 전달
 *
 * 【처리 흐름】
 * 1. 상품 + 수량 + 옵션 정보를 pendingCheckout 객체로 생성
 * 2. localStorage에 임시 저장 (새로고침 대비)
 * 3. /order/checkout?mode=buynow 페이지로 이동
 * 4. Checkout.jsx에서 pendingCheckout 읽어서 주문 처리
 *
 * 【Cart vs BuyNow】
 * - **Cart**: 여러 상품 담기 → 나중에 결제
 * - **BuyNow**: 단일 상품 즉시 결제 (빠른 구매 흐름)
 *
 * @module buynow
 * @author Claude Code
 * @since 2025-11-02
 */

import storage from "./storage.js";

/**
 * buyNow - 즉시 구매 처리
 *
 * @description
 * 상품 정보를 localStorage에 저장하고 결제 페이지로 이동합니다.
 * navigate 함수 또는 window.location.hash를 사용합니다.
 *
 * @param {Object} product - 상품 객체
 * @param {string} product.id - 상품 ID
 * @param {string} product.name - 상품명
 * @param {number} product.price - 가격
 * @param {string} product.image - 이미지 URL
 * @param {number} [qty=1] - 수량
 * @param {Function|null} push - navigate 함수 (React Router의 navigate)
 * @param {Object} [option={}] - 옵션 (사이즈, 색상 등)
 *
 * @example
 * // ProductDetail.jsx에서 사용
 * import { useNavigate } from "react-router-dom";
 * import { buyNow } from "utils/buynow";
 *
 * const navigate = useNavigate();
 * const handleBuyNow = () => {
 *   buyNow(product, quantity, navigate, { size: selectedSize });
 * };
 *
 * @example
 * // navigate 없이 사용 (직접 URL 변경)
 * buyNow(product, 2, null, { size: "L" });
 */
export function buyNow(product, qty = 1, push, option = {}) {
  const payload = {
    items: [
      {
        id: product.id,
        name: product.name,
        price: Number(product.price) || 0,
        qty: Number(qty) || 1,
        image: product.image || "",
        option: { ...option }, // ← 사이즈 등 옵션 포함
      },
    ],
    createdAt: Date.now(),
    from: "brand",
    mode: "buynow",
  };

  storage.set("pendingCheckout", payload);

  if (typeof push === "function") push("/order/checkout?mode=buynow");
  else window.location.hash = "#/order/checkout?mode=buynow";
}
