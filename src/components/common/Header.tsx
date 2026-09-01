import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useShop } from '../../context/ShopContext';
import { ThemeToggle } from './ThemeToggle';
import {
  Search,
  User as UserIcon,
  ShoppingBag,
  Heart,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Truck,
  MapPin,
  Gift,
  Flame,
  Sparkles,
  Clock,
  LogOut,
  LayoutDashboard,
  Package,
  Layers,
} from 'lucide-react';

interface HeaderProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
  onOpenAdmin?: () => void;
  currentPage?: string;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, onOpenAdmin, currentPage = 'home' }) => {
  const {
    cartCount,
    wishlist,
    currentUser,
    isAdmin,
    logout,
    setIsCartDrawerOpen,
    setIsSearchOpen,
    setIsAuthModalOpen,
    setAuthModalMode,
    categories,
    brands,
  } = useShop();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(true);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const accountRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const catRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setAccountDropdownOpen(false);
      }
      if (brandRef.current && !brandRef.current.contains(event.target as Node)) {
        setBrandDropdownOpen(false);
      }
      if (catRef.current && !catRef.current.contains(event.target as Node)) {
        setCategoryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full transition-colors duration-200">

      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-neutral-950 text-white text-xs py-2 px-4 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden sm:flex items-center gap-6 text-neutral-400">
            <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer" onClick={() => onNavigate('stores')}>
              <MapPin className="w-3.5 h-3.5 text-neutral-300" /> Hệ thống 4 cửa hàng
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-neutral-300" /> 100% Chính Hãng - Bảo hành 1 năm
            </span>
          </div>

          <div className="mx-auto sm:mx-0 flex items-center gap-2 font-medium tracking-wide">
            <Truck className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Miễn phí ship cho đơn hàng từ <strong className="text-white">3 triệu</strong></span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-neutral-400">
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-neutral-300" /> Giờ làm việc: <strong className="text-white">09:00 - 17:30</strong></span>
            <span className="text-neutral-700">|</span>
            <a href="mailto:phatht@tcr.vn" className="hover:text-white transition-colors">phatht@tcr.vn</a>
            <span className="text-neutral-700">|</span>
            <button
              id="topbar-size-guide-btn"
              onClick={() => onNavigate('blog', { slug: 'bang-huong-dan-chon-size-giay-chuan' })}
              className="hover:text-white transition-colors"
            >
              Bảng chọn size
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER BAR */}
      <div className={`bg-white/95 dark:bg-[#121212]/95 backdrop-blur-md transition-all duration-300 border-b ${isScrolled
          ? 'border-neutral-200 dark:border-neutral-800 shadow-md py-3'
          : 'border-neutral-100 dark:border-neutral-800/80 py-4'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">

          {/* Mobile hamburger button */}
          <div className="flex items-center lg:hidden">
            <button
              id="mobile-hamburger-btn"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMobileMenuOpen(true);
              }}
              className="p-2 -ml-2 rounded-xl text-neutral-800 dark:text-neutral-100 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 active:scale-95 transition-all touch-manipulation cursor-pointer"
              aria-label="Open Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* STORE LOGO */}
          <div className="flex items-center">
            <button
              id="header-brand-logo-btn"
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 rounded-xl flex items-center justify-center font-extrabold text-xl tracking-tighter group-hover:scale-105 transition-transform shadow-md">
                PY
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-neutral-950 dark:text-white font-['Space_Grotesk'] leading-none">
                  PY
                </span>
                <span className="text-[9px] uppercase tracking-widest text-neutral-500 dark:text-neutral-400 font-semibold mt-0.5">
                  Footwear & Sneakers
                </span>
              </div>
            </button>
          </div>

          {/* DESKTOP NAVIGATION MENU */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2 text-sm font-semibold tracking-wide uppercase">

            {/* SALE ITEM */}
            <button
              id="nav-sale-btn"
              onClick={() => onNavigate('products', { filter: 'sale' })}
              className="flex items-center gap-1.5 px-3 py-2 transition-colors text-rose-600 dark:text-rose-400 hover:text-rose-500 dark:hover:text-rose-300"
            >
              <Flame className="w-4 h-4 text-rose-600 dark:text-rose-400 animate-bounce" />
              <span>SALE</span>
              <span className="text-[10px] bg-rose-600 text-white px-1.5 py-0.5 rounded font-bold uppercase">HOT</span>
            </button>

            {/* HÀNG MỚI */}
            <button
              id="nav-new-arrivals-btn"
              onClick={() => onNavigate('products', { filter: 'new' })}
              className="px-3 py-2 text-neutral-800 dark:text-neutral-200 hover:text-rose-600 dark:hover:text-rose-400 transition-colors duration-150"
            >
              HÀNG MỚI
            </button>

            {/* THƯƠNG HIỆU (Hover Dropdown) */}
            <div
              className="relative group"
              ref={brandRef}
              onMouseEnter={() => { setBrandDropdownOpen(true); setCategoryDropdownOpen(false); }}
              onMouseLeave={() => setBrandDropdownOpen(false)}
            >
              <button
                id="nav-brands-dropdown-btn"
                onClick={() => onNavigate('products')}
                className="flex items-center gap-1 px-3 py-2 transition-colors duration-150 text-neutral-800 dark:text-neutral-200 group-hover:text-rose-600 dark:group-hover:text-rose-400"
              >
                <span>THƯƠNG HIỆU</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${brandDropdownOpen ? 'rotate-180 text-rose-500' : 'text-neutral-500 group-hover:text-rose-400'}`} />
              </button>

              {brandDropdownOpen && (
                <div className="absolute top-full left-0 w-80 bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-2xl border border-neutral-100 dark:border-neutral-800 p-3 mt-2 grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  {brands.map(brand => (
                    <button
                      key={brand.id}
                      id={`nav-brand-${brand.slug}-btn`}
                      onClick={() => {
                        setBrandDropdownOpen(false);
                        onNavigate('products', { brand: brand.slug });
                      }}
                      className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/60 text-left transition-all duration-150 group"
                    >
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="w-8 h-8 rounded-lg object-cover border border-neutral-200 dark:border-neutral-700 bg-white"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="text-xs font-bold text-neutral-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">{brand.name}</div>
                        <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-normal">{brand.productCount || 6}+ mẫu</div>
                      </div>
                    </button>
                  ))}
                  <div className="col-span-2 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-center">
                    <button
                      id="nav-all-brands-btn"
                      onClick={() => {
                        setBrandDropdownOpen(false);
                        onNavigate('products');
                      }}
                      className="text-xs font-bold text-neutral-900 dark:text-neutral-200 hover:underline inline-flex items-center gap-1"
                    >
                      Xem tất cả thương hiệu &rarr;
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* DANH MỤC (Hover Dropdown) */}
            <div
              className="relative group"
              ref={catRef}
              onMouseEnter={() => { setCategoryDropdownOpen(true); setBrandDropdownOpen(false); }}
              onMouseLeave={() => setCategoryDropdownOpen(false)}
            >
              <button
                id="nav-categories-dropdown-btn"
                onClick={() => onNavigate('products')}
                className="flex items-center gap-1 px-3 py-2 transition-colors duration-150 text-neutral-800 dark:text-neutral-200 group-hover:text-rose-600 dark:group-hover:text-rose-400"
              >
                <span>DANH MỤC</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${categoryDropdownOpen ? 'rotate-180 text-rose-500' : 'text-neutral-500 group-hover:text-rose-400'}`} />
              </button>

              {categoryDropdownOpen && (
                <div className="absolute top-full left-0 w-96 bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-2xl border border-neutral-100 dark:border-neutral-800 p-4 mt-2 grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      id={`nav-cat-${cat.slug}-btn`}
                      onClick={() => {
                        setCategoryDropdownOpen(false);
                        onNavigate('products', { category: cat.slug });
                      }}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/60 text-left transition-all duration-150 group"
                    >
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-10 h-10 rounded-lg object-cover border border-neutral-200 dark:border-neutral-700 shrink-0 bg-white"
                        referrerPolicy="no-referrer"
                      />
                      <div className="truncate">
                        <div className="text-xs font-bold text-neutral-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors truncate">{cat.name}</div>
                        <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-normal line-clamp-1">{cat.description}</div>
                      </div>
                    </button>
                  ))}
                  <div className="col-span-2 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-center">
                    <button
                      id="nav-all-categories-btn"
                      onClick={() => {
                        setCategoryDropdownOpen(false);
                        onNavigate('products');
                      }}
                      className="text-xs font-bold text-neutral-900 dark:text-neutral-200 hover:underline"
                    >
                      Tất cả danh mục sản phẩm &rarr;
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* THÀNH VIÊN */}
            <button
              id="nav-membership-btn"
              onClick={() => onNavigate('membership')}
              className="px-3 py-2 text-neutral-800 dark:text-neutral-200 hover:text-rose-600 dark:hover:text-rose-400 transition-colors duration-150"
            >
              THÀNH VIÊN
            </button>

            {/* GIFT CARD */}
            <button
              id="nav-giftcard-btn"
              onClick={() => onNavigate('giftcard')}
              className="flex items-center gap-1.5 px-3 py-2 text-neutral-800 dark:text-neutral-200 hover:text-rose-600 dark:hover:text-rose-400 transition-colors duration-150"
            >
              <Gift className="w-4 h-4 text-amber-500" />
              <span>GIFT CARD</span>
            </button>

            {/* CỬA HÀNG */}
            <button
              id="nav-stores-btn"
              onClick={() => onNavigate('stores')}
              className="px-3 py-2 text-neutral-800 dark:text-neutral-200 hover:text-rose-600 dark:hover:text-rose-400 transition-colors duration-150"
            >
              CỬA HÀNG
            </button>
          </nav>

          {/* RIGHT ACTION ICONS */}
          <div className="flex items-center space-x-1 sm:space-x-1.5">

            {/* DARK / LIGHT MODE TOGGLE BUTTON */}
            <ThemeToggle id="header-theme-toggle-btn" />

            {/* SEARCH ICON */}
            <button
              id="header-search-btn"
              onClick={() => setIsSearchOpen(true)}
              className="p-2 sm:p-2.5 rounded-full text-neutral-700 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/80 transition-colors relative"
              aria-label="Search"
              title="Tìm kiếm giày"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* WISHLIST ICON */}
            <button
              id="header-wishlist-btn"
              onClick={() => onNavigate('profile', { tab: 'wishlist' })}
              className="p-2 sm:p-2.5 rounded-full text-neutral-700 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/80 transition-colors relative"
              aria-label="Wishlist"
              title="Danh sách yêu thích"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-sm">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* DIRECT ADMIN PANEL SHORTCUT BUTTON */}
            {isAdmin && (
              <button
                id="header-direct-admin-panel-btn"
                onClick={() => onOpenAdmin ? onOpenAdmin() : onNavigate('admin')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-xl font-extrabold text-xs shadow-md transition-all hover:scale-105"
                title="Truy cập Trang Quản Trị"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Admin Panel</span>
              </button>
            )}

            {/* USER / ACCOUNT ICON & DROPDOWN */}
            <div className="relative" ref={accountRef}>
              <button
                id="header-account-btn"
                onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                className={`flex items-center gap-2 transition-all duration-150 ${currentUser
                    ? 'pl-1 pr-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500 hover:shadow-sm bg-white dark:bg-neutral-900'
                    : 'p-2 sm:p-2.5 rounded-full text-neutral-700 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/80'
                  }`}
                aria-label="Account"
              >
                {currentUser ? (
                  <>
                    {/* Avatar circle with initial */}
                    {currentUser.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-7 h-7 rounded-full object-cover border-2 border-neutral-200 dark:border-neutral-700 shrink-0"
                      />
                    ) : (
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-extrabold text-sm shrink-0 ${isAdmin
                          ? 'bg-amber-500 text-white'
                          : 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950'
                        }`}>
                        {currentUser.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {/* Name */}
                    <span className="hidden sm:block text-xs font-bold text-neutral-900 dark:text-white max-w-[80px] truncate">
                      {currentUser.name.split(' ').slice(-1)[0]}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-neutral-500 transition-transform duration-150 ${accountDropdownOpen ? 'rotate-180' : ''}`} />
                  </>
                ) : (
                  <UserIcon className="w-5 h-5" />
                )}
              </button>

              {accountDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-2xl border border-neutral-100 dark:border-neutral-800 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {currentUser ? (
                    <div className="p-3 border-b border-neutral-100 dark:border-neutral-800">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-bold flex items-center justify-center shrink-0">
                          {currentUser.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="truncate">
                          <div className="font-bold text-neutral-900 dark:text-white text-sm truncate">{currentUser.name}</div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{currentUser.email}</div>
                          <div className="inline-block px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-[10px] font-semibold rounded uppercase mt-0.5">
                            {currentUser.role === 'admin' ? 'Quản Trị Viên' : 'Khách Hàng Thân Thiết'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 border-b border-neutral-100 dark:border-neutral-800">
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-2">Đăng nhập để theo dõi đơn hàng và nhận ưu đãi riêng.</p>
                      <div className="flex gap-2">
                        <button
                          id="dropdown-login-btn"
                          onClick={() => {
                            setAccountDropdownOpen(false);
                            setAuthModalMode('login');
                            setIsAuthModalOpen(true);
                          }}
                          className="flex-1 py-2 text-xs font-bold text-white bg-neutral-950 dark:bg-white dark:text-neutral-950 rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
                        >
                          Đăng nhập
                        </button>
                        <button
                          id="dropdown-register-btn"
                          onClick={() => {
                            setAccountDropdownOpen(false);
                            setAuthModalMode('register');
                            setIsAuthModalOpen(true);
                          }}
                          className="flex-1 py-2 text-xs font-bold text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                        >
                          Đăng ký
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="py-1">
                    {/* ADMIN DASHBOARD SHORTCUT */}
                    {isAdmin && (
                      <button
                        id="dropdown-admin-panel-btn"
                        onClick={() => {
                          setAccountDropdownOpen(false);
                          if (onOpenAdmin) onOpenAdmin();
                          else onNavigate('admin');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-amber-950 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors mb-1"
                      >
                        <LayoutDashboard className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        <span>Trang Quản Trị (Admin Panel)</span>
                      </button>
                    )}

                    {currentUser && (
                      <>
                        <button
                          id="dropdown-my-profile-btn"
                          onClick={() => {
                            setAccountDropdownOpen(false);
                            onNavigate('profile');
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800/80 rounded-xl transition-colors text-left"
                        >
                          <UserIcon className="w-4 h-4 text-neutral-500" />
                          <span>Thông tin tài khoản</span>
                        </button>

                        <button
                          id="dropdown-my-orders-btn"
                          onClick={() => {
                            setAccountDropdownOpen(false);
                            onNavigate('profile', { tab: 'orders' });
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800/80 rounded-xl transition-colors text-left"
                        >
                          <Package className="w-4 h-4 text-neutral-500" />
                          <span>Lịch sử đơn hàng</span>
                        </button>

                        <button
                          id="dropdown-my-wishlist-btn"
                          onClick={() => {
                            setAccountDropdownOpen(false);
                            onNavigate('profile', { tab: 'wishlist' });
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800/80 rounded-xl transition-colors text-left"
                        >
                          <Heart className="w-4 h-4 text-neutral-500" />
                          <span>Danh sách yêu thích ({wishlist.length})</span>
                        </button>
                      </>
                    )}


                    {currentUser && (
                      <div className="pt-1 mt-1 border-t border-neutral-100 dark:border-neutral-800">
                        <button
                          id="dropdown-logout-btn"
                          onClick={() => {
                            setAccountDropdownOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Đăng xuất</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* CART ICON WITH BADGE */}
            <button
              id="header-cart-btn"
              onClick={() => setIsCartDrawerOpen(true)}
              className="p-2 sm:p-2.5 rounded-full bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all flex items-center gap-2 shadow-sm"
              aria-label="Shopping Cart"
              title="Giỏ hàng"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs font-bold px-1 min-w-[1.25rem] text-center">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. MOBILE SLIDE-OUT MENU DRAWER (Mounted directly to document.body via Portal) */}
      {mobileMenuOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[99999] lg:hidden flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-neutral-950/75 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide Drawer Content */}
          <div className="relative ml-0 flex flex-col w-[85%] max-w-xs bg-white dark:bg-[#141414] h-full shadow-2xl p-5 overflow-y-auto border-r border-neutral-200 dark:border-neutral-800 animate-in slide-in-from-left duration-300 z-10">
            
            {/* Header / Brand & Close */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800 shrink-0">
              <div
                className="flex items-center gap-2.5 cursor-pointer"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('home');
                }}
              >
                <div className="w-9 h-9 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 rounded-xl flex items-center justify-center font-extrabold text-base shadow-sm">
                  PY
                </div>
                <div>
                  <div className="font-extrabold text-base text-neutral-950 dark:text-white font-['Space_Grotesk'] leading-none">
                    PY SNEAKERS
                  </div>
                  <div className="text-[9px] uppercase tracking-widest text-neutral-400 font-semibold mt-0.5">
                    Official Store
                  </div>
                </div>
              </div>
              <button
                id="mobile-close-btn"
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Profile Card / Login Prompt in Drawer */}
            <div className="py-4 border-b border-neutral-100 dark:border-neutral-800 shrink-0">
              {currentUser ? (
                <div className="p-3 bg-neutral-50 dark:bg-neutral-900/90 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 font-extrabold text-sm flex items-center justify-center shadow-sm">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-neutral-950 dark:text-white truncate">
                      {currentUser.name}
                    </div>
                    <div className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                      {currentUser.email}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                        {currentUser.role === 'admin' ? 'Quản trị viên' : 'Hội viên'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 bg-gradient-to-br from-neutral-900 to-neutral-950 text-white rounded-2xl shadow-md space-y-2.5">
                  <div>
                    <div className="text-xs font-extrabold">Chào mừng bạn đến với PY!</div>
                    <div className="text-[11px] text-neutral-300 mt-0.5">Đăng nhập để xem ưu đãi và tích điểm hội viên</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      id="mob-login-btn"
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setAuthModalMode('login');
                        setIsAuthModalOpen(true);
                      }}
                      className="py-2 bg-white text-neutral-950 font-bold text-xs rounded-xl shadow-sm hover:bg-neutral-100 transition-colors text-center cursor-pointer"
                    >
                      Đăng nhập
                    </button>
                    <button
                      id="mob-register-btn"
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setAuthModalMode('register');
                        setIsAuthModalOpen(true);
                      }}
                      className="py-2 bg-neutral-800 text-white font-bold text-xs rounded-xl hover:bg-neutral-700 transition-colors text-center cursor-pointer"
                    >
                      Đăng ký
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Theme Toggle Section */}
            <div className="py-3 border-b border-neutral-100 dark:border-neutral-800 shrink-0">
              <ThemeToggle id="mobile-theme-toggle-btn" variant="expanded" />
            </div>

            {/* Mobile Nav Links */}
            <div className="py-3 flex flex-col space-y-1">
              <button
                id="mob-nav-sale-btn"
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('products', { filter: 'sale' });
                }}
                className="flex items-center justify-between py-2.5 px-3 rounded-xl font-bold text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <Flame className="w-4 h-4 text-rose-600 dark:text-rose-400 animate-pulse" />
                  <span>SĂN SALE KHỦNG</span>
                </span>
                <span className="text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded-full font-extrabold">-40%</span>
              </button>

              <button
                id="mob-nav-new-btn"
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('products', { filter: 'new' });
                }}
                className="flex items-center gap-2.5 py-2.5 px-3 rounded-xl font-bold text-xs text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-left cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>HÀNG MỚI VỀ</span>
              </button>

              <button
                id="mob-nav-bestseller-btn"
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('products', { filter: 'bestseller' });
                }}
                className="flex items-center gap-2.5 py-2.5 px-3 rounded-xl font-bold text-xs text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-left cursor-pointer"
              >
                <Layers className="w-4 h-4 text-sky-500" />
                <span>BÁN CHẠY NHẤT</span>
              </button>

              {/* Categories Accordion */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setMobileCategoriesOpen(prev => !prev)}
                  className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl font-bold text-xs text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-left cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    <Package className="w-4 h-4 text-neutral-500" />
                    <span>DANH MỤC SẢN PHẨM</span>
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileCategoriesOpen ? 'rotate-180' : ''}`} />
                </button>

                {mobileCategoriesOpen && (
                  <div className="pl-4 pr-1 py-1 space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onNavigate('products');
                      }}
                      className="w-full text-left py-2 px-3 rounded-lg text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-between"
                    >
                      <span>Tất cả sản phẩm</span>
                      <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                    </button>
                    {categories.map(c => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          onNavigate('products', { category: c.slug });
                        }}
                        className="w-full text-left py-2 px-3 rounded-lg text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-between"
                      >
                        <span>{c.name}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                id="mob-nav-membership-btn"
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('membership');
                }}
                className="flex items-center gap-2.5 py-2.5 px-3 rounded-xl font-semibold text-xs text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-left cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>HỘI VIÊN & ĐẶC QUYỀN</span>
              </button>

              <button
                id="mob-nav-giftcard-btn"
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('giftcard');
                }}
                className="flex items-center gap-2.5 py-2.5 px-3 rounded-xl font-semibold text-xs text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-left cursor-pointer"
              >
                <Gift className="w-4 h-4 text-amber-500" />
                <span>THẺ QUÀ TẶNG GIFT CARD</span>
              </button>

              <button
                id="mob-nav-stores-btn"
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('stores');
                }}
                className="flex items-center gap-2.5 py-2.5 px-3 rounded-xl font-semibold text-xs text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-left cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-neutral-500" />
                <span>HỆ THỐNG 4 CỬA HÀNG</span>
              </button>

              <button
                id="mob-nav-blog-btn"
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('blog');
                }}
                className="flex items-center gap-2.5 py-2.5 px-3 rounded-xl font-semibold text-xs text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-left cursor-pointer"
              >
                <Clock className="w-4 h-4 text-neutral-500" />
                <span>TIN TỨC & BẢNG CHỌN SIZE</span>
              </button>
            </div>

            {/* Popular Brands Shortcuts */}
            <div className="py-3 border-t border-neutral-100 dark:border-neutral-800 shrink-0">
              <div className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-2">
                Thương hiệu nổi bật
              </div>
              <div className="grid grid-cols-4 gap-2">
                {brands.slice(0, 4).map(b => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onNavigate('products', { brand: b.slug });
                    }}
                    className="p-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 flex flex-col items-center hover:border-neutral-950 dark:hover:border-white transition-all cursor-pointer"
                  >
                    <img
                      src={b.logo}
                      alt={b.name}
                      className="w-6 h-6 object-contain rounded"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-[10px] font-bold text-neutral-800 dark:text-neutral-200 mt-1 truncate w-full text-center">
                      {b.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* User Account Drawer Actions */}
            {currentUser && (
              <div className="mt-auto pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-2 shrink-0">
                {isAdmin && (
                  <button
                    id="mob-admin-btn"
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (onOpenAdmin) onOpenAdmin();
                      else onNavigate('admin');
                    }}
                    className="w-full py-2.5 bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 text-xs font-bold rounded-xl flex items-center justify-center gap-2 border border-amber-200/50 dark:border-amber-800/50 cursor-pointer"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Trang Quản Trị (Admin)</span>
                  </button>
                )}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onNavigate('profile');
                    }}
                    className="py-2 px-3 bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-semibold rounded-xl text-center hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                  >
                    Hồ sơ cá nhân
                  </button>
                  <button
                    id="mob-logout-btn"
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="py-2 px-3 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-semibold rounded-xl text-center hover:bg-rose-100 transition-colors cursor-pointer"
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>,
        document.body
      )}
    </header>
  );
};
