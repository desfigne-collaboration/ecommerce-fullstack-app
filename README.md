# E-commerce Fullstack App

SSF Shop을 벤치마킹한 **풀스택 쇼핑몰 프로젝트** (React + Redux + Spring Boot)

[![Java](https://img.shields.io/badge/Java-21-007396?logo=java)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5.6-6DB33F?logo=spring-boot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react)](https://reactjs.org)
[![Redux](https://img.shields.io/badge/Redux-2.9.0-764ABC?logo=redux)](https://redux-toolkit.js.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql)](https://www.mysql.com/)

---

## 📌 프로젝트 개요

본 프로젝트는 패션 쇼핑몰 **[SSF Shop](https://www.ssfshop.com)**을 모델로 구현한 **Multi-module Gradle 풀스택 웹 애플리케이션**입니다.

Spring Boot 3.5.6 기반 백엔드와 React 19.1.1 + Redux Toolkit 2.9.0 기반 프론트엔드로 구성되어 있으며, 실무 수준의 쇼핑몰 구현과 협업형 개발 프로세스 경험을 목표로 합니다.

**프로젝트 특징**:
- **멀티 모듈 구조**: Gradle 기반 backend + frontend 통합 프로젝트
- **JdbcTemplate 사용**: JPA 대신 Spring JDBC로 데이터베이스 연동
- **Redux Toolkit**: 전역 상태 관리 (cart, product, auth)
- **React Router v7**: 최신 라우팅 라이브러리
- **Spring Security**: BCrypt 암호화, CORS 설정

---

## 🎯 주요 목표

- ✅ **쇼핑몰 핵심 기능 구현**: 상품 검색/필터, 장바구니, 주문, 결제, 사용자 관리
- ✅ **프론트엔드/백엔드 모듈화**: 컴포넌트 기반 개발 및 상태 관리 확립
- ✅ **RESTful API 설계**: 백엔드 API와 프론트엔드 연동
- ✅ **반응형 UI**: PC·모바일 동시 지원
- 🚧 **보안 강화**: JWT 기반 인증, OAuth2 소셜 로그인 (예정)

---

## 🛠️ 기술 스택

### Backend (Spring Boot)

| 구분 | 기술명 | 버전 |
|------|--------|------|
| **프로그래밍 언어** | Java | 21 |
| **프레임워크** | Spring Boot | 3.5.6 |
| **빌드 도구** | Gradle | 7.x+ |
| **데이터베이스** | MySQL | 8.0 |
| **JDBC 드라이버** | MySQL Connector | 8.0.31 |
| **보안** | Spring Security | 3.5.6 |
| **데이터 액세스** | Spring JDBC (JdbcTemplate) | - |
| **유틸리티** | Lombok | 1.18.34 |

**주요 의존성**:
```gradle
implementation 'org.springframework.boot:spring-boot-starter-security'
implementation 'org.springframework.boot:spring-boot-starter-web'
implementation 'org.springframework.boot:spring-boot-starter-jdbc'
runtimeOnly 'mysql:mysql-connector-java:8.0.31'
compileOnly 'org.projectlombok:lombok:1.18.34'
```

### Frontend (React)

| 구분 | 기술명 | 버전 |
|------|--------|------|
| **프레임워크** | React | 19.1.1 |
| **상태 관리** | Redux Toolkit | 2.9.0 |
| **라우팅** | React Router | 7.9.1 |
| **HTTP 클라이언트** | Axios | 1.12.2 |
| **아이콘** | React Icons | 5.5.0 |
| **빌드 도구** | React Scripts (CRA) | 5.0.1 |

**상태 관리 전략**:
- **Redux Toolkit**: 전역 상태 (cart, product, auth)
- **React Context**: 컴포넌트 트리 전체 공유
- **Local Storage**: 장바구니 데이터 영구 저장

---

## 📂 프로젝트 구조

```
ecommerce-fullstack-app/
├── backend/                          # Spring Boot 백엔드
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/springboot/ecommerce_fullstack_app/
│   │   │   │   ├── config/          # Spring Security 설정
│   │   │   │   ├── controller/      # REST API 컨트롤러
│   │   │   │   ├── dto/             # 데이터 전송 객체
│   │   │   │   ├── repository/      # 데이터 액세스 (JdbcTemplate)
│   │   │   │   └── service/         # 비즈니스 로직
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── static/
│   │   └── test/
│   └── build.gradle
│
├── frontend/                         # React 프론트엔드
│   ├── public/
│   │   ├── data/                    # JSON 데이터 (초기/참조)
│   │   ├── images/                  # 상품/배너 이미지
│   │   └── index.html
│   ├── src/
│   │   ├── app/                     # Redux Store
│   │   ├── components/              # 재사용 컴포넌트
│   │   ├── context/                 # React Context
│   │   ├── feature/                 # Redux Slices & API
│   │   ├── hooks/                   # 커스텀 훅
│   │   ├── pages/                   # 페이지 컴포넌트
│   │   ├── styles/                  # CSS 파일
│   │   ├── utils/                   # 유틸리티 함수
│   │   └── App.js
│   └── package.json
│
├── gradle/                           # Gradle Wrapper
├── build.gradle                      # 루트 Gradle 설정
├── settings.gradle                   # 모듈 설정
├── DEVELOPMENT_GUIDE.md              # AI 개발 가이드
└── README.md
```

---

## ✨ 주요 기능

### 🛍️ 상품 기능
- **상품 탐색**: 카테고리별 상품 목록, 검색, 필터링
- **상품 상세**: 이미지 갤러리, 옵션 선택, 상세 정보
- **상품 Q&A**: 상품 문의 및 답변
- **반품 정보**: 반품/교환 정책 안내

### 🛒 장바구니 & 주문
- **장바구니**: 상품 추가/삭제/수량 변경, LocalStorage 저장
- **주문/결제**: 주문 정보 입력, 결제 수단 선택
- **주문 내역**: 주문 조회 및 상태 확인

### 👤 사용자 관리
- **회원가입/로그인**: BCrypt 암호화, Spring Security
- **마이페이지**: 주문 내역, 회원 정보 수정
- **인증/보안**: CORS 설정, 세션 관리

### 📊 관리자 기능 (예정)
- 상품 관리 (등록/수정/삭제)
- 주문 관리 (조회/상태 변경)
- 회원 관리 (조회/권한 관리)

---

## 🗄️ 데이터베이스 구조

### MySQL 8.0 (ecommerce)

**주요 테이블**:
- **product**: 상품 정보 (pid, name, price, info, rate, image, imgList)
- **member**: 회원 정보 (id, pwd, name, phone, email)
- **cart_item**: 장바구니 아이템
- **product_detailinfo**: 상품 상세 정보
- **product_qna**: 상품 Q&A
- **product_return**: 반품 정보

**연결 정보**:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce
spring.datasource.username=root
spring.datasource.password=mysql1234
```

---

## 🔌 API 명세

### Product API (`/product`)

| HTTP | 경로 | 설명 | 요청 | 응답 |
|------|------|------|------|------|
| GET | `/all` | 전체 상품 조회 | - | `List<Product>` |
| POST | `/pid` | 특정 상품 조회 | `{"pid": 1}` | `Product` |
| POST | `/detailinfo` | 상품 상세 정보 | `{"pid": 1}` | `ProductDetailinfo` |
| POST | `/qna` | 상품 Q&A 목록 | `{"pid": 1}` | `List<ProductQna>` |
| GET | `/return` | 반품 정보 조회 | - | `ProductReturn` |

### Member API (`/member`)

| HTTP | 경로 | 설명 |
|------|------|------|
| POST | `/signup` | 회원가입 (BCrypt 암호화) |
| POST | `/login` | 로그인 (세션/토큰 인증) |
| GET | `/info` | 회원 정보 조회 (인증 필요) |

### Cart API (`/cart`)

| HTTP | 경로 | 설명 |
|------|------|------|
| GET | `/list/{memberId}` | 장바구니 목록 조회 |
| POST | `/add` | 장바구니 추가 |
| PUT | `/update` | 장바구니 수정 |
| DELETE | `/remove/{itemId}` | 장바구니 삭제 |

> 자세한 API 명세는 [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md#api-명세)를 참고하세요.

---

## 🚀 빌드 및 실행

### 사전 준비

- **Java 21** (JDK 21)
- **Node.js 18+** 및 npm
- **MySQL 8.0**

### 1. 데이터베이스 설정

```sql
-- MySQL 데이터베이스 생성
CREATE DATABASE ecommerce CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 테이블 생성 (스키마 파일 실행)
USE ecommerce;
SOURCE schema.sql;
```

### 2. Backend 실행

```bash
# 프로젝트 루트로 이동
cd ecommerce-fullstack-app

# Backend 빌드
./gradlew :backend:build

# Backend 실행 (포트 8080)
./gradlew :backend:bootRun
```

**실행 확인**: `http://localhost:8080/product/all`

### 3. Frontend 실행

```bash
# Frontend 디렉토리로 이동
cd frontend

# 의존성 설치 (최초 1회)
npm install

# 개발 서버 실행 (포트 3000)
npm start
```

**실행 확인**: `http://localhost:3000`

### 4. 전체 실행 순서

1. MySQL 실행
2. Backend 실행 (포트 8080)
3. Frontend 실행 (포트 3000)
4. 브라우저 접속: `http://localhost:3000`

### 프로덕션 빌드

```bash
# Backend JAR 생성
./gradlew :backend:build
# 생성 위치: backend/build/libs/*.jar

# Frontend 정적 파일 생성
cd frontend
npm run build
# 생성 위치: frontend/build/
```

---

## 📚 문서

### 개발자 문서
- **[DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)** - 개발 가이드
  - 프로젝트 구조 및 아키텍처
  - 데이터베이스 설계
  - API 명세서
  - 코딩 컨벤션 (Java, React)
  - AI 프롬프트 템플릿
  - 개발 예시

### 추가 문서 (예정)
- 배포 가이드
- 테스트 가이드
- 성능 최적화

---

## 🎨 코딩 컨벤션

### Backend (Java)

- **클래스명**: PascalCase (예: `ProductController`)
- **메서드/변수**: camelCase (예: `findByPid()`)
- **패키지명**: 소문자, 언더스코어 (예: `ecommerce_fullstack_app`)
- **아키텍처**: Layered (Controller → Service → Repository)
- **의존성 주입**: Constructor Injection (`@Autowired`)
- **SQL**: Java Text Blocks (""" """)

### Frontend (React)

- **컴포넌트 파일**: PascalCase.jsx (예: `ProductCard.jsx`)
- **함수/변수**: camelCase (예: `fetchProducts`)
- **CSS 클래스**: kebab-case (예: `.product-list`)
- **컴포넌트**: 함수형 컴포넌트만 사용
- **상태 관리**: Redux Toolkit + Context API

> 자세한 컨벤션은 [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md#코딩-컨벤션)를 참고하세요.

---

## 🔄 개발 프로세스

1. **요구사항 정의**: 기능/화면/DB 설계
2. **환경 세팅**: GitHub 브랜치 전략, 초기 프로젝트 구조
3. **백엔드 개발**: REST API 구현, 데이터베이스 스키마
4. **프론트엔드 개발**: 컴포넌트 개발, Redux, API 연동
5. **통합 및 테스트**: E2E 테스트, UI/UX 개선

---

## 🌐 배포 현황

- **개발 환경**
  - Backend: `http://localhost:8080`
  - Frontend: `http://localhost:3000`

- **프로덕션**: 배포 예정

---

## 📖 참고 자료

- [SSF Shop 공식 사이트](https://www.ssfshop.com) - 벤치마킹 대상
- [Spring Boot 공식 문서](https://spring.io/projects/spring-boot)
- [React 공식 문서](https://react.dev)
- [Redux Toolkit 공식 문서](https://redux-toolkit.js.org/)
- [React Router v7 문서](https://reactrouter.com)

---

## 📄 라이선스

본 프로젝트는 **교육 및 포트폴리오 목적**으로 제작되었습니다.
상업적 이용은 제한됩니다.

---

## 👥 팀원

### Frontend
- **desfigne** - UI/UX 개발, Redux 상태 관리
- **seungju-6607** - 컴포넌트 개발, 라우팅

### Backend
- **ssojja** - REST API 개발, Spring Security 설정
- **doyoon0** - 데이터베이스 설계, JdbcTemplate 구현

---

## 🙏 감사의 글

SSF Shop을 벤치마킹 대상으로 선정하여 실무 수준의 쇼핑몰 구현 경험을 쌓을 수 있었습니다.
협업 과정을 통해 Git, 코드 리뷰, 문서화 등 실무 프로세스를 체험할 수 있었습니다.

---

## 📞 문의

프로젝트 관련 문의사항은 다음을 참고하세요:
- **개발 가이드**: [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)
- **Issues**: GitHub Issues를 활용해주세요

---

**프로젝트 버전**: 1.0.0
**최종 업데이트**: 2025-10-31
**벤치마킹**: [SSF Shop](https://www.ssfshop.com)
