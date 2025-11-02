/**
 * ============================================================================
 * wishlistSlice.js - 찜 목록 Redux Slice
 * ============================================================================
 *
 * 【목적】
 * - 사용자가 찜한 상품 목록을 Redux로 관리
 * - localStorage와 동기화하여 새로고침 후에도 데이터 유지
 * - 하트 버튼 토글 기능 제공
 *
 * 【상태 구조】
 * state.wishlist = {
 *   items: [
 *     {
 *       id: "product123",
 *       name: "상품명",
 *       price: 50000,
 *       image: "...",
 *       __key: "product123"  // 내부 키 (중복 체크용)
 *     },
 *     ...
 *   ]
 * }
 *
 * 【주요 기능】
 * 1. addToWishlist: 찜 목록에 상품 추가 (중복 방지)
 * 2. removeFromWishlist: 찜 목록에서 상품 제거
 * 3. toggleWishlist: 찜 상태 토글 (있으면 제거, 없으면 추가)
 * 4. clearWishlist: 찜 목록 비우기
 * 5. setWishlist: 찜 목록 전체 교체 (동기화용)
 *
 * 【고유 키 생성 전략】
 * 상품 ID를 기본으로 사용하지만, ID가 없는 경우
 * name + image + price 조합으로 fallback 키를 생성합니다.
 *
 * @module wishlistSlice
 * @author Claude Code
 * @since 2025-11-02
 */

import { createSlice } from '@reduxjs/toolkit';

// ============================================================================
// Helper Functions
// ============================================================================
/**
 * productKey - 위시리스트 상품 고유 키 생성
 *
 * @description
 * 상품의 고유 키를 생성합니다.
 * 우선순위: id > productId > (name + image + price 조합)
 *
 * @param {Object} p - 상품 정보
 * @param {string} [p.id] - 상품 ID
 * @param {string} [p.productId] - 상품 ID (대체)
 * @param {string} [p.name] - 상품명
 * @param {string} [p.image] - 이미지 URL
 * @param {string} [p.img] - 이미지 URL (대체)
 * @param {number} [p.price] - 가격
 * @returns {string} 고유 키
 *
 * @example
 * productKey({ id: "p123" })
 * // → "p123"
 *
 * productKey({ name: "티셔츠", image: "img.jpg", price: 29000 })
 * // → "티셔츠::img.jpg::29000"
 */
export const productKey = (p = {}) => (
  (p.id ?? p.productId ?? "").toString() ||
  `${p.name || ""}::${p.image || p.img || ""}::${p.price || ""}`
);

/**
 * localStorage에서 초기 위시리스트 상태 로드
 */
const loadWishlistFromStorage = () => {
  try {
    const saved = localStorage.getItem('wishlist');
    if (saved) {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (error) {
    console.error('Failed to load wishlist from localStorage:', error);
  }
  return [];
};

const initialState = {
  items: loadWishlistFromStorage(),
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    /**
     * 위시리스트에 상품 추가
     */
    addToWishlist: (state, action) => {
      const product = action.payload;
      const key = productKey(product);

      // 이미 있는지 확인
      const exists = state.items.some(item => productKey(item) === key);

      if (!exists) {
        state.items.push({
          ...product,
          __key: key,
        });
      }
    },

    /**
     * 위시리스트에서 상품 제거
     */
    removeFromWishlist: (state, action) => {
      const product = action.payload;
      const key = productKey(product);

      state.items = state.items.filter(item => productKey(item) !== key);
    },

    /**
     * 위시리스트 비우기
     */
    clearWishlist: (state) => {
      state.items = [];
    },

    /**
     * 위시리스트 전체 교체 (localStorage 동기화용)
     */
    setWishlist: (state, action) => {
      state.items = action.payload;
    },

    /**
     * 위시리스트 토글 (있으면 제거, 없으면 추가)
     */
    toggleWishlist: (state, action) => {
      const product = action.payload;
      const key = productKey(product);

      const existingIndex = state.items.findIndex(item => productKey(item) === key);

      if (existingIndex !== -1) {
        // 이미 있으면 제거
        state.items.splice(existingIndex, 1);
      } else {
        // 없으면 추가
        state.items.push({
          ...product,
          __key: key,
        });
      }
    },
  },
});

// Actions
export const {
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  setWishlist,
  toggleWishlist,
} = wishlistSlice.actions;

// Selectors
export const selectWishlistItems = (state) => state.wishlist.items;
export const selectWishlistCount = (state) => state.wishlist.items.length;
export const selectIsInWishlist = (product) => (state) => {
  const key = productKey(product);
  return state.wishlist.items.some(item => productKey(item) === key);
};

// Reducer
export default wishlistSlice.reducer;
