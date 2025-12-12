import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../utils/test/test.utils';
import Navigation from '../navigation.component';

describe('Navigation component tests', () => {
  it('should render a sign in link and not sign out link if there is no current user', () => {
    renderWithProviders(<Navigation />, {
        preloadedState: {
            user: {
                currentUser: null,
            },
        },
    
    });

    const signInElement = screen.getByText(/sign in/i);
    expect(signInElement).toBeInTheDocument();

    const signOutElement = screen.queryByText(/sign out/i);
    expect(signOutElement).toBeNull();
  });

  it('should render a sign out and not sign in link if there is a current user', () => {
    renderWithProviders(<Navigation />, {
        preloadedState: {
            user: {
                currentUser: {},
            },
        },
    });

    const signOutElement = screen.getByText(/sign out/i);
    expect(signOutElement).toBeInTheDocument();
    expect(screen.queryByText(/sign in/i)).toBeNull();
  });

  it('should not render a cart dropdown if isCartOpen is false', () => {
    renderWithProviders(<Navigation />, {
        preloadedState: {
            cart: {
                isCartOpen: false,
                cartItems: [],
            },
        },
    });

    const dropdownTextElement = screen.queryByText(/your cart is empty/i);
    expect(dropdownTextElement).toBeNull();
  });

  it('should render a cart dropdown if isCartOpen is true', () => {
    renderWithProviders(<Navigation />, {
        preloadedState: {
            cart: {
                isCartOpen: true,
                cartItems: [],
            },
        },
    });

    const dropdownTextElement = screen.getByText(/your cart is empty/i);
    expect(dropdownTextElement).toBeInTheDocument();
  });
});