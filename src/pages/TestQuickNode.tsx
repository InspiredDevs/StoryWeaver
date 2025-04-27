import { useEffect, useState } from 'react';
import { solanaConnection } from '../utils/solana';
import { motion } from 'framer-motion';

export default function TestQuickNode() {
  const [slot, setSlot] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getSlot() {
      try {
        const slotNumber = await solanaConnection.getSlot();
        setSlot(slotNumber);
      } catch (err) {
        setError('Failed to fetch slot. Check QuickNode URL.');
        console.error(err);
      }
    }
    getSlot();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <motion.div
        className="max-w-md w-full bg-[#1A1A2E] rounded-lg p-6 text-white text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-4 text-[#9945FF]">QuickNode Test</h2>
        {slot ? (
          <p className="text-lg">Current Solana Devnet Slot: <span className="text-[#00D1FF]">{slot}</span></p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <p>Loading...</p>
        )}
      </motion.div>
    </div>
  );
}