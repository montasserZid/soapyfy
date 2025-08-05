import React, { useState, useEffect } from 'react';
import { ArrowLeft, Package, Calendar, MapPin, Phone, Mail, CreditCard, Truck } from 'lucide-react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Order } from '../types';

interface MyOrdersProps {
  onBack: () => void;
}

const MyOrders: React.FC<MyOrdersProps> = ({ onBack }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { user } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    const fetchUserOrders = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }
      
      try {
        // Query orders by email since that's how we store them
        const userOrdersQuery = query(
          collection(db, 'orders'), 
          where('guestInfo.email', '==', user.email)
        );
        const snapshot = await getDocs(userOrdersQuery);
        
        const userOrders = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Order));
        
        // Sort by date (newest first) on client side
        userOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        setOrders(userOrders);
      } catch (error) {
        console.error('Error fetching user orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, [user?.email]);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'confirmed': return 'text-blue-700 bg-blue-100 border-blue-200';
      case 'shipped': return 'text-purple-700 bg-purple-100 border-purple-200';
      case 'delivered': return 'text-green-700 bg-green-100 border-green-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending': return t({ fr: 'En attente', en: 'Pending' });
      case 'confirmed': return t({ fr: 'Confirmée', en: 'Confirmed' });
      case 'shipped': return t({ fr: 'Expédiée', en: 'Shipped' });
      case 'delivered': return t({ fr: 'Livrée', en: 'Delivered' });
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 bg-white hover:bg-sage-50 text-sage-700 hover:text-sage-800 px-4 py-2 rounded-xl border border-sage-200 transition-all duration-200 hover:shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{t({ fr: 'Retour', en: 'Back' })}</span>
          </button>
          <div>
            <h1 className="text-3xl font-serif text-sage-800">
              {t({ fr: 'Mes Commandes', en: 'My Orders' })}
            </h1>
            <p className="text-sage-600 mt-1">
              {t({ 
                fr: `${orders.length} commande${orders.length !== 1 ? 's' : ''}`, 
                en: `${orders.length} order${orders.length !== 1 ? 's' : ''}` 
              })}
            </p>
          </div>
        </div>
        
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-20 h-20 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-sage-400" />
            </div>
            <h2 className="text-2xl font-serif text-sage-800 mb-4">
              {t({ fr: 'Aucune commande', en: 'No Orders Yet' })}
            </h2>
            <p className="text-sage-600 mb-8 max-w-md mx-auto">
              {t({ 
                fr: 'Vous n\'avez pas encore passé de commande. Découvrez notre collection de savons artisanaux.',
                en: 'You haven\'t placed any orders yet. Discover our collection of handcrafted soaps.'
              })}
            </p>
            <button
              onClick={onBack}
              className="bg-gradient-to-r from-sage-600 to-peach hover:from-sage-700 hover:to-peach text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
            >
              {t({ fr: 'Découvrir nos produits', en: 'Shop Now' })}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="p-6">
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                    <div className="mb-4 sm:mb-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-serif text-sage-800">
                          {t({ fr: 'Commande', en: 'Order' })} #{order.id.slice(-8)}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-sage-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(order.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                        <div className="font-medium text-sage-800">
                          ${order.total.toFixed(2)} CAD
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="bg-sage-100 hover:bg-sage-200 text-sage-700 hover:text-sage-800 px-4 py-2 rounded-xl transition-all duration-200 text-sm font-medium"
                    >
                      {t({ fr: 'Voir détails', en: 'View Details' })}
                    </button>
                  </div>
                  
                  {/* Order Items Preview */}
                  <div className="border-t border-sage-100 pt-4">
                    <h4 className="font-medium text-sage-800 mb-3">
                      {t({ fr: 'Articles', en: 'Items' })}:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-3 bg-sage-50 rounded-xl p-3">
                          <img
                            src={item.image}
                            alt={t(item.name)}
                            className="w-12 h-12 object-cover rounded-lg shadow-sm"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sage-800 text-sm truncate">
                              {t(item.name)}
                            </p>
                            <p className="text-sage-600 text-xs">
                              {t({ fr: 'Qté', en: 'Qty' })}: {item.quantity} • {item.price}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-sage-200">
                  <div>
                    <h2 className="text-2xl font-serif text-sage-800">
                      {t({ fr: 'Détails de la commande', en: 'Order Details' })}
                    </h2>
                    <p className="text-sage-600 mt-1">
                      #{selectedOrder.id.slice(-8)} • {new Date(selectedOrder.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-2 hover:bg-sage-100 rounded-full transition-colors text-sage-600 hover:text-sage-800"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Order Items */}
                  <div>
                    <h3 className="text-lg font-serif text-sage-800 mb-4">
                      {t({ fr: 'Articles commandés', en: 'Order Items' })}
                    </h3>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 bg-sage-50 rounded-xl p-4">
                          <img
                            src={item.image}
                            alt={t(item.name)}
                            className="w-16 h-16 object-cover rounded-lg shadow-sm"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-sage-800">{t(item.name)}</h4>
                            <p className="text-sage-600 text-sm">
                              {t({ fr: 'Quantité', en: 'Quantity' })}: {item.quantity}
                            </p>
                            <p className="font-medium text-sage-800">{item.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Summary */}
                    <div className="mt-6 bg-sage-50 rounded-xl p-4">
                      <h4 className="font-medium text-sage-800 mb-3">
                        {t({ fr: 'Résumé', en: 'Summary' })}
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-sage-600">{t({ fr: 'Sous-total', en: 'Subtotal' })}:</span>
                          <span className="text-sage-800">${selectedOrder.subtotal.toFixed(2)} CAD</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sage-600">{t({ fr: 'Livraison', en: 'Shipping' })}:</span>
                          <span className="text-sage-800">${selectedOrder.shipping.toFixed(2)} CAD</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sage-600">{t({ fr: 'Taxes', en: 'Taxes' })}:</span>
                          <span className="text-sage-800">${selectedOrder.taxes.toFixed(2)} CAD</span>
                        </div>
                        <div className="flex justify-between font-bold border-t border-sage-200 pt-2">
                          <span className="text-sage-800">{t({ fr: 'Total', en: 'Total' })}:</span>
                          <span className="text-sage-800">${selectedOrder.total.toFixed(2)} CAD</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Customer & Shipping Info */}
                  <div className="space-y-6">
                    {/* Status */}
                    <div>
                      <h3 className="text-lg font-serif text-sage-800 mb-4">
                        {t({ fr: 'Statut', en: 'Status' })}
                      </h3>
                      <div className={`inline-flex items-center px-4 py-2 rounded-xl border ${getStatusColor(selectedOrder.status)}`}>
                        <Package className="w-4 h-4 mr-2" />
                        {getStatusText(selectedOrder.status)}
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                      <h3 className="text-lg font-serif text-sage-800 mb-4">
                        {t({ fr: 'Paiement', en: 'Payment' })}
                      </h3>
                      <div className="bg-sage-50 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                          {selectedOrder.paymentMethod === 'payLater' ? (
                            <Truck className="w-5 h-5 text-sage-600" />
                          ) : (
                            <CreditCard className="w-5 h-5 text-sage-600" />
                          )}
                          <span className="text-sage-800">
                            {selectedOrder.paymentMethod === 'payLater' 
                              ? t({ fr: 'Paiement à la livraison', en: 'Pay on Delivery' })
                              : 'Stripe (Credit Card)'
                            }
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Shipping Information */}
                    {selectedOrder.guestInfo && (
                      <div>
                        <h3 className="text-lg font-serif text-sage-800 mb-4">
                          {t({ fr: 'Livraison', en: 'Shipping' })}
                        </h3>
                        <div className="bg-sage-50 rounded-xl p-4 space-y-3">
                          <div className="flex items-start gap-3">
                            <Mail className="w-4 h-4 text-sage-600 mt-1" />
                            <div>
                              <p className="text-xs text-sage-600 uppercase tracking-wide">Email</p>
                              <p className="text-sage-800">{selectedOrder.guestInfo.email}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <Package className="w-4 h-4 text-sage-600 mt-1" />
                            <div>
                              <p className="text-xs text-sage-600 uppercase tracking-wide">{t({ fr: 'Nom', en: 'Name' })}</p>
                              <p className="text-sage-800">{selectedOrder.guestInfo.name}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <Phone className="w-4 h-4 text-sage-600 mt-1" />
                            <div>
                              <p className="text-xs text-sage-600 uppercase tracking-wide">{t({ fr: 'Téléphone', en: 'Phone' })}</p>
                              <p className="text-sage-800">{selectedOrder.guestInfo.phone}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <MapPin className="w-4 h-4 text-sage-600 mt-1" />
                            <div>
                              <p className="text-xs text-sage-600 uppercase tracking-wide">{t({ fr: 'Adresse', en: 'Address' })}</p>
                              <p className="text-sage-800">
                                {selectedOrder.guestInfo.address}<br/>
                                {selectedOrder.guestInfo.city}, {selectedOrder.guestInfo.postalCode}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;