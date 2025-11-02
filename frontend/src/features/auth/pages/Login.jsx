/**
 * ============================================================================
 * Login.jsx - 로그인 페이지 컴포넌트
 * ============================================================================
 *
 * 【목적】
 * - 사용자 로그인 UI 제공 (회원/비회원 구분)
 * - 일반 로그인 + SNS 로그인 (Naver, Kakao) 지원
 * - 아이디 저장, 비밀번호 표시/숨김 기능 제공
 * - 회원가입 직후 아이디 자동 입력 (prefill) 기능
 *
 * 【주요 기능】
 * 1. **탭 네비게이션**: 회원 로그인 / 비회원 주문조회 구분
 * 2. **폼 상태 관리**: useState + useRef 조합 (유효성 검증용)
 * 3. **자동 로그인**: 체크박스로 아이디 localStorage 저장
 * 4. **비밀번호 토글**: 눈 아이콘 클릭으로 비밀번호 표시/숨김
 * 5. **Prefill 기능**: 회원가입 후 location.state로 아이디 자동 입력
 * 6. **SNS 로그인**: Kakao, Naver 로그인 버튼 컴포넌트 통합
 * 7. **계정 복구**: 아이디 찾기, 비밀번호 찾기 링크
 *
 * 【라우팅】
 * - 경로: /login
 * - 로그인 성공 시 → "/" (메인 페이지)
 * - 회원가입 링크 → "/signup"
 * - 아이디/비밀번호 찾기 → "/find-id", "/find-password"
 *
 * 【상태 흐름】
 * 1. 컴포넌트 마운트 → useEffect로 prefill 데이터 확인
 * 2. 폼 입력 → onChange로 form 상태 업데이트
 * 3. 로그인 버튼 클릭 → onSubmit → getLogin API 호출
 * 4. 로그인 성공 → Redux 상태 업데이트 → 메인 페이지 이동
 *
 * @component
 * @author Claude Code
 * @since 2025-11-02
 */

import "../../../styles/Auth.css";
import { useState, useRef, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getLogin } from '../api/authAPI.js';
import storage from "../../../utils/storage.js";
import NaverLoginButton from "../components/NaverLoginButton";
import KakaoLoginButton from "../components/KakaoLoginButton";

/**
 * Login 함수형 컴포넌트
 *
 * @returns {JSX.Element} 로그인 페이지 UI
 */
export default function Login() {

  // ============================================================================
  // Hooks & State
  // ============================================================================

  /**
   * location - React Router의 현재 위치 정보
   *
   * @description
   * 회원가입 후 navigate("/login", { state: { prefill: { id: "newuser" } } })
   * 형태로 전달된 데이터를 받아옵니다.
   */
  const location = useLocation();

  /** navigate - 페이지 이동 함수 */
  const navigate = useNavigate();

  /** dispatch - Redux 액션 디스패치 함수 */
  const dispatch = useDispatch();

  /** activeTab - 현재 활성 탭 ("member" | "non-member") */
  const [activeTab, setActiveTab] = useState("member");

  /** rememberMe - 자동 로그인 체크박스 상태 */
  const [rememberMe, setRememberMe] = useState(false);

  /** showPassword - 비밀번호 표시/숨김 토글 상태 */
  const [showPassword, setShowPassword] = useState(false);

  /** idRef - 아이디 입력 필드 ref (포커스 제어용) */
  const idRef = useRef(null);

  /** passwordRef - 비밀번호 입력 필드 ref (유효성 검증용) */
  const passwordRef = useRef(null);

  /** form - 로그인 폼 데이터 { id, password } */
  const [form, setForm] = useState({ id: "", password: "" });

  // ============================================================================
  // useEffect: 초기 데이터 로드 (prefill, 저장된 아이디)
  // ============================================================================
  /**
   * 컴포넌트 마운트 시 실행되는 초기화 로직
   *
   * @description
   * 두 가지 자동 입력 시나리오를 처리합니다:
   *
   * 1. **Prefill (회원가입 후 아이디 자동 입력)**
   *    - 우선순위 1: location.state.prefill (navigate로 전달된 데이터)
   *    - 우선순위 2: localStorage의 prefillLogin (새로고침 대비)
   *    - 회원가입 완료 후 로그인 페이지로 이동 시 아이디가 미리 입력됨
   *
   * 2. **자동 로그인 (저장된 아이디 불러오기)**
   *    - localStorage에 savedLoginId가 있으면 자동으로 아이디 입력
   *    - rememberMe 체크박스도 자동으로 체크 상태로 설정
   *
   * @listens location.state - 라우터 네비게이션 시 전달된 state 변경 감지
   */
  useEffect(() => {
    // ========================================
    // 1. Prefill 데이터 확인 (회원가입 후)
    // ========================================
    // location.state로 전달된 prefill 데이터 (예: { prefill: { id: "newuser" } })
    const statePrefill = location?.state?.prefill;

    // localStorage에 저장된 prefill 데이터 (새로고침 대비)
    const lsPrefill = (() => {
      try {
        return storage.get("prefillLogin", null);
      } catch {
        return null; // JSON 파싱 오류 시 null 반환
      }
    })();

    // 우선순위: state > localStorage
    const prefill = statePrefill || lsPrefill;
    if (prefill?.id) {
      // 아이디 필드만 자동 입력 (비밀번호는 보안상 입력하지 않음)
      setForm(p => ({ ...p, id: prefill.id }));
    }

    // localStorage의 prefill 데이터는 한 번 사용 후 삭제
    if (lsPrefill) storage.remove("prefillLogin");

    // ========================================
    // 2. 저장된 아이디 불러오기 (자동 로그인)
    // ========================================
    const savedId = storage.get("savedLoginId", null);
    if (savedId) {
      setForm(p => ({ ...p, id: savedId }));
      setRememberMe(true); // 체크박스도 자동 체크
    }
  }, [location?.state]); // location.state 변경 시에만 재실행

  // ============================================================================
  // Event Handlers
  // ============================================================================

  /**
   * onChange - 폼 입력 핸들러
   *
   * @description
   * 아이디/비밀번호 입력 시 form 상태를 실시간으로 업데이트합니다.
   * Controlled Component 패턴 사용.
   *
   * @param {Event} e - 입력 이벤트
   *
   * @example
   * <input name="id" value={form.id} onChange={onChange} />
   * // 사용자가 "test" 입력 → form.id = "test"로 업데이트
   */
  const onChange = e => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
  };

  /**
   * onSubmit - 로그인 폼 제출 핸들러
   *
   * @description
   * 로그인 버튼 클릭 시 실행됩니다.
   * authAPI.getLogin()을 호출하여 서버 인증을 처리합니다.
   *
   * 【처리 흐름】
   * 1. 폼 기본 동작 방지 (페이지 리로드 방지)
   * 2. getLogin API 호출 (Redux Thunk)
   * 3. 성공 시: 메인 페이지("/")로 이동
   * 4. 실패 시: 폼 초기화 + 아이디 필드에 포커스
   *
   * 【자동 로그인 처리】
   * TODO: 현재는 rememberMe 체크박스가 로직에 연결되어 있지 않음
   * 향후 로그인 성공 시 savedLoginId 저장 로직 추가 필요
   *
   * @async
   * @param {Event} e - 폼 제출 이벤트
   *
   * @example
   * // 테스트 계정으로 로그인
   * // ID: admin, Password: 1234 입력 후 제출
   * // → 로그인 성공 → "/" 페이지로 이동
   */
  const onSubmit = async (e) => {
    e.preventDefault(); // 폼 기본 제출 동작 방지

    // 유효성 검증을 위한 ref 객체 전달
    const param = {
      idRef: idRef,
      passwordRef: passwordRef
    }

    // Redux Thunk: 로그인 API 호출 + Redux 상태 업데이트
    const success = await dispatch(getLogin(form, param));

    if (success) {
      // ========================================
      // 로그인 성공
      // ========================================
      alert("로그인에 성공하였습니다.");

      // 관리자 계정인 경우 대시보드로 리다이렉트
      if (form.id === "admin") {
        navigate("/admin");
      } else {
        // 일반 사용자는 메인 페이지로 이동
        navigate("/");
      }

    } else {
      // ========================================
      // 로그인 실패 (유효성 검증 실패 or 서버 인증 실패)
      // ========================================
      alert("로그인에 실패, 확인 후 다시 진행해주세요.");

      // 폼 초기화 (비밀번호 보안상 제거)
      setForm({ id: '', password: '' });

      // 아이디 입력 필드에 포커스 (재입력 유도)
      idRef.current.focus();
    }
  }


  // 사용하지 않는 함수 - 주석 처리
  /*
  const onSubmit2 = e => {
    e.preventDefault();
    const res = loginApi({ email: form.id.trim(), password: form.password });

    if (!res?.ok) {
      alert(res?.message || "로그인에 실패했습니다.");
      return;
    }

    // 아이디 저장 처리
    if (rememberMe) {
      storage.set("savedLoginId", form.id.trim());
    } else {
      storage.remove("savedLoginId");
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

    // Redux login action 사용
    const userWithRole = {
      ...user,
      role: user.role || res.role || "user"
    };

    dispatch(loginAction(userWithRole));

    alert("로그인 성공!");

    if ((user.role || res.role) === "admin") {
      navigate("/mypage", { replace: true, state: { activeTab: "admin-users" } });
    } else {
      navigate("/", { replace: true });
    }
  };
  */

  // ============================================================================
  // JSX Render
  // ============================================================================
  /**
   * 【UI 구조】
   * ┌─────────────────────────────────────┐
   * │ 로그인                              │ ← 타이틀
   * ├─────────────────────────────────────┤
   * │ [회원] [비회원(주문조회)]           │ ← 탭 네비게이션
   * ├─────────────────────────────────────┤
   * │ 이메일: [___________]               │
   * │ 비밀번호: [___________] [👁]        │ ← 비밀번호 토글
   * │                    [로그인]         │
   * │ ☐ 자동 로그인                       │
   * ├─────────────────────────────────────┤
   * │ 아이디찾기 | 비밀번호찾기 | 회원가입│ ← 링크 박스
   * ├─────────────────────────────────────┤
   * │ SNS 계정으로 로그인                 │
   * │ [Kakao] [Naver]                     │ ← SNS 버튼
   * ├─────────────────────────────────────┤
   * │ [비회원 주문 조회]                  │ ← 모바일 전용
   * └─────────────────────────────────────┘
   */
  return (
    <div className="auth-container">
      <div className="auth-box">
        {/* 페이지 제목 */}
        <h1 className="auth-title">로그인</h1>

        {/* ==================== 탭 네비게이션 ==================== */}
        {/*
          회원 로그인 / 비회원 주문조회 구분
          현재는 activeTab 상태만 변경 (실제 UI 분기 없음)
          TODO: 비회원 주문조회 UI 구현 필요
        */}
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

        {/* ==================== 로그인 폼 ==================== */}
        <form className="auth-form" onSubmit={onSubmit}>
          <div className="login-form-layout">
            {/* 입력 필드 섹션 */}
            <div className="login-inputs-section">
              {/* 이메일/아이디 입력 */}
              <input
                type="text"
                name="id"
                placeholder="이메일"
                value={form.id}             // Controlled Component
                ref={idRef}                 // 유효성 검증 & 포커스 제어용
                onChange={onChange}
                required
              />

              {/* 비밀번호 입력 + 표시/숨김 토글 */}
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}  // 동적 타입 변경
                  name="password"
                  placeholder="비밀번호"
                  value={form.password}
                  ref={passwordRef}         // 유효성 검증용
                  onChange={onChange}
                  required
                />
                {/* 비밀번호 표시/숨김 토글 버튼 */}
                <button
                  type="button"             // submit 방지
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                >
                  {/* 눈 아이콘 SVG (showPassword 상태에 따라 변경) */}
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    {showPassword ? (
                      // 눈 뜬 아이콘 (비밀번호 보이는 상태)
                      <>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </>
                    ) : (
                      // 눈 감긴 아이콘 (비밀번호 숨김 상태)
                      <>
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </>
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {/* 로그인 버튼 섹션 */}
            <div className="login-button-section">
              <button type="submit" className="auth-submit">
                로그인
              </button>
            </div>
          </div>

          {/* ==================== 자동 로그인 체크박스 ==================== */}
          {/*
            TODO: 현재 UI만 있고 실제 로직 미연결
            로그인 성공 시 savedLoginId 저장하는 코드 추가 필요
          */}
          <div className="remember-me-section">
            <label className="remember-me-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>자동 로그인</span>
            </label>
          </div>
        </form>

        {/* ==================== 계정 관리 링크 박스 ==================== */}
        {/* 회색 배경의 링크 모음 (아이디 찾기, 비밀번호 찾기, 회원가입) */}
        <div className="auth-links-box">
          <Link to="/find-id">아이디 찾기</Link>
          <Link to="/find-password">비밀번호 찾기</Link>
          <Link to="/signup">회원가입</Link>
        </div>

        {/* ==================== SNS 로그인 섹션 ==================== */}
        {/* 구분선 + 안내 문구 */}
        <div className="sns-login-divider">
          <span>SNS 계정으로 로그인</span>
        </div>

        {/* SNS 로그인 버튼 그룹 */}
        <div className="sns-login">
          {/* Kakao, Naver OAuth 로그인 버튼 컴포넌트 */}
          <KakaoLoginButton />
          <NaverLoginButton />
        </div>

        {/* ==================== 비회원 주문 조회 버튼 ==================== */}
        {/*
          모바일에서만 표시되는 버튼 (CSS media query)
          데스크톱에서는 상단 탭으로 처리
        */}
        <button
          type="button"
          className="non-member-order-btn"
          onClick={() => navigate('/orders/guest')}
        >
          비회원 주문 조회
        </button>
      </div>
    </div>
  );
}
