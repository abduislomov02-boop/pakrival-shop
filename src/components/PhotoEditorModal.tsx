import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  Upload,
  RotateCw,
  FlipHorizontal,
  Sun,
  Contrast,
  Sliders,
  ZoomIn,
  Check,
  RotateCcw,
  Sparkles,
  Link as LinkIcon,
  Image as ImageIcon,
} from 'lucide-react';

const CARPET_PRESETS = [
  { url: '/src/assets/images/cover_carpet_jacquard_1794502501353.jpg', label: 'Жаккардовый бархат' },
  { url: '/src/assets/images/cover_carpet_washable_1794502501812.jpg', label: 'Моющееся AquaShield' },
  { url: '/src/assets/images/cover_carpet_elastic_1794502501983.jpg', label: 'Велюр на резинках' },
  { url: '/src/assets/images/cover_carpet_scandi_1794502503113.jpg', label: 'Шенилл геометрия' },
  { url: '/src/assets/images/product_bedspread_quilted_silk_1794502368022.jpg', label: 'Шелковое стеганое' },
  { url: '/src/assets/images/product_throw_cashmere_waffle_1794502368097.jpg', label: 'Вафельный хлопок' },
  { url: '/src/assets/images/product_blanket_merino_wool_1794502369266.jpg', label: 'Мериносовая вязка' },
];

export const PhotoEditorModal: React.FC = () => {
  const { photoEditingProduct, setPhotoEditingProduct, updateProductPhoto } = useStore();

  const [currentImageSrc, setCurrentImageSrc] = useState<string>('');
  const [sourceType, setSourceType] = useState<'upload' | 'preset' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState('');

  // Editing parameters
  const [rotation, setRotation] = useState<number>(0); // 0, 90, 180, 270
  const [isFlippedH, setIsFlippedH] = useState<boolean>(false);
  const [brightness, setBrightness] = useState<number>(100); // 60% - 150%
  const [contrast, setContrast] = useState<number>(100); // 60% - 150%
  const [saturate, setSaturate] = useState<number>(100); // 0% - 200%
  const [zoom, setZoom] = useState<number>(100); // 100% - 180%
  const [activeFilter, setActiveFilter] = useState<'none' | 'warm' | 'studio' | 'vintage' | 'bw'>('none');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (photoEditingProduct) {
      setCurrentImageSrc(photoEditingProduct.image);
      resetAdjustments();
    }
  }, [photoEditingProduct]);

  if (!photoEditingProduct) return null;

  const resetAdjustments = () => {
    setRotation(0);
    setIsFlippedH(false);
    setBrightness(100);
    setContrast(100);
    setSaturate(100);
    setZoom(100);
    setActiveFilter('none');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert('Размер файла превышает 8 МБ. Пожалуйста, выберите файл меньшего объема.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setCurrentImageSrc(reader.result);
          resetAdjustments();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      setCurrentImageSrc(urlInput.trim());
      setUrlInput('');
      resetAdjustments();
    }
  };

  const handleApplyPreset = (presetUrl: string) => {
    setCurrentImageSrc(presetUrl);
    resetAdjustments();
  };

  const applyPresetFilter = (filter: 'none' | 'warm' | 'studio' | 'vintage' | 'bw') => {
    setActiveFilter(filter);
    if (filter === 'none') {
      setBrightness(100);
      setContrast(100);
      setSaturate(100);
    } else if (filter === 'warm') {
      setBrightness(105);
      setContrast(105);
      setSaturate(125);
    } else if (filter === 'studio') {
      setBrightness(108);
      setContrast(115);
      setSaturate(110);
    } else if (filter === 'vintage') {
      setBrightness(95);
      setContrast(90);
      setSaturate(70);
    } else if (filter === 'bw') {
      setBrightness(100);
      setContrast(120);
      setSaturate(0);
    }
  };

  // Save changes by rendering through canvas
  const handleSaveAndApply = () => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const isRotated90or270 = rotation % 180 !== 0;
      const originalW = img.width;
      const originalH = img.height;

      // Target size keeping standard quality
      const targetW = isRotated90or270 ? originalH : originalW;
      const targetH = isRotated90or270 ? originalW : originalH;

      canvas.width = Math.min(targetW, 1600);
      canvas.height = Math.min(targetH, 1200);

      // Set filter on context
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%)`;

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);

      // Rotation & Flip
      ctx.rotate((rotation * Math.PI) / 180);
      if (isFlippedH) {
        ctx.scale(-1, 1);
      }

      // Zoom
      const scaleFactor = zoom / 100;
      ctx.scale(scaleFactor, scaleFactor);

      // Draw
      const drawW = isRotated90or270 ? canvas.height : canvas.width;
      const drawH = isRotated90or270 ? canvas.width : canvas.height;
      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();

      try {
        const finalDataUrl = canvas.toDataURL('image/jpeg', 0.92);
        updateProductPhoto(photoEditingProduct.id, finalDataUrl);
      } catch (err) {
        // In case of CORS restriction on external image, fallback to source string
        updateProductPhoto(photoEditingProduct.id, currentImageSrc);
      }

      setPhotoEditingProduct(null);
    };

    img.onerror = () => {
      updateProductPhoto(photoEditingProduct.id, currentImageSrc);
      setPhotoEditingProduct(null);
    };

    img.src = currentImageSrc;
  };

  // Compute CSS filter for live preview
  const liveFilterString = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%)`;
  const liveTransformString = `rotate(${rotation}deg) scaleX(${isFlippedH ? -1 : 1}) scale(${zoom / 100})`;

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto bg-stone-950/80 backdrop-blur-md animate-in fade-in duration-200 p-4 sm:p-6 flex items-center justify-center">
      
      {/* Hidden canvas for offscreen rendering */}
      <canvas ref={canvasRef} className="hidden" />

      <div className="relative w-full max-w-4xl bg-white dark:bg-stone-900 rounded-lg shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[94vh] my-auto">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500">
              Редактор фотографий товаров
            </span>
            <h2 className="text-base font-serif font-semibold text-stone-900 dark:text-stone-100 line-clamp-1">
              Редактирование фото для: «{photoEditingProduct.name}»
            </h2>
          </div>

          <button
            onClick={() => setPhotoEditingProduct(null)}
            className="p-1.5 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Source Switcher Tabs */}
        <div className="px-6 py-2.5 bg-stone-50 dark:bg-stone-800/50 border-b border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-stone-500 mr-1">Источник фото:</span>
            <button
              type="button"
              onClick={() => setSourceType('upload')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                sourceType === 'upload'
                  ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-700'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Загрузить с телефона / ПК</span>
            </button>

            <button
              type="button"
              onClick={() => setSourceType('preset')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                sourceType === 'preset'
                  ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-700'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Галерея покрывал</span>
            </button>

            <button
              type="button"
              onClick={() => setSourceType('url')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                sourceType === 'url'
                  ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-700'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Ссылка URL</span>
            </button>
          </div>

          <button
            type="button"
            onClick={resetAdjustments}
            className="text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 text-xs flex items-center gap-1"
            title="Сбросить все ползунки и фильтры"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Сбросить настройки</span>
          </button>
        </div>

        {/* Source input banners */}
        {sourceType === 'upload' && (
          <div className="px-6 py-3 bg-stone-100/70 dark:bg-stone-800/80 border-b border-stone-200 dark:border-stone-700 flex items-center justify-between text-xs">
            <span className="text-stone-600 dark:text-stone-300">
              Нажмите для выбора своего фото покрывала (JPG, PNG, WebP)
            </span>
            <label className="px-4 py-1.5 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-semibold rounded cursor-pointer hover:opacity-90 transition-opacity">
              <span>Выбрать файл</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        )}

        {sourceType === 'preset' && (
          <div className="px-6 py-3 bg-stone-100/70 dark:bg-stone-800/80 border-b border-stone-200 dark:border-stone-700 overflow-x-auto">
            <div className="flex items-center gap-3">
              {CARPET_PRESETS.map((p) => (
                <button
                  key={p.url}
                  type="button"
                  onClick={() => handleApplyPreset(p.url)}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded border transition-all text-xs shrink-0 cursor-pointer ${
                    currentImageSrc === p.url
                      ? 'border-stone-900 dark:border-white bg-white dark:bg-stone-900 font-medium shadow-sm'
                      : 'border-stone-300 dark:border-stone-700 hover:border-stone-500'
                  }`}
                >
                  <img src={p.url} alt="" className="w-6 h-6 rounded object-cover" />
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {sourceType === 'url' && (
          <form onSubmit={handleApplyUrl} className="px-6 py-3 bg-stone-100/70 dark:bg-stone-800/80 border-b border-stone-200 dark:border-stone-700 flex gap-2 text-xs">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Вставьте ссылку на изображение (https://...)"
              className="flex-1 px-3 py-1.5 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-600 rounded text-stone-900 dark:text-stone-100"
            />
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-medium rounded"
            >
              Загрузить
            </button>
          </form>
        )}

        {/* Body: Left Preview, Right Adjustment Controls */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-6 flex-1">
          
          {/* Left: Viewport Preview */}
          <div className="md:col-span-7 flex flex-col items-center justify-center bg-stone-100 dark:bg-stone-950/60 rounded-lg border border-stone-200 dark:border-stone-800 p-4 overflow-hidden min-h-[300px] relative">
            <div className="w-full max-w-md aspect-[4/3] rounded overflow-hidden flex items-center justify-center bg-stone-200 dark:bg-stone-800 relative">
              <img
                src={currentImageSrc}
                alt="Предпросмотр редактирования"
                className="max-w-full max-h-full object-contain transition-transform duration-150"
                style={{
                  filter: liveFilterString,
                  transform: liveTransformString,
                }}
              />
            </div>

            <div className="mt-3 flex items-center gap-4 text-[11px] text-stone-500 font-mono">
              <span>Угол: {rotation}°</span>
              <span>Масштаб: {zoom}%</span>
              <span>Зеркально: {isFlippedH ? 'Да' : 'Нет'}</span>
            </div>
          </div>

          {/* Right: Controls & Tools */}
          <div className="md:col-span-5 space-y-4 text-xs">
            
            {/* Rotate & Flip Quick Actions */}
            <div>
              <label className="font-semibold text-stone-900 dark:text-stone-100 uppercase tracking-wider text-[11px] block mb-2">
                Геометрия и ориентация
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="py-2 px-3 rounded border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 flex items-center justify-center gap-1.5 cursor-pointer font-medium"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Повернуть на 90°</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsFlippedH((f) => !f)}
                  className={`py-2 px-3 rounded border flex items-center justify-center gap-1.5 cursor-pointer font-medium transition-colors ${
                    isFlippedH
                      ? 'border-stone-900 bg-stone-900 text-white dark:border-white dark:bg-white dark:text-stone-900'
                      : 'border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <FlipHorizontal className="w-3.5 h-3.5" />
                  <span>Отразить</span>
                </button>
              </div>
            </div>

            {/* Zoom / Scale slider */}
            <div>
              <div className="flex justify-between text-stone-700 dark:text-stone-300 mb-1">
                <span className="flex items-center gap-1 font-medium">
                  <ZoomIn className="w-3.5 h-3.5 text-stone-400" />
                  <span>Масштабирование (Zoom)</span>
                </span>
                <span className="font-mono">{zoom}%</span>
              </div>
              <input
                type="range"
                min="100"
                max="180"
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full accent-stone-900 dark:accent-stone-100 cursor-pointer"
              />
            </div>

            {/* Quick Filter Presets */}
            <div>
              <label className="font-semibold text-stone-900 dark:text-stone-100 uppercase tracking-wider text-[11px] block mb-2">
                Цветовые пресеты
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'none', label: 'Оригинал' },
                  { id: 'warm', label: 'Теплый уют' },
                  { id: 'studio', label: 'Студийный' },
                  { id: 'vintage', label: 'Винтаж' },
                  { id: 'bw', label: 'Черно-белый' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => applyPresetFilter(f.id as any)}
                    className={`py-1.5 px-2 rounded border text-[11px] font-medium transition-colors cursor-pointer ${
                      activeFilter === f.id
                        ? 'border-stone-900 bg-stone-900 text-white dark:border-white dark:bg-white dark:text-stone-900'
                        : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Fine adjustment sliders: Brightness, Contrast, Saturation */}
            <div className="space-y-3 pt-2 border-t border-stone-200 dark:border-stone-800">
              <div>
                <div className="flex justify-between text-stone-700 dark:text-stone-300 mb-1">
                  <span className="flex items-center gap-1">
                    <Sun className="w-3.5 h-3.5 text-stone-400" />
                    <span>Яркость</span>
                  </span>
                  <span className="font-mono">{brightness}%</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="150"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full accent-stone-900 dark:accent-stone-100 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-stone-700 dark:text-stone-300 mb-1">
                  <span className="flex items-center gap-1">
                    <Contrast className="w-3.5 h-3.5 text-stone-400" />
                    <span>Контраст</span>
                  </span>
                  <span className="font-mono">{contrast}%</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="150"
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-full accent-stone-900 dark:accent-stone-100 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-stone-700 dark:text-stone-300 mb-1">
                  <span className="flex items-center gap-1">
                    <Sliders className="w-3.5 h-3.5 text-stone-400" />
                    <span>Насыщенность</span>
                  </span>
                  <span className="font-mono">{saturate}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={saturate}
                  onChange={(e) => setSaturate(Number(e.target.value))}
                  className="w-full accent-stone-900 dark:accent-stone-100 cursor-pointer"
                />
              </div>
            </div>

          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-stone-50 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setPhotoEditingProduct(null)}
            className="px-4 py-2 text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 cursor-pointer"
          >
            Отмена
          </button>

          <button
            type="button"
            onClick={handleSaveAndApply}
            className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold uppercase tracking-wider rounded-md transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Применить и сохранить фото</span>
          </button>
        </div>

      </div>
    </div>
  );
};
