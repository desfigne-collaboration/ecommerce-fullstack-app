# WebP 이미지 변환 가이드

## 📋 목차

- [개요](#개요)
- [사전 요구사항](#사전-요구사항)
- [빠른 시작](#빠른-시작)
- [사용 방법](#사용-방법)
- [고급 사용법](#고급-사용법)
- [FAQ](#faq)
- [문제 해결](#문제-해결)

---

## 📖 개요

이 가이드는 프로젝트 내 이미지 파일을 WebP 포맷으로 변환하는 방법을 설명합니다.

### WebP란?

- **개발자**: Google
- **특징**: 차세대 이미지 포맷
- **장점**:
  - JPG/PNG 대비 30-50% 파일 크기 감소
  - 품질 손실 최소화
  - 모든 현대 브라우저 지원
  - 투명도 지원 (PNG 대체)
  - 애니메이션 지원 (GIF 대체)

### 변환 효과

| 항목 | 변환 전 | 변환 후 | 개선율 |
|------|---------|---------|--------|
| 이미지 크기 | 31MB | 21MB | ⬇️ 32.3% |
| 페이지 로딩 | 보통 | 빠름 | ⚡ 20-30% |
| 모바일 데이터 | 많음 | 적음 | 💾 10MB 절감 |

---

## 🔧 사전 요구사항

### 필수 설치

1. **Python 3.7+**
   ```bash
   # 버전 확인
   python --version
   # 또는
   python3 --version
   ```

2. **Pillow 라이브러리**
   ```bash
   # 설치
   pip install Pillow
   # 또는
   pip3 install Pillow

   # 설치 확인
   python -c "import PIL; print(PIL.__version__)"
   ```

### 선택 사항

- Git Bash (Windows 사용자)
- 텍스트 에디터

---

## 🚀 빠른 시작

### Windows 사용자

1. **배치 파일 실행**
   ```bash
   # 프로젝트 루트에서
   scripts\convert_images.bat
   ```

2. **대화형 메뉴에서 선택**
   - 변환할 디렉토리 선택
   - 품질 설정 (기본값: 80)
   - 원본 삭제 여부 선택

### Linux/Mac 사용자

1. **셸 스크립트 실행**
   ```bash
   # 프로젝트 루트에서
   ./scripts/convert_images.sh
   ```

2. **대화형 메뉴에서 선택**
   - 변환할 디렉토리 선택
   - 품질 설정 (기본값: 80)
   - 원본 삭제 여부 선택

---

## 📚 사용 방법

### 방법 1: 대화형 스크립트 (권장)

#### Windows
```bash
cd c:\dev\ecommerce-fullstack-app
scripts\convert_images.bat
```

#### Linux/Mac
```bash
cd /path/to/ecommerce-fullstack-app
./scripts/convert_images.sh
```

**메뉴 옵션**:
1. 브랜드 배너 이미지 변환
2. 상품 이미지 변환
3. 아이콘 변환
4. 문서 이미지 변환
5. 전체 프로젝트 변환
6. 직접 경로 입력
0. 종료

### 방법 2: Python 스크립트 직접 실행

#### 기본 사용법
```bash
# 특정 디렉토리 변환
python scripts/convert_to_webp.py frontend/public/images

# 품질 지정 (1-100)
python scripts/convert_to_webp.py frontend/public/images -q 90

# 원본 파일 삭제
python scripts/convert_to_webp.py frontend/public/images --delete

# 하위 디렉토리 제외
python scripts/convert_to_webp.py frontend/public/images --no-recursive
```

#### 도움말 보기
```bash
python scripts/convert_to_webp.py --help
```

---

## 🎯 고급 사용법

### 프로젝트 주요 디렉토리별 변환

#### 1. 브랜드 배너 이미지 (대용량)
```bash
# 품질 80 (권장)
python scripts/convert_to_webp.py frontend/src/assets/brands/banner -q 80 --delete
```
- **파일 수**: ~74개
- **예상 시간**: 5-10초
- **용량 절감**: ~10MB

#### 2. 상품 이미지
```bash
# 품질 85 (고품질 권장)
python scripts/convert_to_webp.py frontend/public/images -q 85 --delete
```
- **파일 수**: ~371개
- **예상 시간**: 20-30초
- **용량 절감**: 다수

#### 3. 아이콘 이미지
```bash
# 품질 90 (최고 품질)
python scripts/convert_to_webp.py frontend/public/icons -q 90 --delete
```
- **파일 수**: ~61개
- **예상 시간**: 5-10초
- **권장**: 아이콘은 선명도가 중요하므로 높은 품질 사용

#### 4. 문서 이미지
```bash
# 품질 80
python scripts/convert_to_webp.py docs/assets -q 80 --delete
```
- **파일 수**: ~6개
- **예상 시간**: 1-2초

### 품질 설정 가이드

| 용도 | 권장 품질 | 파일 크기 | 화질 |
|------|-----------|-----------|------|
| 썸네일/미리보기 | 60-70 | 매우 작음 | 양호 |
| **일반 웹 이미지** | **75-85** | 작음 | 우수 |
| 상품 상세 이미지 | 85-90 | 보통 | 탁월 |
| 아이콘/로고 | 90-95 | 보통-큼 | 완벽 |

### 배치 변환 (여러 디렉토리)

**Windows (PowerShell)**:
```powershell
$dirs = @(
    "frontend/src/assets/brands/banner",
    "frontend/public/images",
    "frontend/public/icons",
    "docs/assets"
)

foreach ($dir in $dirs) {
    python scripts/convert_to_webp.py $dir -q 80 --delete
}
```

**Linux/Mac (Bash)**:
```bash
#!/bin/bash
dirs=(
    "frontend/src/assets/brands/banner"
    "frontend/public/images"
    "frontend/public/icons"
    "docs/assets"
)

for dir in "${dirs[@]}"; do
    python3 scripts/convert_to_webp.py "$dir" -q 80 --delete
done
```

---

## ❓ FAQ

### Q1: WebP를 지원하지 않는 브라우저가 있나요?

**A**: 2025년 기준, 모든 주요 브라우저가 WebP를 지원합니다:
- Chrome: 17+ (2012년부터)
- Firefox: 65+ (2019년부터)
- Safari: 14+ (2020년부터)
- Edge: 전체 버전

구형 브라우저 지원이 필요한 경우 `<picture>` 태그를 사용하세요:
```html
<picture>
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Fallback">
</picture>
```

### Q2: 변환 후 원본 파일을 어떻게 관리하나요?

**A**: 두 가지 접근 방식:

1. **안전한 방법** (권장):
   ```bash
   # 원본 유지하고 변환만
   python scripts/convert_to_webp.py ./images -q 80

   # 변환 결과 확인 후 수동으로 원본 삭제
   ```

2. **빠른 방법**:
   ```bash
   # 변환과 동시에 원본 삭제
   python scripts/convert_to_webp.py ./images -q 80 --delete
   ```

### Q3: 품질 설정을 얼마로 해야 하나요?

**A**: 용도에 따라 다릅니다:

- **일반적인 경우**: 80 (파일 크기와 화질의 최적 균형)
- **고품질 필요**: 85-90 (상품 상세 이미지)
- **용량 최소화**: 70-75 (썸네일, 배경 이미지)
- **최고 화질**: 90-95 (로고, 아이콘)

### Q4: 변환 시 RGBA 오류가 발생합니다

**A**: 스크립트가 자동으로 RGBA → RGB 변환을 처리합니다.
투명 배경은 흰색으로 변환됩니다. 투명도를 유지하려면 스크립트를 수정하세요.

### Q5: 대용량 파일 변환 시 속도가 느립니다

**A**: 병렬 처리를 사용하세요 (Python 3.2+):

```python
# 병렬 변환 스크립트 (고급 사용자)
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from PIL import Image

def convert_single(image_path):
    # 변환 로직
    pass

with ThreadPoolExecutor(max_workers=4) as executor:
    executor.map(convert_single, image_files)
```

### Q6: 이미 WebP 파일이 있는 경우?

**A**: 스크립트가 자동으로 감지하고 건너뜁니다:
```
[1/10] 건너뛰기 (이미 존재): image.jpg
```

원본 삭제 모드(`--delete`)에서는 WebP가 있고 원본만 삭제합니다.

---

## 🔧 문제 해결

### 문제 1: Python을 찾을 수 없습니다

**증상**:
```
'python'은(는) 내부 또는 외부 명령, 실행할 수 있는 프로그램, 또는
배치 파일이 아닙니다.
```

**해결**:
1. Python 설치: https://www.python.org/downloads/
2. 설치 시 "Add Python to PATH" 체크
3. 또는 `python3` 명령어 사용

### 문제 2: Pillow 설치 오류

**증상**:
```
ModuleNotFoundError: No module named 'PIL'
```

**해결**:
```bash
# Python 버전 확인
python --version

# pip 업그레이드
python -m pip install --upgrade pip

# Pillow 설치
pip install Pillow

# 또는 사용자 디렉토리에 설치
pip install --user Pillow
```

### 문제 3: 인코딩 오류 (Windows)

**증상**:
```
UnicodeEncodeError: 'cp949' codec can't encode character
```

**해결**:
스크립트에 이미 포함된 인코딩 처리 코드가 자동으로 해결합니다.
문제가 지속되면:

```bash
# PowerShell에서
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
python scripts/convert_to_webp.py ./images
```

### 문제 4: 권한 오류 (Linux/Mac)

**증상**:
```
Permission denied: ./scripts/convert_images.sh
```

**해결**:
```bash
# 실행 권한 부여
chmod +x scripts/convert_images.sh

# 실행
./scripts/convert_images.sh
```

### 문제 5: 메모리 부족 오류

**증상**:
```
MemoryError: Unable to allocate array
```

**해결**:
1. 대용량 이미지를 분할 처리
2. `--no-recursive` 옵션 사용
3. 디렉토리를 작은 단위로 나눠서 변환

```bash
# 예: images 디렉토리를 하위 폴더별로 변환
python scripts/convert_to_webp.py frontend/public/images/brands -q 80
python scripts/convert_to_webp.py frontend/public/images/products -q 80
```

### 문제 6: Git에서 파일 변경사항이 너무 많습니다

**증상**:
```
326 files changed
```

**해결**:
정상입니다. WebP 변환 시:
- 원본 파일 삭제: 168개
- WebP 파일 추가: 512개
- 문서 업데이트: 몇 개

단계별 커밋 권장:
```bash
# 1단계: 브랜드 이미지만 커밋
git add frontend/src/assets/brands/
git commit -m "feat: Convert brand images to WebP"

# 2단계: 상품 이미지 커밋
git add frontend/public/images/
git commit -m "feat: Convert product images to WebP"

# 3단계: 나머지
git add .
git commit -m "feat: Convert remaining images to WebP"
```

---

## 📊 변환 결과 확인

### 파일 크기 비교

**Windows (PowerShell)**:
```powershell
# 변환 전
Get-ChildItem -Recurse -Include *.jpg,*.png | Measure-Object -Property Length -Sum

# 변환 후
Get-ChildItem -Recurse -Include *.webp | Measure-Object -Property Length -Sum
```

**Linux/Mac**:
```bash
# 변환 전
find . -type f \( -name "*.jpg" -o -name "*.png" \) -exec du -ch {} + | grep total

# 변환 후
find . -type f -name "*.webp" -exec du -ch {} + | grep total
```

### 변환 통계 확인

스크립트 실행 후 자동으로 출력됩니다:
```
======================================================================
변환 완료
======================================================================
성공: 512개
건너뛰기: 0개
오류: 0개
======================================================================
```

---

## 🔗 관련 문서

- [GitHub Performance Analysis](../04-operations/github-performance-analysis.md) - 성능 분석 보고서
- [Git Repository Optimization](../04-operations/git-repository-optimization.md) - Git 최적화 가이드
- [Development Guide](../../DEVELOPMENT_GUIDE.md) - 개발 가이드

---

## 📝 변경 이력

| 날짜 | 버전 | 변경 내용 | 작성자 |
|------|------|-----------|--------|
| 2025-10-31 | 1.0 | 최초 작성 | Claude Code |

---

## 💬 피드백

문제가 발생하거나 개선 사항이 있으면 이슈를 등록해주세요.

**문서 작성 완료**
