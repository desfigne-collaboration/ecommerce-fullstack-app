# SNS OAuth 구현 방식 차이 및 라우터 충돌 문제

**작성일**: 2025-11-01
**카테고리**: 버그 분석 및 해결
**심각도**: 높음
**상태**: 해결 완료

---

## 문제 요약

SNS 로그인 기능 구현 시 네이버와 카카오의 OAuth 2.0 구현 방식 차이로 인해 React Router와 충돌이 발생했습니다. 네이버는 Implicit Grant 방식으로 URL Fragment(`#`)를 사용하고, 카카오는 Redirect URI에서 Fragment를 허용하지 않아 HashRouter와 BrowserRouter 사이에서 호환성 문제가 발생했습니다.

---

## 기술적 배경

### OAuth 2.0 Grant Types 비교

#### 1. Implicit Grant (네이버 사용)

**특징**:
- Access Token을 URL Fragment로 직접 전달
- 서버를 거치지 않고 클라이언트에서 직접 토큰 획득
- 2010년대 초반 SPA(Single Page Application)를 위해 설계됨

**보안상 이유**:
- Fragment(`#` 이후 부분)는 HTTP 요청 시 서버로 전송되지 않음
- 브라우저에만 남아 서버 로그에 토큰이 기록되지 않음
- 중간자 공격(MITM) 시 토큰 노출 위험 감소

**현재 권장 여부**:
- ❌ OAuth 2.0 보안 모범 사례에서 권장하지 않음
- ❌ RFC 6819에서 보안 취약점 지적
- ✅ 대신 Authorization Code Grant + PKCE 권장

**네이버 콜백 URL 예시**:
```
http://localhost:3000/#/naver-callback#access_token=AAAAN0vS...&state=xyz&token_type=bearer&expires_in=3600
```

#### 2. Authorization Code Grant (카카오 사용)

**특징**:
- Authorization Code를 Query Parameter로 전달
- 서버에서 Code를 Token으로 교환
- Client Secret 사용으로 보안 강화

**보안 강점**:
- Code는 1회용으로 토큰 교환 후 무효화
- Client Secret이 서버(또는 프론트엔드)에서만 사용됨
- Refresh Token 발급 가능

**표준 권장**:
- ✅ OAuth 2.0 표준 권장 방식
- ✅ 가장 안전한 인증 플로우
- ✅ 엔터프라이즈 애플리케이션 표준

**카카오 콜백 URL 예시**:
```
http://localhost:3000/kakao-callback.html?code=KHquwmdu6Rudc...
```

---

## React Router 타입별 동작 방식

### HashRouter

**URL 구조**:
```
http://localhost:3000/#/product/123
                        ↑ Fragment Identifier
                          모든 경로는 # 이후에 옴
```

**동작 원리**:
- Fragment(`#` 이후)는 서버로 전송되지 않음
- 브라우저에서만 처리되는 클라이언트 사이드 라우팅
- `window.location.hash`를 통해 라우트 변경 감지

**장점**:
- 서버 설정 불필요 (모든 요청이 index.html로 감)
- 새로고침 시 404 에러 없음
- 정적 호스팅 환경에서 완벽하게 작동

**단점**:
- URL에 `#` 기호 포함으로 미관상 좋지 않음
- SEO에 약간 불리 (Google은 처리하지만 완벽하지 않음)

### BrowserRouter

**URL 구조**:
```
http://localhost:3000/product/123
                      ↑ 깔끔한 URL
```

**동작 원리**:
- HTML5 History API 사용
- `pushState`, `replaceState`로 URL 변경
- 서버에 실제 경로 요청 없이 클라이언트에서 처리

**장점**:
- 깔끔한 URL (SEO 유리)
- 모던 웹 표준
- 전문적인 느낌

**단점**:
- **서버 설정 필수** (모든 경로를 index.html로 리다이렉트)
- 설정 없이 새로고침 시 404 에러 발생

---

## 문제 발생 원인

### 1. 네이버 OAuth + React Router 충돌

**네이버 콜백 URL**:
```
http://localhost:3000/#/naver-callback#access_token=xxx
                        ↑              ↑
                    HashRouter       Implicit Grant
                    라우트 경로        토큰 Fragment
```

**문제점**:
- HashRouter: `#/naver-callback`를 라우트로 인식
- 네이버 OAuth: `#access_token=xxx`를 토큰으로 전달
- **이중 Fragment 발생**: `#` 기호가 두 번 나타남
- React Router가 전체를 하나의 Fragment로 해석하여 라우팅 실패 가능

**BrowserRouter 사용 시**:
- 콜백 URL: `http://localhost:3000/naver-callback`
- 네이버가 리다이렉트: `http://localhost:3000/naver-callback#access_token=xxx`
- BrowserRouter는 `/naver-callback` 라우트로 매칭 ✅
- Fragment는 `window.location.hash`로 별도 파싱 가능 ✅

### 2. 카카오 Redirect URI Fragment 제한

**카카오 개발자 센터 제한 사항**:
- Redirect URI 입력 시 `#` 문자 이후는 무시됨
- 입력: `http://localhost:3000/#/kakao-callback`
- 실제 등록: `http://localhost:3000/` (Fragment 제거됨)

**이유**:
- Authorization Code Grant는 Query Parameter로 Code 전달
- Fragment는 서버로 전송되지 않으므로 의미 없음
- 카카오 서버는 Fragment를 받을 수 없어 입력을 차단

**해결 방법**:
- 정적 HTML 중계 페이지 사용 (`kakao-callback.html`)
- 카카오 → `kakao-callback.html?code=xxx`
- HTML → JavaScript로 React Router 경로로 변환

---

## 최초 프로젝트 상태

### Router 설정 변경 이력

**2025-10-27**: React Router v7 마이그레이션 당시 **HashRouter** 사용
```javascript
// index.js (당시)
import { HashRouter as Router } from "react-router-dom";
```

**2025-10-28 ~ 현재**: **BrowserRouter**로 변경됨
```javascript
// index.js (현재)
import { BrowserRouter as Router } from "react-router-dom";
```

### SNS 로그인 설정

**설정 파일은 HashRouter 기준으로 작성됨**:

**.env 파일**:
```env
REACT_APP_NAVER_CALLBACK_URL=http://localhost:3000/#/naver-callback
REACT_APP_KAKAO_REDIRECT_URI=http://localhost:3000/kakao-callback.html
```

**kakao-callback.html**:
```javascript
window.location.href = `/#/kakao-callback?code=${code}`;
```

### 문제 발생

**BrowserRouter + HashRouter 기준 설정 = 라우트 매칭 실패**

1. 네이버 로그인 시도
2. 콜백 URL: `/#/naver-callback#access_token=xxx`
3. BrowserRouter는 `/#/`를 인식 못함
4. 매칭되는 라우트 없음
5. 기본 라우트(`/`)로 리다이렉트
6. 토큰 처리 실패

---

## 해결 방안

### 선택된 방법: BrowserRouter 유지 + 표준 OAuth 2.0 준수

**선택 이유**:
1. Authorization Code Grant가 현대 표준
2. 깔끔한 URL 구조
3. SEO 최적화
4. 보안 모범 사례 준수

### 변경 사항

#### 1. 환경 변수 수정

**파일**: `frontend/.env`

```env
# 변경 전
REACT_APP_NAVER_CALLBACK_URL=http://localhost:3000/#/naver-callback

# 변경 후
REACT_APP_NAVER_CALLBACK_URL=http://localhost:3000/naver-callback
```

#### 2. 카카오 중계 페이지 수정

**파일**: `frontend/public/kakao-callback.html`

```javascript
// 변경 전
window.location.href = `/#/kakao-callback?code=${code}`;

// 변경 후
window.location.href = `/kakao-callback?code=${code}`;
```

#### 3. 네이버 콜백 핸들러 수정

**파일**: `frontend/src/pages/auth/NaverCallback.jsx`

**주요 변경**:
- Fragment(`#access_token`) 파싱 로직 추가
- `window.location.href` → `navigate()` 변경

#### 4. 카카오 콜백 핸들러 수정

**파일**: `frontend/src/pages/auth/KakaoCallback.jsx`

**주요 변경**:
- `window.location.href` → `navigate()` 변경
- SPA 방식 페이지 전환으로 이벤트 전파 보장

#### 5. 개발자 센터 설정 변경

**네이버 개발자 센터**:
```
변경 전: http://localhost:3000/#/naver-callback
변경 후: http://localhost:3000/naver-callback
```

---

## 프로덕션 배포 시 주의사항

### 필수 서버 설정

BrowserRouter 사용 시 **서버 설정 필수**입니다.

#### Nginx 설정 예시

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### Apache 설정 예시

`.htaccess` 파일:
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

**설정하지 않으면**:
- 새로고침 시 404 에러 발생
- 북마크 접근 실패
- 직접 URL 입력 시 에러

---

## 참고 자료

### OAuth 2.0 관련

- [RFC 6749 - OAuth 2.0 Authorization Framework](https://datatracker.ietf.org/doc/html/rfc6749)
- [RFC 6819 - OAuth 2.0 Threat Model and Security Considerations](https://datatracker.ietf.org/doc/html/rfc6819)
- [OAuth 2.0 Security Best Current Practice](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics)

### 네이버/카카오 API 문서

- [네이버 로그인 API 가이드](https://developers.naver.com/docs/login/api/)
- [카카오 로그인 REST API](https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api)

### React Router 관련

- [React Router - History and Navigation](https://reactrouter.com/en/main/start/concepts#history-and-navigation)
- [HTML5 History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API)

---

## 결론

네이버와 카카오의 OAuth 구현 방식 차이는 각 플랫폼의 역사적 배경과 보안 철학을 반영합니다. 네이버의 Implicit Grant는 구형 방식이지만 하위 호환성을 위해 유지되고 있으며, 카카오는 현대 표준인 Authorization Code Grant를 사용합니다.

BrowserRouter 기반 구조에서 두 방식을 모두 지원하기 위해서는:
1. 네이버: Fragment 파싱 로직 추가
2. 카카오: Query Parameter 방식 그대로 사용
3. 서버: 모든 경로를 index.html로 fallback 설정

이를 통해 표준 OAuth 2.0 플로우를 준수하면서도 두 플랫폼의 SNS 로그인을 안정적으로 지원할 수 있습니다.
