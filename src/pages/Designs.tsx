import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowUpRight, Layers } from 'lucide-react';
import { Design, storeAPI, getMediaUrl } from '../services/api';
import { Link } from 'react-router-dom';

const categories = ['All', 'Dashboard', 'Mobile', 'Web', 'E-Commerce'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function Designs() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDesigns = async () => {
      setLoading(true);
      try {
        const response = await storeAPI.getDesigns({
          search: searchQuery,
          category: activeCategory !== 'All' ? activeCategory : undefined
        });
        const data = response.data.results || response.data;
        setDesigns(data);
      } catch (error) {
        console.error("Failed to fetch designs", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDesigns();
  }, [activeCategory, searchQuery]);

  // Enhanced Bento Grid Logic
  const getGridClass = (index: number) => {
    // A repeating pattern for visual interest
    const patternIndex = index % 10;
    if (patternIndex === 0) return 'md:col-span-2 md:row-span-2'; // Large Hero
    if (patternIndex === 5) return 'md:col-span-2'; // Wide
    if (patternIndex === 6) return 'md:row-span-2'; // Tall
    return 'col-span-1 row-span-1';
  };

  return (
    <div className="min-h-screen bg-[#0f0a14] pt-24 pb-24 relative overflow-x-hidden text-white">
      {/* Dynamic Backgrounds */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-rose-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1600px] mx-auto px-4 md:px-6 relative z-10">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="flex items-center gap-2 text-pink-500 mb-4 font-bold tracking-wider text-sm uppercase">
              <Layers size={16} /> Curated Inspiration
            </div>
            <h1 className="text-4xl md:text-8xl font-black font-display tracking-tighter leading-none mb-6">
              <span className="text-white">Design</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-400">.Vault</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl font-light leading-relaxed">
              Explore our gallery of pixel-perfect interfaces, UI kits, and immersive design systems.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col gap-6 w-full md:w-auto"
          >
            {/* Search Bar */}
            <div className="relative group w-full md:w-[400px]">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-orange-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <div className="relative bg-[#1a1025] border border-white/10 rounded-2xl flex items-center p-1 shadow-xl">
                <Search className="w-5 h-5 text-pink-400 ml-4" />
                <input
                  type="text"
                  placeholder="Find inspiration..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-white px-4 py-3 w-full placeholder:text-slate-500 font-medium"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-xl text-sm font-bold transition-all border ${activeCategory === cat
                    ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white border-transparent shadow-lg shadow-pink-500/25'
                    : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bento Grid Layout */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[400px]">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className={`rounded-3xl bg-[#1a1025] animate-pulse border border-white/5 ${getGridClass(i)} min-h-[250px]`} />
            ))}
          </div>
        ) : (
          <AnimatePresence mode='wait'>
            <motion.div
              key={activeCategory + searchQuery}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-[300px] gap-6"
            >
              {designs.map((design, idx) => (
                <Link
                  to={`/designs/${design.slug}`}
                  key={design.id}
                  className={`group relative rounded-3xl overflow-hidden border border-white/5 bg-[#1a1025] transition-all duration-500 hover:z-10 hover:shadow-[0_0_50px_rgba(236,72,153,0.3)] ${getGridClass(idx)}`}
                >
                  <motion.div variants={itemVariants} className="h-full w-full">

                    {/* Image Background */}
                    <div className="absolute inset-0 z-0">
                      <img
                        src={getMediaUrl(
                          design.images?.find((img: any) => img.is_thumbnail)?.image ||
                          design.images?.[0]?.image ||
                          design.image
                        )}
                        alt={design.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0f0a14] via-[#0f0a14]/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute inset-0 z-10 p-8 flex flex-col justify-between">
                      {/* Top Badge */}
                      <div className="flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -translate-y-4 group-hover:translate-y-0">
                        <span className="px-3 py-1 rounded-lg bg-pink-500 text-white text-xs font-bold shadow-lg shadow-pink-500/20">
                          {typeof design.category === 'object' ? (design.category as any).name : design.category}
                        </span>
                        <div className="p-2 bg-white/10 rounded-full backdrop-blur-md">
                          <ArrowUpRight size={18} className="text-white" />
                        </div>
                      </div>

                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight group-hover:text-pink-300 transition-colors">
                          {design.title}
                        </h3>

                        <p className="text-pink-200/60 text-sm mb-4 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">
                          {design.description}
                        </p>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < Math.floor(design.rating) ? 'bg-pink-500' : 'bg-slate-700'}`} />
                          ))}
                          <span className="text-xs text-white font-bold ml-2">{design.rating}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
