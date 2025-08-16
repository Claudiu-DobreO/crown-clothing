import { CATEGORY_ACTION_TYPES } from './category.types';

const CATEGORIES_INITIAL_STATE = {
	categories: []
};

export const categoryReducer = (state = CATEGORIES_INITIAL_STATE, action = {}) => {
	const { type, payload } = action;
	console.log("Payload: ", payload);

	switch (type) {
		case CATEGORY_ACTION_TYPES.SET_CATEGORIES:
			return { ...state, categories: payload };
		default: 
			return state;
	}
};
