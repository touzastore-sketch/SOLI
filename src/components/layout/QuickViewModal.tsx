import React, { useState } from 'react';
import { X, Star, ShoppingBag, Heart, ShieldCheck, ArrowRight, ArrowLeft, MessageCircle } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const QuickViewModal: React.FC = () => {
  const {
    language,
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
    navigateToProduct,
    storeSettings
  } = useShop();

  if (!quickViewProduct) return null;

  const isAr = language === 'ar';
  const whatsappNumber = storeSettings.whatsappOrder1 || '201095461883';
  const [selectedColor, setSelectedColor] = useState(quickViewProduct.colors[0]);
  const [selectedSize, setSelectedSize] = useState(quickViewProduct.sizes[0] || 'Standard');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const isFav = isInWishlist(quickViewProduct.id);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/90 backdrop-blur-md"
        onClick={() => setQuickViewProduct(null)}
      />
      <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6">
        <div className="bg-[#1C0205] border border-white/20 shadow-2xl overflow-hidden max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 text-white">
          {/* Crisp Image Presentation Side */}
          <div className="relative min-h-[300px] sm:min-h-[420px] max-h-[460px] p-5 flex flex-col justify-between overflow-hidden bg-[#200205] border-b md:border-b-0 md:border-l md:border-white/15">
            {/* Product Image */}
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-xl bg-[#180103]">
              <img
                key={activeImageIndex}
                src={quickViewProduct.images[activeImageIndex] || quickViewProduct.images[0]}
                alt={isAr ? quickViewProduct.nameAr : quickViewProduct.nameEn}
                referrerPolicy="no-referrer"
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover object-center transition-transform duration-300"
              />
            </div>

            {/* Top Badges & Actions */}
            <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10 pointer-events-none">
              {quickViewProduct.isSale ? (
                <span className="bg-[#DC2626] text-white text-[10px] font-black px-3 py-1 uppercase tracking-wider rounded-md shadow pointer-events-auto">
                  {isAr ? 'عرض خاص' : 'Sale'}
                </span>
              ) : <div />}

              <button
                onClick={() => toggleWishlist(quickViewProduct.id)}
                className={`w-9 h-9 border border-white/30 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg pointer-events-auto ${
                  isFav 
                    ? 'text-[#DC2626] bg-white border-white' 
                    : 'text-white bg-black/60 backdrop-blur-sm hover:bg-white hover:text-[#4C0519]'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFav ? 'fill-[#DC2626]' : ''}`} />
              </button>
            </div>

            {/* Thumbnail Selectors */}
            {quickViewProduct.images.length > 1 && (
              <div className="relative z-10 flex gap-2 overflow-x-auto pt-3">
                {quickViewProduct.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    className={`w-12 h-14 rounded-lg border-2 overflow-hidden shrink-0 transition-all ${
                      activeImageIndex === i ? 'border-white scale-105 shadow-md ring-2 ring-[#FECDD3]/40' : 'border-white/20 opacity-70 hover:opacity-100 bg-[#250307]'
                    }`}
                  >
                    <img src={img} alt="thumb" referrerPolicy="no-referrer" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Side */}
          <div className="p-6 sm:p-8 flex flex-col justify-between bg-[#230206] border-t md:border-t-0 md:border-r md:border-white/10">
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs text-[#FECDD3] font-bold uppercase tracking-widest">
                  {quickViewProduct.subtitleAr && (isAr ? quickViewProduct.subtitleAr : quickViewProduct.subtitleEn)}
                </span>
                <button
                  onClick={() => setQuickViewProduct(null)}
                  className="p-1.5 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <h2 className="font-serif-luxury text-2xl font-black text-white mb-2 leading-snug">
                {isAr ? quickViewProduct.nameAr : quickViewProduct.nameEn}
              </h2>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center text-[#FECDD3]">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="text-xs font-black mr-1 rtl:ml-1 font-mono text-white">{quickViewProduct.rating}</span>
                </div>
                <span className="text-xs text-white/70 font-semibold">
                  ({quickViewProduct.reviewsCount} {isAr ? 'تقييم' : 'reviews'})
                </span>
              </div>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl font-black font-mono text-white">
                  {quickViewProduct.price.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
                </span>
                {quickViewProduct.originalPrice && (
                  <span className="text-sm text-white/60 line-through font-mono">
                    {quickViewProduct.originalPrice.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
                  </span>
                )}
              </div>

              <p className="text-xs text-white/80 line-clamp-3 mb-5 leading-relaxed">
                {isAr ? quickViewProduct.descriptionAr : quickViewProduct.descriptionEn}
              </p>

              {/* Color Selection */}
              {quickViewProduct.colors.length > 0 && (
                <div className="mb-4">
                  <span className="text-xs text-white/80 block mb-2 font-bold">
                    {isAr ? 'اللون المحدد:' : 'Color:'}{' '}
                    <span className="text-white font-black">
                      {isAr ? selectedColor.nameAr : selectedColor.nameEn}
                    </span>
                  </span>
                  <div className="flex items-center gap-2">
                    {quickViewProduct.colors.map(col => (
                      <button
                        key={col.value}
                        onClick={() => setSelectedColor(col)}
                        className={`w-7 h-7 border-2 transition-all cursor-pointer ${
                          selectedColor.value === col.value
                            ? 'border-white scale-110 shadow'
                            : 'border-white/20 opacity-70'
                        }`}
                        style={{ backgroundColor: col.hex }}
                        title={isAr ? col.nameAr : col.nameEn}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {quickViewProduct.sizes.length > 0 && (
                <div className="mb-5">
                  <span className="text-xs text-white/80 block mb-2 font-bold">
                    {isAr ? 'المقاس:' : 'Size:'} <span className="text-white font-black">{selectedSize}</span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {quickViewProduct.sizes.map(sz => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`px-3 py-1 text-xs font-mono font-bold transition-all cursor-pointer ${
                          selectedSize === sz
                            ? 'bg-white text-[#4C0519]'
                            : 'bg-white/10 text-white/80 hover:bg-white/20 border border-white/20'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* CTAs */}
            <div className="space-y-2.5 pt-4 border-t border-white/15">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    addToCart(quickViewProduct, selectedColor, selectedSize, quantity);
                    setQuickViewProduct(null);
                  }}
                  className="bg-white hover:bg-[#FFF5F5] text-[#4C0519] py-3.5 px-4 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isAr ? 'إضافة للحقيبة' : 'Add to Bag'}</span>
                </button>

                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                    `مرحباً ${storeSettings.storeNameAr || 'روني ستور'}، أريد طلب المنتج التالي مباشرة:\n• المنتج: ${isAr ? quickViewProduct.nameAr : quickViewProduct.nameEn}\n• المقاس: ${selectedSize}\n• اللون: ${isAr ? selectedColor.nameAr : selectedColor.nameEn}\n• السعر: ${quickViewProduct.price} ج.م`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#22C55E] hover:bg-[#16A34A] text-white py-3.5 px-4 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{isAr ? 'طلب واتساب' : 'WhatsApp'}</span>
                </a>
              </div>

              <button
                onClick={() => {
                  setQuickViewProduct(null);
                  navigateToProduct(quickViewProduct.id);
                }}
                className="w-full text-center text-xs text-[#FECDD3] hover:underline font-bold py-1 cursor-pointer block"
              >
                {isAr ? 'عرض صفحة المنتج الكاملة والمواصفات ←' : 'View Full Product Page →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
