/**
 * ============================================================================
 * ProductCard.jsx - 상품 카드 컴포넌트
 * ============================================================================
 *
 * 【목적】
 * - 상품 정보를 카드 형태로 표시하는 재사용 가능한 컴포넌트
 * - 상품 목록, 그리드 레이아웃에서 사용
 * - PropTypes를 통한 타입 검증
 *
 * 【표시 정보】
 * - 상품 이미지
 * - 브랜드명
 * - 상품명
 * - 가격
 *
 * 【사용 사례】
 * - 홈 페이지의 신상품 섹션
 * - 카테고리 페이지의 상품 그리드
 * - 검색 결과 페이지
 * - 추천 상품 섹션
 *
 * 【Props 검증】
 * - PropTypes를 사용하여 필수 props 검증
 * - 가격/ID는 문자열/숫자 모두 허용
 *
 * @component
 * @author Claude Code
 * @since 2025-11-02
 */

import PropTypes from 'prop-types';
import "./ProductCard.css";

/**
 * ProductCard 함수형 컴포넌트
 *
 * @param {Object} props - 컴포넌트 props
 * @param {string|number} props.id - 상품 ID (필수)
 * @param {string} props.name - 상품명 (필수)
 * @param {string} [props.brand] - 브랜드명 (선택)
 * @param {string|number} props.price - 가격 (필수)
 * @param {string} props.img - 이미지 URL (필수)
 * @returns {JSX.Element} 상품 카드 UI
 *
 * @example
 * <ProductCard
 *   id="prod-001"
 *   name="베이직 티셔츠"
 *   brand="SSF SHOP"
 *   price="29000"
 *   img="/images/tshirt.jpg"
 * />
 */
function ProductCard({ id, name, brand, price, img }) {
  return (
    <div className="product-card">
      <img src={img} alt={name || "상품"} />
      <div className="product-info">
        <p className="brand">{brand}</p>
        <h4 className="name">{name}</h4>
        <p className="price">{price}</p>
      </div>
    </div>
  );
}

ProductCard.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  name: PropTypes.string.isRequired,
  brand: PropTypes.string,
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  img: PropTypes.string.isRequired,
};

export default ProductCard;
