import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight, Check } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setIsAdminOpen } = useStore();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-stone-900 text-stone-300 dark:bg-stone-950 dark:text-stone-400 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-stone-800">
          
          {/* Brand & Newsletter (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <span className="text-2xl font-serif font-bold text-white tracking-wider uppercase">
              pakrival shop
            </span>
            <p className="text-xs text-stone-400 max-w-sm leading-relaxed">
              Интернет-магазин премиальных покрывал, пледов из натурального кашемира и льна, а также текстиля для спальни и дома.
            </p>

            {/* Newsletter form */}
            <div className="pt-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 block mb-2">
                Закрытые релизы и специальные предложения:
              </span>
              {subscribed ? (
                <div className="flex items-center gap-2 text-xs text-emerald-400 py-2">
                  <Check className="w-4 h-4" />
                  <span>Спасибо за подписку! Мы прислали приветственный промокод на ваш email.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex max-w-sm">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ваш адрес email..."
                    className="flex-1 px-3.5 py-2 text-xs bg-stone-800 border border-stone-700 rounded-l-md text-white placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-400"
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-stone-100 text-stone-900 hover:bg-white text-xs font-semibold uppercase tracking-wider rounded-r-md transition-colors flex items-center justify-center cursor-pointer"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Links: Categories (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-white">Категории каталога</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li><a href="#catalog" className="hover:text-white transition-colors">Стеганые шелковые покрывала</a></li>
              <li><a href="#catalog" className="hover:text-white transition-colors">Кашемировые вафельные пледы</a></li>
              <li><a href="#catalog" className="hover:text-white transition-colors">Льняной текстиль с бахромой</a></li>
              <li><a href="#catalog" className="hover:text-white transition-colors">Мериносовые вязаные покрывала</a></li>
              <li><a href="#catalog" className="hover:text-white transition-colors">Интерьерный свет и декор</a></li>
            </ul>
          </div>

          {/* Links: Customer Care (2 cols) */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-white">Покупателям</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li><a href="#guarantee" className="hover:text-white transition-colors">Доставка СДЭК</a></li>
              <li><a href="#guarantee" className="hover:text-white transition-colors">Возврат и обмен 14 дней</a></li>
              <li><a href="#story" className="hover:text-white transition-colors">Шоурумы в Москве и СПб</a></li>
              <li><a href="#guarantee" className="hover:text-white transition-colors">Сертификаты натуральности</a></li>
            </ul>
          </div>

          {/* Admin link & Tech (2 cols) */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-white">Управление</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => setIsAdminOpen(true)}
                  className="hover:text-white transition-colors underline cursor-pointer"
                >
                  Панель товаров
                </button>
              </li>
              <li>
                <span className="text-[11px] text-stone-500">Промокод: PAK10, SALE15</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <p>© {new Date().getFullYear()} pakrival shop. Все права защищены.</p>
          <p className="font-mono">Душанбе · Худжанд · Бохтар · Куляб · Доставка по Таджикистану</p>
        </div>

      </div>
    </footer>
  );
};
