import { Eye, EyeOff, Pencil, Plus, RefreshCw, Save, Star, Trash2, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { adminApi } from '../services/adminApi';
import ImageUploader from './ImageUploader';

const definitions = {
  projects: { title: 'Projects', singular: 'project', folder: 'projects' },
  reviews: { title: 'Customer reviews', singular: 'review', folder: 'reviews' },
  'company-logos': { title: 'Company logos', singular: 'company', folder: 'company-logos' },
};

function blankItem(type, order) {
  const common = { published: false, displayOrder: order, draftId: crypto.randomUUID() };
  if (type === 'projects') return { ...common, title: '', shortDescription: '', fullDescription: '', status: 'future', clientName: '', location: '', startDate: '', completionDate: '', mainImageUrl: '', mainImagePath: '', additionalImageUrls: [], additionalImagePaths: [] };
  if (type === 'reviews') return { ...common, customerName: '', companyName: '', reviewText: '', rating: 5, customerImageUrl: '', customerImagePath: '' };
  return { ...common, companyName: '', logoUrl: '', logoPath: '', websiteUrl: '' };
}

function cleanPayload(item) {
  const { id, createdAt, updatedAt, draftId, ...payload } = item;
  return payload;
}

function StatusBadge({ item, type }) {
  if (type === 'projects') return <span className={`admin-status ${item.status}`}>{item.status}</span>;
  return <span className={`admin-status ${item.published ? 'published' : 'hidden'}`}>{item.published ? 'Published' : 'Hidden'}</span>;
}

function ConfirmDialog({ item, onCancel, onConfirm, deleting }) {
  return <div className="admin-dialog-backdrop" role="presentation"><div className="admin-confirm-dialog" role="alertdialog" aria-modal="true"><span className="admin-danger-icon"><Trash2 size={22} /></span><h3>Delete this content?</h3><p>This action removes the record and its managed images. It cannot be undone.</p><div><button type="button" className="admin-secondary-button" onClick={onCancel}>Cancel</button><button type="button" className="admin-danger-button" onClick={() => onConfirm(item)} disabled={deleting}>{deleting ? 'Deleting...' : 'Delete'}</button></div></div></div>;
}

function TextField({ label, name, value, onChange, required = false, type = 'text', maxLength }) {
  return <label className="admin-field"><span>{label}{required && ' *'}</span><input type={type} name={name} value={value ?? ''} onChange={onChange} required={required} maxLength={maxLength} /></label>;
}

function ProjectFields({ form, setForm, onChange }) {
  function addImage(uploaded) {
    if (!uploaded.url) return;
    setForm((current) => ({ ...current, additionalImageUrls: [...current.additionalImageUrls, uploaded.url], additionalImagePaths: [...current.additionalImagePaths, uploaded.path] }));
  }
  function removeImage(index) {
    setForm((current) => ({ ...current, additionalImageUrls: current.additionalImageUrls.filter((_, itemIndex) => itemIndex !== index), additionalImagePaths: current.additionalImagePaths.filter((_, itemIndex) => itemIndex !== index) }));
  }
  return <><div className="admin-form-grid"><TextField label="Project title" name="title" value={form.title} onChange={onChange} required maxLength={160} /><label className="admin-field"><span>Status *</span><select name="status" value={form.status} onChange={onChange}><option value="future">Future</option><option value="ongoing">Ongoing</option><option value="completed">Completed</option></select></label><TextField label="Client name" name="clientName" value={form.clientName} onChange={onChange} maxLength={160} /><TextField label="Location" name="location" value={form.location} onChange={onChange} maxLength={160} /><TextField label="Start date" name="startDate" value={form.startDate} onChange={onChange} type="date" /><TextField label="Completion date" name="completionDate" value={form.completionDate} onChange={onChange} type="date" /></div><label className="admin-field"><span>Short description *</span><textarea name="shortDescription" value={form.shortDescription} onChange={onChange} required rows={3} maxLength={500} /></label><label className="admin-field"><span>Full description *</span><textarea name="fullDescription" value={form.fullDescription} onChange={onChange} required rows={6} maxLength={5000} /></label><ImageUploader label="Main project image" folder="projects" entityId={form.id || form.draftId} value={{ url: form.mainImageUrl, path: form.mainImagePath }} onChange={(image) => setForm({ ...form, mainImageUrl: image.url, mainImagePath: image.path })} /><div className="admin-additional-images"><span>Additional project images</span><div>{form.additionalImageUrls.map((url, index) => <figure key={url}><img src={url} alt="Project" /><button type="button" onClick={() => removeImage(index)}><X size={15} /></button></figure>)}</div><ImageUploader key={form.additionalImageUrls.length} label="Add another image" folder="projects" entityId={form.id || form.draftId} value={{ url: '', path: '' }} onChange={addImage} /></div></>;
}

function ReviewFields({ form, setForm, onChange }) {
  return <><div className="admin-form-grid"><TextField label="Customer name" name="customerName" value={form.customerName} onChange={onChange} required maxLength={120} /><TextField label="Company name" name="companyName" value={form.companyName} onChange={onChange} maxLength={160} /><label className="admin-field"><span>Rating *</span><select name="rating" value={form.rating} onChange={onChange}>{[5, 4, 3, 2, 1].map((rating) => <option value={rating} key={rating}>{rating} stars</option>)}</select></label></div><label className="admin-field"><span>Review *</span><textarea name="reviewText" value={form.reviewText} onChange={onChange} required rows={6} maxLength={2000} /></label><ImageUploader label="Customer image (optional)" folder="reviews" entityId={form.id || form.draftId} value={{ url: form.customerImageUrl, path: form.customerImagePath }} onChange={(image) => setForm({ ...form, customerImageUrl: image.url, customerImagePath: image.path })} /></>;
}

function CompanyFields({ form, setForm, onChange }) {
  return <><div className="admin-form-grid"><TextField label="Company name" name="companyName" value={form.companyName} onChange={onChange} required maxLength={160} /><TextField label="Website URL" name="websiteUrl" value={form.websiteUrl} onChange={onChange} type="url" /></div><ImageUploader label="Company logo *" folder="company-logos" entityId={form.id || form.draftId} value={{ url: form.logoUrl, path: form.logoPath }} onChange={(image) => setForm({ ...form, logoUrl: image.url, logoPath: image.path })} /></>;
}

function Editor({ type, item, itemCount, onClose, onSaved }) {
  const [form, setForm] = useState(item ? { ...item, draftId: item.id } : blankItem(type, itemCount));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const definition = definitions[type];
  function onChange(event) {
    const { name, value, type: inputType, checked } = event.target;
    setForm((current) => ({ ...current, [name]: inputType === 'checkbox' ? checked : name === 'displayOrder' || name === 'rating' ? Number(value) : value }));
  }
  async function save(event) {
    event.preventDefault();
    if (type === 'company-logos' && !form.logoUrl) { setError('A company logo is required.'); return; }
    setSaving(true);
    setError('');
    try {
      const result = form.id ? await adminApi.update(type, form.id, cleanPayload(form)) : await adminApi.create(type, cleanPayload(form));
      onSaved(result.item);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  }
  return <div className="admin-editor-backdrop"><form className="admin-editor" onSubmit={save}><header><div><span>{form.id ? 'Edit' : 'Add'} {definition.singular}</span><h3>{form.id ? (form.title || form.customerName || form.companyName) : `New ${definition.singular}`}</h3></div><button type="button" onClick={onClose} aria-label="Close editor"><X size={21} /></button></header><div className="admin-editor-body">{type === 'projects' && <ProjectFields form={form} setForm={setForm} onChange={onChange} />}{type === 'reviews' && <ReviewFields form={form} setForm={setForm} onChange={onChange} />}{type === 'company-logos' && <CompanyFields form={form} setForm={setForm} onChange={onChange} />}<div className="admin-form-grid admin-publish-row"><TextField label="Display order" name="displayOrder" value={form.displayOrder} onChange={onChange} type="number" /><label className="admin-toggle"><input type="checkbox" name="published" checked={form.published} onChange={onChange} /><span>{form.published ? <Eye size={18} /> : <EyeOff size={18} />}</span><div><b>{form.published ? 'Published' : 'Hidden'}</b><small>Controls visibility on the public website</small></div></label></div>{error && <div className="admin-alert error" role="alert">{error}</div>}</div><footer><button className="admin-secondary-button" type="button" onClick={onClose}>Cancel</button><button className="admin-primary-button" type="submit" disabled={saving}><Save size={17} />{saving ? 'Saving...' : 'Save changes'}</button></footer></form></div>;
}

export default function ContentManager({ type, items = [], setItems, loading, onReload }) {
  const [editorItem, setEditorItem] = useState(undefined);
  const [deletingItem, setDeletingItem] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState('');
  const definition = definitions[type];
  const sortedItems = useMemo(() => [...items].sort((a, b) => a.displayOrder - b.displayOrder), [items]);

  useEffect(() => {
    if (editorItem === undefined && !deletingItem) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [editorItem, deletingItem]);

  function saved(item) {
    setItems((current) => current.some((existing) => existing.id === item.id) ? current.map((existing) => existing.id === item.id ? item : existing) : [...current, item]);
    setEditorItem(undefined);
    setMessage(`${definition.singular[0].toUpperCase()}${definition.singular.slice(1)} saved successfully.`);
  }
  async function remove(item) {
    setDeleting(true);
    try {
      await adminApi.remove(type, item.id);
      setItems((current) => current.filter((existing) => existing.id !== item.id));
      setDeletingItem(null);
      setMessage('Content deleted successfully.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setDeleting(false);
    }
  }

  return <section className="admin-view"><div className="admin-view-heading"><div><span>Content management</span><h2>{definition.title}</h2></div><div><button className="admin-icon-button" type="button" onClick={onReload} title="Reload"><RefreshCw size={18} /></button><button className="admin-primary-button" type="button" onClick={() => setEditorItem(null)}><Plus size={18} />Add {definition.singular}</button></div></div>{message && <div className="admin-alert success" role="status">{message}<button onClick={() => setMessage('')}><X size={15} /></button></div>}{loading ? <div className="admin-empty-state">Loading {definition.title.toLowerCase()}...</div> : sortedItems.length === 0 ? <div className="admin-empty-state"><Plus size={25} /><h3>No {definition.title.toLowerCase()} yet</h3><p>Add the first item to begin managing this section.</p></div> : <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Content</th><th>Status</th><th>Order</th><th>Visibility</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{sortedItems.map((item) => <tr key={item.id}><td><div className="admin-content-cell">{(item.mainImageUrl || item.customerImageUrl || item.logoUrl) ? <img src={item.mainImageUrl || item.customerImageUrl || item.logoUrl} alt="" /> : <span className="admin-placeholder-image">{type === 'reviews' ? <Star size={18} /> : definition.title[0]}</span>}<div><b>{item.title || item.customerName || item.companyName}</b><small>{item.shortDescription || item.companyName || item.websiteUrl || 'No secondary detail'}</small></div></div></td><td><StatusBadge item={item} type={type} /></td><td>{item.displayOrder}</td><td>{item.published ? <span className="admin-visibility"><Eye size={15} />Published</span> : <span className="admin-visibility muted"><EyeOff size={15} />Hidden</span>}</td><td><div className="admin-row-actions"><button type="button" onClick={() => setEditorItem(item)} title="Edit"><Pencil size={16} /></button><button className="danger" type="button" onClick={() => setDeletingItem(item)} title="Delete"><Trash2 size={16} /></button></div></td></tr>)}</tbody></table></div>}{editorItem !== undefined && <Editor type={type} item={editorItem} itemCount={items.length} onClose={() => setEditorItem(undefined)} onSaved={saved} />}{deletingItem && <ConfirmDialog item={deletingItem} onCancel={() => setDeletingItem(null)} onConfirm={remove} deleting={deleting} />}</section>;
}
