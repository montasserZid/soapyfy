import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { User, Order } from '../types';

// Users
export const createUser = async (user: Omit<User, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'users'), user);
    return { id: docRef.id, ...user };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const getUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
  } catch (error) {
    console.error('Error getting users:', error);
    throw error;
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const q = query(collection(db, 'users'), where('email', '==', email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as User;
    }
    return null;
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw error;
  }
};

// Orders
export const createOrder = async (order: Omit<Order, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'orders'), order);
    return { id: docRef.id, ...order };
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const getOrders = async () => {
  try {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
  } catch (error) {
    console.error('Error getting orders:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId: string, status: Order['status']) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, { status });
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

export const deleteOrder = async (orderId: string) => {
  try {
    await deleteDoc(doc(db, 'orders', orderId));
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};

// Admin
export const getAdminByCredentials = async (username: string, password: string) => {
  // Default admin account
  if (username === 'admin' && password === 'Heriot0929') {
    return {
      id: 'admin-1',
      username: 'admin',
      password: 'Heriot0929',
      role: 'admin' as const
    };
  }
  return null;
};