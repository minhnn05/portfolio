import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail } from 'lucide-react';

const SOCIAL = [
  { href: 'https://github.com/yourusername', icon: Github,   label: 'GitHub'   },
  { href: 'https://linkedin.com/in/you',     icon: Linkedin, label: 'LinkedIn' },
  { href: 'mailto:you@email.com',            icon: Mail,     label: 'Email'    },
];

const LINKS = [
  { to: '/projects', label: 'Projects' },
  { to: '/blog',     label: 'Blog'     },
  { to: '/skills',   label: 'Skills'   },
  { to: '/about',    label: 'About'    },
  { to: '/contact',  label: 'Contact'  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-zinc-900 border-t border-zinc-800 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="text-lg font-bold text-white hover:text-violet-400 transition-colors">
              &lt;Minh /&gt;
            </Link>
            <p className="mt-2 text-sm text-zinc-400 max-w-xs">
              Full-stack developer. Building things with React, FastAPI và PostgreSQL.
            </p>
          </div>

          {/* Nav */}
          <nav aria-label="Footer navigation">
            <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-3">
              Navigation
            </h3>
            <ul className="space-y-2" role="list">
              {LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-zinc-400 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Social */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-3">
              Connect
            </h3>
            <div className="flex gap-3">
              {SOCIAL.map(({ href, icon: Icon, label }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-800 text-center text-xs text-zinc-500">
          © {year} Minh. Built with React + FastAPI.
        </div>
      </div>
    </footer>
  );
}
