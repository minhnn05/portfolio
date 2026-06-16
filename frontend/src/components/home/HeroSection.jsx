import { Link } from 'react-router-dom';
import { ArrowRight, Mail } from 'lucide-react';

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);
const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const SOCIAL = [
  { href: 'https://github.com/nNm205',        icon: GithubIcon,   label: 'GitHub'   },
  { href: 'https://linkedin.com/in/minh-dev', icon: LinkedinIcon, label: 'LinkedIn' },
  { href: 'mailto:minh2m5@gmail.com',         icon: Mail,         label: 'Email'    },
];

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-zinc-950"
      aria-label="Hero"
    >
      {/* Dot-grid background */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'radial-gradient(circle, #52525b 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Violet glow — signature element */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 0%, rgba(139,92,246,0.18) 0%, transparent 70%)',
        }}
      />

      {/* Soft edge fade so grid doesn't clip hard */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 90% 60% at 50% 100%, rgba(9,9,11,0.7) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">

          {/* Status badge */}
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-wide text-violet-300 bg-violet-500/10 border border-violet-500/25 mb-8 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Đang tìm kiếm vị trí AI Engineer Intern
          </span>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold tracking-tight text-white mb-5 leading-[1.05]">
            Xin chào,{' '}
            <br className="sm:hidden" />
            tôi là{' '}
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: 'linear-gradient(135deg, #a78bfa 0%, #67e8f9 100%)',
              }}
            >
              Minh
            </span>
          </h1>

          {/* Role */}
          <p className="text-lg sm:text-xl text-zinc-400 font-light mb-6 tracking-wide uppercase">
            Software Engineer · AI / GenAI
          </p>

          {/* Description */}
          <p className="text-zinc-400 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Xây dựng full-stack applications và hệ thống AI thông minh với{' '}
            <span className="text-violet-400 font-medium">LLMs</span>,{' '}
            <span className="text-cyan-400 font-medium">RAG</span> và{' '}
            <span className="text-emerald-400 font-medium">Agentic AI</span>.
          </p>

          {/* CTA row */}
          <div className="flex flex-col sm:flex-row items-center gap-3 mb-12">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold tracking-wide transition-colors shadow-lg shadow-violet-900/40"
            >
              Xem Projects <ArrowRight size={15} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-zinc-700 hover:border-zinc-500 bg-white/[0.03] hover:bg-white/[0.07] text-zinc-300 hover:text-white text-sm font-semibold tracking-wide transition-all"
            >
              Liên hệ
            </Link>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-3">
            {SOCIAL.map(({ href, icon: Icon, label }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="p-2.5 rounded-xl text-zinc-500 hover:text-white bg-white/[0.03] hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-600 transition-all"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-zinc-600 select-none">
        <span className="text-[10px] tracking-widest uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-zinc-600 to-transparent" />
      </div>
    </section>
  );
}