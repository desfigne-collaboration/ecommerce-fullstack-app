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
import "./CategoryPage.css";
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

// ===== 추가된 상품 데이터 (집 프로젝트에서 통합) =====

// 여성 ▸ 라운지웨어
const local_women_loungewear = [
  { id: "women-loungewear-101", brand: "SIE", name: "홈웨어 세트", img: "https://desfigne.synology.me/data/image/thejoeun/products/women_loungewear1.webp", desc: "편안한 홈웨어 상하 세트", price: "79000", originalPrice: 109000, discountRate: 28, rating: 4.3, reviewCount: 39, wishCount: 114, colors: ["default"] },
  { id: "women-loungewear-102", brand: "VICTORIA", name: "레이스 속옷 세트", img: "https://desfigne.synology.me/data/image/thejoeun/products/women_loungewear2.webp", desc: "우아한 레이스 언더웨어", price: "59000", originalPrice: 89000, discountRate: 34, rating: 4.6, reviewCount: 31, wishCount: 70, colors: ["default"] },
  { id: "women-loungewear-103", brand: "EBLIN", name: "실크 파자마", img: "https://desfigne.synology.me/data/image/thejoeun/products/women_loungewear3.webp", desc: "부드러운 실크 잠옷", price: "129000", originalPrice: 179000, discountRate: 28, rating: 4.4, reviewCount: 39, wishCount: 156, colors: ["default"] },
  { id: "women-loungewear-104", brand: "UNIQLO", name: "코튼 브라렛", img: "https://desfigne.synology.me/data/image/thejoeun/products/women_loungewear4.webp", desc: "편안한 무와이어 브라", price: "35000", originalPrice: 49000, discountRate: 29, rating: 4.2, reviewCount: 56, wishCount: 291, colors: ["default"] },
  { id: "women-loungewear-105", brand: "SIE", name: "라운지 가디건", img: "https://desfigne.synology.me/data/image/thejoeun/products/women_loungewear5.webp", desc: "부드러운 라운지 가디건", price: "89000", originalPrice: 119000, discountRate: 25, rating: 4.6, reviewCount: 32, wishCount: 198, colors: ["default"] },
  { id: "women-loungewear-106", brand: "SYSTEM", name: "레깅스 세트", img: "https://desfigne.synology.me/data/image/thejoeun/products/women_loungewear6.webp", desc: "활동적인 홈 레깅스", price: "45000", originalPrice: 65000, discountRate: 31, rating: 4.4, reviewCount: 33, wishCount: 251, colors: ["default"] },
];

// 여성 ▸ 비치웨어
const local_women_beachwear = [
  { id: "women-beachwear-101", brand: "ROXY", name: "비키니 세트", img: "https://desfigne.synology.me/data/image/thejoeun/products/women_beachwear1.webp", desc: "트렌디한 비키니", price: "89000", originalPrice: 119000, discountRate: 25, rating: 4.4, reviewCount: 37, wishCount: 297, colors: ["default"] },
  { id: "women-beachwear-102", brand: "ARENA", name: "원피스 수영복", img: "https://desfigne.synology.me/data/image/thejoeun/products/women_beachwear2.webp", desc: "우아한 원피스 스타일", price: "109000", originalPrice: 149000, discountRate: 27, rating: 4.6, reviewCount: 12, wishCount: 277, colors: ["default"] },
  { id: "women-beachwear-103", brand: "ROXY", name: "래쉬가드 세트", img: "https://desfigne.synology.me/data/image/thejoeun/products/women_beachwear3.webp", desc: "UV 차단 래쉬가드", price: "79000", originalPrice: 109000, discountRate: 28, rating: 4.7, reviewCount: 27, wishCount: 122, colors: ["default"] },
  { id: "women-beachwear-104", brand: "BILLABONG", name: "비치 드레스", img: "https://desfigne.synology.me/data/image/thejoeun/products/women_beachwear4.webp", desc: "시원한 비치 커버업", price: "69000", originalPrice: 95000, discountRate: 27, rating: 4.5, reviewCount: 13, wishCount: 263, colors: ["default"] },
  { id: "women-beachwear-105", brand: "QUIKSILVER", name: "서프 팬츠", img: "https://desfigne.synology.me/data/image/thejoeun/products/women_beachwear5.webp", desc: "활동적인 서핑 팬츠", price: "59000", originalPrice: 79000, discountRate: 25, rating: 4, reviewCount: 20, wishCount: 155, colors: ["default"] },
  { id: "women-beachwear-106", brand: "ROXY", name: "비치 모자", img: "https://desfigne.synology.me/data/image/thejoeun/products/women_beachwear6.webp", desc: "넓은 챙의 비치 모자", price: "45000", originalPrice: 65000, discountRate: 31, rating: 4.6, reviewCount: 28, wishCount: 286, colors: ["default"] },
];

// 여성 ▸ 패션잡화
const local_women_accessories = [
  { id: "women-accessories-101", brand: "SIE", name: "가죽 벨트", img: "https://desfigne.synology.me/data/image/thejoeun/products/women_accessories1.webp", desc: "심플한 가죽 벨트", price: "59000", originalPrice: 79000, discountRate: 25, rating: 4.1, reviewCount: 37, wishCount: 341, colors: ["default"] },
  { id: "women-accessories-102", brand: "CHARLES&KEITH", name: "숄더백", img: "https://desfigne.synology.me/data/image/thejoeun/products/women_accessories2.webp", desc: "데일리 숄더백", price: "129000", originalPrice: 179000, discountRate: 28, rating: 4.1, reviewCount: 37, wishCount: 90, colors: ["default"] },
  { id: "women-accessories-103", brand: "HERMES", name: "스카프", img: "https://desfigne.synology.me/data/image/thejoeun/products/women_accessories3.webp", desc: "실크 스카프", price: "49000", originalPrice: 69000, discountRate: 29, rating: 4.2, reviewCount: 56, wishCount: 107, colors: ["default"] },
  { id: "women-accessories-104", brand: "RAYBAN", name: "선글라스", img: "https://desfigne.synology.me/data/image/thejoeun/products/women_accessories4.webp", desc: "UV 차단 선글라스", price: "89000", originalPrice: 129000, discountRate: 31, rating: 4.1, reviewCount: 33, wishCount: 221, colors: ["default"] },
  { id: "women-accessories-105", brand: "COACH", name: "크로스백", img: "https://desfigne.synology.me/data/image/thejoeun/products/women_accessories5.webp", desc: "가벼운 크로스백", price: "99000", originalPrice: 139000, discountRate: 29, rating: 4.6, reviewCount: 39, wishCount: 61, colors: ["default"] },
  { id: "women-accessories-106", brand: "MLB", name: "모자", img: "https://desfigne.synology.me/data/image/thejoeun/products/women_accessories6.webp", desc: "베이직 볼캡", price: "35000", originalPrice: 49000, discountRate: 29, rating: 4.6, reviewCount: 10, wishCount: 60, colors: ["default"] },
];

// 여성 ▸ 주얼리
const local_women_jewelry = [
  { id: "women-jewelry-101", brand: "AGATHA", name: "실버 목걸이", img: "https://desfigne.synology.me/data/image/thejoeun/products/women_jewelry1.webp", desc: "심플한 실버 목걸이", price: "89000", originalPrice: 129000, discountRate: 31, rating: 4.7, reviewCount: 36, wishCount: 107, colors: ["default"] },
  { id: "women-jewelry-102", brand: "LLOYD", name: "진주 귀걸이", img: "https://desfigne.synology.me/data/image/thejoeun/products/women_jewelry2.webp", desc: "우아한 진주 귀걸이", price: "69000", originalPrice: 99000, discountRate: 30, rating: 4.3, reviewCount: 56, wishCount: 112, colors: ["default"] },
  { id: "women-jewelry-103", brand: "TIFFANY", name: "팔찌", img: "https://desfigne.synology.me/data/image/thejoeun/products/women_jewelry3.webp", desc: "골드 체인 팔찌", price: "79000", originalPrice: 109000, discountRate: 28, rating: 4.6, reviewCount: 40, wishCount: 76, colors: ["default"] },
  { id: "women-jewelry-104", brand: "SWAROVSKI", name: "반지", img: "https://desfigne.synology.me/data/image/thejoeun/products/women_jewelry4.webp", desc: "큐빅 반지", price: "59000", originalPrice: 85000, discountRate: 31, rating: 4.1, reviewCount: 12, wishCount: 69, colors: ["default"] },
  { id: "women-jewelry-105", brand: "DANIEL WELLINGTON", name: "손목시계", img: "https://desfigne.synology.me/data/image/thejoeun/products/women_jewelry5.webp", desc: "미니멀 손목시계", price: "159000", originalPrice: 219000, discountRate: 27, rating: 4.2, reviewCount: 32, wishCount: 308, colors: ["default"] },
  { id: "women-jewelry-106", brand: "LLOYD", name: "헤어핀 세트", img: "https://desfigne.synology.me/data/image/thejoeun/products/women_jewelry6.webp", desc: "진주 헤어핀 세트", price: "29000", originalPrice: 39000, discountRate: 26, rating: 4.5, reviewCount: 20, wishCount: 76, colors: ["default"] },
];

// 남성 ▸ 니트
const local_men_knit = [
  { id: "men-knit-101", brand: "TNGT", name: "라운드넥 니트", img: "https://desfigne.synology.me/data/image/thejoeun/products/men_knit1.webp", desc: "베이직 라운드넥 스웨터", price: "129000", originalPrice: 179000, discountRate: 28, rating: 4.3, reviewCount: 19, wishCount: 271, colors: ["default"] },
  { id: "men-knit-102", brand: "KUHO", name: "터틀넥 니트", img: "https://desfigne.synology.me/data/image/thejoeun/products/men_knit2.webp", desc: "세련된 터틀넥 스웨터", price: "149000", originalPrice: 199000, discountRate: 25, rating: 4.3, reviewCount: 35, wishCount: 170, colors: ["default"] },
  { id: "men-knit-103", brand: "SYSTEM", name: "카디건", img: "https://desfigne.synology.me/data/image/thejoeun/products/men_knit3.webp", desc: "심플한 가디건", price: "139000", originalPrice: 189000, discountRate: 26, rating: 4.7, reviewCount: 21, wishCount: 141, colors: ["default"] },
  { id: "men-knit-104", brand: "KUHO", name: "캐시미어 니트", img: "https://desfigne.synology.me/data/image/thejoeun/products/men_knit4.webp", desc: "고급스러운 캐시미어 스웨터", price: "259000", originalPrice: 349000, discountRate: 26, rating: 4.1, reviewCount: 58, wishCount: 238, colors: ["default"] },
  { id: "men-knit-105", brand: "TNGT", name: "케이블 니트", img: "https://desfigne.synology.me/data/image/thejoeun/products/men_knit5.webp", desc: "클래식한 케이블 패턴", price: "159000", originalPrice: 219000, discountRate: 27, rating: 4.5, reviewCount: 21, wishCount: 137, colors: ["default"] },
  { id: "men-knit-106", brand: "SYSTEM", name: "집업 니트", img: "https://desfigne.synology.me/data/image/thejoeun/products/men_knit6.webp", desc: "실용적인 집업 스웨터", price: "149000", originalPrice: 199000, discountRate: 25, rating: 4.1, reviewCount: 32, wishCount: 307, colors: ["default"] },
];

// 남성 ▸ 티셔츠
const local_men_tshirt = [
  { id: "men-tshirt-101", brand: "SIE", name: "베이직 티셔츠", img: "https://desfigne.synology.me/data/image/thejoeun/products/men_tshirt1.webp", desc: "데일리 필수 반팔 티셔츠", price: "29000", originalPrice: 39000, discountRate: 26, rating: 4.2, reviewCount: 34, wishCount: 342, colors: ["default"] },
  { id: "men-tshirt-102", brand: "8SECONDS", name: "오버핏 티셔츠", img: "https://desfigne.synology.me/data/image/thejoeun/products/men_tshirt2.webp", desc: "편안한 오버사이즈 티셔츠", price: "39000", originalPrice: 49000, discountRate: 20, rating: 4.6, reviewCount: 24, wishCount: 150, colors: ["default"] },
  { id: "men-tshirt-103", brand: "SIE", name: "스트라이프 티셔츠", img: "https://desfigne.synology.me/data/image/thejoeun/products/men_tshirt3.webp", desc: "산뜻한 스트라이프 패턴", price: "35000", originalPrice: 49000, discountRate: 29, rating: 4.2, reviewCount: 44, wishCount: 71, colors: ["default"] },
  { id: "men-tshirt-104", brand: "8SECONDS", name: "프린팅 티셔츠", img: "https://desfigne.synology.me/data/image/thejoeun/products/men_tshirt4.webp", desc: "개성있는 그래픽 프린팅", price: "45000", originalPrice: 59000, discountRate: 24, rating: 4.5, reviewCount: 21, wishCount: 295, colors: ["default"] },
  { id: "men-tshirt-105", brand: "SYSTEM", name: "롱 티셔츠", img: "https://desfigne.synology.me/data/image/thejoeun/products/men_tshirt5.webp", desc: "트렌디한 롱 기장 티셔츠", price: "42000", originalPrice: 55000, discountRate: 24, rating: 4.5, reviewCount: 21, wishCount: 66, colors: ["default"] },
  { id: "men-tshirt-106", brand: "SIE", name: "브이넥 티셔츠", img: "https://desfigne.synology.me/data/image/thejoeun/products/men_tshirt6.webp", desc: "심플한 브이넥 티셔츠", price: "32000", originalPrice: 45000, discountRate: 29, rating: 4.5, reviewCount: 59, wishCount: 133, colors: ["default"] },
];

// 남성 ▸ 팬츠
const local_men_pants = [
  { id: "men-pants-101", brand: "TNGT", name: "슬랙스", img: "https://desfigne.synology.me/data/image/thejoeun/products/men_pants1.webp", desc: "클래식 슬랙스 팬츠", price: "99000", originalPrice: 139000, discountRate: 29, rating: 4.5, reviewCount: 12, wishCount: 107, colors: ["default"] },
  { id: "men-pants-102", brand: "SIE", name: "청바지", img: "https://desfigne.synology.me/data/image/thejoeun/products/men_pants2.webp", desc: "베이직 슬림 데님", price: "89000", originalPrice: 119000, discountRate: 25, rating: 4.3, reviewCount: 20, wishCount: 109, colors: ["default"] },
  { id: "men-pants-103", brand: "8SECONDS", name: "치노 팬츠", img: "https://desfigne.synology.me/data/image/thejoeun/products/men_pants3.webp", desc: "캐주얼 치노 팬츠", price: "79000", originalPrice: 109000, discountRate: 28, rating: 4.4, reviewCount: 22, wishCount: 63, colors: ["default"] },
  { id: "men-pants-104", brand: "SYSTEM", name: "카고 팬츠", img: "https://desfigne.synology.me/data/image/thejoeun/products/men_pants4.webp", desc: "유틸리티 카고 팬츠", price: "119000", originalPrice: 159000, discountRate: 25, rating: 4.2, reviewCount: 27, wishCount: 329, colors: ["default"] },
  { id: "men-pants-105", brand: "SIE", name: "와이드 팬츠", img: "https://desfigne.synology.me/data/image/thejoeun/products/men_pants5.webp", desc: "편안한 와이드 핏", price: "109000", originalPrice: 149000, discountRate: 27, rating: 4.2, reviewCount: 21, wishCount: 131, colors: ["default"] },
  { id: "men-pants-106", brand: "SYSTEM", name: "조거 팬츠", img: "https://desfigne.synology.me/data/image/thejoeun/products/men_pants6.webp", desc: "활동적인 조거 팬츠", price: "69000", originalPrice: 99000, discountRate: 30, rating: 4.5, reviewCount: 38, wishCount: 322, colors: ["default"] },
];

// 키즈 ▸ 베이비
const local_kids_baby = [
  { id: "kids-baby-101", brand: "SIE", name: "베이비 우주복", img: "https://desfigne.synology.me/data/image/thejoeun/products/kids_baby1.webp", desc: "따뜻한 베이비 우주복", price: "49000", originalPrice: 69000, discountRate: 29, rating: 4.7, reviewCount: 55, wishCount: 233, colors: ["default"] },
  { id: "kids-baby-102", brand: "SYSTEM", name: "베이비 바디슈트", img: "https://desfigne.synology.me/data/image/thejoeun/products/kids_baby2.webp", desc: "편안한 바디슈트", price: "29000", originalPrice: 39000, discountRate: 26, rating: 4, reviewCount: 15, wishCount: 253, colors: ["default"] },
  { id: "kids-baby-103", brand: "SIE", name: "베이비 레깅스", img: "https://desfigne.synology.me/data/image/thejoeun/products/kids_baby3.webp", desc: "부드러운 레깅스", price: "25000", originalPrice: 35000, discountRate: 29, rating: 4.5, reviewCount: 34, wishCount: 72, colors: ["default"] },
  { id: "kids-baby-104", brand: "8SECONDS", name: "베이비 모자", img: "https://desfigne.synology.me/data/image/thejoeun/products/kids_baby4.webp", desc: "귀여운 모자", price: "19000", originalPrice: 29000, discountRate: 34, rating: 4.4, reviewCount: 53, wishCount: 260, colors: ["default"] },
  { id: "kids-baby-105", brand: "SYSTEM", name: "베이비 점퍼", img: "https://desfigne.synology.me/data/image/thejoeun/products/kids_baby5.webp", desc: "사랑스러운 점퍼", price: "59000", originalPrice: 79000, discountRate: 25, rating: 4.3, reviewCount: 29, wishCount: 199, colors: ["default"] },
  { id: "kids-baby-106", brand: "SIE", name: "베이비 세트", img: "https://desfigne.synology.me/data/image/thejoeun/products/kids_baby6.webp", desc: "실용적인 의류 세트", price: "69000", originalPrice: 89000, discountRate: 22, rating: 4.7, reviewCount: 48, wishCount: 327, colors: ["default"] },
];

// 스포츠 ▸ 요가
const local_sports_yoga = [
  { id: "sports-yoga-101", brand: "LULULEMON", name: "요가 매트", img: "https://desfigne.synology.me/data/image/thejoeun/products/sports_yoga1.webp", desc: "미끄럼 방지 요가 매트", price: "69000", originalPrice: 89000, discountRate: 22, rating: 4.6, reviewCount: 41, wishCount: 186, colors: ["default"] },
  { id: "sports-yoga-102", brand: "LULULEMON", name: "요가 레깅스", img: "https://desfigne.synology.me/data/image/thejoeun/products/sports_yoga2.webp", desc: "신축성 좋은 요가 레깅스", price: "89000", originalPrice: 119000, discountRate: 25, rating: 4.3, reviewCount: 26, wishCount: 299, colors: ["default"] },
  { id: "sports-yoga-103", brand: "ALO YOGA", name: "요가 탑", img: "https://desfigne.synology.me/data/image/thejoeun/products/sports_yoga3.webp", desc: "편안한 요가 탑", price: "59000", originalPrice: 79000, discountRate: 25, rating: 4.6, reviewCount: 12, wishCount: 316, colors: ["default"] },
  { id: "sports-yoga-104", brand: "LULULEMON", name: "스포츠 브라", img: "https://desfigne.synology.me/data/image/thejoeun/products/sports_yoga4.webp", desc: "서포트력 좋은 스포츠 브라", price: "49000", originalPrice: 69000, discountRate: 29, rating: 4.2, reviewCount: 48, wishCount: 185, colors: ["default"] },
  { id: "sports-yoga-105", brand: "MANDUKA", name: "요가 블록", img: "https://desfigne.synology.me/data/image/thejoeun/products/sports_yoga5.webp", desc: "요가 보조 블록", price: "25000", originalPrice: 35000, discountRate: 29, rating: 4.2, reviewCount: 58, wishCount: 336, colors: ["default"] },
  { id: "sports-yoga-106", brand: "GAIAM", name: "요가 스트랩", img: "https://desfigne.synology.me/data/image/thejoeun/products/sports_yoga6.webp", desc: "스트레칭용 스트랩", price: "19000", originalPrice: 29000, discountRate: 34, rating: 4.2, reviewCount: 37, wishCount: 95, colors: ["default"] },
];

// 스포츠 ▸ 피트니스
const local_sports_fitness = [
  { id: "sports-fitness-101", brand: "HARBINGER", name: "트레이닝 글러브", img: "https://desfigne.synology.me/data/image/thejoeun/products/sports_fitness1.webp", desc: "그립감 좋은 트레이닝 글러브", price: "29000", originalPrice: 39000, discountRate: 26, rating: 4.4, reviewCount: 42, wishCount: 198, colors: ["default"] },
  { id: "sports-fitness-102", brand: "UNDER ARMOUR", name: "피트니스 레깅스", img: "https://desfigne.synology.me/data/image/thejoeun/products/sports_fitness2.webp", desc: "압박감 있는 레깅스", price: "79000", originalPrice: 109000, discountRate: 28, rating: 4.4, reviewCount: 51, wishCount: 140, colors: ["default"] },
  { id: "sports-fitness-103", brand: "NIKE", name: "트레이닝 탱크", img: "https://desfigne.synology.me/data/image/thejoeun/products/sports_fitness3.webp", desc: "흡한속건 트레이닝 탱크", price: "45000", originalPrice: 59000, discountRate: 24, rating: 4.1, reviewCount: 39, wishCount: 316, colors: ["default"] },
  { id: "sports-fitness-104", brand: "ADIDAS", name: "트레이닝 쇼츠", img: "https://desfigne.synology.me/data/image/thejoeun/products/sports_fitness4.webp", desc: "활동성 좋은 쇼츠", price: "49000", originalPrice: 69000, discountRate: 29, rating: 4.4, reviewCount: 21, wishCount: 304, colors: ["default"] },
  { id: "sports-fitness-105", brand: "HARBINGER", name: "리프팅 벨트", img: "https://desfigne.synology.me/data/image/thejoeun/products/sports_fitness5.webp", desc: "허리 보호 벨트", price: "59000", originalPrice: 79000, discountRate: 25, rating: 4.4, reviewCount: 52, wishCount: 141, colors: ["default"] },
  { id: "sports-fitness-106", brand: "REEBOK", name: "헬스 신발", img: "https://desfigne.synology.me/data/image/thejoeun/products/sports_fitness6.webp", desc: "안정감 있는 트레이닝 신발", price: "129000", originalPrice: 179000, discountRate: 28, rating: 4.3, reviewCount: 16, wishCount: 301, colors: ["default"] },
];

// 스포츠 ▸ 테니스
const local_sports_tennis = [
  { id: "sports-tennis-101", brand: "WILSON", name: "테니스 라켓", img: "https://desfigne.synology.me/data/image/thejoeun/products/sports_tennis1.webp", desc: "초급자용 테니스 라켓", price: "189000", originalPrice: 259000, discountRate: 27, rating: 4.3, reviewCount: 37, wishCount: 182, colors: ["default"] },
  { id: "sports-tennis-102", brand: "NIKE", name: "테니스 신발", img: "https://desfigne.synology.me/data/image/thejoeun/products/sports_tennis2.webp", desc: "그립감 좋은 테니스화", price: "149000", originalPrice: 199000, discountRate: 25, rating: 4.4, reviewCount: 32, wishCount: 233, colors: ["default"] },
  { id: "sports-tennis-103", brand: "ADIDAS", name: "테니스 스커트", img: "https://desfigne.synology.me/data/image/thejoeun/products/sports_tennis3.webp", desc: "활동적인 테니스 스커트", price: "69000", originalPrice: 89000, discountRate: 22, rating: 4.6, reviewCount: 44, wishCount: 96, colors: ["default"] },
  { id: "sports-tennis-104", brand: "LACOSTE", name: "테니스 폴로", img: "https://desfigne.synology.me/data/image/thejoeun/products/sports_tennis4.webp", desc: "흡한속건 폴로 셔츠", price: "79000", originalPrice: 109000, discountRate: 28, rating: 4.2, reviewCount: 12, wishCount: 80, colors: ["default"] },
  { id: "sports-tennis-105", brand: "WILSON", name: "테니스 백", img: "https://desfigne.synology.me/data/image/thejoeun/products/sports_tennis5.webp", desc: "라켓 수납 백", price: "89000", originalPrice: 119000, discountRate: 25, rating: 4.5, reviewCount: 44, wishCount: 115, colors: ["default"] },
  { id: "sports-tennis-106", brand: "NIKE", name: "테니스 모자", img: "https://desfigne.synology.me/data/image/thejoeun/products/sports_tennis6.webp", desc: "햇빛 차단 모자", price: "35000", originalPrice: 49000, discountRate: 29, rating: 4.7, reviewCount: 37, wishCount: 51, colors: ["default"] },
];

// 스포츠 ▸ 수영
const local_sports_swim = [
  { id: "sports-swim-101", brand: "SPEEDO", name: "수영복", img: "https://desfigne.synology.me/data/image/thejoeun/products/sports_swim1.webp", desc: "클로린 저항성 수영복", price: "89000", originalPrice: 119000, discountRate: 25, rating: 4.5, reviewCount: 32, wishCount: 145, colors: ["default"] },
  { id: "sports-swim-102", brand: "SPEEDO", name: "수영 고글", img: "https://desfigne.synology.me/data/image/thejoeun/products/sports_swim2.webp", desc: "김서림 방지 고글", price: "35000", originalPrice: 49000, discountRate: 29, rating: 4.2, reviewCount: 51, wishCount: 230, colors: ["default"] },
  { id: "sports-swim-103", brand: "ARENA", name: "수영 모자", img: "https://desfigne.synology.me/data/image/thejoeun/products/sports_swim3.webp", desc: "실리콘 수영 모자", price: "15000", originalPrice: 25000, discountRate: 40, rating: 4.6, reviewCount: 53, wishCount: 238, colors: ["default"] },
  { id: "sports-swim-104", brand: "ROXY", name: "래쉬가드", img: "https://desfigne.synology.me/data/image/thejoeun/products/sports_swim4.webp", desc: "UV 차단 래쉬가드", price: "69000", originalPrice: 89000, discountRate: 22, rating: 4.1, reviewCount: 53, wishCount: 193, colors: ["default"] },
  { id: "sports-swim-105", brand: "QUIKSILVER", name: "비치 타올", img: "https://desfigne.synology.me/data/image/thejoeun/products/sports_swim5.webp", desc: "대형 흡수 타올", price: "45000", originalPrice: 59000, discountRate: 24, rating: 4.3, reviewCount: 29, wishCount: 240, colors: ["default"] },
  { id: "sports-swim-106", brand: "SPEEDO", name: "수영 가방", img: "https://desfigne.synology.me/data/image/thejoeun/products/sports_swim6.webp", desc: "방수 수영 가방", price: "55000", originalPrice: 75000, discountRate: 27, rating: 4.4, reviewCount: 40, wishCount: 270, colors: ["default"] },
];

// 뷰티 ▸ 향수
const local_beauty_perfume = [
  { id: "beauty-perfume-101", brand: "CHANEL", name: "플로럴 향수", img: "https://desfigne.synology.me/data/image/thejoeun/products/beauty_perfume1.webp", desc: "우아한 플로럴 노트", price: "125000", originalPrice: 175000, discountRate: 29, rating: 4.1, reviewCount: 47, wishCount: 238, colors: ["default"] },
  { id: "beauty-perfume-102", brand: "JO MALONE", name: "시트러스 향수", img: "https://desfigne.synology.me/data/image/thejoeun/products/beauty_perfume2.webp", desc: "상큼한 시트러스 향", price: "98000", originalPrice: 138000, discountRate: 29, rating: 4, reviewCount: 23, wishCount: 165, colors: ["default"] },
  { id: "beauty-perfume-103", brand: "TOM FORD", name: "우디 향수", img: "https://desfigne.synology.me/data/image/thejoeun/products/beauty_perfume3.webp", desc: "깊은 우디 노트", price: "145000", originalPrice: 195000, discountRate: 26, rating: 4.6, reviewCount: 56, wishCount: 143, colors: ["default"] },
  { id: "beauty-perfume-104", brand: "DIPTYQUE", name: "머스크 향수", img: "https://desfigne.synology.me/data/image/thejoeun/products/beauty_perfume4.webp", desc: "부드러운 머스크 향", price: "88000", originalPrice: 125000, discountRate: 30, rating: 4.3, reviewCount: 40, wishCount: 205, colors: ["default"] },
  { id: "beauty-perfume-105", brand: "MARC JACOBS", name: "프루티 향수", img: "https://desfigne.synology.me/data/image/thejoeun/products/beauty_perfume5.webp", desc: "달콤한 프루티 향", price: "92000", originalPrice: 128000, discountRate: 28, rating: 4.6, reviewCount: 30, wishCount: 189, colors: ["default"] },
  { id: "beauty-perfume-106", brand: "YVES SAINT LAURENT", name: "오리엔탈 향수", img: "https://desfigne.synology.me/data/image/thejoeun/products/beauty_perfume6.webp", desc: "신비로운 오리엔탈 향", price: "158000", originalPrice: 215000, discountRate: 27, rating: 4.1, reviewCount: 49, wishCount: 346, colors: ["default"] },
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
  const [activeSubcategoryTab, setActiveSubcategoryTab] = useState("전체"); // 전체 페이지용 서브카테고리 탭
  const [sortBy, setSortBy] = useState("인기상품순(전체)");
  const [refresh, setRefresh] = useState(0); // 위시 토글 반영용

  // 카테고리/탭 메타 (Header의 모든 카테고리 지원)
  const categoryInfo = {
    women: {
      name: "여성",
      nameEn: "WOMEN",
      subcategories: [
        { name: "메인", key: "" },
        { name: "신상품", key: "new" },
        { name: "전체 상품", key: "all" },
        { name: "아우터", key: "outer" },
        { name: "재킷/베스트", key: "jacket" },
        { name: "니트", key: "knit" },
        { name: "셔츠/블라우스", key: "shirt" },
        { name: "티셔츠", key: "tshirt" },
        { name: "원피스", key: "onepiece" },
        { name: "팬츠", key: "pants" },
        { name: "스커트", key: "skirt" },
        { name: "라운지/언더웨어", key: "loungewear" },
        { name: "비치웨어", key: "beachwear" },
        { name: "패션잡화", key: "accessories" },
        { name: "쥬얼리/시계", key: "jewelry" },
      ]
    },
    men: {
      name: "남성",
      nameEn: "MEN",
      subcategories: [
        { name: "메인", key: "" },
        { name: "신상품", key: "new" },
        { name: "전체 상품", key: "all" },
        { name: "아우터", key: "outer" },
        { name: "정장", key: "suit" },
        { name: "팬츠", key: "pants" },
        { name: "재킷/베스트", key: "jacket" },
        { name: "셔츠", key: "shirt" },
        { name: "니트", key: "knit" },
        { name: "티셔츠", key: "tshirt" },
        { name: "패션잡화", key: "accessory" },
        { name: "언더웨어", key: "underwear" },
        { name: "비치웨어", key: "beachwear" },
        { name: "쥬얼리/시계", key: "jewelry" },
      ]
    },
    kids: {
      name: "키즈",
      nameEn: "KIDS",
      subcategories: [
        { name: "메인", key: "" },
        { name: "신상품", key: "new" },
        { name: "전체 상품", key: "all" },
        { name: "남아", key: "boy" },
        { name: "여아", key: "girl" },
        { name: "베이비", key: "baby" },
        { name: "완구/교구", key: "toy" },
        { name: "용품", key: "gear" },
        { name: "래시가드/수영복", key: "swim" },
      ]
    },
    beauty: {
      name: "뷰티",
      nameEn: "BEAUTY",
      subcategories: [
        { name: "메인", key: "" },
        { name: "신상품", key: "new" },
        { name: "전체 상품", key: "all" },
        { name: "스킨케어", key: "skin" },
        { name: "메이크업", key: "makeup" },
        { name: "향수", key: "perfume" },
      ]
    },
    sports: {
      name: "스포츠",
      nameEn: "SPORTS",
      subcategories: [
        { name: "메인", key: "" },
        { name: "신상품", key: "new" },
        { name: "전체 상품", key: "all" },
        { name: "러닝", key: "running" },
        { name: "아웃도어", key: "outdoor" },
        { name: "요가", key: "yoga" },
        { name: "피트니스", key: "fitness" },
        { name: "테니스", key: "tennis" },
        { name: "수영", key: "swim" },
      ]
    },
    golf: {
      name: "골프",
      nameEn: "GOLF",
      subcategories: [
        { name: "메인", key: "" },
        { name: "신상품", key: "new" },
        { name: "전체 상품", key: "all" },
        { name: "여성 골프의류", key: "women-apparel" },
        { name: "여성 골프슈즈", key: "women-shoes" },
        { name: "남성 골프의류", key: "men-apparel" },
        { name: "남성 골프슈즈", key: "men-shoes" },
        { name: "골프클럽", key: "club" },
        { name: "골프백", key: "bag" },
        { name: "골프ACC", key: "acc" },
        { name: "골프공", key: "balls" },
      ]
    },
    life: {
      name: "라이프",
      nameEn: "LIFE",
      subcategories: [
        { name: "메인", key: "" },
        { name: "신상품", key: "new" },
        { name: "전체 상품", key: "all" },
        { name: "기프트", key: "gift" },
        { name: "키친/다이닝", key: "kitchen-dining" },
        { name: "침구/홈패브릭", key: "bedding-home-fabric" },
        { name: "욕실/런드리", key: "bath-laundry" },
        { name: "가전", key: "appliance" },
        { name: "디지털", key: "digital" },
        { name: "수납/정리", key: "organize" },
        { name: "가구", key: "furniture" },
        { name: "조명", key: "lighting" },
        { name: "홈데코", key: "home-deco" },
        { name: "홈 프레그런스", key: "home-fragrance" },
        { name: "반려동물", key: "pet" },
        { name: "식품", key: "food" },
        { name: "데스크/디자인문구", key: "desk-design" },
        { name: "자동차용품", key: "car" },
        { name: "아트/컬쳐", key: "art" },
        { name: "상품권", key: "giftcard" },
      ]
    },
    luxury: {
      name: "럭셔리",
      nameEn: "LUXURY",
      subcategories: [
        { name: "메인", key: "" },
        { name: "신상품", key: "new" },
        { name: "전체 상품", key: "all" },
        { name: "여성의류", key: "women-apparel" },
        { name: "여성가방/지갑", key: "women-bag-wallet" },
        { name: "여성 패션잡화", key: "women-acc" },
        { name: "여성슈즈", key: "women-shoes" },
        { name: "여성 쥬얼리/시계", key: "women-jewelry" },
        { name: "남성의류", key: "men-apparel" },
        { name: "남성가방/지갑", key: "men-bag-wallet" },
        { name: "남성 패션잡화", key: "men-acc" },
        { name: "남성슈즈", key: "men-shoes" },
        { name: "남성 쥬얼리/시계", key: "men-jewelry" },
        { name: "선글라스/안경테", key: "eyewear" },
      ]
    },
    "bags-shoes": {
      name: "백&슈즈",
      nameEn: "BAGS & SHOES",
      subcategories: [
        { name: "메인", key: "" },
        { name: "신상품", key: "new" },
        { name: "전체 상품", key: "all" },
        { name: "여성 가방", key: "women-bag" },
        { name: "여성 지갑", key: "women-wallet" },
        { name: "여성 슈즈", key: "women-shoes" },
        { name: "남성 가방", key: "men-bag" },
        { name: "남성 지갑", key: "men-wallet" },
        { name: "남성 슈즈", key: "men-shoes" },
        { name: "여행 용품", key: "travel" },
      ]
    },
    outlet: {
      name: "아울렛",
      nameEn: "OUTLET",
      subcategories: [
        { name: "메인", key: "" },
        { name: "전체 상품", key: "all" },
        { name: "여성", key: "women" },
        { name: "남성", key: "men" },
        { name: "키즈", key: "kids" },
        { name: "럭셔리", key: "luxury" },
        { name: "백&슈즈", key: "bags-shoes" },
        { name: "스포츠", key: "sports" },
        { name: "골프", key: "golf" },
        { name: "뷰티", key: "beauty" },
        { name: "라이프", key: "life" },
      ]
    },
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
    // 추가 서브카테고리 (헤더 메가메뉴와 동기화)
    loungewear: { name: "라운지/언더웨어", tabs: ["전체"] },
    beachwear: { name: "비치웨어", tabs: ["전체"] },
    accessory: { name: "패션잡화", tabs: ["전체"] },
    jewelry: { name: "쥬얼리/시계", tabs: ["전체"] },
    underwear: { name: "언더웨어", tabs: ["전체"] },
    baby: { name: "베이비", tabs: ["전체"] },
    toy: { name: "완구/교구", tabs: ["전체"] },
    gear: { name: "용품", tabs: ["전체"] },
    swim: { name: "래시가드/수영복", tabs: ["전체"] },
    skincare: { name: "스킨케어", tabs: ["전체"] },
    body: { name: "핸드 & 바디케어", tabs: ["전체"] },
    hair: { name: "헤어케어", tabs: ["전체"] },
    mens: { name: "맨즈케어", tabs: ["전체"] },
    perfume: { name: "향수", tabs: ["전체"] },
    tools: { name: "뷰티소품 & 도구", tabs: ["전체"] },
    inner: { name: "이너뷰티", tabs: ["전체"] },
    "vegan-clean": { name: "비건/클린뷰티", tabs: ["전체"] },
    gift: { name: "기프트", tabs: ["전체"] },
    "men-apparel": { name: "남성의류", tabs: ["전체"] },
    "women-apparel": { name: "여성의류", tabs: ["전체"] },
    shoes: { name: "슈즈", tabs: ["전체"] },
    bag: { name: "가방", tabs: ["전체"] },
    camping: { name: "캠핑용품", tabs: ["전체"] },
    "women-shoes": { name: "여성 골프슈즈", tabs: ["전체"] },
    "men-shoes": { name: "남성 골프슈즈", tabs: ["전체"] },
    club: { name: "골프클럽", tabs: ["전체"] },
    acc: { name: "골프ACC", tabs: ["전체"] },
    balls: { name: "골프공", tabs: ["전체"] },
    "kitchen-dining": { name: "키친/다이닝", tabs: ["전체"] },
    "bedding-home-fabric": { name: "침구/홈패브릭", tabs: ["전체"] },
    "bath-laundry": { name: "욕실/런드리", tabs: ["전체"] },
    appliance: { name: "가전", tabs: ["전체"] },
    digital: { name: "디지털", tabs: ["전체"] },
    organize: { name: "수납/정리", tabs: ["전체"] },
    furniture: { name: "가구", tabs: ["전체"] },
    lighting: { name: "조명", tabs: ["전체"] },
    "home-deco": { name: "홈데코", tabs: ["전체"] },
    "home-fragrance": { name: "홈 프레그런스", tabs: ["전체"] },
    pet: { name: "반려동물", tabs: ["전체"] },
    food: { name: "식품", tabs: ["전체"] },
    "desk-design": { name: "데스크/디자인문구", tabs: ["전체"] },
    car: { name: "자동차용품", tabs: ["전체"] },
    art: { name: "아트/컬쳐", tabs: ["전체"] },
    giftcard: { name: "상품권", tabs: ["전체"] },
    "women-bag-wallet": { name: "여성가방/지갑", tabs: ["전체"] },
    "women-acc": { name: "여성 패션잡화", tabs: ["전체"] },
    "women-jewelry": { name: "여성 쥬얼리/시계", tabs: ["전체"] },
    "men-bag-wallet": { name: "남성가방/지갑", tabs: ["전체"] },
    "men-acc": { name: "남성 패션잡화", tabs: ["전체"] },
    "men-jewelry": { name: "남성 쥬얼리/시계", tabs: ["전체"] },
    eyewear: { name: "선글라스/안경테", tabs: ["전체"] },
    "women-bag": { name: "여성 가방", tabs: ["전체"] },
    "women-wallet": { name: "여성 지갑", tabs: ["전체"] },
    "men-bag": { name: "남성 가방", tabs: ["전체"] },
    "men-wallet": { name: "남성 지갑", tabs: ["전체"] },
    travel: { name: "여행 용품", tabs: ["전체"] },
    women: { name: "여성", tabs: ["전체"] },
    men: { name: "남성", tabs: ["전체"] },
    kids: { name: "키즈", tabs: ["전체"] },
    luxury: { name: "럭셔리", tabs: ["전체"] },
    "bags-shoes": { name: "백&슈즈", tabs: ["전체"] },
    sports: { name: "스포츠", tabs: ["전체"] },
    golf: { name: "골프", tabs: ["전체"] },
    beauty: { name: "뷰티", tabs: ["전체"] },
    life: { name: "라이프", tabs: ["전체"] },
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
      loungewear: local_women_loungewear,    // 추가
      beachwear: local_women_beachwear,      // 추가
      accessories: local_women_accessories,  // 추가
      jewelry: local_women_jewelry,          // 추가
    },
    men: {
      suit: local_men_suit,
      jacket: local_men_jacket,
      shirt: local_men_shirt,
      knit: local_men_knit,      // 추가
      tshirt: local_men_tshirt,  // 추가
      pants: local_men_pants,    // 추가
    },
    kids: {
      boy: local_kids_boy,
      girl: local_kids_girl,
      baby: local_kids_baby,  // 추가
    },
    beauty: {
      skin: local_beauty_skin,
      makeup: local_beauty_makeup,
      perfume: local_beauty_perfume,  // 추가
    },
    golf: {
      women: local_golf_women,
    },
    sports: {
      running: local_sports_running,
      outdoor: local_sports_outdoor,
      yoga: local_sports_yoga,        // 추가
      fitness: local_sports_fitness,  // 추가
      tennis: local_sports_tennis,    // 추가
      swim: local_sports_swim,        // 추가
    },
    luxury: {
      women: local_luxury_women,
    },
  };

  // 카테고리 페이지용 데이터
  const getProductsByCategory = () => {
    // 전체 페이지이고 특정 서브카테고리 탭이 선택된 경우
    if ((!subcategory || subcategory === "all") && activeSubcategoryTab !== "전체") {
      const currentCat = categoryInfo[category];
      const selectedSubcat = currentCat?.subcategories?.find(s => s.name === activeSubcategoryTab);
      if (selectedSubcat && selectedSubcat.key) {
        const locals = (localByCategory[category] && localByCategory[category][selectedSubcat.key]) || [];
        return [...sampleProducts, ...locals];
      }
    }

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
  }, [isSearchMode, category, subcategory, activeSubcategoryTab, refresh]); // eslint-disable-line

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

        {/* Tabs / Subcategory Filters */}
        {!isSearchMode && (
          <div className="category-tabs">
            {(!subcategory || subcategory === "" || subcategory === "all") ? (
              // 전체 페이지: 서브카테고리 탭 버튼으로 필터링
              (currentCategory.subcategories || []).map((sub) => (
                <button
                  key={sub.name}
                  className={`tab ${activeSubcategoryTab === sub.name ? "active" : ""}`}
                  onClick={() => setActiveSubcategoryTab(sub.name)}
                >
                  {sub.name}
                </button>
              ))
            ) : (
              // 특정 서브카테고리 페이지: 탭 버튼 표시 (subcategory !== "new"일 때만)
              subcategory !== "new" && (currentSubcategory.tabs || ["전체"]).map((tab) => (
                <button
                  key={tab}
                  className={`tab ${activeTab === tab ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))
            )}
          </div>
        )}

        {/* Filters / Sort */}
        <div className="filter-section">
          {!isSearchMode ? (
            <div className="filter-buttons">
              <div className="filter-dropdown">
                <button className="filter-btn">
                  브랜드 ▾
                </button>
              </div>
              <div className="filter-dropdown">
                <button className="filter-btn">
                  가격 ▾
                </button>
              </div>
              <div className="filter-dropdown">
                <button className="filter-btn">
                  사이즈 ▾
                </button>
              </div>
              <div className="filter-dropdown">
                <button className="filter-btn">
                  색상 ▾
                </button>
              </div>
              <div className="filter-dropdown">
                <button className="filter-btn">
                  혜택/배송 ▾
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
