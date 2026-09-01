import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/common/ProductCard';
import { formatCurrency } from '../utils/format';
import {
  ArrowRight,
  Flame,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Clock,
  TrendingUp,
  Award,
  ChevronRight,
  CheckCircle,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { products, categories, brands, blogs } = useShop();

  // Flash sale countdown timer state
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 35, seconds: 48 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const flashSaleProducts = products.filter(p => p.salePrice && p.salePrice < p.originalPrice).slice(0, 4);
  const newArrivals = products.filter(p => p.isNew).slice(0, 4);
  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 4);

  return (
    <div className="space-y-8 sm:space-y-16 pb-12 sm:pb-16">
      
      {/* 1. HERO BANNER */}
      <section className="relative overflow-hidden bg-neutral-950 text-white rounded-3xl mx-3 sm:mx-6 lg:mx-8 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[420px] sm:min-h-[540px] items-center">
          
          <div className="lg:col-span-7 p-5 sm:p-12 lg:p-16 space-y-4 sm:space-y-6 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-800/90 border border-neutral-700 text-neutral-300 text-[11px] sm:text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Bộ Sưu Tập Mới 2025 • Độc Quyền Chính Hãng</span>
            </div>

            <h1 className="text-2xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-['Space_Grotesk'] leading-tight">
              NÂNG TẦM <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-neutral-500">
                PHONG CÁCH SNEAKER
              </span>
            </h1>

            <p className="text-neutral-400 text-xs sm:text-base max-w-lg leading-relaxed">
              Trải nghiệm các bản phát hành kinh điển từ Nike, Jordan, Adidas và New Balance. 100% cam kết chính hãng với quy trình kiểm định nghiêm ngặt.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-1 sm:pt-2">
              <button
                id="hero-shop-now-btn"
                onClick={() => onNavigate('products')}
                className="flex-1 sm:flex-none px-5 sm:px-6 py-3 sm:py-3.5 bg-white text-neutral-950 font-extrabold text-xs sm:text-sm rounded-2xl hover:bg-neutral-200 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl group"
              >
                <span>Khám Phá Ngay</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="hero-sale-btn"
                onClick={() => onNavigate('products', { filter: 'sale' })}
                className="flex-1 sm:flex-none px-5 sm:px-6 py-3 sm:py-3.5 bg-neutral-900 border border-neutral-800 text-white font-extrabold text-xs sm:text-sm rounded-2xl hover:bg-neutral-800 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Flame className="w-4 h-4 text-rose-500" />
                <span>Săn Sale -40%</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-neutral-800/80 max-w-md text-xs">
              <div>
                <div className="font-extrabold text-white text-base sm:text-xl font-['Space_Grotesk']">10,000+</div>
                <div className="text-neutral-400 text-[10px] sm:text-[11px]">Đã bán</div>
              </div>
              <div>
                <div className="font-extrabold text-white text-base sm:text-xl font-['Space_Grotesk']">100%</div>
                <div className="text-neutral-400 text-[10px] sm:text-[11px]">Chính hãng Auth</div>
              </div>
              <div>
                <div className="font-extrabold text-white text-base sm:text-xl font-['Space_Grotesk']">4.9/5★</div>
                <div className="text-neutral-400 text-[10px] sm:text-[11px]">Đánh giá tốt</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative h-56 sm:h-96 lg:h-full flex items-center justify-center p-4 sm:p-6">
            <div className="relative w-full max-w-xs sm:max-w-md aspect-square">
              <img
                src="https://images.unsplash.com/photo-1552346154-21d32810aba3?w=900&auto=format&fit=crop&q=80"
                alt="Featured Sneaker"
                className="w-full h-full object-cover rounded-3xl shadow-2xl border border-neutral-800 rotate-2 hover:rotate-0 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-3 -left-3 bg-neutral-900/95 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-neutral-700 shadow-xl hidden sm:block">
                <div className="text-xs text-neutral-400">Xu hướng nổi bật</div>
                <div className="text-sm font-bold text-white">Nike Air Jordan Retro</div>
                <div className="text-xs font-extrabold text-rose-500 mt-0.5">Tiết kiệm 20% hôm nay</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. POPULAR BRANDS ROW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h2 className="text-base sm:text-xl font-extrabold text-neutral-950 dark:text-white uppercase tracking-tight font-['Space_Grotesk']">
              Thương Hiệu Hàng Đầu
            </h2>
            <p className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400">Đối tác phân phối giày chính hãng toàn cầu</p>
          </div>
          <button
            id="see-all-brands-btn"
            onClick={() => onNavigate('products')}
            className="text-xs font-bold text-neutral-900 dark:text-neutral-200 hover:underline flex items-center gap-1.5 group"
          >
            <span>Tất cả</span>
            <span className="w-5 h-5 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700 transition-colors">
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-4">
          {brands.map(brand => (
            <button
              key={brand.id}
              id={`brand-card-${brand.slug}`}
              onClick={() => onNavigate('products', { brand: brand.slug })}
              className="flex flex-col items-center justify-center p-3 sm:p-4 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-neutral-100 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-white hover:shadow-md transition-all group active:scale-95"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden mb-1.5 sm:mb-2 flex items-center justify-center p-1 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 group-hover:scale-105 transition-transform">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-950 dark:group-hover:text-white text-center truncate w-full">
                {brand.name}
              </span>
              <span className="text-[10px] text-neutral-400 font-medium">{brand.productCount || 6}+ mẫu</span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. FLASH SALE SECTION */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-rose-950 via-neutral-950 to-neutral-950 rounded-3xl p-4 sm:p-8 text-white shadow-xl">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-rose-900/40">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-2.5 bg-rose-600 rounded-2xl shadow-lg shrink-0">
                <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-bounce" />
              </div>
              <div>
                <h2 className="text-lg sm:text-2xl font-extrabold font-['Space_Grotesk'] tracking-tight leading-tight">
                  FLASH SALE TRONG NGÀY
                </h2>
                <p className="text-[11px] sm:text-xs text-rose-200/80">Số lượng có hạn • Giảm sâu lên đến 40%</p>
              </div>
            </div>

            {/* Countdown Timer & See All Button */}
            <div className="flex items-center justify-between sm:justify-end gap-3">
              <div className="flex items-center gap-2 bg-neutral-900/80 sm:bg-transparent p-2 sm:p-0 rounded-xl border border-rose-900/30 sm:border-0">
                <Clock className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="text-[11px] sm:text-xs font-semibold text-neutral-300">Còn:</span>
                <div className="flex items-center gap-1 font-mono font-extrabold text-xs sm:text-sm">
                  <span className="px-2 py-1 bg-rose-900/80 border border-rose-700 rounded-lg text-white">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-rose-400">:</span>
                  <span className="px-2 py-1 bg-rose-900/80 border border-rose-700 rounded-lg text-white">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-rose-400">:</span>
                  <span className="px-2 py-1 bg-rose-600 rounded-lg text-white animate-pulse">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('products', { filter: 'sale' })}
                className="text-xs font-bold text-rose-300 hover:text-white flex items-center gap-1 bg-rose-900/40 border border-rose-700/50 px-2.5 py-1.5 rounded-xl sm:bg-transparent sm:border-0 sm:p-0"
              >
                <span>Xem hết</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 2-column on mobile, 4-col on desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6 mt-4 sm:mt-6">
            {flashSaleProducts.map(prod => (
              <ProductCard key={prod.id} product={prod} onNavigate={onNavigate} />
            ))}
          </div>

          {/* Mobile Bottom Arrow Button */}
          <div className="mt-3.5 sm:hidden">
            <button
              onClick={() => onNavigate('products', { filter: 'sale' })}
              className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/20 active:scale-98 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all"
            >
              <span>Xem tất cả sản phẩm Flash Sale</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* 4. NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
              <h2 className="text-base sm:text-2xl font-extrabold text-neutral-950 dark:text-white uppercase tracking-tight font-['Space_Grotesk']">
                HÀNG MỚI VỀ (NEW ARRIVALS)
              </h2>
            </div>
            <p className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400">Những thiết kế mới nhất vừa lên kệ tuần này</p>
          </div>
          <button
            id="see-all-new-btn"
            onClick={() => onNavigate('products', { filter: 'new' })}
            className="text-xs font-bold text-neutral-900 dark:text-neutral-200 hover:underline flex items-center gap-1.5 group"
          >
            <span>Xem tất cả</span>
            <span className="w-5 h-5 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700 transition-colors">
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </button>
        </div>

        {/* 2-column on mobile, 4-col on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
          {newArrivals.map(prod => (
            <ProductCard key={prod.id} product={prod} onNavigate={onNavigate} />
          ))}
        </div>

        {/* Mobile Bottom Arrow Button */}
        <div className="mt-3.5 sm:hidden">
          <button
            onClick={() => onNavigate('products', { filter: 'new' })}
            className="w-full py-2.5 px-4 bg-neutral-100 dark:bg-neutral-800/80 active:scale-98 rounded-xl text-xs font-bold text-neutral-900 dark:text-white flex items-center justify-center gap-1.5 transition-all"
          >
            <span>Xem tất cả Hàng Mới Về</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 5. CATEGORIES SHOWCASE GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-2xl font-extrabold text-neutral-950 dark:text-white font-['Space_Grotesk'] uppercase">
            DANH MỤC NỔI BẬT
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Lựa chọn kiểu dáng phù hợp với phong cách và hoạt động của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
          {categories.slice(0, 6).map(cat => (
            <div
              key={cat.id}
              id={`category-banner-${cat.slug}`}
              onClick={() => onNavigate('products', { category: cat.slug })}
              className="group relative h-48 sm:h-64 rounded-3xl overflow-hidden cursor-pointer shadow-md"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/40 to-transparent p-5 sm:p-6 flex flex-col justify-end text-white">
                <span className="text-[10px] sm:text-[11px] uppercase font-bold text-amber-400 tracking-wider">Bộ sưu tập</span>
                <h3 className="text-lg sm:text-xl font-extrabold font-['Space_Grotesk'] mt-0.5">{cat.name}</h3>
                <p className="text-xs text-neutral-300 line-clamp-1 mt-1">{cat.description}</p>
                <div className="flex items-center gap-1.5 text-xs font-bold text-white mt-2.5 sm:mt-3 group-hover:underline">
                  <span>Khám phá ngay</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. BEST SELLERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
              <h2 className="text-base sm:text-2xl font-extrabold text-neutral-950 dark:text-white uppercase tracking-tight font-['Space_Grotesk']">
                SẢN PHẨM BÁN CHẠY NHẤT
              </h2>
            </div>
            <p className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400">Các mẫu giày được cộng đồng sneaker săn đón nhiều nhất</p>
          </div>
          <button
            id="see-all-bestsellers-btn"
            onClick={() => onNavigate('products', { filter: 'bestseller' })}
            className="text-xs font-bold text-neutral-900 dark:text-neutral-200 hover:underline flex items-center gap-1.5 group"
          >
            <span>Xem tất cả</span>
            <span className="w-5 h-5 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700 transition-colors">
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </button>
        </div>

        {/* 2-column on mobile, 4-col on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
          {bestSellers.map(prod => (
            <ProductCard key={prod.id} product={prod} onNavigate={onNavigate} />
          ))}
        </div>

        {/* Mobile Bottom Arrow Button */}
        <div className="mt-3.5 sm:hidden">
          <button
            onClick={() => onNavigate('products', { filter: 'bestseller' })}
            className="w-full py-2.5 px-4 bg-neutral-100 dark:bg-neutral-800/80 active:scale-98 rounded-xl text-xs font-bold text-neutral-900 dark:text-white flex items-center justify-center gap-1.5 transition-all"
          >
            <span>Xem tất cả Sản Phẩm Bán Chạy</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 7. AUTHENTICITY & SERVICE BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-neutral-100 dark:bg-[#1a1a1a] rounded-3xl p-6 sm:p-12 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center border border-neutral-200/60 dark:border-neutral-800">
          <div className="space-y-3.5 sm:space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-bold shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Tiêu Chuẩn Kiểm Định PY Verify™</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-neutral-950 dark:text-white font-['Space_Grotesk'] leading-tight">
              CHÚNG TÔI NÓI KHÔNG VỚI HÀNG GIẢ & HÀNG KÉM CHẤT LƯỢNG
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Mỗi đôi giày bán ra tại PY đều trải qua quy trình kiểm định 6 bước: từ mã barcode, chất liệu da, tem đế, đường may, phụ kiện đi kèm cho đến hộp nguyên bản.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-xs font-semibold text-neutral-800 dark:text-neutral-200 pt-1 sm:pt-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Hoàn tiền 200% nếu phát hiện fake</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Bảo hành keo chỉ 12 tháng</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Hỗ trợ đổi size trong 30 ngày</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Kiểm tra hàng trước khi thanh toán</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80"
              alt="Authenticity Inspection"
              className="w-full h-56 sm:h-80 object-cover rounded-2xl shadow-xl"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* 8. LATEST SNEAKER BLOG & TRENDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h2 className="text-base sm:text-2xl font-extrabold text-neutral-950 dark:text-white uppercase tracking-tight font-['Space_Grotesk']">
              TIN TỨC & XU HƯỚNG SNEAKER
            </h2>
            <p className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400">Cẩm nang chọn giày, cách vệ sinh và tin tức thời trang mới nhất</p>
          </div>
          <button
            id="see-all-blogs-btn"
            onClick={() => onNavigate('blog')}
            className="text-xs font-bold text-neutral-900 dark:text-neutral-200 hover:underline flex items-center gap-1"
          >
            <span>Xem tất cả</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {blogs.slice(0, 3).map(post => (
            <div
              key={post.id}
              onClick={() => onNavigate('blog-detail', { slug: post.slug })}
              className="bg-white dark:bg-[#1a1a1a] rounded-3xl border border-neutral-100 dark:border-neutral-800 overflow-hidden hover:shadow-xl hover:border-neutral-200 dark:hover:border-neutral-700 transition-all cursor-pointer group flex flex-col"
            >
              <div className="aspect-video w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5 sm:mb-2">
                    <span className="text-amber-600 dark:text-amber-400">{post.category}</span>
                    <span>•</span>
                    <span>{post.publishedAt}</span>
                  </div>
                  <h3 className="text-xs sm:text-base font-extrabold text-neutral-950 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 line-clamp-2 leading-snug transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 mt-1.5 sm:mt-2 leading-relaxed">
                    {post.summary}
                  </p>
                </div>

                <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs font-bold text-neutral-900 dark:text-white group-hover:underline">
                  <span>Đọc tiếp</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
