# What Calls the User Reducer - Complete Flow

## The Question: What Calls `userReducer`?

**File:** `src/store/user/user.reducer.js:9`
```javascript
export const userReducer = (state = INITIAL_STATE, action) => {
    // Who calls this function?
```

---

## Answer: Redux Store's Dispatch Function Calls It

The reducer is called by **Redux's internal dispatch mechanism** after an action passes through all middleware.

---

## Complete Flow: From Saga to Reducer

### Step 1: Saga Dispatches Action

**File:** `src/store/user/user.saga.js:15`
```javascript
yield put(signInSuccess(userData));
```

**What `yield put()` does:**
- `put` is a saga effect that dispatches an action
- It's equivalent to calling `store.dispatch()` but from inside a saga
- This creates and dispatches: `{ type: 'user/SIGN_IN_SUCCESS', payload: userData }`

**Inside Redux-Saga (simplified):**
```javascript
function put(action) {
    // Returns an effect object
    return {
        type: 'PUT',
        action: action  // { type: 'user/SIGN_IN_SUCCESS', payload: userData }
    };
}

// When saga yields put(), the task runner does:
const effect = yield put(signInSuccess(userData));
// effect = { type: 'PUT', action: { type: 'user/SIGN_IN_SUCCESS', payload: userData } }

// Task runner sees PUT effect and calls:
store.dispatch(effect.action);
// This dispatches: { type: 'user/SIGN_IN_SUCCESS', payload: userData }
```

---

### Step 2: Action Enters Redux Store (Again)

**File:** `src/store/store.js:33-36`
```javascript
export const store = createStore(
    persistedReducer,  // This is the rootReducer wrapped with persistReducer
    undefined, 
    composedEnhancers  // Contains middleware chain
);
```

**When `store.dispatch()` is called:**

The action goes through the middleware chain again:

```
Action: { type: 'user/SIGN_IN_SUCCESS', payload: userData }
    ↓
┌─────────────────────────────────────┐
│ loggerMiddleware (if dev mode)      │ ← Logs the action
│   ↓                                 │
│   next(action) → passes to next     │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ sagaMiddleware                      │ ← Checks for listeners
│                                      │
│ Looks for: 'user/SIGN_IN_SUCCESS'   │
│ Registry: [empty or no match]       │
│                                      │
│   ↓                                 │
│   next(action) → passes to next     │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ Redux Store's Base Dispatch         │ ← THIS IS WHAT CALLS THE REDUCER
└─────────────────────────────────────┘
```

**Why saga doesn't intercept this:**
- Saga middleware checks: "Do I have a listener for 'user/SIGN_IN_SUCCESS'?"
- No listener found (you only have a listener for 'CHECK_USER_SESSION')
- Saga middleware calls `next(action)` to pass it along

---

### Step 3: Redux Store Calls the Root Reducer

**Inside Redux's `dispatch` function (simplified):**
```javascript
// Redux's internal dispatch function
function dispatch(action) {
    // Action passed through all middleware
    // Now it's time to update state
    
    // Call the root reducer with current state and action
    const newState = rootReducer(currentState, action);
    
    // Update store state
    currentState = newState;
    
    // Notify subscribers (React components)
    listeners.forEach(listener => listener());
    
    return action;
}
```

**What `rootReducer` is:**
**File:** `src/store/store.js:18`
```javascript
const persistedReducer = persistReducer(persistConfig, rootReducer);
```

**File:** `src/store/root-reducer.js:6-9`
```javascript
export const rootReducer = combineReducers({
	user: userReducer,        // ← Your user reducer
	categories: categoryReducer,
	cart: cartReducer,
});
```

**What `combineReducers` does (simplified):**
```javascript
function combineReducers(reducers) {
    return function rootReducer(state, action) {
        const newState = {};
        
        // Call each reducer with its slice of state
        Object.keys(reducers).forEach(key => {
            const reducer = reducers[key];
            // reducer = userReducer
            const previousStateForKey = state[key];
            // previousStateForKey = state.user
            
            // THIS IS WHERE YOUR REDUCER IS CALLED!
            newState[key] = reducer(previousStateForKey, action);
            // newState.user = userReducer(state.user, action)
        });
        
        return newState;
    };
}
```

---

### Step 4: User Reducer is Called

**File:** `src/store/user/user.reducer.js:9`
```javascript
export const userReducer = (state = INITIAL_STATE, action) => {
	const { type, payload } = action;

	switch (type) {
		case USER_ACTION_TYPES.SIGN_IN_SUCCESS:
			return {
				...state,
				currentUser: payload  // payload = userData
			};
		// ...
	}
};
```

**What happens:**
1. `combineReducers` calls: `userReducer(state.user, action)`
2. `state.user` = current user state (e.g., `{ currentUser: null, isLoading: false, error: null }`)
3. `action` = `{ type: 'user/SIGN_IN_SUCCESS', payload: userData }`
4. Reducer checks the switch statement
5. Matches `SIGN_IN_SUCCESS` case
6. Returns new state: `{ ...state, currentUser: userData }`
7. `combineReducers` puts this in `newState.user`
8. Redux updates the store's state

---

## Visual Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Saga dispatches action                                    │
│    user.saga.js:15                                           │
│    yield put(signInSuccess(userData))                       │
│    ↓                                                         │
│    Creates: { type: 'user/SIGN_IN_SUCCESS', payload: userData } │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Action enters store.dispatch()                           │
│    Redux Store (internal function)                          │
│    dispatch(action)                                         │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Passes through middleware chain                          │
│    store.js:20-23                                           │
│    [loggerMiddleware, sagaMiddleware]                       │
│                                                              │
│    loggerMiddleware:                                         │
│      Logs action                                             │
│      next(action) → continue                                │
│                                                              │
│    sagaMiddleware:                                          │
│      Checks registry for 'user/SIGN_IN_SUCCESS'              │
│      No listener found                                       │
│      next(action) → continue                                 │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Redux's base dispatch calls reducer                      │
│    (Inside Redux library code)                              │
│                                                              │
│    const newState = rootReducer(currentState, action);       │
│    ↑                                                         │
│    This is where the reducer is actually called!            │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. combineReducers calls userReducer                        │
│    root-reducer.js:6-9                                       │
│                                                              │
│    combineReducers({                                         │
│      user: userReducer,  ← Your reducer                     │
│      categories: categoryReducer,                           │
│      cart: cartReducer                                      │
│    })                                                        │
│                                                              │
│    Inside combineReducers:                                   │
│      newState.user = userReducer(state.user, action)        │
│                  ↑                                          │
│                  THIS CALLS YOUR REDUCER!                   │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. userReducer executes                                     │
│    user.reducer.js:9                                         │
│                                                              │
│    userReducer(state.user, action)                           │
│                                                              │
│    state.user = { currentUser: null, ... }                  │
│    action = { type: 'user/SIGN_IN_SUCCESS', payload: userData } │
│                                                              │
│    Switch statement matches SIGN_IN_SUCCESS                  │
│    Returns: { ...state, currentUser: userData }             │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. State updated                                            │
│    Redux updates store.state.user with new value            │
│    Notifies React components that subscribed                │
│    Components re-render with new state                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Code Locations

| What Happens | File | Line | Code |
|--------------|------|------|------|
| Saga dispatches | `user.saga.js` | 15 | `yield put(signInSuccess(userData))` |
| Action goes to store | Redux internal | - | `store.dispatch(action)` |
| Passes middleware | `store.js` | 20-23 | Middleware chain |
| Redux calls root reducer | Redux internal | - | `rootReducer(state, action)` |
| combineReducers splits | `root-reducer.js` | 6-9 | `combineReducers({ user: userReducer })` |
| **User reducer called** | `root-reducer.js` | (via combineReducers) | `userReducer(state.user, action)` |
| Reducer executes | `user.reducer.js` | 9 | `export const userReducer = (state, action) => { ... }` |
| State updated | Redux internal | - | Store state updated |

---

## Why This Design?

**Why Redux calls the reducer automatically:**

1. **Single source of truth**
   - Only Redux knows the current state
   - Only Redux can update state
   - Components can't directly modify state

2. **Predictable updates**
   - Every state change goes: Action → Middleware → Reducer
   - Same flow every time
   - Easy to debug and trace

3. **Middleware can intercept**
   - Before reducer runs
   - After reducer runs
   - Can modify, log, or block actions

4. **combineReducers splits work**
   - Each reducer only handles its slice
   - `userReducer` only gets `state.user`
   - `cartReducer` only gets `state.cart`
   - Keeps reducers focused and simple

---

## Summary: What Calls the Reducer?

**Direct answer:**
- `combineReducers` calls each reducer when `rootReducer` is invoked
- `rootReducer` is called by Redux's internal `dispatch` function
- This happens automatically after action passes through middleware

**The chain:**
```
Saga: yield put(signInSuccess(userData))
  ↓
store.dispatch(action)
  ↓
Middleware chain (logger, saga)
  ↓
Redux's base dispatch
  ↓
rootReducer(state, action)  ← combineReducers
  ↓
userReducer(state.user, action)  ← YOUR REDUCER CALLED HERE
```

**You don't call it directly** - Redux's dispatch mechanism does, as part of the normal Redux flow.

---

## Important Points

1. **Every action goes to every reducer**
   - Even if reducer doesn't handle it
   - Reducer returns current state in `default` case

2. **Reducers are pure functions**
   - They don't have side effects
   - They just return new state
   - Redux handles updating the store

3. **The reducer runs synchronously**
   - After middleware completes
   - Before state is updated
   - Before components are notified

4. **combineReducers calls all reducers**
   - Not just the one that matches
   - Each reducer decides if it cares about the action
   - Those that don't care return current state unchanged







