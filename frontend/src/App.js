/**
 * ============================================================================
 * App.js - 애플리케이션 최상위 컴포넌트
 * ============================================================================
 *
 * 【목적】
 * - React 애플리케이션의 진입점(Entry Point)
 * - 전체 앱의 레이아웃 구조 정의
 * - 라우팅 시스템 통합
 *
 * 【구조】
 * ┌─────────────────────────┐
 * │    ErrorBoundary        │  ← 전역 에러 처리
 * │  ┌───────────────────┐  │
 * │  │      Header       │  │  ← 상단 네비게이션 (모든 페이지 공통)
 * │  ├───────────────────┤  │
 * │  │      Routes       │  │  ← 동적 페이지 영역 (URL에 따라 변경)
 * │  │  (페이지 컨텐츠)   │  │
 * │  ├───────────────────┤  │
 * │  │      Footer       │  │  ← 하단 정보 (모든 페이지 공통)
 * │  └───────────────────┘  │
 * └─────────────────────────┘
 *
 * 【사용된 기술】
 * - React Router v6: 클라이언트 사이드 라우팅
 * - Error Boundary: React 에러 처리 (컴포넌트 트리 전체 보호)
 *
 * 【라우팅 종류】
 * - publicRoutes: 누구나 접근 가능한 페이지 (예: 홈, 로그인, 상품 목록)
 * - privateRoutes: 로그인 필요한 페이지 (예: 마이페이지, 장바구니, 주문)
 *
 * 【참고】
 * - index.js에서 이 컴포넌트를 ReactDOM.render()로 렌더링
 * - Redux Provider는 index.js에서 감싸짐
 * - HashRouter도 index.js에서 설정됨
 *
 * @author Claude Code
 * @since 2025-11-02
 */

import React from "react";
import { Routes } from "react-router-dom";

// ============================================================================
// 공통 컴포넌트 Import
// ============================================================================
import ErrorBoundary from "./components/common/ErrorBoundary.jsx";  // 에러 경계 컴포넌트
import Header from "./components/layout/Header.jsx";                 // 상단 헤더
import Footer from "./components/layout/Footer.jsx";                 // 하단 푸터

// ============================================================================
// 라우팅 설정 Import
// ============================================================================
import { publicRoutes, privateRoutes } from "./routes/index.jsx";    // 라우트 정의

/**
 * App 컴포넌트
 *
 * @description
 * 애플리케이션의 최상위 컴포넌트입니다.
 * 모든 페이지에서 공통으로 보이는 Header/Footer와
 * URL에 따라 변경되는 Routes를 포함합니다.
 *
 * @component
 * @example
 * // index.js에서 사용 예시
 * <Provider store={store}>
 *   <HashRouter>
 *     <App />
 *   </HashRouter>
 * </Provider>
 */
function App() {
  return (
    // ErrorBoundary: 하위 컴포넌트에서 발생하는 모든 에러를 catch
    // 에러 발생 시 앱이 완전히 중단되는 것을 방지하고 fallback UI 표시
    <ErrorBoundary>
      {/* Header: 로고, 메뉴, 검색, 로그인 등 상단 네비게이션 */}
      <Header />

      {/* Routes: URL 경로에 따라 다른 페이지 컴포넌트를 렌더링 */}
      <Routes>
        {/* publicRoutes: /login, /signup, /women, /men 등 인증 불필요 */}
        {publicRoutes}

        {/* privateRoutes: /mypage, /checkout 등 로그인 필요 (PrivateRoute로 보호됨) */}
        {privateRoutes}
      </Routes>

      {/* Footer: 회사 정보, 이용약관, SNS 링크 등 하단 정보 */}
      <Footer />
    </ErrorBoundary>
  );
}

export default App;
