import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Navbar from './Navbar';
import { CartProvider } from '../context/CartContext';
import { WishlistProvider } from '../context/WishlistContext';

// Wrap with required providers
function renderNavbar(props = {}) {
  const defaults = {
    currentPage: 'home',
    onNavigate: vi.fn(),
    onSearchOpen: vi.fn(),
  };
  return render(
    <CartProvider>
      <WishlistProvider>
        <Navbar {...defaults} {...props} />
      </WishlistProvider>
    </CartProvider>
  );
}

describe('Navbar', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders ShopSmart logo', () => {
    renderNavbar();
    expect(screen.getByText('ShopSmart')).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    renderNavbar();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Shop')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('calls onNavigate with "home" when logo is clicked', () => {
    const onNavigate = vi.fn();
    renderNavbar({ onNavigate });
    fireEvent.click(screen.getByRole('button', { name: /shopsmart/i }));
    expect(onNavigate).toHaveBeenCalledWith('home');
  });

  it('calls onNavigate with correct page when nav link is clicked', () => {
    const onNavigate = vi.fn();
    renderNavbar({ onNavigate });
    fireEvent.click(screen.getByText('Shop'));
    expect(onNavigate).toHaveBeenCalledWith('shop');
  });

  it('calls onSearchOpen when search button is clicked', () => {
    const onSearchOpen = vi.fn();
    renderNavbar({ onSearchOpen });
    fireEvent.click(screen.getByLabelText('Search'));
    expect(onSearchOpen).toHaveBeenCalled();
  });

  it('calls onNavigate with "wishlist" when wishlist button clicked', () => {
    const onNavigate = vi.fn();
    renderNavbar({ onNavigate });
    fireEvent.click(screen.getByLabelText('Wishlist'));
    expect(onNavigate).toHaveBeenCalledWith('wishlist');
  });

  it('calls onNavigate with "cart" when cart button clicked', () => {
    const onNavigate = vi.fn();
    renderNavbar({ onNavigate });
    fireEvent.click(screen.getByLabelText('Shopping Cart'));
    expect(onNavigate).toHaveBeenCalledWith('cart');
  });

  it('highlights current active page link', () => {
    renderNavbar({ currentPage: 'shop' });
    const shopLink = screen.getByText('Shop').closest('button');
    expect(shopLink).toHaveClass('navbar__link--active');
  });

  it('toggles mobile menu open and closed', () => {
    renderNavbar();
    const menuToggle = screen.getByLabelText('Menu');
    // Mobile menu starts closed
    expect(screen.queryByRole('button', { name: 'home' })).not.toBeInTheDocument();
    // Open mobile menu
    fireEvent.click(menuToggle);
    expect(screen.getByText('Home', { selector: '.navbar__mobile-link' })).toBeInTheDocument();
  });
});
