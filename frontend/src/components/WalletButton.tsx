import { Connection } from '@solana/web3.js';

interface WalletButtonProps {
  publicKey: string | null;
  setPublicKey: (key: string | null) => void;
  connection: Connection;
}

const WalletButton: React.FC<WalletButtonProps> = ({ publicKey, setPublicKey, connection }) => {
  const connectWallet = async () => {
    try {
      const provider = (window as any).solana;
      if (!provider) {
        alert('Please install a Solana wallet like Phantom');
        return;
      }
      await provider.connect();
      const pubKey = provider.publicKey.toString();
      setPublicKey(pubKey);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet');
    }
  };

  const disconnectWallet = async () => {
    try {
      const provider = (window as any).solana;
      if (provider) {
        await provider.disconnect();
        setPublicKey(null);
      }
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  return (
    <div>
      {!publicKey ? (
        <button
          className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-400 transition"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      ) : (
        <div className="flex items-center space-x-4">
          <span className="text-teal-200">
            {publicKey.slice(0, 6)}...{publicKey.slice(-4)}
          </span>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-400 transition"
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