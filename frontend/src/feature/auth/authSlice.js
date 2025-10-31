import { createSlice } from '@reduxjs/toolkit'

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLogin: false
  },
  reducers: {
    login(state, action) {
        state.isLogin = true;
        const { userId } = action.payload;
        const loginInfo = {"token": "123455dkfdf", "userId": userId};
        localStorage.setItem("loginInfo", JSON.stringify(loginInfo));
        localStorage.setItem("isLogin", state.isLogin);

    },
    logout(state) {
        state.isLogin = false;
    }
  }
})

// Action creators are generated for each case reducer function
export const { login, logout } = authSlice.actions

export default authSlice.reducer 