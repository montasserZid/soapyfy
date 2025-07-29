import React from 'react';
import { CheckCircle, Package, Truck, Home } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface OrderConfirmationProps {
  onContinueShopping: () => void;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ onContinueShopping }) => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-3xl p-8 shadow-xl text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-serif text-sage-800 mb-2">
              {t({ fr: 'Commande confirmée !', en: 'Order Confirmed!' })}
            </h1>
            <p className="text-sage-600">
              {t({ 
                fr: 'Merci pour votre commande. Vous recevrez bientôt un email de confirmation.',
                en: 'Thank you for your order. You will receive a confirmation email shortly.'
              })}
            </p>
          </div>

          {/* Order Process */}
          <div className="mb-8">
            <h2 className="text-xl font-serif text-sage-800 mb-6">
              {t({ fr: 'Prochaines étapes', en: 'Next Steps' })}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Package className="w-6 h-6 text-sage-600" />
                </div>
                <h3 className="font-medium text-sage-800 mb-2">
                  {t({ fr: 'Préparation', en: 'Preparation' })}
                </h3>
                <p className="text-sm text-sage-600">
                  {t({ 
                    fr: 'Nous préparons votre commande avec soin',
                    en: 'We carefully prepare your order'
                  })}
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Truck className="w-6 h-6 text-sage-600" />
                </div>
                <h3 className="font-medium text-sage-800 mb-2">
                  {t({ fr: 'Expédition', en: 'Shipping' })}
                </h3>
                <p className="text-sm text-sage-600">
                  {t({ 
                    fr: 'Votre commande est en route',
                    en: 'Your order is on its way'
                  })}
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Home className="w-6 h-6 text-sage-600" />
                </div>
                <h3 className="font-medium text-sage-800 mb-2">
                  {t({ fr: 'Livraison', en: 'Delivery' })}
                </h3>
                <p className="text-sm text-sage-600">
                  {t({ 
                    fr: 'Réception à votre domicile',
                    en: 'Delivered to your home'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-sage-50 rounded-2xl p-6 mb-8">
            <h3 className="font-serif text-lg text-sage-800 mb-3">
              {t({ fr: 'Besoin d\'aide ?', en: 'Need Help?' })}
            </h3>
            <p className="text-sage-600 text-sm mb-3">
              {t({ 
                fr: 'Notre équipe est là pour vous aider avec toute question concernant votre commande.',
                en: 'Our team is here to help with any questions about your order.'
              })}
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center text-sm">
              <span className="text-sage-600">📧 contact@soapyfy.com</span>
              <span className="text-sage-600">📱 +1 (514) 123-4567</span>
            </div>
          </div>

          {/* Continue Shopping */}
          <button
            onClick={onContinueShopping}
            className="bg-gradient-to-r from-sage-600 to-peach hover:from-sage-700 hover:to-peach text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
          >
            {t({ fr: 'Continuer mes achats', en: 'Continue Shopping' })}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;