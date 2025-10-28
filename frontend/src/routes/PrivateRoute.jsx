// src/routes/PrivateRoute.jsx
import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../context/AuthContext.js";

/**
 * React Router v5 전용 PrivateRoute
 * - 로그인 안 되어 있으면 /login?redirect=<원래가려던경로> 로 보냄
 * - HashRouter에서도 잘 동작 (/#/login?redirect=/checkout)
 */
const PrivateRoute = ({ children, component: Component, ...rest }) => {
  const { user, ready } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) => {
        // 아직 복원 중이면 잠깐 빈 화면/스피너
        if (!ready) return null;

        if (user) {
          return children || (Component ? <Component {...props} /> : null);
        }

        const target = props.location.pathname + (props.location.search || "");
        return (
          <Redirect
            to={{
              pathname: "/login",
              search: `?redirect=${encodeURIComponent(target)}`,
              state: { from: props.location }
            }}
          />
        );
      }}
    />
  );
};

export default PrivateRoute;
