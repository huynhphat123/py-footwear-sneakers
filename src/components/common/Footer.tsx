import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import {
  MapPin,
  Clock,
  Mail,
  ShieldCheck,
  RotateCcw,
  Truck,
  CreditCard,
  Send,
  CheckCircle2,
  Instagram,
  Facebook,
  Youtube,
  Code2,
} from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { categories, brands, stores, settings, showToast } = useShop();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Vui lòng nhập địa chỉ email hợp lệ!', 'error');
      return;
    }
    setSubscribed(true);
    showToast('Đăng ký nhận tin thành công! Mã WELCOME10 đã được kích hoạt cho bạn.', 'success');
    setEmail('');
  };

  return (
    <footer className="bg-neutral-950 text-neutral-300 pt-16 pb-12 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* VALUE PROPOSITION BADGES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 mb-12 border-b border-neutral-800">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800/80">
            <div className="p-3 bg-neutral-800 text-white rounded-xl">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">100% CHÍNH HÃNG</h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Cam kết đền bù 200% giá trị đơn hàng nếu phát hiện hàng giả hoặc không chuẩn auth.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800/80">
            <div className="p-3 bg-neutral-800 text-white rounded-xl">
              <RotateCcw className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">30 NGÀY ĐỔI TRẢ</h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Đổi size, đổi mẫu linh hoạt và miễn phí trong vòng 30 ngày nếu sản phẩm chưa qua sử dụng.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800/80">
            <div className="p-3 bg-neutral-800 text-white rounded-xl">
              <Truck className="w-6 h-6 text-sky-400" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">MIỄN PHÍ VẬN CHUYỂN</h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Áp dụng toàn quốc cho mọi đơn hàng từ 3.000.000 VNĐ. Giao hỏa tốc 2H nội thành.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800/80">
            <div className="p-3 bg-neutral-800 text-white rounded-xl">
              <CreditCard className="w-6 h-6 text-rose-400" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">THANH TOÁN AN TOÀN</h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Hỗ trợ cổng VNPay bảo mật mã hóa cao cấp, COD nhận hàng kiểm tra mới thanh toán.
              </p>
            </div>
          </div>
        </div>

        {/* MAIN FOOTER COLUMNS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-neutral-800">

          {/* Col 1: Brand & Contact Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-white text-neutral-950 rounded-xl flex items-center justify-center font-extrabold text-xl font-['Space_Grotesk']">
                PY
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight font-['Space_Grotesk']">
                PY
              </span>
            </div>

            <p className="text-sm text-neutral-400 leading-relaxed max-w-sm">
              Chuỗi bán lẻ giày sneaker, giày thể thao và phụ kiện cao cấp chính hãng hàng đầu tại Việt Nam. Không gian mua sắm chuẩn quốc tế với các bản phát hành độc quyền từ Nike, Adidas, Jordan, New Balance, Asics.
            </p>

            <div className="space-y-2.5 pt-2 text-xs text-neutral-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                <span>{settings?.storeAddress || '69 Trương Văn Bang, Phường Bình Hưng, Thủ Đức'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-neutral-500 shrink-0" />
                <span>Giờ làm việc: {settings?.storeWorkingHours || '09:00 - 17:30'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-neutral-500 shrink-0" />
                <span>Email: <a href={`mailto:${settings?.storeEmail || 'phatht@tcr.vn'}`} className="text-neutral-300 hover:text-white underline">{settings?.storeEmail || 'phatht@tcr.vn'}</a></span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <a href="#facebook" className="w-8 h-8 rounded-full bg-neutral-900 hover:bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#instagram" className="w-8 h-8 rounded-full bg-neutral-900 hover:bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#youtube" className="w-8 h-8 rounded-full bg-neutral-900 hover:bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Danh Mục Sản Phẩm
            </h3>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              {categories.slice(0, 6).map(cat => (
                <li key={cat.id}>
                  <button
                    id={`footer-cat-${cat.slug}-btn`}
                    onClick={() => onNavigate('products', { category: cat.slug })}
                    className="hover:text-white transition-colors text-left"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
              <li>
                <button
                  id="footer-sale-link-btn"
                  onClick={() => onNavigate('products', { filter: 'sale' })}
                  className="text-rose-400 font-bold hover:text-rose-300"
                >
                  Sản phẩm giảm giá (Sale Off)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Service */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Hỗ Trợ Khách Hàng
            </h3>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <button onClick={() => onNavigate('blog', { slug: 'bang-huong-dan-chon-size-giay-chuan' })} className="hover:text-white transition-colors">
                  Bảng quy đổi & hướng dẫn chọn size
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('blog', { slug: 'bi-quyet-ve-sinh-giay-sneaker-trang' })} className="hover:text-white transition-colors">
                  Cẩm nang chăm sóc & vệ sinh giày
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('stores')} className="hover:text-white transition-colors">
                  Hệ thống showroom & cửa hàng
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('giftcard')} className="hover:text-white transition-colors">
                  Mua và kiểm tra số dư Gift Card
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('membership')} className="hover:text-white transition-colors">
                  Đặc quyền hội viên VIP PY
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('profile', { tab: 'orders' })} className="hover:text-white transition-colors">
                  Tra cứu lịch sử đơn hàng
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Đăng Ký Nhận Tin
            </h3>
            <p className="text-xs text-neutral-400 mb-3 leading-relaxed">
              Nhận ngay mã giảm giá <strong className="text-white">10%</strong> cho đơn hàng đầu tiên và thông tin các bản phát hành giới hạn sớm nhất.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Nhập email của bạn..."
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-3 bg-white text-neutral-950 font-bold rounded-lg text-xs hover:bg-neutral-200 transition-colors flex items-center gap-1"
                >
                  <Send className="w-3 h-3" />
                </button>
              </div>
              {subscribed && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Mã: <strong>WELCOME10</strong>
                </div>
              )}
            </form>

            <div className="pt-4 mt-4 border-t border-neutral-800/80">
              <div className="text-[11px] font-semibold text-neutral-400 mb-2 uppercase tracking-wider">
                Cổng Thanh Toán Hỗ Trợ
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 bg-neutral-900 border border-neutral-800 rounded-md text-[10px] font-bold text-sky-400">
                  VNPay QR
                </span>
                <span className="px-2.5 py-1 bg-neutral-900 border border-neutral-800 rounded-md text-[10px] font-bold text-amber-400">
                  ATM Nội Địa
                </span>
                <span className="px-2.5 py-1 bg-neutral-900 border border-neutral-800 rounded-md text-[10px] font-bold text-emerald-400">
                  COD Tiền Mặt
                </span>
                <span className="px-2.5 py-1 bg-neutral-900 border border-neutral-800 rounded-md text-[10px] font-bold text-rose-400">
                  Visa / Master
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT & ARCHITECTURE INFO */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div>
            &copy; {new Date().getFullYear()} PY Co., Ltd. Tất cả quyền được bảo lưu. Thiết kế cho thương mại điện tử chuyên nghiệp.
          </div>
          <div className="flex items-center gap-4">
            <span>2025-2026</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
