import React from 'react';
import ReactDOM from 'react-dom/client';
import { PrivyProvider } from '@privy-io/react-auth';
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana';
import App from './App.tsx';
import './index.css';

// Initialize Solana wallet connectors for external wallets (e.g., Phantom)
const solanaConnectors = toSolanaWalletConnectors({ shouldAutoConnect: false });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PrivyProvider
      appId={import.meta.env.VITE_PRIVY_APP_ID}
      config={{
        loginMethods: ['wallet'],
        embeddedWallets: {
          createOnLogin: 'all-users',
        },
        // Specify Solana Devnet with QuickNode RPC
        solanaClusters: [
          {
            rpcUrls: [import.meta.env.VITE_QUICKNODE_URL], // Use rpcUrls directly
          },
        ],
        // Enable external Solana wallets (e.g., Phantom)
        externalWallets: {
          solana: {
            connectors: solanaConnectors,
          },
        },
        appearance: {
          theme: 'dark',
          accentColor: '#9945FF',
          walletChainType: 'solana-only', // Fixed to valid value
        },
      }}
    >
      <App />
    </PrivyProvider>
  </React.StrictMode>
);