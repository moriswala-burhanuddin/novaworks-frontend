import { Github, Linkedin, Twitter, Mail, Heart, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#02040a] text-slate-400 pt-24 border-t border-white/5 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
      <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full"></div>

      <div className="max-w-7xl mx-auto px-6 pb-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">

          {/* Brand Column */}
          <div className="lg:col-span-5 space-y-8">
            <Link to="/" className="inline-block">
              <span className="text-3xl font-bold tracking-tighter text-white">
                Nova<span className="text-primary">Works</span>
              </span>
            </Link>
            <p className="text-lg text-slate-400 leading-relaxed max-w-sm">
              Crafting premium digital experiences. We build the future of web, one pixel at a time.
            </p>
            <div className="flex gap-4">
              {[Github, Linkedin, Twitter, Mail].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center hover:bg-white/[0.08] hover:border-white/10 hover:text-white hover:scale-105 transition-all duration-300"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="space-y-6">
              <h4 className="text-white font-semibold text-lg">Product</h4>
              <ul className="space-y-4">
                {['Projects', 'UI Designs', 'Templates', 'Pricing'].map((item) => (
                  <li key={item}>
                    <a href="#" className="flex items-center gap-2 hover:text-primary transition-colors group w-fit">
                      {item}
                      <ArrowUpRight size={14} className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-white font-semibold text-lg">Company</h4>
              <ul className="space-y-4">
                {['About Us', 'Careers', 'Blog', 'Contact'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6 col-span-2 md:col-span-1">
              <h4 className="text-white font-semibold text-lg">Legal</h4>
              <ul className="space-y-4">
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter / Bottom */}
        <div className="border-t border-white/5 pt-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-sm text-slate-500">
              © 2024 Nova Works Studio. All rights reserved.
            </div>

            <div className="flex items-center gap-2 px-6 py-3 bg-white/[0.02] border border-white/5 rounded-full backdrop-blur-sm">
              <span className="text-sm text-slate-400">Made with</span>
              <Heart size={14} className="text-red-500 fill-red-500 animate-pulse" />
              <span className="text-sm text-slate-400">by Developers</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
