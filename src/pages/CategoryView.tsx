import React, { useState } from 'react';
import { SlidersHorizontal, ArrowUpDown, ShieldCheck, Truck } from 'lucide-react';
import {
  IMG_IPHONE,
  IMG_GALAXY,
  IMG_HEADPHONES,
  IMG_EARBUDS,
  IMG_WATCH,
  IMG_CHARGER,
  IMG_CABLES,
  IMG_SPEAKER,
  IMG_GAMING,
  HERO_LEFT_IMG,
  HERO_RIGHT_IMG,
} from '../data/catalog';
import { CartItem, CategoryId, CategoryItem, Product } from '../types';
import { CategoryIcon } from '../components/CategoryIcon';
import { ProductCard } from '../components/ProductCard';

interface CategoryViewProps {
  products: Product[];
  categories: CategoryItem[];
  selectedCategory: CategoryId;
  onSelectCategory: (cat: CategoryId) => void;
  wishlistIds: string[];
  cartItems: CartItem[];
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onUpdateCartQuantity: (productId: string, delta: number) => void;
  onOpenDetails: (product: Product) => void;
}

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'discount';

const CATEGORY_BANNERS: Record<
  CategoryId,
  {
    eyebrow: string;
    title: string;
    subtitle: string;
    gradient: string;
    primaryImage: string;
    secondaryImage: string;
  }
> = {
  all: {
    eyebrow: 'S.A NETWORK OFFICIAL CATALOG',
    title: 'All Mobile Phones & Smart Accessories',
    subtitle:
      'Explore genuine smartphones, ANC audio, AMOLED smart watches, 65W GaN chargers & gaming gear.',
    gradient: 'from-[#071126] via-[#0b3b8c] to-[#0B84F3]',
    primaryImage: HERO_LEFT_IMG,
    secondaryImage: HERO_RIGHT_IMG,
  },
  smartphones: {
    eyebrow: 'FLAGSHIP & 5G SMARTPHONES',
    title: 'Latest Official Smartphones',
    subtitle:
      'iPhone 17 Pro, Samsung Galaxy S25 Ultra & official 5G devices with verified warranty across Bangladesh.',
    gradient: 'from-[#09122c] via-[#1d1b6b] to-[#0B84F3]',
    primaryImage: IMG_IPHONE,
    secondaryImage: IMG_GALAXY,
  },
  'headphones-earbuds': {
    eyebrow: 'WIRELESS AUDIO & STUDIO SOUND',
    title: 'Headphones & ANC Earbuds',
    subtitle:
      'Crystal-clear 45dB Active Noise Cancelling earbuds and 60-hour over-ear studio wireless headphones.',
    gradient: 'from-[#071126] via-[#0e346b] to-[#0284c7]',
    primaryImage: IMG_HEADPHONES,
    secondaryImage: IMG_EARBUDS,
  },
  'smart-watch': {
    eyebrow: 'AMOLED FITNESS & CALLING WATCHES',
    title: 'Smart Watch Collection',
    subtitle:
      'Track health, SpO2, heart rate & take Bluetooth calls right from your wrist with 14-day battery life.',
    gradient: 'from-[#071429] via-[#0a3c78] to-[#0B84F3]',
    primaryImage: IMG_WATCH,
    secondaryImage: HERO_RIGHT_IMG,
  },
  'charger-power-bank': {
    eyebrow: 'SUPER FAST GAN POWER',
    title: 'Chargers & Power Banks',
    subtitle:
      '65W GaN rapid wall adapters & 20,000mAh digital display power banks engineered for Bangladesh voltage.',
    gradient: 'from-[#071126] via-[#09386b] to-[#0ea5e9]',
    primaryImage: IMG_CHARGER,
    secondaryImage: HERO_RIGHT_IMG,
  },
  'cables-accessories': {
    eyebrow: 'DURABLE FAST-CHARGE CABLES & HUBS',
    title: 'Cables & MagSafe Accessories',
    subtitle:
      '100W E-Marker braided USB-C cables, magnetic Qi2 stands, and aluminum adapters built to last.',
    gradient: 'from-[#081326] via-[#123973] to-[#0B84F3]',
    primaryImage: IMG_CABLES,
    secondaryImage: IMG_CHARGER,
  },
  'bluetooth-speakers': {
    eyebrow: '360° DEEP BASS PORTABLE SOUND',
    title: 'Bluetooth Speakers',
    subtitle:
      'IP67 waterproof wireless speakers with punchy bass, TWS stereo pairing, and 20-hour battery.',
    gradient: 'from-[#061229] via-[#0c3c82] to-[#2563eb]',
    primaryImage: IMG_SPEAKER,
    secondaryImage: IMG_HEADPHONES,
  },
  'gaming-accessories': {
    eyebrow: 'PRO MOBILE & PC GAMING GEAR',
    title: 'Gaming Accessories',
    subtitle:
      'Hall-Effect anti-drift wireless controllers and ultra-low latency 2.4GHz gaming audio headsets.',
    gradient: 'from-[#071126] via-[#132f7a] to-[#0B84F3]',
    primaryImage: IMG_GAMING,
    secondaryImage: IMG_HEADPHONES,
  },
};

export const CategoryView: React.FC<CategoryViewProps> = ({
  products,
  categories,
  selectedCategory,
  onSelectCategory,
  wishlistIds,
  cartItems,
  onToggleWishlist,
  onAddToCart,
  onUpdateCartQuantity,
  onOpenDetails,
}) => {
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  const activeCategoryMeta = categories.find((c) => c.id === selectedCategory);
  const banner = CATEGORY_BANNERS[selectedCategory] || CATEGORY_BANNERS.all;
  const bannerPrimaryImg = activeCategoryMeta?.image || banner.primaryImage;

  const filtered = products
    .filter((p) => selectedCategory === 'all' || p.category === selectedCategory)
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'discount') return b.discountPercent - a.discountPercent;
      return 0;
    });

  const getCartQty = (productId: string) =>
    cartItems
      .filter((i) => i.product.id === productId)
      .reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="max-w-[1440px] mx-auto px-3.5 sm:px-6 py-5 space-y-5">
      {/* Category Visual Banner with Real Device Photos */}
      <div
        className={`relative overflow-hidden bg-gradient-to-r ${banner.gradient} text-white rounded-2xl p-5 sm:p-7 shadow-md`}
      >
        <div className="absolute inset-0 hero-dot-matrix opacity-35 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="max-w-xl space-y-2">
            <p className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-sky-300">
              {banner.eyebrow}
            </p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold leading-tight">
              {activeCategoryMeta ? activeCategoryMeta.name : banner.title}
            </h1>
            <p className="text-xs sm:text-sm text-sky-100/90 leading-relaxed">
              {activeCategoryMeta ? activeCategoryMeta.description : banner.subtitle}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-semibold text-white/95">
              <span className="inline-flex items-center gap-1.5 bg-white/15 border border-white/20 rounded-xl px-3 py-1.5 tabular-nums">
                <SlidersHorizontal className="w-3.5 h-3.5 text-sky-300" />
                {filtered.length} Products
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/10 rounded-xl px-3 py-1.5">
                <Truck className="w-3.5 h-3.5 text-sky-300" />
                Free Shipping
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/10 rounded-xl px-3 py-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-300" />
                Official Warranty
              </span>
            </div>
          </div>

          {/* Right Category Device Showcase Images */}
          <div className="flex items-center gap-3 self-center md:self-auto shrink-0">
            <div className="w-28 h-28 sm:w-36 sm:h-36 lg:w-44 lg:h-44 rounded-2xl bg-white p-1.5 shadow-xl border border-sky-300/40 overflow-hidden">
              <img
                src={bannerPrimaryImg}
                alt={activeCategoryMeta ? activeCategoryMeta.name : 'Category showcase'}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-36 lg:h-36 rounded-2xl bg-white/95 p-1.5 shadow-lg border border-sky-300/30 overflow-hidden">
              <img
                src={banner.secondaryImage}
                alt="Featured category device"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Strip */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          type="button"
          onClick={() => onSelectCategory('all')}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-[#0B84F3] text-white border-[#0B84F3] shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:border-[#0B84F3]'
          }`}
        >
          <CategoryIcon id="all" size="xs" />
          <span>All Products</span>
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-[#0B84F3] text-white border-[#0B84F3] shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:border-[#0B84F3]'
            }`}
          >
            <CategoryIcon id={cat.id} image={cat.image} size="xs" />
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Sort Bar */}
      <div className="flex items-center justify-between gap-3 bg-white rounded-xl border border-slate-200/80 px-4 py-2.5">
        <span className="text-xs sm:text-sm font-semibold text-slate-600">
          Showing <span className="text-slate-900 font-bold tabular-nums">{filtered.length}</span>{' '}
          items
        </span>

        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            aria-label="Sort products"
            className="text-xs sm:text-sm font-semibold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="discount">Biggest Discount</option>
          </select>
        </div>
      </div>

      {/* Filtered Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
        {filtered.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isWishlisted={wishlistIds.includes(product.id)}
            cartQuantity={getCartQty(product.id)}
            onToggleWishlist={onToggleWishlist}
            onAddToCart={onAddToCart}
            onUpdateCartQuantity={onUpdateCartQuantity}
            onOpenDetails={onOpenDetails}
          />
        ))}
      </div>
    </div>
  );
};
