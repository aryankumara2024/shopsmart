import { useState, useEffect, useRef } from 'react';
import Icon from './Icon';
import { products } from '../data/products';
import './SearchModal.css';

export default function SearchModal({ isOpen, onClose, onViewDetails }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = query.trim().length > 0
    ? products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="search-modal-backdrop animate-fade-in" onClick={onClose} id="search-modal">
      <div className="search-modal animate-fade-in-down" onClick={e => e.stopPropagation()}>
        <div className="search-modal__input-wrap">
          <Icon name="search" size={20} className="search-modal__icon" />
          <input
            ref={inputRef}
            type="text"
            className="search-modal__input"
            placeholder="Search products, categories..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            id="search-input"
          />
          <button className="search-modal__close btn btn-ghost btn-sm" onClick={onClose}>
            <kbd>ESC</kbd>
          </button>
        </div>

        {filtered.length > 0 && (
          <div className="search-modal__results">
            {filtered.map(product => (
              <button
                key={product.id}
                className="search-modal__result"
                onClick={() => { onViewDetails(product); onClose(); }}
                id={`search-result-${product.id}`}
              >
                <div className="search-modal__result-info">
                  <span className="search-modal__result-name">{product.name}</span>
                  <span className="search-modal__result-category">{product.category}</span>
                </div>
                <span className="search-modal__result-price">${product.price.toFixed(2)}</span>
              </button>
            ))}
          </div>
        )}

        {query.trim().length > 0 && filtered.length === 0 && (
          <div className="search-modal__empty">
            <Icon name="search" size={32} style={{ color: 'var(--color-text-tertiary)' }} />
            <p>No products found for "<strong>{query}</strong>"</p>
            <p className="search-modal__empty-hint">Try a different search term</p>
          </div>
        )}

        {query.trim().length === 0 && (
          <div className="search-modal__hints">
            <p className="search-modal__hints-label">Popular searches</p>
            <div className="search-modal__hints-tags">
              {['Headphones', 'Watch', 'Backpack', 'Shoes', 'Keyboard'].map(tag => (
                <button key={tag} className="search-modal__tag" onClick={() => setQuery(tag)}>
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
