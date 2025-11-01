# 이미지 경로 교체 롤백 가이드

**작성일**: 2025-11-01

---

## 🚨 롤백이 필요한 경우

- 이미지가 로드되지 않는 경우
- 경로 교체 후 오류가 발생한 경우
- 잘못된 URL로 교체한 경우

---

## 📋 롤백 방법

### 방법 1: 백업에서 복구 (권장)

경로 교체 스크립트는 자동으로 백업을 생성합니다.

#### Windows
```cmd
xcopy /E /I /Y backup-before-url-replacement\* .
```

#### Linux/Mac
```bash
cp -r backup-before-url-replacement/* .
```

### 방법 2: Git에서 복구

Git 커밋 전이라면:
```bash
git restore .
```

Git 커밋 후라면:
```bash
git log --oneline  # 커밋 해시 확인
git revert <커밋해시>
```

또는 특정 파일만:
```bash
git checkout HEAD~1 -- <파일경로>
```

---

## ✅ 복구 후 확인 사항

1. **파일 복구 확인**
   ```bash
   git status
   ```

2. **애플리케이션 실행**
   ```bash
   cd frontend
   npm start
   ```

3. **이미지 로드 확인**
   - 브라우저에서 애플리케이션 확인
   - 개발자 도구에서 네트워크 탭 확인

---

## 🔍 문제 진단

### 이미지가 로드되지 않는 경우

1. **브라우저 개발자 도구 열기** (F12)
2. **Network 탭** 확인
3. 실패한 이미지 요청 찾기
4. 요청 URL과 응답 확인

#### 일반적인 문제

| 문제 | 원인 | 해결 방법 |
|------|------|-----------|
| 404 Not Found | URL 경로 오류 | 호스팅 서버 URL 확인 |
| CORS 오류 | 호스팅 서버 설정 | 서버에서 CORS 활성화 |
| 느린 로딩 | 큰 이미지 파일 | 이미지 최적화 필요 |

---

## 📝 재시도 방법

1. **백업 복구**
   ```cmd
   xcopy /E /I /Y backup-before-url-replacement\* .
   ```

2. **올바른 URL로 다시 실행**
   ```bash
   node replace-image-paths.js https://correct-url.com/images
   ```

---

## 🆘 긴급 연락처

문제가 지속되면:
1. Git 커밋 로그 확인
2. 백업 파일 확인
3. 팀원에게 연락

---

## 📚 관련 파일

- `backup-before-url-replacement/`: 자동 백업 폴더
- `replacement-log.json`: 교체 로그
- `file-mapping.json`: 파일 매핑 정보
- `image-references.json`: 이미지 참조 목록
