// src/pages/auth/Signup.jsx
import React, { useState } from "react";
import "../../styles/Auth.css";
import { Link, useHistory } from "react-router-dom";

export default function Signup() {
  const history = useHistory();

  const [form, setForm] = useState({
    email: "",
    password: "",
    passwordCheck: "",
    name: "",
  });

  const [notice, setNotice] = useState({ type: "", message: "" });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSignup = (e) => {
    e.preventDefault();

    if (!form.email || !form.password || !form.passwordCheck || !form.name) {
      setNotice({ type: "error", message: "모든 항목을 입력해주세요." });
      return;
    }

    if (form.password !== form.passwordCheck) {
      setNotice({ type: "error", message: "비밀번호가 일치하지 않습니다." });
      return;
    }

    // ✅ 사용자 정보 저장
    const userData = {
      id: form.email,
      name: form.name,
      password: form.password,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem("loginUser", JSON.stringify(userData));
    localStorage.setItem("isLogin", "true");

    // ✅ 신규 회원 쿠폰 지급
    const savedCoupons = JSON.parse(localStorage.getItem("coupons") || "[]");
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
      localStorage.setItem("coupons", JSON.stringify(updatedCoupons));
    }

    setNotice({ type: "success", message: "회원가입이 완료되었습니다! 🎉" });

    // 2초 뒤 메인 이동
    setTimeout(() => history.push("/mypage"), 1200);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">회원가입</h2>

        {notice.message && (
          <p className={`notice ${notice.type}`}>{notice.message}</p>
        )}

        <form onSubmit={handleSignup} className="auth-form">
          <input
            type="text"
            name="name"
            placeholder="이름"
            value={form.name}
            onChange={onChange}
          />
          <input
            type="email"
            name="email"
            placeholder="이메일 주소"
            value={form.email}
            onChange={onChange}
          />
          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            value={form.password}
            onChange={onChange}
          />
          <input
            type="password"
            name="passwordCheck"
            placeholder="비밀번호 확인"
            value={form.passwordCheck}
            onChange={onChange}
          />

          <button type="submit" className="auth-btn">
            가입하기
          </button>
        </form>

        <div className="auth-bottom">
          <p>
            이미 회원이신가요?{" "}
            <Link to="/login" className="link">
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
