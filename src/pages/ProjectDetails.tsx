import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useParams, Link } from 'react-router-dom';
import { storeAPI, Project, getMediaUrl } from '../services/api';
import { useCurrency } from '../context/CurrencyContext';
import { ShoppingCart, ExternalLink, ArrowLeft, CheckCircle2, Package, Layers, Heart, FileText, Share2, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import ReviewSection from '../components/Reviews/ReviewSection';
import ReadmeModal from '../components/ReadmeModal';

export default function ProjectDetails() {
    const { slug } = useParams<{ slug: string }>();
    const { addToCart } = useCart();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeImage, setActiveImage] = useState<string | null>(null);
    const [isReadmeOpen, setIsReadmeOpen] = useState(false);
    const { formatPrice } = useCurrency();

    useEffect(() => {
        const fetchProject = async () => {
            try {
                if (!slug) return;
                const res = await storeAPI.getProjectBySlug(slug);
                setProject(res.data);
                if (res.data.images && res.data.images.length > 0) {
                    const thumb = res.data.images.find(img => img.is_thumbnail);
                    setActiveImage(thumb ? thumb.image : res.data.images[0].image);
                }
            } catch (err) {
                setError('Project not found or failed to load.');
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Zap size={20} className="text-blue-500 animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-white">
                <h2 className="text-3xl font-bold mb-4 text-red-500">Error Loading Project</h2>
                <p className="text-slate-400 mb-8">{error}</p>
                <Link to="/projects" className="px-8 py-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition flex items-center gap-2">
                    <ArrowLeft size={18} /> Back to Projects
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] text-white pt-24 pb-20 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Navigation Bar */}
                <nav className="flex items-center justify-between mb-12">
                    <Link to="/projects" className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                        <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:border-blue-500/50 transition-colors">
                            <ArrowLeft size={18} />
                        </div>
                        <span className="font-medium">Back to Projects</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <button className="p-2.5 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                            <Share2 size={18} />
                        </button>
                        <button className="p-2.5 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10 transition-all">
                            <Heart size={18} />
                        </button>
                    </div>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* LEFT COLUMN: Images (7 cols) */}
                    <div className="lg:col-span-7 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative h-[400px] sm:h-[500px] lg:h-[700px] w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#0f172a]"
                        >
                            {/* Tags Overlay */}
                            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                                {project.discount_percentage > 0 && (
                                    <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg shadow-red-500/20">
                                        -{project.discount_percentage}% SAVE
                                    </span>
                                )}
                                {project.featured && (
                                    <span className="px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full shadow-lg shadow-amber-500/20 flex items-center gap-1">
                                        <Heart size={10} className="fill-white" /> BESTSELLER
                                    </span>
                                )}
                            </div>

                            {activeImage ? (
                                <img
                                    src={getMediaUrl(activeImage) || ''}
                                    alt={project.title}
                                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-slate-600 bg-slate-900/50">
                                    No Preview Available
                                </div>
                            )}
                        </motion.div>

                        {/* Thumbnails */}
                        {project.images && project.images.length > 1 && (
                            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                                {project.images.map((img) => (
                                    <button
                                        key={img.id}
                                        onClick={() => setActiveImage(img.image)}
                                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${activeImage === img.image
                                            ? 'border-blue-500 shadow-lg shadow-blue-500/20 opacity-100'
                                            : 'border-transparent opacity-50 hover:opacity-100 ring-1 ring-white/10'
                                            }`}
                                    >
                                        <img src={getMediaUrl(img.image) || ''} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Description Section */}
                        <div className="mt-10 p-8 rounded-3xl bg-[#0f172a]/50 border border-white/5 backdrop-blur-sm">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Package className="text-blue-400" size={22} /> Project Overview
                            </h3>
                            <div className="prose prose-invert prose-slate max-w-none text-slate-300 leading-relaxed whitespace-pre-line">
                                {project.description}
                            </div>
                        </div>

                        {/* Features Grid */}
                        {project.features && project.features.length > 0 && (
                            <div className="mt-8">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <Layers className="text-indigo-400" size={22} /> Key Features
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {project.features.map(feature => (
                                        <div key={feature.id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors">
                                            <div className="flex items-start gap-3">
                                                <CheckCircle2 className="text-blue-500 mt-1 shrink-0" size={18} />
                                                <div>
                                                    <h4 className="font-semibold text-white text-sm">{feature.title}</h4>
                                                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{feature.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Reviews */}
                        <div className="mt-12 pt-12 border-t border-white/10">
                            <ReviewSection modelType="project" objectId={project.id} />
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Sticky Info (5 cols) */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="sticky top-24">
                            {/* Main Info Card */}
                            <div className="p-8 rounded-3xl bg-[#0b1121] border border-white/10 shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-600/20 transition-all duration-700" />

                                <div className="relative z-10">
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-bold uppercase border border-blue-500/20">
                                            {project.category.name}
                                        </span>
                                        <span className="px-3 py-1 bg-white/5 text-slate-300 rounded-full text-xs font-bold border border-white/10 flex items-center gap-1">
                                            <ShieldCheck size={12} className="text-green-400" /> Verified
                                        </span>
                                    </div>

                                    <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight">
                                        {project.title}
                                    </h1>

                                    <div className="flex items-end gap-3 mb-8">
                                        <span className="text-5xl font-bold text-white tracking-tight">
                                            {formatPrice(
                                                project.price_inr * (1 - project.discount_percentage / 100),
                                                project.price_usd * (1 - project.discount_percentage / 100)
                                            )}
                                        </span>
                                        {project.discount_percentage > 0 && (
                                            <div className="mb-2">
                                                <span className="text-lg text-slate-500 line-through">
                                                    {formatPrice(project.price_inr, project.price_usd)}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <button
                                            onClick={() => addToCart(project.id)}
                                            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transform active:scale-[0.98] transition-all"
                                        >
                                            <ShoppingCart size={20} /> Add to Cart
                                        </button>

                                        <div className="grid grid-cols-2 gap-3">
                                            {project.demo_link && (
                                                <a
                                                    href={project.demo_link}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium border border-white/10 flex items-center justify-center gap-2 transition-colors"
                                                >
                                                    <ExternalLink size={18} /> Live Demo
                                                </a>
                                            )}
                                            {project.readme_file && (
                                                <button
                                                    onClick={() => setIsReadmeOpen(true)}
                                                    className="py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium border border-white/10 flex items-center justify-center gap-2 transition-colors"
                                                >
                                                    <FileText size={18} /> Infos
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Specs Card */}
                            <div className="mt-6 p-6 rounded-3xl bg-[#0f172a]/50 border border-white/5">
                                <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Tech Stack & Specs</h4>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {project.technologies.map((tech) => (
                                        <div key={tech.id} className="flex items-center gap-2 px-3 py-1.5 bg-[#0b1121] rounded-lg border border-white/10 text-xs font-medium text-slate-300">
                                            {tech.icon && <img src={tech.icon} alt="" className="w-3.5 h-3.5 object-contain opacity-70" />}
                                            {tech.name}
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-3 pt-4 border-t border-white/5">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Version</span>
                                        <span className="text-white font-mono">{project.version}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">License</span>
                                        <span className="text-white">{project.license_type}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Last Updated</span>
                                        <span className="text-white">{(new Date(project.updated_at || project.created_at)).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Tags */}
                            {project.tags && project.tags.length > 0 && (
                                <div className="mt-6 flex flex-wrap gap-2">
                                    {project.tags.map(tag => (
                                        <span key={tag.id} className="text-xs text-slate-500 hover:text-blue-400 transition-colors cursor-pointer">
                                            #{tag.name}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <ReadmeModal
                isOpen={isReadmeOpen}
                onClose={() => setIsReadmeOpen(false)}
                readmeUrl={project.readme_file || null}
                title={project.title}
            />
        </div>
    );
}
