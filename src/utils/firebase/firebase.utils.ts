import { initializeApp } from 'firebase/app';
import { 
	getAuth, 
	signInWithPopup, 
	GoogleAuthProvider,
	createUserWithEmailAndPassword, 
	signInWithEmailAndPassword,
	signOut,
	onAuthStateChanged,
	NextOrObserver,
	User,
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
	QueryDocumentSnapshot,
} from 'firebase/firestore';
import { Category } from '../../store/categories/category.types';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

console.log('🔥 Firebase Config:', firebaseConfig);
console.log('🔑 API Key:', import.meta.env.VITE_FIREBASE_API_KEY);
console.log('📦 All VITE vars:', Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')));

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

export type ObjectToAdd = {
	title: string;
}

export const addCollectionAndDocuments = async <T extends ObjectToAdd>(
	collectionKey: string, 
	objectsToAdd: T[], 
): Promise<void> => {
	const collectionRef = collection(db, collectionKey);
	const batch = writeBatch(db);

	objectsToAdd.forEach((object) => {
		const docRef = doc(collectionRef, object.title.toLowerCase());
		batch.set(docRef, object);
	});

	await batch.commit();
};

export const getCategoriesAndDocuments = async (): Promise<Category[]> => {
	const collectionRef = collection(db, 'categories');
	const q = query(collectionRef);

	const querySnapShot = await getDocs(q);
	return querySnapShot.docs.map(
		docSnapshot => docSnapshot.data() as Category
	);
};

export type AdditionalInformation = {
	displayName?: string;
}

export type UserData = {
	createdAt: Date;
	displayName: string;
	email: string;
}

export const createUserDocumentFromAuth = async (
	userAuth: User, 
	additionalInformation = {} as AdditionalInformation
): Promise<void | QueryDocumentSnapshot<UserData>> => {
	if (!userAuth) return;

	const userDocRef = doc(db, 'users', userAuth.uid);

	console.log(userDocRef);
	let userSnapshot = await getDoc(userDocRef);
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
			// Fetch the newly created document snapshot
			userSnapshot = await getDoc(userDocRef);
		} catch (error) {
			console.log('error creating the user', error);
		}
	} 

	return userSnapshot as QueryDocumentSnapshot<UserData>;
};

export const createAuthUserWithEmailAndPassword = async (email: string, password: string) => {
	if (!email || !password) return;

	return await createUserWithEmailAndPassword(auth, email, password);
}; 

export const signInAuthUserWithEmailAndPassword = async (email: string, password: string) => {
	if (!email || !password) return;

	return await signInWithEmailAndPassword(auth, email, password);
}; 

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListerner = (
	callback: NextOrObserver<User>
) => onAuthStateChanged(auth, callback);

export const getCurrentUser = (): Promise<User | null> => {
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
