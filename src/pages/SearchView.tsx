import React from 'react';
import { Search, X, TrendingUp } from 'lucide-react';
import { CartItem, Product } from '../types';
import { ProductCard } from '../components/ProductCard';

interface SearchViewProps {
  products: Product[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  wishlistIds: string[];
  cartItems: CartItem[];
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onUpdateCartQuantity: (productId: string, delta: number) => void;
  onOpenDetails: (product: Product) => void;
}

const TRENDING_TERMS = [
  'iPhone 17',
  'Galaxy S25 Ultra',
  'Earbuds',
  'Smart Watch',
  '65W GaN',
  'Speaker',
  'Gaming',
];

export const SearchView: React.FC<SearchViewProps> = ({
  products,
  searchQuery,
  onSearchChange,
  wishlistIds,
  cartItems,
  onToggleWishlist,
  onAddToCart,
  onUpdateCartQuantity,
  onOpenDetails,
}) => {
  const query = searchQuery.trim().toLowerCase();
  const results = query
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.categoryLabel.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      )
    : products;

  const getCartQty = (productId: string) =>
    cartItems
      .filter((i) => i.product.id === productId)
      .reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="max-w-[1440px] mx-auto px-3.5 sm:px-6 py-5 space-y-5">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-6 shadow-xs space-y-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-slate-900">
            Search Products
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Find smartphones, audio accessories, chargers, and gaming gear instantly.
          </p>
        </div>

        <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus-within:border-[#0B84F3] focus-within:bg-white transition-colors">
          <Search className="w-5 h-5 text-[#0B84F3] mr-2.5 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by product name, brand, or feature (e.g. iPhone, ANC, GaN)..."
            className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
              className="p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 mr-1">
            <TrendingUp className="w-3.5 h-3.5 text-[#0B84F3]" />
            Popular:
          </span>
          {TRENDING_TERMS.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => onSearchChange(term)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                searchQuery.toLowerCase() === term.toLowerCase()
                  ? 'bg-[#0B84F3] text-white border-[#0B84F3]'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-[#0B84F3]'
              }`}
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {results.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-3">
          <Search className="w-10 h-10 text-slate-300 mx-auto" />
          <h2 className="text-lg font-display font-bold text-slate-900">
            No matches for "{searchQuery}"
          </h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Try searching for "iPhone", "Galaxy", "Earbuds", "Watch", or clear your filter to browse all devices.
          </p>
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="px-5 py-2 rounded-xl bg-[#0B84F3] text-white text-sm font-semibold hover:bg-[#0669c7] cursor-pointer"
          >
            Show All Products
          </button>
        </div>
      ) : (
        <div>
          <p className="text-xs sm:text-sm font-semibold text-slate-600 mb-3 tabular-nums">
            {query ? `Found ${results.length} results for "${searchQuery}"` : `All ${results.length} products`}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {results.map((product) => (
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
      )}
    </div>
  );
};
