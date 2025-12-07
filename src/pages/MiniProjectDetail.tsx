import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Star, ExternalLink, ArrowLeft, Github, Terminal, Cpu, Zap, Code2, Layers, Share2, Heart } from 'lucide-react';
import { MiniProject } from '../services/api';
import { storeAPI, getMediaUrl } from '../services/api';
import ReviewSection from '../components/Reviews/ReviewSection';
import { motion } from 'framer-motion';

export default function MiniProjectDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<MiniProject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const response = await storeAPI.getMiniProjectBySlug(slug);
        setProject(response.data);
      } catch (error) {
        console.error("Failed to fetch mini project", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050510] flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Terminal size={20} className="text-indigo-500 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="min-h-screen bg-[#050510] text-white pt-24 pb-20 relative overflow-hidden font-mono">
      {/* Tech Background Grid */}
      <div className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: 'linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Navigation */}
        <nav className="flex items-center justify-between mb-12">
          <button
            onClick={() => navigate('/mini-projects')}
            className="group flex items-center gap-2 text-indigo-400 hover:text-white transition-colors"
          >
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/30 group-hover:border-indigo-400 transition-colors">
              <ArrowLeft size={18} />
            </div>
            <span className="font-bold tracking-tight">./back_to_projects</span>
          </button>
          <div className="flex items-center gap-3">
            <button className="p-2.5 rounded-lg bg-indigo-500/5 border border-indigo-500/20 text-indigo-400 hover:text-white hover:bg-indigo-500/20 transition-all">
              <Share2 size={18} />
            </button>
            <button className="p-2.5 rounded-lg bg-indigo-500/5 border border-indigo-500/20 text-indigo-400 hover:text-pink-400 hover:border-pink-500/30 hover:bg-pink-500/10 transition-all">
              <Heart size={18} />
            </button>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Visual Column */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative rounded-xl overflow-hidden border-2 border-indigo-500/20 shadow-2xl shadow-indigo-500/10 group bg-[#0a0a1a]"
            >
              {/* Terminal Header Decoration */}
              <div className="absolute top-0 inset-x-0 h-8 bg-[#151525] border-b border-indigo-500/20 flex items-center px-4 gap-2 z-20">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                <div className="ml-2 text-[10px] text-indigo-400/50">preview.exe</div>
              </div>

              <div className="pt-8">
                <img
                  src={getMediaUrl(project.image)}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </motion.div>

            {/* Quick Tech Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-indigo-900/10 border border-indigo-500/20 flex flex-col items-center justify-center text-center">
                <Zap size={20} className="text-yellow-400 mb-2" />
                <span className="text-xs text-indigo-300 uppercase font-bold">Performance</span>
                <span className="text-lg font-bold text-white">Fast</span>
              </div>
              <div className="p-4 rounded-xl bg-indigo-900/10 border border-indigo-500/20 flex flex-col items-center justify-center text-center">
                <Cpu size={20} className="text-cyan-400 mb-2" />
                <span className="text-xs text-indigo-300 uppercase font-bold">Complexity</span>
                <span className="text-lg font-bold text-white">Mid</span>
              </div>
              <div className="p-4 rounded-xl bg-indigo-900/10 border border-indigo-500/20 flex flex-col items-center justify-center text-center">
                <Layers size={20} className="text-pink-400 mb-2" />
                <span className="text-xs text-indigo-300 uppercase font-bold">Structure</span>
                <span className="text-lg font-bold text-white">Clean</span>
              </div>
            </div>
          </div>

          {/* Info Column */}
          <div className="space-y-8">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-violet-500/10 text-violet-400 rounded-md text-xs font-bold uppercase tracking-wider border border-violet-500/20 font-sans">
                  {typeof project.category === 'object' ? (project.category as any).name : project.category}
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-green-400 bg-green-500/10 px-3 py-1 rounded-md border border-green-500/20">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Active
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight font-sans">
                <span className="text-indigo-500">{'>'}</span> {project.title}_
              </h1>

              <div className="flex items-center gap-4 mb-8">
                <div className="flex gap-1 p-2 bg-white/5 rounded-lg border border-white/5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={i < Math.floor(project.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-700'}
                    />
                  ))}
                </div>
                <span className="text-2xl font-bold text-white">{project.rating}</span>
              </div>

              <div className="p-6 rounded-xl bg-[#0f0f20] border-l-4 border-indigo-500 shadow-xl mb-8">
                <div className="flex items-start gap-4">
                  <Terminal className="text-indigo-400 mt-1 shrink-0" size={24} />
                  <p className="text-indigo-100 text-lg leading-relaxed font-sans">
                    {project.description}
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Code2 size={16} /> Stack_Trace
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies && project.technologies.map((tech: any) => (
                    <div key={tech.id || tech} className="group relative">
                      <span className="relative z-10 block px-4 py-2 bg-[#151525] text-indigo-200 border border-indigo-500/30 rounded hover:border-indigo-400 hover:text-white transition-colors font-medium text-sm">
                        {tech.name || tech}
                      </span>
                      <div className="absolute inset-0 bg-indigo-500/20 blur-md rounded opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-dashed border-indigo-500/30">
                {project.demo_link && (
                  <a
                    href={project.demo_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-4 px-6 bg-transparent border-2 border-indigo-500 text-indigo-400 hover:bg-indigo-500 hover:text-white rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2 group font-sans"
                  >
                    <ExternalLink size={20} className="group-hover:rotate-45 transition-transform" />
                    Run Demo
                  </a>
                )}
                {project.source_code && (
                  <a
                    href={project.source_code}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-4 px-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-lg transition-all shadow-lg shadow-indigo-600/25 hover:shadow-indigo-500/40 flex items-center justify-center gap-2 font-sans"
                  >
                    <Github size={20} />
                    View Source
                  </a>
                )}
              </div>

            </motion.div>
          </div>
        </div>

        <div className="mt-20 pt-10 border-t border-indigo-500/10">
          <ReviewSection modelType="miniproject" objectId={project.id} />
        </div>

      </div>
    </div>
  );
}
