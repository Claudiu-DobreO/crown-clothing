import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import App from './App';
import { store, persistor } from './store/store';
import reportWebVitals from './reportWebVitals';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from './utils/stripe/stripe.utils';
import './index.scss';

console.log('🚀 Index.jsx loaded');

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
      <React.StrictMode>
          <Provider store={store}>
              <PersistGate loading={null} persistor={persistor}>
                  <BrowserRouter>
                      <Elements stripe={stripePromise}>
                          <App />
                      </Elements>
                  </BrowserRouter>
              </PersistGate>
          </Provider>
      </React.StrictMode>
  );
  console.log('✅ App rendered successfully');
} catch (error) {
  console.error('❌ Error rendering app:', error);
  rootElement.innerHTML = `<div style="padding: 20px; color: red;">
    <h1>Error loading app</h1>
    <p>${error.message}</p>
    <pre>${error.stack}</pre>
  </div>`;
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
