/**
 * ============================================================================
 * MyOrders.jsx - 내 주문 내역 페이지
 * ============================================================================
 *
 * 【목적】
 * - 로그인한 사용자의 주문 내역 조회
 * - 주문 상세 정보 표시 (상품, 옵션, 수량, 금액, 상태)
 * - 주문별 상품 보기 링크 제공
 *
 * 【주요 기능】
 * 1. **주문 목록 조회**: localStorage에서 모든 주문 가져오기
 * 2. **사용자 필터링**: 로그인한 사용자의 이메일과 일치하는 주문만 표시
 * 3. **주문 정보 표시**: 상품 이미지, 이름, 옵션, 수량, 총액, 주문 날짜, 상태
 * 4. **로그인 체크**: 비로그인 사용자에게 로그인 안내
 *
 * 【데이터 소스】
 * - localStorage "orders": 전체 주문 배열
 * - localStorage "loginUser": 현재 로그인 사용자 정보
 *
 * 【경로】
 * - /mypage/orders - 마이페이지에서 주문 내역 조회
 *
 * @component
 * @author Claude Code
 * @since 2025-11-02
 */

// src/pages/order/MyOrders.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import storage from "../../../utils/storage.js";
import "./MyOrders.css";

/**
 * formatKRW - 원화 포맷팅
 *
 * @param {number} n - 금액
 * @returns {string} "₩50,000" 형태의 포맷된 문자열
 */
const formatKRW = (n) => `₩${Number(n || 0).toLocaleString()}`;

/**
 * MyOrders 함수형 컴포넌트
 *
 * @description
 * 현재 로그인한 사용자의 주문 내역을 표시합니다.
 *
 * 【처리 흐름】
 * 1. **사용자 확인**: localStorage에서 loginUser 조회
 * 2. **주문 목록 로드**: localStorage에서 orders 조회
 * 3. **필터링**: 사용자 이메일과 일치하는 주문만 추출
 * 4. **렌더링**: 주문 카드 리스트 표시
 *
 * 【내부 함수】
 * - formatDate: 날짜를 "YYYY-MM-DD HH:mm" 형식으로 변환
 *
 * @returns {JSX.Element} 주문 내역 페이지 UI
 */
export default function MyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState(() => {
    return storage.get("orders", []);
  });
  const user = useMemo(() => {
    return storage.get("loginUser", null);
  }, []);

  useEffect(() => {
    setOrders(storage.get("orders", []));
  }, []);

  const mine = useMemo(() => {
    if (!user?.email) return [];
    return orders.filter((o) => (o.buyer?.email || "") === user.email);
  }, [orders, user]);

  /**
   * formatDate - 날짜 포맷팅
   *
   * @description
   * timestamp 또는 ISO 문자열을 "YYYY-MM-DD HH:mm" 형식으로 변환
   *
   * @param {number|string} msOrIso - 타임스탬프(ms) 또는 ISO 날짜 문자열
   * @returns {string} 포맷된 날짜 문자열
   */
  const formatDate = (msOrIso) => {
    if (!msOrIso) return "-";
    const d = typeof msOrIso === "number" ? new Date(msOrIso) : new Date(msOrIso);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${y}-${m}-${day} ${hh}:${mm}`;
  };

  if (!user) {
    return (
      <div className="my-orders-container">
        <h1 className="my-orders-title">주문내역</h1>
        <p>로그인이 필요합니다.</p>
        <button onClick={() => navigate("/login")} className="login-button">로그인 하러가기</button>
      </div>
    );
  }

  return (
    <div className="my-orders-container">
      <h1 className="my-orders-title">주문내역</h1>

      {mine.length === 0 ? (
        <div className="empty-orders-container">
          <div>주문 내역이 없습니다.</div>
          <Link to="/" className="continue-shopping-link">쇼핑 계속하기</Link>
        </div>
      ) : (
        <div className="orders-list">
          {mine.map((o) => (
            <div key={o.id} className="order-item">
              <div className="order-header">
                <div className="order-id">주문번호 {o.id}</div>
                <div className="order-date">{formatDate(o.createdAt)}</div>
              </div>

              <div className="order-body">
                <div className="order-product">
                  <img
                    src={o.product?.image || o.product?.img || "/images/noimg.png"}
                    alt={o.product?.name || "상품"}
                    className="order-product-image"
                    onError={(e)=>{e.currentTarget.src="/images/noimg.png"}}
                  />
                  <div className="order-info">
                    <div className="order-name">{o.product?.name || "-"}</div>
                    <div className="order-meta">
                      <span>옵션: {o.option?.size || "-"}</span>
                      <span style={{ marginLeft: 10 }}>수량: {o.qty || 1}개</span>
                    </div>
                  </div>
                </div>

                <div className="order-total">{formatKRW(o.total)}</div>
              </div>

              <div className="order-footer">
                <span className="order-status">{o.status}</span>
                {o.product?.id && (
                  <Link to={`/product/${o.product.id}`} className="view-product-link">상품보기</Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
