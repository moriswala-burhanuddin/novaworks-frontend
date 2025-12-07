import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ArrowRight, X, Sparkles, Zap, Package, Tag } from 'lucide-react';
import { storeAPI, Project, Category, getMediaUrl } from '../services/api';
import { useCurrency } from '../context/CurrencyContext';
import { Link } from 'react-router-dom';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { formatPrice } = useCurrency();

  // Filters
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    // Reset projects when filter changes
    setProjects([]);
    setNextPage(null);
    fetchProjects(true);
  }, [activeCategory, searchQuery]);

  const fetchInitialData = async () => {
    try {
      const [catRes] = await Promise.all([
        storeAPI.getCategories(),
      ]);

      const categoriesData = catRes.data as any;
      if (Array.isArray(categoriesData)) {
        setCategories(categoriesData);
      } else if (categoriesData.results && Array.isArray(categoriesData.results)) {
        setCategories(categoriesData.results);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Failed to load initial data", error);
    }
  };

  const fetchProjects = async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const params: any = {};
      if (activeCategory !== 'all') params.category__slug = activeCategory;
      if (searchQuery) params.search = searchQuery;

      const res = await storeAPI.getProjects(params);
      setProjects(res.data.results);
      setNextPage(res.data.next);
    } catch (error) {
      console.error("Failed to fetch projects", error);
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  const loadMore = async () => {
    if (!nextPage || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      // We need to parse the page number or full URL. 
      // storeAPI.getProjects accepts params. 
      // Or we can just use axios directly if we want to follow the URL exactly, 
      // but let's stick to using the API with page param if possible, 
      // OR better yet, just extract the 'page' query param from the next URL.
      const url = new URL(nextPage);
      const page = url.searchParams.get('page');
      if (page) {
        const params: any = { page };
        if (activeCategory !== 'all') params.category__slug = activeCategory;
        if (searchQuery) params.search = searchQuery;

        const res = await storeAPI.getProjects(params);
        setProjects(prev => [...prev, ...res.data.results]);
        setNextPage(res.data.next);
      }
    } catch (error) {
      console.error("Failed to load more projects", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-24 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-blue-600/10 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-full h-[600px] bg-indigo-600/10 rounded-full blur-[120px] translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* HEADER SECTION */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-medium text-sm mb-6"
          >
            <Sparkles size={16} /> Premium Collection
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-white via-blue-100 to-slate-400 bg-clip-text text-transparent mb-8 leading-tight"
          >
            Digital Assets <br /> for <span className="text-blue-500">Builders</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-400 leading-relaxed"
          >
            Discover our curated library of high-performance applications,
            sleek templates, and powerful modules designed to accelerate your development.
          </motion.p>
        </div>

        {/* CONTROLS BAR */}
        <div className="mb-12 sticky top-24 z-40">
          <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row items-center gap-2">

            {/* Search */}
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Search projects..."
                className="w-full bg-black/20 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:bg-black/40 transition-all font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Categories */}
            <div className="hidden md:flex flex-1 items-center gap-1 overflow-x-auto scrollbar-hide px-2">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap border ${activeCategory === 'all'
                  ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/20'
                  : 'bg-transparent text-slate-400 border-transparent hover:bg-white/5 hover:text-white'
                  }`}
              >
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap border ${activeCategory === cat.slug
                    ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/20'
                    : 'bg-transparent text-slate-400 border-transparent hover:bg-white/5 hover:text-white'
                    }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Mobile Filter Toggle */}
            <button
              className="md:hidden flex items-center gap-2 px-4 py-3 bg-white/5 rounded-xl text-white font-medium w-full justify-center hover:bg-white/10 transition border border-white/5"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              {isFilterOpen ? <X size={20} /> : <Filter size={20} />}
              Filters
            </button>
          </div>

          {/* Mobile Filter Menu */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                className="md:hidden overflow-hidden bg-[#0f172a] border border-white/10 rounded-2xl"
              >
                <div className="p-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => { setActiveCategory('all'); setIsFilterOpen(false); }}
                    className={`px-4 py-2 rounded-lg text-xs font-bold border ${activeCategory === 'all' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/5 text-slate-400'}`}
                  >
                    All Matches
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => { setActiveCategory(cat.slug); setIsFilterOpen(false); }}
                      className={`px-4 py-2 rounded-lg text-xs font-bold border ${activeCategory === cat.slug ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/5 text-slate-400'}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* GRID SECTION */}
        <div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="aspect-[4/5] rounded-3xl bg-white/5 animate-pulse border border-white/5"></div>
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-32">
              <div className="inline-flex p-6 rounded-full bg-white/5 mb-6">
                <Package size={48} className="text-slate-600" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No projects found</h3>
              <p className="text-slate-500 mb-8 max-w-md mx-auto">We couldn't find any projects matching your current filters. Try adjusting your search or category.</p>
              <button
                onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <Link to={`/projects/${project.slug}`} key={project.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative bg-[#0f172a] rounded-3xl overflow-hidden border border-white/5 hover:border-blue-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 h-full flex flex-col"
                  >
                    {/* Image Container */}
                    <div className="aspect-[4/3] overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-80 z-10" />
                      <img
                        src={getMediaUrl(project.thumbnail)}
                        alt={project.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />

                      {/* Floaters */}
                      <div className="absolute top-4 left-4 z-20">
                        <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg text-xs font-bold border border-white/10 text-blue-300 flex items-center gap-1">
                          <Tag size={12} /> {project.category.name}
                        </span>
                      </div>

                      {project.featured && (
                        <div className="absolute top-4 right-4 z-20">
                          <span className="px-3 py-1 bg-yellow-500 text-black rounded-lg text-xs font-bold flex items-center gap-1 shadow-lg shadow-yellow-500/20">
                            <Zap size={12} className="fill-black" /> Featured
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1 relative z-20">
                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-1">
                        {project.title}
                      </h3>

                      <div className="flex flex-wrap gap-2 mb-4 h-6 overflow-hidden">
                        {project.technologies.slice(0, 4).map(tech => (
                          <span key={tech.id} className="text-[10px] items-center text-slate-400 flex gap-1 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                            {tech.name}
                          </span>
                        ))}
                      </div>

                      <p className="text-slate-400 text-sm mb-6 line-clamp-2 leading-relaxed flex-1">
                        {project.description}
                      </p>

                      <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
                        <div className="flex flex-col">
                          {project.discount_percentage > 0 && (
                            <span className="text-xs text-slate-500 line-through decoration-red-500/50">
                              {formatPrice(project.price_inr, project.price_usd)}
                            </span>
                          )}
                          <span className="text-xl font-bold text-white flex items-center gap-1">
                            {formatPrice(
                              project.price_inr * (1 - project.discount_percentage / 100),
                              project.price_usd * (1 - project.discount_percentage / 100)
                            )}
                            {project.discount_percentage > 0 && <span className="text-xs text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded ml-1">-{project.discount_percentage}%</span>}
                          </span>
                        </div>

                        <span className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20">
                          <ArrowRight size={20} className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Load More Button */}
        {nextPage && (
          <div className="mt-16 text-center">
            <button
              onClick={loadMore}
              disabled={isLoadingMore}
              className="px-8 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-full font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
            >
              {isLoadingMore ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Loading...
                </>
              ) : (
                'Load More Projects'
              )}
            </button>
          </div>
        )}
      </div>
    </div>

  );
}
