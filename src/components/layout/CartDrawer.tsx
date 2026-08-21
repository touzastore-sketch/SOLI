import React from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Lock, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const CartDrawer: React.FC = () => {
  const {
    language,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    cart,
    cartCount,
    cartSubtotal,
    updateQuantity,
    removeFromCart,
    setCurrentView,
    freeShippingPromo
  } = useShop();

  if (!isCartDrawerOpen) return null;

  const isAr = language === 'ar';
  const freeShippingThreshold = 1500;
  const progressPercent = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);
  const remainingForFreeShip = Math.max(0, freeShippingThreshold - cartSubtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 max-w-full flex ltr:right-0 rtl:left-0 pl-10 rtl:pl-0 rtl:pr-10">
        <div className="w-screen max-w-md bg-[#121110] border-l rtl:border-l-0 rtl:border-r border-[#262421] text-[#ECE7DF] shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-[#24211E] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
              <h3 className="font-serif-luxury text-lg tracking-wider font-semibold text-[#FDFBF7]">
                {isAr ? 'حقيبة التسوق' : 'Shopping Bag'}
              </h3>
              <span className="text-xs bg-[#24211E] text-[#D4AF37] px-2 py-0.5 rounded-full font-mono">
                {cartCount}
              </span>
            </div>

            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 rounded-full hover:bg-[#201D1A] text-[#8E877E] hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Luxury Discreet Shipping & WhatsApp Coordination Banner */}
          <div className="bg-[#181615] px-5 py-3 border-b border-[#24211E]">
            <div className="flex items-center gap-2 text-xs text-[#EAE4DC] font-medium">
              <Lock className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>
                {isAr
                  ? 'تغليف سري معتم 100% • يتم تنسيق الشحن والاتفاق عليه عبر واتساب'
                  : '100% Sealed discreet packaging • Shipping arranged via WhatsApp'}
              </span>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#181615] border border-[#2B2724] flex items-center justify-center text-[#6B655D]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-[#ECE7DF]">
                    {isAr ? 'حقيبة التسوق فارغة حالياً' : 'Your bag is currently empty'}
                  </p>
                  <p className="text-xs text-[#7A746B]">
                    {isAr
                      ? 'استكشفي تشكيلتنا الملكية من اللانجري والألعاب الزوجية'
                      : 'Explore our curated lingerie and intimate games collection'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    setCurrentView('shop');
                  }}
                  className="bg-[#9B2226] hover:bg-[#801B1E] text-white text-xs px-6 py-2.5 rounded-md font-medium transition-colors cursor-pointer"
                >
                  {isAr ? 'تصفح المتجر الآن' : 'Shop Collections'}
                </button>
              </div>
            ) : (
              cart.map(item => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 rounded-lg bg-[#181615] border border-[#262320] hover:border-[#3A3530] transition-colors"
                >
                  <img
                    src={item.product.images[0]}
                    alt={isAr ? item.product.nameAr : item.product.nameEn}
                    referrerPolicy="no-referrer"
                    className="w-20 h-24 object-cover rounded-md bg-[#0D0D0D] shrink-0"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-[#ECE7DF] leading-tight line-clamp-1">
                          {isAr ? item.product.nameAr : item.product.nameEn}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#7A746B] hover:text-[#EF4444] p-1 transition-colors"
                          title={isAr ? 'حذف' : 'Remove'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-1.5 text-[11px] text-[#A09A92]">
                        <span className="flex items-center gap-1">
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-[#444]"
                            style={{ backgroundColor: item.selectedColor.hex }}
                          />
                          {isAr ? item.selectedColor.nameAr : item.selectedColor.nameEn}
                        </span>
                        <span>•</span>
                        <span>
                          {isAr ? 'المقاس:' : 'Size:'} {item.selectedSize}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-[#332F2C] rounded bg-[#121110]">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-[#8E877E] hover:text-white hover:bg-[#201D1A] transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-[#8E877E] hover:text-white hover:bg-[#201D1A] transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <span className="text-xs font-bold text-[#F3EFE6]">
                          {(item.product.price * item.quantity).toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-5 bg-[#161413] border-t border-[#24211E] space-y-4">
              {/* Discreet Packaging Note */}
              <div className="flex items-center gap-2 p-2.5 bg-[#1F1C1A] border border-[#302B27] rounded text-[11px] text-[#A8A29E]">
                <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>
                  {isAr
                    ? 'تغليف سري ومغلق تماماً بدون أي دلالة خارجية على محتوى الطرد'
                    : '100% Discreet & sealed packaging. No external product labels.'}
                </span>
              </div>

              {/* Subtotal */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#8E877E]">
                  <span>{isAr ? 'المجموع الفرعي' : 'Subtotal'}</span>
                  <span className="font-mono text-[#ECE7DF] font-semibold text-sm">
                    {cartSubtotal.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
                  </span>
                </div>
                <p className="text-[11px] text-[#A8A29E]">
                  {isAr
                    ? 'يتم الاتفاق على مصاريف الشحن وتأكيدها عبر واتساب بعد الطلب'
                    : 'Shipping fee agreed upon & confirmed via WhatsApp'}
                </p>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  setCurrentView('checkout');
                }}
                className="w-full bg-[#7F1D1D] hover:bg-[#991B1B] text-white py-3.5 px-4 rounded-xl font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all duration-200 shadow-xl cursor-pointer group border-2 border-white/40"
              >
                <span>{isAr ? 'متابعة إتمام الطلب' : 'Proceed to Checkout'}</span>
                {isAr ? (
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                ) : (
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                )}
              </button>

              <button
                onClick={() => setIsCartDrawerOpen(false)}
                className="w-full text-center text-xs text-[#8E877E] hover:text-[#ECE7DF] transition-colors py-1 cursor-pointer"
              >
                {isAr ? 'متابعة التسوق' : 'Continue Shopping'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
