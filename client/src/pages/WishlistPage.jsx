import Icon from '../components/Icon';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';
import { useWishlist } from '../context/WishlistContext';
import './WishlistPage.css';

export default function WishlistPage({ onNavigate, onViewDetails }) {
  const { wishlist } = useWishlist();

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  if (wishlistProducts.length === 0) {
    return (
      <div className="wishlist-page wishlist-page--empty" id="wishlist-page">
        <div className="container">
          <div className="wishlist-empty">
            <div className="wishlist-empty__icon">
              <Icon name="heart" size={48} />
            </div>
            <h2 className="wishlist-empty__title">Your wishlist is empty</h2>
            <p className="wishlist-empty__desc">Save your favorite items here to shop later.</p>
            <button className="btn btn-primary btn-lg" onClick={() => onNavigate('shop')} id="wishlist-browse-btn">
              <Icon name="sparkles" size={20} />
              Explore Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page" id="wishlist-page">
      <div className="container">
        <div className="wishlist-page__header">
          <h1 className="wishlist-page__title">My Wishlist</h1>
          <span className="wishlist-page__count">{wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'}</span>
        </div>

        <div className="products-grid wishlist-page__grid">
          {wishlistProducts.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetails={onViewDetails}
              style={{ animationDelay: `${i * 0.08}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
