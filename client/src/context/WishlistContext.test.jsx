import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { WishlistProvider, useWishlist } from './WishlistContext';

const wrapper = ({ children }) => <WishlistProvider>{children}</WishlistProvider>;

describe('WishlistContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with an empty wishlist', () => {
    const { result } = renderHook(() => useWishlist(), { wrapper });
    expect(result.current.wishlist).toHaveLength(0);
  });

  it('toggleWishlist adds a product that is not in the wishlist', () => {
    const { result } = renderHook(() => useWishlist(), { wrapper });
    act(() => {
      result.current.toggleWishlist('prod-1');
    });
    expect(result.current.wishlist).toContain('prod-1');
  });

  it('toggleWishlist removes a product already in the wishlist', () => {
    const { result } = renderHook(() => useWishlist(), { wrapper });
    act(() => {
      result.current.toggleWishlist('prod-1');
    });
    act(() => {
      result.current.toggleWishlist('prod-1');
    });
    expect(result.current.wishlist).not.toContain('prod-1');
  });

  it('isInWishlist returns true for wishlisted product', () => {
    const { result } = renderHook(() => useWishlist(), { wrapper });
    act(() => {
      result.current.toggleWishlist('prod-2');
    });
    expect(result.current.isInWishlist('prod-2')).toBe(true);
  });

  it('isInWishlist returns false for non-wishlisted product', () => {
    const { result } = renderHook(() => useWishlist(), { wrapper });
    expect(result.current.isInWishlist('prod-999')).toBe(false);
  });

  it('can manage multiple wishlist items independently', () => {
    const { result } = renderHook(() => useWishlist(), { wrapper });
    act(() => {
      result.current.toggleWishlist('prod-1');
      result.current.toggleWishlist('prod-2');
      result.current.toggleWishlist('prod-3');
    });
    expect(result.current.wishlist).toHaveLength(3);

    act(() => {
      result.current.toggleWishlist('prod-2'); // remove only prod-2
    });
    expect(result.current.wishlist).toHaveLength(2);
    expect(result.current.isInWishlist('prod-1')).toBe(true);
    expect(result.current.isInWishlist('prod-2')).toBe(false);
    expect(result.current.isInWishlist('prod-3')).toBe(true);
  });

  it('throws error when useWishlist used outside WishlistProvider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useWishlist())).toThrow(
      'useWishlist must be used within a WishlistProvider'
    );
    consoleSpy.mockRestore();
  });
});
