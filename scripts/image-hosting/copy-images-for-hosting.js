const fs = require('fs');
const path = require('path');

// 분류 데이터 로드
const classification = JSON.parse(fs.readFileSync('image-classification.json', 'utf8'));

// 통합 폴더 생성
const baseDir = 'images-for-hosting';
const dirs = [
  `${baseDir}/products`,
  `${baseDir}/brands`,
  `${baseDir}/icons`,
  `${baseDir}/docs`,
  `${baseDir}/uncategorized`
];

console.log('📁 통합 이미지 폴더 생성 중...\n');

// 디렉토리 생성
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ 생성: ${dir}`);
  }
});

// 파일 매핑 정보
const fileMapping = {
  copied: [],
  renamed: [],
  errors: []
};

// 파일 복사 함수
function copyFiles(category, items) {
  const targetDir = `${baseDir}/${category}`;
  const filenameCount = {};

  items.forEach(img => {
    try {
      const sourcePath = img.relative_path;
      let targetFilename = img.filename;

      // 파일명 충돌 체크
      if (filenameCount[targetFilename]) {
        filenameCount[targetFilename]++;
        const ext = path.extname(targetFilename);
        const name = path.basename(targetFilename, ext);
        targetFilename = `${name}_${filenameCount[targetFilename]}${ext}`;

        fileMapping.renamed.push({
          original: sourcePath,
          target: `${targetDir}/${targetFilename}`,
          reason: 'filename_conflict'
        });
      } else {
        filenameCount[targetFilename] = 1;
      }

      const targetPath = path.join(targetDir, targetFilename);

      // 파일 복사
      fs.copyFileSync(sourcePath, targetPath);

      fileMapping.copied.push({
        source: sourcePath,
        target: targetPath.replace(/\\/g, '/'),
        category: category,
        filename: targetFilename,
        original_filename: img.filename
      });

    } catch (err) {
      fileMapping.errors.push({
        file: img.relative_path,
        error: err.message
      });
    }
  });
}

// 각 카테고리별로 파일 복사
console.log('\n📋 이미지 복사 시작...\n');

Object.entries(classification).forEach(([category, items]) => {
  if (items.length > 0) {
    console.log(`복사 중: ${category} (${items.length}개)`);
    copyFiles(category, items);
  }
});

// 매핑 정보 저장
fs.writeFileSync('file-mapping.json', JSON.stringify(fileMapping, null, 2), 'utf8');

// README 파일 생성
let readme = '# 이미지 호스팅용 통합 폴더\n\n';
readme += `**생성 일시**: ${new Date().toISOString()}\n\n`;
readme += '이 폴더는 이미지 호스팅 서버에 업로드하기 위해 프로젝트의 모든 이미지를 통합한 폴더입니다.\n\n';
readme += '---\n\n';
readme += '## 📁 폴더 구조\n\n';
readme += '```\n';
readme += 'images-for-hosting/\n';
readme += '├── products/          # 제품 이미지 (333개)\n';
readme += '├── brands/            # 브랜드 로고/배너 (147개)\n';
readme += '├── icons/             # 브랜드 아이콘 (63개)\n';
readme += '├── docs/              # 문서용 이미지 (11개)\n';
readme += '└── uncategorized/     # 기타 (1개)\n';
readme += '```\n\n';
readme += '---\n\n';
readme += '## 📊 통계\n\n';

Object.entries(classification).forEach(([category, items]) => {
  readme += `- **${category}**: ${items.length}개\n`;
});

readme += `\n**총 파일 수**: ${fileMapping.copied.length}개\n`;
readme += `**이름 변경된 파일**: ${fileMapping.renamed.length}개\n`;
readme += `**오류**: ${fileMapping.errors.length}개\n\n`;

readme += '---\n\n';
readme += '## 🚀 다음 단계\n\n';
readme += '1. 이 폴더의 내용을 이미지 호스팅 서버에 업로드하세요\n';
readme += '2. 호스팅 서버의 URL 구조를 확인하세요\n';
readme += '3. URL을 제공하면 코드에서 경로를 일괄 변경합니다\n\n';
readme += '---\n\n';
readme += '## 📝 참고 파일\n\n';
readme += '- `file-mapping.json`: 원본과 복사본의 매핑 정보\n';
readme += '- `image-inventory.json`: 전체 이미지 목록\n';
readme += '- `image-classification-report.md`: 분류 보고서\n';

fs.writeFileSync(`${baseDir}/README.md`, readme, 'utf8');

// 결과 출력
console.log('\n✅ 이미지 복사 완료!\n');
console.log('📊 복사 통계:');
console.log(`  - 복사 성공: ${fileMapping.copied.length}개`);
console.log(`  - 이름 변경: ${fileMapping.renamed.length}개`);
console.log(`  - 오류: ${fileMapping.errors.length}개`);
console.log(`\n📁 위치: ${baseDir}/`);
console.log('📄 매핑 정보: file-mapping.json');
console.log(`📄 설명서: ${baseDir}/README.md`);

if (fileMapping.errors.length > 0) {
  console.log('\n⚠️ 오류가 발생한 파일:');
  fileMapping.errors.forEach(err => {
    console.log(`  - ${err.file}: ${err.error}`);
  });
}
