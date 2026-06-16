import { Link } from 'react-router-dom';
import { ArrowRight, Download, Code2, Globe, BookOpen } from 'lucide-react';
import SEO from '../../components/common/SEO';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

const TIMELINE = [
  {
    year:  'Mar 2026 – Jun 2026',
    title: 'NIM Research — AI Engineer / GenAI Systems',
    desc:  'Xây dựng agentic AI platform tự động hoá quy trình nghiên cứu học thuật với LangGraph, RAG, multi-agent pipeline.',
  },
  {
    year:  'Sep 2023 – nay',
    title: 'B.Sc. Computer Science — UET, VNU',
    desc:  'GPA 3.43/4.0. Chuyên sâu AI/ML, Deep Learning, LLMs, cấu trúc dữ liệu & giải thuật.',
  },
  {
    year:  '2020 – 2023',
    title: 'THPT Chuyên Nguyễn Huệ',
    desc:  'Tốt nghiệp THPT chuyên, định hướng Công nghệ Thông tin.',
  },
];

const VALUES = [
  {
    icon:  Code2,
    title: 'AI-First Thinking',
    desc:  'Ứng dụng LLMs, RAG và Agentic AI để giải quyết vấn đề thực tế.',
    color: 'text-violet-400',
    bg:    'bg-violet-500/10 border-violet-500/20',
  },
  {
    icon:  Globe,
    title: 'Full-Stack Craft',
    desc:  'Từ React frontend đến FastAPI backend và PostgreSQL — end-to-end ownership.',
    color: 'text-cyan-400',
    bg:    'bg-cyan-500/10 border-cyan-500/20',
  },
  {
    icon:  BookOpen,
    title: 'Keep Learning',
    desc:  'Không ngừng cập nhật: ML, Deep Learning, LLMs và hệ thống phân tán.',
    color: 'text-emerald-400',
    bg:    'bg-emerald-500/10 border-emerald-500/20',
  },
];

export default function AboutPage() {
  return (
    <>
      <SEO title="About" description="Nguyễn Nhật Minh — Software Engineer, AI/GenAI enthusiast. B.Sc. CS tại UET VNU, GPA 3.43/4.0." />
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
              About Me
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4">
              Xin chào! 👋
            </h1>
            <p className="text-zinc-400 text-base max-w-xl leading-relaxed">
              Tôi là{' '}
              <span className="text-white font-medium">Nguyễn Nhật Minh</span> — Software Engineer
              với đam mê Artificial Intelligence và Generative AI.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-800/70" />

        {/* ── Main content ── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

          {/* Story + Timeline */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">

            {/* Story */}
            <div>
              <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-4">
                My Story
              </p>
              <div className="space-y-4 text-zinc-400 leading-relaxed text-sm">
                <p>
                  Tôi là Software Engineer với niềm đam mê với{' '}
                  <span className="text-violet-400 font-medium">Artificial Intelligence</span> và{' '}
                  <span className="text-violet-400 font-medium">Generative AI</span>, tập trung
                  vào xây dựng các hệ thống phần mềm thông minh và có thể mở rộng.
                </p>
                <p>
                  Tôi có kinh nghiệm thực tế phát triển full-stack web applications và backend systems.
                  Hiện đang mở rộng kiến thức về{' '}
                  <span className="text-cyan-400 font-medium">Machine Learning</span>,{' '}
                  <span className="text-cyan-400 font-medium">Deep Learning</span> và{' '}
                  <span className="text-emerald-400 font-medium">LLMs</span>, với trọng tâm là
                  RAG và Agentic AI systems.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold tracking-wide transition-colors shadow-lg shadow-violet-900/30"
                >
                  Xem Projects <ArrowRight size={14} />
                </Link>
                <a
                  href="/cv.pdf"
                  download
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-zinc-700 hover:border-zinc-500 bg-white/[0.03] hover:bg-white/[0.07] text-zinc-300 hover:text-white text-sm font-semibold tracking-wide transition-all"
                >
                  <Download size={14} /> Download CV
                </a>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-6">
                Timeline
              </p>
              <div className="relative space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-zinc-800">
                {TIMELINE.map(({ year, title, desc }) => (
                  <div key={year} className="relative pl-10">
                    {/* Node */}
                    <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-zinc-900 border-2 border-violet-500/60 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                    </div>
                    <p className="text-[10px] font-mono text-violet-500 uppercase tracking-[0.1em] mb-1">
                      {year}
                    </p>
                    <h3 className="text-sm font-semibold text-white mb-0.5">{title}</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Education + Focus Areas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">

            {/* Education */}
            <div className="rounded-2xl border border-zinc-800/70 bg-zinc-900/50 p-6">
              <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-5">
                Education
              </p>
              <div className="space-y-5">
                <div>
                  <p className="text-[10px] font-mono text-violet-500 uppercase tracking-[0.1em] mb-1">
                    Sep 2023 – Sep 2027
                  </p>
                  <h3 className="text-sm font-semibold text-white mb-0.5">
                    B.Sc. Computer Science
                  </h3>
                  <p className="text-xs text-zinc-400 mb-1">
                    University of Engineering and Technology, VNU
                  </p>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-amber-500/10 border border-amber-500/20 text-amber-400">
                    GPA 3.43 / 4.0
                  </span>
                </div>
                <div className="border-t border-zinc-800/60 pt-5">
                  <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.1em] mb-1">
                    2020 – 2023
                  </p>
                  <h3 className="text-sm font-semibold text-white mb-0.5">
                    THPT Chuyên Nguyễn Huệ
                  </h3>
                  <p className="text-xs text-zinc-500">Hà Nội, Việt Nam</p>
                </div>
              </div>
            </div>

            {/* AI Focus Areas */}
            <div className="rounded-2xl border border-violet-500/15 bg-violet-500/5 p-6">
              <p className="text-[10px] font-mono text-violet-500 uppercase tracking-[0.2em] mb-5">
                AI Focus Areas
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  'Large Language Models',
                  'RAG Systems',
                  'Agentic AI',
                  'Multi-Agent Systems',
                  'LangGraph',
                  'Vector Databases',
                  'NLP',
                  'Deep Learning',
                  'Machine Learning',
                  'Sentence Transformers',
                ].map((area) => (
                  <span
                    key={area}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-900/70 border border-zinc-700/50 text-zinc-300"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="mb-16">
            <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em] mb-6">
              Values
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {VALUES.map(({ icon: Icon, title, desc, color, bg }) => (
                <div
                  key={title}
                  className={`rounded-2xl border ${bg} p-6`}
                >
                  <div className={`w-9 h-9 rounded-xl ${bg} border flex items-center justify-center mb-4 ${color}`}>
                    <Icon size={18} />
                  </div>
                  <h3 className={`text-sm font-semibold mb-2 ${color}`}>{title}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA banner */}
          <div
            className="relative rounded-2xl border border-zinc-800/70 bg-zinc-900/50 overflow-hidden p-10 text-center"
          >
            {/* Subtle glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 60% 80% at 50% 100%, rgba(139,92,246,0.08) 0%, transparent 70%)',
              }}
            />
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-white mb-3">
                Hãy kết nối với tôi
              </h2>
              <p className="text-zinc-500 text-sm mb-8 max-w-sm mx-auto">
                Tôi luôn sẵn sàng cho các cơ hội và dự án thú vị.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold tracking-wide transition-colors shadow-lg shadow-violet-900/30"
              >
                Liên hệ ngay <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
