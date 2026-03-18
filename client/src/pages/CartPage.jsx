import Icon from '../components/Icon';
import { useCart } from '../context/CartContext';
import { ProductImage } from '../components/ProductImage';
import './CartPage.css';

export default function CartPage({ onNavigate, onViewDetails }) {
  const { cart, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="cart-page cart-page--empty" id="cart-page">
        <div className="container">
          <div className="cart-empty">
            <div className="cart-empty__icon">
              <Icon name="shoppingBag" size={48} />
            </div>
            <h2 className="cart-empty__title">Your cart is empty</h2>
            <p className="cart-empty__desc">Looks like you haven&apos;t added anything yet. Start exploring our collection!</p>
            <button className="btn btn-primary btn-lg" onClick={() => onNavigate('shop')} id="cart-browse-btn">
              <Icon name="shoppingBag" size={20} />
              Browse Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  const shipping = cartTotal >= 99 ? 0 : 9.99;
  const tax = cartTotal * 0.08;
  const total = cartTotal + shipping + tax;

  return (
    <div className="cart-page" id="cart-page">
      <div className="container">
        <div className="cart-page__header">
          <h1 className="cart-page__title">Shopping Cart</h1>
          <span className="cart-page__count">{cart.length} {cart.length === 1 ? 'item' : 'items'}</span>
        </div>

        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items" id="cart-items">
            {cart.map(item => (
              <div key={item.id} className="cart-item card animate-fade-in" id={`cart-item-${item.id}`}>
                <div className="cart-item__image" onClick={() => onViewDetails(item)}>
                  <ProductImage image={item.image} name={item.name} />
                </div>

                <div className="cart-item__info">
                  <p className="cart-item__category">{item.category}</p>
                  <h3 className="cart-item__name" onClick={() => onViewDetails(item)}>{item.name}</h3>

                  <div className="cart-item__bottom">
                    <div className="cart-item__quantity">
                      <button
                        className="btn btn-icon btn-secondary btn-sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        id={`cart-qty-dec-${item.id}`}
                      >
                        <Icon name="minus" size={14} />
                      </button>
                      <span className="cart-item__qty-value">{item.quantity}</span>
                      <button
                        className="btn btn-icon btn-secondary btn-sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        id={`cart-qty-inc-${item.id}`}
                      >
                        <Icon name="plus" size={14} />
                      </button>
                    </div>

                    <span className="cart-item__price">${(item.price * item.quantity).toFixed(2)}</span>

                    <button
                      className="btn btn-icon btn-ghost cart-item__remove"
                      onClick={() => removeFromCart(item.id)}
                      aria-label="Remove item"
                      id={`cart-remove-${item.id}`}
                    >
                      <Icon name="trash" size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <button className="btn btn-ghost cart-items__clear" onClick={clearCart} id="cart-clear-btn">
              <Icon name="trash" size={16} />
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="cart-summary card" id="cart-summary">
            <h3 className="cart-summary__title">Order Summary</h3>

            <div className="cart-summary__rows">
              <div className="cart-summary__row">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="cart-summary__row">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'cart-summary__free' : ''}>
                  {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="cart-summary__row">
                <span>Tax (est.)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="cart-summary__divider" />
              <div className="cart-summary__row cart-summary__row--total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {shipping === 0 && (
              <div className="cart-summary__badge">
                <Icon name="truck" size={16} />
                <span>You&apos;ve qualified for free shipping!</span>
              </div>
            )}

            {shipping > 0 && (
              <div className="cart-summary__progress">
                <p className="cart-summary__progress-text">
                  Add ${(99 - cartTotal).toFixed(2)} more for free shipping
                </p>
                <div className="cart-summary__progress-bar">
                  <div
                    className="cart-summary__progress-fill"
                    style={{ width: `${Math.min(100, (cartTotal / 99) * 100)}%` }}
                  />
                </div>
              </div>
            )}

            <button className="btn btn-primary btn-lg cart-summary__checkout" id="checkout-btn">
              <Icon name="shield" size={18} />
              Proceed to Checkout
            </button>

            <div className="cart-summary__trust">
              <Icon name="shield" size={14} />
              <span>Secure checkout · SSL encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
