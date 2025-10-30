# 브랜드 로고 이미지 마이그레이션 작업 내역

## 📋 작업 개요

**작업 일자:** 2025-10-27
**목적:** 메인 페이지 인기 브랜드 영역의 로고 이미지가 엑박으로 표시되는 문제 해결
**작업자:** Claude AI

---

## 🔍 문제 상황

### 초기 문제
- 메인 페이지(`Home.jsx`)의 인기 브랜드 영역에서 브랜드 로고들이 엑박(깨진 이미지)으로 표시됨
- 35개 브랜드 로고가 모두 표시되지 않음
- "집에서 작업한 작업본" 프로젝트에는 정상적인 이미지 파일 존재

### 원인 분석
1. **프록시 설정 문제**
   - `package.json`에 `"proxy": "http://localhost:8080"` 설정 존재
   - 모든 경로가 백엔드로 프록시됨
   - `/icons/brand_xxx` 요청이 백엔드(8080)로 전달되어 `ECONNREFUSED` 에러 발생

2. **이미지 경로 문제**
   - 초기 코드: `/icons/brand_xxx.webp` 경로 사용
   - 백엔드 서버가 실행되지 않으면 이미지를 불러올 수 없는 구조

---

## 🛠️ 시도한 해결 방법

### 1차 시도: setupProxy.js 생성 (실패)
```javascript
// setupProxy.js 파일 생성 시도
// API 요청만 백엔드로 프록시하고 정적 파일은 제외하려 함
```
**실패 원인:**
- `package.json`에 `"type": "module"` 설정으로 인해 CommonJS 형식의 setupProxy.js가 작동하지 않음
- 개발 서버 시작 실패 (ERR_CONNECTION_REFUSED)

### 2차 시도: package.json에서 proxy 제거 (철회)
- proxy 설정을 제거하면 백엔드와의 API 연동이 불가능
- 즉시 원복

### 3차 시도: public/images/brands + process.env.PUBLIC_URL (실패)
```javascript
// 시도한 경로
{ logo: `${process.env.PUBLIC_URL}/images/brands/brand_xxx.webp` }
```
**실패 원인:**
- proxy 설정으로 인해 public 폴더의 파일도 백엔드로 프록시됨
- 이미지 엑박 지속

### 4차 시도: src/assets/brands + import (성공) ✅
```javascript
// import 방식 사용
import brand8Seconds from "../../assets/brands/brand_에잇세컨즈.webp";
```
**성공 이유:**
- Webpack이 import된 이미지를 번들에 포함
- 프록시를 거치지 않고 직접 제공
- 백엔드 없이도 정상 작동

---

## ✅ 최종 해결 방법

### 1. 브랜드 로고 이미지 파일 복사

**소스:** `C:\dev\ecommerce-fullstack-app (집에서 작업한 작업본)\frontend\public\icons\`
**타겟:** `C:\dev\ecommerce-fullstack-app\frontend\src\assets\brands\`

```powershell
# 폴더 생성
New-Item -ItemType Directory -Path 'frontend\src\assets\brands' -Force

# 파일 복사 (40개)
Copy-Item 'source\brand_*' -Destination 'frontend\src\assets\brands\' -Force
```

**복사된 파일 목록 (40개):**
- brand_에잇세컨즈.webp
- brand_빈폴.webp
- brand_비이커.webp
- brand_구호.png
- brand_이세이미야케.webp
- brand_메종키츠네.webp
- brand_띠어리.png
- brand_구호플러스.webp
- brand_꼼데가르송.webp
- brand_파타고니아.webp
- brand_스포티앤리치.webp
- brand_시에.webp
- brand_이뉴골프.webp
- brand_제너럴 아이디어.webp
- brand_르무통.webp
- brand_아미.png
- brand_준지.png
- brand_로가디스.webp
- brand_단톤.webp
- brand_텐꼬르소꼬모.webp
- brand_디애퍼처.webp
- brand_코스.webp
- brand_세인트제임스.webp
- brand_타미힐피거.png
- brand_캐나다구스.webp
- brand_헤라.webp
- brand_갤럭시라이프스타일.webp
- brand_르베이지.png
- brand_토리버치.webp
- brand_갤럭시.webp
- brand_르메르.png
- brand_핏플랍.png
- brand_가니.png
- brand_랙앤본.webp
- brand_샌드사운드.webp
- (그 외 5개)

### 2. Home.jsx 파일 수정

**파일 경로:** `frontend/src/pages/home/Home.jsx`

#### 변경 전:
```javascript
const brandData = [
  { logo: "/icons/brand_에잇세컨즈.webp", name: "에잇세컨즈", link: "/brand/8seconds", isImage: true },
  // ... 나머지 브랜드들
];
```

#### 변경 후:
```javascript
// 1. import 문 추가 (라인 5-40)
import brand8Seconds from "../../assets/brands/brand_에잇세컨즈.webp";
import brandBeanpole from "../../assets/brands/brand_빈폴.webp";
import brandBeaker from "../../assets/brands/brand_비이커.webp";
import brandKuho from "../../assets/brands/brand_구호.png";
import brandIsseyMiyake from "../../assets/brands/brand_이세이미야케.webp";
import brandMaisonKitsune from "../../assets/brands/brand_메종키츠네.webp";
import brandTheory from "../../assets/brands/brand_띠어리.png";
import brandKuhoPlus from "../../assets/brands/brand_구호플러스.webp";
import brandCommeDesGarcons from "../../assets/brands/brand_꼼데가르송.webp";
import brandPatagonia from "../../assets/brands/brand_파타고니아.webp";
import brandSportyRich from "../../assets/brands/brand_스포티앤리치.webp";
import brandSie from "../../assets/brands/brand_시에.webp";
import brandInuGolf from "../../assets/brands/brand_이뉴골프.webp";
import brandGeneralIdea from "../../assets/brands/brand_제너럴 아이디어.webp";
import brandLeMouton from "../../assets/brands/brand_르무통.webp";
import brandAmi from "../../assets/brands/brand_아미.png";
import brandJuunJ from "../../assets/brands/brand_준지.png";
import brandRokadis from "../../assets/brands/brand_로가디스.webp";
import brandDanton from "../../assets/brands/brand_단톤.webp";
import brand10CorsoComo from "../../assets/brands/brand_텐꼬르소꼬모.webp";
import brandDiapter from "../../assets/brands/brand_디애퍼처.webp";
import brandCos from "../../assets/brands/brand_코스.webp";
import brandSaintJames from "../../assets/brands/brand_세인트제임스.webp";
import brandTommyHilfiger from "../../assets/brands/brand_타미힐피거.png";
import brandCanadaGoose from "../../assets/brands/brand_캐나다구스.webp";
import brandHera from "../../assets/brands/brand_헤라.webp";
import brandGalaxyLifestyle from "../../assets/brands/brand_갤럭시라이프스타일.webp";
import brandRebaige from "../../assets/brands/brand_르베이지.png";
import brandToryBurch from "../../assets/brands/brand_토리버치.webp";
import brandGalaxy from "../../assets/brands/brand_갤럭시.webp";
import brandLemaire from "../../assets/brands/brand_르메르.png";
import brandFitflop from "../../assets/brands/brand_핏플랍.png";
import brandGanni from "../../assets/brands/brand_가니.png";
import brandRagBone from "../../assets/brands/brand_랙앤본.webp";
import brandSandsound from "../../assets/brands/brand_샌드사운드.webp";

// 2. brandData 배열 수정 (라인 171-212)
const brandData = [
  // Page 1 (1-12)
  { logo: brand8Seconds, name: "에잇세컨즈", link: "/brand/8seconds", isImage: true },
  { logo: brandBeanpole, name: "빈폴", link: "/brand/beanpole", isImage: true },
  { logo: brandBeaker, name: "비이커", link: "/brand/beaker", isImage: true },
  { logo: brandKuho, name: "구호", link: "/brand/kuho", isImage: true },
  { logo: brandIsseyMiyake, name: "이세이미야케", link: "/brand/issey-miyake", isImage: true },
  { logo: brandMaisonKitsune, name: "메종키츠네", link: "/brand/maison-kitsune", isImage: true },
  { logo: brandTheory, name: "띠어리", link: "/brand/theory", isImage: true },
  { logo: brandKuhoPlus, name: "구호플러스", link: "/brand/kuho-plus", isImage: true },
  { logo: brandCommeDesGarcons, name: "꼼데가르송", link: "/brand/comme-des-garcons", isImage: true },
  { logo: brandPatagonia, name: "파타고니아", link: "/brand/patagonia", isImage: true },
  { logo: brandSportyRich, name: "스포티앤리치", link: "/brand/sporty-rich", isImage: true },
  { logo: brandSie, name: "시에", link: "/brand/sie", isImage: true },

  // Page 2 (13-24)
  { logo: brandInuGolf, name: "이뉴골프", link: "/brand/inu-golf", isImage: true },
  { logo: brandGeneralIdea, name: "제너럴 아이디어", link: "/brand/general-idea", isImage: true },
  { logo: brandLeMouton, name: "르무통", link: "/brand/le-mouton", isImage: true },
  { logo: brandAmi, name: "아미", link: "/brand/ami", isImage: true },
  { logo: brandJuunJ, name: "준지", link: "/brand/juun-j", isImage: true },
  { logo: brandRokadis, name: "로가디스", link: "/brand/rokadis", isImage: true },
  { logo: brandDanton, name: "단톤", link: "/brand/danton", isImage: true },
  { logo: brand10CorsoComo, name: "텐꼬르소꼬모", link: "/brand/10-corso-como", isImage: true },
  { logo: brandDiapter, name: "디애퍼처", link: "/brand/diapter", isImage: true },
  { logo: brandCos, name: "코스", link: "/brand/cos", isImage: true },
  { logo: brandSaintJames, name: "세인트제임스", link: "/brand/saint-james", isImage: true },
  { logo: brandTommyHilfiger, name: "타미힐피거", link: "/brand/tommy-hilfiger", isImage: true },

  // Page 3 (25-35)
  { logo: brandCanadaGoose, name: "캐나다구스", link: "/brand/canada-goose", isImage: true },
  { logo: brandHera, name: "헤라", link: "/brand/hera", isImage: true },
  { logo: brandGalaxyLifestyle, name: "갤럭시라이프스타일", link: "/brand/galaxy-lifestyle", isImage: true },
  { logo: brandRebaige, name: "르베이지", link: "/brand/rebaige", isImage: true },
  { logo: brandToryBurch, name: "토리버치", link: "/brand/tory-burch", isImage: true },
  { logo: brandGalaxy, name: "갤럭시", link: "/brand/galaxy", isImage: true },
  { logo: brandLemaire, name: "르메르", link: "/brand/lemaire", isImage: true },
  { logo: brandFitflop, name: "핏플랍", link: "/brand/fitflop", isImage: true },
  { logo: brandGanni, name: "가니", link: "/brand/ganni", isImage: true },
  { logo: brandRagBone, name: "랙앤본", link: "/brand/rag-bone", isImage: true },
  { logo: brandSandsound, name: "샌드사운드", link: "/brand/sandsound", isImage: true }
];
```

---

## 📁 최종 프로젝트 구조

```
ecommerce-fullstack-app/
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   │   └── brands/              ✅ 브랜드 로고 40개 파일 위치
│   │   │       ├── brand_에잇세컨즈.webp
│   │   │       ├── brand_빈폴.webp
│   │   │       ├── brand_구호.png
│   │   │       └── ... (37개 더)
│   │   │
│   │   └── pages/
│   │       └── home/
│   │           └── Home.jsx         ✅ import 방식으로 이미지 사용
│   │
│   ├── public/
│   │   ├── icons/                   ⚠️ 기존 위치 (사용 안함)
│   │   └── images/
│   │       └── brands/              ⚠️ 시도했으나 사용 안함
│   │
│   └── package.json                 ✅ proxy 설정 유지
│
└── docs/
    └── brand-logo-migration.md      📄 이 문서
```

---

## 🎯 작업 결과

### 해결된 문제
✅ 메인 페이지의 35개 브랜드 로고가 정상적으로 표시됨
✅ 프록시 에러 제거 (ECONNREFUSED 에러 해결)
✅ 백엔드 서버 없이도 프론트엔드 단독 실행 가능
✅ package.json의 proxy 설정 유지 (API 호출용)

### 기술적 이점
- **Webpack 번들링:** 이미지가 번들에 포함되어 최적화됨
- **프록시 우회:** import된 리소스는 프록시를 거치지 않음
- **타입 안정성:** import 시 존재하지 않는 파일은 빌드 시 에러 발생
- **캐싱 최적화:** 파일 해시가 자동으로 추가됨

---

## 🔧 작동 원리

### 왜 src/assets에서는 되고 public에서는 안 되는가?

#### public 폴더의 파일
```
요청: /images/brands/brand_xxx.webp
  ↓
React Dev Server (localhost:3000)
  ↓
package.json의 proxy 설정 확인
  ↓
백엔드로 프록시 (localhost:8080)
  ↓
❌ ECONNREFUSED (백엔드 없음)
```

#### src 폴더의 import
```
import brand from "../../assets/brands/brand_xxx.webp"
  ↓
Webpack이 파일을 번들에 포함
  ↓
빌드된 정적 파일 생성 (/static/media/brand_xxx.abc123.webp)
  ↓
React Dev Server에서 직접 제공
  ↓
✅ 정상 작동 (프록시 무관)
```

---

## 📝 유지보수 가이드

### 새로운 브랜드 추가 방법

1. **이미지 파일 추가**
   ```
   frontend/src/assets/brands/brand_새브랜드.webp
   ```

2. **Home.jsx에 import 추가**
   ```javascript
   import brandNew from "../../assets/brands/brand_새브랜드.webp";
   ```

3. **brandData 배열에 추가**
   ```javascript
   { logo: brandNew, name: "새브랜드", link: "/brand/new-brand", isImage: true }
   ```

### 주의사항
⚠️ **절대 하지 말아야 할 것:**
- package.json에서 proxy 설정 제거 (API 연동 필수)
- 브랜드 로고를 public 폴더로 이동 (프록시 에러 재발)
- 경로를 문자열로 직접 지정 (`"/images/brands/..."` 사용 금지)

✅ **올바른 방법:**
- 항상 src/assets/brands에 이미지 보관
- 항상 import 방식 사용
- 변수명은 camelCase 사용 (예: `brandNew`, `brandExample`)

---

## 🐛 트러블슈팅

### Q1. 이미지가 여전히 안 보인다면?
```bash
# 개발 서버 재시작
npm start

# 캐시 삭제 후 재시작
rm -rf node_modules/.cache
npm start
```

### Q2. 빌드 시 이미지가 포함되지 않는다면?
- import 문이 올바른지 확인
- 파일 경로가 정확한지 확인
- 파일 확장자가 맞는지 확인 (.webp, .png)

### Q3. 한글 파일명 문제가 발생한다면?
- 현재 구조에서는 문제없음 (Webpack이 처리)
- 필요시 파일명을 영문으로 변경 가능

---

## 📊 성능 영향

### Before (경로 방식)
- 런타임에 이미지 요청
- 프록시를 거쳐 백엔드 확인
- 네트워크 오버헤드 발생
- 백엔드 의존성

### After (import 방식)
- 빌드 타임에 번들에 포함
- 직접 제공 (프록시 없음)
- 파일 해시로 캐싱 최적화
- 백엔드 독립적

---

## 🔗 관련 파일

- **수정된 파일:**
  - `frontend/src/pages/home/Home.jsx` (35개 import 추가, brandData 수정)

- **추가된 파일:**
  - `frontend/src/assets/brands/` (40개 이미지 파일)

- **유지된 설정:**
  - `frontend/package.json` (proxy 설정 유지)

---

## 📅 히스토리

| 날짜 | 작업 | 상태 |
|------|------|------|
| 2025-10-27 | 초기 문제 확인 | 브랜드 로고 엑박 |
| 2025-10-27 | setupProxy.js 시도 | 실패 |
| 2025-10-27 | package.json proxy 제거 시도 | 철회 |
| 2025-10-27 | public/images/brands 시도 | 실패 |
| 2025-10-27 | src/assets/brands + import | ✅ 성공 |
| 2025-10-27 | 문서 작성 완료 | 완료 |

---

## 💡 교훈

1. **프록시 설정의 영향 범위를 정확히 이해해야 함**
   - 단순히 API만 프록시되는 것이 아님
   - 모든 경로가 영향을 받음

2. **React에서 정적 파일을 다루는 두 가지 방법**
   - `public/`: 프록시 영향을 받음, 런타임 제공
   - `src/`: Webpack 번들링, 빌드 타임 포함

3. **프록시와 번들러의 차이를 이해**
   - public 폴더 = React Dev Server → Proxy → Backend
   - src import = Webpack → Bundle → React Dev Server

---

**작성자:** Claude AI
**최종 수정일:** 2025-10-27
**문서 버전:** 1.0
