import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

const PANELS = [
  { key: 'dashboard', icon: '📊', label: 'Dashboard' },
  { key: 'post-program', icon: '➕', label: 'Post Program' },
  { key: 'programs', icon: '📋', label: 'Manage Programs' },
  { key: 'post-blog', icon: '✏️', label: 'Write Blog' },
  { key: 'blogs', icon: '📰', label: 'Manage Blogs' },
  { key: 'certificates', icon: '🏆', label: 'Awards' },
  { key: 'gallery', icon: '🖼️', label: 'Gallery' },
  { key: 'members', icon: '👥', label: 'Members' },
  { key: 'messages', icon: '💬', label: 'Messages' },
];

const STATUS_STYLE = {
  upcoming: { bg: '#FEF3C7', color: '#92400E' },
  active: { bg: '#D1FAE5', color: '#065F46' },
  past: { bg: '#F3F4F6', color: '#6B7280' },
  draft: { bg: '#DBEAFE', color: '#1E40AF' },
  published: { bg: '#D1FAE5', color: '#065F46' },
};

// ---- Reusable Table ----
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
        {rows.map((row, i) => (
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

const AdminPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [panel, setPanel] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data states
  const [programs, setPrograms] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [certs, setCerts] = useState([]);
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [toast, setToast] = useState(null);

  // Form states
  const [progForm, setProgForm] = useState({ title: '', category: '', date: '', location: 'Jakma, Okhaldhunga', shortDesc: '', fullDesc: '', status: 'upcoming', organizer: 'Fulbari Yuba Club Jakma', participants: '' });
  const [blogForm, setBlogForm] = useState({ title: '', category: 'news', summary: '', content: '', author: 'FYC Admin', tags: '', status: 'published' });
  const [certForm, setCertForm] = useState({ title: '', issuer: '', yearBS: '', icon: '🏆', description: '', category: 'certificate' });
  const [memberForm, setMemberForm] = useState({ name: '', email: '', position: '', jerseyNumber: '', memberSince: '', phone: '' });
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryCaption, setGalleryCaption] = useState('');
  const [galleryCategory, setGalleryCategory] = useState('other');
  const [submitting, setSubmitting] = useState(false);

  if (!user || user.role !== 'admin') return <Navigate to="/login?tab=admin" />;

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadData = async () => {
    try {
      const [p, b, c, m, msg] = await Promise.all([
        API.get('/programs?limit=100'),
        API.get('/blogs/all'),
        API.get('/certificates'),
        API.get('/members'),
        API.get('/contact'),
      ]);
      setPrograms(p.data.data || []);
      setBlogs(b.data.data || []);
      setCerts(c.data.data || []);
      setMembers(m.data.data || []);
      setMessages(msg.data.data || []);
    } catch {}
  };

  useEffect(() => { loadData(); }, []);

  const submitProgram = async () => {
    if (!progForm.title || !progForm.category || !progForm.date) return showToast('Title, category and date required!', 'error');
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(progForm).forEach(([k, v]) => fd.append(k, v));
      await API.post('/programs', fd);
      showToast('Program published! 🎉');
      setProgForm({ title: '', category: '', date: '', location: 'Jakma, Okhaldhunga', shortDesc: '', fullDesc: '', status: 'upcoming', organizer: 'Fulbari Yuba Club Jakma', participants: '' });
      loadData();
    } catch (e) { showToast(e.response?.data?.message || 'Error!', 'error'); }
    setSubmitting(false);
  };

  const submitBlog = async () => {
    if (!blogForm.title || !blogForm.content) return showToast('Title and content required!', 'error');
    setSubmitting(true);
    try {
      await API.post('/blogs', blogForm);
      showToast('Blog published! 📤');
      setBlogForm({ title: '', category: 'news', summary: '', content: '', author: 'FYC Admin', tags: '', status: 'published' });
      loadData();
    } catch (e) { showToast(e.response?.data?.message || 'Error!', 'error'); }
    setSubmitting(false);
  };

  const submitCert = async () => {
    if (!certForm.title) return showToast('Title required!', 'error');
    setSubmitting(true);
    try {
      await API.post('/certificates', certForm);
      showToast('Certificate added! 🏆');
      setCertForm({ title: '', issuer: '', yearBS: '', icon: '🏆', description: '', category: 'certificate' });
      loadData();
    } catch (e) { showToast('Error!', 'error'); }
    setSubmitting(false);
  };

  const submitMember = async () => {
    if (!memberForm.name || !memberForm.email) return showToast('Name and email required!', 'error');
    setSubmitting(true);
    try {
      await API.post('/auth/users', { ...memberForm, role: 'member' });
      showToast('Member added! 👤');
      setMemberForm({ name: '', email: '', position: '', jerseyNumber: '', memberSince: '', phone: '' });
      loadData();
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

  const deleteItem = async (type, id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await API[type === 'program' ? 'delete' : type === 'blog' ? 'delete' : type === 'cert' ? 'delete' : 'delete'](
        `/${type === 'program' ? 'programs' : type === 'blog' ? 'blogs' : type === 'cert' ? 'certificates' : 'contact'}/${id}`
      );
      showToast('Deleted.', 'error');
      loadData();
    } catch { showToast('Error!', 'error'); }
  };

  const InputField = ({ label, value, onChange, type = 'text', placeholder, required }) => (
    <div className="form-group">
      <label className="form-label">{label}{required && ' *'}</label>
      <input className="form-input" type={type} value={value} onChange={onChange} placeholder={placeholder} required={required} />
    </div>
  );

  const SelectField = ({ label, value, onChange, options }) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <select className="form-input" value={value} onChange={onChange}>
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </div>
  );

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
      <style>{`@media(max-width:640px){div[style*="1fr 1fr"]{grid-template-columns:1fr!important;}}`}</style>
    </div>
  );

  // ---- PANELS ----
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
              <style>{`@media(max-width:900px){div[style*="repeat(4"]{grid-template-columns:repeat(2,1fr)!important;}}`}</style>
            </div>

            <Card title="📋 Recent Programs">
              <Table
                cols={['Title', 'Category', 'Date', 'Status', 'Actions']}
                rows={programs.slice(0, 5).map(p => [
                  <span style={{ fontWeight: 600 }}>{p.title}</span>,
                  p.category,
                  new Date(p.date).toLocaleDateString('en-GB'),
                  <StatusBadge s={p.status} />,
                  <button onClick={() => deleteItem('program', p._id)} style={{ background: '#FEF2F2', color: '#C8102E', border: 'none', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, fontFamily: 'var(--font)' }}>Delete</button>
                ])}
              />
            </Card>

            <Card title="📰 Recent Blog Posts">
              <Table
                cols={['Title', 'Category', 'Author', 'Date', 'Actions']}
                rows={blogs.slice(0, 5).map(b => [
                  <span style={{ fontWeight: 600 }}>{b.title}</span>,
                  b.category,
                  b.author,
                  new Date(b.createdAt).toLocaleDateString('en-GB'),
                  <button onClick={() => deleteItem('blog', b._id)} style={{ background: '#FEF2F2', color: '#C8102E', border: 'none', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, fontFamily: 'var(--font)' }}>Delete</button>
                ])}
              />
            </Card>

            {messages.length > 0 && (
              <Card title={`💬 Messages (${messages.filter(m => !m.read).length} unread)`}>
                <Table
                  cols={['Name', 'Subject', 'Date', 'Status']}
                  rows={messages.slice(0, 5).map(m => [
                    m.name,
                    m.subject || '(no subject)',
                    new Date(m.createdAt).toLocaleDateString('en-GB'),
                    <span style={{ background: m.read ? '#F3F4F6' : '#FEF3C7', color: m.read ? '#6B7280' : '#92400E', padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 600 }}>{m.read ? 'Read' : 'New'}</span>
                  ])}
                />
              </Card>
            )}
          </>
        );

      case 'post-program':
        return (
          <Card title="➕ Post New Program">
            <Grid2>
              <InputField label="Program Title" value={progForm.title} onChange={e => setProgForm({ ...progForm, title: e.target.value })} placeholder="e.g. Annual Football Tournament 2081" required />
              <SelectField label="Category" value={progForm.category} onChange={e => setProgForm({ ...progForm, category: e.target.value })} options={[['', 'Select Category'], ['tournament', 'Football Tournament'], ['community', 'Community Program'], ['cultural', 'Cultural Event'], ['training', 'Training Camp'], ['other', 'Other']]} />
              <InputField label="Event Date" type="date" value={progForm.date} onChange={e => setProgForm({ ...progForm, date: e.target.value })} required />
              <InputField label="Location" value={progForm.location} onChange={e => setProgForm({ ...progForm, location: e.target.value })} placeholder="e.g. Jakma Ground, Okhaldhunga" />
              <InputField label="Participants (approx.)" type="number" value={progForm.participants} onChange={e => setProgForm({ ...progForm, participants: e.target.value })} placeholder="e.g. 100" />
              <SelectField label="Status" value={progForm.status} onChange={e => setProgForm({ ...progForm, status: e.target.value })} options={[['upcoming', 'Upcoming'], ['active', 'Active/Ongoing'], ['past', 'Completed'], ['draft', 'Draft']]} />
            </Grid2>
            <div className="form-group">
              <label className="form-label">Short Description *</label>
              <textarea className="form-input" rows="3" value={progForm.shortDesc} onChange={e => setProgForm({ ...progForm, shortDesc: e.target.value })} placeholder="Brief description (shown in cards)..." required />
            </div>
            <div className="form-group">
              <label className="form-label">Full Details</label>
              <textarea className="form-input" rows="5" value={progForm.fullDesc} onChange={e => setProgForm({ ...progForm, fullDesc: e.target.value })} placeholder="Full details, schedule, rules, prizes..." />
            </div>
            <div className="form-group">
              <label className="form-label">Photos (upload via Cloudinary)</label>
              <input type="file" className="form-input" multiple accept="image/*" style={{ padding: '8px' }} />
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button className="btn btn-ghost" onClick={() => setProgForm({ title: '', category: '', date: '', location: 'Jakma, Okhaldhunga', shortDesc: '', fullDesc: '', status: 'upcoming', organizer: 'Fulbari Yuba Club Jakma', participants: '' })}>Reset</button>
              <button className="btn btn-primary" onClick={submitProgram} disabled={submitting}>{submitting ? 'Publishing...' : '🚀 Publish Program'}</button>
            </div>
          </Card>
        );

      case 'programs':
        return (
          <Card title="📋 All Programs" action={<button className="btn btn-primary btn-sm" onClick={() => setPanel('post-program')}>+ New</button>}>
            <Table
              cols={['Title', 'Category', 'Date', 'Location', 'Status', 'Actions']}
              rows={programs.map(p => [
                <span style={{ fontWeight: 600 }}>{p.title}</span>,
                p.category,
                new Date(p.date).toLocaleDateString('en-GB'),
                p.location,
                <StatusBadge s={p.status} />,
                <button onClick={() => deleteItem('program', p._id)} style={{ background: '#FEF2F2', color: '#C8102E', border: 'none', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, fontFamily: 'var(--font)' }}>Delete</button>
              ])}
            />
          </Card>
        );

      case 'post-blog':
        return (
          <Card title="✏️ Write New Blog Post">
            <Grid2>
              <InputField label="Blog Title" value={blogForm.title} onChange={e => setBlogForm({ ...blogForm, title: e.target.value })} placeholder="Enter post title..." required />
              <SelectField label="Category" value={blogForm.category} onChange={e => setBlogForm({ ...blogForm, category: e.target.value })} options={[['news', 'Club News'], ['match', 'Match Report'], ['announcement', 'Announcement'], ['community', 'Community'], ['achievement', 'Achievement']]} />
              <InputField label="Author" value={blogForm.author} onChange={e => setBlogForm({ ...blogForm, author: e.target.value })} placeholder="Author name" />
              <SelectField label="Status" value={blogForm.status} onChange={e => setBlogForm({ ...blogForm, status: e.target.value })} options={[['published', 'Published'], ['draft', 'Draft']]} />
            </Grid2>
            <div className="form-group">
              <label className="form-label">Summary (shown in cards)</label>
              <textarea className="form-input" rows="2" value={blogForm.summary} onChange={e => setBlogForm({ ...blogForm, summary: e.target.value })} placeholder="Brief summary..." />
            </div>
            <div className="form-group">
              <label className="form-label">Full Content *</label>
              <textarea className="form-input" rows="10" value={blogForm.content} onChange={e => setBlogForm({ ...blogForm, content: e.target.value })} placeholder="Write the full blog post here..." required />
            </div>
            <div className="form-group">
              <label className="form-label">Tags (comma-separated)</label>
              <input className="form-input" value={blogForm.tags} onChange={e => setBlogForm({ ...blogForm, tags: e.target.value })} placeholder="e.g. football, tournament, community" />
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost" onClick={() => setBlogForm({ title: '', category: 'news', summary: '', content: '', author: 'FYC Admin', tags: '', status: 'published' })}>Reset</button>
              <button className="btn btn-primary" onClick={submitBlog} disabled={submitting}>{submitting ? 'Publishing...' : '📤 Publish Post'}</button>
            </div>
          </Card>
        );

      case 'blogs':
        return (
          <Card title="📰 All Blog Posts" action={<button className="btn btn-primary btn-sm" onClick={() => setPanel('post-blog')}>+ New</button>}>
            <Table
              cols={['Title', 'Category', 'Author', 'Date', 'Status', 'Actions']}
              rows={blogs.map(b => [
                <span style={{ fontWeight: 600 }}>{b.title}</span>,
                b.category, b.author,
                new Date(b.createdAt).toLocaleDateString('en-GB'),
                <StatusBadge s={b.status} />,
                <button onClick={() => deleteItem('blog', b._id)} style={{ background: '#FEF2F2', color: '#C8102E', border: 'none', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, fontFamily: 'var(--font)' }}>Delete</button>
              ])}
            />
          </Card>
        );

      case 'certificates':
        return (
          <>
            <Card title="🏆 Add New Award / Certificate">
              <Grid2>
                <InputField label="Title" value={certForm.title} onChange={e => setCertForm({ ...certForm, title: e.target.value })} placeholder="e.g. District Football Championship Winner" required />
                <InputField label="Issued By" value={certForm.issuer} onChange={e => setCertForm({ ...certForm, issuer: e.target.value })} placeholder="e.g. ANFA Okhaldhunga" />
                <InputField label="Year (BS)" value={certForm.yearBS} onChange={e => setCertForm({ ...certForm, yearBS: e.target.value })} placeholder="e.g. 2079 BS" />
                <InputField label="Icon (Emoji)" value={certForm.icon} onChange={e => setCertForm({ ...certForm, icon: e.target.value })} placeholder="🏆" />
              </Grid2>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" rows="2" value={certForm.description} onChange={e => setCertForm({ ...certForm, description: e.target.value })} placeholder="Brief description..." />
              </div>
              <div style={{ textAlign: 'right' }}>
                <button className="btn btn-primary" onClick={submitCert} disabled={submitting}>{submitting ? 'Adding...' : '+ Add Certificate'}</button>
              </div>
            </Card>
            <Card title="All Certificates">
              <Table
                cols={['Icon', 'Title', 'Issued By', 'Year', 'Actions']}
                rows={certs.map(c => [
                  c.icon,
                  <span style={{ fontWeight: 600 }}>{c.title}</span>,
                  c.issuer, c.yearBS,
                  <button onClick={() => deleteItem('cert', c._id)} style={{ background: '#FEF2F2', color: '#C8102E', border: 'none', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, fontFamily: 'var(--font)' }}>Delete</button>
                ])}
              />
            </Card>
          </>
        );

      case 'gallery':
        return (
          <Card title="📸 Upload Gallery Photos">
            <div style={{ border: '2px dashed var(--gray-300)', borderRadius: '12px', padding: '3rem', textAlign: 'center', marginBottom: '1.5rem', cursor: 'pointer', background: 'var(--gray-50)' }}
              onClick={() => document.getElementById('gallery-input').click()}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📸</div>
              <p style={{ fontWeight: 600, color: 'var(--gray-700)', marginBottom: '0.5rem' }}>Click to select photos</p>
              <p style={{ fontSize: '0.82rem', color: 'var(--gray-400)' }}>JPG, PNG, WebP · Multiple files · Max 5MB each</p>
              {galleryFiles.length > 0 && <p style={{ marginTop: '0.75rem', color: '#059669', fontWeight: 600 }}>✓ {galleryFiles.length} file(s) selected</p>}
            </div>
            <input id="gallery-input" type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={e => setGalleryFiles(Array.from(e.target.files))} />
            <Grid2>
              <div className="form-group">
                <label className="form-label">Caption</label>
                <input className="form-input" value={galleryCaption} onChange={e => setGalleryCaption(e.target.value)} placeholder="Photo caption..." />
              </div>
              <SelectField label="Category" value={galleryCategory} onChange={e => setGalleryCategory(e.target.value)} options={[['match', 'Match'], ['event', 'Event'], ['training', 'Training'], ['community', 'Community'], ['cultural', 'Cultural'], ['other', 'Other']]} />
            </Grid2>
            <div style={{ textAlign: 'right' }}>
              <button className="btn btn-primary" onClick={uploadGallery} disabled={submitting}>{submitting ? 'Uploading...' : '⬆️ Upload Photos'}</button>
            </div>
          </Card>
        );

      case 'members':
        return (
          <>
            <Card title="👤 Add New Member">
              <Grid2>
                <InputField label="Full Name" value={memberForm.name} onChange={e => setMemberForm({ ...memberForm, name: e.target.value })} placeholder="Member's full name" required />
                <InputField label="Email" type="email" value={memberForm.email} onChange={e => setMemberForm({ ...memberForm, email: e.target.value })} placeholder="member@email.com" required />
                <InputField label="Phone" value={memberForm.phone} onChange={e => setMemberForm({ ...memberForm, phone: e.target.value })} placeholder="+977..." />
                <InputField label="Position / Role" value={memberForm.position} onChange={e => setMemberForm({ ...memberForm, position: e.target.value })} placeholder="e.g. Player, Coach" />
                <InputField label="Jersey Number" type="number" value={memberForm.jerseyNumber} onChange={e => setMemberForm({ ...memberForm, jerseyNumber: e.target.value })} placeholder="#" />
                <InputField label="Member Since (BS)" value={memberForm.memberSince} onChange={e => setMemberForm({ ...memberForm, memberSince: e.target.value })} placeholder="e.g. 2075 BS" />
              </Grid2>
              <div style={{ textAlign: 'right' }}>
                <button className="btn btn-primary" onClick={submitMember} disabled={submitting}>{submitting ? 'Adding...' : '+ Add Member'}</button>
              </div>
            </Card>
            <Card title={`All Members (${members.length})`}>
              <Table
                cols={['Name', 'Position', 'Jersey', 'Member Since']}
                rows={members.map(m => [
                  <span style={{ fontWeight: 600 }}>{m.name}</span>,
                  m.position || '—', m.jerseyNumber ? `#${m.jerseyNumber}` : '—', m.memberSince || '—'
                ])}
              />
            </Card>
          </>
        );

      case 'messages':
        return (
          <Card title={`💬 Contact Messages (${messages.length})`}>
            <Table
              cols={['Name', 'Email', 'Subject', 'Message', 'Date', 'Status']}
              rows={messages.map(m => [
                <span style={{ fontWeight: 600 }}>{m.name}</span>,
                m.email || '—',
                m.subject || '—',
                <span style={{ maxWidth: '200px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.message}</span>,
                new Date(m.createdAt).toLocaleDateString('en-GB'),
                <span style={{ background: m.read ? '#F3F4F6' : '#FEF3C7', color: m.read ? '#6B7280' : '#92400E', padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 600 }}>{m.read ? 'Read' : 'New'}</span>
              ])}
            />
          </Card>
        );

      default: return null;
    }
  };

  return (
    <div style={{ paddingTop: 'var(--navbar-h)', display: 'flex', minHeight: '100vh', background: 'var(--gray-50)' }}>
      {/* Sidebar */}
      <aside style={{
        width: '240px', background: 'white', borderRight: '1px solid var(--gray-200)',
        position: 'sticky', top: 'var(--navbar-h)', height: 'calc(100vh - var(--navbar-h))',
        overflowY: 'auto', flexShrink: 0
      }} className="admin-sidebar">
        <div style={{ padding: '1.5rem 1rem 1rem', borderBottom: '1px solid var(--gray-100)' }}>
          <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--gray-900)' }}>Admin Panel</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>FYC Jakma</div>
        </div>
        {PANELS.map(p => (
          <button key={p.key} onClick={() => setPanel(p.key)} style={{
            display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
            padding: '11px 1rem', border: 'none', cursor: 'pointer',
            background: panel === p.key ? '#FEF2F2' : 'transparent',
            color: panel === p.key ? '#C8102E' : 'var(--gray-600)',
            fontFamily: 'var(--font)', fontWeight: panel === p.key ? 700 : 500,
            fontSize: '0.875rem', textAlign: 'left', transition: 'all 0.2s',
            borderLeft: `3px solid ${panel === p.key ? '#C8102E' : 'transparent'}`
          }}>
            <span>{p.icon}</span> {p.label}
          </button>
        ))}
        <button onClick={() => { logout(); navigate('/'); }} style={{
          display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
          padding: '11px 1rem', border: 'none', cursor: 'pointer',
          background: 'transparent', color: 'var(--gray-400)',
          fontFamily: 'var(--font)', fontWeight: 500, fontSize: '0.875rem',
          marginTop: '1rem', borderTop: '1px solid var(--gray-100)', textAlign: 'left'
        }}>
          🚪 Logout
        </button>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: '2rem', overflowX: 'auto' }}>
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
          position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 3000,
          background: toast.type === 'success' ? '#059669' : '#DC2626',
          color: 'white', padding: '1rem 1.5rem', borderRadius: '10px',
          fontWeight: 600, fontSize: '0.9rem', boxShadow: 'var(--shadow-xl)',
          animation: 'slideUp 0.3s ease'
        }}>
          {toast.type === 'success' ? '✓ ' : '✗ '}{toast.msg}
        </div>
      )}

      <style>{`
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @media(max-width:768px) {
          .admin-sidebar { display: none !important; }
          main { padding: 1rem !important; }
        }
      `}</style>
    </div>
  );
};

export default AdminPage;
