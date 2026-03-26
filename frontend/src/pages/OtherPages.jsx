import React, { useState } from 'react';
import API from '../utils/api.js';

// --- Executive Committee ---
const EXECUTIVES = [
  { _id: 'e1', name: 'Amrit Bahadur Rai', position: 'President', image: '/president.jpeg' },
  { _id: 'e2', name: 'Club Vice President', position: 'Vice President', image: null },
  { _id: 'e3', name: 'General Secretary', position: 'General Secretary', image: null },
  { _id: 'e4', name: 'Treasurer', position: 'Treasurer', image: null },
];

// --- Team A (17 players) ---
const TEAM_A = [
  { _id: 'a1',  name: 'Player One',      position: 'Captain',    jerseyNumber: 10, image: null },
  { _id: 'a2',  name: 'Player Two',      position: 'Vice Captain', jerseyNumber: 7, image: null },
  { _id: 'a3',  name: 'Player Three',    position: 'Goalkeeper', jerseyNumber: 1,  image: null },
  { _id: 'a4',  name: 'Player Four',     position: 'Defender',   jerseyNumber: 2,  image: null },
  { _id: 'a5',  name: 'Player Five',     position: 'Defender',   jerseyNumber: 3,  image: null },
  { _id: 'a6',  name: 'Player Six',      position: 'Defender',   jerseyNumber: 4,  image: null },
  { _id: 'a7',  name: 'Player Seven',    position: 'Defender',   jerseyNumber: 5,  image: null },
  { _id: 'a8',  name: 'Player Eight',    position: 'Midfielder', jerseyNumber: 6,  image: null },
  { _id: 'a9',  name: 'Player Nine',     position: 'Midfielder', jerseyNumber: 8,  image: null },
  { _id: 'a10', name: 'Player Ten',      position: 'Midfielder', jerseyNumber: 9,  image: null },
  { _id: 'a11', name: 'Player Eleven',   position: 'Forward',    jerseyNumber: 11, image: null },
  { _id: 'a12', name: 'Player Twelve',   position: 'Forward',    jerseyNumber: 12, image: null },
  { _id: 'a13', name: 'Player Thirteen', position: 'Midfielder', jerseyNumber: 13, image: null },
  { _id: 'a14', name: 'Player Fourteen', position: 'Defender',   jerseyNumber: 14, image: null },
  { _id: 'a15', name: 'Player Fifteen',  position: 'Goalkeeper', jerseyNumber: 15, image: null },
  { _id: 'a16', name: 'Player Sixteen',  position: 'Forward',    jerseyNumber: 16, image: null },
  { _id: 'a17', name: 'Player Seventeen',position: 'Midfielder', jerseyNumber: 17, image: null },
];

// --- Team B (17 players) ---
const TEAM_B = [
  { _id: 'b1',  name: 'Player One',      position: 'Captain',    jerseyNumber: 10, image: null },
  { _id: 'b2',  name: 'Player Two',      position: 'Vice Captain', jerseyNumber: 7, image: null },
  { _id: 'b3',  name: 'Player Three',    position: 'Goalkeeper', jerseyNumber: 1,  image: null },
  { _id: 'b4',  name: 'Player Four',     position: 'Defender',   jerseyNumber: 2,  image: null },
  { _id: 'b5',  name: 'Player Five',     position: 'Defender',   jerseyNumber: 3,  image: null },
  { _id: 'b6',  name: 'Player Six',      position: 'Defender',   jerseyNumber: 4,  image: null },
  { _id: 'b7',  name: 'Player Seven',    position: 'Defender',   jerseyNumber: 5,  image: null },
  { _id: 'b8',  name: 'Player Eight',    position: 'Midfielder', jerseyNumber: 6,  image: null },
  { _id: 'b9',  name: 'Player Nine',     position: 'Midfielder', jerseyNumber: 8,  image: null },
  { _id: 'b10', name: 'Player Ten',      position: 'Midfielder', jerseyNumber: 9,  image: null },
  { _id: 'b11', name: 'Player Eleven',   position: 'Forward',    jerseyNumber: 11, image: null },
  { _id: 'b12', name: 'Player Twelve',   position: 'Forward',    jerseyNumber: 12, image: null },
  { _id: 'b13', name: 'Player Thirteen', position: 'Midfielder', jerseyNumber: 13, image: null },
  { _id: 'b14', name: 'Player Fourteen', position: 'Defender',   jerseyNumber: 14, image: null },
  { _id: 'b15', name: 'Player Fifteen',  position: 'Goalkeeper', jerseyNumber: 15, image: null },
  { _id: 'b16', name: 'Player Sixteen',  position: 'Forward',    jerseyNumber: 16, image: null },
  { _id: 'b17', name: 'Player Seventeen',position: 'Midfielder', jerseyNumber: 17, image: null },
];

// --- Reusable Member Card ---
const MemberCard = ({ member, showJersey = false }) => (
  <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
    {member.image ? (
      <img
        src={member.image}
        alt={member.name}
        style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 1rem', border: '3px solid #FCE7E9' }}
      />
    ) : (
      <div style={{
        width: '80px', height: '80px', borderRadius: '50%',
        background: 'linear-gradient(135deg,#C8102E,#9B0B22)',
        margin: '0 auto 1rem', display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: '1.8rem', color: 'white',
        border: '3px solid #FCE7E9', fontWeight: 700,
      }}>
        {member.name[0]?.toUpperCase()}
      </div>
    )}
    <div style={{ fontWeight: 700, color: 'var(--gray-900)', marginBottom: '4px' }}>{member.name}</div>
    <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#C8102E' }}>
      {member.position}{showJersey && member.jerseyNumber ? ` · #${member.jerseyNumber}` : ''}
    </div>
  </div>
);

// --- Section Header ---
const SectionHeader = ({ title }) => (
  <h2 style={{
    fontSize: '1.4rem', fontWeight: 800, color: 'var(--gray-900)',
    marginBottom: '1.5rem', paddingBottom: '0.75rem',
    borderBottom: '3px solid #C8102E', display: 'inline-block',
  }}>
    {title}
  </h2>
);

export const TeamPage = () => (
  <div style={{ paddingTop: 'var(--navbar-h)' }}>
    {/* Hero */}
    <section style={{ background: 'linear-gradient(135deg,#7B0A1A,#C8102E)', padding: '56px 0' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <span className="section-tag" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>Our People</span>
        <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, color: 'white', margin: '0.75rem 0' }}>Meet the Team</h1>
        <p style={{ color: 'rgba(255,255,255,0.75)' }}>The people behind Fulbari Yuba Club Jakma</p>
      </div>
    </section>

    <section className="section" style={{ background: 'var(--gray-50)' }}>
      <div className="container">

        {/* Executive Committee */}
        <div style={{ marginBottom: '3.5rem' }}>
          <SectionHeader title="⚙️ Executive Committee" />
          <div className="grid-4">
            {EXECUTIVES.map(m => <MemberCard key={m._id} member={m} />)}
          </div>
        </div>

        {/* Team A */}
        <div style={{ marginBottom: '3.5rem' }}>
          <SectionHeader title="🔴 Team A" />
          <div className="grid-4">
            {TEAM_A.map(m => <MemberCard key={m._id} member={m} showJersey />)}
          </div>
        </div>

        {/* Team B */}
        <div>
          <SectionHeader title="⚪ Team B" />
          <div className="grid-4">
            {TEAM_B.map(m => <MemberCard key={m._id} member={m} showJersey />)}
          </div>
        </div>

      </div>
    </section>
  </div>
);

export const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim())
      e.name = 'Full name is required.';
    else if (form.name.trim().length < 2)
      e.name = 'Name must be at least 2 characters.';

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Please enter a valid email address.';

    if (form.phone && !/^[+\d\s\-().]{7,15}$/.test(form.phone))
      e.phone = 'Please enter a valid phone number (7-15 digits).';

    if (!form.message.trim())
      e.message = 'Message is required.';
    else if (form.message.trim().length < 10)
      e.message = 'Message must be at least 10 characters.';

    return e;
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await API.post('/contact', form);
      setStatus({ type: 'success', msg: 'Message sent successfully! We will get back to you soon.' });
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      const serverMsg = err.response?.data?.message;
      setStatus({ type: 'error', msg: serverMsg || 'Failed to send message. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const contactItems = [
    { icon: '📍', title: 'Address',       val: 'Jakma, Manyavangyag Gaun Palika-6 \nOkhaldhunga, Nepal - 56100' },
    { icon: '📘', title: 'Facebook', val: <a href="https://www.facebook.com/profile.php?id=100084950064757" target="_blank">Fulbari Yuba Club Jakma</a> },   // ← change this value
    { icon: '🌐', title: 'Region',        val: 'Okhaldhunga · Manebhanjyang, Nepal' },
    { icon: '🕐', title: 'Founded',       val: '2057 BS (2000 AD)' },
  ];

  return (
    <div style={{ paddingTop: 'var(--navbar-h)' }}>
      <section style={{ background: 'linear-gradient(135deg,#7B0A1A,#C8102E)', padding: '56px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="section-tag" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>Get In Touch</span>
          <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, color: 'white', margin: '0.75rem 0' }}>Contact Us</h1>
          <p style={{ color: 'rgba(255,255,255,0.75)' }}>We'd love to hear from you</p>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--gray-50)' }}>
        <div className="container">
          <div className="contact-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '3rem' }}>

            {/* Info */}
            <div>
              <h2 style={{ fontWeight: 800, fontSize: '1.4rem', color: 'var(--gray-900)', marginBottom: '1.5rem' }}>Contact Information</h2>
              {contactItems.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>{item.icon}</div>
                  <div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#C8102E', marginBottom: '3px' }}>{item.title}</div>
                    <div style={{ color: 'var(--gray-700)', fontSize: '0.9rem', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{item.val}</div>
                  </div>
                </div>
              ))}
              <div style={{ background: '#FEF2F2', border: '1px solid rgba(200,16,46,0.15)', borderRadius: '12px', padding: '1.5rem' }}>
                <div style={{ fontWeight: 700, color: '#C8102E', marginBottom: '0.5rem' }}>🏠 Club Hours</div>
                <div style={{ color: 'var(--gray-600)', fontSize: '0.88rem', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                  {'Sunday – Friday: 9:00 AM – 6:00 PM\nSaturday: 10:00 AM – 4:00 PM'}
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="card" style={{ padding: '2.5rem' }}>
              <h2 style={{ fontWeight: 800, fontSize: '1.4rem', color: 'var(--gray-900)', marginBottom: '1.5rem' }}>Send a Message</h2>
              {status && (
                <div style={{ background: status.type === 'success' ? '#D1FAE5' : '#FEE2E2', color: status.type === 'success' ? '#065F46' : '#991B1B', padding: '12px 16px', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
                  {status.type === 'success' ? '✅' : '⚠️'} {status.msg}
                </div>
              )}
              <form onSubmit={handleSubmit} noValidate>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      className="form-input"
                      value={form.name}
                      onChange={e => handleChange('name', e.target.value)}
                      placeholder="Your name"
                      style={errors.name ? { borderColor: '#C8102E' } : {}}
                    />
                    {errors.name && <span style={{ color: '#C8102E', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.name}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input
                      className="form-input"
                      value={form.phone}
                      onChange={e => handleChange('phone', e.target.value)}
                      placeholder="Your phone number"
                      style={errors.phone ? { borderColor: '#C8102E' } : {}}
                    />
                    {errors.phone && <span style={{ color: '#C8102E', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.phone}</span>}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    className="form-input"
                    type="email"
                    value={form.email}
                    onChange={e => handleChange('email', e.target.value)}
                    placeholder="your@email.com"
                    style={errors.email ? { borderColor: '#C8102E' } : {}}
                  />
                  {errors.email && <span style={{ color: '#C8102E', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.email}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input
                    className="form-input"
                    value={form.subject}
                    onChange={e => handleChange('subject', e.target.value)}
                    placeholder="What is this about?"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Message *</label>
                  <textarea
                    className="form-input"
                    rows="5"
                    value={form.message}
                    onChange={e => handleChange('message', e.target.value)}
                    placeholder="Write your message here..."
                    style={errors.message ? { borderColor: '#C8102E' } : {}}
                  />
                  {errors.message && <span style={{ color: '#C8102E', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.message}</span>}
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px' }} disabled={loading}>
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
        <style>{`@media(max-width:768px){.contact-layout{grid-template-columns:1fr!important}}`}</style>
      </section>
    </div>
  );
};