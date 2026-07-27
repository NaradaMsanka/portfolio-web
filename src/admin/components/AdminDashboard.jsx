import { Building2, FolderKanban, Inbox, LayoutDashboard, LogOut, Menu, MessageSquareQuote, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import Logo from '../../components/Logo';
import { adminApi } from '../services/adminApi';
import ContentManager from './ContentManager';
import DashboardOverview from './DashboardOverview';
import EnquiryManager from './EnquiryManager';

const navigation = [
  ['overview', 'Overview', LayoutDashboard],
  ['enquiries', 'Project enquiries', Inbox],
  ['projects', 'Projects', FolderKanban],
  ['reviews', 'Customer reviews', MessageSquareQuote],
  ['company-logos', 'Company logos', Building2],
];

export default function AdminDashboard({ username, onLogout }) {
  const [active, setActive] = useState('overview');
  const [mobileNav, setMobileNav] = useState(false);
  const [data, setData] = useState({ enquiries: [], projects: [], reviews: [], 'company-logos': [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const entries = await Promise.all(['enquiries', 'projects', 'reviews', 'company-logos'].map(async (type) => [type, (await adminApi.list(type)).items]));
      setData(Object.fromEntries(entries));
    } catch (loadError) {
      if (loadError.status === 401) {
        onLogout();
        return;
      }
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, [onLogout]);

  useEffect(() => { loadAll(); }, [loadAll]);

  function select(item) {
    setActive(item);
    setMobileNav(false);
  }

  const setItems = (type) => (updater) => setData((current) => {
    const currentItems = Array.isArray(current[type]) ? current[type] : [];
    return { ...current, [type]: typeof updater === 'function' ? updater(currentItems) : updater };
  });

  return (
    <main className="admin-dashboard">
      <aside className={mobileNav ? 'open' : ''}>
        <div className="admin-sidebar-brand"><Logo light /><button type="button" onClick={() => setMobileNav(false)} aria-label="Close menu"><X size={20} /></button></div>
        <nav aria-label="Admin navigation">{navigation.map(([id, label, NavIcon]) => <button className={active === id ? 'active' : ''} key={id} type="button" onClick={() => select(id)}><NavIcon size={18} /><span>{label}</span></button>)}</nav>
        <div className="admin-sidebar-user"><span>{username.slice(0, 1).toUpperCase()}</span><div><b>{username}</b><small>Administrator</small></div></div>
        <button className="admin-logout" type="button" onClick={onLogout}><LogOut size={17} /><span>Sign out</span></button>
      </aside>
      {mobileNav && <button className="admin-nav-scrim" onClick={() => setMobileNav(false)} aria-label="Close navigation" />}
      <section className="admin-main">
        <header className="admin-topbar"><button className="admin-mobile-menu" type="button" onClick={() => setMobileNav(true)} aria-label="Open navigation"><Menu size={21} /></button><div><span>AVENTRO PROJECTS</span><small>Content administration</small></div><a href="/" target="_blank" rel="noreferrer">View website</a></header>
        <div className="admin-workspace">{error && <div className="admin-alert error">{error}<button onClick={loadAll}>Retry</button></div>}{active === 'overview' && <DashboardOverview data={data} loading={loading} />}{active === 'enquiries' && <EnquiryManager items={data.enquiries} setItems={setItems('enquiries')} loading={loading} onReload={loadAll} />}{active !== 'overview' && active !== 'enquiries' && <ContentManager type={active} items={Array.isArray(data[active]) ? data[active] : []} setItems={setItems(active)} loading={loading} onReload={loadAll} />}</div>
      </section>
    </main>
  );
}
