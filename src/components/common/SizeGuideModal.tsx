import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { X, Ruler, CheckCircle2 } from 'lucide-react';

export const SizeGuideModal: React.FC = () => {
  const { isSizeGuideOpen, setIsSizeGuideOpen } = useShop();
  const [activeBrand, setActiveBrand] = useState<'nike' | 'adidas' | 'jordan'>('nike');

  if (!isSizeGuideOpen) return null;

  const sizeTable = [
    { eu: '36', usM: '4', usW: '5.5', uk: '3.5', cm: '22.5' },
    { eu: '37', usM: '5', usW: '6.5', uk: '4.5', cm: '23.5' },
    { eu: '38', usM: '5.5', usW: '7', uk: '5', cm: '24' },
    { eu: '39', usM: '6.5', usW: '8', uk: '6', cm: '24.5' },
    { eu: '40', usM: '7', usW: '8.5', uk: '6', cm: '25' },
    { eu: '41', usM: '8', usW: '9.5', uk: '7', cm: '26' },
    { eu: '42', usM: '8.5', usW: '10', uk: '7.5', cm: '26.5' },
    { eu: '43', usM: '9.5', usW: '11', uk: '8.5', cm: '27.5' },
    { eu: '44', usM: '10', usW: '11.5', uk: '9', cm: '28' },
    { eu: '45', usM: '11', usW: '12.5', uk: '10', cm: '29' },
    { eu: '46', usM: '12', usW: '13.5', uk: '11', cm: '30' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-950/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsSizeGuideOpen(false)}
      />

      <div className="relative w-full max-w-2xl bg-white dark:bg-[#1a1a1a] text-neutral-900 dark:text-neutral-100 rounded-3xl shadow-2xl overflow-hidden z-10 border border-neutral-100 dark:border-neutral-800 p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={() => setIsSizeGuideOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 rounded-2xl">
            <Ruler className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-neutral-950 dark:text-white font-['Space_Grotesk']">
              Bảng Quy Đổi & Hướng Dẫn Chọn Size Giày
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Chuẩn quy đổi kích thước quốc tế (EU / US / UK / CM)</p>
          </div>
        </div>

        {/* Brand tabs */}
        <div className="flex gap-2 mb-6 border-b border-neutral-100 dark:border-neutral-800 pb-3">
          {(['nike', 'adidas', 'jordan'] as const).map(brand => (
            <button
              key={brand}
              onClick={() => setActiveBrand(brand)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                activeBrand === brand
                  ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 shadow-sm'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              Form Giày {brand.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-700 mb-6">
          <table className="w-full text-xs text-center">
            <thead className="bg-neutral-900 dark:bg-neutral-950 text-white font-bold">
              <tr>
                <th className="py-3 px-3">EU Size</th>
                <th className="py-3 px-3">US Nam</th>
                <th className="py-3 px-3">US Nữ</th>
                <th className="py-3 px-3">UK Size</th>
                <th className="py-3 px-3">Chiều dài chân (CM)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 font-medium text-neutral-800 dark:text-neutral-200">
              {sizeTable.map(row => (
                <tr key={row.eu} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                  <td className="py-2.5 px-3 font-bold bg-neutral-50 dark:bg-neutral-800/80">{row.eu}</td>
                  <td className="py-2.5 px-3">{row.usM}</td>
                  <td className="py-2.5 px-3">{row.usW}</td>
                  <td className="py-2.5 px-3">{row.uk}</td>
                  <td className="py-2.5 px-3 font-semibold text-neutral-950 dark:text-white">{row.cm} cm</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Instructions */}
        <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-300 space-y-2">
          <div className="font-bold flex items-center gap-1.5 text-amber-950 dark:text-amber-200">
            <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Mẹo đo chân chuẩn xác tại nhà:</span>
          </div>
          <p className="leading-relaxed">
            1. Đặt bàn chân lên giấy trắng, dùng bút chì kẻ dọc theo gót và ngón dài nhất.<br />
            2. Đo khoảng cách (cm) và cộng thêm <strong>0.5 cm</strong> để chân không bị kích ngón.<br />
            3. Nếu mu bàn chân dày hoặc bè ngang, quý khách nên <strong>tăng 0.5 đến 1 size</strong> so với giày thường.
          </p>
        </div>

      </div>
    </div>
  );
};
