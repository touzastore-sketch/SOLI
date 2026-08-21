import React, { useState } from 'react';
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  Truck, 
  Eye, 
  ShoppingBag, 
  ArrowRight, 
  ArrowLeft,
  Lock,
  Search
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { Order } from '../../types';

export const OrdersView: React.FC = () => {
  const {
    language,
    orders,
    navigateToOrder,
    setCurrentView,
    addToCart
  } = useShop();

  const isAr = language === 'ar';
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredOrders = orders.filter(order => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'processing') return order.status === 'processing' || order.status === 'placed';
    if (filterStatus === 'shipped') return order.status === 'shipped' || order.status === 'out_for_delivery';
    if (filterStatus === 'delivered') return order.status === 'delivered';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1E1C1A] py-10 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#8A847B] mb-6">
          <button onClick={() => setCurrentView('home')} className="hover:text-[#9B2226] cursor-pointer">
            {isAr ? 'الرئيسية' : 'Home'}
          </button>
          <span>/</span>
          <button onClick={() => setCurrentView('account')} className="hover:text-[#9B2226] cursor-pointer">
            {isAr ? 'حسابي' : 'Account'}
          </button>
          <span>/</span>
          <span className="text-[#1E1C1A] font-bold">
            {isAr ? 'سجل الطلبات والتتبع' : 'My Orders & Tracking'}
          </span>
        </nav>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-[#E6DEC8] gap-4 mb-8">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#9B2226] block">
              {isAr ? 'تتبع الشحنات المباشر' : 'Order History'}
            </span>
            <h1 className="font-serif-luxury text-3xl font-bold text-[#161413]">
              {isAr ? 'طلباتي السابقة والحالية' : 'My Orders & Shipments'}
            </h1>
            <p className="text-xs text-[#7A746B] mt-1">
              {isAr
                ? 'تابعي حالة كل طلب وخطوات التغليف السري والتوصيل خطوة بخطوة.'
                : 'Track the real-time discreet dispatch and courier delivery of your purchases.'}
            </p>
          </div>

          {/* Status Filter Chips */}
          <div className="flex items-center bg-[#F2EDE4] p-1 rounded-lg border border-[#E0D8CC]">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1 text-xs rounded font-medium transition-colors cursor-pointer ${
                filterStatus === 'all' ? 'bg-[#1E1C1A] text-white shadow-sm font-bold' : 'text-[#6B655D]'
              }`}
            >
              {isAr ? 'الكل' : 'All'}
            </button>
            <button
              onClick={() => setFilterStatus('processing')}
              className={`px-3 py-1 text-xs rounded font-medium transition-colors cursor-pointer ${
                filterStatus === 'processing' ? 'bg-[#1E1C1A] text-white shadow-sm font-bold' : 'text-[#6B655D]'
              }`}
            >
              {isAr ? 'قيد التجهيز' : 'Processing'}
            </button>
            <button
              onClick={() => setFilterStatus('delivered')}
              className={`px-3 py-1 text-xs rounded font-medium transition-colors cursor-pointer ${
                filterStatus === 'delivered' ? 'bg-[#1E1C1A] text-white shadow-sm font-bold' : 'text-[#6B655D]'
              }`}
            >
              {isAr ? 'تم التسليم' : 'Delivered'}
            </button>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white border border-[#E6DFC6] rounded-2xl p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#F5EFE6] mx-auto flex items-center justify-center text-[#7A746B]">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="font-serif-luxury text-xl font-bold text-[#161413]">
              {isAr ? 'لا توجد طلبات في هذا القسم' : 'No orders found'}
            </h3>
            <button
              onClick={() => setCurrentView('shop')}
              className="bg-[#9B2226] text-white px-6 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider cursor-pointer"
            >
              {isAr ? 'تصفح المتجر الآن' : 'Start Shopping'}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map(order => (
              <div
                key={order.id}
                className="bg-white border border-[#E6DFC6] rounded-2xl p-6 shadow-sm hover:border-[#9B2226] transition-all space-y-4"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F0EAE1] gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F6F2EB] flex items-center justify-center text-[#9B2226]">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif-luxury text-base font-bold text-[#161413]">
                          {isAr ? `طلب رقم #${order.orderNumber}` : `Order #${order.orderNumber}`}
                        </h3>
                        {order.isDiscreetPackaging && (
                          <span className="bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0] text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" />
                            {isAr ? 'تغليف سري' : 'Discreet'}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#7A746B]">
                        {isAr ? 'تاريخ الطلب:' : 'Date:'} {order.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 ${
                        order.status === 'delivered'
                          ? 'bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]'
                          : order.status === 'processing'
                          ? 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]'
                          : 'bg-[#EFF6FF] text-[#1E40AF] border border-[#BFDBFE]'
                      }`}
                    >
                      {order.status === 'delivered' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {order.status === 'processing' && <Clock className="w-3.5 h-3.5" />}
                      {order.status === 'shipped' && <Truck className="w-3.5 h-3.5" />}
                      <span>
                        {order.status === 'delivered'
                          ? (isAr ? 'تم التسليم بنجاح' : 'Delivered')
                          : order.status === 'processing'
                          ? (isAr ? 'قيد التجهيز والتغليف' : 'Processing')
                          : order.status === 'shipped'
                          ? (isAr ? 'تم الشحن مع المندوب' : 'Shipped')
                          : (isAr ? 'تم تأكيد الطلب' : 'Confirmed')}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Items Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.nameAr}
                          referrerPolicy="no-referrer"
                          className="w-14 h-16 object-cover rounded-lg bg-[#F5EFE6] border border-[#E0D8CB]"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-[#161413] line-clamp-1">
                            {isAr ? item.product.nameAr : item.product.nameEn}
                          </h4>
                          <p className="text-[11px] text-[#7A746B] mt-0.5">
                            {isAr ? item.colorNameAr : item.colorNameEn} • {item.size} • {item.quantity} {isAr ? 'قطع' : 'pcs'}
                          </p>
                          <span className="font-mono text-xs font-bold text-[#161413]">
                            {(item.price * item.quantity).toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary & Actions */}
                  <div className="flex flex-col justify-between p-4 bg-[#FBF9F5] border border-[#E8E0D2] rounded-xl text-xs space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[#7A746B]">
                        <span>{isAr ? 'المجموع:' : 'Total:'}</span>
                        <span className="font-mono font-bold text-sm text-[#161413]">
                          {order.total.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
                        </span>
                      </div>
                      <div className="flex justify-between text-[#7A746B]">
                        <span>{isAr ? 'عنوان التوصيل:' : 'Delivery to:'}</span>
                        <span className="truncate max-w-[200px]">
                          {order.shippingAddress.city}, {order.shippingAddress.governorate}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-[#EAE2D5]">
                      <button
                        onClick={() => navigateToOrder(order)}
                        className="flex-1 bg-[#9B2226] hover:bg-[#801B1E] text-white py-2.5 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{isAr ? 'تتبع الشحنة بالتفصيل' : 'Live Tracking'}</span>
                      </button>

                      <button
                        onClick={() => {
                          order.items.forEach(it => addToCart(it.product));
                        }}
                        className="p-2.5 bg-white border border-[#DCD4C7] hover:bg-[#F2ECE1] text-[#1E1C1A] rounded-lg transition-colors cursor-pointer"
                        title={isAr ? 'إعادة طلب المنتجات' : 'Reorder'}
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>
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
