import { cn } from '../../utils/cn';

const TECH_OPTIONS = [
  'React', 'FastAPI', 'Python', 'TypeScript', 'PostgreSQL',
  'Docker', 'Node.js', 'Next.js', 'Supabase',
];

export default function ProjectFilter({ activeTech, onTechChange, totalCount, className }) {
  return (
    <div className={cn('space-y-3', className)}>
      {/* Label */}
      <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.18em]">
        Filter by tech stack
      </p>

      {/* Pills */}
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Filter theo tech stack"
      >
        {/* "All" pill */}
        <button
          type="button"
          onClick={() => onTechChange(null)}
          className={cn(
            'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all',
            activeTech == null
              ? 'bg-violet-600 text-white shadow-md shadow-violet-900/40'
              : 'bg-zinc-800/80 text-zinc-400 border border-zinc-700/60 hover:border-zinc-600 hover:text-zinc-200',
          )}
        >
          All
          {totalCount != null && activeTech == null && (
            <span className="text-violet-300 font-normal">{totalCount}</span>
          )}
        </button>

        {TECH_OPTIONS.map((tech) => (
          <button
            key={tech}
            type="button"
            onClick={() => onTechChange(activeTech === tech ? null : tech)}
            className={cn(
              'px-3.5 py-1.5 rounded-full text-xs font-medium transition-all',
              activeTech === tech
                ? 'bg-violet-600 text-white shadow-md shadow-violet-900/40'
                : 'bg-zinc-800/80 text-zinc-400 border border-zinc-700/60 hover:border-zinc-600 hover:text-zinc-200',
            )}
          >
            {tech}
          </button>
        ))}
      </div>
    </div>
  );
}