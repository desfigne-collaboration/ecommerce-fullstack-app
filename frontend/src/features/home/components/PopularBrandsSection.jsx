/**
 * ============================================================================
 * PopularBrandsSection.jsx - 인기 브랜드 섹션
 * ============================================================================
 *
 * 【목적】
 * - 홈 페이지에 인기 브랜드 그리드 표시
 * - 브랜드별 상세 페이지 링크 제공
 *
 * 【주요 기능】
 * - 4열 그리드 레이아웃
 * - 8SECONDS 커스텀 타일 (Brand8Seconds 컴포넌트)
 * - 나머지 브랜드는 텍스트 링크
 *
 * 【브랜드 목록】
 * - 8SECONDS (커스텀 타일)
 * - BEANPOLE, BEAKER, KUHO 등 (텍스트 링크)
 *
 * @component
 * @author Claude Code
 * @since 2025-11-02
 */

import React from "react";
import { Link } from "react-router-dom";
import Brand8Seconds from "../../components/brands/Brand8Seconds";

/**
 * HomePopularBrands 함수형 컴포넌트
 *
 * @description
 * 홈 페이지에 인기 브랜드를 4열 그리드로 표시합니다.
 * 8SECONDS는 커스텀 타일 컴포넌트를 사용하고, 나머지는 기본 링크 스타일입니다.
 *
 * @returns {JSX.Element} 인기 브랜드 섹션 UI
 */
export default function HomePopularBrands() {
  return (
    <section className="container" style={{ marginTop: 32 }}>
      <h3 className="sec-title">인기 브랜드</h3>

      <div className="brand-grid" style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "18px"
      }}>
        {/* 1) 8SECONDS: 커스텀 타일 */}
        <Brand8Seconds />

        {/* 2) 나머지는 기존 스타일 유지 (예시) */}
        <Link to="/brand/beanpole" className="brand-cell">BEANPOLE</Link>
        <Link to="/brand/beaker" className="brand-cell">BEAKER</Link>
        <Link to="/brand/kuho" className="brand-cell">KUHO</Link>
        {/* ... */}
      </div>
    </section>
  );
}
