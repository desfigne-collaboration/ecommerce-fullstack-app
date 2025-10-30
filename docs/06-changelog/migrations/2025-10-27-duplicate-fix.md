# React Router 중복 문제 해결

**작성일**: 2025-10-27
**버전**: React 19.1.1, React Router DOM 7.9.1
**문제**: React 앱 실행 시 하얀 화면만 표시
**원인**: Router 컴포넌트 중복 사용

---

## 문제 상황

### 증상

```bash
npm install
npm start
```

실행 후 `http://localhost:3000` 접속 시 **하얀 화면**만 표시됨.

- 컴파일은 성공적으로 완료
- 콘솔에 "Compiled successfully!" 메시지 출력
- 브라우저에는 빈 화면만 표시
- React DevTools에서 컴포넌트 트리가 비정상적으로 표시

---

## 원인 분석

### Router 중복 사용

React Router가 **두 곳에서 중복으로 적용**되어 라우팅이 제대로 작동하지 않음.

#### 1. index.js에서 BrowserRouter 사용

```jsx
// frontend/src/index.js (11번째 줄)
import { BrowserRouter as Router } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>  {/* ✓ 첫 번째 Router */}
    <App />
  </Router>
);
```

#### 2. App.js에서 HashRouter 다시 사용

```jsx
// frontend/src/App.js (98번째 줄)
import { HashRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <AuthProvider>
      <Router>  {/* ✗ 두 번째 Router - 중복! */}
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          {/* 기타 라우트들... */}
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}
```

### 왜 문제가 발생하는가?

React Router는 Context API를 사용하여 라우팅 정보를 관리합니다. Router 컴포넌트를 중첩해서 사용하면:

1. **Context 충돌**: 외부와 내부 Router의 Context가 충돌
2. **라우팅 실패**: Routes 컴포넌트가 올바른 Context를 찾지 못함
3. **렌더링 중단**: 라우트 매칭이 실패하여 아무것도 렌더링되지 않음

### 잘못된 구조

```
<BrowserRouter>           ← index.js
  <App>
    <AuthProvider>
      <HashRouter>        ← App.js (중복!)
        <Header />
        <Routes>
          <Route ... />
        </Routes>
        <Footer />
      </HashRouter>
    </AuthProvider>
  </App>
</BrowserRouter>
```

---

## 해결 방법

### App.js에서 Router 제거

index.js에서 이미 BrowserRouter로 App을 감싸고 있으므로, **App.js에서는 Router를 제거**합니다.

### 수정 전 코드

```jsx
// frontend/src/App.js
import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.js";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
// ... 기타 import

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          {/* ... 기타 라우트들 */}
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
```

### 수정 후 코드

```jsx
// frontend/src/App.js
import React from "react";
import { Route, Routes } from "react-router-dom";  // ✓ HashRouter 제거
import { AuthProvider } from "./context/AuthContext.js";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
// ... 기타 import

function App() {
  return (
    <AuthProvider>
      {/* ✓ <Router> 태그 제거 */}
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        {/* ... 기타 라우트들 */}
      </Routes>
      <Footer />
      {/* ✓ </Router> 태그 제거 */}
    </AuthProvider>
  );
}

export default App;
```

### 수정된 구조

```
<BrowserRouter>           ← index.js (단일 Router)
  <App>
    <AuthProvider>
      <Header />          ← 정상 렌더링
      <Routes>            ← 올바른 Context 사용
        <Route ... />
      </Routes>
      <Footer />
    </AuthProvider>
  </App>
</BrowserRouter>
```

---

## 변경 사항 요약

### 파일: `frontend/src/App.js`

| 라인 | 변경 전 | 변경 후 |
|------|---------|---------|
| 3 | `import { HashRouter as Router, Route, Routes }` | `import { Route, Routes }` |
| 98 | `<Router>` | 삭제 |
| 195 | `</Router>` | 삭제 |

### 변경 코드 diff

```diff
// src/App.js
import React from "react";
- import { HashRouter as Router, Route, Routes } from "react-router-dom";
+ import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <AuthProvider>
-     <Router>
        <Header />
        <Routes>
          {/* 라우트들... */}
        </Routes>
        <Footer />
-     </Router>
    </AuthProvider>
  );
}
```

---

## 결과

### 수정 후 확인 사항

1. ✅ 브라우저가 자동으로 새로고침됨
2. ✅ 홈페이지가 정상적으로 표시됨
3. ✅ Header와 Footer가 렌더링됨
4. ✅ 모든 라우트가 정상 작동
5. ✅ React DevTools에서 컴포넌트 트리 정상 표시

### 테스트 방법

1. **메인 페이지 확인**
   - `http://localhost:3000/` 접속
   - 홈 페이지 내용이 정상적으로 보임

2. **라우트 네비게이션 확인**
   - 네비게이션 메뉴 클릭 시 페이지 전환 정상
   - URL이 올바르게 변경됨
   - 브라우저 뒤로가기/앞으로가기 정상 작동

3. **개발자 도구 확인**
   - F12로 Console 열기
   - 에러 메시지 없음
   - React DevTools에서 컴포넌트 계층 확인

---

## 추가 발견 사항

### 사용하지 않는 중복 파일

프로젝트 분석 중 다음 중복 파일을 발견했습니다:

- **위치**: `frontend/src/pages/category/CategoryPage.jsx` (22줄)
- **상태**: import되지 않음, 사용되지 않음
- **실제 사용 파일**: `frontend/src/pages/CategoryPage.jsx` (236줄)

**권장 조치**: 혼란 방지를 위해 미사용 파일 삭제

```bash
# 삭제 명령 (선택 사항)
rm frontend/src/pages/category/CategoryPage.jsx
```

---

## React Router 베스트 프랙티스

### Router는 최상위에 한 번만

```jsx
// ✓ 올바른 사용
// index.js 또는 App.js 중 한 곳에서만 사용
ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);
```

### Router 종류 선택

| Router | 용도 | URL 형식 |
|--------|------|----------|
| BrowserRouter | 일반 웹앱 (권장) | `/about`, `/products` |
| HashRouter | GitHub Pages, 정적 호스팅 | `/#/about`, `/#/products` |
| MemoryRouter | 테스트, React Native | URL 없음 |

### 일반적인 Router 실수

```jsx
// ❌ 잘못된 예 1: Router 중복
<BrowserRouter>
  <App>
    <BrowserRouter>  // 중복!
      <Routes />
    </BrowserRouter>
  </App>
</BrowserRouter>

// ❌ 잘못된 예 2: Routes 외부에 Router
function MyComponent() {
  return (
    <BrowserRouter>  // 컴포넌트 내부에서 사용 X
      <Link to="/about">About</Link>
    </BrowserRouter>
  );
}

// ✓ 올바른 예
// index.js
<BrowserRouter>
  <App />
</BrowserRouter>

// App.js
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}
```

---

## 문제 진단 체크리스트

React 앱에서 하얀 화면이 나타날 때 확인할 사항:

- [ ] 브라우저 Console에 JavaScript 에러가 있는가?
- [ ] Router가 중복으로 사용되고 있는가?
- [ ] `<Routes>`와 `<Route>`가 올바르게 사용되었는가?
- [ ] 모든 컴포넌트가 제대로 import되었는가?
- [ ] `element` prop에 컴포넌트를 전달했는가? (`<Component />` 형태)
- [ ] React DevTools에서 컴포넌트 트리를 확인했는가?

---

## 참고 자료

- [React Router v7 공식 문서](https://reactrouter.com/)
- [React Router v6 마이그레이션 가이드](https://reactrouter.com/en/main/upgrading/v6)
- [React 공식 문서 - Router](https://react.dev/)
- [Create React App - Adding a Router](https://create-react-app.dev/docs/adding-a-router/)

---

## 버전 정보

- **React**: 19.1.1
- **React DOM**: 19.1.1
- **React Router DOM**: 7.9.1
- **Node.js**: 권장 LTS 버전
- **npm**: 최신 버전

---

**문서 작성**: 2025-10-27
**최종 수정**: 2025-10-27
**작성자**: Development Team
**카테고리**: Frontend, Troubleshooting, React Router
