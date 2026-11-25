import React from 'react';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { formatBDT } from '../data/catalog';
import { CartItem, Product } from '../types';

interface WishlistViewProps {
  products: Product[];
  wishlistIds: string[];
  cartItems: CartItem[];
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onOpenDetails: (product: Product) => void;
  onBrowseShop: () => void;
}

export const WishlistView: React.FC<WishlistViewProps> = ({
  products,
  wishlistIds,
  onToggleWishlist,
  onAddToCart,
  onOpenDetails,
  onBrowseShop,
}) => {
  const savedProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="max-w-[1440px] mx-auto px-3.5 sm:px-6 py-5 space-y-5">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
            <Heart className="w-5 h-5 fill-red-500" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-display font-bold text-slate-900">
              My Wishlist
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 tabular-nums">
              {savedProducts.length} saved {savedProducts.length === 1 ? 'item' : 'items'}
            </p>
          </div>
        </div>

        {savedProducts.length > 0 && (
          <button
            type="button"
            onClick={() => savedProducts.forEach((p) => onAddToCart(p))}
            className="px-4 py-2 rounded-xl bg-[#0B84F3] hover:bg-[#0669c7] text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add All to Cart</span>
          </button>
        )}
      </div>

      {savedProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-10 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-display font-bold text-slate-900">
            Your wishlist is empty
          </h2>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Tap the heart icon on any smartphone or accessory to save it for later.
          </p>
          <button
            type="button"
            onClick={onBrowseShop}
            className="mt-2 px-6 py-2.5 rounded-xl bg-[#0B84F3] text-white text-sm font-semibold hover:bg-[#0669c7] cursor-pointer"
          >
            Discover Popular Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {savedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-4 flex gap-3.5 items-center shadow-xs"
            >
              <button
                type="button"
                onClick={() => onOpenDetails(product)}
                className="w-24 h-24 rounded-xl bg-[#F8FAFC] overflow-hidden shrink-0 cursor-pointer"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </button>

              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium text-slate-400 uppercase">
                  {product.categoryLabel}
                </p>
                <button
                  type="button"
                  onClick={() => onOpenDetails(product)}
                  className="text-left text-sm font-semibold text-slate-900 hover:text-[#0B84F3] line-clamp-2 leading-snug mt-0.5 cursor-pointer"
                >
                  {product.name}
                </button>
                <div className="mt-1 flex items-baseline gap-2 tabular-nums">
                  <span className="text-base font-bold text-[#0B84F3]">
                    {formatBDT(product.price)}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-xs text-slate-400 line-through">
                      {formatBDT(product.originalPrice)}
                    </span>
                  )}
                </div>

                <div className="mt-2.5 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onAddToCart(product)}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-[#0B84F3] hover:bg-[#0669c7] text-white text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Move to Cart</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleWishlist(product.id)}
                    aria-label={`Remove ${product.name} from wishlist`}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
