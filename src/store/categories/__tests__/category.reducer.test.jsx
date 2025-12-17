import { categoryReducer, CATEGORIES_INITIAL_STATE } from '../category.reducer';
import { 
    fetchCategoriesStart, 
    fetchCategoriesSuccess, 
    fetchCategoriesFailed 
} from '../category.action';

describe('categoryReducer tests', () => {
    test('fetchCategoriesStart', () => {
        const expectedState = {
            ...CATEGORIES_INITIAL_STATE,
            isLoading: true,
        };

        expect(
            categoryReducer(CATEGORIES_INITIAL_STATE, fetchCategoriesStart())
        ).toEqual(expectedState);
    });

    test('fetchCategoriesSuccess', () => {
        const mockData = [
            {
                title: 'mens',
                imageUrl: 'https://via.placeholder.com/150',
                items: [
                    { id: 1, name: 'Product 1' },
                    { id: 2, name: 'Product 2' },
                    { id: 3, name: 'Product 3' },
                ],
            },
            {
                title: 'womens',
                imageUrl: 'https://via.placeholder.com/151',
                items: [
                    { id: 4, name: 'Product 4' },
                    { id: 5, name: 'Product 5' },
                    { id: 6, name: 'Product 6' },
                ],
            }
        ];

        const expectedState = {
            ...CATEGORIES_INITIAL_STATE,
            categories: mockData,
            isLoading: false,
        };

        expect(
            categoryReducer(CATEGORIES_INITIAL_STATE, fetchCategoriesSuccess(mockData))
        ).toEqual(expectedState);
    });

    test('fetchCategoriesFailed', () => {
        const mockError = new Error('Error fetching categories');
        const expectedState = {
            ...CATEGORIES_INITIAL_STATE,
            error: mockError,
            isLoading: false,
        };
        
        expect(
            categoryReducer(CATEGORIES_INITIAL_STATE, fetchCategoriesFailed(mockError))
        ).toEqual(expectedState);
    });
});