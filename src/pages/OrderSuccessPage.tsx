import React from 'react';
import { useShop } from '../context/ShopContext';
import { formatCurrency, formatDateTime } from '../utils/format';
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Printer,
  ShieldCheck,
  ShoppingBag,
  Clock,
} from 'lucide-react';

interface OrderSuccessPageProps {
  orderId?: string;
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({ orderId, onNavigate }) => {
  const { allOrders } = useShop();

  // Find order
  const order = allOrders.find(o => o.id === orderId) || allOrders[0];

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-neutral-900 mb-4">Không tìm thấy thông tin đơn hàng</h2>
        <button
          onClick={() => onNavigate('home')}
          className="px-6 py-2.5 bg-neutral-950 text-white rounded-xl text-xs font-bold"
        >
          Trở về trang chủ
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* 1. SUCCESS BANNER */}
      <div className="text-center space-y-3 bg-emerald-50 border border-emerald-200/80 rounded-3xl p-8 sm:p-10">
        <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/20">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 font-['Space_Grotesk']">
          ĐẶT HÀNG THÀNH CÔNG!
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
          Cảm ơn quý khách <strong>{order.customerName}</strong> đã tin tưởng lựa chọn PY. Chúng tôi đang tiến hành đóng gói và chuẩn bị giao hàng đến bạn.
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-emerald-200 text-xs font-mono font-bold text-neutral-900 shadow-sm mt-2">
          <span>Mã đơn hàng:</span>
          <strong className="text-emerald-700 text-sm">{order.orderNumber}</strong>
        </div>
      </div>

      {/* 2. ORDER TIMELINE & STATUS */}
      <div className="bg-white rounded-3xl border border-neutral-100 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-neutral-100">
          <div>
            <h2 className="font-extrabold text-base text-neutral-950 uppercase tracking-wider">
              Trạng Thái Đơn Hàng
            </h2>
            <p className="text-xs text-neutral-500">Khởi tạo lúc: {formatDateTime(order.createdAt)}</p>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
              order.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {order.paymentStatus === 'paid' ? 'Đã Thanh Toán' : 'Chờ Thanh Toán'}
            </span>
            <span className="px-3 py-1 rounded-full bg-neutral-950 text-white text-xs font-bold uppercase">
              {order.orderStatus === 'pending' ? 'Chờ Xử Lý' : order.orderStatus === 'processing' ? 'Đang Xử Lý' : order.orderStatus}
            </span>
          </div>
        </div>

        {/* Timeline Visual Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2 text-xs">
          <div className="p-3 bg-neutral-950 text-white rounded-2xl">
            <div className="flex items-center gap-2 font-bold mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>1. Đã Nhận Đơn</span>
            </div>
            <div className="text-[11px] text-neutral-400">Hệ thống đã ghi nhận</div>
          </div>

          <div className={`p-3 rounded-2xl border ${order.orderStatus !== 'pending' ? 'bg-neutral-950 text-white' : 'bg-neutral-50 text-neutral-600 border-neutral-200'}`}>
            <div className="flex items-center gap-2 font-bold mb-1">
              <Package className="w-4 h-4 text-amber-400" />
              <span>2. Đang Đóng Gói</span>
            </div>
            <div className="text-[11px] opacity-70">Kiểm tra tem tag & box</div>
          </div>

          <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200 text-neutral-500">
            <div className="flex items-center gap-2 font-bold mb-1">
              <Truck className="w-4 h-4" />
              <span>3. Bàn Giao Vận Chuyển</span>
            </div>
            <div className="text-[11px] opacity-70">GHTK / Viettel Post</div>
          </div>

          <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200 text-neutral-500">
            <div className="flex items-center gap-2 font-bold mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>4. Giao Thành Công</span>
            </div>
            <div className="text-[11px] opacity-70">Khách hàng nhận & thử size</div>
          </div>
        </div>

        {/* Real timeline logs */}
        {order.timeline && order.timeline.length > 0 && (
          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-2 text-xs">
            <div className="font-bold text-neutral-800 uppercase text-[11px] tracking-wider">Nhật ký xử lý:</div>
            {order.timeline.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 text-neutral-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div>
                  <span className="font-bold text-neutral-900">{formatDateTime(item.timestamp)}: </span>
                  <span>{item.note}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. ORDER ITEMS & ADDRESS DETAILS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left: Customer & Delivery Info */}
        <div className="bg-white rounded-3xl border border-neutral-100 p-6 space-y-4 shadow-sm">
          <h3 className="font-extrabold text-sm text-neutral-950 uppercase tracking-wider pb-2 border-b border-neutral-100">
            Thông Tin Giao Hàng
          </h3>

          <div className="space-y-2.5 text-xs text-neutral-700">
            <div className="flex items-center gap-2">
              <span className="font-bold text-neutral-900 w-24">Người nhận:</span>
              <span>{order.customerName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-neutral-400" />
              <span className="font-bold text-neutral-900 w-20">Điện thoại:</span>
              <span>{order.customerPhone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-neutral-400" />
              <span className="font-bold text-neutral-900 w-20">Email:</span>
              <span>{order.customerEmail}</span>
            </div>
            <div className="flex items-start gap-2 pt-1 border-t border-neutral-50">
              <MapPin className="w-3.5 h-3.5 text-neutral-400 mt-0.5" />
              <div>
                <span className="font-bold text-neutral-900">Địa chỉ nhận: </span>
                <span>{order.shippingAddress.street}, {order.shippingAddress.ward}, {order.shippingAddress.district}, {order.shippingAddress.province}</span>
              </div>
            </div>
            {order.note && (
              <div className="pt-1 text-neutral-500 italic">
                <strong>Ghi chú:</strong> {order.note}
              </div>
            )}
          </div>
        </div>

        {/* Right: Payment & Invoicing */}
        <div className="bg-white rounded-3xl border border-neutral-100 p-6 space-y-4 shadow-sm">
          <h3 className="font-extrabold text-sm text-neutral-950 uppercase tracking-wider pb-2 border-b border-neutral-100">
            Phương Thức & Thanh Toán
          </h3>

          <div className="space-y-2 text-xs text-neutral-700">
            <div className="flex justify-between">
              <span>Hình thức:</span>
              <span className="font-bold text-neutral-900 uppercase">
                {order.paymentMethod === 'vnpay' ? 'VNPay 2.1.0 Online' : order.paymentMethod === 'cod' ? 'Thanh toán COD khi nhận hàng' : 'Chuyển khoản Vietcombank'}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Trạng thái:</span>
              <span className={`font-bold ${order.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                {order.paymentStatus === 'paid' ? 'Đã hoàn tất thanh toán' : 'Chờ thu tiền khi giao hàng'}
              </span>
            </div>

            {order.paymentResponse?.vnp_TransactionNo && (
              <div className="flex justify-between text-neutral-500">
                <span>Mã GD VNPay:</span>
                <span className="font-mono">{order.paymentResponse.vnp_TransactionNo}</span>
              </div>
            )}

            <div className="pt-2 border-t border-neutral-100 space-y-1.5">
              <div className="flex justify-between text-neutral-500">
                <span>Tạm tính tiền hàng:</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Giảm giá coupon ({order.couponCode}):</span>
                  <span>-{formatCurrency(order.discount)}</span>
                </div>
              )}
              {order.giftCardDiscount && order.giftCardDiscount > 0 && (
                <div className="flex justify-between text-amber-600">
                  <span>Khấu trừ thẻ quà tặng:</span>
                  <span>-{formatCurrency(order.giftCardDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-500">
                <span>Phí vận chuyển:</span>
                <span>{order.shippingFee === 0 ? 'Miễn phí' : formatCurrency(order.shippingFee)}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-neutral-950 pt-1 border-t border-neutral-200">
                <span>Tổng giá trị đơn hàng:</span>
                <span className="text-base text-rose-600">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 4. PURCHASED ITEMS LIST */}
      <div className="bg-white rounded-3xl border border-neutral-100 p-6 sm:p-8 shadow-sm space-y-4">
        <h3 className="font-extrabold text-sm text-neutral-950 uppercase tracking-wider pb-3 border-b border-neutral-100">
          Sản Phẩm Trong Đơn Hàng ({order.items.length})
        </h3>

        <div className="divide-y divide-neutral-100">
          {order.items.map(item => (
            <div key={item.id} className="py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={item.image}
                  alt={item.productName}
                  className="w-16 h-16 rounded-2xl object-cover border border-neutral-100 bg-neutral-50 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-neutral-900">{item.productName}</h4>
                  <div className="flex items-center gap-2 text-[11px] text-neutral-500 mt-0.5">
                    <span className="bg-neutral-100 text-neutral-800 font-semibold px-2 py-0.5 rounded">Size: {item.size}</span>
                    <span>•</span>
                    <span>{item.color}</span>
                    <span>•</span>
                    <span>Số lượng: x{item.quantity}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs sm:text-sm font-extrabold text-neutral-950">
                  {formatCurrency(item.subtotal)}
                </div>
                <div className="text-[11px] text-neutral-400">
                  {formatCurrency(item.price)} / đôi
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. ACTION CTAS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-neutral-200 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span>In Hóa Đơn Mua Hàng</span>
        </button>

        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={() => onNavigate('profile', { tab: 'orders' })}
            className="flex-1 sm:flex-initial px-6 py-3.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded-2xl text-xs font-bold transition-all"
          >
            Quản Lý Đơn Hàng
          </button>

          <button
            onClick={() => onNavigate('products')}
            className="flex-1 sm:flex-initial px-8 py-3.5 bg-neutral-950 hover:bg-neutral-800 text-white rounded-2xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Tiếp Tục Mua Sắm</span>
          </button>
        </div>
      </div>

    </div>
  );
};
