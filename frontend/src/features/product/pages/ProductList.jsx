/**
 * ============================================================================
 * ProductList.jsx - 상품 목록 / 카테고리 / 검색 결과 통합 페이지
 * ============================================================================
 *
 * 【목적】
 * - 카테고리별 상품 목록 표시 (/women/outer, /men/jacket 등)
 * - 검색 결과 표시 (/search/:keyword 또는 /search?q=키워드)
 * - 위시리스트 토글 기능 통합
 * - 정렬/필터링 UI 제공
 *
 * 【주요 기능】
 * 1. **경로 파싱**: 카테고리/서브카테고리 추출, 검색 모드 감지
 * 2. **데이터 소스**: 로컬 하드코딩 상품 데이터 (women/outer, women/jacket 등)
 * 3. **위시리스트**: localStorage 기반 찜 기능 (실시간 토글)
 * 4. **정렬**: 가격순, 할인율순, 리뷰많은순 등
 * 5. **이미지 폴백**: 여러 후보 경로 시도 (인코딩/소문자/PUBLIC_URL 조합)
 * 6. **Breadcrumb 네비게이션**: Home > 카테고리 > 서브카테고리
 *
 * 【경로 예시】
 * - /women/outer → 여성 아우터 카테고리
 * - /search/자켓 → "자켓" 검색 결과
 * - /search?q=티셔츠 → "티셔츠" 검색 결과
 *
 * 【이미지 폴백 시스템】
 * - 이미지 로드 실패 시 여러 후보 경로를 순차적으로 시도
 * - 후보: PUBLIC_URL+인코딩, PUBLIC_URL+비인코딩, 소문자 변형, 루트 경로
 * - 모든 시도 실패 시 placeholder.png 표시
 *
 * 【데이터 구조】
 * - local_women_outer: 여성 아우터 6개 상품 (하드코딩)
 * - local_women_jacket: 여성 재킷 6개 상품 (하드코딩)
 * - sampleProducts: 외부 샘플 1개 상품
 * - localByCategory: 카테고리별 상품 테이블
 *
 * @component
 * @author Claude Code
 * @since 2025-11-02
 */

// src/pages/ProductList.jsx
import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import storage from "../../../utils/storage.js";
import "../../../styles/CategoryPage.css";
import "../components/ProductCard.css";

/**
 * toNumberPrice - 가격 문자열을 숫자로 변환
 *
 * @param {string|number} val - 가격 값 ("₩50,000" 또는 50000)
 * @returns {number} 순수 숫자 가격
 *
 * @example
 * toNumberPrice("₩50,000") // → 50000
 * toNumberPrice(50000) // → 50000
 */
const toNumberPrice = (val) =>
  typeof val === "number" ? val : Number(String(val).replace(/[^\d]/g, "")) || 0;

/**
 * buildImageCandidates - 이미지 후보 경로 생성기 (안전장치)
 *
 * @description
 * 이미지 로드 실패 시 여러 후보 경로를 순차적으로 시도하기 위한 배열 생성.
 * 한글 파일명, 대소문자, PUBLIC_URL 유무 등 다양한 조합을 시도합니다.
 *
 * 【후보 경로 우선순위】
 * 1. PUBLIC_URL + encodeURI(원본)
 * 2. PUBLIC_URL + 원본(비인코딩)
 * 3. PUBLIC_URL + 파일명 소문자화 + 인코딩
 * 4. PUBLIC_URL + 파일명 소문자화
 * 5. 루트(/) + encodeURI(원본)
 * 6. 루트(/) + 원본(비인코딩)
 *
 * @param {string} raw - 원본 이미지 경로
 * @returns {string[]} 중복 제거된 후보 경로 배열
 *
 * @example
 * buildImageCandidates("/images/상품1.jpg")
 * // → [
 * //   "http://localhost:3000/images/%EC%83%81%ED%92%881.jpg",
 * //   "http://localhost:3000/images/상품1.jpg",
 * //   "http://localhost:3000/images/%EC%83%81%ED%92%881.jpg",
 * //   "/images/%EC%83%81%ED%92%881.jpg",
 * //   "/images/상품1.jpg"
 * // ]
 */
const buildImageCandidates = (raw) => {
  const PUBLIC = process.env.PUBLIC_URL || "";
  const withLeadingSlash = raw.startsWith("/") ? raw : `/${raw}`;

  // 파일명/확장자 분리해 소문자 변형
  const parts = withLeadingSlash.split("/");
  const file = parts.pop() || "";
  const lowerFile = file.toLowerCase();
  const lowerPath = [...parts, lowerFile].join("/");

  const encoded = encodeURI(withLeadingSlash);
  const encodedLower = encodeURI(lowerPath);

  const candidates = [
    `${PUBLIC}${encoded}`,
    `${PUBLIC}${withLeadingSlash}`,     // 인코딩 없이
    `${PUBLIC}${encodedLower}`,         // 파일명 소문자
    `${PUBLIC}${lowerPath}`,            // 소문자 비인코딩
    encoded,                            // PUBLIC_URL 없이도 시도
    withLeadingSlash,                   // 비인코딩 루트
  ];

  // 중복 제거
  return Array.from(new Set(candidates));
};

/**
 * srcOf - 이미지 src 계산 (http/https는 그대로, 그 외는 후보 배열 생성)
 *
 * @description
 * 이미지 경로를 정규화하고 폴백 후보 배열을 생성합니다.
 * 외부 URL은 그대로 사용하고, 로컬 경로는 buildImageCandidates로 후보 생성.
 *
 * @param {string|Object} imgOrProduct - 이미지 경로 문자열 또는 상품 객체
 * @returns {{src: string, candidates: string[]}} 첫 번째 후보 경로와 나머지 후보 배열
 *
 * @example
 * srcOf("https://cdn.example.com/product.jpg")
 * // → { src: "https://cdn.example.com/product.jpg", candidates: [] }
 *
 * @example
 * srcOf("/images/상품1.jpg")
 * // → { src: "http://localhost:3000/images/%EC%83%81%ED%92%881.jpg", candidates: [...] }
 *
 * @example
 * srcOf({ img: "/images/product.jpg" })
 * // → { src: "http://localhost:3000/images/product.jpg", candidates: [...] }
 */
const srcOf = (imgOrProduct) => {
  const raw =
    typeof imgOrProduct === "string"
      ? imgOrProduct
      : imgOrProduct?.image || imgOrProduct?.img || "";

  if (!raw) {
    return {
      src: `${process.env.PUBLIC_URL}/images/placeholder.png`,
      candidates: [],
    };
  }
  if (/^https?:\/\//i.test(raw)) {
    return { src: raw, candidates: [] };
  }
  const candidates = buildImageCandidates(raw.replace(/\/{2,}/g, "/"));
  return { src: candidates[0], candidates: candidates.slice(1) };
};

// ===== 하드코딩: 로컬 이미지 기반 상품들 =====
const local_women_outer = [
  {
    id: "women-outer-101",
    brand: "SSF SHOP",
    name: "베이지 캐주얼 자켓",
    img: "https://desfigne.synology.me/data/image/thejoeun/products/women_outer1.webp",
    desc: "데일리로 활용하기 좋은 기본 아우터",
    price: "129000",
    originalPrice: 159000,
    discountRate: 10,
    rating: 4.5,
    reviewCount: 72,
    wishCount: 320,
    colors: ["beige", "black"],
  },
  {
    id: "women-outer-102",
    brand: "SSF SHOP",
    name: "패턴 자켓",
    img: "https://desfigne.synology.me/data/image/thejoeun/products/women_outer2.webp",
    desc: "유니크한 감각으로 스트릿 패션에 적합",
    price: "159000",
    originalPrice: 199000,
    discountRate: 15,
    rating: 4.4,
    reviewCount: 51,
    wishCount: 240,
    colors: ["brown", "black"],
  },
  {
    id: "women-outer-103",
    brand: "SSF SHOP",
    name: "블랙 라이더 자켓",
    img: "https://desfigne.synology.me/data/image/thejoeun/products/women_outer3.webp",
    desc: "시크한 무드의 포인트 아이템",
    price: "189000",
    originalPrice: 219000,
    discountRate: 10,
    rating: 4.7,
    reviewCount: 33,
    wishCount: 410,
    colors: ["black"],
  },
  {
    id: "women-outer-104",
    brand: "SSF SHOP",
    name: "경량 패딩 자켓",
    img: "https://desfigne.synology.me/data/image/thejoeun/products/women_outer4.webp",
    desc: "가볍지만 따뜻한 간절기 필수템",
    price: "99000",
    originalPrice: 129000,
    discountRate: 20,
    rating: 4.3,
    reviewCount: 28,
    wishCount: 180,
    colors: ["black", "navy"],
  },
  {
    id: "women-outer-105",
    brand: "SSF SHOP",
    name: "블랙 포켓 자켓",
    img: "https://desfigne.synology.me/data/image/thejoeun/products/women_outer5.webp",
    desc: "편안한 핏으로 스타일리시하게 연출 가능",
    price: "149000",
    originalPrice: 169000,
    discountRate: 10,
    rating: 4.6,
    reviewCount: 46,
    wishCount: 265,
    colors: ["black"],
  },
  {
    id: "women-outer-106",
    brand: "SSF SHOP",
    name: "카키 오버핏 자켓",
    img: "https://desfigne.synology.me/data/image/thejoeun/products/women_outer6.webp",
    desc: "실용성과 멋을 동시에 갖춘 아이템",
    price: "139000",
    originalPrice: 169000,
    discountRate: 15,
    rating: 4.5,
    reviewCount: 39,
    wishCount: 221,
    colors: ["khaki", "beige"],
  },
];

// 여성 ▸ 재킷
const local_women_jacket = [
  {
    id: "women-jacket-201",
    brand: "SSF SHOP",
    name: "재킷 상품 1",
    img: "https://desfigne.synology.me/data/image/thejoeun/products/women_jacket1.webp",
    desc: "스타일리시한 재킷",
    price: "119000",
    originalPrice: 149000,
    discountRate: 20,
    rating: 4.5,
    reviewCount: 23,
    wishCount: 130,
    colors: ["grey", "black"],
  },
  {
    id: "women-jacket-202",
    brand: "SSF SHOP",
    name: "재킷 상품 2",
    img: "https://desfigne.synology.me/data/image/thejoeun/products/women_jacket2.webp",
    desc: "스타일리시한 재킷",
    price: "129000",
    originalPrice: 159000,
    discountRate: 15,
    rating: 4.4,
    reviewCount: 18,
    wishCount: 98,
    colors: ["brown", "black"],
  },
  {
    id: "women-jacket-203",
    brand: "SSF SHOP",
    name: "재킷 상품 3",
    img: "https://desfigne.synology.me/data/image/thejoeun/products/women_jacket3.webp",
    desc: "스타일리시한 재킷",
    price: "139000",
    originalPrice: 169000,
    discountRate: 15,
    rating: 4.6,
    reviewCount: 30,
    colors: ["black"],
  },
  {
    id: "women-jacket-204",
    brand: "SSF SHOP",
    name: "재킷 상품 4",
    img: "https://desfigne.synology.me/data/image/thejoeun/products/women_jacket4.webp",
    desc: "스타일리시한 재킷",
    price: "149000",
    originalPrice: 179000,
    discountRate: 15,
    rating: 4.5,
    reviewCount: 14,
    colors: ["grey"],
  },
  {
    id: "women-jacket-205",
    brand: "SSF SHOP",
    name: "재킷 상품 5",
    img: "https://desfigne.synology.me/data/image/thejoeun/products/women_jacket5.webp",
    desc: "스타일리시한 재킷",
    price: "159000",
    originalPrice: 199000,
    discountRate: 20,
    rating: 4.7,
    reviewCount: 41,
    wishCount: 260,
    colors: ["black", "brown"],
  },
  {
    id: "women-jacket-206",
    brand: "SSF SHOP",
    name: "재킷 상품 6",
    img: "https://desfigne.synology.me/data/image/thejoeun/products/women_jacket6.webp",
    desc: "스타일리시한 재킷",
    price: "169000",
    originalPrice: 209000,
    discountRate: 20,
    rating: 4.6,
    reviewCount: 37,
    colors: ["black", "grey"],
  },
];

// 여성 ▸ 니트
const local_women_knit = [
  { id: "women-knit-301", brand: "SSF SHOP", name: "니트 상품 1", img: "/images/women/knit/women_knit1.webp", desc: "스타일리시한 니트", price: "89000", originalPrice: 109000, discountRate: 18, rating: 4.4, reviewCount: 15, wishCount: 95, colors: ["beige", "black"] },
  { id: "women-knit-302", brand: "SSF SHOP", name: "니트 상품 2", img: "/images/women/knit/women_knit2.webp", desc: "스타일리시한 니트", price: "95000", originalPrice: 115000, discountRate: 17, rating: 4.5, reviewCount: 22, wishCount: 110, colors: ["grey", "white"] },
  { id: "women-knit-303", brand: "SSF SHOP", name: "니트 상품 3", img: "/images/women/knit/women_knit3.webp", desc: "스타일리시한 니트", price: "99000", originalPrice: 119000, discountRate: 17, rating: 4.3, reviewCount: 18, wishCount: 88, colors: ["navy", "beige"] },
  { id: "women-knit-304", brand: "SSF SHOP", name: "니트 상품 4", img: "/images/women/knit/women_knit4.webp", desc: "스타일리시한 니트", price: "105000", originalPrice: 129000, discountRate: 19, rating: 4.6, reviewCount: 31, wishCount: 142, colors: ["black", "grey"] },
  { id: "women-knit-305", brand: "SSF SHOP", name: "니트 상품 5", img: "/images/women/knit/women_knit5.webp", desc: "스타일리시한 니트", price: "92000", originalPrice: 112000, discountRate: 18, rating: 4.4, reviewCount: 20, wishCount: 103, colors: ["white", "cream"] },
  { id: "women-knit-306", brand: "SSF SHOP", name: "니트 상품 6", img: "/images/women/knit/women_knit6.webp", desc: "스타일리시한 니트", price: "88000", originalPrice: 108000, discountRate: 19, rating: 4.5, reviewCount: 26, wishCount: 118, colors: ["brown", "beige"] },
];

// 여성 ▸ 셔츠/블라우스
const local_women_shirt = [
  { id: "women-shirt-401", brand: "SSF SHOP", name: "셔츠 상품 1", img: "/images/women/shirt/women_shirt1.webp", desc: "스타일리시한 셔츠", price: "69000", originalPrice: 85000, discountRate: 19, rating: 4.5, reviewCount: 28, wishCount: 135, colors: ["white", "black"] },
  { id: "women-shirt-402", brand: "SSF SHOP", name: "셔츠 상품 2", img: "/images/women/shirt/women_shirt2.webp", desc: "스타일리시한 셔츠", price: "72000", originalPrice: 88000, discountRate: 18, rating: 4.4, reviewCount: 24, wishCount: 112, colors: ["blue", "white"] },
  { id: "women-shirt-403", brand: "SSF SHOP", name: "셔츠 상품 3", img: "/images/women/shirt/women_shirt3.webp", desc: "스타일리시한 셔츠", price: "75000", originalPrice: 91000, discountRate: 18, rating: 4.6, reviewCount: 34, wishCount: 156, colors: ["pink", "white"] },
  { id: "women-shirt-404", brand: "SSF SHOP", name: "셔츠 상품 4", img: "/images/women/shirt/women_shirt4.webp", desc: "스타일리시한 셔츠", price: "78000", originalPrice: 94000, discountRate: 17, rating: 4.5, reviewCount: 29, wishCount: 128, colors: ["grey", "black"] },
  { id: "women-shirt-405", brand: "SSF SHOP", name: "셔츠 상품 5", img: "/images/women/shirt/women_shirt5.webp", desc: "스타일리시한 셔츠", price: "81000", originalPrice: 97000, discountRate: 16, rating: 4.7, reviewCount: 41, wishCount: 178, colors: ["white", "cream"] },
  { id: "women-shirt-406", brand: "SSF SHOP", name: "셔츠 상품 6", img: "/images/women/shirt/women_shirt6.webp", desc: "스타일리시한 셔츠", price: "68000", originalPrice: 84000, discountRate: 19, rating: 4.4, reviewCount: 22, wishCount: 105, colors: ["black", "navy"] },
];

// 여성 ▸ 티셔츠
const local_women_tshirt = [
  { id: "women-tshirt-501", brand: "SSF SHOP", name: "티셔츠 상품 1", img: "/images/women/tshirt/women_tshirt1.webp", desc: "스타일리시한 티셔츠", price: "39000", originalPrice: 49000, discountRate: 20, rating: 4.6, reviewCount: 52, wishCount: 210, colors: ["white", "black"] },
  { id: "women-tshirt-502", brand: "SSF SHOP", name: "티셔츠 상품 2", img: "/images/women/tshirt/women_tshirt2.webp", desc: "스타일리시한 티셔츠", price: "42000", originalPrice: 52000, discountRate: 19, rating: 4.5, reviewCount: 48, wishCount: 195, colors: ["grey", "white"] },
  { id: "women-tshirt-503", brand: "SSF SHOP", name: "티셔츠 상품 3", img: "/images/women/tshirt/women_tshirt3.webp", desc: "스타일리시한 티셔츠", price: "38000", originalPrice: 48000, discountRate: 21, rating: 4.7, reviewCount: 63, wishCount: 245, colors: ["navy", "white"] },
  { id: "women-tshirt-504", brand: "SSF SHOP", name: "티셔츠 상품 4", img: "/images/women/tshirt/women_tshirt4.webp", desc: "스타일리시한 티셔츠", price: "45000", originalPrice: 55000, discountRate: 18, rating: 4.4, reviewCount: 39, wishCount: 172, colors: ["pink", "white"] },
  { id: "women-tshirt-505", brand: "SSF SHOP", name: "티셔츠 상품 5", img: "/images/women/tshirt/women_tshirt5.webp", desc: "스타일리시한 티셔츠", price: "41000", originalPrice: 51000, discountRate: 20, rating: 4.6, reviewCount: 55, wishCount: 218, colors: ["black", "grey"] },
  { id: "women-tshirt-506", brand: "SSF SHOP", name: "티셔츠 상품 6", img: "/images/women/tshirt/women_tshirt6.webp", desc: "스타일리시한 티셔츠", price: "40000", originalPrice: 50000, discountRate: 20, rating: 4.5, reviewCount: 46, wishCount: 188, colors: ["white", "cream"] },
];

// 여성 ▸ 원피스
const local_women_onepiece = [
  { id: "women-onepiece-601", brand: "SSF SHOP", name: "원피스 상품 1", img: "/images/women/onepiece/women_onepiece1.webp", desc: "스타일리시한 원피스", price: "125000", originalPrice: 155000, discountRate: 19, rating: 4.7, reviewCount: 38, wishCount: 245, colors: ["black", "navy"] },
  { id: "women-onepiece-602", brand: "SSF SHOP", name: "원피스 상품 2", img: "/images/women/onepiece/women_onepiece2.webp", desc: "스타일리시한 원피스", price: "132000", originalPrice: 162000, discountRate: 19, rating: 4.6, reviewCount: 42, wishCount: 268, colors: ["beige", "white"] },
  { id: "women-onepiece-603", brand: "SSF SHOP", name: "원피스 상품 3", img: "/images/women/onepiece/women_onepiece3.webp", desc: "스타일리시한 원피스", price: "118000", originalPrice: 148000, discountRate: 20, rating: 4.5, reviewCount: 31, wishCount: 215, colors: ["grey", "black"] },
  { id: "women-onepiece-604", brand: "SSF SHOP", name: "원피스 상품 4", img: "/images/women/onepiece/women_onepiece4.webp", desc: "스타일리시한 원피스", price: "145000", originalPrice: 175000, discountRate: 17, rating: 4.8, reviewCount: 52, wishCount: 312, colors: ["navy", "black"] },
  { id: "women-onepiece-605", brand: "SSF SHOP", name: "원피스 상품 5", img: "/images/women/onepiece/women_onepiece5.webp", desc: "스타일리시한 원피스", price: "128000", originalPrice: 158000, discountRate: 19, rating: 4.6, reviewCount: 36, wishCount: 235, colors: ["pink", "white"] },
  { id: "women-onepiece-606", brand: "SSF SHOP", name: "원피스 상품 6", img: "/images/women/onepiece/women_onepiece6.webp", desc: "스타일리시한 원피스", price: "135000", originalPrice: 165000, discountRate: 18, rating: 4.7, reviewCount: 45, wishCount: 278, colors: ["brown", "beige"] },
];

// 여성 ▸ 팬츠
const local_women_pants = [
  { id: "women-pants-701", brand: "SSF SHOP", name: "팬츠 상품 1", img: "/images/women/pants/women_pants1.webp", desc: "스타일리시한 팬츠", price: "85000", originalPrice: 105000, discountRate: 19, rating: 4.5, reviewCount: 45, wishCount: 188, colors: ["black", "navy"] },
  { id: "women-pants-702", brand: "SSF SHOP", name: "팬츠 상품 2", img: "/images/women/pants/women_pants2.webp", desc: "스타일리시한 팬츠", price: "92000", originalPrice: 112000, discountRate: 18, rating: 4.6, reviewCount: 51, wishCount: 205, colors: ["grey", "black"] },
  { id: "women-pants-703", brand: "SSF SHOP", name: "팬츠 상품 3", img: "/images/women/pants/women_pants3.webp", desc: "스타일리시한 팬츠", price: "88000", originalPrice: 108000, discountRate: 19, rating: 4.4, reviewCount: 38, wishCount: 172, colors: ["beige", "brown"] },
  { id: "women-pants-704", brand: "SSF SHOP", name: "팬츠 상품 4", img: "/images/women/pants/women_pants4.webp", desc: "스타일리시한 팬츠", price: "95000", originalPrice: 115000, discountRate: 17, rating: 4.7, reviewCount: 58, wishCount: 235, colors: ["navy", "black"] },
  { id: "women-pants-705", brand: "SSF SHOP", name: "팬츠 상품 5", img: "/images/women/pants/women_pants5.webp", desc: "스타일리시한 팬츠", price: "90000", originalPrice: 110000, discountRate: 18, rating: 4.5, reviewCount: 42, wishCount: 195, colors: ["khaki", "beige"] },
  { id: "women-pants-706", brand: "SSF SHOP", name: "팬츠 상품 6", img: "/images/women/pants/women_pants6.webp", desc: "스타일리시한 팬츠", price: "86000", originalPrice: 106000, discountRate: 19, rating: 4.6, reviewCount: 48, wishCount: 210, colors: ["black", "grey"] },
];

// 여성 ▸ 스커트
const local_women_skirt = [
  { id: "women-skirt-801", brand: "SSF SHOP", name: "스커트 상품 1", img: "/images/women/skirt/women_skirt1.webp", desc: "스타일리시한 스커트", price: "65000", originalPrice: 81000, discountRate: 20, rating: 4.5, reviewCount: 32, wishCount: 145, colors: ["black", "navy"] },
  { id: "women-skirt-802", brand: "SSF SHOP", name: "스커트 상품 2", img: "/images/women/skirt/women_skirt2.webp", desc: "스타일리시한 스커트", price: "68000", originalPrice: 84000, discountRate: 19, rating: 4.6, reviewCount: 38, wishCount: 165, colors: ["grey", "black"] },
  { id: "women-skirt-803", brand: "SSF SHOP", name: "스커트 상품 3", img: "/images/women/skirt/women_skirt3.webp", desc: "스타일리시한 스커트", price: "72000", originalPrice: 88000, discountRate: 18, rating: 4.4, reviewCount: 28, wishCount: 132, colors: ["beige", "brown"] },
  { id: "women-skirt-804", brand: "SSF SHOP", name: "스커트 상품 4", img: "/images/women/skirt/women_skirt4.webp", desc: "스타일리시한 스커트", price: "75000", originalPrice: 91000, discountRate: 18, rating: 4.7, reviewCount: 45, wishCount: 198, colors: ["navy", "black"] },
  { id: "women-skirt-805", brand: "SSF SHOP", name: "스커트 상품 5", img: "/images/women/skirt/women_skirt5.webp", desc: "스타일리시한 스커트", price: "70000", originalPrice: 86000, discountRate: 19, rating: 4.5, reviewCount: 34, wishCount: 152, colors: ["pink", "white"] },
  { id: "women-skirt-806", brand: "SSF SHOP", name: "스커트 상품 6", img: "/images/women/skirt/women_skirt6.webp", desc: "스타일리시한 스커트", price: "66000", originalPrice: 82000, discountRate: 20, rating: 4.6, reviewCount: 40, wishCount: 178, colors: ["black", "grey"] },
];

// ===== 남성 카테고리 데이터 =====
const local_men_suit = [
  { id: "men-suit-101", brand: "SSF SHOP", name: "정장 상품 1", img: "/images/men/suit/men_suit1.webp", desc: "스타일리시한 정장", price: "259000", originalPrice: 319000, discountRate: 19, rating: 4.6, reviewCount: 28, wishCount: 145, colors: ["black", "navy"] },
  { id: "men-suit-102", brand: "SSF SHOP", name: "정장 상품 2", img: "/images/men/suit/men_suit2.webp", desc: "스타일리시한 정장", price: "279000", originalPrice: 339000, discountRate: 18, rating: 4.5, reviewCount: 24, wishCount: 132, colors: ["grey", "charcoal"] },
  { id: "men-suit-103", brand: "SSF SHOP", name: "정장 상품 3", img: "/images/men/suit/men_suit3.webp", desc: "스타일리시한 정장", price: "269000", originalPrice: 329000, discountRate: 18, rating: 4.7, reviewCount: 35, wishCount: 168, colors: ["navy", "black"] },
  { id: "men-suit-104", brand: "SSF SHOP", name: "정장 상품 4", img: "/images/men/suit/men_suit4.webp", desc: "스타일리시한 정장", price: "289000", originalPrice: 349000, discountRate: 17, rating: 4.6, reviewCount: 31, wishCount: 152, colors: ["black", "grey"] },
  { id: "men-suit-105", brand: "SSF SHOP", name: "정장 상품 5", img: "/images/men/suit/men_suit5.webp", desc: "스타일리시한 정장", price: "275000", originalPrice: 335000, discountRate: 18, rating: 4.5, reviewCount: 26, wishCount: 138, colors: ["charcoal", "navy"] },
  { id: "men-suit-106", brand: "SSF SHOP", name: "정장 상품 6", img: "/images/men/suit/men_suit6.webp", desc: "스타일리시한 정장", price: "265000", originalPrice: 325000, discountRate: 18, rating: 4.6, reviewCount: 29, wishCount: 142, colors: ["black", "grey"] },
];

const local_men_jacket = [
  { id: "men-jacket-201", brand: "SSF SHOP", name: "재킷 상품 1", img: "/images/men/jacket/men_jacket1.webp", desc: "스타일리시한 재킷", price: "159000", originalPrice: 195000, discountRate: 18, rating: 4.5, reviewCount: 42, wishCount: 185, colors: ["black", "navy"] },
  { id: "men-jacket-202", brand: "SSF SHOP", name: "재킷 상품 2", img: "/images/men/jacket/men_jacket2.webp", desc: "스타일리시한 재킷", price: "169000", originalPrice: 205000, discountRate: 18, rating: 4.6, reviewCount: 38, wishCount: 172, colors: ["grey", "black"] },
  { id: "men-jacket-203", brand: "SSF SHOP", name: "재킷 상품 3", img: "/images/men/jacket/men_jacket3.webp", desc: "스타일리시한 재킷", price: "175000", originalPrice: 211000, discountRate: 17, rating: 4.4, reviewCount: 34, wishCount: 158, colors: ["navy", "charcoal"] },
  { id: "men-jacket-204", brand: "SSF SHOP", name: "재킷 상품 4", img: "/images/men/jacket/men_jacket4.webp", desc: "스타일리시한 재킷", price: "179000", originalPrice: 215000, discountRate: 17, rating: 4.7, reviewCount: 48, wishCount: 205, colors: ["black", "grey"] },
  { id: "men-jacket-205", brand: "SSF SHOP", name: "재킷 상품 5", img: "/images/men/jacket/men_jacket5.webp", desc: "스타일리시한 재킷", price: "165000", originalPrice: 201000, discountRate: 18, rating: 4.5, reviewCount: 40, wishCount: 178, colors: ["khaki", "beige"] },
  { id: "men-jacket-206", brand: "SSF SHOP", name: "재킷 상품 6", img: "/images/men/jacket/men_jacket6.webp", desc: "스타일리시한 재킷", price: "172000", originalPrice: 208000, discountRate: 17, rating: 4.6, reviewCount: 45, wishCount: 192, colors: ["navy", "black"] },
];

const local_men_shirt = [
  { id: "men-shirt-301", brand: "SSF SHOP", name: "셔츠 상품 1", img: "/images/men_shirt/men_shirt1.webp", desc: "스타일리시한 셔츠", price: "65000", originalPrice: 81000, discountRate: 20, rating: 4.5, reviewCount: 35, wishCount: 148, colors: ["white", "blue"] },
  { id: "men-shirt-302", brand: "SSF SHOP", name: "셔츠 상품 2", img: "/images/men_shirt/men_shirt2.webp", desc: "스타일리시한 셔츠", price: "68000", originalPrice: 84000, discountRate: 19, rating: 4.6, reviewCount: 42, wishCount: 165, colors: ["pink", "white"] },
  { id: "men-shirt-303", brand: "SSF SHOP", name: "셔츠 상품 3", img: "/images/men_shirt/men_shirt3.webp", desc: "스타일리시한 셔츠", price: "72000", originalPrice: 88000, discountRate: 18, rating: 4.4, reviewCount: 31, wishCount: 138, colors: ["grey", "black"] },
  { id: "men-shirt-304", brand: "SSF SHOP", name: "셔츠 상품 4", img: "/images/men_shirt/men_shirt4.webp", desc: "스타일리시한 셔츠", price: "70000", originalPrice: 86000, discountRate: 19, rating: 4.7, reviewCount: 48, wishCount: 185, colors: ["white", "blue"] },
  { id: "men-shirt-305", brand: "SSF SHOP", name: "셔츠 상품 5", img: "/images/men_shirt/men_shirt5.webp", desc: "스타일리시한 셔츠", price: "66000", originalPrice: 82000, discountRate: 20, rating: 4.5, reviewCount: 38, wishCount: 152, colors: ["navy", "white"] },
  { id: "men-shirt-306", brand: "SSF SHOP", name: "셔츠 상품 6", img: "/images/men_shirt/men_shirt6.webp", desc: "스타일리시한 셔츠", price: "69000", originalPrice: 85000, discountRate: 19, rating: 4.6, reviewCount: 44, wishCount: 172, colors: ["black", "grey"] },
];

// ===== 키즈 카테고리 데이터 =====
const local_kids_boy = [
  { id: "kids-boy-101", brand: "SSF SHOP", name: "남아 상품 1", img: "/images/kids/boy/kids_boy1.webp", desc: "스타일리시한 키즈 의류", price: "45000", originalPrice: 56000, discountRate: 20, rating: 4.6, reviewCount: 28, wishCount: 122, colors: ["blue", "grey"] },
  { id: "kids-boy-102", brand: "SSF SHOP", name: "남아 상품 2", img: "/images/kids/boy/kids_boy2.webp", desc: "스타일리시한 키즈 의류", price: "48000", originalPrice: 59000, discountRate: 19, rating: 4.5, reviewCount: 24, wishCount: 108, colors: ["navy", "black"] },
  { id: "kids-boy-103", brand: "SSF SHOP", name: "남아 상품 3", img: "/images/kids/boy/kids_boy3.webp", desc: "스타일리시한 키즈 의류", price: "52000", originalPrice: 63000, discountRate: 17, rating: 4.7, reviewCount: 32, wishCount: 145, colors: ["grey", "white"] },
  { id: "kids-boy-104", brand: "SSF SHOP", name: "남아 상품 4", img: "/images/kids/boy/kids_boy4.webp", desc: "스타일리시한 키즈 의류", price: "50000", originalPrice: 61000, discountRate: 18, rating: 4.5, reviewCount: 26, wishCount: 115, colors: ["black", "navy"] },
  { id: "kids-boy-105", brand: "SSF SHOP", name: "남아 상품 5", img: "/images/kids/boy/kids_boy5.webp", desc: "스타일리시한 키즈 의류", price: "46000", originalPrice: 57000, discountRate: 19, rating: 4.6, reviewCount: 30, wishCount: 128, colors: ["blue", "grey"] },
  { id: "kids-boy-106", brand: "SSF SHOP", name: "남아 상품 6", img: "/images/kids/boy/kids_boy6.webp", desc: "스타일리시한 키즈 의류", price: "49000", originalPrice: 60000, discountRate: 18, rating: 4.4, reviewCount: 22, wishCount: 102, colors: ["grey", "black"] },
];

const local_kids_girl = [
  { id: "kids-girl-101", brand: "SSF SHOP", name: "여아 상품 1", img: "/images/kids/girl/kids_girl1.webp", desc: "스타일리시한 키즈 의류", price: "48000", originalPrice: 59000, discountRate: 19, rating: 4.7, reviewCount: 35, wishCount: 152, colors: ["pink", "white"] },
  { id: "kids-girl-102", brand: "SSF SHOP", name: "여아 상품 2", img: "/images/kids/girl/kids_girl2.webp", desc: "스타일리시한 키즈 의류", price: "52000", originalPrice: 63000, discountRate: 17, rating: 4.6, reviewCount: 42, wishCount: 168, colors: ["beige", "pink"] },
  { id: "kids-girl-103", brand: "SSF SHOP", name: "여아 상품 3", img: "/images/kids/girl/kids_girl3.webp", desc: "스타일리시한 키즈 의류", price: "50000", originalPrice: 61000, discountRate: 18, rating: 4.5, reviewCount: 38, wishCount: 145, colors: ["white", "cream"] },
  { id: "kids-girl-104", brand: "SSF SHOP", name: "여아 상품 4", img: "/images/kids/girl/kids_girl4.webp", desc: "스타일리시한 키즈 의류", price: "55000", originalPrice: 66000, discountRate: 17, rating: 4.8, reviewCount: 48, wishCount: 185, colors: ["pink", "white"] },
  { id: "kids-girl-105", brand: "SSF SHOP", name: "여아 상품 5", img: "/images/kids/girl/kids_girl5.webp", desc: "스타일리시한 키즈 의류", price: "49000", originalPrice: 60000, discountRate: 18, rating: 4.6, reviewCount: 40, wishCount: 158, colors: ["beige", "white"] },
  { id: "kids-girl-106", brand: "SSF SHOP", name: "여아 상품 6", img: "/images/kids/girl/kids_girl6.webp", desc: "스타일리시한 키즈 의류", price: "51000", originalPrice: 62000, discountRate: 18, rating: 4.5, reviewCount: 32, wishCount: 138, colors: ["pink", "cream"] },
];

// ===== 뷰티 카테고리 데이터 =====
const local_beauty_skin = [
  { id: "beauty-skin-101", brand: "BEAUTY SHOP", name: "스킨케어 상품 1", img: "/images/beauty/Skin/beauty_skin1.webp", desc: "프리미엄 스킨케어", price: "55000", originalPrice: 68000, discountRate: 19, rating: 4.7, reviewCount: 62, wishCount: 245, colors: [] },
  { id: "beauty-skin-102", brand: "BEAUTY SHOP", name: "스킨케어 상품 2", img: "/images/beauty/Skin/beauty_skin2.webp", desc: "프리미엄 스킨케어", price: "62000", originalPrice: 75000, discountRate: 17, rating: 4.6, reviewCount: 58, wishCount: 228, colors: [] },
  { id: "beauty-skin-103", brand: "BEAUTY SHOP", name: "스킨케어 상품 3", img: "/images/beauty/Skin/beauty_skin3.webp", desc: "프리미엄 스킨케어", price: "58000", originalPrice: 71000, discountRate: 18, rating: 4.5, reviewCount: 52, wishCount: 212, colors: [] },
  { id: "beauty-skin-104", brand: "BEAUTY SHOP", name: "스킨케어 상품 4", img: "/images/beauty/Skin/beauty_skin4.webp", desc: "프리미엄 스킨케어", price: "65000", originalPrice: 78000, discountRate: 17, rating: 4.8, reviewCount: 72, wishCount: 278, colors: [] },
  { id: "beauty-skin-105", brand: "BEAUTY SHOP", name: "스킨케어 상품 5", img: "/images/beauty/Skin/beauty_skin5.webp", desc: "프리미엄 스킨케어", price: "60000", originalPrice: 73000, discountRate: 18, rating: 4.6, reviewCount: 65, wishCount: 252, colors: [] },
  { id: "beauty-skin-106", brand: "BEAUTY SHOP", name: "스킨케어 상품 6", img: "/images/beauty/Skin/beauty_skin6.webp", desc: "프리미엄 스킨케어", price: "56000", originalPrice: 69000, discountRate: 19, rating: 4.5, reviewCount: 48, wishCount: 198, colors: [] },
];

const local_beauty_makeup = [
  { id: "beauty-makeup-201", brand: "BEAUTY SHOP", name: "메이크업 상품 1", img: "/images/Beauty/Makeup/beauty_makeup1.webp", desc: "프리미엄 메이크업", price: "42000", originalPrice: 52000, discountRate: 19, rating: 4.6, reviewCount: 48, wishCount: 195, colors: [] },
  { id: "beauty-makeup-202", brand: "BEAUTY SHOP", name: "메이크업 상품 2", img: "/images/Beauty/Makeup/beauty_makeup2.webp", desc: "프리미엄 메이크업", price: "48000", originalPrice: 58000, discountRate: 17, rating: 4.7, reviewCount: 55, wishCount: 218, colors: [] },
  { id: "beauty-makeup-203", brand: "BEAUTY SHOP", name: "메이크업 상품 3", img: "/images/Beauty/Makeup/beauty_makeup3.webp", desc: "프리미엄 메이크업", price: "45000", originalPrice: 55000, discountRate: 18, rating: 4.5, reviewCount: 42, wishCount: 178, colors: [] },
  { id: "beauty-makeup-204", brand: "BEAUTY SHOP", name: "메이크업 상품 4", img: "/images/Beauty/Makeup/beauty_makeup4.webp", desc: "프리미엄 메이크업", price: "52000", originalPrice: 62000, discountRate: 16, rating: 4.8, reviewCount: 68, wishCount: 245, colors: [] },
  { id: "beauty-makeup-205", brand: "BEAUTY SHOP", name: "메이크업 상품 5", img: "/images/Beauty/Makeup/beauty_makeup5.webp", desc: "프리미엄 메이크업", price: "46000", originalPrice: 56000, discountRate: 18, rating: 4.6, reviewCount: 52, wishCount: 205, colors: [] },
  { id: "beauty-makeup-206", brand: "BEAUTY SHOP", name: "메이크업 상품 6", img: "/images/Beauty/Makeup/beauty_makeup6.webp", desc: "프리미엄 메이크업", price: "44000", originalPrice: 54000, discountRate: 19, rating: 4.5, reviewCount: 38, wishCount: 165, colors: [] },
];

// ===== 골프 카테고리 데이터 =====
const local_golf_women = [
  { id: "golf-women-101", brand: "GOLF SHOP", name: "골프 여성 상품 1", img: "/images/Golf/women/golf_women1.webp", desc: "프리미엄 골프웨어", price: "89000", originalPrice: 109000, discountRate: 18, rating: 4.6, reviewCount: 32, wishCount: 152, colors: ["white", "pink"] },
  { id: "golf-women-102", brand: "GOLF SHOP", name: "골프 여성 상품 2", img: "/images/Golf/women/golf_women2.webp", desc: "프리미엄 골프웨어", price: "95000", originalPrice: 115000, discountRate: 17, rating: 4.7, reviewCount: 38, wishCount: 168, colors: ["navy", "white"] },
  { id: "golf-women-103", brand: "GOLF SHOP", name: "골프 여성 상품 3", img: "/images/Golf/women/golf_women3.webp", desc: "프리미엄 골프웨어", price: "92000", originalPrice: 112000, discountRate: 18, rating: 4.5, reviewCount: 28, wishCount: 135, colors: ["beige", "white"] },
  { id: "golf-women-104", brand: "GOLF SHOP", name: "골프 여성 상품 4", img: "/images/Golf/women/golf_women4.webp", desc: "프리미엄 골프웨어", price: "99000", originalPrice: 119000, discountRate: 17, rating: 4.8, reviewCount: 45, wishCount: 192, colors: ["pink", "white"] },
  { id: "golf-women-105", brand: "GOLF SHOP", name: "골프 여성 상품 5", img: "/images/Golf/women/golf_women5.webp", desc: "프리미엄 골프웨어", price: "88000", originalPrice: 108000, discountRate: 19, rating: 4.6, reviewCount: 35, wishCount: 158, colors: ["white", "navy"] },
  { id: "golf-women-106", brand: "GOLF SHOP", name: "골프 여성 상품 6", img: "/images/Golf/women/golf_women6.webp", desc: "프리미엄 골프웨어", price: "94000", originalPrice: 114000, discountRate: 18, rating: 4.5, reviewCount: 30, wishCount: 142, colors: ["beige", "pink"] },
];

// ===== 스포츠 카테고리 데이터 =====
const local_sports_running = [
  { id: "sports-running-101", brand: "SPORTS SHOP", name: "러닝 상품 1", img: "/images/sports/running/sports_running1.webp", desc: "프리미엄 러닝웨어", price: "65000", originalPrice: 81000, discountRate: 20, rating: 4.7, reviewCount: 58, wishCount: 235, colors: ["black", "white"] },
  { id: "sports-running-102", brand: "SPORTS SHOP", name: "러닝 상품 2", img: "/images/sports/running/sports_running2.webp", desc: "프리미엄 러닝웨어", price: "68000", originalPrice: 84000, discountRate: 19, rating: 4.6, reviewCount: 52, wishCount: 215, colors: ["navy", "grey"] },
  { id: "sports-running-103", brand: "SPORTS SHOP", name: "러닝 상품 3", img: "/images/sports/running/sports_running3.webp", desc: "프리미엄 러닝웨어", price: "72000", originalPrice: 88000, discountRate: 18, rating: 4.5, reviewCount: 45, wishCount: 192, colors: ["grey", "black"] },
  { id: "sports-running-104", brand: "SPORTS SHOP", name: "러닝 상품 4", img: "/images/sports/running/sports_running4.webp", desc: "프리미엄 러닝웨어", price: "70000", originalPrice: 86000, discountRate: 19, rating: 4.8, reviewCount: 68, wishCount: 268, colors: ["black", "white"] },
  { id: "sports-running-105", brand: "SPORTS SHOP", name: "러닝 상품 5", img: "/images/sports/running/sports_running5.webp", desc: "프리미엄 러닝웨어", price: "66000", originalPrice: 82000, discountRate: 20, rating: 4.6, reviewCount: 55, wishCount: 228, colors: ["navy", "white"] },
  { id: "sports-running-106", brand: "SPORTS SHOP", name: "러닝 상품 6", img: "/images/sports/running/sports_running6.webp", desc: "프리미엄 러닝웨어", price: "69000", originalPrice: 85000, discountRate: 19, rating: 4.5, reviewCount: 48, wishCount: 205, colors: ["grey", "black"] },
];

const local_sports_outdoor = [
  { id: "sports-outdoor-201", brand: "SPORTS SHOP", name: "아웃도어 상품 1", img: "/images/sprots/outdoor/sports_outdoor1.webp", desc: "프리미엄 아웃도어", price: "125000", originalPrice: 155000, discountRate: 19, rating: 4.6, reviewCount: 42, wishCount: 188, colors: ["black", "navy"] },
  { id: "sports-outdoor-202", brand: "SPORTS SHOP", name: "아웃도어 상품 2", img: "/images/sprots/outdoor/sports_outdoor2.webp", desc: "프리미엄 아웃도어", price: "135000", originalPrice: 165000, discountRate: 18, rating: 4.7, reviewCount: 48, wishCount: 205, colors: ["khaki", "black"] },
  { id: "sports-outdoor-203", brand: "SPORTS SHOP", name: "아웃도어 상품 3", img: "/images/sprots/outdoor/sports_outdoor3.webp", desc: "프리미엄 아웃도어", price: "130000", originalPrice: 160000, discountRate: 19, rating: 4.5, reviewCount: 38, wishCount: 172, colors: ["navy", "grey"] },
  { id: "sports-outdoor-204", brand: "SPORTS SHOP", name: "아웃도어 상품 4", img: "/images/sprots/outdoor/sports_outdoor4.webp", desc: "프리미엄 아웃도어", price: "145000", originalPrice: 175000, discountRate: 17, rating: 4.8, reviewCount: 55, wishCount: 235, colors: ["black", "khaki"] },
  { id: "sports-outdoor-205", brand: "SPORTS SHOP", name: "아웃도어 상품 5", img: "/images/sprots/outdoor/sports_outdoor5.webp", desc: "프리미엄 아웃도어", price: "128000", originalPrice: 158000, discountRate: 19, rating: 4.6, reviewCount: 45, wishCount: 198, colors: ["navy", "black"] },
  { id: "sports-outdoor-206", brand: "SPORTS SHOP", name: "아웃도어 상품 6", img: "/images/sprots/outdoor/sports_outdoor6.webp", desc: "프리미엄 아웃도어", price: "132000", originalPrice: 162000, discountRate: 19, rating: 4.5, reviewCount: 40, wishCount: 182, colors: ["grey", "black"] },
];

// ===== 럭셔리 카테고리 데이터 =====
const local_luxury_women = [
  { id: "luxury-women-101", brand: "LUXURY BRAND", name: "럭셔리 여성 상품 1", img: "/images/luxury/women/luxury_women1.webp", desc: "프리미엄 럭셔리", price: "458000", originalPrice: 550000, discountRate: 17, rating: 4.8, reviewCount: 28, wishCount: 245, colors: ["black"] },
  { id: "luxury-women-102", brand: "LUXURY BRAND", name: "럭셔리 여성 상품 2", img: "/images/luxury/women/luxury_women2.webp", desc: "프리미엄 럭셔리", price: "485000", originalPrice: 580000, discountRate: 16, rating: 4.7, reviewCount: 32, wishCount: 268, colors: ["beige"] },
  { id: "luxury-women-103", brand: "LUXURY BRAND", name: "럭셔리 여성 상품 3", img: "/images/luxury/women/luxury_women3.webp", desc: "프리미엄 럭셔리", price: "472000", originalPrice: 565000, discountRate: 16, rating: 4.6, reviewCount: 25, wishCount: 228, colors: ["navy"] },
  { id: "luxury-women-104", brand: "LUXURY BRAND", name: "럭셔리 여성 상품 4", img: "/images/luxury/women/luxury_women4.webp", desc: "프리미엄 럭셔리", price: "510000", originalPrice: 610000, discountRate: 16, rating: 4.9, reviewCount: 38, wishCount: 312, colors: ["black"] },
  { id: "luxury-women-105", brand: "LUXURY BRAND", name: "럭셔리 여성 상품 5", img: "/images/luxury/women/luxury_women5.webp", desc: "프리미엄 럭셔리", price: "465000", originalPrice: 558000, discountRate: 17, rating: 4.7, reviewCount: 30, wishCount: 252, colors: ["beige"] },
  { id: "luxury-women-106", brand: "LUXURY BRAND", name: "럭셔리 여성 상품 6", img: "/images/luxury/women/luxury_women6.webp", desc: "프리미엄 럭셔리", price: "495000", originalPrice: 590000, discountRate: 16, rating: 4.6, reviewCount: 26, wishCount: 235, colors: ["navy"] },
];

// (옵션) 외부 샘플
const sampleProducts = [
  {
    id: 1,
    brand: "BEAKER ORIGINAL",
    name: "Women Bandana Pattern Quilted Jumper - Black",
    img: "https://image.msscdn.net/images/goods_img/20231113/3658826/3658826_17077044817712_500.jpg",
    desc: "Women Bandana Pattern Quilted Jumper",
    price: "517750",
    originalPrice: 545000,
    discountRate: 5,
    rating: 4.5,
    reviewCount: 64,
    wishCount: 999,
    colors: ["black", "navy"],
  },
];

/**
 * ProductList 함수형 컴포넌트
 *
 * @description
 * 카테고리별 상품 목록과 검색 결과를 통합 처리하는 메인 페이지 컴포넌트.
 *
 * 【처리 흐름】
 * 1. **경로 파싱**: location.pathname에서 카테고리/서브카테고리 추출
 * 2. **검색 모드 감지**: /search로 시작하면 검색 모드, 아니면 카테고리 모드
 * 3. **데이터 로드**: 카테고리 모드는 localByCategory에서, 검색 모드는 전체 상품에서
 * 4. **필터링**: 검색어가 있으면 name/desc 필터링 (스코어링 방식)
 * 5. **정렬**: sortBy에 따라 가격/할인율/리뷰 정렬
 * 6. **렌더링**: 상품 그리드 + 위시리스트 버튼 + 이미지 폴백
 *
 * 【주요 State】
 * - activeTab: 현재 활성 탭 ("전체", "코트", "점퍼" 등)
 * - sortBy: 정렬 기준 ("인기상품순", "낮은가격순", "높은가격순" 등)
 * - refresh: 위시리스트 토글 시 화면 갱신용 카운터
 *
 * 【주요 함수】
 * - handleProductClick: 상품 클릭 시 상세 페이지 이동 (localStorage 저장)
 * - toggleWishlist: 위시리스트 추가/제거 (StorageEvent 발행)
 * - sortProducts: 정렬 로직 (가격/할인율/리뷰)
 * - handleImgError: 이미지 로드 실패 시 후보 경로 순차 시도
 *
 * 【경로 파싱 예시】
 * - /women/outer → category: "women", subcategory: "outer"
 * - /search/자켓 → isSearchMode: true, searchKeyword: "자켓"
 * - /search?q=티셔츠 → isSearchMode: true, searchKeyword: "티셔츠"
 *
 * @returns {JSX.Element} 상품 목록 페이지 UI
 */
export default function ProductList() {
  const location = useLocation();
  const navigate = useNavigate();

  // ===== 경로 파싱: /women/outer, /search/키워드, /search?q=
  const pathParts = location.pathname.split("/").filter(Boolean);
  const first = pathParts[0] || "women";
  const isSearchMode = first === "search";
  const category = isSearchMode ? "" : first;
  const subcategory = isSearchMode ? "" : pathParts[1] || "";

  // 검색어 파싱
  const searchKeyword = useMemo(() => {
    if (!isSearchMode) return "";
    const fromPath = pathParts[1] ? decodeURIComponent(pathParts[1]) : "";
    const fromQuery = new URLSearchParams(location.search).get("q") || "";
    return (fromPath || fromQuery || "").trim();
  }, [isSearchMode, pathParts, location.search]);

  // 상태
  const [activeTab, setActiveTab] = useState("전체");
  const [sortBy, setSortBy] = useState("인기상품순(전체)");
  const [refresh, setRefresh] = useState(0); // 위시 토글 반영용

  // 카테고리/탭 메타 (Header의 모든 카테고리 지원)
  const categoryInfo = {
    women: { name: "여성", nameEn: "WOMEN" },
    men: { name: "남성", nameEn: "MEN" },
    kids: { name: "키즈", nameEn: "KIDS" },
    beauty: { name: "뷰티", nameEn: "BEAUTY" },
    sports: { name: "스포츠", nameEn: "SPORTS" },
    golf: { name: "골프", nameEn: "GOLF" },
    life: { name: "라이프", nameEn: "LIFE" },
    luxury: { name: "럭셔리", nameEn: "LUXURY" },
    "bags-shoes": { name: "백&슈즈", nameEn: "BAGS & SHOES" },
    outlet: { name: "아울렛", nameEn: "OUTLET" },
  };

  const subcategoryInfo = {
    "": { name: "전체", tabs: ["전체"] },  // subcategory가 없을 때
    all: { name: "전체 상품", tabs: ["전체"] },
    new: { name: "신상품", tabs: ["전체"] },
    outer: { name: "아우터", tabs: ["전체", "코트", "점퍼", "다운/패딩", "퍼"] },
    jacket: { name: "재킷/베스트", tabs: ["전체", "블레이저", "베스트", "라이더", "기타"] },
    knit: { name: "니트웨어", tabs: ["전체", "카디건", "니트", "베스트"] },
    shirt: { name: "셔츠/블라우스", tabs: ["전체", "셔츠", "블라우스"] },
    tshirt: { name: "티셔츠", tabs: ["전체", "반팔", "긴팔", "민소매"] },
    onepiece: { name: "원피스", tabs: ["전체", "미니", "미디", "롱"] },
    pants: { name: "팬츠", tabs: ["전체", "청바지", "슬랙스", "레깅스", "기타"] },
    skirt: { name: "스커트", tabs: ["전체", "미니", "미디", "롱"] },
    suit: { name: "정장", tabs: ["전체"] },
    boy: { name: "남아", tabs: ["전체"] },
    girl: { name: "여아", tabs: ["전체"] },
    skin: { name: "스킨케어", tabs: ["전체"] },
    makeup: { name: "메이크업", tabs: ["전체"] },
    running: { name: "러닝", tabs: ["전체"] },
    outdoor: { name: "아웃도어", tabs: ["전체"] },
  };

  // 로컬 묶음 테이블
  const localByCategory = {
    women: {
      outer: local_women_outer,
      jacket: local_women_jacket,
      knit: local_women_knit,
      shirt: local_women_shirt,
      tshirt: local_women_tshirt,
      onepiece: local_women_onepiece,
      pants: local_women_pants,
      skirt: local_women_skirt,
    },
    men: {
      suit: local_men_suit,
      jacket: local_men_jacket,
      shirt: local_men_shirt,
    },
    kids: {
      boy: local_kids_boy,
      girl: local_kids_girl,
    },
    beauty: {
      skin: local_beauty_skin,
      makeup: local_beauty_makeup,
    },
    golf: {
      women: local_golf_women,
    },
    sports: {
      running: local_sports_running,
      outdoor: local_sports_outdoor,
    },
    luxury: {
      women: local_luxury_women,
    },
  };

  // 카테고리 페이지용 데이터
  const getProductsByCategory = () => {
    // subcategory가 없거나 "all" 또는 "new"인 경우: 해당 카테고리의 모든 상품 반환
    if (!subcategory || subcategory === "all" || subcategory === "new") {
      if (!localByCategory[category]) return [...sampleProducts];
      const allProducts = Object.values(localByCategory[category]).flat();
      return [...sampleProducts, ...allProducts];
    }

    // 특정 subcategory의 상품만 반환
    const locals =
      (localByCategory[category] && localByCategory[category][subcategory]) ||
      [];
    return [...sampleProducts, ...locals];
  };

  // 검색 전체 집합(모든 카테고리 + 샘플)
  const getAllProductsForSearch = () => {
    const allProducts = [];
    Object.values(localByCategory).forEach(categoryObj => {
      Object.values(categoryObj).forEach(subcategoryArray => {
        allProducts.push(...subcategoryArray);
      });
    });
    return [...sampleProducts, ...allProducts];
  };

  // 가격 포맷
  const formatPrice = (price) => {
    if (typeof price === "string") return price;
    return `₩${Number(price || 0).toLocaleString()}`;
  };

  // 상세 페이지 이동
  const handleProductClick = (product) => {
    const normalized = {
      id: product.id,
      name: product.name || "상품명 없음",
      image: product.image || product.img || "",
      img: product.image || product.img || "",
      price:
        typeof product.price === "string"
          ? toNumberPrice(product.price)
          : Number(product.price || 0),
      desc: product.desc || "",
      brand: product.brand || "",
      rating: product.rating || 0,
      reviewCount: product.reviewCount || 0,
    };
    storage.set("lastProduct", normalized);
    navigate(`/product/${normalized.id}`, { product: normalized });
  };

  // ===== 위시리스트 =====
  const readWishlist = () => {
    return storage.get("wishlist", []);
  };
  const isWished = (id) =>
    readWishlist().some((p) => String(p.id) === String(id));

  const toggleWishlist = (e, product) => {
    e.stopPropagation();
    const data = {
      id: product.id,
      name: product.name,
      img: product.image || product.img || "",
      price: product.price,
      brand: product.brand || "",
    };
    let list = readWishlist();
    if (isWished(product.id)) {
      list = list.filter((p) => String(p.id) !== String(product.id));
    } else {
      list.unshift(data);
    }
    storage.set("wishlist", list);
    try {
      window.dispatchEvent(new StorageEvent("storage", { key: "wishlist", newValue: JSON.stringify(list) }));
    } catch {}
    setRefresh((n) => n + 1);
  };

  // ===== 정렬 =====
  const sortProducts = (arr) => {
    const cp = [...arr];
    switch (sortBy) {
      case "낮은가격순":
        return cp.sort((a, b) => toNumberPrice(a.price) - toNumberPrice(b.price));
      case "높은가격순":
        return cp.sort((a, b) => toNumberPrice(b.price) - toNumberPrice(a.price));
      case "할인율순":
        return cp.sort((a, b) => (b.discountRate || 0) - (a.discountRate || 0));
      case "리뷰많은순":
        return cp.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
      default:
        return cp; // 인기상품순(전체)
    }
  };

  // ===== 최종 리스트 =====
  const baseProducts = useMemo(() => {
    return isSearchMode ? getAllProductsForSearch() : getProductsByCategory();
  }, [isSearchMode, category, subcategory, refresh]); // eslint-disable-line

  const normalizeText = (s) => (s || "").toLowerCase().replace(/\s+/g, "");
  const filteredProducts = useMemo(() => {
    let list = baseProducts;
    if (isSearchMode && searchKeyword) {
      const key = normalizeText(searchKeyword);
      list = baseProducts
        .map((p) => {
          const n = normalizeText(p.name || "");
          const exact = n === key ? 1 : 0;
          const includes = n.includes(key) ? 1 : 0;
          return { p, score: exact * 2 + includes };
        })
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((x) => x.p);
    }
    return sortProducts(list);
  }, [baseProducts, isSearchMode, searchKeyword, sortBy]); // eslint-disable-line

  const productsToShow = filteredProducts;

  // 화면용 메타
  const currentCategory =
    categoryInfo[category] || {
      name: category || "검색",
      nameEn: (category || "SEARCH").toUpperCase(),
    };
  const currentSubcategory =
    subcategoryInfo[subcategory] || { name: subcategory || "검색 결과", tabs: ["전체"] };

  // 공통 onError 핸들러: 후보 경로 순차 시도
  const handleImgError = (e) => {
    const img = e.currentTarget;
    const rest = img.dataset.candidates
      ? JSON.parse(img.dataset.candidates)
      : [];
    if (rest.length > 0) {
      const next = rest.shift();
      img.dataset.candidates = JSON.stringify(rest);
      img.src = next;
    } else {
      img.onerror = null;
      img.src = `${process.env.PUBLIC_URL}/images/placeholder.png`;
    }
  };

  return (
    <div className="category-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="container">
          <Link to="/">Home</Link>
          <span className="separator">&gt;</span>
          {!isSearchMode ? (
            <>
              <Link to={`/${category}`}>{currentCategory.name}</Link>
              <span className="separator">&gt;</span>
              <span className="current">{currentSubcategory.name}</span>
            </>
          ) : (
            <span className="current">검색</span>
          )}
        </div>
      </div>

      <div className="container">
        {/* Page Title */}
        <div className="page-header">
          {!isSearchMode ? (
            <h1 className="page-title">
              {currentSubcategory.name}{" "}
              <span className="count">{productsToShow.length}개 상품</span>
            </h1>
          ) : (
            <h1 className="page-title">
              ‘{searchKeyword}’ 검색 결과{" "}
              <span className="count">{productsToShow.length}개 상품</span>
            </h1>
          )}
        </div>

        {/* Tabs */}
        {!isSearchMode && subcategory && subcategory !== "all" && subcategory !== "new" && (
          <div className="category-tabs">
            {(currentSubcategory.tabs || ["전체"]).map((tab) => (
              <button
                key={tab}
                className={`tab ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        )}

        {/* Filters / Sort */}
        <div className="filter-section">
          {!isSearchMode ? (
            <div className="filter-buttons">
              <div className="filter-dropdown">
                <button className="filter-btn">
                  브랜드 <span className="arrow">∨</span>
                </button>
              </div>
              <div className="filter-dropdown">
                <button className="filter-btn">
                  가격 <span className="arrow">∨</span>
                </button>
              </div>
              <div className="filter-dropdown">
                <button className="filter-btn">
                  사이즈 <span className="arrow">∨</span>
                </button>
              </div>
              <div className="filter-dropdown">
                <button className="filter-btn">
                  색상 <span className="arrow">∨</span>
                </button>
              </div>
              <div className="filter-dropdown">
                <button className="filter-btn">
                  혜택/배송 <span className="arrow">∨</span>
                </button>
              </div>
            </div>
          ) : (
            <div />
          )}

          <div className="sort-section">
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option>인기상품순(전체)</option>
              <option>신상품순</option>
              <option>낮은가격순</option>
              <option>높은가격순</option>
              <option>할인율순</option>
              <option>리뷰많은순</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="product-grid">
          {productsToShow.length === 0 ? (
            <p className="no-result">검색 결과가 없습니다.</p>
          ) : (
            productsToShow.map((product) => {
              const { src, candidates } = srcOf(product);
              const wished = isWished(product.id);
              return (
                <div key={product.id} className="product-card">
                  <div
                    className="product-image-link"
                    onClick={() => handleProductClick(product)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="product-image-wrapper">
                      <img
                        src={src}
                        alt={product.name}
                        className="product-image"
                        loading="lazy"
                        data-candidates={JSON.stringify(candidates)}
                        onError={handleImgError}
                      />
                      <button
                        className={`wishlist-btn ${wished ? "active" : ""}`}
                        aria-label="찜하기"
                        onClick={(e) => toggleWishlist(e, product)}
                        title={wished ? "위시리스트에서 제거" : "위시리스트에 추가"}
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill={wished ? "currentColor" : "none"}>
                          <path
                            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="product-info">
                    <div className="product-brand">{product.brand}</div>
                    <div
                      className="product-name"
                      onClick={() => handleProductClick(product)}
                      style={{ cursor: "pointer" }}
                    >
                      {product.name}
                    </div>

                    <div className="product-price">
                      {product.discountRate > 0 && (
                        <>
                          <span className="original-price">
                            {formatPrice(product.originalPrice)}
                          </span>
                          <span className="discount-rate">{product.discountRate}%</span>
                        </>
                      )}
                      <span className="price">{formatPrice(product.price)}</span>
                    </div>

                    {product.rating && (
                      <div className="product-meta">
                        <div className="rating-reviews">
                          <span className="rating">★ {product.rating}({product.reviewCount || 0})</span>
                          {product.wishCount && <span className="wishlist">♥ {product.wishCount}+</span>}
                        </div>
                      </div>
                    )}

                    {product.colors && product.colors.length > 0 && (
                      <div className="product-colors">
                        {product.colors.map((color, idx) => (
                          <span
                            key={idx}
                            className="color-dot"
                            style={{
                              backgroundColor:
                                color === "black" ? "#000"
                                  : color === "white" ? "#fff"
                                  : color === "navy" ? "#001f3f"
                                  : color === "beige" ? "#f5f5dc"
                                  : color === "brown" ? "#8b4513"
                                  : color === "orange" ? "#ff6600"
                                  : color === "pink" ? "#ff69b4"
                                  : color === "blue" ? "#0074d9"
                                  : color === "grey" ? "#808080"
                                  : color === "khaki" ? "#c3b091"
                                  : color === "charcoal" ? "#36454f"
                                  : color,
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination (목업) */}
        <div className="pagination">
          <button className="page-btn">&lt;</button>
          <button className="page-btn active">1</button>
          <button className="page-btn">2</button>
          <button className="page-btn">3</button>
          <button className="page-btn">4</button>
          <button className="page-btn">5</button>
          <button className="page-btn">&gt;</button>
        </div>
      </div>
    </div>
  );
}
