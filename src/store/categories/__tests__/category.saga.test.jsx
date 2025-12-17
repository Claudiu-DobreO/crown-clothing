import { testSaga, expectSaga } from 'redux-saga-test-plan';
import { call } from 'redux-saga/effects';
import { throwError } from 'redux-saga-test-plan/providers';
import { 
    categoriesSaga, 
    onFetchCategories,
    fetchCategoriesAsync
} from '../category.saga';
import { CATEGORY_ACTION_TYPES } from '../category.types';
import { fetchCategoriesSuccess, fetchCategoriesFailed } from '../category.action';
import { getCategoriesAndDocuments } from '../../../utils/firebase/firebase.utils';

describe('category saga tests', () => {
    test('categoriesSaga should call onFetchCategories', () => {
        return expectSaga(categoriesSaga)
            .call(onFetchCategories)
            .run();
    });

    test('onFetchCategories', () => {
        testSaga(onFetchCategories)
            .next()
            .takeLatest(CATEGORY_ACTION_TYPES.FETCH_CATEGORIES_START, fetchCategoriesAsync)
            .next()
            .isDone();
    });

    test('fetchCategoriesAsync success', () => {
        const mockCategoriesArray =[
            { id: 1, name: 'Category 1' },
            { id: 2, name: 'Category 2' },
        ];

        return expectSaga(fetchCategoriesAsync)
            .provide([
                [call(getCategoriesAndDocuments), mockCategoriesArray],
            ])
            .put(fetchCategoriesSuccess(mockCategoriesArray))
            .run();
    });

    test('fetchCategoriesAsync failure', () => {
        const mockError = new Error('Error fetching categories');
        
        return expectSaga(fetchCategoriesAsync)
            .provide([
                [call(getCategoriesAndDocuments), throwError(mockError)],
            ])
            .put(fetchCategoriesFailed(mockError))
            .run();
    });
});