// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

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
    try {
      const saved = localStorage.getItem("loginUser");
      if (saved) {
        setUser(JSON.parse(saved));
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setReady(true);
    }
  }, []);

  // ✅ 로그인 함수 (Login 페이지에서 호출)
  const login = (userInfo) => {
    setUser(userInfo);
    localStorage.setItem("loginUser", JSON.stringify(userInfo));
    localStorage.setItem("isLogin", "true");
  };

  // ✅ 로그아웃 함수 (Header 등에서 호출)
  const logout = () => {
    setUser(null);
    localStorage.removeItem("loginUser");
    localStorage.setItem("isLogin", "false");
  };

  return (
    <AuthContext.Provider value={{ user, ready, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
