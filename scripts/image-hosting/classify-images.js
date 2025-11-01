const fs = require('fs');
const path = require('path');

// 이미지 인벤토리 로드
const images = JSON.parse(fs.readFileSync('image-inventory.json', 'utf8'));

// 분류 기준
const classification = {
  products: [],
  brands: [],
  icons: [],
  docs: [],
  uncategorized: []
};

// 분류 로직
images.forEach(img => {
  const relativePath = img.relative_path.toLowerCase();

  if (relativePath.includes('frontend/public/images/')) {
    if (relativePath.includes('brands')) {
      classification.brands.push(img);
    } else {
      classification.products.push(img);
    }
  } else if (relativePath.includes('frontend/public/icons/')) {
    classification.icons.push(img);
  } else if (relativePath.includes('frontend/src/assets/brands/')) {
    classification.brands.push(img);
  } else if (relativePath.includes('docs/')) {
    classification.docs.push(img);
  } else {
    classification.uncategorized.push(img);
  }
});

// 중복 파일 찾기
const hashMap = {};
const duplicates = [];
images.forEach(img => {
  if (hashMap[img.md5_hash]) {
    duplicates.push({
      hash: img.md5_hash,
      files: [hashMap[img.md5_hash], img.relative_path]
    });
  } else {
    hashMap[img.md5_hash] = img.relative_path;
  }
});

// 분류 결과 저장
fs.writeFileSync('image-classification.json', JSON.stringify(classification, null, 2), 'utf8');

// 보고서 작성
let report = '# 이미지 분류 및 정리 보고서\n\n';
report += `**작업 일시**: ${new Date().toISOString()}\n\n`;
report += '---\n\n';
report += '## 📊 전체 통계\n\n';
report += `- **총 이미지 수**: ${images.length}개\n`;
report += `- **총 용량**: ${(images.reduce((sum, img) => sum + img.size_bytes, 0) / 1024 / 1024).toFixed(2)} MB\n`;
report += `- **중복 파일**: ${duplicates.length}개\n\n`;

report += '---\n\n';
report += '## 🗂️ 분류별 통계\n\n';
report += '| 분류 | 개수 | 용량 (MB) |\n';
report += '|------|------|----------|\n';

Object.entries(classification).forEach(([category, items]) => {
  const totalSize = items.reduce((sum, img) => sum + img.size_bytes, 0) / 1024 / 1024;
  report += `| ${category} | ${items.length}개 | ${totalSize.toFixed(2)} MB |\n`;
});

report += '\n---\n\n';
report += '## 📁 카테고리별 상세\n\n';

report += '### 1. 제품 이미지 (products)\n';
report += `- **개수**: ${classification.products.length}개\n`;
report += `- **위치**: \`frontend/public/images/\`\n`;
report += `- **설명**: 카테고리별 제품 이미지 (men, women, kids, sports, etc.)\n\n`;

report += '### 2. 브랜드 관련 (brands)\n';
report += `- **개수**: ${classification.brands.length}개\n`;
report += `- **위치**: \`frontend/public/images/brands/\`, \`frontend/src/assets/brands/\`\n`;
report += `- **설명**: 브랜드 로고, 배너 이미지\n\n`;

report += '### 3. 아이콘 (icons)\n';
report += `- **개수**: ${classification.icons.length}개\n`;
report += `- **위치**: \`frontend/public/icons/\`\n`;
report += `- **설명**: 브랜드 아이콘\n\n`;

report += '### 4. 문서 이미지 (docs)\n';
report += `- **개수**: ${classification.docs.length}개\n`;
report += `- **위치**: \`docs/assets/images/\`\n`;
report += `- **설명**: 문서 및 가이드용 스크린샷\n\n`;

report += '### 5. 미분류 (uncategorized)\n';
report += `- **개수**: ${classification.uncategorized.length}개\n`;
report += `- **설명**: 기타 위치의 이미지\n\n`;

if (duplicates.length > 0) {
  report += '---\n\n';
  report += '## ⚠️ 중복 파일 목록\n\n';
  duplicates.forEach((dup, idx) => {
    report += `### 중복 ${idx + 1}\n`;
    report += `- 해시: \`${dup.hash}\`\n`;
    dup.files.forEach(file => {
      report += `  - ${file}\n`;
    });
    report += '\n';
  });

  report += '**권장 사항**: 중복 파일 제거를 고려하세요.\n\n';
}

report += '---\n\n';
report += '## ✅ 다음 단계\n\n';
report += '1. 통합 이미지 폴더 생성\n';
report += '2. 모든 이미지를 용도별로 복사\n';
report += '3. 호스팅 서버에 업로드\n';
report += '4. 경로 일괄 변경\n';

fs.writeFileSync('image-classification-report.md', report, 'utf8');

// 콘솔 출력
console.log('✅ 이미지 분류 완료\n');
console.log('📊 분류별 통계:');
Object.entries(classification).forEach(([category, items]) => {
  console.log(`  ${category}: ${items.length}개`);
});
console.log(`\n⚠️ 중복 파일: ${duplicates.length}개`);
console.log('\n📄 보고서 생성: image-classification-report.md');
console.log('📄 분류 데이터: image-classification.json');
