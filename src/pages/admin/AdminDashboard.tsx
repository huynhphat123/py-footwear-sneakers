import React from 'react';
import { useShop } from '../../context/ShopContext';
import { formatCurrency, formatDateTime } from '../../utils/format';
import {
  DollarSign,
  ShoppingCart,
  Package,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Eye,
  Plus,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateTab }) => {
  const { allOrders, products, updateOrderStatus } = useShop();

  // Metrics
  const totalRevenue = allOrders
    .filter(o => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = allOrders.filter(o => o.orderStatus === 'pending');
  const processingOrders = allOrders.filter(o => o.orderStatus === 'processing');
  const deliveredOrders = allOrders.filter(o => o.orderStatus === 'delivered');
  const cancelledOrders = allOrders.filter(o => o.orderStatus === 'cancelled');

  // Low stock variants calculation
  const lowStockVariants: Array<{
    productName: string;
    brandName: string;
    color: string;
    size: string;
    stockQuantity: number;
    reservedQuantity: number;
    sku: string;
  }> = [];

  products.forEach(p => {
    p.variants.forEach(v => {
      const netStock = v.stockQuantity - v.reservedQuantity;
      if (netStock <= 3) {
        lowStockVariants.push({
          productName: p.name,
          brandName: p.brandName,
          color: v.color,
          size: v.size,
          stockQuantity: v.stockQuantity,
          reservedQuantity: v.reservedQuantity,
          sku: v.sku,
        });
      }
    });
  });

  const recentOrders = [...allOrders].reverse().slice(0, 6);

  return (
    <div className="space-y-8">
      
      {/* 1. TOP METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Revenue */}
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Doanh Thu Đã Thu</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk']">
            {formatCurrency(totalRevenue)}
          </div>
          <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Đã ghi nhận {allOrders.filter(o => o.paymentStatus === 'paid').length} giao dịch thành công</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Tổng Đơn Hàng</span>
            <div className="w-10 h-10 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk']">
            {allOrders.length}
          </div>
          <div className="text-[11px] text-slate-400">
            <span>{pendingOrders.length} đơn chờ duyệt • {processingOrders.length} đang đóng gói</span>
          </div>
        </div>

        {/* Total Products in Catalog */}
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Sản Phẩm Đang Bán</span>
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk']">
            {products.length}
          </div>
          <div className="text-[11px] text-slate-400">
            <span>
              {products.reduce((acc, p) => acc + p.variants.length, 0)} biến thể size/color
            </span>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Cảnh Báo Tồn Kho</span>
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-400 font-['Space_Grotesk']">
            {lowStockVariants.length}
          </div>
          <div className="text-[11px] text-rose-400">
            <span>Biến thể có tồn kho &le; 3 cần nhập thêm</span>
          </div>
        </div>

      </div>

      {/* 2. LOW STOCK NOTIFICATION LIST */}
      {lowStockVariants.length > 0 && (
        <div className="bg-slate-950 rounded-3xl border border-rose-900/50 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-400 font-extrabold text-sm uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" />
              <span>Cảnh Báo Tồn Kho Sắp Hết ({lowStockVariants.length} mặt hàng)</span>
            </div>
            <button
              onClick={() => onNavigateTab('products')}
              className="text-xs font-bold text-sky-400 hover:underline"
            >
              Xem Kho Chi Tiết &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStockVariants.slice(0, 6).map((item, idx) => (
              <div key={idx} className="p-3.5 bg-slate-900/80 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white truncate max-w-[180px]">{item.productName}</div>
                  <div className="text-[11px] text-slate-400">
                    Size: <strong>{item.size}</strong> • {item.color}
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded bg-rose-950 border border-rose-800 text-rose-300 font-bold font-mono">
                    Còn {item.stockQuantity - item.reservedQuantity} đôi
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. RECENT ORDERS TABLE */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="font-extrabold text-sm text-white uppercase tracking-wider font-['Space_Grotesk']">
              Đơn Hàng Gần Đây Cần Xử Lý
            </h3>
            <p className="text-xs text-slate-400">Duyệt và cập nhật trạng thái giao hàng tức thì</p>
          </div>

          <button
            onClick={() => onNavigateTab('orders')}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-bold text-sky-400 transition-colors"
          >
            Xem Tất Cả ({allOrders.length})
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Mã Đơn</th>
                <th className="py-3 px-4">Khách Hàng</th>
                <th className="py-3 px-4">Ngày Đặt</th>
                <th className="py-3 px-4">Tổng Tiền</th>
                <th className="py-3 px-4">Thanh Toán</th>
                <th className="py-3 px-4">Trạng Thái</th>
                <th className="py-3 px-4 text-right">Thao Tác Nhanh</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 text-slate-300">
              {recentOrders.map(order => (
                <tr key={order.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-white">{order.orderNumber}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white">{order.customerName}</div>
                    <div className="text-[11px] text-slate-400">{order.customerPhone}</div>
                  </td>
                  <td className="py-3.5 px-4 text-[11px] text-slate-400">{formatDateTime(order.createdAt)}</td>
                  <td className="py-3.5 px-4 font-extrabold text-emerald-400">{formatCurrency(order.total)}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                      order.paymentStatus === 'paid'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      {order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chờ thu tiền'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                      order.orderStatus === 'pending'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : order.orderStatus === 'processing'
                        ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                        : order.orderStatus === 'shipped'
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {order.orderStatus === 'pending' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'processing', 'Admin đã duyệt và chuyển sang đóng gói')}
                        className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-bold text-[11px] transition-colors"
                      >
                        Duyệt Đơn
                      </button>
                    )}
                    {order.orderStatus === 'processing' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'shipped', 'Đã bàn giao đơn vị vận chuyển Viettel Post')}
                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold text-[11px] transition-colors"
                      >
                        Giao Hàng
                      </button>
                    )}
                    {order.orderStatus === 'shipped' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'delivered', 'Khách hàng đã nhận giày thành công')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-[11px] transition-colors"
                      >
                        Hoàn Tất
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
