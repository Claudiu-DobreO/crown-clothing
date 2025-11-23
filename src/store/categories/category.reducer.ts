import { UnknownAction } from 'redux';
import { Category } from './category.types';
import { 
	fetchCategoriesStart, 
	fetchCategoriesSuccess, 
	fetchCategoriesFailed 
} from './category.action';

export type CategoryState = {
	readonly categories: Category[];
	readonly isLoading: boolean;
	readonly error: Error | null;
}

const CATEGORIES_INITIAL_STATE: CategoryState = {
	categories: [],
	isLoading: false,
	error: null,
};

export const categoryReducer = (
	state = CATEGORIES_INITIAL_STATE, 
	action: UnknownAction
): CategoryState => {
	if (fetchCategoriesStart.match(action)) {
		return { ...state, isLoading: true };
	}

	if (fetchCategoriesSuccess.match(action)) {
		return { ...state, categories: action.payload, isLoading: false };
	}

	if (fetchCategoriesFailed.match(action)) {
		return { ...state, error: action.payload, isLoading: false };
	}

	return state;
};
