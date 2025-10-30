# Git Commit Error: Windows Reserved Filename 'nul'

## 발생 일시
2025-10-29

## 에러 상황

### 초기 증상
Git에 커밋하려고 `git add .` 명령어를 실행했을 때 다음과 같은 에러가 발생:

```bash
error: short read while indexing nul
error: nul: failed to insert into database
error: unable to index file 'nul'
fatal: adding files failed
```

## 원인 분석

### 1. Windows 예약 파일명 문제
- `nul`은 Windows에서 예약된 디바이스 이름
- Windows 예약 디바이스 이름 목록:
  - `NUL` (null device)
  - `CON` (console)
  - `PRN` (printer)
  - `AUX` (auxiliary)
  - `COM1-COM9` (serial ports)
  - `LPT1-LPT9` (parallel ports)

### 2. Git이 인덱싱할 수 없는 이유
- Git은 파일을 인덱싱할 때 파일 시스템에 접근
- Windows에서는 `nul`이 실제 파일이 아닌 디바이스로 인식됨
- Git이 이 파일을 읽으려고 할 때 "short read" 에러 발생
- 데이터베이스에 삽입하는 과정에서 실패

### 3. 파일 생성 원인 추정
- 리다이렉션 명령어 오타 (`2>nul` 대신 다른 명령어로 생성)
- 스크립트 실행 중 실수로 생성
- 일부 도구가 Windows 호환성 문제로 생성

## 해결 방법

### 1. nul 파일 삭제
```bash
rm -f ./nul
```

### 2. .gitignore에 Windows 예약 파일명 추가
`.gitignore` 파일에 다음 내용 추가:

```gitignore
# Windows reserved filenames
nul
NUL
CON
PRN
AUX
com[0-9]
lpt[0-9]
```

### 3. git add 재실행
```bash
git add .
```

## 결과

### 성공
- `nul` 파일 삭제 후 정상적으로 staging 가능
- Line Ending 관련 경고만 표시됨 (정상 동작)
  ```
  warning: in the working copy of 'file.js', LF will be replaced by CRLF the next time Git touches it
  ```

## 예방 조치

### 1. .gitignore 업데이트
모든 Windows 예약 파일명을 .gitignore에 추가하여 향후 동일 문제 방지

### 2. 파일 생성 시 주의사항
- 리다이렉션 명령어 사용 시 파일명 확인
- Windows 예약 이름 사용 금지
- 크로스 플랫폼 호환성 고려

### 3. Git 설정 확인
```bash
# Line ending 자동 변환 설정 (Windows)
git config --global core.autocrlf true
```

## 관련 문서
- [Windows Reserved Filenames Documentation](https://docs.microsoft.com/en-us/windows/win32/fileio/naming-a-file)
- [Git on Windows Line Endings](https://git-scm.com/book/en/v2/Customizing-Git-Git-Configuration#_core_autocrlf)

## 교훈
1. Windows 환경에서는 예약 파일명 사용 주의
2. Git 에러 발생 시 파일명 먼저 확인
3. .gitignore에 플랫폼별 예약어 미리 등록
4. Line Ending 경고는 정상 동작이므로 무시 가능
