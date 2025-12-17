import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../../utils/test/test.utils';
import { vi } from 'vitest';
import { createStore } from 'redux';
import { rootReducer } from '../../../store/root-reducer';
import { signOutStart } from '../../../store/user/user.action';
import Navigation from '../navigation.component';

describe('Navigation component tests', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

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

  it('should dispatch sign out action when sign out link is clicked', async () => {
    const store = createStore(rootReducer, {
        user: {
            currentUser: {},
        },
    });
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    renderWithProviders(<Navigation />, {
        store,
    });

    const signOutLink = screen.getByText(/sign out/i);
    expect(signOutLink).toBeInTheDocument();
    
    await fireEvent.click(signOutLink);
    expect(dispatchSpy).toHaveBeenCalled();

    const signOutAction = signOutStart();
    expect(dispatchSpy).toHaveBeenCalledWith(signOutAction);
  });
});