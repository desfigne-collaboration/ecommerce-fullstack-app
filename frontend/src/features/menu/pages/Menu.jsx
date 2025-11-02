/**
 * ============================================================================
 * Menu.jsx - 전체 카테고리 메뉴 페이지
 * ============================================================================
 *
 * 【목적】
 * - 전체 카테고리와 브랜드를 한눈에 볼 수 있는 메뉴 페이지
 * - navData에서 가져온 카테고리 정보를 섹션별로 그룹화하여 표시
 *
 * 【주요 기능】
 * 1. **카테고리 그리드**: 여성, 남성, 키즈, 럭셔리 등 섹션별 그룹
 * 2. **섹션 제목**: 영문 대문자 + 한글 설명 표시
 * 3. **링크 목록**: 각 카테고리별 상품 페이지 링크
 *
 * 【데이터 구조】
 * ```javascript
 * NAV = {
 *   women: [
 *     { to: "/category/...", label: "..." },
 *     ...
 *   ],
 *   men: [...],
 *   ...
 * }
 * ```
 *
 * 【섹션 매핑】
 * - women → 여성
 * - men → 남성
 * - kids → 키즈 & 스포츠
 * - luxury → 럭셔리 & 디자이너
 * - beauty → 뷰티 & 라이프
 * - life → 라이프
 * - sports → 스포츠
 * - golf → 골프
 * - outlet → 아울렛
 *
 * @component
 * @author Claude Code
 * @since 2025-11-02
 */

import React from "react";
import { Link } from "react-router-dom";
import "./Menu.css";
import { NAV } from "components/layout/data/navData";

/**
 * Menu 함수형 컴포넌트
 *
 * @description
 * 전체 카테고리 메뉴 페이지. NAV 데이터를 섹션별로 그룹화하여 표시합니다.
 *
 * 【처리 흐름】
 * 1. **NAV 데이터 로드**: navData에서 전체 카테고리 가져오기
 * 2. **섹션별 그룹화**: Object.entries()로 [key, categories] 배열 생성
 * 3. **섹션 제목 변환**: key에 따라 한글 제목 매핑
 * 4. **카테고리 링크 렌더링**: 각 섹션 내 카테고리 목록 표시
 *
 * @returns {JSX.Element} 전체 카테고리 메뉴 UI
 */
export default function Menu() {
  return (
    <div className="menu-container">
      <header className="menu-header">
        <h1>전체 카테고리</h1>
        <p>브랜드와 카테고리를 한눈에 살펴보세요.</p>
      </header>

      <div className="menu-grid">
        {Object.entries(NAV).map(([sectionKey, categories]) => (
          <div className="menu-group" key={sectionKey}>
            <h2 className="menu-group-title">
              {sectionKey.toUpperCase()}{" "}
              <span style={{ fontWeight: "normal", color: "#555" }}>
                {sectionKey === "women"
                  ? "여성"
                  : sectionKey === "men"
                  ? "남성"
                  : sectionKey === "kids"
                  ? "키즈 & 스포츠"
                  : sectionKey === "luxury"
                  ? "럭셔리 & 디자이너"
                  : sectionKey === "beauty"
                  ? "뷰티 & 라이프"
                  : sectionKey === "life"
                  ? "라이프"
                  : sectionKey === "sports"
                  ? "스포츠"
                  : sectionKey === "golf"
                  ? "골프"
                  : sectionKey === "outlet"
                  ? "아울렛"
                  : ""}
              </span>
            </h2>

            <ul className="menu-list">
              {categories.map((item) => (
                <li key={item.to}>
                  <Link className="menu-link" to={item.to}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
