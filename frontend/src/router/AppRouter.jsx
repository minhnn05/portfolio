import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ProtectedRoute from './ProtectedRoute';

// ── Public pages (lazy) ───────────────────────────────────────────────────────
const HomePage         = lazy(() => import('../pages/public/HomePage'));
const ProjectsPage     = lazy(() => import('../pages/public/ProjectsPage'));
const ProjectDetailPage = lazy(() => import('../pages/public/ProjectDetailPage'));
const BlogPage         = lazy(() => import('../pages/public/BlogPage'));
const BlogDetailPage   = lazy(() => import('../pages/public/BlogDetailPage'));
const SkillsPage       = lazy(() => import('../pages/public/SkillsPage'));
const AboutPage        = lazy(() => import('../pages/public/AboutPage'));
const ContactPage      = lazy(() => import('../pages/public/ContactPage'));

// ── Admin pages (lazy) ────────────────────────────────────────────────────────
const AdminLoginPage   = lazy(() => import('../pages/admin/AdminLoginPage'));
const AdminDashboard   = lazy(() => import('../pages/admin/AdminDashboard'));
const AdminProjects    = lazy(() => import('../pages/admin/AdminProjects'));
const AdminBlogs       = lazy(() => import('../pages/admin/AdminBlogs'));
const AdminMessages    = lazy(() => import('../pages/admin/AdminMessages'));
const AdminSkills      = lazy(() => import('../pages/admin/AdminSkills'));

const Fallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner />
  </div>
);

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Fallback />}>
        <Routes>
          {/* ── Public ─────────────────────────────────────────────────── */}
          <Route path="/"                    element={<HomePage />} />
          <Route path="/projects"            element={<ProjectsPage />} />
          <Route path="/projects/:slug"      element={<ProjectDetailPage />} />
          <Route path="/blog"                element={<BlogPage />} />
          <Route path="/blog/:slug"          element={<BlogDetailPage />} />
          <Route path="/skills"              element={<SkillsPage />} />
          <Route path="/about"               element={<AboutPage />} />
          <Route path="/contact"             element={<ContactPage />} />

          {/* ── Admin login (public) ────────────────────────────────────── */}
          <Route path="/admin/login"         element={<AdminLoginPage />} />

          {/* ── Admin protected ─────────────────────────────────────────── */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin"             element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard"   element={<AdminDashboard />} />
            <Route path="/admin/projects"    element={<AdminProjects />} />
            <Route path="/admin/blogs"       element={<AdminBlogs />} />
            <Route path="/admin/skills"      element={<AdminSkills />} />
            <Route path="/admin/messages"    element={<AdminMessages />} />
          </Route>

          {/* ── 404 ─────────────────────────────────────────────────────── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
