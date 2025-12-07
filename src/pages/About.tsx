import { motion } from 'framer-motion';
import {
  Code2, Palette, Globe, Megaphone, Smartphone, Rocket,
  Github, Phone, Mail, MapPin, ExternalLink, CheckCircle2,
  ArrowRight, Layout, Cpu
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  const services = [
    {
      icon: Palette,
      title: "Creative Brand Identity",
      description: "We craft unique visual identities that tell your brand's story and leave a lasting impression.",
      color: "text-pink-500",
      bg: "bg-pink-500/10",
      border: "border-pink-500/20"
    },
    {
      icon: Layout,
      title: "Professional Logo Designing",
      description: " memorable logos that capture the essence of your business and stand out in the market.",
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20"
    },
    {
      icon: Globe,
      title: "Modern Website Creation",
      description: "Responsive, high-performance websites built with cutting-edge technologies like React, Next.js, and Tailwind.",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20"
    },
    {
      icon: Megaphone,
      title: "Digital Marketing",
      description: "Strategic marketing campaigns including SEO and social media management to grow your reach.",
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20"
    },
    {
      icon: Smartphone,
      title: "App Development",
      description: "Native and cross-platform mobile applications that provide seamless user experiences.",
      color: "text-green-500",
      bg: "bg-green-500/10",
      border: "border-green-500/20"
    },
    {
      icon: Rocket,
      title: "Business Growth Solutions",
      description: "End-to-end digital solutions designed to scale your business and automate efficient workflows.",
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/20"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden pt-20">

      {/* === HERO SECTION === */}
      <section className="relative py-20 px-6 overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] -z-10" />

        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8">
              <span className="text-blue-400 font-bold tracking-wider uppercase text-xs">Decent Digital Presents</span>
            </div>

            <h1 className="text-4xl md:text-7xl font-black mb-6 tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
              GROW DIGITALLY <br />
              <span className="text-blue-500">WITH US</span>
            </h1>

            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Your vision, our creativity. One mighty digital presence. <br />
              We provide complete business growth solutions from branding to code.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://decentdigital.in"
                target="_blank"
                rel="noreferrer"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
              >
                Visit Agency Site <ExternalLink size={18} />
              </a>
              <Link
                to="/projects"
                className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-all flex items-center gap-2 backdrop-blur-sm"
              >
                Explore Market <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* === FOUNDER SECTION === */}
      <section className="py-20 px-6 bg-slate-900/50 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.1),transparent)]" />

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* Visual/Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative z-10 bg-slate-800 rounded-3xl p-1 border border-white/10 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                <img
                  src="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=1000"
                  alt="Founder"
                  className="rounded-2xl grayscale hover:grayscale-0 transition-all duration-500"
                />
                <div className="absolute bottom-6 left-6 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold backdrop-blur-md shadow-lg">
                  Burhanuddin
                  <span className="block text-xs font-normal opacity-80">Full Stack Developer</span>
                </div>
              </div>
              <div className="absolute top-10 -right-10 w-full h-full border-2 border-blue-500/30 rounded-3xl -z-10" />
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Meet The Mind Behind <span className="text-blue-500">The Code</span></h2>
              <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                Hi, I'm <span className="text-white font-semibold">Burhanuddin</span>, the founder of Decent Digital and the architect of Nova Works.
                I specialize in turning complex business problems into elegant, production-ready digital solutions.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                  <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400">
                    <Code2 size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold">Full Stack Expertise</h3>
                    <p className="text-sm text-slate-400">React, Node.js, Python, Django, Cloud Architecture</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                  <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400">
                    <Cpu size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold">Ready-Made Solutions</h3>
                    <p className="text-sm text-slate-400">Providing production-ready code for e-commerce, SaaS, and more.</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://github.com/moriswala-burhanuddin"
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 border border-white/10 transition-colors"
                >
                  <Github size={20} /> github.com/moriswala-burhanuddin
                </a>
                <a
                  href="tel:+918128260653"
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 border border-white/10 transition-colors"
                >
                  <Phone size={20} /> +91 81282 60653
                </a>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* === SERVICES SECTION === */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              We don't just write code; we build businesses. From the initial spark of an idea to the final launch, we are your partners in growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`p-8 rounded-2xl border ${service.border} bg-slate-900/50 hover:bg-slate-800/50 transition-all duration-300 group`}
              >
                <div className={`w-14 h-14 ${service.bg} ${service.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <service.icon size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-slate-400 leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* === CUSTOM PROJECT CTA === */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-blue-900/50 to-indigo-900/50 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden border border-white/10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px]" />

          <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10">Didn't find what you're looking for?</h2>
          <p className="text-xl text-blue-200 mb-10 max-w-2xl mx-auto relative z-10">
            Let's create it together. We offer custom development services tailored to your specific business needs.
            From concept to code, we've got you covered.
          </p>

          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-10 py-5 bg-white text-blue-900 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-xl shadow-blue-500/20 relative z-10"
          >
            Start a Custom Project <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* === FOOTER INFO === */}
      <section className="py-12 border-t border-white/5 bg-black/20">
        <div className="max-w-7xl mx-auto px-6 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h4 className="text-lg font-bold text-white mb-2">Decent Digital</h4>
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
              <MapPin size={16} /> FF-12, Amber Complex, Ajwa Road, Vadodara - 19 (Guj.) INDIA
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Mail size={16} /> www.decentdigital.in
            </div>
          </div>
          <div className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Decent Digital. All rights reserved.
          </div>
        </div>
      </section>

    </div>
  );
}
