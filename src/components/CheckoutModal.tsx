import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShippingMethod, PaymentMethod } from '../types/store';
import { TajikistanDeliveryMap, TAJIKISTAN_CITIES, TajikistanCity } from './TajikistanDeliveryMap';
import { X, ArrowRight, ArrowLeft, CheckCircle2, User, MapPin, CreditCard, ShieldCheck, QrCode } from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    cart,
    isCheckoutOpen,
    setIsCheckoutOpen,
    cartSubtotal,
    promoDiscount,
    shippingCost,
    cartGrandTotal,
    createOrder,
    formatPrice,
    promoCode,
  } = useStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State for Tajikistan
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '+992 ',
    email: '',
    shippingMethod: 'courier_dushanbe' as ShippingMethod,
    region: 'г. Душанбе (Пойтахт)',
    city: 'Душанбе',
    address: '',
    apartment: '',
    postalCode: '',
    comment: '',
    paymentMethod: 'alif_mobi' as PaymentMethod,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isCheckoutOpen) return null;

  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = 'Укажите ваше имя и фамилию';
    if (!formData.phone.trim() || formData.phone.length < 9) errs.phone = 'Укажите номер телефона в Таджикистане (+992...)';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (!formData.city.trim()) errs.city = 'Выберите город на карте Таджикистана';
    if (!formData.address.trim()) errs.address = 'Укажите улицу, ориентир или микрорайон';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1) {
      if (validateStep1()) setStep(2);
    } else if (step === 2) {
      if (validateStep2()) setStep(3);
    } else if (step === 3) {
      setStep(4);
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep((s) => (s - 1) as any);
  };

  const handleSelectMapCity = (city: TajikistanCity) => {
    setFormData((prev) => ({
      ...prev,
      city: city.name,
      region: city.region,
      shippingMethod: city.id === 'dushanbe' ? 'courier_dushanbe' : 'express_regions',
    }));
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createOrder({
      customer: {
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email || 'customer@pakrival.tj',
      },
      shipping: {
        method: formData.shippingMethod,
        region: formData.region,
        city: formData.city,
        address: formData.address,
        apartment: formData.apartment,
        comment: formData.comment,
      },
      paymentMethod: formData.paymentMethod,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-stone-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={() => setIsCheckoutOpen(false)} />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-white dark:bg-stone-900 rounded-xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden z-10 my-auto flex flex-col max-h-[92vh]">
        
        {/* Header with Steps */}
        <div className="px-6 py-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-semibold">
              <span>Доставка по Таджикистану</span>
              <span>·</span>
              <span>Шаг {step} из 4</span>
            </div>
            <h2 className="text-lg font-serif font-semibold text-stone-900 dark:text-stone-100">
              {step === 1 && '1. Контактная информация получателя'}
              {step === 2 && '2. Выбор города на карте Таджикистана и адрес'}
              {step === 3 && '3. Способ оплаты (Алиф Моби, Корти Милли, DC)'}
              {step === 4 && '4. Подтверждение и отправка заказа'}
            </h2>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicators */}
        <div className="grid grid-cols-4 border-b border-stone-100 dark:border-stone-800 text-xs text-center font-medium bg-stone-50 dark:bg-stone-800/40">
          <div className={`py-2 px-1 border-b-2 ${step >= 1 ? 'border-stone-900 dark:border-stone-100 text-stone-900 dark:text-stone-100' : 'border-transparent text-stone-400'}`}>
            <span className="hidden sm:inline">1. Контакты</span>
            <span className="sm:hidden">1</span>
          </div>
          <div className={`py-2 px-1 border-b-2 ${step >= 2 ? 'border-stone-900 dark:border-stone-100 text-stone-900 dark:text-stone-100' : 'border-transparent text-stone-400'}`}>
            <span className="hidden sm:inline">2. Карта Таджикистана</span>
            <span className="sm:hidden">2</span>
          </div>
          <div className={`py-2 px-1 border-b-2 ${step >= 3 ? 'border-stone-900 dark:border-stone-100 text-stone-900 dark:text-stone-100' : 'border-transparent text-stone-400'}`}>
            <span className="hidden sm:inline">3. Оплата (TJS)</span>
            <span className="sm:hidden">3</span>
          </div>
          <div className={`py-2 px-1 border-b-2 ${step >= 4 ? 'border-stone-900 dark:border-stone-100 text-stone-900 dark:text-stone-100' : 'border-transparent text-stone-400'}`}>
            <span className="hidden sm:inline">4. Итог</span>
            <span className="sm:hidden">4</span>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto flex-1">
          
          {/* STEP 1: Contacts */}
          {step === 1 && (
            <div className="space-y-4 max-w-xl mx-auto py-2">
              <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300 mb-2">
                <User className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-semibold uppercase tracking-wider">Контакты покупателя</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Имя и Фамилия получателя *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Например: Алишер Рахимов"
                  className={`w-full px-3.5 py-2.5 text-xs bg-stone-50 dark:bg-stone-800 border rounded-md text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 ${
                    errors.fullName ? 'border-rose-500 focus:ring-rose-500' : 'border-stone-200 dark:border-stone-700 focus:ring-stone-500'
                  }`}
                />
                {errors.fullName && <p className="text-[11px] text-rose-500 mt-1">{errors.fullName}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Номер телефона в Таджикистане *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+992 900 12 34 56"
                    className={`w-full px-3.5 py-2.5 text-xs bg-stone-50 dark:bg-stone-800 border rounded-md text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 ${
                      errors.phone ? 'border-rose-500 focus:ring-rose-500' : 'border-stone-200 dark:border-stone-700 focus:ring-stone-500'
                    }`}
                  />
                  {errors.phone && <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Email или мессенджер (WhatsApp/Telegram)
                  </label>
                  <input
                    type="text"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="alisher@mail.tj или @telegram"
                    className="w-full px-3.5 py-2.5 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-md text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-stone-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-md text-[11px] text-emerald-800 dark:text-emerald-300">
                Курьер свяжется с вами по номеру телефона перед выездом для согласования времени доставки покрывала.
              </div>
            </div>
          )}

          {/* STEP 2: Interactive Tajikistan Delivery Map & Address */}
          {step === 2 && (
            <div className="space-y-4 py-1">
              
              {/* Interactive Tajikistan Map Embedded */}
              <TajikistanDeliveryMap
                isCompact={true}
                selectedCityId={TAJIKISTAN_CITIES.find((c) => c.name === formData.city)?.id}
                onSelectCity={handleSelectMapCity}
              />

              {/* Selected location and address inputs */}
              <div className="bg-stone-50 dark:bg-stone-800/60 p-4 rounded-xl border border-stone-200 dark:border-stone-700 space-y-3">
                
                <div className="flex items-center justify-between text-xs pb-2 border-b border-stone-200 dark:border-stone-700">
                  <span className="text-stone-500">Выбранный город на карте:</span>
                  <span className="font-semibold text-stone-950 dark:text-white flex items-center gap-1 font-mono">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    {formData.city} ({formData.region})
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                      Улица, проспект, микрорайон или ориентир *
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Например: 82 мкр, ул. Нусратулло Махсум, дом 14"
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-stone-500"
                    />
                    {errors.address && <p className="text-[11px] text-rose-500 mt-1">{errors.address}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                      Дом / Квартира
                    </label>
                    <input
                      type="text"
                      value={formData.apartment}
                      onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                      placeholder="кв. 25"
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Комментарий для курьера
                  </label>
                  <input
                    type="text"
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    placeholder="Ориентир (рядом с мечетью, школой или рынком)..."
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100"
                  />
                </div>
              </div>

            </div>
          )}

          {/* STEP 3: Payment (Tajikistan popular systems) */}
          {step === 3 && (
            <div className="space-y-4 max-w-xl mx-auto py-2">
              <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300 mb-2">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Способ оплаты в Таджикистане
                </span>
              </div>

              <div className="space-y-3">
                {/* Alif Mobi */}
                <label className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                  formData.paymentMethod === 'alif_mobi'
                    ? 'border-emerald-600 bg-emerald-50/50 dark:border-emerald-500 dark:bg-emerald-950/30 ring-1 ring-emerald-500'
                    : 'border-stone-200 dark:border-stone-700 hover:border-stone-400'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={formData.paymentMethod === 'alif_mobi'}
                    onChange={() => setFormData({ ...formData, paymentMethod: 'alif_mobi' })}
                    className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="text-xs font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                      <span>Алиф Моби (Alif Mobi) — QR-код</span>
                      <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 rounded text-[10px] font-mono">
                        Популярно
                      </span>
                    </span>
                    <span className="text-[11px] text-stone-500 dark:text-stone-400 block mt-0.5">
                      Моментальная оплата через приложение Alif Mobi с кэшбэком или рассрочкой
                    </span>
                  </div>
                </label>

                {/* Korti Milli */}
                <label className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                  formData.paymentMethod === 'korti_milli'
                    ? 'border-emerald-600 bg-emerald-50/50 dark:border-emerald-500 dark:bg-emerald-950/30 ring-1 ring-emerald-500'
                    : 'border-stone-200 dark:border-stone-700 hover:border-stone-400'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={formData.paymentMethod === 'korti_milli'}
                    onChange={() => setFormData({ ...formData, paymentMethod: 'korti_milli' })}
                    className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="text-xs font-semibold text-stone-900 dark:text-stone-100 block">
                      Корти Милли (Korti Milli — онлайн / терминал)
                    </span>
                    <span className="text-[11px] text-stone-500 dark:text-stone-400 block mt-0.5">
                      Любые карты банков Таджикистана (Ориёнбанк, Амонатбонк, Эсхата, Спитамен, Имон)
                    </span>
                  </div>
                </label>

                {/* Dushanbe City */}
                <label className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                  formData.paymentMethod === 'dc_wallet'
                    ? 'border-emerald-600 bg-emerald-50/50 dark:border-emerald-500 dark:bg-emerald-950/30 ring-1 ring-emerald-500'
                    : 'border-stone-200 dark:border-stone-700 hover:border-stone-400'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={formData.paymentMethod === 'dc_wallet'}
                    onChange={() => setFormData({ ...formData, paymentMethod: 'dc_wallet' })}
                    className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="text-xs font-semibold text-stone-900 dark:text-stone-100 block">
                      Dushanbe City (DC Wallet)
                    </span>
                    <span className="text-[11px] text-stone-500 dark:text-stone-400 block mt-0.5">
                      Оплата через электронный кошелек Dushanbe City
                    </span>
                  </div>
                </label>

                {/* Cash upon Delivery */}
                <label className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                  formData.paymentMethod === 'cash_on_delivery'
                    ? 'border-emerald-600 bg-emerald-50/50 dark:border-emerald-500 dark:bg-emerald-950/30 ring-1 ring-emerald-500'
                    : 'border-stone-200 dark:border-stone-700 hover:border-stone-400'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={formData.paymentMethod === 'cash_on_delivery'}
                    onChange={() => setFormData({ ...formData, paymentMethod: 'cash_on_delivery' })}
                    className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="text-xs font-semibold text-stone-900 dark:text-stone-100 block">
                      Наличными сомони при получении курьеру
                    </span>
                    <span className="text-[11px] text-stone-500 dark:text-stone-400 block mt-0.5">
                      Оплата наличными сомони после примерки и осмотра покрывала на ковре
                    </span>
                  </div>
                </label>
              </div>

              <div className="flex items-center gap-2 p-3 bg-stone-100/60 dark:bg-stone-800/40 rounded border border-stone-200/60 dark:border-stone-800 text-stone-500 text-[11px]">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Все платежи защищены. Безопасная примерка: вы можете осмотреть покрывало перед оплатой!</span>
              </div>
            </div>
          )}

          {/* STEP 4: Review and Confirm */}
          {step === 4 && (
            <div className="space-y-5 max-w-xl mx-auto py-2">
              <div className="bg-stone-50 dark:bg-stone-800/50 rounded-lg p-4 border border-stone-200/80 dark:border-stone-800 text-xs space-y-3">
                <h4 className="font-semibold text-stone-900 dark:text-stone-100 uppercase tracking-wider text-[11px]">
                  Сводка заказа (Таджикистан):
                </h4>
                
                <div className="grid grid-cols-2 gap-3 text-stone-600 dark:text-stone-300">
                  <div>
                    <span className="text-stone-400 block text-[11px]">Получатель:</span>
                    <span className="font-medium text-stone-900 dark:text-stone-100">{formData.fullName}</span>
                    <span className="block text-[11px] font-mono">{formData.phone}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[11px]">Город доставки:</span>
                    <span className="font-medium text-stone-900 dark:text-stone-100">
                      г. {formData.city}, {formData.address}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[11px]">Способ оплаты:</span>
                    <span className="font-medium text-stone-900 dark:text-stone-100">
                      {formData.paymentMethod === 'alif_mobi' && 'Алиф Моби (QR-код)'}
                      {formData.paymentMethod === 'korti_milli' && 'Корти Милли'}
                      {formData.paymentMethod === 'dc_wallet' && 'Dushanbe City'}
                      {formData.paymentMethod === 'cash_on_delivery' && 'Наличными при получении'}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[11px]">Количество товаров:</span>
                    <span className="font-medium text-stone-900 dark:text-stone-100 font-mono">
                      {cart.reduce((a, b) => a + b.quantity, 0)} покрывала
                    </span>
                  </div>
                </div>
              </div>

              {/* Items in order brief */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2">
                  Покрывала в заказе:
                </h4>
                <div className="divide-y divide-stone-100 dark:divide-stone-800 max-h-48 overflow-y-auto">
                  {cart.map((ci) => (
                    <div key={ci.productId} className="py-2 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <img src={ci.product.image} alt="" className="w-10 h-10 object-cover rounded" />
                        <div>
                          <p className="font-medium text-stone-900 dark:text-stone-100 line-clamp-1">{ci.product.name}</p>
                          <p className="text-[11px] text-stone-500 font-mono">{ci.quantity} × {formatPrice(ci.product.price)}</p>
                        </div>
                      </div>
                      <span className="font-mono tabular-nums font-semibold text-stone-900 dark:text-stone-100">
                        {formatPrice(ci.product.price * ci.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price summary in somoni */}
              <div className="pt-3 border-t border-stone-200 dark:border-stone-800 text-xs space-y-1">
                <div className="flex justify-between text-stone-600 dark:text-stone-400">
                  <span>Стоимость покрывал:</span>
                  <span className="font-mono tabular-nums">{formatPrice(cartSubtotal)}</span>
                </div>
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Скидка ({promoCode}):</span>
                    <span className="font-mono tabular-nums">-{formatPrice(promoDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600 dark:text-stone-400">
                  <span>Доставка по Таджикистану:</span>
                  <span className="font-mono tabular-nums">{shippingCost === 0 ? 'Бесплатно' : formatPrice(shippingCost)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-stone-950 dark:text-white pt-2 border-t border-stone-200/80 dark:border-stone-800">
                  <span>Итого к оплате:</span>
                  <span className="font-mono tabular-nums text-lg text-emerald-700 dark:text-emerald-400">
                    {formatPrice(cartGrandTotal)}
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Navigation Footer */}
        <div className="px-6 py-4 bg-stone-50 dark:bg-stone-900/90 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="px-4 py-2 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:text-stone-900 flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Назад</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold uppercase tracking-wider rounded-md hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Далее</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinalSubmit}
              className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold uppercase tracking-wider rounded-md transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Подтвердить заказ в Таджикистане</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
