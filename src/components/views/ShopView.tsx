import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  SlidersHorizontal, 
  ChevronDown, 
  Heart, 
  Eye, 
  ShoppingBag, 
  Star, 
  RotateCcw,
  Check, 
  Lock, 
  Sparkles,
  MessageCircle,
  ArrowLeft,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { Product } from '../../types';

export const ShopView: React.FC = () => {
  const {
    language,
    products,
    categories,
    storeSettings,
    setCurrentView,
    selectedCategory,
    setSelectedCategory,
    navigateToProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setQuickViewProduct
  } = useShop();

  const isAr = language === 'ar';
  const whatsappNumber = storeSettings.whatsappOrder1 || '201095461883';

  const [priceRange, setPriceRange] = useState<number>(1500);
  const [selectedQuickFilter, setSelectedQuickFilter] = useState<'all' | 'new' | 'bestseller' | 'sale'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high' | 'rating'>('featured');
  const [minRating, setMinRating] = useState<number>(0);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  const handleProductAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    if (!product.inStock || recentlyAddedId === product.id) return;
    
    addToCart(product);
    setRecentlyAddedId(product.id);
    setTimeout(() => {
      setRecentlyAddedId(prev => (prev === product.id ? null : prev));
    }, 1800);
  };

  // Filtering products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      if (selectedCategory && product.category !== selectedCategory) {
        return false;
      }
      if (product.price > priceRange) {
        return false;
      }
      if (selectedQuickFilter === 'new' && !product.isNew) return false;
      if (selectedQuickFilter === 'bestseller' && !product.isBestSeller) return false;
      if (selectedQuickFilter === 'sale' && !product.isSale) return false;
      if (minRating > 0 && product.rating < minRating) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_low') return a.price - b.price;
      if (sortBy === 'price_high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [products, selectedCategory, priceRange, selectedQuickFilter, sortBy, minRating]);

  const resetFilters = () => {
    setSelectedCategory(null);
    setPriceRange(1500);
    setSelectedQuickFilter('all');
    setSortBy('featured');
    setMinRating(0);
  };

  const getCategoryTitle = () => {
    if (!selectedCategory) return isAr ? 'جميع المنتجات' : 'All Products';
    const found = categories.find(c => c.id === selectedCategory);
    if (found) return isAr ? found.nameAr : found.nameEn;
    if (selectedCategory === 'lingerie') return isAr ? 'بيبي دول ولانجري سيلك' : 'Couture Babydolls & Silk';
    if (selectedCategory === 'couple_games') return isAr ? 'ألعاب وصناديق زوجية' : 'Curated Couple Games & Romance';
    if (selectedCategory === 'care_pedicure') return isAr ? 'باديكير' : 'Pedicure Essentials';
    if (selectedCategory === 'men_enhancers') return isAr ? 'محفزات رجالي' : "Men's Stimulants & Enhancers";
    if (selectedCategory === 'women_enhancers') return isAr ? 'محفزات حريمي' : "Women's Stimulants & Drops";
    return isAr ? 'المنتجات' : 'Products';
  };

  return (
    <div className="min-h-screen bg-[#160103] text-white py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-white/70 mb-6 font-medium">
          <button
            onClick={() => setCurrentView('home')}
            className="hover:text-white hover:underline transition-colors cursor-pointer"
          >
            {isAr ? 'الرئيسية' : 'Home'}
          </button>
          <span>/</span>
          <span className="text-white font-bold">
            {isAr ? 'المنتجات' : 'Products'}
          </span>
          {selectedCategory && (
            <>
              <span>/</span>
              <span className="text-[#FECDD3] font-black">{getCategoryTitle()}</span>
            </>
          )}
        </nav>

        {/* Page Header with Atmospheric Maroon Backdrop */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-white/15 gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
              <span className="text-xs font-black uppercase tracking-[0.25em] text-white/90">
                {isAr ? 'كتالوج روني ستور الحصري' : 'Exclusive Catalog'}
              </span>
            </div>
            <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-black text-white">
              {getCategoryTitle()}
            </h1>
            <p className="text-xs sm:text-sm text-white/80 mt-2 max-w-xl font-medium">
              {isAr
                ? 'استمتعي بأرقى موديلات البيبي دول والألعاب الزوجية التفاعلية مع تغليف سري محكم 100% وبدون إطارات منفصلة.'
                : 'Browse our signature babydolls, couple games, and pedicure spa sets integrated into one continuous atmospheric experience.'}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Quick Filter Pills */}
            <div className="flex items-center bg-white/10 p-1 border border-white/20 backdrop-blur-md">
              <button
                onClick={() => setSelectedQuickFilter('all')}
                className={`px-3.5 py-1.5 text-xs font-black transition-colors cursor-pointer ${
                  selectedQuickFilter === 'all'
                    ? 'bg-white text-[#4C0519]'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {isAr ? 'الكل' : 'All'}
              </button>
              <button
                onClick={() => setSelectedQuickFilter('new')}
                className={`px-3.5 py-1.5 text-xs font-black transition-colors cursor-pointer ${
                  selectedQuickFilter === 'new'
                    ? 'bg-white text-[#4C0519]'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {isAr ? 'وصل حديثاً' : 'New In'}
              </button>
              <button
                onClick={() => setSelectedQuickFilter('bestseller')}
                className={`px-3.5 py-1.5 text-xs font-black transition-colors cursor-pointer ${
                  selectedQuickFilter === 'bestseller'
                    ? 'bg-white text-[#4C0519]'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {isAr ? 'الأكثر مبيعاً' : 'Bestsellers'}
              </button>
              <button
                onClick={() => setSelectedQuickFilter('sale')}
                className={`px-3.5 py-1.5 text-xs font-black transition-colors cursor-pointer ${
                  selectedQuickFilter === 'sale'
                    ? 'bg-[#DC2626] text-white'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {isAr ? 'العروض' : 'Sale'}
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white/10 border border-white/30 text-xs text-white px-4 py-2 appearance-none pr-8 rtl:pr-4 rtl:pl-8 focus:outline-none focus:border-white cursor-pointer font-bold backdrop-blur-md"
              >
                <option value="featured" className="bg-[#2D040A] text-white">{isAr ? 'الترتيب: المميز' : 'Sort: Featured'}</option>
                <option value="price_low" className="bg-[#2D040A] text-white">{isAr ? 'السعر: من الأقل للأعلى' : 'Price: Low to High'}</option>
                <option value="price_high" className="bg-[#2D040A] text-white">{isAr ? 'السعر: من الأعلى للأقل' : 'Price: High to Low'}</option>
                <option value="rating" className="bg-[#2D040A] text-white">{isAr ? 'الأعلى تقييماً' : 'Highest Rated'}</option>
              </select>
              <ChevronDown className="w-4 h-4 text-white absolute top-2.5 ltr:right-2.5 rtl:left-2.5 pointer-events-none" />
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden bg-white/10 border border-white/30 p-2.5 text-white hover:bg-white/20 flex items-center gap-1.5 text-xs font-black"
            >
              <Filter className="w-4 h-4" />
              <span>{isAr ? 'الفلاتر' : 'Filters'}</span>
            </button>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left / Sidebar Filters */}
          <aside className={`lg:col-span-3 space-y-6 ${mobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-[#230206] border border-white/20 p-6 space-y-6 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between pb-3 border-b border-white/15">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-white" />
                  <h3 className="font-serif-luxury text-base font-black text-white">
                    {isAr ? 'تصفية المنتجات' : 'Filter Products'}
                  </h3>
                </div>

                {(selectedCategory || priceRange < 1500 || selectedQuickFilter !== 'all' || minRating > 0) && (
                  <button
                    onClick={resetFilters}
                    className="text-[11px] text-[#FECDD3] hover:underline flex items-center gap-1 cursor-pointer font-bold"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{isAr ? 'إعادة ضبط' : 'Reset'}</span>
                  </button>
                )}
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-white mb-3">
                  {isAr ? 'التصنيف' : 'Category'}
                </h4>
                <div className="space-y-1.5 text-xs">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full text-right rtl:text-right ltr:text-left py-2.5 px-3 flex items-center justify-between transition-colors cursor-pointer font-bold ${
                      selectedCategory === null
                        ? 'bg-white text-[#4C0519]'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span>{isAr ? 'جميع الأقسام' : 'All Categories'}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-black/30 text-white">{products.length}</span>
                  </button>

                  {categories.map(cat => {
                    const catCount = products.filter(p => p.category === cat.id).length;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`w-full text-right rtl:text-right ltr:text-left py-2.5 px-3 flex items-center justify-between transition-colors cursor-pointer font-bold ${
                          selectedCategory === cat.id
                            ? 'bg-white text-[#4C0519]'
                            : 'text-white/80 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <span>{isAr ? cat.nameAr : cat.nameEn}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 bg-black/30 text-white">{catCount}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Range Slider */}
              <div className="pt-4 border-t border-white/15">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-white">
                    {isAr ? 'السعر حتى' : 'Max Price'}
                  </h4>
                  <span className="font-mono text-xs font-black text-[#FECDD3]">
                    {priceRange.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
                  </span>
                </div>
                <input
                  type="range"
                  min="300"
                  max="1500"
                  step="50"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-white cursor-pointer bg-white/20 h-2"
                />
                <div className="flex justify-between text-[10px] text-white/70 mt-1 font-mono font-bold">
                  <span>300 {isAr ? 'ج.م' : 'EGP'}</span>
                  <span>1,500 {isAr ? 'ج.م' : 'EGP'}</span>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="pt-4 border-t border-white/15">
                <h4 className="text-xs font-black uppercase tracking-wider text-white mb-2.5">
                  {isAr ? 'التقييم' : 'Customer Rating'}
                </h4>
                <div className="space-y-1">
                  {[0, 4.8, 4.9].map(rating => (
                    <button
                      key={rating}
                      onClick={() => setMinRating(rating)}
                      className={`w-full py-2 px-2.5 text-xs flex items-center justify-between cursor-pointer font-bold ${
                        minRating === rating
                          ? 'bg-white text-[#4C0519]'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        {rating === 0 ? (
                          <span>{isAr ? 'جميع التقييمات' : 'All Ratings'}</span>
                        ) : (
                          <>
                            <Star className="w-3.5 h-3.5 fill-current text-[#FECDD3]" />
                            <span>{rating} {isAr ? 'وأعلى' : '& above'}</span>
                          </>
                        )}
                      </div>
                      {minRating === rating && <Check className="w-3.5 h-3.5 text-[#4C0519]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Discreet Packaging Guarantee Card */}
              <div className="p-4 bg-white/5 border border-white/20 text-xs space-y-2">
                <div className="flex items-center gap-2 text-white font-black">
                  <Lock className="w-4 h-4 text-[#FECDD3]" />
                  <span>{isAr ? 'ضمان التغليف السري 100%' : 'Discreet Promise'}</span>
                </div>
                <p className="text-[11px] text-white/80 leading-relaxed font-medium">
                  {isAr
                    ? 'جميع طلباتك تصل في صندوق كرتوني معتم محكم الإغلاق بدون أي إشارة لاسم روني ستور أو طبيعة المحتوى.'
                    : 'Unbranded neutral boxes with discreet invoices for complete privacy.'}
                </p>
              </div>
            </div>
          </aside>

          {/* Right / Product Grid - Full-Bleed Background Images */}
          <main className="lg:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="bg-[#230206] border border-white/20 p-12 text-center space-y-4 shadow-xl">
                <div className="w-16 h-16 bg-white/10 mx-auto flex items-center justify-center text-white">
                  <ShoppingBag className="w-8 h-8 text-[#FECDD3]" />
                </div>
                <h3 className="font-serif-luxury text-xl font-bold text-white">
                  {products.length === 0 
                    ? (isAr ? 'المتجر مهيأ بالكامل وجاهز للبدء من الصفر' : 'Store is ready to start from scratch')
                    : (isAr ? 'لا توجد منتجات مطابقة لهذه الفلاتر' : 'No products match your criteria')}
                </h3>
                <p className="text-xs text-white/80 max-w-md mx-auto">
                  {products.length === 0
                    ? (isAr 
                        ? 'تم تصفير المنتجات بنجاح. يمكنك الآن إضافة وتعديل منتجاتك الخاصة وصورك وأسعارك من لوحة التحكم بكل سهولة.'
                        : 'Products have been cleared. You can now add and manage your custom products and images from the admin dashboard.')
                    : (isAr
                        ? 'جربي توسيع نطاق السعر أو اختيار قسم آخر للاطلاع على التشكيلة.'
                        : 'Try adjusting the price slider or resetting category filters.')}
                </p>
                <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
                  {products.length === 0 ? (
                    <button
                      onClick={() => setCurrentView('admin')}
                      className="bg-white text-[#4C0519] hover:bg-[#FFF5F5] text-xs px-8 py-3 font-black transition-colors cursor-pointer shadow-lg"
                    >
                      {isAr ? 'الانتقال إلى لوحة التحكم' : 'Go to Admin Dashboard'}
                    </button>
                  ) : (
                    <button
                      onClick={resetFilters}
                      className="bg-white text-[#4C0519] hover:bg-[#FFF5F5] text-xs px-8 py-3 font-black transition-colors cursor-pointer shadow-lg"
                    >
                      {isAr ? 'إعادة ضبط الفلاتر' : 'Reset All Filters'}
                    </button>
                  )}
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('مرحباً روني ستور، أود الاستفسار عن التشكيلات المتاحة')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#22C55E] hover:bg-[#16A34A] text-white text-xs px-6 py-3 font-black transition-colors cursor-pointer shadow-lg flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{isAr ? 'تواصل عبر واتساب' : 'Contact WhatsApp'}</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10">
                {filteredProducts.map(product => {
                  const isFav = isInWishlist(product.id);
                  const isJustAdded = recentlyAddedId === product.id;

                  return (
                    <div
                      key={product.id}
                      onClick={() => navigateToProduct(product.id)}
                      className="group relative min-h-[500px] flex flex-col justify-between p-6 cursor-pointer overflow-hidden transition-all duration-700 bg-[#250308]"
                    >
                      {/* Ken Burns Animated Full-Bleed Background Layer */}
                      <div 
                        className="absolute inset-0 scale-105 group-hover:scale-110 transition-transform duration-1000 animate-ken-burns-subtle"
                        style={{
                          backgroundImage: `linear-gradient(180deg, rgba(60, 10, 20, 0.2) 0%, rgba(35, 4, 12, 0.55) 45%, rgba(15, 1, 4, 0.96) 100%), url('${product.images[0]}')`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      />

                      {/* Dark Multiply Blend Layer */}
                      <div className="absolute inset-0 bg-[#350308] opacity-30 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-10 pointer-events-none" />

                      {/* Top Badges & Action Buttons */}
                      <div className="relative z-10 flex items-start justify-between w-full">
                        <div className="flex flex-col gap-1.5">
                          {product.tagAr && (
                            <span className="bg-white text-[#4C0519] text-[10px] font-black px-3 py-1 uppercase tracking-wider shadow-lg">
                              {isAr ? product.tagAr : product.tagEn}
                            </span>
                          )}
                          {product.isSale && (
                            <span className="bg-[#DC2626] text-white text-[10px] font-black px-2.5 py-0.5 uppercase tracking-wider shadow">
                              {isAr ? 'خصم خاص' : 'Special Offer'}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleWishlist(product.id);
                            }}
                            className={`w-9 h-9 bg-black/50 backdrop-blur-md border border-white/30 flex items-center justify-center transition-all cursor-pointer shadow-lg hover:bg-white hover:text-[#4C0519] ${
                              isFav ? 'text-[#DC2626] bg-white' : 'text-white'
                            }`}
                            title={isAr ? 'المفضلة' : 'Wishlist'}
                          >
                            <Heart className={`w-4 h-4 ${isFav ? 'fill-[#DC2626]' : ''}`} />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setQuickViewProduct(product);
                            }}
                            className="w-9 h-9 bg-black/50 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-[#4C0519] transition-all cursor-pointer shadow-lg"
                            title={isAr ? 'معاينة سريعة' : 'Quick View'}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Bottom Overlaid Product Details & CTAs */}
                      <div className="relative z-10 space-y-3 transform transition-transform duration-500 group-hover:-translate-y-1">
                        {/* Rating & Category */}
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[#FECDD3] font-black uppercase tracking-wider text-[10px]">
                            {product.category === 'lingerie'
                              ? isAr ? 'بيبي دول ولانجري' : 'Babydolls & Silk'
                              : product.category === 'couple_games'
                              ? isAr ? 'ألعاب زوجية' : 'Couple Games'
                              : isAr ? 'عناية وباديكير' : 'Spa Care'}
                          </span>

                          <div className="flex items-center gap-1 text-[#FECDD3]">
                            <Star className="w-3 h-3 fill-current" />
                            <span className="font-black font-mono text-white">{product.rating}</span>
                            <span className="text-[10px] text-white/70">({product.reviewsCount})</span>
                          </div>
                        </div>

                        {/* Title */}
                        <div>
                          <h3 className="font-serif-luxury text-lg font-black text-white group-hover:text-[#FECDD3] transition-colors leading-snug drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                            {isAr ? product.nameAr : product.nameEn}
                          </h3>

                          <p className="text-xs text-white/80 line-clamp-1 mt-0.5 font-medium">
                            {isAr ? product.subtitleAr : product.subtitleEn}
                          </p>
                        </div>

                        {/* Price Row */}
                        <div className="flex items-baseline justify-between pt-1 border-t border-white/15">
                          <div className="flex items-baseline gap-2">
                            <span className="text-base font-black font-mono text-white">
                              {product.price.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
                            </span>
                            {product.originalPrice && (
                              <span className="text-xs text-white/60 line-through font-mono">
                                {product.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>

                          <span className="text-[11px] font-bold text-[#FECDD3] underline cursor-pointer">
                            {isAr ? 'التفاصيل ←' : 'Details →'}
                          </span>
                        </div>

                        {/* Action Buttons: Add to Bag & WhatsApp */}
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <button
                            onClick={(e) => handleProductAddToCart(e, product)}
                            disabled={!product.inStock || isJustAdded}
                            className={`py-3 px-2 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer shadow-md ${
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
                            className="py-3 px-2 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1 bg-[#22C55E] hover:bg-[#16A34A] text-white transition-all shadow-md cursor-pointer"
                            title={isAr ? 'طلب فوري عبر واتساب' : 'Direct WhatsApp Order'}
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-white" />
                            <span>{isAr ? 'طلب واتساب' : 'WhatsApp'}</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
