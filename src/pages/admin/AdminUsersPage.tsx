import React, { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { StorageService } from '../../services/storageService';
import { ApiService } from '../../services/apiService';
import { formatDate } from '../../utils/format';
import { User } from '../../types';
import {
  Users,
  Search,
  ShieldCheck,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Calendar,
  RefreshCw,
  Sparkles,
  Lock,
  Unlock,
} from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const { showToast } = useShop();
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'customer'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    // 1. Try fetching from Backend MySQL
    const mysqlUsers = await ApiService.getUsers();
    if (mysqlUsers && Array.isArray(mysqlUsers)) {
      setUsers(mysqlUsers);
      setIsBackendConnected(true);
    } else {
      // 2. Fallback to LocalStorage
      setUsers(StorageService.getUsers());
      setIsBackendConnected(false);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (user: User) => {
    if (user.role === 'admin' && user.email === 'admin@pyfootwear.vn') {
      showToast('Không thể khóa tài khoản Super Admin mặc định!', 'error');
      return;
    }

    if (isBackendConnected) {
      const res = await ApiService.toggleUserStatus(user.id);
      if (res.success) {
        showToast(res.message, 'success');
        fetchUsers();
        return;
      }
    }

    // Local update
    const updatedUser = { ...user, isActive: !user.isActive };
    StorageService.saveUser(updatedUser);
    showToast(`Đã ${updatedUser.isActive ? 'kích hoạt' : 'tạm khóa'} tài khoản ${user.name}!`, 'info');
    fetchUsers();
  };

  const handleToggleRole = async (user: User) => {
    if (user.email === 'admin@pyfootwear.vn') {
      showToast('Không thể hạ quyền Super Admin mặc định!', 'error');
      return;
    }
    const newRole: 'admin' | 'customer' = user.role === 'admin' ? 'customer' : 'admin';

    if (isBackendConnected) {
      const res = await ApiService.changeUserRole(user.id, newRole);
      if (res.success) {
        showToast(res.message, 'success');
        fetchUsers();
        return;
      }
    }

    // Local update
    const updatedUser = { ...user, role: newRole };
    StorageService.saveUser(updatedUser);
    showToast(`Đã chuyển vai trò của ${user.name} sang: ${newRole === 'admin' ? 'Quản Trị Viên' : 'Khách Hàng'}!`, 'success');
    fetchUsers();
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.phone && user.phone.includes(searchQuery));
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const totalAdmins = users.filter(u => u.role === 'admin').length;
  const totalCustomers = users.filter(u => u.role === 'customer').length;

  return (
    <div className="space-y-6">
      
      {/* 1. TOP HEADER & STATS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white font-['Space_Grotesk'] flex items-center gap-2.5">
            <Users className="w-6 h-6 text-sky-400" />
            <span>Quản Lý Người Dùng & Khách Hàng</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Theo dõi toàn bộ tài khoản đăng ký trong cơ sở dữ liệu {isBackendConnected ? '(MySQL Database Online)' : '(LocalStorage)'}
          </p>
        </div>

        <button
          onClick={fetchUsers}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors self-start sm:self-auto border border-slate-700 shadow-md"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Làm Mới Danh Sách</span>
        </button>
      </div>

      {/* 2. STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-slate-400 text-xs font-bold">Tổng Số Tài Khoản</div>
            <div className="text-2xl font-extrabold text-white mt-1 font-['Space_Grotesk']">{users.length}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-950/60 border border-sky-800 text-sky-400 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-slate-400 text-xs font-bold">Khách Hàng (Customers)</div>
            <div className="text-2xl font-extrabold text-emerald-400 mt-1 font-['Space_Grotesk']">{totalCustomers}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-400 flex items-center justify-center font-bold">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-slate-400 text-xs font-bold">Quản Trị Viên (Admins)</div>
            <div className="text-2xl font-extrabold text-amber-400 mt-1 font-['Space_Grotesk']">{totalAdmins}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-800 text-amber-400 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. FILTERS & SEARCH */}
      <div className="flex flex-col sm:flex-row gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Tìm theo họ tên, Gmail hoặc số điện thoại..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex gap-2">
          {(['all', 'customer', 'admin'] as const).map(role => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
                roleFilter === role
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {role === 'all' && 'Tất cả'}
              {role === 'customer' && 'Khách hàng'}
              {role === 'admin' && 'Admin'}
            </button>
          ))}
        </div>
      </div>

      {/* 4. USERS TABLE */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/50 uppercase tracking-wider font-bold">
                <th className="py-3.5 px-4">Người Dùng</th>
                <th className="py-3.5 px-4">Email / Gmail</th>
                <th className="py-3.5 px-4">Số Điện Thoại</th>
                <th className="py-3.5 px-4">Vai Trò</th>
                <th className="py-3.5 px-4">Ngày Đăng Ký</th>
                <th className="py-3.5 px-4">Trạng Thái</th>
                <th className="py-3.5 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 font-medium">
                    Không tìm thấy tài khoản người dùng nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-slate-900/50 transition-colors">
                    
                    {/* User Info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 text-white font-bold flex items-center justify-center text-xs shrink-0 overflow-hidden">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            user.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-white text-xs">{user.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono">ID: {user.id}</div>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                        <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="font-mono text-xs">{user.email}</span>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="py-3 px-4">
                      {user.phone ? (
                        <div className="flex items-center gap-1.5 text-slate-300 font-mono">
                          <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span>{user.phone}</span>
                        </div>
                      ) : (
                        <span className="text-slate-600 italic">Chưa cập nhật</span>
                      )}
                    </td>

                    {/* Role */}
                    <td className="py-3 px-4">
                      {user.role === 'admin' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-amber-950/60 text-amber-400 border border-amber-800/80">
                          <ShieldCheck className="w-3 h-3" />
                          Quản Trị Viên
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                          <UserCheck className="w-3 h-3 text-emerald-400" />
                          Khách Hàng
                        </span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                      {user.createdAt ? formatDate(user.createdAt) : '2025-01-01'}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      {user.isActive ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          Đang Hoạt Động
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                          Đã Tạm Khóa
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-right">
                      {user.email !== 'admin@pyfootwear.vn' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Change Role Button */}
                          <button
                            onClick={() => handleToggleRole(user)}
                            className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                              user.role === 'admin'
                                ? 'bg-amber-950/40 hover:bg-amber-900/60 text-amber-400 border-amber-800/80'
                                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
                            }`}
                            title={user.role === 'admin' ? 'Chuyển về tài khoản Khách Hàng' : 'Nâng cấp lên Quản Trị Viên (Admin)'}
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                          </button>

                          {/* Toggle Active/Lock Status Button */}
                          <button
                            onClick={() => handleToggleStatus(user)}
                            className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                              user.isActive
                                ? 'bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border-rose-800/80'
                                : 'bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-400 border-emerald-800/80'
                            }`}
                            title={user.isActive ? 'Tạm khóa tài khoản này' : 'Kích hoạt lại tài khoản'}
                          >
                            {user.isActive ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-600 italic">Mặc định</span>
                      )}
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
