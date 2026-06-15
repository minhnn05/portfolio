import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FolderKanban, FileText, MessageSquare, Eye, Wrench } from 'lucide-react';
import Sidebar from '../../components/admin/Sidebar';
import { projectService } from '../../services/projectService';
import { blogService } from '../../services/blogService';
import { messageService } from '../../services/messageService';
import { skillService } from '../../services/skillService';

function StatCard({ icon: Icon, label, value, to, color = 'violet' }) {
  const colors = {
    violet: 'bg-violet-500/10 border-violet-500/20 text-violet-400',
    blue:   'bg-blue-500/10 border-blue-500/20 text-blue-400',
    cyan:   'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
    emerald:'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    amber:  'bg-amber-500/10 border-amber-500/20 text-amber-400',
  };
  return (
    <Link
      to={to}
      className="p-6 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors"
    >
      <div className={`w-10 h-10 rounded-lg border flex items-center justify-center mb-4 ${colors[color]}`}>
        <Icon size={18} />
      </div>
      <p className="text-2xl font-bold text-white mb-1">{value ?? '—'}</p>
      <p className="text-sm text-zinc-400">{label}</p>
    </Link>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ projects: null, blogs: null, messages: null, unread: null, skills: null });

  useEffect(() => {
    Promise.allSettled([
      projectService.adminGetAll({ page: 1, page_size: 1 }),
      blogService.adminGetAll({ page: 1, page_size: 1 }),
      messageService.adminGetAll({ page: 1, page_size: 1 }),
      skillService.getAll(),
    ]).then(([p, b, m, s]) => {
      setStats({
        projects: p.status === 'fulfilled' ? p.value.total : '?',
        blogs:    b.status === 'fulfilled' ? b.value.total : '?',
        messages: m.status === 'fulfilled' ? m.value.total : '?',
        unread:   m.status === 'fulfilled' ? m.value.unread_count : '?',
        skills:   s.status === 'fulfilled' ? s.value.length : '?',
      });
    });
  }, []);

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-zinc-400 text-sm mt-1">Tổng quan portfolio</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          <StatCard icon={FolderKanban} label="Projects"        value={stats.projects} to="/admin/projects"  color="violet"  />
          <StatCard icon={FileText}     label="Blog Posts"      value={stats.blogs}    to="/admin/blogs"     color="blue"    />
          <StatCard icon={Wrench}       label="Skills"          value={stats.skills}   to="/admin/skills"    color="cyan"    />
          <StatCard icon={MessageSquare}label="Messages"        value={stats.messages} to="/admin/messages"  color="emerald" />
          <StatCard icon={Eye}          label="Unread Messages" value={stats.unread}   to="/admin/messages"  color="amber"   />
        </div>

        {/* Quick links */}
        <div>
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            {[
              { to: '/admin/projects', label: '+ New Project' },
              { to: '/admin/blogs',    label: '+ New Blog Post' },
              { to: '/admin/messages', label: 'View Messages' },
            ].map(({ to, label }) => (
              <Link key={to} to={to}
                className="px-4 py-2 rounded-lg text-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
