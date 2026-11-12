import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

type CategoryFilter = 'all' | 'jacquard' | 'waterproof' | 'elastic' | 'chenille' | 'silk';
type SortOption = 'featured' | 'price_asc' | 'price_desc' | 'rating';

export const ProductGrid: React.FC = () => {
  const { products } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [onlyInStock, setOnlyInStock] = useState(false);

  const categories: Array<{ id: CategoryFilter; label: string }> = [
    { id: 'all', label: 'Все покрывала для ковров' },
    { id: 'jacquard', label: 'Жаккардовые и велюр' },
    { id: 'waterproof', label: 'Водоотталкивающие' },
    { id: 'elastic', label: 'На резинках' },
    { id: 'chenille', label: 'Шенилл и геометрия' },
    { id: 'silk', label: 'Шелковые' },
  ];

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category filter
        if (selectedCategory !== 'all' && product.category !== selectedCategory) {
          return false;
        }
        // In-stock filter
        if (onlyInStock && product.inStock <= 0) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = product.name.toLowerCase().includes(q);
          const matchBrand = product.brand.toLowerCase().includes(q);
          const matchDesc = product.description.toLowerCase().includes(q);
          const matchCat = product.categoryLabel.toLowerCase().includes(q);
          return matchName || matchBrand || matchDesc || matchCat;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        // Default: featured first, then new, then id
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return 0;
      });
  }, [products, selectedCategory, searchQuery, sortBy, onlyInStock]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSortBy('featured');
    setOnlyInStock(false);
  };

  return (
    <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 scroll-mt-20">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-stone-500 dark:text-stone-400">
            Каталог покрывал и текстиля
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-medium text-stone-900 dark:text-stone-100 tracking-tight mt-1">
            Коллекция pakrival shop
          </h2>
        </div>

        <div className="text-xs text-stone-500 dark:text-stone-400 font-mono">
          Отображено: <span className="tabular-nums font-semibold text-stone-800 dark:text-stone-200">{filteredProducts.length}</span> из {products.length} товаров
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white dark:bg-stone-900 rounded-lg p-4 border border-stone-200/90 dark:border-stone-800 shadow-sm mb-8 space-y-4">
        
        {/* Top row: Categories segmented controls */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-sm'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Bottom row: Search input, Sort dropdown, Stock switch */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-stone-100 dark:border-stone-800">
          
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по названию, бренду или описанию..."
              className="w-full pl-9 pr-8 py-2 text-xs bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-md text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right controls: In stock toggle + Sort */}
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="rounded border-stone-300 text-stone-900 focus:ring-stone-500 cursor-pointer accent-stone-900 dark:accent-stone-100"
              />
              <span>Только в наличии</span>
            </label>

            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1">
                <ArrowUpDown className="w-3 h-3" />
                <span className="hidden sm:inline">Сортировка:</span>
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                aria-label="Сортировка товаров"
                className="text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-md py-1.5 px-2.5 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-stone-500 cursor-pointer"
              >
                <option value="featured">Рекомендуемые</option>
                <option value="price_asc">Сначала доступные</option>
                <option value="price_desc">Сначала премиальные</option>
                <option value="rating">По высокому рейтингу</option>
              </select>
            </div>
          </div>

        </div>

      </div>

      {/* Grid of Product Cards */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 bg-white dark:bg-stone-900/50 rounded-lg border border-dashed border-stone-300 dark:border-stone-700 p-8">
          <SlidersHorizontal className="w-8 h-8 text-stone-400 mx-auto mb-3" />
          <h3 className="text-lg font-serif font-medium text-stone-900 dark:text-stone-100 mb-1">
            Товары не найдены
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto mb-5">
            По вашему запросу ничего не найдено. Попробуйте изменить параметры поиска или фильтры.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-stone-900 dark:text-stone-100 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-md transition-colors"
          >
            Сбросить все фильтры
          </button>
        </div>
      )}

    </section>
  );
};
