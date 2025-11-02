/**
 * ============================================================================
 * MyCoupons.jsx - 내 쿠폰함 페이지
 * ============================================================================
 *
 * 【목적】
 * - 사용자 보유 쿠폰 목록 표시
 * - 쿠폰 상세 정보 (할인 금액, 최소 구매 금액, 유효 기간)
 * - 사용 완료된 쿠폰 표시
 *
 * 【주요 기능】
 * 1. **쿠폰 목록 로드**: localStorage에서 coupons 배열 읽기
 * 2. **기본 쿠폰 지급**: 쿠폰이 없으면 신규가입 쿠폰 자동 생성
 * 3. **쿠폰 정보 표시**: 이름, 할인 금액, 최소 구매 조건, 유효 기간
 * 4. **사용 완료 표시**: used 플래그에 따라 "사용완료" 마크 표시
 *
 * 【쿠폰 데이터 구조】
 * ```javascript
 * {
 *   id: 1,
 *   name: "신규가입 10,000원 할인쿠폰",
 *   discount: 10000,
 *   minPurchase: 50000,
 *   validUntil: "2025-12-31",
 *   used: false
 * }
 * ```
 *
 * 【기본 쿠폰】
 * - 신규가입 시 10,000원 할인 쿠폰 자동 지급
 * - 최소 구매 금액: 50,000원
 * - 유효 기간: 2025-12-31
 *
 * @component
 * @author Claude Code
 * @since 2025-11-02
 */

// src/pages/mypage/MyCoupons.jsx
import React, { useEffect, useState } from "react";
import storage from "../../../utils/storage.js";
import "../../../styles/MyCoupons.css";

/**
 * MyCoupons 함수형 컴포넌트
 *
 * @description
 * 사용자 보유 쿠폰 목록을 표시하는 페이지.
 * 쿠폰이 없으면 기본 신규가입 쿠폰을 자동 생성합니다.
 *
 * 【처리 흐름】
 * 1. **쿠폰 로드**: localStorage에서 coupons 읽기
 * 2. **기본 쿠폰 생성**: 쿠폰이 없으면 신규가입 쿠폰 생성 후 저장
 * 3. **렌더링**: 쿠폰 카드 리스트 표시
 * 4. **사용 완료 표시**: used === true인 쿠폰은 회색 처리 + "사용완료" 마크
 *
 * @returns {JSX.Element} 쿠폰함 페이지 UI
 */
export default function MyCoupons() {
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    const saved = storage.get("coupons", []);
    if (saved.length === 0) {
      // 기본 회원가입 쿠폰 지급
      const signupCoupon = {
        id: 1,
        name: "신규가입 10,000원 할인쿠폰",
        discount: 10000,
        minPurchase: 50000,
        validUntil: "2025-12-31",
        used: false,
      };
      storage.set("coupons", [signupCoupon]);
      setCoupons([signupCoupon]);
    } else {
      setCoupons(saved);
    }
  }, []);

  return (
    <div className="coupon-wrapper">
      <div className="coupon-container">
        <h2>내 쿠폰함</h2>
        {coupons.length === 0 ? (
          <p className="empty-text">보유 중인 쿠폰이 없습니다.</p>
        ) : (
          <div className="coupon-list">
            {coupons.map((c) => (
              <div key={c.id} className={`coupon-card ${c.used ? "used" : ""}`}>
                <div className="coupon-left">
                  <h3>{c.name}</h3>
                  <p>
                    <b>{c.discount.toLocaleString()}원</b> 할인<br />
                    {c.minPurchase
                      ? `₩${c.minPurchase.toLocaleString()} 이상 구매 시`
                      : "제한 없음"}
                  </p>
                </div>
                <div className="coupon-right">
                  <p>유효기간</p>
                  <span>{c.validUntil}</span>
                  {c.used && <span className="used-mark">사용완료</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
