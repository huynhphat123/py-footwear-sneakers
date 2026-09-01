import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  Phone,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    login,
    register,
  } = useShop();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authModalMode === 'login') {
      login(email, password);
    } else {
      register(name, email, phone, password);
    }
  };

  const handleQuickLogin = (demoEmail: string) => {
    login(demoEmail, 'password');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-950/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsAuthModalOpen(false)}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-md bg-white dark:bg-[#1a1a1a] text-neutral-900 dark:text-neutral-100 rounded-3xl shadow-2xl overflow-hidden z-10 border border-neutral-100 dark:border-neutral-800 p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close button */}
        <button
          id="auth-modal-close-btn"
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 rounded-2xl flex items-center justify-center font-extrabold text-xl mx-auto mb-3 shadow-lg">
            PY
          </div>
          <h2 className="text-xl font-extrabold text-neutral-950 dark:text-white font-['Space_Grotesk']">
            {authModalMode === 'login' ? 'Đăng Nhập Tài Khoản' : 'Tạo Tài Khoản Mới'}
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            {authModalMode === 'login'
              ? 'Nhập email và mật khẩu của bạn để tiếp tục'
              : 'Đăng ký nhận ngay voucher 10% và tích điểm hội viên'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {authModalMode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">Họ và tên *</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-neutral-400 dark:text-neutral-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white rounded-xl text-xs focus:outline-none focus:border-neutral-950 dark:focus:border-white focus:bg-white dark:focus:bg-neutral-800 transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">Địa chỉ Email *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 dark:text-neutral-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white rounded-xl text-xs focus:outline-none focus:border-neutral-950 dark:focus:border-white focus:bg-white dark:focus:bg-neutral-800 transition-all"
              />
            </div>
          </div>

          {authModalMode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">Số điện thoại *</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-neutral-400 dark:text-neutral-500 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="0912 345 678"
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white rounded-xl text-xs focus:outline-none focus:border-neutral-950 dark:focus:border-white focus:bg-white dark:focus:bg-neutral-800 transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">Mật khẩu *</label>
              {authModalMode === 'login' && (
                <button
                  type="button"
                  onClick={() => alert('Thông tin đặt lại mật khẩu đã được gửi đến email của bạn.')}
                  className="text-[11px] text-neutral-500 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white underline"
                >
                  Quên mật khẩu?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 dark:text-neutral-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white rounded-xl text-xs focus:outline-none focus:border-neutral-950 dark:focus:border-white focus:bg-white dark:focus:bg-neutral-800 transition-all"
              />
            </div>
          </div>

          {authModalMode === 'login' && (
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="auth-remember"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="rounded border-neutral-300 dark:border-neutral-600 text-neutral-950 dark:text-white focus:ring-0"
              />
              <label htmlFor="auth-remember" className="text-xs text-neutral-600 dark:text-neutral-400 cursor-pointer">
                Ghi nhớ đăng nhập
              </label>
            </div>
          )}

          <button
            type="submit"
            id="auth-submit-btn"
            className="w-full py-3 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 rounded-xl font-bold text-xs hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all flex items-center justify-center gap-2 shadow-lg mt-2"
          >
            <span>{authModalMode === 'login' ? 'Đăng Nhập' : 'Tạo Tài Khoản'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-6 text-center text-xs text-neutral-600 dark:text-neutral-400">
          {authModalMode === 'login' ? (
            <span>
              Chưa có tài khoản?{' '}
              <button
                id="toggle-to-register-btn"
                type="button"
                onClick={() => setAuthModalMode('register')}
                className="font-bold text-neutral-950 dark:text-white underline hover:text-neutral-700 dark:hover:text-neutral-300 ml-1"
              >
                Đăng ký ngay
              </button>
            </span>
          ) : (
            <span>
              Đã có tài khoản?{' '}
              <button
                id="toggle-to-login-btn"
                type="button"
                onClick={() => setAuthModalMode('login')}
                className="font-bold text-neutral-950 dark:text-white underline hover:text-neutral-700 dark:hover:text-neutral-300 ml-1"
              >
                Đăng nhập
              </button>
            </span>
          )}
        </div>

      </div>
    </div>
  );
};
