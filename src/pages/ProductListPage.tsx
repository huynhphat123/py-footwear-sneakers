import React, { useState, useMemo, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/common/ProductCard';
import { Product } from '../types';
import { formatCurrency } from '../utils/format';
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  RotateCcw,
  Sparkles,
  Flame,
  Search,
  Check,
} from 'lucide-react';

interface ProductListPageParams {
  category?: string;
  brand?: string;
  filter?: string;
  search?: string;
  [key: string]: any;
}

interface ProductListPageProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
  initialParams?: ProductListPageParams;
}

export const ProductListPage: React.FC<ProductListPageProps> = ({ onNavigate, initialParams = {} as ProductListPageParams }) => {
  const { products, categories, brands } = useShop();

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>(initialParams?.category || 'all');
  const [selectedBrand, setSelectedBrand] = useState<string>(initialParams?.brand || 'all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<string>('all'); // 'all', 'under-2m', '2m-4m', '4m-6m', 'above-6m'
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>(initialParams?.search || '');
  const [filterType, setFilterType] = useState<string>(initialParams?.filter || 'all'); // 'sale', 'new', 'bestseller'
  
  // Sort State
  const [sortBy, setSortBy] = useState<string>('featured'); // 'featured', 'price-asc', 'price-desc', 'newest', 'rating'
  
  // Mobile filter drawer
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync when initialParams changes
  useEffect(() => {
    if (initialParams?.category) setSelectedCategory(initialParams.category);
    if (initialParams?.brand) setSelectedBrand(initialParams.brand);
    if (initialParams?.filter) setFilterType(initialParams.filter);
    if (initialParams?.search) setSearchQuery(initialParams.search);
  }, [initialParams]);

  // Extract all available sizes & colors from all products
  const allSizes = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => p.variants.forEach(v => set.add(v.size)));
    return Array.from(set).sort((a, b) => parseFloat(String(a)) - parseFloat(String(b)));
  }, [products]);

  const allColors = useMemo(() => {
    const map = new Map<string, string>();
    products.forEach(p => p.variants.forEach(v => {
      if (!map.has(v.color)) map.set(v.color, v.colorHex);
    }));
    return Array.from(map.entries()).map(([name, hex]) => ({ name, hex }));
  }, [products]);

  // Toggle size
  const toggleSize = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  // Toggle color
  const toggleColor = (color: string) => {
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    setSelectedGender('all');
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceRange('all');
    setOnlyInStock(false);
    setSearchQuery('');
    setFilterType('all');
    setSortBy('featured');
  };

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const match =
          product.name.toLowerCase().includes(q) ||
          product.sku.toLowerCase().includes(q) ||
          product.brandName.toLowerCase().includes(q) ||
          product.categoryName.toLowerCase().includes(q);
        if (!match) return false;
      }

      // Filter type: sale / new / bestseller
      if (filterType === 'sale' && (!product.salePrice || product.salePrice >= product.originalPrice)) return false;
      if (filterType === 'new' && !product.isNew) return false;
      if (filterType === 'bestseller' && !product.isBestSeller) return false;

      // Category
      if (selectedCategory !== 'all') {
        const cat = categories.find(c => c.slug === selectedCategory || c.name === selectedCategory);
        if (cat && product.categoryId !== cat.id) return false;
      }

      // Brand
      if (selectedBrand !== 'all') {
        const br = brands.find(b => b.slug === selectedBrand || b.name.toLowerCase() === selectedBrand.toLowerCase());
        if (br && product.brandId !== br.id) return false;
      }

      // Gender
      if (selectedGender !== 'all' && product.gender !== selectedGender && product.gender !== 'Unisex') {
        return false;
      }

      // Price range
      const finalPrice = product.salePrice || product.originalPrice;
      if (priceRange === 'under-2m' && finalPrice >= 2000000) return false;
      if (priceRange === '2m-4m' && (finalPrice < 2000000 || finalPrice > 4000000)) return false;
      if (priceRange === '4m-6m' && (finalPrice < 4000000 || finalPrice > 6000000)) return false;
      if (priceRange === 'above-6m' && finalPrice < 6000000) return false;

      // Size
      if (selectedSizes.length > 0) {
        const hasSize = product.variants.some(v => selectedSizes.includes(v.size) && (v.stockQuantity - v.reservedQuantity) > 0);
        if (!hasSize) return false;
      }

      // Color
      if (selectedColors.length > 0) {
        const hasColor = product.variants.some(v => selectedColors.includes(v.color));
        if (!hasColor) return false;
      }

      // In stock
      if (onlyInStock) {
        const totalStock = product.variants.reduce((sum, v) => sum + (v.stockQuantity - v.reservedQuantity), 0);
        if (totalStock <= 0) return false;
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.salePrice || a.originalPrice;
      const priceB = b.salePrice || b.originalPrice;

      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'bestseller') return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
      return 0;
    });
  }, [
    products,
    categories,
    brands,
    selectedCategory,
    selectedBrand,
    selectedGender,
    selectedSizes,
    selectedColors,
    priceRange,
    onlyInStock,
    searchQuery,
    filterType,
    sortBy,
  ]);

  const activeFiltersCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedBrand !== 'all' ? 1 : 0) +
    (selectedGender !== 'all' ? 1 : 0) +
    (priceRange !== 'all' ? 1 : 0) +
    (filterType !== 'all' ? 1 : 0) +
    (onlyInStock ? 1 : 0) +
    (searchQuery ? 1 : 0) +
    selectedSizes.length +
    selectedColors.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* 1. TOP HEADER & BREADCRUMB */}
      <div className="mb-6">
        <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">
          <span className="hover:underline cursor-pointer" onClick={() => onNavigate('home')}>Trang chủ</span> / <span className="text-neutral-900 dark:text-neutral-100 font-bold">Cửa hàng</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-3xl font-extrabold text-neutral-950 dark:text-white font-['Space_Grotesk'] uppercase">
              {filterType === 'sale'
                ? 'Sản Phẩm Sale Khủng'
                : filterType === 'new'
                ? 'Hàng Mới Về'
                : selectedBrand !== 'all'
                ? `Giày ${selectedBrand.toUpperCase()}`
                : selectedCategory !== 'all'
                ? `Danh Mục ${selectedCategory.toUpperCase()}`
                : 'Tất Cả Sản Phẩm'}
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Hiển thị <strong>{filteredProducts.length}</strong> sản phẩm cao cấp chính hãng
            </p>
          </div>

          {/* Sort & Mobile Filter Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              id="open-mobile-filter-btn"
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3.5 py-2.5 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-xs font-bold rounded-xl shadow-sm active:scale-95 transition-all"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Bộ Lọc {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}</span>
            </button>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-neutral-500 dark:text-neutral-400 font-medium hidden sm:inline">Sắp xếp:</span>
              <select
                id="product-sort-select"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2.5 text-xs font-bold text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-950 dark:focus:border-white cursor-pointer"
              >
                <option value="featured">Nổi Bật Nhất</option>
                <option value="price-asc">Giá: Thấp đến Cao</option>
                <option value="price-desc">Giá: Cao đến Thấp</option>
                <option value="newest">Hàng Mới Nhất</option>
                <option value="rating">Đánh Giá Cao Nhất</option>
                <option value="bestseller">Bán Chạy Nhất</option>
              </select>
            </div>
          </div>
        </div>

        {/* MOBILE QUICK FILTER SCROLL CHIPS */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-3 mt-3 border-y border-neutral-100 dark:border-neutral-800 lg:hidden">
          <button
            onClick={() => { setFilterType('all'); setSelectedBrand('all'); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              filterType === 'all' && selectedBrand === 'all'
                ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 shadow-sm'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setFilterType(filterType === 'sale' ? 'all' : 'sale')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              filterType === 'sale'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Sale -40%</span>
          </button>
          <button
            onClick={() => setFilterType(filterType === 'new' ? 'all' : 'new')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              filterType === 'new'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hàng Mới</span>
          </button>
          {brands.map(b => (
            <button
              key={b.id}
              onClick={() => setSelectedBrand(selectedBrand === b.slug ? 'all' : b.slug)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedBrand === b.slug
                  ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 shadow-sm'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
              }`}
            >
              {b.name}
            </button>
          ))}
        </div>

        {/* ACTIVE FILTER BADGES ROW */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-3 mt-3 border-t border-neutral-100 dark:border-neutral-800">
            <span className="text-xs text-neutral-400 font-medium">Đang lọc:</span>
            
            {filterType !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-bold rounded-lg border border-rose-200 dark:border-rose-800">
                {filterType === 'sale' ? 'Đang Giảm Giá' : filterType === 'new' ? 'Hàng Mới' : 'Bán Chạy'}
                <button onClick={() => setFilterType('all')}><X className="w-3 h-3" /></button>
              </span>
            )}

            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-bold rounded-lg">
                Danh mục: {selectedCategory}
                <button onClick={() => setSelectedCategory('all')}><X className="w-3 h-3" /></button>
              </span>
            )}

            {selectedBrand !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-bold rounded-lg">
                Hãng: {selectedBrand}
                <button onClick={() => setSelectedBrand('all')}><X className="w-3 h-3" /></button>
              </span>
            )}

            {selectedSizes.map(size => (
              <span key={size} className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-xs font-bold rounded-lg">
                Size {size}
                <button onClick={() => toggleSize(size)}><X className="w-3 h-3" /></button>
              </span>
            ))}

            {selectedColors.map(color => (
              <span key={color} className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-bold rounded-lg">
                Màu: {color}
                <button onClick={() => toggleColor(color)}><X className="w-3 h-3" /></button>
              </span>
            ))}

            {priceRange !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-bold rounded-lg">
                Giá: {priceRange === 'under-2m' ? '< 2 triệu' : priceRange === '2m-4m' ? '2 - 4 triệu' : priceRange === '4m-6m' ? '4 - 6 triệu' : '> 6 triệu'}
                <button onClick={() => setPriceRange('all')}><X className="w-3 h-3" /></button>
              </span>
            )}

            {onlyInStock && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-lg border border-emerald-200 dark:border-emerald-800">
                Chỉ còn hàng
                <button onClick={() => setOnlyInStock(false)}><X className="w-3 h-3" /></button>
              </span>
            )}

            <button
              onClick={resetFilters}
              className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white underline ml-2 font-medium"
            >
              Xóa tất cả
            </button>
          </div>
        )}
      </div>

      {/* 2. MAIN LAYOUT: SIDEBAR + PRODUCTS */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* DESKTOP FILTER SIDEBAR */}
        <aside className="hidden lg:block space-y-6">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl border border-neutral-100 dark:border-neutral-800 p-6 shadow-sm space-y-6 sticky top-24">
            
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2 font-extrabold text-neutral-950 dark:text-white text-sm">
                <SlidersHorizontal className="w-4 h-4" />
                <span>BỘ LỌC TÌM KIẾM</span>
              </div>
              {activeFiltersCount > 0 && (
                <button
                  id="sidebar-reset-btn"
                  onClick={resetFilters}
                  className="text-[11px] text-neutral-500 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Đặt lại</span>
                </button>
              )}
            </div>

            {/* Brands Filter */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">Thương Hiệu</div>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedBrand('all')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                    selectedBrand === 'all'
                      ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  <span>Tất cả thương hiệu</span>
                  {selectedBrand === 'all' && <Check className="w-3.5 h-3.5" />}
                </button>
                {brands.map(brand => (
                  <button
                    key={brand.id}
                    onClick={() => setSelectedBrand(brand.slug)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                      selectedBrand === brand.slug
                        ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <span>{brand.name}</span>
                    <span className="text-[10px] opacity-70">({brand.productCount || 6})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Categories Filter */}
            <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">Danh Mục</div>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                    selectedCategory === 'all'
                      ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  <span>Tất cả danh mục</span>
                  {selectedCategory === 'all' && <Check className="w-3.5 h-3.5" />}
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                      selectedCategory === cat.slug
                        ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <span>{cat.name}</span>
                    {selectedCategory === cat.slug && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes Filter */}
            <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">Size Giày (EU)</div>
              <div className="grid grid-cols-4 gap-1.5">
                {allSizes.map(size => {
                  const active = selectedSizes.includes(size);
                  return (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`py-2 text-xs font-bold rounded-xl transition-all border ${
                        active
                          ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 border-neutral-950 dark:border-white shadow-sm'
                          : 'bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 border-neutral-200 dark:border-neutral-700 hover:border-neutral-400'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Colors Filter */}
            <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">Màu Sắc</div>
              <div className="flex flex-wrap gap-2">
                {allColors.map(c => {
                  const active = selectedColors.includes(c.name);
                  return (
                    <button
                      key={c.name}
                      onClick={() => toggleColor(c.name)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium border transition-all ${
                        active
                          ? 'border-neutral-950 dark:border-white bg-neutral-950 dark:bg-white text-white dark:text-neutral-950'
                          : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full border border-black/20" style={{ backgroundColor: c.hex }} />
                      <span>{c.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">Khoảng Giá</div>
              <div className="space-y-1.5 text-xs font-semibold">
                {[
                  { id: 'all', label: 'Tất cả mức giá' },
                  { id: 'under-2m', label: 'Dưới 2.000.000đ' },
                  { id: '2m-4m', label: '2.000.000đ - 4.000.000đ' },
                  { id: '4m-6m', label: '4.000.000đ - 6.000.000đ' },
                  { id: 'above-6m', label: 'Trên 6.000.000đ' },
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setPriceRange(item.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl transition-colors ${
                      priceRange === item.id
                        ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* In stock toggle */}
            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-neutral-800 dark:text-neutral-200">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={e => setOnlyInStock(e.target.checked)}
                  className="rounded border-neutral-300 dark:border-neutral-600 text-neutral-950 dark:text-white focus:ring-0"
                />
                <span>Chỉ hiển thị sản phẩm còn hàng</span>
              </label>
            </div>

          </div>
        </aside>

        {/* PRODUCTS GRID AREA */}
        <main className="lg:col-span-3 space-y-6">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-[#1a1a1a] rounded-3xl border border-neutral-100 dark:border-neutral-800 p-8 shadow-sm">
              <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1">Không tìm thấy sản phẩm phù hợp</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto mb-6">
                Hãy thử nới lỏng hoặc xóa các tiêu chí bộ lọc (Size, Thương hiệu, Khoảng giá) để xem thêm các mẫu giày khác.
              </p>
              <button
                id="empty-reset-filters-btn"
                onClick={resetFilters}
                className="px-6 py-2.5 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          ) : (
            /* 2-column mobile grid, 2-col tablet, 3-col desktop */
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
              ))}
            </div>
          )}
        </main>

      </div>

      {/* 3. MOBILE FILTER SLIDE-OUT DRAWER */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          <div
            className="fixed inset-0 bg-neutral-950/70 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="relative w-full max-w-xs bg-white dark:bg-[#141414] h-full shadow-2xl p-5 overflow-y-auto flex flex-col justify-between border-l border-neutral-200 dark:border-neutral-800 animate-in slide-in-from-right duration-300">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
                <h3 className="font-extrabold text-neutral-950 dark:text-white text-base">Bộ Lọc Sản Phẩm</h3>
                <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 text-neutral-400 hover:text-neutral-900 dark:hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Brands */}
              <div>
                <div className="text-xs font-bold text-neutral-900 dark:text-white mb-2 uppercase tracking-wider">Thương hiệu</div>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedBrand('all')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold ${
                      selectedBrand === 'all' ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950' : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                    }`}
                  >
                    Tất cả
                  </button>
                  {brands.map(b => (
                    <button
                      key={b.id}
                      onClick={() => setSelectedBrand(b.slug)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold ${
                        selectedBrand === b.slug ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950' : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                      }`}
                    >
                      {b.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div>
                <div className="text-xs font-bold text-neutral-900 dark:text-white mb-2 uppercase tracking-wider">Size EU</div>
                <div className="grid grid-cols-4 gap-1.5">
                  {allSizes.map(size => (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`py-2 text-xs font-bold rounded-xl border ${
                        selectedSizes.includes(size)
                          ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 border-neutral-950 dark:border-white'
                          : 'border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 bg-neutral-50 dark:bg-neutral-900'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <div className="text-xs font-bold text-neutral-900 dark:text-white mb-2 uppercase tracking-wider">Khoảng Giá</div>
                <div className="space-y-1 text-xs font-semibold">
                  {[
                    { id: 'all', label: 'Tất cả mức giá' },
                    { id: 'under-2m', label: 'Dưới 2.000.000đ' },
                    { id: '2m-4m', label: '2.000.000đ - 4.000.000đ' },
                    { id: '4m-6m', label: '4.000.000đ - 6.000.000đ' },
                    { id: 'above-6m', label: 'Trên 6.000.000đ' },
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => setPriceRange(item.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl transition-colors ${
                        priceRange === item.id
                          ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950'
                          : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex gap-2">
              <button
                onClick={resetFilters}
                className="flex-1 py-3 bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-bold rounded-xl"
              >
                Đặt lại
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-3 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 text-xs font-bold rounded-xl shadow-md"
              >
                Xem ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
