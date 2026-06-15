const CATEGORY_LABELS = {
  frontend:   'Frontend',
  backend:    'Backend',
  database:   'Database',
  devops:     'DevOps',
  language:   'Languages',
  tool:       'Tools',
  ai_ml:      'AI / ML',
  other:      'Other',
};

const PROFICIENCY_COLOR = {
  beginner:     'bg-zinc-600',
  intermediate: 'bg-blue-500',
  advanced:     'bg-violet-500',
  expert:       'bg-emerald-500',
};

function SkillItem({ skill }) {
  const { name, proficiency, proficiency_percent, icon_name, color, years_of_experience } = skill;

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50 hover:border-zinc-600 transition-colors">
      {/* Icon */}
      <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
        {icon_name ? (
          <img
            src={`https://cdn.simpleicons.org/${icon_name}`}
            alt={name}
            className="w-6 h-6"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        ) : (
          <span
            className="w-6 h-6 rounded text-xs font-bold flex items-center justify-center bg-zinc-700 text-zinc-300"
            style={color ? { backgroundColor: `${color}20`, color } : undefined}
          >
            {name.charAt(0)}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-white truncate">{name}</span>
          <span className="text-xs text-zinc-500 ml-2 flex-shrink-0">
            {years_of_experience != null ? `${years_of_experience}y` : ''}
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-1.5 rounded-full bg-zinc-700 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${PROFICIENCY_COLOR[proficiency] ?? 'bg-violet-500'}`}
            style={{ width: `${proficiency_percent}%` }}
            role="progressbar"
            aria-valuenow={proficiency_percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${name}: ${proficiency_percent}%`}
          />
        </div>
      </div>

      <span className="text-xs text-zinc-500 capitalize flex-shrink-0">{proficiency}</span>
    </div>
  );
}

export default function SkillGroup({ category, skills }) {
  return (
    <section aria-labelledby={`skill-group-${category}`}>
      <h3
        id={`skill-group-${category}`}
        className="text-sm font-semibold text-violet-400 uppercase tracking-wider mb-4"
      >
        {CATEGORY_LABELS[category] ?? category}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {skills.map((skill) => (
          <SkillItem key={skill.id} skill={skill} />
        ))}
      </div>
    </section>
  );
}
