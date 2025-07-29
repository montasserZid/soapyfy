export interface Product {
  id: string;
  name: {
    fr: string;
    en: string;
  };
  description: {
    fr: string;
    en: string;
  };
  price: string;
  ingredients: {
    fr: string[];
    en: string[];
  };
  image: string;
  botanical: string;
}

export type Language = 'fr' | 'en';

export interface Translation {
  fr: string;
  en: string;
}

export interface CartItem {
  id: string;
  name: Translation;
  price: string;
  image: string;
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  password: string;
  createdAt: string;
}

export interface Order {
  id: string;
  userId?: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  taxes: number;
  total: number;
  paymentMethod: 'payLater' | 'stripe';
  guestInfo?: {
    email: string;
    name: string;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
  };
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: string;
}

export interface AdminUser {
  id: string;
  username: string;
  password: string;
  role: 'admin';
}