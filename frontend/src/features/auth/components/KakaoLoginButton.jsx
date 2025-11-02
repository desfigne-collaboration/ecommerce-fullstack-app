/**
 * ============================================================================
 * KakaoLoginButton.jsx - 카카오 로그인 버튼 컴포넌트
 * ============================================================================
 *
 * 【목적】
 * - 카카오 OAuth 2.0 로그인을 시작하는 버튼
 * - 클릭 시 카카오 인증 페이지로 리다이렉트
 * - Login 페이지에서 SNS 로그인 옵션으로 사용
 *
 * 【OAuth 2.0 Authorization Code Grant 흐름】
 * 1. 사용자가 이 버튼 클릭
 * 2. 카카오 인증 서버로 리다이렉트 (authorize 엔드포인트)
 * 3. 사용자가 카카오 로그인 + 동의
 * 4. 콜백 URL로 리다이렉트 (인가 코드 포함)
 * 5. KakaoCallback.jsx에서 인가 코드 → 액세스 토큰 교환
 * 6. 액세스 토큰으로 사용자 정보 조회 → 자동 로그인
 *
 * 【카카오 인증 URL 파라미터】
 * - client_id: 카카오 REST API 키 (환경 변수)
 * - redirect_uri: 인증 후 돌아올 URL (KakaoCallback 페이지)
 * - response_type: "code" (Authorization Code Grant)
 * - scope: "profile_nickname" (요청할 권한)
 *
 * 【환경 변수】
 * - REACT_APP_KAKAO_REST_API_KEY: 카카오 앱 REST API 키
 * - REACT_APP_KAKAO_REDIRECT_URI: 콜백 URL (예: http://localhost:3000/kakao/callback)
 *
 * 【UI/UX】
 * - 노란색 배경 + 말풍선 아이콘 (카카오 브랜드 가이드)
 * - CSS 클래스: .sns-btn.sns-kakao
 *
 * @component
 * @author Claude Code
 * @since 2025-11-02
 */

import React from "react";

/**
 * KakaoLoginButton 함수형 컴포넌트
 *
 * @returns {JSX.Element} 카카오 로그인 버튼 UI
 */
export default function KakaoLoginButton() {
  /**
   * handleKakaoLogin - 카카오 로그인 시작
   *
   * @description
   * 카카오 OAuth 인증 URL을 생성하고 리다이렉트합니다.
   * window.location.href로 페이지 전체를 이동시킵니다.
   */
  const handleKakaoLogin = () => {
    console.log("카카오 로그인 버튼 클릭됨");

    const restApiKey = process.env.REACT_APP_KAKAO_REST_API_KEY;
    const redirectUri = encodeURIComponent(process.env.REACT_APP_KAKAO_REDIRECT_URI);
    // scope 파라미터: profile_nickname만 요청 (이메일 제외)
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${restApiKey}&redirect_uri=${redirectUri}&response_type=code&scope=profile_nickname`;

    console.log("카카오 인증 URL:", kakaoAuthUrl);
    window.location.href = kakaoAuthUrl;
  };

  return (
    <button type="button" className="sns-btn sns-kakao" onClick={handleKakaoLogin}>
      <div className="sns-icon-box">
        <span className="sns-icon">💬</span>
      </div>
      <span className="sns-text">카카오 로그인</span>
    </button>
  );
}
