import React, { useState } from 'react';
import { ShoppingBag, Menu, X, Leaf, User, LogOut } from 'lucide-react';
import LanguageToggle from './LanguageToggle';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Cart from './Cart';
import Auth from './Auth';

interface HeaderProps {
  onCheckout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCheckout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const { t } = useLanguage();
  const { getTotalItems } = useCart();
  const { user, logout, isAuthenticated } = useAuth();

  const navigation = {
    home: { fr: 'Accueil', en: 'Home' },
    products: { fr: 'Produits', en: 'Products' },
    about: { fr: 'À Propos', en: 'About' },
    contact: { fr: 'Contact', en: 'Contact' }
  };

  const handleCheckout = () => {
    setCartOpen(false);
    onCheckout();
  };

  return (
    <>
      <header className="fixed top-0 w-full bg-cream/95 backdrop-blur-sm z-50 border-b border-sage-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-sage-600 rounded-full flex items-center justify-center">
              <Leaf className="w-6 h-6 text-cream" />
            </div>
            <span className="text-2xl font-serif font-bold text-sage-800 tracking-wide">
              Soapyfy
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {Object.entries(navigation).map(([key, value]) => (
              <a
                key={key}
                href={`#${key}`}
                className="text-sage-700 hover:text-sage-900 font-medium transition-colors duration-200 hover:underline underline-offset-4"
              >
                {t(value)}
              </a>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageToggle />
            
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-sage-600">
                  {t({ fr: 'Bonjour', en: 'Hello' })}, {user?.email.split('@')[0]}
                </span>
                <button
                  onClick={logout}
                  className="p-2 text-sage-700 hover:text-sage-900 transition-colors"
                  title={t({ fr: 'Déconnexion', en: 'Logout' })}
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAuthOpen(true)}
                className="p-2 text-sage-700 hover:text-sage-900 transition-colors"
                title={t({ fr: 'Connexion', en: 'Login' })}
              >
                <User className="w-6 h-6" />
              </button>
            )}
            
            <button 
              onClick={() => setCartOpen(true)}
              className={`relative p-2 text-sage-700 hover:text-sage-900 transition-colors ${getTotalItems() > 0 ? 'animate-pulse' : ''}`}
            >
              <ShoppingBag className="w-6 h-6" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                  {getTotalItems()}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-sage-700"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-sage-200 bg-cream/95 backdrop-blur-sm">
            <div className="flex flex-col space-y-4">
              {Object.entries(navigation).map(([key, value]) => (
                <a
                  key={key}
                  href={`#${key}`}
                  className="text-sage-700 hover:text-sage-900 font-medium px-4 py-2 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t(value)}
                </a>
              ))}
              <div className="px-4 py-2">
                {!isAuthenticated && (
                  <button 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setAuthOpen(true);
                    }}
                    className="flex items-center gap-2 text-sage-700 hover:text-sage-900 mb-2"
                  >
                    <User className="w-5 h-5" />
                    <span>{t({ fr: 'Connexion', en: 'Login' })}</span>
                  </button>
                )}
                
                {isAuthenticated && (
                  <div className="mb-2">
                    <p className="text-sm text-sage-600 mb-2">
                      {t({ fr: 'Bonjour', en: 'Hello' })}, {user?.email.split('@')[0]}
                    </p>
                    <button 
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2 text-sage-700 hover:text-sage-900"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>{t({ fr: 'Déconnexion', en: 'Logout' })}</span>
                    </button>
                  </div>
                )}
                
                <button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setCartOpen(true);
                  }}
                  className="flex items-center gap-2 text-sage-700 hover:text-sage-900"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>{t({ fr: 'Panier', en: 'Cart' })} ({getTotalItems()})</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
      </header>
      
      <Cart 
        isOpen={cartOpen} 
        onClose={() => setCartOpen(false)} 
        onCheckout={handleCheckout}
      />
      
      <Auth 
        isOpen={authOpen} 
        onClose={() => setAuthOpen(false)} 
      />
    </>
  );
};

export default Header;