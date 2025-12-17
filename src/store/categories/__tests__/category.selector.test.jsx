import { 
    selectCategories, 
    selectCategoriesMap, 
    selectCategoriesIsLoading 
} from '../category.selector';

const mockState = {
    categories: {
        isLoading: false,
        categories: [
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
        ]
    }
};

describe('category selector tests', () => {
    test('selectCategories should return the categories data', () => {
        const categoriesSlice = selectCategories(mockState);
        expect(categoriesSlice).toEqual(mockState.categories.categories);
    });

    test('selectCAtegoriesIsLoading should return the isLoading state', () => {
        const isLoading = selectCategoriesIsLoading(mockState);
        expect(isLoading).toEqual(false);
    });

    test('selectCAtegoriesMap should convert the items array into the appropriate map', () => {
        const expectedCategoriesMap = {
            mens: [
                { id: 1, name: 'Product 1' },
                { id: 2, name: 'Product 2' },
                { id: 3, name: 'Product 3' },
            ],
            womens: [
                { id: 4, name: 'Product 4' },
                { id: 5, name: 'Product 5' },
                { id: 6, name: 'Product 6' },
            ],
        };
        const categoriesMap = selectCategoriesMap(mockState);
        expect(categoriesMap).toEqual(expectedCategoriesMap);
    });
});