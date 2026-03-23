// AwardsPage.js
import React, { useEffect, useState } from 'react';
import API from '../utils/api';

const STATIC_CERTS = [
  { _id: '1', icon: '🥈', title: 'District Football Championship – Runner Up', issuer: 'ANFA Okhaldhunga District', yearBS: '2079 BS', description: 'Runner-up position in the district football championship.' },
  { _id: '2', icon: '🏅', title: 'Community Service Award', issuer: 'Manyavangyag Gaun Palika', yearBS: '2080 BS', description: 'Awarded for outstanding community service in Okhaldhunga.' },
  { _id: '3', icon: '🏆', title: 'Best Youth Club Award', issuer: 'District Sports Council, Okhaldhunga', yearBS: '2078 BS', description: 'Best performing youth club in Okhaldhunga district.' },
  { _id: '4', icon: '📜', title: 'Certificate of Registration', issuer: 'ANFA Nepal', yearBS: '2058 BS', description: 'Official ANFA Nepal registration and affiliation certificate.' },
  { _id: '5', icon: '🥇', title: 'Inter-District Tournament Winner', issuer: 'Sagarmatha Zone Football Association', yearBS: '2077 BS', description: 'Champions of the inter-district football tournament.' },
  { _id: '6', icon: '🌳', title: 'Environmental Protection Certificate', issuer: 'Okhaldhunga District Committee', yearBS: '2079 BS', description: 'Awarded for green initiative and cleanliness programs.' },
];

export const AwardsPage = () => {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    API.get('/certificates').then(r => setCerts(r.data.data || [])).catch(() => setCerts(STATIC_CERTS)).finally(() => setLoading(false));
  }, []);
  const list = certs.length > 0 ? certs : STATIC_CERTS;

  return (
    <div style={{ paddingTop: 'var(--navbar-h)' }}>
      <section style={{ background: 'linear-gradient(135deg,#7B0A1A,#C8102E)', padding: '56px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="section-tag" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>Achievements</span>
          <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, color: 'white', margin: '0.75rem 0' }}>Awards & Certificates</h1>
          <p style={{ color: 'rgba(255,255,255,0.75)' }}>Recognition and achievements earned by Fulbari Yuba Club Jakma</p>
        </div>
      </section>
      <section className="section" style={{ background: 'var(--gray-50)' }}>
        <div className="container">
          {loading ? <div className="loading-center"><div className="spinner"></div></div> : (
            <div className="grid-3">
              {list.map(c => (
                <div key={c._id} className="card" style={{ padding: '2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg,#C8102E,#E8304A)' }} />
                  {c.image?.url ? (
                    <img src={c.image.url} alt={c.title} style={{ width: '80px', height: '80px', objectFit: 'contain', marginBottom: '1rem' }} />
                  ) : (
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{c.icon}</div>
                  )}
                  <h3 style={{ fontWeight: 700, color: 'var(--gray-900)', marginBottom: '0.5rem', lineHeight: 1.3 }}>{c.title}</h3>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>{c.issuer}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--gray-400)', marginBottom: '0.75rem' }}>{c.yearBS || c.yearAD}</div>
                  {c.description && <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', lineHeight: 1.6 }}>{c.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
