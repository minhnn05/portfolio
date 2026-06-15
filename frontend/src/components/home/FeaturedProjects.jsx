import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useFeaturedProjects } from '../../hooks/useProjects';
import ProjectCard from '../projects/ProjectCard';
import LoadingSpinner from '../common/LoadingSpinner';

export default function FeaturedProjects() {
  const { projects, isLoading } = useFeaturedProjects();

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner />
      </div>
    );
  }

  if (!projects.length) return null;

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="flex items-end justify-between mb-12">
        <div>
          <p className="text-violet-400 text-sm font-medium uppercase tracking-wider mb-2">
            Portfolio
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Featured Projects
          </h2>
        </div>
        <Link
          to="/projects"
          className="hidden sm:inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
        >
          Xem tất cả <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>

      <div className="mt-8 flex justify-center sm:hidden">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
        >
          Xem tất cả projects <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}
