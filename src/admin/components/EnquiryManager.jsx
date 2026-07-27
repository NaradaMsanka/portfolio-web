import { Check, Mail, Phone, RefreshCw, Trash2, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { adminApi } from '../services/adminApi';

function toDate(value) {
  if (!value) return null;
  if (typeof value.toDate === 'function') return value.toDate();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatDate(value) {
  const date = toDate(value);
  return date ? new Intl.DateTimeFormat('en-LK', { dateStyle: 'medium', timeStyle: 'short' }).format(date) : 'Just now';
}

export default function EnquiryManager({ items = [], setItems, loading, onReload }) {
  const [selected, setSelected] = useState(null);
  const [working, setWorking] = useState('');
  const [error, setError] = useState('');
  const sortedItems = useMemo(() => [...items].sort((a, b) => (toDate(b.createdAt)?.getTime() || 0) - (toDate(a.createdAt)?.getTime() || 0)), [items]);

  async function openEnquiry(item) {
    setSelected(item);
    setError('');
    if (item.status === 'read') return;
    try {
      await adminApi.update('enquiries', item.id, { status: 'read' });
      const updated = { ...item, status: 'read' };
      setSelected(updated);
      setItems((current) => current.map((entry) => entry.id === item.id ? updated : entry));
    } catch (updateError) {
      setError(updateError.message);
    }
  }

  async function remove(item) {
    setWorking(item.id);
    setError('');
    try {
      await adminApi.remove('enquiries', item.id);
      setItems((current) => current.filter((entry) => entry.id !== item.id));
      setSelected(null);
    } catch (removeError) {
      setError(removeError.message);
    } finally {
      setWorking('');
    }
  }

  return <section className="admin-view"><div className="admin-view-heading"><div><span>Customer communication</span><h2>Project enquiries</h2></div><div><button className="admin-icon-button" type="button" onClick={onReload} title="Reload enquiries"><RefreshCw size={18} /></button></div></div>{error && <div className="admin-alert error" role="alert">{error}<button onClick={() => setError('')}><X size={15} /></button></div>}{loading ? <div className="admin-empty-state">Loading project enquiries...</div> : sortedItems.length === 0 ? <div className="admin-empty-state"><Mail size={25} /><h3>No enquiries yet</h3><p>New project enquiries will appear here.</p></div> : <div className="admin-enquiry-layout"><div className="admin-enquiry-list">{sortedItems.map((item) => <button className={`admin-enquiry-item ${item.status !== 'read' ? 'unread' : ''} ${selected?.id === item.id ? 'selected' : ''}`} type="button" key={item.id} onClick={() => openEnquiry(item)}><span className="admin-enquiry-dot" aria-hidden="true" /><div><span><b>{item.name}</b><time>{formatDate(item.createdAt)}</time></span><strong>{item.type || 'General enquiry'}</strong><p>{item.message}</p></div></button>)}</div><div className="admin-enquiry-detail">{selected ? <><header><div><span className={`admin-status ${selected.status === 'read' ? 'hidden' : 'published'}`}>{selected.status === 'read' ? 'Read' : 'New'}</span><h3>{selected.type || 'General enquiry'}</h3><p>Received {formatDate(selected.createdAt)}</p></div><button type="button" onClick={() => setSelected(null)} aria-label="Close enquiry"><X size={19} /></button></header><div className="admin-enquiry-contact"><div><span>{selected.name}</span><a href={`mailto:${selected.email}`}><Mail size={15} />{selected.email}</a>{selected.phone && <a href={`tel:${selected.phone}`}><Phone size={15} />{selected.phone}</a>}</div><span className={`admin-mail-state ${selected.notificationStatus || 'pending'}`}>{selected.notificationStatus === 'sent' ? <Check size={14} /> : null}Email notification: {selected.notificationStatus || 'pending'}</span></div><div className="admin-enquiry-message">{selected.message}</div><footer><button className="admin-danger-button" type="button" onClick={() => remove(selected)} disabled={working === selected.id}><Trash2 size={16} />{working === selected.id ? 'Deleting...' : 'Delete'}</button><a className="admin-primary-button" href={`mailto:${selected.email}?subject=${encodeURIComponent(`Re: ${selected.type || 'Project enquiry'}`)}`}><Mail size={16} />Reply by email</a></footer></> : <div className="admin-enquiry-placeholder"><Mail size={27} /><p>Select an enquiry to read its details.</p></div>}</div></div>}</section>;
}
