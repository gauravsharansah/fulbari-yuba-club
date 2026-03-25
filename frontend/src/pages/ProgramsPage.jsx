import React, { useEffect, useState } from 'react';
import API from '../utils/api';

const CATS = [
  { key: 'all', label: 'All Programs', icon: '📋' },
  { key: 'tournament', label: 'Tournaments', icon: '⚽' },
  { key: 'community', label: 'Community', icon: '🤝' },
  { key: 'cultural', label: 'Cultural', icon: '🎭' },
  { key: 'training', label: 'Training', icon: '🏃' },
];
const CAT_STYLE = {
  tournament: { bg: '#FEF2F2', color: '#991B1B' },
  community: { bg: '#F0FDF4', color: '#166534' },
  cultural: { bg: '#FFF7ED', color: '#9A3412' },
  training: { bg: '#EFF6FF', color: '#1E40AF' },
  other: { bg: '#F9FAFB', color: '#374151' },
};
const STATUS_STYLE = {
  upcoming: { bg: '#FEF3C7', color: '#92400E', label: 'Upcoming' },
  active: { bg: '#D1FAE5', color: '#065F46', label: 'Ongoing' },
  past: { bg: '#F3F4F6', color: '#6B7280', label: 'Completed' },
  draft: { bg: '#DBEAFE', color: '#1E40AF', label: 'Draft' },
};
const EMOJI = { tournament: '⚽', community: '🤝', cultural: '🎭', training: '🏃', other: '📌' };

const STATIC = [
  { _id: '1', title: 'Annual Football Tournament 2081', category: 'tournament', date: '2024-04-15', location: 'Jakma Ground', shortDesc: 'Grand annual football tournament featuring 16 teams from across Okhaldhunga district.', status: 'upcoming', participants: 16 },
  { _id: '2', title: 'Youth Leadership Camp', category: 'community', date: '2024-03-20', location: 'Community Hall, Jakma', shortDesc: 'A 3-day leadership development camp for youth aged 15-25 from Manyavangyag.', status: 'past' },
  { _id: '3', title: 'Dashain Cultural Program', category: 'cultural', date: '2023-10-18', location: 'Jakma Village', shortDesc: 'Annual Dashain celebration with traditional dance, Deusi Bhailo, and community feast.', status: 'past' },
  { _id: '4', title: 'Summer Football Training Camp 2081', category: 'training', date: '2024-06-10', location: 'Jakma Football Ground', shortDesc: 'Intensive 2-week training camp for young players aged 10-18 years.', status: 'upcoming' },
  { _id: '5', title: 'Blood Donation Drive', category: 'community', date: '2023-08-05', location: 'Okhaldhunga Health Post', shortDesc: 'Community blood donation program organized in partnership with local health authorities.', status: 'past' },
  { _id: '6', title: 'Tihar Celebration & Mini Tournament', category: 'cultural', date: '2023-11-10', location: 'Jakma Ground', shortDesc: 'Festive football tournament during Tihar with cultural performances and Deusi program.', status: 'past' },
  { _id: '7', title: 'School Football League 2081', category: 'tournament', date: '2024-05-15', location: 'Various Schools, Okhaldhunga', shortDesc: 'Inter-school football league to encourage student athletes across the district.', status: 'upcoming' },
  { _id: '8', title: 'Community Cleaning Drive', category: 'community', date: '2024-01-05', location: 'Jakma Ward-6', shortDesc: 'Volunteer-led cleanliness initiative across Manyavangyag Gaun Palika-6.', status: 'past' },
];

const ProgramsPage = () => {
  const [programs, setPrograms] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/programs?limit=50').then(r => setPrograms(r.data.data || [])).catch(() => setPrograms(STATIC)).finally(() => setLoading(false));
  }, []);

  const list = (programs.length > 0 ? programs : STATIC).filter(p => filter === 'all' || p.category === filter);

  return (
    <div style={{ paddingTop: 'var(--navbar-h)' }}>
      <section style={{ background: 'linear-gradient(135deg,#7B0A1A,#C8102E)', padding: '56px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="section-tag" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>Activities & Events</span>
          <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, color: 'white', margin: '0.75rem 0 1rem' }}>Programs & Events</h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', maxWidth: '520px', margin: '0 auto' }}>
            All activities, tournaments, and community events organized by Fulbari Yuba Club Jakma
          </p>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--gray-50)' }}>
        <div className="container">
          {/* Filter tabs */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '2.5rem', background: 'white', padding: '8px', borderRadius: '12px', border: '1px solid var(--gray-200)', width: 'fit-content' }}>
            {CATS.map(c => (
              <button key={c.key} onClick={() => setFilter(c.key)} style={{
                padding: '8px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font)', fontWeight: 600, fontSize: '0.85rem',
                background: filter === c.key ? '#C8102E' : 'transparent',
                color: filter === c.key ? 'white' : 'var(--gray-600)',
                transition: 'all 0.2s'
              }}>
                {c.icon} {c.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="loading-center"><div className="spinner"></div></div>
          ) : list.length === 0 ? (
            <div className="empty-state"><span className="icon">📭</span><p>No programs found</p></div>
          ) : (
            <div className="grid-3">
              {list.map(p => {
                const cat = CAT_STYLE[p.category] || CAT_STYLE.other;
                const st = STATUS_STYLE[p.status] || STATUS_STYLE.past;
                const catLabel = CATS.find(c => c.key === p.category)?.label || p.category;
                return (
                  <div key={p._id} className="card">
                    <div style={{ height: '180px', background: 'linear-gradient(135deg,#FEF2F2,#FCE7E9)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                      {p.photos?.[0]?.url ? (
                        <img src={p.photos[0].url} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontSize: '4rem' }}>{EMOJI[p.category] || '📌'}</span>
                      )}
                      <span style={{ position: 'absolute', top: '12px', right: '12px', background: st.bg, color: st.color, fontSize: '0.7rem', fontWeight: 700, padding: '4px 10px', borderRadius: '20px' }}>{st.label}</span>
                    </div>
                    <div style={{ padding: '1.5rem' }}>
                      <span style={{ background: cat.bg, color: cat.color, fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: '20px' }}>{catLabel}</span>
                      <h3 style={{ marginTop: '0.75rem', fontWeight: 700, color: 'var(--gray-900)', lineHeight: 1.3, marginBottom: '0.6rem' }}>{p.title}</h3>
                      <p style={{ color: 'var(--gray-500)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1rem' }}>{p.shortDesc}</p>
                      <hr style={{ border: 'none', borderTop: '1px solid var(--gray-100)', marginBottom: '1rem' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--gray-400)' }}>
                        <span>📍 {p.location}</span>
                        <span>📅 {new Date(p.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                      </div>
                      {p.participants && <div style={{ marginTop: '6px', fontSize: '0.78rem', color: 'var(--gray-400)' }}>👥 {p.participants} participants</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProgramsPage;