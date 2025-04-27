import { useState } from 'react';

export default function Editor() {
  const [snippet, setSnippet] = useState('');
  const [genre, setGenre] = useState('Fantasy');
  const [tone, setTone] = useState('Heroic');

  return (
    <div className="p-4 max-w-2xl mx-auto bg-gray-900 text-white rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Write Your Story</h2>
      <select
        className="mb-4 p-2 bg-gray-800 rounded w-full"
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
      >
        <option>Fantasy</option>
        <option>Romance</option>
        <option>Sci-Fi</option>
        <option>Web3</option>
      </select>
      <select
        className="mb-4 p-2 bg-gray-800 rounded w-full"
        value={tone}
        onChange={(e) => setTone(e.target.value)}
      >
        <option>Heroic</option>
        <option>Tender</option>
        <option>Dark</option>
      </select>
      <textarea
        className="w-full p-2 bg-gray-800 rounded h-40"
        placeholder="Write your story (50–200 words)..."
        value={snippet}
        onChange={(e) => setSnippet(e.target.value)}
      />
      <button className="mt-4 p-2 bg-purple-600 rounded hover:bg-purple-700 w-full">
        Submit (0.005 SOL)
      </button>
    </div>
  );
}