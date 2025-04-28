import { motion } from 'framer-motion';
import { usePrivy } from '@privy-io/react-auth';

export default function Reader() {
  const { authenticated, login } = usePrivy();

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <motion.div
        className="max-w-3xl w-full bg-[#1A1A2E] rounded-lg p-6 text-white"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-[#9945FF] flex items-center">
          <img src="/quill-placeholder.png" alt="Quill" className="w-8 h-8 mr-2" />
          Chapter 1: Stakehaven
        </h2>
        {!authenticated && (
          <motion.button
            className="w-full p-3 mb-4 bg-[#00D1FF] rounded-lg hover:bg-[#9945FF]"
            whileHover={{ scale: 1.05 }}
            onClick={login}
          >
            Connect Wallet
          </motion.button>
        )}
        <div className="p-4 bg-gray-800 rounded-lg">
          <p className="text-lg">
            In Stakehaven, the chain glowed under Valora’s touch, binding the realm’s fate to her will...
          </p>
          <p className="text-sm mt-2 italic">Own this chapter for 0.05 SOL</p>
        </div>
        <motion.button
          className="w-full p-3 mt-4 bg-[#9945FF] rounded-lg hover:bg-[#00D1FF] font-semibold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={!authenticated}
        >
          Buy NFT
        </motion.button>
      </motion.div>
    </div>
  );
}