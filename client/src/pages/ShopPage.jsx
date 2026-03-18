import { useState, useEffect } from 'react';
import Icon from '../components/Icon';
import ProductCard from '../components/ProductCard';
import { categories as localCategories } from '../data/products';
import './ShopPage.css';

const API_URL = 'http://localhost:5001/api';

export default function ShopPage({ onViewDetails, initialCategory = 'all' }) {
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState('all');
  
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([{ id: 'all', name: 'All Products' }]);
  const [loading, setLoading] = useState(true);

  // Load Categories (Mock)
  useEffect(() => {
    const cats = localCategories.map(c => ({ 
      id: c.id, 
      name: c.name 
    }));
    const uniqueCats = cats.filter(c => c.id !== 'all');
    setCategories([{ id: 'all', name: 'All Products' }, ...uniqueCats]);
  }, []);

  // Fetch all products from API
  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/products`)
      .then(res => res.json())
      .then(data => {
        setAllProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }, []);

  // Filter Products locally when filters change or products are loaded
  useEffect(() => {
    let filtered = [...allProducts];

    // Filter category
    if (activeCategory !== 'all') {
      filtered = filtered.filter(p => p.category && p.category.toLowerCase() === activeCategory.toLowerCase());
    }

    // Filter price
    if (priceRange === 'under100') {
      filtered = filtered.filter(p => p.price <= 99.99);
    } else if (priceRange === '100to200') {
      filtered = filtered.filter(p => p.price >= 100 && p.price <= 200);
    } else if (priceRange === 'over200') {
      filtered = filtered.filter(p => p.price > 200);
    }

    // Sort
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'popular') {
      filtered.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
    }

    setProducts(filtered);
  }, [activeCategory, sortBy, priceRange, allProducts]);

  return (
    <div className="shop-page" id="shop-page">
      {/* Header */}
      <div className="shop-page__header">
        <div className="container">
          <h1 className="shop-page__title">Shop All Products</h1>
          <p className="shop-page__subtitle">
            Discover our collection of premium products
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
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--color-text-secondary)' }}>
            Loading products...
          </div>
        ) : products.length > 0 ? (
          <div className="products-grid shop-page__grid">
            {products.map((product, i) => (
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
