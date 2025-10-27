// src/pages/auth/Signup.jsx
import React, { useState } from "react";
import "../../styles/Auth.css";
import { Link, useNavigate } from "react-router-dom";
import { signupApi } from "../../api/auth";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    passwordCheck: "",
    phone: "",
  });

  const [notice, setNotice] = useState({ type: "", message: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordCheck, setShowPasswordCheck] = useState(false);

  // 약관 동의
  const [agreements, setAgreements] = useState({
    termsOfService: false,
    privacyPolicy: false,
    ageOver14: false,
    marketingEmail: false,
    marketingSms: false,
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleAgreementChange = (e) => {
    const { name, checked } = e.target;
    setAgreements((p) => ({ ...p, [name]: checked }));
  };

  const handleAllAgree = (e) => {
    const checked = e.target.checked;
    setAgreements({
      termsOfService: checked,
      privacyPolicy: checked,
      ageOver14: checked,
      marketingEmail: checked,
      marketingSms: checked,
    });
  };

  const allRequiredAgreed = agreements.termsOfService && agreements.privacyPolicy && agreements.ageOver14;

  const handleSignup = (e) => {
    e.preventDefault();

    // 필수 입력 검사
    if (!form.name || !form.email || !form.password || !form.passwordCheck) {
      setNotice({ type: "error", message: "모든 필수 항목을 입력해주세요." });
      return;
    }

    // 이름 검사
    if (form.name.trim().length < 2) {
      setNotice({ type: "error", message: "이름은 최소 2자 이상이어야 합니다." });
      return;
    }

    // 이메일 형식 검사
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(form.email)) {
      setNotice({ type: "error", message: "올바른 이메일 형식이 아닙니다." });
      return;
    }

    // 비밀번호 길이 검사
    if (form.password.length < 4) {
      setNotice({ type: "error", message: "비밀번호는 최소 4자 이상이어야 합니다." });
      return;
    }

    // 비밀번호 일치 확인
    if (form.password !== form.passwordCheck) {
      setNotice({ type: "error", message: "비밀번호가 일치하지 않습니다." });
      return;
    }

    // 전화번호 검사 (선택사항이지만 입력했으면 검사)
    if (form.phone && !/^[0-9]{10,11}$/.test(form.phone.replace(/-/g, ""))) {
      setNotice({ type: "error", message: "올바른 전화번호 형식이 아닙니다. (10-11자리 숫자)" });
      return;
    }

    // 필수 약관 동의 확인
    if (!allRequiredAgreed) {
      setNotice({ type: "error", message: "필수 약관에 모두 동의해주세요." });
      return;
    }

    // ✅ signupApi 호출
    const result = signupApi({
      email: form.email,
      password: form.password,
      name: form.name,
      phone: form.phone,
    });

    if (!result.ok) {
      setNotice({ type: "error", message: result.message });
      return;
    }

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

    setNotice({ type: "success", message: "회원가입이 완료되었습니다! 🎉 로그인해주세요." });

    // 회원가입 성공 후 로그인 페이지로 이동 (이메일 미리 채우기)
    setTimeout(() => {
      navigate("/login", { state: { prefill: { id: form.email } } });
    }, 1500);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="auth-title">회원가입</h1>

        {notice.message && (
          <div style={{
            padding: "12px 16px",
            marginBottom: "20px",
            borderRadius: "4px",
            backgroundColor: notice.type === "error" ? "#fee" : "#efe",
            color: notice.type === "error" ? "#c33" : "#393",
            fontSize: "14px",
            textAlign: "center"
          }}>
            {notice.message}
          </div>
        )}

        <form onSubmit={handleSignup} className="auth-form">
          {/* 이름 */}
          <input
            type="text"
            name="name"
            placeholder="이름 *"
            value={form.name}
            onChange={onChange}
            required
          />

          {/* 이메일 */}
          <input
            type="email"
            name="email"
            placeholder="이메일 주소 *"
            value={form.email}
            onChange={onChange}
            required
          />

          {/* 전화번호 (선택) */}
          <input
            type="tel"
            name="phone"
            placeholder="전화번호 (선택) - 숫자만 입력"
            value={form.phone}
            onChange={onChange}
          />

          {/* 비밀번호 */}
          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="비밀번호 (최소 4자) *"
              value={form.password}
              onChange={onChange}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="비밀번호 표시/숨김"
            >
              {showPassword ? "👁" : "👁‍🗨"}
            </button>
          </div>

          {/* 비밀번호 확인 */}
          <div className="password-input-wrapper">
            <input
              type={showPasswordCheck ? "text" : "password"}
              name="passwordCheck"
              placeholder="비밀번호 확인 *"
              value={form.passwordCheck}
              onChange={onChange}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPasswordCheck(!showPasswordCheck)}
              aria-label="비밀번호 확인 표시/숨김"
            >
              {showPasswordCheck ? "👁" : "👁‍🗨"}
            </button>
          </div>

          {/* 약관 동의 */}
          <div className="agree-section">
            <div className="agree-item" style={{ backgroundColor: "#f9f9f9" }}>
              <label>
                <input
                  type="checkbox"
                  checked={
                    agreements.termsOfService &&
                    agreements.privacyPolicy &&
                    agreements.ageOver14 &&
                    agreements.marketingEmail &&
                    agreements.marketingSms
                  }
                  onChange={handleAllAgree}
                />
                <strong>전체 동의</strong>
              </label>
            </div>

            <div className="agree-item">
              <label>
                <input
                  type="checkbox"
                  name="termsOfService"
                  checked={agreements.termsOfService}
                  onChange={handleAgreementChange}
                />
                <span className="req">[필수]</span> 이용약관 동의
              </label>
              <button
                type="button"
                className="doc-link--text"
                onClick={() => navigate("/terms")}
              >
                보기
              </button>
            </div>

            <div className="agree-item">
              <label>
                <input
                  type="checkbox"
                  name="privacyPolicy"
                  checked={agreements.privacyPolicy}
                  onChange={handleAgreementChange}
                />
                <span className="req">[필수]</span> 개인정보 처리방침 동의
              </label>
              <button
                type="button"
                className="doc-link--text"
                onClick={() => navigate("/privacy")}
              >
                보기
              </button>
            </div>

            <div className="agree-item">
              <label>
                <input
                  type="checkbox"
                  name="ageOver14"
                  checked={agreements.ageOver14}
                  onChange={handleAgreementChange}
                />
                <span className="req">[필수]</span> 만 14세 이상입니다
              </label>
            </div>

            <div className="agree-marketing">
              <div className="agree-title-row">
                <label>
                  <input
                    type="checkbox"
                    checked={agreements.marketingEmail && agreements.marketingSms}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setAgreements((p) => ({
                        ...p,
                        marketingEmail: checked,
                        marketingSms: checked,
                      }));
                    }}
                  />
                  [선택] 마케팅 정보 수신 동의
                </label>
              </div>
              <div className="agree-marketing-options">
                <label>
                  <input
                    type="checkbox"
                    name="marketingEmail"
                    checked={agreements.marketingEmail}
                    onChange={handleAgreementChange}
                  />
                  이메일
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="marketingSms"
                    checked={agreements.marketingSms}
                    onChange={handleAgreementChange}
                  />
                  SMS
                </label>
              </div>
            </div>
          </div>

          <button type="submit" className="auth-submit">
            가입하기
          </button>
        </form>

        <div className="auth-links">
          <p>
            이미 회원이신가요?{" "}
            <Link to="/login">로그인</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
