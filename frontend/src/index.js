/**
 * ============================================================================
 * index.js - React 애플리케이션 진입점 (Entry Point)
 * ============================================================================
 *
 * 【목적】
 * - React 애플리케이션의 최상위 진입점
 * - Redux Store Provider 설정
 * - React Router (BrowserRouter) 설정
 * - 루트 컴포넌트(App) 렌더링
 *
 * 【핵심 설정】
 * 1. **ReactDOM.createRoot**: React 18의 Concurrent 모드 사용
 * 2. **Redux Provider**: 전역 상태 관리 (Redux store 제공)
 * 3. **BrowserRouter**: 클라이언트 사이드 라우팅
 * 4. **App 컴포넌트**: 루트 레이아웃 및 라우트 정의
 *
 * 【Provider 계층 구조】
 * - Provider (Redux): 전역 상태 관리
 *   └─ Router (BrowserRouter): URL 라우팅
 *      └─ App: 애플리케이션 루트 컴포넌트
 *
 * 【렌더링 대상】
 * - DOM 요소: <div id="root"></div> (public/index.html)
 * - React 18 createRoot API 사용
 *
 * @module index
 * @author Claude Code
 * @since 2025-11-02
 */

// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './store/store.js';
import App from "./App.js";
import "./index.css";

/**
 * React 애플리케이션 루트 렌더링
 *
 * @description
 * React 18의 createRoot API를 사용하여 애플리케이션을 렌더링합니다.
 *
 * 【렌더링 구조】
 * 1. ReactDOM.createRoot: React 18 Concurrent Mode 활성화
 * 2. Provider: Redux store를 전역으로 제공
 * 3. Router (BrowserRouter): 클라이언트 사이드 라우팅 활성화
 * 4. App: 최상위 컴포넌트 (Header, Routes, Footer 포함)
 *
 * 【Redux Store】
 * - store/store.js에서 configureStore로 생성
 * - authSlice, cartSlice 등 통합 관리
 *
 * 【BrowserRouter】
 * - HTML5 History API 사용
 * - URL 경로 기반 라우팅 (/home, /products/:id 등)
 *
 * 【마운트 지점】
 * - DOM Element ID: "root"
 * - public/index.html의 <div id="root"></div>
 *
 * @example
 * // public/index.html:
 * // <div id="root"></div>
 *
 * // 렌더링 결과:
 * // <div id="root">
 * //   <Provider>
 *     <Router>
 *       <App />
 *     </Router>
 *   </Provider>
 * // </div>
 */
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
<Provider store={store}>
  <Router>
    <App />
  </Router>
</Provider>
);
