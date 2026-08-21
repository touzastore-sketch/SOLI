import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Lock, 
  Send,
  Sparkles,
  Dices,
  Heart,
  MessageCircle,
  MapPin,
  Building2,
  Navigation
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const Footer: React.FC = () => {
  const { language, setCurrentView, setSelectedCategory, showToast, branches, categories, storeSettings } = useShop();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [secretClickCount, setSecretClickCount] = useState(0);

  const isAr = language === 'ar';

  const handleSecretAdminTrigger = () => {
    const newCount = secretClickCount + 1;
    setSecretClickCount(newCount);
    if (newCount >= 3) {
      setCurrentView('admin');
      setSecretClickCount(0);
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast(isAr ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Please enter a valid email', 'warning');
      return;
    }
    setSubscribed(true);
    setEmail('');
    showToast(
      isAr
        ? 'تم انضمامك إلى النادي الحصري لروني ستور بنجاح ✨'
        : 'Welcome to Rony Store Private Club ✨',
      'success'
    );
  };

  return (
    <footer className="bg-[#1A0104] text-white border-t-2 border-white/20 pt-16 pb-12 transition-colors relative overflow-hidden">
      {/* Ambient background glow */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[250px] rounded-full blur-[130px] opacity-15 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #FFFFFF 0%, #DC2626 60%, transparent 80%)'
        }}
      />

      {/* Guarantees Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 border-b border-white/20 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white text-[#7F1D1D] flex items-center justify-center shrink-0 shadow-lg font-bold">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white mb-1">
                {isAr 
                  ? (storeSettings.guarantee1TitleAr || 'تغليف سري ومحكم 100%') 
                  : (storeSettings.guarantee1TitleEn || '100% Discreet Packaging')}
              </h4>
              <p className="text-xs text-white/80 leading-relaxed font-medium">
                {isAr
                  ? (storeSettings.guarantee1DescAr || 'يتم شحن جميع الطلبات في صناديق كرتونية معتمة بدون أي إشارة للمحتوى أو اسم المتجر.')
                  : (storeSettings.guarantee1DescEn || 'All parcels are sealed in plain, unbranded boxes with total privacy.')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white text-[#7F1D1D] flex items-center justify-center shrink-0 shadow-lg font-bold">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white mb-1">
                {isAr 
                  ? (storeSettings.guarantee2TitleAr || 'شحن سريع لجميع محافظات مصر') 
                  : (storeSettings.guarantee2TitleEn || 'Delivery Across Egypt')}
              </h4>
              <p className="text-xs text-white/80 leading-relaxed font-medium">
                {isAr
                  ? (storeSettings.guarantee2DescAr || 'توصيل سريع خلال 24-48 ساعة للقاهرة والجيزة و2-3 أيام لباقي المحافظات.')
                  : (storeSettings.guarantee2DescEn || 'Fast courier dispatch to Cairo, Giza, Alexandria and all governorates.')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white text-[#7F1D1D] flex items-center justify-center shrink-0 shadow-lg font-bold">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white mb-1">
                {isAr 
                  ? (storeSettings.guarantee3TitleAr || 'دفع عند الاستلام وفودافون كاش') 
                  : (storeSettings.guarantee3TitleEn || 'Secure Payment & COD')}
              </h4>
              <p className="text-xs text-white/80 leading-relaxed font-medium">
                {isAr
                  ? (storeSettings.guarantee3DescAr || 'الدفع عند الاستلام (COD)، والمحافظ الإلكترونية، والبطاقات البنكية.')
                  : (storeSettings.guarantee3DescEn || 'Cash on Delivery, Credit Cards, and Egyptian Mobile Wallets.')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white text-[#7F1D1D] flex items-center justify-center shrink-0 shadow-lg font-bold">
              <ShieldCheck className="w-6 h-6 text-[#16A34A]" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white mb-1">
                {isAr 
                  ? (storeSettings.guarantee4TitleAr || 'بيبي دول وحرير أصلي فاخر') 
                  : (storeSettings.guarantee4TitleEn || 'Premium Crafted Fabrics')}
              </h4>
              <p className="text-xs text-white/80 leading-relaxed font-medium">
                {isAr
                  ? (storeSettings.guarantee4DescAr || 'أقمشة حريرية فرنسية ودانتيل فائق النعومة صُمم خصيصاً لراحتك التامة.')
                  : (storeSettings.guarantee4DescEn || 'Delicate silk touches and certified hypoallergenic textiles.')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* STORE BRANCHES / فروع وعناوين روني ستور الرسمية */}
      {/* ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-white/20 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#FECDD3] text-[11px] font-black uppercase tracking-wider mb-2">
              <Building2 className="w-3.5 h-3.5" />
              <span>{isAr ? 'فروعنا الرسمية المعتمدة' : 'OUR OFFICIAL BOUTIQUES'}</span>
            </div>
            <h3 className="font-serif-luxury text-2xl sm:text-3xl font-black text-white">
              {isAr ? 'عناوين وفروع روني ستور' : 'Rony Store Boutique Locations'}
            </h3>
            <p className="text-xs text-white/80 mt-1 font-medium max-w-xl">
              {isAr 
                ? 'يسعدنا تشريفكم واستقبالكم في فروعنا الرسمية أو طلب التوصيل السريع السري حتى باب المنزل.'
                : 'Visit our flagship boutiques or order with 100% confidential home delivery across Egypt.'}
            </p>
          </div>

          <span className="text-xs font-black text-white/90 bg-[#2E0409] border border-white/25 px-3.5 py-1.5 rounded-xl self-start md:self-auto">
            {isAr ? `📍 ${branches.filter(b => b.isActive).length} فروع رئيسية في مصر` : `📍 ${branches.filter(b => b.isActive).length} Flagship Branches`}
          </span>
        </div>

        {/* Dynamic Branches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {branches.filter(b => b.isActive).map((branch, idx) => {
            const waNumber = branch.whatsapp || storeSettings.whatsappOrder1 || '201095461883';
            const waQuery = encodeURIComponent(
              `مرحباً روني ستور، أريد الاستفسار عن مواعيد العمل وموقع ${branch.nameAr}`
            );

            return (
              <div 
                key={branch.id} 
                className="relative rounded-2xl bg-gradient-to-b from-[#2A0307] to-[#180104] border border-white/25 p-5 shadow-xl hover:border-white/60 transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-3.5">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#DC2626] text-white shadow-sm">
                    {isAr ? `📍 الفرع ${idx + 1}` : `Branch ${idx + 1}`}
                  </span>
                  <span className="text-xs font-black text-[#FECDD3] font-serif">
                    {isAr ? branch.cityAr : branch.cityEn}
                  </span>
                </div>

                <div className="flex items-start gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0 group-hover:bg-white group-hover:text-[#4C0519] transition-colors shadow">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-white leading-snug">
                      {isAr ? branch.nameAr : branch.nameEn}
                    </h4>
                    <p className="text-xs text-white/85 leading-relaxed font-medium">
                      {isAr ? branch.addressAr : branch.addressEn}
                    </p>
                  </div>
                </div>

                <a
                  href={`https://wa.me/${waNumber}?text=${waQuery}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-[#22C55E] text-white text-xs font-black flex items-center justify-center gap-2 border border-white/20 hover:border-[#22C55E] transition-all cursor-pointer shadow-md"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{isAr ? `استفسار عن ${branch.nameAr.split(' ')[1] || branch.cityAr}` : 'Inquire via WhatsApp'}</span>
                </a>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col">
              <span className="font-serif-luxury text-3xl tracking-[0.2em] font-black text-white">
                RONY STORE
              </span>
              <span className="text-[10px] tracking-[0.35em] text-[#FECDD3] uppercase font-sans font-bold">
                LE LUXE INTIME • CAIRO
              </span>
            </div>

            <p className="text-xs text-white/85 leading-relaxed max-w-sm font-medium">
              {isAr
                ? 'بوتيك مصري رائد يقدم تجربة تسوق حميمية فائقة الرقي. موديلات بيبي دول ساحرة، ألعاب زوجية، باديكير، ومحفزات رجالية وحريمية بخصوصية تامة 100%.'
                : 'Egypt’s premier intimate boutique offering refined silk silhouettes, couple games, pedicure essentials, and discreet stimulants with total privacy.'}
            </p>

            {/* Newsletter */}
            <div className="pt-2">
              <span className="text-xs font-bold text-white block mb-2">
                {isAr ? 'انضمي إلى النادي الخاص وتعرفي على العروض السرية' : 'Join Our Private Journal & Exclusive Offers'}
              </span>
              <form onSubmit={handleSubscribe} className="flex max-w-md">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isAr ? 'بريدك الإلكتروني...' : 'Your email address...'}
                  className="bg-white text-xs text-[#3B060D] font-bold px-4 py-3 rounded-r-none rtl:rounded-l-none rtl:rounded-r-xl ltr:rounded-l-xl focus:outline-none flex-1 placeholder:text-gray-400"
                />
                <button
                  type="submit"
                  className="bg-[#7F1D1D] hover:bg-[#991B1B] text-white px-5 py-3 rounded-l-none rtl:rounded-r-none rtl:rounded-l-xl ltr:rounded-r-xl text-xs font-black flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer border border-white"
                >
                  <span>{isAr ? 'اشتراك' : 'Join'}</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
              {subscribed && (
                <span className="text-[11px] text-[#4ADE80] mt-1 block font-bold">
                  {isAr ? 'شكراً لانضمامك! تم إرسال كود خصم ترحيبي لبريدك.' : 'Thank you! A welcome discount has been emailed.'}
                </span>
              )}
            </div>
          </div>

          {/* Col: Shop */}
          <div className="space-y-3">
            <h5 className="text-xs font-black uppercase tracking-widest text-white border-b border-white/20 pb-2">
              {isAr ? 'أقسام المتجر' : 'Collections'}
            </h5>
            <ul className="space-y-2 text-xs font-medium">
              {categories.map(cat => (
                <li key={cat.id}>
                  <button
                    onClick={() => { setSelectedCategory(cat.id); setCurrentView('shop'); }}
                    className="hover:text-[#FECDD3] transition-colors text-right cursor-pointer flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3 h-3 text-[#DC2626]" />
                    <span>{isAr ? cat.nameAr : cat.nameEn}</span>
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => { setSelectedCategory(null); setCurrentView('shop'); }}
                  className="hover:text-[#FECDD3] transition-colors text-right cursor-pointer text-white/70"
                >
                  {isAr ? 'جميع المنتجات' : 'All Products'}
                </button>
              </li>
            </ul>
          </div>

          {/* Col: Customer Care */}
          <div className="space-y-3">
            <h5 className="text-xs font-black uppercase tracking-widest text-white border-b border-white/20 pb-2">
              {isAr ? 'خدمة العملاء والخصوصية' : 'Customer Privileges'}
            </h5>
            <ul className="space-y-2 text-xs font-medium text-white/85">
              <li>
                <span className="text-white font-bold">{isAr ? 'تغليف سري محكم 100%' : '100% Discreet Delivery'}</span>
              </li>
              <li>
                <span>{isAr ? 'شحن فوري لباب المنزل' : 'Fast Courier Dispatch'}</span>
              </li>
              <li>
                <span>{isAr ? 'دفع عند الاستلام مع المعاينة' : 'Cash on Delivery Option'}</span>
              </li>
              <li>
                <span>{isAr ? 'إشعار واتساب فوري للطلب' : 'WhatsApp Order Notifications'}</span>
              </li>
            </ul>
          </div>

            {/* Col: Contacts & Social Hub */}
            <div className="space-y-3">
              <h5 className="text-xs font-black uppercase tracking-widest text-white border-b border-white/20 pb-2">
                {isAr ? 'التواصل والطلبات' : 'Direct Support'}
              </h5>
              <p className="text-xs text-white/85 leading-relaxed font-medium">
                {isAr
                  ? 'فريق خدمة عملاء متخصص وسري متاح للرد على كافة الاستفسارات وتأكيد الطلبات على مدار الساعة.'
                  : 'Our discreet customer care team is available 24/7 for instant inquiries and VIP orders.'}
              </p>
              
              {/* Phone & WhatsApp Direct Badges with explicit LTR */}
              <div className="pt-2 space-y-2">
                <span className="text-[11px] font-black text-white block">
                  {isAr ? 'خدمة سريعة ومباشرة عبر واتساب:' : 'Instant Direct VIP Line:'}
                </span>

                <div className="flex flex-col gap-2">
                  <a
                    href="https://wa.me/201095461883"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#22C55E]/15 hover:bg-[#22C55E]/30 border border-[#22C55E]/50 text-white transition-all group w-fit shadow-md cursor-pointer hover:scale-105"
                  >
                    <div className="w-6 h-6 rounded-lg bg-[#22C55E] flex items-center justify-center text-white shrink-0 shadow-sm">
                      <MessageCircle className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-right rtl:text-right ltr:text-left">
                      <span className="text-[10px] text-[#86EFAC] font-black block">
                        {isAr ? 'واتساب مبيعات واستفسار' : 'WhatsApp Orders'}
                      </span>
                      <span dir="ltr" className="font-mono text-xs font-black text-white tracking-wider inline-block">
                        +20 109 546 1883
                      </span>
                    </div>
                  </a>

                  <a
                    href="tel:+201002108272"
                    className="inline-flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all group w-fit shadow-md cursor-pointer hover:scale-105"
                  >
                    <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center text-white shrink-0 shadow-sm">
                      <span className="text-xs">📞</span>
                    </div>
                    <div className="text-right rtl:text-right ltr:text-left">
                      <span className="text-[10px] text-[#FECDD3] font-bold block">
                        {isAr ? 'خدمة العملاء الهاتفية' : 'Customer Support Phone'}
                      </span>
                      <span dir="ltr" className="font-mono text-xs font-black text-white tracking-wider inline-block">
                        +20 100 210 8272
                      </span>
                    </div>
                  </a>
                </div>
              </div>

              {/* Animated Social Channels in Footer */}
              <div className="pt-3 border-t border-white/15">
                <span className="text-[10px] uppercase font-black tracking-widest text-[#FECDD3] block mb-2">
                  {isAr ? 'تابعي حساباتنا الرسمية' : 'Follow Our Official Channels'}
                </span>
                <div className="flex items-center gap-2.5">
                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/${storeSettings.whatsappOrder1 || '201095461883'}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl bg-[#22C55E]/20 border border-[#22C55E]/60 hover:bg-[#22C55E] flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(34,197,94,0.7)] cursor-pointer"
                    title="WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>

                  {/* Instagram */}
                  <a
                    href={storeSettings.instagramUrl || "https://instagram.com"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#F58529]/20 via-[#DD2A7B]/20 to-[#8134AF]/20 border border-[#DD2A7B]/60 hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(221,42,123,0.7)] cursor-pointer"
                    title="Instagram"
                  >
                    <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>

                  {/* TikTok */}
                  <a
                    href={storeSettings.tiktokUrl || "https://tiktok.com"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl bg-black/40 border border-white/30 hover:bg-white hover:text-black flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(255,255,255,0.6)] cursor-pointer"
                    title="TikTok"
                  >
                    <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68 6.34 6.34 0 0 0 9.34 22a6.33 6.33 0 0 0 6.34-6.32V8.75a8.28 8.28 0 0 0 4.91 1.62V6.92a4.84 4.84 0 0 1-1-.23z"/>
                    </svg>
                  </a>

                  {/* Telegram */}
                  <a
                    href={storeSettings.telegramChannelUrl || "https://t.me"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl bg-[#229ED9]/20 border border-[#229ED9]/60 hover:bg-[#229ED9] flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(34,158,217,0.7)] cursor-pointer"
                    title="Telegram VIP Channel"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </a>

                  {/* Facebook */}
                  <a
                    href={storeSettings.facebookUrl || "https://facebook.com"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl bg-[#1877F2]/20 border border-[#1877F2]/60 hover:bg-[#1877F2] flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(24,119,242,0.7)] cursor-pointer"
                    title="Facebook"
                  >
                    <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/70">
          <p 
            onClick={handleSecretAdminTrigger}
            className="font-medium select-none cursor-default hover:text-white transition-colors"
          >
            © {new Date().getFullYear()} {storeSettings.storeNameAr || 'RONY STORE'} — Le Luxe Intime. {isAr ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
          </p>
          <div className="flex items-center gap-6 font-bold text-white">
            <span 
              onClick={handleSecretAdminTrigger}
              className="cursor-default select-none hover:text-[#FECDD3] transition-colors"
            >
              {isAr ? 'الخصوصية التامة مكفولة 100%' : 'Absolute Privacy Guaranteed'}
            </span>
            <span>•</span>
            <span>Cairo, Egypt</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
