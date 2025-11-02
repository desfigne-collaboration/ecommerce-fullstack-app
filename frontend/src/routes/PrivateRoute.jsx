/**
 * ============================================================================
 * PrivateRoute.jsx - 인증 보호 라우트 컴포넌트
 * ============================================================================
 *
 * 【목적】
 * - 로그인이 필요한 페이지에 대한 접근 제어
 * - 비로그인 사용자를 로그인 페이지로 리다이렉트
 * - 로그인 후 원래 가려던 페이지로 자동 복귀
 *
 * 【주요 기능】
 * 1. **Redux 인증 상태 확인**: authSlice에서 user 및 authReady 조회
 * 2. **인증 대기**: authReady가 false면 null 반환 (로딩 중)
 * 3. **로그인 여부 검사**: user가 없으면 /login으로 리다이렉트
 * 4. **리다이렉트 URL 보존**: 쿼리 파라미터로 원래 경로 전달
 * 5. **HashRouter 호환**: /#/login?redirect=/checkout 형태로 동작
 *
 * 【인증 흐름】
 * 1. PrivateRoute로 보호된 페이지 접근 (예: /checkout)
 * 2. Redux authSlice에서 user 상태 조회
 * 3. user가 null → /login?redirect=/checkout으로 이동
 * 4. 로그인 성공 후 redirect 파라미터로 원래 페이지(/checkout)로 복귀
 *
 * 【리다이렉트 URL 구성】
 * - pathname: 현재 경로 (예: /checkout)
 * - search: 쿼리 스트링 (예: ?id=123)
 * - target: pathname + search 조합
 * - encodeURIComponent(target): URL 안전하게 인코딩
 *
 * 【React Router v7 호환】
 * - Navigate 컴포넌트 사용 (React Router v6+)
 * - useLocation 훅으로 현재 위치 정보 취득
 * - replace prop으로 뒤로가기 시 로그인 페이지 스킵
 *
 * @module PrivateRoute
 * @author Claude Code
 * @since 2025-11-02
 */

// src/routes/PrivateRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser, selectAuthReady } from "features/auth/slice/authSlice.js";

/**
 * PrivateRoute - 인증 보호 라우트 컴포넌트
 *
 * @description
 * React Router v7 전용 PrivateRoute입니다.
 * 로그인하지 않은 사용자는 /login?redirect=<원래가려던경로>로 리다이렉트됩니다.
 * HashRouter 환경에서도 정상 동작합니다 (예: /#/login?redirect=/checkout).
 *
 * 【처리 단계】
 * 1. Redux authSlice에서 user 및 authReady 상태 조회
 * 2. authReady가 false면 null 반환 (초기화 대기)
 * 3. user가 존재하면 children 렌더링 (보호된 페이지 표시)
 * 4. user가 없으면 Navigate로 /login 이동 (redirect 파라미터 포함)
 *
 * 【리다이렉트 예시】
 * - 접근 시도: /checkout
 * - 리다이렉트: /login?redirect=%2Fcheckout
 * - 로그인 후: /checkout (원래 페이지로 복귀)
 *
 * 【상태 전달】
 * - state={{ from: location }}: 로그인 페이지에서 이전 경로 정보 활용 가능
 *
 * @component
 * @param {Object} props - 컴포넌트 props
 * @param {React.ReactNode} props.children - 보호할 자식 컴포넌트 (로그인 필요 페이지)
 * @returns {React.ReactNode|null} 인증 성공 시 children, 실패 시 Navigate, 대기 중이면 null
 *
 * @example
 * // App.jsx에서 사용:
 * import PrivateRoute from './routes/PrivateRoute';
 *
 * <Route
 *   path="/checkout"
 *   element={
 *     <PrivateRoute>
 *       <Checkout />
 *     </PrivateRoute>
 *   }
 * />
 *
 * @example
 * // 로그인하지 않은 상태에서 /checkout 접근 시:
 * // 자동으로 /login?redirect=%2Fcheckout 으로 이동
 * // 로그인 성공 후 /checkout으로 자동 복귀
 */
const PrivateRoute = ({ children }) => {
  const user = useSelector(selectUser);
  const ready = useSelector(selectAuthReady);
  const location = useLocation();

  /**
   * 아직 Redux 복원 중이면 잠깐 빈 화면/스피너 표시
   *
   * @description
   * authReady가 false인 동안은 localStorage에서 사용자 정보를 복원하는 중입니다.
   * 복원이 완료되기 전에 리다이렉트하면 불필요한 로그인 페이지 이동이 발생할 수 있습니다.
   */
  if (!ready) return null;

  /**
   * 로그인 상태: children 렌더링
   *
   * @description
   * user가 존재하면 인증 성공으로 간주하고 보호된 페이지(children)를 표시합니다.
   */
  if (user) {
    return children;
  }

  /**
   * 비로그인 상태: /login으로 리다이렉트
   *
   * @description
   * - target: 현재 경로 + 쿼리 스트링 (예: /checkout?coupon=SAVE10)
   * - encodeURIComponent(target): URL 인코딩 (특수문자 안전하게 전달)
   * - replace: true → 브라우저 뒤로가기 시 로그인 페이지 스킵
   * - state: 로그인 페이지에서 이전 위치 정보 활용 가능
   *
   * 【리다이렉트 URL 예시】
   * - /checkout → /login?redirect=%2Fcheckout
   * - /mypage?tab=orders → /login?redirect=%2Fmypage%3Ftab%3Dorders
   */
  const target = location.pathname + (location.search || "");
  return (
    <Navigate
      to={`/login?redirect=${encodeURIComponent(target)}`}
      replace
      state={{ from: location }}
    />
  );
};

export default PrivateRoute;
