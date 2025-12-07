import { useState, useEffect } from 'react';
import { ArrowUpRight, Palette, Layout } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { storeAPI, Design, getMediaUrl } from '../services/api';

const gradients = [
  "from-pink-500 to-rose-500",
  "from-blue-500 to-cyan-500",
  "from-violet-500 to-purple-500",
  "from-emerald-500 to-teal-500"
];

export default function DesignsSection() {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        const response = await storeAPI.getDesigns();
        const data = Array.isArray(response.data) ? response.data : response.data.results || [];
        setDesigns(data.slice(0, 4));
      } catch (err) {
        console.error("Failed to fetch designs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDesigns();
  }, []);

  if (loading) return null;

  return (
    <section id="designs" className="py-24 relative bg-[#020617] overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="p-2 rounded-lg bg-pink-500/10 text-pink-500">
                <Palette size={20} />
              </span>
              <span className="text-pink-500 font-semibold tracking-wide uppercase text-sm">UI/UX masterpieces</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Stunning <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">Visual Experiences</span>
            </h2>
            <p className="text-slate-400 text-lg">
              Hand-crafted user interfaces that blend aesthetics with functionality.
              Browse our gallery of modern design systems and layouts.
            </p>
          </div>

          <Link
            to="/designs"
            className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-semibold hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-2 w-fit h-fit"
          >
            Explore Gallery <Layout size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {designs.map((design, idx) => (
            <Link to={`/designs/${design.slug}`} key={design.id} className="block">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer"
              >
                <img
                  src={getMediaUrl(design.image)}
                  alt={design.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                {/* Hover Overlay with Color */}
                <div className={`absolute inset-0 bg-gradient-to-br ${gradients[idx % gradients.length]} opacity-0 group-hover:opacity-20 transition-opacity duration-300 mix-blend-overlay`} />

                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-xs font-bold text-white/80 uppercase tracking-wider mb-2 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                    {design.category}
                  </span>
                  <h3 className="text-xl font-bold text-white mb-2">{design.title}</h3>
                  <div className="w-full h-px bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                  <div className="flex items-center justify-between mt-4 opacity-0 group-hover:opacity-100 transition-opacity delay-200">
                    <span className="text-sm text-white/80 hover:text-white transition-colors">View Case Study</span>
                    <div className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white">
                      <ArrowUpRight size={16} />
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
