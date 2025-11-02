/**
 * ============================================================================
 * authSlice.js - 인증 Redux Slice
 * ============================================================================
 *
 * 【목적】
 * - 로그인/로그아웃 상태를 Redux로 관리
 * - localStorage와 동기화하여 새로고침 후에도 로그인 유지
 * - 전역 인증 상태 제공 (모든 컴포넌트에서 접근 가능)
 *
 * 【Redux Slice란?】
 * Redux Toolkit에서 제공하는 패턴으로, reducer와 actions를 하나로 묶어
 * 보일러플레이트 코드를 줄이고 상태 관리를 단순화합니다.
 *
 * 【상태 구조】
 * state.auth = {
 *   user: { id, name, email, ... } | null,  // 로그인한 사용자 정보
 *   isLogin: boolean,                       // 로그인 여부
 *   ready: boolean                          // 초기화 완료 여부
 * }
 *
 * 【주요 기능】
 * 1. login: 사용자 로그인 처리 (일반/SNS 모두 지원)
 * 2. logout: 로그아웃 처리 및 데이터 정리
 * 3. issueWelcomeCoupon: 신규 회원 가입 쿠폰 발급
 *
 * 【localStorage 동기화】
 * - loginUser: 사용자 정보 객체
 * - isLogin: 로그인 여부
 * - loginInfo: 레거시 토큰 정보 (admin/1234 테스트용)
 * - coupons: 쿠폰 목록 (신규 가입 쿠폰 포함)
 *
 * @module authSlice
 * @author Claude Code
 * @since 2025-11-02
 */

import { createSlice } from '@reduxjs/toolkit'
import storage from '../../../utils/storage.js'

// ============================================================================
// 초기 상태 복원 함수
// ============================================================================
/**
 * loadInitialState - localStorage에서 초기 상태 복원
 *
 * @description
 * 브라우저 새로고침 시에도 로그인 상태를 유지하기 위해
 * localStorage에 저장된 데이터를 읽어와 초기 상태로 설정합니다.
 *
 * @returns {Object} 초기 상태 객체
 * @returns {Object|null} state.user - 저장된 사용자 정보
 * @returns {boolean} state.isLogin - 로그인 여부
 * @returns {boolean} state.ready - 복원 완료 플래그
 *
 * @example
 * // localStorage에 loginUser가 있으면:
 * {
 *   user: { id: "admin", name: "관리자", email: "admin@test.com" },
 *   isLogin: true,
 *   ready: true
 * }
 *
 * // localStorage에 데이터가 없으면:
 * {
 *   user: null,
 *   isLogin: false,
 *   ready: true
 * }
 */
const loadInitialState = () => {
  const savedUser = storage.get("loginUser");
  const isLogin = storage.get("isLogin", false);

  return {
    user: savedUser,           // { id, name, email, ... }
    isLogin: isLogin === true || isLogin === "true",  // boolean 변환
    ready: true                // 복원 완료
  };
};

// ============================================================================
// Auth Slice 정의
// ============================================================================
/**
 * authSlice - 인증 상태 관리 Slice
 *
 * @description
 * Redux Toolkit의 createSlice를 사용하여 인증 관련 상태와 액션을 정의합니다.
 */
export const authSlice = createSlice({
  name: 'auth',
  initialState: loadInitialState(),
  reducers: {
    /**
     * login - 로그인 처리 리듀서
     *
     * @description
     * 사용자 로그인 시 호출됩니다.
     * 일반 로그인과 SNS 로그인 모두 처리 가능합니다.
     *
     * @param {Object} state - 현재 Redux 상태
     * @param {Object} action - 액션 객체
     * @param {Object} action.payload - 로그인 데이터
     * @param {string} action.payload.userId - 일반 로그인 사용자 ID
     * @param {string} action.payload.id - SNS 로그인 사용자 ID
     * @param {string} [action.payload.name] - 사용자 이름
     * @param {string} [action.payload.email] - 이메일
     *
     * @example
     * // 일반 로그인
     * dispatch(login({ userId: "admin", name: "관리자", email: "admin@test.com" }))
     *
     * @example
     * // SNS 로그인 (Naver/Kakao)
     * dispatch(login({ id: "naver_123456", name: "홍길동", email: "hong@naver.com" }))
     */
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

        // localStorage 동기화 (새로고침 후에도 유지)
        storage.set("isLogin", true);
        storage.set("loginUser", userData);

        // 레거시 loginInfo (admin/1234 테스트용 및 SNS 로그인)
        // TODO: 실제 JWT 토큰 방식으로 교체 필요
        if (finalId) {
          const loginInfo = {"token": "123455dkfdf", "userId": finalId};
          storage.set("loginInfo", loginInfo);
        }
    },

    /**
     * logout - 로그아웃 처리 리듀서
     *
     * @description
     * 로그아웃 시 Redux 상태와 localStorage를 모두 초기화합니다.
     *
     * @param {Object} state - 현재 Redux 상태
     *
     * @example
     * dispatch(logout())
     */
    logout(state) {
        // Redux 상태 초기화
        state.isLogin = false;
        state.user = null;

        // localStorage 정리 (모든 로그인 관련 데이터 삭제)
        storage.remove("loginUser");
        storage.remove("loginInfo");
        storage.remove("auth");
        storage.set("isLogin", false);
    },

    /**
     * issueWelcomeCoupon - 신규 가입 쿠폰 발급 리듀서
     *
     * @description
     * 신규 회원가입 시 10,000원 할인 쿠폰을 자동 발급합니다.
     * 이미 발급된 경우에는 중복 발급하지 않습니다.
     *
     * @param {Object} state - 현재 Redux 상태
     *
     * @example
     * // 회원가입 성공 후 호출
     * dispatch(issueWelcomeCoupon())
     */
    issueWelcomeCoupon(state) {
        // 기존 쿠폰 목록 가져오기
        const savedCoupons = storage.get("coupons", []);

        // 이미 신규가입 쿠폰이 있는지 확인
        const hasWelcomeCoupon = savedCoupons.some((c) => c.id === "welcome-10000");

        if (!hasWelcomeCoupon) {
          // 신규 쿠폰 생성
          const newCoupon = {
            id: "welcome-10000",
            name: "신규가입 1만원 할인 쿠폰",
            amount: 10000,
            type: "fixed",
            discount: "₩10,000",
            used: false,
            createdAt: new Date().toISOString(),
          };

          // 쿠폰 목록에 추가하고 저장
          const updatedCoupons = [...savedCoupons, newCoupon];
          storage.set("coupons", updatedCoupons);
        }
    }
  }
})

// ============================================================================
// Actions Export
// ============================================================================
/**
 * @description
 * Redux Toolkit이 자동으로 생성한 액션 생성자들입니다.
 * 컴포넌트에서 import하여 dispatch와 함께 사용합니다.
 */
export const { login, logout, issueWelcomeCoupon } = authSlice.actions

// ============================================================================
// Selectors
// ============================================================================
/**
 * selectUser - 사용자 정보 선택자
 *
 * @description
 * Redux 상태에서 현재 로그인한 사용자 정보를 가져옵니다.
 *
 * @param {Object} state - Redux 전체 상태
 * @returns {Object|null} 사용자 정보 객체 또는 null
 *
 * @example
 * const user = useSelector(selectUser)
 * // → { id: "admin", name: "관리자", email: "admin@test.com" }
 */
export const selectUser = (state) => state.auth.user;

/**
 * selectIsLogin - 로그인 여부 선택자
 *
 * @description
 * Redux 상태에서 로그인 여부를 가져옵니다.
 *
 * @param {Object} state - Redux 전체 상태
 * @returns {boolean} 로그인 여부
 *
 * @example
 * const isLogin = useSelector(selectIsLogin)
 * // → true or false
 */
export const selectIsLogin = (state) => state.auth.isLogin;

/**
 * selectAuthReady - 초기화 완료 여부 선택자
 *
 * @description
 * Redux 상태에서 인증 초기화 완료 여부를 가져옵니다.
 * localStorage 복원이 완료되면 true입니다.
 *
 * @param {Object} state - Redux 전체 상태
 * @returns {boolean} 초기화 완료 여부
 *
 * @example
 * const ready = useSelector(selectAuthReady)
 * // → true (항상 true, 향후 비동기 초기화 시 활용 가능)
 */
export const selectAuthReady = (state) => state.auth.ready;

// ============================================================================
// Reducer Export (Default)
// ============================================================================
/**
 * @description
 * authSlice의 reducer를 store.js에서 사용하기 위해 export합니다.
 *
 * @example
 * // store.js에서 사용
 * import authSlice from 'features/auth/slice/authSlice.js'
 *
 * export const store = configureStore({
 *   reducer: {
 *     auth: authSlice,
 *     ...
 *   }
 * })
 */
export default authSlice.reducer
