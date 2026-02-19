// Product image generator — creates beautiful gradient + illustration SVGs
// This eliminates the need for actual product images

const productGradients = {
  headphones: { bg: ['#1a1a3e', '#2d1b69'], accent: '#8b5cf6', shape: 'circle' },
  smartwatch: { bg: ['#0f172a', '#1e293b'], accent: '#06b6d4', shape: 'rounded' },
  backpack: { bg: ['#1c1917', '#292524'], accent: '#a16207', shape: 'arch' },
  shoes: { bg: ['#0f172a', '#1e1b4b'], accent: '#22c55e', shape: 'wave' },
  speaker: { bg: ['#0f172a', '#164e63'], accent: '#06b6d4', shape: 'circle' },
  wallet: { bg: ['#18181b', '#27272a'], accent: '#d97706', shape: 'rect' },
  keyboard: { bg: ['#1a1a2e', '#16213e'], accent: '#ec4899', shape: 'rect' },
  tracker: { bg: ['#0a0a0f', '#1e1b4b'], accent: '#8b5cf6', shape: 'rounded' },
  scarf: { bg: ['#1c1917', '#44403c'], accent: '#7c3aed', shape: 'wave' },
  lamp: { bg: ['#0f172a', '#1e293b'], accent: '#f59e0b', shape: 'triangle' },
  duffel: { bg: ['#0a0a0f', '#1e3a5f'], accent: '#3b82f6', shape: 'arch' },
  sunglasses: { bg: ['#18181b', '#27272a'], accent: '#f97316', shape: 'oval' },
};

function getShape(shape, accent, opacity = 0.3) {
  switch (shape) {
    case 'circle':
      return `<circle cx="150" cy="140" r="60" fill="${accent}" opacity="${opacity}"/>
              <circle cx="150" cy="140" r="40" fill="${accent}" opacity="${opacity + 0.15}"/>
              <circle cx="150" cy="140" r="20" fill="${accent}" opacity="${opacity + 0.3}"/>`;
    case 'rounded':
      return `<rect x="100" y="95" width="100" height="100" rx="25" fill="${accent}" opacity="${opacity}"/>
              <rect x="115" y="110" width="70" height="70" rx="18" fill="${accent}" opacity="${opacity + 0.15}"/>`;
    case 'arch':
      return `<path d="M90 200 Q90 100 150 80 Q210 100 210 200" fill="${accent}" opacity="${opacity}"/>
              <path d="M110 200 Q110 120 150 105 Q190 120 190 200" fill="${accent}" opacity="${opacity + 0.15}"/>`;
    case 'wave':
      return `<path d="M50 160 Q100 100 150 140 Q200 180 250 120" stroke="${accent}" stroke-width="4" fill="none" opacity="${opacity + 0.3}"/>
              <path d="M50 180 Q100 120 150 160 Q200 200 250 140" stroke="${accent}" stroke-width="3" fill="none" opacity="${opacity + 0.2}"/>
              <circle cx="150" cy="140" r="30" fill="${accent}" opacity="${opacity}"/>`;
    case 'rect':
      return `<rect x="85" y="105" width="130" height="80" rx="12" fill="${accent}" opacity="${opacity}"/>
              <rect x="100" y="118" width="100" height="54" rx="8" fill="${accent}" opacity="${opacity + 0.15}"/>
              <rect x="115" y="130" width="70" height="30" rx="5" fill="${accent}" opacity="${opacity + 0.25}"/>`;
    case 'triangle':
      return `<path d="M150 80 L210 200 L90 200 Z" fill="${accent}" opacity="${opacity}"/>
              <path d="M150 110 L190 195 L110 195 Z" fill="${accent}" opacity="${opacity + 0.15}"/>`;
    case 'oval':
      return `<ellipse cx="150" cy="140" rx="80" ry="45" fill="${accent}" opacity="${opacity}"/>
              <ellipse cx="150" cy="140" rx="55" ry="30" fill="${accent}" opacity="${opacity + 0.15}"/>`;
    default:
      return `<circle cx="150" cy="140" r="50" fill="${accent}" opacity="${opacity}"/>`;
  }
}

export function ProductImage({ image, name, size = 'md', className = '' }) {
  const config = productGradients[image] || productGradients.headphones;
  const sizeMap = { sm: 200, md: 300, lg: 400 };
  const viewSize = sizeMap[size] || 300;

  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 280" width="${viewSize}" height="${Math.round(viewSize * 0.93)}">
      <defs>
        <linearGradient id="bg-${image}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${config.bg[0]}"/>
          <stop offset="100%" style="stop-color:${config.bg[1]}"/>
        </linearGradient>
        <radialGradient id="glow-${image}" cx="50%" cy="40%" r="50%">
          <stop offset="0%" style="stop-color:${config.accent};stop-opacity:0.2"/>
          <stop offset="100%" style="stop-color:${config.accent};stop-opacity:0"/>
        </radialGradient>
      </defs>
      <rect width="300" height="280" rx="20" fill="url(#bg-${image})"/>
      <rect width="300" height="280" rx="20" fill="url(#glow-${image})"/>
      ${getShape(config.shape, config.accent)}
      <circle cx="50" cy="50" r="80" fill="${config.accent}" opacity="0.03"/>
      <circle cx="250" cy="230" r="60" fill="${config.accent}" opacity="0.04"/>
    </svg>
  `;

  const dataUrl = `data:image/svg+xml,${encodeURIComponent(svgContent)}`;

  return (
    <img
      src={dataUrl}
      alt={name}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: 'inherit',
      }}
      loading="lazy"
    />
  );
}
