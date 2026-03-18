import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Star,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Filter,
  Check,
  Package,
  CreditCard,
  Truck,
  Shield,
  RefreshCw,
  Sparkles,
  ArrowRight,
  LogOut,
  MapPin,
  Clock,
  Trash2,
  Plus,
  Minus,
  Grid,
  Cpu,
  Gem,
  Footprints,
  Shirt,
  Home,
  ShoppingBag
} from 'lucide-react';

const iconMap = {
  search: Search,
  cart: ShoppingCart,
  heart: Heart,
  heartFilled: Heart,
  user: User,
  star: Star,
  starEmpty: Star,
  menu: Menu,
  close: X,
  x: X,
  chevronRight: ChevronRight,
  chevronLeft: ChevronLeft,
  chevronDown: ChevronDown,
  chevronUp: ChevronUp,
  filter: Filter,
  check: Check,
  package: Package,
  creditCard: CreditCard,
  truck: Truck,
  shield: Shield,
  refresh: RefreshCw,
  sparkles: Sparkles,
  arrowRight: ArrowRight,
  logout: LogOut,
  mapPin: MapPin,
  clock: Clock,
  trash: Trash2,
  plus: Plus,
  minus: Minus,
  grid: Grid,
  cpu: Cpu,
  gem: Gem,
  footprints: Footprints,
  shirt: Shirt,
  home: Home,
  shoppingBag: ShoppingBag
};

export default function Icon({ name, size = 24, className = '', ...props }) {
  const LucideIcon = iconMap[name];

  if (!LucideIcon) {
    console.warn(`Icon ${name} not found`);
    return <div className={`icon-placeholder ${className}`} style={{ width: size, height: size }} />;
  }

  // Handle special fill cases
  const isFilled = name === 'heartFilled' || name === 'star';
  const fillStyle = isFilled ? 'currentColor' : 'none';

  return (
    <LucideIcon
      size={size}
      className={`icon ${className}`}
      fill={fillStyle}
      {...props}
    />
  );
}
