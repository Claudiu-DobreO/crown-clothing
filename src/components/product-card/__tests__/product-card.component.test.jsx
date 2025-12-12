import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../../utils/test/test.utils';
import ProductCard from '../product-card.component';

describe('ProductCard component tests', () => {
  it('should add production card item when the product card button is clicked', () => {
    const mockProduct = {
        id: 1,
        name: 'Product 1',
        imageUrl: 'https://via.placeholder.com/150',
        price: 10,
    }
    const { store } = renderWithProviders(<ProductCard product={mockProduct} />, {
        preloadedState: {
            cart: {
                cartItems: [],
            }
        },
    });

    const buttonElement = screen.getByText(/add to cart/i);
    fireEvent.click(buttonElement);

    expect(store.getState().cart.cartItems).toHaveLength(1);
  });
});