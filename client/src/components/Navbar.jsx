import { useState, useEffect } from 'react';
import Icon from './Icon';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar({ currentPage, onNavigate, onSearchOpen }) {
  const { cartCount } = useCart();
  const { user, logoutContext } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Shop' },
    { id: 'about', label: 'About' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} id="main-nav">
      <div className="navbar__inner container">
        {/* Logo */}
        <button className="navbar__logo" onClick={() => onNavigate('home')} id="nav-logo">
          <span className="navbar__logo-icon">
            <Icon name="sparkles" size={22} />
          </span>
          <span className="navbar__logo-text">ShopSmart</span>
        </button>

        {/* Desktop Nav Links */}
        <div className="navbar__links">
          {navLinks.map(link => (
            <button
              key={link.id}
              className={`navbar__link ${currentPage === link.id ? 'navbar__link--active' : ''}`}
              onClick={() => onNavigate(link.id)}
              id={`nav-link-${link.id}`}
            >
              {link.label}
              {currentPage === link.id && <span className="navbar__link-indicator" />}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="navbar__actions">
          <button
            className="btn btn-icon btn-ghost navbar__action-btn"
            onClick={onSearchOpen}
            aria-label="Search"
            id="nav-search-btn"
          >
            <Icon name="search" size={20} />
          </button>

          {user ? (
            <div className="navbar__user-menu" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '0.5rem' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                Hi, {user.username || 'User'}
              </span>
              <button
                className="btn btn-icon btn-ghost navbar__action-btn"
                onClick={() => {
                  logoutContext();
                  onNavigate('home');
                }}
                aria-label="Logout"
                title="Logout"
                id="nav-logout-btn"
              >
                <Icon name="x" size={20} />
              </button>
            </div>
          ) : (
            <button
              className="btn btn-icon btn-ghost navbar__action-btn"
              onClick={() => onNavigate('login')}
              aria-label="Account"
              id="nav-account-btn"
            >
              <Icon name="user" size={20} />
            </button>
          )}

          <button
            className="btn btn-icon btn-ghost navbar__action-btn"
            onClick={() => onNavigate('wishlist')}
            aria-label="Wishlist"
            id="nav-wishlist-btn"
          >
            <Icon name="heart" size={20} />
          </button>

          <button
            className="navbar__cart-btn btn btn-ghost"
            onClick={() => onNavigate('cart')}
            aria-label="Shopping Cart"
            id="nav-cart-btn"
          >
            <Icon name="shoppingBag" size={20} />
            {cartCount > 0 && (
              <span className="navbar__cart-badge animate-scale-in">{cartCount}</span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="btn btn-icon btn-ghost navbar__mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
            id="nav-mobile-toggle"
          >
            <Icon name={mobileMenuOpen ? 'x' : 'menu'} size={22} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="navbar__mobile-menu animate-fade-in-down" id="mobile-menu">
          {navLinks.map(link => (
            <button
              key={link.id}
              className={`navbar__mobile-link ${currentPage === link.id ? 'navbar__mobile-link--active' : ''}`}
              onClick={() => { onNavigate(link.id); setMobileMenuOpen(false); }}
              id={`mobile-nav-${link.id}`}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
