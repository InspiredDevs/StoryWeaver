import { motion } from 'framer-motion';
import { usePrivy } from '@privy-io/react-auth';

export default function Landing() {
  const { login } = usePrivy();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-[#1A1A2E] text-white">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center h-screen text-center px-4">
        <motion.h1
          className="text-4xl sm:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#9945FF] to-[#00D1FF]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          StoryWeaver: Write, Mint, Own!
        </motion.h1>
        <motion.p
          className="text-lg sm:text-xl mb-8 max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Craft any-genre novels, mint chapters as NFTs for 0.05 SOL, and earn crypto. Exclusive stories, Solana-powered.
        </motion.p>
        <motion.button
          className="px-6 py-3 bg-[#9945FF] rounded-lg hover:bg-[#00D1FF] transition-all duration-300 text-lg font-semibold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={login}
        >
          Connect Wallet
        </motion.button>
      </section>

      {/* Showcase */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            className="p-6 bg-gray-800 rounded-lg text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl font-bold mb-2">Any Genre</h3>
            <p>Fantasy, romance, sci-fi, Web3—write your story, no limits.</p>
          </motion.div>
          <motion.div
            className="p-6 bg-gray-800 rounded-lg text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-xl font-bold mb-2">Exclusive NFTs</h3>
            <p>Mint chapters for 0.05 SOL, own and trade unique stories.</p>
          </motion.div>
          <motion.div
            className="p-6 bg-gray-800 rounded-lg text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-xl font-bold mb-2">Solana-Powered</h3>
            <p>Low fees (0.005 SOL), fast mints, built for billions.</p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center">
        <p>Join the saga: <a href="https://x.com/storyweaver" className="text-[#00D1FF]">X</a> | <a href="https://discord.gg/storyweaver" className="text-[#00D1FF]">Discord</a></p>
        <p className="mt-2">Built for #SolanaBreakout</p>
      </footer>
    </div>
  );
}