// src/pages/mypage/MyCoupons.jsx
import React, { useEffect, useState } from "react";
import storage from "../../utils/storage.js";
import "../../styles/MyCoupons.css";

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
