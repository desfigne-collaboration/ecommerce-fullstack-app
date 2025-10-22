# Fashion Fullstack E-commerce App - AI 개발 가이드

## 📌 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [기술 스택](#기술-스택)
3. [프로젝트 구조](#프로젝트-구조)
4. [아키텍처 및 패키지 구조](#아키텍처-및-패키지-구조)
5. [데이터베이스 설계](#데이터베이스-설계)
6. [API 명세](#api-명세)
7. [코딩 컨벤션](#코딩-컨벤션)
8. [빌드 및 실행](#빌드-및-실행)
9. [AI 프롬프트 템플릿](#ai-프롬프트-템플릿)
10. [개발 예시](#개발-예시)

---

## 프로젝트 개요

### 기본 정보

| 항목 | 내용 |
|------|------|
| **프로젝트명** | Fashion Fullstack E-commerce Application |
| **프로젝트 루트** | `c:/dev/ecommerce-fullstack-app` |
| **프로젝트 타입** | Multi-module Gradle 프로젝트 |
| **구성** | Backend (Spring Boot) + Frontend (React) |
| **목적** | 쇼핑몰 웹 애플리케이션 |

### 프로젝트 특성

- **멀티 모듈 구조**: Gradle 기반 backend + frontend 통합
- **JPA 미사용**: JdbcTemplate 직접 사용
- **프록시 설정**: Frontend → Backend API 통신
- **데이터 소스**: MySQL + JSON 파일 (초기/참조 데이터)
- **인증 방식**: Spring Security (BCrypt 암호화)

---

## 기술 스택

### Backend (Spring Boot)

| 기술 | 버전 | 용도 |
|------|------|------|
| Java | 21 | 프로그래밍 언어 |
| Spring Boot | 3.5.6 | 프레임워크 |
| Gradle | 7.x+ | 빌드 도구 |
| MySQL | 8.0 | 데이터베이스 |
| MySQL Connector | 8.0.31 | JDBC 드라이버 |
| Spring Security | 3.5.6 | 보안 및 인증 |
| Spring JDBC | 3.5.6 | 데이터베이스 연결 |
| Lombok | 1.18.34 | 보일러플레이트 제거 |

#### 주요 의존성

```gradle
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-security'
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-jdbc'
    runtimeOnly 'mysql:mysql-connector-java:8.0.31'
    compileOnly 'org.projectlombok:lombok:1.18.34'
    annotationProcessor 'org.projectlombok:lombok:1.18.34'
}
```

#### 데이터베이스 연결 정보

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce
spring.datasource.username=root
spring.datasource.password=mysql1234
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

### Frontend (React)

| 기술 | 버전 | 용도 |
|------|------|------|
| React | 19.1.1 | UI 프레임워크 |
| Redux Toolkit | 2.9.0 | 상태 관리 |
| React Router | 7.9.1 | 라우팅 |
| Axios | 1.12.2 | HTTP 클라이언트 |
| React Icons | 5.5.0 | 아이콘 |
| React Scripts | 5.0.1 | 빌드 도구 (CRA) |

#### 주요 설정

```json
{
  "proxy": "http://localhost:8080",
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test"
  }
}
```

#### 상태 관리 전략

- **Redux Toolkit**: 전역 상태 (cart, product, auth)
- **React Context**: 컴포넌트 트리 전체 공유
- **Local State**: 컴포넌트 내부 상태 (useState)
- **Local Storage**: 장바구니 데이터 영구 저장

---

## 프로젝트 구조

### 전체 디렉토리 구조

```
ecommerce-fullstack-app/
├── backend/                          # Spring Boot 백엔드
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/springboot/ecommerce_fullstack_app/
│   │   │   │   ├── config/          # 설정 클래스
│   │   │   │   │   └── SecurityConfig.java
│   │   │   │   ├── controller/      # REST 컨트롤러
│   │   │   │   │   ├── ProductController.java
│   │   │   │   │   ├── MemberController.java
│   │   │   │   │   └── CartController.java
│   │   │   │   ├── dto/             # 데이터 전송 객체
│   │   │   │   │   ├── Product.java
│   │   │   │   │   ├── Member.java
│   │   │   │   │   ├── CartItem.java
│   │   │   │   │   ├── ProductDetailinfo.java
│   │   │   │   │   ├── ProductQna.java
│   │   │   │   │   └── ProductReturn.java
│   │   │   │   ├── repository/      # 데이터 액세스
│   │   │   │   │   ├── ProductRepository.java
│   │   │   │   │   ├── MemberRepository.java
│   │   │   │   │   ├── CartRepository.java
│   │   │   │   │   ├── JdbcTemplateProductRepository.java
│   │   │   │   │   ├── JdbcTemplateMemberRepository.java
│   │   │   │   │   └── JdbcTemplateCartRepository.java
│   │   │   │   ├── service/         # 비즈니스 로직
│   │   │   │   │   ├── ProductService.java
│   │   │   │   │   ├── ProductServiceImpl.java
│   │   │   │   │   ├── MemberService.java
│   │   │   │   │   ├── MemberServiceImpl.java
│   │   │   │   │   ├── CartService.java
│   │   │   │   │   └── CartServiceImpl.java
│   │   │   │   └── ecommerceFullstackAppApplication.java
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── static/
│   │   └── test/
│   └── build.gradle
│
├── frontend/                         # React 프론트엔드
│   ├── public/
│   │   ├── data/                    # JSON 데이터
│   │   │   ├── products.json
│   │   │   ├── productQnA.json
│   │   │   ├── productReturn.json
│   │   │   ├── productReview.json
│   │   │   └── support.json
│   │   ├── images/                  # 이미지 리소스
│   │   └── index.html
│   ├── src/
│   │   ├── app/                     # Redux Store
│   │   │   └── store.js
│   │   ├── components/              # 재사용 컴포넌트
│   │   │   ├── commons/
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── Menu.jsx
│   │   │   │   ├── MenuList.jsx
│   │   │   │   ├── SearchForm.jsx
│   │   │   │   ├── StarRating.jsx
│   │   │   │   ├── ImageList.jsx
│   │   │   │   └── LikeItem.jsx
│   │   │   ├── product/
│   │   │   │   ├── ProductAvatar.jsx
│   │   │   │   └── ProductList.jsx
│   │   │   ├── detailTabs/
│   │   │   │   ├── Detail.jsx
│   │   │   │   ├── QnA.jsx
│   │   │   │   ├── Return.jsx
│   │   │   │   └── Review.jsx
│   │   │   └── counter/
│   │   │       └── Counter.jsx
│   │   ├── context/                 # React Context
│   │   │   ├── AuthContext.js
│   │   │   ├── CartContext.js
│   │   │   └── ProductContext.js
│   │   ├── feature/                 # Redux Slices & API
│   │   │   ├── auth/
│   │   │   │   ├── authSlice.js
│   │   │   │   └── authAPI.js
│   │   │   ├── cart/
│   │   │   │   ├── cartSlice.js
│   │   │   │   └── cartAPI.js
│   │   │   ├── product/
│   │   │   │   ├── productSlice.js
│   │   │   │   └── productAPI.js
│   │   │   └── counter/
│   │   │       └── counterSlice.js
│   │   ├── hooks/                   # 커스텀 훅
│   │   │   ├── useAuth.js
│   │   │   ├── useCart.js
│   │   │   └── useProduct.js
│   │   ├── pages/                   # 페이지 컴포넌트
│   │   │   ├── Layout.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── CheckoutInfo.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Support.jsx
│   │   │   ├── ProectedPageRoute.js
│   │   │   └── support.js
│   │   ├── styles/                  # CSS 파일
│   │   │   ├── commons.css
│   │   │   ├── ecommerce.css
│   │   │   ├── cgv.css
│   │   │   ├── cgvSignup.css
│   │   │   ├── cart.css
│   │   │   ├── checkoutinfo.css
│   │   │   ├── login.css
│   │   │   └── signup.css
│   │   ├── utils/                   # 유틸리티
│   │   │   ├── cart.js
│   │   │   ├── dataFetch.js
│   │   │   ├── init.js
│   │   │   └── validate.js
│   │   ├── App.js
│   │   ├── AppCounter.js
│   │   ├── index.js
│   │   └── setupTests.js
│   └── package.json
│
├── gradle/
│   └── wrapper/
├── build.gradle                      # 루트 Gradle 설정
├── settings.gradle
├── gradlew
└── gradlew.bat
```

---

## 아키텍처 및 패키지 구조

### Backend 아키텍처

**베이스 패키지**: `com.springboot.ecommerce_fullstack_app`

#### Layered Architecture

```
Client Request
      ↓
┌─────────────────┐
│   Controller    │  @RestController, @RequestMapping
│   (REST API)    │  - HTTP 요청/응답 처리
└─────────────────┘
      ↓
┌─────────────────┐
│    Service      │  @Service, Interface + Impl
│ (Business Logic)│  - 비즈니스 로직 처리
└─────────────────┘
      ↓
┌─────────────────┐
│   Repository    │  @Repository, Interface + JdbcTemplate Impl
│ (Data Access)   │  - 데이터베이스 CRUD
└─────────────────┘
      ↓
   Database (MySQL)
```

### 1. Config 계층

#### SecurityConfig.java

**역할**: Spring Security 및 CORS 설정

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) {
        // CSRF 비활성화 (REST API)
        // CORS 활성화 (localhost:3000 허용)
        // 세션 정책: STATELESS
        // 인증 제외: /member/**, /product/**, /cart/**
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        // 허용 Origin: http://localhost:3000
        // 허용 메서드: GET, POST, PUT, DELETE, OPTIONS
        // 허용 헤더: *
        // 자격 증명: true
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

**주요 설정**:
- CSRF 비활성화
- CORS: `localhost:3000` 허용
- 세션 정책: STATELESS
- 인증 제외 경로: `/member/**`, `/product/**`, `/cart/**`
- 비밀번호 암호화: BCryptPasswordEncoder

### 2. DTO 계층

#### Product.java

```java
@Data
public class Product {
    private int pid;           // 상품 ID
    private String name;       // 상품명
    private long price;        // 가격
    private String info;       // 상품 정보
    private double rate;       // 평점
    private String image;      // 대표 이미지
    private String imgList;    // 이미지 목록 (JSON 문자열)
}
```

#### Member.java

```java
@Data
public class Member {
    private String id;         // 회원 ID
    private String pwd;        // 비밀번호 (암호화)
    private String name;       // 이름
    private String phone;      // 전화번호
    private String email;      // 이메일
}
```

#### 기타 DTO

- **CartItem.java**: 장바구니 아이템
- **ProductDetailinfo.java**: 상품 상세 정보
- **ProductQna.java**: 상품 Q&A
- **ProductReturn.java**: 반품 정보

**공통 특징**: Lombok `@Data` 사용 (Getter/Setter/toString 자동 생성)

### 3. Repository 계층

#### 인터페이스: ProductRepository.java

```java
public interface ProductRepository {
    ProductReturn findReturn();
    List<ProductQna> findQna(int pid);
    ProductDetailinfo findProductDetailinfo(int pid);
    Product findByPid(int pid);
    List<Product> findAll();
}
```

#### 구현: JdbcTemplateProductRepository.java

```java
@Repository
public class JdbcTemplateProductRepository implements ProductRepository {
    private JdbcTemplate jdbcTemplate;

    public JdbcTemplateProductRepository(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    @Override
    public List<Product> findAll() {
        String sql = "select pid, name, price, info, rate, " +
                     "trim(image) as image, imgList from product";
        return jdbcTemplate.query(sql,
                new BeanPropertyRowMapper<>(Product.class));
    }

    @Override
    public Product findByPid(int pid) {
        String sql = "select pid, name, price, info, rate, " +
                     "trim(image) as image, imgList from product " +
                     "where pid = ?";
        return jdbcTemplate.queryForObject(sql,
                new BeanPropertyRowMapper<>(Product.class), pid);
    }

    @Override
    public List<ProductQna> findQna(int pid) {
        String sql = """
            select qid, title, content,
                   is_complete as isComplete,
                   is_lock as isLock,
                   id, pid, cdate
            from product_qna
            where pid = ?
        """;
        return jdbcTemplate.query(sql,
                new BeanPropertyRowMapper<>(ProductQna.class), pid);
    }
}
```

**핵심 패턴**:
- `JdbcTemplate` 사용
- `BeanPropertyRowMapper`로 자동 매핑
- SQL은 Java Text Blocks (""" """)
- 컬럼명과 필드명 매핑: `AS` 사용 (예: `is_complete as isComplete`)
- `trim()` 함수로 공백 제거

### 4. Service 계층

#### 인터페이스: ProductService.java

```java
public interface ProductService {
    ProductReturn findReturn();
    List<ProductQna> findQna(int pid);
    ProductDetailinfo findDetailinfo(int pid);
    Product findByPid(int pid);
    List<Product> findAll();
}
```

#### 구현: ProductServiceImpl.java

```java
@Service
public class ProductServiceImpl implements ProductService {
    private ProductRepository productRepository;

    @Autowired
    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public List<Product> findAll() {
        return productRepository.findAll();
    }

    @Override
    public Product findByPid(int pid) {
        return productRepository.findByPid(pid);
    }

    // 기타 메서드...
}
```

**핵심 패턴**:
- Interface + Implementation 구조
- Constructor Injection (`@Autowired`)
- Repository 계층 호출

### 5. Controller 계층

#### ProductController.java

```java
@RestController
@RequestMapping("/product")
public class ProductController {
    private ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/all")
    public List<Product> all() {
        return productService.findAll();
    }

    @PostMapping("/pid")
    public Product pid(@RequestBody Product product) {
        return productService.findByPid(product.getPid());
    }

    @PostMapping("/detailinfo")
    public ProductDetailinfo detailinfo(@RequestBody Product product) {
        return productService.findDetailinfo(product.getPid());
    }

    @PostMapping("/qna")
    public List<ProductQna> qna(@RequestBody Product product) {
        return productService.findQna(product.getPid());
    }

    @GetMapping("/return")
    public ProductReturn getReturn() {
        return productService.findReturn();
    }
}
```

**핵심 패턴**:
- `@RestController`: REST API 컨트롤러
- `@RequestMapping`: 기본 경로 설정 (`/product`)
- `@GetMapping`, `@PostMapping`: HTTP 메서드 매핑
- `@RequestBody`: JSON 요청 본문 → 객체 변환
- Service 계층 호출

---

### Frontend 아키텍처

#### 컴포넌트 구조

```
App.js (Root)
  ├── AuthProvider (Context)
  ├── ProductProvider (Context)
  └── CartProvider (Context)
      └── BrowserRouter
          └── Routes
              └── Route (Layout)
                  ├── Route (Home)
                  ├── Route (Products)
                  ├── Route (ProductDetail)
                  ├── Route (Login)
                  ├── Route (Signup)
                  ├── Route (Cart) - Protected
                  ├── Route (CheckoutInfo) - Protected
                  └── Route (Support) - Protected
```

#### Redux Store 구조

```javascript
// app/store.js
import { configureStore } from '@reduxjs/toolkit';
import cartSlice from '../feature/cart/cartSlice.js';
import productSlice from '../feature/product/productSlice.js';
import authSlice from '../feature/auth/authSlice.js';

export const store = configureStore({
  reducer: {
    cart: cartSlice,      // 장바구니 상태
    product: productSlice, // 상품 상태
    auth: authSlice        // 인증 상태
  }
});
```

#### Context 패턴

```javascript
// context/ProductContext.js
export const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);

  return (
    <ProductContext.Provider value={{ products, setProducts }}>
      {children}
    </ProductContext.Provider>
  );
}
```

#### 라우팅 구조

```javascript
// App.js
export default function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="/all" element={<Products />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/products/:pid" element={<ProductDetail />} />

                {/* 보호된 라우트 */}
                <Route path="/cart" element={
                  <ProectedPageRoute>
                    <Cart />
                  </ProectedPageRoute>
                } />

                <Route path="/checkout" element={
                  <ProectedPageRoute>
                    <CheckoutInfo />
                  </ProectedPageRoute>
                } />

                <Route path="/support" element={
                  <ProectedPageRoute>
                    <Support />
                  </ProectedPageRoute>
                } />
              </Route>
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}
```

#### API 호출 패턴

```javascript
// feature/product/productAPI.js
import axios from 'axios';

export const fetchProducts = async () => {
  const response = await axios.get('/product/all');
  return response.data;
};

export const fetchProductDetail = async (pid) => {
  const response = await axios.post('/product/pid', { pid });
  return response.data;
};

export const fetchProductDetailInfo = async (pid) => {
  const response = await axios.post('/product/detailinfo', { pid });
  return response.data;
};
```

---

## 데이터베이스 설계

### 테이블 구조

#### 1. product (상품)

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| pid | INT | PRIMARY KEY | 상품 ID |
| name | VARCHAR | NOT NULL | 상품명 |
| price | BIGINT | NOT NULL | 가격 |
| info | TEXT | | 상품 정보 |
| rate | DOUBLE | | 평점 |
| image | VARCHAR | | 대표 이미지 경로 |
| imgList | TEXT | | 이미지 목록 (JSON) |

#### 2. member (회원)

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | VARCHAR | PRIMARY KEY | 회원 ID |
| pwd | VARCHAR | NOT NULL | 비밀번호 (BCrypt) |
| name | VARCHAR | NOT NULL | 이름 |
| phone | VARCHAR | | 전화번호 |
| email | VARCHAR | | 이메일 |

#### 3. cart_item (장바구니)

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| (구조 추정) | | | |

#### 4. product_detailinfo (상품 상세 정보)

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| did | INT | PRIMARY KEY | 상세정보 ID |
| title_en | VARCHAR | | 영문 제목 |
| title_ko | VARCHAR | | 한글 제목 |
| pid | INT | FOREIGN KEY | 상품 ID |
| list | TEXT | | 상세정보 목록 (JSON) |

#### 5. product_qna (상품 Q&A)

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| qid | INT | PRIMARY KEY | Q&A ID |
| title | VARCHAR | NOT NULL | 제목 |
| content | TEXT | | 내용 |
| is_complete | BOOLEAN | | 답변 완료 여부 |
| is_lock | BOOLEAN | | 비공개 여부 |
| id | VARCHAR | FOREIGN KEY | 작성자 ID |
| pid | INT | FOREIGN KEY | 상품 ID |
| cdate | DATE | | 작성일 |

#### 6. product_return (반품 정보)

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| rid | INT | PRIMARY KEY | 반품정보 ID |
| title | VARCHAR | | 제목 |
| description | TEXT | | 설명 |
| list | TEXT | | 반품 정책 목록 (JSON) |

### 데이터베이스 연결 설정

```properties
# application.properties
spring.application.name=ecommerce-fullstack-app
spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce
spring.datasource.username=root
spring.datasource.password=mysql1234
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

---

## API 명세

### Product API

**Base URL**: `/product`

| HTTP | 경로 | 설명 | 요청 본문 | 응답 |
|------|------|------|-----------|------|
| GET | `/all` | 전체 상품 조회 | - | `List<Product>` |
| POST | `/pid` | 특정 상품 조회 | `{"pid": 1}` | `Product` |
| POST | `/detailinfo` | 상품 상세 정보 | `{"pid": 1}` | `ProductDetailinfo` |
| POST | `/qna` | 상품 Q&A 목록 | `{"pid": 1}` | `List<ProductQna>` |
| GET | `/return` | 반품 정보 조회 | - | `ProductReturn` |

#### 예시 요청/응답

**GET /product/all**

```json
// Response
[
  {
    "pid": 1,
    "name": "후드티",
    "price": 15000,
    "info": "분홍색 후드티",
    "rate": 4.2,
    "image": "/images/1.webp",
    "imgList": "['/images/1.webp', '/images/1.webp']"
  }
]
```

**POST /product/pid**

```json
// Request
{
  "pid": 1
}

// Response
{
  "pid": 1,
  "name": "후드티",
  "price": 15000,
  "info": "분홍색 후드티",
  "rate": 4.2,
  "image": "/images/1.webp",
  "imgList": "['/images/1.webp', '/images/1.webp']"
}
```

### Member API

**Base URL**: `/member`

| HTTP | 경로 | 설명 | 비고 |
|------|------|------|------|
| POST | `/signup` | 회원가입 | 비밀번호 BCrypt 암호화 |
| POST | `/login` | 로그인 | 세션/토큰 기반 인증 |
| GET | `/info` | 회원 정보 조회 | 인증 필요 |

### Cart API

**Base URL**: `/cart`

| HTTP | 경로 | 설명 |
|------|------|------|
| GET | `/list/{memberId}` | 장바구니 목록 조회 |
| POST | `/add` | 장바구니 추가 |
| PUT | `/update` | 장바구니 수정 |
| DELETE | `/remove/{itemId}` | 장바구니 삭제 |

---

## 코딩 컨벤션

### Backend (Java) 컨벤션

#### 1. 네이밍 규칙

| 대상 | 규칙 | 예시 |
|------|------|------|
| 클래스 | PascalCase | `ProductController`, `ProductService` |
| 인터페이스 | PascalCase | `ProductRepository`, `MemberService` |
| 메서드 | camelCase | `findByPid()`, `findAll()` |
| 변수 | camelCase | `productService`, `jdbcTemplate` |
| 상수 | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |
| 패키지 | 소문자, 언더스코어 | `ecommerce_fullstack_app` |

#### 2. 어노테이션 사용

```java
// Controller
@RestController
@RequestMapping("/product")
public class ProductController { }

// Service
@Service
public class ProductServiceImpl implements ProductService { }

// Repository
@Repository
public class JdbcTemplateProductRepository implements ProductRepository { }

// Configuration
@Configuration
@EnableWebSecurity
public class SecurityConfig { }

// DTO
@Data  // Lombok
public class Product { }

// Bean
@Bean
public PasswordEncoder passwordEncoder() { }
```

#### 3. 의존성 주입 패턴

```java
// Constructor Injection (권장)
@RestController
@RequestMapping("/product")
public class ProductController {
    private ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }
}
```

#### 4. SQL 작성 규칙

```java
// Java Text Blocks 사용
String sql = """
    select qid, title, content,
           is_complete as isComplete,
           is_lock as isLock,
           id, pid, cdate
    from product_qna
    where pid = ?
""";

// 컬럼명과 필드명 매핑 (AS 사용)
String sql = "select title_en as titleEn, title_ko as titleKo from product";

// 공백 제거
String sql = "select trim(image) as image from product";

// BeanPropertyRowMapper 사용
return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Product.class), pid);
```

#### 5. 레이어 분리 원칙

```java
// ❌ 잘못된 예: Controller에서 직접 Repository 호출
@RestController
public class ProductController {
    @Autowired
    private ProductRepository productRepository;  // 잘못됨!
}

// ✅ 올바른 예: Service 계층 거침
@RestController
public class ProductController {
    @Autowired
    private ProductService productService;  // 올바름!
}
```

---

### Frontend (React) 컨벤션

#### 1. 네이밍 규칙

| 대상 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 파일 | PascalCase.jsx | `ProductList.jsx`, `Header.jsx` |
| 유틸/훅 파일 | camelCase.js | `useAuth.js`, `dataFetch.js` |
| 함수/변수 | camelCase | `fetchProducts`, `productList` |
| 상수 | UPPER_SNAKE_CASE | `API_BASE_URL` |
| CSS 클래스 | kebab-case | `.product-list`, `.cart-item` |

#### 2. 컴포넌트 작성 패턴

```javascript
// Named Export (권장)
export function ProductList({ products }) {
  return (
    <div className="product-list">
      {products.map(p => (
        <ProductAvatar key={p.pid} product={p} />
      ))}
    </div>
  );
}

// Default Export
export default function App() {
  return <div>...</div>;
}

// 함수형 컴포넌트만 사용 (클래스형 컴포넌트 사용 금지)
```

#### 3. Hooks 사용

```javascript
// useState
const [products, setProducts] = useState([]);

// useEffect
useEffect(() => {
  fetchProducts();
}, []);

// useContext
const { isAuthenticated } = useContext(AuthContext);

// Custom Hook
function useProduct() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productAPI.fetchProducts();
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, fetchProducts };
}
```

#### 4. Redux Slice 작성

```javascript
import { createSlice } from '@reduxjs/toolkit';

const productSlice = createSlice({
  name: 'product',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {
    setProducts: (state, action) => {
      state.items = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { setProducts, setLoading, setError } = productSlice.actions;
export default productSlice.reducer;
```

#### 5. API 호출 패턴

```javascript
import axios from 'axios';

// API 함수 분리
export const productAPI = {
  fetchAll: async () => {
    const response = await axios.get('/product/all');
    return response.data;
  },

  fetchById: async (pid) => {
    const response = await axios.post('/product/pid', { pid });
    return response.data;
  },

  fetchDetailInfo: async (pid) => {
    const response = await axios.post('/product/detailinfo', { pid });
    return response.data;
  }
};

// 에러 핸들링
try {
  const data = await productAPI.fetchAll();
  setProducts(data);
} catch (error) {
  console.error('Failed to fetch products:', error);
  setError(error.message);
}
```

#### 6. 라우팅 패턴

```javascript
// 중첩 라우팅
<Routes>
  <Route path="/" element={<Layout />}>
    <Route index element={<Home />} />
    <Route path="/all" element={<Products />} />
    <Route path="/products/:pid" element={<ProductDetail />} />
  </Route>
</Routes>

// 보호된 라우트
<Route path="/cart" element={
  <ProectedPageRoute>
    <Cart />
  </ProectedPageRoute>
} />

// 동적 파라미터 사용
import { useParams } from 'react-router-dom';

function ProductDetail() {
  const { pid } = useParams();
  // ...
}
```

#### 7. 스타일링 규칙

```javascript
// CSS 임포트 순서
import './styles/commons.css';     // 1. 공통 스타일
import './styles/ecommerce.css';      // 2. 앱 전체 스타일
import './styles/productList.css'; // 3. 컴포넌트 전용 스타일
```

```css
/* CSS 클래스 네이밍 (kebab-case) */
.product-list {
  display: flex;
  flex-wrap: wrap;
}

.product-item {
  width: 300px;
  padding: 20px;
}

.product-item__image {
  width: 100%;
}

.product-item__title {
  font-size: 16px;
}
```

---

## 빌드 및 실행

### 사전 준비

#### 1. 필수 소프트웨어 설치

- **Java 21** (JDK 21)
- **Node.js 18+** 및 npm
- **MySQL 8.0**
- **Gradle 7.x+** (또는 프로젝트의 gradlew 사용)

#### 2. 데이터베이스 설정

```sql
-- 데이터베이스 생성
CREATE DATABASE ecommerce CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 데이터베이스 선택
USE ecommerce;

-- 테이블 생성 (스키마 필요)
-- 초기 데이터 삽입 (필요 시)
```

---

### Backend 빌드 및 실행

#### 방법 1: Gradle Wrapper 사용 (권장)

```bash
# 프로젝트 루트로 이동
cd c:/dev/springboot/ecommerce-fullstack-app

# Backend 빌드
./gradlew :backend:build

# Backend 실행
./gradlew :backend:bootRun
```

#### 방법 2: Backend 디렉토리에서 실행

```bash
# Backend 디렉토리로 이동
cd c:/dev/springboot/ecommerce-fullstack-app/backend

# 빌드
../gradlew build

# 실행
../gradlew bootRun
```

#### 실행 확인

- **포트**: 8080 (기본값)
- **확인**: `http://localhost:8080/product/all` 접속

---

### Frontend 빌드 및 실행

#### 개발 서버 실행

```bash
# Frontend 디렉토리로 이동
cd c:/dev/springboot/ecommerce-fullstack-app/frontend

# 의존성 설치 (최초 1회)
npm install

# 개발 서버 실행
npm start
```

#### 프로덕션 빌드

```bash
# 빌드
npm run build

# 빌드 결과물 위치: build/
```

#### 실행 확인

- **포트**: 3000
- **확인**: `http://localhost:3000` 접속
- **API 프록시**: `http://localhost:8080`

---

### 전체 실행 순서

1. **MySQL 실행** 및 데이터베이스 생성
2. **Backend 실행** (포트 8080)
3. **Frontend 실행** (포트 3000)
4. **브라우저 접속**: `http://localhost:3000`

---

### Gradle 설정

#### 루트 build.gradle

```gradle
plugins {
    id 'java'
    id 'org.springframework.boot' version '3.5.6'
    id 'io.spring.dependency-management' version '1.1.7'
}

// 루트 프로젝트는 빌드 아티팩트를 만들지 않음
bootJar.enabled = false
jar.enabled = false

// 하위 프로젝트 공통 설정
subprojects {
    repositories {
        mavenCentral()
    }
    apply plugin: 'io.spring.dependency-management'
}
```

#### settings.gradle

```gradle
rootProject.name = 'ecommerce-fullstack-app'
include 'backend'   // Spring Boot 프로젝트
include 'frontend'  // React 프로젝트
```

#### Backend build.gradle

```gradle
plugins {
    id 'java'
    id 'org.springframework.boot' version '3.5.6'
    id 'io.spring.dependency-management' version '1.1.7'
}

group = 'com.springboot'
version = '0.0.1-SNAPSHOT'

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}

dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-security'
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-jdbc'
    runtimeOnly 'mysql:mysql-connector-java:8.0.31'
    compileOnly 'org.projectlombok:lombok:1.18.34'
    annotationProcessor 'org.projectlombok:lombok:1.18.34'
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
    testRuntimeOnly 'org.junit.platform:junit-platform-launcher'
}

tasks.named('test') {
    useJUnitPlatform()
}
```

---

## AI 프롬프트 템플릿

### 기본 프롬프트 템플릿

AI에게 코드 작성을 요청할 때 아래 템플릿을 사용하세요.

```
# 프로젝트 컨텍스트

Ecommerce Fullstack E-commerce 프로젝트의 코드를 작성합니다.

## 프로젝트 정보

- **프로젝트 루트**: c:/dev/springboot/ecommerce-fullstack-app
- **프로젝트 타입**: Multi-module Gradle (Backend + Frontend)
- **Backend**: Java 21, Spring Boot 3.5.6, JdbcTemplate (JPA 미사용)
- **Frontend**: React 19.1.1, Redux Toolkit 2.9.0, React Router v7.9.1

## Backend 코딩 규칙

### 패키지 구조
- 베이스 패키지: `com.springboot.ecommerce_fullstack_app`
- 하위 패키지: `config`, `controller`, `dto`, `repository`, `service`

### 아키텍처 패턴
- Layered Architecture: Controller → Service (Interface + Impl) → Repository (Interface + JdbcTemplate Impl)
- Constructor Injection 사용

### DTO 작성
```java
@Data
public class Product {
    private int pid;
    private String name;
    private long price;
    private String info;
    private double rate;
    private String image;
    private String imgList;
}
```

### Repository 작성
```java
@Repository
public class JdbcTemplateProductRepository implements ProductRepository {
    private JdbcTemplate jdbcTemplate;

    public JdbcTemplateProductRepository(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    @Override
    public List<Product> findAll() {
        String sql = """
            select pid, name, price, info, rate,
                   trim(image) as image, imgList
            from product
        """;
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Product.class));
    }
}
```

### Controller 작성
```java
@RestController
@RequestMapping("/product")
public class ProductController {
    private ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/all")
    public List<Product> all() {
        return productService.findAll();
    }

    @PostMapping("/pid")
    public Product pid(@RequestBody Product product) {
        return productService.findByPid(product.getPid());
    }
}
```

## Frontend 코딩 규칙

### 파일 구조
- 페이지: `src/pages/`
- 컴포넌트: `src/components/`
- Redux: `src/feature/`, `src/app/store.js`
- Context: `src/context/`
- 훅: `src/hooks/`

### 컴포넌트 작성
```jsx
// Named Export (권장)
export function ProductList({ products }) {
  return (
    <div className="product-list">
      {products.map(p => <ProductAvatar key={p.pid} product={p} />)}
    </div>
  );
}
```

### Redux Slice 작성
```javascript
import { createSlice } from '@reduxjs/toolkit';

const productSlice = createSlice({
  name: 'product',
  initialState: { items: [], loading: false, error: null },
  reducers: {
    setProducts: (state, action) => {
      state.items = action.payload;
    }
  }
});

export const { setProducts } = productSlice.actions;
export default productSlice.reducer;
```

### API 호출
```javascript
import axios from 'axios';

export const fetchProducts = async () => {
  const response = await axios.get('/product/all');
  return response.data;
};

export const fetchProductDetail = async (pid) => {
  const response = await axios.post('/product/pid', { pid });
  return response.data;
};
```

### 보호된 라우트
```jsx
<Route path="/cart" element={
  <ProectedPageRoute>
    <Cart />
  </ProectedPageRoute>
} />
```

## 데이터베이스

### 연결 정보
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce
spring.datasource.username=root
spring.datasource.password=mysql1234
```

### 주요 테이블
- `product`: pid, name, price, info, rate, image, imgList
- `member`: id, pwd(BCrypt), name, phone, email
- `product_detailinfo`: did, title_en, title_ko, pid, list
- `product_qna`: qid, title, content, is_complete, is_lock, id, pid, cdate
- `product_return`: rid, title, description, list

## 네이밍 컨벤션

### Backend (Java)
- 클래스: PascalCase
- 메서드/변수: camelCase
- 패키지: 소문자, 언더스코어

### Frontend (JavaScript)
- 컴포넌트 파일: PascalCase.jsx
- 유틸/훅: camelCase.js
- CSS 클래스: kebab-case

## 보안 설정

- CSRF 비활성화 (REST API)
- CORS: localhost:3000 허용
- 세션: STATELESS
- 인증 제외: /member/**, /product/**, /cart/**
- 비밀번호: BCryptPasswordEncoder

---

## 작업 지시

[여기에 구체적인 작업 요청 내용을 입력하세요]

---

## 필수 준수 사항

1. 위의 패키지 구조, 네이밍 컨벤션, 아키텍처 패턴을 **반드시** 따라야 합니다.
2. Backend는 JPA 대신 **JdbcTemplate**을 사용합니다.
3. Frontend는 **함수형 컴포넌트**만 사용합니다.
4. **Lombok**, **Redux Toolkit**, **Axios**를 활용합니다.
5. 기존 프로젝트 구조에서 **벗어나지 않도록** 주의합니다.
6. SQL은 **Java Text Blocks** (""" """)를 사용합니다.
7. 컬럼명과 필드명 매핑 시 **AS** 키워드를 사용합니다.
```

---

## 개발 예시

### 예시 1: 새로운 API 추가

**요청**: Order(주문) 기능을 추가하고 싶습니다.

**프롬프트**:

```
[위 기본 프롬프트 템플릿 복사]

## 작업 지시

Order(주문) 기능을 추가해주세요.

### Backend 요구사항

1. **DTO 생성**
   - Order.java (oid, memberId, totalPrice, orderDate, status)
   - OrderItem.java (oiid, oid, pid, quantity, price)

2. **Repository 생성**
   - OrderRepository 인터페이스
   - JdbcTemplateOrderRepository 구현 클래스
   - 메서드: createOrder(), findOrdersByMemberId(), findOrderById()

3. **Service 생성**
   - OrderService 인터페이스
   - OrderServiceImpl 구현 클래스

4. **Controller 생성**
   - OrderController (/order 경로)
   - POST /order/create - 주문 생성
   - GET /order/list/{memberId} - 회원별 주문 목록
   - GET /order/{oid} - 주문 상세

### Frontend 요구사항

1. **Redux 설정**
   - orderSlice.js 생성
   - orderAPI.js 생성

2. **페이지 컴포넌트**
   - OrderList.jsx (주문 목록)
   - OrderDetail.jsx (주문 상세)

3. **라우팅**
   - /orders - 주문 목록 (보호된 라우트)
   - /orders/:oid - 주문 상세 (보호된 라우트)

### 데이터베이스

`order`, `order_item` 테이블 생성 SQL도 함께 제공해주세요.
```

---

### 예시 2: 버그 수정

**요청**: ProductController에서 존재하지 않는 상품 조회 시 500 에러가 발생합니다.

**프롬프트**:

```
[위 기본 프롬프트 템플릿 복사]

## 작업 지시

ProductController의 `/product/pid` 엔드포인트에서 존재하지 않는 상품 ID 요청 시
500 Internal Server Error가 발생합니다. 이를 404 Not Found 에러로 변경하고
적절한 에러 메시지를 반환하도록 수정해주세요.

### 수정 방향

1. **커스텀 예외 생성**
   - ProductNotFoundException.java 생성
   - RuntimeException 상속

2. **전역 예외 처리**
   - GlobalExceptionHandler.java 생성 (@ControllerAdvice)
   - ProductNotFoundException 처리 → 404 응답

3. **Service 수정**
   - ProductServiceImpl.findByPid()에서 상품이 없을 경우 예외 발생

4. **Frontend 에러 처리**
   - productAPI.fetchById()에서 404 에러 처리
   - 사용자에게 "상품을 찾을 수 없습니다" 메시지 표시

### 에러 응답 형식

```json
{
  "timestamp": "2025-10-22T12:00:00",
  "status": 404,
  "error": "Not Found",
  "message": "Product not found with id: 999",
  "path": "/product/pid"
}
```
```

---

### 예시 3: 리팩토링

**요청**: Frontend의 API 호출 로직을 개선하고 싶습니다.

**프롬프트**:

```
[위 기본 프롬프트 템플릿 복사]

## 작업 지시

현재 Frontend의 API 호출 로직이 컴포넌트에 직접 작성되어 있어
코드 중복이 많고 유지보수가 어렵습니다. 다음과 같이 리팩토링해주세요.

### 리팩토링 요구사항

1. **API 함수 분리**
   - `src/feature/product/productAPI.js`에 모든 Product API 호출 함수 통합
   - `src/feature/cart/cartAPI.js`에 모든 Cart API 호출 함수 통합
   - `src/feature/auth/authAPI.js`에 모든 Auth API 호출 함수 통합

2. **Redux Thunk 적용**
   - 비동기 액션 생성자 사용
   - 로딩, 성공, 실패 상태 관리

3. **컴포넌트 간소화**
   - 컴포넌트에서는 `useDispatch`와 `useSelector`만 사용
   - API 호출 로직 제거

4. **에러 처리 개선**
   - 전역 에러 상태 관리
   - 사용자 친화적인 에러 메시지

### 예시: productSlice.js

```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as productAPI from './productAPI';

export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async () => {
    const response = await productAPI.fetchAll();
    return response;
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});
```

### 기존 기능 유지

리팩토링 후에도 모든 기존 기능이 정상 동작해야 합니다.
```

---

### 예시 4: 새로운 기능 추가

**요청**: 상품 리뷰 기능을 추가하고 싶습니다.

**프롬프트**:

```
[위 기본 프롬프트 템플릿 복사]

## 작업 지시

상품에 리뷰를 작성하고 조회할 수 있는 기능을 추가해주세요.

### Backend 요구사항

1. **DTO 생성**
   - ProductReview.java
     - rid: int (리뷰 ID)
     - pid: int (상품 ID)
     - memberId: String (작성자 ID)
     - rating: int (평점 1-5)
     - content: String (리뷰 내용)
     - createdDate: LocalDateTime (작성일)

2. **Repository**
   - ProductReviewRepository 인터페이스
   - JdbcTemplateProductReviewRepository 구현
   - 메서드:
     - createReview(ProductReview review)
     - findReviewsByProductId(int pid)
     - findReviewsByMemberId(String memberId)
     - updateReview(ProductReview review)
     - deleteReview(int rid)

3. **Service**
   - ProductReviewService 인터페이스
   - ProductReviewServiceImpl 구현

4. **Controller**
   - ReviewController (/review 경로)
   - POST /review/create - 리뷰 작성
   - GET /review/product/{pid} - 상품별 리뷰 목록
   - GET /review/member/{memberId} - 회원별 리뷰 목록
   - PUT /review/update - 리뷰 수정
   - DELETE /review/{rid} - 리뷰 삭제

### Frontend 요구사항

1. **Redux**
   - reviewSlice.js
   - reviewAPI.js

2. **컴포넌트**
   - ReviewList.jsx (리뷰 목록)
   - ReviewItem.jsx (개별 리뷰)
   - ReviewForm.jsx (리뷰 작성/수정 폼)
   - StarRating.jsx (별점 입력/표시)

3. **통합**
   - ProductDetail 페이지에 ReviewList 추가
   - 로그인한 사용자만 리뷰 작성 가능 (보호된 기능)

### 데이터베이스

```sql
CREATE TABLE product_review (
  rid INT PRIMARY KEY AUTO_INCREMENT,
  pid INT NOT NULL,
  member_id VARCHAR(50) NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  content TEXT,
  created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pid) REFERENCES product(pid),
  FOREIGN KEY (member_id) REFERENCES member(id)
);
```

### UI/UX 요구사항

- 별점은 1~5점 (별 아이콘)
- 리뷰는 최신순 정렬
- 페이지네이션 (10개씩)
- 본인이 작성한 리뷰만 수정/삭제 가능
```

---

## 추가 참고 사항

### 보안 체크리스트

- [ ] 비밀번호는 반드시 BCrypt 암호화
- [ ] SQL Injection 방지 (PreparedStatement 사용)
- [ ] CORS 설정 확인 (프로덕션에서는 특정 도메인만 허용)
- [ ] 세션 관리 정책 확인
- [ ] 민감한 정보 로그 출력 금지

### 성능 최적화

- [ ] 데이터베이스 인덱스 설정
- [ ] N+1 쿼리 방지
- [ ] 적절한 캐싱 전략
- [ ] 이미지 최적화 (압축, lazy loading)
- [ ] 번들 크기 최적화 (코드 스플리팅)

### 테스트

- [ ] 단위 테스트 (JUnit, Jest)
- [ ] 통합 테스트
- [ ] API 테스트 (Postman, Insomnia)
- [ ] E2E 테스트 (선택)

---

## 문의 및 지원

프로젝트 관련 문의사항이나 추가 지원이 필요한 경우:

1. 프로젝트 문서 확인 (`AI_DEVELOPMENT_GUIDE.md`)
2. 코드베이스 참조
3. 개발 팀에 문의

---

**문서 버전**: 1.0
**최종 업데이트**: 2025-10-22
**작성자**: desfigne
