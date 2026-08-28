import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBOxK36ANAPMY_msvtt9ETAkmL3ACeNbww",
  authDomain: "app-challenge-e76e6.firebaseapp.com",
  projectId: "app-challenge-e76e6",
  storageBucket: "app-challenge-e76e6.firebasestorage.app",
  messagingSenderId: "795704696218",
  appId: "1:795704696218:web:b37beabff509d7a093ee23",
  measurementId: "G-95D7B9XJP7"
};
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const appleProvider = new OAuthProvider('apple.com');

isSupported().then(supported => {
  if (supported) getAnalytics(app);
});
