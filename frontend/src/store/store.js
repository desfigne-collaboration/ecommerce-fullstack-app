import { configureStore } from '@reduxjs/toolkit'
import authSlice from 'features/auth/slice/authSlice.js'
import cartSlice from 'features/cart/slice/cartSlice.js'
import wishlistSlice from 'features/wishlist/slice/wishlistSlice.js'

// 액션 로깅 처리 담당 미들웨어 (개발 환경에서만)
// eslint-disable-next-line no-unused-vars
const myLoggerMiddleware = (store) => (next) => (action) => {
  if (process.env.NODE_ENV === 'development') {
    console.log("dispatch :: ", action);
  }
  const result = next(action);
  if (process.env.NODE_ENV === 'development') {
    console.log("next state :: ", store.getState());
  }
  return result;
}

// 장바구니 & 위시리스트 상태 저장 : LocalStorage 저장
// eslint-disable-next-line no-unused-vars
const myCartSaveMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  // 장바구니(cartSlice) 경우에만 저장
  if (typeof action.type === "string" && action.type.startsWith("cart/")) {
    const cart = store.getState().cart;
    localStorage.setItem("cart", JSON.stringify(cart.items));
  }

  // 위시리스트(wishlistSlice) 경우에만 저장
  if (typeof action.type === "string" && action.type.startsWith("wishlist/")) {
    const wishlist = store.getState().wishlist;
    localStorage.setItem("wishlist", JSON.stringify(wishlist.items));
  }

  return result;
}

export const store = configureStore({
  reducer: {
    auth: authSlice,
    cart: cartSlice,
    wishlist: wishlistSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(myLoggerMiddleware, myCartSaveMiddleware),
})