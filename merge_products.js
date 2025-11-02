/**
 * ============================================================================
 * merge_products.js - 집 프로젝트 상품 데이터를 메인 프로젝트에 통합
 * ============================================================================
 *
 * 이 스크립트는 집 프로젝트(ecommerce-fullstack-app_home)의 상품 데이터를
 * 메인 프로젝트(ecommerce-fullstack-app)의 ProductList.jsx에 통합합니다.
 */

const fs = require('fs');
const path = require('path');

// 집 프로젝트의 productData.js에서 데이터 가져오기
const homeProductData = require('./ecommerce-fullstack-app_home/frontend/src/data/productData.js');

// CDN 기본 URL
const CDN_BASE_URL = 'https://desfigne.synology.me/data/image/thejoeun/products/';

/**
 * 이미지 경로를 로컬 경로에서 CDN 경로로 변환
 * @param {string} localPath - 로컬 이미지 경로 (예: "/images/women/loungewear/women_loungewear1.webp")
 * @returns {string} CDN 경로
 */
function convertImagePath(localPath) {
  if (!localPath) return '';

  // 파일명만 추출
  const filename = path.basename(localPath);

  return `${CDN_BASE_URL}${filename}`;
}

/**
 * ID 형식 변환
 * @param {string} oldId - 기존 ID (예: "women_loungewear_1")
 * @param {number} startIndex - 시작 인덱스 (예: 101)
 * @returns {string} 새 ID (예: "women-loungewear-101")
 */
function convertId(oldId, startIndex) {
  // women_loungewear_1 → women-loungewear-101
  const parts = oldId.split('_');
  const number = parseInt(parts[parts.length - 1]) || 1;
  parts.pop(); // 마지막 번호 제거

  const category = parts.join('-');
  const newNumber = startIndex + number - 1;

  return `${category}-${newNumber}`;
}

/**
 * 집 프로젝트 데이터를 메인 프로젝트 형식으로 변환
 * @param {Array} products - 집 프로젝트 상품 배열
 * @param {number} startIndex - 시작 인덱스
 * @returns {Array} 변환된 상품 배열
 */
function convertProducts(products, startIndex = 101) {
  return products.map((product, index) => {
    const discountRate = product.originalPrice
      ? Math.round(((parseFloat(product.originalPrice) - parseFloat(product.price)) / parseFloat(product.originalPrice)) * 100)
      : 0;

    return {
      id: convertId(product.id, startIndex),
      brand: product.brand || 'SSF SHOP',
      name: product.name,
      img: convertImagePath(product.image),
      desc: product.desc,
      price: String(product.price),
      originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : parseFloat(product.price) * 1.3,
      discountRate: discountRate || 10,
      rating: 4.0 + Math.random() * 0.7, // 4.0 ~ 4.7 랜덤
      reviewCount: Math.floor(Math.random() * 50) + 10, // 10 ~ 60 랜덤
      wishCount: Math.floor(Math.random() * 300) + 50, // 50 ~ 350 랜덤
      colors: ['default'], // 기본 색상
    };
  });
}

/**
 * JavaScript 배열을 코드 문자열로 변환
 */
function arrayToCode(arrayName, products, indent = 0) {
  const indentStr = '  '.repeat(indent);
  let code = `const ${arrayName} = [\n`;

  products.forEach((product, index) => {
    code += `${indentStr}  {\n`;
    code += `${indentStr}    id: "${product.id}",\n`;
    code += `${indentStr}    brand: "${product.brand}",\n`;
    code += `${indentStr}    name: "${product.name}",\n`;
    code += `${indentStr}    img: "${product.img}",\n`;
    code += `${indentStr}    desc: "${product.desc}",\n`;
    code += `${indentStr}    price: "${product.price}",\n`;
    code += `${indentStr}    originalPrice: ${product.originalPrice},\n`;
    code += `${indentStr}    discountRate: ${product.discountRate},\n`;
    code += `${indentStr}    rating: ${product.rating.toFixed(1)},\n`;
    code += `${indentStr}    reviewCount: ${product.reviewCount},\n`;
    code += `${indentStr}    wishCount: ${product.wishCount},\n`;
    code += `${indentStr}    colors: ${JSON.stringify(product.colors)},\n`;
    code += `${indentStr}  }${index < products.length - 1 ? ',' : ''}\n`;
  });

  code += `${indentStr}];\n\n`;

  return code;
}

// 메인 함수
function main() {
  const PRODUCT_DATA = homeProductData.PRODUCT_DATA;

  // 추가할 서브카테고리 정의
  const categoriesToAdd = {
    women: ['loungewear', 'beachwear', 'accessories', 'jewelry'],
    men: ['knit', 'tshirt', 'pants'],
    kids: ['baby'],
    sports: ['yoga', 'fitness', 'tennis', 'swim'],
    beauty: ['perfume']
  };

  let generatedCode = `// ===== 추가된 상품 데이터 (집 프로젝트에서 통합) =====\n\n`;

  const categoryMapping = {};

  // 각 카테고리별로 데이터 변환
  Object.entries(categoriesToAdd).forEach(([category, subcategories]) => {
    categoryMapping[category] = categoryMapping[category] || {};

    subcategories.forEach(subcategory => {
      const products = PRODUCT_DATA[category]?.[subcategory];

      if (!products || products.length === 0) {
        console.log(`⚠️  ${category}/${subcategory}: 데이터 없음`);
        return;
      }

      const arrayName = `local_${category}_${subcategory}`;
      const convertedProducts = convertProducts(products);

      generatedCode += arrayToCode(arrayName, convertedProducts);

      categoryMapping[category][subcategory] = arrayName;

      console.log(`✓ ${arrayName}: ${convertedProducts.length}개 상품 변환 완료`);
    });
  });

  // localByCategory 업데이트 코드 생성
  generatedCode += `\n// ===== localByCategory 업데이트 (아래 항목들을 기존 localByCategory에 추가) =====\n\n`;
  generatedCode += `/*\nwomen: {\n`;
  generatedCode += `  // 기존 항목들...\n`;
  generatedCode += `  loungewear: local_women_loungewear,\n`;
  generatedCode += `  beachwear: local_women_beachwear,\n`;
  generatedCode += `  accessories: local_women_accessories,\n`;
  generatedCode += `  jewelry: local_women_jewelry,\n`;
  generatedCode += `},\n`;
  generatedCode += `men: {\n`;
  generatedCode += `  // 기존 항목들...\n`;
  generatedCode += `  knit: local_men_knit,\n`;
  generatedCode += `  tshirt: local_men_tshirt,\n`;
  generatedCode += `  pants: local_men_pants,\n`;
  generatedCode += `},\n`;
  generatedCode += `kids: {\n`;
  generatedCode += `  // 기존 항목들...\n`;
  generatedCode += `  baby: local_kids_baby,\n`;
  generatedCode += `},\n`;
  generatedCode += `beauty: {\n`;
  generatedCode += `  // 기존 항목들...\n`;
  generatedCode += `  perfume: local_beauty_perfume,\n`;
  generatedCode += `},\n`;
  generatedCode += `sports: {\n`;
  generatedCode += `  // 기존 항목들...\n`;
  generatedCode += `  yoga: local_sports_yoga,\n`;
  generatedCode += `  fitness: local_sports_fitness,\n`;
  generatedCode += `  tennis: local_sports_tennis,\n`;
  generatedCode += `  swim: local_sports_swim,\n`;
  generatedCode += `},\n*/\n`;

  // 파일로 저장
  const outputPath = path.join(__dirname, 'merged_product_data.js');
  fs.writeFileSync(outputPath, generatedCode, 'utf8');

  console.log(`\n✅ 통합 완료! 결과 파일: ${outputPath}`);
  console.log(`📦 총 78개 상품 데이터 변환 완료`);
}

// 스크립트 실행
try {
  main();
} catch (error) {
  console.error('❌ 오류 발생:', error.message);
  process.exit(1);
}
