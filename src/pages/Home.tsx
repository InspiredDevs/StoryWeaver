import { motion } from 'framer-motion';
import { usePrivy } from '@privy-io/react-auth';
import { Link } from 'react-router-dom'; // Add react-router-dom later

export default function Home() {
  const { user, logout } = usePrivy();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 bg-[#1A1A2E]">
        <h1 className="text-2xl font-bold text-[#9945FF]">StoryWeaver</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm">{user?.wallet?.address?.slice(0, 6)}...</span>
          <button className="px-4 py-2 bg-[#00D1FF] rounded hover:bg-[#9945FF]" onClick={logout}>
            Disconnect
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center h-[50vh] text-center px-4">
        <motion.h2
          className="text-3xl sm:text-5xl font-bold mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Your Stories, Your NFTs
        </motion.h2>
        <Link to="/editor">
          <motion.button
            className="px-6 py-3 bg-[#9945FF] rounded-lg hover:bg-[#00D1FF] text-lg font-semibold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Write Now
          </motion.button>
        </Link>
      </section>

      {/* Top Stories Carousel (Mock) */}
      <section className="py-12 px-4">
        <h3 className="text-2xl font-bold mb-6 text-center">Top Stories</h3>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="min-w-[250px] p-4 bg-gray-800 rounded-lg"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img src="/quill-placeholder.png" alt="Quill" className="w-full h-32 object-cover rounded mb-2" />
              <h4 className="font-bold">Chapter {i}: Stakehaven</h4>
              <p className="text-sm">Fantasy epic, 0.05 SOL</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 px-4 text-center">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link to="/editor" className="p-4 bg-[#9945FF] rounded hover:bg-[#00D1FF]">Write Story</Link>
          <Link to="/mint" className="p-4 bg-[#9945FF] rounded hover:bg-[#00D1FF]">Mint NFT</Link>
          <Link to="/reader" className="p-4 bg-[#9945FF] rounded hover:bg-[#00D1FF]">Read Stories</Link>
        </div>
      </section>
    </div>
  );
}