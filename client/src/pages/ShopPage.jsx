import { useState, useMemo } from 'react';
import Icon from '../components/Icon';
import ProductCard from '../components/ProductCard';
import { products, categories } from '../data/products';
import './ShopPage.css';

export default function ShopPage({ onViewDetails, initialCategory = 'all' }) {
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState('all');

  const filtered = useMemo(() => {
    let result = [...products];

    // Filter by category
    if (activeCategory !== 'all') {
      result = result.filter(p => p.category === activeCategory);
    }

    // Filter by price range
    if (priceRange === 'under100') result = result.filter(p => p.price < 100);
    else if (priceRange === '100to200') result = result.filter(p => p.price >= 100 && p.price <= 200);
    else if (priceRange === 'over200') result = result.filter(p => p.price > 200);

    // Sort
    switch (sortBy) {
      case 'price-low': result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      case 'popular': result.sort((a, b) => b.reviews - a.reviews); break;
      default: break;
    }

    return result;
  }, [activeCategory, sortBy, priceRange]);

  return (
    <div className="shop-page" id="shop-page">
      {/* Header */}
      <div className="shop-page__header">
        <div className="container">
          <h1 className="shop-page__title">Shop All Products</h1>
          <p className="shop-page__subtitle">
            Discover our collection of {products.length} premium products
          </p>
        </div>
      </div>

      <div className="container">
        {/* Filters Bar */}
        <div className="shop-filters" id="shop-filters">
          <div className="shop-filters__categories">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`shop-filters__cat-btn ${activeCategory === cat.id ? 'shop-filters__cat-btn--active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
                id={`filter-cat-${cat.id}`}
              >
                {cat.name}
                {activeCategory === cat.id && (
                  <span className="shop-filters__cat-count">{filtered.length}</span>
                )}
              </button>
            ))}
          </div>

          <div className="shop-filters__controls">
            <div className="shop-filters__select-wrap">
              <Icon name="filter" size={16} className="shop-filters__select-icon" />
              <select
                className="shop-filters__select"
                value={priceRange}
                onChange={e => setPriceRange(e.target.value)}
                id="filter-price"
              >
                <option value="all">All Prices</option>
                <option value="under100">Under $100</option>
                <option value="100to200">$100 - $200</option>
                <option value="over200">Over $200</option>
              </select>
            </div>

            <div className="shop-filters__select-wrap">
              <select
                className="shop-filters__select"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                id="filter-sort"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        {filtered.length > 0 ? (
          <div className="products-grid shop-page__grid">
            {filtered.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={onViewDetails}
                style={{ animationDelay: `${i * 0.05}s` }}
              />
            ))}
          </div>
        ) : (
          <div className="shop-page__empty">
            <Icon name="package" size={48} style={{ color: 'var(--color-text-tertiary)' }} />
            <h3>No products found</h3>
            <p>Try adjusting your filters to find what you're looking for.</p>
            <button className="btn btn-secondary" onClick={() => { setActiveCategory('all'); setPriceRange('all'); }}>
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
