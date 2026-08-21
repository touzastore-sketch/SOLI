import React from 'react';
import { 
  Sparkles, 
  Heart, 
  MessageCircle, 
  CheckCircle2, 
  Lock, 
  Truck, 
  ShieldCheck, 
  Gift, 
  Award, 
  Sparkle 
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { CategoryShowcase } from '../home/CategoryShowcase';
import { AmbientHomeBackground } from '../home/AmbientHomeBackground';

export const HomeView: React.FC = () => {
  const { 
    language, 
    setCurrentView, 
    setSelectedCategory,
    storeSettings
  } = useShop();

  const isAr = language === 'ar';
  const whatsappNumber = storeSettings.whatsappOrder1 || '201095461883';

  return (
    <div 
      className="min-h-screen bg-[#1A0104] text-white selection:bg-[#DC2626] selection:text-white relative overflow-x-hidden"
    >
      {/* 0. Ambient Atmospheric Background Canvas with Seamless Transparent Model Figure */}
      <AmbientHomeBackground isAr={isAr} />

      {/* 1. Ultra-Clean Luxury Editorial Intro Header with Lightweight Brand Capsule on the Left */}
      <section className="relative z-10 pt-8 pb-12 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Main Editorial Text (Right side in Arabic RTL) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-[11px] font-bold tracking-widest text-[#FECDD3] uppercase">
                <Sparkles className="w-3.5 h-3.5 text-[#FECDD3] animate-pulse" />
                <span>
                  {isAr 
                    ? (storeSettings.heroBadgeAr || `كولكشن ${storeSettings.storeNameAr || 'روني ستور'} الحصري`) 
                    : (storeSettings.heroBadgeEn || 'RONY STORE EXCLUSIVE COLLECTION')}
                </span>
              </div>
              <h1 className="font-serif-luxury text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)]">
                {isAr 
                  ? (storeSettings.heroTitleAr || 'الأناقة الحميمية والبيبي دول الملكي') 
                  : (storeSettings.heroTitleEn || 'Couture Babydolls & Intimate Allure')}
              </h1>
              <p className="text-sm sm:text-base text-white/85 max-w-2xl font-medium leading-relaxed">
                {isAr
                  ? (storeSettings.heroSubtitleAr || 'اكتشفي أرقى تشكيلة بيبي دول دانتيل، قمصان نوم سيلك، وألعاب رومانسية حصرية مع ضمان التغليف السري المعتم والدفع عند الاستلام.')
                  : (storeSettings.heroSubtitleEn || 'Explore romantic sheer lace babydolls, pure silk robes, and private couple romance games with guaranteed discreet packaging and COD across Egypt.')}
              </p>

              {/* Quick Action CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setSelectedCategory('lingerie');
                    setCurrentView('shop');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-white hover:bg-[#FFF5F5] text-[#4C0519] px-6 sm:px-8 py-3.5 text-xs font-black tracking-wider uppercase rounded-full shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer flex items-center gap-2"
                >
                  <Heart className="w-4 h-4 text-[#DC2626] fill-[#DC2626]" />
                  <span>
                    {isAr 
                      ? (storeSettings.heroBtn1TextAr || 'تسوقي كولكشن البيبي دول') 
                      : (storeSettings.heroBtn1TextEn || 'Explore Babydolls')}
                  </span>
                </button>

                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#22C55E] hover:bg-[#16A34A] text-white px-6 sm:px-8 py-3.5 text-xs font-black tracking-wider uppercase rounded-full shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>
                    {isAr 
                      ? (storeSettings.heroBtn2TextAr || 'طلب واستفسار واتساب') 
                      : (storeSettings.heroBtn2TextEn || 'WhatsApp Order')}
                  </span>
                </a>
              </div>
            </div>

            {/* Lightweight Luxury Brand Accent Capsule (Left side in Arabic RTL / End Side) */}
            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <div className="w-full max-w-sm p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-[#3B060D]/80 via-[#2A0308]/70 to-[#140103]/90 border border-white/20 backdrop-blur-xl shadow-2xl space-y-4 hover:border-white/40 transition-all duration-300">
                {/* Brand Monogram & Crest */}
                <div className="flex items-center justify-between border-b border-white/15 pb-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#7F1D1D] to-[#4C0519] border border-white/30 flex items-center justify-center font-serif-luxury font-black text-lg text-white shadow-inner">
                      R
                    </div>
                    <div>
                      <h4 className="font-serif-luxury text-sm font-black tracking-widest text-white">
                        {isAr ? (storeSettings.storeNameAr || 'روني ستور') : (storeSettings.storeNameEn || 'RONY STORE')}
                      </h4>
                      <p className="text-[10px] text-[#FECDD3] font-bold tracking-wider uppercase">
                        {isAr 
                          ? (storeSettings.brandCardSubAr || 'بوتيك الفخامة والخصوصية') 
                          : (storeSettings.brandCardSubEn || 'LUXURY INTIMATE BOUTIQUE')}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-white/10 text-white/90 border border-white/20">
                    {isAr 
                      ? (storeSettings.brandCardBadgeAr || 'EST. CAIRO') 
                      : (storeSettings.brandCardBadgeEn || 'EST. CAIRO')}
                  </span>
                </div>

                {/* Quick Trust Highlights in Lightweight Pills */}
                <div className="space-y-2 text-xs font-bold text-white/90">
                  <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5 border border-white/10">
                    <ShieldCheck className="w-4 h-4 text-[#22C55E] shrink-0" />
                    <span>
                      {isAr 
                        ? (storeSettings.brandFeat1Ar || 'تغليف سري معتم 100% لباب المنزل') 
                        : (storeSettings.brandFeat1En || '100% Sealed Confidential Box')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5 border border-white/10">
                    <Award className="w-4 h-4 text-[#FECDD3] shrink-0" />
                    <span>
                      {isAr 
                        ? (storeSettings.brandFeat2Ar || 'خامات دانتيل وسيلك ناعم وفاخر') 
                        : (storeSettings.brandFeat2En || 'Premium Silk & French Lace')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5 border border-white/10">
                    <Truck className="w-4 h-4 text-[#38BDF8] shrink-0" />
                    <span>
                      {isAr 
                        ? (storeSettings.brandFeat3Ar || 'شحن لجميع المحافظات ودفع عند الاستلام') 
                        : (storeSettings.brandFeat3En || 'All Egypt Delivery & COD')}
                    </span>
                  </div>
                </div>

                {/* Direct Concierge Link */}
                <div className="pt-1">
                  <a
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white text-white hover:text-[#4C0519] border border-white/30 text-xs font-black tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-[#22C55E]" />
                    <span>
                      {isAr 
                        ? (storeSettings.brandConciergeBtnAr || 'استشارة المقاسات الفورية') 
                        : (storeSettings.brandConciergeBtnEn || 'Instant Sizing Support')}
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Guarantees Bar */}
          <div className="mt-8 pt-6 border-t border-white/15 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-bold text-white">
            <div className="flex items-center gap-2.5 p-2 bg-white/5 border border-white/10 rounded-xl">
              <Lock className="w-4 h-4 text-[#FECDD3] shrink-0" />
              <span>
                {isAr 
                  ? (storeSettings.guarantee1TitleAr || 'تغليف سري معتم 100%') 
                  : (storeSettings.guarantee1TitleEn || '100% Discreet Packaging')}
              </span>
            </div>
            <div className="flex items-center gap-2.5 p-2 bg-white/5 border border-white/10 rounded-xl">
              <Truck className="w-4 h-4 text-[#FECDD3] shrink-0" />
              <span>
                {isAr 
                  ? (storeSettings.guarantee2TitleAr || 'شحن ودفع عند الاستلام') 
                  : (storeSettings.guarantee2TitleEn || 'Fast COD Delivery')}
              </span>
            </div>
            <div className="flex items-center gap-2.5 p-2 bg-white/5 border border-white/10 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-[#FECDD3] shrink-0" />
              <span>
                {isAr ? 'خصوصية وسرية تامة' : 'Absolute Privacy'}
              </span>
            </div>
            <div className="flex items-center gap-2.5 p-2 bg-white/5 border border-white/10 rounded-xl">
              <Award className="w-4 h-4 text-[#FECDD3] shrink-0" />
              <span>
                {isAr 
                  ? (storeSettings.guarantee4TitleAr || 'خامات حرير ودانتيل أوروبي') 
                  : (storeSettings.guarantee4TitleEn || 'Premium Luxury Fabrics')}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Flash Exclusive Deal / Gift Banner */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-gradient-to-r from-[#5B0813] via-[#3F050D] to-[#200206] border border-white/20 p-6 sm:p-8 rounded-2xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/30 flex items-center justify-center text-white shrink-0 shadow-inner">
              <Gift className="w-7 h-7 text-[#FECDD3] animate-bounce" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-[#DC2626] text-white text-[10px] font-black px-2.5 py-0.5 uppercase tracking-wider rounded-full">
                  {isAr 
                    ? (storeSettings.offerBadgeAr || 'عرض حصري لفترة محدودة') 
                    : (storeSettings.offerBadgeEn || 'Limited Offer')}
                </span>
                <span className="text-xs text-[#FECDD3] font-bold">
                  ★ {isAr 
                    ? (storeSettings.offerTagAr || 'هدية مميزة') 
                    : (storeSettings.offerTagEn || 'Special Gift')}
                </span>
              </div>
              <h3 className="font-serif-luxury text-xl sm:text-2xl font-black text-white">
                {isAr 
                  ? (storeSettings.offerTitleAr || 'اطلبي أي قطعتين بيبي دول واحصلي على لعبة زوجية هدية مجانية!') 
                  : (storeSettings.offerTitleEn || 'Buy 2 Babydolls & Receive a Romantic Couple Game Free!')}
              </h3>
              <p className="text-xs text-white/80">
                {isAr 
                  ? (storeSettings.offerSubtitleAr || 'يسري العرض على جميع المحافظات مع شحن سري معتم ودفع عند الاستلام.') 
                  : (storeSettings.offerSubtitleEn || 'Valid for all orders with COD and sealed confidential packaging.')}
              </p>
            </div>
          </div>

          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
              isAr 
                ? `مرحباً، أريد الاستفادة من عرض: ${storeSettings.offerTitleAr || 'قطعتين بيبي دول ولعبة زوجية هدية'}` 
                : 'Hello, I would like to claim the buy 2 get 1 gift offer'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 bg-white hover:bg-[#FFF5F5] text-[#4C0519] font-black px-8 py-3.5 rounded-full text-xs uppercase tracking-wider transition-all duration-300 hover:scale-105 shadow-xl flex items-center gap-2 cursor-pointer"
          >
            <Sparkle className="w-4 h-4 text-[#DC2626]" />
            <span>
              {isAr 
                ? (storeSettings.offerBtnTextAr || 'تفعيل العرض عبر واتساب') 
                : (storeSettings.offerBtnTextEn || 'Claim Offer via WhatsApp')}
            </span>
          </a>
        </div>
      </section>

      {/* 3. Interactive Chic Small Squares Categories & In-Page Dynamic Products Grid */}
      <div className="relative z-10 pt-2">
        <CategoryShowcase />
      </div>

      {/* 4. Editorial Philosophy & WhatsApp VIP Concierge Banner */}
      <section 
        className="w-full relative py-20 px-4 sm:px-6 lg:px-8 bg-[#1B0105] border-t border-white/10 overflow-hidden"
      >
        <div 
          className="absolute inset-0 scale-105 animate-ken-burns-slow"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(20, 2, 5, 0.96) 0%, rgba(45, 5, 15, 0.85) 50%, rgba(20, 2, 5, 0.96) 100%)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="max-w-5xl mx-auto relative z-10 text-center space-y-8">
          <div className="space-y-3">
            <span className="text-xs font-black uppercase tracking-[0.3em] text-[#FECDD3]">
              {isAr ? 'خدمة الاستشارة الخاصة والطلب • RONY CONCIERGE' : 'THE RONY CONCIERGE & PRIVACY'}
            </span>

            <h2 className="font-serif-luxury text-3xl sm:text-5xl font-black text-white leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
              {isAr
                ? 'خصوصية مطلقة، خامات فاخرة، وخدمة عملاء راقية على مدار الساعة.'
                : 'Absolute Discretion, Couture Fabrics & 24/7 VIP Assistance.'}
            </h2>

            <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-3xl mx-auto font-medium drop-shadow-sm">
              {isAr
                ? 'فريق روني ستور متاح لمساعدتكِ في اختيار المقاس المناسب، وتنسيق الأطقم والبيبي دول، مع توصيل سريع ومغلف تماماً بدون أي بيانات تدل على المحتوى.'
                : 'Our boutique team is at your service for sizing consultation, custom babydoll pairings, and guaranteed confidential doorstep delivery.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/20 text-right rtl:text-right ltr:text-left">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
              <CheckCircle2 className="w-5 h-5 text-[#22C55E] shrink-0" />
              <span className="text-xs sm:text-sm text-white font-bold">
                {isAr ? 'تغليف سري خالٍ من الشعارات' : 'Plain Sealed Packaging'}
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
              <CheckCircle2 className="w-5 h-5 text-[#22C55E] shrink-0" />
              <span className="text-xs sm:text-sm text-white font-bold">
                {isAr ? 'حرير طبيعي ودانتيل ناعم' : 'Hypoallergenic Certified'}
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
              <CheckCircle2 className="w-5 h-5 text-[#22C55E] shrink-0" />
              <span className="text-xs sm:text-sm text-white font-bold">
                {isAr ? 'ألعاب وتحديات زوجية تفاعلية' : 'Interactive Couple Games'}
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
              <CheckCircle2 className="w-5 h-5 text-[#22C55E] shrink-0" />
              <span className="text-xs sm:text-sm text-white font-bold">
                {isAr ? 'شحن لجميع المحافظات ودفع عند الاستلام' : 'Fast Delivery Across Egypt & COD'}
              </span>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => {
                setSelectedCategory('lingerie');
                setCurrentView('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-white hover:bg-[#FFF5F5] text-[#4C0519] px-8 py-4 text-xs font-black tracking-wider uppercase rounded-full inline-flex items-center gap-2 transition-all cursor-pointer shadow-2xl hover:scale-105"
            >
              <Heart className="w-4 h-4 text-[#DC2626]" />
              <span>{isAr ? 'تصفح تشكيلة اللانجري والبيبي دول' : 'Explore Babydolls & Silk'}</span>
            </button>

            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#22C55E] hover:bg-[#16A34A] text-white px-8 py-4 text-xs font-black tracking-wider uppercase rounded-full inline-flex items-center gap-2 transition-all cursor-pointer shadow-2xl hover:scale-105"
            >
              <MessageCircle className="w-4 h-4 text-white" />
              <span>{isAr ? 'تواصل معنا فوراً عبر واتساب' : 'WhatsApp Us Directly'}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
