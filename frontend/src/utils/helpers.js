/**
 * 공통 유틸리티 함수 모음
 */

/**
 * 가격 값을 숫자로 파싱
 * @param {string|number} value - 파싱할 가격 값
 * @returns {number} 파싱된 숫자 값
 */
export const parsePrice = (value) => {
  if (typeof value === 'number') return value;
  return Number(String(value ?? '').replace(/[^\d]/g, '')) || 0;
};

/**
 * localStorage에서 JSON 데이터 가져오기
 * @param {string} key - localStorage 키
 * @param {*} fallback - 실패 시 반환할 기본값
 * @returns {*} 파싱된 데이터 또는 fallback
 */
export const getLocalStorage = (key, fallback = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.error(`localStorage 읽기 실패 (key: ${key}):`, error);
    return fallback;
  }
};

/**
 * localStorage에 JSON 데이터 저장
 * @param {string} key - localStorage 키
 * @param {*} value - 저장할 값
 * @returns {boolean} 성공 여부
 */
export const setLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`localStorage 저장 실패 (key: ${key}):`, error);
    return false;
  }
};

/**
 * 가격을 한국 통화 형식으로 포맷
 * @param {string|number} price - 포맷할 가격
 * @returns {string} 포맷된 가격 (예: "10,000원")
 */
export const formatPrice = (price) => {
  const numPrice = parsePrice(price);
  return numPrice.toLocaleString('ko-KR') + '원';
};

/**
 * 배열에서 특정 조건에 맞는 아이템 토글
 * @param {Array} array - 원본 배열
 * @param {*} item - 추가/제거할 아이템
 * @param {Function} compareFn - 비교 함수
 * @returns {{array: Array, added: boolean}} 업데이트된 배열과 추가 여부
 */
export const toggleArrayItem = (array, item, compareFn) => {
  const index = array.findIndex(compareFn);

  if (index >= 0) {
    // 존재하면 제거
    return {
      array: array.filter((_, i) => i !== index),
      added: false
    };
  } else {
    // 없으면 추가
    return {
      array: [...array, item],
      added: true
    };
  }
};
