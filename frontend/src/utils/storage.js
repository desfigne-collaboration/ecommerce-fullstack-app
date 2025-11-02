/**
 * ============================================================================
 * storage.js - LocalStorage 유틸리티 모듈
 * ============================================================================
 *
 * 【목적】
 * - 브라우저 localStorage에 대한 안전하고 일관된 접근 방법 제공
 * - JSON 직렬화/역직렬화 자동 처리
 * - 에러 핸들링을 통한 안정성 보장
 *
 * 【주요 기능】
 * 1. getItem: 데이터 읽기 (JSON 자동 파싱)
 * 2. setItem: 데이터 저장 (JSON 자동 변환)
 * 3. removeItem: 데이터 삭제
 * 4. clear: 전체 초기화
 * 5. hasItem: 존재 여부 확인
 *
 * 【사용되는 데이터】
 * - cart: 장바구니 아이템 목록
 * - wishlist: 찜한 상품 목록
 * - loginUser: 로그인한 사용자 정보
 * - isLogin: 로그인 여부
 * - recentSearches: 최근 검색어
 * - coupons: 쿠폰 목록
 *
 * 【왜 유틸리티를 사용하는가?】
 * - localStorage는 문자열만 저장 가능 → JSON 변환 필요
 * - 에러 처리를 중앙화하여 코드 중복 방지
 * - 타입 안정성 및 fallback 값 제공
 *
 * @author Claude Code
 * @since 2025-11-02
 */

import { logError } from './errorHandler.js';

// ============================================================================
// Public Functions (Named Exports)
// ============================================================================

/**
 * localStorage에서 값 가져오기
 *
 * @description
 * 지정된 키의 값을 localStorage에서 읽어옵니다.
 * 저장된 JSON 문자열을 자동으로 파싱하여 객체/배열로 반환합니다.
 *
 * @param {string} key - localStorage 키 (예: "cart", "loginUser")
 * @param {*} fallback - 값이 없거나 에러 발생 시 반환할 기본값 (기본: null)
 * @returns {*} 파싱된 JavaScript 값 또는 fallback
 *
 * @example
 * // 장바구니 데이터 가져오기 (없으면 빈 배열)
 * const cart = storage.get("cart", [])
 * // → [{id: "123", product: {...}, qty: 2}, ...]
 *
 * // 로그인 사용자 정보 가져오기 (없으면 null)
 * const user = storage.get("loginUser")
 * // → {id: "admin", name: "관리자", ...} 또는 null
 *
 * @throws {Error} JSON 파싱 실패 시 에러 로그 출력 후 fallback 반환
 */
export const getItem = (key, fallback = null) => {
  try {
    const item = localStorage.getItem(key);  // 문자열로 가져오기
    if (item === null) return fallback;      // 값이 없으면 fallback 반환
    return JSON.parse(item);                 // JSON 문자열을 객체로 변환
  } catch (error) {
    // JSON 파싱 에러 또는 localStorage 접근 에러 처리
    logError(error, `Storage get: ${key}`);
    return fallback;
  }
};

/**
 * localStorage에 값 저장
 *
 * @description
 * JavaScript 값을 JSON 문자열로 변환하여 localStorage에 저장합니다.
 * 객체, 배열, 문자열, 숫자, boolean 모두 저장 가능합니다.
 *
 * @param {string} key - localStorage 키
 * @param {*} value - 저장할 값 (모든 직렬화 가능한 타입)
 * @returns {boolean} 저장 성공 여부 (true: 성공, false: 실패)
 *
 * @example
 * // 장바구니에 아이템 저장
 * storage.set("cart", [
 *   {id: "123", product: {...}, qty: 2}
 * ])
 *
 * // 로그인 상태 저장
 * storage.set("isLogin", true)
 *
 * // 사용자 정보 저장
 * storage.set("loginUser", {
 *   id: "admin",
 *   name: "관리자"
 * })
 *
 * @throws {Error} JSON 직렬화 실패 또는 용량 초과 시 에러 로그 출력
 */
export const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));  // 객체 → JSON 문자열로 변환 후 저장
    return true;
  } catch (error) {
    // 저장 실패 원인: quota 초과, private 모드, 직렬화 불가능한 값 등
    logError(error, `Storage set: ${key}`);
    return false;
  }
};

/**
 * localStorage에서 값 삭제
 *
 * @description
 * 지정된 키의 값을 localStorage에서 제거합니다.
 * 로그아웃 시 사용자 정보 삭제, 장바구니 비우기 등에 사용됩니다.
 *
 * @param {string} key - 삭제할 localStorage 키
 * @returns {boolean} 삭제 성공 여부 (true: 성공, false: 실패)
 *
 * @example
 * // 로그아웃 시 사용자 정보 삭제
 * storage.remove("loginUser")
 * storage.remove("loginInfo")
 * storage.remove("auth")
 *
 * // 장바구니 비우기
 * storage.remove("cart")
 */
export const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    logError(error, `Storage remove: ${key}`);
    return false;
  }
};

/**
 * localStorage 전체 초기화
 *
 * @description
 * localStorage의 모든 데이터를 삭제합니다.
 * 주의: 이 작업은 되돌릴 수 없습니다!
 *
 * @returns {boolean} 초기화 성공 여부 (true: 성공, false: 실패)
 *
 * @example
 * // 앱 데이터 완전 초기화 (개발/테스트용)
 * if (confirm("모든 데이터를 삭제하시겠습니까?")) {
 *   storage.clear()
 * }
 *
 * @warning
 * 실제 서비스에서는 신중하게 사용해야 합니다.
 * 보통은 개별 키를 remove하는 것이 안전합니다.
 */
export const clear = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    logError(error, 'Storage clear');
    return false;
  }
};

/**
 * 특정 키가 존재하는지 확인
 *
 * @description
 * localStorage에 해당 키가 존재하는지 확인합니다.
 * 값의 내용과 관계없이 존재 여부만 체크합니다.
 *
 * @param {string} key - 확인할 키
 * @returns {boolean} 존재 여부 (true: 존재, false: 없음)
 *
 * @example
 * // 로그인 여부 확인
 * if (storage.has("loginUser")) {
 *   console.log("로그인 상태입니다")
 * }
 *
 * // 장바구니에 아이템이 있는지 확인
 * const hasCart = storage.has("cart")
 */
export const hasItem = (key) => {
  return localStorage.getItem(key) !== null;
};

// ============================================================================
// Default Export (객체 형태 - 네임스페이스 패턴)
// ============================================================================
/**
 * storage 객체 (Default Export)
 *
 * @description
 * 모든 storage 함수를 하나의 객체로 묶어서 export합니다.
 * 더 간결한 사용을 위해 메서드명을 짧게 alias합니다.
 *
 * @constant
 * @type {Object}
 *
 * @example
 * // 방법 1: Default import (권장)
 * import storage from './utils/storage'
 * const cart = storage.get("cart", [])
 * storage.set("cart", newCart)
 *
 * // 방법 2: Named import
 * import { getItem, setItem } from './utils/storage'
 * const cart = getItem("cart", [])
 * setItem("cart", newCart)
 */
const storage = {
  get: getItem,      // 읽기
  set: setItem,      // 쓰기
  remove: removeItem, // 삭제
  clear,             // 전체 초기화
  has: hasItem,      // 존재 확인
};

export default storage;
