import { login, logout } from './authSlice.js';
import { axiosPost } from '../../utils/dataFetch.js';
import { validateFormCheck, validateSignupFormCheck } from '../../utils/validate.js';
import { handleError } from '../../utils/errorHandler.js';

/** Signup */
export const getSignup = (formData) => async (dispatch) => {
   try {
       /**
           스프링부트 연동 - Post, /member/signup
       */
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
    try {
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
    } catch (error) {
        handleError(error, "Login", {
            customMessage: "로그인 처리 중 오류가 발생했습니다."
        });
        return false;
    }
}


/** Logout */
export const getLogout = () => async(dispatch) => {
    try {
        const url = "/member/logout";
        const result = await axiosPost(url, {});

        if(result) { dispatch(logout()); }

        return result;
    } catch (error) {
        handleError(error, "Logout", {
            customMessage: "로그아웃 처리 중 오류가 발생했습니다.",
            silent: true // 로그아웃 실패는 조용히 처리
        });
        // 로그아웃은 실패해도 클라이언트 상태는 초기화
        dispatch(logout());
        return false;
    }
}