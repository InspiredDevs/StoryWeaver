import { motion } from 'framer-motion';
import { usePrivy } from '@privy-io/react-auth';
import { Link } from 'react-router-dom';

export default function Sample() {
  const { login, authenticated, user, logout } = usePrivy();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-[#1A1A2E] text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 bg-[#1A1A2E] sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-[#9945FF] flex items-center">
          <img src="/quill-placeholder.png" alt="Quill" className="w-8 h-8 mr-2" />
          StoryWeaver
        </h1>
        <div className="flex items-center gap-4">
          <Link to="/editor" className="text-[#00D1FF] hover:underline">Write</Link>
          <Link to="/mint" className="text-[#00D1FF] hover:underline">Mint</Link>
          <Link to="/reader" className="text-[#00D1FF] hover:underline">Read</Link>
          {!authenticated ? (
            <motion.button
              className="px-4 py-2 bg-[#9945FF] rounded-lg hover:bg-[#00D1FF]"
              whileHover={{ scale: 1.05 }}
              onClick={login}
            >
              Connect Wallet
            </motion.button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm">{user?.wallet?.address?.slice(0, 6)}...</span>
              <motion.button
                className="px-4 py-2 bg-[#00D1FF] rounded-lg hover:bg-[#9945FF]"
                whileHover={{ scale: 1.05 }}
                onClick={logout}
              >
                Disconnect
              </motion.button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center h-[80vh] text-center px-4">
        <motion.h1
          className="text-4xl sm:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#9945FF] to-[#00D1FF]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Unleash Your Saga on Solana
        </motion.h1>
        <motion.p
          className="text-lg sm:text-xl mb-8 max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Write epic stories, mint them as NFTs for 0.05 SOL, and share exclusive chapters with the world.
        </motion.p>
        <motion.button
          className="px-6 py-3 bg-[#9945FF] rounded-lg hover:bg-[#00D1FF] text-lg font-semibold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={login}
        >
          Start Writing
        </motion.button>
      </section>

      {/* Showcase */}
      <section className="py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-[#9945FF]">Why StoryWeaver?</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            className="p-6 bg-gray-800 rounded-lg text-center shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img src="/quill-placeholder.png" alt="Quill" className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Any Genre</h3>
            <p>From fantasy to Web3 thrillers, your story, your rules.</p>
          </motion.div>
          <motion.div
            className="p-6 bg-gray-800 rounded-lg text-center shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <img src="/quill-placeholder.png" alt="Quill" className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Own Your Work</h3>
            <p>Mint chapters as NFTs for 0.05 SOL, trade or hold forever.</p>
          </motion.div>
          <motion.div
            className="p-6 bg-gray-800 rounded-lg text-center shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <img src="/quill-placeholder.png" alt="Quill" className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Solana Speed</h3>
            <p>Low fees (0.005 SOL), instant mints, built for billions.</p>
          </motion.div>
        </div>
      </section>

      {/* Mock Story Preview */}
      <section className="py-16 px-4 bg-[#1A1A2E]">
        <h2 className="text-3xl font-bold text-center mb-12 text-[#9945FF]">Sneak Peek</h2>
        <motion.div
          className="max-w-3xl mx-auto p-6 bg-gray-800 rounded-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-xl font-bold mb-4">Chapter 1: Stakehaven</h3>
          <p className="text-lg mb-4">
            In the neon-lit realm of Stakehaven, Valora’s chain pulsed with ancient code, binding the saga’s fate...
          </p>
          <motion.button
            className="px-6 py-3 bg-[#9945FF] rounded-lg hover:bg-[#00D1FF]"
            whileHover={{ scale: 1.05 }}
          >
            Read More (0.05 SOL)
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center bg-[#1A1A2E]">
        <p className="mb-4">
          Join the saga: <a href="https://x.com/storyweaver" className="text-[#00D1FF] hover:underline">X</a> |{' '}
          <a href="https://discord.gg/storyweaver" className="text-[#00D1FF] hover:underline">Discord</a>
        </p>
        <p>Built for #SolanaBreakout by FictionFi</p>
      </footer>
    </div>
  );
}