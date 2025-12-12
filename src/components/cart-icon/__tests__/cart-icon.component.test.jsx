import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../utils/test/test.utils';
import CartIcon from '../cart-icon.component';

describe('Cart Icon tests', () => {
    it('uses preloaded state to render', () => {
        const intialCartItems = [
            { id: 1, name: 'Item A', imageUrl: 'test-image-url', price: 10, quantity: 1 },
            { id: 2, name: 'Item B', imageUrl: 'test-image-url', price: 20, quantity: 2 },
        ]
        renderWithProviders(<CartIcon />, {
            preloadedState: {
                cart: {
                    cartItems: intialCartItems,
                },
            },
        });

        const cartIconElement = screen.getByText('3');
        expect(cartIconElement).toBeInTheDocument();
    });
});