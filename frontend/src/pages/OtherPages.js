// GalleryPage.js
import React, { useEffect, useState } from 'react';
import API from '../utils/api';

const EMOJIS = ['⚽', '🏆', '👥', '🎭', '🏅', '🌄', '🤝', '🎯', '🏋️', '🎪', '🌸', '🏃'];
const CATS = ['all', 'match', 'event', 'training', 'community', 'cultural'];

export const GalleryPage = () => {
  const [photos, setPhotos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    API.get('/gallery').then(r => setPhotos(r.data.data || [])).catch(() => setPhotos([])).finally(() => setLoading(false));
  }, []);

  const list = photos.filter(p => filter === 'all' || p.category === filter);

  return (
    <div style={{ paddingTop: 'var(--navbar-h)' }}>
      <section style={{ background: 'linear-gradient(135deg,#7B0A1A,#C8102E)', padding: '56px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="section-tag" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>Memories</span>
          <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, color: 'white', margin: '0.75rem 0' }}>Photo Gallery</h1>
          <p style={{ color: 'rgba(255,255,255,0.75)' }}>Moments captured from our programs, matches, and community events</p>
        </div>
      </section>
      <section className="section" style={{ background: 'var(--gray-50)' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '2rem' }}>
            {CATS.map(c => (
              <button key={c} onClick={() => setFilter(c)} style={{
                padding: '7px 16px', borderRadius: '30px', border: filter === c ? 'none' : '1.5px solid var(--gray-200)',
                cursor: 'pointer', fontFamily: 'var(--font)', fontWeight: 600, fontSize: '0.82rem',
                background: filter === c ? '#C8102E' : 'white', color: filter === c ? 'white' : 'var(--gray-600)', transition: 'all 0.2s'
              }}>{c === 'all' ? 'All Photos' : c.charAt(0).toUpperCase() + c.slice(1)}</button>
            ))}
          </div>
          {loading ? <div className="loading-center"><div className="spinner"></div></div> : list.length === 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '1rem' }}>
              {EMOJIS.map((e, i) => (
                <div key={i} style={{ aspectRatio: '1', background: 'white', border: '1px solid var(--gray-200)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', cursor: 'pointer', transition: 'transform 0.2s' }}
                  onMouseEnter={e2 => e2.currentTarget.style.transform = 'scale(1.03)'}
                  onMouseLeave={e2 => e2.currentTarget.style.transform = 'scale(1)'}>
                  {e}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '1rem' }}>
              {list.map((photo, i) => (
                <div key={photo._id} onClick={() => setSelected(photo)} style={{ aspectRatio: '1', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s', border: '1px solid var(--gray-200)' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                  <img src={photo.url} alt={photo.caption || 'FYC Photo'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {selected && (
        <div onClick={() => setSelected(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ maxWidth: '800px', width: '100%', borderRadius: '12px', overflow: 'hidden', background: 'white' }} onClick={e => e.stopPropagation()}>
            <img src={selected.url} alt={selected.caption} style={{ width: '100%', display: 'block' }} />
            {selected.caption && <div style={{ padding: '1rem', textAlign: 'center', fontWeight: 600 }}>{selected.caption}</div>}
          </div>
        </div>
      )}
    </div>
  );
};

// TeamPage.js
const STATIC_MEMBERS = [
  { _id: '1', name: 'Amrit Bahadur Rai', position: 'President', memberSince: '2075 BS' },
  { _id: '2', name: 'Club Vice President', position: 'Vice President', memberSince: 'Executive Committee' },
  { _id: '3', name: 'General Secretary', position: 'General Secretary', memberSince: 'Executive Committee' },
  { _id: '4', name: 'Treasurer', position: 'Finance & Treasurer', memberSince: 'Executive Committee' },
  { _id: '5', name: 'Team Captain', position: 'Captain', jerseyNumber: 10, memberSince: '2072 BS' },
  { _id: '6', name: 'Vice Captain', position: 'Vice Captain', jerseyNumber: 7, memberSince: '2073 BS' },
  { _id: '7', name: 'Goalkeeper', position: 'Goalkeeper', jerseyNumber: 1, memberSince: '2074 BS' },
  { _id: '8', name: 'Midfielder', position: 'Midfielder', jerseyNumber: 8, memberSince: '2075 BS' },
];

export const TeamPage = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    API.get('/members').then(r => setMembers(r.data.data || [])).catch(() => setMembers(STATIC_MEMBERS)).finally(() => setLoading(false));
  }, []);
  const list = members.length > 0 ? members : STATIC_MEMBERS;

  return (
    <div style={{ paddingTop: 'var(--navbar-h)' }}>
      <section style={{ background: 'linear-gradient(135deg,#7B0A1A,#C8102E)', padding: '56px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="section-tag" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>Our People</span>
          <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, color: 'white', margin: '0.75rem 0' }}>Club Members</h1>
          <p style={{ color: 'rgba(255,255,255,0.75)' }}>The players, coaches, and officials that make FYC Jakma great</p>
        </div>
      </section>
      <section className="section" style={{ background: 'var(--gray-50)' }}>
        <div className="container">
          {loading ? <div className="loading-center"><div className="spinner"></div></div> : (
            <div className="grid-4">
              {list.map(m => (
                <div key={m._id} className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                  {m.avatar ? (
                    <img src={m.avatar} alt={m.name} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 1rem', border: '3px solid var(--primary-light)' }} />
                  ) : (
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg,#C8102E,#9B0B22)', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', color: 'white', border: '3px solid var(--primary-light)' }}>
                      {m.name[0]?.toUpperCase()}
                    </div>
                  )}
                  <div style={{ fontWeight: 700, color: 'var(--gray-900)', marginBottom: '4px' }}>{m.name}</div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>
                    {m.position}{m.jerseyNumber ? ` · #${m.jerseyNumber}` : ''}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>Since {m.memberSince}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

// ContactPage.js
export const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/contact', form);
      setStatus({ type: 'success', msg: 'Message sent! We will get back to you soon.' });
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      setStatus({ type: 'error', msg: 'Failed to send. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: 'var(--navbar-h)' }}>
      <section style={{ background: 'linear-gradient(135deg,#7B0A1A,#C8102E)', padding: '56px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="section-tag" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>Get In Touch</span>
          <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, color: 'white', margin: '0.75rem 0' }}>Contact Us</h1>
          <p style={{ color: 'rgba(255,255,255,0.75)' }}>Reach out to Fulbari Yuba Club Jakma</p>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--gray-50)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '3rem' }}>
            {/* Info */}
            <div>
              <h2 style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--gray-900)', marginBottom: '1.5rem' }}>Club Information</h2>
              {[
                { icon: '📍', title: 'Address', val: 'Jakma, Manyavangyag Gaun Palika-6\nOkhaldhunga, Nepal - 56100' },
                { icon: '📘', title: 'Facebook', val: 'fulbariyubaclub\n434 Followers · 91 Posts' },
                { icon: '🌐', title: 'Region', val: 'Okhaldhunga · Manebhanjyang, Nepal' },
                { icon: '🕐', title: 'Founded', val: '2057 BS (Bikram Sambat)' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>{item.icon}</div>
                  <div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--primary)', marginBottom: '3px' }}>{item.title}</div>
                    <div style={{ color: 'var(--gray-700)', fontSize: '0.9rem', lineHeight: 1.5, whiteSpace: 'pre-line' }}>{item.val}</div>
                  </div>
                </div>
              ))}
              <div style={{ background: 'var(--primary-light)', border: '1px solid rgba(200,16,46,0.15)', borderRadius: '12px', padding: '1.5rem', marginTop: '1rem' }}>
                <div style={{ fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>🏠 FYC Club Hours</div>
                <div style={{ color: 'var(--gray-600)', fontSize: '0.88rem', lineHeight: 1.7 }}>
                  Open Daily — Active Community Club<br />
                  Practice: Morning & Evening<br />
                  Office: 10:00 AM – 5:00 PM
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="card" style={{ padding: '2.5rem' }}>
              <h2 style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--gray-900)', marginBottom: '1.5rem' }}>Send a Message</h2>
              {status && (
                <div style={{ background: status.type === 'success' ? '#D1FAE5' : '#FEE2E2', color: status.type === 'success' ? '#065F46' : '#991B1B', padding: '12px 16px', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
                  {status.msg}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input className="form-input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+977..." />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" />
                </div>
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input className="form-input" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="Subject of your message" />
                </div>
                <div className="form-group">
                  <label className="form-label">Message *</label>
                  <textarea className="form-input" rows="5" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Write your message here..." required />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px' }} disabled={loading}>
                  {loading ? 'Sending...' : 'Send Message →'}
                </button>
              </form>
            </div>
          </div>
        </div>
        <style>{`@media(max-width:768px){section div[style*="1fr 1.5fr"]{grid-template-columns:1fr!important;}}`}</style>
      </section>
    </div>
  );
};

export default GalleryPage;
