import React, { useState, useEffect } from "react";
import "../../styles/Auth.css";
import { Link, useLocation, useHistory } from "react-router-dom";
import { loginApi } from "../../api/auth";
import NaverLoginButton from "../../components/auth/NaverLoginButton";
import KakaoLoginButton from "../../components/auth/KakaoLoginButton";

export default function Login() {
  const location = useLocation();
  const history = useHistory();
  const [form, setForm] = useState({ id: "", pass: "" });
  const [activeTab, setActiveTab] = useState("member");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const statePrefill = location?.state?.prefill;
    const lsPrefill = (() => {
      try {
        return JSON.parse(localStorage.getItem("prefillLogin"));
      } catch {
        return null;
      }
    })();

    const prefill = statePrefill || lsPrefill;
    if (prefill?.id) setForm(p => ({ ...p, id: prefill.id }));
    if (lsPrefill) localStorage.removeItem("prefillLogin");

    // 저장된 아이디 불러오기
    const savedId = localStorage.getItem("savedLoginId");
    if (savedId) {
      setForm(p => ({ ...p, id: savedId }));
      setRememberMe(true);
    }
  }, [location?.state]);

  const onChange = e => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
  };

  const onSubmit = e => {
    e.preventDefault();
    const res = loginApi({ email: form.id.trim(), password: form.pass });

    if (!res?.ok) {
      alert(res?.message || "로그인에 실패했습니다.");
      return;
    }

    // 아이디 저장 처리
    if (rememberMe) {
      localStorage.setItem("savedLoginId", form.id.trim());
    } else {
      localStorage.removeItem("savedLoginId");
    }

    const fallbackName = form.id.includes("@")
      ? form.id.split("@")[0]
      : form.id;

    const user =
      res.user && typeof res.user === "object"
        ? res.user
        : {
            email: form.id.trim(),
            name: res.name || fallbackName,
            role: res.role || "user"
          };

    try {
      localStorage.setItem("isLogin", "true");
      localStorage.setItem(
        "loginUser",
        JSON.stringify({
          ...user,
          role: user.role || res.role || "user"
        })
      );
    } catch {}

    try {
      window.dispatchEvent(new Event("auth:changed"));
    } catch {}

    alert("로그인 성공!");

    if ((user.role || res.role) === "admin") {
      history.replace({ pathname: "/mypage", state: { activeTab: "admin-users" } });
    } else {
      history.replace("/");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="auth-title">로그인</h1>

        {/* 탭 네비게이션 */}
        <div className="login-tabs">
          <button
            className={`tab-button ${activeTab === "member" ? "active" : ""}`}
            onClick={() => setActiveTab("member")}
          >
            회원
          </button>
          <button
            className={`tab-button ${activeTab === "non-member" ? "active" : ""}`}
            onClick={() => setActiveTab("non-member")}
          >
            비회원 (주문조회)
          </button>
        </div>

        <form className="auth-form" onSubmit={onSubmit}>
          <input
            type="text"
            name="id"
            placeholder="이메일"
            value={form.id}
            onChange={onChange}
            required
          />

          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="pass"
              placeholder="비밀번호"
              value={form.pass}
              onChange={onChange}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              👁
            </button>
          </div>

          <div className="remember-me-section">
            <label className="remember-me-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>아이디 저장</span>
            </label>
          </div>

          <button type="submit" className="auth-submit">
            로그인
          </button>
        </form>

        {/* 링크 섹션 */}
        <div className="auth-links-section">
          <Link to="/find-id">아이디 찾기</Link>
          <span className="divider">|</span>
          <Link to="/find-password">비밀번호 찾기</Link>
          <span className="divider">|</span>
          <Link to="/signup">회원가입</Link>
        </div>

        {/* SNS 로그인 섹션 */}
        <div className="sns-login-divider">
          <span>SNS 계정으로 로그인</span>
        </div>

        <div className="sns-login">
          <KakaoLoginButton />
          <NaverLoginButton />
        </div>
      </div>
    </div>
  );
}
