import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB58gKW0xQiA4AX8NAIrAeveQFMy0RWda4",
  authDomain: "soapyfy-ee7a1.firebaseapp.com",
  projectId: "soapyfy-ee7a1",
  storageBucket: "soapyfy-ee7a1.firebasestorage.app",
  messagingSenderId: "325430838189",
  appId: "1:325430838189:web:68e5af11557d442bd31724"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;