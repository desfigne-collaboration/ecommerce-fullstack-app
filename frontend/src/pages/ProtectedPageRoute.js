import React, { useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export function ProtectedPageRoute({ children }) {
    const isAlert = useRef(false);
    const isLogin = useSelector((state) => state.auth.isLogin);

    if(!isLogin) {
        if(!isAlert.current) {
            alert("로그인이 필요한 서비스입니다.\n로그인 페이지로 이동합니다.");
            isAlert.current = true;
        }
        return <Navigate to="/login" replace />
    } else {
        isAlert.current = true;
        return children;
    }
}
