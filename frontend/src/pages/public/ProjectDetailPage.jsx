import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Star, Eye } from 'lucide-react';

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[15px] h-[15px]" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);
import SEO from '../../components/common/SEO';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import MarkdownRenderer from '../../components/common/MarkdownRenderer';
import { useProject } from '../../hooks/useProjects';
import { formatDate } from '../../utils/formatDate';

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const { project, isLoading, error } = useProject(slug);

  return (
    <>
      <SEO
        title={project?.title}
        description={project?.summary}
        image={project?.thumbnail_url}
      />
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft size={14} /> Quay lại Projects
          </Link>

          {isLoading ? (
            <div className="flex justify-center py-24"><LoadingSpinner size="lg" /></div>
          ) : error ? (
            <p className="text-center text-zinc-500 py-24">Không tìm thấy project.</p>
          ) : project ? (
            <article>
              {/* Thumbnail */}
              {project.thumbnail_url && (
                <div className="aspect-video rounded-xl overflow-hidden mb-8 bg-zinc-800">
                  <img src={project.thumbnail_url} alt={project.title} className="w-full h-full object-cover" />
                </div>
              )}

              {/* Header */}
              <div className="mb-8">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-600/20 text-violet-300 border border-violet-500/30 capitalize">
                    {project.status?.replace('_', ' ')}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300 capitalize">
                    {project.project_type?.replace('_', ' ')}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">{project.title}</h1>
                <p className="text-lg text-zinc-400">{project.summary}</p>
              </div>

              {/* Links */}
              <div className="flex flex-wrap gap-3 mb-8">
                {project.github_url && (
                  <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-sm transition-colors">
                    <GithubIcon /> GitHub
                    {project.github_stars != null && (
                      <span className="flex items-center gap-1 text-amber-400">
                        <Star size={12} /> {project.github_stars}
                      </span>
                    )}
                  </a>
                )}
                {project.live_url && (
                  <a href={project.live_url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm transition-colors">
                    <ExternalLink size={15} /> Live Demo
                  </a>
                )}
                <span className="flex items-center gap-1.5 text-sm text-zinc-500 ml-auto">
                  <Eye size={14} /> {project.view_count} lượt xem
                </span>
              </div>

              {/* Tech stack */}
              <div className="mb-8">
                <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Tech Stack</h2>
                <div className="flex flex-wrap gap-2">
                  {project.tech_stack.map((t) => (
                    <span key={t} className="px-3 py-1 rounded-lg text-sm bg-zinc-800 text-zinc-200 border border-zinc-700">{t}</span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">Mô tả</h2>
                <MarkdownRenderer content={project.description} />
              </div>

              {/* Meta */}
              <div className="mt-10 pt-6 border-t border-zinc-800 text-sm text-zinc-500">
                Cập nhật lần cuối: {formatDate(project.updated_at)}
              </div>
            </article>
          ) : null}
        </div>
      </main>
      <Footer />
    </>
  );
}
