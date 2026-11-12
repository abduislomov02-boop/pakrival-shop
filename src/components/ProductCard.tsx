import React from 'react';
import { Product } from '../types/store';
import { useStore } from '../context/StoreContext';
import { Heart, ShoppingBag, Eye, Star, Camera } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    addToCart,
    setQuickViewProduct,
    setPhotoEditingProduct,
    isInWishlist,
    toggleWishlist,
    formatPrice,
  } = useStore();

  const isFavorited = isInWishlist(product.id);
  const isOutOfStock = product.inStock <= 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    const defaultOption = product.options?.[0];
    addToCart(product, 1, defaultOption);
  };

  return (
    <article
      onClick={() => setQuickViewProduct(product)}
      className="group relative flex flex-col bg-white dark:bg-stone-900/60 rounded-lg border border-stone-200/90 dark:border-stone-800 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
    >
      {/* Visual Slot: 4:3 Aspect ratio container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100 dark:bg-stone-800/80">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-500"
          onError={(e) => {
            // Fallback gracefully if image fails to load
            (e.target as HTMLElement).style.display = 'none';
          }}
        />

        {/* Top Badges / Quiet Text Kicker - At most 1 subtle tag */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {product.isNew && (
            <span className="px-2 py-0.5 text-[11px] font-mono uppercase tracking-wider bg-stone-900/90 text-white dark:bg-white dark:text-stone-900 rounded">
              Новинка
            </span>
          )}
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="px-2 py-0.5 text-[11px] font-mono uppercase tracking-wider bg-amber-700/90 text-white rounded">
              Акция
            </span>
          )}
        </div>

        {/* Top Actions: Wishlist Heart & Edit Photo Button */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setPhotoEditingProduct(product);
            }}
            className="p-2 rounded-full bg-white/80 dark:bg-stone-900/80 text-stone-600 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white hover:scale-105 backdrop-blur-md transition-all shadow-xs cursor-pointer"
            title="Редактировать или загрузить своё фото для этого покрывала"
            aria-label="Редактировать фото"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
              isFavorited
                ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400'
                : 'bg-white/80 dark:bg-stone-900/80 text-stone-600 dark:text-stone-300 hover:text-stone-900 hover:scale-105'
            }`}
            title={isFavorited ? 'Удалить из избранного' : 'Добавить в избранное'}
            aria-label={isFavorited ? 'Удалить из избранного' : 'Добавить в избранное'}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Quick View Overlay Button on hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="flex-1 py-2 px-3 bg-white/95 dark:bg-stone-900/95 text-stone-900 dark:text-stone-100 text-xs font-medium rounded shadow-sm hover:bg-white dark:hover:bg-stone-800 transition-colors flex items-center justify-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Подробнее</span>
          </button>
        </div>
      </div>

      {/* Card Content & Metadata */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Unboxed Metadata with · separator */}
          <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mb-1.5">
            <span className="font-medium uppercase tracking-wider text-stone-700 dark:text-stone-300">{product.brand}</span>
            <span aria-hidden="true">·</span>
            <span>{product.categoryLabel}</span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-0.5">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span className="font-mono tabular-nums">{product.rating}</span>
            </span>
          </div>

          {/* Product Name */}
          <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100 line-clamp-2 leading-snug group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors">
            {product.name}
          </h3>

          {/* Availability note */}
          <div className="mt-2 text-xs">
            {isOutOfStock ? (
              <span className="text-rose-600 dark:text-rose-400 font-medium">Нет в наличии</span>
            ) : product.inStock <= 5 ? (
              <span className="text-amber-600 dark:text-amber-400 font-mono">Осталось всего {product.inStock} шт.</span>
            ) : (
              <span className="text-stone-500 dark:text-stone-400">В наличии на складе</span>
            )}
          </div>
        </div>

        {/* Price & Buy Action Row */}
        <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold font-mono tabular-nums text-stone-950 dark:text-white">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs line-through text-stone-400 dark:text-stone-500 font-mono tabular-nums">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            {product.options && product.options.length > 0 && (
              <span className="text-[11px] text-stone-500 dark:text-stone-400 truncate max-w-[140px]">
                {product.options.length} {product.options.length === 1 ? 'вариант' : 'варианта'}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`px-3 py-2 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              isOutOfStock
                ? 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
                : 'bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200 shadow-sm cursor-pointer'
            }`}
            title="Добавить в корзину"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">В корзину</span>
          </button>
        </div>
      </div>
    </article>
  );
};
