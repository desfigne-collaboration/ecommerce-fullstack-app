// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import storage from "../utils/storage.js";

/**
 * 로그인 상태 유지 전략
 * - 로그인 성공 시: localStorage("loginUser")에 사용자 객체 저장, "isLogin" = "true"
 * - 앱 시작/새로고침 시: localStorage에서 복원
 * - 로그아웃: localStorage 정리
 */
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);      // { id, name, email, ... } 형태 가정
  const [ready, setReady] = useState(false);   // 복원 완료 여부 (깜박임 방지용)

  // ✅ 앱 시작/새로고침 시 로그인 사용자 복원
  useEffect(() => {
    const saved = storage.get("loginUser");
    setUser(saved);
    setReady(true);
  }, []);

  // ✅ 신규 회원 웰컴 쿠폰 발급 (중복 방지)
  const issueWelcomeCouponIfNeeded = () => {
    const savedCoupons = storage.get("coupons", []);
    const hasWelcomeCoupon = savedCoupons.some((c) => c.id === "welcome-10000");

    if (!hasWelcomeCoupon) {
      const newCoupon = {
        id: "welcome-10000",
        name: "신규가입 1만원 할인 쿠폰",
        amount: 10000,
        type: "fixed",
        discount: "₩10,000",
        used: false,
        createdAt: new Date().toISOString(),
      };

      const updatedCoupons = [...savedCoupons, newCoupon];
      storage.set("coupons", updatedCoupons);
    }
  };

  // ✅ 로그인 함수
  const login = (userData) => {
    setUser(userData);
    storage.set("loginUser", userData);
    storage.set("isLogin", true);
  };

  // ✅ 로그아웃 함수
  const logout = () => {
    setUser(null);
    storage.remove("loginUser");
    storage.set("isLogin", false);
    storage.remove("auth");
  };

  return (
    <AuthContext.Provider value={{
      user,
      ready,
      login,
      logout,
      issueWelcomeCouponIfNeeded
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
