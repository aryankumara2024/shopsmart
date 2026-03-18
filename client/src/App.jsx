import { useState, useCallback, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SearchModal from './components/SearchModal';
import ProductDetail from './components/ProductDetail';
import Toast from './components/Toast';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import AboutPage from './pages/AboutPage';
import AuthPage from './pages/AuthPage';
import { useCart } from './context/CartContext';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [shopCategory, setShopCategory] = useState('all');
  const { toasts, removeToast } = useCart();

  const navigate = useCallback((page, category) => {
    if (page === 'shop' && category) {
      setShopCategory(category);
    } else if (page === 'shop') {
      setShopCategory('all');
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const viewProductDetails = useCallback((product) => {
    setSelectedProduct(product);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeProductDetails = useCallback(() => {
    setSelectedProduct(null);
    document.body.style.overflow = '';
  }, []);

  const openSearch = useCallback(() => {
    setSearchOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    document.body.style.overflow = '';
  }, []);

  // Keyboard shortcut: Cmd/Ctrl + K for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (searchOpen) closeSearch();
        else openSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen, openSearch, closeSearch]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={navigate} onViewDetails={viewProductDetails} />;
      case 'shop':
        return <ShopPage onViewDetails={viewProductDetails} initialCategory={shopCategory} />;
      case 'cart':
        return <CartPage onNavigate={navigate} onViewDetails={viewProductDetails} />;
      case 'wishlist':
        return <WishlistPage onNavigate={navigate} onViewDetails={viewProductDetails} />;
      case 'about':
        return <AboutPage onNavigate={navigate} />;
      case 'login':
        return <AuthPage isLogin={true} onNavigate={navigate} />;
      case 'register':
        return <AuthPage isLogin={false} onNavigate={navigate} />;
      default:
        return <HomePage onNavigate={navigate} onViewDetails={viewProductDetails} />;
    }
  };

  return (
    <>
      <Navbar
        currentPage={currentPage}
        onNavigate={navigate}
        onSearchOpen={openSearch}
      />

      <main>{renderPage()}</main>

      <Footer onNavigate={navigate} />

      <SearchModal
        isOpen={searchOpen}
        onClose={closeSearch}
        onViewDetails={viewProductDetails}
      />

      <ProductDetail
        product={selectedProduct}
        onClose={closeProductDetails}
        onNavigateShop={() => navigate('shop')}
      />

      <Toast toasts={toasts} removeToast={removeToast} />
    </>
  );
}

export default App;
