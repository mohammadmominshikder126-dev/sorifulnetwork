import React from 'react';
import { Truck, ShieldCheck, Headset, MapPin, User } from 'lucide-react';
import { BrandLogo } from './Logo';
import { CategoryId, CategoryItem, PageTab, SiteSettings } from '../types';

interface FooterProps {
  categories: CategoryItem[];
  siteSettings: SiteSettings;
  onNavigate: (page: PageTab, options?: { category?: CategoryId; moreSection?: string }) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  categories,
  siteSettings,
  onNavigate,
  onOpenAdmin,
}) => {
  return (
    <footer className="bg-[#071126] text-slate-300 mt-10 pb-20 lg:pb-8 border-t border-white/10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand Column */}
        <div className="space-y-3">
          <BrandLogo variant="dark-bg" />
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xs">
            {siteSettings.shopName} — Mobile, Accessories & Smart Lifestyle. Official smartphones, audio, smart watches & rapid chargers across Bangladesh.
          </p>
          <div className="flex items-start gap-2 text-xs text-sky-300 pt-1">
            <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{siteSettings.location}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <User className="w-4 h-4 text-[#38bdf8] shrink-0" />
            <span>Owner: {siteSettings.ownerName}</span>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-sm font-display font-bold text-white mb-3">Categories</h3>
          <ul className="space-y-2 text-xs sm:text-sm">
            {categories.slice(0, 5).map((cat) => (
              <li key={cat.id}>
                <button
                  type="button"
                  onClick={() => onNavigate('category', { category: cat.id })}
                  className="hover:text-[#38bdf8] transition-colors cursor-pointer"
                >
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-sm font-display font-bold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2 text-xs sm:text-sm">
            <li>
              <button
                type="button"
                onClick={() => onNavigate('home')}
                className="hover:text-[#38bdf8] transition-colors cursor-pointer"
              >
                Home
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onNavigate('wishlist')}
                className="hover:text-[#38bdf8] transition-colors cursor-pointer"
              >
                My Wishlist
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onNavigate('more', { moreSection: 'orders' })}
                className="hover:text-[#38bdf8] transition-colors cursor-pointer"
              >
                Track Orders
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onNavigate('more', { moreSection: 'contact' })}
                className="hover:text-[#38bdf8] transition-colors cursor-pointer"
              >
                Contact Support
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={onOpenAdmin}
                className="text-sky-400 hover:text-[#38bdf8] font-semibold transition-colors cursor-pointer"
              >
                Admin Panel
              </button>
            </li>
          </ul>
        </div>

        {/* Promises */}
        <div className="space-y-3">
          <h3 className="text-sm font-display font-bold text-white mb-3">Customer Promise</h3>
          <div className="flex items-center gap-2.5 text-xs">
            <Truck className="w-4 h-4 text-[#38bdf8] shrink-0" />
            <span>{siteSettings.topNotice}</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs">
            <ShieldCheck className="w-4 h-4 text-[#38bdf8] shrink-0" />
            <span>100% Secure Payment & COD</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs">
            <Headset className="w-4 h-4 text-[#38bdf8] shrink-0" />
            <span>Mobile / WhatsApp: {siteSettings.mobile}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} {siteSettings.shopName}. Owner: {siteSettings.ownerName}.</p>
          <p>{siteSettings.tagline}</p>
        </div>
      </div>
    </footer>
  );
};
