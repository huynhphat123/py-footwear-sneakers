import React, { useState } from 'react';
import { initialStores } from '../data/initialData';
import {
  MapPin,
  Phone,
  Clock,
  Navigation,
  CheckCircle2,
  ShieldCheck,
  Search,
} from 'lucide-react';

interface StoresPageProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const StoresPage: React.FC<StoresPageProps> = () => {
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredStores = initialStores.filter(store => {
    const matchCity =
      selectedCity === 'all' ||
      (selectedCity === 'TP. Hồ Chí Minh' && store.address.includes('Hồ Chí Minh')) ||
      (selectedCity === 'Hà Nội' && store.address.includes('Hà Nội'));
    const matchQuery =
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCity && matchQuery;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* 1. HERO HEADER */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-extrabold uppercase tracking-widest text-neutral-400">
          SHOWROOM NETWORK
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 font-['Space_Grotesk']">
          HỆ THỐNG CỬA HÀNG PY
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
          Trải nghiệm không gian mua sắm sneaker cao cấp tại các flagship store của PY trên toàn quốc. Đội ngũ chuyên viên sẵn sàng tư vấn size và fit chân chuẩn xác nhất.
        </p>
      </div>

      {/* 2. FILTER & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['all', 'TP. Hồ Chí Minh', 'Hà Nội'].map(city => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCity === city
                  ? 'bg-neutral-950 text-white shadow-md'
                  : 'bg-white text-neutral-700 hover:bg-neutral-200/60 border border-neutral-200'
              }`}
            >
              {city === 'all' ? 'Tất cả chi nhánh' : city}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên đường, quận..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-neutral-950"
          />
        </div>
      </div>

      {/* 3. STORES LIST GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredStores.map(store => (
          <div
            key={store.id}
            className="bg-white rounded-3xl border border-neutral-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-video overflow-hidden bg-neutral-100">
                <img
                  src={store.image}
                  alt={store.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-neutral-950/80 backdrop-blur-md text-white text-[11px] font-extrabold px-3 py-1 rounded-xl">
                  {store.address.includes('Hà Nội') ? 'Hà Nội' : 'TP. Hồ Chí Minh'}
                </div>
              </div>

              <div className="p-6 space-y-4">
                <h3 className="text-lg font-extrabold text-neutral-950 font-['Space_Grotesk']">
                  {store.name}
                </h3>

                <div className="space-y-2.5 text-xs text-neutral-600">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                    <span>{store.address}</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-neutral-400 shrink-0" />
                    <span className="font-bold text-neutral-900">{store.phone}</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-neutral-400 shrink-0" />
                    <span>Giờ mở cửa: <strong>{store.openingHours}</strong></span>
                  </div>
                </div>

                {store.services && store.services.length > 0 && (
                  <div className="pt-2 border-t border-neutral-100">
                    <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">Dịch vụ tại showroom:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {store.services.map((srv, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-neutral-50 text-neutral-700 text-[11px] font-medium rounded-lg border border-neutral-100 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          {srv}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 pt-0 flex gap-3">
              <a
                href={store.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 bg-neutral-950 text-white rounded-2xl text-xs font-bold hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Chỉ Đường Google Maps</span>
              </a>

              <a
                href={`tel:${store.phone}`}
                className="px-4 py-3 bg-neutral-100 text-neutral-900 rounded-2xl text-xs font-bold hover:bg-neutral-200 transition-all flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Gọi Hotline</span>
              </a>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
