import React from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Package, 
  CheckCircle2, 
  Clock, 
  Truck, 
  MapPin, 
  ShieldCheck, 
  Lock, 
  Phone, 
  Calendar, 
  CreditCard,
  ShoppingBag,
  Sparkles,
  MessageCircle,
  FileText
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { INITIAL_ORDERS } from '../../data/products';

export const OrderDetailView: React.FC = () => {
  const {
    language,
    selectedOrder,
    setCurrentView,
    addToCart,
    showToast
  } = useShop();

  const isAr = language === 'ar';
  const order = selectedOrder || INITIAL_ORDERS[0];

  const steps = [
    {
      id: 'placed',
      titleAr: 'تم استلام الطلب وتأكيده',
      titleEn: 'Order Confirmed',
      descAr: 'تم تسجيل طلبك بنجاح في نظام بوتيك روني',
      descEn: 'Your order was received and verified',
      icon: Clock,
      isDone: true,
      time: order.date
    },
    {
      id: 'discreet_pack',
      titleAr: 'التجهيز والتغليف السري المعتم',
      titleEn: 'Discreet Packaging & Sealing',
      descAr: 'تم فحص جودة الحرير وتغليف القطع في صندوق كرتوني محايد بدون أي شعار',
      descEn: 'Quality inspected and sealed in 100% plain unbranded box',
      icon: Lock,
      isDone: order.status !== 'placed',
      time: order.status === 'placed' ? (isAr ? 'قيد التنفيذ' : 'In Progress') : '2:15 PM'
    },
    {
      id: 'shipped',
      titleAr: 'تسليم الشحنة للمندوب الخاص',
      titleEn: 'Handed to Private Courier',
      descAr: 'خرجت الشحنة مع مندوب التوصيل المعتمد لمدينتك',
      descEn: 'Assigned to trusted courier for your area',
      icon: Truck,
      isDone: order.status === 'shipped' || order.status === 'out_for_delivery' || order.status === 'delivered',
      time: order.status === 'shipped' || order.status === 'delivered' ? '4:30 PM' : (isAr ? 'قريباً' : 'Pending')
    },
    {
      id: 'out_for_delivery',
      titleAr: 'في الطريق إلى عنوانك',
      titleEn: 'Out for Delivery',
      descAr: 'المندوب في طريقه لمنزلك للتسليم المباشر',
      descEn: 'Courier is en route to your specified address',
      icon: MapPin,
      isDone: order.status === 'out_for_delivery' || order.status === 'delivered',
      time: order.status === 'delivered' ? '6:00 PM' : (isAr ? 'قريباً' : 'Pending')
    },
    {
      id: 'delivered',
      titleAr: 'تم التسليم بنجاح',
      titleEn: 'Delivered Successfully',
      descAr: 'تم تسليم الطرد المغلق واستلام المبلغ',
      descEn: 'Order delivered safely to recipient',
      icon: CheckCircle2,
      isDone: order.status === 'delivered',
      time: order.status === 'delivered' ? '6:45 PM' : (isAr ? 'قريباً' : 'Pending')
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1E1C1A] py-10 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-[#8A847B] mb-6">
          <button onClick={() => setCurrentView('home')} className="hover:text-[#9B2226] cursor-pointer">
            {isAr ? 'الرئيسية' : 'Home'}
          </button>
          <span>/</span>
          <button onClick={() => setCurrentView('orders')} className="hover:text-[#9B2226] cursor-pointer">
            {isAr ? 'الطلبات' : 'Orders'}
          </button>
          <span>/</span>
          <span className="text-[#1E1C1A] font-bold">
            #{order.orderNumber}
          </span>
        </nav>

        {/* Top Header Card */}
        <div className="bg-white border border-[#E6DFC6] rounded-2xl p-6 sm:p-8 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F0EAE1]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#9B2226]">
                  {isAr ? 'تتبع الشحنة المباشر' : 'Live Shipment Tracker'}
                </span>
                {order.isDiscreetPackaging && (
                  <span className="bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0] text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    {isAr ? 'تغليف سري معتمد 100%' : '100% Discreet Packaging'}
                  </span>
                )}
              </div>

              <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#161413]">
                {isAr ? `الطلب #${order.orderNumber}` : `Order #${order.orderNumber}`}
              </h1>
              <p className="text-xs text-[#7A746B] mt-1">
                {isAr ? 'تاريخ الإنشاء:' : 'Created on:'} {order.date} • {isAr ? 'رقم التتبع:' : 'Tracking:'}{' '}
                <span className="font-mono font-bold text-black">{order.trackingNumber || 'EG-883921'}</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  order.items.forEach(it => addToCart(it.product));
                  showToast(isAr ? 'تمت إضافة المنتجات لحقيبة التسوق' : 'Items added to cart', 'success');
                }}
                className="bg-[#1E1C1A] hover:bg-[#332F2C] text-white px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{isAr ? 'إعادة طلب هذه القطع' : 'Reorder Items'}</span>
              </button>
            </div>
          </div>

          {/* Prominent WhatsApp Instant Action Box */}
          <div className="mt-6 bg-[#F0FDF4] border-2 border-[#86EFAC] rounded-2xl p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-[#166534] font-bold">
                  <div className="w-7 h-7 rounded-full bg-[#22C55E] text-white flex items-center justify-center shrink-0">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif-luxury text-base font-bold text-[#14532D]">
                    {isAr 
                      ? 'اضغط إرسال في واتساب لتأكيد استلام طلبك من فريقنا' 
                      : 'Click Send in WhatsApp to confirm order receipt with our team'}
                  </h3>
                </div>
                <p className="text-xs text-[#15803D] leading-relaxed max-w-2xl">
                  {isAr
                    ? 'تم تجهيز تفاصيل هذا الطلب بالكامل ومسبقاً. إذا لم تفتح نافذة واتساب تلقائياً، يرجى الضغط على الزر الأخضر أدناه ثم الضغط على (إرسال) داخل محادثة واتساب.'
                    : 'Your order message is pre-filled and ready. Click the green button below and tap "Send" in WhatsApp to confirm immediately with our fulfillment desk.'}
                </p>
              </div>

              <div className="shrink-0 flex flex-wrap gap-2">
                <a
                  href={order.whatsappUrl || `https://wa.me/201002108272?text=${encodeURIComponent(
                    `🛍️ طلب جديد #${order.orderNumber}\nالعميل: ${order.shippingAddress.fullName}\nالهاتف: ${order.shippingAddress.phone}\nالعنوان: ${order.shippingAddress.governorate} - ${order.shippingAddress.city} - ${order.shippingAddress.street}\nالإجمالي: ${order.total} ج.م`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#22C55E] hover:bg-[#16A34A] text-white text-xs font-bold py-3 px-6 rounded-xl shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{isAr ? 'فتح محادثة واتساب الآن 📲' : 'Open WhatsApp Chat Now 📲'}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="pt-8">
            <h3 className="font-serif-luxury text-base font-bold text-[#161413] mb-8">
              {isAr ? 'مراحل تجهيز وتسليم شحنتك' : 'Delivery Progress & Timeline'}
            </h3>

            <div className="relative">
              {/* Stepper Vertical on mobile, Horizontal on desktop */}
              <div className="space-y-6 sm:space-y-0 sm:grid sm:grid-cols-5 gap-4 relative">
                {steps.map((step, idx) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.id} className="flex sm:flex-col items-start sm:items-center text-right rtl:text-right sm:rtl:text-center sm:ltr:text-center gap-3 sm:gap-2 relative">
                      {/* Circle Icon */}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                          step.isDone
                            ? 'bg-[#9B2226] border-[#9B2226] text-white shadow-md'
                            : 'bg-white border-[#DCD4C7] text-[#A09A92]'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      {/* Content */}
                      <div>
                        <h4 className={`text-xs font-bold ${step.isDone ? 'text-[#161413]' : 'text-[#8E877E]'}`}>
                          {isAr ? step.titleAr : step.titleEn}
                        </h4>
                        <p className="text-[10px] text-[#7A746B] mt-0.5 leading-snug hidden sm:block">
                          {isAr ? step.descAr : step.descEn}
                        </p>
                        <span className="text-[10px] font-mono text-[#9B2226] block mt-1 font-semibold">
                          {step.time}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Info Details */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left / Ordered Items (7 cols) */}
          <div className="md:col-span-7 space-y-6">
            <div className="bg-white border border-[#E6DFC6] rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-serif-luxury text-base font-bold text-[#161413] pb-3 border-b border-[#F0EAE1]">
                {isAr ? 'محتويات الشحنة المحمية' : 'Protected Package Items'} ({order.items.length})
              </h3>

              <div className="space-y-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 pb-4 border-b border-[#F5EFE6] last:border-0 last:pb-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.nameAr}
                      referrerPolicy="no-referrer"
                      className="w-16 h-20 object-cover rounded-xl bg-[#F5EFE6] border border-[#E0D8CB]"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-[#161413] truncate">
                        {isAr ? item.product.nameAr : item.product.nameEn}
                      </h4>
                      <p className="text-[11px] text-[#7A746B] mt-0.5">
                        {isAr ? 'اللون:' : 'Color:'} {isAr ? item.colorNameAr : item.colorNameEn} • {isAr ? 'المقاس:' : 'Size:'} {item.size}
                      </p>
                      <p className="text-[11px] text-[#7A746B]">
                        {isAr ? 'الكمية:' : 'Qty:'} {item.quantity} × {item.price.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
                      </p>
                    </div>

                    <span className="font-mono text-xs font-bold text-[#161413]">
                      {(item.price * item.quantity).toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Discreet Packaging Security Guarantee Box */}
            <div className="bg-[#F2EDE4] border border-[#DDD3C2] rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-2.5 text-[#9B2226] font-bold text-sm">
                <Lock className="w-5 h-5" />
                <span>{isAr ? 'شهادة التغليف السري والمعتم' : 'Discreet Sealing Certificate'}</span>
              </div>
              <p className="text-xs text-[#5C564E] leading-relaxed">
                {isAr
                  ? 'تم إغلاق هذا الطرد بشريط أمان معتم غير قابل لإعادة الفتح بدون أثر، مع بوليصة شحن محايدة لا تحمل اسم الماركة أو تفاصيل المحتوى الداخلي لضمان سرية مشترياتك 100%.'
                  : 'This parcel is sealed with opaque tamper-evident tape and neutral shipping waybill with zero intimacy references.'}
              </p>
            </div>
          </div>

          {/* Right / Financial & Shipping Details (5 cols) */}
          <div className="md:col-span-5 space-y-6">
            {/* WhatsApp Automated Notification Status Card */}
            <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl p-5 shadow-sm space-y-3 text-xs">
              <div className="flex items-center gap-2 text-[#166534] font-bold">
                <MessageCircle className="w-4 h-4 text-[#16A34A]" />
                <h4 className="font-serif-luxury text-sm">
                  {isAr ? 'إشعار WhatsApp التلقائي' : 'Instant WhatsApp Dispatch'}
                </h4>
              </div>
              <p className="text-[#15803D] leading-relaxed text-[11px]">
                {isAr 
                  ? 'تم تجهيز وإرسال تفاصيل هذا الطلب تلقائياً إلى إدارة المتجر وفريق التجهيز عبر رقمي WhatsApp للمتابعة الفورية.'
                  : 'Order details were automatically prepared and dispatched to store management & fulfillment team via 2 dedicated WhatsApp numbers.'}
              </p>

              {/* Direct Quick WhatsApp Links for immediate manual access / reassurance */}
              <div className="flex flex-wrap gap-2 pt-1 border-t border-[#DCFCE7]">
                <a
                  href={`https://api.whatsapp.com/send?phone=201002108272&text=${encodeURIComponent(
                    `*طلب #${order.orderNumber} - متجر روني*\n- العميل: ${order.shippingAddress.fullName}\n- الهاتف: ${order.shippingAddress.phone}\n- العنوان: ${order.shippingAddress.governorate} - ${order.shippingAddress.city} - ${order.shippingAddress.street}\n- الإجمالي: ${order.total} جنيه`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[140px] bg-[#16A34A] hover:bg-[#15803D] text-white text-[11px] font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors text-center"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{isAr ? 'محادثة رقم 1' : 'WhatsApp Line 1'}</span>
                </a>
                <a
                  href={`https://api.whatsapp.com/send?phone=201095461883&text=${encodeURIComponent(
                    `*طلب #${order.orderNumber} - متجر روني*\n- العميل: ${order.shippingAddress.fullName}\n- الهاتف: ${order.shippingAddress.phone}\n- العنوان: ${order.shippingAddress.governorate} - ${order.shippingAddress.city} - ${order.shippingAddress.street}\n- الإجمالي: ${order.total} جنيه`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[140px] bg-[#1E1C1A] hover:bg-[#332F2C] text-white text-[11px] font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors text-center"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{isAr ? 'محادثة رقم 2' : 'WhatsApp Line 2'}</span>
                </a>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white border border-[#E6DFC6] rounded-2xl p-6 shadow-sm space-y-3 text-xs">
              <div className="flex items-center gap-2 pb-2 border-b border-[#F0EAE1]">
                <MapPin className="w-4 h-4 text-[#9B2226]" />
                <h3 className="font-serif-luxury text-sm font-bold text-[#161413]">
                  {isAr ? 'عنوان التسليم' : 'Delivery Destination'}
                </h3>
              </div>

              <div className="text-[#4A453E] space-y-1">
                <p className="font-bold text-black text-sm">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.governorate}</p>
                {order.shippingAddress.landmark && (
                  <p className="text-[#7A746B]">
                    {isAr ? 'علامة مميزة:' : 'Landmark:'} {order.shippingAddress.landmark}
                  </p>
                )}
                <p className="font-mono pt-1 text-black font-semibold">{order.shippingAddress.phone}</p>
              </div>

              {order.notes && (
                <div className="mt-3 pt-3 border-t border-[#F0EAE1] bg-[#FDF9F0] p-3 rounded-lg border border-[#E8DFC8]">
                  <div className="flex items-center gap-1.5 text-[#854D0E] font-bold mb-1">
                    <FileText className="w-3.5 h-3.5" />
                    <span>{isAr ? 'ملاحظات العميل:' : 'Customer Notes:'}</span>
                  </div>
                  <p className="text-[#713F12] text-[11px] leading-relaxed">{order.notes}</p>
                </div>
              )}
            </div>

            {/* Payment Summary */}
            <div className="bg-white border border-[#E6DFC6] rounded-2xl p-6 shadow-sm space-y-3 text-xs">
              <div className="flex items-center gap-2 pb-2 border-b border-[#F0EAE1]">
                <CreditCard className="w-4 h-4 text-[#9B2226]" />
                <h3 className="font-serif-luxury text-sm font-bold text-[#161413]">
                  {isAr ? 'بيانات الدفع والمجموع' : 'Payment & Charges'}
                </h3>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[#7A746B]">
                  <span>{isAr ? 'طريقة الدفع:' : 'Method:'}</span>
                  <span className="font-semibold text-black">
                    {order.paymentMethod === 'cod'
                      ? isAr ? 'الدفع نقداً عند الاستلام' : 'Cash on Delivery'
                      : order.paymentMethod === 'card'
                      ? isAr ? 'بطاقة بنكية' : 'Credit Card'
                      : isAr ? 'محفظة إلكترونية' : 'Mobile Wallet'}
                  </span>
                </div>

                <div className="flex justify-between text-[#7A746B]">
                  <span>{isAr ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
                  <span className="font-mono font-bold text-black">
                    {order.subtotal.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
                  </span>
                </div>

                {order.discount > 0 && (
                  <div className="flex justify-between text-[#166534]">
                    <span>{isAr ? 'الخصم:' : 'Discount:'}</span>
                    <span className="font-mono font-bold">
                      -{order.discount.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center text-[#7A746B]">
                  <span>{isAr ? 'الشحن:' : 'Shipping:'}</span>
                  <span className="font-bold text-[11px] text-[#9B2226] bg-[#FDF2F2] border border-[#FECDD3] px-2 py-0.5 rounded">
                    {isAr ? 'يتم الاتفاق عليه عبر واتساب' : 'Agreed via WhatsApp'}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-bold text-[#161413] pt-3 border-t border-[#F0EAE1]">
                  <div>
                    <span>{isAr ? 'إجمالي المنتجات:' : 'Products Total:'}</span>
                    <span className="block text-[10px] font-normal text-[#7A746B]">
                      {isAr ? '(+ مصاريف الشحن تُحدد عبر واتساب)' : '(+ Shipping agreed via WhatsApp)'}
                    </span>
                  </div>
                  <span className="font-mono text-base text-[#9B2226]">
                    {order.total.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
