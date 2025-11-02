import { createSlice } from '@reduxjs/toolkit'
import storage from '../../../utils/storage.js'



export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLogin: false,
  },

  reducers: {

    login(state, action) {
      state.isLogin = true;
      const { userId } = action.payload;
      const loginInfo = { "token": "123455dkfdf", "userId": userId };
      localStorage.setItem("loginInfo", JSON.stringify(loginInfo));
      localStorage.setItem("isLogin", state.isLogin);

    },

    logout(state) {
      state.isLogin = false;
      localStorage.removeItem("loginInfo");
      localStorage.removeItem("isLogin");
    },

    issueWelcomeCoupon(state) {
      const savedCoupons = storage.get("coupons", []);
      const hasWelcomeCoupon = savedCoupons.some((c) => c.id === "welcome-10000");

      if (!hasWelcomeCoupon) {
        const newCoupon = {
          id: "welcome-10000",
          name: "신규가입 1만원 할인 쿠폰",
          amount: 10000,
          type: "fixed",
          discount: "₩10,000",
          used: false,
          createdAt: new Date().toISOString(),
        };

        const updatedCoupons = [...savedCoupons, newCoupon];
        storage.set("coupons", updatedCoupons);
      }
    }
  }
})


export const { login, logout, issueWelcomeCoupon } = authSlice.actions
export const selectUser = (state) => state.auth.user;
export const selectIsLogin = (state) => state.auth.isLogin;
export const selectAuthReady = (state) => state.auth.ready;
export default authSlice.reducer
