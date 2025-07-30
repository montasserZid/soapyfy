import React, { useState } from 'react';
import { ShoppingBag, X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose, onCheckout }) => {
  const { items, updateQuantity, removeFromCart, getSubtotal, getShipping, getTaxes, getTotalPrice } = useCart();
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-sage-200 p-6">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-sage-600" />
              <h2 className="text-xl font-serif text-sage-800">
                {t({ fr: 'Panier', en: 'Cart' })} ({items.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-sage-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-sage-600" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 text-sage-300 mx-auto mb-4" />
                <p className="text-sage-600">
                  {t({ fr: 'Votre panier est vide', en: 'Your cart is empty' })}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 bg-sage-50 rounded-xl">
                    <img
                      src={item.image}
                      alt={t(item.name)}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-sage-800 mb-1">
                        {t(item.name)}
                      </h3>
                      <p className="text-sage-600 text-sm mb-2">{item.price}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-sage-200 rounded transition-colors"
                          >
                            <Minus className="w-4 h-4 text-sage-600" />
                          </button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-sage-200 rounded transition-colors"
                          >
                            <Plus className="w-4 h-4 text-sage-600" />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 hover:bg-red-100 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-sage-200 p-6">
              <div className="space-y-2 mb-4">
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
                <div className="flex justify-between items-center pt-2 border-t border-sage-200">
                  <span className="text-lg font-bold text-sage-800">
                    {t({ fr: 'Total', en: 'Total' })}:
                  </span>
                  <span className="text-xl font-bold text-sage-800">
                    ${getTotalPrice().toFixed(2)} CAD
                  </span>
                </div>
              </div>
              
              <button
                onClick={onCheckout}
                className="w-full bg-gradient-to-r from-sage-600 to-peach hover:from-sage-700 hover:to-peach text-white py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
              >
                {t({ fr: 'Procéder au paiement', en: 'Proceed to Checkout' })}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;