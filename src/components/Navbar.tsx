import React, { useState, useRef, useEffect } from 'react';
import {
  Truck,
  ShieldCheck,
  Headset,
  Home,
  ChevronDown,
  Search,
  User,
  Heart,
  ShoppingCart,
  Menu,
  X,
  ArrowRight,
  Crown,
  Megaphone,
} from 'lucide-react';
import { BrandLogo } from './Logo';
import { formatBDT } from '../data/catalog';
import { CategoryId, CategoryItem, PageTab, Product, SiteSettings } from '../types';
import { CategoryIcon } from './CategoryIcon';

interface NavbarProps {
  activePage: PageTab;
  products: Product[];
  categories: CategoryItem[];
  siteSettings: SiteSettings;
  onNavigate: (page: PageTab, options?: { category?: CategoryId; moreSection?: string }) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: (q: string) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  onSelectProduct: (product: Product) => void;
  onShowToast: (msg: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  products,
  categories,
  siteSettings,
  onNavigate,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenAdmin,
  onSelectProduct,
  onShowToast,
}) => {
  const [openDropdown, setOpenDropdown] = useState<'shop' | 'categories' | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const suggestions = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    onSearchSubmit(searchQuery);
  };

  return (
    <>
      {/* Live Admin Broadcast Banner (only shown if Admin broadcasts a notice) */}
      {siteSettings.broadcastNotice.trim() && (
        <div className="bg-[#0B84F3] text-white text-xs font-semibold py-1.5 px-4 flex items-center justify-center gap-2 text-center">
          <Megaphone className="w-3.5 h-3.5 shrink-0" />
          <span>{siteSettings.broadcastNotice}</span>
        </div>
      )}

      {/* DESKTOP TOP UTILITY BAR */}
      <div className="hidden lg:block bg-[#071126] text-slate-200 border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-6 h-9 flex items-center justify-between text-xs font-medium">
          <div className="flex items-center divide-x divide-white/20">
            <div className="flex items-center gap-2 pr-5">
              <Truck className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>{siteSettings.topNotice}</span>
            </div>
            <div className="flex items-center gap-2 px-5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>100% Secure Payment</span>
            </div>
            <div className="flex items-center gap-2 pl-5">
              <Headset className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>24/7 Customer Support · {siteSettings.mobile}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 hover:bg-[#0B84F3] text-white text-[11px] font-semibold transition-colors cursor-pointer"
            >
              <Crown className="w-3 h-3 text-amber-400" />
              <span>Admin Panel</span>
            </button>

            <div className="flex items-center gap-2 pl-2 border-l border-white/15">
              <button
                type="button"
                onClick={() => onShowToast(`Follow ${siteSettings.shopName} on Facebook!`)}
                aria-label="Facebook"
                className="w-5 h-5 rounded-full bg-white/10 hover:bg-[#0B84F3] flex items-center justify-center transition-colors text-[10px] font-bold cursor-pointer"
              >
                f
              </button>
              <button
                type="button"
                onClick={() => onShowToast(`Watch ${siteSettings.shopName} unboxings on YouTube!`)}
                aria-label="YouTube"
                className="w-5 h-5 rounded-full bg-white/10 hover:bg-red-600 flex items-center justify-center transition-colors text-[10px] font-bold cursor-pointer"
              >
                ▶
              </button>
              <button
                type="button"
                onClick={() => onShowToast(`Follow ${siteSettings.shopName} on TikTok!`)}
                aria-label="TikTok"
                className="w-5 h-5 rounded-full bg-white/10 hover:bg-[#0B84F3] flex items-center justify-center transition-colors text-[10px] font-bold cursor-pointer"
              >
                ♪
              </button>
              <button
                type="button"
                onClick={() => onShowToast(`Follow ${siteSettings.shopName} on Instagram!`)}
                aria-label="Instagram"
                className="w-5 h-5 rounded-full bg-white/10 hover:bg-pink-600 flex items-center justify-center transition-colors text-[10px] font-bold cursor-pointer"
              >
                ig
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP MAIN HEADER */}
      <header className="hidden lg:block sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
        <div
          ref={dropdownRef}
          className="max-w-[1440px] mx-auto px-6 h-[74px] flex items-center justify-between gap-6"
        >
          {/* Logo */}
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B84F3] rounded-lg py-1 cursor-pointer"
            aria-label={`${siteSettings.shopName} Home`}
          >
            <BrandLogo variant="light-bg" />
          </button>

          {/* Center Nav */}
          <nav className="flex items-center gap-2 xl:gap-4 text-[14px] font-semibold text-slate-700">
            <button
              type="button"
              onClick={() => {
                setOpenDropdown(null);
                onNavigate('home');
              }}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activePage === 'home'
                  ? 'bg-[#0B84F3] text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-[#0B84F3]'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>

            {/* Shop Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'shop' ? null : 'shop')}
                className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  openDropdown === 'shop'
                    ? 'text-[#0B84F3] bg-sky-50'
                    : 'hover:text-[#0B84F3] hover:bg-slate-50'
                }`}
              >
                <span>Shop</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-150 ${
                    openDropdown === 'shop' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openDropdown === 'shop' && (
                <div className="absolute left-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200/90 py-2 z-50">
                  <button
                    type="button"
                    onClick={() => {
                      setOpenDropdown(null);
                      onNavigate('category', { category: 'all' });
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-sky-50 hover:text-[#0B84F3] flex items-center justify-between cursor-pointer"
                  >
                    <span>All Products</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOpenDropdown(null);
                      onNavigate('category', { category: 'smartphones' });
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-sky-50 hover:text-[#0B84F3] cursor-pointer"
                  >
                    Flagship Smartphones
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOpenDropdown(null);
                      onNavigate('category', { category: 'headphones-earbuds' });
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-sky-50 hover:text-[#0B84F3] cursor-pointer"
                  >
                    Audio & ANC Gear
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOpenDropdown(null);
                      onNavigate('wishlist');
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-sky-50 hover:text-[#0B84F3] cursor-pointer"
                  >
                    Saved Wishlist ({wishlistCount})
                  </button>
                </div>
              )}
            </div>

            {/* Categories Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'categories' ? null : 'categories')}
                className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activePage === 'category' || openDropdown === 'categories'
                    ? 'text-[#0B84F3] bg-sky-50'
                    : 'hover:text-[#0B84F3] hover:bg-slate-50'
                }`}
              >
                <span>Categories</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-150 ${
                    openDropdown === 'categories' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openDropdown === 'categories' && (
                <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200/90 py-2 z-50">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setOpenDropdown(null);
                        onNavigate('category', { category: cat.id });
                      }}
                      className="w-full text-left px-4 py-2 text-sm font-medium text-slate-700 hover:bg-sky-50 hover:text-[#0B84F3] flex items-center gap-2.5 cursor-pointer"
                    >
                      <CategoryIcon id={cat.id} image={cat.image} size="xs" />
                      <span>{cat.name}</span>
                    </button>
                  ))}
                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setOpenDropdown(null);
                        onNavigate('category', { category: 'all' });
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-[#0B84F3] hover:bg-sky-50 cursor-pointer"
                    >
                      View All Categories →
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setOpenDropdown(null);
                onNavigate('more', { moreSection: 'about' });
              }}
              className="px-3 py-2 rounded-lg hover:text-[#0B84F3] hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              About Us
            </button>
            <button
              type="button"
              onClick={() => {
                setOpenDropdown(null);
                onNavigate('more', { moreSection: 'blog' });
              }}
              className="px-3 py-2 rounded-lg hover:text-[#0B84F3] hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Blog
            </button>
            <button
              type="button"
              onClick={() => {
                setOpenDropdown(null);
                onNavigate('more', { moreSection: 'contact' });
              }}
              className="px-3 py-2 rounded-lg hover:text-[#0B84F3] hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Contact
            </button>
          </nav>

          {/* Right Search + Actions */}
          <div className="flex items-center gap-3.5 shrink-0">
            <div ref={searchRef} className="relative">
              <form
                onSubmit={handleFormSubmit}
                className="flex items-center bg-slate-50 border border-slate-200 rounded-full pl-4 pr-1 py-1 w-64 xl:w-72 focus-within:border-[#0B84F3] focus-within:bg-white transition-colors"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onFocus={() => setShowSuggestions(true)}
                  onChange={(e) => {
                    onSearchChange(e.target.value);
                    setShowSuggestions(true);
                  }}
                  placeholder="Search for products..."
                  className="bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none w-full pr-2"
                />
                <button
                  type="submit"
                  aria-label="Search products"
                  className="w-8 h-8 rounded-full bg-[#0B84F3] hover:bg-[#0669c7] text-white flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>

              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                  {suggestions.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setShowSuggestions(false);
                        onSelectProduct(item);
                      }}
                      className="w-full px-3.5 py-2 flex items-center gap-3 hover:bg-slate-50 text-left cursor-pointer"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-800 truncate">{item.name}</p>
                        <p className="text-xs font-bold text-[#0B84F3] tabular-nums">
                          {formatBDT(item.price)}
                        </p>
                      </div>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setShowSuggestions(false);
                      onSearchSubmit(searchQuery);
                    }}
                    className="w-full text-center py-2 text-xs font-semibold text-[#0B84F3] border-t border-slate-100 hover:bg-sky-50 cursor-pointer"
                  >
                    See all results for "{searchQuery}"
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => onNavigate('more', { moreSection: 'orders' })}
              aria-label="Account and Orders"
              className="w-10 h-10 rounded-full hover:bg-slate-100 text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            >
              <User className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('wishlist')}
              aria-label="Wishlist"
              className="relative w-10 h-10 rounded-full hover:bg-slate-100 text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            >
              <Heart className="w-5 h-5 fill-slate-800" />
              <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                {wishlistCount}
              </span>
            </button>

            <button
              type="button"
              onClick={onOpenCart}
              aria-label="Shopping Cart"
              className="relative w-10 h-10 rounded-full hover:bg-slate-100 text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            >
              <ShoppingCart className="w-5 h-5 fill-slate-800" />
              <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE TOP HEADER */}
      <header className="lg:hidden sticky top-0 z-40 bg-[#071126] text-white shadow-md">
        <div className="px-3.5 pt-2.5 pb-2 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open Navigation Menu"
            className="min-w-[44px] min-h-[44px] -ml-1.5 flex items-center justify-center text-white rounded-lg active:bg-white/10"
          >
            <Menu className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="focus:outline-none"
            aria-label={`${siteSettings.shopName} Home`}
          >
            <BrandLogo variant="dark-bg" />
          </button>

          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={onOpenCart}
              aria-label="Open Cart"
              className="relative min-w-[44px] min-h-[44px] flex items-center justify-center text-white rounded-lg active:bg-white/10"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute top-1.5 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                {cartCount}
              </span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('more', { moreSection: 'orders' })}
              aria-label="Account"
              className="min-w-[40px] min-h-[44px] flex items-center justify-center text-white rounded-lg active:bg-white/10"
            >
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="px-3.5 pb-3">
          <form
            onSubmit={handleFormSubmit}
            className="bg-white rounded-full flex items-center pl-3.5 pr-1 py-1 shadow-sm"
          >
            <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search for products..."
              className="bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none w-full pr-2"
            />
            <button
              type="submit"
              aria-label="Search"
              className="w-8 h-8 rounded-full bg-[#0B84F3] text-white flex items-center justify-center shrink-0 active:scale-95 transition-transform"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      </header>

      {/* MOBILE SLIDE-OUT DRAWER MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[82vw] bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
            <div className="bg-[#071126] px-4 py-4 flex items-center justify-between">
              <BrandLogo variant="dark-bg" />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close Menu"
                className="w-9 h-9 rounded-lg bg-white/10 text-white flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-1">
              <p className="px-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Navigation
              </p>
              {(
                [
                  { id: 'home', label: 'Home' },
                  { id: 'category', label: 'All Categories' },
                  { id: 'search', label: 'Search Products' },
                  { id: 'wishlist', label: `Wishlist (${wishlistCount})` },
                  { id: 'more', label: 'More & Support' },
                ] as { id: PageTab; label: string }[]
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate(tab.id);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    activePage === tab.id
                      ? 'bg-[#0B84F3] text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full mt-2 text-left px-3 py-2.5 rounded-xl text-sm font-bold bg-[#1a0536] text-white flex items-center gap-2"
              >
                <Crown className="w-4 h-4 text-amber-400" />
                <span>Admin Panel (Shop Owner)</span>
              </button>
            </div>

            <div className="px-4 py-2 border-t border-slate-100">
              <p className="px-2 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Categories
              </p>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onNavigate('category', { category: cat.id });
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-sky-50 hover:text-[#0B84F3] flex items-center gap-2.5"
                  >
                    <CategoryIcon id={cat.id} image={cat.image} size="xs" />
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-auto p-4 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 space-y-1">
              <p className="font-bold text-slate-800">{siteSettings.shopName}</p>
              <p>{siteSettings.location}</p>
              <p>Owner: {siteSettings.ownerName} · {siteSettings.mobile}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
