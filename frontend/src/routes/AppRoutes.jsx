import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import AdminLayout from '../layouts/AdminLayout';
import { useAuth } from '../context/AuthContext';

const HomePage = lazy(() => import('../pages/HomePage'));
const InstitutionsPage = lazy(() => import('../pages/InstitutionsPage'));
const InstitutionDetailPage = lazy(() => import('../pages/InstitutionDetailPage'));

const SimplePagesModule = lazy(() =>
  import('../pages/SimplePages').then(module => ({
    default: function SimplePageRoute({ page }) {
      const pages = {
        about: module.AboutPage,
        activities: module.ActivitiesPage,
        news: module.NewsPage,
        events: module.EventsPage,
        gallery: module.GalleryPage,
        contact: module.ContactPage,
        donate: module.DonatePage
      };
      const Component = pages[page];
      return Component ? <Component /> : null;
    }
  }))
);
const AdminLogin = lazy(() => import('../pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const AdminInstitutions = lazy(() => import('../pages/admin/AdminInstitutions'));
const AdminContent = lazy(() => import('../pages/admin/AdminContent'));
const AdminAccounts = lazy(() => import('../pages/admin/AdminAccounts'));

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="page-loading">Loading...</div>;
  return user ? children : <Navigate to="/admin/login" replace />;
}

function PageLoading() {
  return <div className="page-loading">Loading page...</div>;
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoading />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<SimplePagesModule page="about" />} />
          <Route path="/institutions" element={<InstitutionsPage />} />
          <Route path="/institutions/:slug" element={<InstitutionDetailPage />} />
          <Route path="/activities" element={<SimplePagesModule page="activities" />} />
          <Route path="/news" element={<SimplePagesModule page="news" />} />
          <Route path="/events" element={<SimplePagesModule page="events" />} />
          <Route path="/gallery" element={<SimplePagesModule page="gallery" />} />
          <Route path="/contact" element={<SimplePagesModule page="contact" />} />
          <Route path="/donate" element={<SimplePagesModule page="donate" />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route element={<Protected><AdminLayout /></Protected>}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/institutions" element={<AdminInstitutions />} />
          <Route path="/admin/content" element={<AdminContent />} />
          <Route path="/admin/accounts" element={<AdminAccounts />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
