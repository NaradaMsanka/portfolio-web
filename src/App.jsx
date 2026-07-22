import Layout from './components/Layout';
import AboutPage from './pages/AboutPage';
import ClientsPage from './pages/ClientsPage';
import ContactPage from './pages/ContactPage';
import HomePage, { Certifications } from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import ServicesPage from './pages/ServicesPage';

export default function App() {
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
