import { motion } from 'framer-motion';
import { Code2 } from 'lucide-react';
import { CodeComponent } from '../services/api';

interface CodeCardProps {
    component: CodeComponent;
    onView: (component: CodeComponent) => void;
}

export default function CodeCard({ component, onView }: CodeCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5 }}
            className="group relative bg-[#0f172a]/40 border border-white/5 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300"
        >
            {/* Preview Area (Simulated for safety/speed, iframe could be used) */}
            <div className="relative h-48 bg-[#020617] flex items-center justify-center border-b border-white/5 overflow-hidden">
                {/* Live Preview Render */}
                <div className="absolute inset-0 p-4 flex items-center justify-center scale-75 group-hover:scale-90 transition-transform duration-500">
                    <style>{component.css_code}</style>
                    <div dangerouslySetInnerHTML={{ __html: component.html_code }} />
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button
                        onClick={() => onView(component)}
                        className="px-6 py-2 bg-primary text-white rounded-full font-medium flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                    >
                        View Source <Code2 size={16} />
                    </button>
                </div>
            </div>

            <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-bold truncate">{component.title}</h3>
                    <span className="text-xs text-slate-500 px-2 py-1 bg-white/5 rounded-md border border-white/5">
                        {component.category.name}
                    </span>
                </div>
                <p className="text-slate-400 text-sm line-clamp-2">{component.description}</p>
            </div>
        </motion.div>
    );
}
