import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import API from '../utils/api.js';

const PANELS = [
  { key: 'dashboard', icon: '📊', label: 'Dashboard' },
  { key: 'post-program', icon: '➕', label: 'Post Program' },
  { key: 'programs', icon: '📋', label: 'Manage Programs' },
  { key: 'post-blog', icon: '✏️', label: 'Write Blog' },
  { key: 'blogs', icon: '📰', label: 'Manage Blogs' },
  { key: 'certificates', icon: '🏆', label: 'Awards' },
  { key: 'gallery', icon: '🖼️', label: 'Gallery' },
  { key: 'members', icon: '👥', label: 'Members' },
  { key: 'admins', icon: '🔐', label: 'Manage Admins' },
  { key: 'messages', icon: '💬', label: 'Messages' },
];

const STATUS_STYLE = {
  upcoming: { bg: '#FEF3C7', color: '#92400E' },
  active: { bg: '#D1FAE5', color: '#065F46' },
  past: { bg: '#F3F4F6', color: '#6B7280' },
  draft: { bg: '#DBEAFE', color: '#1E40AF' },
  published: { bg: '#D1FAE5', color: '#065F46' },
};

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

const StatusBadge = ({ s }) => {
  const style = STATUS_STYLE[s] || STATUS_STYLE.draft;
  return <span style={{ ...style, padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 600 }}>{s}</span>;
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
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
    {children}
  </div>
);

const Field = ({ label, children }) => (
  <div className="form-group">
    <label className="form-label">{label}</label>
    {children}
  </div>
);

const DelBtn = ({ onClick }) => (
  <button onClick={onClick} style={{ background: '#FEF2F2', color: '#C8102E', border: 'none', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, fontFamily: 'var(--font)' }}>
    🗑 Delete
  </button>
);

const AdminPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [panel, setPanel] = useState('dashboard');

  const [programs, setPrograms] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [certs, setCerts] = useState([]);
  const [members, setMembers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [messages, setMessages] = useState([]);
  const [toast, setToast] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [progForm, setProgForm] = useState({ title: '', category: 'tournament', date: '', location: 'Jakma, Okhaldhunga', shortDesc: '', fullDesc: '', status: 'upcoming', organizer: 'Fulbari Yuba Club Jakma', participants: '' });
  const [blogForm, setBlogForm] = useState({ title: '', category: 'news', summary: '', content: '', author: user?.name || 'FYC Admin', tags: '', status: 'published' });
  const [certForm, setCertForm] = useState({ title: '', issuer: '', yearBS: '', icon: '🏆', description: '', category: 'certificate' });
  const [memberForm, setMemberForm] = useState({ name: '', email: '', position: '', jerseyNumber: '', memberSince: '', phone: '' });
  const [adminForm, setAdminForm] = useState({ name: '', email: '', password: '' });
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryCaption, setGalleryCaption] = useState('');
  const [galleryCategory, setGalleryCategory] = useState('other');

  if (!user || user.role !== 'admin') return <Navigate to="/" />;

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadData = async () => {
    try {
      const [p, c, m, msg] = await Promise.all([
        API.get('/programs?limit=100'),
        API.get('/certificates'),
        API.get('/members'),
        API.get('/contact'),
      ]);
      setPrograms(p.data.data || []);
      setCerts(c.data.data || []);
      setMembers(m.data.data || []);
      setMessages(msg.data.data || []);
    } catch {}

    try {
      const b = await API.get('/blogs/all');
      setBlogs(b.data.data || []);
    } catch {}

    try {
      const a = await API.get('/auth/users');
      const allUsers = a.data.data || [];
      setAdmins(allUsers.filter(u => u.role === 'admin'));
    } catch {}
  };

  useEffect(() => { loadData(); }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  const del = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this?')) return;
    try {
      const urls = { program: `/programs/${id}`, blog: `/blogs/${id}`, cert: `/certificates/${id}`, contact: `/contact/${id}`, user: `/auth/users/${id}` };
      await API.delete(urls[type]);
      if (type === 'program') setPrograms(prev => prev.filter(p => p._id !== id));
      if (type === 'blog') setBlogs(prev => prev.filter(b => b._id !== id));
      if (type === 'cert') setCerts(prev => prev.filter(c => c._id !== id));
      if (type === 'contact') setMessages(prev => prev.filter(m => m._id !== id));
      if (type === 'user') { setAdmins(prev => prev.filter(a => a._id !== id)); setMembers(prev => prev.filter(m => m._id !== id)); }
      showToast('Deleted successfully.', 'error');
    } catch (e) { showToast(e.response?.data?.message || 'Error!', 'error'); }
  };

  const submitProgram = async () => {
    if (!progForm.title || !progForm.category || !progForm.date || !progForm.shortDesc) {
      return showToast('Title, category, date and description required!', 'error');
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(progForm).forEach(([k, v]) => { if (v) fd.append(k, v); });
      const { data } = await API.post('/programs', fd);
      setPrograms(prev => [data.data, ...prev]);
      showToast('Program published! 🎉');
      setProgForm({ title: '', category: 'tournament', date: '', location: 'Jakma, Okhaldhunga', shortDesc: '', fullDesc: '', status: 'upcoming', organizer: 'Fulbari Yuba Club Jakma', participants: '' });
    } catch (e) { showToast(e.response?.data?.message || 'Error!', 'error'); }
    setSubmitting(false);
  };

  const submitBlog = async () => {
    if (!blogForm.title || !blogForm.content) return showToast('Title and content required!', 'error');
    setSubmitting(true);
    try {
      const { data } = await API.post('/blogs', blogForm);
      setBlogs(prev => [data.data, ...prev]);
      showToast('Blog published! 📤');
      setBlogForm({ title: '', category: 'news', summary: '', content: '', author: user?.name || 'FYC Admin', tags: '', status: 'published' });
    } catch (e) { showToast(e.response?.data?.message || 'Error!', 'error'); }
    setSubmitting(false);
  };

  const submitCert = async () => {
    if (!certForm.title) return showToast('Title required!', 'error');
    setSubmitting(true);
    try {
      const { data } = await API.post('/certificates', certForm);
      setCerts(prev => [data.data, ...prev]);
      showToast('Certificate added! 🏆');
      setCertForm({ title: '', issuer: '', yearBS: '', icon: '🏆', description: '', category: 'certificate' });
    } catch { showToast('Error!', 'error'); }
    setSubmitting(false);
  };

  const submitMember = async () => {
    if (!memberForm.name || !memberForm.email) return showToast('Name and email required!', 'error');
    setSubmitting(true);
    try {
      await API.post('/auth/users', { ...memberForm, role: 'member', password: 'FYCMember@123' });
      showToast('Member added! 👤');
      setMemberForm({ name: '', email: '', position: '', jerseyNumber: '', memberSince: '', phone: '' });
      loadData();
    } catch (e) { showToast(e.response?.data?.message || 'Error!', 'error'); }
    setSubmitting(false);
  };

  // Add new admin
  const submitAdmin = async () => {
    if (!adminForm.name || !adminForm.email || !adminForm.password) {
      return showToast('Name, email and password required!', 'error');
    }
    setSubmitting(true);
    try {
      const { data } = await API.post('/auth/users', { ...adminForm, role: 'admin' });
      setAdmins(prev => [...prev, data.data]);
      showToast('New admin added! 🔐');
      setAdminForm({ name: '', email: '', password: '' });
    } catch (e) { showToast(e.response?.data?.message || 'Error!', 'error'); }
    setSubmitting(false);
  };

  const uploadGallery = async () => {
    if (galleryFiles.length === 0) return showToast('Select photos first!', 'error');
    setSubmitting(true);
    try {
      const fd = new FormData();
      galleryFiles.forEach(f => fd.append('photos', f));
      fd.append('caption', galleryCaption);
      fd.append('category', galleryCategory);
      await API.post('/gallery', fd);
      showToast(`${galleryFiles.length} photo(s) uploaded! 📸`);
      setGalleryFiles([]); setGalleryCaption('');
    } catch { showToast('Upload failed!', 'error'); }
    setSubmitting(false);
  };

  const renderPanel = () => {
    switch (panel) {
      case 'dashboard':
        return (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.2rem', marginBottom: '2rem' }}>
              {[
                { icon: '📋', label: 'Programs', val: programs.length, color: '#C8102E', bg: '#FEF2F2' },
                { icon: '👥', label: 'Members', val: members.length, color: '#059669', bg: '#D1FAE5' },
                { icon: '📰', label: 'Blog Posts', val: blogs.length, color: '#1D4ED8', bg: '#DBEAFE' },
                { icon: '🏆', label: 'Awards', val: certs.length, color: '#B8941F', bg: '#FEF3C7' },
              ].map((s, i) => (
                <div key={i} style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: '12px', padding: '1.5rem' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', marginBottom: '1rem' }}>{s.icon}</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--gray-500)', marginTop: '4px', fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
              <style>{`@media(max-width:900px){div[style*="repeat(4"]{grid-template-columns:repeat(2,1fr)!important}}`}</style>
            </div>
            <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '10px', padding: '1rem 1.5rem', marginBottom: '1.5rem', fontSize: '0.88rem', color: '#1E40AF' }}>
              <strong>💡 Tip:</strong> When logged in as admin, you'll see <strong>"+ Post"</strong> buttons directly on the Programs, Awards, Blog, and Gallery pages — so you can add content without coming to the dashboard.
            </div>
            <Card title="📋 Recent Programs">
              <Table cols={['Title', 'Category', 'Date', 'Status', 'Actions']}
                rows={programs.slice(0,5).map(p => [
                  <span style={{ fontWeight: 600 }}>{p.title}</span>, p.category,
                  new Date(p.date).toLocaleDateString('en-GB'), <StatusBadge s={p.status} />,
                  <DelBtn onClick={() => del('program', p._id)} />
                ])}
              />
            </Card>
            <Card title="📰 Recent Blog Posts">
              <Table cols={['Title', 'Category', 'Date', 'Status', 'Actions']}
                rows={blogs.slice(0,5).map(b => [
                  <span style={{ fontWeight: 600 }}>{b.title}</span>, b.category,
                  new Date(b.createdAt).toLocaleDateString('en-GB'), <StatusBadge s={b.status} />,
                  <DelBtn onClick={() => del('blog', b._id)} />
                ])}
              />
            </Card>
          </>
        );

      case 'post-program':
        return (
          <Card title="➕ Post New Program">
            <Grid2>
              <Field label="Program Title *"><input className="form-input" value={progForm.title} onChange={e => setProgForm({...progForm, title: e.target.value})} placeholder="e.g. Annual Football Tournament 2082" /></Field>
              <Field label="Category"><select className="form-input" value={progForm.category} onChange={e => setProgForm({...progForm, category: e.target.value})}><option value="tournament">Tournament</option><option value="community">Community</option><option value="cultural">Cultural</option><option value="training">Training</option><option value="other">Other</option></select></Field>
              <Field label="Event Date *"><input className="form-input" type="date" value={progForm.date} onChange={e => setProgForm({...progForm, date: e.target.value})} /></Field>
              <Field label="Location"><input className="form-input" value={progForm.location} onChange={e => setProgForm({...progForm, location: e.target.value})} /></Field>
              <Field label="Participants (approx.)"><input className="form-input" type="number" value={progForm.participants} onChange={e => setProgForm({...progForm, participants: e.target.value})} placeholder="e.g. 100" /></Field>
              <Field label="Status"><select className="form-input" value={progForm.status} onChange={e => setProgForm({...progForm, status: e.target.value})}><option value="upcoming">Upcoming</option><option value="active">Active</option><option value="past">Completed</option><option value="draft">Draft</option></select></Field>
            </Grid2>
            <Field label="Short Description *"><textarea className="form-input" rows="3" value={progForm.shortDesc} onChange={e => setProgForm({...progForm, shortDesc: e.target.value})} placeholder="Brief description shown in cards..." /></Field>
            <Field label="Full Details"><textarea className="form-input" rows="5" value={progForm.fullDesc} onChange={e => setProgForm({...progForm, fullDesc: e.target.value})} placeholder="Full details, schedule, prizes..." /></Field>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button className="btn btn-primary" onClick={submitProgram} disabled={submitting}>{submitting ? 'Publishing...' : '🚀 Publish Program'}</button>
            </div>
          </Card>
        );

      case 'programs':
        return (
          <Card title="📋 All Programs" action={<button className="btn btn-primary btn-sm" onClick={() => setPanel('post-program')}>+ New</button>}>
            <Table cols={['Title', 'Category', 'Date', 'Location', 'Status', 'Actions']}
              rows={programs.map(p => [
                <span style={{ fontWeight: 600 }}>{p.title}</span>, p.category,
                new Date(p.date).toLocaleDateString('en-GB'), p.location,
                <StatusBadge s={p.status} />, <DelBtn onClick={() => del('program', p._id)} />
              ])}
            />
          </Card>
        );

      case 'post-blog':
        return (
          <Card title="✏️ Write New Blog Post">
            <Grid2>
              <Field label="Blog Title *"><input className="form-input" value={blogForm.title} onChange={e => setBlogForm({...blogForm, title: e.target.value})} placeholder="Enter post title..." /></Field>
              <Field label="Category"><select className="form-input" value={blogForm.category} onChange={e => setBlogForm({...blogForm, category: e.target.value})}><option value="news">News</option><option value="match">Match Report</option><option value="announcement">Announcement</option><option value="community">Community</option><option value="achievement">Achievement</option></select></Field>
              <Field label="Author"><input className="form-input" value={blogForm.author} onChange={e => setBlogForm({...blogForm, author: e.target.value})} /></Field>
              <Field label="Status"><select className="form-input" value={blogForm.status} onChange={e => setBlogForm({...blogForm, status: e.target.value})}><option value="published">Published</option><option value="draft">Draft</option></select></Field>
            </Grid2>
            <Field label="Summary"><textarea className="form-input" rows="2" value={blogForm.summary} onChange={e => setBlogForm({...blogForm, summary: e.target.value})} placeholder="Brief summary..." /></Field>
            <Field label="Full Content *"><textarea className="form-input" rows="10" value={blogForm.content} onChange={e => setBlogForm({...blogForm, content: e.target.value})} placeholder="Write the full blog post here..." /></Field>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button className="btn btn-primary" onClick={submitBlog} disabled={submitting}>{submitting ? 'Publishing...' : '📤 Publish Post'}</button>
            </div>
          </Card>
        );

      case 'blogs':
        return (
          <Card title="📰 All Blog Posts" action={<button className="btn btn-primary btn-sm" onClick={() => setPanel('post-blog')}>+ New</button>}>
            <Table cols={['Title', 'Category', 'Author', 'Date', 'Status', 'Actions']}
              rows={blogs.map(b => [
                <span style={{ fontWeight: 600 }}>{b.title}</span>, b.category, b.author,
                new Date(b.createdAt).toLocaleDateString('en-GB'), <StatusBadge s={b.status} />,
                <DelBtn onClick={() => del('blog', b._id)} />
              ])}
            />
          </Card>
        );

      case 'certificates':
        return (
          <>
            <Card title="🏆 Add Award">
              <Grid2>
                <Field label="Title *"><input className="form-input" value={certForm.title} onChange={e => setCertForm({...certForm, title: e.target.value})} placeholder="Award title..." /></Field>
                <Field label="Issued By *"><input className="form-input" value={certForm.issuer} onChange={e => setCertForm({...certForm, issuer: e.target.value})} placeholder="e.g. ANFA Okhaldhunga" /></Field>
                <Field label="Year (BS)"><input className="form-input" value={certForm.yearBS} onChange={e => setCertForm({...certForm, yearBS: e.target.value})} placeholder="e.g. 2080 BS" /></Field>
                <Field label="Icon"><input className="form-input" value={certForm.icon} onChange={e => setCertForm({...certForm, icon: e.target.value})} placeholder="🏆" /></Field>
              </Grid2>
              <Field label="Description"><textarea className="form-input" rows="2" value={certForm.description} onChange={e => setCertForm({...certForm, description: e.target.value})} /></Field>
              <div style={{ textAlign: 'right', marginTop: '1rem' }}>
                <button className="btn btn-primary" onClick={submitCert} disabled={submitting}>{submitting ? 'Adding...' : '+ Add Award'}</button>
              </div>
            </Card>
            <Card title="All Awards">
              <Table cols={['Icon', 'Title', 'Issued By', 'Year', 'Actions']}
                rows={certs.map(c => [c.icon, <span style={{ fontWeight: 600 }}>{c.title}</span>, c.issuer, c.yearBS, <DelBtn onClick={() => del('cert', c._id)} />])}
              />
            </Card>
          </>
        );

      case 'gallery':
        return (
          <Card title="📸 Upload Photos">
            <div style={{ border: '2px dashed var(--gray-300)', borderRadius: '12px', padding: '3rem', textAlign: 'center', cursor: 'pointer', background: 'var(--gray-50)', marginBottom: '1rem' }} onClick={() => document.getElementById('adm-gallery').click()}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📸</div>
              <p style={{ fontWeight: 600 }}>Click to select photos</p>
              {galleryFiles.length > 0 && <p style={{ color: '#059669', marginTop: '0.5rem' }}>✓ {galleryFiles.length} selected</p>}
            </div>
            <input id="adm-gallery" type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={e => setGalleryFiles(Array.from(e.target.files))} />
            <Grid2>
              <Field label="Caption"><input className="form-input" value={galleryCaption} onChange={e => setGalleryCaption(e.target.value)} placeholder="Photo caption..." /></Field>
              <Field label="Category"><select className="form-input" value={galleryCategory} onChange={e => setGalleryCategory(e.target.value)}><option value="match">Match</option><option value="event">Event</option><option value="training">Training</option><option value="community">Community</option><option value="cultural">Cultural</option><option value="other">Other</option></select></Field>
            </Grid2>
            <div style={{ textAlign: 'right', marginTop: '1rem' }}>
              <button className="btn btn-primary" onClick={uploadGallery} disabled={submitting}>{submitting ? 'Uploading...' : '⬆️ Upload'}</button>
            </div>
          </Card>
        );

      case 'members':
        return (
          <>
            <Card title="👤 Add New Member">
              <Grid2>
                <Field label="Full Name *"><input className="form-input" value={memberForm.name} onChange={e => setMemberForm({...memberForm, name: e.target.value})} placeholder="Member's full name" /></Field>
                <Field label="Email *"><input className="form-input" type="email" value={memberForm.email} onChange={e => setMemberForm({...memberForm, email: e.target.value})} placeholder="member@email.com" /></Field>
                <Field label="Phone"><input className="form-input" value={memberForm.phone} onChange={e => setMemberForm({...memberForm, phone: e.target.value})} placeholder="+977..." /></Field>
                <Field label="Position"><input className="form-input" value={memberForm.position} onChange={e => setMemberForm({...memberForm, position: e.target.value})} placeholder="Player, Coach..." /></Field>
                <Field label="Jersey #"><input className="form-input" type="number" value={memberForm.jerseyNumber} onChange={e => setMemberForm({...memberForm, jerseyNumber: e.target.value})} placeholder="#" /></Field>
                <Field label="Member Since"><input className="form-input" value={memberForm.memberSince} onChange={e => setMemberForm({...memberForm, memberSince: e.target.value})} placeholder="e.g. 2075 BS" /></Field>
              </Grid2>
              <div style={{ textAlign: 'right', marginTop: '1rem' }}>
                <button className="btn btn-primary" onClick={submitMember} disabled={submitting}>{submitting ? 'Adding...' : '+ Add Member'}</button>
              </div>
            </Card>
            <Card title={`All Members (${members.length})`}>
              <Table cols={['Name', 'Email', 'Position', 'Jersey', 'Since', 'Actions']}
                rows={members.map(m => [
                  <span style={{ fontWeight: 600 }}>{m.name}</span>,
                  m.email, m.position || '—', m.jerseyNumber ? `#${m.jerseyNumber}` : '—',
                  m.memberSince || '—', <DelBtn onClick={() => del('user', m._id)} />
                ])}
              />
            </Card>
          </>
        );

      case 'admins':
        return (
          <>
            <div style={{ background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: '10px', padding: '1rem 1.5rem', marginBottom: '1.5rem', fontSize: '0.88rem', color: '#92400E' }}>
              <strong>ℹ️ Multiple Admins:</strong> You can add additional admin accounts here. Each admin can log in using the Admin button in the navbar and has full access to manage the website. You can also add them via Vercel environment variables (ADMIN_2_EMAIL, ADMIN_2_PASSWORD, etc.).
            </div>
            <Card title="🔐 Add New Admin Account">
              <Grid2>
                <Field label="Admin Name *"><input className="form-input" value={adminForm.name} onChange={e => setAdminForm({...adminForm, name: e.target.value})} placeholder="Admin's full name" /></Field>
                <Field label="Admin Email *"><input className="form-input" type="email" value={adminForm.email} onChange={e => setAdminForm({...adminForm, email: e.target.value})} placeholder="admin2@fycjakma.com" /></Field>
              </Grid2>
              <Field label="Password *">
                <input className="form-input" type="password" value={adminForm.password} onChange={e => setAdminForm({...adminForm, password: e.target.value})} placeholder="Set a strong password (min 8 chars)" />
              </Field>
              <div style={{ textAlign: 'right', marginTop: '1rem' }}>
                <button className="btn btn-primary" onClick={submitAdmin} disabled={submitting}>{submitting ? 'Adding...' : '🔐 Add Admin'}</button>
              </div>
            </Card>
            <Card title={`Current Admins (${admins.length})`}>
              <Table cols={['Name', 'Email', 'Created', 'Actions']}
                rows={admins.map(a => [
                  <span style={{ fontWeight: 600 }}>{a.name}</span>,
                  a.email,
                  new Date(a.createdAt).toLocaleDateString('en-GB'),
                  a._id === user.id
                    ? <span style={{ fontSize: '0.78rem', color: 'var(--gray-400)' }}>You</span>
                    : <DelBtn onClick={() => del('user', a._id)} />
                ])}
              />
            </Card>
          </>
        );

      case 'messages':
        return (
          <Card title={`💬 Messages (${messages.filter(m => !m.read).length} unread)`}>
            <Table cols={['Name', 'Email', 'Subject', 'Message', 'Date', 'Actions']}
              rows={messages.map(m => [
                <span style={{ fontWeight: 600 }}>{m.name}</span>,
                m.email || '—', m.subject || '—',
                <span style={{ maxWidth: '180px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.message}</span>,
                new Date(m.createdAt).toLocaleDateString('en-GB'),
                <DelBtn onClick={() => del('contact', m._id)} />
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
            <button key={p.key} onClick={() => setPanel(p.key)} style={{
              display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
              padding: '10px 1rem', border: 'none', cursor: 'pointer',
              background: panel === p.key ? '#FEF2F2' : 'transparent',
              color: panel === p.key ? '#C8102E' : 'var(--gray-600)',
              fontFamily: 'var(--font)', fontWeight: panel === p.key ? 700 : 500,
              fontSize: '0.875rem', textAlign: 'left', transition: 'all 0.2s',
              borderLeft: `3px solid ${panel === p.key ? '#C8102E' : 'transparent'}`,
            }}>
              <span>{p.icon}</span> {p.label}
            </button>
          ))}
          <button onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
            padding: '10px 1rem', border: 'none', cursor: 'pointer',
            background: 'transparent', color: 'var(--gray-400)',
            fontFamily: 'var(--font)', fontWeight: 500, fontSize: '0.875rem',
            marginTop: '1rem', borderTop: '1px solid var(--gray-100)', textAlign: 'left',
          }}>
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
        @keyframes slideUp { from{transform:translateY(20px);opacity:0} to{transform:none;opacity:1} }
        @media(max-width:768px){
          aside{display:none!important}
          main{padding:1rem!important}
        }
      `}</style>
    </div>
  );
};

export default AdminPage;
