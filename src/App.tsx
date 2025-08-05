import React from 'react';
import { useState } from 'react';
import ShippingBanner from './components/ShippingBanner';
import { LanguageProvider } from './context/LanguageContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Products from './components/Products';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Checkout from './components/Checkout';
import OrderConfirmation from './components/OrderConfirmation';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import MyOrders from './components/MyOrders';
import { useAuth } from './context/AuthContext';

function AppContent() {
  const { adminLogout, isAdmin } = useAuth();
  const [currentView, setCurrentView] = useState<'home' | 'checkout' | 'confirmation' | 'admin' | 'adminDashboard' | 'myOrders'>('home');

  // Check if we're on the admin route
  React.useEffect(() => {
    if (window.location.pathname === '/master') {
      setCurrentView('admin');
    }
  }, []);

  const handleCheckout = () => {
    setCurrentView('checkout');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
  };

  const handleOrderComplete = () => {
    setCurrentView('confirmation');
  };

  const handleAdminLogin = () => {
    setCurrentView('adminDashboard');
    window.history.pushState({}, '', '/master');
  };

  const handleAdminLogout = () => {
    adminLogout();
    setCurrentView('home');
    window.history.pushState({}, '', '/');
  };

  // Admin routes
  if (currentView === 'admin') {
    return isAdmin ? (
      <AdminDashboard onLogout={handleAdminLogout} />
    ) : (
      <AdminLogin onSuccess={handleAdminLogin} />
    );
  }

  if (currentView === 'adminDashboard') {
    return <AdminDashboard onLogout={handleAdminLogout} />;
  }

  return (
    <div className="min-h-screen font-sans">
      {currentView === 'home' && (
        <>
          <ShippingBanner />
          <Header onCheckout={handleCheckout} setCurrentView={setCurrentView} />
          <Hero />
          <Products />
          <About />
          <Contact />
          <Footer />
        </>
      )}
      
      {currentView === 'myOrders' && (
        <>
          <ShippingBanner />
          <MyOrders onBack={handleBackToHome} />
        </>
      )}
      
      {currentView === 'checkout' && (
        <>
          <ShippingBanner />
          <Checkout 
            onBack={handleBackToHome}
            onComplete={handleOrderComplete}
          />
        </>
      )}
      
      {currentView === 'confirmation' && (
        <OrderConfirmation 
          onContinueShopping={handleBackToHome}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;