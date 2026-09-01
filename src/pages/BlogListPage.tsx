import React, { useState } from 'react';
import { initialBlogPosts } from '../data/initialData';
import {
  Calendar,
  User,
  Clock,
  ArrowRight,
  Search,
  Tag,
  Sparkles,
} from 'lucide-react';

interface BlogListPageProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const BlogListPage: React.FC<BlogListPageProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const allCategories = ['all', 'Xu Hướng & Phong Cách', 'Bảo Quản & Chăm Sóc', 'Cẩm Nang Mua Sắm'];

  const filteredPosts = initialBlogPosts.filter(post => {
    const matchCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchQuery =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchQuery;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* 1. HERO HEADER */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-extrabold uppercase tracking-widest text-neutral-400">
          SNEAKER JOURNAL & STORIES
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 font-['Space_Grotesk']">
          KIẾN THỨC & VĂN HÓA SNEAKER
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
          Cập nhật xu hướng thời trang đường phố mới nhất, mẹo chọn size chuẩn xác, hướng dẫn vệ sinh bảo quản giày chuyên sâu từ chuyên gia PY.
        </p>
      </div>

      {/* 2. FILTER & SEARCH */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {allCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-neutral-950 text-white shadow-md'
                  : 'bg-white text-neutral-700 hover:bg-neutral-200 border border-neutral-200'
              }`}
            >
              {cat === 'all' ? 'Tất cả bài viết' : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm bài viết..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-neutral-950"
          />
        </div>
      </div>

      {/* 3. POSTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map(post => (
          <article
            key={post.id}
            onClick={() => onNavigate('blog-detail', { slug: post.slug })}
            className="bg-white rounded-3xl border border-neutral-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="relative aspect-video overflow-hidden bg-neutral-100">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 bg-neutral-950/80 backdrop-blur-md text-white text-[10px] font-bold rounded-lg">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-3">
                <div className="flex items-center gap-3 text-[11px] text-neutral-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{post.publishedDate}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{post.readingTime}</span>
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-neutral-950 group-hover:text-neutral-700 transition-colors font-['Space_Grotesk'] leading-snug">
                  {post.title}
                </h3>

                <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0 flex items-center justify-between text-xs font-bold text-neutral-950">
              <span>Đọc tiếp</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </article>
        ))}
      </div>

    </div>
  );
};
