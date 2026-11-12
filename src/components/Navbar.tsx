import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, Heart, Package, SlidersHorizontal, Sun, Moon } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    cartTotalCount,
    setIsCartOpen,
    wishlist,
    setIsWishlistOpen,
    orders,
    setIsOrdersOpen,
    setIsAdminOpen,
    theme,
    toggleTheme,
  } = useStore();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 dark:bg-stone-950/90 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        
        {/* Zone 1: Brand wordmark in display face, single line, no subtitle pill */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-2xl font-serif font-bold tracking-wider text-stone-900 dark:text-stone-100 uppercase whitespace-nowrap shrink-0 hover:opacity-85 transition-opacity"
        >
          pakrival shop
        </a>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600 dark:text-stone-400">
          <button
            onClick={() => scrollToSection('catalog')}
            className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Покрывала для ковров
          </button>
          <button
            onClick={() => scrollToSection('tajikistan-map')}
            className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer text-emerald-700 dark:text-emerald-400 font-medium"
          >
            Карта Таджикистана
          </button>
          <button
            onClick={() => scrollToSection('guarantee')}
            className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Доставка и оплата
          </button>
          <button
            onClick={() => setIsAdminOpen(true)}
            className="inline-flex items-center gap-1.5 text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-stone-500" />
            <span>Управление товарами</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action + compact icon utilities */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 rounded-md transition-colors cursor-pointer"
            title={theme === 'dark' ? 'Включить светлую тему' : 'Включить темную тему'}
            aria-label="Переключить тему оформления"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Wishlist Button */}
          <button
            onClick={() => setIsWishlistOpen(true)}
            className="relative p-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 rounded-md transition-colors cursor-pointer"
            title="Избранное"
            aria-label="Открыть список избранного"
          >
            <Heart className="w-4 h-4" />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-stone-900 dark:bg-stone-100 rounded-full" />
            )}
          </button>

          {/* Orders History Button */}
          <button
            onClick={() => setIsOrdersOpen(true)}
            className="relative p-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 rounded-md transition-colors cursor-pointer"
            title="Мои заказы"
            aria-label="Открыть историю заказов"
          >
            <Package className="w-4 h-4" />
            {orders.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-amber-600 rounded-full" />
            )}
          </button>

          {/* Mobile Admin button */}
          <button
            onClick={() => setIsAdminOpen(true)}
            className="md:hidden p-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 rounded-md transition-colors cursor-pointer"
            title="Управление товарами"
            aria-label="Управление товарами"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          {/* Primary Action: Shopping Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="inline-flex items-center gap-2.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-stone-900 dark:bg-stone-100 dark:text-stone-900 rounded-md hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors whitespace-nowrap shrink-0 shadow-sm cursor-pointer"
            aria-label={`Корзина (${cartTotalCount} товаров)`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Корзина</span>
            <span className="font-mono tabular-nums px-1.5 py-0.2 bg-stone-700 dark:bg-stone-300 text-stone-100 dark:text-stone-900 rounded text-[11px]">
              {cartTotalCount}
            </span>
          </button>
        </div>

      </div>
    </header>
  );
};
