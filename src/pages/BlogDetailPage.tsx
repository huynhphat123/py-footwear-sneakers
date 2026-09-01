import React from 'react';
import { initialBlogPosts } from '../data/initialData';
import {
  Calendar,
  User,
  Clock,
  ArrowLeft,
  Share2,
  Bookmark,
  ChevronRight,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

interface BlogDetailPageProps {
  slug: string;
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const BlogDetailPage: React.FC<BlogDetailPageProps> = ({ slug, onNavigate }) => {
  const { showToast } = useShop();
  const post = initialBlogPosts.find(p => p.slug === slug) || initialBlogPosts[0];

  if (!post) return null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Đã sao chép liên kết bài viết!', 'success');
    }
  };

  const relatedPosts = initialBlogPosts.filter(p => p.id !== post.id).slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* 1. BREADCRUMB */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('blog')}
          className="flex items-center gap-2 text-xs font-bold text-neutral-600 hover:text-neutral-950 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Blog</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Chia sẻ</span>
        </button>
      </div>

      {/* 2. ARTICLE HEADER */}
      <header className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          <span className="px-3 py-1 bg-neutral-100 text-neutral-800 text-xs font-extrabold rounded-lg uppercase tracking-wider">
            {post.category}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-950 font-['Space_Grotesk'] leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center gap-4 text-xs text-neutral-500 pt-2 border-b border-neutral-100 pb-4">
          <span className="flex items-center gap-1.5 font-bold text-neutral-900">
            <User className="w-4 h-4 text-neutral-400" />
            <span>{post.author}</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-neutral-400" />
            <span>{post.publishedDate}</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-neutral-400" />
            <span>{post.readingTime}</span>
          </span>
        </div>
      </header>

      {/* 3. FEATURED IMAGE */}
      <div className="rounded-3xl overflow-hidden aspect-video bg-neutral-100 border border-neutral-200/80 shadow-sm">
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* 4. ARTICLE CONTENT */}
      <div className="bg-white rounded-3xl border border-neutral-100 p-6 sm:p-10 shadow-sm">
        <div className="prose prose-neutral max-w-none text-sm leading-relaxed text-neutral-700 space-y-4">
          <p className="text-base font-semibold text-neutral-900 italic border-l-4 border-neutral-950 pl-4 py-1">
            "{post.excerpt}"
          </p>

          <div className="whitespace-pre-line text-sm text-neutral-700 leading-relaxed">
            {post.content}
          </div>

          <h3 className="text-lg font-bold text-neutral-950 font-['Space_Grotesk'] pt-4">
            Quy tắc vàng khi bảo quản giày Sneaker
          </h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Không giặt giày bằng máy giặt hoặc ngâm nước xà phòng quá lâu.</li>
            <li>Sử dụng Shoe Trees (cây giữ form) để hạn chế tối đa các nếp gãy nhăn (creases) ở mũi giày.</li>
            <li>Luôn để giày ở nơi khô ráo, thoáng khí, tránh ánh nắng mặt trời chiếu trực tiếp làm ố vàng đế.</li>
            <li>Dùng xịt nano chống thấm nước & chống bám bẩn trước khi mang ra ngoài đường.</li>
          </ul>

          <div className="p-5 bg-neutral-50 rounded-2xl border border-neutral-200 mt-6">
            <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider mb-1">
              Lời khuyên từ chuyên viên PY:
            </h4>
            <p className="text-xs text-neutral-600">
              Nếu bạn không có thời gian tự vệ sinh tại nhà, hãy ghé thăm showroom PY để được trải nghiệm dịch vụ Spa Sneaker chuyên nghiệp miễn phí cho hội viên VIP.
            </p>
          </div>
        </div>
      </div>

      {/* 5. RELATED ARTICLES */}
      <div className="pt-8 border-t border-neutral-200">
        <h3 className="font-extrabold text-xl text-neutral-950 font-['Space_Grotesk'] mb-6">
          BÀI VIẾT LIÊN QUAN
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {relatedPosts.map(rel => (
            <div
              key={rel.id}
              onClick={() => onNavigate('blog-detail', { slug: rel.slug })}
              className="bg-white rounded-2xl border border-neutral-100 overflow-hidden shadow-sm hover:shadow-md cursor-pointer group transition-all"
            >
              <div className="aspect-video overflow-hidden bg-neutral-100">
                <img src={rel.coverImage} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <div className="p-4 space-y-2">
                <span className="text-[10px] font-bold text-neutral-400 uppercase">{rel.category}</span>
                <h4 className="font-bold text-xs text-neutral-900 group-hover:text-neutral-700 line-clamp-2">
                  {rel.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
