import { useEffect } from "react";
import { logoutApi } from "../../api/auth";
import { useHistory } from "react-router-dom";

export default function Logout() {
  const history = useHistory();
  useEffect(() => {
    logoutApi();
    history.replace("/");
  }, [history]);
  return null;
}
