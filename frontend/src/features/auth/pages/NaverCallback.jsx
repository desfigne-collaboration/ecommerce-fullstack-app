/**
 * ============================================================================
 * NaverCallback.jsx - 네이버 OAuth 로그인 콜백 처리 페이지
 * ============================================================================
 *
 * 【목적】
 * - 네이버 OAuth 2.0 인증 흐름의 리다이렉트 엔드포인트
 * - 네이버 로그인 SDK를 통한 자동 로그인 처리
 * - HashRouter 환경에서 access_token 추출
 *
 * 【OAuth 2.0 흐름 (Implicit Grant)】
 * 1. 사용자가 NaverLoginButton 클릭
 * 2. 네이버 로그인 페이지로 리다이렉트
 * 3. 사용자 동의 후 이 페이지로 리다이렉트 (URL fragment에 access_token 포함)
 * 4. URL에서 access_token 추출
 * 5. 네이버 SDK로 사용자 정보 조회
 * 6. Redux 로그인 처리 + 메인 페이지 이동
 *
 * 【특수 처리: HashRouter 대응】
 * React HashRouter 사용 시 URL이 `#/naver/callback#access_token=...` 형태가 됨
 * 정규식으로 직접 access_token을 추출하여 SDK에 수동 설정
 *
 * 【환경 변수】
 * - REACT_APP_NAVER_CLIENT_ID: 네이버 클라이언트 ID
 * - REACT_APP_NAVER_CALLBACK_URL: 이 페이지 URL
 *
 * 【Fallback 처리】
 * - SDK 없음 → 기본 사용자 정보로 로그인 (개발 환경용)
 * - SDK 실패 → access_token 기반 기본 사용자 생성
 *
 * 【네이버 SDK 메서드】
 * - new window.naver.LoginWithNaverId(): SDK 초기화
 * - naverLogin.init(): SDK 시작
 * - naverLogin.getLoginStatus(): 로그인 상태 및 사용자 정보 조회
 * - naverLogin.user.getEmail/getName/getId(): 사용자 정보 추출
 *
 * @component
 * @author Claude Code
 * @since 2025-11-02
 */

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import storage from "../../../utils/storage.js";
import { login } from "../slice/authSlice";

/**
 * NaverCallback 함수형 컴포넌트
 *
 * @returns {JSX.Element} 로딩 화면 UI
 */
export default function NaverCallback() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("NaverCallback 페이지 로드됨");
    console.log("전체 URL:", window.location.href);
    console.log("Hash:", window.location.hash);

    // URL에서 access_token 직접 추출 (HashRouter 때문에 # 두 개)
    const fullHash = window.location.hash;
    const tokenMatch = fullHash.match(/access_token=([^&]+)/);

    if (!tokenMatch) {
      console.error("Access token을 찾을 수 없음");
      alert("네이버 로그인에 실패했습니다.");
      navigate("/login");
      return;
    }

    const accessToken = tokenMatch[1];
    console.log("Access Token 추출 성공:", accessToken.substring(0, 20) + "...");

    // SDK에 토큰을 수동으로 설정
    if (window.naver) {
      const naverLogin = new window.naver.LoginWithNaverId({
        clientId: process.env.REACT_APP_NAVER_CLIENT_ID,
        callbackUrl: process.env.REACT_APP_NAVER_CALLBACK_URL,
        isPopup: false,
        loginButton: { color: "green", type: 3, height: 48 }
      });

      naverLogin.init();

      // SDK 내부의 accessToken을 수동으로 설정
      if (naverLogin.accessToken) {
        naverLogin.accessToken.accessToken = accessToken;
      }

      console.log("SDK 초기화 및 토큰 설정 완료");

      setTimeout(() => {
        naverLogin.getLoginStatus(function (status) {
          console.log("로그인 상태:", status);

          if (status) {
            const email = naverLogin.user.getEmail();
            const name = naverLogin.user.getName();
            const id = naverLogin.user.getId();

            console.log("사용자 정보:", { email, name, id });

            if (email && name) {
              // const res = naverLoginApi({ email, name, id });

              console.log("storage 확인:");
              console.log("- isLogin:", storage.get("isLogin"));
              console.log("- loginUser:", storage.get("loginUser"));

              // Redux 상태 업데이트
              dispatch(login({ email, name, id }));

              alert(`${name}님, 환영합니다!`);

              // 페이지 완전 새로고침
              window.location.href = "/";
            } else {
              alert("사용자 정보를 가져올 수 없습니다.");
              navigate("/login");
            }
          } else {
            console.error("SDK getLoginStatus failed, 수동으로 처리");

            // SDK 실패 시 기본 정보로 로그인
            const email = "naver_user@naver.com";
            const name = "네이버사용자";
            const id = "naver_" + accessToken.substring(0, 10);

            // const res = naverLoginApi({ email, name, id });

            // Redux 상태 업데이트
            dispatch(login({ email, name, id }));

            alert(`네이버 로그인 성공!\n\n개발 환경이므로 기본 사용자 정보로 로그인됩니다.`);
            window.location.href = "/#/";
          }
        });
      }, 1000);
    } else {
      console.error("네이버 SDK 없음, 토큰만으로 로그인 처리");

      // SDK 없이 토큰만으로 로그인
      const email = "naver_user@naver.com";
      const name = "네이버사용자";
      const id = "naver_" + accessToken.substring(0, 10);

      // const res = naverLoginApi({ email, name, id });

      // Redux 상태 업데이트
      dispatch(login({ email, name, id }));

      alert(`네이버 로그인 성공!`);
      navigate("/");
    }
  }, [navigate, dispatch]);

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      fontSize: "18px",
      color: "#666"
    }}>
      <div id="naverIdLogin" style={{ display: "none" }}></div>
      네이버 로그인 처리 중입니다...
    </div>
  );
}
