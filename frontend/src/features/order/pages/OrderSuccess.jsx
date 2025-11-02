/**
 * ============================================================================
 * OrderSuccess.jsx - 주문 완료 페이지
 * ============================================================================
 *
 * 【목적】
 * - 결제 완료 후 성공 메시지 표시
 * - 마이페이지 및 홈으로의 이동 버튼 제공
 *
 * 【주요 기능】
 * - 결제 성공 메시지 표시
 * - 마이페이지 링크 (주문 내역 확인)
 * - 쇼핑 계속하기 링크 (홈으로 이동)
 *
 * 【경로】
 * - /order/success - 결제 완료 후 리다이렉트
 *
 * @component
 * @author Claude Code
 * @since 2025-11-02
 */

import React from "react";
import { Link } from "react-router-dom";

/**
 * OrderSuccess 함수형 컴포넌트
 *
 * @description
 * 결제 완료 후 표시되는 성공 페이지.
 * 간단한 메시지와 네비게이션 링크만 제공합니다.
 *
 * @returns {JSX.Element} 주문 완료 페이지 UI
 */
export default function OrderSuccess() {
  return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: 24, textAlign: "center" }}>
      <h1 style={{ fontSize: 28, marginBottom: 12 }}>결제가 완료되었습니다!</h1>
      <p>주문 내역은 마이페이지에서 확인하실 수 있어요.</p>
      <div style={{ marginTop: 24, display: "flex", gap: 12, justifyContent: "center" }}>
        <Link to="/mypage" className="btn">마이페이지</Link>
        <Link to="/" className="btn">쇼핑 계속하기</Link>
      </div>
    </div>
  );
}
