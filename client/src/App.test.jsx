import { render, screen } from '@testing-library/react';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { describe, it, expect, vi } from 'vitest';

describe('App', () => {
    it('renders ShopSmart title', () => {
        // Mock fetch
        globalThis.fetch = vi.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve([]) // Return an empty array to prevent `data.filter is not a function`
            })
        );

        render(
            <AuthProvider>
                <CartProvider>
                    <WishlistProvider>
                        <App />
                    </WishlistProvider>
                </CartProvider>
            </AuthProvider>
        );
        const linkElements = screen.getAllByText(/ShopSmart/i);
        expect(linkElements.length).toBeGreaterThan(0);
    });
});
