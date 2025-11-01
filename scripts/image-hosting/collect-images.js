const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// 이미지 정보 수집
const images = [];
const extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

function getFilesRecursively(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);

    // node_modules, .git 제외
    if (filePath.includes('node_modules') || filePath.includes('.git')) {
      return;
    }

    if (fs.statSync(filePath).isDirectory()) {
      getFilesRecursively(filePath, fileList);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (extensions.includes(ext)) {
        fileList.push(filePath);
      }
    }
  });

  return fileList;
}

// 파일 해시 계산
function getFileHash(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash('md5');
  hashSum.update(fileBuffer);
  return hashSum.digest('hex');
}

// 이미지 파일 수집
console.log('📸 이미지 파일 수집 중...');
const imageFiles = getFilesRecursively('.');

imageFiles.forEach(filePath => {
  try {
    const stat = fs.statSync(filePath);
    const relativePath = path.relative('.', filePath).replace(/\\/g, '/');

    images.push({
      filename: path.basename(filePath),
      path: filePath.replace(/\\/g, '/'),
      relative_path: relativePath,
      extension: path.extname(filePath),
      size_bytes: stat.size,
      size_kb: Math.round(stat.size / 1024 * 100) / 100,
      md5_hash: getFileHash(filePath)
    });
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err.message);
  }
});

// CSV 생성
const csvHeader = 'filename,relative_path,extension,size_kb,md5_hash\n';
const csvRows = images.map(img =>
  `"${img.filename}","${img.relative_path}","${img.extension}",${img.size_kb},"${img.md5_hash}"`
).join('\n');
fs.writeFileSync('image-inventory.csv', csvHeader + csvRows, 'utf8');

// JSON 생성
fs.writeFileSync('image-inventory.json', JSON.stringify(images, null, 2), 'utf8');

// 통계
const totalSize = images.reduce((sum, img) => sum + img.size_bytes, 0);
console.log(`\n✅ 총 이미지 파일 수: ${images.length}`);
console.log(`✅ 총 용량: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
console.log(`✅ CSV 파일 생성: image-inventory.csv`);
console.log(`✅ JSON 파일 생성: image-inventory.json`);

// 확장자별 통계
const extCounts = {};
images.forEach(img => {
  extCounts[img.extension] = (extCounts[img.extension] || 0) + 1;
});
console.log('\n📊 확장자별 통계:');
Object.entries(extCounts).sort((a, b) => b[1] - a[1]).forEach(([ext, count]) => {
  console.log(`  ${ext}: ${count}개`);
});

// 중복 파일 체크
const hashCounts = {};
images.forEach(img => {
  hashCounts[img.md5_hash] = (hashCounts[img.md5_hash] || 0) + 1;
});
const duplicates = Object.values(hashCounts).filter(count => count > 1).length;
if (duplicates > 0) {
  console.log(`\n⚠️ 중복 파일 발견: ${duplicates}개`);
} else {
  console.log('\n✅ 중복 파일 없음');
}
