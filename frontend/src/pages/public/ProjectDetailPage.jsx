import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Star, Eye, Calendar, Tag, Layers } from 'lucide-react';
import { cn } from '../../utils/cn';
import SEO from '../../components/common/SEO';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import MarkdownRenderer from '../../components/common/MarkdownRenderer';
import { useProject } from '../../hooks/useProjects';
import { formatDate } from '../../utils/formatDate';

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const STATUS_MAP = {
  completed:   { label: 'Completed',   className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  in_progress: { label: 'In Progress', className: 'bg-amber-500/10  text-amber-400  border-amber-500/20'  },
  archived:    { label: 'Archived',    className: 'bg-zinc-700/50   text-zinc-400  border-zinc-600/30'    },
};

/* ── Sidebar meta row ── */
function MetaRow({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-zinc-800/60 last:border-0">
      <Icon size={14} className="text-zinc-600 mt-0.5 flex-shrink-0" />
      <div className="min-w-0">
        <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.15em] mb-0.5">{label}</p>
        <div className="text-xs text-zinc-300">{children}</div>
      </div>
    </div>
  );
}

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

      <main className="min-h-screen bg-zinc-950">

        {/* ── Page hero ── */}
        <div className="relative pt-32 pb-10 px-4 sm:px-6 lg:px-8 overflow-hidden">
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
                'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(139,92,246,0.12) 0%, transparent 70%)',
            }}
          />
          <div className="relative z-10 max-w-6xl mx-auto">
            <Link
              to="/projects"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500 hover:text-violet-400 transition-colors group"
            >
              <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
              Projects
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-800/70" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* States */}
          {isLoading ? (
            <div className="flex justify-center py-32">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <div className="text-center py-32">
              <p className="text-zinc-600 text-sm">Không tìm thấy project.</p>
              <Link to="/projects" className="mt-4 inline-block text-xs text-violet-500 hover:text-violet-400">
                Quay lại Projects
              </Link>
            </div>
          ) : project ? (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12 items-start">

              {/* ── LEFT: main content ── */}
              <article className="min-w-0">

                {/* Thumbnail */}
                {project.thumbnail_url ? (
                  <div className="aspect-video rounded-2xl overflow-hidden mb-8 border border-zinc-800/80">
                    <img
                      src={project.thumbnail_url}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div
                    className="aspect-video rounded-2xl mb-8 border border-zinc-800/80 flex items-center justify-center"
                    style={{
                      background:
                        'radial-gradient(ellipse at top, rgba(139,92,246,0.1) 0%, transparent 70%), #18181b',
                    }}
                  >
                    <span className="text-6xl font-bold text-zinc-800 font-mono select-none">
                      {project.title.charAt(0)}
                    </span>
                  </div>
                )}

                {/* Header */}
                <div className="mb-8">
                  {/* Eyebrow: status + type */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    {project.status && STATUS_MAP[project.status] && (
                      <span
                        className={cn(
                          'px-2.5 py-0.5 rounded-full text-[10px] font-semibold border uppercase tracking-wide',
                          STATUS_MAP[project.status].className,
                        )}
                      >
                        {STATUS_MAP[project.status].label}
                      </span>
                    )}
                    {project.project_type && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-800 text-zinc-400 border border-zinc-700/60 uppercase tracking-wide capitalize">
                        {project.project_type.replace('_', ' ')}
                      </span>
                    )}
                    {project.is_featured && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-violet-600/20 text-violet-400 border border-violet-500/30 uppercase tracking-wide">
                        Featured
                      </span>
                    )}
                  </div>

                  <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
                    {project.title}
                  </h1>
                  <p className="text-base text-zinc-400 leading-relaxed">{project.summary}</p>
                </div>

                {/* CTA links */}
                <div className="flex flex-wrap items-center gap-3 mb-10">
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700/60 hover:border-zinc-600 text-white text-xs font-medium transition-all"
                    >
                      <GithubIcon /> GitHub
                      {project.github_stars != null && (
                        <span className="flex items-center gap-1 text-amber-400 font-normal">
                          <Star size={11} /> {project.github_stars}
                        </span>
                      )}
                    </a>
                  )}
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium transition-colors shadow-md shadow-violet-900/30"
                    >
                      <ExternalLink size={14} /> Live Demo
                    </a>
                  )}
                </div>

                {/* Description */}
                <div className="border-t border-zinc-800/60 pt-10">
                  <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.18em] mb-6">
                    Mô tả
                  </p>
                  <MarkdownRenderer content={project.description} />
                </div>

                {/* Updated at */}
                <p className="mt-12 text-[11px] text-zinc-700 font-mono">
                  Cập nhật: {formatDate(project.updated_at)}
                </p>
              </article>

              {/* ── RIGHT: sidebar ── */}
              <aside className="lg:sticky lg:top-28 space-y-0 rounded-2xl border border-zinc-800/70 bg-zinc-900/50 p-5 divide-y divide-zinc-800/60">
                <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.18em] pb-3">
                  Project info
                </p>

                {/* Views */}
                <MetaRow icon={Eye} label="Views">
                  {project.view_count?.toLocaleString() ?? '—'}
                </MetaRow>

                {/* Updated */}
                <MetaRow icon={Calendar} label="Cập nhật">
                  {formatDate(project.updated_at)}
                </MetaRow>

                {/* Type */}
                {project.project_type && (
                  <MetaRow icon={Tag} label="Loại">
                    <span className="capitalize">{project.project_type.replace('_', ' ')}</span>
                  </MetaRow>
                )}

                {/* Tech stack */}
                {project.tech_stack?.length > 0 && (
                  <MetaRow icon={Layers} label="Tech Stack">
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {project.tech_stack.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-md text-[10px] bg-zinc-800 text-zinc-400 border border-zinc-700/50"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </MetaRow>
                )}
              </aside>

            </div>
          ) : null}
        </div>
      </main>

      <Footer />
    </>
  );
}