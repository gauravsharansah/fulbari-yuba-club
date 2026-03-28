import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import API from '../utils/api.js';

const PANELS = [
  { key: 'dashboard',  icon: '📊', label: 'Dashboard'      },
  //{ key: 'admins',     icon: '🔐', label: 'Manage Admins'  },
  { key: 'messages',   icon: '💬', label: 'Messages'        },
];

const STATUS_STYLE = {
  upcoming:  { bg: '#FEF3C7', color: '#92400E', label: 'Upcoming'  },
  active:    { bg: '#D1FAE5', color: '#065F46', label: 'Active'    },
  past:      { bg: '#F3F4F6', color: '#6B7280', label: 'Completed' },
  draft:     { bg: '#DBEAFE', color: '#1E40AF', label: 'Draft'     },
  published: { bg: '#D1FAE5', color: '#065F46', label: 'Published' },
};

const PRIORITY_STYLE = {
  high:   { bg: '#FEF2F2', color: '#C8102E', label: '🔴 High'   },
  normal: { bg: '#FFFBEB', color: '#92400E', label: '🟡 Normal' },
  low:    { bg: '#F0FDF4', color: '#166534', label: '🟢 Low'    },
};

const CAT_NOTICE_STYLE = {
  general: { bg: '#F0F9FF', color: '#0369A1', label: 'General' },
  event:   { bg: '#FFF7ED', color: '#C2410C', label: 'Event'   },
  urgent:  { bg: '#FFF1F2', color: '#BE123C', label: 'Urgent'  },
  meeting: { bg: '#F5F3FF', color: '#6D28D9', label: 'Meeting' },
  sports:  { bg: '#FEF2F2', color: '#991B1B', label: 'Sports'  },
};

// ── Shared UI helpers ─────────────────────────────────────────────────────────
const Table = ({ cols, rows }) => (
  <div style={{ overflowX: 'auto' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-200)' }}>
          {cols.map(c => (
            <th key={c} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--gray-500)', whiteSpace: 'nowrap' }}>{c}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr><td colSpan={cols.length} style={{ padding: '2rem', textAlign: 'center', color: 'var(--gray-400)' }}>No data found</td></tr>
        ) : rows.map((row, i) => (
          <tr key={i} style={{ borderBottom: '1px solid var(--gray-100)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--gray-50)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            {row.map((cell, j) => (
              <td key={j} style={{ padding: '12px 14px', fontSize: '0.875rem', color: 'var(--gray-700)' }}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const StatusBadge = ({ s, map = STATUS_STYLE }) => {
  const st = (map[s]) || { bg: '#F3F4F6', color: '#6B7280', label: s };
  return <span style={{ background: st.bg, color: st.color, padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 600 }}>{st.label || s}</span>;
};

const Card = ({ title, children, action }) => (
  <div style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: '12px', marginBottom: '1.5rem', overflow: 'hidden' }}>
    <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--gray-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h3 style={{ fontWeight: 700, color: 'var(--gray-900)', fontSize: '1rem' }}>{title}</h3>
      {action}
    </div>
    <div style={{ padding: '1.5rem' }}>{children}</div>
  </div>
);

const Grid2 = ({ children }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.5rem' }}>
    {children}
    <style>{`@media(max-width:640px){div[style*="1fr 1fr"]{grid-template-columns:1fr!important}}`}</style>
  </div>
);

const Field = ({ label, children, hint }) => (
  <div className="form-group">
    <label className="form-label">{label}</label>
    {children}
    {hint && <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: '4px' }}>{hint}</p>}
  </div>
);

const DelBtn = ({ onClick }) => (
  <button onClick={onClick} style={{ background: '#FEF2F2', color: '#C8102E', border: 'none', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, fontFamily: 'var(--font)' }}>
    🗑 Delete
  </button>
);

const EditBtn = ({ onClick }) => (
  <button onClick={onClick} style={{ background: '#EFF6FF', color: '#1D4ED8', border: 'none', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, fontFamily: 'var(--font)', marginRight: '6px' }}>
    ✏️ Edit
  </button>
);

const FilePreview = ({ file }) => file
  ? <p style={{ fontSize: '0.8rem', color: '#166534', marginTop: '4px' }}>✓ {file.name}</p>
  : null;

const PROG_EMOJI = { tournament: '⚽', community: '🤝', cultural: '🎭', training: '🏃', other: '📌' };

// ── Manage Section Component (used inside dashboard cards) ────────────────────
const SectionDivider = ({ label }) => (
  <div style={{ borderTop: '1px solid var(--gray-100)', margin: '1.5rem 0 1rem', paddingTop: '1rem' }}>
    <p style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--gray-400)' }}>{label}</p>
  </div>
);

// ── FormData config: removes default Content-Type so browser sets multipart boundary correctly ──
const FD_CONFIG = { headers: { 'Content-Type': undefined } };

// ── Main Component ────────────────────────────────────────────────────────────
const AdminPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [panel, setPanel] = useState('dashboard');

  const [programs,   setPrograms]   = useState([]);
  const [notices,    setNotices]    = useState([]);
  const [certs,      setCerts]      = useState([]);
  const [gallery,    setGallery]    = useState([]);
  const [heroSlides, setHeroSlides] = useState([]);
  //const [admins,   setAdmins]   = useState([]);
  const [messages,   setMessages]   = useState([]);
  const [toast,      setToast]      = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Edit state
  const [editingProgram, setEditingProgram] = useState(null);
  const [editingNotice,  setEditingNotice]  = useState(null);
  const [editingCert,    setEditingCert]    = useState(null);

  // Form states
  const [progForm,  setProgForm]  = useState({ title: '', category: 'tournament', date: '', location: 'Jakma, Okhaldhunga', shortDesc: '', fullDesc: '', status: 'upcoming', organizer: 'Fulbari Yuba Club Jakma', participants: '' });
  const [progCover, setProgCover] = useState(null);

  const [noticeForm, setNoticeForm] = useState({ title: '', category: 'general', priority: 'normal', author: 'FYC Admin', body: '', featured: false, status: 'active' });

  const [certForm,  setCertForm]  = useState({ title: '', issuer: '', yearBS: '', icon: '🏆', description: '' });
  const [certImage, setCertImage] = useState(null);

  const [galleryFiles,    setGalleryFiles]    = useState([]);
  const [galleryCaption,  setGalleryCaption]  = useState('');
  const [galleryCategory, setGalleryCategory] = useState('event');

  // Hero slides form state
  const [heroFile,     setHeroFile]     = useState(null);
  const [heroCaption,  setHeroCaption]  = useState('');
  const [heroTitle,    setHeroTitle]    = useState('');
  const [heroInterval, setHeroInterval] = useState(5); // seconds

  // Expand/collapse state for dashboard sections
  const [expandedSection, setExpandedSection] = useState(null);

  const [adminForm, setAdminForm] = useState({ name: '', email: '', password: '' });

  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />;

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadData = async () => {
    const safe = async (promise, fallback = []) => {
      try { return await promise; }
      catch (e) { console.warn('loadData error:', e.response?.data?.message || e.message); return { data: { data: fallback } }; }
    };

    const [p, c, msg, n, g, hs, hset] = await Promise.all([
      safe(API.get('/programs?limit=100')),
      safe(API.get('/certificates')),
      safe(API.get('/contact')),
      safe(API.get('/notices')),
      safe(API.get('/gallery')),
      safe(API.get('/hero-slides')),
      safe(API.get('/hero-slides/settings')),
    ]);

    setPrograms(p.data.data   || []);
    setCerts(c.data.data      || []);
    setMessages(msg.data.data || []);
    setNotices(n.data.data    || []);
    setGallery(g.data.data    || []);
    setHeroSlides(hs.data.data || []);

    const ivl = hset?.data?.data?.interval;
    if (ivl && typeof ivl === 'number') setHeroInterval(Math.round(ivl / 1000));

    try {
      const a = await API.get('/auth/users');
      // setAdmins((a.data.data || []).filter(u => u.role === 'admin'));
    } catch {}
  };

  useEffect(() => { loadData(); }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  // ── Delete ──────────────────────────────────────────────────────────────────
  const del = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this?')) return;
    try {
      const urls = {
        program:   `/programs/${id}`,
        notice:    `/notices/${id}`,
        cert:      `/certificates/${id}`,
        gallery:   `/gallery/${id}`,
        contact:   `/contact/${id}`,
        user:      `/auth/users/${id}`,
        heroSlide: `/hero-slides/${id}`,
      };
      await API.delete(urls[type]);
      if (type === 'program')   setPrograms(prev  => prev.filter(p => p._id !== id));
      if (type === 'notice')    setNotices(prev   => prev.filter(n => n._id !== id));
      if (type === 'cert')      setCerts(prev     => prev.filter(c => c._id !== id));
      if (type === 'gallery')   setGallery(prev   => prev.filter(g => g._id !== id));
      if (type === 'contact')   setMessages(prev  => prev.filter(m => m._id !== id));
      // if (type === 'user')   setAdmins(prev    => prev.filter(a => a._id !== id));
      if (type === 'heroSlide') setHeroSlides(prev => prev.filter(h => h._id !== id));
      showToast('Deleted.', 'error');
    } catch (e) { showToast(e.response?.data?.message || 'Delete failed!', 'error'); }
  };

  // ── Submit / Update handlers ─────────────────────────────────────────────────

  const resetProgForm = () => {
    setProgForm({ title: '', category: 'tournament', date: '', location: 'Jakma, Okhaldhunga', shortDesc: '', fullDesc: '', status: 'upcoming', organizer: 'Fulbari Yuba Club Jakma', participants: '' });
    setProgCover(null);
    setEditingProgram(null);
  };

  const submitProgram = async () => {
    if (!progForm.title || !progForm.date || !progForm.shortDesc)
      return showToast('Title, date and description are required!', 'error');
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(progForm).forEach(([k, v]) => { if (v) fd.append(k, v); });
      if (progCover) fd.append('coverImage', progCover);
      if (editingProgram) {
        const { data } = await API.put(`/programs/${editingProgram._id}`, fd, FD_CONFIG);
        setPrograms(prev => prev.map(p => p._id === editingProgram._id ? data.data : p));
        showToast('Program updated! ✅');
      } else {
        const { data } = await API.post('/programs', fd, FD_CONFIG);
        setPrograms(prev => [data.data, ...prev]);
        showToast('Program published! 🎉');
      }
      resetProgForm();
    } catch (e) { showToast(e.response?.data?.message || 'Error!', 'error'); }
    setSubmitting(false);
  };

  const startEditProgram = (p) => {
    setEditingProgram(p);
    setProgForm({
      title: p.title || '', category: p.category || 'tournament',
      date: p.date ? p.date.slice(0, 10) : '', location: p.location || '',
      shortDesc: p.shortDesc || '', fullDesc: p.fullDesc || '',
      status: p.status || 'upcoming', organizer: p.organizer || '',
      participants: p.participants || '',
    });
    setExpandedSection('programs');
  };

  const resetNoticeForm = () => {
    setNoticeForm({ title: '', category: 'general', priority: 'normal', author: 'FYC Admin', body: '', featured: false, status: 'active' });
    setEditingNotice(null);
  };

  const submitNotice = async () => {
    if (!noticeForm.title || !noticeForm.body)
      return showToast('Title and body are required!', 'error');
    setSubmitting(true);
    try {
      if (editingNotice) {
        const { data } = await API.put(`/notices/${editingNotice._id}`, { ...noticeForm, featured: !!noticeForm.featured });
        setNotices(prev => prev.map(n => n._id === editingNotice._id ? data.data : n));
        showToast('Notice updated! ✅');
      } else {
        const { data } = await API.post('/notices', { ...noticeForm, featured: !!noticeForm.featured });
        setNotices(prev => [data.data, ...prev]);
        showToast('Notice posted! 📢');
      }
      resetNoticeForm();
    } catch (e) { showToast(e.response?.data?.message || 'Error!', 'error'); }
    setSubmitting(false);
  };

  const startEditNotice = (n) => {
    setEditingNotice(n);
    setNoticeForm({
      title: n.title || '', category: n.category || 'general',
      priority: n.priority || 'normal', author: n.author || 'FYC Admin',
      body: n.body || '', featured: !!n.featured, status: n.status || 'active',
    });
    setExpandedSection('notices');
  };

  const resetCertForm = () => {
    setCertForm({ title: '', issuer: '', yearBS: '', icon: '🏆', description: '' });
    setCertImage(null);
    setEditingCert(null);
  };

  const submitCert = async () => {
    if (!certForm.title || !certForm.issuer)
      return showToast('Title and issuer are required!', 'error');
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(certForm).forEach(([k, v]) => { if (v) fd.append(k, v); });
      if (certImage) fd.append('image', certImage);
      if (editingCert) {
        const { data } = await API.put(`/certificates/${editingCert._id}`, fd, FD_CONFIG);
        setCerts(prev => prev.map(c => c._id === editingCert._id ? data.data : c));
        showToast('Award updated! ✅');
      } else {
        const { data } = await API.post('/certificates', fd, FD_CONFIG);
        setCerts(prev => [data.data, ...prev]);
        showToast('Award added! 🏆');
      }
      resetCertForm();
    } catch { showToast('Error saving award!', 'error'); }
    setSubmitting(false);
  };

  const startEditCert = (c) => {
    setEditingCert(c);
    setCertForm({
      title: c.title || '', issuer: c.issuer || '',
      yearBS: c.yearBS || '', icon: c.icon || '🏆',
      description: c.description || '',
    });
    setExpandedSection('awards');
  };

  const uploadGallery = async () => {
    if (galleryFiles.length === 0) return showToast('Select photos first!', 'error');
    setSubmitting(true);
    try {
      const fd = new FormData();
      galleryFiles.forEach(f => fd.append('photos', f));
      fd.append('caption', galleryCaption);
      fd.append('category', galleryCategory);
      const { data } = await API.post('/gallery', fd, FD_CONFIG);
      const uploaded = data.data;
      setGallery(prev => [...(Array.isArray(uploaded) ? uploaded : [uploaded]), ...prev]);
      showToast(`${galleryFiles.length} photo(s) uploaded! 📸`);
      setGalleryFiles([]); setGalleryCaption('');
    } catch (e) { showToast(e.response?.data?.message || 'Upload failed!', 'error'); }
    setSubmitting(false);
  };

  // ── Hero Slides handlers ─────────────────────────────────────────────────────
  const uploadHeroSlide = async () => {
    if (!heroFile) return showToast('Select an image first!', 'error');
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('image', heroFile);
      if (heroTitle)   fd.append('title',   heroTitle);
      if (heroCaption) fd.append('caption', heroCaption);
      const { data } = await API.post('/hero-slides', fd, FD_CONFIG);
      setHeroSlides(prev => [data.data, ...prev]);
      showToast('Hero slide added! 🏠');
      setHeroFile(null); setHeroCaption(''); setHeroTitle('');
      // Reset the file input
      const fi = document.getElementById('adm-hero-img');
      if (fi) fi.value = '';
    } catch (e) { showToast(e.response?.data?.message || 'Upload failed!', 'error'); }
    setSubmitting(false);
  };

  const saveHeroSettings = async () => {
    try {
      await API.put('/hero-slides/settings', { interval: heroInterval * 1000 });
      showToast('Slideshow settings saved! ✅');
    } catch { showToast('Failed to save settings.', 'error'); }
  };

  // ── Dashboard management section toggle ──────────────────────────────────────
  const toggleSection = (key) => setExpandedSection(prev => prev === key ? null : key);

  // ── Panel renderer ──────────────────────────────────────────────────────────
  const renderPanel = () => {
    switch (panel) {

      case 'dashboard':
        return (
          <>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1.2rem', marginBottom: '2rem' }}>
              {[
                { icon: '📋', label: 'Programs',    val: programs.length,   color: '#C8102E', bg: '#FEF2F2' },
                { icon: '📢', label: 'Notices',     val: notices.length,    color: '#6D28D9', bg: '#F5F3FF' },
                { icon: '🖼️', label: 'Gallery',     val: gallery.length,    color: '#0369A1', bg: '#F0F9FF' },
                { icon: '🏆', label: 'Awards',      val: certs.length,      color: '#B8941F', bg: '#FEF3C7' },
                { icon: '🏠', label: 'Hero Slides', val: heroSlides.length, color: '#047857', bg: '#ECFDF5' },
              ].map((s, i) => (
                <div key={i} style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: '12px', padding: '1.5rem' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', marginBottom: '1rem' }}>{s.icon}</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--gray-500)', marginTop: '4px', fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* ── Manage Programs ── */}
            <div style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: '12px', marginBottom: '1.5rem', overflow: 'hidden' }}>
              <div
                onClick={() => toggleSection('programs')}
                style={{ padding: '1rem 1.5rem', borderBottom: expandedSection === 'programs' ? '1px solid var(--gray-100)' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }}
              >
                <h3 style={{ fontWeight: 700, color: 'var(--gray-900)', fontSize: '1rem', margin: 0 }}>📋 Manage Programs</h3>
                <span style={{ color: 'var(--gray-400)', fontSize: '0.85rem' }}>{expandedSection === 'programs' ? '▲ Collapse' : '▼ Expand'}</span>
              </div>
              {expandedSection === 'programs' && (
                <div style={{ padding: '1.5rem' }}>
                  <p style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--gray-700)', marginBottom: '1rem' }}>
                    {editingProgram ? '✏️ Edit Program' : '➕ Add New Program'}
                  </p>
                  <Grid2>
                    <Field label="Program Title *">
                      <input className="form-input" value={progForm.title} onChange={e => setProgForm({ ...progForm, title: e.target.value })} placeholder="e.g. Annual Football Tournament 2082" />
                    </Field>
                    <Field label="Category">
                      <select className="form-input" value={progForm.category} onChange={e => setProgForm({ ...progForm, category: e.target.value })}>
                        <option value="tournament">Tournament</option>
                        <option value="community">Community</option>
                        <option value="cultural">Cultural</option>
                        <option value="training">Training</option>
                        <option value="other">Other</option>
                      </select>
                    </Field>
                    <Field label="Event Date *">
                      <input className="form-input" type="date" value={progForm.date} onChange={e => setProgForm({ ...progForm, date: e.target.value })} />
                    </Field>
                    <Field label="Location">
                      <input className="form-input" value={progForm.location} onChange={e => setProgForm({ ...progForm, location: e.target.value })} />
                    </Field>
                    <Field label="Participants (approx.)">
                      <input className="form-input" type="number" value={progForm.participants} onChange={e => setProgForm({ ...progForm, participants: e.target.value })} placeholder="e.g. 100" />
                    </Field>
                    <Field label="Status">
                      <select className="form-input" value={progForm.status} onChange={e => setProgForm({ ...progForm, status: e.target.value })}>
                        <option value="upcoming">Upcoming</option>
                        <option value="active">Active / Ongoing</option>
                        <option value="past">Completed</option>
                        <option value="draft">Draft</option>
                      </select>
                    </Field>
                  </Grid2>
                  <Field label="Short Description *">
                    <textarea className="form-input" rows="3" value={progForm.shortDesc} onChange={e => setProgForm({ ...progForm, shortDesc: e.target.value })} placeholder="Brief description shown on the card..." />
                  </Field>
                  <Field label="Full Details">
                    <textarea className="form-input" rows="4" value={progForm.fullDesc} onChange={e => setProgForm({ ...progForm, fullDesc: e.target.value })} placeholder="Full schedule, prizes, rules..." />
                  </Field>
                  <Field label="Cover Image (optional)" hint="Shown as the card banner.">
                    <input type="file" className="form-input" accept="image/*" style={{ padding: '8px' }} onChange={e => setProgCover(e.target.files[0] || null)} />
                    <FilePreview file={progCover} />
                  </Field>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '1rem' }}>
                    {editingProgram && (
                      <button className="btn" onClick={resetProgForm} style={{ background: 'var(--gray-100)', color: 'var(--gray-600)' }}>
                        Cancel
                      </button>
                    )}
                    <button className="btn btn-primary" onClick={submitProgram} disabled={submitting}>
                      {submitting ? 'Saving...' : editingProgram ? '✅ Update Program' : '🚀 Publish Program'}
                    </button>
                  </div>

                  <SectionDivider label={`All Programs (${programs.length})`} />
                  <Table
                    cols={['Cover', 'Title', 'Category', 'Date', 'Status', 'Actions']}
                    rows={programs.map(p => {
                      const cover = p.coverImage?.url || p.photos?.[0]?.url || null;
                      return [
                        cover
                          ? <img src={cover} alt="" style={{ width: '52px', height: '38px', objectFit: 'cover', borderRadius: '6px' }} />
                          : <span style={{ fontSize: '1.5rem' }}>{PROG_EMOJI[p.category] || '📌'}</span>,
                        <span style={{ fontWeight: 600 }}>{p.title}</span>,
                        p.category,
                        new Date(p.date).toLocaleDateString('en-GB'),
                        <StatusBadge s={p.status} />,
                        <span style={{ display: 'flex', gap: '4px' }}>
                          <EditBtn onClick={() => startEditProgram(p)} />
                          <DelBtn onClick={() => del('program', p._id)} />
                        </span>,
                      ];
                    })}
                  />
                </div>
              )}
            </div>

            {/* ── Manage Notices ── */}
            <div style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: '12px', marginBottom: '1.5rem', overflow: 'hidden' }}>
              <div
                onClick={() => toggleSection('notices')}
                style={{ padding: '1rem 1.5rem', borderBottom: expandedSection === 'notices' ? '1px solid var(--gray-100)' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }}
              >
                <h3 style={{ fontWeight: 700, color: 'var(--gray-900)', fontSize: '1rem', margin: 0 }}>📢 Manage Notices</h3>
                <span style={{ color: 'var(--gray-400)', fontSize: '0.85rem' }}>{expandedSection === 'notices' ? '▲ Collapse' : '▼ Expand'}</span>
              </div>
              {expandedSection === 'notices' && (
                <div style={{ padding: '1.5rem' }}>
                  <p style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--gray-700)', marginBottom: '1rem' }}>
                    {editingNotice ? '✏️ Edit Notice' : '➕ Add New Notice'}
                  </p>
                  <Grid2>
                    <Field label="Title *">
                      <input className="form-input" value={noticeForm.title} onChange={e => setNoticeForm({ ...noticeForm, title: e.target.value })} placeholder="e.g. Annual General Meeting 2083 BS" />
                    </Field>
                    <Field label="Category">
                      <select className="form-input" value={noticeForm.category} onChange={e => setNoticeForm({ ...noticeForm, category: e.target.value })}>
                        <option value="general">General</option>
                        <option value="event">Event</option>
                        <option value="urgent">Urgent</option>
                        <option value="meeting">Meeting</option>
                        <option value="sports">Sports</option>
                      </select>
                    </Field>
                    <Field label="Priority">
                      <select className="form-input" value={noticeForm.priority} onChange={e => setNoticeForm({ ...noticeForm, priority: e.target.value })}>
                        <option value="normal">Normal</option>
                        <option value="high">High</option>
                        <option value="low">Low</option>
                      </select>
                    </Field>
                    <Field label="Author">
                      <input className="form-input" value={noticeForm.author} onChange={e => setNoticeForm({ ...noticeForm, author: e.target.value })} placeholder="e.g. Club Secretary" />
                    </Field>
                  </Grid2>
                  <Field label="Body *">
                    <textarea className="form-input" rows="6" value={noticeForm.body} onChange={e => setNoticeForm({ ...noticeForm, body: e.target.value })} placeholder="Full notice content..." />
                  </Field>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: 'var(--gray-50)', borderRadius: '8px', border: '1px solid var(--gray-200)', marginBottom: '1rem' }}>
                    <input type="checkbox" id="dash-notice-pin" checked={noticeForm.featured} onChange={e => setNoticeForm({ ...noticeForm, featured: e.target.checked })} style={{ accentColor: '#C8102E', width: '16px', height: '16px', cursor: 'pointer' }} />
                    <label htmlFor="dash-notice-pin" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--gray-700)', cursor: 'pointer' }}>📌 Pin this notice (appears at the top)</label>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    {editingNotice && (
                      <button className="btn" onClick={resetNoticeForm} style={{ background: 'var(--gray-100)', color: 'var(--gray-600)' }}>
                        Cancel
                      </button>
                    )}
                    <button className="btn btn-primary" onClick={submitNotice} disabled={submitting}>
                      {submitting ? 'Saving...' : editingNotice ? '✅ Update Notice' : '📢 Post Notice'}
                    </button>
                  </div>

                  <SectionDivider label={`All Notices (${notices.length})`} />
                  <Table
                    cols={['Title', 'Category', 'Priority', 'Pinned', 'Date', 'Actions']}
                    rows={notices.map(n => [
                      <span style={{ fontWeight: 600 }}>{n.title}</span>,
                      <StatusBadge s={n.category} map={CAT_NOTICE_STYLE} />,
                      <StatusBadge s={n.priority} map={PRIORITY_STYLE} />,
                      n.featured ? '📌 Yes' : '—',
                      new Date(n.createdAt).toLocaleDateString('en-GB'),
                      <span style={{ display: 'flex', gap: '4px' }}>
                        <EditBtn onClick={() => startEditNotice(n)} />
                        <DelBtn onClick={() => del('notice', n._id)} />
                      </span>,
                    ])}
                  />
                </div>
              )}
            </div>

            {/* ── Manage Awards ── */}
            <div style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: '12px', marginBottom: '1.5rem', overflow: 'hidden' }}>
              <div
                onClick={() => toggleSection('awards')}
                style={{ padding: '1rem 1.5rem', borderBottom: expandedSection === 'awards' ? '1px solid var(--gray-100)' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }}
              >
                <h3 style={{ fontWeight: 700, color: 'var(--gray-900)', fontSize: '1rem', margin: 0 }}>🏆 Manage Awards</h3>
                <span style={{ color: 'var(--gray-400)', fontSize: '0.85rem' }}>{expandedSection === 'awards' ? '▲ Collapse' : '▼ Expand'}</span>
              </div>
              {expandedSection === 'awards' && (
                <div style={{ padding: '1.5rem' }}>
                  <p style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--gray-700)', marginBottom: '1rem' }}>
                    {editingCert ? '✏️ Edit Award' : '➕ Add New Award'}
                  </p>
                  <Grid2>
                    <Field label="Title *">
                      <input className="form-input" value={certForm.title} onChange={e => setCertForm({ ...certForm, title: e.target.value })} placeholder="e.g. District Championship Winner" />
                    </Field>
                    <Field label="Issued By *">
                      <input className="form-input" value={certForm.issuer} onChange={e => setCertForm({ ...certForm, issuer: e.target.value })} placeholder="e.g. ANFA Okhaldhunga" />
                    </Field>
                    <Field label="Year (BS)">
                      <input className="form-input" value={certForm.yearBS} onChange={e => setCertForm({ ...certForm, yearBS: e.target.value })} placeholder="e.g. 2080 BS" />
                    </Field>
                    <Field label="Icon (Emoji)">
                      <input className="form-input" value={certForm.icon} onChange={e => setCertForm({ ...certForm, icon: e.target.value })} placeholder="🏆" />
                    </Field>
                  </Grid2>
                  <Field label="Description">
                    <textarea className="form-input" rows="3" value={certForm.description} onChange={e => setCertForm({ ...certForm, description: e.target.value })} placeholder="Brief description of this achievement..." />
                  </Field>
                  <Field label="Award Image (optional)" hint="Shown as the card banner. If not provided, the icon emoji is shown on a red gradient.">
                    <input type="file" className="form-input" accept="image/*" style={{ padding: '8px' }} onChange={e => setCertImage(e.target.files[0] || null)} />
                    <FilePreview file={certImage} />
                  </Field>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '1rem' }}>
                    {editingCert && (
                      <button className="btn" onClick={resetCertForm} style={{ background: 'var(--gray-100)', color: 'var(--gray-600)' }}>
                        Cancel
                      </button>
                    )}
                    <button className="btn btn-primary" onClick={submitCert} disabled={submitting}>
                      {submitting ? 'Saving...' : editingCert ? '✅ Update Award' : '+ Add Award'}
                    </button>
                  </div>

                  <SectionDivider label={`All Awards (${certs.length})`} />
                  <p style={{ fontSize: '0.82rem', color: 'var(--gray-400)', marginBottom: '1rem' }}>
                    Static awards from <code>certificates.js</code> always show on the public page alongside these.
                  </p>
                  <Table
                    cols={['Image', 'Icon', 'Title', 'Issued By', 'Year', 'Actions']}
                    rows={certs.map(c => {
                      const imgSrc = c.image?.url || (typeof c.image === 'string' ? c.image : null);
                      return [
                        imgSrc
                          ? <img src={imgSrc} alt="" style={{ width: '52px', height: '38px', objectFit: 'cover', borderRadius: '6px' }} />
                          : <span style={{ fontSize: '1.5rem' }}>{c.icon || '🏆'}</span>,
                        c.icon || '—',
                        <span style={{ fontWeight: 600 }}>{c.title}</span>,
                        c.issuer,
                        c.yearBS || '—',
                        <span style={{ display: 'flex', gap: '4px' }}>
                          <EditBtn onClick={() => startEditCert(c)} />
                          <DelBtn onClick={() => del('cert', c._id)} />
                        </span>,
                      ];
                    })}
                  />
                </div>
              )}
            </div>

            {/* ── Manage Gallery ── */}
            <div style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: '12px', marginBottom: '1.5rem', overflow: 'hidden' }}>
              <div
                onClick={() => toggleSection('gallery')}
                style={{ padding: '1rem 1.5rem', borderBottom: expandedSection === 'gallery' ? '1px solid var(--gray-100)' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }}
              >
                <h3 style={{ fontWeight: 700, color: 'var(--gray-900)', fontSize: '1rem', margin: 0 }}>🖼️ Manage Gallery</h3>
                <span style={{ color: 'var(--gray-400)', fontSize: '0.85rem' }}>{expandedSection === 'gallery' ? '▲ Collapse' : '▼ Expand'}</span>
              </div>
              {expandedSection === 'gallery' && (
                <div style={{ padding: '1.5rem' }}>
                  <p style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--gray-700)', marginBottom: '1rem' }}>📸 Upload Photos</p>
                  <div
                    style={{ border: '2px dashed var(--gray-300)', borderRadius: '12px', padding: '2rem', textAlign: 'center', cursor: 'pointer', background: 'var(--gray-50)', marginBottom: '1rem' }}
                    onClick={() => document.getElementById('adm-gallery').click()}
                  >
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📸</div>
                    <p style={{ fontWeight: 600, color: 'var(--gray-700)' }}>Click to select photos</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)', marginTop: '4px' }}>JPG, PNG, WebP · Multiple files allowed</p>
                    {galleryFiles.length > 0 && <p style={{ color: '#166534', marginTop: '0.5rem', fontWeight: 600 }}>✓ {galleryFiles.length} photo(s) selected</p>}
                  </div>
                  <input id="adm-gallery" type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={e => setGalleryFiles(Array.from(e.target.files))} />
                  <Grid2>
                    <Field label="Caption (optional)">
                      <input className="form-input" value={galleryCaption} onChange={e => setGalleryCaption(e.target.value)} placeholder="e.g. Match vs Rival FC, 2082" />
                    </Field>
                    <Field label="Category">
                      <select className="form-input" value={galleryCategory} onChange={e => setGalleryCategory(e.target.value)}>
                        <option value="match">Match</option>
                        <option value="event">Event</option>
                        <option value="training">Training</option>
                        <option value="community">Community</option>
                        <option value="cultural">Cultural</option>
                      </select>
                    </Field>
                  </Grid2>
                  <div style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
                    <button className="btn btn-primary" onClick={uploadGallery} disabled={submitting}>
                      {submitting ? 'Uploading...' : '⬆️ Upload Photos'}
                    </button>
                  </div>

                  <SectionDivider label={`All Gallery Photos (${gallery.length})`} />
                  <p style={{ fontSize: '0.82rem', color: 'var(--gray-400)', marginBottom: '1rem' }}>
                    Static photos from <code>gallery.js</code> always show on the public page alongside these.
                  </p>
                  {gallery.length === 0
                    ? <p style={{ color: 'var(--gray-400)', fontSize: '0.88rem' }}>No photos uploaded yet.</p>
                    : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '10px' }}>
                        {gallery.map(g => (
                          <div key={g._id} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--gray-200)' }}>
                            <img src={g.url} alt={g.caption || ''} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }} />
                            <button
                              onClick={() => del('gallery', g._id)}
                              style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(200,16,46,0.85)', color: 'white', border: 'none', borderRadius: '4px', padding: '2px 6px', fontSize: '0.7rem', cursor: 'pointer', fontFamily: 'var(--font)' }}
                            >🗑</button>
                            {g.caption && (
                              <div style={{ padding: '4px 6px', fontSize: '0.68rem', color: 'var(--gray-600)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', background: 'white' }}>
                                {g.caption}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )
                  }
                </div>
              )}
            </div>

            {/* ── Manage Hero Slides ── */}
            <div style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: '12px', marginBottom: '1.5rem', overflow: 'hidden' }}>
              <div
                onClick={() => toggleSection('heroSlides')}
                style={{ padding: '1rem 1.5rem', borderBottom: expandedSection === 'heroSlides' ? '1px solid var(--gray-100)' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h3 style={{ fontWeight: 700, color: 'var(--gray-900)', fontSize: '1rem', margin: 0 }}>🏠 Manage Hero Slides</h3>
                  <span style={{ background: '#ECFDF5', color: '#047857', fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '20px' }}>Homepage Slideshow</span>
                </div>
                <span style={{ color: 'var(--gray-400)', fontSize: '0.85rem' }}>{expandedSection === 'heroSlides' ? '▲ Collapse' : '▼ Expand'}</span>
              </div>
              {expandedSection === 'heroSlides' && (
                <div style={{ padding: '1.5rem' }}>

                  {/* Info banner */}
                  <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1.5rem', fontSize: '0.83rem', color: '#1E40AF' }}>
                    <strong>ℹ️ Hero Slideshow:</strong> These images replace the homepage hero section. If no slides are uploaded, the default red gradient hero is shown. Images are displayed one at a time and scroll automatically.
                  </div>

                  {/* Upload form */}
                  <p style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--gray-700)', marginBottom: '1rem' }}>🖼️ Add New Slide</p>
                  <div
                    style={{ border: '2px dashed var(--gray-300)', borderRadius: '12px', padding: '2rem', textAlign: 'center', cursor: 'pointer', background: 'var(--gray-50)', marginBottom: '1rem' }}
                    onClick={() => document.getElementById('adm-hero-img').click()}
                  >
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🏠</div>
                    <p style={{ fontWeight: 600, color: 'var(--gray-700)' }}>Click to select image</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)', marginTop: '4px' }}>JPG, PNG, WebP · Landscape recommended (16:9)</p>
                    {heroFile && <p style={{ color: '#166534', marginTop: '0.5rem', fontWeight: 600 }}>✓ {heroFile.name}</p>}
                  </div>
                  <input
                    id="adm-hero-img"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={e => setHeroFile(e.target.files[0] || null)}
                  />
                  <Grid2>
                    <Field label="Slide Title (optional)" hint="Shown as a heading overlay on the slide.">
                      <input className="form-input" value={heroTitle} onChange={e => setHeroTitle(e.target.value)} placeholder="e.g. Annual Tournament 2082" />
                    </Field>
                    <Field label="Caption (optional)" hint="Short label shown at the bottom of the slide.">
                      <input className="form-input" value={heroCaption} onChange={e => setHeroCaption(e.target.value)} placeholder="e.g. Jakma Ground, 2082" />
                    </Field>
                  </Grid2>
                  <div style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
                    <button className="btn btn-primary" onClick={uploadHeroSlide} disabled={submitting}>
                      {submitting ? 'Uploading...' : '⬆️ Add Slide'}
                    </button>
                  </div>

                  {/* Interval setting */}
                  <div style={{ background: 'var(--gray-50)', border: '1px solid var(--gray-200)', borderRadius: '10px', padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
                    <p style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--gray-700)', marginBottom: '0.75rem' }}>⏱ Slideshow Interval</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                          type="range"
                          min="2" max="30" step="1"
                          value={heroInterval}
                          onChange={e => setHeroInterval(Number(e.target.value))}
                          style={{ width: '160px', accentColor: '#C8102E', cursor: 'pointer' }}
                        />
                        <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#C8102E', minWidth: '50px' }}>{heroInterval}s</span>
                      </div>
                      <p style={{ fontSize: '0.78rem', color: 'var(--gray-400)', margin: 0, flex: 1 }}>Each slide will be shown for {heroInterval} second{heroInterval !== 1 ? 's' : ''} before advancing.</p>
                      <button className="btn btn-primary" onClick={saveHeroSettings} style={{ fontSize: '0.82rem', padding: '7px 16px' }}>
                        💾 Save Interval
                      </button>
                    </div>
                  </div>

                  <SectionDivider label={`Current Slides (${heroSlides.length})`} />
                  {heroSlides.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-400)' }}>
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏠</div>
                      <p style={{ fontSize: '0.88rem' }}>No hero slides yet. The default gradient hero will be shown on the homepage.</p>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
                      {heroSlides.map((slide, idx) => (
                        <div key={slide._id} style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--gray-200)', background: '#111' }}>
                          {/* Slide number badge */}
                          <div style={{ position: 'absolute', top: '6px', left: '6px', background: 'rgba(0,0,0,0.7)', color: 'white', borderRadius: '6px', padding: '2px 7px', fontSize: '0.68rem', fontWeight: 700, zIndex: 1 }}>
                            #{idx + 1}
                          </div>
                          <img
                            src={slide.url}
                            alt={slide.caption || ''}
                            style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }}
                          />
                          <button
                            onClick={() => del('heroSlide', slide._id)}
                            style={{ position: 'absolute', top: '6px', right: '6px', background: 'rgba(200,16,46,0.9)', color: 'white', border: 'none', borderRadius: '4px', padding: '2px 7px', fontSize: '0.7rem', cursor: 'pointer', fontFamily: 'var(--font)', zIndex: 1 }}
                          >🗑</button>
                          {(slide.title || slide.caption) && (
                            <div style={{ padding: '6px 8px', background: 'white', borderTop: '1px solid var(--gray-100)' }}>
                              {slide.title && <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--gray-800)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{slide.title}</p>}
                              {slide.caption && <p style={{ fontSize: '0.68rem', color: 'var(--gray-400)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{slide.caption}</p>}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

          </>
        );

      // ── Messages ─────────────────────────────────────────────────────────────
      case 'messages':
        return (
          <Card title={`💬 Contact Messages (${messages.filter(m => !m.read).length} unread)`}>
            <Table
              cols={['Name', 'Email', 'Subject', 'Message', 'Date', 'Actions']}
              rows={messages.map(m => [
                <span style={{ fontWeight: 600 }}>{m.name}</span>,
                m.email || '—',
                m.subject || '—',
                <span style={{ maxWidth: '180px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.message}</span>,
                new Date(m.createdAt).toLocaleDateString('en-GB'),
                <DelBtn onClick={() => del('contact', m._id)} />,
              ])}
            />
          </Card>
        );

      default: return null;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--gray-50)' }}>

      {/* Sidebar */}
      <aside style={{ width: '240px', background: 'white', borderRight: '1px solid var(--gray-200)', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto', flexShrink: 0 }}>
        <div style={{ padding: '1.5rem 1rem', borderBottom: '1px solid var(--gray-100)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#C8102E,#9B0B22)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '0.75rem', flexShrink: 0 }}>
            {user.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--gray-900)' }}>{user.name}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--gray-400)' }}>Administrator</div>
          </div>
        </div>
        <div style={{ padding: '0.5rem 0' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 1rem', color: 'var(--gray-500)', fontSize: '0.82rem', textDecoration: 'none', borderBottom: '1px solid var(--gray-100)', marginBottom: '0.5rem' }}>
            ← Back to Website
          </Link>
          {PANELS.map(p => (
            <button
              key={p.key}
              onClick={() => setPanel(p.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
                padding: '10px 1rem', border: 'none', cursor: 'pointer',
                background: panel === p.key ? '#FEF2F2' : 'transparent',
                color: panel === p.key ? '#C8102E' : 'var(--gray-600)',
                fontFamily: 'var(--font)', fontWeight: panel === p.key ? 700 : 500,
                fontSize: '0.875rem', textAlign: 'left', transition: 'all 0.2s',
                borderLeft: `3px solid ${panel === p.key ? '#C8102E' : 'transparent'}`,
              }}
            >
              <span>{p.icon}</span> {p.label}
            </button>
          ))}
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
              padding: '10px 1rem', border: 'none', cursor: 'pointer',
              background: 'transparent', color: 'var(--gray-400)',
              fontFamily: 'var(--font)', fontWeight: 500, fontSize: '0.875rem',
              marginTop: '1rem', borderTop: '1px solid var(--gray-100)', textAlign: 'left',
            }}
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: '2rem', overflowX: 'hidden' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--gray-900)' }}>
            {PANELS.find(p => p.key === panel)?.label}
          </h1>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.88rem', marginTop: '2px' }}>
            Fulbari Yuba Club Jakma — Admin Dashboard
          </p>
        </div>
        {renderPanel()}
      </main>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9000,
          background: toast.type === 'success' ? '#059669' : '#DC2626',
          color: 'white', padding: '1rem 1.5rem', borderRadius: '10px',
          fontWeight: 600, fontSize: '0.9rem', boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
          animation: 'slideUp 0.3s ease',
        }}>
          {toast.type === 'success' ? '✓ ' : '✗ '}{toast.msg}
        </div>
      )}

      <style>{`
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0 } to { transform: none; opacity: 1 } }
        @media (max-width: 768px) {
          aside { display: none !important; }
          main  { padding: 1rem !important; }
        }
      `}</style>
    </div>
  );
};

export default AdminPage;