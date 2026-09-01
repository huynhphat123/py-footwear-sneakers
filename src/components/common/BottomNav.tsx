import React from 'react';
import { useShop } from '../../context/ShopContext';
import {
  Home,
  Compass,
  Search,
  Heart,
  ShoppingBag,
  User as UserIcon,
} from 'lucide-react';

interface BottomNavProps {
  currentPage: string;
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentPage, onNavigate }) => {
  const {
    cartCount,
    wishlist,
    currentUser,
    setIsSearchOpen,
    setIsCartDrawerOpen,
    setIsAuthModalOpen,
    setAuthModalMode,
  } = useShop();

  const handleAccountClick = () => {
    if (currentUser) {
      onNavigate('profile');
    } else {
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
    }
  };

  const isHome = currentPage === 'home';
  const isProducts = currentPage === 'products' || currentPage === 'product-detail';
  const isProfile = currentPage === 'profile';

  return (
    <nav
      aria-label="Mobile Navigation Bar"
      className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-white/90 dark:bg-[#121212]/90 backdrop-blur-xl border-t border-neutral-200/80 dark:border-neutral-800/80 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_24px_rgba(0,0,0,0.4)] transition-colors duration-200"
    >
      <div className="max-w-lg mx-auto px-2 py-1.5 flex items-center justify-around">
        
        {/* 1. HOME */}
        <button
          id="bottom-nav-home-btn"
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
            isHome
              ? 'text-neutral-950 dark:text-white font-extrabold scale-105'
              : 'text-neutral-500 dark:text-neutral-400 font-medium hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          <div className="relative">
            <Home className={`w-5 h-5 transition-transform ${isHome ? 'stroke-[2.5]' : 'stroke-2'}`} />
            {isHome && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-neutral-950 dark:bg-white rounded-full" />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1">Trang chủ</span>
        </button>

        {/* 2. CATALOG / SHOP */}
        <button
          id="bottom-nav-shop-btn"
          onClick={() => onNavigate('products')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
            isProducts
              ? 'text-neutral-950 dark:text-white font-extrabold scale-105'
              : 'text-neutral-500 dark:text-neutral-400 font-medium hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          <div className="relative">
            <Compass className={`w-5 h-5 transition-transform ${isProducts ? 'stroke-[2.5]' : 'stroke-2'}`} />
            {isProducts && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-neutral-950 dark:bg-white rounded-full" />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1">Sản phẩm</span>
        </button>

        {/* 3. SEARCH MODAL TRIGGER */}
        <button
          id="bottom-nav-search-btn"
          onClick={() => setIsSearchOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-3 rounded-2xl text-neutral-500 dark:text-neutral-400 font-medium hover:text-neutral-800 dark:hover:text-neutral-200 transition-all"
        >
          <Search className="w-5 h-5 stroke-2" />
          <span className="text-[10px] tracking-tight mt-1">Tìm kiếm</span>
        </button>

        {/* 4. WISHLIST */}
        <button
          id="bottom-nav-wishlist-btn"
          onClick={() => onNavigate('profile', { tab: 'wishlist' })}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
            currentPage === 'profile'
              ? 'text-neutral-950 dark:text-white font-extrabold scale-105'
              : 'text-neutral-500 dark:text-neutral-400 font-medium hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          <div className="relative">
            <Heart className="w-5 h-5 stroke-2" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-2 min-w-[15px] h-[15px] bg-rose-500 text-white rounded-full text-[9px] font-extrabold flex items-center justify-center px-0.5 shadow-sm">
                {wishlist.length}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1">Yêu thích</span>
        </button>

        {/* 5. CART DRAWER TRIGGER */}
        <button
          id="bottom-nav-cart-btn"
          onClick={() => setIsCartDrawerOpen(true)}
          className="relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl text-neutral-500 dark:text-neutral-400 font-medium hover:text-neutral-800 dark:hover:text-neutral-200 transition-all"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 stroke-2" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 min-w-[15px] h-[15px] bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 rounded-full text-[9px] font-extrabold flex items-center justify-center px-0.5 shadow-sm">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1">Giỏ hàng</span>
        </button>

        {/* 6. ACCOUNT TRIGGER */}
        <button
          id="bottom-nav-account-btn"
          onClick={handleAccountClick}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
            isProfile
              ? 'text-neutral-950 dark:text-white font-extrabold scale-105'
              : 'text-neutral-500 dark:text-neutral-400 font-medium hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          <div className="relative">
            <UserIcon className="w-5 h-5 stroke-2" />
            {currentUser && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-[#121212]" />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1">
            {currentUser ? currentUser.name.split(' ')[0] : 'Cá nhân'}
          </span>
        </button>

      </div>
    </nav>
  );
};
