import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const reviews = [
  {
    id: 1,
    name: "Alex Johnson",
    role: "Senior Developer",
    content: "The quality of the code is outstanding. Clean, well-documented, and easy to integrate. Saved me hours of work.",
    image: "https://ui-avatars.com/api/?name=Alex+Johnson&background=0D8ABC&color=fff"
  },
  {
    id: 2,
    name: "Sarah Williams",
    role: "Product Manager",
    content: "The designs are simply beautiful. They have that premium feel that is hard to find in templates nowadays.",
    image: "https://ui-avatars.com/api/?name=Sarah+Williams&background=random"
  },
  {
    id: 3,
    name: "Michael Chen",
    role: "Startup Founder",
    content: "Using the E-Commerce dashboard accelerated our launch by weeks. Highly recommended for any startup.",
    image: "https://ui-avatars.com/api/?name=Michael+Chen&background=random"
  }
];

export default function ReviewSection() {
  return (
    <section className="py-24 bg-[#020617] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 text-primary mb-6">
            <Star className="w-6 h-6 fill-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Industry Leaders</span>
          </h2>
          <p className="text-slate-400 text-lg">
            Don't just take our word for it. Here's what developers and founders are saying about NovaWorks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, idx) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="relative p-8 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm"
            >
              <Quote className="absolute top-6 right-6 text-white/5 w-12 h-12" />

              <div className="flex items-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="text-yellow-500 fill-yellow-500" />
                ))}
              </div>

              <p className="text-slate-300 mb-8 leading-relaxed relative z-10">
                "{review.content}"
              </p>

              <div className="flex items-center gap-4">
                <img
                  src={review.image}
                  alt={review.name}
                  className="w-12 h-12 rounded-full border border-white/10"
                />
                <div>
                  <div className="font-bold text-white">{review.name}</div>
                  <div className="text-sm text-slate-500">{review.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
