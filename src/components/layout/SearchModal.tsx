import React, { useState } from 'react';
import { Search, X, ShoppingBag } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const SearchModal: React.FC = () => {
  const {
    language,
    products,
    categories,
    isSearchModalOpen,
    setIsSearchModalOpen,
    navigateToProduct,
    addToCart
  } = useShop();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategoryFilter] = useState<string | null>(null);

  if (!isSearchModalOpen) return null;

  const isAr = language === 'ar';

  const trendingTags = [
    { labelAr: 'طقم حرير عنابي', labelEn: 'Burgundy Silk Set', query: 'عنابي' },
    { labelAr: 'ألعاب زوجية', labelEn: 'Couple Games', query: 'ألعاب' },
    { labelAr: 'براليت دانتيل', labelEn: 'Lace Bralette', query: 'دانتيل' },
    { labelAr: 'باديكير سبا', labelEn: 'Pedicure Spa', query: 'باديكير' },
    { labelAr: 'شمع مساج', labelEn: 'Massage Candle', query: 'مساج' },
    { labelAr: 'كورسيه شفاف', labelEn: 'Corset', query: 'كورسيه' }
  ];

  const searchResults = products.filter(p => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return false;

    const matchNameAr = p.nameAr.toLowerCase().includes(term);
    const matchNameEn = p.nameEn.toLowerCase().includes(term);
    const matchDescAr = p.descriptionAr.toLowerCase().includes(term);
    const matchDescEn = p.descriptionEn.toLowerCase().includes(term);
    const matchTag = (p.tagAr && p.tagAr.toLowerCase().includes(term)) || (p.tagEn && p.tagEn.toLowerCase().includes(term));
    const matchFabric = (p.fabricAr && p.fabricAr.toLowerCase().includes(term)) || (p.fabricEn && p.fabricEn.toLowerCase().includes(term));

    const matchesQuery = matchNameAr || matchNameEn || matchDescAr || matchDescEn || matchTag || matchFabric;
    if (activeCategoryFilter) {
      return matchesQuery && p.category === activeCategoryFilter;
    }
    return matchesQuery;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={() => setIsSearchModalOpen(false)}
      />

      <div className="relative min-h-screen max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-start pt-16">
        <div className="bg-[#141211] border border-[#2B2724] rounded-2xl shadow-2xl overflow-hidden text-[#ECE7DF]">
          {/* Search Header Input */}
          <div className="p-6 border-b border-[#24211E] flex items-center gap-4">
            <Search className="w-6 h-6 text-[#D4AF37] shrink-0" />
            <input
              type="text"
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                isAr
                  ? 'ابحث بالاسم، الخامة، الفئة (مثلاً: حرير، ألعاب زوجية، دانتيل)...'
                  : 'Search by style, fabric, category (e.g. silk, games, lace)...'
              }
              className="w-full bg-transparent text-base sm:text-lg text-[#FDFBF7] placeholder-[#6E675E] focus:outline-none"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-xs text-[#8E877E] hover:text-white px-2 py-1 bg-[#201D1A] rounded"
              >
                {isAr ? 'مسح' : 'Clear'}
              </button>
            )}
            <button
              onClick={() => setIsSearchModalOpen(false)}
              className="p-2 rounded-full hover:bg-[#221F1C] text-[#8E877E] hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Trending Suggestions */}
          <div className="px-6 py-3 bg-[#181614] border-b border-[#24211E] flex items-center gap-2 flex-wrap">
            <span className="text-xs text-[#8E877E] shrink-0">
              {isAr ? 'الأكثر بحثاً:' : 'Trending:'}
            </span>
            {trendingTags.map((tag, idx) => (
              <button
                key={idx}
                onClick={() => setSearchTerm(tag.query)}
                className="text-xs bg-[#221E1B] hover:bg-[#302B27] text-[#C7C2BA] hover:text-[#D4AF37] px-3 py-1 rounded-full border border-[#2F2A26] transition-colors cursor-pointer"
              >
                {isAr ? tag.labelAr : tag.labelEn}
              </button>
            ))}
          </div>

          {/* Search Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {searchTerm.trim() === '' ? (
              <div className="py-10 text-center space-y-3">
                <p className="text-sm text-[#A09A92]">
                  {isAr
                    ? 'اكتشف أرقى التشكيلات الملكية بلمسة واحدة'
                    : 'Discover our exclusive royal collections'}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto pt-4">
                  {products.slice(0, 4).map(prod => (
                    <div
                      key={prod.id}
                      onClick={() => {
                        setIsSearchModalOpen(false);
                        navigateToProduct(prod);
                      }}
                      className="group cursor-pointer text-center space-y-1.5"
                    >
                      <img
                        src={prod.images[0]}
                        alt={isAr ? prod.nameAr : prod.nameEn}
                        referrerPolicy="no-referrer"
                        className="w-full h-24 object-cover rounded-lg border border-[#2B2724] group-hover:border-[#D4AF37] transition-all"
                      />
                      <span className="text-[11px] text-[#A09A92] group-hover:text-white line-clamp-1 block">
                        {isAr ? prod.nameAr : prod.nameEn}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <p className="text-base font-semibold text-[#ECE7DF]">
                  {isAr ? 'لم نجد نتائج مطابقة لبحثك' : 'No matching results found'}
                </p>
                <p className="text-xs text-[#7A746B]">
                  {isAr
                    ? 'جرب البحث بكلمات عامة مثل: حرير، روب، لعبة، باديكير'
                    : 'Try broader keywords like silk, robe, game, pedicure'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-[#8E877E] pb-2 border-b border-[#24211E]">
                  <span>
                    {isAr
                      ? `تم العثور على ${searchResults.length} منتج`
                      : `Found ${searchResults.length} products`}
                  </span>
                  <span className="text-[11px] text-[#D4AF37]">
                    {isAr ? 'تغليف سري مضمون' : 'Discreet Delivery'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {searchResults.map(product => (
                    <div
                      key={product.id}
                      className="flex items-center gap-3 p-3 bg-[#181615] border border-[#262320] rounded-xl hover:border-[#3D3732] transition-colors group"
                    >
                      <img
                        src={product.images[0]}
                        alt={isAr ? product.nameAr : product.nameEn}
                        referrerPolicy="no-referrer"
                        className="w-16 h-20 object-cover rounded-md bg-[#0D0D0D] shrink-0 cursor-pointer"
                        onClick={() => {
                          setIsSearchModalOpen(false);
                          navigateToProduct(product);
                        }}
                      />

                      <div className="flex-1 min-w-0">
                        <div
                          className="cursor-pointer"
                          onClick={() => {
                            setIsSearchModalOpen(false);
                            navigateToProduct(product);
                          }}
                        >
                          <span className="text-[10px] text-[#D4AF37] font-medium block">
                            {(() => {
                              const foundCat = categories.find(c => c.id === product.category);
                              if (foundCat) return isAr ? foundCat.nameAr : foundCat.nameEn;
                              return isAr ? 'قسم روني' : 'Collection';
                            })()}
                          </span>
                          <h4 className="text-xs font-semibold text-[#ECE7DF] group-hover:text-white line-clamp-1">
                            {isAr ? product.nameAr : product.nameEn}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-bold text-[#F3EFE6]">
                              {product.price} {isAr ? 'ج.م' : 'EGP'}
                            </span>
                            {product.originalPrice && (
                              <span className="text-[10px] text-[#7A746B] line-through">
                                {product.originalPrice}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="mt-2 flex items-center gap-2">
                          <button
                            onClick={() => {
                              addToCart(product);
                            }}
                            className="bg-[#24211E] hover:bg-[#9B2226] text-[#ECE7DF] hover:text-white text-[11px] px-3 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <ShoppingBag className="w-3 h-3" />
                            <span>{isAr ? 'أضف للسلة' : 'Add to Bag'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
