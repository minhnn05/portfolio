import { Link } from 'react-router-dom';
import { ExternalLink, Star } from 'lucide-react';
import { cn } from '../../utils/cn';

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

export default function ProjectCard({ project, className }) {
  const {
    title, slug, summary, thumbnail_url, tech_stack = [],
    github_url, live_url, github_stars, is_featured, status,
  } = project;

  return (
    <article
      className={cn(
        'group relative flex flex-col rounded-xl border border-zinc-800',
        'bg-zinc-900 overflow-hidden hover:border-violet-500/50 transition-all duration-300',
        'hover:shadow-lg hover:shadow-violet-500/5',
        className,
      )}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-zinc-800">
        {thumbnail_url ? (
          <img
            src={thumbnail_url}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-3xl font-bold text-zinc-700 select-none">
              {title.charAt(0)}
            </span>
          </div>
        )}

        {is_featured && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-medium bg-violet-600 text-white">
            Featured
          </span>
        )}
        {status === 'in_progress' && (
          <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-xs font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30">
            In Progress
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-semibold text-white text-base mb-2 line-clamp-1">
          <Link
            to={`/projects/${slug}`}
            className="hover:text-violet-400 transition-colors after:absolute after:inset-0"
          >
            {title}
          </Link>
        </h3>

        <p className="text-sm text-zinc-400 line-clamp-2 mb-4 flex-1">{summary}</p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tech_stack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 rounded text-xs bg-zinc-800 text-zinc-300 border border-zinc-700"
            >
              {tech}
            </span>
          ))}
          {tech_stack.length > 4 && (
            <span className="px-2 py-0.5 rounded text-xs text-zinc-500">
              +{tech_stack.length - 4}
            </span>
          )}
        </div>

        {/* Footer links */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
          <div className="flex items-center gap-3">
            {github_url && (
              <a
                href={github_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="relative z-10 text-zinc-400 hover:text-white transition-colors"
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
                className="relative z-10 text-zinc-400 hover:text-white transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink size={16} />
              </a>
            )}
          </div>
          {github_stars != null && (
            <span className="flex items-center gap-1 text-xs text-zinc-500">
              <Star size={12} className="text-amber-400" />
              {github_stars}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
