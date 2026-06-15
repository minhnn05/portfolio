import SEO from '../../components/common/SEO';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import HeroSection from '../../components/home/HeroSection';
import FeaturedProjects from '../../components/home/FeaturedProjects';
import FeaturedBlogs from '../../components/home/FeaturedBlogs';
import SkillsPreview from '../../components/home/SkillsPreview';

export default function HomePage() {
  return (
    <>
      <SEO
        title="Home"
        description="Full-stack developer — React, FastAPI, PostgreSQL. Xem projects, blog và kỹ năng của tôi."
      />
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedProjects />
        <SkillsPreview />
        <FeaturedBlogs />
      </main>
      <Footer />
    </>
  );
}
