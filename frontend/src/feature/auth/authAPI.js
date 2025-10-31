import { login, logout } from './authSlice.js';
import { axiosPost } from '../../utils/dataFetch.js';
import { validateFormCheck, validateSignupFormCheck } from '../../utils/validate.js';

/** Signup */
export const getSignup = (formData) => async (dispatch) => {
   let result = null;
       /**
           스프링부트 연동 - Post, /member/signup
       */
       const url = "http://localhost:8080/member/signup";

       result = await axiosPost(url, formData);


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