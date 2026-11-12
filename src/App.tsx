import React from 'react';
import { StoreProvider } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductGrid } from './components/ProductGrid';
import { StorySection } from './components/StorySection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AdminProductManager } from './components/AdminProductManager';
import { OrderHistoryModal } from './components/OrderHistoryModal';
import { WishlistModal } from './components/WishlistModal';
import { PhotoEditorModal } from './components/PhotoEditorModal';
import { TajikistanDeliveryMap } from './components/TajikistanDeliveryMap';
import { ToastNotification } from './components/ToastNotification';

export default function App() {
  return (
    <StoreProvider>
      <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 dark:bg-stone-950 dark:text-stone-100 transition-colors">
        {/* Navigation */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-1">
          <Hero />
          <ProductGrid />

          {/* Interactive Delivery Map of Tajikistan Section */}
          <section id="tajikistan-map" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 scroll-mt-20">
            <TajikistanDeliveryMap />
          </section>

          <StorySection />
        </main>

        {/* Footer */}
        <Footer />

        {/* Interactive Modals and Drawers */}
        <CartDrawer />
        <CheckoutModal />
        <OrderConfirmationModal />
        <ProductDetailModal />
        <AdminProductManager />
        <OrderHistoryModal />
        <WishlistModal />
        <PhotoEditorModal />

        {/* Floating Toast Feedback */}
        <ToastNotification />
      </div>
    </StoreProvider>
  );
}
