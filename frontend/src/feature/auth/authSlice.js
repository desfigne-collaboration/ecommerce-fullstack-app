import { createSlice } from '@reduxjs/toolkit'
import storage from '../../utils/storage.js'

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
        storage.set("loginInfo", loginInfo);
        storage.set("isLogin", state.isLogin);

    },
    logout(state) {
        state.isLogin = false;
        storage.remove("loginInfo");
        storage.set("isLogin", false);
    }
  }
})

// Action creators are generated for each case reducer function
export const { login, logout } = authSlice.actions

export default authSlice.reducer 