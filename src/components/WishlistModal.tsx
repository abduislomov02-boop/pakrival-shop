import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';

export const WishlistModal: React.FC = () => {
  const {
    wishlist,
    products,
    isWishlistOpen,
    setIsWishlistOpen,
    toggleWishlist,
    addToCart,
    formatPrice,
  } = useStore();

  if (!isWishlistOpen) return null;

  const favoriteProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-md animate-in fade-in duration-200 p-4 sm:p-6 flex items-center justify-center">
      
      <div className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-lg shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Heart className="w-5 h-5 text-rose-600 fill-rose-600" />
            <h2 className="text-lg font-serif font-semibold text-stone-900 dark:text-stone-100">
              Список желаний
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 rounded">
              {favoriteProducts.length}
            </span>
          </div>

          <button
            onClick={() => setIsWishlistOpen(false)}
            className="p-1.5 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="p-6 overflow-y-auto flex-1 divide-y divide-stone-100 dark:divide-stone-800">
          {favoriteProducts.length > 0 ? (
            favoriteProducts.map((p) => (
              <div key={p.id} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-16 h-16 object-cover rounded bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
                  />
                  <div>
                    <span className="text-[11px] font-mono uppercase text-stone-500">{p.brand}</span>
                    <h4 className="text-xs font-semibold text-stone-900 dark:text-stone-100 line-clamp-1">{p.name}</h4>
                    <p className="text-xs font-mono font-bold tabular-nums text-stone-950 dark:text-white mt-1">
                      {formatPrice(p.price)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      addToCart(p, 1, p.options?.[0]);
                    }}
                    disabled={p.inStock <= 0}
                    className="px-3 py-1.5 text-xs font-medium bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded hover:opacity-90 flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>В корзину</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleWishlist(p.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors"
                    title="Удалить из списка"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Heart className="w-10 h-10 text-stone-300 dark:text-stone-700 mx-auto mb-2" />
              <p className="text-stone-600 dark:text-stone-400 font-medium text-xs">Ваш список желаний пуст</p>
              <p className="text-[11px] text-stone-400 mt-1">Нажимайте на сердечко у понравившихся товаров</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
