import { createContext, useState, useEffect } from 'react';
import { 
	onAuthStateChangedListerner, 
	createUserDocumentFromAuth, 
} from '../utils/firebase/firebase.utils';

export const UserContext = createContext({
	currentUser: null,
	setCurrentUser: () => null,
});

export const UserProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(null);
	const value = { currentUser, setCurrentUser };

	useEffect(() => {
		console.log("User: ", currentUser);
	}, [currentUser]);

	useEffect(() => {
		const unsuscribe = onAuthStateChangedListerner((user) => {
			if (user) {
				createUserDocumentFromAuth(user);
			}
			setCurrentUser(user);
		}) ;

		return unsuscribe;
	}, []);
	
	return (
		<UserContext.Provider value={value}>
			{children}
		</UserContext.Provider>
	);
};