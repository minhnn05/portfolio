/** Mỗi category nhận một màu accent khác nhau — đồng bộ với SkillsPreview */
const ACCENT_COLORS = [
  {
    dot:    'bg-violet-500',
    text:   'text-violet-400',
    border: 'border-violet-500/20',
    bg:     'bg-violet-500/5',
    bar:    'bg-violet-500',
    glow:   'shadow-violet-900/20',
  },
  {
    dot:    'bg-cyan-500',
    text:   'text-cyan-400',
    border: 'border-cyan-500/20',
    bg:     'bg-cyan-500/5',
    bar:    'bg-cyan-500',
    glow:   'shadow-cyan-900/20',
  },
  {
    dot:    'bg-emerald-500',
    text:   'text-emerald-400',
    border: 'border-emerald-500/20',
    bg:     'bg-emerald-500/5',
    bar:    'bg-emerald-500',
    glow:   'shadow-emerald-900/20',
  },
  {
    dot:    'bg-amber-500',
    text:   'text-amber-400',
    border: 'border-amber-500/20',
    bg:     'bg-amber-500/5',
    bar:    'bg-amber-500',
    glow:   'shadow-amber-900/20',
  },
  {
    dot:    'bg-rose-500',
    text:   'text-rose-400',
    border: 'border-rose-500/20',
    bg:     'bg-rose-500/5',
    bar:    'bg-rose-500',
    glow:   'shadow-rose-900/20',
  },
  {
    dot:    'bg-sky-500',
    text:   'text-sky-400',
    border: 'border-sky-500/20',
    bg:     'bg-sky-500/5',
    bar:    'bg-sky-500',
    glow:   'shadow-sky-900/20',
  },
];

const CATEGORY_LABELS = {
  frontend:  'Frontend',
  backend:   'Backend',
  database:  'Database',
  devops:    'DevOps',
  language:  'Languages',
  tool:      'Tools',
  ai_ml:     'AI / ML',
  other:     'Other',
};

const PROFICIENCY_LABEL = {
  beginner:     'Beginner',
  intermediate: 'Intermediate',
  advanced:     'Advanced',
  expert:       'Expert',
};

function SkillItem({ skill, barColor }) {
  const {
    name,
    proficiency,
    proficiency_percent,
    icon_name,
    color,
    years_of_experience,
  } = skill;

  const label = PROFICIENCY_LABEL[proficiency] ?? proficiency;

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700/80 hover:bg-zinc-900 transition-all duration-200 group">
      {/* Icon */}
      <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-lg bg-zinc-800/80 border border-zinc-700/50">
        {icon_name ? (
          <img
            src={`https://cdn.simpleicons.org/${icon_name}`}
            alt={name}
            className="w-[18px] h-[18px]"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        ) : (
          <span
            className="text-xs font-bold text-zinc-400"
            style={color ? { color } : undefined}
          >
            {name.charAt(0)}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-zinc-200 truncate">{name}</span>
          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            {years_of_experience != null && (
              <span className="text-[10px] font-mono text-zinc-600">
                {years_of_experience}y
              </span>
            )}
            <span className="text-[10px] font-mono text-zinc-600">
              {proficiency_percent}%
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 rounded-full bg-zinc-800 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${barColor}`}
            style={{ width: `${proficiency_percent ?? 0}%` }}
            role="progressbar"
            aria-valuenow={proficiency_percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${name}: ${label}`}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * SkillGroup — card container cho một category
 * Nhận `group` object { category/name, skills[] } và `index` để chọn accent color
 */
export default function SkillGroup({ group, index = 0 }) {
  const accent   = ACCENT_COLORS[index % ACCENT_COLORS.length];
  const catKey   = group.category ?? group.name ?? '';
  const label    = CATEGORY_LABELS[catKey] ?? catKey;
  const skills   = group.skills ?? [];

  return (
    <section
      aria-labelledby={`skill-group-${catKey}`}
      className={`rounded-2xl border ${accent.border} ${accent.bg} p-6 hover:shadow-lg ${accent.glow} transition-all duration-300`}
    >
      {/* Category header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <span className={`w-2 h-2 rounded-full ${accent.dot} flex-shrink-0`} />
          <h3
            id={`skill-group-${catKey}`}
            className={`text-xs font-semibold uppercase tracking-[0.15em] ${accent.text}`}
          >
            {label}
          </h3>
        </div>
        <span className="text-[10px] font-mono text-zinc-600">
          {skills.length} skills
        </span>
      </div>

      {/* Skill items */}
      <div className="flex flex-col gap-2">
        {skills.map((skill) => (
          <SkillItem key={skill.id} skill={skill} barColor={accent.bar} />
        ))}
      </div>
    </section>
  );
}
