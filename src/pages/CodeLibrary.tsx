import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Loader2, Code2 } from 'lucide-react';
import { codeLibraryAPI, CodeCategory, CodeComponent } from '../services/api';
import CodeCard from '../components/CodeCard';
import CodeViewer from '../components/CodeViewer';

export default function CodeLibrary() {
    const [categories, setCategories] = useState<CodeCategory[]>([]);
    const [components, setComponents] = useState<CodeComponent[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewingComponent, setViewingComponent] = useState<CodeComponent | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [catsRes, compsRes] = await Promise.all([
                    codeLibraryAPI.getCategories(),
                    codeLibraryAPI.getComponents()
                ]);
                setCategories(Array.isArray(catsRes.data) ? catsRes.data : (catsRes.data as any).results || []);
                setComponents(Array.isArray(compsRes.data) ? compsRes.data : (compsRes.data as any).results || []);
            } catch (error) {
                console.error("Failed to load library:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredComponents = components.filter(comp => {
        const matchesCategory = selectedCategory === 'all' || comp.category.slug === selectedCategory;
        const matchesSearch = comp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            comp.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen pt-24 pb-12 bg-[#020617] relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 border border-primary/20"
                    >
                        <Code2 size={20} />
                        <span className="font-semibold text-sm uppercase tracking-wide">Developer Resources</span>
                    </motion.div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        UI Code <span className="text-primary">Library</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        A curated collection of beautiful, reusable UI components.
                        Copy paste ready HTML & CSS for your next project.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Filters */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-[#0f172a]/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6 sticky top-24">
                            <div className="relative mb-6">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search components..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-slate-600 focus:border-primary/50 focus:outline-none transition-all"
                                />
                            </div>

                            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                                <Filter size={18} className="text-primary" /> Categories
                            </h3>
                            <div className="space-y-2">
                                <button
                                    onClick={() => setSelectedCategory('all')}
                                    className={`w-full text-left px-4 py-3 rounded-xl transition-all ${selectedCategory === 'all'
                                        ? 'bg-primary text-white font-medium shadow-lg shadow-primary/20'
                                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    All Components
                                </button>
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.slug)}
                                        className={`w-full text-left px-4 py-3 rounded-xl transition-all ${selectedCategory === cat.slug
                                            ? 'bg-primary text-white font-medium shadow-lg shadow-primary/20'
                                            : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                            }`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Grid */}
                    <div className="lg:col-span-3">
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <Loader2 size={40} className="text-primary animate-spin" />
                            </div>
                        ) : filteredComponents.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredComponents.map(comp => (
                                    <CodeCard
                                        key={comp.id}
                                        component={comp}
                                        onView={setViewingComponent}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-[#0f172a]/30 rounded-3xl border border-white/5">
                                <Code2 size={48} className="mx-auto text-slate-600 mb-4" />
                                <h3 className="text-xl font-semibold text-white mb-2">No components found</h3>
                                <p className="text-slate-400">Try adjusting your search or filters</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Viewer Modal */}
            <CodeViewer
                component={viewingComponent}
                onClose={() => setViewingComponent(null)}
            />
        </div>
    );
}
