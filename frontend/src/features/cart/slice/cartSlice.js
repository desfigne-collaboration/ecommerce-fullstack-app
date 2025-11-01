// src/features/cart/slice/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

/**
 * 장바구니 아이템 고유 키 생성
 * @param {Object} item - 상품 정보 (id, selectedSize, selectedColor)
 * @returns {string} - 고유 키
 */
export const cartItemKey = (item) => {
  const { id, selectedSize, selectedColor } = item;
  return `${id}_${selectedSize || 'nosize'}_${selectedColor || 'nocolor'}`;
};

/**
 * localStorage에서 초기 장바구니 상태 로드
 */
const loadCartFromStorage = () => {
  try {
    const saved = localStorage.getItem('cart');
    if (saved) {
      const parsed = JSON.parse(saved);
      // 배열 형태로 저장된 경우
      if (Array.isArray(parsed)) {
        return parsed;
      }
      // 객체 형태로 저장된 경우 (items 필드 확인)
      if (parsed.items && Array.isArray(parsed.items)) {
        return parsed.items;
      }
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
