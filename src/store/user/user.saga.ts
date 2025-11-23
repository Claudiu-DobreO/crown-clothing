import { takeLatest, all, call, put } from 'typed-redux-saga';
import { USER_ACTION_TYPES } from './user.types';
import { 
    signInSuccess, 
    signInFailed, 
    signUpFailed, 
    signUpSuccess, 
    signOutSuccess, 
    signOutFailed,
    EmailSignInStartAction,
    SignUpStartAction,
    SignUpSuccessAction,
} from './user.action';
import { 
    getCurrentUser, 
    createUserDocumentFromAuth,
    signInWithGooglePopup,
    signInAuthUserWithEmailAndPassword,
    createAuthUserWithEmailAndPassword,
    signOutUser,
    AdditionalInformation,
} from '../../utils/firebase/firebase.utils';
import { User } from 'firebase/auth';

export function* signUp({ payload: { email, password, displayName } }: SignUpStartAction) {
    try {
        const userCredential = yield* call(createAuthUserWithEmailAndPassword, email, password);
        if (!userCredential) return;

        const { user } = userCredential;
        yield* put(signUpSuccess(user, { displayName }));
    } catch (error) {
        yield* put(signUpFailed(error as Error));
    }
}

export function* signInAfterSignup({ payload: { user, additionalDetails } }: SignUpSuccessAction) {
    yield* call(getUserSnapshotFromAuth, user, additionalDetails);
}

export function* signInWithGoogle() {
    try {
        const { user } = yield* call(signInWithGooglePopup);
        yield* call(getUserSnapshotFromAuth, user);
    } catch (error) {
        yield* put(signInFailed(error as Error));
    }
}

export function* signInWithEmail({ payload: { email, password } }: EmailSignInStartAction) {
    try {
        const userCredential = yield* call(signInAuthUserWithEmailAndPassword, email, password);
        
        if (!userCredential) return;

        const { user } = userCredential;
        yield* call(getUserSnapshotFromAuth, user);
    } catch (error) {
        yield* put(signInFailed(error as Error));
    }
}

export function* getUserSnapshotFromAuth(userAuth: User, additionalDetails: AdditionalInformation = {}) {
    try {
        const userSnapshot = yield* call(
            createUserDocumentFromAuth, 
            userAuth, 
            additionalDetails
        );

        if (!userSnapshot) return;
        const userData = { id: userSnapshot.id, ...userSnapshot.data() };

        yield* put(signInSuccess(userData));
    } catch (error) {
        console.error('❌ Error in getUserSnapshotFromAuth:', error);
        yield* put(signInFailed(error as Error));
    }
}

export function* signOut() {
    try {
        yield* call(signOutUser);
        yield* put(signOutSuccess());
    } catch (error) {
        yield* put(signOutFailed(error as Error));
    }
}

export function* isUserAuthenticated() {
    try {
        const userAuth = yield* call(getCurrentUser);
        if (!userAuth) return;
        
        yield* call(getUserSnapshotFromAuth, userAuth);
        // Removed duplicate signInSuccess - it was overwriting the correct user data
    } catch (error) {
        yield* put(signInFailed(error as Error));
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