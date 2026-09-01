import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { formatCurrency } from '../utils/format';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Truck,
  Sparkles,
  Tag,
  ShieldCheck,
  RotateCcw,
  ArrowLeft,
} from 'lucide-react';

interface CartPageProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onNavigate }) => {
  const {
    cart,
    cartCount,
    subtotal,
    shippingFee,
    appliedCoupon,
    couponDiscount,
    appliedGiftCard,
    giftCardDiscount,
    total,
    freeShippingProgress,
    freeShippingRemaining,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    applyGiftCard,
    removeGiftCard,
  } = useShop();

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [giftCardCode, setGiftCardCode] = useState('');
  const [giftCardError, setGiftCardError] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setCouponError('');
    const res = applyCoupon(couponCode);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponCode('');
    }
  };

  const handleApplyGiftCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!giftCardCode.trim()) return;
    setGiftCardError('');
    const res = applyGiftCard(giftCardCode);
    if (!res.success) {
      setGiftCardError(res.message);
    } else {
      setGiftCardCode('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-extrabold text-neutral-950 font-['Space_Grotesk'] mb-2">
          Giỏ Hàng Của Bạn Đang Trống
        </h1>
        <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-8 leading-relaxed">
          Hãy khám phá các dòng sneaker chính hãng mới nhất tại PY và chọn cho mình một đôi giày ưng ý.
        </p>
        <button
          id="empty-cart-shop-btn"
          onClick={() => onNavigate('products')}
          className="px-8 py-3.5 bg-neutral-950 text-white rounded-2xl text-xs font-bold hover:bg-neutral-800 transition-all shadow-lg"
        >
          Khám Phá Cửa Hàng Ngay
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. HEADER & BREADCRUMB */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-neutral-500 mb-1">
            <span className="hover:underline cursor-pointer" onClick={() => onNavigate('home')}>Trang chủ</span> / <span className="text-neutral-900 font-bold">Giỏ hàng ({cartCount})</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 font-['Space_Grotesk']">
            GIỎ HÀNG CỦA BẠN
          </h1>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-neutral-500 hover:text-rose-600 font-semibold underline self-start sm:self-auto"
        >
          Xóa toàn bộ giỏ hàng
        </button>
      </div>

      {/* 2. FREE SHIPPING THRESHOLD BAR */}
      <div className="p-4 sm:p-5 bg-amber-50 rounded-2xl border border-amber-200/80 text-xs">
        {freeShippingRemaining > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-2 font-bold text-amber-950">
              <span className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-600" />
                Mua thêm <strong className="text-amber-900 underline">{formatCurrency(freeShippingRemaining)}</strong> để nhận Miễn Phí Vận Chuyển toàn quốc!
              </span>
              <span>{freeShippingProgress}%</span>
            </div>
            <div className="w-full bg-amber-200/70 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 text-emerald-800 font-bold">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <span>Đơn hàng của bạn đã đạt điều kiện MIỄN PHÍ VẬN CHUYỂN TOÀN QUỐC (trên 3.000.000đ).</span>
          </div>
        )}
      </div>

      {/* 3. MAIN CART GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT: CART ITEMS LIST (8 COLS) */}
        <div className="lg:col-span-8 space-y-4">
          
          <div className="bg-white rounded-3xl border border-neutral-100 overflow-hidden shadow-sm">
            
            {/* Table Header (Desktop) */}
            <div className="hidden sm:grid grid-cols-12 gap-4 p-4 bg-neutral-50 border-b border-neutral-100 text-xs font-bold text-neutral-400 uppercase tracking-wider">
              <div className="col-span-6">Sản Phẩm</div>
              <div className="col-span-2 text-center">Đơn Giá</div>
              <div className="col-span-2 text-center">Số Lượng</div>
              <div className="col-span-2 text-right">Tổng Tiền</div>
            </div>

            {/* Items */}
            <div className="divide-y divide-neutral-100 p-2 sm:p-0">
              {cart.map(item => (
                <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:grid sm:grid-cols-12 gap-4 items-center">
                  
                  {/* Product Info (Col 6) */}
                  <div className="w-full sm:col-span-6 flex gap-4 items-center">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-20 h-20 rounded-2xl object-cover border border-neutral-100 shrink-0 bg-neutral-50"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{item.brandName}</div>
                      <h3
                        onClick={() => onNavigate('product-detail', { slug: item.productId })}
                        className="text-xs sm:text-sm font-bold text-neutral-900 hover:text-neutral-950 cursor-pointer truncate"
                      >
                        {item.productName}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-neutral-500">
                        <span className="font-semibold bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded-md text-[11px]">
                          Size: {item.size}
                        </span>
                        <span>•</span>
                        <span className="truncate">{item.color}</span>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[11px] text-neutral-400 hover:text-rose-600 flex items-center gap-1 mt-2 transition-colors sm:hidden"
                      >
                        <Trash2 className="w-3 h-3" /> Xóa
                      </button>
                    </div>
                  </div>

                  {/* Unit Price (Col 2) */}
                  <div className="w-full sm:col-span-2 flex sm:justify-center justify-between text-xs font-bold text-neutral-700">
                    <span className="sm:hidden text-neutral-400">Đơn giá:</span>
                    <span>{formatCurrency(item.price)}</span>
                  </div>

                  {/* Quantity Stepper (Col 2) */}
                  <div className="w-full sm:col-span-2 flex sm:justify-center justify-between items-center">
                    <span className="sm:hidden text-xs text-neutral-400 font-medium">Số lượng:</span>
                    <div className="flex items-center border border-neutral-200 rounded-xl bg-white overflow-hidden shadow-sm">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 hover:bg-neutral-100 text-neutral-600 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-neutral-900">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 hover:bg-neutral-100 text-neutral-600 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Subtotal & Desktop Delete (Col 2) */}
                  <div className="w-full sm:col-span-2 flex sm:justify-end justify-between items-center gap-3">
                    <span className="sm:hidden text-xs text-neutral-400 font-medium">Thành tiền:</span>
                    <span className="text-sm font-extrabold text-neutral-950">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="hidden sm:block text-neutral-300 hover:text-rose-600 p-1 transition-colors"
                      title="Xóa khỏi giỏ hàng"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              ))}
            </div>

          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => onNavigate('products')}
              className="flex items-center gap-2 text-xs font-bold text-neutral-900 hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Tiếp tục chọn thêm giày</span>
            </button>
          </div>

        </div>

        {/* RIGHT: ORDER SUMMARY (4 COLS) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-neutral-100 p-6 space-y-6 shadow-sm">
            
            <h2 className="font-extrabold text-base text-neutral-950 font-['Space_Grotesk'] uppercase pb-3 border-b border-neutral-100">
              Tóm Tắt Đơn Hàng
            </h2>

            {/* Coupon Box */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">Mã giảm giá (Coupon):</label>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                  <div className="flex items-center gap-2 text-emerald-900 font-medium">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <span>Mã: <strong>{appliedCoupon.code}</strong> (-{formatCurrency(couponDiscount)})</span>
                  </div>
                  <button onClick={removeCoupon} className="text-xs text-rose-600 font-bold hover:underline">Hủy</button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={e => {
                      setCouponCode(e.target.value.toUpperCase());
                      setCouponError('');
                    }}
                    placeholder="VD: WELCOME10, SALE500K..."
                    className="flex-1 text-xs uppercase px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-950 focus:bg-white"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-neutral-950 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors"
                  >
                    Áp dụng
                  </button>
                </form>
              )}
              {couponError && <p className="text-[11px] text-rose-600 mt-1">{couponError}</p>}
            </div>

            {/* Gift Card Box */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">Thẻ quà tặng (Gift Card):</label>
              {appliedGiftCard ? (
                <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs">
                  <div className="flex items-center gap-2 text-amber-900 font-medium">
                    <Tag className="w-4 h-4 text-amber-600" />
                    <span>Thẻ: <strong>{appliedGiftCard.code}</strong> (-{formatCurrency(giftCardDiscount)})</span>
                  </div>
                  <button onClick={removeGiftCard} className="text-xs text-rose-600 font-bold hover:underline">Hủy</button>
                </div>
              ) : (
                <form onSubmit={handleApplyGiftCard} className="flex gap-2">
                  <input
                    type="text"
                    value={giftCardCode}
                    onChange={e => {
                      setGiftCardCode(e.target.value.toUpperCase());
                      setGiftCardError('');
                    }}
                    placeholder="VD: SOLE-VIP-1000..."
                    className="flex-1 text-xs uppercase px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-950 focus:bg-white"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors"
                  >
                    Áp dụng
                  </button>
                </form>
              )}
              {giftCardError && <p className="text-[11px] text-rose-600 mt-1">{giftCardError}</p>}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs text-neutral-600 pt-3 border-t border-neutral-100">
              <div className="flex justify-between">
                <span>Tạm tính ({cartCount} sản phẩm):</span>
                <span className="font-bold text-neutral-900">{formatCurrency(subtotal)}</span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Giảm giá khuyến mãi:</span>
                  <span>-{formatCurrency(couponDiscount)}</span>
                </div>
              )}

              {giftCardDiscount > 0 && (
                <div className="flex justify-between text-amber-600 font-medium">
                  <span>Khấu trừ Thẻ quà tặng:</span>
                  <span>-{formatCurrency(giftCardDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Phí vận chuyển:</span>
                <span className="font-bold text-neutral-900">
                  {shippingFee === 0 ? <strong className="text-emerald-600">Miễn phí</strong> : formatCurrency(shippingFee)}
                </span>
              </div>

              <div className="flex justify-between text-base font-extrabold text-neutral-950 pt-3 border-t border-neutral-200">
                <span>Tổng thanh toán:</span>
                <span className="text-lg text-rose-600">{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              id="cart-page-checkout-btn"
              onClick={() => onNavigate('checkout')}
              className="w-full py-4 bg-neutral-950 text-white rounded-2xl font-extrabold text-sm hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 shadow-xl group"
            >
              <span>Tiến Hành Thanh Toán</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="space-y-2 pt-2 text-[11px] text-neutral-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Chính hãng auth - Đền 200% nếu giả</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Hỗ trợ đổi size trong 30 ngày linh hoạt</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
