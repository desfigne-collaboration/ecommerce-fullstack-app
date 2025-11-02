/**
 * ============================================================================
 * PayConfirm.jsx - 결제 확인 및 QR 스캔 페이지
 * ============================================================================
 *
 * 【목적】
 * - 결제 최종 확인 및 QR 코드 표시
 * - 주문 생성 및 저장 (localStorage)
 * - 쿠폰 사용 처리, 장바구니 아이템 제거
 * - 결제 완료 후 주문 내역 페이지로 이동
 *
 * 【주요 기능】
 * 1. **QR 코드 표시**: 선택한 결제 수단 (toss/kakao/naver)의 QR 이미지
 * 2. **주문 요약**: 상품 목록, 금액, 할인, 배송비, 최종 결제 금액
 * 3. **쿠폰 처리**: markCouponUsed()로 쿠폰 사용 처리 (used: true, usedAt 기록)
 * 4. **주문 저장**: saveOrders()로 각 상품당 1개 주문 생성 (관리자/마이페이지 호환)
 * 5. **장바구니 정리**: removeItemsFromCart()로 결제한 상품만 장바구니에서 제거
 * 6. **임시 데이터 정리**: clearTemp()로 payPayload, pendingOrder, cartCheckout 삭제
 *
 * 【데이터 흐름】
 * PaySelect → PayConfirm → (결제 완료) → /orders (MyOrders 페이지)
 *
 * 【할인 분배】
 * - 비례 분배: 각 상품의 금액 비율에 따라 쿠폰 할인 분배
 * - 배송비: 첫 번째 상품에만 부과
 *
 * 【주문 데이터 구조】
 * ```javascript
 * order = {
 *   id: "ORD-1699999999999-0",
 *   createdAt: "2025-11-02T12:34:56.789Z",
 *   buyer: { id, name, email },
 *   product: { id, name, image, price },
 *   option: { size },
 *   qty: 1,
 *   subtotal: 50000,
 *   discount: 5000,
 *   shipping: 3000,
 *   total: 48000,
 *   method: "토스페이",
 *   status: "결제완료"
 * }
 * ```
 *
 * @component
 * @author Claude Code
 * @since 2025-11-02
 */

// src/pages/order/PayConfirm.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import storage from "../../../utils/storage.js";
import "./PayConfirm.css";

const toNumber = (v) => (typeof v === "number" ? v : Number(String(v ?? "").replace(/[^\d]/g, "")) || 0);
const formatKRW = (n) => `₩${Number(n || 0).toLocaleString()}`;

// 안전한 이미지 경로 유틸 (QR만 사용)
const PLACEHOLDER = `${process.env.PUBLIC_URL || ""}/images/placeholder.webp`;
const srcOf = (raw) => {
  const s = String(raw || "").trim();
  if (!s) return PLACEHOLDER;
  if (/^https?:\/\//i.test(s)) return s;
  return `${process.env.PUBLIC_URL || ""}/${s.replace(/^\/+/, "")}`;
};

/**
 * normalizeItem - 상품 아이템 정규화
 *
 * @description
 * 다양한 형태의 item 객체를 표준 형식으로 변환합니다.
 *
 * @param {Object} raw - 원본 아이템 객체
 * @returns {Object|null} 정규화된 아이템 { product, option, qty }
 */
const normalizeItem = (raw) => {
  if (!raw) return null;
  const p = raw.product || raw;
  return {
    product: {
      id: p.id,
      name: p.name || "",
      image: p.image || p.img || "",
      price: toNumber(p.price),
    },
    option: { size: raw.size || p.size || "" },
    qty: toNumber(raw.qty || p.qty || 1),
  };
};

// QR 코드 이미지 경로 (상수)
const QR_CANDIDATES = ["/icons/qr.svg", "https://desfigne.synology.me/data/image/thejoeun/icons/qr.webp"];

/**
 * PayConfirm 함수형 컴포넌트
 *
 * @description
 * 결제 최종 확인 및 QR 스캔 페이지. 주문 생성, 쿠폰 처리, 장바구니 정리를 담당합니다.
 *
 * 【처리 흐름】
 * 1. **Payload 복구**: location.state → payPayload 순으로 시도
 * 2. **안전 가드**: incoming 또는 items 없으면 /order/checkout으로 리다이렉트
 * 3. **금액 계산**: 상품 금액 합계, 쿠폰 할인, 배송비, 최종 결제 금액
 * 4. **QR 표시**: 선택한 결제 수단의 QR 이미지
 * 5. **결제 완료 버튼 클릭 시**:
 *    - markCouponUsed(): 쿠폰 사용 처리
 *    - saveOrders(): 주문 생성 (각 상품당 1개)
 *    - removeItemsFromCart(): 결제한 상품만 장바구니에서 제거
 *    - clearTemp(): 임시 데이터 삭제
 *    - /orders로 navigate
 *
 * @returns {JSX.Element} 결제 확인 페이지 UI
 */
export default function PayConfirm() {
  const navigate = useNavigate();
  const location = useLocation();
  const incoming = useMemo(() => {
    // 우선순위: (1) location.state (2) localStorage.payPayload
    const fromState = location.state || null;
    if (fromState && fromState.items && fromState.items.length) return fromState;
    return storage.get("payPayload", null);
  }, [location.state]);

  const method = incoming?.method || "toss";
  const methodLabel = method === "kakao" ? "카카오페이" : method === "naver" ? "네이버페이" : "토스페이";

  useEffect(() => {
    if (!incoming || !incoming.items || incoming.items.length === 0) {
      navigate("/order/checkout");
    }
  }, [incoming, navigate]);

  const items = useMemo(() => (incoming?.items || []).map(normalizeItem).filter(Boolean), [incoming]);

  // 금액 계산
  const subtotal = useMemo(() => items.reduce((s, it) => s + toNumber(it.product.price) * it.qty, 0), [items]);
  const rawDiscount = toNumber(incoming?.coupon?.discount || incoming?.discount);
  const effectiveDiscount = Math.min(subtotal, Math.max(0, rawDiscount));
  const shipping = toNumber(incoming?.shipping || 0);
  const total = Math.max(0, subtotal - effectiveDiscount + shipping);

  // QR 경로
  const qrSrc0 = useMemo(() => srcOf(QR_CANDIDATES[0]), []);

  const [paying, setPaying] = useState(false);

  /**
   * markCouponUsed - 쿠폰 사용 처리
   *
   * @description
   * localStorage에서 쿠폰 목록을 가져와 해당 쿠폰을 사용 처리합니다.
   * used: true, usedAt: ISO 날짜 문자열로 설정합니다.
   */
  const markCouponUsed = () => {
    const c = incoming?.coupon;
    if (!c) return;
    const list = storage.get("coupons", []);
    const next = list.map((x) =>
      String(x.id) === String(c.id) ? { ...x, used: true, usedAt: new Date().toISOString() } : x
    );
    storage.set("coupons", next);
  };

  /**
   * saveOrders - 주문 저장
   *
   * @description
   * 각 상품당 1개의 주문 객체를 생성하여 localStorage에 저장합니다.
   * 할인은 비례 분배하고, 배송비는 첫 번째 상품에만 부과합니다.
   *
   * @returns {string[]} 생성된 주문 ID 배열
   */
  const saveOrders = () => {
    const user = storage.get("loginUser", null);
    const buyer = user
      ? { id: user.id, name: user.name || (user.email ? user.email.split("@")[0] : "사용자"), email: user.email || "" }
      : { id: "guest", name: "비회원", email: "" };

    const prev = storage.get("orders", []);
    const now = new Date();
    const iso = now.toISOString();
    const baseId = Date.now();

    // 할인 분배 (비례 분배)
    const parts = items.map((it) => toNumber(it.product.price) * it.qty);
    const partsSum = parts.reduce((a, b) => a + b, 0) || 1;
    const discounts = parts.map((p) => Math.round((p / partsSum) * effectiveDiscount));

    const perItemOrders = items.map((it, idx) => {
      const price = toNumber(it.product.price);
      const qty = toNumber(it.qty);
      const line = price * qty;
      const dc = Math.min(line, toNumber(discounts[idx] || 0));
      const totalLine = Math.max(0, line - dc + (idx === 0 ? shipping : 0)); // 배송비는 첫 아이템에만

      return {
        id: `ORD-${baseId}-${idx}`,
        createdAt: iso,
        buyer,
        product: { id: it.product.id, name: it.product.name, image: it.product.image, price },
        option: { size: it.option?.size || "" },
        qty,
        subtotal: line,
        discount: dc,
        shipping: idx === 0 ? shipping : 0,
        total: totalLine,
        method: methodLabel,
        status: "결제완료",
      };
    });

    const next = [...perItemOrders, ...prev];
    storage.set("orders", next);
    return perItemOrders.map(o => o.id);
  };

  /**
   * removeItemsFromCart - 결제한 상품만 장바구니에서 제거
   *
   * @description
   * 현재 장바구니에서 결제한 상품(ID + 사이즈 일치)만 제거하고 나머지는 유지합니다.
   * StorageEvent를 발행하여 Header의 장바구니 뱃지를 업데이트합니다.
   */
  const removeItemsFromCart = () => {
    // 현재 장바구니 읽기
    const currentCart = storage.get("cart", []);

    // 결제한 상품들을 장바구니에서 제거
    const remainingCart = currentCart.filter(cartItem => {
      // 결제한 아이템 중에 매칭되는 것이 있는지 확인
      const isPurchased = items.some(purchasedItem => {
        const cartProductId = cartItem.product?.id || cartItem.id;
        const cartSize = cartItem.size || cartItem.option?.size || "";
        const purchasedProductId = purchasedItem.product.id;
        const purchasedSize = purchasedItem.option?.size || "";

        // 상품 ID와 사이즈가 모두 일치하면 결제한 상품
        return cartProductId === purchasedProductId && cartSize === purchasedSize;
      });

      // 결제하지 않은 상품만 남김
      return !isPurchased;
    });

    // 업데이트된 장바구니 저장
    storage.set("cart", remainingCart);
    window.dispatchEvent(new StorageEvent("storage", { key: "cart", newValue: JSON.stringify(remainingCart) }));
  };

  /**
   * clearTemp - 임시 데이터 정리
   *
   * @description
   * 결제 완료 후 더 이상 필요 없는 임시 데이터를 localStorage에서 삭제합니다.
   */
  const clearTemp = () => {
    storage.remove("payPayload");
    storage.remove("pendingOrder");
    storage.remove("cartCheckout");
  };

  /**
   * onClickPay - 결제 완료 버튼 핸들러
   *
   * @description
   * 결제 완료 처리를 수행합니다.
   * 1. 쿠폰 사용 처리
   * 2. 주문 생성 및 저장
   * 3. 장바구니에서 결제한 상품 제거
   * 4. 임시 데이터 정리
   * 5. 주문 내역 페이지로 이동
   */
  const onClickPay = () => {
    if (paying) return;
    setPaying(true);
    try {
      // 실제 결제 SDK가 들어갈 자리 (성공 가정)
      markCouponUsed();
      saveOrders();
      removeItemsFromCart(); // 결제한 상품만 장바구니에서 제거
      clearTemp();
      navigate("/orders");
    } catch (e) {
      console.error(e);
      alert("결제 처리에 실패했습니다. 다시 시도해주세요.");
      setPaying(false);
    }
  };

  if (!incoming) return null;

  return (
    <div className="pc-wrap">
      {/* QR 영역 */}
      <div className="pc-col qr">
        <h2 className="pc-title">{methodLabel} QR</h2>
        <div className="pc-qrbox">
          <img src={qrSrc0} alt="결제 QR" onError={(e) => (e.currentTarget.src = qrSrc0)} />
        </div>
        <div style={{ marginTop: 10, color: "#666", fontSize: 14 }}>
          앱에서 QR을 스캔해 결제를 진행하세요.
        </div>

        <div className="pc-actions" style={{ marginTop: 16 }}>
          <button className="btn btn-primary" onClick={onClickPay} disabled={paying}>
            {paying ? "처리 중..." : "결제 완료"}
          </button>
          <button className="ghost" onClick={() => navigate(-1)} style={{ marginLeft: 8 }} disabled={paying}>
            이전으로
          </button>
        </div>
      </div>

      {/* 합계 */}
      <div className="pc-col sum">
        <h2 className="pc-title">주문 요약</h2>
        <div className="pc-items">
          {items.map((it, i) => (
            <div className="pc-item" key={`${it.product.id}-${i}`}>
              <div className="pc-name">{it.product.name}</div>
              <div className="pc-qty">{it.qty}개</div>
              <div className="pc-price">{formatKRW(toNumber(it.product.price) * it.qty)}</div>
            </div>
          ))}
        </div>

        <div className="pc-sum">
          <div className="pc-row"><span>상품 금액</span><b>{formatKRW(subtotal)}</b></div>
          <div className="pc-row"><span>할인</span><b>-{formatKRW(effectiveDiscount)}</b></div>
          <div className="pc-row"><span>배송비</span><b>{formatKRW(shipping)}</b></div>
          <div className="pc-row total"><span>결제 금액</span><b>{formatKRW(total)}</b></div>
        </div>
      </div>
    </div>
  );
}
