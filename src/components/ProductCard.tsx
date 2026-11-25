import React from 'react';
import { Heart, ShoppingCart, Star, Plus, Minus } from 'lucide-react';
import { Product } from '../types';
import { formatBDT } from '../data/catalog';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  cartQuantity: number;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onUpdateCartQuantity: (productId: string, delta: number) => void;
  onOpenDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  cartQuantity,
  onToggleWishlist,
  onAddToCart,
  onUpdateCartQuantity,
  onOpenDetails,
}) => {
  return (
    <article className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_10px_rgba(15,23,42,0.03)] hover:shadow-[0_10px_28px_rgba(11,132,243,0.10)] hover:-translate-y-0.5 transition-all duration-150 flex flex-col overflow-hidden group">
      {/* Image Box */}
      <div className="relative bg-[#F8FAFC] aspect-square overflow-hidden">
        <button
          type="button"
          onClick={() => onOpenDetails(product)}
          className="w-full h-full block focus:outline-none cursor-pointer"
          aria-label={`View details for ${product.name}`}
        >
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </button>

        {/* Red Discount Badge (Top Right matching Reference 1 & 2) */}
        {product.discountPercent > 0 && (
          <span className="absolute top-2.5 right-2.5 bg-[#EF233C] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs tabular-nums pointer-events-none">
            -{product.discountPercent}%
          </span>
        )}

        {/* Wishlist Heart Toggle */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          className={`absolute top-2.5 left-2.5 w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-all cursor-pointer ${
            isWishlisted
              ? 'bg-red-50 text-red-500 border border-red-200'
              : 'bg-white/90 text-slate-400 hover:text-red-500 border border-slate-200/60'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-3 sm:p-3.5 flex-1 flex flex-col">
        <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide truncate">
          {product.brand} · {product.categoryLabel}
        </p>

        <button
          type="button"
          onClick={() => onOpenDetails(product)}
          className="text-left mt-1 focus:outline-none cursor-pointer"
        >
          <h3 className="text-[13px] sm:text-sm font-semibold text-slate-900 line-clamp-2 leading-snug group-hover:text-[#0B84F3] transition-colors">
            {product.name}
          </h3>
        </button>

        <div className="mt-1.5 flex items-center gap-1 text-xs text-slate-500">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
          <span className="font-semibold text-slate-700 tabular-nums">{product.rating.toFixed(1)}</span>
          <span className="text-slate-400 tabular-nums">({product.reviewCount})</span>
        </div>

        {/* Price Row */}
        <div className="mt-auto pt-2.5 flex items-baseline gap-2 flex-wrap tabular-nums">
          <span className="text-sm sm:text-base font-bold text-[#0B84F3]">
            {formatBDT(product.price)}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-[11px] sm:text-xs text-slate-400 line-through">
              {formatBDT(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Add to Cart or Live Quantity Stepper */}
        <div className="mt-2.5">
          {cartQuantity > 0 ? (
            <div className="flex items-center justify-between bg-sky-50 border border-[#0B84F3]/30 rounded-xl p-1">
              <button
                type="button"
                onClick={() => onUpdateCartQuantity(product.id, -1)}
                aria-label="Decrease quantity"
                className="w-8 h-8 rounded-lg bg-white text-[#0B84F3] hover:bg-[#0B84F3] hover:text-white flex items-center justify-center shadow-xs transition-colors cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs sm:text-sm font-bold text-[#0B84F3] tabular-nums">
                {cartQuantity} in Cart
              </span>
              <button
                type="button"
                onClick={() => onUpdateCartQuantity(product.id, 1)}
                aria-label="Increase quantity"
                className="w-8 h-8 rounded-lg bg-[#0B84F3] text-white hover:bg-[#0669c7] flex items-center justify-center shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onAddToCart(product)}
              className="w-full py-2 px-3 rounded-xl bg-[#0B84F3] hover:bg-[#0669c7] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors active:scale-[0.98] cursor-pointer whitespace-nowrap"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
