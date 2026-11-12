import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Heart, ShoppingBag, Plus, Minus, Star, Truck, ShieldCheck, Check, Camera } from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    setPhotoEditingProduct,
    addToCart,
    isInWishlist,
    toggleWishlist,
    formatPrice,
  } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState<string>('');

  useEffect(() => {
    if (quickViewProduct) {
      setQuantity(1);
      setSelectedOption(quickViewProduct.options?.[0] || '');
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const isFavorited = isInWishlist(quickViewProduct.id);
  const isOutOfStock = quickViewProduct.inStock <= 0;
  const maxStock = quickViewProduct.inStock;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(quickViewProduct, quantity, selectedOption || undefined);
    setQuickViewProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-stone-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Backdrop click area */}
      <div
        className="fixed inset-0"
        onClick={() => setQuickViewProduct(null)}
      />

      {/* Modal Dialog Container */}
      <div className="relative w-full max-w-4xl bg-white dark:bg-stone-900 rounded-lg shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden z-10 max-h-[92vh] flex flex-col my-auto">
        
        {/* Header bar with close button */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
            <span className="font-medium uppercase tracking-wider text-stone-900 dark:text-stone-100">{quickViewProduct.brand}</span>
            <span aria-hidden="true">/</span>
            <span>{quickViewProduct.categoryLabel}</span>
          </div>

          <button
            onClick={() => setQuickViewProduct(null)}
            className="p-1.5 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 rounded-md transition-colors"
            title="Закрыть"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Column: Gallery (5 cols) */}
          <div className="md:col-span-6 flex flex-col gap-4">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-800 border border-stone-200/60 dark:border-stone-800">
              <img
                src={quickViewProduct.image}
                alt={quickViewProduct.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />

              {/* Action buttons on product image: Camera edit + Wishlist */}
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPhotoEditingProduct(quickViewProduct)}
                  className="p-2.5 rounded-full bg-white/90 dark:bg-stone-900/90 text-stone-700 dark:text-stone-200 hover:text-stone-950 dark:hover:text-white backdrop-blur-md transition-all shadow-sm cursor-pointer"
                  title="Загрузить или отредактировать фото этого покрывала"
                >
                  <Camera className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => toggleWishlist(quickViewProduct.id)}
                  className={`p-2.5 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                    isFavorited
                      ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400'
                      : 'bg-white/80 dark:bg-stone-900/80 text-stone-600 dark:text-stone-300 hover:text-stone-900 hover:scale-105'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* Specifications Key-Value Table */}
            {quickViewProduct.specifications && Object.keys(quickViewProduct.specifications).length > 0 && (
              <div className="bg-stone-50 dark:bg-stone-800/50 rounded-lg p-4 border border-stone-200/80 dark:border-stone-800 text-xs">
                <h4 className="font-semibold text-stone-900 dark:text-stone-100 mb-2 uppercase tracking-wider text-[11px]">
                  Технические характеристики
                </h4>
                <dl className="divide-y divide-stone-200/60 dark:divide-stone-700/60">
                  {Object.entries(quickViewProduct.specifications).map(([key, value]) => (
                    <div key={key} className="py-1.5 flex justify-between gap-4">
                      <dt className="text-stone-500 dark:text-stone-400">{key}</dt>
                      <dd className="font-medium text-stone-900 dark:text-stone-200 text-right">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>

          {/* Right Column: Contiguous Purchase Module (6 cols) */}
          <div className="md:col-span-6 flex flex-col justify-between">
            <div>
              {/* Rating and Reviews */}
              <div className="flex items-center gap-2 mb-2 text-xs">
                <div className="flex items-center text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <span className="ml-1 font-semibold text-stone-900 dark:text-stone-100 font-mono tabular-nums">
                    {quickViewProduct.rating}
                  </span>
                </div>
                <span className="text-stone-300 dark:text-stone-700">·</span>
                <span className="text-stone-500 dark:text-stone-400 font-mono tabular-nums">
                  {quickViewProduct.reviewsCount} отзывов покупателей
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl font-serif font-semibold text-stone-900 dark:text-stone-100 leading-snug mb-3">
                {quickViewProduct.name}
              </h1>

              {/* Price Row */}
              <div className="flex items-baseline gap-3 mb-5">
                <span className="text-2xl font-bold font-mono tabular-nums text-stone-950 dark:text-white">
                  {formatPrice(quickViewProduct.price)}
                </span>
                {quickViewProduct.originalPrice && quickViewProduct.originalPrice > quickViewProduct.price && (
                  <span className="text-sm line-through text-stone-400 font-mono tabular-nums">
                    {formatPrice(quickViewProduct.originalPrice)}
                  </span>
                )}
                {quickViewProduct.originalPrice && (
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
                    Экономия {formatPrice(quickViewProduct.originalPrice - quickViewProduct.price)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed mb-6">
                {quickViewProduct.description}
              </p>

              {/* Options Selector (e.g. Size or Color) */}
              {quickViewProduct.options && quickViewProduct.options.length > 0 && (
                <div className="mb-6">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2">
                    Вариант исполнения / Размер:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {quickViewProduct.options.map((opt) => {
                      const isSelected = selectedOption === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setSelectedOption(opt)}
                          className={`px-3.5 py-1.5 text-xs rounded-md border font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                            isSelected
                              ? 'border-stone-900 bg-stone-900 text-white dark:border-white dark:bg-white dark:text-stone-950 shadow-sm'
                              : 'border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:border-stone-400'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Stock Status & Quantity Stepper */}
              <div className="flex items-center justify-between mb-6 pt-4 border-t border-stone-100 dark:border-stone-800">
                <div>
                  <span className="text-xs text-stone-500 dark:text-stone-400 block mb-1">Наличие на складе:</span>
                  {isOutOfStock ? (
                    <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">Товар закончился</span>
                  ) : (
                    <span className="text-xs font-mono font-medium text-emerald-700 dark:text-emerald-400">
                      В наличии ({quickViewProduct.inStock} шт.)
                    </span>
                  )}
                </div>

                {!isOutOfStock && (
                  <div className="flex items-center border border-stone-200 dark:border-stone-700 rounded-md bg-stone-50 dark:bg-stone-800">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="p-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 disabled:opacity-30 cursor-pointer"
                      title="Уменьшить"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-mono font-semibold tabular-nums text-stone-900 dark:text-stone-100">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(maxStock, q + 1))}
                      disabled={quantity >= maxStock}
                      className="p-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 disabled:opacity-30 cursor-pointer"
                      title="Увеличить"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Purchase CTA and Trust points */}
            <div>
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`w-full py-3.5 px-6 rounded-md text-sm font-semibold tracking-wide flex items-center justify-center gap-2 transition-all shadow-sm ${
                  isOutOfStock
                    ? 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
                    : 'bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:text-stone-950 dark:hover:bg-stone-200 cursor-pointer'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isOutOfStock ? 'Нет в наличии' : `Добавить в корзину · ${formatPrice(quickViewProduct.price * quantity)}`}</span>
              </button>

              <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] text-stone-500 dark:text-stone-400">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-stone-700 dark:text-stone-300" />
                  <span>Доставка СДЭК 1-3 дня</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-stone-700 dark:text-stone-300" />
                  <span>Официальная гарантия</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
