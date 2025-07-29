import React, { useState, useEffect } from 'react';
import { Users, Package, LogOut, Eye, Trash2, Edit } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getUsers, getOrders, updateOrderStatus, deleteOrder } from '../services/firebaseService';
import { User, Order } from '../types';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const { admin } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'users' | 'orders'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersData, ordersData] = await Promise.all([
        getUsers(),
        getOrders()
      ]);
      setUsers(usersData);
      setOrders(ordersData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, status: Order['status']) => {
    try {
      await updateOrderStatus(orderId, status);
      await loadData();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await deleteOrder(orderId);
        await loadData();
      } catch (error) {
        console.error('Error deleting order:', error);
      }
    }
  };

  if (!admin) {
    return <div>Access denied</div>;
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-sage-800 text-white p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-serif">Soapyfy Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span>Welcome, {admin.username}</span>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 bg-sage-700 hover:bg-sage-600 px-4 py-2 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-sage-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex">
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'users'
                  ? 'text-sage-800 border-b-2 border-sage-600'
                  : 'text-sage-600 hover:text-sage-800'
              }`}
            >
              <Users className="w-5 h-5" />
              Users ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'orders'
                  ? 'text-sage-800 border-b-2 border-sage-600'
                  : 'text-sage-600 hover:text-sage-800'
              }`}
            >
              <Package className="w-5 h-5" />
              Orders ({orders.length})
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600 mx-auto"></div>
            <p className="mt-4 text-sage-600">Loading...</p>
          </div>
        ) : (
          <>
            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-sage-200">
                  <h2 className="text-xl font-serif text-sage-800">User Management</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-sage-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-sage-500 uppercase tracking-wider">
                          User ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-sage-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-sage-500 uppercase tracking-wider">
                          Created At
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-sage-500 uppercase tracking-wider">
                          Orders
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-sage-200">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-sage-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-sage-900">
                            {user.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-sage-500">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-sage-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-sage-500">
                            {orders.filter(order => order.userId === user.id).length}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-sage-200">
                  <h2 className="text-xl font-serif text-sage-800">Order Management</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-sage-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-sage-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-sage-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-sage-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-sage-500 uppercase tracking-wider">
                          Payment
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-sage-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-sage-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-sage-200">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-sage-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-sage-900">
                            {order.id.substring(0, 8)}...
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-sage-500">
                            {order.guestInfo?.email || users.find(u => u.id === order.userId)?.email || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-sage-500">
                            ${order.total.toFixed(2)} CAD
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-sage-500">
                            {order.paymentMethod === 'payLater' ? 'Pay Later' : 'Stripe'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusUpdate(order.id, e.target.value as Order['status'])}
                              className="text-sm border border-sage-300 rounded px-2 py-1"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex gap-2">
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="text-sage-600 hover:text-sage-900"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteOrder(order.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-serif text-sage-800">Order Details</h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-2 hover:bg-sage-100 rounded-full transition-colors"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Customer Info */}
                  <div>
                    <h3 className="font-medium text-sage-800 mb-3">Customer Information</h3>
                    <div className="bg-sage-50 rounded-lg p-4 space-y-2">
                      <p><strong>Email:</strong> {selectedOrder.guestInfo?.email || users.find(u => u.id === selectedOrder.userId)?.email}</p>
                      {selectedOrder.guestInfo && (
                        <>
                          <p><strong>Name:</strong> {selectedOrder.guestInfo.name}</p>
                          <p><strong>Phone:</strong> {selectedOrder.guestInfo.phone}</p>
                          <p><strong>Address:</strong> {selectedOrder.guestInfo.address}, {selectedOrder.guestInfo.city}, {selectedOrder.guestInfo.postalCode}</p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h3 className="font-medium text-sage-800 mb-3">Order Items</h3>
                    <div className="space-y-2">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center bg-sage-50 rounded-lg p-3">
                          <div>
                            <p className="font-medium">{t(item.name)}</p>
                            <p className="text-sm text-sage-600">Quantity: {item.quantity}</p>
                          </div>
                          <p className="font-medium">{item.price}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div>
                    <h3 className="font-medium text-sage-800 mb-3">Order Summary</h3>
                    <div className="bg-sage-50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>${selectedOrder.subtotal.toFixed(2)} CAD</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping:</span>
                        <span>${selectedOrder.shipping.toFixed(2)} CAD</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Taxes:</span>
                        <span>${selectedOrder.taxes.toFixed(2)} CAD</span>
                      </div>
                      <div className="flex justify-between font-bold border-t border-sage-200 pt-2">
                        <span>Total:</span>
                        <span>${selectedOrder.total.toFixed(2)} CAD</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <h3 className="font-medium text-sage-800 mb-3">Payment Method</h3>
                    <p className="bg-sage-50 rounded-lg p-4">
                      {selectedOrder.paymentMethod === 'payLater' ? 'Pay Later (Cash on Delivery)' : 'Stripe (Credit Card)'}
                    </p>
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

export default AdminDashboard;