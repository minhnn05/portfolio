import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

/**
 * Logo — monogram "NM" với gradient violet→cyan
 * size: 'sm' | 'md' | 'lg'
 */
export default function Logo({ className, size = 'md', ...linkProps }) {
  const sizes = {
    sm: { box: 'w-7 h-7 rounded-lg',       text: 'text-[11px]', gap: 'gap-2',    label: 'text-sm'  },
    md: { box: 'w-8 h-8 rounded-[10px]',   text: 'text-xs',     gap: 'gap-2.5',  label: 'text-sm'  },
    lg: { box: 'w-10 h-10 rounded-xl',     text: 'text-sm',     gap: 'gap-3',    label: 'text-base' },
  };
  const s = sizes[size] ?? sizes.md;

  return (
    <Link
      to="/"
      aria-label="Trang chủ — Nguyễn Nhật Minh"
      className={cn(
        'inline-flex items-center group select-none focus-visible:outline-none',
        s.gap,
        className,
      )}
      {...linkProps}
    >
      {/* Monogram box */}
      <span
        className={cn(
          'flex-shrink-0 flex items-center justify-center font-bold tracking-tight',
          'transition-all duration-300',
          'group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-violet-900/40',
          s.box,
          s.text,
        )}
        style={{
          background: 'linear-gradient(135deg, #7c3aed 0%, #0891b2 100%)',
          color: '#fff',
        }}
      >
        NM
      </span>

      {/* Wordmark */}
      <span
        className={cn(
          'font-semibold tracking-tight transition-colors duration-200',
          'text-white group-hover:text-violet-300',
          s.label,
        )}
      >
        Nhật Minh
      </span>
    </Link>
  );
}
