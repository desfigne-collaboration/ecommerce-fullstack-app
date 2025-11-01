/**
 * 에러 핸들링 유틸리티
 *
 * 앱 전체에서 일관된 에러 처리를 제공합니다.
 */

/**
 * 에러 메시지를 사용자 친화적인 메시지로 변환
 */
export const getErrorMessage = (error) => {
  if (!error) return "알 수 없는 오류가 발생했습니다.";

  // 에러가 문자열인 경우
  if (typeof error === "string") return error;

  // 에러 객체인 경우
  if (error.message) {
    // 네트워크 에러
    if (error.message.includes("NetworkError") || error.message.includes("Failed to fetch")) {
      return "네트워크 연결을 확인해주세요.";
    }

    // 타임아웃 에러
    if (error.message.includes("timeout")) {
      return "요청 시간이 초과되었습니다. 다시 시도해주세요.";
    }

    // JSON 파싱 에러
    if (error.message.includes("JSON") || error.message.includes("parse")) {
      return "데이터 처리 중 오류가 발생했습니다.";
    }

    return error.message;
  }

  // HTTP 상태 코드별 메시지
  if (error.status) {
    switch (error.status) {
      case 400:
        return "잘못된 요청입니다.";
      case 401:
        return "로그인이 필요합니다.";
      case 403:
        return "접근 권한이 없습니다.";
      case 404:
        return "요청하신 정보를 찾을 수 없습니다.";
      case 500:
        return "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
      case 503:
        return "서비스를 일시적으로 사용할 수 없습니다.";
      default:
        return `오류가 발생했습니다. (코드: ${error.status})`;
    }
  }

  return "오류가 발생했습니다. 다시 시도해주세요.";
};

/**
 * 에러를 콘솔에 로깅
 */
export const logError = (error, context = "") => {
  const timestamp = new Date().toISOString();
  const prefix = context ? `[${context}]` : "";

  console.error(`${timestamp} ${prefix} Error:`, error);

  // 에러 스택이 있으면 함께 출력
  if (error && error.stack) {
    console.error("Stack trace:", error.stack);
  }
};

/**
 * 에러 핸들러 (콘솔 로깅 + 사용자 메시지 반환)
 */
export const handleError = (error, context = "", options = {}) => {
  const { silent = false, customMessage } = options;

  // 콘솔에 에러 로깅
  logError(error, context);

  // 사용자 친화적 메시지 생성
  const userMessage = customMessage || getErrorMessage(error);

  // silent 모드가 아니면 alert 표시
  if (!silent) {
    alert(userMessage);
  }

  return userMessage;
};

/**
 * API 호출을 감싸는 헬퍼 함수
 *
 * @param {Function} apiCall - 실행할 API 함수
 * @param {Object} options - 옵션
 * @param {string} options.context - 에러 컨텍스트
 * @param {string} options.errorMessage - 커스텀 에러 메시지
 * @param {Function} options.onError - 에러 발생 시 실행할 콜백
 * @param {boolean} options.silent - 에러 알림 표시 여부
 * @returns {Promise} API 호출 결과
 */
export const withErrorHandling = async (apiCall, options = {}) => {
  const {
    context = "API",
    errorMessage,
    onError,
    silent = false,
  } = options;

  try {
    const result = await apiCall();
    return result;
  } catch (error) {
    // 에러 핸들링
    const message = handleError(error, context, { silent, customMessage: errorMessage });

    // 에러 콜백 실행
    if (onError && typeof onError === "function") {
      onError(error, message);
    }

    // 에러를 다시 throw하여 호출자가 처리할 수 있도록 함
    throw error;
  }
};

/**
 * localStorage 작업을 안전하게 실행
 */
export const safeStorageOperation = (operation, fallback = null) => {
  try {
    return operation();
  } catch (error) {
    logError(error, "Storage");
    return fallback;
  }
};

/**
 * JSON 파싱을 안전하게 실행
 */
export const safeJsonParse = (jsonString, fallback = null) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    logError(error, "JSON Parse");
    return fallback;
  }
};

/**
 * 에러 바운더리용 에러 리포팅 함수
 */
export const reportError = (error, errorInfo) => {
  // 프로덕션 환경에서는 Sentry, LogRocket 등의 서비스로 전송
  if (process.env.NODE_ENV === "production") {
    // TODO: 에러 리포팅 서비스 연동
    console.error("Error reported:", error, errorInfo);
  } else {
    console.error("Error:", error);
    console.error("Error Info:", errorInfo);
  }
};

export default {
  getErrorMessage,
  logError,
  handleError,
  withErrorHandling,
  safeStorageOperation,
  safeJsonParse,
  reportError,
};
