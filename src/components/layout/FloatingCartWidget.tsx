import React, { useState, useEffect } from 'react';
import { ShoppingBag, ArrowLeft, ArrowRight, Sparkles, X } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const FloatingCartWidget: React.FC = () => {
  const {
    language,
    cart,
    cartCount,
    cartSubtotal,
    setIsCartDrawerOpen,
    setCurrentView,
    currentView
  } = useShop();

  const isAr = language === 'ar';
  const [isBouncing, setIsBouncing] = useState(false);
  const [showQuickTooltip, setShowQuickTooltip] = useState(false);
  const [isDismissedPermanently, setIsDismissedPermanently] = useState(false);

  // Trigger brief bounce animation whenever cartCount increases
  useEffect(() => {
    if (cartCount > 0) {
      setIsBouncing(true);
      setShowQuickTooltip(true);
      const timer = setTimeout(() => setIsBouncing(false), 800);
      const tooltipTimer = setTimeout(() => setShowQuickTooltip(false), 5000);
      return () => {
        clearTimeout(timer);
        clearTimeout(tooltipTimer);
      };
    }
  }, [cartCount]);

  // Don't show floating cart if user is already on the Checkout page or in Admin
  if (currentView === 'checkout' || currentView === 'admin' || isDismissedPermanently) {
    return null;
  }

  const handleOpenCart = () => {
    setIsCartDrawerOpen(true);
  };

  const handleDirectCheckout = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentView('checkout');
  };

  return (
    <aside
      aria-label={isAr ? 'حقيبة التسوق العائمة' : 'Floating shopping cart'}
      className={`fixed bottom-6 ltr:right-5 rtl:left-5 z-40 flex flex-col items-start rtl:items-end gap-2.5 pointer-events-auto transition-all duration-300 ${
        isBouncing ? 'scale-110' : 'scale-100'
      }`}
      style={{ isolation: 'isolate' }}
    >
      {/* Floating Info Tooltip Banner when cart has items */}
      {(showQuickTooltip || cartCount > 0) && cart.length > 0 && (
        <div 
          onClick={handleOpenCart}
          className="hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-[#2E050B]/95 backdrop-blur-md border border-[#F43F5E]/40 text-white shadow-[0_10px_30px_rgba(76,5,25,0.45)] cursor-pointer hover:bg-[#3B070E] transition-all duration-200 animate-fadeIn text-xs group"
        >
          <div className="flex items-center gap-1.5 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#FECDD3] animate-pulse" />
            <span className="text-[#FECDD3] font-mono">{cartCount} {isAr ? 'قطع في السلة' : 'items in bag'}</span>
          </div>
          <span className="text-white/40">•</span>
          <span className="font-mono font-black text-white">
            {cartSubtotal.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
          </span>
          <button
            onClick={handleDirectCheckout}
            className="bg-white hover:bg-[#FFF1F2] text-[#4C0519] px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer group-hover:scale-105 shadow-sm"
          >
            <span>{isAr ? 'اطلب الآن' : 'Checkout'}</span>
            {isAr ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
          </button>
        </div>
      )}

      {/* Main Floating Cart Capsule Button */}
      <button
        onClick={handleOpenCart}
        className="relative group flex items-center gap-2.5 p-3.5 sm:px-4 sm:py-3.5 rounded-full bg-gradient-to-r from-[#7F1D1D] via-[#991B1B] to-[#7F1D1D] text-white shadow-[0_12px_35px_rgba(127,29,29,0.55)] hover:shadow-[0_16px_45px_rgba(153,27,27,0.7)] border-2 border-white/50 hover:border-white transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        title={isAr ? 'فتح حقيبة التسوق' : 'Open Shopping Bag'}
        aria-label={isAr ? `حقيبة التسوق، ${cartCount} منتجات` : `Shopping bag, ${cartCount} items`}
      >
        {/* Glowing Pulsing Ring */}
        {cartCount > 0 && (
          <span className="absolute -inset-1 rounded-full bg-[#E11D48]/30 blur-sm animate-pulse -z-10" />
        )}

        <div className="relative flex items-center justify-center">
          <ShoppingBag className="w-6 h-6 text-white group-hover:rotate-6 transition-transform duration-200" />
          
          {/* Live Badge Counter */}
          <span className="absolute -top-2.5 -right-2.5 min-w-[20px] h-5 px-1 bg-[#D4AF37] text-[#161413] border-2 border-[#7F1D1D] rounded-full text-[11px] font-black font-mono flex items-center justify-center shadow-md">
            {cartCount}
          </span>
        </div>

        {/* Text Label on Desktop & Tablet */}
        <div className="hidden md:flex flex-col text-start rtl:text-right">
          <span className="text-xs font-black uppercase tracking-wider leading-tight text-white flex items-center gap-1">
            {isAr ? 'حقيبة التسوق' : 'My Bag'}
          </span>
          {cartCount > 0 ? (
            <span className="text-[10px] font-bold font-mono text-[#FECDD3]">
              {cartSubtotal.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
            </span>
          ) : (
            <span className="text-[9px] text-white/80 font-medium">
              {isAr ? 'فارغة حالياً' : 'Empty'}
            </span>
          )}
        </div>
      </button>
    </aside>
  );
};
