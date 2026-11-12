export interface Product {
  id: string;
  name: string;
  brand: string;
  category: 'elastic' | 'waterproof' | 'jacquard' | 'chenille' | 'silk' | 'all';
  categoryLabel: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  inStock: number;
  image: string;
  isNew?: boolean;
  isFeatured?: boolean;
  options?: string[]; // e.g. sizes ["S", "M", "L"] or colors ["Чёрный", "Слоновая кость"]
  specifications: Record<string, string>;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  selectedOption?: string;
}

export type ShippingMethod = 'courier_dushanbe' | 'express_regions' | 'pickup_dushanbe' | 'cdek';
export type PaymentMethod = 'alif_mobi' | 'dc_wallet' | 'korti_milli' | 'cash_on_delivery';

export interface CustomerInfo {
  fullName: string;
  phone: string;
  email: string;
}

export interface ShippingInfo {
  method: ShippingMethod;
  region: string;
  city: string;
  address: string;
  apartment?: string;
  postalCode?: string;
  comment?: string;
}

export interface Order {
  id: string;
  createdAt: string;
  customer: CustomerInfo;
  shipping: ShippingInfo;
  paymentMethod: PaymentMethod;
  items: Array<{
    productId: string;
    name: string;
    brand: string;
    price: number;
    quantity: number;
    option?: string;
    image: string;
  }>;
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  promoCode?: string;
  status: 'processing' | 'confirmed' | 'shipped' | 'delivered';
  trackingNumber: string;
}
