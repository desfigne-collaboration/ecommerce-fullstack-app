/**
 * ============================================================================
 * KakaoCallback.jsx - 카카오 OAuth 로그인 콜백 처리 페이지
 * ============================================================================
 *
 * 【목적】
 * - 카카오 OAuth 2.0 인증 흐름의 리다이렉트 엔드포인트
 * - 인가 코드를 받아 액세스 토큰으로 교환
 * - 사용자 정보를 가져와 자동 로그인 처리
 *
 * 【OAuth 2.0 흐름】
 * 1. 사용자가 KakaoLoginButton 클릭
 * 2. 카카오 로그인 페이지로 리다이렉트
 * 3. 사용자 동의 후 이 페이지로 리다이렉트 (code 파라미터 포함)
 * 4. 인가 코드 → 액세스 토큰 교환 (POST /oauth/token)
 * 5. 액세스 토큰으로 사용자 정보 조회 (GET /v2/user/me)
 * 6. Redux 로그인 처리 + 메인 페이지 이동
 *
 * 【환경 변수】
 * - REACT_APP_KAKAO_REST_API_KEY: 카카오 REST API 키
 * - REACT_APP_KAKAO_CLIENT_SECRET: 카카오 클라이언트 시크릿
 * - REACT_APP_KAKAO_REDIRECT_URI: 이 페이지 URL
 *
 * 【API 엔드포인트】
 * - 토큰 발급: https://kauth.kakao.com/oauth/token
 * - 사용자 정보: https://kapi.kakao.com/v2/user/me
 *
 * 【디버깅】
 * - 상세한 console.log로 각 단계 추적 가능
 * - 7단계 프로세스를 시각적으로 표시
 *
 * 【에러 처리】
 * - 인가 코드 없음 → 로그인 페이지 이동
 * - 토큰 발급 실패 → alert + 로그인 페이지 이동
 * - 사용자 정보 조회 실패 → alert + 로그인 페이지 이동
 *
 * @component
 * @author Claude Code
 * @since 2025-11-02
 */

import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../slice/authSlice";
import storage from "../../../utils/storage.js";

/**
 * KakaoCallback 함수형 컴포넌트
 *
 * @returns {JSX.Element} 로딩 화면 UI
 */
export default function KakaoCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🟢 [1/7] KakaoCallback React 컴포넌트 로드됨");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("전체 URL:", window.location.href);
    console.log("location.search:", location.search);
    console.log("location.hash:", location.hash);

    // URL에서 인가 코드 추출 (HashRouter에서는 location.search 사용)
    const params = new URLSearchParams(location.search);
    const code = params.get("code");

    console.log("\n🟢 [2/7] 인가 코드 추출");
    console.log("인가 코드:", code);

    if (!code) {
      console.error("❌ 인가 코드를 찾을 수 없음");
      alert("카카오 로그인에 실패했습니다.");
      navigate("/login");
      return;
    }

    // 카카오 토큰 발급 API 호출
    const getKakaoToken = async () => {
      try {
        console.log("\n🟢 [3/7] 카카오 토큰 요청 시작");
        console.log("요청 파라미터:");
        console.log("- client_id:", process.env.REACT_APP_KAKAO_REST_API_KEY);
        console.log("- client_secret:", process.env.REACT_APP_KAKAO_CLIENT_SECRET);
        console.log("- redirect_uri:", process.env.REACT_APP_KAKAO_REDIRECT_URI);
        console.log("- code:", code);

        const tokenResponse = await fetch("https://kauth.kakao.com/oauth/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
          },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            client_id: process.env.REACT_APP_KAKAO_REST_API_KEY,
            client_secret: process.env.REACT_APP_KAKAO_CLIENT_SECRET,
            redirect_uri: process.env.REACT_APP_KAKAO_REDIRECT_URI,
            code: code
          })
        });

        const tokenData = await tokenResponse.json();
        console.log("\n🟢 [4/7] 토큰 응답 받음");
        console.log("HTTP 상태:", tokenResponse.status);
        console.log("토큰 데이터:", JSON.stringify(tokenData, null, 2));

        // 에러 체크
        if (tokenData.error) {
          console.error("❌ 카카오 토큰 에러:");
          console.error("- error:", tokenData.error);
          console.error("- error_description:", tokenData.error_description);
          console.error("- error_code:", tokenData.error_code);
        }

        if (tokenData.access_token) {
          console.log("✅ Access Token 발급 성공:", tokenData.access_token.substring(0, 20) + "...");

          // 사용자 정보 요청
          console.log("\n🟢 [5/7] 사용자 정보 요청 시작");
          const userResponse = await fetch("https://kapi.kakao.com/v2/user/me", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${tokenData.access_token}`,
              "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
            }
          });

          const userData = await userResponse.json();
          console.log("카카오 원본 사용자 정보:", userData);

          if (userData.id) {
            const email = userData.kakao_account?.email || `kakao_${userData.id}@kakao.user`;
            const name = userData.kakao_account?.profile?.nickname || "카카오사용자";
            const id = userData.id.toString();

            console.log("\n🟢 [6/7] 사용자 정보 추출 완료");
            console.log("추출된 정보:");
            console.log("- ID:", id);
            console.log("- 이름:", name);
            console.log("- 이메일:", email);

            // 로그인 처리
            console.log("\n🟢 [7/7] 카카오 로그인 처리");
            // const res = kakaoLoginApi({ email, name, id });

            console.log("\n📦 localStorage 저장 확인:");
            console.log("- isLogin:", storage.get("isLogin", null));
            console.log("- loginUser:", storage.get("loginUser", null));
            console.log("- auth:", storage.get("auth", null));

            // Redux 상태 업데이트
            console.log("\n🟢 Redux 상태 업데이트");
            dispatch(login({ email, name, id: String(id) }));

            console.log("\n🎉 카카오 로그인 완료! 메인 페이지로 이동");
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
            alert(`${name}님, 환영합니다!`);
            navigate("/");
          } else {
            console.error("❌ 사용자 ID 없음");
            alert("사용자 정보를 가져올 수 없습니다.");
            navigate("/login");
          }
        } else {
          console.error("❌ 토큰 발급 실패");
          console.error("토큰 응답 데이터:", tokenData);
          alert("카카오 토큰 발급에 실패했습니다.");
          navigate("/login");
        }
      } catch (error) {
        console.error("❌❌❌ 카카오 로그인 처리 중 오류 발생 ❌❌❌");
        console.error("에러 상세:", error);
        console.error("에러 메시지:", error.message);
        console.error("에러 스택:", error.stack);
        alert("카카오 로그인 처리 중 오류가 발생했습니다.");
        navigate("/login");
      }
    };

    getKakaoToken();
  }, [navigate, location, dispatch]);

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      fontSize: "18px",
      color: "#666"
    }}>
      카카오 로그인 처리 중입니다...
    </div>
  );
}
