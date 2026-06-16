import { Mail, MapPin, Phone } from 'lucide-react';
import SEO from '../../components/common/SEO';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import ContactForm from '../../components/contact/ContactForm';

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);
const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const INFO = [
  {
    icon:  Mail,
    label: 'Email',
    value: 'minh2m5@gmail.com',
    href:  'mailto:minh2m5@gmail.com',
    color: 'text-violet-400',
    bg:    'bg-violet-500/10 border-violet-500/20',
  },
  {
    icon:  Phone,
    label: 'Phone',
    value: '0354 128 488',
    href:  'tel:+84354128488',
    color: 'text-cyan-400',
    bg:    'bg-cyan-500/10 border-cyan-500/20',
  },
  {
    icon:  GithubIcon,
    label: 'GitHub',
    value: 'github.com/nNm205',
    href:  'https://github.com/nNm205',
    color: 'text-zinc-300',
    bg:    'bg-zinc-800/80 border-zinc-700/60',
  },
  {
    icon:  LinkedinIcon,
    label: 'LinkedIn',
    value: 'linkedin.com/in/minh-dev',
    href:  'https://linkedin.com/in/minh-dev',
    color: 'text-sky-400',
    bg:    'bg-sky-500/10 border-sky-500/20',
  },
  {
    icon:  MapPin,
    label: 'Location',
    value: 'Bình Minh, Hà Nội, Việt Nam',
    href:  null,
    color: 'text-emerald-400',
    bg:    'bg-emerald-500/10 border-emerald-500/20',
  },
];

export default function ContactPage() {
  return (
    <>
      <SEO title="Contact" description="Liên hệ với tôi." />
      <Navbar />

      <main className="min-h-screen bg-zinc-950">

        {/* ── Page hero ── */}
        <div className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Dot-grid */}
          <div
            className="absolute inset-0 opacity-[0.3]"
            style={{
              backgroundImage: 'radial-gradient(circle, #3f3f46 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />
          {/* Violet glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(139,92,246,0.14) 0%, transparent 70%)',
            }}
          />

          <div className="relative z-10 max-w-6xl mx-auto">
            <p className="text-xs font-mono text-violet-500 uppercase tracking-[0.2em] mb-3">
              Get In Touch
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4">
              Liên hệ
            </h1>
            <p className="text-zinc-400 text-base max-w-xl leading-relaxed">
              Có dự án muốn hợp tác hoặc chỉ muốn nói chuyện? Tôi luôn sẵn sàng lắng nghe.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-800/70" />

        {/* ── Main content ── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">

            {/* ── Left: contact info ── */}
            <div className="lg:col-span-2 space-y-3">
              <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-5">
                Contact Info
              </p>

              {INFO.map(({ icon: Icon, label, value, href, color, bg }) => (
                <div
                  key={label}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/70 hover:border-zinc-700/80 transition-all duration-200"
                >
                  <div
                    className={`w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 ${bg} ${color}`}
                  >
                    <Icon size={15} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.12em] mb-0.5">
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-zinc-300 hover:text-white transition-colors truncate block"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-xs text-zinc-300 truncate">{value}</p>
                    )}
                  </div>
                </div>
              ))}

              {/* Availability badge */}
              <div className="mt-6 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0 animate-pulse" />
                <p className="text-xs text-emerald-400 font-medium">
                  Đang tìm kiếm vị trí AI Engineer Intern
                </p>
              </div>
            </div>

            {/* ── Right: form ── */}
            <div className="lg:col-span-3">
              <div className="rounded-2xl border border-zinc-800/70 bg-zinc-900/50 p-8">
                <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-6">
                  Send a Message
                </p>
                <ContactForm />
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
