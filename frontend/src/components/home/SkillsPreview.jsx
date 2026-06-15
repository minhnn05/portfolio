import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { skillService } from '../../services/skillService';
import LoadingSpinner from '../common/LoadingSpinner';

export default function SkillsPreview() {
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    skillService.getGrouped()
      .then(setGroups)
      .catch(() => setGroups([]))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <div className="flex justify-center py-16"><LoadingSpinner /></div>;
  if (!groups.length) return null;

  // hiển thị tối đa 4 groups, mỗi group tối đa 5 skills
  const preview = groups.slice(0, 4);

  return (
    <section className="py-24 bg-zinc-900/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-violet-400 text-sm font-medium uppercase tracking-wider mb-2">
              Expertise
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Tech Stack</h2>
          </div>
          <Link
            to="/skills"
            className="hidden sm:inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Xem chi tiết <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {preview.flatMap((g) =>
            g.skills.slice(0, 5).map((skill) => (
              <div
                key={skill.id}
                className="flex items-center gap-2.5 p-3 rounded-lg bg-zinc-800/60 border border-zinc-700/50"
              >
                {skill.icon_name && (
                  <img
                    src={`https://cdn.simpleicons.org/${skill.icon_name}`}
                    alt={skill.name}
                    className="w-5 h-5 flex-shrink-0"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                )}
                <span className="text-sm text-zinc-200 truncate">{skill.name}</span>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 flex justify-center sm:hidden">
          <Link
            to="/skills"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
          >
            Xem tất cả skills <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
