/**
 * ============================================================================
 * Search.jsx - 상품 검색 결과 페이지
 * ============================================================================
 *
 * 【목적】
 * - 사용자가 입력한 키워드로 상품 검색
 * - PRODUCT_DATA에서 검색어와 일치하는 상품 필터링
 * - ProductThumb 컴포넌트로 검색 결과 표시
 *
 * 【주요 기능】
 * 1. **경로 파라미터 파싱**: /search/:keyword에서 키워드 추출
 * 2. **데이터 평탄화**: 중첩된 PRODUCT_DATA를 1차원 배열로 변환
 * 3. **검색 필터링**: 상품명(name)과 설명(desc)에서 키워드 검색
 * 4. **이미지 정규화**: srcOf를 사용하여 이미지 경로 절대 URL로 변환
 * 5. **검색 결과 표시**: ProductThumb로 썸네일 렌더링
 *
 * 【검색 로직】
 * - 키워드를 소문자로 변환하여 대소문자 무시 검색
 * - name 또는 desc에 키워드가 포함된 상품만 필터링
 * - 예: "자켓" 검색 → name에 "자켓" 포함 또는 desc에 "자켓" 포함
 *
 * 【경로 예시】
 * - /search/자켓 → "자켓" 검색
 * - /search/티셔츠 → "티셔츠" 검색
 *
 * @component
 * @author Claude Code
 * @since 2025-11-02
 */

// src/pages/Search.jsx
import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import ProductThumb from "../components/ProductThumb";
import { PRODUCT_DATA } from "../data/productData";
import { srcOf } from "../../../utils/srcOf";

/**
 * flattenProducts - PRODUCT_DATA를 1차원 배열로 평탄화
 *
 * @description
 * 중첩된 카테고리/서브카테고리 구조를 단일 배열로 변환합니다.
 * 각 상품에 category, subcategory 정보를 추가합니다.
 *
 * @param {Object} data - 중첩된 상품 데이터 객체 { category: { subcategory: [products] } }
 * @returns {Array<Object>} 평탄화된 상품 배열
 *
 * @example
 * const data = {
 *   women: {
 *     outer: [{ id: 1, name: "자켓" }],
 *     shirt: [{ id: 2, name: "셔츠" }]
 *   }
 * }
 * flattenProducts(data)
 * // → [
 * //   { id: 1, name: "자켓", category: "women", subcategory: "outer" },
 * //   { id: 2, name: "셔츠", category: "women", subcategory: "shirt" }
 * // ]
 */
function flattenProducts(data) {
  const out = [];
  Object.entries(data).forEach(([cat, sections]) => {
    Object.entries(sections).forEach(([sub, arr]) => {
      if (Array.isArray(arr)) {
        arr.forEach((p) =>
          out.push({
            ...p,
            category: cat,
            subcategory: sub,
          })
        );
      }
    });
  });
  return out;
}

/**
 * Search 함수형 컴포넌트
 *
 * @description
 * 사용자가 입력한 키워드로 상품을 검색하고 결과를 표시하는 페이지.
 *
 * 【처리 흐름】
 * 1. **키워드 추출**: useParams로 URL에서 :keyword 파라미터 추출
 * 2. **데이터 평탄화**: PRODUCT_DATA를 1차원 배열로 변환 (useMemo로 캐싱)
 * 3. **검색 필터링**: 키워드를 소문자로 변환하여 name/desc에서 검색
 * 4. **이미지 정규화**: 각 상품의 이미지 경로를 srcOf로 절대 URL로 변환
 * 5. **렌더링**: ProductThumb 컴포넌트로 검색 결과 표시
 *
 * 【성능 최적화】
 * - useMemo로 평탄화 결과 캐싱 (PRODUCT_DATA 변경 시만 재계산)
 * - useMemo로 검색 결과 캐싱 (키워드 변경 시만 재계산)
 * - useMemo로 이미지 정규화 결과 캐싱 (검색 결과 변경 시만 재계산)
 *
 * 【검색 필터링 로직】
 * ```javascript
 * const needle = q.toLowerCase(); // "자켓"
 * const name = (p.name || "").toLowerCase(); // "블랙 라이더 자켓"
 * const desc = (p.desc || "").toLowerCase(); // "시크한 무드의 포인트 아이템"
 * return name.includes(needle) || desc.includes(needle); // true
 * ```
 *
 * @returns {JSX.Element} 검색 결과 페이지 UI
 *
 * @example
 * // /search/자켓 경로 접근 시
 * <Search />
 * // → "자켓" 검색 결과 3개 상품 표시
 */
export default function Search() {
  const { keyword = "" } = useParams();        // /search/:keyword
  const q = decodeURIComponent(keyword).trim();
  const all = useMemo(() => flattenProducts(PRODUCT_DATA), []);

  // ‘자켓’ 검색 → name/desc 에 포함된 상품만
  const results = useMemo(() => {
    if (!q) return [];
    const needle = q.toLowerCase();
    return all.filter((p) => {
      const name = (p.name || "").toLowerCase();
      const desc = (p.desc || "").toLowerCase();
      return name.includes(needle) || desc.includes(needle);
    });
  }, [all, q]);

  // ✅ 반드시 image 키에 절대경로로 채움
  const normalized = useMemo(
    () =>
      results.map((p) => ({
        ...p,
        image: srcOf(p.image || p.img || p.src),
      })),
    [results]
  );

  return (
    <div className="page">
      <div className="container">
        <h2 className="page-title" style={{ marginBottom: 18 }}>
          ‘{q}’ 검색 결과 <span className="count">{normalized.length}개 상품</span>
        </h2>

        <div className="product-grid">
          {normalized.map((p) => (
            <div className="product-card" key={p.id}>
              <ProductThumb product={p} />
              <h4>{p.name}</h4>
              <p className="desc">{p.desc}</p>
              <p className="price">{p.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
