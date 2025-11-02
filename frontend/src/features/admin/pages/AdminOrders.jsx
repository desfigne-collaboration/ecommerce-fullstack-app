/**
 * ============================================================================
 * AdminOrders.jsx - 관리자 주문 관리 페이지
 * ============================================================================
 *
 * 【목적】
 * - 관리자 권한으로 전체 주문 목록 조회 및 관리
 * - 주문 상태 변경, 주문 삭제, 단체주문 상세 조회 기능 제공
 * - Admin 전용 페이지로 비인가 접근 차단
 *
 * 【주요 기능】
 * 1. **Admin 권한 검증**: userId가 "admin"인지 확인 (비인가 시 /login 리다이렉트)
 * 2. **주문 목록 표시**: listOrders() API로 전체 주문 조회
 * 3. **검색 기능**: 주문자/이메일/상품명으로 실시간 필터링
 * 4. **주문 상태 변경**: 결제완료, 배송중, 배송완료, 주문취소
 * 5. **주문 삭제**: 선택한 주문 영구 삭제 (확인 팝업)
 * 6. **단체주문 상세**: type이 "bulk"인 주문의 메타 정보 표시
 *
 * 【주문 상태 흐름】
 * - 결제완료 → 배송중 → 배송완료
 * - 주문취소 (언제든 가능)
 *
 * 【데이터 소스】
 * - listOrders(): features/order/api/orders.js에서 localStorage 조회
 * - 각 order 객체: { id, type, buyer, product, option, qty, total, status, createdAt, meta }
 *
 * 【권한 검증】
 * - useEffect에서 loginInfo.userId === "admin" 확인
 * - 비인가 시 window.location.href = "/#/login"으로 강제 이동
 *
 * 【단체주문 처리】
 * - type이 "bulk"인 주문에 "단체주문" 배지 표시
 * - "상세" 버튼 클릭 시 meta 정보를 alert로 표시
 *
 * @component
 * @author Claude Code
 * @since 2025-11-02
 */

// src/pages/admin/AdminOrders.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { listOrders, updateOrderStatus, deleteOrder } from "../../order/api/orders";
import storage from "../../../utils/storage.js";
import "../../../styles/AdminDashboard.css";
import "../../../styles/AdminOrders.css"; // 버튼/배지 등 스타일

/**
 * AdminOrders - 관리자 주문 관리 컴포넌트
 *
 * @description
 * 관리자 권한으로 전체 주문 목록을 조회하고 상태를 관리하는 페이지입니다.
 *
 * 【레이아웃 구조】
 * 1. admin-topbar: 페이지 제목 및 액션 버튼 (대시보드, 홈)
 * 2. admin-card: 주문 목록 카드
 *    - admin-card-head: 제목 + 검색 입력 + 새로고침 버튼
 *    - admin-table: 주문 정보 테이블
 *
 * 【상태 관리】
 * - q: 검색어 (주문자/이메일/상품명)
 * - orders: listOrders()로 불러온 주문 목록
 *
 * 【검색 로직】
 * - useMemo로 filtered 배열 생성
 * - 주문자 이름, 이메일, 상품명에 검색어 포함 여부 확인 (대소문자 무시)
 *
 * 【주문 상태 변경】
 * - mark(id, status) 함수로 updateOrderStatus API 호출
 * - 가능한 상태: "결제완료", "배송중", "배송완료", "주문취소"
 *
 * 【주문 삭제】
 * - confirm 팝업으로 삭제 확인
 * - deleteOrder API로 localStorage에서 영구 삭제
 *
 * @returns {JSX.Element} 관리자 주문 관리 페이지
 *
 * @example
 * // App.jsx 또는 라우터에서 사용:
 * <Route path="/admin/orders" element={<AdminOrders />} />
 */
export default function AdminOrders() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [orders, setOrders] = useState(listOrders());

  /**
   * Admin 권한 체크
   *
   * @description
   * useEffect에서 loginInfo.userId가 "admin"인지 확인합니다.
   * Admin이 아니면 로그인 페이지로 강제 리다이렉트됩니다.
   *
   * 【권한 확인 흐름】
   * 1. localStorage에서 loginInfo 조회
   * 2. loginInfo가 없거나 userId가 "admin"이 아니면 비인가
   * 3. window.location.href로 /#/login으로 이동
   */
  useEffect(() => {
    // Admin 권한 체크
    const loginInfo = storage.get("loginInfo", null);
    if (!loginInfo || loginInfo.userId !== "admin") {
      window.location.href = "/#/login";
    }
  }, [navigate]);

  /**
   * refresh - 주문 목록 새로고침
   *
   * @description
   * listOrders() API를 다시 호출하여 최신 주문 목록을 불러옵니다.
   */
  const refresh = () => setOrders(listOrders());

  /**
   * filtered - 검색 필터링된 주문 목록
   *
   * @description
   * useMemo로 메모이제이션하여 검색어(q)에 따라 주문 목록을 필터링합니다.
   *
   * 【필터링 조건】
   * - 주문자 이메일에 검색어 포함 (대소문자 무시)
   * - 주문자 이름에 검색어 포함 (대소문자 무시)
   * - 상품명에 검색어 포함 (대소문자 무시)
   * - 검색어가 없으면 전체 목록 반환
   *
   * @type {Array<Object>}
   */
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return orders;
    return orders.filter(
      (o) =>
        (o.buyer?.email || "").toLowerCase().includes(term) ||
        (o.buyer?.name || "").toLowerCase().includes(term) ||
        (o.product?.name || "").toLowerCase().includes(term)
    );
  }, [orders, q]);

  /**
   * formatDate - 날짜 포맷팅
   *
   * @description
   * 타임스탬프를 "YYYY-MM-DD HH:mm" 형식으로 변환합니다.
   *
   * @param {number} ms - 타임스탬프 (밀리초)
   * @returns {string} 포맷팅된 날짜 문자열 (예: "2025-11-02 14:30")
   *
   * @example
   * formatDate(1730556789123) // "2025-11-02 14:33"
   */
  const formatDate = (ms) => {
    if (!ms) return "-";
    const d = new Date(ms);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${y}-${m}-${day} ${hh}:${mm}`;
  };

  /**
   * mark - 주문 상태 변경
   *
   * @description
   * updateOrderStatus API를 호출하여 주문 상태를 변경합니다.
   *
   * 【가능한 상태】
   * - "결제완료": 결제가 완료된 상태
   * - "배송중": 배송이 시작된 상태
   * - "배송완료": 배송이 완료된 상태
   * - "주문취소": 주문이 취소된 상태
   *
   * @param {string} id - 주문 ID
   * @param {string} status - 변경할 상태
   *
   * @example
   * mark("1730556789123", "배송중")
   */
  const mark = (id, status) => {
    updateOrderStatus(id, status);
    refresh();
  };

  /**
   * remove - 주문 삭제
   *
   * @description
   * confirm 팝업으로 사용자 확인 후 deleteOrder API를 호출하여 주문을 영구 삭제합니다.
   *
   * 【삭제 흐름】
   * 1. window.confirm()으로 삭제 확인
   * 2. 확인 시 deleteOrder(id) 호출
   * 3. localStorage에서 해당 주문 제거
   * 4. refresh()로 목록 업데이트
   *
   * @param {string} id - 삭제할 주문 ID
   *
   * @example
   * remove("1730556789123")
   */
  const remove = (id) => {
    if (window.confirm("정말로 이 주문을 완전히 삭제하시겠습니까?")) {
      deleteOrder(id);
      refresh();
    }
  };

  /**
   * showDetail - 단체주문 상세 정보 표시
   *
   * @description
   * type이 "bulk"인 주문의 메타 정보를 alert 팝업으로 표시합니다.
   *
   * 【표시 정보】
   * - 주문ID, 유형, 주문일시
   * - 주문자 정보: 이름, 이메일, 연락처, 업체명
   * - 주문 상세: 요청브랜드, 수량, 필요일자, 희망수량, 메시지
   *
   * @param {Object} o - 주문 객체
   * @param {Object} o.meta - 단체주문 메타 정보
   * @param {string} o.meta.needDate - 필요 일자
   * @param {number} o.meta.wishQty - 희망 수량
   * @param {string} o.meta.message - 문의 메시지
   *
   * @example
   * showDetail({
   *   id: "1730556789123",
   *   type: "bulk",
   *   buyer: { name: "홍길동", email: "hong@example.com", company: "ABC Corp" },
   *   meta: { needDate: "2025-12-01", wishQty: 100, message: "긴급 주문" }
   * })
   */
  const showDetail = (o) => {
    // 단체주문 메타를 간단히 확인할 수 있게 팝업
    const meta = o?.meta || {};
    const lines = [
      `주문ID: ${o.id}`,
      `유형: ${o.type || "일반"}`,
      `주문일시: ${formatDate(o.createdAt)}`,
      `주문자: ${o.buyer?.name || "-"}`,
      `이메일: ${o.buyer?.email || "-"}`,
      `연락처: ${o.buyer?.phone || "-"}`,
      `업체명: ${o.buyer?.company || "-"}`,
      `요청브랜드: ${o.product?.name || "-"}`,
      `수량: ${o.qty}`,
      `필요일자: ${meta.needDate || "-"}`,
      `요청수량(희망): ${meta.wishQty ?? "-"}`,
      `메시지: ${meta.message || "-"}`,
    ];
    alert(lines.join("\n"));
  };

  // useEffect에서 이미 권한 체크를 하므로 렌더링은 그대로 진행

  return (
    <div className="admin-wrap">
      <div className="admin-topbar">
        <div className="admin-title">주문 관리</div>
        <div className="admin-actions">
          <Link
            className="btn"
            to={{ pathname: "/mypage", state: { activeTab: "admin-users" } }}
          >
            대시보드
          </Link>
          <Link className="btn" to="/">
            홈으로
          </Link>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-head">
          <div className="admin-card-title">주문 목록</div>
          <div className="admin-controls">
            <input
              className="admin-input"
              placeholder="주문자/이메일/상품 검색"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <button className="btn" onClick={refresh}>
              새로고침
            </button>
          </div>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: "32px" }}>#</th>
                <th style={{ width: "120px" }}>주문일시</th>
                <th>주문자</th>
                <th>이메일</th>
                <th>상품</th>
                <th style={{ width: "80px" }}>사이즈</th>
                <th style={{ width: "70px" }}>수량</th>
                <th style={{ width: "120px" }}>금액</th>
                <th style={{ width: "100px" }}>상태</th>
                <th style={{ width: "320px" }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="empty">
                    주문이 없습니다.
                  </td>
                </tr>
              ) : (
                filtered.map((o, i) => (
                  <tr key={o.id}>
                    <td>{i + 1}</td>
                    <td>{formatDate(o.createdAt)}</td>
                    <td>{o.buyer?.name || "-"}</td>
                    <td>{o.buyer?.email || "-"}</td>
                    <td>
                      {o.product?.name}
                      {o.type === "bulk" && (
                        <span className="bulk-badge" style={{
                          marginLeft: 8,
                          padding: "2px 8px",
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 800,
                          color: "#5e37f4",
                          background: "#f3ecff",
                          border: "1px solid #e5d8ff",
                        }}>
                          단체주문
                        </span>
                      )}
                    </td>
                    <td>{o.option?.size}</td>
                    <td>{o.qty}</td>
                    <td>{o.total}원</td>
                    <td>{o.status}</td>
                    <td>
                      <div className="admin-order-btns">
                        {o.type === "bulk" && (
                          <button
                            className="admin-btn btn-outline"
                            onClick={() => showDetail(o)}
                            title="문의 상세"
                          >
                            상세
                          </button>
                        )}
                        <button
                          className="admin-btn btn-paid"
                          onClick={() => mark(o.id, "결제완료")}
                        >
                          결제완료
                        </button>
                        <button
                          className="admin-btn btn-shipping"
                          onClick={() => mark(o.id, "배송중")}
                        >
                          배송중
                        </button>
                        <button
                          className="admin-btn btn-shipping"
                          onClick={() => mark(o.id, "배송완료")}
                        >
                          배송완료
                        </button>
                        <button
                          className="admin-btn btn-cancel"
                          onClick={() => mark(o.id, "주문취소")}
                        >
                          주문취소
                        </button>
                        <button
                          className="admin-btn btn-delete"
                          onClick={() => remove(o.id)}
                        >
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
