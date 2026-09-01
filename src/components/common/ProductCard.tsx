import React from 'react';
import { Product } from '../../types';
import { useShop } from '../../context/ShopContext';
import { formatCurrency, calculateDiscountPercentage } from '../../utils/format';
import {
  Star,
  Heart,
  Eye,
  ShoppingBag,
  Flame,
  Sparkles,
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onNavigate }) => {
  const { toggleWishlist, isInWishlist, setQuickViewProduct, addToCart } = useShop();

  const currentPrice = product.salePrice || product.originalPrice;
  const originalPrice = product.originalPrice;
  const discountPercent = calculateDiscountPercentage(originalPrice, currentPrice);

  // Quick add to cart using first available variant
  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const availableVariant = product.variants.find(v => (v.stockQuantity - v.reservedQuantity) > 0);
    if (availableVariant) {
      addToCart(product, availableVariant, 1);
    } else {
      setQuickViewProduct(product);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  const handleToggleWish = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onNavigate('product-detail', { slug: product.slug })}
      className="group relative bg-white dark:bg-[#1a1a1a] rounded-2xl sm:rounded-3xl border border-neutral-100 dark:border-neutral-800 overflow-hidden hover:shadow-xl dark:hover:shadow-neutral-950/50 hover:border-neutral-200 dark:hover:border-neutral-700 transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* IMAGE CONTAINER */}
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-50 dark:bg-neutral-900">
        <img
          src={product.mainImage}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* BADGES */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {discountPercent > 0 && (
            <span className="inline-flex items-center gap-1 bg-rose-600 text-white font-extrabold text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg shadow-md">
              <Flame className="w-3 h-3 hidden sm:inline" /> -{discountPercent}%
            </span>
          )}
          {product.isNew && (
            <span className="inline-flex items-center gap-1 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 font-extrabold text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg shadow-md">
              <Sparkles className="w-3 h-3 text-amber-400 dark:text-amber-500" /> NEW
            </span>
          )}
          {product.isBestSeller && !product.isNew && (
            <span className="bg-amber-500 text-white font-extrabold text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg shadow-md">
              BEST SELLER
            </span>
          )}
        </div>

        {/* TOP RIGHT WISHLIST BUTTON */}
        <button
          id={`wishlist-btn-${product.id}`}
          onClick={handleToggleWish}
          className={`absolute top-3 right-3 z-10 p-2 sm:p-2.5 rounded-full backdrop-blur-md transition-all shadow-sm ${
            isInWishlist(product.id)
              ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
              : 'bg-white/80 dark:bg-neutral-900/80 hover:bg-white dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white'
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
        </button>

        {/* QUICK ACTION HOVER OVERLAY (Desktop) */}
        <div className="absolute inset-x-3 bottom-3 hidden lg:flex gap-2 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 z-10">
          <button
            id={`quick-view-btn-${product.id}`}
            onClick={handleQuickView}
            className="flex-1 py-2.5 px-3 bg-white/95 dark:bg-neutral-800/95 backdrop-blur-sm text-neutral-900 dark:text-white text-xs font-bold rounded-xl hover:bg-white dark:hover:bg-neutral-700 shadow-lg flex items-center justify-center gap-1.5 transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Xem Nhanh</span>
          </button>
          <button
            id={`quick-add-btn-${product.id}`}
            onClick={handleQuickAdd}
            className="p-2.5 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-200 shadow-lg transition-all"
            title="Thêm vào giỏ hàng"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-3.5 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-1">
            <span>{product.brandName}</span>
            <span>{product.gender === 'Unisex' ? 'Unisex' : product.gender === 'Men' ? 'Nam' : 'Nữ'}</span>
          </div>

          {/* Product Name */}
          <h3 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-neutral-100 line-clamp-2 leading-snug group-hover:text-neutral-950 dark:group-hover:text-white transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">{product.rating}</span>
            <span className="text-[11px] text-neutral-400 dark:text-neutral-500">({product.reviewCount})</span>
          </div>
        </div>

        {/* Price & Mobile Add Button */}
        <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs sm:text-base font-extrabold text-neutral-950 dark:text-white leading-none">
              {formatCurrency(currentPrice)}
            </span>
            {originalPrice > currentPrice && (
              <span className="text-[11px] text-neutral-400 dark:text-neutral-500 line-through mt-1">
                {formatCurrency(originalPrice)}
              </span>
            )}
          </div>

          {/* Mobile Cart Trigger */}
          <button
            onClick={handleQuickView}
            className="lg:hidden p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white hover:bg-neutral-950 hover:text-white dark:hover:bg-white dark:hover:text-neutral-950 transition-colors"
            title="Xem nhanh"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
