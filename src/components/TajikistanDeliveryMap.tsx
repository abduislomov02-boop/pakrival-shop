import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { MapPin, Truck, Check, Navigation, ShieldCheck, Clock } from 'lucide-react';

export interface TajikistanCity {
  id: string;
  name: string;
  nameTajik: string;
  region: string;
  x: number; // SVG coordinate percent (0-100)
  y: number; // SVG coordinate percent (0-100)
  deliveryTime: string;
  deliveryCost: number; // in somoni
  freeThreshold: number; // in somoni
  pickupPoints: string[];
}

export const TAJIKISTAN_CITIES: TajikistanCity[] = [
  {
    id: 'dushanbe',
    name: 'Душанбе',
    nameTajik: 'Душанбе',
    region: 'г. Душанбе (Пойтахт)',
    x: 32,
    y: 52,
    deliveryTime: 'В день заказа (2-4 часа)',
    deliveryCost: 20,
    freeThreshold: 250,
    pickupPoints: [
      'Флагманский магазин: пр. Рудаки, 88 (ориентир ЦУМ)',
      'Пункт выдачи: ТЦ «Садбарг», 2 этаж',
      'Пункт выдачи: ТРЦ «Душанбе Молл» (Ашан)',
    ],
  },
  {
    id: 'khujand',
    name: 'Худжанд',
    nameTajik: 'Хуҷанд',
    region: 'Согдийская область',
    x: 35,
    y: 18,
    deliveryTime: '1 день (экспресс-курьер)',
    deliveryCost: 30,
    freeThreshold: 350,
    pickupPoints: [
      'Пункт выдачи: ул. Исмоили Сомони, 54 (рынок Панджшанбе)',
      'Курьерская доставка до двери по городу',
    ],
  },
  {
    id: 'bokhtar',
    name: 'Бохтар',
    nameTajik: 'Бохтар',
    region: 'Хатлонская область',
    x: 29,
    y: 72,
    deliveryTime: '1 день',
    deliveryCost: 25,
    freeThreshold: 300,
    pickupPoints: [
      'Пункт выдачи: ул. Айни, 15 (возле автовокзала)',
      'Доставка курьером до дома',
    ],
  },
  {
    id: 'kulob',
    name: 'Куляб',
    nameTajik: 'Кӯлоб',
    region: 'Хатлонская область',
    x: 44,
    y: 74,
    deliveryTime: '1-2 дня',
    deliveryCost: 25,
    freeThreshold: 300,
    pickupPoints: [
      'Пункт выдачи: ул. Борбад, 12',
      'Адресная курьерская доставка',
    ],
  },
  {
    id: 'istaravshan',
    name: 'Истаравшан',
    nameTajik: 'Истаравшан',
    region: 'Согдийская область',
    x: 31,
    y: 28,
    deliveryTime: '1 день',
    deliveryCost: 30,
    freeThreshold: 350,
    pickupPoints: ['Пункт выдачи: пр. Ленина, 40'],
  },
  {
    id: 'panjakent',
    name: 'Пенджикент',
    nameTajik: 'Панҷакент',
    region: 'Согдийская область',
    x: 17,
    y: 38,
    deliveryTime: '1-2 дня',
    deliveryCost: 35,
    freeThreshold: 400,
    pickupPoints: ['Пункт выдачи: ул. Рудаки, 78'],
  },
  {
    id: 'tursunzoda',
    name: 'Турсунзаде',
    nameTajik: 'Турсунзода',
    region: 'Районы респ. подчинения (РРП)',
    x: 22,
    y: 53,
    deliveryTime: '1 день',
    deliveryCost: 20,
    freeThreshold: 250,
    pickupPoints: ['Пункт выдачи: ул. Мира, 5'],
  },
  {
    id: 'vahdat',
    name: 'Вахдат',
    nameTajik: 'Ваҳдат',
    region: 'Районы респ. подчинения (РРП)',
    x: 38,
    y: 53,
    deliveryTime: 'В день заказа или 1 день',
    deliveryCost: 20,
    freeThreshold: 250,
    pickupPoints: ['Пункт выдачи: ул. Сомони, 19'],
  },
  {
    id: 'hisor',
    name: 'Гиссар',
    nameTajik: 'Ҳисор',
    region: 'Районы респ. подчинения (РРП)',
    x: 27,
    y: 52,
    deliveryTime: 'В день заказа',
    deliveryCost: 20,
    freeThreshold: 250,
    pickupPoints: ['Пункт выдачи: ул. Джами, 8'],
  },
  {
    id: 'isfara',
    name: 'Исфара',
    nameTajik: 'Исфара',
    region: 'Согдийская область',
    x: 48,
    y: 22,
    deliveryTime: '1-2 дня',
    deliveryCost: 35,
    freeThreshold: 350,
    pickupPoints: ['Пункт выдачи: ул. Маркази, 14'],
  },
  {
    id: 'khorog',
    name: 'Хорог',
    nameTajik: 'Хоруғ',
    region: 'ГБАО (Бадахшан)',
    x: 72,
    y: 77,
    deliveryTime: '2-4 дня (авиа или экспресс)',
    deliveryCost: 45,
    freeThreshold: 500,
    pickupPoints: ['Пункт выдачи: ул. Ленина, 32'],
  },
];

interface TajikistanDeliveryMapProps {
  onSelectCity?: (city: TajikistanCity) => void;
  selectedCityId?: string;
  isCompact?: boolean;
}

export const TajikistanDeliveryMap: React.FC<TajikistanDeliveryMapProps> = ({
  onSelectCity,
  selectedCityId,
  isCompact = false,
}) => {
  const { setIsCheckoutOpen } = useStore();
  const [activeCity, setActiveCity] = useState<TajikistanCity>(() => {
    return (
      TAJIKISTAN_CITIES.find((c) => c.id === selectedCityId) ||
      TAJIKISTAN_CITIES[0]
    );
  });

  const handleCityClick = (city: TajikistanCity) => {
    setActiveCity(city);
    if (onSelectCity) {
      onSelectCity(city);
    }
  };

  const handleQuickOrderToCity = () => {
    if (onSelectCity) {
      onSelectCity(activeCity);
    }
    setIsCheckoutOpen(true);
  };

  return (
    <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200/90 dark:border-stone-800 p-5 sm:p-7 shadow-sm">
      
      {/* Title & Description */}
      {!isCompact && (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 pb-4 border-b border-stone-100 dark:border-stone-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-semibold mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Доставка по всей Республике Таджикистан</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-stone-900 dark:text-stone-100">
              Интерактивная карта доставки в Таджикистане
            </h2>
            <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 max-w-xl">
              Нажмите на нужный город на карте, чтобы узнать сроки и стоимость доставки покрывал для ковров до вашего дома или пункта выдачи.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-stone-100 dark:bg-stone-800 rounded-lg text-xs font-mono text-stone-700 dark:text-stone-300 shrink-0">
            <span className="font-semibold text-emerald-600">Бесплатно</span>
            <span>при заказе от 250 сомони</span>
          </div>
        </div>
      )}

      {/* Main Grid: Interactive Map + City Detail Card */}
      <div className={`grid grid-cols-1 ${isCompact ? 'gap-4' : 'lg:grid-cols-12 gap-8'}`}>
        
        {/* Map Visual Container */}
        <div className={`${isCompact ? 'w-full' : 'lg:col-span-7'} flex flex-col`}>
          <div className="relative w-full aspect-[16/10] bg-gradient-to-br from-stone-50 via-amber-50/20 to-stone-100 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950 rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-inner p-3 sm:p-5 flex items-center justify-center">
            
            {/* SVG Stylized Relief Background of Tajikistan */}
            <svg
              viewBox="0 0 1000 620"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-85"
            >
              <defs>
                <linearGradient id="tj-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#e7dfd5" stopOpacity="0.7" />
                  <stop offset="50%" stopColor="#dfd5c7" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#d2c6b4" stopOpacity="0.6" />
                </linearGradient>
                <linearGradient id="tj-grad-dark" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#292524" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#1c1917" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#292524" stopOpacity="0.8" />
                </linearGradient>
              </defs>

              {/* Tajikistan Stylized Geographical Borders Path */}
              <path
                d="M 120 240 
                   C 140 190, 200 130, 290 90 
                   C 340 70, 390 110, 440 130 
                   C 500 110, 560 140, 520 180 
                   C 480 200, 410 220, 380 250 
                   C 360 270, 320 280, 270 310 
                   C 240 330, 230 360, 200 390 
                   C 190 440, 240 480, 280 520 
                   C 320 540, 400 550, 460 520 
                   C 520 500, 590 460, 680 440 
                   C 760 420, 850 400, 930 320 
                   C 960 270, 940 190, 880 150 
                   C 820 130, 750 170, 700 210 
                   C 650 240, 570 270, 510 320 
                   C 460 360, 390 380, 340 400 
                   C 300 410, 240 360, 220 320 
                   C 180 300, 140 280, 120 240 Z"
                className="fill-[#e5ded3] dark:fill-[#262320] stroke-stone-300 dark:stroke-stone-700 stroke-2"
              />

              {/* Mountains & River lines subtle decoration */}
              <path
                d="M 280 140 Q 340 190 440 230 T 620 340 T 780 430"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                className="text-stone-400/40 dark:text-stone-600/40"
              />
              <path
                d="M 220 380 Q 320 370 420 400 T 540 460"
                fill="none"
                stroke="#0284c7"
                strokeWidth="2"
                strokeOpacity="0.4"
              />

              {/* Regional labels in SVG */}
              <text x="310" y="140" className="text-[22px] font-serif fill-stone-400 dark:fill-stone-600 font-bold select-none">Суғд</text>
              <text x="320" y="530" className="text-[22px] font-serif fill-stone-400 dark:fill-stone-600 font-bold select-none">Хатлон</text>
              <text x="730" y="320" className="text-[24px] font-serif fill-stone-400 dark:fill-stone-600 font-bold select-none">Бадахшон (ГБАО)</text>
              <text x="300" y="340" className="text-[18px] font-serif fill-stone-400 dark:fill-stone-600 select-none">РРП</text>
            </svg>

            {/* Clickable City Markers */}
            <div className="absolute inset-0 w-full h-full">
              {TAJIKISTAN_CITIES.map((city) => {
                const isSelected = activeCity.id === city.id;
                const isCapital = city.id === 'dushanbe';

                return (
                  <button
                    key={city.id}
                    type="button"
                    onClick={() => handleCityClick(city)}
                    style={{ left: `${city.x}%`, top: `${city.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer focus:outline-none z-10 transition-transform duration-150"
                  >
                    {/* Ripple on active */}
                    {isSelected && (
                      <span className="absolute -inset-2.5 rounded-full bg-emerald-500/25 animate-ping" />
                    )}

                    {/* Marker Pin */}
                    <div
                      className={`relative flex items-center justify-center rounded-full transition-all duration-200 ${
                        isSelected
                          ? 'w-7 h-7 bg-emerald-700 text-white shadow-lg ring-4 ring-emerald-200 dark:ring-emerald-900/60 scale-110'
                          : isCapital
                          ? 'w-6 h-6 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-950 shadow-md ring-2 ring-white hover:scale-115'
                          : 'w-4.5 h-4.5 bg-stone-700 dark:bg-stone-300 text-white dark:text-stone-900 hover:scale-120 shadow-xs'
                      }`}
                    >
                      <MapPin className={`${isSelected ? 'w-4 h-4' : 'w-3 h-3'}`} />
                    </div>

                    {/* Label */}
                    <span
                      className={`absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap px-1.5 py-0.5 rounded text-[11px] font-medium tracking-tight shadow-xs transition-colors pointer-events-none ${
                        isSelected
                          ? 'bg-emerald-800 text-white font-semibold'
                          : isCapital
                          ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-bold text-xs'
                          : 'bg-white/95 dark:bg-stone-800/95 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700'
                      }`}
                    >
                      {city.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Map Legend */}
            <div className="absolute bottom-2.5 left-3 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md px-2.5 py-1.5 rounded-md border border-stone-200 dark:border-stone-700 text-[10px] text-stone-500 space-y-0.5 pointer-events-none">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-stone-900 dark:bg-stone-100 inline-block" />
                <span>Душанбе — Столица</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
                <span>Выбранный город доставки</span>
              </div>
            </div>

          </div>

          {/* Quick city tags below map */}
          <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-stone-400 shrink-0 text-[11px]">Города:</span>
            {TAJIKISTAN_CITIES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => handleCityClick(c)}
                className={`px-2.5 py-1 rounded-md text-[11px] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeCity.id === c.id
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-semibold'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Selected City Details Card */}
        <div className={`${isCompact ? 'w-full' : 'lg:col-span-5'} flex flex-col justify-between bg-stone-50 dark:bg-stone-800/50 rounded-xl p-5 border border-stone-200/80 dark:border-stone-800 text-xs`}>
          
          <div>
            {/* City Title */}
            <div className="flex items-start justify-between gap-3 mb-3 pb-3 border-b border-stone-200/80 dark:border-stone-700/80">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500">
                  {activeCity.region}
                </span>
                <h3 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <span>{activeCity.name}</span>
                  <span className="text-xs font-normal text-stone-400">({activeCity.nameTajik})</span>
                </h3>
              </div>

              <span className="px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-mono text-[11px] font-semibold">
                Доставка активна
              </span>
            </div>

            {/* Delivery Terms */}
            <div className="space-y-3 mb-5">
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-stone-400 block text-[11px]">Срок доставки:</span>
                  <span className="font-semibold text-stone-900 dark:text-stone-100 text-sm">
                    {activeCity.deliveryTime}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-stone-400 block text-[11px]">Стоимость курьера:</span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold font-mono text-stone-900 dark:text-stone-100 text-sm">
                      {activeCity.deliveryCost} сомони
                    </span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-medium text-[11px]">
                      (Бесплатно от {activeCity.freeThreshold} сомони)
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-stone-400 block text-[11px]">Оплата при получении:</span>
                  <span className="text-stone-700 dark:text-stone-300">
                    Наличными курьеру, через Корти Милли, Алиф Моби или Dushanbe City при проверке покрывала.
                  </span>
                </div>
              </div>
            </div>

            {/* Pickup Locations in City */}
            <div>
              <h4 className="font-semibold text-stone-900 dark:text-stone-100 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                <Navigation className="w-3 h-3 text-stone-500" />
                <span>Пункты выдачи заказов ({activeCity.name}):</span>
              </h4>
              <ul className="space-y-1.5">
                {activeCity.pickupPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-stone-600 dark:text-stone-300 text-[11px] bg-white dark:bg-stone-800 p-2 rounded border border-stone-200/60 dark:border-stone-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-6 pt-4 border-t border-stone-200/80 dark:border-stone-700">
            <button
              type="button"
              onClick={handleQuickOrderToCity}
              className="w-full py-3 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-semibold uppercase tracking-wider text-xs rounded-lg hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Выбрать {activeCity.name} и оформить заказ</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
