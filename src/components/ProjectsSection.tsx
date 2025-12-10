import { useState, useEffect } from 'react';
import { ArrowUpRight, Github, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { storeAPI, Project, getMediaUrl } from '../services/api';

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await storeAPI.getProjects();
        const data = Array.isArray(response.data) ? response.data : response.data.results || [];
        setProjects(data.slice(0, 10));
      } catch (err) {
        console.error("Failed to fetch projects:", err);
        setError("Failed to load projects.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <section id="projects" className="py-24 bg-main flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </section>
    );
  }

  if (error) return null;

  return (
    <section id="projects" className="py-24 relative bg-main">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Featured <span className="text-primary">Projects</span>
            </h2>
            <p className="text-slate-400 text-lg">
              Explore our collection of premium, open-source projects built with modern technologies.
              Ready to deploy and fully customizable.
            </p>
          </div>
          <Link
            to="/projects"
            className="flex items-center gap-2 text-primary font-semibold hover:text-primary-hover transition-colors group"
          >
            View All Projects
            <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative bg-[#0f172a]/40 border border-white/5 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/5"
            >
              {/* Image Container */}
              <div className="relative h-60 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-transparent z-10 opacity-60" />
                <img
                  src={getMediaUrl(project.thumbnail || project.images?.[0]?.image)}
                  alt={project.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />

                {/* Overlay Links */}
                <div className="absolute inset-0 z-20 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-sm">
                  <Link to={`/projects/${project.slug}`} className="p-3 bg-white text-black rounded-full hover:bg-gray-200 transition-colors">
                    <ArrowUpRight size={20} />
                  </Link>
                  {project.demo_link && (
                    <a href={project.demo_link} target="_blank" rel="noopener noreferrer" className="p-3 bg-black/50 text-white border border-white/20 rounded-full hover:bg-black/70 transition-colors">
                      <Github size={20} />
                    </a>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                </div>

                <p className="text-slate-400 text-sm mb-6 line-clamp-2">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.tags?.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-3 py-1 text-xs font-medium text-blue-300 bg-blue-500/10 border border-blue-500/20 rounded-full"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-full font-bold transition-all group"
          >
            View More Projects
            <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
