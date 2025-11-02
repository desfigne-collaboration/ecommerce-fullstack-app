/**
 * ============================================================================
 * Logout.jsx - 로그아웃 처리 페이지
 * ============================================================================
 *
 * 【목적】
 * - 사용자 로그아웃 처리를 위한 라우트 컴포넌트
 * - Header의 "로그아웃" 링크 클릭 시 /logout 경로로 이동
 * - 즉시 로그아웃 API 호출 후 메인 페이지로 리다이렉트
 *
 * 【동작 방식】
 * 1. 컴포넌트 마운트 (useEffect)
 * 2. logoutApi() 호출 → Redux 상태 초기화 + localStorage 정리
 * 3. navigate("/") → 메인 페이지 이동
 * 4. return null → UI는 렌더링하지 않음 (순간 이동)
 *
 * 【특징】
 * - 별도 UI 없음 (로딩 화면조차 없음)
 * - "경유지" 역할만 수행하는 라우트 컴포넌트
 * - 깔끔한 URL 관리 (/logout 경로 존재)
 *
 * 【대안 구현】
 * Header에서 직접 logoutApi() 호출 + navigate("/")도 가능하지만,
 * 라우트로 분리하면 북마크, 히스토리 관리가 편리합니다.
 *
 * @component
 * @author Claude Code
 * @since 2025-11-02
 */

import { useEffect } from "react";
import { logoutApi } from "../../api/auth";
import { useNavigate } from "react-router-dom";

/**
 * Logout 함수형 컴포넌트
 *
 * @returns {null} UI를 렌더링하지 않음
 */
export default function Logout() {
  const navigate = useNavigate();
  useEffect(() => {
    logoutApi();
    navigate("/");
  }, [navigate]);
  return null;
}
