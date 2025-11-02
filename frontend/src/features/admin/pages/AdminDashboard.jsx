/**
 * ============================================================================
 * AdminDashboard.jsx - 관리자 대시보드 (회원 관리)
 * ============================================================================
 *
 * 【목적】
 * - 관리자 권한으로 회원 목록 조회 및 관리
 * - 회원 검색, 탈퇴 처리, 정보 조회 기능 제공
 * - Admin 전용 페이지로 비인가 접근 차단
 *
 * 【주요 기능】
 * 1. **Admin 권한 검증**: userId가 "admin"인지 확인 (비인가 시 /login 리다이렉트)
 * 2. **회원 목록 표시**: localStorage의 users 배열 표시
 * 3. **검색 기능**: 이메일 또는 이름으로 실시간 필터링
 * 4. **회원 탈퇴**: 선택한 회원 삭제 (localStorage 업데이트)
 * 5. **관리자 로그아웃**: loginUser, loginInfo, auth 제거
 *
 * 【데이터 소스】
 * - users: localStorage에서 "users" 키로 저장된 배열
 * - 각 user 객체: { email, name, joinedAt, role }
 *
 * 【권한 검증】
 * - useEffect에서 loginInfo.userId === "admin" 확인
 * - 비인가 시 window.location.href = "/#/login"으로 강제 이동
 *
 * 【탈퇴 처리】
 * - 선택한 회원을 users 배열에서 제거
 * - 현재 로그인한 사용자가 탈퇴되면 로그인 정보도 함께 제거
 *
 * @component
 * @author Claude Code
 * @since 2025-11-02
 */

import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import storage from "../../../utils/storage.js";
import "../../../styles/AdminDashboard.css";

/**
 * AdminDashboard - 관리자 대시보드 컴포넌트
 *
 * @description
 * 관리자 권한으로 회원 목록을 조회하고 관리하는 페이지입니다.
 *
 * 【레이아웃 구조】
 * 1. admin-topbar: 페이지 제목 및 액션 버튼 (홈, 주문 관리, 로그아웃)
 * 2. admin-card: 회원 목록 카드
 *    - admin-card-head: 제목 + 검색 입력 + 새로고침 버튼
 *    - admin-table: 회원 정보 테이블
 *
 * 【상태 관리】
 * - q: 검색어 (이메일 또는 이름)
 * - users: localStorage에서 불러온 회원 목록
 *
 * 【검색 로직】
 * - useMemo로 filtered 배열 생성
 * - 이메일 또는 이름에 검색어 포함 여부 확인 (대소문자 무시)
 *
 * 【회원 탈퇴 로직】
 * 1. 선택한 회원을 users 배열에서 제거
 * 2. localStorage "users" 업데이트
 * 3. 탈퇴된 회원이 현재 로그인 사용자면 로그인 정보도 제거
 * 4. alert로 탈퇴 완료 메시지 표시
 *
 * @returns {JSX.Element} 관리자 대시보드 페이지
 *
 * @example
 * // App.jsx 또는 라우터에서 사용:
 * <Route path="/admin" element={<AdminDashboard />} />
 */
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [users, setUsers] = useState(() => {
    try { return storage.get("users", []); } catch { return []; }
  });

  /**
   * Admin 권한 체크
   *
   * @description
   * useEffect에서 loginInfo.userId가 "admin"인지 확인합니다.
   * Admin이 아니면 로그인 페이지로 강제 리다이렉트됩니다.
   *
   * 【권한 확인 흐름】
   * 1. localStorage에서 loginInfo 조회
   * 2. loginInfo가 없거나 userId가 "admin"이 아니면 비인가
   * 3. window.location.href로 /#/login으로 이동
   */
  useEffect(() => {
    // Admin 권한 체크
    const loginInfo = storage.get("loginInfo", null);
    if (!loginInfo || loginInfo.userId !== "admin") {
      window.location.href = "/#/login";
    }
  }, [navigate]);

  /**
   * refresh - 회원 목록 새로고침
   *
   * @description
   * localStorage에서 users 배열을 다시 불러와 상태를 업데이트합니다.
   */
  const refresh = () => {
    try { setUsers(storage.get("users", [])); } catch { setUsers([]); }
  };

  /**
   * onDelete - 회원 탈퇴 처리
   *
   * @description
   * 선택한 회원을 users 배열에서 제거하고 localStorage를 업데이트합니다.
   * 탈퇴된 회원이 현재 로그인 사용자면 로그인 정보도 함께 제거합니다.
   *
   * 【처리 흐름】
   * 1. users.filter()로 해당 이메일 제외
   * 2. localStorage "users" 업데이트
   * 3. 탈퇴된 회원이 loginUser면 로그인 정보 제거
   * 4. setUsers()로 화면 업데이트
   * 5. alert로 완료 메시지 표시
   *
   * @param {string} email - 탈퇴할 회원의 이메일
   */
  const onDelete = (email) => {
    const next = users.filter(u => u.email !== email);
    storage.set("users", next);
    if (storage.get("loginUser", null)?.email === email) {
      storage.set("isLogin", "false");
      storage.remove("loginUser");
      storage.remove("auth");
    }
    setUsers(next);
    alert("회원이 삭제되었습니다.");
  };

  /**
   * onLogout - 관리자 로그아웃
   *
   * @description
   * 관리자 로그인 정보를 모두 제거하고 로그인 페이지로 이동합니다.
   *
   * 【제거 항목】
   * - loginUser: 현재 로그인한 사용자 정보
   * - loginInfo: 로그인 메타 정보
   * - auth: 인증 토큰
   * - isLogin: 로그인 여부 플래그
   */
  const onLogout = () => {
    storage.remove("loginUser");
    storage.remove("loginInfo");
    storage.remove("auth");
    storage.set("isLogin", false);
    navigate("/login");
  };

  /**
   * filtered - 검색 필터링된 회원 목록
   *
   * @description
   * useMemo로 메모이제이션하여 검색어(q)에 따라 회원 목록을 필터링합니다.
   *
   * 【필터링 조건】
   * - 이메일에 검색어 포함 (대소문자 무시)
   * - 이름에 검색어 포함 (대소문자 무시)
   * - 검색어가 없으면 전체 목록 반환
   *
   * @type {Array<Object>}
   */
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return users;
    return users.filter(u =>
      (u.email || "").toLowerCase().includes(term) ||
      (u.name || "").toLowerCase().includes(term)
    );
  }, [users, q]);

  /**
   * formatDate - 날짜 포맷팅
   *
   * @description
   * 타임스탬프를 "YYYY-MM-DD HH:mm" 형식으로 변환합니다.
   *
   * @param {number} ms - 타임스탬프 (밀리초)
   * @returns {string} 포맷팅된 날짜 문자열 (예: "2025-11-02 14:30")
   *
   * @example
   * formatDate(1730556789123) // "2025-11-02 14:33"
   */
  const formatDate = (ms) => {
    if (!ms) return "-";
    const d = new Date(ms);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${y}-${m}-${day} ${hh}:${mm}`;
  };

  // useEffect에서 이미 권한 체크를 하므로 렌더링은 그대로 진행

  return (
    <div className="admin-wrap">
      <div className="admin-topbar">
        <div className="admin-title">관리자 대시보드</div>
        <div className="admin-actions">
          <Link className="btn" to="/">홈으로</Link>
          <Link className="btn" to={{ pathname: "/mypage", state: { activeTab: "admin-orders" } }}>주문 관리</Link>
          <button className="btn" onClick={onLogout}>관리자 로그아웃</button>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-head">
          <div className="admin-card-title">회원 목록</div>
          <div className="admin-controls">
            <input
              className="admin-input"
              placeholder="이메일 또는 이름 검색"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <button className="btn" onClick={refresh}>새로고침</button>
          </div>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{width: "32px"}}>#</th>
                <th>이메일</th>
                <th>이름</th>
                <th style={{width: "180px"}}>가입일시</th>
                <th style={{width: "120px"}}>권한</th>
                <th style={{width: "120px"}}>관리</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty">회원이 없습니다.</td>
                </tr>
              ) : (
                filtered.map((u, i) => (
                  <tr key={u.email}>
                    <td>{i + 1}</td>
                    <td>{u.email}</td>
                    <td>{u.name}</td>
                    <td>{formatDate(u.joinedAt)}</td>
                    <td>{u.role || "user"}</td>
                    <td>
                      <button className="btn-danger" onClick={() => onDelete(u.email)}>탈퇴</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
