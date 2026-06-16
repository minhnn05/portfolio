import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useSkillsGrouped } from '../../hooks/useSkills';
import LoadingSpinner from '../common/LoadingSpinner';

/** Mỗi category nhận một màu accent khác nhau */
const CATEGORY_COLORS = [
  { dot: 'bg-violet-500',  text: 'text-violet-400',  border: 'border-violet-500/20', bg: 'bg-violet-500/5'  },
  { dot: 'bg-cyan-500',    text: 'text-cyan-400',    border: 'border-cyan-500/20',   bg: 'bg-cyan-500/5'    },
  { dot: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-500/20',bg: 'bg-emerald-500/5' },
  { dot: 'bg-amber-500',   text: 'text-amber-400',   border: 'border-amber-500/20',  bg: 'bg-amber-500/5'   },
];

export default function SkillsPreview() {
  const { groups, isLoading } = useSkillsGrouped();

  if (isLoading) return <div className="flex justify-center py-24"><LoadingSpinner /></div>;
  if (!groups.length) return null;

  const preview = groups.slice(0, 4);

  return (
    <section className="py-28 bg-zinc-900/40 border-y border-zinc-800/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="flex items-end justify-between mb-14">
          <div>
            <p className="text-xs font-mono text-violet-500 uppercase tracking-[0.2em] mb-3">
              02 — Expertise
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
              Tech
              <br />
              Stack
            </h2>
          </div>
          <Link
            to="/skills"
            className="hidden sm:inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-violet-400 transition-colors group"
          >
            Xem chi tiết
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Category groups */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {preview.map((group, gi) => {
            const color = CATEGORY_COLORS[gi % CATEGORY_COLORS.length];
            return (
              <div
                key={group.id ?? group.name}
                className={`rounded-2xl border ${color.border} ${color.bg} p-5`}
              >
                {/* Category label */}
                <div className="flex items-center gap-2 mb-4">
                  <span className={`w-2 h-2 rounded-full ${color.dot} flex-shrink-0`} />
                  <span className={`text-xs font-semibold uppercase tracking-widest ${color.text}`}>
                    {group.name}
                  </span>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2">
                  {group.skills.slice(0, 6).map((skill) => (
                    <span
                      key={skill.id}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900/70 border border-zinc-700/50 text-zinc-300 text-xs"
                    >
                      {skill.icon_name && (
                        <img
                          src={`https://cdn.simpleicons.org/${skill.icon_name}`}
                          alt=""
                          aria-hidden="true"
                          className="w-3.5 h-3.5 flex-shrink-0"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      )}
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile "see all" */}
        <div className="mt-10 flex justify-center sm:hidden">
          <Link
            to="/skills"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors"
          >
            Xem tất cả skills <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}