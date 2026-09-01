import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useShop } from '../../context/ShopContext';
import { formatCurrency } from '../../utils/format';
import {
  Search,
  X,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';

interface SearchModalProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ onNavigate }) => {
  const { products, categories, brands, isSearchOpen, setIsSearchOpen } = useShop();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  // Suggestions & live search results
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return products.filter(p => {
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.brandName.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    });
  }, [query, products]);

  // Live auto-complete suggestions
  const suggestions = useMemo(() => {
    if (!query.trim() || query.length < 2) return [];
    const q = query.toLowerCase().trim();
    const matches = new Set<string>();

    products.forEach(p => {
      if (p.name.toLowerCase().includes(q)) matches.add(p.name);
      if (p.brandName.toLowerCase().includes(q)) matches.add(p.brandName);
    });

    return Array.from(matches).slice(0, 5);
  }, [query, products]);

  const popularKeywords = ['Nike Air Force 1', 'Adidas Samba', 'Jordan 1 Chicago', 'New Balance 550', 'Asics Gel', 'Giày Chạy Bộ'];

  if (!isSearchOpen) return null;

  const handleSelectProduct = (slug: string) => {
    setIsSearchOpen(false);
    onNavigate('product-detail', { slug });
  };

  const handleKeywordClick = (kw: string) => {
    setQuery(kw);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsSearchOpen(false);
    onNavigate('products', { search: query });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-start justify-center pt-16 sm:pt-24 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-950/70 backdrop-blur-md transition-opacity"
        onClick={() => setIsSearchOpen(false)}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#1a1a1a] text-neutral-900 dark:text-neutral-100 rounded-3xl shadow-2xl overflow-hidden z-10 border border-neutral-100 dark:border-neutral-800 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Search Bar Input */}
        <form onSubmit={handleSearchSubmit} className="p-4 sm:p-6 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 flex items-center gap-3">
          <Search className="w-6 h-6 text-neutral-400 dark:text-neutral-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Tìm kiếm theo tên giày, thương hiệu (Nike, Adidas...), mã SKU..."
            className="w-full bg-transparent text-base sm:text-lg font-medium text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              id="search-clear-btn"
              onClick={() => setQuery('')}
              className="p-1.5 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-500 dark:text-neutral-400"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            id="search-close-btn"
            onClick={() => setIsSearchOpen(false)}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </form>

        <div className="p-5 max-h-[65vh] overflow-y-auto space-y-6">
          
          {/* SEARCH SUGGESTIONS WHEN TYPING */}
          {suggestions.length > 0 && (
            <div>
              <div className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-2">
                Gợi ý tìm kiếm
              </div>
              <div className="space-y-1">
                {suggestions.map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => setQuery(sug)}
                    className="w-full text-left px-3 py-2 text-sm text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors flex items-center justify-between group"
                  >
                    <span className="flex items-center gap-2">
                      <Search className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-950 dark:group-hover:text-white" />
                      <span>{sug}</span>
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* LIVE PRODUCTS RESULTS */}
          {query.trim() ? (
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-3">
                <span>Kết quả sản phẩm ({searchResults.length})</span>
                {searchResults.length > 0 && (
                  <button
                    onClick={handleSearchSubmit}
                    className="text-neutral-900 dark:text-white hover:underline font-semibold"
                  >
                    Xem tất cả &rarr;
                  </button>
                )}
              </div>

              {searchResults.length === 0 ? (
                <div className="text-center py-10 text-neutral-500 dark:text-neutral-400">
                  <p className="text-sm">Không tìm thấy sản phẩm nào khớp với từ khóa "{query}".</p>
                  <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">Hãy thử tìm theo thương hiệu (Nike, Adidas, Jordan) hoặc danh mục.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {searchResults.slice(0, 6).map(prod => (
                    <div
                      key={prod.id}
                      onClick={() => handleSelectProduct(prod.slug)}
                      className="flex gap-3 p-2.5 rounded-2xl border border-neutral-100 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-md transition-all cursor-pointer group bg-white dark:bg-[#1e1e1e]"
                    >
                      <img
                        src={prod.mainImage}
                        alt={prod.name}
                        className="w-16 h-16 rounded-xl object-cover border border-neutral-100 dark:border-neutral-800 shrink-0 bg-neutral-50 dark:bg-neutral-900 group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">{prod.brandName}</div>
                        <h4 className="text-xs font-bold text-neutral-900 dark:text-white group-hover:text-neutral-950 dark:group-hover:text-white truncate">{prod.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-extrabold text-neutral-950 dark:text-white">
                            {formatCurrency(prod.salePrice || prod.originalPrice)}
                          </span>
                          {prod.salePrice && (
                            <span className="text-[10px] text-neutral-400 dark:text-neutral-500 line-through">
                              {formatCurrency(prod.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <>
              {/* POPULAR SEARCHES */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-3">
                  <TrendingUp className="w-3.5 h-3.5 text-rose-500" />
                  <span>Tìm kiếm phổ biến</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularKeywords.map(kw => (
                    <button
                      key={kw}
                      id={`pop-search-${kw.replace(/\s+/g, '-').toLowerCase()}`}
                      onClick={() => handleKeywordClick(kw)}
                      className="px-3.5 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-950 dark:hover:bg-white hover:text-white dark:hover:text-neutral-950 rounded-full text-xs font-medium text-neutral-700 dark:text-neutral-300 transition-colors"
                    >
                      {kw}
                    </button>
                  ))}
                </div>
              </div>

              {/* POPULAR BRANDS */}
              <div>
                <div className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-3">
                  Thương hiệu nổi bật
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {brands.slice(0, 4).map(b => (
                    <button
                      key={b.id}
                      onClick={() => {
                        setIsSearchOpen(false);
                        onNavigate('products', { brand: b.slug });
                      }}
                      className="flex items-center gap-2 p-2 rounded-xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/60 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-left"
                    >
                      <img
                        src={b.logo}
                        alt={b.name}
                        className="w-7 h-7 rounded-lg object-cover border border-neutral-200 dark:border-neutral-700 bg-white"
                        referrerPolicy="no-referrer"
                      />
                      <span className="text-xs font-bold text-neutral-900 dark:text-white">{b.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* QUICK CATEGORIES */}
              <div>
                <div className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-3">
                  Danh mục hot
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {categories.slice(0, 6).map(c => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setIsSearchOpen(false);
                        onNavigate('products', { category: c.slug });
                      }}
                      className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/80 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-xs font-semibold text-neutral-800 dark:text-neutral-200 text-left transition-colors truncate"
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
};
