/**
 * ============================================================================
 * dataFetch.js - 데이터 통신 유틸리티
 * ============================================================================
 *
 * 【목적】
 * - 프론트엔드와 백엔드 간의 HTTP 통신을 위한 헬퍼 함수 모음
 * - fetch API와 axios 라이브러리를 모두 지원
 * - 일관된 에러 핸들링 및 로깅 제공
 *
 * 【제공 함수】
 * 1. **fetchData**: Native fetch API를 사용한 GET 요청
 * 2. **axiosGet**: axios를 사용한 GET 요청
 * 3. **axiosPost**: axios를 사용한 POST 요청 (폼 데이터 전송)
 * 4. **axiosData**: axiosGet과 동일 (별칭)
 * 5. **groupByRows**: 배열을 n개씩 그룹화하는 유틸 함수
 *
 * 【Fetch vs Axios】
 * - **fetch**: 브라우저 내장 API, 가볍고 빠름
 * - **axios**: 자동 JSON 변환, 인터셉터, 취소 기능 등 강력
 *
 * 【에러 처리】
 * - 모든 함수는 errorHandler.logError()로 에러 로깅
 * - 에러를 catch하지 않고 throw하여 호출자가 처리
 *
 * 【사용 대상】
 * - authAPI.js (로그인/로그아웃)
 * - orders.js (주문 API)
 * - productData.js (상품 목록)
 *
 * @module dataFetch
 * @author Claude Code
 * @since 2025-11-02
 */

import axios from 'axios';
import { logError } from './errorHandler.js';

/**
 * fetchData - Native fetch API를 사용한 데이터 가져오기
 *
 * @description
 * HTTP GET 요청을 보내고 JSON 응답을 파싱합니다.
 * 브라우저 내장 fetch API를 사용하므로 추가 라이브러리 불필요합니다.
 *
 * @async
 * @param {string} url - 요청할 URL
 * @returns {Promise<any>} JSON 파싱된 응답 데이터
 * @throws {Error} HTTP 에러 또는 네트워크 에러
 *
 * @example
 * const data = await fetchData("https://api.example.com/products");
 * console.log(data); // → { products: [...] }
 */
export const fetchData = async (url) => {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonData = await response.json(); // json 타입으로 파싱
        return jsonData;
    } catch (error) {
        logError(error, `fetchData: ${url}`);
        throw error;
    }
}

/**
 * axiosGet - axios GET 요청
 *
 * @description
 * axios 라이브러리를 사용한 GET 요청입니다.
 * fetch보다 편리한 기능 (자동 JSON 변환, 인터셉터 등)을 제공합니다.
 *
 * @async
 * @param {string} url - 요청할 URL
 * @returns {Promise<any>} response.data (자동으로 JSON 파싱됨)
 * @throws {Error} HTTP 에러 또는 네트워크 에러
 *
 * @example
 * const products = await axiosGet("/api/products");
 */
export const axiosGet = async (url) => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        logError(error, `axiosGet: ${url}`);
        throw error;
    }
}

/**
 * axiosPost - axios POST 요청
 *
 * @description
 * 폼 데이터를 서버로 전송합니다 (로그인, 회원가입 등).
 * Content-Type은 application/json으로 설정됩니다.
 *
 * @async
 * @param {string} url - 요청할 URL
 * @param {Object} formData - 전송할 폼 데이터 객체
 * @returns {Promise<any>} response.data (서버 응답)
 * @throws {Error} HTTP 에러 또는 네트워크 에러
 *
 * @example
 * const result = await axiosPost("/member/login", {
 *   id: "user123",
 *   password: "pass1234"
 * });
 * if (result.login) console.log("로그인 성공");
 */
export const axiosPost = async (url, formData) => {
    try {
        console.log("url, formData -> ", url, formData);
        const response = await axios.post(url, formData, {"Content-Type" : "application/json"});
        return response.data;
    } catch (error) {
        logError(error, `axiosPost: ${url}`);
        throw error;
    }
}

/**
 * axiosData - axiosGet의 별칭 (하위 호환성)
 *
 * @description
 * axiosGet과 동일한 기능입니다.
 * 기존 코드와의 호환성을 위해 유지됩니다.
 *
 * @async
 * @param {string} url - 요청할 URL
 * @returns {Promise<any>} response.data
 */
export const axiosData = async (url) => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        logError(error, `axiosData: ${url}`);
        throw error;
    }
}

/**
 * groupByRows - 배열을 n개씩 그룹화
 *
 * @description
 * 1차원 배열을 n개씩 묶어 2차원 배열로 변환합니다.
 * 상품 그리드 레이아웃에서 행 단위로 렌더링할 때 유용합니다.
 *
 * @param {Array} array - 원본 배열
 * @param {number} number - 한 행당 아이템 개수
 * @returns {Array<Array>} 그룹화된 2차원 배열
 *
 * @example
 * const items = [1, 2, 3, 4, 5, 6, 7];
 * const rows = groupByRows(items, 3);
 * console.log(rows);
 * // → [[1, 2, 3], [4, 5, 6], [7]]
 *
 * @example
 * // 상품 카드를 3열 그리드로 렌더링
 * const productRows = groupByRows(products, 3);
 * return (
 *   <div>
 *     {productRows.map((row, i) => (
 *       <div key={i} className="row">
 *         {row.map(p => <ProductCard key={p.id} product={p} />)}
 *       </div>
 *     ))}
 *   </div>
 * );
 */
export const groupByRows = (array, number) => {
    const rows = array.reduce((acc, cur, idx) => {
        if(idx % number === 0) acc.push([cur])
        else acc[acc.length-1].push(cur);

        return acc;
    }, [])

    return rows;
}
