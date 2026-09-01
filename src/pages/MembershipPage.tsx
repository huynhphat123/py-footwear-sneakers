import React from 'react';
import { useShop } from '../context/ShopContext';
import { formatCurrency } from '../utils/format';
import {
  Award,
  Crown,
  Sparkles,
  Gift,
  Truck,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

interface MembershipPageProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const MembershipPage: React.FC<MembershipPageProps> = ({ onNavigate }) => {
  const { currentUser, setIsAuthModalOpen, setAuthModalMode } = useShop();

  const tiers = [
    {
      name: 'Hội Viên Đồng (Bronze)',
      spending: '0đ - 5.000.000đ',
      color: 'from-amber-700 to-amber-900',
      badge: 'Đồng',
      perks: [
        'Tích lũy 1% giá trị mọi đơn hàng thành điểm thưởng',
        'Quà tặng sinh nhật voucher 100.000đ',
        'Miễn phí vận chuyển cho đơn hàng từ 3.000.000đ',
        'Ưu tiên nhận thông báo phát hành sneaker mới',
      ],
    },
    {
      name: 'Hội Viên Bạc (Silver)',
      spending: '5.000.000đ - 15.000.000đ',
      color: 'from-slate-400 to-slate-600',
      badge: 'Bạc',
      perks: [
        'Tích lũy 2% giá trị đơn hàng thành điểm thưởng',
        'Voucher sinh nhật giảm 200.000đ',
        'Miễn phí giao hàng hỏa tốc nội thành 2 lần/năm',
        'Tham gia Private Sale sớm 24H trước công chúng',
      ],
    },
    {
      name: 'Hội Viên Vàng (Gold)',
      spending: '15.000.000đ - 35.000.000đ',
      color: 'from-amber-400 to-yellow-600',
      badge: 'Vàng VIP',
      isPopular: true,
      perks: [
        'Tích lũy 3% giá trị đơn hàng thành điểm thưởng',
        'Giảm trực tiếp 5% cho tất cả đơn hàng nguyên giá',
        'Voucher sinh nhật 500.000đ',
        'Miễn phí giao hàng toàn quốc không giới hạn giá trị',
        'Ưu tiên slot mua các phiên bản giới hạn (Raffle & Collab)',
      ],
    },
    {
      name: 'Hội Viên Kim Cương (Diamond)',
      spending: 'Trên 35.000.000đ',
      color: 'from-sky-400 to-indigo-600',
      badge: 'Kim Cương',
      perks: [
        'Tích lũy 5% giá trị đơn hàng',
        'Giảm trực tiếp 10% trọn đời cho mọi đơn hàng',
        'Voucher sinh nhật trị giá 1.000.000đ',
        'Tư vấn viên cá nhân & Chăm sóc vệ sinh giày miễn phí 1 năm',
        'Mời tham dự sự kiện ra mắt Sneaker VIP độc quyền',
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* 1. HERO BANNER */}
      <div className="bg-neutral-950 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-amber-400 text-neutral-950 font-extrabold text-xs rounded-xl uppercase">
            <Crown className="w-3.5 h-3.5" />
            <span>PY Club Membership</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-['Space_Grotesk'] leading-tight">
            NÂNG TẦM TRẢI NGHIỆM VỚI ĐẶC QUYỀN VIP
          </h1>

          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            Mỗi lần mua sắm tại PY là một bước nâng cấp hạng thành viên để nhận chiết khấu trọn đời, voucher sinh nhật và ưu tiên sở hữu những siêu phẩm sneaker hot nhất.
          </p>

          {!currentUser ? (
            <button
              onClick={() => {
                setAuthModalMode('register');
                setIsAuthModalOpen(true);
              }}
              className="px-8 py-4 bg-white text-neutral-950 rounded-2xl font-extrabold text-xs hover:bg-neutral-100 transition-all shadow-xl inline-flex items-center gap-2"
            >
              <span>Đăng Ký Hội Viên Miễn Phí</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="p-4 bg-neutral-900/80 rounded-2xl border border-neutral-800 text-xs inline-flex items-center gap-4">
              <div>
                <span className="text-neutral-400">Hạng hiện tại:</span>
                <div className="font-extrabold text-amber-400 text-sm">Hội Viên Vàng VIP</div>
              </div>
              <div className="h-6 w-px bg-neutral-800" />
              <div>
                <span className="text-neutral-400">Điểm khả dụng:</span>
                <div className="font-extrabold text-white text-sm">1,250 Điểm</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. MEMBERSHIP TIERS GRID */}
      <div>
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl font-extrabold text-neutral-950 font-['Space_Grotesk']">
            CÁC HẠNG HỘI VIÊN & QUYỀN LỢI
          </h2>
          <p className="text-xs text-neutral-500">
            Hạng thành viên được tự động tính dựa trên tổng chi tiêu tích lũy trong 12 tháng.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-3xl border p-6 flex flex-col justify-between transition-all ${
                tier.isPopular ? 'border-neutral-950 shadow-xl ring-2 ring-neutral-950/10' : 'border-neutral-100 shadow-sm hover:shadow-md'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-neutral-100 text-neutral-800 rounded-full text-[11px] font-extrabold uppercase">
                    {tier.badge}
                  </span>
                  {tier.isPopular && (
                    <span className="px-2.5 py-0.5 bg-amber-400 text-neutral-950 rounded-md text-[10px] font-extrabold">
                      PHỔ BIẾN
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-extrabold text-base text-neutral-950 font-['Space_Grotesk']">
                    {tier.name}
                  </h3>
                  <div className="text-xs text-neutral-500 mt-1 font-mono">
                    Chi tiêu: <strong>{tier.spending}</strong>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-100 space-y-2.5 text-xs text-neutral-700">
                  {tier.perks.map((perk, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => onNavigate('products')}
                  className="w-full py-3 bg-neutral-950 hover:bg-neutral-800 text-white rounded-2xl text-xs font-bold transition-all"
                >
                  Mua Sắm Tích Điểm
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
