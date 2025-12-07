import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Search, Terminal, Code2, Zap, ArrowRight, FolderGit2 } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { MiniProject, storeAPI, getMediaUrl } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function MiniProjects() {
  const { ref, isInView } = useScrollAnimation({ threshold: 0.1 });
  const [miniProjects, setMiniProjects] = useState<MiniProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<MiniProject[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await storeAPI.getMiniProjects({
          search: searchTerm,
          category: selectedCategory !== 'All' ? selectedCategory : undefined
        });
        const data = response.data.results || response.data;
        setMiniProjects(data);
        setFilteredProjects(data);
      } catch (error) {
        console.error("Failed to fetch mini projects", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, [selectedCategory, searchTerm]);

  const categories = ['All', 'Frontend', 'Full Stack', 'Backend', 'Mobile'];

  return (
    <div className="min-h-screen bg-[#050510] font-mono text-white pt-24 pb-20 relative overflow-hidden">
      {/* Technical Grid Background */}
      <div className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: 'linear-gradient(rgba(99, 102, 241, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.5) 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Header */}
        <div className="mb-16 border-b border-indigo-500/20 pb-8 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 mb-2">
              <Terminal size={20} />
              <span className="text-sm font-bold tracking-widest uppercase">Dev_Resources</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-4">
              Mini_Projects<span className="text-indigo-500 animate-pulse">_</span>
            </h1>
            <p className="text-indigo-200/60 max-w-xl text-sm leading-relaxed">
              ./explore --type="components" --quality="high" <br />
              Access a library of production-ready code snippets and starter kits.
            </p>
          </div>

          {/* Search Box */}
          <div className="w-full md:w-96">
            <div className="relative group">
              <div className="absolute inset-0 bg-indigo-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-[#0a0a1a] border border-indigo-500/30 rounded-lg flex items-center overflow-hidden">
                <div className="px-4 py-3 bg-indigo-950/30 border-r border-indigo-500/10">
                  <Search size={18} className="text-indigo-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="grep 'project_name'..."
                  className="bg-transparent border-none outline-none text-indigo-100 px-4 py-3 w-full placeholder:text-indigo-800 text-sm font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded text-xs font-bold transition-all border ${selectedCategory === cat
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.4)]'
                  : 'bg-[#0a0a1a] text-indigo-400 border-indigo-500/20 hover:border-indigo-500/50 hover:text-white'
                }`}
            >
              {selectedCategory === cat ? '> ' : ''}{cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-[#0a0a1a] border border-indigo-500/10 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, idx) => (
              <Link
                to={`/mini-projects/${project.slug}`}
                key={project.id}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative bg-[#0a0a1a] border border-indigo-500/20 hover:border-indigo-400 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(79,70,229,0.15)] flex flex-col h-full"
                >
                  {/* Header Bar */}
                  <div className="h-8 bg-[#151525] border-b border-indigo-500/20 flex items-center px-3 justify-between">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50" />
                    </div>
                    <span className="text-[10px] text-indigo-500/50 font-sans">v1.0.0</span>
                  </div>

                  {/* Image Area */}
                  <div className="h-48 relative overflow-hidden bg-[#050510] group-hover:h-40 transition-all duration-500">
                    <img
                      src={getMediaUrl(project.image)}
                      alt={project.title}
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-indigo-900/10 mix-blend-overlay" />
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                        {project.title}
                      </h3>
                      <div className="p-1.5 bg-indigo-500/10 rounded text-indigo-400">
                        <FolderGit2 size={16} />
                      </div>
                    </div>

                    <p className="text-indigo-200/50 text-xs mb-4 line-clamp-2 leading-relaxed font-sans">
                      {project.description}
                    </p>

                    {/* Tech Tags */}
                    <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                      {project.technologies && project.technologies.slice(0, 3).map((tech: any) => (
                        <span key={tech.id || tech} className="text-[10px] px-2 py-1 bg-[#151525] border border-indigo-500/20 rounded text-indigo-300">
                          {tech.name || tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-indigo-500/10">
                      <div className="text-indigo-400 font-bold text-sm">
                        ${project.price} <span className="text-[10px] text-indigo-600 font-normal">/ license</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-indigo-500 uppercase font-bold tracking-wider group-hover:text-white transition-colors">
                        Execute <ArrowRight size={12} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
