const fs = require('fs');
const path = require('path');

// 검색할 파일 확장자
const searchExtensions = ['.js', '.jsx', '.ts', '.tsx', '.css', '.scss', '.html', '.json', '.md'];

// 이미지 확장자 패턴
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

// 참조 정보 저장
const references = [];
const fileStats = {
  scanned: 0,
  withReferences: 0,
  totalReferences: 0
};

// 파일 검색 함수
function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);

    // 제외할 디렉토리
    if (filePath.includes('node_modules') ||
        filePath.includes('.git') ||
        filePath.includes('images-for-hosting') ||
        filePath.includes('build') ||
        filePath.includes('dist')) {
      return;
    }

    if (fs.statSync(filePath).isDirectory()) {
      findFiles(filePath, fileList);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (searchExtensions.includes(ext)) {
        fileList.push(filePath);
      }
    }
  });

  return fileList;
}

// 이미지 참조 패턴 검색
function findImageReferences(filePath, content) {
  const relativePath = path.relative('.', filePath).replace(/\\/g, '/');
  const fileRefs = [];

  // 패턴 1: import 문
  // import logo from './logo.png'
  // import { ReactComponent as Icon } from './icon.svg'
  const importPattern = /import\s+.*?from\s+['"]([^'"]*\.(?:jpg|jpeg|png|gif|webp|svg))['"]/g;

  // 패턴 2: require 문
  // require('./image.png')
  const requirePattern = /require\s*\(\s*['"]([^'"]*\.(?:jpg|jpeg|png|gif|webp|svg))['"]\s*\)/g;

  // 패턴 3: src, href 속성
  // src="/images/logo.png"
  // href="./icon.svg"
  const srcPattern = /(?:src|href)\s*=\s*['"]([^'"]*\.(?:jpg|jpeg|png|gif|webp|svg))['"]/g;

  // 패턴 4: CSS background
  // background: url('./image.png')
  const cssPattern = /url\s*\(\s*['"]?([^'"()]*\.(?:jpg|jpeg|png|gif|webp|svg))['"]?\s*\)/g;

  // 패턴 5: 문자열 경로
  // "/images/product.webp"
  const pathPattern = /['"]([^'"]*\/[^'"]*\.(?:jpg|jpeg|png|gif|webp|svg))['"]/g;

  const patterns = [
    { name: 'import', regex: importPattern },
    { name: 'require', regex: requirePattern },
    { name: 'src/href', regex: srcPattern },
    { name: 'css-url', regex: cssPattern },
    { name: 'path', regex: pathPattern }
  ];

  const lines = content.split('\n');

  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.regex.exec(content)) !== null) {
      const imagePath = match[1];

      // 라인 번호 찾기
      const position = match.index;
      let lineNumber = 1;
      let currentPos = 0;

      for (let i = 0; i < lines.length; i++) {
        currentPos += lines[i].length + 1; // +1 for newline
        if (currentPos > position) {
          lineNumber = i + 1;
          break;
        }
      }

      fileRefs.push({
        file: relativePath,
        line: lineNumber,
        pattern: pattern.name,
        imagePath: imagePath,
        context: lines[lineNumber - 1].trim().substring(0, 100)
      });
    }
  });

  return fileRefs;
}

// 파일 스캔
console.log('🔍 이미지 참조 검색 중...\n');

const filesToScan = findFiles('.');
console.log(`📄 검색 대상 파일: ${filesToScan.length}개\n`);

filesToScan.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    fileStats.scanned++;

    const fileRefs = findImageReferences(filePath, content);

    if (fileRefs.length > 0) {
      references.push(...fileRefs);
      fileStats.withReferences++;
      fileStats.totalReferences += fileRefs.length;
    }

  } catch (err) {
    // Skip files that can't be read as text
  }
});

// JSON 저장
fs.writeFileSync('image-references.json', JSON.stringify(references, null, 2), 'utf8');

// CSV 생성
const csvHeader = 'file,line,pattern,imagePath,context\n';
const csvRows = references.map(ref =>
  `"${ref.file}",${ref.line},"${ref.pattern}","${ref.imagePath}","${ref.context.replace(/"/g, '""')}"`
).join('\n');
fs.writeFileSync('image-references.csv', csvHeader + csvRows, 'utf8');

// 통계 출력
console.log('✅ 이미지 참조 검색 완료!\n');
console.log('📊 검색 통계:');
console.log(`  - 스캔한 파일: ${fileStats.scanned}개`);
console.log(`  - 참조 발견: ${fileStats.withReferences}개 파일`);
console.log(`  - 총 참조 수: ${fileStats.totalReferences}개`);
console.log('\n📄 결과 파일:');
console.log('  - image-references.json');
console.log('  - image-references.csv');

// 패턴별 통계
const patternStats = {};
references.forEach(ref => {
  patternStats[ref.pattern] = (patternStats[ref.pattern] || 0) + 1;
});

console.log('\n📊 패턴별 통계:');
Object.entries(patternStats).sort((a, b) => b[1] - a[1]).forEach(([pattern, count]) => {
  console.log(`  - ${pattern}: ${count}개`);
});

// 가장 많이 참조되는 이미지
const imagePathCounts = {};
references.forEach(ref => {
  const imageName = path.basename(ref.imagePath);
  imagePathCounts[imageName] = (imagePathCounts[imageName] || 0) + 1;
});

const topImages = Object.entries(imagePathCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10);

if (topImages.length > 0) {
  console.log('\n🔝 가장 많이 참조되는 이미지 (Top 10):');
  topImages.forEach(([img, count]) => {
    console.log(`  - ${img}: ${count}번`);
  });
}
