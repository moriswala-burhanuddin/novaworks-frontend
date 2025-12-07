import React, { useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import {
  ArrowRight, ShoppingBag, Code2, Server, Layout, Database,
  Search, GitBranch, Cpu, Globe, Zap, CheckCircle2,
  PlayCircle, MoreHorizontal, MousePointer2, Layers, Type
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeFrame, setActiveFrame] = React.useState<'code' | 'design'>('design');

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 15;
    const y = (clientY / innerHeight - 0.5) * 15;
    mouseX.set(x);
    mouseY.set(y);
  };

  const rotateX = useSpring(mouseY, { stiffness: 40, damping: 20 });
  const rotateY = useSpring(mouseX, { stiffness: 40, damping: 20 });

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[110vh] w-full bg-[#02040a] overflow-hidden flex flex-col justify-center pt-20 perspective-[2000px]"
    >
      {/* === ULTRA BACKGROUND === */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Deep Space Gradients */}
        <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-indigo-950/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-950/20 rounded-full blur-[150px]" />

        {/* Digital Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(circle_at_center,black_40%,transparent_100%)]" />

        {/* Animated Code Particles */}
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute font-mono text-[10px] text-blue-500/20 whitespace-nowrap"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0
            }}
            animate={{
              y: [null, Math.random() * -200],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5
            }}
          >
            {['<Project />', 'npm install', 'git push', 'sudo deploy', '404 not found', '200 OK'][i % 6]}
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-6 z-10 grid xl:grid-cols-2 gap-16 items-center">

        {/* === LEFT: THE SALES PITCH === */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-blue-400 text-xs font-bold tracking-widest uppercase">Premium Source Code</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tight leading-[0.95]">
            BUILD
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500">
              FASTER.
            </span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed font-light">
            Skip the boring setup. Download <span className="text-white font-semibold">production-ready</span> E-commerce,
            SaaS, and Dashboard projects.
            <br className="hidden md:block" />
            High-quality code that scales.
          </p>

          <div className="flex flex-wrap gap-4 mb-12">
            <Link
              to="/projects"
              className="px-8 py-4 bg-white text-black font-bold rounded-lg hover:bg-slate-200 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transform hover:-translate-y-1"
            >
              <ShoppingBag size={20} /> BROWSE PROJECTS
            </Link>
            <button className="px-8 py-4 bg-white/5 text-white font-bold rounded-lg border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2 backdrop-blur-md">
              <PlayCircle size={20} /> VIEW DEMOS
            </button>
          </div>

          <div className="grid grid-cols-3 gap-6 max-w-md border-t border-white/10 pt-8">
            {[
              { label: 'Projects', val: '50+' },
              { label: 'Happy Devs', val: '2.5k' },
              { label: 'Tech Stack', val: 'Modern' }
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-2xl font-bold text-white mb-1">{stat.val}</div>
                <div className="text-sm text-slate-500 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* === RIGHT: THE VISUAL MASTERPIECE === */}
        <div className="relative h-[600px] lg:h-[800px] w-full flex items-center justify-center perspective-[2000px]">
          <motion.div
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d"
            }}
            className="relative w-full max-w-[550px] aspect-square"
          >

            {/* BACKGROUND GLOW */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] lg:w-[600px] lg:h-[600px] bg-gradient-to-tr from-blue-600/30 to-purple-600/30 rounded-full blur-[80px] lg:blur-[100px] -z-10" />

            {/* === VS CODE FRAME (The Backend/Code) === */}
            <motion.div
              animate={{
                x: activeFrame === 'code' ? '0%' : '15%',
                y: activeFrame === 'code' ? '0%' : '-5%',
                z: activeFrame === 'code' ? 100 : 0,
                scale: activeFrame === 'code' ? 1 : 0.9,
                zIndex: activeFrame === 'code' ? 50 : 10,
                filter: activeFrame === 'code' ? 'blur(0px)' : 'blur(2px)',
                opacity: activeFrame === 'code' ? 1 : 0.8
              }}
              transition={{
                duration: 0.5,
                ease: "easeInOut"
              }}
              onClick={() => setActiveFrame('code')}
              className="absolute top-0 right-0 lg:right-[-20px] w-[90%] md:w-[500px] bg-[#1e1e1e] rounded-xl overflow-hidden shadow-[0_25px_50px_rgba(0,0,0,0.5)] border border-white/5 cursor-pointer hover:border-blue-500/50 transition-colors"
            >
              <div className="absolute inset-0 z-[60] bg-transparent" /> {/* Click catcher */}
              {/* Title Bar */}
              <div className="h-9 bg-[#2d2d2d] flex items-center px-4 justify-between select-none">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                </div>
                <div className="flex text-[10px] text-gray-400 font-sans gap-2">
                  <span className="flex items-center gap-1"><Search size={10} /> ecommerce-backend</span>
                </div>
                <div />
              </div>

              <div className="flex h-[350px] md:h-[400px]">
                {/* Activity Bar */}
                <div className="w-10 md:w-12 bg-[#333333] flex flex-col items-center py-4 gap-4 border-r border-black/20">
                  <div className="p-2 hover:bg-white/10 rounded cursor-pointer"><Code2 size={18} className="text-blue-400" /></div>
                  <div className="p-2 hover:bg-white/10 rounded cursor-pointer opacity-50"><Search size={18} className="text-gray-400" /></div>
                  <div className="p-2 hover:bg-white/10 rounded cursor-pointer opacity-50"><GitBranch size={18} className="text-gray-400" /></div>
                  <div className="mt-auto p-2 opacity-50"><MoreHorizontal size={18} className="text-gray-400" /></div>
                </div>

                {/* Sidebar */}
                <div className="w-32 md:w-48 bg-[#252526] hidden sm:block">
                  <div className="px-4 py-2 text-[10px] items-center flex justify-between font-bold text-gray-400 uppercase tracking-wider">
                    Explorer <MoreHorizontal size={12} />
                  </div>
                  <div className="text-sm font-sans text-gray-400 py-2">
                    <div className="px-4 py-1 flex items-center gap-2 hover:bg-[#2a2d2e] cursor-pointer text-blue-300">
                      <Layout size={14} /> src
                    </div>
                    <div className="px-8 py-1 flex items-center gap-2 hover:bg-[#2a2d2e] cursor-pointer text-yellow-200">
                      <Layout size={14} /> components
                    </div>
                    <div className="px-12 py-1 flex items-center gap-2 hover:bg-[#2a2d2e] cursor-pointer bg-[#37373d] text-white">
                      <Code2 size={14} className="text-blue-400" /> ProductCard.tsx
                    </div>
                    <div className="px-12 py-1 flex items-center gap-2 hover:bg-[#2a2d2e] cursor-pointer">
                      <Code2 size={14} className="text-yellow-400" /> Navbar.tsx
                    </div>
                    <div className="px-4 py-1 flex items-center gap-2 hover:bg-[#2a2d2e] cursor-pointer text-green-300">
                      <Server size={14} /> api
                    </div>
                  </div>
                </div>

                {/* Editor */}
                <div className="flex-1 bg-[#1e1e1e] p-4 font-mono text-xs md:text-sm leading-6 overflow-hidden">
                  <div className="flex gap-4">
                    <div className="text-gray-600 select-none text-right w-6">
                      {Array.from({ length: 12 }).map((_, i) => <div key={i}>{i + 1}</div>)}
                    </div>
                    <div className="text-gray-300">
                      <div><span className="text-purple-400">const</span> <span className="text-blue-400">ProductCard</span> = <span className="text-yellow-300">({`{ product }`})</span> <span className="text-blue-400">=&gt;</span> {'{'}</div>
                      <div className="pl-4"><span className="text-purple-400">return</span> (</div>
                      <div className="pl-8"><span className="text-gray-400">&lt;</span><span className="text-green-400">motion.div</span></div>
                      <div className="pl-12"><span className="text-blue-300">whileHover</span>=<span className="text-blue-300">{`{{ scale: 1.05 }}`}</span></div>
                      <div className="pl-12"><span className="text-blue-300">className</span>=<span className="text-orange-300">"bg-white rounded-xl shadow-lg"</span></div>
                      <div className="pl-8"><span className="text-gray-400">&gt;</span></div>
                      <div className="pl-12"><span className="text-gray-400">&lt;</span><span className="text-green-400">img</span> <span className="text-blue-300">src</span>=<span className="text-blue-300">{`{product.image}`}</span> <span className="text-gray-400">/&gt;</span></div>
                      <div className="pl-12"><span className="text-gray-400">&lt;</span><span className="text-green-400">PriceTag</span> <span className="text-blue-300">value</span>=<span className="text-blue-300">{`{product.price}`}</span> <span className="text-gray-400">/&gt;</span></div>
                      <div className="pl-8"><span className="text-gray-400">&lt;/</span><span className="text-green-400">motion.div</span><span className="text-gray-400">&gt;</span></div>
                      <div className="pl-4">);</div>
                      <div>{'}'};</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terminal */}
              <div className="h-28 bg-[#1e1e1e] border-t border-white/10 p-2 font-mono text-xs hidden md:block">
                <div className="flex gap-4 text-gray-400 mb-2 border-b border-white/5 pb-1">
                  <span className="text-white border-b border-blue-500">TERMINAL</span>
                  <span>OUTPUT</span>
                  <span>DEBUG_CONSOLE</span>
                </div>
                <div className="text-green-400">➜  nova-works git:(main) <span className="text-white">npm run dev</span></div>
                <div className="text-gray-300 mt-1">
                  &gt; nova-frontend@1.0.0 dev<br />
                  &gt; vite
                </div>
                <div className="text-blue-400 mt-2">
                  VITE v4.3.9  <span className="text-green-400">ready in 420 ms</span>
                </div>
              </div>
            </motion.div>

            {/* === FIGMA FRAME (The Design/Product) === */}
            <motion.div
              animate={{
                x: activeFrame === 'design' ? '0%' : '-15%',
                y: activeFrame === 'design' ? '0%' : '5%',
                z: activeFrame === 'design' ? 100 : 0,
                scale: activeFrame === 'design' ? 1 : 0.9,
                zIndex: activeFrame === 'design' ? 50 : 10,
                filter: activeFrame === 'design' ? 'blur(0px)' : 'blur(2px)',
                opacity: activeFrame === 'design' ? 1 : 0.8
              }}
              transition={{
                duration: 0.5,
                ease: "easeInOut"
              }}
              onClick={() => setActiveFrame('design')}
              className="absolute bottom-10 left-0 lg:left-[-40px] w-[90%] md:w-[450px] bg-[#2C2C2C] rounded-xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-white/10 cursor-pointer hover:border-purple-500/50 transition-colors"
            >
              {/* Figma Toolbar */}
              <div className="h-10 bg-[#2C2C2C] flex items-center justify-between px-4 border-b border-black/20">
                <div className="flex gap-4 text-gray-400">
                  <Layers size={14} className="text-white" />
                  <MousePointer2 size={14} className="text-blue-500" />
                  <Layout size={14} />
                </div>
                <div className="text-xs font-medium text-white">Product_v2.0</div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-purple-500 text-[8px] flex items-center justify-center text-white">JD</div>
                  <div className="px-2 py-1 bg-blue-600 rounded text-[10px] text-white">Share</div>
                </div>
              </div>

              <div className="flex h-[300px] md:h-[350px]">
                {/* Figma Sidebar */}
                <div className="w-24 md:w-32 bg-[#2C2C2C] border-r border-black/20 p-2 hidden sm:block">
                  <div className="text-[10px] text-gray-500 font-bold mb-2">LAYERS</div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-white bg-blue-500/20 p-1 rounded">
                      <Layout size={10} /> Card
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400 p-1 pl-4">
                      <Layout size={10} /> Image
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400 p-1 pl-4">
                      <Type size={10} /> Title
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400 p-1 pl-4">
                      <span className="w-2 h-2 rounded-full border border-gray-500" /> Button
                    </div>
                  </div>
                </div>

                {/* Figma Canvas */}
                <div className="flex-1 bg-[#1e1e1e] relative overflow-hidden flex items-center justify-center p-8 bg-[radial-gradient(#333_1px,transparent_1px)] bg-[size:20px_20px]">

                  {/* THE CARD DESIGN BEING SOLD */}
                  <div className="relative w-48 md:w-64 bg-white rounded-2xl shadow-2xl overflow-hidden transform rotate-[-5deg] hover:rotate-0 transition-transform duration-500">
                    <div className="h-24 md:h-32 bg-gray-200 relative">
                      <div className="absolute inset-0 bg-gradient-to-tr from-purple-500 to-indigo-600" />
                      <div className="absolute top-2 right-2 px-2 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] text-white font-bold">
                        $49.00
                      </div>
                    </div>
                    <div className="p-4 bg-white">
                      <div className="h-4 w-3/4 bg-gray-200 rounded mb-2" />
                      <div className="h-3 w-1/2 bg-gray-100 rounded mb-4" />
                      <div className="flex gap-2">
                        <div className="h-8 flex-1 bg-black rounded-lg flex items-center justify-center text-xs text-white font-bold">
                          Add to Cart
                        </div>
                        <div className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center">
                          <ShoppingBag size={14} className="text-gray-400" />
                        </div>
                      </div>
                    </div>

                    {/* Fake Cursors interacting */}
                    <div className="absolute top-20 left-10 pointer-events-none">
                      <MousePointer2 className="text-pink-500 fill-pink-500 h-6 w-6" />
                      <div className="px-2 py-0.5 bg-pink-500 text-white text-[10px] rounded ml-4">Sarah</div>
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>

            {/* Connecting Line */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{ transform: "translateZ(30px)" }}>
              <motion.path
                d="M 200 150 C 300 150, 400 300, 400 300"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                strokeDasharray="4 4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.5 }}
                transition={{ duration: 1, delay: 1 }}
              />
              <circle cx="200" cy="150" r="4" fill="#3b82f6" />
              <circle cx="400" cy="300" r="4" fill="#3b82f6" />
            </svg>

          </motion.div>
        </div>
      </div>
    </div>
  );
}
