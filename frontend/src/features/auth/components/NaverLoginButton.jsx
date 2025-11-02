/**
 * ============================================================================
 * NaverLoginButton.jsx - 네이버 로그인 버튼 컴포넌트
 * ============================================================================
 *
 * 【목적】
 * - 네이버 OAuth 2.0 로그인을 시작하는 버튼
 * - 네이버 LoginWithNaverId SDK를 사용하여 로그인 처리
 * - Login 페이지에서 SNS 로그인 옵션으로 사용
 *
 * 【네이버 SDK 사용 방식】
 * 1. 컴포넌트 마운트 시 SDK 초기화 (useEffect)
 * 2. SDK가 숨겨진 #naverIdLogin 요소에 진짜 로그인 버튼 렌더링
 * 3. 사용자는 커스텀 버튼(초록색)을 클릭
 * 4. 핸들러가 숨겨진 SDK 버튼을 프로그래밍 방식으로 클릭
 * 5. 네이버 로그인 페이지로 리다이렉트
 * 6. 인증 완료 후 NaverCallback.jsx로 돌아옴
 *
 * 【SDK 초기화 옵션】
 * - clientId: 네이버 애플리케이션 클라이언트 ID
 * - callbackUrl: 인증 후 돌아올 URL (NaverCallback 페이지)
 * - isPopup: false (리다이렉트 방식)
 * - loginButton: SDK가 생성할 버튼 스타일 (우리는 숨김)
 *
 * 【Fallback 처리】
 * SDK 버튼이 없거나 SDK 로드 실패 시 직접 OAuth URL로 이동
 *
 * 【환경 변수】
 * - REACT_APP_NAVER_CLIENT_ID: 네이버 앱 클라이언트 ID
 * - REACT_APP_NAVER_CALLBACK_URL: 콜백 URL
 *
 * 【UI/UX】
 * - 초록색 배경 + "N" 아이콘 (네이버 브랜드 가이드)
 * - CSS 클래스: .sns-btn.sns-naver
 *
 * @component
 * @author Claude Code
 * @since 2025-11-02
 */

import React, { useEffect } from "react";

/**
 * NaverLoginButton 함수형 컴포넌트
 *
 * @returns {JSX.Element} 네이버 로그인 버튼 UI
 */
export default function NaverLoginButton() {
  useEffect(() => {
    initNaverLogin();
  }, []);

  /**
   * initNaverLogin - 네이버 LoginWithNaverId SDK 초기화
   *
   * @description
   * 네이버 SDK를 초기화하고 숨겨진 로그인 버튼을 생성합니다.
   * window.naver 객체가 로드되어 있어야 합니다 (public/index.html에서 로드).
   */
  const initNaverLogin = () => {
    if (!window.naver) {
      console.log("네이버 SDK 아직 로드 안됨");
      return;
    }

    const naverIdLoginDiv = document.getElementById("naverIdLogin");
    if (!naverIdLoginDiv) {
      console.error("naverIdLogin 요소를 찾을 수 없음");
      return;
    }

    const naverLogin = new window.naver.LoginWithNaverId({
      clientId: process.env.REACT_APP_NAVER_CLIENT_ID,
      callbackUrl: process.env.REACT_APP_NAVER_CALLBACK_URL,
      isPopup: false,
      loginButton: { color: "green", type: 3, height: 48 }
    });

    console.log("네이버 SDK 초기화 시작");
    naverLogin.init();
    console.log("네이버 SDK 초기화 완료");
  };

  /**
   * handleNaverLogin - 네이버 로그인 시작
   *
   * @description
   * SDK가 생성한 숨겨진 버튼을 클릭하거나,
   * SDK가 없으면 직접 OAuth URL로 이동합니다.
   */
  const handleNaverLogin = () => {
    console.log("네이버 로그인 버튼 클릭됨");

    if (!window.naver) {
      alert("네이버 로그인 SDK를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    // 네이버 SDK가 생성한 로그인 버튼 클릭 트리거
    const naverLoginButton = document.getElementById("naverIdLogin_loginButton");
    console.log("네이버 SDK 버튼:", naverLoginButton);

    if (naverLoginButton) {
      console.log("SDK 버튼 클릭");
      naverLoginButton.click();
    } else {
      console.log("SDK 버튼 없음, 직접 URL 이동");
      // 버튼이 없으면 직접 네이버 로그인 페이지로 이동
      const clientId = process.env.REACT_APP_NAVER_CLIENT_ID;
      const callbackUrl = encodeURIComponent(process.env.REACT_APP_NAVER_CALLBACK_URL);
      const state = Math.random().toString(36).substr(2, 11);
      const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=token&client_id=${clientId}&redirect_uri=${callbackUrl}&state=${state}`;
      console.log("이동할 URL:", naverAuthUrl);
      window.location.href = naverAuthUrl;
    }
  };

  return (
    <>
      {/* 네이버 SDK가 로그인 버튼을 렌더링할 컨테이너 */}
      <div id="naverIdLogin" style={{ display: "none" }}></div>

      {/* 실제 사용자에게 보이는 커스텀 버튼 */}
      <button type="button" className="sns-btn sns-naver" onClick={handleNaverLogin}>
        <div className="sns-icon-box">
          <span className="sns-icon">N</span>
        </div>
        <span className="sns-text">네이버 로그인</span>
      </button>
    </>
  );
}
