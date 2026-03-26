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
      <F label="Cover Image (optional)">
        <input type="file" className="form-input" accept="image/*" style={{padding:'8px'}}
          onChange={e => setCoverImage(e.target.files[0] || null)} />
        {coverImage && <p style={{fontSize:'0.8rem',color:'#166534',marginTop:'4px'}}>✓ {coverImage.name}</p>}
        <p style={{fontSize:'0.75rem',color:'var(--gray-400)',marginTop:'4px'}}>Leave blank to use the default emoji icon.</p>
      </F>
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

// ─── Post Notice Modal ──────────────────────────────────────────────────────────
export const PostNoticeModal = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    title: '',
    category: 'general',
    priority: 'normal',
    author: 'FYC Admin',
    body: '',
    featured: false,
    status: 'active',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    if (!form.title || !form.body) {
      setError('Title and Body are required.');
      return;
    }
    setLoading(true);
    try {
      const payload = { ...form, featured: form.featured ? true : false };
      const { data } = await API.post('/notices', payload);
      onSuccess(data.data);
      onClose();
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalShell title="Post New Notice" onClose={onClose}>
      {error && <ErrBox msg={error} />}
      <G2>
        <F label="Title *">
          <input className="form-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Annual General Meeting 2083" />
        </F>
        <F label="Category">
          <select className="form-input" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
            <option value="general">General</option>
            <option value="event">Event</option>
            <option value="urgent">Urgent</option>
            <option value="meeting">Meeting</option>
            <option value="sports">Sports</option>
          </select>
        </F>
        <F label="Priority">
          <select className="form-input" value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="low">Low</option>
          </select>
        </F>
        <F label="Author">
          <input className="form-input" value={form.author} onChange={e => setForm({...form, author: e.target.value})} placeholder="e.g. Club Secretary" />
        </F>
      </G2>
      <F label="Body *">
        <textarea
          className="form-input"
          rows="7"
          value={form.body}
          onChange={e => setForm({...form, body: e.target.value})}
          placeholder="Full notice content. Use new lines to separate paragraphs or agenda items..."
        />
      </F>
      <div style={{display:'flex',alignItems:'center',gap:'10px',padding:'10px 14px',background:'var(--gray-50)',borderRadius:'8px',border:'1px solid var(--gray-200)',marginBottom:'0.5rem'}}>
        <input
          type="checkbox"
          id="notice-featured"
          checked={form.featured}
          onChange={e => setForm({...form, featured: e.target.checked})}
          style={{accentColor:'#C8102E',width:'16px',height:'16px',cursor:'pointer'}}
        />
        <label htmlFor="notice-featured" style={{fontSize:'0.85rem',fontWeight:600,color:'var(--gray-700)',cursor:'pointer'}}>
          📌 Pin this notice (shows at top of notice board)
        </label>
      </div>
      <Actions onClose={onClose} onSubmit={submit} loading={loading} label="Post Notice" />
    </ModalShell>
  );
};

// ─── Post Gallery Modal ───────────────────────────────────────────────────────
export const PostGalleryModal = ({ onClose, onSuccess }) => {
  const [files, setFiles] = useState([]);
  // perPhoto: array of { caption: string } matching files index
  const [perPhoto, setPerPhoto] = useState([]);
  const [sharedCaption, setSharedCaption] = useState('');
  const [sharedCategory, setSharedCategory] = useState('event');
  const [usePerCaption, setUsePerCaption] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(selected);
    setPerPhoto(selected.map(() => ({ caption: '' })));
    // Auto-enable per-photo captions when multiple files selected
    if (selected.length > 1) setUsePerCaption(true);
    else setUsePerCaption(false);
  };

  const updatePerCaption = (index, value) => {
    setPerPhoto(prev => prev.map((p, i) => i === index ? { ...p, caption: value } : p));
  };

  const submit = async () => {
    if (files.length === 0) {
      setError('Please select at least one photo.');
      return;
    }
    setLoading(true);
    try {
      // Upload photos one by one so each gets its own caption,
      // or batch them if all share the same caption.
      const uploaded = [];

      if (!usePerCaption || files.length === 1) {
        // Single upload — all share one caption & category
        const fd = new FormData();
        files.forEach(f => fd.append('photos', f));
        fd.append('caption', sharedCaption);
        fd.append('category', sharedCategory);
        const { data } = await API.post('/gallery', fd);
        const result = data.data;
        uploaded.push(...(Array.isArray(result) ? result : [result]));
      } else {
        // Per-photo upload — one request per file to preserve individual captions
        for (let i = 0; i < files.length; i++) {
          const fd = new FormData();
          fd.append('photos', files[i]);
          fd.append('caption', perPhoto[i]?.caption || sharedCaption);
          fd.append('category', sharedCategory);
          const { data } = await API.post('/gallery', fd);
          const result = data.data;
          uploaded.push(...(Array.isArray(result) ? result : [result]));
        }
      }

      onSuccess(uploaded);
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

      {/* Drop zone */}
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
        onChange={handleFileChange} />

      {/* Category — always shared */}
      <F label="Category">
        <select className="form-input" value={sharedCategory} onChange={e => setSharedCategory(e.target.value)}>
          <option value="match">Match</option>
          <option value="event">Event</option>
          <option value="training">Training</option>
          <option value="community">Community</option>
          <option value="cultural">Cultural</option>
        </select>
      </F>

      {/* Caption section */}
      {files.length > 1 && (
        <div style={{display:'flex',alignItems:'center',gap:'10px',margin:'0.75rem 0',padding:'10px 14px',background:'var(--gray-50)',borderRadius:'8px',border:'1px solid var(--gray-200)'}}>
          <input
            type="checkbox"
            id="per-caption-toggle"
            checked={usePerCaption}
            onChange={e => setUsePerCaption(e.target.checked)}
            style={{accentColor:'#C8102E',width:'16px',height:'16px',cursor:'pointer'}}
          />
          <label htmlFor="per-caption-toggle" style={{fontSize:'0.85rem',fontWeight:600,color:'var(--gray-700)',cursor:'pointer'}}>
            Add individual caption per photo
          </label>
        </div>
      )}

      {/* Shared caption (single photo or toggled off) */}
      {(!usePerCaption || files.length <= 1) && (
        <F label={files.length > 1 ? 'Shared Caption (optional)' : 'Caption (optional)'}>
          <input
            className="form-input"
            value={sharedCaption}
            onChange={e => setSharedCaption(e.target.value)}
            placeholder={files.length > 1 ? 'Same caption applied to all photos...' : 'Caption for this photo...'}
          />
        </F>
      )}

      {/* Per-photo captions */}
      {usePerCaption && files.length > 1 && (
        <div style={{display:'flex',flexDirection:'column',gap:'8px',marginBottom:'0.5rem'}}>
          <label className="form-label">Captions per photo</label>
          {files.map((file, i) => (
            <div key={i} style={{display:'flex',alignItems:'center',gap:'10px',background:'var(--gray-50)',border:'1px solid var(--gray-200)',borderRadius:'8px',padding:'8px 10px'}}>
              <span style={{
                minWidth:'24px',height:'24px',background:'#C8102E',color:'white',
                borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',
                fontSize:'0.7rem',fontWeight:800,flexShrink:0,
              }}>{i + 1}</span>
              <span style={{fontSize:'0.78rem',color:'var(--gray-500)',minWidth:0,flex:'0 0 auto',maxWidth:'120px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                {file.name}
              </span>
              <input
                className="form-input"
                value={perPhoto[i]?.caption || ''}
                onChange={e => updatePerCaption(i, e.target.value)}
                placeholder={`Caption for photo ${i + 1}...`}
                style={{flex:1,marginBottom:0}}
              />
            </div>
          ))}
        </div>
      )}

      <Actions onClose={onClose} onSubmit={submit} loading={loading} label={loading ? `Uploading ${files.length > 1 ? 'photos...' : 'photo...'}` : 'Upload Photos'} />
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