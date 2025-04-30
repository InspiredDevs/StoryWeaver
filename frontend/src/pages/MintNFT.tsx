import { useState } from 'react';
import { Connection } from '@solana/web3.js';

interface MintNFTProps {
  publicKey: string | null;
  connection: Connection;
}

const MintNFT: React.FC<MintNFTProps> = ({ publicKey }) => {
  const [snippetPDA, setSnippetPDA] = useState('');
  const [message, setMessage] = useState('');

  const mintNFT = async () => {
    if (!publicKey) {
      setMessage('Please connect your wallet');
      return;
    }
    if (!snippetPDA) {
      setMessage('Please enter Snippet PDA');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/mint-nft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          snippetPDA,
          mint: 'ECpE6eyTSZD1EUxu2V3y5HHZ61h3VB98JdfbFHEGYZyn', // Backend-generated
          tokenAccount: 'BNAr66NY12HMYUsSLxuHjDnWS6yjposiA5554rk4kY15', // Backend-generated
          author: publicKey,
        }),
      });
      const data = await response.json();
      if (data.error) {
        setMessage(`Error: ${data.error}`);
      } else {
        setMessage(`NFT minted! Signature: ${data.signature}`);
      }
    } catch (error) {
      setMessage(`Error: ${(error as Error).message}`);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-teal-400 mb-4">Mint Story NFT</h2>
      <input
        type="text"
        placeholder="Snippet PDA"
        value={snippetPDA}
        onChange={(e) => setSnippetPDA(e.target.value)}
        className="w-full p-2 mb-4 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
      />
      <button
        onClick={mintNFT}
        className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-400 transition"
      >
        Mint NFT
      </button>
      {message && <p className="mt-4 text-teal-200">{message}</p>}
    </div>
  );
};

export default MintNFT;