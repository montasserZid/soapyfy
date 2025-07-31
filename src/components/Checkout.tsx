import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Truck, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { createOrder } from '../services/firebaseService';

interface CheckoutProps {
  onBack: () => void;
  onComplete: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ onBack, onComplete }) => {
  const { items, getSubtotal, getShipping, getTaxes, getTotalPrice, clearCart } = useCart();
  const { user, login, register, isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const [checkoutType, setCheckoutType] = useState<'guest' | 'login' | 'register'>('guest');
  const [paymentMethod, setPaymentMethod] = useState<'payLater' | 'stripe'>('payLater');
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form states
  const [guestForm, setGuestForm] = useState({
    email: '',
    name: '',
    address: '',
    city: '',
    postalCode: '',
    phone: ''
  });

  // Separate shipping form for authenticated users
  const [shippingForm, setShippingForm] = useState({
    name: '',
    address: '',
    city: '',
    postalCode: '',
    phone: ''
  });

  const [authForm, setAuthForm] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validation
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // For authenticated users, we already have email, for guests we need to validate it
    if (!isAuthenticated) {
      if (checkoutType === 'guest') {
        if (!guestForm.email) newErrors.email = t({ fr: 'Email requis', en: 'Email required' });
        else if (!validateEmail(guestForm.email)) newErrors.email = t({ fr: 'Email invalide', en: 'Invalid email' });
      } else {
        // For login/register, validate auth form
        if (!authForm.email) newErrors.authEmail = t({ fr: 'Email requis', en: 'Email required' });
        else if (!validateEmail(authForm.email)) newErrors.authEmail = t({ fr: 'Email invalide', en: 'Invalid email' });
        
        if (!authForm.password) newErrors.password = t({ fr: 'Mot de passe requis', en: 'Password required' });
        else if (checkoutType === 'register' && authForm.password.length < 6) {
          newErrors.password = t({ fr: 'Minimum 6 caractères', en: 'Minimum 6 characters' });
        }
      }
    }

    // Always validate shipping information (use appropriate form based on checkout type)
    const shipping = checkoutType === 'guest' ? guestForm : shippingForm;
    
    if (!shipping.name) newErrors.name = t({ fr: 'Nom requis', en: 'Name required' });
    if (!shipping.address) newErrors.address = t({ fr: 'Adresse requise', en: 'Address required' });
    if (!shipping.city) newErrors.city = t({ fr: 'Ville requise', en: 'City required' });
    if (!shipping.postalCode) newErrors.postalCode = t({ fr: 'Code postal requis', en: 'Postal code required' });
    if (!shipping.phone) newErrors.phone = t({ fr: 'Téléphone requis', en: 'Phone required' });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAuth = async () => {
    setIsProcessing(true);
    let success = false;

    if (checkoutType === 'login') {
      success = await login(authForm.email, authForm.password);
      if (!success) {
        setErrors({ auth: t({ fr: 'Email ou mot de passe incorrect', en: 'Invalid email or password' }) });
      }
    } else if (checkoutType === 'register') {
      success = await register(authForm.email, authForm.password);
      if (!success) {
        setErrors({ auth: t({ fr: 'Cet email existe déjà', en: 'Email already exists' }) });
      }
    }

    setIsProcessing(false);
    return success;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Handle authentication first if needed
    if (!isAuthenticated && checkoutType !== 'guest') {
      // Validate auth fields
      const authErrors: Record<string, string> = {};
      if (!authForm.email) authErrors.authEmail = t({ fr: 'Email requis', en: 'Email required' });
      else if (!validateEmail(authForm.email)) authErrors.authEmail = t({ fr: 'Email invalide', en: 'Invalid email' });
      
      if (!authForm.password) authErrors.password = t({ fr: 'Mot de passe requis', en: 'Password required' });
      else if (checkoutType === 'register' && authForm.password.length < 6) {
        authErrors.password = t({ fr: 'Minimum 6 caractères', en: 'Minimum 6 characters' });
      }

      if (Object.keys(authErrors).length > 0) {
        setErrors(authErrors);
        return;
      }

      const authSuccess = await handleAuth();
      if (!authSuccess) return;
    }

    // Now validate the complete form
    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      // Prepare shipping info based on checkout type
      const shippingInfo = checkoutType === 'guest' ? {
        email: guestForm.email,
        name: guestForm.name,
        address: guestForm.address,
        city: guestForm.city,
        postalCode: guestForm.postalCode,
        phone: guestForm.phone
      } : {
        email: user?.email || '',
        name: shippingForm.name,
        address: shippingForm.address,
        city: shippingForm.city,
        postalCode: shippingForm.postalCode,
        phone: shippingForm.phone
      };

      const orderData = {
        items: [...items],
        subtotal: getSubtotal(),
        shipping: getShipping(),
        taxes: getTaxes(),
        total: getTotalPrice(),
        paymentMethod,
        guestInfo: shippingInfo,
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
        ...(user?.id && { userId: user.id })
      };

      await createOrder(orderData);
      clearCart();
      setIsProcessing(false);
      onComplete();
    } catch (error) {
      console.error('Error creating order:', error);
      setErrors({ auth: t({ fr: 'Erreur lors de la commande', en: 'Error creating order' }) });
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="p-2 hover:bg-sage-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-sage-600" />
          </button>
          <h1 className="text-3xl font-serif text-sage-800">
            {t({ fr: 'Finaliser la commande', en: 'Checkout' })}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-2xl p-6 shadow-lg h-fit">
            <h2 className="text-xl font-serif text-sage-800 mb-4">
              {t({ fr: 'Résumé de commande', en: 'Order Summary' })}
            </h2>
            
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <img
                    src={item.image}
                    alt={t(item.name)}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-sage-800">{t(item.name)}</h3>
                    <p className="text-sage-600 text-sm">
                      {t({ fr: 'Quantité', en: 'Quantity' })}: {item.quantity}
                    </p>
                    <p className="font-medium text-sage-800">{item.price}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-sage-200 pt-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sage-700">
                  <span>{t({ fr: 'Sous-total', en: 'Subtotal' })}:</span>
                  <span>${getSubtotal().toFixed(2)} CAD</span>
                </div>
                <div className="flex justify-between text-sage-700">
                  <span>{t({ fr: 'Livraison', en: 'Shipping' })}:</span>
                  <div className="text-right">
                    <span>
                      {getShipping() === 0 
                        ? t({ fr: 'Gratuit', en: 'Free' })
                        : `$${getShipping().toFixed(2)} CAD`
                      }
                    </span>
                    {getShipping() > 0 && (
                      <div className="text-xs text-sage-500 mt-1">
                        {t({ 
                          fr: `Ajoutez $${(30 - getSubtotal()).toFixed(2)} pour la livraison gratuite`, 
                          en: `Add $${(30 - getSubtotal()).toFixed(2)} more for free shipping` 
                        })}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-between text-sage-700">
                  <span>{t({ fr: 'Taxes (QC)', en: 'Taxes (QC)' })}:</span>
                  <span>${getTaxes().toFixed(2)} CAD</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-sage-200 text-xl font-bold text-sage-800">
                  <span>{t({ fr: 'Total', en: 'Total' })}:</span>
                  <span>${getTotalPrice().toFixed(2)} CAD</span>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Checkout Type Selection */}
              {!isAuthenticated && (
                <div>
                  <h3 className="text-lg font-serif text-sage-800 mb-4">
                    {t({ fr: 'Type de commande', en: 'Checkout Type' })}
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {(['guest', 'login', 'register'] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setCheckoutType(type)}
                        className={`p-3 rounded-xl text-sm font-medium transition-all ${
                          checkoutType === type
                            ? 'bg-sage-600 text-white'
                            : 'bg-sage-100 text-sage-600 hover:bg-sage-200'
                        }`}
                      >
                        {type === 'guest' && t({ fr: 'Invité', en: 'Guest' })}
                        {type === 'login' && t({ fr: 'Connexion', en: 'Login' })}
                        {type === 'register' && t({ fr: 'Créer compte', en: 'Register' })}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Shipping Information Form */}
              {(checkoutType === 'guest' || isAuthenticated) && (
                <div className="space-y-4">
                  <h3 className="text-lg font-serif text-sage-800 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    {t({ fr: 'Informations de livraison', en: 'Shipping Information' })}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sage-700 font-medium mb-2">
                        {t({ fr: 'Email', en: 'Email' })}
                      </label>
                      <input
                        type="email"
                        value={isAuthenticated ? user?.email || '' : guestForm.email}
                        onChange={(e) => {
                          if (!isAuthenticated && checkoutType === 'guest') {
                            setGuestForm({...guestForm, email: e.target.value});
                          }
                        }}
                        disabled={isAuthenticated}
                        className={`w-full px-4 py-3 rounded-xl border border-sage-200 focus:border-sage-400 focus:ring-2 focus:ring-sage-200 outline-none transition-all ${
                          isAuthenticated ? 'bg-sage-50 cursor-not-allowed' : ''
                        }`}
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-sage-700 font-medium mb-2">
                        {t({ fr: 'Nom complet', en: 'Full Name' })}
                      </label>
                      <input
                        type="text"
                        value={checkoutType === 'guest' ? guestForm.name : shippingForm.name}
                        onChange={(e) => {
                          if (checkoutType === 'guest') {
                            setGuestForm({...guestForm, name: e.target.value});
                          } else {
                            setShippingForm({...shippingForm, name: e.target.value});
                          }
                        }}
                        className="w-full px-4 py-3 rounded-xl border border-sage-200 focus:border-sage-400 focus:ring-2 focus:ring-sage-200 outline-none transition-all"
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sage-700 font-medium mb-2">
                        {t({ fr: 'Adresse', en: 'Address' })}
                      </label>
                      <input
                        type="text"
                        value={checkoutType === 'guest' ? guestForm.address : shippingForm.address}
                        onChange={(e) => {
                          if (checkoutType === 'guest') {
                            setGuestForm({...guestForm, address: e.target.value});
                          } else {
                            setShippingForm({...shippingForm, address: e.target.value});
                          }
                        }}
                        className="w-full px-4 py-3 rounded-xl border border-sage-200 focus:border-sage-400 focus:ring-2 focus:ring-sage-200 outline-none transition-all"
                      />
                      {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                    </div>

                    <div>
                      <label className="block text-sage-700 font-medium mb-2">
                        {t({ fr: 'Ville', en: 'City' })}
                      </label>
                      <input
                        type="text"
                        value={checkoutType === 'guest' ? guestForm.city : shippingForm.city}
                        onChange={(e) => {
                          if (checkoutType === 'guest') {
                            setGuestForm({...guestForm, city: e.target.value});
                          } else {
                            setShippingForm({...shippingForm, city: e.target.value});
                          }
                        }}
                        className="w-full px-4 py-3 rounded-xl border border-sage-200 focus:border-sage-400 focus:ring-2 focus:ring-sage-200 outline-none transition-all"
                      />
                      {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                    </div>

                    <div>
                      <label className="block text-sage-700 font-medium mb-2">
                        {t({ fr: 'Code postal', en: 'Postal Code' })}
                      </label>
                      <input
                        type="text"
                        value={checkoutType === 'guest' ? guestForm.postalCode : shippingForm.postalCode}
                        onChange={(e) => {
                          if (checkoutType === 'guest') {
                            setGuestForm({...guestForm, postalCode: e.target.value});
                          } else {
                            setShippingForm({...shippingForm, postalCode: e.target.value});
                          }
                        }}
                        className="w-full px-4 py-3 rounded-xl border border-sage-200 focus:border-sage-400 focus:ring-2 focus:ring-sage-200 outline-none transition-all"
                      />
                      {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sage-700 font-medium mb-2">
                        {t({ fr: 'Téléphone', en: 'Phone' })}
                      </label>
                      <input
                        type="tel"
                        value={checkoutType === 'guest' ? guestForm.phone : shippingForm.phone}
                        onChange={(e) => {
                          if (checkoutType === 'guest') {
                            setGuestForm({...guestForm, phone: e.target.value});
                          } else {
                            setShippingForm({...shippingForm, phone: e.target.value});
                          }
                        }}
                        className="w-full px-4 py-3 rounded-xl border border-sage-200 focus:border-sage-400 focus:ring-2 focus:ring-sage-200 outline-none transition-all"
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Auth Form */}
              {!isAuthenticated && (checkoutType === 'login' || checkoutType === 'register') && (
                <div className="space-y-4">
                  <h3 className="text-lg font-serif text-sage-800 flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    {checkoutType === 'login' 
                      ? t({ fr: 'Connexion', en: 'Login' })
                      : t({ fr: 'Créer un compte', en: 'Create Account' })
                    }
                  </h3>

                  <div>
                    <label className="block text-sage-700 font-medium mb-2">
                      {t({ fr: 'Email', en: 'Email' })}
                    </label>
                    <input
                      type="email"
                      value={authForm.email}
                      onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-sage-200 focus:border-sage-400 focus:ring-2 focus:ring-sage-200 outline-none transition-all"
                    />
                    {errors.authEmail && <p className="text-red-500 text-sm mt-1">{errors.authEmail}</p>}
                  </div>

                  <div>
                    <label className="block text-sage-700 font-medium mb-2">
                      {t({ fr: 'Mot de passe', en: 'Password' })}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={authForm.password}
                        onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                        className="w-full px-4 py-3 pr-12 rounded-xl border border-sage-200 focus:border-sage-400 focus:ring-2 focus:ring-sage-200 outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sage-600 hover:text-sage-800"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                  </div>

                  {errors.auth && <p className="text-red-500 text-sm">{errors.auth}</p>}
                </div>
              )}

              {/* Payment Method */}
              <div>
                <h3 className="text-lg font-serif text-sage-800 mb-4">
                  {t({ fr: 'Mode de paiement', en: 'Payment Method' })}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('payLater')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === 'payLater'
                        ? 'border-sage-600 bg-sage-50'
                        : 'border-sage-200 hover:border-sage-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Truck className="w-6 h-6 text-sage-600" />
                      <div className="text-left">
                        <p className="font-medium text-sage-800">
                          {t({ fr: 'Payer à la livraison', en: 'Pay on Delivery' })}
                        </p>
                        <p className="text-sm text-sage-600">
                          {t({ fr: 'Paiement en espèces', en: 'Cash payment' })}
                        </p>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('stripe')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === 'stripe'
                        ? 'border-sage-600 bg-sage-50'
                        : 'border-sage-200 hover:border-sage-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-6 h-6 text-sage-600" />
                      <div className="text-left">
                        <p className="font-medium text-sage-800">Stripe</p>
                        <p className="text-sm text-sage-600">
                          {t({ fr: 'Carte de crédit', en: 'Credit card' })}
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-sage-600 to-peach hover:from-sage-700 hover:to-peach text-white py-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing 
                  ? t({ fr: 'Traitement...', en: 'Processing...' })
                  : t({ fr: 'Finaliser la commande', en: 'Complete Order' })
                }
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;