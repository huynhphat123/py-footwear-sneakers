import React from 'react';
import { useShop } from '../../context/ShopContext';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  id?: string;
  variant?: 'icon' | 'expanded';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  id = 'theme-toggle-btn',
  variant = 'icon',
  className = '',
}) => {
  const { theme, toggleTheme } = useShop();
  const isDark = theme === 'dark';

  const ariaLabel = isDark
    ? 'Chuyển sang chế độ sáng'
    : 'Chuyển sang chế độ tối';

  if (variant === 'expanded') {
    return (
      <button
        id={id}
        type="button"
        onClick={toggleTheme}
        aria-label={ariaLabel}
        className={`w-full flex items-center justify-between py-2.5 px-3 rounded-xl font-semibold text-xs transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600 ${
          isDark
            ? 'bg-neutral-800 text-amber-400 hover:bg-neutral-700'
            : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
        } ${className}`}
      >
        <span className="flex items-center gap-2">
          {isDark ? (
            <Moon className="w-4 h-4 text-amber-400 fill-amber-400/20" />
          ) : (
            <Sun className="w-4 h-4 text-amber-600 fill-amber-500/20" />
          )}
          <span>{isDark ? 'Giao diện Tối (Dark)' : 'Giao diện Sáng (Light)'}</span>
        </span>
        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-white/20 dark:bg-black/30">
          {isDark ? 'Đổi sang Sáng' : 'Đổi sang Tối'}
        </span>
      </button>
    );
  }

  return (
    <button
      id={id}
      type="button"
      onClick={toggleTheme}
      aria-label={ariaLabel}
      title={ariaLabel}
      className={`relative p-2 sm:p-2.5 rounded-full text-neutral-700 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/80 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600 active:scale-95 ${className}`}
    >
      <span className="sr-only">{ariaLabel}</span>
      <div className="relative w-5 h-5 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-5 h-5 text-amber-400 hover:rotate-45 transition-transform duration-300 fill-amber-400/20 animate-in fade-in zoom-in-75 duration-200" />
        ) : (
          <Moon className="w-5 h-5 text-neutral-700 dark:text-neutral-300 hover:-rotate-12 transition-transform duration-300 animate-in fade-in zoom-in-75 duration-200" />
        )}
      </div>
    </button>
  );
};
