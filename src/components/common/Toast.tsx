import React from 'react';
import { useShop } from '../../context/ShopContext';
import { CheckCircle2, AlertCircle, Info, X, LogIn } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useShop();

  // Separate: success toasts that contain login/register words → center screen
  const centerToasts = toasts.filter(
    t => t.type === 'success' && (
      t.message.includes('Đăng nhập') ||
      t.message.includes('đăng nhập') ||
      t.message.includes('đăng ký') ||
      t.message.includes('Đăng ký') ||
      t.message.includes('Chúc mừng')
    )
  );
  const cornerToasts = toasts.filter(t => !centerToasts.includes(t));

  return (
    <>
      {/* ── CENTERED big toast for login/register success ── */}
      <AnimatePresence>
        {centerToasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, scale: 0.8, y: -30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: -20 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            className="fixed inset-0 z-[99] flex items-center justify-center pointer-events-none"
          >
            <div className="pointer-events-auto bg-white dark:bg-neutral-900 rounded-2xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.35)] dark:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.7)] border border-neutral-100 dark:border-neutral-800 px-8 py-7 flex flex-col items-center gap-3 max-w-sm mx-4 text-center">
              {/* Animated checkmark circle */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.08 }}
                className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border-2 border-emerald-300 dark:border-emerald-700 flex items-center justify-center"
              >
                <CheckCircle2 className="w-9 h-9 text-emerald-500" strokeWidth={2.2} />
              </motion.div>

              <div>
                <div className="font-extrabold text-neutral-900 dark:text-white text-lg leading-tight mb-1">
                  {toast.message.includes('đăng ký') || toast.message.includes('Đăng ký') || toast.message.includes('Chúc mừng')
                    ? '🎉 Tạo tài khoản thành công!'
                    : '✅ Đăng nhập thành công!'}
                </div>
                <div className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {toast.message}
                </div>
              </div>

              <button
                id={`toast-center-close-${toast.id}`}
                onClick={() => removeToast(toast.id)}
                className="mt-1 px-6 py-2 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 rounded-xl font-bold text-sm hover:opacity-80 transition-all"
              >
                Tiếp tục mua sắm →
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* ── CORNER toasts for everything else ── */}
      <div id="toast-container" className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4">
        <AnimatePresence>
          {cornerToasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 60, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.95 }}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-xl border backdrop-blur-md ${
                toast.type === 'success'
                  ? 'bg-neutral-900/95 text-white border-neutral-800'
                  : toast.type === 'error'
                  ? 'bg-rose-950/95 text-rose-100 border-rose-800'
                  : 'bg-neutral-900/95 text-neutral-100 border-neutral-800'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400" />}
                {toast.type === 'info' && <Info className="w-5 h-5 text-sky-400" />}
              </div>
              <div className="flex-1 text-sm font-medium leading-relaxed">
                {toast.message}
              </div>
              <button
                id={`toast-close-${toast.id}`}
                onClick={() => removeToast(toast.id)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
};

export const Toast = ToastContainer;
