// PY Sneaker E-Commerce Core Types

export type UserRole = 'admin' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

export interface Address {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  street: string;
  isDefault: boolean;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string;
  banner?: string;
  description: string;
  status: 'active' | 'inactive';
  seoTitle?: string;
  seoDescription?: string;
  productCount?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  image: string;
  description: string;
  status: 'active' | 'inactive';
  seoTitle?: string;
  seoDescription?: string;
  children?: Category[];
}

export interface ProductColor {
  name: string;
  hex: string;
  code: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  size: string; // e.g. "40", "41", "42"
  color: string; // e.g. "White / Black"
  colorHex: string;
  sku: string;
  price?: number; // Optional override
  salePrice?: number; // Optional override
  stockQuantity: number;
  reservedQuantity: number;
  soldQuantity: number;
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  brandId: string;
  brandName: string;
  categoryId: string;
  categoryName: string;
  gender: 'Men' | 'Women' | 'Unisex' | 'Kids';
  description: string;
  shortDescription: string;
  originalPrice: number; // in VNĐ
  salePrice?: number; // in VNĐ
  costPrice: number;
  status: 'active' | 'inactive' | 'draft';
  isFeatured: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  isSale: boolean;
  mainImage: string;
  galleryImages: string[];
  variants: ProductVariant[];
  rating: number;
  reviewCount: number;
  seoTitle: string;
  seoDescription: string;
  createdAt: string;
  deletedAt?: string | null; // Soft delete
}

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  productName: string;
  brandName: string;
  image: string;
  size: string;
  color: string;
  price: number;
  originalPrice: number;
  quantity: number;
  maxStock: number;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipping'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'cod' | 'vnpay';

export interface OrderItemSnapshot {
  id: string;
  productId: string;
  variantId: string;
  productName: string;
  sku: string;
  size: string;
  color: string;
  image: string;
  price: number;
  originalPrice: number;
  quantity: number;
  subtotal: number;
}

export interface OrderTimeline {
  status: OrderStatus;
  timestamp: string;
  note: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "SV-2026-9812"
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    province: string;
    district: string;
    ward: string;
    street: string;
  };
  note?: string;
  items: OrderItemSnapshot[];
  subtotal: number;
  shippingFee: number;
  shippingMethod: 'standard' | 'express';
  discount: number;
  couponCode?: string;
  giftCardCode?: string;
  giftCardDiscount?: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  timeline: OrderTimeline[];
  vnpayTransactionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number; // e.g. 10 (%) or 100000 (VNĐ)
  minimumOrder: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'inactive';
  description: string;
}

export interface GiftCard {
  id: string;
  code: string;
  initialValue: number;
  balance: number;
  expiryDate: string;
  status: 'active' | 'used' | 'expired';
  customerEmail?: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1 - 5
  comment: string;
  images?: string[];
  status: 'pending' | 'approved' | 'hidden';
  sizePurchased?: string;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  status: 'published' | 'draft';
  publishedAt: string;
  views: number;
}

export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  district: string;
  phone: string;
  openingHours: string;
  mapUrl: string;
  image: string;
  isFlagship?: boolean;
}

export interface StoreSettings {
  freeShippingThreshold: number; // 3.000.000
  standardShippingFee: number; // 30.000
  expressShippingFee: number; // 50.000
  storeName: string;
  storePhone?: string;
  storeWorkingHours?: string;
  storeEmail: string;
  storeAddress: string;
  vnpayTmnCode: string;
  vnpayHashSecret: string;
}
