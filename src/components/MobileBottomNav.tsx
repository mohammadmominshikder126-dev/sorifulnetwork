import React from 'react';
import { Home, LayoutGrid, Search, Heart, MoreHorizontal } from 'lucide-react';
import { PageTab } from '../types';

interface MobileBottomNavProps {
  activePage: PageTab;
  wishlistCount: number;
  onNavigate: (page: PageTab) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activePage,
  wishlistCount,
  onNavigate,
}) => {
  const tabs: { id: PageTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'category', label: 'Category', icon: <LayoutGrid className="w-5 h-5" /> },
    { id: 'search', label: 'Search', icon: <Search className="w-5 h-5" /> },
    { id: 'wishlist', label: 'Wishlist', icon: <Heart className="w-5 h-5" /> },
    { id: 'more', label: 'More', icon: <MoreHorizontal className="w-5 h-5" /> },
  ];

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_20px_rgba(15,23,42,0.06)]"
    >
      <div className="grid grid-cols-5 h-[62px] max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = activePage === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onNavigate(tab.id)}
              className={`relative flex flex-col items-center justify-center gap-0.5 min-h-[44px] transition-colors ${
                isActive ? 'text-[#0B84F3]' : 'text-slate-700 hover:text-[#0B84F3]'
              }`}
            >
              <div className="relative">
                {tab.id === 'home' && isActive ? (
                  <Home className="w-5 h-5 fill-[#0B84F3] text-[#0B84F3]" />
                ) : (
                  tab.icon
                )}
                {tab.id === 'wishlist' && wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-[16px] px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center tabular-nums">
                    {wishlistCount}
                  </span>
                )}
              </div>
              <span className={`text-[11px] leading-tight ${isActive ? 'font-bold' : 'font-medium'}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-8 h-[3px] rounded-full bg-[#0B84F3]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
