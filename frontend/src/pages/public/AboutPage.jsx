import { Link } from 'react-router-dom';
import { ArrowRight, Download } from 'lucide-react';
import SEO from '../../components/common/SEO';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

const TIMELINE = [
  { year: '2024 – nay',  title: 'Full-Stack Developer',   desc: 'Xây dựng web apps với React + FastAPI.' },
  { year: '2023 – 2024', title: 'Học lập trình',          desc: 'Python, JavaScript, SQL, cấu trúc dữ liệu.' },
  { year: '2020 – 2023', title: 'Đại học',                desc: 'Khoa Công nghệ Thông tin.' },
];

export default function AboutPage() {
  return (
    <>
      <SEO title="About" description="Về tôi — developer đam mê xây dựng sản phẩm." />
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-16 text-center">
            <p className="text-violet-400 text-sm font-medium uppercase tracking-wider mb-2">About Me</p>
            <h1 className="text-4xl font-bold text-white mb-6">Xin chào! 👋</h1>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Tôi là <span className="text-white font-medium">Minh</span> — một full-stack developer
              đam mê xây dựng những sản phẩm web đẹp, hiệu quả và dễ sử dụng.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Story */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Câu chuyện của tôi</h2>
              <div className="space-y-4 text-zinc-400 leading-relaxed">
                <p>
                  Tôi bắt đầu với Python và dần mở rộng sang web development. Hiện tại tôi tập trung
                  vào React ở frontend và FastAPI ở backend.
                </p>
                <p>
                  Tôi thích giải quyết những vấn đề thực tế và tạo ra trải nghiệm người dùng tốt.
                  Luôn học hỏi và cập nhật công nghệ mới.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors"
                >
                  Xem Projects <ArrowRight size={14} />
                </Link>
                <a
                  href="/cv.pdf"
                  download
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white text-sm font-medium transition-colors"
                >
                  <Download size={14} /> Download CV
                </a>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Timeline</h2>
              <div className="relative space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-zinc-800">
                {TIMELINE.map(({ year, title, desc }) => (
                  <div key={year} className="relative pl-10">
                    <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-zinc-800 border-2 border-violet-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-violet-400" />
                    </div>
                    <p className="text-xs text-violet-400 font-medium mb-1">{year}</p>
                    <h3 className="text-sm font-semibold text-white">{title}</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center p-8 rounded-2xl bg-zinc-900 border border-zinc-800">
            <h2 className="text-2xl font-bold text-white mb-3">Hãy kết nối với tôi</h2>
            <p className="text-zinc-400 mb-6">Tôi luôn sẵn sàng cho các cơ hội thú vị.</p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium transition-colors"
            >
              Liên hệ ngay <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
