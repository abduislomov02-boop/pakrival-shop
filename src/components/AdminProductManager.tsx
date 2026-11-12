import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types/store';
import {
  X,
  Plus,
  Edit3,
  Trash2,
  Search,
  Upload,
  Image as ImageIcon,
  Check,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  SlidersHorizontal,
  Camera,
} from 'lucide-react';

const PRESET_GALLERY_IMAGES = [
  { url: '/src/assets/images/cover_carpet_jacquard_1794502501353.jpg', label: 'Жаккардовое бархатное для ковра' },
  { url: '/src/assets/images/cover_carpet_washable_1794502501812.jpg', label: 'Водоотталкивающее AquaShield' },
  { url: '/src/assets/images/cover_carpet_elastic_1794502501983.jpg', label: 'Велюровое на резинках' },
  { url: '/src/assets/images/cover_carpet_scandi_1794502503113.jpg', label: 'Шенилловая геометрия' },
  { url: '/src/assets/images/product_bedspread_quilted_silk_1794502368022.jpg', label: 'Шелковое стеганое' },
  { url: '/src/assets/images/product_throw_cashmere_waffle_1794502368097.jpg', label: 'Вафельный хлопок' },
  { url: '/src/assets/images/product_blanket_merino_wool_1794502369266.jpg', label: 'Вязаное шерстяное' },
];

export const AdminProductManager: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    resetProducts,
    isAdminOpen,
    setIsAdminOpen,
    formatPrice,
    setPhotoEditingProduct,
  } = useStore();

  const [adminSearch, setAdminSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formBrand, setFormBrand] = useState('Pakrival Studio');
  const [formCategory, setFormCategory] = useState<Product['category']>('jacquard');
  const [formDescription, setFormDescription] = useState('');
  const [formPrice, setFormPrice] = useState<number>(250);
  const [formOriginalPrice, setFormOriginalPrice] = useState<number | undefined>(undefined);
  const [formStock, setFormStock] = useState<number>(10);
  const [formImage, setFormImage] = useState<string>('');
  const [formOptions, setFormOptions] = useState<string>('');
  const [formSpecs, setFormSpecs] = useState<Array<{ key: string; value: string }>>([
    { key: 'Материал', value: 'Жаккардовый велюр' },
    { key: 'Основа', value: 'Нескользящая Anti-Slip' },
  ]);
  const [imageTab, setImageTab] = useState<'upload' | 'preset' | 'url'>('preset');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  if (!isAdminOpen) return null;

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormName('');
    setFormBrand('Pakrival Studio');
    setFormCategory('jacquard');
    setFormDescription('');
    setFormPrice(250);
    setFormOriginalPrice(undefined);
    setFormStock(15);
    setFormImage(PRESET_GALLERY_IMAGES[0].url);
    setFormOptions('2.0 × 3.0 м, 2.5 × 3.5 м');
    setFormSpecs([
      { key: 'Назначение', value: 'Защитное покрывало для ковра' },
      { key: 'Основа', value: 'Противоскользящая Anti-Slip' },
    ]);
    setFormErrors({});
    setIsCreatingNew(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormBrand(p.brand);
    setFormCategory(p.category);
    setFormDescription(p.description);
    setFormPrice(p.price);
    setFormOriginalPrice(p.originalPrice);
    setFormStock(p.inStock);
    setFormImage(p.image);
    setFormOptions(p.options ? p.options.join(', ') : '');
    const specsArray = p.specifications
      ? Object.entries(p.specifications).map(([key, value]) => ({ key, value }))
      : [{ key: 'Материал', value: '' }];
    setFormSpecs(specsArray);
    setFormErrors({});
    setIsCreatingNew(true);
  };

  // Handle File Upload via FileReader
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Размер файла не должен превышать 5 МБ');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setFormImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Specs helper
  const handleAddSpecRow = () => {
    setFormSpecs((prev) => [...prev, { key: '', value: '' }]);
  };

  const handleUpdateSpec = (idx: number, field: 'key' | 'value', val: string) => {
    setFormSpecs((prev) => {
      const copy = [...prev];
      copy[idx][field] = val;
      return copy;
    });
  };

  const handleRemoveSpec = (idx: number) => {
    setFormSpecs((prev) => prev.filter((_, i) => i !== idx));
  };

  // Save product (Add or Edit)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!formName.trim()) errs.name = 'Введите название товара';
    if (!formBrand.trim()) errs.brand = 'Введите название бренда';
    if (!formDescription.trim()) errs.description = 'Заполните описание товара';
    if (!formPrice || formPrice <= 0) errs.price = 'Укажите положительную цену';
    if (formStock < 0) errs.stock = 'Остаток не может быть отрицательным';
    if (!formImage.trim()) errs.image = 'Загрузите или выберите изображение';

    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    const categoryLabels: Record<Product['category'], string> = {
      jacquard: 'Жаккардовые и велюровые',
      waterproof: 'Водоотталкивающие и моющиеся',
      elastic: 'Покрывала на резинках',
      chenille: 'Шенилл и геометрия',
      silk: 'Премиум шелк и сатин',
      all: 'Все покрывала для ковров',
    };

    const optionsList = formOptions
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const specsRecord: Record<string, string> = {};
    formSpecs.forEach((item) => {
      if (item.key.trim() && item.value.trim()) {
        specsRecord[item.key.trim()] = item.value.trim();
      }
    });

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: formName.trim(),
        brand: formBrand.trim(),
        category: formCategory,
        categoryLabel: categoryLabels[formCategory],
        description: formDescription.trim(),
        price: Number(formPrice),
        originalPrice: formOriginalPrice ? Number(formOriginalPrice) : undefined,
        inStock: Number(formStock),
        image: formImage,
        options: optionsList.length > 0 ? optionsList : undefined,
        specifications: specsRecord,
      });
    } else {
      addProduct({
        name: formName.trim(),
        brand: formBrand.trim(),
        category: formCategory,
        categoryLabel: categoryLabels[formCategory],
        description: formDescription.trim(),
        price: Number(formPrice),
        originalPrice: formOriginalPrice ? Number(formOriginalPrice) : undefined,
        inStock: Number(formStock),
        image: formImage,
        rating: 5.0,
        reviewsCount: 1,
        isNew: true,
        options: optionsList.length > 0 ? optionsList : undefined,
        specifications: specsRecord,
      });
    }

    setIsCreatingNew(false);
    setEditingProduct(null);
  };

  const filtered = products.filter((p) => {
    if (!adminSearch.trim()) return true;
    const q = adminSearch.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.categoryLabel.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-md animate-in fade-in duration-200 p-4 sm:p-6 flex items-center justify-center">
      
      <div className="relative w-full max-w-5xl bg-white dark:bg-stone-900 rounded-lg shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Panel Header */}
        <div className="px-6 py-5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-stone-100 dark:bg-stone-800 rounded-md">
              <SlidersHorizontal className="w-5 h-5 text-stone-900 dark:text-stone-100" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-semibold text-stone-900 dark:text-stone-100">
                Панель управления товарами
              </h2>
              <p className="text-xs text-stone-500">
                Редактирование каталога, добавление новинок, изменение цен и остатков
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold uppercase tracking-wider rounded-md hover:bg-stone-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Добавить товар</span>
            </button>
            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-1.5 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action / Search Bar */}
        <div className="p-6 pb-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={adminSearch}
              onChange={(e) => setAdminSearch(e.target.value)}
              placeholder="Поиск по названию или бренду..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-stone-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-stone-500 font-mono">
              Всего в базе: <strong>{products.length}</strong>
            </span>
            <button
              type="button"
              onClick={resetProducts}
              className="px-3 py-1.5 text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200/60 dark:hover:bg-stone-700 rounded transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Сбросить все изменения каталога к исходным товарам"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Сбросить демо-каталог</span>
            </button>
          </div>
        </div>

        {/* Table of products */}
        <div className="overflow-y-auto flex-1 p-6">
          <div className="overflow-x-auto border border-stone-200 dark:border-stone-800 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100/70 dark:bg-stone-800/80 text-stone-600 dark:text-stone-300 font-mono uppercase tracking-wider text-[11px] border-b border-stone-200 dark:border-stone-800">
                <tr>
                  <th className="py-3 px-4">Товар</th>
                  <th className="py-3 px-4">Категория</th>
                  <th className="py-3 px-4">Цена</th>
                  <th className="py-3 px-4">Склад</th>
                  <th className="py-3 px-4 text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800/80">
                {filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-stone-50/60 dark:hover:bg-stone-800/40 transition-colors">
                    
                    {/* Item Thumbnail & Name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt=""
                          className="w-12 h-12 object-cover rounded bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-stone-900 dark:text-stone-100 line-clamp-1">{product.name}</p>
                          <p className="text-[11px] text-stone-500 font-mono">{product.brand}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 text-stone-600 dark:text-stone-300">
                      {product.categoryLabel}
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 font-mono tabular-nums">
                      <span className="font-semibold text-stone-900 dark:text-stone-100">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="block text-[11px] line-through text-stone-400">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="py-3 px-4 font-mono tabular-nums">
                      {product.inStock <= 0 ? (
                        <span className="text-rose-600 font-medium">Нет (0 шт.)</span>
                      ) : product.inStock <= 5 ? (
                        <span className="text-amber-600 font-medium">Мало ({product.inStock} шт.)</span>
                      ) : (
                        <span className="text-emerald-700 dark:text-emerald-400 font-medium">{product.inStock} шт.</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setPhotoEditingProduct(product)}
                          className="p-1.5 text-stone-600 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 rounded transition-colors"
                          title="Редактировать или загрузить новое фото товара"
                        >
                          <Camera className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(product)}
                          className="p-1.5 text-stone-600 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 rounded transition-colors"
                          title="Редактировать параметры товара"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setProductToDelete(product)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded transition-colors"
                          title="Удалить товар"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* CREATE / EDIT PRODUCT MODAL */}
      {isCreatingNew && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 overflow-y-auto bg-stone-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-lg shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[92vh] my-auto">
            
            <div className="px-6 py-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
              <h3 className="text-base font-serif font-semibold text-stone-900 dark:text-stone-100">
                {editingProduct ? 'Редактирование товара' : 'Добавление нового товара'}
              </h3>
              <button
                onClick={() => setIsCreatingNew(false)}
                className="p-1 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-4 text-xs">
              
              {/* Product Name */}
              <div>
                <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Название товара *
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Например: Скульптурный журнальный столик Travertine"
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-stone-500"
                />
                {formErrors.name && <p className="text-[11px] text-rose-500 mt-0.5">{formErrors.name}</p>}
              </div>

              {/* Brand and Category Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Бренд / Дизайнер *
                  </label>
                  <input
                    type="text"
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    placeholder="AURA Studio"
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-stone-500"
                  />
                  {formErrors.brand && <p className="text-[11px] text-rose-500 mt-0.5">{formErrors.brand}</p>}
                </div>

                <div>
                  <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Категория *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-stone-500"
                  >
                    <option value="jacquard">Жаккардовые и велюровые</option>
                    <option value="waterproof">Водоотталкивающие и моющиеся</option>
                    <option value="elastic">Покрывала на резинках</option>
                    <option value="chenille">Шенилл и геометрия</option>
                    <option value="silk">Премиум шелк и сатин</option>
                  </select>
                </div>
              </div>

              {/* Price and Stock Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Цена продажи (сомони) *
                  </label>
                  <input
                    type="number"
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    min={1}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 font-mono"
                  />
                  {formErrors.price && <p className="text-[11px] text-rose-500 mt-0.5">{formErrors.price}</p>}
                </div>

                <div>
                  <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Старая цена (акция, ₽)
                  </label>
                  <input
                    type="number"
                    value={formOriginalPrice || ''}
                    onChange={(e) => setFormOriginalPrice(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="Без скидки"
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Остаток на складе (шт) *
                  </label>
                  <input
                    type="number"
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value))}
                    min={0}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 font-mono"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Описание товара *
                </label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={3}
                  placeholder="Опишите особенности, материалы, тактильные качества и назначение..."
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-stone-500"
                />
                {formErrors.description && <p className="text-[11px] text-rose-500 mt-0.5">{formErrors.description}</p>}
              </div>

              {/* Image Upload / Preset / URL selector */}
              <div className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-lg border border-stone-200 dark:border-stone-700 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-stone-900 dark:text-stone-100 uppercase tracking-wider text-[11px]">
                    Изображение товара *
                  </label>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setImageTab('preset')}
                      className={`px-2 py-1 rounded text-[11px] ${imageTab === 'preset' ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900 font-medium' : 'text-stone-500'}`}
                    >
                      Готовые фото
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageTab('upload')}
                      className={`px-2 py-1 rounded text-[11px] ${imageTab === 'upload' ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900 font-medium' : 'text-stone-500'}`}
                    >
                      Загрузить с диска
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageTab('url')}
                      className={`px-2 py-1 rounded text-[11px] ${imageTab === 'url' ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900 font-medium' : 'text-stone-500'}`}
                    >
                      Ссылка URL
                    </button>
                  </div>
                </div>

                {/* Preset Gallery choices */}
                {imageTab === 'preset' && (
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {PRESET_GALLERY_IMAGES.map((img) => (
                      <button
                        key={img.url}
                        type="button"
                        onClick={() => setFormImage(img.url)}
                        className={`relative aspect-square rounded overflow-hidden border-2 transition-all cursor-pointer ${
                          formImage === img.url ? 'border-stone-900 dark:border-white ring-2 ring-stone-900' : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                        title={img.label}
                      >
                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                        {formImage === img.url && (
                          <div className="absolute inset-0 bg-stone-950/30 flex items-center justify-center text-white">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* Upload from file system */}
                {imageTab === 'upload' && (
                  <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-md hover:border-stone-500 cursor-pointer bg-white dark:bg-stone-900 transition-colors">
                    <Upload className="w-6 h-6 text-stone-400 mb-1" />
                    <span className="text-xs text-stone-600 dark:text-stone-300 font-medium">Выберите файл изображения</span>
                    <span className="text-[11px] text-stone-400 mt-0.5">JPG, PNG, WebP до 5 МБ</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                )}

                {/* URL input */}
                {imageTab === 'url' && (
                  <input
                    type="url"
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100"
                  />
                )}

                {/* Image preview with direct editor button */}
                {formImage && (
                  <div className="flex items-center justify-between gap-3 pt-2 border-t border-stone-200/60 dark:border-stone-700/60">
                    <div className="flex items-center gap-3">
                      <img src={formImage} alt="Превью" className="w-12 h-12 object-cover rounded border border-stone-200 dark:border-stone-700" />
                      <span className="text-[11px] text-stone-500 truncate max-w-[200px]">Изображение выбрано</span>
                    </div>

                    {editingProduct && (
                      <button
                        type="button"
                        onClick={() => {
                          setPhotoEditingProduct(editingProduct);
                        }}
                        className="px-2.5 py-1 text-[11px] bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-stone-200 rounded font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Открыть в редакторе фото</span>
                      </button>
                    )}
                  </div>
                )}
                {formErrors.image && <p className="text-[11px] text-rose-500">{formErrors.image}</p>}
              </div>

              {/* Options (e.g. sizes / colors) */}
              <div>
                <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Варианты / Размеры (через запятую)
                </label>
                <input
                  type="text"
                  value={formOptions}
                  onChange={(e) => setFormOptions(e.target.value)}
                  placeholder="Черный, Слоновая кость, Графит"
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100"
                />
              </div>

              {/* Specifications table editor */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-medium text-stone-700 dark:text-stone-300">
                    Характеристики (ключ — значение)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddSpecRow}
                    className="text-[11px] text-stone-900 dark:text-stone-100 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Добавить строку</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {formSpecs.map((spec, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={spec.key}
                        onChange={(e) => handleUpdateSpec(idx, 'key', e.target.value)}
                        placeholder="Свойство (напр. Материал)"
                        className="w-1/2 px-2.5 py-1.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100"
                      />
                      <input
                        type="text"
                        value={spec.value}
                        onChange={(e) => handleUpdateSpec(idx, 'value', e.target.value)}
                        placeholder="Значение (напр. 100% шерсть)"
                        className="w-1/2 px-2.5 py-1.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSpec(idx)}
                        className="text-stone-400 hover:text-rose-600 p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreatingNew(false)}
                  className="px-4 py-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 font-medium"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-semibold uppercase tracking-wider rounded hover:bg-stone-800 transition-colors cursor-pointer shadow-sm"
                >
                  {editingProduct ? 'Сохранить изменения' : 'Добавить в каталог'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {productToDelete && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white dark:bg-stone-900 rounded-lg p-6 shadow-2xl border border-stone-200 dark:border-stone-800 text-center">
            <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
            <h4 className="text-base font-serif font-semibold text-stone-900 dark:text-stone-100 mb-2">
              Удалить товар?
            </h4>
            <p className="text-xs text-stone-600 dark:text-stone-400 mb-6">
              Вы действительно хотите удалить «{productToDelete.name}» из каталога? Товар также исчезнет из корзины пользователей.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteProduct(productToDelete.id);
                  setProductToDelete(null);
                }}
                className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded shadow-sm"
              >
                Да, удалить
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
