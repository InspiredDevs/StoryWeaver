import React from 'react';
import ReactDOM from 'react-dom/client';
import { PrivyProvider } from '@privy-io/react-auth';
import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PrivyProvider
      appId={import.meta.env.VITE_PRIVY_APP_ID}
      config={{
        loginMethods: ['wallet'],
        embeddedWallets: {
          createOnLogin: 'all-users', // Creates embedded wallets for non-crypto users
        },
        appearance: {
          theme: 'dark',
          accentColor: '#9945FF', // Solana purple
        },
        // Removed additionalChains as it is not a valid property of PrivyClientConfig
        // Removed walletConnectors as it is not a valid property of PrivyClientConfig
      }}
    >
      <App />
    </PrivyProvider>
  </React.StrictMode>
);