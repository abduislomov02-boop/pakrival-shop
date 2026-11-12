import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, Package, Truck, CheckCircle2, Clock, Calendar } from 'lucide-react';

export const OrderHistoryModal: React.FC = () => {
  const {
    orders,
    isOrdersOpen,
    setIsOrdersOpen,
    formatPrice,
    setCurrentOrderCompleted,
  } = useStore();

  if (!isOrdersOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-md animate-in fade-in duration-200 p-4 sm:p-6 flex items-center justify-center">
      
      <div className="relative w-full max-w-3xl bg-white dark:bg-stone-900 rounded-lg shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Package className="w-5 h-5 text-stone-900 dark:text-stone-100" />
            <h2 className="text-lg font-serif font-semibold text-stone-900 dark:text-stone-100">
              Мои заказы
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 rounded">
              {orders.length}
            </span>
          </div>

          <button
            onClick={() => setIsOrdersOpen(false)}
            className="p-1.5 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Orders List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {orders.length > 0 ? (
            orders.map((ord) => (
              <div
                key={ord.id}
                className="p-5 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30 text-xs space-y-4"
              >
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-200/60 dark:border-stone-700/60">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-stone-950 dark:text-white text-sm">
                      {ord.id}
                    </span>
                    <span className="flex items-center gap-1 text-stone-500 font-mono">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(ord.createdAt).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-medium bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Подтвержден</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsOrdersOpen(false);
                        setCurrentOrderCompleted(ord);
                      }}
                      className="text-[11px] text-stone-900 dark:text-stone-100 underline hover:opacity-80"
                    >
                      Посмотреть чек
                    </button>
                  </div>
                </div>

                {/* Items previews */}
                <div className="flex flex-wrap gap-3">
                  {ord.items.map((it, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 bg-white dark:bg-stone-800 p-2 rounded border border-stone-200/70 dark:border-stone-700">
                      <img src={it.image} alt="" className="w-8 h-8 object-cover rounded" />
                      <div>
                        <p className="font-medium text-stone-900 dark:text-stone-100 line-clamp-1">{it.name}</p>
                        <p className="text-[11px] text-stone-500 font-mono">
                          {it.quantity} шт. · {formatPrice(it.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping & Payment summary */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-[11px] text-stone-500 border-t border-stone-200/50 dark:border-stone-700/50">
                  <div className="flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5 text-stone-700 dark:text-stone-300" />
                    <span>
                      {ord.shipping.city}, {ord.shipping.address} (Трек: <strong className="font-mono text-stone-800 dark:text-stone-200">{ord.trackingNumber}</strong>)
                    </span>
                  </div>

                  <div className="font-mono tabular-nums text-xs font-semibold text-stone-950 dark:text-white">
                    Итого: {formatPrice(ord.total)}
                  </div>
                </div>

              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Package className="w-10 h-10 text-stone-300 dark:text-stone-700 mx-auto mb-2" />
              <p className="text-stone-600 dark:text-stone-400 font-medium text-xs">У вас пока нет оформленных заказов</p>
              <p className="text-[11px] text-stone-400 mt-1">Оформите свой первый заказ в каталоге AURA</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
