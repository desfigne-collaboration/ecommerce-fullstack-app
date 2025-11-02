/**
 * ============================================================================
 * ProductThumb.jsx - 상품 썸네일 (클릭 가능) 컴포넌트
 * ============================================================================
 *
 * 【목적】
 * - 상품 이미지 썸네일을 표시하고 클릭 시 상세 페이지로 이동
 * - 이미지 경로 정규화 (srcOf 사용)
 * - 이미지 로드 실패 시 placeholder 자동 표시
 * - 상품 데이터를 localStorage에 저장 (새로고침 대비)
 *
 * 【동작 흐름】
 * 1. props에서 이미지 경로 추출 (여러 경로 우선순위 지원)
 * 2. srcOf로 절대 URL 변환
 * 3. 클릭 시 상품 데이터 정규화
 * 4. localStorage에 lastProduct 저장
 * 5. /product/:id 페이지로 navigate
 *
 * 【이미지 경로 우선순위】
 * 1. image prop (직접 전달)
 * 2. src prop (직접 전달)
 * 3. product.image
 * 4. product.img
 * 5. product.src
 *
 * 【CSS 인라인 스타일】
 * - position: static으로 기존 CSS absolute 무효화
 * - 고정 높이 250px, objectFit: cover
 *
 * @component
 * @author Claude Code
 * @since 2025-11-02
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import storage from "../../../utils/storage.js";
import { srcOf } from "../../../utils/srcOf";

/**
 * ProductThumb 함수형 컴포넌트
 *
 * @param {Object} props - 컴포넌트 props
 * @param {Object} props.product - 상품 객체
 * @param {string} [props.image] - 이미지 URL (우선순위 높음)
 * @param {string} [props.src] - 이미지 URL (우선순위 중간)
 * @returns {JSX.Element} 클릭 가능한 상품 썸네일 UI
 *
 * @example
 * <ProductThumb
 *   product={{
 *     id: "prod-001",
 *     name: "베이직 티셔츠",
 *     price: 29000,
 *     img: "/images/tshirt.jpg"
 *   }}
 * />
 *
 * @example
 * // 이미지 직접 지정
 * <ProductThumb
 *   product={product}
 *   image="https://cdn.example.com/custom.jpg"
 * />
 */
export default function ProductThumb({ product, image, src }) {
  const navigate = useNavigate();
  const raw = image || src || product?.image || product?.img || product?.src || "";
  const resolved = srcOf(raw);

  /**
   * goDetail - 상품 상세 페이지로 이동
   *
   * @description
   * 상품 데이터를 정규화하여 localStorage에 저장하고,
   * React Router로 상세 페이지로 이동합니다.
   */
  const goDetail = () => {
    const normalized = {
      id: product?.id,
      name: product?.name || "상품명 없음",
      image: resolved,
      price:
        typeof product?.price === "string"
          ? Number(String(product.price).replace(/[^\d]/g, "")) || 0
          : Number(product?.price || 0),
      desc: product?.desc || "",
    };
    storage.set("lastProduct", normalized);
    navigate(`/product/${normalized.id}`, { state: { product: normalized } });
  };

  return (
    <div className="product-thumb" onClick={goDetail}>
      <img
        src={resolved}
        alt={product?.name || ""}
        loading="eager"
        // ✅ 기존 CSS가 가리는 문제 방지(absolute 강제화 되어도 덮어씀)
        style={{ position: "static", width: "100%", height: 250, objectFit: "cover", borderRadius: 12, display: "block" }}
        onError={(e) => { e.currentTarget.src = `${process.env.PUBLIC_URL}/images/placeholder.png`; }}
      />
    </div>
  );
}
