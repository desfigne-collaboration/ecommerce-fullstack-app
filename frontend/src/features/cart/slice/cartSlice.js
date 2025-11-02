/**
 * ============================================================================
 * cartSlice.js - 장바구니 Redux Slice
 * ============================================================================
 *
 * 【목적】
 * - 장바구니 상품 목록을 Redux로 관리
 * - localStorage와 동기화하여 새로고침 후에도 데이터 유지
 * - 사이즈/색상별로 동일 상품을 구분하여 관리
 *
 * 【상태 구조】
 * state.cart = {
 *   items: [
 *     {
 *       id: "product123",
 *       name: "상품명",
 *       price: 50000,
 *       image: "...",
 *       selectedSize: "L",
 *       selectedColor: "Black",
 *       quantity: 2
 *     },
 *     ...
 *   ]
 * }
 *
 * 【주요 기능】
 * 1. addToCart: 장바구니에 상품 추가 (기존 상품이면 수량 증가)
 * 2. removeFromCart: 장바구니에서 상품 제거
 * 3. updateCartQuantity: 상품 수량 변경
 * 4. clearCart: 장바구니 비우기
 * 5. setCart: 장바구니 전체 교체 (동기화용)
 *
 * 【고유 키 생성 전략】
 * 동일 상품이라도 사이즈/색상이 다르면 별도 아이템으로 관리합니다.
 * 예: "상품A (L, Black)"과 "상품A (M, Black)"은 서로 다른 아이템
 *
 * @module cartSlice
 * @author Claude Code
 * @since 2025-11-02
 */

import { createSlice } from '@reduxjs/toolkit';

// ============================================================================
// Helper Functions
// ============================================================================
/**
 * cartItemKey - 장바구니 아이템 고유 키 생성
 *
 * @description
 * 상품 ID + 사이즈 + 색상을 조합하여 고유한 키를 생성합니다.
 * 동일 상품이라도 사이즈/색상이 다르면 다른 키를 가집니다.
 *
 * @param {Object} item - 상품 정보
 * @param {string} item.id - 상품 ID
 * @param {string} [item.selectedSize] - 선택된 사이즈
 * @param {string} [item.selectedColor] - 선택된 색상
 * @returns {string} 고유 키 (예: "product123_L_Black")
 *
 * @example
 * cartItemKey({ id: "p1", selectedSize: "L", selectedColor: "Black" })
 * // → "p1_L_Black"
 *
 * cartItemKey({ id: "p1" })
 * // → "p1_nosize_nocolor"
 */
export const cartItemKey = (item) => {
  const { id, selectedSize, selectedColor } = item;
  return `${id}_${selectedSize || 'nosize'}_${selectedColor || 'nocolor'}`;
};

/**
 * localStorage에서 초기 장바구니 상태 로드
 *
 * @description
 * 기존 형식과 새로운 형식을 모두 지원합니다.
 * - 기존: { id: "product123-L", product: {...}, size: "L", qty: 2 }
 * - 새로운: { id: "product123", selectedSize: "L", quantity: 2, name: "...", price: ... }
 */
const loadCartFromStorage = () => {
  try {
    const saved = localStorage.getItem('cart');
    if (saved) {
      const parsed = JSON.parse(saved);
      let items = [];

      // 배열 형태로 저장된 경우
      if (Array.isArray(parsed)) {
        items = parsed;
      }
      // 객체 형태로 저장된 경우 (items 필드 확인)
      else if (parsed.items && Array.isArray(parsed.items)) {
        items = parsed.items;
      }

      // 기존 형식을 새로운 형식으로 변환
      return items.map(item => {
        // 이미 새로운 형식인 경우 (quantity, selectedSize 존재)
        if (item.quantity !== undefined && item.selectedSize !== undefined) {
          return item;
        }

        // 기존 형식인 경우 (product 객체, qty, size 존재)
        if (item.product) {
          return {
            id: item.product.id || item.id?.split('-')[0] || item.id,
            name: item.product.name || "",
            price: item.product.price || 0,
            image: item.product.image || item.product.img || "",
            selectedSize: item.size || "",
            selectedColor: item.color || "",
            quantity: item.qty || 1,
          };
        }

        // 알 수 없는 형식은 그대로 반환
        return item;
      });
    }
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error);
  }
  return [];
};

const initialState = {
  items: loadCartFromStorage(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    /**
     * 장바구니에 상품 추가 (이미 있으면 수량 증가)
     */
    addToCart: (state, action) => {
      const item = action.payload;
      const key = cartItemKey(item);

      // 기존 아이템 찾기
      const existingIndex = state.items.findIndex(
        cartItem => cartItemKey(cartItem) === key
      );

      if (existingIndex !== -1) {
        // 이미 있으면 수량 증가
        state.items[existingIndex].quantity += item.quantity || 1;
      } else {
        // 없으면 새로 추가
        state.items.push({
          ...item,
          quantity: item.quantity || 1,
        });
      }
    },

    /**
     * 장바구니에서 상품 제거
     */
    removeFromCart: (state, action) => {
      const item = action.payload;
      const key = cartItemKey(item);

      state.items = state.items.filter(
        cartItem => cartItemKey(cartItem) !== key
      );
    },

    /**
     * 장바구니 상품 수량 업데이트
     */
    updateCartQuantity: (state, action) => {
      const { item, quantity } = action.payload;
      const key = cartItemKey(item);

      const existingIndex = state.items.findIndex(
        cartItem => cartItemKey(cartItem) === key
      );

      if (existingIndex !== -1) {
        if (quantity <= 0) {
          // 수량이 0 이하면 제거
          state.items.splice(existingIndex, 1);
        } else {
          // 수량 업데이트
          state.items[existingIndex].quantity = quantity;
        }
      }
    },

    /**
     * 장바구니 비우기
     */
    clearCart: (state) => {
      state.items = [];
    },

    /**
     * 장바구니 전체 교체 (localStorage 동기화용)
     */
    setCart: (state, action) => {
      state.items = action.payload;
    },
  },
});

// Actions
export const {
  addToCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
  setCart,
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) =>
  state.cart.items.reduce((total, item) => total + (item.quantity || 0), 0);
export const selectCartTotal = (state) =>
  state.cart.items.reduce((total, item) => {
    const price = item.price || 0;
    const quantity = item.quantity || 0;
    return total + (price * quantity);
  }, 0);

// Reducer
export default cartSlice.reducer;
