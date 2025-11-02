/**
 * ============================================================================
 * PaySelect.jsx - 결제 수단 선택 페이지 (신버전)
 * ============================================================================
 *
 * 【목적】
 * - Checkout 이후 결제 수단 선택 단계
 * - 토스페이, 카카오페이, 네이버페이 중 선택
 * - 선택 후 PayConfirm 페이지로 이동
 *
 * 【주요 기능】
 * 1. **Payload 복구**: location.state, lastCheckout, payPayload 순으로 시도
 * 2. **결제 수단 선택**: 라디오 버튼으로 toss/kakao/naver 선택
 * 3. **요약 정보 표시**: 상품 개수, 결제 금액
 * 4. **다음 단계**: 선택한 결제 수단을 payload에 추가하고 /pay/confirm으로 이동
 *
 * 【데이터 흐름】
 * Checkout → PaySelect → PayConfirm → PayGatewayMock → OrderSuccess
 *
 * 【안전 가드】
 * - payload 또는 items가 없으면 /order/checkout으로 리다이렉트
 *
 * @component
 * @author Claude Code
 * @since 2025-11-02
 */

// src/pages/order/PaySelect.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import storage from "../../../utils/storage.js";
import "./PaySelect.css";

/**
 * formatKRW - 원화 포맷팅
 *
 * @param {number} n - 금액
 * @returns {string} "₩50,000" 형태
 */
const formatKRW = (n) => `₩${Number(n || 0).toLocaleString()}`;

/**
 * PaySelect 함수형 컴포넌트
 *
 * @description
 * 결제 수단 선택 페이지. Checkout에서 전달받은 결제 데이터를 확인하고 결제 수단을 선택합니다.
 *
 * 【처리 흐름】
 * 1. **Payload 복구**: location.state → lastCheckout → payPayload 순으로 시도
 * 2. **안전 가드**: payload/items 없으면 /order/checkout으로 리다이렉트
 * 3. **결제 수단 선택**: 사용자가 toss/kakao/naver 선택
 * 4. **다음 단계**: goConfirm() 호출 → method 추가 → /pay/confirm으로 navigate
 *
 * 【localStorage 백업】
 * - payPayload: 선택한 결제 수단 포함하여 저장 (새로고침 대비)
 *
 * @returns {JSX.Element} 결제 수단 선택 UI
 */
export default function PaySelect() {
  const navigate = useNavigate();
  const location = useLocation();
  const [method, setMethod] = useState("toss");

  // 1) 체크아웃에서 온 state 우선, 없으면 lastCheckout(백업), 마지막으로 payPayload
  const payload = useMemo(() => {
    const fromState = location.state || null;
    if (fromState && fromState.items && fromState.items.length) return fromState;
    const last = storage.get("lastCheckout", null);
    if (last && last.items && last.items.length) return last;
    const payPayload = storage.get("payPayload", null);
    return payPayload;
  }, [location.state]);

  useEffect(() => {
    if (!payload || !payload.items || payload.items.length === 0) {
      // 유효한 결제 대상 없으면 체크아웃으로 되돌림
      navigate("/order/checkout");
    }
  }, [payload, navigate]);

  if (!payload) return null;

  /**
   * goConfirm - PayConfirm 페이지로 이동
   *
   * @description
   * 선택한 결제 수단을 payload에 추가하고 localStorage에 저장한 뒤,
   * /pay/confirm으로 navigate합니다.
   */
  const goConfirm = () => {
    const next = { ...payload, method };
    storage.set("payPayload", next);
    navigate("/pay/confirm", next);
  };

  return (
    <div className="ps-wrap">
      <div className="ps-card">
        <h2 className="ps-title">결제수단 선택</h2>

        <div className="ps-methods">
          <label className={`ps-row ${method === "toss" ? "active" : ""}`}>
            <input type="radio" name="pm" value="toss" checked={method === "toss"} onChange={() => setMethod("toss")} />
            <span>토스페이</span>
          </label>
          <label className={`ps-row ${method === "kakao" ? "active" : ""}`}>
            <input type="radio" name="pm" value="kakao" checked={method === "kakao"} onChange={() => setMethod("kakao")} />
            <span>카카오페이</span>
          </label>
          <label className={`ps-row ${method === "naver" ? "active" : ""}`}>
            <input type="radio" name="pm" value="naver" checked={method === "naver"} onChange={() => setMethod("naver")} />
            <span>네이버페이</span>
          </label>
        </div>

        <div className="ps-summary">
          <div><span>상품 개수</span><b>{payload.items?.length || 0}개</b></div>
          <div><span>결제 금액</span><b>{formatKRW(payload.total)}</b></div>
        </div>

        <div className="ps-actions">
          <button type="button" className="ps-next" onClick={goConfirm}>다음으로</button>
        </div>
      </div>
    </div>
  );
}
