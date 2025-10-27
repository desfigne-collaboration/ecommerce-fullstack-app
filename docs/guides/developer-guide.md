# E-commerce Fullstack App - 개발자 가이드

> **Version:** 1.0.0
> **Last Updated:** 2025-10-22
> **Target Audience:** 신규 개발자, 기여자, DevOps 엔지니어

---

## 목차

1. [시작하기](#1-시작하기)
2. [개발 환경 설정](#2-개발-환경-설정)
3. [프로젝트 실행](#3-프로젝트-실행)
4. [개발 워크플로우](#4-개발-워크플로우)
5. [코딩 컨벤션](#5-코딩-컨벤션)
6. [Git 브랜치 전략](#6-git-브랜치-전략)
7. [테스트 가이드](#7-테스트-가이드)
8. [디버깅 가이드](#8-디버깅-가이드)
9. [배포 가이드](#9-배포-가이드)
10. [트러블슈팅](#10-트러블슈팅)

---

## 1. 시작하기

### 1.1 필수 요구사항

시작하기 전에 다음 소프트웨어가 설치되어 있어야 합니다:

**Frontend:**
| 소프트웨어 | 권장 버전 | 설치 확인 명령어 |
|-----------|----------|------------------|
| Node.js | 18.x 이상 | `node --version` |
| npm | 9.x 이상 | `npm --version` |
| Git | 2.x 이상 | `git --version` |
| VS Code | 최신 버전 | - |

**Backend:**
| 소프트웨어 | 권장 버전 | 설치 확인 명령어 |
|-----------|----------|------------------|
| Java | 21 | `java --version` |
| Gradle | 8.x | `gradle --version` |
| MySQL | 8.0 | `mysql --version` |

### 1.2 권장 VS Code 확장 프로그램

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",           // ESLint
    "esbenp.prettier-vscode",           // Prettier
    "dsznajder.es7-react-js-snippets",  // React Snippets
    "christian-kohler.path-intellisense",// Path Autocomplete
    "formulahendry.auto-rename-tag",    // Auto Rename Tag
    "wix.vscode-import-cost",           // Import Cost
    "vscjava.vscode-java-pack",         // Java Extension Pack
    "vscjava.vscode-spring-boot-dashboard" // Spring Boot Dashboard
  ]
}
```

### 1.3 빠른 시작

**Frontend:**
```bash
# 1. 프로젝트 클론
git clone https://github.com/your-team/ecommerce-fullstack-app.git
cd ecommerce-fullstack-app/frontend

# 2. 의존성 설치
npm install

# 3. 개발 서버 실행
npm start
```

**Backend:**
```bash
# 1. Backend 디렉토리로 이동
cd ecommerce-fullstack-app/backend

# 2. 데이터베이스 설정
mysql -u root -p < schema.sql

# 3. application.properties 설정
# src/main/resources/application.properties 파일 수정

# 4. 서버 실행 (Gradle)
./gradlew bootRun
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하세요.

---

## 2. 개발 환경 설정

### 2.1 저장소 클론

```bash
# HTTPS를 사용한 클론
git clone https://github.com/your-team/ecommerce-fullstack-app.git

# SSH를 사용한 클론 (권장)
git clone git@github.com:your-team/ecommerce-fullstack-app.git

# 특정 브랜치 클론
git clone -b develop https://github.com/your-team/ecommerce-fullstack-app.git
```

### 2.2 Frontend 설정

#### 의존성 설치

```bash
cd frontend

# npm 사용
npm install

# 의존성 캐시 정리 후 설치
npm cache clean --force
npm install
```

#### 환경 변수 설정

`frontend/.env` 파일을 생성하고 다음 변수를 설정하세요:

```bash
# .env 파일 예시

# API 설정
REACT_APP_API_BASE_URL=http://localhost:8080
REACT_APP_API_TIMEOUT=30000

# OAuth2 설정
REACT_APP_KAKAO_CLIENT_ID=your_kakao_client_id
REACT_APP_KAKAO_REDIRECT_URI=http://localhost:3000/auth/kakao/callback

REACT_APP_NAVER_CLIENT_ID=your_naver_client_id
REACT_APP_NAVER_REDIRECT_URI=http://localhost:3000/auth/naver/callback

# 기타 설정
REACT_APP_ENV=development
REACT_APP_VERSION=1.0.0
```

**중요:** `.env` 파일은 절대 Git에 커밋하지 마세요!

### 2.3 Backend 설정

#### MySQL 데이터베이스 생성

```sql
-- MySQL에 접속
mysql -u root -p

-- 데이터베이스 생성
CREATE DATABASE ecommerce CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 사용자 생성 (선택사항)
CREATE USER 'ecommerce_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON ecommerce.* TO 'ecommerce_user'@'localhost';
FLUSH PRIVILEGES;
```

#### application.properties 설정

`backend/src/main/resources/application.properties`:

```properties
spring.application.name=ecommerce-fullstack-app

# DB Info
spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce
spring.datasource.username=root
spring.datasource.password=mysql1234
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Settings (if needed)
# spring.jpa.hibernate.ddl-auto=update
# spring.jpa.show-sql=true

# Server Port
server.port=8080
```

### 2.4 VS Code 설정

프로젝트 루트에 `.vscode/settings.json` 파일을 생성하세요:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "javascript.preferences.importModuleSpecifier": "relative",
  "files.eol": "\n",
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  "[java]": {
    "editor.defaultFormatter": "redhat.java"
  }
}
```

### 2.5 Prettier 설정

`frontend/.prettierrc`:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

### 2.6 ESLint 설정

`frontend/.eslintrc.json`:

```json
{
  "extends": [
    "react-app",
    "react-app/jest"
  ],
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "warn",
    "prefer-const": "error",
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off"
  }
}
```

---

## 3. 프로젝트 실행

### 3.1 Frontend 개발 서버 실행

```bash
cd frontend

# 기본 실행 (포트 3000)
npm start

# 특정 포트로 실행
PORT=3001 npm start

# HTTPS로 실행
HTTPS=true npm start
```

### 3.2 Backend 서버 실행

```bash
cd backend

# Gradle로 실행
./gradlew bootRun

# 또는 IDE에서 실행
# EcommerceFullstackAppApplication.java의 main 메소드 실행

# 빌드 후 실행
./gradlew build
java -jar build/libs/ecommerce-fullstack-app-0.0.1-SNAPSHOT.jar
```

### 3.3 Frontend 프로덕션 빌드

```bash
cd frontend

# 빌드 생성
npm run build

# 빌드 결과물 확인
ls -la build/

# 빌드 크기 분석
npx source-map-explorer 'build/static/js/*.js'
```

### 3.4 Backend 빌드

```bash
cd backend

# 빌드 (테스트 포함)
./gradlew build

# 빌드 (테스트 제외)
./gradlew build -x test

# Clean 후 빌드
./gradlew clean build
```

### 3.5 테스트 실행

**Frontend:**
```bash
cd frontend

# 전체 테스트 실행
npm test

# 특정 테스트 파일 실행
npm test -- Header.test.js

# 커버리지 확인
npm test -- --coverage

# Watch 모드 (파일 변경 감지)
npm test -- --watch
```

**Backend:**
```bash
cd backend

# 전체 테스트 실행
./gradlew test

# 테스트 리포트 확인
open build/reports/tests/test/index.html
```

### 3.6 린트 검사

```bash
cd frontend

# ESLint 실행
npm run lint

# ESLint 자동 수정
npm run lint -- --fix

# Prettier 실행
npx prettier --write "src/**/*.{js,jsx,json,css}"
```

---

## 4. 개발 워크플로우

### 4.1 새로운 기능 개발

```bash
# 1. 최신 develop 브랜치로 이동
git checkout develop
git pull origin develop

# 2. 새로운 feature 브랜치 생성
git checkout -b feature/user-profile

# 3. 코드 작성 및 테스트

# 4. 변경사항 커밋
git add .
git commit -m "feat: add user profile page"

# 5. 원격 저장소에 푸시
git push origin feature/user-profile

# 6. GitHub에서 Pull Request 생성
```

### 4.2 컴포넌트 개발 단계

```
1. 컴포넌트 설계
   ├── Props 정의
   ├── Redux State 계획
   └── 이벤트 핸들러 정의

2. 컴포넌트 구현
   ├── JSX 구조 작성
   ├── 스타일링 (CSS)
   └── Redux 로직 구현

3. 테스트 작성
   ├── 렌더링 테스트
   ├── 이벤트 핸들러 테스트
   └── Redux 액션/리듀서 테스트

4. 리팩토링
   ├── 코드 최적화
   ├── 성능 개선
   └── 주석 추가

5. 코드 리뷰
   └── Pull Request 생성
```

### 4.3 React 컴포넌트 템플릿

```javascript
// src/components/Example/Example.jsx

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './Example.css';

/**
 * Example 컴포넌트
 * @param {Object} props
 * @param {string} props.title - 제목
 * @param {function} props.onClick - 클릭 이벤트 핸들러
 */
const Example = ({ title, onClick }) => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.example.data);

  return (
    <div className="example">
      <h2>{title}</h2>
      <button onClick={onClick}>Click me</button>
    </div>
  );
};

export default Example;
```

### 4.4 Redux Slice 템플릿

```javascript
// src/feature/example/exampleSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: [],
  loading: false,
  error: null,
};

const exampleSlice = createSlice({
  name: 'example',
  initialState,
  reducers: {
    setData: (state, action) => {
      state.data = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setData, setLoading, setError } = exampleSlice.actions;
export default exampleSlice.reducer;
```

### 4.5 Backend Controller 템플릿

```java
// backend/src/main/java/com/springboot/ecommerce_fullstack_app/controller/ExampleController.java

package com.springboot.ecommerce_fullstack_app.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/api/example")
@CrossOrigin(origins = "http://localhost:3000")
public class ExampleController {

    @Autowired
    private ExampleService exampleService;

    @GetMapping("/list")
    public List<ExampleDTO> getList() {
        return exampleService.getList();
    }

    @PostMapping("/add")
    public int add(@RequestBody ExampleDTO dto) {
        return exampleService.add(dto);
    }
}
```

---

## 5. 코딩 컨벤션

### 5.1 JavaScript/React 스타일 가이드

#### 변수명
```javascript
// ✅ Good
const userName = 'John';
const isLoggedIn = true;
const MAX_ITEMS = 100;

// ❌ Bad
const user_name = 'John';
const loggedin = true;
const maxitems = 100;
```

#### 함수명
```javascript
// ✅ Good - 동사로 시작
const getUserData = () => {};
const handleClick = () => {};
const validateEmail = (email) => {};

// ❌ Bad
const userData = () => {};
const click = () => {};
const email = (email) => {};
```

#### 컴포넌트명
```javascript
// ✅ Good - PascalCase
const UserProfile = () => {};
const ProductCard = () => {};
const NavBar = () => {};

// ❌ Bad
const userProfile = () => {};
const product_card = () => {};
const navbar = () => {};
```

### 5.2 Java 스타일 가이드

#### 클래스명
```java
// ✅ Good - PascalCase
public class UserService { }
public class ProductRepository { }
public class CartController { }

// ❌ Bad
public class userService { }
public class product_repository { }
```

#### 메소드명
```java
// ✅ Good - camelCase
public List<Product> getProductList() { }
public void saveUser(User user) { }
public boolean isValidEmail(String email) { }

// ❌ Bad
public List<Product> get_product_list() { }
public void SaveUser(User user) { }
```

### 5.3 파일 구조 컨벤션

**Frontend:**
```
src/
├── components/
│   ├── Header/
│   │   ├── Header.jsx        # 컴포넌트
│   │   ├── Header.css        # 스타일
│   │   ├── Header.test.js    # 테스트
│   │   └── index.js          # Export
│   └── Footer/
│       ├── Footer.jsx
│       ├── Footer.css
│       └── index.js
├── feature/
│   ├── auth/
│   │   ├── authSlice.js
│   │   └── authAPI.js
│   └── product/
│       ├── productSlice.js
│       └── productAPI.js
```

**Backend:**
```
src/main/java/com/springboot/ecommerce_fullstack_app/
├── controller/
│   ├── ProductController.java
│   ├── CartController.java
│   └── MemberController.java
├── service/
│   ├── ProductService.java
│   ├── ProductServiceImpl.java
│   ├── CartService.java
│   └── CartServiceImpl.java
├── repository/
│   ├── ProductRepository.java
│   ├── JdbcTemplateProductRepository.java
│   ├── CartRepository.java
│   └── JdbcTemplateCartRepository.java
└── dto/
    ├── Product.java
    ├── CartItem.java
    └── Member.java
```

### 5.4 Import 순서

**React:**
```javascript
// 1. React 관련
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';

// 2. Redux 관련
import { useSelector, useDispatch } from 'react-redux';

// 3. 외부 라이브러리
import axios from 'axios';

// 4. 내부 컴포넌트
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// 5. 유틸리티/헬퍼
import { formatDate } from '../../utils/dateUtils';

// 6. 스타일
import './MyComponent.css';
```

**Java:**
```java
// 1. Java 표준 라이브러리
import java.util.List;
import java.util.ArrayList;

// 2. Spring Framework
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

// 3. 프로젝트 내부
import com.springboot.ecommerce_fullstack_app.dto.Product;
import com.springboot.ecommerce_fullstack_app.service.ProductService;
```

### 5.5 주석 작성 규칙

**JavaScript:**
```javascript
/**
 * 사용자 정보를 조회하는 함수
 * @param {number} userId - 사용자 ID
 * @returns {Promise<Object>} 사용자 정보 객체
 * @throws {Error} 사용자를 찾을 수 없는 경우
 */
const getUserById = async (userId) => {
  // API 호출
  const response = await fetch(`/api/users/${userId}`);

  // 에러 처리
  if (!response.ok) {
    throw new Error('User not found');
  }

  return response.json();
};
```

**Java:**
```java
/**
 * 상품 목록을 조회합니다.
 * @return 상품 목록
 */
public List<Product> getProductList() {
    String sql = "SELECT * FROM product";
    return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Product.class));
}
```

### 5.6 CSS 네이밍 (BEM)

```css
/* Block */
.product-card { }

/* Element */
.product-card__image { }
.product-card__title { }
.product-card__price { }

/* Modifier */
.product-card--featured { }
.product-card__price--discount { }
```

```html
<div class="product-card product-card--featured">
  <img class="product-card__image" src="..." alt="...">
  <h3 class="product-card__title">Product Name</h3>
  <p class="product-card__price product-card__price--discount">$99</p>
</div>
```

---

## 6. Git 브랜치 전략

### 6.1 브랜치 종류

```
main
 ├─ develop
 │   ├─ feature/backend-product-api
 │   ├─ feature/frontend-cart-page
 │   └─ feature/oauth2-login
 ├─ hotfix/critical-bug
 └─ release/v1.0.0
```

### 6.2 브랜치 네이밍 규칙

| 브랜치 타입 | 네이밍 패턴 | 예시 |
|------------|-------------|------|
| Feature | `feature/기능명` | `feature/backend-product-api`, `feature/frontend-cart-page` |
| Bugfix | `bugfix/버그명` | `bugfix/login-error` |
| Hotfix | `hotfix/긴급수정` | `hotfix/payment-crash` |
| Release | `release/버전` | `release/v1.0.0` |

### 6.3 커밋 메시지 컨벤션 (Conventional Commits)

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Type 종류

| Type | 설명 | 예시 |
|------|------|------|
| feat | 새로운 기능 추가 | `feat: add user login page` |
| fix | 버그 수정 | `fix: resolve cart calculation error` |
| docs | 문서 수정 | `docs: update API documentation` |
| style | 코드 포맷팅 | `style: format code with prettier` |
| refactor | 코드 리팩토링 | `refactor: improve product filter logic` |
| test | 테스트 추가/수정 | `test: add unit tests for auth` |
| chore | 빌드/설정 변경 | `chore: update dependencies` |

#### 예시

```bash
# 기능 추가
git commit -m "feat: add product search functionality"

# 버그 수정
git commit -m "fix: resolve image loading issue in cart"

# 문서 업데이트
git commit -m "docs: add installation guide to README"

# 상세 커밋 메시지
git commit -m "feat(auth): implement OAuth2 social login

- Add Kakao login integration
- Add Naver login integration
- Update authSlice to handle social login

Closes #123"
```

### 6.4 Pull Request 가이드

#### PR 템플릿

```markdown
## 변경 사항
- 추가/수정/삭제한 기능 설명

## 변경 이유
- 왜 이 변경이 필요한지 설명

## 테스트 방법
1. 단계별 테스트 방법
2. 예상 결과

## 스크린샷 (선택)
![스크린샷](url)

## 체크리스트
- [ ] 테스트 완료
- [ ] 문서 업데이트
- [ ] 코드 리뷰 요청
- [ ] Breaking Change 없음
```

---

## 7. 테스트 가이드

### 7.1 Frontend 테스트

#### React 컴포넌트 테스트
```javascript
// src/components/Header/Header.test.js

import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from '../../app/store';
import Header from './Header';

describe('Header Component', () => {
  test('renders header with title', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </Provider>
    );

    const title = screen.getByText(/E-commerce Fullstack App/i);
    expect(title).toBeInTheDocument();
  });
});
```

#### Redux Slice 테스트
```javascript
// src/feature/auth/authSlice.test.js

import authReducer, { setLogin, setLogout } from './authSlice';

describe('authSlice', () => {
  test('should handle setLogin', () => {
    const previousState = { isLogin: false, userId: null };
    const payload = { userId: 'test@example.com' };

    expect(authReducer(previousState, setLogin(payload))).toEqual({
      isLogin: true,
      userId: 'test@example.com',
    });
  });
});
```

### 7.2 Backend 테스트

#### JUnit 테스트
```java
// backend/src/test/java/com/springboot/ecommerce_fullstack_app/service/ProductServiceTest.java

@SpringBootTest
public class ProductServiceTest {

    @Autowired
    private ProductService productService;

    @Test
    public void testGetProductList() {
        List<Product> products = productService.getProductList(3);
        assertNotNull(products);
        assertTrue(products.size() > 0);
    }
}
```

---

## 8. 디버깅 가이드

### 8.1 React DevTools 사용

```bash
# Chrome 확장 프로그램 설치
# https://chrome.google.com/webstore/detail/react-developer-tools

# Redux DevTools 설치
# https://chrome.google.com/webstore/detail/redux-devtools

# 사용 방법
1. F12로 개발자 도구 열기
2. "Components" 탭 선택
3. 컴포넌트 트리 확인
4. Props, State 검사
5. "Redux" 탭에서 액션 및 상태 확인
```

### 8.2 브라우저 디버깅

```javascript
// 1. console.log 사용
console.log('User data:', user);
console.table(products);
console.error('Error:', error);

// 2. debugger 사용
const handleClick = () => {
  debugger; // 이 줄에서 실행 중단
  console.log('Button clicked');
};

// 3. 조건부 디버깅
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data);
}
```

### 8.3 Backend 디버깅

```java
// IntelliJ IDEA / Eclipse에서 디버깅
// 1. 중단점(Breakpoint) 설정
// 2. Debug 모드로 실행
// 3. 변수 값 확인

// 로깅 사용
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ProductService {
    private static final Logger logger = LoggerFactory.getLogger(ProductService.class);

    public List<Product> getProductList(int number) {
        logger.info("Getting product list with number: {}", number);
        // ...
    }
}
```

---

## 9. 배포 가이드

### 9.1 Frontend 프로덕션 빌드

```bash
cd frontend

# 1. 환경 변수 확인
cat .env.production

# 2. 빌드 실행
npm run build

# 3. 빌드 결과물 확인
ls -la build/

# 4. 빌드 크기 확인
du -sh build/
```

### 9.2 Backend 프로덕션 빌드

```bash
cd backend

# 1. Clean 빌드
./gradlew clean build

# 2. JAR 파일 확인
ls -la build/libs/

# 3. JAR 파일 실행
java -jar build/libs/ecommerce-fullstack-app-0.0.1-SNAPSHOT.jar
```

### 9.3 환경별 설정

#### Development
```bash
# frontend/.env.development
REACT_APP_API_BASE_URL=http://localhost:8080
REACT_APP_ENV=development
```

#### Production
```bash
# frontend/.env.production
REACT_APP_API_BASE_URL=https://api.ecommerce-app.com
REACT_APP_ENV=production
```

---

## 10. 트러블슈팅

### 10.1 일반적인 문제

#### npm install 실패

```bash
# 해결 방법 1: 캐시 정리
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# 해결 방법 2: Node 버전 확인
node --version
nvm use 18
```

#### 포트 이미 사용 중

```bash
# 포트 3000을 사용하는 프로세스 찾기 (Linux/Mac)
lsof -i :3000

# 프로세스 종료
kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# 다른 포트로 실행
PORT=3001 npm start
```

#### MySQL 연결 오류

```bash
# MySQL 서비스 상태 확인
sudo service mysql status

# MySQL 재시작
sudo service mysql restart

# 연결 테스트
mysql -u root -p -e "SELECT 1"
```

### 10.2 도움 받기

문제가 해결되지 않으면:

1. **GitHub Issues**: 프로젝트 이슈 페이지에서 검색
2. **팀 Slack**: #dev-help 채널에 질문
3. **Stack Overflow**: React, Spring Boot 관련 질문
4. **공식 문서**: React, Redux Toolkit, Spring Boot 문서 참고

---

## 부록

### A. 유용한 npm 스크립트

```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "format": "prettier --write \"src/**/*.{js,jsx,json,css}\"",
    "analyze": "source-map-explorer 'build/static/js/*.js'"
  }
}
```

### B. 참고 자료

**Frontend:**
- [React 공식 문서](https://react.dev/)
- [Redux Toolkit 문서](https://redux-toolkit.js.org/)
- [React Router 문서](https://reactrouter.com/)

**Backend:**
- [Spring Boot 공식 문서](https://spring.io/projects/spring-boot)
- [Spring JDBC 가이드](https://docs.spring.io/spring-framework/docs/current/reference/html/data-access.html#jdbc)

**일반:**
- [MDN Web Docs](https://developer.mozilla.org/)
- [JavaScript Info](https://javascript.info/)

---

**문서 관리자:** 개발팀
**최종 수정일:** 2025-10-22
**문의:** dev-team@ecommerce-app.com
