import { usePrivy } from '@privy-io/react-auth';
import { useSolanaWallets } from '@privy-io/react-auth/solana';

function App() {
  const { login, authenticated, logout } = usePrivy();
  const { wallets } = useSolanaWallets();

  const walletAddress = wallets[0]?.address;

  return (

  <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
    <h1 className="text-4xl font-bold text-[#9945FF] mb-4">StoryWeaver Wallet Test</h1>
    {!authenticated || !walletAddress ? (
      <button
        className="px-6 py-3 bg-[#9945FF] rounded-lg hover:bg-[#00D1FF]"
        onClick={login}
      >
        Connect Solana Wallet
      </button>
    ) : (
      <div className="flex flex-col items-center gap-4">
        <p>Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</p>
        <button
          className="px-6 py-3 bg-[#FF4567] rounded-lg hover:bg-[#FF7888]"
          onClick={logout}
        >
          Disconnect Wallet
        </button>
      </div>
    )}
  </div>
);
}

export default App;