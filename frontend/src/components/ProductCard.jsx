import PropTypes from 'prop-types';
import "./ProductCard.css";

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