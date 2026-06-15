import SEO from '../../components/common/SEO';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import SkillGroup from '../../components/skills/SkillGroup';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useSkillsGrouped } from '../../hooks/useSkills';

export default function SkillsPage() {
  const { groups, isLoading, error } = useSkillsGrouped();

  return (
    <>
      <SEO title="Skills" description="Tech stack và kỹ năng của tôi." />
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-violet-400 text-sm font-medium uppercase tracking-wider mb-2">Expertise</p>
            <h1 className="text-4xl font-bold text-white mb-4">Skills & Tech Stack</h1>
            <p className="text-zinc-400 max-w-xl">
              Những công nghệ tôi sử dụng hàng ngày và đang tiếp tục học hỏi.
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-24"><LoadingSpinner size="lg" /></div>
          ) : error ? (
            <p className="text-center text-zinc-500 py-24">Không thể tải skills.</p>
          ) : !groups.length ? (
            <p className="text-center text-zinc-500 py-24">Chưa có dữ liệu.</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {groups.map((g) => (
                <SkillGroup key={g.category} category={g.category} skills={g.skills} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
