import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  Menu, 
  X, 
  ShieldCheck, 
  Globe,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Flame,
  Gift,
  Truck,
  Layers,
  Dices,
  MessageCircle
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const Navbar: React.FC = () => {
  const {
    language,
    setLanguage,
    products,
    categories,
    storeSettings,
    currentView,
    setCurrentView,
    cartCount,
    setIsCartDrawerOpen,
    wishlist,
    setIsSearchModalOpen,
    setIsAuthModalOpen,
    user,
    selectedCategory,
    setSelectedCategory,
    setIsStylistOpen
  } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [mobileShopAccordionOpen, setMobileShopAccordionOpen] = useState(true);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const isAr = language === 'ar';
  const whatsappNumber = storeSettings.whatsappOrder1 || '201095461883';
  const announcementText = isAr
    ? (storeSettings.announcementTextAr || storeSettings.announcementTextAr || '✨ بيبي دول ولانجري سيلك • ألعاب زوجية • باديكير • محفزات رجالي وحريمي • تغليف سري 100%')
    : (storeSettings.announcementTextEn || '✨ Couture Babydolls & Silk • Couple Games • Pedicure • Men & Women Stimulants • 100% Discreet');

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShopDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const boutiqueServices = [
    {
      icon: <ShieldCheck className="w-4 h-4 text-white" />,
      titleAr: 'تغليف سري معتم 100%',
      titleEn: '100% Discreet Packaging',
      descAr: 'كرتون محايد بدون اسم المتجر أو تفاصيل المحتوى لضمان خصوصيتك',
      descEn: 'Plain unbranded sealed boxes with no external store branding'
    },
    {
      icon: <MessageCircle className="w-4 h-4 text-white" />,
      titleAr: 'استشارات ومقاسات خاصة سرية',
      titleEn: 'Private Sizing Concierge',
      descAr: 'مساعدة فورية وسرية لتحديد المقاسات وتنسيق أطقم الهدايا المناسبة',
      descEn: 'Confidential sizing assistance & gift curation'
    },
    {
      icon: <Truck className="w-4 h-4 text-white" />,
      titleAr: 'شحن سريع لكافة محافظات مصر',
      titleEn: 'Express Egypt Shipping',
      descAr: 'توصيل لباب المنزل مع خيار الدفع عند الاستلام (COD) وفودافون كاش',
      descEn: 'Doorstep delivery with Cash on Delivery & Mobile Wallets'
    },
    {
      icon: <Gift className="w-4 h-4 text-white" />,
      titleAr: 'خدمة بوكسات الإهداء الفاخرة',
      titleEn: 'Luxury Gift Boxing',
      descAr: 'تغليف مخملي أنيق مع كارت إهداء سري مجاني لمناسباتكم الخاصة',
      descEn: 'Signature velvet gift packaging with complimentary secret card'
    }
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#4C0519]/95 border-b border-[#991B1B]/40 text-white transition-all duration-300 shadow-xl">
      {/* Top Announcement Bar in Deep Red & White */}
      <div className="bg-[#3B060D] border-b border-[#7F1D1D] py-1.5 px-4 text-xs font-medium tracking-wide">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            <span className="text-white text-[11px] sm:text-xs font-bold">
              {announcementText}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] sm:text-xs">
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 text-white hover:text-[#FECDD3] transition-colors cursor-pointer font-bold"
            >
              <MessageCircle className="w-3.5 h-3.5 text-white" />
              <span>{isAr ? 'استشارة فورية عبر واتساب' : 'WhatsApp Concierge'}</span>
            </a>

            <div className="h-3 w-[1px] bg-white/30 hidden md:block" />

            <button
              onClick={() => setLanguage(isAr ? 'en' : 'ar')}
              className="flex items-center gap-1 text-white hover:text-[#FECDD3] transition-colors cursor-pointer font-sans font-bold"
            >
              <Globe className="w-3.5 h-3.5 text-white" />
              <span>{isAr ? 'English (EN)' : 'العربية (AR)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile menu button & search */}
          <div className="flex items-center gap-1.5 lg:hidden flex-1 justify-start">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-white hover:bg-white/10 rounded-lg focus:outline-none cursor-pointer flex items-center gap-1.5"
              aria-label="Toggle Navigation"
            >
              <Menu className="w-6 h-6 text-white" />
              <span className="text-xs font-bold hidden sm:inline">{isAr ? 'القائمة' : 'Menu'}</span>
            </button>

            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="p-2 text-white hover:bg-white/10 rounded-lg cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Desktop Left Nav Links with Mega Menu */}
          <nav className="hidden lg:flex items-center gap-6 flex-1 justify-start" ref={dropdownRef}>
            {/* Home Link */}
            <button
              onClick={() => {
                setCurrentView('home');
                setShopDropdownOpen(false);
              }}
              className={`text-sm tracking-wider uppercase font-semibold transition-colors duration-200 cursor-pointer relative py-2 ${
                currentView === 'home'
                  ? 'text-white font-bold'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {isAr ? 'الرئيسية' : 'Home'}
              {currentView === 'home' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-white rounded-full" />
              )}
            </button>

            {/* "المنتجات" with Mega Menu */}
            <div 
              className="relative"
              onMouseEnter={() => setShopDropdownOpen(true)}
            >
              <button
                onClick={() => {
                  setShopDropdownOpen(!shopDropdownOpen);
                }}
                className={`text-sm tracking-wider uppercase font-semibold transition-colors duration-200 cursor-pointer relative py-2 flex items-center gap-1.5 ${
                  currentView === 'shop'
                    ? 'text-white font-bold'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <span>{isAr ? 'المنتجات' : 'Products'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${shopDropdownOpen ? 'rotate-180 text-white' : ''}`} />
                {currentView === 'shop' && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-white rounded-full" />
                )}
              </button>

              {/* Desktop Mega Menu Dropdown */}
              {shopDropdownOpen && (
                <div 
                  className="absolute top-full ltr:left-0 rtl:right-0 w-[780px] bg-[#3B060D] border-2 border-white rounded-2xl shadow-2xl p-6 text-white mt-1 backdrop-blur-xl animate-fadeIn z-50"
                  onMouseLeave={() => setShopDropdownOpen(false)}
                >
                  <div className="grid grid-cols-12 gap-6">
                    {/* Categories Column (7 cols) */}
                    <div className="col-span-7 space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-white/20">
                        <span className="text-xs font-bold uppercase tracking-widest text-white">
                          {isAr ? 'أقسام المنتجات' : 'Product Categories'}
                        </span>
                        <button
                          onClick={() => {
                            setSelectedCategory(null);
                            setCurrentView('shop');
                            setShopDropdownOpen(false);
                          }}
                          className="text-xs text-[#FECDD3] hover:text-white font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <span>{isAr ? 'عرض جميع المنتجات' : 'View All Products'}</span>
                          {isAr ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                        </button>
                      </div>

                      <div className="space-y-3">
                        {categories.map(cat => {
                          const catCount = products.filter(p => p.category === cat.id).length;
                          return (
                            <div
                              key={cat.id}
                              onClick={() => {
                                setSelectedCategory(cat.id);
                                setCurrentView('shop');
                                setShopDropdownOpen(false);
                              }}
                              className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3 group ${
                                selectedCategory === cat.id && currentView === 'shop'
                                  ? 'bg-white text-[#4C0519] border-white font-bold shadow-lg'
                                  : 'bg-[#4C0519] border-white/30 hover:border-white hover:bg-[#580B17] text-white'
                              }`}
                            >
                              <img
                                src={cat.image}
                                alt={isAr ? cat.nameAr : cat.nameEn}
                                referrerPolicy="no-referrer"
                                className="w-14 h-14 object-cover rounded-lg shrink-0 border border-white/40"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h4 className={`text-xs font-bold transition-colors ${
                                    selectedCategory === cat.id && currentView === 'shop' ? 'text-[#4C0519]' : 'text-white'
                                  }`}>
                                    {isAr ? cat.nameAr : cat.nameEn}
                                  </h4>
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                    selectedCategory === cat.id && currentView === 'shop'
                                      ? 'bg-[#4C0519] text-white border-[#4C0519]'
                                      : 'bg-white/10 text-white border-white/30'
                                  }`}>
                                    {catCount} {isAr ? 'منتجات' : 'items'}
                                  </span>
                                </div>
                                <p className={`text-[11px] line-clamp-1 mt-0.5 ${
                                  selectedCategory === cat.id && currentView === 'shop' ? 'text-[#580B17]' : 'text-white/80'
                                }`}>
                                  {isAr ? cat.descAr : cat.descEn}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Quick Filter Badges */}
                      <div className="pt-2 flex items-center gap-2">
                        <span className="text-[10px] text-white/80 uppercase font-bold tracking-wider">
                          {isAr ? 'فلترة سريعة:' : 'Quick Filters:'}
                        </span>
                        <button
                          onClick={() => {
                            setSelectedCategory('lingerie');
                            setCurrentView('shop');
                            setShopDropdownOpen(false);
                          }}
                          className="text-[11px] px-3 py-1 rounded-full bg-white text-[#7F1D1D] font-bold hover:bg-[#FFF5F5] transition-colors cursor-pointer flex items-center gap-1 shadow-sm"
                        >
                          <Flame className="w-3 h-3 text-[#DC2626]" />
                          <span>{isAr ? 'بيبي دول الأكثر طلباً' : 'Bestsellers'}</span>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCategory('couple_games');
                            setCurrentView('shop');
                            setShopDropdownOpen(false);
                          }}
                          className="text-[11px] px-3 py-1 rounded-full bg-white text-[#7F1D1D] font-bold hover:bg-[#FFF5F5] transition-colors cursor-pointer flex items-center gap-1 shadow-sm"
                        >
                          <Dices className="w-3 h-3 text-[#DC2626]" />
                          <span>{isAr ? 'الألعاب الزوجية' : 'Couple Games'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Boutique Services & Guarantee Column (5 cols) */}
                    <div className="col-span-5 bg-[#4C0519] border border-white/30 rounded-xl p-4 flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-white block pb-2 mb-3 border-b border-white/20">
                          {isAr ? 'خدمات ومزايا روني' : 'Boutique Privileges'}
                        </span>
                        <div className="space-y-3">
                          {boutiqueServices.map((svc, i) => (
                            <div key={i} className="flex items-start gap-2.5">
                              <div className="p-1.5 rounded-lg bg-white/10 border border-white/30 shrink-0 mt-0.5 text-white">
                                {svc.icon}
                              </div>
                              <div>
                                <h5 className="text-[11px] font-bold text-white">
                                  {isAr ? svc.titleAr : svc.titleEn}
                                </h5>
                                <p className="text-[10px] text-white/80 leading-relaxed">
                                  {isAr ? svc.descAr : svc.descEn}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-white/20 mt-3">
                        <a
                          href="https://wa.me/201095461883"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-white py-2 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-lg"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-white" />
                          <span>{isAr ? 'استشارة فورية عبر واتساب' : 'Direct WhatsApp Assistance'}</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Direct Category Links */}
            <button
              onClick={() => {
                setSelectedCategory('lingerie');
                setCurrentView('shop');
                setShopDropdownOpen(false);
              }}
              className={`text-xs xl:text-sm tracking-wider uppercase font-semibold transition-colors duration-200 cursor-pointer relative py-2 ${
                currentView === 'shop' && selectedCategory === 'lingerie'
                  ? 'text-white font-bold'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {isAr ? 'بيبي دول ولانجري' : 'Babydolls & Silk'}
              {currentView === 'shop' && selectedCategory === 'lingerie' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-white rounded-full" />
              )}
            </button>

            <button
              onClick={() => {
                setSelectedCategory('couple_games');
                setCurrentView('shop');
                setShopDropdownOpen(false);
              }}
              className={`text-xs xl:text-sm tracking-wider uppercase font-semibold transition-colors duration-200 cursor-pointer relative py-2 ${
                currentView === 'shop' && selectedCategory === 'couple_games'
                  ? 'text-white font-bold'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {isAr ? 'ألعاب زوجية' : 'Couple Games'}
              {currentView === 'shop' && selectedCategory === 'couple_games' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-white rounded-full" />
              )}
            </button>

            <button
              onClick={() => {
                setSelectedCategory('care_pedicure');
                setCurrentView('shop');
                setShopDropdownOpen(false);
              }}
              className={`text-xs xl:text-sm tracking-wider uppercase font-semibold transition-colors duration-200 cursor-pointer relative py-2 ${
                currentView === 'shop' && selectedCategory === 'care_pedicure'
                  ? 'text-white font-bold'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {isAr ? 'باديكير' : 'Pedicure'}
              {currentView === 'shop' && selectedCategory === 'care_pedicure' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-white rounded-full" />
              )}
            </button>

            <button
              onClick={() => {
                setSelectedCategory('men_enhancers');
                setCurrentView('shop');
                setShopDropdownOpen(false);
              }}
              className={`text-xs xl:text-sm tracking-wider uppercase font-semibold transition-colors duration-200 cursor-pointer relative py-2 ${
                currentView === 'shop' && selectedCategory === 'men_enhancers'
                  ? 'text-white font-bold'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {isAr ? 'محفزات رجالي' : "Men's"}
              {currentView === 'shop' && selectedCategory === 'men_enhancers' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-white rounded-full" />
              )}
            </button>

            <button
              onClick={() => {
                setSelectedCategory('women_enhancers');
                setCurrentView('shop');
                setShopDropdownOpen(false);
              }}
              className={`text-xs xl:text-sm tracking-wider uppercase font-semibold transition-colors duration-200 cursor-pointer relative py-2 ${
                currentView === 'shop' && selectedCategory === 'women_enhancers'
                  ? 'text-white font-bold'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {isAr ? 'محفزات حريمي' : "Women's"}
              {currentView === 'shop' && selectedCategory === 'women_enhancers' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-white rounded-full" />
              )}
            </button>
          </nav>

          {/* Brand Logo - Centered Editorial in Deep Red & Pure White */}
          <div className="flex flex-col items-center cursor-pointer group px-2 shrink-0" onClick={() => setCurrentView('home')}>
            <span className="font-serif-luxury text-xl sm:text-2xl lg:text-3xl tracking-[0.22em] font-black text-white group-hover:text-[#FECDD3] transition-colors drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
              RONY STORE
            </span>
            <span className="text-[8px] sm:text-[9px] lg:text-[10px] tracking-[0.35em] text-white/90 uppercase font-sans -mt-0.5 font-bold">
              LE LUXE INTIME • CAIRO
            </span>
          </div>

          {/* Right Action Icons in Dark Red & White */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-1 justify-end">
            {/* Desktop Search Button */}
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="hidden lg:flex items-center gap-2 text-sm text-white hover:text-[#FECDD3] px-3.5 py-1.5 rounded-full bg-white/10 border border-white/40 hover:border-white transition-colors cursor-pointer"
              title={isAr ? 'بحث سريع' : 'Search products'}
            >
              <Search className="w-4 h-4 text-white" />
              <span className="text-xs text-white/90 font-medium">{isAr ? 'بحث...' : 'Search...'}</span>
            </button>

            {/* Wishlist Icon */}
            <button
              onClick={() => setCurrentView('wishlist')}
              className="p-2 text-white hover:text-[#FECDD3] relative rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              title={isAr ? 'المفضلة' : 'Wishlist'}
            >
              <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'text-white fill-white' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-white text-[#7F1D1D] text-[10px] flex items-center justify-center font-black">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Direct WhatsApp Ordering Helper */}
            <a
              href="https://wa.me/201095461883"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full bg-[#22C55E]/20 hover:bg-[#22C55E] border border-[#22C55E]/60 text-white transition-all cursor-pointer shadow-sm"
              title={isAr ? 'تواصل معنا عبر واتساب' : 'WhatsApp Support'}
            >
              <MessageCircle className="w-4 h-4 text-[#22C55E] group-hover:text-white" />
              <span className="text-xs font-bold hidden sm:inline">
                {isAr ? 'واتساب' : 'WhatsApp'}
              </span>
            </a>

            {/* Cart Button with Count Badge in Crisp White */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="flex items-center gap-2 bg-white hover:bg-[#FFF5F5] text-[#7F1D1D] px-3 sm:px-4 py-2 rounded-full transition-all duration-200 group cursor-pointer shadow-xl font-black border border-white"
              title={isAr ? 'حقيبة التسوق' : 'Shopping Bag'}
            >
              <ShoppingBag className="w-4 h-4 text-[#7F1D1D] group-hover:scale-110 transition-transform" />
              <span className="text-xs font-mono">{cartCount}</span>
            </button>
          </div>
        </div>
      </div>

      {/* High-End Luxury Slide-In Sidebar Drawer (Portaled to document.body to sit 100% on top of header) */}
      {mobileMenuOpen && createPortal(
        <div className="fixed inset-0 z-[99999] overflow-hidden">
          {/* Full-Screen Backdrop Blur Overlay */}
          <div 
            className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity duration-300 animate-fadeIn cursor-pointer"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Sliding Sidebar Panel (Right side in RTL, Left in LTR) */}
          <div 
            className="fixed inset-y-0 ltr:left-0 rtl:right-0 max-w-full w-[340px] sm:w-[380px] bg-gradient-to-b from-[#3B060D] via-[#240206] to-[#120002] border-l rtl:border-l-0 rtl:border-r border-white/20 shadow-[0_0_80px_rgba(0,0,0,0.95)] z-[100000] flex flex-col justify-between overflow-y-auto text-white animate-slideIn"
          >
            {/* Top Header of Sidebar */}
            <div className="p-5 border-b border-white/15 bg-black/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7F1D1D] to-[#4C0519] border border-white/30 flex items-center justify-center font-serif-luxury font-black text-base text-white shadow-md">
                  R
                </div>
                <div>
                  <h3 className="font-serif-luxury text-sm font-black tracking-widest text-white">
                    RONY STORE
                  </h3>
                  <p className="text-[10px] text-[#FECDD3] font-bold tracking-wider uppercase">
                    {isAr ? 'بوتيك الفخامة والخصوصية' : 'LUXURY BOUTIQUE'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#4C0519] flex items-center justify-center transition-colors cursor-pointer border border-white/20"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Body */}
            <div className="p-5 space-y-5 flex-1 overflow-y-auto">
              {/* Primary Quick Views */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-black tracking-[0.2em] text-[#FECDD3] block px-1 mb-2">
                  {isAr ? 'التنقل السريع' : 'Navigation'}
                </span>

                {/* Home */}
                <button
                  onClick={() => {
                    setCurrentView('home');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full p-3 rounded-xl flex items-center justify-between text-xs font-black transition-all cursor-pointer border ${
                    currentView === 'home'
                      ? 'bg-white text-[#4C0519] border-white shadow-lg'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#DC2626]" />
                    <span>{isAr ? 'الرئيسية' : 'Home'}</span>
                  </div>
                  {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>

                {/* "المنتجات" (All Products) */}
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setCurrentView('shop');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full p-3 rounded-xl flex items-center justify-between text-xs font-black transition-all cursor-pointer border ${
                    currentView === 'shop' && !selectedCategory
                      ? 'bg-white text-[#4C0519] border-white shadow-lg'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Layers className="w-4 h-4 text-white" />
                    <span>{isAr ? 'المنتجات' : 'Products'}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#DC2626] text-white font-mono font-bold">
                    {products.length}
                  </span>
                </button>
              </div>

              {/* Product Categories Breakdown */}
              <div className="space-y-2 pt-2 border-t border-white/15">
                <span className="text-[10px] uppercase font-black tracking-[0.2em] text-[#FECDD3] block px-1">
                  {isAr ? 'أقسام المنتجات الحصرية' : 'Exclusive Product Lines'}
                </span>

                <div className="space-y-2">
                  {categories.map(cat => {
                    const catCount = products.filter(p => p.category === cat.id).length;
                    return (
                      <div
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategory(cat.id);
                          setCurrentView('shop');
                          setMobileMenuOpen(false);
                        }}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                          selectedCategory === cat.id && currentView === 'shop'
                            ? 'bg-white text-[#4C0519] border-white shadow-md font-black'
                            : 'bg-white/5 border-white/10 hover:border-white/30 text-white'
                        }`}
                      >
                        <img
                          src={cat.image}
                          alt={isAr ? cat.nameAr : cat.nameEn}
                          referrerPolicy="no-referrer"
                          className="w-11 h-11 object-cover rounded-lg shrink-0 border border-white/30"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold truncate">
                              {isAr ? cat.nameAr : cat.nameEn}
                            </h4>
                            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                              selectedCategory === cat.id && currentView === 'shop'
                                ? 'bg-[#4C0519] text-white'
                                : 'bg-white/10 text-white'
                            }`}>
                              {catCount}
                            </span>
                          </div>
                          <p className="text-[10px] opacity-75 line-clamp-1 mt-0.5">
                            {isAr ? cat.descAr : cat.descEn}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Wishlist & Concierge Quick Actions */}
              <div className="space-y-2 pt-2 border-t border-white/15">
                <button
                  onClick={() => {
                    setCurrentView('wishlist');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white flex items-center justify-between text-xs font-bold cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Heart className={`w-4 h-4 ${wishlist.length > 0 ? 'text-[#DC2626] fill-[#DC2626]' : 'text-white'}`} />
                    <span>{isAr ? 'قائمة المفضلة' : 'My Wishlist'}</span>
                  </div>
                  {wishlist.length > 0 && (
                    <span className="text-[10px] bg-white text-[#7F1D1D] px-2 py-0.5 rounded-full font-black">
                      {wishlist.length}
                    </span>
                  )}
                </button>

                {/* VIP WhatsApp Consultation Box */}
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full p-3 rounded-xl bg-[#22C55E]/20 border border-[#22C55E]/60 text-white flex items-center justify-between text-xs font-bold cursor-pointer hover:bg-[#22C55E]/30 transition-colors shadow-lg"
                >
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-[#22C55E]" />
                    <span>{isAr ? 'استشارة ومقاسات فورية (واتساب)' : 'WhatsApp VIP Sizing Concierge'}</span>
                  </div>
                  <span className="text-[10px] bg-[#22C55E] text-white px-2 py-0.5 rounded-full font-black">
                    24/7
                  </span>
                </a>
              </div>

              {/* Animated Social Channels Row */}
              <div className="pt-2 border-t border-white/15 space-y-2">
                <span className="text-[10px] uppercase font-black tracking-[0.2em] text-[#FECDD3] block px-1">
                  {isAr ? 'قنوات التواصل والسوشيال' : 'Connect With Us'}
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-2.5 rounded-xl bg-[#22C55E]/20 border border-[#22C55E]/50 hover:bg-[#22C55E] flex items-center justify-center gap-1.5 text-[11px] font-bold text-white transition-all hover:scale-105"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>واتساب</span>
                  </a>
                  <a
                    href={storeSettings.instagramUrl || "https://instagram.com"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-2.5 rounded-xl bg-pink-600/20 border border-pink-500/50 hover:bg-pink-600 flex items-center justify-center gap-1.5 text-[11px] font-bold text-white transition-all hover:scale-105"
                  >
                    <span>إنستجرام</span>
                  </a>
                  <a
                    href={storeSettings.tiktokUrl || "https://tiktok.com"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-2.5 rounded-xl bg-white/10 border border-white/30 hover:bg-white hover:text-black flex items-center justify-center gap-1.5 text-[11px] font-bold text-white transition-all hover:scale-105"
                  >
                    <span>تيك توك</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom Footer Info in Sidebar */}
            <div className="p-4 border-t border-white/15 bg-black/30 space-y-3">
              <div className="flex items-center justify-between text-[11px] text-white/90">
                <span className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" />
                  {isAr ? 'تغليف سري معتم 100%' : '100% Discreet Packaging'}
                </span>

                <button
                  onClick={() => {
                    setLanguage(isAr ? 'en' : 'ar');
                    setMobileMenuOpen(false);
                  }}
                  className="font-bold text-white flex items-center gap-1 px-2.5 py-1 rounded bg-white/10 border border-white/20 cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{isAr ? 'English (EN)' : 'العربية (AR)'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
};
