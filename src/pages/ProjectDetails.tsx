import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useParams, Link } from 'react-router-dom';
import { storeAPI, Project, getMediaUrl } from '../services/api';
import { useCurrency } from '../context/CurrencyContext';
import { ShoppingCart, ExternalLink, ArrowLeft, CheckCircle2, Package, Layers, Heart, FileText, Share2, ShieldCheck, Zap, Youtube, Image as ImageIcon, Sparkles } from 'lucide-react';
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
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                    <p className="text-slate-400 animate-pulse">Loading Project...</p>
                </div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-white">
                <div className="p-8 rounded-3xl bg-white/5 border border-white/10 text-center max-w-md">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Zap size={32} className="text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Project Not Found</h2>
                    <p className="text-slate-400 mb-8">{error}</p>
                    <Link to="/projects" className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all flex items-center justify-center gap-2">
                        <ArrowLeft size={18} /> Back to Projects
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] text-white overflow-x-hidden selection:bg-blue-500/30">
            {/* Background Atmosphere - Optimized for Performance */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[80px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[80px]" />
            </div>

            {/* Navigation / Breadcrumb */}
            <div className="sticky top-0 z-50 bg-[#020617]/80 backdrop-blur-md border-b border-white/5 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link
                        to="/projects"
                        className="group flex items-center gap-3 text-sm font-medium text-slate-400 hover:text-white transition-colors"
                    >
                        <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 group-hover:border-white/20 transition-all">
                            <ArrowLeft size={16} />
                        </div>
                        <span>Back to Projects</span>
                    </Link>

                    <div className="flex items-center gap-3">
                        <button className="p-2.5 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-95">
                            <Share2 size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <main className="relative z-10 pb-20">

                {/* TOP SECTION: Split Grid */}
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

                        {/* LEFT: Large Images & Description (7 Cols) */}
                        <div className="lg:col-span-7 space-y-10">
                            {/* Main Image Gallery */}
                            <div className="space-y-6">
                                <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#0f172a] group">
                                    {/* Badges */}
                                    <div className="absolute top-6 left-6 z-20 flex flex-col gap-3 pointer-events-none">
                                        {project.discount_percentage > 0 && (
                                            <div className="flex items-center gap-2 px-4 py-2 bg-red-500/90 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg shadow-red-500/20">
                                                <Zap size={14} className="fill-white" />
                                                Save {project.discount_percentage}%
                                            </div>
                                        )}
                                        {project.featured && (
                                            <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/90 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg shadow-amber-500/20">
                                                <Heart size={14} className="fill-white" />
                                                Featured
                                            </div>
                                        )}
                                    </div>

                                    {activeImage ? (
                                        <img
                                            src={getMediaUrl(activeImage) || ''}
                                            alt={project.title}
                                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                            loading="eager"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-slate-600 bg-slate-900/50">
                                            <ImageIcon size={64} className="opacity-50" />
                                        </div>
                                    )}
                                </div>

                                {/* Thumbnails */}
                                {project.images && project.images.length > 1 && (
                                    <div className="grid grid-cols-5 gap-3">
                                        {project.images.map((img) => (
                                            <button
                                                key={img.id}
                                                onClick={() => setActiveImage(img.image)}
                                                className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${activeImage === img.image
                                                        ? 'border-blue-500 shadow-lg shadow-blue-500/20 opacity-100 ring-2 ring-blue-500/20'
                                                        : 'border-transparent opacity-60 hover:opacity-100 hover:border-white/20'
                                                    }`}
                                            >
                                                <img src={getMediaUrl(img.image) || ''} alt="" className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Description (Text Only) */}
                            <div className="prose prose-lg prose-invert text-slate-300 leading-relaxed font-light max-w-none">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                                    <Sparkles className="text-yellow-400" size={20} /> About this Project
                                </h3>
                                <p className="whitespace-pre-line">{project.description}</p>
                            </div>
                        </div>

                        {/* RIGHT: Sticky Purchase & Info (5 Cols) */}
                        <div className="lg:col-span-5 space-y-8 sticky top-28">
                            {/* Header Info */}
                            <div>
                                <div className="flex flex-wrap gap-3 mb-6">
                                    <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-500/20">
                                        {project.category.name}
                                    </span>
                                    <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-bold border border-emerald-500/20 flex items-center gap-1">
                                        <ShieldCheck size={12} /> Verified & Secure
                                    </div>
                                </div>

                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-[1.1] tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
                                    {project.title}
                                </h1>

                                {/* Tech Pills */}
                                {project.technologies.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-8">
                                        {project.technologies.map((tech) => (
                                            <div key={tech.id} className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.03] rounded-lg border border-white/10 text-xs font-medium text-slate-300">
                                                {tech.icon && <img src={tech.icon} alt="" className="w-4 h-4 object-contain opacity-80" />}
                                                {tech.name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Purchase Card - Optimized Blur */}
                            <div className="p-1 rounded-[2.5rem] bg-gradient-to-br from-white/10 via-white/5 to-transparent shadow-2xl">
                                <div className="bg-[#0b1121]/95 rounded-[2.2rem] p-8 relative overflow-hidden backdrop-blur-sm">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px] pointer-events-none -translate-y-1/2 translate-x-1/2" />

                                    <div className="relative z-10">
                                        <div className="flex items-baseline gap-3 mb-2">
                                            <span className="text-5xl font-bold text-white tracking-tight">
                                                {formatPrice(
                                                    project.price_inr * (1 - project.discount_percentage / 100),
                                                    project.price_usd * (1 - project.discount_percentage / 100)
                                                )}
                                            </span>
                                            {project.discount_percentage > 0 && (
                                                <span className="text-lg text-slate-500 line-through decoration-slate-500/50">
                                                    {formatPrice(project.price_inr, project.price_usd)}
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-sm text-slate-400 mb-8 font-medium">One-time payment. Lifetime access.</p>

                                        <div className="space-y-4">
                                            <button
                                                onClick={() => addToCart(project.id)}
                                                className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-xl shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 transform hover:scale-[1.02] active:scale-[0.98] transition-all group"
                                            >
                                                <ShoppingCart size={22} className="group-hover:fill-white/20 transition-all" />
                                                Add to Cart
                                            </button>

                                            <div className="grid grid-cols-2 gap-4">
                                                {project.demo_link && (
                                                    <a
                                                        href={project.demo_link}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-semibold border border-white/10 hover:border-white/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                                                    >
                                                        <ExternalLink size={18} /> Preview
                                                    </a>
                                                )}
                                                {project.readme_file && (
                                                    <button
                                                        onClick={() => setIsReadmeOpen(true)}
                                                        className="py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-semibold border border-white/10 hover:border-white/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                                                    >
                                                        <FileText size={18} /> Details
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Metadata */}
                                        <div className="mt-8 pt-6 border-t border-white/5 space-y-3">
                                            <div className="flex justify-between items-center text-sm group">
                                                <span className="text-slate-500 group-hover:text-slate-400 transition-colors">License</span>
                                                <span className="text-slate-200 font-medium">{project.license_type}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm group">
                                                <span className="text-slate-500 group-hover:text-slate-400 transition-colors">Version</span>
                                                <span className="font-mono text-slate-200 bg-white/5 px-2 py-0.5 rounded text-xs">{project.version}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm group">
                                                <span className="text-slate-500 group-hover:text-slate-400 transition-colors">Last Updated</span>
                                                <span className="text-slate-200 font-medium">
                                                    {(new Date(project.updated_at || project.created_at)).toLocaleDateString(undefined, {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* FULL WIDTH SECTION: Darker Background Band */}
                <div className="relative border-t border-white/5 bg-[#050b1d]">
                    {/* Decorative Elements - Reduced Opacity */}
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-50" />


                    {/* 1. FEATURES GRID */}
                    {project.features && project.features.length > 0 && (
                        <div className="max-w-7xl mx-auto px-6 py-20 border-b border-white/5">
                            <div className="flex flex-col items-center text-center mb-16">
                                <span className="px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-bold uppercase tracking-wider border border-indigo-500/20 mb-4">
                                    Capabilities
                                </span>
                                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                                    Everything You Need
                                </h2>
                                <p className="text-slate-400 max-w-2xl text-lg">
                                    Built with scalability and performance in mind. Explore the powerful features that make this project stand out.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {project.features.map((feature, idx) => (
                                    <div
                                        key={feature.id}
                                        className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-colors group"
                                    >
                                        <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                            <CheckCircle2 size={24} className="text-blue-400" />
                                        </div>
                                        <h4 className="text-xl font-bold text-white mb-3 group-hover:text-blue-200 transition-colors">{feature.title}</h4>
                                        <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 2. VIDEO CINEMATIC */}
                    {project.demo_video_url && (
                        <div className="max-w-7xl mx-auto px-6 py-20 border-b border-white/5">
                            <div className="flex flex-col items-center text-center mb-12">
                                <span className="px-4 py-1.5 rounded-full bg-red-500/10 text-red-500 text-sm font-bold uppercase tracking-wider border border-red-500/20 mb-4">
                                    Demo
                                </span>
                                <h2 className="text-3xl md:text-5xl font-bold text-white">
                                    See it in Action
                                </h2>
                            </div>

                            <div className="relative w-full aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black/40 group">
                                <iframe
                                    src={project.demo_video_url}
                                    title="Project Demo"
                                    className="w-full h-full"
                                    loading="lazy"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        </div>
                    )}

                    {/* 3. REVIEWS */}
                    <div className="max-w-7xl mx-auto px-6 py-20">
                        <div className="flex flex-col items-center text-center mb-12">
                            <div className="flex items-center gap-2 text-yellow-500 mb-4">
                                {[...Array(5)].map((_, i) => <Sparkles key={i} size={20} className={i < 4 ? "fill-yellow-500" : "fill-transparent"} />)}
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold text-white">
                                Customer Feedback
                            </h2>
                        </div>
                        <ReviewSection modelType="project" objectId={project.id} />
                    </div>

                </div>

            </main>

            <ReadmeModal
                isOpen={isReadmeOpen}
                onClose={() => setIsReadmeOpen(false)}
                readmeUrl={project.readme_file || null}
                title={project.title}
            />
        </div>
    );
}
