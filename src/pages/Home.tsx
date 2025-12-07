import Hero from '../components/Hero';
import PosterCarousel from '../components/PosterCarousel';
import ProjectsSection from '../components/ProjectsSection';
import DesignsSection from '../components/DesignsSection';
import MiniProjectsSection from '../components/MiniProjectsSection';
import Testimonials from '../components/Testimonials';
import FeedbackForm from '../components/FeedbackForm';

export default function Home() {
  return (
    <div>
      <Hero />
      <PosterCarousel />
      <ProjectsSection />
      <DesignsSection />
      <MiniProjectsSection />
      <Testimonials />
      <FeedbackForm />
    </div>
  );
}
