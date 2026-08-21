import React from 'react';
import { 
  Heart, 
  ShoppingBag, 
  Trash2, 
  Star, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles,
  Lock,
  Eye
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const WishlistView: React.FC = () => {
  const {
    language,
    wishlist,
    products,
    toggleWishlist,
    addToCart,
    navigateToProduct,
    setCurrentView,
    setQuickViewProduct
  } = useShop();

  const isAr = language === 'ar';
  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1E1C1A] py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-[#8A847B] mb-6">
          <button onClick={() => setCurrentView('home')} className="hover:text-[#9B2226] cursor-pointer">
            {isAr ? 'الرئيسية' : 'Home'}
          </button>
          <span>/</span>
          <span className="text-[#1E1C1A] font-bold">
            {isAr ? 'قائمة المفضلة' : 'Wishlist'}
          </span>
        </nav>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-[#E6DEC8] gap-4 mb-8">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#9B2226] block">
              {isAr ? 'مختاراتكِ المحفوظة' : 'Personal Curation'}
            </span>
            <h1 className="font-serif-luxury text-3xl font-bold text-[#161413]">
              {isAr ? 'قائمة المفضلة' : 'Saved Luxury Wishlist'} ({wishlistProducts.length})
            </h1>
            <p className="text-xs text-[#7A746B] mt-1">
              {isAr
                ? 'القطع التي اخترتها بعناية للرجوع إليها أو إضافتها لاحقاً لحقيبة التسوق.'
                : 'Your handpicked intimates and spa sets saved for future moments.'}
            </p>
          </div>

          {wishlistProducts.length > 0 && (
            <button
              onClick={() => {
                wishlistProducts.forEach(p => addToCart(p));
              }}
              className="bg-[#9B2226] hover:bg-[#801B1E] text-white px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{isAr ? 'إضافة جميع المفضلة للسلة' : 'Add All to Bag'}</span>
            </button>
          )}
        </div>

        {/* Wishlist Grid */}
        {wishlistProducts.length === 0 ? (
          <div className="bg-white border border-[#E6DFC6] rounded-2xl p-16 text-center space-y-4 max-w-lg mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#F5EFE6] mx-auto flex items-center justify-center text-[#9B2226]">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="font-serif-luxury text-xl font-bold text-[#161413]">
              {isAr ? 'قائمة المفضلة فارغة حالياً' : 'Your wishlist is currently empty'}
            </h3>
            <p className="text-xs text-[#7A746B] leading-relaxed">
              {isAr
                ? 'تصفحي تشكيلات اللانجري الحريري، الألعاب الزوجية، ومستحضرات السبا واضغطي على رمز القلب لحفظها هنا.'
                : 'Explore our boutique catalog and tap the heart icon on pieces you love.'}
            </p>
            <button
              onClick={() => setCurrentView('shop')}
              className="bg-[#9B2226] hover:bg-[#801B1E] text-white px-6 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            >
              {isAr ? 'استكشاف التشكيلة الملكية' : 'Explore Boutique'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistProducts.map(product => (
              <div
                key={product.id}
                className="bg-white border border-[#E6DFC6] rounded-2xl overflow-hidden group hover:border-[#9B2226] hover:shadow-xl transition-all flex flex-col justify-between"
              >
                {/* Image Container */}
                <div className="relative aspect-[3/4] bg-[#F7F4EE] overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={isAr ? product.nameAr : product.nameEn}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Remove Button */}
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-3 ltr:right-3 rtl:left-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-[#E6DEC8] flex items-center justify-center text-[#DC2626] hover:bg-[#DC2626] hover:text-white transition-colors cursor-pointer shadow-sm"
                    title={isAr ? 'إزالة من المفضلة' : 'Remove'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Badges */}
                  {product.tagAr && (
                    <span className="absolute top-3 ltr:left-3 rtl:right-3 bg-[#9B2226] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      {isAr ? product.tagAr : product.tagEn}
                    </span>
                  )}
                </div>

                {/* Info Container */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-[#D4AF37] mb-1">
                      <Star className="w-3 h-3 fill-[#D4AF37]" />
                      <span className="text-xs font-bold font-mono text-black">{product.rating}</span>
                      <span className="text-[10px] text-[#8E877E]">({product.reviewsCount})</span>
                    </div>

                    <h3
                      onClick={() => navigateToProduct(product)}
                      className="font-serif-luxury text-base font-bold text-[#1E1C1A] hover:text-[#9B2226] transition-colors cursor-pointer truncate mb-1"
                    >
                      {isAr ? product.nameAr : product.nameEn}
                    </h3>

                    <p className="text-[11px] text-[#7A746B] truncate mb-3">
                      {isAr ? product.subtitleAr : product.subtitleEn}
                    </p>
                  </div>

                  {/* Price & Add to Cart */}
                  <div className="pt-3 border-t border-[#F0EAE1] space-y-2">
                    <div className="flex items-baseline justify-between">
                      <span className="font-mono text-sm font-bold text-[#1E1C1A]">
                        {product.price.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
                      </span>
                      {product.originalPrice && (
                        <span className="font-mono text-xs text-[#8E877E] line-through">
                          {product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => addToCart(product)}
                      className="w-full bg-[#9B2226] hover:bg-[#801B1E] text-white py-2 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{isAr ? 'إضافة للسلة' : 'Add to Bag'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
