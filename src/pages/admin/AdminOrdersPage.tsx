import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { Order, OrderStatus } from '../../types';
import { StorageService } from '../../services/storageService';
import { formatCurrency, formatDateTime } from '../../utils/format';
import {
  Search,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Eye,
  Phone,
  Mail,
  MapPin,
  FileText,
  Tag,
  CreditCard,
  Send,
  X,
} from 'lucide-react';

export const AdminOrdersPage: React.FC = () => {
  const { allOrders, updateOrderStatus, refreshData, showToast } = useShop();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [noteInput, setNoteInput] = useState<string>('');
  const [trackingNumberInput, setTrackingNumberInput] = useState<string>('');

  const filteredOrders = allOrders.filter(order => {
    const matchStatus = statusFilter === 'all' || order.orderStatus === statusFilter;
    const matchSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerPhone.includes(searchQuery);
    return matchStatus && matchSearch;
  });

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus, customNote?: string) => {
    updateOrderStatus(orderId, newStatus, customNote);
    if (selectedOrder && selectedOrder.id === orderId) {
      const updated = StorageService.getOrders().find(o => o.id === orderId);
      if (updated) setSelectedOrder(updated);
    }
  };

  const handleAddTimelineNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !noteInput.trim()) return;

    selectedOrder.timeline.push({
      status: selectedOrder.orderStatus,
      timestamp: new Date().toISOString(),
      note: noteInput.trim(),
    });

    if (trackingNumberInput.trim()) {
      selectedOrder.trackingNumber = trackingNumberInput.trim();
    }

    StorageService.saveOrder(selectedOrder);
    setNoteInput('');
    refreshData();
    showToast('Đã thêm ghi chú tiến độ giao hàng thành công!', 'success');
  };

  const handleTogglePaymentStatus = (order: Order) => {
    const newStatus = order.paymentStatus === 'paid' ? 'pending' : 'paid';
    order.paymentStatus = newStatus;
    order.timeline.push({
      status: order.orderStatus,
      timestamp: new Date().toISOString(),
      note: `Admin cập nhật thanh toán: ${newStatus === 'paid' ? 'Đã thu tiền' : 'Chưa thanh toán (Chờ)'}`,
    });
    StorageService.saveOrder(order);
    refreshData();
    setSelectedOrder({ ...order });
    showToast(`Đã đổi trạng thái thanh toán thành ${newStatus}!`, 'success');
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white font-['Space_Grotesk']">
            QUẢN LÝ ĐƠN HÀNG TOÀN HỆ THỐNG
          </h2>
          <p className="text-xs text-slate-400">Theo dõi tiến độ duyệt, đóng gói, bàn giao vận chuyển và thu hộ COD</p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Tìm theo mã đơn, tên khách, SĐT..."
            className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'Tất cả', count: allOrders.length },
          { id: 'pending', label: 'Chờ duyệt', count: allOrders.filter(o => o.orderStatus === 'pending').length },
          { id: 'processing', label: 'Đang đóng gói', count: allOrders.filter(o => o.orderStatus === 'processing').length },
          { id: 'shipped', label: 'Đang giao hàng', count: allOrders.filter(o => o.orderStatus === 'shipped').length },
          { id: 'delivered', label: 'Đã hoàn thành', count: allOrders.filter(o => o.orderStatus === 'delivered').length },
          { id: 'cancelled', label: 'Đã hủy', count: allOrders.filter(o => o.orderStatus === 'cancelled').length },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
              statusFilter === tab.id
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            <span>{tab.label}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-200">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* ORDERS LIST */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider bg-slate-900/40">
                <th className="py-3.5 px-4">Mã Đơn Hàng</th>
                <th className="py-3.5 px-4">Khách Hàng & Liên Hệ</th>
                <th className="py-3.5 px-4">Ngày Đặt</th>
                <th className="py-3.5 px-4">Hình Thức TT</th>
                <th className="py-3.5 px-4">Tổng Tiền</th>
                <th className="py-3.5 px-4">Trạng Thái</th>
                <th className="py-3.5 px-4 text-right">Chi Tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 text-slate-300">
              {filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-white">{order.orderNumber}</td>
                  
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white">{order.customerName}</div>
                    <div className="text-[11px] text-slate-400">{order.customerPhone}</div>
                  </td>

                  <td className="py-3.5 px-4 text-[11px] text-slate-400">{formatDateTime(order.createdAt)}</td>

                  <td className="py-3.5 px-4">
                    <div className="uppercase font-bold text-[11px] text-slate-300">
                      {order.paymentMethod === 'vnpay' ? 'VNPay 2.1.0' : order.paymentMethod === 'cod' ? 'COD' : 'Chuyển Khoản'}
                    </div>
                    <span className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                      order.paymentStatus === 'paid'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      {order.paymentStatus === 'paid' ? 'Đã Thanh Toán' : 'Chờ Thu Tiền'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-extrabold text-emerald-400 text-sm">
                    {formatCurrency(order.total)}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                      order.orderStatus === 'pending'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : order.orderStatus === 'processing'
                        ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                        : order.orderStatus === 'shipped'
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        : order.orderStatus === 'delivered'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}>
                      {order.orderStatus}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setTrackingNumberInput(order.trackingNumber || '');
                      }}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-sky-400 font-bold rounded-lg text-xs transition-colors inline-flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Xử Lý Đơn</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: ORDER DETAILS & PROCESSING */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto space-y-6 text-xs text-slate-300 shadow-2xl">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-extrabold text-base text-white font-['Space_Grotesk']">
                    Đơn Hàng: {selectedOrder.orderNumber}
                  </h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    selectedOrder.paymentStatus === 'paid' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
                  }`}>
                    {selectedOrder.paymentStatus === 'paid' ? 'Đã Thanh Toán' : 'Chưa Thanh Toán'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Khởi tạo lúc: {formatDateTime(selectedOrder.createdAt)}</p>
              </div>

              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Status Control Bar */}
            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
              <div className="font-bold text-white uppercase tracking-wider text-[11px]">
                Chuyển Đổi Trạng Thái Xử Lý:
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'processing', 'Duyệt đơn và chuyển sang bộ phận kho đóng gói')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                    selectedOrder.orderStatus === 'processing'
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-950 border border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  1. Duyệt & Đóng Gói
                </button>

                <button
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'shipping', `Bàn giao cho bưu tá giao hàng (Mã vận đơn: ${trackingNumberInput || 'GHTK-VN-001'})`)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                    selectedOrder.orderStatus === 'shipping'
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-950 border border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  2. Bàn Giao Vận Chuyển
                </button>

                <button
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'delivered', 'Giao hàng thành công đến tay khách hàng')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                    selectedOrder.orderStatus === 'delivered'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-950 border border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  3. Hoàn Tất Đơn Hàng
                </button>

                <button
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'cancelled', 'Hủy đơn hàng theo yêu cầu và hoàn trả tồn kho')}
                  className="px-3 py-1.5 bg-rose-950/70 border border-rose-800 hover:bg-rose-900 text-rose-300 rounded-xl font-bold transition-colors"
                >
                  Hủy Đơn & Hoàn Tồn Kho
                </button>
              </div>
            </div>

            {/* Customer & Address Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
                <div className="font-bold text-white uppercase text-[11px]">Thông Tin Khách Hàng</div>
                <div><strong>Họ tên:</strong> {selectedOrder.customerName}</div>
                <div><strong>SĐT:</strong> {selectedOrder.customerPhone}</div>
                <div><strong>Email:</strong> {selectedOrder.customerEmail}</div>
              </div>

              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
                <div className="font-bold text-white uppercase text-[11px]">Địa Chỉ Nhận Hàng</div>
                <div>{selectedOrder.shippingAddress.street}</div>
                <div>{selectedOrder.shippingAddress.ward}, {selectedOrder.shippingAddress.district}, {selectedOrder.shippingAddress.province}</div>
                {selectedOrder.note && <div className="italic text-slate-400">Ghi chú: {selectedOrder.note}</div>}
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-2">
              <div className="font-bold text-white uppercase text-[11px]">Sản Phẩm Đặt Mua ({selectedOrder.items.length})</div>
              <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden divide-y divide-slate-800">
                {selectedOrder.items.map(item => (
                  <div key={item.id} className="p-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-950" referrerPolicy="no-referrer" />
                      <div>
                        <div className="font-bold text-white">{item.productName}</div>
                        <div className="text-[11px] text-slate-400">Size: {item.size} • {item.color} • x{item.quantity}</div>
                      </div>
                    </div>
                    <div className="font-extrabold text-emerald-400 font-mono">{formatCurrency(item.subtotal)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment & Invoice summary */}
            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex justify-between items-center text-xs">
              <div>
                <div>Hình thức: <strong className="uppercase text-white">{selectedOrder.paymentMethod}</strong></div>
                <button
                  onClick={() => handleTogglePaymentStatus(selectedOrder)}
                  className="mt-1 text-sky-400 hover:underline font-bold"
                >
                  Đổi trạng thái thanh toán ({selectedOrder.paymentStatus === 'paid' ? 'Hủy đánh dấu Đã TT' : 'Đánh dấu Đã Thu Tiền'})
                </button>
              </div>

              <div className="text-right">
                <div className="text-slate-400">Tổng thanh toán:</div>
                <div className="text-base font-extrabold text-rose-400 font-mono">{formatCurrency(selectedOrder.total)}</div>
              </div>
            </div>

            {/* Timeline Notes */}
            <div className="space-y-3">
              <div className="font-bold text-white uppercase text-[11px]">Nhật Ký & Mã Vận Đơn</div>

              <form onSubmit={handleAddTimelineNote} className="flex gap-2">
                <input
                  type="text"
                  value={noteInput}
                  onChange={e => setNoteInput(e.target.value)}
                  placeholder="Thêm ghi chú giao hàng (VD: Đã đóng thùng double-box)..."
                  className="flex-1 px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-sky-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Lưu Ghi Chú</span>
                </button>
              </form>

              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {selectedOrder.timeline.map((tl, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800 text-[11px] flex justify-between">
                    <span>{tl.note}</span>
                    <span className="text-slate-500">{formatDateTime(tl.timestamp)}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
