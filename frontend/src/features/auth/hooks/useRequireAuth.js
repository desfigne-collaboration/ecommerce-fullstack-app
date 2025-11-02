/**
 * ============================================================================
 * useRequireAuth.js - 로그인 필수 페이지 보호 커스텀 훅
 * ============================================================================
 *
 * 【목적】
 * - 로그인하지 않은 사용자의 보호된 페이지 접근 차단
 * - 비로그인 시 자동으로 로그인 페이지로 리다이렉트
 * - 로그인 후 원래 페이지로 돌아갈 수 있도록 경로 저장
 *
 * 【사용 대상 페이지】
 * - 마이페이지 (MyPage.jsx)
 * - 주문 내역 (MyOrders.jsx)
 * - 장바구니 (CartPage.jsx)
 * - 결제 페이지 (Checkout.jsx)
 * - 쿠폰함 (MyCoupons.jsx)
 *
 * 【동작 방식】
 * 1. Redux에서 user 상태 확인
 * 2. user가 없으면 (비로그인) → /login?redirect=현재경로
 * 3. 로그인 완료 후 Login.jsx에서 redirect 파라미터 읽어 원래 페이지 복원
 *
 * 【사용 예시】
 * ```jsx
 * export default function MyPage() {
 *   const isLoggedIn = useRequireAuth();
 *
 *   if (!isLoggedIn) return null; // 로그인 페이지로 리다이렉트 중
 *
 *   return <div>마이페이지 내용</div>;
 * }
 * ```
 *
 * 【장점】
 * - 코드 재사용: 여러 페이지에서 간단히 호출
 * - 일관된 UX: 모든 보호 페이지가 동일한 방식으로 동작
 * - 자동 복귀: 로그인 후 원래 가려던 페이지로 자동 이동
 *
 * @module useRequireAuth
 * @author Claude Code
 * @since 2025-11-02
 */

import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../slice/authSlice.js";

/**
 * useRequireAuth - 로그인 필수 보호 훅
 *
 * @description
 * 페이지에 진입할 때 로그인 여부를 확인하고,
 * 비로그인 시 로그인 페이지로 자동 리다이렉트합니다.
 *
 * @returns {boolean} 로그인 여부 (true: 로그인됨, false: 리다이렉트 중)
 *
 * @example
 * function MyPage() {
 *   const isLoggedIn = useRequireAuth();
 *   if (!isLoggedIn) return null;
 *   return <div>보호된 컨텐츠</div>;
 * }
 */
export default function useRequireAuth() {
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      // 비로그인 → 로그인 페이지로, 돌아올 목적지 저장
      const redirectTo = encodeURIComponent(location.pathname + location.search);
      navigate(`/login?redirect=${redirectTo}`, { replace: true });
    }
  }, [user, navigate, location]);

  return !!user;
}
