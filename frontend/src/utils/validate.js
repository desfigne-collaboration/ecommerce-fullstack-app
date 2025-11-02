/**
 * ============================================================================
 * validate.js - 폼 유효성 검사 유틸리티
 * ============================================================================
 *
 * 【목적】
 * - 사용자 입력값 검증
 * - 에러 메시지 설정 및 포커스 이동
 * - 폼 제출 전 필수 항목 체크
 *
 * 【사용 위치】
 * - 로그인 폼 (Login.jsx)
 * - 회원가입 폼 (Signup.jsx)
 * - 기타 입력 폼들
 *
 * @author Claude Code
 * @since 2025-11-02
 */

// ============================================================================
// 로그인 폼 유효성 검사
// ============================================================================
/**
 * validateFormCheck - 로그인 폼 유효성 검사
 *
 * @description
 * 로그인 폼의 아이디와 비밀번호 입력값을 검증합니다.
 * 빈 값이 있으면 에러 메시지를 설정하고 해당 필드에 포커스를 이동합니다.
 *
 * @param {Object} params - 검증에 필요한 파라미터 객체
 * @param {React.RefObject} params.idRef - 아이디 input의 ref
 * @param {React.RefObject} params.passwordRef - 비밀번호 input의 ref
 * @param {Function} params.setErrors - 에러 상태 업데이트 함수
 * @param {Object} params.errors - 현재 에러 상태 객체
 *
 * @returns {boolean} 검증 성공 여부 (true: 통과, false: 실패)
 *
 * @example
 * // Login.jsx에서 사용 예시
 * const idRef = useRef()
 * const passwordRef = useRef()
 * const [errors, setErrors] = useState({})
 *
 * const handleLogin = () => {
 *   const isValid = validateFormCheck({
 *     idRef,
 *     passwordRef,
 *     setErrors,
 *     errors
 *   })
 *
 *   if (!isValid) return  // 검증 실패 시 중단
 *
 *   // 로그인 API 호출
 *   dispatch(getLogin(formData))
 * }
 *
 * @validation
 * 1. 아이디 빈 값 체크
 *    - 빈 값이면 "아이디를 입력해주세요" 에러 설정
 *    - 아이디 필드에 포커스 이동
 *
 * 2. 비밀번호 빈 값 체크
 *    - 빈 값이면 "패스워드를 입력해주세요" 에러 설정
 *    - 비밀번호 필드에 포커스 이동
 */
export const validateFormCheck = ({ idRef, passwordRef, setErrors, errors }) => {
    // 아이디 필수 입력 체크
    if(idRef.current.value === "") {
        setErrors({...errors, id: "아이디를 입력해주세요"});  // 에러 메시지 설정
        idRef.current.focus();                                // 아이디 필드로 포커스 이동
        return false;                                          // 검증 실패
    }
    // 비밀번호 필수 입력 체크
    else if(passwordRef.current.value === "") {
        setErrors({...errors, pwd: "패스워드를 입력해주세요"}); // 에러 메시지 설정
        passwordRef.current.focus();                           // 비밀번호 필드로 포커스 이동
        return false;                                           // 검증 실패
    }

    // 모든 검증 통과
    return true;
}
