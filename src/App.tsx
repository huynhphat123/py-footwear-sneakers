import React, { useState, useEffect } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { Toast } from './components/common/Toast';
import { CartDrawer } from './components/common/CartDrawer';
import { SearchModal } from './components/common/SearchModal';
import { QuickViewModal } from './components/common/QuickViewModal';
import { SizeGuideModal } from './components/common/SizeGuideModal';
import { AuthModal } from './components/common/AuthModal';
import { BackToTop } from './components/common/BackToTop';
import { BottomNav } from './components/common/BottomNav';

// Pages
import { HomePage } from './pages/HomePage';
import { ProductListPage } from './pages/ProductListPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { VNPayPaymentPage } from './pages/VNPayPaymentPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { StoresPage } from './pages/StoresPage';
import { MembershipPage } from './pages/MembershipPage';
import { GiftCardPage } from './pages/GiftCardPage';
import { BlogListPage } from './pages/BlogListPage';
import { BlogDetailPage } from './pages/BlogDetailPage';

// Admin
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminCouponsPage } from './pages/admin/AdminCouponsPage';

// Helper: Convert Browser URL path & query string to App Page & Params
const parseUrlToState = (pathname: string, search: string): { page: string; params: Record<string, any> } => {
  const cleanPath = pathname.toLowerCase().replace(/\/+$/, '') || '/';
  const searchParams = new URLSearchParams(search);
  const queryObj: Record<string, any> = {};
  searchParams.forEach((val, key) => {
    queryObj[key] = val;
  });

  if (cleanPath === '/' || cleanPath === '/home' || cleanPath === '/trang-chu') {
    return { page: 'home', params: queryObj };
  }
  if (cleanPath === '/hang-moi' || cleanPath === '/hangmoi' || cleanPath === '/new') {
    return { page: 'products', params: { ...queryObj, filter: 'new' } };
  }
  if (cleanPath === '/sale' || cleanPath === '/san-sale' || cleanPath === '/giam-gia') {
    return { page: 'products', params: { ...queryObj, filter: 'sale' } };
  }
  if (cleanPath === '/ban-chay' || cleanPath === '/bestseller' || cleanPath === '/ban-chay-nhat') {
    return { page: 'products', params: { ...queryObj, filter: 'bestseller' } };
  }
  if (cleanPath.startsWith('/danh-muc/') || cleanPath.startsWith('/danhmuc/') || cleanPath.startsWith('/category/')) {
    const slug = cleanPath.split('/')[2];
    return { page: 'products', params: { ...queryObj, category: slug } };
  }
  if (cleanPath.startsWith('/thuong-hieu/') || cleanPath.startsWith('/thuonghieu/') || cleanPath.startsWith('/brand/')) {
    const slug = cleanPath.split('/')[2];
    return { page: 'products', params: { ...queryObj, brand: slug } };
  }
  if (cleanPath.startsWith('/san-pham/') || cleanPath.startsWith('/sanpham/') || cleanPath.startsWith('/product/')) {
    const parts = cleanPath.split('/');
    const slug = parts[2];
    if (slug) {
      return { page: 'product-detail', params: { ...queryObj, slug } };
    }
    return { page: 'products', params: queryObj };
  }
  if (cleanPath === '/san-pham' || cleanPath === '/sanpham' || cleanPath === '/products') {
    return { page: 'products', params: queryObj };
  }
  if (cleanPath === '/gio-hang' || cleanPath === '/giohang' || cleanPath === '/cart') {
    return { page: 'cart', params: queryObj };
  }
  if (cleanPath === '/thanh-toan' || cleanPath === '/thanhtoan' || cleanPath === '/checkout') {
    return { page: 'checkout', params: queryObj };
  }
  if (cleanPath === '/don-hang-thanh-cong' || cleanPath === '/order-success') {
    return { page: 'order-success', params: queryObj };
  }
  if (cleanPath === '/tai-khoan' || cleanPath === '/taikhoan' || cleanPath === '/profile') {
    return { page: 'profile', params: queryObj };
  }
  if (cleanPath === '/he-thong-cua-hang' || cleanPath === '/cua-hang' || cleanPath === '/cuahang' || cleanPath === '/stores') {
    return { page: 'stores', params: queryObj };
  }
  if (cleanPath === '/hoi-vien' || cleanPath === '/hoivien' || cleanPath === '/membership') {
    return { page: 'membership', params: queryObj };
  }
  if (cleanPath === '/the-qua-tang' || cleanPath === '/giftcard') {
    return { page: 'giftcard', params: queryObj };
  }
  if (cleanPath.startsWith('/tin-tuc/') || cleanPath.startsWith('/blog/')) {
    const slug = cleanPath.split('/')[2];
    if (slug) {
      return { page: 'blog-detail', params: { ...queryObj, slug } };
    }
    return { page: 'blog', params: queryObj };
  }
  if (cleanPath === '/tin-tuc' || cleanPath === '/tintuc' || cleanPath === '/blog') {
    return { page: 'blog', params: queryObj };
  }
  if (cleanPath === '/admin') {
    return { page: 'admin', params: queryObj };
  }
  if (cleanPath === '/vnpay-gateway') {
    return { page: 'vnpay-gateway', params: queryObj };
  }

  return { page: 'home', params: queryObj };
};

// Helper: Convert Page & Params to clean Browser URL
const buildUrlFromState = (page: string, params: Record<string, any> = {}): string => {
  if (page === 'home') return '/';
  if (page === 'products') {
    if (params.filter === 'new') return '/hang-moi';
    if (params.filter === 'sale') return '/sale';
    if (params.filter === 'bestseller') return '/ban-chay';
    if (params.category && params.category !== 'all') return `/danh-muc/${params.category}`;
    if (params.brand && params.brand !== 'all') return `/thuong-hieu/${params.brand}`;
    if (params.search) return `/san-pham?search=${encodeURIComponent(params.search)}`;
    return '/san-pham';
  }
  if (page === 'product-detail') return `/san-pham/${params.slug || ''}`;
  if (page === 'cart') return '/gio-hang';
  if (page === 'checkout') return '/thanh-toan';
  if (page === 'order-success') return `/don-hang-thanh-cong${params.orderId ? `?orderId=${params.orderId}` : ''}`;
  if (page === 'profile') return `/tai-khoan${params.tab ? `?tab=${params.tab}` : ''}`;
  if (page === 'stores') return '/he-thong-cua-hang';
  if (page === 'membership') return '/hoi-vien';
  if (page === 'giftcard') return '/the-qua-tang';
  if (page === 'blog') return '/tin-tuc';
  if (page === 'blog-detail') return `/tin-tuc/${params.slug || ''}`;
  if (page === 'admin') return '/admin';
  if (page === 'vnpay-gateway') return '/vnpay-gateway';
  return '/';
};

const MainApp: React.FC = () => {
  // Initialize state directly from the current browser URL pathname & search
  const initialState = parseUrlToState(window.location.pathname, window.location.search);
  const [currentPage, setCurrentPage] = useState<string>(initialState.page);
  const [pageParams, setPageParams] = useState<Record<string, any>>(initialState.params);
  const [adminTab, setAdminTab] = useState<string>('dashboard');

  const handleNavigate = (page: string, params: Record<string, any> = {}, pushHistory = true) => {
    setCurrentPage(page);
    setPageParams(params);

    if (pushHistory) {
      const targetUrl = buildUrlFromState(page, params);
      if (window.location.pathname + window.location.search !== targetUrl) {
        window.history.pushState({ page, params }, '', targetUrl);
      }
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  // Listen to browser Back / Forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const { page, params } = parseUrlToState(window.location.pathname, window.location.search);
      handleNavigate(page, params, false);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Scroll to top automatically whenever page or params change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [currentPage, pageParams]);

  // Render Admin View if in admin mode
  if (currentPage === 'admin') {
    return (
      <AdminLayout
        currentTab={adminTab}
        onTabChange={setAdminTab}
        onNavigateStorefront={() => handleNavigate('home')}
      >
        {adminTab === 'dashboard' && <AdminDashboard onNavigateTab={setAdminTab} />}
        {adminTab === 'products' && <AdminProductsPage />}
        {adminTab === 'orders' && <AdminOrdersPage />}
        {adminTab === 'users' && <AdminUsersPage />}
        {adminTab === 'coupons' && <AdminCouponsPage />}
        <Toast />
      </AdminLayout>
    );
  }

  // Render VNPay Gateway without standard store header/footer for authentic experience
  if (currentPage === 'vnpay-gateway') {
    return (
      <>
        <VNPayPaymentPage
          orderId={pageParams.orderId || ''}
          orderNumber={pageParams.orderNumber || ''}
          amount={pageParams.amount || 0}
          onNavigate={handleNavigate}
        />
        <Toast />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] dark:bg-[#111111] text-neutral-900 dark:text-neutral-100 selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-neutral-950 transition-colors duration-200">
      
      {/* 1. STORE HEADER */}
      <Header
        onNavigate={handleNavigate}
        onOpenAdmin={() => handleNavigate('admin')}
      />

      {/* 2. PAGE VIEW ROUTING */}
      <main className="flex-1 pb-16 lg:pb-0">
        {currentPage === 'home' && (
          <HomePage onNavigate={handleNavigate} />
        )}

        {currentPage === 'products' && (
          <ProductListPage
            initialParams={pageParams}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'product-detail' && (
          <ProductDetailPage
            slug={pageParams.slug || ''}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'cart' && (
          <CartPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'checkout' && (
          <CheckoutPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'order-success' && (
          <OrderSuccessPage
            orderId={pageParams.orderId}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'profile' && (
          <UserProfilePage
            initialTab={pageParams.tab || 'profile'}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'stores' && (
          <StoresPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'membership' && (
          <MembershipPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'giftcard' && (
          <GiftCardPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'blog' && (
          <BlogListPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'blog-detail' && (
          <BlogDetailPage
            slug={pageParams.slug || ''}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* 3. STORE FOOTER */}
      <Footer onNavigate={handleNavigate} />

      {/* 4. MOBILE BOTTOM NAVIGATION */}
      <BottomNav currentPage={currentPage} onNavigate={handleNavigate} />

      {/* 5. GLOBAL INTERACTIVE MODALS & DRAWERS */}
      <CartDrawer onNavigate={handleNavigate} />
      <SearchModal onNavigate={handleNavigate} />
      <QuickViewModal onNavigate={handleNavigate} />
      <SizeGuideModal />
      <AuthModal />
      <BackToTop />
      <Toast />

    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <MainApp />
    </ShopProvider>
  );
}
