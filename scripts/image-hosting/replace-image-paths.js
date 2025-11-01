const fs = require('fs');
const path = require('path');

/**
 * 이미지 경로 일괄 변경 스크립트
 *
 * 사용법:
 * node replace-image-paths.js <BASE_URL>
 *
 * 예시:
 * node replace-image-paths.js https://cdn.mysite.com/images
 */

// 명령줄 인자에서 BASE_URL 가져오기
const BASE_URL = process.argv[2];

if (!BASE_URL) {
  console.error('❌ 오류: 호스팅 서버 URL을 제공해야 합니다.\n');
  console.log('사용법:');
  console.log('  node replace-image-paths.js <BASE_URL>\n');
  console.log('예시:');
  console.log('  node replace-image-paths.js https://cdn.mysite.com/images');
  console.log('  node replace-image-paths.js https://s3.amazonaws.com/my-bucket');
  process.exit(1);
}

// URL 정규화 (마지막 슬래시 제거)
const normalizedBaseUrl = BASE_URL.replace(/\/$/, '');

console.log('🚀 이미지 경로 일괄 변경 시작\n');
console.log(`🌐 호스팅 서버 URL: ${normalizedBaseUrl}\n`);

// 파일 매핑 로드
const fileMapping = JSON.parse(fs.readFileSync('file-mapping.json', 'utf8'));
const references = JSON.parse(fs.readFileSync('image-references.json', 'utf8'));

// 경로 매핑 테이블 생성
const pathMappingTable = {};

fileMapping.copied.forEach(item => {
  const originalFilename = item.original_filename || item.filename;
  const category = item.category;
  const newUrl = `${normalizedBaseUrl}/${category}/${item.filename}`;

  // 원본 경로의 모든 변형 찾기
  const sourcePath = item.source.replace(/\\/g, '/');

  // 경로 변형들
  pathMappingTable[sourcePath] = newUrl;
  pathMappingTable[`./${sourcePath}`] = newUrl;
  pathMappingTable[`/${sourcePath}`] = newUrl;

  // 파일명만 (경로 없이)
  pathMappingTable[originalFilename] = newUrl;
  pathMappingTable[item.filename] = newUrl;

  // public 폴더 기준 경로
  if (sourcePath.includes('frontend/public/')) {
    const publicPath = sourcePath.replace('frontend/public', '');
    pathMappingTable[publicPath] = newUrl;
    pathMappingTable[`.${publicPath}`] = newUrl;
  }

  // src/assets 기준 경로
  if (sourcePath.includes('frontend/src/assets/')) {
    const assetsPath = sourcePath.replace('frontend/src/assets/', '');
    pathMappingTable[assetsPath] = newUrl;
    pathMappingTable[`./${assetsPath}`] = newUrl;
    pathMappingTable[`../${assetsPath}`] = newUrl;
    pathMappingTable[`../../${assetsPath}`] = newUrl;
    pathMappingTable[`../../../${assetsPath}`] = newUrl;
  }
});

// 백업 디렉토리 생성
const backupDir = 'backup-before-url-replacement';
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

// 수정할 파일 목록
const filesToModify = new Set();
references.forEach(ref => {
  filesToModify.add(ref.file);
});

console.log(`📋 수정 대상 파일: ${filesToModify.size}개\n`);

// 통계
const stats = {
  filesModified: 0,
  filesBackedUp: 0,
  replacements: 0,
  errors: []
};

// 파일별 처리
filesToModify.forEach(file => {
  try {
    // 백업 생성
    const backupPath = path.join(backupDir, file);
    const backupParentDir = path.dirname(backupPath);

    if (!fs.existsSync(backupParentDir)) {
      fs.mkdirSync(backupParentDir, { recursive: true });
    }

    fs.copyFileSync(file, backupPath);
    stats.filesBackedUp++;

    // 파일 내용 읽기
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;
    let fileReplacements = 0;

    // 이 파일의 모든 참조 가져오기
    const fileRefs = references.filter(ref => ref.file === file);

    // 각 이미지 경로를 새 URL로 교체
    fileRefs.forEach(ref => {
      const originalPath = ref.imagePath;

      // 매핑 테이블에서 새 URL 찾기
      let newUrl = null;

      // 정확히 일치하는 경로 찾기
      if (pathMappingTable[originalPath]) {
        newUrl = pathMappingTable[originalPath];
      } else {
        // 파일명만으로 찾기
        const filename = path.basename(originalPath);
        if (pathMappingTable[filename]) {
          newUrl = pathMappingTable[filename];
        }
      }

      if (newUrl) {
        // 경로 교체
        const escapedPath = originalPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escapedPath, 'g');

        if (content.includes(originalPath)) {
          content = content.replace(regex, newUrl);
          modified = true;
          fileReplacements++;
        }
      }
    });

    if (modified) {
      // 수정된 내용 저장
      fs.writeFileSync(file, content, 'utf8');
      stats.filesModified++;
      stats.replacements += fileReplacements;
      console.log(`✅ ${file} (${fileReplacements}개 교체)`);
    }

  } catch (err) {
    stats.errors.push({
      file: file,
      error: err.message
    });
    console.error(`❌ ${file}: ${err.message}`);
  }
});

// 교체 내역 저장
const replacementLog = {
  timestamp: new Date().toISOString(),
  baseUrl: normalizedBaseUrl,
  stats: stats,
  pathMappingTable: pathMappingTable
};

fs.writeFileSync('replacement-log.json', JSON.stringify(replacementLog, null, 2), 'utf8');

// 결과 출력
console.log('\n' + '='.repeat(60));
console.log('✅ 이미지 경로 교체 완료!\n');
console.log('📊 작업 통계:');
console.log(`  - 백업 파일: ${stats.filesBackedUp}개`);
console.log(`  - 수정한 파일: ${stats.filesModified}개`);
console.log(`  - 총 교체 수: ${stats.replacements}개`);
console.log(`  - 오류: ${stats.errors.length}개`);
console.log(`\n📁 백업 위치: ${backupDir}/`);
console.log(`📄 교체 로그: replacement-log.json`);

if (stats.errors.length > 0) {
  console.log('\n⚠️ 오류 발생:');
  stats.errors.forEach(err => {
    console.log(`  - ${err.file}: ${err.error}`);
  });
}

console.log('\n' + '='.repeat(60));
console.log('\n💡 다음 단계:');
console.log('1. 로컬에서 애플리케이션을 실행하여 이미지 로드 확인');
console.log('2. 문제가 있으면 백업에서 복구: xcopy /E /I backup-before-url-replacement\\* .');
console.log('3. 정상 작동하면 Git 커밋 생성');
