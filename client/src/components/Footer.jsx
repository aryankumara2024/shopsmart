import Icon from './Icon';
import './Footer.css';

export default function Footer({ onNavigate }) {
  return (
    <footer className="footer" id="site-footer">
      <div className="container">
        {/* Top Section */}
        <div className="footer__top">
          <div className="footer__brand">
            <div className="footer__logo">
              <span className="footer__logo-icon">
                <Icon name="sparkles" size={20} />
              </span>
              <span className="footer__logo-text">ShopSmart</span>
            </div>
            <p className="footer__tagline">
              Curating premium products for the modern lifestyle. Quality you can trust, design you&apos;ll love.
            </p>
            <div className="footer__socials">
              {['@', 'in', 'f', 'yt'].map(s => (
                <button key={s} className="footer__social-btn" aria-label={`Social ${s}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="footer__links-grid">
            <div className="footer__links-col">
              <h4 className="footer__links-title">Shop</h4>
              <button className="footer__link" onClick={() => onNavigate('shop')}>All Products</button>
              <button className="footer__link" onClick={() => onNavigate('shop')}>Electronics</button>
              <button className="footer__link" onClick={() => onNavigate('shop')}>Accessories</button>
              <button className="footer__link" onClick={() => onNavigate('shop')}>New Arrivals</button>
            </div>
            <div className="footer__links-col">
              <h4 className="footer__links-title">Company</h4>
              <button className="footer__link" onClick={() => onNavigate('about')}>About Us</button>
              <button className="footer__link" onClick={() => onNavigate('about')}>Careers</button>
              <button className="footer__link" onClick={() => onNavigate('about')}>Press</button>
              <button className="footer__link" onClick={() => onNavigate('about')}>Blog</button>
            </div>
            <div className="footer__links-col">
              <h4 className="footer__links-title">Support</h4>
              <button className="footer__link" onClick={() => onNavigate('about')}>Help Center</button>
              <button className="footer__link" onClick={() => onNavigate('about')}>Shipping</button>
              <button className="footer__link" onClick={() => onNavigate('about')}>Returns</button>
              <button className="footer__link" onClick={() => onNavigate('about')}>Contact</button>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="footer__newsletter">
          <div className="footer__newsletter-info">
            <Icon name="mail" size={20} style={{ color: 'var(--color-accent-primary-hover)' }} />
            <div>
              <p className="footer__newsletter-title">Stay in the loop</p>
              <p className="footer__newsletter-desc">Get 10% off your first order and early access to new drops.</p>
            </div>
          </div>
          <form className="footer__newsletter-form" onSubmit={e => e.preventDefault()}>
            <input type="email" className="input footer__newsletter-input" placeholder="Enter your email" id="newsletter-email" />
            <button type="submit" className="btn btn-primary" id="newsletter-submit">Subscribe</button>
          </form>
        </div>

        {/* Bottom */}
        <div className="footer__bottom">
          <p className="footer__copyright">© 2026 ShopSmart. All rights reserved.</p>
          <div className="footer__bottom-links">
            <button className="footer__bottom-link">Privacy Policy</button>
            <button className="footer__bottom-link">Terms of Service</button>
            <button className="footer__bottom-link">Cookies</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
