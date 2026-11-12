import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, Printer, ArrowRight, Package, Truck, Copy, Check } from 'lucide-react';

export const OrderConfirmationModal: React.FC = () => {
  const {
    currentOrderCompleted,
    setCurrentOrderCompleted,
    setIsOrdersOpen,
    formatPrice,
  } = useStore();

  const [copied, setCopied] = React.useState(false);

  if (!currentOrderCompleted) return null;

  const handleCopyTrack = () => {
    navigator.clipboard.writeText(currentOrderCompleted.trackingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleGoToOrders = () => {
    setCurrentOrderCompleted(null);
    setIsOrdersOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-stone-950/75 backdrop-blur-md animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-lg shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden z-10 my-auto flex flex-col max-h-[95vh]">
        
        {/* Top Header Card */}
        <div className="p-8 text-center bg-stone-50 dark:bg-stone-800/50 border-b border-stone-200/80 dark:border-stone-800">
          <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50 dark:ring-emerald-950/30">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="text-xs font-mono uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-semibold">
            Заказ успешно оформлен и подтвержден
          </span>

          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 mt-1 mb-2">
            Спасибо за покупку в pakrival shop
          </h2>

          <p className="text-xs text-stone-600 dark:text-stone-400 max-w-md mx-auto">
            Ваш заказ покрывала для ковра принят в обработку. Курьер свяжется с вами по указанному номеру для доставки.
          </p>

          <div className="mt-5 inline-flex items-center gap-3 px-4 py-2 bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 text-xs">
            <span className="text-stone-500">Номер заказа:</span>
            <span className="font-mono font-bold text-stone-950 dark:text-white tracking-wider">
              {currentOrderCompleted.id}
            </span>
            <span className="text-stone-300 dark:text-stone-600">|</span>
            <span className="text-stone-500">Трек-номер:</span>
            <span className="font-mono text-stone-900 dark:text-stone-100">{currentOrderCompleted.trackingNumber}</span>
            <button
              onClick={handleCopyTrack}
              className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 p-0.5 ml-1"
              title="Скопировать трек"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Scrollable Receipt Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs">
          
          {/* Recipient & Shipping summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-stone-50 dark:bg-stone-800/40 rounded-lg border border-stone-100 dark:border-stone-800">
            <div>
              <span className="text-stone-400 block text-[11px] uppercase tracking-wider mb-1">Получатель</span>
              <p className="font-medium text-stone-900 dark:text-stone-100">{currentOrderCompleted.customer.fullName}</p>
              <p className="text-stone-500 font-mono mt-0.5">{currentOrderCompleted.customer.phone}</p>
              <p className="text-stone-500 mt-0.5">{currentOrderCompleted.customer.email}</p>
            </div>

            <div>
              <span className="text-stone-400 block text-[11px] uppercase tracking-wider mb-1">Адрес доставки</span>
              <p className="font-medium text-stone-900 dark:text-stone-100">
                {currentOrderCompleted.shipping.city}, {currentOrderCompleted.shipping.address}
              </p>
              {currentOrderCompleted.shipping.apartment && (
                <p className="text-stone-500 mt-0.5">Кв./офис: {currentOrderCompleted.shipping.apartment}</p>
              )}
              {currentOrderCompleted.shipping.comment && (
                <p className="text-stone-500 italic mt-1">«{currentOrderCompleted.shipping.comment}»</p>
              )}
            </div>
          </div>

          {/* Itemized Table */}
          <div>
            <h4 className="font-semibold text-stone-900 dark:text-stone-100 uppercase tracking-wider text-[11px] mb-3">
              Состав посылки ({currentOrderCompleted.items.reduce((a, b) => a + b.quantity, 0)} шт.)
            </h4>

            <div className="divide-y divide-stone-100 dark:divide-stone-800 border-t border-b border-stone-200 dark:border-stone-800">
              {currentOrderCompleted.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt=""
                      className="w-12 h-12 rounded object-cover border border-stone-200 dark:border-stone-700"
                    />
                    <div>
                      <p className="font-medium text-stone-900 dark:text-stone-100 line-clamp-1">{item.name}</p>
                      {item.option && <p className="text-[11px] text-stone-500">Опция: {item.option}</p>}
                      <p className="text-[11px] text-stone-400 font-mono">
                        {item.quantity} шт. × {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>

                  <span className="font-mono font-semibold tabular-nums text-stone-900 dark:text-stone-100 shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="space-y-1.5 pt-2 text-stone-600 dark:text-stone-400">
            <div className="flex justify-between">
              <span>Стоимость товаров:</span>
              <span className="font-mono tabular-nums">{formatPrice(currentOrderCompleted.subtotal)}</span>
            </div>
            {currentOrderCompleted.discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Скидка по промокоду ({currentOrderCompleted.promoCode}):</span>
                <span className="font-mono tabular-nums">-{formatPrice(currentOrderCompleted.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Доставка:</span>
              <span className="font-mono tabular-nums">
                {currentOrderCompleted.shippingCost === 0 ? 'Бесплатно' : formatPrice(currentOrderCompleted.shippingCost)}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-stone-950 dark:text-white pt-2 border-t border-stone-200 dark:border-stone-800">
              <span className="font-serif">Итого оплачено:</span>
              <span className="font-mono tabular-nums text-lg">{formatPrice(currentOrderCompleted.total)}</span>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="p-6 bg-stone-50 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-medium text-stone-700 dark:text-stone-300 hover:text-stone-900 border border-stone-200 dark:border-stone-700 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Печать чека</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleGoToOrders}
              className="px-4 py-2 text-xs font-medium text-stone-700 dark:text-stone-300 hover:text-stone-900 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Package className="w-3.5 h-3.5" />
              <span>Мои заказы</span>
            </button>
            
            <button
              type="button"
              onClick={() => setCurrentOrderCompleted(null)}
              className="px-5 py-2.5 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold uppercase tracking-wider rounded-md hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span>В каталог</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
