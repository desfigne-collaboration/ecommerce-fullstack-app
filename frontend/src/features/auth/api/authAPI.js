import { login, logout } from '../slice/authSlice.js';
import { axiosPost } from '../../../utils/dataFetch.js';
import { validateFormCheck } from '../../../utils/validate.js';
import { handleError } from '../../../utils/errorHandler.js';

export const getSignup = (formData) => async (dispatch) => {
   try {
       const url = "http://localhost:8080/member/signup";
       const result = await axiosPost(url, formData);

       return result;
   } catch (error) {
       handleError(error, "Signup", {
           customMessage: "회원가입 처리 중 오류가 발생했습니다."
       });
       return null;
   }
}

/** Login */
export const getLogin = (formData, param) => async(dispatch) => {

    //관리자 계정 테스트
    if(formData.id === "admin" && formData.password === "1234") {
        dispatch(login({"userId": formData.id}));
        return true;
    }

    //유효성 체크 후 서버에 로그인 요청
    if(validateFormCheck(param)) {
        const url = "/member/login";
        const result = await axiosPost(url, formData);

        if(result.login) {
            dispatch(login({"userId": formData.id}));
            return true;
        }
    }

    return false;
}


/** Logout */
export const getLogout = () => async(dispatch) => {
    const url = "/member/logout";
    const result = await axiosPost(url, {});

    if(result) { dispatch(logout()); }

    return result;
}

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