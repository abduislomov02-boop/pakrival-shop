import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order } from '../types/store';
import { INITIAL_PRODUCTS } from '../data/initialProducts';

interface StoreContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  resetProducts: () => void;

  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedOption?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, selectedOption?: string) => void;
  removeFromCart: (productId: string, selectedOption?: string) => void;
  clearCart: () => void;
  cartTotalCount: number;
  cartSubtotal: number;
  shippingCost: number;
  promoCode: string;
  promoDiscount: number;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  cartGrandTotal: number;

  orders: Order[];
  createOrder: (orderData: {
    customer: Order['customer'];
    shipping: Order['shipping'];
    paymentMethod: Order['paymentMethod'];
  }) => Order;
  currentOrderCompleted: Order | null;
  setCurrentOrderCompleted: (order: Order | null) => void;

  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isOrdersOpen: boolean;
  setIsOrdersOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  photoEditingProduct: Product | null;
  setPhotoEditingProduct: (product: Product | null) => void;
  updateProductPhoto: (productId: string, newImageDataUrl: string) => void;

  theme: 'light' | 'dark';
  toggleTheme: () => void;

  formatPrice: (amount: number) => string;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'pakrival_tj_v3_products',
  CART: 'pakrival_tj_v3_cart',
  ORDERS: 'pakrival_tj_v3_orders',
  WISHLIST: 'pakrival_tj_v3_wishlist',
  THEME: 'pakrival_tj_v3_theme',
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Products State
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return INITIAL_PRODUCTS;
  });

  // Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return [];
  });

  // Orders State
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return [];
  });

  // Wishlist State
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return [];
  });

  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      if (saved === 'dark' || saved === 'light') return saved;
    } catch {
      // Fallback
    }
    return 'light';
  });

  // Modals & Panels State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [photoEditingProduct, setPhotoEditingProduct] = useState<Product | null>(null);
  const [currentOrderCompleted, setCurrentOrderCompleted] = useState<Order | null>(null);

  // Promo Code State
  const [promoCode, setPromoCode] = useState<string>('');
  const [promoDiscountRate, setPromoDiscountRate] = useState<number>(0);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  // Sync products with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch {
      // ignore
    }
  }, [products]);

  // Sync cart with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // Sync orders with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  // Sync wishlist with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  // Sync Theme with document.documentElement
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch {
      // ignore
    }
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Product Management CRUD
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-custom-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Товар «${newProduct.name}» успешно добавлен в каталог`);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
    // Also update current cart items if price or title changed
    setCart((prev) =>
      prev.map((ci) => {
        if (ci.productId === id) {
          return {
            ...ci,
            product: { ...ci.product, ...updates },
          };
        }
        return ci;
      })
    );
    showToast('Изменения сохранены');
  };

  const updateProductPhoto = (productId: string, newImageDataUrl: string) => {
    updateProduct(productId, { image: newImageDataUrl });
    if (quickViewProduct?.id === productId) {
      setQuickViewProduct((prev) => (prev ? { ...prev, image: newImageDataUrl } : null));
    }
    showToast('Фотография товара успешно обновлена');
  };

  const deleteProduct = (id: string) => {
    const target = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((ci) => ci.productId !== id));
    setWishlist((prev) => prev.filter((item) => item !== id));
    if (quickViewProduct?.id === id) setQuickViewProduct(null);
    showToast(`Товар ${target ? `«${target.name}»` : ''} удален из каталога`);
  };

  const resetProducts = () => {
    setProducts(INITIAL_PRODUCTS);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    showToast('Каталог сброшен к исходным товарам');
  };

  // Cart Functions
  const addToCart = (product: Product, quantity = 1, selectedOption?: string) => {
    if (product.inStock <= 0) {
      showToast('К сожалению, данный товар временно закончился');
      return;
    }

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === product.id && item.selectedOption === selectedOption
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = Math.min(
          updated[existingIndex].quantity + quantity,
          product.inStock
        );
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          product,
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            productId: product.id,
            product,
            quantity: Math.min(quantity, product.inStock),
            selectedOption,
          },
        ];
      }
    });

    showToast(`«${product.name}» добавлен в корзину`);
  };

  const updateCartQuantity = (productId: string, quantity: number, selectedOption?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedOption);
      return;
    }

    setCart((prev) =>
      prev.map((item) => {
        if (item.productId === productId && item.selectedOption === selectedOption) {
          const maxStock = item.product.inStock || 99;
          const finalQty = Math.min(quantity, maxStock);
          return { ...item, quantity: finalQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string, selectedOption?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.productId === productId && item.selectedOption === selectedOption)
      )
    );
    showToast('Товар удален из корзины');
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const applyPromoCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'PAK10' || clean === 'AURA10') {
      setPromoCode('PAK10');
      setPromoDiscountRate(0.1);
      return { success: true, message: 'Промокод PAK10 применен (-10%)' };
    }
    if (clean === 'SALE15') {
      setPromoCode('SALE15');
      setPromoDiscountRate(0.15);
      return { success: true, message: 'Промокод SALE15 применен (-15%)' };
    }
    if (clean === 'VIP20') {
      setPromoCode('VIP20');
      setPromoDiscountRate(0.2);
      return { success: true, message: 'VIP промокод применен (-20%)' };
    }
    return { success: false, message: 'Неверный промокод. Попробуйте PAK10 или SALE15' };
  };

  const removePromoCode = () => {
    setPromoCode('');
    setPromoDiscountRate(0);
  };

  const promoDiscount = Math.round(cartSubtotal * promoDiscountRate);
  // Free shipping over 250 сомони in Tajikistan, otherwise 20 сомони
  const shippingCost = cartSubtotal >= 250 || cartSubtotal === 0 ? 0 : 20;
  const cartGrandTotal = Math.max(0, cartSubtotal - promoDiscount + (cart.length > 0 ? shippingCost : 0));

  // Orders creation
  const createOrder = (orderData: {
    customer: Order['customer'];
    shipping: Order['shipping'];
    paymentMethod: Order['paymentMethod'];
  }): Order => {
    const orderNumber = Math.floor(10000 + Math.random() * 90000);
    const trackingCode = `TJ-${Math.floor(100000000 + Math.random() * 900000000)}`;

    const newOrder: Order = {
      id: `PAK-TJ-${orderNumber}`,
      createdAt: new Date().toISOString(),
      customer: orderData.customer,
      shipping: orderData.shipping,
      paymentMethod: orderData.paymentMethod,
      items: cart.map((ci) => ({
        productId: ci.productId,
        name: ci.product.name,
        brand: ci.product.brand,
        price: ci.product.price,
        quantity: ci.quantity,
        option: ci.selectedOption,
        image: ci.product.image,
      })),
      subtotal: cartSubtotal,
      discount: promoDiscount,
      shippingCost,
      total: cartGrandTotal,
      promoCode: promoCode || undefined,
      status: 'confirmed',
      trackingNumber: trackingCode,
    };

    // Decrement stock in catalog
    setProducts((prev) =>
      prev.map((p) => {
        const itemInCart = cart.find((c) => c.productId === p.id);
        if (itemInCart) {
          return {
            ...p,
            inStock: Math.max(0, p.inStock - itemInCart.quantity),
          };
        }
        return p;
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    removePromoCode();
    setCurrentOrderCompleted(newOrder);
    setIsCheckoutOpen(false);
    return newOrder;
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Удалено из избранного');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Добавлено в избранное');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Currency Formatter in Tajikistan Somoni (сомони)
  const formatPrice = (amount: number) => {
    return `${amount.toLocaleString('ru-RU')} сомони`;
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        resetProducts,

        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotalCount,
        cartSubtotal,
        shippingCost,
        promoCode,
        promoDiscount,
        applyPromoCode,
        removePromoCode,
        cartGrandTotal,

        orders,
        createOrder,
        currentOrderCompleted,
        setCurrentOrderCompleted,

        wishlist,
        toggleWishlist,
        isInWishlist,

        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isAdminOpen,
        setIsAdminOpen,
        isOrdersOpen,
        setIsOrdersOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        quickViewProduct,
        setQuickViewProduct,
        photoEditingProduct,
        setPhotoEditingProduct,
        updateProductPhoto,

        theme,
        toggleTheme,

        formatPrice,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
