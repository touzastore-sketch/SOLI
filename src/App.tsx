import React, { useEffect } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/layout/CartDrawer';
import { SearchModal } from './components/layout/SearchModal';
import { QuickViewModal } from './components/layout/QuickViewModal';
import { FloatingSocialBar } from './components/layout/FloatingSocialBar';
import { FloatingCartWidget } from './components/layout/FloatingCartWidget';
import { LuxuryPreloader } from './components/layout/LuxuryPreloader';

import { HomeView } from './components/views/HomeView';
import { ShopView } from './components/views/ShopView';
import { ProductDetailView } from './components/views/ProductDetailView';
import { CheckoutView } from './components/views/CheckoutView';
import { AccountView } from './components/views/AccountView';
import { OrdersView } from './components/views/OrdersView';
import { OrderDetailView } from './components/views/OrderDetailView';
import { WishlistView } from './components/views/WishlistView';
import { AdminDashboardView } from './components/views/AdminDashboardView';

const MainContent: React.FC = () => {
  const { currentView, setCurrentView } = useShop();

  // Keyboard shortcut listener: Ctrl + Shift + A to open Admin secretly
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a' || e.key === 'ش')) {
        e.preventDefault();
        setCurrentView('admin');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setCurrentView]);

  // If in Admin View, render the dedicated and separated Admin Dashboard without customer headers/footers
  if (currentView === 'admin') {
    return <AdminDashboardView />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Luxury Brand Intro Preloader with Gold Logo */}
      <LuxuryPreloader />

      <Navbar />

      <main className="flex-grow">
        {currentView === 'home' && <HomeView />}
        {currentView === 'shop' && <ShopView />}
        {(currentView === 'product_detail' || (currentView as string) === 'product-detail') && <ProductDetailView />}
        {currentView === 'checkout' && <CheckoutView />}
        {currentView === 'account' && <AccountView />}
        {currentView === 'orders' && <OrdersView />}
        {(currentView === 'order_detail' || (currentView as string) === 'order-detail') && <OrderDetailView />}
        {currentView === 'wishlist' && <WishlistView />}
      </main>

      <Footer />

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <SearchModal />
      <QuickViewModal />
      <FloatingSocialBar />
      <FloatingCartWidget />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <MainContent />
    </ShopProvider>
  );
}
