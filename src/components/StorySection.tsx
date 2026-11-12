import React from 'react';
import { Sparkles, MapPin, Clock, Phone } from 'lucide-react';

export const StorySection: React.FC = () => {
  return (
    <section id="story" className="border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/40 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Heading */}
        <div className="max-w-2xl mb-12 sm:mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-stone-500 dark:text-stone-400">
            О философии pakrival shop
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-medium text-stone-900 dark:text-stone-100 tracking-tight mt-2 mb-4">
            Текстиль, созданный дарить тепло, уют и гармонию дому.
          </h2>
          <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed">
            В pakrival shop мы уделяем особое внимание тактильности каждого квадратного сантиметра ткани. Наши стеганые шелковые покрывала, льняные фактурные накидки и мериносовые пледы создаются из чистого натурального сырья, которое согревает и преображает спальню.
          </p>
        </div>

        {/* 3 Editorial Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-16 border-b border-stone-200/80 dark:border-stone-800">
          <div>
            <span className="text-xs font-mono text-stone-400 block mb-2">01.</span>
            <h3 className="text-lg font-serif font-semibold text-stone-900 dark:text-stone-100 mb-2">
              Честные натуральные материалы
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Массив дуба и ясеня, шамотная керамика, титан Grade 5, монгольский кашемир и кожа растительного дубления без синтетических полимеров.
            </p>
          </div>

          <div>
            <span className="text-xs font-mono text-stone-400 block mb-2">02.</span>
            <h3 className="text-lg font-serif font-semibold text-stone-900 dark:text-stone-100 mb-2">
              Прямой контакт с мастерскими
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Мы работаем напрямую с независимыми студиями дизайна в Копенгагене, Милане, Париже и Москве, обеспечивая справедливые цены и гарантию подлинности.
            </p>
          </div>

          <div>
            <span className="text-xs font-mono text-stone-400 block mb-2">03.</span>
            <h3 className="text-lg font-serif font-semibold text-stone-900 dark:text-stone-100 mb-2">
              Бережная премиальная упаковка
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Каждый заказ комплектуется в крафтовые коробки с шелковой бумагой и персональной открыткой, готовый стать исключительным подарком.
            </p>
          </div>
        </div>

        {/* Physical Boutiques info strip */}
        <div id="guarantee" className="pt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 rounded-lg bg-stone-50 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-800">
            <div className="flex items-center gap-2 mb-2 text-stone-900 dark:text-stone-100 font-serif font-semibold text-base">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Главный магазин покрывал в Душанбе</span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300">
              г. Душанбе, проспект Рудаки, 88 (напротив ЦУМа)
            </p>
            <div className="mt-3 flex flex-wrap gap-4 text-[11px] text-stone-500 font-mono">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> 09:00 — 21:00 ежедневно
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" /> +992 (44) 600-11-22
              </span>
            </div>
          </div>

          <div className="p-6 rounded-lg bg-stone-50 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-800">
            <div className="flex items-center gap-2 mb-2 text-stone-900 dark:text-stone-100 font-serif font-semibold text-base">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Шоурум покрывал в Худжанде</span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300">
              г. Худжанд, ул. Исмоили Сомони, 54 (возле рынка Панджшанбе)
            </p>
            <div className="mt-3 flex flex-wrap gap-4 text-[11px] text-stone-500 font-mono">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> 09:00 — 20:00 ежедневно
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" /> +992 (92) 777-33-44
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
