import { useState } from 'react';

interface EditorProps {
  publicKey: string | null;
}

const Editor: React.FC<EditorProps> = ({ publicKey }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');

  const submitSnippet = async () => {
    if (!publicKey) {
      setMessage('Please connect your wallet');
      return;
    }
    if (!title || !content) {
      setMessage('Please fill in all fields');
      return;
    }

    try {
      // Mock IPFS upload
      const contentHash = `ipfs://${Math.random().toString(36).substring(2)}`;
      const response = await fetch('http://localhost:3000/submit-snippet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          contentHash,
          author: publicKey,
        }),
      });
      const data = await response.json();
      if (data.error) {
        setMessage(`Error: ${data.error}`);
      } else {
        setMessage(`Snippet submitted! PDA: ${data.snippetPDA}`);
        setTitle('');
        setContent('');
      }
    } catch (error) {
      setMessage(`Error: ${(error as Error).message}`);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-teal-400 mb-4">Create Story Snippet</h2>
      <input
        type="text"
        placeholder="Snippet Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 mb-4 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
      />
      <textarea
        placeholder="Write your story..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 mb-4 bg-gray-700 text-white rounded-lg h-40 focus:outline-none focus:ring-2 focus:ring-teal-400"
      />
      <button
        onClick={submitSnippet}
        className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-400 transition"
      >
        Submit Snippet
      </button>
      {message && <p className="mt-4 text-teal-200">{message}</p>}
    </div>
  );
};

export default Editor;