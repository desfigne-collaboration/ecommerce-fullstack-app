/**
 * ============================================================================
 * MyPage.jsx - 마이페이지 메인
 * ============================================================================
 *
 * 【목적】
 * - 사용자별 마이페이지 메인 화면
 * - 주요 기능으로의 네비게이션 제공
 * - 관리자 전용 메뉴 표시
 *
 * 【주요 기능】
 * 1. **로그인 체크**: 비로그인 시 로그인 안내
 * 2. **사용자 정보 표시**: 로그인한 사용자 이름 표시
 * 3. **메뉴 네비게이션**: 주문 내역, 위시리스트, 쿠폰함, 비밀번호 변경
 * 4. **관리자 메뉴**: role이 "admin"인 경우 관리자 대시보드/주문 관리 링크 표시
 *
 * 【메뉴 구조】
 * - 🧾 주문 내역 (/mypage/orders)
 * - 💜 위시리스트 (/wishlist)
 * - 🎟️ 쿠폰함 (/mypage/coupons)
 * - 🔑 비밀번호 변경 (/account/recovery)
 * - 🛡️ 관리자 대시보드 (/admin) - 관리자만
 * - 📦 주문 관리 (/admin/orders) - 관리자만
 *
 * @component
 * @author Claude Code
 * @since 2025-11-02
 */

// src/pages/mypage/MyPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import storage from "../../../utils/storage.js";
import "./MyPage.css";

/**
 * MyPage 함수형 컴포넌트
 *
 * @description
 * 마이페이지 메인 화면. 사용자 정보를 표시하고 주요 기능으로의 링크를 제공합니다.
 *
 * 【처리 흐름】
 * 1. **로그인 사용자 조회**: localStorage에서 loginUser 읽기
 * 2. **로그인 체크**: 비로그인 시 로그인 안내 화면
 * 3. **관리자 체크**: role === "admin" 확인
 * 4. **메뉴 렌더링**: 일반 메뉴 + 관리자 메뉴 (조건부)
 *
 * @returns {JSX.Element} 마이페이지 메인 UI
 */
export default function MyPage() {
  const loginUser = storage.get("loginUser", null);

  if (!loginUser) {
    return (
      <div className="mypage-wrapper">
        <div className="mypage-box">
          <h2>마이페이지</h2>
          <p>로그인이 필요합니다.</p>
          <Link to="/login" className="mypage-btn">로그인하기</Link>
        </div>
      </div>
    );
  }

  const isAdmin = loginUser.role === "admin";

  return (
    <div className="mypage-wrapper">
      <div className="mypage-box">
        <h2>{loginUser.name || loginUser.id || "회원"} 님의 마이페이지</h2>
        <div className="mypage-menu">
          <Link to="/mypage/orders" className="mypage-item">🧾 주문 내역</Link>
          <Link to="/wishlist" className="mypage-item">💜 위시리스트</Link>
          <Link to="/mypage/coupons" className="mypage-item">🎟️ 쿠폰함</Link>
          <Link to="/account/recovery" className="mypage-item">🔑 비밀번호 변경</Link>
          {isAdmin && (
            <>
              <Link to="/admin" className="mypage-item admin">🛡️ 관리자 대시보드</Link>
              <Link to="/admin/orders" className="mypage-item admin">📦 주문 관리</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
