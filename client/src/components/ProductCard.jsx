import Icon from './Icon';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ProductImage } from './ProductImage';
import './ProductCard.css';

export default function ProductCard({ product, onViewDetails, style = {} }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const wishlisted = isInWishlist(product.id);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="product-card card animate-fade-in-up" style={style} id={`product-card-${product.id}`}>
      {/* Image Area */}
      <div className="product-card__image-wrap" onClick={() => onViewDetails(product)}>
        <ProductImage image={product.image} name={product.name} />

        {/* Badges */}
        <div className="product-card__badges">
          {product.badge && (
            <span className={`badge ${product.badge === 'Sale' ? 'badge-warning' : product.badge === 'Eco' ? 'badge-success' : 'badge-accent'}`}>
              {product.badge}
            </span>
          )}
          {discount && !product.badge && (
            <span className="badge badge-warning">-{discount}%</span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          className={`product-card__wishlist-btn ${wishlisted ? 'product-card__wishlist-btn--active' : ''}`}
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          id={`wishlist-btn-${product.id}`}
        >
          <Icon name={wishlisted ? 'heartFilled' : 'heart'} size={18} />
        </button>

        {/* Quick View Overlay */}
        <div className="product-card__overlay">
          <button className="btn btn-secondary btn-sm" onClick={() => onViewDetails(product)}>
            <Icon name="eye" size={16} />
            Quick View
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="product-card__info">
        <p className="product-card__category">{product.category}</p>
        <h3 className="product-card__name" onClick={() => onViewDetails(product)}>
          {product.name}
        </h3>

        {/* Rating */}
        <div className="product-card__rating">
          <div className="product-card__stars">
            {[1, 2, 3, 4, 5].map(i => (
              <Icon
                key={i}
                name={i <= Math.round(product.rating) ? 'star' : 'starEmpty'}
                size={14}
                style={{ color: i <= Math.round(product.rating) ? 'var(--color-star)' : 'var(--color-text-tertiary)' }}
              />
            ))}
          </div>
          <span className="product-card__rating-text">
            {product.rating} ({product.reviews.toLocaleString()})
          </span>
        </div>

        {/* Price + Add to Cart */}
        <div className="product-card__footer">
          <div className="product-card__price-block">
            <span className="product-card__price">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="product-card__original-price">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          <button
            className="product-card__add-btn btn btn-primary btn-sm"
            onClick={() => addToCart(product)}
            id={`add-to-cart-${product.id}`}
          >
            <Icon name="plus" size={16} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
