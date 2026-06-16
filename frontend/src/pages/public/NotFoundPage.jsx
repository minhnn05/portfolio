import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SEO from '../../components/common/SEO';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

export default function NotFoundPage() {
  return (
    <>
      <SEO title="404 — Không tìm thấy trang" />
      <Navbar />

      <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 relative overflow-hidden">
        {/* Dot-grid */}
        <div
          className="absolute inset-0 opacity-[0.25]"
          style={{
            backgroundImage: 'radial-gradient(circle, #3f3f46 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        {/* Violet glow — center */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(139,92,246,0.1) 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 text-center">
          {/* Big 404 */}
          <p
            className="text-[10rem] sm:text-[14rem] font-bold leading-none select-none"
            style={{
              backgroundImage: 'linear-gradient(135deg, #3f3f46 0%, #27272a 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            404
          </p>

          <h1 className="text-2xl font-bold text-white mb-3 -mt-4">
            Trang không tồn tại
          </h1>
          <p className="text-zinc-500 text-sm mb-10 max-w-sm mx-auto leading-relaxed">
            Trang bạn tìm kiếm đã bị xóa hoặc không bao giờ tồn tại.
          </p>

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold tracking-wide transition-colors shadow-lg shadow-violet-900/30"
          >
            <ArrowLeft size={15} /> Về trang chủ
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
}
