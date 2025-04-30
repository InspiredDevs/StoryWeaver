import React from 'react';
import { useState } from 'react';

interface WalletButtonProps {
  publicKey: string | null;
  setPublicKey: (key: string | null) => void;
}

interface SolanaProvider {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  publicKey: { toString: () => string };
  isConnected: boolean;
}

declare global {
  interface Window {
    solana?: SolanaProvider;
  }
}

const WalletButton: React.FC<WalletButtonProps> = ({ publicKey, setPublicKey }) => {
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async () => {
    try {
      setError(null);
      const provider = window.solana;
      if (!provider) {
        setError('Please install a Solana wallet like Phantom');
        return;
      }
      await provider.connect();
      if (provider.publicKey) {
        setPublicKey(provider.publicKey.toString());
      } else {
        setError('Failed to retrieve public key');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setError('Failed to connect wallet');
    }
  };

  const disconnectWallet = async () => {
    try {
      setError(null);
      const provider = window.solana;
      if (provider) {
        await provider.disconnect();
        setPublicKey(null);
      }
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      setError('Failed to disconnect wallet');
    }
  };

  return (
    <div className="relative">
      {error && (
        <div className="mb-2 p-2 bg-red-600 text-white text-sm rounded-lg">
          {error}
        </div>
      )}
      {!publicKey ? (
        <button
          className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-400 transition duration-200"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      ) : (
        <div className="flex items-center space-x-4">
          <span className="text-teal-200 font-mono">
            {publicKey.slice(0, 6)}...{publicKey.slice(-4)}
          </span>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-400 transition duration-200"
            onClick={disconnectWallet}
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
};

export default WalletButton;