import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../utils/test/test.utils';
import { vi } from 'vitest';
import Category from '../category.component';

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useParams: () => ({
            category: 'mens',
        })
    };
});

describe('Category component tests', () => {
  it('should render a spinner if isLoading is true', () => {
    renderWithProviders(<Category />, {
        preloadedState: {
            categories: {
                isLoading: true,
                categories: [],
            },
        },
    });
    
    const spinnerElement = screen.getByTestId('spinner');
    expect(spinnerElement).toBeInTheDocument();
  });

  it('should render products when isLoading is false', () => {
    renderWithProviders(<Category />, {
        preloadedState: {
            categories: {
                isLoading: false,
                categories: [{
                    title: 'mens',
                    items: [
                        { id: 1, name: 'Product 1'},
                        { id: 2, name: 'Product 2'},
                        { id: 3, name: 'Product 3'},
                    ],
                }],
            },
        },
    });
    const spinnerElement = screen.queryByTestId('spinner');
    expect(spinnerElement).toBeNull();

    const product1Element = screen.getByText(/product 1/i);
    expect(product1Element).toBeInTheDocument();
  });
});