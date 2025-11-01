import { createSlice } from '@reduxjs/toolkit'
import storage from '../../../utils/storage.js'

// 초기 상태를 localStorage에서 복원
const loadInitialState = () => {
  const savedUser = storage.get("loginUser");
  const isLogin = storage.get("isLogin", false);

  return {
    user: savedUser,           // { id, name, email, ... }
    isLogin: isLogin === true || isLogin === "true",
    ready: true                // 복원 완료
  };
};

export const authSlice = createSlice({
  name: 'auth',
  initialState: loadInitialState(),
  reducers: {
    login(state, action) {
        // userId (일반 로그인) 또는 id (SNS 로그인) 처리
        const { userId, id, ...rest } = action.payload;
        const finalId = userId || id;

        // user 객체 생성 (id 필드로 통일)
        const userData = {
          ...rest,
          id: finalId
        };

        // Redux 상태 업데이트
        state.isLogin = true;
        state.user = userData;

        // localStorage 동기화
        storage.set("isLogin", true);
        storage.set("loginUser", userData);

        // 레거시 loginInfo (admin/1234 테스트용 및 SNS 로그인)
        if (finalId) {
          const loginInfo = {"token": "123455dkfdf", "userId": finalId};
          storage.set("loginInfo", loginInfo);
        }
    },
    logout(state) {
        // Redux 상태 초기화
        state.isLogin = false;
        state.user = null;

        // localStorage 정리
        storage.remove("loginUser");
        storage.remove("loginInfo");
        storage.remove("auth");
        storage.set("isLogin", false);
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

// Action creators are generated for each case reducer function
export const { login, logout, issueWelcomeCoupon } = authSlice.actions

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectIsLogin = (state) => state.auth.isLogin;
export const selectAuthReady = (state) => state.auth.ready;

export default authSlice.reducer 