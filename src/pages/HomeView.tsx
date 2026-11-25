import React from 'react';
import {
  ChevronRight,
  List,
  Menu,
  ShieldCheck,
  Truck,
  Headset,
  Flame,
  ArrowRight,
  Sparkles,
  Store,
  MapPin,
  UserCheck,
  Phone,
  MessageCircle,
} from 'lucide-react';
import { HeroCarousel } from '../components/HeroCarousel';
import { CategoryIcon } from '../components/CategoryIcon';
import { ProductCard } from '../components/ProductCard';
import { IMG_GALAXY, IMG_IPHONE } from '../data/catalog';
import { CartItem, CategoryId, CategoryItem, HeroSlide, PageTab, Product, SiteSettings } from '../types';

interface HomeViewProps {
  products: Product[];
  categories: CategoryItem[];
  heroSlides: HeroSlide[];
  siteSettings: SiteSettings;
  wishlistIds: string[];
  cartItems: CartItem[];
  onNavigate: (page: PageTab, options?: { category?: CategoryId; moreSection?: string }) => void;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onUpdateCartQuantity: (productId: string, delta: number) => void;
  onOpenDetails: (product: Product) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  products,
  categories,
  heroSlides,
  siteSettings,
  wishlistIds,
  cartItems,
  onNavigate,
  onToggleWishlist,
  onAddToCart,
  onUpdateCartQuantity,
  onOpenDetails,
}) => {
  const popularProducts = products.filter((p) => p.isPopular).slice(0, 5);
  const newArrivals = products.filter((p) => p.isNewArrival).slice(0, 5);
  const iphoneProduct = products.find((p) => p.id === 'san-iphone-17') || products[2] || products[0];
  const galaxyProduct = products.find((p) => p.id === 'san-galaxy-s25') || products[3] || products[0];

  const getCartQty = (productId: string) =>
    cartItems
      .filter((i) => i.product.id === productId)
      .reduce((sum, i) => sum + i.quantity, 0);

  const waDigits = siteSettings.whatsapp.replace(/\D/g, '');
  const waHref = `https://wa.me/${waDigits.startsWith('88') ? waDigits : waDigits.startsWith('0') ? `88${waDigits}` : `880${waDigits}`}`;

  return (
    <div className="pb-4">
      {/* HERO CAROUSEL */}
      <HeroCarousel
        slides={heroSlides}
        onShopCategory={(cat) => onNavigate('category', { category: cat })}
      />

      {/* DESKTOP 8-CATEGORY FLOATING BAR (Real Device Photos inside Website Blue Frames) */}
      <div className="hidden lg:block max-w-[1440px] mx-auto px-6 mt-4 relative z-20">
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(15,23,42,0.08)] border border-slate-100 grid grid-cols-8 divide-x divide-slate-100 overflow-hidden">
          {categories.slice(0, 7).map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onNavigate('category', { category: cat.id })}
              className="py-3.5 px-2 flex flex-col items-center justify-center gap-2 hover:bg-sky-50/70 transition-colors group cursor-pointer"
            >
              <CategoryIcon
                id={cat.id}
                image={cat.image}
                size="lg"
                className="group-hover:scale-105 group-hover:border-[#0B84F3] transition-transform duration-150"
              />
              <span className="text-xs font-semibold text-slate-800 text-center leading-tight line-clamp-2 group-hover:text-[#0B84F3]">
                {cat.name}
              </span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => onNavigate('category', { category: 'all' })}
            className="py-3.5 px-2 flex flex-col items-center justify-center gap-2 hover:bg-sky-50/70 transition-colors group cursor-pointer"
          >
            <CategoryIcon
              id="more"
              size="lg"
              className="group-hover:scale-105 group-hover:border-[#0B84F3] transition-transform duration-150"
            />
            <span className="text-xs font-semibold text-slate-800 text-center leading-tight group-hover:text-[#0B84F3]">
              More Categories
            </span>
          </button>
        </div>
      </div>

      {/* MOBILE 2x4 CATEGORY GRID (Real Device Photos inside Website Blue Frames) */}
      <div className="lg:hidden px-3.5 pt-3.5">
        <div className="grid grid-cols-4 gap-2">
          {categories.slice(0, 7).map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onNavigate('category', { category: cat.id })}
              className="bg-white rounded-2xl py-2.5 px-1.5 shadow-[0_2px_8px_rgba(15,23,42,0.04)] border border-slate-100 flex flex-col items-center justify-start gap-1.5 active:scale-95 transition-transform"
            >
              <CategoryIcon id={cat.id} image={cat.image} size="md" />
              <span className="text-[11px] font-semibold text-slate-800 text-center leading-[1.2] line-clamp-2">
                {cat.shortName}
              </span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => onNavigate('category', { category: 'all' })}
            className="bg-white rounded-2xl py-2.5 px-1.5 shadow-[0_2px_8px_rgba(15,23,42,0.04)] border border-slate-100 flex flex-col items-center justify-start gap-1.5 active:scale-95 transition-transform"
          >
            <CategoryIcon id="more" size="md" />
            <span className="text-[11px] font-semibold text-slate-800 text-center leading-[1.2]">
              More
            </span>
          </button>
        </div>
      </div>

      {/* MAIN CONTENT SHELL */}
      <div className="max-w-[1440px] mx-auto px-3.5 sm:px-6 pt-4 lg:pt-6">
        <div className="flex flex-col lg:flex-row gap-5 items-start">
          {/* DESKTOP LEFT SIDEBAR: OUR CATEGORIES */}
          <aside className="hidden lg:block w-[250px] xl:w-[270px] shrink-0 bg-white rounded-2xl shadow-[0_2px_14px_rgba(15,23,42,0.05)] border border-slate-200/80 overflow-hidden">
            <div className="bg-[#0B84F3] text-white px-4 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2 font-display font-bold text-[15px]">
                <List className="w-4 h-4" />
                <span>Our Categories</span>
              </div>
              <Menu className="w-4 h-4 opacity-90" />
            </div>

            <div className="divide-y divide-slate-100">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onNavigate('category', { category: cat.id })}
                  className="w-full px-4 py-2.5 flex items-center justify-between text-left hover:bg-sky-50/70 transition-colors group cursor-pointer"
                >
                  <span className="flex items-center gap-3 text-[13px] font-medium text-slate-800 group-hover:text-[#0B84F3]">
                    <CategoryIcon id={cat.id} image={cat.image} size="sm" />
                    <span>{cat.name}</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0B84F3] group-hover:translate-x-0.5 transition-transform" />
                </button>
              ))}
            </div>
          </aside>

          {/* RIGHT MAIN AREA */}
          <div className="flex-1 min-w-0 w-full space-y-5">
            {/* PROMO BANNERS + 3 TRUST CARDS */}
            <div className="grid grid-cols-2 xl:grid-cols-12 gap-2.5 sm:gap-4 items-stretch">
              {/* iPhone 17 Banner */}
              <div className="col-span-1 xl:col-span-5 rounded-2xl overflow-hidden bg-gradient-to-br from-[#0b0a14] via-[#260b47] to-[#6b21a8] text-white p-3 sm:p-5 flex items-center justify-between gap-2 relative shadow-sm min-h-[128px] sm:min-h-[175px]">
                <div className="z-10 flex flex-col items-start justify-center max-w-[60%]">
                  <h2 className="font-display font-extrabold text-base sm:text-2xl lg:text-[26px] leading-tight">
                    iPhone 17
                  </h2>
                  <p className="text-[10px] sm:text-xs lg:text-sm text-purple-100/90 mt-0.5 sm:mt-1 leading-snug">
                    Bigger. Smarter. Stronger.
                  </p>
                  {iphoneProduct && (
                    <button
                      type="button"
                      onClick={() => onOpenDetails(iphoneProduct)}
                      className="mt-2.5 sm:mt-4 bg-[#0B84F3] hover:bg-[#1e95ff] text-white text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full inline-flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <span>Shop Now</span>
                      <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </button>
                  )}
                </div>
                <div className="w-[44%] sm:w-[40%] h-full flex items-center justify-end shrink-0">
                  <img
                    src={IMG_IPHONE}
                    alt="iPhone 17 Pro"
                    referrerPolicy="no-referrer"
                    className="w-20 h-24 sm:w-32 sm:h-36 object-cover rounded-xl shadow-lg"
                  />
                </div>
              </div>

              {/* Samsung Galaxy S25 Ultra Banner */}
              <div className="col-span-1 xl:col-span-5 rounded-2xl overflow-hidden bg-gradient-to-br from-[#051029] via-[#09296e] to-[#0b4bb3] text-white p-3 sm:p-5 flex items-center justify-between gap-2 relative shadow-sm min-h-[128px] sm:min-h-[175px]">
                <div className="z-10 flex flex-col items-start justify-center max-w-[62%]">
                  <p className="text-[9px] sm:text-xs font-bold uppercase tracking-[0.14em] text-sky-300">
                    SAMSUNG
                  </p>
                  <h2 className="font-display font-extrabold text-sm sm:text-xl lg:text-2xl leading-tight mt-0.5">
                    Galaxy S25 Ultra
                  </h2>
                  <p className="text-[10px] sm:text-xs lg:text-sm text-sky-100/90 mt-0.5 sm:mt-1 leading-snug">
                    Next Level Performance
                  </p>
                  {galaxyProduct && (
                    <button
                      type="button"
                      onClick={() => onOpenDetails(galaxyProduct)}
                      className="mt-2.5 sm:mt-4 bg-[#0B84F3] hover:bg-[#1e95ff] text-white text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full inline-flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <span>Shop Now</span>
                      <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </button>
                  )}
                </div>
                <div className="w-[42%] sm:w-[38%] h-full flex items-center justify-end shrink-0">
                  <img
                    src={IMG_GALAXY}
                    alt="Samsung Galaxy S25 Ultra"
                    referrerPolicy="no-referrer"
                    className="w-20 h-24 sm:w-32 sm:h-36 object-cover rounded-xl shadow-lg"
                  />
                </div>
              </div>

              {/* 3 Stacked Trust Cards */}
              <div className="hidden xl:flex xl:col-span-2 flex-col justify-between gap-2.5">
                <div className="bg-white rounded-xl border border-slate-200/80 px-3.5 py-2.5 flex items-center gap-2.5 shadow-xs flex-1">
                  <div className="w-8 h-8 rounded-lg bg-sky-50 text-[#0B84F3] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 leading-tight">
                    100% Secure Payment
                  </span>
                </div>

                <div className="bg-white rounded-xl border border-slate-200/80 px-3.5 py-2.5 flex items-center gap-2.5 shadow-xs flex-1">
                  <div className="w-8 h-8 rounded-lg bg-sky-50 text-[#0B84F3] flex items-center justify-center shrink-0">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div className="leading-tight">
                    <p className="text-xs font-bold text-slate-800">Fast Delivery</p>
                    <p className="text-[10px] text-slate-500">All Over Bangladesh</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200/80 px-3.5 py-2.5 flex items-center gap-2.5 shadow-xs flex-1">
                  <div className="w-8 h-8 rounded-lg bg-sky-50 text-[#0B84F3] flex items-center justify-center shrink-0">
                    <Headset className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 leading-tight">
                    24/7 Customer Support
                  </span>
                </div>
              </div>
            </div>

            {/* POPULAR PRODUCTS HEADER & GRID */}
            <section aria-labelledby="popular-products-heading" className="pt-1">
              <div className="flex items-center justify-between mb-3.5">
                <div className="hidden lg:inline-flex items-center gap-2 bg-[#0B84F3] text-white px-4 py-2 rounded-xl font-display font-bold text-sm shadow-xs">
                  <Flame className="w-4 h-4 fill-white" />
                  <h2 id="popular-products-heading">Popular Products</h2>
                </div>
                <div className="lg:hidden flex items-center gap-1.5">
                  <Flame className="w-5 h-5 text-[#EF233C] fill-[#EF233C]" />
                  <h2 className="font-display font-bold text-lg text-slate-900">
                    Popular Products
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigate('category', { category: 'all' })}
                  className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-slate-800 hover:text-[#0B84F3] transition-colors cursor-pointer"
                >
                  <span className="hidden sm:inline">View All Products</span>
                  <span className="sm:hidden">View All</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                {popularProducts.map((product) => (
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
            </section>

            {/* NEW ARRIVALS & SMART ACCESSORIES */}
            <section aria-labelledby="new-arrivals-heading" className="pt-3">
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#0B84F3]" />
                  <h2
                    id="new-arrivals-heading"
                    className="font-display font-bold text-lg sm:text-xl text-slate-900"
                  >
                    New Arrivals & Accessories
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigate('category', { category: 'charger-power-bank' })}
                  className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#0B84F3] hover:underline cursor-pointer"
                >
                  <span>Explore Accessories</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                {newArrivals.map((product) => (
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
            </section>

            {/* OFFICIAL SHOP DETAILS SECTION AT BOTTOM OF HOME PAGE */}
            <section
              aria-labelledby="shop-details-heading"
              className="pt-3"
            >
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_14px_rgba(15,23,42,0.04)] p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#0B84F3]">
                      Official Store Information
                    </p>
                    <h2
                      id="shop-details-heading"
                      className="font-display font-bold text-lg sm:text-xl text-slate-900 mt-0.5"
                    >
                      Visit & Contact {siteSettings.shopName}
                    </h2>
                  </div>

                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] text-white text-xs sm:text-sm font-bold shadow-xs transition-colors self-start sm:self-center"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp: {siteSettings.whatsapp}</span>
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5 pt-4">
                  <div className="rounded-xl bg-[#F8FAFC] border border-slate-100 p-3.5 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-sky-50 text-[#0B84F3] flex items-center justify-center shrink-0">
                      <Store className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                        Shop Name
                      </p>
                      <p className="text-sm font-bold text-slate-900 mt-0.5">
                        {siteSettings.shopName}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-[#F8FAFC] border border-slate-100 p-3.5 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-sky-50 text-[#0B84F3] flex items-center justify-center shrink-0">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                        Owner
                      </p>
                      <p className="text-sm font-bold text-slate-900 mt-0.5">
                        {siteSettings.ownerName}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-[#F8FAFC] border border-slate-100 p-3.5 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-sky-50 text-[#0B84F3] flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                        Location
                      </p>
                      <p className="text-sm font-bold text-slate-900 mt-0.5 leading-snug">
                        {siteSettings.location}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-[#F8FAFC] border border-slate-100 p-3.5 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-sky-50 text-[#0B84F3] flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                        Mobile
                      </p>
                      <a
                        href={`tel:${siteSettings.mobile}`}
                        className="text-sm font-bold text-[#0B84F3] hover:underline mt-0.5 block tabular-nums"
                      >
                        {siteSettings.mobile}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
