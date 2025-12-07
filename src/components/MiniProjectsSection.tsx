import { useState, useEffect } from 'react';
import { Zap, ExternalLink, Code } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { storeAPI, MiniProject } from '../services/api';

export default function MiniProjectsSection() {
  const [miniProjects, setMiniProjects] = useState<MiniProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMiniProjects = async () => {
      try {
        const response = await storeAPI.getMiniProjects();
        const data = Array.isArray(response.data) ? response.data : response.data.results || [];
        setMiniProjects(data.slice(0, 4));
      } catch (err) {
        console.error("Failed to fetch mini projects:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMiniProjects();
  }, []);

  if (loading) return null;

  return (
    <section id="mini-projects" className="py-24 bg-main relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500">
                <Zap size={20} />
              </span>
              <span className="text-yellow-500 font-semibold tracking-wide uppercase text-sm">Quick Solutions</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Mini <span className="text-primary">Powerhouses</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-xl">
              Small but mighty applications designed to solve specific problems efficiently.
              Perfect for learning and quick integration.
            </p>
          </div>

          <Link to="/mini-projects" className="btn-secondary">
            View All Mini Projects
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {miniProjects.map((project, idx) => (
            <Link to={`/mini-projects/${project.slug}`} key={project.id} className="block group">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="h-full p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-primary/30 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-transparent text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <Code size={20} />
                  </div>
                  {project.demo_link && (
                    <div className="text-slate-500 group-hover:text-white transition-colors" onClick={(e) => {
                      e.preventDefault();
                      window.open(project.demo_link, '_blank', 'noopener,noreferrer');
                    }}>
                      <ExternalLink size={16} />
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>

                <div className="flex flex-wrap gap-1 mb-4">
                  {project.technologies?.map(tech => (
                    <span key={tech.id} className="text-xs font-mono text-slate-500 bg-white/5 py-1 px-2 rounded-md">
                      {tech.name}
                    </span>
                  )).slice(0, 2)}
                </div>

                <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
                  {project.description}
                </p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
