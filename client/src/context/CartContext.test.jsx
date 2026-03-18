import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { CartProvider, useCart } from './CartContext';

const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;

const mockProduct = {
  id: 'prod-1',
  name: 'Widget Pro',
  price: 29.99,
};

describe('CartContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with an empty cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.cart).toHaveLength(0);
    expect(result.current.cartCount).toBe(0);
    expect(result.current.cartTotal).toBe(0);
  });

  it('addToCart adds a new product', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addToCart(mockProduct);
    });
    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].id).toBe('prod-1');
    expect(result.current.cart[0].quantity).toBe(1);
  });

  it('addToCart increments quantity for existing product', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addToCart(mockProduct);
      result.current.addToCart(mockProduct, 2);
    });
    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].quantity).toBe(3);
  });

  it('cartCount reflects total items across products', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addToCart(mockProduct, 3);
      result.current.addToCart({ id: 'prod-2', name: 'Gadget', price: 9.99 }, 2);
    });
    expect(result.current.cartCount).toBe(5);
  });

  it('cartTotal calculates correct total', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addToCart(mockProduct, 2); // 2 * 29.99 = 59.98
    });
    expect(result.current.cartTotal).toBeCloseTo(59.98);
  });

  it('removeFromCart removes the correct product', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addToCart(mockProduct);
      result.current.addToCart({ id: 'prod-2', name: 'Gadget', price: 9.99 });
    });
    act(() => {
      result.current.removeFromCart('prod-1');
    });
    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].id).toBe('prod-2');
  });

  it('updateQuantity updates item quantity', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addToCart(mockProduct);
    });
    act(() => {
      result.current.updateQuantity('prod-1', 10);
    });
    expect(result.current.cart[0].quantity).toBe(10);
  });

  it('updateQuantity removes item if quantity < 1', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addToCart(mockProduct);
    });
    act(() => {
      result.current.updateQuantity('prod-1', 0);
    });
    expect(result.current.cart).toHaveLength(0);
  });

  it('clearCart empties the cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addToCart(mockProduct, 5);
    });
    act(() => {
      result.current.clearCart();
    });
    expect(result.current.cart).toHaveLength(0);
    expect(result.current.cartCount).toBe(0);
  });

  it('throws error when useCart is used outside CartProvider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useCart())).toThrow(
      'useCart must be used within a CartProvider'
    );
    consoleSpy.mockRestore();
  });
});
