import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/common/ProductCard';
import { formatCurrency, formatDateTime } from '../utils/format';
import {
  User as UserIcon,
  Package,
  Heart,
  MapPin,
  ShieldCheck,
  LogOut,
  Sparkles,
  Phone,
  Mail,
  Clock,
  ChevronRight,
  Gift,
} from 'lucide-react';

interface UserProfilePageProps {
  initialTab?: string;
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({ initialTab = 'profile', onNavigate }) => {
  const {
    currentUser,
    userOrders,
    wishlist,
    products,
    logout,
    updateProfile,
    setIsAuthModalOpen,
    setAuthModalMode,
  } = useShop();

  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [province, setProvince] = useState(currentUser?.address?.province || 'TP. Hồ Chí Minh');
  const [district, setDistrict] = useState(currentUser?.address?.district || 'Quận 1');
  const [ward, setWard] = useState(currentUser?.address?.ward || 'Phường Bến Nghé');
  const [street, setStreet] = useState(currentUser?.address?.street || '123 Nguyễn Huệ');

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-neutral-400">
          <UserIcon className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-extrabold text-neutral-950 font-['Space_Grotesk']">
          Vui Lòng Đăng Nhập Tài Khoản
        </h2>
        <p className="text-xs text-neutral-500 leading-relaxed">
          Đăng nhập để xem lịch sử đơn hàng, địa chỉ giao hàng và điểm tích lũy thành viên PY.
        </p>
        <button
          onClick={() => {
            setAuthModalMode('login');
            setIsAuthModalOpen(true);
          }}
          className="px-8 py-3 bg-neutral-950 text-white rounded-2xl text-xs font-bold hover:bg-neutral-800 transition-all shadow-lg"
        >
          Đăng Nhập Ngay
        </button>
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      phone,
      address: {
        province,
        district,
        ward,
        street,
      },
    });
  };

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. TOP PROFILE HEADER */}
      <div className="bg-neutral-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white text-neutral-950 flex items-center justify-center font-extrabold text-2xl font-['Space_Grotesk'] shadow-md shrink-0">
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold font-['Space_Grotesk']">{currentUser.name}</h1>
              <span className="px-2 py-0.5 bg-amber-400 text-neutral-950 text-[10px] font-extrabold rounded-md uppercase">
                Hội Viên VIP Vàng
              </span>
            </div>
            <div className="text-xs text-neutral-400 mt-1">{currentUser.email} • SĐT: {currentUser.phone || 'Chưa cập nhật'}</div>
          </div>
        </div>

        <div className="flex items-center gap-6 text-center sm:text-right">
          <div>
            <div className="text-2xl font-extrabold text-amber-400 font-['Space_Grotesk']">1,250</div>
            <div className="text-[11px] text-neutral-400 uppercase tracking-wider">Điểm Thưởng</div>
          </div>
          <div className="h-8 w-px bg-neutral-800" />
          <div>
            <div className="text-2xl font-extrabold text-white font-['Space_Grotesk']">{userOrders.length}</div>
            <div className="text-[11px] text-neutral-400 uppercase tracking-wider">Đơn Hàng</div>
          </div>
        </div>
      </div>

      {/* 2. MAIN LAYOUT: SIDE TABS & CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT NAV TABS (3 COLS) */}
        <div className="lg:col-span-3 space-y-2">
          <div className="bg-white rounded-3xl border border-neutral-100 p-3 shadow-sm space-y-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left ${
                activeTab === 'profile' ? 'bg-neutral-950 text-white shadow-md' : 'text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span>Thông tin tài khoản</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left ${
                activeTab === 'orders' ? 'bg-neutral-950 text-white shadow-md' : 'text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              <span className="flex items-center gap-3">
                <Package className="w-4 h-4" />
                <span>Lịch sử đơn hàng</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-neutral-100 text-neutral-800 font-bold">
                {userOrders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('wishlist')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left ${
                activeTab === 'wishlist' ? 'bg-neutral-950 text-white shadow-md' : 'text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              <span className="flex items-center gap-3">
                <Heart className="w-4 h-4" />
                <span>Danh sách yêu thích</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-100 text-rose-800 font-bold">
                {wishlist.length}
              </span>
            </button>

            <button
              onClick={() => onNavigate('membership')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition-all text-left"
            >
              <Gift className="w-4 h-4 text-amber-500" />
              <span>Đặc quyền hội viên VIP</span>
            </button>

            <div className="pt-2 border-t border-neutral-100">
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Đăng xuất tài khoản</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT CONTENT AREA (9 COLS) */}
        <div className="lg:col-span-9">
          
          {/* TAB 1: PROFILE & ADDRESS */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-3xl border border-neutral-100 p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h2 className="text-base font-extrabold text-neutral-950 uppercase tracking-wider font-['Space_Grotesk']">
                  Thông Tin Cá Nhân & Sổ Địa Chỉ
                </h2>
                <p className="text-xs text-neutral-500">Cập nhật thông tin để việc đặt hàng nhanh chóng hơn</p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Họ và tên *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-neutral-950 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">Địa chỉ Email</label>
                    <input
                      type="email"
                      disabled
                      value={currentUser.email}
                      className="w-full px-4 py-2.5 bg-neutral-100 border border-neutral-200 rounded-xl text-xs text-neutral-500 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">Số điện thoại *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-neutral-950 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-100">
                  <div className="text-xs font-bold text-neutral-900 mb-3">Địa Chỉ Giao Hàng Mặc Định</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Tỉnh/Thành</label>
                      <input
                        type="text"
                        value={province}
                        onChange={e => setProvince(e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Quận/Huyện</label>
                      <input
                        type="text"
                        value={district}
                        onChange={e => setDistrict(e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Phường/Xã</label>
                      <input
                        type="text"
                        value={ward}
                        onChange={e => setWard(e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Số nhà, Tên đường</label>
                    <input
                      type="text"
                      value={street}
                      onChange={e => setStreet(e.target.value)}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-neutral-950 text-white rounded-2xl text-xs font-bold hover:bg-neutral-800 transition-all shadow-md"
                >
                  Lưu Thay Đổi
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: ORDER HISTORY */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-3xl border border-neutral-100 p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h2 className="text-base font-extrabold text-neutral-950 uppercase tracking-wider font-['Space_Grotesk']">
                  Lịch Sử Đơn Hàng ({userOrders.length})
                </h2>
                <p className="text-xs text-neutral-500">Xem và theo dõi tiến độ giao hàng của từng đơn hàng</p>
              </div>

              {userOrders.length === 0 ? (
                <div className="text-center py-12 text-neutral-400 space-y-3">
                  <Package className="w-12 h-12 mx-auto stroke-1" />
                  <div className="text-sm font-bold text-neutral-900">Bạn chưa có đơn hàng nào</div>
                  <button
                    onClick={() => onNavigate('products')}
                    className="px-6 py-2.5 bg-neutral-950 text-white rounded-xl text-xs font-bold"
                  >
                    Khám phá giày ngay
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {userOrders.map(order => (
                    <div
                      key={order.id}
                      className="p-5 rounded-2xl border border-neutral-100 hover:border-neutral-200 bg-neutral-50/50 space-y-4 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-200/70">
                        <div>
                          <div className="font-mono font-extrabold text-neutral-950 text-sm">{order.orderNumber}</div>
                          <div className="text-[11px] text-neutral-400">Ngày đặt: {formatDateTime(order.createdAt)}</div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                            order.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {order.paymentStatus === 'paid' ? 'Đã Thanh Toán' : 'Chờ Thanh Toán'}
                          </span>
                          <span className="px-2.5 py-1 rounded-md bg-neutral-950 text-white text-[10px] font-bold uppercase">
                            {order.orderStatus === 'pending' ? 'Chờ Xử Lý' : order.orderStatus === 'processing' ? 'Đang Đóng Gói' : order.orderStatus}
                          </span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-2">
                        {order.items.map(item => (
                          <div key={item.id} className="flex items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.image}
                                alt={item.productName}
                                className="w-12 h-12 rounded-xl object-cover border border-neutral-200 bg-white shrink-0"
                                referrerPolicy="no-referrer"
                              />
                              <div>
                                <h4 className="font-bold text-neutral-900">{item.productName}</h4>
                                <div className="text-[11px] text-neutral-500">Size: {item.size} • {item.color} • x{item.quantity}</div>
                              </div>
                            </div>
                            <span className="font-bold text-neutral-950">{formatCurrency(item.subtotal)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Order Footer */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-neutral-200/70 text-xs">
                        <div>
                          <span className="text-neutral-500">Tổng tiền: </span>
                          <strong className="text-rose-600 text-sm font-extrabold">{formatCurrency(order.total)}</strong>
                        </div>

                        <button
                          onClick={() => onNavigate('order-success', { orderId: order.id })}
                          className="text-xs font-bold text-neutral-900 hover:underline flex items-center gap-1 self-end sm:self-auto"
                        >
                          <span>Xem hóa đơn & chi tiết</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="bg-white rounded-3xl border border-neutral-100 p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h2 className="text-base font-extrabold text-neutral-950 uppercase tracking-wider font-['Space_Grotesk']">
                  Danh Sách Giày Yêu Thích ({wishlistProducts.length})
                </h2>
                <p className="text-xs text-neutral-500">Những mẫu giày bạn đã lưu lại để theo dõi giá</p>
              </div>

              {wishlistProducts.length === 0 ? (
                <div className="text-center py-12 text-neutral-400 space-y-3">
                  <Heart className="w-12 h-12 mx-auto stroke-1" />
                  <div className="text-sm font-bold text-neutral-900">Danh sách yêu thích đang trống</div>
                  <button
                    onClick={() => onNavigate('products')}
                    className="px-6 py-2.5 bg-neutral-950 text-white rounded-xl text-xs font-bold"
                  >
                    Khám phá giày ngay
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wishlistProducts.map(p => (
                    <ProductCard key={p.id} product={p} onNavigate={onNavigate} />
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
