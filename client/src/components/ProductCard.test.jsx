import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProductCard from './ProductCard';
import { CartProvider } from '../context/CartContext';
import { WishlistProvider } from '../context/WishlistContext';

const mockProduct = {
  id: 'test-prod-1',
  name: 'Test Headphones',
  category: 'Electronics',
  price: 49.99,
  originalPrice: 79.99,
  rating: 4.5,
  reviews: 1200,
  badge: null,
  image: null,
};

function renderCard(props = {}) {
  const defaults = {
    product: mockProduct,
    onViewDetails: vi.fn(),
  };
  return render(
    <CartProvider>
      <WishlistProvider>
        <ProductCard {...defaults} {...props} />
      </WishlistProvider>
    </CartProvider>
  );
}

describe('ProductCard', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders product name', () => {
    renderCard();
    expect(screen.getByText('Test Headphones')).toBeInTheDocument();
  });

  it('renders product category', () => {
    renderCard();
    expect(screen.getByText('Electronics')).toBeInTheDocument();
  });

  it('renders current price', () => {
    renderCard();
    expect(screen.getByText('$49.99')).toBeInTheDocument();
  });

  it('renders original price when provided', () => {
    renderCard();
    expect(screen.getByText('$79.99')).toBeInTheDocument();
  });

  it('renders discount percentage badge when originalPrice present and no badge', () => {
    renderCard({ product: { ...mockProduct, badge: null } });
    // Discount = round((79.99 - 49.99) / 79.99 * 100) = 38%
    expect(screen.getByText(/-\d+%/)).toBeInTheDocument();
  });

  it('renders custom badge instead of discount when badge is set', () => {
    renderCard({ product: { ...mockProduct, badge: 'Sale' } });
    expect(screen.getByText('Sale')).toBeInTheDocument();
  });

  it('renders the Add button', () => {
    renderCard();
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
  });

  it('calls onViewDetails when product name is clicked', () => {
    const onViewDetails = vi.fn();
    renderCard({ onViewDetails });
    fireEvent.click(screen.getByText('Test Headphones'));
    expect(onViewDetails).toHaveBeenCalledWith(mockProduct);
  });

  it('calls onViewDetails when image area is clicked', () => {
    const onViewDetails = vi.fn();
    renderCard({ onViewDetails });
    // Click the image wrapper div
    const card = document.querySelector('.product-card__image-wrap');
    fireEvent.click(card);
    expect(onViewDetails).toHaveBeenCalledWith(mockProduct);
  });

  it('wishlist button is rendered with correct aria-label', () => {
    renderCard();
    expect(screen.getByLabelText('Add to wishlist')).toBeInTheDocument();
  });

  it('toggles wishlist state when wishlist button is clicked', () => {
    renderCard();
    const wishlistBtn = screen.getByLabelText('Add to wishlist');
    fireEvent.click(wishlistBtn);
    expect(screen.getByLabelText('Remove from wishlist')).toBeInTheDocument();
  });
});
