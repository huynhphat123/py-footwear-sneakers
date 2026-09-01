import React from 'react';
import { useShop } from '../../context/ShopContext';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Tag,
  Users,
  Store,
  LogOut,
  ArrowLeft,
  Bell,
  Search,
  Sparkles,
} from 'lucide-react';

interface AdminLayoutProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onNavigateStorefront: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onTabChange,
  onNavigateStorefront,
  children,
}) => {
  const { currentUser, allOrders, products } = useShop();

  const pendingOrdersCount = allOrders.filter(o => o.orderStatus === 'pending').length;
  
  // Low stock variants count
  const lowStockCount = products.reduce((acc, p) => {
    return acc + p.variants.filter(v => (v.stockQuantity - v.reservedQuantity) <= 3).length;
  }, 0);

  const menuItems = [
    { id: 'dashboard', label: 'Báo Cáo & Tổng Quan', icon: LayoutDashboard },
    { id: 'products', label: 'Quản Lý Sản Phẩm & Kho', icon: Package, badge: lowStockCount > 0 ? `${lowStockCount} cảnh báo` : undefined, badgeColor: 'bg-rose-500' },
    { id: 'orders', label: 'Quản Lý Đơn Hàng', icon: ShoppingCart, badge: pendingOrdersCount > 0 ? `${pendingOrdersCount} mới` : undefined, badgeColor: 'bg-amber-500' },
    { id: 'users', label: 'Quản Lý Người Dùng', icon: Users },
    { id: 'coupons', label: 'Khuyến Mãi & Voucher', icon: Tag },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      
      {/* SIDEBAR (DESKTOP) */}
      <aside className="w-full md:w-64 bg-slate-950 border-r border-slate-800 p-5 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          
          {/* Brand Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-white text-slate-950 rounded-xl flex items-center justify-center font-extrabold text-lg font-['Space_Grotesk'] shadow-md">
                PY
              </div>
              <div>
                <div className="text-xs font-mono font-bold text-sky-400 tracking-wider">PORTAL</div>
                <div className="text-sm font-extrabold text-white font-['Space_Grotesk']">PY ADMIN</div>
              </div>
            </div>
          </div>

          {/* Quick Back to Storefront */}
          <button
            onClick={onNavigateStorefront}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 transition-all"
          >
            <Store className="w-4 h-4 text-sky-400" />
            <span>Xem Website Bán Hàng</span>
          </button>

          {/* Navigation Links */}
          <nav className="space-y-1.5 pt-2">
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-3 mb-2">
              Menu Quản Trị
            </div>

            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all text-left ${
                    isActive
                      ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold text-white ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Admin User Info & Logout */}
        <div className="pt-6 border-t border-slate-800 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center border border-slate-700">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white truncate">{currentUser?.name || 'Administrator'}</div>
              <div className="text-[10px] text-sky-400">Super Admin</div>
            </div>
          </div>

          <button
            onClick={onNavigateStorefront}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-400 hover:text-rose-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Thoát Chế Độ Quản Trị</span>
          </button>
        </div>
      </aside>

      {/* MAIN ADMIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-900 overflow-y-auto">
        
        {/* Top bar */}
        <header className="h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400">Khu vực điều hành</span>
            <span className="text-slate-600">/</span>
            <span className="text-xs font-extrabold text-white uppercase tracking-wider">
              {menuItems.find(m => m.id === currentTab)?.label}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-950/60 border border-emerald-800/80 rounded-xl text-[11px] font-bold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Hệ Thống Đang Hoạt Động 100%</span>
            </div>
          </div>
        </header>

        <div className="p-6 sm:p-8 flex-1">
          {children}
        </div>
      </main>

    </div>
  );
};
