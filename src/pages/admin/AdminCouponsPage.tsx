import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { Coupon } from '../../types';
import { StorageService } from '../../services/storageService';
import { formatCurrency } from '../../utils/format';
import {
  Tag,
  Plus,
  Trash2,
  Check,
  X,
  Sparkles,
  Calendar,
  AlertCircle,
  Copy,
} from 'lucide-react';

export const AdminCouponsPage: React.FC = () => {
  const { refreshData, showToast } = useShop();
  const coupons = StorageService.getCoupons();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formCoupon, setFormCoupon] = useState<Partial<Coupon>>({
    code: '',
    type: 'percentage',
    value: 10,
    minimumOrder: 2000000,
    usageLimit: 100,
    usedCount: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'active',
  });

  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCoupon.code) return;

    const newCoupon: Coupon = {
      id: `cp-${Date.now()}`,
      code: formCoupon.code.toUpperCase().trim(),
      type: (formCoupon.type || 'percentage') as 'percentage' | 'fixed',
      value: Number(formCoupon.value),
      minimumOrder: Number(formCoupon.minimumOrder) || 0,
      usageLimit: Number(formCoupon.usageLimit) || 100,
      usedCount: 0,
      startDate: formCoupon.startDate || new Date().toISOString().split('T')[0],
      endDate: formCoupon.endDate || '2026-12-31',
      status: formCoupon.status || 'active',
      description: formCoupon.type === 'percentage'
        ? `Giảm ${formCoupon.value}% cho đơn từ ${formatCurrency(Number(formCoupon.minimumOrder))}`
        : `Giảm trực tiếp ${formatCurrency(Number(formCoupon.value))} cho đơn từ ${formatCurrency(Number(formCoupon.minimumOrder))}`,
    };

    StorageService.saveCoupon(newCoupon);
    refreshData();
    setIsModalOpen(false);
    showToast(`Đã tạo mã giảm giá ${newCoupon.code} thành công!`, 'success');
  };

  const handleToggleActive = (coupon: Coupon) => {
    coupon.status = coupon.status === 'active' ? 'inactive' : 'active';
    StorageService.saveCoupon(coupon);
    refreshData();
    showToast(`Đã cập nhật trạng thái mã ${coupon.code}!`, 'info');
  };

  const handleDeleteCoupon = (couponId: string) => {
    if (window.confirm('Bạn có chắc muốn xóa mã giảm giá này?')) {
      StorageService.deleteCoupon(couponId);
      refreshData();
      showToast('Đã xóa mã giảm giá thành công!', 'info');
    }
  };

  const handleCopy = (code: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      showToast('Đã sao chép mã coupon!', 'success');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white font-['Space_Grotesk']">
            QUẢN LÝ MÃ GIẢM GIÁ & COUPON
          </h2>
          <p className="text-xs text-slate-400">Tạo voucher giảm % hoặc giảm tiền cố định cho các chiến dịch bán hàng</p>
        </div>

        <button
          onClick={() => {
            setFormCoupon({
              code: '',
              type: 'percentage',
              value: 10,
              minimumOrder: 2000000,
              usageLimit: 100,
              usedCount: 0,
              startDate: new Date().toISOString().split('T')[0],
              endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              status: 'active',
            });
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-sky-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Mã Khuyến Mãi Mới</span>
        </button>
      </div>

      {/* COUPONS TABLE */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider bg-slate-900/40">
                <th className="py-3.5 px-4">Mã Coupon</th>
                <th className="py-3.5 px-4">Giá Trị Giảm</th>
                <th className="py-3.5 px-4">Đơn Tối Thiểu</th>
                <th className="py-3.5 px-4">Lượt Sử Dụng</th>
                <th className="py-3.5 px-4">Hạn Sử Dụng</th>
                <th className="py-3.5 px-4">Trạng Thái</th>
                <th className="py-3.5 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 text-slate-300">
              {coupons.map(cp => (
                <tr key={cp.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-extrabold text-white text-sm bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                        {cp.code}
                      </span>
                      <button onClick={() => handleCopy(cp.code)} className="text-slate-500 hover:text-white" title="Sao chép">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-emerald-400">
                    {cp.type === 'percentage' ? `Giảm ${cp.value}%` : `Giảm ${formatCurrency(cp.value)}`}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-300">
                    {formatCurrency(cp.minimumOrder)}
                  </td>

                  <td className="py-3.5 px-4 font-mono">
                    {cp.usedCount} / {cp.usageLimit} lượt
                  </td>

                  <td className="py-3.5 px-4 text-[11px] text-slate-400">
                    {cp.endDate}
                  </td>

                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleToggleActive(cp)}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase transition-colors ${
                        cp.status === 'active'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-rose-950 text-rose-400 border border-rose-800'
                      }`}
                    >
                      {cp.status === 'active' ? 'Đang Kích Hoạt' : 'Đã Tạm Dừng'}
                    </button>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleDeleteCoupon(cp.id)}
                      className="p-1.5 hover:bg-rose-950 text-slate-400 hover:text-rose-400 rounded-lg transition-colors"
                      title="Xóa voucher"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 text-xs text-slate-300 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="font-extrabold text-base text-white font-['Space_Grotesk']">
                Tạo Mã Giảm Giá Mới
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-4">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Mã Code (In hoa, không dấu) *</label>
                <input
                  type="text"
                  required
                  value={formCoupon.code}
                  onChange={e => setFormCoupon({ ...formCoupon, code: e.target.value.toUpperCase() })}
                  placeholder="VD: SOLE10, SUMMER500K..."
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white uppercase font-mono focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Loại Giảm Giá *</label>
                  <select
                    value={formCoupon.type}
                    onChange={e => setFormCoupon({ ...formCoupon, type: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="percentage">Theo phần trăm (%)</option>
                    <option value="fixed">Theo số tiền cố định (VNĐ)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Giá Trị Giảm *</label>
                  <input
                    type="number"
                    required
                    value={formCoupon.value}
                    onChange={e => setFormCoupon({ ...formCoupon, value: Number(e.target.value) })}
                    placeholder={formCoupon.type === 'percentage' ? '10' : '200000'}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Đơn Tối Thiểu (VNĐ)</label>
                  <input
                    type="number"
                    value={formCoupon.minimumOrder}
                    onChange={e => setFormCoupon({ ...formCoupon, minimumOrder: Number(e.target.value) })}
                    placeholder="2000000"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Giới Hạn Lượt Dùng</label>
                  <input
                    type="number"
                    value={formCoupon.usageLimit}
                    onChange={e => setFormCoupon({ ...formCoupon, usageLimit: Number(e.target.value) })}
                    placeholder="100"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-bold text-slate-300 mb-1">Ngày Hết Hạn</label>
                  <input
                    type="date"
                    value={formCoupon.endDate}
                    onChange={e => setFormCoupon({ ...formCoupon, endDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-900 text-slate-300 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-extrabold rounded-xl shadow-lg"
                >
                  Kích Hoạt Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
