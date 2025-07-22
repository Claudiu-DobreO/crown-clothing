import { initializeApp } from 'firebase/app';
import { 
	getAuth, 
	signInWithPopup, 
	GoogleAuthProvider,
	createUserWithEmailAndPassword, 
	signInWithEmailAndPassword,
	signOut,
	onAuthStateChanged,
} from 'firebase/auth';
import {
	getFirestore,
	doc,
	getDoc,
	setDoc,
} from 'firebase/firestore';

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
const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
	prompt: "select_account"
});

export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, googleProvider);

export const db = getFirestore();

export const createUserDocumentFromAuth = async (userAuth, additionalInformation = {}) => {
	if (!userAuth) return;

	const userDocRef = doc(db, 'users', userAuth.uid);

	console.log(userDocRef);
	const userSnapshot = await getDoc(userDocRef);
	console.log(userSnapshot);

	if (!userSnapshot.exists()) {
		const { displayName, email } = userAuth;
		const createdAt = new Date();

		try {
			await setDoc(userDocRef, {
				displayName,
				email,
				createdAt,
				...additionalInformation,
			});
		} catch (error) {
			console.log('error creating the user', error.message);
		}
	} 

	return userDocRef;
};

export const createAuthUserWithEmailAndPassword = async (email, password) => {
	if (!email || !password) return;

	return await createUserWithEmailAndPassword(auth, email, password);
}; 

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
	if (!email || !password) return;

	return await signInWithEmailAndPassword(auth, email, password);
}; 

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListerner = (callback) => onAuthStateChanged(auth, callback);
