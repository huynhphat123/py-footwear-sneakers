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

const MainApp: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [pageParams, setPageParams] = useState<Record<string, any>>({});
  const [adminTab, setAdminTab] = useState<string>('dashboard');

  const handleNavigate = (page: string, params: Record<string, any> = {}) => {
    setCurrentPage(page);
    setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage onNavigate={handleNavigate} />
        )}

        {currentPage === 'products' && (
          <ProductListPage
            initialCategory={pageParams.category}
            initialBrand={pageParams.brand}
            initialGender={pageParams.gender}
            initialQuery={pageParams.query}
            initialIsSale={pageParams.isSale}
            initialIsNew={pageParams.isNew}
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

      {/* 4. GLOBAL INTERACTIVE MODALS & DRAWERS */}
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
