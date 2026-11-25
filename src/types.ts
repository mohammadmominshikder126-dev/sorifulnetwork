export type PageTab = 'home' | 'category' | 'search' | 'wishlist' | 'more';

export type CategoryId =
  | 'all'
  | 'smartphones'
  | 'headphones-earbuds'
  | 'smart-watch'
  | 'charger-power-bank'
  | 'cables-accessories'
  | 'bluetooth-speakers'
  | 'gaming-accessories';

export interface CategoryItem {
  id: CategoryId;
  name: string;
  shortName: string;
  description: string;
  productCount: number;
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: Exclude<CategoryId, 'all'>;
  categoryLabel: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  image: string;
  inStock: boolean;
  isPopular?: boolean;
  isNewArrival?: boolean;
  variants: string[];
  colors: { name: string; hex: string }[];
  description: string;
  specs: { label: string; value: string }[];
  warranty: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant: string;
  selectedColor: string;
}

export type OrderStatus =
  | 'Confirmed'
  | 'Pending'
  | 'Processing'
  | 'Shipped'
  | 'Delivered';

export interface Order {
  id: string;
  date: string;
  customerName: string;
  phone: string;
  address: string;
  paymentMethod: string;
  items: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
    variant: string;
    color: string;
  }[];
  total: number;
  status: OrderStatus;
}

export interface HeroSlide {
  id: string;
  eyebrow: string;
  titleBlue: string;
  titleWhite: string;
  subtitle: string;
  ctaLabel: string;
  ctaMobileLabel: string;
  targetCategory: CategoryId;
  accentGradient: string;
  leftImage: string;
  rightImage: string;
  bannerImage?: string;
  isBrandSlide?: boolean;
}

export interface BlogArticle {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  summary: string;
  content: string;
}

export interface SiteSettings {
  shopName: string;
  ownerName: string;
  location: string;
  mobile: string;
  whatsapp: string;
  tagline: string;
  topNotice: string;
  broadcastNotice: string;
}
