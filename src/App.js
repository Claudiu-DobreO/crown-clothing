import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Home from './routes/home/home.component';
import Navigation from './routes/navigation/navigation.component';
import Authentication from './routes/authentication/authentication.component';
import Shop from './routes/shop/shop.component';
import Checkout from './routes/checkout/checkout.component';

import { setCurrentUser } from './store/user/user.action';
import { getCurrentUser } from './utils/firebase/firebase.utils';

import { 
    onAuthStateChangedListerner, 
    createUserDocumentFromAuth, 
} from './utils/firebase/firebase.utils';

const App = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const getUser = async () => {
            try {
                const user = await getCurrentUser();
                console.log({user});
            } catch (error) {
                console.error(error);
            }
        };
        getUser();
    }, []);

    return (
        <Routes>
            <Route path='/' element={<Navigation />}>
                <Route index element={<Home />} />
                <Route path='shop/*' element={<Shop />} />
                <Route path='auth' element={<Authentication />} />
                <Route path='checkout' element={<Checkout />} />
            </Route>
        </Routes>
    );
};

export default App;
