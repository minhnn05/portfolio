import SEO from '../../components/common/SEO';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import SkillGroup from '../../components/skills/SkillGroup';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useSkillsGrouped } from '../../hooks/useSkills';
import { Layers } from 'lucide-react';

export default function SkillsPage() {
  const { groups, isLoading, error } = useSkillsGrouped();

  return (
    <>
      <SEO title="Skills" description="Tech stack và kỹ năng của tôi." />
      <Navbar />

      <main className="min-h-screen bg-zinc-950">

        {/* ── Page hero — đồng bộ với ProjectsPage / BlogPage ── */}
        <div className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Dot-grid */}
          <div
            className="absolute inset-0 opacity-[0.3]"
            style={{
              backgroundImage: 'radial-gradient(circle, #3f3f46 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />
          {/* Violet glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(139,92,246,0.14) 0%, transparent 70%)',
            }}
          />

          <div className="relative z-10 max-w-6xl mx-auto">
            <p className="text-xs font-mono text-violet-500 uppercase tracking-[0.2em] mb-3">
              Expertise
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4">
              Skills &amp; Tech Stack
            </h1>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-800/70" />

        {/* ── Main content ── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {isLoading ? (
            <div className="flex justify-center py-32">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <div className="text-center py-32">
              <p className="text-zinc-600 text-sm">Không thể tải skills.</p>
            </div>
          ) : !groups.length ? (
            <div className="text-center py-32">
              <Layers size={32} className="text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-600 text-sm">Chưa có dữ liệu.</p>
            </div>
          ) : (
            <>
              {/* Skill count */}
              <p className="text-[11px] font-mono text-zinc-600 uppercase tracking-[0.15em] mb-10">
                {groups.length} categories —{' '}
                {groups.reduce((acc, g) => acc + g.skills.length, 0)} skills
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {groups.map((g, idx) => (
                  <SkillGroup
                    key={g.category ?? g.name ?? idx}
                    group={g}
                    index={idx}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
