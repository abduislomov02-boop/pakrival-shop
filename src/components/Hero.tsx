import React from 'react';
import { ArrowDownRight, Truck, ShieldCheck, RefreshCw } from 'lucide-react';

export const Hero: React.FC = () => {
  const scrollToCatalog = () => {
    const el = document.getElementById('catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-12 sm:pt-12 sm:pb-16 border-b border-stone-200 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Split Hero: Left Typography & Narrative, Right Editorial Media */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: 7 Cols on desktop */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Quiet 1-line kicker (NO PILL BADGE) */}
            <div className="text-xs font-mono uppercase tracking-widest text-stone-500 dark:text-stone-400 mb-4">
              pakrival shop · Коллекция покрывал и текстиля 2026/2027
            </div>

            {/* Headline with text-wrap: balance to prevent orphan words */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-medium text-stone-900 dark:text-stone-100 tracking-tight leading-[1.12] mb-6 [text-wrap:balance]">
              Элитные покрывала, пледы и текстиль для безупречной спальни.
            </h1>

            {/* Subtitle text */}
            <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 leading-relaxed max-w-xl mb-8">
              В интернет-магазине pakrival shop вы найдете авторские стеганые шелковые покрывала, воздушные льняные накидки и теплые кашемировые пледы от европейских текстильных мануфактур.
            </p>

            {/* Action Area */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={scrollToCatalog}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 text-sm font-semibold tracking-wide rounded-md hover:bg-stone-800 dark:hover:bg-stone-200 transition-all shadow-sm cursor-pointer whitespace-nowrap"
              >
                <span>Выбрать покрывало</span>
                <ArrowDownRight className="w-4 h-4" />
              </button>
              
              <a
                href="#story"
                className="inline-flex items-center px-4 py-3.5 text-sm font-medium text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white transition-colors cursor-pointer"
              >
                О мастерских и тканях
              </a>
            </div>

          </div>

          {/* Right Column: 5 Cols on desktop - High fidelity generated showcase */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/3] lg:aspect-[1/1] overflow-hidden rounded-lg bg-stone-200 dark:bg-stone-800 border border-stone-200/80 dark:border-stone-800 shadow-sm">
              <img
                src="/src/assets/images/product_bedspread_quilted_silk_1794502368022.jpg"
                alt="Стеганое шелковое покрывало в спальне — pakrival shop"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transform hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 text-white text-xs">
                <p className="font-serif italic text-stone-200">Флагманская коллекция покрывал для ковров</p>
                <p className="text-stone-300/80 text-[11px] font-mono">pakrival shop · Доставка по Душанбе за 2-4 часа и по всему Таджикистану</p>
              </div>
            </div>
          </div>

        </div>

        {/* Full-width 3-column Trust Strip below hero */}
        <div className="mt-12 pt-8 border-t border-stone-200/80 dark:border-stone-800/80 grid grid-cols-1 sm:grid-cols-3 gap-6 text-stone-700 dark:text-stone-300">
          <div className="flex items-start gap-3.5">
            <Truck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-sm font-semibold text-stone-900 dark:text-stone-100">Доставка по Таджикистану</h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">Курьером по Душанбе, Худжанду, Бохтару, Кулябу и регионам (бесплатно от 250 сомони)</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-sm font-semibold text-stone-900 dark:text-stone-100">Алиф Моби & Корти Милли</h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">Оплата онлайн или наличными сомони курьеру после примерки покрывала</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <RefreshCw className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-sm font-semibold text-stone-900 dark:text-stone-100">14 дней на примерку</h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">Убедитесь, что покрывало идеально подходит под размеры вашего ковра и интерьер</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
