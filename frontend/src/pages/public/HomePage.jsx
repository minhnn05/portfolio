import SEO from '../../components/common/SEO';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import HeroSection from '../../components/home/HeroSection';
import FeaturedProjects from '../../components/home/FeaturedProjects';
import SkillsPreview from '../../components/home/SkillsPreview';

export default function HomePage() {
  return (
    <>
      <SEO title="Home" description="Full-stack developer — React, FastAPI, PostgreSQL." />
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedProjects />
        <SkillsPreview />
      </main>
      <Footer />
    </>
  );
}
