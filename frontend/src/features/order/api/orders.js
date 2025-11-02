/**
 * ============================================================================
 * orders.js - 주문 관리 API 헬퍼 (localStorage 기반)
 * ============================================================================
 *
 * 【목적】
 * - localStorage 기반 주문 데이터 CRUD 작업
 * - 일반 주문 및 단체 주문 지원
 * - 주문 상태 업데이트 및 삭제 기능 제공
 *
 * 【주요 기능】
 * 1. **listOrders**: 모든 주문 목록 조회
 * 2. **updateOrderStatus**: 주문 상태 업데이트 (결제완료, 배송중 등)
 * 3. **deleteOrder**: 주문 삭제
 * 4. **createBulkOrder**: 단체 주문 등록 (bulk order form에서 사용)
 *
 * 【데이터 구조】
 * ```javascript
 * order = {
 *   id: "ORDER-1234567890",
 *   createdAt: 1699999999999,
 *   type: "normal" | "bulk",
 *   status: "결제완료" | "배송중" | "배송완료" | "문의접수",
 *   buyer: { name, email, phone, company },
 *   product: { id, name, image, price },
 *   option: { size },
 *   qty: 1,
 *   total: 50000,
 *   meta: { ... }
 * }
 * ```
 *
 * 【사용 예시】
 * - MyOrders.jsx: listOrders()로 주문 목록 조회
 * - AdminOrders.jsx: updateOrderStatus()로 주문 상태 변경
 * - BulkOrder.jsx: createBulkOrder()로 단체 주문 등록
 *
 * @module orders
 * @author Claude Code
 * @since 2025-11-02
 */

// localStorage 기반 주문 관리 헬퍼
import storage from "../../../utils/storage.js";

const STORAGE_KEY = "orders";

/**
 * saveOrders - 주문 배열을 localStorage에 저장
 *
 * @param {Array<Object>} orders - 주문 배열
 */
function saveOrders(orders) {
  storage.set(STORAGE_KEY, orders);
}

/**
 * listOrders - 모든 주문 목록 조회
 *
 * @description
 * localStorage에서 모든 주문 배열을 가져옵니다.
 * 에러 발생 시 빈 배열을 반환합니다.
 *
 * @returns {Array<Object>} 주문 객체 배열
 *
 * @example
 * const orders = listOrders();
 * // → [{ id: "ORDER-123", buyer: {...}, product: {...}, ... }, ...]
 */
export function listOrders() {
  try {
    return storage.get(STORAGE_KEY, []);
  } catch {
    return [];
  }
}

/**
 * updateOrderStatus - 주문 상태 업데이트
 *
 * @description
 * 특정 주문 ID의 상태를 변경합니다.
 * 관리자 페이지에서 주문 상태 관리 시 사용됩니다.
 *
 * @param {string} id - 주문 ID
 * @param {string} status - 새로운 상태 ("결제완료", "배송중", "배송완료" 등)
 *
 * @example
 * updateOrderStatus("ORDER-123", "배송중");
 */
export function updateOrderStatus(id, status) {
  try {
    const orders = storage.get(STORAGE_KEY, []);
    const idx = orders.findIndex(o => o.id === id);
    if (idx !== -1) {
      orders[idx].status = status;
      saveOrders(orders);
    }
  } catch (e) {
    console.error("updateOrderStatus error:", e);
  }
}

/**
 * deleteOrder - 주문 삭제
 *
 * @description
 * 특정 주문 ID를 삭제합니다.
 * 관리자 페이지에서 주문 관리 시 사용됩니다.
 *
 * @param {string} id - 삭제할 주문 ID
 *
 * @example
 * deleteOrder("ORDER-123");
 */
export function deleteOrder(id) {
  try {
    const orders = storage.get(STORAGE_KEY, []);
    const updated = orders.filter(o => o.id !== id);
    saveOrders(updated);
  } catch (e) {
    console.error("deleteOrder error:", e);
  }
}

/**
 * createBulkOrder - 단체 주문 등록
 *
 * @description
 * 단체 주문 폼에서 제출된 데이터를 주문 객체로 변환하여 저장합니다.
 * 주문 타입을 "bulk"로 설정하고, 초기 상태는 "문의접수"입니다.
 *
 * @param {Object} form - 단체 주문 폼 데이터
 * @param {string} form.inquirerName - 문의자 이름
 * @param {string} form.email - 이메일
 * @param {string} form.phone - 전화번호
 * @param {string} form.companyName - 회사명
 * @param {string} form.requestBrand - 요청 브랜드
 * @param {string} form.productNo - 상품번호
 * @param {number} form.quantity - 수량
 * @param {string} form.needDate - 필요 날짜
 * @param {string} form.message - 요청 메시지
 * @param {boolean} form.agree - 개인정보 동의
 * @returns {string|null} 생성된 주문 ID 또는 null (실패 시)
 *
 * @example
 * const orderId = createBulkOrder({
 *   inquirerName: "홍길동",
 *   email: "hong@example.com",
 *   phone: "010-1234-5678",
 *   companyName: "ABC 회사",
 *   requestBrand: "Nike",
 *   productNo: "NK-1234",
 *   quantity: 100,
 *   needDate: "2025-12-31",
 *   message: "로고 인쇄 가능한가요?",
 *   agree: true
 * });
 * // → "BULK-1699999999999"
 */
export function createBulkOrder(form) {
  try {
    const orders = listOrders();

    const id = "BULK-" + Date.now(); // 고유한 주문 ID
    const qty = Number(form.quantity || 1);

    const order = {
      id,
      createdAt: Date.now(),
      type: "bulk", // 단체주문 구분값
      status: "문의접수", // 초기 상태
      buyer: {
        name: form.inquirerName || "-",
        email: form.email || "-",
        phone: form.phone || "-",
        company: form.companyName || "-",
      },
      product: {
        name: `${form.requestBrand || "브랜드"} 단체주문 (상품번호 ${form.productNo || "-"})`,
      },
      option: { size: "-" },
      qty,
      total: 0,
      meta: {
        needDate: form.needDate || "",
        wishQty: qty,
        message: form.message || "",
        agree: !!form.agree,
        __source: "bulk-order-form",
      },
    };

    orders.unshift(order);
    saveOrders(orders);
    return id;
  } catch (e) {
    console.error("createBulkOrder error:", e);
    return null;
  }
}
