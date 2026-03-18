import { useState } from 'react';
import Icon from './Icon';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ProductImage } from './ProductImage';
import './ProductDetail.css';

export default function ProductDetail({ product, onClose }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(0);

  if (!product) return null;

  const wishlisted = isInWishlist(product.id);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div className="detail-backdrop animate-fade-in" onClick={onClose} id="product-detail-modal">
      <div className="detail-modal animate-scale-in" onClick={e => e.stopPropagation()}>
        {/* Close Button */}
        <button className="detail__close btn btn-icon btn-ghost" onClick={onClose} id="detail-close-btn">
          <Icon name="x" size={22} />
        </button>

        <div className="detail__grid">
          {/* Image Section */}
          <div className="detail__image-section">
            <div className="detail__image-main">
              <ProductImage image={product.image} name={product.name} />
            </div>
          </div>

          {/* Info Section */}
          <div className="detail__info-section">
            {/* Category & Badge */}
            <div className="detail__top-meta">
              <span className="detail__category">{product.category}</span>
              {product.badge && (
                <span className={`badge ${product.badge === 'Sale' ? 'badge-warning' : product.badge === 'Eco' ? 'badge-success' : 'badge-accent'}`}>
                  {product.badge}
                </span>
              )}
            </div>

            <h2 className="detail__name" id="detail-product-name">{product.name}</h2>

            {/* Rating */}
            <div className="detail__rating">
              <div className="detail__stars">
                {[1, 2, 3, 4, 5].map(i => (
                  <Icon
                    key={i}
                    name={i <= Math.round(product.rating) ? 'star' : 'starEmpty'}
                    size={16}
                    style={{ color: i <= Math.round(product.rating) ? 'var(--color-star)' : 'var(--color-text-tertiary)' }}
                  />
                ))}
              </div>
              <span className="detail__rating-text">{product.rating} · {product.reviews.toLocaleString()} reviews</span>
            </div>

            {/* Price */}
            <div className="detail__price-row">
              <span className="detail__price">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <>
                  <span className="detail__original-price">${product.originalPrice.toFixed(2)}</span>
                  <span className="badge badge-warning">Save {discount}%</span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="detail__description">{product.description}</p>

            {/* Features */}
            <div className="detail__features">
              {product.features.map(feat => (
                <div key={feat} className="detail__feature">
                  <Icon name="check" size={14} style={{ color: 'var(--color-success)' }} />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* Color Selector */}
            <div className="detail__colors">
              <span className="detail__label">Color</span>
              <div className="detail__color-options">
                {product.colors.map((color, idx) => (
                  <button
                    key={idx}
                    className={`detail__color-swatch ${selectedColor === idx ? 'detail__color-swatch--active' : ''}`}
                    style={{ background: color === '#transparent' ? 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.03))' : color }}
                    onClick={() => setSelectedColor(idx)}
                    aria-label={`Color option ${idx + 1}`}
                    id={`color-swatch-${idx}`}
                  />
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="detail__quantity-row">
              <span className="detail__label">Quantity</span>
              <div className="detail__quantity-control">
                <button
                  className="btn btn-icon btn-secondary"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  id="qty-decrease"
                >
                  <Icon name="minus" size={16} />
                </button>
                <span className="detail__quantity-value">{quantity}</span>
                <button
                  className="btn btn-icon btn-secondary"
                  onClick={() => setQuantity(quantity + 1)}
                  id="qty-increase"
                >
                  <Icon name="plus" size={16} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="detail__actions">
              <button className="btn btn-primary btn-lg detail__add-btn" onClick={handleAddToCart} id="detail-add-to-cart">
                <Icon name="shoppingBag" size={20} />
                Add to Cart · ${(product.price * quantity).toFixed(2)}
              </button>
              <button
                className={`btn btn-secondary btn-icon detail__wish-btn ${wishlisted ? 'detail__wish-btn--active' : ''}`}
                onClick={() => toggleWishlist(product.id)}
                aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                id="detail-wishlist-btn"
                style={{ width: '52px', height: '52px' }}
              >
                <Icon name={wishlisted ? 'heartFilled' : 'heart'} size={20} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="detail__trust">
              <div className="detail__trust-item">
                <Icon name="truck" size={16} />
                <span>Free Shipping</span>
              </div>
              <div className="detail__trust-item">
                <Icon name="shield" size={16} />
                <span>2-Year Warranty</span>
              </div>
              <div className="detail__trust-item">
                <Icon name="refresh" size={16} />
                <span>30-Day Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
