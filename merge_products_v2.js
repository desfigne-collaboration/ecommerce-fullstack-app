/**
 * ============================================================================
 * merge_products_v2.js - 집 프로젝트 상품 데이터를 메인 프로젝트에 통합
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');

// 집 프로젝트의 productData.js 파일 읽기
const homeProductDataPath = path.join(__dirname, '..', 'ecommerce-fullstack-app_home', 'frontend', 'src', 'data', 'productData.js');
const productDataContent = fs.readFileSync(homeProductDataPath, 'utf8');

// 정규식을 사용해서 PRODUCT_DATA 객체 추출
const match = productDataContent.match(/export const PRODUCT_DATA = ({[\s\S]+?});/);
if (!match) {
  console.error('❌ PRODUCT_DATA를 찾을 수 없습니다.');
  process.exit(1);
}

// eval을 사용해서 객체로 변환 (주의: 신뢰할 수 있는 소스에서만 사용)
const PRODUCT_DATA = eval(`(${match[1]})`);

// CDN 기본 URL
const CDN_BASE_URL = 'https://desfigne.synology.me/data/image/thejoeun/products/';

/**
 * 이미지 경로를 로컬 경로에서 CDN 경로로 변환
 */
function convertImagePath(localPath) {
  if (!localPath) return '';
  const filename = path.basename(localPath);
  return `${CDN_BASE_URL}${filename}`;
}

/**
 * ID 형식 변환
 */
function convertId(oldId, startIndex) {
  const parts = oldId.split('_');
  const number = parseInt(parts[parts.length - 1]) || 1;
  parts.pop();
  const category = parts.join('-');
  const newNumber = startIndex + number - 1;
  return `${category}-${newNumber}`;
}

/**
 * 상품 데이터 변환
 */
function convertProducts(products, startIndex = 101) {
  return products.map((product, index) => {
    const priceNum = parseFloat(String(product.price).replace(/[^\d]/g, ''));
    const originalPriceNum = product.originalPrice
      ? parseFloat(String(product.originalPrice).replace(/[^\d]/g, ''))
      : priceNum * 1.3;

    const discountRate = Math.round(((originalPriceNum - priceNum) / originalPriceNum) * 100);

    return {
      id: convertId(product.id, startIndex),
      brand: product.brand || 'SSF SHOP',
      name: product.name,
      img: convertImagePath(product.image),
      desc: product.desc,
      price: String(priceNum),
      originalPrice: Math.round(originalPriceNum),
      discountRate: discountRate > 0 ? discountRate : 10,
      rating: parseFloat((4.0 + Math.random() * 0.7).toFixed(1)),
      reviewCount: Math.floor(Math.random() * 50) + 10,
      wishCount: Math.floor(Math.random() * 300) + 50,
      colors: ['default'],
    };
  });
}

/**
 * JavaScript 배열을 코드 문자열로 변환
 */
function arrayToCode(arrayName, products) {
  let code = `const ${arrayName} = [\n`;

  products.forEach((product, index) => {
    code += `  {\n`;
    code += `    id: "${product.id}",\n`;
    code += `    brand: "${product.brand}",\n`;
    code += `    name: "${product.name}",\n`;
    code += `    img: "${product.img}",\n`;
    code += `    desc: "${product.desc}",\n`;
    code += `    price: "${product.price}",\n`;
    code += `    originalPrice: ${product.originalPrice},\n`;
    code += `    discountRate: ${product.discountRate},\n`;
    code += `    rating: ${product.rating},\n`;
    code += `    reviewCount: ${product.reviewCount},\n`;
    code += `    wishCount: ${product.wishCount},\n`;
    code += `    colors: ${JSON.stringify(product.colors)},\n`;
    code += `  }${index < products.length - 1 ? ',' : ''}\n`;
  });

  code += `];\n\n`;
  return code;
}

// 메인 함수
function main() {
  const categoriesToAdd = {
    women: ['loungewear', 'beachwear', 'accessories', 'jewelry'],
    men: ['knit', 'tshirt', 'pants'],
    kids: ['baby'],
    sports: ['yoga', 'fitness', 'tennis', 'swim'],
    beauty: ['perfume']
  };

  let generatedCode = `// ===== 추가된 상품 데이터 (집 프로젝트에서 통합) =====\n\n`;

  let totalProducts = 0;

  // 각 카테고리별로 데이터 변환
  Object.entries(categoriesToAdd).forEach(([category, subcategories]) => {
    subcategories.forEach(subcategory => {
      const products = PRODUCT_DATA[category]?.[subcategory];

      if (!products || products.length === 0) {
        console.log(`⚠️  ${category}/${subcategory}: 데이터 없음`);
        return;
      }

      const arrayName = `local_${category}_${subcategory}`;
      const convertedProducts = convertProducts(products);

      generatedCode += arrayToCode(arrayName, convertedProducts);

      totalProducts += convertedProducts.length;
      console.log(`✓ ${arrayName}: ${convertedProducts.length}개 상품 변환 완료`);
    });
  });

  // localByCategory 업데이트 가이드 추가
  generatedCode += `\n/*\n`;
  generatedCode += `// ===== localByCategory 업데이트 가이드 =====\n`;
  generatedCode += `// ProductList.jsx의 localByCategory 객체를 다음과 같이 업데이트하세요:\n\n`;
  generatedCode += `const localByCategory = {\n`;
  generatedCode += `  women: {\n`;
  generatedCode += `    outer: local_women_outer,        // 기존\n`;
  generatedCode += `    jacket: local_women_jacket,      // 기존\n`;
  generatedCode += `    knit: local_women_knit,          // 기존\n`;
  generatedCode += `    shirt: local_women_shirt,        // 기존\n`;
  generatedCode += `    tshirt: local_women_tshirt,      // 기존\n`;
  generatedCode += `    onepiece: local_women_onepiece,  // 기존\n`;
  generatedCode += `    pants: local_women_pants,        // 기존\n`;
  generatedCode += `    skirt: local_women_skirt,        // 기존\n`;
  generatedCode += `    loungewear: local_women_loungewear,    // 추가\n`;
  generatedCode += `    beachwear: local_women_beachwear,      // 추가\n`;
  generatedCode += `    accessories: local_women_accessories,  // 추가\n`;
  generatedCode += `    jewelry: local_women_jewelry,          // 추가\n`;
  generatedCode += `  },\n`;
  generatedCode += `  men: {\n`;
  generatedCode += `    suit: local_men_suit,      // 기존\n`;
  generatedCode += `    jacket: local_men_jacket,  // 기존\n`;
  generatedCode += `    shirt: local_men_shirt,    // 기존\n`;
  generatedCode += `    knit: local_men_knit,      // 추가\n`;
  generatedCode += `    tshirt: local_men_tshirt,  // 추가\n`;
  generatedCode += `    pants: local_men_pants,    // 추가\n`;
  generatedCode += `  },\n`;
  generatedCode += `  kids: {\n`;
  generatedCode += `    boy: local_kids_boy,   // 기존\n`;
  generatedCode += `    girl: local_kids_girl, // 기존\n`;
  generatedCode += `    baby: local_kids_baby, // 추가\n`;
  generatedCode += `  },\n`;
  generatedCode += `  beauty: {\n`;
  generatedCode += `    skin: local_beauty_skin,      // 기존\n`;
  generatedCode += `    makeup: local_beauty_makeup,  // 기존\n`;
  generatedCode += `    perfume: local_beauty_perfume,  // 추가\n`;
  generatedCode += `  },\n`;
  generatedCode += `  golf: {\n`;
  generatedCode += `    women: local_golf_women, // 기존\n`;
  generatedCode += `  },\n`;
  generatedCode += `  sports: {\n`;
  generatedCode += `    running: local_sports_running,  // 기존\n`;
  generatedCode += `    outdoor: local_sports_outdoor,  // 기존\n`;
  generatedCode += `    yoga: local_sports_yoga,        // 추가\n`;
  generatedCode += `    fitness: local_sports_fitness,  // 추가\n`;
  generatedCode += `    tennis: local_sports_tennis,    // 추가\n`;
  generatedCode += `    swim: local_sports_swim,        // 추가\n`;
  generatedCode += `  },\n`;
  generatedCode += `  luxury: {\n`;
  generatedCode += `    women: local_luxury_women, // 기존\n`;
  generatedCode += `  },\n`;
  generatedCode += `};\n`;
  generatedCode += `*/\n`;

  // 파일로 저장
  const outputPath = path.join(__dirname, 'merged_product_data.js');
  fs.writeFileSync(outputPath, generatedCode, 'utf8');

  console.log(`\n✅ 통합 완료! 결과 파일: ${outputPath}`);
  console.log(`📦 총 ${totalProducts}개 상품 데이터 변환 완료`);
  console.log(`\n다음 단계:`);
  console.log(`1. merged_product_data.js 파일을 확인하세요`);
  console.log(`2. ProductList.jsx 파일에 생성된 코드를 복사/붙여넣기 하세요`);
  console.log(`3. localByCategory 객체를 업데이트 가이드에 따라 수정하세요`);
}

// 스크립트 실행
try {
  main();
} catch (error) {
  console.error('❌ 오류 발생:', error.message);
  console.error(error.stack);
  process.exit(1);
}
