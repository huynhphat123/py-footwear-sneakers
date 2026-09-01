import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { formatCurrency } from '../../utils/format';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Truck,
  Sparkles,
  Tag,
  ShieldCheck,
} from 'lucide-react';

interface CartDrawerProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigate }) => {
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
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    applyCoupon,
    removeCoupon,
  } = useShop();

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartDrawerOpen) return null;

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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      {/* Slide-out drawer */}
      <div className="relative w-full max-w-md bg-white dark:bg-[#141414] text-neutral-900 dark:text-neutral-100 h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300 border-l border-neutral-100 dark:border-neutral-800">
        
        {/* HEADER */}
        <div className="p-4 sm:p-5 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 rounded-lg">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-neutral-900 dark:text-white text-base">Giỏ Hàng Của Bạn</h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">{cartCount} sản phẩm</p>
            </div>
          </div>
          <button
            id="cart-drawer-close-btn"
            onClick={() => setIsCartDrawerOpen(false)}
            className="p-2 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FREE SHIPPING PROGRESS BAR */}
        <div className="p-4 bg-amber-50/80 dark:bg-amber-950/30 border-b border-amber-100/80 dark:border-amber-900/40 text-xs">
          {freeShippingRemaining > 0 ? (
            <div>
              <div className="flex items-center justify-between mb-1.5 font-medium text-amber-900 dark:text-amber-300">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  Mua thêm <strong>{formatCurrency(freeShippingRemaining)}</strong> để được Free Ship
                </span>
                <span className="font-bold">{freeShippingProgress}%</span>
              </div>
              <div className="w-full bg-amber-200/70 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-600 dark:bg-amber-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-bold">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Tuyệt vời! Đơn hàng của bạn đủ điều kiện MIỄN PHÍ VẬN CHUYỂN toàn quốc.</span>
            </div>
          )}
        </div>

        {/* CART ITEMS LIST */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1">Giỏ hàng đang trống</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6">Bạn chưa thêm sản phẩm nào vào giỏ hàng.</p>
              <button
                id="cart-drawer-explore-btn"
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  onNavigate('products');
                }}
                className="px-6 py-2.5 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 rounded-xl text-xs font-bold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
              >
                Khám phá giày mới ngay
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div
                key={item.id}
                className="flex gap-3.5 p-3 rounded-2xl border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-[#1c1c1c] hover:border-neutral-200 dark:hover:border-neutral-700 transition-all group"
              >
                <img
                  src={item.image}
                  alt={item.productName}
                  className="w-20 h-20 rounded-xl object-cover border border-neutral-100 dark:border-neutral-800 shrink-0 bg-neutral-50 dark:bg-neutral-900"
                  referrerPolicy="no-referrer"
                />

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <div>
                        <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">{item.brandName}</span>
                        <h4 className="text-xs font-bold text-neutral-900 dark:text-white leading-snug line-clamp-1">{item.productName}</h4>
                      </div>
                      <button
                        id={`cart-item-remove-${item.id}`}
                        onClick={() => removeFromCart(item.id)}
                        className="text-neutral-400 hover:text-rose-600 p-1 rounded transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold px-2 py-0.5 rounded-md">
                        Size: {item.size}
                      </span>
                      <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium truncate">
                        {item.color}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-neutral-50 dark:border-neutral-800/80">
                    <div className="font-extrabold text-neutral-950 dark:text-white text-xs sm:text-sm">
                      {formatCurrency(item.price)}
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 overflow-hidden">
                      <button
                        id={`cart-item-minus-${item.id}`}
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2.5 text-xs font-bold text-neutral-900 dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        id={`cart-item-plus-${item.id}`}
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* FOOTER & CHECKOUT */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/80 space-y-3">
            
            {/* Quick Coupon Box */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs">
                  <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-300 font-medium">
                    <Tag className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Mã: <strong>{appliedCoupon.code}</strong> (-{formatCurrency(couponDiscount)})</span>
                  </div>
                  <button
                    id="cart-drawer-remove-coupon-btn"
                    onClick={removeCoupon}
                    className="text-xs text-rose-600 dark:text-rose-400 hover:underline font-bold"
                  >
                    Hủy
                  </button>
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
                    placeholder="Nhập mã giảm giá (VD: WELCOME10)"
                    className="flex-1 text-xs uppercase px-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white rounded-xl focus:outline-none focus:border-neutral-900 dark:focus:border-white"
                  />
                  <button
                    type="submit"
                    id="cart-drawer-apply-coupon-btn"
                    className="px-3 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 rounded-xl text-xs font-bold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
                  >
                    Áp dụng
                  </button>
                </form>
              )}
              {couponError && (
                <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1">{couponError}</p>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400 pt-1">
              <div className="flex justify-between">
                <span>Tạm tính:</span>
                <span className="font-semibold text-neutral-900 dark:text-white">{formatCurrency(subtotal)}</span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>Giảm giá voucher:</span>
                  <span>-{formatCurrency(couponDiscount)}</span>
                </div>
              )}

              {giftCardDiscount > 0 && (
                <div className="flex justify-between text-amber-600 dark:text-amber-400 font-medium">
                  <span>Thẻ quà tặng (Gift Card):</span>
                  <span>-{formatCurrency(giftCardDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Phí vận chuyển:</span>
                <span className="font-semibold text-neutral-900 dark:text-white">
                  {shippingFee === 0 ? <strong className="text-emerald-600 dark:text-emerald-400">Miễn phí</strong> : formatCurrency(shippingFee)}
                </span>
              </div>

              <div className="flex justify-between text-sm font-extrabold text-neutral-950 dark:text-white pt-2 border-t border-neutral-200 dark:border-neutral-700">
                <span>Tổng cộng:</span>
                <span className="text-base text-rose-600 dark:text-rose-400">{formatCurrency(total)}</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                id="cart-drawer-view-cart-btn"
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  onNavigate('cart');
                }}
                className="py-3 px-4 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white rounded-xl text-xs font-bold hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors text-center"
              >
                Xem Giỏ Hàng
              </button>

              <button
                id="cart-drawer-checkout-btn"
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  onNavigate('checkout');
                }}
                className="py-3 px-4 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 rounded-xl text-xs font-bold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all flex items-center justify-center gap-1.5 shadow-lg group"
              >
                <span>Thanh Toán</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-500 dark:text-neutral-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Cam kết sản phẩm chính hãng 100%</span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
