import React, { useState } from 'react';
import { 
  User, 
  Package, 
  Heart, 
  MapPin, 
  Settings, 
  LogOut, 
  ChevronRight, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  Eye, 
  Edit3,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { PRODUCTS_DATA } from '../../data/products';

export const AccountView: React.FC = () => {
  const {
    language,
    user,
    logout,
    orders,
    wishlist,
    setCurrentView,
    setSelectedCategory,
    navigateToOrder,
    navigateToProduct,
    setIsAuthModalOpen,
    showToast
  } = useShop();

  const isAr = language === 'ar';
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'wishlist' | 'addresses' | 'settings'>('overview');

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] text-[#1E1C1A] py-16 flex items-center justify-center">
        <div className="text-center p-8 max-w-md bg-white border border-[#E6DFC6] rounded-2xl shadow-md space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#F5EFE6] mx-auto flex items-center justify-center text-[#9B2226]">
            <User className="w-8 h-8" />
          </div>
          <h2 className="font-serif-luxury text-2xl font-bold">
            {isAr ? 'تسجيل الدخول إلى حسابك' : 'Sign In to Your Account'}
          </h2>
          <p className="text-xs text-[#7A746B]">
            {isAr
              ? 'يرجى تسجيل الدخول للوصول إلى طلباتك السابقة، قائمة المفضلة، وعناوين التوصيل.'
              : 'Please sign in to track active orders, saved wishlist items, and delivery addresses.'}
          </p>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="bg-[#9B2226] text-white px-6 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider cursor-pointer"
          >
            {isAr ? 'تسجيل الدخول الآن' : 'Sign In Now'}
          </button>
        </div>
      </div>
    );
  }

  const recentOrder = orders[0];
  const wishlistProducts = PRODUCTS_DATA.filter(p => wishlist.includes(p.id));

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1E1C1A] py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Account Header Banner */}
        <div className="bg-white border border-[#E6DFC6] rounded-2xl p-6 sm:p-8 shadow-sm mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#9B2226] to-[#D4AF37] p-0.5 flex items-center justify-center">
              <div className="w-full h-full bg-[#1E1C1A] rounded-full flex items-center justify-center text-[#D4AF37] text-xl font-bold font-serif">
                {user.fullName.charAt(0)}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif-luxury text-2xl font-bold text-[#161413]">
                  {isAr ? `مرحباً، ${user.fullName}` : `Welcome, ${user.fullName}`}
                </h1>
                <span className="bg-[#9B2226]/10 text-[#9B2226] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-[#9B2226]/20">
                  {user.tier}
                </span>
              </div>
              <p className="text-xs text-[#7A746B] mt-0.5">
                {user.email} • {user.phone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right rtl:text-right ltr:text-left bg-[#F9F6F0] border border-[#EAE3D5] px-4 py-2 rounded-xl">
              <span className="text-[10px] text-[#8E877E] block">{isAr ? 'نقاط المكافآت' : 'Loyalty Points'}</span>
              <span className="font-mono text-sm font-bold text-[#D4AF37]">{user.points} pts</span>
            </div>

            <button
              onClick={logout}
              className="p-2.5 border border-[#E0D8CB] hover:bg-[#F5EFE6] text-[#7A746B] hover:text-[#DC2626] rounded-xl transition-colors cursor-pointer"
              title={isAr ? 'تسجيل الخروج' : 'Logout'}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Navigation Tabs */}
          <aside className="lg:col-span-3 space-y-2">
            <div className="bg-white border border-[#E6DFC6] rounded-2xl p-4 shadow-sm space-y-1 text-xs">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full text-right rtl:text-right ltr:text-left py-2.5 px-3 rounded-lg font-medium flex items-center justify-between transition-colors cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-[#1E1C1A] text-white font-bold'
                    : 'text-[#6B655D] hover:bg-[#F7F3EB]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4" />
                  <span>{isAr ? 'نظرة عامة' : 'Overview'}</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setCurrentView('orders');
                }}
                className="w-full text-right rtl:text-right ltr:text-left py-2.5 px-3 rounded-lg font-medium flex items-center justify-between text-[#6B655D] hover:bg-[#F7F3EB] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Package className="w-4 h-4" />
                  <span>{isAr ? 'طلباتي والشحنات' : 'My Orders & Tracking'}</span>
                </div>
                <span className="font-mono text-[10px] bg-[#EAE2D5] px-2 py-0.5 rounded text-black font-bold">
                  {orders.length}
                </span>
              </button>

              <button
                onClick={() => setCurrentView('wishlist')}
                className="w-full text-right rtl:text-right ltr:text-left py-2.5 px-3 rounded-lg font-medium flex items-center justify-between text-[#6B655D] hover:bg-[#F7F3EB] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Heart className="w-4 h-4" />
                  <span>{isAr ? 'قائمة المفضلة' : 'Wishlist'}</span>
                </div>
                <span className="font-mono text-[10px] bg-[#EAE2D5] px-2 py-0.5 rounded text-black font-bold">
                  {wishlist.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full text-right rtl:text-right ltr:text-left py-2.5 px-3 rounded-lg font-medium flex items-center justify-between transition-colors cursor-pointer ${
                  activeTab === 'addresses'
                    ? 'bg-[#1E1C1A] text-white font-bold'
                    : 'text-[#6B655D] hover:bg-[#F7F3EB]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4" />
                  <span>{isAr ? 'دفتر العناوين' : 'Address Book'}</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full text-right rtl:text-right ltr:text-left py-2.5 px-3 rounded-lg font-medium flex items-center justify-between transition-colors cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-[#1E1C1A] text-white font-bold'
                    : 'text-[#6B655D] hover:bg-[#F7F3EB]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Settings className="w-4 h-4" />
                  <span>{isAr ? 'إعدادات الخصوصية' : 'Privacy Settings'}</span>
                </div>
              </button>
            </div>

            {/* Discreet Packaging Badge */}
            <div className="p-4 bg-[#F2EDE4] border border-[#DDD3C2] rounded-2xl text-xs space-y-2">
              <div className="flex items-center gap-2 text-[#9B2226] font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>{isAr ? 'عضوية سرية موثوقة' : 'Verified Discreet Account'}</span>
              </div>
              <p className="text-[11px] text-[#6B655D] leading-relaxed">
                {isAr
                  ? 'يتم تشفير جميع سجلات المشتريات ومعلومات التوصيل لضمان الخصوصية القصوى.'
                  : 'All order histories and personal details remain strictly encrypted.'}
              </p>
            </div>
          </aside>

          {/* Right Main Content */}
          <main className="lg:col-span-9 space-y-6">
            {activeTab === 'overview' && (
              <>
                {/* Recent Active Order Card */}
                {recentOrder && (
                  <div className="bg-white border border-[#E6DFC6] rounded-2xl p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#F0EAE1]">
                      <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9B2226]">
                          {isAr ? 'أحدث طلب لك' : 'Latest Order'}
                        </span>
                        <h3 className="font-serif-luxury text-base font-bold text-[#161413]">
                          {isAr ? `الطلب رقم #${recentOrder.orderNumber}` : `Order #${recentOrder.orderNumber}`}
                        </h3>
                      </div>

                      <span className="bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>
                          {recentOrder.status === 'processing'
                            ? (isAr ? 'قيد التجهيز والتغليف السري' : 'In Preparation')
                            : recentOrder.status === 'delivered'
                            ? (isAr ? 'تم التسليم بنجاح' : 'Delivered')
                            : (isAr ? 'تم استلام الطلب' : 'Placed')}
                        </span>
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-2 rtl:space-x-reverse overflow-hidden">
                          {recentOrder.items.map((item, idx) => (
                            <img
                              key={idx}
                              src={item.product.images[0]}
                              alt={item.product.nameAr}
                              referrerPolicy="no-referrer"
                              className="w-12 h-14 object-cover rounded-md border-2 border-white bg-[#F5EFE6]"
                            />
                          ))}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#161413]">
                            {recentOrder.items.length} {isAr ? 'منتجات مميزة' : 'items'}
                          </p>
                          <p className="text-[11px] text-[#7A746B]">
                            {isAr ? 'تاريخ الطلب:' : 'Date:'} {recentOrder.date} • {recentOrder.total.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => navigateToOrder(recentOrder)}
                        className="bg-[#9B2226] hover:bg-[#801B1E] text-white px-5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                        <span>{isAr ? 'تتبع الشحنة والتفاصيل' : 'Live Track Order'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Default Delivery Address Card */}
                <div className="bg-white border border-[#E6DFC6] rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#F0EAE1]">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#9B2226]" />
                      <h3 className="font-serif-luxury text-base font-bold text-[#161413]">
                        {isAr ? 'عنوان التوصيل الافتراضي' : 'Default Shipping Address'}
                      </h3>
                    </div>
                    <button
                      onClick={() => showToast(isAr ? 'تم حفظ العنوان بنجاح' : 'Address updated', 'info')}
                      className="text-xs text-[#9B2226] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{isAr ? 'تعديل العنوان' : 'Edit'}</span>
                    </button>
                  </div>

                  <div className="text-xs text-[#4A453E] space-y-1">
                    <p className="font-bold text-[#161413] text-sm">{user.defaultAddress.fullName}</p>
                    <p>{user.defaultAddress.street}</p>
                    <p>{user.defaultAddress.city}, {user.defaultAddress.governorate}</p>
                    <p className="text-[#7A746B]">{isAr ? 'علامة مميزة:' : 'Landmark:'} {user.defaultAddress.landmark}</p>
                    <p className="font-mono text-[#161413] pt-1">{user.defaultAddress.phone}</p>
                  </div>
                </div>

                {/* Wishlist Quick Preview */}
                <div className="bg-white border border-[#E6DFC6] rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#F0EAE1]">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-[#9B2226]" />
                      <h3 className="font-serif-luxury text-base font-bold text-[#161413]">
                        {isAr ? 'المفضلة المحفوظة' : 'Saved Wishlist Items'} ({wishlistProducts.length})
                      </h3>
                    </div>
                    <button
                      onClick={() => setCurrentView('wishlist')}
                      className="text-xs text-[#9B2226] font-semibold hover:underline cursor-pointer"
                    >
                      {isAr ? 'عرض الكل' : 'View All'} →
                    </button>
                  </div>

                  {wishlistProducts.length === 0 ? (
                    <p className="text-xs text-[#7A746B] py-4 text-center">
                      {isAr ? 'لم تقومي بحفظ أي منتجات في المفضلة بعد.' : 'No saved items in your wishlist.'}
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {wishlistProducts.slice(0, 2).map(prod => (
                        <div
                          key={prod.id}
                          onClick={() => navigateToProduct(prod)}
                          className="flex items-center gap-3 p-3 bg-[#FBF9F5] border border-[#E8E0D2] rounded-xl hover:border-[#9B2226] transition-colors cursor-pointer group"
                        >
                          <img
                            src={prod.images[0]}
                            alt={isAr ? prod.nameAr : prod.nameEn}
                            referrerPolicy="no-referrer"
                            className="w-14 h-16 object-cover rounded-lg bg-white shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs font-bold text-[#161413] truncate group-hover:text-[#9B2226]">
                              {isAr ? prod.nameAr : prod.nameEn}
                            </h4>
                            <span className="font-mono text-xs font-bold text-[#161413] block mt-1">
                              {prod.price.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === 'addresses' && (
              <div className="bg-white border border-[#E6DFC6] rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="font-serif-luxury text-base font-bold text-[#161413] pb-3 border-b border-[#F0EAE1]">
                  {isAr ? 'عناوين التوصيل المسجلة' : 'Registered Addresses'}
                </h3>
                <div className="p-4 bg-[#FBF9F5] border border-[#9B2226] rounded-xl text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#9B2226]">{isAr ? 'العنوان الرئيسي' : 'Primary Address'}</span>
                    <span className="bg-[#9B2226] text-white text-[10px] px-2 py-0.5 rounded">Default</span>
                  </div>
                  <p className="font-semibold text-black">{user.defaultAddress.fullName}</p>
                  <p>{user.defaultAddress.street}</p>
                  <p>{user.defaultAddress.city}, {user.defaultAddress.governorate}</p>
                  <p className="font-mono">{user.defaultAddress.phone}</p>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white border border-[#E6DFC6] rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="font-serif-luxury text-base font-bold text-[#161413] pb-3 border-b border-[#F0EAE1]">
                  {isAr ? 'إعدادات الخصوصية والأمان' : 'Security & Privacy Controls'}
                </h3>
                <div className="space-y-3 text-xs">
                  <label className="flex items-center justify-between p-3 bg-[#FBF9F5] border border-[#E6DFC6] rounded-xl cursor-pointer">
                    <span>{isAr ? 'تغليف سري دائم لجميع الطلبات القادمة' : 'Always enforce discreet packaging'}</span>
                    <input type="checkbox" defaultChecked className="accent-[#9B2226]" />
                  </label>
                  <label className="flex items-center justify-between p-3 bg-[#FBF9F5] border border-[#E6DFC6] rounded-xl cursor-pointer">
                    <span>{isAr ? 'إشعارات الرسائل القصيرة لتتبع الشحنة' : 'SMS tracking updates'}</span>
                    <input type="checkbox" defaultChecked className="accent-[#9B2226]" />
                  </label>
                  <label className="flex items-center justify-between p-3 bg-[#FBF9F5] border border-[#E6DFC6] rounded-xl cursor-pointer">
                    <span>{isAr ? 'العروض الحصرية السرية عبر البريد الإلكتروني' : 'Private email journal & VIP sales'}</span>
                    <input type="checkbox" defaultChecked className="accent-[#9B2226]" />
                  </label>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
