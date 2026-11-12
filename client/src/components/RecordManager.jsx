import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { useAuth } from '../auth/AuthContext.jsx';

// Lists records from one API resource. Administrators also get a form to create and edit records
// and buttons to delete them; everyone else sees the records read-only.
// fields: [{ name, label, type?: 'text'|'email'|'textarea', required?: boolean }]
export default function RecordManager({ resource, label, fields, renderItem, allowCreate = true }) {
  const { isAdmin } = useAuth();
  const blank = Object.fromEntries(fields.map((f) => [f.name, '']));

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [form, setForm] = useState(blank);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setLoadError('');
    try { setItems(await api(`/${resource}`)); } catch (err) { setLoadError(err.message); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [resource]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const err = {};
    fields.forEach((f) => {
      const v = String(form[f.name] || '').trim();
      if (f.required && !v) err[f.name] = `${f.label} is required`;
      else if (f.type === 'email' && v && !/^\S+@\S+\.\S+$/.test(v)) err[f.name] = 'Enter a valid email address';
    });
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const resetForm = () => { setForm(blank); setEditingId(null); setErrors({}); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', text: '' });
    if (!validate()) { setStatus({ type: 'error', text: 'Please fix the highlighted fields.' }); return; }
    setSaving(true);
    try {
      if (editingId) {
        await api(`/${resource}/${editingId}`, { method: 'PUT', body: form });
        setStatus({ type: 'success', text: `${label} updated.` });
      } else {
        await api(`/${resource}`, { method: 'POST', body: form });
        setStatus({ type: 'success', text: `${label} created.` });
      }
      resetForm();
      await load();
    } catch (err) {
      setErrors(err.errors || {});
      setStatus({ type: 'error', text: err.message });
    } finally { setSaving(false); }
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    // Date inputs need yyyy-mm-dd; MongoDB returns a full ISO date.
    setForm(Object.fromEntries(fields.map((f) => [f.name, f.type === 'date' && item[f.name] ? String(item[f.name]).slice(0, 10) : (item[f.name] ?? '')])));
    setErrors({});
    setStatus({ type: '', text: '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete this ${label.toLowerCase()}?`)) return;
    setStatus({ type: '', text: '' });
    try {
      await api(`/${resource}/${item._id}`, { method: 'DELETE' });
      setStatus({ type: 'success', text: `${label} deleted.` });
      if (editingId === item._id) resetForm();
      await load();
    } catch (err) { setStatus({ type: 'error', text: err.message }); }
  };

  const showForm = isAdmin && (allowCreate || editingId);

  return (
    <div className="manager">
      {status.text && <p className={`alert ${status.type}`} role="status">{status.text}</p>}

      {isAdmin ? (
        <p className="badge admin">Administrator: you can create, edit and delete records.</p>
      ) : (
        <p className="badge">Read-only view. Only administrators can change these records.</p>
      )}

      {showForm && (
        <form className="panel" onSubmit={handleSubmit} noValidate>
          <h2>{editingId ? `Edit ${label.toLowerCase()}` : `Add ${label.toLowerCase()}`}</h2>
          {fields.map((f) => (
            <label key={f.name}>{f.label}{f.required ? ' *' : ''}
              {f.type === 'textarea'
                ? <textarea name={f.name} rows="3" value={form[f.name]} onChange={handleChange} />
                : <input name={f.name} type={f.type || 'text'} value={form[f.name]} onChange={handleChange} />}
              {errors[f.name] && <span className="field-error">{errors[f.name]}</span>}
            </label>
          ))}
          <div className="row">
            <button className="btn" type="submit" disabled={saving}>{saving ? 'Saving...' : editingId ? 'Save changes' : 'Create'}</button>
            {editingId && <button className="btn secondary" type="button" onClick={resetForm}>Cancel</button>}
          </div>
        </form>
      )}

      {loading && <p className="alert info">Loading...</p>}
      {loadError && <p className="alert error">{loadError}</p>}
      {!loading && !loadError && items.length === 0 && <p>No records yet.</p>}

      <div className="grid">
        {items.map((item, index) => (
          <article className="card" key={item._id}>
            {renderItem(item, index)}
            {isAdmin && (
              <div className="row">
                <button className="btn small" type="button" onClick={() => startEdit(item)}>Edit</button>
                <button className="btn small danger" type="button" onClick={() => handleDelete(item)}>Delete</button>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
