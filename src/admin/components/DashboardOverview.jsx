import { Building2, CheckCircle2, Clock3, FolderKanban, MessageSquareQuote, Telescope } from 'lucide-react';

export default function DashboardOverview({ data, loading }) {
  const projects = data.projects || [];
  const cards = [
    ['Total projects', projects.length, FolderKanban],
    ['Future projects', projects.filter((item) => item.status === 'future').length, Telescope],
    ['Ongoing projects', projects.filter((item) => item.status === 'ongoing').length, Clock3],
    ['Completed projects', projects.filter((item) => item.status === 'completed').length, CheckCircle2],
    ['Customer reviews', data.reviews?.length || 0, MessageSquareQuote],
    ['Company logos', data['company-logos']?.length || 0, Building2],
  ];

  return <section className="admin-view"><div className="admin-view-heading"><div><span>Dashboard overview</span><h2>Website content at a glance</h2></div></div><div className="admin-summary-grid">{cards.map(([label, value, CardIcon]) => <article key={label}><div><span>{label}</span><strong>{loading ? '—' : value}</strong></div><CardIcon size={22} /></article>)}</div></section>;
}
