import React, { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { formatCurrency, calculateDiscountPercentage } from '../../utils/format';
import { Product, ProductVariant } from '../../types';
import {
  X,
  Star,
  Check,
  ShoppingBag,
  Heart,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface QuickViewModalProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ onNavigate }) => {
  const {
    quickViewProduct: product,
    setQuickViewProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setIsSizeGuideOpen,
  } = useShop();

  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [activeImage, setActiveImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  // Initialize selected color, size, image when product changes
  useEffect(() => {
    if (product) {
      const firstVariant = product.variants[0];
      if (firstVariant) {
        setSelectedColor(firstVariant.color);
        setSelectedSize(firstVariant.size);
      }
      setActiveImage(product.mainImage);
      setQuantity(1);
    }
  }, [product]);

  if (!product) return null;

  // Extract unique colors and available sizes
  const uniqueColors = Array.from(new Set(product.variants.map(v => v.color))).map(colorName => {
    const v = product.variants.find(item => item.color === colorName);
    return { name: colorName, hex: v?.colorHex || '#111' };
  });

  const uniqueSizes = Array.from(new Set(product.variants.map(v => v.size))).sort(
    (a, b) => parseFloat(String(a)) - parseFloat(String(b))
  );

  // Find currently selected variant
  const selectedVariant = product.variants.find(
    v => v.color === selectedColor && v.size === selectedSize
  );

  const availableStock = selectedVariant ? selectedVariant.stockQuantity - selectedVariant.reservedQuantity : 0;
  const isOutOfStock = availableStock <= 0;
  const isLowStock = availableStock > 0 && availableStock <= 3;

  const currentPrice = selectedVariant?.price || product.price;
  const originalPrice = selectedVariant?.originalPrice || product.originalPrice;
  const discountPercent = calculateDiscountPercentage(originalPrice, currentPrice);

  const handleAddToCart = () => {
    if (!selectedVariant || isOutOfStock) return;
    const success = addToCart(product, selectedVariant, quantity);
    if (success) {
      setQuickViewProduct(null);
    }
  };

  const handleBuyNow = () => {
    if (!selectedVariant || isOutOfStock) return;
    addToCart(product, selectedVariant, quantity);
    setQuickViewProduct(null);
    onNavigate('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-950/70 backdrop-blur-sm transition-opacity"
        onClick={() => setQuickViewProduct(null)}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#1a1a1a] text-neutral-900 dark:text-neutral-100 rounded-3xl shadow-2xl overflow-hidden z-10 border border-neutral-100 dark:border-neutral-800 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          id="quickview-close-btn"
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 dark:bg-neutral-800/90 text-neutral-500 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white shadow-md transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8">
          
          {/* IMAGE GALLERY */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover object-center transition-all duration-300"
                referrerPolicy="no-referrer"
              />
              {discountPercent > 0 && (
                <div className="absolute top-3 left-3 bg-rose-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-lg shadow-md">
                  GIẢM {discountPercent}%
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-neutral-50 dark:bg-neutral-900 ${
                    activeImage === img ? 'border-neutral-950 dark:border-white scale-95' : 'border-transparent hover:border-neutral-300 dark:hover:border-neutral-700 opacity-70'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </div>

          {/* PRODUCT DETAILS & BUY CONTROLS */}
          <div className="flex flex-col justify-between space-y-4">
            <div>
              {/* Brand & Category */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase text-neutral-400 dark:text-neutral-500 tracking-wider">
                  {product.brandName} • {product.categoryName}
                </span>
                <span className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500">SKU: {selectedVariant?.sku || product.sku}</span>
              </div>

              {/* Title */}
              <h2 className="text-lg sm:text-xl font-extrabold text-neutral-950 dark:text-white mt-1 leading-snug">
                {product.name}
              </h2>

              {/* Ratings */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-neutral-200 dark:text-neutral-700'}`} />
                  ))}
                </div>
                <span className="text-xs font-bold text-neutral-900 dark:text-neutral-200">{product.rating}</span>
                <span className="text-xs text-neutral-400">({product.reviewCount} đánh giá)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mt-3">
                <span className="text-2xl font-extrabold text-neutral-950 dark:text-white">
                  {formatCurrency(currentPrice)}
                </span>
                {originalPrice > currentPrice && (
                  <span className="text-sm text-neutral-400 dark:text-neutral-500 line-through font-medium">
                    {formatCurrency(originalPrice)}
                  </span>
                )}
              </div>

              {/* Color Selector */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-2">
                  <span>Màu Sắc: <span className="text-neutral-950 dark:text-white">{selectedColor}</span></span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {uniqueColors.map(c => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                        selectedColor === c.name
                          ? 'border-neutral-950 dark:border-white bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 shadow-sm'
                          : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:border-neutral-400 dark:hover:border-neutral-600'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-neutral-300 dark:border-neutral-600" style={{ backgroundColor: c.hex }} />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selector with Size Guide Button */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-2">
                  <span>Chọn Size (EU):</span>
                  <button
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-neutral-900 dark:text-neutral-200 hover:underline text-xs font-semibold"
                  >
                    Bảng quy đổi size
                  </button>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {uniqueSizes.map(size => {
                    const variantForSize = product.variants.find(v => v.color === selectedColor && v.size === size);
                    const stock = variantForSize ? variantForSize.stockQuantity - variantForSize.reservedQuantity : 0;
                    const out = stock <= 0;

                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        disabled={out}
                        className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border relative ${
                          selectedSize === size
                            ? 'border-neutral-950 dark:border-white bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 shadow-sm'
                            : out
                            ? 'border-dashed border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 text-neutral-300 dark:text-neutral-600 cursor-not-allowed line-through'
                            : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:border-neutral-950 dark:hover:border-neutral-500'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* REALTIME INVENTORY STATUS ALERT */}
              <div className="mt-4 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 text-xs">
                {isOutOfStock ? (
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold">
                    <AlertCircle className="w-4 h-4" />
                    <span>Hết hàng đối với phối màu và size đã chọn.</span>
                  </div>
                ) : isLowStock ? (
                  <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold">
                    <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>Sắp hết hàng! Chỉ còn {availableStock} đôi trong kho.</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold">
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Còn hàng ({availableStock} đôi sẵn sàng giao ngay).</span>
                  </div>
                )}
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <div className="flex gap-2">
                <button
                  id="quickview-add-to-cart-btn"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
                    isOutOfStock
                      ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed'
                      : 'bg-white dark:bg-neutral-800 border-2 border-neutral-950 dark:border-white text-neutral-950 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-700'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Thêm Vào Giỏ Hàng</span>
                </button>

                <button
                  id="quickview-buy-now-btn"
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
                    isOutOfStock
                      ? 'bg-neutral-300 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed'
                      : 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100'
                  }`}
                >
                  <span>Mua Ngay</span>
                </button>

                <button
                  id="quickview-wishlist-btn"
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 transition-colors ${
                    isInWishlist(product.id) ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400' : 'hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                  }`}
                  title="Yêu thích"
                >
                  <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                </button>
              </div>

              <div className="text-center pt-1">
                <button
                  id="quickview-view-detail-btn"
                  onClick={() => {
                    setQuickViewProduct(null);
                    onNavigate('product-detail', { slug: product.slug });
                  }}
                  className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white underline"
                >
                  Xem thông tin chi tiết đầy đủ sản phẩm &rarr;
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
