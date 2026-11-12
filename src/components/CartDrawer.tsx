import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Check, Sparkles } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    shippingCost,
    promoCode,
    promoDiscount,
    applyPromoCode,
    removePromoCode,
    cartGrandTotal,
    setIsCheckoutOpen,
    formatPrice,
  } = useStore();

  const [inputCode, setInputCode] = useState('');
  const [promoFeedback, setPromoFeedback] = useState<{ success: boolean; message: string } | null>(null);

  if (!isCartOpen) return null;

  const freeShippingThreshold = 250;
  const freeShippingLeft = Math.max(0, freeShippingThreshold - cartSubtotal);
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const res = applyPromoCode(inputCode);
    setPromoFeedback(res);
    if (res.success) {
      setInputCode('');
    }
  };

  const handleQuickPromo = (code: string) => {
    const res = applyPromoCode(code);
    setPromoFeedback(res);
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-stone-900 border-l border-stone-200 dark:border-stone-800 shadow-2xl flex flex-col">
          
          {/* Cart Header */}
          <div className="px-6 py-5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-stone-900 dark:text-stone-100" />
              <h2 className="text-lg font-serif font-semibold text-stone-900 dark:text-stone-100">
                Корзина покупок
              </h2>
              <span className="text-xs font-mono px-2 py-0.5 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 rounded">
                {cart.reduce((a, b) => a + b.quantity, 0)} шт.
              </span>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs text-stone-400 hover:text-rose-600 transition-colors p-1"
                  title="Очистить корзину"
                >
                  Очистить
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 rounded-md transition-colors"
                title="Закрыть"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Free Shipping Progress Meter */}
          {cart.length > 0 && (
            <div className="bg-stone-50 dark:bg-stone-800/60 px-6 py-3 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center justify-between text-xs mb-1.5">
                {freeShippingLeft > 0 ? (
                  <span className="text-stone-600 dark:text-stone-300">
                    Добавьте товаров на <strong className="font-mono text-stone-900 dark:text-stone-100">{formatPrice(freeShippingLeft)}</strong> для бесплатной доставки
                  </span>
                ) : (
                  <span className="text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    Бесплатная доставка по Таджикистану активна!
                  </span>
                )}
                <span className="font-mono text-[11px] text-stone-500">{progressPercent}%</span>
              </div>
              <div className="w-full h-1.5 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-stone-900 dark:bg-stone-100 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-stone-100 dark:divide-stone-800/80">
            {cart.length > 0 ? (
              cart.map((item) => {
                const itemTotal = item.product.price * item.quantity;
                const maxStock = item.product.inStock;

                return (
                  <div key={`${item.productId}-${item.selectedOption || 'default'}`} className="py-4 flex gap-4">
                    {/* Item Image */}
                    <div className="w-20 h-20 rounded-md overflow-hidden bg-stone-100 dark:bg-stone-800 shrink-0 border border-stone-200/60 dark:border-stone-800">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-center"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-semibold text-stone-900 dark:text-stone-100 line-clamp-2 leading-snug">
                            {item.product.name}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.productId, item.selectedOption)}
                            className="text-stone-400 hover:text-rose-600 transition-colors p-1 -mr-1"
                            title="Удалить из корзины"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {item.selectedOption && (
                          <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                            Опция: <span className="text-stone-700 dark:text-stone-300">{item.selectedOption}</span>
                          </p>
                        )}
                        <p className="text-xs font-mono tabular-nums text-stone-500 dark:text-stone-400 mt-1">
                          {formatPrice(item.product.price)} / шт.
                        </p>
                      </div>

                      {/* Quantity Stepper & Line Total */}
                      <div className="flex items-center justify-between mt-3 pt-2">
                        <div className="flex items-center border border-stone-200 dark:border-stone-700 rounded bg-stone-50 dark:bg-stone-800">
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.productId, item.quantity - 1, item.selectedOption)}
                            className="p-1.5 text-stone-600 dark:text-stone-300 hover:text-stone-900 cursor-pointer"
                            title="Уменьшить количество"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-mono font-semibold tabular-nums text-stone-900 dark:text-stone-100">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.productId, item.quantity + 1, item.selectedOption)}
                            disabled={item.quantity >= maxStock}
                            className="p-1.5 text-stone-600 dark:text-stone-300 hover:text-stone-900 disabled:opacity-30 cursor-pointer"
                            title="Увеличить количество"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-sm font-bold font-mono tabular-nums text-stone-950 dark:text-white">
                          {formatPrice(itemTotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              /* Empty Cart State */
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="w-16 h-16 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center mb-4 text-stone-400">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <h3 className="text-base font-serif font-semibold text-stone-900 dark:text-stone-100 mb-1">
                  Ваша корзина пуста
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xs mb-6">
                  Выберите предметы из нашего каталога интерьера, техники или гардероба.
                </p>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold uppercase tracking-wider rounded-md hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  Перейти к покупкам
                </button>
              </div>
            )}
          </div>

          {/* Cart Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-6 bg-stone-50 dark:bg-stone-900/90 border-t border-stone-200 dark:border-stone-800 space-y-4">
              
              {/* Promo Code Form */}
              <div>
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      placeholder="Промокод (напр. AURA10)"
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 uppercase placeholder:normal-case placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-1.5 text-xs font-semibold bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-stone-300 dark:hover:bg-stone-700 rounded transition-colors"
                  >
                    Применить
                  </button>
                </form>

                {/* Promo hints & active badge */}
                {promoCode ? (
                  <div className="flex items-center justify-between mt-2 text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded border border-emerald-200 dark:border-emerald-800">
                    <span className="flex items-center gap-1 font-mono">
                      <Sparkles className="w-3 h-3" />
                      Промокод {promoCode} активен (-{promoDiscount > 0 ? formatPrice(promoDiscount) : ''})
                    </span>
                    <button
                      onClick={removePromoCode}
                      className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 ml-2 text-[11px]"
                    >
                      Отменить
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mt-2 text-[11px] text-stone-500 dark:text-stone-400">
                    <span>Доступные коды:</span>
                    <button
                      type="button"
                      onClick={() => handleQuickPromo('AURA10')}
                      className="underline hover:text-stone-900 dark:hover:text-stone-200"
                    >
                      AURA10 (-10%)
                    </button>
                    <span>·</span>
                    <button
                      type="button"
                      onClick={() => handleQuickPromo('SALE15')}
                      className="underline hover:text-stone-900 dark:hover:text-stone-200"
                    >
                      SALE15 (-15%)
                    </button>
                  </div>
                )}

                {promoFeedback && !promoCode && (
                  <p className={`text-xs mt-1.5 ${promoFeedback.success ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {promoFeedback.message}
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-stone-600 dark:text-stone-300 pt-2 border-t border-stone-200/60 dark:border-stone-800">
                <div className="flex justify-between">
                  <span>Стоимость товаров</span>
                  <span className="font-mono tabular-nums text-stone-900 dark:text-stone-100">{formatPrice(cartSubtotal)}</span>
                </div>

                {promoDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span>Скидка по промокоду</span>
                    <span className="font-mono tabular-nums">-{formatPrice(promoDiscount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Доставка</span>
                  <span className="font-mono tabular-nums text-stone-900 dark:text-stone-100">
                    {shippingCost === 0 ? 'Бесплатно' : formatPrice(shippingCost)}
                  </span>
                </div>

                <div className="flex justify-between text-base font-semibold text-stone-950 dark:text-white pt-2 border-t border-stone-200/80 dark:border-stone-800">
                  <span className="font-serif">Итого к оплате</span>
                  <span className="font-mono tabular-nums text-lg">{formatPrice(cartGrandTotal)}</span>
                </div>
              </div>

              {/* Checkout Primary Button */}
              <button
                type="button"
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 px-6 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold uppercase tracking-wider rounded-md hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <span>Оформить заказ</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
