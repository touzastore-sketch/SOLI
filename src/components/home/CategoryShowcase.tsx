import React, { useState, useMemo, useCallback } from 'react';
import { 
  Sparkles, 
  Heart, 
  Droplets, 
  Dices, 
  Zap, 
  Layers, 
  Gem, 
  ShoppingBag, 
  Eye, 
  Star, 
  Check, 
  MessageCircle, 
  ArrowLeft, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { Product, ProductCategory } from '../../types';
import babydollImg from '../../assets/images/red_babydoll_model_1787126559624.jpg';
import coupleGameImg from '../../assets/images/couple_game_box_1787127729340.jpg';
import spaPedicureImg from '../../assets/images/luxury_spa_pedicure_1787127712907.jpg';

// Sub-component for individual product card with React.memo for high-performance rendering
interface ProductCardProps {
  product: Product;
  isAr: boolean;
  isFav: boolean;
  isJustAdded: boolean;
  whatsappNumber: string;
  onNavigate: (productId: string) => void;
  onToggleWishlist: (id: string) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (e: React.MouseEvent, product: Product) => void;
}

const ProductCardItem: React.FC<ProductCardProps> = React.memo(({
  product,
  isAr,
  isFav,
  isJustAdded,
  whatsappNumber,
  onNavigate,
  onToggleWishlist,
  onQuickView,
  onAddToCart
}) => {
  return (
    <div
      onClick={() => onNavigate(product)}
      className="group relative rounded-2xl bg-[#230206] border border-white/20 hover:border-white/60 p-4 sm:p-5 flex flex-col justify-between cursor-pointer transition-transform duration-200 hover:-translate-y-1 shadow-[0_10px_30px_rgba(0,0,0,0.7)] overflow-hidden contain-layout"
    >
      {/* Visual Image Container with Badges */}
      <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden mb-4 border border-white/15 bg-black/40">
        <img
          src={product.images[0]}
          alt={isAr ? product.nameAr : product.nameEn}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
        />

        {/* Gradient Shade */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#140103]/90 via-transparent to-black/30 pointer-events-none" />

        {/* Badges on Image */}
        <div className="absolute top-2.5 ltr:left-2.5 rtl:right-2.5 flex flex-col gap-1.5 z-10 pointer-events-none">
          {!product.inStock && (
            <span className="bg-[#DC2626] text-white text-[10px] font-black px-2.5 py-0.5 rounded shadow-md flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{isAr ? 'نفذ المخزون' : 'Out of Stock'}</span>
            </span>
          )}
          {product.tagAr && (
            <span className="bg-white text-[#4C0519] text-[10px] font-black px-2.5 py-0.5 rounded shadow-md">
              {isAr ? product.tagAr : product.tagEn}
            </span>
          )}
          {product.isSale && (
            <span className="bg-[#DC2626] text-white text-[10px] font-black px-2 py-0.5 rounded shadow">
              {isAr ? 'خصم خاص' : 'Sale'}
            </span>
          )}
        </div>

        {/* Wishlist and Quick View Buttons on Image */}
        <div className="absolute top-2.5 ltr:right-2.5 rtl:left-2.5 flex items-center gap-1.5 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.id);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer shadow-md ${
              isFav ? 'bg-white text-[#DC2626]' : 'bg-black/60 text-white hover:bg-white hover:text-[#4C0519] border border-white/20'
            }`}
            title={isAr ? 'المفضلة' : 'Wishlist'}
          >
            <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-[#DC2626]' : ''}`} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="w-8 h-8 rounded-full bg-black/60 text-white hover:bg-white hover:text-[#4C0519] border border-white/20 flex items-center justify-center transition-colors cursor-pointer shadow-md"
            title={isAr ? 'نظرة سريعة' : 'Quick View'}
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Rating Pill on Bottom Image */}
        <div className="absolute bottom-2.5 ltr:left-2.5 rtl:right-2.5 flex items-center gap-1 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded border border-white/20 text-xs">
          <Star className="w-3 h-3 fill-[#FECDD3] text-[#FECDD3]" />
          <span className="font-mono font-bold text-white text-[11px]">{product.rating}</span>
          <span className="text-[9px] text-white/70">({product.reviewsCount})</span>
        </div>
      </div>

      {/* Product Information */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-[11px] text-[#FECDD3] font-bold">
          <span>
            {isAr ? (product.subtitleAr || product.nameAr) : (product.subtitleEn || product.nameEn)}
          </span>
          <span className={`text-[10px] font-bold ${product.inStock ? 'text-[#22C55E]' : 'text-[#DC2626]'}`}>
            {product.inStock ? (isAr ? 'متوفر للتسليم' : 'In Stock') : (isAr ? 'نفذ المخزون' : 'Out of Stock')}
          </span>
        </div>

        <h4 className="font-serif-luxury text-base font-bold text-white group-hover:text-[#FECDD3] transition-colors leading-snug line-clamp-2">
          {isAr ? product.nameAr : product.nameEn}
        </h4>

        <p className="text-xs text-white/70 line-clamp-1 font-medium">
          {isAr ? product.subtitleAr : product.subtitleEn}
        </p>

        {/* Price Row */}
        <div className="flex items-baseline justify-between pt-2 border-t border-white/10">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-black text-white font-mono">
              {product.price.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-white/50 line-through font-mono">
                {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          <span className="text-[11px] text-[#FECDD3] font-bold hover:underline">
            {isAr ? 'التفاصيل ←' : 'Details →'}
          </span>
        </div>
      </div>

      {/* Interactive Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          type="button"
          onClick={(e) => onAddToCart(e, product)}
          disabled={!product.inStock || isJustAdded}
          className={`py-2.5 px-2 text-xs font-black uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md ${
            isJustAdded
              ? 'bg-[#16A34A] text-white border border-[#16A34A]'
              : !product.inStock
              ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
              : 'bg-white hover:bg-[#FFF5F5] text-[#4C0519]'
          }`}
        >
          {isJustAdded ? (
            <>
              <Check className="w-3.5 h-3.5 text-white" />
              <span>{isAr ? 'تمت الإضافة ✓' : 'Added ✓'}</span>
            </>
          ) : !product.inStock ? (
            <span>{isAr ? 'نفذ المخزون' : 'Out of Stock'}</span>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{isAr ? 'إضافة للسلة' : 'Add to Bag'}</span>
            </>
          )}
        </button>

        <a
          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
            `مرحباً روني ستور، أريد طلب المنتج التالي مباشرة:\n• المنتج: ${isAr ? product.nameAr : product.nameEn}\n• الكود: ${product.id}\n• السعر: ${product.price} ج.م`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="py-2.5 px-2 text-xs font-black uppercase tracking-wider rounded-xl flex items-center justify-center gap-1 bg-[#22C55E] hover:bg-[#16A34A] text-white transition-colors shadow-md cursor-pointer"
          title={isAr ? 'طلب فوري عبر واتساب' : 'Direct WhatsApp Order'}
        >
          <MessageCircle className="w-3.5 h-3.5 text-white" />
          <span>{isAr ? 'طلب واتساب' : 'WhatsApp'}</span>
        </a>
      </div>
    </div>
  );
});

ProductCardItem.displayName = 'ProductCardItem';

export const CategoryShowcase: React.FC = () => {
  const { 
    language, 
    products,
    categories,
    storeSettings,
    setSelectedCategory, 
    setCurrentView,
    addToCart,
    toggleWishlist,
    isInWishlist,
    navigateToProduct,
    setQuickViewProduct
  } = useShop();

  const isAr = language === 'ar';
  const whatsappNumber = storeSettings.whatsappOrder1 || '201095461883';
  
  // Local active category state for instant in-page filtering ('all' or specific category)
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  const handleProductAddToCart = useCallback((e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    if (!product.inStock) return;
    addToCart(product, product.colors[0], product.sizes[0] || 'Standard', 1);
    setRecentlyAddedId(product.id);
    setTimeout(() => setRecentlyAddedId(null), 2000);
  }, [addToCart]);

  // Ultra-fast category switch without waiting
  const handleCategorySelect = useCallback((categoryId: string) => {
    setActiveCategory(categoryId);
  }, []);

  // Category tiles configuration computed dynamically from categories & products
  const categoryTiles = useMemo(() => {
    const allTile = {
      id: 'all',
      nameAr: 'جميع الأقسام',
      nameEn: 'All Products',
      subtitleAr: 'تشكيلة المتجر بالكامل',
      subtitleEn: 'Complete Collection',
      count: products.length,
      icon: <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-white" />,
      image: babydollImg,
      badgeAr: 'الكتالوج الكامل',
      badgeEn: 'Full Catalog',
    };

    const getIconForCategory = (catId: string) => {
      if (catId === 'lingerie') return <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-[#FB7185] fill-[#FB7185]" />;
      if (catId === 'couple_games') return <Dices className="w-4 h-4 sm:w-5 sm:h-5 text-[#FBBF24]" />;
      if (catId === 'care_pedicure') return <Droplets className="w-4 h-4 sm:w-5 sm:h-5 text-[#38BDF8]" />;
      if (catId === 'men_enhancers') return <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-[#60A5FA]" />;
      if (catId === 'women_enhancers') return <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#F472B6]" />;
      return <Gem className="w-4 h-4 sm:w-5 sm:h-5 text-white" />;
    };

    const getFallbackImg = (catId: string, customImg?: string) => {
      if (customImg) return customImg;
      if (catId === 'lingerie') return babydollImg;
      if (catId === 'couple_games') return coupleGameImg;
      if (catId === 'care_pedicure') return spaPedicureImg;
      if (catId === 'men_enhancers') return 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=1200&auto=format&fit=crop';
      if (catId === 'women_enhancers') return 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1200&auto=format&fit=crop';
      return babydollImg;
    };

    const dynamicTiles = categories.map(cat => {
      const count = products.filter(p => p.category === cat.id).length;
      return {
        id: cat.id,
        nameAr: cat.nameAr,
        nameEn: cat.nameEn,
        subtitleAr: cat.descAr,
        subtitleEn: cat.descEn,
        count: count,
        icon: getIconForCategory(cat.id),
        image: getFallbackImg(cat.id, cat.image),
        badgeAr: isAr ? cat.nameAr : cat.nameEn,
        badgeEn: cat.nameEn,
      };
    });

    return [allTile, ...dynamicTiles];
  }, [categories, products, isAr]);

  // Instant lookup for filtered products from live products state
  const displayedProducts = useMemo(() => {
    if (activeCategory === 'all') {
      return products;
    }
    return products.filter(p => p.category === activeCategory);
  }, [products, activeCategory]);

  const currentCategoryTile = useMemo(() => {
    return categoryTiles.find(t => t.id === activeCategory) || categoryTiles[0];
  }, [categoryTiles, activeCategory]);

  return (
    <section 
      id="category-showcase-section"
      className="w-full relative py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-[#160104] via-[#100103] to-[#140103] border-t border-b border-white/15 overflow-hidden scroll-mt-20"
    >
      {/* Background Ambient Glow */}
      <div 
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[400px] rounded-full blur-[160px] opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #DC2626 0%, #4C0519 60%, transparent 80%)'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-white backdrop-blur-md shadow-sm">
              <Gem className="w-3.5 h-3.5 text-[#FECDD3] animate-pulse" />
              <span className="text-[11px] sm:text-xs font-black uppercase tracking-[0.25em] text-[#FECDD3]">
                {isAr ? 'أقسام وتشكيلات روني ستور' : 'RONY STORE DEPARTMENTS'}
              </span>
            </div>

            <h2 className="font-serif-luxury text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-wide">
              {isAr ? 'أقسام المنتجات' : 'Shop by Category'}
            </h2>

            <p className="text-xs sm:text-sm text-white/80 max-w-xl font-medium leading-relaxed">
              {isAr 
                ? 'اضغطي على أي قسم من المربعات لعرض منتجاته فوراً في الصفحة الرئيسية مع خيارات الطلب السريع عبر واتساب.'
                : 'Click any category square below to instantly reveal its curated products right here on the home page.'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-xs font-black text-white/90 bg-[#2A0307] border border-white/20 px-3 py-1.5 rounded-xl">
              {isAr ? `إجمالي المنتجات: ${products.length}` : `Total: ${products.length} items`}
            </span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* CHIC SMALL SQUARES GRID (مربعات الأقسام الصغيرة بشكل شيك) */}
        {/* ======================================================== */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-10">
          {categoryTiles.map((cat) => {
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onPointerDown={() => handleCategorySelect(cat.id)}
                onClick={() => handleCategorySelect(cat.id)}
                className={`group relative aspect-square rounded-2xl p-3 sm:p-4 flex flex-col justify-between items-center text-center cursor-pointer overflow-hidden shadow-lg select-none touch-manipulation transition-colors duration-75 ${
                  isActive
                    ? 'bg-[#38040B] border-2 border-white ring-4 ring-[#DC2626]/40 shadow-[0_0_20px_rgba(220,38,38,0.5)]'
                    : 'bg-[#200206]/90 border border-white/20 hover:border-white/50 hover:bg-[#2A0308]'
                }`}
              >
                {/* Background Image Thumbnail with Gradient Mask */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                  <img
                    src={cat.image}
                    alt={isAr ? cat.nameAr : cat.nameEn}
                    referrerPolicy="no-referrer"
                    loading="eager"
                    className="w-full h-full object-cover opacity-20 group-hover:opacity-35 transition-opacity duration-150 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#140103] via-[#1A0105]/75 to-transparent" />
                </div>

                {/* Top Badge & Counter Pill */}
                <div className="relative z-10 flex items-center justify-between w-full pointer-events-none">
                  <span className={`text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full border ${
                    isActive 
                      ? 'bg-white text-[#4C0519] border-white' 
                      : 'bg-black/60 text-white/90 border-white/20'
                  }`}>
                    {cat.count} {isAr ? 'منتج' : 'items'}
                  </span>

                  {isActive && (
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]"></span>
                    </span>
                  )}
                </div>

                {/* Center Icon Capsule */}
                <div className="relative z-10 my-auto flex flex-col items-center pointer-events-none">
                  <div className={`w-11 h-11 sm:w-13 sm:h-13 rounded-2xl flex items-center justify-center shadow-md ${
                    isActive
                      ? 'bg-white text-[#4C0519] shadow-lg scale-105'
                      : 'bg-white/10 text-white group-hover:bg-white group-hover:text-[#4C0519] border border-white/20'
                  }`}>
                    {cat.icon}
                  </div>
                </div>

                {/* Bottom Title & Highlight */}
                <div className="relative z-10 w-full space-y-0.5 pointer-events-none">
                  <h3 className={`text-xs sm:text-sm font-black leading-tight line-clamp-1 ${
                    isActive ? 'text-white font-serif-luxury text-[13px] sm:text-[15px]' : 'text-white/90 group-hover:text-white'
                  }`}>
                    {isAr ? cat.nameAr : cat.nameEn}
                  </h3>
                  <p className="text-[10px] text-[#FECDD3]/80 line-clamp-1 font-medium hidden sm:block">
                    {isAr ? cat.subtitleAr : cat.subtitleEn}
                  </p>
                </div>

                {/* Active Underline Glow Bar */}
                {isActive && (
                  <div className="absolute bottom-0 inset-x-4 h-1 bg-white rounded-t-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* ======================================================== */}
        {/* IN-PAGE DYNAMIC PRODUCTS HEADER (رأس عرض منتجات القسم) */}
        {/* ======================================================== */}
        <div className="bg-[#240307]/90 border border-white/20 rounded-2xl p-4 sm:p-5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-md">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-10 h-10 rounded-xl bg-white text-[#4C0519] flex items-center justify-center shadow shrink-0">
              {currentCategoryTile.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-luxury text-base sm:text-lg font-black text-white">
                  {isAr ? currentCategoryTile.nameAr : currentCategoryTile.nameEn}
                </h3>
                <span className="bg-[#DC2626] text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                  {displayedProducts.length} {isAr ? 'منتجات معروضة' : 'products'}
                </span>
              </div>
              <p className="text-xs text-white/75 font-medium">
                {isAr ? currentCategoryTile.subtitleAr : currentCategoryTile.subtitleEn}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setSelectedCategory(activeCategory === 'all' ? null : (activeCategory as ProductCategory));
              setCurrentView('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white text-white hover:text-[#4C0519] border border-white/30 text-xs font-black tracking-wider uppercase transition-colors duration-150 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{isAr ? 'فتح القسم في المتجر بالكامل' : 'Open in Shop View'}</span>
            {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* ======================================================== */}
        {/* IN-PAGE DYNAMIC PRODUCTS GRID (شبكة منتجات القسم بالكامل) */}
        {/* ======================================================== */}
        {displayedProducts.length === 0 ? (
          <div className="bg-[#240307]/80 border border-white/20 rounded-3xl p-10 sm:p-14 text-center space-y-4 shadow-2xl backdrop-blur-md">
            <div className="w-16 h-16 rounded-2xl bg-white/10 mx-auto flex items-center justify-center text-white border border-white/20">
              <ShoppingBag className="w-8 h-8 text-[#FECDD3]" />
            </div>
            <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-white">
              {isAr ? 'لا توجد منتجات مضافة في هذا القسم حالياً' : 'No products in this category yet'}
            </h3>
            <p className="text-xs sm:text-sm text-white/80 max-w-md mx-auto">
              {isAr
                ? 'التصنيفات والأقسام مهيأة بالكامل. يمكنك إضافة وتعديل منتجاتك الخاصة وصورك من لوحة التحكم بكل سهولة.'
                : 'Categories are ready. You can easily add and manage your custom products from the admin dashboard.'}
            </p>
            <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => setCurrentView('admin')}
                className="bg-white text-[#4C0519] hover:bg-[#FFF5F5] text-xs px-6 py-3 rounded-full font-black transition-colors cursor-pointer shadow-lg"
              >
                {isAr ? 'إضافة منتجات من لوحة التحكم' : 'Add Products in Admin'}
              </button>
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('مرحباً روني ستور، أود الاستفسار عن التشكيلات المتاحة')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#22C55E] hover:bg-[#16A34A] text-white text-xs px-6 py-3 rounded-full font-black transition-colors cursor-pointer shadow-lg flex items-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{isAr ? 'تواصل عبر واتساب' : 'Contact WhatsApp'}</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {displayedProducts.map((product) => {
              return (
                <ProductCardItem
                  key={product.id}
                  product={product}
                  isAr={isAr}
                  isFav={isInWishlist(product.id)}
                  isJustAdded={recentlyAddedId === product.id}
                  whatsappNumber={whatsappNumber}
                  onNavigate={navigateToProduct}
                  onToggleWishlist={toggleWishlist}
                  onQuickView={setQuickViewProduct}
                  onAddToCart={handleProductAddToCart}
                />
              );
            })}
          </div>
        )}

        {/* View Entire Shop CTA Footer */}
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={() => {
              setSelectedCategory(null);
              setCurrentView('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2.5 bg-white text-[#4C0519] hover:bg-[#FFF5F5] px-8 sm:px-12 py-4 text-xs sm:text-sm font-black tracking-wider uppercase rounded-full transition-transform duration-150 shadow-2xl hover:scale-105 cursor-pointer"
          >
            <span>{isAr ? 'المنتجات' : 'Products'}</span>
            {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </section>
  );
};
