import { Link } from 'react-router-dom';
import { ArrowLeft, FileQuestion } from 'lucide-react';
import SEO from '../../components/common/SEO';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

export default function NotFoundPage() {
  return (
    <>
      <SEO title="404 — Không tìm thấy trang" />
      <Navbar />
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <FileQuestion size={64} className="text-zinc-700 mx-auto mb-6" />
          <p className="text-8xl font-bold text-zinc-800 mb-4 select-none">404</p>
          <h1 className="text-2xl font-bold text-white mb-3">Trang không tồn tại</h1>
          <p className="text-zinc-400 mb-8 max-w-sm mx-auto">
            Trang bạn tìm kiếm đã bị xóa hoặc không bao giờ tồn tại.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium transition-colors"
          >
            <ArrowLeft size={16} /> Về trang chủ
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
