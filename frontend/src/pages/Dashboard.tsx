import { useState, useEffect } from 'react';

interface DashboardProps {
  publicKey: string | null;
}

const Dashboard: React.FC<DashboardProps> = ({ publicKey }) => {
  const [snippets, setSnippets] = useState<any[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (publicKey) {
      fetchSnippets();
    }
  }, [publicKey]);

  const fetchSnippets = async () => {
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
        const snippets = await Promise.all(
          data.collections.includes('snippets')
            ? (await (await fetch('mongodb://localhost:27017/storyweaver')).json()).snippets.find({ author: publicKey }).toArray()
            : []
        );
        setSnippets(snippets);
        setMessage('Snippets loaded!');
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

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