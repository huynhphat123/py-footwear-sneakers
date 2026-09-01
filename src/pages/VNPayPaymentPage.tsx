import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { formatCurrency } from '../utils/format';
import { VNPayService } from '../services/vnpayService';
import { StorageService } from '../services/storageService';
import {
  QrCode,
  CreditCard,
  Building2,
  Globe,
  Clock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Lock,
  Smartphone,
} from 'lucide-react';

interface VNPayPaymentPageProps {
  orderId: string;
  orderNumber: string;
  amount: number;
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const VNPayPaymentPage: React.FC<VNPayPaymentPageProps> = ({
  orderId,
  orderNumber,
  amount,
  onNavigate,
}) => {
  const { allOrders, refreshData, showToast } = useShop();
  const [activeMethod, setActiveMethod] = useState<'qr' | 'atm' | 'intl'>('qr');
  const [selectedBank, setSelectedBank] = useState<string>('NCB');
  const [cardNumber, setCardNumber] = useState<string>('9704198526191432198');
  const [cardHolder, setCardHolder] = useState<string>('NGUYEN VAN A');
  const [cardDate, setCardDate] = useState<string>('07/26');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(900); // 15 minutes

  // Countdown timer
  useEffect(() => {
    const t = setInterval(() => {
      setCountdown(c => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const banks = [
    { code: 'VCB', name: 'Vietcombank', logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60' },
    { code: 'TCB', name: 'Techcombank', logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60' },
    { code: 'MB', name: 'MBBank', logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60' },
    { code: 'CTG', name: 'VietinBank', logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60' },
    { code: 'BIDV', name: 'BIDV', logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60' },
    { code: 'VPB', name: 'VPBank', logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60' },
    { code: 'ACB', name: 'ACB Bank', logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60' },
    { code: 'NCB', name: 'NCB (Test Bank)', logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60' },
  ];

  // SIMULATE SUCCESSFUL PAYMENT RETURN (ResponseCode '00')
  const handlePaymentSuccess = () => {
    setIsProcessing(true);

    setTimeout(() => {
      // 1. Find Order
      const orders = StorageService.getOrders();
      const order = orders.find(o => o.id === orderId || o.orderNumber === orderNumber);

      if (order) {
        // 2. Finalize stock deduction in StorageService
        const itemsToConfirm = order.items.map(i => ({
          variantId: i.variantId,
          productId: i.productId,
          quantity: i.quantity,
        }));
        StorageService.confirmStockDeduction(itemsToConfirm);

        // 3. Mark Order as Paid
        order.paymentStatus = 'paid';
        order.orderStatus = 'processing';
        const txnIdFlag = `VNP${Date.now()}`;
        order.vnpayTransactionId = txnIdFlag;
        order.timeline.push({
          status: 'processing',
          timestamp: new Date().toISOString(),
          note: `Thanh toán thành công qua VNPay (Mã GD: ${txnIdFlag})`,
        });
        StorageService.saveOrder(order);
      }

      refreshData();
      showToast('Xác nhận thanh toán VNPay thành công 100%!', 'success');
      onNavigate('order-success', { orderId });
    }, 1000);
  };

  // SIMULATE CANCELLED / FAILED PAYMENT
  const handlePaymentCancel = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const orders = StorageService.getOrders();
      const order = orders.find(o => o.id === orderId || o.orderNumber === orderNumber);

      if (order) {
        // Release reserved stock back to pool
        const itemsToRelease紧 = order.items.map(i => ({
          variantId: i.variantId,
          productId: i.productId,
          quantity: i.quantity,
        }));
        StorageService.releaseReservedStock(itemsToRelease紧);

        order.paymentStatus = 'failed';
        order.orderStatus = 'cancelled';
        order.timeline.push({
          status: 'cancelled',
          timestamp: new Date().toISOString(),
          note: 'Giao dịch thanh toán VNPay bị hủy bởi người dùng hoặc quá thời hạn',
        });
        StorageService.saveOrder(order);
      }

      refreshData();
      showToast('Giao dịch VNPay đã được hủy. Đã hoàn lại tồn kho.', 'info');
      onNavigate('cart');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-10 px-4 sm:px-6 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
        
        {/* VNPAY TOP BRAND HEADER */}
        <div className="bg-slate-900 p-5 sm:p-6 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 bg-sky-600 text-white font-extrabold text-sm rounded-xl tracking-wider">
              VNPAY
            </div>
            <div>
              <div className="text-xs uppercase font-bold text-sky-400">Cổng Thanh Toán Trực Tuyến Quốc Gia</div>
              <div className="text-sm font-extrabold text-white">PY FOOTWEAR & SNEAKERS</div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-xl text-xs">
            <Clock className="w-4 h-4 text-amber-400 animate-spin" />
            <span className="text-slate-400">Thời gian giữ đơn:</span>
            <span className="font-mono font-bold text-amber-400 text-sm">{formatTime(countdown)}</span>
          </div>
        </div>

        {/* ORDER INFO BAR */}
        <div className="p-4 sm:p-6 bg-slate-900/60 border-b border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <div className="text-slate-400">Mã đơn hàng (TxnRef):</div>
            <div className="font-mono font-bold text-white text-sm mt-0.5">{orderNumber}</div>
          </div>
          <div>
            <div className="text-slate-400">Nội dung thanh toán:</div>
            <div className="font-semibold text-slate-200 mt-0.5 truncate">Thanh toan don hang {orderNumber}</div>
          </div>
          <div className="sm:text-right">
            <div className="text-slate-400">Số tiền thanh toán:</div>
            <div className="font-extrabold text-emerald-400 text-lg sm:text-xl font-['Space_Grotesk'] mt-0.5">
              {formatCurrency(amount)}
            </div>
          </div>
        </div>

        {/* PAYMENT METHOD TABS */}
        <div className="p-6">
          <div className="flex border-b border-slate-800 gap-4 mb-6">
            <button
              onClick={() => setActiveMethod('qr')}
              className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 -mb-px transition-all ${
                activeMethod === 'qr'
                  ? 'border-sky-500 text-sky-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>VNPAY QR</span>
            </button>

            <button
              onClick={() => setActiveMethod('atm')}
              className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 -mb-px transition-all ${
                activeMethod === 'atm'
                  ? 'border-sky-500 text-sky-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Thẻ ATM / Tài Khoản Nội Địa</span>
            </button>

            <button
              onClick={() => setActiveMethod('intl')}
              className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 -mb-px transition-all ${
                activeMethod === 'intl'
                  ? 'border-sky-500 text-sky-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Thẻ Quốc Tế (Visa / Master)</span>
            </button>
          </div>

          {/* TAB 1: QR CODE */}
          {activeMethod === 'qr' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-4">
              <div className="flex flex-col items-center p-6 bg-white rounded-3xl shadow-xl border border-slate-800">
                <div className="w-48 h-48 sm:w-56 sm:h-56 bg-slate-900 rounded-2xl flex flex-col items-center justify-center p-4 relative overflow-hidden">
                  {/* Generated QR Code Graphic */}
                  <div className="w-full h-full bg-white rounded-xl p-2 flex items-center justify-center">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=VNPAY_PAYMENT_URL_DEMO_${orderNumber}_${amount}`}
                      alt="VNPay QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="absolute inset-0 border-2 border-sky-500/30 rounded-2xl pointer-events-none" />
                </div>
                <div className="text-center mt-3 text-slate-900">
                  <div className="text-xs font-bold">Quét mã QR để thanh toán</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Sử dụng ứng dụng Mobile Banking hoặc Ví điện tử</div>
                </div>
              </div>

              <div className="space-y-4 text-xs text-slate-300">
                <h4 className="font-bold text-white text-sm">Hướng dẫn thanh toán bằng VNPAY QR:</h4>
                <ol className="space-y-2 list-decimal pl-4 leading-relaxed">
                  <li>Mở ứng dụng Mobile Banking của bạn (Vietcombank, MB, Techcombank, VPBank, ACB...).</li>
                  <li>Chọn tính năng <strong>Quét mã QR (QR Pay)</strong>.</li>
                  <li>Hướng camera quét mã QR hiển thị trên màn hình.</li>
                  <li>Kiểm tra số tiền <strong>{formatCurrency(amount)}</strong> và xác nhận thanh toán bằng OTP.</li>
                </ol>
                <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Giao dịch được mã hóa chuẩn HMAC SHA512 theo tiêu chuẩn của Ngân hàng Nhà nước.</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DOMESTIC ATM CARDS */}
          {activeMethod === 'atm' && (
            <div className="space-y-6 py-4">
              <div>
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                  Chọn Ngân hàng phát hành thẻ:
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {banks.map(b => (
                    <button
                      key={b.code}
                      onClick={() => setSelectedBank(b.code)}
                      className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-between transition-all ${
                        selectedBank === b.code
                          ? 'border-sky-500 bg-sky-950/60 text-white shadow-md shadow-sky-950'
                          : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span>{b.code}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{b.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="max-w-md space-y-3 bg-slate-900 p-5 rounded-2xl border border-slate-800">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Số thẻ ATM *</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Tên in trên thẻ (không dấu) *</label>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={e => setCardHolder(e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs uppercase font-mono text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Ngày phát hành (MM/YY) *</label>
                  <input
                    type="text"
                    value={cardDate}
                    onChange={e => setCardDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: INTERNATIONAL CARDS */}
          {activeMethod === 'intl' && (
            <div className="max-w-md space-y-4 py-4">
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-slate-800 rounded-lg text-xs font-bold text-sky-400">VISA</span>
                <span className="px-3 py-1 bg-slate-800 rounded-lg text-xs font-bold text-rose-400">MasterCard</span>
                <span className="px-3 py-1 bg-slate-800 rounded-lg text-xs font-bold text-emerald-400">JCB</span>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Số thẻ tín dụng / ghi nợ *</label>
                <input
                  type="text"
                  placeholder="4000 1234 5678 9010"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-sky-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Hạn sử dụng (MM/YY) *</label>
                  <input
                    type="text"
                    placeholder="12/28"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">CVV / CVC *</label>
                  <input
                    type="password"
                    placeholder="•••"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SANDBOX TEST CONTROLS */}
          <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={handlePaymentCancel}
              disabled={isProcessing}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Hủy giao dịch & Quay lại</span>
            </button>

            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <button
                id="vnpay-test-fail-btn"
                onClick={handlePaymentCancel}
                disabled={isProcessing}
                className="flex-1 sm:flex-initial px-4 py-3 bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-200 text-xs font-bold rounded-xl transition-all"
              >
                Mô Phỏng Hủy (Mã 24)
              </button>

              <button
                id="vnpay-test-success-btn"
                onClick={handlePaymentSuccess}
                disabled={isProcessing}
                className="flex-1 sm:flex-initial px-6 py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-sky-500/20 transition-all flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <span>Đang xác thực bảo mật SHA512...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Xác Nhận Đã Thanh Toán Thành Công (Mã 00)</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
