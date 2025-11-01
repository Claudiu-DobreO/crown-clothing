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
	collection,
	writeBatch,
	query,
	getDocs,
} from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

// Initialize Firebase
// eslint-disable-next-line
const app = initializeApp(firebaseConfig);

// Authentication setup
const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
	prompt: "select_account"
});

export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, googleProvider);

export const db = getFirestore();

export const addCollectionAndDocuments = async (collectionKey, objectsToAdd, field) => {
	const collectionRef = collection(db, collectionKey);
	const batch = writeBatch(db);

	objectsToAdd.forEach((object) => {
		const docRef = doc(collectionRef, object[field].toLowerCase());
		batch.set(docRef, object);
	});

	await batch.commit();
	console.log('done');
};

export const getCategoriesAndDocuments = async () => {
	const collectionRef = collection(db, 'categories');
	const q = query(collectionRef);

	const querySnapShot = await getDocs(q);
	return querySnapShot.docs.map(docSnapshot => docSnapshot.data());
};

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

export const getCurrentUser = () => {
	return new Promise((resolve, reject) => {
		const unsubscribe = onAuthStateChanged(
			auth, 
			(userAuth) => {
				unsubscribe();
				resolve(userAuth);
			}, 
			reject
		);
		return unsubscribe;
	});
};
