import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { formatCurrency } from '../utils/format';
import { VNPayService } from '../services/vnpayService';
import {
  CreditCard,
  Truck,
  ShieldCheck,
  ArrowRight,
  MapPin,
  User as UserIcon,
  Phone,
  Mail,
  FileText,
  CheckCircle2,
  Lock,
  Tag,
  Building2,
  Sparkles,
} from 'lucide-react';

interface CheckoutPageProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const {
    cart,
    subtotal,
    shippingFee: baseShippingFee,
    appliedCoupon,
    couponDiscount,
    appliedGiftCard,
    giftCardDiscount,
    total,
    currentUser,
    placeOrder,
    showToast,
  } = useShop();

  // Form State
  const [customerName, setCustomerName] = useState(currentUser?.name || 'Nguyễn Văn Minh');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || 'minh.nguyen@example.com');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '0912345678');
  
  // Address
  const [province, setProvince] = useState(currentUser?.address?.province || 'TP. Hồ Chí Minh');
  const [district, setDistrict] = useState(currentUser?.address?.district || 'Quận 1');
  const [ward, setWard] = useState(currentUser?.address?.ward || 'Phường Bến Nghé');
  const [street, setStreet] = useState(currentUser?.address?.street || '123 Đường Nguyễn Huệ');
  const [note, setNote] = useState('');

  // Shipping & Payment Method
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'vnpay' | 'bank_transfer'>('vnpay');

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const shippingCost = shippingMethod === 'express' ? 60000 : baseShippingFee;
  const finalTotal = Math.max(0, subtotal + shippingCost - couponDiscount - giftCardDiscount);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !customerPhone || !street) {
      setErrorMsg('Vui lòng điền đầy đủ các trường thông tin giao hàng bắt buộc (*).');
      return;
    }

    setIsProcessing(true);
    setErrorMsg('');

    const orderData = {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress: {
        province,
        district,
        ward,
        street,
      },
      note,
      shippingMethod,
      paymentMethod,
    };

    const res = placeOrder(orderData);

    if (!res.success || !res.order) {
      setIsProcessing(false);
      setErrorMsg(res.error || 'Có lỗi xảy ra khi tạo đơn hàng. Vui lòng kiểm tra lại số lượng tồn kho.');
      showToast(res.error || 'Lỗi đặt hàng!', 'error');
      return;
    }

    const createdOrder = res.order;

    // Handle payment flow
    if (paymentMethod === 'vnpay') {
      // Simulate generating VNPay payment URL and redirect to VNPay Gateway screen
      showToast('Đang chuyển hướng sang cổng thanh toán VNPay bảo mật...', 'info');
      setTimeout(() => {
        setIsProcessing(false);
        onNavigate('vnpay-gateway', { orderId: createdOrder.id, orderNumber: createdOrder.orderNumber, amount: finalTotal });
      }, 600);
    } else {
      // COD or Direct Bank Transfer
      showToast(`Đặt hàng thành công! Mã đơn: ${createdOrder.orderNumber}`, 'success');
      setTimeout(() => {
        setIsProcessing(false);
        onNavigate('order-success', { orderId: createdOrder.id });
      }, 500);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-neutral-900 mb-2">Giỏ hàng của bạn đang trống</h2>
        <button
          onClick={() => onNavigate('products')}
          className="px-6 py-2.5 bg-neutral-950 text-white rounded-xl text-xs font-bold"
        >
          Quay lại cửa hàng
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <div className="mb-8">
        <div className="text-xs text-neutral-500 mb-1">
          <span className="hover:underline cursor-pointer" onClick={() => onNavigate('cart')}>Giỏ hàng</span> / <span className="text-neutral-900 font-bold">Thanh toán</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 font-['Space_Grotesk']">
          TIẾN HÀNH ĐẶT HÀNG & THANH TOÁN
        </h1>
      </div>

      {errorMsg && (
        <div className="p-4 mb-6 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-bold">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT: SHIPPING & PAYMENT DETAILS (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. CUSTOMER INFORMATION */}
          <div className="bg-white rounded-3xl border border-neutral-100 p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-100 font-extrabold text-sm text-neutral-950 uppercase tracking-wider">
              <UserIcon className="w-4 h-4 text-neutral-700" />
              <span>1. Thông Tin Người Nhận</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-neutral-700 mb-1">Họ và tên người nhận *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-neutral-950 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Số điện thoại *</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  placeholder="0912 345 678"
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-neutral-950 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Địa chỉ Email nhận hóa đơn *</label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={e => setCustomerEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-neutral-950 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* 2. SHIPPING ADDRESS */}
          <div className="bg-white rounded-3xl border border-neutral-100 p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-100 font-extrabold text-sm text-neutral-950 uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-neutral-700" />
              <span>2. Địa Chỉ Giao Hàng</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Tỉnh / Thành phố *</label>
                <select
                  value={province}
                  onChange={e => setProvince(e.target.value)}
                  className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-neutral-950 focus:bg-white font-medium"
                >
                  <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                  <option value="Hải Phòng">Hải Phòng</option>
                  <option value="Cần Thơ">Cần Thơ</option>
                  <option value="Bình Dương">Bình Dương</option>
                  <option value="Đồng Nai">Đồng Nai</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Quận / Huyện *</label>
                <select
                  value={district}
                  onChange={e => setDistrict(e.target.value)}
                  className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-neutral-950 focus:bg-white font-medium"
                >
                  <option value="Quận 1">Quận 1</option>
                  <option value="Quận 3">Quận 3</option>
                  <option value="Quận 5">Quận 5</option>
                  <option value="Quận 7">Quận 7</option>
                  <option value="Quận Bình Thạnh">Quận Bình Thạnh</option>
                  <option value="Quận Phú Nhuận">Quận Phú Nhuận</option>
                  <option value="TP. Thủ Đức">TP. Thủ Đức</option>
                  <option value="Quận Hoàn Kiếm">Quận Hoàn Kiếm</option>
                  <option value="Quận Cầu Giấy">Quận Cầu Giấy</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Phường / Xã *</label>
                <select
                  value={ward}
                  onChange={e => setWard(e.target.value)}
                  className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-neutral-950 focus:bg-white font-medium"
                >
                  <option value="Phường Bến Nghé">Phường Bến Nghé</option>
                  <option value="Phường Bến Thành">Phường Bến Thành</option>
                  <option value="Phường Đa Kao">Phường Đa Kao</option>
                  <option value="Phường Tân Định">Phường Tân Định</option>
                  <option value="Phường Tràng Tiền">Phường Tràng Tiền</option>
                  <option value="Phường Hàng Bài">Phường Hàng Bài</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-neutral-700 mb-1">Số nhà, Tên đường, Tòa nhà *</label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={e => setStreet(e.target.value)}
                  placeholder="Ví dụ: 188 Hai Bà Trưng, Phường Đa Kao"
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-neutral-950 focus:bg-white"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-neutral-700 mb-1">Ghi chú giao hàng (Tùy chọn)</label>
                <input
                  type="text"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Giao trong giờ hành chính, gọi trước khi giao..."
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-neutral-950 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* 3. SHIPPING METHOD */}
          <div className="bg-white rounded-3xl border border-neutral-100 p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-100 font-extrabold text-sm text-neutral-950 uppercase tracking-wider">
              <Truck className="w-4 h-4 text-neutral-700" />
              <span>3. Phương Thức Vận Chuyển</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                onClick={() => setShippingMethod('standard')}
                className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  shippingMethod === 'standard'
                    ? 'border-neutral-950 bg-neutral-50/50 shadow-sm'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <input
                  type="radio"
                  name="shippingMethod"
                  checked={shippingMethod === 'standard'}
                  onChange={() => setShippingMethod('standard')}
                  className="mt-0.5 text-neutral-950 focus:ring-0"
                />
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-900">Giao Tiêu Chuẩn (1-3 Ngày)</span>
                  </div>
                  <div className="text-xs font-extrabold text-neutral-950 mt-1">
                    {baseShippingFee === 0 ? <span className="text-emerald-600">Miễn Phí</span> : formatCurrency(baseShippingFee)}
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-0.5">Viettel Post / GHTK bảo hiểm đầy đủ</p>
                </div>
              </label>

              <label
                onClick={() => setShippingMethod('express')}
                className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  shippingMethod === 'express'
                    ? 'border-neutral-950 bg-neutral-50/50 shadow-sm'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <input
                  type="radio"
                  name="shippingMethod"
                  checked={shippingMethod === 'express'}
                  onChange={() => setShippingMethod('express')}
                  className="mt-0.5 text-neutral-950 focus:ring-0"
                />
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-900">Giao Hỏa Tốc 2H Nội Thành</span>
                  </div>
                  <div className="text-xs font-extrabold text-neutral-950 mt-1">
                    {formatCurrency(60000)}
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-0.5">AhaMove / GrabExpress giao trong 2 giờ</p>
                </div>
              </label>
            </div>
          </div>

          {/* 4. PAYMENT METHOD */}
          <div className="bg-white rounded-3xl border border-neutral-100 p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-100 font-extrabold text-sm text-neutral-950 uppercase tracking-wider">
              <CreditCard className="w-4 h-4 text-neutral-700" />
              <span>4. Phương Thức Thanh Toán</span>
            </div>

            <div className="space-y-3">
              {/* VNPay Option */}
              <label
                onClick={() => setPaymentMethod('vnpay')}
                className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'vnpay'
                    ? 'border-neutral-950 bg-sky-50/40 shadow-sm'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'vnpay'}
                  onChange={() => setPaymentMethod('vnpay')}
                  className="mt-1 text-neutral-950 focus:ring-0"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-sky-900 flex items-center gap-1.5">
                      <span>Cổng Thanh Toán VNPay 2.1.0 (Khuyên dùng)</span>
                      <span className="px-2 py-0.5 bg-sky-600 text-white rounded text-[10px] uppercase font-bold">QR / ATM / Visa</span>
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 mt-1">
                    Quét mã VNPay QR qua Mobile Banking (Vietcombank, MB, Techcombank, VPBank...) hoặc thanh toán qua thẻ ATM/Visa/MasterCard bảo mật SHA512.
                  </p>
                </div>
              </label>

              {/* COD Option */}
              <label
                onClick={() => setPaymentMethod('cod')}
                className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-neutral-950 bg-neutral-50/50 shadow-sm'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="mt-1 text-neutral-950 focus:ring-0"
                />
                <div className="flex-1">
                  <span className="text-xs font-bold text-neutral-900">
                    Thanh Toán Khi Nhận Hàng (COD)
                  </span>
                  <p className="text-xs text-neutral-500 mt-1">
                    Kiểm tra ngoại quan giày, thử size xong mới thanh toán tiền mặt cho shipper.
                  </p>
                </div>
              </label>

              {/* Direct Bank Transfer */}
              <label
                onClick={() => setPaymentMethod('bank_transfer')}
                className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'bank_transfer'
                    ? 'border-neutral-950 bg-neutral-50/50 shadow-sm'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'bank_transfer'}
                  onChange={() => setPaymentMethod('bank_transfer')}
                  className="mt-1 text-neutral-950 focus:ring-0"
                />
                <div className="flex-1">
                  <span className="text-xs font-bold text-neutral-900">
                    Chuyển Khoản Ngân Hàng Trực Tiếp (Vietcombank 24/7)
                  </span>
                  <p className="text-xs text-neutral-500 mt-1">
                    Hệ thống sẽ cung cấp mã QR chuyển khoản chính xác sau khi bạn bấm đặt hàng.
                  </p>
                </div>
              </label>
            </div>
          </div>

        </div>

        {/* RIGHT: ORDER SUMMARY INVOICE (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-neutral-100 p-6 space-y-6 shadow-sm sticky top-24">
            
            <h2 className="font-extrabold text-base text-neutral-950 font-['Space_Grotesk'] uppercase pb-3 border-b border-neutral-100">
              Chi Tiết Đơn Hàng ({cart.length} sản phẩm)
            </h2>

            {/* Items mini list */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
              {cart.map(item => (
                <div key={item.id} className="flex gap-3 items-center">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-14 h-14 rounded-xl object-cover border border-neutral-100 bg-neutral-50 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-neutral-900 truncate">{item.productName}</h4>
                    <div className="text-[11px] text-neutral-500">
                      Size {item.size} • {item.color} • x{item.quantity}
                    </div>
                  </div>
                  <div className="text-xs font-extrabold text-neutral-950 shrink-0">
                    {formatCurrency(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations breakdown */}
            <div className="space-y-2 text-xs text-neutral-600 pt-3 border-t border-neutral-100">
              <div className="flex justify-between">
                <span>Tạm tính tiền hàng:</span>
                <span className="font-bold text-neutral-900">{formatCurrency(subtotal)}</span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Mã khuyến mãi ({appliedCoupon?.code}):</span>
                  <span>-{formatCurrency(couponDiscount)}</span>
                </div>
              )}

              {giftCardDiscount > 0 && (
                <div className="flex justify-between text-amber-600 font-medium">
                  <span>Thẻ quà tặng ({appliedGiftCard?.code}):</span>
                  <span>-{formatCurrency(giftCardDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Cước vận chuyển:</span>
                <span className="font-bold text-neutral-900">
                  {shippingCost === 0 ? <strong className="text-emerald-600">Miễn Phí</strong> : formatCurrency(shippingCost)}
                </span>
              </div>

              <div className="flex justify-between text-base font-extrabold text-neutral-950 pt-3 border-t border-neutral-200">
                <span>Tổng tiền thanh toán:</span>
                <span className="text-lg text-rose-600">{formatCurrency(finalTotal)}</span>
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              id="checkout-submit-order-btn"
              disabled={isProcessing}
              className={`w-full py-4 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl transition-all ${
                isProcessing
                  ? 'bg-neutral-400 text-white cursor-wait'
                  : 'bg-neutral-950 text-white hover:bg-neutral-800'
              }`}
            >
              {isProcessing ? (
                <span>Đang xử lý đơn hàng...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>
                    {paymentMethod === 'vnpay'
                      ? 'Thanh Toán Ngay Qua VNPay'
                      : 'Hoàn Tất Đặt Hàng'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-100 text-[11px] text-neutral-500 space-y-1.5">
              <div className="flex items-center gap-2 text-neutral-800 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Bảo mật giao dịch tuyệt đối</span>
              </div>
              <p>
                Bằng việc nhấn đặt hàng, bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của PY.
              </p>
            </div>

          </div>
        </div>

      </form>

    </div>
  );
};
