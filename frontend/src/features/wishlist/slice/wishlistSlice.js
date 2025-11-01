// src/features/wishlist/slice/wishlistSlice.js
import { createSlice } from '@reduxjs/toolkit';

/**
 * 위시리스트 상품 고유 키 생성
 * @param {Object} product - 상품 정보
 * @returns {string} - 고유 키
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
