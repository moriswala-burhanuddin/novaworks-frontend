import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'CTO @ TechStart',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150',
    text: 'The quality of code is exceptional. Saved us months of development time. Highly recommended.'
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Lead Dev @ DigitalSol',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150',
    text: 'Clean architecture, easy to scale. This is exactly what we needed to launch fast.'
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Product Owner',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150',
    text: 'Incredible attention to detail. The UI components are polished and the backend is rock solid.'
  },
  {
    id: 4,
    name: 'David Park',
    role: 'Founder @ NextGen',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150',
    text: 'Best investment for our MVP. We got to market in record time thanks to these templates.'
  },
  {
    id: 5,
    name: 'Jessica Lee',
    role: 'Senior Engineer',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150',
    text: 'Documented perfectly. I could jump in and start customizing immediately without headaches.'
  }
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-[#050505] relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-blue-900/10 rounded-full blur-[100px]"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-white mb-6"
          >
            Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Builders</span>
          </motion.h2>
        </div>

        {/* Marquee Effect */}
        <div className="relative w-full overflow-hidden mask-linear-gradient">
          {/* Gradient Masks for edges */}
          <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-[#050505] to-transparent z-10"></div>
          <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-[#050505] to-transparent z-10"></div>

          <motion.div
            className="flex gap-6 w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 30
            }}
          >
            {[...testimonials, ...testimonials].map((t, i) => (
              <div
                key={`${t.id}-${i}`}
                className="w-[350px] bg-[#0f0f0f] border border-white/5 rounded-2xl p-8 flex flex-col hover:border-blue-500/30 transition-colors"
              >
                <Quote className="text-blue-500/20 mb-6" size={40} />
                <p className="text-gray-300 text-lg mb-6 leading-relaxed flex-grow">"{t.text}"</p>

                <div className="flex items-center gap-4 mt-auto">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white/10"
                  />
                  <div>
                    <h4 className="font-bold text-white text-sm">{t.name}</h4>
                    <p className="text-xs text-blue-400">{t.role}</p>
                  </div>
                  <div className="ml-auto flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => <Star key={star} size={12} className="text-yellow-500 fill-yellow-500" />)}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
