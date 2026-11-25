import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Images,
  LayoutGrid,
  Settings,
  BarChart3,
  Mail,
  User,
  LogOut,
  Search,
  Bell,
  Crown,
  Plus,
  Trash2,
  Edit3,
  Send,
  Menu,
  X,
  ArrowUpRight,
  ExternalLink,
  Check,
  RotateCcw,
} from 'lucide-react';
import {
  DEVICE_IMAGE_PRESETS,
  formatBDT,
} from '../data/catalog';
import {
  CategoryItem,
  HeroSlide,
  Order,
  OrderStatus,
  Product,
  SiteSettings,
} from '../types';

type AdminSection =
  | 'dashboard'
  | 'products'
  | 'orders'
  | 'customers'
  | 'sliders'
  | 'categories'
  | 'site-settings'
  | 'reports'
  | 'broadcast'
  | 'profile';

interface AdminPanelProps {
  products: Product[];
  categories: CategoryItem[];
  heroSlides: HeroSlide[];
  orders: Order[];
  siteSettings: SiteSettings;
  onUpdateProducts: (next: Product[]) => void;
  onUpdateCategories: (next: CategoryItem[]) => void;
  onUpdateHeroSlides: (next: HeroSlide[]) => void;
  onUpdateOrders: (next: Order[]) => void;
  onUpdateSiteSettings: (next: SiteSettings) => void;
  onResetAll: () => void;
  onExitAdmin: () => void;
  onShowToast: (msg: string) => void;
}

const STATUS_BN: Record<OrderStatus, { label: string; cls: string }> = {
  Delivered: { label: 'ডেলিভারি হয়েছে', cls: 'bg-emerald-100 text-emerald-700' },
  Processing: { label: 'প্রসেসিং চলছে', cls: 'bg-sky-100 text-sky-700' },
  Shipped: { label: 'পাঠানো হয়েছে', cls: 'bg-amber-100 text-amber-800' },
  Confirmed: { label: 'কনফার্মড', cls: 'bg-purple-100 text-purple-700' },
  Pending: { label: 'পেন্ডিং', cls: 'bg-slate-100 text-slate-700' },
};

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  categories,
  heroSlides,
  orders,
  siteSettings,
  onUpdateProducts,
  onUpdateCategories,
  onUpdateHeroSlides,
  onUpdateOrders,
  onUpdateSiteSettings,
  onResetAll,
  onExitAdmin,
  onShowToast,
}) => {
  const [section, setSection] = useState<AdminSection>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminSearch, setAdminSearch] = useState('');
  const [quickMessage, setQuickMessage] = useState(siteSettings.broadcastNotice || '');

  // Product Form State
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [pName, setPName] = useState('');
  const [pBrand, setPBrand] = useState('');
  const [pCategory, setPCategory] = useState<Product['category']>('smartphones');
  const [pPrice, setPPrice] = useState('15000');
  const [pOriginalPrice, setPOriginalPrice] = useState('18000');
  const [pImage, setPImage] = useState(DEVICE_IMAGE_PRESETS[0].url);
  const [pDesc, setPDesc] = useState('');
  const [pPopular, setPPopular] = useState(true);
  const [pNewArrival, setPNewArrival] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);

  // Slider Form State
  const [sTitleBlue, setSTitleBlue] = useState('S.A');
  const [sTitleWhite, setSTitleWhite] = useState('SPECIAL OFFER');
  const [sSubtitle, setSSubtitle] = useState('Flat 20% off on flagship smartphones & accessories.');
  const [sBannerImage, setSBannerImage] = useState('');

  // Site Settings Form State
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(siteSettings);

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0) + 31750;
  const totalCustomers = 8747 + orders.length;

  const menuItems: { id: AdminSection; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'ড্যাশবোর্ড', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'products', label: 'পণ্য ব্যবস্থাপনা', icon: <Package className="w-4 h-4" /> },
    { id: 'orders', label: 'অর্ডার ব্যবস্থাপনা', icon: <ShoppingCart className="w-4 h-4" /> },
    { id: 'customers', label: 'কাস্টমার ব্যবস্থাপনা', icon: <Users className="w-4 h-4" /> },
    { id: 'sliders', label: 'স্লাইডার সেটিংস', icon: <Images className="w-4 h-4" /> },
    { id: 'categories', label: 'ক্যাটাগরি সেটিংস', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'site-settings', label: 'সাইট সেটিংস', icon: <Settings className="w-4 h-4" /> },
    { id: 'reports', label: 'রিপোর্ট ও বিশ্লেষণ', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'broadcast', label: 'বার্তা পাঠান', icon: <Mail className="w-4 h-4" /> },
    { id: 'profile', label: 'প্রোফাইল', icon: <User className="w-4 h-4" /> },
  ];

  const openNewProductForm = () => {
    setEditingProductId(null);
    setPName('');
    setPBrand('S.A Tech');
    setPCategory('smartphones');
    setPPrice('25000');
    setPOriginalPrice('30000');
    setPImage(DEVICE_IMAGE_PRESETS[0].url);
    setPDesc('Official genuine product with store warranty and free delivery.');
    setPPopular(true);
    setPNewArrival(true);
    setShowProductForm(true);
  };

  const openEditProductForm = (p: Product) => {
    setEditingProductId(p.id);
    setPName(p.name);
    setPBrand(p.brand);
    setPCategory(p.category);
    setPPrice(String(p.price));
    setPOriginalPrice(String(p.originalPrice));
    setPImage(p.image);
    setPDesc(p.description);
    setPPopular(Boolean(p.isPopular));
    setPNewArrival(Boolean(p.isNewArrival));
    setShowProductForm(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = Math.max(1, Number(pPrice) || 0);
    const origNum = Math.max(priceNum, Number(pOriginalPrice) || priceNum);
    const discount = origNum > priceNum ? Math.round(((origNum - priceNum) / origNum) * 100) : 0;
    const catObj = categories.find((c) => c.id === pCategory);

    if (!pName.trim()) {
      onShowToast('অনুগ্রহ করে পণ্যের নাম লিখুন।');
      return;
    }

    if (editingProductId) {
      const updated = products.map((item) =>
        item.id === editingProductId
          ? {
              ...item,
              name: pName.trim(),
              brand: pBrand.trim() || 'S.A Network',
              category: pCategory,
              categoryLabel: catObj?.name || item.categoryLabel,
              price: priceNum,
              originalPrice: origNum,
              discountPercent: discount,
              image: pImage,
              description: pDesc.trim() || item.description,
              isPopular: pPopular,
              isNewArrival: pNewArrival,
            }
          : item
      );
      onUpdateProducts(updated);
      onShowToast('পণ্য সফলভাবে আপডেট হয়েছে!');
    } else {
      const newProduct: Product = {
        id: `san-custom-${Date.now()}`,
        name: pName.trim(),
        brand: pBrand.trim() || 'S.A Network',
        category: pCategory,
        categoryLabel: catObj?.name || 'Smartphones',
        price: priceNum,
        originalPrice: origNum,
        discountPercent: discount,
        rating: 4.9,
        reviewCount: 18,
        image: pImage,
        inStock: true,
        isPopular: pPopular,
        isNewArrival: pNewArrival,
        variants: ['Standard'],
        colors: [{ name: 'Black', hex: '#18181b' }],
        description: pDesc.trim() || 'Official genuine product from S.A Network.',
        specs: [
          { label: 'Availability', value: 'In Stock' },
          { label: 'Delivery', value: 'All Over Bangladesh' },
        ],
        warranty: '12 Months Store Warranty',
      };
      onUpdateProducts([newProduct, ...products]);
      onShowToast('নতুন পণ্য স্টোরে যুক্ত করা হয়েছে!');
    }
    setShowProductForm(false);
  };

  const handleDeleteProduct = (id: string) => {
    onUpdateProducts(products.filter((p) => p.id !== id));
    onShowToast('পণ্যটি মুছে ফেলা হয়েছে।');
  };

  const handleOrderStatusChange = (orderId: string, newStatus: OrderStatus) => {
    onUpdateOrders(
      orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    onShowToast(`অর্ডার #${orderId} স্ট্যাটাস আপডেট হয়েছে।`);
  };

  const handleDeleteOrder = (orderId: string) => {
    onUpdateOrders(orders.filter((o) => o.id !== orderId));
    onShowToast(`অর্ডার #${orderId} মুছে ফেলা হয়েছে।`);
  };

  const handleSendBroadcast = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onUpdateSiteSettings({
      ...siteSettings,
      broadcastNotice: quickMessage.trim(),
    });
    setSettingsForm((prev) => ({ ...prev, broadcastNotice: quickMessage.trim() }));
    onShowToast(
      quickMessage.trim()
        ? 'বার্তাটি ইউজার প্যানেলের টপে লাইভ প্রকাশিত হয়েছে!'
        : 'লাইভ বার্তাটি সরানো হয়েছে।'
    );
  };

  const handleSaveSiteSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSiteSettings(settingsForm);
    onShowToast('সাইটের সকল তথ্য সফলভাবে আপডেট হয়েছে!');
  };

  const handleAddSlide = (e: React.FormEvent) => {
    e.preventDefault();
    const newSlide: HeroSlide = {
      id: `slide-${Date.now()}`,
      eyebrow: 'ADMIN PROMO • S.A NETWORK',
      titleBlue: sTitleBlue.trim() || 'S.A',
      titleWhite: sTitleWhite.trim() || 'DEALS',
      subtitle: sSubtitle.trim() || 'Shop Smart • Live Better',
      ctaLabel: 'Shop Now',
      ctaMobileLabel: 'Shop Now',
      targetCategory: 'all',
      accentGradient: 'bg-gradient-to-br from-[#021238] via-[#06358c] to-[#0a1c4d]',
      leftImage: DEVICE_IMAGE_PRESETS[0].url,
      rightImage: DEVICE_IMAGE_PRESETS[3].url,
      bannerImage: sBannerImage.trim() || undefined,
    };
    onUpdateHeroSlides([...heroSlides, newSlide]);
    setSBannerImage('');
    onShowToast('নতুন স্লাইডার ব্যানার যোগ করা হয়েছে!');
  };

  const filteredProducts = adminSearch.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(adminSearch.toLowerCase()) ||
          p.categoryLabel.toLowerCase().includes(adminSearch.toLowerCase())
      )
    : products;

  const filteredOrders = adminSearch.trim()
    ? orders.filter(
        (o) =>
          o.customerName.toLowerCase().includes(adminSearch.toLowerCase()) ||
          o.id.toLowerCase().includes(adminSearch.toLowerCase())
      )
    : orders;

  const SidebarContent = (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#1a0536] via-[#13032b] to-[#0c011e] text-white select-none">
      {/* Admin Brand Logo */}
      <div className="px-5 pt-5 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8b5cf6] to-[#4f46e5] flex items-center justify-center shadow-lg shadow-purple-700/40 font-display font-extrabold text-sm italic">
            S.A
          </div>
          <div className="leading-none">
            <p className="font-display font-extrabold text-lg tracking-tight">S.A</p>
            <p className="font-display font-bold text-xs text-purple-300">Network</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-1.5 rounded-lg bg-white/10 text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Owner Card */}
      <div className="mx-3 mb-4 p-3 rounded-2xl bg-white/6 border border-white/10 flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center shrink-0">
          <User className="w-6 h-6 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-white truncate">{siteSettings.ownerName}</p>
          <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            Online
          </p>
          <span className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-[10px] font-bold text-amber-300">
            <Crown className="w-2.5 h-2.5" />
            Shop Owner
          </span>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => {
          const active = section === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setSection(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                active
                  ? 'bg-gradient-to-r from-[#7c3aed] to-[#9333ea] text-white shadow-md shadow-purple-700/40'
                  : 'text-purple-100/80 hover:bg-white/8 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2.5">
                {item.icon}
                <span>{item.label}</span>
              </span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={onExitAdmin}
          className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 text-rose-300 hover:bg-rose-500/15 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>লগআউট (User Panel)</span>
        </button>
      </nav>

      {/* Bottom Grow Your Business Card */}
      <div className="p-3">
        <div className="rounded-2xl bg-gradient-to-br from-[#2e1065] to-[#1e1b4b] border border-purple-400/25 p-3.5">
          <Crown className="w-5 h-5 text-amber-400 mb-1" />
          <p className="font-display font-bold text-sm text-white">{siteSettings.shopName}</p>
          <p className="text-[11px] text-purple-200/80">Grow Your Business</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F3F4FA] text-slate-900 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 sticky top-0 h-screen">
        {SidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-64 h-full z-10">{SidebarContent}</div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200/80 px-4 sm:px-6 h-16 flex items-center justify-between gap-4 sticky top-0 z-30">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open admin menu"
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-700"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-full pl-3.5 pr-1 py-1 w-full focus-within:border-purple-600">
              <input
                type="text"
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
                placeholder="এখানে কিছু খুঁজুন..."
                className="bg-transparent text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none w-full"
              />
              <button
                type="button"
                aria-label="Search admin"
                className="w-7 h-7 rounded-full bg-[#6d28d9] text-white flex items-center justify-center shrink-0"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={onExitAdmin}
              className="px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-[#0B84F3] text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">User Panel দেখুন</span>
            </button>

            <button
              type="button"
              onClick={() => setSection('orders')}
              className="relative p-2 rounded-full hover:bg-slate-100 text-slate-700 cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center tabular-nums">
                {orders.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSection('profile')}
              className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                SA
              </div>
              <span className="text-xs font-semibold text-slate-700">{siteSettings.ownerName}</span>
            </button>
          </div>
        </header>

        {/* Body Content */}
        <main className="p-4 sm:p-6 space-y-5 flex-1">
          {/* DASHBOARD */}
          {section === 'dashboard' && (
            <>
              {/* Welcome Banner */}
              <div className="bg-gradient-to-r from-[#f5f3ff] via-[#faf5ff] to-[#e9d5ff] border border-purple-200/80 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
                <div>
                  <h1 className="text-lg sm:text-xl font-display font-extrabold text-slate-900">
                    👋 স্বাগতম, {siteSettings.ownerName}!
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    আপনার {siteSettings.shopName} Admin Panel এ সফলভাবে লগইন করেছেন। এখান থেকে ইউজার প্যানেলের সবকিছু নিয়ন্ত্রণ করুন।
                  </p>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#4f46e5] text-white flex items-center justify-center font-display font-extrabold italic shadow-md">
                    S.A
                  </div>
                  <div>
                    <p className="font-display font-extrabold text-lg text-[#4c1d95] leading-none">
                      {siteSettings.shopName}
                    </p>
                    <p className="text-[11px] font-medium text-purple-700 mt-0.5">
                      {siteSettings.tagline}
                    </p>
                  </div>
                </div>
              </div>

              {/* 4 KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-slate-200/70 p-4 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                      <ShoppingCart className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500">মোট অর্ডার</p>
                      <p className="text-xl font-display font-extrabold text-slate-900 tabular-nums">
                        {121 + orders.length}
                      </p>
                      <p className="text-[11px] font-bold text-emerald-600">↑ +12%</p>
                    </div>
                  </div>
                  <svg viewBox="0 0 60 28" className="w-14 h-7 text-purple-500 shrink-0">
                    <polyline fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" points="2,24 14,16 26,20 38,8 48,14 58,4" />
                  </svg>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/70 p-4 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500">মোট কাস্টমার</p>
                      <p className="text-xl font-display font-extrabold text-slate-900 tabular-nums">
                        {totalCustomers.toLocaleString('en-IN')}
                      </p>
                      <p className="text-[11px] font-bold text-emerald-600">↑ +8%</p>
                    </div>
                  </div>
                  <svg viewBox="0 0 60 28" className="w-14 h-7 text-emerald-500 shrink-0">
                    <polyline fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" points="2,22 14,14 24,18 36,10 48,12 58,5" />
                  </svg>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/70 p-4 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500">মোট পণ্য</p>
                      <p className="text-xl font-display font-extrabold text-slate-900 tabular-nums">
                        {products.length}
                      </p>
                      <p className="text-[11px] font-bold text-emerald-600">↑ Live Catalog</p>
                    </div>
                  </div>
                  <svg viewBox="0 0 60 28" className="w-14 h-7 text-amber-500 shrink-0">
                    <polyline fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" points="2,23 16,18 28,15 40,17 50,7 58,9" />
                  </svg>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/70 p-4 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-blue-100 text-[#0B84F3] flex items-center justify-center shrink-0 font-bold text-lg">
                      ৳
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500">মোট আয়</p>
                      <p className="text-xl font-display font-extrabold text-slate-900 tabular-nums">
                        {formatBDT(totalRevenue)}
                      </p>
                      <p className="text-[11px] font-bold text-emerald-600">↑ +15%</p>
                    </div>
                  </div>
                  <svg viewBox="0 0 60 28" className="w-14 h-7 text-[#0B84F3] shrink-0">
                    <polyline fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" points="2,25 14,19 26,21 38,11 48,13 58,3" />
                  </svg>
                </div>
              </div>

              {/* Sales Chart & Quick Actions */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
                {/* Sales Summary */}
                <div className="xl:col-span-7 bg-white rounded-2xl border border-slate-200/70 overflow-hidden shadow-xs">
                  <div className="bg-gradient-to-r from-[#3b0764] to-[#6d28d9] text-white px-5 py-3 flex items-center justify-between">
                    <h2 className="font-display font-bold text-sm sm:text-base flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      বিক্রয়ের সারাংশ
                    </h2>
                    <span className="text-xs bg-white/15 px-3 py-1 rounded-lg font-medium">
                      এই মাস
                    </span>
                  </div>
                  <div className="p-5 relative">
                    <div className="flex justify-end mb-2">
                      <span className="bg-[#2e1065] text-white text-xs font-bold px-3 py-1 rounded-lg shadow-sm tabular-nums">
                        ৳ ১,২০,০০০
                      </span>
                    </div>
                    <svg viewBox="0 0 500 160" className="w-full h-44 overflow-visible">
                      <defs>
                        <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.35" />
                          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.02" />
                        </linearGradient>
                      </defs>
                      <line x1="25" y1="20" x2="490" y2="20" stroke="#e2e8f0" strokeDasharray="4 4" />
                      <line x1="25" y1="65" x2="490" y2="65" stroke="#e2e8f0" strokeDasharray="4 4" />
                      <line x1="25" y1="110" x2="490" y2="110" stroke="#e2e8f0" strokeDasharray="4 4" />
                      <line x1="25" y1="145" x2="490" y2="145" stroke="#cbd5e1" />
                      <path
                        d="M35,130 C95,95 140,88 180,105 C230,125 270,58 320,68 C375,80 415,45 480,24 L480,145 L35,145 Z"
                        fill="url(#salesFill)"
                      />
                      <path
                        d="M35,130 C95,95 140,88 180,105 C230,125 270,58 320,68 C375,80 415,45 480,24"
                        fill="none"
                        stroke="#7c3aed"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      {[
                        [35, 130],
                        [110, 96],
                        [180, 105],
                        [255, 78],
                        [320, 68],
                        [400, 64],
                        [480, 24],
                      ].map(([cx, cy], i) => (
                        <circle
                          key={i}
                          cx={cx}
                          cy={cy}
                          r="4.5"
                          fill="#ffffff"
                          stroke="#7c3aed"
                          strokeWidth="2.5"
                        />
                      ))}
                      <text x="30" y="158" fontSize="10" fill="#64748b">1 Nov</text>
                      <text x="140" y="158" fontSize="10" fill="#64748b">7 Nov</text>
                      <text x="245" y="158" fontSize="10" fill="#64748b">14 Nov</text>
                      <text x="355" y="158" fontSize="10" fill="#64748b">21 Nov</text>
                      <text x="455" y="158" fontSize="10" fill="#64748b">30 Nov</text>
                    </svg>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="xl:col-span-5 bg-white rounded-2xl border border-slate-200/70 overflow-hidden shadow-xs">
                  <div className="bg-gradient-to-r from-[#3b0764] to-[#6d28d9] text-white px-5 py-3">
                    <h2 className="font-display font-bold text-sm sm:text-base">
                      ⚡ দ্রুত অ্যাকশন
                    </h2>
                  </div>
                  <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSection('products');
                        openNewProductForm();
                      }}
                      className="p-3.5 rounded-xl bg-purple-50 hover:bg-purple-100/80 border border-purple-100 flex flex-col items-center gap-2 text-center transition-colors cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center">
                        <Package className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">নতুন পণ্য যোগ করুন</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSection('orders')}
                      className="p-3.5 rounded-xl bg-blue-50 hover:bg-blue-100/80 border border-blue-100 flex flex-col items-center gap-2 text-center transition-colors cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#0B84F3] text-white flex items-center justify-center">
                        <ShoppingCart className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">নতুন অর্ডার দেখুন</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSection('customers')}
                      className="p-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-100 flex flex-col items-center gap-2 text-center transition-colors cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                        <Users className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">কাস্টমার দেখুন</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSection('sliders')}
                      className="p-3.5 rounded-xl bg-amber-50 hover:bg-amber-100/80 border border-amber-100 flex flex-col items-center gap-2 text-center transition-colors cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center">
                        <Images className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">স্লাইডার আপডেট</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSection('site-settings')}
                      className="p-3.5 rounded-xl bg-rose-50 hover:bg-rose-100/80 border border-rose-100 flex flex-col items-center gap-2 text-center transition-colors cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center">
                        <Settings className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">সাইট সেটিংস</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSection('reports')}
                      className="p-3.5 rounded-xl bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-100 flex flex-col items-center gap-2 text-center transition-colors cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                        <BarChart3 className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">রিপোর্ট দেখুন</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Orders & Quick Message */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
                <div className="xl:col-span-7 bg-white rounded-2xl border border-slate-200/70 overflow-hidden shadow-xs">
                  <div className="bg-gradient-to-r from-[#3b0764] to-[#6d28d9] text-white px-5 py-3 flex items-center justify-between">
                    <h2 className="font-display font-bold text-sm sm:text-base">
                      সাম্প্রতিক অর্ডার
                    </h2>
                    <button
                      type="button"
                      onClick={() => setSection('orders')}
                      className="text-xs font-semibold hover:underline cursor-pointer"
                    >
                      সব দেখুন →
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                        <tr>
                          <th className="px-4 py-2.5">#</th>
                          <th className="px-4 py-2.5">কাস্টমার নাম</th>
                          <th className="px-4 py-2.5">পণ্য</th>
                          <th className="px-4 py-2.5">পরিমাণ</th>
                          <th className="px-4 py-2.5">মোট</th>
                          <th className="px-4 py-2.5">স্ট্যাটাস</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredOrders.slice(0, 5).map((order) => {
                          const st = STATUS_BN[order.status] || STATUS_BN.Confirmed;
                          const qty = order.items.reduce((s, i) => s + i.quantity, 0);
                          return (
                            <tr key={order.id} className="hover:bg-slate-50/70">
                              <td className="px-4 py-3 font-bold text-slate-700 tabular-nums">
                                #{order.id}
                              </td>
                              <td className="px-4 py-3 font-semibold text-slate-900">
                                {order.customerName}
                              </td>
                              <td className="px-4 py-3 text-slate-600 max-w-[160px] truncate">
                                {order.items[0]?.name || 'Order Items'}
                              </td>
                              <td className="px-4 py-3 text-slate-600 tabular-nums">{qty} পিস</td>
                              <td className="px-4 py-3 font-bold text-slate-900 tabular-nums">
                                {formatBDT(order.total)}
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${st.cls}`}
                                >
                                  {st.label}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Quick Broadcast */}
                <div className="xl:col-span-5 bg-white rounded-2xl border border-slate-200/70 overflow-hidden shadow-xs flex flex-col">
                  <div className="bg-gradient-to-r from-[#3b0764] to-[#6d28d9] text-white px-5 py-3 flex items-center justify-between">
                    <h2 className="font-display font-bold text-sm sm:text-base">
                      দ্রুত বার্তা পাঠান
                    </h2>
                    <button
                      type="button"
                      onClick={() => setSection('broadcast')}
                      className="text-xs font-semibold hover:underline cursor-pointer"
                    >
                      সব দেখুন →
                    </button>
                  </div>
                  <form onSubmit={handleSendBroadcast} className="p-4 flex-1 flex flex-col gap-3">
                    <textarea
                      rows={4}
                      value={quickMessage}
                      onChange={(e) => setQuickMessage(e.target.value)}
                      placeholder="এখানে বার্তা লিখুন... (এটি ইউজার প্যানেলের একদম উপরে লাইভ নোটিশ হিসেবে দেখা যাবে)"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm focus:outline-none focus:border-purple-600 focus:bg-white flex-1"
                    />
                    <div className="flex items-center justify-between gap-2">
                      {siteSettings.broadcastNotice && (
                        <button
                          type="button"
                          onClick={() => {
                            setQuickMessage('');
                            onUpdateSiteSettings({ ...siteSettings, broadcastNotice: '' });
                            onShowToast('লাইভ নোটিশ বন্ধ করা হয়েছে।');
                          }}
                          className="text-xs font-semibold text-rose-600 hover:underline cursor-pointer"
                        >
                          বার্তা মুছুন
                        </button>
                      )}
                      <button
                        type="submit"
                        className="ml-auto px-5 py-2 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] hover:from-[#6d28d9] hover:to-[#5b21b6] text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>পাঠান</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </>
          )}

          {/* PRODUCT MANAGEMENT */}
          {section === 'products' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200/70 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-display font-bold text-slate-900">
                    পণ্য ব্যবস্থাপনা (A to Z Control)
                  </h2>
                  <p className="text-xs text-slate-500">
                    নতুন পণ্য যোগ, দাম/ডিসকাউন্ট পরিবর্তন বা পণ্য ডিলিট করলে সাথে সাথে User Panel এ আপডেট হবে।
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openNewProductForm}
                  className="px-4 py-2.5 rounded-xl bg-[#6d28d9] hover:bg-[#5b21b6] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন পণ্য যোগ করুন</span>
                </button>
              </div>

              {showProductForm && (
                <form
                  onSubmit={handleSaveProduct}
                  className="bg-white rounded-2xl border border-purple-200 p-5 space-y-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-base text-slate-900">
                      {editingProductId ? 'পণ্য এডিট করুন' : 'নতুন পণ্য যোগ করুন'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowProductForm(false)}
                      className="p-1.5 rounded-lg hover:bg-slate-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">পণ্যের নাম</label>
                      <input
                        type="text"
                        value={pName}
                        onChange={(e) => setPName(e.target.value)}
                        placeholder="e.g. iPhone 17 Pro Max"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">ব্র্যান্ড</label>
                      <input
                        type="text"
                        value={pBrand}
                        onChange={(e) => setPBrand(e.target.value)}
                        placeholder="Apple / Samsung / Anker"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">ক্যাটাগরি</label>
                      <select
                        value={pCategory}
                        onChange={(e) => setPCategory(e.target.value as Product['category'])}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">বিক্রয় মূল্য (৳)</label>
                      <input
                        type="number"
                        value={pPrice}
                        onChange={(e) => setPPrice(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">আগের মূল্য (৳)</label>
                      <input
                        type="number"
                        value={pOriginalPrice}
                        onChange={(e) => setPOriginalPrice(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">ডিভাইস ছবি নির্বাচন</label>
                      <select
                        value={pImage}
                        onChange={(e) => setPImage(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white"
                      >
                        {DEVICE_IMAGE_PRESETS.map((img) => (
                          <option key={img.url} value={img.url}>
                            {img.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">বিবরণ</label>
                    <textarea
                      rows={2}
                      value={pDesc}
                      onChange={(e) => setPDesc(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pPopular}
                        onChange={(e) => setPPopular(e.target.checked)}
                      />
                      <span>Popular Products এ দেখান</span>
                    </label>
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pNewArrival}
                        onChange={(e) => setPNewArrival(e.target.checked)}
                      />
                      <span>New Arrivals এ দেখান</span>
                    </label>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowProductForm(false)}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold cursor-pointer"
                    >
                      বাতিল
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-[#6d28d9] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>সেভ করুন</span>
                    </button>
                  </div>
                </form>
              )}

              <div className="bg-white rounded-2xl border border-slate-200/70 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                      <tr>
                        <th className="px-4 py-3">পণ্য</th>
                        <th className="px-4 py-3">ক্যাটাগরি</th>
                        <th className="px-4 py-3">দাম</th>
                        <th className="px-4 py-3">ডিসকাউন্ট</th>
                        <th className="px-4 py-3 text-right">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/70">
                          <td className="px-4 py-2.5 flex items-center gap-3">
                            <img
                              src={p.image}
                              alt={p.name}
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                            />
                            <div>
                              <p className="font-bold text-slate-900">{p.name}</p>
                              <p className="text-[11px] text-slate-400">{p.brand}</p>
                            </div>
                          </td>
                          <td className="px-4 py-2.5 text-slate-600">{p.categoryLabel}</td>
                          <td className="px-4 py-2.5 font-bold text-[#0B84F3] tabular-nums">
                            {formatBDT(p.price)}
                          </td>
                          <td className="px-4 py-2.5">
                            <span className="bg-red-50 text-red-600 font-bold px-2 py-0.5 rounded-full tabular-nums">
                              -{p.discountPercent}%
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-right space-x-1.5">
                            <button
                              type="button"
                              onClick={() => openEditProductForm(p)}
                              aria-label="Edit product"
                              className="p-1.5 rounded-lg bg-sky-50 text-[#0B84F3] hover:bg-sky-100 cursor-pointer"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(p.id)}
                              aria-label="Delete product"
                              className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ORDERS MANAGEMENT */}
          {section === 'orders' && (
            <div className="bg-white rounded-2xl border border-slate-200/70 overflow-hidden shadow-xs">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-display font-bold text-slate-900">
                    অর্ডার ব্যবস্থাপনা ({filteredOrders.length})
                  </h2>
                  <p className="text-xs text-slate-500">
                    প্রতিটি অর্ডারের স্ট্যাটাস এখান থেকে সরাসরি আপডেট করুন।
                  </p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                    <tr>
                      <th className="px-4 py-3">#</th>
                      <th className="px-4 py-3">কাস্টমার ও ঠিকানা</th>
                      <th className="px-4 py-3">পণ্য</th>
                      <th className="px-4 py-3">মোট</th>
                      <th className="px-4 py-3">স্ট্যাটাস পরিবর্তন</th>
                      <th className="px-4 py-3 text-right">মুছুন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-slate-50/70">
                        <td className="px-4 py-3 font-bold tabular-nums">#{o.id}</td>
                        <td className="px-4 py-3">
                          <p className="font-bold text-slate-900">{o.customerName}</p>
                          <p className="text-[11px] text-slate-500">
                            {o.phone} · {o.address}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          {o.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
                        </td>
                        <td className="px-4 py-3 font-bold text-[#0B84F3] tabular-nums">
                          {formatBDT(o.total)}
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={o.status}
                            onChange={(e) =>
                              handleOrderStatusChange(o.id, e.target.value as OrderStatus)
                            }
                            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-semibold text-xs cursor-pointer"
                          >
                            <option value="Pending">পেন্ডিং (Pending)</option>
                            <option value="Confirmed">কনফার্মড (Confirmed)</option>
                            <option value="Processing">প্রসেসিং চলছে (Processing)</option>
                            <option value="Shipped">পাঠানো হয়েছে (Shipped)</option>
                            <option value="Delivered">ডেলিভারি হয়েছে (Delivered)</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteOrder(o.id)}
                            className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CUSTOMERS MANAGEMENT */}
          {section === 'customers' && (
            <div className="bg-white rounded-2xl border border-slate-200/70 p-5 space-y-4 shadow-xs">
              <h2 className="text-lg font-display font-bold text-slate-900">
                কাস্টমার ব্যবস্থাপনা
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {orders.map((o) => (
                  <div
                    key={o.id}
                    className="rounded-xl border border-slate-200 p-4 flex items-start justify-between gap-2"
                  >
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{o.customerName}</p>
                      <p className="text-xs text-slate-500 mt-0.5 tabular-nums">{o.phone}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{o.address}</p>
                    </div>
                    <span className="text-xs font-bold text-[#0B84F3] tabular-nums">
                      {formatBDT(o.total)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SLIDER SETTINGS */}
          {section === 'sliders' && (
            <div className="space-y-4">
              <form
                onSubmit={handleAddSlide}
                className="bg-white rounded-2xl border border-slate-200/70 p-5 space-y-4 shadow-xs"
              >
                <h2 className="text-lg font-display font-bold text-slate-900">
                  স্লাইডার সেটিংস (Hero Banner Control)
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <input
                    type="text"
                    value={sTitleBlue}
                    onChange={(e) => setSTitleBlue(e.target.value)}
                    placeholder="Title Highlight (e.g. MEGA)"
                    className="px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                  <input
                    type="text"
                    value={sTitleWhite}
                    onChange={(e) => setSTitleWhite(e.target.value)}
                    placeholder="Main Title (e.g. FLASH SALE)"
                    className="px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                  <input
                    type="text"
                    value={sSubtitle}
                    onChange={(e) => setSSubtitle(e.target.value)}
                    placeholder="Banner Subtitle"
                    className="px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                  <input
                    type="text"
                    value={sBannerImage}
                    onChange={(e) => setSBannerImage(e.target.value)}
                    placeholder="Optional Full Banner Image URL"
                    className="px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#6d28d9] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন স্লাইড যোগ করুন</span>
                </button>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {heroSlides.map((slide, idx) => (
                  <div
                    key={slide.id}
                    className="bg-white rounded-2xl border border-slate-200/70 p-4 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={slide.bannerImage || slide.leftImage}
                        alt={slide.titleWhite}
                        referrerPolicy="no-referrer"
                        className="w-20 h-14 rounded-xl object-cover bg-slate-100 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-purple-600">
                          Slide #{idx + 1}
                        </p>
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {slide.titleBlue} {slide.titleWhite}
                        </p>
                        <p className="text-xs text-slate-500 truncate">{slide.subtitle}</p>
                      </div>
                    </div>
                    {heroSlides.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          onUpdateHeroSlides(heroSlides.filter((s) => s.id !== slide.id));
                          onShowToast('স্লাইডটি সরানো হয়েছে।');
                        }}
                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 shrink-0 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CATEGORY SETTINGS */}
          {section === 'categories' && (
            <div className="bg-white rounded-2xl border border-slate-200/70 p-5 space-y-4 shadow-xs">
              <h2 className="text-lg font-display font-bold text-slate-900">
                ক্যাটাগরি সেটিংস (রিয়েল ডিভাইস আইকনসহ)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="rounded-xl border border-slate-200 p-3.5 flex items-center gap-3"
                  >
                    <img
                      src={cat.image || DEVICE_IMAGE_PRESETS[0].url}
                      alt={cat.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-xl object-cover bg-sky-50 border border-sky-200 shrink-0"
                    />
                    <div className="flex-1 space-y-1.5">
                      <input
                        type="text"
                        value={cat.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          onUpdateCategories(
                            categories.map((c) =>
                              c.id === cat.id ? { ...c, name: val, shortName: val } : c
                            )
                          );
                        }}
                        className="w-full px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-bold"
                      />
                      <select
                        value={cat.image || DEVICE_IMAGE_PRESETS[0].url}
                        onChange={(e) => {
                          const val = e.target.value;
                          onUpdateCategories(
                            categories.map((c) =>
                              c.id === cat.id ? { ...c, image: val } : c
                            )
                          );
                          onShowToast(`${cat.name} আইকনের ছবি আপডেট হয়েছে!`);
                        }}
                        className="w-full px-2.5 py-1 rounded-lg border border-slate-200 text-[11px] bg-slate-50"
                      >
                        {DEVICE_IMAGE_PRESETS.map((preset) => (
                          <option key={preset.url} value={preset.url}>
                            {preset.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SITE SETTINGS (A-TO-Z STORE CONTROL) */}
          {section === 'site-settings' && (
            <form
              onSubmit={handleSaveSiteSettings}
              className="bg-white rounded-2xl border border-slate-200/70 p-5 sm:p-6 space-y-4 shadow-xs"
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h2 className="text-lg font-display font-bold text-slate-900">
                    সাইট সেটিংস (User Panel A to Z Control)
                  </h2>
                  <p className="text-xs text-slate-500">
                    শপের নাম, মালিকের নাম, লোকেশন, মোবাইল ও WhatsApp নম্বর এখান থেকে পরিবর্তন করুন।
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onResetAll}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>ডিফল্ট রিসেট</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Shop Name</label>
                  <input
                    type="text"
                    value={settingsForm.shopName}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, shopName: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Owner Name</label>
                  <input
                    type="text"
                    value={settingsForm.ownerName}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, ownerName: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Shop Location</label>
                  <input
                    type="text"
                    value={settingsForm.location}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, location: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
                  <input
                    type="text"
                    value={settingsForm.mobile}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, mobile: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Number</label>
                  <input
                    type="text"
                    value={settingsForm.whatsapp}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, whatsapp: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Store Tagline</label>
                  <input
                    type="text"
                    value={settingsForm.tagline}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, tagline: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Top Bar Shipping Notice</label>
                  <input
                    type="text"
                    value={settingsForm.topNotice}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, topNotice: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#6d28d9] hover:bg-[#5b21b6] text-white text-sm font-bold inline-flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>সব পরিবর্তন সেভ করুন</span>
                </button>
              </div>
            </form>
          )}

          {/* REPORTS & ANALYTICS */}
          {section === 'reports' && (
            <div className="bg-white rounded-2xl border border-slate-200/70 p-5 space-y-4 shadow-xs">
              <h2 className="text-lg font-display font-bold text-slate-900">
                রিপোর্ট ও বিশ্লেষণ
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat) => {
                  const count = products.filter((p) => p.category === cat.id).length;
                  return (
                    <div
                      key={cat.id}
                      className="rounded-xl bg-slate-50 border border-slate-200/70 p-4 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-800">{cat.name}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5 tabular-nums">
                          {count} টি পণ্য স্টোরে আছে
                        </p>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-purple-600" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* BROADCAST */}
          {section === 'broadcast' && (
            <div className="bg-white rounded-2xl border border-slate-200/70 p-5 space-y-4 shadow-xs max-w-2xl">
              <h2 className="text-lg font-display font-bold text-slate-900">
                ইউজার প্যানেলে লাইভ বার্তা পাঠান
              </h2>
              <p className="text-xs text-slate-500">
                এখানে কোনো অফার বা ঘোষণা লিখলে সেটি সাথে সাথে ইউজার প্যানেলের একদম উপরে দেখা যাবে।
              </p>
              <form onSubmit={handleSendBroadcast} className="space-y-3">
                <textarea
                  rows={4}
                  value={quickMessage}
                  onChange={(e) => setQuickMessage(e.target.value)}
                  placeholder="যেমন: আজকে সব স্মার্টওয়াচে ১৫% ফ্ল্যাশ ডিসকাউন্ট! কল করুন ০১৭৮২৫৮২৫৫৫"
                  className="w-full px-3.5 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-purple-600"
                />
                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#6d28d9] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>লাইভ বার্তা পাঠান</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setQuickMessage('');
                      onUpdateSiteSettings({ ...siteSettings, broadcastNotice: '' });
                      onShowToast('বার্তা সরানো হয়েছে।');
                    }}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 cursor-pointer"
                  >
                    বার্তা মুছুন
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* PROFILE */}
          {section === 'profile' && (
            <div className="bg-white rounded-2xl border border-slate-200/70 p-6 max-w-xl space-y-4 shadow-xs">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center font-display font-extrabold text-xl">
                  SA
                </div>
                <div>
                  <h2 className="text-xl font-display font-bold text-slate-900">
                    {siteSettings.ownerName}
                  </h2>
                  <p className="text-xs font-bold text-purple-600">Shop Owner · {siteSettings.shopName}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-slate-600 pt-2 border-t border-slate-100">
                <p><strong>Shop:</strong> {siteSettings.shopName}</p>
                <p><strong>Location:</strong> {siteSettings.location}</p>
                <p><strong>Mobile / WhatsApp:</strong> {siteSettings.mobile}</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
