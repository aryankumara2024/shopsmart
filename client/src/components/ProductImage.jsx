
const premiumImages = {
  headphones: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
  smartwatch: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80',
  backpack: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
  shoes: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
  speaker: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80',
  wallet: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80',
  keyboard: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80',
  tracker: 'https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?w=800&q=80',
  scarf: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80',
  lamp: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80',
  duffel: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
  sunglasses: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80',
  default: 'https://images.unsplash.com/photo-1600164318356-91f86cd3cbdb?w=800&q=80'
};

export function ProductImage({ image, name, className = '' }) {
  const imageUrl = premiumImages[image] || premiumImages.default;

  return (
    <div className={`product-image ${className}`} style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <img 
        src={imageUrl} 
        alt={name}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center'
        }}
      />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 40%)'
      }} />
    </div>
  );
}
