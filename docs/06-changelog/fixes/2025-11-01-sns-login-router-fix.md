# SNS 로그인 라우터 호환성 문제 수정

**작성일**: 2025-11-01
**카테고리**: 버그 수정
**영향 범위**: SNS 로그인 (네이버, 카카오)
**수정 방식**: BrowserRouter 기준 표준화

---

## 문제 상황

### 증상

1. **네이버 로그인**
   - 로그인 버튼 클릭 → 네이버 인증 완료
   - 콜백 URL로 리다이렉트되지만 콜백 컴포넌트 실행 안 됨
   - 즉시 메인 페이지로 이동
   - 로그인 정보 미반영 (헤더에 사용자 정보 없음)

2. **카카오 로그인**
   - 로그인 버튼 클릭 → 카카오 인증 완료
   - 콜백 URL로 리다이렉트되지만 콜백 컴포넌트 실행 안 됨
   - 즉시 메인 페이지로 이동
   - 로그인 정보 미반영 (헤더에 사용자 정보 없음)

### 콘솔 로그 분석

**네이버 로그인 시**:
```
NaverLoginButton.jsx:46 네이버 로그인 버튼 클릭됨
Navigated to https://nid.naver.com/oauth2.0/authorize?...
Navigated to http://localhost:3000/
```
→ NaverCallback.jsx 컴포넌트 로그 없음

**카카오 로그인 시**:
```
KakaoLoginButton.jsx:17 카카오 로그인 버튼 클릭됨
Navigated to http://localhost:3000/kakao-callback.html?code=xxx
🔄 카카오 콜백 페이지 (public/kakao-callback.html)
Navigated to http://localhost:3000/
```
→ KakaoCallback.jsx 컴포넌트 로그 없음

---

## 원인 분석

### Router 타입 불일치

**현재 프로젝트 설정**:
- `index.js`: **BrowserRouter** 사용
- `.env` 파일: **HashRouter** 기준 설정 (`/#/naver-callback`)
- `kakao-callback.html`: **HashRouter** 기준 리다이렉트 (`/#/kakao-callback`)

**라우트 매칭 실패 과정**:

```
1. 네이버 OAuth 완료
   → 리다이렉트: /#/naver-callback#access_token=xxx

2. BrowserRouter 라우트 매칭 시도
   → URL 파싱: "/#/naver-callback#access_token=xxx"
   → BrowserRouter는 Fragment(#)를 라우트로 인식 못함
   → 매칭 실패

3. 기본 동작
   → 매칭되는 라우트 없음
   → 기본 경로(/)로 폴백
   → 메인 페이지 표시
```

### 이벤트 전파 실패

**추가 문제**:
- 콜백 핸들러에서 `window.location.href = "/"`로 페이지 이동
- 완전한 페이지 새로고침 발생
- `auth:changed` 이벤트가 Header 컴포넌트에 도달하기 전에 페이지 리로드
- 이벤트 리스너 초기화되어 상태 업데이트 실패

---

## 해결 방법

### 선택한 방향

**BrowserRouter 기준으로 모든 설정 표준화**

이유:
1. OAuth 2.0 Authorization Code Grant 표준 준수
2. 깔끔한 URL 구조
3. SEO 최적화
4. 현대 웹 애플리케이션 표준 방식

### 수정 사항

#### 1. 환경 변수 수정

**파일**: `frontend/.env`

```diff
# 네이버 로그인 API 설정
REACT_APP_NAVER_CLIENT_ID=TmwmnIev5hZZ5UoO4OJY
-REACT_APP_NAVER_CALLBACK_URL=http://localhost:3000/#/naver-callback
+REACT_APP_NAVER_CALLBACK_URL=http://localhost:3000/naver-callback
```

**변경 이유**:
- BrowserRouter는 Fragment(`#`) 없이 경로 인식
- `/naver-callback` 형식으로 라우트 매칭

#### 2. 카카오 중계 페이지 수정

**파일**: `frontend/public/kakao-callback.html`

```diff
if (code) {
-  // HashRouter 형식으로 리다이렉트
-  const redirectUrl = `/#/kakao-callback?code=${code}`;
+  // BrowserRouter 형식으로 리다이렉트
+  const redirectUrl = `/kakao-callback?code=${code}`;

  window.location.href = redirectUrl;
} else {
  console.error("❌ code 파라미터를 찾을 수 없습니다.");
  alert("카카오 로그인에 실패했습니다.");
-  window.location.href = "/#/login";
+  window.location.href = "/login";
}
```

**변경 이유**:
- BrowserRouter 경로 형식에 맞춤
- Fragment 제거

#### 3. 네이버 콜백 핸들러 수정

**파일**: `frontend/src/pages/auth/NaverCallback.jsx`

```diff
if (res?.ok) {
  alert(`네이버 로그인 성공!`);
-  window.location.href = "/#/";
+  navigate("/");
} else {
  alert("로그인 처리 중 오류가 발생했습니다.");
  navigate("/login");
}
```

**변경 이유**:
- `window.location.href` → `navigate()` 변경
- 페이지 새로고침 없이 SPA 방식 네비게이션
- 이벤트가 Header에 정상 전달됨

#### 4. 카카오 콜백 핸들러 수정

**파일**: `frontend/src/pages/auth/KakaoCallback.jsx`

```diff
console.log("\n🎉 카카오 로그인 완료! 메인 페이지로 이동");
alert(`${name}님, 환영합니다!`);
-window.location.href = "/";
+navigate("/");
```

**변경 이유**:
- `window.location.href` → `navigate()` 변경
- 페이지 새로고침 없이 SPA 방식 네비게이션
- 이벤트가 Header에 정상 전달됨

---

## 수정된 파일 목록

| 파일 | 변경 내용 | 변경 줄 수 |
|------|----------|----------|
| `frontend/.env` | 네이버 콜백 URL Fragment 제거 | 1줄 |
| `frontend/public/kakao-callback.html` | 리다이렉트 URL Fragment 제거 | 2줄 |
| `frontend/src/pages/auth/NaverCallback.jsx` | `window.location.href` → `navigate()` | 1줄 |
| `frontend/src/pages/auth/KakaoCallback.jsx` | `window.location.href` → `navigate()` | 1줄 |

**총 수정**: 4개 파일, 5줄

---

## 테스트 시나리오

### 테스트 전 필수 작업

#### 1. 개발 서버 재시작 (필수)

`.env` 파일 변경 시 반드시 서버 재시작:

```bash
# 서버 종료 (Ctrl + C)
# 서버 재시작
npm start
```

#### 2. 네이버 개발자 센터 설정 변경 (필수)

**접속**: [네이버 개발자 센터](https://developers.naver.com)

**변경 항목**:
- 애플리케이션 선택
- 설정 > API 설정 > 로그인 오픈 API 서비스 환경
- 서비스 URL: `http://localhost:3000` (변경 없음)
- **Callback URL**: `http://localhost:3000/#/naver-callback` → `http://localhost:3000/naver-callback` 변경
- 저장

**중요**: 이 작업을 하지 않으면 네이버 로그인 실패합니다.

#### 3. 카카오 개발자 센터 확인 (변경 불필요)

카카오는 `kakao-callback.html`을 사용하므로 개발자 센터 설정 변경 불필요:
- Redirect URI: `http://localhost:3000/kakao-callback.html` (유지)

---

### 테스트 절차

#### 네이버 로그인 테스트

1. **준비**
   - F12 개발자 도구 열기
   - Console 탭에서 "Preserve log" 체크 (로그 유지)

2. **실행**
   - 로그인 페이지 접속: `http://localhost:3000/login`
   - 네이버 로그인 버튼 클릭

3. **예상 동작**
   - 네이버 로그인 페이지로 이동
   - 로그인 및 동의 완료
   - **NaverCallback 컴포넌트 실행 확인**:
     ```
     [NaverCallback] 네이버 로그인 콜백 시작
     [NaverCallback] Full Hash: #access_token=...
     [NaverCallback] Access Token 추출 성공
     [NaverCallback] 사용자 정보: {...}
     [naverLoginApi] 네이버 로그인 처리 시작
     [naverLoginApi] 네이버 로그인 완료
     ```
   - alert: "네이버 로그인 성공!"
   - 메인 페이지로 이동
   - **헤더에 사용자 이름 표시**

4. **검증**
   - F12 → Application → Local Storage 확인:
     - `isLogin`: "true"
     - `loginUser`: 사용자 정보 JSON
     - `auth`: 토큰 정보
   - 헤더 우측 상단에 사용자 이름 표시 확인

#### 카카오 로그인 테스트

1. **준비**
   - F12 개발자 도구 열기
   - Console 탭에서 "Preserve log" 체크

2. **실행**
   - 로그인 페이지 접속: `http://localhost:3000/login`
   - 카카오 로그인 버튼 클릭

3. **예상 동작**
   - 카카오 로그인 페이지로 이동
   - 로그인 및 동의 완료
   - 중계 페이지 경유:
     ```
     🔄 카카오 콜백 페이지 (public/kakao-callback.html)
     현재 URL: http://localhost:3000/kakao-callback.html?code=...
     추출된 code: ...
     리다이렉트 URL: /kakao-callback?code=...
     ```
   - **KakaoCallback 컴포넌트 실행 확인**:
     ```
     🟢 [1/7] KakaoCallback React 컴포넌트 로드됨
     🟢 [2/7] 인가 코드 추출
     🟢 [3/7] 카카오 토큰 요청 시작
     🟢 [4/7] 토큰 응답 받음
     🟢 [5/7] 사용자 정보 요청 시작
     🟢 [6/7] 사용자 정보 추출 완료
     🟢 [7/7] kakaoLoginApi 호출
     ```
   - alert: "{이름}님, 환영합니다!"
   - 메인 페이지로 이동
   - **헤더에 사용자 이름 표시**

4. **검증**
   - F12 → Application → Local Storage 확인:
     - `isLogin`: "true"
     - `loginUser`: 사용자 정보 JSON
     - `auth`: 토큰 정보
   - 헤더 우측 상단에 사용자 이름 표시 확인

---

## 예상 효과

### 해결되는 문제

1. ✅ 네이버 로그인 콜백 컴포넌트 정상 실행
2. ✅ 카카오 로그인 콜백 컴포넌트 정상 실행
3. ✅ 로그인 정보 LocalStorage 저장
4. ✅ Header 컴포넌트 즉시 업데이트
5. ✅ 사용자 이름 헤더에 표시
6. ✅ 로그인 상태 유지

### 성능 개선

**변경 전**:
- `window.location.href` 사용
- 완전한 페이지 새로고침
- 모든 리소스 재로드
- 느린 사용자 경험

**변경 후**:
- `navigate()` 사용
- SPA 방식 클라이언트 사이드 라우팅
- 리소스 재로드 없음
- 빠른 페이지 전환

---

## 프로덕션 배포 시 주의사항

### 환경 변수 변경

**프로덕션 `.env` 파일**:
```env
# 네이버 로그인 API 설정
REACT_APP_NAVER_CLIENT_ID=프로덕션_CLIENT_ID
REACT_APP_NAVER_CALLBACK_URL=https://yourdomain.com/naver-callback

# 카카오 로그인 API 설정
REACT_APP_KAKAO_REST_API_KEY=프로덕션_REST_API_KEY
REACT_APP_KAKAO_CLIENT_SECRET=프로덕션_CLIENT_SECRET
REACT_APP_KAKAO_REDIRECT_URI=https://yourdomain.com/kakao-callback.html
```

### 개발자 센터 설정

**네이버 개발자 센터**:
- Callback URL: `https://yourdomain.com/naver-callback`

**카카오 개발자 센터**:
- Redirect URI: `https://yourdomain.com/kakao-callback.html`

### 서버 설정 (필수)

BrowserRouter 사용 시 서버 설정 필수:

**Nginx**:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

**Apache**:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

## 관련 문서

- [SNS OAuth 구현 방식 차이](../07-issues/bugs/2025-11-01-sns-oauth-implementation-differences.md)
- [SNS 로그인 통합 가이드](../03-development/frontend/authentication/sns-login-guide.md)
- [React Router v7 마이그레이션](../06-changelog/migrations/2025-10-27-react-router-v7.md)

---

## 작업자 정보

**수정일**: 2025-11-01
**작업 시간**: 약 30분
**테스트 상태**: 테스트 대기 중
**문서 작성**: Claude Code
