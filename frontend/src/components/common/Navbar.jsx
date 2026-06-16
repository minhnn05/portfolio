import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { cn } from '../../utils/cn';
import Logo from './Logo';

const NAV_LINKS = [
  { to: '/',         label: 'Home'     },
  { to: '/projects', label: 'Projects' },
  { to: '/blog',     label: 'Blog'     },
  { to: '/skills',   label: 'Skills'   },
  { to: '/about',    label: 'About'    },
  { to: '/contact',  label: 'Contact'  },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Easter egg: click logo 5 lần trong 3 giây
  const logoClickCount = useRef(0);
  const logoClickTimer = useRef(null);

  const handleLogoClick = useCallback((e) => {
    logoClickCount.current += 1;
    clearTimeout(logoClickTimer.current);

    if (logoClickCount.current >= 5) {
      logoClickCount.current = 0;
      navigate('/admin/login');
      return;
    }

    logoClickTimer.current = setTimeout(() => {
      logoClickCount.current = 0;
    }, 3000);
  }, [navigate]);

  // Keyboard shortcut: Ctrl+Shift+A
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        navigate('/admin/login');
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [navigate]);

  // đóng mobile menu khi đổi route
  useEffect(() => { setIsOpen(false); }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800 shadow-lg'
          : 'bg-transparent',
      )}
    >
      <nav
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Logo onClick={handleLogoClick} />

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1" role="list">
          {NAV_LINKS.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  cn(
                    'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'text-violet-400 bg-violet-500/10'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800',
                  )
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          type="button"
          className="md:hidden p-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          onClick={() => setIsOpen((o) => !o)}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label={isOpen ? 'Đóng menu' : 'Mở menu'}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div
          id="mobile-menu"
          className="md:hidden bg-zinc-900/98 border-b border-zinc-800 px-4 pb-4"
        >
          <ul className="flex flex-col gap-1 pt-2" role="list">
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    cn(
                      'block px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                      isActive
                        ? 'text-violet-400 bg-violet-500/10'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800',
                    )
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
