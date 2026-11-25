import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { HomeView } from './pages/HomeView';
import { CategoryView } from './pages/CategoryView';
import { SearchView } from './pages/SearchView';
import { WishlistView } from './pages/WishlistView';
import { MoreView } from './pages/MoreView';
import { AdminPanel } from './pages/AdminPanel';
import {
  CATEGORIES,
  DEFAULT_SITE_SETTINGS,
  HERO_SLIDES,
  INITIAL_ORDERS,
  PRODUCTS,
} from './data/catalog';
import {
  CartItem,
  CategoryId,
  CategoryItem,
  HeroSlide,
  Order,
  PageTab,
  Product,
  SiteSettings,
} from './types';

const PAGE_ORDER: PageTab[] = ['home', 'category', 'search', 'wishlist', 'more'];

const KEYS = {
  cart: 'sa_network_cart_v1',
  wishlist: 'sa_network_wishlist_v1',
  orders: 'sa_network_orders_v2',
  products: 'sa_network_products_v2',
  categories: 'sa_network_categories_v2',
  slides: 'sa_network_slides_v3',
  settings: 'sa_network_settings_v2',
};

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw !== null) return JSON.parse(raw) as T;
  } catch {
    // ignore storage errors
  }
  return fallback;
}

function getInitialCart(): CartItem[] {
  return readStorage<CartItem[]>(KEYS.cart, [
    {
      product: PRODUCTS[0],
      quantity: 1,
      selectedVariant: PRODUCTS[0].variants[0],
      selectedColor: PRODUCTS[0].colors[0].name,
    },
    {
      product: PRODUCTS[1],
      quantity: 1,
      selectedVariant: PRODUCTS[1].variants[0],
      selectedColor: PRODUCTS[1].colors[0].name,
    },
  ]);
}

export default function App() {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [activePage, setActivePage] = useState<PageTab>('home');
  const [swipeDir, setSwipeDir] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [moreSection, setMoreSection] = useState<string>('orders');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [products, setProducts] = useState<Product[]>(() => readStorage(KEYS.products, PRODUCTS));
  const [categories, setCategories] = useState<CategoryItem[]>(() =>
    readStorage(KEYS.categories, CATEGORIES)
  );
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(() =>
    readStorage(KEYS.slides, HERO_SLIDES)
  );
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() =>
    readStorage(KEYS.settings, DEFAULT_SITE_SETTINGS)
  );
  const [orders, setOrders] = useState<Order[]>(() => readStorage(KEYS.orders, INITIAL_ORDERS));

  const [cartItems, setCartItems] = useState<CartItem[]>(getInitialCart);
  const [wishlistIds, setWishlistIds] = useState<string[]>(() =>
    readStorage(KEYS.wishlist, ['san-iphone-17'])
  );

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // 120Hz live finger-tracking drag offset
  const [touchDragX, setTouchDragX] = useState(0);
  const touchStartRef = useRef<{ x: number; y: number; ignored: boolean; lockedAxis: 'x' | 'y' | null } | null>(null);
  const rafRef = useRef<number | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(KEYS.cart, JSON.stringify(cartItems));
    } catch {
      // ignore
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem(KEYS.wishlist, JSON.stringify(wishlistIds));
    } catch {
      // ignore
    }
  }, [wishlistIds]);

  useEffect(() => {
    try {
      localStorage.setItem(KEYS.orders, JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(KEYS.products, JSON.stringify(products));
    } catch {
      // ignore
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(KEYS.categories, JSON.stringify(categories));
    } catch {
      // ignore
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem(KEYS.slides, JSON.stringify(heroSlides));
    } catch {
      // ignore
    }
  }, [heroSlides]);

  useEffect(() => {
    try {
      localStorage.setItem(KEYS.settings, JSON.stringify(siteSettings));
    } catch {
      // ignore
    }
  }, [siteSettings]);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => {
      setToastMsg(null);
    }, 2400);
  }, []);

  const navigateTo = useCallback(
    (page: PageTab, options?: { category?: CategoryId; moreSection?: string }) => {
      const currIdx = PAGE_ORDER.indexOf(activePage);
      const nextIdx = PAGE_ORDER.indexOf(page);
      setSwipeDir(nextIdx >= currIdx ? 1 : -1);
      if (options?.category !== undefined) {
        setSelectedCategory(options.category);
      }
      if (options?.moreSection !== undefined) {
        setMoreSection(options.moreSection);
      }
      setActivePage(page);
      window.scrollTo({ top: 0, behavior: 'auto' });
    },
    [activePage]
  );

  const handleToggleWishlist = useCallback(
    (productId: string) => {
      setWishlistIds((prev) => {
        const exists = prev.includes(productId);
        const prod = products.find((p) => p.id === productId);
        if (exists) {
          showToast(`${prod?.name ?? 'Item'} removed from Wishlist`);
          return prev.filter((id) => id !== productId);
        } else {
          showToast(`${prod?.name ?? 'Item'} added to Wishlist`);
          return [...prev, productId];
        }
      });
    },
    [products, showToast]
  );

  const handleAddToCart = useCallback(
    (product: Product, quantity = 1, variant?: string, color?: string) => {
      const chosenVariant = variant || product.variants[0] || 'Standard';
      const chosenColor = color || product.colors[0]?.name || 'Default';
      setCartItems((prev) => {
        const existingIdx = prev.findIndex(
          (i) =>
            i.product.id === product.id &&
            i.selectedVariant === chosenVariant &&
            i.selectedColor === chosenColor
        );
        if (existingIdx > -1) {
          const updated = [...prev];
          updated[existingIdx] = {
            ...updated[existingIdx],
            quantity: updated[existingIdx].quantity + quantity,
          };
          return updated;
        }
        return [
          ...prev,
          {
            product,
            quantity,
            selectedVariant: chosenVariant,
            selectedColor: chosenColor,
          },
        ];
      });
      showToast(`Added ${product.name} to Cart`);
    },
    [showToast]
  );

  const handleUpdateCartQuantity = useCallback(
    (productId: string, delta: number, variant?: string, color?: string) => {
      setCartItems((prev) =>
        prev
          .map((item) => {
            const match =
              item.product.id === productId &&
              (!variant || item.selectedVariant === variant) &&
              (!color || item.selectedColor === color);
            if (!match) return item;
            return { ...item, quantity: item.quantity + delta };
          })
          .filter((item) => item.quantity > 0)
      );
    },
    []
  );

  const handleRemoveCartItem = useCallback(
    (productId: string, variant: string, color: string) => {
      setCartItems((prev) =>
        prev.filter(
          (i) =>
            !(
              i.product.id === productId &&
              i.selectedVariant === variant &&
              i.selectedColor === color
            )
        )
      );
      showToast('Item removed from Cart');
    },
    [showToast]
  );

  const handlePlaceOrder = useCallback(
    (orderData: Omit<Order, 'id' | 'date' | 'status'>): Order => {
      const newOrder: Order = {
        ...orderData,
        id: `${Math.floor(1004 + Math.random() * 8995)}`,
        date: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        status: 'Confirmed',
      };
      setOrders((prev) => [newOrder, ...prev]);
      setCartItems([]);
      showToast(`Order #${newOrder.id} confirmed!`);
      return newOrder;
    },
    [showToast]
  );

  const handleResetAll = useCallback(() => {
    setProducts(PRODUCTS);
    setCategories(CATEGORIES);
    setHeroSlides(HERO_SLIDES);
    setSiteSettings(DEFAULT_SITE_SETTINGS);
    setOrders(INITIAL_ORDERS);
    showToast('সকল সেটিংস ও পণ্য ডিফল্ট অবস্থায় রিসেট হয়েছে।');
  }, [showToast]);

  // 120Hz Real-Time Finger-Tracking Horizontal Page Swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    if (selectedProduct || isCartOpen) return;
    const target = e.target as HTMLElement;
    const isInsideHorizontalScroller = Boolean(target.closest('.overflow-x-auto'));
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      ignored: isInsideHorizontalScroller,
      lockedAxis: null,
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const state = touchStartRef.current;
    if (!state || state.ignored) return;

    const dx = e.touches[0].clientX - state.x;
    const dy = e.touches[0].clientY - state.y;

    if (!state.lockedAxis) {
      if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy) * 1.25) {
        state.lockedAxis = 'x';
      } else if (Math.abs(dy) > 10) {
        state.lockedAxis = 'y';
      }
    }

    if (state.lockedAxis === 'x') {
      const currentIdx = PAGE_ORDER.indexOf(activePage);
      // Add elastic resistance at edges
      const atLeftEdge = currentIdx === 0 && dx > 0;
      const atRightEdge = currentIdx === PAGE_ORDER.length - 1 && dx < 0;
      const dampedDx = atLeftEdge || atRightEdge ? dx * 0.22 : dx * 0.45;

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setTouchDragX(dampedDx);
      });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const state = touchStartRef.current;
    setTouchDragX(0);
    touchStartRef.current = null;

    if (!state || state.ignored || state.lockedAxis === 'y') return;

    const dx = e.changedTouches[0].clientX - state.x;
    const dy = e.changedTouches[0].clientY - state.y;

    if (Math.abs(dx) > 46 && Math.abs(dx) > Math.abs(dy) * 1.25) {
      const currentIdx = PAGE_ORDER.indexOf(activePage);
      if (dx < 0 && currentIdx < PAGE_ORDER.length - 1) {
        navigateTo(PAGE_ORDER[currentIdx + 1]);
      } else if (dx > 0 && currentIdx > 0) {
        navigateTo(PAGE_ORDER[currentIdx - 1]);
      }
    }
  };

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  if (isAdminMode) {
    return (
      <>
        <AdminPanel
          products={products}
          categories={categories}
          heroSlides={heroSlides}
          orders={orders}
          siteSettings={siteSettings}
          onUpdateProducts={setProducts}
          onUpdateCategories={setCategories}
          onUpdateHeroSlides={setHeroSlides}
          onUpdateOrders={setOrders}
          onUpdateSiteSettings={setSiteSettings}
          onResetAll={handleResetAll}
          onExitAdmin={() => setIsAdminMode(false)}
          onShowToast={showToast}
        />
        <AnimatePresence>
          {toastMsg && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.12 }}
              className="fixed bottom-6 right-6 z-50 pointer-events-none"
            >
              <div className="bg-[#1a0536] text-white px-4 py-2.5 rounded-xl shadow-xl border border-purple-400/30 flex items-center gap-2 text-xs sm:text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{toastMsg}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7FB] text-slate-900">
      <Navbar
        activePage={activePage}
        products={products}
        categories={categories}
        siteSettings={siteSettings}
        onNavigate={navigateTo}
        searchQuery={searchQuery}
        onSearchChange={(q) => setSearchQuery(q)}
        onSearchSubmit={(q) => {
          setSearchQuery(q);
          navigateTo('search');
        }}
        cartCount={cartCount}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={() => setIsAdminMode(true)}
        onSelectProduct={(p) => setSelectedProduct(p)}
        onShowToast={showToast}
      />

      {/* 120Hz High-Refresh Swipeable Page Canvas (zero exit blocking) */}
      <main
        className="flex-1 overflow-x-hidden swipe-surface"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="gpu-slide-track"
          style={{
            transform: touchDragX ? `translate3d(${touchDragX}px, 0, 0)` : 'translate3d(0, 0, 0)',
          }}
        >
          <motion.div
            key={activePage}
            initial={{ opacity: 0.88, x: swipeDir * 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              type: 'spring',
              stiffness: 620,
              damping: 42,
              mass: 0.45,
            }}
            className="gpu-slide-track"
          >
            {activePage === 'home' && (
              <HomeView
                products={products}
                categories={categories}
                heroSlides={heroSlides}
                siteSettings={siteSettings}
                wishlistIds={wishlistIds}
                cartItems={cartItems}
                onNavigate={navigateTo}
                onToggleWishlist={handleToggleWishlist}
                onAddToCart={(p) => handleAddToCart(p)}
                onUpdateCartQuantity={(id, delta) => handleUpdateCartQuantity(id, delta)}
                onOpenDetails={(p) => setSelectedProduct(p)}
              />
            )}

            {activePage === 'category' && (
              <CategoryView
                products={products}
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={(cat) => setSelectedCategory(cat)}
                wishlistIds={wishlistIds}
                cartItems={cartItems}
                onToggleWishlist={handleToggleWishlist}
                onAddToCart={(p) => handleAddToCart(p)}
                onUpdateCartQuantity={(id, delta) => handleUpdateCartQuantity(id, delta)}
                onOpenDetails={(p) => setSelectedProduct(p)}
              />
            )}

            {activePage === 'search' && (
              <SearchView
                products={products}
                searchQuery={searchQuery}
                onSearchChange={(q) => setSearchQuery(q)}
                wishlistIds={wishlistIds}
                cartItems={cartItems}
                onToggleWishlist={handleToggleWishlist}
                onAddToCart={(p) => handleAddToCart(p)}
                onUpdateCartQuantity={(id, delta) => handleUpdateCartQuantity(id, delta)}
                onOpenDetails={(p) => setSelectedProduct(p)}
              />
            )}

            {activePage === 'wishlist' && (
              <WishlistView
                products={products}
                wishlistIds={wishlistIds}
                cartItems={cartItems}
                onToggleWishlist={handleToggleWishlist}
                onAddToCart={(p) => handleAddToCart(p)}
                onOpenDetails={(p) => setSelectedProduct(p)}
                onBrowseShop={() => navigateTo('category', { category: 'all' })}
              />
            )}

            {activePage === 'more' && (
              <MoreView
                orders={orders}
                siteSettings={siteSettings}
                initialSection={moreSection}
                onOpenAdmin={() => setIsAdminMode(true)}
                onShowToast={showToast}
              />
            )}
          </motion.div>
        </div>
      </main>

      <Footer
        categories={categories}
        siteSettings={siteSettings}
        onNavigate={navigateTo}
        onOpenAdmin={() => setIsAdminMode(true)}
      />

      {/* Floating WhatsApp Contact Button -> 01782582555 */}
      <WhatsAppButton
        phoneNumber={siteSettings.whatsapp}
        shopName={siteSettings.shopName}
      />

      {/* Mobile Fixed Bottom Navigation */}
      <MobileBottomNav
        activePage={activePage}
        wishlistCount={wishlistIds.length}
        onNavigate={(page) => navigateTo(page)}
      />

      {/* Product Details Popup */}
      <ProductModal
        product={selectedProduct}
        isWishlisted={selectedProduct ? wishlistIds.includes(selectedProduct.id) : false}
        onClose={() => setSelectedProduct(null)}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
      />

      {/* Slide-Over Shopping Cart & Checkout Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        items={cartItems}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onPlaceOrder={handlePlaceOrder}
        onBrowseShop={() => navigateTo('category', { category: 'all' })}
      />

      {/* Subtle Floating Toast Feedback */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.12 }}
            className="fixed bottom-20 lg:bottom-6 left-4 right-4 sm:right-auto sm:left-6 z-50 flex items-center justify-center sm:justify-start pointer-events-none"
          >
            <div className="bg-[#071126] text-white px-4 py-2.5 rounded-xl shadow-xl border border-sky-400/30 flex items-center gap-2 text-xs sm:text-sm font-medium max-w-sm">
              <CheckCircle2 className="w-4 h-4 text-[#38bdf8] shrink-0" />
              <span className="truncate">{toastMsg}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
