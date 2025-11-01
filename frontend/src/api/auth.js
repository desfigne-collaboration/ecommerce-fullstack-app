import storage from "../utils/storage.js";

export function signupApi(payload) {
  const users = storage.get("users", []);
  const exists = users.some(u => u.email === payload.email);
  if (exists) return { ok: false, message: "이미 가입된 이메일입니다." };
  const next = [...users, { ...payload, role: "user", joinedAt: Date.now() }];
  storage.set("users", next);
  return { ok: true };
}

export function loginApi({ email, password }) {
  if (email === "admin" && password === "1234") {
    const token = "admin-token";
    storage.set("auth", { email, role: "admin", token });
    storage.set("isLogin", true);
    storage.set("loginUser", { name: "관리자", email });
    return { ok: true, role: "admin", user: { name: "관리자", email } };
  }
  const users = storage.get("users", []);
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return { ok: false, message: "아이디 또는 비밀번호가 올바르지 않습니다." };
  const token = "user-token";
  storage.set("auth", { email: user.email, role: "user", token });
  storage.set("isLogin", true);
  storage.set("loginUser", { name: user.name, email: user.email });
  return { ok: true, role: "user", user: { name: user.name, email: user.email } };
}

export function logoutApi() {
  storage.remove("auth");
  storage.set("isLogin", false);
  storage.remove("loginUser");
}

export function getAuth() {
  return storage.get("auth");
}

// 네이버 로그인 API
export function naverLoginApi(userData) {
  const user = {
    email: userData.email,
    name: userData.name,
    role: "user",
    loginType: "naver",
    naverId: userData.id
  };

  const token = "naver-user-token-" + Date.now();
  storage.set("auth", { email: user.email, role: "user", token });
  storage.set("isLogin", true);
  storage.set("loginUser", user);

  return { ok: true, role: "user", user };
}

// 카카오 로그인 API
export function kakaoLoginApi(userData) {
  const user = {
    email: userData.email,
    name: userData.name,
    role: "user",
    loginType: "kakao",
    kakaoId: userData.id
  };

  const token = "kakao-user-token-" + Date.now();
  storage.set("auth", { email: user.email, role: "user", token });
  storage.set("isLogin", true);
  storage.set("loginUser", user);

  return { ok: true, role: "user", user };
}
