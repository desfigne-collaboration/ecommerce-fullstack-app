/**
 * ============================================================================
 * store.js - Redux Store 설정 파일
 * ============================================================================
 *
 * 【목적】
 * - Redux Toolkit을 사용한 전역 상태 관리 스토어 생성
 * - 애플리케이션 전체에서 공유되는 상태(state) 중앙 집중 관리
 * - 커스텀 미들웨어를 통한 로깅 및 영속성(persistence) 구현
 *
 * 【Redux 상태 구조】
 * store
 * ├── auth        (인증)      : 로그인 사용자 정보, 로그인 여부
 * ├── cart        (장바구니)   : 장바구니 아이템 목록
 * └── wishlist    (찜)        : 찜한 상품 목록
 *
 * 【미들웨어】
 * 1. myLoggerMiddleware: 개발 환경에서 모든 액션과 상태 변화를 콘솔 로그
 * 2. myCartSaveMiddleware: cart/wishlist 액션 발생 시 localStorage에 자동 저장
 *
 * 【Redux Toolkit 장점】
 * - Slice 기반 구조로 보일러플레이트 코드 감소
 * - Immer.js 내장으로 불변성 관리 자동화
 * - DevTools Extension 자동 연동
 *
 * 【사용 방법】
 * // 컴포넌트에서 상태 읽기
 * const user = useSelector(state => state.auth.user)
 *
 * // 컴포넌트에서 상태 변경
 * const dispatch = useDispatch()
 * dispatch(login({ userId: 'admin' }))
 *
 * @author Claude Code
 * @since 2025-11-02
 */

import { configureStore } from '@reduxjs/toolkit'

// ============================================================================
// Redux Slices Import
// ============================================================================
// Slice: Redux Toolkit에서 reducer와 actions를 하나로 묶은 단위
import authSlice from 'features/auth/slice/authSlice.js'           // 인증 관련 상태
import cartSlice from 'features/cart/slice/cartSlice.js'           // 장바구니 관련 상태
import wishlistSlice from 'features/wishlist/slice/wishlistSlice.js' // 찜 관련 상태

// ============================================================================
// 커스텀 미들웨어 1: Logger (개발 환경 전용)
// ============================================================================
/**
 * myLoggerMiddleware
 *
 * @description
 * Redux 액션이 dispatch될 때마다 콘솔에 로그를 출력합니다.
 * 개발 중 상태 변화를 추적하기 위한 디버깅 도구입니다.
 *
 * @middleware
 * @param {Object} store - Redux store 객체
 * @param {Function} next - 다음 미들웨어 또는 reducer로 전달하는 함수
 * @param {Object} action - dispatch된 액션 객체
 *
 * @example
 * // 콘솔 출력 예시
 * dispatch :: { type: 'cart/addItem', payload: {...} }
 * next state :: { auth: {...}, cart: {...}, wishlist: {...} }
 */
// eslint-disable-next-line no-unused-vars
const myLoggerMiddleware = (store) => (next) => (action) => {
  // 개발 환경에서만 동작 (프로덕션에서는 성능 저하 방지)
  if (process.env.NODE_ENV === 'development') {
    console.log("dispatch :: ", action);  // 어떤 액션이 발생했는지 출력
  }

  // 다음 미들웨어 또는 reducer로 액션 전달
  const result = next(action);

  // 액션 처리 후 변경된 전체 상태 출력
  if (process.env.NODE_ENV === 'development') {
    console.log("next state :: ", store.getState());
  }

  return result;
}

// ============================================================================
// 커스텀 미들웨어 2: LocalStorage 자동 저장
// ============================================================================
/**
 * myCartSaveMiddleware
 *
 * @description
 * cart 또는 wishlist 관련 액션이 dispatch되면
 * 자동으로 localStorage에 저장하여 브라우저 새로고침 후에도 데이터를 유지합니다.
 *
 * @middleware
 * @param {Object} store - Redux store 객체
 * @param {Function} next - 다음 미들웨어 또는 reducer로 전달하는 함수
 * @param {Object} action - dispatch된 액션 객체
 *
 * @example
 * // 장바구니에 아이템 추가 시
 * dispatch(addItem(product))
 * → cart/ 액션 감지
 * → localStorage.setItem("cart", JSON.stringify(items))
 *
 * // 저장되는 데이터 형식
 * localStorage.cart = '[{id: "123", product: {...}, qty: 2}, ...]'
 */
// eslint-disable-next-line no-unused-vars
const myCartSaveMiddleware = (store) => (next) => (action) => {
  // 먼저 액션을 처리 (상태 업데이트)
  const result = next(action);

  // 장바구니 액션인 경우 (예: cart/addItem, cart/removeItem, cart/updateQuantity)
  if (typeof action.type === "string" && action.type.startsWith("cart/")) {
    const cart = store.getState().cart;  // 최신 장바구니 상태 가져오기
    localStorage.setItem("cart", JSON.stringify(cart.items));  // localStorage에 저장
  }

  // 찜 목록 액션인 경우 (예: wishlist/toggleWishlist)
  if (typeof action.type === "string" && action.type.startsWith("wishlist/")) {
    const wishlist = store.getState().wishlist;  // 최신 찜 목록 상태 가져오기
    localStorage.setItem("wishlist", JSON.stringify(wishlist.items));  // localStorage에 저장
  }

  return result;
}

// ============================================================================
// Redux Store 생성 및 Export
// ============================================================================
/**
 * Redux Store 인스턴스
 *
 * @description
 * Redux Toolkit의 configureStore를 사용하여 생성된 스토어입니다.
 * index.js에서 Provider로 감싸 전체 앱에서 사용할 수 있게 합니다.
 *
 * @constant
 * @type {import('@reduxjs/toolkit').EnhancedStore}
 *
 * @property {Object} reducer - 각 slice의 reducer를 결합한 루트 reducer
 * @property {Array} middleware - 기본 미들웨어 + 커스텀 미들웨어
 *
 * @example
 * // index.js에서 사용
 * import { Provider } from 'react-redux'
 * import { store } from './store/store'
 *
 * <Provider store={store}>
 *   <App />
 * </Provider>
 */
export const store = configureStore({
  // Reducer 설정: 상태 트리 구조 정의
  reducer: {
    auth: authSlice,        // state.auth로 접근
    cart: cartSlice,        // state.cart로 접근
    wishlist: wishlistSlice, // state.wishlist로 접근
  },

  // Middleware 설정: 액션 처리 전후에 실행되는 함수들
  // getDefaultMiddleware(): Redux Toolkit이 제공하는 기본 미들웨어
  //   - redux-thunk (비동기 액션 처리)
  //   - Immer (불변성 체크)
  //   - Serializable check (직렬화 가능 데이터 체크)
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(myLoggerMiddleware)      // 커스텀 로거 추가
      .concat(myCartSaveMiddleware),   // 커스텀 localStorage 저장 추가
})