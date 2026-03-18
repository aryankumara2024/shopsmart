import { useState, useEffect } from 'react';
import Icon from '../components/Icon';
import ProductCard from '../components/ProductCard';
import { products as localProducts, categories } from '../data/products';
import './HomePage.css';

export default function HomePage({ onNavigate, onViewDetails }) {
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    // Top 4 best sellers/top rated
    const featuredItems = localProducts.filter(p => p.badge === 'Best Seller' || p.badge === 'Top Rated' || p.badge === 'New').slice(0, 4);
    if (featuredItems.length === 0) {
      setFeatured(localProducts.slice(0, 4));
    } else {
      setFeatured(featuredItems);
    }
    
    // Top 4 highest rating
    const trendingItems = [...localProducts].sort((a,b) => b.rating - a.rating).slice(0, 4);
    setTrending(trendingItems);
  }, []);

  return (
    <div className="home-page" id="home-page">
      {/* Hero Section */}
      <section className="hero" id="hero-section">
        <div className="hero__bg-effects">
          <div className="hero__orb hero__orb--1" />
          <div className="hero__orb hero__orb--2" />
          <div className="hero__orb hero__orb--3" />
          <div className="hero__grid-pattern" />
        </div>

        <div className="container hero__content">
          <div className="hero__text animate-fade-in-up">
            <span className="badge badge-accent hero__badge">
              <Icon name="sparkles" size={14} />
              New Season Collection 2026
            </span>
            <h1 className="hero__title">
              Discover Products<br />
              <span className="hero__title-accent">You'll Love</span>
            </h1>
            <p className="hero__subtitle">
              Curated premium products for the modern lifestyle. From cutting-edge tech to timeless accessories — find your next favorite thing.
            </p>
            <div className="hero__actions">
              <button className="btn btn-primary btn-lg" onClick={() => onNavigate('shop')} id="hero-shop-btn">
                <Icon name="shoppingBag" size={20} />
                Shop Collection
              </button>
              <button className="btn btn-secondary btn-lg" onClick={() => onNavigate('about')} id="hero-learn-btn">
                Learn More
                <Icon name="arrowRight" size={18} />
              </button>
            </div>

            <div className="hero__stats">
              <div className="hero__stat">
                <span className="hero__stat-number">50K+</span>
                <span className="hero__stat-label">Happy Customers</span>
              </div>
              <div className="hero__stat-divider" />
              <div className="hero__stat">
                <span className="hero__stat-number">4.9</span>
                <span className="hero__stat-label">Average Rating</span>
              </div>
              <div className="hero__stat-divider" />
              <div className="hero__stat">
                <span className="hero__stat-number">Free</span>
                <span className="hero__stat-label">Shipping Over $99</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="trust-bar" id="trust-bar">
        <div className="container">
          <div className="trust-bar__items">
            {[
              { icon: 'truck', label: 'Free Shipping', desc: 'On orders over $99' },
              { icon: 'shield', label: 'Secure Payment', desc: '100% protected' },
              { icon: 'refresh', label: 'Easy Returns', desc: '30-day guarantee' },
              { icon: 'sparkles', label: 'Premium Quality', desc: 'Curated selection' }
            ].map(item => (
              <div key={item.label} className="trust-bar__item">
                <div className="trust-bar__icon">
                  <Icon name={item.icon} size={22} />
                </div>
                <div>
                  <p className="trust-bar__item-label">{item.label}</p>
                  <p className="trust-bar__item-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section" id="categories-section">
        <div className="container">
          <div className="section__header">
            <div>
              <h2 className="section__title">Shop by Category</h2>
              <p className="section__subtitle">Explore our curated collections</p>
            </div>
          </div>
          <div className="categories-grid">
            {categories.filter(c => c.id !== 'all').map((cat, i) => (
              <button
                key={cat.id}
                className={`category-card animate-fade-in-up stagger-${i + 1}`}
                onClick={() => onNavigate('shop', cat.id)}
                id={`category-${cat.id}`}
              >
                <div className="category-card__icon">
                  <Icon name={cat.icon} size={28} />
                </div>
                <span className="category-card__name">{cat.name}</span>
                <Icon name="arrowRight" size={16} className="category-card__arrow" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section" id="featured-section">
        <div className="container">
          <div className="section__header">
            <div>
              <h2 className="section__title">Featured Products</h2>
              <p className="section__subtitle">Handpicked for you</p>
            </div>
            <button className="btn btn-secondary" onClick={() => onNavigate('shop')} id="view-all-featured">
              View All
              <Icon name="arrowRight" size={16} />
            </button>
          </div>
          <div className="products-grid">
            {featured.length > 0 ? featured.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={onViewDetails}
                style={{ animationDelay: `${i * 0.08}s` }}
              />
            )) : <p>Loading...</p>}
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="promo-banner" id="promo-banner">
        <div className="container">
          <div className="promo-banner__content">
            <div className="promo-banner__orb" />
            <div className="promo-banner__text">
              <span className="badge badge-warning">Limited Time</span>
              <h2 className="promo-banner__title">Winter Sale — Up to 40% Off</h2>
              <p className="promo-banner__desc">
                Don't miss our biggest sale of the season. Premium products at unbeatable prices.
              </p>
              <button className="btn btn-primary btn-lg" onClick={() => onNavigate('shop')} id="promo-shop-btn">
                Shop the Sale
                <Icon name="arrowRight" size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="section" id="trending-section">
        <div className="container">
          <div className="section__header">
            <div>
              <h2 className="section__title">Trending Now</h2>
              <p className="section__subtitle">What everyone's loving</p>
            </div>
            <button className="btn btn-secondary" onClick={() => onNavigate('shop')} id="view-all-trending">
              View All
              <Icon name="arrowRight" size={16} />
            </button>
          </div>
          <div className="products-grid">
            {trending.length > 0 ? trending.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={onViewDetails}
                style={{ animationDelay: `${i * 0.08}s` }}
              />
            )) : <p>Loading...</p>}
          </div>
        </div>
      </section>
    </div>
  );
}
