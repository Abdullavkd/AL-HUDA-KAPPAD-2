import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const emptyForm = {
  name: '',
  type: 'school',
  shortDescription: '',
  description: '',
  establishedYear: '',
  address: '',
  phone: '',
  email: '',
  website: '',
  locationUrl: '',
  logoUrl: '',
  coverImageUrl: '',
  mission: '',
  vision: '',
  displayOrder: 0,
  isPublished: true
};

export default function AdminInstitutions() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [coverFile, setCoverFile] = useState(null);
  const [galleryFile, setGalleryFile] = useState(null);
  const [photoBusy, setPhotoBusy] = useState(false);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/admin/institutions');
      setItems(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load institutions. Please sign in again if your session has expired.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function change(event) {
    const { name, value, type, checked } = event.target;
    setForm(current => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value
    }));
  }

  function edit(item) {
    setEditingId(item._id);
    setCoverFile(null); setGalleryFile(null);
    setForm({
      ...emptyForm,
      ...item,
      establishedYear: item.establishedYear || '',
      displayOrder: item.displayOrder ?? 0
    });
    setError('');
    setMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function reset() {
    setEditingId(null);
    setForm(emptyForm);
    setCoverFile(null); setGalleryFile(null);
    setError('');
    setMessage('');
  }

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    const payload = {
      ...form,
      establishedYear: form.establishedYear ? Number(form.establishedYear) : undefined,
      displayOrder: Number(form.displayOrder || 0)
    };

    try {
      let saved;
      if (editingId) {
        const response = await api.patch(`/admin/institutions/${editingId}`, payload);
        saved = response.data.data;
      } else {
        const response = await api.post('/admin/institutions', payload);
        saved = response.data.data;
      }
      if (coverFile && saved?._id) {
        const coverImageUrl = await uploadForInstitution(saved._id, coverFile);
        await api.patch(`/admin/institutions/${saved._id}`, { coverImageUrl });
      }
      setMessage(editingId ? 'Institution updated successfully.' : 'Institution created successfully.');
      reset();
      await load();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save institution. Check your permissions and try again.');
    } finally {
      setSaving(false);
    }
  }

  async function uploadForInstitution(institutionId, file) {
    const body = new FormData(); body.append('institutionId', institutionId); body.append('image', file);
    const response = await api.post('/admin/uploads/images', body);
    return response.data.data.imageUrl;
  }

  async function addInstitutionPhoto() {
    if (!editingId || !galleryFile) { setError('Save the institution first, then select a photo to add to its slideshow.'); return; }
    setPhotoBusy(true); setError(''); setMessage('');
    try {
      const imageUrl = await uploadForInstitution(editingId, galleryFile);
      const current = items.find(item => item._id === editingId) || form;
      const gallery = [...(current.gallery || []), { url: imageUrl, caption: galleryFile.name.replace(/\.[^.]+$/, '') }];
      await api.patch(`/admin/institutions/${editingId}`, { gallery });
      setGalleryFile(null); setMessage('Photo added to this institution slideshow.'); await load();
    } catch (err) { setError(err.response?.data?.message || 'Could not add photo. Check upload settings and permissions.'); }
    finally { setPhotoBusy(false); }
  }

  async function removeInstitutionPhoto(photoIndex) {
    if (!editingId) return;
    const current = items.find(item => item._id === editingId);
    if (!current) return;
    setPhotoBusy(true); setError('');
    try { await api.patch(`/admin/institutions/${editingId}`, { gallery: (current.gallery || []).filter((_, i) => i !== photoIndex) }); setMessage('Photo removed from this slideshow.'); await load(); }
    catch (err) { setError(err.response?.data?.message || 'Could not remove photo.'); }
    finally { setPhotoBusy(false); }
  }

  async function togglePublish(item) {
    setError('');
    setMessage('');
    try {
      await api.patch(`/admin/institutions/${item._id}`, {
        isPublished: !item.isPublished
      });
      setMessage(`${item.name} is now ${item.isPublished ? 'unpublished' : 'published'}.`);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to change publishing status.');
    }
  }

  return (
    <section className="admin-page">
      <div className="container">
        <div className="admin-head">
          <div>
            <span className="eyebrow">WEBSITE MANAGEMENT</span>
            <h1>Institutions</h1>
            <p>Manage institution profiles shown on the Al Huda Trust website.</p>
          </div>
          <button className="btn secondary" type="button" onClick={load}>
            Refresh list
          </button>
        </div>

        {error && <div className="error-message" role="alert">{error}</div>}
        {message && <div className="success-message" role="status">{message}</div>}

        <div className="admin-card" style={{ marginBottom: 28 }}>
          <h2>{editingId ? 'Edit institution' : 'Add an institution'}</h2>
          <form onSubmit={submit} className="contact-form">
            <label>Institution name
              <input name="name" value={form.name} onChange={change} required minLength={2} />
            </label>

            <label>Institution type
              <select name="type" value={form.type} onChange={change}>
                <option value="orphanage">Orphanage</option>
                <option value="school">School</option>
                <option value="madrasa">Madrasa</option>
                <option value="college">College</option>
                <option value="training_centre">Training centre</option>
                <option value="other">Other</option>
              </select>
            </label>

            <label>Short description
              <textarea name="shortDescription" rows="2" value={form.shortDescription} onChange={change} />
            </label>

            <label>Full description
              <textarea name="description" rows="4" value={form.description} onChange={change} />
            </label>

            <label>Established year
              <input name="establishedYear" type="number" min="1800" max="2100" value={form.establishedYear} onChange={change} />
            </label>

            <label>Address
              <textarea name="address" rows="2" value={form.address} onChange={change} />
            </label>

            <label>Phone
              <input name="phone" value={form.phone} onChange={change} />
            </label>

            <label>Email
              <input name="email" type="email" value={form.email} onChange={change} />
            </label>

            <label>Website URL
              <input name="website" type="url" placeholder="https://..." value={form.website} onChange={change} />
            </label>

            <label>Map/location URL
              <input name="locationUrl" type="url" placeholder="https://..." value={form.locationUrl} onChange={change} />
            </label>

            <label>Logo image URL
              <input name="logoUrl" type="url" placeholder="https://..." value={form.logoUrl} onChange={change} />
            </label>

            <label>Institution main photo (JPEG, PNG or WebP, up to 5 MB)
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={event => setCoverFile(event.target.files?.[0] || null)} />
            </label>
            {form.coverImageUrl && <img src={form.coverImageUrl} alt="Institution cover preview" className="institution-cover-preview" />}
            <label>Or paste an existing cover image URL
              <input name="coverImageUrl" type="url" placeholder="https://..." value={form.coverImageUrl} onChange={change} />
            </label>

            <label>Mission
              <textarea name="mission" rows="3" value={form.mission} onChange={change} />
            </label>

            <label>Vision
              <textarea name="vision" rows="3" value={form.vision} onChange={change} />
            </label>

            <label>Display order
              <input name="displayOrder" type="number" value={form.displayOrder} onChange={change} />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input name="isPublished" type="checkbox" checked={Boolean(form.isPublished)} onChange={change} />
              Publish this institution on the public website
            </label>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button className="btn" type="submit" disabled={saving}>
                {saving ? 'Saving...' : editingId ? 'Save changes' : 'Create institution'}
              </button>
              {editingId && (
                <button className="btn secondary" type="button" onClick={reset}>
                  Cancel editing
                </button>
              )}
            </div>
          </form>
        </div>

        {editingId && <div className="admin-card institution-gallery-admin" style={{ marginBottom: 28 }}>
          <h2>Institution slideshow</h2><p>These photos appear only on this institution's profile page. You can add or remove photos for institutions you are allowed to manage.</p>
          <label>Add a slideshow photo<input type="file" accept="image/jpeg,image/png,image/webp" onChange={event => setGalleryFile(event.target.files?.[0] || null)} /></label>
          <button className="btn primary" type="button" onClick={addInstitutionPhoto} disabled={photoBusy || !galleryFile}>{photoBusy ? 'Saving…' : 'Upload and add photo'}</button>
          <div className="institution-gallery-admin__grid">{(items.find(item => item._id === editingId)?.gallery || []).map((photo, index) => <article key={`${photo.url}-${index}`}><img src={photo.url} alt={photo.caption || 'Institution slideshow photo'}/><p>{photo.caption || `Photo ${index+1}`}</p><button className="btn secondary" type="button" disabled={photoBusy} onClick={() => removeInstitutionPhoto(index)}>Remove</button></article>)}</div>
        </div>}

        <div className="admin-card">
          <h2>Institution directory ({items.length})</h2>
          {loading ? <p>Loading institutions...</p> : items.length === 0 ? (
            <p>No institutions were returned by the API.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item._id}>
                      <td>
                        <strong>{item.name}</strong>
                        <br />
                        <small>{item.slug}</small>
                      </td>
                      <td>{item.type?.replaceAll('_', ' ')}</td>
                      <td>{item.isPublished ? 'Published' : 'Draft'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          <button className="btn secondary" type="button" onClick={() => edit(item)}>
                            Edit
                          </button>
                          <button className="btn secondary" type="button" onClick={() => togglePublish(item)}>
                            {item.isPublished ? 'Unpublish' : 'Publish'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
