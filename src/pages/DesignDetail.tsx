import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Star, Download, ArrowLeft, FileJson, Palette, Eye, Share2, Heart, Zap } from 'lucide-react';
import { Design } from '../services/api';
import { storeAPI, getMediaUrl } from '../services/api';
import ReviewSection from '../components/Reviews/ReviewSection';
import { motion } from 'framer-motion';

export default function DesignDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [design, setDesign] = useState<Design | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchDesign = async () => {
      if (!slug) return;
      try {
        const response = await storeAPI.getDesignBySlug(slug);
        setDesign(response.data);
        const d = response.data;
        const initialImage = d.images?.find((img: any) => img.is_thumbnail)?.image || d.images?.[0]?.image || d.image;
        setActiveImage(initialImage || '');
      } catch (error) {
        console.error("Failed to fetch design", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDesign();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0a14] flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-pink-500/20 border-t-pink-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Palette size={20} className="text-pink-500 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!design) return null;

  return (
    <div className="min-h-screen bg-[#0f0a14] text-white pt-24 pb-20 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-pink-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-rose-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Navigation */}
        <nav className="flex items-center justify-between mb-12">
          <button
            onClick={() => navigate('/designs')}
            className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:border-pink-500/50 transition-colors">
              <ArrowLeft size={18} />
            </div>
            <span className="font-medium">Back to Gallery</span>
          </button>
          <div className="flex items-center gap-3">
            <button className="p-2.5 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all">
              <Share2 size={18} />
            </button>
            <button className="p-2.5 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-pink-400 hover:border-pink-500/30 hover:bg-pink-500/10 transition-all">
              <Heart size={18} />
            </button>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Center Visuals (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative rounded-3xl overflow-hidden shadow-2xl bg-[#1a1025] border border-white/5 group"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0a14] via-transparent to-transparent opacity-60 z-10" />

              <img
                src={getMediaUrl(activeImage || undefined)}
                alt={design.title}
                className="w-full h-auto object-cover min-h-[500px]"
              />

              {/* Image Overlay Controls could go here */}
              <div className="absolute bottom-6 right-6 z-20">
                <button className="p-3 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-black/70 transition-colors border border-white/10">
                  <Eye size={20} />
                </button>
              </div>
            </motion.div>

            {/* Gallery Thumbnails */}
            {design.images && design.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-4">
                {design.images.map((img: any) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImage(img.image)}
                    className={`relative w-24 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${activeImage === img.image ? 'border-pink-500 scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  >
                    <img src={getMediaUrl(img.image)} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Additional Images / Gallery Grid if existing (Mockup for now as Design model usually has one main image, but good for future proofing) */}
            <div className="p-8 rounded-3xl bg-[#1a1025]/50 border border-white/5 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Palette className="text-pink-400" size={22} /> Design Context
              </h3>
              <div className="prose prose-invert prose-pink max-w-none text-slate-300 leading-relaxed whitespace-pre-line">
                {design.description}
              </div>
            </div>

            <div className="pt-8 border-t border-white/10">
              <ReviewSection modelType="design" objectId={design.id} />
            </div>
          </div>

          {/* Right Sidebar Info (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-24 space-y-6">

              {/* Main Info */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-pink-500/10 text-pink-400 rounded-full text-xs font-bold uppercase border border-pink-500/20">
                    {typeof design.category === 'object' ? (design.category as any).name : design.category}
                  </span>
                  <span className="px-3 py-1 bg-white/5 text-slate-300 rounded-full text-xs font-bold border border-white/10 flex items-center gap-1">
                    <Zap size={12} className="text-yellow-400" /> {design.tool}
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                  {design.title}
                </h1>

                <div className="flex items-center gap-2 mb-8">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className={i < Math.floor(design.rating) ? 'fill-pink-500 text-pink-500' : 'text-slate-700 fill-slate-800'}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-bold text-white">{design.rating}</span>
                  <span className="text-sm text-slate-500 ml-1">(Rating)</span>
                </div>
              </div>

              {/* Download Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-pink-500/10 to-rose-500/5 border border-pink-500/20">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-white">Source Files</h3>
                  <FileJson className="text-pink-400" size={24} />
                </div>
                <p className="text-sm text-pink-200/60 mb-6">
                  Includes fully editable .fig/.xd files and assets.
                </p>

                {design.file ? (
                  <a
                    href={getMediaUrl(design.file)}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 shadow-lg shadow-pink-500/25 hover:scale-[1.02] transition-all duration-300"
                  >
                    <Download size={20} />
                    Download Now
                  </a>
                ) : (
                  <button disabled className="w-full py-4 rounded-xl font-bold text-slate-500 bg-black/20 cursor-not-allowed border border-white/5">
                    Download Unavailable
                  </button>
                )}
                <p className="text-xs text-center text-pink-500/40 mt-3 font-medium">
                  Free for personal & commercial use
                </p>
              </div>

              {/* Artist/Meta Info */}
              <div className="p-6 rounded-3xl bg-[#1a1025] border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-500 to-orange-500 p-[2px]">
                    <div className="w-full h-full rounded-full bg-[#1a1025] flex items-center justify-center">
                      <span className="font-bold text-white">NW</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Nova Works</h4>
                    <p className="text-xs text-slate-400">Official Design Team</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
