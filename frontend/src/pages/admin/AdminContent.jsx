import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function AdminContent() {
  const { user } = useAuth();
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [institutionId, setInstitutionId] = useState('');
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [homeSlides, setHomeSlides] = useState([]);
  const [slideDraft, setSlideDraft] = useState({ title: '', description: '', imageUrl: '' });
  const [slideFile, setSlideFile] = useState(null);
  const [slideSaving, setSlideSaving] = useState(false);
  const [editingSlideIndex, setEditingSlideIndex] = useState(null);

  useEffect(() => {
    let active = true;

    Promise.all([
      api.get('/admin/news'),
      api.get('/admin/events'),
      api.get('/admin/gallery'),
      api.get('/admin/institutions')
    ]).then(async ([n, e, g, i]) => {
      if (!active) return;
      setNews(n.data.data || []);
      if (user?.role === 'trust_admin') {
        try { const home = await api.get('/public/home'); setHomeSlides(home.data.data?.settings?.homepageSlides || []); } catch {}
      }
      setEvents(e.data.data || []);
      setGallery(g.data.data || []);
      const list = i.data.data || [];
      setInstitutions(list);
      if (list.length) setInstitutionId(String(list[0]._id));
    }).catch(() => {
      if (active) setError('Could not load admin content. Check your access and connection.');
    });

    return () => { active = false; };
  }, [user?.role]);

  async function submitUpload(event) {
    event.preventDefault();
    setError('');
    setMessage('');
    setImageUrl('');

    if (!institutionId || !file) {
      setError('Select an institution and an image first.');
      return;
    }

    const form = new FormData();
    form.append('institutionId', institutionId);
    form.append('image', file);

    setLoading(true);
    try {
      const response = await api.post('/admin/uploads/images', form);
      setImageUrl(response.data.data.imageUrl);
      setMessage('Image uploaded successfully. Copy the URL into the relevant content form.');
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Check Cloudinary configuration and try again.');
    } finally {
      setLoading(false);
    }
  }

  async function uploadHomeSlide(event) {
    event.preventDefault(); setError(''); setMessage('');
    if (!slideFile || !institutions.length) { setError('Select a photo and make sure at least one institution exists.'); return; }
    setSlideSaving(true);
    try {
      const body = new FormData(); body.append('institutionId', institutions[0]._id); body.append('image', slideFile);
      const result = await api.post('/admin/uploads/images', body);
      setSlideDraft(current => ({ ...current, imageUrl: result.data.data.imageUrl }));
      setMessage('Photo uploaded. Save the slide to publish it on the homepage.');
    } catch (err) { setError(err.response?.data?.message || 'Could not upload photo. Check Cloudinary configuration.'); }
    finally { setSlideSaving(false); }
  }

  async function saveHomeSlides(nextSlides) {
    setSlideSaving(true); setError(''); setMessage('');
    try { await api.put('/admin/settings/homepageSlides', { value: nextSlides }); setHomeSlides(nextSlides); setMessage('Homepage slideshow saved.'); }
    catch (err) { setError(err.response?.data?.message || 'Could not save homepage slideshow.'); }
    finally { setSlideSaving(false); }
  }

  async function addHomeSlide(event) {
    event.preventDefault();
    if (!slideDraft.imageUrl) { setError('Upload a photo before adding the slide.'); return; }
    const next = [...homeSlides];
    if (editingSlideIndex === null) next.push({ ...slideDraft }); else next[editingSlideIndex] = { ...slideDraft };
    await saveHomeSlides(next);
    setSlideDraft({ title: '', description: '', imageUrl: '' }); setSlideFile(null); setEditingSlideIndex(null);
  }

  return (
    <section className="admin-page">
      <div className="container">
        <h1>Website content</h1>

        <div className="content-columns">
          <div className="admin-card"><h3>News</h3><strong>{news.length}</strong><p>Items</p></div>
          <div className="admin-card"><h3>Events</h3><strong>{events.length}</strong><p>Items</p></div>
          <div className="admin-card"><h3>Gallery</h3><strong>{gallery.length}</strong><p>Items</p></div>
        </div>

        {user?.role === 'trust_admin' && <div className="admin-card homepage-slide-admin" style={{ marginTop: 24 }}>
          <h2>Homepage slideshow</h2><p>Only Trust Admin can manage photos displayed on the main homepage. Upload a photo, add its text, and save the slide.</p>
          <form onSubmit={uploadHomeSlide} className="contact-form">
            <label>Photo (JPEG, PNG or WebP, up to 5 MB)<input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => setSlideFile(e.target.files?.[0] || null)} required /></label>
            <button className="btn secondary" type="submit" disabled={slideSaving || !slideFile}>{slideSaving ? 'Uploadingâ€¦' : 'Upload slide photo'}</button>
          </form>
          {slideDraft.imageUrl && <img src={slideDraft.imageUrl} alt="Homepage slide preview" className="home-slide-preview"/>}
          <form onSubmit={addHomeSlide} className="contact-form">
            <label>Slide title<input value={slideDraft.title} onChange={e => setSlideDraft(s => ({...s,title:e.target.value}))} maxLength={160} /></label>
            <label>Description<textarea rows="2" value={slideDraft.description} onChange={e => setSlideDraft(s => ({...s,description:e.target.value}))} maxLength={500}/></label>
            <button className="btn primary" type="submit" disabled={slideSaving || !slideDraft.imageUrl}>{editingSlideIndex === null ? 'Add slide to homepage' : 'Save slide changes'}</button>
            {editingSlideIndex !== null && <button className="btn secondary" type="button" onClick={() => { setEditingSlideIndex(null); setSlideDraft({ title: '', description: '', imageUrl: '' }); setSlideFile(null); }}>Cancel editing</button>}
          </form>
          <div className="home-slide-admin-list">{homeSlides.map((slide, index) => <article key={`${slide.imageUrl}-${index}`}><img src={slide.imageUrl} alt=""/><div><strong>{slide.title || `Slide ${index+1}`}</strong><small>{slide.description || 'No description'}</small><div className="home-slide-admin-actions"><button className="btn secondary" type="button" disabled={slideSaving} onClick={() => { setEditingSlideIndex(index); setSlideDraft({ title: slide.title || '', description: slide.description || '', imageUrl: slide.imageUrl || '' }); window.scrollTo({top:0,behavior:'smooth'}); }}>Edit</button><button className="btn secondary" type="button" disabled={index===0 || slideSaving} onClick={() => { const next=[...homeSlides]; [next[index-1],next[index]]=[next[index],next[index-1]]; saveHomeSlides(next); }}>Move up</button><button className="btn secondary" type="button" disabled={index===homeSlides.length-1 || slideSaving} onClick={() => { const next=[...homeSlides]; [next[index+1],next[index]]=[next[index],next[index+1]]; saveHomeSlides(next); }}>Move down</button><button className="btn secondary" type="button" disabled={slideSaving} onClick={() => saveHomeSlides(homeSlides.filter((_,i)=>i!==index))}>Remove</button></div></div></article>)}</div>
        </div>}

        <div className="admin-card" style={{ marginTop: 24 }}>
          <h2>Upload an image</h2>
          <p>JPEG, PNG, or WebP. Maximum size: 5 MB.</p>

          <form onSubmit={submitUpload}>
            <label htmlFor="upload-institution">Institution</label>
            <select
              id="upload-institution"
              value={institutionId}
              onChange={event => setInstitutionId(event.target.value)}
              required
            >
              <option value="">Select institution</option>
              {institutions.map(item => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>

            <label htmlFor="upload-image">Image file</label>
            <input
              id="upload-image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={event => setFile(event.target.files?.[0] || null)}
              required
            />

            <button className="btn primary" type="submit" disabled={loading}>
              {loading ? 'Uploading...' : 'Upload image'}
            </button>
          </form>

          {error && <p role="alert" className="error">{error}</p>}
          {message && <p role="status">{message}</p>}

          {imageUrl && (
            <div style={{ marginTop: 16 }}>
              <img
                src={imageUrl}
                alt="Uploaded preview"
                style={{ maxWidth: '100%', maxHeight: 280, objectFit: 'contain' }}
              />
              <p><a href={imageUrl} target="_blank" rel="noreferrer">Open uploaded image</a></p>
              <label htmlFor="uploaded-image-url">Image URL</label>
              <input id="uploaded-image-url" readOnly value={imageUrl} />
              <button
                className="btn"
                type="button"
                onClick={() => navigator.clipboard?.writeText(imageUrl)}
              >
                Copy URL
              </button>
            </div>
          )}
        </div>

        <p className="note">
          The upload API stores the image in Cloudinary and returns its URL. News, event, and gallery create/edit forms are separate work.
        </p>
      </div>
    </section>
  );
}

