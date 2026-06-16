import { Link } from 'react-router-dom';
import { ExternalLink, Star } from 'lucide-react';
import { cn } from '../../utils/cn';

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

export default function ProjectCard({ project, className }) {
  const {
    title, slug, summary, thumbnail_url, tech_stack = [],
    github_url, live_url, github_stars, is_featured, status,
  } = project;

  const statusMeta = STATUS_MAP[status] ?? null;

  return (
    <article
      className={cn(
        'group relative flex flex-col rounded-2xl border border-zinc-800',
        'bg-zinc-900/60 overflow-hidden',
        'hover:border-violet-500/40 hover:bg-zinc-900',
        'hover:shadow-xl hover:shadow-violet-950/30',
        'transition-all duration-300',
        className,
      )}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-zinc-800/80">
        {thumbnail_url ? (
          <img
            src={thumbnail_url}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          /* Placeholder với gradient đồng bộ Hero */
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background: 'radial-gradient(ellipse at top, rgba(139,92,246,0.12) 0%, transparent 70%), #18181b',
            }}
          >
            <span className="text-4xl font-bold text-zinc-700 select-none font-mono">
              {title.charAt(0)}
            </span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          {is_featured && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-violet-600 text-white tracking-wide">
              Featured
            </span>
          )}
        </div>
        {statusMeta && status !== 'completed' && (
          <span
            className={cn(
              'absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-semibold border',
              statusMeta.className,
            )}
          >
            {statusMeta.label}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        {/* Title */}
        <h3 className="font-semibold text-white text-sm mb-1.5 line-clamp-1 leading-snug">
          <Link
            to={`/projects/${slug}`}
            className="hover:text-violet-400 transition-colors after:absolute after:inset-0"
          >
            {title}
          </Link>
        </h3>

        <p className="text-xs text-zinc-500 line-clamp-2 mb-4 flex-1 leading-relaxed">{summary}</p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tech_stack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-zinc-800 text-zinc-400 border border-zinc-700/60"
            >
              {tech}
            </span>
          ))}
          {tech_stack.length > 4 && (
            <span className="px-2 py-0.5 rounded-md text-[10px] text-zinc-600 bg-zinc-800 border border-zinc-700/40">
              +{tech_stack.length - 4}
            </span>
          )}
        </div>

        {/* Footer: links + stars */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80">
          <div className="flex items-center gap-3">
            {github_url && (
              <a
                href={github_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="relative z-10 text-zinc-500 hover:text-white transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <GithubIcon />
              </a>
            )}
            {live_url && (
              <a
                href={live_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Live demo"
                className="relative z-10 text-zinc-500 hover:text-violet-400 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink size={15} />
              </a>
            )}
          </div>
          {github_stars != null && (
            <span className="flex items-center gap-1 text-[11px] text-zinc-600">
              <Star size={11} className="text-amber-500/80" />
              {github_stars}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}