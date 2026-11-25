import React, { useState, useEffect } from 'react';
import { X, Heart, ShoppingCart, Star, ShieldCheck, Truck, Check, Plus, Minus } from 'lucide-react';
import { Product } from '../types';
import { formatBDT } from '../data/catalog';

interface ProductModalProps {
  product: Product | null;
  isWishlisted: boolean;
  onClose: () => void;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product, quantity: number, variant: string, color: string) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isWishlisted,
  onClose,
  onToggleWishlist,
  onAddToCart,
}) => {
  const [selectedVariant, setSelectedVariant] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      setSelectedVariant(product.variants[0] || 'Standard');
      setSelectedColor(product.colors[0]?.name || 'Default');
      setQuantity(1);
    }
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [product, onClose]);

  if (!product) return null;

  const savings = product.originalPrice - product.price;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
    >
      <div
        className="fixed inset-0 bg-slate-950/65 backdrop-blur-xs"
        onClick={onClose}
      />

      <div className="relative z-10 w-full sm:max-w-3xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close product details"
          className="absolute top-3.5 right-3.5 z-20 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 sm:p-7">
          {/* Left Image Panel */}
          <div className="bg-[#F8FAFC] rounded-2xl border border-slate-100 p-4 flex items-center justify-center relative aspect-square">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain rounded-xl"
            />
            {product.discountPercent > 0 && (
              <span className="absolute top-3 left-3 bg-[#EF233C] text-white text-xs font-bold px-3 py-1 rounded-full tabular-nums">
                -{product.discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Right Purchase & Specs Panel */}
          <div className="flex flex-col">
            <p className="text-xs font-semibold text-[#0B84F3] uppercase tracking-wider">
              {product.brand} · {product.categoryLabel}
            </p>
            <h2
              id="product-modal-title"
              className="mt-1 text-xl sm:text-2xl font-display font-bold text-slate-900 leading-tight pr-6"
            >
              {product.name}
            </h2>

            <div className="mt-2 flex items-center gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-slate-800 tabular-nums">{product.rating}</span>
                <span>({product.reviewCount} reviews)</span>
              </div>
              <span>·</span>
              <span className="text-emerald-600 font-semibold inline-flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> In Stock
              </span>
            </div>

            {/* Price */}
            <div className="mt-4 pb-4 border-b border-slate-100 flex items-baseline gap-3 flex-wrap tabular-nums">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#0B84F3]">
                {formatBDT(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-base text-slate-400 line-through">
                    {formatBDT(product.originalPrice)}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Save {formatBDT(savings)}
                  </span>
                </>
              )}
            </div>

            <p className="mt-3.5 text-sm text-slate-600 leading-relaxed">
              {product.description}
            </p>

            {/* Variants */}
            {product.variants.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2">
                  Edition / Storage
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant}
                      type="button"
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                        selectedVariant === variant
                          ? 'bg-[#0B84F3] text-white border-[#0B84F3]'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-[#0B84F3]'
                      }`}
                    >
                      {variant}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {product.colors.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2">
                  Color: <span className="text-[#0B84F3] normal-case">{selectedColor}</span>
                </p>
                <div className="flex items-center gap-2.5">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelectedColor(c.name)}
                      aria-label={`Select color ${c.name}`}
                      className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                        selectedColor === c.name
                          ? 'border-[#0B84F3] scale-110 ring-2 ring-[#0B84F3]/30'
                          : 'border-slate-300'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Key Specs */}
            <div className="mt-4 grid grid-cols-2 gap-2 bg-slate-50 rounded-2xl p-3 border border-slate-100">
              {product.specs.map((spec) => (
                <div key={spec.label}>
                  <p className="text-[10px] font-semibold uppercase text-slate-400">{spec.label}</p>
                  <p className="text-xs font-semibold text-slate-800 truncate">{spec.value}</p>
                </div>
              ))}
            </div>

            {/* Trust Lines */}
            <div className="mt-3.5 space-y-1 text-xs text-slate-600">
              <p className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#0B84F3]" />
                <span>Free Shipping All Over Bangladesh (24–72 Hours)</span>
              </p>
              <p className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0B84F3]" />
                <span>{product.warranty}</span>
              </p>
            </div>

            {/* Quantity & Action Buttons */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2.5">
              <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="w-8 h-8 rounded-lg bg-white text-slate-700 hover:text-[#0B84F3] flex items-center justify-center shadow-xs cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center text-sm font-bold text-slate-900 tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="w-8 h-8 rounded-lg bg-white text-slate-700 hover:text-[#0B84F3] flex items-center justify-center shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  onAddToCart(product, quantity, selectedVariant, selectedColor);
                  onClose();
                }}
                className="flex-1 h-11 rounded-xl bg-[#0B84F3] hover:bg-[#0669c7] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-[#0B84F3]/25 transition-colors cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                type="button"
                onClick={() => onToggleWishlist(product.id)}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-colors cursor-pointer ${
                  isWishlisted
                    ? 'bg-red-50 border-red-200 text-red-500'
                    : 'bg-white border-slate-200 text-slate-500 hover:text-red-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
