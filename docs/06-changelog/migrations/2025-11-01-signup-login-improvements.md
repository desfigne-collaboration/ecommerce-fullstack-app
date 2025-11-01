# 회원가입/로그인 기능 개선사항 반영

**작성일**: 2025-11-01
**카테고리**: 기능 개선
**영향 범위**: 회원가입, 로그인, 데이터베이스
**브랜치**: feature/sh → develop → main
**작업자**: kim <ssojja0987@gmail.com>

---

## 개요

feature/sh 브랜치에서 작업된 회원가입/로그인 기능 개선사항을 develop 및 main 브랜치에 반영했습니다.

### 주요 개선사항

1. ✅ 회원가입 결과 반환 로직 수정 (회원가입 성공/실패 판단 가능)
2. ✅ 유효성 검사 전체 활성화 (이메일, 비밀번호, 필수항목)
3. ✅ DB 스키마 확장 (phone, role 컬럼 추가)
4. ✅ 디버깅 로그 추가

---

## 문제 상황

### 기존 문제점

**1. 회원가입 결과 처리 오류**
```javascript
// frontend/src/feature/auth/authAPI.js (Before)
export const getSignup = (formData) => async (dispatch) => {
   let result = null;
   const url = "http://localhost:8080/member/signup";
   result = await axiosPost(url, formData);
   // ❌ return 없음 - signResult가 항상 undefined
}
```

- `getSignup` 함수가 결과를 반환하지 않음
- `Signup.jsx`에서 `signResult` 확인 시 항상 `undefined`
- 회원가입 성공/실패를 제대로 판단할 수 없는 상태

**2. 유효성 검사 전부 비활성화**

`frontend/src/pages/auth/Signup.jsx`에서:
- 이메일 유효성 검사 주석 처리 (라인 156-185)
- 비밀번호 확인 검사 주석 처리 (라인 189-205)
- 필수 항목 체크 주석 처리 (라인 248-300)
- 결과: 빈 값이나 잘못된 형식으로도 회원가입 가능

**3. DB 스키마 불완전**

- `phone` (휴대전화번호) 컬럼 누락
- `role` (권한구분) 컬럼 누락
- 회원가입 폼에서 입력받지만 DB에 저장되지 않음

---

## 해결 방법

### 1. 회원가입 결과 반환 추가

**파일**: `frontend/src/feature/auth/authAPI.js`

```diff
export const getSignup = (formData) => async (dispatch) => {
   let result = null;
   const url = "http://localhost:8080/member/signup";
   result = await axiosPost(url, formData);
+  return result;
}
```

**효과**:
- 회원가입 성공/실패 여부를 정확하게 판단 가능
- `Signup.jsx`에서 결과에 따라 적절한 처리 가능

### 2. 유효성 검사 활성화

**파일**: `frontend/src/pages/auth/Signup.jsx`

**2-1. 이메일 유효성 검사 복원**

```javascript
const validateEmail = (value) => {
  if (!value) {
    setValidation((prev) => ({ ...prev, email: { valid: null, message: "" } }));
    return;
  }

  // 이메일 형식 검사
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    setValidation((prev) => ({
      ...prev,
      email: { valid: false, message: "올바른 이메일 형식이 아닙니다." },
    }));
    return;
  }

  // 이메일 중복 검사
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const isDuplicate = users.some((u) => u.email === value);

  if (isDuplicate) {
    setValidation((prev) => ({
      ...prev,
      email: { valid: false, message: "이미 가입된 이메일입니다." },
    }));
  } else {
    setValidation((prev) => ({
      ...prev,
      email: { valid: true, message: "사용 가능한 이메일입니다." },
    }));
  }
};
```

**2-2. 비밀번호 확인 검사 복원**

```javascript
const validatePasswordCheck = (checkValue, passwordValue) => {
  if (!checkValue) {
    setValidation((prev) => ({ ...prev, passwordCheck: { valid: null, message: "" } }));
    return;
  }

  if (checkValue !== passwordValue) {
    setValidation((prev) => ({
      ...prev,
      passwordCheck: { valid: false, message: "비밀번호가 일치하지 않습니다." },
    }));
  } else {
    setValidation((prev) => ({
      ...prev,
      passwordCheck: { valid: true, message: "비밀번호가 일치합니다." },
    }));
  }
};
```

**2-3. 필수 항목 체크 복원**

```javascript
const handleSignup = async (e) => {
  e.preventDefault();

  // 필수 항목 체크
  if (!form.name || !form.password || !form.passwordCheck || !form.email) {
    alert("필수 항목을 모두 입력해주세요.");
    return;
  }

  // 이름 검사
  if (form.name.trim().length < 2) {
    alert("이름은 최소 2자 이상이어야 합니다.");
    return;
  }

  // 비밀번호 일치 확인
  if (form.password !== form.passwordCheck) {
    alert("비밀번호가 일치하지 않습니다.");
    return;
  }

  // 유효성 검사 확인
  if (!validation.password.valid) {
    alert("비밀번호를 확인해주세요.");
    return;
  }

  if (validation.email.valid === false) {
    alert("이메일을 확인해주세요.");
    return;
  }

  // 필수 약관 동의 확인
  if (!agreements.age14 || !agreements.termsOfUse || !agreements.privacy || !agreements.membership) {
    alert("필수 약관에 모두 동의해주세요.");
    return;
  }

  // 전화번호 검사 (선택사항이지만 입력했으면 검사)
  if (form.phone && !/^[0-9]{10,11}$/.test(form.phone.replace(/-/g, ""))) {
    alert("올바른 전화번호 형식이 아닙니다. (10-11자리 숫자)");
    return;
  }

  // signupApi 호출
  const result = signupApi({
    email: form.email,
    password: form.password,
    name: form.name,
    phone: form.phone,
  });

  if (!result.ok) {
    alert(result.message);
    return;
  }

  // 신규 회원 웰컴 쿠폰 발급
  issueWelcomeCouponIfNeeded();

  const signResult = await dispatch(getSignup(form));
  console.log(signResult);

  if(signResult) {
    alert("회원가입이 완료되었습니다! 🎉");
    navigate("/login");
  } else {
    alert("회원가입에 실패하셨습니다.");
  }
};
```

**효과**:
- 잘못된 형식의 데이터 입력 방지
- 사용자 친화적인 에러 메시지 제공
- 데이터 품질 향상

### 3. DB 스키마 확장

**파일**: `ssf_user.sql`, `backend/src/main/java/com/ssf/project/repositoty/JdbcTemplateMemberRepository.java`

**3-1. SQL 테이블 정의 수정**

```sql
CREATE TABLE `ssf_user` (
	`user_key`		VARCHAR(100)	primary key		COMMENT '회원고유번호',
	`email`			VARCHAR(50)		NOT NULL		COMMENT '이메일',
	`username`		VARCHAR(20)		NOT NULL		COMMENT '이름',
	`userpwd`		VARCHAR(100)	NOT NULL		COMMENT '비밀번호',
	`banned`		VARCHAR(1)		NULL			COMMENT '정지여부',
	`signout`		VARCHAR(1)		NULL			COMMENT '회원탈퇴여부',
	`signin`		DATETIME		NOT NULL		COMMENT '가입날짜',
	`snsprov`		VARCHAR(100)	NULL			COMMENT 'SNS제공자종류',
	`snsid`			VARCHAR(100)	NULL			COMMENT '사용자SNS고유ID',
	`referralId`	VARCHAR(100)	NULL			COMMENT '추천인ID',
	`phone`			VARCHAR(13)		NULL			COMMENT '휴대전화번호',  -- ✅ 추가
	`role`			VARCHAR(13)		NOT NULL		COMMENT '권한구분코드'    -- ✅ 추가
);
```

**3-2. Repository INSERT 쿼리 수정**

```java
@Override
public int save(Member member) {
    String sql = """
        INSERT INTO ssf_user (user_key, email, username, userpwd, banned, signout,
                              signin, snsprov, snsid, referralId, phone, role)
        VALUES ( UUID() , ?, ?, ?, 'N', 'N', now(), ?, ?, ?, ?, "user")
    """;
    Object[] param = {
        member.getEmail(),
        member.getUsername(),
        member.getUserpwd(),
        member.getSnsprov(),
        member.getSnsid(),
        member.getReferralId(),
        member.getPhone()  // ✅ phone 파라미터 추가
    };

    int rows = jdbcTemplate.update(sql, param);
    System.out.println("rows ==> " + rows);
    return rows;
}
```

**효과**:
- 휴대전화번호 저장 가능
- 사용자 권한 구분 가능 (user/admin)
- 향후 권한 기반 기능 구현 가능

### 4. 디버깅 로그 추가

**파일**: `backend/src/main/java/com/ssf/project/service/MemberServiceImpl.java`

```java
@Override
public int signup (Member member){
    System.out.println("member :: " + member);  // ✅ 디버깅 로그 추가
    // 패스워드 인코딩
    String encodePwd = passwordEncoder.encode(member.getUserpwd());
    member.setUserpwd(encodePwd);
    return memberRepository.save(member);
};
```

**효과**:
- 회원가입 요청 데이터 확인 용이
- 문제 발생 시 빠른 디버깅 가능

### 5. DB 연결 정보 업데이트

**파일**: `backend/src/main/resources/application.properties`

```properties
spring.application.name=ecommerce-fullstack-app

# DB Info
spring.datasource.url=jdbc:mysql://localhost:3306/ssf
spring.datasource.username=admin
spring.datasource.password=admin0987!
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

**변경사항**:
- 데이터베이스명: `ecommerce` → `ssf`
- 사용자명: `root` → `admin`
- 비밀번호: `mysql1234` → `admin0987!`

---

## 수정된 파일 목록

| 번호 | 파일 경로 | 변경 내용 | 변경 규모 |
|------|-----------|----------|----------|
| 1 | `backend/src/main/java/com/ssf/project/dto/Member.java` | DTO 수정 | 30줄 수정 |
| 2 | `backend/src/main/java/com/ssf/project/repositoty/JdbcTemplateMemberRepository.java` | phone, role 컬럼 추가 | 7줄 수정 |
| 3 | `backend/src/main/java/com/ssf/project/service/MemberServiceImpl.java` | 디버그 로그 추가 | 1줄 추가 |
| 4 | `backend/src/main/resources/application.properties` | DB 연결 정보 변경 | 6줄 수정 |
| 5 | `frontend/src/feature/auth/authAPI.js` | return 문 추가 | 3줄 수정 |
| 6 | `frontend/src/pages/auth/Signup.jsx` | 유효성 검사 활성화 | 199줄 수정 |
| 7 | `ssf_user.sql` | phone, role 컬럼 추가 | 7줄 수정 |

**총 수정**: 7개 파일, 253줄

---

## 브랜치 머지 프로세스

### 1단계: feature/sh → develop

```bash
$ git checkout develop
Switched to branch 'develop'

$ git merge feature/sh --no-edit
Updating ea446e9..4a2773b
Fast-forward
 .../src/main/java/com/ssf/project/dto/Member.java  |  30 ++--
 .../repositoty/JdbcTemplateMemberRepository.java   |   7 +-
 .../com/ssf/project/service/MemberServiceImpl.java |   1 +
 backend/src/main/resources/application.properties  |   6 +-
 frontend/src/feature/auth/authAPI.js               |   3 +-
 frontend/src/pages/auth/Signup.jsx                 | 199 +++++++++++----------
 ssf_user.sql                                       |   7 +-
 7 files changed, 129 insertions(+), 124 deletions(-)
```

**결과**: Fast-forward 머지 성공 (충돌 없음)

### 2단계: develop → main

```bash
$ git checkout main
Switched to branch 'main'

$ git merge develop --no-edit
Merge made by the 'ort' strategy.
 .../src/main/java/com/ssf/project/dto/Member.java  |  30 ++--
 .../repositoty/JdbcTemplateMemberRepository.java   |   7 +-
 .../com/ssf/project/service/MemberServiceImpl.java |   1 +
 backend/src/main/resources/application.properties  |   6 +-
 frontend/src/feature/auth/authAPI.js               |   3 +-
 frontend/src/pages/auth/Signup.jsx                 | 199 +++++++++++----------
 ssf_user.sql                                       |   7 +-
 7 files changed, 129 insertions(+), 124 deletions(-)
```

**결과**: 머지 커밋 생성 (충돌 없음)

### 커밋 히스토리

```
*   dcadcff (HEAD -> main) Merge branch 'develop'
|\
| * 4a2773b (develop, feature/sh) signup db modify
| * 29a2fbd signup db modify
* | 04b6640 fix: SNS 로그인 BrowserRouter 호환성 문제 해결
* | e5d3eaf fix: 외부 이미지 URL import 구문을 const 선언으로 수정
|/
*   ea446e9 Merge branch 'develop'
```

---

## 테스트 시나리오

### 사전 준비

#### 1. 데이터베이스 마이그레이션

```sql
-- 기존 테이블 삭제 (개발 환경)
DROP TABLE IF EXISTS ssf_user;

-- 새 테이블 생성
CREATE TABLE `ssf_user` (
	`user_key`		VARCHAR(100)	primary key		COMMENT '회원고유번호',
	`email`			VARCHAR(50)		NOT NULL		COMMENT '이메일',
	`username`		VARCHAR(20)		NOT NULL		COMMENT '이름',
	`userpwd`		VARCHAR(100)	NOT NULL		COMMENT '비밀번호',
	`banned`		VARCHAR(1)		NULL			COMMENT '정지여부',
	`signout`		VARCHAR(1)		NULL			COMMENT '회원탈퇴여부',
	`signin`		DATETIME		NOT NULL		COMMENT '가입날짜',
	`snsprov`		VARCHAR(100)	NULL			COMMENT 'SNS제공자종류',
	`snsid`			VARCHAR(100)	NULL			COMMENT '사용자SNS고유ID',
	`referralId`	VARCHAR(100)	NULL			COMMENT '추천인ID',
	`phone`			VARCHAR(13)		NULL			COMMENT '휴대전화번호',
	`role`			VARCHAR(13)		NOT NULL		COMMENT '권한구분코드'
);
```

#### 2. Backend 서버 재시작

```bash
cd backend
./gradlew bootRun
```

#### 3. Frontend 서버 재시작

```bash
cd frontend
npm start
```

### 회원가입 테스트

#### 테스트 케이스 1: 유효성 검사 - 이메일

1. **접속**: `http://localhost:3000/signup`
2. **입력**: 이메일 필드에 `invalid-email` 입력
3. **예상 결과**:
   - ✗ 올바른 이메일 형식이 아닙니다. (빨간색 메시지)
4. **입력**: 이메일 필드에 `test@example.com` 입력
5. **예상 결과**:
   - ✓ 사용 가능한 이메일입니다. (녹색 메시지)

#### 테스트 케이스 2: 유효성 검사 - 비밀번호

1. **입력**: 비밀번호 `123` 입력
2. **예상 결과**:
   - ✗ 4자 이상 입력해주세요.
   - 영문, 숫자, 특수문자 체크 아이콘 비활성화
3. **입력**: 비밀번호 `test1234` 입력
4. **예상 결과**:
   - ✓ 사용 가능한 비밀번호입니다.
   - 영문, 숫자, 특수문자 2가지 이상 조합 체크
   - 4자 이상 체크

#### 테스트 케이스 3: 유효성 검사 - 비밀번호 확인

1. **입력**: 비밀번호 확인 `test5678` 입력 (다른 값)
2. **예상 결과**:
   - ✗ 비밀번호가 일치하지 않습니다.
3. **입력**: 비밀번호 확인 `test1234` 입력 (같은 값)
4. **예상 결과**:
   - ✓ 비밀번호가 일치합니다.

#### 테스트 케이스 4: 필수 항목 체크

1. **입력**: 이름만 입력하고 가입하기 클릭
2. **예상 결과**:
   - alert: "필수 항목을 모두 입력해주세요."

#### 테스트 케이스 5: 약관 동의 체크

1. **입력**: 모든 필드 입력, 약관 동의 안 함
2. **가입하기** 클릭
3. **예상 결과**:
   - alert: "필수 약관에 모두 동의해주세요."

#### 테스트 케이스 6: 정상 회원가입

1. **입력**:
   - 이름: `홍길동`
   - 이메일: `test@example.com`
   - 휴대폰: `01012345678`
   - 비밀번호: `test1234`
   - 비밀번호 확인: `test1234`
   - 필수 약관 전체 동의 체크
2. **가입하기** 클릭
3. **예상 결과**:
   - Backend 콘솔: `member :: Member{email='test@example.com', ...}`
   - Backend 콘솔: `rows ==> 1`
   - alert: "회원가입이 완료되었습니다! 🎉"
   - `/login` 페이지로 이동
4. **DB 확인**:
   ```sql
   SELECT * FROM ssf_user WHERE email = 'test@example.com';
   ```
   - `phone`: `01012345678` 저장 확인
   - `role`: `user` 저장 확인
   - `userpwd`: BCrypt 암호화된 값 확인

### 로그인 테스트

1. **접속**: `http://localhost:3000/login`
2. **입력**:
   - 이메일: `test@example.com`
   - 비밀번호: `test1234`
3. **로그인** 클릭
4. **예상 결과**:
   - alert: "로그인에 성공하였습니다."
   - 메인 페이지로 이동
   - 헤더에 사용자 이름 표시

---

## 예상 효과

### 개선된 기능

1. ✅ **회원가입 결과 처리 정상화**
   - 성공/실패 여부 정확한 판단
   - 적절한 피드백 메시지 제공

2. ✅ **데이터 품질 향상**
   - 이메일 형식 검증
   - 비밀번호 강도 검증
   - 필수 항목 검증
   - 약관 동의 필수화

3. ✅ **DB 스키마 완성도 향상**
   - 휴대전화번호 저장 가능
   - 사용자 권한 구분 가능
   - 향후 기능 확장 용이

4. ✅ **디버깅 편의성 향상**
   - 회원가입 요청 로그 확인 가능
   - 문제 발생 시 빠른 원인 파악

### 사용자 경험 개선

**변경 전**:
- 잘못된 형식의 데이터 입력 가능
- 회원가입 성공/실패 불분명
- 에러 발생 시 원인 파악 어려움

**변경 후**:
- 실시간 유효성 검사로 즉각적인 피드백
- 명확한 성공/실패 메시지
- 사용자 친화적인 에러 메시지

---

## 남아있는 문제점

다음 문제들은 이번 머지에서 해결되지 않았으며, 향후 협업 개발자와 함께 수정 예정입니다:

### 1. 세션 정책 충돌 (긴급)

**파일**: `backend/src/main/java/com/ssf/project/config/SecurityConfig.java`

**문제**:
```java
.sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
```
- STATELESS 모드로 설정되어 있으나
- `MemberController.java`에서 `HttpSession` 사용
- 로그인이 정상 작동하지 않을 수 있음

**해결 방안**:
```java
// Option 1: Session 사용
.sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))

// Option 2: JWT 토큰 기반 인증으로 전환
```

### 2. 로그인 예외 처리 없음 (긴급)

**파일**: `backend/src/main/java/com/ssf/project/service/MemberServiceImpl.java`

**문제**:
```java
String encodePwd = memberRepository.findByIdnPwd(member.getEmail());
// 존재하지 않는 사용자 시 EmptyResultDataAccessException 발생
```

**해결 방안**:
```java
@Override
public boolean login(Member member) {
    try {
        String encodePwd = memberRepository.findByIdnPwd(member.getEmail());
        if (encodePwd == null) {
            return false;
        }
        return passwordEncoder.matches(member.getUserpwd(), encodePwd);
    } catch (EmptyResultDataAccessException e) {
        return false;
    }
}
```

### 3. 중복 import (낮음)

**파일**: `backend/src/main/java/com/ssf/project/controller/MemberController.java`

**문제**: `@Autowired` 두 번 import됨 (라인 5, 7)

### 4. 하드코딩된 관리자 계정 (보안)

**파일**: `frontend/src/feature/auth/authAPI.js`

**문제**:
```javascript
if(formData.id === "admin" && formData.password === "1234") {
```

**해결 방안**: 환경 변수 또는 백엔드 인증으로 이동

---

## 후속 작업

### 필수 작업

1. **세션 정책 수정**
   - SessionCreationPolicy 변경
   - 또는 JWT 기반 인증 구현

2. **로그인 예외 처리 추가**
   - EmptyResultDataAccessException 처리
   - 적절한 에러 응답 반환

### 권장 작업

1. **API URL 일관성**
   - 회원가입: 절대 경로 → 상대 경로 변경
   - 또는 환경 변수 활용

2. **보안 강화**
   - 관리자 계정 하드코딩 제거
   - HTTPS 사용 (프로덕션)

3. **코드 정리**
   - 중복 import 제거
   - 사용되지 않는 코드 제거
   - 주석 처리된 코드 정리

---

## 관련 문서

- [SNS 로그인 라우터 수정](./2025-11-01-sns-login-router-fix.md)
- [프로젝트 구조](../../01-project/structure.md)
- [개발 가이드](../../03-development/README.md)

---

## 작업 정보

**작업 기간**: 2025-10-31 ~ 2025-11-01
**머지 완료일**: 2025-11-01
**테스트 상태**: 테스트 대기 중
**문서 작성**: Claude Code
**검토자**: 대기 중
