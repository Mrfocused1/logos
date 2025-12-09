import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { menuService, MenuLink } from '../services/menuService';
import { Squares } from '../components/ui';

const MenuPage: React.FC = () => {
  const [links, setLinks] = useState<MenuLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = async () => {
    try {
      setLoading(true);
      const data = await menuService.getActiveLinks();
      setLinks(data);
    } catch (err) {
      console.error('Error loading links:', err);
      setError('Failed to load links');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    },
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 relative overflow-hidden flex flex-col">
      {/* Animated Grid Background */}
      <div className="fixed inset-0 z-0">
        <Squares
          direction="diagonal"
          speed={0.3}
          borderColor="rgba(0, 0, 0, 0.015)"
          squareSize={25}
          hoverFillColor="rgba(0, 0, 0, 0.008)"
        />
      </div>

      {/* Header - Fixed at top */}
      <header className="relative z-10 w-full py-6 px-4 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-3xl sm:text-4xl font-bold font-heading text-black mb-1">
            Website Samples Below
          </h1>
          <p className="text-gray-600 text-base">Inspiring Visual Storytelling</p>
        </motion.div>
      </header>

      {/* Main Content - Grows to fill space */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8">
        {/* Links Container */}
        <motion.div
          className="w-full max-w-md space-y-4"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading links...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">{error}</p>
            </div>
          ) : links.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No links available</p>
            </div>
          ) : (
            links.map((link) => (
              <motion.a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="block w-full p-4 bg-white border-2 border-black rounded-xl text-center font-semibold text-black hover:bg-black hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg group"
              >
                <span className="flex items-center justify-center gap-2">
                  {link.title}
                  <ExternalLink size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </span>
              </motion.a>
            ))
          )}
        </motion.div>
      </main>

      {/* Footer - Pinned to bottom */}
      <footer className="relative z-10 w-full py-4 px-4 border-t border-gray-100 bg-white/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center"
        >
          <p className="text-sm text-gray-500">
            © 2025 BOLA LOGOS. All rights reserved.
          </p>
        </motion.div>
      </footer>
    </div>
  );
};

export default MenuPage;
