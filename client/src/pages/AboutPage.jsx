import Icon from '../components/Icon';
import './AboutPage.css';

export default function AboutPage({ onNavigate }) {
  return (
    <div className="about-page" id="about-page">
      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero__bg">
          <div className="about-hero__orb about-hero__orb--1" />
          <div className="about-hero__orb about-hero__orb--2" />
        </div>
        <div className="container about-hero__content">
          <span className="badge badge-accent">
            <Icon name="sparkles" size={14} />
            Our Story
          </span>
          <h1 className="about-hero__title">Crafting the Future<br/>of Online Shopping</h1>
          <p className="about-hero__subtitle">
            We believe shopping should be effortless, inspiring, and filled with products that genuinely elevate your life.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="about-values">
        <div className="container">
          <div className="about-values__grid">
            {[
              {
                icon: 'sparkles',
                title: 'Curated Quality',
                desc: 'Every product in our catalog is hand-selected by our team of experts. We test, evaluate, and only list items that meet our premium standards.'
              },
              {
                icon: 'shield',
                title: 'Trust & Security',
                desc: 'Your data is protected with enterprise-grade encryption. Shop with confidence knowing every transaction is 100% secure.'
              },
              {
                icon: 'truck',
                title: 'Lightning Delivery',
                desc: 'Free shipping on orders over $99. Most items arrive within 2-3 business days, because waiting isn\'t in style.'
              },
              {
                icon: 'refresh',
                title: 'Hassle-Free Returns',
                desc: 'Changed your mind? No problem. Return any item within 30 days for a full refund. No questions asked.'
              }
            ].map((value, i) => (
              <div key={value.title} className={`about-value-card animate-fade-in-up stagger-${i + 1}`}>
                <div className="about-value-card__icon">
                  <Icon name={value.icon} size={24} />
                </div>
                <h3 className="about-value-card__title">{value.title}</h3>
                <p className="about-value-card__desc">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="about-stats">
        <div className="container">
          <div className="about-stats__grid">
            {[
              { number: '50K+', label: 'Happy Customers' },
              { number: '12', label: 'Product Categories' },
              { number: '4.9★', label: 'Average Rating' },
              { number: '24/7', label: 'Customer Support' }
            ].map(stat => (
              <div key={stat.label} className="about-stat">
                <span className="about-stat__number">{stat.number}</span>
                <span className="about-stat__label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="container">
          <div className="about-cta__content">
            <div className="about-cta__orb" />
            <h2 className="about-cta__title">Ready to Start Shopping?</h2>
            <p className="about-cta__desc">
              Join 50,000+ customers who trust ShopSmart for their everyday essentials and extraordinary finds.
            </p>
            <div className="about-cta__actions">
              <button className="btn btn-primary btn-lg" onClick={() => onNavigate('shop')} id="about-shop-btn">
                <Icon name="shoppingBag" size={20} />
                Explore Collection
              </button>
              <button className="btn btn-secondary btn-lg" onClick={() => onNavigate('home')} id="about-home-btn">
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
