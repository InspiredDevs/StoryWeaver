import React from 'react';
import ReactDOM from 'react-dom/client';
import { PrivyProvider } from '@privy-io/react-auth';
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana';
import App from './App.tsx';
import './index.css';

const solanaConnectors = toSolanaWalletConnectors({
  shouldAutoConnect: true,
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PrivyProvider
      appId={import.meta.env.VITE_PRIVY_APP_ID}
      config={{
        loginMethods: ['wallet'],
        embeddedWallets: {
          createOnLogin: 'all-users',
        },
        appearance: {
          theme: 'dark',
          accentColor: '#9945FF',
          walletChainType: 'solana-only',
        },
        externalWallets: {
          solana: {
            connectors: solanaConnectors,
          },
        },
      }}
    >
      <App />
    </PrivyProvider>
  </React.StrictMode>
);