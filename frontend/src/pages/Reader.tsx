import { useState } from 'react';
import { Snippet } from '../types';

interface ReaderProps {
  publicKey: string | null;
}

const Reader: React.FC<ReaderProps> = ({ publicKey }) => {
  const [snippetPDA, setSnippetPDA] = useState('');
  const [tokenAccount, setTokenAccount] = useState('');
  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [message, setMessage] = useState('');

  const readSnippet = async () => {
    if (!publicKey) {
      setMessage('Please connect your wallet');
      return;
    }
    if (!snippetPDA || !tokenAccount) {
      setMessage('Please enter Snippet PDA and Token Account');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/read-snippet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ snippetPDA, tokenAccount }),
      });
      const data = await response.json();
      if (data.error) {
        setMessage(`Error: ${data.error}`);
      } else {
        setSnippet(data.snippet);
        setMessage('Snippet loaded!');
      }
    } catch (error) {
      setMessage(`Error: ${(error as Error).message}`);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-teal-400 mb-4">Read Story Snippet</h2>
      <input
        type="text"
        placeholder="Snippet PDA"
        value={snippetPDA}
        onChange={(e) => setSnippetPDA(e.target.value)}
        className="w-full p-2 mb-4 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
      />
      <input
        type="text"
        placeholder="Token Account"
        value={tokenAccount}
        onChange={(e) => setTokenAccount(e.target.value)}
        className="w-full p-2 mb-4 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
      />
      <button
        onClick={readSnippet}
        className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-400 transition"
      >
        Read Snippet
      </button>
      {message && <p className="mt-4 text-teal-200">{message}</p>}
      {snippet && (
        <div className="mt-4 p-4 bg-gray-700 rounded-lg">
          <h3 className="text-lg font-bold">{snippet.title}</h3>
          <p>Content Hash: {snippet.contentHash}</p>
          <p>Author: {snippet.author}</p>
          <p>NFT Minted: {snippet.nftMinted ? 'Yes' : 'No'}</p>
        </div>
      )}
    </div>
  );
};

export default Reader;