import { usePrivy } from '@privy-io/react-auth';

function App() {
  const { login, authenticated, user } = usePrivy();
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-[#9945FF] mb-4">StoryWeaver Wallet Test</h1>
      {!authenticated ? (
        <button
          className="px-6 py-3 bg-[#9945FF] rounded-lg hover:bg-[#00D1FF]"
          onClick={login}
        >
          Connect Wallet
        </button>
      ) : (
        <p>Connected: {user?.wallet?.address?.slice(0, 6)}...</p>
      )}
    </div>
  );
}
export default App;