/**
 * ============================================================================
 * SectionHeader.jsx - 섹션 헤더 재사용 컴포넌트
 * ============================================================================
 *
 * 【목적】
 * - 페이지 내 섹션의 제목과 설명을 표시하는 공통 UI 컴포넌트
 * - 일관된 디자인과 레이아웃 제공
 * - "더보기" 링크로 해당 섹션의 전체 목록 페이지로 이동 가능
 *
 * 【사용 위치】
 * - HomePage: "신상품", "인기 상품", "추천 상품" 등의 섹션 헤더
 * - CategoryPage: 카테고리별 상품 목록 섹션 헤더
 * - 기타 목록 페이지의 섹션 구분용
 *
 * 【구조】
 * ┌──────────────────────────────────┐
 * │ <h3>제목</h3>  │  더보기 →     │
 * │ <p>설명 (선택)</p>              │
 * └──────────────────────────────────┘
 *
 * @component
 * @param {Object} props - 컴포넌트 props
 * @param {string} props.title - 섹션 제목 (필수)
 * @param {string} [props.description] - 섹션 설명 (선택)
 *
 * @example
 * // 제목만 표시
 * <SectionHeader title="신상품" />
 *
 * @example
 * // 제목 + 설명 표시
 * <SectionHeader
 *   title="베스트셀러"
 *   description="이번 주 가장 인기있는 상품"
 * />
 *
 * @author Claude Code
 * @since 2025-11-02
 */

import "./SectionHeader.css";

export default function SectionHeader({ title, description }) {
  return (
    <div className="section-header">
      <div>
        {/* 섹션 제목 */}
        <h3>{title}</h3>
        {/* 설명이 있는 경우에만 표시 */}
        {description && <p>{description}</p>}
      </div>
      {/* 더보기 링크 (현재는 # 링크, 실제로는 동적으로 전달받아야 함) */}
      <a href="#" className="more">
        더보기
      </a>
    </div>
  );
}
