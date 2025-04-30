import { useState } from 'react';
import { Connection } from '@solana/web3.js';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import WalletButton from './components/WalletButton';
import Editor from './pages/Editor';
import Reader from './pages/Reader';
import MintNFT from './pages/MintNFT';
import Dashboard from './pages/Dashboard';

function App() {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const quicknodeUrl = import.meta.env.VITE_QUICKNODE_URL;

  if (!quicknodeUrl) {
    console.error('VITE_QUICKNODE_URL not set in .env');
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-red-500">Error: QuickNode URL not configured</p>
      </div>
    );
  }

  const connection = new Connection(quicknodeUrl, 'confirmed');

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white font-sans">
        {/* Navbar */}
        <nav className="bg-teal-800 p-4 flex justify-between items-center shadow-lg">
          <div className="flex space-x-6">
            <Link to="/" className="text-teal-200 hover:text-teal-100 font-medium transition duration-200">
              Editor
            </Link>
            <Link to="/reader" className="text-teal-200 hover:text-teal-100 font-medium transition duration-200">
              Reader
            </Link>
            <Link to="/mint" className="text-teal-200 hover:text-teal-100 font-medium transition duration-200">
              Mint NFT
            </Link>
            <Link to="/dashboard" className="text-teal-200 hover:text-teal-100 font-medium transition duration-200">
              Dashboard
            </Link>
          </div>
          <WalletButton publicKey={publicKey} setPublicKey={setPublicKey} />
        </nav>

        {/* Main Content */}
        <div className="p-6 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Editor publicKey={publicKey} />} />
            <Route path="/reader" element={<Reader publicKey={publicKey} />} />
            <Route path="/mint" element={<MintNFT publicKey={publicKey} connection={connection} />} />
            <Route path="/dashboard" element={<Dashboard publicKey={publicKey} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;