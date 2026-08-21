import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Truck, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Tag, 
  ShoppingBag,
  Info
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { EGYPT_GOVERNORATES } from '../../data/products';

export const CheckoutView: React.FC = () => {
  const {
    language,
    cart,
    cartSubtotal,
    createOrder,
    setCurrentView,
    promoCode,
    appliedDiscountPercent,
    appliedDiscountFixed,
    freeShippingPromo,
    applyPromoCode,
    removePromoCode,
    showToast,
    user
  } = useShop();

  const isAr = language === 'ar';

  // Form states
  const [fullName, setFullName] = useState(user?.defaultAddress.fullName || 'سارة عبد الرحمن');
  const [phone, setPhone] = useState(user?.defaultAddress.phone || '+20 101 234 5678');
  const [email, setEmail] = useState(user?.email || 'sarah.a@example.com');
  const [governorate, setGovernorate] = useState(user?.defaultAddress.governorate || EGYPT_GOVERNORATES[0]);
  const [city, setCity] = useState(user?.defaultAddress.city || 'المعادي - دجلة');
  const [street, setStreet] = useState(user?.defaultAddress.street || 'شارع 206 عمارة 14 الدور الثالث');
  const [landmark, setLandmark] = useState(user?.defaultAddress.landmark || 'بجوار نادي المعادي');
  const [notes, setNotes] = useState('');
  
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card' | 'vodafone_cash'>('cod');
  
  const [couponInput, setCouponInput] = useState('');
  const [isDiscreetAgreed, setIsDiscreetAgreed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculations
  const discountAmount = (appliedDiscountPercent > 0 ? (cartSubtotal * appliedDiscountPercent) / 100 : 0) + appliedDiscountFixed;
  const productsTotal = Math.max(0, cartSubtotal - discountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    applyPromoCode(couponInput);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !governorate || !city || !street) {
      showToast(isAr ? 'يرجى استكمال جميع بيانات التوصيل' : 'Please fill all required delivery fields', 'warning');
      return;
    }

    if (cart.length === 0) {
      showToast(isAr ? 'حقيبة التسوق فارغة' : 'Your cart is empty', 'warning');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      createOrder({
        shippingFee: 0,
        discount: discountAmount,
        paymentMethod,
        shippingMethod,
        isDiscreetPackaging: isDiscreetAgreed,
        notes: notes.trim(),
        shippingAddress: {
          fullName,
          phone,
          email,
          governorate,
          city,
          street,
          landmark,
          notes: notes.trim()
        }
      });
      setIsSubmitting(false);
    }, 800);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] text-[#1E1C1A] py-16 flex items-center justify-center">
        <div className="text-center p-8 max-w-md bg-white border border-[#E6DEC8] rounded-2xl shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#F5EFE6] mx-auto flex items-center justify-center text-[#9B2226]">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="font-serif-luxury text-2xl font-bold">
            {isAr ? 'حقيبة التسوق فارغة' : 'Your Bag is Empty'}
          </h2>
          <p className="text-xs text-[#7A746B]">
            {isAr
              ? 'لم تقومي بإضافة أي منتجات للسلة بعد لإتمام الطلب.'
              : 'Add some intimate luxury pieces to proceed with checkout.'}
          </p>
          <button
            onClick={() => setCurrentView('shop')}
            className="bg-[#9B2226] text-white px-6 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider"
          >
            {isAr ? 'تصفح المتجر الآن' : 'Shop Collections'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1E1C1A] py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Checkout Header */}
        <div className="flex items-center justify-between pb-6 border-b border-[#E6DEC8] mb-8">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#9B2226] block">
              {isAr ? 'إتمام الشراء الآمن' : 'Encrypted Checkout'}
            </span>
            <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#161413]">
              {isAr ? 'إتمام وتأكيد الطلب' : 'Checkout & Delivery'}
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#10B981] font-semibold bg-[#F0FDF4] border border-[#DCFCE7] px-3 py-1.5 rounded-full">
            <Lock className="w-3.5 h-3.5" />
            <span>{isAr ? 'تغليف سري وبيانات مشفرة 100%' : '100% Confidential & Secure'}</span>
          </div>
        </div>

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left / Forms Column (7 cols) */}
          <form onSubmit={handleSubmitOrder} className="lg:col-span-7 space-y-8">
            {/* Section 1: Contact Information */}
            <div className="bg-white border border-[#E6DFC6] rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#F2ECE1]">
                <div className="w-6 h-6 rounded-full bg-[#1E1C1A] text-white flex items-center justify-center text-xs font-bold font-mono">
                  1
                </div>
                <h3 className="font-serif-luxury text-base font-bold text-[#161413]">
                  {isAr ? 'معلومات التواصل' : 'Contact Information'}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-[#3A352F] mb-1">
                    {isAr ? 'الاسم بالكامل (أو اسم المستلم)' : 'Full Recipient Name'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={isAr ? 'سارة عبد الرحمن' : 'Full Name'}
                    className="w-full bg-[#FBF9F5] border border-[#DCD4C7] rounded-lg p-2.5 text-xs text-black focus:outline-none focus:border-[#9B2226]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#3A352F] mb-1">
                    {isAr ? 'رقم الهاتف للتوصيل (+20 في مصر)' : 'Phone (+20)'} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+20 101 234 5678"
                    className="w-full bg-[#FBF9F5] border border-[#DCD4C7] rounded-lg p-2.5 text-xs text-black focus:outline-none focus:border-[#9B2226] font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#3A352F] mb-1">
                    {isAr ? 'البريد الإلكتروني (لتأكيد الطلب)' : 'Email Address'} *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="client@example.com"
                    className="w-full bg-[#FBF9F5] border border-[#DCD4C7] rounded-lg p-2.5 text-xs text-black focus:outline-none focus:border-[#9B2226]"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Delivery Address in Egypt */}
            <div className="bg-white border border-[#E6DFC6] rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#F2ECE1]">
                <div className="w-6 h-6 rounded-full bg-[#1E1C1A] text-white flex items-center justify-center text-xs font-bold font-mono">
                  2
                </div>
                <h3 className="font-serif-luxury text-base font-bold text-[#161413]">
                  {isAr ? 'عنوان التوصيل في مصر' : 'Delivery Address (Egypt)'}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#3A352F] mb-1">
                    {isAr ? 'المحافظة' : 'Governorate'} *
                  </label>
                  <select
                    value={governorate}
                    onChange={(e) => setGovernorate(e.target.value)}
                    className="w-full bg-[#FBF9F5] border border-[#DCD4C7] rounded-lg p-2.5 text-xs text-black focus:outline-none focus:border-[#9B2226]"
                  >
                    {EGYPT_GOVERNORATES.map(gov => (
                      <option key={gov} value={gov}>{gov}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#3A352F] mb-1">
                    {isAr ? 'المنطقة / الحي' : 'District / City'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder={isAr ? 'المعادي، التجمع الخامس، الشيخ زايد...' : 'District or Area'}
                    className="w-full bg-[#FBF9F5] border border-[#DCD4C7] rounded-lg p-2.5 text-xs text-black focus:outline-none focus:border-[#9B2226]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-[#3A352F] mb-1">
                    {isAr ? 'العنوان بالتفصيل (اسم الشارع، رقم العمارة، رقم الشقة)' : 'Detailed Street Address & Apartment'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder={isAr ? 'شارع 206، عمارة 14، الدور الثالث، شقة 6' : 'Street name, Building, Floor, Apt'}
                    className="w-full bg-[#FBF9F5] border border-[#DCD4C7] rounded-lg p-2.5 text-xs text-black focus:outline-none focus:border-[#9B2226]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-[#3A352F] mb-1">
                    {isAr ? 'علامة مميزة أو تعليمات خاصة للمندوب (اختياري)' : 'Landmark / Courier Instructions (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder={isAr ? 'بجوار نادي المعادي / تسليم عند الباب بدون اتصال' : 'Near famous landmark / leave at door'}
                    className="w-full bg-[#FBF9F5] border border-[#DCD4C7] rounded-lg p-2.5 text-xs text-black focus:outline-none focus:border-[#9B2226]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-[#3A352F] mb-1">
                    {isAr ? 'ملاحظات إضافية على الطلب (اختياري)' : 'Order Notes (Optional)'}
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={isAr ? 'أي مواعيد مفضلة للتوصيل أو ملاحظات خاصة بالتغليف...' : 'Preferred delivery time, special packaging requests...'}
                    className="w-full bg-[#FBF9F5] border border-[#DCD4C7] rounded-lg p-2.5 text-xs text-black focus:outline-none focus:border-[#9B2226] resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Shipping Speed */}
            <div className="bg-white border border-[#E6DFC6] rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#F2ECE1]">
                <div className="w-6 h-6 rounded-full bg-[#1E1C1A] text-white flex items-center justify-center text-xs font-bold font-mono">
                  3
                </div>
                <h3 className="font-serif-luxury text-base font-bold text-[#161413]">
                  {isAr ? 'طريقة الشحن والسرعة' : 'Shipping Method'}
                </h3>
              </div>

              <div className="space-y-3">
                <label
                  onClick={() => setShippingMethod('standard')}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    shippingMethod === 'standard'
                      ? 'border-[#9B2226] bg-[#FDF8F8]'
                      : 'border-[#E0D8CB] bg-[#FBF9F5]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingMethod === 'standard'}
                      onChange={() => setShippingMethod('standard')}
                      className="accent-[#9B2226]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#161413]">
                          {isAr ? 'شحن سري لكافة المحافظات' : 'Standard Discreet Shipping (All Governorates)'}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#7A746B] mt-0.5">
                        {isAr 
                          ? 'تغليف سري معتم ومحكم • يتم الاتفاق على قيمة الشحن عبر واتساب' 
                          : 'Neutral sealed box • Shipping fee confirmed via WhatsApp'}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-[#9B2226] bg-[#FDF2F2] border border-[#FECDD3] px-2.5 py-1 rounded-full">
                    {isAr ? 'يُحدد عبر واتساب' : 'Agreed via WhatsApp'}
                  </span>
                </label>

                <label
                  onClick={() => setShippingMethod('express')}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    shippingMethod === 'express'
                      ? 'border-[#9B2226] bg-[#FDF8F8]'
                      : 'border-[#E0D8CB] bg-[#FBF9F5]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingMethod === 'express'}
                      onChange={() => setShippingMethod('express')}
                      className="accent-[#9B2226]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#161413]">
                          {isAr ? 'شحن سريع مستعجل VIP (أولوية تجهيز)' : 'VIP Express Priority Delivery'}
                        </span>
                        <span className="bg-[#9B2226] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                          VIP
                        </span>
                      </div>
                      <p className="text-[11px] text-[#7A746B] mt-0.5">
                        {isAr 
                          ? 'تجهيز فوري مع مندوب خاص • يتم التنسيق وتحديد الرسوم عبر واتساب' 
                          : 'Priority dispatch • Coordinated and priced via WhatsApp'}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-[#9B2226] bg-[#FDF2F2] border border-[#FECDD3] px-2.5 py-1 rounded-full">
                    {isAr ? 'يُحدد عبر واتساب' : 'Agreed via WhatsApp'}
                  </span>
                </label>
              </div>
            </div>

            {/* Section 4: Payment Method */}
            <div className="bg-white border border-[#E6DFC6] rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#F2ECE1]">
                <div className="w-6 h-6 rounded-full bg-[#1E1C1A] text-white flex items-center justify-center text-xs font-bold font-mono">
                  4
                </div>
                <h3 className="font-serif-luxury text-base font-bold text-[#161413]">
                  {isAr ? 'طريقة الدفع' : 'Payment Method'}
                </h3>
              </div>

              <div className="space-y-3">
                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'border-[#9B2226] bg-[#FDF8F8]'
                      : 'border-[#E0D8CB] bg-[#FBF9F5]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="accent-[#9B2226]"
                    />
                    <div className="flex items-center gap-2.5">
                      <Banknote className="w-5 h-5 text-[#9B2226]" />
                      <div>
                        <span className="font-bold text-xs text-[#161413] block">
                          {isAr ? 'الدفع نقداً عند الاستلام (COD)' : 'Cash on Delivery (COD)'}
                        </span>
                        <span className="text-[10px] text-[#7A746B]">
                          {isAr ? 'ادفع للمندوب كاش بعد استلام طردك المغلق' : 'Pay in cash upon sealed delivery'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-[#EAE2D5] px-2 py-0.5 rounded text-[#555]">
                    {isAr ? 'بدون رسوم إضافية' : '0% Fee'}
                  </span>
                </label>

                <label
                  onClick={() => setPaymentMethod('card')}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'border-[#9B2226] bg-[#FDF8F8]'
                      : 'border-[#E0D8CB] bg-[#FBF9F5]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="accent-[#9B2226]"
                    />
                    <div className="flex items-center gap-2.5">
                      <CreditCard className="w-5 h-5 text-[#9B2226]" />
                      <div>
                        <span className="font-bold text-xs text-[#161413] block">
                          {isAr ? 'بطاقة ائتمان / ميزة / فيزا / ماستركارد' : 'Credit / Debit Card / Meeza'}
                        </span>
                        <span className="text-[10px] text-[#7A746B]">
                          {isAr ? 'دفع إلكتروني آمن ومشفر عبر البوابة المصرفية' : 'Encrypted 256-bit instant banking gateway'}
                        </span>
                      </div>
                    </div>
                  </div>
                </label>

                <label
                  onClick={() => setPaymentMethod('vodafone_cash')}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    paymentMethod === 'vodafone_cash'
                      ? 'border-[#9B2226] bg-[#FDF8F8]'
                      : 'border-[#E0D8CB] bg-[#FBF9F5]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'vodafone_cash'}
                      onChange={() => setPaymentMethod('vodafone_cash')}
                      className="accent-[#9B2226]"
                    />
                    <div className="flex items-center gap-2.5">
                      <Smartphone className="w-5 h-5 text-[#9B2226]" />
                      <div>
                        <span className="font-bold text-xs text-[#161413] block">
                          {isAr ? 'محافظ إلكترونية (فودافون كاش / إنستاباي / أورنج كاش)' : 'Mobile Wallets (Vodafone Cash / InstaPay)'}
                        </span>
                        <span className="text-[10px] text-[#7A746B]">
                          {isAr ? 'تحويل فوري لمحفظة البوتيك المعتمدة' : 'Direct mobile wallet transfer'}
                        </span>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Discreet Packaging Pledge */}
            <div className="p-4 bg-[#F2EDE4] border border-[#DDD3C2] rounded-xl flex items-start gap-3">
              <input
                type="checkbox"
                id="discreetCheckbox"
                checked={isDiscreetAgreed}
                onChange={(e) => setIsDiscreetAgreed(e.target.checked)}
                className="mt-0.5 accent-[#9B2226]"
              />
              <label htmlFor="discreetCheckbox" className="text-xs text-[#4A453E] leading-relaxed cursor-pointer">
                <span className="font-bold text-[#161413] block mb-0.5">
                  {isAr ? 'نلتزم بالسرية المطلقة والتغليف المعتم بنسبة 100%' : '100% Discretion Guarantee'}
                </span>
                {isAr
                  ? 'أوافق على استلام شحنتي في غلاف كرتوني معتم غير موضح لأي تفاصيل، وباسم محايد على الفاتورة الخارجية.'
                  : 'I confirm receiving my order in a neutral unbranded box with total privacy.'}
              </label>
            </div>
          </form>

          {/* Right / Order Summary Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-[#E6DFC6] rounded-2xl p-6 shadow-lg sticky top-28 space-y-6">
              <h3 className="font-serif-luxury text-lg font-bold text-[#161413] pb-3 border-b border-[#F0EAE1]">
                {isAr ? 'ملخص الطلب' : 'Order Summary'} ({cart.length} {isAr ? 'قطع' : 'items'})
              </h3>

              {/* Items Preview */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-3 items-center">
                    <div className="relative">
                      <img
                        src={item.product.images[0]}
                        alt={isAr ? item.product.nameAr : item.product.nameEn}
                        referrerPolicy="no-referrer"
                        className="w-14 h-16 object-cover rounded-lg bg-[#F5EFE6] border border-[#E0D8CB]"
                      />
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#1E1C1A] text-white text-[10px] flex items-center justify-center font-bold font-mono">
                        {item.quantity}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-[#161413] truncate">
                        {isAr ? item.product.nameAr : item.product.nameEn}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-[#7A746B] mt-0.5">
                        <span>{isAr ? item.selectedColor.nameAr : item.selectedColor.nameEn}</span>
                        <span>•</span>
                        <span>{item.selectedSize}</span>
                      </div>
                    </div>

                    <span className="text-xs font-bold font-mono text-[#161413] shrink-0">
                      {(item.product.price * item.quantity).toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Promo Code Input */}
              <div className="pt-3 border-t border-[#F0EAE1]">
                {promoCode ? (
                  <div className="flex items-center justify-between p-2.5 bg-[#F0FDF4] border border-[#BBF7D0] rounded-lg text-xs text-[#166534]">
                    <div className="flex items-center gap-1.5 font-semibold">
                      <Tag className="w-3.5 h-3.5" />
                      <span>{promoCode}</span>
                    </div>
                    <button
                      onClick={removePromoCode}
                      className="text-[#DC2626] hover:underline text-[11px] font-bold cursor-pointer"
                    >
                      {isAr ? 'إزالة' : 'Remove'}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder={isAr ? 'كود الخصم (جرب: RONY10)' : 'Promo code (try: RONY10)'}
                      className="flex-1 bg-[#FBF9F5] border border-[#DCD4C7] rounded-lg px-3 py-2 text-xs uppercase text-black focus:outline-none focus:border-[#9B2226]"
                    />
                    <button
                      type="submit"
                      className="bg-[#1E1C1A] hover:bg-[#332F2C] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      {isAr ? 'تطبيق' : 'Apply'}
                    </button>
                  </form>
                )}
              </div>

              {/* Totals Breakdown */}
              <div className="space-y-2.5 pt-3 border-t border-[#F0EAE1] text-xs">
                <div className="flex justify-between text-[#6B655D]">
                  <span>{isAr ? 'مجموع المنتجات' : 'Products Subtotal'}</span>
                  <span className="font-mono font-bold text-[#161413]">
                    {cartSubtotal.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#166534] font-medium">
                    <span>{isAr ? 'الخصم المطبق' : 'Discount'}</span>
                    <span className="font-mono font-bold">
                      -{discountAmount.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center text-[#6B655D]">
                  <span>{isAr ? 'مصاريف الشحن' : 'Shipping'}</span>
                  <span className="font-bold text-[11px] text-[#9B2226] bg-[#FDF2F2] border border-[#FECDD3] px-2 py-0.5 rounded">
                    {isAr ? 'يتم الاتفاق عليها عبر واتساب' : 'Agreed via WhatsApp'}
                  </span>
                </div>

                <div className="flex justify-between text-base font-bold text-[#161413] pt-3 border-t border-[#E6DEC8]">
                  <div>
                    <span>{isAr ? 'إجمالي المنتجات' : 'Products Total'}</span>
                    <span className="block text-[10px] font-normal text-[#7A746B]">
                      {isAr ? '(+ مصاريف الشحن تُحدد عبر واتساب)' : '(+ Shipping agreed via WhatsApp)'}
                    </span>
                  </div>
                  <span className="font-mono text-lg text-[#9B2226]">
                    {productsTotal.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
                  </span>
                </div>
              </div>

              {/* Submit CTA Button in Dark Red & White */}
              <button
                onClick={handleSubmitOrder}
                disabled={isSubmitting}
                className="w-full bg-[#7F1D1D] hover:bg-[#991B1B] disabled:opacity-50 text-white py-4 rounded-2xl font-black text-xs sm:text-sm tracking-widest uppercase flex items-center justify-center gap-2 transition-all shadow-xl cursor-pointer hover:shadow-red-950/40 group border-2 border-[#7F1D1D]"
              >
                <span>
                  {isSubmitting
                    ? (isAr ? 'جاري تأكيد الطلب...' : 'Processing...')
                    : (isAr ? 'تأكيد وإتمام الطلب الآن' : 'Place Order Now')}
                </span>
                {isAr ? (
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                ) : (
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                )}
              </button>

              <p className="text-center text-[10px] text-[#8E877E]">
                {isAr
                  ? 'بالنقر على تأكيد الطلب، نضمن لك الحفاظ التام على سرية مشترياتك وبياناتك الشخصية.'
                  : 'By placing this order, you agree to our confidential delivery terms.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
