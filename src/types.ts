export type Language = 'ar' | 'en';

export type ProductCategory = 'lingerie' | 'couple_games' | 'care_pedicure' | 'men_enhancers' | 'women_enhancers';

export type ViewType = 
  | 'home'
  | 'shop'
  | 'product_detail'
  | 'checkout'
  | 'account'
  | 'orders'
  | 'order_detail'
  | 'wishlist'
  | 'search'
  | 'stylist'
  | 'admin';

export interface StoreBranch {
  id: string;
  nameAr: string;
  nameEn: string;
  cityAr: string;
  cityEn: string;
  addressAr: string;
  addressEn: string;
  phone: string;
  whatsapp: string;
  isActive: boolean;
}

export interface StoreCategoryItem {
  id: string;
  nameAr: string;
  nameEn: string;
  subtitleAr: string;
  subtitleEn: string;
  descAr: string;
  descEn: string;
  image: string;
  badgeAr?: string;
  badgeEn?: string;
}

export interface StoreSettings {
  storeNameAr: string;
  storeNameEn: string;
  primaryPhone: string;
  whatsappOrder1: string;
  whatsappOrder2: string;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  telegramUrl: string;
  announcementTextAr: string;
  announcementTextEn: string;
  announcementActive: boolean;
  standardShippingFee: number;
  freeShippingThreshold: number;
  activePromoCode: string;
  activeDiscountPercent: number;
  discreetPackagingNoteAr: string;
  discreetPackagingNoteEn: string;
  adminPin: string;

  // Hero Section Texts
  heroBadgeAr?: string;
  heroBadgeEn?: string;
  heroTitleAr?: string;
  heroTitleEn?: string;
  heroSubtitleAr?: string;
  heroSubtitleEn?: string;
  heroBtn1TextAr?: string;
  heroBtn1TextEn?: string;
  heroBtn2TextAr?: string;
  heroBtn2TextEn?: string;

  // Brand Card Texts
  brandCardBadgeAr?: string;
  brandCardBadgeEn?: string;
  brandCardSubAr?: string;
  brandCardSubEn?: string;
  brandFeat1Ar?: string;
  brandFeat1En?: string;
  brandFeat2Ar?: string;
  brandFeat2En?: string;
  brandFeat3Ar?: string;
  brandFeat3En?: string;
  brandConciergeBtnAr?: string;
  brandConciergeBtnEn?: string;

  // Special Offer / Gift Banner Texts
  offerBadgeAr?: string;
  offerBadgeEn?: string;
  offerTagAr?: string;
  offerTagEn?: string;
  offerTitleAr?: string;
  offerTitleEn?: string;
  offerSubtitleAr?: string;
  offerSubtitleEn?: string;
  offerBtnTextAr?: string;
  offerBtnTextEn?: string;

  // Trust Guarantee 4 Cards Texts (Footer & Home)
  guarantee1TitleAr?: string;
  guarantee1DescAr?: string;
  guarantee1TitleEn?: string;
  guarantee1DescEn?: string;

  guarantee2TitleAr?: string;
  guarantee2DescAr?: string;
  guarantee2TitleEn?: string;
  guarantee2DescEn?: string;

  guarantee3TitleAr?: string;
  guarantee3DescAr?: string;
  guarantee3TitleEn?: string;
  guarantee3DescEn?: string;

  guarantee4TitleAr?: string;
  guarantee4DescAr?: string;
  guarantee4TitleEn?: string;
  guarantee4DescEn?: string;
}

export interface ProductColor {
  nameAr: string;
  nameEn: string;
  hex: string;
  value: string;
}

export interface Product {
  id: string;
  nameAr: string;
  nameEn: string;
  subtitleAr?: string;
  subtitleEn?: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  isSale?: boolean;
  inStock: boolean;
  images: string[];
  colors: ProductColor[];
  sizes: string[];
  descriptionAr: string;
  descriptionEn: string;
  specsAr: string[];
  specsEn: string[];
  careGuideAr: string[];
  careGuideEn: string[];
  fabricAr?: string;
  fabricEn?: string;
  tagAr?: string;
  tagEn?: string;
}

export interface CartItem {
  id: string;
  product: Product;
  selectedColor: ProductColor;
  selectedSize: string;
  quantity: number;
}

export type OrderStatus = 'placed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered';

export interface TrackingStep {
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  date: string;
  completed: boolean;
  current?: boolean;
}

export interface OrderItem {
  product: Product;
  colorNameAr: string;
  colorNameEn: string;
  colorHex: string;
  size: string;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  governorate: string;
  city: string;
  street: string;
  landmark?: string;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentMethod: 'cod' | 'card' | 'vodafone_cash';
  shippingMethod: 'standard' | 'express';
  shippingAddress: ShippingAddress;
  trackingSteps: TrackingStep[];
  isDiscreetPackaging: boolean;
  notes?: string;
  whatsappUrl?: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  tier: string;
  points: number;
  defaultAddress: ShippingAddress;
}
