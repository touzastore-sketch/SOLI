import React, { useState, useMemo } from 'react';
import { 
  Heart, 
  ShoppingBag, 
  Star, 
  ShieldCheck, 
  Lock, 
  Truck, 
  RotateCcw, 
  Share2, 
  Ruler, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Minus, 
  Plus, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight,
  CheckCircle2,
  MessageCircle,
  HelpCircle,
  AlertCircle,
  Copy,
  Link as LinkIcon,
  ExternalLink,
  Megaphone
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { SizeGuideModal } from '../layout/SizeGuideModal';

export const ProductDetailView: React.FC = () => {
  const {
    language,
    products,
    categories,
    storeSettings,
    selectedProduct,
    setSelectedCategory,
    setCurrentView,
    addToCart,
    toggleWishlist,
    isInWishlist,
    showToast,
    setIsStylistOpen,
    navigateToProduct,
    getProductShareUrl,
    copyProductShareUrl
  } = useShop();

  const isAr = language === 'ar';
  const whatsappNumber = storeSettings.whatsappOrder1 || '201095461883';
  const product = selectedProduct || products[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || { nameAr: 'افتراضي', nameEn: 'Standard', hex: '#800020', value: 'standard' });
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || 'Standard');
  const [quantity, setQuantity] = useState(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({
    description: true,
    specs: false,
    care: false
  });

  React.useEffect(() => {
    setActiveImageIndex(0);
    if (product?.colors && product.colors.length > 0) {
      setSelectedColor(product.colors[0]);
    }
    if (product?.sizes && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0]);
    }
    setQuantity(1);
  }, [product?.id]);

  const isFav = product ? isInWishlist(product.id) : false;

  const toggleAccordion = (key: string) => {
    setOpenAccordions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleShare = () => {
    if (!product) return;
    if (navigator.share) {
      navigator.share({
        title: isAr ? product.nameAr : product.nameEn,
        text: isAr ? product.descriptionAr : product.descriptionEn,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast(isAr ? 'تم نسخ رابط المنتج إلى الحافظة' : 'Product link copied to clipboard', 'info');
    }
  };

  // Related items
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products.filter(
      p => p.id !== product.id && p.category === product.category
    ).slice(0, 3);
  }, [products, product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#160103] text-white py-16 text-center">
        <p>{isAr ? 'المنتج غير موجود' : 'Product not found'}</p>
        <button
          onClick={() => setCurrentView('shop')}
          className="mt-4 px-6 py-2 bg-white text-[#4C0519] font-bold rounded-xl"
        >
          {isAr ? 'العودة للمتجر' : 'Back to Shop'}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#160103] text-white py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-white/70 mb-6 font-medium">
          <button
            onClick={() => setCurrentView('home')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            {isAr ? 'الرئيسية' : 'Home'}
          </button>
          <span>/</span>
          <button
            onClick={() => {
              setSelectedCategory(null);
              setCurrentView('shop');
            }}
            className="hover:text-white transition-colors cursor-pointer"
          >
            {isAr ? 'المتجر' : 'Shop'}
          </button>
          <span>/</span>
          <button
            onClick={() => {
              setSelectedCategory(product.category);
              setCurrentView('shop');
            }}
            className="hover:text-[#FECDD3] transition-colors cursor-pointer"
          >
            {product.category === 'lingerie'
              ? isAr ? 'بيبي دول ولانجري' : 'Lingerie'
              : product.category === 'couple_games'
              ? isAr ? 'ألعاب زوجية' : 'Couple Games'
              : product.category === 'care_pedicure'
              ? isAr ? 'باديكير' : 'Pedicure'
              : product.category === 'men_enhancers'
              ? isAr ? 'محفزات رجالي' : "Men's Stimulants"
              : isAr ? 'محفزات حريمي' : "Women's Stimulants"}
          </button>
          <span>/</span>
          <span className="text-white font-bold truncate max-w-xs">
            {isAr ? product.nameAr : product.nameEn}
          </span>
        </nav>

        {/* Main Product Layout with Balanced Proportions & Fast Loading */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 mb-14 items-start">
          {/* Left / Gallery Column (Refined, Balanced Size) */}
          <div className="lg:col-span-5 flex flex-col gap-3.5 max-w-md mx-auto lg:max-w-none w-full">
            {/* Main Showcase Image Frame */}
            <div className="relative aspect-[4/5] max-h-[460px] w-full rounded-2xl overflow-hidden bg-[#200205] border border-white/20 shadow-xl flex items-center justify-center group">
              {/* Product Image */}
              <img
                key={activeImageIndex}
                src={product.images[activeImageIndex] || product.images[0]}
                alt={isAr ? product.nameAr : product.nameEn}
                referrerPolicy="no-referrer"
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
              />

              {/* Top Badges & Wishlist Action */}
              <div className="absolute top-3 inset-x-3 flex items-start justify-between z-10 pointer-events-none">
                <div className="flex flex-col gap-1.5 pointer-events-auto">
                  {product.tagAr && (
                    <span className="bg-white text-[#4C0519] text-[10px] sm:text-[11px] font-black px-3 py-1 uppercase tracking-wider rounded-lg shadow-md">
                      {isAr ? product.tagAr : product.tagEn}
                    </span>
                  )}
                  {product.isSale && (
                    <span className="bg-[#DC2626] text-white text-[10px] sm:text-[11px] font-black px-2.5 py-1 uppercase tracking-wider rounded-lg shadow-md">
                      {isAr ? 'عرض خاص' : 'Sale'}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/30 flex items-center justify-center transition-all cursor-pointer shadow-lg pointer-events-auto ${
                    isFav 
                      ? 'text-[#DC2626] bg-white border-white' 
                      : 'text-white bg-black/60 backdrop-blur-sm hover:bg-white hover:text-[#4C0519]'
                  }`}
                  title={isAr ? 'حفظ في المفضلة' : 'Save to Wishlist'}
                >
                  <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isFav ? 'fill-[#DC2626]' : ''}`} />
                </button>
              </div>

              {/* Quick Image Counter Pill */}
              {product.images.length > 1 && (
                <div className="absolute bottom-3 ltr:right-3 rtl:left-3 bg-black/70 backdrop-blur-sm text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border border-white/20">
                  {activeImageIndex + 1} / {product.images.length}
                </div>
              )}
            </div>

            {/* Thumbnail Carousel Underneath */}
            {product.images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1.5 scrollbar-thin">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-20 sm:w-18 sm:h-22 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                      activeImageIndex === idx
                        ? 'border-white ring-2 ring-[#FECDD3]/50 scale-105 shadow-md'
                        : 'border-white/20 opacity-70 hover:opacity-100 bg-[#250307]'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right / Product Details & Actions Column */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6 bg-[#230206] p-6 sm:p-8 rounded-2xl border border-white/20 shadow-xl">
            <div>
              {/* Category Subtitle & Rating */}
              <div className="flex items-center justify-between gap-4 mb-3">
                <span className="text-xs font-black uppercase tracking-[0.25em] text-[#FECDD3]">
                  {product.subtitleAr && (isAr ? product.subtitleAr : product.subtitleEn)}
                </span>

                <div className="flex items-center gap-1.5 text-white bg-white/10 px-3 py-1 border border-white/20">
                  <Star className="w-3.5 h-3.5 fill-[#FECDD3] text-[#FECDD3]" />
                  <span className="text-xs font-black font-mono">{product.rating}</span>
                  <span className="text-[11px] text-white/70">
                    ({product.reviewsCount} {isAr ? 'تقييم موثق' : 'verified'})
                  </span>
                </div>
              </div>

              {/* Main Title */}
              <h1 className="font-serif-luxury text-3xl sm:text-4xl font-black text-white leading-tight mb-4 drop-shadow">
                {isAr ? product.nameAr : product.nameEn}
              </h1>

              {/* Pricing Strip */}
              <div className="flex items-baseline gap-4 mb-5 pb-5 border-b border-white/15">
                <span className="text-3xl sm:text-4xl font-black font-mono text-white">
                  {product.price.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-white/60 line-through font-mono">
                    {product.originalPrice.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
                  </span>
                )}
                {product.originalPrice && (
                  <span className="text-xs bg-[#DC2626] text-white font-black px-2.5 py-1">
                    {isAr
                      ? `خصم ${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%`
                      : `${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF`}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-white/90 leading-relaxed mb-6 font-medium">
                {isAr ? product.descriptionAr : product.descriptionEn}
              </p>

              {/* Color Selector */}
              {product.colors.length > 0 && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="text-xs font-bold text-white/90">
                      {isAr ? 'اللون المختار:' : 'Select Color:'}{' '}
                      <span className="text-[#FECDD3] font-black">
                        {isAr ? selectedColor.nameAr : selectedColor.nameEn}
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {product.colors.map(col => (
                      <button
                        key={col.value}
                        onClick={() => setSelectedColor(col)}
                        className={`w-9 h-9 border-2 transition-all cursor-pointer relative flex items-center justify-center ${
                          selectedColor.value === col.value
                            ? 'border-white ring-2 ring-white/40 scale-110 shadow-lg'
                            : 'border-white/30 opacity-70 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: col.hex }}
                        title={isAr ? col.nameAr : col.nameEn}
                      >
                        {selectedColor.value === col.value && (
                          <span
                            className={`w-2 h-2 rounded-full ${
                              col.value === 'ivory' || col.value === 'pearl' || col.value === 'white'
                                ? 'bg-black'
                                : 'bg-white'
                            }`}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              {product.sizes.length > 0 && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="text-xs font-bold text-white/90">
                      {isAr ? 'المقاس:' : 'Select Size:'}{' '}
                      <span className="text-[#FECDD3] font-black">{selectedSize}</span>
                    </span>

                    <button
                      onClick={() => setIsSizeGuideOpen(true)}
                      className="text-xs text-[#FECDD3] hover:underline flex items-center gap-1 cursor-pointer font-bold"
                    >
                      <Ruler className="w-3.5 h-3.5" />
                      <span>{isAr ? 'دليل المقاسات الدقيق' : 'Size Guide'}</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {product.sizes.map(sz => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`min-w-[50px] py-2.5 px-3.5 text-xs font-mono font-bold transition-all cursor-pointer ${
                          selectedSize === sz
                            ? 'bg-white text-[#4C0519] shadow-md'
                            : 'bg-white/10 text-white/80 hover:bg-white/20 border border-white/20'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity & CTA Row */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2 mb-6">
                {/* Quantity Controls */}
                <div className="flex items-center justify-between border border-white/20 bg-white/10 px-3 py-2 sm:w-32 shrink-0">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 text-white/70 hover:text-white transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-mono text-sm font-bold text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1 text-white/70 hover:text-white transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Cart CTA */}
                <button
                  onClick={() => addToCart(product, selectedColor, selectedSize, quantity)}
                  className="flex-1 bg-white hover:bg-[#FFF5F5] text-[#4C0519] py-4 px-6 font-black text-xs sm:text-sm tracking-widest uppercase flex items-center justify-center gap-2.5 transition-all shadow-xl cursor-pointer hover:scale-102 group"
                >
                  <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform text-[#4C0519]" />
                  <span>{isAr ? 'إضافة إلى الحقيبة' : 'Add to Bag'}</span>
                  <span className="font-mono text-xs opacity-90 font-bold">
                    • {(product.price * quantity).toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
                  </span>
                </button>

                {/* Direct WhatsApp Quick Order Button */}
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                    `*طلب سريع من متجر روني (RONY STORE)*\n----------------------------------------\n- المنتج: ${isAr ? product.nameAr : product.nameEn}\n- كود المنتج: #${product.id}\n- المقاس: ${selectedSize}\n- اللون: ${isAr ? selectedColor.nameAr : selectedColor.nameEn}\n- الكمية: ${quantity}\n- السعر الإجمالي: ${(product.price * quantity).toLocaleString()} جنيه\n----------------------------------------\n*أرجو تأكيد توفر المنتج والطلب.*`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#22C55E] hover:bg-[#16A34A] text-white py-4 px-6 font-black text-xs sm:text-sm tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer"
                  title={isAr ? 'طلب فوري ومباشر عبر واتساب' : 'Instant WhatsApp Order'}
                >
                  <MessageCircle className="w-4 h-4 text-white" />
                  <span>{isAr ? 'طلب سريع واتساب' : 'WhatsApp Order'}</span>
                </a>

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  className="p-3.5 border border-white/20 bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  title={isAr ? 'مشاركة المنتج' : 'Share'}
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* Dedicated Facebook Ad & Social Direct Campaign Box */}
              <div className="p-4 bg-gradient-to-r from-[#1877F2]/15 via-white/5 to-[#1877F2]/10 border border-[#1877F2]/40 rounded-2xl space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-white font-black text-xs">
                    <Megaphone className="w-4 h-4 text-[#38BDF8]" />
                    <span>{isAr ? 'رابط إعلان فيسبوك المباشر للمنتج' : 'Direct Facebook Ad Campaign Link'}</span>
                  </div>
                  <span className="text-[10px] bg-[#1877F2]/30 text-[#93C5FD] font-mono px-2 py-0.5 rounded-full border border-[#1877F2]/50">
                    /product?id={product.id}
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-black/60 p-2 rounded-xl border border-white/15">
                  <input
                    type="text"
                    readOnly
                    value={getProductShareUrl(product.id)}
                    className="w-full bg-transparent text-[11px] font-mono text-white/90 focus:outline-none select-all px-1"
                  />
                  <button
                    type="button"
                    onClick={() => copyProductShareUrl(product.id, isAr ? product.nameAr : product.nameEn)}
                    className="py-1.5 px-3 rounded-lg bg-white hover:bg-[#FFF5F5] text-[#1877F2] font-black text-[11px] flex items-center gap-1.5 shrink-0 transition-transform active:scale-95 cursor-pointer shadow"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{isAr ? 'نسخ الرابط' : 'Copy'}</span>
                  </button>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1 text-[10px]">
                  <p className="text-white/70">
                    {isAr 
                      ? '🎯 استخدم هذا الرابط في إعلاناتك على فيسبوك وإنستجرام لنقل العميل مباشرة لصفحة هذا المنتج!' 
                      : 'Use this URL in Facebook/Instagram Ads to direct shoppers directly to this product!'}
                  </p>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getProductShareUrl(product.id))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#93C5FD] hover:text-white flex items-center gap-1 shrink-0 font-bold underline cursor-pointer"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>{isAr ? 'نشر فيسبوك' : 'Share FB'}</span>
                  </a>
                </div>
              </div>

              {/* Discreet Shipping Promise Highlight Card */}
              <div className="p-4 bg-white/5 border border-white/20 space-y-2">
                <div className="flex items-center gap-2 text-white font-black text-xs">
                  <Lock className="w-4 h-4 text-[#FECDD3]" />
                  <span>{isAr ? 'ضمان الخصوصية والتغليف السري 100%' : '100% Guaranteed Discreet Shipping'}</span>
                </div>
                <p className="text-[11px] text-white/80 leading-relaxed font-medium">
                  {isAr
                    ? 'يتم تغليف طلبك في كرتونة محايدة تماماً خالية من أي اسم أو علامة تجارية تدل على المحتوى، مع تسليم آمن وسري حتى باب منزلك.'
                    : 'Delivered in a completely plain, unmarked box with zero indication of intimate content.'}
                </p>
                <div className="flex items-center gap-4 pt-1 text-[10px] text-white/70">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-[#FECDD3]" />
                    {isAr ? 'توصيل 24-48 ساعة' : '24-48h Delivery'}
                  </span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" />
                    {isAr ? 'دفع عند الاستلام متاح' : 'COD Available'}
                  </span>
                </div>
              </div>
            </div>

            {/* Private WhatsApp VIP Consultation Button */}
            <div className="pt-2">
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(isAr ? `مرحباً روني ستور، أود الاستفسار بخصوص المقاس وتفاصيل المنتج: ${product.nameAr}` : `Hello Rony Store, I would like to inquire about sizing for: ${product.nameEn}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#22C55E]/20 hover:bg-[#22C55E]/30 border border-[#22C55E]/40 text-white py-3 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-[#22C55E]" />
                <span>{isAr ? 'استفسار فوري عن المقاس والتفاصيل عبر واتساب' : 'Need help with sizing? Ask us on WhatsApp'}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Expandable Accordions for Specs & Care */}
        <div className="max-w-4xl mx-auto space-y-3 mb-16">
          {/* Description */}
          <div className="bg-[#230206] border border-white/20 overflow-hidden">
            <button
              onClick={() => toggleAccordion('description')}
              className="w-full p-4 text-right rtl:text-right ltr:text-left flex items-center justify-between font-serif-luxury text-base font-bold text-white hover:bg-white/5 transition-colors"
            >
              <span>{isAr ? 'الوصف والتفاصيل الدقيقة' : 'Description & Craftsmanship'}</span>
              {openAccordions.description ? <ChevronUp className="w-4 h-4 text-white" /> : <ChevronDown className="w-4 h-4 text-white/60" />}
            </button>
            {openAccordions.description && (
              <div className="p-4 pt-0 text-xs text-white/80 leading-relaxed border-t border-white/10">
                <p className="mb-3">{isAr ? product.descriptionAr : product.descriptionEn}</p>
                {product.fabricAr && (
                  <div className="p-3 bg-white/5 border border-white/10 text-xs">
                    <span className="font-bold text-white">{isAr ? 'الخامة:' : 'Fabric Composition:'} </span>
                    <span className="text-[#FECDD3] font-medium">{isAr ? product.fabricAr : product.fabricEn}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Specs */}
          <div className="bg-[#230206] border border-white/20 overflow-hidden">
            <button
              onClick={() => toggleAccordion('specs')}
              className="w-full p-4 text-right rtl:text-right ltr:text-left flex items-center justify-between font-serif-luxury text-base font-bold text-white hover:bg-white/5 transition-colors"
            >
              <span>{isAr ? 'المواصفات ومميزات التصميم' : 'Specifications & Features'}</span>
              {openAccordions.specs ? <ChevronUp className="w-4 h-4 text-white" /> : <ChevronDown className="w-4 h-4 text-white/60" />}
            </button>
            {openAccordions.specs && (
              <div className="p-4 pt-0 text-xs text-white/80 border-t border-white/10">
                <ul className="space-y-2">
                  {(isAr ? product.specsAr : product.specsEn).map((spec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E] shrink-0 mt-0.5" />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Care Guide */}
          <div className="bg-[#230206] border border-white/20 overflow-hidden">
            <button
              onClick={() => toggleAccordion('care')}
              className="w-full p-4 text-right rtl:text-right ltr:text-left flex items-center justify-between font-serif-luxury text-base font-bold text-white hover:bg-white/5 transition-colors"
            >
              <span>{isAr ? 'إرشادات العناية بالحرير والدانتيل' : 'Care & Maintenance Guide'}</span>
              {openAccordions.care ? <ChevronUp className="w-4 h-4 text-white" /> : <ChevronDown className="w-4 h-4 text-white/60" />}
            </button>
            {openAccordions.care && (
              <div className="p-4 pt-0 text-xs text-white/80 border-t border-white/10">
                <ul className="space-y-2">
                  {(isAr ? product.careGuideAr : product.careGuideEn).map((care, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-[#FECDD3] shrink-0 mt-1.5" />
                      <span>{care}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Showcase - Full-Bleed Grid */}
        <div className="pt-12 border-t border-white/15">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-[#FECDD3]">
                {isAr ? 'مختارات مماثلة' : 'Related Elegance'}
              </span>
              <h3 className="font-serif-luxury text-2xl font-black text-white">
                {isAr ? 'قد يعجبكِ أيضاً' : 'You May Also Adore'}
              </h3>
            </div>
            <button
              onClick={() => {
                setSelectedCategory(null);
                setCurrentView('shop');
              }}
              className="text-xs text-[#FECDD3] hover:underline flex items-center gap-1 font-bold cursor-pointer"
            >
              <span>{isAr ? 'مشاهدة المزيد' : 'View More'}</span>
              {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/10">
            {relatedProducts.map(rel => (
              <div
                key={rel.id}
                onClick={() => navigateToProduct(rel.id)}
                className="group relative min-h-[420px] flex flex-col justify-end p-6 cursor-pointer overflow-hidden transition-all duration-500 bg-[#250308]"
              >
                {/* Ken Burns Background Layer */}
                <div 
                  className="absolute inset-0 scale-105 group-hover:scale-110 transition-transform duration-1000 animate-ken-burns-subtle"
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(60, 10, 20, 0.15) 0%, rgba(35, 4, 12, 0.6) 50%, rgba(15, 1, 4, 0.95) 100%), url('${rel.images[0]}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />

                <div className="relative z-10 space-y-1.5">
                  <h4 className="font-serif-luxury text-base font-bold text-white group-hover:text-[#FECDD3] transition-colors truncate">
                    {isAr ? rel.nameAr : rel.nameEn}
                  </h4>
                  <div className="flex items-baseline justify-between pt-1 border-t border-white/15">
                    <span className="text-sm font-mono font-black text-white">
                      {rel.price.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
                    </span>
                    <span className="text-xs text-[#FECDD3] font-bold">
                      {isAr ? 'عرض التفاصيل' : 'View'} →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
    </div>
  );
};
