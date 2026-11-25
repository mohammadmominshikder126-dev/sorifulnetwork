import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, Truck, CheckCircle2, ArrowLeft } from 'lucide-react';
import { CartItem, Order } from '../types';
import { formatBDT } from '../data/catalog';

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (productId: string, delta: number, variant?: string, color?: string) => void;
  onRemoveItem: (productId: string, variant: string, color: string) => void;
  onPlaceOrder: (order: Omit<Order, 'id' | 'date' | 'status'>) => Order;
  onBrowseShop: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  items,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder,
  onBrowseShop,
}) => {
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      setErrorMsg('Please fill in your name, mobile number, and delivery address.');
      return;
    }
    setErrorMsg('');
    const order = onPlaceOrder({
      customerName: customerName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      paymentMethod,
      items: items.map((i) => ({
        productId: i.product.id,
        name: i.product.name,
        quantity: i.quantity,
        price: i.product.price,
        variant: i.selectedVariant,
        color: i.selectedColor,
      })),
      total: subtotal,
    });
    setConfirmedOrder(order);
    setStep('success');
  };

  const resetAndClose = () => {
    setStep('cart');
    setConfirmedOrder(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Shopping Cart">
      <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" onClick={resetAndClose} />

      <div className="relative z-10 w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-[#071126] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {step === 'checkout' && (
              <button
                type="button"
                onClick={() => setStep('cart')}
                aria-label="Back to cart"
                className="p-1.5 rounded-lg hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <ShoppingBag className="w-5 h-5 text-[#38bdf8]" />
            <h2 className="font-display font-bold text-lg">
              {step === 'cart' && `Shopping Cart (${totalCount})`}
              {step === 'checkout' && 'Delivery & Checkout'}
              {step === 'success' && 'Order Confirmed'}
            </h2>
          </div>
          <button
            type="button"
            onClick={resetAndClose}
            aria-label="Close Cart"
            className="w-9 h-9 rounded-lg hover:bg-white/10 flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {step === 'success' && confirmedOrder ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  Thank You, {confirmedOrder.customerName}
                </p>
                <h3 className="text-xl font-display font-bold text-slate-900 mt-1">
                  Order #{confirmedOrder.id} Confirmed
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Preparing shipment to {confirmedOrder.address}
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 text-left border border-slate-200/80 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Method</span>
                  <span className="font-semibold text-slate-800">{confirmedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Contact Phone</span>
                  <span className="font-semibold text-slate-800 tabular-nums">{confirmedOrder.phone}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 text-sm">
                  <span className="font-bold text-slate-900">Total Payable</span>
                  <span className="font-extrabold text-[#0B84F3] tabular-nums">
                    {formatBDT(confirmedOrder.total)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={resetAndClose}
                className="w-full py-3 rounded-xl bg-[#0B84F3] hover:bg-[#0669c7] text-white font-semibold text-sm cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
              <div className="w-16 h-16 rounded-full bg-sky-50 text-[#0B84F3] flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-display font-bold text-slate-900">Your cart is empty</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-xs">
                Explore flagship smartphones, wireless earbuds, and fast chargers with free shipping across Bangladesh.
              </p>
              <button
                type="button"
                onClick={() => {
                  resetAndClose();
                  onBrowseShop();
                }}
                className="mt-5 px-6 py-2.5 rounded-xl bg-[#0B84F3] text-white text-sm font-semibold hover:bg-[#0669c7] cursor-pointer"
              >
                Browse Products
              </button>
            </div>
          ) : step === 'cart' ? (
            <div className="space-y-3.5">
              <div className="bg-sky-50 border border-sky-200/70 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 text-xs font-medium text-sky-900">
                <Truck className="w-4 h-4 text-[#0B84F3] shrink-0" />
                <span>Free Express Delivery unlocked across all 64 districts!</span>
              </div>

              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedVariant}-${item.selectedColor}`}
                  className="bg-white border border-slate-200/90 rounded-2xl p-3 flex gap-3 items-center"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-xl object-cover bg-slate-50 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-slate-900 truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate">
                      {item.selectedVariant} · {item.selectedColor}
                    </p>
                    <p className="text-sm font-bold text-[#0B84F3] mt-1 tabular-nums">
                      {formatBDT(item.product.price * item.quantity)}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        onRemoveItem(item.product.id, item.selectedVariant, item.selectedColor)
                      }
                      aria-label={`Remove ${item.product.name}`}
                      className="text-slate-400 hover:text-red-500 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateQuantity(
                            item.product.id,
                            -1,
                            item.selectedVariant,
                            item.selectedColor
                          )
                        }
                        aria-label="Decrease quantity"
                        className="w-7 h-7 flex items-center justify-center text-slate-700 hover:text-[#0B84F3] cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateQuantity(
                            item.product.id,
                            1,
                            item.selectedVariant,
                            item.selectedColor
                          )
                        }
                        aria-label="Increase quantity"
                        className="w-7 h-7 flex items-center justify-center text-slate-700 hover:text-[#0B84F3] cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-700">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Tariqul Islam"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0B84F3]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+880 17XX-XXXXXX"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0B84F3]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Delivery Address (District & Area)
                </label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House, Road, Area, District (e.g. Dhanmondi, Dhaka)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0B84F3]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Cash on Delivery', 'bKash / Nagad', 'Visa / Mastercard', 'EMI Installment'].map(
                    (method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`px-3 py-2.5 rounded-xl text-xs font-semibold border text-left transition-colors cursor-pointer ${
                          paymentMethod === method
                            ? 'bg-sky-50 border-[#0B84F3] text-[#0B84F3]'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {method}
                      </button>
                    )
                  )}
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer Summary */}
        {items.length > 0 && step !== 'success' && (
          <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 space-y-3">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold tabular-nums">{formatBDT(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery All Over Bangladesh</span>
                <span className="font-semibold text-emerald-600">FREE</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-1.5 border-t border-slate-200">
                <span>Total</span>
                <span className="text-[#0B84F3] tabular-nums">{formatBDT(subtotal)}</span>
              </div>
            </div>

            {step === 'cart' ? (
              <button
                type="button"
                onClick={() => setStep('checkout')}
                className="w-full py-3 rounded-xl bg-[#0B84F3] hover:bg-[#0669c7] text-white font-semibold text-sm shadow-md shadow-[#0B84F3]/25 transition-colors cursor-pointer"
              >
                Proceed to Checkout
              </button>
            ) : (
              <button
                type="submit"
                form="checkout-form"
                className="w-full py-3 rounded-xl bg-[#0B84F3] hover:bg-[#0669c7] text-white font-semibold text-sm shadow-md shadow-[#0B84F3]/25 transition-colors cursor-pointer"
              >
                Confirm Order ({formatBDT(subtotal)})
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
