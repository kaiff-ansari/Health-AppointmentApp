import { Routes, Route } from 'react-router-dom';
import PageLayout from './components/layout/PageLayout';
import { AuthProvider } from './context/AuthContext';

// Patient Facing Pages
import Home           from './pages/Home';
import About          from './pages/About';
import Specialization from './pages/Specialization';
import Treatments     from './pages/Treatments';
import Experience     from './pages/Experience';
import Reviews        from './pages/Reviews';
import Blog           from './pages/Blog';
import FAQ            from './pages/FAQ';
import Contact        from './pages/Contact';

// Admin Console
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminResetPassword from './pages/admin/AdminResetPassword';
import ProtectedRoute from './pages/admin/components/ProtectedRoute';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* ── Admin Reset Password Route (Public with token) ──────── */}
        <Route path="/admin/reset-password" element={<AdminResetPassword />} />

        {/* ── Protected Admin Portal Route ─────────────────────────── */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* ── Patient Public Website Routes ─────────────────────────── */}
        <Route
          path="/*"
          element={
            <PageLayout>
              <Routes>
                <Route path="/"               element={<Home />} />
                <Route path="/about"          element={<About />} />
                <Route path="/specialization" element={<Specialization />} />
                <Route path="/treatments"     element={<Treatments />} />
                <Route path="/experience"     element={<Experience />} />
                <Route path="/reviews"        element={<Reviews />} />
                <Route path="/blog"           element={<Blog />} />
                <Route path="/faqs"           element={<FAQ />} />
                <Route path="/contact"        element={<Contact />} />
                <Route path="*"               element={<Home />} />
              </Routes>
            </PageLayout>
          }
        />
      </Routes>
    </AuthProvider>
  );
}
