/**
 * ============================================================================
 * authAPI.js - 인증 API 통신 레이어
 * ============================================================================
 *
 * 【목적】
 * - Redux Thunk를 사용한 인증 관련 비동기 API 호출 처리
 * - 회원가입, 로그인, 로그아웃 서버 통신 담당
 * - API 응답에 따른 Redux 액션 디스패치 자동화
 *
 * 【Redux Thunk란?】
 * Redux는 기본적으로 동기 액션만 처리하지만, Thunk를 사용하면
 * 비동기 작업(API 호출)을 수행한 후 액션을 디스패치할 수 있습니다.
 *
 * 【아키텍처 흐름】
 * Component → authAPI.getLogin() → Server API → Redux Action (login/logout)
 *                                                    ↓
 *                                              Redux Store 업데이트
 *                                                    ↓
 *                                            Component Re-render
 *
 * 【서버 엔드포인트】
 * - POST /member/signup : 회원가입
 * - POST /member/login  : 로그인
 * - POST /member/logout : 로그아웃
 *
 * 【특수 기능】
 * - 테스트 계정 지원: admin / 1234 (서버 없이 프론트엔드 테스트 가능)
 * - 폼 유효성 검증 통합 (validateFormCheck)
 * - 통합 에러 핸들링 (handleError)
 *
 * @module authAPI
 * @author Claude Code
 * @since 2025-11-02
 */

import { login, logout } from '../slice/authSlice.js';
import { axiosPost } from '../../../utils/dataFetch.js';
import { validateFormCheck } from '../../../utils/validate.js';
import { handleError } from '../../../utils/errorHandler.js';

// ============================================================================
// 회원가입 API
// ============================================================================
/**
 * getSignup - 회원가입 API 요청 (Redux Thunk)
 *
 * @description
 * 신규 사용자 등록을 위한 서버 API 호출을 처리합니다.
 * Spring Boot 백엔드의 /member/signup 엔드포인트와 통신합니다.
 *
 * @async
 * @function
 * @param {Object} formData - 회원가입 폼 데이터
 * @param {string} formData.id - 사용자 ID (4자 이상)
 * @param {string} formData.password - 비밀번호 (영문+숫자 조합)
 * @param {string} formData.name - 이름
 * @param {string} formData.email - 이메일
 * @param {string} [formData.phone] - 전화번호 (선택)
 *
 * @returns {Function} Redux Thunk 함수
 * @returns {Promise<Object|null>} 회원가입 성공 시 서버 응답, 실패 시 null
 *
 * @example
 * // Signup.jsx에서 사용 예시
 * import { useDispatch } from 'react-redux';
 * import { getSignup } from 'features/auth/api/authAPI';
 *
 * const dispatch = useDispatch();
 * const handleSignup = async () => {
 *   const formData = {
 *     id: "newuser",
 *     password: "pass1234",
 *     name: "홍길동",
 *     email: "hong@example.com"
 *   };
 *
 *   const result = await dispatch(getSignup(formData));
 *   if (result) {
 *     alert("회원가입 성공!");
 *     navigate("/login");
 *   } else {
 *     alert("회원가입 실패");
 *   }
 * };
 *
 * @see {@link module:authSlice~issueWelcomeCoupon} 회원가입 성공 시 쿠폰 발급
 */
export const getSignup = (formData) => async (dispatch) => {
   try {
       // Spring Boot 백엔드 회원가입 API 호출
       // POST 요청: { id, password, name, email, phone }
       const url = "http://localhost:8080/member/signup";
       const result = await axiosPost(url, formData);

       // 성공 시 서버 응답 반환 (예: { success: true, userId: "newuser" })
       return result;
   } catch (error) {
       // 통합 에러 핸들러로 에러 처리 (콘솔 로깅 + 사용자 알림)
       handleError(error, "Signup", {
           customMessage: "회원가입 처리 중 오류가 발생했습니다."
       });
       return null; // 실패 시 null 반환
   }
}

// ============================================================================
// 로그인 API
// ============================================================================
/**
 * getLogin - 로그인 API 요청 (Redux Thunk)
 *
 * @description
 * 사용자 로그인 처리를 담당합니다. 다음 2가지 로그인 방식을 지원합니다:
 *
 * 1. **테스트 계정 로그인** (서버 없이 개발/테스트용)
 *    - ID: admin, Password: 1234
 *    - 서버 API 호출 없이 즉시 로그인 처리
 *    - 프론트엔드 개발/테스트 시 유용
 *
 * 2. **실제 로그인** (서버 API 통신)
 *    - 폼 유효성 검증 (validateFormCheck) 선행
 *    - Spring Boot 백엔드와 통신
 *    - 서버 응답에 따라 로그인 성공/실패 처리
 *
 * @async
 * @function
 * @param {Object} formData - 로그인 폼 데이터
 * @param {string} formData.id - 사용자 ID
 * @param {string} formData.password - 비밀번호
 * @param {Object} param - 폼 유효성 검증용 파라미터 (refs, errors)
 * @param {Object} param.id - ID 입력 필드 ref
 * @param {Object} param.password - Password 입력 필드 ref
 * @param {Object} param.errors - 에러 메시지 상태 객체
 *
 * @returns {Function} Redux Thunk 함수
 * @returns {Promise<boolean>} 로그인 성공 시 true, 실패 시 false
 *
 * @example
 * // Login.jsx에서 사용 예시
 * import { useDispatch } from 'react-redux';
 * import { getLogin } from 'features/auth/api/authAPI';
 *
 * const dispatch = useDispatch();
 * const idRef = useRef();
 * const passwordRef = useRef();
 * const [errors, setErrors] = useState({});
 *
 * const handleLogin = async (e) => {
 *   e.preventDefault();
 *
 *   const formData = {
 *     id: idRef.current.value,
 *     password: passwordRef.current.value
 *   };
 *
 *   const param = {
 *     id: idRef.current,
 *     password: passwordRef.current,
 *     errors: errors
 *   };
 *
 *   const success = await dispatch(getLogin(formData, param));
 *   if (success) {
 *     navigate("/"); // 메인 페이지로 이동
 *   } else {
 *     alert("로그인에 실패했습니다.");
 *   }
 * };
 *
 * @example
 * // 테스트 계정으로 로그인
 * const testLogin = await dispatch(getLogin(
 *   { id: "admin", password: "1234" },
 *   {} // 테스트 계정은 유효성 검증 skip
 * ));
 * // → true (즉시 로그인 성공)
 *
 * @see {@link module:authSlice~login} Redux 로그인 액션
 * @see {@link module:validate~validateFormCheck} 폼 유효성 검증 함수
 */
export const getLogin = (formData, param) => async(dispatch) => {
    try {
        // ========================================
        // 1. 테스트 계정 처리 (admin / 1234)
        // ========================================
        // 서버 없이 프론트엔드 개발/테스트할 때 사용
        // 실제 배포 시에는 제거하거나 환경변수로 제어 권장
        if(formData.id === "admin" && formData.password === "1234") {
            // Redux 로그인 액션 디스패치 (즉시 로그인 상태로 전환)
            dispatch(login({"userId": formData.id}));
            return true; // 로그인 성공
        }

        // ========================================
        // 2. 실제 로그인 처리 (서버 API 통신)
        // ========================================
        // 폼 유효성 검증 먼저 수행 (빈 값, 형식 오류 체크)
        if(validateFormCheck(param)) {
            // Spring Boot 백엔드 로그인 API 호출
            const url = "/member/login";
            const result = await axiosPost(url, formData);

            // 서버 응답에 login: true 필드가 있으면 로그인 성공
            if(result.login) {
                // Redux 로그인 액션 디스패치 (전역 상태 업데이트)
                dispatch(login({"userId": formData.id}));
                return true; // 로그인 성공
            }
        }

        // 유효성 검증 실패 or 서버 응답 실패
        return false;
    } catch (error) {
        // API 호출 중 네트워크 오류 등 예외 처리
        handleError(error, "Login", {
            customMessage: "로그인 처리 중 오류가 발생했습니다."
        });
        return false; // 로그인 실패
    }
}


// ============================================================================
// 로그아웃 API
// ============================================================================
/**
 * getLogout - 로그아웃 API 요청 (Redux Thunk)
 *
 * @description
 * 사용자 로그아웃 처리를 담당합니다.
 *
 * 【특별한 처리 방식】
 * 로그아웃은 서버 API 호출 실패 여부와 관계없이 항상 클라이언트
 * 상태를 초기화합니다. 이유는 다음과 같습니다:
 *
 * 1. **사용자 의도 우선**: 사용자가 로그아웃을 원하면 무조건 처리
 * 2. **보안 고려**: 네트워크 오류로 서버 세션 삭제 실패해도 로컬 상태는 정리
 * 3. **UX 향상**: 로그아웃 실패로 사용자가 갇히는 상황 방지
 *
 * 【에러 처리】
 * - silent: true 옵션으로 조용히 에러 로깅만 수행
 * - 사용자에게는 알림 표시하지 않음 (UX 방해 최소화)
 *
 * @async
 * @function
 * @returns {Function} Redux Thunk 함수
 * @returns {Promise<boolean>} 서버 로그아웃 성공 시 true, 실패 시 false
 *                               (단, 클라이언트 상태는 항상 초기화됨)
 *
 * @example
 * // Logout.jsx 또는 Header.jsx에서 사용
 * import { useDispatch } from 'react-redux';
 * import { useNavigate } from 'react-router-dom';
 * import { getLogout } from 'features/auth/api/authAPI';
 *
 * const dispatch = useDispatch();
 * const navigate = useNavigate();
 *
 * const handleLogout = async () => {
 *   const result = await dispatch(getLogout());
 *
 *   // 서버 로그아웃 성공 여부와 무관하게 로그인 페이지로 이동
 *   // (클라이언트 상태는 이미 초기화됨)
 *   navigate("/login");
 *
 *   if (result) {
 *     console.log("서버 세션도 정상 삭제됨");
 *   } else {
 *     console.log("서버 세션 삭제 실패, but 클라이언트는 로그아웃됨");
 *   }
 * };
 *
 * @example
 * // 간단 사용 (서버 응답 무시)
 * await dispatch(getLogout());
 * navigate("/");
 *
 * @see {@link module:authSlice~logout} Redux 로그아웃 액션
 */
export const getLogout = () => async(dispatch) => {
    try {
        // Spring Boot 백엔드 로그아웃 API 호출 (세션 삭제)
        const url = "/member/logout";
        const result = await axiosPost(url, {});

        // 서버 응답이 정상이면 Redux 상태 초기화
        if(result) {
            dispatch(logout());
        }

        return result; // 서버 로그아웃 성공 여부 반환
    } catch (error) {
        // 네트워크 오류 등으로 서버 로그아웃 실패
        handleError(error, "Logout", {
            customMessage: "로그아웃 처리 중 오류가 발생했습니다.",
            silent: true // 조용히 로깅만 수행 (사용자 알림 X)
        });

        // ⭐ 중요: 서버 로그아웃 실패해도 클라이언트는 로그아웃 처리!
        // 사용자 의도를 존중하고, 로컬 인증 정보는 반드시 제거
        dispatch(logout());

        return false; // 서버 로그아웃 실패 표시
    }
}

// ============================================================================
// 이메일 중복 체크 API
// ============================================================================
/**
 * checkEmailDuplicate - 이메일 중복 체크 API 요청
 *
 * @description
 * 회원가입 시 이메일 중복 여부를 확인합니다.
 * Spring Boot 백엔드의 /member/check-email 엔드포인트와 통신합니다.
 *
 * @async
 * @function
 * @param {string} email - 체크할 이메일 주소
 *
 * @returns {Promise<boolean>} 중복이면 true, 사용 가능하면 false
 *
 * @example
 * // Signup.jsx에서 사용 예시
 * const isDuplicate = await checkEmailDuplicate("test@example.com");
 * if (isDuplicate) {
 *   alert("이미 사용 중인 이메일입니다.");
 * } else {
 *   alert("사용 가능한 이메일입니다.");
 * }
 */
export const checkEmailDuplicate = async (email) => {
    try {
        const url = "http://localhost:8080/member/check-email";
        const result = await axiosPost(url, { email });
        return result.isDuplicate;
    } catch (error) {
        handleError(error, "CheckEmail", {
            customMessage: "이메일 중복 체크 중 오류가 발생했습니다."
        });
        return false; // 에러 시 중복 아님으로 처리
    }
}