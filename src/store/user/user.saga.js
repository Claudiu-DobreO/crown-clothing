import { takeLatest, all, call, put } from 'redux-saga/effects';
import { USER_ACTION_TYPES } from './user.types';
import { signInSuccess, signInFailed, signUpFailed, signUpSuccess, signOutSuccess, signOutFailed } from './user.action';
import { 
    getCurrentUser, 
    createUserDocumentFromAuth,
    signInWithGooglePopup,
    signInAuthUserWithEmailAndPassword,
    createAuthUserWithEmailAndPassword,
    signOutUser,
} from '../../utils/firebase/firebase.utils';

export function* signUp({ payload: { email, password, displayName } }) {
    try {
        const { user } = yield call(createAuthUserWithEmailAndPassword, email, password);
        yield put(signUpSuccess(user, { displayName }));
    } catch (error) {
        yield put(signUpFailed(error));
    }
}

export function* signInAfterSignup({ payload: { user, additionalDetails } }) {
    yield call(getUserSnapshotFromAuth, user, additionalDetails);
}

export function* signInWithGoogle() {
    try {
        const { user } = yield call(signInWithGooglePopup);
        yield call(getUserSnapshotFromAuth, user);
    } catch (error) {
        yield put(signInFailed(error));
    }
}

export function* signInWithEmail({ payload: { email, password } }) {
    try {
        const { user } = yield call(signInAuthUserWithEmailAndPassword, email, password);
        yield call(getUserSnapshotFromAuth, user);
    } catch (error) {
        yield put(signInFailed(error));
    }
}

export function* getUserSnapshotFromAuth(userAuth, additionalDetails = {}) {
    try {
        const userSnapshot = yield call(
            createUserDocumentFromAuth, 
            userAuth, 
            additionalDetails
        );
        const userData = { id: userSnapshot.id, ...userSnapshot.data() };

        yield put(signInSuccess(userData));
    } catch (error) {
        console.error('❌ Error in getUserSnapshotFromAuth:', error);
        yield put(signInFailed(error));
    }
}

export function* signOut() {
    try {
        yield call(signOutUser);
        yield put(signOutSuccess());
    } catch (error) {
        yield put(signOutFailed(error));
    }
}

export function* isUserAuthenticated() {
    console.log('✅ Saga matched! Action type "CHECK_USER_SESSION" triggered isUserAuthenticated()');
    try {
        const userAuth = yield call(getCurrentUser);
        if (!userAuth) return;
        
        yield call(getUserSnapshotFromAuth, userAuth);
        // Removed duplicate signInSuccess - it was overwriting the correct user data
    } catch (error) {
        yield put(signInFailed(error));
    }
}

export function* onSignUpStart() {
    yield takeLatest(USER_ACTION_TYPES.SIGN_UP_START, signUp);
}

export function* onSignUpSuccess() {
    yield takeLatest(USER_ACTION_TYPES.SIGN_UP_SUCCESS, signInAfterSignup);
}

export function* onGoogleSignInStart() {
    yield takeLatest(USER_ACTION_TYPES.GOOGLE_SIGN_IN_START, signInWithGoogle);
}

export function* onEmailSignInStart() {
    yield takeLatest(USER_ACTION_TYPES.EMAIL_SIGN_IN_START, signInWithEmail);
}

export function* onSignOutStart() {
    yield takeLatest(USER_ACTION_TYPES.SIGN_OUT_START, signOut);
}

export function* onCheckUserSession() {
    yield takeLatest(USER_ACTION_TYPES.CHECK_USER_SESSION, isUserAuthenticated);
}

export function* userSagas() {
    yield all([
        call(onCheckUserSession), 
        call(onGoogleSignInStart), 
        call(onEmailSignInStart),
        call(onSignUpStart),
        call(onSignUpSuccess),
        call(onSignOutStart),
    ]);
}