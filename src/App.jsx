import { lazy, Suspense } from 'react';
import Layout from './components/Layout';
import AboutPage from './pages/AboutPage';
import ClientsPage from './pages/ClientsPage';
import ContactPage from './pages/ContactPage';
import HomePage, { Certifications } from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import ServicesPage from './pages/ServicesPage';

const AdminApp = lazy(() => import('./admin/AdminApp'));

export default function App() {
  if (window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin/')) {
    return <Suspense fallback={<main className="admin-route-loading">Loading admin...</main>}><AdminApp /></Suspense>;
  }

  return (
    <Layout>
      <HomePage />
      <AboutPage />
      <ServicesPage />
      <ProjectsPage />
      <ClientsPage />
      <Certifications />
      <ContactPage />
    </Layout>
  );
}
