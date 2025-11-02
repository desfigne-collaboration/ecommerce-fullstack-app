/**
 * ============================================================================
 * PaymentMethod.jsx - 결제 수단 선택 페이지 (구버전 - 참고용)
 * ============================================================================
 *
 * 【목적】
 * - 결제 수단 선택 (토스페이, 카카오페이, 네이버페이)
 * - 선택한 결제 수단으로 게이트웨이 페이지로 이동
 * - 모의 UX: 5초 카운트다운 표시
 *
 * 【주요 기능】
 * 1. **결제 수단 선택**: 라디오 버튼 UI로 toss/kakao/naver 선택
 * 2. **안전 가드**: amount 또는 items가 없으면 /checkout으로 리다이렉트
 * 3. **카운트다운**: 5초 타이머 (모의 UX, 실제 결제와 무관)
 * 4. **게이트웨이 이동**: 선택한 결제 수단 + 결제 데이터를 state로 전달
 *
 * 【데이터 흐름】
 * Checkout → PaymentMethod → /pay/gateway (PayGatewayMock or PaymentGateway)
 *
 * 【ASSETS 구조】
 * - toss, kakao, naver 각각 label, icon, qr 경로 정의
 * - PUBLIC_URL 기준으로 아이콘 및 QR 이미지 로드
 *
 * @component
 * @author Claude Code
 * @since 2025-11-02
 */

// src/pages/order/PaymentMethod.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Payment.css";

/**
 * ASSETS - 결제 수단별 아이콘/QR 경로 설정
 *
 * @constant {Object}
 * @description 각 결제 수단의 라벨, 아이콘, QR 이미지 경로 정의
 */
const ASSETS = {
  toss: {
    label: "토스페이",
    icon: "/icons/tosspay.svg",
    qr: "/icons/qr_toss.png",
  },
  kakao: {
    label: "카카오페이",
    icon: "/icons/kakaopay.svg",
    qr: "/icons/qr_kakao.png",
  },
  naver: {
    label: "네이버페이",
    icon: "/icons/naverpay.svg",
    qr: "/icons/qr_naver.png",
  },
};

/**
 * PaymentMethod 함수형 컴포넌트
 *
 * @description
 * 결제 수단 선택 페이지. Checkout에서 전달받은 데이터를 게이트웨이로 전달합니다.
 *
 * 【처리 흐름】
 * 1. **데이터 수신**: location.state에서 amount, items, coupon 추출
 * 2. **안전 가드**: amount/items 없으면 /checkout으로 리다이렉트
 * 3. **결제 수단 선택**: 사용자가 toss/kakao/naver 선택
 * 4. **카운트다운**: 5초 타이머 (모의 UX)
 * 5. **게이트웨이 이동**: handleGo() 호출 시 /pay/gateway로 navigate
 *
 * @returns {JSX.Element} 결제 수단 선택 UI
 */
export default function PaymentMethod() {
  const navigate = useNavigate();
  const location = useLocation();
  const [method, setMethod] = useState("toss");
  const [seconds, setSeconds] = useState(5);

  // Checkout에서 넘어온 값
  const { amount = 0, items = [], coupon = null } = location.state || {};

  // 안전 가드
  useEffect(() => {
    if (!amount || !items.length) {
      // 금액/아이템이 없으면 결제 진행 불가 → 장바구니/결제로 돌려보내기
      navigate("/checkout");
    }
  }, [amount, items, navigate]);

  // (옵션) 카운트다운(모의 UX)
  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const selected = useMemo(() => ASSETS[method], [method]);

  const handleGo = () => {
    navigate("/pay/gateway", { state: {
      method,
      amount,
      items,
      coupon,
      // QR 이미지 경로는 여기서 넘겨줘도 되고, gateway에서 다시 맵핑해도 됩니다.
      qr: selected ? `${process.env.PUBLIC_URL}${selected.qr}` : "",
      label: selected?.label || "",
    }});
  };

  return (
    <div className="pay-wrap">
      <h2 className="pay-title">결제 수단 선택</h2>
      <p className="pay-sub">
        선택한 결제수단의 결제창으로 이동합니다. (모의) · 남은 시간: {seconds}초
      </p>

      <div className="pay-methods">
        {Object.entries(ASSETS).map(([key, cfg]) => (
          <label
            key={key}
            className={`pay-card ${method === key ? "active" : ""}`}
            onClick={() => setMethod(key)}
          >
            <input
              type="radio"
              name="pm"
              checked={method === key}
              onChange={() => setMethod(key)}
            />
            <img
              className="pay-icon"
              src={`${process.env.PUBLIC_URL}${cfg.icon}`}
              alt={cfg.label}
              onError={(e) => (e.currentTarget.style.visibility = "hidden")}
            />
            <span className="pay-label">{cfg.label}</span>
          </label>
        ))}
      </div>

      <div className="pay-go">
        <button className="pay-btn primary" onClick={handleGo}>
          결제창으로 이동 (모의)
        </button>
      </div>
    </div>
  );
}
