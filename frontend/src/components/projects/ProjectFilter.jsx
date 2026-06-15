import { cn } from '../../utils/cn';

const TECH_OPTIONS = [
  'React', 'FastAPI', 'Python', 'TypeScript', 'PostgreSQL',
  'Docker', 'Node.js', 'Next.js', 'Supabase',
];

export default function ProjectFilter({ activeTech, onTechChange, className }) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)} role="group" aria-label="Filter theo tech stack">
      <button
        type="button"
        onClick={() => onTechChange(null)}
        className={cn(
          'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
          activeTech == null
            ? 'bg-violet-600 text-white'
            : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700',
        )}
      >
        All
      </button>
      {TECH_OPTIONS.map((tech) => (
        <button
          key={tech}
          type="button"
          onClick={() => onTechChange(activeTech === tech ? null : tech)}
          className={cn(
            'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
            activeTech === tech
              ? 'bg-violet-600 text-white'
              : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700',
          )}
        >
          {tech}
        </button>
      ))}
    </div>
  );
}
