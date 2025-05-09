import { useState, useEffect, useCallback } from 'react';
import { Snippet } from '../types';

interface DashboardProps {
  publicKey: string | null;
}

const Dashboard: React.FC<DashboardProps> = ({ publicKey }) => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [message, setMessage] = useState('');

  const fetchSnippets = useCallback(async () => {
    if (!publicKey) {
      setMessage('Please connect your wallet');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/test-mongo');
      const data = await response.json();
      if (data.error) {
        setMessage(`Error: ${data.error}`);
      } else {
        // Mock data, replace with real API
        const userSnippets: Snippet[] = [
          {
            title: 'Test Snippet 3',
            contentHash: 'ipfs://test-hash-3',
            snippetPDA: 'TBD',
            nftMinted: false,
            author: publicKey,
          },
        ].filter(s => s.author === publicKey);
        setSnippets(userSnippets);
        setMessage('Snippets loaded!');
      }
    } catch (error) {
      setMessage(`Error: ${(error as Error).message}`);
    }
  }, [publicKey]);

  useEffect(() => {
    if (publicKey) {
      fetchSnippets();
    }
  }, [publicKey, fetchSnippets]);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-teal-400 mb-4">Your Story Snippets</h2>
      {message && <p className="mb-4 text-teal-200">{message}</p>}
      {snippets.length === 0 ? (
        <p className="text-gray-400">No snippets found.</p>
      ) : (
        <div className="grid gap-4">
          {snippets.map((snippet, index) => (
            <div key={index} className="p-4 bg-gray-700 rounded-lg">
              <h3 className="text-lg font-bold">{snippet.title}</h3>
              <p>Content Hash: {snippet.contentHash}</p>
              <p>PDA: {snippet.snippetPDA}</p>
              <p>NFT Minted: {snippet.nftMinted ? 'Yes' : 'No'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;