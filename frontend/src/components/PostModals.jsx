import React, { useState } from 'react';
import API from '../utils/api.js';

// ─── Post Program Modal ───────────────────────────────────────────────────────
export const PostProgramModal = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    title: '', category: 'tournament', date: '',
    location: 'Jakma, Okhaldhunga', shortDesc: '', fullDesc: '',
    status: 'upcoming', organizer: 'Fulbari Yuba Club Jakma', participants: '',
  });
  const [photos, setPhotos] = useState([]);
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    if (!form.title || !form.date || !form.shortDesc) {
      setError('Please fill all required fields.');
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v); });
      if (coverImage) fd.append('coverImage', coverImage);
      photos.forEach(f => fd.append('photos', f));
      const { data } = await API.post('/programs', fd);
      onSuccess(data.data);
      onClose();
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalShell title="Post New Program" onClose={onClose}>
      {error && <ErrBox msg={error} />}
      <G2>
        <F label="Title *">
          <input className="form-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Annual Football Tournament 2082" />
        </F>
        <F label="Category">
          <select className="form-input" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
            <option value="tournament">Tournament</option>
            <option value="community">Community</option>
            <option value="cultural">Cultural</option>
            <option value="training">Training</option>
            <option value="other">Other</option>
          </select>
        </F>
        <F label="Date *">
          <input className="form-input" type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
        </F>
        <F label="Location">
          <input className="form-input" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
        </F>
        <F label="Status">
          <select className="form-input" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
            <option value="upcoming">Upcoming</option>
            <option value="active">Active / Ongoing</option>
            <option value="past">Past</option>
            <option value="draft">Draft</option>
          </select>
        </F>
        <F label="Participants">
          <input className="form-input" type="number" value={form.participants} onChange={e => setForm({...form, participants: e.target.value})} placeholder="e.g. 100" />
        </F>
      </G2>
      <F label="Short Description *">
        <textarea className="form-input" rows="3" value={form.shortDesc} onChange={e => setForm({...form, shortDesc: e.target.value})} placeholder="Brief description shown on the card..." />
      </F>
      <F label="Full Description">
        <textarea className="form-input" rows="4" value={form.fullDesc} onChange={e => setForm({...form, fullDesc: e.target.value})} placeholder="Full program details..." />
      </F>
      {/* Cover image */}
      <F label="Cover Image (optional)">
        <input type="file" className="form-input" accept="image/*" style={{padding:'8px'}}
          onChange={e => setCoverImage(e.target.files[0] || null)} />
        {coverImage && <p style={{fontSize:'0.8rem',color:'#166534',marginTop:'4px'}}>✓ {coverImage.name}</p>}
        <p style={{fontSize:'0.75rem',color:'var(--gray-400)',marginTop:'4px'}}>Leave blank to use the default emoji icon.</p>
      </F>
      {/* Additional photos */}
      <F label="Additional Photos">
        <input type="file" className="form-input" multiple accept="image/*" style={{padding:'8px'}}
          onChange={e => setPhotos(Array.from(e.target.files))} />
        {photos.length > 0 && <p style={{fontSize:'0.8rem',color:'#166534',marginTop:'4px'}}>✓ {photos.length} photo(s) selected</p>}
      </F>
      <Actions onClose={onClose} onSubmit={submit} loading={loading} label="Publish" />
    </ModalShell>
  );
};

// ─── Post Award Modal ─────────────────────────────────────────────────────────
export const PostAwardModal = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    title: '', issuer: '', yearBS: '', icon: '🏆', description: '', category: 'certificate',
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    if (!form.title || !form.issuer) {
      setError('Title and Issuer are required.');
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v); });
      if (image) fd.append('image', image);
      const { data } = await API.post('/certificates', fd);
      onSuccess(data.data);
      onClose();
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalShell title="Add Award / Certificate" onClose={onClose}>
      {error && <ErrBox msg={error} />}
      <G2>
        <F label="Title *">
          <input className="form-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. District Championship Winner" />
        </F>
        <F label="Issued By *">
          <input className="form-input" value={form.issuer} onChange={e => setForm({...form, issuer: e.target.value})} placeholder="e.g. ANFA Okhaldhunga" />
        </F>
        <F label="Year (BS)">
          <input className="form-input" value={form.yearBS} onChange={e => setForm({...form, yearBS: e.target.value})} placeholder="e.g. 2080 BS" />
        </F>
        <F label="Icon (Emoji)">
          <input className="form-input" value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} placeholder="🏆" />
        </F>
      </G2>
      <F label="Description">
        <textarea className="form-input" rows="3" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Description of this award..." />
      </F>
      {/* Award image */}
      <F label="Award Image (optional)">
        <input type="file" className="form-input" accept="image/*" style={{padding:'8px'}}
          onChange={e => setImage(e.target.files[0] || null)} />
        {image && <p style={{fontSize:'0.8rem',color:'#166534',marginTop:'4px'}}>✓ {image.name}</p>}
        <p style={{fontSize:'0.75rem',color:'var(--gray-400)',marginTop:'4px'}}>Leave blank to use the emoji icon instead.</p>
      </F>
      <Actions onClose={onClose} onSubmit={submit} loading={loading} label="Add Award" />
    </ModalShell>
  );
};

// ─── Post Blog Modal ──────────────────────────────────────────────────────────
export const PostBlogModal = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    title: '', category: 'news', summary: '', content: '',
    author: 'FYC Admin', tags: '', status: 'published',
  });
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    if (!form.title || !form.content) {
      setError('Title and Content are required.');
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v); });
      if (coverImage) fd.append('coverImage', coverImage);
      const { data } = await API.post('/blogs', fd);
      onSuccess(data.data);
      onClose();
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalShell title="Post New Blog" onClose={onClose}>
      {error && <ErrBox msg={error} />}
      <G2>
        <F label="Title *">
          <input className="form-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Blog post title..." />
        </F>
        <F label="Category">
          <select className="form-input" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
            <option value="news">News</option>
            <option value="match">Match</option>
            <option value="announcement">Announcement</option>
            <option value="community">Community</option>
            <option value="achievement">Achievement</option>
          </select>
        </F>
        <F label="Author">
          <input className="form-input" value={form.author} onChange={e => setForm({...form, author: e.target.value})} />
        </F>
        <F label="Status">
          <select className="form-input" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </F>
      </G2>
      <F label="Summary">
        <textarea className="form-input" rows="2" value={form.summary} onChange={e => setForm({...form, summary: e.target.value})} placeholder="Short summary shown on the card..." />
      </F>
      <F label="Content *">
        <textarea className="form-input" rows="8" value={form.content} onChange={e => setForm({...form, content: e.target.value})} placeholder="Full blog post content..." />
      </F>
      {/* Cover image */}
      <F label="Cover Image (optional)">
        <input type="file" className="form-input" accept="image/*" style={{padding:'8px'}}
          onChange={e => setCoverImage(e.target.files[0] || null)} />
        {coverImage && <p style={{fontSize:'0.8rem',color:'#166534',marginTop:'4px'}}>✓ {coverImage.name}</p>}
        <p style={{fontSize:'0.75rem',color:'var(--gray-400)',marginTop:'4px'}}>Leave blank to show the default 📄 icon.</p>
      </F>
      <F label="Tags">
        <input className="form-input" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} placeholder="football, tournament, community" />
      </F>
      <Actions onClose={onClose} onSubmit={submit} loading={loading} label="Publish Post" />
    </ModalShell>
  );
};

// ─── Post Gallery Modal ───────────────────────────────────────────────────────
export const PostGalleryModal = ({ onClose, onSuccess }) => {
  const [files, setFiles] = useState([]);
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('other');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    if (files.length === 0) {
      setError('Please select at least one photo.');
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      files.forEach(f => fd.append('photos', f));
      fd.append('caption', caption);
      fd.append('category', category);
      const { data } = await API.post('/gallery', fd);
      onSuccess(data.data);
      onClose();
    } catch (e) {
      setError(e.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalShell title="Upload Photos" onClose={onClose}>
      {error && <ErrBox msg={error} />}
      <div
        style={{border:'2px dashed var(--gray-300)',borderRadius:'12px',padding:'2.5rem',textAlign:'center',cursor:'pointer',background:'var(--gray-50)',marginBottom:'1rem'}}
        onClick={() => document.getElementById('gallery-upload-modal').click()}
      >
        <div style={{fontSize:'2.5rem',marginBottom:'0.5rem'}}>📸</div>
        <p style={{fontWeight:600,color:'var(--gray-700)',marginBottom:'0.3rem'}}>Click to select photos</p>
        <p style={{fontSize:'0.8rem',color:'var(--gray-400)'}}>JPG, PNG, WebP supported · Multiple files allowed</p>
        {files.length > 0 && <p style={{marginTop:'0.5rem',color:'#166534',fontWeight:600}}>✓ {files.length} photo(s) selected</p>}
      </div>
      <input id="gallery-upload-modal" type="file" multiple accept="image/*" style={{display:'none'}}
        onChange={e => setFiles(Array.from(e.target.files))} />
      <G2>
        <F label="Caption">
          <input className="form-input" value={caption} onChange={e => setCaption(e.target.value)} placeholder="Caption for these photos..." />
        </F>
        <F label="Category">
          <select className="form-input" value={category} onChange={e => setCategory(e.target.value)}>
            <option value="match">Match</option>
            <option value="event">Event</option>
            <option value="training">Training</option>
            <option value="community">Community</option>
            <option value="cultural">Cultural</option>
            <option value="other">Other</option>
          </select>
        </F>
      </G2>
      <Actions onClose={onClose} onSubmit={submit} loading={loading} label="Upload Photos" />
    </ModalShell>
  );
};

// ─── Shared helpers ───────────────────────────────────────────────────────────
const ModalShell = ({ title, onClose, children }) => (
  <div onClick={onClose} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',backdropFilter:'blur(4px)',zIndex:5000,display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem'}}>
    <div onClick={e => e.stopPropagation()} style={{background:'white',borderRadius:'16px',padding:'2rem',width:'100%',maxWidth:'640px',maxHeight:'90vh',overflowY:'auto',boxShadow:'0 24px 60px rgba(0,0,0,0.2)',animation:'modalIn 0.3s ease'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem'}}>
        <h2 style={{fontWeight:800,fontSize:'1.2rem',color:'var(--gray-900)'}}>{title}</h2>
        <button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer',fontSize:'1.3rem',color:'var(--gray-400)',padding:'4px'}}>✕</button>
      </div>
      {children}
    </div>
    <style>{`@keyframes modalIn{from{opacity:0;transform:translateY(20px) scale(0.96)}to{opacity:1;transform:none}}`}</style>
  </div>
);

const F = ({ label, children }) => (
  <div className="form-group">
    <label className="form-label">{label}</label>
    {children}
  </div>
);

const G2 = ({ children }) => (
  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',marginBottom:'0.5rem'}}>
    {children}
    <style>{`@media(max-width:520px){div[style*="1fr 1fr"]{grid-template-columns:1fr!important}}`}</style>
  </div>
);

const ErrBox = ({ msg }) => (
  <div style={{background:'#FEF2F2',border:'1px solid #FECACA',color:'#991B1B',padding:'10px 14px',borderRadius:'8px',fontSize:'0.85rem',fontWeight:600,marginBottom:'1rem'}}>
    ✗ {msg}
  </div>
);

const Actions = ({ onClose, onSubmit, loading, label }) => (
  <div style={{display:'flex',gap:'1rem',justifyContent:'flex-end',marginTop:'1.5rem',paddingTop:'1rem',borderTop:'1px solid var(--gray-100)'}}>
    <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
    <button className="btn btn-primary" onClick={onSubmit} disabled={loading}>
      {loading ? 'Saving...' : label}
    </button>
  </div>
);
