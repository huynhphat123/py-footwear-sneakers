import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { StorageService } from '../services/storageService';
import { formatCurrency } from '../utils/format';
import { GiftCard } from '../types';
import {
  Gift,
  Search,
  CheckCircle2,
  AlertCircle,
  Copy,
  Sparkles,
  CreditCard,
  ShieldCheck,
  Send,
} from 'lucide-react';

interface GiftCardPageProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const GiftCardPage: React.FC<GiftCardPageProps> = ({ onNavigate }) => {
  const { showToast } = useShop();
  
  // Check balance state
  const [checkCode, setCheckCode] = useState('');
  const [checkedCard, setCheckedCard] = useState<GiftCard | null>(null);
  const [checkError, setCheckError] = useState('');

  // Purchase gift card state
  const [selectedDenom, setSelectedDenom] = useState<number>(1000000);
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [giftMessage, setGiftMessage] = useState('');
  const [generatedCard, setGeneratedCard] = useState<GiftCard | null>(null);

  const denominations = [500000, 1000000, 2000000, 3000000, 5000000];

  const handleCheckBalance = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckError('');
    setCheckedCard(null);

    if (!checkCode.trim()) return;

    const cards = StorageService.getGiftCards();
    const found = cards.find(c => c.code.toUpperCase() === checkCode.trim().toUpperCase());

    if (!found) {
      setCheckError('Mã Thẻ Quà Tặng không tồn tại hoặc đã hết hạn sử dụng.');
    } else {
      setCheckedCard(found);
    }
  };

  const handleBuyGiftCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientEmail || !recipientName) {
      showToast('Vui lòng điền thông tin người nhận!', 'error');
      return;
    }

    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const newCode = `SOLE-GIFT-${randomSuffix}`;

    const newCard: GiftCard = {
      id: `gc-${Date.now()}`,
      code: newCode,
      initialValue: selectedDenom,
      balance: selectedDenom,
      customerEmail: recipientEmail,
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'active',
    };

    StorageService.saveGiftCard(newCard);
    setGeneratedCard(newCard);
    showToast(`Đã tạo thành công Thẻ Quà Tặng trị giá ${formatCurrency(selectedDenom)}!`, 'success');
  };

  const handleCopyCode = (code: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      showToast('Đã sao chép mã thẻ vào bộ nhớ tạm!', 'success');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* 1. HERO HEADER */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-extrabold uppercase tracking-widest text-neutral-400">
          E-GIFT CARDS
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 font-['Space_Grotesk']">
          THẺ QUÀ TẶNG PY E-GIFT
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
          Món quà tinh tế và hoàn hảo nhất dành cho những tín đồ đam mê sneaker. Người nhận có thể tự do chọn kích thước, màu sắc và mẫu giày yêu thích.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT: BUY GIFT CARD (7 COLS) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-neutral-100 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-neutral-100 font-extrabold text-sm text-neutral-950 uppercase tracking-wider">
            <Gift className="w-4 h-4 text-amber-500" />
            <span>1. Mua Thẻ Quà Tặng Mới</span>
          </div>

          {generatedCard ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-3xl space-y-4 text-center">
              <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-neutral-950">Đã Tạo Thẻ Quà Tặng Thành Công!</h3>
              <p className="text-xs text-neutral-600">
                Thẻ đã được kích hoạt và gửi thông báo đến email <strong>{generatedCard.recipientEmail}</strong>.
              </p>

              <div className="p-4 bg-white rounded-2xl border border-emerald-200 inline-flex items-center gap-3">
                <span className="font-mono font-extrabold text-base text-neutral-950">{generatedCard.code}</span>
                <button
                  onClick={() => handleCopyCode(generatedCard.code)}
                  className="p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-700 transition-colors"
                  title="Sao chép"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs font-bold text-neutral-900">
                Số dư: <span className="text-emerald-700">{formatCurrency(generatedCard.currentBalance)}</span> • HSD: 1 năm
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setGeneratedCard(null)}
                  className="px-6 py-2.5 bg-neutral-950 text-white text-xs font-bold rounded-xl hover:bg-neutral-800"
                >
                  Tạo Thẻ Quà Tặng Khác
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleBuyGiftCard} className="space-y-5">
              {/* Denomination Picker */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-2">Chọn Mệnh Giá Thẻ:</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {denominations.map(denom => (
                    <button
                      key={denom}
                      type="button"
                      onClick={() => setSelectedDenom(denom)}
                      className={`p-3 rounded-2xl border text-xs font-bold transition-all ${
                        selectedDenom === denom
                          ? 'border-neutral-950 bg-neutral-950 text-white shadow-md'
                          : 'border-neutral-200 hover:border-neutral-400 bg-white text-neutral-800'
                      }`}
                    >
                      {formatCurrency(denom)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipient Form */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Tên người nhận *</label>
                  <input
                    type="text"
                    required
                    value={recipientName}
                    onChange={e => setRecipientName(e.target.value)}
                    placeholder="Nguyễn Phương Thảo"
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-neutral-950 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Email người nhận *</label>
                  <input
                    type="email"
                    required
                    value={recipientEmail}
                    onChange={e => setRecipientEmail(e.target.value)}
                    placeholder="thao.nguyen@example.com"
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-neutral-950 focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Lời nhắn gửi (Tùy chọn)</label>
                  <textarea
                    rows={2}
                    value={giftMessage}
                    onChange={e => setGiftMessage(e.target.value)}
                    placeholder="Chúc mừng sinh nhật bạn! Hãy chọn cho mình đôi giày yêu thích nhé..."
                    className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-neutral-950 focus:bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-neutral-950 text-white rounded-2xl text-xs font-extrabold hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <Send className="w-4 h-4" />
                <span>Thanh Toán & Kích Hoạt Thẻ Quà Tặng ({formatCurrency(selectedDenom)})</span>
              </button>
            </form>
          )}
        </div>

        {/* RIGHT: CHECK BALANCE (5 COLS) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-neutral-100 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-neutral-100 font-extrabold text-sm text-neutral-950 uppercase tracking-wider">
            <Search className="w-4 h-4 text-sky-600" />
            <span>2. Tra Cứu Số Dư Thẻ Quà Tặng</span>
          </div>

          <form onSubmit={handleCheckBalance} className="space-y-3">
            <label className="block text-xs font-bold text-neutral-700">Nhập mã Thẻ Quà Tặng:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={checkCode}
                onChange={e => {
                  setCheckCode(e.target.value.toUpperCase());
                  setCheckError('');
                }}
                placeholder="VD: SOLE-VIP-1000..."
                className="flex-1 uppercase text-xs px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-950"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-neutral-950 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors"
              >
                Kiểm Tra
              </button>
            </div>
            {checkError && <p className="text-[11px] text-rose-600 mt-1">{checkError}</p>}
          </form>

          {checkedCard && (
            <div className="p-5 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-3 text-xs">
              <div className="flex items-center justify-between font-mono font-bold text-neutral-950">
                <span>{checkedCard.code}</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] rounded">Đang Hoạt Động</span>
              </div>
              <div className="flex justify-between border-t border-amber-200/60 pt-2">
                <span className="text-neutral-600">Mệnh giá ban đầu:</span>
                <strong className="text-neutral-900">{formatCurrency(checkedCard.initialBalance)}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Số dư khả dụng:</span>
                <strong className="text-amber-900 text-sm">{formatCurrency(checkedCard.currentBalance)}</strong>
              </div>
              <div className="flex justify-between text-neutral-500 text-[11px]">
                <span>Hạn sử dụng:</span>
                <span>{checkedCard.expiryDate}</span>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-neutral-100 text-xs text-neutral-500 space-y-2">
            <div className="font-bold text-neutral-800">Quy định sử dụng:</div>
            <ul className="list-disc pl-4 space-y-1 text-[11px] leading-relaxed">
              <li>Thẻ có giá trị tương đương tiền mặt khi thanh toán tại PY.</li>
              <li>Có thể sử dụng nhiều lần cho đến khi số dư về 0.</li>
              <li>Có thể áp dụng đồng thời cùng mã giảm giá coupon.</li>
            </ul>
          </div>
        </div>

      </div>

    </div>
  );
};
