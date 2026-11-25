import React, { useState, useEffect } from 'react';
import {
  Package,
  Info,
  BookOpen,
  PhoneCall,
  ShieldCheck,
  Truck,
  MapPin,
  Send,
  CheckCircle2,
  ChevronDown,
  Crown,
  MessageCircle,
  User,
} from 'lucide-react';
import { BLOG_ARTICLES, formatBDT } from '../data/catalog';
import { Order, SiteSettings } from '../types';

interface MoreViewProps {
  orders: Order[];
  siteSettings: SiteSettings;
  initialSection?: string;
  onOpenAdmin: () => void;
  onShowToast: (msg: string) => void;
}

export const MoreView: React.FC<MoreViewProps> = ({
  orders,
  siteSettings,
  initialSection = 'orders',
  onOpenAdmin,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'about' | 'blog' | 'contact'>(
    (initialSection as 'orders' | 'about' | 'blog' | 'contact') || 'orders'
  );
  const [expandedArticle, setExpandedArticle] = useState<string | null>(BLOG_ARTICLES[0].id);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSent, setContactSent] = useState(false);

  useEffect(() => {
    if (
      initialSection === 'orders' ||
      initialSection === 'about' ||
      initialSection === 'blog' ||
      initialSection === 'contact'
    ) {
      setActiveTab(initialSection);
    }
  }, [initialSection]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactMsg.trim()) {
      onShowToast('Please enter your name and message.');
      return;
    }
    setContactSent(true);
    setContactName('');
    setContactPhone('');
    setContactMsg('');
    onShowToast('Message sent! Our 24/7 support team will call or reply shortly.');
  };

  const waDigits = siteSettings.whatsapp.replace(/\D/g, '');
  const waHref = `https://wa.me/${waDigits.startsWith('88') ? waDigits : waDigits.startsWith('0') ? `88${waDigits}` : `880${waDigits}`}`;

  return (
    <div className="max-w-[1440px] mx-auto px-3.5 sm:px-6 py-5 space-y-5">
      {/* Banner */}
      <div className="bg-[#071126] text-white rounded-2xl p-5 sm:p-7 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-sky-400">
            {siteSettings.shopName} Hub
          </p>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold mt-0.5">
            Orders, Guides & 24/7 Support
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            {siteSettings.location} · Owner: {siteSettings.ownerName}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              { id: 'orders', label: 'My Orders', icon: <Package className="w-4 h-4" /> },
              { id: 'about', label: 'About Us', icon: <Info className="w-4 h-4" /> },
              { id: 'blog', label: 'Tech Blog', icon: <BookOpen className="w-4 h-4" /> },
              { id: 'contact', label: 'Contact', icon: <PhoneCall className="w-4 h-4" /> },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#0B84F3] text-white'
                  : 'bg-white/10 text-slate-200 hover:bg-white/20'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}

          <button
            type="button"
            onClick={onOpenAdmin}
            className="px-3.5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-sm cursor-pointer"
          >
            <Crown className="w-4 h-4 text-amber-300" />
            <span>Admin Panel</span>
          </button>
        </div>
      </div>

      {/* ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#0B84F3] flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Free Nationwide Delivery</p>
                <p className="text-xs text-slate-500">{siteSettings.topNotice}</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#0B84F3] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">7-Day Replacement</p>
                <p className="text-xs text-slate-500">Official warranty on every device</p>
              </div>
            </div>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-2xl border border-slate-200/80 p-4 flex items-center gap-3 hover:border-[#25D366] transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#25D366] flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">WhatsApp Support</p>
                <p className="text-xs text-slate-500 tabular-nums">{siteSettings.whatsapp}</p>
              </div>
            </a>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5">
            <h2 className="text-lg font-display font-bold text-slate-900 mb-3">
              Recent Orders
            </h2>
            {orders.length === 0 ? (
              <p className="text-sm text-slate-500 py-6 text-center">
                No orders placed yet. Add items to your cart and complete checkout to track your order here!
              </p>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="font-bold text-slate-900">Order #{order.id}</span>
                        <span>·</span>
                        <span>{order.date}</span>
                        <span>·</span>
                        <span className="text-emerald-600 font-semibold">{order.status}</span>
                      </div>
                      <p className="text-sm font-semibold text-slate-800 mt-1">
                        {order.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Delivering to: {order.address} · {order.paymentMethod}
                      </p>
                    </div>
                    <div className="text-left sm:text-right shrink-0">
                      <p className="text-xs text-slate-400">Total</p>
                      <p className="text-base font-extrabold text-[#0B84F3] tabular-nums">
                        {formatBDT(order.total)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ABOUT TAB */}
      {activeTab === 'about' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-7 space-y-4">
          <h2 className="text-xl font-display font-bold text-slate-900">
            About {siteSettings.shopName} — Mobile, Accessories & Smart Lifestyle
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
            {siteSettings.shopName} (Owner: {siteSettings.ownerName}), located at{' '}
            {siteSettings.location}, is a trusted destination for official smartphones, active
            noise-cancelling audio, AMOLED smart watches, GaN rapid charging adapters, and gaming
            peripherals. Our mission is simple: {siteSettings.tagline}.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-2xl font-display font-extrabold text-[#0B84F3] tabular-nums">64 Districts</p>
              <p className="text-xs text-slate-600 mt-1">
                Cash on Delivery & express courier coverage all over Bangladesh.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-2xl font-display font-extrabold text-[#0B84F3] tabular-nums">100% Authentic</p>
              <p className="text-xs text-slate-600 mt-1">
                Factory-sealed official units with verifiable warranty cards.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-2xl font-display font-extrabold text-[#0B84F3] tabular-nums">24/7 Support</p>
              <p className="text-xs text-slate-600 mt-1">
                Direct hotline & WhatsApp: {siteSettings.mobile}.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* BLOG TAB */}
      {activeTab === 'blog' && (
        <div className="space-y-3">
          {BLOG_ARTICLES.map((article) => {
            const isOpen = expandedArticle === article.id;
            return (
              <article
                key={article.id}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setExpandedArticle(isOpen ? null : article.id)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors cursor-pointer"
                >
                  <div>
                    <p className="text-xs text-slate-400 font-medium">
                      {article.category} · {article.date} · {article.readTime}
                    </p>
                    <h3 className="text-base sm:text-lg font-display font-bold text-slate-900 mt-1">
                      {article.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1">{article.summary}</p>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-[#0B84F3]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-100 text-sm text-slate-700 leading-relaxed bg-slate-50/50">
                    {article.content}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {/* CONTACT TAB */}
      {activeTab === 'contact' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4">
            <h2 className="text-lg font-display font-bold text-slate-900">
              {siteSettings.shopName} Store Desk
            </h2>
            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-[#0B84F3] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900">Shop Owner</p>
                  <p className="text-xs">{siteSettings.ownerName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#0B84F3] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900">Store Location</p>
                  <p className="text-xs">{siteSettings.location}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <PhoneCall className="w-5 h-5 text-[#0B84F3] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900">Mobile Number</p>
                  <a
                    href={`tel:${siteSettings.mobile}`}
                    className="text-xs font-bold text-[#0B84F3] hover:underline tabular-nums"
                  >
                    {siteSettings.mobile}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-[#25D366] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900">WhatsApp Direct</p>
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-[#25D366] hover:underline tabular-nums"
                  >
                    Chat on WhatsApp ({siteSettings.whatsapp})
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-5">
            <h2 className="text-lg font-display font-bold text-slate-900 mb-3">
              Send Us a Message
            </h2>
            {contactSent ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <p className="font-bold text-slate-900">Message Received!</p>
                <p className="text-xs text-slate-500">
                  Our support specialist will reach out within 15 minutes.
                </p>
                <button
                  type="button"
                  onClick={() => setContactSent(false)}
                  className="mt-2 text-xs font-bold text-[#0B84F3] hover:underline cursor-pointer"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Your Name"
                    className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0B84F3]"
                  />
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="Phone Number (+880)"
                    className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0B84F3]"
                  />
                </div>
                <textarea
                  rows={3}
                  value={contactMsg}
                  onChange={(e) => setContactMsg(e.target.value)}
                  placeholder="How can we help with your order or product inquiry?"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0B84F3]"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0B84F3] hover:bg-[#0669c7] text-white text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
