import React, { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  Phone,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    login,
    register,
    showToast,
  } = useShop();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Eye toggle state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation error state
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // Reset errors when mode changes
  useEffect(() => {
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setPhoneError('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  }, [authModalMode, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const validateEmailFormat = (val: string): boolean => {
    const clean = val.trim().toLowerCase();
    if (!clean) {
      setEmailError('Địa chỉ email bắt buộc phải nhập!');
      return false;
    }
    if (!clean.includes('@')) {
      setEmailError('Email bắt buộc phải chứa ký tự @ (ví dụ: name@gmail.com)!');
      return false;
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(clean)) {
      setEmailError('Định dạng email không hợp lệ (ví dụ: name@gmail.com)!');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setPhoneError('');

    // 1. Validate Email
    const isEmailValid = validateEmailFormat(email);
    if (!isEmailValid) {
      showToast('Vui lòng nhập đúng định dạng email (bắt buộc phải có ký tự @)!', 'error');
      return;
    }

    // 2. Validate Password
    if (!password) {
      setPasswordError('Vui lòng nhập mật khẩu.');
      showToast('Vui lòng nhập mật khẩu.', 'error');
      return;
    }

    // Mode-specific validation
    if (authModalMode === 'register') {
      if (password.length < 6) {
        setPasswordError('Mật khẩu phải có ít nhất 6 ký tự.');
        showToast('Mật khẩu bảo mật phải có ít nhất 6 ký tự!', 'error');
        return;
      }

      if (!confirmPassword) {
        setConfirmPasswordError('Vui lòng nhập lại mật khẩu để xác nhận.');
        showToast('Vui lòng nhập lại mật khẩu để xác nhận!', 'error');
        return;
      }

      if (password !== confirmPassword) {
        setConfirmPasswordError('Mật khẩu nhập lại không trùng khớp.');
        showToast('Mật khẩu xác nhận không trùng khớp với mật khẩu đã nhập!', 'error');
        return;
      }

      if (!phone.trim()) {
        setPhoneError('Vui lòng nhập số điện thoại liên hệ.');
        showToast('Vui lòng nhập số điện thoại liên hệ!', 'error');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (authModalMode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, phone, password);
      }
    } finally {
      setIsSubmitting(false);
    }
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
          type="button"
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
        <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
          {authModalMode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                Họ và tên *
              </label>
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

          {/* Email Input */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
              Địa chỉ Email *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 dark:text-neutral-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                  if (emailError) validateEmailFormat(e.target.value);
                }}
                onBlur={() => validateEmailFormat(email)}
                placeholder="example@gmail.com"
                className={`w-full pl-10 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border ${
                  emailError
                    ? 'border-rose-500 focus:border-rose-500'
                    : 'border-neutral-200 dark:border-neutral-700 focus:border-neutral-950 dark:focus:border-white'
                } text-neutral-900 dark:text-white rounded-xl text-xs focus:outline-none focus:bg-white dark:focus:bg-neutral-800 transition-all`}
              />
            </div>
            {emailError && (
              <div className="flex items-center gap-1 text-[11px] text-rose-500 font-medium mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{emailError}</span>
              </div>
            )}
          </div>

          {authModalMode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                Số điện thoại *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-neutral-400 dark:text-neutral-500 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => {
                    setPhone(e.target.value);
                    if (phoneError) setPhoneError('');
                  }}
                  placeholder="0912 345 678"
                  className={`w-full pl-10 pr-4 py-2.5 bg-neutral-50 dark:bg-neutral-900 border ${
                    phoneError
                      ? 'border-rose-500 focus:border-rose-500'
                      : 'border-neutral-200 dark:border-neutral-700 focus:border-neutral-950 dark:focus:border-white'
                  } text-neutral-900 dark:text-white rounded-xl text-xs focus:outline-none focus:bg-white dark:focus:bg-neutral-800 transition-all`}
                />
              </div>
              {phoneError && (
                <div className="flex items-center gap-1 text-[11px] text-rose-500 font-medium mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{phoneError}</span>
                </div>
              )}
            </div>
          )}

          {/* Password Input with Eye Toggle */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                Mật khẩu *
              </label>
              {authModalMode === 'login' && (
                <button
                  type="button"
                  onClick={() => alert('Thông tin đặt lại mật khẩu đã được gửi đến email của bạn.')}
                  className="text-[11px] text-neutral-500 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white underline cursor-pointer"
                >
                  Quên mật khẩu?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 dark:text-neutral-500 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError('');
                }}
                placeholder="••••••••"
                className={`w-full pl-10 pr-10 py-2.5 bg-neutral-50 dark:bg-neutral-900 border ${
                  passwordError
                    ? 'border-rose-500 focus:border-rose-500'
                    : 'border-neutral-200 dark:border-neutral-700 focus:border-neutral-950 dark:focus:border-white'
                } text-neutral-900 dark:text-white rounded-xl text-xs focus:outline-none focus:bg-white dark:focus:bg-neutral-800 transition-all`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors p-0.5 rounded focus:outline-none cursor-pointer"
                title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {passwordError && (
              <div className="flex items-center gap-1 text-[11px] text-rose-500 font-medium mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}
          </div>

          {/* Confirm Password Input with Eye Toggle (Register mode) */}
          {authModalMode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                Nhập lại mật khẩu *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 dark:text-neutral-500 absolute left-3.5 top-3" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={e => {
                    setConfirmPassword(e.target.value);
                    if (confirmPasswordError) setConfirmPasswordError('');
                  }}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-2.5 bg-neutral-50 dark:bg-neutral-900 border ${
                    confirmPasswordError
                      ? 'border-rose-500 focus:border-rose-500'
                      : 'border-neutral-200 dark:border-neutral-700 focus:border-neutral-950 dark:focus:border-white'
                  } text-neutral-900 dark:text-white rounded-xl text-xs focus:outline-none focus:bg-white dark:focus:bg-neutral-800 transition-all`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(p => !p)}
                  className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors p-0.5 rounded focus:outline-none cursor-pointer"
                  title={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPasswordError && (
                <div className="flex items-center gap-1 text-[11px] text-rose-500 font-medium mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{confirmPasswordError}</span>
                </div>
              )}
            </div>
          )}

          {authModalMode === 'login' && (
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="auth-remember"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="rounded border-neutral-300 dark:border-neutral-600 text-neutral-950 dark:text-white focus:ring-0 cursor-pointer"
              />
              <label htmlFor="auth-remember" className="text-xs text-neutral-600 dark:text-neutral-400 cursor-pointer">
                Ghi nhớ đăng nhập
              </label>
            </div>
          )}

          <button
            type="submit"
            id="auth-submit-btn"
            disabled={isSubmitting}
            className="w-full py-3 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 rounded-xl font-bold text-xs hover:bg-neutral-800 dark:hover:bg-neutral-100 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg mt-2 cursor-pointer"
          >
            <span>
              {isSubmitting
                ? 'Đang xử lý...'
                : authModalMode === 'login'
                  ? 'Đăng Nhập'
                  : 'Tạo Tài Khoản'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-5 text-center text-xs text-neutral-600 dark:text-neutral-400">
          {authModalMode === 'login' ? (
            <span>
              Chưa có tài khoản?{' '}
              <button
                id="toggle-to-register-btn"
                type="button"
                onClick={() => setAuthModalMode('register')}
                className="font-bold text-neutral-950 dark:text-white underline hover:text-neutral-700 dark:hover:text-neutral-300 ml-1 cursor-pointer"
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
                className="font-bold text-neutral-950 dark:text-white underline hover:text-neutral-700 dark:hover:text-neutral-300 ml-1 cursor-pointer"
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
