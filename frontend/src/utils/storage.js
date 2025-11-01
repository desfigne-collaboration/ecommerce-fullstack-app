/**
 * localStorage 유틸리티
 * 전체 앱에서 일관된 storage 접근 방식 제공
 */
import { logError } from './errorHandler.js';

/**
 * localStorage에서 값 가져오기
 * @param {string} key - 저장소 키
 * @param {*} fallback - 값이 없을 때 반환할 기본값
 * @returns {*} 파싱된 값 또는 fallback
 */
export const getItem = (key, fallback = null) => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return fallback;
    return JSON.parse(item);
  } catch (error) {
    logError(error, `Storage get: ${key}`);
    return fallback;
  }
};

/**
 * localStorage에 값 저장
 * @param {string} key - 저장소 키
 * @param {*} value - 저장할 값 (자동으로 JSON.stringify)
 * @returns {boolean} 저장 성공 여부
 */
export const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    logError(error, `Storage set: ${key}`);
    return false;
  }
};

/**
 * localStorage에서 값 삭제
 * @param {string} key - 삭제할 키
 * @returns {boolean} 삭제 성공 여부
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
 * @returns {boolean} 초기화 성공 여부
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
 * @param {string} key - 확인할 키
 * @returns {boolean} 존재 여부
 */
export const hasItem = (key) => {
  return localStorage.getItem(key) !== null;
};

// Default export (객체 형태)
const storage = {
  get: getItem,
  set: setItem,
  remove: removeItem,
  clear,
  has: hasItem,
};

export default storage;
