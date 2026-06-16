import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useFeaturedProjects } from '../../hooks/useProjects';
import ProjectCard from '../projects/ProjectCard';
import LoadingSpinner from '../common/LoadingSpinner';

export default function FeaturedProjects() {
  const { projects, isLoading } = useFeaturedProjects();

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <LoadingSpinner />
      </div>
    );
  }

  if (!projects.length) return null;

  return (
    <section className="py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Section header */}
        <div className="flex items-end justify-between mb-14">
          <div>
            <p className="text-xs font-mono text-violet-500 uppercase tracking-[0.2em] mb-3">
              01 — Portfolio
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
              Featured
              <br />
              Projects
            </h2>
          </div>
          <Link
            to="/projects"
            className="hidden sm:inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-violet-400 transition-colors group"
          >
            Xem tất cả
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p) => (
            <div
              key={p.id}
              className="group relative rounded-2xl border border-zinc-800 hover:border-violet-500/40 bg-zinc-900/60 hover:bg-zinc-900 transition-all duration-300 hover:shadow-xl hover:shadow-violet-950/30"
            >
              <ProjectCard project={p} />
            </div>
          ))}
        </div>

        {/* Mobile "see all" */}
        <div className="mt-10 flex justify-center sm:hidden">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors"
          >
            Xem tất cả projects <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}