import { createContext, useState, useEffect } from 'react';

const addCartItem = (cartItems, productToAdd) => {
	// find if cartitems contains productoToAdd
	const existingCartItem = cartItems.find(item => item.id === productToAdd.id);
	
	// if found increment quantity
	if (existingCartItem) {
		return cartItems.map(cartItem => cartItem.id === productToAdd.id 
			? { ...cartItem, quantity: cartItem.quantity + 1 }
			: cartItem
		);
	}

	// return new array with modified cart items / new cart item
	return [ ...cartItems, { ...productToAdd, quantity: 1 }];
};

const removeCartItem = (cartItems, cartItemToRemove) => {
	// find the cart item to remove
	const existingCartItem = cartItems.find(item => item.id === cartItemToRemove.id);

	// check if quantity is 1.  If yes, remove from cart
	if (existingCartItem.quantity === 1) {
		return cartItems.filter(cartItem => cartItem.id !== cartItemToRemove.id);
	}

	// return back cartItems with matchin cart item with reduced quantity.  
	return cartItems.map(cartItem => cartItem.id === cartItemToRemove.id 
		? { ...cartItem, quantity: cartItem.quantity - 1 }
		: cartItem
	);
};

const clearCartItem = (cartItems, cartItemToClear) => 
	cartItems.filter(cartItem => cartItem.id !== cartItemToClear.id);

export const CartContext = createContext({
	isCartOpen: false,
	setIsCartOpen: () => {},
	cartItems: [],
	addItemToCart: () => {},
	removeItemFromCart: () => {},
	clearItemFromCart: () => {},
	cartCount: 0,
	cartTotal: 0,
});

export const CartProvider = ({ children }) => {
	const [isCartOpen, setIsCartOpen] = useState(false);
	const [cartItems, setCartItems] = useState([]);
	const [cartCount, setCartCount] = useState(0);
	const [cartTotal, setCartTotal] = useState(0);

	useEffect(() => {
		const newCartCount = cartItems.reduce((total, cartItem) => total + cartItem.quantity, 0);
		setCartCount(newCartCount)
	}, [cartItems]);

	useEffect(() => {
		const newCartTotal = cartItems.reduce((total, cartItem) => total + cartItem.quantity * cartItem.price, 0);
		setCartTotal(newCartTotal);
	}, [cartItems]);

	const addItemToCart = (productToAdd) => {
		setCartItems(addCartItem(cartItems, productToAdd));
	};

	const removeItemFromCart = (cartItemToRemove) => {
		setCartItems(removeCartItem(cartItems, cartItemToRemove));
	};

	const clearItemFromCart = (cartItemToRemove) => {
		setCartItems(clearCartItem(cartItems, cartItemToRemove));
	};

	const value = { isCartOpen, setIsCartOpen, addItemToCart, removeItemFromCart, clearItemFromCart, cartItems, cartCount, cartTotal };

	return (
		<CartContext.Provider value={value}>{children}</CartContext.Provider>
	);
};