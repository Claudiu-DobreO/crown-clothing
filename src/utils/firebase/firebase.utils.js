import { initializeApp } from 'firebase/app';
import { 
	getAuth, 
	signInWithRedirect, 
	signInWithPopup, 
	GoogleAuthProvider 
} from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAUAhU-dlDIxarRL4RdK1BANjkcRCbH4n0",
  authDomain: "crown-clothing-db-29b63.firebaseapp.com",
  projectId: "crown-clothing-db-29b63",
  storageBucket: "crown-clothing-db-29b63.firebasestorage.app",
  messagingSenderId: "992486162205",
  appId: "1:992486162205:web:2da92b40ecbd1ce32e2bf4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Authentication setup
const provider = new GoogleAuthProvider();

provider.setCustomParameters({
	prompt: "select_account"
});

export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);