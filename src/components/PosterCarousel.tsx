import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const posters = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    description: 'Full-stack marketplace with payment integration',
    image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=1920',
    color: 'from-blue-600 to-purple-600'
  },
  {
    id: 2,
    title: 'AI Dashboard',
    description: 'Modern analytics dashboard with AI insights',
    image: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=1920',
    color: 'from-green-600 to-teal-600'
  },
  {
    id: 3,
    title: 'Social Network',
    description: 'Real-time messaging and content sharing platform',
    image: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=1920',
    color: 'from-pink-600 to-red-600'
  }
];

export default function PosterCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % posters.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setCurrentSlide((prev) => (prev - 1 + posters.length) % posters.length);
      } else if (e.key === 'ArrowRight') {
        setCurrentSlide((prev) => (prev + 1) % posters.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % posters.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + posters.length) % posters.length);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      {posters.map((poster, index) => (
        <div
          key={poster.id}
          className={`absolute inset-0 transition-all duration-1200 ease-out ${
            index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${poster.image})`,
              transform: index === currentSlide ? 'scale(1)' : 'scale(1.1)',
              transition: 'transform 1200ms ease-out'
            }}
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${poster.color} opacity-60 mix-blend-multiply`}></div>
          </div>

          <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
            <div className={`transition-all duration-1000 ${
              index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            }`}>
              <span className="text-white/60 text-sm uppercase tracking-widest font-bold mb-4 block">Slide {index + 1} of {posters.length}</span>
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">{poster.title}</h2>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">{poster.description}</p>
              <button className="px-10 py-4 bg-gradient-to-r from-white to-gray-200 text-gray-900 rounded-full font-bold hover:shadow-2xl hover:shadow-white/50 transition-all duration-300 transform hover:scale-110 relative overflow-hidden group">
                <span className="relative z-10">View Project</span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={prevSlide}
        className="absolute left-8 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-4 rounded-full transition-all duration-300 group hover:scale-110 hover:shadow-2xl hover:shadow-white/20"
      >
        <ChevronLeft size={32} className="group-hover:-translate-x-1 transition-transform duration-300" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-8 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-4 rounded-full transition-all duration-300 group hover:scale-110 hover:shadow-2xl hover:shadow-white/20"
      >
        <ChevronRight size={32} className="group-hover:translate-x-1 transition-transform duration-300" />
      </button>

      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20 flex space-x-4">
        {posters.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-500 rounded-full backdrop-blur-md ${
              index === currentSlide
                ? 'bg-white w-16 h-3 shadow-lg shadow-white/50'
                : 'bg-white/40 hover:bg-white/60 w-3 h-3 hover:w-8'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
