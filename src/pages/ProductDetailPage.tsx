import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/common/ProductCard';
import { formatCurrency, calculateDiscountPercentage } from '../utils/format';
import { StorageService } from '../services/storageService';
import { Review } from '../types';
import {
  Star,
  ShoppingBag,
  Heart,
  ShieldCheck,
  RotateCcw,
  Truck,
  Check,
  AlertCircle,
  Plus,
  Minus,
  Sparkles,
  Flame,
  ArrowRight,
  Share2,
  CheckCircle2,
  Send,
} from 'lucide-react';

interface ProductDetailPageProps {
  slug: string;
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug, onNavigate }) => {
  const {
    products,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setIsSizeGuideOpen,
    currentUser,
    showToast,
    refreshData,
  } = useShop();

  const product = products.find(p => p.slug === slug) || products[0];

  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [activeImage, setActiveImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews' | 'shipping'>('desc');

  // Review form state
  const [newRating, setNewRating] = useState<number>(5);
  const [newReviewText, setNewReviewText] = useState<string>('');
  const [reviewsList, setReviewsList] = useState<Review[]>([]);

  // Initialize variant selection & load reviews
  useEffect(() => {
    if (product) {
      const first = product.variants[0];
      if (first) {
        setSelectedColor(first.color);
        setSelectedSize(first.size);
      }
      setActiveImage(product.mainImage);
      setQuantity(1);

      // Load reviews
      const revs = StorageService.getProductReviews(product.id);
      setReviewsList(revs);
    }
  }, [product]);

  if (!product) return null;

  // Extract unique colors & sizes
  const uniqueColors = Array.from(new Set(product.variants.map(v => v.color))).map(name => {
    const item = product.variants.find(v => v.color === name);
    return { name, hex: item?.colorHex || '#111' };
  });

  const uniqueSizes = Array.from(new Set(product.variants.map(v => v.size))).sort((a, b) => parseFloat(String(a)) - parseFloat(String(b)));

  const selectedVariant = product.variants.find(
    v => v.color === selectedColor && v.size === selectedSize
  );

  const availableStock = selectedVariant ? selectedVariant.stockQuantity - selectedVariant.reservedQuantity : 0;
  const isOutOfStock = availableStock <= 0;
  const isLowStock = availableStock > 0 && availableStock <= 3;

  const currentPrice = selectedVariant?.salePrice || selectedVariant?.price || product.salePrice || product.originalPrice;
  const originalPrice = selectedVariant?.price || product.originalPrice;
  const discountPercent = calculateDiscountPercentage(originalPrice, currentPrice);

  const handleAddToCart = () => {
    if (!selectedVariant || isOutOfStock) return;
    addToCart(product, selectedVariant, quantity);
  };

  const handleBuyNow = () => {
    if (!selectedVariant || isOutOfStock) return;
    const added = addToCart(product, selectedVariant, quantity);
    if (added) {
      onNavigate('checkout');
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Đã sao chép liên kết sản phẩm vào bộ nhớ tạm!', 'success');
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      productId: product.id,
      userId: currentUser?.id || 'guest',
      userName: currentUser?.name || 'Khách Hàng',
      userAvatar: currentUser?.avatar,
      rating: newRating,
      comment: newReviewText,
      status: 'approved',
      createdAt: new Date().toISOString().split('T')[0],
    };

    StorageService.addReview(newRev);
    setReviewsList(prev => [newRev, ...prev]);
    setNewReviewText('');
    showToast('Cảm ơn bạn đã gửi đánh giá cho sản phẩm!', 'success');
    refreshData();
  };

  // Related products
  const relatedProducts = products
    .filter(p => p.id !== product.id && (p.brandId === product.brandId || p.categoryId === product.categoryId))
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* 1. BREADCRUMB */}
      <div className="text-xs text-neutral-500">
        <span className="hover:underline cursor-pointer" onClick={() => onNavigate('home')}>Trang chủ</span> /{' '}
        <span className="hover:underline cursor-pointer" onClick={() => onNavigate('products', { category: product.categoryName.toLowerCase() })}>{product.categoryName}</span> /{' '}
        <span className="hover:underline cursor-pointer" onClick={() => onNavigate('products', { brand: product.brandName.toLowerCase() })}>{product.brandName}</span> /{' '}
        <span className="text-neutral-900 font-bold truncate">{product.name}</span>
      </div>

      {/* 2. MAIN PRODUCT VIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* LEFT: IMAGE GALLERY (7 COLS) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-neutral-100 border border-neutral-200/80 shadow-sm">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-300"
              referrerPolicy="no-referrer"
            />
            {discountPercent > 0 && (
              <div className="absolute top-4 left-4 bg-rose-600 text-white font-extrabold text-xs px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" /> GIẢM {discountPercent}%
              </div>
            )}
            {product.isNew && (
              <div className="absolute top-4 right-4 bg-neutral-950 text-white font-extrabold text-xs px-3 py-1.5 rounded-xl shadow-lg">
                HÀNG MỚI VỀ
              </div>
            )}
          </div>

          {/* Thumbnails row */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {product.galleryImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 transition-all shrink-0 bg-neutral-50 ${
                  activeImage === img ? 'border-neutral-950 scale-95 shadow-md' : 'border-transparent hover:border-neutral-300 opacity-70'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>

          {/* VALUE ASSURANCE PILLARS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
            <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-2xl border border-neutral-200/70 text-xs">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <div className="font-bold text-neutral-900">100% Chính Hãng</div>
                <div className="text-[11px] text-neutral-500">Đền bù gấp 2 lần nếu giả</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-2xl border border-neutral-200/70 text-xs">
              <RotateCcw className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <div className="font-bold text-neutral-900">30 Ngày Đổi Trả</div>
                <div className="text-[11px] text-neutral-500">Đổi size tận nơi miễn phí</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-2xl border border-neutral-200/70 text-xs">
              <Truck className="w-5 h-5 text-sky-600 shrink-0" />
              <div>
                <div className="font-bold text-neutral-900">Free Ship Toàn Quốc</div>
                <div className="text-[11px] text-neutral-500">Cho đơn từ 3.000.000đ</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: BUY CONTROLS & DETAILS (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Header Info */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase text-neutral-400 tracking-wider">
                {product.brandName} • {product.categoryName} • {product.gender}
              </span>
              <button
                onClick={handleShare}
                className="text-neutral-400 hover:text-neutral-950 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
                title="Chia sẻ sản phẩm"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 mt-1.5 font-['Space_Grotesk'] leading-snug">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-neutral-200'}`} />
                ))}
              </div>
              <span className="text-xs font-bold text-neutral-900">{product.rating} / 5.0</span>
              <span className="text-neutral-300">|</span>
              <span className="text-xs text-neutral-500 hover:underline cursor-pointer" onClick={() => setActiveTab('reviews')}>
                {reviewsList.length} đánh giá
              </span>
              <span className="text-neutral-300">|</span>
              <span className="text-xs font-mono text-neutral-400">
                SKU: <strong className="text-neutral-700">{selectedVariant?.sku || product.sku}</strong>
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 flex items-baseline gap-4">
            <span className="text-2xl sm:text-3xl font-extrabold text-neutral-950">
              {formatCurrency(currentPrice)}
            </span>
            {originalPrice > currentPrice && (
              <span className="text-base text-neutral-400 line-through font-medium">
                {formatCurrency(originalPrice)}
              </span>
            )}
            {discountPercent > 0 && (
              <span className="text-xs font-extrabold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 ml-auto">
                Tiết kiệm {formatCurrency(originalPrice - currentPrice)}
              </span>
            )}
          </div>

          {/* Color Selection */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-neutral-800 mb-2">
              <span>Phối màu: <strong className="text-neutral-950">{selectedColor}</strong></span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {uniqueColors.map(c => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c.name)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all ${
                    selectedColor === c.name
                      ? 'border-neutral-950 bg-neutral-950 text-white shadow-md'
                      : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400'
                  }`}
                >
                  <span className="w-3.5 h-3.5 rounded-full border border-neutral-300" style={{ backgroundColor: c.hex }} />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-neutral-800 mb-2">
              <span>Kích thước (Size EU):</span>
              <button
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-xs text-neutral-950 hover:underline font-bold"
              >
                Bảng quy đổi size chuẩn
              </button>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {uniqueSizes.map(size => {
                const v = product.variants.find(item => item.color === selectedColor && item.size === size);
                const stock = v ? v.stockQuantity - v.reservedQuantity : 0;
                const out = stock <= 0;

                return (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    disabled={out}
                    className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all border relative ${
                      selectedSize === size
                        ? 'border-neutral-950 bg-neutral-950 text-white shadow-md'
                        : out
                        ? 'border-dashed border-neutral-200 bg-neutral-50 text-neutral-300 cursor-not-allowed line-through'
                        : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-950'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Real-time Inventory Alert */}
          <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs">
            {isOutOfStock ? (
              <div className="flex items-center gap-2 text-rose-600 font-bold">
                <AlertCircle className="w-4 h-4" />
                <span>Rất tiếc, size {selectedSize} - phối màu {selectedColor} hiện đang hết hàng.</span>
              </div>
            ) : isLowStock ? (
              <div className="flex items-center gap-2 text-amber-700 font-bold">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Số lượng có hạn! Chỉ còn {availableStock} đôi trong kho cho size này.</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-emerald-700 font-bold">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Còn hàng ({availableStock} đôi sẵn sàng vận chuyển ngay).</span>
              </div>
            )}
          </div>

          {/* Quantity Stepper */}
          {!isOutOfStock && (
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-neutral-700">Số lượng:</span>
              <div className="flex items-center border border-neutral-200 rounded-xl bg-white overflow-hidden shadow-sm">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="p-2.5 hover:bg-neutral-100 text-neutral-600 disabled:opacity-30 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-xs font-extrabold text-neutral-950">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(availableStock, quantity + 1))}
                  disabled={quantity >= availableStock}
                  className="p-2.5 hover:bg-neutral-100 text-neutral-600 disabled:opacity-30 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Action CTAs */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-3">
              <button
                id="pdp-add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                  isOutOfStock
                    ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                    : 'bg-white border-2 border-neutral-950 text-neutral-950 hover:bg-neutral-50'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Thêm Vào Giỏ Hàng</span>
              </button>

              <button
                id="pdp-buy-now-btn"
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className={`flex-1 py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xl ${
                  isOutOfStock
                    ? 'bg-neutral-300 text-neutral-400 cursor-not-allowed'
                    : 'bg-neutral-950 text-white hover:bg-neutral-800'
                }`}
              >
                <span>Mua Ngay</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="pdp-wishlist-toggle-btn"
                onClick={() => toggleWishlist(product.id)}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isInWishlist(product.id)
                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                    : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                }`}
                title="Thêm vào yêu thích"
              >
                <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* 3. TABS: DESCRIPTION, SPECS, REVIEWS, SHIPPING */}
      <div className="bg-white rounded-3xl border border-neutral-100 p-6 sm:p-8 shadow-sm">
        
        {/* Tab Headers */}
        <div className="flex border-b border-neutral-200 gap-6 sm:gap-8 overflow-x-auto">
          {[
            { id: 'desc', label: 'Mô Tả Sản Phẩm' },
            { id: 'specs', label: 'Thông Số Kỹ Thuật' },
            { id: 'reviews', label: `Đánh Giá (${reviewsList.length})` },
            { id: 'shipping', label: 'Chính Sách Giao Hàng & Đổi Trả' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-all whitespace-nowrap border-b-2 -mb-px ${
                activeTab === tab.id
                  ? 'border-neutral-950 text-neutral-950'
                  : 'border-transparent text-neutral-400 hover:text-neutral-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="py-6">
          {activeTab === 'desc' && (
            <div className="prose prose-neutral max-w-none text-sm text-neutral-600 leading-relaxed space-y-4">
              <p>{product.description}</p>
              <p>
                Được chế tác từ các vật liệu tuyển chọn cao cấp, phiên bản mang đến cảm giác êm ái tối đa trong từng bước di chuyển. Hệ thống đệm giảm chấn hấp thụ lực tốt, nâng đỡ bàn chân khi di chuyển suốt cả ngày dài.
              </p>
              <h4 className="text-sm font-bold text-neutral-900 mt-4">Điểm nổi bật:</h4>
              <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                <li>Chất liệu da cao cấp kết hợp vải lưới thoáng khí tăng cường lưu thông không khí.</li>
                <li>Đế cao su nguyên khối có rãnh bám chống trơn trượt trên mọi bề mặt.</li>
                <li>Lót giày kháng khuẩn, khử mùi hiệu quả.</li>
                <li>Họa tiết logo thương hiệu tinh xảo, thể hiện đẳng cấp thời trang.</li>
              </ul>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="max-w-2xl">
              <table className="w-full text-xs text-left border-collapse">
                <tbody className="divide-y divide-neutral-100">
                  <tr className="py-2.5">
                    <td className="py-2.5 font-bold text-neutral-500 w-1/3">Thương hiệu</td>
                    <td className="py-2.5 font-semibold text-neutral-900">{product.brandName}</td>
                  </tr>
                  <tr className="py-2.5">
                    <td className="py-2.5 font-bold text-neutral-500">Danh mục</td>
                    <td className="py-2.5 font-semibold text-neutral-900">{product.categoryName}</td>
                  </tr>
                  <tr className="py-2.5">
                    <td className="py-2.5 font-bold text-neutral-500">Giới tính</td>
                    <td className="py-2.5 font-semibold text-neutral-900">{product.gender}</td>
                  </tr>
                  <tr className="py-2.5">
                    <td className="py-2.5 font-bold text-neutral-500">Mã SKU chuẩn</td>
                    <td className="py-2.5 font-mono text-neutral-900">{product.sku}</td>
                  </tr>
                  <tr className="py-2.5">
                    <td className="py-2.5 font-bold text-neutral-500">Chất liệu thân giày (Upper)</td>
                    <td className="py-2.5 font-semibold text-neutral-900">Premium Leather & Engineered Mesh</td>
                  </tr>
                  <tr className="py-2.5">
                    <td className="py-2.5 font-bold text-neutral-500">Chất liệu đế (Outsole)</td>
                    <td className="py-2.5 font-semibold text-neutral-900">Cao su chống mài mòn cao cấp</td>
                  </tr>
                  <tr className="py-2.5">
                    <td className="py-2.5 font-bold text-neutral-500">Quy cách đóng gói</td>
                    <td className="py-2.5 font-semibold text-neutral-900">Hộp nguyên bản chính hãng (Original Box) + Double box bảo vệ</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8">
              {/* Rating overview */}
              <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-neutral-50 rounded-2xl border border-neutral-100">
                <div className="text-center sm:text-left">
                  <div className="text-4xl font-extrabold text-neutral-950 font-['Space_Grotesk']">{product.rating}</div>
                  <div className="flex items-center text-amber-400 justify-center sm:justify-start my-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <div className="text-xs text-neutral-500">Dựa trên {reviewsList.length} đánh giá</div>
                </div>

                <div className="flex-1 w-full space-y-1.5 text-xs">
                  {[5, 4, 3, 2, 1].map(stars => {
                    const count = reviewsList.filter(r => r.rating === stars).length;
                    const pct = reviewsList.length > 0 ? (count / reviewsList.length) * 100 : 0;
                    return (
                      <div key={stars} className="flex items-center gap-2">
                        <span className="w-6 font-bold text-neutral-600">{stars} ★</span>
                        <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                          <div className="bg-amber-400 h-full rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="w-8 text-neutral-400 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Add Review Form */}
              <form onSubmit={handleAddReview} className="p-6 bg-white rounded-2xl border border-neutral-200 space-y-4">
                <h4 className="font-bold text-neutral-900 text-sm">Gửi Đánh Giá Của Bạn</h4>
                
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Đánh giá số sao:</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className={`p-1 text-2xl transition-colors ${
                          star <= newRating ? 'text-amber-400' : 'text-neutral-200 hover:text-amber-300'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Nhận xét chi tiết:</label>
                  <textarea
                    rows={3}
                    required
                    value={newReviewText}
                    onChange={e => setNewReviewText(e.target.value)}
                    placeholder="Chia sẻ cảm nhận về độ êm, form giày, độ bền hoặc đóng gói giao hàng..."
                    className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-neutral-950 focus:bg-white transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-neutral-950 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Gửi Nhận Xét</span>
                </button>
              </form>

              {/* Reviews List */}
              <div className="space-y-4">
                {reviewsList.map(review => (
                  <div key={review.id} className="p-4 rounded-2xl border border-neutral-100 bg-neutral-50/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-neutral-950 text-white font-bold text-xs flex items-center justify-center">
                          {review.userName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-xs text-neutral-900 flex items-center gap-1">
                            <span>{review.userName}</span>
                            {review.isVerifiedPurchase && (
                              <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold flex items-center gap-0.5">
                                <CheckCircle2 className="w-3 h-3" /> Đã mua hàng
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-neutral-400">{review.createdAt}</div>
                        </div>
                      </div>

                      <div className="flex items-center text-amber-400 text-xs">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-current' : 'text-neutral-200'}`} />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-neutral-700 leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-4 text-xs sm:text-sm text-neutral-600 leading-relaxed">
              <div>
                <h4 className="font-bold text-neutral-900 mb-1">1. Chính sách giao nhận</h4>
                <p>
                  - Đơn hàng nội thành TP.HCM và Hà Nội: Giao hỏa tốc trong 2H hoặc giao tiêu chuẩn trong ngày.<br />
                  - Đơn hàng các tỉnh thành khác: Giao từ 1 - 3 ngày làm việc thông qua đơn vị vận chuyển Viettel Post / GHTK.<br />
                  - Miễn phí 100% cước vận chuyển cho các đơn hàng có giá trị thanh toán từ <strong>3.000.000 VNĐ</strong>.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-neutral-900 mb-1">2. Kiểm tra hàng trước khi nhận</h4>
                <p>
                  - Quý khách hoàn toàn được đồng kiểm bóc hộp, kiểm tra ngoại quan đôi giày, phụ kiện đi kèm và thử size trước khi thanh toán cho shipper COD.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-neutral-900 mb-1">3. Chính sách đổi trả linh hoạt</h4>
                <p>
                  - Đổi size miễn phí trong vòng 30 ngày kể từ ngày nhận hàng nếu giày còn nguyên tem mác và đế chưa bị dơ bẩn qua sử dụng ngoài trời.<br />
                  - Hotline hỗ trợ đổi trả nhanh: <strong>1900 8899</strong>.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-950 font-['Space_Grotesk'] uppercase">
              SẢN PHẨM TƯƠNG TỰ BẠN CÓ THỂ THÍCH
            </h2>
            <button
              onClick={() => onNavigate('products', { category: product.categoryName.toLowerCase() })}
              className="text-xs font-bold text-neutral-900 hover:underline"
            >
              Xem thêm &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
